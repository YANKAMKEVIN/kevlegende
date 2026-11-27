// Ennemis dessinés procéduralement (repli quand l'illustration n'est pas chargée). Tournés vers la droite.
import type { EnemyShape } from '../core/types';
import { ctx2d, disque, ellipse, rgba, rondRect, shade, toile } from './util';

const cache = new Map<string, HTMLCanvasElement>();

export function spriteEnnemi(forme: EnemyShape, teinte: string, S: number): HTMLCanvasElement {
  const k = `${forme}:${teinte}:${S}`;
  const deja = cache.get(k);
  if (deja) return deja;
  const c = toile(S, S);
  const x = ctx2d(c);
  const f = FORMES[forme] ?? FORMES.gelee;
  f(x, S, teinte);
  cache.set(k, c);
  return c;
}

const yeux = (x: CanvasRenderingContext2D, cx: number, cy: number, r: number, ecart: number, couleur = '#2b2233') => {
  for (const o of [-1, 1]) {
    ellipse(x, cx + o * ecart, cy, r, r * 1.3, '#ffffff');
    ellipse(x, cx + o * ecart + r * 0.3, cy + r * 0.1, r * 0.6, r * 0.85, couleur);
    disque(x, cx + o * ecart + r * 0.45, cy - r * 0.3, r * 0.25, '#ffffff');
  }
};

const FORMES: Record<EnemyShape, (x: CanvasRenderingContext2D, S: number, t: string) => void> = {
  gelee: (x, S, t) => {
    ellipse(x, S / 2, S * 0.9, S * 0.34, S * 0.06, rgba('#000000', 0.25));
    const g = x.createRadialGradient(S * 0.42, S * 0.5, S * 0.05, S / 2, S * 0.62, S * 0.4);
    g.addColorStop(0, shade(t, 0.5));
    g.addColorStop(1, t);
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(S * 0.15, S * 0.88);
    x.quadraticCurveTo(S * 0.1, S * 0.35, S / 2, S * 0.3);
    x.quadraticCurveTo(S * 0.9, S * 0.35, S * 0.85, S * 0.88);
    x.closePath();
    x.fill();
    ellipse(x, S * 0.38, S * 0.45, S * 0.08, S * 0.05, rgba('#ffffff', 0.7));
    yeux(x, S * 0.55, S * 0.62, S * 0.045, S * 0.1);
  },
  loup: (x, S, t) => {
    ellipse(x, S / 2, S * 0.9, S * 0.4, S * 0.06, rgba('#000000', 0.25));
    x.fillStyle = shade(t, -0.25);
    for (const lx of [0.25, 0.38, 0.6, 0.72]) x.fillRect(S * lx, S * 0.62, S * 0.07, S * 0.28);
    x.fillStyle = t;
    x.beginPath();
    x.ellipse(S * 0.48, S * 0.58, S * 0.3, S * 0.16, -0.1, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.moveTo(S * 0.2, S * 0.55);
    x.quadraticCurveTo(S * 0.02, S * 0.4, S * 0.1, S * 0.3);
    x.quadraticCurveTo(S * 0.15, S * 0.5, S * 0.3, S * 0.52);
    x.fill();
    disque(x, S * 0.76, S * 0.42, S * 0.15, t);
    x.beginPath();
    x.moveTo(S * 0.82, S * 0.4);
    x.lineTo(S * 0.98, S * 0.48);
    x.lineTo(S * 0.82, S * 0.54);
    x.fill();
    for (const ox of [0.68, 0.8]) {
      x.beginPath();
      x.moveTo(S * ox, S * 0.32);
      x.lineTo(S * (ox + 0.03), S * 0.17);
      x.lineTo(S * (ox + 0.08), S * 0.31);
      x.fill();
    }
    x.fillStyle = rgba('#ffffff', 0.25);
    x.beginPath();
    x.ellipse(S * 0.45, S * 0.5, S * 0.2, S * 0.05, -0.1, 0, Math.PI * 2);
    x.fill();
    ellipse(x, S * 0.82, S * 0.4, S * 0.03, S * 0.02, '#ffe08a');
  },
  oiseau: (x, S, t) => {
    ellipse(x, S / 2, S * 0.92, S * 0.25, S * 0.05, rgba('#000000', 0.2));
    x.fillStyle = shade(t, -0.2);
    x.beginPath();
    x.moveTo(S * 0.45, S * 0.45);
    x.quadraticCurveTo(S * 0.1, S * 0.1, S * 0.05, S * 0.35);
    x.quadraticCurveTo(S * 0.2, S * 0.5, S * 0.4, S * 0.6);
    x.fill();
    ellipse(x, S * 0.5, S * 0.55, S * 0.22, S * 0.2, t);
    disque(x, S * 0.68, S * 0.38, S * 0.13, t);
    x.fillStyle = '#f2b84b';
    x.beginPath();
    x.moveTo(S * 0.78, S * 0.36);
    x.lineTo(S * 0.92, S * 0.4);
    x.lineTo(S * 0.78, S * 0.44);
    x.fill();
    disque(x, S * 0.72, S * 0.35, S * 0.03, '#2b2233');
    x.strokeStyle = '#f2b84b';
    x.lineWidth = S * 0.025;
    x.beginPath();
    x.moveTo(S * 0.45, S * 0.72);
    x.lineTo(S * 0.43, S * 0.9);
    x.moveTo(S * 0.55, S * 0.72);
    x.lineTo(S * 0.57, S * 0.9);
    x.stroke();
  },
  champi: (x, S, t) => {
    ellipse(x, S / 2, S * 0.9, S * 0.3, S * 0.06, rgba('#000000', 0.25));
    x.fillStyle = '#f3e3c3';
    rondRect(x, S * 0.33, S * 0.45, S * 0.34, S * 0.45, S * 0.12);
    x.fill();
    x.fillStyle = t;
    x.beginPath();
    x.ellipse(S / 2, S * 0.45, S * 0.38, S * 0.28, 0, Math.PI, 0);
    x.fill();
    for (const [dx, dy, r] of [
      [-0.18, -0.1, 0.06],
      [0.1, -0.18, 0.05],
      [0.22, -0.05, 0.04],
    ])
      disque(x, S * (0.5 + dx!), S * (0.45 + dy!), S * r!, '#fff6e5');
    for (const o of [-1, 1]) {
      x.strokeStyle = '#2b2233';
      x.lineWidth = S * 0.02;
      x.beginPath();
      x.arc(S * (0.5 + o * 0.08), S * 0.6, S * 0.035, 0.2, Math.PI - 0.2);
      x.stroke();
    }
  },
  golem: (x, S, t) => {
    ellipse(x, S / 2, S * 0.92, S * 0.38, S * 0.06, rgba('#000000', 0.25));
    x.fillStyle = '#7a7486';
    rondRect(x, S * 0.22, S * 0.3, S * 0.56, S * 0.5, S * 0.12);
    x.fill();
    rondRect(x, S * 0.08, S * 0.36, S * 0.16, S * 0.4, S * 0.06);
    x.fill();
    rondRect(x, S * 0.76, S * 0.36, S * 0.16, S * 0.4, S * 0.06);
    x.fill();
    x.fillRect(S * 0.3, S * 0.78, S * 0.14, S * 0.14);
    x.fillRect(S * 0.56, S * 0.78, S * 0.14, S * 0.14);
    rondRect(x, S * 0.34, S * 0.12, S * 0.32, S * 0.24, S * 0.08);
    x.fill();
    for (const [mx, my, r] of [
      [0.35, 0.3, 0.12],
      [0.6, 0.28, 0.1],
      [0.5, 0.14, 0.1],
      [0.15, 0.38, 0.07],
      [0.85, 0.38, 0.07],
    ])
      disque(x, S * mx!, S * my!, S * r!, t);
    disque(x, S * 0.44, S * 0.24, S * 0.025, '#b5ffd0');
    disque(x, S * 0.56, S * 0.24, S * 0.025, '#b5ffd0');
  },
  esprit: (x, S, t) => {
    const g = x.createRadialGradient(S / 2, S * 0.45, S * 0.05, S / 2, S * 0.45, S * 0.48);
    g.addColorStop(0, rgba(t, 0.65));
    g.addColorStop(1, rgba(t, 0));
    x.fillStyle = g;
    x.fillRect(0, 0, S, S);
    x.fillStyle = t;
    x.beginPath();
    x.arc(S / 2, S * 0.42, S * 0.22, Math.PI, 0);
    x.quadraticCurveTo(S * 0.75, S * 0.8, S * 0.55, S * 0.88);
    x.quadraticCurveTo(S * 0.5, S * 0.72, S * 0.42, S * 0.82);
    x.quadraticCurveTo(S * 0.25, S * 0.7, S * 0.28, S * 0.42);
    x.fill();
    disque(x, S * 0.44, S * 0.38, S * 0.11, rgba('#ffffff', 0.25));
    ellipse(x, S * 0.45, S * 0.45, S * 0.035, S * 0.05, '#fff6e5');
    ellipse(x, S * 0.58, S * 0.45, S * 0.035, S * 0.05, '#fff6e5');
  },
  crabe: (x, S, t) => {
    ellipse(x, S / 2, S * 0.9, S * 0.4, S * 0.06, rgba('#000000', 0.25));
    x.strokeStyle = shade(t, -0.3);
    x.lineWidth = S * 0.035;
    for (let i = 0; i < 3; i++)
      for (const o of [-1, 1]) {
        x.beginPath();
        x.moveTo(S * (0.5 + o * 0.15), S * 0.68);
        x.lineTo(S * (0.5 + o * (0.3 + i * 0.05)), S * (0.75 + i * 0.04));
        x.lineTo(S * (0.5 + o * (0.33 + i * 0.05)), S * 0.9);
        x.stroke();
      }
    ellipse(x, S / 2, S * 0.62, S * 0.3, S * 0.17, t);
    ellipse(x, S * 0.45, S * 0.56, S * 0.15, S * 0.05, rgba('#ffffff', 0.35));
    for (const o of [-1, 1]) {
      disque(x, S * (0.5 + o * 0.34), S * 0.42, S * 0.12, shade(t, 0.1));
      x.fillStyle = shade(t, -0.2);
      x.beginPath();
      x.moveTo(S * (0.5 + o * 0.34), S * 0.42);
      x.lineTo(S * (0.5 + o * 0.46), S * 0.34);
      x.lineTo(S * (0.5 + o * 0.42), S * 0.46);
      x.fill();
    }
    yeux(x, S / 2, S * 0.46, S * 0.035, S * 0.07);
  },
  serpent: (x, S, t) => {
    x.strokeStyle = t;
    x.lineCap = 'round';
    x.lineWidth = S * 0.16;
    x.beginPath();
    x.moveTo(S * 0.1, S * 0.82);
    x.bezierCurveTo(S * 0.5, S * 0.95, S * 0.15, S * 0.5, S * 0.45, S * 0.45);
    x.bezierCurveTo(S * 0.7, S * 0.4, S * 0.55, S * 0.2, S * 0.68, S * 0.22);
    x.stroke();
    x.strokeStyle = rgba('#ffe08a', 0.5);
    x.lineWidth = S * 0.04;
    x.setLineDash([S * 0.04, S * 0.06]);
    x.stroke();
    x.setLineDash([]);
    ellipse(x, S * 0.72, S * 0.22, S * 0.14, S * 0.1, t);
    disque(x, S * 0.76, S * 0.19, S * 0.025, '#ffe08a');
    x.strokeStyle = '#e86a6a';
    x.lineWidth = S * 0.015;
    x.beginPath();
    x.moveTo(S * 0.86, S * 0.25);
    x.lineTo(S * 0.95, S * 0.24);
    x.stroke();
  },
  chevalier: (x, S, t) => {
    ellipse(x, S / 2, S * 0.92, S * 0.28, S * 0.06, rgba('#000000', 0.25));
    x.fillStyle = shade(t, -0.2);
    x.beginPath();
    x.moveTo(S * 0.3, S * 0.35);
    x.lineTo(S * 0.2, S * 0.9);
    x.lineTo(S * 0.8, S * 0.9);
    x.lineTo(S * 0.7, S * 0.35);
    x.fill();
    x.fillStyle = t;
    rondRect(x, S * 0.32, S * 0.32, S * 0.36, S * 0.4, S * 0.08);
    x.fill();
    disque(x, S / 2, S * 0.24, S * 0.13, shade(t, 0.15));
    x.fillStyle = '#0b0c16';
    x.fillRect(S * 0.42, S * 0.22, S * 0.18, S * 0.05);
    disque(x, S * 0.47, S * 0.245, S * 0.018, '#b7a6ff');
    disque(x, S * 0.56, S * 0.245, S * 0.018, '#b7a6ff');
    x.fillStyle = '#c9ccd8';
    x.save();
    x.translate(S * 0.72, S * 0.55);
    x.rotate(-0.7);
    x.fillRect(-S * 0.02, -S * 0.35, S * 0.05, S * 0.4);
    x.fillStyle = '#d4a64a';
    x.fillRect(-S * 0.06, S * 0.03, S * 0.13, S * 0.03);
    x.restore();
  },
  roi: (x, S, t) => {
    FORMES.chevalier(x, S, t);
    x.fillStyle = '#d4a64a';
    x.beginPath();
    x.moveTo(S * 0.38, S * 0.12);
    for (let i = 0; i < 5; i++) x.lineTo(S * (0.4 + i * 0.05), S * (i % 2 ? 0.04 : 0.12));
    x.lineTo(S * 0.62, S * 0.12);
    x.fill();
  },
};
