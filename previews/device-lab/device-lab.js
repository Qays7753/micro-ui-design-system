/* =========================================================
   Micro UI — سلوك مختبر الهاتف (device-lab) — الجولة الثالثة T6.
   الملف: previews/device-lab/device-lab.js

   الدور: تنقّل المختبر فقط (وليس رحلة منتج — N-D2): فهرس ↔ شاشة عبر
   hash، وزر رجوع المتصفح يعود للفهرس (bindBackToLayers + حالات hash)،
   وأدوات المختبر (اتجاه، حجم خط، اهتزاز) في ورقة من مكوّنات المكتبة،
   وسيناريوهات تفاعل قصيرة حقيقية لكل شاشة (تحميل زر ثانيتين، تحقق
   نموذج فارغ، عدّاد تصفية، تبديل محتوى بشريط سفلي حقيقي، تبديل أنواع
   المنتج). كل الشاشات نفسها من مكوّنات المكتبة.
   ========================================================= */

(function () {
  'use strict';

  /* ===== التنقل: hash = معرف الشاشة؛ الرجوع يعيد للفهرس ===== */
  var app = document.querySelector('.lab-app');
  var stage = document.querySelector('.lab-stage');
  var index = document.querySelector('.lab-index');
  if (!app || !stage || !index) return;

  var screens = {};
  [].forEach.call(document.querySelectorAll('[data-lab-screen]'), function (node) {
    screens[node.getAttribute('data-lab-screen')] = node;
  });

  function currentId() {
    var id = location.hash.replace('#', '');
    return screens[id] ? id : 'index';
  }

  function show(id, push) {
    if (push && id !== currentId()) {
      /* حالتا السجل: الفهرس والشاشة — زر الرجوع من شاشة يعيد للفهرس */
      if (currentId() !== 'index') history.back();
    }
    requestAnimationFrame(function () {
      app.setAttribute('data-screen', id);
      stage.setAttribute('data-open', id === 'index' ? 'false' : 'true');
      [].forEach.call(stage.querySelectorAll('[data-lab-screen]'), function (node) {
        node.hidden = node.getAttribute('data-lab-screen') !== id;
      });
      var title = document.querySelector('.lab-screen-title');
      if (title) title.textContent = id === 'index' ? 'مختبر الهاتف' : (screens[id].getAttribute('data-lab-title') || id);
    });
  }

  window.addEventListener('hashchange', function () { show(currentId(), false); });

  [].forEach.call(document.querySelectorAll('[data-lab-open]'), function (link) {
    link.addEventListener('click', function () {
      var id = link.getAttribute('data-lab-open');
      if (location.hash.replace('#', '') === id) { show(id); return; }
      if (currentId() === 'index') history.pushState({ labScreen: id }, '', '#' + id);
      else history.replaceState({ labScreen: id }, '', '#' + id);
      show(id);
    });
  });

  window.addEventListener('popstate', function () {
    /* الرجوع من شاشة إلى الفهرس (طبقات المكوّنات تُغلق أولًا عبر
       bindBackToLayers — popstate هذا يصل فقط بعد فراغ طبقاتها) */
    if (!location.hash || !screens[location.hash.replace('#', '')]) show('index');
  });

  /* ===== أدوات المختبر: ورقة من عائلة المكتبة ===== */
  var toolsSheet = document.getElementById('lab-tools');
  var toolsButton = document.querySelector('.lab-tools-button');
  var nav = window.MicroNavigation;
  if (toolsSheet && toolsButton && nav) {
    toolsButton.addEventListener('click', function () {
      nav.openLayer(toolsSheet, { trigger: toolsButton, backdropEl: document.getElementById('lab-tools-backdrop') });
    });
  }
  window.__labSetDir = function (dir) {
    document.documentElement.dir = dir;
    [].forEach.call(document.querySelectorAll('[data-lab-dir-toggle]'), function (b) {
      b.setAttribute('aria-pressed', String(document.documentElement.dir === b.getAttribute('data-lab-dir-toggle')));
    });
  };
  window.__labSetFontScale = function (percent) {
    document.documentElement.style.fontSize = (16 * percent / 100) + 'px';
    [].forEach.call(document.querySelectorAll('[data-lab-font-scale]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lab-font-scale') === String(percent)));
    });
  };
  window.__labSetHaptics = function (on) {
    var enabled = window.MicroHaptics ? window.MicroHaptics.setHaptics(on) : false;
    var b = document.querySelector('[data-lab-haptics]');
    if (b) b.setAttribute('aria-pressed', String(enabled));
    return enabled;
  };

  /* ===== ربط زر الرجوع بالطبقات (N-D8) — المختبر يفعّله ===== */
  if (window.MicroBack) window.__labBack = window.MicroBack.bindBackToLayers();

  /* ===== سيناريوهات الشاشات ===== */

  /* الأزرار: التحميل ثانيتين والحالات تُجرّب بالضغط */
  [].forEach.call(document.querySelectorAll('[data-lab-loading-demo]'), function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-loading')) return;
      window.MicroButtons.setLoading(btn, true);
      setTimeout(function () { window.MicroButtons.setLoading(btn, false); }, 2000);
    });
  });

  /* الحقول: إرسال فارغ يظهر خطأ الحقول */
  var form = document.getElementById('lab-fields-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstEmpty = null;
      [].forEach.call(form.querySelectorAll('.m-field__input'), function (input) {
        if (!input.value.trim() && input.hasAttribute('required')) {
          input.setAttribute('aria-invalid', 'true');
          if (!firstEmpty) firstEmpty = input;
        } else {
          input.removeAttribute('aria-invalid');
        }
      });
      if (firstEmpty) firstEmpty.focus();
      var note = document.getElementById('lab-fields-error');
      if (note) note.hidden = !firstEmpty;
    });
  }

  /* الشريط السفلي الحقيقي: يبدل أقسام المحتوى داخليًا */
  [].forEach.call(document.querySelectorAll('[data-lab-nav-item]'), function (item) {
    item.addEventListener('click', function () {
      var bar = item.closest('.m-navbar');
      if (!bar) return;
      [].forEach.call(bar.querySelectorAll('.m-navbar__item'), function (b) {
        b.setAttribute('aria-current', b === item ? 'page' : 'false');
      });
      var screenRoot = item.closest('[data-lab-screen]');
      var target = item.getAttribute('data-lab-nav-item');
      [].forEach.call(screenRoot.querySelectorAll('[data-lab-nav-panel]'), function (panel) {
        panel.hidden = panel.getAttribute('data-lab-nav-panel') !== target;
      });
    });
  });

  /* المنتج: تبديل أنواع العرض (state/market/delivery/assistant/review/manage) */
  [].forEach.call(document.querySelectorAll('[data-lab-product-type]'), function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.getAttribute('data-lab-product-type');
      var root = document.getElementById('lab-product-root');
      if (!root || !window.MicroProduct) return;
      root.innerHTML = '';
      var owner = { contextId: 'lo', workspaceId: 'lw', roleId: 'owner', kind: 'business', label: 'ورشة الشروق' };
      var base = {
        scope: owner, dataContext: owner, phase: 'ready', connection: 'online',
        destination: type === 'assistant' ? 'ask' : type === 'market' ? 'market' : type === 'delivery' ? 'delivery' : type === 'context' ? 'delivery' : type === 'review' ? 'market' : 'manage',
        permissions: ['view', 'compose', 'reauth', 'recheck', 'retry', 'edit', 'publish', 'send', 'approve'],
        revision: 'lab-r1', messages: [],
      };
      if (type === 'state') { base.title = 'طلب توصيل'; base.reference = 'rq-1174'; base.detail = 'بانتظار تأكيد استلام الطلب.'; }
      if (type === 'market') Object.assign(base, { mode: 'card', id: 'listing-9', title: 'طقم صابون مصنوع يدويًا', description: 'طقم صابون معطر مصنوع يدويًا بخمس قطع.', price: '150', unit: 'د.أ', sellerLabel: 'ورشة الشروق', statusLabel: 'قيد المراجعة', images: [] });
      if (type === 'delivery') Object.assign(base, { mode: 'offer', id: 'dl-31', title: 'طلب توصيل', statusLabel: 'بانتظار الرد', pickup: 'ورشة الشروق · عمّان', dropoff: 'العميل · الزرقاء', amount: '12', unit: 'د.أ', steps: [{ label: 'طلب جديد', time: '09:00', detail: 'تم إرسال الطلب.' }, { label: 'بانتظار رد', current: true, detail: 'لم يصل رد بعد.' }] });
      if (type === 'assistant') base.messages = [
        { id: 'm1', speaker: 'user', text: 'اعرض طلبات اليوم.' },
        { id: 'm2', speaker: 'assistant', text: 'اختر الطلب الذي تريد متابعته.' },
      ];
      if (type === 'review') Object.assign(base, { mode: 'item', id: 'rv-77', title: 'عنصر للمراجعة', subjectLabel: 'إعلان معروض للمراجعة', summary: 'حقول مراجعة مصرح بها فقط.', statusLabel: 'بانتظار قرار المصدر', reasonRequired: true, requiredFields: ['reason'] });
      if (type === 'manage') Object.assign(base, { unit: 'د.أ', summary: [{ label: 'إجمالي المبيعات', value: '1150' }, { label: 'صافي الفترة', value: '870' }], operations: [
        { id: 'op-1', type: 'sale', amount: '150', date: '2026-11-19', description: 'طقم صابون — عميل عمّان' },
        { id: 'op-2', type: 'expense', amount: '40', date: '2026-11-18', description: 'مواد تغليف' },
      ] });
      window.MicroProduct.mount(root, type, base);
    });
  });

  /* الوصول: أزرار البوابة تستدعي واجهاتها (لا شبكة) */
  [].forEach.call(document.querySelectorAll('[data-lab-gateway-form]'), function (formNode) {
    formNode.addEventListener('submit', function (e) { e.preventDefault(); });
  });

  /* المنتق: قائمة طويلة (٢٠ صنفًا) */
  var labPicker = document.getElementById('lab-picker');
  if (labPicker && window.MicroPicker) {
    var items = [];
    var names = ['صابون زيت الزيتون', 'صابون الغار', 'شموع صويا', 'شموع عسل', 'زيت لوز', 'زيت لافندر',
      'طقم هدايا صغير', 'طقم هدايا كبير', 'عبوة سفر', 'كرت تعبئة', 'أكياس organza', 'ملصقات مطبوعة',
      'خيط قطني', 'فتائل قطنية', 'علب زجاجية', 'غطاء خشبي', 'مقياس 100مل', 'قمع تعبئة', 'قفازات', 'دليل الاستخدام'];
    names.forEach(function (n, i) { items.push({ value: 'item-' + i, label: n }); });
    window.MicroPicker.setOptions(labPicker, items);
  }

  /* التقويم: تهيئة كسولة عند أول فتح للشاشة (المكون بلا تهيئة تلقائية) */
  var calendarInited = false;
  var calendarObserver = function (id) {
    if (id !== 'calendar' || calendarInited) return;
    calendarInited = true;
    var root = document.getElementById('lab-calendar-root');
    if (!root || !window.MicroOrderSchedule) return;
    var day = new Date(); day.setHours(0, 0, 0, 0);
    var iso = function (d) { return d.toISOString().slice(0, 10); };
    var month = iso(day).slice(0, 7);
    window.__labCalendar = window.MicroOrderSchedule.init(root, {
      today: iso(day), selectedDate: iso(day), displayedMonth: month,
      view: 'calendar', calendarView: 'day', weekStart: 0,
      statuses: { open: { label: 'قيد التنفيذ', tone: 'progress' }, done: { label: 'منجز', tone: 'success' } },
      orders: [
        { id: 'o-1', date: iso(day), title: 'طقم صابون — عميل عمّان', time: '10:00', statusKey: 'open' },
        { id: 'o-2', date: iso(day), title: 'شموع معطرة — الزرقاء', time: '14:30', statusKey: 'open' },
        { id: 'o-3', date: iso(new Date(day.getTime() + 864e5)), title: 'زيوت معطرة', time: '09:00', statusKey: 'done' },
      ],
    });
  };
  /* الرسائل: تنبيه عابر حقيقي */
  var toastShow = document.getElementById('lab-toast-show');
  if (toastShow && window.MicroMessages) {
    toastShow.addEventListener('click', function () {
      var t = document.getElementById('lab-toast');
      window.MicroMessages.toast(t, { duration: 2000 });
    });
  }
  var toastError = document.getElementById('lab-toast-error');
  if (toastError && window.MicroMessages) {
    toastError.addEventListener('click', function () {
      window.MicroMessages.announce('إعادة محاولة الإرسال', { tone: 'error', assertive: true });
      var t = document.getElementById('lab-toast');
      t.querySelector('.m-toast__text').textContent = 'أُعيدت المحاولة';
      window.MicroMessages.toast(t, { duration: 2000 });
    });
  }

  /* حالة الخطأ: إعادة المحاولة تجرب التحميل ثانيتين ثم تنجح */
  var errorRetry = document.getElementById('lab-error-retry');
  if (errorRetry && window.MicroButtons) {
    errorRetry.addEventListener('click', function () {
      errorRetry.dispatchEvent(new CustomEvent('micro-error:retry', { bubbles: true }));
      window.MicroButtons.setLoading(errorRetry, true);
      setTimeout(function () { window.MicroButtons.setLoading(errorRetry, false); }, 2000);
    });
  }

  /* أنواع المنتج: مزامنة الحالة المضغوطة */
  [].forEach.call(document.querySelectorAll('[data-lab-product-type]'), function (btn) {
    btn.addEventListener('click', function () {
      [].forEach.call(document.querySelectorAll('[data-lab-product-type]'), function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
    });
  });

  /* المنتج: النوع الافتراضي عند فتح شاشته أول مرة */
  var productInited = false;
  var originalShow2 = show;
  show = function (id, push) {
    originalShow2(id, push);
    /* بعد إطار الإظهار: المكونات الكسولة تقيس جذورًا ظاهرة */
    requestAnimationFrame(function () {
      if (id === 'product' && !productInited) {
        productInited = true;
        var first = document.querySelector('[data-lab-product-type]');
        if (first) first.click();
      }
      calendarObserver(id);
    });
  };

  show(currentId(), false);
  window.__labReady = true;
})();
