/* =========================================================
   Micro UI — أدوات العقد الموحد لدورة الحياة (الجولة الثانية R4).
   الملف: shared/lifecycle.js

   لكل مدخل JS (عدا icons وlabels): init(root, options?) يعيد instance
   له update/destroy، مع destroy(root) وgetInstance(root) كصادرات مريحة.
   هذا الملف يوفر البنية المشتركة:

   - instanceRegistry(): سجل WeakMap جذر ← مثيل؛ init على جذر له مثيل
     حي يعيد المثيل نفسه ولا يضاعف الربط (R4 قاعدة 1).
   - resourceTracker(): متعقّب موارد لكل مثيل — مستمعات (على أي هدف)
     ومراقبات (Resize/Mutation/Intersection) ومؤقتات (timeout/interval/
     rAF) — وstopAll() يزيلها كلها (R4 قاعدة 4: بعد destroy لا مستمع
     على window/document/root ولا مراقب حي ولا مؤقت معلق).

   لا وصول إلى window أو document في المستوى الأعلى للوحدة (R-D2).
   ========================================================= */

/** سجل مثيلات لكل عائلة: WeakMap(جذر ← مثيل). */
export function instanceRegistry() {
  var instances = new WeakMap();
  function key(root) { return root || document; }
  return {
    get: function (root) {
      var instance = instances.get(key(root));
      /* مثيل مدمر يُزال من السجل فورًا — لا يُعاد أبدًا بعد destroy. */
      return instance && !instance.__destroyed ? instance : null;
    },
    set: function (root, instance) {
      instances.set(key(root), instance);
    },
    remove: function (root) {
      instances.delete(key(root));
    },
  };
}

/** متعقّب موارد مثيل واحد: مستمعات ومراقبات ومؤقتات تُزال معًا عند stopAll. */
export function resourceTracker() {
  var listeners = []; /* { target, type, handler, options } */
  var observers = []; /* كائنات لها disconnect() (أو abort() — عبر wrapObserver) */
  var timers = [];    /* { kind: 'timeout'|'interval'|'raf', id } */
  var stopped = false;

  function on(target, type, handler, options) {
    if (stopped) return;
    target.addEventListener(type, handler, options);
    listeners.push({ target: target, type: type, handler: handler, options: options });
  }

  /** إزالة يدوية لمستمع مسجل مسبقًا (مسارات التنظيف الانتقائية). */
  function off(target, type, handler, options) {
    target.removeEventListener(type, handler, options);
    listeners = listeners.filter(function (entry) {
      return !(entry.target === target && entry.type === type && entry.handler === handler);
    });
  }

  /** تسجيل مراقب (Resize/Mutation/Intersection...) — يعاد كما هو. */
  function trackObserver(observer) {
    if (!stopped) observers.push(observer);
    return observer;
  }

  /** تغليف كائن إبطال (AbortController) بواجهة disconnect() الموحدة. */
  function wrapController(controller) {
    return {
      disconnect: function () { controller.abort(); },
    };
  }

  function later(fn, ms) {
    var id = setTimeout(fn, ms);
    timers.push({ kind: 'timeout', id: id });
    return id;
  }

  function every(fn, ms) {
    var id = setInterval(fn, ms);
    timers.push({ kind: 'interval', id: id });
    return id;
  }

  function frame(fn) {
    var id = requestAnimationFrame(fn);
    timers.push({ kind: 'raf', id: id });
    return id;
  }

  function stopAll() {
    stopped = true;
    var pendingListeners = listeners.splice(0);
    pendingListeners.forEach(function (entry) {
      entry.target.removeEventListener(entry.type, entry.handler, entry.options);
    });
    var pendingObservers = observers.splice(0);
    pendingObservers.forEach(function (observer) {
      try { observer.disconnect(); } catch (error) { /* مراقب مُزال سلفًا */ }
    });
    var pendingTimers = timers.splice(0);
    pendingTimers.forEach(function (timer) {
      if (timer.kind === 'timeout') clearTimeout(timer.id);
      else if (timer.kind === 'interval') clearInterval(timer.id);
      else cancelAnimationFrame(timer.id);
    });
  }

  return {
    on: on,
    off: off,
    trackObserver: trackObserver,
    wrapController: wrapController,
    later: later,
    every: every,
    frame: frame,
    stopAll: stopAll,
  };
}
