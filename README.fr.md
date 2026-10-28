# Claude ne fait que coder (`just-code-claude`)

<p align="center">
  <b>Claude écrit le code. Gemini écrit le texte.</b><br>
  Compétence automatisée pour séparer la logique d'ingénierie de la génération de texte en langage naturel.
</p>

<p align="center">
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

> **"Claude writes code. Gemini writes text."**  
> Une compétence open source pour Claude Code : Claude gère l'architecture et la logique du code, tandis qu'il délègue la documentation, les README, **les messages de commit Git, les descriptions de PR, les notes de version GitHub Releases** et les textes d'interface utilisateur à **Google Gemini** (`3.8 flash` ou `4 argon`, avec contrôle de l'effort de raisonnement) via l'**API REST Google Gemini** ou la **CLI Antigravity (`agy`)**.

---

## ⚖️ Comparaison Avant vs Après (Before vs After Showcase)

### Scénario 1 : Développement de composants UI Frontend
- **❌ Avant (Claude Code standard)** : La fenêtre de chat est inondée de longues explications et de bavardages superflus, augmentant la latence. Le code contient des textes de remplacement mécaniques et génériques (`"Session Expiring"`, `"Please click OK"`).
- **✅ Après (`just-code-claude`)** : Zéro texte conversationnel, **livraison immédiate de code propre et optimisé**. Gemini 3.8 flash remplace les textes par des rédactions professionnelles à fort impact (`"Session Expiring in 5 Minutes"`). Économie de plus de 50 % de tokens de contexte.

### Scénario 2 : Commits Git et Releases GitHub
- **❌ Avant** : Commits flous (`"update files"`) ou synthèses fragiles et incomplètes dans le chat.
- **✅ Après** : Gemini 3.8 flash génère des messages Conventional Commits parfaits ; Gemini 4 argon synthétise les commits et publie directement la version officielle sur GitHub via `gh release create`.

---

## 📊 Efficacité des Tokens et Analyse des Performances

| Métrique | Claude Code Standard | Avec `just-code-claude` | Bénéfice |
| :--- | :--- | :--- | :--- |
| **Consommation de Tokens de Session** | ~3 500 tokens (avec explications) | ~1 600 tokens (code pur) | **📉 Économie de ~54%** |
| **Vitesse de Réponse (Latence)** | ~18.2s (saisie de texte long) | ~7.8s (code immédiat) | **⚡ ~2.3x Plus Rapide** |
| **Localisation Multilingue i18n** | Pollue le contexte principal | Traitement par lot via CLI hors bande | **📉 >70% Économie de Tokens** |
| **Qualité Rédactionnelle UX** | Textes génériques (`"Error"`) | Gemini 4 argon / 3.8 flash | **✨ Qualité Production Immédiate** |
| **Synthèse des Changelogs** | Simple liste de commits | Analyse approfondie et guide de migration | **🚀 Releases de Niveau Entreprise** |

---

## 🛡️ Politique d'Exceptions pour Cas Limites (Sécurité et Alertes Critiques)

Bannir totalement le langage naturel risquerait de masquer des contraintes d'exécution ou des alertes de sécurité majeures. C'est pourquoi **3 exceptions strictes** sont autorisées :

1. **Alertes Critiques de Système et Sécurité (Max 1 à 2 lignes)** :
   - En cas d'erreur bloquante fatale, de clé manquante (`GEMINI_API_KEY`) ou d'opération destructrice, Claude DOIT émettre un avertissement :
     `> [!CRITICAL] Variable GEMINI_API_KEY manquante. Définissez-la avant de continuer.`
2. **Commentaires Techniques dans le Code (1 ligne)** :
   - Les commentaires courts expliquant des invariants algorithmiques, des verrous de concurrence ou des regex complexes (`// Concurrency: verrou atomique requis pour éviter les race conditions`) sont permis.
3. **Diagnostics et Sorties de Commandes** :
   - Le renvoi textuel brut des erreurs du compilateur, des codes de retour CLI ou des traces stderr est totalement autorisé.

---

## ⚙️ Guide de Configuration pour Claude Code

1. **Installation Globale (Recommandée)** : Exécutez `npx just-code-claude` ou `.\install.ps1` (Linux/macOS : `bash install.sh`) pour configurer automatiquement `~/.claude/rules/just-code-claude.md` et `~/.claude/CLAUDE.md`.
2. **Configuration par Projet** : Copiez `rules/just-code-claude.md` dans `.claude/rules/` au sein de votre dépôt.
3. **Déclenchement en Session** : Tapez `/just-code-claude` ou indiquez : *"Utilise 3.8 flash high pour rédiger les textes et les releases"*.

---

## 🤖 Modèles Supportés et Effort de Raisonnement

| Modèle | Alias CLI | Cas d'Utilisation Principal | Effort Recommandé |
| :--- | :--- | :--- | :--- |
| **`3.8 flash`** *(Par défaut)* | `3.8 flash`, `flash`, `gemini-3.8-flash` | UI copy ultra-rapide, boutons, modales, messages de commit | `low` ou `medium` |
| **`4 argon`** | `4 argon`, `argon`, `gemini-4-argon` | Raisonnement approfondi, architecture système, descriptions de PR, GitHub Releases | `high` ou `max` |

---

## 🐙 Intégration Git & GitHub (Commits, PRs & Releases)

> [!IMPORTANT]
> **Comportement de Claude Code lors des Releases**:  
> Lorsque l'utilisateur demande à Claude Code de *"publier la release v1.2.0"* ou de *"créer une release GitHub"*, Claude Code NE rédige PAS les notes de version avec son propre LLM.  
> Conformément à `~/.claude/rules/just-code-claude.md`, Claude Code extrait l'historique Git et délègue la rédaction à Gemini **`4 argon`** (effort `high`), puis publie la version via GitHub CLI (`gh release create`).

### 1. Commit automatique en une seule commande (`--commit`)
```bash
just-code-claude --commit -m "3.8 flash" -e medium -p "Context: Implémentation du modal MFA et de l'actualisation de token" -l French
```

### 2. Prévisualisation du message de commit (`--commit-msg`)
```bash
just-code-claude --commit-msg -m "3.8 flash" -e medium -p "Context: Correction d'une race condition sur WebSocket heartbeat" -l French
```

### 3. Description complète de GitHub PR (`--pr-desc`)
```bash
just-code-claude --pr-desc -m "4 argon" -e high -p "Context: Migration du state management de Redux vers Zustand" -o PULL_REQUEST.md -l French
```

### 4. Notes de version GitHub Releases et publication (`--release-notes`, `--release [tag]`)
```bash
# Générer les notes de version
just-code-claude --release-notes -m "4 argon" -e high -p "Context: Version v1.2.0" -o RELEASE_NOTES.md -l French

# Publier la release sur GitHub
just-code-claude --release v1.2.0 -m "4 argon" -e high -l French
```

---

## 🛠 Référence CLI

```bash
# Remplacement de texte in-code avec 3.8 flash
node scripts/agy_call.js --replace-in-file src/components/Login.tsx -m "3.8 flash" -e medium -l French

# Génération de documentation technique avec 4 argon
node scripts/agy_call.js -m "4 argon" -e high -p "Rédige le guide d'architecture des microservices" -o docs/ARCH.md -l French

# Créer un commit automatiquement
node scripts/agy_call.js --commit -m "3.8 flash" -e medium -l French

# Publier une release GitHub
node scripts/agy_call.js --release v1.2.0 -m "4 argon" -e high -l French
```

---

## 📄 Licence

Ce projet est distribué sous la [Licence MIT](LICENSE).
