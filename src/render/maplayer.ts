// Couche statique d'une carte : sol peint une fois, falaises de l'île flottante, décor bas.
import type { CarteCompilee } from '../core/world/map';
import type { Ambiance } from '../core/world/mapdef';
import { PAL } from './palette';
import { peindreDecorBas, peindreTransitions, peindreTuile } from './tiles';
import { ctx2d, hash, mix, rgba, shade, toile } from './util';

export interface CoucheCarte {
  id: string;
  canvas: HTMLCanvasElement;
  /** Pixels par case dans la couche (peut différer de la taille affichée). */
  L: number;
  /** Cases d'eau (pour l'animation) et d'arbres (dessinés en hauteur). */
  eau: { x: number; y: number }[];
  arbres: { x: number; y: number; v: number }[];
  cristaux: { x: number; y: number }[];
}

export const exterieur = (a: Ambiance) => a !== 'interieur' && a !== 'grotte';

/** Marge sous la carte pour laisser pendre les falaises de l'île. */
export const MARGE_BAS = 2;

export function construireCouche(c: CarteCompilee, L: number): CoucheCarte {
  const W = c.largeur;
  const H = c.hauteur;
  const cv = toile(W * L, (H + MARGE_BAS) * L);
  const ctx = ctx2d(cv);
  const g = (x: number, y: number) => c.grille[y]?.[x] ?? 'o';
  const fond = c.def.solDefaut === 'a' ? 'a' : c.def.ambiance === 'grotte' ? 'c' : c.def.ambiance === 'desert' ? 's' : c.def.ambiance === 'neige' ? 'n' : '.';
  const ext = exterieur(c.def.ambiance);
  const eau: CoucheCarte['eau'] = [];
  const arbres: CoucheCarte['arbres'] = [];
  const cristaux: CoucheCarte['cristaux'] = [];

  // 1. Falaises sous l'île (dessinées d'abord : le sol les recouvre en haut).
  if (ext) {
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        if (g(x, y) === 'o' || g(x, y + 1) !== 'o') continue;
        falaise(ctx, x, y, L, hash(x, y, 21), g(x - 1, y + 1) !== 'o' || g(x - 1, y) === 'o', g(x + 1, y) === 'o');
      }
  }
  // 2. Sol.
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const ch = g(x, y);
      if (ch === 'o') continue;
      peindreTuile(ctx, ch, x, y, L, (dx, dy) => g(x + dx, y + dy), fond);
      if (ch === '~') eau.push({ x, y });
      if (ch === 'T') arbres.push({ x, y, v: hash(x, y, 9) });
      if (ch === '*') cristaux.push({ x, y });
    }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) peindreTransitions(ctx, g(x, y), x, y, L, (dx, dy) => g(x + dx, y + dy));
  // 3. Bords de l'île : liseré clair en haut, ombre sur les flancs.
  if (ext) {
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        if (g(x, y) === 'o') continue;
        if (g(x, y - 1) === 'o') {
          ctx.fillStyle = rgba('#ffffff', 0.22);
          ctx.fillRect(x * L, y * L, L, L * 0.08);
        }
        if (g(x - 1, y) === 'o') {
          ctx.fillStyle = rgba(PAL.falaiseFonce, 0.35);
          ctx.fillRect(x * L, y * L, L * 0.08, L);
        }
        if (g(x + 1, y) === 'o') {
          ctx.fillStyle = rgba(PAL.falaiseFonce, 0.35);
          ctx.fillRect(x * L + L * 0.92, y * L, L * 0.08, L);
        }
        if (g(x, y + 1) === 'o') {
          ctx.fillStyle = fond === 's' ? shade(PAL.sable, -0.28) : fond === 'n' ? '#b9cbe0' : mix(PAL.herbeFonce, PAL.falaise, 0.3);
          ctx.fillRect(x * L, y * L + L * 0.9, L, L * 0.1);
        }
      }
  }
  // 4. Ombres des arbres puis décor bas.
  for (const a of arbres) {
    ctx.fillStyle = rgba('#1d3b2a', 0.28);
    ctx.beginPath();
    ctx.ellipse(a.x * L + L * 0.55, a.y * L + L * 0.8, L * 0.55, L * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) peindreDecorBas(ctx, g(x, y), x, y, L, (dx, dy) => g(x + dx, y + dy));
  return { id: c.def.id, canvas: cv, L, eau, arbres, cristaux };
}

function falaise(ctx: CanvasRenderingContext2D, x: number, y: number, L: number, h: number, bordG: boolean, bordD: boolean): void {
  const px = x * L;
  const top = (y + 1) * L - L * 0.1;
  const prof = L * (0.9 + h * 0.8);
  const gr = ctx.createLinearGradient(0, top, 0, top + prof);
  gr.addColorStop(0, PAL.falaise);
  gr.addColorStop(0.6, PAL.falaiseFonce);
  gr.addColorStop(1, rgba(PAL.falaiseFonce, 0));
  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.moveTo(px - (bordG ? 0 : L * 0.02), top);
  ctx.lineTo(px + L + (bordD ? 0 : L * 0.02), top);
  ctx.lineTo(px + L * (bordD ? 0.8 : 1), top + prof * (0.75 + h * 0.2));
  ctx.lineTo(px + L * (0.45 + h * 0.2), top + prof);
  ctx.lineTo(px + L * (bordG ? 0.2 : 0), top + prof * (0.7 + (1 - h) * 0.25));
  ctx.closePath();
  ctx.fill();
  // Strates.
  ctx.strokeStyle = rgba(shade(PAL.falaise, 0.25), 0.5);
  ctx.lineWidth = Math.max(1, L * 0.03);
  for (let i = 1; i <= 2; i++) {
    const sy = top + prof * 0.22 * i;
    ctx.beginPath();
    ctx.moveTo(px + L * 0.05, sy + (h - 0.5) * L * 0.08);
    ctx.lineTo(px + L * 0.95, sy - (h - 0.5) * L * 0.08);
    ctx.stroke();
  }
  // Racines pendantes.
  if (h > 0.55) {
    ctx.strokeStyle = rgba(PAL.herbeFonce, 0.8);
    ctx.lineWidth = Math.max(1, L * 0.035);
    ctx.beginPath();
    const rx = px + L * (0.2 + h * 0.6);
    ctx.moveTo(rx, top);
    ctx.quadraticCurveTo(rx + L * 0.1, top + L * 0.35, rx - L * 0.05, top + L * (0.4 + h * 0.4));
    ctx.stroke();
  }
}
