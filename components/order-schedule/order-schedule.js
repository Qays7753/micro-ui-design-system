/* =========================================================
   Micro UI — سلوك مكوّن جدول الطلبات المجدولة (order-schedule)
   الملف: components/order-schedule/order-schedule.js
   الاسم العالمي: window.MicroOrderSchedule — البادئة m-ocal.

   عقد عام (المفصّل في specification.md):
   MicroOrderSchedule.init(rootElement, options) → instance
   instance / MicroOrderSchedule.getInstance(root):
     setData(orders)             تحديث كامل بلا إعادة تهيئة
     setSelectedDate('YYYY-MM-DD')
     setView('calendar'|'list')
     setCalendarView('month'|'day')
     setLoading(true|false)
     setError(retryCallback|null)
     destroy()
   أحداث CustomEvent على الجذر (bubbles):
     order-schedule:day-select   {date:'YYYY-MM-DD'}
     order-schedule:order-open   {id}
     order-schedule:add-request  {date:'YYYY-MM-DD'|null}

   قواعد ثابتة:
   - عربي RTL (يُستكشف الاتجاه من الجذر؛ LTR يعمل معكوسًا
     كأفضل مجهود — المنتج عربي أولًا).
   - كل نص من البيانات عبر textContent/عُقد DOM — لا HTML من
     البيانات أبدًا (حقن `<img onerror>` يظهر نصًا حرفيًا).
   - كل التواريخ نصوص 'YYYY-MM-DD': ممنوع Date.parse/UTC/
     toISOString — حساب (y,m,d) صريح؛ يوم الأسبوع عبر
     new Date(y, m-1, d).getDay() محليًا (آمن مدنيًا).
   - الحالة تأتي من خريطة المستهلك فقط: مفتاح مجهول → محايد
     بنص المفتاح الخام (لا إخفاء ولا خطأ). لا استنتاج حالة من
     التاريخ ولا أي معنى مالي.
   - مستمعان مفوّضان على الجذر فقط (click + keydown) يسجلان
     مرة عند التهيئة وينتزعان في destroy() — إعادة التصيير لا
     تضيف مستمعات، والتهيئة المزدوجة آمنة (data-ocal-init).
   - لا مؤقتات دائمة ولا rAF داخل المكوّن.
   ========================================================= */

(function () {
  'use strict';

  /* ---- أنماط التحقق النصي (لا تحويل تاريخ عبر UTC) ---- */
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

  /* ---- أسماء عربية داخلية (لا مكتبة خارجية) ---- */
  var MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  /* بفهرس getDay(): 0=الأحد .. 6=السبت */
  var WEEKDAYS_FULL = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  /* F-08 (2026-10-10): اختصارات عمود رأس الأسبوع ثلاثية الأحرف (عرف
     التقاويم الهاتفية) — الاسم الكامل يبقى في aria-label خلية كل يوم
     (رأس الأسبوع aria-hidden بصري فقط). كان: أسماء 5-6 أحرف مثل
     «ثلاثاء/أربعاء» لا تتسع عمود ~38px عند 1× فتنكسر الكلمة على سطرين
     (mid-word) بلا قراءة سليمة. */
  var WEEKDAYS_SHORT = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];

  var SVG_NS = 'http://www.w3.org/2000/svg';

  var instances = new WeakMap();

  /* =======================================================
     أدوات عامة
     ======================================================= */

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function isoOf(y, m, d) {
    return y + '-' + pad2(m) + '-' + pad2(d);
  }

  function parseIso(s) {
    if (typeof s !== 'string' || !DATE_RE.test(s)) return null;
    var p = s.split('-');
    return { y: +p[0], m: +p[1], d: +p[2] };
  }

  /* عدد أيام الشهر — new Date(y, m, 0) محلي: فبراير 2028=29 و2027=28 */
  function daysInMonth(y, m) {
    return new Date(y, m, 0).getDate();
  }

  /* يوم الأسبوع ليوم مدني — getDay() المحلي آمن (لا يتغير بالمنطقة) */
  function weekdayOf(y, m, d) {
    return new Date(y, m - 1, d).getDay();
  }

  /* التنقل بين الشهور بحساب (y*12+m) عائم — ديسمبر→يناير وم31→فبراير
     بلا انزلاق ولا حدود أعوام */
  function shiftMonth(y, m, delta) {
    var total = y * 12 + (m - 1) + delta;
    return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 + 1 };
  }

  /* تطبيع يوم فائض/سالب عبر حدود الشهر (أسهم الشبكة ±1/±7) */
  function normalizeYmd(y, m, d) {
    while (d > daysInMonth(y, m)) {
      d -= daysInMonth(y, m);
      var nm = shiftMonth(y, m, 1);
      y = nm.y;
      m = nm.m;
    }
    while (d < 1) {
      var pm = shiftMonth(y, m, -1);
      d += daysInMonth(pm.y, pm.m);
      y = pm.y;
      m = pm.m;
    }
    return { y: y, m: m, d: d };
  }

  /* اليوم المحلي كنص YYYY-MM-DD — بلا toISOString (لا UTC) */
  function localTodayIso() {
    var t = new Date();
    return isoOf(t.getFullYear(), t.getMonth() + 1, t.getDate());
  }

  /* عبارة العدد العربية الصحيحة: 0/1/2/3–10/11–99/100+ */
  function countPhraseAr(n) {
    if (n === 0) return 'لا طلبات';
    if (n === 1) return 'طلب واحد';
    if (n === 2) return 'طلبان';
    if (n >= 3 && n <= 10) return n + ' طلبات';
    if (n >= 11 && n <= 99) return n + ' طلبًا';
    return n + ' طلب';
  }

  /* التاريخ الكامل بالعربية: «الأربعاء 7 أكتوبر 2026» */
  function fullDateAr(iso) {
    var p = parseIso(iso);
    if (!p) return '';
    return WEEKDAYS_FULL[weekdayOf(p.y, p.m, p.d)] + ' ' + p.d + ' ' + MONTHS_AR[p.m - 1] + ' ' + p.y;
  }

  /* =======================================================
     أيقونات SVG مضمّنة صغيرة (stroke مستدير) — لا معرفات
     خارجية ولا sprite للمستهلك
     ======================================================= */

  function baseSvg(size) {
    var s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', size);
    s.setAttribute('height', size);
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    return s;
  }

  function svgNode(tag, attrs) {
    var n = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* سهم: في RTL «السابق» يشير يمينًا و«التالي» يسارًا (والعكس في LTR) */
  function chevronIcon(dir) {
    var s = baseSvg(24);
    s.appendChild(svgNode('polyline', {
      points: dir === 'left' ? '15 5 8 12 15 19' : '9 5 16 12 9 19'
    }));
    return s;
  }

  function clockIcon() {
    var s = baseSvg(14);
    s.appendChild(svgNode('circle', { cx: '12', cy: '12', r: '9' }));
    s.appendChild(svgNode('polyline', { points: '12 7 12 12 15.5 13.5' }));
    return s;
  }

  function plusIcon() {
    var s = baseSvg(20);
    s.appendChild(svgNode('line', { x1: '12', y1: '5', x2: '12', y2: '19' }));
    s.appendChild(svgNode('line', { x1: '5', y1: '12', x2: '19', y2: '12' }));
    return s;
  }

  /* =======================================================
     تطبيع مدخلات المستهلك (لا HTML من البيانات — كل النص خام)
     ======================================================= */

  function normalizeOrders(raw) {
    var out = [];
    if (!raw || typeof raw !== 'object' || typeof raw.length !== 'number') return out;
    for (var i = 0; i < raw.length; i++) {
      var o = raw[i];
      if (!o || typeof o !== 'object') continue;
      out.push({
        id: (o.id == null ? '' : String(o.id)),
        title: (o.title == null ? '' : String(o.title)),
        /* تاريخ غير نصي/لا يطابق YYYY-MM-DD → غير مجدول (موثق) */
        date: (typeof o.date === 'string' && DATE_RE.test(o.date)) ? o.date : null,
        /* وقت لا يطابق HH:mm → غائب (لا يُخترع وقت أبدًا) */
        time: (typeof o.time === 'string' && TIME_RE.test(o.time)) ? o.time : null,
        statusKey: (o.statusKey == null ? '' : String(o.statusKey)),
        customer: (o.customer == null || o.customer === '') ? null : String(o.customer)
      });
    }
    return out;
  }

  /* =======================================================
     التهيئة والواجهة العامة
     ======================================================= */

  function init(root, options) {
    if (!root || root.nodeType !== 1) {
      throw new Error('MicroOrderSchedule.init يتطلب عنصر جذر صالحًا (DOM Element)');
    }
    /* تهيئة مزدوجة على نفس الجذر: نفس الحالة بلا مستمعات جديدة —
       الخيارات الأولى تُحتفظ (موثق في المواصفة) */
    var existing = instances.get(root);
    if (existing) return existing;
    var inst = createInstance(root, options);
    instances.set(root, inst);
    root.setAttribute('data-ocal-init', '1');
    return inst;
  }

  function createInstance(root, options) {
    options = options || {};

    var listeners = []; /* مراجع كل مستمع — تنزع كلها في destroy() */
    var destroyed = false;
    var state = {};

    /* ---- الخيارات (قيم غير صالحة تسقط إلى الافتراضي الموثق) ---- */
    state.orders = normalizeOrders(options.orders);
    state.statuses = (options.statuses && typeof options.statuses === 'object') ? options.statuses : {};
    state.today = (typeof options.today === 'string' && DATE_RE.test(options.today)) ? options.today : localTodayIso();
    /* weekStart: الافتراضي 6 (السبت — سياق عربي أولًا) قابل للتعديل
       لكل مثيل؛ ليس معيارًا مفروضًا عالميًا (موثق) */
    state.weekStart = (typeof options.weekStart === 'number' && options.weekStart >= 0 &&
      options.weekStart <= 6 && Math.floor(options.weekStart) === options.weekStart) ? options.weekStart : 6;
    state.selectedDate = (typeof options.selectedDate === 'string' && DATE_RE.test(options.selectedDate))
      ? options.selectedDate : state.today;
    state.view = (options.view === 'list') ? 'list' : 'calendar';
    state.calendarView = (options.calendarView === 'day') ? 'day' : 'month';
    state.loading = !!options.loading;
    state.errorRetry = (typeof options.retry === 'function') ? options.retry : null;

    var sp = parseIso(state.selectedDate) || parseIso(state.today);
    state.monthCursor = { y: sp.y, m: sp.m };
    state.focusDate = state.selectedDate;

    /* الاتجاه: RTL افتراضيًا؛ LTR يُعامل معكوسًا (منتج عربي) */
    state.rtl = true;
    try {
      var dir = window.getComputedStyle(root).direction;
      if (dir === 'ltr') state.rtl = false;
    } catch (err) { /* جذر غير ملحق بعد: RTL افتراضيًا */ }

    /* ---- مساعدات داخلية ---- */

    function on(elm, type, fn) {
      elm.addEventListener(type, fn, false);
      listeners.push({ el: elm, type: type, fn: fn });
    }

    function guard(fn) {
      return function () {
        if (destroyed) return undefined;
        return fn.apply(null, arguments);
      };
    }

    function emit(name, detail) {
      if (destroyed) return;
      root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail }));
    }

    /* الحالة من خريطة المستهلك فقط؛ المجهول/الغائب: محايد بنص
       المفتاح الخام — لا إخفاء ولا خطأ. نبرة غير مسموحة → محايد.
       'info' مرادف 'progress' (نفس زوج التوكنات). statusKey فارغ →
       بلا شريحة حالة (موثق). */
    function resolveStatus(key) {
      var entry = (state.statuses && key != null && key !== '') ? state.statuses[key] : null;
      if (entry && typeof entry === 'object') {
        var tone = (typeof entry.tone === 'string') ? entry.tone : 'neutral';
        if (tone !== 'progress' && tone !== 'info' && tone !== 'success' &&
          tone !== 'warning' && tone !== 'neutral') tone = 'neutral';
        if (tone === 'info') tone = 'progress';
        var label = (entry.label != null && String(entry.label) !== '') ? String(entry.label) : String(key);
        return { tone: tone, label: label };
      }
      return { tone: 'neutral', label: String(key == null ? '' : key) };
    }

    /* تاريخ حدث الإضافة: في التقويم = اليوم المحدد، وفي القائمة لا
       يوم مختار → null (موثق) */
    function addRequestDate() {
      return state.view === 'calendar' ? (state.selectedDate || null) : null;
    }

    /* ---- تجميع وترتيب ---- */

    function groupOrdersByDate() {
      var map = {};
      for (var i = 0; i < state.orders.length; i++) {
        var o = state.orders[i];
        if (!o.date) continue;
        if (!map[o.date]) map[o.date] = [];
        map[o.date].push(o);
      }
      return map;
    }

    /* ترتيب داخل اليوم نفسه: الوقت إن وُجد (بلا وقت بعده)، ثم
       العنوان نصيًا (ترتيب بايت حتمي — موثق) */
    function cmpSameDate(a, b) {
      if (a.time && b.time && a.time !== b.time) return a.time < b.time ? -1 : 1;
      if (a.time && !b.time) return -1;
      if (!a.time && b.time) return 1;
      if (a.title !== b.title) return a.title < b.title ? -1 : 1;
      return 0;
    }

    function sortedOrdersForDate(iso) {
      var groups = groupOrdersByDate();
      var list = groups[iso] || [];
      return list.slice().sort(cmpSameDate);
    }

    function ordersInMonth(y, m) {
      var prefix = y + '-' + pad2(m);
      var out = [];
      for (var i = 0; i < state.orders.length; i++) {
        if (state.orders[i].date && state.orders[i].date.indexOf(prefix) === 0) out.push(state.orders[i]);
      }
      return out;
    }

    /* القادمة: من today فأحدث تصاعديًا (الأقرب موعدًا أولًا)؛
       السابقة: الأحدث أولًا؛ غير المجدولة بترتيب الإدخال (موثق) */
    function listBuckets() {
      var upcoming = [], past = [], unsched = [];
      for (var i = 0; i < state.orders.length; i++) {
        var o = state.orders[i];
        if (!o.date) { unsched.push(o); continue; }
        if (o.date >= state.today) upcoming.push(o);
        else past.push(o);
      }
      upcoming.sort(function (a, b) {
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        return cmpSameDate(a, b);
      });
      past.sort(function (a, b) {
        if (a.date !== b.date) return a.date > b.date ? -1 : 1;
        return cmpSameDate(a, b);
      });
      return { upcoming: upcoming, past: past, unsched: unsched };
    }

    /* =====================================================
        التصيير (إعادة بناء كاملة — بلا مؤقتات ولا rAF)
        ===================================================== */

    function render() {
      if (destroyed) return;
      root.textContent = '';
      root.classList.add('m-ocal');
      root.setAttribute('data-ocal-root', '');
      root.setAttribute('data-ocal-view', state.view);
      root.setAttribute('data-ocal-cal-view', state.calendarView);

      /* أسبقية حالات العرض: آخر استدعاء يملك الشاشة — setError يمسح
         الانتظار وsetLoading(true) يمسح الخطأ وsetData يمسحهما معًا
         (لا نجاح كاذب ولا بيانات قديمة فوق الرد الأخير) */
      if (state.loading) {
        root.appendChild(buildLoading());
        return;
      }
      if (state.errorRetry) {
        root.appendChild(buildError());
        return;
      }
      root.appendChild(buildViewsBar());
      if (state.view === 'list') root.appendChild(buildListScreen());
      else if (state.calendarView === 'day') root.appendChild(buildDayScreen());
      else root.appendChild(buildMonthScreen());
    }

    /* ---- زرا التبديل (تقويم/قائمة وشهر/يوم): أزرار ضغط أصلية
       بسمة aria-pressed — قرار موثق: أوسع دعمًا وأرخص شكليًا من
       radiogroup يدوي، والحالة ليست باللون وحده (aria-pressed +
       وزن 600 + خلفية/حد) ---- */
    function toggleBtn(action, value, text, pressed) {
      var b = el('button', 'm-ocal__' + (action === 'view' ? 'views' : 'modes') + '-btn');
      b.type = 'button';
      b.setAttribute('data-ocal-action', action);
      b.setAttribute('data-ocal-value', value);
      b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      b.textContent = text;
      return b;
    }

    function buildViewsBar() {
      var bar = el('div', 'm-ocal__views');
      bar.setAttribute('role', 'group');
      bar.setAttribute('aria-label', 'طريقة العرض');
      bar.appendChild(toggleBtn('view', 'calendar', 'تقويم', state.view === 'calendar'));
      bar.appendChild(toggleBtn('view', 'list', 'قائمة', state.view === 'list'));
      return bar;
    }

    function buildModesBar() {
      var bar = el('div', 'm-ocal__modes');
      bar.setAttribute('role', 'group');
      bar.setAttribute('aria-label', 'نمط التقويم');
      bar.appendChild(toggleBtn('cal-mode', 'month', 'شهر', state.calendarView === 'month'));
      bar.appendChild(toggleBtn('cal-mode', 'day', 'يوم', state.calendarView === 'day'));
      return bar;
    }

    /* ---- رأس التقويم: [السابق][العنوان][التالي][اليوم] ----
       في RTL يقع السابق يمينًا بسهم لليمين، والتالي يسارًا بسهم
       لليسار (اتجاه الزمن في RTL) — معكوسان في LTR */
    function navBtn(action, ariaLabel, icon) {
      var b = el('button', 'm-ocal__navbtn');
      b.type = 'button';
      b.setAttribute('data-ocal-action', action);
      b.setAttribute('aria-label', ariaLabel);
      b.appendChild(icon);
      return b;
    }

    function prevIcon() {
      return chevronIcon(state.rtl ? 'right' : 'left');
    }

    function nextIcon() {
      return chevronIcon(state.rtl ? 'left' : 'right');
    }

    function buildCalBar(y, m) {
      var bar = el('div', 'm-ocal__cal-bar');
      bar.appendChild(navBtn('prev-month', 'الشهر السابق', prevIcon()));
      bar.appendChild(el('h3', 'm-ocal__cal-title', MONTHS_AR[m - 1] + ' ' + y));
      bar.appendChild(navBtn('next-month', 'الشهر التالي', nextIcon()));
      var today = el('button', 'm-ocal__todaybtn');
      today.type = 'button';
      today.setAttribute('data-ocal-action', 'today');
      today.textContent = 'اليوم'; /* يبقى مرئيًا دائمًا حتى في الشهر الحالي */
      bar.appendChild(today);
      return bar;
    }

    function buildWeekdays() {
      var row = el('div', 'm-ocal__weekdays');
      /* أسماء الأيام المختصرة بترتيب weekStart — مخفية من قارئ
         الشاشة: aria-label كل خلية يحمل التاريخ الكامل باليوم */
      row.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < 7; i++) {
        row.appendChild(el('div', 'm-ocal__weekday', WEEKDAYS_SHORT[(state.weekStart + i) % 7]));
      }
      return row;
    }

    /* ---- خلية يوم: رقم + عدّاد (عند وجود طلبات) + ≤3 نقاط حالات ---- */
    function buildDayCell(iso, d, groups) {
      var orders = groups[iso] || [];
      var cell = el('button', 'm-ocal__cell');
      cell.type = 'button';
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('data-ocal-action', 'day-cell');
      cell.setAttribute('data-ocal-date', iso);
      cell.tabIndex = -1;
      if (iso === state.selectedDate) {
        cell.className += ' m-ocal__cell--selected';
        cell.setAttribute('aria-selected', 'true');
      } else {
        cell.setAttribute('aria-selected', 'false');
      }
      if (iso === state.today) {
        cell.className += ' m-ocal__cell--today';
        cell.setAttribute('aria-current', 'date');
      }
      if (iso === state.focusDate) cell.tabIndex = 0; /* roving: توقف Tab واحد */

      cell.appendChild(el('span', 'm-ocal__daynum', String(d)));

      if (orders.length) {
        var badges = el('span', 'm-ocal__badges');
        badges.setAttribute('aria-hidden', 'true'); /* aria-label الخلية يحمل العدد */
        badges.appendChild(el('span', 'm-ocal__count', String(orders.length)));
        var dots = el('span', 'm-ocal__dots');
        var seen = {};
        var nDots = 0;
        for (var i = 0; i < orders.length && nDots < 3; i++) {
          var k = orders[i].statusKey;
          if (k === '' || seen[k]) continue; /* سقف 3 نقاط لأنواع الحالات */
          seen[k] = true;
          nDots++;
          dots.appendChild(el('span', 'm-ocal__dot m-ocal__dot--' + resolveStatus(k).tone));
        }
        badges.appendChild(dots);
        cell.appendChild(badges);
      }

      var label = fullDateAr(iso);
      if (iso === state.today) label += '، اليوم';
      label += '، ' + countPhraseAr(orders.length);
      cell.setAttribute('aria-label', label);
      return cell;
    }

    /* ---- شبكة الشهر: role=grid حقيقي (صفوف + gridcell + roving) ---- */
    function buildMonthGrid(groups) {
      var y = state.monthCursor.y;
      var m = state.monthCursor.m;
      var dim = daysInMonth(y, m);
      var lead = (weekdayOf(y, m, 1) - state.weekStart + 7) % 7;

      var grid = el('div', 'm-ocal__grid');
      grid.setAttribute('role', 'grid');
      grid.setAttribute('aria-label', 'طلبات ' + MONTHS_AR[m - 1] + ' ' + y);
      grid.setAttribute('data-ocal-grid', '');

      var row = el('div', 'm-ocal__gridrow');
      row.setAttribute('role', 'row');
      grid.appendChild(row);
      for (var i = 0; i < lead; i++) {
        var blank = el('div', 'm-ocal__cellblank');
        blank.setAttribute('aria-hidden', 'true');
        row.appendChild(blank);
      }
      for (var d = 1; d <= dim; d++) {
        if (row.childNodes.length === 7) {
          row = el('div', 'm-ocal__gridrow');
          row.setAttribute('role', 'row');
          grid.appendChild(row);
        }
        row.appendChild(buildDayCell(isoOf(y, m, d), d, groups));
      }
      return grid;
    }

    /* ---- مفتاح الحالات: الحالات الموجودة فعلاً في النطاق المعروض ---- */
    function buildLegend(scopeOrders) {
      var seen = {};
      var keys = [];
      for (var i = 0; i < scopeOrders.length; i++) {
        var k = scopeOrders[i].statusKey;
        if (k === '') continue;
        if (!seen[k]) { seen[k] = true; keys.push(k); }
      }
      if (!keys.length) return null; /* لا حالات معروضة → يختفي */
      var ul = el('ul', 'm-ocal__legend');
      ul.setAttribute('data-ocal-legend', '');
      for (var j = 0; j < keys.length; j++) {
        var st = resolveStatus(keys[j]);
        var li = el('li', 'm-ocal__legend-item');
        li.appendChild(el('span', 'm-ocal__legend-dot m-ocal__legend-dot--' + st.tone));
        li.appendChild(el('span', 'm-ocal__legend-label', st.label));
        ul.appendChild(li);
      }
      return ul;
    }

    /* ---- زر الإضافة (حدث add-request بتفصيل التاريخ) ---- */
    function buildAddButton() {
      var b = el('button', 'm-ocal__add');
      b.type = 'button';
      b.setAttribute('data-ocal-action', 'add');
      b.appendChild(plusIcon());
      b.appendChild(el('span', null, 'إضافة طلب'));
      var d = addRequestDate();
      if (d) b.setAttribute('aria-label', 'إضافة طلب ليوم ' + fullDateAr(d));
      return b;
    }

    /* ---- صف طلب موحّد (اليوم/الأسفل/القائمة) ----
       showDate: شارة تاريخ قصيرة تظهر في صفوف القائمة فقط (سياق
       نطاق زمني) — موثق في المواصفة */
    function buildOrderRow(order, showDate) {
      var li = el('li', 'm-ocal__rowitem');
      var btn = el('button', 'm-ocal__row');
      btn.type = 'button';
      btn.setAttribute('data-ocal-action', 'order-row');
      btn.setAttribute('data-ocal-id', order.id);
      /* العنوان عبر textContent — أي HTML ممرر يظهر نصًا حرفيًا */
      btn.appendChild(el('span', 'm-ocal__row-title', order.title));

      var meta = el('span', 'm-ocal__row-meta');
      if (showDate && order.date) {
        meta.appendChild(el('span', 'm-ocal__row-date', shortDateAr(order.date)));
      }
      if (order.customer) {
        meta.appendChild(el('span', 'm-ocal__row-customer', order.customer));
      }
      if (order.time) {
        var chip = el('span', 'm-ocal__row-time');
        chip.appendChild(clockIcon());
        var v = el('span', 'm-ocal__row-time-value', order.time);
        v.setAttribute('dir', 'ltr');
        chip.appendChild(v);
        meta.appendChild(chip);
      }
      if (order.statusKey !== '') {
        var st = resolveStatus(order.statusKey);
        var schip = el('span', 'm-ocal__row-status m-ocal__row-status--' + st.tone);
        schip.appendChild(el('span', 'm-ocal__row-statusdot'));
        schip.appendChild(el('span', 'm-ocal__row-statuslabel', st.label));
        meta.appendChild(schip);
      }
      btn.appendChild(meta);
      li.appendChild(btn);
      return li;
    }

    function buildRows(orders, showDate) {
      var ul = el('ul', 'm-ocal__rows');
      for (var i = 0; i < orders.length; i++) {
        ul.appendChild(buildOrderRow(orders[i], !!showDate));
      }
      return ul;
    }

    /* تاريخ قصير لصف القائمة: «8 أكتوبر» + السنة إن خالفت سنة اليوم */
    function shortDateAr(iso) {
      var p = parseIso(iso);
      if (!p) return '';
      var t = parseIso(state.today);
      var s = p.d + ' ' + MONTHS_AR[p.m - 1];
      if (!t || t.y !== p.y) s += ' ' + p.y;
      return s;
    }

    /* ---- لوحة اليوم: التاريخ الكامل + العد + صفوف الطلبات
       (داخل الصفحة — لا نافذة لكل يوم). في شاشة اليوم يُحذف عنوان
       اللوحة (العنوان في شريط سابقا/تاليا) ويبقى العدد والإضافة ---- */
    function buildDayPanel(withTitle) {
      var iso = state.selectedDate;
      var orders = sortedOrdersForDate(iso);
      var panel = el('section', 'm-ocal__daypanel');
      panel.setAttribute('data-ocal-day-panel', '');
      var head = el('div', 'm-ocal__daypanel-head');
      if (withTitle) {
        head.appendChild(el('h3', 'm-ocal__daypanel-title', fullDateAr(iso)));
      }
      head.appendChild(el('p', 'm-ocal__daypanel-count', countPhraseAr(orders.length)));
      head.appendChild(buildAddButton());
      panel.appendChild(head);
      panel.appendChild(buildRows(orders, false));
      return panel;
    }

    /* ---- شاشة التقويم (شهر) ---- */
    function buildMonthScreen() {
      var screen = el('div', 'm-ocal__screen');
      screen.setAttribute('data-ocal-screen', 'calendar');
      screen.appendChild(buildCalBar(state.monthCursor.y, state.monthCursor.m));
      screen.appendChild(buildModesBar());
      screen.appendChild(buildWeekdays());
      screen.appendChild(buildMonthGrid(groupOrdersByDate()));
      var legend = buildLegend(ordersInMonth(state.monthCursor.y, state.monthCursor.m));
      if (legend) screen.appendChild(legend);
      screen.appendChild(buildDayPanel(true));
      return screen;
    }

    /* ---- شاشة التقويم (يوم): سابقا/تاليا + التاريخ الكامل + العد
       ثم الصفوف (لا سطر زمني بالساعات — الوقت داخل الصف فقط) ---- */
    function buildDayScreen() {
      var screen = el('div', 'm-ocal__screen');
      screen.setAttribute('data-ocal-screen', 'calendar');
      screen.appendChild(buildModesBar());

      var panel = buildDayPanel(false);
      var bar = el('div', 'm-ocal__cal-bar');
      bar.appendChild(navBtn('prev-day', 'اليوم السابق', prevIcon()));
      bar.appendChild(el('h3', 'm-ocal__cal-title', fullDateAr(state.selectedDate)));
      bar.appendChild(navBtn('next-day', 'اليوم التالي', nextIcon()));
      panel.insertBefore(bar, panel.firstChild);
      screen.appendChild(panel);
      return screen;
    }

    /* ---- شاشة القائمة ---- */
    function buildListScreen() {
      var screen = el('div', 'm-ocal__screen');
      screen.setAttribute('data-ocal-screen', 'list');

      /* فراغ صادق: لا طلبات في كل النطاقات + مرشد إضافة */
      if (state.orders.length === 0) {
        var empty = el('div', 'm-ocal__status m-ocal__status--empty');
        empty.setAttribute('data-ocal-status', 'empty');
        empty.setAttribute('role', 'status');
        empty.appendChild(el('p', 'm-ocal__status-text', 'لا توجد طلبات بعد.'));
        empty.appendChild(buildAddButton());
        screen.appendChild(empty);
        return screen;
      }

      var legend = buildLegend(state.orders);
      if (legend) screen.appendChild(legend);

      var top = el('div', 'm-ocal__list-top');
      top.appendChild(buildAddButton());
      screen.appendChild(top);

      var buckets = listBuckets();
      var sec;
      sec = buildListSection('الطلبات القادمة', buckets.upcoming);
      if (sec) screen.appendChild(sec);
      sec = buildListSection('الطلبات السابقة', buckets.past);
      if (sec) screen.appendChild(sec);
      sec = buildListSection('طلبات غير مجدولة', buckets.unsched);
      if (sec) screen.appendChild(sec);
      return screen;
    }

    /* قسم القائمة — القسم الفارغ لا يُبنى أصلًا (كل طلب مرة واحدة
       في نطاقه، ولا عناوين لأقسام فارغة) */
    function buildListSection(title, orders) {
      if (!orders.length) return null;
      var sec = el('section', 'm-ocal__list-section');
      var head = el('div', 'm-ocal__list-head');
      head.appendChild(el('h3', 'm-ocal__list-heading', title));
      head.appendChild(el('p', 'm-ocal__list-count', countPhraseAr(orders.length)));
      sec.appendChild(head);
      sec.appendChild(buildRows(orders, true));
      return sec;
    }

    /* ---- حالات العرض ---- */
    function buildLoading() {
      var box = el('div', 'm-ocal__status m-ocal__status--loading');
      box.setAttribute('data-ocal-status', 'loading');
      box.setAttribute('role', 'status');
      box.appendChild(el('p', 'm-ocal__status-text', 'جارٍ تحميل الطلبات…'));
      return box;
    }

    function buildError() {
      var box = el('div', 'm-ocal__status m-ocal__status--error');
      box.setAttribute('data-ocal-status', 'error');
      box.setAttribute('role', 'alert');
      box.appendChild(el('p', 'm-ocal__status-text', 'تعذر تحميل الطلبات.'));
      /* إعادة المحاولة تستدعي callback المستهلك — المكوّن لا يعيد
         التحميل بنفسه (موثق) */
      var b = el('button', 'm-ocal__retry');
      b.type = 'button';
      b.setAttribute('data-ocal-action', 'retry');
      b.textContent = 'إعادة المحاولة';
      box.appendChild(b);
      return box;
    }

    /* =====================================================
        لوحة المفاتيح: roving tabindex داخل الشبكة
        ===================================================== */

    function focusDayCell(iso, doFocus) {
      var cell = root.querySelector('[data-ocal-date="' + iso + '"]');
      if (!cell) return false;
      var cells = [].slice.call(root.querySelectorAll('.m-ocal__cell[data-ocal-date]'));
      for (var i = 0; i < cells.length; i++) cells[i].tabIndex = -1;
      cell.tabIndex = 0;
      state.focusDate = iso;
      if (doFocus) cell.focus();
      return true;
    }

    /* تحريك التركيز ±أيام من الخلية المركّزة فعليًا (المصدر: هدف
       الحدث) — عبور حدود الشهر يغيّر الشهر المعروض بلا تحديد وبلا
       حدث: التحديد بالضغط فقط (موثق) */
    function moveFocus(fromIso, step) {
      var p = parseIso(fromIso);
      if (!p) return;
      var t = normalizeYmd(p.y, p.m, p.d + step);
      var iso = isoOf(t.y, t.m, t.d);
      if (t.y !== state.monthCursor.y || t.m !== state.monthCursor.m) {
        state.monthCursor = { y: t.y, m: t.m };
        state.focusDate = iso;
        render();
      }
      focusDayCell(iso, true);
    }

    /* Home/End: أول/آخر خلية في صف الأسبوع الحالي للخلية المركّزة */
    function moveRowEdge(fromIso, home) {
      var p = parseIso(fromIso);
      if (!p) return;
      if (p.y !== state.monthCursor.y || p.m !== state.monthCursor.m) {
        p = parseIso(state.selectedDate);
        if (!p) return;
      }
      var lead = (weekdayOf(p.y, p.m, 1) - state.weekStart + 7) % 7;
      var gi = lead + p.d - 1;
      var rowStart = Math.floor(gi / 7) * 7;
      /* إصلاح R3-2b (2026-10-08): الصف الأول يسبقه خلايا فارغة بادئة، فأول
         خلية فعلية فيه هي اليوم 1 — بلا Math.max كان الحساب يعطي يومًا
         سالبًا (rowStart - lead + 1) فلا يجد focusDayCell خلية ولا يتحرك
         التركيز من مكانه */
      var firstD = Math.max(1, rowStart - lead + 1);
      var lastD = Math.min(rowStart - lead + 7, daysInMonth(p.y, p.m));
      focusDayCell(isoOf(p.y, p.m, home ? firstD : lastD), true);
    }

    function onKeydown(e) {
      if (state.view !== 'calendar' || state.calendarView !== 'month') return;
      var t = e.target;
      var cell = (t && t.closest) ? t.closest('.m-ocal__cell[data-ocal-date]') : null;
      if (!cell || !root.contains(cell)) return;
      var k = e.key;
      var fromIso = cell.getAttribute('data-ocal-date');
      /* RTL: السهم الأيسر = اليوم التالي (+1) والأيمن = السابق،
         والعكس في LTR (عكس الاتجاه المنطقي — موثق). Up/Down ±7. */
      if (k === 'ArrowLeft' || k === 'ArrowRight') {
        e.preventDefault();
        var step = (k === 'ArrowLeft') ? 1 : -1;
        if (!state.rtl) step = -step;
        moveFocus(fromIso, step);
      } else if (k === 'ArrowDown') {
        e.preventDefault();
        moveFocus(fromIso, 7);
      } else if (k === 'ArrowUp') {
        e.preventDefault();
        moveFocus(fromIso, -7);
      } else if (k === 'Home') {
        e.preventDefault();
        moveRowEdge(fromIso, true);
      } else if (k === 'End') {
        e.preventDefault();
        moveRowEdge(fromIso, false);
      }
      /* Enter/Space تفعّل الزر أصلاً (click) — لا معالج مزدوج:
         day-select/order-open مرة واحدة لكل فعلة */
    }

    /* =====================================================
        الأفعال (مفوّضة على الجذر — مستمع واحد لا يتضاعف)
        ===================================================== */

    function refocus(sel) {
      var elm = root.querySelector(sel);
      if (elm && typeof elm.focus === 'function') elm.focus();
    }

    /* اختيار يوم: تحديث + إعادة تصيير + إعلان (إن كان من المستخدم) */
    function selectDate(iso, fromUser) {
      if (!DATE_RE.test(iso)) return;
      state.selectedDate = iso;
      state.focusDate = iso;
      var p = parseIso(iso);
      state.monthCursor = { y: p.y, m: p.m };
      render();
      if (fromUser) emit('order-schedule:day-select', { date: iso });
      refocus('[data-ocal-date="' + iso + '"]');
    }

    /* قرار موثق: عند التنقل بين الشهور بأزرار السهمين يُقصّ اليوم
       المحدد إلى أقرب يوم صالح في الشهر الجديد (نفس اليوم من الشهر
       وإلا آخر يوم) ويُعلن day-select — لا يبقى محددًا خارج الشهر */
    function shiftMonthCursor(delta) {
      var nm = shiftMonth(state.monthCursor.y, state.monthCursor.m, delta);
      state.monthCursor = { y: nm.y, m: nm.m };
      var sp = parseIso(state.selectedDate) || parseIso(state.today);
      var d = Math.min(sp.d, daysInMonth(nm.y, nm.m));
      var iso = isoOf(nm.y, nm.m, d);
      state.selectedDate = iso;
      state.focusDate = iso;
      render();
      emit('order-schedule:day-select', { date: iso });
    }

    /* «اليوم»: يعيد الشهر والتحديد لليوم الحالي ويعلن الاختيار */
    function gotoToday() {
      state.selectedDate = state.today;
      state.focusDate = state.today;
      var p = parseIso(state.today);
      state.monthCursor = { y: p.y, m: p.m };
      render();
      emit('order-schedule:day-select', { date: state.today });
    }

    /* اليوم السابق/التالي في عرض اليوم — اختيار جديد معلن */
    function shiftDay(delta) {
      var p = parseIso(state.selectedDate);
      if (!p) return;
      var t = normalizeYmd(p.y, p.m, p.d + delta);
      var iso = isoOf(t.y, t.m, t.d);
      state.selectedDate = iso;
      state.focusDate = iso;
      state.monthCursor = { y: t.y, m: t.m };
      render();
      emit('order-schedule:day-select', { date: iso });
    }

    function onClick(e) {
      var t = e.target;
      var btn = (t && t.closest) ? t.closest('[data-ocal-action]') : null;
      if (!btn || !root.contains(btn)) return;
      var act = btn.getAttribute('data-ocal-action');

      if (act === 'day-cell') {
        selectDate(btn.getAttribute('data-ocal-date'), true);
      } else if (act === 'order-row') {
        /* حدث واحد لكل نقرة: معالج click واحد فقط (Enter/Space تمر
           عبر click الأصلي — لا معالج keyup مزدوج) */
        emit('order-schedule:order-open', { id: btn.getAttribute('data-ocal-id') });
      } else if (act === 'add') {
        emit('order-schedule:add-request', { date: addRequestDate() });
      } else if (act === 'retry') {
        if (typeof state.errorRetry === 'function') state.errorRetry();
      } else if (act === 'view') {
        state.view = (btn.getAttribute('data-ocal-value') === 'list') ? 'list' : 'calendar';
        render();
        refocus('[data-ocal-action="view"][aria-pressed="true"]');
      } else if (act === 'cal-mode') {
        state.calendarView = (btn.getAttribute('data-ocal-value') === 'day') ? 'day' : 'month';
        render();
        refocus('[data-ocal-action="cal-mode"][aria-pressed="true"]');
      } else if (act === 'prev-month') {
        shiftMonthCursor(-1);
        refocus('[data-ocal-action="prev-month"]');
      } else if (act === 'next-month') {
        shiftMonthCursor(1);
        refocus('[data-ocal-action="next-month"]');
      } else if (act === 'today') {
        gotoToday();
        refocus('[data-ocal-action="today"]');
      } else if (act === 'prev-day') {
        shiftDay(-1);
        refocus('[data-ocal-action="prev-day"]');
      } else if (act === 'next-day') {
        shiftDay(1);
        refocus('[data-ocal-action="next-day"]');
      }
    }

    /* تسجيل المستمعين (مرة واحدة على الجذر) */
    on(root, 'keydown', guard(onKeydown));
    on(root, 'click', guard(onClick));

    render();

    /* ---- الواجهة العمومية للمثيل ---- */
    return {
      root: root,
      /* تحديث كامل بلا إعادة تهيئة؛ يحفظ selected/view/c-calendar إن
         بقيت صالحة، ويمسح حالتي الانتظار/الخطأ (آخر كتابة تفوز) */
      setData: guard(function (orders) {
        state.orders = normalizeOrders(orders);
        state.loading = false;
        state.errorRetry = null;
        render();
      }),
      /* ضبط صامت (بلا أحداث) — الأحداث لأفعال المستخدم فقط (موثق) */
      setSelectedDate: guard(function (date) {
        if (typeof date !== 'string' || !DATE_RE.test(date)) return;
        state.selectedDate = date;
        state.focusDate = date;
        var p = parseIso(date);
        state.monthCursor = { y: p.y, m: p.m };
        render();
      }),
      setView: guard(function (v) {
        if (v === 'calendar' || v === 'list') {
          state.view = v;
          render();
        }
      }),
      setCalendarView: guard(function (v) {
        if (v === 'month' || v === 'day') {
          state.calendarView = v;
          render();
        }
      }),
      setLoading: guard(function (flag) {
        state.loading = !!flag;
        if (state.loading) state.errorRetry = null; /* آخر استدعاء يملك الشاشة */
        render();
      }),
      /* setError(cb): cb مسؤولية المستهلك — زر «إعادة المحاولة»
         يستدعيه فقط ولا يعيد المكوّن التحميل بنفسه؛ setError(null)
         يزيل حالة الخطأ (موثق). يمسح حالة الانتظار لأنه الأحدث */
      setError: guard(function (retryCallback) {
        state.errorRetry = (typeof retryCallback === 'function') ? retryCallback : null;
        if (state.errorRetry) state.loading = false; /* آخر استدعاء يملك الشاشة */
        render();
      }),
      /* ينزع كل مستمع (المصفوفة أعلاه) ويعيد الجذر لسمة غير مهيأة —
         بعده لا أحداث إطلاقًا */
      destroy: guard(function () {
        destroyed = true;
        for (var i = listeners.length - 1; i >= 0; i--) {
          var L = listeners[i];
          L.el.removeEventListener(L.type, L.fn, false);
        }
        listeners.length = 0;
        root.textContent = '';
        root.classList.remove('m-ocal');
        root.removeAttribute('data-ocal-root');
        root.removeAttribute('data-ocal-init');
        root.removeAttribute('data-ocal-view');
        root.removeAttribute('data-ocal-cal-view');
        instances.delete(root);
      })
    };
  }

  window.MicroOrderSchedule = {
    init: init,
    getInstance: function (root) {
      return (root && instances.get(root)) || null;
    }
  };
})();
