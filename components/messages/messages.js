/* =========================================================
   Micro UI — سلوك مكوّن الرسائل والحالات العامة (B06)
   الملف: components/messages/messages.js
   عقد عام فقط:
   1) MicroMessages.toast(el, options) — الرسالة العابرة لتأكيد
      غير حرج فقط: مدة يحددها المستهلك (options.duration،
      افتراض 4000ms)، إغلاق يدوي دائمًا، وإعلان مرة واحدة عبر
      منطقة aria-live مشتركة (دون تكرار عند إعادة الظهور).
      ليست للرسائل المهمة أو المطلوبة لتصحيح إدخال — تلك ثابتة.
   2) MicroMessages.announce(text, assertive) — إعلان مرة واحدة
      لنفس النص المتتالي (منع التكرار).
   3) إغلاق الرسائل الثابتة ذات زر (.m-note__close) — يخفي
      الرسالة ويعيد التركيز عند الطلب (options.returnFocus).
   لا شبكة ولا retry منطقي داخل المكوّن — إعادة المحاولة عند المستهلك.
   ========================================================= */

(function () {
  'use strict';

  var liveRegion = null;
  var lastAnnounced = '';

  function ensureLiveRegion() {
    if (liveRegion && document.body.contains(liveRegion)) return liveRegion;
    liveRegion = document.createElement('div');
    liveRegion.className = 'm-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
    return liveRegion;
  }

  function announce(text, assertive) {
    var region = ensureLiveRegion();
    region.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    if (text === lastAnnounced) return; /* إعلان دون تكرار */
    lastAnnounced = text;
    region.textContent = '';
    window.setTimeout(function () { region.textContent = text; }, 50);
  }

  function toast(el, options) {
    if (!el || el.nodeType !== 1) return;
    options = options || {};
    var duration = typeof options.duration === 'number' ? options.duration : 4000;
    el.hidden = false;
    announce(el.querySelector('.m-toast__text') ? el.querySelector('.m-toast__text').textContent : el.textContent, false);
    if (el.dataset.toastTimer) window.clearTimeout(parseInt(el.dataset.toastTimer, 10));
    var timer = window.setTimeout(function () {
      el.hidden = true;
      delete el.dataset.toastTimer;
      el.dispatchEvent(new Event('micro-messages:toast-dismissed', { bubbles: true }));
    }, duration);
    el.dataset.toastTimer = String(timer);
  }

  function bindClose(root) {
    (root || document).querySelectorAll('.m-note__close').forEach(function (btn) {
      if (btn.dataset.microNoteBound) return;
      btn.dataset.microNoteBound = '1';
      btn.addEventListener('click', function () {
        var note = btn.closest('.m-note');
        if (!note) return;
        note.hidden = true;
        note.dispatchEvent(new Event('micro-messages:note-closed', { bubbles: true }));
      });
    });
  }

  window.MicroMessages = {
    toast: toast,
    announce: announce,
    init: function (root) { bindClose(root); }
  };
  document.addEventListener('DOMContentLoaded', function () { window.MicroMessages.init(); });
  if (document.readyState !== 'loading') window.MicroMessages.init();
})();
