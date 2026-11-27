// Menu de pause : équipe (équipement, soins), objets, quêtes, sauvegarde, options.
import type { Jeu } from '../core/game';
import { competencesConnues, xpPourNiveau } from '../core/progression';
import { statsHeros } from '../core/state';
import type { Dir, EquipSlot, HeroState } from '../core/types';
import { hero } from '../data/heroes';
import { item } from '../data/items';
import { skill } from '../data/skills';
import type { Bouton } from '../input/controles';
import { art } from '../render/assets';
import { portraitDessine } from '../render/portrait';
import { bouton, formatTemps, h, jauge, vider } from './dom';
import { ListeNav } from './listenav';

export type Onglet = 'equipe' | 'objets' | 'quetes' | 'sauvegarde' | 'options';

export interface RappelsMenu {
  jeu: () => Jeu;
  fermer: () => void;
  son: (id: string) => void;
  sauver: (emplacement: '1' | '2' | '3') => boolean;
  resumeEmplacement: (e: '1' | '2' | '3') => string;
  exporter: () => string;
  importer: (texte: string) => string | null;
  options: () => { musique: number; sons: number; texte: number; tactile: boolean };
  changerOptions: (o: Partial<{ musique: number; sons: number; texte: number; tactile: boolean }>) => void;
  retourTitre: () => void;
}

const ONGLETS: [Onglet, string][] = [
  ['equipe', 'Équipe'],
  ['objets', 'Objets'],
  ['quetes', 'Quêtes'],
  ['sauvegarde', 'Sauver'],
  ['options', 'Options'],
];
const EMPL = ['arme', 'armure', 'accessoire'] as const;
const NOM_EMPL: Record<EquipSlot, string> = { arme: 'Arme', armure: 'Armure', accessoire: 'Accessoire' };

export class Menu {
  readonly el: HTMLElement;
  private corps: HTMLElement;
  private onglets: HTMLElement;
  private infos: HTMLElement;
  private onglet: Onglet = 'equipe';
  private nav: ListeNav;
  /** Sous-sélection : choisir un héros cible pour un objet ou un soin, ou un équipement. */
  private selection: { titre: string; options: { texte: string; detail?: string; action: () => void }[] } | null = null;

  constructor(private readonly r: RappelsMenu) {
    this.onglets = h('div', { class: 'onglets' }, ONGLETS.map(([id, nom]) => bouton(nom, () => this.changer(id), 'btn onglet', { 'data-o': id })));
    this.corps = h('div', { class: 'menu-corps' });
    this.infos = h('div', { class: 'menu-infos' });
    this.el = h('div', { class: 'panneau menu cache', role: 'dialog', 'aria-label': 'Menu' }, h('div', { class: 'panneau-tete' }, h('h2', {}, 'Carnet de route'), bouton('✕', () => this.r.fermer(), 'btn btn-x', { 'aria-label': 'Fermer' })), this.onglets, this.corps, this.infos);
    this.nav = new ListeNav(this.corps);
  }

  ouvrir(o: Onglet = this.onglet): void {
    this.el.classList.remove('cache');
    this.selection = null;
    this.changer(o, false);
  }
  masquer(): void {
    this.el.classList.add('cache');
  }

  changer(o: Onglet, son = true): void {
    this.onglet = o;
    this.selection = null;
    if (son) this.r.son('menu');
    this.rendre();
    this.nav.i = 0;
    this.nav.maj();
  }

  private rendre(): void {
    const j = this.r.jeu();
    this.onglets.querySelectorAll<HTMLElement>('.onglet').forEach((e) => e.classList.toggle('actif', e.dataset['o'] === this.onglet));
    this.infos.textContent = `${j.p.or} ◈ · ${formatTemps(j.p.tempsJeu)} · Acte ${j.p.acte}`;
    vider(this.corps);
    if (this.selection) {
      const s = this.selection;
      this.corps.append(h('h3', {}, s.titre));
      for (const o of s.options) {
        const b = bouton('', o.action, 'ligne-objet');
        b.append(h('span', { class: 'lo-nom' }, o.texte));
        if (o.detail) b.append(h('span', { class: 'lo-desc' }, o.detail));
        this.corps.append(b);
      }
      this.corps.append(bouton('Retour', () => this.retour(), 'btn'));
      return;
    }
    if (this.onglet === 'equipe') for (const hs of j.p.equipe) this.corps.append(this.carteHeros(j, hs));
    else if (this.onglet === 'objets') this.objets(j);
    else if (this.onglet === 'quetes') this.quetes(j);
    else if (this.onglet === 'sauvegarde') this.sauvegarde();
    else this.optionsUi();
  }

  private retour(): void {
    this.selection = null;
    this.r.son('retour');
    this.rendre();
    this.nav.maj();
  }

  private choisir(titre: string, options: { texte: string; detail?: string; action: () => void }[]): void {
    this.selection = { titre, options };
    this.rendre();
    this.nav.i = 0;
    this.nav.maj();
  }

  private portrait(id: string): HTMLElement {
    const img = art(`portrait_${id}`);
    return h('div', { class: 'mini-portrait' }, img ? h('img', { src: img.src, alt: '' }) : portraitDessine(id, 96));
  }

  private carteHeros(j: Jeu, hs: HeroState): HTMLElement {
    const def = hero(hs.id);
    const s = statsHeros(hs);
    const prochain = xpPourNiveau(hs.niveau + 1);
    const actuel = xpPourNiveau(hs.niveau);
    const stats = h(
      'div',
      { class: 'stats' },
      ([['atk', 'Force'], ['def', 'Défense'], ['mag', 'Magie'], ['res', 'Esprit'], ['vit', 'Vitesse']] as const).map(([k, n]) => h('span', {}, `${n} `, h('b', {}, String(s[k])))),
    );
    const equip = h(
      'div',
      { class: 'equip' },
      EMPL.map((slot) => {
        const id = hs.equipement[slot];
        return bouton(`${NOM_EMPL[slot]} : ${id ? item(id).nom : '—'}`, () => this.choisirEquipement(j, hs, slot), 'btn btn-equip');
      }),
    );
    const soins = competencesConnues(def, hs.niveau)
      .map(skill)
      .filter((sk) => sk.type === 'soin' || sk.type === 'reveil')
      .map((sk) => bouton(`${sk.nom} (${sk.cout} PS)`, () => this.choisirCibleSoin(j, hs, sk.id), 'btn btn-soin', { disabled: hs.ps < sk.cout || hs.pv <= 0 }));
    return h(
      'div',
      { class: 'carte-heros' },
      this.portrait(hs.id),
      h(
        'div',
        { class: 'ch-infos' },
        h('div', { class: 'ch-nom' }, `${def.nom} `, h('small', {}, `${def.titre} · Niv. ${hs.niveau}`)),
        h('div', { class: 'ch-jauges' }, h('span', {}, `PV ${hs.pv}/${s.pvMax}`), jauge(hs.pv, s.pvMax, 'pv'), h('span', {}, `PS ${hs.ps}/${s.psMax}`), jauge(hs.ps, s.psMax, 'ps'), h('span', {}, `XP ${hs.xp - actuel}/${prochain - actuel}`), jauge(hs.xp - actuel, prochain - actuel, 'xp')),
        stats,
        equip,
        soins.length ? h('div', { class: 'soins' }, soins) : null,
      ),
    );
  }

  private choisirEquipement(j: Jeu, hs: HeroState, slot: EquipSlot): void {
    this.r.son('menu');
    const s0 = statsHeros(hs);
    const options = Object.keys(j.p.inventaire)
      .filter((id) => (j.p.inventaire[id] ?? 0) > 0)
      .map(item)
      .filter((it) => it.type === slot && (!it.pour || it.pour.includes(hs.id)))
      .map((it) => {
        const bonus = Object.entries(it.bonus ?? {})
          .map(([k, v]) => `${({ pvMax: 'PV', psMax: 'PS', atk: 'For', def: 'Déf', mag: 'Mag', res: 'Esp', vit: 'Vit' } as Record<string, string>)[k]} +${v}`)
          .join(' · ');
        return {
          texte: `${it.nom} ×${j.p.inventaire[it.id]}`,
          detail: `${bonus}${it.elementArme && it.elementArme !== 'neutre' ? ` · élément ${it.elementArme}` : ''}`,
          action: () => {
            j.equiper(hs.id, slot, it.id);
            this.r.son('objet');
            this.retour();
          },
        };
      });
    if (hs.equipement[slot])
      options.push({
        texte: 'Retirer',
        detail: `PV ${s0.pvMax} · For ${s0.atk} · Déf ${s0.def}`,
        action: () => {
          j.equiper(hs.id, slot, null);
          this.r.son('retour');
          this.retour();
        },
      });
    if (options.length === 0) options.push({ texte: 'Aucun équipement disponible', detail: 'Les boutiques et les coffres en cachent.', action: () => this.retour() });
    this.choisir(`${hero(hs.id).nom} · ${NOM_EMPL[slot]}`, options);
  }

  private cibles(j: Jeu, agir: (cible: HeroState) => boolean): { texte: string; detail: string; action: () => void }[] {
    return j.p.equipe.map((c) => {
      const s = statsHeros(c);
      return {
        texte: hero(c.id).nom,
        detail: `PV ${c.pv}/${s.pvMax} · PS ${c.ps}/${s.psMax}${c.pv <= 0 ? ' · K.O.' : ''}`,
        action: () => {
          const ok = agir(c);
          this.r.son(ok ? 'soin' : 'erreur');
          if (ok) this.retour();
        },
      };
    });
  }

  private choisirCibleSoin(j: Jeu, lanceur: HeroState, sk: string): void {
    this.r.son('menu');
    const def = skill(sk);
    if (def.cible === 'allies') {
      this.r.son(j.lancerSoin(lanceur.id, sk, lanceur.id) ? 'soin' : 'erreur');
      this.rendre();
      return;
    }
    this.choisir(`${def.nom} : sur qui ?`, this.cibles(j, (c) => j.lancerSoin(lanceur.id, sk, c.id)));
  }

  private objets(j: Jeu): void {
    const ids = Object.keys(j.p.inventaire).filter((k) => (j.p.inventaire[k] ?? 0) > 0);
    if (ids.length === 0) this.corps.append(h('p', { class: 'vide' }, 'Le sac est vide.'));
    const ordre = { conso: 0, arme: 1, armure: 2, accessoire: 3, cle: 4 } as const;
    ids.sort((a, b) => ordre[item(a).type] - ordre[item(b).type]);
    for (const id of ids) {
      const it = item(id);
      const utilisable = it.type === 'conso' && it.cible !== 'ennemi';
      const b = bouton(
        '',
        () => {
          if (!utilisable) return;
          if (it.cible === 'allies') {
            this.r.son(j.utiliserObjet(id, j.p.equipe[0]!.id) ? 'soin' : 'erreur');
            this.rendre();
            return;
          }
          this.choisir(`${it.nom} : sur qui ?`, this.cibles(j, (c) => j.utiliserObjet(id, c.id)));
        },
        `ligne-objet${utilisable ? '' : ' inerte'}`,
      );
      b.append(h('span', { class: 'lo-nom' }, it.nom), h('span', { class: 'lo-desc' }, it.desc), h('span', { class: 'lo-qte' }, `×${j.p.inventaire[id]}`));
      this.corps.append(b);
    }
  }

  private quetes(j: Jeu): void {
    const q = Object.entries(j.p.quetes);
    if (q.length === 0) this.corps.append(h('p', { class: 'vide' }, 'Aucune quête pour l’instant.'));
    q.sort((a, b) => (a[1] === b[1] ? 0 : a[1] === 'active' ? -1 : 1));
    for (const [id, etat] of q) {
      const d = j.monde.quetes[id];
      if (!d) continue;
      this.corps.append(
        h('div', { class: `quete ${etat}` }, h('div', { class: 'q-nom' }, `${d.principale ? '★ ' : ''}${d.nom}`, h('small', {}, etat === 'active' ? 'En cours' : 'Terminée')), h('p', {}, d.desc)),
      );
    }
  }

  private sauvegarde(): void {
    for (const e of ['1', '2', '3'] as const) {
      const b = bouton('', () => {
        const ok = this.r.sauver(e);
        this.r.son(ok ? 'sauve' : 'erreur');
        this.rendre();
        this.nav.maj();
      }, 'ligne-objet');
      b.append(h('span', { class: 'lo-nom' }, `Carnet ${e}`), h('span', { class: 'lo-desc' }, this.r.resumeEmplacement(e)));
      this.corps.append(b);
    }
    const zone = h('textarea', { class: 'export', rows: 3, placeholder: 'Code de sauvegarde', 'aria-label': 'Code de sauvegarde' }) as HTMLTextAreaElement;
    const msg = h('p', { class: 'msg' });
    this.corps.append(
      h('h3', {}, 'Transférer une partie'),
      zone,
      h(
        'div',
        { class: 'rang' },
        bouton('Exporter', () => {
          zone.value = this.r.exporter();
          zone.select();
          void navigator.clipboard?.writeText(zone.value).then(() => (msg.textContent = 'Code copié.'), () => (msg.textContent = 'Code prêt à copier.'));
        }, 'btn'),
        bouton('Importer', () => {
          const err = this.r.importer(zone.value.trim());
          msg.textContent = err ?? 'Partie importée.';
          this.r.son(err ? 'erreur' : 'sauve');
        }, 'btn'),
      ),
      msg,
    );
  }

  private optionsUi(): void {
    const o = this.r.options();
    const curseur = (nom: string, val: number, f: (v: number) => void) => {
      const inp = h('input', { type: 'range', min: 0, max: 100, value: Math.round(val * 100), 'aria-label': nom }) as HTMLInputElement;
      inp.addEventListener('input', () => f(Number(inp.value) / 100));
      return h('label', { class: 'option' }, h('span', {}, nom), inp);
    };
    this.corps.append(
      curseur('Musique', o.musique, (v) => this.r.changerOptions({ musique: v })),
      curseur('Sons', o.sons, (v) => this.r.changerOptions({ sons: v })),
      curseur('Vitesse du texte', o.texte, (v) => this.r.changerOptions({ texte: v })),
      bouton(`Commandes tactiles : ${o.tactile ? 'affichées' : 'masquées'}`, () => {
        this.r.changerOptions({ tactile: !o.tactile });
        this.rendre();
      }, 'btn'),
      bouton('Retour au titre', () => this.r.retourTitre(), 'btn btn-danger'),
    );
  }

  bouton(b: Bouton): void {
    if (b === 'a') this.nav.valider();
    else if (this.selection) this.retour();
    else this.r.fermer();
  }
  dir(d: Dir): void {
    if (!this.selection && (d === 'gauche' || d === 'droite')) {
      const i = ONGLETS.findIndex(([id]) => id === this.onglet);
      const n = (i + (d === 'droite' ? 1 : -1) + ONGLETS.length) % ONGLETS.length;
      this.changer(ONGLETS[n]![0]);
    } else this.nav.dir(d);
  }
}
