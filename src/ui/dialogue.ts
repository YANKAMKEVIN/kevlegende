// Boîte de dialogue : portrait peint, nom, texte qui s'écrit, choix.
import type { Dir } from '../core/types';
import type { Attente } from '../core/story/script';
import { art } from '../render/assets';
import { portraitDessine } from '../render/portrait';
import type { Bouton } from '../input/controles';
import { bouton, h, vider } from './dom';
import { ListeNav } from './listenav';

export interface RappelsDialogue {
  continuer: () => void;
  choisir: (i: number) => void;
  son: (id: string) => void;
}

export class Dialogue {
  readonly el: HTMLElement;
  private boite: HTMLElement;
  private cadrePortrait: HTMLElement;
  private nom: HTMLElement;
  private texte: HTMLElement;
  private suite: HTMLElement;
  private choix: HTMLElement;
  private nav: ListeNav;
  private complet = '';
  private visible = 0;
  private enChoix = false;
  /** Caractères par seconde. */
  vitesse = 45;

  constructor(private readonly r: RappelsDialogue) {
    this.cadrePortrait = h('div', { class: 'portrait' });
    this.nom = h('div', { class: 'nom' });
    this.texte = h('p', { class: 'texte', 'aria-live': 'polite' });
    this.suite = h('div', { class: 'suite', 'aria-hidden': 'true' }, '▼');
    this.choix = h('div', { class: 'choix' });
    this.boite = h('div', { class: 'dialogue-boite', onclick: () => this.avancer() }, this.cadrePortrait, h('div', { class: 'dialogue-corps' }, this.nom, this.texte, this.suite));
    this.el = h('div', { class: 'dialogue cache' }, this.choix, this.boite);
    this.nav = new ListeNav(this.choix);
  }

  afficher(a: Extract<Attente, { type: 'dit' } | { type: 'choix' }>): void {
    this.el.classList.remove('cache');
    vider(this.choix);
    if (a.type === 'dit') {
      this.enChoix = false;
      this.boite.classList.toggle('narration', !a.qui);
      this.nom.textContent = a.qui ?? '';
      this.nom.classList.toggle('cache', !a.qui);
      this.portrait(a.portrait);
      this.complet = a.texte;
      this.visible = 0;
      this.texte.textContent = '';
    } else {
      this.enChoix = true;
      this.complet = a.texte;
      this.visible = a.texte.length;
      this.texte.textContent = a.texte;
      this.portrait(null);
      this.nom.classList.add('cache');
      a.options.forEach((o, i) =>
        this.choix.append(
          bouton(o, () => {
            this.r.son('menu');
            this.r.choisir(i);
          }, 'btn choix-btn'),
        ),
      );
      this.nav.i = 0;
      this.nav.maj();
    }
    this.suite.classList.toggle('cache', true);
  }

  private portrait(id: string | null): void {
    vider(this.cadrePortrait);
    this.cadrePortrait.classList.toggle('cache', !id);
    if (!id) return;
    const img = art(`portrait_${id}`);
    if (img) this.cadrePortrait.append(h('img', { src: img.src, alt: '' }));
    else this.cadrePortrait.append(portraitDessine(id));
  }

  masquer(): void {
    this.el.classList.add('cache');
  }

  maj(dt: number): void {
    if (this.el.classList.contains('cache') || this.enChoix) return;
    if (this.visible < this.complet.length) {
      const avant = Math.floor(this.visible);
      this.visible = Math.min(this.complet.length, this.visible + dt * this.vitesse);
      const n = Math.floor(this.visible);
      if (n !== avant) {
        this.texte.textContent = this.complet.slice(0, n);
        if (n % 3 === 0 && this.complet[n - 1] !== ' ') this.r.son('voix');
      }
      if (this.visible >= this.complet.length) this.suite.classList.remove('cache');
    }
  }

  /** Tape ou A : termine le texte en cours, sinon passe à la suite. */
  avancer(): void {
    if (this.enChoix) return;
    if (this.visible < this.complet.length) {
      this.visible = this.complet.length;
      this.texte.textContent = this.complet;
      this.suite.classList.remove('cache');
      return;
    }
    this.r.continuer();
  }

  bouton(b: Bouton): void {
    if (this.enChoix) {
      if (b === 'a') this.nav.valider();
    } else if (b === 'a' || b === 'b') this.avancer();
  }
  dir(d: Dir): void {
    if (this.enChoix) this.nav.dir(d);
  }
}
