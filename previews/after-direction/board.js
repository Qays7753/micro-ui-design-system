/* =========================================================
   Micro UI — سلوك لوحة اتجاه After (previews/after-direction/board.js)
   سلوك **لوحة عرض فقط** — لا شيء منه داخل المكوّنات وقابل للإزالة
   دون تأثير على أي مكوّن:

   1) توسعة/طي التفاصيل [data-card-expand] **خارج** العارض:
      عقد التوسعة العام (aria-expanded/aria-controls + hidden على
      [data-card-details] + نصا data-label-closed/open) معرّف داخل
      مكوّن العارض (carousel.js) لبطاقات الشرائح. ملخصات البيانات
      المركبة في هذه اللوحة تستخدم العقد نفسها خارج العارض، فتربطها
      هذه الدالة هنا (سلوك لوحة بحت). حراسة: الزر المرتبط داخل شريحة
      عارض يُترك للعارض — لا ربط مزدوج (علم data-aftExpandBound).

   2) إظهار نتيجة فحص تحميل الأيقونات إن وُجد عنصر الحالة (نفس
      آلية previews/board.js يملأها — لا تكرار هنا).

   التشغيل: تلقائي بعد التحميل — بلا اعتماديات خارج لوحات المعاينة.
   ========================================================= */

(function () {
  'use strict';

  function initExpand(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-card-expand]').forEach(function (btn) {
      if (btn.dataset.aftExpandBound) return;
      /* داخل شريحة عارض؟ العارض يربطها بنفسه — لا ربط مزدوج */
      if (btn.closest('[data-carousel-slide]')) return;
      btn.dataset.aftExpandBound = '1';

      var regionId = btn.getAttribute('aria-controls');
      var region = regionId ? document.getElementById(regionId) : null;
      if (!region) {
        var host = btn.closest('.aft-summary, .m-carousel__card, [data-card-host]') || document;
        region = host.querySelector('[data-card-details]');
        if (region && region.id) btn.setAttribute('aria-controls', region.id);
      }
      if (!region) return;

      var labelClosed = btn.getAttribute('data-label-closed') || 'عرض التفاصيل';
      var labelOpen = btn.getAttribute('data-label-open') || 'إخفاء التفاصيل';
      var text = btn.querySelector('[data-card-expand-text]') || btn;
      /* النص الابتدائي من الترميز إن لم يوجد عقد النص */
      if (!btn.getAttribute('data-label-closed') && text.textContent) {
        labelClosed = text.textContent.trim() || labelClosed;
      }

      function apply(open) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        region.hidden = !open;
        if (text) text.textContent = open ? labelOpen : labelClosed;
      }

      btn.addEventListener('click', function () {
        apply(btn.getAttribute('aria-expanded') !== 'true');
      });
      apply(btn.getAttribute('aria-expanded') === 'true'); /* مزامنة أولية */
    });
  }

  window.MicroAfterBoard = { init: initExpand };
  document.addEventListener('DOMContentLoaded', function () { initExpand(); });
  if (document.readyState !== 'loading') initExpand();
})();
