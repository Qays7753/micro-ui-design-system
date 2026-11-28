/*
 * sim version — §5.9: «<رئيسي>.<فرعي>.<إصلاح> · DD/MM/YYYY» inside an LTR
 * isolation. The fix number rises with EVERY published fix unit (جولة
 * المستخدم 2026-11-28: the owner must be able to tell WHICH build his
 * installed PWA shows — it stayed 0.2.0 through every جولة الناقد fix,
 * so a stale cached app was indistinguishable from a fresh one); the date
 * is the build date. The simulation's own CALENDAR stays fixed at Friday
 * 27/11/2026 (BATCH2-SPECS-ADDENDUM §5) — the version date is the build
 * date, not the sim calendar.
 */
export const SIM_VERSION = '0.2.3 · 28/11/2026';
