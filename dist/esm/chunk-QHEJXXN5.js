// shared/haptics.js
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

export {
  setHaptics,
  isHapticsEnabled,
  pulse
};
