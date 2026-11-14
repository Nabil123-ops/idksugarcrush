import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Cloud,
  Crown,
  HelpCircle,
  Home,
  Infinity as InfinityIcon,
  Lock,
  LogIn,
  LogOut,
  Map,
  Music,
  Package,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { LEVELS, ZONES } from '../data/levels';
import {
  AvatarId,
  CandyColor,
  InGameBoosterType,
  LevelDefinition,
  LevelDifficulty,
  PlayerProgress,
  PreBoosterType,
} from '../types/game';
import {
  AvatarPortrait,
  CandyGlyph,
  CherryIcon,
  CoinIcon,
  ColorBombIcon,
  CrossWandIcon,
  FreeSwitchIcon,
  GoldenCrownPreIcon,
  GoldStarIcon,
  HazelnutIcon,
  HeartLivesIcon,
  JellyIcon,
  LollipopHammerIcon,
  SugarShuffleIcon,
} from './CandyIcons';
import { PWAInstallButton } from './PWAInstallButton';

const DIFFICULTY_BADGE: Record<
  LevelDifficulty,
  { label: string; cls: string }
> = {
  easy: { label: 'EASY', cls: 'bg-emerald-500 text-white' },
  medium: { label: 'MEDIUM', cls: 'bg-sky-500 text-white' },
  hard: { label: 'HARD', cls: 'bg-rose-600 text-white' },
  super_hard: { label: 'SUPER HARD', cls: 'bg-purple-800 text-amber-300 border border-amber-300' },
};

// ==================== PRE-LEVEL MODAL ====================
interface PreLevelModalProps {
  level: LevelDefinition;
  progress: PlayerProgress;
  onClose: () => void;
  onStart: (selectedPreBoosters: PreBoosterType[]) => void;
}

const PRE_BOOSTER_INFO: Array<{
  id: PreBoosterType;
  label: string;
  cost: number;
  icon: React.ReactNode;
}> = [
  {
    id: 'striped_wrapped',
    label: 'Striped + Wrapped',
    cost: 70,
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
  },
  {
    id: 'color_bomb',
    label: 'Color Bomb',
    cost: 90,
    icon: <ColorBombIcon className="w-6 h-6" />,
  },
  {
    id: 'extra_moves',
    label: '+3 Moves / +15s',
    cost: 50,
    icon: <Clock className="w-6 h-6 text-sky-600" />,
  },
  {
    id: 'golden_crown',
    label: 'Royal Crown Blast',
    cost: 100,
    icon: <GoldenCrownPreIcon className="w-6 h-6" />,
  },
];

export const PreLevelModal: React.FC<PreLevelModalProps> = ({
  level,
  progress,
  onClose,
  onStart,
}) => {
  const [selected, setSelected] = useState<PreBoosterType[]>([]);
  const zoneMeta = ZONES.find((z) => z.id === level.zone) ?? ZONES[0];
  const bestStars = progress.levelStars[level.id] ?? 0;
  const diffMeta = DIFFICULTY_BADGE[level.difficulty];

  const totalCoinCost = selected.reduce((sum, b) => {
    const stash = progress.preBoosters[b] ?? 0;
    if (stash > 0) return sum;
    const info = PRE_BOOSTER_INFO.find((i) => i.id === b);
    return sum + (info?.cost ?? 0);
  }, 0);

  const toggleBooster = (id: PreBoosterType) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
      return;
    }
    const stash = progress.preBoosters[id] ?? 0;
    const cost = stash > 0 ? 0 : (PRE_BOOSTER_INFO.find((i) => i.id === id)?.cost ?? 0);
    if (totalCoinCost + cost <= progress.coins) {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/75">
      <div className="relative w-full max-w-[400px] sm:max-w-[460px] candy-panel-gold rounded-[30px] overflow-hidden text-purple-950">
        <div
          className={`px-5 py-3.5 bg-gradient-to-r ${zoneMeta.badgeBg} text-white flex items-center justify-between border-b-2 border-amber-300`}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200">
                {level.isEndless
                  ? `Endless Wave ${level.endlessWave}`
                  : `Map ${zoneMeta.chapterNumber}: ${zoneMeta.name} · Lvl ${level.id}`}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-display font-black ${diffMeta.cls}`}>
                {diffMeta.label}
              </span>
            </div>
            <h2 className="font-display font-black text-xl drop-shadow leading-tight">{level.name}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full bg-black/25 hover:bg-black/40 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 max-h-[82dvh] overflow-y-auto saga-scroll">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((s) => (
                <GoldStarIcon key={s} filled={bestStars >= s} className="w-5 h-5" />
              ))}
              {!level.isEndless && (
                <span className="ml-1.5 text-xs font-bold text-purple-800 tabular-nums">
                  Best: {(progress.levelHighScores[level.id] ?? 0).toLocaleString()}
                </span>
              )}
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-900 text-amber-300 font-display font-extrabold text-xs tabular-nums flex items-center gap-1">
              {level.timeLimitSec ? (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{level.timeLimitSec}s Blitz</span>
                </>
              ) : (
                <span>{level.moves} Moves</span>
              )}
            </span>
          </div>

          <div className="candy-inset-cream rounded-2xl p-3">
            <div className="text-[11px] font-display font-black uppercase tracking-wider text-purple-900 mb-2">
              Objectives
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {level.objectives.map((obj, i) => {
                if (obj.type === 'collect') {
                  return (Object.entries(obj.targets) as [CandyColor, number][]).map(([col, count]) => (
                    <div
                      key={`${i}-${col}`}
                      className="flex items-center gap-1.5 bg-white border border-purple-200 rounded-xl px-2.5 py-1.5 shadow-sm"
                    >
                      <CandyGlyph color={col} className="w-6 h-6" />
                      <span className="font-display font-black text-sm tabular-nums">{count}</span>
                    </div>
                  ));
                }
                if (obj.type === 'jelly') {
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-white border border-purple-200 rounded-xl px-3 py-1.5 shadow-sm"
                    >
                      <JellyIcon className="w-5 h-5" />
                      <span className="font-display font-black text-sm tabular-nums">{obj.target} Jelly</span>
                    </div>
                  );
                }
                if (obj.type === 'ingredients') {
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white border border-purple-200 rounded-xl px-3 py-1.5 shadow-sm"
                    >
                      {obj.cherries > 0 && (
                        <span className="flex items-center gap-1 font-display font-black text-sm tabular-nums">
                          <CherryIcon className="w-5 h-5" /> {obj.cherries}
                        </span>
                      )}
                      {obj.hazelnuts > 0 && (
                        <span className="flex items-center gap-1 font-display font-black text-sm tabular-nums">
                          <HazelnutIcon className="w-5 h-5" /> {obj.hazelnuts}
                        </span>
                      )}
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-white border border-purple-200 rounded-xl px-3 py-1.5 shadow-sm"
                  >
                    <GoldStarIcon filled className="w-5 h-5" />
                    <span className="font-display font-black text-sm tabular-nums">
                      {obj.target.toLocaleString()} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-display font-black uppercase tracking-wider text-purple-900">
                Pre-Game Boosters (4 Royal Picks)
              </span>
              <span className="flex items-center gap-1 text-xs font-extrabold text-amber-700 tabular-nums">
                <CoinIcon className="w-4 h-4" />
                {progress.coins.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRE_BOOSTER_INFO.map((b) => {
                const isSelected = selected.includes(b.id);
                const stash = progress.preBoosters[b.id] ?? 0;
                const affordable = isSelected || stash > 0 || totalCoinCost + b.cost <= progress.coins;
                return (
                  <button
                    key={b.id}
                    disabled={!affordable}
                    onClick={() => toggleBooster(b.id)}
                    className={`relative flex flex-col items-center text-center p-2 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 text-purple-950 shadow cursor-pointer'
                        : affordable
                          ? 'bg-white/90 hover:bg-white border-purple-200 text-purple-950 cursor-pointer'
                          : 'bg-purple-200/40 border-purple-200/40 text-purple-400 cursor-not-allowed'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-white shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <div className="mb-1">{b.icon}</div>
                    <span className="text-[10px] font-extrabold leading-tight mb-0.5">{b.label}</span>
                    <span className="text-[10px] font-extrabold text-rose-600 tabular-nums">
                      {stash > 0 ? `x${stash} Free` : `${b.cost}c`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs font-semibold text-purple-900/85 bg-white/70 rounded-xl px-3 py-2 border border-purple-200">
            {level.tip}
          </p>

          <button
            onClick={() => onStart(selected)}
            className="candy-btn-green w-full flex items-center justify-center gap-2 py-3 rounded-full font-display font-black text-2xl text-white text-outline-green transition-transform active:scale-95 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>{totalCoinCost > 0 ? `PLAY (${totalCoinCost}c)` : 'PLAY'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== ULTRA-DELUXE SHOP MODAL ====================
export type DeluxeBundleId = 'starter_pack' | 'blitz_kit' | 'royal_chest' | 'emperor_vault';

export const ShopModal: React.FC<{
  progress: PlayerProgress;
  onBuyBooster: (type: InGameBoosterType, cost: number) => void;
  onBuyPreBooster: (type: PreBoosterType, cost: number) => void;
  onBuyBundle: (bundleId: DeluxeBundleId, cost: number) => void;
  onRefillHearts: () => void;
  onClose: () => void;
}> = ({
  progress,
  onBuyBooster,
  onBuyPreBooster,
  onBuyBundle,
  onRefillHearts,
  onClose,
}) => {
  const [tab, setTab] = useState<'boosters' | 'bundles'>('boosters');

  const items: Array<{
    key: string;
    name: string;
    desc: string;
    cost: number;
    owned: number;
    icon: React.ReactNode;
    onBuy: () => void;
  }> = [
    {
      key: 'hammer',
      name: 'Lollipop Hammer',
      desc: 'Smash any 1 tile or blocker',
      cost: 60,
      owned: progress.boosters.hammer,
      icon: <LollipopHammerIcon className="w-9 h-9" />,
      onBuy: () => onBuyBooster('hammer', 60),
    },
    {
      key: 'free_switch',
      name: 'Free Switch',
      desc: 'Swap any 2 adjacent candies',
      cost: 50,
      owned: progress.boosters.free_switch,
      icon: <FreeSwitchIcon className="w-9 h-9" />,
      onBuy: () => onBuyBooster('free_switch', 50),
    },
    {
      key: 'color_bomb',
      name: 'Rainbow Bomb',
      desc: 'Upgrade a candy into a Color Bomb',
      cost: 90,
      owned: progress.boosters.color_bomb,
      icon: <ColorBombIcon className="w-9 h-9" />,
      onBuy: () => onBuyBooster('color_bomb', 90),
    },
    {
      key: 'cross_wand',
      name: 'Royal Cross Wand',
      desc: 'Blast an entire row & column at once',
      cost: 110,
      owned: progress.boosters.cross_wand,
      icon: <CrossWandIcon className="w-9 h-9" />,
      onBuy: () => onBuyBooster('cross_wand', 110),
    },
    {
      key: 'sugar_shuffle',
      name: 'Whirlwind Shuffle',
      desc: 'Reshuffle board & forge 2 specials',
      cost: 75,
      owned: progress.boosters.sugar_shuffle,
      icon: <SugarShuffleIcon className="w-9 h-9" />,
      onBuy: () => onBuyBooster('sugar_shuffle', 75),
    },
    {
      key: 'pre_sw',
      name: 'Striped + Wrapped',
      desc: 'Pre-game double special starter',
      cost: 70,
      owned: progress.preBoosters.striped_wrapped,
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      onBuy: () => onBuyPreBooster('striped_wrapped', 70),
    },
    {
      key: 'pre_cb',
      name: 'Pre-Game Color Bomb',
      desc: 'Start level with a Color Bomb on board',
      cost: 90,
      owned: progress.preBoosters.color_bomb,
      icon: <ColorBombIcon className="w-8 h-8" />,
      onBuy: () => onBuyPreBooster('color_bomb', 90),
    },
    {
      key: 'pre_em',
      name: '+3 Moves / +15s Time',
      desc: 'Pre-game extra moves & blitz seconds',
      cost: 50,
      owned: progress.preBoosters.extra_moves,
      icon: <Clock className="w-8 h-8 text-sky-600" />,
      onBuy: () => onBuyPreBooster('extra_moves', 50),
    },
    {
      key: 'pre_crown',
      name: 'Royal Crown Blast',
      desc: 'Start with 2 Wrapped + 1 Striped candies',
      cost: 100,
      owned: progress.preBoosters.golden_crown,
      icon: <GoldenCrownPreIcon className="w-8 h-8" />,
      onBuy: () => onBuyPreBooster('golden_crown', 100),
    },
  ];

  const bundles: Array<{
    id: DeluxeBundleId;
    name: string;
    tag: string;
    contents: string;
    cost: number;
    gradient: string;
  }> = [
    {
      id: 'starter_pack',
      name: 'Sweet Starter Bundle',
      tag: 'SAVE 25%',
      contents: '2x Hammer · 2x Switch · 1x Rainbow · 1x Whirlwind',
      cost: 220,
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      id: 'blitz_kit',
      name: 'Timed Blitz Kit',
      tag: 'POPULAR',
      contents: '3x +3 Moves/+15s · 2x Striped+Wrapped · 1x Cross Wand · Full Hearts',
      cost: 260,
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      id: 'royal_chest',
      name: 'Royal Crown Ultra Chest',
      tag: 'BEST VALUE',
      contents: '4x Hammer · 3x Switch · 3x Rainbow · 2x Cross Wand · 2x Crown Blast',
      cost: 580,
      gradient: 'from-fuchsia-600 via-purple-700 to-indigo-800',
    },
    {
      id: 'emperor_vault',
      name: 'Imperial 360-Saga Vault',
      tag: 'PRO DELUXE',
      contents: '6x Hammer · 5x Switch · 4x Rainbow · 4x Cross Wand · 4x Whirlwind · 3x Crown Blast',
      cost: 950,
      gradient: 'from-indigo-700 via-purple-800 to-rose-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-purple-950/78">
      <div className="w-full max-w-[440px] sm:max-w-[580px] candy-panel-gold rounded-[30px] overflow-hidden text-purple-950">
        <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-between border-b-2 border-amber-200">
          <h2 className="font-display font-black text-xl sm:text-2xl text-outline-plum">
            Royal Deluxe Shop
          </h2>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-purple-950/85 px-2.5 py-1 rounded-full text-xs font-extrabold text-amber-300 tabular-nums">
              <CoinIcon className="w-4 h-4" /> {progress.coins.toLocaleString()}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/25 hover:bg-black/40 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clean 2-Tab Store */}
        <div className="px-3 sm:px-4 pt-3 grid grid-cols-2 gap-2">
          {[
            { id: 'boosters' as const, label: 'All 9 Boosters & Hearts' },
            { id: 'bundles' as const, label: 'Deluxe Bundles' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-2 rounded-2xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer ${
                tab === t.id
                  ? 'bg-purple-900 text-amber-300 shadow border border-amber-300'
                  : 'bg-white/75 text-purple-800 hover:bg-white border border-purple-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-3.5 sm:p-4 space-y-2.5 max-h-[68vh] overflow-y-auto saga-scroll">
          {tab === 'boosters' && (
            <>
              <div className="candy-inset-cream rounded-2xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <HeartLivesIcon lives={progress.lives} className="w-9 h-9" />
                  <div>
                    <div className="font-display font-black text-sm">Full Heart Refill</div>
                    <div className="text-[11px] font-semibold text-purple-700">
                      Restore up to 5 Hearts immediately
                    </div>
                  </div>
                </div>
                <button
                  disabled={progress.lives >= 5 || progress.coins < 80}
                  onClick={onRefillHearts}
                  className={`px-3.5 py-1.5 rounded-full font-display font-black text-xs text-white tabular-nums ${
                    progress.lives >= 5
                      ? 'bg-emerald-500 cursor-default'
                      : progress.coins >= 80
                        ? 'candy-btn-blue cursor-pointer active:scale-95'
                        : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  {progress.lives >= 5 ? 'Full' : '80c'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="candy-inset-cream rounded-2xl p-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-black text-xs sm:text-sm truncate">
                          {item.name}{' '}
                          <span className="text-rose-600 tabular-nums">(x{item.owned})</span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-semibold text-purple-700 leading-snug">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={progress.coins < item.cost}
                      onClick={item.onBuy}
                      className={`px-3 py-1.5 rounded-full font-display font-black text-xs text-white tabular-nums shrink-0 ${
                        progress.coins >= item.cost
                          ? 'candy-btn-green cursor-pointer active:scale-95'
                          : 'bg-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {item.cost}c
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'bundles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bundles.map((b) => {
                const canBuy = progress.coins >= b.cost;
                return (
                  <div
                    key={b.id}
                    className={`rounded-2xl p-3.5 bg-gradient-to-br ${b.gradient} text-white border-2 border-amber-300 shadow-lg flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="flex items-center gap-1.5 font-display font-black text-sm sm:text-base">
                          <Package className="w-4 h-4 text-amber-300 shrink-0" />
                          <span>{b.name}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-300 text-purple-950 font-display font-black text-[9px] shrink-0">
                          {b.tag}
                        </span>
                      </div>
                      <p className="text-xs text-amber-100 mb-3 leading-relaxed">{b.contents}</p>
                    </div>
                    <button
                      disabled={!canBuy}
                      onClick={() => onBuyBundle(b.id, b.cost)}
                      className={`w-full py-2 rounded-full font-display font-black text-sm tabular-nums ${
                        canBuy
                          ? 'candy-btn-green text-white cursor-pointer active:scale-95'
                          : 'bg-black/35 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {canBuy ? `BUY BUNDLE · ${b.cost}c` : `Need ${b.cost} Coins`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== EVENTS & ENDLESS MODAL ====================
export const EventsModal: React.FC<{
  progress: PlayerProgress;
  onPlayEndless: () => void;
  onClaimStarReward: (rewardId: string, coins: number) => void;
  onClose: () => void;
}> = ({ progress, onPlayEndless, onClaimStarReward, onClose }) => {
  const totalStars = Object.values(progress.levelStars).reduce((a, b) => a + b, 0);
  const endlessUnlocked = progress.unlockedLevel >= 6 || (progress.levelStars[5] ?? 0) > 0;

  const milestones = [
    { id: 'stars_10', starsReq: 10, rewardCoins: 120, label: 'Sugar Starter Chest' },
    { id: 'stars_30', starsReq: 30, rewardCoins: 280, label: 'Caramel Crown Chest' },
    { id: 'stars_75', starsReq: 75, rewardCoins: 500, label: 'Blossom Royal Chest' },
    { id: 'stars_150', starsReq: 150, rewardCoins: 850, label: 'Starlight Citadel Vault' },
    { id: 'stars_300', starsReq: 300, rewardCoins: 1400, label: 'Truffle Sovereign Chest' },
    { id: 'stars_500', starsReq: 500, rewardCoins: 2200, label: 'Harbor Grandmaster Vault' },
    { id: 'stars_750', starsReq: 750, rewardCoins: 3500, label: 'Nebula Monarch Chest' },
    { id: 'stars_900', starsReq: 900, rewardCoins: 5000, label: 'Imperial Sugar Throne' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/75">
      <div className="w-full max-w-[420px] sm:max-w-[520px] candy-panel-gold rounded-[30px] overflow-hidden text-purple-950">
        <div className="px-5 py-4 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 text-white flex items-center justify-between border-b-2 border-amber-300">
          <h2 className="font-display font-black text-2xl text-outline-plum">Events & Endless</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/25 hover:bg-black/40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 max-h-[76vh] overflow-y-auto saga-scroll">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-2 border-amber-300 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center shrink-0">
                <InfinityIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-display font-black text-lg leading-tight">
                  Procedural Endless Mode
                </div>
                <div className="text-xs text-amber-200 tabular-nums">
                  {endlessUnlocked
                    ? `Best Wave: ${progress.endlessBestWave || 1} · Best Score: ${progress.endlessBestScore.toLocaleString()}`
                    : 'Beat Level 5 in Sugar Meadow to unlock!'}
                </div>
              </div>
            </div>
            <button
              disabled={!endlessUnlocked}
              onClick={onPlayEndless}
              className={`w-full py-2.5 rounded-full font-display font-black text-base flex items-center justify-center gap-2 ${
                endlessUnlocked
                  ? 'candy-btn-green text-white text-outline-green cursor-pointer active:scale-95'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {endlessUnlocked ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Play Endless Wave</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlocks at Level 5</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-display font-black uppercase text-purple-900">
              <span>Star Milestones (Max {LEVELS.length * 3})</span>
              <span className="flex items-center gap-1 tabular-nums">
                <GoldStarIcon filled className="w-4 h-4" /> {totalStars} Stars
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {milestones.map((m) => {
                const claimed = progress.claimedRewards.includes(m.id);
                const ready = totalStars >= m.starsReq && !claimed;
                return (
                  <div
                    key={m.id}
                    className="candy-inset-cream rounded-2xl p-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-display font-black text-xs sm:text-sm truncate">{m.label}</div>
                      <div className="text-[11px] font-bold text-purple-700 tabular-nums">
                        {m.starsReq} ★ · +{m.rewardCoins}c
                      </div>
                    </div>
                    <button
                      disabled={!ready}
                      onClick={() => onClaimStarReward(m.id, m.rewardCoins)}
                      className={`px-3 py-1.5 rounded-full font-display font-black text-xs shrink-0 ${
                        claimed
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-default'
                          : ready
                            ? 'candy-btn-green text-white cursor-pointer active:scale-95'
                            : 'bg-purple-200 text-purple-500 cursor-not-allowed'
                      }`}
                    >
                      {claimed ? 'Claimed' : ready ? 'Claim' : `${totalStars}/${m.starsReq}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== ALL 360 LEVELS & 18 MAPS ATLAS MODAL ====================
export const LevelsQuickModal: React.FC<{
  progress: PlayerProgress;
  onSelectLevel: (lvl: LevelDefinition) => void;
  onClose: () => void;
}> = ({ progress, onSelectLevel, onClose }) => {
  const frontierZoneIdx = Math.max(
    0,
    ZONES.findIndex(
      (z) => progress.unlockedLevel >= z.levelRange[0] && progress.unlockedLevel <= z.levelRange[1]
    )
  );
  const [selectedZoneIdx, setSelectedZoneIdx] = useState(frontierZoneIdx);
  const activeZone = ZONES[selectedZoneIdx] ?? ZONES[0];
  const zLevels = LEVELS.filter(
    (l) => l.id >= activeZone.levelRange[0] && l.id <= activeZone.levelRange[1]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-purple-950/78">
      <div className="w-full max-w-[440px] sm:max-w-[660px] lg:max-w-[820px] candy-panel-gold rounded-[30px] overflow-hidden text-purple-950">
        <div className="px-5 py-3.5 bg-gradient-to-r from-sky-400 to-blue-600 text-white flex items-center justify-between border-b-2 border-amber-300">
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-outline-plum leading-tight">
              Kingdom Atlas · {ZONES.length} Maps · {LEVELS.length} Levels
            </h2>
            <p className="text-[11px] font-bold text-sky-100">
              Select a Map below to jump straight to any unlocked stage
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/25 hover:bg-black/40 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 sm:p-4 space-y-3.5 max-h-[78vh] overflow-y-auto saga-scroll">
          {/* 18-Map Selector Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {ZONES.map((z, idx) => {
              const isSelected = idx === selectedZoneIdx;
              const isZoneUnlocked = progress.unlockedLevel >= z.levelRange[0];
              const zStars = LEVELS.slice(z.levelRange[0] - 1, z.levelRange[1]).reduce(
                (acc, l) => acc + (progress.levelStars[l.id] ?? 0),
                0
              );
              return (
                <button
                  key={z.id}
                  onClick={() => setSelectedZoneIdx(idx)}
                  className={`text-left p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-900 text-white border-amber-300 shadow-md scale-[1.02]'
                      : isZoneUnlocked
                        ? 'bg-white/90 hover:bg-white text-purple-950 border-purple-200'
                        : 'bg-purple-100/70 text-purple-600 border-purple-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-display font-black uppercase">
                    <span className={isSelected ? 'text-amber-300' : 'text-rose-600'}>
                      Map {z.chapterNumber}
                    </span>
                    <span className="flex items-center gap-0.5 tabular-nums">
                      <GoldStarIcon filled={zStars > 0} className="w-2.5 h-2.5" />
                      {zStars}/60
                    </span>
                  </div>
                  <div className="font-display font-black text-[11px] truncate leading-tight mt-0.5">
                    {z.name}
                  </div>
                  <div
                    className={`text-[9px] font-bold tabular-nums ${
                      isSelected ? 'text-purple-200' : 'text-purple-600'
                    }`}
                  >
                    Lvls {z.levelRange[0]}–{z.levelRange[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Map's 20 Levels */}
          <div className="candy-inset-cream rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <div className="font-display font-black text-base text-purple-950">
                  Map {activeZone.chapterNumber}: {activeZone.name}
                </div>
                <div className="text-[11px] font-semibold text-purple-700">
                  {activeZone.subtitle}
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-900 text-amber-300 font-display font-black text-xs tabular-nums">
                {activeZone.levelRange[0]}–{activeZone.levelRange[1]}
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {zLevels.map((lvl) => {
                const unlocked = lvl.id <= progress.unlockedLevel;
                const stars = progress.levelStars[lvl.id] ?? 0;
                return (
                  <button
                    key={lvl.id}
                    disabled={!unlocked}
                    onClick={() => onSelectLevel(lvl)}
                    className={`relative p-1.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-transform ${
                      unlocked
                        ? lvl.difficulty === 'super_hard'
                          ? 'bg-gradient-to-b from-fuchsia-500 to-purple-800 text-white border-amber-300 hover:scale-105 cursor-pointer shadow'
                          : lvl.difficulty === 'hard'
                            ? 'bg-gradient-to-b from-rose-400 to-rose-600 text-white border-amber-200 hover:scale-105 cursor-pointer shadow'
                            : 'bg-gradient-to-b from-sky-400 to-blue-600 text-white border-amber-200 hover:scale-105 cursor-pointer shadow'
                        : 'bg-slate-300 text-slate-500 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {lvl.timeLimitSec && (
                      <Clock className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-300 bg-purple-950 rounded-full p-0.5" />
                    )}
                    <span className="font-display font-black text-sm leading-none tabular-nums">
                      {unlocked ? lvl.id : <Lock className="w-3.5 h-3.5" />}
                    </span>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3].map((s) => (
                        <GoldStarIcon key={s} filled={stars >= s} className="w-2.5 h-2.5" />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PROFILE / GOOGLE SIGN-IN CLOUD SAVE MODAL ====================
export const ProfileSaveModal: React.FC<{
  progress: PlayerProgress;
  authUser: { uid: string; email: string | null; displayName: string | null } | null;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  authError: string | null;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  onSyncNow: () => void;
  onSaveProfile: (name: string, avatarId: AvatarId) => void;
  onClose: () => void;
}> = ({
  progress,
  authUser,
  cloudSyncStatus,
  authError,
  onGoogleSignIn,
  onGoogleSignOut,
  onSyncNow,
  onSaveProfile,
  onClose,
}) => {
  const [name, setName] = useState(progress.playerName);
  const [avatar, setAvatar] = useState<AvatarId>(progress.avatarId);
  const avatars: AvatarId[] = ['princess', 'crown', 'gummy', 'lollipop'];
  const totalStars = Object.values(progress.levelStars).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/75">
      <div className="w-full max-w-[400px] sm:max-w-[440px] candy-panel-gold rounded-[30px] overflow-hidden text-purple-950">
        <div className="px-5 py-4 bg-gradient-to-r from-sky-500 to-blue-700 text-white flex items-center justify-between border-b-2 border-amber-300">
          <h2 className="font-display font-black text-xl text-outline-plum">
            Google Cloud Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/25 hover:bg-black/40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 max-h-[78vh] overflow-y-auto saga-scroll">
          {/* Real Google Sign-In / Cloud Sync Card */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-2 border-amber-300 shadow-lg space-y-2.5">
            {authUser ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        Google Play / Firebase Cloud Connected
                      </div>
                      <div className="text-xs font-extrabold truncate">
                        {authUser.email ?? authUser.displayName ?? 'Signed-In Player'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onGoogleSignOut}
                    className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-purple-200 pt-1 border-t border-white/15">
                  <span className="flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5 text-sky-300" />
                    {cloudSyncStatus === 'syncing'
                      ? 'Saving to Cloud Firestore...'
                      : cloudSyncStatus === 'error'
                        ? 'Sync pending retry'
                        : `All ${LEVELS.length}-level progress saved in Cloud`}
                  </span>
                  <button
                    onClick={onSyncNow}
                    className="px-2.5 py-1 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-display font-black text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <Cloud className="w-6 h-6 text-sky-300 shrink-0" />
                  <div>
                    <div className="font-display font-black text-sm">Save Across All Devices</div>
                    <div className="text-[11px] text-purple-200">
                      Sign in with Google to back up all {LEVELS.length} levels, stars, coins & boosters.
                    </div>
                  </div>
                </div>
                <button
                  onClick={onGoogleSignIn}
                  className="w-full py-2.5 rounded-full bg-white hover:bg-amber-50 text-slate-900 font-display font-black text-sm flex items-center justify-center gap-2 shadow cursor-pointer active:scale-95 transition-transform"
                >
                  <LogIn className="w-4 h-4 text-blue-600" />
                  <span>SIGN IN WITH GOOGLE</span>
                </button>
              </>
            )}

            {authError && (
              <div className="text-[11px] text-rose-200 bg-rose-950/60 border border-rose-400/50 rounded-xl px-2.5 py-1.5">
                {authError}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between candy-inset-cream rounded-2xl p-3">
            <div className="flex items-center gap-3">
              <AvatarPortrait avatarId={avatar} className="w-12 h-12" />
              <div>
                <div className="text-[11px] font-bold text-purple-700">Campaign Summary</div>
                <div className="font-display font-black text-sm tabular-nums">
                  Level {progress.unlockedLevel}/{LEVELS.length} · {totalStars} Stars
                </div>
              </div>
            </div>
            <Crown className="w-6 h-6 text-amber-500" />
          </div>

          <div>
            <label className="block text-xs font-display font-black uppercase text-purple-900 mb-1">
              Player Name
            </label>
            <input
              type="text"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-purple-200 font-display font-bold text-purple-950 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <div className="text-xs font-display font-black uppercase text-purple-900 mb-1.5">
              Choose Avatar
            </div>
            <div className="grid grid-cols-4 gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`p-1.5 rounded-2xl border-2 flex items-center justify-center transition-transform cursor-pointer ${
                    avatar === av
                      ? 'bg-amber-100 border-amber-500 scale-105 shadow'
                      : 'bg-white/70 border-purple-200 hover:bg-white'
                  }`}
                >
                  <AvatarPortrait avatarId={av} className="w-11 h-11" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              onSaveProfile(name.trim() || 'Alex', avatar);
              onClose();
            }}
            className="candy-btn-green w-full py-2.5 rounded-full font-display font-black text-lg text-white text-outline-green cursor-pointer"
          >
            SAVE PROFILE
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== SETTINGS MODAL ====================
export const SettingsModal: React.FC<{
  progress: PlayerProgress;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenHowToPlay: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}> = ({
  progress,
  onToggleSound,
  onToggleMusic,
  onOpenHowToPlay,
  onResetProgress,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/75">
      <div className="w-full max-w-[380px] candy-panel-gold rounded-[30px] overflow-hidden text-purple-950">
        <div className="px-5 py-4 bg-gradient-to-r from-sky-500 to-blue-700 text-white flex items-center justify-between border-b-2 border-amber-300">
          <h2 className="font-display font-black text-2xl text-outline-plum">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/25 hover:bg-black/40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto saga-scroll">
          <button
            onClick={onToggleSound}
            className="w-full candy-inset-cream rounded-2xl px-4 py-2.5 flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2.5 font-display font-bold">
              {progress.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              Sound Effects
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black text-white ${
                progress.soundEnabled ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            >
              {progress.soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={onToggleMusic}
            className="w-full candy-inset-cream rounded-2xl px-4 py-2.5 flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2.5 font-display font-bold">
              <Music className={`w-5 h-5 ${progress.musicEnabled ? 'text-amber-500' : 'text-slate-400'}`} />
              Background Music
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black text-white ${
                progress.musicEnabled ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            >
              {progress.musicEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="w-full candy-btn-blue py-2.5 rounded-full font-display font-black text-base text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
            <span>How to Play</span>
          </button>

          <PWAInstallButton variant="full" />

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
            >
              Reset Saved Progress
            </button>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                  onClose();
                }}
                className="flex-1 py-2 rounded-full bg-rose-600 text-white font-bold text-xs cursor-pointer"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 rounded-full bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== HOW TO PLAY MODAL ====================
export const HowToPlayModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/80">
    <div className="w-full max-w-[440px] max-h-[88vh] overflow-y-auto candy-panel-gold rounded-[30px] text-purple-950 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-black text-2xl">How to Play</h2>
        <button onClick={onClose} className="p-2 rounded-full bg-white/80 hover:bg-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="candy-inset-cream rounded-2xl p-3">
        <div className="text-xs font-display font-black uppercase text-purple-900 mb-2">Iconic Candies</div>
        <div className="grid grid-cols-6 gap-1 text-center text-[10px] font-bold">
          {(
            [
              ['red', 'Bean'],
              ['orange', 'Lozenge'],
              ['yellow', 'Lemon'],
              ['green', 'Gumdrop'],
              ['blue', 'Swirl'],
              ['purple', 'Cluster'],
            ] as const
          ).map(([col, label]) => (
            <div key={col} className="flex flex-col items-center gap-1">
              <CandyGlyph color={col} className="w-8 h-8" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs">
        <div className="candy-inset-cream rounded-xl p-3">
          <strong className="text-rose-600">Match 4 in a Row:</strong> Creates a Striped Candy clearing an entire row or column.
        </div>
        <div className="candy-inset-cream rounded-xl p-3">
          <strong className="text-amber-600">Match 5 in L or T Shape:</strong> Creates a Wrapped Candy that explodes twice in 3x3!
        </div>
        <div className="candy-inset-cream rounded-xl p-3">
          <strong className="text-sky-600">Match 5 in a Line:</strong> Forges a Color Bomb! Swap with any candy to zap all matching colors.
        </div>
        <div className="candy-inset-cream rounded-xl p-3">
          <strong className="text-purple-700">Special + Special Combos:</strong> Swap any two specials together for mega blasts!
        </div>
        <div className="candy-inset-cream rounded-xl p-3">
          <strong className="text-emerald-700">Royal Pro Boosters:</strong> Use the <strong>Cross Wand</strong> to blast a full row & column, or <strong>Whirlwind Shuffle</strong> to remix the board and forge 2 specials!
        </div>
      </div>

      <button
        onClick={onClose}
        className="candy-btn-green w-full py-3 rounded-full font-display font-black text-lg text-white text-outline-green cursor-pointer"
      >
        GOT IT!
      </button>
    </div>
  </div>
);

// ==================== PAUSE MODAL ====================
export const PauseModal: React.FC<{
  levelName: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onExitToMap: () => void;
  onExitToTitle: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}> = ({
  levelName,
  soundEnabled,
  musicEnabled,
  onResume,
  onRestart,
  onExitToMap,
  onExitToTitle,
  onToggleSound,
  onToggleMusic,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/75">
    <div className="w-full max-w-[350px] candy-panel-gold rounded-[30px] text-purple-950 p-6 space-y-4 text-center">
      <div>
        <div className="text-xs font-display font-black uppercase tracking-widest text-rose-600">Paused</div>
        <h2 className="font-display font-black text-xl mt-0.5">{levelName}</h2>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onToggleSound}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-purple-200 text-xs font-extrabold cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          <span>SFX</span>
        </button>
        <button
          onClick={onToggleMusic}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-purple-200 text-xs font-extrabold cursor-pointer"
        >
          <Music className={`w-4 h-4 ${musicEnabled ? 'text-amber-500' : 'text-slate-400'}`} />
          <span>Music</span>
        </button>
      </div>

      <div className="space-y-2.5">
        <button
          onClick={onResume}
          className="candy-btn-green w-full flex items-center justify-center gap-2 py-3 rounded-full font-display font-black text-xl text-white text-outline-green cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>RESUME</span>
        </button>
        <button
          onClick={onRestart}
          className="candy-btn-blue w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-display font-extrabold text-sm text-white cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Level</span>
        </button>
        <button
          onClick={onExitToMap}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-white border-2 border-purple-200 font-display font-extrabold text-sm cursor-pointer"
        >
          <Map className="w-4 h-4" />
          <span>Lobby Map</span>
        </button>
        <button
          onClick={onExitToTitle}
          className="w-full flex items-center justify-center gap-2 py-1.5 text-purple-700 hover:text-purple-950 text-xs font-bold cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Main Menu</span>
        </button>
      </div>
    </div>
  </div>
);

// ==================== VICTORY MODAL ====================
export const VictoryModal: React.FC<{
  level: LevelDefinition;
  score: number;
  stars: number;
  coinsEarned: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToMap: () => void;
}> = ({
  level,
  score,
  stars,
  coinsEarned,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onBackToMap,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/80">
    <div className="w-full max-w-[380px] candy-panel-gold rounded-[30px] overflow-hidden text-purple-950 text-center">
      <div className="bg-gradient-to-b from-rose-400 to-rose-600 px-6 py-4 text-white border-b-2 border-amber-300">
        <div className="text-xs font-extrabold uppercase tracking-widest text-amber-200">
          {level.isEndless ? `Wave ${level.endlessWave} Cleared!` : `Level ${level.id} Complete!`}
        </div>
        <h2 className="font-display font-black text-3xl text-outline-plum mt-0.5">Sweet Victory!</h2>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-center gap-4 pt-1">
          {[1, 2, 3].map((s, idx) => (
            <div
              key={s}
              style={{ animationDelay: `${idx * 180}ms` }}
              className={`${stars >= s ? 'animate-star-pop opacity-0' : 'opacity-40'} ${
                s === 2 ? '-translate-y-2 scale-115' : ''
              }`}
            >
              <GoldStarIcon filled={stars >= s} className="w-13 h-13 drop-shadow-lg" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="candy-inset-cream rounded-2xl p-2.5">
            <div className="text-[11px] font-bold uppercase text-purple-700">Score</div>
            <div className="font-display font-black text-xl tabular-nums">{score.toLocaleString()}</div>
          </div>
          <div className="candy-inset-cream rounded-2xl p-2.5">
            <div className="text-[11px] font-bold uppercase text-purple-700">Reward</div>
            <div className="flex items-center justify-center gap-1 font-display font-black text-xl text-amber-600 tabular-nums">
              <CoinIcon className="w-5 h-5" />
              <span>+{coinsEarned}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {hasNextLevel && (
            <button
              onClick={onNextLevel}
              className="candy-btn-green w-full flex items-center justify-center gap-2 py-3 rounded-full font-display font-black text-xl text-white text-outline-green cursor-pointer"
            >
              <span>{level.isEndless ? `Next Wave (${(level.endlessWave ?? 1) + 1})` : 'NEXT LEVEL'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onReplay}
              className="candy-btn-blue flex items-center justify-center gap-1.5 py-2.5 rounded-full font-display font-extrabold text-sm text-white cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>
            <button
              onClick={onBackToMap}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-white border-2 border-purple-200 font-display font-extrabold text-sm cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==================== GAME OVER MODAL ====================
export const GameOverModal: React.FC<{
  level: LevelDefinition;
  score: number;
  coins: number;
  onContinueCoins: () => void;
  onRetry: () => void;
  onBackToMap: () => void;
}> = ({ level, score, coins, onContinueCoins, onRetry, onBackToMap }) => {
  const canAffordContinue = coins >= 100;
  const isTimed = Boolean(level.timeLimitSec);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/80">
      <div className="w-full max-w-[370px] candy-panel-gold rounded-[30px] overflow-hidden text-purple-950 text-center">
        <div className="bg-gradient-to-b from-purple-700 to-purple-900 px-6 py-4 text-white border-b-2 border-amber-300">
          <div className="text-xs font-extrabold uppercase tracking-widest text-rose-300">
            {isTimed ? 'Out of Time!' : 'Out of Moves'}
          </div>
          <h2 className="font-display font-black text-2xl mt-0.5">So Close!</h2>
        </div>

        <div className="p-5 space-y-3.5">
          <div className="candy-inset-cream rounded-2xl p-3">
            <div className="text-xs font-bold uppercase text-purple-700">Score Reached</div>
            <div className="font-display font-black text-3xl tabular-nums">{score.toLocaleString()}</div>
            <p className="text-xs font-semibold text-purple-700 mt-0.5">{level.name}</p>
          </div>

          <button
            onClick={onContinueCoins}
            disabled={!canAffordContinue}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-display font-black text-base ${
              canAffordContinue
                ? 'candy-btn-green text-white text-outline-green cursor-pointer active:scale-95'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CoinIcon className="w-5 h-5" />
            <span>{isTimed ? '+25 Seconds (100c)' : '+5 Extra Moves (100c)'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onRetry}
              className="candy-btn-blue flex items-center justify-center gap-1.5 py-2.5 rounded-full font-display font-extrabold text-sm text-white cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <button
              onClick={onBackToMap}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-white border-2 border-purple-200 font-display font-extrabold text-sm cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
