if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/info-strip/info-strip.js
  var info_strip_exports = {};
  __export(info_strip_exports, {
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
    rescan: () => rescan,
    setLabels: () => setLabels2,
    update: () => rescan
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

  // components/info-strip/labels.js
  var defaults = {
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

  // shared/lifecycle.js
  function instanceRegistry() {
    var instances2 = /* @__PURE__ */ new WeakMap();
    function key(root) {
      return root || document;
    }
    return {
      get: function(root) {
        var instance = instances2.get(key(root));
        return instance && !instance.__destroyed ? instance : null;
      },
      set: function(root, instance) {
        instances2.set(key(root), instance);
      },
      remove: function(root) {
        instances2.delete(key(root));
      }
    };
  }

  // components/info-strip/info-strip.js
  registerLabels("info-strip", defaults);
  var MICRO_LABELS_FAMILY = "info-strip";
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
  function isEditingTarget(target) {
    return !!(target && (target.isContentEditable || target.closest && target.closest(
      'input, textarea, select, option, [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], [role="slider"], [data-info-strip-editable]'
    )));
  }
  var registry = /* @__PURE__ */ new WeakMap();
  function initStrip(strip) {
    if (strip.hasAttribute("data-info-peek")) return;
    if (registry.has(strip)) return;
    var viewport = strip.querySelector("[data-info-strip-viewport]");
    var track = strip.querySelector("[data-info-strip-track]");
    if (!viewport || !track) return;
    strip.setAttribute("data-info-strip-ready", "");
    var listeners = [];
    function on(elm, type, fn) {
      elm.addEventListener(type, fn, false);
      listeners.push({ el: elm, type, fn });
    }
    var controls = strip.querySelector("[data-info-strip-controls]");
    var previous = strip.querySelector("[data-info-strip-prev]");
    var next = strip.querySelector("[data-info-strip-next]");
    var pageList = strip.querySelector("[data-info-strip-pages]");
    var position = strip.querySelector("[data-info-strip-position]");
    var status = strip.querySelector("[data-info-strip-status]");
    var empty = strip.querySelector("[data-info-strip-empty]");
    var index = 0;
    var startX = null;
    var startY = null;
    var moved = false;
    var pageButtons = [];
    function slides() {
      return Array.prototype.slice.call(track.children).filter(function(node) {
        return node.classList.contains("m-info-strip__slide");
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
      if (!pageList.hasAttribute("aria-label")) pageList.setAttribute("aria-label", L("pages.ariaLabel", pageList));
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
      if (next) next.disabled = index === list.length - 1;
      if (position) position.textContent = index + 1 + " / " + list.length;
      if (status) status.textContent = L("status.positionPrefix", status) + (index + 1) + L("status.ofSeparator", status) + list.length;
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
        page.setAttribute("aria-label", L("page.showPrefix", page) + (pageIndex + 1));
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
    if (previous) on(previous, "click", function() {
      setIndex(index - 1, false);
    });
    if (next) on(next, "click", function() {
      setIndex(index + 1, false);
    });
    on(strip, "keydown", function(event) {
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
    on(viewport, "pointerdown", function(event) {
      if (isEditingTarget(event.target)) return;
      if (event.pointerType !== "touch" || event.isPrimary === false) return;
      startX = event.clientX;
      startY = event.clientY;
      moved = false;
    });
    on(viewport, "pointerup", function(event) {
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
    on(viewport, "pointercancel", function() {
      startX = null;
      startY = null;
    });
    on(viewport, "click", function(event) {
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
    if (next) next.disabled = initial.length < 2;
    if (position) position.textContent = initial.length ? "1 / " + initial.length : "";
    if (status) status.textContent = initial.length ? L("status.initialPrefix", status) + initial.length : L("status.empty", status);
    registry.set(strip, {
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
    var data = registry.get(strip);
    if (!data) return;
    data.listeners.forEach(function(L2) {
      L2.el.removeEventListener(L2.type, L2.fn, false);
    });
    registry.delete(strip);
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
  var instances = instanceRegistry();
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = instances.get(scope);
    if (existing) {
      withLabels2(scope, function() {
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
        withLabels2(scope, function() {
          rescan(scope);
        });
      },
      /** يفك مستمعات كل شريط (لا يمس بطاقات المضيف ولا حالتها). */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        instances.remove(scope);
      }
    };
    withLabels2(scope, function() {
      if (scope.matches && scope.matches("[data-info-strip]")) initStrip(scope);
      scope.querySelectorAll("[data-info-strip]").forEach(initStrip);
    });
    instances.set(scope, instance);
    return instance;
  }
  function getInstance(root) {
    return instances.get(root);
  }
  function destroy(root) {
    var instance = instances.get(root);
    if (instance) instance.destroy();
    else teardown(root || document);
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
  function disconnect(root) {
    destroy(root);
  }
  function teardown(root) {
    var scope = root || document;
    if (scope.matches && scope.matches("[data-info-strip]")) teardownStrip(scope);
    scope.querySelectorAll("[data-info-strip]").forEach(teardownStrip);
  }
  function setLabels2(partial) {
    setLabels("info-strip", partial);
  }

  // tools/package/.build-entries/iife/info-strip.mjs
  window.MicroInfoStrip = Object.assign({}, info_strip_exports);
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
})();
