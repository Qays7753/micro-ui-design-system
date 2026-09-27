/* =========================================================
   Micro UI — لوحة معاينة الأزرار (previews/buttons/board.js)
   هذا الملف خاص بلوحة المعاينة وحدها:
   1) تحميل الأيقونات من أصلها الوحيد assets/icons/*.svg (مصدر واحد —
      تعديل الأصل ينعكس هنا دون نسخة ثانية داخل HTML).
   2) العروض التجريبية (المؤقتات، رسالة الاكتمال، عدّاد التصفية) —
      محاكاة موسومة بأنها تجريبية، خارج المكوّن تمامًا.
   سلوك المكوّن نفسه في components/buttons/buttons.js (واجهة عامة:
   MicroButtons.setLoading) — المستهلك يحدد بداية التحميل ونهايته.
   مثال استخدام خارج اللوحة: previews/buttons/example-usage.html
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     1) الأيقونات: أصل واحد → رموز <symbol> وقت التشغيل
        خرائط الاسم ثابتة هنا (اسم الملف → معرف الرمز).
     --------------------------------------------------------- */
  var ICON_SOURCES = [
    { file: 'search-01.svg', id: 'i-search' },
    { file: 'filter-horizontal.svg', id: 'i-filter' },
    { file: 'add-01.svg', id: 'i-add' },
    { file: 'checkmark-circle-02.svg', id: 'i-check-circle' },
    { file: 'delete-02.svg', id: 'i-delete' },
    { file: 'check.svg', id: 'i-check' }
  ];

  function loadIcons() {
    var defs = document.getElementById('m-icon-defs');
    var status = document.getElementById('icon-load-status');
    if (!defs) return;
    var failed = [];

    Promise.all(ICON_SOURCES.map(function (ic) {
      return fetch('../../assets/icons/' + ic.file)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.text();
        })
        .then(function (text) {
          var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
          if (doc.querySelector('parsererror')) throw new Error('SVG parse error');
          var src = doc.querySelector('svg');
          if (!src) throw new Error('No <svg> root');
          /* الرمز يُبنى من محتوى الأصل كما هو — بدون تعديل مسارات */
          var sym = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
          sym.id = ic.id;
          sym.setAttribute('viewBox', src.getAttribute('viewBox') || '0 0 24 24');
          sym.setAttribute('fill', src.getAttribute('fill') || 'none');
          sym.innerHTML = src.innerHTML;
          defs.appendChild(sym);
        })
        .catch(function () { failed.push(ic.file); });
    })).then(function () {
      if (status) {
        if (failed.length) {
          status.textContent = 'فشل تحميل: ' + failed.join('، ') + ' — شغّل اللوحة بخادم محلي من جذر المستودع (README).';
        } else {
          status.textContent = 'تم تحميل ' + ICON_SOURCES.length + ' رموز من assets/icons (مصدر واحد).';
        }
      }
      if (failed.length && window.console) {
        console.warn('[B01 preview] icon load failed:', failed.join(', '));
      }
    });
  }

  /* ---------------------------------------------------------
     2) العروض التجريبية — محاكاة للعرض فقط (ليست جزءًا من المكوّن)
     --------------------------------------------------------- */

  /* رسالة اكتمال مجاورة بسيطة — الزر نفسه لا يتحول إلى الأخضر */
  function showDone(btn) {
    var scope = btn.closest('[data-demo-group]') || btn.parentElement;
    var msg = scope.querySelector('[data-demo-message]');
    if (!msg) return;
    msg.hidden = false;
    msg.textContent = 'تم الحفظ — رسالة تجريبية للعرض فقط';
  }

  /* إخفاء نجاح المحاولة السابقة عند بدء محاولة جديدة (إصلاح R1):
     لا يُظهر النجاح قبل انتهاء المحاكاة، ولا يبقى نجاح قديم ظاهرًا. */
  function clearDone(btn) {
    var scope = btn.closest('[data-demo-group]') || btn.parentElement;
    var msg = scope.querySelector('[data-demo-message]');
    if (msg) {
      msg.hidden = true;
      msg.textContent = '';
    }
  }

  /* زر حفظ تجريبي: إخفاء أي نجاح سابق → تحميل عبر واجهة المكوّن →
     بعد 2200ms توقف المكوّن ثم رسالة الاكتمال. المؤقت هنا في اللوحة
     (محاكاة المستهلك) وليس داخل buttons.js. */
  document.querySelectorAll('[data-demo="save"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-busy') === 'true') return;
      clearDone(btn);
      MicroButtons.setLoading(btn, true); /* التسمية من data-loading-label: «جارٍ الحفظ» */
      window.setTimeout(function () {
        MicroButtons.setLoading(btn, false);
        showDone(btn);
      }, 2200);
    });
  });

  /* زر تصفية تجريبي: يبدّل العدّاد بين 0 و2 و123 لإثبات الأشكال.
     عند 0: الشارة مخفية (m-btn__counter--zero = display:none) والاسم
     الإتاحي يوضح عدم وجود فلاتر — توجيه جولة التصحيح R2.
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

  /* عرض تجريبي عام لواجهة المكوّن على أي زر data-loading-api:
     يبدأ التحميل عند النقر وينتهي بعد 2200ms — المؤقت محاكاة لوحة
     وليس سلوك المكوّن. الزر المعطل أصلًا لا يتفاعل (disabled أصلي). */
  document.querySelectorAll('.m-btn[data-loading-api]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-busy') === 'true' || btn.disabled) return;
      MicroButtons.setLoading(btn, true);
      window.setTimeout(function () { MicroButtons.setLoading(btn, false); }, 2200);
    });
  });

  /* ---------------------------------------------------------
     3) محاكاة تكبير النص 200% على عمود الفحص (بند 8)
        تضاعف حجم الخط المحسوب لكل عناصر العمود — مكافئ لتكبير
        النص في المتصفح: الخط يتضاعف وتبقى الصناديق غير النصية.
        آلية CDP Emulation.setTextZoomFactor أُزيلت من Chromium
        الحديث (تحقق فعلي) فاستُخدمت هذه المحاكاة القابلة للنقر.
     --------------------------------------------------------- */
  var zoomLabBtn = document.querySelector('[data-lab="text-zoom"]');
  var zoomLab = document.getElementById('text-zoom-target');

  function applyTextZoom(root, factor) {
    var els = [root].concat([].slice.call(root.querySelectorAll('*')));
    els.forEach(function (el) {
      if (el.dataset.tzStyle !== undefined) return; /* لا مضاعفة مزدوجة */
      el.dataset.tzStyle = el.getAttribute('style') || '';
      var fs = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = (fs * factor) + 'px';
    });
  }

  function restoreTextZoom(root) {
    var els = [root].concat([].slice.call(root.querySelectorAll('*')));
    els.forEach(function (el) {
      if (el.dataset.tzStyle === undefined) return;
      if (el.dataset.tzStyle === '') el.removeAttribute('style');
      else el.setAttribute('style', el.dataset.tzStyle);
      delete el.dataset.tzStyle;
    });
  }

  if (zoomLabBtn && zoomLab) {
    zoomLabBtn.addEventListener('click', function () {
      var on = zoomLabBtn.getAttribute('aria-pressed') === 'true';
      if (on) {
        restoreTextZoom(zoomLab);
        zoomLabBtn.setAttribute('aria-pressed', 'false');
        zoomLabBtn.textContent = 'محاكاة تكبير النص 200%';
      } else {
        applyTextZoom(zoomLab, 2);
        zoomLabBtn.setAttribute('aria-pressed', 'true');
        zoomLabBtn.textContent = 'إلغاء محاكاة تكبير النص';
      }
    });
  }

  /* ---------------------------------------------------------
     4) التشغيل
     --------------------------------------------------------- */
  loadIcons();
})();
