/**
 * SupplierHeader.states.ts — the component's axis (BATCH2-SPECS §5.4):
 * plain, approved, loading.
 */
export const SupplierHeaderStates = ['plain', 'approved', 'loading'] as const;

export type SupplierHeaderStateId = (typeof SupplierHeaderStates)[number];
