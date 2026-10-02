/* =========================================================
   Micro UI — تصيير الدوائر المتداخلة (Packed-Circle)
   الملف: components/data/packed-circle.js
   الحالة: **PROPOSED — يحتاج مراجعة واعتماد المالك** — امتداد
   opt-in فوق عقد B05 (m-chart--bubbles) لا يغيّر سلوك
   renderBubbles الافتراضي ولا يلمس data.js إطلاقًا.

   التنشيط (opt-in فقط):
     <div class="m-chart m-chart--bubbles m-chart--packed"
          data-chart-packed data-rmax="64" data-max="100000">
       <ul class="m-chart__data" hidden>
         <li data-series="a" data-label="الإيرادات" data-value="84300"
             data-display="84,300"></li>
         …
       </ul>
       <div class="m-chart__plot" data-plot></div>
       <p class="m-chart__summary" data-summary></p>
     </div>

   العقد والقواعد المستعارة من B05 (لا إعادة بناء):
   - m-bubble / m-bubble__circle(--none) / m-bubble__value / m-bubble__label
   - ألوان الفئات الثابتة بالمفتاح (m-cat--a..e → --cat)
   - نصف القطر = Rmax × √(v / vmax) — المساحة ∝ القيمة، بلا حد
     أدنى يضخّم الدائرة الصغيرة (الصغيرة جدًا قيمتها خارجية).

   القرارات المحددة لهذا الامتداد (موثقة في specification):
   - القيم مستقلة لا نسب: لا نسب مئوية إطلاقًا — الرقم الحقيقي
      (من data-display أو القيمة الخام) يظهر داخل الدائرة إن اتسع،
      وإلا في صف خارجي مقروء مع التسمية؛ المفتاح الكامل (تسمية + قيمة
     خام) مرجع إضافي. التداخل إشارة علاقة بصرية فقط ولا يعني
     عملية حسابية أو تقاطعًا ماليًا أو أجزاء من مجموع.
   - الحجم يعكس القيمة الخام: مساحة الدائرة ∝ القيمة والقطر
     ∝ √القيمة — المقياس (data-max أو أكبر قيمة) توثيق نصي خارج
     الدوائر ولا يتحول إلى نسبة معروضة داخلها.
   - data-legend="off" (اختياري): إخفاء المفتاح النصي تحت الرسم —
     للبطاقات المضغوطة حيث القيم داخل الدوائر والتسميات تحتها؛
     يبقى المفتاح الافتراضي ظاهرًا في بقية الحالات كمرجع قيم خام.
   - data-display (اختياري): نص العرض المُنسّق من المستهلك —
     أساس المساحة يبقى data-value الرقمي دائمًا، ومع القيمة
     السالبة يُعرض مع دلالة الحالة ولا يحل محلها.
   - حالات القيم (نفس لغة B05، بصياغة نصية صريحة):
       موجبة        → دائرة r ∝ √v والرقم داخلها
        صفر          → صف حالة «0 — صفر» منفصل، دون دائرة مصطنعة
       مجهولة       → سمة data-value غائبة كليًا → «— غير معروف»
       غير متاحة    → سمة موجودة غير قابلة للتحليل → «— غير متاح»
       سالبة        → لا دائرة سالبة أبدًا → «-3,566 — سالب غير صالح للمساحة»
   - المقياس data-max (نظير «المقام» لهذا الرسم — بلا لمس منطق
     donut في data.js وبدون تناقض مع C2):
       غائب         → البديل الموثق: أكبر قيمة موجبة (كما في B05)
       موجب صالح    → أساس النسبة
       صفر مع قيم موجبة → تعارض صريح (لا استبدال صامت بالمجموع)
       سالب         → غير صالح صريح (لا تطبيع)
       غير رقمي/∞   → غير صالح صريح
     الحالة غير الصالحة: رسالة م-تشError ظاهرة + مفتاح بقيم خام،
     ولا تُرسم دائرة واحدة.
   - لا عشوائية ولا حساب مالي: صافي الربح وغيره نصوص وأرقام
     ثابتة من HTML المستهلك — هذا المكوّن لا يحسب شيئًا.
   ========================================================= */

(function () {
  'use strict';

  var NUM_RE = /^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/;
  var observers = new WeakMap();

  /* ترتيب حتمي: دائرة رئيسية وبجوارها دائرتان متدرجتان رأسيًا.
     كل مجموعة من ثلاث مستقلة؛ لا عشوائية أو مساحات مالية مشتقة.
     المقياس يتقلص موحدًا عند ضيق العمود، فلا يتغير تناسب المساحات. */
  function layoutPacked(chart, nodes, wrap) {
    var available = wrap.clientWidth || chart.clientWidth;
    if (!available || !nodes.length) return;
    var requested = parseNum(getComputedStyle(chart).getPropertyValue('--packed-overlap'));
    requested = requested === null ? 12 : Math.max(0, requested);
    var gap = parseFloat(getComputedStyle(chart).getPropertyValue('--micro-space-4')) || 16;
    var groups = [];
    for (var i = 0; i < nodes.length; i += 3) groups.push(nodes.slice(i, i + 3));
    var widest = Math.max.apply(null, groups.map(function (g) {
      return g[0].diameter + (g[1] ? Math.max(g[1].diameter, g[2] ? g[2].diameter : 0) : 0);
    }));
    var factor = Math.min(1, available / widest);
    nodes.forEach(function (n) {
      n.d = n.diameter * factor;
      n.circ.style.width = n.circ.style.height = n.d + 'px';
      /* قياس النص الطبيعي، لا عرضًا مصغّرًا أو حدًا أدنى للدائرة. */
      n.circ.appendChild(n.value);
      var previous = n.value.style.whiteSpace;
      n.value.style.whiteSpace = 'nowrap';
      var t = n.value.getBoundingClientRect();
      n.textDiagonal = Math.hypot(t.width, t.height);
      n.inside = n.textDiagonal + 8 <= n.d;
      n.value.style.whiteSpace = previous;
      n.bubble.setAttribute('data-value-placement', n.inside ? 'inside' : 'outside');
      if (!n.inside) n.row.appendChild(n.value);
      n.row.setAttribute('data-external-value', n.inside ? 'false' : 'true');
    });
    function overlap(a, b) {
      var cap = Math.min(requested, Math.min(a.d, b.d) * 0.25);
      [a, b].forEach(function (n) {
        if (n.inside) cap = Math.min(cap, Math.max(0, (n.d - n.textDiagonal) / 2 - 2));
      });
      return Math.max(0, cap);
    }
    var top = 0;
    groups.forEach(function (g) {
      var main = g[0], a = g[1], b = g[2];
      var verticalOverlap = a && b ? overlap(a, b) : 0;
      var stackHeight = a ? a.d + (b ? b.d - verticalOverlap : 0) : 0;
      var height = Math.max(main.d, stackHeight);
      var sideOverlap = a ? Math.min(overlap(main, a), b ? overlap(main, b) : Infinity) : 0;
      var width = main.d + (a ? Math.max(a.d, b ? b.d : 0) - sideOverlap : 0);
      var start = (available - width) / 2;
      function position(n, x, y) {
        n.bubble.style.insetInlineStart = x + 'px';
        n.bubble.style.top = (top + y) + 'px';
        n.bubble.style.width = n.bubble.style.height = n.d + 'px';
      }
      position(main, start, (height - main.d) / 2);
      if (a) position(a, start + main.d - sideOverlap, (height - stackHeight) / 2);
      if (b) position(b, start + main.d - sideOverlap, (height - stackHeight) / 2 + a.d - verticalOverlap);
      top += height + gap;
    });
    wrap.style.height = Math.max(0, top - gap) + 'px';
  }

  function stateList(items) {
    var list = document.createElement('ul');
    list.className = 'm-packed__states m-legend';
    list.setAttribute('aria-label', 'حالات لا تدخل الرسم المساحي');
    items.forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'm-legend__item m-cat--' + it.series;
      var label = document.createElement('span');
      label.textContent = it.label;
      var value = document.createElement('bdi');
      value.className = 'm-legend__value';
      value.textContent = it.value === 0 ? '0 — صفر' : stateText(it).text;
      li.appendChild(label);
      li.appendChild(value);
      list.appendChild(li);
    });
    return list;
  }

  function parseNum(raw) {
    if (raw === null || raw === undefined) return null;
    var s = String(raw).trim();
    if (s === '' || !NUM_RE.test(s)) return null;
    var v = Number(s);
    return (isNaN(v) || !isFinite(v)) ? null : v;
  }

  function itemsOf(chart) {
    return [].slice.call(chart.querySelectorAll('.m-chart__data [data-series]')).map(function (li) {
      /* التمييز المطلوب لهذا الامتداد: غائبة (مجهول) ≠ موجودة غير قابلة للتحليل (غير متاح) */
      var hasAttr = li.hasAttribute('data-value');
      return {
        series: li.getAttribute('data-series') || 'a',
        label: li.getAttribute('data-label') || '',
        hasAttr: hasAttr,
        value: hasAttr ? parseNum(li.getAttribute('data-value')) : null,
        display: li.getAttribute('data-display') || ''
      };
    });
  }

  /* مفاتيح الحالة — نصوص صريحة لا لون وحده (فرق المجهول عن غير المتاح محفوظ نصيًا).
     إصلاح PR#5: القيمة السالبة مع data-display تحافظ على الرقم المنسق
     بعلامته ومعها دلالة الحالة دائمًا — لا تختفي الدلالة بسبب التنسيق:
     «-3,566 — سالب غير صالح للمساحة». وللقيم الموجبة بلا تغيير:
     data-display نص العرض كما هو. */
  function stateText(it) {
    if (!it.hasAttr) return { text: '— غير معروف', none: true };
    if (it.value === null) return { text: '— غير متاح', none: true };
    if (it.value < 0) {
      var num = it.display || String(it.value);
      return { text: num + ' — سالب غير صالح للمساحة', none: true };
    }
    if (it.value === 0) return { text: '0', none: true };
    return { text: it.display || String(it.value), none: false };
  }

  function scaleError(chart, positiveExists, vmaxDerived) {
    var raw = chart.getAttribute('data-max');
    var plot = chart.querySelector('[data-plot]');
    var err = document.createElement('p');
    err.className = 'm-chart__scale-error';
    var base = 'تعذر رسم المقارنة: المقياس المعلن data-max="' + raw + '" ';
    if (parseNum(raw) === 0) {
      err.textContent = base + 'صفر' + (positiveExists
        ? ' بينما توجد قيم موجبة — تعارض في البيانات: لا مقارنة مساحية من مقياس صفر ولا استبدال تلقائي للمقياس. صحّح data-max أو القيم. القيم معروضة في المفتاح دون رسم.'
        : '— لا توجد قيم موجبة للمقارنة. القيم معروضة في المفتاح.');
    } else {
      err.textContent = base + 'غير صالح (سالب أو غير رقمي) — المقياس السالب/غير الرقمي غير صالح للمقارنة المساحية. صحّح القيمة أو احذف السمة. القيم معروضة في المفتاح دون رسم.';
    }
    plot.innerHTML = '';
    plot.appendChild(err);
    if (!positiveExists) {
      var empty = document.createElement('p');
      empty.className = 'm-packed__empty';
      empty.setAttribute('data-empty', '');
      empty.textContent = 'لا توجد قيم موجبة قابلة للرسم المساحي.';
      plot.appendChild(empty);
      var states = stateList(itemsOf(chart));
      if (states.children.length) plot.appendChild(states);
    } else {
      renderKeyOnly(chart);
    }
    chart.dispatchEvent(new CustomEvent('micro-packed:rendered', {
      bubbles: true, detail: { ok: false, reason: 'scale-invalid', vmaxDerived: vmaxDerived || null }
    }));
  }

  function renderKeyOnly(chart) {
    var plot = chart.querySelector('[data-plot]');
    var legend = document.createElement('ul');
    legend.className = 'm-legend';
    itemsOf(chart).forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'm-legend__item m-cat--' + it.series;
      var sw = document.createElement('span');
      sw.className = 'm-legend__swatch';
      li.appendChild(sw);
      li.appendChild(document.createTextNode(it.label + ' '));
      var val = document.createElement('span');
      val.className = 'm-legend__value';
      val.textContent = stateText(it).text;
      li.appendChild(val);
      legend.appendChild(li);
    });
    plot.appendChild(legend);
  }

  function render(chart) {
    if (observers.has(chart)) observers.get(chart).disconnect();
    var plot = chart.querySelector('[data-plot]');
    var items = itemsOf(chart);
    var positives = items.filter(function (i) { return i.value !== null && i.value > 0; });
    var rmaxAttr = parseNum(chart.getAttribute('data-rmax'));
    var Rmax = (rmaxAttr !== null && rmaxAttr > 0) ? rmaxAttr : 52; /* نفس افتراضي B05 */

    /* المقياس المعلن يُحكَم بقيمته الفعلية — لا سقوط صامت (اتساق مع دلالة C2) */
    var maxAttr = chart.getAttribute('data-max');
    var hasMaxAttr = maxAttr !== null && String(maxAttr).trim() !== '';
    var declaredMax = hasMaxAttr ? parseNum(maxAttr) : null;
    var vmax;
    var derived = positives.length
      ? Math.max.apply(null, positives.map(function (i) { return i.value; }))
      : 0;
    if (!hasMaxAttr) {
      vmax = derived > 0 ? derived : 1; /* الغائب: البديل الموثق */
    } else if (declaredMax === null || declaredMax < 0) {
      scaleError(chart, positives.length > 0, derived); /* سالب/غير رقمي: صريح */
      return;
    } else if (declaredMax === 0) {
      if (positives.length > 0) { scaleError(chart, true, derived); return; } /* تعارض صريح */
      vmax = 1; /* صفر مع لا موجبين: لا رسم مساحي أصلًا — الحالات النصية تكفي */
    } else {
      vmax = declaredMax;
    }

    plot.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'm-bubbles';
    var labels = document.createElement('ul');
    labels.className = 'm-packed__labels';
    var nodes = [];
    var order = positives.slice().sort(function (a, b) { return b.value - a.value; });
    order.forEach(function (it) {
      var b = document.createElement('div');
      b.className = 'm-bubble m-cat--' + it.series;
      var circ = document.createElement('span');
      var valTxt = document.createElement('span');
      valTxt.className = 'm-bubble__value';
      var lab = document.createElement('span');
      lab.className = 'm-bubble__label';
      lab.textContent = it.label;
      var r = Rmax * Math.sqrt(it.value / vmax);
      circ.className = 'm-bubble__circle';
      circ.style.width = circ.style.height = (r * 2) + 'px';
      b.setAttribute('data-size', r >= Rmax * 0.7 ? 'large' : 'small');
      valTxt.textContent = stateText(it).text;
      circ.appendChild(valTxt);
      b.appendChild(circ);
      wrap.appendChild(b);
      var row = document.createElement('li');
      row.className = 'm-packed__value-row m-cat--' + it.series;
      var swatch = document.createElement('span');
      swatch.className = 'm-legend__swatch';
      swatch.setAttribute('aria-hidden', 'true');
      row.appendChild(swatch);
      row.appendChild(lab);
      labels.appendChild(row);
      nodes.push({ bubble: b, circ: circ, value: valTxt, row: row, diameter: r * 2 });
    });

    if (positives.length) {
      plot.appendChild(wrap);
      plot.appendChild(labels);
      layoutPacked(chart, nodes, wrap);
      if (window.ResizeObserver) {
        var observer = new ResizeObserver(function () { layoutPacked(chart, nodes, wrap); });
        observer.observe(chart);
        nodes.forEach(function (n) { observer.observe(n.value); });
        observers.set(chart, observer);
      }
      if (document.fonts) document.fonts.ready.then(function () {
        if (plot.contains(wrap)) layoutPacked(chart, nodes, wrap);
      });
    } else {
      var empty = document.createElement('p');
      empty.className = 'm-packed__empty';
      empty.setAttribute('data-empty', '');
      empty.textContent = 'لا توجد قيم موجبة قابلة للرسم المساحي.';
      plot.appendChild(empty);
    }
    var special = items.filter(function (it) { return stateText(it).none; });
    if (special.length) plot.appendChild(stateList(special));

    /* مفتاح نصي كامل بالترتيب المعلن للمستهلك — المرجع الدقيق (بلا نسب).
      يستثنى عند data-legend="off" (البطاقات المضغوطة) — قيمة موثقة أعلاه */
    if (positives.length && chart.getAttribute('data-legend') !== 'off') {
    var legend = document.createElement('ul');
    legend.className = 'm-legend';
    positives.forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'm-legend__item m-cat--' + it.series;
      var sw = document.createElement('span');
      sw.className = 'm-legend__swatch';
      li.appendChild(sw);
      li.appendChild(document.createTextNode(it.label + ' '));
      var val = document.createElement('span');
      val.className = 'm-legend__value';
      val.textContent = stateText(it).text;
      li.appendChild(val);
      legend.appendChild(li);
    });
    plot.appendChild(legend);
    }

    if (chart.hasAttribute('data-summary-text')) {
      var summary = chart.querySelector('[data-summary]');
      if (summary && !summary.textContent) summary.textContent = chart.getAttribute('data-summary-text');
    }

    chart.dispatchEvent(new CustomEvent('micro-packed:rendered', {
      bubbles: true, detail: { ok: true, vmaxDerived: !hasMaxAttr }
    }));
  }

  window.MicroPacked = {
    init: function (root) {
      (root || document).querySelectorAll('[data-chart-packed]').forEach(render);
    },
    render: render
  };

  document.addEventListener('DOMContentLoaded', function () { window.MicroPacked.init(); });
  if (document.readyState !== 'loading') window.MicroPacked.init();
})();
