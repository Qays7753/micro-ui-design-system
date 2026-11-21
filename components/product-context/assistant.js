/* C11 (assistant) — محادثة Ask Micro محدودة النطاق: messages/draft/retry
   وproposal بتأكيد إلزامي. لا AI أو تفسير أوامر من النص. */
import { register } from './product-core.js';
import { instanceLabelFor, instanceLabelsOf, getLabel } from '../../shared/labels.js';
import { scriptBase } from '../../shared/script-base.js';

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

/* شعار Ask Micro — مسار نسبي إلى موضع الحزمة (dist/esm|dist/iife حيث
   ../assets/brand/...)؛ كسول: لا وصول DOM في المستوى الأعلى (R-D2). */
var askSymbolUrl = null;
function askSymbol() {
  if (!askSymbolUrl) {
    askSymbolUrl = new URL('../assets/brand/micro-logo/v2/variants/full-color/micro-symbol.svg', scriptBase()).href;
  }
  return askSymbolUrl;
}

var kinds = { 'follow-up': 'follow-up', open: 'open-resource', execute: 'execute' };

function text(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export const type = 'assistant';

export function render(ctx) {
  var model = ctx.model, node = ctx.node, root = ctx.root;
  var actionStatus = 0;
  var header = node('header', 'm-product__section m-assistant__header');
  var identity = node('div', 'm-assistant__identity');
  var logo = node('img', 'm-assistant__symbol');
  logo.src = askSymbol();
  logo.alt = '';
  logo.width = 24;
  logo.height = 24;
  identity.append(logo, node('h2', 'm-product__title', 'Ask Micro'));
  header.append(identity, node('p', 'm-product__secondary', model.scope.label || model.scope.contextId));
  root.appendChild(header);

  var generation = ctx.ui.presentationGeneration, saved = ctx.ui.presentation.ask || null;
  var messages = model.phase === 'empty' ? [] : model.messages || [];
  var log = node('div', 'm-product__log');
  log.id = ctx.uid + '-log';
  log.dataset.focusKey = 'assistant-log';
  log.setAttribute('role', 'log');
  log.setAttribute('aria-label', L('assistant.logLabel', log));
  log.setAttribute('aria-relevant', 'additions text');
  log.setAttribute('aria-busy', String(!!model.replyPending));

  messages.forEach(function (message) {
    var bubble = node('article', 'm-product__message');
    var speaker = ['user', 'assistant'].indexOf(message.speaker) >= 0 ? message.speaker : 'system';
    bubble.dataset.speaker = speaker;
    if (text(message.id) && messages.filter(function (x) { return x.id === message.id; }).length === 1) bubble.dataset.messageId = message.id;
    bubble.append(
      node('strong', 'm-product__secondary', speaker === 'user' ? L('assistant.userSpeaker') : speaker === 'assistant' ? 'Ask Micro' : L('assistant.noteSpeaker')),
      node('p', '', message.text)
    );
    if (message.stateLabel) bubble.appendChild(node('p', 'm-product__secondary', message.stateLabel));
    if (message.id && (model.permissions || []).indexOf('retry') >= 0 && message.retryable) {
      ctx.button(bubble, 'retry', L('assistant.retryAction', bubble), { messageId: message.id }, { focusKey: 'retry-' + message.id });
    }
    // IDs address a host-defined action. Text never becomes code, URL or a grant.
    if (speaker === 'assistant' && text(message.id) && messages.filter(function (x) { return x.id === message.id; }).length === 1) {
      var actions = Array.isArray(message.actions) ? message.actions : [];
      var row = node('div', 'm-product__actions m-assistant__actions');
      var reasons = Object.create(null), reasonNodes = [];
      actions.forEach(function (action) {
        if (!action || !Object.prototype.hasOwnProperty.call(kinds, action.kind) || !text(action.id) || !text(action.label) || !text(action.revision) || actions.filter(function (x) { return x && x.id === action.id; }).length !== 1) return;
        if (action.kind === 'execute' && !text(action.summary)) return;
        var state = action.state === undefined ? 'ready' : action.state;
        var disabled = state !== 'ready' || !!model.replyPending;
        var id = kinds[action.kind];
        var button = ctx.button(row, id, action.label, { messageId: message.id, actionId: action.id, revision: action.revision },
          {
            confirm: action.kind === 'execute', description: action.summary,
            focusKey: 'message-action-' + message.id + '-' + action.id, disabled: disabled,
            primary: action.emphasis === 'primary' && actions.filter(function (x) { return x && x.emphasis === 'primary'; }).length === 1
          });
        if (state !== 'ready') {
          var reason = { expired: L('assistant.proposalExpired'), completed: L('assistant.proposalCompleted'), unavailable: L('assistant.proposalUnavailable') }[state] || L('assistant.proposalUnavailable');
          var status = reasons[reason];
          if (!status) {
            status = node('span', 'm-product__secondary', reason);
            status.id = ctx.uid + '-action-status-' + (++actionStatus);
            reasons[reason] = status;
            reasonNodes.push(status);
          }
          button.setAttribute('aria-describedby', status.id);
        }
      });
      reasonNodes.forEach(function (item) { row.appendChild(item); });
      if (row.children.length) bubble.appendChild(row);
    }
    log.appendChild(bubble);
  });
  if (!log.children.length) log.appendChild(node('p', 'm-product__secondary', L('assistant.emptyLog', log)));
  root.appendChild(log);

  if (model.replyPending) {
    var activity = node('div', 'm-assistant__activity');
    activity.setAttribute('role', 'status');
    var dot = node('span', 'm-assistant__activity-dot');
    dot.setAttribute('aria-hidden', 'true');
    activity.append(dot, node('span', '', model.activity === 'searching' ? L('assistant.searchingStatus', activity) : L('assistant.preparingStatus', activity)));
    root.appendChild(activity);
  }

  var last = messages[messages.length - 1];
  var lastKey = last ? String(last.id || '') + '\n' + String(last.text || '') : '';
  var unread = !!(messages.length && saved && !saved.atEnd && (saved.unread || messages.length > saved.count || (messages.length === saved.count && saved.lastKey !== lastKey)));
  var newer = node('button', 'm-btn m-btn--light m-assistant__new', L('assistant.newMessagesAction', newer));
  newer.type = 'button';
  newer.hidden = !unread;
  newer.setAttribute('aria-controls', log.id);
  root.appendChild(newer);

  function atEnd() { return log.scrollHeight - log.clientHeight - log.scrollTop < 24; }

  ctx.on(newer, 'click', function () {
    log.scrollTop = log.scrollHeight;
    unread = false;
    newer.hidden = true;
    log.focus({ preventScroll: true });
  });
  log.tabIndex = 0;
  ctx.on(log, 'scroll', function () {
    if (atEnd()) { unread = false; newer.hidden = true; }
  });

  // Backwards compatible proposal; keep it adjacent to replies, before writing.
  if (model.proposal) {
    var box = node('section', 'm-product__surface');
    box.append(node('h3', 'm-product__title', L('assistant.proposalTitle')), node('p', '', model.proposal.summary));
    ctx.button(box, 'execute', model.proposal.label || L('assistant.proposalActionFallback', box), { proposalId: model.proposal.id, revision: model.proposal.revision }, { confirm: true, description: model.proposal.summary });
    root.appendChild(box);
  }

  var composer = node('div', 'm-product__section m-assistant__composer');
  var input = ctx.field(composer, 'message', L('assistant.messageField'), { multiline: true, rows: 1 });
  ctx.button(composer, 'send', L('assistant.sendAction', composer), function () { return ctx.fieldsPayload(['message']); }, { primary: true, disabled: !!model.replyPending });
  root.appendChild(composer);

  function grow() {
    var follow = atEnd();
    input.style.blockSize = 'auto';
    input.style.blockSize = input.scrollHeight + 'px';
    if (follow) log.scrollTop = log.scrollHeight;
  }
  ctx.on(input, 'input', grow);
  grow();

  if (!saved || saved.atEnd) log.scrollTop = log.scrollHeight;
  else {
    log.scrollTop = saved.top;
    var anchor = Array.from(log.querySelectorAll('[data-message-id]')).find(function (el) { return el.dataset.messageId === saved.anchor; });
    if (anchor) log.scrollTop += anchor.getBoundingClientRect().top - log.getBoundingClientRect().top - saved.offset;
  }
  if (atEnd()) { unread = false; newer.hidden = true; }

  ctx.cleanup(function () {
    if (generation !== ctx.ui.presentationGeneration) return;
    var top = log.getBoundingClientRect().top;
    var anchor = Array.from(log.querySelectorAll('[data-message-id]')).find(function (el) { return el.getBoundingClientRect().bottom > top; });
    ctx.ui.presentation.ask = {
      top: log.scrollTop, atEnd: atEnd(), anchor: anchor ? anchor.dataset.messageId : null,
      offset: anchor ? anchor.getBoundingClientRect().top - top : 0, count: messages.length, lastKey: lastKey, unread: unread
    };
  });
}

register(type, render);
