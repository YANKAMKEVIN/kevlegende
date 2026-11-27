// Dessin du combat : décor, ennemis à gauche, héros à droite, coups, chiffres flottants, Brèche.
import type { BattleState, Combattant } from '../../core/battle/types';
import type { Element } from '../../core/types';
import { ENEMIES } from '../../data/enemies';
import { art, fondCombat } from '../../render/assets';
import { spriteEnnemi } from '../../render/enemies';
import { PAL } from '../../render/palette';
import { APP_HEROS, spritePerso } from '../../render/sprites';
import { ellipse, rgba } from '../../render/util';

export const COULEUR_ELEMENT: Record<Element, string> = {
  neutre: '#fff6e5',
  feu: '#ff8a3d',
  eau: '#5fc4e8',
  vent: '#9be29a',
  terre: '#d9a45a',
  lumiere: '#ffe58a',
  ombre: '#b78cff',
};

export interface EtatVisuel {
  pv: number;
  bouclier: number;
  brise: boolean;
  ko: number;
  flash: number;
  elan: number;
  secoue: number;
}

interface Popup {
  uid: string;
  texte: string;
  couleur: string;
  t: number;
  grand: boolean;
}

interface Particule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  couleur: string;
}

export class VueCombat {
  aff = new Map<string, EtatVisuel>();
  private popups: Popup[] = [];
  private parts: Particule[] = [];
  private pos = new Map<string, { x: number; y: number; s: number }>();
  acteur: string | null = null;
  ciblesPossibles: string[] = [];
  cibleSurvol: string | null = null;
  secousse = 0;
  flashEcran = 0;
  t = 0;

  initialiser(b: BattleState): void {
    this.aff.clear();
    this.popups = [];
    this.parts = [];
    for (const c of b.combattants) this.aff.set(c.uid, { pv: c.pv, bouclier: c.bouclier, brise: c.brise > 0, ko: c.pv <= 0 ? 1 : 0, flash: 0, elan: 0, secoue: 0 });
  }

  e(uid: string): EtatVisuel {
    let v = this.aff.get(uid);
    if (!v) {
      v = { pv: 0, bouclier: 0, brise: false, ko: 0, flash: 0, elan: 0, secoue: 0 };
      this.aff.set(uid, v);
    }
    return v;
  }

  popup(uid: string, texte: string, couleur: string, grand = false): void {
    this.popups.push({ uid, texte, couleur, t: 0, grand });
  }

  eclat(uid: string, el: Element, n = 18): void {
    const p = this.pos.get(uid);
    if (!p) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 60 + Math.random() * 160;
      this.parts.push({ x: p.x, y: p.y - p.s * 0.45, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, t: 0, couleur: COULEUR_ELEMENT[el] });
    }
  }

  /** Combattant sous un point de l'écran (pour viser au doigt). */
  sous(x: number, y: number): string | null {
    let best: string | null = null;
    let d = Infinity;
    for (const [uid, p] of this.pos) {
      const dd = Math.hypot(x - p.x, y - (p.y - p.s * 0.45));
      if (dd < p.s * 0.6 && dd < d) {
        d = dd;
        best = uid;
      }
    }
    return best;
  }

  dessiner(ctx: CanvasRenderingContext2D, b: BattleState, carte: string, w: number, h: number, dt: number): void {
    this.t += dt;
    let sx = 0;
    if (this.secousse > 0) {
      this.secousse = Math.max(0, this.secousse - dt);
      sx = Math.sin(this.t * 80) * 8 * this.secousse;
    }
    ctx.save();
    ctx.translate(sx, 0);
    this.fond(ctx, carte, w, h);
    const portrait = h > w * 1.1;
    const sol = h * (portrait ? 0.5 : 0.62);
    const ennemis = b.combattants.filter((c) => c.camp === 'ennemis');
    const heros = b.combattants.filter((c) => c.camp === 'heros');
    const base = portrait ? Math.min(w * 0.26, h * 0.2) : Math.min(w * 0.2, h * 0.3);
    // Placement : ennemis en arc à gauche, héros en colonne décalée à droite.
    ennemis.forEach((c, i) => {
      const def = ENEMIES[c.ref];
      const s = base * (c.boss ? 1.75 : 1) * (def?.forme === 'serpent' && c.boss ? 1.1 : 1);
      const n = ennemis.length;
      const x = w * (n === 1 ? 0.3 : 0.14 + (i / Math.max(1, n - 1)) * 0.3);
      const y = sol + (i % 2) * h * 0.06 - (n === 1 ? 0 : h * 0.03);
      this.pos.set(c.uid, { x, y, s });
    });
    heros.forEach((c, i) => {
      const s = base * 0.85;
      this.pos.set(c.uid, { x: w * (portrait ? 0.62 + i * 0.13 : 0.66 + i * 0.1), y: sol - h * 0.06 + i * h * (portrait ? 0.05 : 0.08), s });
    });
    const ordre = [...b.combattants].sort((a, c) => this.pos.get(a.uid)!.y - this.pos.get(c.uid)!.y);
    for (const c of ordre) this.combattant(ctx, c);
    // Particules.
    for (const p of this.parts) {
      p.t += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 300 * dt;
      ctx.globalAlpha = Math.max(0, 1 - p.t / 0.7);
      ctx.fillStyle = p.couleur;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 + (1 - p.t) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.parts = this.parts.filter((p) => p.t < 0.7);
    // Chiffres flottants.
    for (const p of this.popups) {
      p.t += dt;
      const pos = this.pos.get(p.uid);
      if (!pos) continue;
      const k = Math.min(1, p.t / 0.15);
      const y = pos.y - pos.s * 0.95 - p.t * 40;
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, p.t - 0.9) / 0.4);
      ctx.font = `800 ${Math.round((p.grand ? 34 : 26) * (0.6 + 0.4 * k))}px Fredoka, Nunito, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(30,20,40,0.85)';
      ctx.strokeText(p.texte, pos.x, y);
      ctx.fillStyle = p.couleur;
      ctx.fillText(p.texte, pos.x, y);
    }
    ctx.globalAlpha = 1;
    this.popups = this.popups.filter((p) => p.t < 1.3);
    ctx.restore();
    if (this.flashEcran > 0) {
      this.flashEcran = Math.max(0, this.flashEcran - dt * 2.5);
      ctx.fillStyle = rgba('#ffffff', this.flashEcran * 0.6);
      ctx.fillRect(0, 0, w, h);
    }
  }

  private fond(ctx: CanvasRenderingContext2D, carte: string, w: number, h: number): void {
    const img = art(fondCombat(carte));
    if (img) {
      const r = Math.max(w / img.width, h / img.height);
      const iw = img.width * r;
      const ih = img.height * r;
      ctx.drawImage(img, (w - iw) / 2, (h - ih) * 0.7, iw, ih);
    } else {
      const grotte = carte.startsWith('grotte');
      const brume = carte === 'epave';
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, grotte ? '#141629' : brume ? '#3e3560' : '#79c0e2');
      g.addColorStop(0.6, grotte ? '#2a2e4a' : brume ? '#8f80ad' : '#cfe9f5');
      g.addColorStop(1, grotte ? '#3a3f5e' : brume ? '#5b4b7a' : '#f6e7c8');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = grotte ? PAL.grotteSol : brume ? '#6f5640' : PAL.herbe;
      ctx.beginPath();
      const sol = h * (h > w * 1.1 ? 0.5 : 0.62);
      ctx.ellipse(w / 2, sol + h * 0.18, w * 0.8, h * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Voile sombre léger pour la lisibilité de l'interface.
    const v = ctx.createLinearGradient(0, h * 0.55, 0, h);
    v.addColorStop(0, rgba('#1a1424', 0));
    v.addColorStop(1, rgba('#1a1424', 0.45));
    ctx.fillStyle = v;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
  }

  private combattant(ctx: CanvasRenderingContext2D, c: Combattant): void {
    const p = this.pos.get(c.uid)!;
    const v = this.e(c.uid);
    v.flash = Math.max(0, v.flash - 0.04);
    v.elan = Math.max(0, v.elan - 0.035);
    v.secoue = Math.max(0, v.secoue - 0.05);
    if (v.ko >= 1 && c.camp === 'ennemis') return;
    const dir = c.camp === 'ennemis' ? 1 : -1;
    const elan = Math.sin(v.elan * Math.PI) * p.s * 0.35 * dir;
    const tremble = Math.sin(this.t * 90) * v.secoue * 6;
    const x = p.x + elan + tremble;
    const respire = Math.sin(this.t * 2.4 + p.x) * p.s * 0.015;
    ctx.save();
    ctx.globalAlpha = c.camp === 'ennemis' ? 1 - v.ko : 1;
    // Repère de cible / d'acteur.
    if (this.ciblesPossibles.includes(c.uid)) {
      const pulse = 0.5 + 0.5 * Math.sin(this.t * 6);
      ellipse(ctx, x, p.y, p.s * 0.45, p.s * 0.12, rgba(c.uid === this.cibleSurvol ? '#ffe58a' : '#ffffff', 0.25 + 0.3 * pulse));
      ctx.fillStyle = c.uid === this.cibleSurvol ? '#ffe58a' : '#fff6e5';
      const ay = p.y - p.s * 1.05 - pulse * 6;
      ctx.beginPath();
      ctx.moveTo(x - 10, ay - 14);
      ctx.lineTo(x + 10, ay - 14);
      ctx.lineTo(x, ay);
      ctx.fill();
    }
    if (c.uid === this.acteur) ellipse(ctx, x, p.y, p.s * 0.4, p.s * 0.11, rgba('#8fe3ff', 0.45));
    if (c.camp === 'ennemis') {
      const def = ENEMIES[c.ref];
      const img = art(`ennemi_${c.ref}`);
      const s = p.s;
      ellipse(ctx, x, p.y, s * 0.38, s * 0.08, rgba('#000000', 0.3));
      const src = img ?? (def ? spriteEnnemi(def.forme, def.teinte, 256) : null);
      if (src) ctx.drawImage(src, x - s / 2, p.y - s * 0.95 + respire, s, s);
      if (v.flash > 0) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = v.flash;
        if (src) ctx.drawImage(src, x - s / 2, p.y - s * 0.95 + respire, s, s);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      if (v.brise) this.etoiles(ctx, x, p.y - s, s);
      this.barreEnnemi(ctx, c, v, x, p.y + 8, s);
    } else {
      const app = APP_HEROS[c.ref];
      if (app) {
        const sp = spritePerso(app, 'gauche', v.elan > 0 ? 1 : 0, 128);
        const k = p.s / 64;
        const koRot = c.pv <= 0 && v.pv <= 0;
        ctx.translate(x, p.y);
        if (koRot) {
          ctx.rotate(-Math.PI / 2);
          ctx.globalAlpha = 0.7;
        }
        ctx.drawImage(sp, -32 * k, -96 * k + (koRot ? 0 : respire), 64 * k, 96 * k);
        if (v.flash > 0) {
          ctx.fillStyle = rgba('#ff6a6a', v.flash * 0.35);
          ctx.fillRect(-32 * k, -96 * k, 64 * k, 96 * k);
        }
      }
    }
    ctx.restore();
  }

  private etoiles(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
    for (let i = 0; i < 3; i++) {
      const a = this.t * 3 + (i * Math.PI * 2) / 3;
      const ex = x + Math.cos(a) * s * 0.3;
      const ey = y + Math.sin(a) * s * 0.08;
      ctx.fillStyle = '#ffe58a';
      ctx.beginPath();
      for (let k = 0; k < 10; k++) {
        const r = k % 2 ? 4 : 10;
        const aa = (k * Math.PI) / 5;
        ctx.lineTo(ex + Math.cos(aa) * r, ey + Math.sin(aa) * r);
      }
      ctx.fill();
    }
  }

  private barreEnnemi(ctx: CanvasRenderingContext2D, c: Combattant, v: EtatVisuel, x: number, y: number, s: number): void {
    const w = Math.max(70, s * 0.6);
    ctx.fillStyle = 'rgba(20,14,30,0.75)';
    ctx.beginPath();
    ctx.roundRect(x - w / 2 - 3, y - 3, w + 6, 26, 8);
    ctx.fill();
    ctx.fillStyle = '#3a2a3e';
    ctx.fillRect(x - w / 2, y, w, 6);
    ctx.fillStyle = v.pv / c.stats.pvMax < 0.3 ? '#f08a7e' : '#f2b84b';
    ctx.fillRect(x - w / 2, y, (w * Math.max(0, v.pv)) / c.stats.pvMax, 6);
    // Bouclier (Brèche) et faiblesses découvertes.
    ctx.font = '700 12px Nunito, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = v.brise ? '#ffe58a' : '#cfe9f5';
    ctx.fillText(v.brise ? 'BRISÉ' : `◆ ${v.bouclier}`, x - w / 2, y + 20);
    let fx = x + w / 2;
    for (const el of [...c.faiblesses].reverse()) {
      const connue = c.revelees.includes(el);
      ctx.fillStyle = connue ? COULEUR_ELEMENT[el] : 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.arc(fx - 6, y + 15, 5, 0, Math.PI * 2);
      ctx.fill();
      if (!connue) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 9px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('?', fx - 6, y + 18);
      }
      fx -= 13;
    }
  }
}
