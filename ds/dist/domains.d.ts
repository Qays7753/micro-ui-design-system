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
export * from './components/TransferRow';
export * from './components/FundCard';
export * from './components/DebtCard';
export * from './components/DebtSummary';
export * from './components/PaymentProgress';
export * from './components/OrderCard';
export * from './components/WeekStrip';
export * from './components/DayTimeline';
export * from './components/AgendaList';
export * from './components/SlotPicker';
export * from './components/StatusTrack';
export * from './components/DeliveryRequestCard';
export * from './components/QuoteCard';
export * from './components/JobTrack';
export * from './components/IssueProposalCard';
export * from './components/ContactBar';
export * from './components/EvidenceSlot';
export * from './components/LocationSlot';
export * from './components/DriverJobCard';
export * from './components/DriverApprovalStatus';
export * from './components/ListingCard';
export * from './components/Gallery';
export * from './components/PriceTierTable';
export * from './components/SupplierHeader';
export * from './components/ReportSheet';
export * from './components/ListingEditor';
export * from './components/ListingStatusBadge';
