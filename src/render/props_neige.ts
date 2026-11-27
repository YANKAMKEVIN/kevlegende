// Décors des Cimes de Givre : chalets, bonshommes de neige, braseros, yacks, glace et blizzard.
import type { PropType } from '../core/world/mapdef';
import { PAL } from './palette';
import type { Dessin } from './props';
import { ombre } from './props';
import { disque, ellipse, rgba, rondRect, shade } from './util';

const NEIGE = '#f4f8fc';
const BOIS = '#7a4f34';

/** Neige posée sur un rebord : bande ondulée. */
function chape(x: CanvasRenderingContext2D, x0: number, y0: number, larg: number, ep: number) {
  x.fillStyle = NEIGE;
  x.beginPath();
  x.moveTo(x0, y0);
  x.lineTo(x0 + larg, y0);
  const n = Math.max(2, Math.round(larg / (ep * 2.4)));
  for (let i = n; i > 0; i--) x.quadraticCurveTo(x0 + (larg * (i - 0.5)) / n, y0 + ep * (i % 2 ? 1.5 : 1.1), x0 + (larg * (i - 1)) / n, y0 + ep * 0.6);
  x.closePath();
  x.fill();
}

export const NEIGES: Partial<Record<PropType, Dessin>> = {
  chalet: (x, T, w, h, _a, portes) => {
    ombre(x, T, w, h);
    const murH = T * 1.5;
    const murY = h * T - murH;
    // Rondins.
    for (let i = 0; i < 5; i++) {
      x.fillStyle = shade(BOIS, (i % 2 ? -0.06 : 0.04));
      rondRect(x, T * 0.08, murY + (i * murH) / 5, w * T - T * 0.16, murH / 5 + 1, T * 0.08);
      x.fill();
    }
    for (const bx of [T * 0.08, w * T - T * 0.24]) {
      x.fillStyle = shade(BOIS, -0.25);
      x.fillRect(bx, murY, T * 0.16, murH);
    }
    // Toit pentu chargé de neige.
    const toitY = murY - T * 1.35;
    x.fillStyle = '#5a3a2a';
    x.beginPath();
    x.moveTo(-T * 0.2, murY + T * 0.1);
    x.lineTo((w * T) / 2, toitY);
    x.lineTo(w * T + T * 0.2, murY + T * 0.1);
    x.closePath();
    x.fill();
    x.fillStyle = NEIGE;
    x.beginPath();
    x.moveTo(-T * 0.22, murY + T * 0.02);
    x.lineTo((w * T) / 2, toitY - T * 0.08);
    x.lineTo(w * T + T * 0.22, murY + T * 0.02);
    for (let i = 8; i >= 0; i--) x.quadraticCurveTo(-T * 0.22 + ((w * T + T * 0.44) * (i + 0.5)) / 9, murY + T * (i % 2 ? 0.28 : 0.18), -T * 0.22 + ((w * T + T * 0.44) * i) / 9, murY + T * 0.08);
    x.closePath();
    x.fill();
    x.fillStyle = rgba('#a9c2df', 0.6);
    x.beginPath();
    x.moveTo((w * T) / 2, toitY);
    x.lineTo(w * T + T * 0.2, murY + T * 0.02);
    x.lineTo((w * T) / 2 + T * 0.3, murY);
    x.fill();
    // Cheminée qui fume.
    x.fillStyle = '#6b6f7a';
    x.fillRect(w * T * 0.68, toitY + T * 0.3, T * 0.3, T * 0.6);
    chape(x, w * T * 0.66, toitY + T * 0.28, T * 0.34, T * 0.06);
    for (let i = 0; i < 3; i++) disque(x, w * T * 0.72 + i * T * 0.12, toitY + T * (0.05 - i * 0.28), T * (0.12 + i * 0.05), rgba('#e8eef6', 0.6 - i * 0.15));
    // Fenêtres chaudes et volets.
    for (let i = 0; i < w; i++) {
      if (portes.includes(i)) continue;
      const fx = i * T + T * 0.28;
      const fy = murY + T * 0.35;
      x.fillStyle = '#c94f3a';
      x.fillRect(fx - T * 0.1, fy, T * 0.08, T * 0.44);
      x.fillRect(fx + T * 0.46, fy, T * 0.08, T * 0.44);
      x.fillStyle = '#ffcf6a';
      x.fillRect(fx, fy, T * 0.44, T * 0.44);
      x.fillStyle = BOIS;
      x.fillRect(fx + T * 0.2, fy, T * 0.04, T * 0.44);
      x.fillRect(fx, fy + T * 0.2, T * 0.44, T * 0.04);
      chape(x, fx - T * 0.1, fy - T * 0.02, T * 0.64, T * 0.05);
    }
    for (const p of portes) {
      x.fillStyle = '#4a2f20';
      rondRect(x, p * T + T * 0.2, h * T - T * 0.95, T * 0.6, T * 0.95, T * 0.12);
      x.fill();
      disque(x, p * T + T * 0.68, h * T - T * 0.5, T * 0.04, PAL.ambre);
    }
  },
  bonhomme: (x, T) => {
    ombre(x, T, 1, 1);
    disque(x, T * 0.5, T * 0.62, T * 0.32, NEIGE);
    disque(x, T * 0.5, T * 0.18, T * 0.22, NEIGE);
    ellipse(x, T * 0.58, T * 0.72, T * 0.16, T * 0.16, rgba('#a9c2df', 0.45));
    disque(x, T * 0.43, T * 0.13, T * 0.03, '#2b2233');
    disque(x, T * 0.57, T * 0.13, T * 0.03, '#2b2233');
    x.fillStyle = '#f08a3a';
    x.beginPath();
    x.moveTo(T * 0.5, T * 0.18);
    x.lineTo(T * 0.72, T * 0.22);
    x.lineTo(T * 0.5, T * 0.24);
    x.fill();
    x.fillStyle = '#c94f5a';
    x.fillRect(T * 0.3, T * 0.34, T * 0.4, T * 0.08);
    x.fillRect(T * 0.56, T * 0.36, T * 0.08, T * 0.22);
    x.fillStyle = '#2b2233';
    x.fillRect(T * 0.32, -T * 0.08, T * 0.36, T * 0.06);
    x.fillRect(T * 0.38, -T * 0.3, T * 0.24, T * 0.24);
  },
  brasero: (x, T, _w, _h, actif) => {
    ombre(x, T, 1, 1);
    x.fillStyle = '#4a4f5c';
    x.fillRect(T * 0.42, T * 0.35, T * 0.16, T * 0.55);
    x.fillRect(T * 0.24, T * 0.82, T * 0.52, T * 0.1);
    x.fillStyle = '#5f6675';
    x.beginPath();
    x.moveTo(T * 0.12, T * 0.15);
    x.lineTo(T * 0.88, T * 0.15);
    x.lineTo(T * 0.7, T * 0.42);
    x.lineTo(T * 0.3, T * 0.42);
    x.fill();
    if (actif) {
      const g = x.createRadialGradient(T * 0.5, T * 0.05, 2, T * 0.5, T * 0.05, T * 1.1);
      g.addColorStop(0, rgba('#ffd27a', 0.55));
      g.addColorStop(1, rgba('#ff8a3a', 0));
      x.fillStyle = g;
      x.fillRect(-T * 0.6, -T * 1.1, T * 2.2, T * 2.2);
      for (const [c, s] of [['#e8562f', 1], ['#f5a03a', 0.7], ['#ffe39a', 0.4]] as const) {
        x.fillStyle = c;
        x.beginPath();
        x.moveTo(T * (0.5 - 0.3 * s), T * 0.16);
        x.quadraticCurveTo(T * (0.5 - 0.25 * s), -T * 0.3 * s, T * 0.5, -T * 0.55 * s);
        x.quadraticCurveTo(T * (0.5 + 0.25 * s), -T * 0.3 * s, T * (0.5 + 0.3 * s), T * 0.16);
        x.fill();
      }
    } else {
      chape(x, T * 0.12, T * 0.12, T * 0.76, T * 0.06);
      for (let i = 0; i < 3; i++) disque(x, T * (0.35 + i * 0.15), T * 0.12, T * 0.05, '#3a3a44');
    }
  },
  statue_glace: (x, T, _w, h) => {
    ombre(x, T, 1, 1);
    const haut = h > 1 ? T * 2.2 : T * 1.4;
    x.fillStyle = '#8a93a6';
    x.fillRect(T * 0.14, T * 0.72, T * 0.72, T * 0.2);
    const g = x.createLinearGradient(0, T * 0.72 - haut, 0, T * 0.72);
    g.addColorStop(0, '#e6f7ff');
    g.addColorStop(1, '#7fb8dc');
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(T * 0.22, T * 0.72);
    x.lineTo(T * 0.3, T * 0.72 - haut * 0.55);
    x.lineTo(T * 0.5, T * 0.72 - haut);
    x.lineTo(T * 0.7, T * 0.72 - haut * 0.55);
    x.lineTo(T * 0.78, T * 0.72);
    x.fill();
    disque(x, T * 0.5, T * 0.72 - haut * 0.78, T * 0.14, '#d9f2ff');
    x.strokeStyle = rgba('#ffffff', 0.7);
    x.lineWidth = T * 0.04;
    x.beginPath();
    x.moveTo(T * 0.36, T * 0.6);
    x.lineTo(T * 0.44, T * 0.72 - haut * 0.7);
    x.stroke();
  },
  yak: (x, T) => {
    ombre(x, T, 1, 1);
    x.fillStyle = '#4a3a30';
    for (const lx of [0.22, 0.36, 0.62, 0.76]) x.fillRect(T * lx, T * 0.55, T * 0.09, T * 0.35);
    ellipse(x, T * 0.5, T * 0.48, T * 0.42, T * 0.26, '#6b5040');
    // Longue toison.
    x.fillStyle = '#5a4234';
    for (let i = 0; i < 8; i++) x.fillRect(T * (0.12 + i * 0.1), T * 0.5, T * 0.07, T * (0.22 + (i % 3) * 0.05));
    ellipse(x, T * 0.5, T * 0.34, T * 0.34, T * 0.1, rgba(NEIGE, 0.85));
    disque(x, T * 0.86, T * 0.42, T * 0.16, '#4a3a30');
    x.strokeStyle = '#efe3c8';
    x.lineWidth = T * 0.05;
    x.lineCap = 'round';
    x.beginPath();
    x.moveTo(T * 0.8, T * 0.3);
    x.quadraticCurveTo(T * 0.72, T * 0.14, T * 0.82, T * 0.1);
    x.moveTo(T * 0.94, T * 0.3);
    x.quadraticCurveTo(T * 1.04, T * 0.14, T * 0.96, T * 0.1);
    x.stroke();
    disque(x, T * 0.9, T * 0.4, T * 0.025, '#1d1a22');
    disque(x, T * 0.5, T * 0.2, T * 0.05, '#c94f5a');
  },
  traineau: (x, T, w, h) => {
    ombre(x, T, w, h);
    x.strokeStyle = '#3a2a22';
    x.lineWidth = T * 0.06;
    x.beginPath();
    x.moveTo(T * 0.1, h * T - T * 0.15);
    x.lineTo(w * T - T * 0.1, h * T - T * 0.15);
    x.quadraticCurveTo(w * T + T * 0.15, h * T - T * 0.2, w * T + T * 0.05, h * T - T * 0.5);
    x.stroke();
    x.fillStyle = BOIS;
    rondRect(x, T * 0.12, h * T - T * 0.75, w * T - T * 0.3, T * 0.5, T * 0.08);
    x.fill();
    x.fillStyle = '#c94f5a';
    rondRect(x, T * 0.25, h * T - T * 1.05, w * T - T * 0.6, T * 0.36, T * 0.12);
    x.fill();
    chape(x, T * 0.25, h * T - T * 1.07, w * T - T * 0.6, T * 0.06);
  },
  bloc_glace: (x, T, w, h) => {
    ombre(x, T, w, h);
    const g = x.createLinearGradient(0, -T * 0.6, 0, h * T);
    g.addColorStop(0, '#e9f8ff');
    g.addColorStop(1, '#79b4da');
    x.fillStyle = g;
    rondRect(x, T * 0.04, -T * 0.6, w * T - T * 0.08, h * T + T * 0.52, T * 0.12);
    x.fill();
    x.strokeStyle = rgba('#ffffff', 0.75);
    x.lineWidth = T * 0.05;
    for (let i = 0; i < w; i++) {
      x.beginPath();
      x.moveTo(i * T + T * 0.25, -T * 0.4);
      x.lineTo(i * T + T * 0.15, h * T - T * 0.4);
      x.stroke();
    }
    x.strokeStyle = rgba('#4f7aa6', 0.45);
    x.lineWidth = T * 0.03;
    x.strokeRect(T * 0.04, -T * 0.6, w * T - T * 0.08, h * T + T * 0.52);
  },
  blizzard: (x, T, w, h) => {
    for (let i = 0; i < 8; i++) {
      const cx = (w * T * ((i * 37) % 10)) / 10;
      const cy = (h * T * ((i * 53) % 10)) / 10 - T;
      const g = x.createRadialGradient(cx, cy, 2, cx, cy, T * 1.7);
      g.addColorStop(0, rgba('#ffffff', 0.9));
      g.addColorStop(1, rgba('#c9d8f0', 0));
      x.fillStyle = g;
      x.fillRect(-T, -T * 2.5, (w + 2) * T, (h + 3) * T);
    }
    x.strokeStyle = rgba('#8aa6cc', 0.55);
    x.lineWidth = T * 0.05;
    for (let i = 0; i < 6; i++) {
      x.beginPath();
      x.moveTo(-T * 0.5, h * T * (i / 6) - T * 0.6);
      x.quadraticCurveTo((w * T) / 2, h * T * (i / 6) - T * 1.1, w * T + T * 0.5, h * T * (i / 6) - T * 0.4);
      x.stroke();
    }
  },
  coeur_glace: (x, T, w, h, actif) => {
    ombre(x, T, w, h);
    const cx = (w * T) / 2;
    const base = h * T - T * 0.1;
    const g = x.createRadialGradient(cx, base - T * 1.2, 4, cx, base - T * 1.2, T * 1.6);
    g.addColorStop(0, rgba(actif ? '#ffd98a' : '#bfe6ff', 0.6));
    g.addColorStop(1, rgba('#bfe6ff', 0));
    x.fillStyle = g;
    x.fillRect(cx - T * 1.8, base - T * 3, T * 3.6, T * 3.2);
    // Grand cristal à facettes.
    const faces: [number, string][] = [[-1, '#8cc6ea'], [1, '#cdeeff']];
    for (const [s, c] of faces) {
      x.fillStyle = c;
      x.beginPath();
      x.moveTo(cx, base);
      x.lineTo(cx + s * T * 0.8, base - T * 1.1);
      x.lineTo(cx, base - T * 2.4);
      x.fill();
    }
    if (actif) {
      disque(x, cx, base - T * 1.1, T * 0.3, '#ffcf6a');
      disque(x, cx, base - T * 1.1, T * 0.16, '#fff3c4');
    } else {
      // Silhouette prisonnière.
      ellipse(x, cx, base - T * 1.35, T * 0.14, T * 0.16, rgba('#3a4a6a', 0.55));
      x.fillStyle = rgba('#3a4a6a', 0.45);
      x.fillRect(cx - T * 0.16, base - T * 1.2, T * 0.32, T * 0.7);
    }
    x.strokeStyle = rgba('#ffffff', 0.8);
    x.lineWidth = T * 0.04;
    x.beginPath();
    x.moveTo(cx - T * 0.3, base - T * 0.5);
    x.lineTo(cx - T * 0.1, base - T * 2);
    x.stroke();
  },
};
