(() => {
  (function() {
    "use strict";
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
    function ensureLiveRegion() {
      return ensureLiveChannel("polite");
    }
    function pruneAnnouncedIds(now) {
      for (var i = announcedIds.length - 1; i >= 0; i--) {
        if (now - announcedIds[i].at > ANNOUNCE_LIFETIME_MS) announcedIds.splice(i, 1);
      }
      while (announcedIds.length > ANNOUNCE_CAPACITY) announcedIds.shift();
    }
    function announce(text, opts) {
      var id, assertive;
      if (opts && typeof opts === "object") {
        id = opts.id;
        assertive = !!opts.assertive;
      } else {
        assertive = !!opts;
        id = void 0;
      }
      var region = ensureLiveChannel(assertive ? "assertive" : "polite");
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
          console.warn("[micro-messages] m-note بلا variant ولا role — لا يمكن اختيار دور إعلاني آمن (D-UI-02/SUI-010): أضف نوعًا (m-note--info/success/warning/error/help) أو role صريحًا.", note);
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
    window.MicroMessages = {
      disconnect: function(root) {
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
      },
      toast,
      closeToast,
      announce,
      resetAnnouncements,
      /* W2.5: init(root) يشمل الجذر نفسه؛ W2.2: يضمن أدوار m-note قبل التفاعل */
      init: function(root) {
        ensureNoteRoles(root);
        bindClose(root);
      }
    };
    document.addEventListener("DOMContentLoaded", function() {
      window.MicroMessages.init();
    });
    if (document.readyState !== "loading") window.MicroMessages.init();
  })();
})();
