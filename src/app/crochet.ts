// Crochet de test (Playwright) : lecture de l'état et raccourcis pour les parcours automatisés.
import { Bot } from '../bot/bot';
import { AVENTURE } from '../bot/walkthrough';
import { lancerEvenement } from '../core/story/runner';
import type { App } from './app';

export interface Crochet {
  etat: () => { ecran: string; mode: string | null; attente: string | null; carte: string | null; x: number; y: number; acte: number; niveau: number; flags: string[] };
  app: App;
  /** Joue la suite de l'aventure avec le bot (directement dans le moteur), puis rend la main à l'interface. */
  /** Lance un événement scripté (comme si le joueur parlait à quelqu'un). */
  evenement: (id: string) => void;
  bot: (etapes?: number) => { etapes: number; combats: number; fini: boolean };
}

declare global {
  interface Window {
    __kevlegende?: Crochet;
  }
}

export function exposerCrochet(app: App): void {
  window.__kevlegende = {
    app,
    etat: () => {
      const j = app.j;
      return {
        ecran: app.ecran,
        mode: j?.mode ?? null,
        attente: j?.attente?.type ?? null,
        carte: j?.p.carte ?? null,
        x: j?.p.x ?? -1,
        y: j?.p.y ?? -1,
        acte: j?.p.acte ?? 0,
        niveau: j ? Math.max(...j.p.equipe.map((h) => h.niveau)) : 0,
        flags: j ? Object.keys(j.p.flags).filter((k) => j.p.flags[k]) : [],
      };
    },
    evenement: (id) => lancerEvenement(app.jeu(), id),
    bot: (etapes = AVENTURE.length) => {
      const j = app.jeu();
      const journal = new Bot(j).jouer(AVENTURE.slice(0, etapes));
      return { etapes: journal.etapes, combats: journal.combats, fini: journal.fini };
    },
  };
}
