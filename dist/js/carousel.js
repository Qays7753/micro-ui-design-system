(() => {
  (function() {
    "use strict";
    var AXIS_LOCK = 8;
    var COMMIT_RATIO = 0.2;
    var COMMIT_MIN = 32;
    var DOTS_MAX = 6;
    var reduceMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    function prefersReducedMotion() {
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
    function setX(st, x, animate) {
      st.x = x;
      if (animate && !prefersReducedMotion()) {
        st.track.style.transform = "translateX(" + x + "px)";
      } else {
        st.track.style.transition = "none";
        st.track.style.transform = "translateX(" + x + "px)";
        void st.track.offsetWidth;
        st.track.style.transition = "";
      }
    }
    function slideX(st, i) {
      var s = st.slides[i];
      return st.viewport.clientWidth / 2 - (s.offsetLeft + s.offsetWidth / 2);
    }
    function goToIndex(carousel, i, opts) {
      var st = stateOf.get(carousel);
      if (!st || st.disconnected || st.count === 0) return;
      var animate = !(opts && opts.animate === false);
      var clamped = Math.max(0, Math.min(st.count - 1, i));
      setX(st, slideX(st, clamped), animate);
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
        empty.textContent = "لا توجد بطاقات.";
        carousel.appendChild(empty);
      }
      if (empty) empty.hidden = st.count !== 0;
      st.slides.forEach(function(slide, i) {
        var isCurrent = i === st.index;
        slide.setAttribute("data-current", isCurrent ? "true" : "false");
        slide.setAttribute("aria-roledescription", "بطاقة");
        var name = slide.getAttribute("data-card-label") || "بطاقة " + (i + 1);
        slide.setAttribute("aria-label", name + "، البطاقة " + (i + 1) + " من " + st.count);
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
        st.status.textContent = st.count === 0 ? "لا توجد بطاقات." : "البطاقة " + (st.index + 1) + " من " + st.count;
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
        b.setAttribute("aria-label", "الانتقال إلى البطاقة " + (i + 1) + " من " + st.count);
        (function(idx) {
          onLocal(carousel, b, "click", function() {
            goToIndex(carousel, idx);
          });
        })(i);
        st.dots.appendChild(b);
      }
      st.dotsBuilt = true;
    }
    function onPointerDown(carousel, st, e) {
      if (st.disconnected || st.drag || st.count <= 1 || isLocalArrowTarget(e.target) || e.pointerType === "mouse" && e.button !== 0) return;
      st.drag = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        baseX: st.x,
        axis: null,
        handlers: null
      };
      st.suppressClick = false;
      st.root.classList.add("is-dragging");
      attachDragWindow(carousel, st);
    }
    function attachDragWindow(carousel, st) {
      var d = st.drag;
      if (!d || d.handlers) return;
      d.handlers = {
        move: function(e) {
          onPointerMove(carousel, st, e);
        },
        up: function(e) {
          endDrag(carousel, st, false, e);
        },
        cancel: function(e) {
          endDrag(carousel, st, true, e);
        },
        blur: function() {
          endDrag(carousel, st, true, null);
        },
        vis: function() {
          if (document.visibilityState === "hidden") endDrag(carousel, st, true, null);
        }
      };
      window.addEventListener("pointermove", d.handlers.move, true);
      window.addEventListener("pointerup", d.handlers.up, true);
      window.addEventListener("pointercancel", d.handlers.cancel, true);
      window.addEventListener("blur", d.handlers.blur);
      document.addEventListener("visibilitychange", d.handlers.vis);
    }
    function detachDragWindow(st, d) {
      if (!d || !d.handlers) return;
      window.removeEventListener("pointermove", d.handlers.move, true);
      window.removeEventListener("pointerup", d.handlers.up, true);
      window.removeEventListener("pointercancel", d.handlers.cancel, true);
      window.removeEventListener("blur", d.handlers.blur);
      document.removeEventListener("visibilitychange", d.handlers.vis);
      d.handlers = null;
    }
    function onPointerMove(carousel, st, e) {
      var d = st.drag;
      if (!d || e.pointerId !== d.id) return;
      var dx = e.clientX - d.startX;
      var dy = e.clientY - d.startY;
      if (!d.axis) {
        if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
        d.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "cancel";
        if (d.axis === "cancel") {
          endDrag(carousel, st, true);
          return;
        }
        try {
          st.viewport.setPointerCapture(d.id);
        } catch (err) {
        }
      }
      if (d.axis !== "x") return;
      var proposed = d.baseX + dx;
      var atStartEdge = st.index === 0 && (directionOf(carousel) === "rtl" ? dx < 0 : dx > 0);
      var atEndEdge = st.index === st.count - 1 && (directionOf(carousel) === "rtl" ? dx > 0 : dx < 0);
      st.drag.dx = dx;
      setX(st, atStartEdge || atEndEdge ? d.baseX : proposed, false);
      e.preventDefault();
    }
    function endDrag(carousel, st, canceled, e) {
      var d = st.drag;
      if (!d) return;
      if (e && e.pointerId !== void 0 && e.pointerId !== d.id) return;
      detachDragWindow(st, d);
      st.drag = null;
      st.root.classList.remove("is-dragging");
      st.suppressClick = d.axis === "x";
      try {
        st.viewport.releasePointerCapture(d.id);
      } catch (err) {
      }
      if (st.disconnected) {
        setX(st, d.baseX, false);
        st.suppressClick = false;
        return;
      }
      var slideW = st.slides[st.index] ? st.slides[st.index].offsetWidth : 0;
      var threshold = Math.max(COMMIT_MIN, slideW * COMMIT_RATIO);
      var dx = d.dx || 0;
      if (canceled || Math.abs(dx) < threshold) {
        goToIndex(carousel, st.index, { animate: true });
        return;
      }
      var rtl = directionOf(carousel) === "rtl";
      var step = rtl ? dx > 0 ? 1 : -1 : dx < 0 ? 1 : -1;
      goToIndex(carousel, st.index + step, { animate: true });
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
        if (st.suppressClick && e.detail > 0) {
          st.suppressClick = false;
          return;
        }
        var slide = btn.closest("[data-carousel-slide]");
        if (!slide) return;
        if (st.slides[st.index] !== slide) {
          goToIndex(carousel, [].indexOf.call(st.slides, slide));
          return;
        }
        toggleExpand(st, slide);
      });
    }
    function wireDrag(carousel, st) {
      onLocal(carousel, st.viewport, "pointerdown", function(e) {
        onPointerDown(carousel, st, e);
      });
      onLocal(carousel, st.viewport, "dragstart", function(e) {
        if (!st.disconnected) e.preventDefault();
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
      st.x = 0;
      st.count = st.slides.length;
      st.drag = null;
      st.suppressClick = false;
      st.dotsBuilt = false;
      stateOf.set(carousel, st);
      carousel.setAttribute("role", "group");
      if (!carousel.hasAttribute("tabindex")) carousel.setAttribute("tabindex", "0");
      carousel.setAttribute("aria-roledescription", "عارض بطاقات");
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
      wireDrag(carousel, st);
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
    window.MicroCarousel = {
      init: function(root) {
        var scope = root || document;
        if (scope.matches && scope.matches("[data-carousel]")) setup(scope);
        scope.querySelectorAll("[data-carousel]").forEach(setup);
      },
      goTo: goToIndex,
      next,
      prev,
      /* العقد الموحد (المرحلة 6 — 2026-11-21): update(carousel, index, options)
         اسم موحد يفوّض إلى goTo نفسها — تنقل الفهرس (يطلق micro-carousel:change
         حتى برمجيًا وفق العقد). الاسم القديم goTo يبقى (D10)؛ تغيير بنية
         الشرائح يبقى دورة destroy/init موثقة لا update. */
      update: function(carousel, index, options) {
        goToIndex(carousel, index, options);
      },
      getIndex: function(carousel) {
        var st = stateOf.get(carousel);
        return st ? st.index : -1;
      },
      destroy: function(root) {
        var scope = root || document;
        window.MicroCarousel.disconnect(scope);
        var items = [].slice.call(scope.querySelectorAll("[data-carousel]"));
        if (scope.matches && scope.matches("[data-carousel]")) items.unshift(scope);
        items.forEach(function(carousel) {
          var st = stateOf.get(carousel);
          if (st && st.controller) st.controller.abort();
          if (st && st.dots) st.dots.textContent = "";
          stateOf.delete(carousel);
        });
      },
      /* SUI-025: فصل مراقبي الرصد تحت جذر لدورة التنظيف؛ init يظل متاحًا
         ويعيد الإلحاق عند الحاجة (نفس عقد MicroData.disconnect في data.js).
         الجذر نفسه إن كان عارضًا يُفصل أيضًا (init يعالج الجذر-الذات كذلك) */
      disconnect: function(root) {
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
            endDrag(carousel, st, true, null);
            st.suppressClick = false;
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
    };
    document.addEventListener("DOMContentLoaded", function() {
      window.MicroCarousel.init();
    });
    if (document.readyState !== "loading") window.MicroCarousel.init();
  })();
})();
