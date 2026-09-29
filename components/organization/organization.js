/* =========================================================
   Micro UI — سلوك مكوّن التنظيم والمعلومات (B04)
   الملف: components/organization/organization.js
   عقد عام فقط:
   1) القسم القابل للطي: مفتاح aria-expanded + hidden للجسم —
      بلا حركة layout (لا قفز). التسمية الموسعة/المضمومة نص المستهلك.
   2) فشل صورة الهوية: <img data-avatar-fallback> عند الخطأ يستبدل
      بأحرف أولى من الاسم (بديل ظاهر لا مربع مكسور).
   ========================================================= */

(function () {
  'use strict';

  function initSections(root) {
    (root || document).querySelectorAll('.m-section__head').forEach(function (head) {
      if (head.dataset.microSectionBound) return;
      head.dataset.microSectionBound = '1';
      head.addEventListener('click', function () {
        var section = head.closest('.m-section');
        var body = section ? section.querySelector('.m-section__body') : null;
        if (!body) return;
        var open = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', open ? 'false' : 'true');
        body.hidden = open; /* طي/فتح فوري — لا حركة تغيّر التخطيط */
        section.dispatchEvent(new CustomEvent('micro-organization:toggle', {
          bubbles: true, detail: { open: !open }
        }));
      });
    });
  }

  function initAvatars(root) {
    (root || document).querySelectorAll('img[data-avatar-fallback]').forEach(function (img) {
      if (img.dataset.microAvatarBound) return;
      img.dataset.microAvatarBound = '1';
      function fallback() {
        var wrap = img.closest('.m-identity');
        if (!wrap) return;
        var name = (wrap.querySelector('.m-identity__name') || {}).textContent || '';
        var initials = name.trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('');
        var span = document.createElement('span');
        span.className = 'm-identity__initials';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = initials || '؟';
        img.replaceWith(span);
      }
      img.addEventListener('error', fallback);
      /* صورة فشلت قبل ربط المستمع (تحميل سريع): نفحص الحالة الحالية */
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }

  window.MicroOrganization = {
    init: function (root) { initSections(root); initAvatars(root); }
  };

  document.addEventListener('DOMContentLoaded', function () { window.MicroOrganization.init(); });
  if (document.readyState !== 'loading') window.MicroOrganization.init();
})();
