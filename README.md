# ML Visual Study Companion

An interactive **80/20 Machine Learning** visual study web application in **English & Burmese (မြန်မာ)**, featuring an interactive core ML flowchart, Recharts data visualizations, an AI Visual Tutor (powered by Gemini or OpenRouter), and a local Review Deck of flashcards.

## Features

- **⭐ Must-Know ML Core**: Step-by-step interactive flowchart covering essential ML concepts with English/Burmese toggle, analogies, key vocabulary, textbook/YouTube references, and interactive **Recharts** visualizations.
- **🤖 AI Visual Tutor**: Ask any ML question and get structured visual explanations, Burmese analogies, step-by-step breakdowns, and vocabulary—with support for **Google Gemini** and **OpenRouter** APIs.
- **📌 Review Deck**: Save core lessons or AI Tutor responses as flashcards stored in browser `localStorage` for quick review.
- **🌐 Bilingual UI**: Switch seamlessly between English (`EN`) and Burmese (`မြန်မာ`) from the top navigation bar.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Material UI (MUI)** + **Tailwind CSS** + **Lucide React**
- **Recharts** for interactive ML visualizations
- **Zod** for schema validation
- **Jest** + **React Testing Library** for unit & component tests

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation & Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Run Jest tests
npm test

# Typecheck
npm run typecheck

# Build for production
npm run build
```

## Adding Your Gemini or OpenRouter API Key in the UI

The **AI Visual Tutor** runs directly from your browser using your own API key (stored only in your browser's `localStorage`):

1. Click the **Settings (⚙️)** icon in the top-right corner of the header to open **AI Tutor API Settings**.
2. Choose your preferred provider: **Gemini** or **OpenRouter**.
3. Paste your API key and select or enter your preferred model (e.g., `gemini-2.5-flash` for Gemini or `google/gemini-2.5-flash` for OpenRouter).
4. Click **Save** — your key is saved locally in `localStorage` and never sent to any server other than your chosen AI provider.

## Deployment (GitHub Pages)

This project is configured with `base: '/Machine-Learnign/'` in `vite.config.ts` and uses `gh-pages`:

```bash
npm run deploy
```

This runs `npm run build` (`predeploy`) and publishes the `dist` folder to the `gh-pages` branch.
