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

  var liveRegion = null;
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

  function ensureLiveRegion() {
    if (liveRegion && document.body.contains(liveRegion)) return liveRegion;
    liveRegion = document.createElement('div');
    liveRegion.className = 'm-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
    return liveRegion;
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
    var region = ensureLiveRegion();
    region.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
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
    region.textContent = '';
    window.setTimeout(function () { region.textContent = text; }, 50);
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

  function bindClose(root) {
    (root || document).querySelectorAll('.m-note__close').forEach(function (btn) {
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
    (root || document).querySelectorAll('.m-toast [data-toast-close]').forEach(function (btn) {
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
    init: function (root) { bindClose(root); }
  };
  document.addEventListener('DOMContentLoaded', function () { window.MicroMessages.init(); });
  if (document.readyState !== 'loading') window.MicroMessages.init();
})();
