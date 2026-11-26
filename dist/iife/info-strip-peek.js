if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/info-strip/info-strip-peek.js
  var info_strip_peek_exports = {};
  __export(info_strip_peek_exports, {
    destroy: () => destroy,
    disconnect: () => disconnect,
    getIndex: () => getIndex,
    getInstance: () => getInstance,
    goTo: () => goToIndex,
    init: () => init,
    next: () => next,
    prev: () => prev,
    setLabels: () => setLabels2,
    update: () => updateApi
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

  // components/info-strip/info-strip-peek.js
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
  var reduceQuery = null;
  function prefersReducedMotion() {
    if (!reduceQuery && typeof window !== "undefined" && window.matchMedia) {
      reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    }
    return !!(reduceQuery && reduceQuery.matches);
  }
  var stateOf = /* @__PURE__ */ new WeakMap();
  var viewportObservers = /* @__PURE__ */ new WeakMap();
  var RESIZE_EPS = 0.5;
  function recenterStrip(strip, st) {
    if (st.disconnected) return;
    if (st.raf) return;
    st.raf = requestAnimationFrame(function() {
      st.raf = null;
      if (st.disconnected || st.count <= 0) return;
      var w = st.viewport.clientWidth;
      if (w <= 1) return;
      var direction = getComputedStyle(strip).direction;
      if (st.lastWidth !== void 0 && Math.abs(w - st.lastWidth) < RESIZE_EPS && direction === st.lastDirection) return;
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
    var st = stateOf.get(strip);
    if (!st || st.disconnected || st.count === 0) return;
    var animate = !(opts && opts.animate === false);
    var clamped = Math.max(0, Math.min(st.count - 1, i));
    scrollToSlide(st, clamped, animate);
    if (clamped !== st.index) {
      st.index = clamped;
      update(strip, st);
      strip.dispatchEvent(new CustomEvent("micro-info-peek:change", {
        bubbles: true,
        detail: { index: st.index, count: st.count }
      }));
    } else {
      update(strip, st);
    }
  }
  function update(strip, st) {
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
    if (st.status) st.status.textContent = L("peek.status.positionPrefix", status) + (st.index + 1) + L("peek.status.ofSeparator", status) + st.count;
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
          update(strip, st);
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
  function isEditingTarget(target) {
    return !!(target && (target.isContentEditable || target.closest && target.closest(
      'input, textarea, select, option, [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], [role="slider"], [data-info-strip-editable]'
    )));
  }
  function listenDom(st, element, type, handler, options) {
    element.addEventListener(type, handler, options);
    if (!st.domListeners) st.domListeners = [];
    st.domListeners.push({ element, type, handler, options });
  }
  function wireKeys(strip, st) {
    listenDom(st, strip, "keydown", function(e) {
      if (st.disconnected || e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || st.count === 0) return;
      var target = e.target;
      if (isEditingTarget(target)) return;
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
    if (reduceQuery && reduceQuery.addEventListener && !st.motionHandler) {
      st.motionHandler = function() {
        goToIndex(strip, st.index, { animate: false });
      };
      reduceQuery.addEventListener("change", st.motionHandler);
    }
    observeViewport(strip, st);
    if (!st.directionObserver && typeof MutationObserver === "function") {
      var observer = new MutationObserver(function() {
        if (st.disconnected || st.directionObserver !== observer || getComputedStyle(strip).direction === st.lastDirection) return;
        recenterStrip(strip, st);
      });
      st.directionObserver = observer;
      for (var node = strip; node; node = node.parentElement) {
        observer.observe(node, { attributes: true, attributeFilter: ["dir", "class", "style"] });
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
  function initStrip(strip) {
    if (stateOf.has(strip)) {
      var reSt = stateOf.get(strip);
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
      if (status2) status2.textContent = L("peek.status.empty", status2);
      stateOf.set(strip, {
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
    stateOf.set(strip, st);
    if (pages) {
      pages.setAttribute("role", "group");
      if (!pages.hasAttribute("aria-label")) pages.setAttribute("aria-label", L("peek.pages.ariaLabel", pages));
      pages.textContent = "";
      slides.forEach(function(_, i) {
        var page = document.createElement("button");
        page.type = "button";
        page.className = "m-info-strip__page";
        page.setAttribute("data-info-strip-page", "");
        page.setAttribute("aria-label", L("peek.page.showPrefix", page) + (i + 1));
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
    update(strip, st);
    recenterStrip(strip, st);
  }
  function next(strip) {
    var st = stateOf.get(strip);
    if (st) goToIndex(strip, st.index + 1);
  }
  function prev(strip) {
    var st = stateOf.get(strip);
    if (st) goToIndex(strip, st.index - 1);
  }
  var instances = instanceRegistry();
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = instances.get(scope);
    if (existing) {
      withLabels2(scope, function() {
        if (scope.matches && scope.matches("[data-info-peek]")) initStrip(scope);
        scope.querySelectorAll("[data-info-peek]").forEach(initStrip);
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
        var st = stripEl ? stateOf.get(stripEl) : null;
        var index = typeof updateOptions.index === "number" ? updateOptions.index : st ? st.index : 0;
        withLabels2(scope, function() {
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
        teardown(scope);
        instances.remove(scope);
      }
    };
    withLabels2(scope, function() {
      if (scope.matches && scope.matches("[data-info-peek]")) initStrip(scope);
      scope.querySelectorAll("[data-info-peek]").forEach(initStrip);
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
  function updateApi(strip, index, options) {
    goToIndex(strip, index, options);
  }
  function getIndex(strip) {
    var st = stateOf.get(strip);
    return st ? st.index : -1;
  }
  function disconnect(root) {
    destroy(root);
  }
  function teardown(root) {
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
      var st = stateOf.get(strip);
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
          reduceQuery.removeEventListener("change", st.motionHandler);
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
  function setLabels2(partial) {
    setLabels("info-strip", partial);
  }

  // tools/package/.build-entries/iife/info-strip-peek.mjs
  window.MicroInfoPeek = Object.assign({}, info_strip_peek_exports);
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
})();
