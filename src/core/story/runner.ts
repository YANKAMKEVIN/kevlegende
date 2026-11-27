// Interpréteur des scripts d'événements : avance jusqu'à la prochaine attente de l'interface.
import { item } from '../../data/items';
import { hero } from '../../data/heroes';
import type { Jeu } from '../game';
import { ajouterObjet, nouveauHeros, soignerEquipe } from '../state';
import { xpPourNiveau } from '../progression';
import { condVraie } from '../world/map';
import type { Cmd, Script } from './script';

export interface Cadre {
  cmds: Script;
  i: number;
}

export function lancerEvenement(j: Jeu, id: string): void {
  const s = j.monde.evenements[id];
  if (!s) throw new Error(`Événement inconnu : ${id}`);
  j.pile.push({ cmds: s, i: 0 });
  j.mode = 'evenement';
  derouler(j);
}

/** Exécute les commandes jusqu'à une attente (dialogue, choix, combat…) ou la fin du script. */
export function derouler(j: Jeu): void {
  let garde = 0;
  while (!j.attente && j.pile.length > 0) {
    if (++garde > 10_000) throw new Error('Script sans fin');
    const cadre = j.pile[j.pile.length - 1]!;
    const cmd = cadre.cmds[cadre.i];
    if (!cmd) {
      j.pile.pop();
      continue;
    }
    cadre.i++;
    executerCmd(j, cmd);
  }
  if (!j.attente && j.pile.length === 0 && j.mode === 'evenement') j.mode = 'exploration';
}

function executerCmd(j: Jeu, cmd: Cmd): void {
  const p = j.p;
  switch (cmd.c) {
    case 'dit':
      j.attente = { type: 'dit', qui: cmd.qui ?? null, texte: cmd.texte, portrait: cmd.portrait ?? null };
      return;
    case 'choix':
      j.choixEnCours = cmd.options.map((o) => o.faire);
      j.attente = { type: 'choix', texte: cmd.texte, options: cmd.options.map((o) => o.texte) };
      return;
    case 'si':
      if (condVraie(cmd.cond, p.flags)) j.pile.push({ cmds: cmd.alors, i: 0 });
      else if (cmd.sinon) j.pile.push({ cmds: cmd.sinon, i: 0 });
      return;
    case 'flag':
      p.flags[cmd.nom] = cmd.val ?? true;
      return;
    case 'donne': {
      const n = cmd.n ?? 1;
      ajouterObjet(p, cmd.objet, n);
      j.effets.push({ type: 'objet', objet: cmd.objet, n });
      if (!cmd.silencieux) {
        const txt = n > 1 ? `${item(cmd.objet).nom} ×${n}` : item(cmd.objet).nom;
        j.attente = { type: 'dit', qui: null, texte: `Obtenu : ${txt}.`, portrait: null };
      }
      return;
    }
    case 'retire':
      ajouterObjet(p, cmd.objet, -(cmd.n ?? 1));
      return;
    case 'or':
      p.or = Math.max(0, p.or + cmd.n);
      j.effets.push({ type: 'or', n: cmd.n });
      if (cmd.n > 0) j.attente = { type: 'dit', qui: null, texte: `Obtenu : ${cmd.n} pièces.`, portrait: null };
      return;
    case 'paye':
      if (p.or >= cmd.n) {
        p.or -= cmd.n;
        j.pile.push({ cmds: cmd.alors, i: 0 });
      } else j.pile.push({ cmds: cmd.sinon, i: 0 });
      return;
    case 'rejoint': {
      if (p.equipe.some((h) => h.id === cmd.hero)) return;
      // Le nouveau venu arrive au niveau du groupe (au moins celui indiqué).
      const niv = Math.max(cmd.niveau ?? 1, ...p.equipe.map((h) => h.niveau));
      p.equipe.push(nouveauHeros(cmd.hero, niv, xpPourNiveau(niv)));
      j.effets.push({ type: 'rejoint', hero: cmd.hero });
      j.attente = { type: 'dit', qui: null, texte: `${hero(cmd.hero).nom} rejoint le groupe !`, portrait: null };
      return;
    }
    case 'combat':
      j.demarrerCombat(cmd.groupe, { fuite: cmd.fuite ?? false, defaiteOk: cmd.defaiteOk ?? false });
      return;
    case 'soin':
      soignerEquipe(p);
      return;
    case 'teleporte':
      j.teleporter(cmd.carte, cmd.ancre, cmd.dir);
      return;
    case 'boutique':
      j.attente = { type: 'boutique', id: cmd.id };
      return;
    case 'quete':
      if (p.quetes[cmd.id] === cmd.etat) return;
      p.quetes[cmd.id] = cmd.etat;
      j.effets.push({ type: 'quete', id: cmd.id, etat: cmd.etat });
      return;
    case 'titre':
      j.attente = { type: 'titre', texte: cmd.texte, sous: cmd.sous ?? null };
      return;
    case 'acte':
      p.acte = cmd.n;
      return;
    case 'fin':
      j.attente = { type: 'fin', texte: cmd.texte };
      return;
    case 'son':
      j.effets.push({ type: 'son', id: cmd.id });
      return;
    case 'secousse':
      j.effets.push({ type: 'secousse' });
      return;
    case 'flash':
      j.effets.push({ type: 'flash', couleur: cmd.couleur ?? '#ffffff' });
      return;
    case 'sauve':
      j.effets.push({ type: 'sauve' });
      return;
    case 'appel': {
      const s = j.monde.evenements[cmd.evenement];
      if (!s) throw new Error(`Événement inconnu : ${cmd.evenement}`);
      j.pile.push({ cmds: s, i: 0 });
      return;
    }
  }
}

