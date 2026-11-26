import {
  defaults
} from "./chunk-NINJ4QRZ.js";
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

// components/info-strip/info-strip.js
registerLabels("info-strip", defaults);
var MICRO_LABELS_FAMILY = "info-strip";
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
function isEditingTarget(target) {
  return !!(target && (target.isContentEditable || target.closest && target.closest(
    'input, textarea, select, option, [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], [role="slider"], [data-info-strip-editable]'
  )));
}
var registry = /* @__PURE__ */ new WeakMap();
function initStrip(strip) {
  if (strip.hasAttribute("data-info-peek")) return;
  if (registry.has(strip)) return;
  var viewport = strip.querySelector("[data-info-strip-viewport]");
  var track = strip.querySelector("[data-info-strip-track]");
  if (!viewport || !track) return;
  strip.setAttribute("data-info-strip-ready", "");
  var listeners = [];
  function on(elm, type, fn) {
    elm.addEventListener(type, fn, false);
    listeners.push({ el: elm, type, fn });
  }
  var controls = strip.querySelector("[data-info-strip-controls]");
  var previous = strip.querySelector("[data-info-strip-prev]");
  var next = strip.querySelector("[data-info-strip-next]");
  var pageList = strip.querySelector("[data-info-strip-pages]");
  var position = strip.querySelector("[data-info-strip-position]");
  var status = strip.querySelector("[data-info-strip-status]");
  var empty = strip.querySelector("[data-info-strip-empty]");
  var index = 0;
  var startX = null;
  var startY = null;
  var moved = false;
  var pageButtons = [];
  function slides() {
    return Array.prototype.slice.call(track.children).filter(function(node) {
      return node.classList.contains("m-info-strip__slide");
    });
  }
  function syncEmptyState(count) {
    if (controls) controls.hidden = count < 2;
    viewport.hidden = count === 0;
    if (empty) empty.hidden = count > 0;
  }
  syncEmptyState(slides().length);
  if (slides().length >= 2 && empty) empty.hidden = true;
  if (pageList) {
    pageList.setAttribute("role", "group");
    if (!pageList.hasAttribute("aria-label")) pageList.setAttribute("aria-label", L("pages.ariaLabel", pageList));
  }
  function setIndex(target, focusViewport) {
    var list = slides();
    var nextIndex = Math.max(0, Math.min(list.length - 1, target));
    if (nextIndex === index && track.style.getPropertyValue("--m-info-index") !== "") return;
    var activeElement = document.activeElement;
    if (list[index] && list[index].contains(activeElement)) {
      viewport.focus({ preventScroll: true });
    }
    index = nextIndex;
    track.style.setProperty("--m-info-index", String(index));
    list.forEach(function(slide, slideIndex) {
      var active = slideIndex === index;
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      slide.inert = !active;
    });
    if (previous) previous.disabled = index === 0;
    if (next) next.disabled = index === list.length - 1;
    if (position) position.textContent = index + 1 + " / " + list.length;
    if (status) status.textContent = L("status.positionPrefix", status) + (index + 1) + L("status.ofSeparator", status) + list.length;
    if (pageList) {
      pageButtons.forEach(function(button, pageIndex) {
        button.setAttribute("aria-current", pageIndex === index ? "true" : "false");
        button.setAttribute("aria-pressed", pageIndex === index ? "true" : "false");
      });
    }
    if (focusViewport) viewport.focus({ preventScroll: true });
  }
  function rebuildPages() {
    if (!pageList) return;
    pageList.textContent = "";
    pageButtons = [];
    slides().forEach(function(_, pageIndex) {
      var page = document.createElement("button");
      page.type = "button";
      page.className = "m-info-strip__page";
      page.setAttribute("data-info-strip-page", "");
      page.setAttribute("aria-label", L("page.showPrefix", page) + (pageIndex + 1));
      page.setAttribute("aria-current", pageIndex === 0 ? "true" : "false");
      page.setAttribute("aria-pressed", pageIndex === 0 ? "true" : "false");
      page.addEventListener("click", function() {
        setIndex(pageIndex, false);
      });
      pageList.appendChild(page);
      pageButtons.push(page);
    });
  }
  rebuildPages();
  if (previous) on(previous, "click", function() {
    setIndex(index - 1, false);
  });
  if (next) on(next, "click", function() {
    setIndex(index + 1, false);
  });
  on(strip, "keydown", function(event) {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (isEditingTarget(event.target)) return;
    var control = event.target.closest && event.target.closest(
      "[data-info-strip-prev], [data-info-strip-next], [data-info-strip-page]"
    );
    if (!viewport.contains(event.target) && !control) return;
    if (!control && event.target.closest && event.target.closest("button, a[href], summary")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setIndex(index + 1, false);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setIndex(index - 1, false);
    } else if (event.key === "Home") {
      event.preventDefault();
      setIndex(0, false);
    } else if (event.key === "End") {
      event.preventDefault();
      setIndex(slides().length - 1, false);
    }
  });
  on(viewport, "pointerdown", function(event) {
    if (isEditingTarget(event.target)) return;
    if (event.pointerType !== "touch" || event.isPrimary === false) return;
    startX = event.clientX;
    startY = event.clientY;
    moved = false;
  });
  on(viewport, "pointerup", function(event) {
    if (startX === null || startY === null) return;
    var dx = event.clientX - startX;
    var dy = event.clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      moved = true;
      setIndex(index + (dx > 0 ? 1 : -1), false);
    }
    startX = null;
    startY = null;
  });
  on(viewport, "pointercancel", function() {
    startX = null;
    startY = null;
  });
  on(viewport, "click", function(event) {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    }
  }, true);
  var initial = slides();
  initial.forEach(function(slide, slideIndex) {
    slide.setAttribute("aria-hidden", slideIndex === 0 ? "false" : "true");
    slide.inert = slideIndex !== 0;
  });
  track.style.setProperty("--m-info-index", "0");
  if (previous) previous.disabled = true;
  if (next) next.disabled = initial.length < 2;
  if (position) position.textContent = initial.length ? "1 / " + initial.length : "";
  if (status) status.textContent = initial.length ? L("status.initialPrefix", status) + initial.length : L("status.empty", status);
  registry.set(strip, {
    listeners,
    viewport,
    track,
    controls,
    empty,
    setIndex,
    slides,
    rebuildPages,
    syncEmptyState
  });
}
function teardownStrip(strip) {
  var data = registry.get(strip);
  if (!data) return;
  data.listeners.forEach(function(L2) {
    L2.el.removeEventListener(L2.type, L2.fn, false);
  });
  registry.delete(strip);
  strip.removeAttribute("data-info-strip-ready");
  data.track.style.removeProperty("--m-info-index");
  data.slides().forEach(function(slide) {
    slide.removeAttribute("aria-hidden");
    slide.inert = false;
  });
  if (data.controls) data.controls.hidden = false;
  if (data.empty) data.empty.hidden = true;
  data.viewport.hidden = false;
}
var instances = instanceRegistry();
function init(root, options) {
  var scope = root || document;
  applyInstanceLabels(scope, options);
  var existing = instances.get(scope);
  if (existing) {
    withLabels2(scope, function() {
      if (scope.matches && scope.matches("[data-info-strip]")) initStrip(scope);
      scope.querySelectorAll("[data-info-strip]").forEach(initStrip);
    });
    return existing;
  }
  var destroyed = false;
  var instance = {
    root: scope,
    /** = rescan: إعادة التقاط البطاقات بعد تغيير شرائح DOM للمضيف. */
    update: function() {
      withLabels2(scope, function() {
        rescan(scope);
      });
    },
    /** يفك مستمعات كل شريط (لا يمس بطاقات المضيف ولا حالتها). */
    destroy: function() {
      if (destroyed) return;
      destroyed = true;
      teardown(scope);
      instances.remove(scope);
    }
  };
  withLabels2(scope, function() {
    if (scope.matches && scope.matches("[data-info-strip]")) initStrip(scope);
    scope.querySelectorAll("[data-info-strip]").forEach(initStrip);
  });
  instances.set(scope, instance);
  return instance;
}
function getInstance(root) {
  return instances.get(root);
}
function destroy(root) {
  var instance = instances.get(root);
  if (instance) instance.destroy();
  else teardown(root || document);
}
function rescan(root) {
  var scope = root || document;
  var list = [];
  if (scope.matches && scope.matches("[data-info-strip]")) list.push(scope);
  Array.prototype.push.apply(list, scope.querySelectorAll("[data-info-strip]"));
  list.forEach(function(strip) {
    if (strip.hasAttribute("data-info-peek")) return;
    if (strip.hasAttribute("data-info-strip-ready")) teardownStrip(strip);
    initStrip(strip);
  });
}
function teardown(root) {
  var scope = root || document;
  if (scope.matches && scope.matches("[data-info-strip]")) teardownStrip(scope);
  scope.querySelectorAll("[data-info-strip]").forEach(teardownStrip);
}
function setLabels2(partial) {
  setLabels("info-strip", partial);
}
export {
  destroy,
  getInstance,
  init,
  setLabels2 as setLabels
};
