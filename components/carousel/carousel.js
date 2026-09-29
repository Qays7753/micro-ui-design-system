/* =========================================================
   Micro UI — سلوك عارض البطاقات القابل للسحب (Carousel)
   الملف: components/carousel/carousel.js
   الدور: التنقل المنطقي (سابق/تالي/مباشر) + السحب pointer/touch
   + مؤشر الموضع + لوحة المفاتيح + RTL + تقليل الحركة.

   القواعد الثابتة لهذا الملف:
   - لا autoplay ولا أي مؤقّت تبديل (لا setInterval/setTimeout دوري —
     المؤقت الوحيد إن استُخدم هو requestAnimationFrame لمزامنة قياس
     بعد resize، لا يبدّل بطاقة أبدًا).
   - لا مكتبة خارجية ولا خدمة بعيدة ولا عشوائية.
   - السحب ليس الوسيلة الوحيدة: الأزرار والنقاط ولوحة المفاتيح
     تصل إلى كل بطاقة.
   - previous/next حسب الترتيب المنطقي (ترتيب القراءة) لا اسم
     الاتجاه الفيزيائي: في RTL «التالي» يظهر يسارًا بصريًا، وفي
     LTR يظهر يمينًا — والمواضع الفيزيائية تُقاس من الهندسة نفسها
     (getBoundingClientRect) فتعمل الصيغة مع الاتجاهين بلا تفرّع.

   ثوابت السحب الموثقة (عدّلها هنا فقط):
   - AXIS_LOCK = 8px   : قفل المحور بعد أول إزاحة — تجاوزها
     عموديًا يُلغي السحب ويُسلّم الحركة للتمرير الطبيعي.
   - COMMIT نسبة 0.2 من عرض البطاقة بحد أدنى 32px: السحب أقل
     من العتبة يلغي نفسه (snap-back) ولا يبدّل بطاقة.
   - إلغاء السحب: pointercancel (المتصفح يأخذ الحركة عموديًا
     مع touch-action: pan-y) أو خروج أقل من العتبة أو تجاوز
     الطرفين — كله يرجع إلى أقرب بطاقة صالحة.

   دورة حياة السحب (إصلاح PR#5): أثناء السحب تُسجَّل أدوات تتبع
   المؤشر على window/document (pointermove/pointerup/pointercancel
   في طور الالتقاط + blur للنافذة + visibilitychange للإخفاء)
   وتُزال حتمًا عند نهاية السحب مهما كان مسار الخروج — فلا تبقى
   حالة is-dragging عالقة إذا أُفلت الزر خارج الـviewport أو خرج
   المؤشر من الصفحة أو فُقد التركيز. pointer capture (عند قفل
   المحور فقط) تقوية إضافية لا بديل عن التنظيف على window، ولا
   يُؤخذ capture عند pointerdown حتى لا يسرق نقر الأزرار داخل
   البطاقات. السحب العمودي يُسلَّم للتمرير الطبيعي كما هو
   (touch-action: pan-y لا يُكسر)، والسحب الأفقي يكبت النقرة
   المتبقية (suppressClick) حتى لا تُفسَّر كبطاقة أو توسعة.

   الأسهم داخل المحتوى التفاعلي (إصلاح PR#5): لا اعتراض
   ArrowLeft/ArrowRight/Home/End عندما يكون التركيز داخل عنصر
   يحتاج الأسهم محليًا: input/textarea/select/contenteditable/
   [role="slider"]/summary/رابط — أو زر داخل محتوى البطاقة.
   تبقى الأسهم تعمل على سطح العارض وعناصر تحكمه (prev/next/النقاط)
   وEnter/Space على أزرار Carousel أصلية لم تُلمس.

   التوسعة داخل مكانها (قرار PROPOSED — بانتظار اعتماد المالك):
   آلية عامة لا تعرف محتوى البطاقة: زر [data-card-expand] داخل
   شريحة يبدّل data-expanded على الشريحة وaria-expanded على الزر
   وhidden على منطقة [data-card-details] (أو المعرَّفة بـ
   aria-controls). الملخص المغلق هو HTML مقصود من المستهلك —
   لا قصّ CSS ولا max-height ولا overflow: hidden. البطاقة
   النشطة فقط تُوسَّع: الانتقال إلى بطاقة أخرى يطوي الموسّعة
   وتظهر الجديدة مغلقة، والأسهم/النقاط/السحب لا تُوسّع أبدًا،
   والنقر على زر توسعة بطاقة غير النشطة ينقل إليها دون توسعة.
   أزرار التوسعة: type="button" واسم واضح وaria-expanded
   وaria-controls — وتعمل باللمس ولوحة المفاتيح (Enter/Space).

   الواجهة العامة:
   window.MicroCarousel = {
     init(root?)           — يربط كل [data-carousel] تحت الجذر
     goTo(carousel, i)     — بطاقة محددة (منطقيًا)
     next(carousel) / prev(carousel)
     getIndex(carousel)
   }
   حدث عام: micro-carousel:change {detail: {index, count}}
   ========================================================= */

(function () {
  'use strict';

  var AXIS_LOCK = 8;      /* بكسل — قفل محور السحب */
  var COMMIT_RATIO = 0.2; /* نسبة عرض البطاقة لالتزام السحب */
  var COMMIT_MIN = 32;    /* أدنى عتلام التزام بالبكسل */
  var DOTS_MAX = 6;       /* أقصى عدد نقاط قبل الالتفاف (مقترح) */

  var reduceMotionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  function prefersReducedMotion() {
    return !!(reduceMotionQuery && reduceMotionQuery.matches);
  }

  var stateOf = new WeakMap();

  function parts(carousel) {
    return {
      root: carousel,
      viewport: carousel.querySelector('[data-viewport]'),
      track: carousel.querySelector('[data-track]'),
      slides: [].slice.call(carousel.querySelectorAll('[data-carousel-slide]')),
      prev: carousel.querySelector('[data-prev]'),
      next: carousel.querySelector('[data-next]'),
      status: carousel.querySelector('[data-status]'),
      dots: carousel.querySelector('[data-dots]')
    };
  }

  function directionOf(carousel) {
    return getComputedStyle(carousel).direction === 'rtl' ? 'rtl' : 'ltr';
  }

  /* الموضع الفيزيائي الحالي للـtrack (px) — يُتتبّع في الحالة */

  function setX(st, x, animate) {
    st.x = x;
    if (animate && !prefersReducedMotion()) {
      st.track.style.transform = 'translateX(' + x + 'px)';
    } else {
      /* فوري بلا انتقال: نوقف الانتقال لحظة التطبيق ثم نعيده */
      st.track.style.transition = 'none';
      st.track.style.transform = 'translateX(' + x + 'px)';
      void st.track.offsetWidth; /* إجبار إطار حتى لا يُرى انتقال */
      st.track.style.transition = '';
    }
  }

  /* الموضع المطلق الذي يوسّط بطاقة i — من قيم layout المستقلة عن
     transform (offsetLeft/offsetWidth): لا تتأثر بانتقال جارٍ
     ولا بالاتجاه (offsetLeft فيزيائي). مرجع الإحداثيات: الـtrack
     نفسه (offsetParent للشرائح لكونه position:relative)، وأصل
     الـtrack الساكن = حافة محتوى الـviewport (طفل block بعرض
     كامل بلا هوامش) — لذلك مركز الشاشة بإحداثيات الـtrack = W/2. */
  function slideX(st, i) {
    var s = st.slides[i];
    return st.viewport.clientWidth / 2 - (s.offsetLeft + s.offsetWidth / 2);
  }

  function goToIndex(carousel, i, opts) {
    var st = stateOf.get(carousel);
    if (!st || st.count === 0) return;
    var animate = !(opts && opts.animate === false);
    var clamped = Math.max(0, Math.min(st.count - 1, i));
    setX(st, slideX(st, clamped), animate);
    if (clamped !== st.index) {
      /* الانتقال إلى بطاقة أخرى يطوي الموسّعة دائمًا — والجديدة تظهر مغلقة،
         ولا تُوسّع أبدًا (التوسعة من زر صريح فقط). */
      collapseSlide(st, st.slides[st.index]);
      st.index = clamped;
      update(carousel, st);
      carousel.dispatchEvent(new CustomEvent('micro-carousel:change', {
        bubbles: true,
        detail: { index: st.index, count: st.count }
      }));
    } else {
      update(carousel, st); /* snap-back بعد إلغاء سحب: مزامنة الحالة */
    }
  }

  /* أزرار الحالة: معطل فعليًا عند الطرف — لا تفاعل مضلل */
  function update(carousel, st) {
    var rtl = directionOf(carousel) === 'rtl';
    st.slides.forEach(function (slide, i) {
      var isCurrent = i === st.index;
      slide.setAttribute('data-current', isCurrent ? 'true' : 'false');
      slide.setAttribute('aria-roledescription', 'بطاقة');
      var name = slide.getAttribute('data-card-label') || ('بطاقة ' + (i + 1));
      slide.setAttribute('aria-label', name + '، البطاقة ' + (i + 1) + ' من ' + st.count);
      /* الصف الحالي فقط قابل للتذكر في تبويب العارض نفسه لا محتواه */
      slide.removeAttribute('aria-hidden');
      slide.removeAttribute('inert');
    });

    /* البطاقات المخفية كليًا خارج القناع: inert — لا تركيز في غير المرئي.
       الحساب من قيم layout (offsetLeft) + الموضع المستهدف x — لا من
       مستطيلات منتصف الانتقال، فتكون النتيجة صحيحة لحظة التبديل نفسه.
       المجاورة الظاهرة جزئيًا تبقى مقروءة (القناع للمعاينة لا للإخفاء). */
    var vpW = st.viewport.clientWidth;
    st.slides.forEach(function (slide) {
      var left = slide.offsetLeft + st.x;
      var right = left + slide.offsetWidth;
      var fullyOutside = right <= 1 || left >= vpW - 1;
      if (fullyOutside) slide.setAttribute('inert', '');
      else slide.removeAttribute('inert');
    });

    /* أزرار الطرفين */
    var atStart = st.index === 0;
    var atEnd = st.index === st.count - 1;
    if (st.prev) st.prev.disabled = atStart || st.count <= 1;
    if (st.next) st.next.disabled = atEnd || st.count <= 1;

    /* مؤشر الموضع — نص إتاحي صريح */
    if (st.status) {
      st.status.textContent = st.count === 0
        ? 'لا توجد بطاقات'
        : 'البطاقة ' + (st.index + 1) + ' من ' + st.count;
    }

    /* النقاط: تُبنى مرة، وتُحدَّث الحالية هنا */
    if (st.dots) {
      if (st.count > 1 && !st.dotsBuilt) buildDots(carousel, st);
      if (st.count > 1) {
        st.dots.hidden = false;
        [].slice.call(st.dots.children).forEach(function (btn, i) {
          if (i === st.index) btn.setAttribute('aria-current', 'true');
          else btn.removeAttribute('aria-current');
        });
      } else {
        st.dots.hidden = true;
      }
    }

    carousel.setAttribute('data-dir', rtl ? 'rtl' : 'ltr');
  }

  function buildDots(carousel, st) {
    st.dots.textContent = '';
    for (var i = 0; i < st.count; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'm-carousel__dot';
      b.setAttribute('aria-label', 'الانتقال إلى البطاقة ' + (i + 1) + ' من ' + st.count);
      (function (idx) {
        b.addEventListener('click', function () { goToIndex(carousel, idx); });
      })(i);
      st.dots.appendChild(b);
    }
    st.dotsBuilt = true;
  }

  /* ---------- السحب (pointer events — لا مكتبات) ----------
     دورة الحياة مغلقة في كل المسارات: يبدأ على الـviewport ويُتابع
     على window (طور الالتقاط) حتى لو خرج المؤشر خارج الـviewport أو
     من الصفحة، ويُنظَّف حتمًا عند pointerup/pointercancel/blur/إخفاء
     الصفحة — فلا تبقى is-dragging عالقة أبدًا. */
  function onPointerDown(carousel, st, e) {
    if (st.count <= 1 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    st.drag = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      baseX: st.x,
      axis: null,
      handlers: null
    };
    st.suppressClick = false; /* بداية تفاعل جديد: النقر صالح حتى يثبت سحب أفقي */
    st.root.classList.add('is-dragging');
    attachDragWindow(carousel, st);
  }

  /* تتبع المؤشر على window أثناء السحب — يُزال في endDrag مهما كان المسار */
  function attachDragWindow(carousel, st) {
    var d = st.drag;
    if (!d || d.handlers) return;
    d.handlers = {
      move: function (e) { onPointerMove(carousel, st, e); },
      up: function (e) { endDrag(carousel, st, false, e); },
      cancel: function (e) { endDrag(carousel, st, true, e); },
      blur: function () { endDrag(carousel, st, true, null); },
      vis: function () { if (document.visibilityState === 'hidden') endDrag(carousel, st, true, null); }
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

  function onPointerMove(carousel, st, e) {
    var d = st.drag;
    if (!d || e.pointerId !== d.id) return;
    var dx = e.clientX - d.startX;
    var dy = e.clientY - d.startY;
    if (!d.axis) {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      /* قفل المحور: العمودي يُسلَّم للتمرير الطبيعي — لا نحوّل كل لمس إلى سحب */
      d.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'cancel';
      if (d.axis === 'cancel') { endDrag(carousel, st, true); return; }
      try { st.viewport.setPointerCapture(d.id); } catch (err) { /* غير حرِج */ }
    }
    if (d.axis !== 'x') return;
    /* تتبّع المؤشر مباشرة (بلا انتقال) — المقاومة عند الطرفين تصفّر الحركة */
    var proposed = d.baseX + dx;
    var atStartEdge = st.index === 0 && ((directionOf(carousel) === 'rtl') ? dx < 0 : dx > 0);
    var atEndEdge = st.index === st.count - 1 && ((directionOf(carousel) === 'rtl') ? dx > 0 : dx < 0);
    st.drag.dx = dx;
    setX(st, (atStartEdge || atEndEdge) ? d.baseX : proposed, false);
    e.preventDefault();
  }

  function endDrag(carousel, st, canceled, e) {
    var d = st.drag;
    if (!d) return;
    /* مؤشر آخر لا ينهي سحبًا جاريًا لمؤشره */
    if (e && e.pointerId !== undefined && e.pointerId !== d.id) return;
    detachDragWindow(st, d);
    st.drag = null;
    st.root.classList.remove('is-dragging');
    /* سحب أفقي مثبت (حتى دون الالتزام) يكبت النقرة المتبقية حتى لا
       تُفسَّر كبطاقة/توسعة بعد الإفلات خارج البطاقة نفسها */
    st.suppressClick = d.axis === 'x';
    try { st.viewport.releasePointerCapture(d.id); } catch (err) { /* أُفرج عنه */ }
    var slideW = st.slides[st.index] ? st.slides[st.index].offsetWidth : 0;
    var threshold = Math.max(COMMIT_MIN, slideW * COMMIT_RATIO);
    var dx = d.dx || 0;
    if (canceled || Math.abs(dx) < threshold) {
      goToIndex(carousel, st.index, { animate: true }); /* snap-back — إلغاء السحب */
      return;
    }
    var rtl = directionOf(carousel) === 'rtl';
    /* اتجاه الالتزام فيزيائي: في RTL السحب يمينًا (+) يجلب «التالي» (يسارًا) */
    var step = rtl ? (dx > 0 ? 1 : -1) : (dx < 0 ? 1 : -1);
    goToIndex(carousel, st.index + step, { animate: true });
  }

  /* ---------- التوسعة داخل مكانها (آلية عامة — قرار PROPOSED) ----------
     العارض لا يعرف محتوى البطاقة: يبدّل حالة فقط، والملخص والتفاصيل
     HTML مقصود من المستهلك — لا قصّ CSS ولا max-height+overflow.
     زر [data-card-expand] يملك type="button" وaria-expanded
     وaria-controls (أو منطقة [data-card-details] داخل الشريحة نفسها). */
  function expandRegionOf(slide, btn) {
    var id = btn ? btn.getAttribute('aria-controls') : null;
    if (id) {
      var byId = document.getElementById(id);
      if (byId && slide.contains(byId)) return byId;
    }
    return slide.querySelector('[data-card-details]');
  }

  function setToggleLabel(btn, open) {
    if (!btn) return;
    var t = btn.querySelector('[data-card-expand-text]') || btn;
    var v = open ? btn.getAttribute('data-label-open') : btn.getAttribute('data-label-closed');
    if (v) t.textContent = v;
  }

  function collapseSlide(st, slide) {
    if (!slide || !slide.hasAttribute('data-expanded')) return;
    slide.removeAttribute('data-expanded');
    var btn = slide.querySelector('[data-card-expand]');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    setToggleLabel(btn, false);
    var region = expandRegionOf(slide, btn);
    if (region) region.hidden = true;
  }

  function toggleExpand(st, slide) {
    var btn = slide ? slide.querySelector('[data-card-expand]') : null;
    if (!btn) return;
    var open = slide.hasAttribute('data-expanded');
    slide.setAttribute('data-expanded', open ? 'false' : 'true');
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    setToggleLabel(btn, !open);
    var region = expandRegionOf(slide, btn);
    if (region) region.hidden = open; /* عند الفتح يُكشف الكامل — الارتفاع يتبع المحتوى */
  }

  function wireExpand(carousel, st) {
    carousel.addEventListener('click', function (e) {
      var btn = (e.target && e.target.closest) ? e.target.closest('[data-card-expand]') : null;
      if (!btn || !carousel.contains(btn)) return;
      /* السحب الأفقي لا يوسّع: النقرة المتبقية بعد سحب مثبت تُكبت —
         نقرات أصل مؤشر فقط (detail > 0)؛ نقرات لوحة المفاتيح
         (Enter/Space → detail = 0) تمر دائمًا ولا تُكبت أبدًا */
      if (st.suppressClick && e.detail > 0) { st.suppressClick = false; return; }
      var slide = btn.closest('[data-carousel-slide]');
      if (!slide) return;
      /* البطاقة النشطة فقط تُوسّع؛ زر بطاقة غير النشطة ينقل إليها دون توسعة */
      if (st.slides[st.index] !== slide) {
        goToIndex(carousel, [].indexOf.call(st.slides, slide));
        return;
      }
      toggleExpand(st, slide);
    });
  }

  function wireDrag(carousel, st) {
    /* البداية على الـviewport فقط؛ المتابعة والنهاية على window أثناء
       السحب (attachDragWindow) حتى يعمل الإفلات خارج الـviewport. */
    st.viewport.addEventListener('pointerdown', function (e) { onPointerDown(carousel, st, e); });
    /* منع سحب الصور/الروابط الأصلي داخل البطاقات أثناء سحب العارض */
    st.viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  /* ---------- لوحة المفاتيح (الترتيب المنطقي لا الفيزيائي) ----------
     حارس الأسهم: لا اعتراض داخل العناصر التي تحتاج الأسهم محليًا
     (input/textarea/select/contenteditable/slider/summary/رابط)
     ولا داخل أزرار محتوى البطاقة؛ وتبقى الأسهم تعمل على سطح
     العارض وعناصر تحكمه. Enter/Space أصلية على الأزرار ولم تُلمس. */
  function isLocalArrowTarget(el) {
    if (!el || !el.closest) return false;
    return !!el.closest(
      'input:not([type="hidden"]), textarea, select, summary, a[href], ' +
      '[contenteditable="true"], [contenteditable=""], [role="slider"]');
  }
  function isCarouselControl(el, carousel) {
    if (!el || !el.closest) return false;
    var ctl = el.closest('[data-prev], [data-next], [data-dots]');
    return !!ctl && carousel.contains(ctl);
  }
  function isCardContentButton(el, carousel) {
    if (!el || !el.closest) return false;
    var btn = el.closest('button');
    return !!btn && carousel.contains(btn) && !!btn.closest('[data-carousel-slide]');
  }
  function wireKeys(carousel, st) {
    carousel.addEventListener('keydown', function (e) {
      if (st.count === 0) return;
      var target = e.target;
      /* 1) حقول وعناصر تفاعلية تحتاج الأسهم محليًا: لا اعتراض ولا منع افتراضي */
      if (isLocalArrowTarget(target)) return;
      /* 2) زر داخل محتوى البطاقة: أسهمه محلية (لا تنقل العارض)؛
         أما أزرار تحكم العارض نفسه (prev/next/النقاط) فتبقى تنقل بالأسهم */
      if (!isCarouselControl(target, carousel) && isCardContentButton(target, carousel)) return;
      var rtl = directionOf(carousel) === 'rtl';
      var handled = true;
      switch (e.key) {
        case 'ArrowRight': rtl ? prev(carousel) : next(carousel); break;
        case 'ArrowLeft':  rtl ? next(carousel) : prev(carousel); break;
        case 'Home': goToIndex(carousel, 0); break;
        case 'End':  goToIndex(carousel, st.count - 1); break;
        default: handled = false;
      }
      if (handled) e.preventDefault();
    });
  }

  /* ---------- إعادة القياس (بلا تبديل بطاقات) ---------- */
  function wireResize(carousel, st) {
    window.addEventListener('resize', function () {
      if (st.raf) return;
      st.raf = requestAnimationFrame(function () {
        st.raf = null;
        if (st.count > 0) goToIndex(carousel, st.index, { animate: false });
      });
    });
  }

  function setup(carousel) {
    if (stateOf.get(carousel)) return; /* إعادة init آمنة */
    var st = parts(carousel);
    st.index = 0;
    st.x = 0;
    st.count = st.slides.length;
    st.drag = null;
    st.suppressClick = false;
    st.dotsBuilt = false;
    stateOf.set(carousel, st);

    carousel.setAttribute('role', 'group');
    carousel.setAttribute('aria-roledescription', 'عارض بطاقات');
    if (!carousel.hasAttribute('aria-label') && carousel.hasAttribute('data-carousel-label')) {
      carousel.setAttribute('aria-label', carousel.getAttribute('data-carousel-label'));
    }
    st.track.setAttribute('data-track-state', 'idle');

    if (st.prev) st.prev.addEventListener('click', function () { prev(carousel); });
    if (st.next) st.next.addEventListener('click', function () { next(carousel); });

    wireKeys(carousel, st);
    wireDrag(carousel, st);
    wireExpand(carousel, st);
    wireResize(carousel, st);

    if (reduceMotionQuery && reduceMotionQuery.addEventListener) {
      reduceMotionQuery.addEventListener('change', function () {
        goToIndex(carousel, st.index, { animate: false });
      });
    }

    update(carousel, st);
    /* تمركز البطاقة الأولى بعد الاستقرار (خطوط الويب قد تغيّر العرض) */
    requestAnimationFrame(function () {
      goToIndex(carousel, st.index, { animate: false });
    });
  }

  function next(carousel) { var st = stateOf.get(carousel); if (st) goToIndex(carousel, st.index + 1); }
  function prev(carousel) { var st = stateOf.get(carousel); if (st) goToIndex(carousel, st.index - 1); }

  window.MicroCarousel = {
    init: function (root) {
      (root || document).querySelectorAll('[data-carousel]').forEach(setup);
    },
    goTo: goToIndex,
    next: next,
    prev: prev,
    getIndex: function (carousel) {
      var st = stateOf.get(carousel);
      return st ? st.index : -1;
    }
  };

  document.addEventListener('DOMContentLoaded', function () { window.MicroCarousel.init(); });
  if (document.readyState !== 'loading') window.MicroCarousel.init();
})();
