if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/selection/selection.js
  var selection_exports = {};
  __export(selection_exports, {
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
    setLabels: () => setLabels2,
    setSwitchPending: () => setSwitchPending
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

  // components/selection/labels.js
  var defaults = {
    "picker.selectedPrefix": "المحدد: ",
    "picker.selectedNone": "المحدد: لا شيء",
    "picker.retry": "إعادة المحاولة",
    "picker.status.initial": "لم تُحمّل الخيارات بعد.",
    "picker.status.loading": "جارٍ تحميل الخيارات…",
    "picker.status.empty": "لا خيارات متاحة.",
    "picker.status.error": "تعذّر تحميل الخيارات. أعد المحاولة.",
    "picker.status.disabled": "الاختيار غير متاح حاليًا.",
    "picker.noResults": "لا نتائج مطابقة. عدّل كلمة البحث."
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

  // components/selection/selection.js
  registerLabels("selection", defaults);
  var MICRO_LABELS_FAMILY = "selection";
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
  var pendingRestore = /* @__PURE__ */ new WeakMap();
  function isDisabled(el) {
    return el.disabled || el.getAttribute("aria-disabled") === "true";
  }
  function syncGroup(group) {
    var all = group.querySelector("[data-select-all]");
    var boxes = [].slice.call(group.querySelectorAll('input[type="checkbox"][data-choice-item]')).filter(function(b) {
      return !b.disabled;
    });
    if (!all) return;
    if (!boxes.length) {
      all.checked = false;
      all.indeterminate = false;
      return;
    }
    var checked = boxes.filter(function(b) {
      return b.checked;
    }).length;
    if (checked === 0) {
      all.checked = false;
      all.indeterminate = false;
    } else if (checked === boxes.length) {
      all.checked = true;
      all.indeterminate = false;
    } else {
      all.checked = false;
      all.indeterminate = true;
    }
  }
  function bindGroups(root) {
    var scope = root || document;
    var groups = [].slice.call(scope.querySelectorAll("[data-choice-group]"));
    if (scope.nodeType === 1 && scope.matches("[data-choice-group]")) groups.unshift(scope);
    groups.forEach(function(group) {
      if (!claimBinding(group, "microChoicesBound")) return;
      if (!group.__microSelectionLifetime) group.__microSelectionLifetime = new AbortController();
      function on(element, type, handler) {
        element.addEventListener(type, handler, { signal: group.__microSelectionLifetime.signal });
      }
      var all = group.querySelector("[data-select-all]");
      if (all) {
        on(all, "change", function() {
          [].slice.call(group.querySelectorAll('input[type="checkbox"][data-choice-item]')).forEach(function(b) {
            if (!b.disabled) b.checked = all.checked;
          });
          syncGroup(group);
          group.dispatchEvent(new Event("micro-selection:changed", { bubbles: true }));
        });
      }
      on(group, "change", function(e) {
        if (e.target.matches('input[type="checkbox"][data-choice-item]')) syncGroup(group);
      });
      syncGroup(group);
    });
  }
  function bindSegmented(root) {
    var scope = root || document;
    var segs = [].slice.call(scope.querySelectorAll("[data-seg]"));
    if (scope.nodeType === 1 && scope.matches("[data-seg]")) segs.unshift(scope);
    segs.forEach(function(seg) {
      if (!claimBinding(seg, "microSegBound")) return;
      if (!seg.__microSelectionLifetime) seg.__microSelectionLifetime = new AbortController();
      function on(element, type, handler) {
        element.addEventListener(type, handler, { signal: seg.__microSelectionLifetime.signal });
      }
      var items = [].slice.call(seg.querySelectorAll(".m-seg__item"));
      function select(item) {
        items.forEach(function(it) {
          var on2 = it === item;
          it.setAttribute("aria-pressed", on2 ? "true" : "false");
          it.classList.toggle("is-selected", on2);
        });
        if (seg.scrollWidth > seg.clientWidth) item.scrollIntoView({ block: "nearest", inline: "nearest" });
        seg.dispatchEvent(new CustomEvent("micro-selection:segment", {
          bubbles: true,
          detail: { value: item.getAttribute("data-value") || item.textContent.trim() }
        }));
      }
      items.forEach(function(it) {
        on(it, "click", function() {
          if (!isDisabled(it)) select(it);
        });
      });
      on(seg, "keydown", function(e) {
        var i = items.indexOf(document.activeElement);
        if (i < 0) return;
        var dir = 0;
        var rtl = getComputedStyle(seg).direction === "rtl";
        if (e.key === "ArrowLeft") dir = rtl ? 1 : -1;
        else if (e.key === "ArrowRight") dir = rtl ? -1 : 1;
        else if (e.key === "ArrowDown") dir = 1;
        else if (e.key === "ArrowUp") dir = -1;
        if (!dir) return;
        e.preventDefault();
        var n = items.length, next = null;
        for (var s = 1; s <= n; s++) {
          var cand = items[((i + dir * s) % n + n) % n];
          if (!isDisabled(cand)) {
            next = cand;
            break;
          }
        }
        if (next) {
          next.focus();
          select(next);
        }
      });
    });
  }
  var registry = instanceRegistry();
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = registry.get(scope);
    if (existing) {
      withLabels2(scope, function() {
        bindGroups(scope);
        bindSegmented(scope);
      });
      return existing;
    }
    acquireSwitchGuard();
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد قراءة حالة المجموعات والمقاطع (يربط الجديد تحت الجذر). */
      update: function() {
        withLabels2(scope, function() {
          bindGroups(scope);
          bindSegmented(scope);
        });
      },
      /** يفك مستمعات النطاق ويطلق حصة حماية document — لا يمس القيم. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        releaseSwitchGuard();
        registry.remove(scope);
      }
    };
    withLabels2(scope, function() {
      bindGroups(scope);
      bindSegmented(scope);
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
  var switchGuardUsers = 0;
  var switchGuardHandler = null;
  function acquireSwitchGuard() {
    switchGuardUsers++;
    if (switchGuardHandler) return;
    switchGuardHandler = function(e) {
      if (!e.isTrusted) return;
      var input = e.target;
      if (!input.matches || !input.matches(".m-switch input")) return;
      var sw = input.closest(".m-switch");
      if (sw && sw.getAttribute("data-pending") === "true") {
        input.checked = !input.checked;
      }
    };
    document.addEventListener("change", switchGuardHandler, true);
  }
  function releaseSwitchGuard() {
    if (switchGuardUsers > 0) switchGuardUsers--;
    if (switchGuardUsers === 0 && switchGuardHandler) {
      document.removeEventListener("change", switchGuardHandler, true);
      switchGuardHandler = null;
    }
  }
  function disconnect(root) {
    destroy(root);
  }
  function teardown(root) {
    var scope = root || document;
    var nodes = [].slice.call(scope.querySelectorAll("[data-choice-group], [data-seg]"));
    if (scope.matches && scope.matches("[data-choice-group], [data-seg]")) nodes.unshift(scope);
    nodes.forEach(function(element) {
      liveBindings.delete(element);
      if (element.__microSelectionLifetime) element.__microSelectionLifetime.abort();
      delete element.__microSelectionLifetime;
      delete element.dataset.microChoicesBound;
      delete element.dataset.microSegBound;
    });
    var switches = [].slice.call(scope.querySelectorAll(".m-switch"));
    if (scope.matches && scope.matches(".m-switch")) switches.unshift(scope);
    switches.forEach(function(element) {
      setSwitchPending(element, false);
    });
  }
  function setSwitchPending(switchEl, pending) {
    if (!switchEl || switchEl.nodeType !== 1) return;
    switchEl.setAttribute("data-pending", pending ? "true" : "false");
    var input = switchEl.querySelector("input");
    if (!input) return;
    input.setAttribute("aria-busy", pending ? "true" : "false");
    if (pending) {
      if (!pendingRestore.has(input)) pendingRestore.set(input, input.disabled);
      input.disabled = true;
    } else if (pendingRestore.has(input)) {
      input.disabled = pendingRestore.get(input);
      pendingRestore.delete(input);
    }
  }
  function setLabels2(partial) {
    setLabels("selection", partial);
  }

  // tools/package/.build-entries/iife/selection.mjs
  window.MicroSelection = Object.assign({}, selection_exports);
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroSelection.init === "function") window.MicroSelection.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
})();
