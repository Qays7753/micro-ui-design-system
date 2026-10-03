/* =========================================================
   Micro UI — سلوك مكوّن الأزرار (B01)
   الملف: components/buttons/buttons.js
   الدور: عقد عام للمكوّن فقط — لا يحتوي أي سلوك عرض تجريبي.
   المحاكاة (المؤقتات، رسالة الاكتمال، عدّاد التصفية) في
   previews/buttons/board.js — المستهلك يحدد بداية التحميل ونهايته.

   مثال استخدام أدنى (خارج لوحة المعاينة):
   ─────────────────────────────────────────────────────────
   <link rel="stylesheet" href="shared/tokens.css">
   <link rel="stylesheet" href="components/buttons/buttons.css">
   <button class="m-btn m-btn--primary" data-loading-label="جارٍ الحفظ">
     حفظ العملية
   </button>
   <script src="components/buttons/buttons.js"></script>
   <script>
     var btn = document.querySelector('.m-btn');
     btn.addEventListener('click', function () {
       MicroButtons.setLoading(btn, true);          // المستهلك يبدأ
       fetch('/api/save').then(function () {
         MicroButtons.setLoading(btn, false);       // والمستهلك ينهي
       });
     });
   </script>

   مثال عملي كامل: previews/buttons/example-usage.html
   ========================================================= */

(function () {
  'use strict';

  /* حالة كل زر تُحفظ في WeakMap (لا تلوّث DOM): تسمية aria-label
     الأصلية ووجودها — تُحفظ مرة واحدة عند بدء التحميل وتُسترجع بدقة. */
  var state = new WeakMap();

  /* أزرار رُكّبت لها حراسة التفعيل مرة واحدة؛ المستمعون يفحصون
     حالة aria-busy لحظة الحدث فتصلح لكل دورات التحميل المتكررة. */
  var guarded = new WeakSet();

  /* حراسة تفعيل أثناء التحميل — جزء من عقد المكوّن وليست من اللوحة:
     pointer-events:none يمنع المؤشر فقط؛ أما Enter/Space بلوحة المفاتيح
     فيولّدان حدث click على الزر المركّز. لذلك نحجز click في مرحلة
     الالتقاط (يشمل الماوس واللمس وEnter/Space معًا) ونمنع أيضًا
     keydown الخاص بـ Enter/Space كي لا يظهر ضغط مضلل. */
  function ensureActivationGuard(btn) {
    if (guarded.has(btn)) return;
    guarded.add(btn);
    function busy() { return btn.getAttribute('aria-busy') === 'true'; }
    btn.addEventListener('click', function (e) {
      if (busy()) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
    btn.addEventListener('keydown', function (e) {
      if (busy() && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
  }

  /* زر نصي بلا أيقونة: يُغلّف النص الظاهر في span.m-btn__label كي يمكن
     إبقاؤه محفوظ المكان أثناء التحميل (opacity:0 — باقٍ في شجرة الإتاحة
     فلا يفقد الزر اسمه) مع توسيط المؤشر. التغليف يُعكس عند التوقف،
     ولا يمس عناصر الأبناء (كالعدّاد) ولا spans المستهلك نفسه. */
  function wrapTextLabel(btn) {
    if (btn.querySelector(':scope > .m-btn__label')) return; /* مغلّف مسبقًا */
    var nodes = [].slice.call(btn.childNodes).filter(function (n) {
      return n.nodeType === 3 && n.textContent.trim() !== '';
    });
    if (!nodes.length) return;
    nodes.forEach(function (n) {
      var span = document.createElement('span');
      span.className = 'm-btn__label';
      span.textContent = n.textContent;
      btn.replaceChild(span, n);
    });
    btn.dataset.labelWrapped = '1';
  }

  function unwrapTextLabel(btn) {
    if (btn.dataset.labelWrapped !== '1') return;
    [].slice.call(btn.querySelectorAll(':scope > .m-btn__label')).forEach(function (span) {
      btn.replaceChild(document.createTextNode(span.textContent), span);
    });
    btn.normalize();
    delete btn.dataset.labelWrapped;
  }

  /* يضمن وجود مؤشر التحميل في موضع صحيح:
     - زر بأيقونة: المؤشر يحل مكان الأيقونة نفسها (فتحة 20px / 24px
       الدائري) فيبقى عرض الزر وزاوية النص كما هما.
     - زر نصي بلا أيقونة (B الافتراضي، وm-btn--loading-slot توافقي):
       التسمية تبقى ظاهرة والمؤشر في الفتحة المحجوزة في الحشو —
       لا تغليف ولا إخفاء للنص.
     - زر نصي مع m-btn--loading-replace (A توافقي صريح): النص يبقى محفوظ المكان
       (opacity:0) والمؤشر يتوسط الزر (صف is-loading--text) — الأبعاد
       ثابتة بالبنية. */
  function ensureSpinner(btn) {
    var spinner = btn.querySelector(':scope > .m-btn__spinner');
    if (spinner) return;
    spinner = document.createElement('span');
    spinner.className = 'm-btn__spinner';
    spinner.setAttribute('aria-hidden', 'true');
    var icon = btn.querySelector(':scope > .m-btn__icon');
    if (icon) {
      icon.parentElement.insertBefore(spinner, icon); /* فتحة الأيقونة نفسها */
    } else if (!btn.classList.contains('m-btn--loading-replace')) {
      /* Default B: CSS reserves the slot before loading; label stays visible.
         Explicit loading-replace preserves legacy A without changing the API. */
      btn.insertBefore(spinner, btn.firstChild);
    } else {
      btn.insertBefore(spinner, btn.firstChild);
      btn.classList.add('is-loading--text'); /* نص فقط: توسيط المؤشر */
      wrapTextLabel(btn);
    }
  }

  /**
   * حالة التحميل — العقد العام للمكوّن:
   *
   * MicroButtons.setLoading(btn, true|false [, options])
   * options.loadingLabel — تسمية تحميل صريحة سليمة (مثل «جارٍ البحث»).
   * بديل تصريحي بلا JS إضافي: سمة data-loading-label على الزر.
   *
   * الضمانات:
   * - التكرار آمن: true على زر محمّل أصلًا لا فعل، وfalse على زر غير
   *   محمّل (أو لم يبدأ تحميله عبر هذه الدالة) لا فعل ولا يمحو شيئًا.
   * - الاسترجاع دقيق: aria-label الأصلي يعود كما كان، وإن لم يكن
   *   للزر تسمية أصلًا فلا تُضاف له تسمية بعد التوقف.
   * - بلا تسمية صريحة يبقى الاسم الإتاحي مطابقًا للنص الظاهر كما هو —
   *   لا تركيب آلي لجمل غير سليمة ولا اختصار يخفي المعنى؛ وaria-busy
   *   يبلغ التقنيات المساعدة بالانشغال.
   * - زر معطل أصلًا (disabled) لا يدخل حالة التحميل إطلاقًا، ولا تُنزع
   *   سمة disabled أبدًا — التعطيل الحقيقي يتقدم على المحاكاة.
   * - الزر أثناء التحميل يبقى قابلًا للتركيز (ليس disabled) فلا يضيع
   *   التركيز من مستخدم لوحة المفاتيح، وحلقة التركيز تبقى ظاهرة.
   * - منع التفعيل: pointer-events:none + حراسة click/keydown أعلاه.
    * - زر نصي بلا أيقونة: B الافتراضي يحفظ التسمية ظاهرة والمؤشر
    *   في فتحة محجوزة قبل التحميل؛ العرض ثابت بالبنية نفسها.
    *   A عبر m-btn--loading-replace يخفي النص بصريًا فقط مع حفظ
    *   مكانه واسمه الإتاحي. يعود النص كما كان عند التوقف.
   */
  function setLoading(btn, isLoading, options) {
    if (!btn || btn.nodeType !== 1) return;
    options = options || {};
    var busy = btn.getAttribute('aria-busy') === 'true';

    if (isLoading) {
      if (busy || btn.disabled) return; /* محمّل أصلًا، أو معطل أصلًا */
      var saved = {
        label: btn.getAttribute('aria-label'),
        hadLabel: btn.hasAttribute('aria-label')
      };
      state.set(btn, saved);
      btn.setAttribute('aria-busy', 'true');
      btn.classList.add('is-loading');
      var label = options.loadingLabel || btn.getAttribute('data-loading-label');
      if (label) btn.setAttribute('aria-label', label);
      ensureSpinner(btn);
      ensureActivationGuard(btn);
    } else {
      if (!busy || !state.has(btn)) return; /* ليس تحت تحميل هذه الواجهة */
      var saved2 = state.get(btn);
      if (saved2.hadLabel) btn.setAttribute('aria-label', saved2.label);
      else btn.removeAttribute('aria-label');
      state.delete(btn);
      btn.removeAttribute('aria-busy');
      btn.classList.remove('is-loading', 'is-loading--text');
      var spinner = btn.querySelector(':scope > .m-btn__spinner');
      /* مؤشرات الأمثلة الثابتة في جدول الحالات (data-demo="persistent")
         مملوكة للوحة المعاينة ولا يزيلها المكوّن. */
      if (spinner && spinner.dataset.demo !== 'persistent') spinner.remove();
      unwrapTextLabel(btn);
    }
  }

  /* واجهة عامة للاستهلاك المباشر ولفحص العقد خارج لوحة المعاينة */
  window.MicroButtons = { setLoading: setLoading };
})();
