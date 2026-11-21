/* =========================================================
   Micro UI — سلوك مكوّن الرسائل والحالات العامة (B06)
   الملف: components/messages/messages.js
   عقد عام فقط:
   1) MicroMessages.toast(el, options) — الرسالة العابرة لتأكيد
      غير حرج فقط: مدة يحددها المستهلك (options.duration،
      افتراض 4000ms)، إغلاق يدوي دائمًا، وإعلان واحد عبر منطقة
      aria-live مشتركة (مسار الإعلان الوحيد — عنصر toast نفسه
      بلا role/aria-live حتى لا تتكرر الرسالة بمسارين).
      ليست للرسائل المهمة أو المطلوبة لتصحيح إدخال — تلك ثابتة.
   2) MicroMessages.closeToast(el) — الإغلاق اليدوي في المصدر:
      يلغي المؤقت الحالي ويخفي العنصر فعليًا ويطلق حدث
      micro-messages:toast-closed — قابل للاستدعاء من زر داخل
      الـtoast أو من المستهلك مباشرة (لا يعود محصورًا باللوحة).
   3) MicroMessages.announce(text, opts) — إعلان بهوية الحدث (SUI-012
      وSUI-R1-03): opts.id يميّز الحدث نفسه — الحدث ذاته (id نفسه والنص
      نفسه) يُعلن مرة واحدة داخل عمر الهوية، والحدث المستقل (id مختلف
      أو بلا id) يُعلن ولو تطابق النص. سجل هوية محدود وموثق (SUI-R1-03):
      آخر 12 هوية معلنة فقط، وعمر الهوية 60000ms — بعد انتهاء العمر أو
      إقصاء الهوية من السجل (الأقدم عند تجاوز 12) تصبح الهوية حدثًا
      جديدًا يُعلن من جديد؛ نفس id بنص مختلف = حدث محدّث المحتوى يُعلن
      ويحدّث نص الهوية المسجلة. الدعوة بلا id حدث مستقل لا يمس السجل.
      الوسيط الثاني يقبل أيضًا المنطقي القديم (assertive) للتوافق الخلفي،
      وopts.assertive للإلحاح.
   3b) MicroMessages.resetAnnouncements() — يمسح سجل هويات الإعلان
      (كل الأحداث بعده جديدة) لاستخدام المستهلك عند تغيير السياق أو
      الوجهة (SUI-R1-03).
   4) إغلاق الرسائل الثابتة ذات زر (.m-note__close) — يخفي
      الرسالة ويعيد التركيز عند الطلب: سمة data-return-focus
      على الزر أو على الرسالة (محدد CSS لعنصر هدف صالح).
      بلا السمة: يُطلق حدث micro-messages:note-closed ليقرر
      المستهلك — ولا يُدّعى استرجاع تركيز لم يحدث.
   إخفاء hidden فعلي في messages.css (display:flex كان يغلبها).
   لا شبكة ولا retry منطقي داخل المكوّن — إعادة المحاولة عند المستهلك.
   ========================================================= */

import { getLabel, registerLabels, setLabels as setFamilyLabels } from '../../shared/labels.js';
import { defaults as familyDefaults } from './labels.js';
import { instanceRegistry } from '../../shared/lifecycle.js';

registerLabels('messages', familyDefaults);
  /* ---- المرحلة 7 / الجولة الثانية R2 — النصوص الافتراضية: تُقرأ من سجل
     النصوص المشترك (shared/labels.js) وقت الاستخدام (لا عند التحميل)
     كي يعمل setLabels؛ العائلة تسجّل نصوصها الافتراضية عند الاستيراد. ---- */
  var MICRO_LABELS_FAMILY = 'messages';
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

  var livePolite = null;
  var liveAssertive = null;
  /* W2.3 (A2-F05): قناتا إعلان منفصلتان — polite وassertive عقدتان
     مستقلتان فلا يتنافس الإعلان المهذب مع الإلحاحي على عقدة واحدة، ولا
     يصبح تبديل القناة عالميًا لكل المستهلكين (كانت قناة واحدة تُبدّل
     aria-live عليها ثم يُمسح النص ويُعاد بعد setTimeout ثابت 50ms قد
     يخسر الترتيب عند تزاحم أحداث burst). */
  /* SUI-012 + SUI-R1-03: سجل هوية محدود لمنع إعادة إعلان الحدث نفسه
     بعد حدث مستقل (كان آخر-إعلان-فقط يسمح بذلك). عقد السجل:
     - CAPACITY=12: آخر 12 هوية معلنة فقط؛ الأقدم تُقصى عند التجاوز —
       الذاكرة محدودة دومًا والهوية المقصية تصبح حدثًا جديدًا.
     - LIFETIME_MS=60000: عمر الهوية 60s؛ بعده تُعتبر جديدة (تنظيف كسول
       عند كل استدعاء announce/reset — الزمن عبر Date.now داخل الصفحة).
     - الهوية = id نفسه والنص نفسه (كائن {id, text, at}).
     - نفس id بنص مختلف = حدث محدّث المحتوى: يُعلن ويحدّث نص الهوية ووقتها.
     - الدعوة بلا id لا تمس السجل أصلًا (حدث مستقل). */
  var ANNOUNCE_CAPACITY = 12;
  var ANNOUNCE_LIFETIME_MS = 60000;
  var announcedIds = [];
  var announcementEpoch = 0;
  var toastStates = new WeakMap();
  function on(element, type, handler) {
    if (!element.__microMessageLifetime) element.__microMessageLifetime = new AbortController();
    element.addEventListener(type, handler, { signal: element.__microMessageLifetime.signal });
  }

  function ensureLiveChannel(kind) {
    var existing = kind === 'assertive' ? liveAssertive : livePolite;
    if (existing && document.body.contains(existing)) return existing;
    var region = document.createElement('div');
    region.className = 'm-live-region' + (kind === 'assertive' ? ' m-live-region--assertive' : '');
    region.setAttribute('aria-live', kind === 'assertive' ? 'assertive' : 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
    if (kind === 'assertive') liveAssertive = region; else livePolite = region;
    return region;
  }

  function ensureLiveRegion() {
    /* توافق الفحوص القائمة على اسم الدالة — القناة المهذبة الافتراضية */
    return ensureLiveChannel('polite');
  }

  function pruneAnnouncedIds(now) {
    /* تنظيف كسول: احذف المنتهية (عمر > LIFETIME_MS) ثم الفائض عن
       CAPACITY (الأقدم أولًا) — ذاكرة محدودة في كل استدعاء */
    for (var i = announcedIds.length - 1; i >= 0; i--) {
      if (now - announcedIds[i].at > ANNOUNCE_LIFETIME_MS) announcedIds.splice(i, 1);
    }
    while (announcedIds.length > ANNOUNCE_CAPACITY) announcedIds.shift();
  }

  export function announce(text, opts) {
    /* التوافق الخلفي: الوسيط الثاني كان منطقيًا (assertive) — يقبل
       الكائن {id, assertive} أو المنطقي القديم؛ بلا وسيط = حدث مستقل */
    var id, assertive;
    if (opts && typeof opts === 'object') {
      id = opts.id;
      assertive = !!opts.assertive;
    } else {
      assertive = !!opts;
      id = undefined;
    }
    var region = ensureLiveChannel(assertive ? 'assertive' : 'polite');
    /* SUI-R1-03: الحدث ذاته (id نفسه والنص نفسه) يُعلن مرة داخل عمر
       الهوية حتى لو أعقبه أحداث مستقلة (A,B,A = إعلانان)؛ الحدث المستقل
       (id مختلف أو بلا id) بنفس النص يُعلن — إعلان نتيجة كل فعل (S28/S32).
       بلا id: يُعلن دائمًا ولا يمس السجل */
    if (id !== undefined && id !== null) {
      var now = Date.now();
      pruneAnnouncedIds(now);
      for (var i = 0; i < announcedIds.length; i++) {
        if (announcedIds[i].id === id) {
          if (announcedIds[i].text === text && now - announcedIds[i].at <= ANNOUNCE_LIFETIME_MS) {
            return; /* ابتلاء: الحدث ذاته داخل عمره */
          }
          /* id نفسه بنص مختلف: حدث محدّث المحتوى — يُعلن ويحدّث الهوية */
          announcedIds[i] = { id: id, text: text, at: now };
          break;
        }
      }
      if (i === announcedIds.length) {
        announcedIds.push({ id: id, text: text, at: now }); /* سجّل الهوية */
      }
      pruneAnnouncedIds(now); /* إقصاء الفائض عن 12 فور التسجيل */
    }
    /* W2.3 (A2-F05): كتابة متزامنة بالترتيب داخل كل قناة — لا مسح/إعادة
       بمؤقت ثابت. إعادة إعلان النص ذاته في القناة نفسها (حدث مستقل بنص
       متطابق بلا id) تُدار بمسح ثم تعيين في إطار الرسم التالي (rAF) —
       أسرع من 50ms ومرتبط بدورة العرض، ولا يُطغى النص الأحدث (الشرط
       أدناه يحميه). */
    if (region.textContent === String(text)) {
      region.textContent = '';
      var epoch = announcementEpoch;
      (window.requestAnimationFrame || function (fn) { window.setTimeout(fn, 16); })(function () {
        if (epoch === announcementEpoch && region.isConnected && region.textContent === '') region.textContent = text;
      });
    } else {
      region.textContent = text;
    }
  }

  export function resetAnnouncements() {
    /* SUI-R1-03: مسح سجل الهويات لاستخدام المستهلك عند تغيير السياق/الوجهة —
       كل الأحداث بعده جديدة؛ لا يمس المنطقة الحية نفسها */
    announcedIds = [];
    announcementEpoch++;
  }

  function toastText(el) {
    var t = el.querySelector('.m-toast__text');
    return (t || el).textContent;
  }

  function endToastSession(el) {
    var state = toastStates.get(el);
    if (state) {
      if (state.timer !== null) window.clearTimeout(state.timer);
      el.removeEventListener('focusin', state.focusin);
      el.removeEventListener('focusout', state.focusout);
      toastStates.delete(el);
    }
    // A copied data attribute is not ownership of another toast's timer.
    delete el.dataset.toastTimer;
  }

  export function toast(el, options) {
    if (!el || el.nodeType !== 1) return;
    options = options || {};
    endToastSession(el);
    var state = { timer: null, remaining: typeof options.duration === 'number' ? options.duration : 4000,
      startedAt: 0, returnFocus: options.returnFocus || null };
    function pause() {
      if (state.timer === null) return;
      window.clearTimeout(state.timer);
      state.remaining = Math.max(0, state.remaining - (Date.now() - state.startedAt));
      state.timer = null;
      delete el.dataset.toastTimer;
    }
    function resume() {
      if (toastStates.get(el) !== state || state.timer !== null || el.contains(document.activeElement)) return;
      state.startedAt = Date.now();
      state.timer = window.setTimeout(function () {
        if (toastStates.get(el) !== state) return;
        if (!el.isConnected) { endToastSession(el); return; }
        if (el.contains(document.activeElement)) { pause(); return; }
        hideToast(el);
        el.dispatchEvent(new Event('micro-messages:toast-dismissed', { bubbles: true }));
      }, state.remaining);
      el.dataset.toastTimer = String(state.timer);
    }
    state.focusin = pause;
    state.focusout = function () {
      // Focus may be moving to another child. Recheck after that move completes.
      Promise.resolve().then(resume);
    };
    toastStates.set(el, state);
    el.addEventListener('focusin', state.focusin);
    el.addEventListener('focusout', state.focusout);
    el.hidden = false;
    announce(toastText(el), false);
    resume();
  }

  /* الإخفاء بلا آثار مؤقت قديم — يعاد استخدام العنصر بأمان */
  function hideToast(el) {
    endToastSession(el);
    el.hidden = true; /* messages.css تجعله مخفيًا فعليًا */
  }

  /* الإغلاق اليدوي من المصدر (زر داخل العنصر أو استدعاء مباشر) */
  export function closeToast(el, trigger) {
    if (!el || el.nodeType !== 1) return;
    var hadFocus = el.contains(document.activeElement);
    var state = toastStates.get(el);
    var target = returnFocusTarget(trigger || document.activeElement || el, el)
      || (state && state.returnFocus);
    hideToast(el);
    if (hadFocus && target && target.nodeType === 1 && target.isConnected
        && !target.disabled && target.getAttribute('aria-disabled') !== 'true'
        && !target.closest('[hidden], [inert]')
        && (typeof target.checkVisibility !== 'function'
          || target.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))) {
      target.focus();
    }
    el.dispatchEvent(new Event('micro-messages:toast-closed', { bubbles: true }));
  }

  /* هدف استرجاع التركيز: سمة data-return-focus على الزر أو الرسالة */
  function returnFocusTarget(btn, note) {
    var sel = btn.getAttribute('data-return-focus') || note.getAttribute('data-return-focus');
    if (!sel) return null;
    try { return document.querySelector(sel); } catch (e) { return null; }
  }

  /* ---- W2.2 (D-UI-02 — A2-F04): أدوار m-note الافتراضية من النوع ----
     وفق عقد المواصفة (SUI-010): مساعدة `note`، معلومة/نجاح/تحذير `status`،
     خطأ `alert` فقط — لا يُعمم alert على كل ملاحظة بحكم الاسم. الدور الصريح
     من المستهلك مالك دائمًا (لا يُداس)؛ الترميز الناقص (لا نوع ولا دور)
     يُكشف بتحذير صريح لا بصمت. مطابقة DOM/ARIA — الفحص السمعي بقارئ
     شاشة فعلي NOT RUN. */
  var NOTE_ROLE_BY_VARIANT = { help: 'note', info: 'status', success: 'status', warning: 'status', error: 'alert' };
  function noteVariantOf(note) {
    var cls = ' ' + (note.className || '') + ' ';
    for (var v in NOTE_ROLE_BY_VARIANT) {
      if (cls.indexOf(' m-note--' + v + ' ') >= 0) return v;
    }
    return null;
  }
  function ensureNoteRoles(scope) {
    var base = (scope && scope.querySelectorAll) ? scope : document;
    var list = [].slice.call(base.querySelectorAll('.m-note'));
    if (scope && scope.nodeType === 1 && scope.matches && scope.matches('.m-note')) list.unshift(scope);
    list.forEach(function (note) {
      if (note.getAttribute('role')) return; /* دور المستهلك مالك */
      var v = noteVariantOf(note);
      if (v) note.setAttribute('role', NOTE_ROLE_BY_VARIANT[v]);
      else if (window.console && console.warn) {
        console.warn(L('k1'), note);
      }
    });
  }

  /* W2.5 (A2-F08): init(root) يعالج الجذر نفسه إن طابق المحدد ثم الأبناء */
  function bindClose(root) {
    var scope = root || document;
    var inScope = function (selector) {
      var list = [].slice.call(scope.querySelectorAll(selector));
      if (scope.nodeType === 1 && scope.matches(selector)) list.unshift(scope);
      return list;
    };
    inScope('.m-note__close').forEach(function (btn) {
      if (!claimBinding(btn, 'microNoteBound')) return;
      on(btn, 'click', function () {
        var note = btn.closest('.m-note');
        if (!note) return;
        var target = returnFocusTarget(btn, note); /* قبل الإخفاء */
        note.hidden = true;
        if (target && !target.disabled && typeof target.focus === 'function') {
          target.focus();
        }
        note.dispatchEvent(new CustomEvent('micro-messages:note-closed', {
          bubbles: true, detail: { returnFocus: !!target }
        }));
      });
    });
    /* إغلاق toast اليدوي: أي عنصر [data-toast-close] داخل .m-toast */
    inScope('.m-toast [data-toast-close]').forEach(function (btn) {
      if (!claimBinding(btn, 'microToastCloseBound')) return;
      on(btn, 'click', function () {
        closeToast(btn.closest('.m-toast'), btn);
      });
    });
  }

  /* @deprecated منذ 0.2.0 (R-D10): اسم مهمل يبقى في نسخة IIFE فقط حتى
     1.0 — استخدم destroy(root) أو instance.destroy(). */
export function disconnect(root) {
  destroy(root);
}

function teardown(root) {
      var scope = root || document;
      var nodes = [scope].concat([].slice.call(scope.querySelectorAll('*')));
      nodes.forEach(function (element) {
        liveBindings.delete(element);
        if (element.__microMessageLifetime) element.__microMessageLifetime.abort();
        delete element.__microMessageLifetime;
        if (element.dataset) {
          delete element.dataset.microNoteBound;
          delete element.dataset.microToastCloseBound;
          if (toastStates.has(element) || element.dataset.toastTimer) hideToast(element);
        }
      });
      // Live channels are module-owned, shared by all instances; only the
      // document-level teardown removes them or resets their pending replay.
      if (scope === document) {
        resetAnnouncements();
        if (livePolite) livePolite.remove();
        if (liveAssertive) liveAssertive.remove();
        livePolite = liveAssertive = null;
      }
    }
    /* W2.5: init(root) يشمل الجذر نفسه؛ W2.2: يضمن أدوار m-note قبل التفاعل */

  /* العقد الموحد (الجولة الثانية R4): init(root, options?) يعيد instance
     له update/destroy. update يعيد فحص الرسائل (أدوار m-note وأزرار
     الإغلاق الجديدة)؛ destroy يفك المستمعات ويوقف مؤقتات toast النشطة
     تحت الجذر. القنوات الحية (polite/assertive) ملك الوحدة مشتركة بين
     المثيلات — تُزال فقط عند destroy(document) كما في 0.1.0. */
  var registry = instanceRegistry();

  export function init(root, options) {
    var scope = root || document;
    void options; /* messages: لا خيارات حاليًا — options.labels في R5 */
    var existing = registry.get(scope);
        /* R4 (عقد SPA): المثيل الحي يُعاد كما هو، مع فحص الجذر وربط أي
       عنصر جديد غير مربوط تحته — init متكرر آمن كما في v0.1.0. */
    if (existing) { ensureNoteRoles(scope); bindClose(scope); return existing; }
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد فحص الرسائل تحت الجذر (أدوار m-note وأزرار الإغلاق الجديدة). */
      update: function () {
        ensureNoteRoles(scope);
        bindClose(scope);
      },
      /** يفك المستمعات ويوقف مؤقتات toast — لا يمس نصوص الرسائل. */
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        registry.remove(scope);
      },
    };
    ensureNoteRoles(scope);
    bindClose(scope);
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

  /* المرحلة 7 — تخصيص نصوص العائلة: دمج جزئي فوق الافتراضي في سجل
     MicroLabels؛ يسري على التصييرات اللاحقة (النص الثابت في DOM يتحدث
     عند أول render/update بعد التغيير). */
  export function setLabels(partial) {
  setFamilyLabels('messages', partial);
}
