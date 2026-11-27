// Lecture d'un événement de combat : chiffres, éclats, secousses, sons, bandeau.
import { trouver } from '../../core/battle/battle';
import type { BattleEvent, BattleState } from '../../core/battle/types';
import type { VueCombat } from './vue';

export interface RappelsLecture {
  son: (id: string) => void;
  annoncer: (t: string) => void;
  cartes: () => void;
  frise: () => void;
  ko: (uid: string) => void;
}

export const NOM_ELEMENT: Record<string, string> = { neutre: '', feu: 'Feu', eau: 'Eau', vent: 'Vent', terre: 'Terre', lumiere: 'Lumière', ombre: 'Ombre' };
export const NOM_STATUT: Record<string, string> = { poison: 'Poison', sommeil: 'Sommeil', affaibli: 'Affaibli', protege: 'Protégé', hate: 'Hâte', brise: 'Brisé' };
/** Durée (secondes, vitesse ×1) laissée à chaque événement. */
export const DUREES: Record<BattleEvent['t'], number> = { tour: 0.12, action: 0.5, degats: 0.32, soin: 0.35, statut: 0.3, bouclier: 0.12, brise: 0.6, ko: 0.4, releve: 0.4, rate: 0.35, message: 0.9, fin: 0.3 };

export function jouerEvenement(ev: BattleEvent, b: BattleState, vue: VueCombat, r: RappelsLecture): void {
  switch (ev.t) {
    case 'tour':
      vue.acteur = ev.acteur;
      r.frise();
      break;
    case 'action': {
      const c = trouver(b, ev.acteur);
      vue.e(ev.acteur).elan = 1;
      const el = NOM_ELEMENT[ev.element];
      r.annoncer(`${c.nom} · ${ev.nom}${el ? ` (${el})` : ''}`);
      r.son(ev.element !== 'neutre' ? 'magie' : 'menu');
      break;
    }
    case 'degats': {
      const v = vue.e(ev.cible);
      v.pv = Math.max(0, v.pv - ev.valeur);
      v.flash = 1;
      v.secoue = 1;
      const coul = ev.faible ? '#ffe58a' : ev.resiste ? '#b9b4c8' : ev.critique ? '#ff9f5a' : '#ffffff';
      vue.popup(ev.cible, String(ev.valeur), coul, ev.faible || ev.critique);
      if (ev.faible) vue.popup(ev.cible, 'FAIBLE !', '#ffe58a');
      else if (ev.resiste) vue.popup(ev.cible, 'Résiste', '#b9b4c8');
      else if (ev.critique) vue.popup(ev.cible, 'Critique !', '#ff9f5a');
      vue.eclat(ev.cible, ev.faible ? 'lumiere' : 'neutre', ev.faible ? 22 : 10);
      if (ev.faible || ev.critique) vue.secousse = 0.3;
      r.son(ev.faible ? 'faible' : ev.critique ? 'critique' : 'coup');
      r.cartes();
      break;
    }
    case 'soin': {
      const v = vue.e(ev.cible);
      if (!ev.ps) v.pv += ev.valeur;
      vue.popup(ev.cible, `+${ev.valeur}${ev.ps ? ' PS' : ''}`, ev.ps ? '#8fe3ff' : '#9be29a');
      vue.eclat(ev.cible, 'vent', 12);
      r.son('soin');
      r.cartes();
      break;
    }
    case 'statut':
      if (ev.ajoute) vue.popup(ev.cible, NOM_STATUT[ev.id] ?? ev.id, ev.id === 'hate' || ev.id === 'protege' ? '#8fe3ff' : '#c9a3ff');
      r.cartes();
      break;
    case 'bouclier':
      vue.e(ev.cible).bouclier = ev.reste;
      if (ev.reste > 0) vue.e(ev.cible).brise = false;
      break;
    case 'brise':
      vue.e(ev.cible).brise = true;
      vue.e(ev.cible).bouclier = 0;
      vue.popup(ev.cible, 'BRÈCHE !', '#ffe58a', true);
      vue.secousse = 0.5;
      vue.flashEcran = 1;
      r.son('brise');
      break;
    case 'ko':
      vue.e(ev.cible).pv = 0;
      vue.e(ev.cible).ko = trouver(b, ev.cible).camp === 'ennemis' ? 0.01 : 1;
      r.son('ko');
      r.ko(ev.cible);
      r.cartes();
      break;
    case 'releve':
      vue.e(ev.cible).ko = 0;
      vue.popup(ev.cible, 'Debout !', '#9be29a');
      break;
    case 'rate':
      vue.popup(ev.cible, 'Raté', '#cfe9f5');
      break;
    case 'message':
      r.annoncer(ev.texte);
      break;
    case 'fin':
      break;
  }
}
