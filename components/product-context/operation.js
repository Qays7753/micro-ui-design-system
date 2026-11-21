/* C08 (state) — حالة عملية واتصال ومرجع: recheck/retry و(مؤقتًا حتى R6)
   Online-only (R-D11): لا فعل تخزين على الجهاز — recheck/retry فقط. */
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

export const type = 'state';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;

  root.appendChild(node('h2', 'm-product__title', model.title || L('operation.title', root)));
  if (model.reference) {
    var reference = node('p', 'm-product__secondary', L('operation.referencePrefix', reference));
    reference.appendChild(node('bdi', '', model.reference));
    root.appendChild(reference);
  }
  if (model.detail) root.appendChild(node('p', '', model.detail));

  var actions = node('div', 'm-product__actions');
  [
    { id: 'recheck', label: L('operation.actions.recheck') },
    { id: 'retry', label: L('operation.actions.retry') },
  ].forEach(function (action) {
    if ((model.permissions || []).indexOf(action.id) >= 0) {
      ctx.button(actions, action.id, action.label, { reference: model.reference || null }, { local: action.local });
    }
  });
  root.appendChild(actions);
  if (model.steps) ctx.timeline(root, model.steps);
}

register(type, render);
