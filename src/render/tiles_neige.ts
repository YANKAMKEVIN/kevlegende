// Tuiles des Cimes de Givre : neige, neige tassée, glace, murs de glace, sol givré, congères.
import { disque, ellipse, mix, rgba, shade } from './util';
import type { Voisin } from './tiles';

const NEIGE = '#eef3f9';
const OMBRE = '#c6d6ea';
const TASSEE = '#d3dce8';
const GLACE = '#bfe2f2';
const GIVRE = '#8ea7c6';

/** Bruit doux en coordonnées du monde : la neige ondule sans montrer la grille. */
const onde = (wx: number, wy: number) => Math.sin(wx * 0.9 + wy * 0.35) * 0.5 + Math.sin(wx * 0.23 - wy * 0.61) * 0.5;

const NEIGEUX = new Set(['n', 'u', 'T', '#']);

/** Peint une tuile propre à la neige ; renvoie false si le caractère n'en est pas une. */
export function peindreNeige(ctx: CanvasRenderingContext2D, sol: string, tx: number, ty: number, L: number, v: Voisin, r: () => number): boolean {
  const x = tx * L;
  const y = ty * L;
  switch (sol) {
    case 'n': {
      // Quatre quarts de case teintés par le bruit du monde : dégradé continu d'une case à l'autre.
      for (let j = 0; j < 2; j++)
        for (let i = 0; i < 2; i++) {
          ctx.fillStyle = mix(NEIGE, OMBRE, 0.12 + (onde(tx + i / 2, ty + j / 2) + 1) * 0.16);
          ctx.fillRect(x + (i * L) / 2, y + (j * L) / 2, L / 2 + 0.5, L / 2 + 0.5);
        }
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, L, L);
      ctx.clip();
      // Creux de vent : longues ombres bleutées, continues en coordonnées du monde.
      ctx.strokeStyle = rgba('#9fb6d6', 0.28);
      ctx.lineWidth = Math.max(1, L * 0.05);
      for (let k = Math.floor(ty / 0.7) - 1; k <= Math.ceil((ty + 1) / 0.7) + 1; k++) {
        if (((k * 7) % 5) > 2) continue;
        ctx.beginPath();
        for (let s = 0; s <= 4; s++) {
          const wx = tx + s / 4;
          const wy = k * 0.7 + Math.sin(wx * 0.8 + k) * 0.18;
          if (s === 0) ctx.moveTo(wx * L, wy * L);
          else ctx.lineTo(wx * L, wy * L);
        }
        ctx.stroke();
      }
      ctx.restore();
      for (let i = 0; i < 4; i++) disque(ctx, x + r() * L, y + r() * L, L * 0.018, rgba('#ffffff', 0.9));
      if (r() > 0.8) disque(ctx, x + r() * L, y + r() * L, L * 0.022, rgba('#7fa0c8', 0.5));
      return true;
    }
    case 't': {
      ctx.fillStyle = mix(TASSEE, NEIGE, 0.2 + (onde(tx, ty) + 1) * 0.1);
      ctx.fillRect(x, y, L, L);
      // Traces de pas et de traîneau.
      ctx.fillStyle = rgba('#9aabc4', 0.35);
      for (let i = 0; i < 3; i++) ellipse(ctx, x + L * (0.2 + r() * 0.6), y + L * (0.15 + r() * 0.7), L * 0.05, L * 0.08, rgba('#9aabc4', 0.35));
      for (let i = 0; i < 3; i++) disque(ctx, x + r() * L, y + r() * L, L * 0.02, rgba('#7c8798', 0.5));
      // Bourrelets de neige fraîche le long des bords.
      for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]] as const) {
        if (!NEIGEUX.has(v(dx, dy))) continue;
        for (let i = 0; i < 4; i++) {
          const t = (i + 0.5) / 4;
          const rr = L * (0.09 + ((tx * 3 + ty * 5 + i) % 4) * 0.02);
          const cx = dx === 0 ? x + t * L : dx > 0 ? x + L : x;
          const cy = dy === 0 ? y + t * L : dy > 0 ? y + L : y;
          disque(ctx, cx, cy, rr, mix(NEIGE, OMBRE, 0.25));
        }
      }
      return true;
    }
    case 'i': {
      const g = ctx.createLinearGradient(x, y, x + L, y + L);
      g.addColorStop(0, mix(GLACE, '#e6f6fd', 0.3 + (onde(tx, ty) + 1) * 0.15));
      g.addColorStop(1, mix(GLACE, '#8fc4e0', 0.25));
      ctx.fillStyle = g;
      ctx.fillRect(x, y, L, L);
      // Reflets en biais, continus d'une case à l'autre.
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, L, L);
      ctx.clip();
      ctx.strokeStyle = rgba('#ffffff', 0.5);
      ctx.lineWidth = Math.max(1, L * 0.03);
      for (let k = -2; k <= 2; k++) {
        const b = (tx + ty) * L + k * L * 0.9;
        if (((tx + ty + k) & 3) !== 0) continue;
        ctx.beginPath();
        ctx.moveTo(x, b - x + y);
        ctx.lineTo(x + L, b - x - L + y);
        ctx.stroke();
      }
      ctx.restore();
      if (r() > 0.6) {
        ctx.strokeStyle = rgba('#5f8fb8', 0.45);
        ctx.lineWidth = Math.max(1, L * 0.018);
        ctx.beginPath();
        const cx = x + L * (0.2 + r() * 0.6);
        const cy = y + L * (0.2 + r() * 0.6);
        for (let b = 0; b < 3; b++) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + (r() - 0.5) * L * 0.6, cy + (r() - 0.5) * L * 0.6);
        }
        ctx.stroke();
      }
      // Berge enneigée.
      ctx.fillStyle = rgba('#ffffff', 0.7);
      if (v(0, -1) !== 'i' && v(0, -1) !== 'o') ctx.fillRect(x, y, L, L * 0.08);
      if (v(-1, 0) !== 'i' && v(-1, 0) !== 'o') ctx.fillRect(x, y, L * 0.06, L);
      if (v(1, 0) !== 'i' && v(1, 0) !== 'o') ctx.fillRect(x + L * 0.94, y, L * 0.06, L);
      return true;
    }
    case 'a': {
      ctx.fillStyle = mix(GIVRE, '#a9bfdb', (onde(tx, ty) + 1) * 0.25);
      ctx.fillRect(x, y, L, L);
      for (let i = 0; i < 3; i++) ellipse(ctx, x + r() * L, y + r() * L, L * 0.12, L * 0.07, rgba('#d9e8f7', 0.35));
      // Fleurs de givre.
      ctx.strokeStyle = rgba('#eef6ff', 0.55);
      ctx.lineWidth = Math.max(1, L * 0.015);
      if (r() > 0.5) {
        const cx = x + L * (0.2 + r() * 0.6);
        const cy = y + L * (0.2 + r() * 0.6);
        ctx.beginPath();
        for (let b = 0; b < 6; b++) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(b * 1.047) * L * 0.1, cy + Math.sin(b * 1.047) * L * 0.1);
        }
        ctx.stroke();
      }
      return true;
    }
    case 'z': {
      ctx.fillStyle = '#4f7aa6';
      ctx.fillRect(x, y, L, L);
      const face = v(0, 1) !== 'z' && v(0, 1) !== 'o';
      if (face) {
        const g = ctx.createLinearGradient(0, y + L * 0.3, 0, y + L);
        g.addColorStop(0, '#bfe6f8');
        g.addColorStop(1, '#6fa8d0');
        ctx.fillStyle = g;
        ctx.fillRect(x, y + L * 0.3, L, L * 0.7);
        ctx.fillStyle = rgba('#ffffff', 0.55);
        ctx.fillRect(x, y + L * 0.3, L, L * 0.05);
        ctx.strokeStyle = rgba('#ffffff', 0.5);
        ctx.lineWidth = Math.max(1, L * 0.03);
        ctx.beginPath();
        ctx.moveTo(x + L * (0.2 + (tx % 3) * 0.2), y + L * 0.4);
        ctx.lineTo(x + L * (0.1 + (tx % 3) * 0.2), y + L * 0.85);
        ctx.stroke();
        // Stalactites au bord du plafond.
        ctx.fillStyle = '#e9f7ff';
        for (let i = 0; i < 3; i++) {
          const sx = x + L * (0.15 + i * 0.32);
          ctx.beginPath();
          ctx.moveTo(sx - L * 0.06, y + L * 0.3);
          ctx.lineTo(sx, y + L * (0.45 + ((tx + i) % 3) * 0.06));
          ctx.lineTo(sx + L * 0.06, y + L * 0.3);
          ctx.fill();
        }
        ctx.fillStyle = rgba('#1d2f4a', 0.25);
        ctx.fillRect(x, y + L * 0.9, L, L * 0.1);
      } else {
        ctx.fillStyle = shade('#4f7aa6', 0.12);
        ctx.fillRect(x + L * 0.06, y + L * 0.06, L * 0.88, L * 0.88);
        ctx.fillStyle = rgba('#d9f0ff', 0.25);
        ctx.fillRect(x + L * 0.12, y + L * 0.1, L * 0.5, L * 0.08);
      }
      return true;
    }
    default:
      return false;
  }
}

/** Congère : bosse de neige d'où dépasse un rocher, peinte par-dessus le sol. */
export function decorNeige(ctx: CanvasRenderingContext2D, ch: string, tx: number, ty: number, L: number, _v: Voisin, r: () => number): void {
  if (ch !== 'u') return;
  const x = tx * L;
  const y = ty * L;
  ellipse(ctx, x + L / 2, y + L * 0.84, L * 0.46, L * 0.14, rgba('#5f7898', 0.25));
  ctx.fillStyle = '#7d8798';
  ctx.beginPath();
  ctx.moveTo(x + L * 0.18, y + L * 0.7);
  ctx.lineTo(x + L * (0.3 + r() * 0.1), y + L * 0.22);
  ctx.lineTo(x + L * 0.62, y + L * (0.12 + r() * 0.1));
  ctx.lineTo(x + L * 0.84, y + L * 0.7);
  ctx.fill();
  ctx.fillStyle = shade('#7d8798', 0.2);
  ctx.beginPath();
  ctx.moveTo(x + L * 0.34, y + L * 0.3);
  ctx.lineTo(x + L * 0.6, y + L * 0.18);
  ctx.lineTo(x + L * 0.6, y + L * 0.45);
  ctx.fill();
  // Chapeau et pied de neige.
  ellipse(ctx, x + L * 0.52, y + L * 0.22, L * 0.2, L * 0.08, NEIGE);
  ctx.fillStyle = NEIGE;
  ctx.beginPath();
  ctx.ellipse(x + L / 2, y + L * 0.76, L * 0.48, L * 0.2, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(x + L * 0.02, y + L * 0.76, L * 0.96, L * 0.08);
  ellipse(ctx, x + L * 0.4, y + L * 0.66, L * 0.18, L * 0.05, rgba('#ffffff', 0.9));
  ctx.fillStyle = rgba(OMBRE, 0.8);
  ctx.fillRect(x + L * 0.02, y + L * 0.82, L * 0.96, L * 0.04);
}
