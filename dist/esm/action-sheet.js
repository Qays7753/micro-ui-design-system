import {
  defaults
} from "./chunk-FCCCRYMA.js";
import {
  globalApi
} from "./chunk-N2NZHAOZ.js";
import {
  registerLabels,
  setInstanceLabels,
  setLabels,
  withLabels
} from "./chunk-S44UNZ6A.js";
import {
  instanceRegistry
} from "./chunk-FKZJV23C.js";

// components/navigation/action-sheet.js
registerLabels("navigation", defaults);
var MICRO_LABELS_FAMILY = "navigation";
function withLabels2(scope, fn) {
  return withLabels(scope, MICRO_LABELS_FAMILY, fn);
}
function applyInstanceLabels(scope, options) {
  if (options && options.labels && typeof options.labels === "object") {
    setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
  }
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
  if (!globalApi("Navigation") || sheet.tagName !== "DIV" || !sheet.classList.contains("m-layer")) return null;
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
    pending.accepted = globalApi("Navigation").requestClose(sheet, { reason: "programmatic-request", trigger: button });
    if (!pending.accepted) {
      if (state.pending === pending) state.pending = null;
      return;
    }
    deliver(pending);
  }, options);
  globalApi("Navigation").init(sheet);
  var bd = backdrop(sheet);
  if (bd) globalApi("Navigation").init(bd);
  return state;
}
var registry = instanceRegistry();
function init(root, options) {
  var scope = root || document;
  applyInstanceLabels(scope, options);
  var existing = registry.get(scope);
  if (existing) {
    withLabels2(scope, function() {
      sheets(scope).forEach(initOne);
    });
    return existing;
  }
  var destroyed = false;
  var instance = {
    root: scope,
    /** يعيد ربط أوراق الأفعال الجديدة تحت الجذر. */
    update: function() {
      withLabels2(scope, function() {
        sheets(scope).forEach(initOne);
      });
    },
    /** يفك كل ورقة تحت الجذر (ومستمعات Navigation التابعة لها). */
    destroy: function() {
      if (destroyed) return;
      destroyed = true;
      teardown(scope);
      registry.remove(scope);
    }
  };
  withLabels2(scope, function() {
    sheets(scope).forEach(initOne);
  });
  registry.set(scope, instance);
  return instance;
}
function getInstance(root) {
  return registry.get(root);
}
function destroy(root) {
  var instance = registry.get(root);
  if (instance) instance.destroy();
  else teardown(root || document);
}
function open(sheet, options) {
  if (!sheet || sheet.nodeType !== 1 || !document.contains(sheet) || !sheet.matches(".m-layer.m-action-sheet")) return false;
  var state = initOne(sheet);
  if (!state) return false;
  options = options || {};
  state.pending = null;
  state.contextKey = typeof options.contextKey === "string" ? options.contextKey : null;
  globalApi("Navigation").openLayer(sheet, { trigger: options.trigger, backdropEl: backdrop(sheet) });
  return true;
}
function close(sheet) {
  if (states.has(sheet)) globalApi("Navigation").closeLayer(sheet);
}
function teardown(root) {
  sheets(root).forEach(function(sheet) {
    var state = states.get(sheet);
    if (!state) return;
    state.pending = null;
    state.lifetime.abort();
    states.delete(sheet);
    var nav = globalApi("Navigation");
    if (nav) nav.disconnect(sheet);
    var bd = backdrop(sheet);
    if (bd && nav) nav.disconnect(bd);
  });
}
function setLabels2(partial) {
  setLabels("navigation", partial);
}
export {
  close,
  destroy,
  getInstance,
  init,
  open,
  setLabels2 as setLabels
};
