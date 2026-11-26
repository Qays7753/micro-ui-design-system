// shared/integrations.js
function globalApi(name) {
  if (typeof globalThis === "undefined") return void 0;
  return globalThis["Micro" + name];
}

export {
  globalApi
};
