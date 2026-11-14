import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Compass, Lock, Settings } from 'lucide-react';
import { getZoneForLevel, LEVELS, ZONES } from '../data/levels';
import { LevelDefinition, PlayerProgress } from '../types/game';
import {
  AvatarPortrait,
  CoinIcon,
  GoldStarIcon,
  HeartLivesIcon,
  MapPinIcon,
  TreasureChestIcon,
  TrophyEventIcon,
} from './CandyIcons';

interface SagaMapProps {
  progress: PlayerProgress;
  onSelectLevel: (level: LevelDefinition) => void;
  onPlayFrontier: () => void;
  onOpenShop: () => void;
  onOpenEvents: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenLevelsList: () => void;
}

const LEVELS_PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(LEVELS.length / LEVELS_PER_PAGE); // 72 chapters covering 360 levels

// Winding bottom-to-top coordinates (percentage X, percentage Y inside zero-scroll map stage)
const NODE_POSITIONS = [
  { x: 50, y: 84 },
  { x: 64, y: 67 },
  { x: 37, y: 51 },
  { x: 30, y: 34 },
  { x: 56, y: 18 },
];

export const SagaMap: React.FC<SagaMapProps> = ({
  progress,
  onSelectLevel,
  onPlayFrontier,
  onOpenShop,
  onOpenEvents,
  onOpenProfile,
  onOpenSettings,
  onOpenLevelsList,
}) => {
  const frontierPage = Math.min(
    TOTAL_PAGES - 1,
    Math.floor((Math.max(1, progress.unlockedLevel) - 1) / LEVELS_PER_PAGE)
  );
  const [pageIdx, setPageIdx] = useState(frontierPage);

  useEffect(() => {
    setPageIdx(frontierPage);
  }, [frontierPage]);

  const startLevelId = pageIdx * LEVELS_PER_PAGE + 1;
  const endLevelId = Math.min(LEVELS.length, startLevelId + LEVELS_PER_PAGE - 1);
  const pageLevels = LEVELS.slice(startLevelId - 1, endLevelId);
  const zone = getZoneForLevel(startLevelId);

  const totalStarsEarned = Object.values(progress.levelStars).reduce((a, b) => a + b, 0);
  const rankLevel = Math.max(1, Math.floor(totalStarsEarned / 3) + 1);
  const rankPct = ((totalStarsEarned % 3) / 3) * 100 || (totalStarsEarned > 0 ? 65 : 25);

  const jumpToZone = (startLvl: number) => {
    setPageIdx(Math.floor((startLvl - 1) / LEVELS_PER_PAGE));
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-sky-200 select-none">
      {/* Painted Zone Backdrop spanning entire map stage */}
      <img
        src={zone.backdropUrl}
        alt={zone.name}
        referrerPolicy="no-referrer"
        style={zone.backdropFilter ? { filter: zone.backdropFilter } : undefined}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${zone.gradientOverlay} pointer-events-none`} />

      {/* Top Floating Player Profile Card + World Switcher */}
      <header className="relative shrink-0 z-20 px-2.5 sm:px-5 pt-2.5 pb-1 w-full max-w-7xl mx-auto">
        <div className="candy-panel-gold rounded-[26px] px-2.5 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Crown + Candy-Striped Avatar + Name + Rank XP Bar */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 text-left cursor-pointer group"
          >
            <div className="relative shrink-0">
              <svg viewBox="0 0 28 18" className="w-6 h-4 mx-auto -mb-1.5 relative z-10 drop-shadow">
                <path
                  d="M3 16L1.5 5l6.5 4L14 2l6 7 6.5-4L25 16H3z"
                  fill="#FACC15"
                  stroke="#92400E"
                  strokeWidth="1.6"
                />
              </svg>
              <AvatarPortrait avatarId={progress.avatarId} className="w-11 h-11 sm:w-12 sm:h-12" />
            </div>

            <div className="min-w-0 flex-1 max-w-xs">
              <div className="font-display font-black text-base sm:text-lg text-white text-outline-plum truncate leading-tight">
                {progress.playerName}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-5 h-5 rounded-md bg-gradient-to-b from-sky-400 to-blue-700 border border-amber-200 text-white font-display font-black text-[11px] flex items-center justify-center shrink-0 shadow">
                  {rankLevel}
                </span>
                <div className="h-3.5 flex-1 rounded-full bg-purple-950/75 border border-purple-300/60 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 via-pink-400 to-fuchsia-400"
                    style={{ width: `${rankPct}%` }}
                  />
                </div>
              </div>
            </div>
          </button>

          {/* Desktop/Tablet World Banner Info */}
          <div className="hidden md:flex flex-col items-center px-4 py-1 rounded-2xl bg-white/75 border border-purple-200 text-center">
            <span className="text-[10px] font-display font-black uppercase tracking-wider text-rose-600">
              Map {zone.chapterNumber} of {ZONES.length} · {totalStarsEarned} / {LEVELS.length * 3} Stars
            </span>
            <span className="font-display font-black text-sm text-purple-950">{zone.name}</span>
          </div>

          {/* Middle-Right: Hearts & Coins Dark Plum Pills */}
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
            <button
              onClick={onOpenShop}
              className="flex items-center gap-1.5 bg-purple-950/85 hover:bg-purple-900 border border-amber-300/50 rounded-full pl-1 pr-2.5 sm:pr-3 py-0.5 sm:py-1 text-white cursor-pointer"
            >
              <HeartLivesIcon lives={progress.lives} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span className="font-display font-extrabold text-xs sm:text-sm tabular-nums">
                {progress.lives}
              </span>
            </button>

            <button
              onClick={onOpenShop}
              className="flex items-center gap-1.5 bg-purple-950/85 hover:bg-purple-900 border border-amber-300/50 rounded-full pl-1.5 pr-2.5 sm:pr-3 py-0.5 sm:py-1 text-white cursor-pointer"
            >
              <CoinIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="font-display font-extrabold text-xs sm:text-sm tabular-nums">
                {progress.coins.toLocaleString()}
              </span>
            </button>
          </div>

          {/* Right: Glossy Sky-Blue Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 border-2 border-white shadow-md flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Settings className="w-5 h-5 drop-shadow" />
          </button>
        </div>

        {/* Chapter Stepper & 18-World Quick Atlas Button */}
        <div className="mt-1.5 flex items-center justify-between gap-2 max-w-2xl mx-auto lg:hidden">
          <div className="flex items-center gap-1.5 bg-white/92 border-2 border-amber-400 rounded-full px-1.5 py-1 shadow-md flex-1 min-w-0">
            <button
              onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
              disabled={pageIdx === 0}
              aria-label="Previous 5 levels"
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                pageIdx === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-white active:scale-90 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex-1 text-center min-w-0 px-1">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-rose-600 leading-none truncate">
                Map {zone.chapterNumber}/{ZONES.length}: {zone.name}
              </div>
              <div className="font-display font-black text-xs text-purple-950 truncate leading-tight">
                Levels {startLevelId}–{endLevelId}
              </div>
            </div>

            <button
              onClick={() => setPageIdx((p) => Math.min(TOTAL_PAGES - 1, p + 1))}
              disabled={pageIdx === TOTAL_PAGES - 1}
              aria-label="Next 5 levels"
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                pageIdx === TOTAL_PAGES - 1
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-white active:scale-90 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenLevelsList}
            className="shrink-0 flex items-center gap-1.5 bg-gradient-to-b from-purple-600 to-indigo-800 border-2 border-amber-300 rounded-full px-3 py-1.5 shadow-lg text-white font-display font-black text-[11px] hover:scale-105 active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>18 Maps</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Desktop Split (18-World Atlas Sidebar + Winding Road) / Mobile & Tablet Full Winding Road */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto flex overflow-hidden px-0 lg:px-5 lg:py-2 lg:gap-5">
        {/* Desktop Left Sidebar: 18 Maps World Atlas */}
        <aside className="hidden lg:flex w-80 shrink-0 flex-col candy-panel-gold rounded-[28px] overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-rose-600 text-white border-b-2 border-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-300" />
              <span className="font-display font-black text-base">World Atlas (18 Maps)</span>
            </div>
            <span className="text-[11px] font-bold bg-black/25 px-2 py-0.5 rounded-full tabular-nums">
              360 Lvls
            </span>
          </div>

          <div className="flex-1 overflow-y-auto saga-scroll p-2.5 space-y-1.5">
            {ZONES.map((z) => {
              const isSelected = z.id === zone.id;
              const isZoneUnlocked = progress.unlockedLevel >= z.levelRange[0];
              let zoneStars = 0;
              for (let id = z.levelRange[0]; id <= z.levelRange[1]; id++) {
                zoneStars += progress.levelStars[id] ?? 0;
              }
              return (
                <button
                  key={z.id}
                  onClick={() => jumpToZone(z.levelRange[0])}
                  className={`w-full text-left rounded-2xl p-2.5 border-2 transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-100 to-pink-100 border-amber-500 shadow-md'
                      : isZoneUnlocked
                        ? 'bg-white/85 hover:bg-white border-purple-200 text-purple-950'
                        : 'bg-purple-100/60 hover:bg-white/75 border-purple-200/60 text-purple-800/75'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] font-display font-black text-white flex items-center justify-center shrink-0 bg-gradient-to-b ${z.badgeBg}`}
                      >
                        {z.chapterNumber}
                      </span>
                      <span className="font-display font-black text-xs text-purple-950 truncate">
                        {z.name}
                      </span>
                    </div>
                    <div className="text-[10px] font-semibold text-purple-700 truncate pl-6">
                      Levels {z.levelRange[0]}–{z.levelRange[1]}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isZoneUnlocked ? (
                      <span className="flex items-center gap-0.5 text-[11px] font-display font-black text-amber-700 tabular-nums">
                        <GoldStarIcon filled={zoneStars > 0} className="w-3.5 h-3.5" />
                        {zoneStars}/60
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right / Primary Zero-Scroll Winding Saga Path Stage */}
        <main className="relative flex-1 h-full overflow-hidden lg:rounded-[30px] lg:border-[3px] lg:border-white/70 lg:shadow-2xl lg:bg-sky-900/10 lg:backdrop-blur-[1px]">
          {/* Desktop Chapter Floating Stepper */}
          <div className="hidden lg:flex absolute top-3 left-1/2 -translate-x-1/2 z-20 items-center gap-2 bg-white/95 border-2 border-amber-400 rounded-full px-2.5 py-1 shadow-xl">
            <button
              onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
              disabled={pageIdx === 0}
              aria-label="Previous 5 levels"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                pageIdx === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-white active:scale-90 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 text-center">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 leading-none">
                {zone.name} · Stage {pageIdx + 1}/{TOTAL_PAGES}
              </div>
              <div className="font-display font-black text-sm text-purple-950 leading-tight">
                Levels {startLevelId}–{endLevelId}
              </div>
            </div>
            <button
              onClick={() => setPageIdx((p) => Math.min(TOTAL_PAGES - 1, p + 1))}
              disabled={pageIdx === TOTAL_PAGES - 1}
              aria-label="Next 5 levels"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                pageIdx === TOTAL_PAGES - 1
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-400 text-white active:scale-90 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {pageLevels.map((lvl, idx) => {
              if (idx === pageLevels.length - 1) return null;
              const p1 = NODE_POSITIONS[idx];
              const p2 = NODE_POSITIONS[idx + 1];
              const cy1 = p1.y - 8;
              const cy2 = p2.y + 8;
              const completed = lvl.id < progress.unlockedLevel;

              return (
                <g key={`road-${lvl.id}`}>
                  <path
                    d={`M ${p1.x} ${p1.y} C ${p1.x} ${cy1}, ${p2.x} ${cy2}, ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke="rgba(120, 53, 15, 0.38)"
                    strokeWidth="16"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${p1.x} ${p1.y} C ${p1.x} ${cy1}, ${p2.x} ${cy2}, ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke={completed ? '#FDE68A' : '#E2E8F0'}
                    strokeWidth="10"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${p1.x} ${p1.y} C ${p1.x} ${cy1}, ${p2.x} ${cy2}, ${p2.x} ${p2.y}`}
                    fill="none"
                    stroke={completed ? '#F472B6' : '#CBD5E1'}
                    strokeWidth="4.5"
                    strokeDasharray="10 10"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {pageLevels.map((lvl, idx) => {
            const pos = NODE_POSITIONS[idx];
            const isUnlocked = lvl.id <= progress.unlockedLevel;
            const isCurrent = lvl.id === progress.unlockedLevel;
            const isBoss = lvl.id % 10 === 0 || lvl.difficulty === 'super_hard';
            const isCrown = isCurrent || isBoss;
            const stars = progress.levelStars[lvl.id] ?? 0;

            const nodeGradient = !isUnlocked
              ? 'bg-gradient-to-b from-slate-300 to-slate-500 text-slate-800 border-amber-100/70 cursor-not-allowed opacity-90'
              : lvl.difficulty === 'super_hard'
                ? 'bg-gradient-to-b from-fuchsia-400 via-purple-600 to-purple-900 text-white border-amber-300 cursor-pointer hover:scale-110'
                : lvl.difficulty === 'hard'
                  ? 'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-700 text-white border-amber-200 cursor-pointer hover:scale-110'
                  : 'bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 text-white border-amber-200 cursor-pointer hover:scale-110';

            return (
              <div
                key={lvl.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                {isCrown && (
                  <svg viewBox="0 0 36 22" className="w-8 h-5 sm:w-9 sm:h-6 -mb-1.5 z-10 drop-shadow">
                    <path
                      d="M4 19L2 6l8 5 8-9 8 9 8-5-2 13H4z"
                      fill="#FACC15"
                      stroke="#92400E"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <circle cx="18" cy="14" r="2.2" fill="#E11D48" />
                  </svg>
                )}

                <button
                  onClick={() => isUnlocked && onSelectLevel(lvl)}
                  disabled={!isUnlocked}
                  aria-label={`Level ${lvl.id}: ${lvl.name}`}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-17 lg:h-17 rounded-full flex items-center justify-center font-display font-black text-xl sm:text-2xl transition-transform border-[3px] shadow-xl ${nodeGradient} ${
                    isCurrent && isUnlocked ? 'scale-115 ring-4 ring-amber-300/75' : ''
                  }`}
                >
                  {isUnlocked ? (
                    <span className="drop-shadow tabular-nums">{lvl.id}</span>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-700" />
                  )}

                  {lvl.timeLimitSec && (
                    <span
                      title="Timed Blitz Level"
                      className="absolute -top-1 -right-1.5 w-5 h-5 rounded-full bg-amber-400 border border-white text-purple-950 flex items-center justify-center shadow"
                    >
                      <Clock className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  )}
                  {!lvl.timeLimitSec && (lvl.difficulty === 'hard' || lvl.difficulty === 'super_hard') && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-purple-950 border border-amber-300 text-amber-300 font-display font-black text-[8px] tracking-tighter shadow">
                      {lvl.difficulty === 'super_hard' ? 'BOSS' : 'HARD'}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-0.5 -mt-1.5 z-10">
                  {[1, 2, 3].map((s) => (
                    <GoldStarIcon
                      key={s}
                      filled={stars >= s}
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 drop-shadow ${s === 2 ? 'translate-y-0.5 scale-110' : ''}`}
                    />
                  ))}
                </div>

                {/* Desktop-only subtle level nameplate pill */}
                <span className="hidden lg:inline-block mt-1 px-2.5 py-0.5 rounded-full bg-purple-950/75 border border-white/25 text-[10px] font-bold text-white whitespace-nowrap shadow">
                  {lvl.name}
                </span>
              </div>
            );
          })}
        </main>
      </div>

      {/* Bottom Curved Sky-Blue Navigation Dock */}
      <footer className="relative shrink-0 z-20 candy-dock-blue px-3 sm:px-6 py-2">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onOpenShop}
              className="flex flex-col items-center text-white hover:scale-105 transition-transform cursor-pointer"
            >
              <TreasureChestIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow" />
              <span className="font-display font-extrabold text-[11px] sm:text-xs drop-shadow">Shop</span>
            </button>

            <button
              onClick={onOpenLevelsList}
              className="flex flex-col items-center text-white hover:scale-105 transition-transform cursor-pointer"
            >
              <MapPinIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow" />
              <span className="font-display font-extrabold text-[11px] sm:text-xs drop-shadow">Maps</span>
            </button>

            <button
              onClick={onOpenEvents}
              className="flex flex-col items-center text-white hover:scale-105 transition-transform cursor-pointer"
            >
              <TrophyEventIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow" />
              <span className="font-display font-extrabold text-[11px] sm:text-xs drop-shadow">Events</span>
            </button>
          </div>

          <button
            onClick={onPlayFrontier}
            className="candy-btn-green px-8 sm:px-12 py-2.5 rounded-full font-display font-black text-2xl sm:text-3xl tracking-wide text-white text-outline-green transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            PLAY
          </button>
        </div>
      </footer>
    </div>
  );
};
