(() => {
  (function() {
    "use strict";
    var AXIS_LOCK = 8;
    var COMMIT_RATIO = 0.2;
    var COMMIT_MIN = 32;
    var reduceQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    function prefersReducedMotion() {
      return !!(reduceQuery && reduceQuery.matches);
    }
    var stateOf = /* @__PURE__ */ new WeakMap();
    var viewportObservers = /* @__PURE__ */ new WeakMap();
    var RESIZE_EPS = 0.5;
    function recenterStrip(strip, st) {
      if (st.disconnected) return;
      if (st.raf) return;
      st.raf = requestAnimationFrame(function() {
        st.raf = null;
        if (st.disconnected || st.count <= 0) return;
        var w = st.viewport.clientWidth;
        if (w <= 1) return;
        var direction = getComputedStyle(strip).direction;
        if (st.lastWidth !== void 0 && Math.abs(w - st.lastWidth) < RESIZE_EPS && direction === st.lastDirection) return;
        st.lastWidth = w;
        st.lastDirection = direction;
        goToIndex(strip, st.index, { animate: false });
      });
    }
    function observeViewport(strip, st) {
      if (typeof ResizeObserver !== "function") return;
      if (viewportObservers.has(strip)) return;
      var ro = new ResizeObserver(function(entries) {
        if (st.disconnected || viewportObservers.get(strip) !== ro) return;
        var w = entries.length ? entries[0].contentRect.width : 0;
        if (w <= 1) return;
        recenterStrip(strip, st);
      });
      ro.observe(st.viewport);
      viewportObservers.set(strip, ro);
    }
    function rtlOf(strip) {
      return getComputedStyle(strip).direction === "rtl";
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
    function goToIndex(strip, i, opts) {
      var st = stateOf.get(strip);
      if (!st || st.disconnected || st.count === 0) return;
      var animate = !(opts && opts.animate === false);
      var clamped = Math.max(0, Math.min(st.count - 1, i));
      setX(st, slideX(st, clamped), animate);
      if (clamped !== st.index) {
        st.index = clamped;
        update(strip, st);
        strip.dispatchEvent(new CustomEvent("micro-info-peek:change", {
          bubbles: true,
          detail: { index: st.index, count: st.count }
        }));
      } else {
        update(strip, st);
      }
    }
    function update(strip, st) {
      var activeEl = document.activeElement;
      var focusedIdx = -1;
      if (activeEl) {
        for (var fi = 0; fi < st.slides.length; fi++) {
          if (st.slides[fi].contains(activeEl)) {
            focusedIdx = fi;
            break;
          }
        }
      }
      st.slides.forEach(function(slide, i) {
        var active = i === st.index;
        slide.setAttribute("aria-hidden", active ? "false" : "true");
        slide.inert = !active;
      });
      if (focusedIdx >= 0 && focusedIdx !== st.index) {
        st.viewport.focus({ preventScroll: true });
      }
      if (st.prevBtn) st.prevBtn.disabled = st.index === 0 || st.count <= 1;
      if (st.nextBtn) st.nextBtn.disabled = st.index === st.count - 1 || st.count <= 1;
      if (st.position) st.position.textContent = st.index + 1 + " / " + st.count;
      if (st.status) st.status.textContent = "البطاقة " + (st.index + 1) + " من " + st.count;
      if (st.pages) {
        Array.prototype.forEach.call(st.pages.querySelectorAll("[data-info-strip-page]"), function(b, i) {
          b.setAttribute("aria-current", i === st.index ? "true" : "false");
          b.setAttribute("aria-pressed", i === st.index ? "true" : "false");
        });
      }
    }
    function onPointerDown(strip, st, e) {
      if (st.disconnected || st.drag || st.count <= 1 || isEditingTarget(e.target) || e.pointerType === "mouse" && e.button !== 0) return;
      st.drag = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        baseX: st.x,
        axis: null,
        handlers: null
      };
      st.suppressClick = false;
      st.track.classList.add("is-peek-dragging");
      st.viewport.classList.add("is-peek-grabbing");
      attachDragWindow(strip, st);
    }
    function attachDragWindow(strip, st) {
      var d = st.drag;
      if (!d || d.handlers) return;
      d.handlers = {
        move: function(e) {
          onPointerMove(strip, st, e);
        },
        up: function(e) {
          endDrag(strip, st, false, e);
        },
        cancel: function(e) {
          endDrag(strip, st, true, e);
        },
        blur: function() {
          endDrag(strip, st, true, null);
        },
        vis: function() {
          if (document.visibilityState === "hidden") endDrag(strip, st, true, null);
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
    function onPointerMove(strip, st, e) {
      var d = st.drag;
      if (!d || e.pointerId !== d.id) return;
      var dx = e.clientX - d.startX;
      var dy = e.clientY - d.startY;
      if (!d.axis) {
        if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
        d.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "cancel";
        if (d.axis === "cancel") {
          endDrag(strip, st, true);
          return;
        }
        try {
          st.viewport.setPointerCapture(d.id);
        } catch (err) {
        }
      }
      if (d.axis !== "x") return;
      var proposed = d.baseX + dx;
      var rtl = rtlOf(strip);
      var atStartEdge = st.index === 0 && (rtl ? dx < 0 : dx > 0);
      var atEndEdge = st.index === st.count - 1 && (rtl ? dx > 0 : dx < 0);
      st.drag.dx = dx;
      setX(st, atStartEdge || atEndEdge ? d.baseX : proposed, false);
      e.preventDefault();
    }
    function endDrag(strip, st, canceled, e) {
      var d = st.drag;
      if (!d) return;
      if (e && e.pointerId !== void 0 && e.pointerId !== d.id) return;
      detachDragWindow(st, d);
      st.drag = null;
      st.track.classList.remove("is-peek-dragging");
      st.viewport.classList.remove("is-peek-grabbing");
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
        goToIndex(strip, st.index, { animate: true });
        return;
      }
      var rtl = rtlOf(strip);
      var step = rtl ? dx > 0 ? 1 : -1 : dx < 0 ? 1 : -1;
      goToIndex(strip, st.index + step, { animate: true });
    }
    function isEditingTarget(target) {
      return !!(target && (target.isContentEditable || target.closest && target.closest(
        'input, textarea, select, option, [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], [role="slider"], [data-info-strip-editable]'
      )));
    }
    function wireKeys(strip, st) {
      strip.addEventListener("keydown", function(e) {
        if (st.disconnected || e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || st.count === 0) return;
        var target = e.target;
        if (isEditingTarget(target)) return;
        if (target && target.closest && target.closest("button, a[href], summary") && !target.closest("[data-info-strip-prev], [data-info-strip-next], [data-info-strip-page]")) return;
        var rtl = rtlOf(strip);
        var handled = true;
        if (e.key === "ArrowRight") {
          rtl ? prev(strip) : next(strip);
        } else if (e.key === "ArrowLeft") {
          rtl ? next(strip) : prev(strip);
        } else if (e.key === "Home") {
          goToIndex(strip, 0);
        } else if (e.key === "End") {
          goToIndex(strip, st.count - 1);
        } else {
          handled = false;
        }
        if (handled) e.preventDefault();
      });
    }
    function activate(strip, st) {
      st.disconnected = false;
      if (!st.resizeHandler) {
        st.resizeHandler = function() {
          recenterStrip(strip, st);
        };
        window.addEventListener("resize", st.resizeHandler);
      }
      if (reduceQuery && reduceQuery.addEventListener && !st.motionHandler) {
        st.motionHandler = function() {
          goToIndex(strip, st.index, { animate: false });
        };
        reduceQuery.addEventListener("change", st.motionHandler);
      }
      observeViewport(strip, st);
      if (!st.directionObserver && typeof MutationObserver === "function") {
        var observer = new MutationObserver(function() {
          if (st.disconnected || st.directionObserver !== observer || getComputedStyle(strip).direction === st.lastDirection) return;
          recenterStrip(strip, st);
        });
        st.directionObserver = observer;
        for (var node = strip; node; node = node.parentElement) {
          observer.observe(node, { attributes: true, attributeFilter: ["dir", "class", "style"] });
        }
      }
      recenterStrip(strip, st);
      var generation = st.generation = (st.generation || 0) + 1;
      if (document.fonts) document.fonts.ready.then(function() {
        if (st.disconnected || st.generation !== generation) return;
        st.lastWidth = void 0;
        recenterStrip(strip, st);
      });
    }
    function initStrip(strip) {
      if (stateOf.has(strip)) {
        var reSt = stateOf.get(strip);
        if (reSt && reSt.count > 0) {
          if (reSt.disconnected) activate(strip, reSt);
          else recenterStrip(strip, reSt);
        }
        return;
      }
      var viewport = strip.querySelector("[data-info-strip-viewport]");
      var track = strip.querySelector("[data-info-strip-track]");
      var slides = track ? Array.prototype.slice.call(track.children).filter(function(n) {
        return n.classList.contains("m-info-strip__slide");
      }) : [];
      var controls = strip.querySelector("[data-info-strip-controls]");
      var pages = strip.querySelector("[data-info-strip-pages]");
      var status = strip.querySelector("[data-info-strip-status]");
      var empty = strip.querySelector("[data-info-strip-empty]");
      var prevBtn = strip.querySelector("[data-info-strip-prev]");
      var nextBtn = strip.querySelector("[data-info-strip-next]");
      var position = strip.querySelector("[data-info-strip-position]");
      if (!viewport || !track) return;
      strip.setAttribute("data-info-peek-ready", "");
      if (!slides.length) {
        viewport.hidden = true;
        if (controls) controls.hidden = true;
        if (empty) empty.hidden = false;
        if (position) position.textContent = "";
        if (status) status.textContent = "لا توجد بطاقات.";
        stateOf.set(strip, {
          viewport,
          track,
          slides: [],
          prevBtn,
          nextBtn,
          position,
          status,
          pages,
          index: -1,
          x: 0,
          count: 0,
          drag: null,
          suppressClick: false
        });
        return;
      }
      if (!strip.hasAttribute("tabindex")) strip.setAttribute("tabindex", "0");
      if (empty) empty.hidden = true;
      if (slides.length < 2 && controls) controls.hidden = true;
      var st = {
        viewport,
        track,
        slides,
        prevBtn,
        nextBtn,
        position,
        status,
        pages,
        index: 0,
        x: 0,
        count: slides.length,
        drag: null,
        suppressClick: false
      };
      stateOf.set(strip, st);
      if (pages) {
        pages.setAttribute("role", "group");
        if (!pages.hasAttribute("aria-label")) pages.setAttribute("aria-label", "اختيار البطاقة");
        pages.textContent = "";
        slides.forEach(function(_, i) {
          var page = document.createElement("button");
          page.type = "button";
          page.className = "m-info-strip__page";
          page.setAttribute("data-info-strip-page", "");
          page.setAttribute("aria-label", "عرض البطاقة " + (i + 1));
          page.setAttribute("aria-current", i === 0 ? "true" : "false");
          page.setAttribute("aria-pressed", i === 0 ? "true" : "false");
          page.addEventListener("click", function() {
            goToIndex(strip, i, false);
          });
          pages.appendChild(page);
        });
      }
      if (prevBtn) prevBtn.addEventListener("click", function() {
        prev(strip);
      });
      if (nextBtn) nextBtn.addEventListener("click", function() {
        next(strip);
      });
      viewport.addEventListener("pointerdown", function(e) {
        onPointerDown(strip, st, e);
      });
      viewport.addEventListener("dragstart", function(e) {
        if (!st.disconnected) e.preventDefault();
      });
      viewport.addEventListener("click", function(e) {
        if (st.suppressClick) {
          e.preventDefault();
          e.stopPropagation();
          st.suppressClick = false;
        }
      }, true);
      wireKeys(strip, st);
      activate(strip, st);
      update(strip, st);
      recenterStrip(strip, st);
    }
    function next(strip) {
      var st = stateOf.get(strip);
      if (st) goToIndex(strip, st.index + 1);
    }
    function prev(strip) {
      var st = stateOf.get(strip);
      if (st) goToIndex(strip, st.index - 1);
    }
    window.MicroInfoPeek = {
      init: function(root) {
        var scope = root || document;
        if (scope.matches && scope.matches("[data-info-peek]")) initStrip(scope);
        scope.querySelectorAll("[data-info-peek]").forEach(initStrip);
      },
      goTo: goToIndex,
      next,
      prev,
      /* العقد الموحد (المرحلة 6 — 2026-11-21): update(strip, index, options)
         اسم موحد يفوّض إلى goTo نفسها — تنقل الفهرس (يطلق change حتى
         برمجيًا وفق العقد). الاسم القديم goTo يبقى (D10)؛ تغيير بنية
         الشرائح يبقى دورة disconnect/init موثقة لا update. */
      update: function(strip, index, options) {
        goToIndex(strip, index, options);
      },
      getIndex: function(strip) {
        var st = stateOf.get(strip);
        return st ? st.index : -1;
      },
      /* SUI-007: فصل مراقبي الرصد تحت جذر لدورة التنظيف؛ init يظل متاحًا
         ويعيد الإلحاق عند الحاجة (نفس عقد MicroData.disconnect في data.js).
         الجذر نفسه إن كان شريطًا يُفصل أيضًا (init يعالج الجذر-الذات كذلك) */
      disconnect: function(root) {
        var scope = root || document;
        var strips = [];
        if (scope.matches && scope.matches("[data-info-peek]")) strips.push(scope);
        Array.prototype.push.apply(strips, scope.querySelectorAll("[data-info-peek]"));
        strips.forEach(function(strip) {
          var ro = viewportObservers.get(strip);
          if (ro) {
            ro.disconnect();
            viewportObservers.delete(strip);
          }
          var st = stateOf.get(strip);
          if (st) {
            st.disconnected = true;
            if (st.directionObserver) {
              st.directionObserver.disconnect();
              st.directionObserver = null;
            }
            st.generation = (st.generation || 0) + 1;
            endDrag(strip, st, true, null);
            st.suppressClick = false;
            if (st.resizeHandler) {
              window.removeEventListener("resize", st.resizeHandler);
              st.resizeHandler = null;
            }
            if (st.motionHandler) {
              reduceQuery.removeEventListener("change", st.motionHandler);
              st.motionHandler = null;
            }
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
      window.MicroInfoPeek.init();
    });
    if (document.readyState !== "loading") window.MicroInfoPeek.init();
  })();
})();
