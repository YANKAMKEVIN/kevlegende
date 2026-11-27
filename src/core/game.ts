// Le jeu : état persistant + modes (exploration, événement, combat) + menus.
import { ENEMIES } from '../data/enemies';
import { hero } from '../data/heroes';
import { item, itemOpt } from '../data/items';
import { avancer, agir } from './battle/battle';
import { creerCombat } from './battle/setup';
import { soinDeBase } from './battle/damage';
import type { Action, BattleEvent, BattleState } from './battle/types';
import type { Monde, Mode } from './monde';
import { competencesConnues, gagnerXp, type GainNiveau } from './progression';
import { skill } from '../data/skills';
import { Rng } from './rng';
import { ajouterObjet, nouvellePartie, statsHeros, type Partie } from './state';
import { derouler, lancerEvenement, type Cadre } from './story/runner';
import type { Attente, Effet, Script } from './story/script';
import type { Dir, EquipSlot } from './types';
import * as explore from './world/explore';
import { ancre, compilerCarte, condVraie, type CarteCompilee } from './world/map';
import type { CoffreDef } from './world/mapdef';

export interface Recompense {
  xp: number;
  or: number;
  butin: string[];
  niveaux: GainNiveau[];
}

interface OptsCombat {
  fuite: boolean;
  defaiteOk: boolean;
}

export class Jeu {
  mode: Mode = 'exploration';
  attente: Attente | null = null;
  pile: Cadre[] = [];
  choixEnCours: Script[] | null = null;
  effets: Effet[] = [];
  combat: BattleState | null = null;
  /** Direction des PNJ tournés vers le joueur après lui avoir parlé. */
  regards: Record<string, Dir> = {};
  private optsCombat: OptsCombat = { fuite: true, defaiteOk: false };
  private avantCombat: string | null = null;
  private dernierGroupe: string[] | null = null;
  private tentatives = 0;

  constructor(
    readonly monde: Monde,
    public p: Partie,
  ) {}

  static nouvelle(monde: Monde, seed: number): Jeu {
    const c = compilerCarte(Jeu.defCarte(monde, monde.depart.carte));
    const a = ancre(c, monde.depart.ancre);
    const j = new Jeu(monde, nouvellePartie(seed, { carte: monde.depart.carte, ...a }));
    if (monde.depart.evenement) lancerEvenement(j, monde.depart.evenement);
    return j;
  }

  /** Reprend une partie sauvegardée ; replace le joueur sur une case sûre si sa position n'est plus valide. */
  static charger(monde: Monde, p: Partie): Jeu {
    const j = new Jeu(monde, p);
    if (!monde.cartes[p.carte]) j.p.carte = monde.depart.carte;
    if (!explore.franchissable(j, p.x, p.y) || explore.surPorte(j)) {
      const c = j.carte();
      const arrivees = Object.values(monde.cartes).flatMap((d) => (d.portes ?? []).filter((po) => po.vers === c.def.id).map((po) => po.arrivee));
      const sure = arrivees.map((a) => c.ancres[a]).find((pos) => pos && explore.franchissable(j, pos.x, pos.y));
      const pos = sure ?? ancre(j.carte(monde.depart.carte), monde.depart.ancre);
      if (!sure) j.p.carte = monde.depart.carte;
      j.p.x = pos.x;
      j.p.y = pos.y;
    }
    return j;
  }

  private static defCarte(monde: Monde, id: string) {
    const d = monde.cartes[id];
    if (!d) throw new Error(`Carte inconnue : ${id}`);
    return d;
  }

  carte(id = this.p.carte): CarteCompilee {
    return compilerCarte(Jeu.defCarte(this.monde, id));
  }

  // ---------- Exploration ----------
  deplacer(dir: Dir) {
    return explore.deplacer(this, dir);
  }
  interagir() {
    return explore.interagir(this);
  }
  teleporter(carte: string, a: string, dir?: Dir): void {
    const pos = ancre(this.carte(carte), a);
    this.p.carte = carte;
    this.p.x = pos.x;
    this.p.y = pos.y;
    if (dir) this.p.dir = dir;
    this.p.pasRencontre = 0;
    this.regards = {};
    this.effets.push({ type: 'teleporte' });
  }
  ouvrirCoffre(co: CoffreDef): void {
    const s: Script = [
      { c: 'son', id: 'coffre' },
      ...(co.objet ? [{ c: 'donne' as const, objet: co.objet, n: co.n ?? 1 }] : []),
      ...(co.or ? [{ c: 'or' as const, n: co.or }] : []),
    ];
    this.pile.push({ cmds: s, i: 0 });
    this.mode = 'evenement';
    derouler(this);
  }

  // ---------- Événements ----------
  /** Ferme un dialogue, un titre ou une boutique, et poursuit le script. */
  continuer(): void {
    if (!this.attente || this.attente.type === 'choix' || this.attente.type === 'combat') return;
    this.attente = null;
    derouler(this);
  }
  choisir(i: number): void {
    if (this.attente?.type !== 'choix' || !this.choixEnCours) return;
    const s = this.choixEnCours[i];
    if (!s) throw new Error(`Choix invalide : ${i}`);
    this.attente = null;
    this.choixEnCours = null;
    this.pile.push({ cmds: s, i: 0 });
    derouler(this);
  }

  // ---------- Combat ----------
  demarrerCombat(groupe: readonly string[], opts: OptsCombat): void {
    this.avantCombat = JSON.stringify(this.p);
    this.tentatives = 0;
    this.dernierGroupe = [...groupe];
    const rng = new Rng(1);
    rng.state = this.p.rng;
    const seed = rng.int(1, 2 ** 31);
    this.p.rng = rng.state;
    const vivants = this.p.equipe;
    this.combat = creerCombat(groupe, vivants, { seed, fuite: opts.fuite, connues: this.p.bestiaire });
    this.optsCombat = opts;
    this.mode = 'combat';
    this.attente = { type: 'combat' };
    this.p.combats++;
  }
  combatAvancer(): BattleEvent[] {
    if (!this.combat) return [];
    return avancer(this.combat);
  }
  combatAgir(a: Action): BattleEvent[] {
    if (!this.combat) throw new Error('Pas de combat en cours');
    return agir(this.combat, a, this.p.inventaire);
  }
  /** Clôt le combat terminé : synchronise PV/PS, distribue récompenses. */
  terminerCombat(): Recompense | null {
    const b = this.combat;
    if (!b?.fini) throw new Error('Le combat n’est pas terminé');
    const rec: Recompense = { xp: 0, or: 0, butin: [], niveaux: [] };
    for (const c of b.combattants) {
      if (c.camp === 'ennemis') {
        for (const el of c.revelees) {
          const k = `${c.ref}:${el}`;
          if (!this.p.bestiaire.includes(k)) this.p.bestiaire.push(k);
        }
        continue;
      }
      const h = this.p.equipe.find((x) => x.id === c.ref);
      if (h) {
        h.pv = c.pv;
        h.ps = c.ps;
      }
    }
    if (b.fini === 'victoire') {
      this.p.victoires++;
      const rng = new Rng(1);
      rng.state = b.rng;
      for (const c of b.combattants.filter((x) => x.camp === 'ennemis')) {
        const d = ENEMIES[c.ref]!;
        rec.xp += d.xp;
        rec.or += d.or;
        if (!this.p.vaincus.includes(d.id)) this.p.vaincus.push(d.id);
        for (const bu of d.butin ?? []) if (rng.chance(bu.chance)) rec.butin.push(bu.objet);
      }
      this.p.or += rec.or;
      for (const o of rec.butin) ajouterObjet(this.p, o);
      for (const h of this.p.equipe) {
        if (h.pv <= 0) h.pv = 1;
        const g = gagnerXp(hero(h.id), h, rec.xp, itemOpt);
        if (g) rec.niveaux.push(g);
      }
    }
    this.combat = null;
    this.attente = null;
    if (b.fini === 'defaite' && !this.optsCombat.defaiteOk) {
      this.mode = 'defaite';
      return rec;
    }
    if (b.fini === 'defaite') for (const h of this.p.equipe) h.pv = Math.max(1, h.pv);
    this.mode = this.pile.length ? 'evenement' : 'exploration';
    derouler(this);
    return rec;
  }
  /** Après une défaite : revient juste avant le combat et le relance. */
  reessayerCombat(): void {
    if (this.mode !== 'defaite' || !this.avantCombat || !this.dernierGroupe) return;
    const tentatives = this.tentatives + 1;
    this.p = JSON.parse(this.avantCombat) as Partie;
    // Nouveau tirage aléatoire : réessayer ne rejoue pas exactement le même combat.
    this.p.rng = (this.p.rng + Math.imul(tentatives, 0x9e3779b9)) >>> 0;
    this.demarrerCombat(this.dernierGroupe, this.optsCombat);
    this.tentatives = tentatives;
  }

  // ---------- Menus ----------
  utiliserObjet(id: string, heroId: string): boolean {
    if ((this.p.inventaire[id] ?? 0) <= 0) return false;
    const it = item(id);
    const cibles = it.cible === 'allies' ? this.p.equipe : this.p.equipe.filter((h) => h.id === heroId);
    let utile = false;
    for (const h of cibles) {
      const s = statsHeros(h);
      if (it.reveil && h.pv <= 0) {
        h.pv = Math.round(s.pvMax / 2);
        utile = true;
      }
      if (it.soinPv && h.pv > 0 && h.pv < s.pvMax) {
        h.pv = Math.min(s.pvMax, h.pv + it.soinPv);
        utile = true;
      }
      if (it.soinPs && h.ps < s.psMax) {
        h.ps = Math.min(s.psMax, h.ps + it.soinPs);
        utile = true;
      }
    }
    if (utile) ajouterObjet(this.p, id, -1);
    return utile;
  }
  /** Soins hors combat avec une compétence (Baume, Brise Douce, Éveil…). */
  lancerSoin(heroId: string, skillId: string, cibleId: string): boolean {
    const lanceur = this.p.equipe.find((x) => x.id === heroId);
    if (!lanceur || lanceur.pv <= 0) return false;
    const sk = skill(skillId);
    if (!competencesConnues(hero(heroId), lanceur.niveau).includes(skillId)) return false;
    if (sk.type !== 'soin' && sk.type !== 'reveil') return false;
    if (lanceur.ps < sk.cout) return false;
    const mag = statsHeros(lanceur).mag;
    const cibles = sk.cible === 'allies' ? this.p.equipe.filter((h) => h.pv > 0) : this.p.equipe.filter((h) => h.id === cibleId);
    let utile = false;
    for (const h of cibles) {
      const s = statsHeros(h);
      if (sk.type === 'reveil' && h.pv <= 0) {
        h.pv = Math.max(1, Math.round(s.pvMax * 0.35));
        utile = true;
      } else if (sk.type === 'soin' && h.pv > 0 && h.pv < s.pvMax) {
        h.pv = Math.min(s.pvMax, h.pv + soinDeBase(mag, sk.puissance));
        utile = true;
      }
    }
    if (utile) lanceur.ps -= sk.cout;
    return utile;
  }
  equiper(heroId: string, slot: EquipSlot, id: string | null): boolean {
    const h = this.p.equipe.find((x) => x.id === heroId);
    if (!h) return false;
    if (id) {
      const it = item(id);
      if (it.type !== slot || (it.pour && !it.pour.includes(heroId)) || (this.p.inventaire[id] ?? 0) <= 0) return false;
    }
    const ancien = h.equipement[slot];
    if (ancien) ajouterObjet(this.p, ancien, 1);
    if (id) {
      ajouterObjet(this.p, id, -1);
      h.equipement[slot] = id;
    } else delete h.equipement[slot];
    const s = statsHeros(h);
    h.pv = Math.min(h.pv, s.pvMax);
    h.ps = Math.min(h.ps, s.psMax);
    return true;
  }
  acheter(id: string, n = 1): boolean {
    const cout = item(id).prix * n;
    if (n <= 0 || this.p.or < cout) return false;
    this.p.or -= cout;
    ajouterObjet(this.p, id, n);
    return true;
  }
  vendre(id: string, n = 1): boolean {
    const it = item(id);
    if (it.type === 'cle' || n <= 0 || (this.p.inventaire[id] ?? 0) < n) return false;
    ajouterObjet(this.p, id, -n);
    this.p.or += Math.floor(it.prix / 2) * n;
    return true;
  }
  objectif(): string {
    return this.monde.objectifs.find((o) => condVraie(o.si, this.p.flags))?.texte ?? '';
  }
  ecouler(secondes: number): void {
    this.p.tempsJeu += secondes;
  }
  prendreEffets(): Effet[] {
    const e = this.effets;
    this.effets = [];
    return e;
  }
}
