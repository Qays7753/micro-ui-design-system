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

   - bars:  ارتفاع ∝ القيمة على max معلن (data-max) — صفر يظهر على الأساس.
   - line:  نقاط بترتيب المستهلك — المحور الزمني باتجاهه المعلن
            (data-axis-dir="rtl|ltr" افتراضي rtl: الأقدم يمين) — لا قلب آلي.
   - donut: نسب بمقام معلن (data-total) — التوزيع من الفئات المعلنة فقط.
   - bubbles: نصف القطر √(القيمة/الأقصى) × الأقصى — لا دائرة سالبة،
            والصفر/الناقص بديل حلقة شرطة صغيرة بتسمية خارجية.
   ========================================================= */

(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function itemsOf(chart) {
    return [].slice.call(chart.querySelectorAll('.m-chart__data [data-series]')).map(function (li) {
      var raw = li.getAttribute('data-value');
      var v = raw === null || raw.trim() === '' ? null : parseFloat(raw);
      return {
        series: li.getAttribute('data-series') || 'a',
        label: li.getAttribute('data-label') || '',
        value: v !== null && isNaN(v) ? null : v,
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

  /* ---- الأعمدة ---- */
  function renderBars(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var max = parseFloat(chart.getAttribute('data-max')) || Math.max.apply(null,
      items.map(function (i) { return i.value || 0; }).concat([1]));
    var W = 320, H = 180, base = H - 34, top = 26, colW = W / Math.max(items.length, 1);
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
      } else {
        var h = Math.max(Math.min(it.value, max) / max * (base - top), it.value === 0 ? 0 : 3);
        var color = getComputedStyle(chart.querySelector('.m-chart__data') || chart).getPropertyValue('--micro-data-' + it.series) || '';
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
      var lab = svgEl('text', { class: 'm-chart__bar-label', x: cx, y: H - 12, 'text-anchor': 'middle' });
      lab.textContent = it.label; g.appendChild(lab);
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
    var max = parseFloat(chart.getAttribute('data-max')) || Math.max.apply(null, vals.filter(function (v) { return v !== null; }).concat([1]));
    var W = 320, H = 170, base = H - 30, top = 24;
    var n = Math.max(items.length, 2);
    function xAt(i) { var t = i / (n - 1); return rtl ? W - 24 - t * (W - 48) : 24 + t * (W - 48); }
    function yAt(v) { return v === null ? null : base - (v / max) * (base - top); }
    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': chart.getAttribute('data-title') || 'رسم خط' });
    svg.appendChild(svgEl('line', { class: 'm-chart__axis', x1: 12, y1: base, x2: W - 12, y2: base }));
    var pts = [];
    items.forEach(function (it, i) {
      var y = yAt(it.value);
      if (y !== null) pts.push([xAt(i), y]);
    });
    if (pts.length > 1) svg.appendChild(svgEl('polyline', { class: 'm-chart__line', points: pts.map(function (p) { return p.join(','); }).join(' ') }));
    items.forEach(function (it, i) {
      var x = xAt(i), y = yAt(it.value);
      var g = svgEl('g', { class: 'm-cat--' + it.series });
      if (y === null) {
        var u = svgEl('text', { class: 'm-chart__point-value', x: x, y: base - 6, 'text-anchor': 'middle', fill: 'var(--micro-text-hint)' });
        u.textContent = '—'; g.appendChild(u);
      } else {
        g.appendChild(svgEl('circle', { class: 'm-chart__dot', cx: x, cy: y, r: 4.5 }));
        var val = svgEl('text', { class: 'm-chart__point-value', x: x, y: y - 10, 'text-anchor': 'middle' });
        val.textContent = fmt(it.value); g.appendChild(val);
      }
      var lab = svgEl('text', { class: 'm-chart__x-label', x: x, y: H - 8, 'text-anchor': 'middle' });
      lab.textContent = it.label; g.appendChild(lab);
      svg.appendChild(g);
    });
    plot.innerHTML = '';
    plot.appendChild(svg);
  }

  /* ---- التوزيع الدائري (نسب بمقام معلن) ---- */
  function renderDonut(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var total = parseFloat(chart.getAttribute('data-total'));
    var known = items.filter(function (i) { return i.value !== null && i.value >= 0; });
    var sum = known.reduce(function (a, i) { return a + i.value; }, 0);
    if (isNaN(total) || total <= 0) total = sum; /* بلا مقام معلن: مجموع الفئات نفسه — موثق */
    var R = 58, C = 2 * Math.PI * R, cx = 74, cy = 74;
    var svg = svgEl('svg', { class: 'm-donut__svg', viewBox: '0 0 148 148', role: 'img', 'aria-label': chart.getAttribute('data-title') || 'توزيع' });
    var offset = 0;
    known.forEach(function (it) {
      var frac = it.value / total;
      var len = frac * C;
      var seg = svgEl('circle', {
        cx: cx, cy: cy, r: R, fill: 'none',
        stroke: 'var(--micro-data-' + it.series + ')',
        'stroke-width': 22,
        'stroke-dasharray': len + ' ' + (C - len),
        'stroke-dashoffset': -offset,
        transform: 'rotate(-90 ' + cx + ' ' + cy + ')'
      });
      svg.appendChild(seg);
      offset += len;
    });
    var center = svgEl('text', { class: 'm-donut__center', x: cx, y: cy + 2, 'text-anchor': 'middle' });
    center.textContent = fmt(isNaN(parseFloat(chart.getAttribute('data-total'))) ? sum : total);
    svg.appendChild(center);
    var clab = svgEl('text', { class: 'm-donut__center-label', x: cx, y: cy + 20, 'text-anchor': 'middle' });
    clab.textContent = chart.getAttribute('data-total-label') || 'الإجمالي';
    svg.appendChild(clab);
    plot.innerHTML = '';
    plot.appendChild(svg);

    /* مفتاح بقيم كاملة ونسب من المقام المعلن */
    var legend = document.createElement('ul');
    legend.className = 'm-legend';
    known.forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'm-legend__item m-cat--' + it.series;
      li.innerHTML = '<span class="m-legend__swatch"></span>' + it.label +
        ' <span class="m-legend__value">' + fmt(it.value) + ' (' + Math.round(it.value / total * 100) + '%)</span>';
      legend.appendChild(li);
    });
    (items.filter(function (i) { return i.value === null; })).forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'm-legend__item';
      li.innerHTML = it.label + ' <span class="m-legend__value">— غير متاح</span>';
      legend.appendChild(li);
    });
    plot.appendChild(legend);
  }

  /* ---- دوائر المساحة: المساحة ∝ القيمة (نصف القطر √) ---- */
  function renderBubbles(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var Rmax = parseFloat(chart.getAttribute('data-rmax')) || 52;
    var positive = items.filter(function (i) { return i.value !== null && i.value > 0; });
    var vmax = parseFloat(chart.getAttribute('data-max')) ||
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
        circ.style.width = circ.style.height = Math.max(r * 2, 8) + 'px'; /* لا حد أدنى يزوّر — الصغيرة جدًا تسمية خارجية */
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
    }
  };
  document.addEventListener('DOMContentLoaded', function () { window.MicroData.init(); });
  if (document.readyState !== 'loading') window.MicroData.init();
})();
