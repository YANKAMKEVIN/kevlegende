// Écran titre : illustration, logo, Continuer / Nouvelle partie / Charger.
import type { Dir } from '../core/types';
import type { Bouton } from '../input/controles';
import { art } from '../render/assets';
import { bouton, h, vider } from './dom';
import { ListeNav } from './listenav';

export interface EmplacementResume {
  id: string;
  titre: string;
  detail: string;
  valide: boolean;
}

export interface RappelsTitre {
  continuer: (() => void) | null;
  nouvelle: () => void;
  emplacements: () => EmplacementResume[];
  charger: (id: string) => void;
  son: (id: string) => void;
}

export class EcranTitre {
  readonly el: HTMLElement;
  private actions: HTMLElement;
  private fond: HTMLElement;
  private nav: ListeNav;
  private sousMenu = false;

  constructor(private r: RappelsTitre) {
    this.fond = h('div', { class: 'titre-fond' });
    this.actions = h('div', { class: 'titre-actions' });
    this.el = h(
      'div',
      { class: 'titre cache' },
      this.fond,
      h('div', { class: 'titre-logo' }, h('h1', {}, 'Kevlegende'), h('p', {}, 'Les Fanaux de la Brume')),
      this.actions,
      h('p', { class: 'titre-pied' }, 'Acte I et Acte II · Tapez ou appuyez sur Entrée'),
    );
    this.nav = new ListeNav(this.actions);
  }

  ouvrir(r?: RappelsTitre): void {
    if (r) this.r = r;
    this.el.classList.remove('cache');
    const img = art('titre');
    this.fond.style.backgroundImage = img ? `url("${img.src}")` : '';
    this.principal();
  }
  masquer(): void {
    this.el.classList.add('cache');
  }

  private principal(): void {
    this.sousMenu = false;
    vider(this.actions);
    if (this.r.continuer) this.actions.append(bouton('Continuer', () => this.r.continuer?.(), 'btn btn-principal'));
    this.actions.append(bouton('Nouvelle partie', () => this.r.nouvelle(), this.r.continuer ? 'btn' : 'btn btn-principal'));
    if (this.r.emplacements().some((e) => e.valide)) this.actions.append(bouton('Charger', () => this.charger(), 'btn'));
    this.nav.i = 0;
    this.nav.maj();
  }

  private charger(): void {
    this.sousMenu = true;
    this.r.son('menu');
    vider(this.actions);
    for (const e of this.r.emplacements()) {
      const b = bouton('', () => this.r.charger(e.id), 'ligne-objet', { disabled: !e.valide });
      b.append(h('span', { class: 'lo-nom' }, e.titre), h('span', { class: 'lo-desc' }, e.detail));
      this.actions.append(b);
    }
    this.actions.append(bouton('Retour', () => this.principal(), 'btn'));
    this.nav.i = 0;
    this.nav.maj();
  }

  bouton(b: Bouton): void {
    if (b === 'a') this.nav.valider();
    else if (this.sousMenu) this.principal();
  }
  dir(d: Dir): void {
    this.nav.dir(d);
  }
}
