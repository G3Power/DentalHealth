/**
 * Single source of truth for safety, privacy, and scope copy.
 *
 * Keeping these strings centralized makes them easy to review with a
 * clinician / legal advisor and keeps wording consistent everywhere they
 * appear (onboarding, capture, results, about).
 */

export const APP_NAME = 'Oral Health Companion';

export const SHORT_BANNER = 'Educational only — not a medical diagnosis.';

export const NOT_A_DIAGNOSIS =
  `${APP_NAME} is an educational self-check aid. It does not diagnose, treat, or ` +
  `rule out any disease or condition, and it is not a substitute for a dentist, ` +
  `doctor, or other qualified professional. Always seek professional advice for ` +
  `any health concern, and never ignore professional advice because of something ` +
  `you saw in this app.`;

export const PRIVACY_SUMMARY =
  `Your photo is processed on your device for this demo. It is not uploaded to a ` +
  `server, shared, or stored beyond your current session unless you explicitly ` +
  `save it. You can delete anything at any time.`;

export const EMERGENCY_NOTE =
  `This app is not for emergencies. If you have severe pain, rapid swelling, ` +
  `difficulty breathing or swallowing, or bleeding that will not stop, contact ` +
  `your local emergency services right away.`;

export const SEEK_CARE_PROMPT =
  `As a general rule: if a sore, lump, or red or white patch in your mouth lasts ` +
  `longer than two weeks, have a dentist or doctor take a look.`;

/** Points the user actively acknowledges before using the tool. */
export const CONSENT_POINTS: string[] = [
  'I understand this app is educational and does not provide a medical diagnosis.',
  'I understand it does not replace seeing a dentist or doctor.',
  'I understand results in this version are illustrative and not a real analysis of my photo.',
  'I am taking a photo of myself (or someone who has agreed) for a personal self-check.',
];
