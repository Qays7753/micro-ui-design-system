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
   3) MicroMessages.announce(text, opts) — إعلان بهوية الحدث (SUI-012):
      opts.id يميّز الحدث نفسه — الحدث ذاته (id نفسه والنص نفسه)
      يُعلن مرة واحدة، والحدث المستقل (id مختلف أو بلا id) يُعلن
      ولو تطابق النص. الوسيط الثاني يقبل أيضًا المنطقي القديم
      (assertive) للتوافق الخلفي، وopts.assertive للإلحاح.
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
  /* SUI-012: آخر إعلان بهوية الحدث — المنع لهوية الحدث نفسه لا للنص */
  var lastAnnounced = { text: '', id: undefined };

  function ensureLiveRegion() {
    if (liveRegion && document.body.contains(liveRegion)) return liveRegion;
    liveRegion = document.createElement('div');
    liveRegion.className = 'm-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
    return liveRegion;
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
    /* الحدث ذاته (id نفسه والنص نفسه) يُعلن مرة؛ حدث مستقل (id مختلف
       أو بلا id) بنفس النص يُعلن — إعلان نتيجة كل فعل (S28/S32) */
    if (id !== undefined && id !== null && id === lastAnnounced.id && text === lastAnnounced.text) {
      return;
    }
    lastAnnounced = { text: text, id: id };
    region.textContent = '';
    window.setTimeout(function () { region.textContent = text; }, 50);
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
    init: function (root) { bindClose(root); }
  };
  document.addEventListener('DOMContentLoaded', function () { window.MicroMessages.init(); });
  if (document.readyState !== 'loading') window.MicroMessages.init();
})();
