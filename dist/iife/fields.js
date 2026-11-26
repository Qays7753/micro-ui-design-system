if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/fields/fields.js
  var fields_exports = {};
  __export(fields_exports, {
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
    setLabels: () => setLabels2,
    sync: () => sync,
    update: () => sync
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

  // components/fields/labels.js
  var defaults = {};

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

  // components/fields/fields.js
  registerLabels("fields", defaults);
  var MICRO_LABELS_FAMILY = "fields";
  function withLabels2(scope, fn) {
    return withLabels(scope, MICRO_LABELS_FAMILY, fn);
  }
  function applyInstanceLabels(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
    }
  }
  var msgUid = 0;
  function on(field, element, type, listener, capture) {
    element.addEventListener(type, listener, {
      capture: !!capture,
      signal: field.__microFieldLifetime.signal
    });
  }
  function registerSync(f, fn) {
    if (!Array.isArray(f.__microFieldSyncs)) f.__microFieldSyncs = [];
    f.__microFieldSyncs.push(fn);
  }
  function runSyncs(f) {
    var list = f.__microFieldSyncs;
    if (!list || !list.length) return;
    for (var i = 0; i < list.length; i++) list[i]();
  }
  function bindControlFocus(f) {
    var control = f.querySelector(".m-field__control");
    var input = f.querySelector(".m-field__input, .m-field__area");
    if (!control || !input) return;
    var outsideTouchButton = null;
    on(f, control, "pointerdown", function(e) {
      outsideTouchButton = null;
      if (e.pointerType !== "touch") return;
      var button = e.target.closest("button");
      if (!button || !control.contains(button)) return;
      var box = button.getBoundingClientRect();
      if (e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom) return;
      outsideTouchButton = button;
      e.preventDefault();
      if (!input.disabled) input.focus({ preventScroll: true });
    }, true);
    on(f, control, "click", function(e) {
      var outside = outsideTouchButton;
      outsideTouchButton = null;
      if (!outside || e.detail === 0 || e.target.closest("button") !== outside) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!input.disabled) input.focus({ preventScroll: true });
    }, true);
    on(f, control, "click", function(e) {
      if (e.defaultPrevented || input.disabled) return;
      var interactive = e.target.closest('input, textarea, select, button, a[href], [tabindex], [role="button"]');
      if (interactive && control.contains(interactive)) return;
      input.focus();
    });
  }
  function bindCount(f) {
    var input = f.querySelector(".m-field__input, .m-field__area");
    var count = f.querySelector(".m-field__count");
    if (!input || !count) return;
    var max = parseInt(input.getAttribute("maxlength") || input.dataset.maxlength || "", 10);
    if (!max || isNaN(max)) {
      count.style.display = "none";
      return;
    }
    function update() {
      count.textContent = input.value.length + "/" + max;
    }
    on(f, input, "input", update);
    registerSync(f, update);
    update();
  }
  function bindClear(f) {
    var input = f.querySelector(".m-field__input");
    var clear = f.querySelector(".m-field__clear");
    if (!input || !clear) return;
    function locked() {
      return input.disabled || input.readOnly;
    }
    function sync2() {
      clear.classList.toggle("is-visible", input.value !== "" && !locked());
    }
    on(f, clear, "click", function() {
      if (locked()) return;
      input.value = "";
      sync2();
      input.focus();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("micro-field:cleared", { bubbles: true }));
    });
    on(f, input, "input", sync2);
    registerSync(f, sync2);
    sync2();
  }
  function bindStepper(f) {
    var input = f.querySelector(".m-field__input--num");
    if (!f.querySelector(".m-field__stepper") || !input) return;
    var buttons = [].slice.call(f.querySelectorAll("[data-step]")).map(function(btn) {
      var origin = btn.getAttribute("data-micro-step-aria-origin");
      if (origin === null) {
        origin = btn.getAttribute("aria-disabled");
        btn.setAttribute("data-micro-step-aria-origin", origin === null ? "unset" : origin);
      } else if (origin === "unset") origin = null;
      return { el: btn, ariaDisabled: origin };
    });
    function decimalPlaces(value) {
      var parts = String(value).toLowerCase().split("e");
      var fraction = (parts[0].split(".")[1] || "").length;
      var exponent = parts.length > 1 ? parseInt(parts[1], 10) || 0 : 0;
      return Math.max(0, fraction - exponent);
    }
    function nextValue(btn) {
      var min = input.hasAttribute("min") ? parseFloat(input.getAttribute("min")) : null;
      var max = input.hasAttribute("max") ? parseFloat(input.getAttribute("max")) : null;
      if (!isFinite(min)) min = null;
      if (!isFinite(max)) max = null;
      var rawStep = input.getAttribute("step") || "1";
      var step = rawStep === "any" ? 1 : parseFloat(rawStep);
      if (!isFinite(step) || step <= 0) step = 1;
      var dir = btn.getAttribute("data-step") === "up" ? 1 : -1;
      var rawValue = input.value.trim();
      var empty = rawValue === "";
      var unchanged = parseFloat(rawValue);
      if (!empty && !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(rawValue)) return unchanged;
      var v = unchanged;
      if (isNaN(v)) v = min !== null && min > 0 ? min : 0;
      if (empty && dir < 0 && min !== null && min >= 0) return unchanged;
      var precision = Math.max(decimalPlaces(rawValue || 0), decimalPlaces(rawStep));
      if (min !== null) precision = Math.max(precision, decimalPlaces(min));
      if (max !== null) precision = Math.max(precision, decimalPlaces(max));
      var scale = Math.pow(10, precision);
      var scaledValue = Math.round(v * scale);
      var scaledStep = Math.round(step * scale);
      if (!isFinite(scale) || !Number.isSafeInteger(scaledValue) || !Number.isSafeInteger(scaledStep)) return unchanged;
      if (empty && dir > 0 && min !== null && min > 0) return min;
      if (min !== null && v < min) {
        return dir > 0 && Number.isSafeInteger(Math.round(min * scale)) ? min : unchanged;
      }
      if (max !== null && v > max) {
        return dir < 0 && Number.isSafeInteger(Math.round(max * scale)) ? max : unchanged;
      }
      var scaledCandidate = scaledValue + dir * scaledStep;
      if (!Number.isSafeInteger(scaledCandidate)) return unchanged;
      var candidate = scaledCandidate / scale;
      if (min !== null && candidate < min) return unchanged;
      if (max !== null && candidate > max) return unchanged;
      return candidate;
    }
    function sameValue(a, b) {
      return a === b || isNaN(a) && isNaN(b);
    }
    function syncButtons() {
      var current = parseFloat(input.value);
      buttons.forEach(function(state) {
        var btn = state.el;
        var unavailable = input.disabled || input.readOnly || btn.disabled || state.ariaDisabled === "true" || sameValue(nextValue(btn), current);
        if (unavailable) btn.setAttribute("aria-disabled", "true");
        else if (state.ariaDisabled === null) btn.removeAttribute("aria-disabled");
        else btn.setAttribute("aria-disabled", state.ariaDisabled);
      });
    }
    function stepButton(e) {
      var btn = e.target.closest("[data-step]");
      return btn && f.contains(btn) ? btn : null;
    }
    function applyStep(btn) {
      var current = parseFloat(input.value);
      var v = nextValue(btn);
      if (sameValue(v, current)) return false;
      input.value = String(v);
      syncButtons();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("micro-field:changed", { bubbles: true }));
      return true;
    }
    on(f, f, "click", function(e) {
      var btn = stepButton(e);
      if (!btn) return;
      syncButtons();
      if (btn.disabled || btn.getAttribute("aria-disabled") === "true") {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
    on(f, f, "click", function(e) {
      var btn = stepButton(e);
      if (!btn || input.disabled || input.readOnly || btn.disabled || btn.getAttribute("aria-disabled") === "true") return;
      applyStep(btn);
    });
    on(f, input, "keydown", function(e) {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      if (input.disabled || input.readOnly) return;
      var btn = buttons.find(function(state) {
        return state.el.getAttribute("data-step") === (e.key === "ArrowUp" ? "up" : "down");
      });
      if (!btn) return;
      syncButtons();
      if (btn.el.disabled || btn.el.getAttribute("aria-disabled") === "true") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      applyStep(btn.el);
    });
    on(f, input, "input", syncButtons);
    on(f, input, "change", syncButtons);
    registerSync(f, syncButtons);
    f.__microFieldObserver = new MutationObserver(syncButtons);
    f.__microFieldObserver.observe(f, {
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "readonly", "min", "max", "step"]
    });
    syncButtons();
  }
  function bindMessage(f) {
    var msg = f.querySelector("[data-field-msg]");
    var input = f.querySelector(".m-field__input, .m-field__area");
    if (!msg || !input) return;
    var refs = (input.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    if (msg.id && refs.indexOf(msg.id) >= 0) return;
    if (!msg.id) msg.id = uniqueMsgId("m-field-msg-");
    if (refs.indexOf(msg.id) < 0) refs.push(msg.id);
    input.setAttribute("aria-describedby", refs.join(" "));
  }
  function uniqueMsgId(base) {
    var i = ++msgUid;
    while (document.getElementById(base + i)) i++;
    return base + i;
  }
  function applyEnterKeyHints(scope, fields) {
    var groups = [];
    fields.forEach(function(f) {
      var key = f.closest("form") || scope;
      var group = null;
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].key === key) {
          group = groups[i];
          break;
        }
      }
      if (!group) {
        group = { key, fields: [] };
        groups.push(group);
      }
      group.fields.push(f);
    });
    groups.forEach(function(group) {
      group.fields.forEach(function(f, i) {
        var input = f.querySelector(".m-field__input, .m-field__area");
        if (!input) return;
        var nextInput = null;
        for (var j = i + 1; j < group.fields.length; j++) {
          var candidate = group.fields[j].querySelector(".m-field__input, .m-field__area");
          if (candidate) {
            nextInput = candidate;
            break;
          }
        }
        input.__microEnterNext = nextInput;
        if (input.hasAttribute("enterkeyhint")) return;
        var type = (input.getAttribute("type") || "").toLowerCase();
        input.setAttribute(
          "enterkeyhint",
          type === "search" ? "search" : nextInput ? "next" : "done"
        );
      });
    });
  }
  function bindEnterNavigation(f) {
    var input = f.querySelector(".m-field__input, .m-field__area");
    if (!input) return;
    on(f, input, "keydown", function(e) {
      if (e.key !== "Enter" || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
      if (input.tagName === "TEXTAREA") return;
      if (input.getAttribute("enterkeyhint") !== "next") return;
      var next = input.__microEnterNext;
      if (!next || !next.isConnected || next.disabled) return;
      e.preventDefault();
      next.focus();
    });
  }
  function bindFields(scope) {
    var fields = [].slice.call(scope.querySelectorAll("[data-micro-field]"));
    if (scope.matches && scope.matches("[data-micro-field]")) fields.unshift(scope);
    applyEnterKeyHints(scope, fields);
    fields.forEach(function(f) {
      if (f.dataset.microFieldBound && f.__microFieldLifetime && !f.__microFieldLifetime.signal.aborted) {
        bindEnterNavigation(f);
        return;
      }
      f.dataset.microFieldBound = "1";
      f.__microFieldLifetime = new AbortController();
      bindControlFocus(f);
      bindCount(f);
      bindClear(f);
      bindStepper(f);
      bindMessage(f);
      bindEnterNavigation(f);
    });
  }
  var registry = instanceRegistry();
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = registry.get(scope);
    if (existing) {
      withLabels2(scope, function() {
        bindFields(scope);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** = sync: مزامنة حالة الحقول من قيمها الحالية بلا أحداث. */
      update: function() {
        withLabels2(scope, function() {
          sync(scope);
        });
      },
      /** يفك مستمعات كل حقل ومراقبة رسائله — لا يمس قيم المستخدم. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        registry.remove(scope);
      }
    };
    withLabels2(scope, function() {
      bindFields(scope);
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
  function sync(root) {
    var scope = root && typeof root.querySelectorAll === "function" ? root : document;
    if (scope.nodeType === 1 && scope.matches("[data-micro-field]")) {
      runSyncs(scope);
    }
    scope.querySelectorAll("[data-micro-field]").forEach(runSyncs);
  }
  function disconnect(root) {
    destroy(root);
  }
  function teardown(root) {
    var scope = root || document;
    var fields = [].slice.call(scope.querySelectorAll("[data-micro-field]"));
    if (scope.matches && scope.matches("[data-micro-field]")) fields.unshift(scope);
    fields.forEach(function(field) {
      if (field.__microFieldLifetime) field.__microFieldLifetime.abort();
      if (field.__microFieldObserver) field.__microFieldObserver.disconnect();
      delete field.__microFieldLifetime;
      delete field.__microFieldObserver;
      delete field.__microFieldSyncs;
      delete field.dataset.microFieldBound;
      field.querySelectorAll("[data-micro-step-aria-origin]").forEach(function(button) {
        var original = button.getAttribute("data-micro-step-aria-origin");
        if (original === "unset") button.removeAttribute("aria-disabled");
        else button.setAttribute("aria-disabled", original);
        button.removeAttribute("data-micro-step-aria-origin");
      });
    });
  }
  function setLabels2(partial) {
    setLabels("fields", partial);
  }

  // tools/package/.build-entries/iife/fields.mjs
  window.MicroFields = Object.assign({}, fields_exports);
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroFields.init === "function") window.MicroFields.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
})();
