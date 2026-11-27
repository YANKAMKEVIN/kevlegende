// Commandes : clavier (flèches/ZQSD/WASD, Entrée/Espace, Échap) et croix tactile + boutons A / Menu.
import type { Dir } from '../core/types';

export type Bouton = 'a' | 'b' | 'menu';

const TOUCHES: Record<string, Dir | Bouton> = {
  ArrowUp: 'haut',
  ArrowDown: 'bas',
  ArrowLeft: 'gauche',
  ArrowRight: 'droite',
  KeyW: 'haut',
  KeyZ: 'haut',
  KeyS: 'bas',
  KeyA: 'gauche',
  KeyQ: 'gauche',
  KeyD: 'droite',
  Enter: 'a',
  Space: 'a',
  KeyE: 'a',
  Escape: 'menu',
  KeyM: 'menu',
  Backspace: 'b',
  KeyX: 'b',
};

const estDir = (v: string): v is Dir => v === 'haut' || v === 'bas' || v === 'gauche' || v === 'droite';

export class Controles {
  /** Directions maintenues, la plus récente en dernier. */
  private dirs: Dir[] = [];
  private appuis: Bouton[] = [];
  private ecouteurs: ((b: Bouton) => void)[] = [];
  private nettoyage: (() => void)[] = [];

  constructor(cible: Window = window) {
    const bas = (e: KeyboardEvent) => {
      const v = TOUCHES[e.code];
      if (!v) return;
      const champ = (e.target as HTMLElement | null)?.tagName;
      if (champ === 'INPUT' || champ === 'TEXTAREA') return;
      e.preventDefault();
      if (estDir(v)) this.presser(v);
      else if (!e.repeat) this.bouton(v);
    };
    const haut = (e: KeyboardEvent) => {
      const v = TOUCHES[e.code];
      if (v && estDir(v)) this.relacher(v);
    };
    const perte = () => (this.dirs = []);
    cible.addEventListener('keydown', bas);
    cible.addEventListener('keyup', haut);
    cible.addEventListener('blur', perte);
    this.nettoyage.push(() => {
      cible.removeEventListener('keydown', bas);
      cible.removeEventListener('keyup', haut);
      cible.removeEventListener('blur', perte);
    });
  }

  presser(d: Dir): void {
    this.dirs = this.dirs.filter((x) => x !== d);
    this.dirs.push(d);
  }
  relacher(d: Dir): void {
    this.dirs = this.dirs.filter((x) => x !== d);
  }
  toutRelacher(): void {
    this.dirs = [];
  }
  bouton(b: Bouton): void {
    this.appuis.push(b);
    for (const f of this.ecouteurs) f(b);
  }
  /** Direction actuellement maintenue (la dernière pressée). */
  direction(): Dir | null {
    return this.dirs[this.dirs.length - 1] ?? null;
  }
  /** Boutons pressés depuis le dernier appel. */
  prendreAppuis(): Bouton[] {
    const a = this.appuis;
    this.appuis = [];
    return a;
  }
  surBouton(f: (b: Bouton) => void): () => void {
    this.ecouteurs.push(f);
    return () => (this.ecouteurs = this.ecouteurs.filter((x) => x !== f));
  }

  /** Croix directionnelle tactile : un seul doigt glisse d'une direction à l'autre. */
  brancherCroix(el: HTMLElement): void {
    let actif: Dir | null = null;
    const choisir = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * 0.12) return null;
      return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'droite' : 'gauche') : dy > 0 ? 'bas' : 'haut';
    };
    const maj = (d: Dir | null) => {
      if (d === actif) return;
      if (actif) this.relacher(actif);
      actif = d;
      if (d) this.presser(d);
      el.dataset['dir'] = d ?? '';
    };
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      maj(choisir(e));
    });
    el.addEventListener('pointermove', (e) => {
      if (actif !== null || e.buttons) maj(choisir(e));
    });
    const fin = () => maj(null);
    el.addEventListener('pointerup', fin);
    el.addEventListener('pointercancel', fin);
    el.addEventListener('lostpointercapture', fin);
  }

  brancherBouton(el: HTMLElement, b: Bouton): void {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      el.classList.add('presse');
      this.bouton(b);
    });
    const fin = () => el.classList.remove('presse');
    el.addEventListener('pointerup', fin);
    el.addEventListener('pointercancel', fin);
  }

  detruire(): void {
    for (const f of this.nettoyage) f();
  }
}
