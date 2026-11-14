import React from 'react';
import { AvatarId } from '../types/game';

export const SugarCrushLogo: React.FC<{ className?: string }> = ({ className = 'w-80' }) => {
  const topLetters = [
    { ch: 'S', x: 76, y: 82, rot: -8, fill: ['#FF85A1', '#E11D48'] },
    { ch: 'U', x: 142, y: 74, rot: -3, fill: ['#FEF08A', '#F59E0B'] },
    { ch: 'G', x: 210, y: 70, rot: 0, fill: ['#86EFAC', '#16A34A'] },
    { ch: 'A', x: 278, y: 74, rot: 3, fill: ['#7DD3FC', '#0284C7'] },
    { ch: 'R', x: 344, y: 82, rot: 8, fill: ['#E879F9', '#9333EA'] },
  ];

  const botLetters = [
    { ch: 'C', x: 80, y: 158, rot: 6, fill: ['#E879F9', '#9333EA'] },
    { ch: 'R', x: 145, y: 162, rot: 2, fill: ['#7DD3FC', '#0284C7'] },
    { ch: 'U', x: 210, y: 164, rot: 0, fill: ['#86EFAC', '#16A34A'] },
    { ch: 'S', x: 275, y: 162, rot: -2, fill: ['#FEF08A', '#F59E0B'] },
    { ch: 'H', x: 340, y: 158, rot: -6, fill: ['#FF85A1', '#E11D48'] },
  ];

  return (
    <svg
      viewBox="0 0 420 205"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sugar Crush"
    >
      <defs>
        <filter id="logoShadow" x="-15%" y="-15%" width="130%" height="145%">
          <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#4C0519" floodOpacity="0.55" />
        </filter>
        {[...topLetters, ...botLetters].map((l, idx) => (
          <linearGradient key={`lg-${idx}`} id={`letterGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={l.fill[0]} />
            <stop offset="100%" stopColor={l.fill[1]} />
          </linearGradient>
        ))}
      </defs>

      {/* Decorative background lollipops & jellybeans */}
      <g filter="url(#logoShadow)">
        {/* Top pink swirl lollipop */}
        <line x1="252" y1="36" x2="236" y2="80" stroke="#FFF1F2" strokeWidth="5" strokeLinecap="round" />
        <circle cx="254" cy="28" r="20" fill="#FB7185" stroke="#FFFFFF" strokeWidth="3" />
        <path d="M254 28c4 0 6-3 6-6 0-5-5-8-10-8-7 0-11 6-11 13 0 8 7 13 15 13" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

        {/* Left green swirl lollipop */}
        <circle cx="48" cy="120" r="17" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M48 120c3 0 5-2 5-5 0-4-4-7-8-7-6 0-9 5-9 11" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

        {/* Right orange swirl lollipop */}
        <circle cx="372" cy="122" r="16" fill="#F97316" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M372 122c3 0 5-2 5-5 0-4-4-7-8-7-6 0-9 5-9 11" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

        {/* Top mini jellybeans */}
        <ellipse cx="144" cy="30" rx="13" ry="9" transform="rotate(-18 144 30)" fill="#FACC15" stroke="#FEF9C3" strokeWidth="2" />
        <ellipse cx="182" cy="22" rx="12" ry="8" transform="rotate(12 182 22)" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="2" />
        <ellipse cx="212" cy="24" rx="13" ry="9" transform="rotate(-8 212 24)" fill="#C084FC" stroke="#F3E8FF" strokeWidth="2" />
        <ellipse cx="295" cy="30" rx="12" ry="8" transform="rotate(20 295 30)" fill="#4ADE80" stroke="#DCFCE7" strokeWidth="2" />
      </g>

      {/* SUGAR row */}
      <g filter="url(#logoShadow)">
        {topLetters.map((l, idx) => (
          <g key={`t-${l.ch}-${idx}`} transform={`translate(${l.x}, ${l.y}) rotate(${l.rot})`}>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily="Outfit, system-ui, sans-serif"
              fontWeight="900"
              fontSize="68"
              stroke="#B45309"
              strokeWidth="14"
              strokeLinejoin="round"
              fill="#B45309"
            >
              {l.ch}
            </text>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily="Outfit, system-ui, sans-serif"
              fontWeight="900"
              fontSize="68"
              stroke="#4C0519"
              strokeWidth="8"
              strokeLinejoin="round"
              fill="#4C0519"
            >
              {l.ch}
            </text>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily="Outfit, system-ui, sans-serif"
              fontWeight="900"
              fontSize="68"
              fill={`url(#letterGrad-${idx})`}
            >
              {l.ch}
            </text>
            {/* White frosting drip cap */}
            <path
              d="M-20 -44 C-10 -50 10 -50 20 -44 C22 -38 14 -34 11 -39 C7 -31 -1 -31 -4 -39 C-9 -33 -17 -35 -20 -44 Z"
              fill="#FFFFFF"
            />
            <circle cx="-8" cy="-43" r="2" fill="#FB7185" />
            <circle cx="4" cy="-44" r="2" fill="#38BDF8" />
            <circle cx="13" cy="-42" r="1.8" fill="#FACC15" />
          </g>
        ))}

        {/* CRUSH row */}
        {botLetters.map((l, idx) => (
          <g key={`b-${l.ch}-${idx}`} transform={`translate(${l.x}, ${l.y}) rotate(${l.rot})`}>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily="Outfit, system-ui, sans-serif"
              fontWeight="900"
              fontSize="68"
              stroke="#B45309"
              strokeWidth="14"
              strokeLinejoin="round"
              fill="#B45309"
            >
              {l.ch}
            </text>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily="Outfit, system-ui, sans-serif"
              fontWeight="900"
              fontSize="68"
              stroke="#4C0519"
              strokeWidth="8"
              strokeLinejoin="round"
              fill="#4C0519"
            >
              {l.ch}
            </text>
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontFamily="Outfit, system-ui, sans-serif"
              fontWeight="900"
              fontSize="68"
              fill={`url(#letterGrad-${idx + 5})`}
            >
              {l.ch}
            </text>
            {/* Frosting cap */}
            <path
              d="M-19 -44 C-9 -50 9 -50 19 -44 C20 -38 13 -35 9 -39 C5 -32 -2 -32 -6 -39 C-10 -34 -16 -36 -19 -44 Z"
              fill="#FFFFFF"
            />
            <circle cx="-6" cy="-43" r="2" fill="#4ADE80" />
            <circle cx="7" cy="-43" r="2" fill="#FB7185" />
          </g>
        ))}
      </g>
    </svg>
  );
};

export const FlowerGearIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  const petalColors = ['#F43F5E', '#FB923C', '#FACC15', '#4ADE80', '#38BDF8', '#818CF8', '#C084FC', '#F472B6'];
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      {petalColors.map((col, i) => {
        const angle = i * 45;
        return (
          <circle
            key={i}
            cx={32 + Math.cos((angle * Math.PI) / 180) * 19}
            cy={32 + Math.sin((angle * Math.PI) / 180) * 19}
            r="9.5"
            fill={col}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        );
      })}
      <circle cx="32" cy="32" r="16" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="2.5" />
      <path
        d="M32 23.5l1.8 2.4 2.9-.4.7 2.8 2.7 1-.7 2.8 1.9 2.2-1.9 2.2.7 2.8-2.7 1-.7 2.8-2.9-.4-1.8 2.4-1.8-2.4-2.9.4-.7-2.8-2.7-1 .7-2.8-1.9-2.2 1.9-2.2-.7-2.8 2.7-1 .7-2.8 2.9.4L32 23.5z"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <circle cx="32" cy="32" r="4" fill="#0284C7" />
    </svg>
  );
};

export const TreasureChestIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none">
    <rect x="5" y="16" width="30" height="18" rx="4" fill="#92400E" stroke="#FBBF24" strokeWidth="2.2" />
    <path d="M5 17c0-6 5-10 15-10s15 4 15 10H5z" fill="#B45309" stroke="#FBBF24" strokeWidth="2.2" />
    <rect x="11" y="7" width="4" height="27" fill="#FBBF24" />
    <rect x="25" y="7" width="4" height="27" fill="#FBBF24" />
    <rect x="16.5" y="15" width="7" height="8" rx="2" fill="#FEF08A" stroke="#B45309" strokeWidth="1.5" />
    <circle cx="20" cy="19" r="1.4" fill="#78350F" />
  </svg>
);

export const MapPinIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none">
    <path d="M5 11l10-4 10 4 10-4v22l-10 4-10-4-10 4V11z" fill="#FEF3C7" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
    <path d="M15 7v22M25 11v22" stroke="#D97706" strokeWidth="1.4" strokeOpacity="0.45" />
    <path d="M9 22c4-5 10-2 15-6 3-2 6-1 8 1" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M21 5c-4 0-7 3-7 7 0 5 7 12 7 12s7-7 7-12c0-4-3-7-7-7z" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1.8" />
    <circle cx="21" cy="12" r="2.4" fill="#FFFFFF" />
  </svg>
);

export const TrophyEventIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none">
    <path d="M12 10H7c0 6 3 9 6 10M28 10h5c0 6-3 9-6 10" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M11 7h18v10c0 6-4 10-9 10s-9-4-9-10V7z" fill="#FACC15" stroke="#FEF08A" strokeWidth="2" />
    <path d="M20 27v5M14 34h12" stroke="#D97706" strokeWidth="3.2" strokeLinecap="round" />
    <rect x="12" y="32" width="16" height="4" rx="2" fill="#B45309" stroke="#FDE047" strokeWidth="1.2" />
    <path d="M20 11l1.5 3.1 3.4.5-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4-2.5-2.4 3.4-.5L20 11z" fill="#FFFBEB" />
  </svg>
);

export const HeartLivesIcon: React.FC<{ lives: number; className?: string }> = ({
  lives,
  className = 'w-7 h-7',
}) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 28 26" className="w-full h-full drop-shadow" fill="none">
      <path
        d="M14 24.5S2.5 16.8 2.5 8.8C2.5 4.9 5.5 2 9.2 2c2.2 0 4.1 1.1 4.8 2.7C14.7 3.1 16.6 2 18.8 2c3.7 0 6.7 2.9 6.7 6.8 0 8-11.5 15.7-11.5 15.7z"
        fill="#E11D48"
        stroke="#FFE4E6"
        strokeWidth="1.8"
      />
      <ellipse cx="8.5" cy="7" rx="2.5" ry="1.3" transform="rotate(-30 8.5 7)" fill="#FFFFFF" fillOpacity="0.65" />
    </svg>
    <span className="absolute font-display font-black text-[11px] text-white leading-none pt-0.5 tabular-nums">
      {lives}
    </span>
  </div>
);

export const AvatarPortrait: React.FC<{ avatarId: AvatarId; className?: string }> = ({
  avatarId,
  className = 'w-12 h-12',
}) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden border-2 border-white shadow-md flex items-center justify-center ${className}`}
      style={{
        background:
          'repeating-linear-gradient(135deg, #FDA4AF, #FDA4AF 6px, #FFF1F2 6px, #FFF1F2 12px)',
      }}
    >
      <div className="w-[82%] h-[82%] rounded-lg bg-gradient-to-b from-sky-200 to-rose-100 flex items-center justify-center border border-rose-300 shadow-inner">
        {avatarId === 'princess' && (
          <svg viewBox="0 0 36 36" className="w-9 h-9">
            <circle cx="18" cy="18" r="10" fill="#FDE68A" />
            <path d="M8 16c0-6 4.5-10 10-10s10 4 10 10c-2-3-5-4-10-4s-8 1-10 4z" fill="#B45309" />
            <circle cx="18" cy="20" r="8" fill="#FED7AA" />
            <circle cx="15" cy="19" r="1.4" fill="#1E293B" />
            <circle cx="21" cy="19" r="1.4" fill="#1E293B" />
            <path d="M15.5 23.5c1.5 1.2 3.5 1.2 5 0" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M12 10l2-4 4 2.5L22 6l2 4H12z" fill="#FACC15" stroke="#B45309" strokeWidth="1" />
          </svg>
        )}
        {avatarId === 'crown' && (
          <svg viewBox="0 0 36 36" className="w-8 h-8">
            <path d="M6 25L4 12l8 6 6-9 6 9 8-6-2 13H6z" fill="#FACC15" stroke="#B45309" strokeWidth="1.6" />
            <circle cx="18" cy="19" r="3" fill="#E11D48" />
          </svg>
        )}
        {avatarId === 'gummy' && (
          <svg viewBox="0 0 36 36" className="w-8 h-8">
            <circle cx="12" cy="11" r="4" fill="#FB7185" />
            <circle cx="24" cy="11" r="4" fill="#FB7185" />
            <circle cx="18" cy="20" r="9" fill="#F43F5E" />
            <circle cx="15" cy="18" r="1.4" fill="#FFF" />
            <circle cx="21" cy="18" r="1.4" fill="#FFF" />
            <ellipse cx="18" cy="22" rx="3" ry="2" fill="#FFE4E6" />
          </svg>
        )}
        {avatarId === 'lollipop' && <CandyGlyph color="blue" className="w-8 h-8" />}
      </div>
    </div>
  );
};

export const GoldStarIcon: React.FC<{ filled?: boolean; className?: string }> = ({
  filled = true,
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M12 2.2l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.1l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.2z"
      fill={filled ? '#FACC15' : 'rgba(88, 28, 135, 0.22)'}
      stroke={filled ? '#B45309' : 'rgba(139, 92, 246, 0.35)'}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {filled && (
      <path d="M12 4.5l1.6 3.5-2.6 1.4-1.2-2.4L12 4.5z" fill="#FEF9C3" fillOpacity="0.7" />
    )}
  </svg>
);

export const CoinIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#FEF08A" strokeWidth="2" />
    <circle cx="12" cy="12" r="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
    <path
      d="M12 7.5v9M9.5 10c0-1 1.1-1.6 2.5-1.6s2.5.6 2.5 1.6-1 1.4-2.5 1.8-2.5.8-2.5 1.9 1.1 1.7 2.5 1.7 2.5-.7 2.5-1.7"
      stroke="#92400E"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export const JellyIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="3" y="3" width="18" height="18" rx="5" fill="#F43F5E" stroke="#FFE4E6" strokeWidth="1.8" />
    <rect x="6" y="5.5" width="10" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.55" />
  </svg>
);

export const CherryIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M8.5 14c1-4 3-7 5-9.5M15.5 15c0-3.5-.5-6.5-2-10.5" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="16.5" cy="5.5" rx="3" ry="1.5" transform="rotate(-25 16.5 5.5)" fill="#22C55E" />
    <circle cx="8" cy="16.5" r="4.2" fill="#E11D48" stroke="#FFE4E6" strokeWidth="1.2" />
    <circle cx="16" cy="17" r="4.2" fill="#BE123C" stroke="#FFE4E6" strokeWidth="1.2" />
    <circle cx="6.8" cy="15" r="1.2" fill="#FFFFFF" fillOpacity="0.7" />
    <circle cx="14.8" cy="15.5" r="1.2" fill="#FFFFFF" fillOpacity="0.7" />
  </svg>
);

export const HazelnutIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M12 20.5c4.5-1.5 6.5-5.5 5.5-9.5H6.5c-1 4 1 8 5.5 9.5z" fill="#D97706" stroke="#78350F" strokeWidth="1.4" />
    <path d="M5.5 11.5c0-3.2 2.9-5.5 6.5-5.5s6.5 2.3 6.5 5.5H5.5z" fill="#78350F" stroke="#451A03" strokeWidth="1.3" />
    <path d="M12 6V3.5" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LollipopHammerIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none">
    {/* Candy striped handle */}
    <path d="M9 28L19 18" stroke="#F472B6" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M9 28L19 18" stroke="#FFFFFF" strokeWidth="4.5" strokeDasharray="3 4" strokeLinecap="round" />
    {/* Mallet cylinder */}
    <g transform="rotate(-45 22 14)">
      <rect x="13" y="8" width="18" height="12" rx="5" fill="#EC4899" stroke="#FDF2F8" strokeWidth="1.8" />
      <ellipse cx="16" cy="14" rx="2.8" ry="5" fill="#FBCFE8" />
      <path d="M16 14c1 0 1.6-1 1.6-2 0-1.5-1.5-2.5-3-2.5" stroke="#EC4899" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const FreeSwitchIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none">
    <path
      d="M7 13h17l-4-4M29 23H12l4 4"
      strokeWidth="3.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#F59E0B"
    />
    <path d="M7 13h17l-4-4" stroke="#FBBF24" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M29 23H12l4 4" stroke="#0EA5E9" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ColorBombIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none">
    <defs>
      <radialGradient id="rainbowBombGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="28%" stopColor="#4ADE80" />
        <stop offset="56%" stopColor="#38BDF8" />
        <stop offset="82%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#E11D48" />
      </radialGradient>
    </defs>
    {/* Lit fuse */}
    <path d="M24 10c2-3 5-3 7-5" stroke="#CBD5E1" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="31.5" cy="4.5" r="2.5" fill="#FDE047" />
    <rect x="21" y="9" width="6" height="4" rx="1.5" transform="rotate(35 24 11)" fill="#94A3B8" />
    {/* Rainbow sphere */}
    <circle cx="17" cy="20" r="11" fill="url(#rainbowBombGrad)" stroke="#FFFFFF" strokeWidth="2" />
    <ellipse cx="13" cy="15" rx="3.5" ry="1.8" transform="rotate(-30 13 15)" fill="#FFFFFF" fillOpacity="0.7" />
  </svg>
);

export const CrossWandIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none">
    <path d="M7 29L20 16" stroke="#F59E0B" strokeWidth="4.2" strokeLinecap="round" />
    <path d="M7 29L20 16" stroke="#FEF08A" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 3" />
    <path
      d="M23 4l2.4 5.8 6.1.6-4.6 4.1 1.4 6-5.3-3.2-5.3 3.2 1.4-6-4.6-4.1 6.1-.6L23 4z"
      fill="#FACC15"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M23 1v3M23 23v3M10 13H7M35 13h-3" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const SugarShuffleIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none">
    <path
      d="M8 14a11 11 0 0 1 19-4.5"
      stroke="#EC4899"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path d="M23 5l5 5.2-6.8 1.2L23 5z" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1.3" strokeLinejoin="round" />
    <path
      d="M28 22a11 11 0 0 1-19 4.5"
      stroke="#0EA5E9"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path d="M13 31l-5-5.2 6.8-1.2L13 31z" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="18" cy="18" r="4.2" fill="#FACC15" stroke="#FFFFFF" strokeWidth="1.6" />
  </svg>
);

export const GoldenCrownPreIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none">
    <path
      d="M5 26L3 11l8 6 7-10 7 10 8-6-2 15H5z"
      fill="#FACC15"
      stroke="#92400E"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="19" r="3" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1" />
    <circle cx="10" cy="21" r="2" fill="#38BDF8" />
    <circle cx="26" cy="21" r="2" fill="#4ADE80" />
  </svg>
);

export const CandyGlyph: React.FC<{
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
  className?: string;
}> = ({ color, className = 'w-8 h-8' }) => {
  const fills: Record<string, [string, string]> = {
    red: ['#FF758F', '#BE123C'],
    orange: ['#FDBA74', '#EA580C'],
    yellow: ['#FEF08A', '#CA8A04'],
    green: ['#86EFAC', '#16A34A'],
    blue: ['#7DD3FC', '#0284C7'],
    purple: ['#E879F9', '#7E22CE'],
  };
  const [c1, c2] = fills[color];
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <defs>
        <radialGradient id={`cg-${color}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
      </defs>
      {color === 'red' && (
        <path
          d="M6 15c-1-6 14-10 19-4 3 4 1 11-4 12-4 1-5-3-8-2-3 1-6 1-7-6z"
          fill={`url(#cg-${color})`}
          stroke="#FFE4E6"
          strokeWidth="1.5"
        />
      )}
      {color === 'orange' && (
        <ellipse
          cx="16"
          cy="16"
          rx="9.5"
          ry="12"
          fill={`url(#cg-${color})`}
          stroke="#FFEDD5"
          strokeWidth="1.5"
        />
      )}
      {color === 'yellow' && (
        <path
          d="M16 4c7 4 11 10 9 17-3 5-15 5-18 0-2-7 2-13 9-17z"
          fill={`url(#cg-${color})`}
          stroke="#FEFCE8"
          strokeWidth="1.5"
        />
      )}
      {color === 'green' && (
        <rect
          x="5"
          y="5"
          width="22"
          height="22"
          rx="7"
          fill={`url(#cg-${color})`}
          stroke="#DCFCE7"
          strokeWidth="1.5"
        />
      )}
      {color === 'blue' && (
        <>
          <circle cx="16" cy="16" r="11" fill={`url(#cg-${color})`} stroke="#E0F2FE" strokeWidth="1.5" />
          <path
            d="M16 16c1.5 0 2.5-1 2.5-2.2 0-2-2-3.3-4-3.3-3 0-5 2.5-5 5.5 0 4 3.5 6.5 7.5 6.5"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}
      {color === 'purple' && (
        <>
          <circle cx="12" cy="11" r="5" fill={`url(#cg-${color})`} />
          <circle cx="20" cy="11" r="5" fill={`url(#cg-${color})`} />
          <circle cx="10" cy="18" r="5" fill={`url(#cg-${color})`} />
          <circle cx="22" cy="18" r="5" fill={`url(#cg-${color})`} />
          <circle cx="16" cy="21" r="5.2" fill={`url(#cg-${color})`} stroke="#FAE8FF" strokeWidth="1.2" />
        </>
      )}
      <ellipse cx="12" cy="10" rx="3.2" ry="1.4" transform="rotate(-25 12 10)" fill="#FFFFFF" fillOpacity="0.65" />
    </svg>
  );
};
