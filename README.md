# MATRiCE — Rattrapage WEB2 (F2 + F3)

Étudiant : Gires Varel TIENTCHEU KAMENI

Ce dossier contient deux modules **indépendants** :

| Module | Compétence | État |
|---|---|---|
| **F2** | Tests front (Vitest + Testing Library) | terminé |
| **F3** | Bibliothèques UI (Tailwind) | *à compléter* |

Chaque module a son propre `package.json` et son propre `pnpm-lock.yaml` (pas de workspace commun). On peut donc lancer l'un sans l'autre.

## Contenu du dossier

```
rendu/
├── README.md
├── JUSTIFICATIONS.md        (problème → choix → alternative → preuves, par module)
├── SOURCES_IA.md            (déclaration de l'usage de l'IA)
├── modules/
│   ├── F2/                  (composant, tests, config)
│   └── F3/                  (à compléter)
└── preuves/                 (captures, traces avant/après)
```

`node_modules` n'est pas livré : il se recrée avec `pnpm install`.

---

## Prérequis

| Outil | Version utilisée |
|---|---|
| Node.js | v22.14.0 (`node -v`) |
| pnpm | 10.22.0 (`pnpm -v`) |
| Système | Windows, terminal Git Bash |

Si pnpm n'est pas installé :

```bash
npm install -g pnpm
# ou, avec corepack (livré avec Node) :
corepack enable
```

Le `package.json` contient `"packageManager": "pnpm@10.22.0"`, ce qui indique la version de pnpm attendue.

---

## Module F2 — Tests front

### Versions et dépendances

Les versions exactes sont figées dans `modules/F2/pnpm-lock.yaml`. Voici celles demandées dans `package.json` (et celles installées d'après mes captures) :

**Dépendances**

| Paquet | Version demandée | Rôle |
|---|---|---|
| react | ^19.3.0 | bibliothèque d'interface (installée : 19.3.0) |
| react-dom | ^19.3.0 | affichage de React dans le navigateur (19.3.0) |

**Dépendances de développement**

| Paquet | Version demandée | Rôle |
|---|---|---|
| vitest | ^5.0.3 | lance les tests (5.0.3) |
| vite | ^8.3.2 | outil de build, utilisé par Vitest (8.3.2) |
| @vitejs/plugin-react | ^6.1.1 | permet à Vitest de comprendre le JSX (6.1.1) |
| jsdom | ^30.1.1 | faux navigateur pour afficher le composant dans les tests (30.1.1) |
| @testing-library/react | ^16.3.3 | `render`, `screen`, `waitFor` (16.3.3) |
| @testing-library/dom | ^10.4.2 | requêtes `getByRole`, `findByText`… (10.4.2) |
| @testing-library/user-event | ^14.6.7 | simule un utilisateur : Tab, clic, sélection (14.6.7) |
| @testing-library/jest-dom | ^7.0.1 | vérifications comme `toBeInTheDocument` (7.0.1) |

### Installation

```bash
cd modules/F2
pnpm install --frozen-lockfile
```

`--frozen-lockfile` échoue si le lockfile n'est pas à jour avec le `package.json` : on est sûr d'installer exactement les mêmes versions que moi.

### Lancer les tests

```bash
cd modules/F2
pnpm test
```

`pnpm test` exécute `vitest run`. La commande est **non interactive** : elle lance les tests une seule fois puis s'arrête (contrairement à `vitest` seul, qui reste en mode « watch »).

**Résultat attendu :** `Test Files 1 passed (1)` et `Tests 6 passed (6)`.

Pour lancer un seul test (par exemple celui des réponses dans le désordre) :

```bash
pnpm vitest run -t "tardive"
```

### Fichiers de F2

| Fichier | Rôle |
|---|---|
| `src/PlanningList.initial.jsx` | composant du sujet, **version d'origine non modifiée** |
| `src/PlanningList.jsx` | composant corrigé (c'est celui que les tests utilisent) |
| `src/PlanningList.test.jsx` | les 6 tests |
| `src/sessions.js` | les 6 séances fictives et la fonction `filterSessions` |
| `src/setup.js` | branche `jest-dom` avant les tests |
| `vite.config.js` | configuration de Vitest (jsdom, setup, globals) |

### Comment retrouver le « avant correction »

Les tests importent `PlanningList.jsx`. L'état « avant correction » (3 tests rouges) est prouvé par :
- la copie `src/PlanningList.initial.jsx` ;
- la trace `preuves/F2_avant_correction.txt` et les captures dans `preuves/Captures d'ecran/` ;
- le commit daté « avant correction » (voir `JUSTIFICATIONS.md`).

Pour le revoir soi-même, on peut remplacer temporairement le contenu de `PlanningList.jsx` par celui de `PlanningList.initial.jsx`, lancer `pnpm test` (3 échecs), puis remettre la version corrigée avec `git checkout src/PlanningList.jsx`.

---

## Module F3 — Bibliothèques UI

*(à compléter : versions de Tailwind, installation et commande de lancement)*

---

## Ports

- **F2** : aucun. Les tests tournent dans le terminal, il n'y a pas de serveur.
- **F3** : *à compléter* (le serveur de développement Vite utilise en général le port 5173, à confirmer quand le module sera fait).

## Variables d'environnement et données factices

- Aucune variable d'environnement n'est nécessaire.
- Aucun secret, aucune clé d'API, aucune donnée personnelle.
- Toutes les données sont **fictives** : les 6 séances du sujet (`src/sessions.js`) et les formateurs « Camille Exemple », « Alex Démonstration » et « Sam Fictif ».
- Dans les tests, le serveur est simulé avec `vi.fn` et des promesses contrôlées (`deferred`) : aucun appel réseau réel.

---

## Limites (F2)

- `user.selectOptions` simule le choix d'une option, mais jsdom ne simule pas les flèches du clavier sur un `<select>` natif. Seul le focus avec Tab est testé.
- Le test « réponses dans le désordre » attend 20 ms réelles (`setTimeout`) pour laisser le temps à un éventuel écrasement.
- Les tests utilisent un faux serveur : ils ne vérifient pas un vrai réseau.
- Pas de test visuel (CSS), seulement le comportement affiché.
- Le message d'erreur du composant est générique (il n'affiche pas la cause réelle).
- La correction de la race condition ignore la réponse tardive mais n'annule pas la requête côté serveur.
- Le `package.json` garde quelques champs par défaut de `pnpm init` (`main`, `description`, `license`) qui ne servent pas ici.

## Usage de l'IA

L'IA a été utilisée pour m'accompagner sur ce rattrapage. Le détail (outils, usages, ce que j'ai vérifié et adapté) est dans `SOURCES_IA.md`.
