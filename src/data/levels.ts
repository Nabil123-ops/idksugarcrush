import { CandyColor, LevelDefinition, LevelDifficulty, LevelObjective, ZoneId } from '../types/game';
import titleKingdomImg from '../assets/images/title_kingdom_backdrop_1794672213905.jpg';
import sugarMeadowImg from '../assets/images/zone_sugar_meadow_1794672214659.jpg';
import caramelCanyonImg from '../assets/images/zone_caramel_canyon_1794672211955.jpg';
import crystalGlacierImg from '../assets/images/zone_crystal_glacier_1794672211427.jpg';

export interface ZoneMeta {
  id: ZoneId;
  chapterNumber: number;
  name: string;
  subtitle: string;
  levelRange: [number, number];
  backdropUrl: string;
  backdropFilter?: string;
  accentColor: string;
  badgeBg: string;
  gradientOverlay: string;
}

export const ZONES: ZoneMeta[] = [
  {
    id: 'sugar_meadow',
    chapterNumber: 1,
    name: 'Sugar Meadow',
    subtitle: 'Sunlit wafer bridges & gentle jelly hills',
    levelRange: [1, 20],
    backdropUrl: sugarMeadowImg,
    accentColor: '#E11D48',
    badgeBg: 'from-rose-500 to-pink-600',
    gradientOverlay: 'from-pink-900/20 via-transparent to-emerald-950/20',
  },
  {
    id: 'caramel_canyon',
    chapterNumber: 2,
    name: 'Caramel Canyon',
    subtitle: 'Golden toffee cliffs & butterscotch falls',
    levelRange: [21, 40],
    backdropUrl: caramelCanyonImg,
    accentColor: '#D97706',
    badgeBg: 'from-amber-500 to-orange-600',
    gradientOverlay: 'from-amber-950/25 via-transparent to-orange-950/20',
  },
  {
    id: 'crystal_glacier',
    chapterNumber: 3,
    name: 'Crystal Glacier',
    subtitle: 'Peppermint peaks & frosted aurora spires',
    levelRange: [41, 60],
    backdropUrl: crystalGlacierImg,
    accentColor: '#0284C7',
    badgeBg: 'from-sky-500 to-indigo-600',
    gradientOverlay: 'from-indigo-950/30 via-transparent to-sky-950/20',
  },
  {
    id: 'berry_blossom',
    chapterNumber: 4,
    name: 'Berry Blossom',
    subtitle: 'Velvet plum groves & sparkling sakura trails',
    levelRange: [61, 80],
    backdropUrl: sugarMeadowImg,
    backdropFilter: 'hue-rotate(32deg) saturate(1.25)',
    accentColor: '#9333EA',
    badgeBg: 'from-fuchsia-500 to-purple-700',
    gradientOverlay: 'from-fuchsia-950/30 via-transparent to-purple-950/35',
  },
  {
    id: 'starlight_citadel',
    chapterNumber: 5,
    name: 'Starlight Citadel',
    subtitle: 'Cosmic sugar towers & twinkling constellation gates',
    levelRange: [81, 100],
    backdropUrl: crystalGlacierImg,
    backdropFilter: 'hue-rotate(64deg) contrast(1.08) saturate(1.2)',
    accentColor: '#4F46E5',
    badgeBg: 'from-violet-600 via-purple-700 to-indigo-900',
    gradientOverlay: 'from-indigo-950/40 via-purple-900/15 to-amber-950/30',
  },
  {
    id: 'minty_lagoon',
    chapterNumber: 6,
    name: 'Minty Lagoon',
    subtitle: 'Spearmint tides & crystalline coral reefs',
    levelRange: [101, 120],
    backdropUrl: crystalGlacierImg,
    backdropFilter: 'hue-rotate(-42deg) saturate(1.18) brightness(1.03)',
    accentColor: '#0D9488',
    badgeBg: 'from-teal-500 to-emerald-600',
    gradientOverlay: 'from-teal-950/30 via-transparent to-cyan-950/25',
  },
  {
    id: 'honeycomb_hollow',
    chapterNumber: 7,
    name: 'Honeycomb Hollow',
    subtitle: 'Warm nectar arches & golden amber cells',
    levelRange: [121, 140],
    backdropUrl: caramelCanyonImg,
    backdropFilter: 'hue-rotate(16deg) saturate(1.3) brightness(1.04)',
    accentColor: '#CA8A04',
    badgeBg: 'from-yellow-500 to-amber-600',
    gradientOverlay: 'from-yellow-950/25 via-transparent to-amber-950/30',
  },
  {
    id: 'truffle_woods',
    chapterNumber: 8,
    name: 'Truffle Woods',
    subtitle: 'Cocoa canopy trails & hazelnut timber bridges',
    levelRange: [141, 160],
    backdropUrl: caramelCanyonImg,
    backdropFilter: 'hue-rotate(-22deg) contrast(1.12) saturate(0.95)',
    accentColor: '#9A3412',
    badgeBg: 'from-orange-700 to-amber-900',
    gradientOverlay: 'from-stone-950/35 via-transparent to-orange-950/30',
  },
  {
    id: 'sorbet_dunes',
    chapterNumber: 9,
    name: 'Sorbet Dunes',
    subtitle: 'Tangerine sandwaves & mango sunset plateaus',
    levelRange: [161, 180],
    backdropUrl: sugarMeadowImg,
    backdropFilter: 'hue-rotate(-38deg) saturate(1.28)',
    accentColor: '#EA580C',
    badgeBg: 'from-orange-500 to-rose-600',
    gradientOverlay: 'from-orange-950/25 via-transparent to-pink-950/25',
  },
  {
    id: 'marshmallow_peaks',
    chapterNumber: 10,
    name: 'Marshmallow Peaks',
    subtitle: 'Fluffy cloud ridges & spun-sugar summits',
    levelRange: [181, 200],
    backdropUrl: titleKingdomImg,
    backdropFilter: 'saturate(1.15) brightness(1.03)',
    accentColor: '#EC4899',
    badgeBg: 'from-pink-400 to-rose-600',
    gradientOverlay: 'from-pink-950/25 via-transparent to-sky-950/25',
  },
  {
    id: 'fizzing_springs',
    chapterNumber: 11,
    name: 'Fizzing Springs',
    subtitle: 'Effervescent lemon geysers & lime cascades',
    levelRange: [201, 220],
    backdropUrl: sugarMeadowImg,
    backdropFilter: 'hue-rotate(92deg) saturate(1.2)',
    accentColor: '#16A34A',
    badgeBg: 'from-lime-500 to-emerald-600',
    gradientOverlay: 'from-emerald-950/25 via-transparent to-lime-950/25',
  },
  {
    id: 'gummy_harbor',
    chapterNumber: 12,
    name: 'Gummy Harbor',
    subtitle: 'Blueberry piers & candy-cane lighthouse docks',
    levelRange: [221, 240],
    backdropUrl: crystalGlacierImg,
    backdropFilter: 'hue-rotate(24deg) saturate(1.3)',
    accentColor: '#2563EB',
    badgeBg: 'from-blue-500 to-indigo-700',
    gradientOverlay: 'from-blue-950/30 via-transparent to-cyan-950/25',
  },
  {
    id: 'cinnamon_bastion',
    chapterNumber: 13,
    name: 'Cinnamon Bastion',
    subtitle: 'Crimson spice battlements & candied turrets',
    levelRange: [241, 260],
    backdropUrl: caramelCanyonImg,
    backdropFilter: 'hue-rotate(-45deg) saturate(1.35)',
    accentColor: '#BE123C',
    badgeBg: 'from-red-600 to-rose-800',
    gradientOverlay: 'from-rose-950/35 via-transparent to-amber-950/25',
  },
  {
    id: 'prism_cavern',
    chapterNumber: 14,
    name: 'Prism Cavern',
    subtitle: 'Refracted rock-candy vaults & diamond geodes',
    levelRange: [261, 280],
    backdropUrl: crystalGlacierImg,
    backdropFilter: 'hue-rotate(120deg) contrast(1.1) saturate(1.25)',
    accentColor: '#A855F7',
    badgeBg: 'from-purple-500 to-fuchsia-700',
    gradientOverlay: 'from-purple-950/35 via-transparent to-fuchsia-950/30',
  },
  {
    id: 'macaron_promenade',
    chapterNumber: 15,
    name: 'Macaron Promenade',
    subtitle: 'Pistachio pavilions & pastel royal boulevards',
    levelRange: [281, 300],
    backdropUrl: titleKingdomImg,
    backdropFilter: 'hue-rotate(-28deg) saturate(1.22)',
    accentColor: '#DB2777',
    badgeBg: 'from-rose-400 via-fuchsia-500 to-purple-600',
    gradientOverlay: 'from-fuchsia-950/25 via-transparent to-rose-950/25',
  },
  {
    id: 'velvet_nebula',
    chapterNumber: 16,
    name: 'Velvet Nebula',
    subtitle: 'Midnight berry cosmos & stardust ribbons',
    levelRange: [301, 320],
    backdropUrl: crystalGlacierImg,
    backdropFilter: 'hue-rotate(84deg) brightness(0.92) contrast(1.15) saturate(1.3)',
    accentColor: '#7C3AED',
    badgeBg: 'from-indigo-700 via-violet-700 to-purple-900',
    gradientOverlay: 'from-slate-950/40 via-purple-950/20 to-indigo-950/40',
  },
  {
    id: 'aurora_glaze_spire',
    chapterNumber: 17,
    name: 'Aurora Glaze Spire',
    subtitle: 'Shimmering ribbon towers above frosted clouds',
    levelRange: [321, 340],
    backdropUrl: sugarMeadowImg,
    backdropFilter: 'hue-rotate(155deg) saturate(1.22)',
    accentColor: '#0891B2',
    badgeBg: 'from-cyan-500 via-sky-600 to-indigo-700',
    gradientOverlay: 'from-cyan-950/35 via-transparent to-indigo-950/35',
  },
  {
    id: 'imperial_sugar_throne',
    chapterNumber: 18,
    name: 'Imperial Sugar Throne',
    subtitle: 'Grand royal palace & Eternal Candy Crown',
    levelRange: [341, 360],
    backdropUrl: titleKingdomImg,
    backdropFilter: 'hue-rotate(14deg) contrast(1.1) saturate(1.32)',
    accentColor: '#B45309',
    badgeBg: 'from-amber-400 via-rose-500 to-purple-800',
    gradientOverlay: 'from-amber-950/30 via-transparent to-purple-950/45',
  },
];

export const TITLE_BACKDROP_URL = titleKingdomImg;

function countChar(layout: string[], ch: string): number {
  let count = 0;
  for (const row of layout) {
    for (const c of row) {
      if (c === ch) count++;
    }
  }
  return count;
}

const HANDCRAFTED_LEVELS_50: LevelDefinition[] = [
  // ================= LEVELS 1 - 10 =================
  {
    id: 1,
    name: 'Sweet Welcome',
    zone: 'sugar_meadow',
    difficulty: 'easy',
    rows: 7,
    cols: 7,
    moves: 15,
    colorsCount: 4,
    starScores: [900, 1800, 2800],
    objectives: [{ type: 'collect', targets: { red: 10, green: 10 } }],
    tip: 'Match 4 candies in a row to forge a Striped Candy that blasts an entire line!',
    layout: ['.......', '.......', '.......', '.......', '.......', '.......', '.......'],
  },
  {
    id: 2,
    name: 'Berry Jelly Patch',
    zone: 'sugar_meadow',
    difficulty: 'easy',
    rows: 7,
    cols: 7,
    moves: 18,
    colorsCount: 5,
    starScores: [1200, 2200, 3400],
    objectives: [{ type: 'jelly', target: 9 }],
    tip: 'Match candies sitting directly over shimmering pink Jelly tiles to clear them!',
    layout: ['.......', '.......', '..111..', '..111..', '..111..', '.......', '.......'],
  },
  {
    id: 3,
    name: 'Wafer Crossing',
    zone: 'sugar_meadow',
    difficulty: 'easy',
    rows: 8,
    cols: 8,
    moves: 20,
    colorsCount: 5,
    starScores: [2000, 3400, 5000],
    objectives: [
      { type: 'jelly', target: 12 },
      { type: 'score', target: 2000 },
    ],
    tip: 'Create L or T shaped 5-matches to craft a Wrapped Candy that explodes twice!',
    layout: [
      '........',
      '.11..11.',
      '.11..11.',
      '........',
      '........',
      '.11..11.',
      '.11..11.',
      '........',
    ],
  },
  {
    id: 4,
    name: 'Sugar Speed Blitz',
    zone: 'sugar_meadow',
    difficulty: 'medium',
    rows: 8,
    cols: 8,
    moves: 40,
    timeLimitSec: 65,
    colorsCount: 4,
    starScores: [2400, 4000, 6200],
    objectives: [{ type: 'collect', targets: { red: 14, yellow: 14, blue: 14 } }],
    tip: 'TIMED LEVEL! Swap fast—only 4 colors on board so chains cascade nonstop!',
    layout: [
      '##....##',
      '#......#',
      '........',
      '........',
      '........',
      '........',
      '#......#',
      '##....##',
    ],
  },
  {
    id: 5,
    name: 'Frosting Meadows',
    zone: 'sugar_meadow',
    difficulty: 'medium',
    rows: 8,
    cols: 8,
    moves: 22,
    colorsCount: 5,
    starScores: [2400, 4000, 5800],
    objectives: [{ type: 'jelly', target: 16 }],
    tip: 'Make matches next to white Frosting blocks to crack and clear them away!',
    layout: [
      '........',
      '..1111..',
      '.1f..f1.',
      '.1.ff.1.',
      '.1.ff.1.',
      '.1f..f1.',
      '..1111..',
      '........',
    ],
  },
  {
    id: 6,
    name: 'Cherry Orchard',
    zone: 'sugar_meadow',
    difficulty: 'easy',
    rows: 8,
    cols: 8,
    moves: 22,
    colorsCount: 5,
    starScores: [2500, 4200, 6000],
    objectives: [{ type: 'ingredients', cherries: 2, hazelnuts: 0 }],
    tip: 'Guide the Cherries all the way down to the glowing green exit arrows at the bottom!',
    layout: [
      '..C..C..',
      '........',
      '........',
      '...ff...',
      '........',
      '........',
      '........',
      '..E..E..',
    ],
  },
  {
    id: 7,
    name: 'Crown Courtyard',
    zone: 'sugar_meadow',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 20,
    colorsCount: 6,
    starScores: [3500, 5500, 8000],
    objectives: [{ type: 'collect', targets: { red: 14, green: 10, yellow: 10 } }],
    tip: 'HARD LEVEL! Match 5 in a line for a Color Bomb and swap it with your rarest target color!',
    layout: [
      '##.....##',
      '#.......#',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '#.......#',
      '##.....##',
    ],
  },
  {
    id: 8,
    name: 'Meadow Gate',
    zone: 'sugar_meadow',
    difficulty: 'medium',
    rows: 8,
    cols: 8,
    moves: 24,
    colorsCount: 5,
    starScores: [3200, 5200, 7500],
    objectives: [
      { type: 'jelly', target: 12 },
      { type: 'ingredients', cherries: 2, hazelnuts: 0 },
    ],
    tip: 'Vertical Striped candies clear an entire chute beneath your Cherries in one move!',
    layout: [
      '.C....C.',
      '........',
      '..1111..',
      '.f1111f.',
      '..1111..',
      '..ffff..',
      '........',
      '.E....E.',
    ],
  },
  {
    id: 9,
    name: 'Gumdrop Hourglass',
    zone: 'sugar_meadow',
    difficulty: 'medium',
    rows: 8,
    cols: 8,
    moves: 21,
    colorsCount: 5,
    starScores: [3400, 5400, 7900],
    objectives: [{ type: 'jelly', target: 18 }],
    tip: 'Squeeze through the narrow hourglass waist—Wrapped candies blast both sides!',
    layout: [
      '........',
      '.111111.',
      '#..11..#',
      '##.11.##',
      '##.11.##',
      '#..11..#',
      '.111111.',
      '........',
    ],
  },
  {
    id: 10,
    name: 'Meadow Sprint Finale',
    zone: 'sugar_meadow',
    difficulty: 'hard',
    rows: 8,
    cols: 8,
    moves: 45,
    timeLimitSec: 75,
    colorsCount: 5,
    starScores: [4200, 6500, 9500],
    objectives: [
      { type: 'jelly', target: 16 },
      { type: 'score', target: 4200 },
    ],
    tip: 'TIMED BOSS! Crack the frosting ring and clear the inner jelly before the clock hits 0!',
    layout: [
      '........',
      '.f1111f.',
      '.12..21.',
      '.1.11.1.',
      '.1.11.1.',
      '.12..21.',
      '.f1111f.',
      '........',
    ],
  },
  // ================= LEVELS 11 - 20 =================
  {
    id: 11,
    name: 'Butterscotch Ridge',
    zone: 'sugar_meadow',
    difficulty: 'easy',
    rows: 8,
    cols: 8,
    moves: 22,
    colorsCount: 5,
    starScores: [3600, 5800, 8200],
    objectives: [{ type: 'jelly', target: 20 }],
    tip: 'Deep Double-Jelly tiles require two clears! Special candy combos melt them fast.',
    layout: [
      '........',
      '.22..22.',
      '.211112.',
      '..1221..',
      '..1221..',
      '.211112.',
      '.22..22.',
      '........',
    ],
  },
  {
    id: 12,
    name: 'Toffee Bridge',
    zone: 'sugar_meadow',
    difficulty: 'medium',
    rows: 8,
    cols: 9,
    moves: 24,
    colorsCount: 5,
    starScores: [4000, 6200, 8800],
    objectives: [{ type: 'ingredients', cherries: 2, hazelnuts: 1 }],
    tip: 'Cross the narrow caramel bridge! Hazelnuts and Cherries exit through any bottom arrow.',
    layout: [
      '.C..H..C.',
      '.........',
      '###...###',
      '###.f.###',
      '###...###',
      '.........',
      '..ff.ff..',
      '.E..E..E.',
    ],
  },
  {
    id: 13,
    name: 'Licorice Gulch',
    zone: 'sugar_meadow',
    difficulty: 'hard',
    rows: 8,
    cols: 8,
    moves: 22,
    colorsCount: 5,
    starScores: [3800, 6000, 8600],
    objectives: [{ type: 'jelly', target: 18 }],
    tip: 'Licorice Locks trap candies in place—match adjacent same-color candies or blast them!',
    layout: [
      '........',
      '.111111.',
      '.1L..L1.',
      '..L22L..',
      '..L22L..',
      '.1L..L1.',
      '.111111.',
      '........',
    ],
  },
  {
    id: 14,
    name: 'Amber Twin Falls',
    zone: 'sugar_meadow',
    difficulty: 'medium',
    rows: 9,
    cols: 8,
    moves: 25,
    colorsCount: 5,
    starScores: [4200, 6800, 9600],
    objectives: [
      { type: 'score', target: 4200 },
      { type: 'ingredients', cherries: 1, hazelnuts: 2 },
    ],
    tip: 'Two-layer Frosting blocks take two adjacent hits to shatter completely.',
    layout: [
      '.H.C..H.',
      '........',
      '...##...',
      '.FF##FF.',
      '...##...',
      '........',
      '.ff..ff.',
      '........',
      '.E....E.',
    ],
  },
  {
    id: 15,
    name: 'Caramel Clockwork',
    zone: 'sugar_meadow',
    difficulty: 'hard',
    rows: 8,
    cols: 8,
    moves: 50,
    timeLimitSec: 70,
    colorsCount: 5,
    starScores: [4800, 7400, 10600],
    objectives: [{ type: 'collect', targets: { orange: 18, purple: 16, green: 14 } }],
    tip: 'TIMED BLITZ! Trigger horizontal and vertical Striped candies to scoop huge color hauls!',
    layout: [
      '#......#',
      '........',
      '..F..F..',
      '........',
      '........',
      '..F..F..',
      '........',
      '#......#',
    ],
  },
  {
    id: 16,
    name: 'Canyon Switchback',
    zone: 'sugar_meadow',
    difficulty: 'medium',
    rows: 9,
    cols: 9,
    moves: 25,
    colorsCount: 5,
    starScores: [5000, 7800, 11000],
    objectives: [
      { type: 'score', target: 5000 },
      { type: 'jelly', target: 20 },
    ],
    tip: 'With 5 colors on a wide 9x9 board, chain cascades trigger Color Bombs easily!',
    layout: [
      '##.....##',
      '#.......#',
      '..11111..',
      '.1F...F1.',
      '.1.222.1.',
      '.1F...F1.',
      '..11111..',
      '#.......#',
      '##.....##',
    ],
  },
  {
    id: 17,
    name: 'Roasted Rush',
    zone: 'sugar_meadow',
    difficulty: 'medium',
    rows: 9,
    cols: 8,
    moves: 26,
    colorsCount: 6,
    starScores: [4800, 7600, 10800],
    objectives: [{ type: 'ingredients', cherries: 2, hazelnuts: 2 }],
    tip: 'Clear the center frosting pillars early so ingredients do not get stranded on ledges.',
    layout: [
      '.C.H.H.C',
      '........',
      '.L....L.',
      '..FFFF..',
      '........',
      '.11..11.',
      '.ff..ff.',
      '........',
      '.E.EE.E.',
    ],
  },
  {
    id: 18,
    name: 'Syrup Rapids',
    zone: 'sugar_meadow',
    difficulty: 'hard',
    rows: 8,
    cols: 9,
    moves: 24,
    colorsCount: 6,
    starScores: [5200, 8000, 11500],
    objectives: [{ type: 'jelly', target: 26 }],
    tip: 'Aim specials at the locked corners to break the double-jelly clusters.',
    layout: [
      '.........',
      '.2L111L2.',
      '.1211121.',
      '.11FFF11.',
      '.11FFF11.',
      '.1211121.',
      '.2L111L2.',
      '.........',
    ],
  },
  {
    id: 19,
    name: 'Golden Checker Spire',
    zone: 'sugar_meadow',
    difficulty: 'easy',
    rows: 8,
    cols: 8,
    moves: 23,
    colorsCount: 5,
    starScores: [4600, 7200, 10400],
    objectives: [{ type: 'jelly', target: 16 }],
    tip: 'Checkerboard jellies fall fast to Striped + Wrapped combos!',
    layout: [
      '........',
      '.1.1.1.1',
      '1.2.2.2.',
      '.1.2.2.1',
      '1.2.2.2.',
      '.1.1.1.1',
      '........',
      '........',
    ],
  },
  {
    id: 20,
    name: 'Meadow Citadel',
    zone: 'sugar_meadow',
    difficulty: 'super_hard',
    rows: 9,
    cols: 9,
    moves: 26,
    colorsCount: 6,
    starScores: [5800, 9000, 13000],
    objectives: [
      { type: 'score', target: 5800 },
      { type: 'jelly', target: 24 },
      { type: 'ingredients', cherries: 1, hazelnuts: 1 },
    ],
    tip: 'SUPER HARD BOSS! Save Color Bombs to pair with Striped candies.',
    layout: [
      '..C...H..',
      '.1111111.',
      '.1FF.FF1.',
      '..12221..',
      '..1L2L1..',
      '..12221..',
      '.1ff.ff1.',
      '.........',
      '..E...E..',
    ],
  },
  // ================= LEVELS 21 - 30 =================
  {
    id: 21,
    name: 'Peppermint Pass',
    zone: 'caramel_canyon',
    difficulty: 'medium',
    rows: 9,
    cols: 9,
    moves: 24,
    colorsCount: 6,
    starScores: [5600, 8800, 12500],
    objectives: [{ type: 'jelly', target: 28 }],
    tip: 'Caramel Canyon brings rich 6-color boards. Look for T-shapes and L-shapes near the center!',
    layout: [
      '###...###',
      '#..111..#',
      '.1122211.',
      '.12L.L21.',
      '.12.F.21.',
      '.12L.L21.',
      '.1122211.',
      '#..111..#',
      '###...###',
    ],
  },
  {
    id: 22,
    name: 'Toffee Chute',
    zone: 'caramel_canyon',
    difficulty: 'medium',
    rows: 9,
    cols: 8,
    moves: 26,
    colorsCount: 6,
    starScores: [5500, 8600, 12000],
    objectives: [{ type: 'ingredients', cherries: 2, hazelnuts: 2 }],
    tip: 'Unlock the licorice gates first—then drop the ingredients straight down the chutes!',
    layout: [
      'C.H..H.C',
      '........',
      '.L.FF.L.',
      '........',
      '..FFFF..',
      '........',
      '.L....L.',
      '........',
      'E.E..E.E',
    ],
  },
  {
    id: 23,
    name: 'Canyon Blitz',
    zone: 'caramel_canyon',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 55,
    timeLimitSec: 75,
    colorsCount: 5,
    starScores: [6800, 10200, 14500],
    objectives: [
      { type: 'jelly', target: 21 },
      { type: 'score', target: 6800 },
    ],
    tip: 'TIMED LEVEL! Melt the diamond of double jelly inside 75 seconds!',
    layout: [
      '....1....',
      '...121...',
      '..12221..',
      '.1222221.',
      '122.F.221',
      '.1222221.',
      '..12221..',
      '...121...',
      '....1....',
    ],
  },
  {
    id: 24,
    name: 'Aurora Prism',
    zone: 'caramel_canyon',
    difficulty: 'easy',
    rows: 9,
    cols: 9,
    moves: 25,
    colorsCount: 5,
    starScores: [7200, 11000, 15500],
    objectives: [
      { type: 'collect', targets: { blue: 22, purple: 22 } },
      { type: 'jelly', target: 25 },
    ],
    tip: 'Only 5 colors here—build Color Bombs and pair them with Wrapped or Striped candies!',
    layout: [
      '....1....',
      '...121...',
      '..12221..',
      '.12L.L21.',
      '122.F.221',
      '.12L.L21.',
      '..12221..',
      '...121...',
      '....1....',
    ],
  },
  {
    id: 25,
    name: 'Canyon Shatter',
    zone: 'caramel_canyon',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 26,
    colorsCount: 6,
    starScores: [6200, 9500, 13800],
    objectives: [{ type: 'jelly', target: 32 }],
    tip: 'Two-hit Frosting lines guard the outer double-jelly rings. Wrapped blasts shine here!',
    layout: [
      '.........',
      '.22F.F22.',
      '.2111112.',
      '.F12221F.',
      '..12L21..',
      '.F12221F.',
      '.2111112.',
      '.22F.F22.',
      '.........',
    ],
  },
  {
    id: 26,
    name: 'Golden Harvest',
    zone: 'caramel_canyon',
    difficulty: 'medium',
    rows: 9,
    cols: 9,
    moves: 27,
    colorsCount: 6,
    starScores: [6400, 9800, 14200],
    objectives: [
      { type: 'jelly', target: 18 },
      { type: 'ingredients', cherries: 2, hazelnuts: 2 },
    ],
    tip: 'Use Cross Wands or Lollipop Hammers if a stubborn corner jelly blocks your path.',
    layout: [
      '.C.H.H.C.',
      '.........',
      '..1F1F1..',
      '.11L1L11.',
      '..12221..',
      '.11F1F11.',
      '..11111..',
      '.........',
      '.E.E.E.E.',
    ],
  },
  {
    id: 27,
    name: 'Caramel Spire',
    zone: 'caramel_canyon',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 25,
    colorsCount: 6,
    starScores: [7000, 10800, 15200],
    objectives: [
      { type: 'score', target: 7000 },
      { type: 'jelly', target: 30 },
    ],
    tip: 'Break the central licorice diamond early to open vertical cascades through the spire.',
    layout: [
      '##.....##',
      '#.22122.#',
      '.2111112.',
      '.11L2L11.',
      '.122F221.',
      '.11L2L11.',
      '.2111112.',
      '#.22122.#',
      '##.....##',
    ],
  },
  {
    id: 28,
    name: 'Toffee Clock',
    zone: 'caramel_canyon',
    difficulty: 'medium',
    rows: 9,
    cols: 9,
    moves: 55,
    timeLimitSec: 80,
    colorsCount: 5,
    starScores: [7400, 11200, 16000],
    objectives: [{ type: 'collect', targets: { blue: 24, green: 20, yellow: 18 } }],
    tip: 'TIMED RUSH! 80 seconds to harvest ice-blue, mint-green, and lemon candies!',
    layout: [
      '..#...#..',
      '.#.....#.',
      '#...F...#',
      '.........',
      '..F.L.F..',
      '.........',
      '#...F...#',
      '.#.....#.',
      '..#...#..',
    ],
  },
  {
    id: 29,
    name: 'Crown Approach',
    zone: 'caramel_canyon',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 28,
    colorsCount: 6,
    starScores: [7800, 12000, 17000],
    objectives: [
      { type: 'jelly', target: 34 },
      { type: 'ingredients', cherries: 2, hazelnuts: 1 },
    ],
    tip: 'Double-Wrapped combos clear huge blocks of double jelly & frosting.',
    layout: [
      '.C..H..C.',
      '.2211122.',
      '.21F1F12.',
      '.1122211.',
      '.1L222L1.',
      '.1122211.',
      '.21F1F12.',
      '.2211122.',
      '.E..E..E.',
    ],
  },
  {
    id: 30,
    name: 'Canyon King’s Gate',
    zone: 'caramel_canyon',
    difficulty: 'super_hard',
    rows: 9,
    cols: 9,
    moves: 29,
    colorsCount: 6,
    starScores: [9500, 14500, 21000],
    objectives: [
      { type: 'score', target: 9500 },
      { type: 'jelly', target: 36 },
      { type: 'ingredients', cherries: 2, hazelnuts: 2 },
    ],
    tip: 'SUPER HARD FINALE! Shatter the frosted Spire, drop all 4 ingredients, and clear every jelly!',
    layout: [
      'C.H...H.C',
      '.2211122.',
      '.2F222F2.',
      '.12L2L21.',
      '.122F221.',
      '.12L2L21.',
      '.2F222F2.',
      '.2211122.',
      'E.E...E.E',
    ],
  },
  // ================= LEVELS 31 - 40 =================
  {
    id: 31,
    name: 'Plum Petal Path',
    zone: 'caramel_canyon',
    difficulty: 'easy',
    rows: 8,
    cols: 8,
    moves: 22,
    colorsCount: 5,
    starScores: [5400, 8400, 12200],
    objectives: [{ type: 'collect', targets: { purple: 22, red: 22 } }],
    tip: 'Only 5 colors make huge purple & ruby cascades effortless!',
    layout: [
      '##....##',
      '#......#',
      '..f..f..',
      '........',
      '........',
      '..f..f..',
      '#......#',
      '##....##',
    ],
  },
  {
    id: 32,
    name: 'Butterscotch Twin Wells',
    zone: 'caramel_canyon',
    difficulty: 'medium',
    rows: 9,
    cols: 9,
    moves: 25,
    colorsCount: 6,
    starScores: [6800, 10400, 14800],
    objectives: [{ type: 'jelly', target: 24 }],
    tip: 'Two deep wells separated by a center divider—Striped Horizontals reach across!',
    layout: [
      '....#....',
      '.111#111.',
      '.121#121.',
      '.11L.L11.',
      '....F....',
      '.11L.L11.',
      '.121#121.',
      '.111#111.',
      '....#....',
    ],
  },
  {
    id: 33,
    name: 'Orchard Waterfall',
    zone: 'caramel_canyon',
    difficulty: 'medium',
    rows: 9,
    cols: 8,
    moves: 26,
    colorsCount: 5,
    starScores: [6600, 10200, 14500],
    objectives: [{ type: 'ingredients', cherries: 3, hazelnuts: 1 }],
    tip: 'Three Cherries & a Hazelnut! Keep the center lane clear of double frosting.',
    layout: [
      '.C.C.H.C',
      '........',
      '..F..F..',
      '.11..11.',
      '..LFFL..',
      '.11..11.',
      '........',
      '.ff..ff.',
      '.E.E.E.E',
    ],
  },
  {
    id: 34,
    name: 'Soda Pop Dash',
    zone: 'caramel_canyon',
    difficulty: 'hard',
    rows: 8,
    cols: 9,
    moves: 60,
    timeLimitSec: 70,
    colorsCount: 5,
    starScores: [7200, 11000, 15800],
    objectives: [
      { type: 'jelly', target: 22 },
      { type: 'collect', targets: { purple: 20 } },
    ],
    tip: 'TIMED BLITZ! Pop every double jelly across the soda belt in 70 seconds!',
    layout: [
      '.........',
      '.2121212.',
      '.1212121.',
      '...FFF...',
      '...FFF...',
      '.1212121.',
      '.2121212.',
      '.........',
    ],
  },
  {
    id: 35,
    name: 'Velvet Staircase',
    zone: 'caramel_canyon',
    difficulty: 'medium',
    rows: 9,
    cols: 9,
    moves: 25,
    colorsCount: 6,
    starScores: [7400, 11400, 16200],
    objectives: [{ type: 'jelly', target: 24 }],
    tip: 'Diagonal staircase cutouts—look for Wrapped candies to catch the stepped jelly!',
    layout: [
      '...######',
      '11..#####',
      '.21..####',
      '.121..###',
      '..121..##',
      '##.121..#',
      '###.121..',
      '####..21.',
      '#####....',
    ],
  },
  {
    id: 36,
    name: 'Fudge Vault',
    zone: 'caramel_canyon',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 24,
    colorsCount: 6,
    starScores: [7900, 12200, 17400],
    objectives: [
      { type: 'score', target: 7900 },
      { type: 'jelly', target: 24 },
    ],
    tip: 'A fortress of Licorice Locks guards the inner vault—pair Striped + Wrapped to crack it open!',
    layout: [
      '.........',
      '.FFFFFFF.',
      '.F22222F.',
      '.F2LLL2F.',
      '.F2L2L2F.',
      '.F2LLL2F.',
      '.F22222F.',
      '.FFFFFFF.',
      '.........',
    ],
  },
  {
    id: 37,
    name: 'Sakura Candy Drop',
    zone: 'caramel_canyon',
    difficulty: 'easy',
    rows: 9,
    cols: 9,
    moves: 26,
    colorsCount: 5,
    starScores: [6900, 10800, 15400],
    objectives: [
      { type: 'ingredients', cherries: 2, hazelnuts: 2 },
      { type: 'collect', targets: { red: 18, purple: 18 } },
    ],
    tip: 'Smooth wide lanes—guide all 4 royal fruits through the canyon gates!',
    layout: [
      'C.H...H.C',
      '.........',
      '..f...f..',
      '...111...',
      '..1.F.1..',
      '...111...',
      '..f...f..',
      '.........',
      'E.E...E.E',
    ],
  },
  {
    id: 38,
    name: 'Fizzing Frenzy',
    zone: 'caramel_canyon',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 60,
    timeLimitSec: 80,
    colorsCount: 5,
    starScores: [8500, 13000, 18500],
    objectives: [
      { type: 'score', target: 8500 },
      { type: 'collect', targets: { orange: 24, blue: 24 } },
    ],
    tip: 'TIMED FRENZY! Build Color Bombs to sweep entire board colors in one zap!',
    layout: [
      '#.......#',
      '.L.....L.',
      '..11111..',
      '..1.F.1..',
      '..1F.F1..',
      '..1.F.1..',
      '..11111..',
      '.L.....L.',
      '#.......#',
    ],
  },
  {
    id: 39,
    name: 'Royal Toffee Ring',
    zone: 'caramel_canyon',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 26,
    colorsCount: 6,
    starScores: [8200, 12800, 18000],
    objectives: [{ type: 'jelly', target: 32 }],
    tip: 'A hollow ring board! Diagonal slides bring new candies smoothly into the lower corners.',
    layout: [
      '..22222..',
      '.2111112.',
      '21.....12',
      '21.###.12',
      '21.###.12',
      '21.###.12',
      '21.....12',
      '.2111112.',
      '..22222..',
    ],
  },
  {
    id: 40,
    name: 'Canyon Queen’s Trial',
    zone: 'caramel_canyon',
    difficulty: 'super_hard',
    rows: 9,
    cols: 9,
    moves: 28,
    colorsCount: 6,
    starScores: [10200, 15500, 22000],
    objectives: [
      { type: 'jelly', target: 32 },
      { type: 'ingredients', cherries: 2, hazelnuts: 2 },
    ],
    tip: 'SUPER HARD BOSS! Clear the center twin-pillars so fruits drop while you clear double jellies!',
    layout: [
      'C.H...H.C',
      '.2211122.',
      '.2FL2LF2.',
      '.1222221.',
      '.12F.F21.',
      '.1222221.',
      '.2FL2LF2.',
      '.2211122.',
      'E.E...E.E',
    ],
  },
  // ================= LEVELS 41 - 50 =================
  {
    id: 41,
    name: 'Nebula Courtyard',
    zone: 'crystal_glacier',
    difficulty: 'medium',
    rows: 9,
    cols: 9,
    moves: 25,
    colorsCount: 6,
    starScores: [8600, 13200, 18800],
    objectives: [
      { type: 'jelly', target: 28 },
      { type: 'collect', targets: { purple: 24, yellow: 24 } },
    ],
    tip: 'Welcome to Crystal Glacier! Watch out for dual-layer frosting protecting corner stars.',
    layout: [
      '##2...2##',
      '#.11111.#',
      '21F...F12',
      '.1.222.1.',
      '.1.2L2.1.',
      '.1.222.1.',
      '21F...F12',
      '#.11111.#',
      '##2...2##',
    ],
  },
  {
    id: 42,
    name: 'Comet Conveyor',
    zone: 'crystal_glacier',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 26,
    colorsCount: 6,
    starScores: [9000, 14000, 19800],
    objectives: [{ type: 'ingredients', cherries: 3, hazelnuts: 2 }],
    tip: 'Five cosmic ingredients must navigate around the asteroid pillars!',
    layout: [
      'C.H.C.H.C',
      '.........',
      '.#..F..#.',
      '.L.....L.',
      '..FF.FF..',
      '.L.....L.',
      '.#..F..#.',
      '.........',
      'E.E.E.E.E',
    ],
  },
  {
    id: 43,
    name: 'Meteor Strike Rush',
    zone: 'crystal_glacier',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 65,
    timeLimitSec: 75,
    colorsCount: 5,
    starScores: [9500, 14800, 21000],
    objectives: [
      { type: 'jelly', target: 28 },
      { type: 'score', target: 9500 },
    ],
    tip: 'TIMED METEOR RUSH! 75 seconds—smash the frosted cross and trigger chain combos!',
    layout: [
      '....2....',
      '...212...',
      '..21112..',
      '.21F1F12.',
      '211121112',
      '.21F1F12.',
      '..21112..',
      '...212...',
      '....2....',
    ],
  },
  {
    id: 44,
    name: 'Astral Mirrors',
    zone: 'crystal_glacier',
    difficulty: 'medium',
    rows: 9,
    cols: 9,
    moves: 26,
    colorsCount: 6,
    starScores: [9200, 14200, 20000],
    objectives: [{ type: 'jelly', target: 32 }],
    tip: 'Symmetric mirror chambers—Color Bomb + Striped turns half the board into laser beams!',
    layout: [
      '221...122',
      '211.F.112',
      '11L...L11',
      '...222...',
      '.F.2L2.F.',
      '...222...',
      '11L...L11',
      '211.F.112',
      '221...122',
    ],
  },
  {
    id: 45,
    name: 'Celestial Treasury',
    zone: 'crystal_glacier',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 25,
    colorsCount: 6,
    starScores: [9800, 15000, 21500],
    objectives: [
      { type: 'collect', targets: { red: 24, blue: 24, green: 24 } },
      { type: 'score', target: 9800 },
    ],
    tip: 'Break the golden licorice vault walls to open massive cascade combos!',
    layout: [
      '.........',
      '.L.F.F.L.',
      '..22222..',
      '.F2LLL2F.',
      '..2L.L2..',
      '.F2LLL2F.',
      '..22222..',
      '.L.F.F.L.',
      '.........',
    ],
  },
  {
    id: 46,
    name: 'Twilight Spire',
    zone: 'crystal_glacier',
    difficulty: 'super_hard',
    rows: 9,
    cols: 9,
    moves: 27,
    colorsCount: 6,
    starScores: [10500, 16000, 23000],
    objectives: [
      { type: 'jelly', target: 36 },
      { type: 'ingredients', cherries: 2, hazelnuts: 2 },
    ],
    tip: 'SUPER HARD! Clear the central double-frosting column to let ingredients slide through.',
    layout: [
      'C.H...H.C',
      '2211F1122',
      '2121F1212',
      '12L2.2L21',
      '1122F2211',
      '12L2.2L21',
      '2121F1212',
      '2211.1122',
      'E.E...E.E',
    ],
  },
  {
    id: 47,
    name: 'Supernova Sprint',
    zone: 'crystal_glacier',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 70,
    timeLimitSec: 85,
    colorsCount: 5,
    starScores: [11000, 17000, 24000],
    objectives: [
      { type: 'score', target: 11000 },
      { type: 'collect', targets: { yellow: 28, purple: 28 } },
    ],
    tip: 'TIMED SUPERNOVA! 85 seconds of 5-color fury—chain Color Bombs for explosive points!',
    layout: [
      '.........',
      '.1..F..1.',
      '..1...1..',
      '...L.L...',
      '.F..2..F.',
      '...L.L...',
      '..1...1..',
      '.1..F..1.',
      '.........',
    ],
  },
  {
    id: 48,
    name: 'Eclipse Labyrinth',
    zone: 'crystal_glacier',
    difficulty: 'hard',
    rows: 9,
    cols: 9,
    moves: 28,
    colorsCount: 6,
    starScores: [10800, 16500, 23500],
    objectives: [{ type: 'jelly', target: 38 }],
    tip: 'A winding cosmic maze of jellies—Striped + Wrapped cuts right across labyrinth walls!',
    layout: [
      '222.F.222',
      '212...212',
      '222L.L222',
      '...121...',
      'F.12221.F',
      '...121...',
      '222L.L222',
      '212...212',
      '222.F.222',
    ],
  },
  {
    id: 49,
    name: 'Throne Room Prelude',
    zone: 'crystal_glacier',
    difficulty: 'super_hard',
    rows: 9,
    cols: 9,
    moves: 29,
    colorsCount: 6,
    starScores: [11500, 17800, 25000],
    objectives: [
      { type: 'jelly', target: 36 },
      { type: 'ingredients', cherries: 2, hazelnuts: 2 },
      { type: 'score', target: 11500 },
    ],
    tip: 'SUPER HARD! One step from the Glacier Gate—combine Rainbow Bombs with any Striped candy!',
    layout: [
      'C.H...H.C',
      '221111122',
      '2F22L22F2',
      '121222121',
      '1L22F22L1',
      '121222121',
      '2F22L22F2',
      '221111122',
      'E.E...E.E',
    ],
  },
  {
    id: 50,
    name: 'Glacier Crest Finale',
    zone: 'crystal_glacier',
    difficulty: 'super_hard',
    rows: 9,
    cols: 9,
    moves: 32,
    colorsCount: 6,
    starScores: [13000, 20000, 28500],
    objectives: [
      { type: 'score', target: 13000 },
      { type: 'jelly', target: 40 },
      { type: 'ingredients', cherries: 2, hazelnuts: 2 },
    ],
    tip: 'BOSS LEVEL 50! Conquer the Frozen Crest with every combo and booster in your arsenal!',
    layout: [
      'C.H...H.C',
      '2221F1222',
      '2F22L22F2',
      '22L222L22',
      '1122F2211',
      '22L222L22',
      '2F22L22F2',
      '2221.1222',
      'E.E...E.E',
    ],
  },
];

// Deterministic RNG for Levels 51 - 360 (310 brand-new levels across 18 Maps!)
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 16 Curated 9x9 Architectural Board Geometries
const ARCHITECTURAL_MASKS: Array<{ name: string; mask: string[] }> = [
  {
    name: 'Grand Courtyard',
    mask: [
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
    ],
  },
  {
    name: 'Royal Octagon',
    mask: [
      '##.....##',
      '#.......#',
      '.........',
      '.........',
      '.........',
      '.........',
      '.........',
      '#.......#',
      '##.....##',
    ],
  },
  {
    name: 'Crown Diamond',
    mask: [
      '...###...',
      '..#...#..',
      '.#.....#.',
      '.........',
      '.........',
      '.........',
      '.#.....#.',
      '..#...#..',
      '...###...',
    ],
  },
  {
    name: 'Hourglass Chute',
    mask: [
      '.........',
      '.........',
      '#.......#',
      '##.....##',
      '###...###',
      '##.....##',
      '#.......#',
      '.........',
      '.........',
    ],
  },
  {
    name: 'Hollow Ring',
    mask: [
      '.........',
      '.........',
      '.........',
      '...###...',
      '...###...',
      '...###...',
      '.........',
      '.........',
      '.........',
    ],
  },
  {
    name: 'Twin Wells',
    mask: [
      '....#....',
      '....#....',
      '....#....',
      '.........',
      '.........',
      '.........',
      '....#....',
      '....#....',
      '....#....',
    ],
  },
  {
    name: 'Clover Arch',
    mask: [
      '....#....',
      '.........',
      '..#...#..',
      '.........',
      '#.......#',
      '.........',
      '..#...#..',
      '.........',
      '....#....',
    ],
  },
  {
    name: 'Crystal Butterfly',
    mask: [
      '....#....',
      '...###...',
      '.........',
      '.........',
      '.#.....#.',
      '.........',
      '.........',
      '...###...',
      '....#....',
    ],
  },
  {
    name: 'Imperial Pillars',
    mask: [
      '.........',
      '..#...#..',
      '..#...#..',
      '.........',
      '....#....',
      '.........',
      '..#...#..',
      '..#...#..',
      '.........',
    ],
  },
  {
    name: 'Diagonal Cascade',
    mask: [
      '......###',
      '.......##',
      '........#',
      '.........',
      '.........',
      '.........',
      '#........',
      '##.......',
      '###......',
    ],
  },
  {
    name: 'Sunburst Frame',
    mask: [
      '#.......#',
      '.........',
      '....#....',
      '.........',
      '..#...#..',
      '.........',
      '....#....',
      '.........',
      '#.......#',
    ],
  },
  {
    name: 'Chalice Steps',
    mask: [
      '.........',
      '.........',
      '#.......#',
      '#.......#',
      '##.....##',
      '##.....##',
      '#.......#',
      '.........',
      '.........',
    ],
  },
  {
    name: 'Starship Bridge',
    mask: [
      '##.....##',
      '.........',
      '...#.#...',
      '.........',
      '.........',
      '.........',
      '...#.#...',
      '.........',
      '##.....##',
    ],
  },
  {
    name: 'Candy Clover',
    mask: [
      '###...###',
      '##.....##',
      '#.......#',
      '.........',
      '.........',
      '.........',
      '#.......#',
      '##.....##',
      '###...###',
    ],
  },
  {
    name: 'Cathedral Nave',
    mask: [
      '#.......#',
      '.........',
      '.#.....#.',
      '.........',
      '...#.#...',
      '.........',
      '.#.....#.',
      '.........',
      '#.......#',
    ],
  },
  {
    name: 'Throne Sanctuary',
    mask: [
      '.........',
      '.#.....#.',
      '.........',
      '..#...#..',
      '.........',
      '..#...#..',
      '.........',
      '.#.....#.',
      '.........',
    ],
  },
];

const POETIC_ADJECTIVES = [
  'Frosted',
  'Glazed',
  'Velvet',
  'Sparkling',
  'Gilded',
  'Shimmering',
  'Candied',
  'Royal',
  'Sugared',
  'Caramel',
  'Peppermint',
  'Crystal',
  'Prism',
  'Honeyed',
  'Radiant',
  'Sorbet',
  'Twinkling',
  'Macaron',
  'Aurora',
  'Imperial',
];

const POETIC_NOUNS = [
  'Cascade',
  'Archway',
  'Bastion',
  'Promenade',
  'Citadel',
  'Courtyard',
  'Grotto',
  'Pavilion',
  'Spire',
  'Terrace',
  'Cascade',
  'Sanctum',
  'Rotunda',
  'Vault',
  'Crossing',
  'Overlook',
  'Fountain',
  'Bridge',
  'Labyrinth',
  'Crown',
];

function generateCampaignLevel(id: number): LevelDefinition {
  const zone = getZoneForLevel(id);
  const localIdx = (id - 1) % 20; // 0..19 within each 20-level map
  const rng = mulberry32(id * 104729 + 31337);

  const isBoss = localIdx === 19 || localIdx === 9;
  const isTimed = !isBoss && localIdx % 6 === 4;
  const difficulty: LevelDifficulty = isBoss
    ? 'super_hard'
    : localIdx % 5 === 3 || localIdx >= 16
      ? 'hard'
      : localIdx % 4 === 1
        ? 'easy'
        : 'medium';

  const colorsCount: 5 | 6 = isTimed || difficulty === 'easy' || localIdx % 5 === 0 ? 5 : 6;
  const rows = 9;
  const cols = 9;

  // Deterministic unique name per level
  const adj = POETIC_ADJECTIVES[(id * 3 + zone.chapterNumber) % POETIC_ADJECTIVES.length];
  const noun = POETIC_NOUNS[(localIdx + zone.chapterNumber * 2) % POETIC_NOUNS.length];
  const name =
    localIdx === 19
      ? `${zone.name} Crown Finale`
      : localIdx === 9
        ? `${zone.name} Mid-Boss`
        : `${adj} ${noun} ${localIdx + 1}`;

  const templateIdx = (id + zone.chapterNumber * 3) % ARCHITECTURAL_MASKS.length;
  const mask = ARCHITECTURAL_MASKS[templateIdx].mask;
  const grid: string[][] = mask.map((row) => row.split(''));

  // Determine objective mode mix
  const modeRoll = (id + zone.chapterNumber) % 4;
  const hasIngredients = modeRoll === 2 || isBoss;
  const hasJelly = modeRoll === 0 || modeRoll === 1 || isBoss;
  const hasCollect = modeRoll === 1 || modeRoll === 3 || isTimed;

  // 1. Place symmetric jelly patches
  if (hasJelly) {
    const targetJellies = isBoss ? 34 : difficulty === 'hard' ? 28 : difficulty === 'medium' ? 22 : 16;
    let placed = 0;
    let attempts = 0;
    while (placed < targetJellies && attempts < 220) {
      attempts++;
      const r = 1 + Math.floor(rng() * (rows - 2));
      const c = Math.floor(rng() * Math.ceil(cols / 2));
      if (grid[r][c] === '.') {
        const isDouble = (difficulty === 'hard' || isBoss || rng() > 0.52) && id > 55;
        const ch = isDouble ? '2' : '1';
        grid[r][c] = ch;
        placed++;
        const mc = cols - 1 - c;
        if (mc !== c && grid[r][mc] === '.' && placed < targetJellies) {
          grid[r][mc] = ch;
          placed++;
        }
      }
    }
  }

  // 2. Place frosting & licorice blockers symmetrically (keeping outer top/bottom clear for ingredients)
  const blockerBudget = isTimed ? 3 : isBoss ? 8 : difficulty === 'hard' ? 6 : 4;
  for (let b = 0; b < blockerBudget; b++) {
    const r = 2 + Math.floor(rng() * (rows - 4));
    const c = 1 + Math.floor(rng() * Math.floor((cols - 2) / 2));
    if (grid[r][c] === '.' || grid[r][c] === '1') {
      const ch = rng() > 0.4 ? (difficulty === 'easy' ? 'f' : 'F') : 'L';
      grid[r][c] = ch;
      const mc = cols - 1 - c;
      if (mc !== c && (grid[r][mc] === '.' || grid[r][mc] === '1')) {
        grid[r][mc] = ch;
      }
    }
  }

  // 3. Place Ingredients & guaranteed reachable Exit cells
  let cherries = 0;
  let hazelnuts = 0;
  if (hasIngredients) {
    const candidateCols: number[] = [];
    for (let c = 0; c < cols; c++) {
      if (grid[0][c] === '.' && grid[rows - 1][c] !== '#') {
        candidateCols.push(c);
      }
    }
    const desired = isBoss ? 4 : Math.min(4, Math.max(2, 2 + (id % 2)));
    const step = Math.max(1, Math.floor(candidateCols.length / desired));
    for (let i = 0; i < desired && i * step < candidateCols.length; i++) {
      const colIdx = candidateCols[i * step];
      if (i % 2 === 0) {
        grid[0][colIdx] = 'C';
        cherries++;
      } else {
        grid[0][colIdx] = 'H';
        hazelnuts++;
      }
    }
    // Mark all playable bottom-row cells as exits when ingredients exist so diagonal slides never strand fruit!
    for (let c = 0; c < cols; c++) {
      if (grid[rows - 1][c] !== '#') {
        grid[rows - 1][c] = 'E';
      }
    }
  }

  const layout = grid.map((r) => r.join(''));
  const exactJelly = countChar(layout, '1') + countChar(layout, '2');

  const moves = isTimed
    ? 65
    : isBoss
      ? 29
      : difficulty === 'hard'
        ? 25
        : difficulty === 'easy'
          ? 23
          : 26;
  const timeLimitSec = isTimed ? (difficulty === 'hard' ? 75 : 85) : undefined;

  const baseScore = Math.round(7000 + Math.min(18000, id * 52) + (isBoss ? 3200 : 0));
  const objectives: LevelObjective[] = [];

  if (exactJelly > 0) {
    objectives.push({ type: 'jelly', target: exactJelly });
  }
  if (cherries + hazelnuts > 0) {
    objectives.push({ type: 'ingredients', cherries, hazelnuts });
  }
  if (hasCollect || objectives.length === 0) {
    const pool: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    const c1 = pool[id % colorsCount];
    const c2 = pool[(id + 2) % colorsCount];
    const qty = Math.min(34, 18 + Math.floor(id / 30) * 2);
    objectives.push({
      type: 'collect',
      targets: c1 === c2 ? { [c1]: qty + 8 } : { [c1]: qty, [c2]: qty },
    });
  }
  if (isBoss || modeRoll === 3) {
    objectives.push({ type: 'score', target: baseScore });
  }

  const tip = isTimed
    ? `TIMED BLITZ (${timeLimitSec}s)! Chain 5-color cascades & Rainbow Bombs before the timer hits 0!`
    : isBoss
      ? `ROYAL BOSS STAGE in ${zone.name}! Combine Color Bombs with Striped or Wrapped specials to sweep blockers!`
      : hasIngredients
        ? `Guide all royal fruits down to the glowing green bottom exits—use Cross Wands or Vertical Stripes!`
        : exactJelly > 0
          ? `Melt every Jelly tile! Double-layered jellies crack twice as fast with Wrapped + Striped blasts.`
          : `Harvest target candies quickly using L/T Wrapped matches and 4-in-a-line Striped beams!`;

  return {
    id,
    name,
    zone: zone.id,
    difficulty,
    rows,
    cols,
    moves,
    timeLimitSec,
    colorsCount,
    starScores: [baseScore, Math.round(baseScore * 1.48), Math.round(baseScore * 2.08)],
    objectives,
    tip,
    layout,
  };
}

const GENERATED_LEVELS_310: LevelDefinition[] = Array.from({ length: 310 }, (_, idx) =>
  generateCampaignLevel(51 + idx)
);

export const LEVELS: LevelDefinition[] = [...HANDCRAFTED_LEVELS_50, ...GENERATED_LEVELS_310];

// Ensure every level's zone & jelly target matches its exact layout and map range
for (const lvl of LEVELS) {
  lvl.zone = getZoneForLevel(lvl.id).id;
  const jellyObj = lvl.objectives.find((o) => o.type === 'jelly');
  if (jellyObj && jellyObj.type === 'jelly') {
    jellyObj.target = countChar(lvl.layout, '1') + countChar(lvl.layout, '2');
  }
}

export function getLevelById(id: number): LevelDefinition {
  const found = LEVELS.find((l) => l.id === id);
  return found ?? LEVELS[0];
}

export function getZoneForLevel(levelId: number): ZoneMeta {
  return ZONES.find((z) => levelId >= z.levelRange[0] && levelId <= z.levelRange[1]) ?? ZONES[0];
}

export function generateEndlessLevel(wave: number): LevelDefinition {
  const rng = mulberry32(wave * 7919 + 4242);
  const zoneMeta = ZONES[(wave - 1) % ZONES.length];
  const zone = zoneMeta.id;
  const rows = wave <= 2 ? 8 : 9;
  const cols = wave <= 2 ? 8 : 9;
  const colorsCount: 5 | 6 = wave % 3 === 0 ? 5 : 6;
  const isTimedWave = wave % 4 === 0;
  const moves = isTimedWave ? 60 : Math.max(20, 28 - Math.floor(wave / 3));
  const timeLimitSec = isTimedWave ? Math.max(60, 85 - wave) : undefined;

  const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill('.'));

  if (rng() > 0.35) {
    grid[0][0] = '#';
    grid[0][cols - 1] = '#';
    grid[rows - 1][0] = '#';
    grid[rows - 1][cols - 1] = '#';
  }
  if (rng() > 0.65 && rows === 9) {
    grid[0][1] = '#';
    grid[0][cols - 2] = '#';
    grid[1][0] = '#';
    grid[1][cols - 1] = '#';
  }

  const modeRoll = wave % 3;
  let jellyCount = 0;
  let cherries = 0;
  let hazelnuts = 0;

  if (modeRoll === 1 || modeRoll === 0) {
    const targetJellies = Math.min(34, 14 + wave * 2);
    let placed = 0;
    let attempts = 0;
    while (placed < targetJellies && attempts < 180) {
      attempts++;
      const r = 1 + Math.floor(rng() * (rows - 2));
      const c = 1 + Math.floor(rng() * (cols - 2));
      if (grid[r][c] === '.') {
        const isDouble = wave >= 3 && rng() > 0.55;
        grid[r][c] = isDouble ? '2' : '1';
        placed++;
        const mc = cols - 1 - c;
        if (mc !== c && grid[r][mc] === '.' && placed < targetJellies) {
          grid[r][mc] = isDouble ? '2' : '1';
          placed++;
        }
      }
    }
    jellyCount = placed;
  }

  if (modeRoll === 2 || modeRoll === 0) {
    const validCols: number[] = [];
    for (let c = 0; c < cols; c++) {
      if (grid[0][c] !== '#' && grid[rows - 1][c] !== '#') {
        validCols.push(c);
      }
    }
    const desired = Math.min(validCols.length, 2 + Math.floor(wave / 4));
    for (let i = 0; i < desired; i++) {
      const colIdx = validCols[Math.floor((i * validCols.length) / desired)];
      if (i % 2 === 0) {
        grid[0][colIdx] = 'C';
        cherries++;
      } else {
        grid[0][colIdx] = 'H';
        hazelnuts++;
      }
      grid[rows - 1][colIdx] = 'E';
    }
  }

  const blockerBudget = Math.min(8, 2 + Math.floor(wave / 2));
  for (let b = 0; b < blockerBudget; b++) {
    const r = 2 + Math.floor(rng() * (rows - 4));
    const c = 1 + Math.floor(rng() * (cols - 2));
    if (grid[r][c] === '.' || grid[r][c] === '1') {
      const roll = rng();
      if (roll < 0.5) {
        grid[r][c] = wave >= 4 ? 'F' : 'f';
      } else {
        grid[r][c] = 'L';
      }
    }
  }

  const objectives: LevelObjective[] = [];
  const scoreTarget = 3500 + wave * 900;
  if (jellyCount > 0) objectives.push({ type: 'jelly', target: jellyCount });
  if (cherries + hazelnuts > 0) objectives.push({ type: 'ingredients', cherries, hazelnuts });
  if (modeRoll === 0) {
    const pool: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    const c1 = pool[wave % pool.length];
    const c2 = pool[(wave + 2) % pool.length];
    objectives.push({ type: 'collect', targets: { [c1]: 14 + wave, [c2]: 14 + wave } });
  }
  if (objectives.length === 0) {
    objectives.push({ type: 'score', target: scoreTarget });
  }

  const layout = grid.map((r) => r.join(''));
  const exactJelly = countChar(layout, '1') + countChar(layout, '2');
  for (const o of objectives) {
    if (o.type === 'jelly') o.target = exactJelly;
  }

  return {
    id: 1000 + wave,
    name: `Endless Wave ${wave}`,
    zone,
    difficulty: wave >= 6 ? 'super_hard' : wave >= 3 ? 'hard' : 'medium',
    rows,
    cols,
    moves,
    timeLimitSec,
    colorsCount,
    starScores: [scoreTarget, Math.round(scoreTarget * 1.5), Math.round(scoreTarget * 2.1)],
    objectives,
    tip: isTimedWave
      ? `TIMED WAVE ${wave}! Beat the clock to earn bonus rewards!`
      : `Endless Wave ${wave}: Clear all targets before moves run out to earn bonus coins!`,
    layout,
    isEndless: true,
    endlessWave: wave,
  };
}
