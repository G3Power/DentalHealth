import type { WellnessSignal } from '@/analysis/types';

/**
 * General, education-first "mouth–body" wellness signals.
 *
 * These are population-level associations, NOT predictions about an individual
 * and NOT a lifespan/longevity score. They are shared by every analyzer (mock
 * and, later, real models) so the messaging stays consistent and reviewable.
 */
export const GENERAL_WELLNESS_SIGNALS: WellnessSignal[] = [
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
