import React from 'react';
import { Check, Clock, X } from 'lucide-react';
import { getZoneForLevel } from '../data/levels';
import { CandyColor, GameHUDState, InGameBoosterType, PlayerProgress } from '../types/game';
import {
  CandyGlyph,
  CherryIcon,
  ColorBombIcon,
  CrossWandIcon,
  FlowerGearIcon,
  FreeSwitchIcon,
  GoldStarIcon,
  HazelnutIcon,
  JellyIcon,
  LollipopHammerIcon,
  MapPinIcon,
  SugarShuffleIcon,
  TreasureChestIcon,
  TrophyEventIcon,
} from './CandyIcons';

export const BOOSTER_COST: Record<InGameBoosterType, number> = {
  hammer: 60,
  free_switch: 50,
  color_bomb: 90,
  cross_wand: 110,
  sugar_shuffle: 75,
};

function formatTimeMMSS(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function buildObjectiveItems(hud: GameHUDState) {
  const objectiveItems: Array<{
    key: string;
    icon: React.ReactNode;
    remaining: number;
    label?: string;
  }> = [];

  const colorsOrder: CandyColor[] = ['red', 'green', 'yellow', 'orange', 'blue', 'purple'];
  for (const col of colorsOrder) {
    if (hud.collectTargets[col] !== undefined) {
      objectiveItems.push({
        key: `col-${col}`,
        icon: <CandyGlyph color={col} className="w-7 h-7" />,
        remaining: hud.collectRemaining[col] ?? 0,
      });
    }
  }
  if (hud.jellyTotal > 0) {
    objectiveItems.push({
      key: 'jelly',
      icon: <JellyIcon className="w-6 h-6" />,
      remaining: hud.jellyRemaining,
    });
  }
  if (hud.cherriesTotal > 0) {
    objectiveItems.push({
      key: 'cherry',
      icon: <CherryIcon className="w-6 h-6" />,
      remaining: hud.cherriesRemaining,
    });
  }
  if (hud.hazelnutsTotal > 0) {
    objectiveItems.push({
      key: 'nut',
      icon: <HazelnutIcon className="w-6 h-6" />,
      remaining: hud.hazelnutsRemaining,
    });
  }
  if (hud.scoreTarget !== null && objectiveItems.length < 3) {
    objectiveItems.push({
      key: 'score-obj',
      icon: <GoldStarIcon filled={hud.score >= hud.scoreTarget} className="w-6 h-6" />,
      remaining: Math.max(0, hud.scoreTarget - hud.score),
      label: hud.score >= hud.scoreTarget ? '0' : `${Math.ceil((hud.scoreTarget - hud.score) / 100) / 10}k`,
    });
  }
  return objectiveItems;
}

// Mobile & Tablet Top Ornate HUD (< lg)
export const TopGameHUD: React.FC<{
  hud: GameHUDState;
  onPause: () => void;
}> = ({ hud, onPause }) => {
  const [s1, s2, s3] = hud.starScores;
  const maxScore = Math.max(s3, 1);
  const pct = Math.min(100, Math.round((hud.score / maxScore) * 100));

  const isTimed = hud.isTimed && hud.timeLeftSec !== null;
  const isLowUrgent = isTimed
    ? (hud.timeLeftSec ?? 99) <= 10 && !hud.isSugarCrush
    : hud.movesLeft <= 5 && !hud.isSugarCrush;

  const objectiveItems = buildObjectiveItems(hud);

  return (
    <header className="lg:hidden shrink-0 z-20 w-full max-w-2xl mx-auto px-2 pt-3 pb-1">
      <div className="relative candy-panel-gold rounded-[24px] px-2.5 pt-5 pb-2.5">
        <button
          onClick={onPause}
          aria-label="Game Settings and Pause"
          className="absolute -top-2.5 -left-1 z-20 transition-transform active:scale-95 cursor-pointer"
        >
          <FlowerGearIcon className="w-12 h-12 drop-shadow-lg" />
        </button>

        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1.5">
          <div className="px-5 py-0.5 rounded-full bg-gradient-to-b from-white via-pink-50 to-pink-200 border-[2.5px] border-amber-400 shadow-md text-center">
            <div className="text-[10px] font-display font-black uppercase tracking-wider text-purple-900 leading-none">
              {hud.levelId >= 1000 ? 'ENDLESS' : 'LEVEL'}
            </div>
            <div className="font-display font-black text-lg text-purple-950 leading-none tabular-nums">
              {hud.levelId >= 1000 ? hud.levelId - 1000 : hud.levelId}
            </div>
          </div>

          {(hud.difficulty === 'hard' || hud.difficulty === 'super_hard') && (
            <span
              className={`px-2 py-0.5 rounded-full border border-white text-[9px] font-display font-black uppercase shadow ${
                hud.difficulty === 'super_hard'
                  ? 'bg-purple-800 text-amber-300'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {hud.difficulty === 'super_hard' ? 'SUPER' : 'HARD'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-1.5 mt-1">
          <div className="candy-inset-cream rounded-2xl px-2 py-1.5 flex flex-col items-center justify-center min-w-0">
            <span className="text-[10px] font-display font-black uppercase tracking-wider text-purple-950 mb-1">
              OBJECTIVES
            </span>
            <div className="flex items-center justify-center gap-2">
              {objectiveItems.slice(0, 3).map((item) => (
                <div key={item.key} className="flex flex-col items-center">
                  {item.icon}
                  {item.remaining === 0 ? (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] mt-0.5" />
                  ) : (
                    <span className="font-display font-black text-xs text-purple-950 leading-none mt-0.5 tabular-nums">
                      {item.label ?? item.remaining}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`w-[72px] rounded-[28px] border-[2.5px] border-amber-400 flex flex-col items-center justify-center px-1 py-1 shadow-md ${
              isLowUrgent
                ? 'bg-gradient-to-b from-rose-400 to-rose-600 text-white animate-danger-pulse'
                : isTimed
                  ? 'bg-gradient-to-b from-amber-100 via-white to-amber-200 text-purple-950'
                  : 'bg-gradient-to-b from-white via-pink-50 to-amber-100 text-purple-950'
            }`}
          >
            {isTimed ? (
              <>
                <span className="font-display font-black text-xl leading-none tabular-nums">
                  {formatTimeMMSS(hud.timeLeftSec ?? 0)}
                </span>
                <span
                  className={`flex items-center justify-center gap-0.5 text-[9px] font-display font-extrabold uppercase tracking-tight leading-tight text-center mt-0.5 ${
                    isLowUrgent ? 'text-rose-50' : 'text-amber-800'
                  }`}
                >
                  <Clock className="w-2.5 h-2.5" />
                  <span>TIME</span>
                </span>
              </>
            ) : (
              <>
                <span className="font-display font-black text-2xl leading-none tabular-nums">
                  {hud.movesLeft}
                </span>
                <span
                  className={`text-[9px] font-display font-extrabold uppercase tracking-tight leading-tight text-center mt-0.5 ${
                    isLowUrgent ? 'text-rose-50' : 'text-purple-800'
                  }`}
                >
                  MOVES
                  <br />
                  LEFT
                </span>
              </>
            )}
          </div>

          <div className="candy-inset-cream rounded-2xl px-2 py-1.5 flex flex-col items-center justify-between min-w-0">
            <span className="text-[10px] font-display font-black uppercase tracking-wider text-purple-950">
              SCORE
            </span>

            <div className="relative w-full h-5 rounded-full bg-purple-950/75 border border-purple-300 overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 transition-all duration-200"
                style={{ width: `${pct}%` }}
              />
              <span className="relative z-10 font-display font-black text-xs text-white drop-shadow tabular-nums">
                {hud.score.toLocaleString()}
              </span>
            </div>

            <div className="relative w-full flex items-center justify-around pt-1">
              <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-purple-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <GoldStarIcon filled={hud.score >= s1} className="relative z-10 w-4 h-4" />
              <GoldStarIcon filled={hud.score >= s2} className="relative z-10 w-4 h-4" />
              <GoldStarIcon filled={hud.score >= s3} className="relative z-10 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {hud.statusBanner && (
        <div className="mt-1 text-center font-display font-black text-xs uppercase tracking-widest text-amber-200 drop-shadow">
          {hud.statusBanner}
        </div>
      )}
    </header>
  );
};

// Desktop Pro Sidebar Command HUD (lg+)
export const DesktopSideHUD: React.FC<{
  hud: GameHUDState;
  onPause: () => void;
}> = ({ hud, onPause }) => {
  const [s1, s2, s3] = hud.starScores;
  const maxScore = Math.max(s3, 1);
  const pct = Math.min(100, Math.round((hud.score / maxScore) * 100));
  const zoneMeta = getZoneForLevel(hud.levelId >= 1000 ? 1 : hud.levelId);

  const isTimed = hud.isTimed && hud.timeLeftSec !== null;
  const isLowUrgent = isTimed
    ? (hud.timeLeftSec ?? 99) <= 10 && !hud.isSugarCrush
    : hud.movesLeft <= 5 && !hud.isSugarCrush;

  const objectiveItems = buildObjectiveItems(hud);

  return (
    <aside className="hidden lg:flex w-76 xl:w-80 shrink-0 flex-col gap-3 z-20">
      <div className="candy-panel-gold rounded-[28px] p-4 flex flex-col gap-3.5 text-purple-950">
        {/* Top Row: Flower Gear + Level & Map Title */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onPause}
            aria-label="Game Settings and Pause"
            className="transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <FlowerGearIcon className="w-12 h-12 drop-shadow-lg" />
          </button>

          <div className="text-right min-w-0">
            <div className="text-[10px] font-display font-black uppercase tracking-wider text-rose-600 truncate">
              {hud.levelId >= 1000 ? 'Endless Arcade' : `Map ${zoneMeta.chapterNumber}: ${zoneMeta.name}`}
            </div>
            <div className="font-display font-black text-xl leading-tight text-purple-950">
              {hud.levelId >= 1000 ? `Wave ${hud.levelId - 1000}` : `Level ${hud.levelId}`}
            </div>
            <div className="text-xs font-bold text-purple-700 truncate">{hud.levelName}</div>
          </div>
        </div>

        {/* Moves / Time Medallion */}
        <div
          className={`rounded-[24px] border-[2.5px] border-amber-400 py-3 px-4 flex items-center justify-between shadow-md ${
            isLowUrgent
              ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white animate-danger-pulse'
              : isTimed
                ? 'bg-gradient-to-r from-amber-100 via-white to-amber-200 text-purple-950'
                : 'bg-gradient-to-r from-white via-pink-50 to-amber-100 text-purple-950'
          }`}
        >
          <span className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            {isTimed && <Clock className="w-4 h-4" />}
            <span>{isTimed ? 'TIME LEFT' : 'MOVES LEFT'}</span>
          </span>
          <span className="font-display font-black text-3xl leading-none tabular-nums">
            {isTimed ? formatTimeMMSS(hud.timeLeftSec ?? 0) : hud.movesLeft}
          </span>
        </div>

        {/* Objectives */}
        <div className="candy-inset-cream rounded-2xl p-3">
          <div className="text-[10px] font-display font-black uppercase tracking-wider text-purple-900 mb-2 text-center">
            LEVEL OBJECTIVES
          </div>
          <div className="flex items-center justify-around gap-2">
            {objectiveItems.slice(0, 4).map((item) => (
              <div key={item.key} className="flex flex-col items-center">
                {item.icon}
                {item.remaining === 0 ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] mt-1" />
                ) : (
                  <span className="font-display font-black text-sm text-purple-950 leading-none mt-1 tabular-nums">
                    {item.label ?? item.remaining}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Score & 3-Star Bar */}
        <div className="candy-inset-cream rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-display font-black uppercase tracking-wider text-purple-900">
            <span>SCORE</span>
            <span className="tabular-nums text-rose-600">3★ Goal: {s3.toLocaleString()}</span>
          </div>
          <div className="relative w-full h-6 rounded-full bg-purple-950/80 border border-purple-300 overflow-hidden flex items-center justify-center">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
            <span className="relative z-10 font-display font-black text-sm text-white drop-shadow tabular-nums">
              {hud.score.toLocaleString()}
            </span>
          </div>
          <div className="relative w-full flex items-center justify-around pt-1">
            <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-purple-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
            <GoldStarIcon filled={hud.score >= s1} className="relative z-10 w-5 h-5" />
            <GoldStarIcon filled={hud.score >= s2} className="relative z-10 w-5 h-5" />
            <GoldStarIcon filled={hud.score >= s3} className="relative z-10 w-5 h-5" />
          </div>
        </div>

        {hud.statusBanner && (
          <div className="text-center font-display font-black text-xs uppercase tracking-widest text-rose-600 bg-amber-100 rounded-full py-1 border border-amber-300">
            {hud.statusBanner}
          </div>
        )}
      </div>
    </aside>
  );
};

// Bottom Booster Shelf (5 Refined Boosters) + Dock Bar
export const BottomBoosterBar: React.FC<{
  progress: PlayerProgress;
  activeBooster: InGameBoosterType | null;
  disabled: boolean;
  onSelectBooster: (type: InGameBoosterType) => void;
  onCancelBooster: () => void;
  onOpenShop: () => void;
  onExitToLevels: () => void;
  onOpenEvents: () => void;
}> = ({
  progress,
  activeBooster,
  disabled,
  onSelectBooster,
  onCancelBooster,
  onOpenShop,
  onExitToLevels,
  onOpenEvents,
}) => {
  const boosters: Array<{
    id: InGameBoosterType;
    name: string;
    desc: string;
    icon: React.ReactNode;
    count: number;
    cost: number;
  }> = [
    {
      id: 'hammer',
      name: 'Hammer',
      desc: 'Tap any candy or blocker to smash it',
      icon: <LollipopHammerIcon className="w-8 h-8 sm:w-10 sm:h-10" />,
      count: progress.boosters.hammer,
      cost: BOOSTER_COST.hammer,
    },
    {
      id: 'free_switch',
      name: 'Switch',
      desc: 'Swap any 2 adjacent candies freely',
      icon: <FreeSwitchIcon className="w-8 h-8 sm:w-10 sm:h-10" />,
      count: progress.boosters.free_switch,
      cost: BOOSTER_COST.free_switch,
    },
    {
      id: 'color_bomb',
      name: 'Rainbow',
      desc: 'Tap a candy to turn it into a Color Bomb',
      icon: <ColorBombIcon className="w-8 h-8 sm:w-10 sm:h-10" />,
      count: progress.boosters.color_bomb,
      cost: BOOSTER_COST.color_bomb,
    },
    {
      id: 'cross_wand',
      name: 'Cross Wand',
      desc: 'Tap any tile to blast its whole row & column',
      icon: <CrossWandIcon className="w-8 h-8 sm:w-10 sm:h-10" />,
      count: progress.boosters.cross_wand,
      cost: BOOSTER_COST.cross_wand,
    },
    {
      id: 'sugar_shuffle',
      name: 'Whirlwind',
      desc: 'Shuffle the board & upgrade 2 specials!',
      icon: <SugarShuffleIcon className="w-8 h-8 sm:w-10 sm:h-10" />,
      count: progress.boosters.sugar_shuffle,
      cost: BOOSTER_COST.sugar_shuffle,
    },
  ];

  const activeInfo = boosters.find((b) => b.id === activeBooster);

  return (
    <div className="shrink-0 z-20 w-full flex flex-col items-center">
      {activeInfo && (
        <div className="mb-1.5 mx-3 flex items-center gap-3 bg-amber-400 text-amber-950 border-2 border-white rounded-full px-4 py-1 text-xs font-extrabold shadow-lg">
          <span>{activeInfo.desc}</span>
          <button
            onClick={onCancelBooster}
            className="flex items-center gap-0.5 bg-amber-950/15 hover:bg-amber-950/25 rounded-full px-2 py-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* 5-Booster Shelf */}
      <div className="relative px-3 sm:px-6 pt-2 pb-1.5 mb-[-6px] z-10 rounded-t-3xl bg-gradient-to-b from-sky-300/92 to-blue-500/95 border-t-2 border-x-2 border-sky-100 shadow-lg">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {boosters.map((b) => {
            const isActive = activeBooster === b.id;
            const canAfford = b.count > 0 || progress.coins >= b.cost;
            return (
              <button
                key={b.id}
                disabled={disabled || (!canAfford && !isActive)}
                onClick={() => (isActive ? onCancelBooster() : onSelectBooster(b.id))}
                title={`${b.name}: ${b.desc}`}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-15 lg:h-15 rounded-2xl flex items-center justify-center border-2 transition-transform shadow-md ${
                  isActive
                    ? 'bg-amber-200 border-amber-400 scale-110 ring-4 ring-amber-300/60 cursor-pointer'
                    : canAfford && !disabled
                      ? 'bg-gradient-to-b from-white to-sky-100 border-white hover:scale-105 active:scale-95 cursor-pointer'
                      : 'bg-slate-200/60 border-slate-300 opacity-60 cursor-not-allowed'
                }`}
              >
                {b.icon}
                <span
                  className={`absolute -bottom-1.5 -right-1.5 min-w-5 h-5 sm:min-w-6 sm:h-6 px-1 rounded-full border-2 border-amber-200 font-display font-black text-[10px] sm:text-xs text-white flex items-center justify-center shadow tabular-nums ${
                    b.count > 0
                      ? 'bg-gradient-to-b from-pink-400 to-rose-600'
                      : 'bg-gradient-to-b from-amber-500 to-amber-700'
                  }`}
                >
                  {b.count > 0 ? b.count : `${b.cost}c`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Dock Bar */}
      <footer className="w-full candy-dock-blue px-3 sm:px-6 py-2">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onOpenShop}
              className="flex flex-col items-center text-white hover:scale-105 transition-transform cursor-pointer"
            >
              <TreasureChestIcon className="w-8 h-8 drop-shadow" />
              <span className="font-display font-extrabold text-[11px] drop-shadow">Shop</span>
            </button>

            <button
              onClick={onExitToLevels}
              className="flex flex-col items-center text-white hover:scale-105 transition-transform cursor-pointer"
            >
              <MapPinIcon className="w-8 h-8 drop-shadow" />
              <span className="font-display font-extrabold text-[11px] drop-shadow">Maps</span>
            </button>

            <button
              onClick={onOpenEvents}
              className="flex flex-col items-center text-white hover:scale-105 transition-transform cursor-pointer"
            >
              <TrophyEventIcon className="w-8 h-8 drop-shadow" />
              <span className="font-display font-extrabold text-[11px] drop-shadow">Events</span>
            </button>
          </div>

          <button
            onClick={onExitToLevels}
            className="candy-btn-silver px-7 sm:px-9 py-2 rounded-full font-display font-black text-xl tracking-wide text-white text-outline-plum transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            EXIT
          </button>
        </div>
      </footer>
    </div>
  );
};
