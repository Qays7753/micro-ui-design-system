/* =========================================================
   Micro UI — سلوك عام لصفحات المعاينة (previews/board.js)
   يستخدمه فرع التوسعة (B02+)؛ لوحة B01 لها board.js خاص بها
   ولا يُلمس حتى انتهاء مراجعتها.

   المسؤوليات (كلها لوحة عرض، لا شيء منها داخل المكوّنات):
   1) تحميل الأيقونات من أصلها الوحيد assets/icons/*.svg إلى
      <symbol> وقت التشغيل — مصدر واحد، تعديل الأصل ينعكس هنا.
      خريطة الرموز: window.MICRO_ICONS = [{file, id}, ...]
      تُعرّفها صفحة العائلة قبل تحميل هذا الملف (افتراضي مشترك).
   2) محاكاة زيادة حجم الخط 200% على عمود #text-zoom-target:
      مروران (قراءة كل الأحجام الأصلية أولًا ثم تطبيق العامل) —
      نفس آلية واسم B01 بعد تصحيح R2-D. التسمية الرسمية
      «محاكاة زيادة حجم الخط»: مكافئة للنص، وليست تكبير
      متصفح/نظام مضمون التكافؤ. آلية CDP غير متاحة في بيئة الفحص.
   ========================================================= */

(function () {
  'use strict';

  /* ---- 1) الأيقونات: أصل واحد → رموز وقت التشغيل ---- */
  var ICONS = window.MICRO_ICONS || [
    { file: 'search-01.svg', id: 'i-search' },
    { file: 'filter-horizontal.svg', id: 'i-filter' },
    { file: 'add-01.svg', id: 'i-add' },
    { file: 'checkmark-circle-02.svg', id: 'i-check-circle' },
    { file: 'delete-02.svg', id: 'i-delete' },
    { file: 'check.svg', id: 'i-check' },
    { file: 'cancel01.svg', id: 'i-close' },
    { file: 'chevron-down.svg', id: 'i-chevron-down' },
    { file: 'chevron-left.svg', id: 'i-chevron-left' },
    { file: 'chevron-right.svg', id: 'i-chevron-right' },
    { file: 'arrow-up02.svg', id: 'i-arrow-up' },
    { file: 'arrow-down02.svg', id: 'i-arrow-down' },
    { file: 'plus-sign.svg', id: 'i-plus' },
    { file: 'minus-sign.svg', id: 'i-minus' },
    { file: 'image01.svg', id: 'i-image' },
    { file: 'home02.svg', id: 'i-home' },
    { file: 'menu01.svg', id: 'i-menu' },
    { file: 'clock01.svg', id: 'i-clock' },
    { file: 'calendar03.svg', id: 'i-calendar' },
    { file: 'alert01.svg', id: 'i-alert' },
    { file: 'alert-circle.svg', id: 'i-alert-circle' },
    { file: 'information-circle.svg', id: 'i-info' },
    { file: 'user-circle.svg', id: 'i-user' },
    { file: 'package01.svg', id: 'i-package' },
    { file: 'truck.svg', id: 'i-truck' },
    { file: 'inbox.svg', id: 'i-inbox' },
    { file: 'wallet01.svg', id: 'i-wallet' },
    { file: 'more-vertical.svg', id: 'i-more' },
    { file: 'grid.svg', id: 'i-grid' },
    { file: 'refresh.svg', id: 'i-refresh' },
    { file: 'eye.svg', id: 'i-eye' },
    { file: 'home01.svg', id: 'i-home01' }
  ];

  function loadIcons() {
    var defs = document.getElementById('m-icon-defs');
    var status = document.getElementById('icon-load-status');
    if (!defs) return;
    var failed = [];
    Promise.all(ICONS.map(function (ic) {
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
          status.textContent = 'تم تحميل ' + ICONS.length + ' رموز من assets/icons (مصدر واحد).';
        }
      }
      if (failed.length && window.console) {
        console.warn('[Micro preview] icon load failed:', failed.join(', '));
      }
    });
  }

  /* ---- 2) محاكاة زيادة حجم الخط 200% (مروران — تصحيح R2-D) ---- */
  function applyTextZoom(root, factor) {
    var els = [root].concat([].slice.call(root.querySelectorAll('*')));
    /* مرور 1: قراءة كل الأحجام الأصلية قبل أي تعديل — لا مضاعفة موروثة */
    var originals = els.map(function (el) {
      return { el: el, fs: parseFloat(getComputedStyle(el).fontSize) };
    });
    /* مرور 2: تطبيق العامل على الحجم الأصلي المحفوظ */
    originals.forEach(function (item) {
      if (item.el.dataset.tzStyle !== undefined) return;
      item.el.dataset.tzStyle = item.el.getAttribute('style') || '';
      item.el.style.fontSize = (item.fs * factor) + 'px';
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

  function wireZoomLab() {
    var btn = document.querySelector('[data-lab="text-zoom"]');
    var target = document.getElementById('text-zoom-target');
    if (!btn || !target) return;
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') === 'true';
      if (on) {
        restoreTextZoom(target);
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = 'محاكاة زيادة حجم الخط 200%';
      } else {
        applyTextZoom(target, 2);
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = 'إلغاء محاكاة زيادة حجم الخط';
      }
    });
  }

  loadIcons();
  wireZoomLab();
})();
