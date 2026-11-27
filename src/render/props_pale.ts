// Décors du Royaume Pâle : dormeurs de brume, portail scellé, cloche, trône et arbre de lune.
import type { PropType } from '../core/world/mapdef';
import type { Dessin } from './props';
import { ombre } from './props';
import { disque, ellipse, rgba, rondRect, shade } from './util';

const PIERRE = '#cfc9dc';
const OR = '#d4bf7e';
const LUNE = '#e6dcff';

/** Halo radial (lumière ou brume) centré en (cx, cy). */
function halo(x: CanvasRenderingContext2D, cx: number, cy: number, r: number, couleur: string, a: number) {
  const g = x.createRadialGradient(cx, cy, 2, cx, cy, r);
  g.addColorStop(0, rgba(couleur, a));
  g.addColorStop(1, rgba(couleur, 0));
  x.fillStyle = g;
  x.fillRect(cx - r, cy - r, r * 2, r * 2);
}

export const PALES: Partial<Record<PropType, Dessin>> = {
  // Un habitant d'Aubefonde endormi depuis des siècles, roulé en boule dans un cocon de brume.
  dormeur: (x, T, _w, h, actif) => {
    const cx = T / 2;
    const base = h * T - T * 0.12;
    ellipse(x, cx, base, T * 0.42, T * 0.12, rgba('#1c1630', 0.25));
    if (!actif) halo(x, cx, base - T * 0.3, T * 0.7, '#cfc4f2', 0.55);
    // Cape et corps assis, tête penchée.
    x.fillStyle = actif ? '#7b6aa8' : '#9a90b8';
    x.beginPath();
    x.moveTo(cx - T * 0.34, base);
    x.quadraticCurveTo(cx - T * 0.36, base - T * 0.55, cx - T * 0.05, base - T * 0.62);
    x.quadraticCurveTo(cx + T * 0.3, base - T * 0.5, cx + T * 0.34, base);
    x.fill();
    disque(x, cx + (actif ? 0 : T * 0.08), base - T * (actif ? 0.74 : 0.6), T * 0.15, actif ? '#e9c9a8' : '#c9c0dc');
    if (actif) {
      // Réveillé : regard levé, une petite flamme de la lanterne au creux des mains.
      disque(x, cx - T * 0.05, base - T * 0.76, T * 0.02, '#2a2238');
      disque(x, cx + T * 0.05, base - T * 0.76, T * 0.02, '#2a2238');
      halo(x, cx, base - T * 0.3, T * 0.4, '#ffd98a', 0.6);
      disque(x, cx, base - T * 0.3, T * 0.06, '#ffe9b0');
    } else {
      // Fils de brume enroulés autour du dormeur.
      x.strokeStyle = rgba(LUNE, 0.7);
      x.lineWidth = T * 0.04;
      for (let i = 0; i < 3; i++) {
        x.beginPath();
        x.ellipse(cx, base - T * (0.2 + i * 0.18), T * (0.4 - i * 0.06), T * 0.09, -0.15 + i * 0.1, 0, Math.PI * 2);
        x.stroke();
      }
    }
  },
  // Grand portail du palais : deux battants de brume figée, trois sceaux en arc.
  portail_pale: (x, T, w, h) => {
    ombre(x, T, w, h);
    const W = w * T;
    const base = h * T;
    const haut = base - T * 3.2;
    x.fillStyle = shade(PIERRE, -0.25);
    x.fillRect(0, haut + T * 0.5, T * 0.5, base - haut - T * 0.5);
    x.fillRect(W - T * 0.5, haut + T * 0.5, T * 0.5, base - haut - T * 0.5);
    x.fillStyle = PIERRE;
    x.beginPath();
    x.moveTo(0, haut + T * 0.6);
    x.quadraticCurveTo(W / 2, haut - T * 0.6, W, haut + T * 0.6);
    x.lineTo(W, haut + T * 1.0);
    x.quadraticCurveTo(W / 2, haut - T * 0.15, 0, haut + T * 1.0);
    x.fill();
    // Battants.
    const g = x.createLinearGradient(0, haut, 0, base);
    g.addColorStop(0, '#6c5f9a');
    g.addColorStop(1, '#3a3160');
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(T * 0.5, base);
    x.lineTo(T * 0.5, haut + T * 1.0);
    x.quadraticCurveTo(W / 2, haut + T * 0.05, W - T * 0.5, haut + T * 1.0);
    x.lineTo(W - T * 0.5, base);
    x.fill();
    x.strokeStyle = rgba('#20193a', 0.8);
    x.lineWidth = T * 0.05;
    x.beginPath();
    x.moveTo(W / 2, haut + T * 0.55);
    x.lineTo(W / 2, base);
    x.stroke();
    // Trois sceaux.
    for (let i = 0; i < 3; i++) {
      const sx = W / 2 + (i - 1) * T * 0.75;
      const sy = haut + T * (1.45 + (i === 1 ? -0.25 : 0));
      halo(x, sx, sy, T * 0.45, '#b8a6ff', 0.5);
      x.strokeStyle = LUNE;
      x.lineWidth = T * 0.05;
      x.beginPath();
      x.arc(sx, sy, T * 0.2, 0, Math.PI * 2);
      x.stroke();
      disque(x, sx, sy, T * 0.06, LUNE);
    }
    x.fillStyle = OR;
    x.fillRect(T * 0.45, base - T * 0.12, W - T * 0.9, T * 0.08);
  },
  // Cloche de bronze d'Aubefonde dans son beffroi de bois noirci.
  cloche: (x, T, w, h, actif) => {
    ombre(x, T, w, h);
    const W = w * T;
    const base = h * T;
    x.fillStyle = '#3e3448';
    x.fillRect(T * 0.1, base - T * 3, T * 0.22, T * 3);
    x.fillRect(W - T * 0.32, base - T * 3, T * 0.22, T * 3);
    x.fillRect(0, base - T * 3.1, W, T * 0.26);
    const cx = W / 2;
    const top = base - T * 2.75;
    const g = x.createLinearGradient(cx - T * 0.8, 0, cx + T * 0.8, 0);
    g.addColorStop(0, '#6a4a26');
    g.addColorStop(0.4, actif ? '#e0b060' : '#a88450');
    g.addColorStop(1, '#5a3d1f');
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(cx - T * 0.35, top);
    x.quadraticCurveTo(cx - T * 0.45, top + T * 1.0, cx - T * 0.8, top + T * 1.6);
    x.lineTo(cx + T * 0.8, top + T * 1.6);
    x.quadraticCurveTo(cx + T * 0.45, top + T * 1.0, cx + T * 0.35, top);
    x.closePath();
    x.fill();
    ellipse(x, cx, top + T * 1.6, T * 0.8, T * 0.12, '#4a3218');
    disque(x, cx, top + T * 1.62, T * 0.12, '#2e2010');
    if (!actif) {
      // Brume qui suinte du bronze : la cloche sonne le sommeil.
      x.strokeStyle = rgba(LUNE, 0.55);
      x.lineWidth = T * 0.06;
      for (let i = -1; i <= 1; i++) {
        x.beginPath();
        x.moveTo(cx + i * T * 0.4, top + T * 1.7);
        x.quadraticCurveTo(cx + i * T * 0.7, top + T * 2.2, cx + i * T * 0.5, base - T * 0.1);
        x.stroke();
      }
    } else halo(x, cx, top + T * 0.8, T * 1.2, '#ffd98a', 0.25);
  },
  // Trône du Roi Pâle : marbre blanc, dossier en couronne, coussin violet.
  trone: (x, T, w, h, actif) => {
    ombre(x, T, w, h);
    const W = w * T;
    const base = h * T;
    halo(x, W / 2, base - T * 1.6, T * 1.6, actif ? '#ffe2a0' : '#b8a6ff', 0.35);
    x.fillStyle = PIERRE;
    rondRect(x, W * 0.18, base - T * 3, W * 0.64, T * 2.4, T * 0.2);
    x.fill();
    // Pointes de la couronne.
    for (let i = 0; i < 5; i++) {
      const px = W * (0.24 + i * 0.13);
      x.beginPath();
      x.moveTo(px - T * 0.12, base - T * 2.9);
      x.lineTo(px, base - T * (3.35 + (i === 2 ? 0.25 : 0)));
      x.lineTo(px + T * 0.12, base - T * 2.9);
      x.fill();
      disque(x, px, base - T * (3.35 + (i === 2 ? 0.25 : 0)), T * 0.05, OR);
    }
    x.fillStyle = '#5b4a8a';
    rondRect(x, W * 0.27, base - T * 2.6, W * 0.46, T * 1.5, T * 0.15);
    x.fill();
    x.fillStyle = shade(PIERRE, -0.15);
    x.fillRect(W * 0.08, base - T * 1.2, W * 0.84, T * 0.5);
    x.fillRect(W * 0.12, base - T * 0.7, W * 0.76, T * 0.62);
    x.fillStyle = OR;
    x.fillRect(W * 0.08, base - T * 1.22, W * 0.84, T * 0.06);
  },
  // Arbre de lune des jardins royaux : écorce d'argent, feuillage de lumière.
  arbre_lune: (x, T, w, h, actif) => {
    ombre(x, T, w, h);
    const cx = (w * T) / 2;
    const base = h * T - T * 0.1;
    x.fillStyle = '#d8d2e6';
    x.beginPath();
    x.moveTo(cx - T * 0.4, base);
    x.quadraticCurveTo(cx - T * 0.1, base - T * 1.0, cx - T * 0.2, base - T * 1.8);
    x.lineTo(cx + T * 0.2, base - T * 1.8);
    x.quadraticCurveTo(cx + T * 0.1, base - T * 1.0, cx + T * 0.4, base);
    x.fill();
    x.fillStyle = rgba('#8f86ab', 0.4);
    x.fillRect(cx + T * 0.04, base - T * 1.7, T * 0.08, T * 1.6);
    const feuille = actif ? '#fff0c8' : LUNE;
    halo(x, cx, base - T * 2.4, T * 1.9, actif ? '#ffd98a' : '#b8a6ff', 0.45);
    const bulles = [[-0.7, -2.2, 0.55], [0.7, -2.2, 0.55], [0, -2.7, 0.7], [-0.35, -3.05, 0.45], [0.4, -3.0, 0.42]];
    for (const [dx, dy, r] of bulles) disque(x, cx + dx! * T, base + dy! * T, r! * T, rgba(feuille, 0.55));
    for (let i = 0; i < 14; i++) disque(x, cx + Math.cos(i * 2.3) * T * 0.9, base - T * 2.5 + Math.sin(i * 1.7) * T * 0.6, T * 0.06, rgba('#ffffff', 0.85));
  },
};
