import {
  currentInstanceLabels,
  getLabel,
  instanceLabelFor,
  registerLabels,
  setInstanceLabels,
  setLabels,
  withLabels
} from "./chunk-S44UNZ6A.js";
import {
  instanceRegistry
} from "./chunk-FKZJV23C.js";

// components/organization/labels.js
var defaults = {
  "avatar.initialsFallback": "؟"
};

// components/organization/organization.js
registerLabels("organization", defaults);
var MICRO_LABELS_FAMILY = "organization";
function L(key, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY) || currentInstanceLabels(MICRO_LABELS_FAMILY);
  if (own && Object.prototype.hasOwnProperty.call(own, key)) return own[key];
  return getLabel(MICRO_LABELS_FAMILY, key);
}
function withLabels2(scope, fn) {
  return withLabels(scope, MICRO_LABELS_FAMILY, fn);
}
function applyInstanceLabels(scope, options) {
  if (options && options.labels && typeof options.labels === "object") {
    setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
  }
}
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
function nodes(root, selector) {
  var scope = root || document;
  var found = [].slice.call(scope.querySelectorAll(selector));
  if (scope.matches && scope.matches(selector)) found.unshift(scope);
  return found;
}
function on(element, type, handler) {
  if (!element.__microOrganizationLifetime) element.__microOrganizationLifetime = new AbortController();
  element.addEventListener(type, handler, { signal: element.__microOrganizationLifetime.signal });
}
function initSections(root) {
  nodes(root, ".m-section__head").forEach(function(head) {
    if (!claimBinding(head, "microSectionBound")) return;
    on(head, "click", function() {
      var section = head.closest(".m-section");
      var body = section ? section.querySelector(".m-section__body") : null;
      if (!body) return;
      var open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", open ? "false" : "true");
      body.hidden = open;
      section.dispatchEvent(new CustomEvent("micro-organization:toggle", {
        bubbles: true,
        detail: { open: !open }
      }));
    });
  });
}
function initAvatars(root) {
  nodes(root, "img[data-avatar-fallback]").forEach(function(img) {
    if (!claimBinding(img, "microAvatarBound")) return;
    function fallback() {
      var wrap = img.closest(".m-identity");
      if (!wrap) return;
      var name = (wrap.querySelector(".m-identity__name") || {}).textContent || "";
      var initials = name.trim().split(/\s+/).slice(0, 2).map(function(w) {
        return w.charAt(0);
      }).join("");
      var span = document.createElement("span");
      span.className = "m-identity__initials";
      span.setAttribute("aria-hidden", "true");
      span.textContent = initials || L("avatar.initialsFallback", img);
      img.replaceWith(span);
    }
    on(img, "error", fallback);
    if (img.complete && img.naturalWidth === 0) fallback();
  });
}
var registry = instanceRegistry();
function init(root, options) {
  var scope = root || document;
  applyInstanceLabels(scope, options);
  var existing = registry.get(scope);
  if (existing) {
    withLabels2(scope, function() {
      initSections(scope);
      initAvatars(scope);
    });
    return existing;
  }
  var destroyed = false;
  var instance = {
    root: scope,
    /** يعيد فحص الأقسام والصور الرمزية تحت الجذر (يربط الجديد فقط). */
    update: function() {
      withLabels2(scope, function() {
        initSections(scope);
        initAvatars(scope);
      });
    },
    /** يفك كل مستمعات النطاق ويمكّن الربط من جديد — لا يمس حالة الطي. */
    destroy: function() {
      if (destroyed) return;
      destroyed = true;
      teardown(scope);
      registry.remove(scope);
    }
  };
  withLabels2(scope, function() {
    initSections(scope);
    initAvatars(scope);
  });
  registry.set(scope, instance);
  return instance;
}
function getInstance(root) {
  return registry.get(root);
}
function destroy(root) {
  var instance = registry.get(root);
  if (instance) instance.destroy();
  else teardown(root || document);
}
function teardown(root) {
  nodes(root, ".m-section__head, img[data-avatar-fallback]").forEach(function(element) {
    liveBindings.delete(element);
    if (element.__microOrganizationLifetime) element.__microOrganizationLifetime.abort();
    delete element.__microOrganizationLifetime;
    delete element.dataset.microSectionBound;
    delete element.dataset.microAvatarBound;
  });
}
function setLabels2(partial) {
  setLabels("organization", partial);
}
export {
  destroy,
  getInstance,
  init,
  setLabels2 as setLabels
};
