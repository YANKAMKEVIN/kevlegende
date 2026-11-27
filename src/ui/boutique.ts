// Boutique : acheter et vendre, avec comparaison d'équipement.
import type { Jeu } from '../core/game';
import type { Dir } from '../core/types';
import { item } from '../data/items';
import type { Bouton } from '../input/controles';
import { bouton, h, vider } from './dom';
import { ListeNav } from './listenav';

export class Boutique {
  readonly el: HTMLElement;
  private corps: HTMLElement;
  private titre: HTMLElement;
  private bourse: HTMLElement;
  private onglet: 'acheter' | 'vendre' = 'acheter';
  private id = '';
  private nav: ListeNav;

  constructor(private readonly j: () => Jeu, private readonly fermer: () => void, private readonly son: (s: string) => void) {
    this.titre = h('h2');
    this.bourse = h('div', { class: 'bourse' });
    this.corps = h('div', { class: 'liste' });
    const onglets = h(
      'div',
      { class: 'onglets' },
      bouton('Acheter', () => this.changer('acheter'), 'btn onglet', { 'data-o': 'acheter' }),
      bouton('Vendre', () => this.changer('vendre'), 'btn onglet', { 'data-o': 'vendre' }),
    );
    this.el = h(
      'div',
      { class: 'panneau boutique cache', role: 'dialog' },
      h('div', { class: 'panneau-tete' }, this.titre, this.bourse),
      onglets,
      this.corps,
      bouton('Quitter', () => this.fermer(), 'btn btn-fermer'),
    );
    this.nav = new ListeNav(this.el);
  }

  ouvrir(id: string): void {
    this.id = id;
    this.onglet = 'acheter';
    this.el.classList.remove('cache');
    this.rendre();
    this.nav.i = 2;
    this.nav.maj();
  }
  masquer(): void {
    this.el.classList.add('cache');
  }

  private changer(o: 'acheter' | 'vendre'): void {
    this.onglet = o;
    this.son('menu');
    this.rendre();
  }

  private rendre(): void {
    const j = this.j();
    const b = j.monde.boutiques[this.id];
    this.titre.textContent = b?.nom ?? 'Boutique';
    this.bourse.textContent = `${j.p.or} ◈`;
    this.el.querySelectorAll<HTMLElement>('.onglet').forEach((e) => e.classList.toggle('actif', e.dataset['o'] === this.onglet));
    vider(this.corps);
    const ids = this.onglet === 'acheter' ? (b?.articles ?? []) : Object.keys(j.p.inventaire).filter((k) => (j.p.inventaire[k] ?? 0) > 0 && item(k).type !== 'cle');
    if (ids.length === 0) this.corps.append(h('p', { class: 'vide' }, 'Rien à vendre.'));
    for (const id of ids) {
      const it = item(id);
      const possede = j.p.inventaire[id] ?? 0;
      const prix = this.onglet === 'acheter' ? it.prix : Math.floor(it.prix / 2);
      const pourQui = it.pour ? ` · ${it.pour.map((p) => p[0]!.toUpperCase() + p.slice(1)).join(', ')}` : '';
      const ligne = bouton(
        '',
        () => {
          const ok = this.onglet === 'acheter' ? j.acheter(id) : j.vendre(id);
          this.son(ok ? 'achat' : 'erreur');
          this.rendre();
          this.nav.maj();
        },
        'ligne-objet',
        { disabled: this.onglet === 'acheter' && j.p.or < prix },
      );
      ligne.append(
        h('span', { class: 'lo-nom' }, it.nom),
        h('span', { class: 'lo-desc' }, `${it.desc}${pourQui}`),
        h('span', { class: 'lo-qte' }, `×${possede}`),
        h('span', { class: 'lo-prix' }, `${prix} ◈`),
      );
      this.corps.append(ligne);
    }
  }

  bouton(b: Bouton): void {
    if (b === 'a') this.nav.valider();
    else this.fermer();
  }
  dir(d: Dir): void {
    if (d === 'gauche') this.changer('acheter');
    else if (d === 'droite') this.changer('vendre');
    else this.nav.dir(d);
  }
}
