// Personnages « chibi » dessinés à partir de leur apparence (cache par direction et pas).
import type { Dir } from '../core/types';
import type { Apparence } from '../core/world/mapdef';
import { APP } from '../data/maps/apparences';
import { ctx2d, disque, ellipse, rgba, rondRect, shade, toile } from './util';

/** Apparence des héros jouables sur la carte. */
export const APP_HEROS: Record<string, Apparence> = {
  ael: { peau: '#f2c9a0', cheveux: '#6b4426', tenue: '#2f7f8f', accent: '#f2b84b', coiffure: 'courte' },
  mira: APP.mira,
  brann: APP.brann,
  nour: APP.nour,
};

const cache = new Map<string, HTMLCanvasElement>();

/** Sprite d'un personnage : S pixels de large, 1,5 S de haut, pieds en bas. `pas` ∈ {0,1,2}. */
export function spritePerso(a: Apparence, dir: Dir, pas: number, S: number): HTMLCanvasElement {
  const k = `${S}|${a.peau}${a.cheveux}${a.tenue}${a.accent}${a.coiffure}${a.espece ?? ''}|${dir}|${pas}`;
  const deja = cache.get(k);
  if (deja) return deja;
  const c = toile(S, S * 1.5);
  const x = ctx2d(c);
  const esp = a.espece ?? 'humain';
  if (esp === 'humain') humain(x, a, dir, pas, S);
  else if (esp === 'poule') poule(x, a, dir, pas, S);
  else if (esp === 'esprit') esprit(x, a, dir, pas, S);
  else quadrupede(x, a, dir, pas, S, esp === 'chat');
  cache.set(k, c);
  return c;
}

function humain(x: CanvasRenderingContext2D, a: Apparence, dir: Dir, pas: number, S: number) {
  const cx = S / 2;
  const pied = S * 1.42;
  ellipse(x, cx, pied, S * 0.28, S * 0.08, rgba('#000000', 0.25));
  const cote = dir === 'gauche' || dir === 'droite';
  const sens = dir === 'gauche' ? -1 : 1;
  // Jambes.
  const jambe = shade(a.tenue, -0.45);
  const decal = pas === 0 ? 0 : pas === 1 ? 1 : -1;
  if (cote) {
    x.fillStyle = jambe;
    rondRect(x, cx - S * 0.1 + decal * S * 0.08, pied - S * 0.22, S * 0.11, S * 0.22, S * 0.04);
    x.fill();
    rondRect(x, cx - S * 0.02 - decal * S * 0.08, pied - S * 0.22, S * 0.11, S * 0.22, S * 0.04);
    x.fill();
  } else {
    x.fillStyle = jambe;
    rondRect(x, cx - S * 0.15, pied - S * 0.22 - (decal > 0 ? S * 0.03 : 0), S * 0.12, S * 0.22, S * 0.04);
    x.fill();
    rondRect(x, cx + S * 0.03, pied - S * 0.22 - (decal < 0 ? S * 0.03 : 0), S * 0.12, S * 0.22, S * 0.04);
    x.fill();
  }
  // Corps.
  const haut = pied - S * 0.58;
  x.fillStyle = a.tenue;
  rondRect(x, cx - S * 0.22, haut, S * 0.44, S * 0.42, S * 0.12);
  x.fill();
  x.fillStyle = shade(a.tenue, -0.2);
  rondRect(x, cx - S * 0.22, haut + S * 0.28, S * 0.44, S * 0.14, S * 0.06);
  x.fill();
  // Écharpe / ceinture (couleur d'accent).
  x.fillStyle = a.accent;
  rondRect(x, cx - S * 0.2, haut + S * 0.02, S * 0.4, S * 0.08, S * 0.04);
  x.fill();
  if (dir !== 'haut' && !cote) {
    x.fillRect(cx + S * 0.06, haut + S * 0.06, S * 0.07, S * 0.16);
  }
  // Bras.
  const balance = decal * S * 0.05;
  if (cote) disque(x, cx - sens * S * 0.02 + balance * sens, haut + S * 0.24, S * 0.08, a.peau);
  else {
    disque(x, cx - S * 0.25, haut + S * 0.22 + balance, S * 0.07, a.peau);
    disque(x, cx + S * 0.25, haut + S * 0.22 - balance, S * 0.07, a.peau);
  }
  // Tête.
  const ty = haut - S * 0.2;
  const R = S * 0.3;
  if (a.coiffure === 'longue' || a.coiffure === 'tresse') {
    x.fillStyle = a.cheveux;
    rondRect(x, cx - R * 0.95, ty - R * 0.2, R * 1.9, R * 1.6, R * 0.5);
    x.fill();
  }
  disque(x, cx, ty, R, a.peau);
  cheveux(x, a, dir, cx, ty, R);
  if (dir !== 'haut') {
    const oy = ty + R * 0.15;
    const yeux = cote ? [cx + sens * R * 0.42] : [cx - R * 0.36, cx + R * 0.36];
    for (const ex of yeux) {
      ellipse(x, ex, oy, R * 0.1, R * 0.16, '#2b2233');
      disque(x, ex + R * 0.03, oy - R * 0.06, R * 0.04, '#ffffff');
    }
    const joues = cote ? [cx + sens * R * 0.2] : [cx - R * 0.55, cx + R * 0.55];
    for (const jx of joues) ellipse(x, jx, oy + R * 0.25, R * 0.12, R * 0.07, rgba('#f08a7e', 0.45));
  }
}

function cheveux(x: CanvasRenderingContext2D, a: Apparence, dir: Dir, cx: number, ty: number, R: number) {
  const ch = a.cheveux;
  const cote = dir === 'gauche' || dir === 'droite';
  const sens = dir === 'gauche' ? -1 : 1;
  x.fillStyle = ch;
  if (a.coiffure === 'chauve') {
    x.fillStyle = rgba('#ffffff', 0.25);
    x.beginPath();
    x.ellipse(cx - R * 0.3, ty - R * 0.5, R * 0.25, R * 0.12, -0.5, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = ch;
    x.fillRect(cx - R, ty - R * 0.05, R * 0.25, R * 0.35);
    x.fillRect(cx + R * 0.75, ty - R * 0.05, R * 0.25, R * 0.35);
    return;
  }
  if (a.coiffure === 'capuche') {
    x.fillStyle = shade(a.tenue, 0.1);
    x.beginPath();
    x.arc(cx, ty, R * 1.1, Math.PI * 0.95, Math.PI * 2.05);
    x.lineTo(cx + R * 1.1, ty + R * 0.6);
    x.lineTo(cx - R * 1.1, ty + R * 0.6);
    x.closePath();
    if (dir === 'haut') x.arc(cx, ty, R * 1.1, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = ch;
    x.fillRect(cx - R * 0.6, ty - R * 0.55, R * 1.2, R * 0.2);
    return;
  }
  // Calotte.
  x.beginPath();
  if (dir === 'haut') x.arc(cx, ty, R * 1.04, 0, Math.PI * 2);
  else x.arc(cx, ty - R * 0.05, R * 1.04, Math.PI * 1.0, Math.PI * 2.0);
  x.fill();
  if (dir !== 'haut') {
    // Mèches sur le front.
    const n = 4;
    for (let i = 0; i < n; i++) {
      const fx = cx - R * 0.8 + (i * R * 1.6) / (n - 1) + (cote ? sens * R * 0.2 : 0);
      x.beginPath();
      x.moveTo(fx - R * 0.28, ty - R * 0.2);
      x.lineTo(fx, ty + R * 0.18);
      x.lineTo(fx + R * 0.28, ty - R * 0.2);
      x.fill();
    }
    if (cote) {
      x.beginPath();
      x.arc(cx - sens * R * 0.35, ty, R * 0.75, 0, Math.PI * 2);
      x.fill();
    }
  }
  if (a.coiffure === 'crete') {
    x.fillStyle = shade(ch, 0.15);
    for (let i = 0; i < 4; i++) {
      x.beginPath();
      x.moveTo(cx - R * 0.5 + i * R * 0.3, ty - R * 0.8);
      x.lineTo(cx - R * 0.35 + i * R * 0.3, ty - R * 1.55);
      x.lineTo(cx - R * 0.2 + i * R * 0.3, ty - R * 0.8);
      x.fill();
    }
  }
  if (a.coiffure === 'chignon') disque(x, cx, ty - R * 1.05, R * 0.38, shade(ch, -0.05));
  if (a.coiffure === 'tresse' && (dir === 'haut' || cote)) {
    const tx = cote ? cx - sens * R * 0.8 : cx;
    for (let i = 0; i < 3; i++) disque(x, tx, ty + R * (0.7 + i * 0.35), R * 0.2, shade(ch, i % 2 ? -0.1 : 0.05));
    disque(x, tx, ty + R * 1.7, R * 0.12, a.accent);
  }
}

function poule(x: CanvasRenderingContext2D, a: Apparence, dir: Dir, pas: number, S: number) {
  const cx = S / 2;
  const pied = S * 1.42;
  const sens = dir === 'gauche' ? -1 : 1;
  ellipse(x, cx, pied, S * 0.2, S * 0.06, rgba('#000000', 0.25));
  x.strokeStyle = '#e0912f';
  x.lineWidth = S * 0.04;
  const p = pas ? S * 0.04 : 0;
  x.beginPath();
  x.moveTo(cx - S * 0.06, pied - S * 0.12);
  x.lineTo(cx - S * 0.06 - p, pied);
  x.moveTo(cx + S * 0.06, pied - S * 0.12);
  x.lineTo(cx + S * 0.06 + p, pied);
  x.stroke();
  const by = pied - S * 0.28;
  ellipse(x, cx, by, S * 0.22, S * 0.18, a.tenue);
  ellipse(x, cx - sens * S * 0.17, by - S * 0.08, S * 0.08, S * 0.12, shade(a.tenue, -0.08));
  disque(x, cx + sens * S * 0.12, by - S * 0.2, S * 0.12, a.peau);
  disque(x, cx + sens * S * 0.12, by - S * 0.34, S * 0.05, a.cheveux);
  x.fillStyle = a.accent;
  x.beginPath();
  x.moveTo(cx + sens * S * 0.22, by - S * 0.22);
  x.lineTo(cx + sens * S * 0.32, by - S * 0.18);
  x.lineTo(cx + sens * S * 0.22, by - S * 0.14);
  x.fill();
  if (dir !== 'haut') disque(x, cx + sens * S * 0.15, by - S * 0.22, S * 0.02, '#2b2233');
}

function quadrupede(x: CanvasRenderingContext2D, a: Apparence, dir: Dir, pas: number, S: number, chat: boolean) {
  const cx = S / 2;
  const pied = S * 1.42;
  const sens = dir === 'gauche' ? -1 : 1;
  const k = chat ? 0.8 : 1;
  ellipse(x, cx, pied, S * 0.3 * k, S * 0.07, rgba('#000000', 0.25));
  const by = pied - S * 0.22 * k;
  x.fillStyle = shade(a.tenue, -0.2);
  const p = pas ? S * 0.04 : 0;
  for (const [lx, d] of [
    [-0.18, p],
    [-0.06, -p],
    [0.08, -p],
    [0.2, p],
  ] as const) x.fillRect(cx + lx * S * k + d, by, S * 0.06, S * 0.2 * k);
  ellipse(x, cx, by, S * 0.28 * k, S * 0.14 * k, a.tenue);
  // Queue.
  x.strokeStyle = a.tenue;
  x.lineWidth = S * 0.06 * k;
  x.lineCap = 'round';
  x.beginPath();
  x.moveTo(cx - sens * S * 0.25 * k, by - S * 0.02);
  x.quadraticCurveTo(cx - sens * S * 0.42 * k, by - S * 0.1, cx - sens * S * 0.36 * k, by - S * 0.3 * k);
  x.stroke();
  const hx = cx + sens * S * 0.2 * k;
  const hy = by - S * 0.17 * k;
  disque(x, hx, hy, S * 0.16 * k, a.peau);
  x.fillStyle = a.cheveux;
  for (const o of [-1, 1]) {
    x.beginPath();
    x.moveTo(hx + o * S * 0.12 * k, hy - S * 0.06);
    x.lineTo(hx + o * S * 0.1 * k, hy - S * 0.26 * k);
    x.lineTo(hx + o * S * 0.01, hy - S * 0.12 * k);
    x.fill();
  }
  if (dir !== 'haut') {
    disque(x, hx - S * 0.05, hy, S * 0.025, '#2b2233');
    disque(x, hx + S * 0.05, hy, S * 0.025, '#2b2233');
    disque(x, hx + sens * S * 0.02, hy + S * 0.06, S * 0.03, a.accent);
  }
}

function esprit(x: CanvasRenderingContext2D, a: Apparence, dir: Dir, pas: number, S: number) {
  const cx = S / 2;
  const base = S * 1.3 - pas * S * 0.03;
  ellipse(x, cx, S * 1.42, S * 0.2, S * 0.05, rgba('#000000', 0.2));
  const g = x.createRadialGradient(cx, base - S * 0.4, S * 0.05, cx, base - S * 0.4, S * 0.55);
  g.addColorStop(0, rgba(a.accent, 0.5));
  g.addColorStop(1, rgba(a.accent, 0));
  x.fillStyle = g;
  x.fillRect(0, 0, S, S * 1.5);
  x.fillStyle = a.tenue;
  x.beginPath();
  x.arc(cx, base - S * 0.5, S * 0.3, Math.PI, 0);
  x.lineTo(cx + S * 0.3, base - S * 0.1);
  for (let i = 0; i < 4; i++) x.lineTo(cx + S * 0.3 - (i + 0.5) * S * 0.15, base - (i % 2 ? S * 0.1 : 0));
  x.lineTo(cx - S * 0.3, base - S * 0.1);
  x.closePath();
  x.fill();
  if (dir !== 'haut') {
    ellipse(x, cx - S * 0.1, base - S * 0.5, S * 0.05, S * 0.08, a.accent);
    ellipse(x, cx + S * 0.1, base - S * 0.5, S * 0.05, S * 0.08, a.accent);
  }
}
