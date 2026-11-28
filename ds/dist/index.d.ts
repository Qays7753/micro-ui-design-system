/**
 * @micro/ds — public entry (batch 1 foundations: tokens, fonts, icons,
 * Arabic i18n and shared logic). Components arrive from S3 (plan section 4).
 *
 * The CSS import keeps `dist/styles.css` in sync with the JS entry; apps that
 * prefer explicit CSS can import '@micro/ds/styles.css' instead.
 */
import './styles.css';
export * from './tokens/tokens';
export * from './i18n/ar';
export * from './i18n/plural';
export * from './i18n/time';
export * from './lib';
export * from './icons';
export * from './components/Money';
export * from './components/AmountVisibilityToggle';
export * from './components/Checkbox';
export * from './components/Radio';
export * from './components/Toggle';
export * from './components/SearchField';
export * from './components/TextArea';
export * from './components/AmountField';
export * from './components/AmountKeypad';
export * from './lib/normalize-amount';
export * from './components/StatusBadge';
export * from './components/EntityMark';
export * from './components/Button';
export * from './components/IconButton';
export * from './components/TextField';
export * from './components/SegmentedControl';
export * from './components/FilterChips';
export * from './components/Surface';
export * from './components/Well';
export * from './components/Section';
export * from './components/Tile';
export * from './components/HeroSurface';
export * from './components/ObjectRow';
export * from './components/ObjectCard';
export * from './components/Metric';
export * from './components/MetricSmall';
export * from './components/Sheet';
export * from './components/ConfirmSheet';
export * from './components/ActionBar';
export * from './components/AskButton';
export * from './components/NotificationsButton';
export * from './components/ProjectSwitcher';
export * from './components/ContextBar';
export * from './components/TabBar';
export * from './components/PageHeader';
export * from './components/SaveState';
export * from './components/Toast';
export * from './components/InlineBanner';
export * from './components/EmptyState';
export * from './components/Skeleton';
export * from './domains';
