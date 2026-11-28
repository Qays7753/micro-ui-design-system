/**
 * اختبار رموز الحركة — كل قيمة حرفيةً من ملحق الحركة 1.0 (§8.1، §8.3)
 * وبإضافات المواصفة §6.2-8 وإلغاءاتها §6.2-2 (بلا sync-spacing/sync-max).
 */
import { describe, expect, it } from 'vitest';
import { MICRO_SYMBOL_SIZE, MOTION, MOTION_EXTRAS, MOTION_SYMBOL_U, motionCssVars } from './tokens';

describe('رموز الحركة 8.1', () => {
  it('المدد الست للدخول', () => {
    expect(MOTION.duration).toEqual({ press: 80, 'press-out': 160, xs: 120, sm: 200, md: 280, lg: 360 });
  });

  it('مجموعة الخروج 80/120/200/250', () => {
    expect(MOTION.exit).toEqual({ xs: 80, sm: 120, md: 200, lg: 250 });
  });

  it('المنحنيات الأربعة', () => {
    expect(MOTION.ease).toEqual({
      micro: 'cubic-bezier(.22,1,.36,1)',
      exit: 'cubic-bezier(.4,0,1,1)',
      move: 'cubic-bezier(.65,0,.35,1)',
      linear: 'linear',
    });
  });

  it('الضغط: مقاييس وإلغاء وأقصى استجابة', () => {
    expect(MOTION['press-scale']).toEqual({ surface: 0.98, button: 0.96 });
    expect(MOTION['press-cancel-px']).toBe(8);
    expect(MOTION['response-max-ms']).toBe(100);
  });

  it('إيماءات السحب والإفلات', () => {
    expect(MOTION.gesture).toEqual({
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
    });
  });

  it('الشاشات والتبويبات والتتابع والحضور', () => {
    expect(MOTION.screen).toEqual({ forward: 280, back: 200, 'underlay-shift': 0.3, 'underlay-opacity': 0.6 });
    expect(MOTION.tab).toEqual({ out: 120, in: 200, shift: 8 });
    expect(MOTION.stagger).toEqual({ step: 30, 'max-index': 5, shift: 8, duration: 200 });
    expect(MOTION.presence).toEqual({ enter: 200, 'enter-delay': 80, leave: 120, reflow: 200 });
  });

  it('تبدّل الأرقام والرسوم والمسار', () => {
    expect(MOTION.value).toEqual({ shift: 6, out: 120, in: 200, overlap: 60, flash: 800 });
    expect(MOTION.chart).toEqual({ appear: 200, morph: 280, 'labels-in': 120 });
    expect(MOTION.track).toEqual({
      fill: 280,
      dot: 160,
      'dot-delay': 200,
      'dot-from-scale': 0.6,
      text: 160,
      'text-delay': 280,
    });
  });

  it('مهلة الانتظار ورسم ✓', () => {
    expect(MOTION['pending-delay']).toBe(300);
    expect(MOTION['check-draw']).toBe(300);
  });

  it('الإضاءة landed — اللون brand-selected-pressed والثلاث صيغ', () => {
    expect(MOTION.landed).toEqual({
      color: 'brand-selected-pressed',
      frequent: { hold: 200, fade: 600 },
      rare: { hold: 400, fade: 800 },
      reduced: { hold: 1000, fade: 150 },
    });
  });

  it('التوست والهيكل والدوّار والنقطة', () => {
    expect(MOTION.toast).toEqual({ in: 200, out: 120, shift: 16, ms: 3000, 'with-action-ms': 5000 });
    expect(MOTION.skeleton).toEqual({
      'show-after': 300,
      'min-visible': 500,
      pulse: 1400,
      from: 1,
      to: 0.55,
      'to-content': 200,
    });
    expect(MOTION.spinner).toBe(800);
    expect(MOTION.dot).toBe(120);
    expect(MOTION['opened-fade']).toBe(600);
    expect(MOTION.time).toEqual({ tick: 60000 });
    expect(MOTION.keyboard).toBe(280);
  });

  it('حركات الرمز brand', () => {
    expect(MOTION.brand['offset-max']).toBe(32);
    expect(MOTION.brand['first-launch']).toEqual({
      split: { ms: 240, offset: 16, ease: 'move' },
      join: { ms: 240, delay: { left: 0, top: 40, bottom: 80, right: 160 } },
      flight: 360,
      'layer-fade': 200,
      total: 1000,
    });
    expect(MOTION.brand.handoff).toEqual({ flight: 360, 'layer-fade': 200 });
    expect(MOTION.brand.assemble).toEqual({
      ms: 440,
      offset: 32,
      'opacity-end': 0.4,
      delay: { left: 0, top: 60, bottom: 120, right: 200 },
      total: 640,
    });
    expect(MOTION.brand.think).toEqual({
      step: 240,
      pause: 120,
      'finish-step': 160,
      angle: -90,
      'caption-after': 6000,
    });
    expect(MOTION.brand.listen).toEqual({ attack: 50, release: 200, update: 80, 'reduced-offset': 8 });
  });

  it('قياس المستوى والسائق والحدود العامة', () => {
    expect(MOTION.tier).toEqual({ 'slow-frame': 34, 'slow-max': 3, 'min-frames': 15 });
    expect(MOTION['driver-factor']).toBe(0.75);
    expect(MOTION['max-concurrent']).toBe(12);
    expect(MOTION['event-wait-max']).toBe(400);
    expect(MOTION.scale).toBe(1);
  });

  it('إضافات المواصفة §6.2-8: save-hold وswipe', () => {
    expect(MOTION['save-hold']).toBe(200);
    expect(MOTION['save-hold-reduced']).toBe(500);
    expect(MOTION.swipe).toEqual({ slop: 8, 'axis-ratio': 1.5, 'open-ratio': 0.5, velocity: 0.5 });
  });

  it('إلغاءات §6.2: لا sync-spacing ولا sync-max ولا syncArrivals (ح30 ملغاة)', () => {
    expect('sync-spacing' in MOTION).toBe(false);
    expect('sync-max' in MOTION).toBe(false);
  });

  it('وحدة الرمز U=64 والحد 32', () => {
    expect(MOTION_SYMBOL_U).toBe(64);
    expect(MOTION.brand['offset-max']).toBe(MOTION_SYMBOL_U / 2);
  });

  it('رموز 8.3', () => {
    expect(MOTION_EXTRAS['size.splash-symbol']).toBe(96);
    expect(MOTION_EXTRAS['size.micro-symbol']).toEqual({ sm: 28, lg: 96 });
    expect(MICRO_SYMBOL_SIZE).toEqual({ sm: 28, lg: 96 });
    expect(MOTION_EXTRAS['layer.brand']).toBe(80);
    expect(MOTION_EXTRAS['color.value-flash-on-anchor']).toBe('rgb(255 255 255 / 14%)');
  });
});

describe('متغيرات CSS', () => {
  it('السكيل يصل كما هو وكل متغير مدة يحمل ms', () => {
    const vars = motionCssVars(0.5);
    expect(vars['--ds-motion-scale']).toBe('0.5');
    expect(vars['--ds-motion-duration-lg']).toBe('360ms');
    expect(vars['--ds-motion-ease-micro']).toBe('cubic-bezier(.22,1,.36,1)');
    expect(vars['--ds-motion-save-hold']).toBe('200ms');
    expect(vars['--ds-motion-swipe-slop']).toBe('8px');
    expect(vars['--mds-motion-quick-ease']).toBe('cubic-bezier(.22,1,.36,1)');
  });

  it('السكيل 1 هو الافتراضي الإنتاجي', () => {
    expect(motionCssVars(1)['--ds-motion-scale']).toBe('1');
  });
});
