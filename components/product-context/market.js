/* C09 (market) — modes card/editor/search/results. */
import { register } from './product-core.js';
import { getLabel } from '../../shared/labels.js';

var MICRO_LABELS_FAMILY = 'product-context';
function L(key) {
  return getLabel(MICRO_LABELS_FAMILY, key);
}

export const type = 'market';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;
  var head = node('header', 'm-product__header');
  root.appendChild(head);
  head.appendChild(node('h2', 'm-product__title', model.mode === 'editor' ? L('k92') : (model.mode === 'search' || model.mode === 'results') ? L('k93') : model.title || L('k94')));

  /* رأس البحث مشترك بين وضعي search وresults (المرحلة 8): الاستعلام
     والفلاتر وزر البحث وملخص النتائج — كلها من المستهلك. */
  function searchHeader() {
    ctx.field(root, 'query', L('k95'), { value: model.query, type: 'search' });
    (model.filters || []).forEach(function (filter) {
      ctx.field(root, filter.id, filter.label, { options: filter.options, value: filter.value });
    });
    ctx.button(root, 'search', L('k96'), function () { return ctx.fieldsPayload([]); });
    if (model.resultLabel) root.appendChild(node('p', 'm-product__secondary', model.resultLabel));
  }

  function thumbEmpty(label) {
    var el = node('div', 'm-product__thumb m-product__thumb--empty');
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', label);
    return el;
  }

  if (model.mode === 'search') { searchHeader(); return; }

  /* C09/results (D17): مصفوفة نتائج من المضيف تُرسم صفوفًا على مبنى
     C02/Organization. حالات منفصلة: لا إعلانات أصلًا (resultsState)،
     لا نتائج لهذا البحث، فشل القراءة (phase=error مع retry إن وفّره
     المضيف)، والتحميل عبر phase=loading. صورة مفقودة لا تكسر التخطيط. */
  if (model.mode === 'results') {
    searchHeader();
    if (model.phase === 'error') {
      if ((model.permissions || []).indexOf('retry') >= 0) ctx.button(root, 'retry', L('k113'), {});
      return;
    }
    if (model.resultsState === 'no-ads') ctx.note(root, L('k160'), L('k161'), 'info');
    else if (model.resultsState === 'no-results') ctx.note(root, L('k162'), L('k163'), 'info');
    else {
      var results = Array.isArray(model.results) ? model.results : [];
      if (results.length) {
        var section = node('section', 'm-product__section');
        section.appendChild(node('h3', 'm-product__title', L('k159')));
        var list = node('ul', 'm-operational-list');
        results.forEach(function (item) {
          if (!item) return;
          var row = node('li', 'm-row m-row--operational');
          if (item.image) {
            var src = ctx.safeImage(item.image.src);
            if (src) {
              var img = node('img', 'm-product__thumb');
              img.src = src;
              img.alt = item.image.alt || L('k21');
              img.loading = 'lazy';
              img.decoding = 'async';
              ctx.on(img, 'error', function () { img.replaceWith(thumbEmpty(L('k25'))); });
              row.appendChild(img);
            } else {
              row.appendChild(thumbEmpty(L('k21')));
            }
          }
          var text = node('span', 'm-row__text');
          text.appendChild(node('strong', 'm-row__title', item.title || L('k67')));
          if (item.sellerLabel) text.appendChild(node('span', 'm-row__subtitle', item.sellerLabel));
          row.appendChild(text);
          if (item.statusLabel) {
            var meta = node('div', 'm-row__meta');
            meta.appendChild(node('span', 'm-badge m-badge--info', item.statusLabel));
            row.appendChild(meta);
          }
          var reading = node('span', 'm-row__reading');
          var price = node('bdi', '', item.price == null || String(item.price).trim() === '' ? L('k67') : item.price);
          price.dir = 'ltr';
          reading.append(price, document.createTextNode(' ' + (item.unit || model.unit || L('k105'))));
          row.appendChild(reading);
          list.appendChild(row);
        });
        if (list.children.length) { section.appendChild(list); root.appendChild(section); }
      }
    }
    return;
  }

  if (model.mode === 'editor') {
    ctx.field(root, 'title', L('k97'), { value: model.title, maxLength: model.titleMaxLength });
    ctx.field(root, 'description', L('k98'), { value: model.description, multiline: true });
    ctx.field(root, 'price', L('k99'), { value: model.price, inputmode: 'decimal', unit: model.unit || L('k100') });
    if (model.images && model.images.length) ctx.media(root, model.images, 'contain', true);
    ctx.attachments(root, false);
    var actions = node('div', 'm-product__actions m-btn-group m-btn-group--pair');
    root.appendChild(actions);
    ['publish', 'save-draft'].forEach(function (id) {
      if ((model.permissions || []).indexOf(id) >= 0) {
        ctx.button(actions, id, id === 'publish' ? L('k101') : L('k102'),
          function () { return ctx.fieldsPayload(id === 'publish' ? (model.requiredFields || []) : []); },
          {
            confirm: id === 'publish', primary: id === 'publish',
            description: function (data) { return L('k103') + data.title + L('k104') + data.price + ' ' + (model.unit || L('k105')) + '.'; }
          });
      }
    });
    if (actions.children.length < 2) actions.classList.remove('m-btn-group--pair');
    return;
  }

  if (model.price !== null && model.price !== undefined) {
    var price = node('p', 'm-product__value');
    var number = node('bdi', '', model.price);
    number.dir = 'ltr';
    price.append(number, document.createTextNode(' ' + (model.unit || L('k105'))));
    head.appendChild(price);
  }
  if (model.sellerLabel) head.appendChild(node('p', 'm-product__secondary', model.sellerLabel));
  if (model.statusLabel) head.appendChild(node('span', 'm-badge m-badge--info', model.statusLabel));
  ctx.media(root, model.images, model.fit);
  if (model.reason) ctx.note(root, L('k106'), model.reason, 'warning');
  var cardActions = node('div', 'm-product__actions');
  root.appendChild(cardActions);
  [{ id: 'edit', label: L('k107') }, { id: 'report', label: L('k108') }].forEach(function (action) {
    if ((model.permissions || []).indexOf(action.id) >= 0) {
      ctx.button(cardActions, action.id, action.label, { listingId: model.id, revision: model.revision }, { confirm: action.confirm, description: L('k109') });
    }
  });
}

register(type, render);
