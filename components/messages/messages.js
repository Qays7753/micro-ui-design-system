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

(function () {
  'use strict';

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

  function announce(text, opts) {
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
      (window.requestAnimationFrame || function (fn) { window.setTimeout(fn, 16); })(function () {
        if (region.textContent === '') region.textContent = text;
      });
    } else {
      region.textContent = text;
    }
  }

  function resetAnnouncements() {
    /* SUI-R1-03: مسح سجل الهويات لاستخدام المستهلك عند تغيير السياق/الوجهة —
       كل الأحداث بعده جديدة؛ لا يمس المنطقة الحية نفسها */
    announcedIds = [];
  }

  function toastText(el) {
    var t = el.querySelector('.m-toast__text');
    return (t || el).textContent;
  }

  function toast(el, options) {
    if (!el || el.nodeType !== 1) return;
    options = options || {};
    var duration = typeof options.duration === 'number' ? options.duration : 4000;
    if (el.dataset.toastTimer) window.clearTimeout(parseInt(el.dataset.toastTimer, 10));
    el.hidden = false;
    announce(toastText(el), false); /* مسار الإعلان الوحيد: المنطقة الحية */
    var timer = window.setTimeout(function () {
      hideToast(el);
      el.dispatchEvent(new Event('micro-messages:toast-dismissed', { bubbles: true }));
    }, duration);
    el.dataset.toastTimer = String(timer);
  }

  /* الإخفاء بلا آثار مؤقت قديم — يعاد استخدام العنصر بأمان */
  function hideToast(el) {
    if (el.dataset.toastTimer) {
      window.clearTimeout(parseInt(el.dataset.toastTimer, 10));
      delete el.dataset.toastTimer;
    }
    el.hidden = true; /* messages.css تجعله مخفيًا فعليًا */
  }

  /* الإغلاق اليدوي من المصدر (زر داخل العنصر أو استدعاء مباشر) */
  function closeToast(el) {
    if (!el || el.nodeType !== 1) return;
    hideToast(el);
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
        console.warn('[micro-messages] m-note بلا variant ولا role — لا يمكن اختيار دور إعلاني آمن (D-UI-02/SUI-010): أضف نوعًا (m-note--info/success/warning/error/help) أو role صريحًا.', note);
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
      if (btn.dataset.microNoteBound) return;
      btn.dataset.microNoteBound = '1';
      btn.addEventListener('click', function () {
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
      if (btn.dataset.microToastCloseBound) return;
      btn.dataset.microToastCloseBound = '1';
      btn.addEventListener('click', function () {
        closeToast(btn.closest('.m-toast'));
      });
    });
  }

  window.MicroMessages = {
    toast: toast,
    closeToast: closeToast,
    announce: announce,
    resetAnnouncements: resetAnnouncements,
    /* W2.5: init(root) يشمل الجذر نفسه؛ W2.2: يضمن أدوار m-note قبل التفاعل */
    init: function (root) { ensureNoteRoles(root); bindClose(root); }
  };
  document.addEventListener('DOMContentLoaded', function () { window.MicroMessages.init(); });
  if (document.readyState !== 'loading') window.MicroMessages.init();
})();
