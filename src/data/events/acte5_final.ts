// Acte V : le Palais Pâle, la salle du trône, le Roi Pâle et le Fanal Premier. La fin de l'aventure.
import type { Script } from '../../core/story/script';

const A = 'Aël';
const M = 'Mira';
const B = 'Brann';
const N = 'Nour';
const ROI = 'Le Roi Pâle';
const MO = 'Morvane';
const L = 'Lune';

export const ACTE5_FINAL: Record<string, Script> = {
  // ---------- Palais Pâle ----------
  entree_palais: [
    { c: 'si', cond: ['!palais_vu'], alors: [
      { c: 'dit', texte: "Des salles immenses, un marbre blanc comme l'os, et partout le même silence. Des gardes pâles font leur ronde depuis mille ans, sans savoir pour qui." },
      { c: 'dit', qui: M, portrait: 'mira', texte: "Restons groupés. Si l'un de nous s'endort, les autres le réveillent." },
      { c: 'flag', nom: 'palais_vu' },
    ] },
  ],
  statue_garde: [{ c: 'dit', texte: "Un garde de marbre, la lance levée. Son visage a été poli par mille ans de brume." }],
  veilleur_palais: [
    { c: 'si', cond: ['!veilleur_vu'], alors: [
      { c: 'dit', qui: 'Veilleur', portrait: 'veilleur', texte: "N'ayez pas peur. Je suis Gauvin, Veilleur. Je suis monté jusqu'ici il y a cent ans, et je ne suis jamais redescendu." },
      { c: 'dit', qui: 'Veilleur', portrait: 'veilleur', texte: "Ma lanterne brûle encore, elle. Tant qu'elle brûle, je reste. Asseyez-vous près d'elle chaque fois qu'il le faudra." },
      { c: 'dit', qui: N, portrait: 'nour', texte: "Des Veilleurs sont venus jusqu'ici… Ils nous ont gardé de la lumière pour la dernière marche." },
      { c: 'flag', nom: 'veilleur_vu' },
    ], sinon: [{ c: 'dit', qui: 'Veilleur', portrait: 'veilleur', texte: 'Reposez-vous. Le roi attend depuis mille ans : il attendra bien encore un peu.' }] },
    { c: 'soin' },
    { c: 'son', id: 'soin' },
    { c: 'sauve' },
  ],
  senechal: [
    { c: 'dit', texte: "Au pied du grand escalier, une armure haute comme deux hommes barre le passage. Sa voix sonne creux." },
    { c: 'dit', qui: 'Le Sénéchal', portrait: 'roi', texte: "« Je suis le Sénéchal d'Aubefonde. J'ai servi le roi quand il riait encore. Je le servirai encore quand vous dormirez. »" },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Vous l'avez servi en le laissant s'enfermer. Laissez-nous passer." },
    { c: 'combat', groupe: ['garde_pale', 'senechal', 'garde_pale'] },
    { c: 'flag', nom: 'senechal_vaincu' },
    { c: 'dit', texte: "L'armure s'agenouille. « Si vous pouvez le réveiller… réveillez-le doucement. » La brume s'en échappe, et il ne reste qu'une armure vide." },
    { c: 'sauve' },
  ],
  // ---------- Salle du trône ----------
  roi_pale: [
    { c: 'dit', texte: "La salle du trône est immense. Derrière le trône se dresse le Fanal Premier, noir comme un puits. Sur le trône, un homme sans âge, couronné de givre, vous regarde approcher." },
    { c: 'dit', texte: "Dans la lanterne d'Aël, une toute petite voix murmure : « N'ayez pas peur. » Une chaleur douce enveloppe le groupe, comme une main qui serre la vôtre." },
    { c: 'soin' },
    { c: 'son', id: 'soin' },
    { c: 'dit', qui: ROI, portrait: 'roi', texte: "« Petit voilier. Quatre Fanaux rallumés, quatre gardiens réveillés, et te voilà au Fond. Tu dois être si fatigué. »" },
    { c: 'dit', qui: ROI, portrait: 'roi', texte: "« Reste. Ici, personne ne meurt. Personne ne part. N'as-tu jamais perdu quelqu'un, Aël ? »" },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Si. Mes parents. Il ne me reste d'eux qu'un voilier, et une grand-mère qui ne parle jamais d'eux." },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Mais on ne garde pas les gens en arrêtant le temps. On les garde en continuant d'avancer." },
    { c: 'dit', qui: ROI, portrait: 'roi', texte: "« Avancer… Vers quoi ? Vers le jour où il ne reste plus rien ? Non. Dors, petit voilier. Dormez tous. »" },
    { c: 'combat', groupe: ['garde_pale', 'roi_pale', 'garde_pale'] },
    { c: 'flag', nom: 'roi_phase1' },
    { c: 'dit', texte: "Le roi chancelle. Sa couronne de givre se fend… et toute la brume de la salle se rue vers lui, s'enroule et gonfle, jusqu'à former un cœur immense qui bat dans l'obscurité." },
    { c: 'dit', qui: ROI, portrait: 'roi', texte: "« Non… Je ne la laisserai pas partir. PAS ENCORE. »" },
    { c: 'dit', texte: "La lanterne d'Aël flamboie. Les quatre flammes, Clairval, les Récifs, l'Ambre et le Givre, enveloppent le groupe d'une chaleur qui chasse la fatigue." },
    { c: 'soin' },
    { c: 'son', id: 'soin' },
    { c: 'secousse' },
    { c: 'combat', groupe: ['coeur_brume'] },
    { c: 'flag', nom: 'roi_vaincu' },
    { c: 'flash', couleur: '#ffffff' },
    { c: 'dit', texte: "Le cœur de brume se déchire. Il ne reste qu'un vieil homme à genoux devant son trône, qui serre ses mains vides." },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Aël… les souvenirs. Montre-les-lui." },
    { c: 'dit', texte: "Aël pose devant le roi la couronne de fleurs, le portrait, et la boîte à musique. Le couvercle s'ouvre tout seul, et la berceuse emplit la salle." },
    { c: 'dit', texte: "Dans la lumière de la lanterne, une petite silhouette se dessine. Une fillette aux cheveux blancs, une couronne de fleurs sur la tête." },
    { c: 'dit', qui: L, portrait: 'lune', texte: "Papa." },
    { c: 'dit', qui: MO, portrait: 'morvane', texte: "… Lune ?" },
    { c: 'dit', qui: L, portrait: 'lune', texte: "Tu m'as tenue si fort que je n'ai jamais pu partir. Et toi non plus. Ça fait mille ans, papa. Tu es fatigué." },
    { c: 'dit', qui: MO, portrait: 'morvane', texte: "Si je rallume le Fanal… tu disparaîtras." },
    { c: 'dit', qui: L, portrait: 'lune', texte: "Non. Je serai dans la lumière, comme maman. C'est toi qui me l'as appris, tu te souviens ? Le soir, sur tes épaules, quand on regardait les Fanaux." },
    { c: 'dit', qui: MO, portrait: 'morvane', texte: "… Je me souviens." },
    { c: 'dit', qui: MO, portrait: 'morvane', texte: "Petit voilier. Approche ta lanterne du Fanal. Je ferai le reste. C'est mon travail, après tout. Ça l'a toujours été." },
    { c: 'flag', nom: 'roi_apaise' },
    { c: 'sauve' },
  ],
  trone: [{ c: 'si', cond: ['roi_apaise'], alors: [{ c: 'dit', texte: 'Le trône est vide. Une couronne de givre fondue y brille comme une flaque de lune.' }], sinon: [{ c: 'dit', texte: 'Le trône du Roi Pâle, froid comme la pierre d’une tombe.' }] }],
  morvane: [
    { c: 'si', cond: ['fanal5_allume'], alors: [{ c: 'dit', texte: "Il ne reste ici que de la lumière, et l'écho d'une berceuse." }], sinon: [
      { c: 'dit', qui: MO, portrait: 'morvane', texte: "Le Fanal, petit voilier. Elle attend. Et moi aussi, pour la première fois depuis mille ans." },
    ] },
  ],
  lune_esprit: [
    { c: 'si', cond: ['fanal5_allume'], alors: [{ c: 'dit', texte: 'Une petite lueur danse là où se tenait Lune.' }], sinon: [
      { c: 'dit', qui: L, portrait: 'lune', texte: "Merci d'avoir ramené mes affaires. Papa est têtu, hein ? Comme les grands-mères, je crois." },
    ] },
  ],
  fanal_premier: [
    { c: 'si', cond: ['fanal5_allume'], alors: [{ c: 'dit', texte: 'Le Fanal Premier brûle de toutes les couleurs à la fois. Sa lumière monte à travers la Brume, jusqu’au ciel.' }], sinon: [
      { c: 'si', cond: ['roi_apaise'], alors: [
        { c: 'dit', texte: "Aël lève la lanterne. Les quatre flammes, Clairval, les Récifs, l'Ambre et le Givre, quittent la lanterne et montent dans la vasque." },
        { c: 'dit', texte: "Morvane pose la main sur la pierre noire. Lune pose la sienne sur celle de son père." },
        { c: 'flash', couleur: '#fff6dc' },
        { c: 'son', id: 'fanal' },
        { c: 'secousse' },
        { c: 'retire', objet: 'couronne_fleurs' },
        { c: 'retire', objet: 'boite_musique' },
        { c: 'retire', objet: 'portrait_lune' },
        { c: 'flag', nom: 'fanal5_allume' },
        { c: 'donne', objet: 'eclat_premier', silencieux: true },
        { c: 'dit', texte: "Le Fanal Premier s'embrase. Une lumière blanche, puis dorée, puis de toutes les couleurs à la fois, qui traverse la Brume de part en part." },
        { c: 'quete', id: 'q_royaume', etat: 'terminee' },
        { c: 'appel', evenement: 'fin_acte5' },
      ], sinon: [{ c: 'dit', texte: 'Un Fanal de pierre noire, plus haut que tous les autres. Sa vasque est froide depuis mille ans.' }] },
    ] },
  ],
  fin_acte5: [
    { c: 'si', cond: ['acte5_fini'], alors: [
      { c: 'dit', qui: N, portrait: 'nour', texte: "Cinq Fanaux brillent sur Aérys. L'astrolabe ne montre plus aucune flamme éteinte." },
    ], sinon: [
      { c: 'dit', texte: "Là-haut, sur les quatre îles, les Fanaux répondent l'un après l'autre : Clairval, les Récifs, la Tour d'Ambre, les Cimes." },
      { c: 'dit', texte: "Autour du palais, Aubefonde s'éveille. Les dormeurs ouvrent les yeux, la cloche fendue sonne midi, et la Brume redescend lentement, comme une marée qui se retire." },
      { c: 'dit', qui: MO, portrait: 'morvane', texte: "Merci, Aël. Dis aux Veilleurs qu'ils peuvent dormir, maintenant. Ils l'ont bien mérité." },
      { c: 'dit', texte: "Le roi prend la main de sa fille. Ils deviennent lumière, et la lumière devient le Fanal." },
      { c: 'dit', qui: B, portrait: 'brann', texte: "Alors c'est fini ? Pour de vrai ? … Quelqu'un a faim ? Moi, j'ai faim." },
      { c: 'dit', qui: N, portrait: 'nour', texte: "Je rentrerai à Ambrelune raconter tout ça à mon oncle. Il ne me croira pas. Mon père, si." },
      { c: 'dit', qui: M, portrait: 'mira', texte: "Il me restait une seule tache blanche sur ma carte de l'archipel. Aubefonde. Je vais enfin pouvoir la dessiner." },
      { c: 'dit', qui: A, portrait: 'ael', texte: "Et moi, j'ai un Moineau à ramener à Clairval. Grand-mère voudra tout savoir. Et cette fois, c'est moi qui lui poserai des questions." },
      { c: 'titre', texte: 'Fin', sous: 'Les cinq Fanaux brillent sur Aérys' },
      { c: 'flag', nom: 'acte5_fini' },
      { c: 'sauve' },
      { c: 'fin', texte: "Merci d'avoir joué à Kevlegende ! Ta sauvegarde reste ouverte : le Léviathan de Brume, les Veilleurs endormis et le journal du roi t'attendent encore au Royaume Pâle." },
    ] },
  ],
};
