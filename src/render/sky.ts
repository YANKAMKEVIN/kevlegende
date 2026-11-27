// Ciel et Mer de Brume : dégradé selon l'ambiance, nuages en parallaxe, astres.
import type { Ambiance } from '../core/world/mapdef';
import { PAL } from './palette';
import { ctx2d, disque, rgba, toile } from './util';

interface Teintes {
  haut: string;
  milieu: string;
  bas: string;
  nuage: string;
  brume: string;
}

const TEINTES: Record<Ambiance, Teintes> = {
  jour: { haut: '#6fb8de', milieu: '#a9daef', bas: '#f6e7c8', nuage: '#ffffff', brume: '#e9f4fb' },
  aube: { haut: '#7b8fcf', milieu: '#f2b8b0', bas: '#fbe2b8', nuage: '#fff0e6', brume: '#f8dcd0' },
  crepuscule: { haut: '#3d3f7a', milieu: '#c9708a', bas: '#f5b66b', nuage: '#f7c7a8', brume: '#d99aa8' },
  nuit: { haut: PAL.cielNuit[0], milieu: PAL.cielNuit[1], bas: PAL.cielNuit[2], nuage: '#7d7aa8', brume: '#4a4678' },
  brume: { haut: '#3e3560', milieu: '#6d5b8c', bas: '#a596b8', nuage: '#c9bedb', brume: '#8f80ad' },
  grotte: { haut: '#0b0c16', milieu: '#121426', bas: '#191c33', nuage: '#232744', brume: '#14162a' },
  desert: { haut: '#5fa8d6', milieu: '#f2d49a', bas: '#f5b968', nuage: '#fff1d6', brume: '#f2d2a0' },
  neige: { haut: '#86b4dc', milieu: '#cfe2f3', bas: '#f1f5fb', nuage: '#ffffff', brume: '#e2ecf7' },
  interieur: { haut: '#1a1320', milieu: '#1f1726', bas: '#24192c', nuage: '#2a2032', brume: '#1f1726' },
};

const nuages: HTMLCanvasElement[] = [];

function spriteNuage(i: number, couleur: string): HTMLCanvasElement {
  const w = 260;
  const h = 140;
  const c = toile(w, h);
  const x = ctx2d(c);
  const bosses = [
    [60, 70, 38],
    [110, 52, 50],
    [165, 60, 42],
    [205, 75, 30],
    [85, 82, 30],
    [140, 84, 34],
  ];
  x.fillStyle = rgba('#8aa6c4', 0.35);
  for (const [bx, by, r] of bosses) {
    x.beginPath();
    x.arc(bx! + 4, by! + 8 + i, r!, 0, Math.PI * 2);
    x.fill();
  }
  for (const [bx, by, r] of bosses) disque(x, bx!, by!, r!, couleur);
  x.fillStyle = rgba('#ffffff', 0.5);
  for (const [bx, by, r] of bosses.slice(0, 3)) {
    x.beginPath();
    x.arc(bx! - r! * 0.25, by! - r! * 0.3, r! * 0.45, 0, Math.PI * 2);
    x.fill();
  }
  return c;
}

export class Ciel {
  private fond: HTMLCanvasElement | null = null;
  private cle = '';

  dessiner(ctx: CanvasRenderingContext2D, w: number, h: number, amb: Ambiance, t: number, camX: number, camY: number): void {
    const k = `${amb}:${w}x${h}`;
    const te = TEINTES[amb];
    if (k !== this.cle || !this.fond) {
      this.cle = k;
      this.fond = toile(w, h);
      const f = ctx2d(this.fond);
      const g = f.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, te.haut);
      g.addColorStop(0.55, te.milieu);
      g.addColorStop(1, te.bas);
      f.fillStyle = g;
      f.fillRect(0, 0, w, h);
      if (amb === 'nuit' || amb === 'crepuscule' || amb === 'brume') {
        for (let i = 0; i < 90; i++) {
          const sx = (i * 9301 + 49297) % 233280;
          disque(f, (sx / 233280) * w, ((i * 7919) % 997) / 997 * h * 0.5, (i % 3) * 0.5 + 0.6, rgba('#ffffff', 0.25 + (i % 4) * 0.12));
        }
      }
      if (amb === 'jour' || amb === 'aube' || amb === 'crepuscule') {
        const sx = w * 0.78;
        const sy = h * (amb === 'jour' ? 0.14 : 0.42);
        const halo = f.createRadialGradient(sx, sy, 4, sx, sy, Math.min(w, h) * 0.35);
        halo.addColorStop(0, rgba('#fff8e0', 0.9));
        halo.addColorStop(0.15, rgba('#fff2c8', 0.5));
        halo.addColorStop(1, rgba('#fff2c8', 0));
        f.fillStyle = halo;
        f.fillRect(0, 0, w, h);
      }
    }
    ctx.drawImage(this.fond, 0, 0);
    if (amb === 'interieur' || amb === 'grotte') return;
    if (nuages.length === 0 || nuages[0]!.dataset['c'] !== te.nuage) {
      nuages.length = 0;
      for (let i = 0; i < 3; i++) {
        const n = spriteNuage(i, te.nuage);
        n.dataset['c'] = te.nuage;
        nuages.push(n);
      }
    }
    // Mer de Brume tout en bas et nuages en deux plans de parallaxe.
    const mer = ctx.createLinearGradient(0, h * 0.55, 0, h);
    mer.addColorStop(0, rgba(te.brume, 0));
    mer.addColorStop(1, rgba(te.brume, 0.85));
    ctx.fillStyle = mer;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
    for (let plan = 0; plan < 2; plan++) {
      const vitesse = plan === 0 ? 6 : 14;
      const par = plan === 0 ? 0.15 : 0.35;
      const echelle = plan === 0 ? 0.7 : 1.15;
      const n = plan === 0 ? 7 : 5;
      ctx.globalAlpha = plan === 0 ? 0.7 : 0.9;
      for (let i = 0; i < n; i++) {
        const sp = nuages[i % 3]!;
        const largeur = w + 400;
        const bx = (((i * 397 + t * vitesse - camX * par) % largeur) + largeur) % largeur - 260;
        const by = ((i * 211) % Math.max(1, h)) * 0.8 + (plan === 0 ? 0 : h * 0.25) - camY * par * 0.5;
        const yy = ((by % (h + 120)) + h + 120) % (h + 120) - 100;
        ctx.drawImage(sp, bx, yy, sp.width * echelle, sp.height * echelle);
      }
    }
    ctx.globalAlpha = 1;
  }
}
