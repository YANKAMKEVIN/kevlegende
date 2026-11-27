// Déplacement case par case avec interpolation douce ; la logique reste dans le cœur du jeu.
import type { Jeu } from '../core/game';
import type { Dir } from '../core/types';
import { devant, pnjVisibles, propsVisibles, type ResultatPas } from '../core/world/explore';
import { ancre, casesProp } from '../core/world/map';
import type { PosVisuelle } from '../render/scene';

/** Durée d'un pas (secondes). */
export const DUREE_PAS = 0.17;

export class Marche {
  private anim: { dx: number; dy: number; t: number } | null = null;
  private compteur = 0;
  /** Petit délai avant de marcher : un appui bref ne fait que tourner le personnage. */
  private appui = 0;

  enCours(): boolean {
    return this.anim !== null;
  }
  arreter(): void {
    this.anim = null;
  }

  position(j: Jeu): PosVisuelle {
    const a = this.anim;
    const k = a ? 1 - a.t : 0;
    return { x: j.p.x - (a?.dx ?? 0) * k, y: j.p.y - (a?.dy ?? 0) * k, dir: j.p.dir, marche: a ? Math.max(0.01, a.t) : 0, pas: this.compteur };
  }

  /**
   * Avance l'animation et, si une direction est tenue, tente le pas suivant.
   * Renvoie le résultat du pas lancé (ou null).
   */
  maj(j: Jeu, dir: Dir | null, dt: number, quitte: (de: { x: number; y: number }) => void): ResultatPas | null {
    if (this.anim) {
      this.anim.t += dt / DUREE_PAS;
      if (this.anim.t < 1) return null;
      this.anim = null;
    }
    if (!dir) {
      this.appui = 0;
      return null;
    }
    if (j.mode !== 'exploration') return null;
    if (dir !== j.p.dir && this.appui === 0) {
      j.p.dir = dir;
      this.appui = 0.07;
      return null;
    }
    if (this.appui > 0) {
      this.appui -= dt;
      if (this.appui > 0) return null;
    }
    this.appui = -1;
    const de = { x: j.p.x, y: j.p.y };
    const carte = j.p.carte;
    const r = j.deplacer(dir);
    if (r === 'bloque' || r === 'occupe') return r;
    if (j.p.carte !== carte) return r; // Changement de carte : pas d'animation, un fondu s'en charge.
    const dx = j.p.x - de.x;
    const dy = j.p.y - de.y;
    if (dx !== 0 || dy !== 0) {
      this.anim = { dx, dy, t: 0 };
      this.compteur++;
      quitte(de);
    }
    return r;
  }
}

/** Y a-t-il quelque chose à faire devant le joueur ? (pour mettre le bouton A en valeur) */
export function actionDevant(j: Jeu): boolean {
  if (j.mode !== 'exploration') return false;
  const c = j.carte();
  const d = devant(j);
  if (pnjVisibles(j, c).some((n) => n.x === d.x && n.y === d.y)) return true;
  if ((c.def.coffres ?? []).some((k) => {
    const q = ancre(c, k.ancre);
    return q.x === d.x && q.y === d.y && !j.p.coffres.includes(`${c.def.id}:${k.id}`);
  }))
    return true;
  return propsVisibles(j, c).some((p) => p.evenement && casesProp(c, p).some((q) => q.x === d.x && q.y === d.y));
}
