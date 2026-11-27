# Kevlegende — Les Fanaux de la Brume

RPG d'aventure sur des îles flottantes, jouable dans le navigateur (mobile d'abord). Aël, apprenti voilier de Clairval, part rallumer les Fanaux qui retiennent la Mer de Brume, avec Mira la cartographe et Brann le forgeron.

**Jouer :** https://yankamkevin.github.io/kevlegende/

## Contenu actuel

- **Acte I, « Le Fanal qui vacille »** : Clairval, le Bois Murmurant, le Col des Vents, la Grotte des Échos, la Colline du Fanal.
- **Acte II, « Le Port-Venteux »** : le port, la forge, les Récifs Coralliens, l'Épave, le Phare.
- 13 cartes peintes à la main, 8 quêtes (dont 5 secondaires), 20 créatures, 5 boss, 3 héros jouables avec techniques, équipement et objets.
- Combats au tour par tour selon la vitesse, avec la **Brèche** : frapper une faiblesse use le bouclier ennemi, qui finit Brisé (tour perdu, dégâts ×1,5).
- Environ 2 heures de jeu. L'Acte III, « Les Sables d'Ambre », est la prochaine étape.

## Commandes

- **Mobile** : croix directionnelle à gauche, bouton **A** pour parler, ouvrir et valider, bouton ☰ pour le menu.
- **Clavier** : flèches, ZQSD ou WASD pour bouger, Entrée, Espace ou E pour agir, Échap ou M pour le menu, Retour arrière pour revenir.
- En combat : touchez un ennemi pour l'attaquer directement. **Auto** laisse la tactique jouer, **×1 / ×2 / ×3** accélère les animations.

## Sauvegarde

- Sauvegarde automatique à chaque changement de lieu, après les moments clés et quand l'onglet passe en arrière-plan.
- 3 carnets manuels, chacun avec une copie de secours.
- Format versionné avec somme de contrôle et migrations.
- Export et import par code texte pour changer d'appareil.

## Développement

```bash
npm ci
npm run dev        # serveur local
npm run ci         # types, taille des modules, données, tests unitaires avec couverture
npm run test:bot   # le bot joue toute l'aventure sur 8 graines
npm run test:e2e   # parcours Playwright sur mobile (Pixel 7)
```

Architecture :

- `src/core` : moteur pur, sans DOM (exploration, scripts d'événements, combat, progression).
- `src/data` : le monde (cartes ASCII, événements, ennemis, objets, quêtes).
- `src/save` : sauvegarde versionnée.
- `src/bot` : joueur automatique utilisé par les tests et par le mode Auto.
- `src/render` : rendu canvas procédural des îles, personnages et décors.
- `src/ui` : interface DOM (dialogues, menus, boutique, combat).
- `src/audio` : musique et bruitages synthétisés (Web Audio).

Aucun module ne dépasse 400 lignes. La CI bloque sur les types, les données, les tests, le bot et les parcours e2e avant de publier sur GitHub Pages.

Les illustrations (titre, portraits, décors de combat, créatures) sont peintes pour le jeu ; le reste est dessiné par le code.
