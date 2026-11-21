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

  import { instanceRegistry } from '../../shared/lifecycle.js';
  /* حالة كل زر تُحفظ في WeakMap (لا تلوّث DOM): تسمية aria-label
     الأصلية ووجودها — تُحفظ مرة واحدة عند بدء التحميل وتُسترجع بدقة. */
  var state = new WeakMap();

  /* أزرار رُكّبت لها حراسة التفعيل مرة واحدة؛ المستمعون يفحصون
     حالة aria-busy لحظة الحدث فتصلح لكل دورات التحميل المتكررة. */
  var guarded = new WeakSet();
  var guardControllers = new WeakMap();

  /* حراسة تفعيل أثناء التحميل — جزء من عقد المكوّن وليست من اللوحة:
     pointer-events:none يمنع المؤشر فقط؛ أما Enter/Space بلوحة المفاتيح
     فيولّدان حدث click على الزر المركّز. لذلك نحجز click في مرحلة
     الالتقاط (يشمل الماوس واللمس وEnter/Space معًا) ونمنع أيضًا
     keydown الخاص بـ Enter/Space كي لا يظهر ضغط مضلل. */
  function ensureActivationGuard(btn) {
    if (guarded.has(btn)) return;
    guarded.add(btn);
    var controller = new AbortController();
    guardControllers.set(btn, controller);
    function busy() { return btn.getAttribute('aria-busy') === 'true'; }
    btn.addEventListener('click', function (e) {
      if (busy()) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, { capture: true, signal: controller.signal });
    btn.addEventListener('keydown', function (e) {
      if (busy() && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, { capture: true, signal: controller.signal });
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

  /* يضمن وجود مؤشر التحميل في موضع صحيح (عقد R1-UI02):
     - زر بأيقونة: المؤشر يحل مكان الأيقونة نفسها (فتحة 20px / 24px
       الدائري) فيبقى عرض الزر وزاوية النص كما هما.
     - زر نصي بلا أيقونة (B الافتراضي، وm-btn--loading-slot توافقي):
       لا حجز مسبق — التسمية تبقى ظاهرة والمؤشر يظهر أثناء التحميل داخل
       حشو بداية الزر نفسه (20px) فلا يتغير العرض ولا الارتفاع.
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
      /* Default B (R1-UI02): no reserved slot — the label stays visible and
         the spinner appears inside the button's inline-start padding while
         loading, so box size is identical across the three phases.
         Explicit loading-replace preserves legacy A without changing the API. */
      btn.insertBefore(spinner, btn.firstChild);
    } else {
      btn.insertBefore(spinner, btn.firstChild);
      btn.classList.add('is-loading--text'); /* نص فقط: توسيط المؤشر */
      wrapTextLabel(btn);
    }
  }

  /* واجهة عامة للاستهلاك المباشر ولفحص العقد خارج لوحة المعاينة */

  /* العقد الموحد (الجولة الثانية R4): init(root, options?) يعيد instance
     له update/destroy. B01 لا مفهوم بيانات له — update يغلف setLoading
     لكل .m-btn تحت الجذر (الحالة العابرة قرار المستهلك عبر setLoading
     أيضًا). الحراسات تُربط عند init مباشرة (R4.7) ويعاد ربطها بعد كل
     destroy. لا نصوص للعائلة (بلا labels.js) فلا options فعلية بعد R5. */
  var registry = instanceRegistry();

  function scopedButtons(scope) {
    var buttons = [].slice.call(scope.querySelectorAll('.m-btn'));
    if (scope.matches && scope.matches('.m-btn')) buttons.unshift(scope);
    return buttons;
  }

  export function init(root, options) {
    var scope = root || document;
    void options; /* B01: لا خيارات حاليًا — تدخل options.labels في R5 */
    var existing = registry.get(scope);
        /* R4 (عقد SPA): المثيل الحي يُعاد كما هو، مع فحص الجذر وربط أي
       عنصر جديد غير مربوط تحته — init متكرر آمن كما في v0.1.0. */
    if (existing) { scopedButtons(scope).forEach(ensureActivationGuard); return existing; } /* المثيل نفسه + ربط الجديد */
    scopedButtons(scope).forEach(ensureActivationGuard);
    var destroyed = false;
    var instance = {
      root: scope,
      /** update({loading?, loadingLabel?}) يغلف setLoading لكل أزرار النطاق. */
      update: function (state) {
        scopedButtons(scope).forEach(function (button) {
          if (state && typeof state.loading === 'boolean') {
            setLoading(button, state.loading, state);
          } else if (!state) {
            setLoading(button, false);
          }
        });
      },
      /** يوقف التحميل ويفك حراسات التفعيل ويزيل المثيل — لا يمس قيم المستخدم. */
      destroy: function () {
        if (destroyed) return; /* destroy مرتين آمن */
        destroyed = true;
        teardown(scope);
        registry.remove(scope);
      },
    };
    registry.set(scope, instance);
    return instance;
  }

  export function getInstance(root) {
    return registry.get(root);
  }

  export function destroy(root) {
    var instance = registry.get(root);
    if (instance) instance.destroy();
    else teardown(root || document);
  }

  export function setLoading(btn, isLoading, options) {
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

  /* @deprecated منذ 0.2.0 (R-D10): اسم مهمل يبقى في نسخة IIFE فقط حتى 1.0
     (لا يُصدَّر من مدخل ESM) — استخدم destroy(root) أو instance.destroy(). */
  export function disconnect(root) {
    destroy(root);
  }

  function teardown(root) {
    var scope = root || document;
    scopedButtons(scope).forEach(function (button) {
      setLoading(button, false);
      var controller = guardControllers.get(button);
      if (controller) controller.abort();
      guardControllers.delete(button);
      guarded.delete(button);
    });
  }
