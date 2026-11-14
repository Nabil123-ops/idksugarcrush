import { BoardPiece, CandyColor, CellData, ZoneId } from '../types/game';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  gravity: number;
  shape: 'circle' | 'star' | 'shard' | 'ring';
  rotation: number;
  vRot: number;
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  lineWidth: number;
}

export interface BeamEffect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  life: number;
  maxLife: number;
  width: number;
}

export interface FloatingText {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  scale: number;
  life: number;
  maxLife: number;
  isBanner?: boolean;
}

export const CANDY_PALETTES: Record<
  CandyColor,
  {
    core: string;
    light: string;
    mid: string;
    dark: string;
    deep: string;
    rim: string;
    glow: string;
  }
> = {
  red: {
    core: '#FFF1F2',
    light: '#FF85A1',
    mid: '#E11D48',
    dark: '#9F1239',
    deep: '#4C0519',
    rim: '#FFE4E6',
    glow: 'rgba(244, 63, 94, 0.5)',
  },
  orange: {
    core: '#FFF7ED',
    light: '#FDBA74',
    mid: '#F97316',
    dark: '#C2410C',
    deep: '#7C2D12',
    rim: '#FFEDD5',
    glow: 'rgba(249, 115, 22, 0.5)',
  },
  yellow: {
    core: '#FEFCE8',
    light: '#FEF08A',
    mid: '#FACC15',
    dark: '#CA8A04',
    deep: '#713F12',
    rim: '#FEF9C3',
    glow: 'rgba(250, 204, 21, 0.5)',
  },
  green: {
    core: '#F0FDF4',
    light: '#86EFAC',
    mid: '#22C55E',
    dark: '#15803D',
    deep: '#052E16',
    rim: '#DCFCE7',
    glow: 'rgba(34, 197, 94, 0.5)',
  },
  blue: {
    core: '#F0F9FF',
    light: '#7DD3FC',
    mid: '#0EA5E9',
    dark: '#0369A1',
    deep: '#0C4A6E',
    rim: '#E0F2FE',
    glow: 'rgba(14, 165, 233, 0.5)',
  },
  purple: {
    core: '#FDF4FF',
    light: '#E879F9',
    mid: '#A855F7',
    dark: '#6B21A8',
    deep: '#3B0764',
    rim: '#FAE8FF',
    glow: 'rgba(168, 85, 247, 0.5)',
  },
};

const ZONE_GLOW_MAP: Record<ZoneId, string> = {
  sugar_meadow: 'rgba(252, 231, 243, 0.36)',
  caramel_canyon: 'rgba(254, 243, 199, 0.35)',
  crystal_glacier: 'rgba(224, 242, 254, 0.38)',
  berry_blossom: 'rgba(250, 232, 255, 0.36)',
  starlight_citadel: 'rgba(224, 231, 255, 0.38)',
  minty_lagoon: 'rgba(204, 251, 241, 0.36)',
  honeycomb_hollow: 'rgba(254, 249, 195, 0.36)',
  truffle_woods: 'rgba(255, 237, 213, 0.34)',
  sorbet_dunes: 'rgba(255, 237, 213, 0.36)',
  marshmallow_peaks: 'rgba(252, 231, 243, 0.38)',
  fizzing_springs: 'rgba(220, 252, 231, 0.36)',
  gummy_harbor: 'rgba(219, 234, 254, 0.38)',
  cinnamon_bastion: 'rgba(255, 228, 230, 0.36)',
  prism_cavern: 'rgba(243, 232, 255, 0.38)',
  macaron_promenade: 'rgba(252, 231, 243, 0.38)',
  velvet_nebula: 'rgba(233, 213, 255, 0.34)',
  aurora_glaze_spire: 'rgba(207, 250, 254, 0.38)',
  imperial_sugar_throne: 'rgba(254, 243, 199, 0.4)',
};

export function drawBoardBackground(
  ctx: CanvasRenderingContext2D,
  grid: CellData[][],
  originX: number,
  originY: number,
  cellSize: number,
  zone: ZoneId,
  time: number
) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const frameGlow = ZONE_GLOW_MAP[zone] ?? 'rgba(224, 231, 255, 0.36)';

  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.38)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 7;
  ctx.fillStyle = frameGlow;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].playable) continue;
      const x = originX + c * cellSize;
      const y = originY + r * cellSize;
      roundRect(ctx, x - 3.5, y - 3.5, cellSize + 7, cellSize + 7, 13);
      ctx.fill();
    }
  }
  ctx.restore();

  // Crisp luminous outer perimeter border lines on exposed playable cell edges
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].playable) continue;
      const x = originX + c * cellSize;
      const y = originY + r * cellSize;
      if (!grid[r - 1]?.[c]?.playable) {
        ctx.beginPath();
        ctx.moveTo(x - 1, y - 2.5);
        ctx.lineTo(x + cellSize + 1, y - 2.5);
        ctx.stroke();
      }
      if (!grid[r + 1]?.[c]?.playable) {
        ctx.beginPath();
        ctx.moveTo(x - 1, y + cellSize + 2.5);
        ctx.lineTo(x + cellSize + 1, y + cellSize + 2.5);
        ctx.stroke();
      }
      if (!grid[r]?.[c - 1]?.playable) {
        ctx.beginPath();
        ctx.moveTo(x - 2.5, y - 1);
        ctx.lineTo(x - 2.5, y + cellSize + 1);
        ctx.stroke();
      }
      if (!grid[r]?.[c + 1]?.playable) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize + 2.5, y - 1);
        ctx.lineTo(x + cellSize + 2.5, y + cellSize + 1);
        ctx.stroke();
      }
    }
  }
  ctx.restore();

  // Individual frosted glass checkerboard tiles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (!cell.playable) continue;
      const x = originX + c * cellSize;
      const y = originY + r * cellSize;
      const pad = 1.6;
      const w = cellSize - pad * 2;
      const rad = Math.max(7, cellSize * 0.16);

      const tileGrad = ctx.createLinearGradient(x, y, x, y + cellSize);
      if ((r + c) % 2 === 0) {
        tileGrad.addColorStop(0, 'rgba(255, 255, 255, 0.48)');
        tileGrad.addColorStop(1, 'rgba(226, 232, 240, 0.34)');
      } else {
        tileGrad.addColorStop(0, 'rgba(203, 213, 225, 0.34)');
        tileGrad.addColorStop(1, 'rgba(148, 163, 184, 0.28)');
      }

      ctx.fillStyle = tileGrad;
      roundRect(ctx, x + pad, y + pad, w, w, rad);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.lineWidth = 1;
      roundRect(ctx, x + pad, y + pad, w, w, rad);
      ctx.stroke();

      if (cell.jelly > 0) {
        drawJellyTile(
          ctx,
          x + pad + 1.5,
          y + pad + 1.5,
          w - 3,
          w - 3,
          rad - 1,
          cell.jelly === 2 ? 2 : 1,
          time,
          r * 3 + c
        );
      }

      if (cell.isIngredientExit) {
        drawIngredientExitArrow(ctx, x + cellSize / 2, y + cellSize - 2, cellSize, time);
      }
    }
  }
}

function drawJellyTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  layer: 1 | 2,
  time: number,
  seed: number
) {
  ctx.save();
  const shimmer = 0.08 * Math.sin(time * 3.2 + seed * 0.65);
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  if (layer === 2) {
    grad.addColorStop(0, `rgba(251, 113, 133, ${0.84 + shimmer})`);
    grad.addColorStop(0.5, `rgba(225, 29, 72, ${0.9 + shimmer})`);
    grad.addColorStop(1, `rgba(136, 19, 55, ${0.95 + shimmer})`);
  } else {
    grad.addColorStop(0, `rgba(253, 164, 175, ${0.56 + shimmer})`);
    grad.addColorStop(1, `rgba(244, 63, 94, ${0.68 + shimmer})`);
  }
  ctx.fillStyle = grad;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();

  // Top glossy jelly sheen
  ctx.fillStyle = layer === 2 ? 'rgba(255,255,255,0.48)' : 'rgba(255,255,255,0.34)';
  roundRect(ctx, x + 4, y + 3, w - 8, h * 0.26, r * 0.5);
  ctx.fill();

  if (layer === 2) {
    ctx.strokeStyle = 'rgba(255, 241, 242, 0.95)';
    ctx.lineWidth = 2;
    roundRect(ctx, x + 2, y + 2, w - 4, h - 4, Math.max(4, r - 2));
    ctx.stroke();

    // Mini jewel dot in double-jelly center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(x + w - 7, y + h - 7, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawIngredientExitArrow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  bottomY: number,
  cellSize: number,
  time: number
) {
  ctx.save();
  const bounce = Math.sin(time * 5) * 3;
  const arrowSize = cellSize * 0.22;
  const y = bottomY + 5 + bounce;

  ctx.shadowColor = 'rgba(34, 197, 94, 0.65)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#22C55E';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - arrowSize, y - arrowSize * 0.65);
  ctx.lineTo(cx + arrowSize, y - arrowSize * 0.65);
  ctx.lineTo(cx, y + arrowSize * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawFrostingBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  layer: 1 | 2
) {
  const pad = 4;
  const w = cellSize - pad * 2;
  const bx = x + pad;
  const by = y + pad;
  const rad = Math.max(8, cellSize * 0.22);

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  roundRect(ctx, bx + 1, by + 4, w, w, rad);
  ctx.fill();

  const grad = ctx.createLinearGradient(bx, by, bx, by + w);
  if (layer === 2) {
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.5, '#F1F5F9');
    grad.addColorStop(1, '#CBD5E1');
  } else {
    grad.addColorStop(0, '#FFF1F2');
    grad.addColorStop(0.55, '#FFE4E6');
    grad.addColorStop(1, '#FDA4AF');
  }
  ctx.fillStyle = grad;
  roundRect(ctx, bx, by, w, w, rad);
  ctx.fill();

  ctx.strokeStyle = layer === 2 ? '#94A3B8' : '#FB7185';
  ctx.lineWidth = 1.8;
  roundRect(ctx, bx, by, w, w, rad);
  ctx.stroke();

  // Swirled buttercream piping ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(bx + w * 0.5, by + w * 0.5, w * 0.26, 0.2, Math.PI * 1.65);
  ctx.stroke();

  if (layer === 1) {
    ctx.strokeStyle = 'rgba(190, 18, 60, 0.55)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(bx + w * 0.2, by + w * 0.25);
    ctx.lineTo(bx + w * 0.48, by + w * 0.45);
    ctx.lineTo(bx + w * 0.38, by + w * 0.72);
    ctx.moveTo(bx + w * 0.48, by + w * 0.45);
    ctx.lineTo(bx + w * 0.78, by + w * 0.55);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawPiece(
  ctx: CanvasRenderingContext2D,
  piece: BoardPiece,
  originX: number,
  originY: number,
  cellSize: number,
  time: number,
  isSelected: boolean,
  isHinted: boolean
) {
  const cx = originX + (piece.x + 0.5) * cellSize;
  const cy = originY + (piece.y + 0.5) * cellSize;

  ctx.save();
  ctx.globalAlpha = piece.alpha;
  ctx.translate(cx, cy);

  let sx = piece.scaleX;
  let sy = piece.scaleY;
  let rot = piece.rotation;

  if (isSelected) {
    const pulse = 1 + 0.08 * Math.sin(time * 9);
    sx *= pulse * 1.08;
    sy *= pulse * 1.08;
  } else if (isHinted) {
    const hintPulse = 1 + 0.1 * Math.sin(time * 7);
    sx *= hintPulse;
    sy *= hintPulse;
    rot += 0.08 * Math.sin(time * 7);
  }

  ctx.rotate(rot);
  ctx.scale(sx, sy);

  const radius = cellSize * 0.41;

  if (isSelected || isHinted) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.18, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.65)' : 'rgba(253, 224, 71, 0.52)';
    ctx.fill();
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = isSelected ? '#FFFFFF' : '#FACC15';
    ctx.stroke();
    ctx.restore();
  }

  if (piece.kind === 'ingredient') {
    if (piece.ingredientType === 'cherry') {
      drawCherry(ctx, radius);
    } else {
      drawHazelnut(ctx, radius);
    }
    ctx.restore();
    return;
  }

  if (piece.special === 'wrapped') {
    drawWrappedHalo(ctx, radius, time, piece.wrappedStage === 1);
  }

  if (piece.special === 'color_bomb') {
    drawColorBomb(ctx, radius, time);
  } else {
    drawCandyShape(ctx, piece.color, radius, time, piece.wobblePhase);
    if (piece.special === 'striped_h' || piece.special === 'striped_v') {
      drawStripeOverlay(ctx, radius, piece.special === 'striped_h', time);
    }
  }

  if (piece.locked) {
    drawLicoriceLock(ctx, cellSize * 0.44);
  }

  ctx.restore();
}

function drawCandyShape(
  ctx: CanvasRenderingContext2D,
  color: CandyColor,
  r: number,
  time: number,
  phase: number
) {
  const pal = CANDY_PALETTES[color];

  // 1. Rich colored ambient occlusion + bounce shadow
  ctx.save();
  ctx.translate(0, r * 0.14);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
  ctx.shadowColor = pal.glow;
  ctx.shadowBlur = r * 0.4;
  traceCandyPath(ctx, color, r * 0.96);
  ctx.fill();
  ctx.restore();

  // 2. Multi-stop 3D volumetric glass gradient body
  ctx.save();
  const grad = ctx.createRadialGradient(-r * 0.34, -r * 0.4, r * 0.03, r * 0.06, r * 0.12, r * 1.2);
  grad.addColorStop(0, pal.core);
  grad.addColorStop(0.2, pal.light);
  grad.addColorStop(0.58, pal.mid);
  grad.addColorStop(0.88, pal.dark);
  grad.addColorStop(1, pal.deep);

  traceCandyPath(ctx, color, r);
  ctx.fillStyle = grad;
  ctx.fill();

  // Outer crisp sugar-glaze rim
  ctx.lineWidth = Math.max(1.8, r * 0.09);
  ctx.strokeStyle = pal.rim;
  ctx.stroke();

  ctx.clip();

  // 3. Subsurface bottom refractive bounce
  const subGrad = ctx.createRadialGradient(0, r * 0.5, 0, 0, r * 0.5, r * 0.85);
  subGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  subGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = subGrad;
  ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4);

  // 4. Inner bevel ring shadow inside rim
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = Math.max(2, r * 0.12);
  traceCandyPath(ctx, color, r * 0.88);
  ctx.stroke();

  // 5. Per-candy ultra-refined signature sculptural detail
  if (color === 'red') {
    // Translucent ruby jellybean inner gel core + specular arc
    ctx.strokeStyle = 'rgba(255, 241, 242, 0.55)';
    ctx.lineWidth = Math.max(1.6, r * 0.085);
    ctx.beginPath();
    ctx.ellipse(-r * 0.08, -r * 0.06, r * 0.44, r * 0.22, -0.34, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.1, -r * 0.14, r * 0.34, r * 0.13, -0.34, 0, Math.PI * 2);
    ctx.fill();
  } else if (color === 'blue') {
    // Crisp dual-band peppermint/blueberry swirl with bright highlight ribbon
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.lineWidth = Math.max(2.3, r * 0.165);
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 3.9; a += 0.16) {
      const sr = (a / (Math.PI * 3.9)) * r * 0.76;
      const px = Math.cos(a) * sr;
      const py = Math.sin(a) * sr;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(186, 230, 253, 0.62)';
    ctx.lineWidth = Math.max(1.2, r * 0.085);
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 3.2; a += 0.18) {
      const sr = (a / (Math.PI * 3.2)) * r * 0.66;
      const px = Math.cos(a + Math.PI) * sr;
      const py = Math.sin(a + Math.PI) * sr;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  } else if (color === 'green') {
    // Cushion emerald gumdrop inner chamfer + glistening sugar crystals
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.48)';
    ctx.lineWidth = Math.max(1.8, r * 0.09);
    roundRect(ctx, -r * 0.6, -r * 0.56, r * 1.2, r * 1.12, r * 0.34);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    const flecks = [
      [-0.38, -0.16],
      [0.28, 0.25],
      [-0.1, 0.44],
      [0.36, -0.22],
      [0.08, -0.38],
      [-0.3, 0.28],
      [0.02, 0.05],
    ];
    for (const [fx, fy] of flecks) {
      ctx.beginPath();
      ctx.arc(fx * r, fy * r, r * 0.055, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (color === 'orange') {
    // Sculpted tangerine lozenge concentric facet
    ctx.strokeStyle = 'rgba(255, 247, 237, 0.72)';
    ctx.lineWidth = Math.max(1.6, r * 0.09);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.48, r * 0.68, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.28, r * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (color === 'yellow') {
    // Jewel-faceted crystal lemon drop
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)';
    ctx.lineWidth = Math.max(1.4, r * 0.075);
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.8);
    ctx.lineTo(r * 0.38, r * 0.14);
    ctx.lineTo(0, r * 0.66);
    ctx.lineTo(-r * 0.38, r * 0.14);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.65);
    ctx.lineTo(r * 0.22, 0);
    ctx.lineTo(0, r * 0.38);
    ctx.lineTo(-r * 0.22, 0);
    ctx.closePath();
    ctx.fill();
  } else if (color === 'purple') {
    // Sculpted plump berry pearls with twin catchlights
    const orbs = [
      [-0.27, -0.22],
      [0.27, -0.22],
      [0, 0.04],
      [-0.25, 0.3],
      [0.25, 0.3],
    ];
    for (const [ox, oy] of orbs) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.arc(ox * r, oy * r, r * 0.21, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc((ox - 0.065) * r, (oy - 0.065) * r, r * 0.068, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 6. Animated traveling diagonal studio glint (gentle periodic shimmer)
  const glintCycle = ((time * 0.55 + phase) % 4.5);
  if (glintCycle < 0.75) {
    const t = glintCycle / 0.75;
    const gx = -r * 1.3 + t * r * 2.6;
    ctx.save();
    ctx.rotate(-0.55);
    const gGrad = ctx.createLinearGradient(gx - r * 0.28, 0, gx + r * 0.28, 0);
    gGrad.addColorStop(0, 'rgba(255,255,255,0)');
    gGrad.addColorStop(0.5, 'rgba(255,255,255,0.42)');
    gGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gGrad;
    ctx.fillRect(gx - r * 0.28, -r * 1.4, r * 0.56, r * 2.8);
    ctx.restore();
  }

  // 7. Primary crisp studio specular highlight + twin catchlight dot
  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.22, -r * 0.44, r * 0.36, r * 0.15, -0.32, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.beginPath();
  ctx.arc(r * 0.23, -r * 0.48, r * 0.085, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function traceCandyPath(ctx: CanvasRenderingContext2D, color: CandyColor, r: number) {
  ctx.beginPath();
  switch (color) {
    case 'red': {
      ctx.save();
      ctx.rotate(-0.34);
      ctx.moveTo(-r * 0.74, -r * 0.12);
      ctx.bezierCurveTo(-r * 0.8, -r * 0.74, r * 0.8, -r * 0.74, r * 0.74, -r * 0.12);
      ctx.bezierCurveTo(r * 0.84, r * 0.56, r * 0.3, r * 0.66, 0, r * 0.38);
      ctx.bezierCurveTo(-r * 0.3, r * 0.66, -r * 0.84, r * 0.56, -r * 0.74, -r * 0.12);
      ctx.closePath();
      ctx.restore();
      break;
    }
    case 'orange': {
      ctx.ellipse(0, 0, r * 0.74, r * 0.94, 0, 0, Math.PI * 2);
      ctx.closePath();
      break;
    }
    case 'yellow': {
      ctx.moveTo(0, -r * 0.96);
      ctx.bezierCurveTo(r * 0.65, -r * 0.65, r * 0.96, 0, r * 0.76, r * 0.55);
      ctx.quadraticCurveTo(0, r * 0.96, -r * 0.76, r * 0.55);
      ctx.bezierCurveTo(-r * 0.96, 0, -r * 0.65, -r * 0.65, 0, -r * 0.96);
      ctx.closePath();
      break;
    }
    case 'green': {
      const s = r * 0.86;
      const rad = r * 0.42;
      ctx.moveTo(-s + rad, -s);
      ctx.arcTo(s, -s, s, s, rad);
      ctx.arcTo(s, s, -s, s, rad);
      ctx.arcTo(-s, s, -s, -s, rad);
      ctx.arcTo(-s, -s, s, -s, rad);
      ctx.closePath();
      break;
    }
    case 'blue': {
      ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
      ctx.closePath();
      break;
    }
    case 'purple': {
      const lobes = 6;
      for (let i = 0; i < lobes; i++) {
        const a1 = (i / lobes) * Math.PI * 2;
        const a2 = ((i + 0.5) / lobes) * Math.PI * 2;
        const a3 = ((i + 1) / lobes) * Math.PI * 2;
        const rOuter = r * 0.96;
        const rInner = r * 0.68;
        if (i === 0) {
          ctx.moveTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
        }
        ctx.quadraticCurveTo(
          Math.cos(a2) * (rOuter * 1.16),
          Math.sin(a2) * (rOuter * 1.16),
          Math.cos(a3) * rInner,
          Math.sin(a3) * rInner
        );
      }
      ctx.closePath();
      break;
    }
  }
}

function drawStripeOverlay(
  ctx: CanvasRenderingContext2D,
  r: number,
  isHorizontal: boolean,
  time: number
) {
  ctx.save();
  const shimmer = 0.84 + 0.16 * Math.sin(time * 8);
  ctx.strokeStyle = `rgba(255, 255, 255, ${shimmer})`;
  ctx.lineWidth = Math.max(2.8, r * 0.24);
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
  ctx.shadowBlur = 7;

  const offsets = [-r * 0.38, 0, r * 0.38];
  for (const off of offsets) {
    ctx.beginPath();
    if (isHorizontal) {
      ctx.moveTo(-r * 0.72, off);
      ctx.lineTo(r * 0.72, off);
    } else {
      ctx.moveTo(off, -r * 0.72);
      ctx.lineTo(off, r * 0.72);
    }
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#FFFFFF';
  const tip = r * 0.93;
  const s = r * 0.19;
  if (isHorizontal) {
    ctx.beginPath();
    ctx.moveTo(-tip - s * 0.4, 0);
    ctx.lineTo(-tip + s * 0.5, -s * 0.65);
    ctx.lineTo(-tip + s * 0.5, s * 0.65);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(tip + s * 0.4, 0);
    ctx.lineTo(tip - s * 0.5, -s * 0.65);
    ctx.lineTo(tip - s * 0.5, s * 0.65);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -tip - s * 0.4);
    ctx.lineTo(-s * 0.65, -tip + s * 0.5);
    ctx.lineTo(s * 0.65, -tip + s * 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, tip + s * 0.4);
    ctx.lineTo(-s * 0.65, tip - s * 0.5);
    ctx.lineTo(s * 0.65, tip - s * 0.5);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawWrappedHalo(
  ctx: CanvasRenderingContext2D,
  r: number,
  time: number,
  isArmedSecondStage: boolean
) {
  ctx.save();
  const pulse = isArmedSecondStage ? 1 + 0.16 * Math.sin(time * 22) : 1 + 0.06 * Math.sin(time * 5);
  ctx.scale(pulse, pulse);

  const grad = ctx.createLinearGradient(-r, -r, r, r);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.82)');
  grad.addColorStop(0.5, isArmedSecondStage ? 'rgba(251, 191, 36, 0.72)' : 'rgba(255, 255, 255, 0.34)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.78)');

  ctx.fillStyle = grad;
  ctx.strokeStyle = isArmedSecondStage ? '#FDE047' : 'rgba(255, 255, 255, 0.96)';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = isArmedSecondStage ? '#FACC15' : 'rgba(255,255,255,0.65)';
  ctx.shadowBlur = isArmedSecondStage ? 14 : 7;

  const w = r * 1.08;
  roundRect(ctx, -w, -w, w * 2, w * 2, r * 0.42);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawColorBomb(ctx: CanvasRenderingContext2D, r: number, time: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.36)';
  ctx.beginPath();
  ctx.arc(0, r * 0.14, r * 0.94, 0, Math.PI * 2);
  ctx.fill();

  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.08, 0, 0, r);
  grad.addColorStop(0, '#A16207');
  grad.addColorStop(0.45, '#451A03');
  grad.addColorStop(1, '#1C0A00');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.96, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(253, 224, 71, 0.95)';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = 'rgba(253, 224, 71, 0.65)';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const sprinkleColors = ['#FB7185', '#FACC15', '#34D399', '#38BDF8', '#C084FC', '#FB923C'];
  const count = 12;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + time * 1.0;
    const dist = i % 2 === 0 ? r * 0.58 : r * 0.28;
    const sx = Math.cos(angle) * dist;
    const sy = Math.sin(angle) * dist;
    ctx.fillStyle = sprinkleColors[i % sprinkleColors.length];
    ctx.beginPath();
    ctx.arc(sx, sy, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.arc(sx - r * 0.03, sy - r * 0.03, r * 0.048, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, -r * 0.45, r * 0.36, r * 0.14, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLicoriceLock(ctx: CanvasRenderingContext2D, halfSize: number) {
  ctx.save();
  ctx.strokeStyle = '#1E1B18';
  ctx.lineWidth = Math.max(3, halfSize * 0.2);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-halfSize * 0.78, -halfSize * 0.78);
  ctx.lineTo(halfSize * 0.78, halfSize * 0.78);
  ctx.moveTo(halfSize * 0.78, -halfSize * 0.78);
  ctx.lineTo(-halfSize * 0.78, halfSize * 0.78);
  ctx.stroke();

  ctx.strokeStyle = '#57534E';
  ctx.lineWidth = Math.max(1.2, halfSize * 0.07);
  ctx.stroke();

  ctx.strokeStyle = '#292524';
  ctx.lineWidth = Math.max(2.5, halfSize * 0.15);
  roundRect(ctx, -halfSize * 0.88, -halfSize * 0.88, halfSize * 1.76, halfSize * 1.76, halfSize * 0.35);
  ctx.stroke();
  ctx.restore();
}

function drawCherry(ctx: CanvasRenderingContext2D, r: number) {
  ctx.save();
  ctx.strokeStyle = '#15803D';
  ctx.lineWidth = Math.max(2.2, r * 0.14);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.32, r * 0.05);
  ctx.quadraticCurveTo(-r * 0.15, -r * 0.7, r * 0.1, -r * 0.82);
  ctx.moveTo(r * 0.34, r * 0.15);
  ctx.quadraticCurveTo(r * 0.3, -r * 0.5, r * 0.1, -r * 0.82);
  ctx.stroke();

  ctx.fillStyle = '#22C55E';
  ctx.beginPath();
  ctx.ellipse(r * 0.32, -r * 0.74, r * 0.25, r * 0.12, -0.4, 0, Math.PI * 2);
  ctx.fill();

  const cherries = [
    { x: -r * 0.34, y: r * 0.25, rad: r * 0.4 },
    { x: r * 0.32, y: r * 0.32, rad: r * 0.42 },
  ];
  for (const ch of cherries) {
    const grad = ctx.createRadialGradient(ch.x - ch.rad * 0.3, ch.y - ch.rad * 0.3, ch.rad * 0.1, ch.x, ch.y, ch.rad);
    grad.addColorStop(0, '#FB7185');
    grad.addColorStop(0.5, '#E11D48');
    grad.addColorStop(1, '#881337');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ch.x, ch.y, ch.rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFE4E6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.84)';
    ctx.beginPath();
    ctx.ellipse(ch.x - ch.rad * 0.3, ch.y - ch.rad * 0.35, ch.rad * 0.28, ch.rad * 0.14, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHazelnut(ctx: CanvasRenderingContext2D, r: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.24)';
  ctx.beginPath();
  ctx.arc(0, r * 0.2, r * 0.78, 0, Math.PI * 2);
  ctx.fill();

  const nutGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.1, r * 0.1, 0, r * 0.15, r * 0.85);
  nutGrad.addColorStop(0, '#F59E0B');
  nutGrad.addColorStop(0.55, '#B45309');
  nutGrad.addColorStop(1, '#78350F');
  ctx.fillStyle = nutGrad;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.85);
  ctx.bezierCurveTo(r * 0.82, r * 0.65, r * 0.86, -r * 0.25, 0, -r * 0.45);
  ctx.bezierCurveTo(-r * 0.86, -r * 0.25, -r * 0.82, r * 0.65, 0, r * 0.85);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FDE68A';
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.26, r * 0.46, r * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#451A03';
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.38, r * 0.74, r * 0.34, 0, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#92400E';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = '#451A03';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.7);
  ctx.lineTo(r * 0.08, -r * 0.92);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.58)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, r * 0.18, r * 0.18, r * 0.1, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function drawEffects(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  shockwaves: Shockwave[],
  beams: BeamEffect[],
  floatingTexts: FloatingText[]
) {
  for (const b of beams) {
    const t = Math.max(0, b.life / b.maxLife);
    ctx.save();
    ctx.globalAlpha = t;
    ctx.strokeStyle = b.color;
    ctx.lineWidth = b.width * t;
    ctx.lineCap = 'round';
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(b.x1, b.y1);
    const mx = (b.x1 + b.x2) / 2 + (Math.random() - 0.5) * 14;
    const my = (b.y1 + b.y2) / 2 + (Math.random() - 0.5) * 14;
    ctx.lineTo(mx, my);
    ctx.lineTo(b.x2, b.y2);
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(1.5, b.width * t * 0.4);
    ctx.stroke();
    ctx.restore();
  }

  for (const sw of shockwaves) {
    ctx.save();
    ctx.globalAlpha = sw.alpha;
    ctx.strokeStyle = sw.color;
    ctx.lineWidth = sw.lineWidth;
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  for (const p of particles) {
    const t = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = p.alpha * t;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;

    if (p.shape === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size);
        ctx.lineTo(Math.cos(a + Math.PI / 4) * p.size * 0.35, Math.sin(a + Math.PI / 4) * p.size * 0.35);
      }
      ctx.closePath();
      ctx.fill();
    } else if (p.shape === 'shard') {
      ctx.beginPath();
      ctx.moveTo(-p.size, -p.size * 0.5);
      ctx.lineTo(p.size, 0);
      ctx.lineTo(-p.size * 0.3, p.size);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * (0.4 + 0.6 * t), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  for (const ft of floatingTexts) {
    const progress = 1 - ft.life / ft.maxLife;
    const alpha = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;
    const popScale = progress < 0.15 ? 0.6 + (progress / 0.15) * 0.55 : 1.15 - progress * 0.15;

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(ft.x, ft.y);
    ctx.scale(ft.scale * popScale, ft.scale * popScale);
    ctx.font = ft.isBanner
      ? '900 30px Outfit, system-ui, sans-serif'
      : '800 18px Outfit, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.lineWidth = ft.isBanner ? 6 : 4;
    ctx.strokeStyle = 'rgba(88, 28, 135, 0.9)';
    ctx.strokeText(ft.text, 0, 0);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, 0, 0);
    ctx.restore();
  }
}
