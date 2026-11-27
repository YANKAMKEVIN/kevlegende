// Tuiles du désert d'Ambre : dunes, grès, dalles et murs du temple, cactus.
import { PAL } from './palette';
import { disque, ellipse, mix, rgba, shade } from './util';
import type { Voisin } from './tiles';

const DUNE = '#e9c27e';
const GRES = '#d39a5c';
const DALLE = '#c8b089';

/** Peint une tuile propre au désert ; renvoie false si le caractère n'en est pas une. */
export function peindreDesert(ctx: CanvasRenderingContext2D, sol: string, tx: number, ty: number, L: number, v: Voisin, r: () => number): boolean {
  const x = tx * L;
  const y = ty * L;
  switch (sol) {
    case 'y': {
      ctx.fillStyle = mix(DUNE, '#f0d39a', 0.35 + r() * 0.08);
      ctx.fillRect(x, y, L, L);
      // Rides continues d'une case à l'autre : calculées en coordonnées du monde.
      const ride = (wx: number, k: number) => k * 0.34 + Math.sin(wx * 1.1 + k * 0.9) * 0.08 + Math.sin(wx * 0.31 + k * 0.4) * 0.22;
      const k0 = Math.floor((ty - 0.6) / 0.34);
      const k1 = Math.ceil((ty + 1.6) / 0.34);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, L, L);
      ctx.clip();
      for (let k = k0; k <= k1; k++) {
        for (const [coul, dy, ep] of [['#b88a4c', 0.025, 0.035], ['#fff3d6', -0.02, 0.025]] as const) {
          ctx.strokeStyle = rgba(coul, coul === '#b88a4c' ? 0.32 : 0.5);
          ctx.lineWidth = Math.max(1, L * ep);
          ctx.beginPath();
          for (let i = 0; i <= 6; i++) {
            const wx = tx + i / 6;
            const wy = ride(wx, k) + dy;
            if (i === 0) ctx.moveTo(wx * L, wy * L);
            else ctx.lineTo(wx * L, wy * L);
          }
          ctx.stroke();
        }
      }
      ctx.restore();
      return true;
    }
    case 'l':
    case 'e': {
      const base = sol === 'e' ? '#e2cfa3' : DALLE;
      ctx.fillStyle = shade(base, -0.22);
      ctx.fillRect(x, y, L, L);
      const dec = ty % 2 ? 0.5 : 0;
      for (const [px, pw] of [[-dec, 1], [1 - dec, 1]] as const) {
        const sx = x + Math.max(0, px) * L + L * 0.03;
        const ex = x + Math.min(1, px + pw) * L - L * 0.03;
        if (ex <= sx) continue;
        ctx.fillStyle = shade(base, (r() - 0.5) * 0.1);
        ctx.fillRect(sx, y + L * 0.04, ex - sx, L * 0.92);
        ctx.fillStyle = rgba('#ffffff', 0.14);
        ctx.fillRect(sx, y + L * 0.04, ex - sx, L * 0.08);
      }
      if (sol === 'l' && r() > 0.6) {
        ctx.strokeStyle = rgba('#5a4430', 0.4);
        ctx.lineWidth = Math.max(1, L * 0.02);
        ctx.beginPath();
        ctx.moveTo(x + L * r(), y + L * 0.1);
        ctx.lineTo(x + L * r(), y + L * 0.5);
        ctx.lineTo(x + L * r(), y + L * 0.9);
        ctx.stroke();
      }
      if (sol === 'e' && tx % 3 === 1 && ty % 3 === 1) {
        ctx.strokeStyle = rgba(PAL.ambre, 0.35);
        ctx.lineWidth = Math.max(1, L * 0.03);
        ctx.strokeRect(x + L * 0.3, y + L * 0.3, L * 0.4, L * 0.4);
      }
      return true;
    }
    case 'm': {
      ctx.fillStyle = '#5c4434';
      ctx.fillRect(x, y, L, L);
      const face = v(0, 1) !== 'm' && v(0, 1) !== 'o';
      if (face) {
        ctx.fillStyle = '#a8835a';
        ctx.fillRect(x, y + L * 0.3, L, L * 0.7);
        ctx.fillStyle = shade('#a8835a', -0.25);
        ctx.fillRect(x, y + L * 0.3, L, L * 0.06);
        ctx.fillStyle = PAL.ambre;
        ctx.fillRect(x, y + L * 0.42, L, L * 0.05);
        // Gravures.
        ctx.strokeStyle = rgba('#4a3424', 0.55);
        ctx.lineWidth = Math.max(1, L * 0.025);
        const motif = (tx * 7 + ty * 3) % 3;
        ctx.beginPath();
        if (motif === 0) {
          ctx.arc(x + L / 2, y + L * 0.68, L * 0.12, 0, Math.PI * 2);
          ctx.moveTo(x + L / 2, y + L * 0.5);
          ctx.lineTo(x + L / 2, y + L * 0.56);
        } else if (motif === 1) {
          ctx.moveTo(x + L * 0.3, y + L * 0.85);
          ctx.lineTo(x + L * 0.5, y + L * 0.55);
          ctx.lineTo(x + L * 0.7, y + L * 0.85);
        } else {
          ctx.moveTo(x + L * 0.25, y + L * 0.62);
          ctx.lineTo(x + L * 0.75, y + L * 0.62);
          ctx.moveTo(x + L * 0.25, y + L * 0.78);
          ctx.lineTo(x + L * 0.75, y + L * 0.78);
        }
        ctx.stroke();
        ctx.fillStyle = rgba('#000000', 0.2);
        ctx.fillRect(x, y + L * 0.9, L, L * 0.1);
      } else {
        ctx.fillStyle = shade('#5c4434', 0.12);
        ctx.fillRect(x + L * 0.06, y + L * 0.06, L * 0.88, L * 0.88);
      }
      return true;
    }
    default:
      return false;
  }
}

/** Grès (bloc de falaise) et cactus, peints par-dessus le sol. */
export function decorDesert(ctx: CanvasRenderingContext2D, ch: string, tx: number, ty: number, L: number, v: Voisin, r: () => number): void {
  const x = tx * L;
  const y = ty * L;
  if (ch === 'g') {
    const haut = v(0, -1) === 'g';
    const bas = v(0, 1) === 'g';
    // Plateau du grès : teinte qui varie doucement, strates continues, fissures et cailloux.
    const onde = Math.sin(tx * 0.7 + ty * 0.3) * 0.5 + 0.5;
    ctx.fillStyle = shade(GRES, 0.06 + onde * 0.1);
    ctx.fillRect(x, y + (haut ? 0 : L * 0.12), L, bas ? L : L * 0.55);
    if (bas && haut) {
      ctx.strokeStyle = rgba('#a8693a', 0.28);
      ctx.lineWidth = Math.max(1, L * 0.04);
      for (let k = 0; k < 2; k++) {
        const sy = y + L * (0.3 + k * 0.45) + Math.sin(tx * 1.3 + k) * L * 0.08;
        ctx.beginPath();
        ctx.moveTo(x, sy);
        ctx.quadraticCurveTo(x + L * 0.5, sy + Math.sin(tx * 2.1 + ty) * L * 0.1, x + L, sy + Math.sin((tx + 1) * 1.3 + k) * L * 0.08 - Math.sin(tx * 1.3 + k) * L * 0.08);
        ctx.stroke();
      }
      if (r() > 0.55) {
        ctx.strokeStyle = rgba('#7a4a28', 0.35);
        ctx.lineWidth = Math.max(1, L * 0.025);
        ctx.beginPath();
        const fx = x + L * (0.2 + r() * 0.6);
        ctx.moveTo(fx, y + L * 0.15);
        ctx.lineTo(fx + L * 0.12, y + L * 0.45);
        ctx.lineTo(fx - L * 0.05, y + L * 0.75);
        ctx.stroke();
      }
      if (r() > 0.7) ellipse(ctx, x + L * (0.2 + r() * 0.6), y + L * (0.2 + r() * 0.6), L * 0.12, L * 0.08, rgba('#f6d7a8', 0.35));
    }
    if (!bas) {
      // Face de la falaise avec strates.
      ctx.fillStyle = GRES;
      ctx.fillRect(x, y + L * 0.5, L, L * 0.42);
      ctx.strokeStyle = rgba('#8a5a32', 0.5);
      ctx.lineWidth = Math.max(1, L * 0.025);
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + L * (0.62 + i * 0.13) + (r() - 0.5) * L * 0.04);
        ctx.lineTo(x + L, y + L * (0.62 + i * 0.13) + (r() - 0.5) * L * 0.04);
        ctx.stroke();
      }
      ctx.fillStyle = rgba('#000000', 0.22);
      ctx.fillRect(x, y + L * 0.9, L, L * 0.08);
    }
    if (!haut) {
      ctx.fillStyle = rgba('#fff1d0', 0.4);
      ctx.fillRect(x, y + L * 0.12, L, L * 0.06);
    }
    if (v(-1, 0) !== 'g') {
      ctx.fillStyle = rgba('#000000', 0.12);
      ctx.fillRect(x, y + (haut ? 0 : L * 0.12), L * 0.06, L);
    }
    for (let i = 0; i < 3; i++) disque(ctx, x + L * (0.15 + r() * 0.7), y + L * (0.2 + r() * 0.25), L * 0.03, rgba('#9a6a3a', 0.4));
  } else if (ch === 'q') {
    ellipse(ctx, x + L / 2, y + L * 0.86, L * 0.3, L * 0.09, rgba('#000000', 0.2));
    const vert = '#5a9a52';
    const bras = (bx: number, by: number, hx: number, hy: number) => {
      ctx.strokeStyle = vert;
      ctx.lineWidth = L * 0.13;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(hx, by);
      ctx.lineTo(hx, hy);
      ctx.stroke();
    };
    bras(x + L * 0.5, y + L * 0.55, x + L * 0.25, y + L * 0.3);
    bras(x + L * 0.5, y + L * 0.45, x + L * 0.76, y + L * 0.22);
    ctx.strokeStyle = vert;
    ctx.lineWidth = L * 0.2;
    ctx.beginPath();
    ctx.moveTo(x + L * 0.5, y + L * 0.85);
    ctx.lineTo(x + L * 0.5, y + L * 0.1);
    ctx.stroke();
    ctx.strokeStyle = rgba('#a9d98a', 0.7);
    ctx.lineWidth = Math.max(1, L * 0.03);
    ctx.beginPath();
    ctx.moveTo(x + L * 0.46, y + L * 0.8);
    ctx.lineTo(x + L * 0.46, y + L * 0.14);
    ctx.stroke();
    if (r() > 0.5) disque(ctx, x + L * 0.5, y + L * 0.07, L * 0.06, '#f08a9a');
  }
}
