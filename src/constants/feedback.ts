/* Folioo 피드백 Google 폼 URL */
export const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfy8hyVhhXV-Z_uTleskSlSILYyfVDlAy_eO_ixFqjjzo6gew/viewform';

export function openFeedbackForm(): void {
  if (typeof window === 'undefined') return;
  window.open(FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer');
}
