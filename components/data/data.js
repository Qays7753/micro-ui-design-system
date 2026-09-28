/* =========================================================
   Micro UI — سلوك مكوّن البيانات والتتبّع (B05)
   الملف: components/data/data.js
   الدور: تصيير الرسوم من بيانات المستهلك المعلنة في HTML
   (مصدر واحد قابل للتعديل) — لا مكتبات خارجية ولا منطق مالي،
   ولا عشوائية. القيم والتسميات تُعرض دائمًا (لا hover إلزاميًا).

   بنية البيانات لكل رسم (داخل .m-chart):
   <ul class="m-chart__data" hidden>
     <li data-series="a" data-label="مبيعات" data-value="4.5"></li>
     <li data-series="b" data-label="مشتريات" data-value="0"></li>   ← صفر يُعرض
     <li data-series="c" data-label="مرتجعات" data-value=""></li>    ← ناقص/مجهول
     <li data-series="d" data-label="خارج النطاق" data-value="12" data-outlier></li>
   </ul>
   <div class="m-chart__plot" data-plot></div>
   <p class="m-chart__summary" data-summary></p>

   مدخلات موحدة (E06 + R2-05): تحليل رقم كامل لا بادئة رقمية —
   `12oops` ليس 12 بل قيمة غير صالحة (مجهول)، والفارغ/غير الرقمي/
   NaN/∞ كلها null (مجهول) — لا استيفاء ولا تخمين صامت.

   R2-05 تمييز الحالات في donut (ولا استنتاج قيمة عمل جديدة):
   - لا قيمة صالحة إطلاقًا (كل الفئات مجهولة أو لا فئات): مركز «—»
     وتسمية «لا توجد بيانات» — لا يُعرض صفر، فعدم التوفر ليس 0.
   - قيم معلومة كلها صفر (بلا مجهول): حالة صفرية صادقة (0 هو القيمة).
   - خلط مجهول/صفر والمجموع صفر: الإجمالي غير معلوم (—) — لا دعوى
     بإجمالي صفر بينما فئات مجهولة.
   - المقام data-total: غائب → مجموع الفئات المعروفة (بديل موثق)،
     موجود غير صالح («bad» أو ∞) → رسالة خطأ صريحة لا سقوط صامت.

   - bars:  ارتفاع ∝ القيمة على max معلن (data-max) — صفر يظهر على الأساس.
            السالب غير مدعوم في الأعمدة: يُعرض بوضوح كقيمة غير مرسومة
            (شرطة + نص القيمة والسبب) — لا يُرسم كموجب أبدًا.
   - line:  نقاط بترتيب المستهلك — المحور الزمني باتجاهه المعلن
            (data-axis-dir="rtl|ltr" افتراضي rtl: الأقدم يمين) — لا قلب آلي.
            القيمة المفقودة تقطع الخط فعليًا (شرائح منفصلة — لا وصلة
            صامتة عبر الفجوة)، والمجهول بعلامة «—».
   - donut: نسب بمقام معلن (data-total) — التوزيع من الفئات المعلنة فقط.
            مقام صفر أو مجموع فئات صفر: حالة صفرية واضحة (لا قسمة على صفر
            ولا dasharray NaN). مجموع الفئات أكبر من المقام أو قيم سالبة:
            fallback صريح — رسالة خطأ ظاهرة ومفتاح بقيم خام بلا نسب
            متداخلة ولا تطبيع صامت.
   - bubbles: نصف القطر √(القيمة/الأقصى) × الأقصى — بلا حد أدنى يضخّم
            مساحة الصغيرة (النسبة تبقى صادقة)؛ الصغيرة قيمتها بتسمية
            خارجية. لا دائرة سالبة (السالب/الصفر/الناقص حلقة شرطة).
   ========================================================= */

(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* R2-05: تحليل رقم كامل لا بادئة رقمية — `12oops` غير صالح وليس 12،
     والفارغ/غير الرقمي/NaN/∞ كلها null (مجهول). */
  var NUM_RE = /^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/;
  function parseNum(raw) {
    if (raw === null || raw === undefined) return null;
    var s = String(raw).trim();
    if (s === '' || !NUM_RE.test(s)) return null;
    var v = Number(s);
    return (isNaN(v) || !isFinite(v)) ? null : v;
  }

  function itemsOf(chart) {
    return [].slice.call(chart.querySelectorAll('.m-chart__data [data-series]')).map(function (li) {
      var raw = li.getAttribute('data-value');
      /* E06/R2-05: توحيد null — الفارغ وغير الرقمي وNaN وغير المحدود كلها مجهول */
      var v = parseNum(raw);
      return {
        series: li.getAttribute('data-series') || 'a',
        label: li.getAttribute('data-label') || '',
        value: v,
        outlier: li.hasAttribute('data-outlier')
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

  /* لفّ التسميات الطويلة داخل SVG (E07): أسطر بحد أحرف — لا تداخل */
  function wrapLabel(text, maxChars) {
    text = String(text || '');
    if (text.length <= maxChars) return [text];
    var words = text.split(' ');
    var lines = [], cur = '';
    words.forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (t.length <= maxChars || !cur) cur = t;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function appendWrappedLabel(svg, g, text, cx, yBottom, maxChars, cls) {
    var lines = wrapLabel(text, maxChars);
    lines.forEach(function (ln, k) {
      var t = svgEl('text', {
        class: cls, x: cx,
        y: yBottom - (lines.length - 1 - k) * 13,
        'text-anchor': 'middle'
      });
      t.textContent = ln;
      g.appendChild(t);
    });
    return lines.length;
  }

  /* قيمة سالبة في رسم لا يدعم السالب: عرض صادق — شرطة + نص القيمة والسبب */
  function invalidMarker(svg, g, cx, base, value, why) {
    var r = svgEl('rect', {
      class: 'm-chart__bar-unknown', x: cx - 14, y: base - 10, width: 28, height: 10, rx: 4,
      stroke: 'var(--micro-warning)'
    });
    g.appendChild(r);
    var t = svgEl('text', {
      class: 'm-chart__bar-value', x: cx, y: base - 16, 'text-anchor': 'middle',
      fill: 'var(--micro-warning)'
    });
    t.textContent = fmt(value) + ' — ' + why;
    g.appendChild(t);
  }

  /* ---- الأعمدة ---- */
  function renderBars(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var maxAttr = parseNum(chart.getAttribute('data-max')); /* R2-05: كامل لا بادئة */
    var max = (maxAttr !== null && maxAttr > 0) ? maxAttr : Math.max.apply(null,
      items.map(function (i) { return i.value || 0; }).concat([1]));
    var labelChars = Math.max(6, Math.floor((320 / Math.max(items.length, 1)) * 0.9 / 6.2));
    var maxLines = Math.max.apply(null, items.map(function (i) {
      return wrapLabel(i.label, labelChars).length;
    }).concat([1]));
    var extra = (maxLines - 1) * 13;
    var W = 320, H = 180 + extra, base = H - 34 - extra, top = 26;
    var colW = W / Math.max(items.length, 1);
    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': chart.getAttribute('data-title') || 'رسم أعمدة' });
    svg.appendChild(svgEl('line', { class: 'm-chart__baseline', x1: 0, y1: base, x2: W, y2: base }));
    items.forEach(function (it, i) {
      var cx = colW * i + colW / 2;
      var g = svgEl('g', { class: 'm-cat--' + it.series });
      if (it.value === null) {
        /* ناقص/مجهول: مستطيل شرطة قصير فوق الأساس + تسمية «—» */
        g.appendChild(svgEl('rect', { class: 'm-chart__bar-unknown', x: cx - 14, y: base - 10, width: 28, height: 10, rx: 4 }));
        var u = svgEl('text', { class: 'm-chart__bar-value', x: cx, y: base - 16, 'text-anchor': 'middle' });
        u.textContent = '—'; g.appendChild(u);
      } else if (it.value < 0) {
        /* E06: سالب في الأعمدة — رفض بوضوح، لا رسم كموجب */
        invalidMarker(svg, g, cx, base, it.value, 'سالب غير مرسوم');
      } else {
        var h = Math.min(it.value, max) / max * (base - top); /* صفر = صفر حقيقي */
        g.appendChild(svgEl('rect', {
          x: cx - Math.min(colW * 0.28, 26), y: base - h,
          width: Math.min(colW * 0.56, 52), height: h, rx: 6,
          fill: it.value === 0 ? 'none' : 'var(--micro-data-' + it.series + ')',
          stroke: it.value === 0 ? 'var(--micro-text-hint)' : 'none',
          'stroke-width': it.value === 0 ? 1 : 0
        }));
        var val = svgEl('text', { class: 'm-chart__bar-value', x: cx, y: base - h - 6, 'text-anchor': 'middle' });
        val.textContent = fmt(it.value); g.appendChild(val);
        if (it.outlier) {
          var o = svgEl('text', { x: cx, y: base - h - 20, 'text-anchor': 'middle', class: 'm-chart__bar-value', fill: 'var(--micro-warning)' });
          o.textContent = 'قيمة شاذة'; g.appendChild(o);
        }
      }
      appendWrappedLabel(svg, g, it.label, cx, H - 12, labelChars, 'm-chart__bar-label');
      svg.appendChild(g);
    });
    plot.innerHTML = '';
    plot.appendChild(svg);
  }

  /* ---- الخط ---- */
  function renderLine(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var rtl = (chart.getAttribute('data-axis-dir') || 'rtl') !== 'ltr';
    var vals = items.map(function (i) { return i.value; });
    var maxAttr = parseNum(chart.getAttribute('data-max')); /* R2-05: كامل لا بادئة */
    var max = (maxAttr !== null && maxAttr > 0) ? maxAttr : Math.max.apply(null, vals.filter(function (v) { return v !== null && v >= 0; }).concat([1]));
    var n = Math.max(items.length, 2);
    var labelChars = Math.max(5, Math.floor(((320 - 48) / n) / 6.2));
    var maxLines = Math.max.apply(null, items.map(function (i) {
      return wrapLabel(i.label, labelChars).length;
    }).concat([1]));
    var extra = (maxLines - 1) * 12;
    var W = 320, H = 170 + extra, base = H - 30 - extra, top = 24;
    function xAt(i) { var t = i / (n - 1); return rtl ? W - 24 - t * (W - 48) : 24 + t * (W - 48); }
    function yAt(v) { return v === null ? null : base - (v / max) * (base - top); }
    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': chart.getAttribute('data-title') || 'رسم خط' });
    svg.appendChild(svgEl('line', { class: 'm-chart__axis', x1: 12, y1: base, x2: W - 12, y2: base }));
    /* E06: القيمة المفقودة تقطع الخط — شرائح منفصلة، لا وصلة عبر الفجوة */
    var seg = [];
    var segments = [];
    items.forEach(function (it, i) {
      if (it.value === null || it.value < 0) {
        if (seg.length > 1) segments.push(seg);
        seg = [];
      } else {
        seg.push([xAt(i), yAt(it.value)]);
      }
    });
    if (seg.length > 1) segments.push(seg);
    segments.forEach(function (pts) {
      svg.appendChild(svgEl('polyline', { class: 'm-chart__line', points: pts.map(function (p) { return p.join(','); }).join(' ') }));
    });
    items.forEach(function (it, i) {
      var x = xAt(i), y = yAt(it.value);
      var g = svgEl('g', { class: 'm-cat--' + it.series });
      if (y === null) {
        var u = svgEl('text', { class: 'm-chart__point-value', x: x, y: base - 6, 'text-anchor': 'middle', fill: 'var(--micro-text-hint)' });
        u.textContent = '—'; g.appendChild(u);
      } else if (it.value < 0) {
        invalidMarker(svg, g, x, base, it.value, 'سالب غير مرسوم');
      } else {
        g.appendChild(svgEl('circle', { class: 'm-chart__dot', cx: x, cy: y, r: 4.5 }));
        var val = svgEl('text', { class: 'm-chart__point-value', x: x, y: y - 10, 'text-anchor': 'middle' });
        val.textContent = fmt(it.value); g.appendChild(val);
      }
      appendWrappedLabel(svg, g, it.label, x, H - 8, labelChars, 'm-chart__x-label');
      svg.appendChild(g);
    });
    plot.innerHTML = '';
    plot.appendChild(svg);
  }

  /* ---- التوزيع الدائري (نسب بمقام معلن) ----
     R2-05: فارق صريح بين «لا قيمة صالحة» و«قيم معلومة كلها صفر»،
     وبين مقام غائب (بديل موثق) ومقام موجود غير صالح (خطأ معلن). */
  function renderDonut(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var declaredRaw = chart.getAttribute('data-total');
    var hasDeclaredAttr = declaredRaw !== null && String(declaredRaw).trim() !== '';
    var declared = hasDeclaredAttr ? parseNum(declaredRaw) : null; /* كامل لا بادئة */
    var declaredInvalid = hasDeclaredAttr && declared === null; /* موجود غير رقمي/غير محدود */
    var hasDeclared = declared !== null && declared > 0; /* مقام صالح قابل للاستخدام */
    var total = hasDeclared ? declared : 0;
    var known = items.filter(function (i) { return i.value !== null && i.value >= 0; });
    var invalid = items.filter(function (i) { return i.value !== null && i.value < 0; });
    var missing = items.filter(function (i) { return i.value === null; });
    var sum = known.reduce(function (a, i) { return a + i.value; }, 0);
    var R = 58, C = 2 * Math.PI * R, cx = 74, cy = 74;

    var svg = svgEl('svg', { class: 'm-donut__svg', viewBox: '0 0 148 148', role: 'img', 'aria-label': chart.getAttribute('data-title') || 'توزيع' });
    plot.innerHTML = '';

    /* حالات المدخلات غير القابلة للنسب — fallback صريح لا تمثيل مضلل */
    var sumExceeds = hasDeclared && sum > total;
    var hasInvalid = invalid.length > 0;
    var noData = known.length === 0 && invalid.length === 0; /* لا قيمة صالحة إطلاقًا (R2-05) */
    var unknownTotal = known.length > 0 && sum <= 0 && missing.length > 0; /* صفر مع مجهول: الإجمالي غير معلوم (R2-05) */
    var zeroCase = known.length > 0 && sum <= 0 && missing.length === 0; /* كل المعلوم صفر — صادقة */

    function emptyRing(centerText, labelText) {
      svg.appendChild(svgEl('circle', {
        cx: cx, cy: cy, r: R, fill: 'none',
        stroke: 'var(--micro-border-divider)', 'stroke-width': 22
      }));
      var c = svgEl('text', { class: 'm-donut__center', x: cx, y: cy + 2, 'text-anchor': 'middle' });
      c.textContent = centerText;
      svg.appendChild(c);
      var l = svgEl('text', { class: 'm-donut__center-label', x: cx, y: cy + 20, 'text-anchor': 'middle' });
      l.textContent = labelText;
      svg.appendChild(l);
      plot.appendChild(svg);
    }

    if (declaredInvalid) {
      /* R2-05: مقام موجود غير صالح — خطأ معلن لا سقوط صامت إلى مجموع الفئات */
      var derr = document.createElement('p');
      derr.className = 'm-chart__error';
      derr.textContent = 'تعذر رسم التوزيع: المقام المعلن غير صالح (data-total="' + declaredRaw + '") — صحّح القيمة أو احذف السمة. القيم معروضة في المفتاح دون نسب.';
      plot.appendChild(derr);
    } else if (sumExceeds || hasInvalid) {
      var err = document.createElement('p');
      err.className = 'm-chart__error';
      err.textContent = hasInvalid
        ? 'تعذر رسم التوزيع: توجد قيم سالبة — التوزيع نسب من قيم غير سالبة فقط. القيم معروضة في المفتاح دون نسب.'
        : 'تعذر رسم التوزيع: مجموع الفئات (' + fmt(sum) + ') أكبر من المقام المعلن (' + fmt(total) + ') — صحّح data-total أو القيم. القيم معروضة في المفتاح دون نسب.';
      plot.appendChild(err);
    } else if (noData) {
      /* R2-05: عدم توفر البيانات ليس صفرًا — «— / لا توجد بيانات» */
      emptyRing('—', 'لا توجد بيانات');
    } else if (unknownTotal) {
      /* R2-05: خلط مجهول/صفر والمجموع صفر — لا دعوى بإجمالي صفر */
      emptyRing('—', 'الإجمالي غير معلوم');
    } else if (zeroCase) {
      /* كل القيم المعلومة صفرية بلا مجهول — الصفر هنا صادق؛
         مع مقام معلن صالح يظهر هو نفسه (شرائح كلها صفرية) */
      emptyRing(hasDeclared ? fmt(total) : '0', chart.getAttribute('data-total-label') || 'الإجمالي');
    } else {
      var denom = hasDeclared ? total : sum; /* بلا مقام معلن: مجموع الفئات المعروفة — موثق */
      var offset = 0;
      known.forEach(function (it) {
        var frac = it.value / denom;
        var len = frac * C;
        var segC = svgEl('circle', {
          cx: cx, cy: cy, r: R, fill: 'none',
          stroke: 'var(--micro-data-' + it.series + ')',
          'stroke-width': 22,
          'stroke-dasharray': len + ' ' + (C - len),
          'stroke-dashoffset': -offset,
          transform: 'rotate(-90 ' + cx + ' ' + cy + ')'
        });
        svg.appendChild(segC);
        offset += len;
      });
      var center = svgEl('text', { class: 'm-donut__center', x: cx, y: cy + 2, 'text-anchor': 'middle' });
      center.textContent = fmt(denom);
      svg.appendChild(center);
      var clab = svgEl('text', { class: 'm-donut__center-label', x: cx, y: cy + 20, 'text-anchor': 'middle' });
      /* مع فئات مجهولة وبلا مقام معلن: لا نسمّي المجموع إجماليًا كاملًا (R2-05) */
      clab.textContent = chart.getAttribute('data-total-label')
        || (missing.length && !hasDeclared ? 'مجموع المعلوم' : 'الإجمالي');
      svg.appendChild(clab);
      plot.appendChild(svg);
    }

    /* مفتاح بقيم كاملة — عقد DOM وtextContent دائمًا (لا innerHTML:
       تسمية المستهلك تعرض كنص حرفي) */
    var noPercent = declaredInvalid || sumExceeds || hasInvalid || noData || unknownTotal || zeroCase;
    var legend = document.createElement('ul');
    legend.className = 'm-legend';
    known.forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'm-legend__item m-cat--' + it.series;
      var sw = document.createElement('span');
      sw.className = 'm-legend__swatch';
      li.appendChild(sw);
      li.appendChild(document.createTextNode(it.label + ' '));
      var val = document.createElement('span');
      val.className = 'm-legend__value';
      val.textContent = fmt(it.value) + (noPercent
        ? ''
        : ' (' + Math.round(it.value / (hasDeclared ? total : sum) * 100) + '%)');
      li.appendChild(val);
      legend.appendChild(li);
    });
    missing.concat(invalid).forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'm-legend__item';
      li.appendChild(document.createTextNode(it.label + ' '));
      var val = document.createElement('span');
      val.className = 'm-legend__value';
      val.textContent = it.value === null ? '— غير متاح' : fmt(it.value) + ' — غير صالح للنسب';
      li.appendChild(val);
      legend.appendChild(li);
    });
    plot.appendChild(legend);
  }

  /* ---- دوائر المساحة: المساحة ∝ القيمة (نصف القطر √) ---- */
  function renderBubbles(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var rmaxAttr = parseNum(chart.getAttribute('data-rmax')); /* R2-05: كامل لا بادئة */
    var Rmax = (rmaxAttr !== null && rmaxAttr > 0) ? rmaxAttr : 52;
    var positive = items.filter(function (i) { return i.value !== null && i.value > 0; });
    var vmaxAttr = parseNum(chart.getAttribute('data-max'));
    var vmax = (vmaxAttr !== null && vmaxAttr > 0) ? vmaxAttr :
      Math.max.apply(null, positive.map(function (i) { return i.value; }).concat([1]));
    var wrap = document.createElement('div');
    wrap.className = 'm-bubbles';
    items.forEach(function (it) {
      var b = document.createElement('div');
      b.className = 'm-bubble m-cat--' + it.series;
      var circ = document.createElement('span');
      var valTxt = document.createElement('span');
      valTxt.className = 'm-bubble__value';
      var lab = document.createElement('span');
      lab.className = 'm-bubble__label';
      lab.textContent = it.label;
      if (it.value === null) {
        circ.className = 'm-bubble__circle--none';
        valTxt.textContent = '— غير متاح';
      } else if (it.value < 0) {
        circ.className = 'm-bubble__circle--none';
        valTxt.textContent = fmt(it.value) + ' (سالب غير صالح للمساحة)';
      } else if (it.value === 0) {
        circ.className = 'm-bubble__circle--none';
        valTxt.textContent = '0';
      } else {
        var r = Rmax * Math.sqrt(it.value / vmax);
        circ.className = 'm-bubble__circle';
        /* E06: بلا حد أدنى — القطر 2r حرفيًا والنسبة تبقى صادقة؛
           الصغيرة جدًا قيمتها بتسمية خارجية ظاهرة دائمًا */
        circ.style.width = circ.style.height = (r * 2) + 'px';
        valTxt.textContent = fmt(it.value);
      }
      b.appendChild(valTxt);
      b.appendChild(circ);
      b.appendChild(lab);
      wrap.appendChild(b);
    });
    plot.innerHTML = '';
    plot.appendChild(wrap);
  }

  function render(chart) {
    var kind = chart.getAttribute('data-chart');
    var items = itemsOf(chart);
    var summary = chart.querySelector('[data-summary]');
    if (kind === 'bars') renderBars(chart, items);
    else if (kind === 'line') renderLine(chart, items);
    else if (kind === 'donut') renderDonut(chart, items);
    else if (kind === 'bubbles') renderBubbles(chart, items);
    if (summary && !summary.textContent && chart.getAttribute('data-summary-text')) {
      summary.textContent = chart.getAttribute('data-summary-text');
    }
    chart.dispatchEvent(new CustomEvent('micro-data:rendered', { bubbles: true, detail: { kind: kind } }));
  }

  window.MicroData = {
    init: function (root) {
      (root || document).querySelectorAll('[data-chart]').forEach(function (c) {
        render(c);
      });
    },
    /* إعادة تصيير رسم واحد بعد تعديل بيانات المصدر (يستخدمه الفحص) */
    render: render
  };
  document.addEventListener('DOMContentLoaded', function () { window.MicroData.init(); });
  if (document.readyState !== 'loading') window.MicroData.init();
})();
