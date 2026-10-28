# Just Code, Claude! 💻🚫✍️

<p align="left">
  <a href="README.md"><b>English</b></a> •
  <a href="README.ko.md"><b>한국어</b></a> •
  <a href="README.ja.md"><b>日本語</b></a> •
  <a href="README.zh-CN.md"><b>简体中文</b></a> •
  <a href="README.es.md"><b>Español</b></a> •
  <a href="README.fr.md"><b>Français</b></a> •
  <a href="README.de.md"><b>Deutsch</b></a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-7C3AED.svg)](https://anthropic.com)
[![Dual Backend](https://img.shields.io/badge/Backend-Antigravity%20CLI%20%7C%20Gemini%20API-4285F4.svg)](https://google.com)

> **« Claude écrit le code. Gemini écrit les textes. »**  
> Une **compétence dédiée pour Claude Code** qui impose une stricte division du travail : Claude gère l'architecture, les algorithmes et la logique du code, tout en déléguant 100 % de la génération des textes en langage naturel (documentation, README, messages de commit et chaînes littérales entre guillemets `""` dans le code) à **Google Gemini** via l'outil **CLI Antigravity (`agy`)** ou l'**API REST directe de Google Gemini**.

---

## 📑 Table des Matières

- [Pourquoi just-code-claude ?](#-pourquoi-just-code-claude-)
- [Fonctionnement](#-fonctionnement)
- [Prérequis](#-prérequis)
- [Guide d'Installation](#-guide-dinstallation)
  - [Méthode 1 : Compétence Globale Claude Code (Recommandé)](#méthode-1--compétence-globale-claude-code-recommandé)
  - [Méthode 2 : Compétence au Niveau du Projet](#méthode-2--compétence-au-niveau-du-projet)
- [Configuration et Moteurs d'Exécution](#-configuration-et-moteurs-dexécution)
  - [Backend 1 : CLI Antigravity (`agy`)](#backend-1--cli-antigravity-agy)
  - [Backend 2 : API REST Directe Google Gemini](#backend-2--api-rest-directe-google-gemini)
- [Utilisation et Scénarios de Travail](#-utilisation-et-scénarios-de-travail)
  - [1. Activer la Compétence dans Claude Code](#1-activer-la-compétence-dans-claude-code)
  - [2. Scénario : Remplacement de Chaînes dans le Code](#2-scénario--remplacement-de-chaînes-dans-le-code)
  - [3. Scénario : Génération de Documentation et Markdown](#3-scénario--génération-de-documentation-et-markdown)
  - [4. Scénario : Traduction et Localisation par Lots (i18n)](#4-scénario--traduction-et-localisation-par-lots-i18n)
  - [5. Scénario : Messages de Commit et PR Git](#5-scénario--messages-de-commit-et-pr-git)
- [Référence des Commandes CLI](#-référence-des-commandes-cli)
- [Vérification et Tests](#-vérification-et-tests)
- [Structure du Dépôt](#-structure-du-dépôt)
- [Licence](#-licence)

---

## 🌟 Pourquoi `just-code-claude` ?

Claude compte parmi les modèles d'IA de programmation les plus performants : excellent en architecture logicielle, gestion d'états complexes, manipulation d'AST et conception typée. Toutefois, de nombreux développeurs privilégient **Google Gemini** pour la rédaction de textes fluides, d'explications soignées, de messages d'erreur empathiques et de documentation technique.

`just-code-claude` formalise cette complémentarité au travers d'un flux de travail automatisé :

```
                       ┌──────────────────────────────┐
                       │     Demande de l'utilisateur │
                       └──────────────┬───────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [ Logique & Architecture de Code ]     [ Langage Naturel & Rédaction ]
                   │                                     │
              Claude Code                           Google Gemini
                   │                       (via CLI agy ou API Gemini)
                   ▼                                     ▼
       Fonctions, Types, État, AST              Documentation, Boutons UI,
       & Balises d'attente (__AGY__)            Messages d'erreur & Alertes
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                       ┌──────────────────────────────┐
                       │     Code Final en Production │
                       └──────────────────────────────┘
```

- **Domaine de Claude** : Architecture de systèmes, logique, algorithmes, gestion d'état, typage, tests, correction de bogues et orchestration de scripts.
- **Domaine de Gemini** : Rédaction technique, documentation, notes de publication, messages de commit et chaînes textuelles entre guillemets (`""` ou `''`) destinées aux utilisateurs.

---

## ⚙️ Prérequis

Pour exécuter les outils de génération :

- **Environnement d'exécution** : [Node.js](https://nodejs.org) (v18+ conseillé) ou [Python](https://python.org) (v3.8+).
- **Moteur d'exécution** (au choix) :
  1. **CLI Antigravity (`agy`)** : S'il est installé et authentifié sur votre machine, il fonctionne immédiatement sans aucune clé d'API supplémentaire.
  2. **Clé d'API Google Gemini** : En l'absence d'`agy`, définissez simplement la variable d'environnement `GEMINI_API_KEY` (ou `GOOGLE_API_KEY`) obtenue sur [Google AI Studio](https://aistudio.google.com/).

> **Remarque** : `scripts/agy_call.js` et `scripts/agy_call.py` n'ont **aucune dépendance externe (Zero Dependencies)**. Ils reposent sur le `fetch` natif de Node.js et la bibliothèque standard `urllib.request` de Python, éliminant tout besoin de `npm install` ou `pip install`.

---

## 📦 Guide d'Installation

### Méthode 1 : Compétence Globale Claude Code (Recommandé)

L'installation globale rend `/just-code-claude` accessible dans **toutes** vos sessions Claude Code.

#### Sous Windows (PowerShell) :
```powershell
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
.\install.ps1
```

#### Sous Linux / macOS (Bash) :
```bash
git clone https://github.com/xyrz47-spec/just-code-claude.git
cd just-code-claude
bash install.sh
```

Le script déploie automatiquement les fichiers de la compétence dans `~/.claude/skills/just-code-claude/`.

---

### Méthode 2 : Compétence au Niveau du Projet

Si vous préférez restreindre l'utilisation à un dépôt spécifique :

```bash
mkdir -p .claude/skills/just-code-claude
cp -r path/to/just-code-claude/* .claude/skills/just-code-claude/
```

---

## 🔌 Configuration et Moteurs d'Exécution

`just-code-claude` propose une prise en charge **double moteur** avec détection automatique :

### Backend 1 : CLI Antigravity (`agy`)
Lorsque la CLI Antigravity est installée :
- Elle est détectée et exécutée en priorité.
- Aucune clé d'API requise.
- Utilise par défaut `--model gemini-3.8-flash-high` (possibilité d'indiquer `gemini-4-argon-high`).

### Backend 2 : API REST Directe Google Gemini
Idéal pour les appels cloud directs ou dans les environnements CI/CD dépourvus d'`agy` :
1. Obtenez une clé d'API sur [Google AI Studio](https://aistudio.google.com/).
2. Définissez la variable d'environnement :
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="votre-cle-api-ici"

   # Windows PowerShell
   $env:GEMINI_API_KEY="votre-cle-api-ici"
   ```
3. Vous pouvez également la transmettre en argument : `--api-key "votre-cle"`.
4. Utilise `gemini-2.5-flash` par défaut (modifiable via l'option `-m`).

---

## 🚀 Utilisation et Scénarios de Travail

### 1. Activer la Compétence dans Claude Code

Dans Claude Code, saisissez la commande :
```text
/just-code-claude
```
Ou avec une instruction en langage naturel :
```text
Active le mode just-code-claude. Tu écris le code et sa logique, et tu fais appel à agy pour rédiger l'ensemble des textes et des chaînes d'interface.
```

---

### 2. Scénario : Remplacement de Chaînes dans le Code

#### Étape A : Claude écrit le code avec des balises d'attente
Claude implémente la logique applicative et l'arborescence JSX/HTML, en intégrant les balises `__AGY__("instruction"[, "langue_cible"])` ou `__GEMINI__("instruction"[, "langue_cible"])` :

```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>__AGY__("Titre d'avertissement d'expiration imminente de session", "French")__</h3>
      <p>__AGY__("Message expliquant la déconnexion automatique dans 5 minutes et invitant à la prolonger", "French")__</p>
      <button onClick={onExtend}>
        __AGY__("Texte du bouton pour prolonger la session", "French")__
      </button>
    </div>
  );
}
```

#### Étape B : Exécution du script de remplacement automatique
Claude exécute l'outil en ligne de commande :
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(En Python : `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### Étape C : Code final en production
Toutes les balises sont instantanément remplacées sur place par les textes générés :
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"Votre session est sur le point d'expirer"</h3>
      <p>"Pour votre sécurité, vous serez automatiquement déconnecté dans 5 minutes. Veuillez prolonger votre session pour poursuivre votre activité."</p>
      <button onClick={onExtend}>
        "Prolonger la session"
      </button>
    </div>
  );
}
```

---

### 3. Scénario : Génération de Documentation et Markdown

Déléguez la rédaction de votre documentation technique à Gemini :

```bash
# Avec la CLI Antigravity (détection automatique)
node scripts/agy_call.js -p "Rédige un guide de démarrage rapide en français pour notre API REST" -o docs/API_GUIDE.md

# Avec l'API Gemini explicitement désignée
node scripts/agy_call.js -p "Rédige une présentation générale de l'architecture logicielle" -b api -o ARCHITECTURE.md

# Appel direct de la CLI agy
agy -p "Rédige la présentation du README du projet" --model gemini-3.8-flash-high --dangerously-skip-permissions > README.md
```

---

### 4. Scénario : Traduction et Localisation par Lots (i18n)

À partir d'un fichier de spécification `ui_spec.json` :
```json
{
  "auth": {
    "login_cta": "Bouton d'action principal pour se connecter",
    "forgot_password": "Lien d'aide pour réinitialiser le mot de passe",
    "password_hint": "Indication précisant que le mot de passe doit comporter au moins 8 caractères"
  }
}
```

Générez vos fichiers de dictionnaire traduits en une seule commande :
```bash
# Générer la version espagnole
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/es.json --lang Spanish

# Générer la version française
node scripts/agy_call.js --json-strings ui_spec.json -o src/locales/fr.json --lang French
```

---

### 5. Scénario : Messages de Commit et PR Git

Lors de la préparation de vos commits :

```bash
# 1. Capturer le diff indexé
git diff --staged > .git_diff.tmp

# 2. Demander à agy de composer le message selon la convention Conventional Commits
node scripts/agy_call.js -f .git_diff.tmp -p "Analyse ce diff et rédige un message Conventional Commits comprenant un titre de moins de 50 caractères et un corps explicatif. Langue : Français." -o .commit_msg.tmp

# 3. Réaliser le commit avec le texte produit
git commit -F .commit_msg.tmp
rm .git_diff.tmp .commit_msg.tmp
```

---

## 🛠 Référence des Commandes CLI

```text
Utilisation : node scripts/agy_call.js [options]
         ou : python scripts/agy_call.py [options]

Exécution Double Backend :
  1. Antigravity CLI (agy) : Détecté automatiquement s'il est installé sur la machine.
  2. Direct Gemini API : Utilisé automatiquement si GEMINI_API_KEY est défini ou si agy est introuvable.

Options :
  -p, --prompt <texte>         Texte de consigne direct pour la génération
  -f, --file <chemin>          Lire la consigne ou le contexte depuis un fichier
  -o, --output <chemin>        Écrire le résultat généré directement dans un fichier
  -b, --backend <mode>         Moteur d'exécution : 'auto' (par défaut), 'agy' ou 'api'
  -m, --model <nom>            Nom du modèle (par défaut pour agy : gemini-3.8-flash-high, pour api : gemini-2.5-flash)
  --api-key <clé>              Clé d'API Google Gemini (ou variable GEMINI_API_KEY)
  -l, --lang <langue>          Langue du texte généré (ex. English, Korean, Japanese, French, Spanish)
  -s, --system <texte>         Consignes de rôle système ajoutées en tête de prompt
  --effort <niveau>            Niveau de réflexion pour agy (low, medium, high)
  --replace-in-file <chemin>   Analyse le fichier de code pour détecter les balises __AGY__("...")
                               ou __GEMINI__("...") et les remplace directement sur place
  --json-strings <chemin>      Génère des textes à partir d'un fichier JSON associant clés et descriptions
  --raw                        Affiche uniquement le texte brut sans habillage
  -h, --help                   Affiche ce message d'aide
```

---

## 🧪 Vérification et Tests

Vérifiez le bon fonctionnement de la génération et du remplacement in-place :

```bash
npm test
# ou
node scripts/test_skill.js
```

---

## 📁 Structure du Dépôt

```
just-code-claude/
├── SKILL.md                 # Définition de la compétence et règles strictes de travail pour Claude Code
├── README.md                # Documentation officielle en anglais
├── README.ko.md             # Documentation officielle en coréen
├── README.ja.md             # Documentation officielle en japonais
├── README.zh-CN.md          # Documentation officielle en chinois simplifié
├── README.es.md             # Documentation officielle en espagnol
├── README.fr.md             # Documentation officielle en français
├── package.json             # Manifeste de package NPM
├── install.ps1              # Script d'installation PowerShell (Windows)
├── install.sh               # Script d'installation Bash (Linux/macOS)
├── scripts/
│   ├── agy_call.js          # Exécuteur Node.js double moteur (Zéro dépendance)
│   ├── agy_call.py          # Exécuteur Python double moteur (Bibliothèque standard uniquement)
│   └── test_skill.js        # Suite de tests d'intégration automatisés
├── examples/
│   ├── before_code.tsx      # Exemple de code intégrant les balises __AGY__
│   └── ui_spec.json         # Spécification d'exemple pour la localisation
└── templates/
    └── prompt_templates.md  # Modèles de prompts pour la rédaction UX et documentaire
```

---

## 📄 Licence

Ce projet est distribué sous les termes de la [Licence MIT](LICENSE).
