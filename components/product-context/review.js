/* C12 (review) — modes queue/item/report. */
import { register } from './product-core.js';
import { currentInstanceLabels, instanceLabelFor, withLabels as withFamilyLabels, instanceLabelsOf, getLabel, setInstanceLabels } from '../../shared/labels.js';

var MICRO_LABELS_FAMILY = 'product-context';
/* R5 — تخصيص لكل instance عبر السجل المشترك (shared/labels.js): الخريطة
   لكل (جذر، عائلة) فيقرأ النواة وrenderers العائلة الطبقة نفسها. */
function L(key, el) {
  var own = (el && instanceLabelFor(el, MICRO_LABELS_FAMILY)) || currentInstanceLabels(MICRO_LABELS_FAMILY);
  if (own && Object.prototype.hasOwnProperty.call(own, key)) return own[key];
  return getLabel(MICRO_LABELS_FAMILY, key);
}
function withLabels(scope, fn) {
  return withFamilyLabels(scope, MICRO_LABELS_FAMILY, fn);
}
function applyInstanceLabels(scope, options) {
  if (options && options.labels && typeof options.labels === 'object') {
    setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
  }
}

export const type = 'review';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;

  root.appendChild(node('h2', 'm-product__title', model.mode === 'report' ? L('review.reportTitle', root) : model.mode === 'queue' ? (model.title || L('review.queueTitle', root)) : (model.title || L('review.itemTitle', root))));

  if (model.mode === 'report') {
    if (model.subjectLabel) root.appendChild(node('p', '', model.subjectLabel));
    if (model.statusLabel) root.appendChild(node('span', 'm-badge m-badge--info', model.statusLabel));
    ctx.field(root, 'reason', L('review.reasonField', root), { multiline: true });
    if (model.reasonOptions) ctx.field(root, 'category', L('review.categoryField', root), { options: model.reasonOptions });
    ctx.button(root, 'submit-report', L('review.submitAction', root), function () {
      var payload = ctx.fieldsPayload(model.requiredFields || []);
      if (payload) payload.subjectId = model.id;
      return payload;
    }, { confirm: true, description: L('review.submitConfirm') });
    return;
  }

  /* C12/queue (D18/D19) — قائمة مراجعة متعددة العناصر: قائمة ← تفاصيل،
     والتفاصيل هي عنصر C12 نفسه (mode=item أدناه). النوع نص ظاهر لكل
     عنصر (إعلان/بلاغ/طلب سائق)، والترتيب كما يمرره المضيف حرفيًا — لا
     فرز ولا أولوية. اختيار عنصر يطلق نية open-review بمعرّفه ونسخته
     ولا يقرر شيئًا. البنية عامة (نوع/عنوان/تاريخ/حالة + نية فتح) وقابلة
     لإعادة الاستخدام لقوائم أخرى لاحقًا بتمرير عناصر مختلفة فقط. */
  if (model.mode === 'queue') {
    if (model.subjectLabel) root.appendChild(node('p', '', model.subjectLabel));
    if (model.phase === 'error') {
      if ((model.permissions || []).indexOf('retry') >= 0) ctx.button(root, 'retry', L('operation.actions.retry', root), {});
      return;
    }
    var items = Array.isArray(model.items) ? model.items : [];
    if (!items.length) { root.appendChild(node('p', 'm-product__secondary', L('review.emptyQueue', root))); return; }
    var list = node('ul', 'm-operational-list');
    items.forEach(function (item) {
      if (!item || item.id == null) return;
      var kindText = item.kind === 'listing' ? L('review.kind.listing') : item.kind === 'flag' ? L('review.kind.flag') : item.kind === 'driver-application' ? L('review.kind.driverApplication') : null;
      var li = node('li'), row = node('button', 'm-row m-row--operational m-product__queue-item');
      row.type = 'button';
      row.dataset.focusKey = 'queue-item-' + item.id;
      row.disabled = !ctx.can('open-review');
      var text = node('span', 'm-row__text');
      text.appendChild(node('strong', 'm-row__title', item.title || L('common.unavailable', text)));
      var sub = [];
      if (kindText) sub.push(kindText);
      if (item.date) sub.push(item.date);
      if (sub.length) text.appendChild(node('span', 'm-row__subtitle', sub.join(' · ')));
      row.appendChild(text);
      if (item.statusLabel) {
        var meta = node('div', 'm-row__meta');
        meta.appendChild(node('span', 'm-badge m-badge--info', item.statusLabel));
        row.appendChild(meta);
      }
      ctx.on(row, 'click', function () {
        if (!root.contains(row) || row.disabled) return;
        ctx.request('open-review', { itemId: item.id, revision: item.revision == null ? null : item.revision });
      });
      li.appendChild(row);
      list.appendChild(li);
    });
    if (list.children.length) root.appendChild(list);
    else root.appendChild(node('p', 'm-product__secondary', L('review.emptyQueue', root)));
    return;
  }

  if (model.subjectLabel) root.appendChild(node('p', '', model.subjectLabel));
  if (model.statusLabel) root.appendChild(node('span', 'm-badge m-badge--info', model.statusLabel));
  if (model.summary) root.appendChild(node('p', '', model.summary));
  if (model.reason) ctx.note(root, L('review.reasonTitle', root), model.reason, 'info');
  if ((model.permissions || []).indexOf('view-evidence') >= 0 && model.visibility && model.visibility.evidence) {
    ctx.media(root, model.images, 'contain');
  } else if (model.images && model.images.length) {
    root.appendChild(node('p', 'm-product__secondary', L('review.attachmentsRestricted', root)));
  }
  ctx.field(root, 'reason', L('review.decisionNoteField', root), { multiline: true });
  var actions = node('div', 'm-product__actions');
  root.appendChild(actions);
  [{ id: 'approve', label: L('review.approveAction') }, { id: 'reject', label: L('review.rejectAction') }, { id: 'request-info', label: L('review.requestInfoAction') }].forEach(function (action) {
    if ((model.permissions || []).indexOf(action.id) >= 0) {
      ctx.button(actions, action.id, action.label, function () {
        var payload = ctx.fieldsPayload(model.reasonRequired && action.id === 'reject' ? ['reason'] : []);
        if (payload) {
          payload.subjectId = model.id;
          payload.revision = model.revision;
        }
        return payload;
      }, { confirm: true, primary: action.id === 'approve', danger: action.id === 'reject', description: L('review.decisionConfirmPrefix') + action.label + L('review.decisionConfirmOn') + (model.subjectLabel || L('review.subjectFallback')) + '.' });
    }
  });
  if (model.history) ctx.timeline(root, model.history);
}

register(type, render);
