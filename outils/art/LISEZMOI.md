# Illustrations peintes

Pipeline utilisé pour produire les images de `public/art` (sur un Mac avec Codex).

1. `./tout.sh` génère chaque `prompts/<ID>.txt` manquant (préfixé par `prompts/_ADN.txt`) dans `out/<ID>.png`, trois à la fois. Progression : `logs/etat.txt`.
2. `python3 convertir.py` produit `web/<ID>.webp` : portraits 384 px, décors 1280 px, ennemis détourés sur fond transparent 560 px.
3. Copier `web/*.webp` dans `public/art/` puis ajouter les noms à `ILLUSTRATIONS` (`src/render/assets.ts`) ; un test vérifie que la liste correspond aux fichiers.

`prompts/` contient les prompts des Actes III, IV et V (ceux des Actes I et II ont déjà été générés).

Creux blancs : le détourage ne vide que le fond relié aux bords. Pour un ennemi aux couleurs franches dont un creux fermé reste blanc, lancer `REPARER=1 python3 convertir.py ../../public/art/ennemi_<id>.webp`. Ne pas l'appliquer aux créatures blanches (loup de givre, ours, méduse…) : leur pelage serait percé.
