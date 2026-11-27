// Intelligence des ennemis : choix pondéré d'une attaque, cible privilégiant les héros fragiles.
import { skill } from '../../data/skills';
import { ENEMIES } from '../../data/enemies';
import type { Rng } from '../rng';
import type { Action, BattleState, Combattant } from './types';
import { aStatut } from './status';

export function choisirActionEnnemi(b: BattleState, c: Combattant, r: Rng): Action {
  const def = ENEMIES[c.ref];
  const heros = b.combattants.filter((x) => x.camp === 'heros' && x.pv > 0);
  const options = (def?.attaques ?? [{ id: 'e_charge', poids: 1 }]).filter((a) => {
    // Inutile de se protéger deux fois.
    if (skill(a.id).cible === 'soi' && aStatut(c, 'protege')) return false;
    return true;
  });
  const choix = r.weighted(options.length ? options : [{ id: 'e_charge', poids: 1 }], (a) => a.poids);
  const sk = skill(choix.id);
  if (sk.cible === 'soi' || sk.cible === 'ennemis' || sk.cible === 'allies') {
    return { type: 'competence', id: sk.id, cible: c.uid };
  }
  // Cible : pondérée vers les héros aux PV les plus bas (ratio), sans être déterministe.
  const cible = r.weighted(heros, (h) => 1.5 - h.pv / h.stats.pvMax);
  return { type: 'competence', id: sk.id, cible: cible.uid };
}
