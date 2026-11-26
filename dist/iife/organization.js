if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/organization/organization.js
  var organization_exports = {};
  __export(organization_exports, {
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
    setLabels: () => setLabels2
  });

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

  // components/organization/labels.js
  var defaults = {
    "avatar.initialsFallback": "؟"
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

  // components/organization/organization.js
  registerLabels("organization", defaults);
  var MICRO_LABELS_FAMILY = "organization";
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
  var liveBindings = /* @__PURE__ */ new WeakMap();
  function claimBinding(element, key) {
    var keys = liveBindings.get(element);
    if (!keys) {
      keys = /* @__PURE__ */ new Set();
      liveBindings.set(element, keys);
    }
    if (keys.has(key)) return false;
    keys.add(key);
    element.dataset[key] = "1";
    return true;
  }
  function nodes(root, selector) {
    var scope = root || document;
    var found = [].slice.call(scope.querySelectorAll(selector));
    if (scope.matches && scope.matches(selector)) found.unshift(scope);
    return found;
  }
  function on(element, type, handler) {
    if (!element.__microOrganizationLifetime) element.__microOrganizationLifetime = new AbortController();
    element.addEventListener(type, handler, { signal: element.__microOrganizationLifetime.signal });
  }
  function initSections(root) {
    nodes(root, ".m-section__head").forEach(function(head) {
      if (!claimBinding(head, "microSectionBound")) return;
      on(head, "click", function() {
        var section = head.closest(".m-section");
        var body = section ? section.querySelector(".m-section__body") : null;
        if (!body) return;
        var open = head.getAttribute("aria-expanded") === "true";
        head.setAttribute("aria-expanded", open ? "false" : "true");
        body.hidden = open;
        section.dispatchEvent(new CustomEvent("micro-organization:toggle", {
          bubbles: true,
          detail: { open: !open }
        }));
      });
    });
  }
  function initAvatars(root) {
    nodes(root, "img[data-avatar-fallback]").forEach(function(img) {
      if (!claimBinding(img, "microAvatarBound")) return;
      function fallback() {
        var wrap = img.closest(".m-identity");
        if (!wrap) return;
        var name = (wrap.querySelector(".m-identity__name") || {}).textContent || "";
        var initials = name.trim().split(/\s+/).slice(0, 2).map(function(w) {
          return w.charAt(0);
        }).join("");
        var span = document.createElement("span");
        span.className = "m-identity__initials";
        span.setAttribute("aria-hidden", "true");
        span.textContent = initials || L("avatar.initialsFallback", img);
        img.replaceWith(span);
      }
      on(img, "error", fallback);
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }
  var registry = instanceRegistry();
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = registry.get(scope);
    if (existing) {
      withLabels2(scope, function() {
        initSections(scope);
        initAvatars(scope);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد فحص الأقسام والصور الرمزية تحت الجذر (يربط الجديد فقط). */
      update: function() {
        withLabels2(scope, function() {
          initSections(scope);
          initAvatars(scope);
        });
      },
      /** يفك كل مستمعات النطاق ويمكّن الربط من جديد — لا يمس حالة الطي. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        registry.remove(scope);
      }
    };
    withLabels2(scope, function() {
      initSections(scope);
      initAvatars(scope);
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
    nodes(root, ".m-section__head, img[data-avatar-fallback]").forEach(function(element) {
      liveBindings.delete(element);
      if (element.__microOrganizationLifetime) element.__microOrganizationLifetime.abort();
      delete element.__microOrganizationLifetime;
      delete element.dataset.microSectionBound;
      delete element.dataset.microAvatarBound;
    });
  }
  function setLabels2(partial) {
    setLabels("organization", partial);
  }

  // tools/package/.build-entries/iife/organization.mjs
  window.MicroOrganization = Object.assign({}, organization_exports);
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroOrganization.init === "function") window.MicroOrganization.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
})();
