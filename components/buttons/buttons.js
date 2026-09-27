/* =========================================================
   Micro UI — سلوك مكوّن الأزرار (B01)
   الملف: components/buttons/buttons.js
   الدور: سلوك عام للمكوّن فقط (حالة التحميل ومنع التكرار).
   العروض التجريبية (عدّاد التصفية ورسالة الاكتمال) تُفعّل بعناصر
   موسومة بـ data-demo داخل لوحة المعاينة — ليست جزءًا من المكوّن.
   بدون إطار عمل ولا تبعيات. يعمل أيضًا دون هذا الملف عند الاستخدام الثابت.
   ========================================================= */

(function () {
  'use strict';

  /**
   * حالة التحميل على زر:
   * - aria-busy="true" + صف .is-loading: يمنع التكرار ويحفظ المساحة.
   * - المؤشر يشغل فتحة الأيقونة (20px) فلا يتغير عرض الزر.
   * - الاسم الإتاحي يتحدث إلى «جارٍ + الفعل» إن توفّر نص الزر.
   */
  function setLoading(btn, isLoading) {
    var icon = btn.querySelector('.m-btn__icon');
    var spinner = btn.querySelector('.m-btn__spinner');

    if (isLoading) {
      if (btn.getAttribute('aria-busy') === 'true') return; // محمّل أصلًا — منع التكرار
      btn.setAttribute('aria-busy', 'true');
      btn.classList.add('is-loading');
      btn.dataset.ariaLabelBefore = btn.getAttribute('aria-label') || '';
      if (!btn.getAttribute('aria-label')) {
        var text = (btn.textContent || '').trim();
        if (text) btn.setAttribute('aria-label', 'جارٍ ' + text);
      }
      if (!spinner) {
        spinner = document.createElement('span');
        spinner.className = 'm-btn__spinner';
        spinner.setAttribute('aria-hidden', 'true');
        if (icon) {
          icon.parentElement.insertBefore(spinner, icon); /* مكان الأيقونة نفسه */
        } else {
          btn.insertBefore(spinner, btn.firstChild);
        }
      }
    } else {
      btn.removeAttribute('aria-busy');
      btn.classList.remove('is-loading');
      if (btn.dataset.ariaLabelBefore) {
        btn.setAttribute('aria-label', btn.dataset.ariaLabelBefore);
        delete btn.dataset.ariaLabelBefore;
      } else {
        btn.removeAttribute('aria-label');
      }
      if (spinner && spinner.dataset.demo !== 'persistent') spinner.remove();
    }
  }

  /* رسالة اكتمال مجاورة بسيطة — لا تحويل الزر نفسه إلى الأخضر (قاعدة التكليف) */
  function showDone(btn) {
    var scope = btn.closest('[data-demo-group]') || btn.parentElement;
    var msg = scope.querySelector('[data-demo-message]');
    if (!msg) return;
    msg.hidden = false;
    msg.textContent = 'تم الحفظ — رسالة تجريبية للعرض فقط';
    if (scope.querySelector('[data-demo-note]')) {
      scope.querySelector('[data-demo-note]').hidden = true;
    }
  }

  /* ---------------- العروض التجريبية داخل لوحة المعاينة ---------------- */

  /* زر حفظ تجريبي: تحميل حقيقي ثم رسالة اكتمال مجاورة */
  document.querySelectorAll('[data-demo="save"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-busy') === 'true') return;
      setLoading(btn, true);
      /* مهلة قصيرة لإثبات الحالة بصريًا — محاكاة موسومة بأنها تجريبية */
      window.setTimeout(function () {
        setLoading(btn, false);
        showDone(btn);
      }, 2200);
    });
  });

  /* زر تصفية تجريبي: يبدّل العدّاد بين 0 و2 و123 لإثبات الأشكال الثلاثة.
     لا لوحة تصفية ولا تنقّل وهمي — فقط عدّاد داخل الزر (حدود التكليف). */
  document.querySelectorAll('[data-demo="filter"]').forEach(function (btn) {
    var counter = btn.querySelector('.m-btn__counter');
    var counts = [0, 2, 123];
    var labels = [
      'تصفية، لا فلاتر نشطة',
      'تصفية، فلتران نشطان',
      'تصفية، 123 فلترًا نشطًا — مثال بعدد طويل'
    ];
    var i = 0;
    btn.addEventListener('click', function () {
      i = (i + 1) % counts.length;
      counter.textContent = String(counts[i]);
      counter.classList.toggle('m-btn__counter--zero', counts[i] === 0);
      btn.setAttribute('aria-label', labels[i]);
    });
  });

  /* إتاحة التحميل لأي مكوّن .m-btn عبر السمة data-loading-api
     (مثال: عناصر تجريبية أخرى لاحقًا دون تكرار الكود) */
  document.querySelectorAll('.m-btn[data-loading-api]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-busy') === 'true') return;
      setLoading(btn, true);
      window.setTimeout(function () { setLoading(btn, false); }, 2200);
    });
  });

  /* كشف بسيط للاختبار اليدوي: MicroButtons.setLoading(el, true|false) */
  window.MicroButtons = { setLoading: setLoading };
})();
