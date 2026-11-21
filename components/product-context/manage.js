/* C14 — Manage (D15/D16): قراءة وإدخال فقط. قاعدة صارمة: المكتبة لا
   تحسب أي مجاميع مالية — كل قيم ملخص الفترة يمررها المضيف حرفيًا،
   والوحدة تأتي من النموذج دائمًا ولا تفترضها المكتبة. Online-only:
   لا طابور ولا «تم الحفظ» قبل resolve من المضيف (R-D11). */
import { register } from './product-core.js';
import { instanceLabelFor, instanceLabelsOf, getLabel } from '../../shared/labels.js';

var MICRO_LABELS_FAMILY = 'product-context';
/* R5 — تخصيص لكل instance عبر السجل المشترك (shared/labels.js): الخريطة
   لكل (جذر، عائلة) فيقرأ النواة وrenderers العائلة الطبقة نفسها. */
var renderLabels = null;
function L(key, el) {
  var own = (el && instanceLabelFor(el, MICRO_LABELS_FAMILY)) || renderLabels;
  if (own && Object.prototype.hasOwnProperty.call(own, key)) return own[key];
  return getLabel(MICRO_LABELS_FAMILY, key);
}
function withLabels(scope, fn) {
  var previous = renderLabels;
  renderLabels = instanceLabelsOf(scope, MICRO_LABELS_FAMILY);
  try { return fn(); } finally { renderLabels = previous; }
}
function applyInstanceLabels(scope, options) {
  if (options && options.labels && typeof options.labels === 'object') {
    setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
  }
}

export const type = 'manage';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;
  var head = node('header', 'm-product__header');
  root.appendChild(head);
  head.appendChild(node('h2', 'm-product__title', model.title || L('manage.title', head)));
  var operations = Array.isArray(model.operations) ? model.operations : [];

  function unitOf(item) {
    return item && item.unit ? item.unit : (model.unit || L('common.unitFallback'));
  }

  /* ملخص الفترة — قيم المضيف فقط؛ المفقود ليس صفرًا. */
  if (Array.isArray(model.summary) && model.summary.length) {
    var summarySection = node('section', 'm-product__section');
    summarySection.appendChild(node('h3', 'm-product__title', L('manage.summaryTitle', summarySection)));
    var dl = node('dl', 'm-product__comparison');
    model.summary.forEach(function (item) {
      if (!item || item.label == null || String(item.label).trim() === '') return;
      dl.appendChild(node('dt', '', item.label));
      var dd = node('dd');
      if (item.value == null || String(item.value).trim() === '') {
        dd.appendChild(node('span', 'm-product__secondary', L('common.unavailable', dd)));
      } else {
        var number = node('bdi', '', item.value);
        number.dir = 'ltr';
        dd.append(number, document.createTextNode(' ' + unitOf(item)));
      }
      dl.appendChild(dd);
    });
    if (dl.children.length) { summarySection.appendChild(dl); root.appendChild(summarySection); }
  }

  /* صفوف العمليات على مبنى C02/Organization — النوع نص ظاهر لا لون فقط. */
  if (operations.length) {
    var listSection = node('section', 'm-product__section');
    listSection.appendChild(node('h3', 'm-product__title', L('manage.listTitle', listSection)));
    var list = node('ul', 'm-operational-list');
    operations.forEach(function (operation) {
      if (!operation) return;
      var typeText = operation.type === 'sale' ? L('manage.type.sale') : operation.type === 'expense' ? L('manage.type.expense') : null;
      var row = node('li', 'm-row m-row--operational'), text = node('span', 'm-row__text');
      text.appendChild(node('strong', 'm-row__title', operation.description || typeText || L('common.unavailable', text)));
      var sub = [];
      if (typeText && operation.description) sub.push(typeText);
      if (operation.date) sub.push(operation.date);
      if (sub.length) text.appendChild(node('span', 'm-row__subtitle', sub.join(' · ')));
      row.appendChild(text);
      var reading = node('span', 'm-row__reading');
      var amount = node('bdi', '', operation.amount == null || String(operation.amount).trim() === '' ? L('common.unavailable') : operation.amount);
      amount.dir = 'ltr';
      reading.append(amount, document.createTextNode(' ' + unitOf(operation)));
      row.appendChild(reading);
      list.appendChild(row);
    });
    if (list.children.length) { listSection.appendChild(list); root.appendChild(listSection); }
  } else if (model.phase === 'ready') {
    root.appendChild(node('p', 'm-product__secondary', L('manage.emptyList', root)));
  }

  /* نموذج إدخال عملية: Fields للمدخلات وB01 للأفعال. الإرسال نية تنتظر
     تأكيد الخادم؛ «تفريغ الحقول» فعل عرضي محلي لا يطلق نية. */
  var form = node('section', 'm-product__section');
  form.appendChild(node('h3', 'm-product__title', L('manage.formTitle', form)));
  ctx.field(form, 'amount', L('manage.amountField', form), { inputmode: 'decimal', unit: model.unit || L('common.unitFallback', form) });
  ctx.field(form, 'type', L('manage.typeField', form), { options: [{ id: 'sale', label: L('manage.type.sale', form) }, { id: 'expense', label: L('manage.type.expense', form) }] });
  ctx.field(form, 'date', L('manage.dateField', form), { type: 'date' });
  ctx.field(form, 'note', L('manage.noteField', form), { multiline: true });
  var actions = node('div', 'm-product__actions m-btn-group m-btn-group--pair');
  var submit = ctx.button(actions, 'add-operation', L('manage.submitAction', submit), function () { return ctx.fieldsPayload(model.requiredFields || []); }, { primary: true, confirm: true, description: L('manage.submitConfirm', submit) });
  /* انتظار تأكيد الخادم: زر الإرسال يظهر حالة تحميل ويعطل — لا نجاح قبل resolve. */
  if (ctx.pending === 'add-operation') {
    submit.setAttribute('aria-busy', 'true');
    submit.classList.add('is-loading');
    submit.insertBefore(node('span', 'm-btn__spinner'), submit.firstChild);
  }
  var cancel = node('button', 'm-btn m-btn--secondary', L('manage.clearAction'));
  cancel.type = 'button';
  cancel.dataset.focusKey = 'clear-operation-form';
  cancel.disabled = !ctx.editable();
  ctx.on(cancel, 'click', function () {
    if (!ctx.editable()) return;
    Array.prototype.forEach.call(form.querySelectorAll('[data-focus-key^="field-"]'), function (input) {
      input.value = '';
      input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    });
  });
  actions.appendChild(cancel);
  form.appendChild(actions);
  root.appendChild(form);

  /* فشل مؤكد من المضيف مع grant retry: إعادة إرسال صريحة للقيم نفسها، لا نجاح مفترض. */
  if (model.phase === 'error' && (model.permissions || []).indexOf('retry') >= 0) {
    ctx.button(root, 'retry', L('operation.actions.retry', root), function () { return ctx.fieldsPayload(model.requiredFields || []); });
  }
}

register(type, render);
