/* C08 (state) — حالة عملية واتصال ومرجع: recheck/retry و(مؤقتًا حتى R6)
   فعل save-local بحسب مواصفة الجولة الأولى؛ السلوك الحرفي محفوظ. */
import { register } from './product-core.js';
import { getLabel } from '../../shared/labels.js';

var MICRO_LABELS_FAMILY = 'product-context';
function L(key) {
  return getLabel(MICRO_LABELS_FAMILY, key);
}

export const type = 'state';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;

  root.appendChild(node('h2', 'm-product__title', model.title || L('k110')));
  if (model.reference) {
    var reference = node('p', 'm-product__secondary', L('k111'));
    reference.appendChild(node('bdi', '', model.reference));
    root.appendChild(reference);
  }
  if (model.detail) root.appendChild(node('p', '', model.detail));

  var actions = node('div', 'm-product__actions');
  [
    { id: 'recheck', label: L('k112') },
    { id: 'retry', label: L('k113') },
    { id: 'save-local', label: L('k114'), local: true }
  ].forEach(function (action) {
    if ((model.permissions || []).indexOf(action.id) >= 0) {
      ctx.button(actions, action.id, action.label, { reference: model.reference || null }, { local: action.local });
    }
  });
  root.appendChild(actions);
  if (model.steps) ctx.timeline(root, model.steps);
}

register(type, render);
