/* Shared UI-only context, request lifetime and confirmation. No transport/storage/AI.
   الجولة الثانية R2 (F10): وحدة ES modules مقروءة — سطر لكل تعليمة، بلا
   غلاف IIFE ولا تهيئة تلقائية (R-D2/R-D3). العقود كما هي دون تغيير سلوك. */
import { globalApi } from '../../shared/integrations.js';
import { currentInstanceLabels, instanceLabelFor, withLabels as withFamilyLabels, instanceLabelsOf, getLabel, registerLabels, setInstanceLabels, setLabels as setFamilyLabels } from '../../shared/labels.js';
import { defaults as familyDefaults } from './labels.js';
import { pulse } from '../../shared/haptics.js';

registerLabels('product-context', familyDefaults);

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

var renderers = new Map();
var instances = new WeakMap();
var sequence = 0;

var phases = {
  ready: '', loading: L('phase.loading'), empty: L('phase.empty'), success: L('phase.success'),
  error: L('phase.error'), rejected: L('phase.rejected'), disabled: L('phase.disabled'),
  pending: L('phase.pending'), uncertain: L('phase.uncertain'),
  denied: L('phase.denied'), expired: L('phase.expired'), 'signed-out': L('phase.signedOut'),
  conflict: L('phase.conflict')
};

function key(scope) {
  return scope && typeof scope.contextId === 'string' && scope.contextId && typeof scope.roleId === 'string' && scope.roleId && (scope.workspaceId == null || (typeof scope.workspaceId === 'string' && scope.workspaceId))
    ? JSON.stringify([scope.contextId, scope.workspaceId || null, scope.roleId, scope.kind || 'business']) : null;
}

function copy(value) { return structuredClone(value); }

function draftOwner(value) {
  return value ? JSON.stringify([value.mode || null, value.id == null ? null : value.id, value.draftKey || null]) : null;
}

function visibilityRevoked(before, after) {
  return !!before && ['addresses','contact','evidence'].some(function (name) {
    return before.visibility && before.visibility[name] === true && !(after.visibility && after.visibility[name] === true);
  });
}

function node(tag, cls, text) {
  var el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text !== undefined && text !== null) el.textContent = String(text);
  return el;
}

function note(parent, title, body, tone) {
  var el = node('section', 'm-note m-note--' + (tone || 'info'));
  el.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  var text = node('div', 'm-note__text');
  text.appendChild(node('strong', 'm-note__title', title));
  if (body) text.appendChild(node('p', 'm-note__body', body));
  el.appendChild(text);
  parent.appendChild(el);
  return el;
}

function safeImage(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    var url = new URL(String(value), document.baseURI);
    return ['http:', 'https:', 'blob:'].indexOf(url.protocol) >= 0 || /^data:image\/(png|jpeg|webp|gif);/i.test(url.href) ? url.href : null;
  } catch (_) { return null; }
}

export function register(type, renderer) {
  if (renderers.has(type)) throw new Error('Duplicate composition');
  renderers.set(type, renderer);
}

export function contextKey(scope) {
  return key(scope);
}

function mount(root, type, value) {
  if (!root || root.nodeType !== 1 || !renderers.has(type)) throw new TypeError('Unknown product composition or invalid root');
  if (instances.has(root)) {
    var old = instances.get(root);
    if (old.type !== type) throw new TypeError('One DOM owner per root');
    return old.api;
  }
  var model, epoch = 0, requestNumber = 0, pending = null, destroyed = false;
  var rendererLife, cleanups = [], confirmation = null, suppressFocus = false;
  var ui = { draft: Object.create(null), files: [], urls: [], presentation: Object.create(null), presentationGeneration: 0 };
  var instanceId = 'micro-product-' + (++sequence);
  var forbidden = ['denied', 'expired', 'signed-out'];

  function disposeConfirmation() {
    if (!confirmation) return;
    var current = confirmation;
    confirmation = null;
    current.life.abort();
    globalApi('ActionSheet').disconnect(current.sheet);
    current.sheet.remove();
    current.backdrop.remove();
  }

  function releaseFiles() {
    ui.urls.forEach(function (url) { URL.revokeObjectURL(url); });
    ui.urls = [];
    ui.files = [];
  }

  function stopRender() {
    if (rendererLife) rendererLife.abort();
    cleanups.splice(0).forEach(function (fn) { fn(); });
  }

  function permission(id) {
    return Array.isArray(model.permissions) && model.permissions.indexOf(id) >= 0;
  }

  function allowed(id, local) {
    if (destroyed || pending || !permission(id)) return false;
    if (forbidden.indexOf(model.phase) >= 0) {
      return model.connection === 'online' && (id === 'reauth' || (model.phase === 'denied' && id === 'choose-context'));
    }
    if (!key(model.scope)) return false;
    if (model.scope.kind === 'driver' && (type === 'market' || type === 'manage' || (type === 'review' && model.mode !== 'report') || (type !== 'context' && ['manage', 'market'].indexOf(model.destination) >= 0))) return false;
    if (['loading', 'pending', 'disabled'].indexOf(model.phase) >= 0) return false;
    if (['uncertain', 'conflict'].indexOf(model.phase) >= 0 && ['recheck', 'reauth'].indexOf(id) < 0) return false;
    if (['offline', 'weak', 'local'].indexOf(model.connection) >= 0) {
      return !!local && model.destination === 'manage' && model.scope.kind !== 'driver';
    }
    return true;
  }

  function dispatch(id, payload, local) {
    if (!allowed(id, local)) return false;
    var token = { instanceId: instanceId, generation: epoch, requestId: instanceId + '-' + (++requestNumber), contextKey: key(model.scope) };
    pending = { token: token, action: id, payload: copy(payload || {}) };
    var detail = { type: type, action: id, scope: copy(model.scope || null), request: copy(token), payload: copy(payload || {}) };
    render();
    root.dispatchEvent(new CustomEvent('micro-product:intent', { bubbles: true, detail: detail }));
    return true;
  }

  function confirm(id, payload, label, description, local, danger) {
    if (!allowed(id, local) || confirmation) return;
    if (!globalApi('ActionSheet')) { note(root, L('confirm.missingComponent', root), '', 'error'); return; }
    var generation = epoch, context = key(model.scope), trigger = document.activeElement;
    var sheet = node('div', 'm-layer m-action-sheet'), backdrop = node('div', 'm-layer-backdrop'), life = new AbortController();
    sheet.id = instanceId + '-confirmation';
    backdrop.id = sheet.id + '-backdrop';
    backdrop.dataset.for = sheet.id;
    sheet.dataset.backdropId = backdrop.id;
    sheet.dataset.backdrop = 'keep';
    sheet.hidden = backdrop.hidden = true;
    sheet.setAttribute('role', 'alertdialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-labelledby', sheet.id + '-title');
    sheet.setAttribute('aria-describedby', sheet.id + '-description');
    var head = node('header', 'm-layer__head'), title = node('h2', 'm-layer__title', L('confirm.title', head));
    title.id = sheet.id + '-title';
    head.appendChild(title);
    var cancel = node('button', 'm-btn m-btn--secondary', L('confirm.cancel'));
    cancel.type = 'button';
    cancel.dataset.layerClose = '';
    head.appendChild(cancel);
    sheet.appendChild(head);
    var body = node('div', 'm-layer__body'), desc = node('p', '', description || label);
    desc.id = sheet.id + '-description';
    body.appendChild(desc);
    body.appendChild(node('p', 'm-product__secondary', model.scope.label || model.scope.contextId));
    var list = node('ul', 'm-action-sheet__list'), item = node('li');
    var button = node('button', 'm-btn ' + (danger ? 'm-btn--destructive-soft' : 'm-btn--primary') + ' m-action-sheet__item', label || L('confirm.ok', label));
    button.type = 'button';
    button.dataset.actionId = 'confirm';
    item.appendChild(button);
    list.appendChild(item);
    body.appendChild(list);
    sheet.appendChild(body);
    document.body.append(backdrop, sheet);
    confirmation = { sheet: sheet, backdrop: backdrop, life: life };
    globalApi('ActionSheet').init(sheet);
    sheet.addEventListener('micro-actions:request', function () {
      if (destroyed || generation !== epoch || context !== key(model.scope)) return;
      disposeConfirmation();
      pulse('confirm'); /* N-D7: نبضة تأكيد الفعل الحساس — معطلة افتراضيًا */
      dispatch(id, payload, local);
    }, { signal: life.signal });
    sheet.addEventListener('micro-navigation:closed', function (event) {
      if (event.target === sheet) setTimeout(function () { if (confirmation && confirmation.sheet === sheet) disposeConfirmation(); }, 0);
    }, { signal: life.signal });
    globalApi('ActionSheet').open(sheet, { trigger: trigger, contextKey: context });
  }

  function render() {
    var active = root.contains(document.activeElement) ? document.activeElement : null;
    var focusKey = !suppressFocus && active && active.getAttribute('data-focus-key');
    var selection = active && typeof active.selectionStart === 'number' ? [active.selectionStart, active.selectionEnd] : null;
    stopRender();
    rendererLife = new AbortController();
    root.replaceChildren();
    root.classList.add('m-product');
    root.setAttribute('data-product-type', type);
    if (type === 'assistant') root.dataset.conversationLayout = model.conversationLayout === 'fill' ? 'fill' : 'embedded';
    root.setAttribute('aria-busy', String(!!pending || ['loading', 'pending'].indexOf(model.phase) >= 0));
    if (!root.hasAttribute('tabindex')) root.tabIndex = -1;
    var scopeKey = key(model.scope);
    var ctx = {
      root: root, model: model, ui: ui, node: node, note: note, key: key, uid: instanceId,
      /* المرحلة 8 — معلومات عرض إضافية للتراكيب الجديدة: رابط صورة
         مفحوص (نفس قاعدة media) وفعل الطلب المعلق إن وُجد (لعرض حالة
         تحميل على زره)؛ إضافات فقط لا تغير سلوك أي renderer قائم. */
      safeImage: safeImage, pending: pending ? pending.action : null,
      on: function (el, event, fn) { el.addEventListener(event, fn, { signal: rendererLife.signal }); },
      cleanup: function (fn) { cleanups.push(fn); }, can: allowed,
      editable: function () {
        return !pending && permission('compose') && forbidden.indexOf(model.phase) < 0 && ['disabled', 'loading', 'pending'].indexOf(model.phase) < 0;
      },
      request: dispatch,
      button: function (parent, id, label, payload, options) {
        options = options || {};
        var b = node('button', 'm-btn ' + (options.danger ? 'm-btn--destructive-soft' : options.primary ? 'm-btn--primary' : 'm-btn--secondary'), label);
        b.type = 'button';
        b.dataset.productAction = id;
        b.dataset.focusKey = options.focusKey || 'action-' + id;
        b.disabled = !!options.disabled || !allowed(id, options.local);
        parent.appendChild(b);
        ctx.on(b, 'click', function () {
          if (!root.contains(b) || b.disabled || !allowed(id, options.local)) return;
          var data = typeof payload === 'function' ? payload() : payload;
          if (data === false) return;
          if (options.confirm || options.danger) {
            confirm(id, data, label, typeof options.description === 'function' ? options.description(data) : options.description, options.local, options.danger);
          } else {
            dispatch(id, data, options.local);
          }
        });
        return b;
      },
      field: function (parent, name, label, options) {
        options = options || {};
        var box = node('div', 'm-field'), lab = node('label', 'm-field__label', label), wrap = node('div', 'm-field__control');
        box.dataset.microField = '';
        var input = node(options.multiline ? 'textarea' : options.options ? 'select' : 'input', options.multiline ? 'm-field__area' : 'm-field__input');
        input.id = instanceId + '-' + name;
        input.dataset.focusKey = 'field-' + name;
        lab.htmlFor = input.id;
        if (options.options) {
          options.options.forEach(function (x) { var opt = node('option', '', x.label); opt.value = x.id; input.appendChild(opt); });
        } else if (options.multiline) {
          input.rows = options.rows || 3;
        } else {
          input.type = options.type || 'text';
          if (options.inputmode) {
            input.inputMode = options.inputmode;
            if (['decimal', 'numeric'].indexOf(options.inputmode) >= 0) { input.classList.add('m-field__input--num'); input.dir = 'ltr'; }
          }
        }
        if (ui.draft[name] === undefined) ui.draft[name] = options.value == null ? '' : String(options.value);
        input.value = ui.draft[name];
        input.disabled = !ctx.editable();
        if (options.maxLength) input.maxLength = options.maxLength;
        if (options.enterKeyHint) input.setAttribute('enterkeyhint', options.enterKeyHint);
        ctx.on(input, options.options ? 'change' : 'input', function () {
          ui.draft[name] = input.value;
          box.querySelectorAll('[data-product-field-error]').forEach(function (e) { e.remove(); });
          input.removeAttribute('aria-invalid');
          input.removeAttribute('aria-describedby');
          box.classList.remove('has-error');
          if (!root.querySelector('[aria-invalid="true"]')) root.querySelectorAll('[data-product-validation]').forEach(function (e) { e.remove(); });
        });
        wrap.appendChild(input);
        if (options.unit) wrap.appendChild(node('span', 'm-field__unit', options.unit));
        box.append(lab, wrap);
        parent.appendChild(box);
        return input;
      },
      fieldsPayload: function (required) {
        var data = copy(ui.draft), missing = (required || []).filter(function (name) { return !String(data[name] || '').trim(); });
        root.querySelectorAll('[data-product-validation],[data-product-field-error]').forEach(function (e) { e.remove(); });
        root.querySelectorAll('[data-focus-key^="field-"][aria-invalid="true"]').forEach(function (el) {
          el.removeAttribute('aria-invalid');
          el.removeAttribute('aria-describedby');
          el.closest('.m-field').classList.remove('has-error');
        });
        if (missing.length) {
          var error = note(root, L('form.requiredFields', root), '', 'error');
          error.dataset.productValidation = '';
          error.id = instanceId + '-validation';
          var heading = root.querySelector(':scope > header,:scope > h2');
          if (heading) heading.after(error); else root.prepend(error);
          var first = null;
          root.querySelectorAll('[data-focus-key^="field-"]').forEach(function (el) {
            if (missing.indexOf(el.dataset.focusKey.slice(6)) < 0) return;
            var box = el.closest('.m-field'), label = box.querySelector('label');
            var message = node('p', 'm-field__msg is-visible', L('form.missingFieldPrefix', label) + (label ? label.textContent : L('form.missingFieldFallback', label)));
            message.id = el.id + '-required';
            message.dataset.productFieldError = '';
            box.appendChild(message);
            el.setAttribute('aria-invalid', 'true');
            el.setAttribute('aria-describedby', message.id);
            box.classList.add('has-error');
            if (!first) first = el;
          });
          if (first) first.focus();
          return false;
        }
        data.files = ui.files.slice();
        return data;
      },
      media: function (parent, images, fit, preview) {
        if (!images || !images.length) { parent.appendChild(node('div', 'm-product__media-empty', L('media.unavailable', parent))); return; }
        var carousel = node('div', 'm-carousel m-product__gallery');
        carousel.classList.toggle('m-product__gallery--preview', !!preview);
        carousel.dataset.carousel = '';
        carousel.dataset.carouselLabel = L('media.carouselLabel', carousel);
        carousel.setAttribute('role', 'group');
        carousel.setAttribute('aria-label', L('media.carouselLabel', carousel));
        var viewport = node('div', 'm-carousel__viewport');
        viewport.dataset.viewport = '';
        var track = node('ul', 'm-carousel__track');
        track.dataset.track = '';
        images.forEach(function (image, index) {
          var li = node('li', 'm-carousel__slide'), card = node('div', 'm-carousel__card'), src = safeImage(image.src);
          li.dataset.carouselSlide = '';
          li.dataset.cardLabel = image.alt || L('media.cardLabelPrefix', li) + (index + 1);
          if (src) {
            var img = node('img', 'm-product__media');
            img.src = src;
            img.alt = image.alt || L('media.imageAltFallback', img);
            img.loading = 'lazy';
            img.decoding = 'async';
            img.style.objectFit = fit === 'contain' ? 'contain' : 'cover';
            ctx.on(img, 'error', function () { img.replaceWith(node('div', 'm-product__media-empty', L('media.imageError', img))); });
            card.appendChild(img);
          } else {
            card.appendChild(node('div', 'm-product__media-empty', L('media.linkUnavailable', card)));
          }
          li.appendChild(card);
          track.appendChild(li);
        });
        viewport.appendChild(track);
        carousel.appendChild(viewport);
        if (images.length > 1) {
          var controls = node('div', 'm-product__actions');
          ['prev', 'next'].forEach(function (dir) {
            var b = node('button', 'm-btn m-btn--secondary', dir === 'prev' ? L('media.prev') : L('media.next'));
            b.type = 'button';
            b.dataset[dir] = '';
            controls.appendChild(b);
          });
          var count = node('span', 'm-product__secondary');
          count.dataset.status = '';
          controls.appendChild(count);
          carousel.appendChild(controls);
        }
        parent.appendChild(carousel);
        if (globalApi('Carousel')) {
          globalApi('Carousel').init(carousel);
          ctx.cleanup(function () { globalApi('Carousel').destroy(carousel); });
        }
      },
      attachments: function (parent, required) {
        var field = node('div', 'm-field'), lab = node('span', 'm-field__label', L('attachments.label', field));
        var input = node('input', 'm-product__file');
        var choose = node('button', 'm-btn m-btn--secondary', model.attachmentSelection === 'append' ? L('attachments.addMore') : ui.files.length ? L('attachments.replaceSelection') : L('attachments.choose'));
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.id = instanceId + '-files';
        input.hidden = true;
        input.tabIndex = -1;
        input.disabled = !ctx.editable();
        choose.type = 'button';
        choose.disabled = !ctx.editable();
        choose.dataset.focusKey = 'choose-files';
        ctx.on(choose, 'click', function () { if (ctx.editable()) input.click(); });
        field.append(lab, input, choose);
        parent.appendChild(field);
        ctx.on(input, 'change', function () {
          var files = Array.from(input.files || []);
          if (files.some(function (f) { return !f.type.startsWith('image/') || (model.maxImageBytes && f.size > model.maxImageBytes); })) {
            note(parent, L('attachments.fileError', parent), L('attachments.fileErrorDetail', parent), 'error');
            return;
          }
          var selection = model.attachmentSelection === 'append' ? ui.files.concat(files) : files;
          releaseFiles();
          ui.files = selection;
          ui.urls = selection.map(function (f) { return URL.createObjectURL(f); });
          render();
        });
        if (ui.files.length) {
          var names = node('ul', 'm-product__filenames');
          ui.files.forEach(function (f, index) {
            var item = node('li');
            item.appendChild(node('bdi', '', f.name));
            if (ui.files.length > 1) {
              var remove = node('button', 'm-btn m-btn--light', L('attachments.remove', remove));
              remove.type = 'button';
              remove.disabled = !ctx.editable();
              remove.setAttribute('aria-label', L('attachments.removeAriaPrefix', remove) + f.name);
              remove.dataset.focusKey = 'remove-file-' + index;
              ctx.on(remove, 'click', function () {
                if (!ctx.editable()) return;
                URL.revokeObjectURL(ui.urls[index]);
                ui.urls.splice(index, 1);
                ui.files.splice(index, 1);
                remove.dataset.focusKey = 'choose-files';
                render();
              });
              item.appendChild(remove);
            }
            names.appendChild(item);
          });
          field.appendChild(names);
          ctx.media(parent, ui.files.map(function (f, i) { return { src: ui.urls[i], alt: f.name }; }), 'contain', true);
          var clear = node('button', 'm-btn m-btn--light', L('attachments.removeAll'));
          clear.type = 'button';
          clear.disabled = !ctx.editable();
          ctx.on(clear, 'click', function () { releaseFiles(); render(); });
          parent.appendChild(clear);
        }
        if (required) parent.appendChild(node('p', 'm-product__secondary', L('attachments.requiredNotice', parent)));
      },
      timeline: function (parent, items) {
        var list = node('ol', 'm-product__timeline');
        (items || []).forEach(function (item) {
          var row = node('li');
          if (item.current) row.setAttribute('aria-current', 'step');
          row.appendChild(node('strong', '', item.label));
          if (item.time) row.appendChild(node('bdi', 'm-product__secondary', item.time));
          if (item.detail) row.appendChild(node('p', 'm-product__secondary', item.detail));
          list.appendChild(row);
        });
        parent.appendChild(list);
      }
    };
    var phase = Object.prototype.hasOwnProperty.call(phases, model.phase) ? model.phase : 'uncertain';
    if (forbidden.indexOf(phase) >= 0) {
      note(root, phases[phase], L('shell.previousContextHidden', root), 'warning');
      if (permission('reauth')) ctx.button(root, 'reauth', L('shell.reauth', root), {});
      if (phase === 'denied' && permission('choose-context')) ctx.button(root, 'choose-context', L('shell.chooseContext', root), {});
    }
    else if (!scopeKey) { note(root, L('shell.noScopeTitle', root), L('shell.noScopeDetail', root), 'warning'); }
    else if (model.scope.kind === 'driver' && (type === 'market' || type === 'manage' || (type === 'review' && model.mode !== 'report') || (type !== 'context' && ['manage', 'market'].indexOf(model.destination) >= 0))) { note(root, L('shell.driverScopeTitle', root), L('shell.driverScopeDetail', root), 'warning'); }
    else if (!permission('view') || (type !== 'context' && type !== 'state' && key(model.dataContext) !== scopeKey)) { note(root, L('shell.noPermission', root), '', 'warning'); }
    else {
      if (['offline', 'weak', 'local'].indexOf(model.connection) >= 0) {
        note(root, model.connection === 'offline' ? L('connection.offline', root) : model.connection === 'local' ? L('connection.local', root) : L('connection.weak', root), model.destination === 'manage' ? L('connection.manageNotice', root) : L('connection.genericNotice', root), 'warning');
      }
      if (pending) {
        note(root, phases.pending, '', 'info');
      } else if (phase !== 'ready') {
        note(root, phases[phase], model.phaseDetail || '', phase === 'error' ? 'error' : phase === 'success' ? 'success' : 'info');
      }
      /* المرحلة 8: manage يُعرض في empty مثل assistant — نموذج الإدخال
         هو غرض التركيب ولا معنى لإخفائه حين لا عمليات بعد. */
      if (phase !== 'loading' && (phase !== 'empty' || type === 'assistant' || type === 'manage')) renderers.get(type)(ctx);
      else if (phase === 'empty' && model.emptyActionLabel) ctx.button(root, 'create', model.emptyActionLabel, {});
      if (['uncertain', 'conflict'].indexOf(phase) >= 0 && permission('recheck') && !root.querySelector('[data-product-action="recheck"]')) ctx.button(root, 'recheck', L('stateCard.recheck', root), {});
    }
    if (globalApi('Fields')) {
      globalApi('Fields').init(root);
      cleanups.push(function () { globalApi('Fields').disconnect(root); });
    }
    if (suppressFocus && active) {
      root.focus({ preventScroll: true });
    } else if (focusKey) {
      var found = Array.from(root.querySelectorAll('[data-focus-key]')).find(function (el) { return el.dataset.focusKey === focusKey && !el.disabled; });
      if (found) {
        found.focus({ preventScroll: true });
        if (selection && found.setSelectionRange) try { found.setSelectionRange(selection[0], selection[1]); } catch (_) { }
      } else root.focus({ preventScroll: true });
    }
    suppressFocus = false;
  }

  function replace(next) {
    if (destroyed) return false;
    var previous = model && key(model.scope);
    var nextModel = copy(next || {});
    nextModel.phase = nextModel.phase || 'ready';
    if (!Object.prototype.hasOwnProperty.call(phases, nextModel.phase)) nextModel.phase = 'uncertain';
    nextModel.connection = nextModel.connection || 'online';
    if (['online', 'offline', 'weak', 'local'].indexOf(nextModel.connection) < 0) nextModel.connection = 'offline';
    var purge = previous !== key(nextModel.scope) || draftOwner(model) !== draftOwner(nextModel) || visibilityRevoked(model, nextModel) || forbidden.indexOf(nextModel.phase) >= 0 || nextModel.clearDraft === true || !Array.isArray(nextModel.permissions) || nextModel.permissions.indexOf('view') < 0;
    disposeConfirmation();
    epoch++;
    pending = null;
    if (purge) {
      ui.presentation = Object.create(null);
      ui.presentationGeneration++;
      releaseFiles();
      ui.draft = Object.create(null);
      suppressFocus = true;
    }
    model = nextModel;
    render();
    return true;
  }

  var api = {
    root: root,
    replace: replace,
    /* العقد الموحد (الجولة الثانية R4): update(model) = replace نفسها —
       استبدال النموذج وإعادة التصيير بلا إعادة تركيب. */
    update: replace,
    resolve: function (token, next) {
      if (destroyed || !pending || !token || ['instanceId', 'generation', 'requestId', 'contextKey'].some(function (k) { return pending.token[k] !== token[k]; })) return false;
      var nextKey = key(next && next.scope);
      if (nextKey !== key(model.scope) && !(pending.action === 'switch-context' && nextKey && nextKey === key(pending.payload.targetScope))) return false;
      return replace(next);
    },
    getState: function () {
      return destroyed ? null : { scope: copy(model.scope || null), phase: model.phase, pending: pending ? copy(pending.token) : null };
    },
    destroy: function () {
      if (destroyed) return;
      destroyed = true;
      epoch++;
      pending = null;
      ui.presentation = Object.create(null);
      ui.presentationGeneration++;
      disposeConfirmation();
      stopRender();
      releaseFiles();
      ui.draft = Object.create(null);
      root.replaceChildren();
      root.removeAttribute('aria-busy');
      root.removeAttribute('data-product-type');
      root.removeAttribute('data-conversation-layout');
      instances.delete(root);
    }
  };
  instances.set(root, { type: type, api: api });
  replace(value);
  return api;
}

export { mount };

/* العقد الموحد (الجولة الثانية R4): init(root, model) يختار الـrenderer
   من model.type ويفوّض إلى mount نفسها (العقد القائم بلا تغيير)؛
   instance.update(model) = replace. getInstance/destroy وحدويان مريحان. */
export function init(root, model) {
  var type = model && model.type;
  /* R5 — model.labels طبقة نصوص لهذا التركيب فقط */
  applyInstanceLabels(root, model);
  return withLabels(root, function () { return mount(root, type, model); });
}

export function getInstance(root) {
  var entry = root && instances.get(root);
  return entry ? entry.api : null;
}

export function destroy(root) {
  var entry = root && instances.get(root);
  if (entry) entry.api.destroy();
}

/* المرحلة 7 / الجولة الثانية R2 — تخصيص نصوص العائلة: دمج جزئي فوق
   الافتراضي في سجل النصوص المشترك (shared/labels.js)؛ يسري على
   التصييرات اللاحقة. */
export function setLabels(partial) {
  setFamilyLabels('product-context', partial);
}
