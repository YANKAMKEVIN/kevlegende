// Illustrations peintes (titre, portraits, décors et ennemis de combat), chargées à la demande.
// Le jeu reste jouable sans elles : chaque usage a un repli procédural.

const images = new Map<string, HTMLImageElement | null>();
const enCours = new Map<string, Promise<HTMLImageElement | null>>();

/** URL d'une illustration (dossier public/art, servi tel quel par Vite). */
export const urlArt = (id: string) => `./art/${id}.webp`;

export function chargerArt(id: string): Promise<HTMLImageElement | null> {
  const deja = enCours.get(id);
  if (deja) return deja;
  const p = new Promise<HTMLImageElement | null>((ok) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      images.set(id, img);
      ok(img);
    };
    img.onerror = () => {
      images.set(id, null);
      ok(null);
    };
    img.src = urlArt(id);
  });
  enCours.set(id, p);
  return p;
}

/** Image si elle est déjà prête, sinon lance le chargement et renvoie null. */
export function art(id: string): HTMLImageElement | null {
  if (!images.has(id)) void chargerArt(id);
  return images.get(id) ?? null;
}

/** Décor de combat correspondant à une carte. */
export function fondCombat(carte: string): string {
  const table: Record<string, string> = {
    maison_ael: 'village',
    mairie: 'village',
    clairval: 'village',
    bois: 'bois',
    col: 'col',
    grotte1: 'grotte',
    grotte2: 'grotte',
    colline: 'colline',
    port: 'port',
    forge: 'port',
    recifs: 'recifs',
    epave: 'epave',
    phare: 'phare',
  };
  return `fond_${table[carte] ?? 'village'}`;
}

/** Toutes les illustrations du jeu (pour le préchargement en tâche de fond). */
export const ARTS: readonly string[] = [
  'titre',
  ...['ael', 'mira', 'brann', 'odile', 'fendril', 'tilda', 'rosa', 'fenouil', 'bertille', 'pim', 'gus', 'oswin', 'tobias', 'pip', 'maelle', 'marin', 'nell', 'creux', 'roi', 'sentinelle', 'villageois', 'villageoise'].map((p) => `portrait_${p}`),
  ...['village', 'bois', 'col', 'grotte', 'colline', 'port', 'recifs', 'epave', 'phare'].map((f) => `fond_${f}`),
];

/** Précharge les portraits puis les décors, quelques images à la fois, sans gêner le jeu. */
export async function prechargerTout(ennemis: readonly string[]): Promise<void> {
  const file = [...ARTS, ...ennemis.map((e) => `ennemi_${e}`)];
  const lot = 4;
  for (let i = 0; i < file.length; i += lot) await Promise.all(file.slice(i, i + lot).map(chargerArt));
}
