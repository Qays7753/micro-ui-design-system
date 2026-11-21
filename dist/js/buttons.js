(() => {
  (function() {
    "use strict";
    var state = /* @__PURE__ */ new WeakMap();
    var guarded = /* @__PURE__ */ new WeakSet();
    var guardControllers = /* @__PURE__ */ new WeakMap();
    function ensureActivationGuard(btn) {
      if (guarded.has(btn)) return;
      guarded.add(btn);
      var controller = new AbortController();
      guardControllers.set(btn, controller);
      function busy() {
        return btn.getAttribute("aria-busy") === "true";
      }
      btn.addEventListener("click", function(e) {
        if (busy()) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, { capture: true, signal: controller.signal });
      btn.addEventListener("keydown", function(e) {
        if (busy() && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, { capture: true, signal: controller.signal });
    }
    function wrapTextLabel(btn) {
      if (btn.querySelector(":scope > .m-btn__label")) return;
      var nodes = [].slice.call(btn.childNodes).filter(function(n) {
        return n.nodeType === 3 && n.textContent.trim() !== "";
      });
      if (!nodes.length) return;
      nodes.forEach(function(n) {
        var span = document.createElement("span");
        span.className = "m-btn__label";
        span.textContent = n.textContent;
        btn.replaceChild(span, n);
      });
      btn.dataset.labelWrapped = "1";
    }
    function unwrapTextLabel(btn) {
      if (btn.dataset.labelWrapped !== "1") return;
      [].slice.call(btn.querySelectorAll(":scope > .m-btn__label")).forEach(function(span) {
        btn.replaceChild(document.createTextNode(span.textContent), span);
      });
      btn.normalize();
      delete btn.dataset.labelWrapped;
    }
    function ensureSpinner(btn) {
      var spinner = btn.querySelector(":scope > .m-btn__spinner");
      if (spinner) return;
      spinner = document.createElement("span");
      spinner.className = "m-btn__spinner";
      spinner.setAttribute("aria-hidden", "true");
      var icon = btn.querySelector(":scope > .m-btn__icon");
      if (icon) {
        icon.parentElement.insertBefore(spinner, icon);
      } else if (!btn.classList.contains("m-btn--loading-replace")) {
        btn.insertBefore(spinner, btn.firstChild);
      } else {
        btn.insertBefore(spinner, btn.firstChild);
        btn.classList.add("is-loading--text");
        wrapTextLabel(btn);
      }
    }
    function setLoading(btn, isLoading, options) {
      if (!btn || btn.nodeType !== 1) return;
      options = options || {};
      var busy = btn.getAttribute("aria-busy") === "true";
      if (isLoading) {
        if (busy || btn.disabled) return;
        var saved = {
          label: btn.getAttribute("aria-label"),
          hadLabel: btn.hasAttribute("aria-label")
        };
        state.set(btn, saved);
        btn.setAttribute("aria-busy", "true");
        btn.classList.add("is-loading");
        var label = options.loadingLabel || btn.getAttribute("data-loading-label");
        if (label) btn.setAttribute("aria-label", label);
        ensureSpinner(btn);
        ensureActivationGuard(btn);
      } else {
        if (!busy || !state.has(btn)) return;
        var saved2 = state.get(btn);
        if (saved2.hadLabel) btn.setAttribute("aria-label", saved2.label);
        else btn.removeAttribute("aria-label");
        state.delete(btn);
        btn.removeAttribute("aria-busy");
        btn.classList.remove("is-loading", "is-loading--text");
        var spinner = btn.querySelector(":scope > .m-btn__spinner");
        if (spinner && spinner.dataset.demo !== "persistent") spinner.remove();
        unwrapTextLabel(btn);
      }
    }
    window.MicroButtons = {
      setLoading,
      /* العقد الموحد (المرحلة 6 — 2026-11-21): B01 مكيّف بالترميز والربط
         تلقائي عند التحميل (حراسات التحميل تُنشأ عند أول setLoading)، فهذا
         init ليست تهيئة ربط بل اكتشاف موثق فقط: تعيد أزرار النطاق كي
         تشتغل كود التهيئة الموحد عند المضيف على الجذر نفسه؛ استدعاؤها
         مرتين بريء تمامًا ولا يضيف أي مستمع. لا update هنا: لا مفهوم
         بيانات للزر — حالة التحميل العابرة عبر setLoading. */
      init: function(root) {
        var scope = root || document;
        var buttons = [].slice.call(scope.querySelectorAll(".m-btn"));
        if (scope.matches && scope.matches(".m-btn")) buttons.unshift(scope);
        return buttons;
      },
      disconnect: function(root) {
        var scope = root || document;
        var buttons = [].slice.call(scope.querySelectorAll(".m-btn"));
        if (scope.matches && scope.matches(".m-btn")) buttons.unshift(scope);
        buttons.forEach(function(button) {
          setLoading(button, false);
          var controller = guardControllers.get(button);
          if (controller) controller.abort();
          guardControllers.delete(button);
          guarded.delete(button);
        });
      }
    };
  })();
})();
