/* C05: mobile command list. Navigation owns modal/focus/inert/scroll/motion. */
(function () {
  'use strict';
  var states = new WeakMap();
  function sheets(root) {
    var scope = root || document;
    var all = [].slice.call(scope.querySelectorAll('.m-action-sheet'));
    if (scope.matches && scope.matches('.m-action-sheet')) all.unshift(scope);
    return all;
  }
  function backdrop(sheet) {
    var id = sheet.getAttribute('data-backdrop-id');
    return id ? document.getElementById(id) : null;
  }
  function initOne(sheet) {
    if (states.has(sheet)) return states.get(sheet);
    if (!window.MicroNavigation || sheet.tagName !== 'DIV' || !sheet.classList.contains('m-layer')) return null;
    var state = { lifetime: new AbortController(), contextKey: null, pending: null };
    states.set(sheet, state);
    var options = { signal: state.lifetime.signal };
    function deliver(pending) {
      if (states.get(sheet) !== state || state.pending !== pending || !pending.accepted || !pending.closed || pending.queued) return;
      pending.queued = true;
      // Let every closed listener finish before the consumer can open a successor.
      queueMicrotask(function () {
        if (states.get(sheet) !== state || state.pending !== pending) return;
        state.pending = null;
        sheet.dispatchEvent(new CustomEvent('micro-actions:request', {
          bubbles: true, detail: { id: pending.id, contextKey: pending.contextKey }
        }));
      });
    }
    sheet.addEventListener('micro-navigation:opened', function (event) {
      if (event.target === sheet) state.pending = null;
    }, options);
    sheet.addEventListener('micro-navigation:closed', function (event) {
      if (event.target !== sheet || !state.pending) return;
      state.pending.closed = true;
      deliver(state.pending);
    }, options);
    sheet.addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('button[data-action-id]') : null;
      if (!button || button.closest('.m-action-sheet') !== sheet || state.pending ||
          button.disabled || button.getAttribute('aria-disabled') === 'true' ||
          button.closest('[hidden], [inert]') || !button.getClientRects().length) return;
      var id = button.getAttribute('data-action-id');
      if (!id || !id.trim()) return;
      var pending = { id: id, contextKey: state.contextKey, accepted: false, closed: false };
      state.pending = pending;
      pending.accepted = window.MicroNavigation.requestClose(sheet, { reason: 'programmatic-request', trigger: button });
      if (!pending.accepted) {
        if (state.pending === pending) state.pending = null;
        return;
      }
      deliver(pending); /* reduced motion may finish before requestClose returns */
    }, options);
    window.MicroNavigation.init(sheet);
    var bd = backdrop(sheet);
    if (bd) window.MicroNavigation.init(bd);
    return state;
  }
  window.MicroActionSheet = {
    init: function (root) { sheets(root).forEach(initOne); },
    open: function (sheet, options) {
      if (!sheet || sheet.nodeType !== 1 || !document.contains(sheet) || !sheet.matches('.m-layer.m-action-sheet')) return false;
      var state = initOne(sheet);
      if (!state) return false;
      options = options || {};
      state.pending = null;
      state.contextKey = typeof options.contextKey === 'string' ? options.contextKey : null;
      window.MicroNavigation.openLayer(sheet, { trigger: options.trigger, backdropEl: backdrop(sheet) });
      return true;
    },
    close: function (sheet) { if (states.has(sheet)) window.MicroNavigation.closeLayer(sheet); },
    disconnect: function (root) {
      sheets(root).forEach(function (sheet) {
        var state = states.get(sheet);
        if (!state) return;
        state.pending = null;
        state.lifetime.abort();
        states.delete(sheet);
        window.MicroNavigation.disconnect(sheet);
        var bd = backdrop(sheet);
        if (bd) window.MicroNavigation.disconnect(bd);
      });
    }
  };
  document.addEventListener('DOMContentLoaded', function () { window.MicroActionSheet.init(); });
  if (document.readyState !== 'loading') window.MicroActionSheet.init();
}());
