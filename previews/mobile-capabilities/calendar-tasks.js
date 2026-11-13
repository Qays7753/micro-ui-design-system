/* Task specimen only: reuse the calendar API, no product defaults or routes. */
(function () {
  'use strict';
  var root=document.getElementById('task-calendar');
  var calendar=MicroOrderSchedule.init(root,{
    today:'2026-11-14',selectedDate:'2026-11-14',displayedMonth:'2026-11',calendarView:'week',view:'calendar',weekStart:0,
    statuses:{open:{label:'قيد التنفيذ',tone:'progress'}},
    orders:[{id:'task-1',title:'طلب صابون',date:'2026-11-14',time:'09:00',statusKey:'open'},
            {id:'task-2',title:'طلب شموع',date:'2026-11-14',time:'14:00',statusKey:'open'}]
  });
  window.calendarTaskLab={calendar:calendar};
})();
