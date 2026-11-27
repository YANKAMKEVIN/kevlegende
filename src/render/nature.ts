// Sprites d'arbres pré-rendus (feuillus et sapins), dessinés en hauteur par-dessus le joueur.
import { PAL } from './palette';
import { ctx2d, disque, ellipse, mix, rgba, shade, toile } from './util';

const cache = new Map<string, HTMLCanvasElement>();

export type Essence = 'feuillu' | 'sapin' | 'brume' | 'automne';

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
  x.fillStyle = PAL.tronc;
  x.fillRect(cx - L * 0.09, pied - L * 0.7, L * 0.18, L * 0.7);
  x.fillStyle = shade(PAL.tronc, -0.3);
  x.fillRect(cx + L * 0.02, pied - L * 0.7, L * 0.07, L * 0.7);
  if (essence === 'sapin') {
    const vert = mix(PAL.feuillageFonce, PAL.feuillage, variante * 0.4);
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
    }
  } else {
    const palettes: Record<Exclude<Essence, 'sapin'>, [string, string, string]> = {
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
