// Acte III : les Dunes Chantantes, les Ruines de Sablon, le Tombeau du Soleil, le Canyon et la Tour d'Ambre.
import type { Cmd, Script } from '../../core/story/script';

const A = 'Aël';
const M = 'Mira';
const B = 'Brann';
const N = 'Nour';
const Z = 'Azrou';

/** Un puits des dunes : dégagé seulement quand Tafat l'a demandé. */
const puits = (n: number): Script => [
  { c: 'si', cond: [`puits${n}`], alors: [{ c: 'dit', texte: "L'eau murmure au fond du puits." }], sinon: [
    { c: 'si', cond: ['quete_puits'], alors: [
      { c: 'dit', texte: 'Le groupe dégage la margelle à mains nues. Brann fait sauter le bouchon de sable d’un coup de marteau.' },
      { c: 'son', id: 'forge' },
      { c: 'flag', nom: `puits${n}` },
      { c: 'si', cond: ['puits1', 'puits2', 'puits3'], alors: [{ c: 'dit', qui: M, portrait: 'mira', texte: 'Le dernier puits ! Retournons voir Tafat au caravansérail.' }], sinon: [{ c: 'dit', texte: "Un filet d'eau fraîche jaillit du fond." }] },
    ], sinon: [{ c: 'dit', texte: 'Un vieux puits, bouché par le sable.' }] },
  ] },
];

/** Un miroir de bronze des ruines : Nour sait l'orienter. */
const miroir = (n: number): Script => {
  const tous: Cmd[] = [
    { c: 'flag', nom: 'temple_ouvert' },
    { c: 'secousse' },
    { c: 'flash', couleur: '#fff3c4' },
    { c: 'dit', texte: "Les trois rayons se croisent sur la porte du temple. Le bronze rougit, puis la grille s'enfonce dans le sol en grondant." },
    { c: 'dit', qui: N, portrait: 'nour', texte: "Le Tombeau du Soleil est ouvert. L'Astrolabe nous attend tout au fond." },
    { c: 'sauve' },
  ];
  return [
    { c: 'si', cond: [`miroir${n}`], alors: [{ c: 'dit', texte: 'Le miroir renvoie un rayon aveuglant vers la porte du temple.' }], sinon: [
      { c: 'si', cond: ['nour_rejointe'], alors: [
        { c: 'dit', qui: N, portrait: 'nour', texte: 'Deux crans vers le levant… et un vers le haut. Voilà.' },
        { c: 'son', id: 'cristal' },
        { c: 'flag', nom: `miroir${n}` },
        { c: 'si', cond: ['miroir1', 'miroir2', 'miroir3'], alors: tous, sinon: [{ c: 'dit', texte: 'Le miroir capte le soleil et projette un trait de lumière vers le temple.' }] },
      ], sinon: [{ c: 'dit', texte: 'Un grand miroir de bronze, terni, tourné vers le sable. Impossible de deviner comment l’orienter.' }] },
    ] },
  ];
};

const levier = (n: number): Script => [
  { c: 'si', cond: [`levier_t${n}`], alors: [{ c: 'dit', texte: 'Le levier est déjà abaissé.' }], sinon: [
    { c: 'son', id: 'levier' },
    { c: 'flag', nom: `levier_t${n}` },
    { c: 'si', cond: ['levier_t1', 'levier_t2'], alors: [
      { c: 'flag', nom: 'grille_tombeau' },
      { c: 'secousse' },
      { c: 'dit', texte: 'Un grondement traverse le tombeau. Au nord, la grille de la Chambre du Soleil se lève.' },
    ], sinon: [{ c: 'dit', texte: "Clac ! Quelque part, un mécanisme se met en place. Il en manque un autre." }] },
  ] },
];

export const ACTE3_AVENTURE: Record<string, Script> = {
  // ---------- Dunes ----------
  puits1: puits(1),
  puits2: puits(2),
  puits3: puits(3),
  panneau_dunes: [{ c: 'dit', texte: '« ← Ruines de Sablon (nord-ouest). → Tour d’Ambre, par le Canyon (est). ↓ Ambrelune. »' }],
  omar: [
    { c: 'si', cond: ['omar_aide'], alors: [{ c: 'dit', qui: 'Omar', portrait: 'omar', texte: "Mes chameaux finiront bien par revenir. Ils reviennent toujours quand ils ont soif." }], sinon: [
      { c: 'dit', qui: 'Omar', portrait: 'omar', texte: "Ma caravane s'est dispersée quand la tempête est arrivée. Je n'ai plus que mes dattes et ma patience." },
      { c: 'dit', qui: 'Omar', portrait: 'omar', texte: "Tenez, prenez-en. Un voyageur affamé, c'est un voyageur qui se perd." },
      { c: 'donne', objet: 'datte_miel', n: 2 },
      { c: 'flag', nom: 'omar_aide' },
    ] },
  ],
  tempete_bloque: [
    { c: 'dit', texte: 'Un mur de sable pâle hurle et tourbillonne. On ne voit pas à deux pas, et la brume glace les os malgré la chaleur.' },
    { c: 'si', cond: ['nour_rejointe'], alors: [{ c: 'dit', qui: N, portrait: 'nour', texte: "Sans l'Astrolabe, on tournera en rond jusqu'à la nuit. Il est au fond du Tombeau du Soleil." }], sinon: [{ c: 'dit', qui: M, portrait: 'mira', texte: "Impossible de passer comme ça. Amastan parlait d'un astrolabe…" }] },
  ],
  kahina_fosse: [{ c: 'dit', qui: 'Kahina', portrait: 'kahina', texte: "C'est ici. Touchez les ossements quand vous serez prêts, et je sonnerai la corne. Après, plus de retour en arrière." }],
  ver_ancien: [
    { c: 'si', cond: ['ver_vaincu'], alors: [{ c: 'dit', texte: 'Les os du Ver Ancien blanchissent au soleil. Le sable ne chante plus ici.' }], sinon: [
      { c: 'si', cond: ['quete_ver'], alors: [
        { c: 'choix', texte: 'Le sol vibre sous les ossements. Réveiller le Ver Ancien ?', options: [
          { texte: 'Sonner la corne', faire: [
            { c: 'secousse' },
            { c: 'dit', qui: 'Kahina', portrait: 'kahina', texte: 'Le voilà ! Visez la gueule, et ne restez pas sur le sable mou !' },
            { c: 'combat', groupe: ['ver_ancien'] },
            { c: 'flag', nom: 'ver_vaincu' },
            { c: 'quete', id: 'q_ver', etat: 'terminee' },
            { c: 'or', n: 800 },
            { c: 'dit', qui: 'Kahina', portrait: 'kahina', texte: "Trois générations de chasseurs l'ont traqué. Et c'est une bande de voyageurs du ciel qui l'abat ! Gardez son écaille, vous l'avez méritée." },
            { c: 'sauve' },
          ] },
          { texte: 'Pas encore', faire: [] },
        ] },
      ], sinon: [{ c: 'dit', texte: "D'immenses ossements à moitié enterrés. Sous le sable, quelque chose respire lentement." }] },
    ] },
  ],
  // ---------- Ruines ----------
  panneau_ruines: [{ c: 'dit', texte: '« Observatoire de Sablon. Que celui qui entre lève les yeux. » Le reste est effacé par le vent.' }],
  nour_attente: [{ c: 'dit', qui: N, portrait: 'nour', texte: 'Attention, derrière vous !' }],
  nour_rencontre: [
    { c: 'dit', texte: 'Au centre de la grande place, une jeune femme en robe étoilée tient tête à une nuée de scorpions, un bâton levé vers le soleil.' },
    { c: 'dit', qui: N, portrait: 'nour', texte: "Encore vous ?! Allez-vous-en, sales bêtes ! Je n'ai plus d'éclats de soleil à vous donner !" },
    { c: 'secousse' },
    { c: 'dit', texte: "Le sable se soulève. Un scorpion gigantesque, la carapace couverte de brume, surgit des dalles." },
    { c: 'dit', qui: A, portrait: 'ael', texte: 'Tenez bon, on arrive !' },
    { c: 'combat', groupe: ['scorpion_ambre', 'scorpion_roi', 'scorpion_ambre'] },
    { c: 'dit', qui: N, portrait: 'nour', texte: "… Vous êtes qui, au juste ? Des pilleurs de ruines ?" },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Des amis de ton oncle. Il se fait un sang d'encre, Nour." },
    { c: 'dit', qui: N, portrait: 'nour', texte: "Mon oncle… Bien sûr. Je suis désolée. J'étais à deux doigts d'ouvrir le temple quand ces monstres sont sortis du sable." },
    { c: 'dit', qui: N, portrait: 'nour', texte: "Trois miroirs de bronze entourent la place. Tournés vers le soleil, ils ouvrent la porte du Tombeau. Je sais les régler." },
    { c: 'dit', qui: B, portrait: 'brann', texte: "Et nous, on sait taper sur les scorpions. On fait équipe ?" },
    { c: 'dit', qui: N, portrait: 'nour', texte: "Mon père gardait le Fanal des Sables. S'il y a une chance de le rallumer… oui. Je viens." },
    { c: 'rejoint', hero: 'nour', niveau: 19 },
    { c: 'flag', nom: 'nour_rejointe' },
    { c: 'quete', id: 'q_nour', etat: 'terminee' },
    { c: 'sauve' },
  ],
  miroir1: miroir(1),
  miroir2: miroir(2),
  miroir3: miroir(3),
  porte_temple: [{ c: 'dit', texte: "Une grille de bronze massive, gravée d'un soleil. Trois rainures convergent vers son centre, comme des rayons." }],
  // ---------- Tombeau ----------
  levier_tombeau1: levier(1),
  levier_tombeau2: levier(2),
  grille_tombeau: [{ c: 'dit', texte: 'Une grille scellée. Deux chaînes partent dans les ailes, à l’ouest et à l’est.' }],
  sarcophage: [{ c: 'dit', texte: "Un sarcophage doré. L'inscription dit : « Ici repose un veilleur. Il a gardé la flamme toute sa vie. »" }],
  colosse: [
    { c: 'secousse' },
    { c: 'dit', texte: "Au fond de la Chambre du Soleil, une statue de trois mètres tourne la tête. De la brume suinte entre ses plaques d'ambre." },
    { c: 'dit', qui: N, portrait: 'nour', texte: "Le Colosse d'Ambre, le gardien du temple ! Il ne devrait pas bouger… La brume l'a réveillé." },
    { c: 'dit', qui: B, portrait: 'brann', texte: "De l'ambre et de la pierre. L'eau et le vent le feront craquer. Mira, tes flèches de givre !" },
    { c: 'combat', groupe: ['colosse_ambre'] },
    { c: 'flag', nom: 'colosse_vaincu' },
    { c: 'dit', texte: "Le Colosse s'agenouille dans un nuage de poussière dorée, et la brume s'échappe de lui comme un soupir." },
    { c: 'sauve' },
  ],
  autel_soleil: [
    { c: 'si', cond: ['astrolabe_obtenu'], alors: [{ c: 'dit', texte: "L'autel est vide. Un rond de lumière marque la place de l'Astrolabe." }], sinon: [
      { c: 'son', id: 'cristal' },
      { c: 'flash', couleur: '#ffe7a0' },
      { c: 'donne', objet: 'astrolabe' },
      { c: 'flag', nom: 'astrolabe_obtenu' },
      { c: 'dit', qui: N, portrait: 'nour', texte: "L'Astrolabe du Soleil… Regardez, l'aiguille tourne seule vers l'est. Vers l'œil de la tempête." },
      { c: 'dit', qui: A, portrait: 'ael', texte: "Alors la Tempête Pâle ne nous arrêtera plus. Direction le Canyon des Mirages." },
      { c: 'sauve' },
    ] },
  ],
  // ---------- Canyon ----------
  panneau_canyon: [{ c: 'dit', texte: '« Camp des chasseurs : est. Tour d’Ambre : nord-est. Méfiez-vous de ce que vous voyez. »' }],
  feu_camp: [{ c: 'dit', texte: 'Un feu de camp crépite. Une théière noircie chauffe sur les braises.' }],
  kahina: [
    { c: 'dit', qui: 'Kahina', portrait: 'kahina', texte: "Kahina, chasseuse de vers. Asseyez-vous près du feu, la nuit tombe vite dans le canyon." },
    { c: 'soin' },
    { c: 'son', id: 'soin' },
    { c: 'si', cond: ['!quete_ver'], alors: [
      { c: 'dit', qui: 'Kahina', portrait: 'kahina', texte: "Vous avez vu les grands ossements, dans les dunes ? Ce n'est pas un cadavre. C'est son ancienne mue." },
      { c: 'dit', qui: 'Kahina', portrait: 'kahina', texte: "Le Ver Ancien dort dessous. Trois générations de ma famille ont essayé de l'abattre. Si vous vous en sentez la force, je vous attendrai là-bas." },
      { c: 'flag', nom: 'quete_ver' },
      { c: 'quete', id: 'q_ver', etat: 'active' },
    ] },
    { c: 'boutique', id: 'canyon' },
  ],
  silhouette: [
    { c: 'dit', texte: "Une silhouette dorée, presque transparente, vous fixe sans bouger. Quand vous approchez, elle parle d'une voix lointaine." },
    { c: 'dit', qui: '???', portrait: 'azrou', texte: '« Nour… ne monte pas à la tour… il me tient… il m’a promis… »' },
    { c: 'si', cond: ['nour_rejointe'], alors: [{ c: 'dit', qui: N, portrait: 'nour', texte: 'Cette voix… Papa ?!' }] },
    { c: 'dit', texte: 'La silhouette se dissout dans le vent chaud.' },
    { c: 'flag', nom: 'silhouette_vue' },
  ],
  // ---------- Tour d'Ambre ----------
  mirage: [
    { c: 'secousse' },
    { c: 'dit', texte: "L'air se met à trembler comme au-dessus d'un brasier. Devant la tour, la chaleur prend la forme d'un géant de sable et de brume, couronné d'or." },
    { c: 'dit', qui: 'Le Mirage', portrait: 'azrou', texte: "« Partez. Le Roi Pâle m'a promis que la flamme ne me brûlerait plus jamais. Il m'a promis le repos. »" },
    { c: 'dit', qui: N, portrait: 'nour', texte: "Cette voix… Papa ! C'est toi, là-dedans ! Azrou, gardien de la Tour !" },
    { c: 'dit', qui: 'Le Mirage', portrait: 'azrou', texte: "« Azrou est fatigué. Il n'y a plus que le Mirage. »" },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Creux aussi croyait à ses promesses. On va te sortir de là." },
    { c: 'combat', groupe: ['djinn_brume', 'mirage', 'djinn_brume'] },
    { c: 'flag', nom: 'mirage_vaincu' },
    { c: 'flash', couleur: '#fff3c4' },
    { c: 'dit', texte: 'Le géant se déchire comme un voile. Au milieu du sable qui retombe, un homme est agenouillé, épuisé, mais bien vivant.' },
    { c: 'dit', qui: N, portrait: 'nour', texte: 'Papa !' },
    { c: 'sauve' },
  ],
  azrou: [
    { c: 'si', cond: ['fanal3_allume'], alors: [{ c: 'dit', qui: Z, portrait: 'azrou', texte: "Je garderai la flamme, cette fois. Et je ne croirai plus aucun roi qui pleure." }], sinon: [
      { c: 'dit', qui: Z, portrait: 'azrou', texte: "Ma fille… Pardonne-moi. Une voix triste me parlait chaque nuit. Elle disait que la flamme me dévorait, qu'elle pouvait m'en délivrer." },
      { c: 'dit', qui: Z, portrait: 'azrou', texte: "J'ai cédé. Et la brume est entrée. Vite, ravivez le Fanal avant qu'elle ne revienne." },
    ] },
  ],
  fanal_ambre: [
    { c: 'si', cond: ['fanal3_allume'], alors: [{ c: 'dit', texte: 'Le Fanal des Sables brille comme un second soleil couchant.' }], sinon: [
      { c: 'si', cond: ['mirage_vaincu'], alors: [
        { c: 'dit', qui: N, portrait: 'nour', texte: "Aël, ta lanterne. Papa, tiens l'Astrolabe face au couchant. Je m'occupe du reste." },
        { c: 'flash', couleur: '#ffd27a' },
        { c: 'son', id: 'fanal' },
        { c: 'flag', nom: 'fanal3_allume' },
        { c: 'donne', objet: 'eclat_ambre', silencieux: true },
        { c: 'secousse' },
        { c: 'dit', texte: "La flamme de Clairval, la lumière du soleil et le sel des récifs se mêlent au sommet de la tour. Le Fanal des Sables s'embrase, et la Tempête Pâle se défait en poussière d'or." },
        { c: 'quete', id: 'q_ambre', etat: 'terminee' },
        { c: 'appel', evenement: 'fin_acte3' },
      ], sinon: [{ c: 'dit', texte: 'La flamme est morte. Une brume dorée tourbillonne autour du Fanal.' }] },
    ] },
  ],
  fin_acte3: [
    { c: 'si', cond: ['acte3_fini'], alors: [
      { c: 'dit', qui: N, portrait: 'nour', texte: "Le quatrième Fanal brûlait sur les Cimes de Givre, au nord. Les tablettes d'Ilyes en parlent. Nous irons dès que le Moineau sera prêt." },
    ], sinon: [
      { c: 'dit', qui: '???', portrait: 'roi', texte: "« Trois… Tu me prends tout, petit voilier. Mes promesses, mes serviteurs, mes jolies brumes. »" },
      { c: 'dit', qui: '???', portrait: 'roi', texte: "« Mais le froid ne craint pas ta lanterne. Viens donc la porter jusqu'aux Cimes de Givre. »" },
      { c: 'dit', qui: Z, portrait: 'azrou', texte: "Les Cimes… Le Fanal du nord. Il était déjà faible quand j'étais enfant." },
      { c: 'dit', qui: N, portrait: 'nour', texte: "Papa, garde la Tour. Moi, je pars avec eux. Le ciel a besoin d'une astromancienne." },
      { c: 'dit', qui: Z, portrait: 'azrou', texte: '… Tu as les yeux de ta mère. Va. Et reviens me raconter les étoiles du nord.' },
      { c: 'titre', texte: "Fin de l'Acte III", sous: 'Trois Fanaux brillent sur Aérys' },
      { c: 'flag', nom: 'acte3_fini' },
      { c: 'sauve' },
      { c: 'fin', texte: "L'Acte IV, « Les Cimes de Givre », arrive bientôt. Ta sauvegarde t'attendra : termine les quêtes des Sables d'Ambre, affronte le Ver Ancien et renforce ton équipe." },
    ] },
  ],
};
