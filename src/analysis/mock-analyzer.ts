import type { AnalysisInput, AnalysisResult, Observation, WellnessSignal } from './types';

/**
 * Placeholder analyzer for Phase 0.
 *
 * It does NOT look at pixels or detect anything. It returns a fixed, clearly
 * labelled *illustrative* result so we can build and review the whole capture ->
 * results -> education flow, the consent/disclaimer surfaces, and the privacy
 * model before any real medical inference exists. Every result is flagged
 * `isDemo: true`.
 *
 * When a real model arrives it implements the same `OralAnalyzer` interface and
 * this file can be deleted or kept for tests/storybook.
 */

const SAMPLE_OBSERVATIONS: Observation[] = [
  {
    id: 'obs-plaque',
    title: 'Possible plaque along the gumline',
    summary: 'A soft, pale film can appear where teeth meet the gums.',
    level: 'informational',
    category: 'hygiene',
    confidence: 0.55,
    whatItMeans:
      'Plaque is a normal, everyday build-up of bacteria. Left in place it can irritate gums over time.',
    whatToDo:
      'Brush twice daily and clean between your teeth. A routine dental cleaning removes what brushing cannot.',
    learnMoreSlug: 'daily-care',
  },
  {
    id: 'obs-gum-redness',
    title: 'Some gum redness to keep an eye on',
    summary: 'Gums that look red or slightly swollen can be a sign of early irritation.',
    level: 'monitor',
    category: 'gums',
    confidence: 0.48,
    whatItMeans:
      'Redness and puffiness are often linked to early gum inflammation (gingivitis), which is common and usually reversible.',
    whatToDo:
      'Improve daily cleaning and mention it at your next dental visit. If gums bleed often or stay sore, book a checkup sooner.',
    learnMoreSlug: 'gum-health',
  },
  {
    id: 'obs-discoloration',
    title: 'Noticeable tooth staining',
    summary: 'Some surfaces look darker or more yellow than others.',
    level: 'informational',
    category: 'teeth',
    confidence: 0.6,
    whatItMeans:
      'Staining is often cosmetic and linked to food, drinks (coffee, tea), or smoking — but can sometimes sit alongside other issues.',
    whatToDo:
      'A dentist can tell surface staining apart from things that need treatment, and advise on safe whitening options.',
    learnMoreSlug: 'daily-care',
  },
  {
    id: 'obs-soft-tissue',
    title: 'An area worth having checked',
    summary: 'A patch of soft tissue looks a little different from what surrounds it.',
    level: 'seek-care',
    category: 'soft-tissue',
    confidence: 0.31,
    whatItMeans:
      'Most such areas are harmless (for example a bitten cheek or a canker sore). Occasionally, changes that do not heal deserve a professional look.',
    whatToDo:
      'If any sore, lump, or red/white patch lasts longer than two weeks, have a dentist or doctor examine it. Do not wait if you are worried.',
    learnMoreSlug: 'early-changes',
  },
];

const SAMPLE_WELLNESS: WellnessSignal[] = [
  {
    id: 'well-gum-heart',
    label: 'Gum health is linked to whole-body health',
    status: 'room-to-improve',
    explanation:
      'Ongoing gum inflammation is associated in population studies with conditions like heart disease and diabetes. Caring for your gums is one lever for overall wellbeing.',
    evidenceNote:
      'This is a general association across large groups of people — not a prediction about you.',
  },
  {
    id: 'well-daily-care',
    label: 'Daily habits add up over a lifetime',
    status: 'supportive',
    explanation:
      'Consistent brushing, cleaning between teeth, and limiting sugary drinks support both your mouth and your general health as you age.',
    evidenceNote: 'Reflects widely accepted preventive-care guidance.',
  },
  {
    id: 'well-checkups',
    label: 'Regular checkups catch things early',
    status: 'neutral',
    explanation:
      'Seeing a dental professional on a regular schedule is the most reliable way to catch problems while they are small and easy to treat.',
    evidenceNote: 'Early detection consistently improves outcomes.',
  },
];

function makeId(): string {
  return `scan-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function runMockAnalysis(input: AnalysisInput): Promise<AnalysisResult> {
  // Simulate a short "processing" delay so the UX matches a real pipeline.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    id: makeId(),
    createdAt: new Date(input.capturedAt).toISOString(),
    source: 'mock',
    isDemo: true,
    summary:
      'Here are some illustrative observations. This is a demo and not a real analysis of your photo.',
    observations: SAMPLE_OBSERVATIONS,
    wellness: SAMPLE_WELLNESS,
    nextSteps: [
      'Treat this as an educational prompt, not a diagnosis.',
      'Share anything that concerns you with a dentist or doctor.',
      'Keep up daily cleaning and routine dental checkups.',
    ],
  };
}
