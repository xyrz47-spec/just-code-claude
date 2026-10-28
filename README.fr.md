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

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Target: Claude Code](https://img.shields.io/badge/Agent-Claude%20Code-7C3AED.svg)](https://github.com/xyrz47-spec/just-code-claude)
[![Powered by: Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4.svg)](https://aistudio.google.com/)

> **« Claude écrit le code. Gemini écrit les textes. »**  
> Une **compétence open source pour Claude Code** conçue pour séparer les tâches d'ingénierie : Claude se concentre sur l'architecture logicielle et la logique applicative, tout en déléguant les livrables en langage naturel (documentation, README, messages de commit et chaînes littérales entre guillemets `""`) à **Google Gemini** via l'**API REST Google Gemini** ou le **CLI Antigravity (`agy`)**.

---

## 📑 Table des Matières

- [Motivation et Philosophie de Conception](#-motivation-et-philosophie-de-conception)
- [Fonctionnement](#-fonctionnement)
- [Prérequis](#-prérequis)
- [Guide d'Installation](#-guide-dinstallation)
  - [Recommandé : Installation via `npx skills`](#recommandé--installation-via-npx-skills-skillssh)
  - [Alternative : Installation via Git Clone](#alternative--installation-via-git-clone)
- [Configuration et Moteurs d'Exécution](#-configuration-et-moteurs-dexécution)
  - [Moteur 1 : API REST Directe Google Gemini (Standard Universel)](#moteur-1--api-rest-directe-google-gemini-standard-universel)
  - [Moteur 2 : CLI Antigravity (`agy`)](#moteur-2--cli-antigravity-agy)
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

## 🌟 Motivation et Philosophie de Conception

Dans les flux de développement assistés par l'IA moderne, chaque modèle présente des atouts complémentaires :
- **Claude** excelle dans l'architecture logicielle complexe, la manipulation d'AST, le système de types TypeScript et le raisonnement algorithmique.
- **Google Gemini** offre une grande aisance multilingue, une formulation naturelle orientée utilisateur et une génération textuelle rapide.

`just-code-claude` combine ces capacités au travers d'un flux de travail structuré :

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
                   │                         (API Gemini ou CLI agy)
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

- **Périmètre de Claude** : Architecture de systèmes, logique, algorithmes, gestion d'état, typage, tests, correction de bogues et exécution d'outils.
- **Périmètre de Gemini** : Rédaction technique, documentation, notes de publication, messages de commit et chaînes littérales (`""` ou `''`) destinées aux utilisateurs.

> **Remarque sur le contrôle d'exécution** : Ce projet ne constitue pas un bac à sable au niveau du système d'exploitation ou du compilateur, mais une **directive d'instructions basée sur des prompts** (`SKILL.md`) guidant Claude Code à respecter méthodiquement cette répartition des rôles.

---

## ⚙️ Prérequis

Pour exécuter les outils de génération :

- **Environnement d'exécution** : [Node.js](https://nodejs.org) (v18+) ou [Python](https://python.org) (v3.8+).
- **Moteur d'exécution** (au choix) :
  1. **Clé d'API Google Gemini (Standard Universel)** : Obtenez une clé gratuite sur [Google AI Studio](https://aistudio.google.com/) et définissez la variable d'environnement `GEMINI_API_KEY`.
  2. **CLI Antigravity (`agy`)** : Si vous utilisez l'environnement Antigravity avec un CLI `agy` authentifié, il est automatiquement pris en charge sans configuration de clé additionnelle.

> **Zero Dependencies** : `scripts/agy_call.js` (utilisant `fetch` natif) et `scripts/agy_call.py` (utilisant `urllib.request`) ne possèdent **aucune dépendance externe**. Aucun `npm install` ou `pip install` n'est nécessaire.

---

## 📦 Guide d'Installation

### Recommandé : Installation via `npx skills` (skills.sh)

Utilisez l'outil standard ouvert [skills](https://skills.sh/) pour une installation sans clonage manuel :

```bash
# Installation globale pour Claude Code (Vérifié)
npx skills add xyrz47-spec/just-code-claude -g -a claude-code

# Ou installation uniquement dans le dépôt actuel
npx skills add xyrz47-spec/just-code-claude -a claude-code
```

---

### Alternative : Installation via Git Clone

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

Le script copie les fichiers de la compétence directement dans `~/.claude/skills/just-code-claude/`.

---

## 🔌 Configuration et Moteurs d'Exécution

Le script d'assistance gère deux moteurs avec détection automatique :

### Moteur 1 : API REST Directe Google Gemini (Standard Universel)
Recommandé pour la majorité des développeurs et les pipelines d'intégration continue (CI/CD) :
1. Obtenez une clé d'API sur [Google AI Studio](https://aistudio.google.com/).
2. Définissez la variable d'environnement :
   ```bash
   # Linux / macOS
   export GEMINI_API_KEY="votre-cle-api-ici"

   # Windows PowerShell
   $env:GEMINI_API_KEY="votre-cle-api-ici"
   ```
3. Modèle par défaut : `gemini-2.5-flash` (modifiable avec l'option `-m`).

### Moteur 2 : CLI Antigravity (`agy`)
Pour les utilisateurs travaillant dans l'environnement Antigravity :
- Détecté automatiquement si `agy` est présent dans le `PATH`.
- Utilise l'authentification locale du CLI Antigravity.
- Modèle par défaut : `gemini-3.8-flash-high` (modèle de l'environnement Antigravity).

---

## 🚀 Utilisation et Scénarios de Travail

### 1. Activer la Compétence dans Claude Code

Dans Claude Code, saisissez la commande :
```text
/just-code-claude
```
Ou avec une instruction directe :
```text
Active le mode just-code-claude. Tu écris le code et sa logique, et tu délègues l'ensemble des textes et de la documentation à Gemini.
```

---

### 2. Scénario : Remplacement de Chaînes dans le Code

#### Étape A : Claude écrit le code avec des balises d'attente
Claude implémente la logique applicative et l'arborescence, en intégrant les balises `__AGY__("instruction"[, "langue_cible"])` ou `__GEMINI__("instruction"[, "langue_cible"])` :

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

#### Étape B : Exécution de l'outil CLI
Claude lance la commande de remplacement :
```bash
node scripts/agy_call.js --replace-in-file src/components/SessionExpiryBanner.tsx
```
*(Ou en Python : `python scripts/agy_call.py --replace-in-file src/components/SessionExpiryBanner.tsx`)*

#### Étape C : Code final en production
Les balises sont immédiatement remplacées par les textes générés :
```tsx
// src/components/SessionExpiryBanner.tsx
import React from 'react';

export function SessionExpiryBanner({ onExtend }) {
  return (
    <div className="alert-box">
      <h3>"Votre session est sur le point d'expirer"</h3>
      <p>"Pour votre sécurité, vous serez automatiquement déconnecté dans 5 minutes en cas d'inactivité."</p>
      <button onClick={onExtend}>
        "Rester connecté"
      </button>
    </div>
  );
}
```

---

### 3. Scénario : Génération de Documentation et Markdown

Déléguez la rédaction technique à Gemini :

```bash
# Via l'API REST Gemini
node scripts/agy_call.js -p "Rédige un guide de démarrage rapide en français pour notre API REST" -b api -o docs/API_GUIDE.md

# Via le CLI agy (si disponible)
node scripts/agy_call.js -p "Rédige une présentation générale de l'architecture logicielle" -b agy -o ARCHITECTURE.md
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

Générez vos dictionnaires localisés :
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
  1. Direct Gemini API : Utilisé lorsque GEMINI_API_KEY est défini ou avec -b api.
  2. Antigravity CLI (agy) : Détecté automatiquement s'il est installé sur la machine.

Options :
  -p, --prompt <texte>         Texte de consigne direct pour la génération
  -f, --file <chemin>          Lire la consigne ou le contexte depuis un fichier
  -o, --output <chemin>        Écrire le résultat généré directement dans un fichier
  -b, --backend <mode>         Moteur d'exécution : 'auto' (par défaut), 'api' ou 'agy'
  -m, --model <nom>            Nom du modèle (par défaut api : gemini-2.5-flash, agy : gemini-3.8-flash-high)
  --api-key <clé>              Clé d'API Google Gemini (ou variable GEMINI_API_KEY)
  -l, --lang <langue>          Langue du texte généré (ex. English, Korean, Japanese, French, Spanish)
  -s, --system <texte>         Consignes système ajoutées en tête de prompt
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
├── SKILL.md                 # Définition de la compétence et consignes de travail pour Claude Code
├── README.md                # Documentation officielle en anglais
├── README.ko.md             # Documentation officielle en coréen
├── README.ja.md             # Documentation officielle en japonais
├── README.zh-CN.md          # Documentation officielle en chinois simplifié
├── README.es.md             # Documentation officielle en espagnol
├── README.fr.md             # Documentation officielle en français
├── README.de.md             # Documentation officielle en allemand
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
