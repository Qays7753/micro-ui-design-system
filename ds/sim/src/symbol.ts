/**
 * The symbol — the four Micro modules drawn from the approved geometry
 * (favicon.svg / micro-symbol-master, Outside R36 C8 G12). The SVG FILE is
 * never modified; the app re-draws the same four paths for the in-app splash
 * gather animation (§9.ب item 2: «تجمّع الوحدات motion.splash على canvas»).
 */
export interface SymbolModule {
  angle: number;
  fill: string;
}

/** The four equal modules: top petrol, right terracotta, bottom petrol, left blue-petrol. */
export const SYMBOL_MODULES: readonly SymbolModule[] = [
  { angle: 0, fill: '#164D59' },
  { angle: 90, fill: '#D97757' },
  { angle: 180, fill: '#164D59' },
  { angle: 270, fill: '#507F8B' },
];

/** The module path, byte-for-byte the approved geometry. */
export const MODULE_PATH =
  'M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z';
