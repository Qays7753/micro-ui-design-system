/**
 * domains/index.tsx — the lab pages of the seven domains (plan B, stage 5;
 * PLAN-B.md "your own files"). App.tsx imports this module with one line
 * and renders it as the domains wing of the catalog. Each domain file
 * exports its component sections (one per component, all states, every
 * example LIVE) plus its compose page.
 *
 * Structure contract (ds-registry / ds-lab-live / ds-states):
 * - every ds/src/components/<Name> folder of the domains appears here as a
 *   catalog section with id = kebab-case name, so ds-registry stays green;
 * - every interactive example owns real state — no onChange={() => {}};
 * - all words come from the package dictionary (ar-domains keys via t()).
 */
import type { ReactNode } from 'react';

export interface DomainSection {
  id: string;
  name: string;
  content: ReactNode;
}

/** The domains wing: one section per domain component + compose pages.
 *  Each domain file fills its rows as its units land (B1 first). */
import { financeSections } from './finance';
import { ordersSections } from './orders';

export const domainSections: DomainSection[] = [
  ...financeSections,
  ...ordersSections,
  // B1 finance — filled by finance.tsx
  // B2 orders & appointments — filled by orders.tsx
  // B3 delivery — filled by delivery.tsx
  // B4 market — filled by market.tsx
  // B5 review & admin — filled by review.tsx
  // B6 Ask Micro — filled by ask.tsx
  // B7 charts — filled by charts.tsx
];
