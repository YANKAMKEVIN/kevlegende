// Apparences des personnages non joueurs (rendu procédural des sprites).
import type { Apparence } from '../../core/world/mapdef';

const H = (peau: string, cheveux: string, tenue: string, accent: string, coiffure: Apparence['coiffure']): Apparence => ({ peau, cheveux, tenue, accent, coiffure });

export const APP = {
  odile: H('#f0cfb0', '#e8e4dc', '#6b4c7a', '#f2b84b', 'chignon'),
  fendril: H('#d9a77f', '#8a8a8a', '#2f4f6f', '#d8b25a', 'chauve'),
  tilda: H('#f3c9a2', '#c0532b', '#4f7a4a', '#f4e3b5', 'tresse'),
  rosa: H('#b97a52', '#2b1d16', '#a3423a', '#f2d8a7', 'chignon'),
  fenouil: H('#e7c4a1', '#5f7d3a', '#3f6b4f', '#b5d17a', 'longue'),
  bertille: H('#f6d2b3', '#e0a63a', '#c27a8e', '#fbe7c6', 'tresse'),
  pim: H('#e9b98f', '#6e3b1e', '#d8823a', '#7ab8d9', 'courte'),
  gus: H('#c98e62', '#cfcfcf', '#30506b', '#e8c26a', 'capuche'),
  oswin: H('#dcae86', '#4a3626', '#5b6470', '#b0b8c4', 'courte'),
  tobias: H('#e4bb94', '#dcdcdc', '#7a5c3a', '#c9a35a', 'longue'),
  pip: H('#f0c49c', '#d3a04a', '#5e8bb0', '#f2e2b8', 'courte'),
  villageois: H('#e2b48d', '#5a3a28', '#7f6a4f', '#d9c08a', 'courte'),
  villageoise: H('#c48a63', '#2e211b', '#5a7fa0', '#f0d5a0', 'longue'),
  mira: H('#8d5a3b', '#1d1a2e', '#8a4f7d', '#7fd1c1', 'tresse'),
  brann: H('#c98e62', '#b5532a', '#5b4a3a', '#e07b39', 'crete'),
  marin: H('#d6a47c', '#3a2a1f', '#2d4b6e', '#e9e2cf', 'capuche'),
  capitaine: H('#e0b088', '#9a9a9a', '#1f3a5a', '#d4a64a', 'courte'),
  poule: { peau: '#ffffff', cheveux: '#d8473a', tenue: '#f7f2e8', accent: '#f2b84b', coiffure: 'courte', espece: 'poule' } as Apparence,
  chat: { peau: '#e8a25a', cheveux: '#e8a25a', tenue: '#e8a25a', accent: '#ffffff', coiffure: 'courte', espece: 'chat' } as Apparence,
  loup: { peau: '#8f9bb3', cheveux: '#5d6275', tenue: '#8f9bb3', accent: '#e8f0ff', coiffure: 'courte', espece: 'chien' } as Apparence,
  ombre: { peau: '#2a2540', cheveux: '#14111f', tenue: '#3a3550', accent: '#b7a6ff', coiffure: 'capuche', espece: 'esprit' } as Apparence,
  serpent: { peau: '#5fa39a', cheveux: '#2e6b63', tenue: '#5fa39a', accent: '#ffe08a', coiffure: 'courte', espece: 'esprit' } as Apparence,
};
