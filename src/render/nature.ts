// Sprites d'arbres pré-rendus (feuillus et sapins), dessinés en hauteur par-dessus le joueur.
import { PAL } from './palette';
import { ctx2d, disque, ellipse, mix, rgba, shade, toile } from './util';

const cache = new Map<string, HTMLCanvasElement>();

export type Essence = 'feuillu' | 'sapin' | 'brume' | 'automne' | 'palmier' | 'givre';

/** Arbre d'une case de large, ~2 cases de haut ; le pied est en bas du sprite. */
export function spriteArbre(L: number, essence: Essence, variante: number): HTMLCanvasElement {
  const k = `${L}:${essence}:${variante}`;
  const deja = cache.get(k);
  if (deja) return deja;
  const w = L * 1.5;
  const h = L * 2.2;
  const c = toile(w, h);
  const x = ctx2d(c);
  const cx = w / 2;
  const pied = h - L * 0.2;
  if (essence === 'palmier') {
    palmier(x, L, cx, pied, variante);
    cache.set(k, c);
    return c;
  }
  x.fillStyle = PAL.tronc;
  x.fillRect(cx - L * 0.09, pied - L * 0.7, L * 0.18, L * 0.7);
  x.fillStyle = shade(PAL.tronc, -0.3);
  x.fillRect(cx + L * 0.02, pied - L * 0.7, L * 0.07, L * 0.7);
  if (essence === 'sapin' || essence === 'givre') {
    const vert = essence === 'givre' ? mix('#2f5a4f', '#3f6f62', variante * 0.5) : mix(PAL.feuillageFonce, PAL.feuillage, variante * 0.4);
    for (let i = 0; i < 3; i++) {
      const base = pied - L * (0.45 + i * 0.42);
      const larg = L * (0.68 - i * 0.16);
      x.fillStyle = shade(vert, -0.15 + i * 0.08);
      x.beginPath();
      x.moveTo(cx - larg, base);
      x.lineTo(cx, base - L * 0.7);
      x.lineTo(cx + larg, base);
      x.closePath();
      x.fill();
      x.fillStyle = rgba('#ffffff', 0.12);
      x.beginPath();
      x.moveTo(cx - larg * 0.7, base - L * 0.05);
      x.lineTo(cx, base - L * 0.68);
      x.lineTo(cx - larg * 0.1, base - L * 0.05);
      x.fill();
      if (essence === 'givre') {
        // Neige posée sur chaque étage : festons blancs et pointe enneigée.
        x.fillStyle = '#f4f8fc';
        x.beginPath();
        x.moveTo(cx - larg * 0.55, base - L * 0.22);
        x.lineTo(cx, base - L * 0.7);
        x.lineTo(cx + larg * 0.55, base - L * 0.22);
        for (let k = 4; k >= 0; k--) x.quadraticCurveTo(cx - larg * 0.55 + (larg * 1.1 * (k + 0.5)) / 5, base - L * (0.12 + (k % 2) * 0.06), cx - larg * 0.55 + (larg * 1.1 * k) / 5, base - L * 0.22);
        x.fill();
        x.fillStyle = rgba('#a9c2df', 0.55);
        x.fillRect(cx, base - L * 0.4, larg * 0.4, L * 0.04);
      }
    }
  } else {
    const palettes: Record<Exclude<Essence, 'sapin' | 'palmier' | 'givre'>, [string, string, string]> = {
      feuillu: [PAL.feuillageFonce, PAL.feuillage, PAL.feuillageClair],
      automne: ['#8a4b2a', '#d7863c', '#f2b84b'],
      brume: ['#3a3456', '#5b4b7a', '#8a7aac'],
    };
    const [f, m, cl] = palettes[essence];
    const tete = pied - L * 1.15;
    const bulles = [
      [-0.38, 0.18, 0.4],
      [0.38, 0.18, 0.4],
      [0, -0.05, 0.5],
      [-0.2, -0.3, 0.32],
      [0.24, -0.26, 0.3],
    ];
    ellipse(x, cx, tete + L * 0.45, L * 0.62, L * 0.18, rgba('#000000', 0.15));
    for (const [dx, dy, r] of bulles) disque(x, cx + dx! * L, tete + dy! * L, r! * L, f);
    for (const [dx, dy, r] of bulles) disque(x, cx + dx! * L - L * 0.03, tete + dy! * L - L * 0.05, r! * L * 0.88, m);
    // Lumière venant d'en haut à gauche : un seul reflet doux, irrégulier.
    x.save();
    x.beginPath();
    for (const [dx, dy, r] of bulles) x.arc(cx + dx! * L - L * 0.03, tete + dy! * L - L * 0.05, r! * L * 0.88, 0, Math.PI * 2);
    x.clip();
    x.fillStyle = cl;
    x.beginPath();
    x.ellipse(cx - L * 0.22, tete - L * 0.32, L * 0.42, L * 0.26, -0.5, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = rgba('#ffffff', 0.18);
    x.beginPath();
    x.ellipse(cx - L * 0.3, tete - L * 0.4, L * 0.16, L * 0.09, -0.5, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = rgba('#000000', 0.12);
    x.beginPath();
    x.ellipse(cx + L * 0.3, tete + L * 0.4, L * 0.6, L * 0.3, -0.3, 0, Math.PI * 2);
    x.fill();
    x.restore();
    // Petites touches de feuillage.
    for (let i = 0; i < 5; i++) disque(x, cx + Math.cos(i * 2.4 + variante * 5) * L * 0.4, tete + Math.sin(i * 1.7 + variante * 3) * L * 0.3, L * 0.05, shade(m, 0.18));
    if (essence === 'feuillu' && variante > 0.7) for (let i = 0; i < 4; i++) disque(x, cx + Math.cos(i * 1.9) * L * 0.4, tete + Math.sin(i * 2.3) * L * 0.3, L * 0.05, '#f08a7e');
  }
  cache.set(k, c);
  return c;
}

/** Palmier : tronc annelé incliné, couronne de palmes en éventail, quelques dattes. */
function palmier(x: CanvasRenderingContext2D, L: number, cx: number, pied: number, variante: number): void {
  const pente = (variante - 0.5) * L * 0.5;
  const tete = { x: cx + pente, y: pied - L * 1.45 };
  ellipse(x, cx, pied - L * 0.02, L * 0.3, L * 0.1, rgba('#000000', 0.18));
  // Tronc en segments.
  const n = 7;
  for (let i = 0; i < n; i++) {
    const t0 = i / n;
    const px = cx + pente * t0 * t0;
    const py = pied - (pied - tete.y) * t0;
    const larg = L * (0.13 - t0 * 0.04);
    x.fillStyle = i % 2 ? '#8a6440' : '#a57a4c';
    x.beginPath();
    x.ellipse(px, py, larg, L * 0.12, 0, 0, Math.PI * 2);
    x.fill();
  }
  // Palmes.
  const palmes = 7;
  for (let i = 0; i < palmes; i++) {
    const a = -Math.PI + (i / (palmes - 1)) * Math.PI + (variante - 0.5) * 0.3;
    const lg = L * (0.75 + ((i * 37) % 5) * 0.05);
    const fx = tete.x + Math.cos(a) * lg;
    const fy = tete.y + Math.sin(a) * lg * 0.55 + L * 0.28;
    for (const [coul, ep] of [['#2f6a3a', 0.16], ['#4f9a4a', 0.1]] as const) {
      x.strokeStyle = coul;
      x.lineWidth = L * ep;
      x.lineCap = 'round';
      x.beginPath();
      x.moveTo(tete.x, tete.y);
      x.quadraticCurveTo(tete.x + Math.cos(a) * lg * 0.5, tete.y - L * 0.25, fx, fy);
      x.stroke();
    }
    x.strokeStyle = rgba('#a3d97c', 0.7);
    x.lineWidth = Math.max(1, L * 0.025);
    x.beginPath();
    x.moveTo(tete.x, tete.y - L * 0.02);
    x.quadraticCurveTo(tete.x + Math.cos(a) * lg * 0.5, tete.y - L * 0.27, fx, fy - L * 0.03);
    x.stroke();
  }
  for (let i = 0; i < 3; i++) disque(x, tete.x - L * 0.08 + i * L * 0.08, tete.y + L * 0.1, L * 0.06, '#c0622a');
  disque(x, tete.x, tete.y, L * 0.1, '#3f7a3c');
}
