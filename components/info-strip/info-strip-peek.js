/* =========================================================
   Micro UI — سلوك variant العارض مع peek وتتبع السحب (A05)
   الملف: components/info-strip/info-strip-peek.js
   الحالة: ADOPTED — اعتمد المالك النمط الاختياري بتاريخ 2026-10-04؛
   لا يستبدل info-strip الحالي ولا يفرض على الرئيسية أو كل بطاقة.
   المصدر: أنماط السحب من components/carousel/carousel.js
   (قفل المحور، عتبة الالتزام، التنظيف على window، pointercancel)
   على بنية info-strip نفسها (نفس أسماء أجزاء التحكم).
   لا autoplay ولا مؤقت تبديل ولا مكتبة خارجية.

   الاستخدام: <div class="m-info-strip m-info-peek" data-info-strip
                 data-info-peek> … نفس بنية info-strip … </div>
   ثم MicroInfoPeek.init() (تلقائي عند التحميل).
   الواجهة: window.MicroInfoPeek = { init, goTo, next, prev, getIndex }
   حدث: micro-info-peek:change {detail: {index, count}}

   العقود المعلنة (مطابقة مرجع الفيديو سلوكيًا لا بصريًا):
   - البطاقة النشطة موسّطة وجزء من المجاور ظاهر (peek).
   - السحب يتبع المؤشر 1:1 أثناء الحركة (بلا انتقال) ويلتزم
     عند عتبة max(32px, 20% من عرض البطاقة) وإلا snap-back.
   - قفل المحور 8px: العمودي يُسلَّم للتمرير الطبيعي (pan-y محفوظ).
   - pointercancel/blur/إخفاء الصفحة → snap-back (إلغاء نظيف).
   - الأزرار والنقاط ولوحة المفاتيح تصل إلى كل بطاقة — السحب ليس
     الوسيلة الوحيدة. RTL: التالي يسارًا بصريًا (ترتيب منطقي).
   - prefers-reduced-motion: بلا انتقالات — الظهور فوري.
   ========================================================= */

(function () {
  'use strict';

  var AXIS_LOCK = 8;      /* بكسل — قفل محور السحب (نفس ثوابت carousel) */
  var COMMIT_RATIO = 0.2; /* نسبة عرض البطاقة لالتزام السحب */
  var COMMIT_MIN = 32;    /* أدنى عتبة التزام بالبكسل */

  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function prefersReducedMotion() {
    return !!(reduceQuery && reduceQuery.matches);
  }

  var stateOf = new WeakMap();

  /* ---------- SUI-007 (REPAIR-R1): رصد عرض العارض — نمط R3-UI01 من data.js ----------
     عقد المواصفة (A05): التوسيط يُقاس عند أول كشف لوجهة مخفية وعند تغيّر
     عرض العارض (حاوية أب أو نافذة) — بلا انتظار أول تفاعل من المستخدم.
     مراقب ResizeObserver واحد لكل شريط (WeakMap — التهيئة المزدوجة
     لـinit() لا تنشئ مراقبًا ثانيًا) يراقب العرض فقط؛ الاختفاء (عرض 0)
     لا يعيد القياس (سياسة العرض 0 الموثقة) والإظهار يطلق الرصد بنفسه
     فيعيد التوسيط. إعادة التوسيط تحفظ الفهرس والتركيز: goToIndex
     لنفس الفهرس مزامنة صامتة بلا حدث micro-info-peek:change ولا نقل
     تركيز. بيئة بلا ResizeObserver تبقي سلوك window-resize فقط
     (العقد القديم الموثق — المستهلك يعيد القياس عند الفتح).
     window.MicroInfoPeek.disconnect(root) يفصل المراقبين تحت جذر
     لدورة التنظيف (init يعيد الإلحاق عند الحاجة). */
  var viewportObservers = new WeakMap(); /* strip → ResizeObserver وحيد */
  var RESIZE_EPS = 0.5; /* فرق عرض يُعتبر تغيّرًا حقيقيًا (px) */

  function recenterStrip(strip, st) {
    if (st.raf) return; /* دمج النبضات المتتالية في إطار واحد */
    st.raf = requestAnimationFrame(function () {
      st.raf = null;
      if (st.count <= 0) return;
      var w = st.viewport.clientWidth;
      if (w <= 1) return; /* مخفي (عرض 0): لا إعادة قياس */
      if (st.lastWidth !== undefined && Math.abs(w - st.lastWidth) < RESIZE_EPS) return;
      st.lastWidth = w;
      goToIndex(strip, st.index, { animate: false }); /* الفهرس والتركيز محفوظان */
    });
  }

  function observeViewport(strip, st) {
    if (typeof ResizeObserver !== 'function') return; /* بيئة قديمة — عقد window-resize يبقى */
    if (viewportObservers.has(strip)) return; /* مراقب واحد لكل شريط — علامة الوجود */
    var ro = new ResizeObserver(function (entries) {
      var w = entries.length ? entries[0].contentRect.width : 0; /* العرض فقط */
      if (w <= 1) return; /* مخفي: احتفظ بآخر توسيط — الإظهار يطلق الرصد */
      recenterStrip(strip, st);
    });
    ro.observe(st.viewport);
    viewportObservers.set(strip, ro);
  }

  function rtlOf(strip) {
    return getComputedStyle(strip).direction === 'rtl';
  }

  function setX(st, x, animate) {
    st.x = x;
    if (animate && !prefersReducedMotion()) {
      st.track.style.transform = 'translateX(' + x + 'px)';
    } else {
      st.track.style.transition = 'none';
      st.track.style.transform = 'translateX(' + x + 'px)';
      void st.track.offsetWidth; /* إجبار إطار: لا انتقال مرئي */
      st.track.style.transition = '';
    }
  }

  /* تمركز بطاقة i فيزيائيًا (offsetLeft مستقل عن الاتجاه والانتقال الجاري) */
  function slideX(st, i) {
    var s = st.slides[i];
    return st.viewport.clientWidth / 2 - (s.offsetLeft + s.offsetWidth / 2);
  }

  function goToIndex(strip, i, opts) {
    var st = stateOf.get(strip);
    if (!st || st.count === 0) return;
    var animate = !(opts && opts.animate === false);
    var clamped = Math.max(0, Math.min(st.count - 1, i));
    setX(st, slideX(st, clamped), animate);
    if (clamped !== st.index) {
      st.index = clamped;
      update(strip, st);
      strip.dispatchEvent(new CustomEvent('micro-info-peek:change', {
        bubbles: true, detail: { index: st.index, count: st.count }
      }));
    } else {
      update(strip, st); /* مزامنة بعد snap-back */
    }
  }

  function update(strip, st) {
    /* R8-04: التركيز يُلتقط قبل تغيير حالة inert — إن كان داخل بطاقة
       ستصبح غير نشطة يُنقل مرة واحدة إلى العارض (هدف صالح داخل الشريط،
       tabindex=0) بلا نقل عشوائي عند كل تبديل وبلا بقاء في عنصر مخفي */
    var activeEl = document.activeElement;
    var focusedIdx = -1;
    if (activeEl) {
      for (var fi = 0; fi < st.slides.length; fi++) {
        if (st.slides[fi].contains(activeEl)) { focusedIdx = fi; break; }
      }
    }
    st.slides.forEach(function (slide, i) {
      var active = i === st.index;
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      slide.inert = !active; /* المجاور مرئي لا تفاعلي — كعقد info-strip */
    });
    if (focusedIdx >= 0 && focusedIdx !== st.index) {
      st.viewport.focus({ preventScroll: true });
    }
    if (st.prevBtn) st.prevBtn.disabled = st.index === 0 || st.count <= 1;
    if (st.nextBtn) st.nextBtn.disabled = st.index === st.count - 1 || st.count <= 1;
    if (st.position) st.position.textContent = (st.index + 1) + ' / ' + st.count;
    if (st.status) st.status.textContent = 'البطاقة ' + (st.index + 1) + ' من ' + st.count;
    if (st.pages) {
      Array.prototype.forEach.call(st.pages.querySelectorAll('[data-info-strip-page]'), function (b, i) {
        b.setAttribute('aria-current', i === st.index ? 'true' : 'false');
        b.setAttribute('aria-pressed', i === st.index ? 'true' : 'false');
      });
    }
  }

  /* ---------- السحب: تتبع المؤشر 1:1 (دورة حياة مغلقة على window) ---------- */
  function onPointerDown(strip, st, e) {
    if (st.count <= 1 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    st.drag = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      baseX: st.x,
      axis: null,
      handlers: null
    };
    st.suppressClick = false;
    st.track.classList.add('is-peek-dragging');
    st.viewport.classList.add('is-peek-grabbing');
    attachDragWindow(strip, st);
  }

  function attachDragWindow(strip, st) {
    var d = st.drag;
    if (!d || d.handlers) return;
    d.handlers = {
      move: function (e) { onPointerMove(strip, st, e); },
      up: function (e) { endDrag(strip, st, false, e); },
      cancel: function (e) { endDrag(strip, st, true, e); },
      blur: function () { endDrag(strip, st, true, null); },
      vis: function () { if (document.visibilityState === 'hidden') endDrag(strip, st, true, null); }
    };
    window.addEventListener('pointermove', d.handlers.move, true);
    window.addEventListener('pointerup', d.handlers.up, true);
    window.addEventListener('pointercancel', d.handlers.cancel, true);
    window.addEventListener('blur', d.handlers.blur);
    document.addEventListener('visibilitychange', d.handlers.vis);
  }

  function detachDragWindow(st, d) {
    if (!d || !d.handlers) return;
    window.removeEventListener('pointermove', d.handlers.move, true);
    window.removeEventListener('pointerup', d.handlers.up, true);
    window.removeEventListener('pointercancel', d.handlers.cancel, true);
    window.removeEventListener('blur', d.handlers.blur);
    document.removeEventListener('visibilitychange', d.handlers.vis);
    d.handlers = null;
  }

  function onPointerMove(strip, st, e) {
    var d = st.drag;
    if (!d || e.pointerId !== d.id) return;
    var dx = e.clientX - d.startX;
    var dy = e.clientY - d.startY;
    if (!d.axis) {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      d.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'cancel';
      if (d.axis === 'cancel') { endDrag(strip, st, true); return; }
      try { st.viewport.setPointerCapture(d.id); } catch (err) { /* غير حرِج */ }
    }
    if (d.axis !== 'x') return;
    /* تتبع حرفي: بلا انتقال؛ مقاومة عند الطرفين تصفّر الحركة */
    var proposed = d.baseX + dx;
    var rtl = rtlOf(strip);
    var atStartEdge = st.index === 0 && (rtl ? dx < 0 : dx > 0);
    var atEndEdge = st.index === st.count - 1 && (rtl ? dx > 0 : dx < 0);
    st.drag.dx = dx;
    setX(st, (atStartEdge || atEndEdge) ? d.baseX : proposed, false);
    e.preventDefault();
  }

  function endDrag(strip, st, canceled, e) {
    var d = st.drag;
    if (!d) return;
    if (e && e.pointerId !== undefined && e.pointerId !== d.id) return;
    detachDragWindow(st, d);
    st.drag = null;
    st.track.classList.remove('is-peek-dragging');
    st.viewport.classList.remove('is-peek-grabbing');
    st.suppressClick = d.axis === 'x';
    try { st.viewport.releasePointerCapture(d.id); } catch (err) { /* أُفرج عنه */ }
    var slideW = st.slides[st.index] ? st.slides[st.index].offsetWidth : 0;
    var threshold = Math.max(COMMIT_MIN, slideW * COMMIT_RATIO);
    var dx = d.dx || 0;
    if (canceled || Math.abs(dx) < threshold) {
      goToIndex(strip, st.index, { animate: true }); /* snap-back */
      return;
    }
    var rtl = rtlOf(strip);
    var step = rtl ? (dx > 0 ? 1 : -1) : (dx < 0 ? 1 : -1);
    goToIndex(strip, st.index + step, { animate: true });
  }

  /* ---------- لوحة المفاتيح: ترتيب منطقي (RTL: التالي يسارًا) ---------- */
  function wireKeys(strip, st) {
    strip.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || st.count === 0) return;
      var target = e.target;
      if (target && target.closest && target.closest('input, textarea, select, [contenteditable="true"]')) return;
      var rtl = rtlOf(strip);
      var handled = true;
      if (e.key === 'ArrowRight') { rtl ? prev(strip) : next(strip); }
      else if (e.key === 'ArrowLeft') { rtl ? next(strip) : prev(strip); }
      else if (e.key === 'Home') { goToIndex(strip, 0); }
      else if (e.key === 'End') { goToIndex(strip, st.count - 1); }
      else { handled = false; }
      if (handled) e.preventDefault();
    });
  }

  function initStrip(strip) {
    if (strip.hasAttribute('data-info-peek-ready')) return;
    var viewport = strip.querySelector('[data-info-strip-viewport]');
    var track = strip.querySelector('[data-info-strip-track]');
    var slides = track ? Array.prototype.slice.call(track.children).filter(function (n) {
      return n.classList.contains('m-info-strip__slide');
    }) : [];
    var controls = strip.querySelector('[data-info-strip-controls]');
    var pages = strip.querySelector('[data-info-strip-pages]');
    var status = strip.querySelector('[data-info-strip-status]');
    var empty = strip.querySelector('[data-info-strip-empty]');
    /* R8-01: عناصر DOM بأسماء واضحة (prevBtn/nextBtn) — لا تظلّل
       دالتي التنقل prev()/next() اللتين تستدعيهما المعالجات */
    var prevBtn = strip.querySelector('[data-info-strip-prev]');
    var nextBtn = strip.querySelector('[data-info-strip-next]');
    var position = strip.querySelector('[data-info-strip-position]');
    if (!viewport || !track) return;

    strip.setAttribute('data-info-peek-ready', '');

    /* R8-05: صفر بطاقة — العقد نفسه: صف الفراغ يملك العرض، والمنفذ
       والتحكمات مخفيان، والحالة موسومة جاهزة (بلا محرك تنقل) */
    if (!slides.length) {
      viewport.hidden = true;
      if (controls) controls.hidden = true;
      if (empty) empty.hidden = false;
      stateOf.set(strip, {
        viewport: viewport, track: track, slides: [],
        prevBtn: prevBtn, nextBtn: nextBtn, position: position, status: status, pages: pages,
        index: -1, x: 0, count: 0, drag: null, suppressClick: false
      });
      return;
    }

    if (!strip.hasAttribute('tabindex')) strip.setAttribute('tabindex', '0');
    if (empty) empty.hidden = true;
    /* R8-05: بطاقة واحدة — بلا تحكمات تنقل غير لازمة */
    if (slides.length < 2 && controls) controls.hidden = true;

    var st = {
      viewport: viewport, track: track, slides: slides,
      prevBtn: prevBtn, nextBtn: nextBtn, position: position, status: status, pages: pages,
      index: 0, x: 0, count: slides.length, drag: null, suppressClick: false
    };
    stateOf.set(strip, st);

    if (pages) {
      pages.setAttribute('role', 'group');
      if (!pages.hasAttribute('aria-label')) pages.setAttribute('aria-label', 'اختيار البطاقة');
      pages.textContent = '';
      slides.forEach(function (_, i) {
        var page = document.createElement('button');
        page.type = 'button';
        page.className = 'm-info-strip__page';
        page.setAttribute('data-info-strip-page', '');
        page.setAttribute('aria-label', 'عرض البطاقة ' + (i + 1));
        page.setAttribute('aria-current', i === 0 ? 'true' : 'false');
        page.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        page.addEventListener('click', function () { goToIndex(strip, i, false); });
        pages.appendChild(page);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(strip); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(strip); });

    viewport.addEventListener('pointerdown', function (e) { onPointerDown(strip, st, e); });
    viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });
    viewport.addEventListener('click', function (e) {
      if (st.suppressClick) { e.preventDefault(); e.stopPropagation(); st.suppressClick = false; }
    }, true);
    wireKeys(strip, st);

    /* SUI-007: window-resize يبقى (احتياط لبيئة بلا ResizeObserver
       ولتغيّر النافذة) ويُوجّه عبر recenterStrip نفسها — حماية EPS
       تمنع العمل المزدوج مع الرصد (rAF واحد لكل نبضة). */
    window.addEventListener('resize', function () { recenterStrip(strip, st); });
    observeViewport(strip, st);

    if (reduceQuery && reduceQuery.addEventListener) {
      reduceQuery.addEventListener('change', function () {
        goToIndex(strip, st.index, { animate: false });
      });
    }

    update(strip, st);
    /* تمركز أول بطاقة بعد الاستقرار (الخطوط قد تغيّر العرض) — يخزّن
       عرض العرض الأول في lastWidth (SUI-007) */
    recenterStrip(strip, st);
  }

  function next(strip) { var st = stateOf.get(strip); if (st) goToIndex(strip, st.index + 1); }
  function prev(strip) { var st = stateOf.get(strip); if (st) goToIndex(strip, st.index - 1); }

  window.MicroInfoPeek = {
    init: function (root) {
      var scope = root || document;
      if (scope.matches && scope.matches('[data-info-peek]')) initStrip(scope);
      scope.querySelectorAll('[data-info-peek]').forEach(initStrip);
    },
    goTo: goToIndex,
    next: next,
    prev: prev,
    getIndex: function (strip) {
      var st = stateOf.get(strip);
      return st ? st.index : -1;
    },
    /* SUI-007: فصل مراقبي الرصد تحت جذر لدورة التنظيف؛ init يظل متاحًا
       ويعيد الإلحاق عند الحاجة (نفس عقد MicroData.disconnect في data.js).
       الجذر نفسه إن كان شريطًا يُفصل أيضًا (init يعالج الجذر-الذات كذلك) */
    disconnect: function (root) {
      var scope = root || document;
      var strips = [];
      if (scope.matches && scope.matches('[data-info-peek]')) strips.push(scope);
      Array.prototype.push.apply(strips, scope.querySelectorAll('[data-info-peek]'));
      strips.forEach(function (strip) {
        var ro = viewportObservers.get(strip);
        if (ro) { ro.disconnect(); viewportObservers.delete(strip); }
        var st = stateOf.get(strip);
        if (st) st.lastWidth = undefined; /* init لاحق يعيد القياس من جديد */
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function () { window.MicroInfoPeek.init(); });
  if (document.readyState !== 'loading') window.MicroInfoPeek.init();
})();
