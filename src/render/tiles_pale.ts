// Tuiles du Royaume Pâle : herbe de cendre, dalles pâles, mares de brume, marbre et murs du palais, ruines.
import { disque, ellipse, mix, rgba, shade } from './util';
import type { Voisin } from './tiles';

const CENDRE = '#9d99ad';
const CENDRE_CLAIR = '#bcb7cb';
const DALLE = '#cbc7d6';
const JOINT = '#8a85a0';
const MARBRE = '#dcd8e8';
const MARBRE_SOMBRE = '#bfb8d2';
const OR = '#d4bf7e';

/** Bruit doux en coordonnées du monde, pour que la cendre ondule sans montrer la grille. */
const onde = (wx: number, wy: number) => Math.sin(wx * 0.7 + wy * 0.4) * 0.5 + Math.sin(wx * 0.31 - wy * 0.83) * 0.5;

const BRUME = new Set(['%']);
const MURS = new Set(['|']);

function brinsSecs(ctx: CanvasRenderingContext2D, x: number, y: number, L: number, n: number, r: () => number) {
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(1, L * 0.03);
  for (let i = 0; i < n; i++) {
    const bx = x + r() * L;
    const by = y + r() * L;
    const h = L * (0.1 + r() * 0.14);
    ctx.strokeStyle = r() > 0.5 ? '#7c778f' : '#d6d1e2';
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx + (r() - 0.5) * L * 0.08, by - h * 0.6, bx + (r() - 0.5) * L * 0.18, by - h);
    ctx.stroke();
  }
}

/** Peint une tuile propre au Royaume Pâle ; renvoie false si le caractère n'en est pas une. */
export function peindrePale(ctx: CanvasRenderingContext2D, sol: string, tx: number, ty: number, L: number, v: Voisin, r: () => number): boolean {
  const x = tx * L;
  const y = ty * L;
  switch (sol) {
    case 'j': {
      for (let j = 0; j < 2; j++)
        for (let i = 0; i < 2; i++) {
          ctx.fillStyle = mix(CENDRE, CENDRE_CLAIR, 0.2 + (onde(tx + i / 2, ty + j / 2) + 1) * 0.22);
          ctx.fillRect(x + (i * L) / 2, y + (j * L) / 2, L / 2 + 0.5, L / 2 + 0.5);
        }
      for (let i = 0; i < 3; i++) ellipse(ctx, x + r() * L, y + r() * L, L * 0.1, L * 0.05, rgba('#6f6985', 0.18));
      brinsSecs(ctx, x, y, L, 7, r);
      // Quelques fleurs fanées, couleur de lune.
      if (r() > 0.82) {
        const fx = x + L * (0.2 + r() * 0.6);
        const fy = y + L * (0.2 + r() * 0.6);
        for (let p = 0; p < 5; p++) disque(ctx, fx + Math.cos(p * 1.256) * L * 0.03, fy + Math.sin(p * 1.256) * L * 0.03, L * 0.025, '#e8e2f6');
        disque(ctx, fx, fy, L * 0.018, '#b9a6e0');
      }
      return true;
    }
    case '-': {
      ctx.fillStyle = JOINT;
      ctx.fillRect(x, y, L, L);
      // Deux rangées de dalles décalées, continues d'une case à l'autre.
      for (let j = 0; j < 2; j++) {
        const dec = (ty * 2 + j) % 2 ? L / 4 : 0;
        for (let i = -1; i < 2; i++) {
          const dx = x + i * (L / 2) + dec;
          const c = mix(DALLE, '#e2deec', ((tx * 7 + ty * 3 + i * 5 + j) % 5) / 8);
          ctx.fillStyle = c;
          ctx.fillRect(Math.max(x, dx + L * 0.03), y + (j * L) / 2 + L * 0.03, Math.min(L / 2 - L * 0.06, x + L - dx - L * 0.03), L / 2 - L * 0.06);
        }
      }
      if (r() > 0.6) {
        ctx.strokeStyle = rgba('#6d6888', 0.55);
        ctx.lineWidth = Math.max(1, L * 0.02);
        ctx.beginPath();
        const cx = x + L * (0.2 + r() * 0.6);
        const cy = y + L * (0.2 + r() * 0.6);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + (r() - 0.5) * L * 0.4, cy + (r() - 0.5) * L * 0.4);
        ctx.lineTo(cx + (r() - 0.5) * L * 0.5, cy + (r() - 0.5) * L * 0.3);
        ctx.stroke();
      }
      if (r() > 0.7) ellipse(ctx, x + r() * L, y + r() * L, L * 0.09, L * 0.05, rgba('#a99bd0', 0.35));
      return true;
    }
    case '%': {
      const g = ctx.createLinearGradient(x, y, x, y + L);
      g.addColorStop(0, mix('#4f4670', '#5d5480', (onde(tx, ty) + 1) * 0.3));
      g.addColorStop(1, '#3d3560');
      ctx.fillStyle = g;
      ctx.fillRect(x, y, L, L);
      // Volutes de brume, continues en coordonnées du monde.
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, L, L);
      ctx.clip();
      ctx.strokeStyle = rgba('#d9d0f2', 0.28);
      ctx.lineWidth = Math.max(1, L * 0.05);
      for (let k = ty * 2 - 1; k <= ty * 2 + 2; k++) {
        if (((k * 5) % 3) === 1) continue;
        ctx.beginPath();
        for (let s = 0; s <= 4; s++) {
          const wx = tx + s / 4;
          const wy = k * 0.5 + Math.sin(wx * 1.3 + k * 0.7) * 0.16;
          if (s === 0) ctx.moveTo(wx * L, wy * L);
          else ctx.lineTo(wx * L, wy * L);
        }
        ctx.stroke();
      }
      ctx.restore();
      for (let i = 0; i < 2; i++) disque(ctx, x + r() * L, y + r() * L, L * 0.025, rgba('#f0eaff', 0.6));
      // Rive de cendre claire là où la mare touche la terre.
      ctx.fillStyle = rgba('#e6e0f2', 0.55);
      if (!BRUME.has(v(0, -1))) ctx.fillRect(x, y, L, L * 0.07);
      if (!BRUME.has(v(-1, 0))) ctx.fillRect(x, y, L * 0.05, L);
      if (!BRUME.has(v(1, 0))) ctx.fillRect(x + L * 0.95, y, L * 0.05, L);
      if (!BRUME.has(v(0, 1))) ctx.fillRect(x, y + L * 0.94, L, L * 0.06);
      return true;
    }
    case '+': {
      const clair = (tx + ty) % 2 === 0;
      ctx.fillStyle = clair ? mix(MARBRE, '#ece9f4', (onde(tx, ty) + 1) * 0.2) : MARBRE_SOMBRE;
      ctx.fillRect(x, y, L, L);
      // Veines violettes.
      ctx.strokeStyle = rgba('#8a7bb5', 0.35);
      ctx.lineWidth = Math.max(1, L * 0.015);
      ctx.beginPath();
      const vx = x + r() * L;
      ctx.moveTo(vx, y);
      ctx.quadraticCurveTo(vx + (r() - 0.5) * L, y + L * 0.5, x + r() * L, y + L);
      ctx.stroke();
      ctx.strokeStyle = rgba('#7a7196', 0.45);
      ctx.lineWidth = Math.max(1, L * 0.02);
      ctx.strokeRect(x + 0.5, y + 0.5, L - 1, L - 1);
      // Une rune qui luit faiblement, ici ou là.
      if (r() > 0.93) {
        ctx.strokeStyle = rgba('#b8a8ff', 0.6);
        ctx.lineWidth = Math.max(1, L * 0.025);
        ctx.beginPath();
        ctx.arc(x + L / 2, y + L / 2, L * 0.16, 0, Math.PI * 2);
        ctx.moveTo(x + L / 2, y + L * 0.28);
        ctx.lineTo(x + L / 2, y + L * 0.72);
        ctx.stroke();
      }
      return true;
    }
    case '|': {
      ctx.fillStyle = '#463e5e';
      ctx.fillRect(x, y, L, L);
      const face = !MURS.has(v(0, 1)) && v(0, 1) !== 'o';
      if (face) {
        const g = ctx.createLinearGradient(0, y + L * 0.2, 0, y + L);
        g.addColorStop(0, '#9a91b6');
        g.addColorStop(1, '#5f5680');
        ctx.fillStyle = g;
        ctx.fillRect(x, y + L * 0.2, L, L * 0.8);
        // Corniche dorée et pilastre.
        ctx.fillStyle = OR;
        ctx.fillRect(x, y + L * 0.2, L, L * 0.06);
        ctx.fillStyle = rgba('#ffffff', 0.18);
        ctx.fillRect(x + L * 0.42, y + L * 0.28, L * 0.16, L * 0.66);
        ctx.fillStyle = shade('#5f5680', -0.2);
        ctx.fillRect(x + L * 0.58, y + L * 0.28, L * 0.04, L * 0.66);
        if ((tx + ty) % 3 === 0) disque(ctx, x + L / 2, y + L * 0.5, L * 0.05, rgba('#c7b8ff', 0.7));
        ctx.fillStyle = rgba('#1c1630', 0.3);
        ctx.fillRect(x, y + L * 0.9, L, L * 0.1);
      } else {
        ctx.fillStyle = shade('#463e5e', 0.1);
        ctx.fillRect(x + L * 0.06, y + L * 0.06, L * 0.88, L * 0.88);
        ctx.fillStyle = rgba('#d4bf7e', 0.22);
        ctx.fillRect(x + L * 0.1, y + L * 0.1, L * 0.8, L * 0.05);
      }
      return true;
    }
    default:
      return false;
  }
}

/** Ruine : tronçon de colonne brisée et gravats, peint par-dessus le sol. */
export function decorPale(ctx: CanvasRenderingContext2D, ch: string, tx: number, ty: number, L: number, _v: Voisin, r: () => number): void {
  if (ch !== '&') return;
  const x = tx * L;
  const y = ty * L;
  ellipse(ctx, x + L / 2, y + L * 0.86, L * 0.44, L * 0.13, rgba('#3c3456', 0.28));
  // Fût cannelé, cassé en biais.
  const fx = x + L * 0.26;
  const fw = L * 0.48;
  const haut = y + L * (0.18 + r() * 0.12);
  const g = ctx.createLinearGradient(fx, 0, fx + fw, 0);
  g.addColorStop(0, '#b7b0c9');
  g.addColorStop(0.45, '#ebe7f3');
  g.addColorStop(1, '#8f88a6');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(fx, y + L * 0.82);
  ctx.lineTo(fx, haut + L * 0.1);
  ctx.lineTo(fx + fw * 0.4, haut);
  ctx.lineTo(fx + fw * 0.7, haut + L * 0.08);
  ctx.lineTo(fx + fw, haut + L * 0.02);
  ctx.lineTo(fx + fw, y + L * 0.82);
  ctx.fill();
  ctx.strokeStyle = rgba('#6d6688', 0.45);
  ctx.lineWidth = Math.max(1, L * 0.02);
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(fx + (fw * i) / 4, haut + L * 0.12);
    ctx.lineTo(fx + (fw * i) / 4, y + L * 0.8);
    ctx.stroke();
  }
  // Base et gravats.
  ctx.fillStyle = '#a49db8';
  ctx.fillRect(x + L * 0.18, y + L * 0.76, L * 0.64, L * 0.1);
  for (let i = 0; i < 3; i++) disque(ctx, x + L * (0.12 + r() * 0.76), y + L * (0.82 + r() * 0.1), L * (0.04 + r() * 0.04), shade('#b7b0c9', -0.15 * r()));
  // Lierre de brume.
  ctx.strokeStyle = rgba('#8f7fc4', 0.6);
  ctx.lineWidth = Math.max(1, L * 0.03);
  ctx.beginPath();
  ctx.moveTo(fx + fw * 0.2, y + L * 0.8);
  ctx.quadraticCurveTo(fx + fw * 0.9, y + L * 0.6, fx + fw * 0.3, haut + L * 0.2);
  ctx.stroke();
}
