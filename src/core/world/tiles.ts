// Catalogue des tuiles : caractère du plan -> nature du terrain.

export type TileId =
  | 'herbe' | 'herbe_haute' | 'chemin' | 'pave' | 'roche' | 'arbre' | 'eau' | 'pont' | 'ciel'
  | 'plancher' | 'mur' | 'sol_grotte' | 'paroi' | 'gouffre' | 'fleurs' | 'sable' | 'quai'
  | 'buisson' | 'cristal' | 'tapis' | 'marches' | 'corail' | 'sol_corail' | 'pont_bois' | 'coque'
  | 'dune' | 'gres' | 'dalle' | 'parvis' | 'mur_temple' | 'cactus'
  | 'neige' | 'neige_tassee' | 'glace' | 'congere' | 'mur_glace' | 'sol_givre'
  | 'cendre' | 'dalle_pale' | 'brume_dense' | 'marbre' | 'mur_palais' | 'ruine';

export interface TileInfo {
  id: TileId;
  passable: boolean;
  /** Zone de rencontres aléatoires (si la carte en définit). */
  rencontres: boolean;
}

const T = (id: TileId, passable: boolean, rencontres = false): TileInfo => ({ id, passable, rencontres });

export const TILES: Readonly<Record<string, TileInfo>> = {
  '.': T('herbe', true),
  ',': T('herbe_haute', true, true),
  ':': T('chemin', true),
  _: T('pave', true),
  '#': T('roche', false),
  T: T('arbre', false),
  '~': T('eau', false),
  '=': T('pont', true),
  o: T('ciel', false),
  w: T('plancher', true),
  W: T('mur', false),
  c: T('sol_grotte', true, true),
  C: T('paroi', false),
  v: T('gouffre', false),
  f: T('fleurs', true),
  s: T('sable', true),
  d: T('quai', true),
  b: T('buisson', false),
  '*': T('cristal', false),
  x: T('tapis', true),
  '^': T('marches', true),
  r: T('corail', false),
  k: T('sol_corail', true, true),
  p: T('pont_bois', true),
  h: T('coque', true, true),
  y: T('dune', true, true),
  g: T('gres', false),
  l: T('dalle', true, true),
  e: T('parvis', true),
  m: T('mur_temple', false),
  q: T('cactus', false),
  n: T('neige', true, true),
  t: T('neige_tassee', true),
  i: T('glace', true),
  u: T('congere', false),
  z: T('mur_glace', false),
  a: T('sol_givre', true, true),
  j: T('cendre', true, true),
  '-': T('dalle_pale', true),
  '%': T('brume_dense', false),
  '+': T('marbre', true, true),
  '|': T('mur_palais', false),
  '&': T('ruine', false),
};

export const isTileChar = (ch: string): boolean => ch in TILES;
