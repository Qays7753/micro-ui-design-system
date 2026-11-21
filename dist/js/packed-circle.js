(() => {
  (function() {
    "use strict";
    var NUM_RE = /^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/;
    var observers = /* @__PURE__ */ new WeakMap();
    var resizeFrames = /* @__PURE__ */ new WeakMap();
    var disconnected = /* @__PURE__ */ new WeakSet();
    function layoutPacked(chart, nodes, wrap) {
      var available = wrap.clientWidth || chart.clientWidth;
      if (!available || !nodes.length) return;
      var requested = parseNum(getComputedStyle(chart).getPropertyValue("--packed-overlap"));
      requested = requested === null ? 12 : Math.max(0, requested);
      var gap = parseFloat(getComputedStyle(chart).getPropertyValue("--micro-space-4")) || 16;
      var groups = [];
      for (var i = 0; i < nodes.length; i += 3) groups.push(nodes.slice(i, i + 3));
      var widest = Math.max.apply(null, groups.map(function(g) {
        return g[0].diameter + (g[1] ? Math.max(g[1].diameter, g[2] ? g[2].diameter : 0) : 0);
      }));
      var factor = Math.min(1, available / widest);
      nodes.forEach(function(n) {
        n.d = n.diameter * factor;
        n.circ.style.width = n.circ.style.height = n.d + "px";
        n.circ.appendChild(n.value);
        var previous = n.value.style.whiteSpace;
        n.value.style.whiteSpace = "nowrap";
        var t = n.value.getBoundingClientRect();
        n.textDiagonal = Math.hypot(t.width, t.height);
        n.inside = n.textDiagonal + 8 <= n.d;
        n.value.style.whiteSpace = previous;
        n.bubble.setAttribute("data-value-placement", n.inside ? "inside" : "outside");
        if (!n.inside) n.row.appendChild(n.value);
        n.row.setAttribute("data-external-value", n.inside ? "false" : "true");
      });
      function overlap(a, b) {
        var cap = Math.min(requested, Math.min(a.d, b.d) * 0.25);
        [a, b].forEach(function(n) {
          if (n.inside) cap = Math.min(cap, Math.max(0, (n.d - n.textDiagonal) / 2 - 2));
        });
        return Math.max(0, cap);
      }
      var top = 0;
      groups.forEach(function(g) {
        var main = g[0], a = g[1], b = g[2];
        var verticalOverlap = a && b ? overlap(a, b) : 0;
        var stackHeight = a ? a.d + (b ? b.d - verticalOverlap : 0) : 0;
        var height = Math.max(main.d, stackHeight);
        var sideOverlap = a ? Math.min(overlap(main, a), b ? overlap(main, b) : Infinity) : 0;
        var width = main.d + (a ? Math.max(a.d, b ? b.d : 0) - sideOverlap : 0);
        var start = (available - width) / 2;
        function position(n, x, y) {
          n.bubble.style.insetInlineStart = x + "px";
          n.bubble.style.top = top + y + "px";
          n.bubble.style.width = n.bubble.style.height = n.d + "px";
        }
        position(main, start, (height - main.d) / 2);
        if (a) position(a, start + main.d - sideOverlap, (height - stackHeight) / 2);
        if (b) position(b, start + main.d - sideOverlap, (height - stackHeight) / 2 + a.d - verticalOverlap);
        top += height + gap;
      });
      wrap.style.height = Math.max(0, top - gap) + "px";
    }
    function stateList(items) {
      var list = document.createElement("ul");
      list.className = "m-packed__states m-legend";
      list.setAttribute("aria-label", "حالات لا تدخل الرسم المساحي");
      items.forEach(function(it) {
        var li = document.createElement("li");
        li.className = "m-legend__item m-cat--" + it.series;
        var label = document.createElement("span");
        label.textContent = it.label;
        var value = document.createElement("bdi");
        value.className = "m-legend__value";
        value.textContent = it.value === 0 ? "0 (صفر)" : stateText(it).text;
        li.appendChild(label);
        li.appendChild(value);
        list.appendChild(li);
      });
      return list;
    }
    function parseNum(raw) {
      if (raw === null || raw === void 0) return null;
      var s = String(raw).trim();
      if (s === "" || !NUM_RE.test(s)) return null;
      var v = Number(s);
      return isNaN(v) || !isFinite(v) ? null : v;
    }
    function itemsOf(chart) {
      return [].slice.call(chart.querySelectorAll(".m-chart__data [data-series]")).map(function(li) {
        var hasAttr = li.hasAttribute("data-value");
        return {
          series: li.getAttribute("data-series") || "a",
          label: li.getAttribute("data-label") || "",
          fullLabel: li.getAttribute("data-label-full") || li.getAttribute("data-label") || "",
          hasAttr,
          raw: li.getAttribute("data-value"),
          value: hasAttr ? parseNum(li.getAttribute("data-value")) : null,
          display: li.getAttribute("data-display") || ""
        };
      });
    }
    function stateText(it) {
      if (!it.hasAttr) return { text: "(غير معروف)", none: true };
      if (it.value === null) return { text: it.raw && it.raw.trim() ? it.raw + " (قيمة غير صالحة)" : "(غير متاح)", none: true };
      if (it.value < 0) {
        var num = it.display || it.raw || String(it.value);
        return { text: num + " (سالب غير صالح للمساحة)", none: true };
      }
      if (it.value === 0) return { text: "0", none: true };
      return { text: it.display || it.raw || String(it.value), none: false };
    }
    var packedUid = 0;
    function packedValueState(it) {
      if (!it.hasAttr) return "(غير معروف)";
      if (it.value === null) return it.raw && it.raw.trim() ? it.raw + " (قيمة غير صالحة)" : "(غير متاح)";
      if (it.value < 0) return (it.display || it.raw || String(it.value)) + " (سالب غير صالح للمساحة)";
      if (it.value === 0) return "0 (صفر)";
      return it.display || it.raw || String(it.value);
    }
    function syncPackedTable(chart) {
      var items = itemsOf(chart);
      var wrap = chart.querySelector(".m-chart__dataset-wrap");
      var btn, table;
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "m-chart__dataset-wrap";
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "m-btn m-btn--secondary m-chart__disclose";
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "عرض البيانات كجدول";
        table = document.createElement("table");
        table.className = "m-chart__dataset";
        table.hidden = true;
        wrap.appendChild(btn);
        wrap.appendChild(table);
        chart.appendChild(wrap);
      } else {
        btn = wrap.querySelector(".m-chart__disclose");
        table = wrap.querySelector(".m-chart__dataset");
      }
      if (btn) btn.classList.add("m-btn", "m-btn--secondary");
      var binding = btn && btn.__microDatasetDisclosure;
      if (btn && table && (!binding || binding.table !== table)) {
        if (binding) btn.removeEventListener("click", binding.handler);
        do {
          table.id = "micro-packed-dataset-" + ++packedUid;
        } while (document.getElementById(table.id) && document.getElementById(table.id) !== table);
        btn.setAttribute("aria-controls", table.id);
        var handler = function() {
          var open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", open ? "false" : "true");
          table.hidden = open;
          btn.textContent = open ? "عرض البيانات كجدول" : "إخفاء جدول البيانات";
        };
        btn.__microDatasetDisclosure = { table, handler };
        btn.addEventListener("click", handler);
      }
      if (!btn || !table) return;
      table.textContent = "";
      var caption = document.createElement("caption");
      var title = chart.querySelector(".m-chart__title");
      var context = [String(title && title.textContent || chart.getAttribute("data-title") || chart.getAttribute("aria-label") || "").trim()];
      [["data-unit", "الوحدة"], ["data-period", "الفترة"], ["data-max", "المقياس"]].forEach(function(part) {
        var value = chart.getAttribute(part[0]);
        if (value && value.trim()) context.push(part[1] + ": " + value.trim());
      });
      caption.textContent = context.filter(Boolean).join("، ");
      table.appendChild(caption);
      var thead = document.createElement("thead");
      var headRow = document.createElement("tr");
      ["الفئة", "القيمة"].forEach(function(h) {
        var th = document.createElement("th");
        th.setAttribute("scope", "col");
        th.textContent = h;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);
      var tbody = document.createElement("tbody");
      items.forEach(function(it) {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = it.fullLabel;
        tr.appendChild(th);
        var td = document.createElement("td");
        var fullValue = packedValueState(it);
        var rawValue = !it.hasAttr ? null : it.value === null ? it.raw && it.raw.trim() ? it.raw : null : it.value === 0 ? "0" : it.display || it.raw || String(it.value);
        if (rawValue !== null) {
          var number = document.createElement("bdi");
          number.dir = it.value === null ? "auto" : "ltr";
          number.textContent = rawValue;
          td.appendChild(number);
          td.appendChild(document.createTextNode(fullValue.slice(rawValue.length)));
        } else td.textContent = fullValue;
        tr.appendChild(td);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
    }
    function scaleError(chart, positiveExists, vmaxDerived) {
      var raw = chart.getAttribute("data-max");
      var plot = chart.querySelector("[data-plot]");
      var err = document.createElement("p");
      err.className = "m-chart__scale-error";
      err.textContent = "تعذّر رسم المقارنة بهذا المقياس. القيم معروضة في المفتاح دون رسم.";
      var devDetail = parseNum(raw) === 0 ? 'packed-circle: data-max="' + raw + '" صفر' + (positiveExists ? " بينما توجد قيم موجبة؛ تعارض بيانات: لا مقارنة مساحية من مقياس صفر ولا استبدال تلقائي للمقياس." : " ولا توجد قيم موجبة للمقارنة.") : 'packed-circle: data-max="' + raw + '" غير صالح (سالب أو غير رقمي) للمقارنة المساحية.';
      chart.setAttribute("data-scale-detail", devDetail);
      plot.innerHTML = "";
      plot.appendChild(err);
      if (!positiveExists) {
        var empty = document.createElement("p");
        empty.className = "m-packed__empty";
        empty.setAttribute("data-empty", "");
        empty.textContent = "لا توجد قيم موجبة قابلة للرسم المساحي.";
        plot.appendChild(empty);
        var states = stateList(itemsOf(chart));
        if (states.children.length) plot.appendChild(states);
      } else {
        renderKeyOnly(chart);
      }
      chart.dispatchEvent(new CustomEvent("micro-packed:rendered", {
        bubbles: true,
        detail: { ok: false, reason: "scale-invalid", vmaxDerived: vmaxDerived || null }
      }));
    }
    function renderKeyOnly(chart) {
      var plot = chart.querySelector("[data-plot]");
      var legend = document.createElement("ul");
      legend.className = "m-legend";
      itemsOf(chart).forEach(function(it) {
        var li = document.createElement("li");
        li.className = "m-legend__item m-cat--" + it.series;
        var sw = document.createElement("span");
        sw.className = "m-legend__swatch";
        li.appendChild(sw);
        li.appendChild(document.createTextNode(it.label + " "));
        var val = document.createElement("span");
        val.className = "m-legend__value";
        val.textContent = stateText(it).text;
        li.appendChild(val);
        legend.appendChild(li);
      });
      plot.appendChild(legend);
    }
    function renderPacked(chart) {
      if (observers.has(chart)) observers.get(chart).disconnect();
      observers.delete(chart);
      if (resizeFrames.has(chart)) window.cancelAnimationFrame(resizeFrames.get(chart));
      resizeFrames.delete(chart);
      var plot = chart.querySelector("[data-plot]");
      chart.removeAttribute("data-packed-state");
      var items = itemsOf(chart);
      var positives = items.filter(function(i) {
        return i.value !== null && i.value > 0;
      });
      var rmaxAttr = parseNum(chart.getAttribute("data-rmax"));
      var Rmax = rmaxAttr !== null && rmaxAttr > 0 ? rmaxAttr : 52;
      var maxAttr = chart.getAttribute("data-max");
      var hasMaxAttr = maxAttr !== null && String(maxAttr).trim() !== "";
      var declaredMax = hasMaxAttr ? parseNum(maxAttr) : null;
      var vmax;
      var derived = positives.length ? Math.max.apply(null, positives.map(function(i) {
        return i.value;
      })) : 0;
      if (!hasMaxAttr) {
        vmax = derived > 0 ? derived : 1;
      } else if (declaredMax === null || declaredMax < 0) {
        scaleError(chart, positives.length > 0, derived);
        return;
      } else if (declaredMax === 0) {
        if (positives.length > 0) {
          scaleError(chart, true, derived);
          return;
        }
        vmax = 1;
      } else {
        vmax = declaredMax;
      }
      if (positives.length > 5) {
        plot.innerHTML = "";
        var densityError = document.createElement("p");
        densityError.className = "m-chart__scale-error";
        densityError.textContent = "تعذر عرض الدوائر لمقارنة أكثر من خمس فئات موجبة. القيم الكاملة معروضة في المفتاح.";
        plot.appendChild(densityError);
        renderKeyOnly(chart);
        chart.setAttribute("data-packed-state", "too-many-positive-categories");
        chart.dispatchEvent(new CustomEvent("micro-packed:rendered", {
          bubbles: true,
          detail: { ok: false, reason: "too-many-positive-categories", vmaxDerived: !hasMaxAttr }
        }));
        return;
      }
      plot.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "m-bubbles";
      var labels = document.createElement("ul");
      labels.className = "m-packed__labels";
      var nodes = [];
      var order = positives.slice().sort(function(a, b) {
        return b.value - a.value;
      });
      order.forEach(function(it) {
        var b = document.createElement("div");
        b.className = "m-bubble m-cat--" + it.series;
        var circ = document.createElement("span");
        var valTxt = document.createElement("span");
        valTxt.className = "m-bubble__value";
        if (chart.getAttribute("data-legend") !== "off") {
          valTxt.setAttribute("aria-hidden", "true");
        }
        var lab = document.createElement("span");
        lab.className = "m-bubble__label";
        lab.textContent = it.label;
        var r = Rmax * Math.sqrt(it.value / vmax);
        circ.className = "m-bubble__circle";
        circ.style.width = circ.style.height = r * 2 + "px";
        b.setAttribute("data-size", r >= Rmax * 0.7 ? "large" : "small");
        valTxt.textContent = stateText(it).text;
        circ.appendChild(valTxt);
        b.appendChild(circ);
        wrap.appendChild(b);
        var row = document.createElement("li");
        row.className = "m-packed__value-row m-cat--" + it.series;
        var swatch = document.createElement("span");
        swatch.className = "m-legend__swatch";
        swatch.setAttribute("aria-hidden", "true");
        row.appendChild(swatch);
        row.appendChild(lab);
        labels.appendChild(row);
        nodes.push({ bubble: b, circ, value: valTxt, row, diameter: r * 2 });
      });
      if (positives.length) {
        plot.appendChild(wrap);
        plot.appendChild(labels);
        layoutPacked(chart, nodes, wrap);
        if (window.ResizeObserver) {
          var observer = new ResizeObserver(function() {
            if (resizeFrames.has(chart)) return;
            resizeFrames.set(chart, window.requestAnimationFrame(function() {
              resizeFrames.delete(chart);
              if (chart.isConnected && !disconnected.has(chart) && observers.get(chart) === observer && plot.contains(wrap)) {
                layoutPacked(chart, nodes, wrap);
              }
            }));
          });
          observer.observe(chart);
          nodes.forEach(function(n) {
            observer.observe(n.value);
          });
          observers.set(chart, observer);
        }
        if (document.fonts) document.fonts.ready.then(function() {
          if (chart.isConnected && !disconnected.has(chart) && plot.contains(wrap)) layoutPacked(chart, nodes, wrap);
        });
      } else {
        var empty = document.createElement("p");
        empty.className = "m-packed__empty";
        empty.setAttribute("data-empty", "");
        empty.textContent = "لا توجد قيم موجبة قابلة للرسم المساحي.";
        plot.appendChild(empty);
      }
      var special = items.filter(function(it) {
        return stateText(it).none;
      });
      if (special.length) plot.appendChild(stateList(special));
      if (positives.length && chart.getAttribute("data-legend") !== "off") {
        var legend = document.createElement("ul");
        legend.className = "m-legend";
        positives.forEach(function(it) {
          var li = document.createElement("li");
          li.className = "m-legend__item m-cat--" + it.series;
          var sw = document.createElement("span");
          sw.className = "m-legend__swatch";
          li.appendChild(sw);
          li.appendChild(document.createTextNode(it.label + " "));
          var val = document.createElement("span");
          val.className = "m-legend__value";
          val.textContent = stateText(it).text;
          li.appendChild(val);
          legend.appendChild(li);
        });
        plot.appendChild(legend);
      }
      if (chart.hasAttribute("data-summary-text")) {
        var summary = chart.querySelector("[data-summary]");
        if (summary && !summary.textContent) summary.textContent = chart.getAttribute("data-summary-text");
      }
      chart.dispatchEvent(new CustomEvent("micro-packed:rendered", {
        bubbles: true,
        detail: { ok: true, vmaxDerived: !hasMaxAttr }
      }));
    }
    function render(chart) {
      disconnected.delete(chart);
      renderPacked(chart);
      syncPackedTable(chart);
    }
    window.MicroPacked = {
      init: function(root) {
        var scope = root || document;
        if (scope.matches && scope.matches("[data-chart-packed]")) render(scope);
        scope.querySelectorAll("[data-chart-packed]").forEach(render);
      },
      render,
      disconnect: function(root) {
        var scope = root || document;
        var charts = [].slice.call(scope.querySelectorAll("[data-chart-packed]"));
        if (scope.matches && scope.matches("[data-chart-packed]")) charts.unshift(scope);
        charts.forEach(function(chart) {
          disconnected.add(chart);
          if (observers.has(chart)) observers.get(chart).disconnect();
          observers.delete(chart);
          if (resizeFrames.has(chart)) window.cancelAnimationFrame(resizeFrames.get(chart));
          resizeFrames.delete(chart);
        });
      }
    };
    document.addEventListener("DOMContentLoaded", function() {
      window.MicroPacked.init();
    });
    if (document.readyState !== "loading") window.MicroPacked.init();
  })();
})();
