/* C06 consumer recipe: read-only external summary. No Calendar DOM writes. */
(function () {
  'use strict';
  var root = document.getElementById('summary-calendar');
  var summary = document.getElementById('calendar-context');
  var scope = document.getElementById('summary-scope');
  var status = 'ready';
  var initialOrders = [
    { id: 'sample-1', title: 'طلب عينة أول', date: '2026-11-13', time: '09:00', statusKey: 'open' },
    { id: 'sample-2', title: 'طلب عينة ثان', date: '2026-11-13', time: '14:00', statusKey: 'open' },
    { id: 'sample-3', title: 'طلب عينة آخر', date: '2026-12-02', time: '10:00', statusKey: 'open' }
  ];
  var orders = initialOrders.slice();
  var lifetime = new AbortController();
  var options = { signal: lifetime.signal };
  var calendar = window.MicroOrderSchedule.init(root, {
    today: '2026-11-13', selectedDate: '2026-11-13', displayedMonth: '2026-11',
    calendarView: 'month', view: 'calendar', weekStart: 0,
    statuses: { open: { label: 'قيد التنفيذ', tone: 'progress' } }, orders: orders
  });
  function sync() {
    var state = calendar.getState();
    var byMonth = scope.value === 'month';
    var key = byMonth ? state.displayedMonth : state.selectedDate;
    summary.querySelector('[data-context-title]').textContent = byMonth ? 'طلبات الشهر المعروض' : 'طلبات اليوم المحدد';
    summary.querySelector('[data-context-period]').textContent = key;
    summary.setAttribute('aria-busy', String(status === 'loading'));
    var number = summary.querySelector('[data-context-value]');
    var unit = summary.querySelector('[data-context-unit]');
    var note = summary.querySelector('[data-context-note]');
    note.hidden = false;
    unit.hidden = status === 'loading' || status === 'error';
    if (status === 'loading') { number.textContent = 'جارٍ التحديث…'; note.textContent = 'القراءة قيد التحديث.'; }
    else if (status === 'error') { number.textContent = '(غير متاح)'; note.textContent = 'تعذّر تحميل قراءة هذه الفترة.'; }
    else {
      var count = orders.filter(function (order) { return byMonth ? order.date.slice(0, 7) === key : order.date === key; }).length;
      number.textContent = String(count);
      note.textContent = count ? '' : 'لا طلبات في هذه الفترة.';
      note.hidden = count > 0;
    }
  }
  root.addEventListener('order-schedule:state-change', sync, options);
  scope.addEventListener('change', sync, options);
  document.getElementById('set-summary-date').addEventListener('click', function () { calendar.setSelectedDate('2026-12-02'); sync(); }, options);
  document.getElementById('summary-state').addEventListener('change', function (event) {
    status = event.target.value;
    if (status === 'empty') orders = [];
    else if (status === 'ready') orders = initialOrders.slice();
    calendar.setData(orders); /* setters are silent; the consumer syncs explicitly */
    sync();
  }, options);
  document.getElementById('destroy-summary').addEventListener('click', function () {
    lifetime.abort();
    calendar.destroy();
    document.getElementById('summary-consumer').hidden = true;
    document.getElementById('summary-end').hidden = false;
  }, options);
  sync();
}());
