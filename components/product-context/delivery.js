/* C10 (delivery) — modes request/offer/tracking/change/proof. */
import { register } from './product-core.js';
import { getLabel } from '../../shared/labels.js';

var MICRO_LABELS_FAMILY = 'product-context';
function L(key) {
  return getLabel(MICRO_LABELS_FAMILY, key);
}

export const type = 'delivery';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;
  var head = node('header', 'm-product__header');
  root.appendChild(head);
  head.appendChild(node('h2', 'm-product__title', model.title || L('k64')));
  if (model.statusLabel) head.appendChild(node('span', 'm-badge m-badge--info', model.statusLabel));

  if (model.mode !== 'request' && model.visibility && model.visibility.addresses) {
    var addresses = node('dl', 'm-product__comparison');
    [[L('k65'), model.pickup], [L('k66'), model.dropoff]].forEach(function (pair) {
      addresses.append(node('dt', '', pair[0]), node('dd', '', pair[1] || L('k67')));
    });
    root.appendChild(addresses);
  } else if (!(model.visibility && model.visibility.addresses)) {
    root.appendChild(node('p', 'm-product__secondary', L('k68')));
  }
  if (model.visibility && model.visibility.contact && model.contact) root.appendChild(node('bdi', '', model.contact));

  if (model.mode === 'request') {
    ctx.field(root, 'pickup', L('k69'), { value: model.visibility && model.visibility.addresses ? model.pickup : '' });
    ctx.field(root, 'dropoff', L('k70'), { value: model.visibility && model.visibility.addresses ? model.dropoff : '' });
    ctx.field(root, 'note', L('k71'), { multiline: true, value: model.note });
    ctx.button(root, 'request-delivery', L('k72'), function () { return ctx.fieldsPayload(model.requiredFields || []); }, { confirm: true, description: L('k73') });
  } else if (model.mode === 'offer') {
    var quote = node('section', 'm-product__section m-product__quote');
    root.appendChild(quote);
    var price = node('p', 'm-product__value');
    var number = node('bdi', '', model.amount == null ? L('k67') : model.amount);
    number.dir = 'ltr';
    price.append(number, document.createTextNode(' ' + (model.unit || L('k74'))));
    quote.appendChild(price);
    quote.appendChild(node('p', 'm-product__secondary', model.validityLabel || L('k75')));
    var actions = node('div', 'm-product__actions m-btn-group m-btn-group--pair'), more = node('div', 'm-btn-group__more');
    root.appendChild(actions);
    ['accept', 'decline', 'assign'].forEach(function (id) {
      if ((model.permissions || []).indexOf(id) >= 0) {
        ctx.button(id === 'assign' ? more : actions, id, { accept: L('k76'), decline: L('k77'), assign: L('k78') }[id],
          { requestId: model.id, offerId: model.offerId, revision: model.revision },
          { confirm: true, primary: id === 'accept', description: L('k79') + String(model.amount == null ? L('k80') : model.amount) + ' ' + (model.unit || '') + '.' });
      }
    });
    if (more.children.length) actions.appendChild(more);
    if (actions.querySelectorAll(':scope > .m-btn').length < 2) actions.classList.remove('m-btn-group--pair');
  } else if (model.mode === 'change') {
    var diff = node('dl', 'm-product__comparison');
    diff.append(node('dt', '', L('k81')), node('dd', '', model.currentText || L('k67')), node('dt', '', L('k82')), node('dd', '', model.proposedText || L('k67')));
    root.appendChild(diff);
    ctx.timeline(root, (model.parties || []).map(function (party) {
      return { label: party.label, detail: party.statusLabel || L('k83') };
    }));
    ctx.button(root, 'request-change', L('k84'), { requestId: model.id, revision: model.revision }, { confirm: true, description: L('k85') });
  } else if (model.mode === 'proof') {
    if (model.requirementsLabel) root.appendChild(node('p', '', model.requirementsLabel));
    ctx.field(root, 'note', L('k86'), { multiline: true });
    ctx.attachments(root, model.attachmentRequired);
    ctx.button(root, 'submit-proof', model.proofKind === 'return' ? L('k87') : L('k88'), function () {
      if (model.attachmentRequired && !ctx.ui.files.length) { ctx.note(root, L('k89'), '', 'error'); return false; }
      var payload = ctx.fieldsPayload(model.requiredFields || []);
      if (payload) {
        payload.requestId = model.id;
        payload.proofKind = model.proofKind || 'delivery';
        payload.revision = model.revision;
      }
      return payload;
    }, { confirm: true, description: L('k90') });
  } else {
    ctx.timeline(root, model.steps);
    if ((model.permissions || []).indexOf('recheck') >= 0) ctx.button(root, 'recheck', L('k91'), { requestId: model.id });
  }
}

register(type, render);
