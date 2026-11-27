// Interface d'exploration : lieu, objectif, or, bouton menu, croix et boutons tactiles, notifications.
import type { Controles } from '../input/controles';
import { h } from './dom';

export class Hud {
  readonly el: HTMLElement;
  private lieu: HTMLElement;
  private objectif: HTMLElement;
  private or: HTMLElement;
  private toasts: HTMLElement;
  private banniere: HTMLElement;
  private dernierLieu = '';
  readonly tactile: HTMLElement;
  readonly boutonA: HTMLElement;

  constructor(ctl: Controles, ouvrirMenu: () => void) {
    this.lieu = h('div', { class: 'hud-lieu' });
    this.objectif = h('div', { class: 'hud-objectif' });
    this.or = h('div', { class: 'hud-or' });
    this.toasts = h('div', { class: 'toasts', 'aria-live': 'polite' });
    this.banniere = h('div', { class: 'banniere cache' });
    const menu = h('button', { class: 'hud-menu', type: 'button', 'aria-label': 'Menu', onclick: () => ouvrirMenu() }, h('span'), h('span'), h('span'));
    const croix = h('div', { class: 'croix', 'aria-label': 'Croix directionnelle' }, h('i', { class: 'c-haut' }), h('i', { class: 'c-bas' }), h('i', { class: 'c-gauche' }), h('i', { class: 'c-droite' }));
    this.boutonA = h('button', { class: 'btn-a', type: 'button', 'aria-label': 'Action' }, 'A');
    this.tactile = h('div', { class: 'tactile' }, croix, this.boutonA);
    ctl.brancherCroix(croix);
    ctl.brancherBouton(this.boutonA, 'a');
    this.el = h('div', { class: 'hud' }, h('div', { class: 'hud-haut' }, h('div', { class: 'hud-gauche' }, this.lieu, this.objectif), h('div', { class: 'hud-droite' }, this.or, menu)), this.banniere, this.toasts, this.tactile);
  }

  maj(lieu: string, objectif: string, or: number, actionPossible: boolean): void {
    if (lieu !== this.dernierLieu) {
      this.dernierLieu = lieu;
      this.lieu.textContent = lieu;
      this.banniere.textContent = lieu;
      this.banniere.classList.remove('cache');
      this.banniere.classList.remove('anim');
      void this.banniere.offsetWidth;
      this.banniere.classList.add('anim');
    }
    if (this.objectif.textContent !== objectif) this.objectif.textContent = objectif;
    const o = `${or} ◈`;
    if (this.or.textContent !== o) this.or.textContent = o;
    this.boutonA.classList.toggle('actif', actionPossible);
  }

  afficher(v: boolean): void {
    this.el.classList.toggle('cache', !v);
  }
  controlesTactiles(v: boolean): void {
    this.tactile.classList.toggle('cache', !v);
  }

  toast(texte: string, type: 'objet' | 'quete' | 'info' = 'info'): void {
    const t = h('div', { class: `toast toast-${type}` }, texte);
    this.toasts.append(t);
    setTimeout(() => t.classList.add('sortie'), 2600);
    setTimeout(() => t.remove(), 3200);
    while (this.toasts.children.length > 4) this.toasts.firstChild?.remove();
  }
}
