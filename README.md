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
    present.ts         # level/status -> label + theme color (exhaustive)
  capture/quality.ts   # on-device image quality gate (pluggable)
  content/             # disclaimers + education content (data, not hard-coded)
  state/               # consent (persisted) + scan store (in-memory)
  components/          # themed UI + result cards
```

### Swapping in a real analyzer (Phase 1+)

No screen imports a concrete analyzer — they all call `getAnalyzer()`. To add a real
on-device or server model, implement the `OralAnalyzer` interface and register it:

```ts
import { setAnalyzer, type OralAnalyzer } from '@/analysis/analyzer';

const onDeviceAnalyzer: OralAnalyzer = {
  source: 'on-device',
  isDemo: false,
  async analyze(input) {
    /* run a TFLite / ONNX / Core ML model on input.imageUri and map to AnalysisResult */
  },
};

setAnalyzer(onDeviceAnalyzer);
```

The image-quality gate (`src/capture/quality.ts`) is the other seam: Phase 0 does a real
minimum-resolution check and leaves lighting / blur / mouth-presence detection as
documented `QualityIssue` codes to implement next.

## Regulatory posture (why the wording is careful)

An app that *diagnoses/detects disease* is likely a regulated medical device (FDA SaMD in
the US, CE/MDR in the EU). Phase 0 is intentionally an **educational / wellness** tool that
reports observations and routes to professionals — not a diagnostic claim. Any move toward
true detection (especially higher-stakes screening) should be planned with clinical
validation and the appropriate regulatory pathway.

## Roadmap

- **Phase 0 (this):** capture UX, consent/disclaimers, privacy model, education, mock
  results behind a clean analyzer interface.
- **Phase 1:** narrow, lower-risk *visible* indicators framed as observations, with
  responsibly sourced data and real quality checks.
- **Phase 2:** higher-stakes screening only with clinical partners, validated data, and a
  regulatory pathway.
