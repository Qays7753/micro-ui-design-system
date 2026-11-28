/**
 * motion/tokens.ts — رموز الحركة 8.1 و8.3 من ملحق الحركة 1.0
 * (`docs/design-system/MOTION-ADDENDUM-1.0.md`)، بتعديلات المواصفة §6
 * (PLAN-MANAGE قسم ج):
 *  - يُضاف `save-hold` و`save-hold-reduced` و`swipe` (§6.2-8).
 *  - يُلغى `sync-spacing` و`sync-max` مع ح30 كلها (§6.2-2).
 *
 * هذا الملف هو **المصدر الوحيد** لكل مدة ومنحنى ومسافة في طبقة الحركة:
 * لا قيمة خام في motion.css ولا في أي أداة — كلها تُقرأ من هنا، وفي CSS
 * تصل متغيرات `--ds-motion-*` التي يضعها MotionProvider من `motionCssVars()`.
 *
 * عند النقل إلى `ds/src/motion/` يصير هذا القسم مجموعة `motion` في
 * `tokens.json` (الملحق 8.2 يستبدل المجموعة الحالية كاملة).
 */

export const MOTION = {
  duration: { press: 80, 'press-out': 160, xs: 120, sm: 200, md: 280, lg: 360 },
  exit: { xs: 80, sm: 120, md: 200, lg: 250 },
  ease: {
    micro: 'cubic-bezier(.22,1,.36,1)',
    exit: 'cubic-bezier(.4,0,1,1)',
    move: 'cubic-bezier(.65,0,.35,1)',
    linear: 'linear',
  },
  'press-scale': { surface: 0.98, button: 0.96 },
  'press-cancel-px': 8,
  'response-max-ms': 100,
  gesture: {
    'release-slope': 4.55,
    'release-min': 160,
    'release-max': 420,
    'velocity-floor': 0.3,
    'sheet-dismiss-ratio': 0.3,
    'sheet-dismiss-velocity': 0.6,
    'overdrag-factor': 0.25,
    'overdrag-max': 24,
    'back-edge': 24,
    'back-commit-ratio': 0.35,
    'back-commit-velocity': 0.5,
  },
  screen: { forward: 280, back: 200, 'underlay-shift': 0.3, 'underlay-opacity': 0.6 },
  tab: { out: 120, in: 200, shift: 8 },
  stagger: { step: 30, 'max-index': 5, shift: 8, duration: 200 },
  presence: { enter: 200, 'enter-delay': 80, leave: 120, reflow: 200 },
  value: { shift: 6, out: 120, in: 200, overlap: 60, flash: 800 },
  chart: { appear: 200, morph: 280, 'labels-in': 120 },
  track: { fill: 280, dot: 160, 'dot-delay': 200, 'dot-from-scale': 0.6, text: 160, 'text-delay': 280 },
  'pending-delay': 300,
  'check-draw': 300,
  landed: {
    color: 'brand-selected-pressed',
    frequent: { hold: 200, fade: 600 },
    rare: { hold: 400, fade: 800 },
    reduced: { hold: 1000, fade: 150 },
  },
  toast: { in: 200, out: 120, shift: 16, ms: 3000, 'with-action-ms': 5000 },
  skeleton: { 'show-after': 300, 'min-visible': 500, pulse: 1400, from: 1, to: 0.55, 'to-content': 200 },
  spinner: 800,
  dot: 120,
  'opened-fade': 600,
  time: { tick: 60000 },
  keyboard: 280,
  brand: {
    'offset-max': 32,
    'first-launch': {
      split: { ms: 240, offset: 16, ease: 'move' },
      join: { ms: 240, delay: { left: 0, top: 40, bottom: 80, right: 160 } },
      flight: 360,
      'layer-fade': 200,
      total: 1000,
    },
    handoff: { flight: 360, 'layer-fade': 200 },
    assemble: {
      ms: 440,
      offset: 32,
      'opacity-end': 0.4,
      delay: { left: 0, top: 60, bottom: 120, right: 200 },
      total: 640,
    },
    think: { step: 240, pause: 120, 'finish-step': 160, angle: -90, 'caption-after': 6000 },
    listen: { attack: 50, release: 200, update: 80, 'reduced-offset': 8 },
  },
  tier: { 'slow-frame': 34, 'slow-max': 3, 'min-frames': 15 },
  'driver-factor': 0.75,
  'max-concurrent': 12,
  'event-wait-max': 400,
  scale: 1,
  /* §6.2-8 — إضافات المواصفة */
  'save-hold': 200,
  'save-hold-reduced': 500,
  swipe: { slop: 8, 'axis-ratio': 1.5, 'open-ratio': 0.5, velocity: 0.5 },
} as const;

/** وحدة الرمز U = 64 (قرار المالك)، فالحد الأقصى للإزاحة نصفها = 32. */
export const MOTION_SYMBOL_U = 64;

/** 8.3 — رموز أخرى تضيفها طبقة الحركة. */
export const MOTION_EXTRAS = {
  'size.splash-symbol': 96,
  'size.micro-symbol': { sm: 28, lg: 96 },
  'layer.brand': 80,
  'color.value-flash-on-anchor': 'rgb(255 255 255 / 14%)',
} as const;

/** مقاسا `MicroSymbol`. */
export const MICRO_SYMBOL_SIZE = { sm: 28, lg: 96 } as const;

/**
 * متغيرات CSS التي يضعها MotionProvider على جذره — كل مدة/تأخير/منحنى
 * في motion.css يُقرأ من متغير من هنا (`calc(<المدة> * var(--ds-motion-scale))`).
 */
export function motionCssVars(scale: number): Record<string, string> {
  const v: Record<string, string> = {
    '--ds-motion-scale': String(scale),
    '--ds-motion-duration-press': `${MOTION.duration.press}ms`,
    '--ds-motion-duration-press-out': `${MOTION.duration['press-out']}ms`,
    '--ds-motion-duration-xs': `${MOTION.duration.xs}ms`,
    '--ds-motion-duration-sm': `${MOTION.duration.sm}ms`,
    '--ds-motion-duration-md': `${MOTION.duration.md}ms`,
    '--ds-motion-duration-lg': `${MOTION.duration.lg}ms`,
    '--ds-motion-exit-xs': `${MOTION.exit.xs}ms`,
    '--ds-motion-exit-sm': `${MOTION.exit.sm}ms`,
    '--ds-motion-exit-md': `${MOTION.exit.md}ms`,
    '--ds-motion-exit-lg': `${MOTION.exit.lg}ms`,
    '--ds-motion-ease-micro': MOTION.ease.micro,
    '--ds-motion-ease-exit': MOTION.ease.exit,
    '--ds-motion-ease-move': MOTION.ease.move,
    '--ds-motion-ease-linear': MOTION.ease.linear,
    '--ds-motion-press-scale-surface': String(MOTION['press-scale'].surface),
    '--ds-motion-press-scale-button': String(MOTION['press-scale'].button),
    '--ds-motion-press-cancel-px': `${MOTION['press-cancel-px']}px`,
    '--ds-motion-screen-forward': `${MOTION.screen.forward}ms`,
    '--ds-motion-screen-back': `${MOTION.screen.back}ms`,
    '--ds-motion-screen-underlay-shift': String(MOTION.screen['underlay-shift']),
    '--ds-motion-screen-underlay-opacity': String(MOTION.screen['underlay-opacity']),
    '--ds-motion-tab-out': `${MOTION.tab.out}ms`,
    '--ds-motion-tab-in': `${MOTION.tab.in}ms`,
    '--ds-motion-tab-shift': `${MOTION.tab.shift}px`,
    '--ds-motion-stagger-step': `${MOTION.stagger.step}ms`,
    '--ds-motion-stagger-max-index': String(MOTION.stagger['max-index']),
    '--ds-motion-stagger-shift': `${MOTION.stagger.shift}px`,
    '--ds-motion-stagger-duration': `${MOTION.stagger.duration}ms`,
    '--ds-motion-presence-enter': `${MOTION.presence.enter}ms`,
    '--ds-motion-presence-enter-delay': `${MOTION.presence['enter-delay']}ms`,
    '--ds-motion-presence-leave': `${MOTION.presence.leave}ms`,
    '--ds-motion-presence-reflow': `${MOTION.presence.reflow}ms`,
    '--ds-motion-value-shift': `${MOTION.value.shift}px`,
    '--ds-motion-value-out': `${MOTION.value.out}ms`,
    '--ds-motion-value-in': `${MOTION.value.in}ms`,
    '--ds-motion-value-overlap': `${MOTION.value.overlap}ms`,
    '--ds-motion-value-flash': `${MOTION.value.flash}ms`,
    '--ds-motion-chart-appear': `${MOTION.chart.appear}ms`,
    '--ds-motion-chart-morph': `${MOTION.chart.morph}ms`,
    '--ds-motion-chart-labels-in': `${MOTION.chart['labels-in']}ms`,
    '--ds-motion-track-fill': `${MOTION.track.fill}ms`,
    '--ds-motion-track-dot': `${MOTION.track.dot}ms`,
    '--ds-motion-track-dot-delay': `${MOTION.track['dot-delay']}ms`,
    '--ds-motion-track-dot-from-scale': String(MOTION.track['dot-from-scale']),
    '--ds-motion-track-text': `${MOTION.track.text}ms`,
    '--ds-motion-track-text-delay': `${MOTION.track['text-delay']}ms`,
    '--ds-motion-pending-delay': `${MOTION['pending-delay']}ms`,
    '--ds-motion-check-draw': `${MOTION['check-draw']}ms`,
    '--ds-motion-landed-frequent-hold': `${MOTION.landed.frequent.hold}ms`,
    '--ds-motion-landed-frequent-fade': `${MOTION.landed.frequent.fade}ms`,
    '--ds-motion-landed-rare-hold': `${MOTION.landed.rare.hold}ms`,
    '--ds-motion-landed-rare-fade': `${MOTION.landed.rare.fade}ms`,
    '--ds-motion-landed-reduced-hold': `${MOTION.landed.reduced.hold}ms`,
    '--ds-motion-landed-reduced-fade': `${MOTION.landed.reduced.fade}ms`,
    '--ds-motion-toast-in': `${MOTION.toast.in}ms`,
    '--ds-motion-toast-out': `${MOTION.toast.out}ms`,
    '--ds-motion-toast-shift': `${MOTION.toast.shift}px`,
    '--ds-motion-skeleton-show-after': `${MOTION.skeleton['show-after']}ms`,
    '--ds-motion-skeleton-min-visible': `${MOTION.skeleton['min-visible']}ms`,
    '--ds-motion-skeleton-pulse': `${MOTION.skeleton.pulse}ms`,
    '--ds-motion-skeleton-to-content': `${MOTION.skeleton['to-content']}ms`,
    '--ds-motion-spinner': `${MOTION.spinner}ms`,
    '--ds-motion-dot': `${MOTION.dot}ms`,
    '--ds-motion-opened-fade': `${MOTION['opened-fade']}ms`,
    '--ds-motion-time-tick': `${MOTION.time.tick}ms`,
    '--ds-motion-keyboard': `${MOTION.keyboard}ms`,
    '--ds-motion-brand-offset-max': String(MOTION.brand['offset-max']),
    '--ds-motion-brand-split-ms': `${MOTION.brand['first-launch'].split.ms}ms`,
    '--ds-motion-brand-split-offset': String(MOTION.brand['first-launch'].split.offset),
    '--ds-motion-brand-join-ms': `${MOTION.brand['first-launch'].join.ms}ms`,
    '--ds-motion-brand-join-delay-left': `${MOTION.brand['first-launch'].join.delay.left}ms`,
    '--ds-motion-brand-join-delay-top': `${MOTION.brand['first-launch'].join.delay.top}ms`,
    '--ds-motion-brand-join-delay-bottom': `${MOTION.brand['first-launch'].join.delay.bottom}ms`,
    '--ds-motion-brand-join-delay-right': `${MOTION.brand['first-launch'].join.delay.right}ms`,
    '--ds-motion-brand-flight': `${MOTION.brand['first-launch'].flight}ms`,
    '--ds-motion-brand-layer-fade': `${MOTION.brand['first-launch']['layer-fade']}ms`,
    '--ds-motion-brand-first-launch-total': `${MOTION.brand['first-launch'].total}ms`,
    '--ds-motion-brand-handoff-flight': `${MOTION.brand.handoff.flight}ms`,
    '--ds-motion-brand-assemble-ms': `${MOTION.brand.assemble.ms}ms`,
    '--ds-motion-brand-assemble-offset': String(MOTION.brand.assemble.offset),
    '--ds-motion-brand-assemble-opacity-end': String(MOTION.brand.assemble['opacity-end']),
    '--ds-motion-brand-assemble-delay-left': `${MOTION.brand.assemble.delay.left}ms`,
    '--ds-motion-brand-assemble-delay-top': `${MOTION.brand.assemble.delay.top}ms`,
    '--ds-motion-brand-assemble-delay-bottom': `${MOTION.brand.assemble.delay.bottom}ms`,
    '--ds-motion-brand-assemble-delay-right': `${MOTION.brand.assemble.delay.right}ms`,
    '--ds-motion-brand-assemble-total': `${MOTION.brand.assemble.total}ms`,
    '--ds-motion-brand-think-step': `${MOTION.brand.think.step}ms`,
    '--ds-motion-brand-think-pause': `${MOTION.brand.think.pause}ms`,
    '--ds-motion-brand-think-finish-step': `${MOTION.brand.think['finish-step']}ms`,
    '--ds-motion-brand-think-angle': `${MOTION.brand.think.angle}deg`,
    '--ds-motion-brand-think-caption-after': `${MOTION.brand.think['caption-after']}ms`,
    '--ds-motion-brand-listen-attack': `${MOTION.brand.listen.attack}ms`,
    '--ds-motion-brand-listen-release': `${MOTION.brand.listen.release}ms`,
    '--ds-motion-brand-listen-update': `${MOTION.brand.listen.update}ms`,
    '--ds-motion-brand-listen-reduced-offset': String(MOTION.brand.listen['reduced-offset']),
    '--ds-motion-save-hold': `${MOTION['save-hold']}ms`,
    '--ds-motion-save-hold-reduced': `${MOTION['save-hold-reduced']}ms`,
    '--ds-motion-swipe-slop': `${MOTION.swipe.slop}px`,
    '--ds-motion-swipe-axis-ratio': String(MOTION.swipe['axis-ratio']),
    '--ds-motion-swipe-open-ratio': String(MOTION.swipe['open-ratio']),
    '--ds-motion-swipe-velocity': String(MOTION.swipe.velocity),
    '--ds-motion-splash-symbol': `${MOTION_EXTRAS['size.splash-symbol']}px`,
    '--ds-motion-micro-symbol-sm': `${MICRO_SYMBOL_SIZE.sm}px`,
    '--ds-motion-micro-symbol-lg': `${MICRO_SYMBOL_SIZE.lg}px`,
    '--ds-motion-layer-brand': String(MOTION_EXTRAS['layer.brand']),
    '--ds-motion-value-flash-on-anchor': MOTION_EXTRAS['color.value-flash-on-anchor'],
    '--ds-motion-driver-factor': String(MOTION['driver-factor']),
    '--ds-motion-tier-slow-frame': `${MOTION.tier['slow-frame']}ms`,
    '--ds-motion-tier-min-frames': String(MOTION.tier['min-frames']),
    /* خريطة 8.2 — المكتبة تخفف بـquick (‎.2,0,0,1‎)؛ الشيم تحوّل منحنى
       الخروج إلى micro داخل نطاق الحركة (تعارض 2 في REPORT-MOTION). */
    '--mds-motion-quick-ease': MOTION.ease.micro,
  };
  return v;
}
