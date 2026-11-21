/* =========================================================
   Micro UI — سلوك مكوّن الاختيار (B03)
   الملف: components/selection/selection.js
   عقد عام فقط — لا محاكاة ولا منطق أعمال:
   1) مجموعة checkboxes مع "تحديد الكل": مزامنة الحالة الجزئية
      (indeterminate) تلقائيًا — العنصر الحامل data-select-all
      داخل [data-choice-group].
   2) المقطّع Segmented: سلوك متبادل + تنقل أسهم (radiogroup-like)
      للأزرار داخل [data-seg].
   3) المفتاح Switch: حالة انتظار اختيارية (data-pending) يضبطها
      المستهلك أثناء تحديث الإعداد — عند الفشل يرجع المستهلك القيمة.
   HTML الأساس: <label class="m-choice m-choice--check"><input …><span class="m-choice__box"><svg><use href="#i-check"/></svg></span><span class="m-choice__text">…</span></label>
   ========================================================= */

import { getLabel, registerLabels, setLabels as setFamilyLabels } from '../../shared/labels.js';
import { defaults as familyDefaults } from './labels.js';
import { instanceRegistry } from '../../shared/lifecycle.js';

registerLabels('selection', familyDefaults);
  /* ---- المرحلة 7 / الجولة الثانية R2 — النصوص الافتراضية: تُقرأ من سجل
     النصوص المشترك (shared/labels.js) وقت الاستخدام (لا عند التحميل)
     كي يعمل setLabels؛ العائلة تسجّل نصوصها الافتراضية عند الاستيراد. ---- */
  var MICRO_LABELS_FAMILY = 'selection';
  function L(key) {
    return getLabel(MICRO_LABELS_FAMILY, key);
  }

  var liveBindings = new WeakMap();

  function claimBinding(element, key) {
    var keys = liveBindings.get(element);
    if (!keys) { keys = new Set(); liveBindings.set(element, keys); }
    if (keys.has(key)) return false;
    keys.add(key);
    element.dataset[key] = '1';
    return true;
  }

  /* E05: استرجاع دقيق لحالة التعطيل الأصلية للمفتاح بعد الانتظار */
  var pendingRestore = new WeakMap();

  function isDisabled(el) {
    return el.disabled || el.getAttribute('aria-disabled') === 'true';
  }

  function syncGroup(group) {
    var all = group.querySelector('[data-select-all]');
    /* E05: «تحديد الكل» يدير العناصر المفعّلة فقط — لا يغيّر المحمية */
    var boxes = [].slice.call(group.querySelectorAll('input[type="checkbox"][data-choice-item]'))
      .filter(function (b) { return !b.disabled; });
    if (!all) return;
    /* F02-P01: مجموعة بلا خيارات مفعّلة = حالة صفر صريح على الحامل
       (checked=false وindeterminate=false) عند التهيئة وعند أي إعادة حساب،
       حتى لو ورد الحامل بالسمتين من الترميز. العناصر المعطلة وقيمها
       تبقى كما هي — لا تُمس ولا تُستنتج منها. */
    if (!boxes.length) { all.checked = false; all.indeterminate = false; return; }
    var checked = boxes.filter(function (b) { return b.checked; }).length;
    if (checked === 0) { all.checked = false; all.indeterminate = false; }
    else if (checked === boxes.length) { all.checked = true; all.indeterminate = false; }
    else { all.checked = false; all.indeterminate = true; }
  }

  function bindGroups(root) {
    /* W2.5 (A2-F08): الجذر نفسه إن طابق المحدد ثم الأبناء — عقد init موحد */
    var scope = root || document;
    var groups = [].slice.call(scope.querySelectorAll('[data-choice-group]'));
    if (scope.nodeType === 1 && scope.matches('[data-choice-group]')) groups.unshift(scope);
    groups.forEach(function (group) {
      if (!claimBinding(group, 'microChoicesBound')) return;
      if (!group.__microSelectionLifetime) group.__microSelectionLifetime = new AbortController();
      function on(element, type, handler) {
        element.addEventListener(type, handler, { signal: group.__microSelectionLifetime.signal });
      }
      var all = group.querySelector('[data-select-all]');
      if (all) {
        on(all, 'change', function () {
          [].slice.call(group.querySelectorAll('input[type="checkbox"][data-choice-item]'))
            .forEach(function (b) { if (!b.disabled) b.checked = all.checked; }); /* E05: المعطل لا يُلمس */
          /* F02-P01: إعادة حساب بعد كل تغيير — نقر «تحديد الكل» في مجموعة
             بلا مفعّلين يقلب الحامل أصليًا ثم يُصفّر هنا فلا حالة وهمية */
          syncGroup(group);
          group.dispatchEvent(new Event('micro-selection:changed', { bubbles: true }));
        });
      }
      on(group, 'change', function (e) {
        if (e.target.matches('input[type="checkbox"][data-choice-item]')) syncGroup(group);
      });
      syncGroup(group);
    });
  }

  function bindSegmented(root) {
    /* W2.5 (A2-F08): الجذر نفسه إن طابق المحدد ثم الأبناء — تمرير عقدة
       segmented ذاتها إلى MicroSelection.init كان يُهمل قبل هذا التعديل */
    var scope = root || document;
    var segs = [].slice.call(scope.querySelectorAll('[data-seg]'));
    if (scope.nodeType === 1 && scope.matches('[data-seg]')) segs.unshift(scope);
    segs.forEach(function (seg) {
      if (!claimBinding(seg, 'microSegBound')) return;
      if (!seg.__microSelectionLifetime) seg.__microSelectionLifetime = new AbortController();
      function on(element, type, handler) {
        element.addEventListener(type, handler, { signal: seg.__microSelectionLifetime.signal });
      }
      var items = [].slice.call(seg.querySelectorAll('.m-seg__item'));
      function select(item) {
        items.forEach(function (it) {
          var on = it === item;
          it.setAttribute('aria-pressed', on ? 'true' : 'false');
          it.classList.toggle('is-selected', on);
        });
        if (seg.scrollWidth > seg.clientWidth) item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        seg.dispatchEvent(new CustomEvent('micro-selection:segment', {
          bubbles: true, detail: { value: item.getAttribute('data-value') || item.textContent.trim() }
        }));
      }
      items.forEach(function (it) {
        /* F02-P02: نفس حراسة الأسهم (isDisabled) في النقر — المعطّل
           أصليًا أو aria-disabled=true لا يغيّر الاختيار ولا يطلق حدث
           micro-selection:segment، بما يشمل Enter/Space (أصله click). */
        on(it, 'click', function () { if (!isDisabled(it)) select(it); });
      });
      /* تنقل أسهم مثل مجموعة راديو — يتجاوز المعطل (E05) ولا يقف عنده */
      on(seg, 'keydown', function (e) {
        var i = items.indexOf(document.activeElement);
        if (i < 0) return;
        var dir = 0;
        var rtl = getComputedStyle(seg).direction === 'rtl';
        if (e.key === 'ArrowLeft') dir = rtl ? 1 : -1;
        else if (e.key === 'ArrowRight') dir = rtl ? -1 : 1;
        else if (e.key === 'ArrowDown') dir = 1;
        else if (e.key === 'ArrowUp') dir = -1;
        if (!dir) return;
        e.preventDefault();
        var n = items.length, next = null;
        for (var s = 1; s <= n; s++) {
          var cand = items[((i + dir * s) % n + n) % n];
          if (!isDisabled(cand)) { next = cand; break; }
        }
        if (next) { next.focus(); select(next); }
      });
    });
  }

  /* العقد الموحد (الجولة الثانية R4): init(root, options?) يعيد instance
     له update/destroy. update يعيد قراءة حالة المجموعات والمقاطع تحت
     الجذر؛ destroy يفك المستمعات كلها — بما فيها حماية document للمفاتيح
     (مشتركة بعدّاد مرجعي بين مثيلات العائلة: تُزال مع آخر مثيل حي). */
  var registry = instanceRegistry();

  export function init(root, options) {
    var scope = root || document;
    void options; /* selection: لا خيارات حاليًا — options.labels في R5 */
    var existing = registry.get(scope);
        /* R4 (عقد SPA): المثيل الحي يُعاد كما هو، مع فحص الجذر وربط أي
       عنصر جديد غير مربوط تحته — init متكرر آمن كما في v0.1.0. */
    if (existing) { bindGroups(scope); bindSegmented(scope); return existing; }
    acquireSwitchGuard();
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد قراءة حالة المجموعات والمقاطع (يربط الجديد تحت الجذر). */
      update: function () {
        bindGroups(scope);
        bindSegmented(scope);
      },
      /** يفك مستمعات النطاق ويطلق حصة حماية document — لا يمس القيم. */
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        releaseSwitchGuard();
        registry.remove(scope);
      },
    };
    bindGroups(scope);
    bindSegmented(scope);
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

  /* حماية مباشرة حتى مع data-pending المضبوط بالترميز دون API:
   * تبديل مستخدم فعلي على مفتاح في انتظار يُرجع فورًا (تقاطع).
   * R2-06: إشعار change برمجي (isTrusted=false — مثلاً استهلاكٍ
   * ضبط checked وأطلق الححدث بنفسه) ليس تبديلًا فعليًا فلا يُعكس.
   * R4: مستمع document واحد مشترك بعدّاد مرجعي — يُركَّب مع أول مثيل حي
   * ويُزال مع آخر destroy (بلا وصول إلى document في المستوى الأعلى). */
  var switchGuardUsers = 0;
  var switchGuardHandler = null;
  function acquireSwitchGuard() {
    switchGuardUsers++;
    if (switchGuardHandler) return;
    switchGuardHandler = function (e) {
      if (!e.isTrusted) return;
      var input = e.target;
      if (!input.matches || !input.matches('.m-switch input')) return;
      var sw = input.closest('.m-switch');
      if (sw && sw.getAttribute('data-pending') === 'true') {
        input.checked = !input.checked;
      }
    };
    document.addEventListener('change', switchGuardHandler, true);
  }
  function releaseSwitchGuard() {
    if (switchGuardUsers > 0) switchGuardUsers--;
    if (switchGuardUsers === 0 && switchGuardHandler) {
      document.removeEventListener('change', switchGuardHandler, true);
      switchGuardHandler = null;
    }
  }

  /* عقد المفتاح: انتظار تحديث إعداد — المستهلك يضبط ويرجع عند الفشل */
  /* @deprecated منذ 0.2.0 (R-D10): اسم مهمل يبقى في نسخة IIFE فقط حتى
     1.0 — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root) {
  destroy(root);
}

function teardown(root) {
      var scope = root || document;
      var nodes = [].slice.call(scope.querySelectorAll('[data-choice-group], [data-seg]'));
      if (scope.matches && scope.matches('[data-choice-group], [data-seg]')) nodes.unshift(scope);
      nodes.forEach(function (element) {
        liveBindings.delete(element);
        if (element.__microSelectionLifetime) element.__microSelectionLifetime.abort();
        delete element.__microSelectionLifetime;
        delete element.dataset.microChoicesBound;
        delete element.dataset.microSegBound;
      });
      var switches = [].slice.call(scope.querySelectorAll('.m-switch'));
      if (scope.matches && scope.matches('.m-switch')) switches.unshift(scope);
      switches.forEach(function (element) { setSwitchPending(element, false); });
    }
  export function setSwitchPending(switchEl, pending) {
      if (!switchEl || switchEl.nodeType !== 1) return;
      switchEl.setAttribute('data-pending', pending ? 'true' : 'false');
      var input = switchEl.querySelector('input');
      if (!input) return;
      input.setAttribute('aria-busy', pending ? 'true' : 'false');
      /* E05: حماية تفعيل فعلية أثناء الانتظار — label وSpace والنقر
         جميعها بلا أثر، مع استرجاع التعطيل الأصلي بدقة (ربما كان
         معطلًا قبل الانتظار — يُرجع معطلًا لا مفعّلًا).
         R2-06: إنهاء انتظار غير مبدوء آمن — لا يغيّر حالة المستهلك
         (مفتاح معطل أصلًا يبقى معطلًا، ومفعّل أصلًا يبقى مفعّلًا)،
         وإنهاء متكرر بعد دورة مكتملة لا يعيد فعل شيء. */
      if (pending) {
        if (!pendingRestore.has(input)) pendingRestore.set(input, input.disabled);
        input.disabled = true;
      } else if (pendingRestore.has(input)) {
        input.disabled = pendingRestore.get(input);
        pendingRestore.delete(input);
      }
      /* بلا دورة انتظار سابقة: لا يُلمس disabled إطلاقًا */
    }

  /* المرحلة 7 — تخصيص نصوص العائلة: دمج جزئي فوق الافتراضي في سجل
     MicroLabels؛ يسري على التصييرات اللاحقة (النص الثابت في DOM يتحدث
     عند أول render/update بعد التغيير). */
  export function setLabels(partial) {
  setFamilyLabels('selection', partial);
}
