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

export {
  instanceRegistry,
  resourceTracker
};
