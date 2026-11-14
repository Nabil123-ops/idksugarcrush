import { useCallback, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { GameCanvas, GameCanvasHandle } from './components/GameCanvas';
import {
  BOOSTER_COST,
  BottomBoosterBar,
  DesktopSideHUD,
  TopGameHUD,
} from './components/GameHUD';
import {
  DeluxeBundleId,
  EventsModal,
  GameOverModal,
  HowToPlayModal,
  LevelsQuickModal,
  PauseModal,
  PreLevelModal,
  ProfileSaveModal,
  SettingsModal,
  ShopModal,
  VictoryModal,
} from './components/Modals';
import { SagaMap } from './components/SagaMap';
import { OfflineIndicator } from './components/PWAInstallButton';
import { TitleScreen } from './components/TitleScreen';
import {
  generateEndlessLevel,
  getLevelById,
  LEVELS,
  ZONES,
} from './data/levels';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { audioEngine } from './game/AudioEngine';
import {
  AvatarId,
  GameHUDState,
  InGameBoosterType,
  LevelDefinition,
  PlayerProgress,
  PreBoosterType,
  ScreenState,
} from './types/game';

const STORAGE_KEY = 'sugar_crush_progress_v4';

const DEFAULT_PROGRESS: PlayerProgress = {
  playerName: 'Alex',
  avatarId: 'princess',
  lives: 5,
  xp: 0,
  unlockedLevel: 1,
  levelStars: {},
  levelHighScores: {},
  coins: 1250,
  boosters: {
    hammer: 3,
    free_switch: 2,
    color_bomb: 1,
    cross_wand: 1,
    sugar_shuffle: 1,
  },
  preBoosters: {
    striped_wrapped: 1,
    color_bomb: 1,
    extra_moves: 1,
    golden_crown: 1,
  },
  soundEnabled: true,
  musicEnabled: true,
  endlessBestWave: 0,
  endlessBestScore: 0,
  claimedRewards: [],
};

function loadProgress(): PlayerProgress {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem('sugar_crush_progress_v3') ||
      localStorage.getItem('sugar_crush_progress_v2');
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      lives: Math.max(0, Math.min(5, Math.round(parsed.lives ?? DEFAULT_PROGRESS.lives))),
      unlockedLevel: Math.max(
        1,
        Math.min(LEVELS.length, Math.round(parsed.unlockedLevel ?? DEFAULT_PROGRESS.unlockedLevel))
      ),
      boosters: { ...DEFAULT_PROGRESS.boosters, ...(parsed.boosters ?? {}) },
      preBoosters: { ...DEFAULT_PROGRESS.preBoosters, ...(parsed.preBoosters ?? {}) },
      claimedRewards: Array.isArray(parsed.claimedRewards) ? parsed.claimedRewards : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

const PRE_BOOSTER_COST: Record<PreBoosterType, number> = {
  striped_wrapped: 70,
  color_bomb: 90,
  extra_moves: 50,
  golden_crown: 100,
};

function buildFirestorePayload(p: PlayerProgress) {
  const clampInt = (n: number, min = 0, max = 10000000) =>
    Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : min)));

  const cleanStars: Record<string, number> = {};
  for (const [k, v] of Object.entries(p.levelStars)) {
    cleanStars[String(k)] = clampInt(v, 0, 3);
  }
  const cleanHighs: Record<string, number> = {};
  for (const [k, v] of Object.entries(p.levelHighScores)) {
    cleanHighs[String(k)] = clampInt(v, 0, 10000000);
  }

  return {
    playerName: (p.playerName || 'Alex').trim().slice(0, 32) || 'Alex',
    avatarId: p.avatarId,
    lives: clampInt(p.lives, 0, 5),
    xp: clampInt(p.xp, 0),
    unlockedLevel: clampInt(p.unlockedLevel, 1, LEVELS.length),
    coins: clampInt(p.coins, 0, 10000000),
    levelStars: cleanStars,
    levelHighScores: cleanHighs,
    boosters: {
      hammer: clampInt(p.boosters.hammer, 0),
      free_switch: clampInt(p.boosters.free_switch, 0),
      color_bomb: clampInt(p.boosters.color_bomb, 0),
      cross_wand: clampInt(p.boosters.cross_wand, 0),
      sugar_shuffle: clampInt(p.boosters.sugar_shuffle, 0),
    },
    preBoosters: {
      striped_wrapped: clampInt(p.preBoosters.striped_wrapped, 0),
      color_bomb: clampInt(p.preBoosters.color_bomb, 0),
      extra_moves: clampInt(p.preBoosters.extra_moves, 0),
      golden_crown: clampInt(p.preBoosters.golden_crown, 0),
    },
    soundEnabled: Boolean(p.soundEnabled),
    musicEnabled: Boolean(p.musicEnabled),
    endlessBestWave: clampInt(p.endlessBestWave, 0),
    endlessBestScore: clampInt(p.endlessBestScore, 0),
    claimedRewards: p.claimedRewards.slice(0, 30),
  };
}

function mergeProgress(local: PlayerProgress, remote: Partial<PlayerProgress>): PlayerProgress {
  const mergedStars: Record<number, number> = { ...local.levelStars };
  if (remote.levelStars) {
    for (const [k, v] of Object.entries(remote.levelStars)) {
      const id = Number(k);
      if (Number.isFinite(id)) {
        mergedStars[id] = Math.max(mergedStars[id] ?? 0, Number(v) || 0);
      }
    }
  }

  const mergedScores: Record<number, number> = { ...local.levelHighScores };
  if (remote.levelHighScores) {
    for (const [k, v] of Object.entries(remote.levelHighScores)) {
      const id = Number(k);
      if (Number.isFinite(id)) {
        mergedScores[id] = Math.max(mergedScores[id] ?? 0, Number(v) || 0);
      }
    }
  }

  const claimedSet = new Set([
    ...(local.claimedRewards ?? []),
    ...(Array.isArray(remote.claimedRewards) ? remote.claimedRewards : []),
  ]);

  return {
    ...local,
    playerName:
      local.playerName === 'Alex' && remote.playerName ? remote.playerName : local.playerName,
    avatarId: remote.avatarId ?? local.avatarId,
    lives: Math.max(local.lives, remote.lives ?? 0),
    xp: Math.max(local.xp, remote.xp ?? 0),
    unlockedLevel: Math.min(
      LEVELS.length,
      Math.max(local.unlockedLevel, remote.unlockedLevel ?? 1)
    ),
    coins: Math.max(local.coins, remote.coins ?? 0),
    levelStars: mergedStars,
    levelHighScores: mergedScores,
    boosters: {
      hammer: Math.max(local.boosters.hammer, remote.boosters?.hammer ?? 0),
      free_switch: Math.max(local.boosters.free_switch, remote.boosters?.free_switch ?? 0),
      color_bomb: Math.max(local.boosters.color_bomb, remote.boosters?.color_bomb ?? 0),
      cross_wand: Math.max(local.boosters.cross_wand, remote.boosters?.cross_wand ?? 0),
      sugar_shuffle: Math.max(local.boosters.sugar_shuffle, remote.boosters?.sugar_shuffle ?? 0),
    },
    preBoosters: {
      striped_wrapped: Math.max(
        local.preBoosters.striped_wrapped,
        remote.preBoosters?.striped_wrapped ?? 0
      ),
      color_bomb: Math.max(local.preBoosters.color_bomb, remote.preBoosters?.color_bomb ?? 0),
      extra_moves: Math.max(local.preBoosters.extra_moves, remote.preBoosters?.extra_moves ?? 0),
      golden_crown: Math.max(
        local.preBoosters.golden_crown,
        remote.preBoosters?.golden_crown ?? 0
      ),
    },
    endlessBestWave: Math.max(local.endlessBestWave, remote.endlessBestWave ?? 0),
    endlessBestScore: Math.max(local.endlessBestScore, remote.endlessBestScore ?? 0),
    claimedRewards: Array.from(claimedSet).slice(0, 30),
  };
}

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);
  const [screen, setScreen] = useState<ScreenState>('TITLE_MENU');

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [cloudDocExists, setCloudDocExists] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>(
    'idle'
  );
  const [authError, setAuthError] = useState<string | null>(null);

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showLevelsQuick, setShowLevelsQuick] = useState(false);
  const [preLevelTarget, setPreLevelTarget] = useState<LevelDefinition | null>(null);

  const [activeLevel, setActiveLevel] = useState<LevelDefinition>(() => getLevelById(1));
  const [activePreBoosters, setActivePreBoosters] = useState<PreBoosterType[]>([]);
  const [activeBooster, setActiveBooster] = useState<InGameBoosterType | null>(null);
  const [restartKey, setRestartKey] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [victoryResult, setVictoryResult] = useState<{
    score: number;
    stars: number;
    coinsEarned: number;
  } | null>(null);
  const [gameOverScore, setGameOverScore] = useState<number | null>(null);

  const [hud, setHud] = useState<GameHUDState | null>(null);
  const canvasRef = useRef<GameCanvasHandle | null>(null);
  const progressRef = useRef<PlayerProgress>(progress);
  progressRef.current = progress;

  // Persist locally & update audio settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
    audioEngine.setSettings(progress.soundEnabled, progress.musicEnabled);
  }, [progress]);

  // Passive heart recovery (+1 heart every 3 minutes when below 5)
  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => (p.lives < 5 ? { ...p, lives: p.lives + 1 } : p));
    }, 180_000);
    return () => clearInterval(id);
  }, []);

  const syncProgressToCloud = useCallback(
    async (user: User, data: PlayerProgress, docExistsHint: boolean) => {
      if (!user.emailVerified) return;
      const path = `users/${user.uid}`;
      const ref = doc(db, 'users', user.uid);
      setCloudSyncStatus('syncing');
      try {
        const payload = buildFirestorePayload(data);
        if (docExistsHint) {
          await updateDoc(ref, {
            ...payload,
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(ref, {
            ownerId: user.uid,
            ...payload,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setCloudDocExists(true);
        }
        setCloudSyncStatus('synced');
      } catch (err) {
        setCloudSyncStatus('error');
        try {
          handleFirestoreError(err, docExistsHint ? OperationType.UPDATE : OperationType.CREATE, path);
        } catch {
          // Logged via handleFirestoreError
        }
      }
    },
    []
  );

  // Firebase Auth listener & initial cloud load/merge (with seamless v3->v4 schema migration)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setAuthError(null);
      if (!user) {
        setCloudDocExists(false);
        setCloudSyncStatus('idle');
        return;
      }

      if (!user.emailVerified) {
        setAuthError('Please use a verified Google account to sync cloud saves.');
        return;
      }

      const path = `users/${user.uid}`;
      const ref = doc(db, 'users', user.uid);
      setCloudSyncStatus('syncing');
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCloudDocExists(true);
          const rawData = snap.data() as Record<string, unknown>;
          const remote = rawData as Partial<PlayerProgress>;
          const merged = mergeProgress(progressRef.current, remote);
          setProgress(merged);

          const needsSchemaMigration =
            'adViews' in rawData ||
            'adEstimatedRevenueCents' in rawData ||
            !(remote.boosters && 'cross_wand' in remote.boosters) ||
            !(remote.preBoosters && 'golden_crown' in remote.preBoosters);

          if (needsSchemaMigration) {
            await setDoc(ref, {
              ownerId: user.uid,
              ...buildFirestorePayload(merged),
              createdAt: rawData.createdAt ?? serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } else {
            await updateDoc(ref, {
              ...buildFirestorePayload(merged),
              updatedAt: serverTimestamp(),
            });
          }
        } else {
          setCloudDocExists(false);
          const initialName =
            progressRef.current.playerName === 'Alex' && user.displayName
              ? user.displayName.split(' ')[0].slice(0, 20)
              : progressRef.current.playerName;
          const nextProg = { ...progressRef.current, playerName: initialName };
          setProgress(nextProg);
          await setDoc(ref, {
            ownerId: user.uid,
            ...buildFirestorePayload(nextProg),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setCloudDocExists(true);
        }
        setCloudSyncStatus('synced');
      } catch (err) {
        setCloudSyncStatus('error');
        try {
          handleFirestoreError(err, OperationType.GET, path);
        } catch {
          // Logged via handleFirestoreError
        }
      }
    });
    return () => unsub();
  }, []);

  // Debounced auto-sync to Firestore whenever progress updates while signed in
  useEffect(() => {
    if (!authUser || !authUser.emailVerified) return;
    const timer = window.setTimeout(() => {
      syncProgressToCloud(authUser, progress, cloudDocExists);
    }, 1200);
    return () => clearTimeout(timer);
  }, [authUser, progress, cloudDocExists, syncProgressToCloud]);

  const handleGoogleSignIn = async () => {
    audioEngine.unlock();
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      audioEngine.playPurchase();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In cancelled or blocked.';
      setAuthError(msg);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
      setCloudDocExists(false);
      setCloudSyncStatus('idle');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign out failed.');
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showHowToPlay) setShowHowToPlay(false);
        else if (showSettings) setShowSettings(false);
        else if (showProfile) setShowProfile(false);
        else if (showShop) setShowShop(false);
        else if (showEvents) setShowEvents(false);
        else if (showLevelsQuick) setShowLevelsQuick(false);
        else if (preLevelTarget) setPreLevelTarget(null);
        else if (screen === 'PLAYING' && !victoryResult && gameOverScore === null) {
          if (activeBooster) setActiveBooster(null);
          else setIsPaused((p) => !p);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    screen,
    showHowToPlay,
    showSettings,
    showProfile,
    showShop,
    showEvents,
    showLevelsQuick,
    preLevelTarget,
    victoryResult,
    gameOverScore,
    activeBooster,
  ]);

  const toggleSound = () => {
    audioEngine.unlock();
    setProgress((p) => ({ ...p, soundEnabled: !p.soundEnabled }));
  };

  const toggleMusic = () => {
    audioEngine.unlock();
    setProgress((p) => ({ ...p, musicEnabled: !p.musicEnabled }));
  };

  const toggleBothAudio = () => {
    audioEngine.unlock();
    setProgress((p) => {
      const next = !(p.soundEnabled || p.musicEnabled);
      return { ...p, soundEnabled: next, musicEnabled: next };
    });
  };

  const startLevel = (level: LevelDefinition, selectedPreBoosters: PreBoosterType[]) => {
    audioEngine.unlock();
    if (selectedPreBoosters.length > 0) {
      setProgress((prev) => {
        const nextPre = { ...prev.preBoosters };
        let nextCoins = prev.coins;
        for (const b of selectedPreBoosters) {
          if (nextPre[b] > 0) {
            nextPre[b]--;
          } else {
            nextCoins = Math.max(0, nextCoins - PRE_BOOSTER_COST[b]);
          }
        }
        return { ...prev, preBoosters: nextPre, coins: nextCoins };
      });
    }

    setPreLevelTarget(null);
    setShowLevelsQuick(false);
    setShowEvents(false);
    setActiveLevel(level);
    setActivePreBoosters(selectedPreBoosters);
    setActiveBooster(null);
    setIsPaused(false);
    setVictoryResult(null);
    setGameOverScore(null);
    setRestartKey((k) => k + 1);
    setScreen('PLAYING');
  };

  const handleConsumeInGameBooster = useCallback((type: InGameBoosterType) => {
    setProgress((prev) => {
      if (prev.boosters[type] > 0) {
        return {
          ...prev,
          boosters: { ...prev.boosters, [type]: prev.boosters[type] - 1 },
        };
      }
      return {
        ...prev,
        coins: Math.max(0, prev.coins - BOOSTER_COST[type]),
      };
    });
    setActiveBooster(null);
  }, []);

  const handleSelectInGameBooster = (type: InGameBoosterType) => {
    audioEngine.unlock();
    const canAfford = progress.boosters[type] > 0 || progress.coins >= BOOSTER_COST[type];
    if (!canAfford) return;

    if (type === 'sugar_shuffle') {
      if (canvasRef.current?.triggerSugarShuffle()) {
        handleConsumeInGameBooster('sugar_shuffle');
      }
      return;
    }

    setActiveBooster(type);
  };

  const handleLevelWin = useCallback(
    (score: number, stars: number) => {
      const difficultyBonus =
        activeLevel.difficulty === 'super_hard'
          ? 45
          : activeLevel.difficulty === 'hard'
            ? 25
            : 0;
      const coinsEarned = 35 + stars * 20 + difficultyBonus + (activeLevel.isEndless ? 25 : 0);
      const xpEarned = 25 * stars + 20;
      setVictoryResult({ score, stars, coinsEarned });

      setProgress((prev) => {
        if (activeLevel.isEndless) {
          const wave = activeLevel.endlessWave ?? 1;
          return {
            ...prev,
            xp: prev.xp + xpEarned,
            coins: prev.coins + coinsEarned,
            endlessBestWave: Math.max(prev.endlessBestWave, wave),
            endlessBestScore: Math.max(prev.endlessBestScore, score),
          };
        }

        const prevStars = prev.levelStars[activeLevel.id] ?? 0;
        const prevHigh = prev.levelHighScores[activeLevel.id] ?? 0;
        const nextUnlocked = Math.min(
          LEVELS.length,
          Math.max(prev.unlockedLevel, activeLevel.id + 1)
        );
        const bonusHammer = stars === 3 && prevStars < 3 ? 1 : 0;

        return {
          ...prev,
          xp: prev.xp + xpEarned,
          unlockedLevel: nextUnlocked,
          levelStars: {
            ...prev.levelStars,
            [activeLevel.id]: Math.max(prevStars, stars),
          },
          levelHighScores: {
            ...prev.levelHighScores,
            [activeLevel.id]: Math.max(prevHigh, score),
          },
          coins: prev.coins + coinsEarned,
          boosters: {
            ...prev.boosters,
            hammer: prev.boosters.hammer + bonusHammer,
          },
        };
      });
    },
    [activeLevel]
  );

  const handleLevelLose = useCallback((score: number) => {
    setGameOverScore(score);
    setProgress((p) => ({ ...p, lives: Math.max(0, p.lives - 1) }));
  }, []);

  const handleContinueCoins = () => {
    if (progress.coins < 100) return;
    audioEngine.playPurchase();
    setProgress((p) => ({ ...p, coins: p.coins - 100 }));
    setGameOverScore(null);
    if (activeLevel.timeLimitSec) {
      canvasRef.current?.addExtraTime(25);
    } else {
      canvasRef.current?.addExtraMoves(5);
    }
  };

  const handleBuyBundle = (bundleId: DeluxeBundleId, cost: number) => {
    if (progress.coins < cost) return;
    audioEngine.playPurchase();
    setProgress((p) => {
      if (bundleId === 'starter_pack') {
        return {
          ...p,
          coins: p.coins - cost,
          boosters: {
            ...p.boosters,
            hammer: p.boosters.hammer + 2,
            free_switch: p.boosters.free_switch + 2,
            color_bomb: p.boosters.color_bomb + 1,
            sugar_shuffle: p.boosters.sugar_shuffle + 1,
          },
        };
      }
      if (bundleId === 'blitz_kit') {
        return {
          ...p,
          coins: p.coins - cost,
          lives: 5,
          boosters: {
            ...p.boosters,
            cross_wand: p.boosters.cross_wand + 1,
          },
          preBoosters: {
            ...p.preBoosters,
            extra_moves: p.preBoosters.extra_moves + 3,
            striped_wrapped: p.preBoosters.striped_wrapped + 2,
          },
        };
      }
      if (bundleId === 'royal_chest') {
        return {
          ...p,
          coins: p.coins - cost,
          boosters: {
            ...p.boosters,
            hammer: p.boosters.hammer + 4,
            free_switch: p.boosters.free_switch + 3,
            color_bomb: p.boosters.color_bomb + 3,
            cross_wand: p.boosters.cross_wand + 2,
          },
          preBoosters: {
            ...p.preBoosters,
            golden_crown: p.preBoosters.golden_crown + 2,
          },
        };
      }
      return {
        ...p,
        coins: p.coins - cost,
        boosters: {
          hammer: p.boosters.hammer + 6,
          free_switch: p.boosters.free_switch + 5,
          color_bomb: p.boosters.color_bomb + 4,
          cross_wand: p.boosters.cross_wand + 4,
          sugar_shuffle: p.boosters.sugar_shuffle + 4,
        },
        preBoosters: {
          ...p.preBoosters,
          golden_crown: p.preBoosters.golden_crown + 3,
        },
      };
    });
  };

  const activeZone = ZONES.find((z) => z.id === activeLevel.zone) ?? ZONES[0];
  const totalStars = Object.values(progress.levelStars).reduce((a, b) => a + b, 0);
  const anyModalOpen =
    showHowToPlay ||
    showSettings ||
    showProfile ||
    showShop ||
    showEvents ||
    showLevelsQuick ||
    preLevelTarget !== null ||
    isPaused ||
    victoryResult !== null ||
    gameOverScore !== null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex flex-col">
      {screen === 'TITLE_MENU' && (
        <TitleScreen
          soundEnabled={progress.soundEnabled}
          musicEnabled={progress.musicEnabled}
          signedInEmail={authUser?.email ?? null}
          playerName={progress.playerName}
          unlockedLevel={progress.unlockedLevel}
          totalStars={totalStars}
          onPlay={() => {
            audioEngine.unlock();
            setScreen('SAGA_MAP');
          }}
          onOpenSaveProfile={() => {
            audioEngine.unlock();
            setShowProfile(true);
          }}
          onOpenSettings={() => {
            audioEngine.unlock();
            setShowSettings(true);
          }}
          onToggleAudio={toggleBothAudio}
        />
      )}

      {screen === 'SAGA_MAP' && (
        <SagaMap
          progress={progress}
          onSelectLevel={(lvl) => setPreLevelTarget(lvl)}
          onPlayFrontier={() => setPreLevelTarget(getLevelById(progress.unlockedLevel))}
          onOpenShop={() => setShowShop(true)}
          onOpenEvents={() => setShowEvents(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenLevelsList={() => setShowLevelsQuick(true)}
        />
      )}

      {screen === 'PLAYING' && (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
          {/* Painted Zone Backdrop behind translucent frosted board */}
          <img
            src={activeZone.backdropUrl}
            alt={activeZone.name}
            referrerPolicy="no-referrer"
            style={activeZone.backdropFilter ? { filter: activeZone.backdropFilter } : undefined}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/15 via-transparent to-purple-950/35 pointer-events-none" />

          {/* Mobile & Tablet Top HUD (< lg) */}
          {hud && <TopGameHUD hud={hud} onPause={() => setIsPaused(true)} />}

          {/* Main Stage: Desktop Left Command HUD + Responsive Centered Board */}
          <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto flex items-center justify-center lg:gap-8 px-1.5 sm:px-4 py-1 overflow-hidden">
            {hud && <DesktopSideHUD hud={hud} onPause={() => setIsPaused(true)} />}

            <div className="flex-1 h-full flex items-center justify-center min-w-0">
              <GameCanvas
                ref={canvasRef}
                level={activeLevel}
                activePreBoosters={activePreBoosters}
                activeBooster={activeBooster}
                isPaused={anyModalOpen}
                restartKey={restartKey}
                onConsumeBooster={handleConsumeInGameBooster}
                onCancelBooster={() => setActiveBooster(null)}
                onHudUpdate={setHud}
                onLevelWin={handleLevelWin}
                onLevelLose={handleLevelLose}
              />
            </div>
          </main>

          <BottomBoosterBar
            progress={progress}
            activeBooster={activeBooster}
            disabled={Boolean(hud?.isBusy || hud?.isSugarCrush || anyModalOpen)}
            onSelectBooster={handleSelectInGameBooster}
            onCancelBooster={() => setActiveBooster(null)}
            onOpenShop={() => setShowShop(true)}
            onExitToLevels={() => setScreen('SAGA_MAP')}
            onOpenEvents={() => setShowEvents(true)}
          />
        </div>
      )}

      {/* Modals */}
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}

      {showSettings && (
        <SettingsModal
          progress={progress}
          onToggleSound={toggleSound}
          onToggleMusic={toggleMusic}
          onOpenHowToPlay={() => {
            setShowSettings(false);
            setShowHowToPlay(true);
          }}
          onResetProgress={() => {
            setProgress(DEFAULT_PROGRESS);
            setScreen('TITLE_MENU');
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showProfile && (
        <ProfileSaveModal
          progress={progress}
          authUser={
            authUser
              ? {
                  uid: authUser.uid,
                  email: authUser.email,
                  displayName: authUser.displayName,
                }
              : null
          }
          cloudSyncStatus={cloudSyncStatus}
          authError={authError}
          onGoogleSignIn={handleGoogleSignIn}
          onGoogleSignOut={handleGoogleSignOut}
          onSyncNow={() => {
            if (authUser) syncProgressToCloud(authUser, progress, cloudDocExists);
          }}
          onSaveProfile={(playerName: string, avatarId: AvatarId) =>
            setProgress((p) => ({ ...p, playerName, avatarId }))
          }
          onClose={() => setShowProfile(false)}
        />
      )}

      {showShop && (
        <ShopModal
          progress={progress}
          onBuyBooster={(type, cost) => {
            if (progress.coins < cost) return;
            audioEngine.playPurchase();
            setProgress((p) => ({
              ...p,
              coins: p.coins - cost,
              boosters: { ...p.boosters, [type]: p.boosters[type] + 1 },
            }));
          }}
          onBuyPreBooster={(type, cost) => {
            if (progress.coins < cost) return;
            audioEngine.playPurchase();
            setProgress((p) => ({
              ...p,
              coins: p.coins - cost,
              preBoosters: { ...p.preBoosters, [type]: p.preBoosters[type] + 1 },
            }));
          }}
          onBuyBundle={handleBuyBundle}
          onRefillHearts={() => {
            if (progress.coins < 80 || progress.lives >= 5) return;
            audioEngine.playPurchase();
            setProgress((p) => ({ ...p, coins: p.coins - 80, lives: 5 }));
          }}
          onClose={() => setShowShop(false)}
        />
      )}

      {showEvents && (
        <EventsModal
          progress={progress}
          onPlayEndless={() => {
            setShowEvents(false);
            const nextWave = Math.max(1, progress.endlessBestWave + 1);
            setPreLevelTarget(generateEndlessLevel(nextWave));
          }}
          onClaimStarReward={(rewardId, coins) => {
            if (progress.claimedRewards.includes(rewardId)) return;
            audioEngine.playStarEarned(2);
            setProgress((p) => ({
              ...p,
              coins: p.coins + coins,
              claimedRewards: [...p.claimedRewards, rewardId],
            }));
          }}
          onClose={() => setShowEvents(false)}
        />
      )}

      {showLevelsQuick && (
        <LevelsQuickModal
          progress={progress}
          onSelectLevel={(lvl) => {
            setShowLevelsQuick(false);
            setPreLevelTarget(lvl);
          }}
          onClose={() => setShowLevelsQuick(false)}
        />
      )}

      {preLevelTarget && (
        <PreLevelModal
          level={preLevelTarget}
          progress={progress}
          onClose={() => setPreLevelTarget(null)}
          onStart={(selected) => startLevel(preLevelTarget, selected)}
        />
      )}

      {isPaused && screen === 'PLAYING' && (
        <PauseModal
          levelName={
            activeLevel.isEndless
              ? `Endless Wave ${activeLevel.endlessWave}`
              : `Level ${activeLevel.id}: ${activeLevel.name}`
          }
          soundEnabled={progress.soundEnabled}
          musicEnabled={progress.musicEnabled}
          onResume={() => setIsPaused(false)}
          onRestart={() => startLevel(activeLevel, [])}
          onExitToMap={() => {
            setIsPaused(false);
            setScreen('SAGA_MAP');
          }}
          onExitToTitle={() => {
            setIsPaused(false);
            setScreen('TITLE_MENU');
          }}
          onToggleSound={toggleSound}
          onToggleMusic={toggleMusic}
        />
      )}

      {victoryResult && (
        <VictoryModal
          level={activeLevel}
          score={victoryResult.score}
          stars={victoryResult.stars}
          coinsEarned={victoryResult.coinsEarned}
          hasNextLevel={activeLevel.isEndless || activeLevel.id < LEVELS.length}
          onNextLevel={() => {
            if (activeLevel.isEndless) {
              const nextWave = (activeLevel.endlessWave ?? 1) + 1;
              startLevel(generateEndlessLevel(nextWave), []);
            } else {
              const nextLvl = getLevelById(activeLevel.id + 1);
              setVictoryResult(null);
              setPreLevelTarget(nextLvl);
              setScreen('SAGA_MAP');
            }
          }}
          onReplay={() => startLevel(activeLevel, [])}
          onBackToMap={() => {
            setVictoryResult(null);
            setScreen('SAGA_MAP');
          }}
        />
      )}

      {gameOverScore !== null && (
        <GameOverModal
          level={activeLevel}
          score={gameOverScore}
          coins={progress.coins}
          onContinueCoins={handleContinueCoins}
          onRetry={() => startLevel(activeLevel, [])}
          onBackToMap={() => {
            setGameOverScore(null);
            setScreen('SAGA_MAP');
          }}
        />
      )}

      <OfflineIndicator />
    </div>
  );
}
