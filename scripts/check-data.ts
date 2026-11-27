// Vérifie la cohérence de tout le contenu du jeu (exécuté en CI).
import { MONDE } from '../src/data/monde';
import { validerMonde } from '../src/data/validate';

const erreurs = validerMonde(MONDE);
if (erreurs.length) {
  console.error(`Contenu incohérent (${erreurs.length}) :\n- ${erreurs.join('\n- ')}`);
  process.exit(1);
}
console.log(`Contenu : OK (${Object.keys(MONDE.cartes).length} cartes, ${Object.keys(MONDE.evenements).length} événements)`);
