// shared/script-base.js
var cached = null;
function scriptBase() {
  if (cached) return cached;
  if (typeof globalThis !== "undefined" && globalThis.__microIifeBaseUrl) {
    cached = globalThis.__microIifeBaseUrl;
  } else {
    cached = import.meta.url;
  }
  return cached;
}

export {
  scriptBase
};
