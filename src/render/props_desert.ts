// Décors du désert d'Ambre : maisons de terre, obélisques, jarres, miroirs solaires, tempête.
import type { PropType } from '../core/world/mapdef';
import { PAL } from './palette';
import type { Dessin } from './props';
import { ombre } from './props';
import { disque, ellipse, rgba, rondRect, shade } from './util';

const OCRE = '#e2b57a';

export const DESERT: Partial<Record<PropType, Dessin>> = {
  maison_ocre: (x, T, w, h, _a, portes) => {
    ombre(x, T, w, h);
    const murH = T * (h > 2 ? 2.1 : 1.6);
    const murY = h * T - murH;
    // Murs de terre aux angles arrondis.
    x.fillStyle = OCRE;
    rondRect(x, T * 0.08, murY, w * T - T * 0.16, murH, T * 0.18);
    x.fill();
    x.fillStyle = shade(OCRE, -0.18);
    x.fillRect(T * 0.08, h * T - T * 0.22, w * T - T * 0.16, T * 0.22);
    // Toit-terrasse avec rebord et poutres saillantes.
    x.fillStyle = shade(OCRE, 0.12);
    rondRect(x, -T * 0.02, murY - T * 0.28, w * T + T * 0.04, T * 0.34, T * 0.1);
    x.fill();
    x.fillStyle = shade(OCRE, -0.1);
    x.fillRect(-T * 0.02, murY + T * 0.02, w * T + T * 0.04, T * 0.06);
    x.fillStyle = PAL.boisFonce;
    for (let i = 0; i < w; i++) x.fillRect(i * T + T * 0.42, murY + T * 0.1, T * 0.16, T * 0.1);
    // Fenêtres en arc et auvent rayé.
    for (let i = 0; i < w; i++) {
      if (portes.includes(i)) continue;
      const fx = i * T + T * 0.3;
      const fy = murY + T * 0.55;
      x.fillStyle = '#5a3a28';
      x.beginPath();
      x.moveTo(fx, fy + T * 0.45);
      x.lineTo(fx, fy + T * 0.15);
      x.arc(fx + T * 0.2, fy + T * 0.15, T * 0.2, Math.PI, 0);
      x.lineTo(fx + T * 0.4, fy + T * 0.45);
      x.fill();
      x.fillStyle = rgba('#ffd98a', 0.85);
      x.fillRect(fx + T * 0.06, fy + T * 0.2, T * 0.28, T * 0.2);
    }
    const aw = Math.min(w, 2) * T;
    for (let i = 0; i < 6; i++) {
      x.fillStyle = i % 2 ? '#f6ecd8' : '#c94f5a';
      x.fillRect((w * T - aw) / 2 + (i * aw) / 6, h * T - T * 1.25, aw / 6 + 1, T * 0.22);
    }
    for (const p of portes) {
      x.fillStyle = '#4a2f20';
      rondRect(x, p * T + T * 0.18, h * T - T * 0.95, T * 0.64, T * 0.95, T * 0.3);
      x.fill();
    }
  },
  obelisque: (x, T) => {
    ombre(x, T, 1, 1);
    x.fillStyle = '#c99a62';
    x.beginPath();
    x.moveTo(T * 0.22, T * 0.9);
    x.lineTo(T * 0.34, -T * 1.6);
    x.lineTo(T * 0.5, -T * 1.95);
    x.lineTo(T * 0.66, -T * 1.6);
    x.lineTo(T * 0.78, T * 0.9);
    x.fill();
    x.fillStyle = rgba('#fff1d0', 0.35);
    x.beginPath();
    x.moveTo(T * 0.34, -T * 1.6);
    x.lineTo(T * 0.5, -T * 1.95);
    x.lineTo(T * 0.5, T * 0.9);
    x.lineTo(T * 0.22, T * 0.9);
    x.fill();
    x.fillStyle = PAL.ambre;
    disque(x, T * 0.5, -T * 1.1, T * 0.09, PAL.ambre);
    x.fillStyle = rgba('#5a3a28', 0.5);
    for (let i = 0; i < 4; i++) x.fillRect(T * 0.42, -T * 0.7 + i * T * 0.35, T * 0.16, T * 0.05);
  },
  jarre: (x, T) => {
    ombre(x, T, 1, 1);
    ellipse(x, T / 2, T * 0.55, T * 0.3, T * 0.34, '#c8743f');
    ellipse(x, T * 0.42, T * 0.45, T * 0.1, T * 0.16, rgba('#ffffff', 0.25));
    x.fillStyle = '#9a5530';
    x.fillRect(T * 0.36, T * 0.12, T * 0.28, T * 0.12);
    x.fillStyle = '#f2d8a7';
    x.fillRect(T * 0.22, T * 0.5, T * 0.56, T * 0.05);
  },
  miroir: (x, T, _w, _h, actif) => {
    ombre(x, T, 1, 1);
    x.fillStyle = '#7a5a3c';
    x.fillRect(T * 0.44, T * 0.1, T * 0.12, T * 0.8);
    x.fillRect(T * 0.2, T * 0.78, T * 0.6, T * 0.12);
    if (actif) {
      const g = x.createRadialGradient(T / 2, -T * 0.2, 2, T / 2, -T * 0.2, T * 1.2);
      g.addColorStop(0, rgba('#fff3c4', 0.85));
      g.addColorStop(1, rgba('#ffd27a', 0));
      x.fillStyle = g;
      x.fillRect(-T * 0.7, -T * 1.4, T * 2.4, T * 2.4);
    }
    x.save();
    x.translate(T / 2, -T * 0.2);
    x.scale(1, actif ? 1 : 0.45);
    ellipse(x, 0, 0, T * 0.42, T * 0.42, '#b8863a');
    ellipse(x, 0, 0, T * 0.34, T * 0.34, actif ? '#fff1c0' : '#8a7a5a');
    ellipse(x, -T * 0.1, -T * 0.12, T * 0.1, T * 0.06, rgba('#ffffff', actif ? 0.9 : 0.3));
    x.restore();
  },
  colonne: (x, T, _w, h) => {
    ombre(x, T, 1, 1);
    const haut = h > 1 ? T * 2.4 : T * 1.3;
    x.fillStyle = '#d8bf92';
    x.fillRect(T * 0.24, T * 0.9 - haut, T * 0.52, haut);
    x.fillStyle = rgba('#7a5a3c', 0.35);
    for (let i = 0; i < 3; i++) x.fillRect(T * (0.32 + i * 0.14), T * 0.9 - haut, T * 0.04, haut);
    x.fillStyle = '#c4a777';
    x.fillRect(T * 0.14, T * 0.8, T * 0.72, T * 0.14);
    // Chapiteau brisé.
    x.beginPath();
    x.moveTo(T * 0.14, T * 0.9 - haut);
    x.lineTo(T * 0.86, T * 0.9 - haut);
    x.lineTo(T * 0.7, T * 0.9 - haut - T * 0.18);
    x.lineTo(T * 0.45, T * 0.9 - haut - T * 0.08);
    x.lineTo(T * 0.3, T * 0.9 - haut - T * 0.2);
    x.closePath();
    x.fill();
  },
  ossements: (x, T, w, h) => {
    ombre(x, T, w, h);
    x.strokeStyle = '#efe3c8';
    x.lineCap = 'round';
    x.lineWidth = T * 0.16;
    for (let i = 0; i < w * 2; i++) {
      const bx = T * (0.3 + i * 0.5);
      x.beginPath();
      x.moveTo(bx, h * T - T * 0.1);
      x.quadraticCurveTo(bx + T * 0.35, h * T - T * 1.4, bx + T * 0.9, h * T - T * 1.6);
      x.stroke();
    }
    ellipse(x, w * T - T * 0.4, h * T - T * 0.4, T * 0.5, T * 0.35, '#f3ead6');
    disque(x, w * T - T * 0.55, h * T - T * 0.45, T * 0.09, '#3a2a22');
  },
  tourbillon: (x, T, w, h) => {
    for (let i = 0; i < 7; i++) {
      const g = x.createRadialGradient(w * T * ((i * 37) % 10) / 10, h * T * ((i * 53) % 10) / 10 - T, 2, w * T * ((i * 37) % 10) / 10, h * T * ((i * 53) % 10) / 10 - T, T * 1.6);
      g.addColorStop(0, rgba('#e7d6c0', 0.8));
      g.addColorStop(1, rgba('#b9a7c9', 0));
      x.fillStyle = g;
      x.fillRect(-T, -T * 2.5, (w + 2) * T, (h + 3) * T);
    }
    x.strokeStyle = rgba('#8a7aac', 0.6);
    x.lineWidth = T * 0.06;
    for (let i = 0; i < 5; i++) {
      x.beginPath();
      x.ellipse((w * T) / 2, h * T * (i / 5) - T * 0.4, w * T * 0.5, T * 0.3, 0.2, 0, Math.PI * 1.6);
      x.stroke();
    }
  },
  sarcophage: (x, T, w, h) => {
    ombre(x, T, w, h);
    x.fillStyle = '#b8863a';
    rondRect(x, T * 0.1, T * 0.1, w * T - T * 0.2, h * T - T * 0.2, T * 0.25);
    x.fill();
    x.fillStyle = PAL.ambre;
    rondRect(x, T * 0.25, T * 0.25, w * T - T * 0.5, h * T - T * 0.5, T * 0.2);
    x.fill();
    disque(x, (w * T) / 2, T * 0.55, T * 0.18, '#5fc4e8');
  },
};
