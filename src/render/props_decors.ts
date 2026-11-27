// Décors procéduraux (mobilier, machines, navire, végétation magique) : suite du catalogue de props.ts.
import type { PropType } from '../core/world/mapdef';
import { PAL } from './palette';
import type { Dessin } from './props';
import { ombre } from './props';
import { disque, ellipse, rgba, rondRect } from './util';

export const DECORS: Partial<Record<PropType, Dessin>> = {
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
