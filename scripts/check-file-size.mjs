// Garde-fou d'architecture : aucun « fichier-dieu » dans src/ (max 400 lignes par module).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const MAX = 400;
const bad = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|css)$/.test(f)) {
      const n = readFileSync(p, 'utf8').split('\n').length;
      if (n > MAX) bad.push(`${p} : ${n} lignes`);
    }
  }
};
walk('src');
if (bad.length) {
  console.error(`Fichiers trop longs (> ${MAX} lignes) :\n${bad.join('\n')}`);
  process.exit(1);
}
console.log('Taille des modules : OK');
