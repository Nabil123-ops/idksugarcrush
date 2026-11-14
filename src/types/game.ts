export type CandyColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export type SpecialType = 'none' | 'striped_h' | 'striped_v' | 'wrapped' | 'color_bomb';

export type IngredientType = 'cherry' | 'hazelnut';

export type ItemKind = 'candy' | 'ingredient';

export type LevelDifficulty = 'easy' | 'medium' | 'hard' | 'super_hard';

export interface BoardPiece {
  id: number;
  kind: ItemKind;
  color: CandyColor;
  special: SpecialType;
  ingredientType?: IngredientType;
  locked: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  alpha: number;
  wobblePhase: number;
  isRemoving?: boolean;
  wrappedStage?: number;
}

export interface CellData {
  playable: boolean;
  jelly: 0 | 1 | 2;
  frosting: 0 | 1 | 2;
  isIngredientExit?: boolean;
  piece: BoardPiece | null;
}

export type ZoneId =
  | 'sugar_meadow'
  | 'caramel_canyon'
  | 'crystal_glacier'
  | 'berry_blossom'
  | 'starlight_citadel'
  | 'minty_lagoon'
  | 'honeycomb_hollow'
  | 'truffle_woods'
  | 'sorbet_dunes'
  | 'marshmallow_peaks'
  | 'fizzing_springs'
  | 'gummy_harbor'
  | 'cinnamon_bastion'
  | 'prism_cavern'
  | 'macaron_promenade'
  | 'velvet_nebula'
  | 'aurora_glaze_spire'
  | 'imperial_sugar_throne';

export type LevelObjective =
  | { type: 'score'; target: number }
  | { type: 'jelly'; target: number }
  | { type: 'ingredients'; cherries: number; hazelnuts: number }
  | { type: 'collect'; targets: Partial<Record<CandyColor, number>> };

export interface LevelDefinition {
  id: number;
  name: string;
  zone: ZoneId;
  difficulty: LevelDifficulty;
  rows: number;
  cols: number;
  moves: number;
  timeLimitSec?: number;
  colorsCount: 4 | 5 | 6;
  starScores: [number, number, number];
  objectives: LevelObjective[];
  tip: string;
  layout: string[];
  isEndless?: boolean;
  endlessWave?: number;
}

export type PreBoosterType = 'striped_wrapped' | 'color_bomb' | 'extra_moves' | 'golden_crown';

export type InGameBoosterType =
  | 'hammer'
  | 'free_switch'
  | 'color_bomb'
  | 'cross_wand'
  | 'sugar_shuffle';

export type AvatarId = 'princess' | 'crown' | 'gummy' | 'lollipop';

export interface PlayerProgress {
  playerName: string;
  avatarId: AvatarId;
  lives: number;
  xp: number;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  levelHighScores: Record<number, number>;
  coins: number;
  boosters: {
    hammer: number;
    free_switch: number;
    color_bomb: number;
    cross_wand: number;
    sugar_shuffle: number;
  };
  preBoosters: {
    striped_wrapped: number;
    color_bomb: number;
    extra_moves: number;
    golden_crown: number;
  };
  soundEnabled: boolean;
  musicEnabled: boolean;
  endlessBestWave: number;
  endlessBestScore: number;
  claimedRewards: string[];
}

export type ScreenState = 'TITLE_MENU' | 'SAGA_MAP' | 'PLAYING';

export interface GameHUDState {
  levelId: number;
  levelName: string;
  zone: ZoneId;
  difficulty: LevelDifficulty;
  movesLeft: number;
  timeLeftSec: number | null;
  isTimed: boolean;
  score: number;
  starScores: [number, number, number];
  jellyRemaining: number;
  jellyTotal: number;
  cherriesRemaining: number;
  cherriesTotal: number;
  hazelnutsRemaining: number;
  hazelnutsTotal: number;
  collectTargets: Partial<Record<CandyColor, number>>;
  collectRemaining: Partial<Record<CandyColor, number>>;
  scoreTarget: number | null;
  comboCount: number;
  isBusy: boolean;
  isSugarCrush: boolean;
  statusBanner: string | null;
}
