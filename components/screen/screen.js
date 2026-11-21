/* =========================================================
   Micro UI — سلوك هيكل شاشة الهاتف (screen) — الجولة الثالثة T3.
   الملف: components/screen/screen.js

   الدور: قياس ارتفاعات الأشرطة (ResizeObserver) في متغيرات CSS
   ليبقى آخر المحتوى قابلًا للوصول، واتباع visualViewport عند انكشاف
   لوحة المفاتيح: الحقل المركّز يبقى ظاهرًا، وشريط الإجراءات يرتفع
   فوق اللوحة (keyboard-follow) أو يختفي (keyboard-hide — الافتراضي
   عند وجود شريط تنقل سفلي) وفق N-D10 / NATIVE-BEHAVIOR قسم 3.

   القواعد الثابتة:
   - لا يملك route ولا history ولا بيانات ولا نصوص (لا labels.js —
     موثق في DECISIONS): هيكل تخطيط فقط.
   - لا وصول إلى window/document في المستوى الأعلى للوحدة (R-D2).
   - العقد الموحد: init(root, options?) → instance{update, destroy}،
     مع destroy(root) وgetInstance(root)؛ init idempotent على الجذر
     نفسه (R4 قاعدة 1) وبعد destroy لا مورد حي (R4 قاعدة 4).

   الواجهة العامة:
   الغلوبال في نسخة IIFE: MicroScreen = {
     init(root?)     — يربط كل [data-micro-screen] تحت الجذر
     update(root?)   — يعيد قياس الأشرطة (بعد تغيير محتوى ديناميكي)
     destroy(root?)  — يفصل المراقبين ويزيل الحالة
     getInstance(root?)
   }
   ========================================================= */

import { instanceRegistry, resourceTracker } from '../../shared/lifecycle.js';

var registry = instanceRegistry();

var KEYBOARD_THRESHOLD = 120; /* أقل من هذا لا يُعد لوحة مفاتيح (أشرطة متصفح) */

function measureBars(screen) {
  var actions = screen.querySelector('.m-screen__actions');
  var nav = screen.querySelector('.m-screen__nav');
  screen.style.setProperty('--m-screen-actions-h', (actions ? actions.offsetHeight : 0) + 'px');
  screen.style.setProperty('--m-screen-nav-h', (nav ? nav.offsetHeight : 0) + 'px');
}

function keepFocusedVisible(screen) {
  var content = screen.querySelector('.m-screen__content');
  var focus = document.activeElement;
  if (!content || !focus || !content.contains(focus)) return;
  var vv = window.visualViewport;
  if (!vv) return;
  var rect = focus.getBoundingClientRect();
  var keyboardTop = vv.height + vv.offsetTop;
  var actions = screen.querySelector('.m-screen__actions[data-actions="keyboard-follow"]');
  var margin = 16 + (actions ? actions.offsetHeight : 0);
  if (rect.bottom > keyboardTop - margin) {
    content.scrollTop += rect.bottom - keyboardTop + margin;
  }
}

function initScreen(screen, tracker) {
  /* وضع شريط الإجراءات أمام لوحة المفاتيح: صريح من المستهلك، أو
     الافتراضي وفق البنية (يوجد شريط تنقل ← يختفي، وإلا يرتفع). */
  var actions = screen.querySelector('.m-screen__actions');
  if (actions && !actions.getAttribute('data-actions')) {
    var nav = screen.querySelector('.m-screen__nav');
    actions.setAttribute('data-actions', nav ? 'keyboard-hide' : 'keyboard-follow');
  }

  measureBars(screen);

  var resizeObserver = new ResizeObserver(function () {
    measureBars(screen);
  });
  [actions, screen.querySelector('.m-screen__nav')].forEach(function (bar) {
    if (bar) resizeObserver.observe(bar);
  });
  tracker.trackObserver(resizeObserver);

  var viewport = window.visualViewport;
  if (viewport) {
    var pending = false;
    var onViewport = function () {
      if (pending) return;
      pending = true;
      tracker.frame(function () {
        pending = false;
        var keyboard = Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop));
        var open = keyboard > KEYBOARD_THRESHOLD;
        screen.setAttribute('data-keyboard', open ? 'true' : 'false');
        screen.style.setProperty('--m-screen-keyboard', (open ? keyboard : 0) + 'px');
        if (open) keepFocusedVisible(screen);
      });
    };
    tracker.on(viewport, 'resize', onViewport);
    tracker.on(viewport, 'scroll', onViewport);
  }

  return {
    update: function () {
      measureBars(screen);
    },
    destroy: function () {
      screen.removeAttribute('data-keyboard');
      screen.style.removeProperty('--m-screen-keyboard');
      screen.style.removeProperty('--m-screen-actions-h');
      screen.style.removeProperty('--m-screen-nav-h');
    },
  };
}

export function init(root, options) {
  var scope = root && root.matches && root.matches('[data-micro-screen]') ? root : document;
  var existing = registry.get(scope === document ? null : scope);
  if (existing) return existing;
  var screens = scope === document ? document.querySelectorAll('[data-micro-screen]') : [scope];
  var bound = [];
  screens.forEach(function (screen) {
    var instance = registry.get(screen);
    if (instance) return;
    var tracker = resourceTracker();
    instance = initScreen(screen, tracker);
    instance.__destroyed = false;
    instance.destroy = (function (original) {
      return function () {
        original();
        tracker.stopAll();
        instance.__destroyed = true;
        registry.remove(screen);
      };
    })(instance.destroy);
    registry.set(screen, instance);
    bound.push(instance);
  });
  if (scope !== document) return registry.get(scope);
  return { update: function () { bound.forEach(function (i) { i.update(); }); },
           destroy: function () { bound.slice().forEach(function (i) { i.destroy(); }); } };
}

export function update(root) {
  var scope = root || document;
  var screens = scope.matches && scope.matches('[data-micro-screen]')
    ? [scope] : scope.querySelectorAll('[data-micro-screen]');
  screens.forEach(function (screen) {
    var instance = registry.get(screen);
    if (instance) instance.update();
    else measureBars(screen);
  });
}

export function destroy(root) {
  var scope = root || document;
  var screens = scope.matches && scope.matches('[data-micro-screen]')
    ? [scope] : scope.querySelectorAll('[data-micro-screen]');
  screens.forEach(function (screen) {
    var instance = registry.get(screen);
    if (instance) instance.destroy();
  });
}

export function getInstance(root) {
  var scope = root || document;
  if (scope.matches && scope.matches('[data-micro-screen]')) return registry.get(scope);
  var screen = scope.querySelector('[data-micro-screen]');
  return screen ? registry.get(screen) : null;
}
