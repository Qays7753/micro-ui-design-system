(() => {
  (function() {
    "use strict";
    var MICRO_LABELS_FAMILY = "navigation";
    function L(key) {
      var family = window.MicroLabels && window.MicroLabels[MICRO_LABELS_FAMILY];
      return family ? family[key] : void 0;
    }
    function microAutoInit() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false);
    }
    var states = /* @__PURE__ */ new WeakMap();
    function sheets(root) {
      var scope = root || document;
      var all = [].slice.call(scope.querySelectorAll(".m-action-sheet"));
      if (scope.matches && scope.matches(".m-action-sheet")) all.unshift(scope);
      return all;
    }
    function backdrop(sheet) {
      var id = sheet.getAttribute("data-backdrop-id");
      return id ? document.getElementById(id) : null;
    }
    function initOne(sheet) {
      if (states.has(sheet)) return states.get(sheet);
      if (!window.MicroNavigation || sheet.tagName !== "DIV" || !sheet.classList.contains("m-layer")) return null;
      var state = { lifetime: new AbortController(), contextKey: null, pending: null };
      states.set(sheet, state);
      var options = { signal: state.lifetime.signal };
      function deliver(pending) {
        if (states.get(sheet) !== state || state.pending !== pending || !pending.accepted || !pending.closed || pending.queued) return;
        pending.queued = true;
        queueMicrotask(function() {
          if (states.get(sheet) !== state || state.pending !== pending) return;
          state.pending = null;
          sheet.dispatchEvent(new CustomEvent("micro-actions:request", {
            bubbles: true,
            detail: { id: pending.id, contextKey: pending.contextKey }
          }));
        });
      }
      sheet.addEventListener("micro-navigation:opened", function(event) {
        if (event.target === sheet) state.pending = null;
      }, options);
      sheet.addEventListener("micro-navigation:closed", function(event) {
        if (event.target !== sheet || !state.pending) return;
        state.pending.closed = true;
        deliver(state.pending);
      }, options);
      sheet.addEventListener("click", function(event) {
        var button = event.target.closest ? event.target.closest("button[data-action-id]") : null;
        if (!button || button.closest(".m-action-sheet") !== sheet || state.pending || button.disabled || button.getAttribute("aria-disabled") === "true" || button.closest("[hidden], [inert]") || !button.getClientRects().length) return;
        var id = button.getAttribute("data-action-id");
        if (!id || !id.trim()) return;
        var pending = { id, contextKey: state.contextKey, accepted: false, closed: false };
        state.pending = pending;
        pending.accepted = window.MicroNavigation.requestClose(sheet, { reason: "programmatic-request", trigger: button });
        if (!pending.accepted) {
          if (state.pending === pending) state.pending = null;
          return;
        }
        deliver(pending);
      }, options);
      window.MicroNavigation.init(sheet);
      var bd = backdrop(sheet);
      if (bd) window.MicroNavigation.init(bd);
      return state;
    }
    window.MicroActionSheet = {
      init: function(root) {
        sheets(root).forEach(initOne);
      },
      open: function(sheet, options) {
        if (!sheet || sheet.nodeType !== 1 || !document.contains(sheet) || !sheet.matches(".m-layer.m-action-sheet")) return false;
        var state = initOne(sheet);
        if (!state) return false;
        options = options || {};
        state.pending = null;
        state.contextKey = typeof options.contextKey === "string" ? options.contextKey : null;
        window.MicroNavigation.openLayer(sheet, { trigger: options.trigger, backdropEl: backdrop(sheet) });
        return true;
      },
      close: function(sheet) {
        if (states.has(sheet)) window.MicroNavigation.closeLayer(sheet);
      },
      disconnect: function(root) {
        sheets(root).forEach(function(sheet) {
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
    window.MicroActionSheet.setLabels = function(partial) {
      var registry = window.MicroLabels = window.MicroLabels || {};
      var current = registry["navigation"] = registry["navigation"] || {};
      var key;
      for (key in partial) {
        if (partial[key] && Object.prototype.toString.call(partial[key]) === "[object Object]") {
          current[key] = current[key] || {};
          var sub;
          for (sub in partial[key]) current[key][sub] = partial[key][sub];
        } else {
          current[key] = partial[key];
        }
      }
    };
    document.addEventListener("DOMContentLoaded", function() {
      if (microAutoInit()) window.MicroActionSheet.init();
    });
    if (document.readyState !== "loading" && microAutoInit()) window.MicroActionSheet.init();
  })();
})();
