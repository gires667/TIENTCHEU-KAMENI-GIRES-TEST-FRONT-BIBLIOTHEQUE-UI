# SOURCES_IA — Déclaration d'usage de l'IA

Étudiant : Gires Varel TIENTCHEU KAMENI

**J'ai utilisé l'IA sur ce rattrapage, de façon importante.** Cette déclaration dit précisément ce que l'IA a fait, ce que j'ai fait moi-même, et comment j'ai vérifié.

## 1. Outils et autres sources

| Source | Usage |
|---|---|
| **Claude** (Anthropic), via l'interface web claude.ai | explications, plan de travail pas à pas, code des tests, code des corrections, code des composants F3, brouillons de `README.md`, `JUSTIFICATIONS.md` et `SOURCES_IA.md` |
| Sujet PDF du rattrapage | énoncé, données fictives, code du composant de départ |
| Outils du navigateur (F12 : émulation d'appareil, console) | captures à 360 px et 1280 px, mesure du contraste, vérification du débordement |
|
## 2. Usages et fichiers concernés

| Fichier ou livrable | Rôle de l'IA | Mon rôle |
|---|---|---|
| `modules/F2/vite.config.js`, `src/setup.js` | a proposé la configuration, expliquée ligne par ligne | je l'ai créée, lancée et vérifiée (`pnpm test` répond « No test files found » puis fonctionne) |
| `modules/F2/src/sessions.js` | a proposé la fusion des deux tableaux du sujet | j'ai recopié et relu les 6 séances par rapport aux tableaux du PDF |
| `modules/F2/src/PlanningList.test.jsx` | a proposé les 6 tests, écrits un par un avec explication | je les ai écrits un à la fois, lancés à chaque étape, et j'ai capturé les résultats |
| `modules/F2/src/PlanningList.jsx` | a proposé les 3 corrections (liste vide, erreur + relance, réponses périmées) | je les ai appliquées une par une et relancé les tests après chacune (3 rouges, puis 4, 5, 6 verts) |
| `modules/F3/src/*` (composants, Tailwind) | a proposé le code des composants, du filtre, du détail en `<dialog>` et de l'état vide | je les ai créés, lancés avec `pnpm dev`, testés au clavier et dans le navigateur |
| `preuves/` | n'a pas produit les captures | toutes les captures et traces viennent de mes exécutions (sauf une capture dont j'ai fait masquer la zone du profil du navigateur) |

## 3. Requêtes représentatives (résumées)

- « Analyse ce document et explique-moi mieux ce que je dois faire, avec les étapes pour le réaliser correctement. »
- « Je vais le faire avec pnpm. »
- « Je veux qu'on le fasse pas à pas pour que je comprenne ce que je fais, pour fournir des captures. »
- « Structure-moi un justificatif .md avec mes captures. » / « Crée-moi un README à partir de mon package.json. »
- « Termine la deuxième partie (F3) : cartes, filtre, détail accessible, état vide, contraste. »
- Plusieurs messages où j'ai collé mes erreurs de terminal pour obtenir de l'aide (dossier `preuves` introuvable, clone Git refusé, mauvais dossier pour `pnpm dev`, chemins d'images).

## 4. Adaptations et vérifications

**Ce que j'ai exécuté et vérifié sur ma machine**
- `pnpm install` et `pnpm test` : tests rouges avant correction, puis les 6 verts après (traces dans `preuves/` et captures).
- Un **clone propre** de mon dépôt GitHub dans un autre dossier, puis `pnpm install --frozen-lockfile` et `pnpm test` : 6 tests passés.
- F3 : `pnpm dev`, rendu à 360 px et 1280 px avec l'émulation d'appareil, navigation au clavier (Tab), mesure de contraste avec un script dans la console, état vide avec `?demo=empty`.

**Erreurs de l'IA que j'ai repérées ou qui ont été corrigées**
- La date s'affichait « Lundi 19 **O**ctobre » (majuscule à chaque mot) : repéré sur ma capture, corrigé dans `format.js`.
- Les chemins des images dans `JUSTIFICATIONS.md` ne correspondaient pas aux vrais noms de mes fichiers (espaces au lieu de `_`) : corrigés, avec une règle qui a d'abord cassé un chemin avant d'être réparée.
- Un dépôt Git avait été créé par erreur à la racine de mon dossier utilisateur : j'ai recréé le dépôt dans le dossier du projet.

**Problèmes d'environnement que j'ai résolus moi-même**
- Dossier `preuves` inexistant lors de la sauvegarde de la trace de test.
- Clone Git en SSH refusé : refait en HTTPS.
- `pnpm dev` lancé depuis `src/` au lieu de la racine du module.
- Port 5174 utilisé à la place de 5173 (autre serveur déjà ouvert).

