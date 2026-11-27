// Scène d'exploration : ciel, couche de la carte, objets triés en profondeur, lumière, caméra.
import type { Jeu } from '../core/game';
import { pnjVisibles, propsVisibles } from '../core/world/explore';
import { ancre, condVraie } from '../core/world/map';
import type { Dir } from '../core/types';
import { construireCouche, type CoucheCarte } from './maplayer';
import { spriteArbre, type Essence } from './nature';
import { PAL } from './palette';
import { spriteCoffre, spriteProp } from './props';
import { Ciel } from './sky';
import { APP_HEROS, spritePerso } from './sprites';
import { ctx2d, disque, rgba, toile } from './util';

export interface PosVisuelle {
  x: number;
  y: number;
  dir: Dir;
  /** Progression du pas en cours (0 = immobile). */
  marche: number;
  pas: number;
}

interface Objet {
  y: number;
  dessin: () => void;
}

const ESSENCES: Record<string, Essence> = { col: 'sapin', colline: 'automne', epave: 'brume', phare: 'automne', ambrelune: 'palmier', dunes: 'palmier', ruines: 'palmier', canyon: 'palmier', fanal_sables: 'palmier', givrebourg: 'givre', pentes: 'givre', lac_givre: 'givre', col_blizzard: 'givre', fanal_cimes: 'givre' };

export class Scene {
  readonly ctx: CanvasRenderingContext2D;
  /** Taille d'une case à l'écran (pixels CSS). */
  T = 48;
  w = 0;
  h = 0;
  dpr = 1;
  camX = 0;
  camY = 0;
  private couche: CoucheCarte | null = null;
  readonly ciel = new Ciel();
  private nuit: HTMLCanvasElement | null = null;
  /** Positions passées du joueur (la plus récente d'abord) : la troupe suit ce chemin. */
  private trace: { x: number; y: number }[] = [];
  secousse = 0;
  flash: { couleur: string; t: number } | null = null;

  constructor(readonly canvas: HTMLCanvasElement) {
    this.ctx = ctx2d(canvas);
  }

  redimensionner(w: number, h: number, dpr: number): void {
    this.w = w;
    this.h = h;
    this.dpr = Math.min(dpr, 2);
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.T = Math.round(Math.max(36, Math.min(64, Math.min(w, h) / 9)));
    this.couche = null;
  }

  /** À appeler quand le joueur quitte une case (marche normale). */
  pas(depuis: { x: number; y: number }): void {
    this.trace.unshift({ ...depuis });
    if (this.trace.length > 6) this.trace.length = 6;
  }
  reinitialiserTrace(): void {
    this.trace = [];
  }

  private assurerCouche(j: Jeu): CoucheCarte {
    const c = j.carte();
    // Résolution de la couche : nette sur l'écran, dans un budget mémoire raisonnable pour mobile (~9 Mpx).
    const budget = Math.floor(Math.sqrt(9_000_000 / (c.largeur * (c.hauteur + 2))));
    const L = Math.max(24, Math.min(Math.round(this.T * this.dpr), budget, 96));
    if (!this.couche || this.couche.id !== c.def.id || this.couche.L !== L) this.couche = construireCouche(c, L);
    return this.couche;
  }

  private positionsTroupe(v: PosVisuelle, n: number): { x: number; y: number }[] {
    const pts = [{ x: v.x, y: v.y }, ...this.trace];
    const out: { x: number; y: number }[] = [];
    for (let k = 1; k <= n; k++) {
      let reste = k * 0.9;
      let p = pts[0]!;
      let trouve = false;
      for (let i = 1; i < pts.length; i++) {
        const q = pts[i]!;
        const d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d >= reste && d > 0) {
          out.push({ x: p.x + ((q.x - p.x) * reste) / d, y: p.y + ((q.y - p.y) * reste) / d });
          trouve = true;
          break;
        }
        reste -= d;
        p = q;
      }
      if (!trouve) out.push({ ...p });
    }
    return out;
  }

  dessiner(j: Jeu, v: PosVisuelle, t: number, dt: number): void {
    const ctx = this.ctx;
    const T = this.T;
    const c = j.carte();
    const amb = c.def.ambiance;
    const couche = this.assurerCouche(j);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    // Caméra centrée sur le joueur, bornée à la carte (avec un peu de ciel autour de l'île).
    const mapW = c.largeur * T;
    const mapH = c.hauteur * T;
    const cible = (centre: number, taille: number, ecran: number) =>
      taille + T * 2 <= ecran ? (taille - ecran) / 2 : Math.max(-T, Math.min(taille - ecran + T, centre - ecran / 2));
    this.camX = Math.round(cible((v.x + 0.5) * T, mapW, this.w));
    this.camY = Math.round(cible((v.y + 0.5) * T, mapH, this.h));
    let sx = 0;
    let sy = 0;
    if (this.secousse > 0) {
      this.secousse = Math.max(0, this.secousse - dt);
      sx = Math.sin(t * 70) * 6 * this.secousse;
      sy = Math.cos(t * 53) * 4 * this.secousse;
    }
    this.ciel.dessiner(ctx, this.w, this.h, amb, t, this.camX, this.camY);
    ctx.save();
    ctx.translate(-this.camX + sx, -this.camY + sy);
    // Couche du sol (seule la partie visible est copiée).
    const k = couche.L / T;
    const x0 = Math.max(0, this.camX - T);
    const y0 = Math.max(0, this.camY - T);
    const x1 = Math.min(couche.canvas.width / k, this.camX + this.w + T);
    const y1 = Math.min(couche.canvas.height / k, this.camY + this.h + T);
    if (x1 > x0 && y1 > y0) ctx.drawImage(couche.canvas, x0 * k, y0 * k, (x1 - x0) * k, (y1 - y0) * k, x0, y0, x1 - x0, y1 - y0);
    const visible = (tx: number, ty: number, marge = 3) =>
      tx * T > this.camX - marge * T && tx * T < this.camX + this.w + marge * T && ty * T > this.camY - marge * T && ty * T < this.camY + this.h + marge * T;
    // Reflets animés de l'eau.
    ctx.strokeStyle = rgba(PAL.eauClair, 0.55);
    ctx.lineWidth = Math.max(1, T * 0.04);
    ctx.lineCap = 'round';
    for (const e of couche.eau) {
      if (!visible(e.x, e.y, 1)) continue;
      const ph = t * 1.6 + e.x * 0.9 + e.y * 1.7;
      const ox = e.x * T + T * (0.25 + 0.15 * Math.sin(ph));
      const oy = e.y * T + T * (0.35 + ((e.x * 7 + e.y * 3) % 5) * 0.1);
      ctx.globalAlpha = 0.35 + 0.35 * Math.sin(ph * 1.3);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + T * 0.3, oy);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Objets triés par profondeur.
    const objets: Objet[] = [];
    // Les sprites sont rendus à la résolution de l'écran (nets sur mobile), puis réduits à la taille d'une case.
    const R = Math.round(T * this.dpr);
    const k1 = T / R;
    const img = (c: HTMLCanvasElement, x: number, y: number) => ctx.drawImage(c, x, y, c.width * k1, c.height * k1);
    const ess = ESSENCES[c.def.id] ?? 'feuillu';
    for (const a of couche.arbres) {
      if (!visible(a.x, a.y)) continue;
      const sp = spriteArbre(R, ess === 'feuillu' && a.v > 0.85 ? 'sapin' : ess, Math.round(a.v * 3) / 3);
      objets.push({ y: a.y + 0.6, dessin: () => img(sp, a.x * T + T / 2 - (sp.width * k1) / 2, (a.y + 1) * T - sp.height * k1 + T * 0.15) });
    }
    const portes = (c.def.portes ?? []).map((p) => ancre(c, p.ancre));
    for (const pr of propsVisibles(j)) {
      const o = ancre(c, pr.ancre);
      const w = pr.w ?? 1;
      const h = pr.h ?? 1;
      if (!visible(o.x, o.y, 5 + w)) continue;
      const cols = portes.filter((p) => p.y === o.y + h - 1 && p.x >= o.x && p.x < o.x + w).map((p) => p.x - o.x);
      const actif = !!pr.etat && condVraie(pr.etat, j.p.flags);
      const sp = spriteProp(pr.type, w, h, actif, R, cols);
      objets.push({
        y: o.y + h - 1 + 0.5,
        dessin: () => {
          img(sp.canvas, o.x * T + sp.ox * k1, o.y * T + sp.oy * k1);
          if (pr.type === 'moulin') this.ailes(o.x * T + (w * T) / 2, o.y * T + T * 0.9, T, t);
          if (pr.type === 'fanal' && actif) this.halo(o.x * T + (w * T) / 2, o.y * T - T * 0.4, T * (2.2 + 0.2 * Math.sin(t * 3)), PAL.ambre);
          if (pr.type === 'herbe_lune') this.halo(o.x * T + T / 2, o.y * T + T * 0.3, T * (0.6 + 0.15 * Math.sin(t * 2 + o.x)), '#d9f6ff');
        },
      });
    }
    for (const co of c.def.coffres ?? []) {
      const o = ancre(c, co.ancre);
      if (!visible(o.x, o.y)) continue;
      const sp = spriteCoffre(R, j.p.coffres.includes(`${c.def.id}:${co.id}`));
      objets.push({ y: o.y + 0.4, dessin: () => img(sp.canvas, o.x * T + sp.ox * k1, o.y * T + sp.oy * k1) });
    }
    for (const n of pnjVisibles(j)) {
      if (!visible(n.x, n.y)) continue;
      const dir = j.regards[n.def.id] ?? (n.def.flane ? (['bas', 'gauche', 'bas', 'droite'] as const)[Math.floor((t * 0.4 + n.x) % 4)]! : (n.def.dir ?? 'bas'));
      const bob = n.def.flane ? Math.abs(Math.sin(t * 3 + n.x)) * T * 0.04 : 0;
      const sp = spritePerso(n.def.apparence, dir, 0, R);
      objets.push({ y: n.y + 0.5, dessin: () => img(sp, n.x * T, (n.y + 1) * T - sp.height * k1 - bob) });
    }
    const troupe = j.p.equipe.slice(1);
    const pos = this.positionsTroupe(v, troupe.length);
    troupe.forEach((h, i) => {
      const p = pos[i]!;
      const devant = i === 0 ? v : pos[i - 1]!;
      const dx = devant.x - p.x;
      const dy = devant.y - p.y;
      const dir: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'droite' : 'gauche') : Math.abs(dy) > 0.01 ? (dy > 0 ? 'bas' : 'haut') : v.dir;
      const app = APP_HEROS[h.id];
      if (!app) return;
      const sp = spritePerso(app, dir, v.marche > 0 ? 1 + ((v.pas + i) % 2) : 0, R);
      objets.push({ y: p.y + 0.5 - 0.01 * (i + 1), dessin: () => img(sp, p.x * T, (p.y + 1) * T - sp.height * k1) });
    });
    const chef = j.p.equipe[0];
    const appChef = (chef && APP_HEROS[chef.id]) ?? APP_HEROS['ael']!;
    const spJ = spritePerso(appChef, v.dir, v.marche > 0 && v.marche < 0.85 ? 1 + (v.pas % 2) : 0, R);
    objets.push({ y: v.y + 0.5, dessin: () => img(spJ, v.x * T, (v.y + 1) * T - spJ.height * k1) });
    objets.sort((a, b) => a.y - b.y);
    for (const o of objets) o.dessin();
    ctx.restore();
    this.lumiere(j, v, couche, t);
    if (this.flash) {
      this.flash.t -= dt;
      if (this.flash.t <= 0) this.flash = null;
      else {
        ctx.fillStyle = rgba(this.flash.couleur, Math.min(1, this.flash.t * 2));
        ctx.fillRect(0, 0, this.w, this.h);
      }
    }
  }

  private ailes(cx: number, cy: number, T: number, t: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.8);
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = PAL.boisFonce;
      ctx.fillRect(-T * 0.04, 0, T * 0.08, T * 1.6);
      ctx.fillStyle = '#efe6d2';
      ctx.fillRect(T * 0.04, T * 0.35, T * 0.32, T * 1.2);
    }
    ctx.restore();
    ctx.fillStyle = PAL.boisFonce;
    ctx.beginPath();
    ctx.arc(cx, cy, T * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  private halo(x: number, y: number, r: number, couleur: string): void {
    const ctx = this.ctx;
    const g = ctx.createRadialGradient(x, y, 1, x, y, r);
    g.addColorStop(0, rgba(couleur, 0.45));
    g.addColorStop(1, rgba(couleur, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  /** Ambiance lumineuse : obscurité des grottes, chaleur des intérieurs, crépuscule, brume. */
  private lumiere(j: Jeu, v: PosVisuelle, couche: CoucheCarte, t: number): void {
    const ctx = this.ctx;
    const amb = j.carte().def.ambiance;
    const T = this.T;
    const px = (v.x + 0.5) * T - this.camX;
    const py = (v.y + 0.3) * T - this.camY;
    if (amb === 'grotte') {
      if (!this.nuit || this.nuit.width !== Math.ceil(this.w) || this.nuit.height !== Math.ceil(this.h)) this.nuit = toile(this.w, this.h);
      const n = ctx2d(this.nuit);
      n.globalCompositeOperation = 'source-over';
      n.clearRect(0, 0, this.w, this.h);
      // La glace renvoie la lumière : grotte de givre bleutée et bien moins sombre.
      n.fillStyle = j.carte().def.solDefaut === 'a' ? 'rgba(14,30,62,0.5)' : 'rgba(6,7,18,0.82)';
      n.fillRect(0, 0, this.w, this.h);
      n.globalCompositeOperation = 'destination-out';
      const trou = (x: number, y: number, r: number) => {
        const g = n.createRadialGradient(x, y, r * 0.1, x, y, r);
        g.addColorStop(0, 'rgba(0,0,0,1)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        n.fillStyle = g;
        n.fillRect(x - r, y - r, r * 2, r * 2);
      };
      trou(px, py, T * (3.6 + 0.1 * Math.sin(t * 5)));
      for (const cr of couche.cristaux) trou((cr.x + 0.5) * T - this.camX, (cr.y + 0.5) * T - this.camY, T * 1.8);
      for (const pr of propsVisibles(j)) if (pr.type === 'autel' || pr.type === 'cristaux' || pr.type === 'lanterne') {
        const o = ancre(j.carte(), pr.ancre);
        trou((o.x + (pr.w ?? 1) / 2) * T - this.camX, o.y * T - this.camY, T * 3);
      }
      ctx.drawImage(this.nuit, 0, 0, this.w, this.h);
      const g = ctx.createRadialGradient(px, py, 0, px, py, T * 3);
      g.addColorStop(0, rgba('#ffd98a', 0.12));
      g.addColorStop(1, rgba('#ffd98a', 0));
      ctx.fillStyle = g;
      ctx.fillRect(px - T * 3, py - T * 3, T * 6, T * 6);
    } else if (amb === 'interieur') {
      const g = ctx.createRadialGradient(this.w / 2, this.h / 2, Math.min(this.w, this.h) * 0.3, this.w / 2, this.h / 2, Math.max(this.w, this.h) * 0.75);
      g.addColorStop(0, rgba('#ffcf8a', 0.06));
      g.addColorStop(1, rgba('#1a0f14', 0.55));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.w, this.h);
    } else if (amb === 'crepuscule') {
      ctx.fillStyle = rgba('#f08a5a', 0.14);
      ctx.fillRect(0, 0, this.w, this.h);
      const g = ctx.createLinearGradient(0, 0, 0, this.h);
      g.addColorStop(0, rgba('#3d3f7a', 0.25));
      g.addColorStop(1, rgba('#3d3f7a', 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.w, this.h);
    } else if (amb === 'desert') {
      // Chaleur dorée et sable porté par le vent.
      const g = ctx.createLinearGradient(0, 0, 0, this.h);
      g.addColorStop(0, rgba('#ffd27a', 0.12));
      g.addColorStop(1, rgba('#f08a3a', 0.08));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.fillStyle = rgba('#f7e2b0', 0.55);
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 97 + t * (60 + (i % 5) * 18)) % (this.w + 40)) - 20;
        const sy = ((i * 211) % this.h) + Math.sin(t * 1.3 + i) * 12;
        ctx.fillRect(sx, sy, 2 + (i % 3), 1.2);
      }
    } else if (amb === 'neige') {
      // Lumière froide et flocons qui tombent en dérivant.
      ctx.fillStyle = rgba('#cfe2ff', 0.1);
      ctx.fillRect(0, 0, this.w, this.h);
      for (let i = 0; i < 70; i++) {
        const prof = 0.5 + (i % 4) * 0.25;
        const fy = ((i * 137 + t * 38 * prof) % (this.h + 20)) - 10;
        const fx = ((i * 223 + Math.sin(t * 0.8 + i) * 22 + t * 12 * prof) % (this.w + 20)) - 10;
        disque(ctx, fx, fy, 1 + prof * 1.4, rgba('#ffffff', 0.5 + prof * 0.3));
      }
    } else if (amb === 'brume' || amb === 'nuit') {
      ctx.fillStyle = rgba(amb === 'nuit' ? '#1c2547' : PAL.brume, 0.28);
      ctx.fillRect(0, 0, this.w, this.h);
      for (let i = 0; i < 5; i++) {
        const bx = ((i * 263 + t * 18) % (this.w + 400)) - 200;
        const by = (i * 173) % this.h;
        const g = ctx.createRadialGradient(bx, by, 10, bx, by, 200);
        g.addColorStop(0, rgba('#c9bedb', 0.22));
        g.addColorStop(1, rgba('#c9bedb', 0));
        ctx.fillStyle = g;
        ctx.fillRect(bx - 200, by - 200, 400, 400);
      }
    }
  }
}
