/* C12 (review) — modes queue/item/report. */
import { register } from './product-core.js';
import { getLabel } from '../../shared/labels.js';

var MICRO_LABELS_FAMILY = 'product-context';
function L(key) {
  return getLabel(MICRO_LABELS_FAMILY, key);
}

export const type = 'review';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;

  root.appendChild(node('h2', 'm-product__title', model.mode === 'report' ? L('k130') : model.mode === 'queue' ? (model.title || L('k164')) : (model.title || L('k131'))));

  if (model.mode === 'report') {
    if (model.subjectLabel) root.appendChild(node('p', '', model.subjectLabel));
    if (model.statusLabel) root.appendChild(node('span', 'm-badge m-badge--info', model.statusLabel));
    ctx.field(root, 'reason', L('k132'), { multiline: true });
    if (model.reasonOptions) ctx.field(root, 'category', L('k133'), { options: model.reasonOptions });
    ctx.button(root, 'submit-report', L('k134'), function () {
      var payload = ctx.fieldsPayload(model.requiredFields || []);
      if (payload) payload.subjectId = model.id;
      return payload;
    }, { confirm: true, description: L('k135') });
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
      if ((model.permissions || []).indexOf('retry') >= 0) ctx.button(root, 'retry', L('k113'), {});
      return;
    }
    var items = Array.isArray(model.items) ? model.items : [];
    if (!items.length) { root.appendChild(node('p', 'm-product__secondary', L('k168'))); return; }
    var list = node('ul', 'm-operational-list');
    items.forEach(function (item) {
      if (!item || item.id == null) return;
      var kindText = item.kind === 'listing' ? L('k165') : item.kind === 'flag' ? L('k166') : item.kind === 'driver-application' ? L('k167') : null;
      var li = node('li'), row = node('button', 'm-row m-row--operational m-product__queue-item');
      row.type = 'button';
      row.dataset.focusKey = 'queue-item-' + item.id;
      row.disabled = !ctx.can('open-review');
      var text = node('span', 'm-row__text');
      text.appendChild(node('strong', 'm-row__title', item.title || L('k67')));
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
    else root.appendChild(node('p', 'm-product__secondary', L('k168')));
    return;
  }

  if (model.subjectLabel) root.appendChild(node('p', '', model.subjectLabel));
  if (model.statusLabel) root.appendChild(node('span', 'm-badge m-badge--info', model.statusLabel));
  if (model.summary) root.appendChild(node('p', '', model.summary));
  if (model.reason) ctx.note(root, L('k136'), model.reason, 'info');
  if ((model.permissions || []).indexOf('view-evidence') >= 0 && model.visibility && model.visibility.evidence) {
    ctx.media(root, model.images, 'contain');
  } else if (model.images && model.images.length) {
    root.appendChild(node('p', 'm-product__secondary', L('k137')));
  }
  ctx.field(root, 'reason', L('k138'), { multiline: true });
  var actions = node('div', 'm-product__actions');
  root.appendChild(actions);
  [{ id: 'approve', label: L('k139') }, { id: 'reject', label: L('k140') }, { id: 'request-info', label: L('k141') }].forEach(function (action) {
    if ((model.permissions || []).indexOf(action.id) >= 0) {
      ctx.button(actions, action.id, action.label, function () {
        var payload = ctx.fieldsPayload(model.reasonRequired && action.id === 'reject' ? ['reason'] : []);
        if (payload) {
          payload.subjectId = model.id;
          payload.revision = model.revision;
        }
        return payload;
      }, { confirm: true, primary: action.id === 'approve', danger: action.id === 'reject', description: L('k142') + action.label + L('k143') + (model.subjectLabel || L('k144')) + '.' });
    }
  });
  if (model.history) ctx.timeline(root, model.history);
}

register(type, render);
