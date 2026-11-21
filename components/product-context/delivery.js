/* C10 (delivery) — modes request/offer/tracking/change/proof. */
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

export const type = 'delivery';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;
  var head = node('header', 'm-product__header');
  root.appendChild(head);
  head.appendChild(node('h2', 'm-product__title', model.title || L('delivery.title', head)));
  if (model.statusLabel) head.appendChild(node('span', 'm-badge m-badge--info', model.statusLabel));

  if (model.mode !== 'request' && model.visibility && model.visibility.addresses) {
    var addresses = node('dl', 'm-product__comparison');
    [[L('delivery.pickup'), model.pickup], [L('delivery.dropoff'), model.dropoff]].forEach(function (pair) {
      addresses.append(node('dt', '', pair[0]), node('dd', '', pair[1] || L('common.unavailable')));
    });
    root.appendChild(addresses);
  } else if (!(model.visibility && model.visibility.addresses)) {
    root.appendChild(node('p', 'm-product__secondary', L('delivery.addressesUnavailable', root)));
  }
  if (model.visibility && model.visibility.contact && model.contact) root.appendChild(node('bdi', '', model.contact));

  if (model.mode === 'request') {
    ctx.field(root, 'pickup', L('delivery.pickupField', root), { value: model.visibility && model.visibility.addresses ? model.pickup : '' });
    ctx.field(root, 'dropoff', L('delivery.dropoffField', root), { value: model.visibility && model.visibility.addresses ? model.dropoff : '' });
    ctx.field(root, 'note', L('delivery.noteField', root), { multiline: true, value: model.note });
    ctx.button(root, 'request-delivery', L('delivery.requestAction', root), function () { return ctx.fieldsPayload(model.requiredFields || []); }, { confirm: true, description: L('delivery.requestConfirm', root) });
  } else if (model.mode === 'offer') {
    var quote = node('section', 'm-product__section m-product__quote');
    root.appendChild(quote);
    var price = node('p', 'm-product__value');
    var number = node('bdi', '', model.amount == null ? L('common.unavailable') : model.amount);
    number.dir = 'ltr';
    price.append(number, document.createTextNode(' ' + (model.unit || L('common.unitFallback'))));
    quote.appendChild(price);
    quote.appendChild(node('p', 'm-product__secondary', model.validityLabel || L('delivery.validityFallback', quote)));
    var actions = node('div', 'm-product__actions m-btn-group m-btn-group--pair'), more = node('div', 'm-btn-group__more');
    root.appendChild(actions);
    ['accept', 'decline', 'assign'].forEach(function (id) {
      if ((model.permissions || []).indexOf(id) >= 0) {
        ctx.button(id === 'assign' ? more : actions, id, { accept: L('delivery.quote.accept', actions), decline: L('delivery.quote.decline', actions), assign: L('delivery.quote.assign', actions) }[id],
          { requestId: model.id, offerId: model.offerId, revision: model.revision },
          { confirm: true, primary: id === 'accept', description: L('delivery.quote.confirmPrefix') + String(model.amount == null ? L('common.unavailablePlain') : model.amount) + ' ' + (model.unit || '') + '.' });
      }
    });
    if (more.children.length) actions.appendChild(more);
    if (actions.querySelectorAll(':scope > .m-btn').length < 2) actions.classList.remove('m-btn-group--pair');
  } else if (model.mode === 'change') {
    var diff = node('dl', 'm-product__comparison');
    diff.append(node('dt', '', L('delivery.change.current')), node('dd', '', model.currentText || L('common.unavailable')), node('dt', '', L('delivery.change.proposed')), node('dd', '', model.proposedText || L('common.unavailable')));
    root.appendChild(diff);
    ctx.timeline(root, (model.parties || []).map(function (party) {
      return { label: party.label, detail: party.statusLabel || L('delivery.partyStatusFallback') };
    }));
    ctx.button(root, 'request-change', L('delivery.change.requestAction', root), { requestId: model.id, revision: model.revision }, { confirm: true, description: L('delivery.change.confirm', root) });
  } else if (model.mode === 'proof') {
    if (model.requirementsLabel) root.appendChild(node('p', '', model.requirementsLabel));
    ctx.field(root, 'note', L('delivery.proof.noteField', root), { multiline: true });
    ctx.attachments(root, model.attachmentRequired);
    ctx.button(root, 'submit-proof', model.proofKind === 'return' ? L('delivery.proof.returnAction', root) : L('delivery.proof.deliveryAction', root), function () {
      if (model.attachmentRequired && !ctx.ui.files.length) { ctx.note(root, L('delivery.proof.attachmentRequired', root), '', 'error'); return false; }
      var payload = ctx.fieldsPayload(model.requiredFields || []);
      if (payload) {
        payload.requestId = model.id;
        payload.proofKind = model.proofKind || 'delivery';
        payload.revision = model.revision;
      }
      return payload;
    }, { confirm: true, description: L('delivery.proof.confirm') });
  } else {
    ctx.timeline(root, model.steps);
    if ((model.permissions || []).indexOf('recheck') >= 0) ctx.button(root, 'recheck', L('delivery.updateStatusAction', root), { requestId: model.id });
  }
}

register(type, render);
