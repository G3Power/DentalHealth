/**
 * Educational content library.
 *
 * Written to be accurate and non-alarming. It uses associational language
 * ("linked to", "associated with") rather than causal or diagnostic claims,
 * and consistently routes readers to professional care. Content is data (not
 * hard-coded in screens) so it can be reviewed and edited independently.
 */

export interface EducationSection {
  heading?: string;
  body: string;
}

export interface EducationArticle {
  slug: string;
  title: string;
  summary: string;
  readMinutes: number;
  sections: EducationSection[];
}

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    slug: 'mouth-body-connection',
    title: 'How your mouth mirrors your health',
    summary:
      'The mouth is a window into whole-body wellbeing. Here is what that does — and does not — mean.',
    readMinutes: 4,
    sections: [
      {
        body:
          'Your mouth is connected to the rest of your body, so it often shows early, visible signs of how things are going overall. That is the honest kernel behind the idea that "the mouth reflects your health."',
      },
      {
        heading: 'What the science supports',
        body:
          'Long-running gum inflammation (periodontal disease) is associated in large population studies with conditions such as heart disease, diabetes, and complications in pregnancy. Some nutritional issues and infections can also show up as changes in the mouth. Caring for your mouth is a meaningful part of caring for your whole body.',
      },
      {
        heading: 'What it does not mean',
        body:
          'A photo of your mouth cannot predict how long you will live, and no responsible tool should claim to. These are broad associations across many people, not a forecast about any individual. We deliberately frame this as "healthy-aging habits and awareness," not a longevity score.',
      },
      {
        heading: 'The useful takeaway',
        body:
          'Small, consistent habits — cleaning well, eating and drinking thoughtfully, avoiding tobacco, and seeing a professional regularly — support both your mouth and your long-term health.',
      },
    ],
  },
  {
    slug: 'gum-health',
    title: 'Gums: the foundation',
    summary: 'Red, swollen, or bleeding gums are common — and usually reversible when caught early.',
    readMinutes: 3,
    sections: [
      {
        body:
          'Healthy gums are firm and do not bleed with normal brushing. When plaque builds up along the gumline, gums can become red, puffy, and bleed easily — a common and early stage called gingivitis.',
      },
      {
        heading: 'Why it matters',
        body:
          'Gingivitis is usually reversible with good daily cleaning and a professional cleaning. If it is left to progress, it can advance to periodontitis, which affects the deeper support around teeth and can lead to tooth loss.',
      },
      {
        heading: 'What helps',
        body:
          'Brush twice a day, clean between your teeth daily, and keep regular dental visits. If your gums bleed often, stay sore, or your teeth feel loose, see a dental professional.',
      },
    ],
  },
  {
    slug: 'early-changes',
    title: 'Spotting changes early',
    summary: 'Most mouth sores are harmless. Knowing the simple "two-week rule" helps you act on the ones that are not.',
    readMinutes: 4,
    sections: [
      {
        body:
          'Canker sores, bitten cheeks, and irritation from braces or dentures are everyday things that heal on their own. The goal here is not to worry you — it is to help you notice the small number of changes that deserve a professional look.',
      },
      {
        heading: 'The two-week rule',
        body:
          'If a sore, ulcer, lump, or a red or white patch does not heal within about two weeks, have a dentist or doctor examine it. Persistent changes are worth checking even when they do not hurt.',
      },
      {
        heading: 'Things professionals look at',
        body:
          'Ongoing risk factors include tobacco in any form, heavy alcohol use (especially combined with tobacco), and sun exposure for the lips. Early professional evaluation is the single most reliable way to keep small issues small.',
      },
      {
        heading: 'A note on this app',
        body:
          'This tool cannot tell you whether something is serious. It can only encourage you to notice changes and to get anything persistent checked in person.',
      },
    ],
  },
  {
    slug: 'daily-care',
    title: 'Everyday care that works',
    summary: 'The unglamorous basics deliver almost all of the benefit.',
    readMinutes: 3,
    sections: [
      {
        heading: 'The essentials',
        body:
          'Brush twice a day with fluoride toothpaste, and clean between your teeth once a day. Spitting rather than rinsing after brushing keeps a little fluoride working for longer.',
      },
      {
        heading: 'Food and drink',
        body:
          'How often you have sugary foods and drinks matters more than the total amount. Frequent sipping of sweet or acidic drinks gives teeth little time to recover.',
      },
      {
        heading: 'Habits and checkups',
        body:
          'Avoiding tobacco and limiting alcohol protect your gums and soft tissue. Regular dental checkups catch problems while they are easy to treat.',
      },
    ],
  },
  {
    slug: 'how-it-works',
    title: 'What this app can and cannot do',
    summary: 'Being clear about scope is part of using any health tool safely.',
    readMinutes: 2,
    sections: [
      {
        heading: 'What it is',
        body:
          'An educational companion that helps you take a clear photo of your mouth, points out general things worth noticing, and teaches the connection between oral and overall health.',
      },
      {
        heading: 'What it is not',
        body:
          'It is not a diagnosis, not a screening test, and not a replacement for a professional. In this Phase 0 version the observations are illustrative examples — the app is not yet analysing your actual photo.',
      },
      {
        heading: 'Using it well',
        body:
          'Let it prompt good habits and good questions for your next dental visit. For anything that concerns you, see a professional in person.',
      },
    ],
  },
];

export function getArticle(slug: string): EducationArticle | undefined {
  return EDUCATION_ARTICLES.find((article) => article.slug === slug);
}
