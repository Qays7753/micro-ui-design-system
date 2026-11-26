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

// components/carousel/labels.js
var defaults = {
  "empty": "لا توجد بطاقات.",
  "slide.cardRole": "بطاقة",
  "slide.labelPrefix": "بطاقة ",
  "slide.positionPrefix": "، البطاقة ",
  "position.of": " من ",
  "status.positionPrefix": "البطاقة ",
  "dots.goToPrefix": "الانتقال إلى البطاقة ",
  "region.role": "عارض بطاقات"
};

// components/carousel/carousel.js
registerLabels("carousel", defaults);
var MICRO_LABELS_FAMILY = "carousel";
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
var reduceMotionQuery = null;
function prefersReducedMotion() {
  if (!reduceMotionQuery && typeof window !== "undefined" && window.matchMedia) {
    reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  }
  return !!(reduceMotionQuery && reduceMotionQuery.matches);
}
var stateOf = /* @__PURE__ */ new WeakMap();
var viewportObservers = /* @__PURE__ */ new WeakMap();
var RESIZE_EPS = 0.5;
function measureActiveHeight(st) {
  if (st.disconnected || !st.count || st.viewport.clientWidth <= 1) return;
  var slide = st.slides[st.index];
  var style = getComputedStyle(st.track);
  var height = Math.ceil(slide.getBoundingClientRect().height + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
  if (height > 0 && st.viewport.style.height !== height + "px") st.viewport.style.height = height + "px";
  var observer = viewportObservers.get(st.root);
  if (observer && st.heightSlide !== slide) {
    if (st.heightSlide) observer.unobserve(st.heightSlide);
    observer.observe(slide);
    st.heightSlide = slide;
  }
}
function recenterCarousel(carousel, st) {
  if (st.disconnected) return;
  if (st.raf) return;
  st.raf = requestAnimationFrame(function() {
    st.raf = null;
    if (st.disconnected || st.count <= 0) return;
    measureActiveHeight(st);
    var w = st.viewport.clientWidth;
    if (w <= 1) return;
    var direction = getComputedStyle(carousel).direction;
    if (st.lastWidth !== void 0 && Math.abs(w - st.lastWidth) < RESIZE_EPS && direction === st.lastDirection) return;
    st.lastWidth = w;
    st.lastDirection = direction;
    goToIndex(carousel, st.index, { animate: false });
  });
}
function observeViewport(carousel, st) {
  st.disconnected = false;
  if (typeof ResizeObserver !== "function") return;
  if (viewportObservers.has(carousel)) return;
  var ro = new ResizeObserver(function(entries) {
    if (st.disconnected || viewportObservers.get(carousel) !== ro || st.viewport.clientWidth <= 1) return;
    recenterCarousel(carousel, st);
  });
  ro.observe(st.viewport);
  viewportObservers.set(carousel, ro);
  measureActiveHeight(st);
}
function parts(carousel) {
  return {
    root: carousel,
    viewport: carousel.querySelector("[data-viewport]"),
    track: carousel.querySelector("[data-track]"),
    slides: [].slice.call(carousel.querySelectorAll("[data-carousel-slide]")),
    prev: carousel.querySelector("[data-prev]"),
    next: carousel.querySelector("[data-next]"),
    status: carousel.querySelector("[data-status]"),
    dots: carousel.querySelector("[data-dots]")
  };
}
function onLocal(carousel, element, type, handler) {
  var st = stateOf.get(carousel);
  if (!st.controller) st.controller = new AbortController();
  element.addEventListener(type, handler, { signal: st.controller.signal });
}
function directionOf(carousel) {
  return getComputedStyle(carousel).direction === "rtl" ? "rtl" : "ltr";
}
function scrollToSlide(st, i, animate) {
  var slide = st.slides[i];
  if (!slide) return;
  st.programmatic = true;
  if (st.scrollTimer) window.clearTimeout(st.scrollTimer);
  st.scrollTimer = window.setTimeout(
    function() {
      st.programmatic = false;
    },
    animate && !prefersReducedMotion() ? 480 : 80
  );
  slide.scrollIntoView({
    inline: "center",
    block: "nearest",
    behavior: animate && !prefersReducedMotion() ? "smooth" : "auto"
  });
}
function nearestSlide(st) {
  var box = st.viewport.getBoundingClientRect();
  var center = box.left + box.width / 2;
  var best = 0, bestDist = Infinity;
  st.slides.forEach(function(slide, i) {
    var rect = slide.getBoundingClientRect();
    var dist = Math.abs(rect.left + rect.width / 2 - center);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}
function goToIndex(carousel, i, opts) {
  var st = stateOf.get(carousel);
  if (!st || st.disconnected || st.count === 0) return;
  var animate = !(opts && opts.animate === false);
  var clamped = Math.max(0, Math.min(st.count - 1, i));
  scrollToSlide(st, clamped, animate);
  if (clamped !== st.index) {
    collapseSlide(st, st.slides[st.index]);
    st.index = clamped;
    update(carousel, st);
    carousel.dispatchEvent(new CustomEvent("micro-carousel:change", {
      bubbles: true,
      detail: { index: st.index, count: st.count }
    }));
  } else {
    update(carousel, st);
  }
}
function update(carousel, st) {
  measureActiveHeight(st);
  var rtl = directionOf(carousel) === "rtl";
  carousel.setAttribute("data-carousel-count", String(st.count));
  var controls = carousel.querySelector(".m-carousel__controls");
  if (controls) controls.hidden = st.count < 2;
  st.viewport.hidden = st.count === 0;
  var empty = carousel.querySelector("[data-carousel-empty]");
  if (st.count === 0 && !empty) {
    empty = document.createElement("p");
    empty.setAttribute("data-carousel-empty", "");
    empty.setAttribute("role", "status");
    empty.textContent = L("empty", empty);
    carousel.appendChild(empty);
  }
  if (empty) empty.hidden = st.count !== 0;
  st.slides.forEach(function(slide, i) {
    var isCurrent = i === st.index;
    slide.setAttribute("data-current", isCurrent ? "true" : "false");
    slide.setAttribute("aria-roledescription", L("slide.cardRole", slide));
    var name = slide.getAttribute("data-card-label") || L("slide.labelPrefix", slide) + (i + 1);
    slide.setAttribute("aria-label", name + L("slide.positionPrefix", slide) + (i + 1) + L("position.of", slide) + st.count);
    slide.removeAttribute("aria-hidden");
    slide.inert = !isCurrent;
  });
  var focusedSlide = document.activeElement.closest("[data-carousel-slide]");
  if (focusedSlide && st.slides.indexOf(focusedSlide) >= 0 && focusedSlide.inert) {
    carousel.focus({ preventScroll: true });
  }
  var atStart = st.index === 0;
  var atEnd = st.index === st.count - 1;
  if (st.prev) st.prev.disabled = atStart || st.count <= 1;
  if (st.next) st.next.disabled = atEnd || st.count <= 1;
  if (st.status) {
    st.status.textContent = st.count === 0 ? L("empty") : L("status.positionPrefix") + (st.index + 1) + L("position.of") + st.count;
  }
  if (st.dots) {
    if (st.count > 1 && !st.dotsBuilt) buildDots(carousel, st);
    if (st.count > 1) {
      st.dots.hidden = false;
      [].slice.call(st.dots.children).forEach(function(btn, i) {
        if (i === st.index) btn.setAttribute("aria-current", "true");
        else btn.removeAttribute("aria-current");
      });
    } else {
      st.dots.hidden = true;
    }
  }
  carousel.setAttribute("data-dir", rtl ? "rtl" : "ltr");
}
function buildDots(carousel, st) {
  st.dots.textContent = "";
  for (var i = 0; i < st.count; i++) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "m-carousel__dot";
    b.setAttribute("aria-label", L("dots.goToPrefix", b) + (i + 1) + L("position.of", b) + st.count);
    (function(idx) {
      onLocal(carousel, b, "click", function() {
        goToIndex(carousel, idx);
      });
    })(i);
    st.dots.appendChild(b);
  }
  st.dotsBuilt = true;
}
function wireScroll(carousel, st) {
  onLocal(carousel, st.viewport, "scroll", function() {
    if (st.disconnected || st.programmatic || st.scrollRaf) return;
    st.scrollRaf = requestAnimationFrame(function() {
      st.scrollRaf = 0;
      if (st.disconnected || st.programmatic || st.count === 0) return;
      var i = nearestSlide(st);
      if (i !== st.index) {
        collapseSlide(st, st.slides[st.index]);
        st.index = i;
        update(carousel, st);
        carousel.dispatchEvent(new CustomEvent("micro-carousel:change", {
          bubbles: true,
          detail: { index: st.index, count: st.count }
        }));
      }
    });
  }, null, { passive: true });
  onLocal(carousel, st.viewport, "dragstart", function(e) {
    if (!st.disconnected) e.preventDefault();
  });
}
function expandRegionOf(slide, btn) {
  var id = btn ? btn.getAttribute("aria-controls") : null;
  if (id) {
    var byId = document.getElementById(id);
    if (byId && slide.contains(byId)) return byId;
  }
  return slide.querySelector("[data-card-details]");
}
function setToggleLabel(btn, open) {
  if (!btn) return;
  var t = btn.querySelector("[data-card-expand-text]") || btn;
  var v = open ? btn.getAttribute("data-label-open") : btn.getAttribute("data-label-closed");
  if (v) t.textContent = v;
}
function collapseSlide(st, slide) {
  if (!slide || !slide.hasAttribute("data-expanded")) return;
  slide.removeAttribute("data-expanded");
  var btn = slide.querySelector("[data-card-expand]");
  if (btn) btn.setAttribute("aria-expanded", "false");
  setToggleLabel(btn, false);
  var region = expandRegionOf(slide, btn);
  if (region) region.hidden = true;
}
function toggleExpand(st, slide) {
  var btn = slide ? slide.querySelector("[data-card-expand]") : null;
  if (!btn) return;
  var open = slide.getAttribute("data-expanded") === "true";
  slide.setAttribute("data-expanded", open ? "false" : "true");
  btn.setAttribute("aria-expanded", open ? "false" : "true");
  setToggleLabel(btn, !open);
  var region = expandRegionOf(slide, btn);
  if (region) region.hidden = open;
  measureActiveHeight(st);
}
function wireExpand(carousel, st) {
  onLocal(carousel, carousel, "click", function(e) {
    if (st.disconnected) return;
    var btn = e.target && e.target.closest ? e.target.closest("[data-card-expand]") : null;
    if (!btn || !carousel.contains(btn)) return;
    var slide = btn.closest("[data-carousel-slide]");
    if (!slide) return;
    if (st.slides[st.index] !== slide) {
      goToIndex(carousel, [].indexOf.call(st.slides, slide));
      return;
    }
    toggleExpand(st, slide);
  });
}
function isLocalArrowTarget(el) {
  if (!el || !el.closest) return false;
  return el.isContentEditable || !!el.closest(
    'input, textarea, select, option, summary, a[href], [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], [role="slider"]'
  );
}
function isCarouselControl(el, carousel) {
  if (!el || !el.closest) return false;
  var ctl = el.closest("[data-prev], [data-next], [data-dots]");
  return !!ctl && carousel.contains(ctl);
}
function isCardContentButton(el, carousel) {
  if (!el || !el.closest) return false;
  var btn = el.closest("button");
  return !!btn && carousel.contains(btn) && !!btn.closest("[data-carousel-slide]");
}
function wireKeys(carousel, st) {
  onLocal(carousel, carousel, "keydown", function(e) {
    if (st.disconnected || st.count === 0 || e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var target = e.target;
    if (isLocalArrowTarget(target)) return;
    if (!isCarouselControl(target, carousel) && isCardContentButton(target, carousel)) return;
    var rtl = directionOf(carousel) === "rtl";
    var handled = true;
    switch (e.key) {
      case "ArrowRight":
        rtl ? prev(carousel) : next(carousel);
        break;
      case "ArrowLeft":
        rtl ? next(carousel) : prev(carousel);
        break;
      case "Home":
        goToIndex(carousel, 0);
        break;
      case "End":
        goToIndex(carousel, st.count - 1);
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  });
}
function wireResize(carousel, st) {
  if (!st.resizeHandler) {
    st.resizeHandler = function() {
      recenterCarousel(carousel, st);
    };
    window.addEventListener("resize", st.resizeHandler);
  }
  if (reduceMotionQuery && reduceMotionQuery.addEventListener && !st.motionHandler) {
    st.motionHandler = function() {
      goToIndex(carousel, st.index, { animate: false });
    };
    reduceMotionQuery.addEventListener("change", st.motionHandler);
  }
  observeViewport(carousel, st);
  if (!st.directionObserver && typeof MutationObserver === "function") {
    var observer = new MutationObserver(function() {
      if (st.disconnected || st.directionObserver !== observer || getComputedStyle(carousel).direction === st.lastDirection) return;
      recenterCarousel(carousel, st);
    });
    st.directionObserver = observer;
    for (var node = carousel; node; node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: ["dir", "class", "style"] });
    }
  }
}
function setup(carousel) {
  var existing = stateOf.get(carousel);
  if (existing) {
    wireResize(carousel, existing);
    recenterCarousel(carousel, existing);
    return;
  }
  var st = parts(carousel);
  st.index = 0;
  st.count = st.slides.length;
  st.programmatic = false;
  st.dotsBuilt = false;
  stateOf.set(carousel, st);
  carousel.setAttribute("role", "group");
  if (!carousel.hasAttribute("tabindex")) carousel.setAttribute("tabindex", "0");
  carousel.setAttribute("aria-roledescription", L("region.role", carousel));
  if (!carousel.hasAttribute("aria-label") && carousel.hasAttribute("data-carousel-label")) {
    carousel.setAttribute("aria-label", carousel.getAttribute("data-carousel-label"));
  }
  st.track.setAttribute("data-track-state", "idle");
  if (st.prev) onLocal(carousel, st.prev, "click", function() {
    prev(carousel);
  });
  if (st.next) onLocal(carousel, st.next, "click", function() {
    next(carousel);
  });
  wireKeys(carousel, st);
  wireScroll(carousel, st);
  wireExpand(carousel, st);
  wireResize(carousel, st);
  update(carousel, st);
  recenterCarousel(carousel, st);
  if (document.fonts) document.fonts.ready.then(function() {
    if (carousel.isConnected && !st.disconnected) {
      measureActiveHeight(st);
      st.lastWidth = void 0;
      recenterCarousel(carousel, st);
    }
  });
}
function next(carousel) {
  var st = stateOf.get(carousel);
  if (st) goToIndex(carousel, st.index + 1);
}
function prev(carousel) {
  var st = stateOf.get(carousel);
  if (st) goToIndex(carousel, st.index - 1);
}
var instances = instanceRegistry();
function init(root, options) {
  var scope = root || document;
  applyInstanceLabels(scope, options);
  var existing = instances.get(scope);
  if (existing) {
    withLabels2(scope, function() {
      if (scope.matches && scope.matches("[data-carousel]")) setup(scope);
      scope.querySelectorAll("[data-carousel]").forEach(setup);
    });
    return existing;
  }
  var destroyed = false;
  function target() {
    if (scope.matches && scope.matches("[data-carousel]")) return scope;
    return scope.querySelector ? scope.querySelector("[data-carousel]") : null;
  }
  var instance = {
    root: scope,
    /** = goTo: تنقل الفهرس (يطلق micro-carousel:change حتى برمجيًا). */
    update: function(updateOptions) {
      updateOptions = updateOptions || {};
      var el = target();
      var st = el ? stateOf.get(el) : null;
      var index = typeof updateOptions.index === "number" ? updateOptions.index : st ? st.index : 0;
      if (el) goToIndex(el, index, updateOptions);
    },
    goTo: function(index, goToOptions) {
      var el = target();
      if (el) goToIndex(el, index, goToOptions);
    },
    next: function() {
      var el = target();
      if (el) next(el);
    },
    prev: function() {
      var el = target();
      if (el) prev(el);
    },
    getIndex: function() {
      var el = target();
      return el ? getIndex(el) : -1;
    },
    /** يفك مستمعات كل عارض ومراقباته ومؤقتاته تحت الجذر. */
    destroy: function() {
      if (destroyed) return;
      destroyed = true;
      destroyAll(scope);
      instances.remove(scope);
    }
  };
  withLabels2(scope, function() {
    if (scope.matches && scope.matches("[data-carousel]")) setup(scope);
    scope.querySelectorAll("[data-carousel]").forEach(setup);
  });
  instances.set(scope, instance);
  return instance;
}
function getInstance(root) {
  return instances.get(root);
}
function getIndex(carousel) {
  var st = stateOf.get(carousel);
  return st ? st.index : -1;
}
function destroyAll(scope) {
  teardown(scope);
  var items = [].slice.call(scope.querySelectorAll("[data-carousel]"));
  if (scope.matches && scope.matches("[data-carousel]")) items.unshift(scope);
  items.forEach(function(carousel) {
    var st = stateOf.get(carousel);
    if (st && st.controller) st.controller.abort();
    if (st && st.dots) st.dots.textContent = "";
    stateOf.delete(carousel);
  });
}
function destroy(root) {
  var instance = instances.get(root);
  if (instance) {
    instance.destroy();
    return;
  }
  destroyAll(root || document);
}
function teardown(root) {
  var scope = root || document;
  var items = [];
  if (scope.matches && scope.matches("[data-carousel]")) items.push(scope);
  Array.prototype.push.apply(items, scope.querySelectorAll("[data-carousel]"));
  items.forEach(function(carousel) {
    var ro = viewportObservers.get(carousel);
    if (ro) {
      ro.disconnect();
      viewportObservers.delete(carousel);
    }
    var st = stateOf.get(carousel);
    if (st) {
      st.disconnected = true;
      if (st.directionObserver) {
        st.directionObserver.disconnect();
        st.directionObserver = null;
      }
      if (st.scrollTimer) {
        window.clearTimeout(st.scrollTimer);
        st.scrollTimer = null;
      }
      if (st.scrollRaf) {
        cancelAnimationFrame(st.scrollRaf);
        st.scrollRaf = 0;
      }
      if (st.resizeHandler) {
        window.removeEventListener("resize", st.resizeHandler);
        st.resizeHandler = null;
      }
      if (st.motionHandler) {
        reduceMotionQuery.removeEventListener("change", st.motionHandler);
        st.motionHandler = null;
      }
      st.heightSlide = null;
      st.lastWidth = void 0;
      if (st.raf) {
        cancelAnimationFrame(st.raf);
        st.raf = null;
      }
    }
  });
}
function setLabels2(partial) {
  setLabels("carousel", partial);
}
export {
  destroy,
  getIndex,
  getInstance,
  goToIndex as goTo,
  init,
  next,
  prev,
  setLabels2 as setLabels
};
