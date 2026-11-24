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
export * from './components/StatusBadge';
export * from './components/EntityMark';
export * from './components/Button';
export * from './components/IconButton';
export * from './components/TextField';
export * from './components/SegmentedControl';
export * from './components/FilterChips';
export * from './components/Surface';
