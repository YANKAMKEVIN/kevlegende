// Tactique de combat du bot : soigner, relever, exploiter les faiblesses, briser les boucliers.
import { skill } from '../data/skills';
import { item } from '../data/items';
import { affinite } from '../core/battle/damage';
import { aStatut } from '../core/battle/status';
import type { Action, BattleState, Combattant } from '../core/battle/types';
import type { SkillDef } from '../core/types';

const ratio = (c: Combattant) => c.pv / c.stats.pvMax;

export function choisirAction(b: BattleState, acteur: Combattant, inv: Record<string, number>): Action {
  const allies = b.combattants.filter((c) => c.camp === 'heros');
  const vivants = allies.filter((c) => c.pv > 0);
  const ko = allies.filter((c) => c.pv <= 0);
  const ennemis = b.combattants.filter((c) => c.camp === 'ennemis' && c.pv > 0);
  const peut = (id: string) => acteur.competences.includes(id) && acteur.ps >= skill(id).cout;

  // 1. Relever un allié tombé.
  if (ko.length) {
    if (peut('eveil')) return { type: 'competence', id: 'eveil', cible: ko[0]!.uid };
    if ((inv['plume_aube'] ?? 0) > 0) return { type: 'objet', id: 'plume_aube', cible: ko[0]!.uid };
  }
  // 2. Soigner.
  const blesses = vivants.filter((c) => ratio(c) < 0.45).sort((x, y) => ratio(x) - ratio(y));
  if (blesses.length >= 2 && peut('brise_douce')) return { type: 'competence', id: 'brise_douce', cible: acteur.uid };
  if (blesses.length) {
    const cible = blesses[0]!;
    if (peut('baume')) return { type: 'competence', id: 'baume', cible: cible.uid };
    if (ratio(cible) < 0.3) {
      if (blesses.length >= 2 && (inv['elixir_vents'] ?? 0) > 0) return { type: 'objet', id: 'elixir_vents', cible: cible.uid };
      const pot = cible.stats.pvMax - cible.pv > 80 && (inv['tonique'] ?? 0) > 0 ? 'tonique' : (inv['herbe_douce'] ?? 0) > 0 ? 'herbe_douce' : (inv['tonique'] ?? 0) > 0 ? 'tonique' : null;
      if (pot) return { type: 'objet', id: pot, cible: cible.uid };
    }
  }
  const endormi = vivants.find((c) => aStatut(c, 'sommeil') || aStatut(c, 'poison'));
  if (endormi && peut('purification')) return { type: 'competence', id: 'purification', cible: endormi.uid };
  // 3. Protections lors des gros combats.
  if (b.boss && peut('rempart') && !vivants.every((c) => aStatut(c, 'protege'))) return { type: 'competence', id: 'rempart', cible: acteur.uid };
  if (b.boss && peut('second_souffle') && !aStatut(acteur, 'hate') && acteur.ps >= 14) return { type: 'competence', id: 'second_souffle', cible: acteur.uid };
  // 4. Attaquer : la meilleure option offensive.
  return meilleureAttaque(acteur, ennemis, inv, b.boss);
}

function score(acteur: Combattant, sk: SkillDef, el: string, cibles: Combattant[]): number {
  const stat = sk.type === 'magique' ? acteur.stats.mag : acteur.stats.atk;
  let total = 0;
  for (const c of cibles) {
    const def = sk.type === 'magique' ? c.stats.res : c.stats.def;
    let v = (sk.puissance / 10) * stat * (stat / (stat + def)) * (sk.coups ?? 1);
    const aff = affinite(c, el as SkillDef['element']);
    if (aff === 'faible') v *= c.bouclier > 0 && c.brise === 0 ? 1.5 * 1.6 : 1.5;
    if (aff === 'resiste') v *= 0.5;
    if (c.brise > 0) v *= 1.5;
    total += Math.min(v, c.pv * 1.2);
  }
  return total;
}

function meilleureAttaque(acteur: Combattant, ennemis: Combattant[], inv: Record<string, number>, boss: boolean): Action {
  const cible = [...ennemis].sort((x, y) => (y.brise > 0 ? 1 : 0) - (x.brise > 0 ? 1 : 0) || x.pv - y.pv)[0]!;
  let best: { s: number; a: Action } = {
    s: score(acteur, skill('attaque'), acteur.elementArme, [cible]),
    a: { type: 'attaque', cible: cible.uid },
  };
  // Réserve de PS pour les soins de Mira.
  const reserve = acteur.competences.includes('baume') ? 6 : 0;
  for (const id of acteur.competences) {
    const sk = skill(id);
    if (sk.type !== 'physique' && sk.type !== 'magique') continue;
    if (acteur.ps - sk.cout < reserve && !boss) continue;
    if (acteur.ps < sk.cout) continue;
    if (sk.cible === 'ennemis') {
      const s = score(acteur, sk, sk.element, ennemis) * 0.95;
      if (s > best.s) best = { s, a: { type: 'competence', id, cible: cible.uid } };
    } else {
      for (const e of ennemis) {
        const s = score(acteur, sk, sk.element, [e]) * (e === cible ? 1.1 : 1);
        if (s > best.s) best = { s, a: { type: 'competence', id, cible: e.uid } };
      }
    }
  }
  // Objets offensifs pour briser un boss quand personne n'a l'élément.
  if (boss) {
    for (const [id, n] of Object.entries(inv)) {
      if (n <= 0) continue;
      const it = item(id);
      if (!it.degats) continue;
      for (const e of ennemis) {
        if (affinite(e, it.degats.element) !== 'faible' || e.brise > 0) continue;
        const s = (it.degats.puissance + e.niveau * 3) * 1.5 * 1.6;
        if (s > best.s) best = { s, a: { type: 'objet', id, cible: e.uid } };
      }
    }
  }
  return best.a;
}
