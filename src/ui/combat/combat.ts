// Écran de combat : rejoue les événements du moteur avec du rythme, puis demande les ordres du joueur.
import { ordrePrevu, trouver } from '../../core/battle/battle';
import type { Action, BattleEvent, BattleState, Combattant } from '../../core/battle/types';
import type { Jeu, Recompense } from '../../core/game';
import type { Dir, Target } from '../../core/types';
import { hero } from '../../data/heroes';
import { item } from '../../data/items';
import { skill } from '../../data/skills';
import { choisirAction } from '../../bot/tactique';
import type { Bouton } from '../../input/controles';
import { bouton, h, jauge, vider } from '../dom';
import { ListeNav } from '../listenav';
import { DUREES, jouerEvenement, NOM_STATUT } from './lecture';
import { COULEUR_ELEMENT, VueCombat } from './vue';

export interface RappelsCombat {
  jeu: () => Jeu;
  son: (id: string) => void;
  /** Combat terminé et récompenses distribuées. */
  termine: (rec: Recompense | null) => void;
}

type Etape = 'lecture' | 'commande' | 'liste' | 'cible' | 'resultat';


export class EcranCombat {
  readonly el: HTMLElement;
  readonly vue = new VueCombat();
  private frise: HTMLElement;
  private cartes: HTMLElement;
  private commandes: HTMLElement;
  private bandeau: HTMLElement;
  private resultat: HTMLElement;
  private file: BattleEvent[] = [];
  private attente = 0;
  private etape: Etape = 'lecture';
  private nav: ListeNav;
  private enCours: { type: 'attaque' } | { type: 'competence'; id: string } | { type: 'objet'; id: string } | null = null;
  private cibles: string[] = [];
  vitesse = 1;
  auto = false;
  private boutonVitesse: HTMLButtonElement;
  private boutonAuto: HTMLButtonElement;

  constructor(private readonly r: RappelsCombat) {
    this.frise = h('div', { class: 'frise', 'aria-label': 'Ordre des tours' });
    this.cartes = h('div', { class: 'cartes-combat' });
    this.commandes = h('div', { class: 'commandes cache' });
    this.bandeau = h('div', { class: 'bandeau cache' });
    this.resultat = h('div', { class: 'resultat cache' });
    this.boutonVitesse = bouton('×1', () => this.basculerVitesse(), 'btn btn-mini');
    this.boutonAuto = bouton('Auto', () => this.basculerAuto(), 'btn btn-mini');
    this.el = h('div', { class: 'combat cache' }, h('div', { class: 'combat-haut' }, this.frise, h('div', { class: 'combat-opts' }, this.boutonAuto, this.boutonVitesse)), this.bandeau, this.resultat, h('div', { class: 'combat-bas' }, this.commandes, this.cartes));
    this.nav = new ListeNav(this.commandes);
  }

  /** État affiché (gardé après la fin du combat, le temps de l'écran de résultats). */
  private etat: BattleState | null = null;
  private get b(): BattleState {
    if (!this.etat) throw new Error('Pas de combat');
    return this.etat;
  }

  visible(): boolean {
    return !this.el.classList.contains('cache');
  }

  demarrer(): void {
    this.etat = this.r.jeu().combat;
    this.el.classList.remove('cache');
    this.resultat.classList.add('cache');
    this.vue.initialiser(this.b);
    this.file = [];
    this.attente = 0.6;
    this.etape = 'lecture';
    this.commandes.classList.add('cache');
    this.annoncer(this.b.boss ? 'Un adversaire redoutable !' : 'Des créatures surgissent !');
    this.rendreCartes();
    this.rendreFrise();
  }
  masquer(): void {
    this.el.classList.add('cache');
    this.etat = null;
  }

  private basculerVitesse(): void {
    this.vitesse = this.vitesse === 1 ? 2 : this.vitesse === 2 ? 3 : 1;
    this.boutonVitesse.textContent = `×${this.vitesse}`;
  }
  private basculerAuto(): void {
    this.auto = !this.auto;
    this.boutonAuto.classList.toggle('actif', this.auto);
    if (this.auto && (this.etape === 'commande' || this.etape === 'liste' || this.etape === 'cible')) this.jouerAuto();
  }

  private annoncer(t: string): void {
    this.bandeau.textContent = t;
    this.bandeau.classList.remove('cache');
  }

  maj(ctx: CanvasRenderingContext2D, carte: string, w: number, h: number, dt: number): void {
    const j = this.r.jeu();
    if (!this.etat) return;
    this.vue.dessiner(ctx, this.etat, carte, w, h, dt);
    if (this.etape !== 'lecture') return;
    this.attente -= dt * this.vitesse;
    while (this.attente <= 0) {
      const ev = this.file.shift();
      if (ev) {
        this.jouer(ev);
        this.attente += DUREES[ev.t];
        continue;
      }
      // File vide : synchroniser, puis finir, demander un ordre ou faire avancer le moteur.
      this.synchroniser();
      const b = this.b;
      if (b.fini) {
        this.finir();
        return;
      }
      if (b.attente) {
        this.vue.acteur = b.attente;
        this.rendreFrise();
        if (this.auto) this.jouerAuto();
        else this.ouvrirCommandes();
        return;
      }
      this.file.push(...j.combatAvancer());
      if (this.file.length === 0) return;
    }
  }

  private synchroniser(): void {
    for (const c of this.b.combattants) {
      const v = this.vue.e(c.uid);
      v.pv = c.pv;
      v.bouclier = c.bouclier;
      v.brise = c.brise > 0;
      if (c.pv > 0) v.ko = 0;
    }
    this.rendreCartes();
  }

  private jouer(ev: BattleEvent): void {
    jouerEvenement(ev, this.b, this.vue, {
      son: this.r.son,
      annoncer: (t) => this.annoncer(t),
      cartes: () => this.rendreCartes(),
      frise: () => this.rendreFrise(),
      ko: (uid) => this.animerKo(uid),
    });
  }

  private animerKo(uid: string): void {
    const v = this.vue.e(uid);
    if (v.ko <= 0 || v.ko >= 1) return;
    const pas = () => {
      v.ko = Math.min(1, v.ko + 0.06);
      if (v.ko < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  }

  private rendreFrise(): void {
    vider(this.frise);
    const b = this.b;
    for (const uid of ordrePrevu(b, 7)) {
      const c = b.combattants.find((x) => x.uid === uid);
      if (!c) continue;
      this.frise.append(h('span', { class: `jeton ${c.camp}${uid === this.vue.acteur ? ' actuel' : ''}`, title: c.nom }, c.nom.slice(0, 2)));
    }
  }

  private rendreCartes(): void {
    vider(this.cartes);
    for (const c of this.b.combattants.filter((x) => x.camp === 'heros')) {
      const v = this.vue.e(c.uid);
      const pv = Math.max(0, Math.round(v.pv));
      this.cartes.append(
        h(
          'div',
          { class: `carte-c${c.uid === this.vue.acteur ? ' actuel' : ''}${pv <= 0 ? ' ko' : ''}` },
          h('div', { class: 'cc-nom' }, c.nom, h('small', {}, ` Nv ${c.niveau}`)),
          h('div', { class: 'cc-ligne' }, h('span', {}, 'PV'), jauge(pv, c.stats.pvMax, 'pv'), h('b', {}, String(pv))),
          h('div', { class: 'cc-ligne' }, h('span', {}, 'PS'), jauge(c.ps, c.stats.psMax, 'ps'), h('b', {}, String(c.ps))),
          c.statuts.length ? h('div', { class: 'cc-statuts' }, c.statuts.map((s) => h('i', {}, NOM_STATUT[s.id] ?? s.id))) : null,
        ),
      );
    }
  }

  // ---------- Ordres ----------
  private acteur(): Combattant {
    return trouver(this.b, this.b.attente!);
  }

  private ouvrirCommandes(): void {
    this.etape = 'commande';
    this.vue.ciblesPossibles = [];
    const c = this.acteur();
    this.annoncer(`À ${c.nom} !`);
    vider(this.commandes);
    const inv = this.r.jeu().p.inventaire;
    const objets = Object.keys(inv).filter((id) => (inv[id] ?? 0) > 0 && item(id).type === 'conso');
    const comp = c.competences.filter((id) => id !== 'attaque');
    this.commandes.append(
      bouton('Attaquer', () => this.viser({ type: 'attaque' }, 'ennemi'), 'btn cmd cmd-attaque'),
      bouton('Compétences', () => this.listeCompetences(), 'btn cmd', { disabled: comp.length === 0 }),
      bouton('Objets', () => this.listeObjets(), 'btn cmd', { disabled: objets.length === 0 }),
      bouton('Défense', () => this.envoyer({ type: 'defense' }), 'btn cmd'),
      bouton('Fuir', () => this.envoyer({ type: 'fuite' }), 'btn cmd', { disabled: !this.b.fuitePossible }),
    );
    this.commandes.classList.remove('cache');
    this.nav.i = 0;
    this.nav.maj();
  }

  private listeCompetences(): void {
    this.r.son('menu');
    this.etape = 'liste';
    const c = this.acteur();
    vider(this.commandes);
    for (const id of c.competences.filter((x) => x !== 'attaque')) {
      const sk = skill(id);
      const b = bouton('', () => this.viser({ type: 'competence', id }, sk.cible), 'ligne-objet ligne-comp', { disabled: c.ps < sk.cout });
      b.append(
        h('span', { class: 'lo-nom' }, h('i', { class: 'pastille', style: `background:${COULEUR_ELEMENT[sk.element]}` }), sk.nom),
        h('span', { class: 'lo-desc' }, sk.desc),
        h('span', { class: 'lo-prix' }, `${sk.cout} PS`),
      );
      this.commandes.append(b);
    }
    this.commandes.append(bouton('Retour', () => this.ouvrirCommandes(), 'btn'));
    this.nav.i = 0;
    this.nav.maj();
  }

  private listeObjets(): void {
    this.r.son('menu');
    this.etape = 'liste';
    const inv = this.r.jeu().p.inventaire;
    vider(this.commandes);
    for (const id of Object.keys(inv).filter((k) => (inv[k] ?? 0) > 0 && item(k).type === 'conso')) {
      const it = item(id);
      const b = bouton('', () => this.viser({ type: 'objet', id }, it.cible ?? 'allie'), 'ligne-objet');
      b.append(h('span', { class: 'lo-nom' }, it.nom), h('span', { class: 'lo-desc' }, it.desc), h('span', { class: 'lo-qte' }, `×${inv[id]}`));
      this.commandes.append(b);
    }
    this.commandes.append(bouton('Retour', () => this.ouvrirCommandes(), 'btn'));
    this.nav.i = 0;
    this.nav.maj();
  }

  private viser(a: NonNullable<EcranCombat['enCours']>, type: Target): void {
    this.r.son('menu');
    const b = this.b;
    const c = this.acteur();
    const fin = (cible: string) => {
      if (a.type === 'attaque') this.envoyer({ type: 'attaque', cible });
      else this.envoyer({ ...a, cible });
    };
    if (type === 'ennemis' || type === 'allies' || type === 'soi') return fin(c.uid);
    const camp = type === 'ennemi' ? 'ennemis' : 'heros';
    this.cibles = b.combattants.filter((x) => x.camp === camp && (type === 'allieKO' ? x.pv <= 0 : x.pv > 0)).map((x) => x.uid);
    if (this.cibles.length === 0) {
      this.r.son('erreur');
      return;
    }
    if (this.cibles.length === 1 && type === 'ennemi') return fin(this.cibles[0]!);
    this.enCours = a;
    this.etape = 'cible';
    this.vue.ciblesPossibles = this.cibles;
    this.vue.cibleSurvol = this.cibles[0]!;
    this.annoncer('Choisissez une cible');
    vider(this.commandes);
    for (const uid of this.cibles) {
      const t = trouver(b, uid);
      this.commandes.append(bouton(`${t.nom}${t.camp === 'heros' ? ` · ${t.pv} PV` : ''}`, () => fin(uid), 'btn cmd'));
    }
    this.commandes.append(bouton('Retour', () => this.ouvrirCommandes(), 'btn'));
    this.nav.i = 0;
    this.nav.maj();
  }

  /** Tape sur le canevas : vise directement un combattant. */
  toucher(x: number, y: number): void {
    if (this.etape === 'resultat') return;
    const uid = this.vue.sous(x, y);
    if (!uid) return;
    if (this.etape === 'cible' && this.cibles.includes(uid) && this.enCours) {
      const a = this.enCours;
      if (a.type === 'attaque') this.envoyer({ type: 'attaque', cible: uid });
      else this.envoyer({ ...a, cible: uid });
    } else if (this.etape === 'commande' && trouver(this.b, uid).camp === 'ennemis' && trouver(this.b, uid).pv > 0) this.envoyer({ type: 'attaque', cible: uid });
  }

  private jouerAuto(): void {
    const j = this.r.jeu();
    this.envoyer(choisirAction(this.b, this.acteur(), j.p.inventaire));
  }

  private envoyer(a: Action): void {
    const j = this.r.jeu();
    this.enCours = null;
    this.vue.ciblesPossibles = [];
    this.vue.cibleSurvol = null;
    this.commandes.classList.add('cache');
    try {
      this.file.push(...j.combatAgir(a));
    } catch (e) {
      this.r.son('erreur');
      this.annoncer(e instanceof Error ? e.message : 'Action impossible');
      this.ouvrirCommandes();
      return;
    }
    this.etape = 'lecture';
    this.attente = 0;
  }

  // ---------- Fin ----------
  private finir(): void {
    this.etape = 'resultat';
    this.vue.acteur = null;
    const j = this.r.jeu();
    const resultat = this.b.fini;
    const rec = j.terminerCombat();
    vider(this.resultat);
    this.resultat.classList.remove('cache');
    this.bandeau.classList.add('cache');
    if (resultat === 'victoire' && rec) {
      this.r.son('victoire');
      const lignes = [h('h2', {}, 'Victoire !'), h('p', {}, `+${rec.xp} XP · +${rec.or} ◈`)];
      for (const o of rec.butin) lignes.push(h('p', { class: 'butin' }, `Butin : ${item(o).nom}`));
      for (const n of rec.niveaux) {
        lignes.push(h('p', { class: 'niveau' }, `${hero(n.hero).nom} passe au niveau ${n.a} !`));
        for (const s of n.nouvellesCompetences) lignes.push(h('p', { class: 'nouvelle' }, `Nouvelle technique : ${skill(s).nom}`));
      }
      if (rec.niveaux.length) setTimeout(() => this.r.son('niveau'), 700);
      this.resultat.append(h('div', { class: 'res-carte' }, lignes, bouton('Continuer', () => this.r.termine(rec), 'btn btn-principal')));
    } else if (resultat === 'fuite') {
      this.resultat.append(h('div', { class: 'res-carte' }, h('h2', {}, 'Fuite réussie'), bouton('Continuer', () => this.r.termine(rec), 'btn btn-principal')));
    } else if (j.mode === 'defaite') {
      this.r.son('defaite');
      this.resultat.append(
        h(
          'div',
          { class: 'res-carte defaite' },
          h('h2', {}, 'Le groupe est à terre…'),
          h('p', {}, 'La Brume n’a pas le dernier mot. Réessayez ce combat avec une autre approche : visez les faiblesses pour ouvrir une Brèche.'),
          bouton('Réessayer le combat', () => {
            j.reessayerCombat();
            this.demarrer();
          }, 'btn btn-principal'),
          bouton('Reprendre la dernière sauvegarde', () => this.r.termine(null), 'btn'),
        ),
      );
    } else {
      this.resultat.append(h('div', { class: 'res-carte' }, h('h2', {}, 'Le combat prend fin'), bouton('Continuer', () => this.r.termine(rec), 'btn btn-principal')));
    }
    const nav = new ListeNav(this.resultat);
    this.navResultat = nav;
    nav.maj();
  }
  private navResultat: ListeNav | null = null;

  bouton(b: Bouton): void {
    if (this.etape === 'resultat') {
      if (b === 'a') this.navResultat?.valider();
      return;
    }
    if (this.etape === 'lecture') {
      if (b === 'a') this.attente = Math.min(this.attente, 0.05);
      return;
    }
    if (b === 'a') this.nav.valider();
    else if (b === 'b' && this.etape !== 'commande') this.ouvrirCommandes();
  }
  dir(d: Dir): void {
    if (this.etape === 'resultat') this.navResultat?.dir(d);
    else if (this.etape !== 'lecture') {
      this.nav.dir(d);
      if (this.etape === 'cible') this.vue.cibleSurvol = this.cibles[this.nav.i] ?? null;
    }
  }
}
