import { ar } from '../../i18n/ar';

export function Button() {
  // (أ) a hardcoded Arabic string AND (د) a direct dictionary import — both
  // bypass the copy contract: the string lives outside the dictionary, and
  // the `ar` read sits below the host app's overrideTexts (3ج.1).
  const label = ar['button.saveMovement'].text;
  const title = 'احفظ الحركة';
  return <button title={title}>{label}</button>;
}
