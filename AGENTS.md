# AGENTS.md

## Cursor Cloud specific instructions

### What this is
`oral-health-companion` — an **Expo SDK 57 / React Native 0.86 (React 19)** app using Expo Router
(file-based, typed routes). It is a **single client-side app**: no backend, no database, no
environment variables, and no secrets. Standard commands and architecture are documented in
`README.md`; scripts live in `package.json`.

### Running / demoing in the cloud VM
- There is no iOS/Android simulator here, so use the **web target** to run and verify:
  `npm run web` serves the app at `http://localhost:8081`.
- The **first page load is slow (~10–30s)**: Metro bundles on demand on the first request. A blank
  page or a hanging request at first is normal — wait before assuming failure.
- Node 22 is required (matches CI in `.github/workflows/ci.yml`).

### App-flow gotchas when testing on web
- **Consent gate:** first run shows a "Before you start" screen; you must check all four
  acknowledgement checkboxes and press "I understand — continue" before the rest of the app is
  reachable. Consent is persisted (AsyncStorage → `localStorage` on web), so to re-test the
  first-run flow you must clear site data / use a fresh browser profile.
- **Camera capture** ("Scan my mouth") needs a real device/simulator camera and will not work
  headless on web. For functional web verification use the consent flow, home dashboard, the
  **Learn** education library, and **About & safety** screens instead.

### Tooling side-effect to watch for
Running `expo start` / `expo export` **regenerates `expo-env.d.ts` and appends an `expo-cli` block
to `.gitignore`**, which conflicts with this repo's intentional setup (it deliberately commits
`expo-env.d.ts` so `tsc`/CI type-check without booting Expo). Do **not** commit those regenerated
changes — revert them with `git checkout -- .gitignore expo-env.d.ts` before committing.

### Note on repository layout
As of this writing the product code lives on the `cursor/oral-health-app-phase0-c437` branch; the
`main` branch contains only a placeholder `README.md`. Work from a branch that contains the app code.
