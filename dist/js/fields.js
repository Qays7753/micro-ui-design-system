(() => {
  (function() {
    "use strict";
    var MICRO_LABELS_FAMILY = "fields";
    function L(key) {
      var family = window.MicroLabels && window.MicroLabels[MICRO_LABELS_FAMILY];
      return family ? family[key] : void 0;
    }
    function microAutoInit() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false);
    }
    var msgUid = 0;
    function on(field, element, type, listener, capture) {
      element.addEventListener(type, listener, {
        capture: !!capture,
        signal: field.__microFieldLifetime.signal
      });
    }
    function fieldOf(el) {
      return el.closest("[data-micro-field]");
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
    function init(root) {
      var scope = root || document;
      var fields = [].slice.call(scope.querySelectorAll("[data-micro-field]"));
      if (scope.matches && scope.matches("[data-micro-field]")) fields.unshift(scope);
      fields.forEach(function(f) {
        if (f.dataset.microFieldBound && f.__microFieldLifetime && !f.__microFieldLifetime.signal.aborted) return;
        f.dataset.microFieldBound = "1";
        f.__microFieldLifetime = new AbortController();
        bindControlFocus(f);
        bindCount(f);
        bindClear(f);
        bindStepper(f);
        bindMessage(f);
      });
    }
    function sync(root) {
      var scope = root && typeof root.querySelectorAll === "function" ? root : document;
      if (scope.nodeType === 1 && scope.matches("[data-micro-field]")) {
        runSyncs(scope);
      }
      scope.querySelectorAll("[data-micro-field]").forEach(runSyncs);
    }
    function disconnect(root) {
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
    window.MicroFields = { init, sync, update: sync, disconnect, destroy: disconnect };
    window.MicroFields.setLabels = function(partial) {
      var registry = window.MicroLabels = window.MicroLabels || {};
      var current = registry["fields"] = registry["fields"] || {};
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
      if (microAutoInit()) init();
    });
    if (document.readyState !== "loading" && microAutoInit()) init();
  })();
})();
