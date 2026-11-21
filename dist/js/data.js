(() => {
  (function() {
    "use strict";
    var NS = "http://www.w3.org/2000/svg";
    var NUM_RE = /^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/;
    function parseNum(raw) {
      if (raw === null || raw === void 0) return null;
      var s = String(raw).trim();
      if (s === "" || !NUM_RE.test(s)) return null;
      var v = Number(s);
      return isNaN(v) || !isFinite(v) ? null : v;
    }
    function itemsOf(chart) {
      return [].slice.call(chart.querySelectorAll(".m-chart__data [data-series]")).map(function(li) {
        var raw = li.getAttribute("data-value");
        var v = parseNum(raw);
        return {
          series: li.getAttribute("data-series") || "a",
          key: li.getAttribute("data-key"),
          unit: li.hasAttribute("data-unit") ? li.getAttribute("data-unit") : chart.getAttribute("data-unit") || "",
          period: li.hasAttribute("data-period") ? li.getAttribute("data-period") : chart.getAttribute("data-period") || "",
          label: li.getAttribute("data-label") || "",
          /* R3-UI02: قراءة كاملة اختيارية يمررها المستهلك — إن غابت فهي
             data-label نفسه؛ يستخدمها القصّ في aria-label/<title>.
             المكوّن العام لا يفترض أن كل label تاريخ — يعرض ما مرره
             المستهلك، والقراءة الكاملة سمة اختيارية (عقد specification.md) */
          labelFull: li.getAttribute("data-label-full") || li.getAttribute("data-label") || "",
          axisX: li.getAttribute("data-x"),
          axisBoundary: li.hasAttribute("data-axis-boundary") || li.hasAttribute("data-semantic-boundary"),
          rawValue: raw,
          invalid: v === null && raw !== null && String(raw).trim() !== "" && li.getAttribute("data-state") !== "unavailable",
          signed: chart.getAttribute("data-value-domain") === "signed" && /^(bars|line)$/.test(chart.getAttribute("data-chart")),
          value: v,
          display: li.getAttribute("data-display") || "",
          outlier: li.hasAttribute("data-outlier")
        };
      });
    }
    function svgEl(tag, attrs) {
      var el = document.createElementNS(NS, tag);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      return el;
    }
    function fmt(v) {
      return String(v);
    }
    function readingOf(item) {
      if (item.value === null) return item.invalid ? "قيمة غير صالحة" : "(غير متاح)";
      if (item.value < 0 && !item.signed) return (item.display || item.rawValue || fmt(item.value)) + " (سالب غير مرسوم)";
      return item.display || item.rawValue || fmt(item.value);
    }
    function fullLabelOf(chart, item) {
      var label = item.labelFull || item.label;
      var isTimeAxis = chart.getAttribute("data-chart") === "line" && chart.getAttribute("data-axis-type") === "time";
      if (isTimeAxis && item.axisX !== null && item.axisX !== "" && label.indexOf(String(item.axisX)) === -1) {
        label += "، " + item.axisX;
      }
      return label;
    }
    function writeFullLabel(node, chart, item) {
      var label = fullLabelOf(chart, item);
      var coordinate = item.axisX === null ? "" : String(item.axisX);
      var isTimeAxis = chart.getAttribute("data-chart") === "line" && chart.getAttribute("data-axis-type") === "time";
      node.textContent = "";
      if (!isTimeAxis || !coordinate || label.indexOf(coordinate) === -1) {
        node.textContent = label;
        return;
      }
      label.split(coordinate).forEach(function(part, index) {
        if (index) {
          var time = document.createElement("bdi");
          time.dir = "ltr";
          time.textContent = coordinate;
          node.appendChild(time);
        }
        node.appendChild(document.createTextNode(part));
      });
    }
    function syncChartContext(chart) {
      var heading = chart.querySelector(".m-chart__title");
      var title = chart.getAttribute("data-title");
      var contextTitle = !heading && title ? String(title).trim() : "";
      var entries = [
        ["data-unit", "الوحدة"],
        ["data-period", "الفترة"]
      ].map(function(entry) {
        return { key: entry[0], label: entry[1], value: String(chart.getAttribute(entry[0]) || "").trim() };
      }).filter(function(entry) {
        return entry.value !== "";
      });
      var context = chart.querySelector(".m-chart__context");
      if (!contextTitle && !entries.length) {
        if (context) context.remove();
        return;
      }
      if (!context) {
        context = document.createElement("div");
        context.className = "m-chart__context";
        if (heading) heading.insertAdjacentElement("afterend", context);
        else {
          var plot = chart.querySelector("[data-plot]");
          if (plot) chart.insertBefore(context, plot);
          else chart.insertBefore(context, chart.firstChild);
        }
      }
      context.textContent = "";
      if (contextTitle) {
        var titleNode = document.createElement("span");
        titleNode.className = "m-chart__context-title";
        titleNode.textContent = contextTitle;
        context.appendChild(titleNode);
      }
      entries.forEach(function(entry) {
        var item = document.createElement("span");
        item.className = "m-chart__context-item";
        var label = document.createElement("span");
        label.textContent = entry.label;
        var value = document.createElement("bdi");
        value.className = "m-chart__context-value";
        value.setAttribute("dir", "auto");
        value.textContent = entry.value;
        if (!isReadable(chart)) item.appendChild(label);
        if (isReadable(chart) && entry.key === "data-unit") value.setAttribute("data-reading-unit", entry.value);
        item.appendChild(value);
        context.appendChild(item);
      });
    }
    function measuredLabelStep(plot, items, cls, fontPx) {
      var probe = svgEl("svg", { width: 1, height: 1, "aria-hidden": "true" });
      probe.style.cssText = "position:absolute;visibility:hidden;overflow:visible;pointer-events:none";
      var text = svgEl("text", { class: cls });
      applyTextPx(text, fontPx);
      probe.appendChild(text);
      plot.appendChild(probe);
      var height = fontPx * 1.45;
      items.forEach(function(item) {
        text.textContent = item.label;
        height = Math.max(height, text.getBBox().height);
      });
      var gap = parseFloat(getComputedStyle(plot).getPropertyValue("--micro-space-1")) || 4;
      probe.remove();
      return Math.ceil(height + gap);
    }
    function fitValueReadings(chart, svg, items) {
      if (chart.getAttribute("data-value-layout") === "rows") return;
      var plot = chart.querySelector("[data-plot]");
      var bounds = svg.getBoundingClientRect();
      if (bounds.width <= 1) return;
      var labels = [].slice.call(svg.querySelectorAll(".m-chart__bar-value, .m-chart__point-value"));
      var boxes = labels.map(function(node) {
        return node.getBoundingClientRect();
      });
      var collision = boxes.some(function(a, i) {
        if (a.left < bounds.left + 1 || a.right > bounds.right - 1 || a.top < bounds.top - 1) return true;
        return boxes.some(function(b, j) {
          return j > i && a.left < b.right + 4 && a.right + 4 > b.left && a.top < b.bottom + 2 && a.bottom + 2 > b.top;
        });
      });
      chart.setAttribute("data-value-layout", collision ? "rows" : "plot");
      if (!collision) return;
      labels.forEach(function(node) {
        node.style.display = "none";
      });
      var rows = document.createElement("dl");
      rows.className = "m-chart__readings";
      rows.setAttribute("aria-label", "القراءات الكاملة للرسم");
      items.forEach(function(item) {
        var row = document.createElement("div");
        var label = document.createElement("dt");
        writeFullLabel(label, chart, item);
        var value = document.createElement("dd");
        var number = document.createElement("bdi");
        number.dir = "ltr";
        number.textContent = readingOf(item);
        value.appendChild(number);
        if (item.outlier) value.appendChild(document.createTextNode(" (قيمة شاذة)"));
        row.appendChild(label);
        row.appendChild(value);
        rows.appendChild(row);
      });
      plot.appendChild(rows);
    }
    var DESIGN_W = 320;
    var BAR_TEXT_PX = 13;
    var LINE_TEXT_PX = 13;
    function plotGeometryOf(plot) {
      var w = plot.getBoundingClientRect().width;
      return { refW: isFinite(w) && w > 1 ? w : DESIGN_W };
    }
    function applyTextPx(t, fontPx) {
      if (fontPx) t.style.fontSize = fontPx + "px";
      return t;
    }
    function splitWord(w, maxChars) {
      var parts = w.split(/([-/])/);
      var segs = [];
      for (var i = 0; i < parts.length; i += 2) {
        var seg = parts[i];
        if (parts[i + 1]) seg += parts[i + 1];
        if (seg) segs.push(seg);
      }
      var merged = [];
      segs.forEach(function(s) {
        var last = merged[merged.length - 1];
        if (last !== void 0 && (last + s).length <= maxChars) merged[merged.length - 1] = last + s;
        else merged.push(s);
      });
      return merged;
    }
    function wrapLabel(text, maxChars) {
      text = String(text || "");
      if (text.length <= maxChars) return [text];
      var tokens = [];
      text.split(" ").forEach(function(w) {
        if (w.length > maxChars && /[-/]/.test(w)) {
          tokens = tokens.concat(splitWord(w, maxChars));
        } else if (w) {
          tokens.push(w);
        }
      });
      if (!tokens.length) tokens = [text];
      var lines = [], cur = "";
      tokens.forEach(function(t) {
        var joined = cur ? cur + " " + t : t;
        if (joined.length <= maxChars || !cur) cur = joined;
        else {
          lines.push(cur);
          cur = t;
        }
      });
      if (cur) lines.push(cur);
      return lines;
    }
    var FIT_MAX_ROUNDS = 24;
    function measuredLenOf(t) {
      try {
        return t.getComputedTextLength();
      } catch (e) {
        return 0;
      }
    }
    function truncateToBudget(t, limit) {
      var s = String(t.textContent || "");
      var guard = 0;
      while (measuredLenOf(t) > limit && s.length > 1 && guard < FIT_MAX_ROUNDS) {
        guard += 1;
        var cut = s.length - guard;
        if (cut < 1) cut = 1;
        t.textContent = s.slice(0, cut) + "…";
      }
      return guard > 0;
    }
    function fitMeasuredLabels(chart, svg, items, labelCls, budget) {
      var plot = chart.querySelector("[data-plot]");
      if (!plot || plot.getBoundingClientRect().width <= 1) return;
      var W = svg.viewBox.baseVal.width;
      var entries = [];
      [].slice.call(svg.querySelectorAll("g")).forEach(function(g, i) {
        var full = items[i] ? items[i].labelFull || items[i].label || "" : "";
        [].slice.call(g.querySelectorAll("." + labelCls)).forEach(function(t) {
          entries.push({
            t,
            full,
            cut: false,
            cx0: parseFloat(t.getAttribute("x")) || 0,
            /* مركز العمود/النقطة قبل التثبيت */
            y: t.getAttribute("y")
            /* مفتاح الصف — الصفوف تتقاسم قيم y */
          });
        });
      });
      if (!entries.length) return;
      entries.forEach(function(e) {
        if (measuredLenOf(e.t) > budget) e.cut = truncateToBudget(e.t, budget);
      });
      function clampOf(e) {
        var half = measuredLenOf(e.t) / 2;
        var x = e.cx0;
        if (x - half < 8) x = 8 + half;
        if (x + half > W - 8) x = W - 8 - half;
        if (x - half < 8) x = 8 + half;
        e.t.setAttribute("x", x);
      }
      entries.forEach(clampOf);
      var rows = {};
      entries.forEach(function(e) {
        (rows[e.y] = rows[e.y] || []).push(e);
      });
      Object.keys(rows).forEach(function(yk) {
        var row = rows[yk];
        row.sort(function(a2, b2) {
          return a2.cx0 - b2.cx0;
        });
        var guard = 0, changed = true;
        while (changed && guard < FIT_MAX_ROUNDS) {
          guard += 1;
          changed = false;
          for (var i = 0; i < row.length - 1; i++) {
            var a = row[i], b = row[i + 1];
            var ax = parseFloat(a.t.getAttribute("x")) || 0;
            var bx = parseFloat(b.t.getAttribute("x")) || 0;
            var aHalf = measuredLenOf(a.t) / 2, bHalf = measuredLenOf(b.t) / 2;
            if (ax + aHalf >= bx - bHalf - 1) {
              var wide;
              if (bHalf > aHalf) wide = b;
              else if (aHalf > bHalf) wide = a;
              else {
                wide = Math.min(a.cx0, W - a.cx0) <= Math.min(b.cx0, W - b.cx0) ? a : b;
              }
              var before = wide.t.textContent;
              truncateToBudget(wide.t, measuredLenOf(wide.t) - 2);
              if (wide.t.textContent !== before) {
                wide.cut = true;
                clampOf(wide);
                changed = true;
              }
            }
          }
        }
      });
      entries.forEach(function(e) {
        if (!e.cut || !e.full) return;
        e.t.setAttribute("aria-label", e.full);
        var ti = svgEl("title", {});
        ti.textContent = e.full;
        e.t.appendChild(ti);
      });
      [].slice.call(svg.querySelectorAll("text")).forEach(function(t) {
        var len = measuredLenOf(t);
        if (!(len > 0)) return;
        var half = len / 2;
        var x = parseFloat(t.getAttribute("x")) || 0;
        if (x - half < 8 || x + half > W - 8) {
          if (x - half < 8) x = 8 + half;
          if (x + half > W - 8) x = W - 8 - half;
          if (x - half < 8) x = 8 + half;
          t.setAttribute("x", x);
        }
      });
    }
    function appendWrappedLabel(svg, g, text, cx, yBottom, maxChars, cls, lineStep, fontPx) {
      var step = lineStep || 13;
      var lines = wrapLabel(text, maxChars);
      lines.forEach(function(ln, k) {
        var t = svgEl("text", {
          class: cls,
          x: cx,
          y: yBottom - (lines.length - 1 - k) * step,
          "text-anchor": "middle"
        });
        applyTextPx(t, fontPx);
        t.textContent = ln;
        g.appendChild(t);
      });
      return lines.length;
    }
    function scaleStateOf(chart, items) {
      var raw = chart.getAttribute("data-max");
      var hasDeclared = raw !== null && String(raw).trim() !== "";
      var declared = hasDeclared ? parseNum(raw) : null;
      var largest = 0;
      items.forEach(function(it) {
        if (it.value !== null && it.value >= 0 && it.value > largest) largest = it.value;
      });
      if (!hasDeclared) return { kind: "auto", max: Math.max(largest, 1), declared: null, largest };
      if (declared === null || declared <= 0) {
        return { kind: "invalid", max: 0, declaredRaw: raw, largest };
      }
      if (largest > declared) {
        return { kind: "over", max: declared, declared, largest };
      }
      return { kind: "ok", max: declared, declared, largest };
    }
    function renderScaleRefusal(chart, items, plot, state, userLabel, devDetail) {
      var err = document.createElement("p");
      err.className = "m-chart__error";
      err.textContent = userLabel;
      plot.appendChild(err);
      chart.setAttribute("data-scale-state", state.kind);
      chart.setAttribute("data-scale-detail", devDetail);
      var list = document.createElement("ul");
      list.className = "m-legend";
      items.forEach(function(it) {
        var li = document.createElement("li");
        li.className = "m-legend__item";
        var sw = document.createElement("span");
        sw.className = "m-legend__swatch m-cat--" + it.series;
        li.appendChild(sw);
        var label = document.createElement("span");
        label.className = "m-legend__label";
        label.textContent = it.label;
        li.appendChild(label);
        var val = document.createElement("span");
        val.className = "m-legend__value";
        val.textContent = readingOf(it);
        li.appendChild(val);
        list.appendChild(li);
      });
      plot.appendChild(list);
    }
    function invalidMarker(svg, g, cx, base, value, why, fontPx) {
      var r = svgEl("rect", {
        class: "m-chart__bar-unknown",
        x: cx - 14,
        y: base - 10,
        width: 28,
        height: 10,
        rx: 4,
        stroke: "var(--micro-warning)"
      });
      g.appendChild(r);
      var t = svgEl("text", {
        class: "m-chart__bar-value",
        x: cx,
        y: base - 16,
        "text-anchor": "middle",
        fill: "var(--micro-warning)"
      });
      applyTextPx(t, fontPx);
      t.textContent = fmt(value) + " (" + why + ")";
      g.appendChild(t);
    }
    function renderBars(chart, items) {
      var plot = chart.querySelector("[data-plot]");
      var scale = scaleStateOf(chart, items);
      if (scale.kind === "invalid") {
        plot.innerHTML = "";
        renderScaleRefusal(
          chart,
          items,
          plot,
          scale,
          "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه.",
          'bars: data-max="' + scale.declaredRaw + '" غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض الرسم النسبي والقيم معروضة كاملة.'
        );
        return;
      }
      if (scale.kind === "over" && (chart.getAttribute("data-overscale") || "refuse") !== "rescale") {
        plot.innerHTML = "";
        renderScaleRefusal(
          chart,
          items,
          plot,
          scale,
          "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه.",
          "bars: أكبر قيمة (" + fmt(scale.largest) + ') تتجاوز data-max="' + fmt(scale.declared) + '" — الرسم النسبي كان سيخفي الفرق بين القيم؛ صحّح data-max أو استخدم data-overscale="rescale" لتوسيع المقياس بشكل معلن.'
        );
        return;
      }
      var max = scale.kind === "over" ? scale.largest : scale.max;
      var ts = plotGeometryOf(plot);
      var fontPx = BAR_TEXT_PX;
      var labelChars = Math.max(6, Math.floor(ts.refW / Math.max(items.length, 1) * 0.9 / 6.8));
      var maxLines = Math.max.apply(null, items.map(function(i) {
        return wrapLabel(i.label, labelChars).length;
      }).concat([1]));
      var BAR_LABEL_STEP = measuredLabelStep(plot, items, "m-chart__bar-label", fontPx);
      var extra = (maxLines - 1) * BAR_LABEL_STEP;
      var W = ts.refW, top = 30;
      var plotHeight = Math.min(128, Math.max(96, W * 0.32));
      var base = top + plotHeight, H = base + BAR_LABEL_STEP + 12 + extra;
      var colW = W / Math.max(items.length, 1);
      var ariaLabel = chart.getAttribute("data-title") || "رسم أعمدة";
      if (scale.kind === "over") {
        ariaLabel += "؛ مقياس موسّع إلى " + fmt(max) + " بدل المعلن " + fmt(scale.declared);
      }
      var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": ariaLabel });
      for (var grid = 1; grid < 3; grid++) {
        var gy = base - plotHeight * grid / 3;
        svg.appendChild(svgEl("line", { class: "m-chart__gridline", x1: 0, y1: gy, x2: W, y2: gy }));
      }
      svg.appendChild(svgEl("line", { class: "m-chart__baseline", x1: 0, y1: base, x2: W, y2: base }));
      items.forEach(function(it, i) {
        var cx = colW * i + colW / 2;
        var g = svgEl("g", { class: "m-cat--" + it.series });
        if (it.value === null) {
          g.appendChild(svgEl("rect", { class: "m-chart__bar-unknown", x: cx - 14, y: base - 10, width: 28, height: 10, rx: 4 }));
          var u = svgEl("text", { class: "m-chart__bar-value", x: cx, y: base - 16, "text-anchor": "middle" });
          applyTextPx(u, fontPx);
          u.textContent = it.invalid ? "غير صالح" : "—";
          g.appendChild(u);
        } else if (it.value < 0) {
          invalidMarker(svg, g, cx, base, it.value, "سالب غير مرسوم", fontPx);
        } else {
          var h = Math.min(it.value, max) / max * (base - top);
          g.appendChild(svgEl("rect", {
            class: "m-chart__bar",
            x: cx - Math.min(colW * 0.21, 20),
            y: base - h,
            width: Math.min(colW * 0.42, 40),
            height: h,
            rx: Math.min(4, h / 2),
            fill: it.value === 0 ? "none" : "var(--micro-data-" + it.series + ")",
            stroke: it.value === 0 ? "var(--micro-text-hint)" : "none",
            "stroke-width": it.value === 0 ? 1 : 0
          }));
          var val = svgEl("text", { class: "m-chart__bar-value", x: cx, y: base - h - 6, "text-anchor": "middle" });
          applyTextPx(val, fontPx);
          val.textContent = readingOf(it);
          g.appendChild(val);
          if (it.outlier) {
            var o = svgEl("text", { x: cx, y: base - h - 20, "text-anchor": "middle", class: "m-chart__bar-value", fill: "var(--micro-warning)" });
            applyTextPx(o, fontPx);
            o.textContent = "قيمة شاذة";
            g.appendChild(o);
          }
        }
        appendWrappedLabel(svg, g, it.label, cx, H - 12, labelChars, "m-chart__bar-label", BAR_LABEL_STEP, fontPx);
        svg.appendChild(g);
      });
      plot.innerHTML = "";
      plot.appendChild(svg);
      fitMeasuredLabels(chart, svg, items, "m-chart__bar-label", colW * 0.92);
      fitValueReadings(chart, svg, items);
      if (scale.kind === "over") {
        var note = document.createElement("p");
        note.className = "m-chart__scale-note";
        note.textContent = "نطاق العرض: " + fmt(max) + " بدل " + fmt(scale.declared) + ". القيم الأصلية دون تغيير.";
        plot.appendChild(note);
        chart.setAttribute("data-scale-state", "over-rescaled");
        chart.setAttribute("data-scale-detail", 'bars: data-overscale="rescale" — رسم بمقياس موسّع من ' + fmt(scale.declared) + " إلى " + fmt(max) + "؛ القيم الأصلية دون تغيير.");
      }
    }
    function renderSigned(chart, items, kind) {
      var plot = chart.querySelector("[data-plot]");
      plot.textContent = "";
      var known = items.filter(function(item) {
        return item.value !== null;
      });
      if (known.length === 0) {
        var emptySigned = document.createElement("p");
        emptySigned.className = "m-chart__empty";
        emptySigned.setAttribute("role", "status");
        emptySigned.textContent = "لا توجد بيانات لعرضها.";
        plot.appendChild(emptySigned);
        appendFullReadingRows(chart, plot, items, "");
        chart.setAttribute("data-scale-state", "empty");
        return;
      }
      var low = Math.min.apply(null, known.map(function(item) {
        return item.value;
      }).concat([0]));
      var high = Math.max.apply(null, known.map(function(item) {
        return item.value;
      }).concat([0]));
      var minRaw = chart.getAttribute("data-min"), maxRaw = chart.getAttribute("data-max");
      var minDeclared = minRaw !== null && minRaw.trim() !== "";
      var maxDeclared = maxRaw !== null && maxRaw.trim() !== "";
      var min = minDeclared ? parseNum(minRaw) : low;
      var max = maxDeclared ? parseNum(maxRaw) : high;
      var invalid = min === null || max === null || min > 0 || max < 0 || min > max || (minDeclared || maxDeclared) && min === max;
      var exceeds = !invalid && (low < min || high > max);
      if (invalid || exceeds && chart.getAttribute("data-overscale") !== "rescale") {
        renderScaleRefusal(
          chart,
          items,
          plot,
          { kind: invalid ? "invalid" : "over" },
          "تعذّر عرض الرسم بهذا النطاق. القراءات متاحة كاملة.",
          "signed: bounds must include zero and every known value; no clipping or absolute-value conversion."
        );
        return;
      }
      if (exceeds) {
        min = Math.min(low, min);
        max = Math.max(high, max);
      }
      var magnitude = Math.max(Math.abs(min), Math.abs(max), Number.MIN_VALUE);
      var a = min / magnitude, b = max / magnitude;
      if (a === b) {
        a = 0;
        b = 1;
      }
      var width = plotGeometryOf(plot).refW;
      var top = 24, height = Math.min(160, Math.max(112, width * 0.38)), bottom = top + height;
      var svg = svgEl("svg", {
        viewBox: "0 0 " + width + " " + (bottom + 28),
        role: "img",
        "aria-label": (chart.getAttribute("data-title") || "رسم موقّع") + "؛ محور صفر مشترك، والقراءات الكاملة أدناه"
      });
      function y(value) {
        return top + (b - value / magnitude) / (b - a) * height;
      }
      var zero = y(0);
      svg.appendChild(svgEl("line", {
        class: "m-chart__baseline",
        "data-zero-axis": "",
        x1: 16,
        x2: width - 16,
        y1: zero,
        y2: zero
      }));
      var zeroLabel = svgEl("text", { x: 8, y: Math.max(14, zero - 6), class: "m-chart__bar-value" });
      applyTextPx(zeroLabel, BAR_TEXT_PX);
      zeroLabel.textContent = "0";
      svg.appendChild(zeroLabel);
      var time = kind === "line" && chart.getAttribute("data-axis-type") === "time";
      var axisType = chart.getAttribute("data-axis-type") || "category";
      var times = time ? items.map(function(item) {
        return axisTimeOf(item.axisX);
      }) : null;
      if (kind === "line" && (axisType !== "time" && axisType !== "category" || times && times.some(function(value) {
        return value === null;
      }))) {
        chart.setAttribute("data-axis-state", time ? "invalid-time" : "invalid-type");
        var error = document.createElement("p");
        error.className = "m-chart__error";
        error.textContent = "تعذّر عرض المحور دون إعداد وأوقات صريحة صالحة. القراءات متاحة كاملة.";
        plot.appendChild(error);
        appendFullReadingRows(chart, plot, items, "");
        return;
      }
      var earliest = times ? Math.min.apply(null, times) : 0;
      var latest = times ? Math.max.apply(null, times) : 0;
      var rtl = (chart.getAttribute("data-axis-dir") || "rtl") !== "ltr";
      function x(index) {
        var fraction = times ? latest === earliest ? 0.5 : (times[index] - earliest) / (latest - earliest) : (index + 0.5) / Math.max(items.length, 1);
        return 24 + (rtl ? 1 - fraction : fraction) * (width - 48);
      }
      var segment = [], indexLabels = [];
      function flush() {
        if (segment.length > 1) svg.appendChild(svgEl("polyline", {
          class: "m-chart__line",
          points: segment.join(" "),
          fill: "none",
          stroke: "var(--micro-data-line)",
          "stroke-width": 2,
          "vector-effect": "non-scaling-stroke"
        }));
        segment = [];
      }
      items.forEach(function(item, index) {
        if (item.value === null) {
          flush();
          return;
        }
        var px = x(index), py = y(item.value), mark;
        if (kind === "bars") {
          var barWidth = Math.min(32, (width - 48) / Math.max(items.length, 1) * 0.55);
          mark = svgEl("rect", {
            class: "m-chart__bar",
            x: px - barWidth / 2,
            y: Math.min(py, zero),
            width: barWidth,
            height: Math.abs(py - zero),
            rx: 2,
            fill: "var(--micro-data-" + item.series + ")"
          });
        } else {
          segment.push(px + "," + py);
          mark = svgEl("circle", {
            class: "m-chart__point",
            cx: px,
            cy: py,
            r: 4,
            fill: "var(--micro-data-a)"
          });
        }
        mark.setAttribute("data-source-index", String(index));
        var title = svgEl("title", {});
        title.textContent = fullLabelOf(chart, item) + ": " + readingOf(item);
        mark.appendChild(title);
        svg.appendChild(mark);
        var label = svgEl("text", {
          x: px,
          y: bottom + 20,
          "text-anchor": "middle",
          class: "m-chart__x-label"
        });
        applyTextPx(label, LINE_TEXT_PX);
        label.textContent = String(index + 1);
        svg.appendChild(label);
        indexLabels.push(label);
      });
      flush();
      plot.appendChild(svg);
      var accepted = [], sampled = false;
      var priority = indexLabels.length > 1 ? [indexLabels[0], indexLabels[indexLabels.length - 1]].concat(indexLabels.slice(1, -1)) : indexLabels;
      priority.forEach(function(label) {
        var box = label.getBoundingClientRect();
        var collision = accepted.some(function(other) {
          return box.left < other.right + 4 && box.right + 4 > other.left;
        });
        if (collision) {
          label.style.display = "none";
          sampled = true;
        } else accepted.push(box);
      });
      chart.setAttribute("data-index-label-layout", sampled ? "sampled" : "all");
      appendFullReadingRows(chart, plot, items, "");
      chart.setAttribute("data-value-layout", "rows");
      var rows = plot.querySelector(".m-chart__readings");
      if (rows) [].slice.call(rows.querySelectorAll("dt")).forEach(function(label, index) {
        label.insertBefore(document.createTextNode(index + 1 + ". "), label.firstChild);
      });
      chart.setAttribute("data-scale-state", exceeds ? "over-rescaled" : known.length ? "signed" : "empty");
      chart.setAttribute("data-scale-detail", "signed: min=" + min + ";max=" + max + ";zero=" + zero);
      if (exceeds) {
        var note = document.createElement("p");
        note.className = "m-chart__scale-note";
        note.textContent = "وُسّع النطاق ليشمل جميع القيم؛ القراءات الأصلية دون تغيير.";
        plot.appendChild(note);
      }
    }
    function renderLine(chart, items) {
      var plot = chart.querySelector("[data-plot]");
      var rtl = (chart.getAttribute("data-axis-dir") || "rtl") !== "ltr";
      var axisType = chart.getAttribute("data-axis-type") || "category";
      var timeValues = null;
      if (axisType === "time") {
        timeValues = items.map(function(item) {
          return axisTimeOf(item.axisX);
        });
        if (timeValues.some(function(value) {
          return value === null;
        })) {
          plot.innerHTML = "";
          var axisError = document.createElement("p");
          axisError.className = "m-chart__error";
          axisError.textContent = "تعذر عرض المحور الزمني دون أوقات صريحة لكل نقطة. القراءات متاحة أدناه.";
          plot.appendChild(axisError);
          appendFullReadingRows(chart, plot, items, "تعذر عرض المحور الزمني دون أوقات صريحة لكل نقطة.");
          chart.setAttribute("data-axis-state", "invalid-time");
          return;
        }
      } else if (axisType !== "category") {
        plot.innerHTML = "";
        var typeError = document.createElement("p");
        typeError.className = "m-chart__error";
        typeError.textContent = "نوع المحور غير مدعوم. القراءات متاحة أدناه.";
        plot.appendChild(typeError);
        appendFullReadingRows(chart, plot, items, "نوع المحور غير مدعوم.");
        chart.setAttribute("data-axis-state", "invalid-type");
        return;
      }
      var scale = scaleStateOf(chart, items);
      if (scale.kind === "invalid") {
        plot.innerHTML = "";
        renderScaleRefusal(
          chart,
          items,
          plot,
          scale,
          "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه.",
          'line: data-max="' + scale.declaredRaw + '" غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض الرسم النسبي والقيم معروضة كاملة.'
        );
        return;
      }
      if (scale.kind === "over" && (chart.getAttribute("data-overscale") || "refuse") !== "rescale") {
        plot.innerHTML = "";
        renderScaleRefusal(
          chart,
          items,
          plot,
          scale,
          "تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه.",
          "line: أكبر قيمة (" + fmt(scale.largest) + ') تتجاوز data-max="' + fmt(scale.declared) + '" — الرسم كان سيخرج نقطة خارج مجال الرسم؛ صحّح data-max أو استخدم data-overscale="rescale" لتوسيع المقياس بشكل معلن.'
        );
        return;
      }
      var max = scale.kind === "over" ? scale.largest : scale.max;
      var ts = plotGeometryOf(plot);
      var fontPx = LINE_TEXT_PX;
      var n = Math.max(items.length, 2);
      var labelChars = Math.max(5, Math.floor((ts.refW - 48) / n / 6.8));
      var maxLines = Math.max.apply(null, items.map(function(i) {
        return wrapLabel(i.label, labelChars).length;
      }).concat([1]));
      var X_LABEL_STEP = measuredLabelStep(plot, items, "m-chart__x-label", fontPx);
      var extra = (maxLines - 1) * X_LABEL_STEP;
      var W = ts.refW, top = 30;
      var plotHeight = Math.min(144, Math.max(104, W * 0.34));
      var base = top + plotHeight, H = base + X_LABEL_STEP + 12 + extra;
      var timeMin = timeValues ? Math.min.apply(null, timeValues) : 0;
      var timeMax = timeValues ? Math.max.apply(null, timeValues) : 0;
      function xAt(i) {
        var t = timeValues ? timeMax === timeMin ? 0.5 : (timeValues[i] - timeMin) / (timeMax - timeMin) : i / (n - 1);
        return rtl ? W - 24 - t * (W - 48) : 24 + t * (W - 48);
      }
      function yAt(v) {
        return v === null ? null : base - v / max * (base - top);
      }
      var ariaLabel = chart.getAttribute("data-title") || "رسم خط";
      if (scale.kind === "over") {
        ariaLabel += "؛ مقياس موسّع إلى " + fmt(max) + " بدل المعلن " + fmt(scale.declared);
      }
      var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": ariaLabel });
      for (var grid = 1; grid < 3; grid++) {
        var gy = base - plotHeight * grid / 3;
        svg.appendChild(svgEl("line", { class: "m-chart__gridline", x1: 12, y1: gy, x2: W - 12, y2: gy }));
      }
      svg.appendChild(svgEl("line", { class: "m-chart__axis", x1: 12, y1: base, x2: W - 12, y2: base }));
      var seg = [];
      var segments = [];
      items.forEach(function(it, i) {
        if (it.value === null || it.value < 0) {
          if (seg.length > 1) segments.push(seg);
          seg = [];
        } else {
          seg.push([xAt(i), yAt(it.value)]);
        }
      });
      if (seg.length > 1) segments.push(seg);
      segments.forEach(function(pts) {
        svg.appendChild(svgEl("polyline", { class: "m-chart__line", points: pts.map(function(p) {
          return p.join(",");
        }).join(" ") }));
      });
      items.forEach(function(it, i) {
        var x = xAt(i), y = yAt(it.value);
        var g = svgEl("g", { class: "m-cat--" + it.series, "data-point-index": i });
        if (y === null) {
          var u = svgEl("text", { class: "m-chart__point-value", x, y: base - 6, "text-anchor": "middle", fill: "var(--micro-text-hint)" });
          applyTextPx(u, fontPx);
          u.textContent = "—";
          g.appendChild(u);
        } else if (it.value < 0) {
          invalidMarker(svg, g, x, base, it.value, "سالب غير مرسوم", fontPx);
        } else {
          g.appendChild(svgEl("circle", { class: "m-chart__dot", cx: x, cy: y, r: 4 }));
          var val = svgEl("text", { class: "m-chart__point-value", x, y: y - 10, "text-anchor": "middle" });
          applyTextPx(val, fontPx);
          val.textContent = readingOf(it);
          g.appendChild(val);
        }
        appendWrappedLabel(svg, g, it.label, x, H - 8, labelChars, "m-chart__x-label", X_LABEL_STEP, fontPx);
        svg.appendChild(g);
      });
      plot.innerHTML = "";
      plot.appendChild(svg);
      sampleLineLabels(chart, svg, items, timeValues);
      fitValueReadings(chart, svg, items);
      if (scale.kind === "over") {
        var note = document.createElement("p");
        note.className = "m-chart__scale-note";
        note.textContent = "نطاق العرض: " + fmt(max) + " بدل " + fmt(scale.declared) + ". القيم الأصلية دون تغيير.";
        plot.appendChild(note);
        chart.setAttribute("data-scale-state", "over-rescaled");
        chart.setAttribute("data-scale-detail", 'line: data-overscale="rescale" — رسم بمقياس موسّع من ' + fmt(scale.declared) + " إلى " + fmt(max) + "؛ القيم الأصلية دون تغيير.");
      }
    }
    function axisTimeOf(raw) {
      if (raw === null || raw === void 0 || String(raw).trim() === "") return null;
      var s = String(raw).trim();
      var n;
      if (NUM_RE.test(s)) {
        n = Number(s);
        return isFinite(n) && Math.abs(n) <= 864e13 ? n : null;
      }
      var match = /^(\d{4})-(\d{2})-(\d{2})(?:[Tt](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2}))?$/.exec(s);
      if (!match) return null;
      var year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
      var leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      var monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (month < 1 || month > 12 || day < 1 || day > monthDays[month - 1]) return null;
      if (match[4] !== void 0) {
        if (Number(match[4]) > 23 || Number(match[5]) > 59 || Number(match[6] || 0) > 59) return null;
        if (match[8] !== "Z") {
          var offset = match[8].slice(1).split(":");
          if (Number(offset[0]) > 23 || Number(offset[1]) > 59) return null;
        }
      }
      n = Date.parse(s);
      return isFinite(n) && Math.abs(n) <= 864e13 ? n : null;
    }
    function appendFullReadingRows(chart, plot, items, ariaLabel) {
      var rows = document.createElement("dl");
      rows.className = "m-chart__readings";
      rows.setAttribute("aria-label", ariaLabel || "القراءات الكاملة للرسم");
      items.forEach(function(item) {
        var row = document.createElement("div");
        var label = document.createElement("dt");
        writeFullLabel(label, chart, item);
        var value = document.createElement("dd");
        var number = document.createElement("bdi");
        number.dir = "ltr";
        number.textContent = readingOf(item);
        value.appendChild(number);
        if (item.outlier) value.appendChild(document.createTextNode(" (قيمة شاذة)"));
        row.appendChild(label);
        row.appendChild(value);
        rows.appendChild(row);
      });
      plot.appendChild(rows);
      return rows;
    }
    function sampleLineLabels(chart, svg, items, timeValues) {
      var W = svg.viewBox.baseVal.width;
      var candidates = [];
      var timeMin = timeValues ? Math.min.apply(null, timeValues) : null;
      var timeMax = timeValues ? Math.max.apply(null, timeValues) : null;
      [].slice.call(svg.querySelectorAll("g[data-point-index]")).forEach(function(g) {
        var index = Number(g.getAttribute("data-point-index"));
        var endpoint = index === 0 || index === items.length - 1 || timeValues && (timeValues[index] === timeMin || timeValues[index] === timeMax);
        var labels = [].slice.call(g.querySelectorAll(".m-chart__x-label"));
        if (endpoint && labels.length) {
          var labelLeft = Infinity, labelRight = -Infinity;
          labels.forEach(function(label) {
            var length = measuredLenOf(label);
            var cx = parseFloat(label.getAttribute("x")) || 0;
            labelLeft = Math.min(labelLeft, cx - length / 2 - 1);
            labelRight = Math.max(labelRight, cx + length / 2 + 1);
          });
          var shift = 0;
          if (labelLeft < 8 && labelRight <= W - 8) {
            var inwardFromLeft = 8 - labelLeft;
            if (labelRight + inwardFromLeft <= W - 8) shift = inwardFromLeft;
          } else if (labelRight > W - 8 && labelLeft >= 8) {
            var inwardFromRight = W - 8 - labelRight;
            if (labelLeft + inwardFromRight >= 8) shift = inwardFromRight;
          }
          if (shift) {
            labels.forEach(function(label) {
              var x = parseFloat(label.getAttribute("x")) || 0;
              label.setAttribute("x", x + shift);
            });
          }
        }
        var boxes = labels.map(function(label) {
          var length = measuredLenOf(label);
          var bbox;
          try {
            bbox = label.getBBox();
          } catch (e) {
            bbox = { y: 0, height: LINE_TEXT_PX * 1.45 };
          }
          var cx = parseFloat(label.getAttribute("x")) || 0;
          return {
            left: cx - length / 2 - 1,
            right: cx + length / 2 + 1,
            top: bbox.y - 1,
            bottom: bbox.y + bbox.height + 1
          };
        });
        var splitFragment = labels.some(function(label) {
          return String(label.textContent || "").trim().length === 1 && String(items[index].label || "").trim().length > 1;
        });
        candidates.push({
          index,
          labels,
          boxes,
          protected: items[index].axisBoundary || endpoint,
          priority: items[index].axisBoundary ? 0 : endpoint ? 1 : 2,
          splitFragment
        });
      });
      candidates.sort(function(a, b) {
        return a.priority - b.priority || a.index - b.index;
      });
      function intersects(a, b) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }
      var selected = [], protectedConflict = false;
      candidates.forEach(function(candidate) {
        var canFit = !candidate.splitFragment && candidate.boxes.every(function(box) {
          return box.left >= 8 && box.right <= W - 8 && !selected.some(function(prior) {
            return prior.boxes.some(function(priorBox) {
              return intersects(box, priorBox);
            });
          });
        });
        if (canFit) selected.push(candidate);
        else if (candidate.protected) protectedConflict = true;
      });
      if (protectedConflict) {
        candidates.forEach(function(candidate) {
          candidate.labels.forEach(function(label) {
            label.style.display = "none";
          });
        });
        [].slice.call(svg.querySelectorAll(".m-chart__point-value")).forEach(function(label) {
          label.style.display = "none";
        });
        chart.setAttribute("data-value-layout", "rows");
        appendFullReadingRows(
          chart,
          chart.querySelector("[data-plot]"),
          items,
          "التسميات والقراءات الكاملة للرسم"
        );
        return;
      }
      var selectedSet = new Set(selected);
      candidates.forEach(function(candidate) {
        if (selectedSet.has(candidate)) return;
        candidate.labels.forEach(function(label) {
          label.style.display = "none";
        });
      });
    }
    function donutRefusal(chart, plot, stateKind, devDetail) {
      var err = document.createElement("p");
      err.className = "m-chart__error";
      err.textContent = "تعذر رسم التوزيع كنسب. القيم معروضة في المفتاح دون نسب.";
      plot.appendChild(err);
      chart.setAttribute("data-scale-state", stateKind);
      chart.setAttribute("data-scale-detail", devDetail);
    }
    function fitDonutReading(plot, svg) {
      var value = svg.querySelector(".m-donut__center");
      var label = svg.querySelector(".m-donut__center-label");
      if (!value || !label || plot.getBoundingClientRect().width <= 1) return;
      var vb = value.getBBox(), lb = label.getBBox();
      function fits(box) {
        var dx = Math.max(Math.abs(box.x - 74), Math.abs(box.x + box.width - 74));
        var dy = Math.max(Math.abs(box.y - 74), Math.abs(box.y + box.height - 74));
        return dx * dx + dy * dy <= 48 * 48;
      }
      if (fits(vb) && fits(lb) && vb.y + vb.height <= lb.y + 2) return;
      var reading = document.createElement("div");
      reading.className = "m-donut__reading";
      var number = document.createElement("span");
      number.className = "m-donut__number";
      number.textContent = value.textContent;
      var caption = document.createElement("span");
      caption.className = "m-donut__reading-label";
      caption.textContent = label.textContent;
      reading.appendChild(number);
      reading.appendChild(caption);
      value.remove();
      label.remove();
      plot.appendChild(reading);
    }
    function renderDonut(chart, items) {
      var plot = chart.querySelector("[data-plot]");
      var declaredRaw = chart.getAttribute("data-total");
      var hasDeclaredAttr = declaredRaw !== null && String(declaredRaw).trim() !== "";
      var declared = hasDeclaredAttr ? parseNum(declaredRaw) : null;
      var declaredInvalid = hasDeclaredAttr && declared === null;
      var declaredNegative = hasDeclaredAttr && declared !== null && declared < 0;
      var declaredZero = hasDeclaredAttr && declared === 0;
      var hasDeclared = declared !== null && declared > 0;
      var total = hasDeclared ? declared : 0;
      var known = items.filter(function(i) {
        return i.value !== null && i.value >= 0;
      });
      var invalid = items.filter(function(i) {
        return i.value !== null && i.value < 0;
      });
      var malformed = items.some(function(i) {
        return i.invalid;
      });
      var missing = items.filter(function(i) {
        return i.value === null;
      });
      var sum = known.reduce(function(a, i) {
        return a + i.value;
      }, 0);
      var R = 58, C = 2 * Math.PI * R, cx = 74, cy = 74;
      var svg = svgEl("svg", { class: "m-donut__svg", viewBox: "0 0 148 148", role: "img", "aria-label": chart.getAttribute("data-title") || "توزيع" });
      plot.innerHTML = "";
      var sumExceeds = hasDeclared && sum > total;
      var hasInvalid = invalid.length > 0;
      var noData = known.length === 0 && invalid.length === 0;
      var zeroCase = known.length > 0 && sum === 0 && (missing.length === 0 || declaredZero);
      var unknownTotal = known.length > 0 && sum === 0 && missing.length > 0 && !declaredZero;
      function emptyRing(centerText, labelText) {
        svg.appendChild(svgEl("circle", {
          cx,
          cy,
          r: R,
          fill: "none",
          stroke: "var(--micro-border-divider)",
          "stroke-width": 16
        }));
        var c = svgEl("text", { class: "m-donut__center", x: cx, y: cy + 2, "text-anchor": "middle" });
        c.textContent = centerText;
        svg.appendChild(c);
        var l = svgEl("text", { class: "m-donut__center-label", x: cx, y: cy + 20, "text-anchor": "middle" });
        l.textContent = labelText;
        svg.appendChild(l);
        plot.appendChild(svg);
        fitDonutReading(plot, svg);
      }
      if (declaredInvalid) {
        donutRefusal(
          chart,
          plot,
          "invalid",
          'donut: data-total="' + declaredRaw + '" غير رقمي/غير محدود — مقام غير قابل للاستخدام؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.'
        );
      } else if (!isFinite(sum)) {
        donutRefusal(
          chart,
          plot,
          "invalid",
          "donut: sum exceeds the finite Number range; proportions refused and original readings retained."
        );
      } else if (malformed) {
        donutRefusal(
          chart,
          plot,
          "invalid",
          "donut: invalid category value; proportions refused rather than treating malformed input as a missing or zero quantity."
        );
      } else if (hasInvalid || sumExceeds) {
        donutRefusal(
          chart,
          plot,
          hasInvalid ? "invalid" : "over",
          hasInvalid ? "donut: قيم سالبة — التوزيع نسب من قيم غير سالبة فقط؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب." : "donut: مجموع الفئات (" + fmt(sum) + ') يتجاوز المقام المعلن data-total="' + fmt(total) + '" — النسب كانت ستتجاوز المقام؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.'
        );
      } else if (declaredNegative) {
        donutRefusal(
          chart,
          plot,
          "invalid",
          'donut: data-total="' + declaredRaw + '" سالب — المقام السالب غير صالح للنسب (C2)؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.'
        );
      } else if (declaredZero && sum > 0) {
        donutRefusal(
          chart,
          plot,
          "conflict",
          'donut: data-total="0" بينما مجموع الفئات ' + fmt(sum) + " — تعارض بيانات: لا نسب من مقام صفر ولا استبدال تلقائي للمقام (C2)؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب."
        );
      } else if (noData) {
        var emptyDonut = document.createElement("p");
        emptyDonut.className = "m-chart__empty";
        emptyDonut.setAttribute("role", "status");
        emptyDonut.textContent = "لا توجد بيانات لعرضها.";
        plot.appendChild(emptyDonut);
        chart.setAttribute("data-scale-state", "empty");
      } else if (unknownTotal) {
        emptyRing("—", "الإجمالي غير معلوم");
      } else if (zeroCase) {
        emptyRing(hasDeclared ? fmt(total) : "0", chart.getAttribute("data-total-label") || "الإجمالي");
      } else {
        var denom = hasDeclared ? total : sum;
        var offset = 0;
        known.forEach(function(it) {
          var frac = it.value / denom;
          var len = frac * C;
          var segC = svgEl("circle", {
            cx,
            cy,
            r: R,
            fill: "none",
            stroke: "var(--micro-data-" + it.series + ")",
            "stroke-width": 16,
            "stroke-dasharray": len + " " + (C - len),
            "stroke-dashoffset": -offset,
            transform: "rotate(-90 " + cx + " " + cy + ")"
          });
          svg.appendChild(segC);
          offset += len;
        });
        [R - 8, R + 8].forEach(function(radius) {
          svg.appendChild(svgEl("circle", {
            cx,
            cy,
            r: radius,
            fill: "none",
            "aria-hidden": "true",
            stroke: "var(--micro-data-boundary)",
            "stroke-width": 1,
            "vector-effect": "non-scaling-stroke"
          }));
        });
        if (known.length > 1) {
          var bOff = 0;
          known.forEach(function(it, k) {
            if (k === 0) return;
            bOff += it.value / denom * C;
            var angle = (-90 + bOff / C * 360) * Math.PI / 180;
            svg.appendChild(svgEl("line", {
              x1: cx + (R - 8) * Math.cos(angle),
              y1: cy + (R - 8) * Math.sin(angle),
              x2: cx + (R + 8) * Math.cos(angle),
              y2: cy + (R + 8) * Math.sin(angle),
              "aria-hidden": "true",
              stroke: "var(--micro-data-boundary)",
              "stroke-width": 1,
              "vector-effect": "non-scaling-stroke"
            }));
          });
        }
        var center = svgEl("text", { class: "m-donut__center", x: cx, y: cy + 2, "text-anchor": "middle" });
        center.textContent = fmt(denom);
        svg.appendChild(center);
        var clab = svgEl("text", { class: "m-donut__center-label", x: cx, y: cy + 20, "text-anchor": "middle" });
        clab.textContent = chart.getAttribute("data-total-label") || (missing.length && !hasDeclared ? "مجموع المعلوم" : "الإجمالي");
        svg.appendChild(clab);
        plot.appendChild(svg);
        fitDonutReading(plot, svg);
      }
      var noPercent = malformed || declaredInvalid || declaredNegative || declaredZero && sum > 0 || sumExceeds || hasInvalid || noData || unknownTotal || zeroCase;
      var legend = document.createElement("ul");
      legend.className = "m-legend";
      known.forEach(function(it) {
        var li = document.createElement("li");
        li.className = "m-legend__item m-cat--" + it.series;
        var sw = document.createElement("span");
        sw.className = "m-legend__swatch";
        li.appendChild(sw);
        var label = document.createElement("span");
        label.className = "m-legend__label";
        label.textContent = it.label;
        li.appendChild(label);
        var val = document.createElement("span");
        val.className = "m-legend__value";
        val.textContent = fmt(it.value) + (noPercent ? "" : " (" + Math.round(it.value / (hasDeclared ? total : sum) * 100) + "%)");
        li.appendChild(val);
        legend.appendChild(li);
      });
      missing.concat(invalid).forEach(function(it) {
        var li = document.createElement("li");
        li.className = "m-legend__item";
        var label = document.createElement("span");
        label.className = "m-legend__label";
        label.textContent = it.label;
        li.appendChild(label);
        var val = document.createElement("span");
        val.className = "m-legend__value";
        val.textContent = it.value === null ? it.invalid ? String(it.rawValue) + " (قيمة غير صالحة)" : "(غير متاح)" : fmt(it.value) + " (غير صالح للنسب)";
        li.appendChild(val);
        legend.appendChild(li);
      });
      if (items.length) plot.appendChild(legend);
      readableLegend(chart, items, legend, !noPercent && isFinite(hasDeclared ? total : sum) ? hasDeclared ? total : sum : null);
    }
    var chartUid = 0;
    function ensureId(el, prefix) {
      if (!el.id) el.id = prefix + "-" + ++chartUid;
      return el.id;
    }
    function linkChartName(chart) {
      var svg = chart.querySelector('[data-plot] > svg[role="img"]');
      if (!svg) return;
      var titleEl = chart.querySelector(".m-chart__title");
      if (titleEl && String(titleEl.textContent || "").trim()) {
        svg.setAttribute("aria-labelledby", ensureId(titleEl, "micro-chart-title"));
        svg.removeAttribute("aria-label");
      }
      var summary = chart.querySelector("[data-summary]");
      if (summary) svg.setAttribute("aria-describedby", ensureId(summary, "micro-chart-summary"));
    }
    function valueStateText(it) {
      if (it.value === null) {
        if (it.invalid) {
          var raw = it.rawValue !== null && String(it.rawValue).trim() !== "" ? String(it.rawValue) + " " : "";
          return raw + "(قيمة غير صالحة)";
        }
        return "(غير متاح)";
      }
      var base = it.rawValue === null ? fmt(it.value) : String(it.rawValue);
      if (it.value < 0 && !it.signed) return base + " (سالب غير مرسوم)";
      return it.outlier ? base + " (قيمة شاذة)" : base;
    }
    function syncDatasetTable(chart, items) {
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
          table.id = "micro-chart-dataset-" + ++chartUid;
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
      var titleEl = chart.querySelector(".m-chart__title");
      var captionParts = [String(titleEl && titleEl.textContent || chart.getAttribute("data-title") || "").trim()];
      var unitTxt = String(chart.getAttribute("data-unit") || "").trim();
      var periodTxt = String(chart.getAttribute("data-period") || "").trim();
      if (unitTxt) captionParts.push("الوحدة: " + unitTxt);
      if (periodTxt) captionParts.push("الفترة: " + periodTxt);
      if (chart.getAttribute("data-chart") === "donut") {
        var totalRaw = chart.getAttribute("data-total");
        if (totalRaw !== null && String(totalRaw).trim() !== "") {
          captionParts.push((chart.getAttribute("data-total-label") || "الإجمالي") + ": " + String(totalRaw).trim());
        }
      }
      caption.textContent = captionParts.filter(function(p) {
        return p !== "";
      }).join("، ");
      table.appendChild(caption);
      var thead = document.createElement("thead");
      var headRow = document.createElement("tr");
      var hasTimeAxis = chart.getAttribute("data-chart") === "line" && chart.getAttribute("data-axis-type") === "time";
      (hasTimeAxis ? ["الفئة", "وقت النقطة", "القيمة"] : ["الفئة", "القيمة"]).forEach(function(h) {
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
        writeFullLabel(th, chart, it);
        tr.appendChild(th);
        if (hasTimeAxis) {
          var time = document.createElement("td");
          if (it.axisX === null || it.axisX === "") time.textContent = "(غير متاح)";
          else {
            var coordinate = document.createElement("bdi");
            coordinate.dir = "ltr";
            coordinate.textContent = it.axisX;
            time.appendChild(coordinate);
          }
          tr.appendChild(time);
        }
        var td = document.createElement("td");
        var fullValue = valueStateText(it);
        var rawValue = it.value !== null ? it.rawValue === null ? fmt(it.value) : String(it.rawValue) : it.invalid && it.rawValue !== null && String(it.rawValue).trim() ? String(it.rawValue) : null;
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
    function renderBubbles(chart, items) {
      var plot = chart.querySelector("[data-plot]");
      var rmaxAttr = parseNum(chart.getAttribute("data-rmax"));
      var Rmax = rmaxAttr !== null && rmaxAttr > 0 ? rmaxAttr : 52;
      var positive = items.filter(function(i) {
        return i.value !== null && i.value > 0;
      });
      var rawMax = chart.getAttribute("data-max");
      var hasDeclared = rawMax !== null && String(rawMax).trim() !== "";
      var declared = hasDeclared ? parseNum(rawMax) : null;
      var largest = positive.length ? Math.max.apply(null, positive.map(function(i) {
        return i.value;
      })) : 0;
      var scaleKind = "auto";
      if (hasDeclared) {
        if (declared === null || declared <= 0) scaleKind = "invalid";
        else if (largest > declared) scaleKind = "over";
        else scaleKind = "ok";
      }
      if (scaleKind === "invalid") {
        plot.innerHTML = "";
        renderScaleRefusal(
          chart,
          items,
          plot,
          { kind: "invalid" },
          "تعذر عرض الدوائر بهذا النطاق. القيم متاحة أدناه.",
          'bubbles: data-max="' + rawMax + '" غير رقمي/غير موجب — مقياس غير قابل للاستخدام (عقد A01 نفسه bars/line)؛ رُفض الرسم النسبي والقيم معروضة كاملة.'
        );
        return;
      }
      if (scaleKind === "over" && (chart.getAttribute("data-overscale") || "refuse") !== "rescale") {
        plot.innerHTML = "";
        renderScaleRefusal(
          chart,
          items,
          plot,
          { kind: "over" },
          "تعذر عرض الدوائر بهذا النطاق. القيم متاحة أدناه.",
          "bubbles: أكبر قيمة (" + fmt(largest) + ') تتجاوز data-max="' + fmt(declared) + '" — كان نصف القطر سيتجاوز rmax المعلن بصمت (r = Rmax×√(v/vmax) > Rmax)؛ صحّح data-max أو استخدم data-overscale="rescale" لتوسيع المقياس بشكل معلن.'
        );
        return;
      }
      var vmax = scaleKind === "ok" ? declared : Math.max(largest, 1);
      var wrap = document.createElement("div");
      wrap.className = "m-bubbles";
      items.forEach(function(it) {
        var b = document.createElement("div");
        b.className = "m-bubble m-cat--" + it.series;
        var circ = svgEl("svg", { viewBox: "0 0 100 100", "aria-hidden": "true", focusable: "false" });
        var valTxt = document.createElement("span");
        valTxt.className = "m-bubble__value";
        var lab = document.createElement("span");
        lab.className = "m-bubble__label";
        lab.textContent = it.label;
        if (it.value === null) {
          circ.setAttribute("class", "m-bubble__circle--none");
          valTxt.textContent = "(غير متاح)";
        } else if (it.value < 0) {
          circ.setAttribute("class", "m-bubble__circle--none");
          valTxt.textContent = fmt(it.value) + " (سالب غير صالح للمساحة)";
        } else if (it.value === 0) {
          circ.setAttribute("class", "m-bubble__circle--none");
          valTxt.textContent = "0";
        } else {
          var r = Rmax * Math.sqrt(it.value / vmax);
          circ.setAttribute("class", "m-bubble__circle");
          circ.style.width = circ.style.height = r * 2 + "px";
          valTxt.textContent = fmt(it.value);
        }
        if (circ.classList.contains("m-bubble__circle--none")) {
          circ.style.width = circ.style.height = "14px";
          circ.appendChild(svgEl("circle", { cx: 50, cy: 50, r: 44, "stroke-dasharray": "3 3" }));
        } else {
          circ.appendChild(svgEl("circle", { cx: 50, cy: 50, r: 50 }));
        }
        b.appendChild(valTxt);
        b.appendChild(circ);
        b.appendChild(lab);
        wrap.appendChild(b);
      });
      plot.innerHTML = "";
      plot.appendChild(wrap);
      if (scaleKind === "over") {
        var note = document.createElement("p");
        note.className = "m-chart__scale-note";
        note.textContent = "نطاق الدوائر: " + fmt(vmax) + " بدل " + fmt(declared) + ". القيم الأصلية دون تغيير.";
        plot.appendChild(note);
        chart.setAttribute("data-scale-state", "over-rescaled");
        chart.setAttribute("data-scale-detail", 'bubbles: data-overscale="rescale" — رسم بمقياس موسّع من ' + fmt(declared) + " إلى " + fmt(vmax) + "؛ القيم الأصلية دون تغيير، ولا نصف قطر يتجاوز rmax.");
      }
    }
    var renderWidths = /* @__PURE__ */ new WeakMap();
    var plotObservers = /* @__PURE__ */ new WeakMap();
    var plotFrames = /* @__PURE__ */ new WeakMap();
    var disconnectedCharts = /* @__PURE__ */ new WeakSet();
    var RESIZE_EPS = 0.5;
    function observePlot(chart) {
      if (typeof ResizeObserver !== "function") return;
      if (plotObservers.has(chart)) return;
      var plot = chart.querySelector("[data-plot]");
      if (!plot) return;
      var ro = new ResizeObserver(function(entries) {
        if (disconnectedCharts.has(chart) || plotObservers.get(chart) !== ro) return;
        var w = entries.length ? entries[0].contentRect.width : 0;
        if (w <= 1) return;
        var last = renderWidths.get(chart);
        if (last !== void 0 && Math.abs(w - last) < RESIZE_EPS) return;
        if (plotFrames.has(chart)) return;
        plotFrames.set(chart, window.requestAnimationFrame(function() {
          plotFrames.delete(chart);
          if (!chart.isConnected || disconnectedCharts.has(chart) || plotObservers.get(chart) !== ro) return;
          var width = plot.getBoundingClientRect().width;
          var renderedWidth = renderWidths.get(chart);
          if (width <= 1 || renderedWidth !== void 0 && Math.abs(width - renderedWidth) < RESIZE_EPS) return;
          render(chart);
        }));
      });
      ro.observe(plot);
      plotObservers.set(chart, ro);
    }
    function rememberRenderWidth(chart) {
      var plot = chart.querySelector("[data-plot]");
      if (!plot) return;
      renderWidths.set(chart, plot.getBoundingClientRect().width);
      observePlot(chart);
    }
    var readingLives = /* @__PURE__ */ new WeakMap();
    var donutReadings = /* @__PURE__ */ new WeakMap();
    var readingUid = 0;
    function isReadable(chart) {
      return chart.getAttribute("data-presentation") === "readable";
    }
    function readingNode(tag, cls, text) {
      var el = document.createElement(tag);
      if (cls) el.className = cls;
      if (text !== void 0) el.textContent = text;
      return el;
    }
    function appendReadingUnit(parent, unit) {
      if (!unit) return;
      parent.appendChild(document.createTextNode(" "));
      var node = readingNode("span", "m-chart__reading-unit", unit);
      node.setAttribute("data-reading-unit", unit);
      parent.appendChild(node);
    }
    function appendReadableValue(parent, it, donut) {
      var full = valueStateText(it);
      var raw = it.value !== null ? String(it.rawValue === null ? it.value : it.rawValue) : it.invalid && it.rawValue !== null ? String(it.rawValue) : null;
      if (donut && it.value !== null && it.value < 0) full = raw + " (غير صالح للنسب)";
      if (raw === null) parent.appendChild(readingNode("span", null, full));
      else {
        var bdi = readingNode("bdi", null, it.value !== null && it.display ? it.display : raw);
        bdi.dir = it.value === null ? "auto" : "ltr";
        parent.appendChild(bdi);
        if (full.length > raw.length) parent.appendChild(readingNode("span", "m-chart__reading-state", full.slice(raw.length)));
      }
    }
    function selectionItems(chart, items) {
      if (chart.getAttribute("data-selection") !== "single" || !/^(bars|line|donut)$/.test(chart.getAttribute("data-chart"))) return null;
      if (isReadable(chart) && mixedReadingContext(items)) return null;
      var seen = /* @__PURE__ */ new Set();
      if (!items.length || items.some(function(it) {
        if (it.key === null || !it.key.trim() || seen.has(it.key)) return true;
        seen.add(it.key);
        return false;
      })) return null;
      return items;
    }
    function selectionSnapshot(chart, items) {
      items = items || itemsOf(chart);
      if (!selectionItems(chart, items)) return null;
      var key = chart.getAttribute("data-selected-key");
      var it = items.find(function(item) {
        return item.key === key;
      });
      if (!it) return null;
      var meta = donutReadings.get(chart);
      return {
        key: it.key,
        label: fullLabelOf(chart, it),
        value: it.value,
        rawValue: it.rawValue,
        display: it.display,
        invalid: it.invalid,
        unit: it.unit,
        period: it.period,
        share: meta && meta.denominator > 0 && it.value !== null && it.value >= 0 ? it.value / meta.denominator : null
      };
    }
    function setReadingSelection(chart, key, user) {
      var items = itemsOf(chart);
      if (!selectionItems(chart, items)) return null;
      if (disconnectedCharts.has(chart)) return selectionSnapshot(chart, items);
      if (key !== null && !items.some(function(it) {
        return it.key === key;
      })) return selectionSnapshot(chart, items);
      var old = chart.getAttribute("data-selected-key");
      if (key === null) chart.removeAttribute("data-selected-key");
      else chart.setAttribute("data-selected-key", key);
      updateReadingSelection(chart, items);
      var result = selectionSnapshot(chart, items);
      if (user && old !== chart.getAttribute("data-selected-key")) {
        chart.dispatchEvent(new CustomEvent("micro-data:selection-change", { bubbles: true, detail: result }));
      }
      return result;
    }
    function disposeReading(chart) {
      var life = readingLives.get(chart);
      if (life) {
        life.controller.abort();
        life.box.remove();
        readingLives.delete(chart);
      }
      [].slice.call(chart.querySelectorAll("[data-reading-choice]")).forEach(function(button) {
        button.disabled = true;
        button.removeAttribute("aria-pressed");
      });
    }
    function focusAvailableReading(chart, preferred) {
      var candidates = [preferred].concat([].slice.call(chart.querySelectorAll("[data-reading-choice], .m-chart__select-range, .m-chart__select-step, .m-chart__disclose")));
      var available = candidates.find(function(el) {
        return el && !el.disabled && el.getClientRects().length && !el.closest("[hidden]");
      });
      if (available) available.focus({ preventScroll: true });
    }
    function updateReadingSelection(chart, items) {
      var life = readingLives.get(chart), selected = selectionSnapshot(chart, items);
      var focusedControl = life && life.controls.contains(document.activeElement) ? document.activeElement : null;
      if (life) {
        var index = selected ? items.findIndex(function(it) {
          return it.key === selected.key;
        }) : -1;
        life.range.max = Math.max(0, items.length - 1);
        life.range.value = Math.max(0, index);
        life.range.disabled = !selected || items.length < 2;
        life.prev.disabled = index <= 0;
        life.next.disabled = index === items.length - 1;
        life.status.textContent = "";
        if (selected) {
          life.status.appendChild(readingNode("span", "m-chart__selected-label", selected.label));
          var value = readingNode("span", "m-chart__selected-value");
          appendReadableValue(value, items[index], chart.getAttribute("data-chart") === "donut");
          appendReadingUnit(value, selected.unit);
          life.status.appendChild(value);
        } else life.status.textContent = "اختر عنصرًا لقراءة تفاصيله";
        life.range.setAttribute("aria-valuetext", selected ? selected.label + "، " + value.textContent : "لم يُحدد عنصر");
      }
      [].slice.call(chart.querySelectorAll("[data-reading-choice]")).forEach(function(button) {
        var active = !!selected && button.getAttribute("data-reading-choice") === selected.key;
        button.setAttribute("aria-pressed", String(active));
        var pct = button.querySelector("[data-reading-share]");
        if (pct) pct.hidden = !active;
      });
      [].slice.call(chart.querySelectorAll("[data-reading-key]")).forEach(function(el) {
        el.setAttribute("data-reading-selected", String(!!selected && el.getAttribute("data-reading-key") === selected.key));
      });
      if (window.MicroReadings) window.MicroReadings.sync(chart);
      if (focusedControl && focusedControl.disabled && (document.activeElement === focusedControl || document.activeElement === document.body)) focusAvailableReading(chart, life.range);
    }
    function readableLegend(chart, items, legend, denominator) {
      if (!isReadable(chart) && chart.getAttribute("data-selection") !== "single") return;
      donutReadings.set(chart, { denominator });
      legend.textContent = "";
      var enabled = !!selectionItems(chart, items);
      items.forEach(function(it) {
        var li = readingNode("li", "m-legend__item m-cat--" + it.series);
        var row = readingNode(enabled ? "button" : "div", "m-chart__legend-row");
        if (enabled) {
          row.type = "button";
          row.setAttribute("data-reading-choice", it.key);
          row.setAttribute("aria-pressed", "false");
        }
        var swatch = readingNode("span", "m-legend__swatch");
        swatch.setAttribute("aria-hidden", "true");
        row.appendChild(swatch);
        row.appendChild(readingNode("span", "m-legend__label", fullLabelOf(chart, it)));
        var value = readingNode("span", "m-legend__value");
        appendReadableValue(value, it, true);
        appendReadingUnit(value, it.unit);
        if (enabled && denominator > 0 && it.value !== null && it.value >= 0) {
          var share = readingNode("span", "m-chart__share", Math.round(it.value / denominator * 100) + "%");
          share.dir = "ltr";
          share.setAttribute("data-reading-share", "");
          share.setAttribute("aria-label", share.textContent + " من الإجمالي");
          share.hidden = true;
          value.appendChild(share);
        }
        row.appendChild(value);
        li.appendChild(row);
        legend.appendChild(li);
      });
    }
    function mixedReadingContext(items) {
      return items.length > 0 && items.some(function(it) {
        return it.unit !== items[0].unit || it.period !== items[0].period;
      });
    }
    function readableFallback(chart, items) {
      var plot = chart.querySelector("[data-plot]");
      plot.textContent = "";
      var list = readingNode("dl", "m-chart__readings");
      items.forEach(function(it) {
        var row = readingNode("div");
        row.appendChild(readingNode("dt", null, fullLabelOf(chart, it)));
        var value = readingNode("dd");
        appendReadableValue(value, it, chart.getAttribute("data-chart") === "donut");
        appendReadingUnit(value, it.unit || "(وحدة غير محددة)");
        if (it.period) value.appendChild(readingNode("span", "m-chart__reading-period", " · " + it.period));
        row.appendChild(value);
        list.appendChild(row);
      });
      plot.appendChild(list);
      chart.setAttribute("data-reading-state", "mixed-context");
    }
    function syncReadable(chart, items) {
      var readable = isReadable(chart), valid = selectionItems(chart, items);
      if (!readable && chart.getAttribute("data-selection") !== "single") {
        chart.removeAttribute("data-selection-state");
        disposeReading(chart);
        return;
      }
      if (readable) {
        var mixed = mixedReadingContext(items);
        var rows = chart.querySelectorAll(".m-chart__dataset tbody tr");
        [].slice.call(rows).forEach(function(row, i) {
          var cell = row.querySelector("td:last-of-type");
          if (cell && items[i]) appendReadingUnit(cell, items[i].unit);
          if (mixed && items[i]) {
            var periodCell = readingNode("td"), period = readingNode("bdi", null, items[i].period || "(فترة غير محددة)");
            period.dir = "auto";
            periodCell.appendChild(period);
            row.appendChild(periodCell);
          }
        });
        if (mixed) {
          var head = chart.querySelector(".m-chart__dataset thead tr");
          if (head) {
            var periodHead = readingNode("th", null, "الفترة");
            periodHead.scope = "col";
            head.appendChild(periodHead);
          }
          var caption = chart.querySelector(".m-chart__dataset caption");
          var title = chart.querySelector(".m-chart__title");
          var titleText = title ? title.textContent.trim() : (chart.getAttribute("data-title") || "").trim();
          if (caption) caption.textContent = (titleText ? titleText + " — " : "") + "القراءات بوحداتها وفتراتها";
        }
      }
      if (!valid) {
        disposeReading(chart);
        if (chart.getAttribute("data-selection") === "single") {
          chart.setAttribute("data-selection-state", readable && mixedReadingContext(items) ? "mixed-context" : items.length ? "invalid-keys" : "empty");
          chart.removeAttribute("data-selected-key");
        } else chart.removeAttribute("data-selection-state");
        if (window.MicroReadings) window.MicroReadings.sync(chart);
        return;
      }
      chart.setAttribute("data-selection-state", "ready");
      var marks = chart.querySelectorAll("[data-plot] > svg > [data-source-index], [data-plot] > svg > g");
      [].slice.call(marks).forEach(function(mark, index) {
        var sourceIndex = mark.hasAttribute("data-source-index") ? Number(mark.getAttribute("data-source-index")) : mark.hasAttribute("data-point-index") ? Number(mark.getAttribute("data-point-index")) : index;
        if (items[sourceIndex]) mark.setAttribute("data-reading-key", items[sourceIndex].key);
      });
      if (!items.some(function(it) {
        return it.key === chart.getAttribute("data-selected-key");
      })) chart.removeAttribute("data-selected-key");
      var life = readingLives.get(chart);
      if (!life || !chart.contains(life.box)) {
        let on = function(el, type, fn) {
          el.addEventListener(type, fn, { signal: controller.signal });
        }, step = function(amount) {
          var current = itemsOf(chart), key = chart.getAttribute("data-selected-key");
          var index = current.findIndex(function(it) {
            return it.key === key;
          });
          var target = index < 0 ? amount > 0 ? 0 : current.length - 1 : Math.max(0, Math.min(current.length - 1, index + amount));
          if (current[target]) setReadingSelection(chart, current[target].key, true);
        };
        if (life) life.controller.abort();
        [].slice.call(chart.querySelectorAll('[data-reading-owned="selection"]')).forEach(function(el) {
          el.remove();
        });
        var box = readingNode("div", "m-chart__selection");
        box.setAttribute("data-reading-owned", "selection");
        var status = readingNode("p", "m-chart__selection-value");
        status.id = "micro-data-selection-" + ++readingUid;
        status.setAttribute("role", "status");
        box.appendChild(status);
        var controls = readingNode("div", "m-chart__selection-controls");
        var prev = readingNode("button", "m-btn m-btn--secondary m-chart__select-step", "السابق");
        prev.type = "button";
        var range = readingNode("input", "m-chart__select-range");
        range.type = "range";
        range.min = "0";
        range.step = "1";
        range.setAttribute("aria-label", "تحديد عنصر لقراءة قيمته");
        range.setAttribute("aria-describedby", status.id);
        var next = readingNode("button", "m-btn m-btn--secondary m-chart__select-step", "التالي");
        next.type = "button";
        controls.appendChild(prev);
        controls.appendChild(range);
        controls.appendChild(next);
        box.appendChild(controls);
        if (chart.getAttribute("data-chart") === "donut") controls.hidden = true;
        chart.appendChild(box);
        var controller = new AbortController();
        life = { box, controls, status, range, prev, next, controller };
        readingLives.set(chart, life);
        on(range, "input", function() {
          var current = itemsOf(chart);
          if (current[Number(range.value)]) setReadingSelection(chart, current[Number(range.value)].key, true);
        });
        on(prev, "click", function() {
          step(-1);
        });
        on(next, "click", function() {
          step(1);
        });
        on(chart, "click", function(event) {
          var button = event.target.closest("[data-reading-choice]");
          if (button && chart.contains(button) && !button.disabled) setReadingSelection(chart, button.getAttribute("data-reading-choice"), true);
        });
      }
      life.controls.hidden = chart.getAttribute("data-chart") === "donut";
      var disclosure = chart.querySelector(".m-chart__dataset-wrap");
      if (disclosure && disclosure.parentNode === chart && life.box.nextElementSibling !== disclosure) chart.insertBefore(life.box, disclosure);
      life.range.dir = chart.getAttribute("data-chart") === "bars" && chart.getAttribute("data-value-domain") !== "signed" ? "ltr" : chart.getAttribute("data-axis-dir") || "rtl";
      updateReadingSelection(chart, items);
    }
    function render(chart) {
      var focusControl = document.activeElement && chart.contains(document.activeElement) && document.activeElement.matches(".m-chart__select-range, .m-chart__select-step") ? document.activeElement : null;
      var focusChoice = document.activeElement && chart.contains(document.activeElement) && document.activeElement.closest("[data-reading-choice]");
      var focusKey = focusChoice ? focusChoice.getAttribute("data-reading-choice") : null;
      donutReadings.delete(chart);
      chart.removeAttribute("data-reading-state");
      disconnectedCharts.delete(chart);
      chart.removeAttribute("data-value-layout");
      chart.removeAttribute("data-index-label-layout");
      var kind = chart.getAttribute("data-chart");
      var items = itemsOf(chart);
      var summary = chart.querySelector("[data-summary]");
      chart.removeAttribute("data-scale-state");
      chart.removeAttribute("data-scale-detail");
      chart.removeAttribute("data-axis-state");
      var domain = chart.getAttribute("data-value-domain") || "non-negative";
      if (isReadable(chart) && mixedReadingContext(items)) readableFallback(chart, items);
      else if ((kind === "bars" || kind === "line" || kind === "bubbles") && items.length === 0) {
        var emptyPlot = chart.querySelector("[data-plot]");
        emptyPlot.textContent = "";
        var empty = document.createElement("p");
        empty.className = "m-chart__empty";
        empty.setAttribute("role", "status");
        empty.textContent = "لا توجد بيانات لعرضها.";
        emptyPlot.appendChild(empty);
        chart.setAttribute("data-scale-state", "empty");
      } else if ((kind === "bars" || kind === "line") && domain === "signed") renderSigned(chart, items, kind);
      else if ((kind === "bars" || kind === "line") && domain !== "non-negative") {
        chart.querySelector("[data-plot]").textContent = "";
        renderScaleRefusal(
          chart,
          items,
          chart.querySelector("[data-plot]"),
          { kind: "invalid-domain" },
          "نوع نطاق القيم غير مدعوم. القراءات متاحة كاملة.",
          "Expected non-negative or signed value domain."
        );
      } else if (kind === "bars") renderBars(chart, items);
      else if (kind === "line") renderLine(chart, items);
      else if (kind === "donut") renderDonut(chart, items);
      else if (kind === "bubbles") renderBubbles(chart, items);
      syncChartContext(chart);
      linkChartName(chart);
      syncDatasetTable(chart, items);
      syncReadable(chart, items);
      if (focusKey !== null) {
        var replacement = [].slice.call(chart.querySelectorAll("[data-reading-choice]")).find(function(el) {
          return el.getAttribute("data-reading-choice") === focusKey;
        });
        if (!replacement) replacement = [].slice.call(chart.querySelectorAll("[data-reading-choice], .m-chart__select-range, .m-chart__disclose")).find(function(el) {
          return !el.disabled && el.getClientRects().length;
        });
        if (replacement && !replacement.disabled) replacement.focus({ preventScroll: true });
      } else if (focusControl && (document.activeElement === document.body || document.activeElement === focusControl) && (!chart.contains(focusControl) || focusControl.disabled || !focusControl.getClientRects().length)) {
        focusAvailableReading(chart, chart.querySelector(".m-chart__select-range"));
      }
      if (kind === "bars" || kind === "line" || kind === "donut") rememberRenderWidth(chart);
      if (summary && chart.getAttribute("data-summary-text") !== null) {
        summary.textContent = chart.getAttribute("data-summary-text");
      }
      chart.dispatchEvent(new CustomEvent("micro-data:rendered", { bubbles: true, detail: { kind } }));
    }
    window.MicroData = {
      /* W2.5 (A2-F08): init(root) يعالج الجذر نفسه إن طابق [data-chart] ثم
         الأبناء — نفس عقد init الموحد للعائلات؛ إعادة init آمنة (render
         idempotent والمراقب واحد لكل رسم عبر WeakMap). */
      init: function(root) {
        var scope = root || document;
        var charts = [].slice.call(scope.querySelectorAll("[data-chart]"));
        if (scope.nodeType === 1 && scope.matches("[data-chart]")) charts.unshift(scope);
        charts.forEach(function(c) {
          render(c);
        });
      },
      /* إعادة تصيير رسم واحد بعد تعديل بيانات المصدر (يستخدمه الفحص) */
      render,
      getSelection: function(chart) {
        return chart && chart.matches && chart.matches("[data-chart]") ? selectionSnapshot(chart) : null;
      },
      setSelection: function(chart, key) {
        return chart && chart.matches && chart.matches("[data-chart]") ? setReadingSelection(chart, key, false) : null;
      },
      /* R3-UI01: فصل مراقبي الرصد تحت جذر لدورة التنظيف؛ init/render
         يظلان متاحين ويعيدان الإلحاق عند الحاجة، ومعالج DOMContentLoaded
         المسجل مرة واحدة عند تحميل الوحدة لا يتكرر */
      disconnect: function(root) {
        var scope = root || document;
        var charts = [].slice.call(scope.querySelectorAll("[data-chart]"));
        if (scope.matches && scope.matches("[data-chart]")) charts.unshift(scope);
        charts.forEach(function(c) {
          disconnectedCharts.add(c);
          disposeReading(c);
          if (window.MicroReadings) window.MicroReadings.disconnect(c);
          var ro = plotObservers.get(c);
          if (ro) {
            ro.disconnect();
            plotObservers.delete(c);
          }
          if (plotFrames.has(c)) window.cancelAnimationFrame(plotFrames.get(c));
          plotFrames.delete(c);
          renderWidths.delete(c);
        });
      }
    };
    document.addEventListener("DOMContentLoaded", function() {
      window.MicroData.init();
    });
    if (document.readyState !== "loading") window.MicroData.init();
    function refitChartsOnFontsReady() {
      if (!document.fonts || !document.fonts.ready) return;
      document.fonts.ready.then(function() {
        [].slice.call(document.querySelectorAll("[data-chart]")).forEach(function(c) {
          var kind = c.getAttribute("data-chart");
          if (c.isConnected && !disconnectedCharts.has(c) && (kind === "bars" || kind === "line" || kind === "donut")) render(c);
        });
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", refitChartsOnFontsReady, { once: true });
    } else {
      refitChartsOnFontsReady();
    }
  })();
})();
