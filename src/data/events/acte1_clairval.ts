// Acte I, Clairval : le réveil, le village et ses habitants.
import type { Script } from '../../core/story/script';

const O = 'Odile';
const A = 'Aël';

export const ACTE1_CLAIRVAL: Record<string, Script> = {
  intro: [
    { c: 'titre', texte: 'Acte I', sous: 'Le Fanal qui vacille' },
    { c: 'dit', texte: "Au-dessus d'une mer de nuages sans fond flottent les îles de l'archipel d'Aérys." },
    { c: 'dit', texte: "Sur chacune veille un Fanal, une grande flamme qui les tient dans le ciel. Tant qu'ils brillent, rien ne tombe." },
    { c: 'dit', texte: 'Cette nuit-là, sur l’île de Clairval, le Fanal a vacillé.' },
    { c: 'dit', qui: O, portrait: 'odile', texte: 'Aël ! Debout, mon grand. Tu as senti la maison trembler cette nuit ?' },
    { c: 'dit', qui: A, portrait: 'ael', texte: "J'ai cru que c'était le vent… Grand-mère, tu es toute pâle." },
    { c: 'dit', qui: O, portrait: 'odile', texte: "Le Fanal de la colline faiblit. Et la Brume monte d'en bas, plus noire que je ne l'ai jamais vue." },
    { c: 'dit', qui: O, portrait: 'odile', texte: "Si la flamme s'éteint, Clairval sombrera dans les nuages. Avec nous dessus." },
    { c: 'dit', qui: O, portrait: 'odile', texte: "Il faut la raviver à sa source : le Cœur des Échos, au fond de la grotte, derrière le Col du Vent." },
    { c: 'dit', qui: O, portrait: 'odile', texte: 'Prends ma lanterne. Elle seule peut porter cette flamme-là.' },
    { c: 'donne', objet: 'lanterne' },
    { c: 'dit', qui: O, portrait: 'odile', texte: "La grotte est scellée. La Clé des Échos est confiée au maire Fendril. Va le trouver à la mairie, au nord du village." },
    { c: 'dit', qui: O, portrait: 'odile', texte: "Et reviens me voir quand tu es fatigué. Un bol de soupe a déjà sauvé plus d'un héros." },
    { c: 'quete', id: 'q_fanal', etat: 'active' },
    { c: 'flag', nom: 'intro_vue' },
    { c: 'sauve' },
  ],
  odile: [
    { c: 'si', cond: ['acte2'], alors: [{ c: 'dit', qui: O, portrait: 'odile', texte: 'Le Moineau t’attend au port. Je suis fière de toi, Aël.' }], sinon: [
      { c: 'si', cond: ['eclat_obtenu'], alors: [
        { c: 'dit', qui: O, portrait: 'odile', texte: "Cette lueur dans la lanterne… Tu l'as trouvée ! Vite, au Fanal, sur la colline à l'est." },
      ], sinon: [
        { c: 'si', cond: ['mira_rejoint'], alors: [
          { c: 'dit', qui: O, portrait: 'odile', texte: "Tu as ramené la petite cartographe ! Mira, c'est ça ? Prenez soin l'un de l'autre." },
          { c: 'dit', qui: 'Mira', portrait: 'mira', texte: "Il m'a sauvée de trois loups, madame. Enfin… de deux et demi, j'ai aidé." },
        ], sinon: [
          { c: 'dit', qui: O, portrait: 'odile', texte: 'Le maire Fendril est à la mairie, au nord du village. Sois poli, il est grognon le matin.' },
        ] },
      ] },
      { c: 'dit', qui: O, portrait: 'odile', texte: 'Assieds-toi une minute. Mange.' },
      { c: 'soin' },
      { c: 'son', id: 'soin' },
      { c: 'dit', texte: 'Le groupe a récupéré toutes ses forces.' },
    ] },
  ],
  maison_etagere: [
    { c: 'dit', texte: "« Les Fanaux d'Aérys », un vieux livre annoté de la main d'Odile." },
    { c: 'dit', texte: "« Six flammes, six îles. Quand la première s'éteint, la Brume s'engouffre et les autres faiblissent à leur tour. »" },
    { c: 'dit', texte: "Dans la marge : « Ne jamais laisser un Fanal seul. » Souligné trois fois." },
  ],
  clairval_premiere_sortie: [
    { c: 'flag', nom: 'vu_village' },
    { c: 'dit', texte: "L'air sent le pain chaud et le vent salé. Sous le bord de l'île, la mer de nuages s'étend à l'infini." },
    { c: 'dit', qui: A, portrait: 'ael', texte: 'La mairie, au nord… Allons voir Fendril.' },
  ],
  fendril: [
    { c: 'si', cond: ['cle_obtenue'], alors: [
      { c: 'dit', qui: 'Fendril', portrait: 'fendril', texte: 'La Clé des Échos est entre de bonnes mains. Le col est au nord, la grotte tout en haut.' },
    ], sinon: [
      { c: 'si', cond: ['mira_rejoint'], alors: [
        { c: 'dit', qui: 'Fendril', portrait: 'fendril', texte: 'Mademoiselle Mira ! Saine et sauve ! Clairval te doit une fière chandelle, petit.' },
        { c: 'dit', qui: 'Mira', portrait: 'mira', texte: "Je cartographie les îles qui dérivent. Et la vôtre descend d'un pouce par jour, monsieur le maire." },
        { c: 'dit', qui: 'Fendril', portrait: 'fendril', texte: "Un pouce par jour… Bon. Bon ! Tiens, Aël. Une promesse est une promesse." },
        { c: 'donne', objet: 'cle_grotte' },
        { c: 'flag', nom: 'cle_obtenue' },
        { c: 'flag', nom: 'grotte_ouverte' },
        { c: 'quete', id: 'q_mira', etat: 'terminee' },
        { c: 'dit', qui: 'Fendril', portrait: 'fendril', texte: 'Le Col du Vent est au nord du village. La grotte est tout en haut. Que les Fanaux vous gardent.' },
        { c: 'sauve' },
      ], sinon: [
        { c: 'si', cond: ['quete_mira'], alors: [
          { c: 'dit', qui: 'Fendril', portrait: 'fendril', texte: "Le Bois Murmurant est à l'ouest. Oswin t'a laissé passer. Ramène-moi cette cartographe !" },
        ], sinon: [
          { c: 'dit', qui: 'Fendril', portrait: 'fendril', texte: "Le petit d'Odile ? La Clé des Échos ? Ho, ho. On ne la confie pas au premier venu." },
          { c: 'dit', qui: A, portrait: 'ael', texte: 'Le Fanal s’éteint, monsieur le maire. Grand-mère dit que…' },
          { c: 'dit', qui: 'Fendril', portrait: 'fendril', texte: "Je sais ce que dit Odile. Écoute : une voyageuse, Mira, cartographe, est entrée hier dans le Bois Murmurant." },
          { c: 'dit', qui: 'Fendril', portrait: 'fendril', texte: "Elle n'est pas revenue. Les loups de brume rôdent depuis que le Fanal faiblit. Ramène-la, et la clé est à toi." },
          { c: 'flag', nom: 'quete_mira' },
          { c: 'quete', id: 'q_mira', etat: 'active' },
          { c: 'dit', qui: 'Fendril', portrait: 'fendril', texte: "Je préviens Oswin, à la sortie ouest, de te laisser passer. Passe chez Tilda t'équiper avant." },
        ] },
      ] },
    ] },
  ],
  oswin: [
    { c: 'dit', qui: 'Oswin', portrait: 'oswin', texte: 'Halte ! Le Bois Murmurant est infesté de loups depuis cette nuit. Ordre du maire : personne ne passe.' },
    { c: 'dit', qui: 'Oswin', portrait: 'oswin', texte: 'Si tu as une bonne raison, va la donner à Fendril, à la mairie.' },
  ],
  tilda: [
    { c: 'dit', qui: 'Tilda', portrait: 'tilda', texte: "Bienvenue à l'Échoppe ! Herbes, fioles, lames : tout ce qu'il faut pour ne pas tomber du ciel." },
    { c: 'boutique', id: 'clairval' },
  ],
  rosa: [
    { c: 'choix', texte: "Rosa : « Une nuit à l'Auberge du Nuage, 10 pièces. Draps propres, rêves inclus. »", options: [
      { texte: 'Se reposer (10 pièces)', faire: [
        { c: 'paye', n: 10,
          alors: [{ c: 'soin' }, { c: 'son', id: 'soin' }, { c: 'dit', texte: 'Le groupe a passé une excellente nuit.' }],
          sinon: [{ c: 'dit', qui: 'Rosa', portrait: 'rosa', texte: 'Pas assez de pièces, mon chou. Odile te fera bien une soupe.' }] },
      ] },
      { texte: 'Non merci', faire: [{ c: 'dit', qui: 'Rosa', portrait: 'rosa', texte: 'Repasse quand tu veux !' }] },
    ] },
  ],
  fenouil: [
    { c: 'si', cond: ['herbes_rendues'], alors: [
      { c: 'dit', qui: 'Fenouil', portrait: 'fenouil', texte: "Grâce à toi, mes onguents sentent de nouveau la lune. Prends soin de l'amulette." },
    ], sinon: [
      { c: 'si', cond: ['herbe1', 'herbe2', 'herbe3'], alors: [
        { c: 'dit', qui: 'Fenouil', portrait: 'fenouil', texte: "Trois Herbes-Lune ! Et bien fraîches. Tu as l'œil, petit." },
        { c: 'retire', objet: 'herbe_lune', n: 3 },
        { c: 'flag', nom: 'herbes_rendues' },
        { c: 'quete', id: 'q_herbes', etat: 'terminee' },
        { c: 'donne', objet: 'amulette_fanal' },
        { c: 'donne', objet: 'tonique', n: 2 },
      ], sinon: [
        { c: 'si', cond: ['quete_herbes'], alors: [
          { c: 'dit', qui: 'Fenouil', portrait: 'fenouil', texte: "Les Herbes-Lune poussent dans le Bois Murmurant. Elles brillent un peu : cherche une lueur argentée." },
        ], sinon: [
          { c: 'dit', qui: 'Fenouil', portrait: 'fenouil', texte: "Je suis Fenouil, le guérisseur. Avec la Brume, les gens toussent, et mes réserves d'Herbe-Lune sont vides." },
          { c: 'dit', qui: 'Fenouil', portrait: 'fenouil', texte: "Si tu vas dans le Bois Murmurant, rapporte-m'en trois. Je saurai te remercier." },
          { c: 'flag', nom: 'quete_herbes' },
          { c: 'quete', id: 'q_herbes', etat: 'active' },
        ] },
      ] },
    ] },
  ],
  bertille: [
    { c: 'si', cond: ['poules_rendues'], alors: [
      { c: 'dit', qui: 'Bertille', portrait: 'bertille', texte: 'Mes trois chéries pondent comme jamais. Elles ont vu du pays !' },
    ], sinon: [
      { c: 'si', cond: ['poule1', 'poule2', 'poule3'], alors: [
        { c: 'dit', qui: 'Bertille', portrait: 'bertille', texte: 'Pâquerette, Brindille et Madame Plume ! Toutes rentrées ! Oh, merci, merci !' },
        { c: 'flag', nom: 'poules_rendues' },
        { c: 'quete', id: 'q_poules', etat: 'terminee' },
        { c: 'or', n: 120 },
        { c: 'donne', objet: 'plume_aube' },
      ], sinon: [
        { c: 'si', cond: ['quete_poules'], alors: [
          { c: 'dit', qui: 'Bertille', portrait: 'bertille', texte: "Une au village, une dans le bois, une là-haut sur le col, j'en suis sûre. Elles adorent le vent." },
        ], sinon: [
          { c: 'dit', qui: 'Bertille', portrait: 'bertille', texte: "La secousse de cette nuit a effrayé mes poules. Elles se sont envolées. Trois ! Trois fugueuses !" },
          { c: 'dit', qui: 'Bertille', portrait: 'bertille', texte: 'Si tu les croises, ramène-les-moi. Enfin, attrape-les : elles connaissent le chemin du retour.' },
          { c: 'flag', nom: 'quete_poules' },
          { c: 'quete', id: 'q_poules', etat: 'active' },
        ] },
      ] },
    ] },
  ],
  poule1: [{ c: 'son', id: 'poule' }, { c: 'dit', texte: 'Cot ! Tu attrapes Pâquerette, qui file aussitôt vers le poulailler de Bertille.' }, { c: 'flag', nom: 'poule1' }],
  poule2: [{ c: 'son', id: 'poule' }, { c: 'dit', texte: 'Cot cot ! Brindille se laisse attraper, puis détale vers le village.' }, { c: 'flag', nom: 'poule2' }],
  poule3: [{ c: 'son', id: 'poule' }, { c: 'dit', texte: 'COT ! Madame Plume te toise, puis redescend le col d’un air digne.' }, { c: 'flag', nom: 'poule3' }],
  pim: [
    { c: 'si', cond: ['fanal1_allume'], alors: [{ c: 'dit', qui: 'Pim', portrait: 'pim', texte: "T'as vu le Fanal ?! Il brille comme un soleil ! Quand je serai grand, je serai voilier comme toi." }], sinon: [
      { c: 'dit', qui: 'Pim', portrait: 'pim', texte: "Psst ! Derrière ta maison, il y a un coffre que personne n'a jamais ouvert. Moi j'ose pas." },
    ] },
  ],
  gus: [
    { c: 'si', cond: ['pip_recompense'], alors: [{ c: 'dit', qui: 'Gus', portrait: 'gus', texte: "Pip est privé de grotte pour cent ans. Merci encore, Aël." }], sinon: [
      { c: 'si', cond: ['pip_sauve'], alors: [
        { c: 'dit', qui: 'Gus', portrait: 'gus', texte: "Pip est rentré ! Couvert de poussière de cristal et fier comme un coq. Tiens, c'est tout ce que j'ai de précieux." },
        { c: 'donne', objet: 'plume_aube' },
        { c: 'donne', objet: 'boucle_corsaire' },
        { c: 'flag', nom: 'pip_recompense' },
        { c: 'quete', id: 'q_pip', etat: 'terminee' },
      ], sinon: [
        { c: 'dit', qui: 'Gus', portrait: 'gus', texte: "Je pêche des poissons-nuages. Ils mordent mal, avec cette Brume." },
        { c: 'dit', qui: 'Gus', portrait: 'gus', texte: "Et mon fils Pip a disparu. Il parlait d'une fissure qui mène à la Grotte des Échos… Si tu y vas, cherche-le." },
        { c: 'flag', nom: 'quete_pip' },
        { c: 'quete', id: 'q_pip', etat: 'active' },
      ] },
    ] },
  ],
  chat: [{ c: 'son', id: 'chat' }, { c: 'dit', texte: 'Le chat te regarde, bâille, et se rendort sur les pavés tièdes.' }],
  clairval_puits: [{ c: 'dit', texte: "Tu te penches au-dessus du puits. Tout au fond, ce n'est pas de l'eau : c'est le ciel." }],
  panneau_bois: [{ c: 'dit', texte: '← Bois Murmurant. « Ne sifflez pas : les arbres répondent. »' }],
  panneau_colline: [{ c: 'dit', texte: '→ Colline du Fanal.' }],
};
