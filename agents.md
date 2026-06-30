# Agent Instructions for ZeroDebt

These instructions apply to the whole repository.

## Project shape

This is a static, no-build, single-file PWA. The entire app lives in
`index.html` (HTML + Tailwind config + CSS + vanilla JS, all inline).
There is no `npm install`, no bundler, and no test runner — don't add one
unless explicitly asked. See `context.md` for a full architecture overview
before making changes.

## Ground rules

- Keep the app a single static `index.html` plus `manifest.json` and
  `sw.js`. Don't introduce a build step, framework, or package manager
  unless the user explicitly asks for it.
- Preserve the `/ZeroDebt/` base path used by `manifest.json`
  (`start_url`, `scope`) and `sw.js` (`ASSETS`). If one changes, update all
  of them together, plus the GitHub Pages deploy workflow if relevant.
- UI text is in Thai — match the existing tone and terminology when adding
  or editing strings. Don't translate existing Thai copy to English.
- Data persistence is IndexedDB via `DBManager`/`CONFIG.stores`
  (`debts`, `transactions`). Don't add a backend or remote database.
- The Gemini API key is user-supplied and stored only in
  `localStorage` (`_gemini_api_key`). Never hardcode an API key, never log
  it, and never send it anywhere other than the Gemini endpoint already in
  `AIService`.
- Bump the service worker `CACHE` name (`zerodebt-v1` in `sw.js`) whenever
  you change cached assets, so installed PWAs pick up the update instead of
  serving stale files.

## Verifying changes

There is no automated test suite. To verify changes manually:

```
python3 -m http.server 8000
```

Open the app in a browser and exercise the relevant flow (adding a debt,
recording a payment, import/export, AI chat/slip scan if an API key is
set, dark mode, PWA install). For UI changes, actually click through the
flow in a browser before reporting the task done — don't rely on reading
the code alone.

## Git / PR workflow

- Develop on the assigned feature branch; don't push directly to `main`.
- `main` auto-deploys to GitHub Pages via `.github/workflows/deploy.yml` on
  every push — treat merges to `main` as a production deploy.
- Don't commit secrets (API keys, tokens) anywhere in the repo.
