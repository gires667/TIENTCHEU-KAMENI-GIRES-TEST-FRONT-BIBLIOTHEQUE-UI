# MATRiCE — Rattrapage WEB2 (F2 + F3)

Étudiant : Gires Varel TIENTCHEU KAMENI

Ce dossier contient deux modules **indépendants** :

| Module | Compétence | Contenu |
|---|---|---|
| **F2** | Tests front (Vitest + Testing Library) | composant `PlanningList` initial et corrigé, 6 tests |
| **F3** | Bibliothèques UI (Tailwind CSS) | vue planning : cartes, filtre, badges, détail accessible, état vide |

Chaque module a son propre `package.json` et son propre `pnpm-lock.yaml` (pas de workspace commun). On peut donc lancer l'un sans l'autre.

## Contenu du dossier

```
rendu/
├── README.md
├── JUSTIFICATIONS.md        (problème → choix → alternative → preuves, par module)
├── SOURCES_IA.md            (déclaration de l'usage de l'IA)
├── modules/
│   ├── F2/                  (composant, tests, config)
│   └── F3/                  (application React + Tailwind)
└── preuves/
    ├── F2_avant_correction.txt
    ├── F2_apres_correction.txt
    └── Captures d'ecran/    (captures citées dans JUSTIFICATIONS.md)
```

`node_modules` n'est pas livré : il se recrée avec `pnpm install`.

---

## Prérequis

| Outil | Version utilisée |
|---|---|
| Node.js | v22.14.0 (`node -v`) |
| pnpm | 10.22.0 (`pnpm -v`) |
| Système | Windows, terminal Git Bash |
| Navigateur (F3) | navigateur de type Chromium |

Si pnpm n'est pas installé :

```bash
npm install -g pnpm
# ou, avec corepack (livré avec Node) :
corepack enable
```

Les deux `package.json` contiennent `"packageManager": "pnpm@10.22.0"`.

---

## Module F2 — Tests front

### Dépendances

Les versions exactes sont figées dans `modules/F2/pnpm-lock.yaml`.

| Paquet | Demandée | Rôle |
|---|---|---|
| react, react-dom | ^19.3.0 | bibliothèque d'interface (installée : 19.3.0) |
| vitest | ^5.0.3 | lance les tests (5.0.3) |
| vite | ^8.3.2 | outil utilisé par Vitest (8.3.2) |
| @vitejs/plugin-react | ^6.1.1 | comprend le JSX dans les tests (6.1.1) |
| jsdom | ^30.1.1 | faux navigateur pour les tests (30.1.1) |
| @testing-library/react | ^16.3.3 | `render`, `screen`, `waitFor` (16.3.3) |
| @testing-library/dom | ^10.4.2 | requêtes `getByRole`, `findByText` (10.4.2) |
| @testing-library/user-event | ^14.6.7 | simule Tab, clic, sélection (14.6.7) |
| @testing-library/jest-dom | ^7.0.1 | `toBeInTheDocument`, etc. (7.0.1) |

### Installation et tests

```bash
cd modules/F2
pnpm install --frozen-lockfile
pnpm test
```

`pnpm test` exécute `vitest run` : commande **non interactive** (une seule exécution, puis arrêt). Résultat attendu : `Tests 6 passed (6)`.

Pour lancer un seul test :

```bash
pnpm vitest run -t "tardive"
```

### Fichiers de F2

| Fichier | Rôle |
|---|---|
| `src/PlanningList.initial.jsx` | composant du sujet, **version d'origine non modifiée** |
| `src/PlanningList.jsx` | composant corrigé (utilisé par les tests) |
| `src/PlanningList.test.jsx` | les 6 tests |
| `src/sessions.js` | les 6 séances fictives et `filterSessions` |
| `src/setup.js` | branche `jest-dom` |
| `vite.config.js` | configuration de Vitest (jsdom, setup, globals) |

### Retrouver le « avant correction »

Les tests importent `PlanningList.jsx`. L'état « avant correction » (3 tests rouges) est prouvé par la copie `src/PlanningList.initial.jsx`, par `preuves/F2_avant_correction.txt`, par les captures et par le commit daté (voir `JUSTIFICATIONS.md`). Pour le revoir : remplacer temporairement le contenu de `PlanningList.jsx` par celui de `PlanningList.initial.jsx`, lancer `pnpm test` (3 échecs), puis restaurer avec `git checkout src/PlanningList.jsx` (attention : cette commande annule les modifications non enregistrées de ce fichier).

---

## Module F3 — Bibliothèques UI

### Dépendances

Les versions exactes sont figées dans `modules/F3/pnpm-lock.yaml`.

| Paquet | Version | Rôle |
|---|---|---|
| react, react-dom | (^19.3.0) | bibliothèque d'interface |
| tailwindcss | (^4.3.3) | classes utilitaires CSS |
| @tailwindcss/vite | (^4.3.3) | branche Tailwind dans Vite |
| vite | 8.3.3 | serveur de développement et build |
| @vitejs/plugin-react | (^6.1.2) | comprend le JSX |

> Pour remplir ce tableau : `cd modules/F3`, puis `pnpm list --depth 0`.

### Installation et lancement

```bash
cd modules/F3
pnpm install --frozen-lockfile
pnpm dev
```

Ouvrir l'adresse affichée dans le terminal (ligne `Local:`). Le port par défaut de Vite est **5173** ; chez moi c'est **5174**, parce que le 5173 était déjà occupé par un autre serveur. Arrêter le serveur : `Ctrl+C`.

Pour vérifier que le projet compile :

```bash
pnpm build
```

(`pnpm build` crée un dossier `dist/`, qui n'est pas livré.)

### Démonstration de l'état vide

Le jeu de données ne produit jamais de liste vide avec le seul filtre de groupe. Pour voir l'état vide, ouvrir l'application avec `?demo=empty` à la fin de l'adresse, par exemple :

```
http://localhost:5174/?demo=empty
```

Un bandeau « Mode démo » s'affiche et la liste est vide. Le lien « Quitter la démo » revient à la liste normale.

### Fichiers de F3

| Fichier | Rôle |
|---|---|
| `index.html` | page unique (`lang="fr"`, balise viewport) |
| `src/main.jsx` | démarre React et charge le CSS |
| `src/index.css` | `@import "tailwindcss"` |
| `src/App.jsx` | état (groupe, détail ouvert), retour du focus |
| `src/data.js` | séances, formateurs, `filterSessions` |
| `src/format.js` | formatage de la date et de la période |
| `src/Badge.jsx`, `StatusBadge.jsx`, `DomainBadge.jsx` | badges réutilisables |
| `src/SessionCard.jsx` | carte d'une séance |
| `src/GroupFilter.jsx` | filtre de groupe |
| `src/SessionDetail.jsx` | détail dans un `<dialog>` modal |
| `src/EmptyState.jsx` | message de liste vide |

### Tests

F3 n'a pas de tests automatisés (le sujet ne les impose pas pour ce module). Les tests front demandés sont dans F2.

---

## Ports

- **F2** : aucun (les tests tournent dans le terminal, sans serveur).
- **F3** : 5173 par défaut, 5174 chez moi (voir plus haut). Utiliser l'adresse affichée par `pnpm dev`.

## Variables d'environnement et données factices

- Aucune variable d'environnement n'est nécessaire.
- Aucun secret, aucune clé d'API, aucune donnée personnelle.
- Toutes les données sont **fictives** : les 6 séances du sujet et les formateurs « Camille Exemple », « Alex Démonstration » et « Sam Fictif ».
- F2 : le serveur est simulé avec `vi.fn` et des promesses contrôlées (aucun appel réseau). F3 : les données sont en mémoire dans `src/data.js`.

---

## Limites

**F2**
- `user.selectOptions` simule le choix d'une option, mais jsdom ne simule pas les flèches du clavier sur un `<select>`. Seul le focus avec Tab est testé.
- Le test « réponses dans le désordre » attend 20 ms réelles (`setTimeout`).
- Les tests utilisent un faux serveur, pas un vrai réseau, et ne testent pas l'aspect visuel (CSS).
- Le message d'erreur du composant est générique.
- La correction de la race condition ignore la réponse tardive mais n'annule pas la requête côté serveur.

**F3**
- Pas testé avec un vrai lecteur d'écran, seulement avec le clavier et dans un navigateur de type Chromium sous Windows.
- Les captures 360 px et 1280 px viennent de l'émulation d'appareil du navigateur, pas d'un vrai téléphone.
- Le contraste est mesuré pour les badges et la date uniquement.
- La démo de l'état vide passe par un paramètre d'adresse.
- Données en mémoire : pas de serveur, pas de base de données.

## Usage de l'IA

L'IA a été utilisée pour m'accompagner sur ce rattrapage. Le détail (outil, usages, fichiers, ce que j'ai vérifié et corrigé) est dans `SOURCES_IA.md`.
