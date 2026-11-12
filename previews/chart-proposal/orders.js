/* Disposable source-consumption example. No app routing, persistence or editor. */
(function () {
  'use strict';
  const root = document.getElementById('order-preview');
  MicroOrderSchedule.init(root, {
    today: '2026-11-12', selectedDate: '2026-11-12', view: 'calendar', calendarView: 'month',
    orders: [
      { id: 'sample-morning', title: 'طلب صباحي', date: '2026-11-12', time: '09:15', statusKey: 'progress' },
      { id: 'sample-noon', title: 'طلب الظهر', date: '2026-11-12', time: '11:00', statusKey: 'hold' },
      { id: 'sample-next', title: 'طلب اليوم التالي', date: '2026-11-13', time: '10:30', statusKey: 'progress' },
      { id: 'sample-unscheduled', title: 'طلب غير مجدول', date: null, statusKey: 'hold' }
    ],
    statuses: { progress: { label: 'قيد التنفيذ', tone: 'progress' }, hold: { label: 'معلق', tone: 'warning' } }
  });
  root.addEventListener('order-schedule:add-request', function () {
    const feedback = document.getElementById('order-preview-feedback');
    feedback.textContent = 'وصل طلب الإضافة للعينة؛ لم يُنشأ أو يُحفظ طلب.';
    feedback.hidden = false;
  });
})();
