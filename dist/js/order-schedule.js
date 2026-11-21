(() => {
  (function() {
    "use strict";
    var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
    var TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
    var WEEKDAYS_FULL = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    var WEEKDAYS_SHORT = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];
    var SVG_NS = "http://www.w3.org/2000/svg";
    var instances = /* @__PURE__ */ new WeakMap();
    var instanceSeq = 0;
    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    }
    function pad2(n) {
      return (n < 10 ? "0" : "") + n;
    }
    function isoOf(y, m, d) {
      return yearText(y) + "-" + pad2(m) + "-" + pad2(d);
    }
    function yearText(y) {
      return ("0000" + y).slice(-4);
    }
    function parseIso(s) {
      if (typeof s !== "string" || !DATE_RE.test(s)) return null;
      var p = s.split("-");
      var y = +p[0], m = +p[1], d = +p[2];
      if (y < 1 || y > 9999 || m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;
      return { y, m, d };
    }
    function daysInMonth(y, m) {
      var date = /* @__PURE__ */ new Date(0);
      date.setFullYear(y, m, 0);
      return date.getDate();
    }
    function weekdayOf(y, m, d) {
      var date = /* @__PURE__ */ new Date(0);
      date.setFullYear(y, m - 1, d);
      return date.getDay();
    }
    function shiftMonth(y, m, delta) {
      var total = y * 12 + (m - 1) + delta;
      return { y: Math.floor(total / 12), m: (total % 12 + 12) % 12 + 1 };
    }
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
      return { y, m, d };
    }
    function localTodayIso() {
      var t = /* @__PURE__ */ new Date();
      return isoOf(t.getFullYear(), t.getMonth() + 1, t.getDate());
    }
    function countPhraseAr(n) {
      if (n === 0) return "لا طلبات";
      if (n === 1) return "طلب واحد";
      if (n === 2) return "طلبان";
      if (n >= 3 && n <= 10) return n + " طلبات";
      if (n >= 11 && n <= 99) return n + " طلبًا";
      var r = n % 100;
      if (r === 0) return n + " طلب";
      if (r === 1) return n + " طلب واحد";
      if (r === 2) return n + " طلبان";
      if (r >= 3 && r <= 10) return n + " طلبات";
      return n + " طلبًا";
    }
    function fullDateAr(iso) {
      var p = parseIso(iso);
      if (!p) return "";
      return WEEKDAYS_FULL[weekdayOf(p.y, p.m, p.d)] + " " + dateNumeric(iso);
    }
    function dateNumeric(iso) {
      var p = parseIso(iso);
      if (!p) return "";
      return pad2(p.d) + "/" + pad2(p.m) + "/" + yearText(p.y);
    }
    function dayTitleNumeric(iso) {
      var p = parseIso(iso);
      if (!p) return "";
      return WEEKDAYS_FULL[weekdayOf(p.y, p.m, p.d)] + " " + dateNumeric(iso);
    }
    function baseSvg(size) {
      var s = document.createElementNS(SVG_NS, "svg");
      s.setAttribute("viewBox", "0 0 24 24");
      s.setAttribute("width", size);
      s.setAttribute("height", size);
      s.setAttribute("fill", "none");
      s.setAttribute("stroke", "currentColor");
      s.setAttribute("stroke-width", "1.5");
      s.setAttribute("stroke-linecap", "round");
      s.setAttribute("stroke-linejoin", "round");
      s.setAttribute("aria-hidden", "true");
      s.setAttribute("focusable", "false");
      return s;
    }
    function svgNode(tag, attrs) {
      var n = document.createElementNS(SVG_NS, tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    }
    function chevronIcon(dir, size) {
      var s = baseSvg(size || 24);
      s.appendChild(svgNode("polyline", {
        points: dir === "left" ? "15 5 8 12 15 19" : "9 5 16 12 9 19"
      }));
      return s;
    }
    function plusIcon() {
      var s = baseSvg(20);
      s.appendChild(svgNode("line", { x1: "12", y1: "5", x2: "12", y2: "19" }));
      s.appendChild(svgNode("line", { x1: "5", y1: "12", x2: "19", y2: "12" }));
      return s;
    }
    function listIcon() {
      var s = baseSvg(20);
      s.appendChild(svgNode("line", { x1: "4", y1: "6", x2: "20", y2: "6" }));
      s.appendChild(svgNode("line", { x1: "4", y1: "12", x2: "20", y2: "12" }));
      s.appendChild(svgNode("line", { x1: "4", y1: "18", x2: "20", y2: "18" }));
      return s;
    }
    function calendarIcon() {
      var s = baseSvg(20);
      s.appendChild(svgNode("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }));
      s.appendChild(svgNode("line", { x1: "8", y1: "2", x2: "8", y2: "6" }));
      s.appendChild(svgNode("line", { x1: "16", y1: "2", x2: "16", y2: "6" }));
      s.appendChild(svgNode("line", { x1: "3", y1: "10", x2: "21", y2: "10" }));
      return s;
    }
    function chevronDownIcon() {
      var s = baseSvg(20);
      s.appendChild(svgNode("polyline", { points: "6 9 12 15 18 9" }));
      return s;
    }
    function normalizeOrders(raw) {
      var out = [];
      if (!raw || typeof raw !== "object" || typeof raw.length !== "number") return out;
      for (var i = 0; i < raw.length; i++) {
        var o = raw[i];
        if (!o || typeof o !== "object") continue;
        out.push({
          id: o.id == null ? "" : String(o.id),
          title: o.title == null ? "" : String(o.title),
          /* تاريخ مدني غير صالح → غير مجدول، لا يوم مستحيل داخل التقويم. */
          date: parseIso(o.date) ? o.date : null,
          /* وقت لا يطابق HH:mm → غائب (لا يُخترع وقت أبدًا) */
          time: typeof o.time === "string" && TIME_RE.test(o.time) ? o.time : null,
          statusKey: o.statusKey == null ? "" : String(o.statusKey),
          customer: o.customer == null || o.customer === "" ? null : String(o.customer),
          /* ملاحظة قصيرة اختيارية (بيانات وصفيّة فقط — لا معنى مالي) */
          note: o.note == null || o.note === "" ? null : String(o.note)
        });
      }
      return out;
    }
    function init(root, options) {
      if (!root || root.nodeType !== 1) {
        throw new Error("MicroOrderSchedule.init يتطلب عنصر جذر صالحًا (DOM Element)");
      }
      var existing = instances.get(root);
      if (existing) return existing;
      var inst = createInstance(root, options);
      instances.set(root, inst);
      root.setAttribute("data-ocal-init", "1");
      return inst;
    }
    function createInstance(root, options) {
      options = options || {};
      var listeners = [];
      var destroyed = false;
      var state = {};
      var resizeObserver = null;
      var resizeFrame = 0;
      var pendingResizeWidth = 0;
      var resizeFallback = null;
      var dirObserver = null;
      var docEscapeRef = null;
      var uid = "m-ocal-" + ++instanceSeq;
      state.orders = normalizeOrders(options.orders);
      state.statuses = options.statuses && typeof options.statuses === "object" ? options.statuses : {};
      state.today = parseIso(options.today) ? options.today : localTodayIso();
      state.weekStart = typeof options.weekStart === "number" && options.weekStart >= 0 && options.weekStart <= 6 && Math.floor(options.weekStart) === options.weekStart ? options.weekStart : 0;
      state.selectedDate = parseIso(options.selectedDate) ? options.selectedDate : state.today;
      state.view = options.view === "list" ? "list" : "calendar";
      state.calendarView = options.calendarView === "day" || options.calendarView === "week" ? options.calendarView : "month";
      state.orderActions = {
        edit: !!(options.orderActions && options.orderActions.edit),
        delete: !!(options.orderActions && options.orderActions.delete)
      };
      state.headingLevel = typeof options.headingLevel === "number" && options.headingLevel >= 2 && options.headingLevel <= 6 && Math.floor(options.headingLevel) === options.headingLevel ? options.headingLevel : 3;
      state.loading = !!options.loading;
      state.errorRetry = typeof options.retry === "function" ? options.retry : null;
      state.compactMonth = false;
      state.pickerOpen = false;
      state.pickerYear = null;
      state.expandedId = null;
      var sp = parseIso(state.selectedDate) || parseIso(state.today);
      state.monthCursor = { y: sp.y, m: sp.m };
      state.focusDate = state.selectedDate;
      var displayed = parseIso(typeof options.displayedMonth === "string" ? options.displayedMonth + "-01" : null);
      if (displayed) state.monthCursor = { y: displayed.y, m: displayed.m };
      state.rtl = true;
      try {
        var dir = window.getComputedStyle(root).direction;
        if (dir === "ltr") state.rtl = false;
      } catch (err) {
      }
      function hTag() {
        return "h" + state.headingLevel;
      }
      function on(elm, type, fn) {
        elm.addEventListener(type, fn, false);
        listeners.push({ el: elm, type, fn });
      }
      function guard(fn) {
        return function() {
          if (destroyed) return void 0;
          return fn.apply(null, arguments);
        };
      }
      function emit(name, detail) {
        if (destroyed) return;
        root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
      }
      function getState() {
        return {
          view: state.view,
          calendarView: state.calendarView,
          selectedDate: state.selectedDate,
          displayedMonth: yearText(state.monthCursor.y) + "-" + pad2(state.monthCursor.m)
        };
      }
      var userActionDepth = 0;
      function userAction(fn) {
        return guard(function(event) {
          var outer = userActionDepth === 0;
          var before = outer ? JSON.stringify(getState()) : null;
          userActionDepth++;
          try {
            fn(event);
          } finally {
            userActionDepth--;
            if (outer && !destroyed && before !== JSON.stringify(getState())) {
              emit("order-schedule:state-change", getState());
            }
          }
        });
      }
      function resolveStatus(key) {
        var entry = state.statuses && key != null && key !== "" ? state.statuses[key] : null;
        if (entry && typeof entry === "object") {
          var tone = typeof entry.tone === "string" ? entry.tone : "neutral";
          if (tone !== "progress" && tone !== "info" && tone !== "success" && tone !== "warning" && tone !== "neutral") tone = "neutral";
          if (tone === "info") tone = "progress";
          var label = entry.label != null && String(entry.label) !== "" ? String(entry.label) : String(key);
          return { tone, label };
        }
        return { tone: "neutral", label: String(key == null ? "" : key) };
      }
      function addRequestDate() {
        return state.view === "calendar" ? state.selectedDate || null : null;
      }
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
        var prefix = y + "-" + pad2(m);
        var out = [];
        for (var i = 0; i < state.orders.length; i++) {
          if (state.orders[i].date && state.orders[i].date.indexOf(prefix) === 0) out.push(state.orders[i]);
        }
        return out;
      }
      function listBuckets() {
        var upcoming = [], past = [], unsched = [];
        for (var i = 0; i < state.orders.length; i++) {
          var o = state.orders[i];
          if (!o.date) {
            unsched.push(o);
            continue;
          }
          if (o.date >= state.today) upcoming.push(o);
          else past.push(o);
        }
        upcoming.sort(function(a, b) {
          if (a.date !== b.date) return a.date < b.date ? -1 : 1;
          return cmpSameDate(a, b);
        });
        past.sort(function(a, b) {
          if (a.date !== b.date) return a.date > b.date ? -1 : 1;
          return cmpSameDate(a, b);
        });
        return { upcoming, past, unsched };
      }
      function render() {
        if (destroyed) return;
        try {
          var dirNow = window.getComputedStyle(root).direction;
          if (dirNow === "ltr") state.rtl = false;
          else if (dirNow === "rtl") state.rtl = true;
        } catch (err) {
        }
        root.textContent = "";
        root.classList.add("m-ocal");
        root.setAttribute("data-ocal-root", "");
        root.setAttribute("data-ocal-view", state.view);
        root.setAttribute("data-ocal-cal-view", state.calendarView);
        var layout = state.view === "list" ? "list" : state.calendarView === "day" ? "day" : state.calendarView === "week" ? "week-grid" : "month-grid";
        root.setAttribute("data-ocal-layout", layout);
        root.setAttribute("data-ocal-compact", state.compactMonth ? "true" : "false");
        root.setAttribute("data-ocal-selected-date", state.selectedDate);
        if (state.monthFade) {
          root.setAttribute("data-ocal-fade", "1");
          state.monthFade = false;
        } else {
          root.removeAttribute("data-ocal-fade");
        }
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
        if (state.view === "list") root.appendChild(buildListScreen());
        else if (state.calendarView === "day") root.appendChild(buildDayScreen());
        else if (state.calendarView === "week") root.appendChild(buildWeekScreen());
        else root.appendChild(buildMonthScreen());
      }
      function viewsegBtn(value, text, selected) {
        var b = el("button", "m-ocal__viewseg-btn");
        b.type = "button";
        b.setAttribute("data-ocal-action", "view");
        b.setAttribute("data-ocal-value", value);
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", selected ? "true" : "false");
        if (!selected) b.tabIndex = -1;
        b.textContent = text;
        return b;
      }
      function viewPressed(value) {
        return state.view === "calendar" && state.calendarView === value;
      }
      function buildViewSeg() {
        var bar = el("div", "m-ocal__viewseg");
        bar.setAttribute("role", "tablist");
        bar.setAttribute("aria-label", "طريقة العرض");
        bar.appendChild(viewsegBtn("day", "يوم", viewPressed("day")));
        bar.appendChild(viewsegBtn("week", "أسبوع", viewPressed("week")));
        bar.appendChild(viewsegBtn("month", "شهر", viewPressed("month")));
        return bar;
      }
      function buildModeToggle() {
        var listActive = state.view === "list";
        var btn = el("button", "m-ocal__mode-toggle");
        btn.type = "button";
        btn.setAttribute("data-ocal-action", "mode-toggle");
        btn.setAttribute("aria-pressed", listActive ? "true" : "false");
        btn.appendChild(listActive ? calendarIcon() : listIcon());
        btn.appendChild(el(
          "span",
          "m-ocal__mode-toggle-text",
          listActive ? "عرض التقويم" : "عرض القائمة"
        ));
        return btn;
      }
      function buildControlsRow() {
        var row = el("div", "m-ocal__controls");
        if (state.view === "calendar") row.appendChild(buildViewSeg());
        row.appendChild(buildModeToggle());
        return row;
      }
      function updateResponsiveView(width) {
        var compactMonth = width > 0 && width < 360;
        if (compactMonth === state.compactMonth && root.hasAttribute("data-ocal-compact")) return;
        state.compactMonth = compactMonth;
        root.setAttribute("data-ocal-compact", compactMonth ? "true" : "false");
      }
      function observeResponsiveWidth() {
        if (typeof window.ResizeObserver === "function") {
          resizeObserver = new window.ResizeObserver(function(entries) {
            if (destroyed || !entries.length) return;
            pendingResizeWidth = entries[0].contentRect.width;
            if (resizeFrame) return;
            resizeFrame = window.requestAnimationFrame(function() {
              resizeFrame = 0;
              if (!destroyed && root.isConnected && pendingResizeWidth > 0) {
                updateResponsiveView(pendingResizeWidth);
              }
            });
          });
          resizeObserver.observe(root);
        } else {
          resizeFallback = function() {
            if (!destroyed) updateResponsiveView(root.getBoundingClientRect().width);
          };
          window.addEventListener("resize", resizeFallback, false);
        }
        updateResponsiveView(root.getBoundingClientRect().width);
      }
      function navBtn(action, ariaLabel, icon) {
        var b = el("button", "m-ocal__navbtn");
        b.type = "button";
        b.setAttribute("data-ocal-action", action);
        b.setAttribute("aria-label", ariaLabel);
        b.appendChild(icon);
        return b;
      }
      function todayNavBtn() {
        var today = el("button", "m-ocal__todaybtn");
        today.type = "button";
        today.setAttribute("data-ocal-action", "today");
        today.textContent = "اليوم";
        return today;
      }
      function todayVisible() {
        var t = parseIso(state.today);
        var s = parseIso(state.selectedDate);
        if (!t || !s) return true;
        if (s.y !== t.y || s.m !== t.m || s.d !== t.d) return true;
        if (state.view === "calendar" && state.calendarView === "month") {
          return t.y !== state.monthCursor.y || t.m !== state.monthCursor.m;
        }
        return false;
      }
      function buildNavActions(prevAction, nextAction) {
        var group = el("div", "m-ocal__cal-actions");
        if (todayVisible()) group.appendChild(todayNavBtn());
        group.appendChild(navBtn(prevAction, prevAction === "prev-month" ? "الشهر السابق" : prevAction === "prev-week" ? "الأسبوع السابق" : "اليوم السابق", prevIcon()));
        group.appendChild(navBtn(nextAction, nextAction === "next-month" ? "الشهر التالي" : nextAction === "next-week" ? "الأسبوع التالي" : "اليوم التالي", nextIcon()));
        return group;
      }
      function prevIcon() {
        return chevronIcon(state.rtl ? "right" : "left");
      }
      function nextIcon() {
        return chevronIcon(state.rtl ? "left" : "right");
      }
      function buildCalBar(y, m) {
        var bar = el("div", "m-ocal__cal-bar");
        var title = el(hTag(), "m-ocal__cal-title");
        var pickerButton = el("button", "m-ocal__month-trigger");
        pickerButton.type = "button";
        pickerButton.setAttribute("data-ocal-action", "month-picker");
        pickerButton.setAttribute("aria-label", "اختيار الشهر والسنة");
        pickerButton.setAttribute("aria-haspopup", "dialog");
        pickerButton.setAttribute("aria-expanded", state.pickerOpen ? "true" : "false");
        var range = el("span", "m-ocal__month-range");
        range.appendChild(el("span", "m-ocal__month-label", pad2(m)));
        range.appendChild(document.createTextNode(" / "));
        range.appendChild(el("span", "m-ocal__year", yearText(y)));
        pickerButton.appendChild(range);
        pickerButton.appendChild(chevronDownIcon());
        title.appendChild(pickerButton);
        bar.appendChild(title);
        bar.appendChild(buildNavActions("prev-month", "next-month"));
        return bar;
      }
      function buildMonthPicker() {
        var picker = el("section", "m-ocal__picker");
        picker.setAttribute("data-ocal-picker", "");
        picker.setAttribute("data-ocal-year", yearText(state.pickerYear));
        picker.setAttribute("role", "dialog");
        picker.setAttribute("aria-label", "اختيار الشهر والسنة");
        var heading = el("div", "m-ocal__picker-head");
        var prevYear = el("button", "m-ocal__picker-yearbtn", "السنة السابقة");
        prevYear.type = "button";
        prevYear.setAttribute("data-ocal-action", "picker-prev-year");
        prevYear.setAttribute("aria-label", "السنة السابقة");
        prevYear.disabled = state.pickerYear <= 1;
        heading.appendChild(prevYear);
        var year = el(hTag(), "m-ocal__picker-year", yearText(state.pickerYear));
        year.setAttribute("aria-live", "polite");
        heading.appendChild(year);
        var nextYear = el("button", "m-ocal__picker-yearbtn", "السنة التالية");
        nextYear.type = "button";
        nextYear.setAttribute("data-ocal-action", "picker-next-year");
        nextYear.setAttribute("aria-label", "السنة التالية");
        nextYear.disabled = state.pickerYear >= 9999;
        heading.appendChild(nextYear);
        var back = el("button", "m-ocal__picker-back", "رجوع للتقويم");
        back.type = "button";
        back.setAttribute("data-ocal-action", "picker-back");
        heading.appendChild(back);
        picker.appendChild(heading);
        var months = el("div", "m-ocal__picker-months");
        months.setAttribute("role", "group");
        months.setAttribute("aria-label", "أشهر السنة");
        var currentMonth = state.pickerYear === state.monthCursor.y ? state.monthCursor.m : -1;
        for (var i = 0; i < 12; i++) {
          var month = el("button", "m-ocal__picker-month", pad2(i + 1));
          month.type = "button";
          month.setAttribute("data-ocal-action", "picker-month");
          month.setAttribute("data-ocal-value", String(i));
          month.setAttribute("aria-pressed", i + 1 === currentMonth ? "true" : "false");
          month.setAttribute("aria-label", pad2(i + 1) + " / " + yearText(state.pickerYear));
          months.appendChild(month);
        }
        picker.appendChild(months);
        return picker;
      }
      function buildWeekdays() {
        var row = el("div", "m-ocal__weekdays");
        row.setAttribute("aria-hidden", "true");
        for (var i = 0; i < 7; i++) {
          row.appendChild(el("div", "m-ocal__weekday", WEEKDAYS_SHORT[(state.weekStart + i) % 7]));
        }
        return row;
      }
      function toneRank(tone) {
        if (tone === "progress") return 0;
        if (tone === "warning") return 1;
        if (tone === "success") return 2;
        return 3;
      }
      function distinctStatuses(orders, max) {
        var seen = {};
        var out = [];
        for (var i = 0; i < orders.length; i++) {
          var k = orders[i].statusKey;
          if (k === "" || seen[k]) continue;
          seen[k] = true;
          out.push({ key: k, tone: resolveStatus(k).tone, label: resolveStatus(k).label });
        }
        out.sort(function(a, b) {
          return toneRank(a.tone) - toneRank(b.tone);
        });
        return max ? out.slice(0, max) : out;
      }
      function buildDayCell(iso, d, groups, outOfMonth) {
        if (!parseIso(iso)) {
          var outside = el("span", "m-ocal__cell m-ocal__cell--out");
          outside.setAttribute("aria-hidden", "true");
          return outside;
        }
        var orders = groups[iso] || [];
        var cell = el("button", "m-ocal__cell");
        cell.type = "button";
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("data-ocal-action", "day-cell");
        cell.setAttribute("data-ocal-date", iso);
        cell.tabIndex = -1;
        if (outOfMonth) cell.className += " m-ocal__cell--out";
        if (iso === state.selectedDate) {
          cell.className += " m-ocal__cell--selected";
          cell.setAttribute("aria-selected", "true");
          cell.setAttribute("aria-pressed", "true");
        } else {
          cell.setAttribute("aria-selected", "false");
          cell.setAttribute("aria-pressed", "false");
        }
        if (iso === state.today) {
          cell.className += " m-ocal__cell--today";
          cell.setAttribute("aria-current", "date");
        }
        var focusedDate = parseIso(state.focusDate);
        var focusedInCursor = focusedDate && focusedDate.y === state.monthCursor.y && focusedDate.m === state.monthCursor.m;
        var firstIso = isoOf(state.monthCursor.y, state.monthCursor.m, 1);
        if (iso === state.focusDate || !focusedInCursor && iso === firstIso) {
          cell.tabIndex = 0;
        }
        cell.appendChild(el("span", "m-ocal__daynum", String(d)));
        var dots = el("span", "m-ocal__dots");
        dots.setAttribute("aria-hidden", "true");
        var visibleStatuses = distinctStatuses(orders, 3);
        for (var i = 0; i < visibleStatuses.length; i++) {
          dots.appendChild(el("span", "m-ocal__dot m-ocal__dot--" + visibleStatuses[i].tone));
        }
        cell.appendChild(dots);
        var label = dateNumeric(iso) + "، " + countPhraseAr(orders.length);
        cell.setAttribute("aria-label", label);
        return cell;
      }
      function buildMonthGrid(groups) {
        var y = state.monthCursor.y;
        var m = state.monthCursor.m;
        var dim = daysInMonth(y, m);
        var lead = (weekdayOf(y, m, 1) - state.weekStart + 7) % 7;
        var totalCells = Math.ceil((lead + dim) / 7) * 7;
        var grid = el("div", "m-ocal__grid");
        grid.setAttribute("role", "grid");
        grid.setAttribute("aria-label", "طلبات " + pad2(m) + " / " + yearText(y));
        grid.setAttribute("data-ocal-grid", "");
        var row = el("div", "m-ocal__gridrow");
        row.setAttribute("role", "row");
        grid.appendChild(row);
        for (var i = 0; i < totalCells; i++) {
          if (row.childNodes.length === 7) {
            row = el("div", "m-ocal__gridrow");
            row.setAttribute("role", "row");
            grid.appendChild(row);
          }
          var t = normalizeYmd(y, m, 1 - lead + i);
          row.appendChild(buildDayCell(isoOf(t.y, t.m, t.d), t.d, groups, t.m !== m));
        }
        return grid;
      }
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
      function weekRangeTitle(dates) {
        var a = dates[0];
        var b = dates[6];
        if (a.y === b.y && a.m === b.m) {
          return a.d + "–" + b.d + "/" + pad2(b.m) + "/" + yearText(b.y);
        }
        if (a.y === b.y) {
          return a.d + "/" + pad2(a.m) + " – " + b.d + "/" + pad2(b.m) + "/" + yearText(b.y);
        }
        return dateNumeric(isoOf(a.y, a.m, a.d)) + " – " + dateNumeric(isoOf(b.y, b.m, b.d));
      }
      function buildWeekBar(dates) {
        var bar = el("div", "m-ocal__cal-bar");
        var title = el(hTag(), "m-ocal__cal-title");
        title.appendChild(el("span", "m-ocal__week-range", weekRangeTitle(dates)));
        bar.appendChild(title);
        bar.appendChild(buildNavActions("prev-week", "next-week"));
        return bar;
      }
      function buildWeekGrid(dates, groups) {
        var isos = dates.map(function(t2) {
          return isoOf(t2.y, t2.m, t2.d);
        });
        if (isos.indexOf(state.focusDate) === -1) {
          state.focusDate = state.selectedDate;
        }
        var monthOfTitle = parseIso(state.selectedDate);
        var grid = el("div", "m-ocal__grid");
        grid.setAttribute("role", "grid");
        grid.setAttribute("aria-label", "طلبات الأسبوع " + weekRangeTitle(dates));
        grid.setAttribute("data-ocal-grid", "");
        var row = el("div", "m-ocal__gridrow");
        row.setAttribute("role", "row");
        grid.appendChild(row);
        for (var i = 0; i < dates.length; i++) {
          var t = dates[i];
          var outOfMonth = !monthOfTitle || t.m !== monthOfTitle.m || t.y !== monthOfTitle.y;
          row.appendChild(buildDayCell(isos[i], t.d, groups, outOfMonth));
        }
        return grid;
      }
      function buildLegend(scopeOrders) {
        var keys = distinctStatuses(scopeOrders, 0).map(function(s) {
          return s.key;
        });
        if (!keys.length) return null;
        var ul = el("ul", "m-ocal__legend");
        ul.setAttribute("data-ocal-legend", "");
        for (var j = 0; j < keys.length; j++) {
          var st = resolveStatus(keys[j]);
          var li = el("li", "m-ocal__legend-item");
          li.appendChild(el("span", "m-ocal__legend-dot m-ocal__legend-dot--" + st.tone));
          li.appendChild(el("span", "m-ocal__legend-label", st.label));
          ul.appendChild(li);
        }
        return ul;
      }
      function buildAddButton(dateIso) {
        var b = el("button", "m-ocal__add");
        b.type = "button";
        b.setAttribute("data-ocal-action", "add");
        b.appendChild(plusIcon());
        b.appendChild(el("span", null, "إضافة طلب"));
        var d = dateIso === void 0 ? addRequestDate() : dateIso;
        b.setAttribute("data-ocal-add-date", d || "");
        if (d) b.setAttribute("aria-label", "إضافة طلب ليوم " + fullDateAr(d));
        return b;
      }
      function safeId(s) {
        return String(s).replace(/[^a-zA-Z0-9_-]/g, "_");
      }
      function buildOrderRow(order, showDate, idx) {
        var expanded = state.expandedId === order.id;
        var domKey = uid + "-row-" + idx + "-" + safeId(order.id);
        var li = el("li", "m-ocal__rowitem");
        if (expanded) li.className += " m-ocal__rowitem--expanded";
        var btn = el("button", "m-ocal__row");
        btn.type = "button";
        btn.id = domKey + "-trigger";
        btn.setAttribute("data-ocal-action", "order-row");
        btn.setAttribute("data-ocal-id", order.id);
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.setAttribute("aria-controls", domKey + "-panel");
        var main = el("span", "m-ocal__row-main");
        var line1 = el("span", "m-ocal__row-line");
        line1.appendChild(el("span", "m-ocal__row-title", order.title));
        if (order.time) {
          var t = el("bdi", "m-ocal__row-time", order.time);
          t.setAttribute("dir", "ltr");
          line1.appendChild(t);
        }
        main.appendChild(line1);
        var line2 = el("span", "m-ocal__row-line");
        if (showDate && order.date) {
          line2.appendChild(el("span", "m-ocal__row-date", shortDateAr(order.date)));
        }
        if (order.customer) {
          line2.appendChild(el("span", "m-ocal__row-customer", order.customer));
        } else if (!showDate || !order.date) {
          line2.appendChild(el("span", "m-ocal__row-placeholder", ""));
        }
        if (order.statusKey !== "") {
          var st = resolveStatus(order.statusKey);
          var schip = el(
            "span",
            "m-ocal__row-status m-ocal__row-status--" + st.tone,
            st.label
          );
          line2.appendChild(schip);
        }
        main.appendChild(line2);
        btn.appendChild(main);
        var chev = chevronIcon(state.rtl ? "left" : "right", 20);
        chev.setAttribute("class", "m-ocal__row-chev");
        if (expanded) {
          chev.style.transform = "rotate(" + (state.rtl ? "-90" : "90") + "deg)";
        }
        btn.appendChild(chev);
        li.appendChild(btn);
        li.appendChild(buildOrderPanel(order, domKey, expanded));
        return li;
      }
      function buildOrderPanel(order, domKey, expanded) {
        var panel = el("div", "m-ocal__rowpanel");
        panel.id = domKey + "-panel";
        panel.setAttribute("data-ocal-rowpanel", "");
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-labelledby", domKey + "-trigger");
        if (!expanded) panel.hidden = true;
        panel.appendChild(el("p", "m-ocal__rowpanel-title", order.title));
        var dl = el("dl", "m-ocal__rowdetails");
        dl.appendChild(detailRow(
          "التاريخ",
          order.date ? dateNumeric(order.date) : "غير مجدول",
          true
        ));
        dl.appendChild(detailRow("الوقت", order.time || "—", true));
        dl.appendChild(detailRow("المورد", order.customer || "—", false));
        if (order.statusKey !== "") {
          var st = resolveStatus(order.statusKey);
          var chip = el(
            "span",
            "m-ocal__row-status m-ocal__row-status--" + st.tone,
            st.label
          );
          dl.appendChild(detailRow("الحالة", chip, false));
        }
        if (order.note) {
          dl.appendChild(detailRow("الملاحظة", order.note, false));
        }
        panel.appendChild(dl);
        if (state.orderActions.edit || state.orderActions.delete) {
          panel.appendChild(buildOrderTools(order));
        }
        return panel;
      }
      function detailRow(label, value, ltr) {
        var div = el("div", "m-ocal__rowdetail");
        div.appendChild(el("dt", null, label));
        var dd = el("dd", null);
        if (ltr) {
          var b = el("bdi", "m-ocal__rowdetail-num", value);
          b.setAttribute("dir", "ltr");
          dd.appendChild(b);
        } else if (typeof value === "string") {
          dd.textContent = value;
        } else {
          dd.appendChild(value);
        }
        div.appendChild(dd);
        return div;
      }
      function buildOrderTools(order) {
        var row = el("div", "m-ocal__rowtools");
        if (state.orderActions.edit) {
          var editBtn = el("button", "m-ocal__rowtool", "تعديل");
          editBtn.type = "button";
          editBtn.setAttribute("data-ocal-action", "order-edit");
          editBtn.setAttribute("data-ocal-id", order.id);
          row.appendChild(editBtn);
        }
        if (state.orderActions.delete) {
          var delBtn = el("button", "m-ocal__rowtool m-ocal__rowtool--danger", "حذف");
          delBtn.type = "button";
          delBtn.setAttribute("data-ocal-action", "order-delete");
          delBtn.setAttribute("data-ocal-id", order.id);
          row.appendChild(delBtn);
        }
        return row;
      }
      function buildRows(orders, showDate) {
        var ul = el("ul", "m-ocal__rows");
        for (var i = 0; i < orders.length; i++) {
          ul.appendChild(buildOrderRow(orders[i], !!showDate, i));
        }
        return ul;
      }
      function shortDateAr(iso) {
        return dateNumeric(iso);
      }
      function browsingMonthWithoutSelection() {
        var s = parseIso(state.selectedDate);
        return !s || s.y !== state.monthCursor.y || s.m !== state.monthCursor.m;
      }
      function eventsTitleNodes(iso) {
        var title = el(hTag(), "m-ocal__daypanel-title");
        if (iso === state.today) {
          title.textContent = "طلبات اليوم";
          return title;
        }
        title.appendChild(document.createTextNode("طلبات "));
        var bdi = el("bdi", "m-ocal__daypanel-date", dateNumeric(iso));
        title.appendChild(bdi);
        return title;
      }
      function buildDayPanel(withTitle) {
        var panel = el("section", "m-ocal__daypanel");
        panel.setAttribute("data-ocal-day-panel", "");
        var head = el("div", "m-ocal__daypanel-head");
        if (withTitle && state.calendarView === "month" && browsingMonthWithoutSelection()) {
          var y = state.monthCursor.y;
          var m = state.monthCursor.m;
          panel.setAttribute("data-ocal-day-browsing", "true");
          head.appendChild(el(
            hTag(),
            "m-ocal__daypanel-title",
            "لا يوم محدد في " + pad2(m) + " / " + yearText(y)
          ));
          head.appendChild(el(
            "p",
            "m-ocal__daypanel-count",
            countPhraseAr(ordersInMonth(y, m).length) + " في هذا الشهر"
          ));
          head.appendChild(buildAddButton(null));
          panel.appendChild(head);
          return panel;
        }
        var iso = state.selectedDate;
        var orders = sortedOrdersForDate(iso);
        if (withTitle) {
          head.appendChild(eventsTitleNodes(iso));
        }
        var count = el("p", "m-ocal__daypanel-count", String(orders.length));
        count.setAttribute("aria-label", countPhraseAr(orders.length));
        head.appendChild(count);
        head.appendChild(buildAddButton());
        panel.appendChild(head);
        if (orders.length) {
          panel.appendChild(buildRows(orders, false));
        } else {
          var empty = el("div", "m-ocal__daypanel-empty");
          empty.setAttribute("data-ocal-status", "empty");
          empty.setAttribute("role", "status");
          empty.appendChild(el("p", "m-ocal__status-text", "لا توجد طلبات"));
          panel.appendChild(empty);
        }
        return panel;
      }
      function buildCalCard(weekdays, grid, legend) {
        var card = el("div", "m-ocal__calcard");
        card.setAttribute("data-ocal-calcard", "");
        card.appendChild(weekdays);
        card.appendChild(grid);
        if (legend) card.appendChild(legend);
        return card;
      }
      function buildMonthScreen() {
        var screen = el("div", "m-ocal__screen");
        screen.setAttribute("data-ocal-screen", "calendar");
        screen.appendChild(buildControlsRow());
        screen.appendChild(buildCalBar(state.monthCursor.y, state.monthCursor.m));
        if (state.pickerOpen) screen.appendChild(buildMonthPicker());
        var legend = buildLegend(ordersInMonth(state.monthCursor.y, state.monthCursor.m));
        screen.appendChild(buildCalCard(buildWeekdays(), buildMonthGrid(groupOrdersByDate()), legend));
        screen.appendChild(buildDayPanel(true));
        return screen;
      }
      function buildWeekScreen() {
        var screen = el("div", "m-ocal__screen");
        screen.setAttribute("data-ocal-screen", "calendar");
        screen.appendChild(buildControlsRow());
        var dates = weekDatesOf(state.selectedDate) || weekDatesOf(state.today);
        screen.appendChild(buildWeekBar(dates));
        var groups = groupOrdersByDate();
        var scope = [];
        for (var i = 0; i < dates.length; i++) {
          var iso = isoOf(dates[i].y, dates[i].m, dates[i].d);
          scope = scope.concat(groups[iso] || []);
        }
        screen.appendChild(buildCalCard(buildWeekdays(), buildWeekGrid(dates, groups), buildLegend(scope)));
        screen.appendChild(buildDayPanel(true));
        return screen;
      }
      function buildDayScreen() {
        var screen = el("div", "m-ocal__screen");
        screen.setAttribute("data-ocal-screen", "calendar");
        screen.appendChild(buildControlsRow());
        screen.appendChild(buildDayBar());
        screen.appendChild(buildDayPanel(false));
        return screen;
      }
      function buildDayBar() {
        var bar = el("div", "m-ocal__cal-bar");
        bar.appendChild(el(hTag(), "m-ocal__cal-title", dayTitleNumeric(state.selectedDate)));
        bar.appendChild(buildNavActions("prev-day", "next-day"));
        return bar;
      }
      function buildListScreen() {
        var screen = el("div", "m-ocal__screen");
        screen.setAttribute("data-ocal-screen", "list");
        screen.appendChild(buildControlsRow());
        if (state.orders.length === 0) {
          var empty = el("div", "m-ocal__status m-ocal__status--empty");
          empty.setAttribute("data-ocal-status", "empty");
          empty.setAttribute("role", "status");
          empty.appendChild(el("p", "m-ocal__status-text", "لا توجد طلبات بعد."));
          empty.appendChild(buildAddButton());
          screen.appendChild(empty);
          return screen;
        }
        var legend = buildLegend(state.orders);
        if (legend) screen.appendChild(legend);
        var top = el("div", "m-ocal__list-top");
        top.appendChild(buildAddButton());
        screen.appendChild(top);
        var buckets = listBuckets();
        var sec;
        sec = buildListSection("الطلبات القادمة", buckets.upcoming);
        if (sec) screen.appendChild(sec);
        sec = buildListSection("الطلبات السابقة", buckets.past);
        if (sec) screen.appendChild(sec);
        sec = buildListSection("الطلبات غير المجدولة", buckets.unsched);
        if (sec) screen.appendChild(sec);
        return screen;
      }
      function buildListSection(title, orders) {
        if (!orders.length) return null;
        var sec = el("section", "m-ocal__list-section");
        var head = el("div", "m-ocal__list-head");
        head.appendChild(el(hTag(), "m-ocal__list-heading", title));
        head.appendChild(el("p", "m-ocal__list-count", countPhraseAr(orders.length)));
        sec.appendChild(head);
        sec.appendChild(buildRows(orders, true));
        return sec;
      }
      function buildLoading() {
        var box = el("div", "m-ocal__status m-ocal__status--loading");
        box.setAttribute("data-ocal-status", "loading");
        box.setAttribute("role", "status");
        box.appendChild(el("p", "m-ocal__status-text", "جارٍ تحميل الطلبات…"));
        return box;
      }
      function buildError() {
        var box = el("div", "m-ocal__status m-ocal__status--error");
        box.setAttribute("data-ocal-status", "error");
        box.setAttribute("role", "alert");
        box.appendChild(el("p", "m-ocal__status-text", "تعذّر تحميل الطلبات."));
        var b = el("button", "m-ocal__retry");
        b.type = "button";
        b.setAttribute("data-ocal-action", "retry");
        b.textContent = "إعادة المحاولة";
        box.appendChild(b);
        return box;
      }
      function focusDayCell(iso, doFocus) {
        var cell = root.querySelector('[data-ocal-date="' + iso + '"]');
        if (!cell) return false;
        var cells = [].slice.call(root.querySelectorAll(".m-ocal__cell[data-ocal-date]"));
        for (var i = 0; i < cells.length; i++) cells[i].tabIndex = -1;
        cell.tabIndex = 0;
        state.focusDate = iso;
        if (doFocus) cell.focus();
        return true;
      }
      function moveFocus(fromIso, step) {
        var p = parseIso(fromIso);
        if (!p) return;
        var t = normalizeYmd(p.y, p.m, p.d + step);
        var iso = isoOf(t.y, t.m, t.d);
        if (t.y < 1 || t.y > 9999) return;
        if (t.y !== state.monthCursor.y || t.m !== state.monthCursor.m) {
          state.monthCursor = { y: t.y, m: t.m };
          state.focusDate = iso;
          render();
        }
        focusDayCell(iso, true);
      }
      function moveRowEdge(fromIso, home) {
        var cell = root.querySelector('[data-ocal-date="' + fromIso + '"]');
        if (!cell) return;
        var row = cell.closest('[role="row"]');
        if (!row) return;
        var cells = row.querySelectorAll(".m-ocal__cell[data-ocal-date]");
        if (!cells.length) return;
        var target = home ? cells[0] : cells[cells.length - 1];
        focusDayCell(target.getAttribute("data-ocal-date"), true);
      }
      function onKeydown(e) {
        var t = e.target;
        if (state.pickerOpen) {
          if (e.key === "Escape") {
            e.preventDefault();
            closePicker();
            return;
          }
          var monthOption = t && t.closest ? t.closest('[data-ocal-action="picker-month"]') : null;
          if (monthOption && root.contains(monthOption)) {
            var index = +monthOption.getAttribute("data-ocal-value");
            var delta = 0;
            if (e.key === "ArrowDown") delta = 4;
            else if (e.key === "ArrowUp") delta = -4;
            else if (e.key === "ArrowLeft") delta = state.rtl ? 1 : -1;
            else if (e.key === "ArrowRight") delta = state.rtl ? -1 : 1;
            else if (e.key === "Home") index = 0;
            else if (e.key === "End") index = 11;
            else return;
            e.preventDefault();
            index = Math.max(0, Math.min(11, index + delta));
            refocus('[data-ocal-action="picker-month"][data-ocal-value="' + index + '"]');
          }
          return;
        }
        if (state.view !== "calendar") return;
        var seg = t && t.closest ? t.closest('[data-ocal-action="view"][role="tab"]') : null;
        if (seg && root.contains(seg)) {
          var segs = [].slice.call(root.querySelectorAll('.m-ocal__viewseg [data-ocal-action="view"]'));
          var at = segs.indexOf(seg);
          if (at !== -1 && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
            e.preventDefault();
            var stepSeg = e.key === "ArrowLeft" ? state.rtl ? -1 : 1 : state.rtl ? 1 : -1;
            var next = segs[Math.max(0, Math.min(segs.length - 1, at + stepSeg))];
            if (next && next !== seg) next.click();
            else seg.focus();
          }
          return;
        }
        var cell = t && t.closest ? t.closest(".m-ocal__cell[data-ocal-date]") : null;
        if (!cell || !root.contains(cell)) return;
        var k = e.key;
        var fromIso = cell.getAttribute("data-ocal-date");
        if (state.calendarView === "week") {
          var step = 0;
          if (k === "ArrowLeft" || k === "ArrowRight") {
            e.preventDefault();
            step = k === "ArrowLeft" ? 1 : -1;
            if (!state.rtl) step = -step;
          } else if (k === "ArrowDown") {
            e.preventDefault();
            step = 7;
          } else if (k === "ArrowUp") {
            e.preventDefault();
            step = -7;
          } else if (k === "Home" || k === "End") {
            e.preventDefault();
            var dates = weekDatesOf(state.selectedDate);
            if (dates) {
              var edge = k === "Home" ? dates[0] : dates[6];
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
        if (state.calendarView !== "month") return;
        if (k === "ArrowLeft" || k === "ArrowRight") {
          e.preventDefault();
          var stepm = k === "ArrowLeft" ? 1 : -1;
          if (!state.rtl) stepm = -stepm;
          moveFocus(fromIso, stepm);
        } else if (k === "ArrowDown") {
          e.preventDefault();
          moveFocus(fromIso, 7);
        } else if (k === "ArrowUp") {
          e.preventDefault();
          moveFocus(fromIso, -7);
        } else if (k === "Home") {
          e.preventDefault();
          moveRowEdge(fromIso, true);
        } else if (k === "End") {
          e.preventDefault();
          moveRowEdge(fromIso, false);
        }
      }
      function refocus(sel) {
        var elm = root.querySelector(sel);
        if (elm && typeof elm.focus === "function") elm.focus();
      }
      function refocusOrderRow(id) {
        var rows = root.querySelectorAll('[data-ocal-action="order-row"]');
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].getAttribute("data-ocal-id") === id) {
            rows[i].focus();
            return;
          }
        }
      }
      function selectDate(iso, fromUser) {
        if (!parseIso(iso)) return;
        state.selectedDate = iso;
        var p = parseIso(iso);
        if (p.y !== state.monthCursor.y || p.m !== state.monthCursor.m) {
          state.monthCursor = { y: p.y, m: p.m };
        }
        state.focusDate = iso;
        render();
        if (fromUser) emit("order-schedule:day-select", { date: iso });
        refocus('[data-ocal-date="' + iso + '"]');
      }
      function shiftMonthCursor(delta) {
        var nm = shiftMonth(state.monthCursor.y, state.monthCursor.m, delta);
        if (nm.y < 1 || nm.y > 9999) return;
        state.monthCursor = { y: nm.y, m: nm.m };
        var focused = parseIso(state.focusDate);
        var day = focused ? Math.min(focused.d, daysInMonth(nm.y, nm.m)) : 1;
        state.focusDate = isoOf(nm.y, nm.m, day);
        state.monthFade = true;
        render();
      }
      function openPicker() {
        state.pickerOpen = true;
        state.pickerYear = state.monthCursor.y;
        render();
        attachDocEscape();
        refocus('[data-ocal-action="picker-month"][data-ocal-value="' + (state.monthCursor.m - 1) + '"]');
      }
      function attachDocEscape() {
        if (docEscapeRef) return;
        docEscapeRef = function(ev) {
          if (destroyed || !state.pickerOpen) return;
          if (ev.key === "Escape") {
            ev.preventDefault();
            closePicker();
          }
        };
        document.addEventListener("keydown", docEscapeRef, false);
        listeners.push({ el: document, type: "keydown", fn: docEscapeRef });
      }
      function detachDocEscape() {
        if (!docEscapeRef) return;
        document.removeEventListener("keydown", docEscapeRef, false);
        for (var i = listeners.length - 1; i >= 0; i--) {
          if (listeners[i].fn === docEscapeRef) listeners.splice(i, 1);
        }
        docEscapeRef = null;
      }
      function onRootFocusOut(e) {
        if (!state.pickerOpen) return;
        var to = e.relatedTarget;
        if (to && root.contains(to)) return;
        if (to) {
          closePicker(false);
          return;
        }
        Promise.resolve().then(function() {
          if (destroyed || !state.pickerOpen) return;
          var active = document.activeElement;
          if (active && active !== root && root.contains(active)) return;
          if (active === root) return;
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
        refocus('[data-ocal-action="picker-' + (delta < 0 ? "prev" : "next") + '-year"]');
      }
      function choosePickerMonth(month) {
        var m = +month + 1;
        if (m < 1 || m > 12) return;
        state.monthCursor = { y: state.pickerYear, m };
        var selected = parseIso(state.selectedDate);
        if (!selected || selected.y !== state.pickerYear || selected.m !== m) {
          state.focusDate = isoOf(state.pickerYear, m, 1);
        } else {
          state.focusDate = state.selectedDate;
        }
        closePicker();
      }
      function gotoToday() {
        state.selectedDate = state.today;
        state.focusDate = state.today;
        var p = parseIso(state.today);
        state.monthCursor = { y: p.y, m: p.m };
        render();
        emit("order-schedule:day-select", { date: state.today });
      }
      function shiftDay(delta) {
        var p = parseIso(state.selectedDate);
        if (!p) return;
        var t = normalizeYmd(p.y, p.m, p.d + delta);
        var iso = isoOf(t.y, t.m, t.d);
        if (t.y < 1 || t.y > 9999) return;
        state.selectedDate = iso;
        state.focusDate = iso;
        state.monthCursor = { y: t.y, m: t.m };
        render();
        emit("order-schedule:day-select", { date: iso });
      }
      function onClick(e) {
        var t = e.target;
        var btn = t && t.closest ? t.closest("[data-ocal-action]") : null;
        if (!btn || !root.contains(btn)) return;
        var act = btn.getAttribute("data-ocal-action");
        if (act === "day-cell") {
          selectDate(btn.getAttribute("data-ocal-date"), true);
        } else if (act === "order-row") {
          var rowId = btn.getAttribute("data-ocal-id");
          if (state.expandedId === rowId) {
            state.expandedId = null;
          } else {
            state.expandedId = rowId;
            emit("order-schedule:order-open", { id: rowId });
          }
          render();
          refocusOrderRow(rowId);
        } else if (act === "mode-toggle") {
          state.pickerOpen = false;
          state.view = state.view === "list" ? "calendar" : "list";
          render();
          updateResponsiveView(root.getBoundingClientRect().width);
          refocus('[data-ocal-action="mode-toggle"]');
        } else if (act === "order-edit") {
          emit("order-schedule:order-edit-request", { id: btn.getAttribute("data-ocal-id") });
          refocusOrderRow(btn.getAttribute("data-ocal-id"));
        } else if (act === "order-delete") {
          emit("order-schedule:order-delete-request", { id: btn.getAttribute("data-ocal-id") });
          refocusOrderRow(btn.getAttribute("data-ocal-id"));
        } else if (act === "add") {
          var addDate = btn.getAttribute("data-ocal-add-date");
          emit("order-schedule:add-request", { date: addDate || null });
        } else if (act === "retry") {
          if (typeof state.errorRetry === "function") state.errorRetry();
        } else if (act === "view") {
          state.pickerOpen = false;
          var seg = btn.getAttribute("data-ocal-value");
          if (seg === "list") {
            state.view = "list";
          } else if (seg === "day" || seg === "week" || seg === "month") {
            state.view = "calendar";
            state.calendarView = seg;
            if (seg === "week") state.focusDate = state.selectedDate;
          } else {
            state.view = seg === "list" ? "list" : "calendar";
          }
          render();
          updateResponsiveView(root.getBoundingClientRect().width);
          var selectedSeg = root.querySelector('[data-ocal-action="view"][aria-selected="true"]');
          if (selectedSeg) selectedSeg.focus();
          else refocus('[data-ocal-action="view"]');
        } else if (act === "cal-mode") {
          state.pickerOpen = false;
          var cm = btn.getAttribute("data-ocal-value");
          state.calendarView = cm === "day" || cm === "week" ? cm : "month";
          render();
          updateResponsiveView(root.getBoundingClientRect().width);
          refocus('[data-ocal-action="cal-mode"]');
        } else if (act === "prev-month") {
          shiftMonthCursor(-1);
          refocus('[data-ocal-action="prev-month"]');
        } else if (act === "next-month") {
          shiftMonthCursor(1);
          refocus('[data-ocal-action="next-month"]');
        } else if (act === "prev-week") {
          shiftDay(-7);
          refocus('[data-ocal-action="prev-week"]');
        } else if (act === "next-week") {
          shiftDay(7);
          refocus('[data-ocal-action="next-week"]');
        } else if (act === "today") {
          gotoToday();
          refocus('[data-ocal-action="today"]');
        } else if (act === "month-picker") {
          if (state.pickerOpen) closePicker();
          else openPicker();
        } else if (act === "picker-back") {
          closePicker();
        } else if (act === "picker-prev-year") {
          changePickerYear(-1);
        } else if (act === "picker-next-year") {
          changePickerYear(1);
        } else if (act === "picker-month") {
          choosePickerMonth(btn.getAttribute("data-ocal-value"));
        } else if (act === "prev-day") {
          shiftDay(-1);
          refocus('[data-ocal-action="prev-day"]');
        } else if (act === "next-day") {
          shiftDay(1);
          refocus('[data-ocal-action="next-day"]');
        }
      }
      on(root, "keydown", userAction(onKeydown));
      on(root, "click", userAction(onClick));
      on(root, "focusout", guard(onRootFocusOut));
      if (typeof MutationObserver === "function") {
        dirObserver = new MutationObserver(function() {
          if (destroyed) return;
          var rtl = true;
          try {
            var d = window.getComputedStyle(root).direction;
            if (d === "ltr") rtl = false;
          } catch (err) {
          }
          if (rtl !== state.rtl) {
            state.rtl = rtl;
            render();
          }
        });
        dirObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
      }
      render();
      observeResponsiveWidth();
      return {
        root,
        getState: guard(getState),
        setDisplayedMonth: guard(function(month) {
          var p = parseIso(typeof month === "string" ? month + "-01" : null);
          if (!p) return;
          state.monthCursor = { y: p.y, m: p.m };
          var focused = parseIso(state.focusDate);
          state.focusDate = isoOf(p.y, p.m, focused ? Math.min(focused.d, daysInMonth(p.y, p.m)) : 1);
          state.pickerOpen = false;
          render();
        }),
        /* تحديث كامل بلا إعادة تهيئة؛ يحفظ selected/view/c-calendar إن
           بقيت صالحة، ويمسح حالتي الانتظار/الخطأ (آخر كتابة تفوز).
           عقد 2026-10-26: حذف الطلب المفتوح من البيانات يطويه بصدق */
        setData: guard(function(orders) {
          state.orders = normalizeOrders(orders);
          if (state.expandedId !== null) {
            var stillThere = false;
            for (var i = 0; i < state.orders.length; i++) {
              if (state.orders[i].id === state.expandedId) {
                stillThere = true;
                break;
              }
            }
            if (!stillThere) state.expandedId = null;
          }
          state.loading = false;
          state.errorRetry = null;
          render();
        }),
        /* ضبط صامت (بلا أحداث) — الأحداث لأفعال المستخدم فقط (موثق) */
        setSelectedDate: guard(function(date) {
          if (!parseIso(date)) return;
          state.selectedDate = date;
          state.focusDate = date;
          var p = parseIso(date);
          state.monthCursor = { y: p.y, m: p.m };
          render();
        }),
        setView: guard(function(v) {
          if (v === "calendar" || v === "list") {
            state.pickerOpen = false;
            state.view = v;
            render();
            updateResponsiveView(root.getBoundingClientRect().width);
          }
        }),
        setCalendarView: guard(function(v) {
          if (v === "month" || v === "week" || v === "day") {
            state.pickerOpen = false;
            state.calendarView = v;
            if (v === "week") state.focusDate = state.selectedDate;
            render();
            updateResponsiveView(root.getBoundingClientRect().width);
          }
        }),
        setLoading: guard(function(flag) {
          state.loading = !!flag;
          if (state.loading) state.errorRetry = null;
          render();
        }),
        /* setError(cb): cb مسؤولية المستهلك — زر «إعادة المحاولة»
           يستدعيه فقط ولا يعيد المكوّن التحميل بنفسه؛ setError(null)
           يزيل حالة الخطأ (موثق). يمسح حالة الانتظار لأنه الأحدث */
        setError: guard(function(retryCallback) {
          state.errorRetry = typeof retryCallback === "function" ? retryCallback : null;
          if (state.errorRetry) state.loading = false;
          render();
        }),
        /* ينزع كل مستمع (المصفوفة أعلاه) ويفصل مراقبي dir/العرض ويعيد
           الجذر لسمة غير مهيأة — بعده لا أحداث إطلاقًا. R-27 (2026-10-25):
           تُزال أيضًا سمات العقد المتبقية (layout/compact/selected-date)
           فلا تُقرأ بحالة ما بعد الدمار */
        destroy: guard(function() {
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
            window.removeEventListener("resize", resizeFallback, false);
            resizeFallback = null;
          }
          for (var i = listeners.length - 1; i >= 0; i--) {
            var L = listeners[i];
            L.el.removeEventListener(L.type, L.fn, false);
          }
          listeners.length = 0;
          docEscapeRef = null;
          root.textContent = "";
          root.classList.remove("m-ocal");
          root.removeAttribute("data-ocal-root");
          root.removeAttribute("data-ocal-init");
          root.removeAttribute("data-ocal-view");
          root.removeAttribute("data-ocal-cal-view");
          root.removeAttribute("data-ocal-auto-view");
          root.removeAttribute("data-ocal-layout");
          root.removeAttribute("data-ocal-compact");
          root.removeAttribute("data-ocal-selected-date");
          instances.delete(root);
        })
      };
    }
    window.MicroOrderSchedule = {
      init,
      getInstance: function(root) {
        return root && instances.get(root) || null;
      },
      /* العقد الموحد (المرحلة 6 — 2026-11-21): update(root, orders) اسم موحد
         على مستوى الوحدة يفوّض إلى instance.setData(orders) نفسها — تحديث
         كامل بلا إعادة تهيئة. الاسم القديم setData على المثيل يبقى (D10).
         بلا مثيل للجذر لا فعل وتُعاد null (init تظل مدخل الإنشاء). */
      update: function(root, orders) {
        var inst = root && instances.get(root) || null;
        if (inst) inst.setData(orders);
        return inst;
      }
    };
  })();
})();
