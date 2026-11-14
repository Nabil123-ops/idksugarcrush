import React, { useEffect } from 'react';
import { CheckCircle2, Cloud, Crown, Settings, Volume2, VolumeX } from 'lucide-react';
import { TITLE_BACKDROP_URL } from '../data/levels';
import { CandyGlyph, SugarCrushLogo } from './CandyIcons';
import { PWAInstallButton } from './PWAInstallButton';

interface TitleScreenProps {
  soundEnabled: boolean;
  musicEnabled: boolean;
  signedInEmail: string | null;
  playerName: string;
  unlockedLevel: number;
  totalStars: number;
  onPlay: () => void;
  onOpenSaveProfile: () => void;
  onOpenSettings: () => void;
  onToggleAudio: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  soundEnabled,
  musicEnabled,
  signedInEmail,
  playerName,
  unlockedLevel,
  totalStars,
  onPlay,
  onOpenSaveProfile,
  onOpenSettings,
  onToggleAudio,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPlay]);

  const audioActive = soundEnabled || musicEnabled;

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between select-none">
      {/* Full-Bleed Pastel Candy Kingdom Scenic Backdrop */}
      <img
        src={TITLE_BACKDROP_URL}
        alt="Sugar Crush Candy Kingdom"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-pink-400/20 via-transparent to-purple-950/65 pointer-events-none" />

      {/* Floating Candy Sparkle Decor — scales gracefully on Mobile, Tablet & Desktop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[28%] left-[6%] sm:left-[10%] lg:left-[14%] animate-float-slow opacity-95"
          style={{ animationDelay: '0s' }}
        >
          <CandyGlyph color="red" className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 drop-shadow-xl" />
        </div>
        <div
          className="absolute top-[30%] right-[6%] sm:right-[10%] lg:right-[14%] animate-float-slow opacity-95"
          style={{ animationDelay: '1.2s' }}
        >
          <CandyGlyph color="blue" className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 drop-shadow-xl" />
        </div>
        <div
          className="absolute bottom-[30%] left-[9%] sm:left-[14%] lg:left-[18%] animate-float-slow opacity-90"
          style={{ animationDelay: '0.6s' }}
        >
          <CandyGlyph color="green" className="w-10 h-10 sm:w-13 sm:h-13 lg:w-15 lg:h-15 drop-shadow-xl" />
        </div>
        <div
          className="absolute bottom-[32%] right-[9%] sm:right-[14%] lg:right-[18%] animate-float-slow opacity-90"
          style={{ animationDelay: '1.8s' }}
        >
          <CandyGlyph color="yellow" className="w-10 h-10 sm:w-13 sm:h-13 lg:w-15 lg:h-15 drop-shadow-xl" />
        </div>
        <div
          className="hidden md:block absolute top-[54%] left-[7%] lg:left-[10%] animate-float-slow opacity-85"
          style={{ animationDelay: '2.1s' }}
        >
          <CandyGlyph color="purple" className="w-12 h-12 lg:w-14 lg:h-14 drop-shadow-xl" />
        </div>
        <div
          className="hidden md:block absolute top-[54%] right-[7%] lg:right-[10%] animate-float-slow opacity-85"
          style={{ animationDelay: '0.9s' }}
        >
          <CandyGlyph color="orange" className="w-12 h-12 lg:w-14 lg:h-14 drop-shadow-xl" />
        </div>
      </div>

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5">
        <button
          onClick={onToggleAudio}
          aria-label={audioActive ? 'Mute audio' : 'Enable audio'}
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-b from-fuchsia-400 via-purple-500 to-purple-700 border-[2.5px] border-purple-200 shadow-[0_5px_15px_rgba(126,34,206,0.5),inset_0_2px_3px_rgba(255,255,255,0.75)] flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {audioActive ? (
            <Volume2 className="w-6 h-6 drop-shadow" />
          ) : (
            <VolumeX className="w-6 h-6 text-purple-200 drop-shadow" />
          )}
        </button>

        {signedInEmail ? (
          <button
            onClick={onOpenSaveProfile}
            className="px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-emerald-300/75 text-emerald-200 text-xs font-display font-extrabold flex items-center gap-1.5 shadow-lg backdrop-blur-sm cursor-pointer hover:bg-purple-900"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[160px] sm:max-w-[240px]">{playerName} · Cloud Synced</span>
          </button>
        ) : (
          <div className="px-3.5 py-1.5 rounded-full bg-purple-950/75 border border-amber-300/65 text-amber-200 text-xs font-display font-extrabold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
            <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="whitespace-nowrap">18 Worlds · 360 Levels</span>
          </div>
        )}

        <button
          onClick={onOpenSettings}
          aria-label="Open settings"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 border-[2.5px] border-sky-100 shadow-[0_5px_15px_rgba(2,132,199,0.5),inset_0_2px_3px_rgba(255,255,255,0.8)] flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Settings className="w-6 h-6 drop-shadow" />
        </button>
      </header>

      {/* Center Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-1 px-4 my-auto">
        <SugarCrushLogo className="w-[290px] sm:w-[375px] lg:w-[440px] max-w-full drop-shadow-2xl" />
      </div>

      {/* Lower-Center Main Menu & Play CTA */}
      <main className="relative z-10 flex flex-col items-center px-5 pb-6 sm:pb-8 lg:pb-10">
        <div className="font-display font-black text-xl sm:text-2xl tracking-wide text-white text-outline-plum mb-1.5">
          MAIN MENU
        </div>

        {unlockedLevel > 1 && (
          <div className="mb-2.5 text-xs font-display font-extrabold text-amber-200 bg-purple-950/75 border border-amber-300/60 px-3.5 py-1 rounded-full tabular-nums shadow">
            Level {unlockedLevel} / 360 · {totalStars} Stars Earned
          </div>
        )}

        <button
          onClick={onPlay}
          className="candy-btn-green animate-pulse-green w-full max-w-[300px] sm:max-w-[340px] py-3 sm:py-3.5 rounded-full font-display font-black text-4xl tracking-wider text-white text-outline-green transition-transform active:scale-95 cursor-pointer mb-3"
        >
          PLAY
        </button>

        <button
          onClick={onOpenSaveProfile}
          className="candy-btn-blue flex items-center justify-center gap-2 w-full max-w-[290px] sm:max-w-[320px] py-2.5 px-4 rounded-full font-display font-extrabold text-xs sm:text-sm tracking-wide text-white drop-shadow transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Cloud className="w-4 h-4 fill-white text-white shrink-0" />
          <span>{signedInEmail ? 'GOOGLE CLOUD SAVED' : 'GOOGLE SIGN IN · SAVE'}</span>
        </button>

        <PWAInstallButton variant="compact" />
      </main>
    </div>
  );
};
