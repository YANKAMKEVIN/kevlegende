// Acte V : le Rivage Pâle, Aubefonde la ville endormie et les Jardins de Lune, où dorment les souvenirs de Lune.
import type { Script } from '../../core/story/script';

const A = 'Aël';
const M = 'Mira';
const B = 'Brann';
const N = 'Nour';

/** Un souvenir de Lune sur son socle, libre une fois son gardien vaincu. */
const souvenir = (n: number, gardien: string, objet: string, texte: string): Script => [
  { c: 'si', cond: [`souvenir${n}`], alors: [{ c: 'dit', texte: 'Le socle est vide. Il y flotte encore un parfum de fleurs.' }], sinon: [
    { c: 'si', cond: [gardien], alors: [
      { c: 'son', id: 'cristal' },
      { c: 'flash', couleur: '#e6dcff' },
      { c: 'donne', objet },
      { c: 'flag', nom: `souvenir${n}` },
      { c: 'dit', texte },
      { c: 'dit', texte: "Un éclat de rire d'enfant traverse la brume, tout près, puis s'éteint." },
      { c: 'si', cond: ['souvenir1', 'souvenir2', 'souvenir3'], alors: [
        { c: 'dit', qui: M, portrait: 'mira', texte: "Les trois souvenirs de Lune ! Au portail du palais, au nord du Rivage Pâle." },
        { c: 'quete', id: 'q_souvenirs', etat: 'terminee' },
      ], sinon: [{ c: 'dit', qui: N, portrait: 'nour', texte: 'Un souvenir de Lune. Il en reste à trouver.' }] },
      { c: 'sauve' },
    ], sinon: [{ c: 'dit', texte: 'Sur un socle de marbre, quelque chose luit sous la brume. Une présence veille tout près.' }] },
  ] },
];

/** Un Veilleur endormi dans Aubefonde : la lanterne le réveille une fois que Tristan l'a demandé. */
const dormeur = (n: number): Script => [
  { c: 'si', cond: [`eveil${n}`], alors: [{ c: 'dit', texte: 'Le Veilleur se frotte les yeux. « Allez-y, je vous rejoins… dans une minute. »' }], sinon: [
    { c: 'si', cond: ['quete_dormeurs'], alors: [
      { c: 'dit', texte: "Aël approche la lanterne. Les fils de brume se dénouent un à un, et le dormeur ouvre les yeux." },
      { c: 'dit', qui: 'Veilleur', portrait: 'villageois', texte: "Quelle heure est-il ? … Vingt ans ? Tristan va me tuer." },
      { c: 'flag', nom: `eveil${n}` },
      { c: 'si', cond: ['eveil1', 'eveil2', 'eveil3'], alors: [{ c: 'dit', qui: B, portrait: 'brann', texte: "C'était le dernier. Allons dire à Tristan que ses Veilleurs sont réveillés." }] },
    ], sinon: [{ c: 'dit', texte: "Un homme en cape de Veilleur dort assis contre un mur, enroulé de brume. Son souffle est si lent qu'on l'entend à peine." }] },
  ] },
];

export const ACTE5_AVENTURE: Record<string, Script> = {
  // ---------- Rivage Pâle ----------
  arrivee_rivage: [
    { c: 'si', cond: ['!rivage_vu'], alors: [
      { c: 'dit', texte: "Mille marches plus bas, la Brume s'ouvre comme un rideau. Dessous, il y a une terre : une herbe couleur de cendre, des arbres morts, un ciel violet sans soleil." },
      { c: 'dit', qui: N, portrait: 'nour', texte: "Le Fond… On l'a atteint. Personne n'est jamais revenu d'ici pour le raconter." },
      { c: 'dit', qui: B, portrait: 'brann', texte: "Eh bien on sera les premiers. J'ai une réputation à tenir." },
      { c: 'flag', nom: 'rivage_vu' },
    ] },
  ],
  panneau_rivage: [{ c: 'dit', texte: "Une borne royale, presque effacée : « ← Jardins de Lune. → Aubefonde. ↑ Palais. »" }],
  passeur: [
    { c: 'dit', texte: "Sur la mare de brume, une barque glisse sans rames. Debout à la proue, une silhouette voilée tient une lanterne éteinte." },
    { c: 'dit', qui: 'Le Passeur', portrait: 'roi', texte: "« Des vivants, ici. Le roi n'aime pas qu'on le réveille. Rebroussez chemin, et je vous ferai traverser vers un sommeil sans rêves. »" },
    { c: 'dit', qui: B, portrait: 'brann', texte: "Merci, on a déjà réservé ailleurs." },
    { c: 'combat', groupe: ['ombre_cendre', 'passeur'] },
    { c: 'flag', nom: 'passeur_vaincu' },
    { c: 'dit', texte: "La silhouette se dissout. Sa lanterne éteinte roule sur le ponton… et s'allume toute seule, d'une petite flamme pâle." },
    { c: 'sauve' },
  ],
  souvenir_couronne: souvenir(1, 'passeur_vaincu', 'couronne_fleurs', "Une couronne de fleurs de lune, minuscule, faite pour une tête d'enfant. Elle n'a pas fané en mille ans."),
  portail: [
    { c: 'si', cond: ['souvenir1', 'souvenir2', 'souvenir3'], alors: [
      { c: 'dit', texte: "Aël présente les trois souvenirs. Le premier sceau s'allume devant la couronne, le deuxième devant la boîte à musique, le troisième devant le portrait." },
      { c: 'son', id: 'fanal' },
      { c: 'flash', couleur: '#e6dcff' },
      { c: 'secousse' },
      { c: 'dit', texte: "Les battants de brume figée se fendent en silence et s'effilochent comme un rêve au réveil. Le palais du Roi Pâle est ouvert." },
      { c: 'dit', qui: A, portrait: 'ael', texte: "On y va. Ensemble, jusqu'au bout." },
      { c: 'flag', nom: 'portail_ouvert' },
      { c: 'sauve' },
    ], sinon: [
      { c: 'dit', texte: "Un portail de brume figée, frappé de trois sceaux. Une inscription court sur l'arche : « Trois souvenirs pour trois chagrins. »" },
      { c: 'si', cond: ['selene_vue'], alors: [{ c: 'dit', qui: M, portrait: 'mira', texte: "La couronne, la boîte à musique et le portrait de Lune. Il nous les faut tous les trois." }] },
    ] },
  ],
  barque_ambroise: [
    { c: 'si', cond: ['leviathan_vaincu'], alors: [{ c: 'dit', texte: "La vieille barque d'Ambroise. La mare est calme, à présent." }], sinon: [
      { c: 'si', cond: ['quete_leviathan'], alors: [
        { c: 'choix', texte: "La barque d'Ambroise est échouée au bord de la grande mare. Frapper trois coups sur la coque ?", options: [
          { texte: 'Frapper trois coups', faire: [
            { c: 'secousse' },
            { c: 'dit', texte: "Un, deux, trois. La mare se creuse, bouillonne… et un serpent de brume large comme une rue jaillit vers le ciel violet." },
            { c: 'combat', groupe: ['leviathan'] },
            { c: 'flag', nom: 'leviathan_vaincu' },
            { c: 'dit', qui: M, portrait: 'mira', texte: "Il replonge… et ne remonte pas. Allons l'annoncer à Ambroise." },
            { c: 'sauve' },
          ] },
          { texte: 'Pas encore', faire: [] },
        ] },
      ], sinon: [{ c: 'dit', texte: "Une vieille barque de pêcheur, éventrée. Quelque chose d'énorme l'a mordue." }] },
    ] },
  ],
  // ---------- Aubefonde ----------
  panneau_aubefonde: [{ c: 'dit', texte: "« Aubefonde, cité du Fanal Premier. Que la lumière vous garde. » Quelqu'un a gratté « garde » et écrit « endorme »." }],
  dormeur_aubefonde: [{ c: 'dit', texte: "Un habitant d'Aubefonde dort debout, un panier au bras, comme s'il s'était arrêté au milieu d'une phrase il y a mille ans." }],
  dormeur1: dormeur(1),
  dormeur2: dormeur(2),
  dormeur3: dormeur(3),
  tristan: [
    { c: 'dit', qui: 'Tristan', portrait: 'tristan', texte: "Tristan, Veilleur. Asseyez-vous près du feu : ici, il ne s'éteint jamais." },
    { c: 'soin' },
    { c: 'son', id: 'soin' },
    { c: 'si', cond: ['!quete_dormeurs'], alors: [
      { c: 'dit', qui: 'Tristan', portrait: 'tristan', texte: "Trois de mes Veilleurs se sont endormis dans la ville, il y a vingt ans. Leurs lanternes se sont éteintes. La vôtre pourrait les réveiller." },
      { c: 'flag', nom: 'quete_dormeurs' },
      { c: 'quete', id: 'q_dormeurs', etat: 'active' },
    ] },
    { c: 'si', cond: ['eveil1', 'eveil2', 'eveil3', '!dormeurs_rendus'], alors: [
      { c: 'dit', qui: 'Tristan', portrait: 'tristan', texte: "Ils sont tous revenus, en bâillant et en se plaignant du froid. Merci. Prenez ma clochette : elle sonne le réveil, pas le sommeil." },
      { c: 'donne', objet: 'clochette_eveil' },
      { c: 'or', n: 3000 },
      { c: 'flag', nom: 'dormeurs_rendus' },
      { c: 'quete', id: 'q_dormeurs', etat: 'terminee' },
    ] },
    { c: 'boutique', id: 'camp_veilleur' },
  ],
  cloche: [
    { c: 'dit', texte: "Au fond de la place, une cloche énorme pend dans son beffroi. Elle se met à sonner toute seule, un son si doux que vos paupières s'alourdissent." },
    { c: 'dit', qui: N, portrait: 'nour', texte: "C'est elle qui endort la ville ! Brann, frappe plus fort qu'elle ne sonne !" },
    { c: 'combat', groupe: ['dormeur_errant', 'cloche_sommeil', 'dormeur_errant'] },
    { c: 'flag', nom: 'cloche_vaincue' },
    { c: 'dit', texte: "La cloche se fend d'un coup sec. Dans tout Aubefonde, les dormeurs remuent dans leur sommeil, sans se réveiller encore." },
    { c: 'sauve' },
  ],
  beffroi: [{ c: 'si', cond: ['cloche_vaincue'], alors: [{ c: 'dit', texte: 'La cloche fendue luit doucement. Elle ne sonnera plus le sommeil.' }], sinon: [{ c: 'dit', texte: 'La cloche bourdonne sans fin, un son à peine audible qui donne envie de dormir.' }] }],
  souvenir_boite: souvenir(2, 'cloche_vaincue', 'boite_musique', "Une boîte à musique en nacre. Quand Mira la soulève, le couvercle s'entrouvre : trois notes d'une berceuse, et la brume recule d'un pas."),
  // ---------- Jardins de Lune ----------
  panneau_jardins: [{ c: 'dit', texte: "« Jardins de la princesse. Ne cueillez pas les fleurs : elles sont à Lune. »" }],
  ronce_mere: [
    { c: 'dit', texte: "Des ronces noires enserrent l'arbre de lune. Elles se tendent vers vous comme des doigts… et le sol se soulève." },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Elles étouffent l'arbre ! Brann, tes braises ; Nour, ton soleil !" },
    { c: 'combat', groupe: ['serpent_brume', 'ronce_mere'] },
    { c: 'flag', nom: 'ronce_vaincue' },
    { c: 'dit', texte: "Les ronces se racornissent et tombent en poussière grise. L'arbre de lune frémit, et ses feuilles se rallument une à une." },
    { c: 'sauve' },
  ],
  arbre_lune: [
    { c: 'si', cond: ['souvenir3'], alors: [{ c: 'dit', texte: "L'arbre de lune bruisse doucement. On dirait qu'il chantonne." }], sinon: [
      { c: 'si', cond: ['ronce_vaincue'], alors: [
        { c: 'son', id: 'cristal' },
        { c: 'flash', couleur: '#e6dcff' },
        { c: 'donne', objet: 'portrait_lune' },
        { c: 'flag', nom: 'souvenir3' },
        { c: 'dit', texte: "Dans un creux de l'écorce d'argent, un petit cadre ovale : une fillette rit, juchée sur les épaules d'un homme couronné. Il rit aussi. Il n'a rien de pâle." },
        { c: 'dit', qui: N, portrait: 'nour', texte: "C'est lui… avant." },
        { c: 'si', cond: ['souvenir1', 'souvenir2'], alors: [
          { c: 'dit', qui: M, portrait: 'mira', texte: "Les trois souvenirs de Lune ! Au portail du palais, au nord du Rivage Pâle." },
          { c: 'quete', id: 'q_souvenirs', etat: 'terminee' },
        ], sinon: [{ c: 'dit', qui: B, portrait: 'brann', texte: 'Un souvenir de plus. Il en reste à trouver.' }] },
        { c: 'sauve' },
      ], sinon: [{ c: 'dit', texte: "Un arbre d'argent, étouffé de ronces noires. Quelque chose brille dans un creux de l'écorce." }] },
    ] },
  ],
  statue_lune: [{ c: 'dit', texte: "Une statue de fillette, les bras ouverts, comme pour attraper la pluie. Le socle dit seulement : « Lune »." }],
};
