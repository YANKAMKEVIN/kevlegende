// Point d'entrée du navigateur.
import './ui/styles.css';
import { App } from './app/app';
import { exposerCrochet } from './app/crochet';

const racine = document.getElementById('app');
if (!racine) throw new Error('#app introuvable');
const app = new App(racine);
exposerCrochet(app);
app.demarrer();
