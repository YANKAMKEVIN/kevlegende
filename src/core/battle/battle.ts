// Déroulement du combat : ordre des tours, exécution des actions, fin de combat.
import { skill } from '../../data/skills';
import { item } from '../../data/items';
import { Rng } from '../rng';
import type { Element, SkillDef } from '../types';
import { calculerDegats, calculerSoin, degatsObjet } from './damage';
import { aStatut, ajouterStatut, delaiTour, purifier, retirerStatut, vieillirStatuts } from './status';
import type { Action, BattleEvent, BattleState, Combattant } from './types';
import { choisirActionEnnemi } from './ai';

export type Inventaire = Record<string, number>;

export const vivants = (b: BattleState, camp: Combattant['camp']) => b.combattants.filter((c) => c.camp === camp && c.pv > 0);
export const trouver = (b: BattleState, uid: string): Combattant => {
  const c = b.combattants.find((x) => x.uid === uid);
  if (!c) throw new Error(`Combattant introuvable : ${uid}`);
  return c;
};

function avecRng<T>(b: BattleState, f: (r: Rng) => T): T {
  const r = new Rng(1);
  r.state = b.rng;
  const v = f(r);
  b.rng = r.state;
  return v;
}

/** Ordre des prochains tours (pour la frise affichée). */
export function ordrePrevu(b: BattleState, n: number): string[] {
  const sim = b.combattants.filter((c) => c.pv > 0).map((c) => ({ uid: c.uid, delai: c.delai, pas: delaiTour(c) }));
  const out: string[] = [];
  while (out.length < n && sim.length > 0) {
    sim.sort((x, y) => x.delai - y.delai);
    const s = sim[0]!;
    out.push(s.uid);
    s.delai += s.pas;
  }
  return out;
}

function verifierFin(b: BattleState, ev: BattleEvent[]): boolean {
  if (b.fini) return true;
  if (vivants(b, 'ennemis').length === 0) b.fini = 'victoire';
  else if (vivants(b, 'heros').length === 0) b.fini = 'defaite';
  if (b.fini) {
    b.attente = null;
    ev.push({ t: 'fin', resultat: b.fini });
  }
  return !!b.fini;
}

function finDeTour(b: BattleState, c: Combattant, ev: BattleEvent[]): void {
  for (const id of vieillirStatuts(c)) ev.push({ t: 'statut', cible: c.uid, id, ajoute: false });
  c.delai += delaiTour(c);
  b.tour++;
}

/**
 * Fait avancer le combat jusqu'à ce qu'un héros doive choisir une action (b.attente) ou que le combat se termine.
 * Les tours ennemis sont joués automatiquement.
 */
export function avancer(b: BattleState): BattleEvent[] {
  const ev: BattleEvent[] = [];
  let garde = 0;
  while (!b.fini && !b.attente) {
    if (++garde > 500) throw new Error('Boucle de combat infinie');
    const actifs = b.combattants.filter((c) => c.pv > 0).sort((x, y) => x.delai - y.delai);
    const c = actifs[0];
    if (!c) break;
    const d = c.delai;
    for (const x of actifs) x.delai -= d;
    c.defense = false;
    ev.push({ t: 'tour', acteur: c.uid });
    // Début de tour : poison.
    if (aStatut(c, 'poison')) {
      const v = Math.max(1, Math.round(c.stats.pvMax * 0.07));
      c.pv = Math.max(0, c.pv - v);
      ev.push({ t: 'degats', cible: c.uid, valeur: v, faible: false, resiste: false, critique: false });
      if (c.pv <= 0) {
        ev.push({ t: 'ko', cible: c.uid });
        if (verifierFin(b, ev)) break;
        continue;
      }
    }
    // Brisé : perd son tour puis récupère son bouclier.
    if (c.brise > 0) {
      c.brise--;
      if (c.brise === 0) {
        c.bouclier = c.bouclierMax;
        retirerStatut(c, 'brise');
        ev.push({ t: 'bouclier', cible: c.uid, reste: c.bouclier });
        ev.push({ t: 'message', texte: `${c.nom} se ressaisit.` });
      }
      finDeTour(b, c, ev);
      continue;
    }
    if (aStatut(c, 'sommeil')) {
      ev.push({ t: 'message', texte: `${c.nom} dort profondément…` });
      finDeTour(b, c, ev);
      continue;
    }
    if (c.camp === 'heros') {
      b.attente = c.uid;
      break;
    }
    const action = avecRng(b, (r) => choisirActionEnnemi(b, c, r));
    executer(b, c, action, {}, ev);
    if (verifierFin(b, ev)) break;
    finDeTour(b, c, ev);
  }
  return ev;
}

/** Le héros en attente joue l'action choisie. */
export function agir(b: BattleState, action: Action, inv: Inventaire): BattleEvent[] {
  if (!b.attente) throw new Error("Aucun héros n'attend d'ordre");
  const c = trouver(b, b.attente);
  const err = validerAction(b, c, action, inv);
  if (err) throw new Error(err);
  const ev: BattleEvent[] = [];
  b.attente = null;
  executer(b, c, action, inv, ev);
  if (!verifierFin(b, ev)) finDeTour(b, c, ev);
  return ev;
}

export function validerAction(b: BattleState, c: Combattant, a: Action, inv: Inventaire): string | null {
  if (a.type === 'defense') return null;
  if (a.type === 'fuite') return b.fuitePossible ? null : 'Impossible de fuir ce combat.';
  if (a.type === 'competence') {
    if (!c.competences.includes(a.id)) return 'Compétence inconnue.';
    if (c.ps < skill(a.id).cout) return 'Pas assez de PS.';
    return validerCible(b, skill(a.id).cible, a.cible, c);
  }
  if (a.type === 'objet') {
    if ((inv[a.id] ?? 0) <= 0) return "Vous n'avez plus cet objet.";
    const it = item(a.id);
    if (it.type !== 'conso') return 'Objet inutilisable en combat.';
    return validerCible(b, it.cible ?? 'allie', a.cible, c);
  }
  return validerCible(b, 'ennemi', a.cible, c);
}

function validerCible(b: BattleState, type: SkillDef['cible'], uid: string, lanceur: Combattant): string | null {
  if (type === 'ennemis' || type === 'allies' || type === 'soi') return null;
  const t = b.combattants.find((x) => x.uid === uid);
  if (!t) return 'Cible invalide.';
  const campVise = type === 'ennemi' ? (lanceur.camp === 'heros' ? 'ennemis' : 'heros') : lanceur.camp;
  if (t.camp !== campVise) return 'Cible invalide.';
  if (type === 'allieKO' ? t.pv > 0 : t.pv <= 0) return 'Cible invalide.';
  return null;
}

function cibles(b: BattleState, lanceur: Combattant, type: SkillDef['cible'], uid: string): Combattant[] {
  const adverse = lanceur.camp === 'heros' ? 'ennemis' : 'heros';
  if (type === 'ennemis') return vivants(b, adverse);
  if (type === 'allies') return vivants(b, lanceur.camp);
  if (type === 'soi') return [lanceur];
  const t = trouver(b, uid);
  if (type === 'ennemi' && t.pv <= 0) {
    const repli = vivants(b, adverse)[0];
    return repli ? [repli] : [];
  }
  return [t];
}

function frapper(b: BattleState, l: Combattant, t: Combattant, type: 'physique' | 'magique', p: number, el: Element, ev: BattleEvent[]): void {
  if (t.pv <= 0) return;
  const calc = avecRng(b, (r) => calculerDegats(l, t, type, p, el, r.next(), r.next()));
  appliquerDegats(t, calc, el, ev);
}

function appliquerDegats(t: Combattant, calc: ReturnType<typeof calculerDegats>, el: Element, ev: BattleEvent[]): void {
  t.pv = Math.max(0, t.pv - calc.valeur);
  ev.push({ t: 'degats', cible: t.uid, valeur: calc.valeur, faible: calc.faible, resiste: calc.resiste, critique: calc.critique });
  if (retirerStatut(t, 'sommeil')) ev.push({ t: 'statut', cible: t.uid, id: 'sommeil', ajoute: false });
  if (calc.faible && t.camp === 'ennemis') {
    if (!t.revelees.includes(el)) t.revelees.push(el);
    if (t.brise === 0 && t.bouclier > 0) {
      t.bouclier--;
      ev.push({ t: 'bouclier', cible: t.uid, reste: t.bouclier });
      if (t.bouclier === 0) {
        t.brise = 2;
        ajouterStatut(t, 'brise', 99);
        ev.push({ t: 'brise', cible: t.uid });
      }
    }
  }
  if (t.pv <= 0) {
    t.statuts = [];
    ev.push({ t: 'ko', cible: t.uid });
  }
}

function executer(b: BattleState, c: Combattant, a: Action, inv: Inventaire, ev: BattleEvent[]): void {
  if (a.type === 'defense') {
    c.defense = true;
    c.ps = Math.min(c.stats.psMax, c.ps + 2);
    ev.push({ t: 'action', acteur: c.uid, nom: 'Défense', element: 'neutre' });
    return;
  }
  if (a.type === 'fuite') {
    ev.push({ t: 'action', acteur: c.uid, nom: 'Fuite', element: 'neutre' });
    const vh = moyenneVit(vivants(b, 'heros'));
    const ve = moyenneVit(vivants(b, 'ennemis'));
    const p = Math.min(0.9, Math.max(0.25, 0.55 + (vh - ve) * 0.03));
    if (avecRng(b, (r) => r.chance(p))) {
      b.fini = 'fuite';
      ev.push({ t: 'fin', resultat: 'fuite' });
    } else ev.push({ t: 'message', texte: 'Impossible de s’échapper !' });
    return;
  }
  if (a.type === 'objet') {
    utiliserObjet(b, c, a.id, a.cible, inv, ev);
    return;
  }
  const sk = skill(a.type === 'attaque' ? 'attaque' : a.id);
  c.ps -= sk.cout;
  const el = sk.id === 'attaque' ? c.elementArme : sk.element;
  ev.push({ t: 'action', acteur: c.uid, nom: sk.nom, element: el });
  const ts = cibles(b, c, sk.cible, a.type === 'attaque' || a.type === 'competence' ? a.cible : c.uid);
  for (const t of ts) {
    if (sk.type === 'physique' || sk.type === 'magique') {
      for (let i = 0; i < (sk.coups ?? 1); i++) frapper(b, c, t, sk.type, sk.puissance, el, ev);
    } else if (sk.type === 'soin') {
      const v = Math.min(calculerSoin(c, sk), t.stats.pvMax - t.pv);
      t.pv += v;
      ev.push({ t: 'soin', cible: t.uid, valeur: v });
    } else if (sk.type === 'reveil') {
      t.pv = Math.max(1, Math.round(t.stats.pvMax * 0.35));
      ev.push({ t: 'releve', cible: t.uid });
    }
    if (sk.purifie) for (const id of purifier(t)) ev.push({ t: 'statut', cible: t.uid, id, ajoute: false });
    if (sk.statut && t.pv > 0) {
      const st = sk.statut;
      if (avecRng(b, (r) => r.chance(st.chance))) {
        ajouterStatut(t, st.id, st.tours);
        ev.push({ t: 'statut', cible: t.uid, id: st.id, ajoute: true });
      } else if (sk.type !== 'soutien') ev.push({ t: 'rate', cible: t.uid });
    }
  }
}

function utiliserObjet(b: BattleState, c: Combattant, id: string, uid: string, inv: Inventaire, ev: BattleEvent[]): void {
  const it = item(id);
  inv[id] = (inv[id] ?? 0) - 1;
  if (inv[id]! <= 0) delete inv[id];
  ev.push({ t: 'action', acteur: c.uid, nom: it.nom, element: it.degats?.element ?? 'neutre' });
  for (const t of cibles(b, c, it.cible ?? 'allie', uid)) {
    if (it.degats) appliquerDegats(t, degatsObjet(t, it.degats.puissance, it.degats.element), it.degats.element, ev);
    if (it.reveil && t.pv <= 0) {
      t.pv = Math.round(t.stats.pvMax / 2);
      ev.push({ t: 'releve', cible: t.uid });
    }
    if (it.soinPv && t.pv > 0) {
      const v = Math.min(it.soinPv, t.stats.pvMax - t.pv);
      t.pv += v;
      ev.push({ t: 'soin', cible: t.uid, valeur: v });
    }
    if (it.soinPs) {
      const v = Math.min(it.soinPs, t.stats.psMax - t.ps);
      t.ps += v;
      ev.push({ t: 'soin', cible: t.uid, valeur: v, ps: true });
    }
    if (it.purifie) for (const s of purifier(t)) ev.push({ t: 'statut', cible: t.uid, id: s, ajoute: false });
  }
}

const moyenneVit = (cs: Combattant[]) => (cs.length ? cs.reduce((s, c) => s + c.stats.vit, 0) / cs.length : 0);
