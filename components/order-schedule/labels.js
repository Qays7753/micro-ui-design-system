/* =========================================================
   Micro UI — نصوص العائلة الافتراضية (order-schedule) — المرحلة 7 / الجولة الثانية R2.
   الملف: components/order-schedule/labels.js

   وحدة بيانات نصوص العائلة (الجولة الثانية R5): المفاتيح دلالية بموضعها، والقيم حرفية كما كانت (R-D15) —
   بدون تخصيص تبقى المخرجات متطابقة بايت-ببايت (D12). يسجلها ملف سلوك
   العائلة في سجل النصوص المشترك (shared/labels.js) عند الاستيراد، فلا
   يُحمَّل هذا الملف منفصلًا في الصفحات بعد الآن.

   التخصيص: <FamilyApi>.setLabels(partial) يدمج جزئيًا فوق هذه القيم،
   وsetLocale(locale) من مدخل labels يغيّر تنسيق الأرقام (الافتراضي
   'ar-u-nu-latn' — أرقام لاتينية بلا فواصل كما هو اليوم).
   ========================================================= */
export const defaults = {
  'schedule.orders.count': {"zero": "لا طلبات", "one": "طلب واحد", "two": "طلبان", "few": "{n} طلبات", "many": "{n} طلبًا", "other": "{n} طلب", "hundredOne": "{n} طلب واحد", "hundredTwo": "{n} طلبان"},
  'schedule.weekdays.full': ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  'schedule.weekdays.short': ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
  'schedule.errors.invalidRoot': "MicroOrderSchedule.init يتطلب عنصر جذر صالحًا (DOM Element)",
  'schedule.view.ariaLabel': "طريقة العرض",
  'schedule.view.day': "يوم",
  'schedule.view.week': "أسبوع",
  'schedule.view.month': "شهر",
  'schedule.view.calendarToggle': "عرض التقويم",
  'schedule.view.listToggle': "عرض القائمة",
  'schedule.nav.today': "اليوم",
  'schedule.nav.prevMonth': "الشهر السابق",
  'schedule.nav.prevWeek': "الأسبوع السابق",
  'schedule.nav.prevDay': "اليوم السابق",
  'schedule.nav.nextMonth': "الشهر التالي",
  'schedule.nav.nextWeek': "الأسبوع التالي",
  'schedule.nav.nextDay': "اليوم التالي",
  'schedule.picker.ariaLabel': "اختيار الشهر والسنة",
  'schedule.picker.prevYear': "السنة السابقة",
  'schedule.picker.nextYear': "السنة التالية",
  'schedule.picker.back': "رجوع للتقويم",
  'schedule.picker.monthsLabel': "أشهر السنة",
  'schedule.dayCell.ordersSuffix': "، ",
  'schedule.monthTitlePrefix': "طلبات ",
  'schedule.weekTitlePrefix': "طلبات الأسبوع ",
  'schedule.addOrder.label': "إضافة طلب",
  'schedule.addOrder.dayAriaPrefix': "إضافة طلب ليوم ",
  'schedule.orderRow.date': "التاريخ",
  'schedule.orderRow.unscheduled': "غير مجدول",
  'schedule.orderRow.time': "الوقت",
  'schedule.orderRow.customer': "المورد",
  'schedule.orderRow.status': "الحالة",
  'schedule.orderRow.note': "الملاحظة",
  'schedule.orderRow.edit': "تعديل",
  'schedule.orderRow.delete': "حذف",
  'schedule.dayList.title': "طلبات اليوم",
  'schedule.dayList.noDayPrefix': "لا يوم محدد في ",
  'schedule.dayList.noDaySuffix': " في هذا الشهر",
  'schedule.dayList.empty': "لا توجد طلبات",
  'schedule.list.empty': "لا توجد طلبات بعد.",
  'schedule.list.upcoming': "الطلبات القادمة",
  'schedule.list.past': "الطلبات السابقة",
  'schedule.list.unscheduled': "الطلبات غير المجدولة",
  'schedule.loading': "جارٍ تحميل الطلبات…",
  'schedule.loadError': "تعذّر تحميل الطلبات.",
  'schedule.retry': "إعادة المحاولة",
};
