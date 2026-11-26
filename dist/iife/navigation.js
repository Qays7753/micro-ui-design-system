if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/navigation/navigation.js
  var navigation_exports = {};
  __export(navigation_exports, {
    appliedFilters: () => appliedFilters,
    closeLayer: () => closeLayer,
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
    openLayer: () => openLayer,
    requestClose: () => requestClose,
    setAppliedFilters: () => setAppliedFilters,
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

  // shared/haptics.js
  var STATE_KEY = "__microHapticsEnabled";
  function vibrateAvailable() {
    return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
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

  // components/navigation/navigation.js
  registerLabels("navigation", defaults);
  var MICRO_LABELS_FAMILY = "navigation";
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
  function on(owner, element, type, handler) {
    if (!owner.__microNavigationLifetime) owner.__microNavigationLifetime = new AbortController();
    element.addEventListener(type, handler, { signal: owner.__microNavigationLifetime.signal });
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
  function inDocument(el) {
    return !!(el && el.nodeType === 1 && document.contains(el));
  }
  function isDisabled(el) {
    return el.disabled || el.getAttribute("aria-disabled") === "true";
  }
  function focusables(layer) {
    return [].slice.call(layer.querySelectorAll(
      "button, a[href], area[href], input, select, textarea, [tabindex]"
    )).filter(function(el) {
      if (isDisabled(el)) return false;
      var ti = el.getAttribute("tabindex");
      if (ti !== null && parseInt(ti, 10) < 0) return false;
      if (el.closest("[inert]")) return false;
      if (typeof el.checkVisibility === "function") {
        return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      }
      return el.offsetParent !== null || el.getClientRects().length > 0;
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
  function allowedOutside(el) {
    return el.classList.contains("m-live-region") || el.classList.contains("m-toast");
  }
  function isolateSiblings(container, layer, backdrop) {
    [].slice.call(container.children).forEach(function(el) {
      if (el === layer || el === backdrop) return;
      if (allowedOutside(el)) return;
      if (el.contains(layer)) {
        isolateSiblings(el, layer, backdrop);
        return;
      }
      inertRestore.push({ el, inert: el.inert });
      el.inert = true;
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
      var changed = records.some(function(record) {
        return record.target !== active && record.target.contains(active) && [].slice.call(record.addedNodes).concat([].slice.call(record.removedNodes)).some(function(node) {
          return node.nodeType === 1;
        });
      });
      if (changed) applyBackgroundInert();
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
    if (!claimBinding(layer, "microTrapBound")) return;
    on(layer, layer, "keydown", function(e) {
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
          console.warn(L("layer.unnamedWarning", layer), layer);
        }
      }
    } else if (window.console && console.warn) {
      console.warn(L("layer.unusualRolePrefix", layer) + role + L("layer.unusualRoleSuffix", layer), layer);
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
    var backdrop = options.backdropEl || (layer.getAttribute("data-backdrop-id") ? document.getElementById(layer.getAttribute("data-backdrop-id")) : null) || document.querySelector('.m-layer-backdrop[data-for="' + layer.id + '"]');
    var st = closeState.get(layer);
    var trigger = options.trigger || document.activeElement;
    if (!inDocument(trigger) || layer.contains(trigger)) {
      trigger = st && st.lastTrigger && inDocument(st.lastTrigger) ? st.lastTrigger : null;
    }
    if (trigger && isDisabled(trigger)) trigger = null;
    layer.hidden = false;
    layer.inert = false;
    if (backdrop) backdrop.hidden = false;
    lockScroll();
    bindTrap(layer);
    if (!layer.hasAttribute("tabindex")) layer.setAttribute("tabindex", "-1");
    openLayers.push({ layer, backdrop, trigger });
    applyBackgroundInert();
    var f = focusables(layer);
    var first = layer.querySelector("[data-autofocus]");
    if (!(first && !isDisabled(first) && f.indexOf(first) >= 0)) first = f[0];
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
      var usable = t && inDocument(t) && !isDisabled(t) && !t.closest("[inert], [hidden]") && (!top || top.contains(t));
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
    if (n === 1) return L("filters.count.one");
    if (n === 2) return L("filters.count.two");
    if (n >= 3 && n <= 10) return n + L("filters.count.fewSuffix");
    if (n >= 11 && n <= 99) return n + L("filters.count.manySuffix");
    var r = n % 100;
    if (r === 0) return n + L("filters.count.hundredSuffix");
    if (r === 1) return n + L("filters.count.hundredOneSuffix");
    if (r === 2) return n + L("filters.count.hundredTwoSuffix");
    if (r >= 3 && r <= 10) return n + L("filters.count.fewSuffix");
    return n + L("filters.count.manySuffix");
  }
  function updateSummary(panel, phase) {
    var summary = panel.querySelector("[data-filter-summary]");
    if (!summary) return;
    var actives = draftInputs(panel).filter(function(input) {
      var key = input.getAttribute("data-filter-key");
      return !!key && key !== "none" && inputActive(input);
    });
    if (!actives.length) {
      summary.textContent = phase + L("filters.summary.emptySuffix", summary);
      return;
    }
    var labels = [];
    actives.forEach(function(input) {
      var l = filterLabel(input);
      if (l && labels.indexOf(l) < 0) labels.push(l);
    });
    summary.textContent = labels.length === actives.length ? phase + ": " + labels.join(L("filters.summary.separator")) : phase + ": " + filterCountAr(actives.length);
  }
  function initFilterPanel(panel) {
    if (!claimBinding(panel, "microFilterBound")) return;
    var applied = panel.__microApplied || {};
    on(panel, panel, "micro-navigation:opened", function() {
      draftInputs(panel).forEach(function(input) {
        var key = input.getAttribute("data-filter-key");
        if (Object.prototype.hasOwnProperty.call(applied, key)) {
          if (input.type === "checkbox") input.checked = applied[key] === true;
          else input.value = typeof applied[key] === "string" ? applied[key] : "";
        } else if (input.type === "checkbox") {
          input.checked = false;
        } else {
          input.value = "";
        }
      });
      updateSummary(panel, L("filters.summary.current", panel));
    });
    on(panel, panel, "change", function(e) {
      if (e.target.closest && e.target.closest("[data-filter-key]")) updateSummary(panel, L("filters.summary.current", e.target));
    });
    on(panel, panel, "input", function(e) {
      if (e.target.closest && e.target.closest('[data-filter-key][type="search"], [data-filter-key][type="text"]')) {
        updateSummary(panel, L("filters.summary.current", panel));
      }
    });
    var apply = panel.querySelector("[data-filter-apply]");
    if (apply) on(panel, apply, "click", function() {
      applied = {};
      draftInputs(panel).forEach(function(input) {
        var key = input.getAttribute("data-filter-key");
        if (!key || key === "none") return;
        if (input.type === "checkbox") applied[key] = input.checked;
        else applied[key] = String(input.value == null ? "" : input.value).trim();
      });
      updateSummary(panel, L("filters.summary.applied", panel));
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
    if (clear) on(panel, clear, "click", function() {
      draftInputs(panel).forEach(function(input) {
        if (input.disabled || input.readOnly) return;
        if (input.type === "checkbox") input.checked = false;
        else input.value = "";
      });
      updateSummary(panel, L("filters.summary.current", panel));
    });
    var cancel = panel.querySelector("[data-filter-cancel]");
    if (cancel) on(panel, cancel, "click", function() {
      closeLayer(panel);
    });
    panel.__microSetApplied = function(values) {
      applied = {};
      var src = values && typeof values === "object" ? values : {};
      draftInputs(panel).forEach(function(input) {
        var key = input.getAttribute("data-filter-key");
        if (!key || key === "none") return;
        var has = Object.prototype.hasOwnProperty.call(src, key);
        if (input.type === "checkbox") {
          applied[key] = has ? src[key] === true : false;
          input.checked = applied[key] === true;
        } else {
          applied[key] = has && typeof src[key] === "string" ? String(src[key]).trim() : "";
          input.value = applied[key];
        }
      });
      updateSummary(panel, L("filters.summary.applied", panel));
      panel.__microApplied = Object.assign({}, applied);
    };
  }
  function initTabs(tabs) {
    if (!claimBinding(tabs, "microTabsBound")) return;
    var items = [].slice.call(tabs.querySelectorAll('[role="tab"]'));
    var FOCUSABLE_IN = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    function panelOf(t) {
      var id = t.getAttribute("aria-controls");
      return id ? document.getElementById(id) : null;
    }
    function firstFocusableIn(panel) {
      var candidates = panel.querySelectorAll(FOCUSABLE_IN);
      for (var i = 0; i < candidates.length; i++) {
        var el = candidates[i];
        if (el.closest("[hidden]")) continue;
        if (el.disabled) continue;
        if (typeof el.checkVisibility === "function" && !el.checkVisibility({ checkVisibilityCSS: true })) continue;
        return el;
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
        var on2 = t === tab;
        t.setAttribute("aria-selected", on2 ? "true" : "false");
        t.tabIndex = on2 ? 0 : -1;
        var panel = panelOf(t);
        if (panel) panel.hidden = !on2;
      });
      syncPanelTabindex(tab);
      keepVisible(tab);
    }
    items.forEach(function(t, i) {
      on(tabs, t, "click", function() {
        select(t);
      });
      on(tabs, t, "keydown", function(e) {
        var next = null;
        var rtl = getComputedStyle(tabs).direction === "rtl";
        if (e.key === "ArrowLeft") next = items[(i + (rtl ? 1 : -1) + items.length) % items.length];
        else if (e.key === "ArrowRight") next = items[(i + (rtl ? -1 : 1) + items.length) % items.length];
        else if (e.key === "Home") next = items[0];
        else if (e.key === "End") next = items[items.length - 1];
        if (next) {
          e.preventDefault();
          next.focus();
          keepVisible(next);
          select(next);
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
  var instances = instanceRegistry();
  function bindScope(scope) {
    var inScope = function(selector) {
      var list = [].slice.call(scope.querySelectorAll(selector));
      if (scope.nodeType === 1 && scope.matches(selector)) list.unshift(scope);
      return list;
    };
    inScope("[data-layer-open]").forEach(function(btn) {
      if (!claimBinding(btn, "microLayerOpenBound")) return;
      on(btn, btn, "click", function() {
        var layer = document.getElementById(btn.getAttribute("data-layer-open"));
        if (layer) openLayer(layer, { trigger: btn });
      });
    });
    inScope("[data-layer-close]").forEach(function(btn) {
      if (!claimBinding(btn, "microLayerCloseBound")) return;
      on(btn, btn, "click", function() {
        requestClose(btn.closest(".m-layer"), { reason: "close-button", trigger: btn });
      });
    });
    inScope(".m-layer-backdrop[data-for]").forEach(function(bd) {
      if (!claimBinding(bd, "microBackdropBound")) return;
      on(bd, bd, "click", function() {
        var layer = document.getElementById(bd.getAttribute("data-for"));
        if (!layer) return;
        if ((layer.getAttribute("data-backdrop") || "close") === "close") requestClose(layer, { reason: "backdrop", trigger: bd });
      });
    });
    inScope("[data-tabs]").forEach(initTabs);
    inScope("[data-filter-panel]").forEach(initFilterPanel);
  }
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = instances.get(scope);
    if (existing) {
      withLabels2(scope, function() {
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
        withLabels2(scope, function() {
          bindScope(scope);
        });
      },
      /** يغلق الطبقات المفتوحة ويفك المستمعات ويرجع inert الخلفية. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        unbindDocument();
        instances.remove(scope);
      }
    };
    withLabels2(scope, function() {
      bindScope(scope);
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
  function disconnect(root) {
    destroy(root);
  }
  function teardown(root) {
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
      liveBindings.delete(element);
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
        ].forEach(function(key) {
          delete element.dataset[key];
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
  function setLabels2(partial) {
    setLabels("navigation", partial);
  }

  // tools/package/.build-entries/iife/navigation.mjs
  window.MicroNavigation = Object.assign({}, navigation_exports);
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
})();
