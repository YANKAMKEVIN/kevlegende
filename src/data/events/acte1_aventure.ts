// Acte I : le Bois Murmurant, le Col du Vent, la Grotte des Échos et la Colline du Fanal.
import type { Script } from '../../core/story/script';

const A = 'Aël';
const M = 'Mira';

export const ACTE1_AVENTURE: Record<string, Script> = {
  // ---------- Bois Murmurant ----------
  panneau_bois_interieur: [{ c: 'dit', texte: '« Clairière des Cartes : nord-ouest, puis nord-est. Si les arbres chuchotent, ne leur répondez pas. »' }],
  herbe1: [{ c: 'son', id: 'cristal' }, { c: 'donne', objet: 'herbe_lune' }, { c: 'flag', nom: 'herbe1' }],
  herbe2: [{ c: 'son', id: 'cristal' }, { c: 'donne', objet: 'herbe_lune' }, { c: 'flag', nom: 'herbe2' }],
  herbe3: [{ c: 'son', id: 'cristal' }, { c: 'donne', objet: 'herbe_lune' }, { c: 'flag', nom: 'herbe3' }],
  loups: [{ c: 'dit', texte: 'Le loup gronde, les crocs luisants de brume.' }],
  mira_bois: [{ c: 'dit', qui: M, portrait: 'mira', texte: 'Ne reste pas planté là !' }],
  mira_sauvetage: [
    { c: 'secousse' },
    { c: 'dit', texte: 'Des grognements. Au fond de la clairière, une jeune femme est acculée contre un rocher, son arc bandé.' },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Toi ! Oui, toi, avec l'épée en bois ! Tu tombes à pic : il m'en reste deux à tenir en respect, et une seule flèche." },
    { c: 'dit', qui: A, portrait: 'ael', texte: 'Je suis Aël, de Clairval. Le maire m’envoie te chercher !' },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Mira, cartographe. Enchantée, on fera les politesses après. Attention, le grand gris, c'est le chef !" },
    { c: 'rejoint', hero: 'mira', niveau: 3 },
    { c: 'dit', texte: "Astuce : chaque ennemi a des faiblesses. Les frapper avec le bon élément use son bouclier. À zéro, il est Brisé : il perd son tour et encaisse davantage." },
    { c: 'combat', groupe: ['loup_brume', 'grand_loup'] },
    { c: 'flag', nom: 'mira_sauvee' },
    { c: 'flag', nom: 'mira_rejoint' },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Ouf… Merci. Ces loups ne sont pas normaux : ils sont faits de brume. Ils viennent d'en bas." },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Je cartographie l'archipel. Depuis un mois, toutes les îles dérivent et descendent. Les Fanaux faiblissent partout." },
    { c: 'dit', qui: A, portrait: 'ael', texte: 'Je vais raviver celui de Clairval. Il me faut la clé du maire.' },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Alors je viens avec toi. Tu m'as sauvé la vie, et je veux comprendre ce qui se passe. Tiens, c'est ma carte." },
    { c: 'donne', objet: 'carte_mira' },
    { c: 'dit', qui: M, portrait: 'mira', texte: 'Retournons voir ton maire. À l’est, en suivant le chemin.' },
    { c: 'sauve' },
  ],
  // ---------- Col du Vent ----------
  panneau_col: [{ c: 'dit', texte: '« Col du Vent. Tenez vos chapeaux. » Quelqu’un a ajouté : « et vos poules ».' }],
  tobias: [
    { c: 'dit', qui: 'Tobias', portrait: 'tobias', texte: "Des visiteurs ! Je suis Tobias, je garde cette porte depuis quarante ans. Enfin, je garde surtout ma tente." },
    { c: 'si', cond: ['!tobias_conseil'], alors: [
      { c: 'dit', qui: 'Tobias', portrait: 'tobias', texte: "Dans la grotte, une grille ferme le passage. Deux leviers la commandent, un à l'ouest, un à l'est. Les échos t'aideront." },
      { c: 'flag', nom: 'tobias_conseil' },
    ] },
    { c: 'dit', qui: 'Tobias', portrait: 'tobias', texte: 'Asseyez-vous près du feu, reprenez des forces.' },
    { c: 'soin' },
    { c: 'son', id: 'soin' },
    { c: 'dit', texte: 'Le groupe a récupéré toutes ses forces.' },
  ],
  grotte_fermee: [
    { c: 'dit', texte: 'Une porte de pierre gravée de spirales. Elle ne bouge pas d’un cheveu.' },
    { c: 'dit', qui: A, portrait: 'ael', texte: 'Il me faut la Clé des Échos du maire Fendril.' },
  ],
  // ---------- Grotte des Échos ----------
  gravure_echos: [
    { c: 'dit', texte: '« Ici dort le premier feu. Qui le porte doit le porter haut, car la Brume a faim de flamme. »' },
    { c: 'dit', qui: M, portrait: 'mira', texte: 'La Brume a faim… Charmant. Je note.' },
  ],
  grille: [{ c: 'dit', texte: 'Une lourde grille de fer rouillé. Deux chaînes s’enfoncent dans la roche, vers l’ouest et vers l’est.' }],
  levier1: [
    { c: 'si', cond: ['levier1'], alors: [{ c: 'dit', texte: 'Le levier est déjà abaissé.' }], sinon: [
      { c: 'son', id: 'levier' },
      { c: 'flag', nom: 'levier1' },
      { c: 'dit', texte: 'Clac ! Une chaîne se tend quelque part dans la roche.' },
      { c: 'appel', evenement: 'grille_test' },
    ] },
  ],
  levier2: [
    { c: 'si', cond: ['levier2'], alors: [{ c: 'dit', texte: 'Le levier est déjà abaissé.' }], sinon: [
      { c: 'son', id: 'levier' },
      { c: 'flag', nom: 'levier2' },
      { c: 'dit', texte: 'Clac ! Un grondement répond au loin.' },
      { c: 'appel', evenement: 'grille_test' },
    ] },
  ],
  grille_test: [
    { c: 'si', cond: ['levier1', 'levier2'], alors: [
      { c: 'secousse' },
      { c: 'son', id: 'grille' },
      { c: 'flag', nom: 'grille_ouverte' },
      { c: 'dit', texte: "Un long grincement résonne dans toute la grotte. La grille s'est levée !" },
    ] },
  ],
  pip: [
    { c: 'dit', qui: 'Pip', portrait: 'pip', texte: "Aël ?! Ouf… Je suis venu chercher des cristaux pour mon père, mais les chauves-souris m'ont coincé ici." },
    { c: 'si', cond: ['quete_pip'], alors: [{ c: 'dit', qui: A, portrait: 'ael', texte: 'Ton père se fait un sang d’encre. Rentre par la fissure, on te couvre.' }], sinon: [
      { c: 'dit', qui: A, portrait: 'ael', texte: 'Pip, le fils de Gus ? Rentre au village, vite.' },
    ] },
    { c: 'dit', qui: 'Pip', portrait: 'pip', texte: "D'accord ! Et… merci. Je dirai à papa que c'est toi." },
    { c: 'flag', nom: 'pip_sauve' },
    { c: 'si', cond: ['!quete_pip'], alors: [{ c: 'flag', nom: 'quete_pip' }, { c: 'quete', id: 'q_pip', etat: 'active' }] },
  ],
  serpent_vu: [{ c: 'dit', texte: 'Un immense serpent de cristal dort, enroulé autour de l’autel.' }],
  serpent_combat: [
    { c: 'dit', texte: "L'eau frémit. Le serpent enroulé autour de l'autel déroule ses anneaux de cristal, et des échos sifflent de partout." },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Il garde la flamme… et la Brume l'a rendu fou. Regarde ses yeux, ils sont tout noirs !" },
    { c: 'dit', qui: A, portrait: 'ael', texte: 'Désolé, vieux gardien. On a besoin de ce feu.' },
    { c: 'combat', groupe: ['serpent_echo'] },
    { c: 'flag', nom: 'serpent_vaincu' },
    { c: 'dit', texte: 'Le serpent se dissout en une pluie de cristaux tintants. La Brume qui l’habitait s’échappe en sifflant vers le plafond.' },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Il a laissé tomber une lame… Elle chante comme le vent du large. Garde-la, c'est pour toi." },
    { c: 'sauve' },
  ],
  autel_echos: [
    { c: 'si', cond: ['eclat_obtenu'], alors: [{ c: 'dit', texte: "L'autel est silencieux. Sa flamme brûle désormais dans la lanterne." }], sinon: [
      { c: 'si', cond: ['serpent_vaincu'], alors: [
        { c: 'dit', texte: "Sur l'autel danse une flamme minuscule, blanche et bleue. Tu lèves la lanterne d'Odile." },
        { c: 'flash', couleur: '#cfe9ff' },
        { c: 'son', id: 'fanal' },
        { c: 'donne', objet: 'eclat_fanal' },
        { c: 'flag', nom: 'eclat_obtenu' },
        { c: 'dit', qui: A, portrait: 'ael', texte: 'Elle est chaude… On dirait qu’elle bat, comme un cœur.' },
        { c: 'dit', qui: M, portrait: 'mira', texte: 'Au Fanal, vite ! Sur la colline, à l’est de ton village.' },
        { c: 'sauve' },
      ], sinon: [{ c: 'dit', texte: 'Le serpent veille sur l’autel.' }] },
    ] },
  ],
  // ---------- Colline du Fanal ----------
  panneau_fanal: [{ c: 'dit', texte: '« Fanal de Clairval. Allumé l’an premier d’Aérys. Ne pas éteindre. »' }],
  fanal_clairval: [
    { c: 'si', cond: ['fanal1_allume'], alors: [{ c: 'dit', texte: 'Le Fanal brille d’une lumière douce et puissante. Toute l’île semble respirer.' }], sinon: [
      { c: 'dit', texte: 'Au sommet de la tour, la flamme n’est plus qu’une braise grise. Des volutes noires s’enroulent autour des pierres.' },
    ] },
  ],
  sentinelle: [
    { c: 'secousse' },
    { c: 'dit', texte: 'La Brume s’épaissit d’un coup. Une silhouette en armure, drapée d’un voile noir, se dresse entre vous et le Fanal.' },
    { c: 'dit', qui: 'Sentinelle', portrait: 'sentinelle', texte: '… Rends la flamme, enfant. Le Roi Pâle l’a ordonné : tous les Fanaux s’éteindront.' },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Le Roi Pâle ? Je ne sais pas qui c'est, mais il ne touchera pas à Clairval !" },
    { c: 'dit', qui: M, portrait: 'mira', texte: 'Son voile… Il craint la lumière, j’en suis sûre. Et l’eau le fait fumer !' },
    { c: 'combat', groupe: ['ombre_errante', 'sentinelle_voilee', 'ombre_errante'] },
    { c: 'flag', nom: 'sentinelle_vaincue' },
    { c: 'dit', texte: 'La Sentinelle se disloque en lambeaux de brume.' },
    { c: 'dit', texte: 'Tu grimpes l’escalier de la tour et ouvres la lanterne d’Odile au-dessus de la braise.' },
    { c: 'flash', couleur: '#fff3c4' },
    { c: 'son', id: 'fanal' },
    { c: 'flag', nom: 'fanal1_allume' },
    { c: 'retire', objet: 'eclat_fanal' },
    { c: 'secousse' },
    { c: 'dit', texte: "La flamme jaillit, blanche, immense. La Brume recule en hurlant jusqu'au bord de l'île, puis tombe dans les nuages." },
    { c: 'dit', qui: '???', portrait: 'roi', texte: '« Un Fanal rallumé… Comme c’est touchant. Il en reste quatre, petit voilier. Et ceux-là, je les tiens déjà. »' },
    { c: 'dit', qui: M, portrait: 'mira', texte: 'Tu as entendu ça ? Cette voix venait… d’en dessous.' },
    { c: 'dit', qui: A, portrait: 'ael', texte: 'Grand-mère arrive. Allons lui parler.' },
    { c: 'quete', id: 'q_fanal', etat: 'terminee' },
    { c: 'sauve' },
  ],
  odile_colline: [
    { c: 'dit', qui: 'Odile', portrait: 'odile', texte: 'Tu l’as fait… Mon petit voilier a rallumé le Fanal de Clairval.' },
    { c: 'dit', qui: A, portrait: 'ael', texte: 'Grand-mère, une voix a parlé du « Roi Pâle ». Elle a dit que les quatre autres Fanaux étaient perdus.' },
    { c: 'dit', qui: 'Odile', portrait: 'odile', texte: "Le Roi Pâle… Morvane. C'était un gardien de Fanal, autrefois. Il voulait descendre sous la Brume, rejoindre le Fond." },
    { c: 'dit', qui: 'Odile', portrait: 'odile', texte: "On le croyait perdu. S'il éteint les Fanaux, toutes les îles tomberont avec lui." },
    { c: 'dit', qui: 'Odile', portrait: 'odile', texte: "Le courant de vent qui relie Clairval à Port-Venteux s'est rouvert. Prends le Moineau, le voilier de tes parents. Il t'attend." },
    { c: 'donne', objet: 'boussole' },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Port-Venteux ! Le deuxième Fanal est sur les Récifs Célestes, juste à côté. Je l'ai sur ma carte." },
    { c: 'dit', qui: 'Odile', portrait: 'odile', texte: 'Allez. Et revenez-moi entiers.' },
    { c: 'titre', texte: 'Fin de l’Acte I', sous: 'Le Fanal de Clairval brille de nouveau' },
    { c: 'flag', nom: 'acte1_fini' },
    { c: 'appel', evenement: 'acte2_debut' },
  ],
};
