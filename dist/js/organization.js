(() => {
  (function() {
    "use strict";
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
          span.textContent = initials || "؟";
          img.replaceWith(span);
        }
        on(img, "error", fallback);
        if (img.complete && img.naturalWidth === 0) fallback();
      });
    }
    window.MicroOrganization = {
      init: function(root) {
        initSections(root);
        initAvatars(root);
      },
      disconnect: function(root) {
        nodes(root, ".m-section__head, img[data-avatar-fallback]").forEach(function(element) {
          liveBindings.delete(element);
          if (element.__microOrganizationLifetime) element.__microOrganizationLifetime.abort();
          delete element.__microOrganizationLifetime;
          delete element.dataset.microSectionBound;
          delete element.dataset.microAvatarBound;
        });
      }
    };
    document.addEventListener("DOMContentLoaded", function() {
      window.MicroOrganization.init();
    });
    if (document.readyState !== "loading") window.MicroOrganization.init();
  })();
})();
