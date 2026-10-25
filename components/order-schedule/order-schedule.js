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
     setCalendarView('month'|'week'|'day')
     setLoading(true|false)
     setError(retryCallback|null)
     destroy()
   options: orders, statuses, today, weekStart, selectedDate, view,
            calendarView ('month'|'week'|'day'), orderActions{edit,delete},
            headingLevel, loading, retry
   أحداث CustomEvent على الجذر (bubbles):
     order-schedule:day-select           {date:'YYYY-MM-DD'}
     order-schedule:order-open           {id}
     order-schedule:add-request          {date:'YYYY-MM-DD'|null}
     order-schedule:order-edit-request   {id}
     order-schedule:order-delete-request {id}

   عقد 2026-10-25 (مرجع المالك calendar-reference-implementation.html):
   محدّد يوم/أسبوع/شهر حقيقي بثلاث حالات فاعلة (لا بديل «قائمة»
   فيه — القائمة سطح منفصل عبر setView('list') يستدعيه المضيف).
   الشهر: شبكة سبعة أعمدة بأيام الشهر المعروض + أيام الأشهر
   المجاورة خافتة قابلة للتحديد (العرض يتبع التحديد)، ثم منطقة
   «طلبات اليوم» أسفل الشبكة (عنوان + عبارة عدد + إضافة + بطاقات
   صفوف مدمجة). الأسبوع: صف الأسبوع الذي يحوي اليوم المحدد +
   نفس منطقة الأحداث. اليوم: شريط اليوم + صفوفه. لا عرضا
   expanded/agenda بعد الآن (عقد ملغٍ 2026-10-25 — منطقة الأحداث
   ظاهرة دائمًا أسفل الشبكة كما في المرجع).

   قواعد ثابتة:
   - عربي RTL (يُعاد تقييم الاتجاه عند كل تصيير، ومراقب dir على
     documentElement يجعل قلب الاتجاه الحي فوريًا ويُفصل في destroy؛
     LTR يعمل معكوسًا كأفضل مجهود — المنتج عربي أولًا).
   - كل نص من البيانات عبر textContent/عُقد DOM — لا HTML من
     البيانات أبدًا (حقن `<img onerror>` يظهر نصًا حرفيًا).
   - كل التواريخ نصوص 'YYYY-MM-DD': ممنوع Date.parse/UTC/
     toISOString — حساب (y,m,d) صريح؛ يوم الأسبوع عبر
     new Date(y, m-1, d).getDay() محليًا (آمن مدنيًا).
   - الحالة تأتي من خريطة المستهلك فقط: مفتاح مجهول → محايد
     بنص المفتاح الخام (لا إخفاء ولا خطأ). لا استنتاج حالة من
     التاريخ ولا أي معنى مالي.
   - عقد 2026-10-24 (مرجع المالك): اليوم داخل التقويم هو نقطة
     الدخول؛ لا زر إضافة عائم ولا Bottom Sheet في هذا المسار؛ أفعال
     تعديل/حذف كل طلب على صفّه في منطقة أحداث اليوم فقط، وحدثاهما
     مستهدفتان على صفّهما host-owned.
   - مستمعان مفوّضان على الجذر فقط (click + keydown) + focusout
     يغلق منتقي الشهر عند مغادرة التركيز الجذر + مستمع Escape مفرد
     على document أثناء فتح المنتقي فقط — تسجل مرة عند التهيئة
     وتُنتزع في destroy() — إعادة التصيير لا تضيف مستمعات،
     والتهيئة المزدوجة آمنة (data-ocal-init).
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

  /* عدد أيام الشهر محليًا، مع ضبط السنة صراحة لتجنب تحويل 0–99 إلى 1900–1999 */
  function daysInMonth(y, m) {
    var date = new Date(0);
    date.setFullYear(y, m, 0);
    return date.getDate();
  }

  /* يوم الأسبوع لتاريخ مدني — setFullYear يحافظ على السنوات 0001–0099 */
  function weekdayOf(y, m, d) {
    var date = new Date(0);
    date.setFullYear(y, m - 1, d);
    return date.getDay();
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

  /* عبارة العدد العربية الصحيحة: 0/1/2/3–10/11–99؛ ومن 100 فأعلى
     تُشتق الصيغة من آخر رقمين (قاعدة العدد المركب — 132 → «طلبًا»،
     102 → «طلبان»، 100 → «طلب») */
  function countPhraseAr(n) {
    if (n === 0) return 'لا طلبات';
    if (n === 1) return 'طلب واحد';
    if (n === 2) return 'طلبان';
    if (n >= 3 && n <= 10) return n + ' طلبات';
    if (n >= 11 && n <= 99) return n + ' طلبًا';
    var r = n % 100;
    if (r === 0) return n + ' طلب';
    if (r === 1) return n + ' طلب واحد';
    if (r === 2) return n + ' طلبان';
    if (r >= 3 && r <= 10) return n + ' طلبات';
    return n + ' طلبًا';
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
    s.setAttribute('stroke-width', '1.5');
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

  /* سهم أسفل لمنطقة الإفصاح (أجندة اليوم المحدد) — يدور عند الفتح */
  function chevronDownIcon() {
    var s = baseSvg(20);
    s.appendChild(svgNode('polyline', { points: '6 9 12 15 18 9' }));
    return s;
  }

  /* قلم التعديل — عقد السماكة 1.5 نفسه (2026-10-25) */
  function editIcon() {
    var s = baseSvg(20);
    s.appendChild(svgNode('path', { d: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' }));
    return s;
  }

  /* سلة الحذف — عقد السماكة 1.5 نفسه (2026-10-25) */
  function trashIcon() {
    var s = baseSvg(20);
    s.appendChild(svgNode('polyline', { points: '3 6 5 6 21 6' }));
    s.appendChild(svgNode('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }));
    s.appendChild(svgNode('line', { x1: '10', y1: '11', x2: '10', y2: '17' }));
    s.appendChild(svgNode('line', { x1: '14', y1: '11', x2: '14', y2: '17' }));
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
        customer: (o.customer == null || o.customer === '') ? null : String(o.customer),
        /* ملاحظة قصيرة اختيارية (بيانات وصفيّة فقط — لا معنى مالي) */
        note: (o.note == null || o.note === '') ? null : String(o.note)
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
    var resizeObserver = null;
    var resizeFrame = 0;
    var pendingResizeWidth = 0;
    var resizeFallback = null;
    var dirObserver = null;    /* R-02: مراقب dir للقلب الحي للاتجاه */
    var docEscapeRef = null;   /* R-14: مستمع Escape على document أثناء فتح المنتقي فقط */

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
    /* عقد 2026-10-25 (مرجع المالك — محدّد يوم/أسبوع/شهر): ثلاث
       حالات فاعلة لعرض التقويم؛ خيار غير صالح يسقط إلى الشهر
       (حالة المقارنة مع المرجع). القائمة سطح منفصل عبر view:'list'
       يستدعيه المضيف — ليست زرًا في المحدّد. */
    state.calendarView = (options.calendarView === 'day' || options.calendarView === 'week')
      ? options.calendarView : 'month';
    /* أفعال صفوف الطلب (تعديل/حذف) host-owned: تُرسَم فقط عند تفعيلها
       صراحة، وفقط على صفوف منطقة أحداث اليوم المحدد (سطح فعل
       اليوم)، ولا تُرسَم في القائمة — الإضافة تبقى فعل اليوم دائمًا. */
    state.orderActions = {
      edit: !!(options.orderActions && options.orderActions.edit),
      delete: !!(options.orderActions && options.orderActions.delete)
    };
    /* R-42: مستوى عناوين المكوّن قابل للضبط من المضيف (2–6، افتراضي 3)
       كي لا يفرض المخطط التفصيلي مخططه على صفحة المضيف */
    state.headingLevel = (typeof options.headingLevel === 'number' &&
      options.headingLevel >= 2 && options.headingLevel <= 6 &&
      Math.floor(options.headingLevel) === options.headingLevel) ? options.headingLevel : 3;
    state.loading = !!options.loading;
    state.errorRetry = (typeof options.retry === 'function') ? options.retry : null;
    state.compactMonth = false;
    state.pickerOpen = false;
    state.pickerYear = null;

    var sp = parseIso(state.selectedDate) || parseIso(state.today);
    state.monthCursor = { y: sp.y, m: sp.m };
    state.focusDate = state.selectedDate;

    /* الاتجاه: RTL افتراضيًا؛ يُعاد تقييمه عند كل تصيير، ومراقب dir
       على documentElement (يُفصل في destroy) يجعل قلب الاتجاه الحي
       فوريًا — عقد R-02 2026-10-25 */
    state.rtl = true;
    try {
      var dir = window.getComputedStyle(root).direction;
      if (dir === 'ltr') state.rtl = false;
    } catch (err) { /* جذر غير ملحق بعد: RTL افتراضيًا */ }

    function hTag() {
      return 'h' + state.headingLevel;
    }

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
      /* R-02: الاتجاه يُعاد تقييمه من الجذر عند كل تصيير — قلب dir
         داخل أي حاوية يصحح السهام/لوحة المفاتيح عند أول إعادة تصيير،
         ومراقب documentElement أدناه يجعل قلب مستوى الصفحة فوريًا */
      try {
        var dirNow = window.getComputedStyle(root).direction;
        if (dirNow === 'ltr') state.rtl = false;
        else if (dirNow === 'rtl') state.rtl = true;
      } catch (err) { /* غير ملحق: القيمة الحالية تبقى */ }
      root.textContent = '';
      root.classList.add('m-ocal');
      root.setAttribute('data-ocal-root', '');
      root.setAttribute('data-ocal-view', state.view);
      root.setAttribute('data-ocal-cal-view', state.calendarView);
      /* عقد 2026-10-24: شبكة التقويم الكاملة عرضًا واحدًا عند كل عرض جذر؛
         الضيق (<360px) حالة عرض CSS على الجذر عبر data-ocal-compact
         وليست تخطيطًا بديلًا — لا مسار تواريخ ولا أيام مفقودة.
         عقد 2026-10-25 (مرجع المالك): الشبكة تحوي أيضًا أيام الأشهر
         المجاورة (خافتة قابلة للتحديد) فتكتمل مستطيل الشبكة كما في
         المرجع — عرض الأسبوع صفّ الأسبوع نفسه. */
      var layout = state.view === 'list' ? 'list' :
        (state.calendarView === 'day' ? 'day' :
          (state.calendarView === 'week' ? 'week-grid' : 'month-grid'));
      root.setAttribute('data-ocal-layout', layout);
      root.setAttribute('data-ocal-compact', state.compactMonth ? 'true' : 'false');
      root.setAttribute('data-ocal-selected-date', state.selectedDate);

      /* أسبقية حالات العرض: آخر استدعاء يملك الشاشة — setError يمسح
         الانتظار وsetLoading(true) يمسح الخطأ وsetData يمسحهما معًا
         (لا نجاح كاذب ولا بيانات قديمة فوق الرد الأخير).
         R-13 (2026-10-25): شريط تقويم/قائمة يبقى قابلًا للاستخدام فوق
         صندوق الحالة — لا حالة بلا مخرج للتنقل. */
      if (state.loading) {
        root.appendChild(buildControlsRow());
        root.appendChild(buildLoading());
        return;
      }
      if (state.errorRetry) {
        root.appendChild(buildControlsRow());
        root.appendChild(buildError());
        return;
      }
      /* عنصر التبديل يسكن صف التحكم داخل كل شاشة — نسخة واحدة */
      if (state.view === 'list') root.appendChild(buildListScreen());
      else if (state.calendarView === 'day') root.appendChild(buildDayScreen());
      else if (state.calendarView === 'week') root.appendChild(buildWeekScreen());
      else root.appendChild(buildMonthScreen());
    }

    /* ---- عنصر التبديل الموحّد (عقد 2026-10-25 — مرجع المالك
       calendar-reference-implementation.html): عنصر واحد بثلاث حالات
       فاعلة «يوم/أسبوع/شهر» بترتيب المرجع (Day|Week|Month) — أزرار
       ضغط أصلية بسمة aria-pressed معلنة؛ الزر المضغوط بتعبئة البترولي
       ونص معكوس (لغة التحديد نفسها لخلية اليوم المحدد).
       يوم = view:calendar + cal-view:day؛ أسبوع = view:calendar +
       cal-view:week؛ شهر = view:calendar + cal-view:month.
       القائمة ليست زرًا في هذا المحدّد (قرار مرجع المالك): سطح منفصل
       يستدعيه المضيف عبر setView('list')، والمحدّد نفسه يبقى ظاهرًا
       في شاشة القائمة للعودة إلى أي عرض تقويم. */
    function viewsegBtn(value, text, pressed) {
      var b = el('button', 'm-ocal__viewseg-btn');
      b.type = 'button';
      b.setAttribute('data-ocal-action', 'view');
      b.setAttribute('data-ocal-value', value);
      b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      b.textContent = text;
      return b;
    }

    function viewPressed(value) {
      return state.view === 'calendar' && state.calendarView === value;
    }

    function buildViewSeg() {
      var bar = el('div', 'm-ocal__viewseg');
      bar.setAttribute('role', 'group');
      bar.setAttribute('aria-label', 'طريقة العرض');
      bar.appendChild(viewsegBtn('day', 'يوم', viewPressed('day')));
      bar.appendChild(viewsegBtn('week', 'أسبوع', viewPressed('week')));
      bar.appendChild(viewsegBtn('month', 'شهر', viewPressed('month')));
      return bar;
    }

    /* صف التحكم (ترتيب القراءة للمرجع): المحدّد أول عنصر في المكوّن
       ثم شريط الشهر/الأسبوع/اليوم — سطر 48px واحد يلتف عند الضيق. */
    function buildControlsRow() {
      var row = el('div', 'm-ocal__controls');
      row.appendChild(buildViewSeg());
      return row;
    }

    /* عقد 2026-10-24: الضيق (<360px) يقلب سمة العرض المدمج على الجذر
       فقط — بنية DOM واحدة (شبكة الشهر الكاملة) في كل العروض، فلا إعادة
       تصيير عند تغيّر المساحة ولا فقدان تركيز ولا انزياح حالة.
       لا نصغّر أهداف أزرار الأوامر دون 48px؛ خلايا الأيام المدمجة
       تحتفظ بأرضية ارتفاع 48px وعرض ≥ الحد الأدنى WCAG 2.5.8 (24px) —
       موثق في المواصفة وCSS. */
    function updateResponsiveView(width) {
      var compactMonth = width > 0 && width < 360;
      if (compactMonth === state.compactMonth && root.hasAttribute('data-ocal-compact')) return;
      state.compactMonth = compactMonth;
      root.setAttribute('data-ocal-compact', compactMonth ? 'true' : 'false');
    }

    function observeResponsiveWidth() {
      if (typeof window.ResizeObserver === 'function') {
        resizeObserver = new window.ResizeObserver(function (entries) {
          if (destroyed || !entries.length) return;
          pendingResizeWidth = entries[0].contentRect.width;
          if (resizeFrame) return;
          resizeFrame = window.requestAnimationFrame(function () {
            resizeFrame = 0;
            if (!destroyed && root.isConnected && pendingResizeWidth > 0) {
              updateResponsiveView(pendingResizeWidth);
            }
          });
        });
        resizeObserver.observe(root);
      } else {
        resizeFallback = function () {
          if (!destroyed) updateResponsiveView(root.getBoundingClientRect().width);
        };
        window.addEventListener('resize', resizeFallback, false);
      }
      updateResponsiveView(root.getBoundingClientRect().width);
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
      var title = el(hTag(), 'm-ocal__cal-title');
      var pickerButton = el('button', 'm-ocal__month-trigger');
      pickerButton.type = 'button';
      pickerButton.setAttribute('data-ocal-action', 'month-picker');
      pickerButton.setAttribute('aria-label', 'اختيار الشهر والسنة');
      pickerButton.setAttribute('aria-haspopup', 'dialog');
      pickerButton.setAttribute('aria-expanded', state.pickerOpen ? 'true' : 'false');
      /* 2026-10-25 (مرجع المالك): تدرّج الشهر/السنة — الشهر محوري
         (16/600) والسنة ثانوية (13/400) + شيفرون هابط يعلن المنتقي
         الحقيقي؛ التدرّج داخل زر واحد (منبثق واحد) بلا تغيير عقد.
         عقدة نص مسافة بين العنصرين: عناصر flex المجهولة البيضاء-only
         لا تُرسم (مواصفة Flexbox) فلا أثر تخطيطيًا، ويبقى textContent
         «أكتوبر 2026» بمسافة صحيحة للنسخ/المطابقة النصية. */
      pickerButton.appendChild(el('span', 'm-ocal__month-name', MONTHS_AR[m - 1]));
      pickerButton.appendChild(document.createTextNode(' '));
      pickerButton.appendChild(el('span', 'm-ocal__year', String(y)));
      pickerButton.appendChild(chevronDownIcon());
      title.appendChild(pickerButton);
      bar.appendChild(title);
      bar.appendChild(navBtn('next-month', 'الشهر التالي', nextIcon()));
      var today = el('button', 'm-ocal__todaybtn');
      today.type = 'button';
      today.setAttribute('data-ocal-action', 'today');
      today.textContent = 'اليوم'; /* يبقى مرئيًا دائمًا حتى في الشهر الحالي */
      bar.appendChild(today);
      return bar;
    }

    function buildMonthPicker() {
      var picker = el('section', 'm-ocal__picker');
      picker.setAttribute('data-ocal-picker', '');
      picker.setAttribute('data-ocal-year', String(state.pickerYear));
      picker.setAttribute('role', 'dialog');
      picker.setAttribute('aria-label', 'اختيار الشهر والسنة');
      var heading = el('div', 'm-ocal__picker-head');
      var prevYear = el('button', 'm-ocal__picker-yearbtn', 'السنة السابقة');
      prevYear.type = 'button';
      prevYear.setAttribute('data-ocal-action', 'picker-prev-year');
      prevYear.setAttribute('aria-label', 'السنة السابقة');
      prevYear.disabled = state.pickerYear <= 1;
      heading.appendChild(prevYear);
      var year = el(hTag(), 'm-ocal__picker-year', String(state.pickerYear));
      year.setAttribute('aria-live', 'polite');
      heading.appendChild(year);
      var nextYear = el('button', 'm-ocal__picker-yearbtn', 'السنة التالية');
      nextYear.type = 'button';
      nextYear.setAttribute('data-ocal-action', 'picker-next-year');
      nextYear.setAttribute('aria-label', 'السنة التالية');
      nextYear.disabled = state.pickerYear >= 9999;
      heading.appendChild(nextYear);
      var back = el('button', 'm-ocal__picker-back', 'رجوع للتقويم');
      back.type = 'button';
      back.setAttribute('data-ocal-action', 'picker-back');
      heading.appendChild(back);
      picker.appendChild(heading);

      var months = el('div', 'm-ocal__picker-months');
      months.setAttribute('role', 'group');
      months.setAttribute('aria-label', 'أشهر السنة');
      var currentMonth = state.pickerYear === state.monthCursor.y ? state.monthCursor.m : -1;
      for (var i = 0; i < MONTHS_AR.length; i++) {
        var month = el('button', 'm-ocal__picker-month', MONTHS_AR[i]);
        month.type = 'button';
        month.setAttribute('data-ocal-action', 'picker-month');
        month.setAttribute('data-ocal-value', String(i));
        month.setAttribute('aria-pressed', i + 1 === currentMonth ? 'true' : 'false');
        month.setAttribute('aria-label', MONTHS_AR[i] + ' ' + state.pickerYear);
        months.appendChild(month);
      }
      picker.appendChild(months);
      return picker;
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

    /* ---- خلية يوم (مرجع المالك 2026-10-25): رقم + ≤3 نقاط حالات
       كنظام مؤشر وحيد — النقاط تحت الرقم مباشرة (المجموعة تتوسّط
       الخلية) فتكون ملكية اليوم غير ملتبسة عبر الصفوف؛ العدّ خارج
       الخلية (aria-label الخلية + منطقة الأحداث يحملان «كم»).
       سقف 3 أنواع حالات؛ النوع الرابع+ يبقى في aria-label والمفتاح
       (فجوة معلومات مرئية موثقة).
       عقد 2026-10-25 (مرجع المالك): خلايا الأشهر المجاورة خافتة
       (رقم أهدأ + نقاط بشفافية أخف) لكنها أيام حقيقية قابلة للتحديد
       — اختيارها ينقل العرض إلى شهرها (العرض يتبع التحديد). */
    function buildDayCell(iso, d, groups, outOfMonth) {
      var orders = groups[iso] || [];
      var cell = el('button', 'm-ocal__cell');
      cell.type = 'button';
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('data-ocal-action', 'day-cell');
      cell.setAttribute('data-ocal-date', iso);
      cell.tabIndex = -1;
      if (outOfMonth) cell.className += ' m-ocal__cell--out';
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
      var focusedDate = parseIso(state.focusDate);
      var focusedInCursor = focusedDate &&
        focusedDate.y === state.monthCursor.y && focusedDate.m === state.monthCursor.m;
      var firstIso = isoOf(state.monthCursor.y, state.monthCursor.m, 1);
      if (iso === state.focusDate || (!focusedInCursor && iso === firstIso)) {
        cell.tabIndex = 0; /* roving: توقف Tab واحد */
      }

      cell.appendChild(el('span', 'm-ocal__daynum', String(d)));

      if (orders.length) {
        var dots = el('span', 'm-ocal__dots');
        dots.setAttribute('aria-hidden', 'true'); /* aria-label الخلية يحمل العدد */
        var seen = {};
        var nDots = 0;
        for (var i = 0; i < orders.length && nDots < 3; i++) {
          var k = orders[i].statusKey;
          if (k === '' || seen[k]) continue; /* سقف 3 نقاط لأنواع الحالات */
          seen[k] = true;
          nDots++;
          dots.appendChild(el('span', 'm-ocal__dot m-ocal__dot--' + resolveStatus(k).tone));
        }
        if (nDots) cell.appendChild(dots);
      }

      var label = fullDateAr(iso);
      if (iso === state.today) label += '، اليوم';
      label += '، ' + countPhraseAr(orders.length);
      /* ملخص الحالات في الاسم الإتاحي للخلية (التاريخ + العدد +
         الحالات الموجود) — النقاط ليست القناة الوحيدة للمعنى */
      var stLabels = [];
      var seenK = {};
      for (var j = 0; j < orders.length; j++) {
        var k2 = orders[j].statusKey;
        if (k2 === '' || seenK[k2]) continue;
        seenK[k2] = true;
        stLabels.push(resolveStatus(k2).label);
      }
      if (stLabels.length) label += ' (' + stLabels.join('، ') + ')';
      cell.setAttribute('aria-label', label);
      return cell;
    }

    /* ---- شبكة الشهر: role=grid حقيقي (صفوف + gridcell + roving).
       عقد 2026-10-25 (مرجع المالك gridDays): مستطيل كامل من
       ceil((lead + أيام الشهر) / 7) × 7 خلية — الأيام المجاورة
       (البادئة/اللاحقة) تُحسب من 1 − lead عبر normalizeYmd وتُرسم
       خافتة قابلة للتحديد كما في المرجع (لا خلايا فارغة). */
    function buildMonthGrid(groups) {
      var y = state.monthCursor.y;
      var m = state.monthCursor.m;
      var dim = daysInMonth(y, m);
      var lead = (weekdayOf(y, m, 1) - state.weekStart + 7) % 7;
      var totalCells = Math.ceil((lead + dim) / 7) * 7;

      var grid = el('div', 'm-ocal__grid');
      grid.setAttribute('role', 'grid');
      grid.setAttribute('aria-label', 'طلبات ' + MONTHS_AR[m - 1] + ' ' + y);
      grid.setAttribute('data-ocal-grid', '');

      var row = el('div', 'm-ocal__gridrow');
      row.setAttribute('role', 'row');
      grid.appendChild(row);
      for (var i = 0; i < totalCells; i++) {
        if (row.childNodes.length === 7) {
          row = el('div', 'm-ocal__gridrow');
          row.setAttribute('role', 'row');
          grid.appendChild(row);
        }
        var t = normalizeYmd(y, m, 1 - lead + i);
        row.appendChild(buildDayCell(isoOf(t.y, t.m, t.d), t.d, groups, t.m !== m));
      }
      return grid;
    }

    /* ---- أدوات الأسبوع (عقد 2026-10-25 — محدّد يوم/أسبوع/شهر) ----
       الأسبوع المعروض مشتق من اليوم المحدد (كما في مرجع المالك):
       بدايته weekStart والذي يحوي selectedDate عبر normalizeYmd
       للإزاحة السالبة — بلا Date/UTC. */
    function weekDatesOf(iso) {
      var p = parseIso(iso);
      if (!p) return null;
      var back = (weekdayOf(p.y, p.m, p.d) - state.weekStart + 7) % 7;
      var s = normalizeYmd(p.y, p.m, p.d - back);
      var out = [];
      for (var i = 0; i < 7; i++) {
        out.push(normalizeYmd(s.y, s.m, s.d + i));
      }
      return out;
    }

    /* عنوان نطاق الأسبوع: «24–30 أكتوبر 2026» داخل الشهر نفسه،
       و«31 أكتوبر – 6 نوفمبر 2026» عند عبور حد الشهر/السنة */
    function weekRangeTitle(dates) {
      var a = dates[0];
      var b = dates[6];
      if (a.y === b.y && a.m === b.m) {
        return a.d + '–' + b.d + ' ' + MONTHS_AR[b.m - 1] + ' ' + b.y;
      }
      var sameYear = a.y === b.y;
      var aTxt = a.d + ' ' + MONTHS_AR[a.m - 1] + (sameYear ? '' : ' ' + a.y);
      var bTxt = b.d + ' ' + MONTHS_AR[b.m - 1] + ' ' + b.y;
      return aTxt + ' – ' + bTxt;
    }

    /* شريط الأسبوع: [الأسبوع السابق][نطاق الأسبوع][الأسبوع التالي][اليوم]
       — سهم ±7 أيام يحدّث التحديد ويطلق day-select (مثل سهمي اليوم)،
       ولا منتقي شهر هنا: الأسبوع مشتق من التحديد فقفزة الشهر ستغير
       التحديد بصمت أو تفصل منطقة الأحداث عن الأسبوع المعروض (انحراف
       موثق عن شريط الشهر). */
    function buildWeekBar(dates) {
      var bar = el('div', 'm-ocal__cal-bar');
      bar.appendChild(navBtn('prev-week', 'الأسبوع السابق', prevIcon()));
      var title = el(hTag(), 'm-ocal__cal-title');
      title.appendChild(el('span', 'm-ocal__week-range', weekRangeTitle(dates)));
      bar.appendChild(title);
      bar.appendChild(navBtn('next-week', 'الأسبوع التالي', nextIcon()));
      var today = el('button', 'm-ocal__todaybtn');
      today.type = 'button';
      today.setAttribute('data-ocal-action', 'today');
      today.textContent = 'اليوم';
      bar.appendChild(today);
      return bar;
    }

    /* صف الأسبوع: نفس تشريح خلية الشهر (رقم + نقاط + تحديد + اليوم
       الحالي) على سبعة أيام حقيقية — أيام الشهر المجاور تُوسم خافتة
       لأنها خارج الشهر الذي يحمل العنوان التالي في التدرّج. */
    function buildWeekGrid(dates, groups) {
      /* ضمان التوقف الواحد: التركيز يتبع التحديد في عرض الأسبوع —
         تحوّل من تصفّح الشهر بتركيز خارج الأسبوع يعيده ليوم التحديد */
      var isos = dates.map(function (t) { return isoOf(t.y, t.m, t.d); });
      if (isos.indexOf(state.focusDate) === -1) {
        state.focusDate = state.selectedDate;
      }
      var monthOfTitle = parseIso(state.selectedDate);
      var grid = el('div', 'm-ocal__grid');
      grid.setAttribute('role', 'grid');
      grid.setAttribute('aria-label', 'طلبات الأسبوع ' + weekRangeTitle(dates));
      grid.setAttribute('data-ocal-grid', '');
      var row = el('div', 'm-ocal__gridrow');
      row.setAttribute('role', 'row');
      grid.appendChild(row);
      for (var i = 0; i < dates.length; i++) {
        var t = dates[i];
        var outOfMonth = !monthOfTitle || t.m !== monthOfTitle.m || t.y !== monthOfTitle.y;
        row.appendChild(buildDayCell(isos[i], t.d, groups, outOfMonth));
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

    /* ---- زر الإضافة (حدث add-request بتفصيل التاريخ) ----
      dateIso صريح أو الافتراضي (يوم التقويم المحدد، null في القائمة).
      التاريخ يُحمل على الزر نفسه (data-ocal-add-date) — فارغ = بلا يوم
      (قائمة/شهر تصفّح بلا تحديد) فيُطلق الحدث بـ date:null بصدق. */
    function buildAddButton(dateIso) {
      var b = el('button', 'm-ocal__add');
      b.type = 'button';
      b.setAttribute('data-ocal-action', 'add');
      b.appendChild(plusIcon());
      b.appendChild(el('span', null, 'إضافة طلب'));
      var d = (dateIso === undefined) ? addRequestDate() : dateIso;
      b.setAttribute('data-ocal-add-date', d || '');
      if (d) b.setAttribute('aria-label', 'إضافة طلب ليوم ' + fullDateAr(d));
      return b;
    }

    /* ---- صف طلب موحّد (اليوم/الأجندة/الأسفل/القائمة) ----
       showDate: شارة تاريخ قصيرة تظهر في صفوف القائمة فقط (سياق
       نطاق زمني) — موثق في المواصفة.
       withTools: أزرار تعديل/حذف على صفوف سطح فعل اليوم المحدد فقط
       (لوحة اليوم المفصوصة ومنطقة إفصاح الأجندة) عند تفعيل المضيف
       لorderActions — لا تُرسَم في القائمة (سطح تصفّح لا سطح فعل). */
    function rowToolBtn(action, verb, icon, order) {
      var b = el('button', 'm-ocal__row-tool' +
        (action === 'order-delete' ? ' m-ocal__row-tool--danger' : ''));
      b.type = 'button';
      b.setAttribute('data-ocal-action', action);
      b.setAttribute('data-ocal-id', order.id);
      b.setAttribute('aria-label', verb + ' الطلب: ' + order.title);
      b.appendChild(icon);
      return b;
    }

    function buildOrderRow(order, showDate, withTools) {
      var li = el('li', 'm-ocal__rowitem');
      var btn = el('button', 'm-ocal__row');
      btn.type = 'button';
      btn.setAttribute('data-ocal-action', 'order-row');
      btn.setAttribute('data-ocal-id', order.id);
      /* العنوان عبر textContent — أي HTML ممرر يظهر نصًا حرفيًا */
      btn.appendChild(el('span', 'm-ocal__row-title', order.title));
      /* ملاحظة قصيرة اختيارية تحت العنوان (وصفية فقط) */
      if (order.note) {
        btn.appendChild(el('span', 'm-ocal__row-note', order.note));
      }

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
        /* R-24 (2026-10-25): بلا نقطة داخل شريحة الحالة — الكلمة
           والتلوين الدلالي للشريحة يحملان الحالة (عقد anti-slop) */
        var schip = el('span', 'm-ocal__row-status m-ocal__row-status--' + st.tone,
          st.label);
        meta.appendChild(schip);
      }
      btn.appendChild(meta);
      li.appendChild(btn);
      if (withTools && (state.orderActions.edit || state.orderActions.delete)) {
        var tools = el('div', 'm-ocal__row-tools');
        tools.setAttribute('role', 'group');
        tools.setAttribute('aria-label', 'أفعال الطلب: ' + order.title);
        if (state.orderActions.edit) {
          tools.appendChild(rowToolBtn('order-edit', 'تعديل', editIcon(), order));
        }
        if (state.orderActions.delete) {
          tools.appendChild(rowToolBtn('order-delete', 'حذف', trashIcon(), order));
        }
        li.appendChild(tools);
      }
      return li;
    }

    function buildRows(orders, showDate, withTools) {
      var ul = el('ul', 'm-ocal__rows');
      for (var i = 0; i < orders.length; i++) {
        ul.appendChild(buildOrderRow(orders[i], !!showDate, !!withTools));
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

    /* هل يُصفّح شهر بلا يوم محدد فيه؟ (الشهر المعروض ≠ شهر التحديد) */
    function browsingMonthWithoutSelection() {
      var s = parseIso(state.selectedDate);
      return !s || s.y !== state.monthCursor.y || s.m !== state.monthCursor.m;
    }

    /* ---- منطقة أحداث اليوم المحدد (عقد 2026-10-25 — مرجع المالك
       «Events today»): تحت الشبكة دائمًا في عرضَي الشهر والأسبوع —
       عنوان موجز («طلبات اليوم» أو «طلبات الأربعاء 22 أكتوبر») +
       عبارة العدد + زر الإضافة داخل الصفحة + بطاقات الصفوف المدمجة
       بأدوات الفعل. لا نافذة لكل يوم. في شاشة اليوم يُحذف عنوان
       المنطقة (العنوان في شريط سابقا/تاليا) ويبقى العدد والإضافة.

       إصلاح تعارض 2026-10-24 (مُبقى): أثناء تصفّح شهر (عرض الشهر
       فقط) لا يحوي التاريخ المحدد تُعرض حالة تصفّح صادقة
       (data-ocal-day-browsing) باسم الشهر المعروض وعدد طلباته، بدل
       منطقة يوم من شهر آخر توحي بتحديد متناقض. «إضافة طلب» هناك
       بلا يوم (date:null) — لا اختيار مُختلق. عرضا الأسبوع واليوم
       مشتقان من التحديد فلا حالة تصفّح فيهما. */
    function eventsTitleAr(iso) {
      if (iso === state.today) return 'طلبات اليوم';
      var p = parseIso(iso);
      if (!p) return 'طلبات';
      var s = 'طلبات ' + WEEKDAYS_FULL[weekdayOf(p.y, p.m, p.d)] + ' ' +
        p.d + ' ' + MONTHS_AR[p.m - 1];
      var t = parseIso(state.today);
      if (!t || t.y !== p.y) s += ' ' + p.y;
      return s;
    }

    function buildDayPanel(withTitle) {
      var panel = el('section', 'm-ocal__daypanel');
      panel.setAttribute('data-ocal-day-panel', '');
      var head = el('div', 'm-ocal__daypanel-head');
      if (withTitle && state.calendarView === 'month' && browsingMonthWithoutSelection()) {
        var y = state.monthCursor.y;
        var m = state.monthCursor.m;
        panel.setAttribute('data-ocal-day-browsing', 'true');
        head.appendChild(el(hTag(), 'm-ocal__daypanel-title',
          'لا يوم محدد في ' + MONTHS_AR[m - 1] + ' ' + y));
        head.appendChild(el('p', 'm-ocal__daypanel-count',
          countPhraseAr(ordersInMonth(y, m).length) + ' في هذا الشهر'));
        head.appendChild(buildAddButton(null));
        panel.appendChild(head);
        return panel;
      }
      var iso = state.selectedDate;
      var orders = sortedOrdersForDate(iso);
      if (withTitle) {
        head.appendChild(el(hTag(), 'm-ocal__daypanel-title', eventsTitleAr(iso)));
      }
      head.appendChild(el('p', 'm-ocal__daypanel-count', countPhraseAr(orders.length)));
      head.appendChild(buildAddButton());
      panel.appendChild(head);
      if (orders.length) {
        panel.appendChild(buildRows(orders, false, true));
      } else {
        /* فراغ صادق لليوم المحدد — مع مرشد الإضافة داخل المنطقة */
        var empty = el('div', 'm-ocal__status m-ocal__status--empty m-ocal__daypanel-empty');
        empty.setAttribute('data-ocal-status', 'empty');
        empty.setAttribute('role', 'status');
        empty.appendChild(el('p', 'm-ocal__status-text', 'لا طلبات في هذا اليوم.'));
        panel.appendChild(empty);
      }
      return panel;
    }

    /* ---- شاشة التقويم (شهر) — عقد 2026-10-25 (ترتيب القراءة للمرجع):
       [محدّد يوم/أسبوع/شهر][شريط الشهر مع المنتقي][رؤوس الأيام]
       [شبكة الشهر الكاملة بأيامها المجاورة][مفتاح الحالات]
       [منطقة أحداث اليوم المحدد] — منطقة الأحداث ظاهرة دائمًا أسفل
       الشبكة كما في مرجع المالك (لا عرضا expanded/agenda). */
    function buildMonthScreen() {
      var screen = el('div', 'm-ocal__screen');
      screen.setAttribute('data-ocal-screen', 'calendar');
      screen.appendChild(buildControlsRow());
      screen.appendChild(buildCalBar(state.monthCursor.y, state.monthCursor.m));
      if (state.pickerOpen) screen.appendChild(buildMonthPicker());
      screen.appendChild(buildWeekdays());
      screen.appendChild(buildMonthGrid(groupOrdersByDate()));
      var legend = buildLegend(ordersInMonth(state.monthCursor.y, state.monthCursor.m));
      if (legend) screen.appendChild(legend);
      screen.appendChild(buildDayPanel(true));
      return screen;
    }

    /* ---- شاشة التقويم (أسبوع) — عقد 2026-10-25 (مرجع المالك):
       [المحدّد][شريط الأسبوع ±7 أيام + اليوم][رؤوس الأيام]
       [صف الأسبوع السبعة بأيام حقيقية][مفتاح حالات الأسبوع]
       [منطقة أحداث اليوم المحدد] — الأسبوع مشتق من التحديد. */
    function buildWeekScreen() {
      var screen = el('div', 'm-ocal__screen');
      screen.setAttribute('data-ocal-screen', 'calendar');
      screen.appendChild(buildControlsRow());
      var dates = weekDatesOf(state.selectedDate) || weekDatesOf(state.today);
      screen.appendChild(buildWeekBar(dates));
      screen.appendChild(buildWeekdays());
      var groups = groupOrdersByDate();
      screen.appendChild(buildWeekGrid(dates, groups));
      var scope = [];
      for (var i = 0; i < dates.length; i++) {
        var iso = isoOf(dates[i].y, dates[i].m, dates[i].d);
        scope = scope.concat(groups[iso] || []);
      }
      var legend = buildLegend(scope);
      if (legend) screen.appendChild(legend);
      screen.appendChild(buildDayPanel(true));
      return screen;
    }

    /* ---- شاشة التقويم (يوم): [المحدّد][سابقا/تاليا + التاريخ الكامل
       + اليوم] ثم منطقة أحداثه (العدد + الإضافة + الصفوف) — لا سطر
       زمني بالساعات (الوقت داخل الصف فقط)، كما يخفي مرجع المالك
       بطاقة التقويم في وضع Day ويبقي سطح أحداث اليوم. ---- */
    function buildDayScreen() {
      var screen = el('div', 'm-ocal__screen');
      screen.setAttribute('data-ocal-screen', 'calendar');
      screen.appendChild(buildControlsRow());
      screen.appendChild(buildDayBar());
      screen.appendChild(buildDayPanel(false));
      return screen;
    }

    function buildDayBar() {
      var bar = el('div', 'm-ocal__cal-bar');
      bar.appendChild(navBtn('prev-day', 'اليوم السابق', prevIcon()));
      bar.appendChild(el(hTag(), 'm-ocal__cal-title', fullDateAr(state.selectedDate)));
      bar.appendChild(navBtn('next-day', 'اليوم التالي', nextIcon()));
      var today = el('button', 'm-ocal__todaybtn');
      today.type = 'button';
      today.setAttribute('data-ocal-action', 'today');
      today.textContent = 'اليوم';
      bar.appendChild(today);
      return bar;
    }

    /* ---- شاشة القائمة (سطح منفصل يستدعيه المضيف عبر setView('list') —
       ليس زرًا في محدّد يوم/أسبوع/شهر) ---- */
    function buildListScreen() {
      var screen = el('div', 'm-ocal__screen');
      screen.setAttribute('data-ocal-screen', 'list');
      screen.appendChild(buildControlsRow());

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
      sec = buildListSection('الطلبات غير المجدولة', buckets.unsched);
      if (sec) screen.appendChild(sec);
      return screen;
    }

    /* قسم القائمة — القسم الفارغ لا يُبنى أصلًا (كل طلب مرة واحدة
       في نطاقه، ولا عناوين لأقسام فارغة) */
    function buildListSection(title, orders) {
      if (!orders.length) return null;
      var sec = el('section', 'm-ocal__list-section');
      var head = el('div', 'm-ocal__list-head');
      head.appendChild(el(hTag(), 'm-ocal__list-heading', title));
      head.appendChild(el('p', 'm-ocal__list-count', countPhraseAr(orders.length)));
      sec.appendChild(head);
      sec.appendChild(buildRows(orders, true, false));
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
      box.appendChild(el('p', 'm-ocal__status-text', 'تعذّر تحميل الطلبات.'));
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

    /* Home/End: أول/آخر خلية في صف الأسبوع الحالي للخلية المركّزة —
       حساب من DOM نفسه (يعمل مع أيام الأشهر المجاورة داخل الصف
       وفي صف الأسبوع الفردي؛ كان الحساب القديم بأرقام أيام الشهر
       وحده يفترض خلايا فارغة بادئة) */
    function moveRowEdge(fromIso, home) {
      var cell = root.querySelector('[data-ocal-date="' + fromIso + '"]');
      if (!cell) return;
      var row = cell.closest('[role="row"]');
      if (!row) return;
      var cells = row.querySelectorAll('.m-ocal__cell[data-ocal-date]');
      if (!cells.length) return;
      var target = home ? cells[0] : cells[cells.length - 1];
      focusDayCell(target.getAttribute('data-ocal-date'), true);
    }

    function onKeydown(e) {
      var t = e.target;
      if (state.pickerOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closePicker();
          return;
        }
        var monthOption = (t && t.closest) ? t.closest('[data-ocal-action="picker-month"]') : null;
        if (monthOption && root.contains(monthOption)) {
          var index = +monthOption.getAttribute('data-ocal-value');
          var delta = 0;
          if (e.key === 'ArrowDown') delta = 4;
          else if (e.key === 'ArrowUp') delta = -4;
          else if (e.key === 'ArrowLeft') delta = state.rtl ? 1 : -1;
          else if (e.key === 'ArrowRight') delta = state.rtl ? -1 : 1;
          else if (e.key === 'Home') index = 0;
          else if (e.key === 'End') index = 11;
          else return;
          e.preventDefault();
          index = Math.max(0, Math.min(11, index + delta));
          refocus('[data-ocal-action="picker-month"][data-ocal-value="' + index + '"]');
        }
        return;
      }
      if (state.view !== 'calendar') return;
      var cell = (t && t.closest) ? t.closest('.m-ocal__cell[data-ocal-date]') : null;
      if (!cell || !root.contains(cell)) return;
      var k = e.key;
      var fromIso = cell.getAttribute('data-ocal-date');

      /* عرض الأسبوع (عقد 2026-10-25 — الأسبوع مشتق من التحديد):
         الأسهم تمشي يومًا/أسبوعًا بالتحديد نفسه (كل فعلة تطلق
         day-select مرة واحدة مثل سهمي شريط اليوم) — التركيز يتبع
         التحديد فلا انفصال بين الصف المعروض ومنطقة الأحداث.
         RTL: السهم الأيسر = اليوم التالي (+1) والعكس في LTR. */
      if (state.calendarView === 'week') {
        var step = 0;
        if (k === 'ArrowLeft' || k === 'ArrowRight') {
          e.preventDefault();
          step = (k === 'ArrowLeft') ? 1 : -1;
          if (!state.rtl) step = -step;
        } else if (k === 'ArrowDown') {
          e.preventDefault();
          step = 7;
        } else if (k === 'ArrowUp') {
          e.preventDefault();
          step = -7;
        } else if (k === 'Home' || k === 'End') {
          e.preventDefault();
          var dates = weekDatesOf(state.selectedDate);
          if (dates) {
            var edge = (k === 'Home') ? dates[0] : dates[6];
            selectDate(isoOf(edge.y, edge.m, edge.d), true);
          }
          return;
        } else {
          return;
        }
        var p = parseIso(fromIso);
        if (!p) return;
        var tt = normalizeYmd(p.y, p.m, p.d + step);
        selectDate(isoOf(tt.y, tt.m, tt.d), true);
        return;
      }

      if (state.calendarView !== 'month') return;
      /* RTL: السهم الأيسر = اليوم التالي (+1) والأيمن = السابق،
         والعكس في LTR (عكس الاتجاه المنطقي — موثق). Up/Down ±7. */
      if (k === 'ArrowLeft' || k === 'ArrowRight') {
        e.preventDefault();
        var stepm = (k === 'ArrowLeft') ? 1 : -1;
        if (!state.rtl) stepm = -stepm;
        moveFocus(fromIso, stepm);
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

    /* اختيار يوم: تحديث + إعادة تصيير + إعلان (إن كان من المستخدم).
       عقد 2026-10-25 (مرجع المالك setSelected): اختيار يوم من شهر
       مجاور (خلايا الأشهر المجاورة الآن قابلة للتحديد) ينقل الشهر
       المعروض إلى شهره — العرض يتبع التحديد؛ سهم الشهر/المنتقي
       يبقيان تصفّحًا بلا تحديد كما هما. */
    function selectDate(iso, fromUser) {
      if (!DATE_RE.test(iso)) return;
      state.selectedDate = iso;
      var p = parseIso(iso);
      if (p.y !== state.monthCursor.y || p.m !== state.monthCursor.m) {
        state.monthCursor = { y: p.y, m: p.m };
      }
      state.focusDate = iso;
      render();
      if (fromUser) emit('order-schedule:day-select', { date: iso });
      refocus('[data-ocal-date="' + iso + '"]');
    }

    /* السابق/التالي يستكشفان الشهر المعروض فقط؛ الاختيار يظل مستقلًا
       ولا يصدر day-select أو يغيّر بيانات المضيف. */
    function shiftMonthCursor(delta) {
      var nm = shiftMonth(state.monthCursor.y, state.monthCursor.m, delta);
      state.monthCursor = { y: nm.y, m: nm.m };
      var focused = parseIso(state.focusDate);
      var day = focused ? Math.min(focused.d, daysInMonth(nm.y, nm.m)) : 1;
      state.focusDate = isoOf(nm.y, nm.m, day);
      render();
    }

    function openPicker() {
      state.pickerOpen = true;
      state.pickerYear = state.monthCursor.y;
      render();
      attachDocEscape();
      refocus('[data-ocal-action="picker-month"][data-ocal-value="' + (state.monthCursor.m - 1) + '"]');
    }

    /* R-14 (2026-10-25): إغلاق المنتقي بمسارين إضافيين فوق Escape داخل
       الجذر — (1) مستمع Escape مفرد على document أثناء فتحه فقط
       (سابقة m-layer)، و(2) focusout يغلقه بصدق مع تحديث aria-expanded
       عندما يغادر التركيز المكوّن كله (Tab بعيدًا لا يترك طبقة معلقة).
       في مسار focusout لا يُستعاد التركيز — المستخدم غادره عمدًا. */
    function attachDocEscape() {
      if (docEscapeRef) return;
      docEscapeRef = function (ev) {
        if (destroyed || !state.pickerOpen) return;
        if (ev.key === 'Escape') {
          ev.preventDefault();
          closePicker();
        }
      };
      document.addEventListener('keydown', docEscapeRef, false);
      listeners.push({ el: document, type: 'keydown', fn: docEscapeRef });
    }

    function detachDocEscape() {
      if (!docEscapeRef) return;
      document.removeEventListener('keydown', docEscapeRef, false);
      for (var i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i].fn === docEscapeRef) listeners.splice(i, 1);
      }
      docEscapeRef = null;
    }

    function onRootFocusOut(e) {
      if (!state.pickerOpen) return;
      /* R-14 — تصنيف ثلاثي لمصدر focusout:
         1) relatedTarget داخل الجذر: انتقال داخلي حتمي (زر داخل
            المنتقي أو استعادة تركيز المكوّن) — لا إغلاق ولا فحص مؤجل
            (الميكروتاسك قد يجري بين focusout وfocusin فيفسد الانتقال
            نفسه — ثبت بالقياس).
         2) relatedTarget خارج الجذر: مغادرة صريحة (Tab/نقر هدف آخر)
            — إغلاق صادق فوري مع تحديث aria-expanded بلا استعادة تركيز.
         3) relatedTarget=null: إما استبدال التصيير للعنصر المركّز
            (يُستعاد التركيز فورًا بعده) أو مغادرة إلى body — يُحسم
            في ميكروتاسك بفحص موضع التركيز الفعلي بعد الاستقرار. */
      var to = e.relatedTarget;
      if (to && root.contains(to)) return;
      if (to) { closePicker(false); return; }
      Promise.resolve().then(function () {
        if (destroyed || !state.pickerOpen) return;
        var active = document.activeElement;
        if (active && active !== root && root.contains(active)) return;
        if (active === root) return; /* الجذر نفسه داخل نطاق المكوّن */
        closePicker(false);
      });
    }

    function closePicker(restoreFocus) {
      if (!state.pickerOpen) return;
      state.pickerOpen = false;
      detachDocEscape();
      render();
      if (restoreFocus !== false) refocus('[data-ocal-action="month-picker"]');
    }

    function changePickerYear(delta) {
      state.pickerYear = Math.max(1, Math.min(9999, state.pickerYear + delta));
      render();
      refocus('[data-ocal-action="picker-' + (delta < 0 ? 'prev' : 'next') + '-year"]');
    }

    function choosePickerMonth(month) {
      var m = +month + 1;
      if (m < 1 || m > 12) return;
      state.monthCursor = { y: state.pickerYear, m: m };
      var selected = parseIso(state.selectedDate);
      if (!selected || selected.y !== state.pickerYear || selected.m !== m) {
        state.focusDate = isoOf(state.pickerYear, m, 1);
      } else {
        state.focusDate = state.selectedDate;
      }
      closePicker();
    }

    /* «اليوم» هو فعل اختيار صريح: يحدّث الشهر والتاريخ ويعلن الحدث. */
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
      } else if (act === 'order-edit') {
        /* عقد 2026-10-25: فعل تعديل مملوك للمضيف — الحدث فقط؛
           المحرر/المسار مسؤولية المضيف (لا Bottom Sheet هنا) */
        emit('order-schedule:order-edit-request', { id: btn.getAttribute('data-ocal-id') });
        refocus('[data-ocal-id="' + btn.getAttribute('data-ocal-id') + '"][data-ocal-action="order-row"]');
      } else if (act === 'order-delete') {
        /* عقد 2026-10-25: فعل حذف مملوك للمضيف — الحدث فقط */
        emit('order-schedule:order-delete-request', { id: btn.getAttribute('data-ocal-id') });
        refocus('[data-ocal-id="' + btn.getAttribute('data-ocal-id') + '"][data-ocal-action="order-row"]');
      } else if (act === 'add') {
        /* التاريخ محمول على الزر نفسه: اليوم المحدد في منطقة الأحداث،
           و"" (بلا يوم) في القائمة وفي شهر تصفّح بلا تحديد — بصدق */
        var addDate = btn.getAttribute('data-ocal-add-date');
        emit('order-schedule:add-request', { date: addDate || null });
      } else if (act === 'retry') {
        if (typeof state.errorRetry === 'function') state.errorRetry();
      } else if (act === 'view') {
        state.pickerOpen = false;
        /* 2026-10-25 (مرجع المالك): القيم الثلاث للمحدّد
           (يوم/أسبوع/شهر) تركّب view+calendarView معًا؛ القيمتان
           التاريخيتان (calendar/list) تبقيان مدعومتين (توافق
           اختبارات/مضيفين — «قائمة» هنا مسار مستدعى من خارج
           المحدّد لكن الزر التاريخي يبقى فعالًا إن وُجد) */
        var seg = btn.getAttribute('data-ocal-value');
        if (seg === 'list') {
          state.view = 'list';
        } else if (seg === 'day' || seg === 'week' || seg === 'month') {
          state.view = 'calendar';
          state.calendarView = seg;
          if (seg === 'week') state.focusDate = state.selectedDate;
        } else {
          state.view = (seg === 'list') ? 'list' : 'calendar';
        }
        render();
        updateResponsiveView(root.getBoundingClientRect().width);
        var pressedBtn = root.querySelector('[data-ocal-action="view"][aria-pressed="true"]');
        if (pressedBtn) pressedBtn.focus();
        else refocus('[data-ocal-action="view"]');
      } else if (act === 'cal-mode') {
        state.pickerOpen = false;
        var cm = btn.getAttribute('data-ocal-value');
        state.calendarView = (cm === 'day' || cm === 'week') ? cm : 'month';
        render();
        updateResponsiveView(root.getBoundingClientRect().width);
        refocus('[data-ocal-action="cal-mode"]');
      } else if (act === 'prev-month') {
        shiftMonthCursor(-1);
        refocus('[data-ocal-action="prev-month"]');
      } else if (act === 'next-month') {
        shiftMonthCursor(1);
        refocus('[data-ocal-action="next-month"]');
      } else if (act === 'prev-week') {
        /* عرض الأسبوع: السهم ±7 أيام بتحديد معلن (كما سهمي اليوم) */
        shiftDay(-7);
        refocus('[data-ocal-action="prev-week"]');
      } else if (act === 'next-week') {
        shiftDay(7);
        refocus('[data-ocal-action="next-week"]');
      } else if (act === 'today') {
        gotoToday();
        refocus('[data-ocal-action="today"]');
      } else if (act === 'month-picker') {
        if (state.pickerOpen) closePicker();
        else openPicker();
      } else if (act === 'picker-back') {
        closePicker();
      } else if (act === 'picker-prev-year') {
        changePickerYear(-1);
      } else if (act === 'picker-next-year') {
        changePickerYear(1);
      } else if (act === 'picker-month') {
        choosePickerMonth(btn.getAttribute('data-ocal-value'));
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
    on(root, 'focusout', guard(onRootFocusOut));

    /* R-02 (2026-10-25): مراقب واحد لسمة dir على documentElement — قلب
       الاتجاه الحي (State Lab) يعيد التصيير فورًا فتصح السهام ولوحة
       المفاتيح مع الشكل؛ يُفصل في destroy. قلب dir داخل حاوية أعمق
       يلتقطه إعادة تقييم الاتجاه في render() عند أول إعادة تصيير. */
    if (typeof MutationObserver === 'function') {
      dirObserver = new MutationObserver(function () {
        if (destroyed) return;
        var rtl = true;
        try {
          var d = window.getComputedStyle(root).direction;
          if (d === 'ltr') rtl = false;
        } catch (err) { /* غير ملحق: القيمة الحالية تبقى */ }
        if (rtl !== state.rtl) {
          state.rtl = rtl;
          render();
        }
      });
      dirObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    }

    render();
    observeResponsiveWidth();

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
          state.pickerOpen = false;
          state.view = v;
          render();
          updateResponsiveView(root.getBoundingClientRect().width);
        }
      }),
      setCalendarView: guard(function (v) {
        if (v === 'month' || v === 'week' || v === 'day') {
          state.pickerOpen = false;
          state.calendarView = v;
          if (v === 'week') state.focusDate = state.selectedDate;
          render();
          updateResponsiveView(root.getBoundingClientRect().width);
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
      /* ينزع كل مستمع (المصفوفة أعلاه) ويفصل مراقبي dir/العرض ويعيد
         الجذر لسمة غير مهيأة — بعده لا أحداث إطلاقًا. R-27 (2026-10-25):
         تُزال أيضًا سمات العقد المتبقية (layout/compact/selected-date)
         فلا تُقرأ بحالة ما بعد الدمار */
      destroy: guard(function () {
        destroyed = true;
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
        resizeFrame = 0;
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        if (dirObserver) {
          dirObserver.disconnect();
          dirObserver = null;
        }
        if (resizeFallback) {
          window.removeEventListener('resize', resizeFallback, false);
          resizeFallback = null;
        }
        for (var i = listeners.length - 1; i >= 0; i--) {
          var L = listeners[i];
          L.el.removeEventListener(L.type, L.fn, false);
        }
        listeners.length = 0;
        docEscapeRef = null;
        root.textContent = '';
        root.classList.remove('m-ocal');
        root.removeAttribute('data-ocal-root');
        root.removeAttribute('data-ocal-init');
        root.removeAttribute('data-ocal-view');
        root.removeAttribute('data-ocal-cal-view');
        root.removeAttribute('data-ocal-auto-view');
        root.removeAttribute('data-ocal-layout');
        root.removeAttribute('data-ocal-compact');
        root.removeAttribute('data-ocal-selected-date');
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
