/* C07 (context) — هوية واحدة، contexts من المستهلك، وجهات مصرح بها. */
import { register } from './product-core.js';
import { getLabel } from '../../shared/labels.js';

var MICRO_LABELS_FAMILY = 'product-context';
function L(key) {
  return getLabel(MICRO_LABELS_FAMILY, key);
}

export const type = 'context';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;
  var contexts = model.contexts || [];
  var keys = contexts.map(function (item) { return ctx.key(item.scope); });
  var current = contexts.find(function (item) { return item.scope && ctx.key(item.scope) === ctx.key(model.scope); });

  root.appendChild(node('h2', 'm-product__title', model.accountLabel || L('k53')));
  if (!current) { ctx.note(root, L('k54'), L('k55'), 'warning'); return; }
  if (keys.some(function (k, i) { return !k || keys.indexOf(k) !== i; })) { ctx.note(root, L('k56'), L('k55'), 'warning'); return; }

  var label = node('label', 'm-field__label', L('k57')), select = node('select', 'm-field__input');
  select.id = ctx.uid + '-context';
  select.dataset.focusKey = 'context-select';
  label.htmlFor = select.id;
  contexts.forEach(function (item) {
    var option = node('option', '', item.label);
    option.value = ctx.key(item.scope);
    select.appendChild(option);
  });
  select.value = ctx.key(model.scope);
  select.disabled = !ctx.can('switch-context');
  var field = node('div', 'm-field'), control = node('div', 'm-field__control');
  field.dataset.microField = '';
  control.appendChild(select);
  field.append(label, control);
  root.appendChild(field);
  ctx.on(select, 'change', function () {
    var chosen = select.value;
    select.value = ctx.key(model.scope);
    var item = contexts.find(function (x) { return ctx.key(x.scope) === chosen; });
    if (item) ctx.request('switch-context', { contextId: item.scope.contextId, targetScope: structuredClone(item.scope) });
  });

  var names = { manage: L('k58'), market: L('k59'), delivery: L('k60'), ask: 'Ask Micro' };
  var nav = node('nav', 'm-product__destinations');
  nav.setAttribute('aria-label', L('k61'));
  ['manage', 'market', 'delivery', 'ask']
    .filter(function (id) {
      return (current.destinations || []).indexOf(id) >= 0 && (model.scope.kind !== 'driver' || id === 'delivery' || id === 'ask');
    })
    .forEach(function (id) {
      var button = ctx.button(nav, 'navigate', names[id], { destination: id });
      button.dataset.destination = id;
      button.dataset.focusKey = 'destination-' + id;
      if (model.destination === id) button.setAttribute('aria-current', 'page');
    });
  root.appendChild(nav);
  if (!nav.children.length) ctx.note(root, L('k62'), L('k63'), 'warning');
}

register(type, render);
