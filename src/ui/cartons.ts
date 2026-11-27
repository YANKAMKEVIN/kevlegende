// Cartons plein écran : titres d'acte, fin d'acte, fondu entre les cartes.
import type { Bouton } from '../input/controles';
import { bouton, h, vider } from './dom';

export class Cartons {
  readonly el: HTMLElement;
  readonly fondu: HTMLElement;
  private contenu: HTMLElement;
  private suite: (() => void) | null = null;
  private delai = 0;

  constructor() {
    this.contenu = h('div', { class: 'carton-contenu' });
    this.el = h('div', { class: 'carton cache', onclick: () => this.valider() }, this.contenu);
    this.fondu = h('div', { class: 'fondu' });
  }

  titre(texte: string, sous: string | null, suite: () => void): void {
    vider(this.contenu);
    this.contenu.append(h('h2', {}, texte));
    if (sous) this.contenu.append(h('p', {}, sous));
    this.contenu.append(h('span', { class: 'carton-suite' }, 'Toucher pour continuer'));
    this.montrer(suite);
  }

  fin(texte: string, stats: string, suite: () => void): void {
    vider(this.contenu);
    this.contenu.append(h('h2', {}, 'Fin de l’Acte II'), h('p', {}, texte), h('p', { class: 'carton-stats' }, stats), bouton('Retour au titre', () => this.valider(), 'btn btn-principal'));
    this.montrer(suite);
  }

  private montrer(suite: () => void): void {
    this.suite = suite;
    this.delai = 0.6;
    this.el.classList.remove('cache');
    this.el.classList.remove('anim');
    void this.el.offsetWidth;
    this.el.classList.add('anim');
  }

  maj(dt: number): void {
    this.delai = Math.max(0, this.delai - dt);
  }

  visible(): boolean {
    return !this.el.classList.contains('cache');
  }

  valider(): void {
    if (this.delai > 0 || !this.suite) return;
    const s = this.suite;
    this.suite = null;
    this.el.classList.add('cache');
    s();
  }

  /** Ferme le carton sans rappel (l'histoire a avancé autrement). */
  fermer(): void {
    this.suite = null;
    this.el.classList.add('cache');
  }

  bouton(b: Bouton): void {
    if (b === 'a') this.valider();
  }

  /** Fondu au noir, action au milieu, retour à l'image. */
  async transition(milieu: () => void, duree = 0.28): Promise<void> {
    this.fondu.style.transitionDuration = `${duree}s`;
    this.fondu.classList.add('noir');
    await new Promise((r) => setTimeout(r, duree * 1000));
    milieu();
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    this.fondu.classList.remove('noir');
  }
}
