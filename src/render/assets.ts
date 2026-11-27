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
