/* Micro — optional numeric-card carousel. Consumer supplies every card and value.
   R8-02: الجذر الذي يطلب variant الـpeek (data-info-peek) يملكه info-strip-peek
   وحده (مالك واحد للحالة والأحداث) — هذا المحرك يتخطاه مهما تقدّم ترتيب
   التحميل، وسلوكه على الجذور غير peek لا يتغيّر.

   R-03/R-51 (2026-10-25): المسار المضغوط يفرض هندسة RTL صريحة
   (direction: rtl على المسار — التمرير المكاني من اليمين لليسار)؛
   لذلك تتبع لوحة المفاتيح والسحب **هندسة المسار نفسها** لا اتجاه
   الصفحة: السهم الذي يزيد المؤشر هو «التالي البصري» دائمًا مهما كان
   اتجاه المضيف. قناتا الإدخال لا تتناقضان مع الشكل ولا مع بعضهما.

   R-15 (2026-10-25): دورة حياة قابلة لإعادة الاستخدام — init() تلتقط
   البطاقات وقت التهيئة (المحتوى الثابت)، وrescan(root) يعيد الالتقاط
   بعد إضافة/إزالة مضيفة غير متزامنة، وdisconnect(root) يفصل مستمعات
   الجذر ويعيده لحالة غير مهيأة (init جديدة تعمل بعدها). لا مؤقتات. */
(function () {
  'use strict';

  function isEditingTarget(target) {
    return !!(target && (target.isContentEditable || (target.closest && target.closest(
      'input, textarea, select, option, [role="textbox"], [role="searchbox"], ' +
      '[role="combobox"], [role="spinbutton"], [role="slider"], [data-info-strip-editable]'))));
  }

  var registry = new WeakMap(); /* root → teardown data (listeners + nodes) */

  function initStrip(strip) {
    if (strip.hasAttribute('data-info-peek')) return; /* R8-02: تفويض صريح لمالك وحيد */
    if (strip.hasAttribute('data-info-strip-ready')) return;
    var viewport = strip.querySelector('[data-info-strip-viewport]');
    var track = strip.querySelector('[data-info-strip-track]');
    if (!viewport || !track) return;
    strip.setAttribute('data-info-strip-ready', '');

    var listeners = []; /* مراجع كل مستمع — ينزعها disconnect */
    function on(elm, type, fn) {
      elm.addEventListener(type, fn, false);
      listeners.push({ el: elm, type: type, fn: fn });
    }

    var controls = strip.querySelector('[data-info-strip-controls]');
    var previous = strip.querySelector('[data-info-strip-prev]');
    var next = strip.querySelector('[data-info-strip-next]');
    var pageList = strip.querySelector('[data-info-strip-pages]');
    var position = strip.querySelector('[data-info-strip-position]');
    var status = strip.querySelector('[data-info-strip-status]');
    var empty = strip.querySelector('[data-info-strip-empty]');
    var index = 0;
    var startX = null;
    var startY = null;
    var moved = false;
    var pageButtons = [];

    function slides() {
      return Array.prototype.slice.call(track.children).filter(function (node) {
        return node.classList.contains('m-info-strip__slide');
      });
    }

    function syncEmptyState(count) {
      if (controls) controls.hidden = count === 0;
      viewport.hidden = count === 0;
      if (empty) empty.hidden = count > 0;
    }

    syncEmptyState(slides().length);
    if (slides().length >= 2 && empty) empty.hidden = true;

    if (pageList) {
      pageList.setAttribute('role', 'group');
      if (!pageList.hasAttribute('aria-label')) pageList.setAttribute('aria-label', 'اختيار البطاقة');
    }
    function setIndex(target, focusViewport) {
      var list = slides();
      var nextIndex = Math.max(0, Math.min(list.length - 1, target));
      if (nextIndex === index && track.style.getPropertyValue('--m-info-index') !== '') return;

      var activeElement = document.activeElement;
      if (list[index] && list[index].contains(activeElement)) {
        viewport.focus({ preventScroll: true });
      }

      index = nextIndex;
      track.style.setProperty('--m-info-index', String(index));
      list.forEach(function (slide, slideIndex) {
        var active = slideIndex === index;
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        slide.inert = !active;
      });
      if (previous) previous.disabled = index === 0;
      if (next) next.disabled = index === list.length - 1;
      if (position) position.textContent = (index + 1) + ' / ' + list.length;
      if (status) status.textContent = 'البطاقة ' + (index + 1) + ' من ' + list.length;
      if (pageList) {
        pageButtons.forEach(function (button, pageIndex) {
          button.setAttribute('aria-current', pageIndex === index ? 'true' : 'false');
          button.setAttribute('aria-pressed', pageIndex === index ? 'true' : 'false');
        });
      }
      if (focusViewport) viewport.focus({ preventScroll: true });
    }

    function rebuildPages() {
      if (!pageList) return;
      pageList.textContent = '';
      pageButtons = [];
      slides().forEach(function (_, pageIndex) {
        var page = document.createElement('button');
        page.type = 'button';
        page.className = 'm-info-strip__page';
        page.setAttribute('data-info-strip-page', '');
        page.setAttribute('aria-label', 'عرض البطاقة ' + (pageIndex + 1));
        page.setAttribute('aria-current', pageIndex === 0 ? 'true' : 'false');
        page.setAttribute('aria-pressed', pageIndex === 0 ? 'true' : 'false');
        page.addEventListener('click', function () { setIndex(pageIndex, false); });
        pageList.appendChild(page);
        pageButtons.push(page);
      });
    }

    rebuildPages();

    if (previous) on(previous, 'click', function () { setIndex(index - 1, false); });
    if (next) on(next, 'click', function () { setIndex(index + 1, false); });

    /* R-03/R-51: الأسهم تتبع هندسة المسار المفروضة (RTL) لا اتجاه
       الصفحة — في مضيف LTR أيضًا: السهم الأيسر = التالي البصري،
       والأيمن = السابق، كاسلوك السحب تمامًا. */
    on(strip, 'keydown', function (event) {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (isEditingTarget(event.target)) return;
      var control = event.target.closest && event.target.closest(
        '[data-info-strip-prev], [data-info-strip-next], [data-info-strip-page]');
      if (!viewport.contains(event.target) && !control) return;
      if (!control && event.target.closest && event.target.closest('button, a[href], summary')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndex(index + 1, false);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setIndex(index - 1, false);
      } else if (event.key === 'Home') {
        event.preventDefault();
        setIndex(0, false);
      } else if (event.key === 'End') {
        event.preventDefault();
        setIndex(slides().length - 1, false);
      }
    });

    on(viewport, 'pointerdown', function (event) {
      if (isEditingTarget(event.target)) return;
      if (event.pointerType !== 'touch' || event.isPrimary === false) return;
      startX = event.clientX;
      startY = event.clientY;
      moved = false;
    });
    on(viewport, 'pointerup', function (event) {
      if (startX === null || startY === null) return;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        moved = true;
        /* هندسة المسار RTL: السحب لليمين يكشف التالي (البطاقة التالية
           تدخل من اليسار) — كما كان؛ السحب لليسار يعود للسابق */
        setIndex(index + (dx > 0 ? 1 : -1), false);
      }
      startX = null;
      startY = null;
    });
    on(viewport, 'pointercancel', function () {
      startX = null;
      startY = null;
    });
    on(viewport, 'click', function (event) {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    }, true);

    var initial = slides();
    initial.forEach(function (slide, slideIndex) {
      slide.setAttribute('aria-hidden', slideIndex === 0 ? 'false' : 'true');
      slide.inert = slideIndex !== 0;
    });
    track.style.setProperty('--m-info-index', '0');
    if (previous) previous.disabled = true;
    if (next) next.disabled = initial.length < 2;
    if (position) position.textContent = '1 / ' + initial.length;
    if (status) status.textContent = 'البطاقة 1 من ' + initial.length;

    registry.set(strip, {
      listeners: listeners,
      viewport: viewport,
      track: track,
      controls: controls,
      empty: empty,
      setIndex: setIndex,
      slides: slides,
      rebuildPages: rebuildPages,
      syncEmptyState: syncEmptyState
    });
  }

  function teardown(strip) {
    var data = registry.get(strip);
    if (!data) return;
    data.listeners.forEach(function (L) {
      L.el.removeEventListener(L.type, L.fn, false);
    });
    registry.delete(strip);
    strip.removeAttribute('data-info-strip-ready');
    data.track.style.removeProperty('--m-info-index');
    data.slides().forEach(function (slide) {
      slide.removeAttribute('aria-hidden');
      slide.inert = false;
    });
    if (data.controls) data.controls.hidden = false;
    if (data.empty) data.empty.hidden = true;
    data.viewport.hidden = false;
  }

  function init(root) {
    var scope = root || document;
    if (scope.matches && scope.matches('[data-info-strip]')) initStrip(scope);
    scope.querySelectorAll('[data-info-strip]').forEach(initStrip);
  }

  /* R-15: إعادة الالتقاط بعد محتوى مضيف غير متزامن — تفصل الربط القديم
     ثم تهيئ من جديد (بطاقات جديدة/محذوفة، حالة أول صف، صفحات النقاط) */
  function rescan(root) {
    var scope = root || document;
    var list = [];
    if (scope.matches && scope.matches('[data-info-strip]')) list.push(scope);
    Array.prototype.push.apply(list, scope.querySelectorAll('[data-info-strip]'));
    list.forEach(function (strip) {
      if (strip.hasAttribute('data-info-peek')) return; /* مالك آخر (R8-02) */
      if (strip.hasAttribute('data-info-strip-ready')) teardown(strip);
      initStrip(strip);
    });
  }

  /* R-15: فصل مستمعات جذر بعينه — يعيد الشريط لحالة غير مهيأة
     (init/rescan جديدان يعملان بعدها) */
  function disconnect(root) {
    var scope = root || document;
    if (scope.matches && scope.matches('[data-info-strip]')) teardown(scope);
    scope.querySelectorAll('[data-info-strip]').forEach(teardown);
  }

  window.MicroInfoStrip = { init: init, rescan: rescan, disconnect: disconnect };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();
