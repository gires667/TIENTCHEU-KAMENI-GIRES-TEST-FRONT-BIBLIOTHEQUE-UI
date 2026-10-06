# JUSTIFICATIONS — Rattrapage WEB2

Étudiant : Gires Varel TIENTCHEU KAMENI

> Ce fichier contient pour l'instant le **module F2**. La partie F3 sera ajoutée plus bas quand elle sera faite.
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

*(à compléter)*
///