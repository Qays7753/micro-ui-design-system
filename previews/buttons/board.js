/* =========================================================
   Micro UI — مساعدات لوحة معاينة الأزرار فقط (previews/buttons/board.js)
   سلوك المكوّن نفسه في components/buttons/buttons.js.
   هذا الملف خاص بأدوات الفحص داخل اللوحة (تكبير 200%).
   ========================================================= */

(function () {
  'use strict';

  /* زر «تكبير 200%»: يضخّم عمود أصعب مثال بمعامل 2 عبر خاصية zoom
     (مدعومة في Chromium وSafari وFirefox 126+). هذا يحاكي تكبير الصفحة:
     التخطيط يبقى بعرض 390px المنطقي والنص يتضاعف — نفحص الالتفاف دون قص. */
  var zoomBtn = document.querySelector('[data-lab="zoom"]');
  var target = document.getElementById('zoom-target');
  if (zoomBtn && target) {
    zoomBtn.addEventListener('click', function () {
      var on = zoomBtn.getAttribute('aria-pressed') === 'true';
      if (on) {
        target.style.zoom = '';
        zoomBtn.setAttribute('aria-pressed', 'false');
        zoomBtn.textContent = 'تكبير 200% — أصعب مثال';
      } else {
        target.style.zoom = '2';
        zoomBtn.setAttribute('aria-pressed', 'true');
        zoomBtn.textContent = 'إلغاء التكبير 200%';
      }
    });
  }
})();
