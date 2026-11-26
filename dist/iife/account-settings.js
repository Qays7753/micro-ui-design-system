if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/account-settings/account-settings.js
  var account_settings_exports = {};
  __export(account_settings_exports, {
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
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
  function instanceLabelFor(el, family) {
    if (el != null && !(el instanceof Node)) {
      console.error("[micro-ui/labels] سياق قراءة النص يجب أن يكون عنصر DOM أو undefined — أُهمل:", el);
      return null;
    }
    if (!el) return null;
    for (var node = el; node && node.nodeType === 1; node = node.parentElement) {
      var own = instanceLabelsOf(node, family);
      if (own) return own;
    }
    return null;
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
  function currentInstanceLabels(family) {
    for (var i = renderStack.length - 1; i >= 0; i--) {
      var entry = renderStack[i];
      if (entry && entry.family === family) return entry.labels;
    }
    return null;
  }
  function registerLabels(family, defaults2) {
    var families = store().families;
    if (!families[family]) families[family] = {};
    var current = families[family];
    for (var key in defaults2) current[key] = defaults2[key];
  }
  function getLabel(family, key, vars) {
    var entry = store().families[family];
    var value = entry ? entry[key] : void 0;
    if (value == null || !vars) return value;
    var text = String(value);
    for (var name in vars) text = text.split("{" + name + "}").join(String(vars[name]));
    return text;
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

  // components/account-settings/labels.js
  var defaults = {
    "demo.changeNotice": "تغيّر هذا المثال داخل الصفحة فقط؛ لم يُحفظ الإعداد."
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

  // components/account-settings/account-settings.js
  registerLabels("account-settings", defaults);
  var MICRO_LABELS_FAMILY = "account-settings";
  function L(key, el) {
    var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY) || currentInstanceLabels(MICRO_LABELS_FAMILY);
    if (own && Object.prototype.hasOwnProperty.call(own, key)) return own[key];
    return getLabel(MICRO_LABELS_FAMILY, key);
  }
  function withLabels2(scope, fn) {
    return withLabels(scope, MICRO_LABELS_FAMILY, fn);
  }
  function applyInstanceLabels(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
    }
  }
  function initPanel(panel) {
    if (panel.hasAttribute("data-account-settings-ready") && panel.__microAccountLifetime && !panel.__microAccountLifetime.signal.aborted) return;
    var layerId = panel.getAttribute("data-account-layer-id");
    var layer = layerId ? document.getElementById(layerId) : panel.closest(".m-layer");
    if (!layer) return;
    panel.setAttribute("data-account-settings-ready", "");
    var controller = new AbortController();
    panel.__microAccountLifetime = controller;
    function on(element, type, handler) {
      element.addEventListener(type, handler, { signal: controller.signal });
    }
    var backdropId = layer.getAttribute("data-backdrop-id");
    var backdrop = backdropId ? document.getElementById(backdropId) : document.querySelector('.m-layer-backdrop[data-for="' + layer.id + '"]');
    var accountView = panel.querySelector('[data-account-view="account"]');
    var appView = panel.querySelector('[data-account-view="application"]');
    var accountTitle = panel.querySelector('[data-account-title="account"]');
    var appTitle = panel.querySelector('[data-account-title="application"]');
    var back = panel.querySelector("[data-account-back]");
    var appEntry = panel.querySelector("[data-account-to-application]");
    var initialView = panel.getAttribute("data-account-initial-view") === "application" ? "application" : "account";
    function showView(view, shouldFocus) {
      var isApp = view === "application";
      if (accountView) accountView.hidden = isApp;
      if (appView) appView.hidden = !isApp;
      if (accountTitle) accountTitle.hidden = isApp;
      if (appTitle) appTitle.hidden = !isApp;
      if (back) back.hidden = view === initialView;
      layer.setAttribute("aria-labelledby", isApp && appTitle ? appTitle.id : accountTitle.id);
      if (shouldFocus) {
        var heading = isApp ? appTitle : accountTitle;
        if (heading) heading.focus();
      }
    }
    panel.querySelectorAll("[data-account-open]").forEach(function(trigger) {
      on(trigger, "click", function() {
        if (!globalApi("Navigation")) return;
        showView(initialView, false);
        globalApi("Navigation").openLayer(layer, { trigger, backdropEl: backdrop });
      });
    });
    if (appEntry) on(appEntry, "click", function() {
      showView("application", true);
    });
    panel.querySelectorAll("[data-account-to-account]").forEach(function(entry) {
      on(entry, "click", function() {
        showView("account", true);
      });
    });
    if (back) on(back, "click", function() {
      showView(initialView, true);
    });
    panel.querySelectorAll("[data-account-close]").forEach(function(button) {
      on(button, "click", function() {
        if (globalApi("Navigation")) globalApi("Navigation").closeLayer(layer);
      });
    });
    on(panel, "change", function(event) {
      var input = event.target;
      if (!input.matches || !input.matches("[data-account-setting]")) return;
      var name = input.getAttribute("data-account-setting") || "";
      panel.dispatchEvent(new CustomEvent("micro-account-settings:change", {
        bubbles: true,
        detail: { setting: name, checked: input.checked }
      }));
      var status = panel.querySelector("[data-account-demo-status]");
      if (status) status.textContent = input.getAttribute("data-demo-only") !== null ? L("demo.changeNotice", panel) : "";
    });
    showView(initialView, false);
  }
  var registry = instanceRegistry();
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = registry.get(scope);
    if (existing) {
      withLabels2(scope, function() {
        if (scope.matches && scope.matches("[data-account-settings]")) initPanel(scope);
        scope.querySelectorAll("[data-account-settings]").forEach(initPanel);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد فحص اللوحات تحت الجذر (يربط الجديد فقط). */
      update: function() {
        withLabels2(scope, function() {
          if (scope.matches && scope.matches("[data-account-settings]")) initPanel(scope);
          scope.querySelectorAll("[data-account-settings]").forEach(initPanel);
        });
      },
      /** يفك مستمعات كل لوحة ويمكّن الربط من جديد — لا يغير حالة العرض. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        registry.remove(scope);
      }
    };
    withLabels2(scope, function() {
      if (scope.matches && scope.matches("[data-account-settings]")) initPanel(scope);
      scope.querySelectorAll("[data-account-settings]").forEach(initPanel);
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
  function disconnect(root) {
    destroy(root);
  }
  function teardown(root) {
    var scope = root || document;
    var panels = [].slice.call(scope.querySelectorAll("[data-account-settings]"));
    if (scope.matches && scope.matches("[data-account-settings]")) panels.unshift(scope);
    panels.forEach(function(panel) {
      if (panel.__microAccountLifetime) panel.__microAccountLifetime.abort();
      delete panel.__microAccountLifetime;
      panel.removeAttribute("data-account-settings-ready");
    });
  }
  function setLabels2(partial) {
    setLabels("account-settings", partial);
  }

  // tools/package/.build-entries/iife/account-settings.mjs
  window.MicroAccountSettings = Object.assign({}, account_settings_exports);
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroAccountSettings.init === "function") window.MicroAccountSettings.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
})();
