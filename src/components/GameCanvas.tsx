import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { audioEngine } from '../game/AudioEngine';
import {
  BeamEffect,
  CANDY_PALETTES,
  drawBoardBackground,
  drawEffects,
  drawFrostingBlock,
  drawPiece,
  FloatingText,
  Particle,
  Shockwave,
} from '../game/CandyRenderer';
import {
  ALL_COLORS,
  countRemainingJelly,
  createPiece,
  findMatches,
  findValidMoves,
  getDominantColor,
  initializeBoard,
  MoveHint,
  randomColor,
  shuffleBoard,
} from '../game/Match3Board';
import {
  BoardPiece,
  CandyColor,
  CellData,
  GameHUDState,
  InGameBoosterType,
  LevelDefinition,
  PreBoosterType,
  SpecialType,
} from '../types/game';

export interface GameCanvasHandle {
  addExtraMoves: (count: number) => void;
  addExtraTime: (seconds: number) => void;
  triggerSugarShuffle: () => boolean;
}

interface GameCanvasProps {
  level: LevelDefinition;
  activePreBoosters: PreBoosterType[];
  activeBooster: InGameBoosterType | null;
  isPaused: boolean;
  restartKey: number;
  onConsumeBooster: (type: InGameBoosterType) => void;
  onCancelBooster: () => void;
  onHudUpdate: (hud: GameHUDState) => void;
  onLevelWin: (score: number, stars: number) => void;
  onLevelLose: (score: number) => void;
}

interface BokehOrb {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

const COMBO_CALLOUTS = ['', '', 'Sweet!', 'Tasty!', 'Delicious!', 'Divine!', 'Unstoppable!'];

export const GameCanvas = React.forwardRef<GameCanvasHandle, GameCanvasProps>(
  (
    {
      level,
      activePreBoosters,
      activeBooster,
      isPaused,
      restartKey,
      onConsumeBooster,
      onCancelBooster,
      onHudUpdate,
      onLevelWin,
      onLevelLose,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const activeBoosterRef = useRef<InGameBoosterType | null>(activeBooster);
    const isPausedRef = useRef<boolean>(isPaused);
    activeBoosterRef.current = activeBooster;
    isPausedRef.current = isPaused;

    // Mutable simulation state stored outside React renders for locked 60fps
    const simRef = useRef<{
      grid: CellData[][];
      movesLeft: number;
      timeLeftSec: number | null;
      lastUrgentTickSec: number;
      hudTimerAccum: number;
      score: number;
      combo: number;
      busy: boolean;
      ended: boolean;
      isSugarCrush: boolean;
      jellyTotal: number;
      cherriesTotal: number;
      hazelnutsTotal: number;
      cherriesCollected: number;
      hazelnutsCollected: number;
      collectTargets: Partial<Record<CandyColor, number>>;
      collectCounts: Partial<Record<CandyColor, number>>;
      scoreTarget: number | null;
      selectedCell: { r: number; c: number } | null;
      dragStart: { r: number; c: number; px: number; py: number } | null;
      hint: MoveHint | null;
      idleTime: number;
      shakeTime: number;
      shakeMag: number;
      particles: Particle[];
      shockwaves: Shockwave[];
      beams: BeamEffect[];
      floatingTexts: FloatingText[];
      bokeh: BokehOrb[];
      statusBanner: string | null;
      layout: { originX: number; originY: number; cellSize: number; width: number; height: number };
      pendingTimeouts: number[];
    } | null>(null);

    const clearAllTimeouts = () => {
      if (!simRef.current) return;
      for (const id of simRef.current.pendingTimeouts) {
        clearTimeout(id);
      }
      simRef.current.pendingTimeouts = [];
    };

    const scheduleTimeout = (fn: () => void, ms: number) => {
      if (!simRef.current) return;
      const id = window.setTimeout(fn, ms);
      simRef.current.pendingTimeouts.push(id);
    };

    useImperativeHandle(ref, () => ({
      addExtraMoves(count: number) {
        const s = simRef.current;
        if (!s) return;
        s.movesLeft += count;
        s.ended = false;
        s.busy = false;
        s.idleTime = 0;
        pushHud();
      },
      addExtraTime(seconds: number) {
        const s = simRef.current;
        if (!s) return;
        s.timeLeftSec = (s.timeLeftSec ?? 0) + seconds;
        s.lastUrgentTickSec = Math.ceil(s.timeLeftSec);
        s.ended = false;
        s.busy = false;
        s.idleTime = 0;
        pushHud();
      },
      triggerSugarShuffle(): boolean {
        const s = simRef.current;
        if (!s || s.busy || s.ended || s.isSugarCrush) return false;
        s.busy = true;
        s.selectedCell = null;
        s.hint = null;
        shuffleBoard(s.grid, level.colorsCount);

        const eligible: Array<{ r: number; c: number }> = [];
        for (let r = 0; r < level.rows; r++) {
          for (let c = 0; c < level.cols; c++) {
            const p = s.grid[r][c].piece;
            if (p && p.kind === 'candy' && p.special === 'none' && !p.locked) {
              eligible.push({ r, c });
            }
          }
        }
        for (let i = 0; i < 2 && eligible.length > 0; i++) {
          const idx = Math.floor(Math.random() * eligible.length);
          const pos = eligible.splice(idx, 1)[0];
          const p = s.grid[pos.r][pos.c].piece;
          if (p) {
            p.special = i === 0 ? 'wrapped' : Math.random() > 0.5 ? 'striped_h' : 'striped_v';
            p.scaleX = 1.45;
            p.scaleY = 1.45;
            spawnShockwave(pos.r, pos.c, '#FDE047', s.layout.cellSize * 1.2, 5);
          }
        }

        audioEngine.playSpecialCreate();
        triggerShake(5, 0.2);
        spawnFloatText(Math.floor(level.rows / 2), Math.floor(level.cols / 2), 'Whirlwind!', '#38BDF8', true);
        scheduleTimeout(() => {
          if (!simRef.current) return;
          simRef.current.busy = false;
          simRef.current.idleTime = 0;
          pushHud();
        }, 320);
        return true;
      },
    }));

    const pushHud = () => {
      const s = simRef.current;
      if (!s) return;
      const jellyRemaining = countRemainingJelly(s.grid);
      const cherriesRemaining = Math.max(0, s.cherriesTotal - s.cherriesCollected);
      const hazelnutsRemaining = Math.max(0, s.hazelnutsTotal - s.hazelnutsCollected);
      const collectRemaining: Partial<Record<CandyColor, number>> = {};
      for (const col of ALL_COLORS) {
        const target = s.collectTargets[col];
        if (target !== undefined) {
          collectRemaining[col] = Math.max(0, target - (s.collectCounts[col] ?? 0));
        }
      }

      onHudUpdate({
        levelId: level.id,
        levelName: level.name,
        zone: level.zone,
        difficulty: level.difficulty,
        movesLeft: s.movesLeft,
        timeLeftSec: s.timeLeftSec !== null ? Math.max(0, Math.ceil(s.timeLeftSec)) : null,
        isTimed: level.timeLimitSec !== undefined,
        score: s.score,
        starScores: level.starScores,
        jellyRemaining,
        jellyTotal: s.jellyTotal,
        cherriesRemaining,
        cherriesTotal: s.cherriesTotal,
        hazelnutsRemaining,
        hazelnutsTotal: s.hazelnutsTotal,
        collectTargets: s.collectTargets,
        collectRemaining,
        scoreTarget: s.scoreTarget,
        comboCount: s.combo,
        isBusy: s.busy,
        isSugarCrush: s.isSugarCrush,
        statusBanner: s.statusBanner,
      });
    };

    // Initialize simulation whenever level or restartKey changes
    useEffect(() => {
      clearAllTimeouts();

      const grid = initializeBoard(level, activePreBoosters);
      const jellyTotal = countRemainingJelly(grid);
      const ingObj = level.objectives.find((o) => o.type === 'ingredients');
      const scoreObj = level.objectives.find((o) => o.type === 'score');
      const collectObj = level.objectives.find((o) => o.type === 'collect');
      const collectTargets =
        collectObj && collectObj.type === 'collect' ? { ...collectObj.targets } : {};

      const extraMoves = activePreBoosters.includes('extra_moves') ? 3 : 0;
      const initialTime =
        level.timeLimitSec !== undefined
          ? level.timeLimitSec + (activePreBoosters.includes('extra_moves') ? 15 : 0)
          : null;

      const bokehColors = [
        'rgba(255, 255, 255, 0.45)',
        'rgba(251, 113, 133, 0.28)',
        'rgba(253, 224, 71, 0.28)',
        'rgba(125, 211, 252, 0.28)',
      ];
      const bokeh: BokehOrb[] = Array.from({ length: 18 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 8 + Math.random() * 24,
        vx: (Math.random() - 0.5) * 0.015,
        vy: -0.01 - Math.random() * 0.02,
        alpha: 0.2 + Math.random() * 0.4,
        color: bokehColors[Math.floor(Math.random() * bokehColors.length)],
      }));

      simRef.current = {
        grid,
        movesLeft: level.moves + extraMoves,
        timeLeftSec: initialTime,
        lastUrgentTickSec: initialTime ?? 999,
        hudTimerAccum: 0,
        score: 0,
        combo: 0,
        busy: false,
        ended: false,
        isSugarCrush: false,
        jellyTotal,
        cherriesTotal: ingObj && ingObj.type === 'ingredients' ? ingObj.cherries : 0,
        hazelnutsTotal: ingObj && ingObj.type === 'ingredients' ? ingObj.hazelnuts : 0,
        cherriesCollected: 0,
        hazelnutsCollected: 0,
        collectTargets,
        collectCounts: {},
        scoreTarget: scoreObj && scoreObj.type === 'score' ? scoreObj.target : null,
        selectedCell: null,
        dragStart: null,
        hint: null,
        idleTime: 0,
        shakeTime: 0,
        shakeMag: 0,
        particles: [],
        shockwaves: [],
        beams: [],
        floatingTexts: [],
        bokeh,
        statusBanner: null,
        layout: { originX: 0, originY: 0, cellSize: 54, width: 500, height: 500 },
        pendingTimeouts: [],
      };

      pushHud();

      return () => {
        clearAllTimeouts();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level.id, level.endlessWave, restartKey]);

    // 60fps Canvas Render & Physics Loop
    useEffect(() => {
      let rafId = 0;
      let lastTime = performance.now();

      const resizeCanvas = () => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const s = simRef.current;
        if (!container || !canvas || !s) return;

        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(280, Math.floor(rect.width));
        const h = Math.max(280, Math.floor(rect.height));

        if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
        }

        const padX = 14;
        const padY = 14;
        const cellSize = Math.floor(
          Math.min((w - padX) / level.cols, (h - padY) / level.rows, 80)
        );
        const boardW = cellSize * level.cols;
        const boardH = cellSize * level.rows;
        const originX = Math.floor((w - boardW) / 2);
        const originY = Math.floor((h - boardH) / 2);

        s.layout = { originX, originY, cellSize, width: w, height: h };
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const tick = (now: number) => {
        const rawDt = (now - lastTime) / 1000;
        const dt = Math.min(rawDt, 0.05);
        lastTime = now;

        const canvas = canvasRef.current;
        const s = simRef.current;
        if (canvas && s) {
          resizeCanvas();
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const { width, height, originX, originY, cellSize } = s.layout;
            const timeSec = now / 1000;

            // Update animations
            if (!isPausedRef.current) {
              updateSimulation(s, dt, level.rows, level.cols);
            }

            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, width, height);

            // Floating ambient bokeh inside board frame
            for (const orb of s.bokeh) {
              ctx.save();
              ctx.globalAlpha = orb.alpha;
              ctx.fillStyle = orb.color;
              ctx.beginPath();
              ctx.arc(orb.x * width, orb.y * height, orb.r, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }

            // Camera shake offset
            if (s.shakeTime > 0) {
              const sx = (Math.random() - 0.5) * s.shakeMag * 2;
              const sy = (Math.random() - 0.5) * s.shakeMag * 2;
              ctx.translate(sx, sy);
            }

            // Board cells, jelly, and exit arrows
            drawBoardBackground(ctx, s.grid, originX, originY, cellSize, level.zone, timeSec);

            // Draw frosting blocks & pieces
            for (let r = 0; r < level.rows; r++) {
              for (let c = 0; c < level.cols; c++) {
                const cell = s.grid[r][c];
                if (!cell.playable) continue;

                if (cell.frosting > 0) {
                  drawFrostingBlock(
                    ctx,
                    originX + c * cellSize,
                    originY + r * cellSize,
                    cellSize,
                    cell.frosting === 2 ? 2 : 1
                  );
                }

                if (cell.piece) {
                  const isSel =
                    s.selectedCell !== null &&
                    s.selectedCell.r === r &&
                    s.selectedCell.c === c;
                  const isHint =
                    s.hint !== null &&
                    ((s.hint.r1 === r && s.hint.c1 === c) ||
                      (s.hint.r2 === r && s.hint.c2 === c));
                  drawPiece(
                    ctx,
                    cell.piece,
                    originX,
                    originY,
                    cellSize,
                    timeSec,
                    isSel,
                    isHint
                  );
                }
              }
            }

            // Particle bursts, shockwaves, lightning beams, floating text
            drawEffects(ctx, s.particles, s.shockwaves, s.beams, s.floatingTexts);

            ctx.restore();
          }
        }

        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resizeCanvas);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level.rows, level.cols, level.zone]);

    const updateSimulation = (
      s: NonNullable<typeof simRef.current>,
      dt: number,
      rows: number,
      cols: number
    ) => {
      // Bokeh drift
      for (const orb of s.bokeh) {
        orb.x += orb.vx * dt;
        orb.y += orb.vy * dt;
        if (orb.y < -0.1) orb.y = 1.1;
        if (orb.x < -0.1) orb.x = 1.1;
        if (orb.x > 1.1) orb.x = -0.1;
      }

      // Camera shake decay
      if (s.shakeTime > 0) {
        s.shakeTime = Math.max(0, s.shakeTime - dt);
        s.shakeMag *= Math.pow(0.05, dt);
      }

      // Timed level countdown clock
      if (s.timeLeftSec !== null && !s.ended && !s.isSugarCrush) {
        s.timeLeftSec = Math.max(0, s.timeLeftSec - dt);
        s.hudTimerAccum += dt;
        const ceilSec = Math.ceil(s.timeLeftSec);
        if (ceilSec !== s.lastUrgentTickSec) {
          s.lastUrgentTickSec = ceilSec;
          if (ceilSec > 0 && ceilSec <= 8) {
            audioEngine.playTickUrgent();
          }
          pushHud();
          s.hudTimerAccum = 0;
        } else if (s.hudTimerAccum >= 0.4) {
          s.hudTimerAccum = 0;
        }

        if (s.timeLeftSec <= 0 && !s.busy) {
          if (areAllObjectivesMet()) {
            runSugarCrush();
          } else {
            s.ended = true;
            audioEngine.playLose();
            pushHud();
            onLevelLose(s.score);
          }
          return;
        }
      }

      // 4-second Smart Hint timer
      if (!s.busy && !s.ended && !activeBoosterRef.current) {
        s.idleTime += dt;
        if (s.idleTime >= 4.0 && !s.hint) {
          const valid = findValidMoves(s.grid);
          if (valid.length > 0) {
            s.hint = valid[0];
          }
        }
      } else {
        s.idleTime = 0;
        s.hint = null;
      }

      // Smooth spring/lerp interpolation for all board pieces
      const posSpeed = 1 - Math.pow(0.00015, dt);
      const scaleSpeed = 1 - Math.pow(0.0008, dt);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const piece = s.grid[r][c].piece;
          if (!piece) continue;

          const dx = c - piece.x;
          const dy = r - piece.y;
          const prevDy = dy;

          piece.x += dx * posSpeed;
          piece.y += dy * posSpeed;

          if (Math.abs(dx) < 0.005) piece.x = c;
          if (Math.abs(dy) < 0.005) {
            if (Math.abs(prevDy) > 0.08) {
              // Squash on landing!
              piece.scaleX = 1.18;
              piece.scaleY = 0.84;
            }
            piece.y = r;
          } else if (Math.abs(dy) > 0.35) {
            // Subtle vertical stretch while falling
            piece.scaleX = 0.92;
            piece.scaleY = 1.09;
          }

          piece.scaleX += (1 - piece.scaleX) * scaleSpeed;
          piece.scaleY += (1 - piece.scaleY) * scaleSpeed;
          piece.rotation += (0 - piece.rotation) * scaleSpeed;
        }
      }

      // Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          s.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
        p.rotation += p.vRot * dt;
      }

      // Shockwaves
      for (let i = s.shockwaves.length - 1; i >= 0; i--) {
        const sw = s.shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * Math.min(1, dt * 11);
        sw.alpha -= dt * 2.6;
        if (sw.alpha <= 0.02) s.shockwaves.splice(i, 1);
      }

      // Beams
      for (let i = s.beams.length - 1; i >= 0; i--) {
        s.beams[i].life -= dt;
        if (s.beams[i].life <= 0) s.beams.splice(i, 1);
      }

      // Floating texts
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.life -= dt;
        ft.y += ft.vy * dt;
        if (ft.life <= 0) s.floatingTexts.splice(i, 1);
      }
    };

    // ==================== VFX HELPERS ====================
    const cellCenter = (r: number, c: number) => {
      const s = simRef.current!;
      return {
        x: s.layout.originX + (c + 0.5) * s.layout.cellSize,
        y: s.layout.originY + (r + 0.5) * s.layout.cellSize,
      };
    };

    const spawnBurst = (r: number, c: number, colorHex: string, count = 12, speed = 220) => {
      const s = simRef.current;
      if (!s) return;
      const { x, y } = cellCenter(r, c);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = speed * (0.35 + Math.random() * 0.85);
        const shapes: Particle['shape'][] = ['circle', 'star', 'shard'];
        s.particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 45,
          size: 3 + Math.random() * 4.5,
          color: i % 3 === 0 ? '#FFFFFF' : colorHex,
          alpha: 1,
          life: 0.42 + Math.random() * 0.35,
          maxLife: 0.77,
          gravity: 480,
          shape: shapes[i % shapes.length],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 10,
        });
      }
    };

    const spawnShockwave = (r: number, c: number, color: string, maxRadius: number, lineWidth = 5) => {
      const s = simRef.current;
      if (!s) return;
      const { x, y } = cellCenter(r, c);
      s.shockwaves.push({ x, y, radius: 8, maxRadius, color, alpha: 0.92, lineWidth });
    };

    const spawnFloatText = (r: number, c: number, text: string, color = '#FFFFFF', isBanner = false) => {
      const s = simRef.current;
      if (!s) return;
      const { x, y } = cellCenter(r, c);
      s.floatingTexts.push({
        x,
        y,
        vy: isBanner ? -26 : -44,
        text,
        color,
        scale: 1,
        life: isBanner ? 1.25 : 0.82,
        maxLife: isBanner ? 1.25 : 0.82,
        isBanner,
      });
    };

    const triggerShake = (mag: number, duration = 0.22) => {
      const s = simRef.current;
      if (!s) return;
      s.shakeMag = Math.max(s.shakeMag, mag);
      s.shakeTime = Math.max(s.shakeTime, duration);
    };

    // ==================== CORE MATCH & DETONATION ENGINE ====================
    const addScore = (pts: number, r?: number, c?: number, showPopup = false) => {
      const s = simRef.current;
      if (!s) return;
      const mult = 1 + Math.max(0, s.combo - 1) * 0.25;
      const gained = Math.round(pts * mult);
      s.score += gained;
      if (showPopup && r !== undefined && c !== undefined) {
        spawnFloatText(r, c, `+${gained}`, '#FEF08A');
      }
    };

    const damageFrosting = (r: number, c: number) => {
      const s = simRef.current;
      if (!s) return;
      const cell = s.grid[r]?.[c];
      if (!cell || cell.frosting <= 0) return;
      cell.frosting = (cell.frosting - 1) as 0 | 1 | 2;
      audioEngine.playBlockerHit();
      spawnBurst(r, c, '#F8FAFC', 10, 170);
      addScore(80, r, c, false);
    };

    const damageAdjacentFrosting = (cells: Array<{ r: number; c: number }>) => {
      const s = simRef.current;
      if (!s) return;
      const damaged = new Set<string>();
      const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const { r, c } of cells) {
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          const key = `${nr},${nc}`;
          if (!damaged.has(key) && s.grid[nr]?.[nc]?.frosting > 0) {
            damaged.add(key);
            damageFrosting(nr, nc);
          }
        }
      }
    };

    // BFS blast expansion handles chained specials cleanly
    const executeBlastQueue = (
      initialTargets: Array<{ r: number; c: number; forceClearLocked?: boolean }>,
      spawnSpecials: Array<{ r: number; c: number; color: CandyColor; special: SpecialType }> = [],
      onComplete?: () => void
    ) => {
      const s = simRef.current;
      if (!s) return;

      const visited = new Set<string>();
      const queue = [...initialTargets];
      const secondStageWrapped: Array<{ r: number; c: number }> = [];
      let clearedCount = 0;

      while (queue.length > 0) {
        const target = queue.shift()!;
        const { r, c } = target;
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        const cell = s.grid[r]?.[c];
        if (!cell || !cell.playable) continue;
        visited.add(key);

        if (cell.frosting > 0) {
          damageFrosting(r, c);
          continue;
        }

        const piece = cell.piece;
        if (!piece) continue;

        if (piece.kind === 'ingredient') {
          // Ingredients are indestructible!
          continue;
        }

        // If licorice locked, breaking the lock consumes the hit cleanly
        if (piece.locked) {
          piece.locked = false;
          audioEngine.playBlockerHit();
          spawnBurst(r, c, '#44403C', 10, 180);
          addScore(100, r, c, true);
          continue;
        }

        // Handle special triggers
        if (piece.special === 'striped_h') {
          audioEngine.playStripeBlast();
          triggerShake(5, 0.18);
          const pLeft = cellCenter(r, 0);
          const pRight = cellCenter(r, level.cols - 1);
          s.beams.push({
            x1: pLeft.x - 16,
            y1: pLeft.y,
            x2: pRight.x + 16,
            y2: pRight.y,
            color: CANDY_PALETTES[piece.color].light,
            life: 0.28,
            maxLife: 0.28,
            width: 16,
          });
          for (let cc = 0; cc < level.cols; cc++) {
            queue.push({ r, c: cc, forceClearLocked: true });
          }
        } else if (piece.special === 'striped_v') {
          audioEngine.playStripeBlast();
          triggerShake(5, 0.18);
          const pTop = cellCenter(0, c);
          const pBot = cellCenter(level.rows - 1, c);
          s.beams.push({
            x1: pTop.x,
            y1: pTop.y - 16,
            x2: pBot.x,
            y2: pBot.y + 16,
            color: CANDY_PALETTES[piece.color].light,
            life: 0.28,
            maxLife: 0.28,
            width: 16,
          });
          for (let rr = 0; rr < level.rows; rr++) {
            queue.push({ r: rr, c, forceClearLocked: true });
          }
        } else if (piece.special === 'wrapped') {
          audioEngine.playWrappedBoom();
          triggerShake(8, 0.25);
          spawnShockwave(r, c, CANDY_PALETTES[piece.color].light, s.layout.cellSize * 2.2, 7);
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              queue.push({ r: r + dr, c: c + dc, forceClearLocked: true });
            }
          }
          if (!piece.wrappedStage) {
            secondStageWrapped.push({ r, c });
          }
        } else if (piece.special === 'color_bomb') {
          audioEngine.playColorBombZap();
          triggerShake(9, 0.28);
          const targetColor = getDominantColor(s.grid);
          const originCenter = cellCenter(r, c);
          for (let rr = 0; rr < level.rows; rr++) {
            for (let cc = 0; cc < level.cols; cc++) {
              const p2 = s.grid[rr][cc].piece;
              if (p2 && p2.kind === 'candy' && p2.color === targetColor) {
                const destCenter = cellCenter(rr, cc);
                s.beams.push({
                  x1: originCenter.x,
                  y1: originCenter.y,
                  x2: destCenter.x,
                  y2: destCenter.y,
                  color: CANDY_PALETTES[targetColor].light,
                  life: 0.34,
                  maxLife: 0.34,
                  width: 8,
                });
                queue.push({ r: rr, c: cc });
              }
            }
          }
        }

        // Clear jelly under cleared candy
        if (cell.jelly > 0) {
          cell.jelly = (cell.jelly - 1) as 0 | 1 | 2;
          spawnBurst(r, c, '#FB7185', 8, 160);
          addScore(150);
        }

        // Track candy color collection objective
        if (piece.special !== 'color_bomb') {
          s.collectCounts[piece.color] = (s.collectCounts[piece.color] ?? 0) + 1;
        }

        const pal = CANDY_PALETTES[piece.color];
        spawnBurst(r, c, pal.light, 9, 200);
        spawnBurst(r, c, '#FEF08A', 5, 250);
        cell.piece = null;
        clearedCount++;
        addScore(60, r, c, clearedCount % 3 === 1);
      }

      // Spawn any newly created specials from 4/5/L/T matches
      for (const sp of spawnSpecials) {
        const cell = s.grid[sp.r]?.[sp.c];
        if (cell && cell.playable && !cell.piece) {
          const newP = createPiece(sp.r, sp.c, sp.color, sp.special, false, sp.r);
          newP.scaleX = 1.45;
          newP.scaleY = 1.45;
          cell.piece = newP;
          audioEngine.playSpecialCreate();
          spawnShockwave(sp.r, sp.c, '#FFFFFF', s.layout.cellSize * 1.1, 4);
        }
      }

      // If any Wrapped Candy triggered its first stage, arm a glowing second-stage detonation after drop
      for (const wp of secondStageWrapped) {
        const cell = s.grid[wp.r]?.[wp.c];
        if (cell && cell.playable && !cell.piece) {
          const armed = createPiece(wp.r, wp.c, randomColor(level.colorsCount), 'wrapped', false, wp.r);
          armed.wrappedStage = 1;
          armed.scaleX = 1.25;
          armed.scaleY = 1.25;
          cell.piece = armed;
        }
      }

      scheduleTimeout(() => {
        if (secondStageWrapped.length > 0) {
          // Detonate stage-2 wrapped candies immediately before gravity settles
          const stage2Targets: Array<{ r: number; c: number }> = [];
          for (const wp of secondStageWrapped) {
            const p = s.grid[wp.r]?.[wp.c]?.piece;
            if (p && p.special === 'wrapped' && p.wrappedStage === 1) {
              stage2Targets.push({ r: wp.r, c: wp.c });
            }
          }
          if (stage2Targets.length > 0) {
            executeBlastQueue(stage2Targets, [], onComplete);
            return;
          }
        }
        onComplete?.();
      }, 200);
    };

    const collectIngredientsAtExits = (): boolean => {
      const s = simRef.current;
      if (!s) return false;
      let collectedAny = false;

      for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
          const cell = s.grid[r][c];
          if (cell.isIngredientExit && cell.piece && cell.piece.kind === 'ingredient') {
            const type = cell.piece.ingredientType;
            if (type === 'cherry') s.cherriesCollected++;
            else s.hazelnutsCollected++;
            audioEngine.playIngredientDrop();
            spawnBurst(r, c, '#34D399', 18, 260);
            spawnShockwave(r, c, '#10B981', s.layout.cellSize * 1.4, 5);
            addScore(500, r, c, true);
            spawnFloatText(r, c, 'Collected!', '#34D399', false);
            cell.piece = null;
            collectedAny = true;
          }
        }
      }
      return collectedAny;
    };

    const applyGravityAndRefill = (): boolean => {
      const s = simRef.current;
      if (!s) return false;
      let moved = false;

      // 1. Straight vertical fall per column
      for (let c = 0; c < level.cols; c++) {
        let writeRow = level.rows - 1;
        while (writeRow >= 0) {
          const destCell = s.grid[writeRow][c];
          if (!destCell.playable || destCell.frosting > 0) {
            writeRow--;
            continue;
          }
          if (destCell.piece !== null) {
            writeRow--;
            continue;
          }

          // Search upward for a piece (stop if blocked by non-playable hole, frosting, or locked piece)
          let readRow = writeRow - 1;
          let foundPiece: BoardPiece | null = null;
          while (readRow >= 0) {
            const srcCell = s.grid[readRow][c];
            if (!srcCell.playable || srcCell.frosting > 0) break;
            if (srcCell.piece) {
              if (srcCell.piece.locked) break; // Locked candies block pieces above
              foundPiece = srcCell.piece;
              srcCell.piece = null;
              break;
            }
            readRow--;
          }

          if (foundPiece) {
            destCell.piece = foundPiece;
            moved = true;
          }
          writeRow--;
        }
      }

      // 2. Diagonal slide around frosting/cutout holes
      for (let r = level.rows - 1; r >= 1; r--) {
        for (let c = 0; c < level.cols; c++) {
          const dest = s.grid[r][c];
          if (!dest.playable || dest.frosting > 0 || dest.piece !== null) continue;

          // Only slide diagonally if straight above is blocked by hole/frosting/lock
          const above = s.grid[r - 1][c];
          const straightBlocked = !above.playable || above.frosting > 0 || above.piece?.locked;
          if (!straightBlocked) continue;

          const diagCols = Math.random() > 0.5 ? [c - 1, c + 1] : [c + 1, c - 1];
          for (const dc of diagCols) {
            if (dc < 0 || dc >= level.cols) continue;
            const diagCell = s.grid[r - 1][dc];
            if (diagCell.playable && diagCell.frosting === 0 && diagCell.piece && !diagCell.piece.locked) {
              dest.piece = diagCell.piece;
              diagCell.piece = null;
              moved = true;
              break;
            }
          }
        }
      }

      // 3. Refill empty top-of-column / top-of-segment dispenser cells
      for (let c = 0; c < level.cols; c++) {
        let spawnOffset = 1;
        for (let r = level.rows - 1; r >= 0; r--) {
          const cell = s.grid[r][c];
          if (!cell.playable || cell.frosting > 0 || cell.piece !== null) continue;
          // Check if unobstructed to top or below a cutout/frosting dispenser
          let hasDispenserAbove = true;
          for (let rr = r - 1; rr >= 0; rr--) {
            if (s.grid[rr][c].piece?.locked) {
              hasDispenserAbove = false;
              break;
            }
          }
          if (hasDispenserAbove) {
            const newColor = randomColor(level.colorsCount);
            cell.piece = createPiece(r, c, newColor, 'none', false, -spawnOffset - 0.5);
            spawnOffset++;
            moved = true;
          }
        }
      }

      return moved;
    };

    const areAllObjectivesMet = (): boolean => {
      const s = simRef.current;
      if (!s) return false;
      const jellyRem = countRemainingJelly(s.grid);
      const cherriesRem = Math.max(0, s.cherriesTotal - s.cherriesCollected);
      const hazelnutsRem = Math.max(0, s.hazelnutsTotal - s.hazelnutsCollected);
      const scoreOk = s.scoreTarget === null || s.score >= s.scoreTarget;
      let collectOk = true;
      for (const col of ALL_COLORS) {
        const target = s.collectTargets[col];
        if (target !== undefined && (s.collectCounts[col] ?? 0) < target) {
          collectOk = false;
          break;
        }
      }
      return jellyRem === 0 && cherriesRem === 0 && hazelnutsRem === 0 && scoreOk && collectOk;
    };

    const computeStars = (score: number): number => {
      const [s1, s2, s3] = level.starScores;
      if (score >= s3) return 3;
      if (score >= s2) return 2;
      if (score >= s1) return 1;
      return 1; // Completing objectives always awards at least 1 star
    };

    const runSugarCrush = () => {
      const s = simRef.current;
      if (!s || s.ended) return;
      s.isSugarCrush = true;
      s.busy = true;
      s.statusBanner = 'Sugar Crush!';
      spawnFloatText(Math.floor(level.rows / 2), Math.floor(level.cols / 2), 'Sugar Crush!', '#FDE047', true);
      audioEngine.playSpecialCreate();
      pushHud();

      const stepSugarCrush = () => {
        if (!simRef.current) return;
        const cur = simRef.current;
        const isTimed = level.timeLimitSec !== undefined;
        const crushCounter = isTimed
          ? Math.min(8, Math.floor((cur.timeLeftSec ?? 0) / 5))
          : cur.movesLeft;

        if (crushCounter <= 0) {
          // Detonate any remaining specials on the board!
          const remSpecials: Array<{ r: number; c: number }> = [];
          for (let r = 0; r < level.rows; r++) {
            for (let c = 0; c < level.cols; c++) {
              const p = cur.grid[r][c].piece;
              if (p && p.kind === 'candy' && p.special !== 'none') {
                remSpecials.push({ r, c });
              }
            }
          }
          if (remSpecials.length > 0) {
            executeBlastQueue(remSpecials, [], () => {
              applyGravityAndRefill();
              pushHud();
              scheduleTimeout(() => {
                cur.ended = true;
                cur.isSugarCrush = false;
                cur.statusBanner = null;
                audioEngine.playWin();
                onLevelWin(cur.score, computeStars(cur.score));
              }, 380);
            });
          } else {
            cur.ended = true;
            cur.isSugarCrush = false;
            cur.statusBanner = null;
            audioEngine.playWin();
            onLevelWin(cur.score, computeStars(cur.score));
          }
          return;
        }

        if (isTimed && cur.timeLeftSec !== null) {
          cur.timeLeftSec = Math.max(0, cur.timeLeftSec - 5);
        } else {
          cur.movesLeft--;
        }
        // Pick random normal candy and turn it into Striped or Wrapped
        const candidates: Array<{ r: number; c: number }> = [];
        for (let r = 0; r < level.rows; r++) {
          for (let c = 0; c < level.cols; c++) {
            const p = cur.grid[r][c].piece;
            if (p && p.kind === 'candy' && p.special === 'none' && !p.locked) {
              candidates.push({ r, c });
            }
          }
        }
        if (candidates.length > 0) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          const p = cur.grid[pick.r][pick.c].piece!;
          const specials: SpecialType[] = ['striped_h', 'striped_v', 'wrapped'];
          p.special = specials[Math.floor(Math.random() * specials.length)];
          p.scaleX = 1.4;
          p.scaleY = 1.4;
          audioEngine.playMatch(3);
          spawnShockwave(pick.r, pick.c, '#FDE047', cur.layout.cellSize * 1.1, 4);
          addScore(350, pick.r, pick.c, true);
        } else {
          addScore(350);
        }
        pushHud();
        scheduleTimeout(stepSugarCrush, 130);
      };

      scheduleTimeout(stepSugarCrush, 550);
    };

    const runCascadeLoop = (
      preferredSwap?: { r1: number; c1: number; r2: number; c2: number }
    ) => {
      const s = simRef.current;
      if (!s) return;

      collectIngredientsAtExits();
      applyGravityAndRefill();
      collectIngredientsAtExits();
      pushHud();

      scheduleTimeout(() => {
        const cur = simRef.current;
        if (!cur) return;

        const matches = findMatches(cur.grid, preferredSwap);
        if (matches.length > 0) {
          cur.combo++;
          audioEngine.playMatch(cur.combo);

          if (cur.combo >= 2) {
            const callout = COMBO_CALLOUTS[Math.min(COMBO_CALLOUTS.length - 1, cur.combo)];
            const midCell = matches[0].cells[0];
            spawnFloatText(midCell.r, midCell.c, callout, '#FDE047', true);
          }

          if (matches.some((m) => m.cells.length >= 4)) {
            triggerShake(4.5, 0.16);
          }

          const allMatchedCells: Array<{ r: number; c: number }> = [];
          const spawnSpecials: Array<{ r: number; c: number; color: CandyColor; special: SpecialType }> = [];

          for (const g of matches) {
            for (const cell of g.cells) {
              allMatchedCells.push(cell);
            }
            if (g.spawnSpecial !== 'none') {
              spawnSpecials.push({
                r: g.spawnAt.r,
                c: g.spawnAt.c,
                color: g.color,
                special: g.spawnSpecial,
              });
            }
          }

          damageAdjacentFrosting(allMatchedCells);

          executeBlastQueue(allMatchedCells, spawnSpecials, () => {
            runCascadeLoop();
          });
          return;
        }

        // Check if any ingredients fell onto exits and left empty spaces needing another drop
        if (collectIngredientsAtExits()) {
          applyGravityAndRefill();
          scheduleTimeout(() => runCascadeLoop(), 220);
          return;
        }

        // Board has settled!
        cur.combo = 0;

        if (areAllObjectivesMet()) {
          runSugarCrush();
          return;
        }

        if ((cur.timeLeftSec !== null && cur.timeLeftSec <= 0) || (cur.timeLeftSec === null && cur.movesLeft <= 0)) {
          cur.busy = false;
          cur.ended = true;
          audioEngine.playLose();
          pushHud();
          onLevelLose(cur.score);
          return;
        }

        // Ensure valid moves exist; auto-shuffle if deadlocked
        if (findValidMoves(cur.grid).length === 0) {
          cur.statusBanner = 'No moves — Shuffling!';
          pushHud();
          shuffleBoard(cur.grid, level.colorsCount);
          scheduleTimeout(() => {
            if (!simRef.current) return;
            simRef.current.statusBanner = null;
            simRef.current.busy = false;
            pushHud();
          }, 700);
          return;
        }

        cur.busy = false;
        cur.idleTime = 0;
        pushHud();
      }, 240);
    };

    const handleSpecialComboSwap = (
      r1: number,
      c1: number,
      r2: number,
      c2: number,
      p1: BoardPiece,
      p2: BoardPiece
    ): boolean => {
      const s = simRef.current;
      if (!s) return false;

      // 1. Color Bomb + Color Bomb -> Full Board Wipe!
      if (p1.special === 'color_bomb' && p2.special === 'color_bomb') {
        audioEngine.playColorBombZap();
        triggerShake(12, 0.4);
        spawnFloatText(r2, c2, 'Royal Supernova!', '#FDE047', true);
        const all: Array<{ r: number; c: number }> = [];
        for (let r = 0; r < level.rows; r++) {
          for (let c = 0; c < level.cols; c++) {
            all.push({ r, c });
          }
        }
        executeBlastQueue(all, [], () => runCascadeLoop());
        return true;
      }

      // 2. Color Bomb + Candy (normal or striped/wrapped)
      if (p1.special === 'color_bomb' || p2.special === 'color_bomb') {
        const bombPos = p1.special === 'color_bomb' ? { r: r2, c: c2 } : { r: r1, c: c1 };
        const other = p1.special === 'color_bomb' ? p2 : p1;
        const targetColor = other.color;
        const specialToConvert = other.special !== 'none' ? other.special : null;

        audioEngine.playColorBombZap();
        triggerShake(9, 0.3);

        const originCenter = cellCenter(bombPos.r, bombPos.c);
        const targets: Array<{ r: number; c: number }> = [bombPos];

        for (let r = 0; r < level.rows; r++) {
          for (let c = 0; c < level.cols; c++) {
            const cp = s.grid[r][c].piece;
            if (cp && cp.kind === 'candy' && cp.color === targetColor) {
              const destCenter = cellCenter(r, c);
              s.beams.push({
                x1: originCenter.x,
                y1: originCenter.y,
                x2: destCenter.x,
                y2: destCenter.y,
                color: CANDY_PALETTES[targetColor].light,
                life: 0.36,
                maxLife: 0.36,
                width: 9,
              });
              if (specialToConvert) {
                cp.special =
                  specialToConvert === 'wrapped'
                    ? 'wrapped'
                    : (r + c) % 2 === 0
                      ? 'striped_h'
                      : 'striped_v';
              }
              targets.push({ r, c });
            }
          }
        }

        if (specialToConvert) {
          spawnFloatText(bombPos.r, bombPos.c, 'Mega Combo!', '#FDE047', true);
        }

        scheduleTimeout(() => {
          executeBlastQueue(targets, [], () => runCascadeLoop());
        }, specialToConvert ? 260 : 120);
        return true;
      }

      // 3. Striped + Striped -> Row & Column Cross!
      if (
        (p1.special === 'striped_h' || p1.special === 'striped_v') &&
        (p2.special === 'striped_h' || p2.special === 'striped_v')
      ) {
        p1.special = 'none';
        p2.special = 'none';
        audioEngine.playStripeBlast();
        triggerShake(7, 0.25);

        const pLeft = cellCenter(r2, 0);
        const pRight = cellCenter(r2, level.cols - 1);
        const pTop = cellCenter(0, c2);
        const pBot = cellCenter(level.rows - 1, c2);
        s.beams.push(
          { x1: pLeft.x, y1: pLeft.y, x2: pRight.x, y2: pRight.y, color: '#FFFFFF', life: 0.3, maxLife: 0.3, width: 18 },
          { x1: pTop.x, y1: pTop.y, x2: pBot.x, y2: pBot.y, color: '#FFFFFF', life: 0.3, maxLife: 0.3, width: 18 }
        );

        const targets: Array<{ r: number; c: number }> = [];
        for (let cc = 0; cc < level.cols; cc++) targets.push({ r: r2, c: cc });
        for (let rr = 0; rr < level.rows; rr++) targets.push({ r: rr, c: c2 });
        executeBlastQueue(targets, [], () => runCascadeLoop());
        return true;
      }

      // 4. Striped + Wrapped -> Giant 3-Row and 3-Column Mega-Blast!
      if (
        ((p1.special === 'striped_h' || p1.special === 'striped_v') && p2.special === 'wrapped') ||
        ((p2.special === 'striped_h' || p2.special === 'striped_v') && p1.special === 'wrapped')
      ) {
        p1.special = 'none';
        p2.special = 'none';
        audioEngine.playWrappedBoom();
        audioEngine.playStripeBlast();
        triggerShake(11, 0.34);
        spawnFloatText(r2, c2, 'Super Blast!', '#FDE047', true);

        const targets: Array<{ r: number; c: number }> = [];
        for (let dr = -1; dr <= 1; dr++) {
          const rr = r2 + dr;
          if (rr >= 0 && rr < level.rows) {
            const l = cellCenter(rr, 0);
            const ri = cellCenter(rr, level.cols - 1);
            s.beams.push({ x1: l.x, y1: l.y, x2: ri.x, y2: ri.y, color: '#FDE047', life: 0.35, maxLife: 0.35, width: 20 });
            for (let cc = 0; cc < level.cols; cc++) targets.push({ r: rr, c: cc });
          }
        }
        for (let dc = -1; dc <= 1; dc++) {
          const cc = c2 + dc;
          if (cc >= 0 && cc < level.cols) {
            const t = cellCenter(0, cc);
            const b = cellCenter(level.rows - 1, cc);
            s.beams.push({ x1: t.x, y1: t.y, x2: b.x, y2: b.y, color: '#FDE047', life: 0.35, maxLife: 0.35, width: 20 });
            for (let rr = 0; rr < level.rows; rr++) targets.push({ r: rr, c: cc });
          }
        }
        executeBlastQueue(targets, [], () => runCascadeLoop());
        return true;
      }

      // 5. Wrapped + Wrapped -> Giant 5x5 Explosion!
      if (p1.special === 'wrapped' && p2.special === 'wrapped') {
        p1.special = 'none';
        p2.special = 'none';
        audioEngine.playWrappedBoom();
        triggerShake(12, 0.36);
        spawnShockwave(r2, c2, '#FDE047', s.layout.cellSize * 3.2, 9);
        spawnFloatText(r2, c2, 'Mega Boom!', '#FB7185', true);

        const targets: Array<{ r: number; c: number }> = [];
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            targets.push({ r: r2 + dr, c: c2 + dc });
          }
        }
        executeBlastQueue(targets, [], () => runCascadeLoop());
        return true;
      }

      return false;
    };

    const attemptSwap = (r1: number, c1: number, r2: number, c2: number) => {
      const s = simRef.current;
      if (!s || s.busy || s.ended || isPausedRef.current) return;

      const cell1 = s.grid[r1]?.[c1];
      const cell2 = s.grid[r2]?.[c2];
      if (!cell1 || !cell2 || !cell1.playable || !cell2.playable) return;
      if (cell1.frosting > 0 || cell2.frosting > 0) return;
      const p1 = cell1.piece;
      const p2 = cell2.piece;
      if (!p1 || !p2 || p1.locked || p2.locked) {
        audioEngine.playInvalidSwap();
        return;
      }

      s.selectedCell = null;
      s.hint = null;
      s.idleTime = 0;
      s.busy = true;

      // Perform swap
      cell1.piece = p2;
      cell2.piece = p1;
      audioEngine.playSwap();

      const isFreeSwitch = activeBoosterRef.current === 'free_switch';

      scheduleTimeout(() => {
        if (!simRef.current) return;
        const cur = simRef.current;

        // Check special combos first
        if (handleSpecialComboSwap(r1, c1, r2, c2, p1, p2)) {
          if (isFreeSwitch) {
            onConsumeBooster('free_switch');
          } else {
            cur.movesLeft = Math.max(0, cur.movesLeft - 1);
          }
          cur.combo = 1;
          pushHud();
          return;
        }

        const matches = findMatches(cur.grid, { r1, c1, r2, c2 });
        if (matches.length > 0) {
          if (isFreeSwitch) {
            onConsumeBooster('free_switch');
          } else {
            cur.movesLeft = Math.max(0, cur.movesLeft - 1);
          }
          cur.combo = 1;
          audioEngine.playMatch(1);
          pushHud();

          const allMatchedCells: Array<{ r: number; c: number }> = [];
          const spawnSpecials: Array<{ r: number; c: number; color: CandyColor; special: SpecialType }> = [];
          for (const g of matches) {
            for (const cell of g.cells) allMatchedCells.push(cell);
            if (g.spawnSpecial !== 'none') {
              spawnSpecials.push({
                r: g.spawnAt.r,
                c: g.spawnAt.c,
                color: g.color,
                special: g.spawnSpecial,
              });
            }
          }
          if (matches.some((m) => m.cells.length >= 4)) triggerShake(4.5, 0.16);
          damageAdjacentFrosting(allMatchedCells);

          executeBlastQueue(allMatchedCells, spawnSpecials, () => {
            runCascadeLoop({ r1, c1, r2, c2 });
          });
        } else if (isFreeSwitch) {
          // Free Switch allows ANY swap without reverting!
          onConsumeBooster('free_switch');
          cur.busy = false;
          pushHud();
        } else {
          // Invalid swap -> rubber-band bounce back!
          audioEngine.playInvalidSwap();
          cell1.piece = p1;
          cell2.piece = p2;
          p1.scaleX = 0.88;
          p1.scaleY = 1.12;
          p2.scaleX = 0.88;
          p2.scaleY = 1.12;
          scheduleTimeout(() => {
            if (!simRef.current) return;
            simRef.current.busy = false;
          }, 180);
        }
      }, 170);
    };

    const handleBoosterCellClick = (r: number, c: number) => {
      const s = simRef.current;
      const booster = activeBoosterRef.current;
      if (!s || !booster || s.busy || s.ended) return false;
      const cell = s.grid[r]?.[c];
      if (!cell || !cell.playable) return false;

      if (booster === 'hammer') {
        if (cell.frosting === 0 && !cell.piece && cell.jelly === 0) return false;
        s.busy = true;
        onConsumeBooster('hammer');
        audioEngine.playWrappedBoom();
        triggerShake(6, 0.2);
        spawnShockwave(r, c, '#FB7185', s.layout.cellSize * 1.3, 5);
        executeBlastQueue([{ r, c, forceClearLocked: true }], [], () => runCascadeLoop());
        return true;
      }

      if (booster === 'color_bomb') {
        if (cell.frosting > 0 || !cell.piece || cell.piece.kind !== 'candy') return false;
        cell.piece.special = 'color_bomb';
        cell.piece.locked = false;
        cell.piece.scaleX = 1.45;
        cell.piece.scaleY = 1.45;
        audioEngine.playSpecialCreate();
        spawnShockwave(r, c, '#FDE047', s.layout.cellSize * 1.2, 5);
        onConsumeBooster('color_bomb');
        return true;
      }

      if (booster === 'cross_wand') {
        s.busy = true;
        onConsumeBooster('cross_wand');
        audioEngine.playStripeBlast();
        audioEngine.playWrappedBoom();
        triggerShake(8, 0.28);

        const pLeft = cellCenter(r, 0);
        const pRight = cellCenter(r, level.cols - 1);
        const pTop = cellCenter(0, c);
        const pBot = cellCenter(level.rows - 1, c);
        s.beams.push(
          { x1: pLeft.x - 16, y1: pLeft.y, x2: pRight.x + 16, y2: pRight.y, color: '#FACC15', life: 0.34, maxLife: 0.34, width: 18 },
          { x1: pTop.x, y1: pTop.y - 16, x2: pBot.x, y2: pBot.y + 16, color: '#38BDF8', life: 0.34, maxLife: 0.34, width: 18 }
        );
        spawnShockwave(r, c, '#FACC15', s.layout.cellSize * 1.8, 6);

        const targets: Array<{ r: number; c: number; forceClearLocked?: boolean }> = [];
        for (let cc = 0; cc < level.cols; cc++) targets.push({ r, c: cc, forceClearLocked: true });
        for (let rr = 0; rr < level.rows; rr++) targets.push({ r: rr, c, forceClearLocked: true });
        executeBlastQueue(targets, [], () => runCascadeLoop());
        return true;
      }

      if (booster === 'sugar_shuffle') {
        s.busy = true;
        onConsumeBooster('sugar_shuffle');
        shuffleBoard(s.grid, level.colorsCount);
        audioEngine.playSpecialCreate();
        triggerShake(5, 0.2);
        spawnFloatText(r, c, 'Whirlwind!', '#38BDF8', true);
        scheduleTimeout(() => {
          if (!simRef.current) return;
          simRef.current.busy = false;
          simRef.current.idleTime = 0;
          pushHud();
        }, 300);
        return true;
      }

      return false;
    };

    // ==================== POINTER INPUT (TAP + DRAG) ====================
    const coordsFromPointer = (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const s = simRef.current;
      if (!canvas || !s) return null;
      const rect = canvas.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const c = Math.floor((px - s.layout.originX) / s.layout.cellSize);
      const r = Math.floor((py - s.layout.originY) / s.layout.cellSize);
      if (r < 0 || r >= level.rows || c < 0 || c >= level.cols) return null;
      return { r, c, px, py };
    };

    const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      audioEngine.unlock();
      const s = simRef.current;
      if (!s || s.busy || s.ended || isPausedRef.current) return;

      const hit = coordsFromPointer(e.clientX, e.clientY);
      if (!hit) {
        s.selectedCell = null;
        if (activeBoosterRef.current) onCancelBooster();
        return;
      }

      const { r, c, px, py } = hit;

      // Single-target boosters (Hammer / Color Bomb / Cross Wand / Sugar Shuffle)
      if (
        activeBoosterRef.current === 'hammer' ||
        activeBoosterRef.current === 'color_bomb' ||
        activeBoosterRef.current === 'cross_wand' ||
        activeBoosterRef.current === 'sugar_shuffle'
      ) {
        handleBoosterCellClick(r, c);
        return;
      }

      const cell = s.grid[r][c];
      if (!cell.playable || cell.frosting > 0 || !cell.piece || cell.piece.locked) {
        s.selectedCell = null;
        return;
      }

      // If another adjacent cell was already selected, swap!
      if (s.selectedCell) {
        const dr = Math.abs(s.selectedCell.r - r);
        const dc = Math.abs(s.selectedCell.c - c);
        if (dr + dc === 1) {
          attemptSwap(s.selectedCell.r, s.selectedCell.c, r, c);
          return;
        }
        if (dr === 0 && dc === 0) {
          s.selectedCell = null;
          return;
        }
      }

      s.selectedCell = { r, c };
      s.dragStart = { r, c, px, py };
      cell.piece.scaleX = 1.15;
      cell.piece.scaleY = 0.88;
      audioEngine.playSelect();
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const s = simRef.current;
      if (!s || !s.dragStart || s.busy || s.ended || isPausedRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const dx = px - s.dragStart.px;
      const dy = py - s.dragStart.py;
      const threshold = s.layout.cellSize * 0.3;

      if (Math.hypot(dx, dy) >= threshold) {
        const { r, c } = s.dragStart;
        s.dragStart = null;
        let nr = r;
        let nc = c;
        if (Math.abs(dx) > Math.abs(dy)) {
          nc += dx > 0 ? 1 : -1;
        } else {
          nr += dy > 0 ? 1 : -1;
        }
        if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols) {
          attemptSwap(r, c, nr, nc);
        }
      }
    };

    const onPointerUp = () => {
      if (simRef.current) {
        simRef.current.dragStart = null;
      }
    };

    return (
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`w-full h-full touch-none ${
            activeBooster ? 'cursor-crosshair' : 'cursor-pointer'
          }`}
        />
      </div>
    );
  }
);
