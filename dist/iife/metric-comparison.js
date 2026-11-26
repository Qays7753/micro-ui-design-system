if(typeof document!=='undefined'&&document.currentScript&&document.currentScript.src){(typeof globalThis!=='undefined'?globalThis:window).__microIifeBaseUrl=document.currentScript.src;}
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // components/metric-comparison/metric-comparison.js
  var metric_comparison_exports = {};
  __export(metric_comparison_exports, {
    destroy: () => destroy,
    disconnect: () => disconnect,
    getInstance: () => getInstance,
    init: () => init,
    render: () => render,
    setLabels: () => setLabels2,
    update: () => render
  });

  // shared/labels.js
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
  function registerLabels(family, defaults2) {
    var families = store().families;
    if (!families[family]) families[family] = {};
    var current = families[family];
    for (var key in defaults2) current[key] = defaults2[key];
  }
  function getLabel(family, key, vars) {
    var entry = store().families[family];
    var value = entry ? entry[key] : void 0;
    if (value == null || !vars) return value;
    var text = String(value);
    for (var name in vars) text = text.split("{" + name + "}").join(String(vars[name]));
    return text;
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

  // shared/integrations.js
  function globalApi(name) {
    if (typeof globalThis === "undefined") return void 0;
    return globalThis["Micro" + name];
  }

  // shared/lifecycle.js
  function instanceRegistry() {
    var instances2 = /* @__PURE__ */ new WeakMap();
    function key(root) {
      return root || document;
    }
    return {
      get: function(root) {
        var instance = instances2.get(key(root));
        return instance && !instance.__destroyed ? instance : null;
      },
      set: function(root, instance) {
        instances2.set(key(root), instance);
      },
      remove: function(root) {
        instances2.delete(key(root));
      }
    };
  }

  // components/metric-comparison/labels.js
  var defaults = {
    "circles.discloseAriaLabel": "القراءات الدقيقة لكل القيم",
    "circles.renderError": "تعذّر رسم الدوائر بهذا الإعداد. القيم معروضة في القائمة.",
    "circles.unknownLayoutDetail": "' غير معروف (المعروف: separated/overlap) — رُفض الرسم؛ القراءات كاملة في القائمة البديلة.",
    "circles.scaleError": "تعذّر رسم الدوائر بهذا النطاق. القيم معروضة في القائمة.",
    "circles.scaleInvalidDetailPrefix": "' غير موجب أو أصغر من أكبر مقدار معلوم (",
    "circles.scaleInvalidDetailSuffix": ") — مقياس غير قابل للاستخدام؛ رُفض الرسم والقراءات كاملة في القائمة البديلة.",
    "circles.radiusInvalidDetail": "' غير موجب — حد حجم دائرة غير قابل للاستخدام؛ رُفض الرسم والقراءات كاملة في القائمة البديلة.",
    "circles.deferredMessage": "لا تتوفر مساحة عرض بعد؛ ستظهر الدوائر عند إتاحة البطاقة.",
    "circles.deferredDetail": "metric-circles: عرض اللوحة 0 — الرسم مؤجل حتى إتاحة المساحة (يعاد الرسم عند الإظهار).",
    "circles.zeroMessage": "القيم المعروفة صفرية؛ العلامة المجوفة تعني صفرًا، وليست مساحة عددية.",
    "circles.emptyMessage": "لا توجد قراءات متاحة للمقارنة بعد.",
    "circles.zeroDetail": "metric-circles: كل القيم المعلومة صفر — علامات صفر مجوفة بلا مساحات مقارنة.",
    "circles.noValuesDetail": "metric-circles: لا قيم معلومة — لا رسم.",
    "circles.scaledMessageBase": "المساحة تقارن مقدار القيمة؛ الإشارة مكتوبة في القراءة.",
    "circles.zeroMarkNote": " العلامة المجوفة تعني صفرًا، وليست مساحة عددية.",
    "circles.scaleNotePrefix": " النطاق يصل إلى ",
    "circles.overlapNote": " التداخل بصري فقط ولا يدل على تقاطع أو علاقة بين القيم.",
    "circles.fitNote": " — الحجم يتكيف مع عرض البطاقة ضمن نصف القطر؛ scale=",
    "value.invalid": "قيمة غير صالحة",
    "value.missing": "غير متاح",
    "value.unreadable": "تعذّر قراءة القيمة",
    "chart.empty": "لا توجد بيانات للمقارنة.",
    "table.showButton": "عرض البيانات كجدول",
    "table.hideButton": "إخفاء جدول البيانات",
    "table.unitPrefix": "الوحدة: ",
    "table.periodPrefix": "الفترة: ",
    "table.separator": "، ",
    "table.head.category": "الفئة",
    "table.head.value": "القيمة",
    "table.head.unit": "الوحدة",
    "table.head.period": "الفترة",
    "table.mainMetricFallback": "القيمة الرئيسية",
    "table.missingValue": "— (غير متاح)",
    "table.invalidValue": "(قيمة غير صالحة)",
    "table.zeroValue": "(صفر)",
    "table.negativeValue": "(سالب)",
    "table.head.state": "الحالة",
    "bars.stateZero": "صفر",
    "bars.stateNegative": "سالب — معروض بالقيمة والإشارة لا بالمساحة",
    "bars.emptyDetail": "metric-bars: مصدر فارغ — لا صفوف.",
    "bars.unitMismatchError": "تعذّر عرض المقارنة: وحدة أو فترة غير متوافقة بين القيم. القراءات معروضة كاملة.",
    "bars.unitMismatchDetail": "metric-bars: تباين data-unit/data-period في بعض الصفوف مع data-common-unit/data-common-period — لا مقياس مشترك؛ رُفض رسم الأشرطة والقراءات كاملة.",
    "bars.scaleError": "تعذّر عرض المقارنة بهذا النطاق. القراءات معروضة كاملة.",
    "bars.scaleInvalidDetail": "' غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض رسم الأشرطة والقراءات كاملة.",
    "bars.unfairScaleError": "تعذّر عرض مقارنة عادلة بهذا النطاق. القراءات معروضة كاملة.",
    "bars.underscaleDetailPrefix": " أصغر من أكبر مقدار معلوم (",
    "bars.underscaleDetailSuffix": ") — رسم نسبي كان سيخفي الفرق؛ رُفض رسم الأشرطة والقراءات كاملة.",
    "bars.scaledMessagePrefix": "الأشرطة حتى ",
    "bars.scaledDetailUnit": "؛ common-unit=",
    "bars.scaledDetailPeriod": "؛ common-period=",
    "bars.zeroMessage": "القيم المعروفة صفرية؛ علامة الصفر ظاهرة دون طول مصطنع.",
    "bars.zeroDetail": "metric-bars: كل القيم المعلومة صفر — علامات صفر بلا أطوال.",
    "bars.emptyMessage": "لا توجد قراءات متاحة لبناء مقياس بعد.",
    "bars.noValuesDetail": "metric-bars: لا قيم معلومة — لا مقياس.",
    "bars.zeroLineNote": " خط الوسط صفر؛ الموجب يمينه والسالب يساره.",
    "main.missing": "(غير متاح)",
    "main.invalidSuffix": " (قيمة غير صالحة)"
  };

  // components/metric-comparison/metric-comparison.js
  registerLabels("metric-comparison", defaults);
  var MICRO_LABELS_FAMILY = "metric-comparison";
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
  var NUMBER_RE = /^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
  var SERIES = { a: true, b: true, c: true, d: true, e: true };
  function readNumber(raw) {
    if (raw === null || raw === void 0 || String(raw).trim() === "") return { state: "missing", value: null };
    var text = String(raw).trim().replace(/^\u2212/, "-");
    if (!NUMBER_RE.test(text)) return { state: "invalid", value: null };
    var value = Number(text.replace(/,/g, ""));
    if (!isFinite(value)) return { state: "invalid", value: null };
    return { state: value < 0 ? "negative" : value === 0 ? "zero" : "positive", value };
  }
  function seriesOf(node) {
    var key = node.getAttribute("data-series") || "a";
    return SERIES[key] ? key : "a";
  }
  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== void 0) node.textContent = text;
    return node;
  }
  function clearDiagnostics(chart) {
    chart.removeAttribute("data-scale-state");
    chart.removeAttribute("data-scale-detail");
  }
  function writeDiagnostics(chart, state, detail) {
    chart.setAttribute("data-scale-state", state);
    chart.setAttribute("data-scale-detail", detail);
  }
  function circleItems(chart) {
    clearDiagnostics(chart);
    var source = chart.querySelector("[data-metric-source]");
    var target = chart.querySelector("[data-metric-items]");
    var fallbackTarget = chart.querySelector("[data-metric-fallback]");
    var empty = chart.querySelector("[data-metric-empty]");
    if (!source || !target) return;
    if (!fallbackTarget) {
      fallbackTarget = make("ul", "m-metric-circles__fallback");
      fallbackTarget.setAttribute("data-metric-fallback", "");
      fallbackTarget.setAttribute("aria-label", L("circles.discloseAriaLabel", fallbackTarget));
      target.insertAdjacentElement("afterend", fallbackTarget);
    }
    var items = Array.prototype.slice.call(source.querySelectorAll("[data-label]")).map(function(node) {
      return {
        label: node.getAttribute("data-label") || "",
        raw: node.getAttribute("data-value"),
        display: node.getAttribute("data-display-value"),
        unit: node.getAttribute("data-unit") || chart.getAttribute("data-unit") || "",
        period: node.getAttribute("data-period") || chart.getAttribute("data-period") || "",
        state: node.getAttribute("data-state"),
        series: seriesOf(node)
      };
    });
    target.textContent = "";
    target.setAttribute("aria-hidden", "true");
    if (fallbackTarget) fallbackTarget.textContent = "";
    var known = items.map(function(item) {
      return item.state === "invalid" || item.state === "unavailable" ? null : readNumber(item.raw);
    }).filter(function(item) {
      return item && item.value !== null;
    });
    var magnitudes = known.filter(function(item) {
      return item.value !== 0;
    });
    var declaredRaw = chart.getAttribute("data-max");
    var declared = declaredRaw === null ? null : readNumber(declaredRaw);
    var measuredMax = magnitudes.reduce(function(largest, item) {
      return Math.max(largest, Math.abs(item.value));
    }, 0);
    var max = declaredRaw === null ? measuredMax : declared && declared.state === "positive" ? declared.value : 0;
    var radiusRaw = chart.getAttribute("data-radius");
    var radiusValue = radiusRaw === null ? { state: "positive", value: 72 } : readNumber(radiusRaw);
    var layout = chart.getAttribute("data-layout") || "separated";
    var width = target.getBoundingClientRect().width;
    var validLayout = layout === "separated" || layout === "overlap";
    var validMax = declaredRaw === null || declared && declared.state === "positive" && declared.value >= measuredMax;
    var validRadius = radiusRaw === null || radiusValue.state === "positive" && radiusValue.value > 0;
    var zeroCount = known.length - magnitudes.length;
    var itemCount = known.length;
    var gap = parseFloat(window.getComputedStyle(target).columnGap) || 16;
    gap = Math.min(gap, width / Math.max(2, itemCount * 2));
    var zeroDiameter = Math.min(20, width / Math.max(2, itemCount * 2));
    var weights = magnitudes.reduce(function(sum, value) {
      return sum + Math.sqrt(Math.abs(value.value) / max);
    }, 0);
    var availableDiameter = layout === "overlap" ? width * 0.57 : weights > 0 ? Math.max(0, width - gap * Math.max(0, itemCount - 1) - zeroCount * zeroDiameter) / weights : width;
    var maxRadius = Math.min(radiusValue.value, Math.max(0, availableDiameter / 2));
    var geometryAllowed = validLayout && validMax && validRadius && width > 0 && measuredMax > 0;
    var positions = [
      [0.38, 0.36],
      [0.62, 0.36],
      [0.5, 0.66],
      [0.38, 0.66],
      [0.62, 0.66]
    ];
    var overlapHeight = geometryAllowed ? maxRadius * 2 * 1.55 : 0;
    target.setAttribute("data-layout", measuredMax > 0 ? layout : "separated");
    target.style.setProperty("--m-circle-overlap-height", overlapHeight + "px");
    target.style.columnGap = gap + "px";
    chart.__microMetricWidth = width;
    var scaleNote = chart.querySelector("[data-metric-scale]");
    if (scaleNote) {
      scaleNote.setAttribute("data-valid", String(validLayout && validMax && validRadius && width > 0));
    }
    if (!validLayout) {
      if (scaleNote) scaleNote.textContent = L("circles.renderError", scaleNote);
      writeDiagnostics(
        chart,
        "invalid-layout",
        "metric-circles: data-layout='" + layout + L("circles.unknownLayoutDetail")
      );
    } else if (!validMax) {
      if (scaleNote) scaleNote.textContent = L("circles.scaleError", scaleNote);
      writeDiagnostics(
        chart,
        "invalid-scale",
        "metric-circles: data-max='" + declaredRaw + L("circles.scaleInvalidDetailPrefix") + measuredMax + L("circles.scaleInvalidDetailSuffix")
      );
    } else if (!validRadius) {
      if (scaleNote) scaleNote.textContent = L("circles.renderError", scaleNote);
      writeDiagnostics(
        chart,
        "invalid-radius",
        "metric-circles: data-radius='" + radiusRaw + L("circles.radiusInvalidDetail")
      );
    } else if (!width) {
      if (scaleNote) scaleNote.textContent = L("circles.deferredMessage", scaleNote);
      writeDiagnostics(
        chart,
        "pending-width",
        L("circles.deferredDetail")
      );
    } else if (!measuredMax) {
      if (scaleNote) scaleNote.textContent = known.length ? L("circles.zeroMessage") : L("circles.emptyMessage");
      writeDiagnostics(
        chart,
        known.length ? "zero" : "empty",
        known.length ? L("circles.zeroDetail") : L("circles.noValuesDetail")
      );
    } else {
      if (scaleNote) {
        var scaledMessage = L("circles.scaledMessageBase");
        if (zeroCount) scaledMessage += L("circles.zeroMarkNote");
        if (declaredRaw !== null) scaledMessage += L("circles.scaleNotePrefix", chart) + (chart.getAttribute("data-max-label") || declaredRaw) + ".";
        if (layout === "overlap") scaledMessage += L("circles.overlapNote");
        scaleNote.textContent = scaledMessage;
      }
      writeDiagnostics(
        chart,
        "ok",
        "metric-circles: radius=" + (radiusRaw === null ? "auto" : radiusRaw) + L("circles.fitNote") + (declaredRaw === null ? "auto-largest-known" : "declared")
      );
    }
    var itemGeometry = items.map(function(item, index) {
      var value = item.state === "invalid" || item.state === "unavailable" ? null : readNumber(item.raw);
      var magnitude = value && value.value !== null ? Math.abs(value.value) : null;
      var position = positions[index] || [0.5, 0.5];
      if (index >= positions.length) {
        var angle = (index - positions.length) * Math.PI * 2 / Math.max(1, items.length - positions.length);
        position = [0.5 + Math.cos(angle) * 0.16, 0.5 + Math.sin(angle) * 0.15];
      }
      return {
        value: magnitude,
        diameter: geometryAllowed && magnitude !== null ? 2 * maxRadius * Math.sqrt(magnitude / max) : 0,
        x: position[0],
        y: position[1]
      };
    });
    items.forEach(function(item, index) {
      var state = item.state === "unavailable" ? "missing" : item.state === "invalid" ? "invalid" : readNumber(item.raw).state;
      var display = state === "missing" ? "—" + (item.unit ? " " + item.unit : "") : state === "invalid" ? item.display || (item.raw || L("value.invalid")) + (item.unit ? " " + item.unit : "") : (item.display || item.raw) + (item.unit && !item.display ? " " + item.unit : "");
      var stateText = state === "missing" ? L("value.missing") : state === "invalid" ? L("value.unreadable") : "";
      var zeroMarker = state === "zero" && validLayout && validMax && validRadius && width > 0;
      var canRender = zeroMarker || geometryAllowed && (state === "positive" || state === "negative");
      if (canRender) {
        var li = make("li", "m-metric-circles__item");
        var geometry = itemGeometry[index];
        var diameter = zeroMarker ? zeroDiameter : geometry.diameter;
        li.setAttribute("data-series", item.series);
        li.setAttribute("data-state", state);
        li.style.setProperty("--m-circle-diameter", diameter + "px");
        li.style.setProperty("--m-circle-x", geometry.x * 100 + "%");
        li.style.setProperty("--m-circle-y", geometry.y * 100 + "%");
        li.style.setProperty("--m-circle-layer", String(Math.round(diameter)));
        var visual = make("span", "m-metric-circles__visual");
        visual.setAttribute("aria-hidden", "true");
        var bubble = make("span", "m-metric-circles__bubble");
        bubble.setAttribute("aria-hidden", "true");
        visual.appendChild(bubble);
        li.appendChild(visual);
        target.appendChild(li);
        li.setAttribute("data-inside", "false");
      }
      if (fallbackTarget) {
        fallbackTarget.appendChild(fallbackItem(item, display, stateText));
      }
    });
    if (empty) {
      empty.hidden = items.length > 0;
      if (!items.length) empty.textContent = chart.getAttribute("data-empty-message") || L("chart.empty", empty);
    }
    syncCirclesTable(chart, items);
  }
  function fallbackItem(item, display, stateText) {
    var row = make("li", "m-metric-circles__fallback-item");
    row.setAttribute("data-series", item.series);
    row.appendChild(make("span", "m-metric-circles__fallback-label", item.label));
    var reading = make("span", "m-metric-circles__fallback-reading", display);
    reading.setAttribute("dir", "ltr");
    row.appendChild(reading);
    if (stateText) row.appendChild(make("span", "m-metric-circles__fallback-state", stateText));
    return row;
  }
  var metricTableUid = 0;
  function ensureDatasetWrap(chart) {
    var wrap = chart.querySelector(".m-main-metric__dataset-wrap");
    var btn, table;
    if (!wrap) {
      wrap = make("div", "m-main-metric__dataset-wrap");
      btn = make("button", "m-btn m-btn--secondary m-main-metric__disclose", L("table.showButton", btn));
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");
      table = make("table", "m-main-metric__dataset");
      table.hidden = true;
      wrap.appendChild(btn);
      wrap.appendChild(table);
      chart.appendChild(wrap);
    } else {
      btn = wrap.querySelector(".m-main-metric__disclose");
      table = wrap.querySelector(".m-main-metric__dataset");
    }
    if (btn) btn.classList.add("m-btn", "m-btn--secondary");
    var binding = btn && btn.__microDatasetDisclosure;
    if (btn && table && (!binding || binding.table !== table)) {
      if (binding) btn.removeEventListener("click", binding.handler);
      do {
        table.id = "micro-metric-dataset-" + ++metricTableUid;
      } while (document.getElementById(table.id) && document.getElementById(table.id) !== table);
      btn.setAttribute("aria-controls", table.id);
      var handler = function() {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        table.hidden = open;
        btn.textContent = open ? L("table.showButton", btn) : L("table.hideButton", btn);
      };
      btn.__microDatasetDisclosure = { table, handler };
      btn.addEventListener("click", handler);
    }
    return { wrap, btn, table };
  }
  function buildTableHead(table, headers) {
    var thead = make("thead");
    var headRow = make("tr");
    headers.forEach(function(h) {
      var th = make("th", null, h);
      th.setAttribute("scope", "col");
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
  }
  function appendRow(tbody, cells) {
    var tr = make("tr");
    var th = make("th", null, cells[0]);
    th.setAttribute("scope", "row");
    tr.appendChild(th);
    for (var i = 1; i < cells.length; i++) {
      var td = make("td");
      if (cells[i] && cells[i].nodeType) td.appendChild(cells[i]);
      else td.textContent = cells[i];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  function datasetReading(value, suffix, numeric) {
    var fragment = document.createDocumentFragment();
    var reading = make("bdi", null, value);
    reading.dir = numeric === false ? "auto" : "ltr";
    fragment.appendChild(reading);
    if (suffix) fragment.appendChild(document.createTextNode(" " + suffix));
    return fragment;
  }
  function tableCaptionBase(chart) {
    var title = chart.querySelector(".m-main-metric__title, .m-metric-circles__title");
    var parts = [String(title && title.textContent || chart.getAttribute("data-title") || chart.getAttribute("aria-label") || "").trim()];
    var unit = chart.getAttribute("data-common-unit") || chart.getAttribute("data-unit");
    var period = chart.getAttribute("data-common-period") || chart.getAttribute("data-period");
    if (unit) parts.push(L("table.unitPrefix") + unit);
    if (period) parts.push(L("table.periodPrefix") + period);
    return parts.filter(Boolean).join(L("table.separator"));
  }
  function syncBarsTable(chart, entries, parsed) {
    var parts = ensureDatasetWrap(chart);
    if (!parts.btn || !parts.table) return;
    var table = parts.table;
    table.textContent = "";
    var caption = make("caption", null, tableCaptionBase(chart));
    table.appendChild(caption);
    buildTableHead(table, [L("table.head.category", table), L("table.head.value", table), L("table.head.unit", table), L("table.head.period", table)]);
    var tbody = make("tbody");
    var hero = chart.querySelector(".m-main-metric__hero");
    var mainNumber = hero && hero.querySelector(".m-main-metric__number");
    if (mainNumber) {
      var mainLabel = hero.querySelector(".m-main-metric__label");
      var mainUnit = hero.querySelector(".m-main-metric__unit");
      appendRow(tbody, [
        mainLabel && mainLabel.textContent || L("table.mainMetricFallback", tbody),
        datasetReading(mainNumber.textContent),
        mainUnit && mainUnit.textContent || chart.getAttribute("data-common-unit") || "—",
        chart.getAttribute("data-common-period") || chart.getAttribute("data-period") || "—"
      ]);
    }
    entries.forEach(function(entry, index) {
      var value = parsed[index];
      var valueText;
      if (value.state === "missing") valueText = L("table.missingValue");
      else if (value.state === "invalid") valueText = datasetReading(entry.raw, L("table.invalidValue"), false);
      else if (value.state === "zero") valueText = datasetReading(entry.display || entry.raw || "0", L("table.zeroValue"));
      else valueText = datasetReading(entry.display || entry.raw, value.state === "negative" ? L("table.negativeValue") : "");
      appendRow(tbody, [entry.label, valueText, entry.unit || "—", entry.period || "—"]);
    });
    table.appendChild(tbody);
  }
  function syncCirclesTable(chart, items) {
    var parts = ensureDatasetWrap(chart);
    if (!parts.btn || !parts.table) return;
    var table = parts.table;
    table.textContent = "";
    var caption = make("caption", null, tableCaptionBase(chart));
    table.appendChild(caption);
    buildTableHead(table, [L("table.head.category", table), L("table.head.value", table), L("table.head.state", table), L("table.head.unit", table), L("table.head.period", table)]);
    var tbody = make("tbody");
    items.forEach(function(item) {
      var state = item.state === "unavailable" ? "missing" : item.state === "invalid" ? "invalid" : readNumber(item.raw).state;
      var valueText, stateText;
      if (state === "missing") {
        valueText = "—";
        stateText = L("value.missing");
      } else if (state === "invalid") {
        valueText = item.raw || L("value.invalid");
        stateText = L("value.invalid");
      } else {
        valueText = item.display || item.raw;
        stateText = state === "zero" ? L("bars.stateZero") : state === "negative" ? L("bars.stateNegative") : "";
      }
      appendRow(tbody, [
        item.label,
        state === "missing" ? valueText : datasetReading(valueText, "", state !== "invalid"),
        stateText,
        item.unit || "—",
        item.period || "—"
      ]);
    });
    table.appendChild(tbody);
  }
  function fitHero(chart) {
    var hero = chart.querySelector(".m-main-metric__hero");
    if (!hero) return;
    chart.removeAttribute("data-hero-reading");
    if (chart.classList.contains("m-main-metric--flat")) return;
    var bounds = hero.getBoundingClientRect();
    var number = hero.querySelector(".m-main-metric__number");
    var lineHeight = number ? parseFloat(window.getComputedStyle(number).lineHeight) : 0;
    var wrapsNumber = number && lineHeight && number.getBoundingClientRect().height > lineHeight + 1;
    if (bounds.width && (bounds.height > bounds.width + 1 || wrapsNumber)) {
      chart.setAttribute("data-hero-reading", "");
    }
  }
  function barItems(chart) {
    clearDiagnostics(chart);
    var source = chart.querySelector("[data-bar-source]");
    var target = chart.querySelector("[data-bar-items]");
    var status = chart.querySelector("[data-bar-status]");
    if (!source || !target) return;
    var entries = Array.prototype.slice.call(source.querySelectorAll("[data-label]")).map(function(node) {
      return {
        label: node.getAttribute("data-label") || "",
        raw: node.getAttribute("data-value"),
        display: node.getAttribute("data-display-value"),
        unit: node.getAttribute("data-unit") || "",
        period: node.getAttribute("data-period") || "",
        series: seriesOf(node)
      };
    });
    var parsed = entries.map(function(entry) {
      return readNumber(entry.raw);
    });
    var commonUnit = chart.getAttribute("data-common-unit") || "";
    var commonPeriod = chart.getAttribute("data-common-period") || "";
    var consistent = !!commonUnit && !!commonPeriod && entries.every(function(entry) {
      return entry.unit === commonUnit && entry.period === commonPeriod;
    });
    var magnitudeMax = parsed.reduce(function(max2, item) {
      return item.value !== null ? Math.max(max2, Math.abs(item.value)) : max2;
    }, 0);
    var hasKnown = parsed.some(function(item) {
      return item.value !== null;
    });
    var signed = parsed.some(function(item) {
      return item.state === "negative";
    });
    var declaredRaw = chart.getAttribute("data-max");
    var declared = declaredRaw === null ? null : readNumber(declaredRaw);
    var max = null;
    var userText = "";
    if (!entries.length) {
      userText = L("chart.empty");
      writeDiagnostics(chart, "empty", L("bars.emptyDetail", chart));
    } else if (!consistent) {
      userText = L("bars.unitMismatchError");
      writeDiagnostics(
        chart,
        "inconsistent",
        L("bars.unitMismatchDetail")
      );
    } else if (declaredRaw !== null && (!declared || declared.state !== "positive")) {
      userText = L("bars.scaleError");
      writeDiagnostics(
        chart,
        "invalid-scale",
        "metric-bars: data-max='" + declaredRaw + L("bars.scaleInvalidDetail")
      );
    } else if (declared && declared.value < magnitudeMax) {
      userText = L("bars.unfairScaleError");
      writeDiagnostics(
        chart,
        "scale-below-known",
        "metric-bars: data-max=" + declared.value + L("bars.underscaleDetailPrefix") + magnitudeMax + L("bars.underscaleDetailSuffix")
      );
    } else if (declared) {
      max = declared.value;
      userText = L("bars.scaledMessagePrefix", chart) + (chart.getAttribute("data-max-label") || declaredRaw) + " " + commonUnit + " · " + commonPeriod + ".";
      writeDiagnostics(
        chart,
        "ok",
        "metric-bars: scale=declared data-max=" + declared.value + L("bars.scaledDetailUnit") + commonUnit + L("bars.scaledDetailPeriod") + commonPeriod + "."
      );
    } else if (magnitudeMax > 0) {
      max = magnitudeMax;
      userText = L("bars.scaledMessagePrefix") + magnitudeMax + " " + commonUnit + " · " + commonPeriod + ".";
      writeDiagnostics(
        chart,
        "ok",
        "metric-bars: scale=auto-largest-known=" + magnitudeMax + L("bars.scaledDetailUnit") + commonUnit + L("bars.scaledDetailPeriod") + commonPeriod + "."
      );
    } else if (hasKnown) {
      max = 0;
      userText = L("bars.zeroMessage");
      writeDiagnostics(chart, "zero", L("bars.zeroDetail", chart));
    } else {
      userText = L("bars.emptyMessage");
      writeDiagnostics(chart, "empty", L("bars.noValuesDetail", chart));
    }
    if (signed && max !== null) userText += L("bars.zeroLineNote");
    target.textContent = "";
    entries.forEach(function(entry, index) {
      var value = parsed[index];
      var li = make("li", "m-main-metric__row");
      li.setAttribute("data-series", entry.series);
      var head = make("div", "m-main-metric__row-head");
      head.appendChild(make("span", "m-main-metric__row-label", entry.label));
      var display = value.state === "missing" ? "—" : value.state === "invalid" ? L("value.invalid") : (entry.display || entry.raw) + (entry.unit && !entry.display ? " " + entry.unit : "");
      var val = make("span", "m-main-metric__row-value");
      if (chart.classList.contains("m-main-metric--readable")) {
        var number = make("bdi", "", value.state === "missing" ? L("main.missing") : value.state === "invalid" ? entry.raw : entry.display || entry.raw);
        number.dir = value.value === null ? "auto" : "ltr";
        val.appendChild(number);
        if (value.state === "invalid") val.appendChild(make("span", "m-main-metric__reading-state", L("main.invalidSuffix", val)));
        if (entry.unit) {
          val.appendChild(document.createTextNode(" "));
          var unit = make("span", "m-main-metric__reading-unit", entry.unit);
          unit.setAttribute("data-reading-unit", entry.unit);
          val.appendChild(unit);
        }
      } else {
        val.textContent = display;
        val.setAttribute("dir", "ltr");
      }
      head.appendChild(val);
      li.appendChild(head);
      var track = make("span", "m-main-metric__track");
      track.setAttribute("aria-hidden", "true");
      if (signed) track.setAttribute("data-signed", "true");
      var canDraw = max !== null && max > 0 && (value.state === "positive" || value.state === "negative");
      if (canDraw) {
        var bar = make("span", "m-main-metric__bar");
        bar.style.setProperty("--m-bar-width", Math.abs(value.value) / max * (signed ? 50 : 100) + "%");
        bar.setAttribute("data-direction", value.state);
        track.appendChild(bar);
      } else if (max !== null && value.state === "zero") {
        track.setAttribute("data-zero", "true");
      } else {
        track.hidden = true;
        if (value.state === "missing") {
          li.appendChild(make("span", "m-main-metric__state", L("value.missing", li)));
        } else if (value.state === "invalid") {
          li.appendChild(make("span", "m-main-metric__state", L("value.unreadable", li)));
        }
      }
      li.appendChild(track);
      target.appendChild(li);
    });
    if (status) {
      status.textContent = userText;
      status.setAttribute("data-valid", String(max !== null));
    }
    syncBarsTable(chart, entries, parsed);
    if (globalApi("Readings")) globalApi("Readings").sync(chart);
  }
  function initOne(root) {
    disconnected.delete(root);
    if (root.hasAttribute("data-metric-circles") && !(root.__microMetricResizeObserver || root.__microMetricResizeListener)) {
      root.setAttribute("data-metric-ready", "");
      circleItems(root);
      observeResponsive(root);
    }
    if (root.hasAttribute("data-main-comparison") && !(root.__microMetricResizeObserver || root.__microMetricResizeListener)) {
      root.setAttribute("data-bars-ready", "");
      barItems(root);
      fitHero(root);
      observeResponsive(root);
    }
  }
  var disconnected = /* @__PURE__ */ new WeakSet();
  function observeResponsive(root) {
    disconnected.delete(root);
    var target = root.querySelector("[data-metric-items]") || (root.hasAttribute("data-main-comparison") ? root : null);
    if (!target || root.__microMetricResizeObserver || root.__microMetricResizeListener) return;
    root.__microMetricWidth = target.getBoundingClientRect().width;
    if (window.ResizeObserver) {
      var observer = new ResizeObserver(function(entries) {
        if (disconnected.has(root) || root.__microMetricResizeObserver !== observer) return;
        var nextWidth = entries[0] && entries[0].contentRect.width;
        if (typeof nextWidth === "number" && Math.abs(nextWidth - root.__microMetricWidth) > 1) {
          if (root.__microMetricResizeFrame) return;
          root.__microMetricResizeFrame = window.requestAnimationFrame(function() {
            delete root.__microMetricResizeFrame;
            if (!root.isConnected || disconnected.has(root) || root.__microMetricResizeObserver !== observer) return;
            var width = target.getBoundingClientRect().width;
            if (width <= 1 || Math.abs(width - root.__microMetricWidth) <= 1) return;
            root.__microMetricWidth = width;
            if (root.hasAttribute("data-metric-circles")) circleItems(root);
            else fitHero(root);
          });
        }
      });
      root.__microMetricResizeObserver = observer;
      observer.observe(target);
    } else {
      root.__microMetricResizeListener = function() {
        if (disconnected.has(root)) return;
        var nextWidth = target.getBoundingClientRect().width;
        if (Math.abs(nextWidth - root.__microMetricWidth) > 1) {
          root.__microMetricWidth = nextWidth;
          if (root.hasAttribute("data-metric-circles")) circleItems(root);
          else fitHero(root);
        }
      };
      window.addEventListener("resize", root.__microMetricResizeListener);
    }
  }
  function render(root) {
    installFontsHook();
    var scope = root || document;
    if (scope.matches) disconnected.delete(scope);
    if (scope.matches && scope.matches("[data-metric-circles]")) {
      circleItems(scope);
      observeResponsive(scope);
    }
    if (scope.matches && scope.matches("[data-main-comparison]")) {
      barItems(scope);
      fitHero(scope);
      observeResponsive(scope);
    }
    scope.querySelectorAll("[data-metric-circles]").forEach(function(chart) {
      circleItems(chart);
      observeResponsive(chart);
    });
    scope.querySelectorAll("[data-main-comparison]").forEach(function(chart) {
      barItems(chart);
      fitHero(chart);
      observeResponsive(chart);
    });
  }
  var instances = instanceRegistry();
  function init(root, options) {
    var scope = root || document;
    applyInstanceLabels(scope, options);
    var existing = instances.get(scope);
    if (existing) {
      withLabels2(scope, function() {
        installFontsHook();
        if (scope.matches && (scope.matches("[data-metric-circles]") || scope.matches("[data-main-comparison]"))) initOne(scope);
        scope.querySelectorAll("[data-metric-circles], [data-main-comparison]").forEach(initOne);
      });
      return existing;
    }
    installFontsHook();
    var destroyed = false;
    var instance = {
      root: scope,
      /** = render: إعادة التصيير من DOM المصدر تحت الجذر. */
      update: function() {
        withLabels2(scope, function() {
          render(scope);
        });
      },
      /** يفك مستمعات الكشف والرصد — لا يمس قيم المصدر. */
      destroy: function() {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        instances.remove(scope);
      }
    };
    withLabels2(scope, function() {
      installFontsHook();
      if (scope.matches && (scope.matches("[data-metric-circles]") || scope.matches("[data-main-comparison]"))) initOne(scope);
      scope.querySelectorAll("[data-metric-circles], [data-main-comparison]").forEach(initOne);
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
  function disconnect(root) {
    destroy(root);
  }
  function teardown(root) {
    var scope = root || document;
    var selector = "[data-metric-circles], [data-main-comparison]";
    var items = [].slice.call(scope.querySelectorAll(selector));
    if (scope.matches && scope.matches(selector)) items.unshift(scope);
    [].slice.call(scope.querySelectorAll(".m-main-metric__disclose")).forEach(function(btn) {
      var binding = btn.__microDatasetDisclosure;
      if (binding) {
        btn.removeEventListener("click", binding.handler);
        delete btn.__microDatasetDisclosure;
      }
    });
    if (scope.matches && scope.matches(".m-main-metric__disclose") && scope.__microDatasetDisclosure) {
      scope.removeEventListener("click", scope.__microDatasetDisclosure.handler);
      delete scope.__microDatasetDisclosure;
    }
    items.forEach(function(chart) {
      disconnected.add(chart);
      if (chart.__microMetricResizeObserver) chart.__microMetricResizeObserver.disconnect();
      if (chart.__microMetricResizeFrame) window.cancelAnimationFrame(chart.__microMetricResizeFrame);
      delete chart.__microMetricResizeFrame;
      if (chart.__microMetricResizeListener) window.removeEventListener("resize", chart.__microMetricResizeListener);
      delete chart.__microMetricResizeObserver;
      delete chart.__microMetricResizeListener;
      delete chart.__microMetricWidth;
      chart.removeAttribute("data-metric-ready");
      chart.removeAttribute("data-bars-ready");
    });
  }
  function setLabels2(partial) {
    setLabels("metric-comparison", partial);
  }
  var fontsHookInstalled = false;
  function installFontsHook() {
    if (fontsHookInstalled) return;
    fontsHookInstalled = true;
    if (document.fonts) document.fonts.ready.then(function() {
      document.querySelectorAll("[data-metric-circles], [data-main-comparison]").forEach(function(chart) {
        if (!disconnected.has(chart)) render(chart);
      });
    });
  }

  // tools/package/.build-entries/iife/metric-comparison.mjs
  window.MicroMetricComparison = Object.assign({}, metric_comparison_exports);
  (function() {
    function enabled() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false) && !document.querySelector("[data-micro-manual]");
    }
    function start() {
      if (enabled() && typeof window.MicroMetricComparison.init === "function") window.MicroMetricComparison.init();
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  })();
})();
