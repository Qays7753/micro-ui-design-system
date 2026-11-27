/**
 * SearchField.types.ts — props of the section search (ADDENDUM §1.1, 23.18).
 *
 * Searching INSIDE one section above its list. NOT the general search
 * (that is Ask), and not in lists shorter than 6 items. NO error state
 * (§1.1-4) — a wrong query is «12 نتيجة», not a red field.
 */
import type { Ref } from 'react';

export interface SearchFieldProps {
  /** The accessible name (not rendered — the placeholder stands in, §1.1-8). */
  label: string;
  /** The guiding text: «ابحث في <اسم القسم>». */
  placeholder?: string;
  /** The query (controlled). */
  value?: string;
  /** Fires per keystroke. */
  onChange?: (value: string) => void;
  /** Disables the field. */
  disabled?: boolean;
  /** React 19 ref-as-prop on the root container. */
  ref?: Ref<HTMLDivElement>;
  /** Standard pass-throughs. */
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Arbitrary data attributes ride the root (the gates' data-ds-check). */
  [key: `data-${string}`]: string | number | boolean | undefined;
}
