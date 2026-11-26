if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/screen/screen.js
  var screen_exports = {};
  __export(screen_exports, {
    destroy: () => destroy,
    getInstance: () => getInstance,
    init: () => init,
    update: () => update
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
  function resourceTracker() {
    var listeners = [];
    var observers = [];
    var timers = [];
    var stopped = false;
    function on(target, type, handler, options) {
      if (stopped) return;
      target.addEventListener(type, handler, options);
      listeners.push({ target, type, handler, options });
    }
    function off(target, type, handler, options) {
      target.removeEventListener(type, handler, options);
      listeners = listeners.filter(function(entry) {
        return !(entry.target === target && entry.type === type && entry.handler === handler);
      });
    }
    function trackObserver(observer) {
      if (!stopped) observers.push(observer);
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
      var pendingObservers = observers.splice(0);
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
      on,
      off,
      trackObserver,
      wrapController,
      later,
      every,
      frame,
      stopAll
    };
  }

  // components/screen/screen.js
  var registry = instanceRegistry();
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
          var open = keyboard > KEYBOARD_THRESHOLD;
          screen.setAttribute("data-keyboard", open ? "true" : "false");
          screen.style.setProperty("--m-screen-keyboard", (open ? keyboard : 0) + "px");
          if (open) keepFocusedVisible(screen);
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
  function init(root, options) {
    var scope = root && root.matches && root.matches("[data-micro-screen]") ? root : document;
    var existing = registry.get(scope === document ? null : scope);
    if (existing) return existing;
    var screens = scope === document ? document.querySelectorAll("[data-micro-screen]") : [scope];
    var bound = [];
    screens.forEach(function(screen) {
      var instance = registry.get(screen);
      if (instance) return;
      var tracker = resourceTracker();
      instance = initScreen(screen, tracker);
      instance.__destroyed = false;
      instance.destroy = /* @__PURE__ */ (function(original) {
        return function() {
          original();
          tracker.stopAll();
          instance.__destroyed = true;
          registry.remove(screen);
        };
      })(instance.destroy);
      registry.set(screen, instance);
      bound.push(instance);
    });
    if (scope !== document) return registry.get(scope);
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
  function update(root) {
    var scope = root || document;
    var screens = scope.matches && scope.matches("[data-micro-screen]") ? [scope] : scope.querySelectorAll("[data-micro-screen]");
    screens.forEach(function(screen) {
      var instance = registry.get(screen);
      if (instance) instance.update();
      else measureBars(screen);
    });
  }
  function destroy(root) {
    var scope = root || document;
    var screens = scope.matches && scope.matches("[data-micro-screen]") ? [scope] : scope.querySelectorAll("[data-micro-screen]");
    screens.forEach(function(screen) {
      var instance = registry.get(screen);
      if (instance) instance.destroy();
    });
  }
  function getInstance(root) {
    var scope = root || document;
    if (scope.matches && scope.matches("[data-micro-screen]")) return registry.get(scope);
    var screen = scope.querySelector("[data-micro-screen]");
    return screen ? registry.get(screen) : null;
  }

  // tools/package/.build-entries/iife/screen.mjs
  window.MicroScreen = Object.assign({}, screen_exports);
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
})();
