# ZeroDebt — Context

## What this is

ZeroDebt ("Debt Manager AI") is a single-page Progressive Web App (PWA) for
tracking and paying down personal debt, built for a Thai-speaking audience
(UI copy is in Thai). It ships as one static `index.html` file — no backend,
no build step, no bundler. All data lives in the browser via IndexedDB.

## Repo layout

- `index.html` — the entire application: HTML, Tailwind config, CSS, and
  all JavaScript in inline `<script>`/`<style>` tags.
- `manifest.json` — PWA manifest (name, icons, start URL, install shortcuts).
- `sw.js` — service worker; network-first for navigation, cache-first for
  static assets, cache name `zerodebt-v1`.
- `icons/` — app icons (192px, 512px).
- `.github/workflows/deploy.yml` — deploys the repo root to GitHub Pages on
  every push to `main`.
- `.github/workflows/enable-pages.yml` — one-time helper to turn on GitHub
  Pages (Actions build type) and kick off the first deploy.

There is no `package.json`, no test suite, and no server-side code. The app
is served as static files from GitHub Pages at the `/ZeroDebt/` path (see
`start_url`/`scope` in `manifest.json` and the cache paths in `sw.js` —
these are hardcoded to that subpath).

## Architecture (inside `index.html`)

- `CONFIG` — IndexedDB name/version and object store names (`debts`,
  `transactions`).
- `DBManager` (class) — thin wrapper around IndexedDB for CRUD on the two
  stores.
- `AppState` — in-memory state: `debts`, `tx` (transactions), computed
  `metrics`, and Chart.js instances.
- `App` — top-level controller: wires up DOM event listeners (forms, modals,
  buttons), loads data, handles payments, import/export, and AI calls.
- `UIManager` — view switching, modals, rendering lists/charts.
- `AIService` — calls the Google Gemini API (`gemini-2.0-flash`) directly
  from the browser for: scanning payment slip images (OCR amount
  extraction) and a debt-advice chat feature. The API key is supplied by
  the user and stored in `localStorage` (`_gemini_api_key`) — it is **not**
  bundled with the app or stored server-side.
- `Confetti`, `Haptic` — small UI feedback helpers (celebration animation on
  payoff, haptic/click feedback).
- `generateId` — UUID generation (`crypto.randomUUID` with a fallback).

Data model:
- **Debt**: `id, name, category, interest_rate, initial_balance,
  current_balance, min_payment`.
- **Transaction**: `id, debt_id, amount_paid, date`.

External dependencies (loaded via CDN, no local install):
- Tailwind CSS (`cdn.tailwindcss.com`)
- Chart.js (`jsdelivr`)
- Google Gemini API (`generativelanguage.googleapis.com`) — only called if
  the user has entered their own API key.

## Conventions

- Everything stays in the single `index.html` file unless there's a strong
  reason to split it out (no build tooling exists to support multi-file
  JS/CSS today).
- Keep UI copy in Thai, consistent with the existing strings.
- Any change to deployed paths must stay consistent across
  `manifest.json` (`start_url`, `scope`), `sw.js` (`ASSETS` cache list),
  and the GitHub Pages workflow — they all assume the `/ZeroDebt/` subpath.
- No secrets should ever be committed; the Gemini API key is user-supplied
  and kept in `localStorage` only.

## Running / testing locally

No build step. Serve the directory with any static file server and open
it in a browser, e.g.:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/index.html`. Note the service worker and
manifest reference the `/ZeroDebt/` path, so some PWA-specific behavior
(install prompt, offline caching) is best verified once deployed to GitHub
Pages, or by serving from a matching subpath locally.
