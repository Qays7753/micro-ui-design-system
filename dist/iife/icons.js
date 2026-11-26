if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // shared/icons.js
  var icons_exports = {};
  __export(icons_exports, {
    hydrate: () => hydrate,
    ready: () => ready
  });

  // shared/script-base.js
  var import_meta = {};
  var cached = null;
  function scriptBase() {
    if (cached) return cached;
    if (typeof globalThis !== "undefined" && globalThis.__microIifeBaseUrl) {
      cached = globalThis.__microIifeBaseUrl;
    } else {
      cached = import_meta.url;
    }
    return cached;
  }

  // shared/icons.js
  var iconsBase = null;
  function base() {
    if (!iconsBase) iconsBase = new URL("../assets/icons/", scriptBase());
    return iconsBase;
  }
  async function hydrateOne(svg) {
    var file = svg.getAttribute("data-micro-icon");
    if (!/^[a-z0-9-]+\.svg$/.test(file)) throw new Error("Invalid Micro icon filename");
    var response = await fetch(new URL(file, base()));
    if (!response.ok) throw new Error("Micro icon failed to load: " + file);
    var doc = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
    var source = doc.documentElement;
    if (source.localName !== "svg" || doc.querySelector("parsererror")) {
      throw new Error("Invalid Micro SVG: " + file);
    }
    ["viewBox", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"].forEach(function(name) {
      if (source.hasAttribute(name)) svg.setAttribute(name, source.getAttribute(name));
    });
    svg.replaceChildren.apply(svg, Array.from(source.childNodes).map(function(node) {
      return document.importNode(node, true);
    }));
  }
  function hydrate(root) {
    return Promise.all(Array.from((root || document).querySelectorAll("[data-micro-icon]")).map(hydrateOne));
  }
  var readyPromise = null;
  function ready() {
    if (!readyPromise) readyPromise = hydrate();
    return readyPromise;
  }

  // tools/package/.build-entries/iife/icons.mjs
  window.MicroIcons = Object.assign({}, icons_exports);
  window.MicroIcons.ready = window.MicroIcons.hydrate();
})();
