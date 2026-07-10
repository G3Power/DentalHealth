# Oral Health Companion

An educational mobile app that helps someone take a guided photo of their own mouth,
surfaces **general, non-diagnostic observations**, and teaches how oral health connects
to whole-body wellbeing.

> **This is Phase 0.** The focus is getting the experience, safety, privacy, and
> architecture right *before* any real medical analysis exists. The current analysis
> engine is an illustrative **mock** — it does not look at your photo. Every result is
> clearly labelled as a demo.

## Important framing (please read)

- **Not a medical device / not a diagnosis.** It does not diagnose, treat, or rule out
  disease and is not a substitute for a dentist or doctor. This positioning is
  deliberate (see "Regulatory posture" below).
- **No "longevity" prediction.** The original idea of predicting lifespan from a mouth
  photo is not scientifically supportable and is intentionally **not** built. It is
  reframed as honest, education-first "mouth–body wellness" content about associations
  between oral and general health.
- **Privacy-first.** The captured photo stays on the device and is held in memory for
  the session only. Nothing is uploaded or persisted by default.

## Tech stack

- [Expo](https://expo.dev) SDK 57, React Native 0.86, React 19
- [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing, typed routes)
- `expo-camera` for capture, `@react-native-async-storage/async-storage` for consent state
- TypeScript (strict), ESLint (`eslint-config-expo`), React Compiler enabled

## Getting started

```bash
npm install
npm start          # Expo dev server (press i / a / w for iOS / Android / web)
```

Other scripts:

```bash
npm run web        # run in the browser
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # jest unit tests
npx expo export -p web   # produce a static web bundle (used for CI-style verification)
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, and the web bundle on every PR.

Camera capture requires a real device or simulator with a camera; the web build runs but
camera access depends on the browser.

## Architecture

```
src/
  app/                 # Expo Router screens
    _layout.tsx        # providers + Stack + consent gate
    index.tsx          # home / dashboard
    consent.tsx        # first-run acknowledgement (gated)
    capture.tsx        # guided camera capture + quality gate
    review.tsx         # confirm/retake the captured photo
    analyzing.tsx      # runs the analyzer, then routes to results
    results.tsx        # observations + wellness signals + next steps
    about.tsx          # full disclaimers, privacy, reset acknowledgement
    learn/             # education library (list + [slug] article)
  analysis/            # >>> the swap seam for real models <<<
    types.ts           # domain types (Observation, WellnessSignal, AnalysisResult)
    analyzer.ts        # OralAnalyzer interface + getAnalyzer()/setAnalyzer()
    mock-analyzer.ts   # Phase 0 illustrative implementation
    taxonomy.ts        # Phase 1 label set shared by data, model, and UI
    present.ts         # level/status -> label + theme color (exhaustive)
    model/             # on-device model seam: runner + pure score->result mapping
  capture/             # image-quality gate + platform pixel source
    quality.ts         # resolution (hard gate) + brightness/sharpness metrics
    luma.ts            # pure RGBA->luma + downscale helpers (tested)
    pixels.web.ts      # web pixel source (canvas readback); pixels.ts = native seam
  data/                # dataset manifest schema + validator + registry (both tracks)
  content/             # disclaimers, education, shared wellness signals (data)
  state/               # consent (persisted) + scan store (in-memory)
  components/          # themed UI + result cards
```

### Swapping in a real analyzer (Phase 1+)

No screen imports a concrete analyzer — they all call `getAnalyzer()`. The on-device model
seam is already scaffolded in `src/analysis/model/`: provide an `OralModelRunner` (wrapping a
TFLite / ONNX / Core ML model) and the pure `mapScoresToResult` turns per-indicator scores
into an `AnalysisResult` via the shared `taxonomy.ts`. Until a real model is bundled, the
default runner reports `isAvailable() === false`, so the app safely stays on the mock.

```ts
import { setAnalyzer } from '@/analysis/analyzer';
import { createModelAnalyzer, type OralModelRunner } from '@/analysis/model/model-analyzer';

const runner: OralModelRunner = {
  modelId: 'oral-v1',
  isAvailable: () => true,
  async run(input) {
    /* run the model on input.imageUri, return { 'gingival-inflammation': 0.72, ... } */
  },
};

setAnalyzer(createModelAnalyzer(runner));
```

The image-quality gate (`src/capture/quality.ts`) is the other seam, and its pixel source is
now wired. A platform module exposes one `extractLuma(uri)` contract: `pixels.web.ts` decodes
the captured photo via a downsampled canvas readback (active today), and `pixels.ts` is the
native seam that returns `null` until a decoder is added (Skia readback, a small native
module, or `expo-image-manipulator` + a JS decoder). Capture keeps **resolution** as the only
hard gate; when pixels are available it also runs `checkImageQualityDetailed`, and the
brightness/blur findings are surfaced as **non-blocking guidance** on the review screen so the
heuristic thresholds can be tuned on real captures without ever hard-rejecting a usable photo.
Mouth-presence detection is intentionally left to the Phase 1 model.

## Data sources (Phase 1)

We pursue **both** data tracks, modeled in `src/data/` and each described by a
`DatasetManifest` that records license, consent basis, provenance, label coverage, and
counts. `validateManifest` enforces governance rules so a source cannot be ingested without
the right paperwork:

- **`public`** — openly-licensed / research datasets, used to prototype and sanity-check the
  pipeline. Must carry a real license and citation.
- **`clinical-partner`** — data from a dental school / clinic. Must be **de-identified** and
  backed by a data-use agreement + IRB/ethics approval (an offline workstream) before any
  images are ingested.

`src/data/registry.ts` ships a template for each track (counts `0` until real data is
sourced). Both share the label set in `analysis/taxonomy.ts`.

## Regulatory posture (why the wording is careful)

**Initial target market: United States.** An app that *diagnoses/detects disease* is likely
a regulated medical device (FDA Software as a Medical Device). Phase 0/1 are intentionally an
**educational / wellness** tool that reports observations and routes to professionals — not a
diagnostic claim. Any move toward true detection (especially higher-stakes screening) should
be planned with clinical validation and an FDA pathway. The framing is centralized in
`src/content/disclaimers.ts` so it can be reviewed with legal/clinical advisors and expanded
for other markets (e.g. EU MDR) later.

### Phase 1 evaluation plan (before anything ships)

- Hold out a **test split** that never touches training; report per-indicator sensitivity /
  specificity and calibration, plus performance **across skin tones and demographics** (a
  health-equity requirement, not a nice-to-have).
- Keep humans in the loop: every result stays non-diagnostic and routes to a professional.
- Track quality-gate pass rates so we understand real-world capture conditions.

## Manual testing (device / browser)

The pure logic is covered by unit tests + CI, but the camera and the web canvas readback
must be exercised by hand. To make threshold tuning measurable, the review screen prints the
captured photo's **measured brightness/sharpness vs. the thresholds** — but only in
development (`__DEV__`), so it never appears in a production build.

**Run:** `npm run web` (browser, front camera) or `npm start` then open on a device.

**Capture mechanics**

- [ ] Camera permission prompt appears; deny → the permission screen explains + offers retry.
- [ ] Live preview shows; front/back flip works; the shutter is disabled until the camera is ready.
- [ ] A too-small capture is **blocked** with the retake alert (resolution is the only hard gate).

**Pixel source + advisory** (web today; native shows resolution-only until a decoder is wired)

- [ ] A normal, well-lit photo → **no** advisory on review; DEV readout shows `brightness ok` / `sharpness ok`.
- [ ] A deliberately dark photo → `too-dark` advisory, and you can **still continue** (non-blocking).
- [ ] A deliberately blurry/shaken photo → `too-blurry` advisory, still continues.
- [ ] Retake / Use-this-photo both route correctly; the photo thumbnail also shows on results.

**Threshold tuning**

- Read the DEV readout across ~10 real captures (good + intentionally bad). If good photos read
  `low`, or bad ones read `ok`, adjust `MIN_BRIGHTNESS` / `MIN_SHARPNESS` in `src/capture/quality.ts`.
- Note the values are computed on a luma buffer downsampled to `DEFAULT_MAX_LUMA_DIM` (128px),
  so tune against that, not the full-res photo.

## Roadmap

- **Phase 0:** capture UX, consent/disclaimers, privacy model, education, mock results behind
  a clean analyzer interface, plus tests + CI.
- **Phase 1 (foundations landed):** shared label taxonomy, on-device model seam (fail-safe,
  not yet active), dataset governance for both data tracks, real brightness/sharpness quality
  metrics, and a wired pixel source (web active; native seam ready). Remaining: source data,
  train/validate a model, a native pixel decoder, and the mouth-presence check.
- **Phase 2:** higher-stakes screening only with clinical partners, validated data, and a
  regulatory pathway.
