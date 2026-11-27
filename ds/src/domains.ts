/**
 * domains.ts — public exports of the seven domain components (plan B,
 * stage 5; PLAN-B.md "your own files"). `src/index.ts` re-exports this
 * module with one linking line (`export * from './domains';`) so the
 * package surface stays a single flat list while agent-2's components
 * stay in their own file. Each domain's components are appended here in
 * their unit (B1 finance first). Until B1 lands the module is empty by
 * design — `export {}` keeps it a module for the index re-export.
 */
export * from './components/MovementRow';
export * from './components/PaymentProgress';
