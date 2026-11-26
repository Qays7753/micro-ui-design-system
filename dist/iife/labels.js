if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // shared/labels.js
  var labels_exports = {};
  __export(labels_exports, {
    currentInstanceLabels: () => currentInstanceLabels,
    familyLabels: () => familyLabels,
    formatNumber: () => formatNumber,
    getLabel: () => getLabel,
    getLocale: () => getLocale,
    instanceLabelFor: () => instanceLabelFor,
    instanceLabelsOf: () => instanceLabelsOf,
    plural: () => plural,
    pluralCategory: () => pluralCategory,
    registerLabels: () => registerLabels,
    setInstanceLabels: () => setInstanceLabels,
    setLabels: () => setLabels,
    setLocale: () => setLocale,
    withLabels: () => withLabels
  });
  var pluralRules = null;
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
  function registerLabels(family, defaults) {
    var families = store().families;
    if (!families[family]) families[family] = {};
    var current = families[family];
    for (var key in defaults) current[key] = defaults[key];
  }
  function getLabel(family, key, vars) {
    var entry = store().families[family];
    var value = entry ? entry[key] : void 0;
    if (value == null || !vars) return value;
    var text = String(value);
    for (var name in vars) text = text.split("{" + name + "}").join(String(vars[name]));
    return text;
  }
  function familyLabels(family) {
    return store().families[family];
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
  function setLocale(locale) {
    store().locale = locale;
  }
  function getLocale() {
    return store().locale || "ar-u-nu-latn";
  }
  function formatNumber(value) {
    var locale = getLocale();
    if (locale === "ar-u-nu-latn") return String(value);
    try {
      return new Intl.NumberFormat(locale).format(value);
    } catch (err) {
      return String(value);
    }
  }
  function pluralCategory(n) {
    if (n >= 100) {
      var r = n % 100;
      if (r === 0) return "other";
      if (r === 1) return "hundredOne";
      if (r === 2) return "hundredTwo";
      if (r >= 3 && r <= 10) return "few";
      return "many";
    }
    if (!pluralRules) {
      try {
        pluralRules = new Intl.PluralRules("ar");
      } catch (err) {
        pluralRules = { select: function() {
          return "other";
        } };
      }
    }
    return pluralRules.select(n);
  }
  function plural(n, forms) {
    var source = forms || {};
    var template = source[pluralCategory(n)] != null ? source[pluralCategory(n)] : source.other;
    if (template == null) return String(n);
    return String(template).replace("{n}", String(n));
  }

  // tools/package/.build-entries/iife/labels.mjs
  window.MicroLabels = Object.assign({}, labels_exports);
  Object.defineProperty(window.MicroLabels, "locale", { configurable: true, get: function() {
    return window.MicroLabels.getLocale();
  } });
})();
