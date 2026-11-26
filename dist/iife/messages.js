if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/messages/messages.js
  var messages_exports = {};
  __export(messages_exports, {
    announce: () => announce,
    closeToast: () => closeToast,
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
    resetAnnouncements: () => resetAnnouncements,
    setLabels: () => setLabels2,
    toast: () => toast
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

  // components/messages/labels.js
  var defaults = {
    "note.missingVariantWarning": "[micro-messages] m-note بلا variant ولا role — لا يمكن اختيار دور إعلاني آمن (D-UI-02/SUI-010): أضف نوعًا (m-note--info/success/warning/error/help) أو role صريحًا."
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

  // components/messages/messages.js
  registerLabels("messages", defaults);
  var MICRO_LABELS_FAMILY = "messages";
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
  var livePolite = null;
  var liveAssertive = null;
  var ANNOUNCE_CAPACITY = 12;
  var ANNOUNCE_LIFETIME_MS = 6e4;
  var announcedIds = [];
  var announcementEpoch = 0;
  var toastStates = /* @__PURE__ */ new WeakMap();
  function on(element, type, handler) {
    if (!element.__microMessageLifetime) element.__microMessageLifetime = new AbortController();
    element.addEventListener(type, handler, { signal: element.__microMessageLifetime.signal });
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
  function announce(text, opts) {
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
          if (announcedIds[i].text === text && now - announcedIds[i].at <= ANNOUNCE_LIFETIME_MS) {
            return;
          }
          announcedIds[i] = { id, text, at: now };
          break;
        }
      }
      if (i === announcedIds.length) {
        announcedIds.push({ id, text, at: now });
      }
      pruneAnnouncedIds(now);
    }
    if (region.textContent === String(text)) {
      region.textContent = "";
      var epoch = announcementEpoch;
      (window.requestAnimationFrame || function(fn) {
        window.setTimeout(fn, 16);
      })(function() {
        if (epoch === announcementEpoch && region.isConnected && region.textContent === "") region.textContent = text;
      });
    } else {
      region.textContent = text;
    }
  }
  function resetAnnouncements() {
    announcedIds = [];
    announcementEpoch++;
  }
  function toastText(el) {
    var t = el.querySelector(".m-toast__text");
    return (t || el).textContent;
  }
  function endToastSession(el) {
    var state = toastStates.get(el);
    if (state) {
      if (state.timer !== null) window.clearTimeout(state.timer);
      el.removeEventListener("focusin", state.focusin);
      el.removeEventListener("focusout", state.focusout);
      toastStates.delete(el);
    }
    delete el.dataset.toastTimer;
  }
  function toast(el, options) {
    if (!el || el.nodeType !== 1) return;
    options = options || {};
    endToastSession(el);
    var state = {
      timer: null,
      remaining: typeof options.duration === "number" ? options.duration : 4e3,
      startedAt: 0,
      returnFocus: options.returnFocus || null
    };
    function pause() {
      if (state.timer === null) return;
      window.clearTimeout(state.timer);
      state.remaining = Math.max(0, state.remaining - (Date.now() - state.startedAt));
      state.timer = null;
      delete el.dataset.toastTimer;
    }
    function resume() {
      if (toastStates.get(el) !== state || state.timer !== null || el.contains(document.activeElement)) return;
      state.startedAt = Date.now();
      state.timer = window.setTimeout(function() {
        if (toastStates.get(el) !== state) return;
        if (!el.isConnected) {
          endToastSession(el);
          return;
        }
        if (el.contains(document.activeElement)) {
          pause();
          return;
        }
        hideToast(el);
        el.dispatchEvent(new Event("micro-messages:toast-dismissed", { bubbles: true }));
      }, state.remaining);
      el.dataset.toastTimer = String(state.timer);
    }
    state.focusin = pause;
    state.focusout = function() {
      Promise.resolve().then(resume);
    };
    toastStates.set(el, state);
    el.addEventListener("focusin", state.focusin);
    el.addEventListener("focusout", state.focusout);
    el.hidden = false;
    announce(toastText(el), false);
    resume();
  }
  function hideToast(el) {
    endToastSession(el);
    el.hidden = true;
  }
  function closeToast(el, trigger) {
    if (!el || el.nodeType !== 1) return;
    var hadFocus = el.contains(document.activeElement);
    var state = toastStates.get(el);
    var target = returnFocusTarget(trigger || document.activeElement || el, el) || state && state.returnFocus;
    hideToast(el);
    if (hadFocus && target && target.nodeType === 1 && target.isConnected && !target.disabled && target.getAttribute("aria-disabled") !== "true" && !target.closest("[hidden], [inert]") && (typeof target.checkVisibility !== "function" || target.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))) {
      target.focus();
    }
    el.dispatchEvent(new Event("micro-messages:toast-closed", { bubbles: true }));
  }
  function returnFocusTarget(btn, note) {
    var sel = btn.getAttribute("data-return-focus") || note.getAttribute("data-return-focus");
    if (!sel) return null;
    try {
      return document.querySelector(sel);
    } catch (e) {
      return null;
    }
  }
  var NOTE_ROLE_BY_VARIANT = { help: "note", info: "status", success: "status", warning: "status", error: "alert" };
  function noteVariantOf(note) {
    var cls = " " + (note.className || "") + " ";
    for (var v in NOTE_ROLE_BY_VARIANT) {
      if (cls.indexOf(" m-note--" + v + " ") >= 0) return v;
    }
    return null;
  }
  function ensureNoteRoles(scope) {
    var base = scope && scope.querySelectorAll ? scope : document;
    var list = [].slice.call(base.querySelectorAll(".m-note"));
    if (scope && scope.nodeType === 1 && scope.matches && scope.matches(".m-note")) list.unshift(scope);
    list.forEach(function(note) {
      if (note.getAttribute("role")) return;
      var v = noteVariantOf(note);
      if (v) note.setAttribute("role", NOTE_ROLE_BY_VARIANT[v]);
      else if (window.console && console.warn) {
        console.warn(L("note.missingVariantWarning", note), note);
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
      if (!claimBinding(btn, "microNoteBound")) return;
      on(btn, "click", function() {
        var note = btn.closest(".m-note");
        if (!note) return;
        var target = returnFocusTarget(btn, note);
        note.hidden = true;
        if (target && !target.disabled && typeof target.focus === "function") {
          target.focus();
        }
        note.dispatchEvent(new CustomEvent("micro-messages:note-closed", {
          bubbles: true,
          detail: { returnFocus: !!target }
        }));
      });
    });
    inScope(".m-toast [data-toast-close]").forEach(function(btn) {
      if (!claimBinding(btn, "microToastCloseBound")) return;
      on(btn, "click", function() {
        closeToast(btn.closest(".m-toast"), btn);
      });
    });
  }
  function disconnect(root) {
    destroy(root);
  }
  function teardown(root) {
    var scope = root || document;
    var nodes = [scope].concat([].slice.call(scope.querySelectorAll("*")));
    nodes.forEach(function(element) {
      liveBindings.delete(element);
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
  var registry = instanceRegistry();
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = registry.get(scope);
    if (existing) {
      withLabels2(scope, function() {
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
        withLabels2(scope, function() {
          ensureNoteRoles(scope);
          bindClose(scope);
        });
      },
      /** يفك المستمعات ويوقف مؤقتات toast — لا يمس نصوص الرسائل. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        registry.remove(scope);
      }
    };
    withLabels2(scope, function() {
      ensureNoteRoles(scope);
      bindClose(scope);
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
  function setLabels2(partial) {
    setLabels("messages", partial);
  }

  // tools/package/.build-entries/iife/messages.mjs
  window.MicroMessages = Object.assign({}, messages_exports);
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
})();
