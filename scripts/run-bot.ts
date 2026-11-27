// Fait jouer le bot sur toute l'aventure et affiche un bilan (calibrage de la difficulté).
import { Jeu } from '../src/core/game';
import { MONDE } from '../src/data/monde';
import { Bot } from '../src/bot/bot';
import { AVENTURE } from '../src/bot/walkthrough';

const seed = Number(process.argv[2] ?? 1);
const j = Jeu.nouvelle(MONDE, seed);
const bot = new Bot(j, 400_000, (m) => console.log(m));
const t0 = Date.now();
let etape = 0;
try {
  bot.gerer();
  for (const e of AVENTURE) {
    bot.etape(e);
    bot.seReposer(0.4);
    etape++;
    if ('jusqua' in e && e.jusqua && ['mira_rejoint', 'serpent_vaincu', 'fanal1_allume', 'creux_vaincu', 'kraken_vaincu'].includes(e.jusqua))
      console.log(`✓ ${e.jusqua} — niveaux ${j.p.equipe.map((h) => `${h.id}:${h.niveau}`).join(' ')} — combats ${bot.journal.combats}, défaites ${bot.journal.defaites}, or ${j.p.or}`);
  }
} catch (e) {
  console.error(`ÉCHEC à l étape ${etape} :`, (e as Error).message, j.mode, j.p.carte, j.p.x, j.p.y, j.p.dir, j.p.equipe.map((h) => h.pv), JSON.stringify(j.p.flags));
}
console.log({ ...bot.journal, ms: Date.now() - t0, flagsFin: !!j.p.flags['acte2_fini'] });
