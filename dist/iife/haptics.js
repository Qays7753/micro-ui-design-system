if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // shared/haptics.js
  var haptics_exports = {};
  __export(haptics_exports, {
    isHapticsEnabled: () => isHapticsEnabled,
    pulse: () => pulse,
    setHaptics: () => setHaptics
  });
  var STATE_KEY = "__microHapticsEnabled";
  function vibrateAvailable() {
    return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
  }
  function setHaptics(on) {
    var enabled = !!on && vibrateAvailable();
    if (typeof globalThis !== "undefined") globalThis[STATE_KEY] = enabled;
    return enabled;
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

  // tools/package/.build-entries/iife/haptics.mjs
  window.MicroHaptics = Object.assign({}, haptics_exports);
})();
