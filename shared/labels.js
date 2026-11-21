/* =========================================================
   Micro UI — سجل النصوص الافتراضية المشترك (الجولة الثانية R2).
   الملف: shared/labels.js

   هذا الملف هو نواة سجل نصوص العائلات (يحل محل نواة سجل MicroLabels
   التي كانت تُعرَّف دفاعيًا في كل ملف labels.js). العائلات تسجّل نصوصها
   الافتراضية عبر registerLabels وتقرؤها وقت الاستخدام عبر getLabel كي
   يعمل التخصيص (setLabels) بعد التحميل كما في المرحلة 7.

   مشاركة الحالة بين الحزم: كل دالة تصل إلى المخزن كسولًا عبر globalThis
   (مفتاح خاص __microLabelsStore) — بذلك تتشارك ملفات dist/iife/<family>.js
   المنفصلة وقطع dist/esم/ الحالة نفسها، تمامًا كما كان سجل MicroLabels
   الواحدة مشتركة قبل الجولة الثانية. لا وصول إلى window أو document في
   المستوى الأعلى للوحدة (R-D2).

   العقود المحفوظة حرفيًا (المرحلة 7 / D12):
   - الافتراضي 'ar-u-nu-latn': formatNumber يعيد String(n) حرفيًا
     (أرقام لاتينية بلا فواصل آلاف)؛ Intl يُستخدم فقط عند locale مخصص.
   - setLocale يسري على التصييرات اللاحقة فقط.
   - setLabels دمج جزئي بمستوى واحد، وكائنات صيغ الجمع تُدمج بمفتاحها
     الداخلي.
   - plural(n, forms): فئات Intl.PluralRules('ar') للعدادات دون 100،
     والأعداد 100 فأكثر تحتفظ بقاعدة العدد المركب (آخر رقمين) —
     نفس المنطق الحرفي السابق.
   ========================================================= */

var pluralRules = null;

function store() {
  var root = typeof globalThis !== 'undefined' ? globalThis : null;
  if (!root) return { locale: 'ar-u-nu-latn', families: {} };
  if (!root.__microLabelsStore) root.__microLabelsStore = { locale: 'ar-u-nu-latn', families: {} };
  return root.__microLabelsStore;
}

/* R5 — طبقات نصوص لكل instance (جذر تهيئة): init(root, {labels}) يخزنها
   هنا لكل (جذر، عائلة)، وكل ملفات العائلة — النواة والrenderers — تقرأ
   من الخريطة نفسها عبر سياق العنصر أو سياق التصيير الجاري. */
var instanceOverlays = new WeakMap();

export function setInstanceLabels(root, family, labels) {
  if (!root || root.nodeType !== 1 || !labels || typeof labels !== 'object') return;
  var byFamily = instanceOverlays.get(root);
  if (!byFamily) { byFamily = {}; instanceOverlays.set(root, byFamily); }
  byFamily[family] = labels;
}

export function instanceLabelsOf(root, family) {
  var byFamily = root && instanceOverlays.get(root);
  return (byFamily && byFamily[family]) || null;
}

export function instanceLabelFor(el, family) {
  for (var node = el; node && node.nodeType === 1; node = node.parentElement) {
    var own = instanceLabelsOf(node, family);
    if (own) return own;
  }
  return null;
}

export function registerLabels(family, defaults) {
  var families = store().families;
  if (!families[family]) families[family] = {};
  var current = families[family];
  for (var key in defaults) current[key] = defaults[key];
}

export function getLabel(family, key, vars) {
  var entry = store().families[family];
  var value = entry ? entry[key] : undefined;
  if (value == null || !vars) return value;
  var text = String(value);
  for (var name in vars) text = text.split('{' + name + '}').join(String(vars[name]));
  return text;
}

export function familyLabels(family) {
  return store().families[family];
}

export function setLabels(family, partial) {
  var families = store().families;
  var current = families[family] = families[family] || {};
  for (var key in partial) {
    if (partial[key] && Object.prototype.toString.call(partial[key]) === '[object Object]') {
      current[key] = current[key] || {};
      var sub;
      for (sub in partial[key]) current[key][sub] = partial[key][sub];
    } else {
      current[key] = partial[key];
    }
  }
}

export function setLocale(locale) {
  /* تغيير locale يسري على التصييرات اللاحقة فقط */
  store().locale = locale;
}

export function getLocale() {
  return store().locale || 'ar-u-nu-latn';
}

export function formatNumber(value) {
  var locale = getLocale();
  /* العقد: الافتراضي يطابق السلوك الحالي حرفيًا (String(n) بأرقام
     لاتينية بلا فواصل آلاف)؛ Intl يُستخدم فقط عند locale مخصص. */
  if (locale === 'ar-u-nu-latn') return String(value);
  try { return new Intl.NumberFormat(locale).format(value); }
  catch (err) { return String(value); }
}

/* فئة الجمع لعدّاد: نفس المنطق الحرفي السابق (Intl.PluralRules('ar')
   دون 100، وقاعدة العدد المركب الموثقة 100 فأكثر — آخر رقمين). */
export function pluralCategory(n) {
  if (n >= 100) {
    var r = n % 100;
    if (r === 0) return 'other';
    if (r === 1) return 'hundredOne';
    if (r === 2) return 'hundredTwo';
    if (r >= 3 && r <= 10) return 'few';
    return 'many';
  }
  if (!pluralRules) {
    try { pluralRules = new Intl.PluralRules('ar'); }
    catch (err) { pluralRules = { select: function () { return 'other'; } }; }
  }
  return pluralRules.select(n);
}

export function plural(n, forms) {
  var source = forms || {};
  var template = source[pluralCategory(n)] != null ? source[pluralCategory(n)] : source.other;
  if (template == null) return String(n);
  return String(template).replace('{n}', String(n));
}
