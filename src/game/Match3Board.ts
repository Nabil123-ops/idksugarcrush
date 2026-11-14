import {
  BoardPiece,
  CandyColor,
  CellData,
  IngredientType,
  LevelDefinition,
  PreBoosterType,
  SpecialType,
} from '../types/game';

export const ALL_COLORS: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

let nextPieceId = 1;
export function genPieceId(): number {
  return nextPieceId++;
}

export function randomColor(colorsCount: number): CandyColor {
  const pool = ALL_COLORS.slice(0, colorsCount);
  return pool[Math.floor(Math.random() * pool.length)];
}

export interface MatchGroup {
  cells: Array<{ r: number; c: number }>;
  color: CandyColor;
  spawnSpecial: SpecialType;
  spawnAt: { r: number; c: number };
}

export interface MoveHint {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  priority: number;
}

export function createPiece(
  r: number,
  c: number,
  color: CandyColor,
  special: SpecialType = 'none',
  locked = false,
  startY?: number
): BoardPiece {
  return {
    id: genPieceId(),
    kind: 'candy',
    color,
    special,
    locked,
    x: c,
    y: startY ?? r,
    vx: 0,
    vy: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    alpha: 1,
    wobblePhase: Math.random() * Math.PI * 2,
  };
}

export function createIngredientPiece(
  r: number,
  c: number,
  ingredientType: IngredientType
): BoardPiece {
  return {
    id: genPieceId(),
    kind: 'ingredient',
    color: 'red',
    special: 'none',
    ingredientType,
    locked: false,
    x: c,
    y: r,
    vx: 0,
    vy: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    alpha: 1,
    wobblePhase: Math.random() * Math.PI * 2,
  };
}

export function initializeBoard(
  level: LevelDefinition,
  activePreBoosters: PreBoosterType[]
): CellData[][] {
  const { rows, cols, layout, colorsCount } = level;
  const grid: CellData[][] = [];

  for (let r = 0; r < rows; r++) {
    const rowArr: CellData[] = [];
    const rowStr = layout[r] ?? '.'.repeat(cols);
    for (let c = 0; c < cols; c++) {
      const ch = rowStr[c] ?? '.';
      if (ch === '#') {
        rowArr.push({
          playable: false,
          jelly: 0,
          frosting: 0,
          piece: null,
        });
        continue;
      }

      const jelly: 0 | 1 | 2 = ch === '2' ? 2 : ch === '1' ? 1 : 0;
      const frosting: 0 | 1 | 2 = ch === 'F' ? 2 : ch === 'f' ? 1 : 0;
      const locked = ch === 'L';
      const isExit = ch === 'E';

      let piece: BoardPiece | null = null;
      if (frosting === 0) {
        if (ch === 'C') {
          piece = createIngredientPiece(r, c, 'cherry');
        } else if (ch === 'H') {
          piece = createIngredientPiece(r, c, 'hazelnut');
        } else {
          // Pick color that does not create immediate 3-match
          const forbidden = new Set<CandyColor>();
          if (
            c >= 2 &&
            rowArr[c - 1].piece?.kind === 'candy' &&
            rowArr[c - 2].piece?.kind === 'candy' &&
            rowArr[c - 1].piece!.color === rowArr[c - 2].piece!.color
          ) {
            forbidden.add(rowArr[c - 1].piece!.color);
          }
          if (
            r >= 2 &&
            grid[r - 1][c].piece?.kind === 'candy' &&
            grid[r - 2][c].piece?.kind === 'candy' &&
            grid[r - 1][c].piece!.color === grid[r - 2][c].piece!.color
          ) {
            forbidden.add(grid[r - 1][c].piece!.color);
          }
          const allowed = ALL_COLORS.slice(0, colorsCount).filter((col) => !forbidden.has(col));
          const chosen = allowed.length > 0 ? allowed[Math.floor(Math.random() * allowed.length)] : randomColor(colorsCount);
          piece = createPiece(r, c, chosen, 'none', locked, r - 2 - Math.random() * 2);
        }
      }

      rowArr.push({
        playable: true,
        jelly,
        frosting,
        isIngredientExit: isExit,
        piece,
      });
    }
    grid.push(rowArr);
  }

  // Ensure at least one valid move exists on start
  if (findValidMoves(grid).length === 0) {
    shuffleBoard(grid, colorsCount);
  }

  // Apply pre-game boosters onto random normal unlocked candies
  const eligible: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = grid[r][c].piece;
      if (p && p.kind === 'candy' && p.special === 'none' && !p.locked) {
        eligible.push({ r, c });
      }
    }
  }

  const pickEligible = () => {
    if (eligible.length === 0) return null;
    const idx = Math.floor(Math.random() * eligible.length);
    return eligible.splice(idx, 1)[0];
  };

  if (activePreBoosters.includes('striped_wrapped')) {
    const pos1 = pickEligible();
    if (pos1 && grid[pos1.r][pos1.c].piece) {
      grid[pos1.r][pos1.c].piece!.special = Math.random() > 0.5 ? 'striped_h' : 'striped_v';
    }
    const pos2 = pickEligible();
    if (pos2 && grid[pos2.r][pos2.c].piece) {
      grid[pos2.r][pos2.c].piece!.special = 'wrapped';
    }
  }

  if (activePreBoosters.includes('color_bomb')) {
    const pos = pickEligible();
    if (pos && grid[pos.r][pos.c].piece) {
      grid[pos.r][pos.c].piece!.special = 'color_bomb';
    }
  }

  if (activePreBoosters.includes('golden_crown')) {
    for (let i = 0; i < 2; i++) {
      const wp = pickEligible();
      if (wp && grid[wp.r][wp.c].piece) {
        grid[wp.r][wp.c].piece!.special = 'wrapped';
      }
    }
    const sp = pickEligible();
    if (sp && grid[sp.r][sp.c].piece) {
      grid[sp.r][sp.c].piece!.special = Math.random() > 0.5 ? 'striped_h' : 'striped_v';
    }
  }

  return grid;
}

export function findMatches(
  grid: CellData[][],
  preferredSwap?: { r1: number; c1: number; r2: number; c2: number }
): MatchGroup[] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  interface Run {
    cells: Array<{ r: number; c: number }>;
    color: CandyColor;
    dir: 'h' | 'v';
  }

  const hRuns: Run[] = [];
  const vRuns: Run[] = [];

  const isMatchable = (r: number, c: number): CandyColor | null => {
    const cell = grid[r]?.[c];
    if (!cell || !cell.playable || cell.frosting > 0 || !cell.piece) return null;
    if (cell.piece.kind !== 'candy' || cell.piece.special === 'color_bomb') return null;
    return cell.piece.color;
  };

  // Horizontal runs
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      const col = isMatchable(r, c);
      if (!col) {
        c++;
        continue;
      }
      let end = c + 1;
      while (end < cols && isMatchable(r, end) === col) {
        end++;
      }
      if (end - c >= 3) {
        const cells: Array<{ r: number; c: number }> = [];
        for (let k = c; k < end; k++) cells.push({ r, c: k });
        hRuns.push({ cells, color: col, dir: 'h' });
      }
      c = end;
    }
  }

  // Vertical runs
  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows) {
      const col = isMatchable(r, c);
      if (!col) {
        r++;
        continue;
      }
      let end = r + 1;
      while (end < rows && isMatchable(end, c) === col) {
        end++;
      }
      if (end - r >= 3) {
        const cells: Array<{ r: number; c: number }> = [];
        for (let k = r; k < end; k++) cells.push({ r: k, c });
        vRuns.push({ cells, color: col, dir: 'v' });
      }
      r = end;
    }
  }

  const allRuns = [...hRuns, ...vRuns];
  if (allRuns.length === 0) return [];

  // Merge intersecting runs of the same color via union-find
  const parent = allRuns.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };

  const cellKey = (r: number, c: number) => `${r},${c}`;
  const cellOwners = new Map<string, number[]>();

  allRuns.forEach((run, idx) => {
    for (const cell of run.cells) {
      const key = cellKey(cell.r, cell.c);
      const list = cellOwners.get(key) ?? [];
      for (const otherIdx of list) {
        if (allRuns[otherIdx].color === run.color) {
          union(idx, otherIdx);
        }
      }
      list.push(idx);
      cellOwners.set(key, list);
    }
  });

  const groupsMap = new Map<number, Run[]>();
  allRuns.forEach((run, idx) => {
    const root = find(idx);
    const arr = groupsMap.get(root) ?? [];
    arr.push(run);
    groupsMap.set(root, arr);
  });

  const groups: MatchGroup[] = [];
  for (const runs of groupsMap.values()) {
    const color = runs[0].color;
    const uniqueCellsMap = new Map<string, { r: number; c: number }>();
    let maxH = 0;
    let maxV = 0;
    let hasH = false;
    let hasV = false;

    for (const run of runs) {
      if (run.dir === 'h') {
        hasH = true;
        maxH = Math.max(maxH, run.cells.length);
      } else {
        hasV = true;
        maxV = Math.max(maxV, run.cells.length);
      }
      for (const cell of run.cells) {
        uniqueCellsMap.set(cellKey(cell.r, cell.c), cell);
      }
    }

    const cells = Array.from(uniqueCellsMap.values());
    let spawnSpecial: SpecialType = 'none';

    if (maxH >= 5 || maxV >= 5) {
      spawnSpecial = 'color_bomb';
    } else if (hasH && hasV) {
      spawnSpecial = 'wrapped';
    } else if (maxH === 4) {
      spawnSpecial = 'striped_v';
    } else if (maxV === 4) {
      spawnSpecial = 'striped_h';
    }

    // Choose best spawn cell: prefer the cell moved by the player
    let spawnAt = cells[Math.floor(cells.length / 2)];
    if (preferredSwap) {
      const hit2 = cells.find((p) => p.r === preferredSwap.r2 && p.c === preferredSwap.c2);
      const hit1 = cells.find((p) => p.r === preferredSwap.r1 && p.c === preferredSwap.c1);
      if (hit2) spawnAt = hit2;
      else if (hit1) spawnAt = hit1;
    }

    // Never overwrite a locked cell with a new special spawn if another cell is unlocked
    if (grid[spawnAt.r][spawnAt.c].piece?.locked) {
      const unlocked = cells.find((p) => !grid[p.r][p.c].piece?.locked);
      if (unlocked) spawnAt = unlocked;
    }

    groups.push({
      cells,
      color,
      spawnSpecial,
      spawnAt,
    });
  }

  return groups;
}

export function findValidMoves(grid: CellData[][]): MoveHint[] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const hints: MoveHint[] = [];

  const canSwapCell = (r: number, c: number) => {
    const cell = grid[r]?.[c];
    return Boolean(cell && cell.playable && cell.frosting === 0 && cell.piece && !cell.piece.locked);
  };

  const tryPair = (r1: number, c1: number, r2: number, c2: number) => {
    if (!canSwapCell(r1, c1) || !canSwapCell(r2, c2)) return;
    const p1 = grid[r1][c1].piece!;
    const p2 = grid[r2][c2].piece!;

    // Special + Special or Color Bomb + Candy is always a valid high-priority move
    if (p1.kind === 'candy' && p2.kind === 'candy') {
      if (p1.special === 'color_bomb' || p2.special === 'color_bomb') {
        hints.push({ r1, c1, r2, c2, priority: 100 });
        return;
      }
      if (p1.special !== 'none' && p2.special !== 'none') {
        hints.push({ r1, c1, r2, c2, priority: 90 });
        return;
      }
    }

    // Temporarily swap
    grid[r1][c1].piece = p2;
    grid[r2][c2].piece = p1;
    const matches = findMatches(grid);
    grid[r1][c1].piece = p1;
    grid[r2][c2].piece = p2;

    if (matches.length > 0) {
      let priority = 10;
      for (const m of matches) {
        if (m.spawnSpecial === 'color_bomb') priority = Math.max(priority, 85);
        else if (m.spawnSpecial === 'wrapped') priority = Math.max(priority, 70);
        else if (m.spawnSpecial !== 'none') priority = Math.max(priority, 50);
        for (const cell of m.cells) {
          if (grid[cell.r][cell.c].jelly > 0) priority += 12;
        }
      }
      hints.push({ r1, c1, r2, c2, priority });
    }
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) tryPair(r, c, r, c + 1);
      if (r + 1 < rows) tryPair(r, c, r + 1, c);
    }
  }

  hints.sort((a, b) => b.priority - a.priority);
  return hints;
}

export function shuffleBoard(grid: CellData[][], colorsCount: number): boolean {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const movableCoords: Array<{ r: number; c: number }> = [];
  const movablePieces: BoardPiece[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell.playable && cell.frosting === 0 && cell.piece && cell.piece.kind === 'candy' && !cell.piece.locked) {
        movableCoords.push({ r, c });
        movablePieces.push(cell.piece);
      }
    }
  }

  if (movablePieces.length < 3) return false;

  for (let attempt = 0; attempt < 30; attempt++) {
    // Fisher-Yates shuffle
    for (let i = movablePieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [movablePieces[i], movablePieces[j]] = [movablePieces[j], movablePieces[i]];
    }

    movableCoords.forEach(({ r, c }, idx) => {
      const piece = movablePieces[idx];
      grid[r][c].piece = piece;
      piece.x = c;
      piece.y = r;
      piece.scaleX = 0.65;
      piece.scaleY = 0.65;
    });

    if (findMatches(grid).length === 0 && findValidMoves(grid).length > 0) {
      return true;
    }
  }

  // Fallback: re-roll colors until valid & no instant matches
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell.playable && cell.frosting === 0 && cell.piece && cell.piece.kind === 'candy' && !cell.piece.locked) {
        cell.piece.color = randomColor(colorsCount);
      }
    }
  }
  return true;
}

export function countRemainingJelly(grid: CellData[][]): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.playable && cell.jelly > 0) count++;
    }
  }
  return count;
}

export function getDominantColor(grid: CellData[][]): CandyColor {
  const counts: Record<CandyColor, number> = {
    red: 0,
    orange: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    purple: 0,
  };
  for (const row of grid) {
    for (const cell of row) {
      if (cell.piece && cell.piece.kind === 'candy' && cell.piece.special !== 'color_bomb') {
        counts[cell.piece.color]++;
      }
    }
  }
  let best: CandyColor = 'red';
  let max = -1;
  for (const color of ALL_COLORS) {
    if (counts[color] > max) {
      max = counts[color];
      best = color;
    }
  }
  return best;
}
