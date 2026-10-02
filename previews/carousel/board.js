/* =========================================================
   Micro UI — سلوك لوحة معاينة العارض (previews/carousel/board.js)
   لوحة عرض فقط — لا شيء منها داخل المكوّن.
   1) محاكاة تقليل الحركة المعلنة: زر [data-lab="reduce-toggle"]
      يفعّل صنف micro-reduce (من shared/motion.css) على نطاق المعمل.
      الفحص الفعلي بالتفضيل الحقيقي عبر Playwright reduced_motion.
   لا autoplay ولا منطق أعمال هنا — العارض نفسه في components/.
   ========================================================= */

(function () {
  'use strict';

  var btn = document.querySelector('[data-lab="reduce-toggle"]');
  var scope = document.getElementById('motion-scope');
  if (btn && scope) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') === 'true';
      if (on) {
        scope.classList.remove('micro-reduce');
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = 'تفعيل محاكاة تقليل الحركة (micro-reduce)';
      } else {
        scope.classList.add('micro-reduce');
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = 'إلغاء محاكاة تقليل الحركة';
      }
    });
  }
})();
