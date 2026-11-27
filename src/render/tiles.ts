// Peinture procédurale des tuiles : couleurs de base, transitions douces, détails par case.
import { PAL } from './palette';
import { alea, disque, ellipse, hash, mix, rgba, rondRect, shade } from './util';

export type Voisin = (dx: number, dy: number) => string;

/** Familles de sol : sert aux transitions (l'herbe déborde sur les chemins). */
const VERT = new Set(['.', ',', 'f', 'T', 'b']);
const TERRE = new Set([':', '_', 's', 'k', '^']);
export const estVert = (ch: string) => VERT.has(ch);

/** Sol peint sous les tuiles décor (arbres, rochers…) selon l'ambiance de la carte. */
export function solSous(ch: string, fond: string): string {
  if (ch === 'T' || ch === 'b') return '.';
  if (ch === '#') return fond === 'c' ? 'c' : '.';
  if (ch === '*') return 'c';
  if (ch === 'r') return 'k';
  return ch;
}

function brins(ctx: CanvasRenderingContext2D, x: number, y: number, L: number, n: number, couleurs: readonly string[], haut: number, r: () => number) {
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(1, L * 0.035);
  for (let i = 0; i < n; i++) {
    const bx = x + r() * L;
    const by = y + r() * L;
    const h = L * haut * (0.6 + r() * 0.6);
    ctx.strokeStyle = couleurs[Math.floor(r() * couleurs.length)]!;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx + (r() - 0.5) * L * 0.1, by - h * 0.6, bx + (r() - 0.5) * L * 0.16, by - h);
    ctx.stroke();
  }
}

function taches(ctx: CanvasRenderingContext2D, x: number, y: number, L: number, n: number, couleur: string, taille: number, r: () => number) {
  for (let i = 0; i < n; i++) ellipse(ctx, x + r() * L, y + r() * L, L * taille * (0.5 + r()), L * taille * 0.6 * (0.5 + r()), couleur);
}

function planches(ctx: CanvasRenderingContext2D, x: number, y: number, L: number, base: string, verticales: boolean, r: () => number) {
  const n = 4;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = shade(base, (r() - 0.5) * 0.12);
    if (verticales) ctx.fillRect(x + (i * L) / n, y, L / n, L);
    else ctx.fillRect(x, y + (i * L) / n, L, L / n);
  }
  ctx.strokeStyle = shade(base, -0.35);
  ctx.lineWidth = Math.max(1, L * 0.025);
  for (let i = 1; i <= n; i++) {
    ctx.beginPath();
    if (verticales) {
      ctx.moveTo(x + (i * L) / n, y);
      ctx.lineTo(x + (i * L) / n, y + L);
    } else {
      ctx.moveTo(x, y + (i * L) / n);
      ctx.lineTo(x + L, y + (i * L) / n);
    }
    ctx.stroke();
  }
  // Clous.
  for (let i = 0; i < n; i++) {
    const c = shade(base, -0.45);
    if (verticales) disque(ctx, x + (i + 0.5) * (L / n), y + L * 0.12, L * 0.02, c);
    else disque(ctx, x + L * 0.12, y + (i + 0.5) * (L / n), L * 0.02, c);
  }
}

/** Peint une tuile de sol (sans les objets hauts comme les arbres). */
export function peindreTuile(ctx: CanvasRenderingContext2D, ch: string, tx: number, ty: number, L: number, v: Voisin, fond: string): void {
  const x = tx * L;
  const y = ty * L;
  const r = alea(hash(tx, ty, 7) * 4294967296);
  const sol = solSous(ch, fond);
  switch (sol) {
    case '.':
    case ',':
    case 'f': {
      ctx.fillStyle = mix(PAL.herbe, PAL.herbeClair, hash(tx >> 1, ty >> 1, 3) * 0.5);
      ctx.fillRect(x, y, L, L);
      taches(ctx, x, y, L, 3, rgba(PAL.herbeFonce, 0.18), 0.12, r);
      taches(ctx, x, y, L, 2, rgba(PAL.herbeClair, 0.35), 0.1, r);
      if (sol === ',') {
        ctx.fillStyle = rgba(PAL.herbeHaute, 0.55);
        ctx.fillRect(x, y, L, L);
        brins(ctx, x, y + L * 0.15, L, 16, [PAL.herbeFonce, PAL.herbeHaute, shade(PAL.herbeHaute, -0.25), PAL.herbe], 0.32, r);
      } else brins(ctx, x, y, L, 4, [PAL.herbeFonce, PAL.herbeClair], 0.14, r);
      if (sol === 'f') {
        const fleurs = ['#fff3f7', '#f7c6d9', '#f2b84b', '#b9a3f0', '#ffffff'];
        for (let i = 0; i < 5; i++) {
          const fx = x + L * (0.12 + r() * 0.76);
          const fy = y + L * (0.12 + r() * 0.76);
          const c = fleurs[Math.floor(r() * fleurs.length)]!;
          for (let p = 0; p < 5; p++) disque(ctx, fx + Math.cos(p * 1.256) * L * 0.035, fy + Math.sin(p * 1.256) * L * 0.035, L * 0.03, c);
          disque(ctx, fx, fy, L * 0.022, '#f2b84b');
        }
      }
      break;
    }
    case ':': {
      ctx.fillStyle = mix(PAL.terre, '#d8b37a', hash(tx, ty, 5) * 0.4);
      ctx.fillRect(x, y, L, L);
      taches(ctx, x, y, L, 3, rgba(PAL.terreFonce, 0.22), 0.09, r);
      for (let i = 0; i < 3; i++) ellipse(ctx, x + r() * L, y + r() * L, L * 0.04, L * 0.03, rgba('#f6e7c8', 0.6));
      break;
    }
    case '_': {
      ctx.fillStyle = PAL.paveJoint;
      ctx.fillRect(x, y, L, L);
      const n = 2;
      for (let j = 0; j < n; j++)
        for (let i = 0; i < n; i++) {
          const dec = j % 2 ? 0.25 : 0;
          const px = x + ((i + dec) * L) / n + L * 0.03;
          const py = y + (j * L) / n + L * 0.03;
          ctx.fillStyle = shade(PAL.pave, (r() - 0.5) * 0.16);
          rondRect(ctx, px, py, L / n - L * 0.06, L / n - L * 0.06, L * 0.08);
          ctx.fill();
          ctx.fillStyle = rgba('#ffffff', 0.18);
          rondRect(ctx, px + L * 0.03, py + L * 0.02, L / n - L * 0.14, L * 0.06, L * 0.03);
          ctx.fill();
        }
      break;
    }
    case 's':
    case 'k':
      ctx.fillStyle = sol === 's' ? mix(PAL.sable, '#f3e3b6', hash(tx, ty, 2) * 0.5) : mix(PAL.corailSol, PAL.sable, hash(tx, ty, 2) * 0.4);
      ctx.fillRect(x, y, L, L);
      for (let i = 0; i < 7; i++) disque(ctx, x + r() * L, y + r() * L, L * 0.015, rgba(PAL.terreFonce, 0.35));
      if (sol === 'k') for (let i = 0; i < 2; i++) disque(ctx, x + r() * L, y + r() * L, L * 0.03, rgba(PAL.corail, 0.5));
      ctx.strokeStyle = rgba('#ffffff', 0.25);
      ctx.lineWidth = Math.max(1, L * 0.025);
      ctx.beginPath();
      ctx.moveTo(x + L * 0.1, y + L * (0.3 + r() * 0.4));
      ctx.quadraticCurveTo(x + L * 0.5, y + L * (0.2 + r() * 0.6), x + L * 0.9, y + L * (0.3 + r() * 0.4));
      ctx.stroke();
      break;
    case '~': {
      ctx.fillStyle = mix(PAL.eau, '#3b8db3', hash(tx, ty, 4) * 0.4);
      ctx.fillRect(x, y, L, L);
      // Écume sur les berges.
      const berge = (dx: number, dy: number) => v(dx, dy) !== '~' && v(dx, dy) !== '=' && v(dx, dy) !== 'o';
      ctx.fillStyle = rgba(PAL.eauClair, 0.75);
      if (berge(0, -1)) ctx.fillRect(x, y, L, L * 0.09);
      if (berge(-1, 0)) ctx.fillRect(x, y, L * 0.07, L);
      if (berge(1, 0)) ctx.fillRect(x + L * 0.93, y, L * 0.07, L);
      if (berge(0, 1)) ctx.fillRect(x, y + L * 0.93, L, L * 0.07);
      if (berge(0, -1)) {
        ctx.fillStyle = rgba('#1e4f6b', 0.25);
        ctx.fillRect(x, y + L * 0.09, L, L * 0.12);
      }
      break;
    }
    case '=':
    case 'p':
    case 'd': {
      const eauCote = v(-1, 0) === '~' || v(1, 0) === '~' || v(-1, 0) === 'o' || v(1, 0) === 'o';
      planches(ctx, x, y, L, sol === 'd' ? shade(PAL.bois, -0.1) : PAL.bois, !eauCote, r);
      break;
    }
    case 'h':
      planches(ctx, x, y, L, '#6f5640', false, r);
      ctx.fillStyle = rgba(PAL.brume, 0.18);
      ctx.fillRect(x, y, L, L);
      break;
    case 'w':
      planches(ctx, x, y, L, PAL.plancher, false, r);
      break;
    case 'x': {
      ctx.fillStyle = '#9c3f45';
      ctx.fillRect(x, y, L, L);
      const bord = '#f2b84b';
      ctx.fillStyle = bord;
      if (v(0, -1) !== 'x') ctx.fillRect(x, y + L * 0.08, L, L * 0.06);
      if (v(0, 1) !== 'x') ctx.fillRect(x, y + L * 0.86, L, L * 0.06);
      if (v(-1, 0) !== 'x') ctx.fillRect(x + L * 0.08, y, L * 0.06, L);
      if (v(1, 0) !== 'x') ctx.fillRect(x + L * 0.86, y, L * 0.06, L);
      ctx.fillStyle = rgba('#f2b84b', 0.35);
      ctx.beginPath();
      ctx.moveTo(x + L / 2, y + L * 0.3);
      ctx.lineTo(x + L * 0.7, y + L / 2);
      ctx.lineTo(x + L / 2, y + L * 0.7);
      ctx.lineTo(x + L * 0.3, y + L / 2);
      ctx.fill();
      break;
    }
    case 'W': {
      ctx.fillStyle = PAL.mur;
      ctx.fillRect(x, y, L, L);
      const face = v(0, 1) !== 'W';
      if (face) {
        ctx.fillStyle = shade('#c9a77d', -0.05);
        ctx.fillRect(x, y + L * 0.25, L, L * 0.75);
        ctx.strokeStyle = rgba('#7a5a3c', 0.5);
        ctx.lineWidth = Math.max(1, L * 0.02);
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(x, y + L * (0.42 + i * 0.18));
          ctx.lineTo(x + L, y + L * (0.42 + i * 0.18));
          ctx.stroke();
        }
        ctx.fillStyle = PAL.boisFonce;
        ctx.fillRect(x, y + L * 0.86, L, L * 0.14);
        ctx.fillStyle = shade(PAL.mur, -0.3);
        ctx.fillRect(x, y + L * 0.2, L, L * 0.06);
      } else {
        ctx.fillStyle = shade(PAL.mur, -0.2);
        ctx.fillRect(x + L * 0.05, y + L * 0.05, L * 0.9, L * 0.9);
      }
      break;
    }
    case 'c':
    case 'v': {
      ctx.fillStyle = mix(PAL.grotteSol, '#555b7a', hash(tx, ty, 6) * 0.5);
      ctx.fillRect(x, y, L, L);
      taches(ctx, x, y, L, 3, rgba(PAL.grotteParoi, 0.35), 0.1, r);
      ctx.strokeStyle = rgba(PAL.grotteParoi, 0.5);
      ctx.lineWidth = Math.max(1, L * 0.02);
      ctx.beginPath();
      ctx.moveTo(x + r() * L, y + r() * L);
      ctx.lineTo(x + r() * L, y + r() * L);
      ctx.stroke();
      if (sol === 'v') {
        const g = ctx.createRadialGradient(x + L / 2, y + L / 2, L * 0.05, x + L / 2, y + L / 2, L * 0.7);
        g.addColorStop(0, '#05050c');
        g.addColorStop(0.7, '#0d0e1c');
        g.addColorStop(1, rgba('#0d0e1c', 0.4));
        ctx.fillStyle = g;
        ctx.fillRect(x, y, L, L);
      }
      break;
    }
    case 'C': {
      ctx.fillStyle = PAL.grotteParoi;
      ctx.fillRect(x, y, L, L);
      taches(ctx, x, y, L, 2, rgba('#3b3f5c', 0.6), 0.16, r);
      if (v(0, 1) !== 'C' && v(0, 1) !== 'o') {
        ctx.fillStyle = '#3a3f5e';
        ctx.fillRect(x, y + L * 0.55, L, L * 0.45);
        ctx.fillStyle = rgba(PAL.rocheClair, 0.25);
        ctx.fillRect(x, y + L * 0.55, L, L * 0.06);
      }
      break;
    }
    case '^': {
      ctx.fillStyle = PAL.roche;
      ctx.fillRect(x, y, L, L);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = shade(PAL.rocheClair, -i * 0.08);
        ctx.fillRect(x, y + (i * L) / 3, L, L / 3 - L * 0.05);
      }
      break;
    }
    default:
      ctx.fillStyle = PAL.herbe;
      ctx.fillRect(x, y, L, L);
  }
}

/** Herbe qui déborde en festons sur les chemins voisins (transition douce). */
export function peindreTransitions(ctx: CanvasRenderingContext2D, ch: string, tx: number, ty: number, L: number, v: Voisin): void {
  if (!estVert(ch)) return;
  const x = tx * L;
  const y = ty * L;
  const coul = mix(PAL.herbe, PAL.herbeClair, hash(tx >> 1, ty >> 1, 3) * 0.5);
  const cotes: [number, number][] = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  for (const [dx, dy] of cotes) {
    if (!TERRE.has(v(dx, dy))) continue;
    for (let i = 0; i < 4; i++) {
      const t = (i + 0.5) / 4;
      const rr = L * (0.1 + hash(tx * 4 + i, ty, dx + dy * 3) * 0.06);
      const cx = dx === 0 ? x + t * L : dx > 0 ? x + L : x;
      const cy = dy === 0 ? y + t * L : dy > 0 ? y + L : y;
      disque(ctx, cx, cy, rr, coul);
    }
  }
}

/** Décor bas posé sur le sol : rochers, buissons, cristaux, coraux. */
export function peindreDecorBas(ctx: CanvasRenderingContext2D, ch: string, tx: number, ty: number, L: number): void {
  const x = tx * L;
  const y = ty * L;
  const r = alea(hash(tx, ty, 11) * 4294967296);
  if (ch === '#') {
    ellipse(ctx, x + L / 2, y + L * 0.82, L * 0.44, L * 0.14, rgba('#000000', 0.2));
    ctx.fillStyle = PAL.roche;
    ctx.beginPath();
    ctx.moveTo(x + L * 0.06, y + L * 0.85);
    ctx.lineTo(x + L * (0.12 + r() * 0.1), y + L * 0.3);
    ctx.lineTo(x + L * 0.5, y + L * (0.08 + r() * 0.08));
    ctx.lineTo(x + L * (0.82 + r() * 0.08), y + L * 0.3);
    ctx.lineTo(x + L * 0.94, y + L * 0.85);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PAL.rocheClair;
    ctx.beginPath();
    ctx.moveTo(x + L * 0.2, y + L * 0.36);
    ctx.lineTo(x + L * 0.5, y + L * 0.16);
    ctx.lineTo(x + L * 0.62, y + L * 0.42);
    ctx.lineTo(x + L * 0.32, y + L * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PAL.rocheFonce;
    ctx.fillRect(x + L * 0.06, y + L * 0.72, L * 0.88, L * 0.13);
  } else if (ch === 'b') {
    ellipse(ctx, x + L / 2, y + L * 0.86, L * 0.44, L * 0.12, rgba('#000000', 0.2));
    for (const [cx, cy, rr, c] of [
      [0.3, 0.6, 0.27, PAL.feuillageFonce],
      [0.7, 0.6, 0.27, PAL.feuillageFonce],
      [0.5, 0.45, 0.3, PAL.feuillage],
      [0.4, 0.38, 0.14, PAL.feuillageClair],
    ] as const)
      disque(ctx, x + L * cx, y + L * cy, L * rr, c);
    for (let i = 0; i < 3; i++) disque(ctx, x + L * (0.25 + r() * 0.5), y + L * (0.35 + r() * 0.3), L * 0.04, '#e86a6a');
  } else if (ch === '*') {
    ellipse(ctx, x + L / 2, y + L / 2, L * 0.5, L * 0.5, rgba(PAL.cristal, 0.18));
    const pointes = [
      [0.5, 0.1, 0.16],
      [0.3, 0.3, 0.12],
      [0.72, 0.28, 0.12],
    ];
    for (const [cx, top, w] of pointes) {
      ctx.fillStyle = '#5fc4e8';
      ctx.beginPath();
      ctx.moveTo(x + L * (cx! - w!), y + L * 0.85);
      ctx.lineTo(x + L * cx!, y + L * top!);
      ctx.lineTo(x + L * (cx! + w!), y + L * 0.85);
      ctx.fill();
      ctx.fillStyle = '#d9f6ff';
      ctx.beginPath();
      ctx.moveTo(x + L * (cx! - w! * 0.3), y + L * 0.8);
      ctx.lineTo(x + L * cx!, y + L * top!);
      ctx.lineTo(x + L * (cx! + w! * 0.1), y + L * 0.8);
      ctx.fill();
    }
  } else if (ch === 'r') {
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const bx = x + L * (0.25 + i * 0.25);
      const c = [PAL.corail, '#e86a8f', '#f2a65a'][i]!;
      ctx.strokeStyle = c;
      ctx.lineWidth = L * 0.09;
      ctx.beginPath();
      ctx.moveTo(bx, y + L * 0.9);
      ctx.lineTo(bx + (r() - 0.5) * L * 0.2, y + L * 0.4);
      ctx.stroke();
      ctx.lineWidth = L * 0.06;
      ctx.beginPath();
      ctx.moveTo(bx, y + L * 0.65);
      ctx.lineTo(bx + L * 0.12, y + L * (0.3 + r() * 0.2));
      ctx.stroke();
      disque(ctx, bx + (r() - 0.5) * L * 0.2, y + L * 0.38, L * 0.06, shade(c, 0.3));
    }
  }
}
