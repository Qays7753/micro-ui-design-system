if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/navigation/action-sheet.js
  var action_sheet_exports = {};
  __export(action_sheet_exports, {
    close: () => close,
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
    open: () => open,
    setLabels: () => setLabels2
  });

  // shared/integrations.js
  function globalApi(name) {
    if (typeof globalThis === "undefined") return void 0;
    return globalThis["Micro" + name];
  }

  // shared/labels.js
  function store() {
    var root = typeof globalThis !== "undefined" ? globalThis : null;
    if (!root) return { locale: "ar-u-nu-latn", families: {} };
    if (!root.__microLabelsStore) root.__microLabelsStore = { locale: "ar-u-nu-latn", families: {} };
    return root.__microLabelsStore;
  }
  var instanceOverlays = /* @__PURE__ */ new WeakMap();
  function setInstanceLabels(root, family, labels) {
    if (!root || root.nodeType !== 1 || !labels || typeof labels !== "object") return;
    var byFamily = instanceOverlays.get(root);
    if (!byFamily) {
      byFamily = {};
      instanceOverlays.set(root, byFamily);
    }
    byFamily[family] = labels;
  }
  function instanceLabelsOf(root, family) {
    var byFamily = root && instanceOverlays.get(root);
    return byFamily && byFamily[family] || null;
  }
  var renderStack = [];
  function withLabels(root, family, fn) {
    var own = instanceLabelsOf(root, family);
    renderStack.push(own ? { family, labels: own } : null);
    try {
      return fn();
    } finally {
      renderStack.pop();
    }
  }
  function registerLabels(family, defaults2) {
    var families = store().families;
    if (!families[family]) families[family] = {};
    var current = families[family];
    for (var key in defaults2) current[key] = defaults2[key];
  }
  function setLabels(family, partial) {
    var families = store().families;
    var current = families[family] = families[family] || {};
    for (var key in partial) {
      if (partial[key] && Object.prototype.toString.call(partial[key]) === "[object Object]") {
        current[key] = current[key] || {};
        var sub;
        for (sub in partial[key]) current[key][sub] = partial[key][sub];
      } else {
        current[key] = partial[key];
      }
    }
  }

  // components/navigation/labels.js
  var defaults = {
    "layer.unnamedWarning": "[micro-navigation] طبقة مفتوحة بلا اسم متاح (عقد D-UI-02): أضف aria-label أو aria-labelledby أو عنصر .m-layer__title — الطبقة modal بلا اسم غير صالحة.",
    "layer.unusualRolePrefix": '[micro-navigation] دور غير معتاد للطبقة "',
    "layer.unusualRoleSuffix": '" — عقد الطبقات: dialog/alertdialog (D-UI-02).',
    "filters.count.one": "فلتر واحد",
    "filters.count.two": "فلتران",
    "filters.count.fewSuffix": " فلاتر",
    "filters.count.manySuffix": " فلترًا",
    "filters.count.hundredSuffix": " فلتر",
    "filters.count.hundredOneSuffix": " فلتر واحد",
    "filters.count.hundredTwoSuffix": " فلتران",
    "filters.summary.emptySuffix": ": لا فلاتر",
    "filters.summary.separator": "، ",
    "filters.summary.current": "الجاري",
    "filters.summary.applied": "المطبّق"
  };

  // shared/lifecycle.js
  function instanceRegistry() {
    var instances = /* @__PURE__ */ new WeakMap();
    function key(root) {
      return root || document;
    }
    return {
      get: function(root) {
        var instance = instances.get(key(root));
        return instance && !instance.__destroyed ? instance : null;
      },
      set: function(root, instance) {
        instances.set(key(root), instance);
      },
      remove: function(root) {
        instances.delete(key(root));
      }
    };
  }

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
  function disconnect(root) {
    destroy(root);
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

  // tools/package/.build-entries/iife/action-sheet.mjs
  window.MicroActionSheet = Object.assign({}, action_sheet_exports);
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroActionSheet.init === "function") window.MicroActionSheet.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
})();
