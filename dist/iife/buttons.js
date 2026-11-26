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
    var nodes = [].slice.call(btn.childNodes).filter(function(n) {
      return n.nodeType === 3 && n.textContent.trim() !== "";
    });
    if (!nodes.length) return;
    nodes.forEach(function(n) {
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

  // tools/package/.build-entries/iife/buttons.mjs
  window.MicroButtons = Object.assign({}, buttons_exports);
})();
