# JUSTIFICATIONS — Rattrapage WEB2

Étudiant : Gires Varel TIENTCHEU KAMENI
> Les captures sont dans le dossier `preuves/Captures d'ecran/`.

## Sommaire F2
1. Ce que j'ai fait
2. Tableau des scénarios
3. Mise en place et écriture des premiers tests
4. Preuve « avant correction » (tests rouges)
5. Les corrections (et preuves « après »)
6. Vérification depuis zéro (clone propre)
7. Accessibilité
8. Limites
9. Commandes

---

## Module F2 — Tests front

### 1. Ce que j'ai fait (résumé)

J'ai recréé le composant `PlanningList` du sujet et les 6 séances. J'ai gardé une copie du composant avant correction (`src/PlanningList.initial.jsx`). J'ai écrit 6 tests avec Vitest et Testing Library. Avant correction, 3 tests étaient rouges. J'ai corrigé le composant en 3 étapes (une correction à la fois) et à la fin les 6 tests sont verts. J'ai aussi cloné mon dépôt dans un dossier propre pour vérifier que ça marche depuis zéro.

**Environnement utilisé** (vu dans mes captures) :
- Node v22.14.0, pnpm 10.22.0
- React 19.3.0, Vitest 5.0.3, jsdom 30.1.1, Vite 8.3.2
- @testing-library/react 16.3.3, @testing-library/dom 10.4.2, @testing-library/jest-dom 7.0.1, @testing-library/user-event 14.6.7
- @vitejs/plugin-react 6.1.1

**Fichiers principaux** (dans `modules/F2/`) :

| Fichier | Rôle |
|---|---|
| `src/sessions.js` | les 6 séances (tableaux du sujet fusionnés par `id`) + la fonction `filterSessions` |
| `src/PlanningList.initial.jsx` | copie du composant d'origine, **jamais modifiée** |
| `src/PlanningList.jsx` | le composant que j'ai corrigé |
| `src/PlanningList.test.jsx` | les 6 tests |
| `src/setup.js` | branche `jest-dom` (pour `toBeInTheDocument`, etc.) |
| `vite.config.js` | config de Vitest (jsdom, setup, globals) |
| `pnpm-lock.yaml` | dépendances verrouillées |

---

### 2. Tableau des scénarios

| # | Scénario | Entrée | Attendu | Risque couvert | Avant | Après |
|---|---|---|---|---|---|---|
| 1 | Chargement | `loadSessions` renvoie une promesse qui ne se résout jamais | un élément `role="status"` avec « Chargement… » | l'utilisateur ne voit rien pendant l'attente | vert | vert |
| 2 | Succès | promesse résolue avec les 6 séances | les 6 titres sont affichés, le chargement disparaît | affichage cassé | vert | vert |
| 3 | Filtre A | sélection de « Groupe A » (au clavier : Tab puis sélection) | appel avec `{ group: 'A' }`, séances s01 s03 s04 s06 affichées, s02 et s05 absentes | mauvais filtrage (oublier Promotion) ; filtre sans nom accessible | vert | vert |
| 4 | Résultat vide | réponse `[]` | message « Aucune séance pour ce groupe. », aucun ancien titre | écran vide qu'on prend pour une panne | **rouge** | vert |
| 5 | Erreur puis nouvelle tentative | 1er appel rejeté, 2e appel réussi | `role="alert"` visible, bouton « Réessayer », même demande relancée, résultats retrouvés | « Chargement… » infini, erreur cachée | **rouge** | vert |
| 6 | Réponses dans le désordre | demande 1 (« Tous ») lente, demande 2 (« Promotion ») rapide | la réponse tardive de la 1 n'écrase pas la 2 (2 séances restent) | race condition | **rouge** | vert |

---

### 3. Mise en place et écriture des premiers tests

**Étape 3.1 — Copie du composant et premier lancement.** J'ai déplacé `PlanningList.jsx` dans `src/` et j'en ai fait une copie `PlanningList.initial.jsx` (la version « avant correction »). Au premier `pnpm test`, Vitest répond « No test files found » : c'est normal, il démarre mais je n'ai pas encore écrit de test.

![Déplacement et copie du composant, puis « No test files found »](preuves/Captures%20d'ecran/Capture%20d'%C3%A9cran%202026-10-03%20101810.png)

**Étape 3.2 — Arborescence de `src/`.** Avec `ls -R src` on voit bien `PlanningList.initial.jsx`, `PlanningList.jsx` et `setup.js`.

![Contenu du dossier src](preuves/Captures%20d'ecran/Capture%20d'%C3%A9cran%202026-10-03%20102119.png)

**Étape 3.3 — Test 1 (chargement) : vert.** Premier test écrit, il passe avec le composant initial car il gère déjà le chargement.

![1 test passé](preuves/Captures%20d'ecran/Capture%20d'%C3%A9cran%202026-10-03%20102945.png)

**Étape 3.4 — Test 2 (succès) : vert.**

![2 tests passés](preuves/Captures%20d'ecran/2%20test%20passed%20.png)

**Étape 3.5 — Test 3 (filtre A, avec clavier et nom accessible) : vert.**

![3 tests passés dont le filtre A](preuves/Captures%20d'ecran/filtre%20A%20affiche%20A%20%2B%20promotion%20sans%20B.png)

---

### 4. Preuve « avant correction » : les tests rouges

**Étape 4.1 — Test 4 (résultat vide) : rouge.** Le composant initial n'a aucun code pour afficher un message quand la liste est vide, donc le test ne trouve jamais « aucune séance ».

![Test « résultat vide » en échec (1 failed, 3 passed)](preuves/Captures%20d'ecran/test%20failed%20rouge.png)

**Étape 4.2 — Test 5 (erreur) : rouge + erreur non gérée.** Le composant ne gère pas le rejet de la promesse : on voit « 1 error » (Unhandled Rejection) en plus des 2 tests en échec.

![Test « erreur » en échec + 1 error (2 failed, 3 passed)](preuves/Captures%20d'ecran/1%20error%20.png)

**Étape 4.3 — Les 6 tests écrits, avant toute correction : 3 rouges.** C'est ma preuve « avant correction » complète : **3 passés, 3 échoués, 1 error**.

![Avant correction : 3 passed, 3 failed, 1 error](preuves/Captures%20d'ecran/3%20passed%203%20failed.png)

**Étape 4.4 — Sauvegarde de la trace.** Le dossier `preuves/` contient `F2_avant_correction.txt`, la sortie complète du terminal avant correction (j'ai dû d'abord créer le dossier `preuves`, la première sauvegarde avait échoué).

![Dossier preuves avec F2_avant_correction.txt](preuves/Captures%20d'ecran/preuves.png)

*Remarque honnête :* les tests importent seulement `PlanningList.jsx`. Pour obtenir le « avant », j'ai lancé les tests pendant que `PlanningList.jsx` était encore identique à `PlanningList.initial.jsx`, puis j'ai commencé les corrections. La preuve est donc la capture, le fichier `.txt` et le commit daté.

**Commit avant correction :** `XXXXXXX` (à remplir avec `git log --oneline`).

---

### 5. Les corrections (une à la fois) et les preuves « après »

#### Correction 1 — message quand la liste est vide

- **Problème** : avec une réponse `[]`, le composant affichait une `<ul>` vide. L'utilisateur ne sait pas si c'est une panne, un chargement ou s'il n'y a vraiment rien.
- **Choix** : ajouter un cas dans l'affichage : si on ne charge pas et que `items.length === 0`, on affiche « Aucune séance pour ce groupe. ». J'ai aussi mis `loading` à `true` au départ pour ne pas voir ce message une fraction de seconde avant le premier chargement.
- **Alternative** : afficher le message avec un composant séparé `EmptyState`. Je ne l'ai pas fait parce que pour F2 on demande des corrections minimales.
- **Fichier** : `src/PlanningList.jsx` (le `return` et le `useState(true)`).
- **Explication personnelle** : l'ordre des conditions est important. Il faut tester `loading` avant `items.length === 0`, sinon pendant le chargement la liste est vide et on afficherait « Aucune séance » alors que la demande est en cours.
- **Entrée / sortie** : réponse `[]` pour le groupe B → avant : liste vide sans texte ; après : « Aucune séance pour ce groupe. ».
- **Preuve** : avant = étape 4.1 ci-dessus. Après : le test « vide » passe, il reste 2 échecs (erreur et désordre).
- **Limite** : le message est le même pour tous les groupes.

![Après correction 1 : 4 passed, 2 failed](preuves/Captures%20d'ecran/4%20passed%202%20failed.png)

#### Correction 2 — erreur visible et bouton « Réessayer »

- **Problème** : le composant faisait `.then(...)` sans rien pour le cas où la promesse est rejetée. Du coup `loading` restait à `true` pour toujours (« Chargement… » infini) et Vitest signalait une « Unhandled Rejection ».
- **Choix** : ajouter deux états, `error` et `attempt`. `.then` reçoit deux fonctions (succès et échec). En cas d'échec, on affiche un bloc `role="alert"` avec un bouton « Réessayer ». Le bouton fait `setAttempt(a => a + 1)`, ce qui relance le `useEffect` avec le même `group`.
- **Alternative** : utiliser `.catch(...)` à la fin de la chaîne, ou `try/catch` dans une fonction `async`. J'ai gardé `.then(succès, échec)`, c'est plus court.
- **Fichier** : `src/PlanningList.jsx` (les `useState`, le `useEffect` et le `return`).
- **Explication personnelle** : « Réessayer » doit refaire la même demande, sinon un utilisateur sur « Groupe B » pourrait retomber sur d'autres séances que celles de son filtre. Le test vérifie donc que le 2e appel est bien `{ group: 'all' }`. J'ai mis l'erreur avant le cas « vide » dans l'affichage pour ne pas dire « Aucune séance » quand le serveur a juste planté.
- **Entrée / sortie** : 1er appel rejeté → avant : « Chargement… » pour toujours ; après : message d'erreur + bouton, puis les séances après le clic.
- **Preuve** : avant = étapes 4.2 et 4.3. Après : plus de « 1 error », il ne reste qu'un test rouge (désordre), on voit d'ailleurs « attendu 2 » dans le code affiché.
- **Limite** : le message d'erreur est générique, il n'affiche pas la vraie cause.

![Après correction 2 : 5 passed, 1 failed (il reste « désordre »)](preuves/Captures%20d'ecran/5%20passed%201%20failed.png)

#### Correction 3 — réponses dans le désordre (race condition)

- **Problème** : si l'utilisateur change de filtre vite, la réponse lente de la 1re demande peut arriver après celle de la 2e et l'écraser. L'écran n'est alors plus cohérent avec le filtre choisi.
- **Choix** : dans le `useEffect`, une variable `let ignore = false` créée à chaque exécution, et une fonction de nettoyage `return () => { ignore = true; }`. Dans `.then`, on ne met à jour l'écran que si `!ignore`.
- **Alternative** : `AbortController` pour annuler la vraie requête réseau. Je ne l'ai pas utilisé parce que `loadSessions` est une fonction fournie dont je ne contrôle pas le contenu.
- **Fichier** : `src/PlanningList.jsx` (le `useEffect`).
- **Explication personnelle** : chaque demande a son propre `ignore`. Quand le filtre change, React lance le nettoyage de l'ancienne demande avant de relancer l'effet : son `ignore` passe à `true`, donc sa réponse tardive est ignorée. La nouvelle demande garde `ignore = false`, donc son résultat s'affiche. Sans la ligne de nettoyage, l'ancien `ignore` resterait à `false` et le bug reviendrait.
- **Entrée / sortie** : « Promotion » choisi, la demande 2 répond puis la demande 1 en retard → avant : 6 séances affichées (« expected 2, got 6 ») ; après : 2 séances.
- **Preuve** : avant = la capture de la correction 2 (le test désordre échoue). Après : **6 tests passés**.
- **Limite** : on ignore la réponse mais la requête part quand même côté serveur.

![Après correction 3 : 6 tests passés](preuves/Captures%20d'ecran/6%20passed%20.png)

**Trace complète :** `preuves/F2_apres_correction.txt`. **Commit après correction :** `YYYYYYY` (à remplir).

---

### 6. Vérification depuis zéro (clone propre)

Pour être sûr que mon module est autonome, j'ai cloné mon dépôt GitHub dans un nouveau dossier (`test-clone`), puis lancé `pnpm install --frozen-lockfile` (100 paquets installés, lockfile à jour) et `pnpm test`. Mon premier essai de clone en SSH avait échoué (« Permission denied (publickey) »), je l'ai refait avec l'adresse HTTPS.

![Clone du dépôt et installation avec le lockfile](preuves/Captures%20d'ecran/git%20clone.png)

![pnpm test dans le clone : 6 tests passés](preuves/Captures%20d'ecran/test%20clone%206%20passed%20.png)

---

### 7. Accessibilité (intégrée au test 3)

Le test 3 vérifie que le filtre est trouvable avec `getByRole('combobox', { name: 'Groupe' })`, donc que le nom accessible « Groupe » (`aria-label`) est bon. Il vérifie aussi avec `user.tab()` que le filtre reçoit le focus au clavier, puis il choisit « A » avec `selectOptions`. Pour l'erreur, j'ai utilisé `role="alert"`, que les lecteurs d'écran annoncent tout de suite.

---

### 8. Limites de ma stratégie de test

- `user.selectOptions` simule le choix d'une option, mais jsdom ne simule pas les flèches du clavier sur un `<select>`. Je teste seulement que le focus arrive sur le filtre avec Tab.
- Le test 6 attend 20 ms réelles (`setTimeout`) pour laisser le temps à un éventuel écrasement. Ce n'est pas très élégant.
- Les tests utilisent un faux serveur (`vi.fn` et des promesses contrôlées). Ils ne testent pas un vrai réseau.
- Je ne teste pas l'aspect visuel (CSS), seulement le comportement affiché.
- Je n'ai pas utilisé de snapshots ni de mesure de couverture : les tests regardent ce que voit l'utilisateur (`getByRole`, `findByText`).

---

### 9. Commandes (pour le README)

```bash
cd modules/F2
pnpm install --frozen-lockfile
pnpm test        # non interactif (vitest run), 6 tests
```

---

## Module F3 — Bibliothèques UI

### 1. Ce que j'ai fait (résumé)

J'ai fait une vue simplifiée du planning avec **React** et **Tailwind CSS**. Les 6 séances sont affichées sous forme de cartes, avec un filtre de groupe (Tous, A, B, Promotion), des badges de domaine et de statut, et un détail qui s'ouvre dans une fenêtre. J'ai prévu un état vide (démo avec `?demo=empty`) et vérifié l'affichage à 360 px et 1280 px. Ce module est indépendant de F2 : il a ses propres données (`src/data.js`) et son propre `package.json`.

**Environnement** :
- Node v22.14.0, pnpm 10.22.0
- Vite 8.3.3, Tailwind CSS **X.Y.Z** (à compléter avec `pnpm list tailwindcss`), React 19.x
- Lancement : `pnpm install --frozen-lockfile` puis `pnpm dev` (port affiché dans le terminal : 5174 chez moi, car 5173 était déjà pris)

**Fichiers principaux** (dans `modules/F3/src/`) :

| Fichier | Rôle |
|---|---|
| `data.js` | les 6 séances, les 3 formateurs, la fonction `filterSessions` |
| `format.js` | formate la date (« Lundi 19 octobre ») et traduit am/pm |
| `Badge.jsx` | pastille générique (forme, taille) |
| `StatusBadge.jsx` | badge de statut : libellé + icône + couleur |
| `DomainBadge.jsx` | badge de domaine (web, data, cyber, projet) |
| `SessionCard.jsx` | une carte de séance, avec le bouton « Détails » |
| `GroupFilter.jsx` | le filtre de groupe (`<label>` + `<select>`) |
| `SessionDetail.jsx` | le détail dans un `<dialog>` modal |
| `EmptyState.jsx` | le message quand il n'y a aucune séance |
| `App.jsx` | assemble tout, garde l'état (groupe choisi, détail ouvert) |

---

### 2. Règles de filtrage (rappel)

| Choix | Séances affichées | Nombre |
|---|---|---|
| Tous | s01 à s06 | 6 |
| Groupe A | s01, s03, s04, s06 | 4 |
| Groupe B | s02, s03, s05, s06 | 4 |
| Promotion | s03, s06 | 2 |

A et B incluent les séances communes « Promotion », comme demandé dans le sujet.

---

### 3. Les trois décisions

#### Décision 1 — Hiérarchie carte / détail

- **Ce qui apparaît tout de suite sur la carte** : le titre (le plus gros et le plus foncé, en `<h2>`), puis la date et la période, puis les deux badges (domaine et statut), puis le bouton « Détails ».
- **Ce qui est réservé au détail** : le groupe, le mode (DG, CE, AUTO) et le formateur (ou « Aucun formateur » quand `teacherId` vaut `null`, comme pour s06).
- **Pourquoi** : la carte doit se lire d'un coup d'œil et rester courte, surtout sur un écran de 360 px où elles s'empilent. Le groupe est déjà donné par le filtre, et le formateur ou le mode ne servent que pour la séance qui intéresse l'utilisateur.
- **Alternative** : tout mettre sur la carte. Je ne l'ai pas fait parce que les cartes seraient très longues et plus difficiles à comparer.

#### Décision 2 — Lisibilité des statuts

- **Libellé écrit** : « Confirmée » ou « Proposée », jamais la couleur seule. S'y ajoute une icône (✓ ou …), cachée aux lecteurs d'écran (`aria-hidden`) pour qu'ils ne lisent que le libellé.
- **Couleurs** : fond clair et texte très foncé de la même famille (par exemple vert pâle et vert foncé).
- **Pourquoi** : une personne daltonienne, une impression en noir et blanc ou un lecteur d'écran ne permettent pas de distinguer vert et orange. Le texte garde l'information dans tous les cas.
- **Mesure de contraste** (voir 5.5) : tous les badges dépassent largement 4,5:1.

#### Décision 3 — Accès aux actions

- **Repérage** : le filtre et le bouton « Détails » sont de vrais éléments `<select>` et `<button>`, avec un contour bleu visible quand on arrive dessus au clavier (`focus-visible`) et une hauteur de 44 px minimum (`min-h-11`) pour être faciles à toucher.
- **Noms accessibles** : le filtre est relié à son `<label>` « Groupe ». Le bouton s'appelle « Détails de React composants » (et pas six boutons « Détails » identiques), ce qui contient bien le texte visible « Détails ».
- **État** : le bouton porte `aria-expanded` (ouvert ou fermé) et `aria-haspopup="dialog"`.
- **Clavier et focus** : le détail est un `<dialog>` ouvert avec `showModal()`. Le navigateur déplace le focus dans la fenêtre, empêche de naviguer derrière, et ferme avec **Esc**. À la fermeture, `App.jsx` remet le focus sur le bouton qui avait ouvert le détail (`triggerRef`).
- **Alternative** : un panneau fait à la main avec `div` et gestion du focus à la main. J'ai préféré l'élément natif, qui fait déjà une grande partie du travail d'accessibilité.

---

### 4. Composants réutilisables

- **`Badge`** : une seule forme (pastille arrondie), et la couleur arrive de l'extérieur avec `className`. `StatusBadge` et `DomainBadge` ne font que choisir le texte et les couleurs, ils ne dupliquent pas le style.
- **`GroupFilter`** : il ne garde pas l'état, il reçoit `value` et `onChange` de son parent. On pourrait donc le réutiliser pour un autre filtre.
- **`SessionCard`** : reçoit une séance et affiche toujours la même structure. Elle ne sait pas comment le détail s'ouvre, elle appelle seulement `onOpen`.
- **`EmptyState`** : reçoit un titre et un texte. Utilisable pour n'importe quelle liste vide.

---

### 5. Preuves

#### 5.1 Affichage à 360 px et à 1280 px

Captures faites avec l'outil d'émulation d'appareil du navigateur (F12). À 360 px : une seule colonne (la capture montre le haut de la page, les cartes suivantes sont plus bas). À 1280 px : trois colonnes, contenu centré (`max-w-5xl`). Les titres longs passent à la ligne (`break-words`) et les badges aussi (`flex-wrap`).

![Liste à 360 px](preuves/Captures%20d'ecran/F3-liste-360.png)

![Liste à 1280 px](preuves/Captures%20d'ecran/F3-liste-1280.png)

**Absence de débordement horizontal** : mesuré à 360 px dans la console avec `document.documentElement.scrollWidth > window.innerWidth`, résultat **`false`** (pas de défilement horizontal).

> ⚠️ **À compléter avant de rendre :** vérifier que j'ai bien lancé cette commande en mode 360 px (sinon la refaire) et ajouter une capture de la console avec le `false`, par exemple `F3-debordement.png`. Supprimer ce message ensuite.

#### 5.2 Filtre de groupe

Sélection de « Groupe A » : 4 séances (React composants, Données et SQL, Authentification, Travail autonome), donc les séances A et les séances Promotion, sans les séances B. On voit aussi le contour bleu de focus sur le filtre.

![Filtre sur le Groupe A : 4 séances](preuves/Captures%20d'ecran/F3-filtre-A.png)

#### 5.3 Détail d'une séance

Détail de « React événements » : groupe B, mode DG, formateur Alex Démonstration. Capture faite sur écran large (environ 1340 px, hors mode appareil).

![Détail ouvert (écran large)](preuves/Captures%20d'ecran/F3-detail-ecran-large.png)

#### 5.4 État vide (scénario reproductible)

Le jeu de données fourni ne produit jamais de liste vide avec le seul filtre de groupe (le plus petit résultat est 2 séances pour « Promotion »). **Scénario de démonstration :** ouvrir l'application avec `?demo=empty` à la fin de l'adresse, par exemple `http://localhost:5174/?demo=empty`. Un bandeau « Mode démo » s'affiche, le compteur indique « 0 séance » et le message « Aucune séance à afficher » apparaît à la place des cartes. Le lien « Quitter la démo » revient à la liste normale. (Sur la capture, la zone du profil du navigateur a été masquée.)

![État vide avec ?demo=empty](preuves/Captures%20d'ecran/F3-vide.png)

#### 5.5 Mesure de contraste

- **Outil utilisé** : un petit script dans la console du navigateur, qui lit les couleurs réellement affichées (`getComputedStyle`) et applique la formule de contraste WCAG. Vérification avec un deuxième outil : **WebAIM Contrast Checker** (*à compléter : indiquer les couples recontrôlés, ou supprimer cette phrase si je ne l'ai pas fait*).
- **Seuil** : 4,5:1 (WCAG AA, texte normal ; le texte des badges est petit, donc c'est ce seuil qui s'applique).

| Élément | Texte | Fond | Ratio | Résultat |
|---|---|---|---|---|
| Badge `web` | #1c398e | #dbeafe | 8,50 | conforme |
| Badge « ✓ Confirmée » | #0d542b | #dbfce7 | 8,23 | conforme |
| Badge `data` | #59168b | #f3e8ff | 9,31 | conforme |
| Badge `cyber` | #8b0836 | #ffe4e6 | 8,00 | conforme |
| Badge « … Proposée » | #7b3306 | #fef3c6 | 8,13 | conforme |
| Badge `projet` | #0f172b | #e2e8f0 | 14,46 | conforme |
| Date de la carte | #314158 | #ffffff | 10,36 | conforme |

Tous les ratios sont au-dessus de 4,5:1 (le plus bas est 8,00:1).

![Tableau de contraste dans la console](preuves/Captures%20d'ecran/F3-contraste.png)

*Limite :* j'ai mesuré les badges et la date. Je n'ai pas mesuré les autres textes (titres, boutons), qui utilisent un texte très foncé (`slate-900`) sur fond blanc.

#### 5.6 Protocole clavier

À faire avec le clavier seul (sans la souris) :

1. `Tab` : le focus arrive sur le filtre « Groupe » (contour bleu visible, voir la capture du 5.2). Les flèches haut et bas changent de groupe, et le compteur se met à jour.
2. `Tab` : le focus arrive sur le bouton « Détails de … » de la première carte. `Tab` encore : carte suivante.
3. Sur un bouton « Détails » : `Enter` (ou `Space`) ouvre le détail. Le focus passe dans la fenêtre, sur le bouton « Fermer » (contour bleu visible sur la capture ci-dessous, détail de « Données et SQL »).
4. `Tab` plusieurs fois : le focus reste dans la fenêtre.
5. `Esc` : la fenêtre se ferme et le focus revient sur le bouton « Détails » qui l'avait ouverte.
6. Même test avec le bouton « Fermer » (`Enter`).

![Focus sur « Fermer » à l'ouverture du détail](preuves/Captures%20d'ecran/F3-detail-focus-fermer.png)

**Résultat observé** : à l'étape 3, le focus arrive bien sur « Fermer » (capture ci-dessus). *(à compléter : résultat des étapes 5 et 6, le focus revient-il sur le bon bouton « Détails » ?)*

> ⚠️ **À compléter avant de rendre :** faire le test des étapes 5 et 6, écrire le résultat réel ci-dessus, et ajouter une capture du focus revenu sur le bouton « Détails » (par exemple `F3-focus-retour.png`). Supprimer ce message ensuite.

---

### 6. Limites

- Je n'ai pas testé avec un vrai lecteur d'écran (NVDA, VoiceOver). Les noms accessibles et les rôles sont prévus, mais pas écoutés.
- Testé seulement dans un navigateur de type Chromium, sur Windows.
- F3 n'a pas de tests automatisés (le sujet ne les impose pas pour ce module).
- La démo de l'état vide passe par un paramètre d'adresse : c'est une démonstration, pas une vraie fonctionnalité.
- Les données sont en mémoire dans `data.js` : pas de serveur, pas de base de données, pas de sauvegarde.
- Le contraste n'est mesuré que pour les badges et la date (voir 5.5).
- Les captures à 360 px et 1280 px sont faites avec l'outil d'émulation d'appareil du navigateur, pas sur un vrai téléphone. Les captures du filtre et du détail sont faites sur écran large, hors émulation.

### 7. Commandes

```bash
cd modules/F3
pnpm install --frozen-lockfile
pnpm dev        # puis ouvrir l'adresse affichée (5173 ou 5174)
pnpm build      # vérifie que le projet compile
```//