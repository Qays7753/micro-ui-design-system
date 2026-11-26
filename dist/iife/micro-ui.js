if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/buttons/buttons.js
  var buttons_exports = {};
  __export(buttons_exports, {
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
    setLoading: () => setLoading
  });

  // shared/lifecycle.js
  function instanceRegistry() {
    var instances10 = /* @__PURE__ */ new WeakMap();
    function key2(root) {
      return root || document;
    }
    return {
      get: function(root) {
        var instance = instances10.get(key2(root));
        return instance && !instance.__destroyed ? instance : null;
      },
      set: function(root, instance) {
        instances10.set(key2(root), instance);
      },
      remove: function(root) {
        instances10.delete(key2(root));
      }
    };
  }
  function resourceTracker() {
    var listeners = [];
    var observers2 = [];
    var timers = [];
    var stopped = false;
    function on5(target, type8, handler, options) {
      if (stopped) return;
      target.addEventListener(type8, handler, options);
      listeners.push({ target, type: type8, handler, options });
    }
    function off(target, type8, handler, options) {
      target.removeEventListener(type8, handler, options);
      listeners = listeners.filter(function(entry) {
        return !(entry.target === target && entry.type === type8 && entry.handler === handler);
      });
    }
    function trackObserver(observer) {
      if (!stopped) observers2.push(observer);
      return observer;
    }
    function wrapController(controller) {
      return {
        disconnect: function() {
          controller.abort();
        }
      };
    }
    function later(fn, ms) {
      var id = setTimeout(fn, ms);
      timers.push({ kind: "timeout", id });
      return id;
    }
    function every(fn, ms) {
      var id = setInterval(fn, ms);
      timers.push({ kind: "interval", id });
      return id;
    }
    function frame(fn) {
      var id = requestAnimationFrame(fn);
      timers.push({ kind: "raf", id });
      return id;
    }
    function stopAll() {
      stopped = true;
      var pendingListeners = listeners.splice(0);
      pendingListeners.forEach(function(entry) {
        entry.target.removeEventListener(entry.type, entry.handler, entry.options);
      });
      var pendingObservers = observers2.splice(0);
      pendingObservers.forEach(function(observer) {
        try {
          observer.disconnect();
        } catch (error) {
        }
      });
      var pendingTimers = timers.splice(0);
      pendingTimers.forEach(function(timer) {
        if (timer.kind === "timeout") clearTimeout(timer.id);
        else if (timer.kind === "interval") clearInterval(timer.id);
        else cancelAnimationFrame(timer.id);
      });
    }
    return {
      on: on5,
      off,
      trackObserver,
      wrapController,
      later,
      every,
      frame,
      stopAll
    };
  }

  // components/buttons/buttons.js
  var state = /* @__PURE__ */ new WeakMap();
  var guarded = /* @__PURE__ */ new WeakSet();
  var guardControllers = /* @__PURE__ */ new WeakMap();
  function ensureActivationGuard(btn) {
    if (guarded.has(btn)) return;
    guarded.add(btn);
    var controller = new AbortController();
    guardControllers.set(btn, controller);
    function busy() {
      return btn.getAttribute("aria-busy") === "true";
    }
    btn.addEventListener("click", function(e) {
      if (busy()) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, { capture: true, signal: controller.signal });
    btn.addEventListener("keydown", function(e) {
      if (busy() && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, { capture: true, signal: controller.signal });
  }
  function wrapTextLabel(btn) {
    if (btn.querySelector(":scope > .m-btn__label")) return;
    var nodes2 = [].slice.call(btn.childNodes).filter(function(n) {
      return n.nodeType === 3 && n.textContent.trim() !== "";
    });
    if (!nodes2.length) return;
    nodes2.forEach(function(n) {
      var span = document.createElement("span");
      span.className = "m-btn__label";
      span.textContent = n.textContent;
      btn.replaceChild(span, n);
    });
    btn.dataset.labelWrapped = "1";
  }
  function unwrapTextLabel(btn) {
    if (btn.dataset.labelWrapped !== "1") return;
    [].slice.call(btn.querySelectorAll(":scope > .m-btn__label")).forEach(function(span) {
      btn.replaceChild(document.createTextNode(span.textContent), span);
    });
    btn.normalize();
    delete btn.dataset.labelWrapped;
  }
  function ensureSpinner(btn) {
    var spinner = btn.querySelector(":scope > .m-btn__spinner");
    if (spinner) return;
    spinner = document.createElement("span");
    spinner.className = "m-btn__spinner";
    spinner.setAttribute("aria-hidden", "true");
    var icon = btn.querySelector(":scope > .m-btn__icon");
    if (icon) {
      icon.parentElement.insertBefore(spinner, icon);
    } else if (!btn.classList.contains("m-btn--loading-replace")) {
      btn.insertBefore(spinner, btn.firstChild);
    } else {
      btn.insertBefore(spinner, btn.firstChild);
      btn.classList.add("is-loading--text");
      wrapTextLabel(btn);
    }
  }
  var registry = instanceRegistry();
  function applyInstanceLabels() {
  }
  function withLabels(scope, fn) {
    return fn();
  }
  function scopedButtons(scope) {
    var buttons = [].slice.call(scope.querySelectorAll(".m-btn"));
    if (scope.matches && scope.matches(".m-btn")) buttons.unshift(scope);
    return buttons;
  }
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = registry.get(scope);
    if (existing) {
      withLabels(scope, function() {
        scopedButtons(scope).forEach(ensureActivationGuard);
      });
      return existing;
    }
    scopedButtons(scope).forEach(ensureActivationGuard);
    var destroyed = false;
    var instance = {
      root: scope,
      /** update({loading?, loadingLabel?}) يغلف setLoading لكل أزرار النطاق. */
      update: function(state2) {
        scopedButtons(scope).forEach(function(button) {
          if (state2 && typeof state2.loading === "boolean") {
            setLoading(button, state2.loading, state2);
          } else if (!state2) {
            setLoading(button, false);
          }
        });
      },
      /** يوقف التحميل ويفك حراسات التفعيل ويزيل المثيل — لا يمس قيم المستخدم. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        registry.remove(scope);
      }
    };
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
  function setLoading(btn, isLoading, options) {
    if (!btn || btn.nodeType !== 1) return;
    options = options || {};
    var busy = btn.getAttribute("aria-busy") === "true";
    if (isLoading) {
      if (busy || btn.disabled) return;
      var saved = {
        label: btn.getAttribute("aria-label"),
        hadLabel: btn.hasAttribute("aria-label")
      };
      state.set(btn, saved);
      btn.setAttribute("aria-busy", "true");
      btn.classList.add("is-loading");
      var label = options.loadingLabel || btn.getAttribute("data-loading-label");
      if (label) btn.setAttribute("aria-label", label);
      ensureSpinner(btn);
      ensureActivationGuard(btn);
    } else {
      if (!busy || !state.has(btn)) return;
      var saved2 = state.get(btn);
      if (saved2.hadLabel) btn.setAttribute("aria-label", saved2.label);
      else btn.removeAttribute("aria-label");
      state.delete(btn);
      btn.removeAttribute("aria-busy");
      btn.classList.remove("is-loading", "is-loading--text");
      var spinner = btn.querySelector(":scope > .m-btn__spinner");
      if (spinner && spinner.dataset.demo !== "persistent") spinner.remove();
      unwrapTextLabel(btn);
    }
  }
  function disconnect(root) {
    destroy(root);
  }
  function teardown(root) {
    var scope = root || document;
    scopedButtons(scope).forEach(function(button) {
      setLoading(button, false);
      var controller = guardControllers.get(button);
      if (controller) controller.abort();
      guardControllers.delete(button);
      guarded.delete(button);
    });
  }

  // components/fields/fields.js
  var fields_exports = {};
  __export(fields_exports, {
    destroy: () => destroy2,
    disconnect: () => disconnect2,
    getInstance: () => getInstance2,
    init: () => init2,
    setLabels: () => setLabels2,
    sync: () => sync,
    update: () => sync
  });

  // shared/labels.js
  var labels_exports = {};
  __export(labels_exports, {
    currentInstanceLabels: () => currentInstanceLabels,
    familyLabels: () => familyLabels,
    formatNumber: () => formatNumber,
    getLabel: () => getLabel,
    getLocale: () => getLocale,
    instanceLabelFor: () => instanceLabelFor,
    instanceLabelsOf: () => instanceLabelsOf,
    plural: () => plural,
    pluralCategory: () => pluralCategory,
    registerLabels: () => registerLabels,
    setInstanceLabels: () => setInstanceLabels,
    setLabels: () => setLabels,
    setLocale: () => setLocale,
    withLabels: () => withLabels2
  });
  var pluralRules = null;
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
  function instanceLabelFor(el2, family) {
    if (el2 != null && !(el2 instanceof Node)) {
      console.error("[micro-ui/labels] سياق قراءة النص يجب أن يكون عنصر DOM أو undefined — أُهمل:", el2);
      return null;
    }
    if (!el2) return null;
    for (var node2 = el2; node2 && node2.nodeType === 1; node2 = node2.parentElement) {
      var own = instanceLabelsOf(node2, family);
      if (own) return own;
    }
    return null;
  }
  var renderStack = [];
  function withLabels2(root, family, fn) {
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
  function registerLabels(family, defaults14) {
    var families = store().families;
    if (!families[family]) families[family] = {};
    var current = families[family];
    for (var key2 in defaults14) current[key2] = defaults14[key2];
  }
  function getLabel(family, key2, vars) {
    var entry = store().families[family];
    var value = entry ? entry[key2] : void 0;
    if (value == null || !vars) return value;
    var text2 = String(value);
    for (var name in vars) text2 = text2.split("{" + name + "}").join(String(vars[name]));
    return text2;
  }
  function familyLabels(family) {
    return store().families[family];
  }
  function setLabels(family, partial) {
    var families = store().families;
    var current = families[family] = families[family] || {};
    for (var key2 in partial) {
      if (partial[key2] && Object.prototype.toString.call(partial[key2]) === "[object Object]") {
        current[key2] = current[key2] || {};
        var sub;
        for (sub in partial[key2]) current[key2][sub] = partial[key2][sub];
      } else {
        current[key2] = partial[key2];
      }
    }
  }
  function setLocale(locale) {
    store().locale = locale;
  }
  function getLocale() {
    return store().locale || "ar-u-nu-latn";
  }
  function formatNumber(value) {
    var locale = getLocale();
    if (locale === "ar-u-nu-latn") return String(value);
    try {
      return new Intl.NumberFormat(locale).format(value);
    } catch (err) {
      return String(value);
    }
  }
  function pluralCategory(n) {
    if (n >= 100) {
      var r = n % 100;
      if (r === 0) return "other";
      if (r === 1) return "hundredOne";
      if (r === 2) return "hundredTwo";
      if (r >= 3 && r <= 10) return "few";
      return "many";
    }
    if (!pluralRules) {
      try {
        pluralRules = new Intl.PluralRules("ar");
      } catch (err) {
        pluralRules = { select: function() {
          return "other";
        } };
      }
    }
    return pluralRules.select(n);
  }
  function plural(n, forms) {
    var source = forms || {};
    var template = source[pluralCategory(n)] != null ? source[pluralCategory(n)] : source.other;
    if (template == null) return String(n);
    return String(template).replace("{n}", String(n));
  }

  // components/fields/labels.js
  var defaults = {};

  // components/fields/fields.js
  registerLabels("fields", defaults);
  var MICRO_LABELS_FAMILY = "fields";
  function withLabels3(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY, fn);
  }
  function applyInstanceLabels2(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
    }
  }
  var msgUid = 0;
  function on(field, element, type8, listener, capture) {
    element.addEventListener(type8, listener, {
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
    function update8() {
      count.textContent = input.value.length + "/" + max;
    }
    on(f, input, "input", update8);
    registerSync(f, update8);
    update8();
  }
  function bindClear(f) {
    var input = f.querySelector(".m-field__input");
    var clear = f.querySelector(".m-field__clear");
    if (!input || !clear) return;
    function locked2() {
      return input.disabled || input.readOnly;
    }
    function sync3() {
      clear.classList.toggle("is-visible", input.value !== "" && !locked2());
    }
    on(f, clear, "click", function() {
      if (locked2()) return;
      input.value = "";
      sync3();
      input.focus();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("micro-field:cleared", { bubbles: true }));
    });
    on(f, input, "input", sync3);
    registerSync(f, sync3);
    sync3();
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
      var parts2 = String(value).toLowerCase().split("e");
      var fraction = (parts2[0].split(".")[1] || "").length;
      var exponent = parts2.length > 1 ? parseInt(parts2[1], 10) || 0 : 0;
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
      buttons.forEach(function(state2) {
        var btn = state2.el;
        var unavailable = input.disabled || input.readOnly || btn.disabled || state2.ariaDisabled === "true" || sameValue(nextValue(btn), current);
        if (unavailable) btn.setAttribute("aria-disabled", "true");
        else if (state2.ariaDisabled === null) btn.removeAttribute("aria-disabled");
        else btn.setAttribute("aria-disabled", state2.ariaDisabled);
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
      var btn = buttons.find(function(state2) {
        return state2.el.getAttribute("data-step") === (e.key === "ArrowUp" ? "up" : "down");
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
  function uniqueMsgId(base2) {
    var i = ++msgUid;
    while (document.getElementById(base2 + i)) i++;
    return base2 + i;
  }
  function applyEnterKeyHints(scope, fields) {
    var groups = [];
    fields.forEach(function(f) {
      var key2 = f.closest("form") || scope;
      var group = null;
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].key === key2) {
          group = groups[i];
          break;
        }
      }
      if (!group) {
        group = { key: key2, fields: [] };
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
        var type8 = (input.getAttribute("type") || "").toLowerCase();
        input.setAttribute(
          "enterkeyhint",
          type8 === "search" ? "search" : nextInput ? "next" : "done"
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
      var next3 = input.__microEnterNext;
      if (!next3 || !next3.isConnected || next3.disabled) return;
      e.preventDefault();
      next3.focus();
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
  var registry2 = instanceRegistry();
  function init2(root, options) {
    var scope = root || document;
    applyInstanceLabels2(scope, options);
    var existing = registry2.get(scope);
    if (existing) {
      withLabels3(scope, function() {
        bindFields(scope);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** = sync: مزامنة حالة الحقول من قيمها الحالية بلا أحداث. */
      update: function() {
        withLabels3(scope, function() {
          sync(scope);
        });
      },
      /** يفك مستمعات كل حقل ومراقبة رسائله — لا يمس قيم المستخدم. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown2(scope);
        registry2.remove(scope);
      }
    };
    withLabels3(scope, function() {
      bindFields(scope);
    });
    registry2.set(scope, instance);
    return instance;
  }
  function getInstance2(root) {
    return registry2.get(root);
  }
  function destroy2(root) {
    var instance = registry2.get(root);
    if (instance) instance.destroy();
    else teardown2(root || document);
  }
  function sync(root) {
    var scope = root && typeof root.querySelectorAll === "function" ? root : document;
    if (scope.nodeType === 1 && scope.matches("[data-micro-field]")) {
      runSyncs(scope);
    }
    scope.querySelectorAll("[data-micro-field]").forEach(runSyncs);
  }
  function disconnect2(root) {
    destroy2(root);
  }
  function teardown2(root) {
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

  // components/selection/selection.js
  var selection_exports = {};
  __export(selection_exports, {
    destroy: () => destroy3,
    disconnect: () => disconnect3,
    getInstance: () => getInstance3,
    init: () => init3,
    setLabels: () => setLabels3,
    setSwitchPending: () => setSwitchPending
  });

  // components/selection/labels.js
  var defaults2 = {
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

  // components/selection/selection.js
  registerLabels("selection", defaults2);
  var MICRO_LABELS_FAMILY2 = "selection";
  function withLabels4(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY2, fn);
  }
  function applyInstanceLabels3(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY2, options.labels);
    }
  }
  var liveBindings = /* @__PURE__ */ new WeakMap();
  function claimBinding(element, key2) {
    var keys = liveBindings.get(element);
    if (!keys) {
      keys = /* @__PURE__ */ new Set();
      liveBindings.set(element, keys);
    }
    if (keys.has(key2)) return false;
    keys.add(key2);
    element.dataset[key2] = "1";
    return true;
  }
  var pendingRestore = /* @__PURE__ */ new WeakMap();
  function isDisabled(el2) {
    return el2.disabled || el2.getAttribute("aria-disabled") === "true";
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
      function on5(element, type8, handler) {
        element.addEventListener(type8, handler, { signal: group.__microSelectionLifetime.signal });
      }
      var all = group.querySelector("[data-select-all]");
      if (all) {
        on5(all, "change", function() {
          [].slice.call(group.querySelectorAll('input[type="checkbox"][data-choice-item]')).forEach(function(b) {
            if (!b.disabled) b.checked = all.checked;
          });
          syncGroup(group);
          group.dispatchEvent(new Event("micro-selection:changed", { bubbles: true }));
        });
      }
      on5(group, "change", function(e) {
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
      function on5(element, type8, handler) {
        element.addEventListener(type8, handler, { signal: seg.__microSelectionLifetime.signal });
      }
      var items = [].slice.call(seg.querySelectorAll(".m-seg__item"));
      function select(item) {
        items.forEach(function(it) {
          var on6 = it === item;
          it.setAttribute("aria-pressed", on6 ? "true" : "false");
          it.classList.toggle("is-selected", on6);
        });
        if (seg.scrollWidth > seg.clientWidth) item.scrollIntoView({ block: "nearest", inline: "nearest" });
        seg.dispatchEvent(new CustomEvent("micro-selection:segment", {
          bubbles: true,
          detail: { value: item.getAttribute("data-value") || item.textContent.trim() }
        }));
      }
      items.forEach(function(it) {
        on5(it, "click", function() {
          if (!isDisabled(it)) select(it);
        });
      });
      on5(seg, "keydown", function(e) {
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
        var n = items.length, next3 = null;
        for (var s = 1; s <= n; s++) {
          var cand = items[((i + dir * s) % n + n) % n];
          if (!isDisabled(cand)) {
            next3 = cand;
            break;
          }
        }
        if (next3) {
          next3.focus();
          select(next3);
        }
      });
    });
  }
  var registry3 = instanceRegistry();
  function init3(root, options) {
    var scope = root || document;
    applyInstanceLabels3(scope, options);
    var existing = registry3.get(scope);
    if (existing) {
      withLabels4(scope, function() {
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
        withLabels4(scope, function() {
          bindGroups(scope);
          bindSegmented(scope);
        });
      },
      /** يفك مستمعات النطاق ويطلق حصة حماية document — لا يمس القيم. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown3(scope);
        releaseSwitchGuard();
        registry3.remove(scope);
      }
    };
    withLabels4(scope, function() {
      bindGroups(scope);
      bindSegmented(scope);
    });
    registry3.set(scope, instance);
    return instance;
  }
  function getInstance3(root) {
    return registry3.get(root);
  }
  function destroy3(root) {
    var instance = registry3.get(root);
    if (instance) instance.destroy();
    else teardown3(root || document);
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
  function disconnect3(root) {
    destroy3(root);
  }
  function teardown3(root) {
    var scope = root || document;
    var nodes2 = [].slice.call(scope.querySelectorAll("[data-choice-group], [data-seg]"));
    if (scope.matches && scope.matches("[data-choice-group], [data-seg]")) nodes2.unshift(scope);
    nodes2.forEach(function(element) {
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
  function setLabels3(partial) {
    setLabels("selection", partial);
  }

  // components/selection/picker.js
  var picker_exports = {};
  __export(picker_exports, {
    clearSelection: () => clearSelection,
    destroy: () => destroy4,
    disconnect: () => disconnectRoot,
    getInstance: () => getInstance4,
    getSelected: () => getSelected,
    init: () => init4,
    setLabels: () => setLabels4,
    setOptions: () => setOptions,
    setStatus: () => setStatus,
    update: () => update
  });

  // shared/integrations.js
  function globalApi(name) {
    if (typeof globalThis === "undefined") return void 0;
    return globalThis["Micro" + name];
  }

  // components/selection/picker.js
  registerLabels("selection", defaults2);
  var MICRO_LABELS_FAMILY3 = "selection";
  function L(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY3) || currentInstanceLabels(MICRO_LABELS_FAMILY3);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY3, key2);
  }
  function withLabels5(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY3, fn);
  }
  function applyInstanceLabels4(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY3, options.labels);
    }
  }
  var states = /* @__PURE__ */ new WeakMap();
  function stateOf(picker) {
    var state2 = states.get(picker);
    if (!state2) {
      state2 = { status: "ready", query: "", message: "", listeners: [], bound: false };
      states.set(picker, state2);
    }
    return state2;
  }
  function listOf(picker) {
    return picker.querySelector("[data-picker-list]");
  }
  function optionsOf(picker) {
    var list = listOf(picker);
    return list ? [].slice.call(list.querySelectorAll(".m-picker__option")) : [];
  }
  function searchOf(picker) {
    return picker.querySelector("[data-picker-search]");
  }
  function locked(picker) {
    return picker.getAttribute("aria-disabled") === "true" || stateOf(picker).status === "disabled";
  }
  function available(picker) {
    return optionsOf(picker).filter(function(option) {
      return !option.hidden && !option.disabled && option.getAttribute("aria-disabled") !== "true";
    });
  }
  function listen(picker, element, type8, handler) {
    if (!element) return;
    element.addEventListener(type8, handler);
    stateOf(picker).listeners.push(function() {
      element.removeEventListener(type8, handler);
    });
  }
  function safeFocus(picker) {
    var target = searchOf(picker);
    if (!target || target.disabled || target.hidden) {
      target = picker;
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    }
    target.focus({ preventScroll: true });
  }
  function roving(picker, active) {
    var visible2 = available(picker);
    var chosen = visible2.indexOf(active) >= 0 ? active : visible2.filter(function(option) {
      return option.getAttribute("aria-selected") === "true";
    })[0] || visible2[0];
    optionsOf(picker).forEach(function(option) {
      option.tabIndex = !locked(picker) && option === chosen ? 0 : -1;
    });
  }
  function summary(picker) {
    var foot = picker.querySelector("[data-picker-summary]");
    var selected = getSelected(picker);
    if (foot) foot.textContent = selected ? L("picker.selectedPrefix", foot) + selected.label : L("picker.selectedNone", foot);
  }
  function getSelected(picker) {
    var option = optionsOf(picker).filter(function(item) {
      return item.getAttribute("aria-selected") === "true";
    })[0];
    return option ? { value: option.getAttribute("data-value"), label: option.textContent.trim() } : null;
  }
  function changed(picker, value) {
    picker.dispatchEvent(new CustomEvent("micro-picker:change", {
      bubbles: true,
      detail: value || { value: null, label: null }
    }));
  }
  function statusNodes(picker) {
    var list = listOf(picker);
    if (!list) return null;
    [].slice.call(list.querySelectorAll(".m-picker__state")).forEach(function(node2) {
      node2.remove();
    });
    var status2 = picker.querySelector("[data-picker-status]");
    if (!status2) {
      status2 = document.createElement("div");
      status2.className = "m-picker__state";
      status2.setAttribute("data-picker-status", "");
      list.parentNode.insertBefore(status2, list);
    } else if (list.contains(status2)) list.parentNode.insertBefore(status2, list);
    status2.setAttribute("role", "status");
    status2.setAttribute("aria-live", "polite");
    status2.setAttribute("aria-atomic", "true");
    var retry = picker.querySelector("[data-picker-retry]");
    if (!retry) {
      retry = document.createElement("button");
      retry.type = "button";
      retry.className = "m-btn m-btn--secondary";
      retry.setAttribute("data-picker-retry", "");
      retry.textContent = L("picker.retry", retry);
      list.parentNode.insertBefore(retry, list.nextSibling);
    } else if (list.contains(retry) || status2.contains(retry)) {
      list.parentNode.insertBefore(retry, list.nextSibling);
    }
    return { status: status2, retry };
  }
  function normalizeMatch(text2) {
    var s = String(text2).toLowerCase();
    if (!s.normalize) return s;
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function apply(picker) {
    var state2 = stateOf(picker);
    var list = listOf(picker);
    var nodes2 = statusNodes(picker);
    if (!list || !nodes2) return;
    var active = document.activeElement;
    var ownedOption = optionsOf(picker).indexOf(active) >= 0;
    var ready2 = state2.status === "ready";
    var queryNorm = state2.query !== "" ? normalizeMatch(state2.query) : "";
    optionsOf(picker).forEach(function(option) {
      var hide = !ready2 || queryNorm !== "" && normalizeMatch(option.textContent).indexOf(queryNorm) === -1;
      if (hide && option === active) safeFocus(picker);
      option.hidden = hide;
    });
    var defaults14 = {
      initial: L("picker.status.initial"),
      loading: L("picker.status.loading"),
      empty: L("picker.status.empty"),
      error: L("picker.status.error"),
      disabled: L("picker.status.disabled")
    };
    var noResult = ready2 && state2.query !== "" && !available(picker).length;
    var noData = ready2 && !optionsOf(picker).length;
    var message = ready2 ? noResult ? L("picker.noResults") : noData ? defaults14.empty : "" : state2.message || defaults14[state2.status] || "";
    var retryVisible = state2.status === "error" && !locked(picker);
    if (active === nodes2.retry && !retryVisible) safeFocus(picker);
    if (nodes2.status.textContent !== message) nodes2.status.textContent = message;
    nodes2.status.hidden = !message;
    nodes2.status.classList.toggle("m-picker__state--error", state2.status === "error");
    nodes2.retry.hidden = !retryVisible;
    list.setAttribute("aria-busy", state2.status === "loading" ? "true" : "false");
    list.setAttribute("aria-disabled", locked(picker) ? "true" : "false");
    roving(picker, ownedOption && !active.hidden ? active : null);
  }
  function bind(picker) {
    if (stateOf(picker).bound || !listOf(picker)) return;
    stateOf(picker).bound = true;
    picker.setAttribute("data-micro-picker-bound", "1");
    var nodes2 = statusNodes(picker);
    listen(picker, searchOf(picker), "input", function() {
      stateOf(picker).query = searchOf(picker).value.trim();
      apply(picker);
    });
    listen(picker, nodes2.retry, "click", function() {
      if (stateOf(picker).status !== "error" || locked(picker)) return;
      picker.dispatchEvent(new CustomEvent("micro-picker:retry", { bubbles: true }));
    });
    listen(picker, listOf(picker), "click", function(event) {
      var option = event.target.closest(".m-picker__option");
      if (!option || available(picker).indexOf(option) < 0 || locked(picker)) return;
      optionsOf(picker).forEach(function(item) {
        item.setAttribute("aria-selected", String(item === option));
      });
      summary(picker);
      roving(picker, option);
      changed(picker, getSelected(picker));
    });
    listen(picker, listOf(picker), "keydown", function(event) {
      var options = available(picker);
      if (!options.length || locked(picker)) return;
      var index = options.indexOf(document.activeElement), next3 = null;
      var rtl = getComputedStyle(picker).direction === "rtl";
      if (event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight")) next3 = options[(index + 1 + options.length) % options.length];
      else if (event.key === "ArrowUp" || event.key === (rtl ? "ArrowRight" : "ArrowLeft")) next3 = options[(index - 1 + options.length) % options.length];
      else if (event.key === "Home") next3 = options[0];
      else if (event.key === "End") next3 = options[options.length - 1];
      if (next3) {
        event.preventDefault();
        next3.focus();
        roving(picker, next3);
      }
    });
    listen(picker, picker.querySelector("[data-picker-close]"), "click", function() {
      var layer = picker.closest(".m-layer");
      if (layer && globalApi("Navigation")) globalApi("Navigation").closeLayer(layer);
      picker.dispatchEvent(new CustomEvent("micro-picker:close", { bubbles: true }));
    });
    apply(picker);
    summary(picker);
  }
  function each(root, fn) {
    var scope = root || document;
    if (scope.matches && scope.matches("[data-micro-picker]")) fn(scope);
    [].slice.call(scope.querySelectorAll("[data-micro-picker]")).forEach(fn);
  }
  function disconnect4(picker) {
    stateOf(picker).listeners.splice(0).forEach(function(remove) {
      remove();
    });
    stateOf(picker).bound = false;
    picker.removeAttribute("data-micro-picker-bound");
  }
  var registry4 = instanceRegistry();
  function teardown4(scope) {
    each(scope, function(pickerEl) {
      disconnect4(pickerEl);
      states.delete(pickerEl);
    });
  }
  function init4(root, options) {
    var scope = root || document;
    applyInstanceLabels4(scope, options);
    var existing = registry4.get(scope);
    if (existing) {
      withLabels5(scope, function() {
        each(scope, bind);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** = setOptions لكل picker تحت الجذر. */
      update: function(items) {
        if (!Array.isArray(items)) return;
        withLabels5(scope, function() {
          each(scope, function(pickerEl) {
            setOptions(pickerEl, items);
          });
        });
      },
      /** يفك مستمعات كل picker ويمحو حالته — بيانات المضيف لا تُمس. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown4(scope);
        registry4.remove(scope);
      }
    };
    withLabels5(scope, function() {
      each(scope, bind);
    });
    registry4.set(scope, instance);
    return instance;
  }
  function getInstance4(root) {
    return registry4.get(root);
  }
  function destroy4(root) {
    var instance = registry4.get(root);
    if (instance) instance.destroy();
    else teardown4(root);
  }
  function update(root, items) {
    if (!Array.isArray(items)) return;
    each(root, function(picker) {
      setOptions(picker, items);
    });
  }
  function setStatus(picker, kind, message) {
    if (["ready", "loading", "empty", "error", "initial", "disabled"].indexOf(kind) < 0) return;
    var state2 = stateOf(picker);
    state2.status = kind;
    state2.message = typeof message === "string" ? message : "";
    apply(picker);
  }
  function setOptions(picker, items) {
    var list = listOf(picker);
    if (!list) return;
    var selected = getSelected(picker), active = document.activeElement;
    var hadFocus = optionsOf(picker).indexOf(active) >= 0;
    var focusedKey = hadFocus ? active.getAttribute("data-value") : null;
    if (hadFocus) safeFocus(picker);
    optionsOf(picker).forEach(function(option) {
      option.remove();
    });
    (items || []).forEach(function(item) {
      var option = document.createElement("button");
      option.type = "button";
      option.className = "m-picker__option";
      option.setAttribute("role", "option");
      option.setAttribute("data-value", String(item.value));
      option.setAttribute("aria-selected", String(!!selected && selected.value === String(item.value)));
      option.textContent = item.label;
      list.appendChild(option);
    });
    var state2 = stateOf(picker);
    state2.status = "ready";
    state2.message = "";
    apply(picker);
    summary(picker);
    var replacement = available(picker).filter(function(option) {
      return option.getAttribute("data-value") === focusedKey;
    })[0];
    if (hadFocus && replacement && !locked(picker)) {
      replacement.focus();
      roving(picker, replacement);
    }
    if (selected && !getSelected(picker)) changed(picker, null);
  }
  function clearSelection(picker) {
    optionsOf(picker).forEach(function(option) {
      option.setAttribute("aria-selected", "false");
    });
    summary(picker);
    roving(picker, document.activeElement);
    changed(picker, null);
  }
  function disconnectRoot(root) {
    destroy4(root);
  }
  function setLabels4(partial) {
    setLabels("selection", partial);
  }

  // components/organization/organization.js
  var organization_exports = {};
  __export(organization_exports, {
    destroy: () => destroy5,
    disconnect: () => disconnect5,
    getInstance: () => getInstance5,
    init: () => init5,
    setLabels: () => setLabels5
  });

  // components/organization/labels.js
  var defaults3 = {
    "avatar.initialsFallback": "؟"
  };

  // components/organization/organization.js
  registerLabels("organization", defaults3);
  var MICRO_LABELS_FAMILY4 = "organization";
  function L2(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY4) || currentInstanceLabels(MICRO_LABELS_FAMILY4);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY4, key2);
  }
  function withLabels6(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY4, fn);
  }
  function applyInstanceLabels5(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY4, options.labels);
    }
  }
  var liveBindings2 = /* @__PURE__ */ new WeakMap();
  function claimBinding2(element, key2) {
    var keys = liveBindings2.get(element);
    if (!keys) {
      keys = /* @__PURE__ */ new Set();
      liveBindings2.set(element, keys);
    }
    if (keys.has(key2)) return false;
    keys.add(key2);
    element.dataset[key2] = "1";
    return true;
  }
  function nodes(root, selector) {
    var scope = root || document;
    var found = [].slice.call(scope.querySelectorAll(selector));
    if (scope.matches && scope.matches(selector)) found.unshift(scope);
    return found;
  }
  function on2(element, type8, handler) {
    if (!element.__microOrganizationLifetime) element.__microOrganizationLifetime = new AbortController();
    element.addEventListener(type8, handler, { signal: element.__microOrganizationLifetime.signal });
  }
  function initSections(root) {
    nodes(root, ".m-section__head").forEach(function(head) {
      if (!claimBinding2(head, "microSectionBound")) return;
      on2(head, "click", function() {
        var section = head.closest(".m-section");
        var body = section ? section.querySelector(".m-section__body") : null;
        if (!body) return;
        var open2 = head.getAttribute("aria-expanded") === "true";
        head.setAttribute("aria-expanded", open2 ? "false" : "true");
        body.hidden = open2;
        section.dispatchEvent(new CustomEvent("micro-organization:toggle", {
          bubbles: true,
          detail: { open: !open2 }
        }));
      });
    });
  }
  function initAvatars(root) {
    nodes(root, "img[data-avatar-fallback]").forEach(function(img) {
      if (!claimBinding2(img, "microAvatarBound")) return;
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
        span.textContent = initials || L2("avatar.initialsFallback", img);
        img.replaceWith(span);
      }
      on2(img, "error", fallback);
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }
  var registry5 = instanceRegistry();
  function init5(root, options) {
    var scope = root || document;
    applyInstanceLabels5(scope, options);
    var existing = registry5.get(scope);
    if (existing) {
      withLabels6(scope, function() {
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
        withLabels6(scope, function() {
          initSections(scope);
          initAvatars(scope);
        });
      },
      /** يفك كل مستمعات النطاق ويمكّن الربط من جديد — لا يمس حالة الطي. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown5(scope);
        registry5.remove(scope);
      }
    };
    withLabels6(scope, function() {
      initSections(scope);
      initAvatars(scope);
    });
    registry5.set(scope, instance);
    return instance;
  }
  function getInstance5(root) {
    return registry5.get(root);
  }
  function destroy5(root) {
    var instance = registry5.get(root);
    if (instance) instance.destroy();
    else teardown5(root || document);
  }
  function disconnect5(root) {
    destroy5(root);
  }
  function teardown5(root) {
    nodes(root, ".m-section__head, img[data-avatar-fallback]").forEach(function(element) {
      liveBindings2.delete(element);
      if (element.__microOrganizationLifetime) element.__microOrganizationLifetime.abort();
      delete element.__microOrganizationLifetime;
      delete element.dataset.microSectionBound;
      delete element.dataset.microAvatarBound;
    });
  }
  function setLabels5(partial) {
    setLabels("organization", partial);
  }

  // components/data/data.js
  var data_exports = {};
  __export(data_exports, {
    destroy: () => destroy6,
    disconnect: () => disconnect6,
    getInstance: () => getInstance6,
    getSelection: () => getSelection,
    init: () => init6,
    render: () => render,
    setLabels: () => setLabels6,
    setSelection: () => setSelection,
    update: () => update2
  });

  // components/data/labels.js
  var defaults4 = {
    "value.invalid": "قيمة غير صالحة",
    "value.unavailable": "(غير متاح)",
    "value.negativeUnplottedSuffix": " (سالب غير مرسوم)",
    "common.listSeparator": "، ",
    "context.unit": "الوحدة",
    "context.period": "الفترة",
    "table.ariaLabel": "القراءات الكاملة للرسم",
    "value.outlierSuffix": " (قيمة شاذة)",
    "bars.rangeError": "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه.",
    "bars.scaleInvalidDetail": '" غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض الرسم النسبي والقيم معروضة كاملة.',
    "bars.overscaleDetailPrefix": "bars: أكبر قيمة (",
    "bars.overscaleDetailMax": ') تتجاوز data-max="',
    "bars.overscaleDetailSuffix": '" — الرسم النسبي كان سيخفي الفرق بين القيم؛ صحّح data-max أو استخدم data-overscale="rescale" لتوسيع المقياس بشكل معلن.',
    "bars.ariaLabel": "رسم أعمدة",
    "bars.rescaledAriaSuffix": "؛ مقياس موسّع إلى ",
    "bars.rescaledAriaInsteadOf": " بدل المعلن ",
    "bars.invalidMark": "غير صالح",
    "bars.negativeUnplottedMark": "سالب غير مرسوم",
    "bars.outlierMark": "قيمة شاذة",
    "bars.rescaledNotePrefix": "نطاق العرض: ",
    "bars.rescaledNoteInsteadOf": " بدل ",
    "bars.rescaledNoteSuffix": ". القيم الأصلية دون تغيير.",
    "bars.rescaleDetailPrefix": 'bars: data-overscale="rescale" — رسم بمقياس موسّع من ',
    "bars.rescaleDetailTo": " إلى ",
    "bars.rescaleDetailSuffix": "؛ القيم الأصلية دون تغيير.",
    "chart.empty": "لا توجد بيانات لعرضها.",
    "signed.rangeError": "تعذّر عرض الرسم بهذا النطاق. القراءات متاحة كاملة.",
    "signed.ariaLabel": "رسم موقّع",
    "signed.ariaSuffix": "؛ محور صفر مشترك، والقراءات الكاملة أدناه",
    "axis.missingSetupError": "تعذّر عرض المحور دون إعداد وأوقات صريحة صالحة. القراءات متاحة كاملة.",
    "axis.autoExtendedNote": "وُسّع النطاق ليشمل جميع القيم؛ القراءات الأصلية دون تغيير.",
    "axis.timeMissingWithReadings": "تعذر عرض المحور الزمني دون أوقات صريحة لكل نقطة. القراءات متاحة أدناه.",
    "axis.timeMissing": "تعذر عرض المحور الزمني دون أوقات صريحة لكل نقطة.",
    "axis.unsupportedWithReadings": "نوع المحور غير مدعوم. القراءات متاحة أدناه.",
    "axis.unsupported": "نوع المحور غير مدعوم.",
    "line.overscaleDetailPrefix": "line: أكبر قيمة (",
    "line.overscaleDetailSuffix": '" — الرسم كان سيخرج نقطة خارج مجال الرسم؛ صحّح data-max أو استخدم data-overscale="rescale" لتوسيع المقياس بشكل معلن.',
    "line.ariaLabel": "رسم خط",
    "line.rescaleDetailPrefix": 'line: data-overscale="rescale" — رسم بمقياس موسّع من ',
    "line.readingsAriaLabel": "التسميات والقراءات الكاملة للرسم",
    "donut.rangeError": "تعذر رسم التوزيع كنسب. القيم معروضة في المفتاح دون نسب.",
    "donut.ariaLabel": "توزيع",
    "donut.totalInvalidDetail": '" غير رقمي/غير محدود — مقام غير قابل للاستخدام؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.',
    "donut.negativeValuesDetail": "donut: قيم سالبة — التوزيع نسب من قيم غير سالبة فقط؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.",
    "donut.oversumDetailPrefix": "donut: مجموع الفئات (",
    "donut.oversumDetailMax": ') يتجاوز المقام المعلن data-total="',
    "donut.oversumDetailSuffix": '" — النسب كانت ستتجاوز المقام؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.',
    "donut.negativeTotalDetail": '" سالب — المقام السالب غير صالح للنسب (C2)؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.',
    "donut.zeroTotalDetailPrefix": 'donut: data-total="0" بينما مجموع الفئات ',
    "donut.zeroTotalDetailSuffix": " — تعارض بيانات: لا نسب من مقام صفر ولا استبدال تلقائي للمقام (C2)؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.",
    "donut.totalUnknown": "الإجمالي غير معلوم",
    "donut.totalLabel": "الإجمالي",
    "donut.knownSumLabel": "مجموع المعلوم",
    "donut.invalidValueSuffix": " (قيمة غير صالحة)",
    "donut.invalidShareSuffix": " (غير صالح للنسب)",
    "donut.invalidReading": "(قيمة غير صالحة)",
    "table.showButton": "عرض البيانات كجدول",
    "table.hideButton": "إخفاء جدول البيانات",
    "table.unitPrefix": "الوحدة: ",
    "table.periodPrefix": "الفترة: ",
    "table.head.category": "الفئة",
    "table.head.time": "وقت النقطة",
    "table.head.value": "القيمة",
    "bubbles.rangeError": "تعذر عرض الدوائر بهذا النطاق. القيم متاحة أدناه.",
    "bubbles.scaleInvalidDetail": '" غير رقمي/غير موجب — مقياس غير قابل للاستخدام (عقد A01 نفسه bars/line)؛ رُفض الرسم النسبي والقيم معروضة كاملة.',
    "bubbles.overscaleDetailPrefix": "bubbles: أكبر قيمة (",
    "bubbles.overscaleDetailSuffix": '" — كان نصف القطر سيتجاوز rmax المعلن بصمت (r = Rmax×√(v/vmax) > Rmax)؛ صحّح data-max أو استخدم data-overscale="rescale" لتوسيع المقياس بشكل معلن.',
    "bubbles.negativeAreaSuffix": " (سالب غير صالح للمساحة)",
    "bubbles.rescaledNotePrefix": "نطاق الدوائر: ",
    "bubbles.rescaleDetailPrefix": 'bubbles: data-overscale="rescale" — رسم بمقياس موسّع من ',
    "bubbles.rescaleDetailSuffix": "؛ القيم الأصلية دون تغيير، ولا نصف قطر يتجاوز rmax.",
    "reading.selectPrompt": "اختر عنصرًا لقراءة تفاصيله",
    "reading.noneSelected": "لم يُحدد عنصر",
    "reading.shareSuffix": " من الإجمالي",
    "reading.unitUnspecified": "(وحدة غير محددة)",
    "reading.periodUnspecified": "(فترة غير محددة)",
    "reading.caption": "القراءات بوحداتها وفتراتها",
    "reading.prevButton": "السابق",
    "reading.rangeAriaLabel": "تحديد عنصر لقراءة قيمته",
    "reading.nextButton": "التالي",
    "reading.unsupportedRangeError": "نوع نطاق القيم غير مدعوم. القراءات متاحة كاملة.",
    "packed.listAriaLabel": "حالات لا تدخل الرسم المساحي",
    "packed.zeroText": "0 (صفر)",
    "packed.unknown": "(غير معروف)",
    "packed.invalidSuffix": " (قيمة غير صالحة)",
    "packed.invalid": "(غير متاح)",
    "packed.negativeSuffix": " (سالب غير صالح للمساحة)",
    "packed.table.showButton": "عرض البيانات كجدول",
    "packed.table.hideButton": "إخفاء جدول البيانات",
    "packed.table.unitHead": "الوحدة",
    "packed.table.periodHead": "الفترة",
    "packed.table.scaleHead": "المقياس",
    "packed.table.separator": "، ",
    "packed.table.categoryHead": "الفئة",
    "packed.table.valueHead": "القيمة",
    "packed.scaleError": "تعذّر رسم المقارنة بهذا المقياس. القيم معروضة في المفتاح دون رسم.",
    "packed.zeroDetailMax": '" صفر',
    "packed.zeroDetailWithPositive": " بينما توجد قيم موجبة؛ تعارض بيانات: لا مقارنة مساحية من مقياس صفر ولا استبدال تلقائي للمقياس.",
    "packed.zeroDetailNoPositive": " ولا توجد قيم موجبة للمقارنة.",
    "packed.invalidDetail": '" غير صالح (سالب أو غير رقمي) للمقارنة المساحية.',
    "packed.empty": "لا توجد قيم موجبة قابلة للرسم المساحي.",
    "packed.tooManyCategoriesError": "تعذر عرض الدوائر لمقارنة أكثر من خمس فئات موجبة. القيم الكاملة معروضة في المفتاح."
  };

  // components/data/data.js
  registerLabels("data", defaults4);
  var MICRO_LABELS_FAMILY5 = "data";
  function L3(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY5) || currentInstanceLabels(MICRO_LABELS_FAMILY5);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY5, key2);
  }
  function withLabels7(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY5, fn);
  }
  function applyInstanceLabels6(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY5, options.labels);
    }
  }
  var NS = "http://www.w3.org/2000/svg";
  var NUM_RE = /^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/;
  function parseNum(raw) {
    if (raw === null || raw === void 0) return null;
    var s = String(raw).trim();
    if (s === "" || !NUM_RE.test(s)) return null;
    var v = Number(s);
    return isNaN(v) || !isFinite(v) ? null : v;
  }
  function itemsOf(chart) {
    return [].slice.call(chart.querySelectorAll(".m-chart__data [data-series]")).map(function(li) {
      var raw = li.getAttribute("data-value");
      var v = parseNum(raw);
      return {
        series: li.getAttribute("data-series") || "a",
        key: li.getAttribute("data-key"),
        unit: li.hasAttribute("data-unit") ? li.getAttribute("data-unit") : chart.getAttribute("data-unit") || "",
        period: li.hasAttribute("data-period") ? li.getAttribute("data-period") : chart.getAttribute("data-period") || "",
        label: li.getAttribute("data-label") || "",
        /* R3-UI02: قراءة كاملة اختيارية يمررها المستهلك — إن غابت فهي
           data-label نفسه؛ يستخدمها القصّ في aria-label/<title>.
           المكوّن العام لا يفترض أن كل label تاريخ — يعرض ما مرره
           المستهلك، والقراءة الكاملة سمة اختيارية (عقد specification.md) */
        labelFull: li.getAttribute("data-label-full") || li.getAttribute("data-label") || "",
        axisX: li.getAttribute("data-x"),
        axisBoundary: li.hasAttribute("data-axis-boundary") || li.hasAttribute("data-semantic-boundary"),
        rawValue: raw,
        invalid: v === null && raw !== null && String(raw).trim() !== "" && li.getAttribute("data-state") !== "unavailable",
        signed: chart.getAttribute("data-value-domain") === "signed" && /^(bars|line)$/.test(chart.getAttribute("data-chart")),
        value: v,
        display: li.getAttribute("data-display") || "",
        outlier: li.hasAttribute("data-outlier")
      };
    });
  }
  function svgEl(tag, attrs) {
    var el2 = document.createElementNS(NS, tag);
    for (var k in attrs) el2.setAttribute(k, attrs[k]);
    return el2;
  }
  function fmt(v) {
    return String(v);
  }
  function readingOf(item) {
    if (item.value === null) return item.invalid ? L3("value.invalid") : L3("value.unavailable");
    if (item.value < 0 && !item.signed) return (item.display || item.rawValue || fmt(item.value)) + L3("value.negativeUnplottedSuffix");
    return item.display || item.rawValue || fmt(item.value);
  }
  function fullLabelOf(chart, item) {
    var label = item.labelFull || item.label;
    var isTimeAxis = chart.getAttribute("data-chart") === "line" && chart.getAttribute("data-axis-type") === "time";
    if (isTimeAxis && item.axisX !== null && item.axisX !== "" && label.indexOf(String(item.axisX)) === -1) {
      label += L3("common.listSeparator", chart) + item.axisX;
    }
    return label;
  }
  function writeFullLabel(node2, chart, item) {
    var label = fullLabelOf(chart, item);
    var coordinate = item.axisX === null ? "" : String(item.axisX);
    var isTimeAxis = chart.getAttribute("data-chart") === "line" && chart.getAttribute("data-axis-type") === "time";
    node2.textContent = "";
    if (!isTimeAxis || !coordinate || label.indexOf(coordinate) === -1) {
      node2.textContent = label;
      return;
    }
    label.split(coordinate).forEach(function(part, index) {
      if (index) {
        var time = document.createElement("bdi");
        time.dir = "ltr";
        time.textContent = coordinate;
        node2.appendChild(time);
      }
      node2.appendChild(document.createTextNode(part));
    });
  }
  function syncChartContext(chart) {
    var heading = chart.querySelector(".m-chart__title");
    var title = chart.getAttribute("data-title");
    var contextTitle = !heading && title ? String(title).trim() : "";
    var entries = [
      ["data-unit", L3("context.unit")],
      ["data-period", L3("context.period")]
    ].map(function(entry) {
      return { key: entry[0], label: entry[1], value: String(chart.getAttribute(entry[0]) || "").trim() };
    }).filter(function(entry) {
      return entry.value !== "";
    });
    var context = chart.querySelector(".m-chart__context");
    if (!contextTitle && !entries.length) {
      if (context) context.remove();
      return;
    }
    if (!context) {
      context = document.createElement("div");
      context.className = "m-chart__context";
      if (heading) heading.insertAdjacentElement("afterend", context);
      else {
        var plot = chart.querySelector("[data-plot]");
        if (plot) chart.insertBefore(context, plot);
        else chart.insertBefore(context, chart.firstChild);
      }
    }
    context.textContent = "";
    if (contextTitle) {
      var titleNode = document.createElement("span");
      titleNode.className = "m-chart__context-title";
      titleNode.textContent = contextTitle;
      context.appendChild(titleNode);
    }
    entries.forEach(function(entry) {
      var item = document.createElement("span");
      item.className = "m-chart__context-item";
      var label = document.createElement("span");
      label.textContent = entry.label;
      var value = document.createElement("bdi");
      value.className = "m-chart__context-value";
      value.setAttribute("dir", "auto");
      value.textContent = entry.value;
      if (!isReadable(chart)) item.appendChild(label);
      if (isReadable(chart) && entry.key === "data-unit") value.setAttribute("data-reading-unit", entry.value);
      item.appendChild(value);
      context.appendChild(item);
    });
  }
  function measuredLabelStep(plot, items, cls, fontPx) {
    var probe = svgEl("svg", { width: 1, height: 1, "aria-hidden": "true" });
    probe.style.cssText = "position:absolute;visibility:hidden;overflow:visible;pointer-events:none";
    var text2 = svgEl("text", { class: cls });
    applyTextPx(text2, fontPx);
    probe.appendChild(text2);
    plot.appendChild(probe);
    var height = fontPx * 1.45;
    items.forEach(function(item) {
      text2.textContent = item.label;
      height = Math.max(height, text2.getBBox().height);
    });
    var gap = parseFloat(getComputedStyle(plot).getPropertyValue("--micro-space-1")) || 4;
    probe.remove();
    return Math.ceil(height + gap);
  }
  function fitValueReadings(chart, svg, items) {
    if (chart.getAttribute("data-value-layout") === "rows") return;
    var plot = chart.querySelector("[data-plot]");
    var bounds = svg.getBoundingClientRect();
    if (bounds.width <= 1) return;
    var labels = [].slice.call(svg.querySelectorAll(".m-chart__bar-value, .m-chart__point-value"));
    var boxes = labels.map(function(node2) {
      return node2.getBoundingClientRect();
    });
    var collision = boxes.some(function(a, i) {
      if (a.left < bounds.left + 1 || a.right > bounds.right - 1 || a.top < bounds.top - 1) return true;
      return boxes.some(function(b, j) {
        return j > i && a.left < b.right + 4 && a.right + 4 > b.left && a.top < b.bottom + 2 && a.bottom + 2 > b.top;
      });
    });
    chart.setAttribute("data-value-layout", collision ? "rows" : "plot");
    if (!collision) return;
    labels.forEach(function(node2) {
      node2.style.display = "none";
    });
    var rows = document.createElement("dl");
    rows.className = "m-chart__readings";
    rows.setAttribute("aria-label", L3("table.ariaLabel", rows));
    items.forEach(function(item) {
      var row = document.createElement("div");
      var label = document.createElement("dt");
      writeFullLabel(label, chart, item);
      var value = document.createElement("dd");
      var number = document.createElement("bdi");
      number.dir = "ltr";
      number.textContent = readingOf(item);
      value.appendChild(number);
      if (item.outlier) value.appendChild(document.createTextNode(L3("value.outlierSuffix")));
      row.appendChild(label);
      row.appendChild(value);
      rows.appendChild(row);
    });
    plot.appendChild(rows);
  }
  var DESIGN_W = 320;
  var BAR_TEXT_PX = 13;
  var LINE_TEXT_PX = 13;
  function plotGeometryOf(plot) {
    var w = plot.getBoundingClientRect().width;
    return { refW: isFinite(w) && w > 1 ? w : DESIGN_W };
  }
  function applyTextPx(t, fontPx) {
    if (fontPx) t.style.fontSize = fontPx + "px";
    return t;
  }
  function splitWord(w, maxChars) {
    var parts2 = w.split(/([-/])/);
    var segs = [];
    for (var i = 0; i < parts2.length; i += 2) {
      var seg = parts2[i];
      if (parts2[i + 1]) seg += parts2[i + 1];
      if (seg) segs.push(seg);
    }
    var merged = [];
    segs.forEach(function(s) {
      var last = merged[merged.length - 1];
      if (last !== void 0 && (last + s).length <= maxChars) merged[merged.length - 1] = last + s;
      else merged.push(s);
    });
    return merged;
  }
  function wrapLabel(text2, maxChars) {
    text2 = String(text2 || "");
    if (text2.length <= maxChars) return [text2];
    var tokens = [];
    text2.split(" ").forEach(function(w) {
      if (w.length > maxChars && /[-/]/.test(w)) {
        tokens = tokens.concat(splitWord(w, maxChars));
      } else if (w) {
        tokens.push(w);
      }
    });
    if (!tokens.length) tokens = [text2];
    var lines = [], cur = "";
    tokens.forEach(function(t) {
      var joined = cur ? cur + " " + t : t;
      if (joined.length <= maxChars || !cur) cur = joined;
      else {
        lines.push(cur);
        cur = t;
      }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  var FIT_MAX_ROUNDS = 24;
  function measuredLenOf(t) {
    try {
      return t.getComputedTextLength();
    } catch (e) {
      return 0;
    }
  }
  function truncateToBudget(t, limit) {
    var s = String(t.textContent || "");
    var guard = 0;
    while (measuredLenOf(t) > limit && s.length > 1 && guard < FIT_MAX_ROUNDS) {
      guard += 1;
      var cut = s.length - guard;
      if (cut < 1) cut = 1;
      t.textContent = s.slice(0, cut) + "…";
    }
    return guard > 0;
  }
  function fitMeasuredLabels(chart, svg, items, labelCls, budget) {
    var plot = chart.querySelector("[data-plot]");
    if (!plot || plot.getBoundingClientRect().width <= 1) return;
    var W = svg.viewBox.baseVal.width;
    var entries = [];
    [].slice.call(svg.querySelectorAll("g")).forEach(function(g, i) {
      var full = items[i] ? items[i].labelFull || items[i].label || "" : "";
      [].slice.call(g.querySelectorAll("." + labelCls)).forEach(function(t) {
        entries.push({
          t,
          full,
          cut: false,
          cx0: parseFloat(t.getAttribute("x")) || 0,
          /* مركز العمود/النقطة قبل التثبيت */
          y: t.getAttribute("y")
          /* مفتاح الصف — الصفوف تتقاسم قيم y */
        });
      });
    });
    if (!entries.length) return;
    entries.forEach(function(e) {
      if (measuredLenOf(e.t) > budget) e.cut = truncateToBudget(e.t, budget);
    });
    function clampOf(e) {
      var half = measuredLenOf(e.t) / 2;
      var x = e.cx0;
      if (x - half < 8) x = 8 + half;
      if (x + half > W - 8) x = W - 8 - half;
      if (x - half < 8) x = 8 + half;
      e.t.setAttribute("x", x);
    }
    entries.forEach(clampOf);
    var rows = {};
    entries.forEach(function(e) {
      (rows[e.y] = rows[e.y] || []).push(e);
    });
    Object.keys(rows).forEach(function(yk) {
      var row = rows[yk];
      row.sort(function(a2, b2) {
        return a2.cx0 - b2.cx0;
      });
      var guard = 0, changed2 = true;
      while (changed2 && guard < FIT_MAX_ROUNDS) {
        guard += 1;
        changed2 = false;
        for (var i = 0; i < row.length - 1; i++) {
          var a = row[i], b = row[i + 1];
          var ax = parseFloat(a.t.getAttribute("x")) || 0;
          var bx = parseFloat(b.t.getAttribute("x")) || 0;
          var aHalf = measuredLenOf(a.t) / 2, bHalf = measuredLenOf(b.t) / 2;
          if (ax + aHalf >= bx - bHalf - 1) {
            var wide;
            if (bHalf > aHalf) wide = b;
            else if (aHalf > bHalf) wide = a;
            else {
              wide = Math.min(a.cx0, W - a.cx0) <= Math.min(b.cx0, W - b.cx0) ? a : b;
            }
            var before = wide.t.textContent;
            truncateToBudget(wide.t, measuredLenOf(wide.t) - 2);
            if (wide.t.textContent !== before) {
              wide.cut = true;
              clampOf(wide);
              changed2 = true;
            }
          }
        }
      }
    });
    entries.forEach(function(e) {
      if (!e.cut || !e.full) return;
      e.t.setAttribute("aria-label", e.full);
      var ti = svgEl("title", {});
      ti.textContent = e.full;
      e.t.appendChild(ti);
    });
    [].slice.call(svg.querySelectorAll("text")).forEach(function(t) {
      var len = measuredLenOf(t);
      if (!(len > 0)) return;
      var half = len / 2;
      var x = parseFloat(t.getAttribute("x")) || 0;
      if (x - half < 8 || x + half > W - 8) {
        if (x - half < 8) x = 8 + half;
        if (x + half > W - 8) x = W - 8 - half;
        if (x - half < 8) x = 8 + half;
        t.setAttribute("x", x);
      }
    });
  }
  function appendWrappedLabel(svg, g, text2, cx, yBottom, maxChars, cls, lineStep, fontPx) {
    var step = lineStep || 13;
    var lines = wrapLabel(text2, maxChars);
    lines.forEach(function(ln, k) {
      var t = svgEl("text", {
        class: cls,
        x: cx,
        y: yBottom - (lines.length - 1 - k) * step,
        "text-anchor": "middle"
      });
      applyTextPx(t, fontPx);
      t.textContent = ln;
      g.appendChild(t);
    });
    return lines.length;
  }
  function scaleStateOf(chart, items) {
    var raw = chart.getAttribute("data-max");
    var hasDeclared = raw !== null && String(raw).trim() !== "";
    var declared = hasDeclared ? parseNum(raw) : null;
    var largest = 0;
    items.forEach(function(it) {
      if (it.value !== null && it.value >= 0 && it.value > largest) largest = it.value;
    });
    if (!hasDeclared) return { kind: "auto", max: Math.max(largest, 1), declared: null, largest };
    if (declared === null || declared <= 0) {
      return { kind: "invalid", max: 0, declaredRaw: raw, largest };
    }
    if (largest > declared) {
      return { kind: "over", max: declared, declared, largest };
    }
    return { kind: "ok", max: declared, declared, largest };
  }
  function renderScaleRefusal(chart, items, plot, state2, userLabel, devDetail) {
    var err = document.createElement("p");
    err.className = "m-chart__error";
    err.textContent = userLabel;
    plot.appendChild(err);
    chart.setAttribute("data-scale-state", state2.kind);
    chart.setAttribute("data-scale-detail", devDetail);
    var list = document.createElement("ul");
    list.className = "m-legend";
    items.forEach(function(it) {
      var li = document.createElement("li");
      li.className = "m-legend__item";
      var sw = document.createElement("span");
      sw.className = "m-legend__swatch m-cat--" + it.series;
      li.appendChild(sw);
      var label = document.createElement("span");
      label.className = "m-legend__label";
      label.textContent = it.label;
      li.appendChild(label);
      var val = document.createElement("span");
      val.className = "m-legend__value";
      val.textContent = readingOf(it);
      li.appendChild(val);
      list.appendChild(li);
    });
    plot.appendChild(list);
  }
  function invalidMarker(svg, g, cx, base2, value, why, fontPx) {
    var r = svgEl("rect", {
      class: "m-chart__bar-unknown",
      x: cx - 14,
      y: base2 - 10,
      width: 28,
      height: 10,
      rx: 4,
      stroke: "var(--micro-warning)"
    });
    g.appendChild(r);
    var t = svgEl("text", {
      class: "m-chart__bar-value",
      x: cx,
      y: base2 - 16,
      "text-anchor": "middle",
      fill: "var(--micro-warning)"
    });
    applyTextPx(t, fontPx);
    t.textContent = fmt(value) + " (" + why + ")";
    g.appendChild(t);
  }
  function renderBars(chart, items) {
    var plot = chart.querySelector("[data-plot]");
    var scale = scaleStateOf(chart, items);
    if (scale.kind === "invalid") {
      plot.innerHTML = "";
      renderScaleRefusal(
        chart,
        items,
        plot,
        scale,
        L3("bars.rangeError"),
        'bars: data-max="' + scale.declaredRaw + L3("bars.scaleInvalidDetail")
      );
      return;
    }
    if (scale.kind === "over" && (chart.getAttribute("data-overscale") || "refuse") !== "rescale") {
      plot.innerHTML = "";
      renderScaleRefusal(
        chart,
        items,
        plot,
        scale,
        L3("bars.rangeError"),
        L3("bars.overscaleDetailPrefix") + fmt(scale.largest) + L3("bars.overscaleDetailMax") + fmt(scale.declared) + L3("bars.overscaleDetailSuffix")
      );
      return;
    }
    var max = scale.kind === "over" ? scale.largest : scale.max;
    var ts = plotGeometryOf(plot);
    var fontPx = BAR_TEXT_PX;
    var labelChars = Math.max(6, Math.floor(ts.refW / Math.max(items.length, 1) * 0.9 / 6.8));
    var maxLines = Math.max.apply(null, items.map(function(i) {
      return wrapLabel(i.label, labelChars).length;
    }).concat([1]));
    var BAR_LABEL_STEP = measuredLabelStep(plot, items, "m-chart__bar-label", fontPx);
    var extra = (maxLines - 1) * BAR_LABEL_STEP;
    var W = ts.refW, top = 30;
    var plotHeight = Math.min(128, Math.max(96, W * 0.32));
    var base2 = top + plotHeight, H = base2 + BAR_LABEL_STEP + 12 + extra;
    var colW = W / Math.max(items.length, 1);
    var ariaLabel = chart.getAttribute("data-title") || L3("bars.ariaLabel", chart);
    if (scale.kind === "over") {
      ariaLabel += L3("bars.rescaledAriaSuffix") + fmt(max) + L3("bars.rescaledAriaInsteadOf") + fmt(scale.declared);
    }
    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": ariaLabel });
    for (var grid = 1; grid < 3; grid++) {
      var gy = base2 - plotHeight * grid / 3;
      svg.appendChild(svgEl("line", { class: "m-chart__gridline", x1: 0, y1: gy, x2: W, y2: gy }));
    }
    svg.appendChild(svgEl("line", { class: "m-chart__baseline", x1: 0, y1: base2, x2: W, y2: base2 }));
    items.forEach(function(it, i) {
      var cx = colW * i + colW / 2;
      var g = svgEl("g", { class: "m-cat--" + it.series });
      if (it.value === null) {
        g.appendChild(svgEl("rect", { class: "m-chart__bar-unknown", x: cx - 14, y: base2 - 10, width: 28, height: 10, rx: 4 }));
        var u = svgEl("text", { class: "m-chart__bar-value", x: cx, y: base2 - 16, "text-anchor": "middle" });
        applyTextPx(u, fontPx);
        u.textContent = it.invalid ? L3("bars.invalidMark", u) : "—";
        g.appendChild(u);
      } else if (it.value < 0) {
        invalidMarker(svg, g, cx, base2, it.value, L3("bars.negativeUnplottedMark", svg), fontPx);
      } else {
        var h = Math.min(it.value, max) / max * (base2 - top);
        g.appendChild(svgEl("rect", {
          class: "m-chart__bar",
          x: cx - Math.min(colW * 0.21, 20),
          y: base2 - h,
          width: Math.min(colW * 0.42, 40),
          height: h,
          rx: Math.min(4, h / 2),
          fill: it.value === 0 ? "none" : "var(--micro-data-" + it.series + ")",
          stroke: it.value === 0 ? "var(--micro-text-hint)" : "none",
          "stroke-width": it.value === 0 ? 1 : 0
        }));
        var val = svgEl("text", { class: "m-chart__bar-value", x: cx, y: base2 - h - 6, "text-anchor": "middle" });
        applyTextPx(val, fontPx);
        val.textContent = readingOf(it);
        g.appendChild(val);
        if (it.outlier) {
          var o = svgEl("text", { x: cx, y: base2 - h - 20, "text-anchor": "middle", class: "m-chart__bar-value", fill: "var(--micro-warning)" });
          applyTextPx(o, fontPx);
          o.textContent = L3("bars.outlierMark", o);
          g.appendChild(o);
        }
      }
      appendWrappedLabel(svg, g, it.label, cx, H - 12, labelChars, "m-chart__bar-label", BAR_LABEL_STEP, fontPx);
      svg.appendChild(g);
    });
    plot.innerHTML = "";
    plot.appendChild(svg);
    fitMeasuredLabels(chart, svg, items, "m-chart__bar-label", colW * 0.92);
    fitValueReadings(chart, svg, items);
    if (scale.kind === "over") {
      var note2 = document.createElement("p");
      note2.className = "m-chart__scale-note";
      note2.textContent = L3("bars.rescaledNotePrefix", note2) + fmt(max) + L3("bars.rescaledNoteInsteadOf", note2) + fmt(scale.declared) + L3("bars.rescaledNoteSuffix", note2);
      plot.appendChild(note2);
      chart.setAttribute("data-scale-state", "over-rescaled");
      chart.setAttribute("data-scale-detail", L3("bars.rescaleDetailPrefix", chart) + fmt(scale.declared) + L3("bars.rescaleDetailTo", chart) + fmt(max) + L3("bars.rescaleDetailSuffix", chart));
    }
  }
  function renderSigned(chart, items, kind) {
    var plot = chart.querySelector("[data-plot]");
    plot.textContent = "";
    var known = items.filter(function(item) {
      return item.value !== null;
    });
    if (known.length === 0) {
      var emptySigned = document.createElement("p");
      emptySigned.className = "m-chart__empty";
      emptySigned.setAttribute("role", "status");
      emptySigned.textContent = L3("chart.empty", emptySigned);
      plot.appendChild(emptySigned);
      appendFullReadingRows(chart, plot, items, "");
      chart.setAttribute("data-scale-state", "empty");
      return;
    }
    var low = Math.min.apply(null, known.map(function(item) {
      return item.value;
    }).concat([0]));
    var high = Math.max.apply(null, known.map(function(item) {
      return item.value;
    }).concat([0]));
    var minRaw = chart.getAttribute("data-min"), maxRaw = chart.getAttribute("data-max");
    var minDeclared = minRaw !== null && minRaw.trim() !== "";
    var maxDeclared = maxRaw !== null && maxRaw.trim() !== "";
    var min = minDeclared ? parseNum(minRaw) : low;
    var max = maxDeclared ? parseNum(maxRaw) : high;
    var invalid = min === null || max === null || min > 0 || max < 0 || min > max || (minDeclared || maxDeclared) && min === max;
    var exceeds = !invalid && (low < min || high > max);
    if (invalid || exceeds && chart.getAttribute("data-overscale") !== "rescale") {
      renderScaleRefusal(
        chart,
        items,
        plot,
        { kind: invalid ? "invalid" : "over" },
        L3("signed.rangeError"),
        "signed: bounds must include zero and every known value; no clipping or absolute-value conversion."
      );
      return;
    }
    if (exceeds) {
      min = Math.min(low, min);
      max = Math.max(high, max);
    }
    var magnitude = Math.max(Math.abs(min), Math.abs(max), Number.MIN_VALUE);
    var a = min / magnitude, b = max / magnitude;
    if (a === b) {
      a = 0;
      b = 1;
    }
    var width = plotGeometryOf(plot).refW;
    var top = 24, height = Math.min(160, Math.max(112, width * 0.38)), bottom = top + height;
    var svg = svgEl("svg", {
      viewBox: "0 0 " + width + " " + (bottom + 28),
      role: "img",
      "aria-label": (chart.getAttribute("data-title") || L3("signed.ariaLabel", chart)) + L3("signed.ariaSuffix", chart)
    });
    function y(value) {
      return top + (b - value / magnitude) / (b - a) * height;
    }
    var zero = y(0);
    svg.appendChild(svgEl("line", {
      class: "m-chart__baseline",
      "data-zero-axis": "",
      x1: 16,
      x2: width - 16,
      y1: zero,
      y2: zero
    }));
    var zeroLabel = svgEl("text", { x: 8, y: Math.max(14, zero - 6), class: "m-chart__bar-value" });
    applyTextPx(zeroLabel, BAR_TEXT_PX);
    zeroLabel.textContent = "0";
    svg.appendChild(zeroLabel);
    var time = kind === "line" && chart.getAttribute("data-axis-type") === "time";
    var axisType = chart.getAttribute("data-axis-type") || "category";
    var times = time ? items.map(function(item) {
      return axisTimeOf(item.axisX);
    }) : null;
    if (kind === "line" && (axisType !== "time" && axisType !== "category" || times && times.some(function(value) {
      return value === null;
    }))) {
      chart.setAttribute("data-axis-state", time ? "invalid-time" : "invalid-type");
      var error = document.createElement("p");
      error.className = "m-chart__error";
      error.textContent = L3("axis.missingSetupError", error);
      plot.appendChild(error);
      appendFullReadingRows(chart, plot, items, "");
      return;
    }
    var earliest = times ? Math.min.apply(null, times) : 0;
    var latest = times ? Math.max.apply(null, times) : 0;
    var rtl = (chart.getAttribute("data-axis-dir") || "rtl") !== "ltr";
    function x(index) {
      var fraction = times ? latest === earliest ? 0.5 : (times[index] - earliest) / (latest - earliest) : (index + 0.5) / Math.max(items.length, 1);
      return 24 + (rtl ? 1 - fraction : fraction) * (width - 48);
    }
    var segment = [], indexLabels = [];
    function flush() {
      if (segment.length > 1) svg.appendChild(svgEl("polyline", {
        class: "m-chart__line",
        points: segment.join(" "),
        fill: "none",
        stroke: "var(--micro-data-line)",
        "stroke-width": 2,
        "vector-effect": "non-scaling-stroke"
      }));
      segment = [];
    }
    items.forEach(function(item, index) {
      if (item.value === null) {
        flush();
        return;
      }
      var px = x(index), py = y(item.value), mark;
      if (kind === "bars") {
        var barWidth = Math.min(32, (width - 48) / Math.max(items.length, 1) * 0.55);
        mark = svgEl("rect", {
          class: "m-chart__bar",
          x: px - barWidth / 2,
          y: Math.min(py, zero),
          width: barWidth,
          height: Math.abs(py - zero),
          rx: 2,
          fill: "var(--micro-data-" + item.series + ")"
        });
      } else {
        segment.push(px + "," + py);
        mark = svgEl("circle", {
          class: "m-chart__point",
          cx: px,
          cy: py,
          r: 4,
          fill: "var(--micro-data-a)"
        });
      }
      mark.setAttribute("data-source-index", String(index));
      var title = svgEl("title", {});
      title.textContent = fullLabelOf(chart, item) + ": " + readingOf(item);
      mark.appendChild(title);
      svg.appendChild(mark);
      var label = svgEl("text", {
        x: px,
        y: bottom + 20,
        "text-anchor": "middle",
        class: "m-chart__x-label"
      });
      applyTextPx(label, LINE_TEXT_PX);
      label.textContent = String(index + 1);
      svg.appendChild(label);
      indexLabels.push(label);
    });
    flush();
    plot.appendChild(svg);
    var accepted = [], sampled = false;
    var priority = indexLabels.length > 1 ? [indexLabels[0], indexLabels[indexLabels.length - 1]].concat(indexLabels.slice(1, -1)) : indexLabels;
    priority.forEach(function(label) {
      var box = label.getBoundingClientRect();
      var collision = accepted.some(function(other) {
        return box.left < other.right + 4 && box.right + 4 > other.left;
      });
      if (collision) {
        label.style.display = "none";
        sampled = true;
      } else accepted.push(box);
    });
    chart.setAttribute("data-index-label-layout", sampled ? "sampled" : "all");
    appendFullReadingRows(chart, plot, items, "");
    chart.setAttribute("data-value-layout", "rows");
    var rows = plot.querySelector(".m-chart__readings");
    if (rows) [].slice.call(rows.querySelectorAll("dt")).forEach(function(label, index) {
      label.insertBefore(document.createTextNode(index + 1 + ". "), label.firstChild);
    });
    chart.setAttribute("data-scale-state", exceeds ? "over-rescaled" : known.length ? "signed" : "empty");
    chart.setAttribute("data-scale-detail", "signed: min=" + min + ";max=" + max + ";zero=" + zero);
    if (exceeds) {
      var note2 = document.createElement("p");
      note2.className = "m-chart__scale-note";
      note2.textContent = L3("axis.autoExtendedNote", note2);
      plot.appendChild(note2);
    }
  }
  function renderLine(chart, items) {
    var plot = chart.querySelector("[data-plot]");
    var rtl = (chart.getAttribute("data-axis-dir") || "rtl") !== "ltr";
    var axisType = chart.getAttribute("data-axis-type") || "category";
    var timeValues = null;
    if (axisType === "time") {
      timeValues = items.map(function(item) {
        return axisTimeOf(item.axisX);
      });
      if (timeValues.some(function(value) {
        return value === null;
      })) {
        plot.innerHTML = "";
        var axisError = document.createElement("p");
        axisError.className = "m-chart__error";
        axisError.textContent = L3("axis.timeMissingWithReadings", axisError);
        plot.appendChild(axisError);
        appendFullReadingRows(chart, plot, items, L3("axis.timeMissing", chart));
        chart.setAttribute("data-axis-state", "invalid-time");
        return;
      }
    } else if (axisType !== "category") {
      plot.innerHTML = "";
      var typeError = document.createElement("p");
      typeError.className = "m-chart__error";
      typeError.textContent = L3("axis.unsupportedWithReadings", typeError);
      plot.appendChild(typeError);
      appendFullReadingRows(chart, plot, items, L3("axis.unsupported", chart));
      chart.setAttribute("data-axis-state", "invalid-type");
      return;
    }
    var scale = scaleStateOf(chart, items);
    if (scale.kind === "invalid") {
      plot.innerHTML = "";
      renderScaleRefusal(
        chart,
        items,
        plot,
        scale,
        L3("bars.rangeError"),
        'line: data-max="' + scale.declaredRaw + L3("bars.scaleInvalidDetail")
      );
      return;
    }
    if (scale.kind === "over" && (chart.getAttribute("data-overscale") || "refuse") !== "rescale") {
      plot.innerHTML = "";
      renderScaleRefusal(
        chart,
        items,
        plot,
        scale,
        L3("bars.rangeError"),
        L3("line.overscaleDetailPrefix") + fmt(scale.largest) + L3("bars.overscaleDetailMax") + fmt(scale.declared) + L3("line.overscaleDetailSuffix")
      );
      return;
    }
    var max = scale.kind === "over" ? scale.largest : scale.max;
    var ts = plotGeometryOf(plot);
    var fontPx = LINE_TEXT_PX;
    var n = Math.max(items.length, 2);
    var labelChars = Math.max(5, Math.floor((ts.refW - 48) / n / 6.8));
    var maxLines = Math.max.apply(null, items.map(function(i) {
      return wrapLabel(i.label, labelChars).length;
    }).concat([1]));
    var X_LABEL_STEP = measuredLabelStep(plot, items, "m-chart__x-label", fontPx);
    var extra = (maxLines - 1) * X_LABEL_STEP;
    var W = ts.refW, top = 30;
    var plotHeight = Math.min(144, Math.max(104, W * 0.34));
    var base2 = top + plotHeight, H = base2 + X_LABEL_STEP + 12 + extra;
    var timeMin = timeValues ? Math.min.apply(null, timeValues) : 0;
    var timeMax = timeValues ? Math.max.apply(null, timeValues) : 0;
    function xAt(i) {
      var t = timeValues ? timeMax === timeMin ? 0.5 : (timeValues[i] - timeMin) / (timeMax - timeMin) : i / (n - 1);
      return rtl ? W - 24 - t * (W - 48) : 24 + t * (W - 48);
    }
    function yAt(v) {
      return v === null ? null : base2 - v / max * (base2 - top);
    }
    var ariaLabel = chart.getAttribute("data-title") || L3("line.ariaLabel", chart);
    if (scale.kind === "over") {
      ariaLabel += L3("bars.rescaledAriaSuffix") + fmt(max) + L3("bars.rescaledAriaInsteadOf") + fmt(scale.declared);
    }
    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": ariaLabel });
    for (var grid = 1; grid < 3; grid++) {
      var gy = base2 - plotHeight * grid / 3;
      svg.appendChild(svgEl("line", { class: "m-chart__gridline", x1: 12, y1: gy, x2: W - 12, y2: gy }));
    }
    svg.appendChild(svgEl("line", { class: "m-chart__axis", x1: 12, y1: base2, x2: W - 12, y2: base2 }));
    var seg = [];
    var segments = [];
    items.forEach(function(it, i) {
      if (it.value === null || it.value < 0) {
        if (seg.length > 1) segments.push(seg);
        seg = [];
      } else {
        seg.push([xAt(i), yAt(it.value)]);
      }
    });
    if (seg.length > 1) segments.push(seg);
    segments.forEach(function(pts) {
      svg.appendChild(svgEl("polyline", { class: "m-chart__line", points: pts.map(function(p) {
        return p.join(",");
      }).join(" ") }));
    });
    items.forEach(function(it, i) {
      var x = xAt(i), y = yAt(it.value);
      var g = svgEl("g", { class: "m-cat--" + it.series, "data-point-index": i });
      if (y === null) {
        var u = svgEl("text", { class: "m-chart__point-value", x, y: base2 - 6, "text-anchor": "middle", fill: "var(--micro-text-hint)" });
        applyTextPx(u, fontPx);
        u.textContent = "—";
        g.appendChild(u);
      } else if (it.value < 0) {
        invalidMarker(svg, g, x, base2, it.value, L3("bars.negativeUnplottedMark", svg), fontPx);
      } else {
        g.appendChild(svgEl("circle", { class: "m-chart__dot", cx: x, cy: y, r: 4 }));
        var val = svgEl("text", { class: "m-chart__point-value", x, y: y - 10, "text-anchor": "middle" });
        applyTextPx(val, fontPx);
        val.textContent = readingOf(it);
        g.appendChild(val);
      }
      appendWrappedLabel(svg, g, it.label, x, H - 8, labelChars, "m-chart__x-label", X_LABEL_STEP, fontPx);
      svg.appendChild(g);
    });
    plot.innerHTML = "";
    plot.appendChild(svg);
    sampleLineLabels(chart, svg, items, timeValues);
    fitValueReadings(chart, svg, items);
    if (scale.kind === "over") {
      var note2 = document.createElement("p");
      note2.className = "m-chart__scale-note";
      note2.textContent = L3("bars.rescaledNotePrefix", note2) + fmt(max) + L3("bars.rescaledNoteInsteadOf", note2) + fmt(scale.declared) + L3("bars.rescaledNoteSuffix", note2);
      plot.appendChild(note2);
      chart.setAttribute("data-scale-state", "over-rescaled");
      chart.setAttribute("data-scale-detail", L3("line.rescaleDetailPrefix", chart) + fmt(scale.declared) + L3("bars.rescaleDetailTo", chart) + fmt(max) + L3("bars.rescaleDetailSuffix", chart));
    }
  }
  function axisTimeOf(raw) {
    if (raw === null || raw === void 0 || String(raw).trim() === "") return null;
    var s = String(raw).trim();
    var n;
    if (NUM_RE.test(s)) {
      n = Number(s);
      return isFinite(n) && Math.abs(n) <= 864e13 ? n : null;
    }
    var match = /^(\d{4})-(\d{2})-(\d{2})(?:[Tt](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2}))?$/.exec(s);
    if (!match) return null;
    var year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
    var leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    var monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month < 1 || month > 12 || day < 1 || day > monthDays[month - 1]) return null;
    if (match[4] !== void 0) {
      if (Number(match[4]) > 23 || Number(match[5]) > 59 || Number(match[6] || 0) > 59) return null;
      if (match[8] !== "Z") {
        var offset = match[8].slice(1).split(":");
        if (Number(offset[0]) > 23 || Number(offset[1]) > 59) return null;
      }
    }
    n = Date.parse(s);
    return isFinite(n) && Math.abs(n) <= 864e13 ? n : null;
  }
  function appendFullReadingRows(chart, plot, items, ariaLabel) {
    var rows = document.createElement("dl");
    rows.className = "m-chart__readings";
    rows.setAttribute("aria-label", ariaLabel || L3("table.ariaLabel", rows));
    items.forEach(function(item) {
      var row = document.createElement("div");
      var label = document.createElement("dt");
      writeFullLabel(label, chart, item);
      var value = document.createElement("dd");
      var number = document.createElement("bdi");
      number.dir = "ltr";
      number.textContent = readingOf(item);
      value.appendChild(number);
      if (item.outlier) value.appendChild(document.createTextNode(L3("value.outlierSuffix")));
      row.appendChild(label);
      row.appendChild(value);
      rows.appendChild(row);
    });
    plot.appendChild(rows);
    return rows;
  }
  function sampleLineLabels(chart, svg, items, timeValues) {
    var W = svg.viewBox.baseVal.width;
    var candidates = [];
    var timeMin = timeValues ? Math.min.apply(null, timeValues) : null;
    var timeMax = timeValues ? Math.max.apply(null, timeValues) : null;
    [].slice.call(svg.querySelectorAll("g[data-point-index]")).forEach(function(g) {
      var index = Number(g.getAttribute("data-point-index"));
      var endpoint = index === 0 || index === items.length - 1 || timeValues && (timeValues[index] === timeMin || timeValues[index] === timeMax);
      var labels = [].slice.call(g.querySelectorAll(".m-chart__x-label"));
      if (endpoint && labels.length) {
        var labelLeft = Infinity, labelRight = -Infinity;
        labels.forEach(function(label) {
          var length = measuredLenOf(label);
          var cx = parseFloat(label.getAttribute("x")) || 0;
          labelLeft = Math.min(labelLeft, cx - length / 2 - 1);
          labelRight = Math.max(labelRight, cx + length / 2 + 1);
        });
        var shift = 0;
        if (labelLeft < 8 && labelRight <= W - 8) {
          var inwardFromLeft = 8 - labelLeft;
          if (labelRight + inwardFromLeft <= W - 8) shift = inwardFromLeft;
        } else if (labelRight > W - 8 && labelLeft >= 8) {
          var inwardFromRight = W - 8 - labelRight;
          if (labelLeft + inwardFromRight >= 8) shift = inwardFromRight;
        }
        if (shift) {
          labels.forEach(function(label) {
            var x = parseFloat(label.getAttribute("x")) || 0;
            label.setAttribute("x", x + shift);
          });
        }
      }
      var boxes = labels.map(function(label) {
        var length = measuredLenOf(label);
        var bbox;
        try {
          bbox = label.getBBox();
        } catch (e) {
          bbox = { y: 0, height: LINE_TEXT_PX * 1.45 };
        }
        var cx = parseFloat(label.getAttribute("x")) || 0;
        return {
          left: cx - length / 2 - 1,
          right: cx + length / 2 + 1,
          top: bbox.y - 1,
          bottom: bbox.y + bbox.height + 1
        };
      });
      var splitFragment = labels.some(function(label) {
        return String(label.textContent || "").trim().length === 1 && String(items[index].label || "").trim().length > 1;
      });
      candidates.push({
        index,
        labels,
        boxes,
        protected: items[index].axisBoundary || endpoint,
        priority: items[index].axisBoundary ? 0 : endpoint ? 1 : 2,
        splitFragment
      });
    });
    candidates.sort(function(a, b) {
      return a.priority - b.priority || a.index - b.index;
    });
    function intersects(a, b) {
      return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }
    var selected = [], protectedConflict = false;
    candidates.forEach(function(candidate) {
      var canFit = !candidate.splitFragment && candidate.boxes.every(function(box) {
        return box.left >= 8 && box.right <= W - 8 && !selected.some(function(prior) {
          return prior.boxes.some(function(priorBox) {
            return intersects(box, priorBox);
          });
        });
      });
      if (canFit) selected.push(candidate);
      else if (candidate.protected) protectedConflict = true;
    });
    if (protectedConflict) {
      candidates.forEach(function(candidate) {
        candidate.labels.forEach(function(label) {
          label.style.display = "none";
        });
      });
      [].slice.call(svg.querySelectorAll(".m-chart__point-value")).forEach(function(label) {
        label.style.display = "none";
      });
      chart.setAttribute("data-value-layout", "rows");
      appendFullReadingRows(
        chart,
        chart.querySelector("[data-plot]"),
        items,
        L3("line.readingsAriaLabel")
      );
      return;
    }
    var selectedSet = new Set(selected);
    candidates.forEach(function(candidate) {
      if (selectedSet.has(candidate)) return;
      candidate.labels.forEach(function(label) {
        label.style.display = "none";
      });
    });
  }
  function donutRefusal(chart, plot, stateKind, devDetail) {
    var err = document.createElement("p");
    err.className = "m-chart__error";
    err.textContent = L3("donut.rangeError", err);
    plot.appendChild(err);
    chart.setAttribute("data-scale-state", stateKind);
    chart.setAttribute("data-scale-detail", devDetail);
  }
  function fitDonutReading(plot, svg) {
    var value = svg.querySelector(".m-donut__center");
    var label = svg.querySelector(".m-donut__center-label");
    if (!value || !label || plot.getBoundingClientRect().width <= 1) return;
    var vb = value.getBBox(), lb = label.getBBox();
    function fits(box) {
      var dx = Math.max(Math.abs(box.x - 74), Math.abs(box.x + box.width - 74));
      var dy = Math.max(Math.abs(box.y - 74), Math.abs(box.y + box.height - 74));
      return dx * dx + dy * dy <= 48 * 48;
    }
    if (fits(vb) && fits(lb) && vb.y + vb.height <= lb.y + 2) return;
    var reading = document.createElement("div");
    reading.className = "m-donut__reading";
    var number = document.createElement("span");
    number.className = "m-donut__number";
    number.textContent = value.textContent;
    var caption = document.createElement("span");
    caption.className = "m-donut__reading-label";
    caption.textContent = label.textContent;
    reading.appendChild(number);
    reading.appendChild(caption);
    value.remove();
    label.remove();
    plot.appendChild(reading);
  }
  function renderDonut(chart, items) {
    var plot = chart.querySelector("[data-plot]");
    var declaredRaw = chart.getAttribute("data-total");
    var hasDeclaredAttr = declaredRaw !== null && String(declaredRaw).trim() !== "";
    var declared = hasDeclaredAttr ? parseNum(declaredRaw) : null;
    var declaredInvalid = hasDeclaredAttr && declared === null;
    var declaredNegative = hasDeclaredAttr && declared !== null && declared < 0;
    var declaredZero = hasDeclaredAttr && declared === 0;
    var hasDeclared = declared !== null && declared > 0;
    var total = hasDeclared ? declared : 0;
    var known = items.filter(function(i) {
      return i.value !== null && i.value >= 0;
    });
    var invalid = items.filter(function(i) {
      return i.value !== null && i.value < 0;
    });
    var malformed = items.some(function(i) {
      return i.invalid;
    });
    var missing = items.filter(function(i) {
      return i.value === null;
    });
    var sum = known.reduce(function(a, i) {
      return a + i.value;
    }, 0);
    var R = 58, C = 2 * Math.PI * R, cx = 74, cy = 74;
    var svg = svgEl("svg", { class: "m-donut__svg", viewBox: "0 0 148 148", role: "img", "aria-label": chart.getAttribute("data-title") || L3("donut.ariaLabel", svg) });
    plot.innerHTML = "";
    var sumExceeds = hasDeclared && sum > total;
    var hasInvalid = invalid.length > 0;
    var noData = known.length === 0 && invalid.length === 0;
    var zeroCase = known.length > 0 && sum === 0 && (missing.length === 0 || declaredZero);
    var unknownTotal = known.length > 0 && sum === 0 && missing.length > 0 && !declaredZero;
    function emptyRing(centerText, labelText) {
      svg.appendChild(svgEl("circle", {
        cx,
        cy,
        r: R,
        fill: "none",
        stroke: "var(--micro-border-divider)",
        "stroke-width": 16
      }));
      var c = svgEl("text", { class: "m-donut__center", x: cx, y: cy + 2, "text-anchor": "middle" });
      c.textContent = centerText;
      svg.appendChild(c);
      var l = svgEl("text", { class: "m-donut__center-label", x: cx, y: cy + 20, "text-anchor": "middle" });
      l.textContent = labelText;
      svg.appendChild(l);
      plot.appendChild(svg);
      fitDonutReading(plot, svg);
    }
    if (declaredInvalid) {
      donutRefusal(
        chart,
        plot,
        "invalid",
        'donut: data-total="' + declaredRaw + L3("donut.totalInvalidDetail")
      );
    } else if (!isFinite(sum)) {
      donutRefusal(
        chart,
        plot,
        "invalid",
        "donut: sum exceeds the finite Number range; proportions refused and original readings retained."
      );
    } else if (malformed) {
      donutRefusal(
        chart,
        plot,
        "invalid",
        "donut: invalid category value; proportions refused rather than treating malformed input as a missing or zero quantity."
      );
    } else if (hasInvalid || sumExceeds) {
      donutRefusal(
        chart,
        plot,
        hasInvalid ? "invalid" : "over",
        hasInvalid ? L3("donut.negativeValuesDetail") : L3("donut.oversumDetailPrefix") + fmt(sum) + L3("donut.oversumDetailMax") + fmt(total) + L3("donut.oversumDetailSuffix")
      );
    } else if (declaredNegative) {
      donutRefusal(
        chart,
        plot,
        "invalid",
        'donut: data-total="' + declaredRaw + L3("donut.negativeTotalDetail")
      );
    } else if (declaredZero && sum > 0) {
      donutRefusal(
        chart,
        plot,
        "conflict",
        L3("donut.zeroTotalDetailPrefix") + fmt(sum) + L3("donut.zeroTotalDetailSuffix")
      );
    } else if (noData) {
      var emptyDonut = document.createElement("p");
      emptyDonut.className = "m-chart__empty";
      emptyDonut.setAttribute("role", "status");
      emptyDonut.textContent = L3("chart.empty", emptyDonut);
      plot.appendChild(emptyDonut);
      chart.setAttribute("data-scale-state", "empty");
    } else if (unknownTotal) {
      emptyRing("—", L3("donut.totalUnknown"));
    } else if (zeroCase) {
      emptyRing(hasDeclared ? fmt(total) : "0", chart.getAttribute("data-total-label") || L3("donut.totalLabel", chart));
    } else {
      var denom = hasDeclared ? total : sum;
      var offset = 0;
      known.forEach(function(it) {
        var frac = it.value / denom;
        var len = frac * C;
        var segC = svgEl("circle", {
          cx,
          cy,
          r: R,
          fill: "none",
          stroke: "var(--micro-data-" + it.series + ")",
          "stroke-width": 16,
          "stroke-dasharray": len + " " + (C - len),
          "stroke-dashoffset": -offset,
          transform: "rotate(-90 " + cx + " " + cy + ")"
        });
        svg.appendChild(segC);
        offset += len;
      });
      [R - 8, R + 8].forEach(function(radius) {
        svg.appendChild(svgEl("circle", {
          cx,
          cy,
          r: radius,
          fill: "none",
          "aria-hidden": "true",
          stroke: "var(--micro-data-boundary)",
          "stroke-width": 1,
          "vector-effect": "non-scaling-stroke"
        }));
      });
      if (known.length > 1) {
        var bOff = 0;
        known.forEach(function(it, k) {
          if (k === 0) return;
          bOff += it.value / denom * C;
          var angle = (-90 + bOff / C * 360) * Math.PI / 180;
          svg.appendChild(svgEl("line", {
            x1: cx + (R - 8) * Math.cos(angle),
            y1: cy + (R - 8) * Math.sin(angle),
            x2: cx + (R + 8) * Math.cos(angle),
            y2: cy + (R + 8) * Math.sin(angle),
            "aria-hidden": "true",
            stroke: "var(--micro-data-boundary)",
            "stroke-width": 1,
            "vector-effect": "non-scaling-stroke"
          }));
        });
      }
      var center = svgEl("text", { class: "m-donut__center", x: cx, y: cy + 2, "text-anchor": "middle" });
      center.textContent = fmt(denom);
      svg.appendChild(center);
      var clab = svgEl("text", { class: "m-donut__center-label", x: cx, y: cy + 20, "text-anchor": "middle" });
      clab.textContent = chart.getAttribute("data-total-label") || (missing.length && !hasDeclared ? L3("donut.knownSumLabel") : L3("donut.totalLabel"));
      svg.appendChild(clab);
      plot.appendChild(svg);
      fitDonutReading(plot, svg);
    }
    var noPercent = malformed || declaredInvalid || declaredNegative || declaredZero && sum > 0 || sumExceeds || hasInvalid || noData || unknownTotal || zeroCase;
    var legend = document.createElement("ul");
    legend.className = "m-legend";
    known.forEach(function(it) {
      var li = document.createElement("li");
      li.className = "m-legend__item m-cat--" + it.series;
      var sw = document.createElement("span");
      sw.className = "m-legend__swatch";
      li.appendChild(sw);
      var label = document.createElement("span");
      label.className = "m-legend__label";
      label.textContent = it.label;
      li.appendChild(label);
      var val = document.createElement("span");
      val.className = "m-legend__value";
      val.textContent = fmt(it.value) + (noPercent ? "" : " (" + Math.round(it.value / (hasDeclared ? total : sum) * 100) + "%)");
      li.appendChild(val);
      legend.appendChild(li);
    });
    missing.concat(invalid).forEach(function(it) {
      var li = document.createElement("li");
      li.className = "m-legend__item";
      var label = document.createElement("span");
      label.className = "m-legend__label";
      label.textContent = it.label;
      li.appendChild(label);
      var val = document.createElement("span");
      val.className = "m-legend__value";
      val.textContent = it.value === null ? it.invalid ? String(it.rawValue) + L3("donut.invalidValueSuffix") : L3("value.unavailable") : fmt(it.value) + L3("donut.invalidShareSuffix");
      li.appendChild(val);
      legend.appendChild(li);
    });
    if (items.length) plot.appendChild(legend);
    readableLegend(chart, items, legend, !noPercent && isFinite(hasDeclared ? total : sum) ? hasDeclared ? total : sum : null);
  }
  var chartUid = 0;
  function ensureId(el2, prefix) {
    if (!el2.id) el2.id = prefix + "-" + ++chartUid;
    return el2.id;
  }
  function linkChartName(chart) {
    var svg = chart.querySelector('[data-plot] > svg[role="img"]');
    if (!svg) return;
    var titleEl = chart.querySelector(".m-chart__title");
    if (titleEl && String(titleEl.textContent || "").trim()) {
      svg.setAttribute("aria-labelledby", ensureId(titleEl, "micro-chart-title"));
      svg.removeAttribute("aria-label");
    }
    var summary2 = chart.querySelector("[data-summary]");
    if (summary2) svg.setAttribute("aria-describedby", ensureId(summary2, "micro-chart-summary"));
  }
  function valueStateText(it) {
    if (it.value === null) {
      if (it.invalid) {
        var raw = it.rawValue !== null && String(it.rawValue).trim() !== "" ? String(it.rawValue) + " " : "";
        return raw + L3("donut.invalidReading");
      }
      return L3("value.unavailable");
    }
    var base2 = it.rawValue === null ? fmt(it.value) : String(it.rawValue);
    if (it.value < 0 && !it.signed) return base2 + L3("value.negativeUnplottedSuffix");
    return it.outlier ? base2 + L3("value.outlierSuffix") : base2;
  }
  function syncDatasetTable(chart, items) {
    var wrap = chart.querySelector(".m-chart__dataset-wrap");
    var btn, table;
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "m-chart__dataset-wrap";
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "m-btn m-btn--secondary m-chart__disclose";
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = L3("table.showButton", btn);
      table = document.createElement("table");
      table.className = "m-chart__dataset";
      table.hidden = true;
      wrap.appendChild(btn);
      wrap.appendChild(table);
      chart.appendChild(wrap);
    } else {
      btn = wrap.querySelector(".m-chart__disclose");
      table = wrap.querySelector(".m-chart__dataset");
    }
    if (btn) btn.classList.add("m-btn", "m-btn--secondary");
    var binding = btn && btn.__microDatasetDisclosure;
    if (btn && table && (!binding || binding.table !== table)) {
      if (binding) btn.removeEventListener("click", binding.handler);
      do {
        table.id = "micro-chart-dataset-" + ++chartUid;
      } while (document.getElementById(table.id) && document.getElementById(table.id) !== table);
      btn.setAttribute("aria-controls", table.id);
      var handler = function() {
        var open2 = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open2 ? "false" : "true");
        table.hidden = open2;
        btn.textContent = open2 ? L3("table.showButton", btn) : L3("table.hideButton", btn);
      };
      btn.__microDatasetDisclosure = { table, handler };
      btn.addEventListener("click", handler);
    }
    if (!btn || !table) return;
    table.textContent = "";
    var caption = document.createElement("caption");
    var titleEl = chart.querySelector(".m-chart__title");
    var captionParts = [String(titleEl && titleEl.textContent || chart.getAttribute("data-title") || "").trim()];
    var unitTxt = String(chart.getAttribute("data-unit") || "").trim();
    var periodTxt = String(chart.getAttribute("data-period") || "").trim();
    if (unitTxt) captionParts.push(L3("table.unitPrefix") + unitTxt);
    if (periodTxt) captionParts.push(L3("table.periodPrefix") + periodTxt);
    if (chart.getAttribute("data-chart") === "donut") {
      var totalRaw = chart.getAttribute("data-total");
      if (totalRaw !== null && String(totalRaw).trim() !== "") {
        captionParts.push((chart.getAttribute("data-total-label") || L3("donut.totalLabel", chart)) + ": " + String(totalRaw).trim());
      }
    }
    caption.textContent = captionParts.filter(function(p) {
      return p !== "";
    }).join(L3("common.listSeparator", caption));
    table.appendChild(caption);
    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    var hasTimeAxis = chart.getAttribute("data-chart") === "line" && chart.getAttribute("data-axis-type") === "time";
    (hasTimeAxis ? [L3("table.head.category"), L3("table.head.time"), L3("table.head.value")] : [L3("table.head.category"), L3("table.head.value")]).forEach(function(h) {
      var th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.textContent = h;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    items.forEach(function(it) {
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      th.setAttribute("scope", "row");
      writeFullLabel(th, chart, it);
      tr.appendChild(th);
      if (hasTimeAxis) {
        var time = document.createElement("td");
        if (it.axisX === null || it.axisX === "") time.textContent = L3("value.unavailable", time);
        else {
          var coordinate = document.createElement("bdi");
          coordinate.dir = "ltr";
          coordinate.textContent = it.axisX;
          time.appendChild(coordinate);
        }
        tr.appendChild(time);
      }
      var td = document.createElement("td");
      var fullValue = valueStateText(it);
      var rawValue = it.value !== null ? it.rawValue === null ? fmt(it.value) : String(it.rawValue) : it.invalid && it.rawValue !== null && String(it.rawValue).trim() ? String(it.rawValue) : null;
      if (rawValue !== null) {
        var number = document.createElement("bdi");
        number.dir = it.value === null ? "auto" : "ltr";
        number.textContent = rawValue;
        td.appendChild(number);
        td.appendChild(document.createTextNode(fullValue.slice(rawValue.length)));
      } else td.textContent = fullValue;
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }
  function renderBubbles(chart, items) {
    var plot = chart.querySelector("[data-plot]");
    var rmaxAttr = parseNum(chart.getAttribute("data-rmax"));
    var Rmax = rmaxAttr !== null && rmaxAttr > 0 ? rmaxAttr : 52;
    var positive = items.filter(function(i) {
      return i.value !== null && i.value > 0;
    });
    var rawMax = chart.getAttribute("data-max");
    var hasDeclared = rawMax !== null && String(rawMax).trim() !== "";
    var declared = hasDeclared ? parseNum(rawMax) : null;
    var largest = positive.length ? Math.max.apply(null, positive.map(function(i) {
      return i.value;
    })) : 0;
    var scaleKind = "auto";
    if (hasDeclared) {
      if (declared === null || declared <= 0) scaleKind = "invalid";
      else if (largest > declared) scaleKind = "over";
      else scaleKind = "ok";
    }
    if (scaleKind === "invalid") {
      plot.innerHTML = "";
      renderScaleRefusal(
        chart,
        items,
        plot,
        { kind: "invalid" },
        L3("bubbles.rangeError"),
        'bubbles: data-max="' + rawMax + L3("bubbles.scaleInvalidDetail")
      );
      return;
    }
    if (scaleKind === "over" && (chart.getAttribute("data-overscale") || "refuse") !== "rescale") {
      plot.innerHTML = "";
      renderScaleRefusal(
        chart,
        items,
        plot,
        { kind: "over" },
        L3("bubbles.rangeError"),
        L3("bubbles.overscaleDetailPrefix") + fmt(largest) + L3("bars.overscaleDetailMax") + fmt(declared) + L3("bubbles.overscaleDetailSuffix")
      );
      return;
    }
    var vmax = scaleKind === "ok" ? declared : Math.max(largest, 1);
    var wrap = document.createElement("div");
    wrap.className = "m-bubbles";
    items.forEach(function(it) {
      var b = document.createElement("div");
      b.className = "m-bubble m-cat--" + it.series;
      var circ = svgEl("svg", { viewBox: "0 0 100 100", "aria-hidden": "true", focusable: "false" });
      var valTxt = document.createElement("span");
      valTxt.className = "m-bubble__value";
      var lab = document.createElement("span");
      lab.className = "m-bubble__label";
      lab.textContent = it.label;
      if (it.value === null) {
        circ.setAttribute("class", "m-bubble__circle--none");
        valTxt.textContent = L3("value.unavailable", valTxt);
      } else if (it.value < 0) {
        circ.setAttribute("class", "m-bubble__circle--none");
        valTxt.textContent = fmt(it.value) + L3("bubbles.negativeAreaSuffix", valTxt);
      } else if (it.value === 0) {
        circ.setAttribute("class", "m-bubble__circle--none");
        valTxt.textContent = "0";
      } else {
        var r = Rmax * Math.sqrt(it.value / vmax);
        circ.setAttribute("class", "m-bubble__circle");
        circ.style.width = circ.style.height = r * 2 + "px";
        valTxt.textContent = fmt(it.value);
      }
      if (circ.classList.contains("m-bubble__circle--none")) {
        circ.style.width = circ.style.height = "14px";
        circ.appendChild(svgEl("circle", { cx: 50, cy: 50, r: 44, "stroke-dasharray": "3 3" }));
      } else {
        circ.appendChild(svgEl("circle", { cx: 50, cy: 50, r: 50 }));
      }
      b.appendChild(valTxt);
      b.appendChild(circ);
      b.appendChild(lab);
      wrap.appendChild(b);
    });
    plot.innerHTML = "";
    plot.appendChild(wrap);
    if (scaleKind === "over") {
      var note2 = document.createElement("p");
      note2.className = "m-chart__scale-note";
      note2.textContent = L3("bubbles.rescaledNotePrefix", note2) + fmt(vmax) + L3("bars.rescaledNoteInsteadOf", note2) + fmt(declared) + L3("bars.rescaledNoteSuffix", note2);
      plot.appendChild(note2);
      chart.setAttribute("data-scale-state", "over-rescaled");
      chart.setAttribute("data-scale-detail", L3("bubbles.rescaleDetailPrefix", chart) + fmt(declared) + L3("bars.rescaleDetailTo", chart) + fmt(vmax) + L3("bubbles.rescaleDetailSuffix", chart));
    }
  }
  var renderWidths = /* @__PURE__ */ new WeakMap();
  var plotObservers = /* @__PURE__ */ new WeakMap();
  var plotFrames = /* @__PURE__ */ new WeakMap();
  var disconnectedCharts = /* @__PURE__ */ new WeakSet();
  var RESIZE_EPS = 0.5;
  function observePlot(chart) {
    if (typeof ResizeObserver !== "function") return;
    if (plotObservers.has(chart)) return;
    var plot = chart.querySelector("[data-plot]");
    if (!plot) return;
    var ro = new ResizeObserver(function(entries) {
      if (disconnectedCharts.has(chart) || plotObservers.get(chart) !== ro) return;
      var w = entries.length ? entries[0].contentRect.width : 0;
      if (w <= 1) return;
      var last = renderWidths.get(chart);
      if (last !== void 0 && Math.abs(w - last) < RESIZE_EPS) return;
      if (plotFrames.has(chart)) return;
      plotFrames.set(chart, window.requestAnimationFrame(function() {
        plotFrames.delete(chart);
        if (!chart.isConnected || disconnectedCharts.has(chart) || plotObservers.get(chart) !== ro) return;
        var width = plot.getBoundingClientRect().width;
        var renderedWidth = renderWidths.get(chart);
        if (width <= 1 || renderedWidth !== void 0 && Math.abs(width - renderedWidth) < RESIZE_EPS) return;
        render(chart);
      }));
    });
    ro.observe(plot);
    plotObservers.set(chart, ro);
  }
  function rememberRenderWidth(chart) {
    var plot = chart.querySelector("[data-plot]");
    if (!plot) return;
    renderWidths.set(chart, plot.getBoundingClientRect().width);
    observePlot(chart);
  }
  var readingLives = /* @__PURE__ */ new WeakMap();
  var donutReadings = /* @__PURE__ */ new WeakMap();
  var readingUid = 0;
  function isReadable(chart) {
    return chart.getAttribute("data-presentation") === "readable";
  }
  function readingNode(tag, cls, text2) {
    var el2 = document.createElement(tag);
    if (cls) el2.className = cls;
    if (text2 !== void 0) el2.textContent = text2;
    return el2;
  }
  function appendReadingUnit(parent, unit) {
    if (!unit) return;
    parent.appendChild(document.createTextNode(" "));
    var node2 = readingNode("span", "m-chart__reading-unit", unit);
    node2.setAttribute("data-reading-unit", unit);
    parent.appendChild(node2);
  }
  function appendReadableValue(parent, it, donut) {
    var full = valueStateText(it);
    var raw = it.value !== null ? String(it.rawValue === null ? it.value : it.rawValue) : it.invalid && it.rawValue !== null ? String(it.rawValue) : null;
    if (donut && it.value !== null && it.value < 0) full = raw + L3("donut.invalidShareSuffix");
    if (raw === null) parent.appendChild(readingNode("span", null, full));
    else {
      var bdi = readingNode("bdi", null, it.value !== null && it.display ? it.display : raw);
      bdi.dir = it.value === null ? "auto" : "ltr";
      parent.appendChild(bdi);
      if (full.length > raw.length) parent.appendChild(readingNode("span", "m-chart__reading-state", full.slice(raw.length)));
    }
  }
  function selectionItems(chart, items) {
    if (chart.getAttribute("data-selection") !== "single" || !/^(bars|line|donut)$/.test(chart.getAttribute("data-chart"))) return null;
    if (isReadable(chart) && mixedReadingContext(items)) return null;
    var seen = /* @__PURE__ */ new Set();
    if (!items.length || items.some(function(it) {
      if (it.key === null || !it.key.trim() || seen.has(it.key)) return true;
      seen.add(it.key);
      return false;
    })) return null;
    return items;
  }
  function selectionSnapshot(chart, items) {
    items = items || itemsOf(chart);
    if (!selectionItems(chart, items)) return null;
    var key2 = chart.getAttribute("data-selected-key");
    var it = items.find(function(item) {
      return item.key === key2;
    });
    if (!it) return null;
    var meta = donutReadings.get(chart);
    return {
      key: it.key,
      label: fullLabelOf(chart, it),
      value: it.value,
      rawValue: it.rawValue,
      display: it.display,
      invalid: it.invalid,
      unit: it.unit,
      period: it.period,
      share: meta && meta.denominator > 0 && it.value !== null && it.value >= 0 ? it.value / meta.denominator : null
    };
  }
  function setReadingSelection(chart, key2, user) {
    var items = itemsOf(chart);
    if (!selectionItems(chart, items)) return null;
    if (disconnectedCharts.has(chart)) return selectionSnapshot(chart, items);
    if (key2 !== null && !items.some(function(it) {
      return it.key === key2;
    })) return selectionSnapshot(chart, items);
    var old = chart.getAttribute("data-selected-key");
    if (key2 === null) chart.removeAttribute("data-selected-key");
    else chart.setAttribute("data-selected-key", key2);
    updateReadingSelection(chart, items);
    var result = selectionSnapshot(chart, items);
    if (user && old !== chart.getAttribute("data-selected-key")) {
      chart.dispatchEvent(new CustomEvent("micro-data:selection-change", { bubbles: true, detail: result }));
    }
    return result;
  }
  function disposeReading(chart) {
    var life = readingLives.get(chart);
    if (life) {
      life.controller.abort();
      life.box.remove();
      readingLives.delete(chart);
    }
    [].slice.call(chart.querySelectorAll("[data-reading-choice]")).forEach(function(button) {
      button.disabled = true;
      button.removeAttribute("aria-pressed");
    });
  }
  function focusAvailableReading(chart, preferred) {
    var candidates = [preferred].concat([].slice.call(chart.querySelectorAll("[data-reading-choice], .m-chart__select-range, .m-chart__select-step, .m-chart__disclose")));
    var available2 = candidates.find(function(el2) {
      return el2 && !el2.disabled && el2.getClientRects().length && !el2.closest("[hidden]");
    });
    if (available2) available2.focus({ preventScroll: true });
  }
  function updateReadingSelection(chart, items) {
    var life = readingLives.get(chart), selected = selectionSnapshot(chart, items);
    var focusedControl = life && life.controls.contains(document.activeElement) ? document.activeElement : null;
    if (life) {
      var index = selected ? items.findIndex(function(it) {
        return it.key === selected.key;
      }) : -1;
      life.range.max = Math.max(0, items.length - 1);
      life.range.value = Math.max(0, index);
      life.range.disabled = !selected || items.length < 2;
      life.prev.disabled = index <= 0;
      life.next.disabled = index === items.length - 1;
      life.status.textContent = "";
      if (selected) {
        life.status.appendChild(readingNode("span", "m-chart__selected-label", selected.label));
        var value = readingNode("span", "m-chart__selected-value");
        appendReadableValue(value, items[index], chart.getAttribute("data-chart") === "donut");
        appendReadingUnit(value, selected.unit);
        life.status.appendChild(value);
      } else life.status.textContent = L3("reading.selectPrompt", chart);
      life.range.setAttribute("aria-valuetext", selected ? selected.label + L3("common.listSeparator", chart) + value.textContent : L3("reading.noneSelected", chart));
    }
    [].slice.call(chart.querySelectorAll("[data-reading-choice]")).forEach(function(button) {
      var active = !!selected && button.getAttribute("data-reading-choice") === selected.key;
      button.setAttribute("aria-pressed", String(active));
      var pct = button.querySelector("[data-reading-share]");
      if (pct) pct.hidden = !active;
    });
    [].slice.call(chart.querySelectorAll("[data-reading-key]")).forEach(function(el2) {
      el2.setAttribute("data-reading-selected", String(!!selected && el2.getAttribute("data-reading-key") === selected.key));
    });
    if (globalApi("Readings")) globalApi("Readings").sync(chart);
    if (focusedControl && focusedControl.disabled && (document.activeElement === focusedControl || document.activeElement === document.body)) focusAvailableReading(chart, life.range);
  }
  function readableLegend(chart, items, legend, denominator) {
    if (!isReadable(chart) && chart.getAttribute("data-selection") !== "single") return;
    donutReadings.set(chart, { denominator });
    legend.textContent = "";
    var enabled = !!selectionItems(chart, items);
    items.forEach(function(it) {
      var li = readingNode("li", "m-legend__item m-cat--" + it.series);
      var row = readingNode(enabled ? "button" : "div", "m-chart__legend-row");
      if (enabled) {
        row.type = "button";
        row.setAttribute("data-reading-choice", it.key);
        row.setAttribute("aria-pressed", "false");
      }
      var swatch = readingNode("span", "m-legend__swatch");
      swatch.setAttribute("aria-hidden", "true");
      row.appendChild(swatch);
      row.appendChild(readingNode("span", "m-legend__label", fullLabelOf(chart, it)));
      var value = readingNode("span", "m-legend__value");
      appendReadableValue(value, it, true);
      appendReadingUnit(value, it.unit);
      if (enabled && denominator > 0 && it.value !== null && it.value >= 0) {
        var share = readingNode("span", "m-chart__share", Math.round(it.value / denominator * 100) + "%");
        share.dir = "ltr";
        share.setAttribute("data-reading-share", "");
        share.setAttribute("aria-label", share.textContent + L3("reading.shareSuffix", share));
        share.hidden = true;
        value.appendChild(share);
      }
      row.appendChild(value);
      li.appendChild(row);
      legend.appendChild(li);
    });
  }
  function mixedReadingContext(items) {
    return items.length > 0 && items.some(function(it) {
      return it.unit !== items[0].unit || it.period !== items[0].period;
    });
  }
  function readableFallback(chart, items) {
    var plot = chart.querySelector("[data-plot]");
    plot.textContent = "";
    var list = readingNode("dl", "m-chart__readings");
    items.forEach(function(it) {
      var row = readingNode("div");
      row.appendChild(readingNode("dt", null, fullLabelOf(chart, it)));
      var value = readingNode("dd");
      appendReadableValue(value, it, chart.getAttribute("data-chart") === "donut");
      appendReadingUnit(value, it.unit || L3("reading.unitUnspecified"));
      if (it.period) value.appendChild(readingNode("span", "m-chart__reading-period", " · " + it.period));
      row.appendChild(value);
      list.appendChild(row);
    });
    plot.appendChild(list);
    chart.setAttribute("data-reading-state", "mixed-context");
  }
  function syncReadable(chart, items) {
    var readable = isReadable(chart), valid = selectionItems(chart, items);
    if (!readable && chart.getAttribute("data-selection") !== "single") {
      chart.removeAttribute("data-selection-state");
      disposeReading(chart);
      return;
    }
    if (readable) {
      var mixed = mixedReadingContext(items);
      var rows = chart.querySelectorAll(".m-chart__dataset tbody tr");
      [].slice.call(rows).forEach(function(row, i) {
        var cell = row.querySelector("td:last-of-type");
        if (cell && items[i]) appendReadingUnit(cell, items[i].unit);
        if (mixed && items[i]) {
          var periodCell = readingNode("td"), period = readingNode("bdi", null, items[i].period || L3("reading.periodUnspecified", periodCell));
          period.dir = "auto";
          periodCell.appendChild(period);
          row.appendChild(periodCell);
        }
      });
      if (mixed) {
        var head = chart.querySelector(".m-chart__dataset thead tr");
        if (head) {
          var periodHead = readingNode("th", null, L3("context.period", head));
          periodHead.scope = "col";
          head.appendChild(periodHead);
        }
        var caption = chart.querySelector(".m-chart__dataset caption");
        var title = chart.querySelector(".m-chart__title");
        var titleText = title ? title.textContent.trim() : (chart.getAttribute("data-title") || "").trim();
        if (caption) caption.textContent = (titleText ? titleText + " — " : "") + L3("reading.caption", caption);
      }
    }
    if (!valid) {
      disposeReading(chart);
      if (chart.getAttribute("data-selection") === "single") {
        chart.setAttribute("data-selection-state", readable && mixedReadingContext(items) ? "mixed-context" : items.length ? "invalid-keys" : "empty");
        chart.removeAttribute("data-selected-key");
      } else chart.removeAttribute("data-selection-state");
      if (globalApi("Readings")) globalApi("Readings").sync(chart);
      return;
    }
    chart.setAttribute("data-selection-state", "ready");
    var marks = chart.querySelectorAll("[data-plot] > svg > [data-source-index], [data-plot] > svg > g");
    [].slice.call(marks).forEach(function(mark, index) {
      var sourceIndex = mark.hasAttribute("data-source-index") ? Number(mark.getAttribute("data-source-index")) : mark.hasAttribute("data-point-index") ? Number(mark.getAttribute("data-point-index")) : index;
      if (items[sourceIndex]) mark.setAttribute("data-reading-key", items[sourceIndex].key);
    });
    if (!items.some(function(it) {
      return it.key === chart.getAttribute("data-selected-key");
    })) chart.removeAttribute("data-selected-key");
    var life = readingLives.get(chart);
    if (!life || !chart.contains(life.box)) {
      let on5 = function(el2, type8, fn) {
        el2.addEventListener(type8, fn, { signal: controller.signal });
      }, step = function(amount) {
        var current = itemsOf(chart), key2 = chart.getAttribute("data-selected-key");
        var index = current.findIndex(function(it) {
          return it.key === key2;
        });
        var target = index < 0 ? amount > 0 ? 0 : current.length - 1 : Math.max(0, Math.min(current.length - 1, index + amount));
        if (current[target]) setReadingSelection(chart, current[target].key, true);
      };
      if (life) life.controller.abort();
      [].slice.call(chart.querySelectorAll('[data-reading-owned="selection"]')).forEach(function(el2) {
        el2.remove();
      });
      var box = readingNode("div", "m-chart__selection");
      box.setAttribute("data-reading-owned", "selection");
      var status2 = readingNode("p", "m-chart__selection-value");
      status2.id = "micro-data-selection-" + ++readingUid;
      status2.setAttribute("role", "status");
      box.appendChild(status2);
      var controls = readingNode("div", "m-chart__selection-controls");
      var prev3 = readingNode("button", "m-btn m-btn--secondary m-chart__select-step", L3("reading.prevButton", chart));
      prev3.type = "button";
      var range = readingNode("input", "m-chart__select-range");
      range.type = "range";
      range.min = "0";
      range.step = "1";
      range.setAttribute("aria-label", L3("reading.rangeAriaLabel", range));
      range.setAttribute("aria-describedby", status2.id);
      var next3 = readingNode("button", "m-btn m-btn--secondary m-chart__select-step", L3("reading.nextButton", chart));
      next3.type = "button";
      controls.appendChild(prev3);
      controls.appendChild(range);
      controls.appendChild(next3);
      box.appendChild(controls);
      if (chart.getAttribute("data-chart") === "donut") controls.hidden = true;
      chart.appendChild(box);
      var controller = new AbortController();
      life = { box, controls, status: status2, range, prev: prev3, next: next3, controller };
      readingLives.set(chart, life);
      on5(range, "input", function() {
        var current = itemsOf(chart);
        if (current[Number(range.value)]) setReadingSelection(chart, current[Number(range.value)].key, true);
      });
      on5(prev3, "click", function() {
        step(-1);
      });
      on5(next3, "click", function() {
        step(1);
      });
      on5(chart, "click", function(event) {
        var button = event.target.closest("[data-reading-choice]");
        if (button && chart.contains(button) && !button.disabled) setReadingSelection(chart, button.getAttribute("data-reading-choice"), true);
      });
    }
    life.controls.hidden = chart.getAttribute("data-chart") === "donut";
    var disclosure = chart.querySelector(".m-chart__dataset-wrap");
    if (disclosure && disclosure.parentNode === chart && life.box.nextElementSibling !== disclosure) chart.insertBefore(life.box, disclosure);
    life.range.dir = chart.getAttribute("data-chart") === "bars" && chart.getAttribute("data-value-domain") !== "signed" ? "ltr" : chart.getAttribute("data-axis-dir") || "rtl";
    updateReadingSelection(chart, items);
  }
  function render(chart) {
    installFontRefit();
    var focusControl = document.activeElement && chart.contains(document.activeElement) && document.activeElement.matches(".m-chart__select-range, .m-chart__select-step") ? document.activeElement : null;
    var focusChoice = document.activeElement && chart.contains(document.activeElement) && document.activeElement.closest("[data-reading-choice]");
    var focusKey = focusChoice ? focusChoice.getAttribute("data-reading-choice") : null;
    donutReadings.delete(chart);
    chart.removeAttribute("data-reading-state");
    disconnectedCharts.delete(chart);
    chart.removeAttribute("data-value-layout");
    chart.removeAttribute("data-index-label-layout");
    var kind = chart.getAttribute("data-chart");
    var items = itemsOf(chart);
    var summary2 = chart.querySelector("[data-summary]");
    chart.removeAttribute("data-scale-state");
    chart.removeAttribute("data-scale-detail");
    chart.removeAttribute("data-axis-state");
    var domain = chart.getAttribute("data-value-domain") || "non-negative";
    if (isReadable(chart) && mixedReadingContext(items)) readableFallback(chart, items);
    else if ((kind === "bars" || kind === "line" || kind === "bubbles") && items.length === 0) {
      var emptyPlot = chart.querySelector("[data-plot]");
      emptyPlot.textContent = "";
      var empty = document.createElement("p");
      empty.className = "m-chart__empty";
      empty.setAttribute("role", "status");
      empty.textContent = L3("chart.empty", empty);
      emptyPlot.appendChild(empty);
      chart.setAttribute("data-scale-state", "empty");
    } else if ((kind === "bars" || kind === "line") && domain === "signed") renderSigned(chart, items, kind);
    else if ((kind === "bars" || kind === "line") && domain !== "non-negative") {
      chart.querySelector("[data-plot]").textContent = "";
      renderScaleRefusal(
        chart,
        items,
        chart.querySelector("[data-plot]"),
        { kind: "invalid-domain" },
        L3("reading.unsupportedRangeError", chart),
        "Expected non-negative or signed value domain."
      );
    } else if (kind === "bars") renderBars(chart, items);
    else if (kind === "line") renderLine(chart, items);
    else if (kind === "donut") renderDonut(chart, items);
    else if (kind === "bubbles") renderBubbles(chart, items);
    syncChartContext(chart);
    linkChartName(chart);
    syncDatasetTable(chart, items);
    syncReadable(chart, items);
    if (focusKey !== null) {
      var replacement = [].slice.call(chart.querySelectorAll("[data-reading-choice]")).find(function(el2) {
        return el2.getAttribute("data-reading-choice") === focusKey;
      });
      if (!replacement) replacement = [].slice.call(chart.querySelectorAll("[data-reading-choice], .m-chart__select-range, .m-chart__disclose")).find(function(el2) {
        return !el2.disabled && el2.getClientRects().length;
      });
      if (replacement && !replacement.disabled) replacement.focus({ preventScroll: true });
    } else if (focusControl && (document.activeElement === document.body || document.activeElement === focusControl) && (!chart.contains(focusControl) || focusControl.disabled || !focusControl.getClientRects().length)) {
      focusAvailableReading(chart, chart.querySelector(".m-chart__select-range"));
    }
    if (kind === "bars" || kind === "line" || kind === "donut") rememberRenderWidth(chart);
    if (summary2 && chart.getAttribute("data-summary-text") !== null) {
      summary2.textContent = chart.getAttribute("data-summary-text");
    }
    chart.dispatchEvent(new CustomEvent("micro-data:rendered", { bubbles: true, detail: { kind } }));
  }
  var instances = instanceRegistry();
  function init6(root, options) {
    var scope = root || document;
    applyInstanceLabels6(scope, options);
    var existing = instances.get(scope);
    if (existing) {
      installFontRefit();
      withLabels7(scope, function() {
        var charts = [].slice.call(scope.querySelectorAll("[data-chart]"));
        if (scope.nodeType === 1 && scope.matches("[data-chart]")) charts.unshift(scope);
        charts.forEach(function(c) {
          render(c);
        });
      });
      return existing;
    }
    installFontRefit();
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد تصيير كل رسوم النطاق من DOM المصدر بعد تحديث المضيف. */
      update: function() {
        withLabels7(scope, function() {
          var charts = [].slice.call(scope.querySelectorAll("[data-chart]"));
          if (scope.nodeType === 1 && scope.matches("[data-chart]")) charts.unshift(scope);
          charts.forEach(function(c) {
            render(c);
          });
        });
      },
      /** يفك مراقبات الرصد ومستمعات القراءة — لا يمس بيانات المصدر. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown6(scope);
        instances.remove(scope);
      }
    };
    withLabels7(scope, function() {
      var charts = [].slice.call(scope.querySelectorAll("[data-chart]"));
      if (scope.nodeType === 1 && scope.matches("[data-chart]")) charts.unshift(scope);
      charts.forEach(function(c) {
        render(c);
      });
    });
    instances.set(scope, instance);
    return instance;
  }
  function getInstance6(root) {
    return instances.get(root);
  }
  function destroy6(root) {
    var instance = instances.get(root);
    if (instance) instance.destroy();
    else teardown6(root || document);
  }
  function update2(root) {
    var scope = root || document;
    var charts = [].slice.call(scope.querySelectorAll("[data-chart]"));
    if (scope.nodeType === 1 && scope.matches("[data-chart]")) charts.unshift(scope);
    charts.forEach(function(c) {
      render(c);
    });
  }
  function getSelection(chart) {
    return chart && chart.matches && chart.matches("[data-chart]") ? selectionSnapshot(chart) : null;
  }
  function setSelection(chart, key2) {
    return chart && chart.matches && chart.matches("[data-chart]") ? setReadingSelection(chart, key2, false) : null;
  }
  function disconnect6(root) {
    destroy6(root);
  }
  function teardown6(root) {
    var scope = root || document;
    [].slice.call(scope.querySelectorAll(".m-chart__disclose")).forEach(function(btn) {
      var binding = btn.__microDatasetDisclosure;
      if (binding) {
        btn.removeEventListener("click", binding.handler);
        delete btn.__microDatasetDisclosure;
      }
    });
    var charts = [].slice.call(scope.querySelectorAll("[data-chart]"));
    if (scope.matches && scope.matches("[data-chart]")) charts.unshift(scope);
    charts.forEach(function(c) {
      disconnectedCharts.add(c);
      disposeReading(c);
      if (globalApi("Readings")) globalApi("Readings").disconnect(c);
      var ro = plotObservers.get(c);
      if (ro) {
        ro.disconnect();
        plotObservers.delete(c);
      }
      if (plotFrames.has(c)) window.cancelAnimationFrame(plotFrames.get(c));
      plotFrames.delete(c);
      renderWidths.delete(c);
    });
  }
  function setLabels6(partial) {
    setLabels("data", partial);
  }
  function refitChartsOnFontsReady() {
    if (!document.fonts || !document.fonts.ready) return;
    document.fonts.ready.then(function() {
      [].slice.call(document.querySelectorAll("[data-chart]")).forEach(function(c) {
        var kind = c.getAttribute("data-chart");
        if (c.isConnected && !disconnectedCharts.has(c) && (kind === "bars" || kind === "line" || kind === "donut")) render(c);
      });
    });
  }
  var fontRefitInstalled = false;
  function installFontRefit() {
    if (fontRefitInstalled) return;
    fontRefitInstalled = true;
    refitChartsOnFontsReady();
  }

  // components/data/packed-circle.js
  var packed_circle_exports = {};
  __export(packed_circle_exports, {
    destroy: () => destroy7,
    disconnect: () => disconnect7,
    getInstance: () => getInstance7,
    init: () => init7,
    render: () => render2,
    setLabels: () => setLabels7,
    update: () => update3
  });
  registerLabels("data", defaults4);
  var MICRO_LABELS_FAMILY6 = "data";
  function L4(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY6) || currentInstanceLabels(MICRO_LABELS_FAMILY6);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY6, key2);
  }
  function withLabels8(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY6, fn);
  }
  function applyInstanceLabels7(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY6, options.labels);
    }
  }
  var NUM_RE2 = /^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/;
  var observers = /* @__PURE__ */ new WeakMap();
  var resizeFrames = /* @__PURE__ */ new WeakMap();
  var disconnected = /* @__PURE__ */ new WeakSet();
  function layoutPacked(chart, nodes2, wrap) {
    var available2 = wrap.clientWidth || chart.clientWidth;
    if (!available2 || !nodes2.length) return;
    var requested = parseNum2(getComputedStyle(chart).getPropertyValue("--packed-overlap"));
    requested = requested === null ? 12 : Math.max(0, requested);
    var gap = parseFloat(getComputedStyle(chart).getPropertyValue("--micro-space-4")) || 16;
    var groups = [];
    for (var i = 0; i < nodes2.length; i += 3) groups.push(nodes2.slice(i, i + 3));
    var widest = Math.max.apply(null, groups.map(function(g) {
      return g[0].diameter + (g[1] ? Math.max(g[1].diameter, g[2] ? g[2].diameter : 0) : 0);
    }));
    var factor = Math.min(1, available2 / widest);
    nodes2.forEach(function(n) {
      n.d = n.diameter * factor;
      n.circ.style.width = n.circ.style.height = n.d + "px";
      n.circ.appendChild(n.value);
      var previous = n.value.style.whiteSpace;
      n.value.style.whiteSpace = "nowrap";
      var t = n.value.getBoundingClientRect();
      n.textDiagonal = Math.hypot(t.width, t.height);
      n.inside = n.textDiagonal + 8 <= n.d;
      n.value.style.whiteSpace = previous;
      n.bubble.setAttribute("data-value-placement", n.inside ? "inside" : "outside");
      if (!n.inside) n.row.appendChild(n.value);
      n.row.setAttribute("data-external-value", n.inside ? "false" : "true");
    });
    function overlap(a, b) {
      var cap = Math.min(requested, Math.min(a.d, b.d) * 0.25);
      [a, b].forEach(function(n) {
        if (n.inside) cap = Math.min(cap, Math.max(0, (n.d - n.textDiagonal) / 2 - 2));
      });
      return Math.max(0, cap);
    }
    var top = 0;
    groups.forEach(function(g) {
      var main = g[0], a = g[1], b = g[2];
      var verticalOverlap = a && b ? overlap(a, b) : 0;
      var stackHeight = a ? a.d + (b ? b.d - verticalOverlap : 0) : 0;
      var height = Math.max(main.d, stackHeight);
      var sideOverlap = a ? Math.min(overlap(main, a), b ? overlap(main, b) : Infinity) : 0;
      var width = main.d + (a ? Math.max(a.d, b ? b.d : 0) - sideOverlap : 0);
      var start = (available2 - width) / 2;
      function position(n, x, y) {
        n.bubble.style.insetInlineStart = x + "px";
        n.bubble.style.top = top + y + "px";
        n.bubble.style.width = n.bubble.style.height = n.d + "px";
      }
      position(main, start, (height - main.d) / 2);
      if (a) position(a, start + main.d - sideOverlap, (height - stackHeight) / 2);
      if (b) position(b, start + main.d - sideOverlap, (height - stackHeight) / 2 + a.d - verticalOverlap);
      top += height + gap;
    });
    wrap.style.height = Math.max(0, top - gap) + "px";
  }
  function stateList(items) {
    var list = document.createElement("ul");
    list.className = "m-packed__states m-legend";
    list.setAttribute("aria-label", L4("packed.listAriaLabel", list));
    items.forEach(function(it) {
      var li = document.createElement("li");
      li.className = "m-legend__item m-cat--" + it.series;
      var label = document.createElement("span");
      label.textContent = it.label;
      var value = document.createElement("bdi");
      value.className = "m-legend__value";
      value.textContent = it.value === 0 ? L4("packed.zeroText", value) : stateText(it).text;
      li.appendChild(label);
      li.appendChild(value);
      list.appendChild(li);
    });
    return list;
  }
  function parseNum2(raw) {
    if (raw === null || raw === void 0) return null;
    var s = String(raw).trim();
    if (s === "" || !NUM_RE2.test(s)) return null;
    var v = Number(s);
    return isNaN(v) || !isFinite(v) ? null : v;
  }
  function itemsOf2(chart) {
    return [].slice.call(chart.querySelectorAll(".m-chart__data [data-series]")).map(function(li) {
      var hasAttr = li.hasAttribute("data-value");
      return {
        series: li.getAttribute("data-series") || "a",
        label: li.getAttribute("data-label") || "",
        fullLabel: li.getAttribute("data-label-full") || li.getAttribute("data-label") || "",
        hasAttr,
        raw: li.getAttribute("data-value"),
        value: hasAttr ? parseNum2(li.getAttribute("data-value")) : null,
        display: li.getAttribute("data-display") || ""
      };
    });
  }
  function stateText(it) {
    if (!it.hasAttr) return { text: L4("packed.unknown"), none: true };
    if (it.value === null) return { text: it.raw && it.raw.trim() ? it.raw + L4("packed.invalidSuffix") : L4("packed.invalid"), none: true };
    if (it.value < 0) {
      var num = it.display || it.raw || String(it.value);
      return { text: num + L4("packed.negativeSuffix"), none: true };
    }
    if (it.value === 0) return { text: "0", none: true };
    return { text: it.display || it.raw || String(it.value), none: false };
  }
  var packedUid = 0;
  function packedValueState(it) {
    if (!it.hasAttr) return L4("packed.unknown");
    if (it.value === null) return it.raw && it.raw.trim() ? it.raw + L4("packed.invalidSuffix") : L4("packed.invalid");
    if (it.value < 0) return (it.display || it.raw || String(it.value)) + L4("packed.negativeSuffix");
    if (it.value === 0) return L4("packed.zeroText");
    return it.display || it.raw || String(it.value);
  }
  function syncPackedTable(chart) {
    var items = itemsOf2(chart);
    var wrap = chart.querySelector(".m-chart__dataset-wrap");
    var btn, table;
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "m-chart__dataset-wrap";
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "m-btn m-btn--secondary m-chart__disclose";
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = L4("packed.table.showButton", btn);
      table = document.createElement("table");
      table.className = "m-chart__dataset";
      table.hidden = true;
      wrap.appendChild(btn);
      wrap.appendChild(table);
      chart.appendChild(wrap);
    } else {
      btn = wrap.querySelector(".m-chart__disclose");
      table = wrap.querySelector(".m-chart__dataset");
    }
    if (btn) btn.classList.add("m-btn", "m-btn--secondary");
    var binding = btn && btn.__microDatasetDisclosure;
    if (btn && table && (!binding || binding.table !== table)) {
      if (binding) btn.removeEventListener("click", binding.handler);
      do {
        table.id = "micro-packed-dataset-" + ++packedUid;
      } while (document.getElementById(table.id) && document.getElementById(table.id) !== table);
      btn.setAttribute("aria-controls", table.id);
      var handler = function() {
        var open2 = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open2 ? "false" : "true");
        table.hidden = open2;
        btn.textContent = open2 ? L4("packed.table.showButton", btn) : L4("packed.table.hideButton", btn);
      };
      btn.__microDatasetDisclosure = { table, handler };
      btn.addEventListener("click", handler);
    }
    if (!btn || !table) return;
    table.textContent = "";
    var caption = document.createElement("caption");
    var title = chart.querySelector(".m-chart__title");
    var context = [String(title && title.textContent || chart.getAttribute("data-title") || chart.getAttribute("aria-label") || "").trim()];
    [["data-unit", L4("packed.table.unitHead")], ["data-period", L4("packed.table.periodHead")], ["data-max", L4("packed.table.scaleHead")]].forEach(function(part) {
      var value = chart.getAttribute(part[0]);
      if (value && value.trim()) context.push(part[1] + ": " + value.trim());
    });
    caption.textContent = context.filter(Boolean).join(L4("packed.table.separator", caption));
    table.appendChild(caption);
    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    [L4("packed.table.categoryHead"), L4("packed.table.valueHead")].forEach(function(h) {
      var th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.textContent = h;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    items.forEach(function(it) {
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.textContent = it.fullLabel;
      tr.appendChild(th);
      var td = document.createElement("td");
      var fullValue = packedValueState(it);
      var rawValue = !it.hasAttr ? null : it.value === null ? it.raw && it.raw.trim() ? it.raw : null : it.value === 0 ? "0" : it.display || it.raw || String(it.value);
      if (rawValue !== null) {
        var number = document.createElement("bdi");
        number.dir = it.value === null ? "auto" : "ltr";
        number.textContent = rawValue;
        td.appendChild(number);
        td.appendChild(document.createTextNode(fullValue.slice(rawValue.length)));
      } else td.textContent = fullValue;
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }
  function scaleError(chart, positiveExists, vmaxDerived) {
    var raw = chart.getAttribute("data-max");
    var plot = chart.querySelector("[data-plot]");
    var err = document.createElement("p");
    err.className = "m-chart__scale-error";
    err.textContent = L4("packed.scaleError", err);
    var devDetail = parseNum2(raw) === 0 ? 'packed-circle: data-max="' + raw + L4("packed.zeroDetailMax") + (positiveExists ? L4("packed.zeroDetailWithPositive") : L4("packed.zeroDetailNoPositive")) : 'packed-circle: data-max="' + raw + L4("packed.invalidDetail");
    chart.setAttribute("data-scale-detail", devDetail);
    plot.innerHTML = "";
    plot.appendChild(err);
    if (!positiveExists) {
      var empty = document.createElement("p");
      empty.className = "m-packed__empty";
      empty.setAttribute("data-empty", "");
      empty.textContent = L4("packed.empty", empty);
      plot.appendChild(empty);
      var states3 = stateList(itemsOf2(chart));
      if (states3.children.length) plot.appendChild(states3);
    } else {
      renderKeyOnly(chart);
    }
    chart.dispatchEvent(new CustomEvent("micro-packed:rendered", {
      bubbles: true,
      detail: { ok: false, reason: "scale-invalid", vmaxDerived: vmaxDerived || null }
    }));
  }
  function renderKeyOnly(chart) {
    var plot = chart.querySelector("[data-plot]");
    var legend = document.createElement("ul");
    legend.className = "m-legend";
    itemsOf2(chart).forEach(function(it) {
      var li = document.createElement("li");
      li.className = "m-legend__item m-cat--" + it.series;
      var sw = document.createElement("span");
      sw.className = "m-legend__swatch";
      li.appendChild(sw);
      li.appendChild(document.createTextNode(it.label + " "));
      var val = document.createElement("span");
      val.className = "m-legend__value";
      val.textContent = stateText(it).text;
      li.appendChild(val);
      legend.appendChild(li);
    });
    plot.appendChild(legend);
  }
  function renderPacked(chart) {
    if (observers.has(chart)) observers.get(chart).disconnect();
    observers.delete(chart);
    if (resizeFrames.has(chart)) window.cancelAnimationFrame(resizeFrames.get(chart));
    resizeFrames.delete(chart);
    var plot = chart.querySelector("[data-plot]");
    chart.removeAttribute("data-packed-state");
    var items = itemsOf2(chart);
    var positives = items.filter(function(i) {
      return i.value !== null && i.value > 0;
    });
    var rmaxAttr = parseNum2(chart.getAttribute("data-rmax"));
    var Rmax = rmaxAttr !== null && rmaxAttr > 0 ? rmaxAttr : 52;
    var maxAttr = chart.getAttribute("data-max");
    var hasMaxAttr = maxAttr !== null && String(maxAttr).trim() !== "";
    var declaredMax = hasMaxAttr ? parseNum2(maxAttr) : null;
    var vmax;
    var derived = positives.length ? Math.max.apply(null, positives.map(function(i) {
      return i.value;
    })) : 0;
    if (!hasMaxAttr) {
      vmax = derived > 0 ? derived : 1;
    } else if (declaredMax === null || declaredMax < 0) {
      scaleError(chart, positives.length > 0, derived);
      return;
    } else if (declaredMax === 0) {
      if (positives.length > 0) {
        scaleError(chart, true, derived);
        return;
      }
      vmax = 1;
    } else {
      vmax = declaredMax;
    }
    if (positives.length > 5) {
      plot.innerHTML = "";
      var densityError = document.createElement("p");
      densityError.className = "m-chart__scale-error";
      densityError.textContent = L4("packed.tooManyCategoriesError", densityError);
      plot.appendChild(densityError);
      renderKeyOnly(chart);
      chart.setAttribute("data-packed-state", "too-many-positive-categories");
      chart.dispatchEvent(new CustomEvent("micro-packed:rendered", {
        bubbles: true,
        detail: { ok: false, reason: "too-many-positive-categories", vmaxDerived: !hasMaxAttr }
      }));
      return;
    }
    plot.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "m-bubbles";
    var labels = document.createElement("ul");
    labels.className = "m-packed__labels";
    var nodes2 = [];
    var order = positives.slice().sort(function(a, b) {
      return b.value - a.value;
    });
    order.forEach(function(it) {
      var b = document.createElement("div");
      b.className = "m-bubble m-cat--" + it.series;
      var circ = document.createElement("span");
      var valTxt = document.createElement("span");
      valTxt.className = "m-bubble__value";
      if (chart.getAttribute("data-legend") !== "off") {
        valTxt.setAttribute("aria-hidden", "true");
      }
      var lab = document.createElement("span");
      lab.className = "m-bubble__label";
      lab.textContent = it.label;
      var r = Rmax * Math.sqrt(it.value / vmax);
      circ.className = "m-bubble__circle";
      circ.style.width = circ.style.height = r * 2 + "px";
      b.setAttribute("data-size", r >= Rmax * 0.7 ? "large" : "small");
      valTxt.textContent = stateText(it).text;
      circ.appendChild(valTxt);
      b.appendChild(circ);
      wrap.appendChild(b);
      var row = document.createElement("li");
      row.className = "m-packed__value-row m-cat--" + it.series;
      var swatch = document.createElement("span");
      swatch.className = "m-legend__swatch";
      swatch.setAttribute("aria-hidden", "true");
      row.appendChild(swatch);
      row.appendChild(lab);
      labels.appendChild(row);
      nodes2.push({ bubble: b, circ, value: valTxt, row, diameter: r * 2 });
    });
    if (positives.length) {
      plot.appendChild(wrap);
      plot.appendChild(labels);
      layoutPacked(chart, nodes2, wrap);
      if (window.ResizeObserver) {
        var observer = new ResizeObserver(function() {
          if (resizeFrames.has(chart)) return;
          resizeFrames.set(chart, window.requestAnimationFrame(function() {
            resizeFrames.delete(chart);
            if (chart.isConnected && !disconnected.has(chart) && observers.get(chart) === observer && plot.contains(wrap)) {
              layoutPacked(chart, nodes2, wrap);
            }
          }));
        });
        observer.observe(chart);
        nodes2.forEach(function(n) {
          observer.observe(n.value);
        });
        observers.set(chart, observer);
      }
      if (document.fonts) document.fonts.ready.then(function() {
        if (chart.isConnected && !disconnected.has(chart) && plot.contains(wrap)) layoutPacked(chart, nodes2, wrap);
      });
    } else {
      var empty = document.createElement("p");
      empty.className = "m-packed__empty";
      empty.setAttribute("data-empty", "");
      empty.textContent = L4("packed.empty", empty);
      plot.appendChild(empty);
    }
    var special = items.filter(function(it) {
      return stateText(it).none;
    });
    if (special.length) plot.appendChild(stateList(special));
    if (positives.length && chart.getAttribute("data-legend") !== "off") {
      var legend = document.createElement("ul");
      legend.className = "m-legend";
      positives.forEach(function(it) {
        var li = document.createElement("li");
        li.className = "m-legend__item m-cat--" + it.series;
        var sw = document.createElement("span");
        sw.className = "m-legend__swatch";
        li.appendChild(sw);
        li.appendChild(document.createTextNode(it.label + " "));
        var val = document.createElement("span");
        val.className = "m-legend__value";
        val.textContent = stateText(it).text;
        li.appendChild(val);
        legend.appendChild(li);
      });
      plot.appendChild(legend);
    }
    if (chart.hasAttribute("data-summary-text")) {
      var summary2 = chart.querySelector("[data-summary]");
      if (summary2 && !summary2.textContent) summary2.textContent = chart.getAttribute("data-summary-text");
    }
    chart.dispatchEvent(new CustomEvent("micro-packed:rendered", {
      bubbles: true,
      detail: { ok: true, vmaxDerived: !hasMaxAttr }
    }));
  }
  function render2(chart) {
    disconnected.delete(chart);
    renderPacked(chart);
    syncPackedTable(chart);
  }
  var instances2 = instanceRegistry();
  function init7(root, options) {
    var scope = root || document;
    applyInstanceLabels7(scope, options);
    var existing = instances2.get(scope);
    if (existing) {
      withLabels8(scope, function() {
        if (scope.matches && scope.matches("[data-chart-packed]")) render2(scope);
        scope.querySelectorAll("[data-chart-packed]").forEach(render2);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد التصيير من DOM المصدر لكل رسوم packed تحت الجذر. */
      update: function() {
        withLabels8(scope, function() {
          if (scope.matches && scope.matches("[data-chart-packed]")) render2(scope);
          scope.querySelectorAll("[data-chart-packed]").forEach(render2);
        });
      },
      /** يفك مراقبات الرصد وrAF — لا يمس بيانات المصدر. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown7(scope);
        instances2.remove(scope);
      }
    };
    withLabels8(scope, function() {
      if (scope.matches && scope.matches("[data-chart-packed]")) render2(scope);
      scope.querySelectorAll("[data-chart-packed]").forEach(render2);
    });
    instances2.set(scope, instance);
    return instance;
  }
  function getInstance7(root) {
    return instances2.get(root);
  }
  function destroy7(root) {
    var instance = instances2.get(root);
    if (instance) instance.destroy();
    else teardown7(root || document);
  }
  function update3(root) {
    var scope = root || document;
    var charts = [].slice.call(scope.querySelectorAll("[data-chart-packed]"));
    if (scope.matches && scope.matches("[data-chart-packed]")) charts.unshift(scope);
    charts.forEach(function(chart) {
      render2(chart);
    });
  }
  function disconnect7(root) {
    destroy7(root);
  }
  function teardown7(root) {
    var scope = root || document;
    [].slice.call(scope.querySelectorAll(".m-chart__disclose")).forEach(function(btn) {
      var binding = btn.__microDatasetDisclosure;
      if (binding) {
        btn.removeEventListener("click", binding.handler);
        delete btn.__microDatasetDisclosure;
      }
    });
    var charts = [].slice.call(scope.querySelectorAll("[data-chart-packed]"));
    if (scope.matches && scope.matches("[data-chart-packed]")) charts.unshift(scope);
    charts.forEach(function(chart) {
      disconnected.add(chart);
      if (observers.has(chart)) observers.get(chart).disconnect();
      observers.delete(chart);
      if (resizeFrames.has(chart)) window.cancelAnimationFrame(resizeFrames.get(chart));
      resizeFrames.delete(chart);
    });
  }
  function setLabels7(partial) {
    setLabels("data", partial);
  }

  // components/messages/messages.js
  var messages_exports = {};
  __export(messages_exports, {
    announce: () => announce,
    closeToast: () => closeToast,
    destroy: () => destroy8,
    disconnect: () => disconnect8,
    getInstance: () => getInstance8,
    init: () => init8,
    resetAnnouncements: () => resetAnnouncements,
    setLabels: () => setLabels8,
    toast: () => toast
  });

  // shared/haptics.js
  var haptics_exports = {};
  __export(haptics_exports, {
    isHapticsEnabled: () => isHapticsEnabled,
    pulse: () => pulse,
    setHaptics: () => setHaptics
  });
  var STATE_KEY = "__microHapticsEnabled";
  function vibrateAvailable() {
    return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
  }
  function setHaptics(on5) {
    var enabled = !!on5 && vibrateAvailable();
    if (typeof globalThis !== "undefined") globalThis[STATE_KEY] = enabled;
    return enabled;
  }
  function isHapticsEnabled() {
    if (typeof globalThis !== "undefined") return !!globalThis[STATE_KEY] && vibrateAvailable();
    return false;
  }
  function reducedMotion() {
    return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function pulse(kind) {
    if (!isHapticsEnabled() || reducedMotion()) return false;
    var ms = kind === "error" ? 15 : kind === "selection" ? 10 : 12;
    try {
      return navigator.vibrate(ms);
    } catch (error) {
      return false;
    }
  }

  // components/messages/labels.js
  var defaults5 = {
    "note.missingVariantWarning": "[micro-messages] m-note بلا variant ولا role — لا يمكن اختيار دور إعلاني آمن (D-UI-02/SUI-010): أضف نوعًا (m-note--info/success/warning/error/help) أو role صريحًا."
  };

  // components/messages/messages.js
  registerLabels("messages", defaults5);
  var MICRO_LABELS_FAMILY7 = "messages";
  function L5(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY7) || currentInstanceLabels(MICRO_LABELS_FAMILY7);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY7, key2);
  }
  function withLabels9(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY7, fn);
  }
  function applyInstanceLabels8(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY7, options.labels);
    }
  }
  var liveBindings3 = /* @__PURE__ */ new WeakMap();
  function claimBinding3(element, key2) {
    var keys = liveBindings3.get(element);
    if (!keys) {
      keys = /* @__PURE__ */ new Set();
      liveBindings3.set(element, keys);
    }
    if (keys.has(key2)) return false;
    keys.add(key2);
    element.dataset[key2] = "1";
    return true;
  }
  var livePolite = null;
  var liveAssertive = null;
  var ANNOUNCE_CAPACITY = 12;
  var ANNOUNCE_LIFETIME_MS = 6e4;
  var announcedIds = [];
  var announcementEpoch = 0;
  var toastStates = /* @__PURE__ */ new WeakMap();
  function on3(element, type8, handler) {
    if (!element.__microMessageLifetime) element.__microMessageLifetime = new AbortController();
    element.addEventListener(type8, handler, { signal: element.__microMessageLifetime.signal });
  }
  function ensureLiveChannel(kind) {
    var existing = kind === "assertive" ? liveAssertive : livePolite;
    if (existing && document.body.contains(existing)) return existing;
    var region = document.createElement("div");
    region.className = "m-live-region" + (kind === "assertive" ? " m-live-region--assertive" : "");
    region.setAttribute("aria-live", kind === "assertive" ? "assertive" : "polite");
    region.setAttribute("aria-atomic", "true");
    document.body.appendChild(region);
    if (kind === "assertive") liveAssertive = region;
    else livePolite = region;
    return region;
  }
  function pruneAnnouncedIds(now) {
    for (var i = announcedIds.length - 1; i >= 0; i--) {
      if (now - announcedIds[i].at > ANNOUNCE_LIFETIME_MS) announcedIds.splice(i, 1);
    }
    while (announcedIds.length > ANNOUNCE_CAPACITY) announcedIds.shift();
  }
  function announce(text2, opts) {
    var id, assertive, tone;
    if (opts && typeof opts === "object") {
      id = opts.id;
      assertive = !!opts.assertive;
      tone = opts.tone;
    } else {
      assertive = !!opts;
      id = void 0;
    }
    var region = ensureLiveChannel(assertive ? "assertive" : "polite");
    if (tone === "error") pulse("error");
    if (id !== void 0 && id !== null) {
      var now = Date.now();
      pruneAnnouncedIds(now);
      for (var i = 0; i < announcedIds.length; i++) {
        if (announcedIds[i].id === id) {
          if (announcedIds[i].text === text2 && now - announcedIds[i].at <= ANNOUNCE_LIFETIME_MS) {
            return;
          }
          announcedIds[i] = { id, text: text2, at: now };
          break;
        }
      }
      if (i === announcedIds.length) {
        announcedIds.push({ id, text: text2, at: now });
      }
      pruneAnnouncedIds(now);
    }
    if (region.textContent === String(text2)) {
      region.textContent = "";
      var epoch = announcementEpoch;
      (window.requestAnimationFrame || function(fn) {
        window.setTimeout(fn, 16);
      })(function() {
        if (epoch === announcementEpoch && region.isConnected && region.textContent === "") region.textContent = text2;
      });
    } else {
      region.textContent = text2;
    }
  }
  function resetAnnouncements() {
    announcedIds = [];
    announcementEpoch++;
  }
  function toastText(el2) {
    var t = el2.querySelector(".m-toast__text");
    return (t || el2).textContent;
  }
  function endToastSession(el2) {
    var state2 = toastStates.get(el2);
    if (state2) {
      if (state2.timer !== null) window.clearTimeout(state2.timer);
      el2.removeEventListener("focusin", state2.focusin);
      el2.removeEventListener("focusout", state2.focusout);
      toastStates.delete(el2);
    }
    delete el2.dataset.toastTimer;
  }
  function toast(el2, options) {
    if (!el2 || el2.nodeType !== 1) return;
    options = options || {};
    endToastSession(el2);
    var state2 = {
      timer: null,
      remaining: typeof options.duration === "number" ? options.duration : 4e3,
      startedAt: 0,
      returnFocus: options.returnFocus || null
    };
    function pause() {
      if (state2.timer === null) return;
      window.clearTimeout(state2.timer);
      state2.remaining = Math.max(0, state2.remaining - (Date.now() - state2.startedAt));
      state2.timer = null;
      delete el2.dataset.toastTimer;
    }
    function resume() {
      if (toastStates.get(el2) !== state2 || state2.timer !== null || el2.contains(document.activeElement)) return;
      state2.startedAt = Date.now();
      state2.timer = window.setTimeout(function() {
        if (toastStates.get(el2) !== state2) return;
        if (!el2.isConnected) {
          endToastSession(el2);
          return;
        }
        if (el2.contains(document.activeElement)) {
          pause();
          return;
        }
        hideToast(el2);
        el2.dispatchEvent(new Event("micro-messages:toast-dismissed", { bubbles: true }));
      }, state2.remaining);
      el2.dataset.toastTimer = String(state2.timer);
    }
    state2.focusin = pause;
    state2.focusout = function() {
      Promise.resolve().then(resume);
    };
    toastStates.set(el2, state2);
    el2.addEventListener("focusin", state2.focusin);
    el2.addEventListener("focusout", state2.focusout);
    el2.hidden = false;
    announce(toastText(el2), false);
    resume();
  }
  function hideToast(el2) {
    endToastSession(el2);
    el2.hidden = true;
  }
  function closeToast(el2, trigger) {
    if (!el2 || el2.nodeType !== 1) return;
    var hadFocus = el2.contains(document.activeElement);
    var state2 = toastStates.get(el2);
    var target = returnFocusTarget(trigger || document.activeElement || el2, el2) || state2 && state2.returnFocus;
    hideToast(el2);
    if (hadFocus && target && target.nodeType === 1 && target.isConnected && !target.disabled && target.getAttribute("aria-disabled") !== "true" && !target.closest("[hidden], [inert]") && (typeof target.checkVisibility !== "function" || target.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))) {
      target.focus();
    }
    el2.dispatchEvent(new Event("micro-messages:toast-closed", { bubbles: true }));
  }
  function returnFocusTarget(btn, note2) {
    var sel = btn.getAttribute("data-return-focus") || note2.getAttribute("data-return-focus");
    if (!sel) return null;
    try {
      return document.querySelector(sel);
    } catch (e) {
      return null;
    }
  }
  var NOTE_ROLE_BY_VARIANT = { help: "note", info: "status", success: "status", warning: "status", error: "alert" };
  function noteVariantOf(note2) {
    var cls = " " + (note2.className || "") + " ";
    for (var v in NOTE_ROLE_BY_VARIANT) {
      if (cls.indexOf(" m-note--" + v + " ") >= 0) return v;
    }
    return null;
  }
  function ensureNoteRoles(scope) {
    var base2 = scope && scope.querySelectorAll ? scope : document;
    var list = [].slice.call(base2.querySelectorAll(".m-note"));
    if (scope && scope.nodeType === 1 && scope.matches && scope.matches(".m-note")) list.unshift(scope);
    list.forEach(function(note2) {
      if (note2.getAttribute("role")) return;
      var v = noteVariantOf(note2);
      if (v) note2.setAttribute("role", NOTE_ROLE_BY_VARIANT[v]);
      else if (window.console && console.warn) {
        console.warn(L5("note.missingVariantWarning", note2), note2);
      }
    });
  }
  function bindClose(root) {
    var scope = root || document;
    var inScope = function(selector) {
      var list = [].slice.call(scope.querySelectorAll(selector));
      if (scope.nodeType === 1 && scope.matches(selector)) list.unshift(scope);
      return list;
    };
    inScope(".m-note__close").forEach(function(btn) {
      if (!claimBinding3(btn, "microNoteBound")) return;
      on3(btn, "click", function() {
        var note2 = btn.closest(".m-note");
        if (!note2) return;
        var target = returnFocusTarget(btn, note2);
        note2.hidden = true;
        if (target && !target.disabled && typeof target.focus === "function") {
          target.focus();
        }
        note2.dispatchEvent(new CustomEvent("micro-messages:note-closed", {
          bubbles: true,
          detail: { returnFocus: !!target }
        }));
      });
    });
    inScope(".m-toast [data-toast-close]").forEach(function(btn) {
      if (!claimBinding3(btn, "microToastCloseBound")) return;
      on3(btn, "click", function() {
        closeToast(btn.closest(".m-toast"), btn);
      });
    });
  }
  function disconnect8(root) {
    destroy8(root);
  }
  function teardown8(root) {
    var scope = root || document;
    var nodes2 = [scope].concat([].slice.call(scope.querySelectorAll("*")));
    nodes2.forEach(function(element) {
      liveBindings3.delete(element);
      if (element.__microMessageLifetime) element.__microMessageLifetime.abort();
      delete element.__microMessageLifetime;
      if (element.dataset) {
        delete element.dataset.microNoteBound;
        delete element.dataset.microToastCloseBound;
        if (toastStates.has(element) || element.dataset.toastTimer) hideToast(element);
      }
    });
    if (scope === document) {
      resetAnnouncements();
      if (livePolite) livePolite.remove();
      if (liveAssertive) liveAssertive.remove();
      livePolite = liveAssertive = null;
    }
  }
  var registry6 = instanceRegistry();
  function init8(root, options) {
    var scope = root || document;
    applyInstanceLabels8(scope, options);
    var existing = registry6.get(scope);
    if (existing) {
      withLabels9(scope, function() {
        ensureNoteRoles(scope);
        bindClose(scope);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد فحص الرسائل تحت الجذر (أدوار m-note وأزرار الإغلاق الجديدة). */
      update: function() {
        withLabels9(scope, function() {
          ensureNoteRoles(scope);
          bindClose(scope);
        });
      },
      /** يفك المستمعات ويوقف مؤقتات toast — لا يمس نصوص الرسائل. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown8(scope);
        registry6.remove(scope);
      }
    };
    withLabels9(scope, function() {
      ensureNoteRoles(scope);
      bindClose(scope);
    });
    registry6.set(scope, instance);
    return instance;
  }
  function getInstance8(root) {
    return registry6.get(root);
  }
  function destroy8(root) {
    var instance = registry6.get(root);
    if (instance) instance.destroy();
    else teardown8(root || document);
  }
  function setLabels8(partial) {
    setLabels("messages", partial);
  }

  // components/navigation/navigation.js
  var navigation_exports = {};
  __export(navigation_exports, {
    appliedFilters: () => appliedFilters,
    closeLayer: () => closeLayer,
    destroy: () => destroy9,
    disconnect: () => disconnect9,
    getInstance: () => getInstance9,
    init: () => init9,
    openLayer: () => openLayer,
    requestClose: () => requestClose,
    setAppliedFilters: () => setAppliedFilters,
    setLabels: () => setLabels9
  });

  // components/navigation/labels.js
  var defaults6 = {
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

  // components/navigation/navigation.js
  registerLabels("navigation", defaults6);
  var MICRO_LABELS_FAMILY8 = "navigation";
  function L6(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY8) || currentInstanceLabels(MICRO_LABELS_FAMILY8);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY8, key2);
  }
  function withLabels10(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY8, fn);
  }
  function applyInstanceLabels9(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY8, options.labels);
    }
  }
  var liveBindings4 = /* @__PURE__ */ new WeakMap();
  function claimBinding4(element, key2) {
    var keys = liveBindings4.get(element);
    if (!keys) {
      keys = /* @__PURE__ */ new Set();
      liveBindings4.set(element, keys);
    }
    if (keys.has(key2)) return false;
    keys.add(key2);
    element.dataset[key2] = "1";
    return true;
  }
  var openLayers = [];
  var lockCount = 0;
  var prevOverflow = null;
  var inertRestore = [];
  var isolationObserver = null;
  var closeState = /* @__PURE__ */ new WeakMap();
  var closeRequests = /* @__PURE__ */ new WeakSet();
  var escapeBound = false;
  var layerTitleUid = 0;
  var reduceQuery = null;
  function on4(owner, element, type8, handler) {
    if (!owner.__microNavigationLifetime) owner.__microNavigationLifetime = new AbortController();
    element.addEventListener(type8, handler, { signal: owner.__microNavigationLifetime.signal });
  }
  function transitionMilliseconds(layer) {
    var css = getComputedStyle(layer);
    function time(value) {
      return parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1e3) || 0;
    }
    var durations = css.transitionDuration.split(",").map(time);
    var delays = css.transitionDelay.split(",").map(time);
    return Math.max.apply(null, durations.map(function(duration, i) {
      return duration + delays[i % delays.length];
    }).concat([0]));
  }
  function inDocument(el2) {
    return !!(el2 && el2.nodeType === 1 && document.contains(el2));
  }
  function isDisabled2(el2) {
    return el2.disabled || el2.getAttribute("aria-disabled") === "true";
  }
  function focusables(layer) {
    return [].slice.call(layer.querySelectorAll(
      "button, a[href], area[href], input, select, textarea, [tabindex]"
    )).filter(function(el2) {
      if (isDisabled2(el2)) return false;
      var ti = el2.getAttribute("tabindex");
      if (ti !== null && parseInt(ti, 10) < 0) return false;
      if (el2.closest("[inert]")) return false;
      if (typeof el2.checkVisibility === "function") {
        return el2.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      }
      return el2.offsetParent !== null || el2.getClientRects().length > 0;
    });
  }
  function genOf(layer) {
    var s = closeState.get(layer);
    if (!s) {
      s = { gen: 0, timer: null, onEnd: null, closing: false };
      closeState.set(layer, s);
    }
    return s;
  }
  function cancelScheduledClose(layer) {
    var s = closeState.get(layer);
    if (!s) return;
    s.gen++;
    if (s.closing) {
      s.closing = false;
      unlockScroll();
    }
    if (s.timer) {
      window.clearTimeout(s.timer);
      s.timer = null;
    }
    if (s.onEnd) layer.removeEventListener("transitionend", s.onEnd);
    s.onEnd = null;
    s.backdrop = null;
    layer.removeAttribute("data-closing");
    layer.removeAttribute("data-opening");
    layer.inert = false;
  }
  function transitionInstant(layer) {
    if (reduceQuery && reduceQuery.matches) return true;
    return transitionMilliseconds(layer) === 0;
  }
  function allowedOutside(el2) {
    return el2.classList.contains("m-live-region") || el2.classList.contains("m-toast");
  }
  function isolateSiblings(container, layer, backdrop2) {
    [].slice.call(container.children).forEach(function(el2) {
      if (el2 === layer || el2 === backdrop2) return;
      if (allowedOutside(el2)) return;
      if (el2.contains(layer)) {
        isolateSiblings(el2, layer, backdrop2);
        return;
      }
      inertRestore.push({ el: el2, inert: el2.inert });
      el2.inert = true;
    });
  }
  function applyBackgroundInert() {
    releaseBackgroundInert();
    if (!openLayers.length) return;
    var top = openLayers[openLayers.length - 1];
    isolateSiblings(document.body, top.layer, top.backdrop);
    isolationObserver = new MutationObserver(function(records) {
      if (!openLayers.length) return;
      var active = openLayers[openLayers.length - 1].layer;
      var changed2 = records.some(function(record) {
        return record.target !== active && record.target.contains(active) && [].slice.call(record.addedNodes).concat([].slice.call(record.removedNodes)).some(function(node2) {
          return node2.nodeType === 1;
        });
      });
      if (changed2) applyBackgroundInert();
    });
    isolationObserver.observe(document.body, { childList: true, subtree: true });
  }
  function releaseBackgroundInert() {
    if (isolationObserver) {
      isolationObserver.disconnect();
      isolationObserver = null;
    }
    inertRestore.forEach(function(r) {
      r.el.inert = r.inert;
    });
    inertRestore = [];
  }
  function lockScroll() {
    if (lockCount === 0) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount++;
  }
  function unlockScroll() {
    if (lockCount > 0) lockCount--;
    if (lockCount === 0 && prevOverflow !== null) {
      document.body.style.overflow = prevOverflow === "" ? "" : prevOverflow;
      prevOverflow = null;
    }
  }
  function bindTrap(layer) {
    if (!claimBinding4(layer, "microTrapBound")) return;
    on4(layer, layer, "keydown", function(e) {
      if (e.key !== "Tab" || !openLayers.length) return;
      if (openLayers[openLayers.length - 1].layer !== layer) return;
      var f = focusables(layer);
      if (!f.length) {
        e.preventDefault();
        return;
      }
      var first = f[0], last = f[f.length - 1];
      var active = document.activeElement;
      if (!layer.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
  function playOpenTransition(layer) {
    if (transitionInstant(layer)) return;
    layer.setAttribute("data-opening", "true");
    var s = genOf(layer);
    var myGen = s.gen;
    window.requestAnimationFrame(function() {
      window.requestAnimationFrame(function() {
        if (layer.isConnected && s.gen === myGen) layer.removeAttribute("data-opening");
      });
    });
  }
  function ensureLayerSemantics(layer) {
    var role = layer.getAttribute("role");
    if (role === null) {
      layer.setAttribute("role", "dialog");
      role = "dialog";
    }
    if (role === "dialog" || role === "alertdialog") {
      if (layer.getAttribute("aria-modal") === null) layer.setAttribute("aria-modal", "true");
      var named = layer.getAttribute("aria-labelledby") || layer.getAttribute("aria-label");
      if (!named) {
        var title = layer.querySelector(".m-layer__title");
        if (title) {
          if (!title.id) title.id = "micro-layer-title-" + ++layerTitleUid;
          layer.setAttribute("aria-labelledby", title.id);
        } else if (window.console && console.warn) {
          console.warn(L6("layer.unnamedWarning", layer), layer);
        }
      }
    } else if (window.console && console.warn) {
      console.warn(L6("layer.unusualRolePrefix", layer) + role + L6("layer.unusualRoleSuffix", layer), layer);
    }
  }
  var dragBound = /* @__PURE__ */ new WeakSet();
  function ensureDragHandle(layer) {
    if (layer.querySelector(":scope > .m-layer__drag-handle")) return;
    var handle = document.createElement("div");
    handle.className = "m-layer__drag-handle";
    handle.setAttribute("aria-hidden", "true");
    var bar = document.createElement("span");
    bar.className = "m-layer__drag-bar";
    handle.appendChild(bar);
    layer.insertBefore(handle, layer.firstChild);
  }
  function initSheetDrag(layer) {
    if (dragBound.has(layer)) return;
    dragBound.add(layer);
    layer.addEventListener("pointerdown", function(event) {
      var handle = event.target.closest ? event.target.closest(".m-layer__drag-handle") : null;
      if (!handle || !layer.contains(handle) || layer.hidden) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      var startY = event.clientY;
      var lastY = startY;
      var lastT = event.timeStamp;
      var maxDy = 0;
      var velocity = 0;
      var dragging = false;
      function onMove(moveEvent) {
        var dy = moveEvent.clientY - startY;
        if (!dragging) {
          if (dy < 6) return;
          dragging = true;
          try {
            handle.setPointerCapture(moveEvent.pointerId);
          } catch (error) {
          }
        }
        var dt = Math.max(1, moveEvent.timeStamp - lastT);
        velocity = (moveEvent.clientY - lastY) / dt;
        lastT = moveEvent.timeStamp;
        lastY = moveEvent.clientY;
        if (dy > maxDy) maxDy = dy;
        layer.style.transform = "translateY(" + Math.max(0, dy) + "px)";
      }
      function release() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
        if (!dragging) return;
        var height = layer.offsetHeight || 1;
        var threshold = maxDy >= 0.3 * height || maxDy >= 60 && velocity >= 0.6;
        if (threshold) {
          layer.style.removeProperty("transform");
          var accepted = requestClose(layer, { reason: "drag-dismiss", trigger: handle });
          if (accepted) pulse("selection");
          else layer.style.transform = "translateY(" + maxDy + "px)";
        }
        if (!threshold || !accepted) {
          layer.style.transition = "transform 180ms cubic-bezier(0.2, 0, 0, 1)";
          layer.style.removeProperty("transform");
          window.setTimeout(function() {
            layer.style.removeProperty("transition");
          }, 200);
        }
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
    });
  }
  function ensureSheetDrag(layer) {
    if (layer.classList.contains("m-layer--center")) return;
    ensureDragHandle(layer);
    initSheetDrag(layer);
  }
  function openLayer(layer, options) {
    options = options || {};
    if (!layer || layer.tagName !== "DIV") return;
    cancelScheduledClose(layer);
    ensureLayerSemantics(layer);
    if (openLayers.some(function(o) {
      return o.layer === layer;
    })) {
      var cur = focusables(layer)[0];
      if (cur) cur.focus();
      else layer.focus();
      return;
    }
    var backdrop2 = options.backdropEl || (layer.getAttribute("data-backdrop-id") ? document.getElementById(layer.getAttribute("data-backdrop-id")) : null) || document.querySelector('.m-layer-backdrop[data-for="' + layer.id + '"]');
    var st = closeState.get(layer);
    var trigger = options.trigger || document.activeElement;
    if (!inDocument(trigger) || layer.contains(trigger)) {
      trigger = st && st.lastTrigger && inDocument(st.lastTrigger) ? st.lastTrigger : null;
    }
    if (trigger && isDisabled2(trigger)) trigger = null;
    layer.hidden = false;
    layer.inert = false;
    if (backdrop2) backdrop2.hidden = false;
    lockScroll();
    bindTrap(layer);
    if (!layer.hasAttribute("tabindex")) layer.setAttribute("tabindex", "-1");
    openLayers.push({ layer, backdrop: backdrop2, trigger });
    applyBackgroundInert();
    var f = focusables(layer);
    var first = layer.querySelector("[data-autofocus]");
    if (!(first && !isDisabled2(first) && f.indexOf(first) >= 0)) first = f[0];
    if (first) first.focus();
    else layer.focus();
    ensureSheetDrag(layer);
    playOpenTransition(layer);
    layer.dispatchEvent(new CustomEvent("micro-navigation:opened", { bubbles: true }));
    layer.dispatchEvent(new CustomEvent("micro-layer:open", {
      bubbles: true,
      detail: { layer, opener: trigger, close: function() {
        closeLayer(layer);
      } }
    }));
  }
  function requestClose(layer, options) {
    var top = openLayers.length ? openLayers[openLayers.length - 1] : null;
    if (!top || top.layer !== layer || closeRequests.has(layer)) return false;
    options = options || {};
    var reasons = ["escape", "close-button", "backdrop", "drag-dismiss", "programmatic-request"];
    var reason = reasons.indexOf(options.reason) >= 0 ? options.reason : "programmatic-request";
    var trigger = options.trigger && options.trigger.nodeType === 1 ? options.trigger : null;
    var generation = genOf(layer).gen;
    var event = new CustomEvent("micro-navigation:close-request", {
      bubbles: true,
      cancelable: true,
      detail: { reason, trigger }
    });
    closeRequests.add(layer);
    try {
      layer.dispatchEvent(event);
    } finally {
      closeRequests.delete(layer);
    }
    if (event.defaultPrevented || genOf(layer).gen !== generation || openLayers[openLayers.length - 1] !== top) return false;
    closeLayer(layer);
    return true;
  }
  function closeLayer(layer) {
    if (!layer) return;
    openLayers.slice().reverse().forEach(function(o) {
      if (o.layer !== layer && layer.contains(o.layer)) closeLayer(o.layer);
    });
    var idx = -1;
    for (var i = 0; i < openLayers.length; i++) {
      if (openLayers[i].layer === layer) {
        idx = i;
        break;
      }
    }
    if (idx < 0) return;
    var entry = openLayers.splice(idx, 1)[0];
    cancelScheduledClose(layer);
    function finish() {
      layer.style.removeProperty("transform");
      layer.style.removeProperty("transition");
      layer.hidden = true;
      layer.removeAttribute("data-closing");
      layer.inert = false;
      if (entry.backdrop) entry.backdrop.hidden = true;
      unlockScroll();
      if (openLayers.length) applyBackgroundInert();
      else releaseBackgroundInert();
      var t = entry.trigger;
      var top = openLayers.length ? openLayers[openLayers.length - 1].layer : null;
      var usable = t && inDocument(t) && !isDisabled2(t) && !t.closest("[inert], [hidden]") && (!top || top.contains(t));
      if (usable && typeof t.focus === "function") t.focus();
      else if (top) {
        var target = focusables(top)[0] || top;
        target.focus();
      }
      layer.dispatchEvent(new CustomEvent("micro-navigation:closed", { bubbles: true }));
      layer.dispatchEvent(new CustomEvent("micro-layer:close", {
        bubbles: true,
        detail: { layer, opener: entry.trigger }
      }));
    }
    if (layer.hidden) {
      finish();
      return;
    }
    if (transitionInstant(layer)) {
      finish();
      return;
    }
    layer.inert = true;
    layer.setAttribute("data-closing", "true");
    var s = genOf(layer);
    var myGen = s.gen;
    s.closing = true;
    s.backdrop = entry.backdrop;
    if (entry.trigger) s.lastTrigger = entry.trigger;
    var done = false;
    function onEnd(event) {
      if (event && event.target !== layer) return;
      if (done || s.gen !== myGen) return;
      done = true;
      s.closing = false;
      s.backdrop = null;
      layer.removeEventListener("transitionend", onEnd);
      if (s.timer) {
        window.clearTimeout(s.timer);
        s.timer = null;
      }
      finish();
    }
    s.onEnd = onEnd;
    layer.addEventListener("transitionend", onEnd);
    s.timer = window.setTimeout(onEnd, transitionMilliseconds(layer) + 34);
  }
  function draftInputs(panel) {
    return [].slice.call(panel.querySelectorAll("[data-filter-key]"));
  }
  function inputActive(input) {
    if (input.type === "checkbox" || input.type === "radio") return input.checked;
    return String(input.value == null ? "" : input.value).trim() !== "";
  }
  function filterLabel(input) {
    var attr = input.getAttribute("data-filter-label");
    if (attr && attr.trim()) return attr.trim();
    var lab = null;
    var id = input.id;
    if (id) {
      try {
        lab = document.querySelector('label[for="' + String(id).replace(/"/g, "") + '"]');
      } catch (err) {
        lab = null;
      }
    }
    if (!lab && input.closest) lab = input.closest("label");
    if (lab) {
      var t = String(lab.textContent || "").replace(/\s+/g, " ").trim();
      if (t) return t;
    }
    return "";
  }
  function filterCountAr(n) {
    if (n === 1) return L6("filters.count.one");
    if (n === 2) return L6("filters.count.two");
    if (n >= 3 && n <= 10) return n + L6("filters.count.fewSuffix");
    if (n >= 11 && n <= 99) return n + L6("filters.count.manySuffix");
    var r = n % 100;
    if (r === 0) return n + L6("filters.count.hundredSuffix");
    if (r === 1) return n + L6("filters.count.hundredOneSuffix");
    if (r === 2) return n + L6("filters.count.hundredTwoSuffix");
    if (r >= 3 && r <= 10) return n + L6("filters.count.fewSuffix");
    return n + L6("filters.count.manySuffix");
  }
  function updateSummary(panel, phase) {
    var summary2 = panel.querySelector("[data-filter-summary]");
    if (!summary2) return;
    var actives = draftInputs(panel).filter(function(input) {
      var key2 = input.getAttribute("data-filter-key");
      return !!key2 && key2 !== "none" && inputActive(input);
    });
    if (!actives.length) {
      summary2.textContent = phase + L6("filters.summary.emptySuffix", summary2);
      return;
    }
    var labels = [];
    actives.forEach(function(input) {
      var l = filterLabel(input);
      if (l && labels.indexOf(l) < 0) labels.push(l);
    });
    summary2.textContent = labels.length === actives.length ? phase + ": " + labels.join(L6("filters.summary.separator")) : phase + ": " + filterCountAr(actives.length);
  }
  function initFilterPanel(panel) {
    if (!claimBinding4(panel, "microFilterBound")) return;
    var applied = panel.__microApplied || {};
    on4(panel, panel, "micro-navigation:opened", function() {
      draftInputs(panel).forEach(function(input) {
        var key2 = input.getAttribute("data-filter-key");
        if (Object.prototype.hasOwnProperty.call(applied, key2)) {
          if (input.type === "checkbox") input.checked = applied[key2] === true;
          else input.value = typeof applied[key2] === "string" ? applied[key2] : "";
        } else if (input.type === "checkbox") {
          input.checked = false;
        } else {
          input.value = "";
        }
      });
      updateSummary(panel, L6("filters.summary.current", panel));
    });
    on4(panel, panel, "change", function(e) {
      if (e.target.closest && e.target.closest("[data-filter-key]")) updateSummary(panel, L6("filters.summary.current", e.target));
    });
    on4(panel, panel, "input", function(e) {
      if (e.target.closest && e.target.closest('[data-filter-key][type="search"], [data-filter-key][type="text"]')) {
        updateSummary(panel, L6("filters.summary.current", panel));
      }
    });
    var apply2 = panel.querySelector("[data-filter-apply]");
    if (apply2) on4(panel, apply2, "click", function() {
      applied = {};
      draftInputs(panel).forEach(function(input) {
        var key2 = input.getAttribute("data-filter-key");
        if (!key2 || key2 === "none") return;
        if (input.type === "checkbox") applied[key2] = input.checked;
        else applied[key2] = String(input.value == null ? "" : input.value).trim();
      });
      updateSummary(panel, L6("filters.summary.applied", panel));
      panel.__microApplied = Object.assign({}, applied);
      var count = Object.keys(applied).filter(function(k) {
        return applied[k] === true || typeof applied[k] === "string" && applied[k] !== "";
      }).length;
      panel.dispatchEvent(new CustomEvent("micro-navigation:filters-applied", {
        bubbles: true,
        detail: { applied: Object.assign({}, applied), count }
      }));
      closeLayer(panel);
    });
    var clear = panel.querySelector("[data-filter-clear]");
    if (clear) on4(panel, clear, "click", function() {
      draftInputs(panel).forEach(function(input) {
        if (input.disabled || input.readOnly) return;
        if (input.type === "checkbox") input.checked = false;
        else input.value = "";
      });
      updateSummary(panel, L6("filters.summary.current", panel));
    });
    var cancel = panel.querySelector("[data-filter-cancel]");
    if (cancel) on4(panel, cancel, "click", function() {
      closeLayer(panel);
    });
    panel.__microSetApplied = function(values) {
      applied = {};
      var src = values && typeof values === "object" ? values : {};
      draftInputs(panel).forEach(function(input) {
        var key2 = input.getAttribute("data-filter-key");
        if (!key2 || key2 === "none") return;
        var has = Object.prototype.hasOwnProperty.call(src, key2);
        if (input.type === "checkbox") {
          applied[key2] = has ? src[key2] === true : false;
          input.checked = applied[key2] === true;
        } else {
          applied[key2] = has && typeof src[key2] === "string" ? String(src[key2]).trim() : "";
          input.value = applied[key2];
        }
      });
      updateSummary(panel, L6("filters.summary.applied", panel));
      panel.__microApplied = Object.assign({}, applied);
    };
  }
  function initTabs(tabs) {
    if (!claimBinding4(tabs, "microTabsBound")) return;
    var items = [].slice.call(tabs.querySelectorAll('[role="tab"]'));
    var FOCUSABLE_IN = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    function panelOf(t) {
      var id = t.getAttribute("aria-controls");
      return id ? document.getElementById(id) : null;
    }
    function firstFocusableIn(panel) {
      var candidates = panel.querySelectorAll(FOCUSABLE_IN);
      for (var i = 0; i < candidates.length; i++) {
        var el2 = candidates[i];
        if (el2.closest("[hidden]")) continue;
        if (el2.disabled) continue;
        if (typeof el2.checkVisibility === "function" && !el2.checkVisibility({ checkVisibilityCSS: true })) continue;
        return el2;
      }
      return null;
    }
    function syncPanelTabindex(activeTab) {
      items.forEach(function(t) {
        var panel = panelOf(t);
        if (!panel) return;
        var ours = panel.getAttribute("data-micro-tabs-panel") === "1";
        var focusableInside = firstFocusableIn(panel);
        if (t === activeTab && !focusableInside) {
          if (!panel.hasAttribute("tabindex")) {
            panel.setAttribute("tabindex", "0");
            panel.setAttribute("data-micro-tabs-panel", "1");
          }
        } else if (ours) {
          panel.removeAttribute("tabindex");
          panel.removeAttribute("data-micro-tabs-panel");
        }
      });
    }
    function keepVisible(tab) {
      if (tab && typeof tab.scrollIntoView === "function") {
        try {
          tab.scrollIntoView({ block: "nearest", inline: "nearest" });
        } catch (e) {
        }
      }
    }
    function select(tab) {
      items.forEach(function(t) {
        var on5 = t === tab;
        t.setAttribute("aria-selected", on5 ? "true" : "false");
        t.tabIndex = on5 ? 0 : -1;
        var panel = panelOf(t);
        if (panel) panel.hidden = !on5;
      });
      syncPanelTabindex(tab);
      keepVisible(tab);
    }
    items.forEach(function(t, i) {
      on4(tabs, t, "click", function() {
        select(t);
      });
      on4(tabs, t, "keydown", function(e) {
        var next3 = null;
        var rtl = getComputedStyle(tabs).direction === "rtl";
        if (e.key === "ArrowLeft") next3 = items[(i + (rtl ? 1 : -1) + items.length) % items.length];
        else if (e.key === "ArrowRight") next3 = items[(i + (rtl ? -1 : 1) + items.length) % items.length];
        else if (e.key === "Home") next3 = items[0];
        else if (e.key === "End") next3 = items[items.length - 1];
        if (next3) {
          e.preventDefault();
          next3.focus();
          keepVisible(next3);
          select(next3);
        }
      });
    });
    var initial = items.filter(function(t) {
      return t.getAttribute("aria-selected") === "true";
    })[0] || items[0];
    if (initial) syncPanelTabindex(initial);
  }
  var escapeUsers = 0;
  var escapeHandler = null;
  function bindDocumentOnce() {
    escapeUsers++;
    if (escapeHandler) return;
    escapeHandler = function(e) {
      if (e.key === "Escape" && !e.defaultPrevented && openLayers.length) {
        requestClose(openLayers[openLayers.length - 1].layer, { reason: "escape", trigger: document.activeElement });
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", escapeHandler);
  }
  function unbindDocument() {
    if (escapeUsers > 0) escapeUsers--;
    if (escapeUsers === 0 && escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
      escapeBound = false;
    }
  }
  var instances3 = instanceRegistry();
  function bindScope(scope) {
    var inScope = function(selector) {
      var list = [].slice.call(scope.querySelectorAll(selector));
      if (scope.nodeType === 1 && scope.matches(selector)) list.unshift(scope);
      return list;
    };
    inScope("[data-layer-open]").forEach(function(btn) {
      if (!claimBinding4(btn, "microLayerOpenBound")) return;
      on4(btn, btn, "click", function() {
        var layer = document.getElementById(btn.getAttribute("data-layer-open"));
        if (layer) openLayer(layer, { trigger: btn });
      });
    });
    inScope("[data-layer-close]").forEach(function(btn) {
      if (!claimBinding4(btn, "microLayerCloseBound")) return;
      on4(btn, btn, "click", function() {
        requestClose(btn.closest(".m-layer"), { reason: "close-button", trigger: btn });
      });
    });
    inScope(".m-layer-backdrop[data-for]").forEach(function(bd) {
      if (!claimBinding4(bd, "microBackdropBound")) return;
      on4(bd, bd, "click", function() {
        var layer = document.getElementById(bd.getAttribute("data-for"));
        if (!layer) return;
        if ((layer.getAttribute("data-backdrop") || "close") === "close") requestClose(layer, { reason: "backdrop", trigger: bd });
      });
    });
    inScope("[data-tabs]").forEach(initTabs);
    inScope("[data-filter-panel]").forEach(initFilterPanel);
  }
  function init9(root, options) {
    var scope = root || document;
    applyInstanceLabels9(scope, options);
    var existing = instances3.get(scope);
    if (existing) {
      withLabels10(scope, function() {
        bindScope(scope);
      });
      return existing;
    }
    bindDocumentOnce();
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد ربط عناصر الطبقات الجديدة تحت الجذر (الربط محروس فلا ازدواج). */
      update: function() {
        withLabels10(scope, function() {
          bindScope(scope);
        });
      },
      /** يغلق الطبقات المفتوحة ويفك المستمعات ويرجع inert الخلفية. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown9(scope);
        unbindDocument();
        instances3.remove(scope);
      }
    };
    withLabels10(scope, function() {
      bindScope(scope);
    });
    instances3.set(scope, instance);
    return instance;
  }
  function getInstance9(root) {
    return instances3.get(root);
  }
  function destroy9(root) {
    var instance = instances3.get(root);
    if (instance) instance.destroy();
    else teardown9(root || document);
  }
  function disconnect9(root) {
    destroy9(root);
  }
  function teardown9(root) {
    var scope = root || document;
    var all = [scope].concat([].slice.call(scope.querySelectorAll("*")));
    all.forEach(function(element) {
      if (element.matches && element.matches(".m-layer")) {
        var pendingClose = closeState.get(element);
        var closingBackdrop = pendingClose && pendingClose.closing ? pendingClose.backdrop : null;
        cancelScheduledClose(element);
        if (closingBackdrop) closingBackdrop.hidden = true;
        var index = openLayers.findIndex(function(entry2) {
          return entry2.layer === element;
        });
        if (index >= 0) {
          var entry = openLayers.splice(index, 1)[0];
          if (entry.backdrop) entry.backdrop.hidden = true;
          unlockScroll();
        }
        element.hidden = true;
        element.inert = false;
      }
      liveBindings4.delete(element);
      if (element.__microNavigationLifetime) {
        element.__microNavigationLifetime.abort();
        delete element.__microNavigationLifetime;
      }
      if (element.dataset) {
        [
          "microTrapBound",
          "microTabsBound",
          "microFilterBound",
          "microLayerOpenBound",
          "microLayerCloseBound",
          "microBackdropBound"
        ].forEach(function(key2) {
          delete element.dataset[key2];
        });
      }
    });
    if (openLayers.length) applyBackgroundInert();
    else releaseBackgroundInert();
  }
  function appliedFilters(panel) {
    return panel && panel.__microApplied ? Object.assign({}, panel.__microApplied) : {};
  }
  function setAppliedFilters(panel, values) {
    if (panel && typeof panel.__microSetApplied === "function") panel.__microSetApplied(values);
  }
  function setLabels9(partial) {
    setLabels("navigation", partial);
  }

  // components/navigation/action-sheet.js
  var action_sheet_exports = {};
  __export(action_sheet_exports, {
    close: () => close,
    destroy: () => destroy10,
    disconnect: () => disconnect10,
    getInstance: () => getInstance10,
    init: () => init10,
    open: () => open,
    setLabels: () => setLabels10
  });
  registerLabels("navigation", defaults6);
  var MICRO_LABELS_FAMILY9 = "navigation";
  function withLabels11(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY9, fn);
  }
  function applyInstanceLabels10(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY9, options.labels);
    }
  }
  var states2 = /* @__PURE__ */ new WeakMap();
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
    if (states2.has(sheet)) return states2.get(sheet);
    if (!globalApi("Navigation") || sheet.tagName !== "DIV" || !sheet.classList.contains("m-layer")) return null;
    var state2 = { lifetime: new AbortController(), contextKey: null, pending: null };
    states2.set(sheet, state2);
    var options = { signal: state2.lifetime.signal };
    function deliver(pending) {
      if (states2.get(sheet) !== state2 || state2.pending !== pending || !pending.accepted || !pending.closed || pending.queued) return;
      pending.queued = true;
      queueMicrotask(function() {
        if (states2.get(sheet) !== state2 || state2.pending !== pending) return;
        state2.pending = null;
        sheet.dispatchEvent(new CustomEvent("micro-actions:request", {
          bubbles: true,
          detail: { id: pending.id, contextKey: pending.contextKey }
        }));
      });
    }
    sheet.addEventListener("micro-navigation:opened", function(event) {
      if (event.target === sheet) state2.pending = null;
    }, options);
    sheet.addEventListener("micro-navigation:closed", function(event) {
      if (event.target !== sheet || !state2.pending) return;
      state2.pending.closed = true;
      deliver(state2.pending);
    }, options);
    sheet.addEventListener("click", function(event) {
      var button = event.target.closest ? event.target.closest("button[data-action-id]") : null;
      if (!button || button.closest(".m-action-sheet") !== sheet || state2.pending || button.disabled || button.getAttribute("aria-disabled") === "true" || button.closest("[hidden], [inert]") || !button.getClientRects().length) return;
      var id = button.getAttribute("data-action-id");
      if (!id || !id.trim()) return;
      var pending = { id, contextKey: state2.contextKey, accepted: false, closed: false };
      state2.pending = pending;
      pending.accepted = globalApi("Navigation").requestClose(sheet, { reason: "programmatic-request", trigger: button });
      if (!pending.accepted) {
        if (state2.pending === pending) state2.pending = null;
        return;
      }
      deliver(pending);
    }, options);
    globalApi("Navigation").init(sheet);
    var bd = backdrop(sheet);
    if (bd) globalApi("Navigation").init(bd);
    return state2;
  }
  var registry7 = instanceRegistry();
  function init10(root, options) {
    var scope = root || document;
    applyInstanceLabels10(scope, options);
    var existing = registry7.get(scope);
    if (existing) {
      withLabels11(scope, function() {
        sheets(scope).forEach(initOne);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** يعيد ربط أوراق الأفعال الجديدة تحت الجذر. */
      update: function() {
        withLabels11(scope, function() {
          sheets(scope).forEach(initOne);
        });
      },
      /** يفك كل ورقة تحت الجذر (ومستمعات Navigation التابعة لها). */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown10(scope);
        registry7.remove(scope);
      }
    };
    withLabels11(scope, function() {
      sheets(scope).forEach(initOne);
    });
    registry7.set(scope, instance);
    return instance;
  }
  function getInstance10(root) {
    return registry7.get(root);
  }
  function destroy10(root) {
    var instance = registry7.get(root);
    if (instance) instance.destroy();
    else teardown10(root || document);
  }
  function open(sheet, options) {
    if (!sheet || sheet.nodeType !== 1 || !document.contains(sheet) || !sheet.matches(".m-layer.m-action-sheet")) return false;
    var state2 = initOne(sheet);
    if (!state2) return false;
    options = options || {};
    state2.pending = null;
    state2.contextKey = typeof options.contextKey === "string" ? options.contextKey : null;
    globalApi("Navigation").openLayer(sheet, { trigger: options.trigger, backdropEl: backdrop(sheet) });
    return true;
  }
  function close(sheet) {
    if (states2.has(sheet)) globalApi("Navigation").closeLayer(sheet);
  }
  function disconnect10(root) {
    destroy10(root);
  }
  function teardown10(root) {
    sheets(root).forEach(function(sheet) {
      var state2 = states2.get(sheet);
      if (!state2) return;
      state2.pending = null;
      state2.lifetime.abort();
      states2.delete(sheet);
      var nav = globalApi("Navigation");
      if (nav) nav.disconnect(sheet);
      var bd = backdrop(sheet);
      if (bd && nav) nav.disconnect(bd);
    });
  }
  function setLabels10(partial) {
    setLabels("navigation", partial);
  }

  // components/info-strip/info-strip.js
  var info_strip_exports = {};
  __export(info_strip_exports, {
    destroy: () => destroy11,
    disconnect: () => disconnect11,
    getInstance: () => getInstance11,
    init: () => init11,
    rescan: () => rescan,
    setLabels: () => setLabels11,
    update: () => rescan
  });

  // components/info-strip/labels.js
  var defaults7 = {
    "pages.ariaLabel": "اختيار البطاقة",
    "status.positionPrefix": "البطاقة ",
    "status.ofSeparator": " من ",
    "page.showPrefix": "عرض البطاقة ",
    "status.initialPrefix": "البطاقة 1 من ",
    "status.empty": "لا توجد بطاقات.",
    "peek.status.positionPrefix": "البطاقة ",
    "peek.status.ofSeparator": " من ",
    "peek.status.empty": "لا توجد بطاقات.",
    "peek.pages.ariaLabel": "اختيار البطاقة",
    "peek.page.showPrefix": "عرض البطاقة "
  };

  // components/info-strip/info-strip.js
  registerLabels("info-strip", defaults7);
  var MICRO_LABELS_FAMILY10 = "info-strip";
  function L7(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY10) || currentInstanceLabels(MICRO_LABELS_FAMILY10);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY10, key2);
  }
  function withLabels12(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY10, fn);
  }
  function applyInstanceLabels11(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY10, options.labels);
    }
  }
  function isEditingTarget(target) {
    return !!(target && (target.isContentEditable || target.closest && target.closest(
      'input, textarea, select, option, [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], [role="slider"], [data-info-strip-editable]'
    )));
  }
  var registry8 = /* @__PURE__ */ new WeakMap();
  function initStrip(strip) {
    if (strip.hasAttribute("data-info-peek")) return;
    if (registry8.has(strip)) return;
    var viewport = strip.querySelector("[data-info-strip-viewport]");
    var track = strip.querySelector("[data-info-strip-track]");
    if (!viewport || !track) return;
    strip.setAttribute("data-info-strip-ready", "");
    var listeners = [];
    function on5(elm, type8, fn) {
      elm.addEventListener(type8, fn, false);
      listeners.push({ el: elm, type: type8, fn });
    }
    var controls = strip.querySelector("[data-info-strip-controls]");
    var previous = strip.querySelector("[data-info-strip-prev]");
    var next3 = strip.querySelector("[data-info-strip-next]");
    var pageList = strip.querySelector("[data-info-strip-pages]");
    var position = strip.querySelector("[data-info-strip-position]");
    var status2 = strip.querySelector("[data-info-strip-status]");
    var empty = strip.querySelector("[data-info-strip-empty]");
    var index = 0;
    var startX = null;
    var startY = null;
    var moved = false;
    var pageButtons = [];
    function slides() {
      return Array.prototype.slice.call(track.children).filter(function(node2) {
        return node2.classList.contains("m-info-strip__slide");
      });
    }
    function syncEmptyState(count) {
      if (controls) controls.hidden = count < 2;
      viewport.hidden = count === 0;
      if (empty) empty.hidden = count > 0;
    }
    syncEmptyState(slides().length);
    if (slides().length >= 2 && empty) empty.hidden = true;
    if (pageList) {
      pageList.setAttribute("role", "group");
      if (!pageList.hasAttribute("aria-label")) pageList.setAttribute("aria-label", L7("pages.ariaLabel", pageList));
    }
    function setIndex(target, focusViewport) {
      var list = slides();
      var nextIndex = Math.max(0, Math.min(list.length - 1, target));
      if (nextIndex === index && track.style.getPropertyValue("--m-info-index") !== "") return;
      var activeElement = document.activeElement;
      if (list[index] && list[index].contains(activeElement)) {
        viewport.focus({ preventScroll: true });
      }
      index = nextIndex;
      track.style.setProperty("--m-info-index", String(index));
      list.forEach(function(slide, slideIndex) {
        var active = slideIndex === index;
        slide.setAttribute("aria-hidden", active ? "false" : "true");
        slide.inert = !active;
      });
      if (previous) previous.disabled = index === 0;
      if (next3) next3.disabled = index === list.length - 1;
      if (position) position.textContent = index + 1 + " / " + list.length;
      if (status2) status2.textContent = L7("status.positionPrefix", status2) + (index + 1) + L7("status.ofSeparator", status2) + list.length;
      if (pageList) {
        pageButtons.forEach(function(button, pageIndex) {
          button.setAttribute("aria-current", pageIndex === index ? "true" : "false");
          button.setAttribute("aria-pressed", pageIndex === index ? "true" : "false");
        });
      }
      if (focusViewport) viewport.focus({ preventScroll: true });
    }
    function rebuildPages() {
      if (!pageList) return;
      pageList.textContent = "";
      pageButtons = [];
      slides().forEach(function(_, pageIndex) {
        var page = document.createElement("button");
        page.type = "button";
        page.className = "m-info-strip__page";
        page.setAttribute("data-info-strip-page", "");
        page.setAttribute("aria-label", L7("page.showPrefix", page) + (pageIndex + 1));
        page.setAttribute("aria-current", pageIndex === 0 ? "true" : "false");
        page.setAttribute("aria-pressed", pageIndex === 0 ? "true" : "false");
        page.addEventListener("click", function() {
          setIndex(pageIndex, false);
        });
        pageList.appendChild(page);
        pageButtons.push(page);
      });
    }
    rebuildPages();
    if (previous) on5(previous, "click", function() {
      setIndex(index - 1, false);
    });
    if (next3) on5(next3, "click", function() {
      setIndex(index + 1, false);
    });
    on5(strip, "keydown", function(event) {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (isEditingTarget(event.target)) return;
      var control = event.target.closest && event.target.closest(
        "[data-info-strip-prev], [data-info-strip-next], [data-info-strip-page]"
      );
      if (!viewport.contains(event.target) && !control) return;
      if (!control && event.target.closest && event.target.closest("button, a[href], summary")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex(index + 1, false);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex(index - 1, false);
      } else if (event.key === "Home") {
        event.preventDefault();
        setIndex(0, false);
      } else if (event.key === "End") {
        event.preventDefault();
        setIndex(slides().length - 1, false);
      }
    });
    on5(viewport, "pointerdown", function(event) {
      if (isEditingTarget(event.target)) return;
      if (event.pointerType !== "touch" || event.isPrimary === false) return;
      startX = event.clientX;
      startY = event.clientY;
      moved = false;
    });
    on5(viewport, "pointerup", function(event) {
      if (startX === null || startY === null) return;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        moved = true;
        setIndex(index + (dx > 0 ? 1 : -1), false);
      }
      startX = null;
      startY = null;
    });
    on5(viewport, "pointercancel", function() {
      startX = null;
      startY = null;
    });
    on5(viewport, "click", function(event) {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    }, true);
    var initial = slides();
    initial.forEach(function(slide, slideIndex) {
      slide.setAttribute("aria-hidden", slideIndex === 0 ? "false" : "true");
      slide.inert = slideIndex !== 0;
    });
    track.style.setProperty("--m-info-index", "0");
    if (previous) previous.disabled = true;
    if (next3) next3.disabled = initial.length < 2;
    if (position) position.textContent = initial.length ? "1 / " + initial.length : "";
    if (status2) status2.textContent = initial.length ? L7("status.initialPrefix", status2) + initial.length : L7("status.empty", status2);
    registry8.set(strip, {
      listeners,
      viewport,
      track,
      controls,
      empty,
      setIndex,
      slides,
      rebuildPages,
      syncEmptyState
    });
  }
  function teardownStrip(strip) {
    var data = registry8.get(strip);
    if (!data) return;
    data.listeners.forEach(function(L22) {
      L22.el.removeEventListener(L22.type, L22.fn, false);
    });
    registry8.delete(strip);
    strip.removeAttribute("data-info-strip-ready");
    data.track.style.removeProperty("--m-info-index");
    data.slides().forEach(function(slide) {
      slide.removeAttribute("aria-hidden");
      slide.inert = false;
    });
    if (data.controls) data.controls.hidden = false;
    if (data.empty) data.empty.hidden = true;
    data.viewport.hidden = false;
  }
  var instances4 = instanceRegistry();
  function init11(root, options) {
    var scope = root || document;
    applyInstanceLabels11(scope, options);
    var existing = instances4.get(scope);
    if (existing) {
      withLabels12(scope, function() {
        if (scope.matches && scope.matches("[data-info-strip]")) initStrip(scope);
        scope.querySelectorAll("[data-info-strip]").forEach(initStrip);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** = rescan: إعادة التقاط البطاقات بعد تغيير شرائح DOM للمضيف. */
      update: function() {
        withLabels12(scope, function() {
          rescan(scope);
        });
      },
      /** يفك مستمعات كل شريط (لا يمس بطاقات المضيف ولا حالتها). */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown11(scope);
        instances4.remove(scope);
      }
    };
    withLabels12(scope, function() {
      if (scope.matches && scope.matches("[data-info-strip]")) initStrip(scope);
      scope.querySelectorAll("[data-info-strip]").forEach(initStrip);
    });
    instances4.set(scope, instance);
    return instance;
  }
  function getInstance11(root) {
    return instances4.get(root);
  }
  function destroy11(root) {
    var instance = instances4.get(root);
    if (instance) instance.destroy();
    else teardown11(root || document);
  }
  function rescan(root) {
    var scope = root || document;
    var list = [];
    if (scope.matches && scope.matches("[data-info-strip]")) list.push(scope);
    Array.prototype.push.apply(list, scope.querySelectorAll("[data-info-strip]"));
    list.forEach(function(strip) {
      if (strip.hasAttribute("data-info-peek")) return;
      if (strip.hasAttribute("data-info-strip-ready")) teardownStrip(strip);
      initStrip(strip);
    });
  }
  function disconnect11(root) {
    destroy11(root);
  }
  function teardown11(root) {
    var scope = root || document;
    if (scope.matches && scope.matches("[data-info-strip]")) teardownStrip(scope);
    scope.querySelectorAll("[data-info-strip]").forEach(teardownStrip);
  }
  function setLabels11(partial) {
    setLabels("info-strip", partial);
  }

  // components/info-strip/info-strip-peek.js
  var info_strip_peek_exports = {};
  __export(info_strip_peek_exports, {
    destroy: () => destroy12,
    disconnect: () => disconnect12,
    getIndex: () => getIndex,
    getInstance: () => getInstance12,
    goTo: () => goToIndex,
    init: () => init12,
    next: () => next,
    prev: () => prev,
    setLabels: () => setLabels12,
    update: () => updateApi
  });
  registerLabels("info-strip", defaults7);
  var MICRO_LABELS_FAMILY11 = "info-strip";
  function L8(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY11) || currentInstanceLabels(MICRO_LABELS_FAMILY11);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY11, key2);
  }
  function withLabels13(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY11, fn);
  }
  function applyInstanceLabels12(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY11, options.labels);
    }
  }
  var reduceQuery2 = null;
  function prefersReducedMotion() {
    if (!reduceQuery2 && typeof window !== "undefined" && window.matchMedia) {
      reduceQuery2 = window.matchMedia("(prefers-reduced-motion: reduce)");
    }
    return !!(reduceQuery2 && reduceQuery2.matches);
  }
  var stateOf2 = /* @__PURE__ */ new WeakMap();
  var viewportObservers = /* @__PURE__ */ new WeakMap();
  var RESIZE_EPS2 = 0.5;
  function recenterStrip(strip, st) {
    if (st.disconnected) return;
    if (st.raf) return;
    st.raf = requestAnimationFrame(function() {
      st.raf = null;
      if (st.disconnected || st.count <= 0) return;
      var w = st.viewport.clientWidth;
      if (w <= 1) return;
      var direction = getComputedStyle(strip).direction;
      if (st.lastWidth !== void 0 && Math.abs(w - st.lastWidth) < RESIZE_EPS2 && direction === st.lastDirection) return;
      st.lastWidth = w;
      st.lastDirection = direction;
      goToIndex(strip, st.index, { animate: false });
    });
  }
  function observeViewport(strip, st) {
    if (typeof ResizeObserver !== "function") return;
    if (viewportObservers.has(strip)) return;
    var ro = new ResizeObserver(function(entries) {
      if (st.disconnected || viewportObservers.get(strip) !== ro) return;
      var w = entries.length ? entries[0].contentRect.width : 0;
      if (w <= 1) return;
      recenterStrip(strip, st);
    });
    ro.observe(st.viewport);
    viewportObservers.set(strip, ro);
  }
  function rtlOf(strip) {
    return getComputedStyle(strip).direction === "rtl";
  }
  function scrollToSlide(st, i, animate) {
    var slide = st.slides[i];
    if (!slide) return;
    st.programmatic = true;
    if (st.scrollTimer) window.clearTimeout(st.scrollTimer);
    st.scrollTimer = window.setTimeout(
      function() {
        st.programmatic = false;
      },
      animate && !prefersReducedMotion() ? 480 : 80
    );
    slide.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: animate && !prefersReducedMotion() ? "smooth" : "auto"
    });
  }
  function nearestSlide(st) {
    var box = st.viewport.getBoundingClientRect();
    var center = box.left + box.width / 2;
    var best = 0, bestDist = Infinity;
    st.slides.forEach(function(slide, i) {
      var rect = slide.getBoundingClientRect();
      var dist = Math.abs(rect.left + rect.width / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }
  function goToIndex(strip, i, opts) {
    var st = stateOf2.get(strip);
    if (!st || st.disconnected || st.count === 0) return;
    var animate = !(opts && opts.animate === false);
    var clamped = Math.max(0, Math.min(st.count - 1, i));
    scrollToSlide(st, clamped, animate);
    if (clamped !== st.index) {
      st.index = clamped;
      update4(strip, st);
      strip.dispatchEvent(new CustomEvent("micro-info-peek:change", {
        bubbles: true,
        detail: { index: st.index, count: st.count }
      }));
    } else {
      update4(strip, st);
    }
  }
  function update4(strip, st) {
    var activeEl = document.activeElement;
    var focusedIdx = -1;
    if (activeEl) {
      for (var fi = 0; fi < st.slides.length; fi++) {
        if (st.slides[fi].contains(activeEl)) {
          focusedIdx = fi;
          break;
        }
      }
    }
    st.slides.forEach(function(slide, i) {
      var active = i === st.index;
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      slide.inert = !active;
    });
    if (focusedIdx >= 0 && focusedIdx !== st.index) {
      st.viewport.focus({ preventScroll: true });
    }
    if (st.prevBtn) st.prevBtn.disabled = st.index === 0 || st.count <= 1;
    if (st.nextBtn) st.nextBtn.disabled = st.index === st.count - 1 || st.count <= 1;
    if (st.position) st.position.textContent = st.index + 1 + " / " + st.count;
    if (st.status) st.status.textContent = L8("peek.status.positionPrefix", status) + (st.index + 1) + L8("peek.status.ofSeparator", status) + st.count;
    if (st.pages) {
      Array.prototype.forEach.call(st.pages.querySelectorAll("[data-info-strip-page]"), function(b, i) {
        b.setAttribute("aria-current", i === st.index ? "true" : "false");
        b.setAttribute("aria-pressed", i === st.index ? "true" : "false");
      });
    }
  }
  function wireScroll(strip, st) {
    listenDom(st, st.viewport, "scroll", function() {
      if (st.disconnected || st.programmatic || st.scrollRaf) return;
      st.scrollRaf = requestAnimationFrame(function() {
        st.scrollRaf = 0;
        if (st.disconnected || st.programmatic || st.count === 0) return;
        var i = nearestSlide(st);
        if (i !== st.index) {
          st.index = i;
          update4(strip, st);
          strip.dispatchEvent(new CustomEvent("micro-info-peek:change", {
            bubbles: true,
            detail: { index: st.index, count: st.count }
          }));
        }
      });
    }, { passive: true });
    listenDom(st, st.viewport, "dragstart", function(e) {
      if (!st.disconnected) e.preventDefault();
    });
  }
  function isEditingTarget2(target) {
    return !!(target && (target.isContentEditable || target.closest && target.closest(
      'input, textarea, select, option, [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], [role="slider"], [data-info-strip-editable]'
    )));
  }
  function listenDom(st, element, type8, handler, options) {
    element.addEventListener(type8, handler, options);
    if (!st.domListeners) st.domListeners = [];
    st.domListeners.push({ element, type: type8, handler, options });
  }
  function wireKeys(strip, st) {
    listenDom(st, strip, "keydown", function(e) {
      if (st.disconnected || e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || st.count === 0) return;
      var target = e.target;
      if (isEditingTarget2(target)) return;
      if (target && target.closest && target.closest("button, a[href], summary") && !target.closest("[data-info-strip-prev], [data-info-strip-next], [data-info-strip-page]")) return;
      var rtl = rtlOf(strip);
      var handled = true;
      if (e.key === "ArrowRight") {
        rtl ? prev(strip) : next(strip);
      } else if (e.key === "ArrowLeft") {
        rtl ? next(strip) : prev(strip);
      } else if (e.key === "Home") {
        goToIndex(strip, 0);
      } else if (e.key === "End") {
        goToIndex(strip, st.count - 1);
      } else {
        handled = false;
      }
      if (handled) e.preventDefault();
    });
  }
  function activate(strip, st) {
    st.disconnected = false;
    if (!st.resizeHandler) {
      st.resizeHandler = function() {
        recenterStrip(strip, st);
      };
      window.addEventListener("resize", st.resizeHandler);
    }
    if (reduceQuery2 && reduceQuery2.addEventListener && !st.motionHandler) {
      st.motionHandler = function() {
        goToIndex(strip, st.index, { animate: false });
      };
      reduceQuery2.addEventListener("change", st.motionHandler);
    }
    observeViewport(strip, st);
    if (!st.directionObserver && typeof MutationObserver === "function") {
      var observer = new MutationObserver(function() {
        if (st.disconnected || st.directionObserver !== observer || getComputedStyle(strip).direction === st.lastDirection) return;
        recenterStrip(strip, st);
      });
      st.directionObserver = observer;
      for (var node2 = strip; node2; node2 = node2.parentElement) {
        observer.observe(node2, { attributes: true, attributeFilter: ["dir", "class", "style"] });
      }
    }
    recenterStrip(strip, st);
    var generation = st.generation = (st.generation || 0) + 1;
    if (document.fonts) document.fonts.ready.then(function() {
      if (st.disconnected || st.generation !== generation) return;
      st.lastWidth = void 0;
      recenterStrip(strip, st);
    });
  }
  function initStrip2(strip) {
    if (stateOf2.has(strip)) {
      var reSt = stateOf2.get(strip);
      if (reSt && reSt.count > 0) {
        if (reSt.disconnected) activate(strip, reSt);
        else recenterStrip(strip, reSt);
      }
      return;
    }
    var viewport = strip.querySelector("[data-info-strip-viewport]");
    var track = strip.querySelector("[data-info-strip-track]");
    var slides = track ? Array.prototype.slice.call(track.children).filter(function(n) {
      return n.classList.contains("m-info-strip__slide");
    }) : [];
    var controls = strip.querySelector("[data-info-strip-controls]");
    var pages = strip.querySelector("[data-info-strip-pages]");
    var status2 = strip.querySelector("[data-info-strip-status]");
    var empty = strip.querySelector("[data-info-strip-empty]");
    var prevBtn = strip.querySelector("[data-info-strip-prev]");
    var nextBtn = strip.querySelector("[data-info-strip-next]");
    var position = strip.querySelector("[data-info-strip-position]");
    if (!viewport || !track) return;
    strip.setAttribute("data-info-peek-ready", "");
    if (!slides.length) {
      viewport.hidden = true;
      if (controls) controls.hidden = true;
      if (empty) empty.hidden = false;
      if (position) position.textContent = "";
      if (status2) status2.textContent = L8("peek.status.empty", status2);
      stateOf2.set(strip, {
        viewport,
        track,
        slides: [],
        prevBtn,
        nextBtn,
        position,
        status: status2,
        pages,
        index: -1,
        count: 0,
        programmatic: false
      });
      return;
    }
    if (!strip.hasAttribute("tabindex")) strip.setAttribute("tabindex", "0");
    if (empty) empty.hidden = true;
    if (slides.length < 2 && controls) controls.hidden = true;
    var st = {
      viewport,
      track,
      slides,
      prevBtn,
      nextBtn,
      position,
      status: status2,
      pages,
      index: 0,
      count: slides.length,
      programmatic: false
    };
    stateOf2.set(strip, st);
    if (pages) {
      pages.setAttribute("role", "group");
      if (!pages.hasAttribute("aria-label")) pages.setAttribute("aria-label", L8("peek.pages.ariaLabel", pages));
      pages.textContent = "";
      slides.forEach(function(_, i) {
        var page = document.createElement("button");
        page.type = "button";
        page.className = "m-info-strip__page";
        page.setAttribute("data-info-strip-page", "");
        page.setAttribute("aria-label", L8("peek.page.showPrefix", page) + (i + 1));
        page.setAttribute("aria-current", i === 0 ? "true" : "false");
        page.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        listenDom(st, page, "click", function() {
          goToIndex(strip, i, false);
        });
        pages.appendChild(page);
      });
    }
    if (prevBtn) listenDom(st, prevBtn, "click", function() {
      prev(strip);
    });
    if (nextBtn) listenDom(st, nextBtn, "click", function() {
      next(strip);
    });
    wireScroll(strip, st);
    wireKeys(strip, st);
    activate(strip, st);
    update4(strip, st);
    recenterStrip(strip, st);
  }
  function next(strip) {
    var st = stateOf2.get(strip);
    if (st) goToIndex(strip, st.index + 1);
  }
  function prev(strip) {
    var st = stateOf2.get(strip);
    if (st) goToIndex(strip, st.index - 1);
  }
  var instances5 = instanceRegistry();
  function init12(root, options) {
    var scope = root || document;
    applyInstanceLabels12(scope, options);
    var existing = instances5.get(scope);
    if (existing) {
      withLabels13(scope, function() {
        if (scope.matches && scope.matches("[data-info-peek]")) initStrip2(scope);
        scope.querySelectorAll("[data-info-peek]").forEach(initStrip2);
      });
      return existing;
    }
    var destroyed = false;
    function targetStrip() {
      if (scope.matches && scope.matches("[data-info-peek]")) return scope;
      return scope.querySelector ? scope.querySelector("[data-info-peek]") : null;
    }
    var instance = {
      root: scope,
      /** = goTo: تنقل الفهرس (يطلق micro-info-peek:change حتى برمجيًا). */
      update: function(updateOptions) {
        updateOptions = updateOptions || {};
        var stripEl = targetStrip();
        var st = stripEl ? stateOf2.get(stripEl) : null;
        var index = typeof updateOptions.index === "number" ? updateOptions.index : st ? st.index : 0;
        withLabels13(scope, function() {
          if (stripEl) goToIndex(stripEl, index, updateOptions);
        });
      },
      goTo: function(index, goToOptions) {
        var stripEl = targetStrip();
        if (stripEl) goToIndex(stripEl, index, goToOptions);
      },
      next: function() {
        var stripEl = targetStrip();
        if (stripEl) next(stripEl);
      },
      prev: function() {
        var stripEl = targetStrip();
        if (stripEl) prev(stripEl);
      },
      getIndex: function() {
        var stripEl = targetStrip();
        return stripEl ? getIndex(stripEl) : -1;
      },
      /** يفك مستمعات كل شريط ومراقباته ومؤقتاته تحت الجذر. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown12(scope);
        instances5.remove(scope);
      }
    };
    withLabels13(scope, function() {
      if (scope.matches && scope.matches("[data-info-peek]")) initStrip2(scope);
      scope.querySelectorAll("[data-info-peek]").forEach(initStrip2);
    });
    instances5.set(scope, instance);
    return instance;
  }
  function getInstance12(root) {
    return instances5.get(root);
  }
  function destroy12(root) {
    var instance = instances5.get(root);
    if (instance) instance.destroy();
    else teardown12(root || document);
  }
  function updateApi(strip, index, options) {
    goToIndex(strip, index, options);
  }
  function getIndex(strip) {
    var st = stateOf2.get(strip);
    return st ? st.index : -1;
  }
  function disconnect12(root) {
    destroy12(root);
  }
  function teardown12(root) {
    var scope = root || document;
    var strips = [];
    if (scope.matches && scope.matches("[data-info-peek]")) strips.push(scope);
    Array.prototype.push.apply(strips, scope.querySelectorAll("[data-info-peek]"));
    strips.forEach(function(strip) {
      var ro = viewportObservers.get(strip);
      if (ro) {
        ro.disconnect();
        viewportObservers.delete(strip);
      }
      var st = stateOf2.get(strip);
      if (st) {
        st.disconnected = true;
        if (st.domListeners) {
          st.domListeners.splice(0).forEach(function(entry) {
            entry.element.removeEventListener(entry.type, entry.handler, entry.options);
          });
        }
        if (st.directionObserver) {
          st.directionObserver.disconnect();
          st.directionObserver = null;
        }
        st.generation = (st.generation || 0) + 1;
        if (st.scrollTimer) {
          window.clearTimeout(st.scrollTimer);
          st.scrollTimer = null;
        }
        if (st.scrollRaf) {
          cancelAnimationFrame(st.scrollRaf);
          st.scrollRaf = 0;
        }
        if (st.resizeHandler) {
          window.removeEventListener("resize", st.resizeHandler);
          st.resizeHandler = null;
        }
        if (st.motionHandler) {
          reduceQuery2.removeEventListener("change", st.motionHandler);
          st.motionHandler = null;
        }
        st.lastWidth = void 0;
        if (st.raf) {
          cancelAnimationFrame(st.raf);
          st.raf = null;
        }
      }
    });
  }
  function setLabels12(partial) {
    setLabels("info-strip", partial);
  }

  // components/metric-comparison/metric-comparison.js
  var metric_comparison_exports = {};
  __export(metric_comparison_exports, {
    destroy: () => destroy13,
    disconnect: () => disconnect13,
    getInstance: () => getInstance13,
    init: () => init13,
    render: () => render3,
    setLabels: () => setLabels13,
    update: () => render3
  });

  // components/metric-comparison/labels.js
  var defaults8 = {
    "circles.discloseAriaLabel": "القراءات الدقيقة لكل القيم",
    "circles.renderError": "تعذّر رسم الدوائر بهذا الإعداد. القيم معروضة في القائمة.",
    "circles.unknownLayoutDetail": "' غير معروف (المعروف: separated/overlap) — رُفض الرسم؛ القراءات كاملة في القائمة البديلة.",
    "circles.scaleError": "تعذّر رسم الدوائر بهذا النطاق. القيم معروضة في القائمة.",
    "circles.scaleInvalidDetailPrefix": "' غير موجب أو أصغر من أكبر مقدار معلوم (",
    "circles.scaleInvalidDetailSuffix": ") — مقياس غير قابل للاستخدام؛ رُفض الرسم والقراءات كاملة في القائمة البديلة.",
    "circles.radiusInvalidDetail": "' غير موجب — حد حجم دائرة غير قابل للاستخدام؛ رُفض الرسم والقراءات كاملة في القائمة البديلة.",
    "circles.deferredMessage": "لا تتوفر مساحة عرض بعد؛ ستظهر الدوائر عند إتاحة البطاقة.",
    "circles.deferredDetail": "metric-circles: عرض اللوحة 0 — الرسم مؤجل حتى إتاحة المساحة (يعاد الرسم عند الإظهار).",
    "circles.zeroMessage": "القيم المعروفة صفرية؛ العلامة المجوفة تعني صفرًا، وليست مساحة عددية.",
    "circles.emptyMessage": "لا توجد قراءات متاحة للمقارنة بعد.",
    "circles.zeroDetail": "metric-circles: كل القيم المعلومة صفر — علامات صفر مجوفة بلا مساحات مقارنة.",
    "circles.noValuesDetail": "metric-circles: لا قيم معلومة — لا رسم.",
    "circles.scaledMessageBase": "المساحة تقارن مقدار القيمة؛ الإشارة مكتوبة في القراءة.",
    "circles.zeroMarkNote": " العلامة المجوفة تعني صفرًا، وليست مساحة عددية.",
    "circles.scaleNotePrefix": " النطاق يصل إلى ",
    "circles.overlapNote": " التداخل بصري فقط ولا يدل على تقاطع أو علاقة بين القيم.",
    "circles.fitNote": " — الحجم يتكيف مع عرض البطاقة ضمن نصف القطر؛ scale=",
    "value.invalid": "قيمة غير صالحة",
    "value.missing": "غير متاح",
    "value.unreadable": "تعذّر قراءة القيمة",
    "chart.empty": "لا توجد بيانات للمقارنة.",
    "table.showButton": "عرض البيانات كجدول",
    "table.hideButton": "إخفاء جدول البيانات",
    "table.unitPrefix": "الوحدة: ",
    "table.periodPrefix": "الفترة: ",
    "table.separator": "، ",
    "table.head.category": "الفئة",
    "table.head.value": "القيمة",
    "table.head.unit": "الوحدة",
    "table.head.period": "الفترة",
    "table.mainMetricFallback": "القيمة الرئيسية",
    "table.missingValue": "— (غير متاح)",
    "table.invalidValue": "(قيمة غير صالحة)",
    "table.zeroValue": "(صفر)",
    "table.negativeValue": "(سالب)",
    "table.head.state": "الحالة",
    "bars.stateZero": "صفر",
    "bars.stateNegative": "سالب — معروض بالقيمة والإشارة لا بالمساحة",
    "bars.emptyDetail": "metric-bars: مصدر فارغ — لا صفوف.",
    "bars.unitMismatchError": "تعذّر عرض المقارنة: وحدة أو فترة غير متوافقة بين القيم. القراءات معروضة كاملة.",
    "bars.unitMismatchDetail": "metric-bars: تباين data-unit/data-period في بعض الصفوف مع data-common-unit/data-common-period — لا مقياس مشترك؛ رُفض رسم الأشرطة والقراءات كاملة.",
    "bars.scaleError": "تعذّر عرض المقارنة بهذا النطاق. القراءات معروضة كاملة.",
    "bars.scaleInvalidDetail": "' غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض رسم الأشرطة والقراءات كاملة.",
    "bars.unfairScaleError": "تعذّر عرض مقارنة عادلة بهذا النطاق. القراءات معروضة كاملة.",
    "bars.underscaleDetailPrefix": " أصغر من أكبر مقدار معلوم (",
    "bars.underscaleDetailSuffix": ") — رسم نسبي كان سيخفي الفرق؛ رُفض رسم الأشرطة والقراءات كاملة.",
    "bars.scaledMessagePrefix": "الأشرطة حتى ",
    "bars.scaledDetailUnit": "؛ common-unit=",
    "bars.scaledDetailPeriod": "؛ common-period=",
    "bars.zeroMessage": "القيم المعروفة صفرية؛ علامة الصفر ظاهرة دون طول مصطنع.",
    "bars.zeroDetail": "metric-bars: كل القيم المعلومة صفر — علامات صفر بلا أطوال.",
    "bars.emptyMessage": "لا توجد قراءات متاحة لبناء مقياس بعد.",
    "bars.noValuesDetail": "metric-bars: لا قيم معلومة — لا مقياس.",
    "bars.zeroLineNote": " خط الوسط صفر؛ الموجب يمينه والسالب يساره.",
    "main.missing": "(غير متاح)",
    "main.invalidSuffix": " (قيمة غير صالحة)"
  };

  // components/metric-comparison/metric-comparison.js
  registerLabels("metric-comparison", defaults8);
  var MICRO_LABELS_FAMILY12 = "metric-comparison";
  function L9(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY12) || currentInstanceLabels(MICRO_LABELS_FAMILY12);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY12, key2);
  }
  function withLabels14(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY12, fn);
  }
  function applyInstanceLabels13(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY12, options.labels);
    }
  }
  var NUMBER_RE = /^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
  var SERIES = { a: true, b: true, c: true, d: true, e: true };
  function readNumber(raw) {
    if (raw === null || raw === void 0 || String(raw).trim() === "") return { state: "missing", value: null };
    var text2 = String(raw).trim().replace(/^\u2212/, "-");
    if (!NUMBER_RE.test(text2)) return { state: "invalid", value: null };
    var value = Number(text2.replace(/,/g, ""));
    if (!isFinite(value)) return { state: "invalid", value: null };
    return { state: value < 0 ? "negative" : value === 0 ? "zero" : "positive", value };
  }
  function seriesOf(node2) {
    var key2 = node2.getAttribute("data-series") || "a";
    return SERIES[key2] ? key2 : "a";
  }
  function make(tag, className, text2) {
    var node2 = document.createElement(tag);
    if (className) node2.className = className;
    if (text2 !== void 0) node2.textContent = text2;
    return node2;
  }
  function clearDiagnostics(chart) {
    chart.removeAttribute("data-scale-state");
    chart.removeAttribute("data-scale-detail");
  }
  function writeDiagnostics(chart, state2, detail) {
    chart.setAttribute("data-scale-state", state2);
    chart.setAttribute("data-scale-detail", detail);
  }
  function circleItems(chart) {
    clearDiagnostics(chart);
    var source = chart.querySelector("[data-metric-source]");
    var target = chart.querySelector("[data-metric-items]");
    var fallbackTarget = chart.querySelector("[data-metric-fallback]");
    var empty = chart.querySelector("[data-metric-empty]");
    if (!source || !target) return;
    if (!fallbackTarget) {
      fallbackTarget = make("ul", "m-metric-circles__fallback");
      fallbackTarget.setAttribute("data-metric-fallback", "");
      fallbackTarget.setAttribute("aria-label", L9("circles.discloseAriaLabel", fallbackTarget));
      target.insertAdjacentElement("afterend", fallbackTarget);
    }
    var items = Array.prototype.slice.call(source.querySelectorAll("[data-label]")).map(function(node2) {
      return {
        label: node2.getAttribute("data-label") || "",
        raw: node2.getAttribute("data-value"),
        display: node2.getAttribute("data-display-value"),
        unit: node2.getAttribute("data-unit") || chart.getAttribute("data-unit") || "",
        period: node2.getAttribute("data-period") || chart.getAttribute("data-period") || "",
        state: node2.getAttribute("data-state"),
        series: seriesOf(node2)
      };
    });
    target.textContent = "";
    target.setAttribute("aria-hidden", "true");
    if (fallbackTarget) fallbackTarget.textContent = "";
    var known = items.map(function(item) {
      return item.state === "invalid" || item.state === "unavailable" ? null : readNumber(item.raw);
    }).filter(function(item) {
      return item && item.value !== null;
    });
    var magnitudes = known.filter(function(item) {
      return item.value !== 0;
    });
    var declaredRaw = chart.getAttribute("data-max");
    var declared = declaredRaw === null ? null : readNumber(declaredRaw);
    var measuredMax = magnitudes.reduce(function(largest, item) {
      return Math.max(largest, Math.abs(item.value));
    }, 0);
    var max = declaredRaw === null ? measuredMax : declared && declared.state === "positive" ? declared.value : 0;
    var radiusRaw = chart.getAttribute("data-radius");
    var radiusValue = radiusRaw === null ? { state: "positive", value: 72 } : readNumber(radiusRaw);
    var layout = chart.getAttribute("data-layout") || "separated";
    var width = target.getBoundingClientRect().width;
    var validLayout = layout === "separated" || layout === "overlap";
    var validMax = declaredRaw === null || declared && declared.state === "positive" && declared.value >= measuredMax;
    var validRadius = radiusRaw === null || radiusValue.state === "positive" && radiusValue.value > 0;
    var zeroCount = known.length - magnitudes.length;
    var itemCount = known.length;
    var gap = parseFloat(window.getComputedStyle(target).columnGap) || 16;
    gap = Math.min(gap, width / Math.max(2, itemCount * 2));
    var zeroDiameter = Math.min(20, width / Math.max(2, itemCount * 2));
    var weights = magnitudes.reduce(function(sum, value) {
      return sum + Math.sqrt(Math.abs(value.value) / max);
    }, 0);
    var availableDiameter = layout === "overlap" ? width * 0.57 : weights > 0 ? Math.max(0, width - gap * Math.max(0, itemCount - 1) - zeroCount * zeroDiameter) / weights : width;
    var maxRadius = Math.min(radiusValue.value, Math.max(0, availableDiameter / 2));
    var geometryAllowed = validLayout && validMax && validRadius && width > 0 && measuredMax > 0;
    var positions = [
      [0.38, 0.36],
      [0.62, 0.36],
      [0.5, 0.66],
      [0.38, 0.66],
      [0.62, 0.66]
    ];
    var overlapHeight = geometryAllowed ? maxRadius * 2 * 1.55 : 0;
    target.setAttribute("data-layout", measuredMax > 0 ? layout : "separated");
    target.style.setProperty("--m-circle-overlap-height", overlapHeight + "px");
    target.style.columnGap = gap + "px";
    chart.__microMetricWidth = width;
    var scaleNote = chart.querySelector("[data-metric-scale]");
    if (scaleNote) {
      scaleNote.setAttribute("data-valid", String(validLayout && validMax && validRadius && width > 0));
    }
    if (!validLayout) {
      if (scaleNote) scaleNote.textContent = L9("circles.renderError", scaleNote);
      writeDiagnostics(
        chart,
        "invalid-layout",
        "metric-circles: data-layout='" + layout + L9("circles.unknownLayoutDetail")
      );
    } else if (!validMax) {
      if (scaleNote) scaleNote.textContent = L9("circles.scaleError", scaleNote);
      writeDiagnostics(
        chart,
        "invalid-scale",
        "metric-circles: data-max='" + declaredRaw + L9("circles.scaleInvalidDetailPrefix") + measuredMax + L9("circles.scaleInvalidDetailSuffix")
      );
    } else if (!validRadius) {
      if (scaleNote) scaleNote.textContent = L9("circles.renderError", scaleNote);
      writeDiagnostics(
        chart,
        "invalid-radius",
        "metric-circles: data-radius='" + radiusRaw + L9("circles.radiusInvalidDetail")
      );
    } else if (!width) {
      if (scaleNote) scaleNote.textContent = L9("circles.deferredMessage", scaleNote);
      writeDiagnostics(
        chart,
        "pending-width",
        L9("circles.deferredDetail")
      );
    } else if (!measuredMax) {
      if (scaleNote) scaleNote.textContent = known.length ? L9("circles.zeroMessage") : L9("circles.emptyMessage");
      writeDiagnostics(
        chart,
        known.length ? "zero" : "empty",
        known.length ? L9("circles.zeroDetail") : L9("circles.noValuesDetail")
      );
    } else {
      if (scaleNote) {
        var scaledMessage = L9("circles.scaledMessageBase");
        if (zeroCount) scaledMessage += L9("circles.zeroMarkNote");
        if (declaredRaw !== null) scaledMessage += L9("circles.scaleNotePrefix", chart) + (chart.getAttribute("data-max-label") || declaredRaw) + ".";
        if (layout === "overlap") scaledMessage += L9("circles.overlapNote");
        scaleNote.textContent = scaledMessage;
      }
      writeDiagnostics(
        chart,
        "ok",
        "metric-circles: radius=" + (radiusRaw === null ? "auto" : radiusRaw) + L9("circles.fitNote") + (declaredRaw === null ? "auto-largest-known" : "declared")
      );
    }
    var itemGeometry = items.map(function(item, index) {
      var value = item.state === "invalid" || item.state === "unavailable" ? null : readNumber(item.raw);
      var magnitude = value && value.value !== null ? Math.abs(value.value) : null;
      var position = positions[index] || [0.5, 0.5];
      if (index >= positions.length) {
        var angle = (index - positions.length) * Math.PI * 2 / Math.max(1, items.length - positions.length);
        position = [0.5 + Math.cos(angle) * 0.16, 0.5 + Math.sin(angle) * 0.15];
      }
      return {
        value: magnitude,
        diameter: geometryAllowed && magnitude !== null ? 2 * maxRadius * Math.sqrt(magnitude / max) : 0,
        x: position[0],
        y: position[1]
      };
    });
    items.forEach(function(item, index) {
      var state2 = item.state === "unavailable" ? "missing" : item.state === "invalid" ? "invalid" : readNumber(item.raw).state;
      var display = state2 === "missing" ? "—" + (item.unit ? " " + item.unit : "") : state2 === "invalid" ? item.display || (item.raw || L9("value.invalid")) + (item.unit ? " " + item.unit : "") : (item.display || item.raw) + (item.unit && !item.display ? " " + item.unit : "");
      var stateText2 = state2 === "missing" ? L9("value.missing") : state2 === "invalid" ? L9("value.unreadable") : "";
      var zeroMarker = state2 === "zero" && validLayout && validMax && validRadius && width > 0;
      var canRender = zeroMarker || geometryAllowed && (state2 === "positive" || state2 === "negative");
      if (canRender) {
        var li = make("li", "m-metric-circles__item");
        var geometry = itemGeometry[index];
        var diameter = zeroMarker ? zeroDiameter : geometry.diameter;
        li.setAttribute("data-series", item.series);
        li.setAttribute("data-state", state2);
        li.style.setProperty("--m-circle-diameter", diameter + "px");
        li.style.setProperty("--m-circle-x", geometry.x * 100 + "%");
        li.style.setProperty("--m-circle-y", geometry.y * 100 + "%");
        li.style.setProperty("--m-circle-layer", String(Math.round(diameter)));
        var visual = make("span", "m-metric-circles__visual");
        visual.setAttribute("aria-hidden", "true");
        var bubble = make("span", "m-metric-circles__bubble");
        bubble.setAttribute("aria-hidden", "true");
        visual.appendChild(bubble);
        li.appendChild(visual);
        target.appendChild(li);
        li.setAttribute("data-inside", "false");
      }
      if (fallbackTarget) {
        fallbackTarget.appendChild(fallbackItem(item, display, stateText2));
      }
    });
    if (empty) {
      empty.hidden = items.length > 0;
      if (!items.length) empty.textContent = chart.getAttribute("data-empty-message") || L9("chart.empty", empty);
    }
    syncCirclesTable(chart, items);
  }
  function fallbackItem(item, display, stateText2) {
    var row = make("li", "m-metric-circles__fallback-item");
    row.setAttribute("data-series", item.series);
    row.appendChild(make("span", "m-metric-circles__fallback-label", item.label));
    var reading = make("span", "m-metric-circles__fallback-reading", display);
    reading.setAttribute("dir", "ltr");
    row.appendChild(reading);
    if (stateText2) row.appendChild(make("span", "m-metric-circles__fallback-state", stateText2));
    return row;
  }
  var metricTableUid = 0;
  function ensureDatasetWrap(chart) {
    var wrap = chart.querySelector(".m-main-metric__dataset-wrap");
    var btn, table;
    if (!wrap) {
      wrap = make("div", "m-main-metric__dataset-wrap");
      btn = make("button", "m-btn m-btn--secondary m-main-metric__disclose", L9("table.showButton", btn));
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");
      table = make("table", "m-main-metric__dataset");
      table.hidden = true;
      wrap.appendChild(btn);
      wrap.appendChild(table);
      chart.appendChild(wrap);
    } else {
      btn = wrap.querySelector(".m-main-metric__disclose");
      table = wrap.querySelector(".m-main-metric__dataset");
    }
    if (btn) btn.classList.add("m-btn", "m-btn--secondary");
    var binding = btn && btn.__microDatasetDisclosure;
    if (btn && table && (!binding || binding.table !== table)) {
      if (binding) btn.removeEventListener("click", binding.handler);
      do {
        table.id = "micro-metric-dataset-" + ++metricTableUid;
      } while (document.getElementById(table.id) && document.getElementById(table.id) !== table);
      btn.setAttribute("aria-controls", table.id);
      var handler = function() {
        var open2 = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open2 ? "false" : "true");
        table.hidden = open2;
        btn.textContent = open2 ? L9("table.showButton", btn) : L9("table.hideButton", btn);
      };
      btn.__microDatasetDisclosure = { table, handler };
      btn.addEventListener("click", handler);
    }
    return { wrap, btn, table };
  }
  function buildTableHead(table, headers) {
    var thead = make("thead");
    var headRow = make("tr");
    headers.forEach(function(h) {
      var th = make("th", null, h);
      th.setAttribute("scope", "col");
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
  }
  function appendRow(tbody, cells) {
    var tr = make("tr");
    var th = make("th", null, cells[0]);
    th.setAttribute("scope", "row");
    tr.appendChild(th);
    for (var i = 1; i < cells.length; i++) {
      var td = make("td");
      if (cells[i] && cells[i].nodeType) td.appendChild(cells[i]);
      else td.textContent = cells[i];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  function datasetReading(value, suffix, numeric) {
    var fragment = document.createDocumentFragment();
    var reading = make("bdi", null, value);
    reading.dir = numeric === false ? "auto" : "ltr";
    fragment.appendChild(reading);
    if (suffix) fragment.appendChild(document.createTextNode(" " + suffix));
    return fragment;
  }
  function tableCaptionBase(chart) {
    var title = chart.querySelector(".m-main-metric__title, .m-metric-circles__title");
    var parts2 = [String(title && title.textContent || chart.getAttribute("data-title") || chart.getAttribute("aria-label") || "").trim()];
    var unit = chart.getAttribute("data-common-unit") || chart.getAttribute("data-unit");
    var period = chart.getAttribute("data-common-period") || chart.getAttribute("data-period");
    if (unit) parts2.push(L9("table.unitPrefix") + unit);
    if (period) parts2.push(L9("table.periodPrefix") + period);
    return parts2.filter(Boolean).join(L9("table.separator"));
  }
  function syncBarsTable(chart, entries, parsed) {
    var parts2 = ensureDatasetWrap(chart);
    if (!parts2.btn || !parts2.table) return;
    var table = parts2.table;
    table.textContent = "";
    var caption = make("caption", null, tableCaptionBase(chart));
    table.appendChild(caption);
    buildTableHead(table, [L9("table.head.category", table), L9("table.head.value", table), L9("table.head.unit", table), L9("table.head.period", table)]);
    var tbody = make("tbody");
    var hero = chart.querySelector(".m-main-metric__hero");
    var mainNumber = hero && hero.querySelector(".m-main-metric__number");
    if (mainNumber) {
      var mainLabel = hero.querySelector(".m-main-metric__label");
      var mainUnit = hero.querySelector(".m-main-metric__unit");
      appendRow(tbody, [
        mainLabel && mainLabel.textContent || L9("table.mainMetricFallback", tbody),
        datasetReading(mainNumber.textContent),
        mainUnit && mainUnit.textContent || chart.getAttribute("data-common-unit") || "—",
        chart.getAttribute("data-common-period") || chart.getAttribute("data-period") || "—"
      ]);
    }
    entries.forEach(function(entry, index) {
      var value = parsed[index];
      var valueText;
      if (value.state === "missing") valueText = L9("table.missingValue");
      else if (value.state === "invalid") valueText = datasetReading(entry.raw, L9("table.invalidValue"), false);
      else if (value.state === "zero") valueText = datasetReading(entry.display || entry.raw || "0", L9("table.zeroValue"));
      else valueText = datasetReading(entry.display || entry.raw, value.state === "negative" ? L9("table.negativeValue") : "");
      appendRow(tbody, [entry.label, valueText, entry.unit || "—", entry.period || "—"]);
    });
    table.appendChild(tbody);
  }
  function syncCirclesTable(chart, items) {
    var parts2 = ensureDatasetWrap(chart);
    if (!parts2.btn || !parts2.table) return;
    var table = parts2.table;
    table.textContent = "";
    var caption = make("caption", null, tableCaptionBase(chart));
    table.appendChild(caption);
    buildTableHead(table, [L9("table.head.category", table), L9("table.head.value", table), L9("table.head.state", table), L9("table.head.unit", table), L9("table.head.period", table)]);
    var tbody = make("tbody");
    items.forEach(function(item) {
      var state2 = item.state === "unavailable" ? "missing" : item.state === "invalid" ? "invalid" : readNumber(item.raw).state;
      var valueText, stateText2;
      if (state2 === "missing") {
        valueText = "—";
        stateText2 = L9("value.missing");
      } else if (state2 === "invalid") {
        valueText = item.raw || L9("value.invalid");
        stateText2 = L9("value.invalid");
      } else {
        valueText = item.display || item.raw;
        stateText2 = state2 === "zero" ? L9("bars.stateZero") : state2 === "negative" ? L9("bars.stateNegative") : "";
      }
      appendRow(tbody, [
        item.label,
        state2 === "missing" ? valueText : datasetReading(valueText, "", state2 !== "invalid"),
        stateText2,
        item.unit || "—",
        item.period || "—"
      ]);
    });
    table.appendChild(tbody);
  }
  function fitHero(chart) {
    var hero = chart.querySelector(".m-main-metric__hero");
    if (!hero) return;
    chart.removeAttribute("data-hero-reading");
    if (chart.classList.contains("m-main-metric--flat")) return;
    var bounds = hero.getBoundingClientRect();
    var number = hero.querySelector(".m-main-metric__number");
    var lineHeight = number ? parseFloat(window.getComputedStyle(number).lineHeight) : 0;
    var wrapsNumber = number && lineHeight && number.getBoundingClientRect().height > lineHeight + 1;
    if (bounds.width && (bounds.height > bounds.width + 1 || wrapsNumber)) {
      chart.setAttribute("data-hero-reading", "");
    }
  }
  function barItems(chart) {
    clearDiagnostics(chart);
    var source = chart.querySelector("[data-bar-source]");
    var target = chart.querySelector("[data-bar-items]");
    var status2 = chart.querySelector("[data-bar-status]");
    if (!source || !target) return;
    var entries = Array.prototype.slice.call(source.querySelectorAll("[data-label]")).map(function(node2) {
      return {
        label: node2.getAttribute("data-label") || "",
        raw: node2.getAttribute("data-value"),
        display: node2.getAttribute("data-display-value"),
        unit: node2.getAttribute("data-unit") || "",
        period: node2.getAttribute("data-period") || "",
        series: seriesOf(node2)
      };
    });
    var parsed = entries.map(function(entry) {
      return readNumber(entry.raw);
    });
    var commonUnit = chart.getAttribute("data-common-unit") || "";
    var commonPeriod = chart.getAttribute("data-common-period") || "";
    var consistent = !!commonUnit && !!commonPeriod && entries.every(function(entry) {
      return entry.unit === commonUnit && entry.period === commonPeriod;
    });
    var magnitudeMax = parsed.reduce(function(max2, item) {
      return item.value !== null ? Math.max(max2, Math.abs(item.value)) : max2;
    }, 0);
    var hasKnown = parsed.some(function(item) {
      return item.value !== null;
    });
    var signed = parsed.some(function(item) {
      return item.state === "negative";
    });
    var declaredRaw = chart.getAttribute("data-max");
    var declared = declaredRaw === null ? null : readNumber(declaredRaw);
    var max = null;
    var userText = "";
    if (!entries.length) {
      userText = L9("chart.empty");
      writeDiagnostics(chart, "empty", L9("bars.emptyDetail", chart));
    } else if (!consistent) {
      userText = L9("bars.unitMismatchError");
      writeDiagnostics(
        chart,
        "inconsistent",
        L9("bars.unitMismatchDetail")
      );
    } else if (declaredRaw !== null && (!declared || declared.state !== "positive")) {
      userText = L9("bars.scaleError");
      writeDiagnostics(
        chart,
        "invalid-scale",
        "metric-bars: data-max='" + declaredRaw + L9("bars.scaleInvalidDetail")
      );
    } else if (declared && declared.value < magnitudeMax) {
      userText = L9("bars.unfairScaleError");
      writeDiagnostics(
        chart,
        "scale-below-known",
        "metric-bars: data-max=" + declared.value + L9("bars.underscaleDetailPrefix") + magnitudeMax + L9("bars.underscaleDetailSuffix")
      );
    } else if (declared) {
      max = declared.value;
      userText = L9("bars.scaledMessagePrefix", chart) + (chart.getAttribute("data-max-label") || declaredRaw) + " " + commonUnit + " · " + commonPeriod + ".";
      writeDiagnostics(
        chart,
        "ok",
        "metric-bars: scale=declared data-max=" + declared.value + L9("bars.scaledDetailUnit") + commonUnit + L9("bars.scaledDetailPeriod") + commonPeriod + "."
      );
    } else if (magnitudeMax > 0) {
      max = magnitudeMax;
      userText = L9("bars.scaledMessagePrefix") + magnitudeMax + " " + commonUnit + " · " + commonPeriod + ".";
      writeDiagnostics(
        chart,
        "ok",
        "metric-bars: scale=auto-largest-known=" + magnitudeMax + L9("bars.scaledDetailUnit") + commonUnit + L9("bars.scaledDetailPeriod") + commonPeriod + "."
      );
    } else if (hasKnown) {
      max = 0;
      userText = L9("bars.zeroMessage");
      writeDiagnostics(chart, "zero", L9("bars.zeroDetail", chart));
    } else {
      userText = L9("bars.emptyMessage");
      writeDiagnostics(chart, "empty", L9("bars.noValuesDetail", chart));
    }
    if (signed && max !== null) userText += L9("bars.zeroLineNote");
    target.textContent = "";
    entries.forEach(function(entry, index) {
      var value = parsed[index];
      var li = make("li", "m-main-metric__row");
      li.setAttribute("data-series", entry.series);
      var head = make("div", "m-main-metric__row-head");
      head.appendChild(make("span", "m-main-metric__row-label", entry.label));
      var display = value.state === "missing" ? "—" : value.state === "invalid" ? L9("value.invalid") : (entry.display || entry.raw) + (entry.unit && !entry.display ? " " + entry.unit : "");
      var val = make("span", "m-main-metric__row-value");
      if (chart.classList.contains("m-main-metric--readable")) {
        var number = make("bdi", "", value.state === "missing" ? L9("main.missing") : value.state === "invalid" ? entry.raw : entry.display || entry.raw);
        number.dir = value.value === null ? "auto" : "ltr";
        val.appendChild(number);
        if (value.state === "invalid") val.appendChild(make("span", "m-main-metric__reading-state", L9("main.invalidSuffix", val)));
        if (entry.unit) {
          val.appendChild(document.createTextNode(" "));
          var unit = make("span", "m-main-metric__reading-unit", entry.unit);
          unit.setAttribute("data-reading-unit", entry.unit);
          val.appendChild(unit);
        }
      } else {
        val.textContent = display;
        val.setAttribute("dir", "ltr");
      }
      head.appendChild(val);
      li.appendChild(head);
      var track = make("span", "m-main-metric__track");
      track.setAttribute("aria-hidden", "true");
      if (signed) track.setAttribute("data-signed", "true");
      var canDraw = max !== null && max > 0 && (value.state === "positive" || value.state === "negative");
      if (canDraw) {
        var bar = make("span", "m-main-metric__bar");
        bar.style.setProperty("--m-bar-width", Math.abs(value.value) / max * (signed ? 50 : 100) + "%");
        bar.setAttribute("data-direction", value.state);
        track.appendChild(bar);
      } else if (max !== null && value.state === "zero") {
        track.setAttribute("data-zero", "true");
      } else {
        track.hidden = true;
        if (value.state === "missing") {
          li.appendChild(make("span", "m-main-metric__state", L9("value.missing", li)));
        } else if (value.state === "invalid") {
          li.appendChild(make("span", "m-main-metric__state", L9("value.unreadable", li)));
        }
      }
      li.appendChild(track);
      target.appendChild(li);
    });
    if (status2) {
      status2.textContent = userText;
      status2.setAttribute("data-valid", String(max !== null));
    }
    syncBarsTable(chart, entries, parsed);
    if (globalApi("Readings")) globalApi("Readings").sync(chart);
  }
  function initOne2(root) {
    disconnected2.delete(root);
    if (root.hasAttribute("data-metric-circles") && !(root.__microMetricResizeObserver || root.__microMetricResizeListener)) {
      root.setAttribute("data-metric-ready", "");
      circleItems(root);
      observeResponsive(root);
    }
    if (root.hasAttribute("data-main-comparison") && !(root.__microMetricResizeObserver || root.__microMetricResizeListener)) {
      root.setAttribute("data-bars-ready", "");
      barItems(root);
      fitHero(root);
      observeResponsive(root);
    }
  }
  var disconnected2 = /* @__PURE__ */ new WeakSet();
  function observeResponsive(root) {
    disconnected2.delete(root);
    var target = root.querySelector("[data-metric-items]") || (root.hasAttribute("data-main-comparison") ? root : null);
    if (!target || root.__microMetricResizeObserver || root.__microMetricResizeListener) return;
    root.__microMetricWidth = target.getBoundingClientRect().width;
    if (window.ResizeObserver) {
      var observer = new ResizeObserver(function(entries) {
        if (disconnected2.has(root) || root.__microMetricResizeObserver !== observer) return;
        var nextWidth = entries[0] && entries[0].contentRect.width;
        if (typeof nextWidth === "number" && Math.abs(nextWidth - root.__microMetricWidth) > 1) {
          if (root.__microMetricResizeFrame) return;
          root.__microMetricResizeFrame = window.requestAnimationFrame(function() {
            delete root.__microMetricResizeFrame;
            if (!root.isConnected || disconnected2.has(root) || root.__microMetricResizeObserver !== observer) return;
            var width = target.getBoundingClientRect().width;
            if (width <= 1 || Math.abs(width - root.__microMetricWidth) <= 1) return;
            root.__microMetricWidth = width;
            if (root.hasAttribute("data-metric-circles")) circleItems(root);
            else fitHero(root);
          });
        }
      });
      root.__microMetricResizeObserver = observer;
      observer.observe(target);
    } else {
      root.__microMetricResizeListener = function() {
        if (disconnected2.has(root)) return;
        var nextWidth = target.getBoundingClientRect().width;
        if (Math.abs(nextWidth - root.__microMetricWidth) > 1) {
          root.__microMetricWidth = nextWidth;
          if (root.hasAttribute("data-metric-circles")) circleItems(root);
          else fitHero(root);
        }
      };
      window.addEventListener("resize", root.__microMetricResizeListener);
    }
  }
  function render3(root) {
    installFontsHook();
    var scope = root || document;
    if (scope.matches) disconnected2.delete(scope);
    if (scope.matches && scope.matches("[data-metric-circles]")) {
      circleItems(scope);
      observeResponsive(scope);
    }
    if (scope.matches && scope.matches("[data-main-comparison]")) {
      barItems(scope);
      fitHero(scope);
      observeResponsive(scope);
    }
    scope.querySelectorAll("[data-metric-circles]").forEach(function(chart) {
      circleItems(chart);
      observeResponsive(chart);
    });
    scope.querySelectorAll("[data-main-comparison]").forEach(function(chart) {
      barItems(chart);
      fitHero(chart);
      observeResponsive(chart);
    });
  }
  var instances6 = instanceRegistry();
  function init13(root, options) {
    var scope = root || document;
    applyInstanceLabels13(scope, options);
    var existing = instances6.get(scope);
    if (existing) {
      withLabels14(scope, function() {
        installFontsHook();
        if (scope.matches && (scope.matches("[data-metric-circles]") || scope.matches("[data-main-comparison]"))) initOne2(scope);
        scope.querySelectorAll("[data-metric-circles], [data-main-comparison]").forEach(initOne2);
      });
      return existing;
    }
    installFontsHook();
    var destroyed = false;
    var instance = {
      root: scope,
      /** = render: إعادة التصيير من DOM المصدر تحت الجذر. */
      update: function() {
        withLabels14(scope, function() {
          render3(scope);
        });
      },
      /** يفك مستمعات الكشف والرصد — لا يمس قيم المصدر. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown13(scope);
        instances6.remove(scope);
      }
    };
    withLabels14(scope, function() {
      installFontsHook();
      if (scope.matches && (scope.matches("[data-metric-circles]") || scope.matches("[data-main-comparison]"))) initOne2(scope);
      scope.querySelectorAll("[data-metric-circles], [data-main-comparison]").forEach(initOne2);
    });
    instances6.set(scope, instance);
    return instance;
  }
  function getInstance13(root) {
    return instances6.get(root);
  }
  function destroy13(root) {
    var instance = instances6.get(root);
    if (instance) instance.destroy();
    else teardown13(root || document);
  }
  function disconnect13(root) {
    destroy13(root);
  }
  function teardown13(root) {
    var scope = root || document;
    var selector = "[data-metric-circles], [data-main-comparison]";
    var items = [].slice.call(scope.querySelectorAll(selector));
    if (scope.matches && scope.matches(selector)) items.unshift(scope);
    [].slice.call(scope.querySelectorAll(".m-main-metric__disclose")).forEach(function(btn) {
      var binding = btn.__microDatasetDisclosure;
      if (binding) {
        btn.removeEventListener("click", binding.handler);
        delete btn.__microDatasetDisclosure;
      }
    });
    if (scope.matches && scope.matches(".m-main-metric__disclose") && scope.__microDatasetDisclosure) {
      scope.removeEventListener("click", scope.__microDatasetDisclosure.handler);
      delete scope.__microDatasetDisclosure;
    }
    items.forEach(function(chart) {
      disconnected2.add(chart);
      if (chart.__microMetricResizeObserver) chart.__microMetricResizeObserver.disconnect();
      if (chart.__microMetricResizeFrame) window.cancelAnimationFrame(chart.__microMetricResizeFrame);
      delete chart.__microMetricResizeFrame;
      if (chart.__microMetricResizeListener) window.removeEventListener("resize", chart.__microMetricResizeListener);
      delete chart.__microMetricResizeObserver;
      delete chart.__microMetricResizeListener;
      delete chart.__microMetricWidth;
      chart.removeAttribute("data-metric-ready");
      chart.removeAttribute("data-bars-ready");
    });
  }
  function setLabels13(partial) {
    setLabels("metric-comparison", partial);
  }
  var fontsHookInstalled = false;
  function installFontsHook() {
    if (fontsHookInstalled) return;
    fontsHookInstalled = true;
    if (document.fonts) document.fonts.ready.then(function() {
      document.querySelectorAll("[data-metric-circles], [data-main-comparison]").forEach(function(chart) {
        if (!disconnected2.has(chart)) render3(chart);
      });
    });
  }

  // components/account-settings/account-settings.js
  var account_settings_exports = {};
  __export(account_settings_exports, {
    destroy: () => destroy14,
    disconnect: () => disconnect14,
    getInstance: () => getInstance14,
    init: () => init14,
    setLabels: () => setLabels14
  });

  // components/account-settings/labels.js
  var defaults9 = {
    "demo.changeNotice": "تغيّر هذا المثال داخل الصفحة فقط؛ لم يُحفظ الإعداد."
  };

  // components/account-settings/account-settings.js
  registerLabels("account-settings", defaults9);
  var MICRO_LABELS_FAMILY13 = "account-settings";
  function L10(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY13) || currentInstanceLabels(MICRO_LABELS_FAMILY13);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY13, key2);
  }
  function withLabels15(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY13, fn);
  }
  function applyInstanceLabels14(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY13, options.labels);
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
    function on5(element, type8, handler) {
      element.addEventListener(type8, handler, { signal: controller.signal });
    }
    var backdropId = layer.getAttribute("data-backdrop-id");
    var backdrop2 = backdropId ? document.getElementById(backdropId) : document.querySelector('.m-layer-backdrop[data-for="' + layer.id + '"]');
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
      on5(trigger, "click", function() {
        if (!globalApi("Navigation")) return;
        showView(initialView, false);
        globalApi("Navigation").openLayer(layer, { trigger, backdropEl: backdrop2 });
      });
    });
    if (appEntry) on5(appEntry, "click", function() {
      showView("application", true);
    });
    panel.querySelectorAll("[data-account-to-account]").forEach(function(entry) {
      on5(entry, "click", function() {
        showView("account", true);
      });
    });
    if (back) on5(back, "click", function() {
      showView(initialView, true);
    });
    panel.querySelectorAll("[data-account-close]").forEach(function(button) {
      on5(button, "click", function() {
        if (globalApi("Navigation")) globalApi("Navigation").closeLayer(layer);
      });
    });
    on5(panel, "change", function(event) {
      var input = event.target;
      if (!input.matches || !input.matches("[data-account-setting]")) return;
      var name = input.getAttribute("data-account-setting") || "";
      panel.dispatchEvent(new CustomEvent("micro-account-settings:change", {
        bubbles: true,
        detail: { setting: name, checked: input.checked }
      }));
      var status2 = panel.querySelector("[data-account-demo-status]");
      if (status2) status2.textContent = input.getAttribute("data-demo-only") !== null ? L10("demo.changeNotice", panel) : "";
    });
    showView(initialView, false);
  }
  var registry9 = instanceRegistry();
  function init14(root, options) {
    var scope = root || document;
    applyInstanceLabels14(scope, options);
    var existing = registry9.get(scope);
    if (existing) {
      withLabels15(scope, function() {
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
        withLabels15(scope, function() {
          if (scope.matches && scope.matches("[data-account-settings]")) initPanel(scope);
          scope.querySelectorAll("[data-account-settings]").forEach(initPanel);
        });
      },
      /** يفك مستمعات كل لوحة ويمكّن الربط من جديد — لا يغير حالة العرض. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown14(scope);
        registry9.remove(scope);
      }
    };
    withLabels15(scope, function() {
      if (scope.matches && scope.matches("[data-account-settings]")) initPanel(scope);
      scope.querySelectorAll("[data-account-settings]").forEach(initPanel);
    });
    registry9.set(scope, instance);
    return instance;
  }
  function getInstance14(root) {
    return registry9.get(root);
  }
  function destroy14(root) {
    var instance = registry9.get(root);
    if (instance) instance.destroy();
    else teardown14(root || document);
  }
  function disconnect14(root) {
    destroy14(root);
  }
  function teardown14(root) {
    var scope = root || document;
    var panels = [].slice.call(scope.querySelectorAll("[data-account-settings]"));
    if (scope.matches && scope.matches("[data-account-settings]")) panels.unshift(scope);
    panels.forEach(function(panel) {
      if (panel.__microAccountLifetime) panel.__microAccountLifetime.abort();
      delete panel.__microAccountLifetime;
      panel.removeAttribute("data-account-settings-ready");
    });
  }
  function setLabels14(partial) {
    setLabels("account-settings", partial);
  }

  // components/access-gateway/access-gateway.js
  var access_gateway_exports = {};
  __export(access_gateway_exports, {
    destroy: () => destroy15,
    disconnect: () => disconnect15,
    getInstance: () => getInstance15,
    init: () => init15,
    setLabels: () => setLabels15,
    update: () => init15
  });

  // components/access-gateway/labels.js
  var defaults10 = {
    "passwordReveal.label": "إظهار كلمة المرور",
    "recovery.uncertain": "انتهى طلب المساعدة دون تأكيد إرساله.",
    "recovery.error": "تعذّر إرسال طلب المساعدة. أعد المحاولة.",
    "provider.connectingLabel": "جارٍ الاتصال",
    "provider.connectingMessage": "جارٍ الاتصال بمزود الدخول…",
    "provider.success": "تم الدخول بنجاح.",
    "provider.failure": "لم يتم الدخول.",
    "provider.uncertain": "انتهى الطلب دون نتيجة مؤكدة من التطبيق.",
    "provider.error": "تعذّر تنفيذ الدخول. أعد المحاولة.",
    "form.incomplete": "نموذج الدخول غير مكتمل. تواصل مع المسؤول إن تكرر ذلك.",
    "validation.email": "أدخل بريدًا إلكترونيًا صالحًا.",
    "validation.password": "أدخل كلمة المرور.",
    "validation.passwordMinLengthPrefix": "أدخل كلمة مرور لا تقل عن ",
    "validation.passwordMinLengthSuffix": " أحرف.",
    "validation.passwordRequired": "تحقق من كلمة المرور المطلوبة.",
    "validation.emailAndPasswordRequired": "تحقق من البريد الإلكتروني وكلمة المرور المطلوبة.",
    "demo.notice": "هذه نسخة عرض تجريبية: لن تُرسل بياناتك إلى أي خدمة.",
    "submit.loadingLabel": "جارٍ تسجيل الدخول",
    "submit.pendingMessage": "جارٍ التحقق من بيانات الدخول…",
    "submit.error": "تعذّر تسجيل الدخول. تحقق من بياناتك ثم أعد المحاولة."
  };

  // components/access-gateway/access-gateway.js
  registerLabels("access-gateway", defaults10);
  var MICRO_LABELS_FAMILY14 = "access-gateway";
  function L11(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY14) || currentInstanceLabels(MICRO_LABELS_FAMILY14);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY14, key2);
  }
  function withLabels16(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY14, fn);
  }
  function applyInstanceLabels15(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY14, options.labels);
    }
  }
  function userError(error, fallback) {
    return error && typeof error.userMessage === "string" && error.userMessage.trim() ? error.userMessage : fallback;
  }
  function setMessage(form, message, tone) {
    var status2 = form.querySelector("[data-access-status]");
    if (!status2) return;
    status2.textContent = message || "";
    if (tone) status2.setAttribute("data-tone", tone);
    else status2.removeAttribute("data-tone");
  }
  function setFieldError(input, message) {
    var field = input.closest("[data-micro-field]");
    if (!field) return;
    var note2 = field.querySelector("[data-field-msg]");
    field.classList.toggle("has-error", !!message);
    if (note2) {
      note2.textContent = message || "";
      note2.classList.toggle("is-visible", !!message);
    }
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }
  function credential(form, role) {
    return form.querySelector('[data-access-credential="' + role + '"]') || form.querySelector('input[name="' + role + '"]');
  }
  function resultOutcome(result, confirmedText, deniedText, neutralText) {
    var hasMessage = !!(result && typeof result.message === "string" && result.message.trim() !== "");
    var tone = "info";
    if (result && (result.tone === "info" || result.tone === "error")) tone = result.tone;
    else if (result && result.authenticated === false) tone = "error";
    if (hasMessage) return { text: result.message, tone };
    if (result && result.authenticated === true && confirmedText) return { text: confirmedText, tone };
    if (result && result.authenticated === false && deniedText) return { text: deniedText, tone };
    return { text: neutralText, tone: "info" };
  }
  function initGateway(gateway, callbacks) {
    if (gateway.hasAttribute("data-access-ready") && gateway.__microAccessLifetime && !gateway.__microAccessLifetime.controller.signal.aborted) {
      gateway.__microAccessCallbacks = callbacks || gateway.__microAccessCallbacks || {};
      return;
    }
    var form = gateway.querySelector("form[data-access-form]");
    if (!form) return;
    gateway.setAttribute("data-access-ready", "");
    gateway.__microAccessCallbacks = callbacks || {};
    var lifetime = { controller: new AbortController(), observer: null };
    gateway.__microAccessLifetime = lifetime;
    function alive() {
      return gateway.isConnected && gateway.__microAccessLifetime === lifetime && !lifetime.controller.signal.aborted;
    }
    function on5(element, type8, handler) {
      element.addEventListener(type8, handler, { signal: lifetime.controller.signal });
    }
    var reveal = gateway.querySelector("[data-access-reveal]");
    if (reveal) {
      var targetId = reveal.getAttribute("aria-controls");
      var password = targetId ? document.getElementById(targetId) : credential(form, "password");
      if (password) {
        let syncRevealDisabled = function() {
          reveal.disabled = consumerDisabled || password.disabled;
          if (password.disabled && password.type !== "password") {
            password.type = "password";
            reveal.setAttribute("aria-pressed", "false");
          }
        };
        var consumerDisabled = reveal.disabled;
        lifetime.restoreReveal = function() {
          reveal.disabled = consumerDisabled;
        };
        var pointerSelection = null;
        on5(reveal, "pointerdown", function() {
          try {
            pointerSelection = {
              start: password.selectionStart,
              end: password.selectionEnd,
              direction: password.selectionDirection
            };
          } catch (error) {
            pointerSelection = null;
          }
        });
        on5(reveal, "click", function(event) {
          if (reveal.disabled || password.disabled || reveal.getAttribute("aria-disabled") === "true") return;
          var selection = event.detail > 0 ? pointerSelection : null;
          pointerSelection = null;
          if (!selection) {
            try {
              selection = {
                start: password.selectionStart,
                end: password.selectionEnd,
                direction: password.selectionDirection
              };
            } catch (error) {
              selection = null;
            }
          }
          var showing = password.type === "password";
          password.type = showing ? "text" : "password";
          reveal.setAttribute("aria-pressed", showing ? "true" : "false");
          reveal.setAttribute("aria-label", L11("passwordReveal.label", reveal));
          if (selection && typeof password.setSelectionRange === "function") {
            var start = Math.min(selection.start, password.value.length);
            var end = Math.min(selection.end, password.value.length);
            password.setSelectionRange(start, end, selection.direction || "none");
          }
          if (event.detail > 0) {
            password.focus({ preventScroll: true });
            if (selection && typeof password.setSelectionRange === "function") {
              password.setSelectionRange(
                Math.min(selection.start, password.value.length),
                Math.min(selection.end, password.value.length),
                selection.direction || "none"
              );
            }
          }
        });
        syncRevealDisabled();
        lifetime.observer = new MutationObserver(syncRevealDisabled);
        lifetime.observer.observe(password, {
          attributes: true,
          attributeFilter: ["disabled"]
        });
      }
    }
    var recovery = gateway.querySelector("[data-access-recovery]");
    var providers = Array.prototype.slice.call(gateway.querySelectorAll("[data-access-provider]"));
    syncOptional(gateway);
    if (recovery) on5(recovery, "click", function() {
      var current = gateway.__microAccessCallbacks || {};
      if (typeof current.onRecovery !== "function") return;
      Promise.resolve().then(function() {
        if (alive()) return current.onRecovery();
      }).then(function(result) {
        if (!alive()) return;
        var hasMessage = !!(result && typeof result.message === "string" && result.message.trim() !== "");
        var tone = "info";
        if (result && (result.tone === "info" || result.tone === "error")) tone = result.tone;
        else if (hasMessage && result && result.authenticated === false) tone = "error";
        setMessage(form, hasMessage ? result.message : L11("recovery.uncertain", form), tone);
      }).catch(function(error) {
        if (alive()) setMessage(form, userError(error, L11("recovery.error", form)), "error");
      });
    });
    providers.forEach(function(button) {
      on5(button, "click", function() {
        var key2 = button.getAttribute("data-access-provider");
        var current = gateway.__microAccessCallbacks || {};
        var handler = current.providers && current.providers[key2];
        if (typeof handler !== "function" || form.dataset.microAccessBusy === "true" || button.disabled || button.getAttribute("aria-disabled") === "true") return;
        form.dataset.microAccessBusy = "true";
        form.setAttribute("aria-busy", "true");
        if (globalApi("Buttons")) globalApi("Buttons").setLoading(button, true, { loadingLabel: L11("provider.connectingLabel", button) });
        setMessage(form, L11("provider.connectingMessage", form), "info");
        Promise.resolve().then(function() {
          if (alive()) return handler();
        }).then(function(result) {
          if (!alive()) return;
          var outcome = resultOutcome(result, L11("provider.success"), L11("provider.failure"), L11("provider.uncertain"));
          setMessage(form, outcome.text, outcome.tone);
        }).catch(function(error) {
          if (alive()) setMessage(form, userError(error, L11("provider.error", form)), "error");
        }).then(function() {
          if (!alive()) return;
          form.dataset.microAccessBusy = "false";
          form.removeAttribute("aria-busy");
          if (globalApi("Buttons")) globalApi("Buttons").setLoading(button, false);
        });
      });
    });
    on5(form, "input", function() {
      var controls = Array.prototype.slice.call(form.querySelectorAll("input[required]"));
      controls.forEach(function(input) {
        if (input.validity.valid) {
          setFieldError(input, "");
        }
      });
      setMessage(form, "");
    });
    on5(form, "submit", function(event) {
      event.preventDefault();
      if (form.dataset.microAccessBusy === "true") return;
      var email = credential(form, "email");
      var passwordInput = credential(form, "password");
      if (!email || !passwordInput) {
        setMessage(form, L11("form.incomplete", form), "error");
        return;
      }
      var controls = [email, passwordInput].filter(Boolean);
      var invalid = controls.filter(function(input) {
        return !input.checkValidity();
      });
      if (invalid.length) {
        invalid.forEach(function(input) {
          var isEmail = input.getAttribute("data-access-credential") === "email" || input.name === "email" || input.type === "email";
          setFieldError(input, isEmail ? L11("validation.email", input) : input.validity.valueMissing ? L11("validation.password", input) : input.validity.tooShort && input.minLength > 0 ? L11("validation.passwordMinLengthPrefix", input) + input.minLength + L11("validation.passwordMinLengthSuffix", input) : L11("validation.passwordRequired", input));
        });
        setMessage(form, L11("validation.emailAndPasswordRequired", form), "error");
        invalid[0].focus();
        return;
      }
      var current = gateway.__microAccessCallbacks || {};
      if (typeof current.onSubmit !== "function") {
        setMessage(form, L11("demo.notice", form), "info");
        return;
      }
      form.dataset.microAccessBusy = "true";
      form.setAttribute("aria-busy", "true");
      var submit = form.querySelector('[type="submit"]');
      if (submit && globalApi("Buttons")) globalApi("Buttons").setLoading(submit, true, { loadingLabel: L11("submit.loadingLabel") });
      setMessage(form, L11("submit.pendingMessage", form), "info");
      Promise.resolve().then(function() {
        if (!alive()) return;
        return current.onSubmit({
          email: email ? email.value : "",
          password: passwordInput ? passwordInput.value : ""
        });
      }).then(function(result) {
        if (!alive()) return;
        var outcome = resultOutcome(result, L11("provider.success"), L11("provider.failure"), L11("provider.uncertain"));
        setMessage(form, outcome.text, outcome.tone);
        form.dispatchEvent(new CustomEvent("micro-access:submitted", { bubbles: true, detail: { result } }));
      }).catch(function(error) {
        if (alive()) setMessage(form, userError(error, L11("submit.error", form)), "error");
      }).then(function() {
        if (!alive()) return;
        form.dataset.microAccessBusy = "false";
        form.removeAttribute("aria-busy");
        if (submit && globalApi("Buttons")) globalApi("Buttons").setLoading(submit, false);
      });
    });
  }
  function syncOptional(gateway) {
    var callbacks = gateway.__microAccessCallbacks || {};
    var recovery = gateway.querySelector("[data-access-recovery]");
    if (recovery) recovery.hidden = typeof callbacks.onRecovery !== "function";
    gateway.querySelectorAll("[data-access-provider]").forEach(function(button) {
      var key2 = button.getAttribute("data-access-provider");
      button.hidden = !(callbacks.providers && typeof callbacks.providers[key2] === "function");
    });
    var providerGroup = gateway.querySelector("[data-access-providers]");
    if (providerGroup) {
      providerGroup.hidden = !Array.prototype.some.call(
        gateway.querySelectorAll("[data-access-provider]"),
        function(button) {
          return !button.hidden;
        }
      );
    }
  }
  function applyHandlers(scope, handlers) {
    applyInstanceLabels15(scope, handlers);
    var gateways = [];
    if (scope.matches && scope.matches("[data-access-gateway]")) gateways.push(scope);
    gateways = gateways.concat(Array.prototype.slice.call(scope.querySelectorAll("[data-access-gateway]")));
    gateways.forEach(function(gateway) {
      initGateway(gateway, handlers || gateway.__microAccessCallbacks || {});
      syncOptional(gateway);
    });
  }
  var registry10 = instanceRegistry();
  function init15(root, handlers) {
    var scope = root || document;
    applyInstanceLabels15(scope, handlers);
    applyInstanceLabels15(scope, handlers);
    applyInstanceLabels15(scope, handlers);
    applyInstanceLabels15(scope, handlers);
    var existing = registry10.get(scope);
    if (existing) {
      existing.update(handlers);
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** تحديث callbacks وتوافر الإجراءات دون ربط مضاعف. */
      update: function(nextHandlers) {
        withLabels16(scope, function() {
          applyHandlers(scope, nextHandlers);
        });
      },
      /** يفك المستمعات والمراقبة ويرجع الحالة الظاهرة — لا يمس قيم المستخدم. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown15(scope);
        registry10.remove(scope);
      }
    };
    applyHandlers(scope, handlers);
    registry10.set(scope, instance);
    return instance;
  }
  function getInstance15(root) {
    return registry10.get(root);
  }
  function destroy15(root) {
    var instance = registry10.get(root);
    if (instance) instance.destroy();
    else teardown15(root || document);
  }
  function disconnect15(root) {
    destroy15(root);
  }
  function teardown15(root) {
    var scope = root || document;
    var gateways = [].slice.call(scope.querySelectorAll("[data-access-gateway]"));
    if (scope.matches && scope.matches("[data-access-gateway]")) gateways.unshift(scope);
    gateways.forEach(function(gateway) {
      var lifetime = gateway.__microAccessLifetime;
      if (lifetime) {
        lifetime.controller.abort();
        if (lifetime.observer) lifetime.observer.disconnect();
        if (lifetime.restoreReveal) lifetime.restoreReveal();
      }
      delete gateway.__microAccessLifetime;
      gateway.removeAttribute("data-access-ready");
      var form = gateway.querySelector("[data-access-form]");
      if (form) {
        form.dataset.microAccessBusy = "false";
        form.removeAttribute("aria-busy");
        var submit = form.querySelector('[type="submit"]');
        if (submit && globalApi("Buttons")) globalApi("Buttons").setLoading(submit, false);
        gateway.querySelectorAll("[data-access-provider]").forEach(function(button) {
          if (globalApi("Buttons")) globalApi("Buttons").setLoading(button, false);
        });
        var password = credential(form, "password");
        if (password) password.type = "password";
      }
      var reveal = gateway.querySelector("[data-access-reveal]");
      if (reveal) reveal.setAttribute("aria-pressed", "false");
    });
  }
  function setLabels15(partial) {
    setLabels("access-gateway", partial);
  }

  // components/carousel/carousel.js
  var carousel_exports = {};
  __export(carousel_exports, {
    destroy: () => destroy16,
    disconnect: () => disconnect16,
    getIndex: () => getIndex2,
    getInstance: () => getInstance16,
    goTo: () => goToIndex2,
    init: () => init16,
    next: () => next2,
    prev: () => prev2,
    setLabels: () => setLabels16,
    update: () => updateApi2
  });

  // components/carousel/labels.js
  var defaults11 = {
    "empty": "لا توجد بطاقات.",
    "slide.cardRole": "بطاقة",
    "slide.labelPrefix": "بطاقة ",
    "slide.positionPrefix": "، البطاقة ",
    "position.of": " من ",
    "status.positionPrefix": "البطاقة ",
    "dots.goToPrefix": "الانتقال إلى البطاقة ",
    "region.role": "عارض بطاقات"
  };

  // components/carousel/carousel.js
  registerLabels("carousel", defaults11);
  var MICRO_LABELS_FAMILY15 = "carousel";
  function L12(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY15) || currentInstanceLabels(MICRO_LABELS_FAMILY15);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY15, key2);
  }
  function withLabels17(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY15, fn);
  }
  function applyInstanceLabels16(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY15, options.labels);
    }
  }
  var reduceMotionQuery = null;
  function prefersReducedMotion2() {
    if (!reduceMotionQuery && typeof window !== "undefined" && window.matchMedia) {
      reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    }
    return !!(reduceMotionQuery && reduceMotionQuery.matches);
  }
  var stateOf3 = /* @__PURE__ */ new WeakMap();
  var viewportObservers2 = /* @__PURE__ */ new WeakMap();
  var RESIZE_EPS3 = 0.5;
  function measureActiveHeight(st) {
    if (st.disconnected || !st.count || st.viewport.clientWidth <= 1) return;
    var slide = st.slides[st.index];
    var style = getComputedStyle(st.track);
    var height = Math.ceil(slide.getBoundingClientRect().height + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
    if (height > 0 && st.viewport.style.height !== height + "px") st.viewport.style.height = height + "px";
    var observer = viewportObservers2.get(st.root);
    if (observer && st.heightSlide !== slide) {
      if (st.heightSlide) observer.unobserve(st.heightSlide);
      observer.observe(slide);
      st.heightSlide = slide;
    }
  }
  function recenterCarousel(carousel, st) {
    if (st.disconnected) return;
    if (st.raf) return;
    st.raf = requestAnimationFrame(function() {
      st.raf = null;
      if (st.disconnected || st.count <= 0) return;
      measureActiveHeight(st);
      var w = st.viewport.clientWidth;
      if (w <= 1) return;
      var direction = getComputedStyle(carousel).direction;
      if (st.lastWidth !== void 0 && Math.abs(w - st.lastWidth) < RESIZE_EPS3 && direction === st.lastDirection) return;
      st.lastWidth = w;
      st.lastDirection = direction;
      goToIndex2(carousel, st.index, { animate: false });
    });
  }
  function observeViewport2(carousel, st) {
    st.disconnected = false;
    if (typeof ResizeObserver !== "function") return;
    if (viewportObservers2.has(carousel)) return;
    var ro = new ResizeObserver(function(entries) {
      if (st.disconnected || viewportObservers2.get(carousel) !== ro || st.viewport.clientWidth <= 1) return;
      recenterCarousel(carousel, st);
    });
    ro.observe(st.viewport);
    viewportObservers2.set(carousel, ro);
    measureActiveHeight(st);
  }
  function parts(carousel) {
    return {
      root: carousel,
      viewport: carousel.querySelector("[data-viewport]"),
      track: carousel.querySelector("[data-track]"),
      slides: [].slice.call(carousel.querySelectorAll("[data-carousel-slide]")),
      prev: carousel.querySelector("[data-prev]"),
      next: carousel.querySelector("[data-next]"),
      status: carousel.querySelector("[data-status]"),
      dots: carousel.querySelector("[data-dots]")
    };
  }
  function onLocal(carousel, element, type8, handler) {
    var st = stateOf3.get(carousel);
    if (!st.controller) st.controller = new AbortController();
    element.addEventListener(type8, handler, { signal: st.controller.signal });
  }
  function directionOf(carousel) {
    return getComputedStyle(carousel).direction === "rtl" ? "rtl" : "ltr";
  }
  function scrollToSlide2(st, i, animate) {
    var slide = st.slides[i];
    if (!slide) return;
    st.programmatic = true;
    if (st.scrollTimer) window.clearTimeout(st.scrollTimer);
    st.scrollTimer = window.setTimeout(
      function() {
        st.programmatic = false;
      },
      animate && !prefersReducedMotion2() ? 480 : 80
    );
    slide.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: animate && !prefersReducedMotion2() ? "smooth" : "auto"
    });
  }
  function nearestSlide2(st) {
    var box = st.viewport.getBoundingClientRect();
    var center = box.left + box.width / 2;
    var best = 0, bestDist = Infinity;
    st.slides.forEach(function(slide, i) {
      var rect = slide.getBoundingClientRect();
      var dist = Math.abs(rect.left + rect.width / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  }
  function goToIndex2(carousel, i, opts) {
    var st = stateOf3.get(carousel);
    if (!st || st.disconnected || st.count === 0) return;
    var animate = !(opts && opts.animate === false);
    var clamped = Math.max(0, Math.min(st.count - 1, i));
    scrollToSlide2(st, clamped, animate);
    if (clamped !== st.index) {
      collapseSlide(st, st.slides[st.index]);
      st.index = clamped;
      update5(carousel, st);
      carousel.dispatchEvent(new CustomEvent("micro-carousel:change", {
        bubbles: true,
        detail: { index: st.index, count: st.count }
      }));
    } else {
      update5(carousel, st);
    }
  }
  function update5(carousel, st) {
    measureActiveHeight(st);
    var rtl = directionOf(carousel) === "rtl";
    carousel.setAttribute("data-carousel-count", String(st.count));
    var controls = carousel.querySelector(".m-carousel__controls");
    if (controls) controls.hidden = st.count < 2;
    st.viewport.hidden = st.count === 0;
    var empty = carousel.querySelector("[data-carousel-empty]");
    if (st.count === 0 && !empty) {
      empty = document.createElement("p");
      empty.setAttribute("data-carousel-empty", "");
      empty.setAttribute("role", "status");
      empty.textContent = L12("empty", empty);
      carousel.appendChild(empty);
    }
    if (empty) empty.hidden = st.count !== 0;
    st.slides.forEach(function(slide, i) {
      var isCurrent = i === st.index;
      slide.setAttribute("data-current", isCurrent ? "true" : "false");
      slide.setAttribute("aria-roledescription", L12("slide.cardRole", slide));
      var name = slide.getAttribute("data-card-label") || L12("slide.labelPrefix", slide) + (i + 1);
      slide.setAttribute("aria-label", name + L12("slide.positionPrefix", slide) + (i + 1) + L12("position.of", slide) + st.count);
      slide.removeAttribute("aria-hidden");
      slide.inert = !isCurrent;
    });
    var focusedSlide = document.activeElement.closest("[data-carousel-slide]");
    if (focusedSlide && st.slides.indexOf(focusedSlide) >= 0 && focusedSlide.inert) {
      carousel.focus({ preventScroll: true });
    }
    var atStart = st.index === 0;
    var atEnd = st.index === st.count - 1;
    if (st.prev) st.prev.disabled = atStart || st.count <= 1;
    if (st.next) st.next.disabled = atEnd || st.count <= 1;
    if (st.status) {
      st.status.textContent = st.count === 0 ? L12("empty") : L12("status.positionPrefix") + (st.index + 1) + L12("position.of") + st.count;
    }
    if (st.dots) {
      if (st.count > 1 && !st.dotsBuilt) buildDots(carousel, st);
      if (st.count > 1) {
        st.dots.hidden = false;
        [].slice.call(st.dots.children).forEach(function(btn, i) {
          if (i === st.index) btn.setAttribute("aria-current", "true");
          else btn.removeAttribute("aria-current");
        });
      } else {
        st.dots.hidden = true;
      }
    }
    carousel.setAttribute("data-dir", rtl ? "rtl" : "ltr");
  }
  function buildDots(carousel, st) {
    st.dots.textContent = "";
    for (var i = 0; i < st.count; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "m-carousel__dot";
      b.setAttribute("aria-label", L12("dots.goToPrefix", b) + (i + 1) + L12("position.of", b) + st.count);
      (function(idx) {
        onLocal(carousel, b, "click", function() {
          goToIndex2(carousel, idx);
        });
      })(i);
      st.dots.appendChild(b);
    }
    st.dotsBuilt = true;
  }
  function wireScroll2(carousel, st) {
    onLocal(carousel, st.viewport, "scroll", function() {
      if (st.disconnected || st.programmatic || st.scrollRaf) return;
      st.scrollRaf = requestAnimationFrame(function() {
        st.scrollRaf = 0;
        if (st.disconnected || st.programmatic || st.count === 0) return;
        var i = nearestSlide2(st);
        if (i !== st.index) {
          collapseSlide(st, st.slides[st.index]);
          st.index = i;
          update5(carousel, st);
          carousel.dispatchEvent(new CustomEvent("micro-carousel:change", {
            bubbles: true,
            detail: { index: st.index, count: st.count }
          }));
        }
      });
    }, null, { passive: true });
    onLocal(carousel, st.viewport, "dragstart", function(e) {
      if (!st.disconnected) e.preventDefault();
    });
  }
  function expandRegionOf(slide, btn) {
    var id = btn ? btn.getAttribute("aria-controls") : null;
    if (id) {
      var byId = document.getElementById(id);
      if (byId && slide.contains(byId)) return byId;
    }
    return slide.querySelector("[data-card-details]");
  }
  function setToggleLabel(btn, open2) {
    if (!btn) return;
    var t = btn.querySelector("[data-card-expand-text]") || btn;
    var v = open2 ? btn.getAttribute("data-label-open") : btn.getAttribute("data-label-closed");
    if (v) t.textContent = v;
  }
  function collapseSlide(st, slide) {
    if (!slide || !slide.hasAttribute("data-expanded")) return;
    slide.removeAttribute("data-expanded");
    var btn = slide.querySelector("[data-card-expand]");
    if (btn) btn.setAttribute("aria-expanded", "false");
    setToggleLabel(btn, false);
    var region = expandRegionOf(slide, btn);
    if (region) region.hidden = true;
  }
  function toggleExpand(st, slide) {
    var btn = slide ? slide.querySelector("[data-card-expand]") : null;
    if (!btn) return;
    var open2 = slide.getAttribute("data-expanded") === "true";
    slide.setAttribute("data-expanded", open2 ? "false" : "true");
    btn.setAttribute("aria-expanded", open2 ? "false" : "true");
    setToggleLabel(btn, !open2);
    var region = expandRegionOf(slide, btn);
    if (region) region.hidden = open2;
    measureActiveHeight(st);
  }
  function wireExpand(carousel, st) {
    onLocal(carousel, carousel, "click", function(e) {
      if (st.disconnected) return;
      var btn = e.target && e.target.closest ? e.target.closest("[data-card-expand]") : null;
      if (!btn || !carousel.contains(btn)) return;
      var slide = btn.closest("[data-carousel-slide]");
      if (!slide) return;
      if (st.slides[st.index] !== slide) {
        goToIndex2(carousel, [].indexOf.call(st.slides, slide));
        return;
      }
      toggleExpand(st, slide);
    });
  }
  function isLocalArrowTarget(el2) {
    if (!el2 || !el2.closest) return false;
    return el2.isContentEditable || !!el2.closest(
      'input, textarea, select, option, summary, a[href], [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], [role="slider"]'
    );
  }
  function isCarouselControl(el2, carousel) {
    if (!el2 || !el2.closest) return false;
    var ctl = el2.closest("[data-prev], [data-next], [data-dots]");
    return !!ctl && carousel.contains(ctl);
  }
  function isCardContentButton(el2, carousel) {
    if (!el2 || !el2.closest) return false;
    var btn = el2.closest("button");
    return !!btn && carousel.contains(btn) && !!btn.closest("[data-carousel-slide]");
  }
  function wireKeys2(carousel, st) {
    onLocal(carousel, carousel, "keydown", function(e) {
      if (st.disconnected || st.count === 0 || e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      var target = e.target;
      if (isLocalArrowTarget(target)) return;
      if (!isCarouselControl(target, carousel) && isCardContentButton(target, carousel)) return;
      var rtl = directionOf(carousel) === "rtl";
      var handled = true;
      switch (e.key) {
        case "ArrowRight":
          rtl ? prev2(carousel) : next2(carousel);
          break;
        case "ArrowLeft":
          rtl ? next2(carousel) : prev2(carousel);
          break;
        case "Home":
          goToIndex2(carousel, 0);
          break;
        case "End":
          goToIndex2(carousel, st.count - 1);
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    });
  }
  function wireResize(carousel, st) {
    if (!st.resizeHandler) {
      st.resizeHandler = function() {
        recenterCarousel(carousel, st);
      };
      window.addEventListener("resize", st.resizeHandler);
    }
    if (reduceMotionQuery && reduceMotionQuery.addEventListener && !st.motionHandler) {
      st.motionHandler = function() {
        goToIndex2(carousel, st.index, { animate: false });
      };
      reduceMotionQuery.addEventListener("change", st.motionHandler);
    }
    observeViewport2(carousel, st);
    if (!st.directionObserver && typeof MutationObserver === "function") {
      var observer = new MutationObserver(function() {
        if (st.disconnected || st.directionObserver !== observer || getComputedStyle(carousel).direction === st.lastDirection) return;
        recenterCarousel(carousel, st);
      });
      st.directionObserver = observer;
      for (var node2 = carousel; node2; node2 = node2.parentElement) {
        observer.observe(node2, { attributes: true, attributeFilter: ["dir", "class", "style"] });
      }
    }
  }
  function setup(carousel) {
    var existing = stateOf3.get(carousel);
    if (existing) {
      wireResize(carousel, existing);
      recenterCarousel(carousel, existing);
      return;
    }
    var st = parts(carousel);
    st.index = 0;
    st.count = st.slides.length;
    st.programmatic = false;
    st.dotsBuilt = false;
    stateOf3.set(carousel, st);
    carousel.setAttribute("role", "group");
    if (!carousel.hasAttribute("tabindex")) carousel.setAttribute("tabindex", "0");
    carousel.setAttribute("aria-roledescription", L12("region.role", carousel));
    if (!carousel.hasAttribute("aria-label") && carousel.hasAttribute("data-carousel-label")) {
      carousel.setAttribute("aria-label", carousel.getAttribute("data-carousel-label"));
    }
    st.track.setAttribute("data-track-state", "idle");
    if (st.prev) onLocal(carousel, st.prev, "click", function() {
      prev2(carousel);
    });
    if (st.next) onLocal(carousel, st.next, "click", function() {
      next2(carousel);
    });
    wireKeys2(carousel, st);
    wireScroll2(carousel, st);
    wireExpand(carousel, st);
    wireResize(carousel, st);
    update5(carousel, st);
    recenterCarousel(carousel, st);
    if (document.fonts) document.fonts.ready.then(function() {
      if (carousel.isConnected && !st.disconnected) {
        measureActiveHeight(st);
        st.lastWidth = void 0;
        recenterCarousel(carousel, st);
      }
    });
  }
  function next2(carousel) {
    var st = stateOf3.get(carousel);
    if (st) goToIndex2(carousel, st.index + 1);
  }
  function prev2(carousel) {
    var st = stateOf3.get(carousel);
    if (st) goToIndex2(carousel, st.index - 1);
  }
  var instances7 = instanceRegistry();
  function init16(root, options) {
    var scope = root || document;
    applyInstanceLabels16(scope, options);
    var existing = instances7.get(scope);
    if (existing) {
      withLabels17(scope, function() {
        if (scope.matches && scope.matches("[data-carousel]")) setup(scope);
        scope.querySelectorAll("[data-carousel]").forEach(setup);
      });
      return existing;
    }
    var destroyed = false;
    function target() {
      if (scope.matches && scope.matches("[data-carousel]")) return scope;
      return scope.querySelector ? scope.querySelector("[data-carousel]") : null;
    }
    var instance = {
      root: scope,
      /** = goTo: تنقل الفهرس (يطلق micro-carousel:change حتى برمجيًا). */
      update: function(updateOptions) {
        updateOptions = updateOptions || {};
        var el2 = target();
        var st = el2 ? stateOf3.get(el2) : null;
        var index = typeof updateOptions.index === "number" ? updateOptions.index : st ? st.index : 0;
        if (el2) goToIndex2(el2, index, updateOptions);
      },
      goTo: function(index, goToOptions) {
        var el2 = target();
        if (el2) goToIndex2(el2, index, goToOptions);
      },
      next: function() {
        var el2 = target();
        if (el2) next2(el2);
      },
      prev: function() {
        var el2 = target();
        if (el2) prev2(el2);
      },
      getIndex: function() {
        var el2 = target();
        return el2 ? getIndex2(el2) : -1;
      },
      /** يفك مستمعات كل عارض ومراقباته ومؤقتاته تحت الجذر. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        destroyAll(scope);
        instances7.remove(scope);
      }
    };
    withLabels17(scope, function() {
      if (scope.matches && scope.matches("[data-carousel]")) setup(scope);
      scope.querySelectorAll("[data-carousel]").forEach(setup);
    });
    instances7.set(scope, instance);
    return instance;
  }
  function getInstance16(root) {
    return instances7.get(root);
  }
  function updateApi2(carousel, index, options) {
    goToIndex2(carousel, index, options);
  }
  function getIndex2(carousel) {
    var st = stateOf3.get(carousel);
    return st ? st.index : -1;
  }
  function destroyAll(scope) {
    teardown16(scope);
    var items = [].slice.call(scope.querySelectorAll("[data-carousel]"));
    if (scope.matches && scope.matches("[data-carousel]")) items.unshift(scope);
    items.forEach(function(carousel) {
      var st = stateOf3.get(carousel);
      if (st && st.controller) st.controller.abort();
      if (st && st.dots) st.dots.textContent = "";
      stateOf3.delete(carousel);
    });
  }
  function destroy16(root) {
    var instance = instances7.get(root);
    if (instance) {
      instance.destroy();
      return;
    }
    destroyAll(root || document);
  }
  function disconnect16(root) {
    destroy16(root);
  }
  function teardown16(root) {
    var scope = root || document;
    var items = [];
    if (scope.matches && scope.matches("[data-carousel]")) items.push(scope);
    Array.prototype.push.apply(items, scope.querySelectorAll("[data-carousel]"));
    items.forEach(function(carousel) {
      var ro = viewportObservers2.get(carousel);
      if (ro) {
        ro.disconnect();
        viewportObservers2.delete(carousel);
      }
      var st = stateOf3.get(carousel);
      if (st) {
        st.disconnected = true;
        if (st.directionObserver) {
          st.directionObserver.disconnect();
          st.directionObserver = null;
        }
        if (st.scrollTimer) {
          window.clearTimeout(st.scrollTimer);
          st.scrollTimer = null;
        }
        if (st.scrollRaf) {
          cancelAnimationFrame(st.scrollRaf);
          st.scrollRaf = 0;
        }
        if (st.resizeHandler) {
          window.removeEventListener("resize", st.resizeHandler);
          st.resizeHandler = null;
        }
        if (st.motionHandler) {
          reduceMotionQuery.removeEventListener("change", st.motionHandler);
          st.motionHandler = null;
        }
        st.heightSlide = null;
        st.lastWidth = void 0;
        if (st.raf) {
          cancelAnimationFrame(st.raf);
          st.raf = null;
        }
      }
    });
  }
  function setLabels16(partial) {
    setLabels("carousel", partial);
  }

  // components/screen/screen.js
  var screen_exports = {};
  __export(screen_exports, {
    destroy: () => destroy17,
    getInstance: () => getInstance17,
    init: () => init17,
    update: () => update6
  });
  var registry11 = instanceRegistry();
  var KEYBOARD_THRESHOLD = 120;
  function measureBars(screen) {
    var actions = screen.querySelector(".m-screen__actions");
    var nav = screen.querySelector(".m-screen__nav");
    screen.style.setProperty("--m-screen-actions-h", (actions ? actions.offsetHeight : 0) + "px");
    screen.style.setProperty("--m-screen-nav-h", (nav ? nav.offsetHeight : 0) + "px");
  }
  function keepFocusedVisible(screen) {
    var content = screen.querySelector(".m-screen__content");
    var focus = document.activeElement;
    if (!content || !focus || !content.contains(focus)) return;
    var vv = window.visualViewport;
    if (!vv) return;
    var rect = focus.getBoundingClientRect();
    var keyboardTop = vv.height + vv.offsetTop;
    var actions = screen.querySelector('.m-screen__actions[data-actions="keyboard-follow"]');
    var margin = 16 + (actions ? actions.offsetHeight : 0);
    if (rect.bottom > keyboardTop - margin) {
      content.scrollTop += rect.bottom - keyboardTop + margin;
    }
  }
  function initScreen(screen, tracker) {
    var actions = screen.querySelector(".m-screen__actions");
    if (actions && !actions.getAttribute("data-actions")) {
      var nav = screen.querySelector(".m-screen__nav");
      actions.setAttribute("data-actions", nav ? "keyboard-hide" : "keyboard-follow");
    }
    measureBars(screen);
    var resizeObserver = new ResizeObserver(function() {
      measureBars(screen);
    });
    [actions, screen.querySelector(".m-screen__nav")].forEach(function(bar) {
      if (bar) resizeObserver.observe(bar);
    });
    tracker.trackObserver(resizeObserver);
    var viewport = window.visualViewport;
    if (viewport) {
      var pending = false;
      var onViewport = function() {
        if (pending) return;
        pending = true;
        tracker.frame(function() {
          pending = false;
          var keyboard = Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop));
          var open2 = keyboard > KEYBOARD_THRESHOLD;
          screen.setAttribute("data-keyboard", open2 ? "true" : "false");
          screen.style.setProperty("--m-screen-keyboard", (open2 ? keyboard : 0) + "px");
          if (open2) keepFocusedVisible(screen);
        });
      };
      tracker.on(viewport, "resize", onViewport);
      tracker.on(viewport, "scroll", onViewport);
    }
    return {
      update: function() {
        measureBars(screen);
      },
      destroy: function() {
        screen.removeAttribute("data-keyboard");
        screen.style.removeProperty("--m-screen-keyboard");
        screen.style.removeProperty("--m-screen-actions-h");
        screen.style.removeProperty("--m-screen-nav-h");
      }
    };
  }
  function init17(root, options) {
    var scope = root && root.matches && root.matches("[data-micro-screen]") ? root : document;
    var existing = registry11.get(scope === document ? null : scope);
    if (existing) return existing;
    var screens = scope === document ? document.querySelectorAll("[data-micro-screen]") : [scope];
    var bound = [];
    screens.forEach(function(screen) {
      var instance = registry11.get(screen);
      if (instance) return;
      var tracker = resourceTracker();
      instance = initScreen(screen, tracker);
      instance.__destroyed = false;
      instance.destroy = /* @__PURE__ */ (function(original) {
        return function() {
          original();
          tracker.stopAll();
          instance.__destroyed = true;
          registry11.remove(screen);
        };
      })(instance.destroy);
      registry11.set(screen, instance);
      bound.push(instance);
    });
    if (scope !== document) return registry11.get(scope);
    return {
      update: function() {
        bound.forEach(function(i) {
          i.update();
        });
      },
      destroy: function() {
        bound.slice().forEach(function(i) {
          i.destroy();
        });
      }
    };
  }
  function update6(root) {
    var scope = root || document;
    var screens = scope.matches && scope.matches("[data-micro-screen]") ? [scope] : scope.querySelectorAll("[data-micro-screen]");
    screens.forEach(function(screen) {
      var instance = registry11.get(screen);
      if (instance) instance.update();
      else measureBars(screen);
    });
  }
  function destroy17(root) {
    var scope = root || document;
    var screens = scope.matches && scope.matches("[data-micro-screen]") ? [scope] : scope.querySelectorAll("[data-micro-screen]");
    screens.forEach(function(screen) {
      var instance = registry11.get(screen);
      if (instance) instance.destroy();
    });
  }
  function getInstance17(root) {
    var scope = root || document;
    if (scope.matches && scope.matches("[data-micro-screen]")) return registry11.get(scope);
    var screen = scope.querySelector("[data-micro-screen]");
    return screen ? registry11.get(screen) : null;
  }

  // components/order-schedule/order-schedule.js
  var order_schedule_exports = {};
  __export(order_schedule_exports, {
    destroy: () => destroy18,
    getInstance: () => getInstance18,
    init: () => init18,
    setLabels: () => setLabels17,
    update: () => update7
  });

  // components/order-schedule/labels.js
  var defaults12 = {
    "schedule.orders.count": { "zero": "لا طلبات", "one": "طلب واحد", "two": "طلبان", "few": "{n} طلبات", "many": "{n} طلبًا", "other": "{n} طلب", "hundredOne": "{n} طلب واحد", "hundredTwo": "{n} طلبان" },
    "schedule.weekdays.full": ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    "schedule.weekdays.short": ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
    "schedule.errors.invalidRoot": "MicroOrderSchedule.init يتطلب عنصر جذر صالحًا (DOM Element)",
    "schedule.view.ariaLabel": "طريقة العرض",
    "schedule.view.day": "يوم",
    "schedule.view.week": "أسبوع",
    "schedule.view.month": "شهر",
    "schedule.view.calendarToggle": "عرض التقويم",
    "schedule.view.listToggle": "عرض القائمة",
    "schedule.nav.today": "اليوم",
    "schedule.nav.prevMonth": "الشهر السابق",
    "schedule.nav.prevWeek": "الأسبوع السابق",
    "schedule.nav.prevDay": "اليوم السابق",
    "schedule.nav.nextMonth": "الشهر التالي",
    "schedule.nav.nextWeek": "الأسبوع التالي",
    "schedule.nav.nextDay": "اليوم التالي",
    "schedule.picker.ariaLabel": "اختيار الشهر والسنة",
    "schedule.picker.prevYear": "السنة السابقة",
    "schedule.picker.nextYear": "السنة التالية",
    "schedule.picker.back": "رجوع للتقويم",
    "schedule.picker.monthsLabel": "أشهر السنة",
    "schedule.dayCell.ordersSuffix": "، ",
    "schedule.monthTitlePrefix": "طلبات ",
    "schedule.weekTitlePrefix": "طلبات الأسبوع ",
    "schedule.addOrder.label": "إضافة طلب",
    "schedule.addOrder.dayAriaPrefix": "إضافة طلب ليوم ",
    "schedule.orderRow.date": "التاريخ",
    "schedule.orderRow.unscheduled": "غير مجدول",
    "schedule.orderRow.time": "الوقت",
    "schedule.orderRow.customer": "المورد",
    "schedule.orderRow.status": "الحالة",
    "schedule.orderRow.note": "الملاحظة",
    "schedule.orderRow.edit": "تعديل",
    "schedule.orderRow.delete": "حذف",
    "schedule.dayList.title": "طلبات اليوم",
    "schedule.dayList.noDayPrefix": "لا يوم محدد في ",
    "schedule.dayList.noDaySuffix": " في هذا الشهر",
    "schedule.dayList.empty": "لا توجد طلبات",
    "schedule.list.empty": "لا توجد طلبات بعد.",
    "schedule.list.upcoming": "الطلبات القادمة",
    "schedule.list.past": "الطلبات السابقة",
    "schedule.list.unscheduled": "الطلبات غير المجدولة",
    "schedule.loading": "جارٍ تحميل الطلبات…",
    "schedule.loadError": "تعذّر تحميل الطلبات.",
    "schedule.retry": "إعادة المحاولة"
  };

  // components/order-schedule/order-schedule.js
  registerLabels("order-schedule", defaults12);
  var MICRO_LABELS_FAMILY16 = "order-schedule";
  function L13(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY16) || currentInstanceLabels(MICRO_LABELS_FAMILY16);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY16, key2);
  }
  function withLabels18(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY16, fn);
  }
  function applyInstanceLabels17(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY16, options.labels);
    }
  }
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
  var WEEKDAYS_FULL = L13("schedule.weekdays.full");
  var WEEKDAYS_SHORT = L13("schedule.weekdays.short");
  var SVG_NS = "http://www.w3.org/2000/svg";
  var instances8 = /* @__PURE__ */ new WeakMap();
  var instanceSeq = 0;
  function el(tag, cls, text2) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text2 != null) e.textContent = text2;
    return e;
  }
  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }
  function isoOf(y, m, d) {
    return yearText(y) + "-" + pad2(m) + "-" + pad2(d);
  }
  function yearText(y) {
    return ("0000" + y).slice(-4);
  }
  function parseIso(s) {
    if (typeof s !== "string" || !DATE_RE.test(s)) return null;
    var p = s.split("-");
    var y = +p[0], m = +p[1], d = +p[2];
    if (y < 1 || y > 9999 || m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;
    return { y, m, d };
  }
  function daysInMonth(y, m) {
    var date = /* @__PURE__ */ new Date(0);
    date.setFullYear(y, m, 0);
    return date.getDate();
  }
  function weekdayOf(y, m, d) {
    var date = /* @__PURE__ */ new Date(0);
    date.setFullYear(y, m - 1, d);
    return date.getDay();
  }
  function shiftMonth(y, m, delta) {
    var total = y * 12 + (m - 1) + delta;
    return { y: Math.floor(total / 12), m: (total % 12 + 12) % 12 + 1 };
  }
  function normalizeYmd(y, m, d) {
    while (d > daysInMonth(y, m)) {
      d -= daysInMonth(y, m);
      var nm = shiftMonth(y, m, 1);
      y = nm.y;
      m = nm.m;
    }
    while (d < 1) {
      var pm = shiftMonth(y, m, -1);
      d += daysInMonth(pm.y, pm.m);
      y = pm.y;
      m = pm.m;
    }
    return { y, m, d };
  }
  function localTodayIso() {
    var t = /* @__PURE__ */ new Date();
    return isoOf(t.getFullYear(), t.getMonth() + 1, t.getDate());
  }
  var countPluralRules = null;
  function countPluralCategory(n) {
    if (n >= 100) {
      var r = n % 100;
      if (r === 0) return "other";
      if (r === 1) return "hundredOne";
      if (r === 2) return "hundredTwo";
      if (r >= 3 && r <= 10) return "few";
      return "many";
    }
    if (!countPluralRules) {
      try {
        countPluralRules = new Intl.PluralRules("ar");
      } catch (err) {
        countPluralRules = { select: function() {
          return "other";
        } };
      }
    }
    return countPluralRules.select(n);
  }
  function countPhraseAr(n) {
    var forms = L13("schedule.orders.count") || {};
    var category = countPluralCategory(n);
    var template = forms[category] != null ? forms[category] : forms.other;
    if (template == null) return String(n);
    return String(template).replace("{n}", String(n));
  }
  function fullDateAr(iso) {
    var p = parseIso(iso);
    if (!p) return "";
    return WEEKDAYS_FULL[weekdayOf(p.y, p.m, p.d)] + " " + dateNumeric(iso);
  }
  function dateNumeric(iso) {
    var p = parseIso(iso);
    if (!p) return "";
    return pad2(p.d) + "/" + pad2(p.m) + "/" + yearText(p.y);
  }
  function dayTitleNumeric(iso) {
    var p = parseIso(iso);
    if (!p) return "";
    return WEEKDAYS_FULL[weekdayOf(p.y, p.m, p.d)] + " " + dateNumeric(iso);
  }
  function baseSvg(size) {
    var s = document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("width", size);
    s.setAttribute("height", size);
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "1.5");
    s.setAttribute("stroke-linecap", "round");
    s.setAttribute("stroke-linejoin", "round");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    return s;
  }
  function svgNode(tag, attrs) {
    var n = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function chevronIcon(dir, size) {
    var s = baseSvg(size || 24);
    s.appendChild(svgNode("polyline", {
      points: dir === "left" ? "15 5 8 12 15 19" : "9 5 16 12 9 19"
    }));
    return s;
  }
  function plusIcon() {
    var s = baseSvg(20);
    s.appendChild(svgNode("line", { x1: "12", y1: "5", x2: "12", y2: "19" }));
    s.appendChild(svgNode("line", { x1: "5", y1: "12", x2: "19", y2: "12" }));
    return s;
  }
  function listIcon() {
    var s = baseSvg(20);
    s.appendChild(svgNode("line", { x1: "4", y1: "6", x2: "20", y2: "6" }));
    s.appendChild(svgNode("line", { x1: "4", y1: "12", x2: "20", y2: "12" }));
    s.appendChild(svgNode("line", { x1: "4", y1: "18", x2: "20", y2: "18" }));
    return s;
  }
  function calendarIcon() {
    var s = baseSvg(20);
    s.appendChild(svgNode("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }));
    s.appendChild(svgNode("line", { x1: "8", y1: "2", x2: "8", y2: "6" }));
    s.appendChild(svgNode("line", { x1: "16", y1: "2", x2: "16", y2: "6" }));
    s.appendChild(svgNode("line", { x1: "3", y1: "10", x2: "21", y2: "10" }));
    return s;
  }
  function chevronDownIcon() {
    var s = baseSvg(20);
    s.appendChild(svgNode("polyline", { points: "6 9 12 15 18 9" }));
    return s;
  }
  function normalizeOrders(raw) {
    var out = [];
    if (!raw || typeof raw !== "object" || typeof raw.length !== "number") return out;
    for (var i = 0; i < raw.length; i++) {
      var o = raw[i];
      if (!o || typeof o !== "object") continue;
      out.push({
        id: o.id == null ? "" : String(o.id),
        title: o.title == null ? "" : String(o.title),
        /* تاريخ مدني غير صالح → غير مجدول، لا يوم مستحيل داخل التقويم. */
        date: parseIso(o.date) ? o.date : null,
        /* وقت لا يطابق HH:mm → غائب (لا يُخترع وقت أبدًا) */
        time: typeof o.time === "string" && TIME_RE.test(o.time) ? o.time : null,
        statusKey: o.statusKey == null ? "" : String(o.statusKey),
        customer: o.customer == null || o.customer === "" ? null : String(o.customer),
        /* ملاحظة قصيرة اختيارية (بيانات وصفيّة فقط — لا معنى مالي) */
        note: o.note == null || o.note === "" ? null : String(o.note)
      });
    }
    return out;
  }
  function init18(root, options) {
    if (!root || root.nodeType !== 1) {
      throw new Error(L13("schedule.errors.invalidRoot"));
    }
    applyInstanceLabels17(root, options);
    var existing = instances8.get(root);
    if (existing) return existing;
    var inst = createInstance(root, options);
    instances8.set(root, inst);
    root.setAttribute("data-ocal-init", "1");
    return inst;
  }
  function createInstance(root, options) {
    options = options || {};
    var listeners = [];
    var destroyed = false;
    var state2 = {};
    var resizeObserver = null;
    var resizeFrame = 0;
    var pendingResizeWidth = 0;
    var resizeFallback = null;
    var dirObserver = null;
    var docEscapeRef = null;
    var uid = "m-ocal-" + ++instanceSeq;
    state2.orders = normalizeOrders(options.orders);
    state2.statuses = options.statuses && typeof options.statuses === "object" ? options.statuses : {};
    state2.today = parseIso(options.today) ? options.today : localTodayIso();
    state2.weekStart = typeof options.weekStart === "number" && options.weekStart >= 0 && options.weekStart <= 6 && Math.floor(options.weekStart) === options.weekStart ? options.weekStart : 0;
    state2.selectedDate = parseIso(options.selectedDate) ? options.selectedDate : state2.today;
    state2.view = options.view === "list" ? "list" : "calendar";
    state2.calendarView = options.calendarView === "day" || options.calendarView === "week" ? options.calendarView : "month";
    state2.orderActions = {
      edit: !!(options.orderActions && options.orderActions.edit),
      delete: !!(options.orderActions && options.orderActions.delete)
    };
    state2.headingLevel = typeof options.headingLevel === "number" && options.headingLevel >= 2 && options.headingLevel <= 6 && Math.floor(options.headingLevel) === options.headingLevel ? options.headingLevel : 3;
    state2.loading = !!options.loading;
    state2.errorRetry = typeof options.retry === "function" ? options.retry : null;
    state2.compactMonth = false;
    state2.pickerOpen = false;
    state2.pickerYear = null;
    state2.expandedId = null;
    var sp = parseIso(state2.selectedDate) || parseIso(state2.today);
    state2.monthCursor = { y: sp.y, m: sp.m };
    state2.focusDate = state2.selectedDate;
    var displayed = parseIso(typeof options.displayedMonth === "string" ? options.displayedMonth + "-01" : null);
    if (displayed) state2.monthCursor = { y: displayed.y, m: displayed.m };
    state2.rtl = true;
    try {
      var dir = window.getComputedStyle(root).direction;
      if (dir === "ltr") state2.rtl = false;
    } catch (err) {
    }
    function hTag() {
      return "h" + state2.headingLevel;
    }
    function on5(elm, type8, fn) {
      elm.addEventListener(type8, fn, false);
      listeners.push({ el: elm, type: type8, fn });
    }
    function guard(fn) {
      return function() {
        if (destroyed) return void 0;
        return fn.apply(null, arguments);
      };
    }
    function emit(name, detail) {
      if (destroyed) return;
      root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
    }
    function getState() {
      return {
        view: state2.view,
        calendarView: state2.calendarView,
        selectedDate: state2.selectedDate,
        displayedMonth: yearText(state2.monthCursor.y) + "-" + pad2(state2.monthCursor.m)
      };
    }
    var userActionDepth = 0;
    function userAction(fn) {
      return guard(function(event) {
        var outer = userActionDepth === 0;
        var before = outer ? JSON.stringify(getState()) : null;
        userActionDepth++;
        try {
          fn(event);
        } finally {
          userActionDepth--;
          if (outer && !destroyed && before !== JSON.stringify(getState())) {
            emit("order-schedule:state-change", getState());
          }
        }
      });
    }
    function resolveStatus(key2) {
      var entry = state2.statuses && key2 != null && key2 !== "" ? state2.statuses[key2] : null;
      if (entry && typeof entry === "object") {
        var tone = typeof entry.tone === "string" ? entry.tone : "neutral";
        if (tone !== "progress" && tone !== "info" && tone !== "success" && tone !== "warning" && tone !== "neutral") tone = "neutral";
        if (tone === "info") tone = "progress";
        var label = entry.label != null && String(entry.label) !== "" ? String(entry.label) : String(key2);
        return { tone, label };
      }
      return { tone: "neutral", label: String(key2 == null ? "" : key2) };
    }
    function addRequestDate() {
      return state2.view === "calendar" ? state2.selectedDate || null : null;
    }
    function groupOrdersByDate() {
      var map = {};
      for (var i = 0; i < state2.orders.length; i++) {
        var o = state2.orders[i];
        if (!o.date) continue;
        if (!map[o.date]) map[o.date] = [];
        map[o.date].push(o);
      }
      return map;
    }
    function cmpSameDate(a, b) {
      if (a.time && b.time && a.time !== b.time) return a.time < b.time ? -1 : 1;
      if (a.time && !b.time) return -1;
      if (!a.time && b.time) return 1;
      if (a.title !== b.title) return a.title < b.title ? -1 : 1;
      return 0;
    }
    function sortedOrdersForDate(iso) {
      var groups = groupOrdersByDate();
      var list = groups[iso] || [];
      return list.slice().sort(cmpSameDate);
    }
    function ordersInMonth(y, m) {
      var prefix = y + "-" + pad2(m);
      var out = [];
      for (var i = 0; i < state2.orders.length; i++) {
        if (state2.orders[i].date && state2.orders[i].date.indexOf(prefix) === 0) out.push(state2.orders[i]);
      }
      return out;
    }
    function listBuckets() {
      var upcoming = [], past = [], unsched = [];
      for (var i = 0; i < state2.orders.length; i++) {
        var o = state2.orders[i];
        if (!o.date) {
          unsched.push(o);
          continue;
        }
        if (o.date >= state2.today) upcoming.push(o);
        else past.push(o);
      }
      upcoming.sort(function(a, b) {
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        return cmpSameDate(a, b);
      });
      past.sort(function(a, b) {
        if (a.date !== b.date) return a.date > b.date ? -1 : 1;
        return cmpSameDate(a, b);
      });
      return { upcoming, past, unsched };
    }
    function render11() {
      if (destroyed) return;
      try {
        var dirNow = window.getComputedStyle(root).direction;
        if (dirNow === "ltr") state2.rtl = false;
        else if (dirNow === "rtl") state2.rtl = true;
      } catch (err) {
      }
      root.textContent = "";
      root.classList.add("m-ocal");
      root.setAttribute("data-ocal-root", "");
      root.setAttribute("data-ocal-view", state2.view);
      root.setAttribute("data-ocal-cal-view", state2.calendarView);
      var layout = state2.view === "list" ? "list" : state2.calendarView === "day" ? "day" : state2.calendarView === "week" ? "week-grid" : "month-grid";
      root.setAttribute("data-ocal-layout", layout);
      root.setAttribute("data-ocal-compact", state2.compactMonth ? "true" : "false");
      root.setAttribute("data-ocal-selected-date", state2.selectedDate);
      if (state2.monthFade) {
        root.setAttribute("data-ocal-fade", "1");
        state2.monthFade = false;
      } else {
        root.removeAttribute("data-ocal-fade");
      }
      if (state2.loading) {
        root.appendChild(buildControlsRow());
        root.appendChild(buildLoading());
        return;
      }
      if (state2.errorRetry) {
        root.appendChild(buildControlsRow());
        root.appendChild(buildError());
        return;
      }
      if (state2.view === "list") root.appendChild(buildListScreen());
      else if (state2.calendarView === "day") root.appendChild(buildDayScreen());
      else if (state2.calendarView === "week") root.appendChild(buildWeekScreen());
      else root.appendChild(buildMonthScreen());
    }
    function viewsegBtn(value, text2, selected) {
      var b = el("button", "m-ocal__viewseg-btn");
      b.type = "button";
      b.setAttribute("data-ocal-action", "view");
      b.setAttribute("data-ocal-value", value);
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", selected ? "true" : "false");
      if (!selected) b.tabIndex = -1;
      b.textContent = text2;
      return b;
    }
    function viewPressed(value) {
      return state2.view === "calendar" && state2.calendarView === value;
    }
    function buildViewSeg() {
      var bar = el("div", "m-ocal__viewseg");
      bar.setAttribute("role", "tablist");
      bar.setAttribute("aria-label", L13("schedule.view.ariaLabel", bar));
      bar.appendChild(viewsegBtn("day", L13("schedule.view.day", bar), viewPressed("day")));
      bar.appendChild(viewsegBtn("week", L13("schedule.view.week", bar), viewPressed("week")));
      bar.appendChild(viewsegBtn("month", L13("schedule.view.month", bar), viewPressed("month")));
      return bar;
    }
    function buildModeToggle() {
      var listActive = state2.view === "list";
      var btn = el("button", "m-ocal__mode-toggle");
      btn.type = "button";
      btn.setAttribute("data-ocal-action", "mode-toggle");
      btn.setAttribute("aria-pressed", listActive ? "true" : "false");
      btn.appendChild(listActive ? calendarIcon() : listIcon());
      btn.appendChild(el(
        "span",
        "m-ocal__mode-toggle-text",
        listActive ? L13("schedule.view.calendarToggle") : L13("schedule.view.listToggle")
      ));
      return btn;
    }
    function buildControlsRow() {
      var row = el("div", "m-ocal__controls");
      if (state2.view === "calendar") row.appendChild(buildViewSeg());
      row.appendChild(buildModeToggle());
      return row;
    }
    function updateResponsiveView(width) {
      var compactMonth = width > 0 && width < 360;
      if (compactMonth === state2.compactMonth && root.hasAttribute("data-ocal-compact")) return;
      state2.compactMonth = compactMonth;
      root.setAttribute("data-ocal-compact", compactMonth ? "true" : "false");
    }
    function observeResponsiveWidth() {
      if (typeof window.ResizeObserver === "function") {
        resizeObserver = new window.ResizeObserver(function(entries) {
          if (destroyed || !entries.length) return;
          pendingResizeWidth = entries[0].contentRect.width;
          if (resizeFrame) return;
          resizeFrame = window.requestAnimationFrame(function() {
            resizeFrame = 0;
            if (!destroyed && root.isConnected && pendingResizeWidth > 0) {
              updateResponsiveView(pendingResizeWidth);
            }
          });
        });
        resizeObserver.observe(root);
      } else {
        resizeFallback = function() {
          if (!destroyed) updateResponsiveView(root.getBoundingClientRect().width);
        };
        window.addEventListener("resize", resizeFallback, false);
      }
      updateResponsiveView(root.getBoundingClientRect().width);
    }
    function navBtn(action, ariaLabel, icon) {
      var b = el("button", "m-ocal__navbtn");
      b.type = "button";
      b.setAttribute("data-ocal-action", action);
      b.setAttribute("aria-label", ariaLabel);
      b.appendChild(icon);
      return b;
    }
    function todayNavBtn() {
      var today = el("button", "m-ocal__todaybtn");
      today.type = "button";
      today.setAttribute("data-ocal-action", "today");
      today.textContent = L13("schedule.nav.today", today);
      return today;
    }
    function todayVisible() {
      var t = parseIso(state2.today);
      var s = parseIso(state2.selectedDate);
      if (!t || !s) return true;
      if (s.y !== t.y || s.m !== t.m || s.d !== t.d) return true;
      if (state2.view === "calendar" && state2.calendarView === "month") {
        return t.y !== state2.monthCursor.y || t.m !== state2.monthCursor.m;
      }
      return false;
    }
    function buildNavActions(prevAction, nextAction) {
      var group = el("div", "m-ocal__cal-actions");
      if (todayVisible()) group.appendChild(todayNavBtn());
      group.appendChild(navBtn(prevAction, prevAction === "prev-month" ? L13("schedule.nav.prevMonth", group) : prevAction === "prev-week" ? L13("schedule.nav.prevWeek") : L13("schedule.nav.prevDay"), prevIcon()));
      group.appendChild(navBtn(nextAction, nextAction === "next-month" ? L13("schedule.nav.nextMonth", group) : nextAction === "next-week" ? L13("schedule.nav.nextWeek") : L13("schedule.nav.nextDay"), nextIcon()));
      return group;
    }
    function prevIcon() {
      return chevronIcon(state2.rtl ? "right" : "left");
    }
    function nextIcon() {
      return chevronIcon(state2.rtl ? "left" : "right");
    }
    function buildCalBar(y, m) {
      var bar = el("div", "m-ocal__cal-bar");
      var title = el(hTag(), "m-ocal__cal-title");
      var pickerButton = el("button", "m-ocal__month-trigger");
      pickerButton.type = "button";
      pickerButton.setAttribute("data-ocal-action", "month-picker");
      pickerButton.setAttribute("aria-label", L13("schedule.picker.ariaLabel", pickerButton));
      pickerButton.setAttribute("aria-haspopup", "dialog");
      pickerButton.setAttribute("aria-expanded", state2.pickerOpen ? "true" : "false");
      var range = el("span", "m-ocal__month-range");
      range.appendChild(el("span", "m-ocal__month-label", pad2(m)));
      range.appendChild(document.createTextNode(" / "));
      range.appendChild(el("span", "m-ocal__year", yearText(y)));
      pickerButton.appendChild(range);
      pickerButton.appendChild(chevronDownIcon());
      title.appendChild(pickerButton);
      bar.appendChild(title);
      bar.appendChild(buildNavActions("prev-month", "next-month"));
      return bar;
    }
    function buildMonthPicker() {
      var picker = el("section", "m-ocal__picker");
      picker.setAttribute("data-ocal-picker", "");
      picker.setAttribute("data-ocal-year", yearText(state2.pickerYear));
      picker.setAttribute("role", "dialog");
      picker.setAttribute("aria-label", L13("schedule.picker.ariaLabel", picker));
      var heading = el("div", "m-ocal__picker-head");
      var prevYear = el("button", "m-ocal__picker-yearbtn", L13("schedule.picker.prevYear", prevYear));
      prevYear.type = "button";
      prevYear.setAttribute("data-ocal-action", "picker-prev-year");
      prevYear.setAttribute("aria-label", L13("schedule.picker.prevYear", prevYear));
      prevYear.disabled = state2.pickerYear <= 1;
      heading.appendChild(prevYear);
      var year = el(hTag(), "m-ocal__picker-year", yearText(state2.pickerYear));
      year.setAttribute("aria-live", "polite");
      heading.appendChild(year);
      var nextYear = el("button", "m-ocal__picker-yearbtn", L13("schedule.picker.nextYear", nextYear));
      nextYear.type = "button";
      nextYear.setAttribute("data-ocal-action", "picker-next-year");
      nextYear.setAttribute("aria-label", L13("schedule.picker.nextYear", nextYear));
      nextYear.disabled = state2.pickerYear >= 9999;
      heading.appendChild(nextYear);
      var back = el("button", "m-ocal__picker-back", L13("schedule.picker.back", back));
      back.type = "button";
      back.setAttribute("data-ocal-action", "picker-back");
      heading.appendChild(back);
      picker.appendChild(heading);
      var months = el("div", "m-ocal__picker-months");
      months.setAttribute("role", "group");
      months.setAttribute("aria-label", L13("schedule.picker.monthsLabel", months));
      var currentMonth = state2.pickerYear === state2.monthCursor.y ? state2.monthCursor.m : -1;
      for (var i = 0; i < 12; i++) {
        var month = el("button", "m-ocal__picker-month", pad2(i + 1));
        month.type = "button";
        month.setAttribute("data-ocal-action", "picker-month");
        month.setAttribute("data-ocal-value", String(i));
        month.setAttribute("aria-pressed", i + 1 === currentMonth ? "true" : "false");
        month.setAttribute("aria-label", pad2(i + 1) + " / " + yearText(state2.pickerYear));
        months.appendChild(month);
      }
      picker.appendChild(months);
      return picker;
    }
    function buildWeekdays() {
      var row = el("div", "m-ocal__weekdays");
      row.setAttribute("aria-hidden", "true");
      for (var i = 0; i < 7; i++) {
        row.appendChild(el("div", "m-ocal__weekday", WEEKDAYS_SHORT[(state2.weekStart + i) % 7]));
      }
      return row;
    }
    function toneRank(tone) {
      if (tone === "progress") return 0;
      if (tone === "warning") return 1;
      if (tone === "success") return 2;
      return 3;
    }
    function distinctStatuses(orders, max) {
      var seen = {};
      var out = [];
      for (var i = 0; i < orders.length; i++) {
        var k = orders[i].statusKey;
        if (k === "" || seen[k]) continue;
        seen[k] = true;
        out.push({ key: k, tone: resolveStatus(k).tone, label: resolveStatus(k).label });
      }
      out.sort(function(a, b) {
        return toneRank(a.tone) - toneRank(b.tone);
      });
      return max ? out.slice(0, max) : out;
    }
    function buildDayCell(iso, d, groups, outOfMonth) {
      if (!parseIso(iso)) {
        var outside = el("span", "m-ocal__cell m-ocal__cell--out");
        outside.setAttribute("aria-hidden", "true");
        return outside;
      }
      var orders = groups[iso] || [];
      var cell = el("button", "m-ocal__cell");
      cell.type = "button";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("data-ocal-action", "day-cell");
      cell.setAttribute("data-ocal-date", iso);
      cell.tabIndex = -1;
      if (outOfMonth) cell.className += " m-ocal__cell--out";
      if (iso === state2.selectedDate) {
        cell.className += " m-ocal__cell--selected";
        cell.setAttribute("aria-selected", "true");
        cell.setAttribute("aria-pressed", "true");
      } else {
        cell.setAttribute("aria-selected", "false");
        cell.setAttribute("aria-pressed", "false");
      }
      if (iso === state2.today) {
        cell.className += " m-ocal__cell--today";
        cell.setAttribute("aria-current", "date");
      }
      var focusedDate = parseIso(state2.focusDate);
      var focusedInCursor = focusedDate && focusedDate.y === state2.monthCursor.y && focusedDate.m === state2.monthCursor.m;
      var firstIso = isoOf(state2.monthCursor.y, state2.monthCursor.m, 1);
      if (iso === state2.focusDate || !focusedInCursor && iso === firstIso) {
        cell.tabIndex = 0;
      }
      cell.appendChild(el("span", "m-ocal__daynum", String(d)));
      var dots = el("span", "m-ocal__dots");
      dots.setAttribute("aria-hidden", "true");
      var visibleStatuses = distinctStatuses(orders, 3);
      for (var i = 0; i < visibleStatuses.length; i++) {
        dots.appendChild(el("span", "m-ocal__dot m-ocal__dot--" + visibleStatuses[i].tone));
      }
      cell.appendChild(dots);
      var label = dateNumeric(iso) + L13("schedule.dayCell.ordersSuffix") + countPhraseAr(orders.length);
      cell.setAttribute("aria-label", label);
      return cell;
    }
    function buildMonthGrid(groups) {
      var y = state2.monthCursor.y;
      var m = state2.monthCursor.m;
      var dim = daysInMonth(y, m);
      var lead = (weekdayOf(y, m, 1) - state2.weekStart + 7) % 7;
      var totalCells = Math.ceil((lead + dim) / 7) * 7;
      var grid = el("div", "m-ocal__grid");
      grid.setAttribute("role", "grid");
      grid.setAttribute("aria-label", L13("schedule.monthTitlePrefix", grid) + pad2(m) + " / " + yearText(y));
      grid.setAttribute("data-ocal-grid", "");
      var row = el("div", "m-ocal__gridrow");
      row.setAttribute("role", "row");
      grid.appendChild(row);
      for (var i = 0; i < totalCells; i++) {
        if (row.childNodes.length === 7) {
          row = el("div", "m-ocal__gridrow");
          row.setAttribute("role", "row");
          grid.appendChild(row);
        }
        var t = normalizeYmd(y, m, 1 - lead + i);
        row.appendChild(buildDayCell(isoOf(t.y, t.m, t.d), t.d, groups, t.m !== m));
      }
      return grid;
    }
    function weekDatesOf(iso) {
      var p = parseIso(iso);
      if (!p) return null;
      var back = (weekdayOf(p.y, p.m, p.d) - state2.weekStart + 7) % 7;
      var s = normalizeYmd(p.y, p.m, p.d - back);
      var out = [];
      for (var i = 0; i < 7; i++) {
        out.push(normalizeYmd(s.y, s.m, s.d + i));
      }
      return out;
    }
    function weekRangeTitle(dates) {
      var a = dates[0];
      var b = dates[6];
      if (a.y === b.y && a.m === b.m) {
        return a.d + "–" + b.d + "/" + pad2(b.m) + "/" + yearText(b.y);
      }
      if (a.y === b.y) {
        return a.d + "/" + pad2(a.m) + " – " + b.d + "/" + pad2(b.m) + "/" + yearText(b.y);
      }
      return dateNumeric(isoOf(a.y, a.m, a.d)) + " – " + dateNumeric(isoOf(b.y, b.m, b.d));
    }
    function buildWeekBar(dates) {
      var bar = el("div", "m-ocal__cal-bar");
      var title = el(hTag(), "m-ocal__cal-title");
      title.appendChild(el("span", "m-ocal__week-range", weekRangeTitle(dates)));
      bar.appendChild(title);
      bar.appendChild(buildNavActions("prev-week", "next-week"));
      return bar;
    }
    function buildWeekGrid(dates, groups) {
      var isos = dates.map(function(t2) {
        return isoOf(t2.y, t2.m, t2.d);
      });
      if (isos.indexOf(state2.focusDate) === -1) {
        state2.focusDate = state2.selectedDate;
      }
      var monthOfTitle = parseIso(state2.selectedDate);
      var grid = el("div", "m-ocal__grid");
      grid.setAttribute("role", "grid");
      grid.setAttribute("aria-label", L13("schedule.weekTitlePrefix", grid) + weekRangeTitle(dates));
      grid.setAttribute("data-ocal-grid", "");
      var row = el("div", "m-ocal__gridrow");
      row.setAttribute("role", "row");
      grid.appendChild(row);
      for (var i = 0; i < dates.length; i++) {
        var t = dates[i];
        var outOfMonth = !monthOfTitle || t.m !== monthOfTitle.m || t.y !== monthOfTitle.y;
        row.appendChild(buildDayCell(isos[i], t.d, groups, outOfMonth));
      }
      return grid;
    }
    function buildLegend(scopeOrders) {
      var keys = distinctStatuses(scopeOrders, 0).map(function(s) {
        return s.key;
      });
      if (!keys.length) return null;
      var ul = el("ul", "m-ocal__legend");
      ul.setAttribute("data-ocal-legend", "");
      for (var j = 0; j < keys.length; j++) {
        var st = resolveStatus(keys[j]);
        var li = el("li", "m-ocal__legend-item");
        li.appendChild(el("span", "m-ocal__legend-dot m-ocal__legend-dot--" + st.tone));
        li.appendChild(el("span", "m-ocal__legend-label", st.label));
        ul.appendChild(li);
      }
      return ul;
    }
    function buildAddButton(dateIso) {
      var b = el("button", "m-ocal__add");
      b.type = "button";
      b.setAttribute("data-ocal-action", "add");
      b.appendChild(plusIcon());
      b.appendChild(el("span", null, L13("schedule.addOrder.label", b)));
      var d = dateIso === void 0 ? addRequestDate() : dateIso;
      b.setAttribute("data-ocal-add-date", d || "");
      if (d) b.setAttribute("aria-label", L13("schedule.addOrder.dayAriaPrefix", b) + fullDateAr(d));
      return b;
    }
    function safeId(s) {
      return String(s).replace(/[^a-zA-Z0-9_-]/g, "_");
    }
    function buildOrderRow(order, showDate, idx) {
      var expanded = state2.expandedId === order.id;
      var domKey = uid + "-row-" + idx + "-" + safeId(order.id);
      var li = el("li", "m-ocal__rowitem");
      if (expanded) li.className += " m-ocal__rowitem--expanded";
      var btn = el("button", "m-ocal__row");
      btn.type = "button";
      btn.id = domKey + "-trigger";
      btn.setAttribute("data-ocal-action", "order-row");
      btn.setAttribute("data-ocal-id", order.id);
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      btn.setAttribute("aria-controls", domKey + "-panel");
      var main = el("span", "m-ocal__row-main");
      var line1 = el("span", "m-ocal__row-line");
      line1.appendChild(el("span", "m-ocal__row-title", order.title));
      if (order.time) {
        var t = el("bdi", "m-ocal__row-time", order.time);
        t.setAttribute("dir", "ltr");
        line1.appendChild(t);
      }
      main.appendChild(line1);
      var line2 = el("span", "m-ocal__row-line");
      if (showDate && order.date) {
        line2.appendChild(el("span", "m-ocal__row-date", shortDateAr(order.date)));
      }
      if (order.customer) {
        line2.appendChild(el("span", "m-ocal__row-customer", order.customer));
      } else if (!showDate || !order.date) {
        line2.appendChild(el("span", "m-ocal__row-placeholder", ""));
      }
      if (order.statusKey !== "") {
        var st = resolveStatus(order.statusKey);
        var schip = el(
          "span",
          "m-ocal__row-status m-ocal__row-status--" + st.tone,
          st.label
        );
        line2.appendChild(schip);
      }
      main.appendChild(line2);
      btn.appendChild(main);
      var chev = chevronIcon(state2.rtl ? "left" : "right", 20);
      chev.setAttribute("class", "m-ocal__row-chev");
      if (expanded) {
        chev.style.transform = "rotate(" + (state2.rtl ? "-90" : "90") + "deg)";
      }
      btn.appendChild(chev);
      li.appendChild(btn);
      li.appendChild(buildOrderPanel(order, domKey, expanded));
      return li;
    }
    function buildOrderPanel(order, domKey, expanded) {
      var panel = el("div", "m-ocal__rowpanel");
      panel.id = domKey + "-panel";
      panel.setAttribute("data-ocal-rowpanel", "");
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", domKey + "-trigger");
      if (!expanded) panel.hidden = true;
      panel.appendChild(el("p", "m-ocal__rowpanel-title", order.title));
      var dl = el("dl", "m-ocal__rowdetails");
      dl.appendChild(detailRow(
        L13("schedule.orderRow.date", dl),
        order.date ? dateNumeric(order.date) : L13("schedule.orderRow.unscheduled"),
        true
      ));
      dl.appendChild(detailRow(L13("schedule.orderRow.time", dl), order.time || "—", true));
      dl.appendChild(detailRow(L13("schedule.orderRow.customer", dl), order.customer || "—", false));
      if (order.statusKey !== "") {
        var st = resolveStatus(order.statusKey);
        var chip = el(
          "span",
          "m-ocal__row-status m-ocal__row-status--" + st.tone,
          st.label
        );
        dl.appendChild(detailRow(L13("schedule.orderRow.status", dl), chip, false));
      }
      if (order.note) {
        dl.appendChild(detailRow(L13("schedule.orderRow.note", dl), order.note, false));
      }
      panel.appendChild(dl);
      if (state2.orderActions.edit || state2.orderActions.delete) {
        panel.appendChild(buildOrderTools(order));
      }
      return panel;
    }
    function detailRow(label, value, ltr) {
      var div = el("div", "m-ocal__rowdetail");
      div.appendChild(el("dt", null, label));
      var dd = el("dd", null);
      if (ltr) {
        var b = el("bdi", "m-ocal__rowdetail-num", value);
        b.setAttribute("dir", "ltr");
        dd.appendChild(b);
      } else if (typeof value === "string") {
        dd.textContent = value;
      } else {
        dd.appendChild(value);
      }
      div.appendChild(dd);
      return div;
    }
    function buildOrderTools(order) {
      var row = el("div", "m-ocal__rowtools");
      if (state2.orderActions.edit) {
        var editBtn = el("button", "m-ocal__rowtool", L13("schedule.orderRow.edit", editBtn));
        editBtn.type = "button";
        editBtn.setAttribute("data-ocal-action", "order-edit");
        editBtn.setAttribute("data-ocal-id", order.id);
        row.appendChild(editBtn);
      }
      if (state2.orderActions.delete) {
        var delBtn = el("button", "m-ocal__rowtool m-ocal__rowtool--danger", L13("schedule.orderRow.delete", delBtn));
        delBtn.type = "button";
        delBtn.setAttribute("data-ocal-action", "order-delete");
        delBtn.setAttribute("data-ocal-id", order.id);
        row.appendChild(delBtn);
      }
      return row;
    }
    function buildRows(orders, showDate) {
      var ul = el("ul", "m-ocal__rows");
      for (var i = 0; i < orders.length; i++) {
        ul.appendChild(buildOrderRow(orders[i], !!showDate, i));
      }
      return ul;
    }
    function shortDateAr(iso) {
      return dateNumeric(iso);
    }
    function browsingMonthWithoutSelection() {
      var s = parseIso(state2.selectedDate);
      return !s || s.y !== state2.monthCursor.y || s.m !== state2.monthCursor.m;
    }
    function eventsTitleNodes(iso) {
      var title = el(hTag(), "m-ocal__daypanel-title");
      if (iso === state2.today) {
        title.textContent = L13("schedule.dayList.title", title);
        return title;
      }
      title.appendChild(document.createTextNode(L13("schedule.monthTitlePrefix", title)));
      var bdi = el("bdi", "m-ocal__daypanel-date", dateNumeric(iso));
      title.appendChild(bdi);
      return title;
    }
    function buildDayPanel(withTitle) {
      var panel = el("section", "m-ocal__daypanel");
      panel.setAttribute("data-ocal-day-panel", "");
      var head = el("div", "m-ocal__daypanel-head");
      if (withTitle && state2.calendarView === "month" && browsingMonthWithoutSelection()) {
        var y = state2.monthCursor.y;
        var m = state2.monthCursor.m;
        panel.setAttribute("data-ocal-day-browsing", "true");
        head.appendChild(el(
          hTag(),
          "m-ocal__daypanel-title",
          L13("schedule.dayList.noDayPrefix") + pad2(m) + " / " + yearText(y)
        ));
        head.appendChild(el(
          "p",
          "m-ocal__daypanel-count",
          countPhraseAr(ordersInMonth(y, m).length) + L13("schedule.dayList.noDaySuffix")
        ));
        head.appendChild(buildAddButton(null));
        panel.appendChild(head);
        return panel;
      }
      var iso = state2.selectedDate;
      var orders = sortedOrdersForDate(iso);
      if (withTitle) {
        head.appendChild(eventsTitleNodes(iso));
      }
      var count = el("p", "m-ocal__daypanel-count", String(orders.length));
      count.setAttribute("aria-label", countPhraseAr(orders.length));
      head.appendChild(count);
      head.appendChild(buildAddButton());
      panel.appendChild(head);
      if (orders.length) {
        panel.appendChild(buildRows(orders, false));
      } else {
        var empty = el("div", "m-ocal__daypanel-empty");
        empty.setAttribute("data-ocal-status", "empty");
        empty.setAttribute("role", "status");
        empty.appendChild(el("p", "m-ocal__status-text", L13("schedule.dayList.empty", empty)));
        panel.appendChild(empty);
      }
      return panel;
    }
    function buildCalCard(weekdays, grid, legend) {
      var card = el("div", "m-ocal__calcard");
      card.setAttribute("data-ocal-calcard", "");
      card.appendChild(weekdays);
      card.appendChild(grid);
      if (legend) card.appendChild(legend);
      return card;
    }
    function buildMonthScreen() {
      var screen = el("div", "m-ocal__screen");
      screen.setAttribute("data-ocal-screen", "calendar");
      screen.appendChild(buildControlsRow());
      screen.appendChild(buildCalBar(state2.monthCursor.y, state2.monthCursor.m));
      if (state2.pickerOpen) screen.appendChild(buildMonthPicker());
      var legend = buildLegend(ordersInMonth(state2.monthCursor.y, state2.monthCursor.m));
      screen.appendChild(buildCalCard(buildWeekdays(), buildMonthGrid(groupOrdersByDate()), legend));
      screen.appendChild(buildDayPanel(true));
      return screen;
    }
    function buildWeekScreen() {
      var screen = el("div", "m-ocal__screen");
      screen.setAttribute("data-ocal-screen", "calendar");
      screen.appendChild(buildControlsRow());
      var dates = weekDatesOf(state2.selectedDate) || weekDatesOf(state2.today);
      screen.appendChild(buildWeekBar(dates));
      var groups = groupOrdersByDate();
      var scope = [];
      for (var i = 0; i < dates.length; i++) {
        var iso = isoOf(dates[i].y, dates[i].m, dates[i].d);
        scope = scope.concat(groups[iso] || []);
      }
      screen.appendChild(buildCalCard(buildWeekdays(), buildWeekGrid(dates, groups), buildLegend(scope)));
      screen.appendChild(buildDayPanel(true));
      return screen;
    }
    function buildDayScreen() {
      var screen = el("div", "m-ocal__screen");
      screen.setAttribute("data-ocal-screen", "calendar");
      screen.appendChild(buildControlsRow());
      screen.appendChild(buildDayBar());
      screen.appendChild(buildDayPanel(false));
      return screen;
    }
    function buildDayBar() {
      var bar = el("div", "m-ocal__cal-bar");
      bar.appendChild(el(hTag(), "m-ocal__cal-title", dayTitleNumeric(state2.selectedDate)));
      bar.appendChild(buildNavActions("prev-day", "next-day"));
      return bar;
    }
    function buildListScreen() {
      var screen = el("div", "m-ocal__screen");
      screen.setAttribute("data-ocal-screen", "list");
      screen.appendChild(buildControlsRow());
      if (state2.orders.length === 0) {
        var empty = el("div", "m-ocal__status m-ocal__status--empty");
        empty.setAttribute("data-ocal-status", "empty");
        empty.setAttribute("role", "status");
        empty.appendChild(el("p", "m-ocal__status-text", L13("schedule.list.empty", empty)));
        empty.appendChild(buildAddButton());
        screen.appendChild(empty);
        return screen;
      }
      var legend = buildLegend(state2.orders);
      if (legend) screen.appendChild(legend);
      var top = el("div", "m-ocal__list-top");
      top.appendChild(buildAddButton());
      screen.appendChild(top);
      var buckets = listBuckets();
      var sec;
      sec = buildListSection(L13("schedule.list.upcoming", sec), buckets.upcoming);
      if (sec) screen.appendChild(sec);
      sec = buildListSection(L13("schedule.list.past", sec), buckets.past);
      if (sec) screen.appendChild(sec);
      sec = buildListSection(L13("schedule.list.unscheduled", sec), buckets.unsched);
      if (sec) screen.appendChild(sec);
      return screen;
    }
    function buildListSection(title, orders) {
      if (!orders.length) return null;
      var sec = el("section", "m-ocal__list-section");
      var head = el("div", "m-ocal__list-head");
      head.appendChild(el(hTag(), "m-ocal__list-heading", title));
      head.appendChild(el("p", "m-ocal__list-count", countPhraseAr(orders.length)));
      sec.appendChild(head);
      sec.appendChild(buildRows(orders, true));
      return sec;
    }
    function buildLoading() {
      var box = el("div", "m-ocal__status m-ocal__status--loading");
      box.setAttribute("data-ocal-status", "loading");
      box.setAttribute("role", "status");
      box.appendChild(el("p", "m-ocal__status-text", L13("schedule.loading", box)));
      return box;
    }
    function buildError() {
      var box = el("div", "m-ocal__status m-ocal__status--error");
      box.setAttribute("data-ocal-status", "error");
      box.setAttribute("role", "alert");
      box.appendChild(el("p", "m-ocal__status-text", L13("schedule.loadError", box)));
      var b = el("button", "m-ocal__retry");
      b.type = "button";
      b.setAttribute("data-ocal-action", "retry");
      b.textContent = L13("schedule.retry", b);
      box.appendChild(b);
      return box;
    }
    function focusDayCell(iso, doFocus) {
      var cell = root.querySelector('[data-ocal-date="' + iso + '"]');
      if (!cell) return false;
      var cells = [].slice.call(root.querySelectorAll(".m-ocal__cell[data-ocal-date]"));
      for (var i = 0; i < cells.length; i++) cells[i].tabIndex = -1;
      cell.tabIndex = 0;
      state2.focusDate = iso;
      if (doFocus) cell.focus();
      return true;
    }
    function moveFocus(fromIso, step) {
      var p = parseIso(fromIso);
      if (!p) return;
      var t = normalizeYmd(p.y, p.m, p.d + step);
      var iso = isoOf(t.y, t.m, t.d);
      if (t.y < 1 || t.y > 9999) return;
      if (t.y !== state2.monthCursor.y || t.m !== state2.monthCursor.m) {
        state2.monthCursor = { y: t.y, m: t.m };
        state2.focusDate = iso;
        render11();
      }
      focusDayCell(iso, true);
    }
    function moveRowEdge(fromIso, home) {
      var cell = root.querySelector('[data-ocal-date="' + fromIso + '"]');
      if (!cell) return;
      var row = cell.closest('[role="row"]');
      if (!row) return;
      var cells = row.querySelectorAll(".m-ocal__cell[data-ocal-date]");
      if (!cells.length) return;
      var target = home ? cells[0] : cells[cells.length - 1];
      focusDayCell(target.getAttribute("data-ocal-date"), true);
    }
    function onKeydown(e) {
      var t = e.target;
      if (state2.pickerOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          closePicker();
          return;
        }
        var monthOption = t && t.closest ? t.closest('[data-ocal-action="picker-month"]') : null;
        if (monthOption && root.contains(monthOption)) {
          var index = +monthOption.getAttribute("data-ocal-value");
          var delta = 0;
          if (e.key === "ArrowDown") delta = 4;
          else if (e.key === "ArrowUp") delta = -4;
          else if (e.key === "ArrowLeft") delta = state2.rtl ? 1 : -1;
          else if (e.key === "ArrowRight") delta = state2.rtl ? -1 : 1;
          else if (e.key === "Home") index = 0;
          else if (e.key === "End") index = 11;
          else return;
          e.preventDefault();
          index = Math.max(0, Math.min(11, index + delta));
          refocus('[data-ocal-action="picker-month"][data-ocal-value="' + index + '"]');
        }
        return;
      }
      if (state2.view !== "calendar") return;
      var seg = t && t.closest ? t.closest('[data-ocal-action="view"][role="tab"]') : null;
      if (seg && root.contains(seg)) {
        var segs = [].slice.call(root.querySelectorAll('.m-ocal__viewseg [data-ocal-action="view"]'));
        var at = segs.indexOf(seg);
        if (at !== -1 && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          e.preventDefault();
          var stepSeg = e.key === "ArrowLeft" ? state2.rtl ? -1 : 1 : state2.rtl ? 1 : -1;
          var next3 = segs[Math.max(0, Math.min(segs.length - 1, at + stepSeg))];
          if (next3 && next3 !== seg) next3.click();
          else seg.focus();
        }
        return;
      }
      var cell = t && t.closest ? t.closest(".m-ocal__cell[data-ocal-date]") : null;
      if (!cell || !root.contains(cell)) return;
      var k = e.key;
      var fromIso = cell.getAttribute("data-ocal-date");
      if (state2.calendarView === "week") {
        var step = 0;
        if (k === "ArrowLeft" || k === "ArrowRight") {
          e.preventDefault();
          step = k === "ArrowLeft" ? 1 : -1;
          if (!state2.rtl) step = -step;
        } else if (k === "ArrowDown") {
          e.preventDefault();
          step = 7;
        } else if (k === "ArrowUp") {
          e.preventDefault();
          step = -7;
        } else if (k === "Home" || k === "End") {
          e.preventDefault();
          var dates = weekDatesOf(state2.selectedDate);
          if (dates) {
            var edge = k === "Home" ? dates[0] : dates[6];
            selectDate(isoOf(edge.y, edge.m, edge.d), true);
          }
          return;
        } else {
          return;
        }
        var p = parseIso(fromIso);
        if (!p) return;
        var tt = normalizeYmd(p.y, p.m, p.d + step);
        selectDate(isoOf(tt.y, tt.m, tt.d), true);
        return;
      }
      if (state2.calendarView !== "month") return;
      if (k === "ArrowLeft" || k === "ArrowRight") {
        e.preventDefault();
        var stepm = k === "ArrowLeft" ? 1 : -1;
        if (!state2.rtl) stepm = -stepm;
        moveFocus(fromIso, stepm);
      } else if (k === "ArrowDown") {
        e.preventDefault();
        moveFocus(fromIso, 7);
      } else if (k === "ArrowUp") {
        e.preventDefault();
        moveFocus(fromIso, -7);
      } else if (k === "Home") {
        e.preventDefault();
        moveRowEdge(fromIso, true);
      } else if (k === "End") {
        e.preventDefault();
        moveRowEdge(fromIso, false);
      }
    }
    function refocus(sel) {
      var elm = root.querySelector(sel);
      if (elm && typeof elm.focus === "function") elm.focus();
    }
    function refocusOrderRow(id) {
      var rows = root.querySelectorAll('[data-ocal-action="order-row"]');
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].getAttribute("data-ocal-id") === id) {
          rows[i].focus();
          return;
        }
      }
    }
    function selectDate(iso, fromUser) {
      if (!parseIso(iso)) return;
      state2.selectedDate = iso;
      var p = parseIso(iso);
      if (p.y !== state2.monthCursor.y || p.m !== state2.monthCursor.m) {
        state2.monthCursor = { y: p.y, m: p.m };
      }
      state2.focusDate = iso;
      render11();
      if (fromUser) emit("order-schedule:day-select", { date: iso });
      refocus('[data-ocal-date="' + iso + '"]');
    }
    function shiftMonthCursor(delta) {
      var nm = shiftMonth(state2.monthCursor.y, state2.monthCursor.m, delta);
      if (nm.y < 1 || nm.y > 9999) return;
      state2.monthCursor = { y: nm.y, m: nm.m };
      var focused = parseIso(state2.focusDate);
      var day = focused ? Math.min(focused.d, daysInMonth(nm.y, nm.m)) : 1;
      state2.focusDate = isoOf(nm.y, nm.m, day);
      state2.monthFade = true;
      render11();
    }
    function openPicker() {
      state2.pickerOpen = true;
      state2.pickerYear = state2.monthCursor.y;
      render11();
      attachDocEscape();
      refocus('[data-ocal-action="picker-month"][data-ocal-value="' + (state2.monthCursor.m - 1) + '"]');
    }
    function attachDocEscape() {
      if (docEscapeRef) return;
      docEscapeRef = function(ev) {
        if (destroyed || !state2.pickerOpen) return;
        if (ev.key === "Escape") {
          ev.preventDefault();
          closePicker();
        }
      };
      document.addEventListener("keydown", docEscapeRef, false);
      listeners.push({ el: document, type: "keydown", fn: docEscapeRef });
    }
    function detachDocEscape() {
      if (!docEscapeRef) return;
      document.removeEventListener("keydown", docEscapeRef, false);
      for (var i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i].fn === docEscapeRef) listeners.splice(i, 1);
      }
      docEscapeRef = null;
    }
    function onRootFocusOut(e) {
      if (!state2.pickerOpen) return;
      var to = e.relatedTarget;
      if (to && root.contains(to)) return;
      if (to) {
        closePicker(false);
        return;
      }
      Promise.resolve().then(function() {
        if (destroyed || !state2.pickerOpen) return;
        var active = document.activeElement;
        if (active && active !== root && root.contains(active)) return;
        if (active === root) return;
        closePicker(false);
      });
    }
    function closePicker(restoreFocus) {
      if (!state2.pickerOpen) return;
      state2.pickerOpen = false;
      detachDocEscape();
      render11();
      if (restoreFocus !== false) refocus('[data-ocal-action="month-picker"]');
    }
    function changePickerYear(delta) {
      state2.pickerYear = Math.max(1, Math.min(9999, state2.pickerYear + delta));
      render11();
      refocus('[data-ocal-action="picker-' + (delta < 0 ? "prev" : "next") + '-year"]');
    }
    function choosePickerMonth(month) {
      var m = +month + 1;
      if (m < 1 || m > 12) return;
      state2.monthCursor = { y: state2.pickerYear, m };
      var selected = parseIso(state2.selectedDate);
      if (!selected || selected.y !== state2.pickerYear || selected.m !== m) {
        state2.focusDate = isoOf(state2.pickerYear, m, 1);
      } else {
        state2.focusDate = state2.selectedDate;
      }
      closePicker();
    }
    function gotoToday() {
      state2.selectedDate = state2.today;
      state2.focusDate = state2.today;
      var p = parseIso(state2.today);
      state2.monthCursor = { y: p.y, m: p.m };
      render11();
      emit("order-schedule:day-select", { date: state2.today });
    }
    function shiftDay(delta) {
      var p = parseIso(state2.selectedDate);
      if (!p) return;
      var t = normalizeYmd(p.y, p.m, p.d + delta);
      var iso = isoOf(t.y, t.m, t.d);
      if (t.y < 1 || t.y > 9999) return;
      state2.selectedDate = iso;
      state2.focusDate = iso;
      state2.monthCursor = { y: t.y, m: t.m };
      render11();
      emit("order-schedule:day-select", { date: iso });
    }
    function onClick(e) {
      var t = e.target;
      var btn = t && t.closest ? t.closest("[data-ocal-action]") : null;
      if (!btn || !root.contains(btn)) return;
      var act = btn.getAttribute("data-ocal-action");
      if (act === "day-cell") {
        selectDate(btn.getAttribute("data-ocal-date"), true);
      } else if (act === "order-row") {
        var rowId = btn.getAttribute("data-ocal-id");
        if (state2.expandedId === rowId) {
          state2.expandedId = null;
        } else {
          state2.expandedId = rowId;
          emit("order-schedule:order-open", { id: rowId });
        }
        render11();
        refocusOrderRow(rowId);
      } else if (act === "mode-toggle") {
        state2.pickerOpen = false;
        state2.view = state2.view === "list" ? "calendar" : "list";
        render11();
        updateResponsiveView(root.getBoundingClientRect().width);
        refocus('[data-ocal-action="mode-toggle"]');
      } else if (act === "order-edit") {
        emit("order-schedule:order-edit-request", { id: btn.getAttribute("data-ocal-id") });
        refocusOrderRow(btn.getAttribute("data-ocal-id"));
      } else if (act === "order-delete") {
        emit("order-schedule:order-delete-request", { id: btn.getAttribute("data-ocal-id") });
        refocusOrderRow(btn.getAttribute("data-ocal-id"));
      } else if (act === "add") {
        var addDate = btn.getAttribute("data-ocal-add-date");
        emit("order-schedule:add-request", { date: addDate || null });
      } else if (act === "retry") {
        if (typeof state2.errorRetry === "function") state2.errorRetry();
      } else if (act === "view") {
        state2.pickerOpen = false;
        var seg = btn.getAttribute("data-ocal-value");
        if (seg === "list") {
          state2.view = "list";
        } else if (seg === "day" || seg === "week" || seg === "month") {
          state2.view = "calendar";
          state2.calendarView = seg;
          if (seg === "week") state2.focusDate = state2.selectedDate;
        } else {
          state2.view = seg === "list" ? "list" : "calendar";
        }
        render11();
        updateResponsiveView(root.getBoundingClientRect().width);
        var selectedSeg = root.querySelector('[data-ocal-action="view"][aria-selected="true"]');
        if (selectedSeg) selectedSeg.focus();
        else refocus('[data-ocal-action="view"]');
      } else if (act === "cal-mode") {
        state2.pickerOpen = false;
        var cm = btn.getAttribute("data-ocal-value");
        state2.calendarView = cm === "day" || cm === "week" ? cm : "month";
        render11();
        updateResponsiveView(root.getBoundingClientRect().width);
        refocus('[data-ocal-action="cal-mode"]');
      } else if (act === "prev-month") {
        shiftMonthCursor(-1);
        refocus('[data-ocal-action="prev-month"]');
      } else if (act === "next-month") {
        shiftMonthCursor(1);
        refocus('[data-ocal-action="next-month"]');
      } else if (act === "prev-week") {
        shiftDay(-7);
        refocus('[data-ocal-action="prev-week"]');
      } else if (act === "next-week") {
        shiftDay(7);
        refocus('[data-ocal-action="next-week"]');
      } else if (act === "today") {
        gotoToday();
        refocus('[data-ocal-action="today"]');
      } else if (act === "month-picker") {
        if (state2.pickerOpen) closePicker();
        else openPicker();
      } else if (act === "picker-back") {
        closePicker();
      } else if (act === "picker-prev-year") {
        changePickerYear(-1);
      } else if (act === "picker-next-year") {
        changePickerYear(1);
      } else if (act === "picker-month") {
        choosePickerMonth(btn.getAttribute("data-ocal-value"));
      } else if (act === "prev-day") {
        shiftDay(-1);
        refocus('[data-ocal-action="prev-day"]');
      } else if (act === "next-day") {
        shiftDay(1);
        refocus('[data-ocal-action="next-day"]');
      }
    }
    on5(root, "keydown", userAction(onKeydown));
    on5(root, "click", userAction(onClick));
    on5(root, "focusout", guard(onRootFocusOut));
    if (typeof MutationObserver === "function") {
      dirObserver = new MutationObserver(function() {
        if (destroyed) return;
        var rtl = true;
        try {
          var d = window.getComputedStyle(root).direction;
          if (d === "ltr") rtl = false;
        } catch (err) {
        }
        if (rtl !== state2.rtl) {
          state2.rtl = rtl;
          render11();
        }
      });
      dirObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    }
    withLabels18(root, function() {
      render11();
    });
    observeResponsiveWidth();
    return {
      root,
      getState: guard(getState),
      /* العقد الموحد (الجولة الثانية R4): update(orders) = setData نفسها —
         تحديث كامل بلا إعادة تهيئة. */
      update: guard(function(orders) {
        state2.orders = normalizeOrders(orders);
        if (state2.expandedId !== null) {
          var stillThere = false;
          for (var i = 0; i < state2.orders.length; i++) {
            if (state2.orders[i].id === state2.expandedId) {
              stillThere = true;
              break;
            }
          }
          if (!stillThere) state2.expandedId = null;
        }
        state2.loading = false;
        state2.errorRetry = null;
        render11();
      }),
      setDisplayedMonth: guard(function(month) {
        var p = parseIso(typeof month === "string" ? month + "-01" : null);
        if (!p) return;
        state2.monthCursor = { y: p.y, m: p.m };
        var focused = parseIso(state2.focusDate);
        state2.focusDate = isoOf(p.y, p.m, focused ? Math.min(focused.d, daysInMonth(p.y, p.m)) : 1);
        state2.pickerOpen = false;
        render11();
      }),
      /* تحديث كامل بلا إعادة تهيئة؛ يحفظ selected/view/c-calendar إن
         بقيت صالحة، ويمسح حالتي الانتظار/الخطأ (آخر كتابة تفوز).
         عقد 2026-10-26: حذف الطلب المفتوح من البيانات يطويه بصدق */
      setData: guard(function(orders) {
        state2.orders = normalizeOrders(orders);
        if (state2.expandedId !== null) {
          var stillThere = false;
          for (var i = 0; i < state2.orders.length; i++) {
            if (state2.orders[i].id === state2.expandedId) {
              stillThere = true;
              break;
            }
          }
          if (!stillThere) state2.expandedId = null;
        }
        state2.loading = false;
        state2.errorRetry = null;
        render11();
      }),
      /* ضبط صامت (بلا أحداث) — الأحداث لأفعال المستخدم فقط (موثق) */
      setSelectedDate: guard(function(date) {
        if (!parseIso(date)) return;
        state2.selectedDate = date;
        state2.focusDate = date;
        var p = parseIso(date);
        state2.monthCursor = { y: p.y, m: p.m };
        render11();
      }),
      setView: guard(function(v) {
        if (v === "calendar" || v === "list") {
          state2.pickerOpen = false;
          state2.view = v;
          render11();
          updateResponsiveView(root.getBoundingClientRect().width);
        }
      }),
      setCalendarView: guard(function(v) {
        if (v === "month" || v === "week" || v === "day") {
          state2.pickerOpen = false;
          state2.calendarView = v;
          if (v === "week") state2.focusDate = state2.selectedDate;
          render11();
          updateResponsiveView(root.getBoundingClientRect().width);
        }
      }),
      setLoading: guard(function(flag) {
        state2.loading = !!flag;
        if (state2.loading) state2.errorRetry = null;
        render11();
      }),
      /* setError(cb): cb مسؤولية المستهلك — زر «إعادة المحاولة»
         يستدعيه فقط ولا يعيد المكوّن التحميل بنفسه؛ setError(null)
         يزيل حالة الخطأ (موثق). يمسح حالة الانتظار لأنه الأحدث */
      setError: guard(function(retryCallback) {
        state2.errorRetry = typeof retryCallback === "function" ? retryCallback : null;
        if (state2.errorRetry) state2.loading = false;
        render11();
      }),
      /* ينزع كل مستمع (المصفوفة أعلاه) ويفصل مراقبي dir/العرض ويعيد
         الجذر لسمة غير مهيأة — بعده لا أحداث إطلاقًا. R-27 (2026-10-25):
         تُزال أيضًا سمات العقد المتبقية (layout/compact/selected-date)
         فلا تُقرأ بحالة ما بعد الدمار */
      destroy: guard(function() {
        destroyed = true;
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
        resizeFrame = 0;
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        if (dirObserver) {
          dirObserver.disconnect();
          dirObserver = null;
        }
        if (resizeFallback) {
          window.removeEventListener("resize", resizeFallback, false);
          resizeFallback = null;
        }
        for (var i = listeners.length - 1; i >= 0; i--) {
          var L22 = listeners[i];
          L22.el.removeEventListener(L22.type, L22.fn, false);
        }
        listeners.length = 0;
        docEscapeRef = null;
        root.textContent = "";
        root.classList.remove("m-ocal");
        root.removeAttribute("data-ocal-root");
        root.removeAttribute("data-ocal-init");
        root.removeAttribute("data-ocal-view");
        root.removeAttribute("data-ocal-cal-view");
        root.removeAttribute("data-ocal-auto-view");
        root.removeAttribute("data-ocal-layout");
        root.removeAttribute("data-ocal-compact");
        root.removeAttribute("data-ocal-selected-date");
        instances8.delete(root);
      })
    };
  }
  function getInstance18(root) {
    return root && instances8.get(root) || null;
  }
  function destroy18(root) {
    var inst = root && instances8.get(root) || null;
    if (inst) inst.destroy();
  }
  function update7(root, orders) {
    var inst = root && instances8.get(root) || null;
    if (inst) inst.setData(orders);
    return inst;
  }
  function setLabels17(partial) {
    setLabels("order-schedule", partial);
  }

  // components/compositions/reading-context.js
  var reading_context_exports = {};
  __export(reading_context_exports, {
    destroy: () => destroy19,
    disconnect: () => disconnect17,
    getInstance: () => getInstance19,
    init: () => init19,
    sync: () => sync2,
    update: () => sync2
  });
  var CLASS = "m-reading-unit--contextual";
  function within(root) {
    var out = [].slice.call(root.querySelectorAll("[data-reading-unit]"));
    if (root.matches && root.matches("[data-reading-unit]")) out.unshift(root);
    return out;
  }
  function visible(el2) {
    if (!el2 || !el2.isConnected || el2.closest("[hidden], [inert]")) return false;
    var rect = el2.getBoundingClientRect();
    if (!el2.getClientRects().length || rect.width <= 1 || rect.height <= 1) return false;
    for (var node2 = el2; node2; node2 = node2.parentElement) {
      var style = getComputedStyle(node2);
      if (style.visibility === "hidden" || style.visibility === "collapse" || style.display === "none" || Number(style.opacity) === 0 || style.clipPath !== "none" || style.clip !== "auto" || style.textOverflow === "ellipsis") return false;
      var clipsX = /^(hidden|clip|auto|scroll)$/.test(style.overflowX);
      var clipsY = /^(hidden|clip|auto|scroll)$/.test(style.overflowY);
      var bounds = node2.getBoundingClientRect();
      if (clipsX && (rect.left < bounds.left - 1 || rect.right > bounds.right + 1) || clipsY && (rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1)) return false;
      if (node2 === el2 && (clipsX && el2.scrollWidth > el2.clientWidth || clipsY && el2.scrollHeight > el2.clientHeight)) return false;
    }
    return !el2.checkVisibility || el2.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  }
  function visibleText(el2) {
    var walker = el2.ownerDocument.createTreeWalker(el2, NodeFilter.SHOW_TEXT);
    var text2 = "", node2;
    while (node2 = walker.nextNode()) {
      if (node2.nodeValue.trim() && visible(node2.parentElement)) text2 += node2.nodeValue;
      else if (!node2.nodeValue.trim()) text2 += node2.nodeValue;
    }
    return text2;
  }
  function mentionsUnit(text2, unit) {
    var word = /[\p{L}\p{M}\p{N}_]/u;
    var chars = Array.from(unit), startWord = word.test(chars[0]), endWord = word.test(chars[chars.length - 1]);
    var offset = text2.indexOf(unit);
    while (offset >= 0) {
      var before = Array.from(text2.slice(0, offset)).pop() || "";
      var after = Array.from(text2.slice(offset + unit.length))[0] || "";
      if ((!startWord || !word.test(before)) && (!endWord || !word.test(after))) return true;
      offset = text2.indexOf(unit, offset + unit.length);
    }
    return false;
  }
  function contextFor(el2) {
    var group = el2.closest("[data-reading-context]");
    if (!group) return null;
    var unit = el2.getAttribute("data-reading-unit");
    var common = group.getAttribute("data-unit") || group.getAttribute("data-common-unit") || "";
    var label = group.ownerDocument.getElementById(group.getAttribute("data-reading-context"));
    if (!unit || unit !== common || label === el2 || label && el2.contains(label) || !visible(label) || !mentionsUnit(visibleText(label), unit)) return null;
    if (within(group).some(function(node2) {
      return node2.closest("[data-reading-context]") === group && node2.getAttribute("data-reading-unit") !== common;
    })) return null;
    return label;
  }
  function sync2(root) {
    within(root || document).forEach(function(el2) {
      el2.classList.toggle(CLASS, !!contextFor(el2));
    });
  }
  function disconnect17(root) {
    destroy19(root);
  }
  function teardown17(root) {
    within(root || document).forEach(function(el2) {
      el2.classList.remove(CLASS);
    });
  }
  var registry12 = instanceRegistry();
  function applyInstanceLabels18() {
  }
  function withLabels19(scope, fn) {
    return fn();
  }
  function init19(root, options) {
    var scope = root || document;
    applyInstanceLabels18(scope, options);
    var existing = registry12.get(scope);
    if (existing) {
      withLabels19(scope, function() {
        sync2(scope);
      });
      return existing;
    }
    var destroyed = false;
    var instance = {
      root: scope,
      /** = sync: مزامنة أصناف سياق الوحدة من DOM الحالي. */
      update: function() {
        withLabels19(scope, function() {
          sync2(scope);
        });
      },
      /** ينزع أصناف السياق فقط — لا مستمعات أصلا في C04. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown17(scope);
        registry12.remove(scope);
      }
    };
    withLabels19(scope, function() {
      sync2(scope);
    });
    registry12.set(scope, instance);
    return instance;
  }
  function getInstance19(root) {
    return registry12.get(root);
  }
  function destroy19(root) {
    var instance = registry12.get(root);
    if (instance) instance.destroy();
    else teardown17(root || document);
  }

  // tools/package/.build-entries/product-aggregate.mjs
  var product_aggregate_exports = {};
  __export(product_aggregate_exports, {
    contextKey: () => contextKey,
    destroy: () => destroy20,
    getInstance: () => getInstance20,
    init: () => init20,
    mount: () => mount,
    register: () => register,
    setLabels: () => setLabels18
  });

  // components/product-context/labels.js
  var defaults13 = {
    "phase.loading": "جارٍ التحميل…",
    "phase.empty": "لا توجد بيانات بعد",
    "phase.success": "تمت العملية",
    "phase.error": "تعذّر إكمال الطلب",
    "phase.rejected": "لم يُقبل الطلب",
    "phase.disabled": "الإجراء غير متاح حاليًا",
    "phase.pending": "بانتظار نتيجة مؤكدة",
    "phase.uncertain": "النتيجة غير مؤكدة؛ تحقق قبل إعادة الإرسال",
    "phase.denied": "لا تتوفر صلاحية لهذا السياق",
    "phase.expired": "انتهت الجلسة",
    "phase.signedOut": "يلزم تسجيل الدخول",
    "phase.conflict": "تغيّرت البيانات؛ راجع النسخة الأحدث",
    "confirm.missingComponent": "يلزم تحميل مكوّن التأكيد",
    "confirm.title": "تأكيد الإجراء",
    "confirm.cancel": "تراجع",
    "confirm.ok": "تأكيد",
    "form.requiredFields": "أكمل الحقول المطلوبة",
    "form.missingFieldPrefix": "أدخل ",
    "form.missingFieldFallback": "القيمة المطلوبة",
    "media.unavailable": "لا توجد صورة متاحة",
    "media.carouselLabel": "صور المرفقات",
    "media.cardLabelPrefix": "صورة ",
    "media.imageAltFallback": "صورة المرفق",
    "media.imageError": "تعذّر عرض الصورة",
    "media.linkUnavailable": "رابط الصورة غير متاح",
    "media.prev": "السابق",
    "media.next": "التالي",
    "attachments.label": "الصور",
    "attachments.addMore": "إضافة صور",
    "attachments.replaceSelection": "استبدال الاختيار",
    "attachments.choose": "اختيار الصور",
    "attachments.fileError": "تعذّر استخدام الملف",
    "attachments.fileErrorDetail": "نوع الصورة أو حجمها لا يطابق القيد المقدم.",
    "attachments.remove": "إزالة",
    "attachments.removeAriaPrefix": "إزالة ",
    "attachments.removeAll": "إزالة المرفقات",
    "attachments.requiredNotice": "أرفق صورة للمتابعة.",
    "shell.previousContextHidden": "بيانات السياق السابق غير معروضة.",
    "shell.reauth": "متابعة الدخول",
    "shell.chooseContext": "اختيار سياق آخر",
    "shell.noScopeTitle": "اختر سياقًا معتمدًا",
    "shell.noScopeDetail": "لا تُعرض بيانات خاصة قبل تحديد السياق.",
    "shell.driverScopeTitle": "هذه الوجهة غير متاحة في سياق السائق",
    "shell.driverScopeDetail": "المتاح للسائق Delivery وAsk Micro فقط.",
    "shell.noPermission": "لا يمكنك عرض هذه البيانات في السياق الحالي",
    "connection.offline": "الاتصال منقطع",
    "connection.local": "وضع محلي",
    "connection.weak": "الاتصال ضعيف",
    "connection.manageNotice": "الكتابة متاحة أثناء الاتصال فقط؛ لا طابور مزامنة (المرحلة 8 — توافق Online-only).",
    "connection.genericNotice": "العمليات التي تحتاج الاتصال غير متاحة الآن.",
    "stateCard.recheck": "إعادة التحقق",
    "context.accountFallback": "حساب Micro",
    "context.unavailableTitle": "السياق غير متاح",
    "context.unavailableDetail": "لا يمكن اختيار سياق الآن.",
    "context.invalidListTitle": "قائمة السياقات غير صالحة",
    "context.selectLabel": "الدور والمنشأة",
    "context.destination.manage": "Manage · الإدارة",
    "context.destination.market": "Market · السوق",
    "context.destination.delivery": "Delivery · التوصيل",
    "context.navLabel": "وجهات Micro المصرح بها",
    "context.noDestinationsTitle": "لا وجهات متاحة",
    "context.noDestinationsDetail": "اختر سياقًا آخر للمتابعة.",
    "delivery.title": "طلب توصيل",
    "delivery.pickup": "الاستلام",
    "delivery.dropoff": "التسليم",
    "common.unavailable": "(غير متاح)",
    "delivery.addressesUnavailable": "تفاصيل المواقع غير متاحة لهذا السياق",
    "delivery.pickupField": "موقع الاستلام",
    "delivery.dropoffField": "موقع التسليم",
    "delivery.noteField": "تفاصيل الطلب",
    "delivery.requestAction": "إرسال طلب توصيل",
    "delivery.requestConfirm": "سيُرسل طلب التوصيل بالبيانات المدخلة.",
    "common.unitFallback": "(الوحدة غير محددة)",
    "delivery.validityFallback": "مهلة العرض غير متاحة",
    "delivery.quote.accept": "قبول العرض",
    "delivery.quote.decline": "رفض العرض",
    "delivery.quote.assign": "طلب إسناد للسائق",
    "delivery.quote.confirmPrefix": "تأكيد العرض كما ورد: ",
    "common.unavailablePlain": "غير متاح",
    "delivery.change.current": "البيانات الحالية",
    "delivery.change.proposed": "التعديل المقترح",
    "delivery.partyStatusFallback": "القرار غير متاح",
    "delivery.change.requestAction": "طلب موافقة على التعديل",
    "delivery.change.confirm": "هذا طلب موافقة؛ لا يعتمد التعديل أو يغيّر الطلب من جهة واحدة.",
    "delivery.proof.noteField": "ملاحظة الإثبات",
    "delivery.proof.returnAction": "إرسال إثبات إرجاع",
    "delivery.proof.deliveryAction": "إرسال إثبات تسليم",
    "delivery.proof.attachmentRequired": "أرفق الإثبات المطلوب",
    "delivery.proof.confirm": "سيُرسل الإثبات للمراجعة؛ لا يعني ذلك اكتمال التسليم أو الإرجاع.",
    "delivery.updateStatusAction": "تحديث الحالة",
    "market.editorTitle": "بيانات الإعلان",
    "market.searchTitle": "بحث السوق",
    "market.listingTitle": "إعلان",
    "market.searchField": "البحث",
    "market.searchAction": "عرض النتائج",
    "market.titleField": "عنوان الإعلان",
    "market.descriptionField": "الوصف",
    "market.priceField": "السعر",
    "market.priceUnitFallback": "الوحدة غير محددة",
    "market.publishAction": "إرسال للنشر",
    "market.saveDraftAction": "حفظ المسودة",
    "market.publishConfirmPrefix": "إرسال ",
    "market.publishConfirmPrice": " بسعر ",
    "common.unitFallback": "(الوحدة غير محددة)",
    "market.reviewNoteTitle": "ملاحظة المراجعة",
    "market.editAction": "تعديل",
    "market.reportAction": "الإبلاغ عن الإعلان",
    "market.reportConfirm": "إرسال طلب بلاغ؛ التصنيف والمراجعة وفق قواعد المنتج المعتمدة.",
    "operation.title": "حالة العملية",
    "operation.referencePrefix": "مرجع الطلب: ",
    "operation.actions.recheck": "إعادة التحقق",
    "operation.actions.retry": "إعادة المحاولة",
    "assistant.logLabel": "رسائل المحادثة",
    "assistant.userSpeaker": "أنت",
    "assistant.noteSpeaker": "ملاحظة",
    "assistant.retryAction": "إعادة المحاولة",
    "assistant.proposalExpired": "انتهت صلاحية الاقتراح",
    "assistant.proposalCompleted": "تم تنفيذ الإجراء",
    "assistant.proposalUnavailable": "الإجراء غير متاح",
    "assistant.emptyLog": "ابدأ محادثة في السياق الحالي",
    "assistant.searchingStatus": "جارٍ البحث…",
    "assistant.preparingStatus": "جارٍ إعداد الرد…",
    "assistant.newMessagesAction": "رسائل جديدة",
    "assistant.proposalTitle": "إجراء مقترح",
    "assistant.proposalActionFallback": "مراجعة وتأكيد الإجراء",
    "assistant.messageField": "رسالتك",
    "assistant.sendAction": "إرسال",
    "review.reportTitle": "إرسال بلاغ",
    "review.itemTitle": "عنصر للمراجعة",
    "review.reasonField": "سبب البلاغ",
    "review.categoryField": "التصنيف",
    "review.submitAction": "إرسال البلاغ",
    "review.submitConfirm": "سيُرسل البلاغ للمراجعة.",
    "review.reasonTitle": "سبب أو ملاحظة",
    "review.attachmentsRestricted": "المرفقات مقيدة حسب الصلاحية",
    "review.decisionNoteField": "ملاحظة القرار",
    "review.approveAction": "قبول",
    "review.rejectAction": "رفض",
    "review.requestInfoAction": "طلب معلومات",
    "review.decisionConfirmPrefix": "مراجعة قرار ",
    "review.decisionConfirmOn": " على ",
    "review.subjectFallback": "هذا العنصر",
    "manage.title": "سجل العمليات",
    "manage.summaryTitle": "ملخص الفترة",
    "manage.listTitle": "العمليات",
    "manage.formTitle": "عملية جديدة",
    "manage.amountField": "المبلغ",
    "manage.typeField": "النوع",
    "manage.type.sale": "مبيعات",
    "manage.type.expense": "مصاريف",
    "manage.dateField": "التاريخ",
    "manage.noteField": "الملاحظة",
    "manage.submitAction": "إضافة العملية",
    "manage.clearAction": "تفريغ الحقول",
    "manage.emptyList": "لا عمليات في هذه الفترة",
    "manage.submitConfirm": "سيُرسل إدخال العملية كما هو؛ لا يُسجَّل مبلغ قبل تأكيد الخادم.",
    "market.resultsTitle": "النتائج",
    "market.noAdsTitle": "لا توجد إعلانات",
    "market.noAdsDetail": "المصدر لا يضم إعلانات معروضة حاليًا.",
    "market.noResultsTitle": "لا نتائج لهذا البحث",
    "market.noResultsDetail": "عدّل كلمات البحث أو الفلاتر ثم أعد المحاولة.",
    "review.queueTitle": "قائمة المراجعة",
    "review.kind.listing": "إعلان",
    "review.kind.flag": "بلاغ",
    "review.kind.driverApplication": "طلب سائق",
    "review.emptyQueue": "لا عناصر في القائمة"
  };

  // components/product-context/product-core.js
  registerLabels("product-context", defaults13);
  var MICRO_LABELS_FAMILY17 = "product-context";
  function L14(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY17) || currentInstanceLabels(MICRO_LABELS_FAMILY17);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY17, key2);
  }
  function withLabels20(scope, fn) {
    return withLabels2(scope, MICRO_LABELS_FAMILY17, fn);
  }
  function applyInstanceLabels19(scope, options) {
    if (options && options.labels && typeof options.labels === "object") {
      setInstanceLabels(scope, MICRO_LABELS_FAMILY17, options.labels);
    }
  }
  var renderers = /* @__PURE__ */ new Map();
  var instances9 = /* @__PURE__ */ new WeakMap();
  var sequence = 0;
  var phases = {
    ready: "",
    loading: L14("phase.loading"),
    empty: L14("phase.empty"),
    success: L14("phase.success"),
    error: L14("phase.error"),
    rejected: L14("phase.rejected"),
    disabled: L14("phase.disabled"),
    pending: L14("phase.pending"),
    uncertain: L14("phase.uncertain"),
    denied: L14("phase.denied"),
    expired: L14("phase.expired"),
    "signed-out": L14("phase.signedOut"),
    conflict: L14("phase.conflict")
  };
  function key(scope) {
    return scope && typeof scope.contextId === "string" && scope.contextId && typeof scope.roleId === "string" && scope.roleId && (scope.workspaceId == null || typeof scope.workspaceId === "string" && scope.workspaceId) ? JSON.stringify([scope.contextId, scope.workspaceId || null, scope.roleId, scope.kind || "business"]) : null;
  }
  function copy(value) {
    return structuredClone(value);
  }
  function draftOwner(value) {
    return value ? JSON.stringify([value.mode || null, value.id == null ? null : value.id, value.draftKey || null]) : null;
  }
  function visibilityRevoked(before, after) {
    return !!before && ["addresses", "contact", "evidence"].some(function(name) {
      return before.visibility && before.visibility[name] === true && !(after.visibility && after.visibility[name] === true);
    });
  }
  function node(tag, cls, text2) {
    var el2 = document.createElement(tag);
    if (cls) el2.className = cls;
    if (text2 !== void 0 && text2 !== null) el2.textContent = String(text2);
    return el2;
  }
  function note(parent, title, body, tone) {
    var el2 = node("section", "m-note m-note--" + (tone || "info"));
    el2.setAttribute("role", tone === "error" ? "alert" : "status");
    var text2 = node("div", "m-note__text");
    text2.appendChild(node("strong", "m-note__title", title));
    if (body) text2.appendChild(node("p", "m-note__body", body));
    el2.appendChild(text2);
    parent.appendChild(el2);
    return el2;
  }
  function safeImage(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      var url = new URL(String(value), document.baseURI);
      return ["http:", "https:", "blob:"].indexOf(url.protocol) >= 0 || /^data:image\/(png|jpeg|webp|gif);/i.test(url.href) ? url.href : null;
    } catch (_) {
      return null;
    }
  }
  function register(type8, renderer) {
    if (renderers.has(type8)) throw new Error("Duplicate composition");
    renderers.set(type8, renderer);
  }
  function contextKey(scope) {
    return key(scope);
  }
  function mount(root, type8, value) {
    if (!root || root.nodeType !== 1 || !renderers.has(type8)) throw new TypeError("Unknown product composition or invalid root");
    if (instances9.has(root)) {
      var old = instances9.get(root);
      if (old.type !== type8) throw new TypeError("One DOM owner per root");
      return old.api;
    }
    var model, epoch = 0, requestNumber = 0, pending = null, destroyed = false;
    var rendererLife, cleanups = [], confirmation = null, suppressFocus = false;
    var ui = { draft: /* @__PURE__ */ Object.create(null), files: [], urls: [], presentation: /* @__PURE__ */ Object.create(null), presentationGeneration: 0 };
    var instanceId = "micro-product-" + ++sequence;
    var forbidden = ["denied", "expired", "signed-out"];
    function disposeConfirmation() {
      if (!confirmation) return;
      var current = confirmation;
      confirmation = null;
      current.life.abort();
      globalApi("ActionSheet").disconnect(current.sheet);
      current.sheet.remove();
      current.backdrop.remove();
    }
    function releaseFiles() {
      ui.urls.forEach(function(url) {
        URL.revokeObjectURL(url);
      });
      ui.urls = [];
      ui.files = [];
    }
    function stopRender() {
      if (rendererLife) rendererLife.abort();
      cleanups.splice(0).forEach(function(fn) {
        fn();
      });
    }
    function permission(id) {
      return Array.isArray(model.permissions) && model.permissions.indexOf(id) >= 0;
    }
    function allowed(id, local) {
      if (destroyed || pending || !permission(id)) return false;
      if (forbidden.indexOf(model.phase) >= 0) {
        return model.connection === "online" && (id === "reauth" || model.phase === "denied" && id === "choose-context");
      }
      if (!key(model.scope)) return false;
      if (model.scope.kind === "driver" && (type8 === "market" || type8 === "manage" || type8 === "review" && model.mode !== "report" || type8 !== "context" && ["manage", "market"].indexOf(model.destination) >= 0)) return false;
      if (["loading", "pending", "disabled"].indexOf(model.phase) >= 0) return false;
      if (["uncertain", "conflict"].indexOf(model.phase) >= 0 && ["recheck", "reauth"].indexOf(id) < 0) return false;
      if (["offline", "weak", "local"].indexOf(model.connection) >= 0) {
        return !!local && model.destination === "manage" && model.scope.kind !== "driver";
      }
      return true;
    }
    function dispatch(id, payload, local) {
      if (!allowed(id, local)) return false;
      var token = { instanceId, generation: epoch, requestId: instanceId + "-" + ++requestNumber, contextKey: key(model.scope) };
      pending = { token, action: id, payload: copy(payload || {}) };
      var detail = { type: type8, action: id, scope: copy(model.scope || null), request: copy(token), payload: copy(payload || {}) };
      render11();
      root.dispatchEvent(new CustomEvent("micro-product:intent", { bubbles: true, detail }));
      return true;
    }
    function confirm(id, payload, label, description, local, danger) {
      if (!allowed(id, local) || confirmation) return;
      if (!globalApi("ActionSheet")) {
        note(root, L14("confirm.missingComponent", root), "", "error");
        return;
      }
      var generation = epoch, context = key(model.scope), trigger = document.activeElement;
      var sheet = node("div", "m-layer m-action-sheet"), backdrop2 = node("div", "m-layer-backdrop"), life = new AbortController();
      sheet.id = instanceId + "-confirmation";
      backdrop2.id = sheet.id + "-backdrop";
      backdrop2.dataset.for = sheet.id;
      sheet.dataset.backdropId = backdrop2.id;
      sheet.dataset.backdrop = "keep";
      sheet.hidden = backdrop2.hidden = true;
      sheet.setAttribute("role", "alertdialog");
      sheet.setAttribute("aria-modal", "true");
      sheet.setAttribute("aria-labelledby", sheet.id + "-title");
      sheet.setAttribute("aria-describedby", sheet.id + "-description");
      var head = node("header", "m-layer__head"), title = node("h2", "m-layer__title", L14("confirm.title", head));
      title.id = sheet.id + "-title";
      head.appendChild(title);
      var cancel = node("button", "m-btn m-btn--secondary", L14("confirm.cancel"));
      cancel.type = "button";
      cancel.dataset.layerClose = "";
      head.appendChild(cancel);
      sheet.appendChild(head);
      var body = node("div", "m-layer__body"), desc = node("p", "", description || label);
      desc.id = sheet.id + "-description";
      body.appendChild(desc);
      body.appendChild(node("p", "m-product__secondary", model.scope.label || model.scope.contextId));
      var list = node("ul", "m-action-sheet__list"), item = node("li");
      var button = node("button", "m-btn " + (danger ? "m-btn--destructive-soft" : "m-btn--primary") + " m-action-sheet__item", label || L14("confirm.ok", label));
      button.type = "button";
      button.dataset.actionId = "confirm";
      item.appendChild(button);
      list.appendChild(item);
      body.appendChild(list);
      sheet.appendChild(body);
      document.body.append(backdrop2, sheet);
      confirmation = { sheet, backdrop: backdrop2, life };
      globalApi("ActionSheet").init(sheet);
      sheet.addEventListener("micro-actions:request", function() {
        if (destroyed || generation !== epoch || context !== key(model.scope)) return;
        disposeConfirmation();
        pulse("confirm");
        dispatch(id, payload, local);
      }, { signal: life.signal });
      sheet.addEventListener("micro-navigation:closed", function(event) {
        if (event.target === sheet) setTimeout(function() {
          if (confirmation && confirmation.sheet === sheet) disposeConfirmation();
        }, 0);
      }, { signal: life.signal });
      globalApi("ActionSheet").open(sheet, { trigger, contextKey: context });
    }
    function render11() {
      var active = root.contains(document.activeElement) ? document.activeElement : null;
      var focusKey = !suppressFocus && active && active.getAttribute("data-focus-key");
      var selection = active && typeof active.selectionStart === "number" ? [active.selectionStart, active.selectionEnd] : null;
      stopRender();
      rendererLife = new AbortController();
      root.replaceChildren();
      root.classList.add("m-product");
      root.setAttribute("data-product-type", type8);
      if (type8 === "assistant") root.dataset.conversationLayout = model.conversationLayout === "fill" ? "fill" : "embedded";
      root.setAttribute("aria-busy", String(!!pending || ["loading", "pending"].indexOf(model.phase) >= 0));
      if (!root.hasAttribute("tabindex")) root.tabIndex = -1;
      var scopeKey = key(model.scope);
      var ctx = {
        root,
        model,
        ui,
        node,
        note,
        key,
        uid: instanceId,
        /* المرحلة 8 — معلومات عرض إضافية للتراكيب الجديدة: رابط صورة
           مفحوص (نفس قاعدة media) وفعل الطلب المعلق إن وُجد (لعرض حالة
           تحميل على زره)؛ إضافات فقط لا تغير سلوك أي renderer قائم. */
        safeImage,
        pending: pending ? pending.action : null,
        on: function(el2, event, fn) {
          el2.addEventListener(event, fn, { signal: rendererLife.signal });
        },
        cleanup: function(fn) {
          cleanups.push(fn);
        },
        can: allowed,
        editable: function() {
          return !pending && permission("compose") && forbidden.indexOf(model.phase) < 0 && ["disabled", "loading", "pending"].indexOf(model.phase) < 0;
        },
        request: dispatch,
        button: function(parent, id, label, payload, options) {
          options = options || {};
          var b = node("button", "m-btn " + (options.danger ? "m-btn--destructive-soft" : options.primary ? "m-btn--primary" : "m-btn--secondary"), label);
          b.type = "button";
          b.dataset.productAction = id;
          b.dataset.focusKey = options.focusKey || "action-" + id;
          b.disabled = !!options.disabled || !allowed(id, options.local);
          parent.appendChild(b);
          ctx.on(b, "click", function() {
            if (!root.contains(b) || b.disabled || !allowed(id, options.local)) return;
            var data = typeof payload === "function" ? payload() : payload;
            if (data === false) return;
            if (options.confirm || options.danger) {
              confirm(id, data, label, typeof options.description === "function" ? options.description(data) : options.description, options.local, options.danger);
            } else {
              dispatch(id, data, options.local);
            }
          });
          return b;
        },
        field: function(parent, name, label, options) {
          options = options || {};
          var box = node("div", "m-field"), lab = node("label", "m-field__label", label), wrap = node("div", "m-field__control");
          box.dataset.microField = "";
          var input = node(options.multiline ? "textarea" : options.options ? "select" : "input", options.multiline ? "m-field__area" : "m-field__input");
          input.id = instanceId + "-" + name;
          input.dataset.focusKey = "field-" + name;
          lab.htmlFor = input.id;
          if (options.options) {
            options.options.forEach(function(x) {
              var opt = node("option", "", x.label);
              opt.value = x.id;
              input.appendChild(opt);
            });
          } else if (options.multiline) {
            input.rows = options.rows || 3;
          } else {
            input.type = options.type || "text";
            if (options.inputmode) {
              input.inputMode = options.inputmode;
              if (["decimal", "numeric"].indexOf(options.inputmode) >= 0) {
                input.classList.add("m-field__input--num");
                input.dir = "ltr";
              }
            }
          }
          if (ui.draft[name] === void 0) ui.draft[name] = options.value == null ? "" : String(options.value);
          input.value = ui.draft[name];
          input.disabled = !ctx.editable();
          if (options.maxLength) input.maxLength = options.maxLength;
          if (options.enterKeyHint) input.setAttribute("enterkeyhint", options.enterKeyHint);
          ctx.on(input, options.options ? "change" : "input", function() {
            ui.draft[name] = input.value;
            box.querySelectorAll("[data-product-field-error]").forEach(function(e) {
              e.remove();
            });
            input.removeAttribute("aria-invalid");
            input.removeAttribute("aria-describedby");
            box.classList.remove("has-error");
            if (!root.querySelector('[aria-invalid="true"]')) root.querySelectorAll("[data-product-validation]").forEach(function(e) {
              e.remove();
            });
          });
          wrap.appendChild(input);
          if (options.unit) wrap.appendChild(node("span", "m-field__unit", options.unit));
          box.append(lab, wrap);
          parent.appendChild(box);
          return input;
        },
        fieldsPayload: function(required) {
          var data = copy(ui.draft), missing = (required || []).filter(function(name) {
            return !String(data[name] || "").trim();
          });
          root.querySelectorAll("[data-product-validation],[data-product-field-error]").forEach(function(e) {
            e.remove();
          });
          root.querySelectorAll('[data-focus-key^="field-"][aria-invalid="true"]').forEach(function(el2) {
            el2.removeAttribute("aria-invalid");
            el2.removeAttribute("aria-describedby");
            el2.closest(".m-field").classList.remove("has-error");
          });
          if (missing.length) {
            var error = note(root, L14("form.requiredFields", root), "", "error");
            error.dataset.productValidation = "";
            error.id = instanceId + "-validation";
            var heading = root.querySelector(":scope > header,:scope > h2");
            if (heading) heading.after(error);
            else root.prepend(error);
            var first = null;
            root.querySelectorAll('[data-focus-key^="field-"]').forEach(function(el2) {
              if (missing.indexOf(el2.dataset.focusKey.slice(6)) < 0) return;
              var box = el2.closest(".m-field"), label = box.querySelector("label");
              var message = node("p", "m-field__msg is-visible", L14("form.missingFieldPrefix", label) + (label ? label.textContent : L14("form.missingFieldFallback", label)));
              message.id = el2.id + "-required";
              message.dataset.productFieldError = "";
              box.appendChild(message);
              el2.setAttribute("aria-invalid", "true");
              el2.setAttribute("aria-describedby", message.id);
              box.classList.add("has-error");
              if (!first) first = el2;
            });
            if (first) first.focus();
            return false;
          }
          data.files = ui.files.slice();
          return data;
        },
        media: function(parent, images, fit, preview) {
          if (!images || !images.length) {
            parent.appendChild(node("div", "m-product__media-empty", L14("media.unavailable", parent)));
            return;
          }
          var carousel = node("div", "m-carousel m-product__gallery");
          carousel.classList.toggle("m-product__gallery--preview", !!preview);
          carousel.dataset.carousel = "";
          carousel.dataset.carouselLabel = L14("media.carouselLabel", carousel);
          carousel.setAttribute("role", "group");
          carousel.setAttribute("aria-label", L14("media.carouselLabel", carousel));
          var viewport = node("div", "m-carousel__viewport");
          viewport.dataset.viewport = "";
          var track = node("ul", "m-carousel__track");
          track.dataset.track = "";
          images.forEach(function(image, index) {
            var li = node("li", "m-carousel__slide"), card = node("div", "m-carousel__card"), src = safeImage(image.src);
            li.dataset.carouselSlide = "";
            li.dataset.cardLabel = image.alt || L14("media.cardLabelPrefix", li) + (index + 1);
            if (src) {
              var img = node("img", "m-product__media");
              img.src = src;
              img.alt = image.alt || L14("media.imageAltFallback", img);
              img.loading = "lazy";
              img.decoding = "async";
              img.style.objectFit = fit === "contain" ? "contain" : "cover";
              ctx.on(img, "error", function() {
                img.replaceWith(node("div", "m-product__media-empty", L14("media.imageError", img)));
              });
              card.appendChild(img);
            } else {
              card.appendChild(node("div", "m-product__media-empty", L14("media.linkUnavailable", card)));
            }
            li.appendChild(card);
            track.appendChild(li);
          });
          viewport.appendChild(track);
          carousel.appendChild(viewport);
          if (images.length > 1) {
            var controls = node("div", "m-product__actions");
            ["prev", "next"].forEach(function(dir) {
              var b = node("button", "m-btn m-btn--secondary", dir === "prev" ? L14("media.prev") : L14("media.next"));
              b.type = "button";
              b.dataset[dir] = "";
              controls.appendChild(b);
            });
            var count = node("span", "m-product__secondary");
            count.dataset.status = "";
            controls.appendChild(count);
            carousel.appendChild(controls);
          }
          parent.appendChild(carousel);
          if (globalApi("Carousel")) {
            globalApi("Carousel").init(carousel);
            ctx.cleanup(function() {
              globalApi("Carousel").destroy(carousel);
            });
          }
        },
        attachments: function(parent, required) {
          var field = node("div", "m-field"), lab = node("span", "m-field__label", L14("attachments.label", field));
          var input = node("input", "m-product__file");
          var choose = node("button", "m-btn m-btn--secondary", model.attachmentSelection === "append" ? L14("attachments.addMore") : ui.files.length ? L14("attachments.replaceSelection") : L14("attachments.choose"));
          input.type = "file";
          input.accept = "image/*";
          input.multiple = true;
          input.id = instanceId + "-files";
          input.hidden = true;
          input.tabIndex = -1;
          input.disabled = !ctx.editable();
          choose.type = "button";
          choose.disabled = !ctx.editable();
          choose.dataset.focusKey = "choose-files";
          ctx.on(choose, "click", function() {
            if (ctx.editable()) input.click();
          });
          field.append(lab, input, choose);
          parent.appendChild(field);
          ctx.on(input, "change", function() {
            var files = Array.from(input.files || []);
            if (files.some(function(f) {
              return !f.type.startsWith("image/") || model.maxImageBytes && f.size > model.maxImageBytes;
            })) {
              note(parent, L14("attachments.fileError", parent), L14("attachments.fileErrorDetail", parent), "error");
              return;
            }
            var selection2 = model.attachmentSelection === "append" ? ui.files.concat(files) : files;
            releaseFiles();
            ui.files = selection2;
            ui.urls = selection2.map(function(f) {
              return URL.createObjectURL(f);
            });
            render11();
          });
          if (ui.files.length) {
            var names = node("ul", "m-product__filenames");
            ui.files.forEach(function(f, index) {
              var item = node("li");
              item.appendChild(node("bdi", "", f.name));
              if (ui.files.length > 1) {
                var remove = node("button", "m-btn m-btn--light", L14("attachments.remove", remove));
                remove.type = "button";
                remove.disabled = !ctx.editable();
                remove.setAttribute("aria-label", L14("attachments.removeAriaPrefix", remove) + f.name);
                remove.dataset.focusKey = "remove-file-" + index;
                ctx.on(remove, "click", function() {
                  if (!ctx.editable()) return;
                  URL.revokeObjectURL(ui.urls[index]);
                  ui.urls.splice(index, 1);
                  ui.files.splice(index, 1);
                  remove.dataset.focusKey = "choose-files";
                  render11();
                });
                item.appendChild(remove);
              }
              names.appendChild(item);
            });
            field.appendChild(names);
            ctx.media(parent, ui.files.map(function(f, i) {
              return { src: ui.urls[i], alt: f.name };
            }), "contain", true);
            var clear = node("button", "m-btn m-btn--light", L14("attachments.removeAll"));
            clear.type = "button";
            clear.disabled = !ctx.editable();
            ctx.on(clear, "click", function() {
              releaseFiles();
              render11();
            });
            parent.appendChild(clear);
          }
          if (required) parent.appendChild(node("p", "m-product__secondary", L14("attachments.requiredNotice", parent)));
        },
        timeline: function(parent, items) {
          var list = node("ol", "m-product__timeline");
          (items || []).forEach(function(item) {
            var row = node("li");
            if (item.current) row.setAttribute("aria-current", "step");
            row.appendChild(node("strong", "", item.label));
            if (item.time) row.appendChild(node("bdi", "m-product__secondary", item.time));
            if (item.detail) row.appendChild(node("p", "m-product__secondary", item.detail));
            list.appendChild(row);
          });
          parent.appendChild(list);
        }
      };
      var phase = Object.prototype.hasOwnProperty.call(phases, model.phase) ? model.phase : "uncertain";
      if (forbidden.indexOf(phase) >= 0) {
        note(root, phases[phase], L14("shell.previousContextHidden", root), "warning");
        if (permission("reauth")) ctx.button(root, "reauth", L14("shell.reauth", root), {});
        if (phase === "denied" && permission("choose-context")) ctx.button(root, "choose-context", L14("shell.chooseContext", root), {});
      } else if (!scopeKey) {
        note(root, L14("shell.noScopeTitle", root), L14("shell.noScopeDetail", root), "warning");
      } else if (model.scope.kind === "driver" && (type8 === "market" || type8 === "manage" || type8 === "review" && model.mode !== "report" || type8 !== "context" && ["manage", "market"].indexOf(model.destination) >= 0)) {
        note(root, L14("shell.driverScopeTitle", root), L14("shell.driverScopeDetail", root), "warning");
      } else if (!permission("view") || type8 !== "context" && type8 !== "state" && key(model.dataContext) !== scopeKey) {
        note(root, L14("shell.noPermission", root), "", "warning");
      } else {
        if (["offline", "weak", "local"].indexOf(model.connection) >= 0) {
          note(root, model.connection === "offline" ? L14("connection.offline", root) : model.connection === "local" ? L14("connection.local", root) : L14("connection.weak", root), model.destination === "manage" ? L14("connection.manageNotice", root) : L14("connection.genericNotice", root), "warning");
        }
        if (pending) {
          note(root, phases.pending, "", "info");
        } else if (phase !== "ready") {
          note(root, phases[phase], model.phaseDetail || "", phase === "error" ? "error" : phase === "success" ? "success" : "info");
        }
        if (phase !== "loading" && (phase !== "empty" || type8 === "assistant" || type8 === "manage")) renderers.get(type8)(ctx);
        else if (phase === "empty" && model.emptyActionLabel) ctx.button(root, "create", model.emptyActionLabel, {});
        if (["uncertain", "conflict"].indexOf(phase) >= 0 && permission("recheck") && !root.querySelector('[data-product-action="recheck"]')) ctx.button(root, "recheck", L14("stateCard.recheck", root), {});
      }
      if (globalApi("Fields")) {
        globalApi("Fields").init(root);
        cleanups.push(function() {
          globalApi("Fields").disconnect(root);
        });
      }
      if (suppressFocus && active) {
        root.focus({ preventScroll: true });
      } else if (focusKey) {
        var found = Array.from(root.querySelectorAll("[data-focus-key]")).find(function(el2) {
          return el2.dataset.focusKey === focusKey && !el2.disabled;
        });
        if (found) {
          found.focus({ preventScroll: true });
          if (selection && found.setSelectionRange) try {
            found.setSelectionRange(selection[0], selection[1]);
          } catch (_) {
          }
        } else root.focus({ preventScroll: true });
      }
      suppressFocus = false;
    }
    function replace(next3) {
      if (destroyed) return false;
      var previous = model && key(model.scope);
      var nextModel = copy(next3 || {});
      nextModel.phase = nextModel.phase || "ready";
      if (!Object.prototype.hasOwnProperty.call(phases, nextModel.phase)) nextModel.phase = "uncertain";
      nextModel.connection = nextModel.connection || "online";
      if (["online", "offline", "weak", "local"].indexOf(nextModel.connection) < 0) nextModel.connection = "offline";
      var purge = previous !== key(nextModel.scope) || draftOwner(model) !== draftOwner(nextModel) || visibilityRevoked(model, nextModel) || forbidden.indexOf(nextModel.phase) >= 0 || nextModel.clearDraft === true || !Array.isArray(nextModel.permissions) || nextModel.permissions.indexOf("view") < 0;
      disposeConfirmation();
      epoch++;
      pending = null;
      if (purge) {
        ui.presentation = /* @__PURE__ */ Object.create(null);
        ui.presentationGeneration++;
        releaseFiles();
        ui.draft = /* @__PURE__ */ Object.create(null);
        suppressFocus = true;
      }
      model = nextModel;
      render11();
      return true;
    }
    var api = {
      root,
      replace,
      /* العقد الموحد (الجولة الثانية R4): update(model) = replace نفسها —
         استبدال النموذج وإعادة التصيير بلا إعادة تركيب. */
      update: replace,
      resolve: function(token, next3) {
        if (destroyed || !pending || !token || ["instanceId", "generation", "requestId", "contextKey"].some(function(k) {
          return pending.token[k] !== token[k];
        })) return false;
        var nextKey = key(next3 && next3.scope);
        if (nextKey !== key(model.scope) && !(pending.action === "switch-context" && nextKey && nextKey === key(pending.payload.targetScope))) return false;
        return replace(next3);
      },
      getState: function() {
        return destroyed ? null : { scope: copy(model.scope || null), phase: model.phase, pending: pending ? copy(pending.token) : null };
      },
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        epoch++;
        pending = null;
        ui.presentation = /* @__PURE__ */ Object.create(null);
        ui.presentationGeneration++;
        disposeConfirmation();
        stopRender();
        releaseFiles();
        ui.draft = /* @__PURE__ */ Object.create(null);
        root.replaceChildren();
        root.removeAttribute("aria-busy");
        root.removeAttribute("data-product-type");
        root.removeAttribute("data-conversation-layout");
        instances9.delete(root);
      }
    };
    instances9.set(root, { type: type8, api });
    replace(value);
    return api;
  }
  function init20(root, model) {
    var type8 = model && model.type;
    applyInstanceLabels19(root, model);
    return withLabels20(root, function() {
      return mount(root, type8, model);
    });
  }
  function getInstance20(root) {
    var entry = root && instances9.get(root);
    return entry ? entry.api : null;
  }
  function destroy20(root) {
    var entry = root && instances9.get(root);
    if (entry) entry.api.destroy();
  }
  function setLabels18(partial) {
    setLabels("product-context", partial);
  }

  // components/product-context/context.js
  var MICRO_LABELS_FAMILY18 = "product-context";
  function L15(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY18) || currentInstanceLabels(MICRO_LABELS_FAMILY18);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY18, key2);
  }
  var type = "context";
  function render4(ctx) {
    var model = ctx.model, node2 = ctx.node, root = ctx.root;
    var contexts = model.contexts || [];
    var keys = contexts.map(function(item) {
      return ctx.key(item.scope);
    });
    var current = contexts.find(function(item) {
      return item.scope && ctx.key(item.scope) === ctx.key(model.scope);
    });
    root.appendChild(node2("h2", "m-product__title", model.accountLabel || L15("context.accountFallback", root)));
    if (!current) {
      ctx.note(root, L15("context.unavailableTitle", root), L15("context.unavailableDetail", root), "warning");
      return;
    }
    if (keys.some(function(k, i) {
      return !k || keys.indexOf(k) !== i;
    })) {
      ctx.note(root, L15("context.invalidListTitle", root), L15("context.unavailableDetail", root), "warning");
      return;
    }
    var label = node2("label", "m-field__label", L15("context.selectLabel", select)), select = node2("select", "m-field__input");
    select.id = ctx.uid + "-context";
    select.dataset.focusKey = "context-select";
    label.htmlFor = select.id;
    contexts.forEach(function(item) {
      var option = node2("option", "", item.label);
      option.value = ctx.key(item.scope);
      select.appendChild(option);
    });
    select.value = ctx.key(model.scope);
    select.disabled = !ctx.can("switch-context");
    var field = node2("div", "m-field"), control = node2("div", "m-field__control");
    field.dataset.microField = "";
    control.appendChild(select);
    field.append(label, control);
    root.appendChild(field);
    ctx.on(select, "change", function() {
      var chosen = select.value;
      select.value = ctx.key(model.scope);
      var item = contexts.find(function(x) {
        return ctx.key(x.scope) === chosen;
      });
      if (item) ctx.request("switch-context", { contextId: item.scope.contextId, targetScope: structuredClone(item.scope) });
    });
    var names = { manage: L15("context.destination.manage"), market: L15("context.destination.market"), delivery: L15("context.destination.delivery"), ask: "Ask Micro" };
    var nav = node2("nav", "m-product__destinations");
    nav.setAttribute("aria-label", L15("context.navLabel", nav));
    ["manage", "market", "delivery", "ask"].filter(function(id) {
      return (current.destinations || []).indexOf(id) >= 0 && (model.scope.kind !== "driver" || id === "delivery" || id === "ask");
    }).forEach(function(id) {
      var button = ctx.button(nav, "navigate", names[id], { destination: id });
      button.dataset.destination = id;
      button.dataset.focusKey = "destination-" + id;
      if (model.destination === id) button.setAttribute("aria-current", "page");
    });
    root.appendChild(nav);
    if (!nav.children.length) ctx.note(root, L15("context.noDestinationsTitle", nav), L15("context.noDestinationsDetail", nav), "warning");
  }
  register(type, render4);

  // components/product-context/operation.js
  var MICRO_LABELS_FAMILY19 = "product-context";
  function L16(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY19) || currentInstanceLabels(MICRO_LABELS_FAMILY19);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY19, key2);
  }
  var type2 = "state";
  function render5(ctx) {
    var model = ctx.model, node2 = ctx.node, root = ctx.root;
    root.appendChild(node2("h2", "m-product__title", model.title || L16("operation.title", root)));
    if (model.reference) {
      var reference = node2("p", "m-product__secondary", L16("operation.referencePrefix", reference));
      reference.appendChild(node2("bdi", "", model.reference));
      root.appendChild(reference);
    }
    if (model.detail) root.appendChild(node2("p", "", model.detail));
    var actions = node2("div", "m-product__actions");
    [
      { id: "recheck", label: L16("operation.actions.recheck") },
      { id: "retry", label: L16("operation.actions.retry") }
    ].forEach(function(action) {
      if ((model.permissions || []).indexOf(action.id) >= 0) {
        ctx.button(actions, action.id, action.label, { reference: model.reference || null }, { local: action.local });
      }
    });
    root.appendChild(actions);
    if (model.steps) ctx.timeline(root, model.steps);
  }
  register(type2, render5);

  // components/product-context/market.js
  var MICRO_LABELS_FAMILY20 = "product-context";
  function L17(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY20) || currentInstanceLabels(MICRO_LABELS_FAMILY20);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY20, key2);
  }
  var type3 = "market";
  function render6(ctx) {
    var model = ctx.model, node2 = ctx.node, root = ctx.root;
    var head = node2("header", "m-product__header");
    root.appendChild(head);
    head.appendChild(node2("h2", "m-product__title", model.mode === "editor" ? L17("market.editorTitle", head) : model.mode === "search" || model.mode === "results" ? L17("market.searchTitle", head) : model.title || L17("market.listingTitle", head)));
    function searchHeader() {
      ctx.field(root, "query", L17("market.searchField", root), { value: model.query, type: "search" });
      (model.filters || []).forEach(function(filter) {
        ctx.field(root, filter.id, filter.label, { options: filter.options, value: filter.value });
      });
      ctx.button(root, "search", L17("market.searchAction", root), function() {
        return ctx.fieldsPayload([]);
      });
      if (model.resultLabel) root.appendChild(node2("p", "m-product__secondary", model.resultLabel));
    }
    function thumbEmpty(label) {
      var el2 = node2("div", "m-product__thumb m-product__thumb--empty");
      el2.setAttribute("role", "img");
      el2.setAttribute("aria-label", label);
      return el2;
    }
    if (model.mode === "search") {
      searchHeader();
      return;
    }
    if (model.mode === "results") {
      searchHeader();
      if (model.phase === "error") {
        if ((model.permissions || []).indexOf("retry") >= 0) ctx.button(root, "retry", L17("operation.actions.retry", root), {});
        return;
      }
      if (model.resultsState === "no-ads") ctx.note(root, L17("market.noAdsTitle", root), L17("market.noAdsDetail", root), "info");
      else if (model.resultsState === "no-results") ctx.note(root, L17("market.noResultsTitle", root), L17("market.noResultsDetail", root), "info");
      else {
        var results = Array.isArray(model.results) ? model.results : [];
        if (results.length) {
          var section = node2("section", "m-product__section");
          section.appendChild(node2("h3", "m-product__title", L17("market.resultsTitle", section)));
          var list = node2("ul", "m-operational-list");
          results.forEach(function(item) {
            if (!item) return;
            var row = node2("li", "m-row m-row--operational");
            if (item.image) {
              var src = ctx.safeImage(item.image.src);
              if (src) {
                var img = node2("img", "m-product__thumb");
                img.src = src;
                img.alt = item.image.alt || L17("media.unavailable", img);
                img.loading = "lazy";
                img.decoding = "async";
                ctx.on(img, "error", function() {
                  img.replaceWith(thumbEmpty(L17("media.imageError", img)));
                });
                row.appendChild(img);
              } else {
                row.appendChild(thumbEmpty(L17("media.unavailable", row)));
              }
            }
            var text2 = node2("span", "m-row__text");
            text2.appendChild(node2("strong", "m-row__title", item.title || L17("common.unavailable", text2)));
            if (item.sellerLabel) text2.appendChild(node2("span", "m-row__subtitle", item.sellerLabel));
            row.appendChild(text2);
            if (item.statusLabel) {
              var meta = node2("div", "m-row__meta");
              meta.appendChild(node2("span", "m-badge m-badge--info", item.statusLabel));
              row.appendChild(meta);
            }
            var reading = node2("span", "m-row__reading");
            var price2 = node2("bdi", "", item.price == null || String(item.price).trim() === "" ? L17("common.unavailable") : item.price);
            price2.dir = "ltr";
            reading.append(price2, document.createTextNode(" " + (item.unit || model.unit || L17("common.unitFallback"))));
            row.appendChild(reading);
            list.appendChild(row);
          });
          if (list.children.length) {
            section.appendChild(list);
            root.appendChild(section);
          }
        }
      }
      return;
    }
    if (model.mode === "editor") {
      ctx.field(root, "title", L17("market.titleField", root), { value: model.title, maxLength: model.titleMaxLength });
      ctx.field(root, "description", L17("market.descriptionField", root), { value: model.description, multiline: true });
      ctx.field(root, "price", L17("market.priceField", root), { value: model.price, inputmode: "decimal", unit: model.unit || L17("market.priceUnitFallback", root) });
      if (model.images && model.images.length) ctx.media(root, model.images, "contain", true);
      ctx.attachments(root, false);
      var actions = node2("div", "m-product__actions m-btn-group m-btn-group--pair");
      root.appendChild(actions);
      ["publish", "save-draft"].forEach(function(id) {
        if ((model.permissions || []).indexOf(id) >= 0) {
          ctx.button(
            actions,
            id,
            id === "publish" ? L17("market.publishAction", actions) : L17("market.saveDraftAction", actions),
            function() {
              return ctx.fieldsPayload(id === "publish" ? model.requiredFields || [] : []);
            },
            {
              confirm: id === "publish",
              primary: id === "publish",
              description: function(data) {
                return L17("market.publishConfirmPrefix") + data.title + L17("market.publishConfirmPrice") + data.price + " " + (model.unit || L17("common.unitFallback")) + ".";
              }
            }
          );
        }
      });
      if (actions.children.length < 2) actions.classList.remove("m-btn-group--pair");
      return;
    }
    if (model.price !== null && model.price !== void 0) {
      var price = node2("p", "m-product__value");
      var number = node2("bdi", "", model.price);
      number.dir = "ltr";
      price.append(number, document.createTextNode(" " + (model.unit || L17("common.unitFallback"))));
      head.appendChild(price);
    }
    if (model.sellerLabel) head.appendChild(node2("p", "m-product__secondary", model.sellerLabel));
    if (model.statusLabel) head.appendChild(node2("span", "m-badge m-badge--info", model.statusLabel));
    ctx.media(root, model.images, model.fit);
    if (model.reason) ctx.note(root, L17("market.reviewNoteTitle", root), model.reason, "warning");
    var cardActions = node2("div", "m-product__actions");
    root.appendChild(cardActions);
    [{ id: "edit", label: L17("market.editAction") }, { id: "report", label: L17("market.reportAction") }].forEach(function(action) {
      if ((model.permissions || []).indexOf(action.id) >= 0) {
        ctx.button(cardActions, action.id, action.label, { listingId: model.id, revision: model.revision }, { confirm: action.confirm, description: L17("market.reportConfirm") });
      }
    });
  }
  register(type3, render6);

  // components/product-context/delivery.js
  var MICRO_LABELS_FAMILY21 = "product-context";
  function L18(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY21) || currentInstanceLabels(MICRO_LABELS_FAMILY21);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY21, key2);
  }
  var type4 = "delivery";
  function render7(ctx) {
    var model = ctx.model, node2 = ctx.node, root = ctx.root;
    var head = node2("header", "m-product__header");
    root.appendChild(head);
    head.appendChild(node2("h2", "m-product__title", model.title || L18("delivery.title", head)));
    if (model.statusLabel) head.appendChild(node2("span", "m-badge m-badge--info", model.statusLabel));
    if (model.mode !== "request" && model.visibility && model.visibility.addresses) {
      var addresses = node2("dl", "m-product__comparison");
      [[L18("delivery.pickup"), model.pickup], [L18("delivery.dropoff"), model.dropoff]].forEach(function(pair) {
        addresses.append(node2("dt", "", pair[0]), node2("dd", "", pair[1] || L18("common.unavailable")));
      });
      root.appendChild(addresses);
    } else if (!(model.visibility && model.visibility.addresses)) {
      root.appendChild(node2("p", "m-product__secondary", L18("delivery.addressesUnavailable", root)));
    }
    if (model.visibility && model.visibility.contact && model.contact) root.appendChild(node2("bdi", "", model.contact));
    if (model.mode === "request") {
      ctx.field(root, "pickup", L18("delivery.pickupField", root), { value: model.visibility && model.visibility.addresses ? model.pickup : "" });
      ctx.field(root, "dropoff", L18("delivery.dropoffField", root), { value: model.visibility && model.visibility.addresses ? model.dropoff : "" });
      ctx.field(root, "note", L18("delivery.noteField", root), { multiline: true, value: model.note });
      ctx.button(root, "request-delivery", L18("delivery.requestAction", root), function() {
        return ctx.fieldsPayload(model.requiredFields || []);
      }, { confirm: true, description: L18("delivery.requestConfirm", root) });
    } else if (model.mode === "offer") {
      var quote = node2("section", "m-product__section m-product__quote");
      root.appendChild(quote);
      var price = node2("p", "m-product__value");
      var number = node2("bdi", "", model.amount == null ? L18("common.unavailable") : model.amount);
      number.dir = "ltr";
      price.append(number, document.createTextNode(" " + (model.unit || L18("common.unitFallback"))));
      quote.appendChild(price);
      quote.appendChild(node2("p", "m-product__secondary", model.validityLabel || L18("delivery.validityFallback", quote)));
      var actions = node2("div", "m-product__actions m-btn-group m-btn-group--pair"), more = node2("div", "m-btn-group__more");
      root.appendChild(actions);
      ["accept", "decline", "assign"].forEach(function(id) {
        if ((model.permissions || []).indexOf(id) >= 0) {
          ctx.button(
            id === "assign" ? more : actions,
            id,
            { accept: L18("delivery.quote.accept", actions), decline: L18("delivery.quote.decline", actions), assign: L18("delivery.quote.assign", actions) }[id],
            { requestId: model.id, offerId: model.offerId, revision: model.revision },
            { confirm: true, primary: id === "accept", description: L18("delivery.quote.confirmPrefix") + String(model.amount == null ? L18("common.unavailablePlain") : model.amount) + " " + (model.unit || "") + "." }
          );
        }
      });
      if (more.children.length) actions.appendChild(more);
      if (actions.querySelectorAll(":scope > .m-btn").length < 2) actions.classList.remove("m-btn-group--pair");
    } else if (model.mode === "change") {
      var diff = node2("dl", "m-product__comparison");
      diff.append(node2("dt", "", L18("delivery.change.current")), node2("dd", "", model.currentText || L18("common.unavailable")), node2("dt", "", L18("delivery.change.proposed")), node2("dd", "", model.proposedText || L18("common.unavailable")));
      root.appendChild(diff);
      ctx.timeline(root, (model.parties || []).map(function(party) {
        return { label: party.label, detail: party.statusLabel || L18("delivery.partyStatusFallback") };
      }));
      ctx.button(root, "request-change", L18("delivery.change.requestAction", root), { requestId: model.id, revision: model.revision }, { confirm: true, description: L18("delivery.change.confirm", root) });
    } else if (model.mode === "proof") {
      if (model.requirementsLabel) root.appendChild(node2("p", "", model.requirementsLabel));
      ctx.field(root, "note", L18("delivery.proof.noteField", root), { multiline: true });
      ctx.attachments(root, model.attachmentRequired);
      ctx.button(root, "submit-proof", model.proofKind === "return" ? L18("delivery.proof.returnAction", root) : L18("delivery.proof.deliveryAction", root), function() {
        if (model.attachmentRequired && !ctx.ui.files.length) {
          ctx.note(root, L18("delivery.proof.attachmentRequired", root), "", "error");
          return false;
        }
        var payload = ctx.fieldsPayload(model.requiredFields || []);
        if (payload) {
          payload.requestId = model.id;
          payload.proofKind = model.proofKind || "delivery";
          payload.revision = model.revision;
        }
        return payload;
      }, { confirm: true, description: L18("delivery.proof.confirm") });
    } else {
      ctx.timeline(root, model.steps);
      if ((model.permissions || []).indexOf("recheck") >= 0) ctx.button(root, "recheck", L18("delivery.updateStatusAction", root), { requestId: model.id });
    }
  }
  register(type4, render7);

  // shared/script-base.js
  var import_meta = {};
  var cached = null;
  function scriptBase() {
    if (cached) return cached;
    if (typeof globalThis !== "undefined" && globalThis.__microIifeBaseUrl) {
      cached = globalThis.__microIifeBaseUrl;
    } else {
      cached = import_meta.url;
    }
    return cached;
  }

  // components/product-context/assistant.js
  var MICRO_LABELS_FAMILY22 = "product-context";
  function L19(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY22) || currentInstanceLabels(MICRO_LABELS_FAMILY22);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY22, key2);
  }
  var askSymbolUrl = null;
  function askSymbol() {
    if (!askSymbolUrl) {
      askSymbolUrl = new URL("../assets/brand/micro-logo/v2/variants/full-color/micro-symbol.svg", scriptBase()).href;
    }
    return askSymbolUrl;
  }
  var kinds = { "follow-up": "follow-up", open: "open-resource", execute: "execute" };
  function text(value) {
    return typeof value === "string" && value.trim().length > 0;
  }
  var type5 = "assistant";
  function render8(ctx) {
    var model = ctx.model, node2 = ctx.node, root = ctx.root;
    var actionStatus = 0;
    var header = node2("header", "m-product__section m-assistant__header");
    var identity = node2("div", "m-assistant__identity");
    var logo = node2("img", "m-assistant__symbol");
    logo.src = askSymbol();
    logo.alt = "";
    logo.width = 24;
    logo.height = 24;
    identity.append(logo, node2("h2", "m-product__title", "Ask Micro"));
    header.append(identity, node2("p", "m-product__secondary", model.scope.label || model.scope.contextId));
    root.appendChild(header);
    var generation = ctx.ui.presentationGeneration, saved = ctx.ui.presentation.ask || null;
    var messages = model.phase === "empty" ? [] : model.messages || [];
    var log = node2("div", "m-product__log");
    log.id = ctx.uid + "-log";
    log.dataset.focusKey = "assistant-log";
    log.setAttribute("role", "log");
    log.setAttribute("aria-label", L19("assistant.logLabel", log));
    log.setAttribute("aria-relevant", "additions text");
    log.setAttribute("aria-busy", String(!!model.replyPending));
    messages.forEach(function(message) {
      var bubble = node2("article", "m-product__message");
      var speaker = ["user", "assistant"].indexOf(message.speaker) >= 0 ? message.speaker : "system";
      bubble.dataset.speaker = speaker;
      if (text(message.id) && messages.filter(function(x) {
        return x.id === message.id;
      }).length === 1) bubble.dataset.messageId = message.id;
      bubble.append(
        node2("strong", "m-product__secondary", speaker === "user" ? L19("assistant.userSpeaker") : speaker === "assistant" ? "Ask Micro" : L19("assistant.noteSpeaker")),
        node2("p", "", message.text)
      );
      if (message.stateLabel) bubble.appendChild(node2("p", "m-product__secondary", message.stateLabel));
      if (message.id && (model.permissions || []).indexOf("retry") >= 0 && message.retryable) {
        ctx.button(bubble, "retry", L19("assistant.retryAction", bubble), { messageId: message.id }, { focusKey: "retry-" + message.id });
      }
      if (speaker === "assistant" && text(message.id) && messages.filter(function(x) {
        return x.id === message.id;
      }).length === 1) {
        var actions = Array.isArray(message.actions) ? message.actions : [];
        var row = node2("div", "m-product__actions m-assistant__actions");
        var reasons = /* @__PURE__ */ Object.create(null), reasonNodes = [];
        actions.forEach(function(action) {
          if (!action || !Object.prototype.hasOwnProperty.call(kinds, action.kind) || !text(action.id) || !text(action.label) || !text(action.revision) || actions.filter(function(x) {
            return x && x.id === action.id;
          }).length !== 1) return;
          if (action.kind === "execute" && !text(action.summary)) return;
          var state2 = action.state === void 0 ? "ready" : action.state;
          var disabled = state2 !== "ready" || !!model.replyPending;
          var id = kinds[action.kind];
          var button = ctx.button(
            row,
            id,
            action.label,
            { messageId: message.id, actionId: action.id, revision: action.revision },
            {
              confirm: action.kind === "execute",
              description: action.summary,
              focusKey: "message-action-" + message.id + "-" + action.id,
              disabled,
              primary: action.emphasis === "primary" && actions.filter(function(x) {
                return x && x.emphasis === "primary";
              }).length === 1
            }
          );
          if (state2 !== "ready") {
            var reason = { expired: L19("assistant.proposalExpired"), completed: L19("assistant.proposalCompleted"), unavailable: L19("assistant.proposalUnavailable") }[state2] || L19("assistant.proposalUnavailable");
            var status2 = reasons[reason];
            if (!status2) {
              status2 = node2("span", "m-product__secondary", reason);
              status2.id = ctx.uid + "-action-status-" + ++actionStatus;
              reasons[reason] = status2;
              reasonNodes.push(status2);
            }
            button.setAttribute("aria-describedby", status2.id);
          }
        });
        reasonNodes.forEach(function(item) {
          row.appendChild(item);
        });
        if (row.children.length) bubble.appendChild(row);
      }
      log.appendChild(bubble);
    });
    if (!log.children.length) log.appendChild(node2("p", "m-product__secondary", L19("assistant.emptyLog", log)));
    root.appendChild(log);
    if (model.replyPending) {
      var activity = node2("div", "m-assistant__activity");
      activity.setAttribute("role", "status");
      var dot = node2("span", "m-assistant__activity-dot");
      dot.setAttribute("aria-hidden", "true");
      activity.append(dot, node2("span", "", model.activity === "searching" ? L19("assistant.searchingStatus", activity) : L19("assistant.preparingStatus", activity)));
      root.appendChild(activity);
    }
    var last = messages[messages.length - 1];
    var lastKey = last ? String(last.id || "") + "\n" + String(last.text || "") : "";
    var unread = !!(messages.length && saved && !saved.atEnd && (saved.unread || messages.length > saved.count || messages.length === saved.count && saved.lastKey !== lastKey));
    var newer = node2("button", "m-btn m-btn--light m-assistant__new", L19("assistant.newMessagesAction", newer));
    newer.type = "button";
    newer.hidden = !unread;
    newer.setAttribute("aria-controls", log.id);
    root.appendChild(newer);
    function atEnd() {
      return log.scrollHeight - log.clientHeight - log.scrollTop < 24;
    }
    ctx.on(newer, "click", function() {
      log.scrollTop = log.scrollHeight;
      unread = false;
      newer.hidden = true;
      log.focus({ preventScroll: true });
    });
    log.tabIndex = 0;
    ctx.on(log, "scroll", function() {
      if (atEnd()) {
        unread = false;
        newer.hidden = true;
      }
    });
    if (model.proposal) {
      var box = node2("section", "m-product__surface");
      box.append(node2("h3", "m-product__title", L19("assistant.proposalTitle")), node2("p", "", model.proposal.summary));
      ctx.button(box, "execute", model.proposal.label || L19("assistant.proposalActionFallback"), { proposalId: model.proposal.id, revision: model.proposal.revision }, { confirm: true, description: model.proposal.summary });
      root.appendChild(box);
    }
    var composer = node2("div", "m-product__section m-assistant__composer");
    var input = ctx.field(composer, "message", L19("assistant.messageField"), { multiline: true, rows: 1, enterKeyHint: "send" });
    ctx.button(composer, "send", L19("assistant.sendAction"), function() {
      return ctx.fieldsPayload(["message"]);
    }, { primary: true, disabled: !!model.replyPending });
    root.appendChild(composer);
    function grow() {
      var follow = atEnd();
      input.style.blockSize = "auto";
      input.style.blockSize = input.scrollHeight + "px";
      if (follow) log.scrollTop = log.scrollHeight;
    }
    ctx.on(input, "input", grow);
    grow();
    if (!saved || saved.atEnd) log.scrollTop = log.scrollHeight;
    else {
      log.scrollTop = saved.top;
      var anchor = Array.from(log.querySelectorAll("[data-message-id]")).find(function(el2) {
        return el2.dataset.messageId === saved.anchor;
      });
      if (anchor) log.scrollTop += anchor.getBoundingClientRect().top - log.getBoundingClientRect().top - saved.offset;
    }
    if (atEnd()) {
      unread = false;
      newer.hidden = true;
    }
    ctx.cleanup(function() {
      if (generation !== ctx.ui.presentationGeneration) return;
      var top = log.getBoundingClientRect().top;
      var anchor2 = Array.from(log.querySelectorAll("[data-message-id]")).find(function(el2) {
        return el2.getBoundingClientRect().bottom > top;
      });
      ctx.ui.presentation.ask = {
        top: log.scrollTop,
        atEnd: atEnd(),
        anchor: anchor2 ? anchor2.dataset.messageId : null,
        offset: anchor2 ? anchor2.getBoundingClientRect().top - top : 0,
        count: messages.length,
        lastKey,
        unread
      };
    });
  }
  register(type5, render8);

  // components/product-context/review.js
  var MICRO_LABELS_FAMILY23 = "product-context";
  function L20(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY23) || currentInstanceLabels(MICRO_LABELS_FAMILY23);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY23, key2);
  }
  var type6 = "review";
  function render9(ctx) {
    var model = ctx.model, node2 = ctx.node, root = ctx.root;
    root.appendChild(node2("h2", "m-product__title", model.mode === "report" ? L20("review.reportTitle", root) : model.mode === "queue" ? model.title || L20("review.queueTitle", root) : model.title || L20("review.itemTitle", root)));
    if (model.mode === "report") {
      if (model.subjectLabel) root.appendChild(node2("p", "", model.subjectLabel));
      if (model.statusLabel) root.appendChild(node2("span", "m-badge m-badge--info", model.statusLabel));
      ctx.field(root, "reason", L20("review.reasonField", root), { multiline: true });
      if (model.reasonOptions) ctx.field(root, "category", L20("review.categoryField", root), { options: model.reasonOptions });
      ctx.button(root, "submit-report", L20("review.submitAction", root), function() {
        var payload = ctx.fieldsPayload(model.requiredFields || []);
        if (payload) payload.subjectId = model.id;
        return payload;
      }, { confirm: true, description: L20("review.submitConfirm") });
      return;
    }
    if (model.mode === "queue") {
      if (model.subjectLabel) root.appendChild(node2("p", "", model.subjectLabel));
      if (model.phase === "error") {
        if ((model.permissions || []).indexOf("retry") >= 0) ctx.button(root, "retry", L20("operation.actions.retry", root), {});
        return;
      }
      var items = Array.isArray(model.items) ? model.items : [];
      if (!items.length) {
        root.appendChild(node2("p", "m-product__secondary", L20("review.emptyQueue", root)));
        return;
      }
      var list = node2("ul", "m-operational-list");
      items.forEach(function(item) {
        if (!item || item.id == null) return;
        var kindText = item.kind === "listing" ? L20("review.kind.listing") : item.kind === "flag" ? L20("review.kind.flag") : item.kind === "driver-application" ? L20("review.kind.driverApplication") : null;
        var li = node2("li"), row = node2("button", "m-row m-row--operational m-product__queue-item");
        row.type = "button";
        row.dataset.focusKey = "queue-item-" + item.id;
        row.disabled = !ctx.can("open-review");
        var text2 = node2("span", "m-row__text");
        text2.appendChild(node2("strong", "m-row__title", item.title || L20("common.unavailable", text2)));
        var sub = [];
        if (kindText) sub.push(kindText);
        if (item.date) sub.push(item.date);
        if (sub.length) text2.appendChild(node2("span", "m-row__subtitle", sub.join(" · ")));
        row.appendChild(text2);
        if (item.statusLabel) {
          var meta = node2("div", "m-row__meta");
          meta.appendChild(node2("span", "m-badge m-badge--info", item.statusLabel));
          row.appendChild(meta);
        }
        ctx.on(row, "click", function() {
          if (!root.contains(row) || row.disabled) return;
          ctx.request("open-review", { itemId: item.id, revision: item.revision == null ? null : item.revision });
        });
        li.appendChild(row);
        list.appendChild(li);
      });
      if (list.children.length) root.appendChild(list);
      else root.appendChild(node2("p", "m-product__secondary", L20("review.emptyQueue", root)));
      return;
    }
    if (model.subjectLabel) root.appendChild(node2("p", "", model.subjectLabel));
    if (model.statusLabel) root.appendChild(node2("span", "m-badge m-badge--info", model.statusLabel));
    if (model.summary) root.appendChild(node2("p", "", model.summary));
    if (model.reason) ctx.note(root, L20("review.reasonTitle", root), model.reason, "info");
    if ((model.permissions || []).indexOf("view-evidence") >= 0 && model.visibility && model.visibility.evidence) {
      ctx.media(root, model.images, "contain");
    } else if (model.images && model.images.length) {
      root.appendChild(node2("p", "m-product__secondary", L20("review.attachmentsRestricted", root)));
    }
    ctx.field(root, "reason", L20("review.decisionNoteField", root), { multiline: true });
    var actions = node2("div", "m-product__actions");
    root.appendChild(actions);
    [{ id: "approve", label: L20("review.approveAction") }, { id: "reject", label: L20("review.rejectAction") }, { id: "request-info", label: L20("review.requestInfoAction") }].forEach(function(action) {
      if ((model.permissions || []).indexOf(action.id) >= 0) {
        ctx.button(actions, action.id, action.label, function() {
          var payload = ctx.fieldsPayload(model.reasonRequired && action.id === "reject" ? ["reason"] : []);
          if (payload) {
            payload.subjectId = model.id;
            payload.revision = model.revision;
          }
          return payload;
        }, { confirm: true, primary: action.id === "approve", danger: action.id === "reject", description: L20("review.decisionConfirmPrefix") + action.label + L20("review.decisionConfirmOn") + (model.subjectLabel || L20("review.subjectFallback")) + "." });
      }
    });
    if (model.history) ctx.timeline(root, model.history);
  }
  register(type6, render9);

  // components/product-context/manage.js
  var MICRO_LABELS_FAMILY24 = "product-context";
  function L21(key2, el2) {
    var own = el2 && instanceLabelFor(el2, MICRO_LABELS_FAMILY24) || currentInstanceLabels(MICRO_LABELS_FAMILY24);
    if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
    return getLabel(MICRO_LABELS_FAMILY24, key2);
  }
  var type7 = "manage";
  function render10(ctx) {
    var model = ctx.model, node2 = ctx.node, root = ctx.root;
    var head = node2("header", "m-product__header");
    root.appendChild(head);
    head.appendChild(node2("h2", "m-product__title", model.title || L21("manage.title", head)));
    var operations = Array.isArray(model.operations) ? model.operations : [];
    function unitOf(item) {
      return item && item.unit ? item.unit : model.unit || L21("common.unitFallback");
    }
    if (Array.isArray(model.summary) && model.summary.length) {
      var summarySection = node2("section", "m-product__section");
      summarySection.appendChild(node2("h3", "m-product__title", L21("manage.summaryTitle", summarySection)));
      var dl = node2("dl", "m-product__comparison");
      model.summary.forEach(function(item) {
        if (!item || item.label == null || String(item.label).trim() === "") return;
        dl.appendChild(node2("dt", "", item.label));
        var dd = node2("dd");
        if (item.value == null || String(item.value).trim() === "") {
          dd.appendChild(node2("span", "m-product__secondary", L21("common.unavailable", dd)));
        } else {
          var number = node2("bdi", "", item.value);
          number.dir = "ltr";
          dd.append(number, document.createTextNode(" " + unitOf(item)));
        }
        dl.appendChild(dd);
      });
      if (dl.children.length) {
        summarySection.appendChild(dl);
        root.appendChild(summarySection);
      }
    }
    if (operations.length) {
      var listSection = node2("section", "m-product__section");
      listSection.appendChild(node2("h3", "m-product__title", L21("manage.listTitle", listSection)));
      var list = node2("ul", "m-operational-list");
      operations.forEach(function(operation) {
        if (!operation) return;
        var typeText = operation.type === "sale" ? L21("manage.type.sale") : operation.type === "expense" ? L21("manage.type.expense") : null;
        var row = node2("li", "m-row m-row--operational"), text2 = node2("span", "m-row__text");
        text2.appendChild(node2("strong", "m-row__title", operation.description || typeText || L21("common.unavailable", text2)));
        var sub = [];
        if (typeText && operation.description) sub.push(typeText);
        if (operation.date) sub.push(operation.date);
        if (sub.length) text2.appendChild(node2("span", "m-row__subtitle", sub.join(" · ")));
        row.appendChild(text2);
        var reading = node2("span", "m-row__reading");
        var amount = node2("bdi", "", operation.amount == null || String(operation.amount).trim() === "" ? L21("common.unavailable") : operation.amount);
        amount.dir = "ltr";
        reading.append(amount, document.createTextNode(" " + unitOf(operation)));
        row.appendChild(reading);
        list.appendChild(row);
      });
      if (list.children.length) {
        listSection.appendChild(list);
        root.appendChild(listSection);
      }
    } else if (model.phase === "ready") {
      root.appendChild(node2("p", "m-product__secondary", L21("manage.emptyList", root)));
    }
    var form = node2("section", "m-product__section");
    form.appendChild(node2("h3", "m-product__title", L21("manage.formTitle", form)));
    ctx.field(form, "amount", L21("manage.amountField", form), { inputmode: "decimal", unit: model.unit || L21("common.unitFallback", form) });
    ctx.field(form, "type", L21("manage.typeField", form), { options: [{ id: "sale", label: L21("manage.type.sale", form) }, { id: "expense", label: L21("manage.type.expense", form) }] });
    ctx.field(form, "date", L21("manage.dateField", form), { type: "date" });
    ctx.field(form, "note", L21("manage.noteField", form), { multiline: true });
    var actions = node2("div", "m-product__actions m-btn-group m-btn-group--pair");
    var submit = ctx.button(actions, "add-operation", L21("manage.submitAction", submit), function() {
      return ctx.fieldsPayload(model.requiredFields || []);
    }, { primary: true, confirm: true, description: L21("manage.submitConfirm", submit) });
    if (ctx.pending === "add-operation") {
      submit.setAttribute("aria-busy", "true");
      submit.classList.add("is-loading");
      submit.insertBefore(node2("span", "m-btn__spinner"), submit.firstChild);
    }
    var cancel = node2("button", "m-btn m-btn--secondary", L21("manage.clearAction"));
    cancel.type = "button";
    cancel.dataset.focusKey = "clear-operation-form";
    cancel.disabled = !ctx.editable();
    ctx.on(cancel, "click", function() {
      if (!ctx.editable()) return;
      Array.prototype.forEach.call(form.querySelectorAll('[data-focus-key^="field-"]'), function(input) {
        input.value = "";
        input.dispatchEvent(new Event(input.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
      });
    });
    actions.appendChild(cancel);
    form.appendChild(actions);
    root.appendChild(form);
    if (model.phase === "error" && (model.permissions || []).indexOf("retry") >= 0) {
      ctx.button(root, "retry", L21("operation.actions.retry", root), function() {
        return ctx.fieldsPayload(model.requiredFields || []);
      });
    }
  }
  register(type7, render10);

  // shared/icons.js
  var icons_exports = {};
  __export(icons_exports, {
    hydrate: () => hydrate,
    ready: () => ready
  });
  var iconsBase = null;
  function base() {
    if (!iconsBase) iconsBase = new URL("../assets/icons/", scriptBase());
    return iconsBase;
  }
  async function hydrateOne(svg) {
    var file = svg.getAttribute("data-micro-icon");
    if (!/^[a-z0-9-]+\.svg$/.test(file)) throw new Error("Invalid Micro icon filename");
    var response = await fetch(new URL(file, base()));
    if (!response.ok) throw new Error("Micro icon failed to load: " + file);
    var doc = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
    var source = doc.documentElement;
    if (source.localName !== "svg" || doc.querySelector("parsererror")) {
      throw new Error("Invalid Micro SVG: " + file);
    }
    ["viewBox", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(name) {
      if (source.hasAttribute(name)) svg.setAttribute(name, source.getAttribute(name));
    });
    svg.replaceChildren.apply(svg, Array.from(source.childNodes).map(function(node2) {
      return document.importNode(node2, true);
    }));
  }
  function hydrate(root) {
    return Promise.all(Array.from((root || document).querySelectorAll("[data-micro-icon]")).map(hydrateOne));
  }
  var readyPromise = null;
  function ready() {
    if (!readyPromise) readyPromise = hydrate();
    return readyPromise;
  }

  // shared/back.js
  var back_exports = {};
  __export(back_exports, {
    bindBackToLayers: () => bindBackToLayers
  });
  function bindBackToLayers(options) {
    var bound = false;
    var stack = [];
    var pending = 0;
    var consuming = false;
    var silent = 0;
    var counter = 0;
    function onOpen(event) {
      var detail = event.detail || {};
      var layer = detail.layer || (event.target && event.target.nodeType === 1 ? event.target : null);
      if (!layer || stack.some(function(s) {
        return s.layer === layer;
      })) return;
      stack.push({ layer, close: detail.close || null });
      pending += 1;
      counter += 1;
      history.pushState({ __microBack: counter, microLayer: true }, "");
    }
    function closeTop() {
      var top = stack[stack.length - 1];
      if (!top) return;
      var nav = globalApi("Navigation");
      if (typeof top.close === "function") top.close();
      else if (nav) nav.closeLayer(top.layer);
    }
    function onPopState() {
      if (silent > 0) {
        silent -= 1;
        return;
      }
      if (pending > 0) pending -= 1;
      if (!stack.length) return;
      consuming = true;
      try {
        closeTop();
      } finally {
        consuming = false;
      }
    }
    function onClose(event) {
      var detail = event.detail || {};
      var layer = detail.layer || (event.target && event.target.nodeType === 1 ? event.target : null);
      var idx = -1;
      for (var i = 0; i < stack.length; i++) {
        if (stack[i].layer === layer) {
          idx = i;
          break;
        }
      }
      if (idx < 0) return;
      stack.splice(idx, 1);
      if (consuming) return;
      if (pending > 0) pending -= 1;
      if (history.state && history.state.__microBack) {
        var active = document.activeElement;
        var restore = function() {
          window.removeEventListener("popstate", restore);
          if (active && active.nodeType === 1 && active.isConnected && document.activeElement !== active && !active.closest("[inert], [hidden]") && typeof active.focus === "function") {
            active.focus();
          }
        };
        window.addEventListener("popstate", restore);
        silent += 1;
        history.back();
      }
    }
    function bind2() {
      if (bound) return;
      bound = true;
      document.addEventListener("micro-layer:open", onOpen);
      document.addEventListener("micro-layer:close", onClose);
      window.addEventListener("popstate", onPopState);
    }
    bind2();
    return {
      /** عدد الطبقات المسجلة المفتوحة (تشخيص/فحص). */
      openCount: function() {
        return stack.length;
      },
      /** فك الربط الكامل — لا يمس السجل ولا الطبقات المفتوحة. */
      destroy: function() {
        if (!bound) return;
        bound = false;
        document.removeEventListener("micro-layer:open", onOpen);
        document.removeEventListener("micro-layer:close", onClose);
        window.removeEventListener("popstate", onPopState);
        stack = [];
        pending = 0;
        silent = 0;
      }
    };
  }

  // tools/package/.build-entries/micro-ui.mjs
  window.MicroButtons = Object.assign({}, buttons_exports);
  window.MicroFields = Object.assign({}, fields_exports);
  window.MicroSelection = Object.assign({}, selection_exports);
  window.MicroPicker = Object.assign({}, picker_exports);
  window.MicroOrganization = Object.assign({}, organization_exports);
  window.MicroData = Object.assign({}, data_exports);
  window.MicroPacked = Object.assign({}, packed_circle_exports);
  window.MicroMessages = Object.assign({}, messages_exports);
  window.MicroNavigation = Object.assign({}, navigation_exports);
  window.MicroActionSheet = Object.assign({}, action_sheet_exports);
  window.MicroInfoStrip = Object.assign({}, info_strip_exports);
  window.MicroInfoPeek = Object.assign({}, info_strip_peek_exports);
  window.MicroMetricComparison = Object.assign({}, metric_comparison_exports);
  window.MicroAccountSettings = Object.assign({}, account_settings_exports);
  window.MicroAccessGateway = Object.assign({}, access_gateway_exports);
  window.MicroCarousel = Object.assign({}, carousel_exports);
  window.MicroScreen = Object.assign({}, screen_exports);
  window.MicroOrderSchedule = Object.assign({}, order_schedule_exports);
  window.MicroReadings = Object.assign({}, reading_context_exports);
  window.MicroProduct = Object.assign({}, product_aggregate_exports);
  window.MicroIcons = Object.assign({}, icons_exports);
  window.MicroIcons.ready = window.MicroIcons.hydrate();
  window.MicroBack = Object.assign({}, back_exports);
  window.MicroHaptics = Object.assign({}, haptics_exports);
  window.MicroLabels = Object.assign({}, labels_exports);
  Object.defineProperty(window.MicroLabels, "locale", { configurable: true, get: function() {
    return window.MicroLabels.getLocale();
  } });
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
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroPicker.init === "function") window.MicroPicker.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
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
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroData.init === "function") window.MicroData.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroPacked.init === "function") window.MicroPacked.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroMessages.init === "function") window.MicroMessages.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroNavigation.init === "function") window.MicroNavigation.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
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
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroInfoStrip.init === "function") window.MicroInfoStrip.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroInfoPeek.init === "function") window.MicroInfoPeek.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroMetricComparison.init === "function") window.MicroMetricComparison.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
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
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroAccessGateway.init === "function") window.MicroAccessGateway.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroCarousel.init === "function") window.MicroCarousel.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroScreen.init === "function") window.MicroScreen.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroReadings.init === "function") window.MicroReadings.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
})();
