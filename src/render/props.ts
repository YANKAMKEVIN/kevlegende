// Décors procéduraux (maisons, moulin, fanal, navire…) pré-rendus en sprites mis en cache.
import type { PropType } from '../core/world/mapdef';
import { PAL } from './palette';
import { ctx2d, disque, ellipse, rgba, rondRect, shade, toile } from './util';

export interface SpriteProp {
  canvas: HTMLCanvasElement;
  /** Décalage (en pixels) du coin haut-gauche du sprite par rapport à la case d'ancre. */
  ox: number;
  oy: number;
}

const cache = new Map<string, SpriteProp>();
type Dessin = (x: CanvasRenderingContext2D, T: number, w: number, h: number, actif: boolean, portes: readonly number[]) => void;

/** `portes` : colonnes (relatives) de la rangée du bas où une porte est posée. */
export function spriteProp(type: PropType, w: number, h: number, actif: boolean, T: number, portes: readonly number[] = []): SpriteProp {
  const k = `${type}:${w}x${h}:${actif ? 1 : 0}:${T}:${portes.join(',')}`;
  const deja = cache.get(k);
  if (deja) return deja;
  const c = toile((w + 2) * T, (h + 3) * T);
  const x = ctx2d(c);
  x.translate(T, 3 * T);
  (DESSINS[type] ?? caisse)(x, T, w, h, actif, portes);
  const s = { canvas: c, ox: -T, oy: -3 * T };
  cache.set(k, s);
  return s;
}

const ombre = (x: CanvasRenderingContext2D, T: number, w: number, h: number) => ellipse(x, (w * T) / 2, h * T - T * 0.08, (w * T) / 2 + T * 0.1, T * 0.22, rgba('#000000', 0.22));

const maison = (toit: string): Dessin => (x, T, w, h, _a, portes) => {
  ombre(x, T, w, h);
  const murH = T * 1.55;
  const murY = h * T - murH;
  // Murs à colombages.
  x.fillStyle = '#f3e3c3';
  x.fillRect(T * 0.12, murY, w * T - T * 0.24, murH);
  x.strokeStyle = PAL.boisFonce;
  x.lineWidth = T * 0.07;
  x.strokeRect(T * 0.12, murY, w * T - T * 0.24, murH);
  for (let i = 1; i < w; i++) {
    x.beginPath();
    x.moveTo(i * T, murY);
    x.lineTo(i * T, h * T);
    x.stroke();
  }
  x.fillStyle = shade('#f3e3c3', -0.25);
  x.fillRect(T * 0.12, h * T - T * 0.18, w * T - T * 0.24, T * 0.18);
  // Fenêtres éclairées.
  for (let i = 0; i < w; i++) {
    if (portes.includes(i)) continue;
    const fx = i * T + T * 0.3;
    const fy = murY + T * 0.35;
    x.fillStyle = PAL.boisFonce;
    rondRect(x, fx - T * 0.05, fy - T * 0.05, T * 0.5, T * 0.5, T * 0.08);
    x.fill();
    x.fillStyle = '#ffd98a';
    rondRect(x, fx, fy, T * 0.4, T * 0.4, T * 0.06);
    x.fill();
    x.fillStyle = PAL.boisFonce;
    x.fillRect(fx + T * 0.18, fy, T * 0.04, T * 0.4);
    x.fillRect(fx, fy + T * 0.18, T * 0.4, T * 0.04);
    x.fillStyle = '#e86a8f';
    for (let k = 0; k < 3; k++) disque(x, fx + T * (0.06 + k * 0.14), fy + T * 0.5, T * 0.06, k % 2 ? '#f2b84b' : '#e86a8f');
  }
  // Portes.
  for (const p of portes) {
    const px = p * T + T * 0.2;
    x.fillStyle = PAL.boisFonce;
    rondRect(x, px - T * 0.04, h * T - T * 0.92, T * 0.68, T * 0.92, T * 0.3);
    x.fill();
    x.fillStyle = PAL.bois;
    rondRect(x, px, h * T - T * 0.88, T * 0.6, T * 0.88, T * 0.26);
    x.fill();
    disque(x, px + T * 0.46, h * T - T * 0.42, T * 0.05, PAL.ambre);
  }
  // Toit.
  const toitBas = murY + T * 0.1;
  const toitHaut = -T * 0.9;
  x.fillStyle = shade(toit, -0.25);
  x.beginPath();
  x.moveTo(-T * 0.2, toitBas);
  x.lineTo(w * T + T * 0.2, toitBas);
  x.lineTo(w * T - T * 0.5, toitHaut);
  x.lineTo(T * 0.5, toitHaut);
  x.closePath();
  x.fill();
  const rangs = 4;
  for (let r = 0; r < rangs; r++) {
    const y0 = toitHaut + ((toitBas - toitHaut) * r) / rangs;
    const y1 = toitHaut + ((toitBas - toitHaut) * (r + 1)) / rangs;
    const inset = (T * 0.7 * (rangs - r)) / rangs;
    x.fillStyle = shade(toit, r % 2 ? -0.05 : 0.06);
    x.beginPath();
    x.moveTo(-T * 0.2 + inset - T * 0.18, y1);
    x.lineTo(w * T + T * 0.2 - inset + T * 0.18, y1);
    x.lineTo(w * T + T * 0.2 - inset, y0);
    x.lineTo(-T * 0.2 + inset, y0);
    x.closePath();
    x.fill();
    x.strokeStyle = rgba(shade(toit, -0.4), 0.45);
    x.lineWidth = T * 0.03;
    for (let k = 0; k < w * 3; k++) {
      const tx = -T * 0.1 + inset + (k * (w * T - 2 * inset + T * 0.2)) / (w * 3);
      x.beginPath();
      x.moveTo(tx, y0);
      x.lineTo(tx, y1);
      x.stroke();
    }
  }
  x.fillStyle = rgba('#ffffff', 0.25);
  x.fillRect(T * 0.5, toitHaut, w * T - T, T * 0.08);
  // Cheminée.
  x.fillStyle = '#a37a5a';
  x.fillRect(w * T - T * 1.2, toitHaut - T * 0.45, T * 0.4, T * 0.7);
  x.fillStyle = shade('#a37a5a', -0.3);
  x.fillRect(w * T - T * 1.25, toitHaut - T * 0.5, T * 0.5, T * 0.12);
};

function caisse(x: CanvasRenderingContext2D, T: number) {
  ombre(x, T, 1, 1);
  x.fillStyle = PAL.bois;
  x.fillRect(T * 0.12, T * 0.1, T * 0.76, T * 0.78);
  x.strokeStyle = PAL.boisFonce;
  x.lineWidth = T * 0.06;
  x.strokeRect(T * 0.12, T * 0.1, T * 0.76, T * 0.78);
  x.beginPath();
  x.moveTo(T * 0.12, T * 0.1);
  x.lineTo(T * 0.88, T * 0.88);
  x.stroke();
}

function tonneau(x: CanvasRenderingContext2D, T: number) {
  ombre(x, T, 1, 1);
  x.fillStyle = PAL.bois;
  rondRect(x, T * 0.18, T * 0.02, T * 0.64, T * 0.86, T * 0.2);
  x.fill();
  x.fillStyle = '#5f5d70';
  x.fillRect(T * 0.18, T * 0.2, T * 0.64, T * 0.07);
  x.fillRect(T * 0.18, T * 0.62, T * 0.64, T * 0.07);
  ellipse(x, T / 2, T * 0.06, T * 0.3, T * 0.08, shade(PAL.bois, -0.25));
}

const DESSINS: Partial<Record<PropType, Dessin>> = {
  maison: maison('#d9824a'),
  maison_bleue: maison('#4f86b8'),
  caisse,
  tonneau,
  moulin: (x, T, w, h) => {
    ombre(x, T, w, h);
    const cx = (w * T) / 2;
    x.fillStyle = '#e8dcc4';
    x.beginPath();
    x.moveTo(cx - T * 1.1, h * T);
    x.lineTo(cx - T * 0.75, T * 0.2);
    x.lineTo(cx + T * 0.75, T * 0.2);
    x.lineTo(cx + T * 1.1, h * T);
    x.closePath();
    x.fill();
    x.fillStyle = rgba('#000000', 0.1);
    x.fillRect(cx + T * 0.3, T * 0.2, T * 0.8, h * T - T * 0.2);
    x.fillStyle = '#b5532a';
    x.beginPath();
    x.moveTo(cx - T * 1.0, T * 0.3);
    x.lineTo(cx, -T * 1.0);
    x.lineTo(cx + T * 1.0, T * 0.3);
    x.fill();
    x.fillStyle = PAL.boisFonce;
    rondRect(x, cx - T * 0.3, h * T - T * 0.85, T * 0.6, T * 0.85, T * 0.28);
    x.fill();
    x.fillStyle = '#ffd98a';
    disque(x, cx, T * 1.4, T * 0.18, '#ffd98a');
  },
  fanal: (x, T, w, h, actif) => {
    ombre(x, T, w, h);
    const cx = (w * T) / 2;
    // Socle de pierre.
    x.fillStyle = PAL.roche;
    rondRect(x, T * 0.1, h * T - T * 0.9, w * T - T * 0.2, T * 0.9, T * 0.15);
    x.fill();
    x.fillStyle = PAL.rocheClair;
    x.fillRect(T * 0.1, h * T - T * 0.9, w * T - T * 0.2, T * 0.14);
    // Colonne.
    x.fillStyle = '#d8cdb6';
    x.fillRect(cx - T * 0.45, T * 0.3, T * 0.9, h * T - T * 1.2);
    x.fillStyle = rgba('#000000', 0.12);
    x.fillRect(cx + T * 0.15, T * 0.3, T * 0.3, h * T - T * 1.2);
    for (let i = 0; i < 3; i++) {
      x.fillStyle = '#b5532a';
      x.fillRect(cx - T * 0.45, T * (0.8 + i * 0.75), T * 0.9, T * 0.16);
    }
    // Lanterne.
    x.fillStyle = PAL.rocheFonce;
    x.fillRect(cx - T * 0.7, T * 0.1, T * 1.4, T * 0.22);
    if (actif) {
      const g = x.createRadialGradient(cx, -T * 0.4, T * 0.1, cx, -T * 0.4, T * 1.6);
      g.addColorStop(0, rgba('#fff4c2', 0.95));
      g.addColorStop(0.3, rgba(PAL.ambre, 0.55));
      g.addColorStop(1, rgba(PAL.ambre, 0));
      x.fillStyle = g;
      x.fillRect(cx - T * 1.6, -T * 2, T * 3.2, T * 3.2);
    }
    x.fillStyle = actif ? '#fff1b8' : rgba(PAL.cristal, 0.35);
    rondRect(x, cx - T * 0.45, -T * 0.85, T * 0.9, T * 0.95, T * 0.2);
    x.fill();
    x.strokeStyle = PAL.rocheFonce;
    x.lineWidth = T * 0.06;
    x.strokeRect(cx - T * 0.45, -T * 0.85, T * 0.9, T * 0.95);
    x.fillStyle = PAL.rocheFonce;
    x.beginPath();
    x.moveTo(cx - T * 0.6, -T * 0.85);
    x.lineTo(cx, -T * 1.4);
    x.lineTo(cx + T * 0.6, -T * 0.85);
    x.fill();
  },
  puits: (x, T) => {
    ombre(x, T, 1, 1);
    x.fillStyle = PAL.roche;
    rondRect(x, T * 0.05, T * 0.3, T * 0.9, T * 0.6, T * 0.2);
    x.fill();
    ellipse(x, T / 2, T * 0.34, T * 0.4, T * 0.14, '#24324a');
    x.fillStyle = PAL.boisFonce;
    x.fillRect(T * 0.08, -T * 0.4, T * 0.08, T * 0.75);
    x.fillRect(T * 0.84, -T * 0.4, T * 0.08, T * 0.75);
    x.fillStyle = '#b5532a';
    x.beginPath();
    x.moveTo(-T * 0.05, -T * 0.3);
    x.lineTo(T / 2, -T * 0.7);
    x.lineTo(T * 1.05, -T * 0.3);
    x.fill();
  },
  panneau: (x, T) => {
    ellipse(x, T / 2, T * 0.88, T * 0.2, T * 0.07, rgba('#000000', 0.2));
    x.fillStyle = PAL.boisFonce;
    x.fillRect(T * 0.45, T * 0.2, T * 0.1, T * 0.7);
    x.fillStyle = PAL.bois;
    rondRect(x, T * 0.1, T * 0.05, T * 0.8, T * 0.4, T * 0.06);
    x.fill();
    x.fillStyle = PAL.boisFonce;
    for (let i = 0; i < 2; i++) x.fillRect(T * 0.2, T * (0.16 + i * 0.12), T * 0.6, T * 0.04);
  },
  barriere: (x, T, w) => {
    x.fillStyle = PAL.bois;
    x.fillRect(0, T * 0.35, w * T, T * 0.1);
    x.fillRect(0, T * 0.6, w * T, T * 0.1);
    for (let i = 0; i <= w; i++) x.fillRect(i * T - T * 0.05, T * 0.2, T * 0.1, T * 0.7);
  },
  rocher: (x, T) => {
    ombre(x, T, 1, 1);
    ellipse(x, T / 2, T * 0.55, T * 0.42, T * 0.36, PAL.roche);
    ellipse(x, T * 0.4, T * 0.42, T * 0.22, T * 0.14, PAL.rocheClair);
  },
  lit: (x, T, w, h) => {
    x.fillStyle = PAL.boisFonce;
    rondRect(x, T * 0.06, 0, w * T - T * 0.12, h * T - T * 0.05, T * 0.1);
    x.fill();
    x.fillStyle = '#fff6e5';
    rondRect(x, T * 0.14, T * 0.1, w * T - T * 0.28, T * 0.4, T * 0.12);
    x.fill();
    x.fillStyle = '#4f86b8';
    rondRect(x, T * 0.12, T * 0.55, w * T - T * 0.24, h * T - T * 0.7, T * 0.1);
    x.fill();
    x.fillStyle = rgba('#ffffff', 0.25);
    for (let i = 0; i < 3; i++) x.fillRect(T * 0.12, T * (0.8 + i * 0.3), w * T - T * 0.24, T * 0.05);
  },
  table: (x, T, w, h) => {
    ombre(x, T, w, h);
    x.fillStyle = PAL.boisFonce;
    x.fillRect(T * 0.15, T * 0.4, T * 0.1, T * 0.5);
    x.fillRect(w * T - T * 0.25, T * 0.4, T * 0.1, T * 0.5);
    x.fillStyle = PAL.bois;
    rondRect(x, T * 0.05, T * 0.1, w * T - T * 0.1, T * 0.45, T * 0.08);
    x.fill();
    disque(x, T * 0.4, T * 0.28, T * 0.1, '#ffffff');
    disque(x, T * 0.62, T * 0.25, T * 0.07, PAL.ambre);
  },
  etagere: (x, T, w) => {
    x.fillStyle = PAL.boisFonce;
    x.fillRect(T * 0.05, -T * 0.6, w * T - T * 0.1, T * 1.5);
    const livres = ['#a3423a', '#4f86b8', '#4f8f4a', '#f2b84b', '#8a4f7d'];
    for (let r = 0; r < 3; r++) {
      x.fillStyle = PAL.bois;
      x.fillRect(T * 0.1, -T * 0.55 + r * T * 0.48, w * T - T * 0.2, T * 0.42);
      for (let i = 0; i < w * 5; i++) {
        x.fillStyle = livres[(i * 7 + r * 3) % livres.length]!;
        x.fillRect(T * 0.14 + i * T * 0.17, -T * 0.5 + r * T * 0.48 + (i % 3) * T * 0.03, T * 0.13, T * 0.34);
      }
    }
  },
  cheminee: (x, T, w) => {
    x.fillStyle = PAL.roche;
    x.fillRect(0, -T * 0.8, w * T, T * 1.75);
    x.fillStyle = PAL.rocheClair;
    x.fillRect(-T * 0.08, -T * 0.85, w * T + T * 0.16, T * 0.18);
    x.fillStyle = '#1d1420';
    rondRect(x, T * 0.3, T * 0.0, w * T - T * 0.6, T * 0.85, T * 0.3);
    x.fill();
    const g = x.createRadialGradient((w * T) / 2, T * 0.7, 2, (w * T) / 2, T * 0.7, T * 0.6);
    g.addColorStop(0, '#fff1a8');
    g.addColorStop(0.4, '#f28a3a');
    g.addColorStop(1, rgba('#f28a3a', 0));
    x.fillStyle = g;
    x.fillRect(T * 0.3, T * 0.1, w * T - T * 0.6, T * 0.75);
  },
  comptoir: (x, T, w) => {
    ombre(x, T, w, 1);
    x.fillStyle = PAL.boisFonce;
    x.fillRect(0, T * 0.25, w * T, T * 0.7);
    x.fillStyle = PAL.bois;
    x.fillRect(-T * 0.05, T * 0.1, w * T + T * 0.1, T * 0.22);
    disque(x, T * 0.5, T * 0.05, T * 0.12, '#8fe3ff');
    disque(x, T * 1.5, T * 0.04, T * 0.1, '#f08a7e');
  },
  barque: (x, T) => {
    ellipse(x, T / 2, T * 0.6, T * 0.48, T * 0.3, PAL.boisFonce);
    ellipse(x, T / 2, T * 0.55, T * 0.38, T * 0.2, PAL.bois);
  },
  statue: (x, T) => {
    ombre(x, T, 1, 1);
    x.fillStyle = PAL.rocheClair;
    x.fillRect(T * 0.15, T * 0.5, T * 0.7, T * 0.4);
    ellipse(x, T / 2, T * 0.1, T * 0.22, T * 0.42, PAL.rocheClair);
    disque(x, T / 2, -T * 0.4, T * 0.17, PAL.rocheClair);
  },
  autel: (x, T, w, h, actif) => {
    ombre(x, T, w, h);
    x.fillStyle = PAL.rocheFonce;
    rondRect(x, T * 0.1, T * 0.3, w * T - T * 0.2, h * T - T * 0.4, T * 0.15);
    x.fill();
    x.fillStyle = PAL.roche;
    rondRect(x, T * 0.25, T * 0.1, w * T - T * 0.5, T * 0.6, T * 0.12);
    x.fill();
    if (!actif) {
      const cx = (w * T) / 2;
      const g = x.createRadialGradient(cx, -T * 0.1, 2, cx, -T * 0.1, T * 1.2);
      g.addColorStop(0, rgba(PAL.cristal, 0.85));
      g.addColorStop(1, rgba(PAL.cristal, 0));
      x.fillStyle = g;
      x.fillRect(cx - T * 1.2, -T * 1.3, T * 2.4, T * 2.4);
      x.fillStyle = '#d9f6ff';
      x.beginPath();
      x.moveTo(cx, -T * 0.6);
      x.lineTo(cx + T * 0.22, -T * 0.1);
      x.lineTo(cx, T * 0.3);
      x.lineTo(cx - T * 0.22, -T * 0.1);
      x.fill();
    }
  },
  levier: (x, T, _w, _h, actif) => {
    ombre(x, T, 1, 1);
    x.fillStyle = PAL.rocheFonce;
    rondRect(x, T * 0.2, T * 0.55, T * 0.6, T * 0.35, T * 0.08);
    x.fill();
    x.strokeStyle = PAL.boisFonce;
    x.lineWidth = T * 0.1;
    x.lineCap = 'round';
    x.beginPath();
    x.moveTo(T / 2, T * 0.62);
    x.lineTo(T * (actif ? 0.85 : 0.2), T * (actif ? 0.45 : 0.05));
    x.stroke();
    disque(x, T * (actif ? 0.85 : 0.2), T * (actif ? 0.45 : 0.05), T * 0.12, actif ? PAL.cristal : '#e86a6a');
  },
  grille: (x, T, w) => {
    x.fillStyle = '#3b3f5c';
    x.fillRect(0, -T * 0.4, w * T, T * 0.15);
    x.fillStyle = '#7d8099';
    for (let i = 0; i < w * 4; i++) x.fillRect(T * 0.08 + i * T * 0.25, -T * 0.3, T * 0.08, T * 1.25);
    x.fillRect(0, T * 0.3, w * T, T * 0.08);
  },
  lanterne: (x, T) => {
    x.fillStyle = PAL.rocheFonce;
    x.fillRect(T * 0.46, -T * 0.2, T * 0.08, T * 1.1);
    const g = x.createRadialGradient(T / 2, -T * 0.25, 1, T / 2, -T * 0.25, T * 0.7);
    g.addColorStop(0, rgba('#fff1b8', 0.9));
    g.addColorStop(1, rgba(PAL.ambre, 0));
    x.fillStyle = g;
    x.fillRect(-T * 0.2, -T * 1, T * 1.4, T * 1.5);
    rondRect(x, T * 0.32, -T * 0.45, T * 0.36, T * 0.42, T * 0.08);
    x.fillStyle = '#ffd98a';
    x.fill();
  },
  grand_arbre: (x, T) => {
    ellipse(x, T / 2, T * 0.85, T * 1.3, T * 0.4, rgba('#1d3b2a', 0.3));
    x.fillStyle = PAL.tronc;
    x.beginPath();
    x.moveTo(T * 0.15, T * 0.9);
    x.quadraticCurveTo(T * 0.35, T * 0.2, T * 0.3, -T * 0.8);
    x.lineTo(T * 0.7, -T * 0.8);
    x.quadraticCurveTo(T * 0.65, T * 0.2, T * 0.85, T * 0.9);
    x.fill();
    for (const [dx, dy, r, c] of [
      [-0.7, -1.2, 0.8, PAL.feuillageFonce],
      [1.7, -1.2, 0.8, PAL.feuillageFonce],
      [0.5, -1.7, 1.05, PAL.feuillage],
      [-0.2, -1.9, 0.6, PAL.feuillageClair],
      [1.2, -1.95, 0.55, PAL.feuillageClair],
    ] as const)
      disque(x, dx * T, dy * T, r * T, c);
  },
  etal: (x, T, w) => {
    ombre(x, T, w, 1);
    x.fillStyle = PAL.bois;
    x.fillRect(T * 0.05, T * 0.35, w * T - T * 0.1, T * 0.55);
    x.fillStyle = PAL.boisFonce;
    x.fillRect(T * 0.05, -T * 0.7, T * 0.1, T * 1.05);
    x.fillRect(w * T - T * 0.15, -T * 0.7, T * 0.1, T * 1.05);
    const fruits = ['#e86a6a', '#f2b84b', '#7fb069', '#b9a3f0'];
    for (let i = 0; i < w * 3; i++) disque(x, T * 0.25 + i * T * 0.3, T * 0.32, T * 0.12, fruits[i % fruits.length]!);
    for (let i = 0; i < w * 2; i++) {
      x.fillStyle = i % 2 ? '#fff6e5' : '#c94f5a';
      x.beginPath();
      x.moveTo(-T * 0.1 + i * (T / 2), -T * 0.8);
      x.lineTo(-T * 0.1 + (i + 1) * (T / 2), -T * 0.8);
      x.lineTo(-T * 0.1 + (i + 1) * (T / 2) + T * 0.04, -T * 0.4);
      x.quadraticCurveTo(-T * 0.1 + (i + 0.5) * (T / 2), -T * 0.25, -T * 0.1 + i * (T / 2) - T * 0.04, -T * 0.4);
      x.fill();
    }
  },
  enclume: (x, T) => {
    ombre(x, T, 1, 1);
    x.fillStyle = '#3b3f5c';
    x.fillRect(T * 0.3, T * 0.45, T * 0.4, T * 0.45);
    rondRect(x, T * 0.05, T * 0.2, T * 0.9, T * 0.3, T * 0.1);
    x.fill();
    x.fillStyle = rgba('#ffffff', 0.25);
    x.fillRect(T * 0.12, T * 0.22, T * 0.7, T * 0.05);
  },
  navire: (x, T, w, h) => {
    const cx = (w * T) / 2;
    const large = Math.max(w, 2.2) * T;
    // Ballon.
    ellipse(x, cx, -T * 1.6, large * 0.55, T * 0.75, '#e8dcc4');
    for (let i = -2; i <= 2; i++) {
      x.strokeStyle = rgba('#b5532a', 0.6);
      x.lineWidth = T * 0.06;
      x.beginPath();
      x.ellipse(cx, -T * 1.6, Math.abs(i) * large * 0.12 + 1, T * 0.75, 0, 0, Math.PI * 2);
      x.stroke();
    }
    x.strokeStyle = PAL.boisFonce;
    x.lineWidth = T * 0.04;
    for (const o of [-0.4, 0.4]) {
      x.beginPath();
      x.moveTo(cx + o * large, -T * 1.1);
      x.lineTo(cx + o * large * 0.8, h * T - T * 0.7);
      x.stroke();
    }
    // Coque.
    x.fillStyle = PAL.boisFonce;
    x.beginPath();
    x.moveTo(cx - large * 0.6, h * T - T * 0.75);
    x.lineTo(cx + large * 0.65, h * T - T * 0.85);
    x.quadraticCurveTo(cx + large * 0.45, h * T + T * 0.1, cx - large * 0.4, h * T);
    x.closePath();
    x.fill();
    x.fillStyle = PAL.bois;
    x.fillRect(cx - large * 0.55, h * T - T * 0.78, large * 1.15, T * 0.14);
    x.fillStyle = PAL.ambre;
    for (let i = 0; i < 3; i++) disque(x, cx - large * 0.3 + i * large * 0.3, h * T - T * 0.45, T * 0.08, PAL.ambre);
  },
  porte_grotte: (x, T, w, h) => {
    x.fillStyle = PAL.rocheFonce;
    x.beginPath();
    x.moveTo(-T * 0.2, h * T);
    x.quadraticCurveTo(-T * 0.1, -T * 0.8, (w * T) / 2, -T * 0.9);
    x.quadraticCurveTo(w * T + T * 0.1, -T * 0.8, w * T + T * 0.2, h * T);
    x.fill();
    x.fillStyle = '#0b0c16';
    x.beginPath();
    x.moveTo(T * 0.5, h * T);
    x.quadraticCurveTo(T * 0.6, -T * 0.1, (w * T) / 2, -T * 0.2);
    x.quadraticCurveTo(w * T - T * 0.6, -T * 0.1, w * T - T * 0.5, h * T);
    x.fill();
  },
  cristaux: (x, T) => {
    const g = x.createRadialGradient(T / 2, T * 0.4, 1, T / 2, T * 0.4, T * 0.8);
    g.addColorStop(0, rgba(PAL.cristal, 0.6));
    g.addColorStop(1, rgba(PAL.cristal, 0));
    x.fillStyle = g;
    x.fillRect(-T * 0.3, -T * 0.4, T * 1.6, T * 1.6);
    x.fillStyle = '#5fc4e8';
    x.beginPath();
    x.moveTo(T * 0.3, T * 0.85);
    x.lineTo(T * 0.45, -T * 0.1);
    x.lineTo(T * 0.62, T * 0.85);
    x.fill();
  },
  herbe_lune: (x, T) => {
    const g = x.createRadialGradient(T / 2, T * 0.5, 1, T / 2, T * 0.5, T * 0.7);
    g.addColorStop(0, rgba('#d9f6ff', 0.7));
    g.addColorStop(1, rgba('#b9a3f0', 0));
    x.fillStyle = g;
    x.fillRect(-T * 0.2, -T * 0.2, T * 1.4, T * 1.4);
    x.strokeStyle = PAL.herbeFonce;
    x.lineWidth = T * 0.05;
    for (const d of [-0.2, 0, 0.2]) {
      x.beginPath();
      x.moveTo(T / 2, T * 0.85);
      x.quadraticCurveTo(T * (0.5 + d), T * 0.5, T * (0.5 + d * 1.6), T * 0.3);
      x.stroke();
      disque(x, T * (0.5 + d * 1.6), T * 0.28, T * 0.08, '#e9e2ff');
    }
  },
  mat: (x, T) => {
    x.fillStyle = PAL.boisFonce;
    x.fillRect(T * 0.44, -T * 2, T * 0.12, T * 2.9);
    x.fillStyle = '#efe6d2';
    x.beginPath();
    x.moveTo(T * 0.56, -T * 1.8);
    x.quadraticCurveTo(T * 1.4, -T * 1.2, T * 0.56, -T * 0.4);
    x.fill();
  },
  filet: (x, T, w) => {
    x.strokeStyle = '#c9b58a';
    x.lineWidth = T * 0.03;
    for (let i = 0; i <= w * 4; i++) {
      x.beginPath();
      x.moveTo(i * T * 0.25, 0);
      x.lineTo(i * T * 0.25 + T * 0.2, T * 0.9);
      x.stroke();
    }
  },
  tente: (x, T, w) => {
    ombre(x, T, w, 1);
    x.fillStyle = '#c94f5a';
    x.beginPath();
    x.moveTo(-T * 0.1, T * 0.95);
    x.lineTo((w * T) / 2, -T * 0.6);
    x.lineTo(w * T + T * 0.1, T * 0.95);
    x.fill();
    x.fillStyle = '#3a2430';
    x.beginPath();
    x.moveTo((w * T) / 2 - T * 0.3, T * 0.95);
    x.lineTo((w * T) / 2, T * 0.1);
    x.lineTo((w * T) / 2 + T * 0.3, T * 0.95);
    x.fill();
  },
  souche: (x, T) => {
    ombre(x, T, 1, 1);
    x.fillStyle = PAL.tronc;
    x.fillRect(T * 0.2, T * 0.35, T * 0.6, T * 0.5);
    ellipse(x, T / 2, T * 0.35, T * 0.3, T * 0.12, '#c9a06a');
  },
};

/** Coffre fermé ou ouvert (une case). */
export function spriteCoffre(T: number, ouvert: boolean): SpriteProp {
  const k = `coffre:${T}:${ouvert ? 1 : 0}`;
  const deja = cache.get(k);
  if (deja) return deja;
  const c = toile(T * 3, T * 4);
  const x = ctx2d(c);
  x.translate(T, 3 * T);
  ombre(x, T, 1, 1);
  x.fillStyle = '#8a5a2e';
  rondRect(x, T * 0.12, T * 0.38, T * 0.76, T * 0.5, T * 0.06);
  x.fill();
  x.fillStyle = PAL.ambre;
  x.fillRect(T * 0.12, T * 0.52, T * 0.76, T * 0.06);
  if (ouvert) {
    x.fillStyle = '#2b1d16';
    x.fillRect(T * 0.16, T * 0.3, T * 0.68, T * 0.12);
    x.fillStyle = '#a8743f';
    rondRect(x, T * 0.12, T * 0.02, T * 0.76, T * 0.3, T * 0.1);
    x.fill();
  } else {
    x.fillStyle = '#a8743f';
    rondRect(x, T * 0.1, T * 0.16, T * 0.8, T * 0.3, T * 0.14);
    x.fill();
    x.fillStyle = PAL.ambre;
    x.fillRect(T * 0.44, T * 0.3, T * 0.12, T * 0.2);
    x.fillStyle = rgba('#ffffff', 0.3);
    x.fillRect(T * 0.18, T * 0.2, T * 0.5, T * 0.04);
  }
  const s = { canvas: c, ox: -T, oy: -3 * T };
  cache.set(k, s);
  return s;
}
