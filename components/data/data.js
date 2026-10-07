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
   - A01 — عقد المقياس الصريح (bars/line): «data-max» معلن من المستهلك
            يُحكَم بقيمته الفعلية لا بسلوك صامت:
              غائب → مقياس تلقائي موثق يستوعب أكبر قيمة مرسومة (أرضية 1).
              معلن غير صالح (غير رقمي أو 0 أو سالب) → حالة «مقياس غير صالح»
                صريحة: رسالة سبب + القراءات كاملة في قائمة بلا رسم نسبي
                (نفس فلسفة C2 في donut — لا سقوط صامت إلى مقياس تلقائي).
              معلن صالح أصغر من أكبر قيمة مرسومة → تجاوز مقياس، والافتراضي
                «رفض» (data-overscale="refuse" أو غياب السمة): لا clamp صامت
                ولا نقطة خارج SVG ولا مساواة بصرية بين قيم مختلفة — رسالة
                تجاوز + القراءات كاملة بلا رسم نسبي.
              خيار صريح موثق للمستهلك: data-overscale="rescale" يرسم بمقياس
                موسّع يستوعب القيم مع ملاحظة ظاهرة تسمّي المقياس المعلن
                والموسّع — لا توسيع خفي. قيم البيانات لا تتغير أبدًا.
   - line:  نقاط بترتيب المستهلك — المحور الزمني باتجاهه المعلن
            (data-axis-dir="rtl|ltr" افتراضي rtl: الأقدم يمين) — لا قلب آلي.
            القيمة المفقودة تقطع الخط فعليًا (شرائح منفصلة — لا وصلة
            صامتة عبر الفجوة)، والمجهول بعلامة «—».
   - donut: نسب بمقام معلن (data-total) — التوزيع من الفئات المعلنة فقط.
            C2: المقام المعلن يُحكم عليه بقيمته الفعلية لا بعلامة الاستفادة:
              سالب → حالة غير صالحة صريحة (خطأ معلن، دون نسب)،
              صفر مع قيم موجبة → تعارض صريح (لا استبدال المقام بالمجموع)،
              صفر وقيم معلومة كلها صفر → الحالة الصفرية الموثقة دون قسمة
              (المجهول يبقى «—» في المفتاح — فرق الصفر عن المجهول محفوظ)،
              والغائب فقط يستعمل البديل الموثق (مجموع الفئات المعروفة).
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

  /* ---- R2-UI02: عقد الحجم الفعلي لتسميات الرسوم (bars/line) ----
     الحجم المعلن في data.css (أعمدة 13px / خط 12px) حد أدنى فعلي على
     الشاشة لا قيمة CSS وحسب: الرسوم تُمدّ بعرض الحاوية (viewBox 320)،
     فعند عرض أضيق من 320 يتقلص الحجم الفعلي بالتناسب (11.7/10.8px عند
     288px). يقيس المصيّر عرض الرسم المتاح عند كل render ويضرب مقاييس
     النص وحدها بمعامل 320/العرض المقيس (حجم خط كل text بسمة style،
     خطوة سطر الالتفاف، ومرجع أحرف الالتفاف) فيبقى الحجم المعروض
     ≥ المعلن، بينما تبقى هندسة الرسم (الأعمدة/المحاور/الخط) نسبية
     للعرض المتاح كما كانت. القيم والنسب وحالات البيانات لا تتغير،
     والدونات مقاس ثابت 148 فلا يدخل التعويض. الرسم في حاوية مخفية
     (عرض 0) يصيّر بمعامل 1 (سلوك عرض التصميم) ويعيد المستهلك رسمه
     عند الإظهار — عينة F03 ترسم رسوم التقارير عند فتح عرضها. */
  var DESIGN_W = 320;
  var BAR_TEXT_PX = 13;  /* مزدوج مع .m-chart--bars في data.css (عقد الأدنى) */
  var LINE_TEXT_PX = 12; /* مزدوج مع .m-chart--line في data.css (عقد الأدنى) */

  function textScaleOf(plot) {
    var w = plot.getBoundingClientRect().width;
    if (!isFinite(w) || w <= 1) return { k: 1, refW: DESIGN_W }; /* مخفي/غير مقيس */
    if (w >= DESIGN_W) return { k: 1, refW: DESIGN_W };           /* كعقد R1 بلا تغيير */
    return { k: DESIGN_W / w, refW: w };                           /* أضيق: عوّض النص */
  }

  function applyTextPx(t, fontPx) {
    if (fontPx) t.style.fontSize = fontPx + 'px'; /* R2-UI02: الحجم الفعلي المعلن */
    return t;
  }

  /* لفّ التسميات الطويلة داخل SVG (E07): أسطر بحد أحرف — لا تداخل.
     R2-UI02: الكلمة الواحدة الأطول من السقف تُقسّم عند الشرطات (تواريخ
     مثل 2026-09-10 ونطاقات مقيدة) لا بالبتر — الكلمة العربية بلا شرطة
     تبقى كاملة مهما طالت (حد معلن: كلمة مفردة أطول من ميزانية السطر
     قد تجاور تسميتها عند 200%). */
  function wrapLabel(text, maxChars) {
    text = String(text || '');
    if (text.length <= maxChars) return [text];
    var tokens = [];
    text.split(' ').forEach(function (w) {
      if (w.length > maxChars && w.indexOf('-') >= 0) {
        /* قسّم عند الشرطات ثم ادمج المقاطع المجاورة ما دامت ضمن السقف:
           2026-09-10 بسقف 5 → «2026-» + «09-10» (سطران معقولان) لا 3 أسطر */
        var segs = [];
        w.split('-').forEach(function (seg, i, arr) {
          segs.push(i < arr.length - 1 ? seg + '-' : seg);
        });
        var merged = [];
        segs.forEach(function (s) {
          var last = merged[merged.length - 1];
          if (last !== undefined && (last + s).length <= maxChars) merged[merged.length - 1] = last + s;
          else merged.push(s);
        });
        tokens = tokens.concat(merged);
      } else if (w) {
        tokens.push(w);
      }
    });
    if (!tokens.length) tokens = [text];
    var lines = [], cur = '';
    tokens.forEach(function (t) {
      var joined = cur ? cur + ' ' + t : t;
      if (joined.length <= maxChars || !cur) cur = joined;
      else { lines.push(cur); cur = t; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function appendWrappedLabel(svg, g, text, cx, yBottom, maxChars, cls, lineStep, fontPx) {
    /* R1-UI09: خطوة السطر تتبع حجم خط التسمية (≈ 1.5×) — بعد تكبير التسميات
       (أعمدة 13px/خط 12px) الخطوة 13 الثابتة كانت تصطدم عند مضاعفة حجم
       الخط (محاكاة 200%)؛ الخطوة تُمرّر من كل رسم بحجم خطه.
       R2-UI02: fontPx (إن مُرّر) يثبّت الحجم الفعلي للتسمية على الحد
       المعلن عند تقلص الرسم تحت عرض التصميم. */
    var step = lineStep || 13;
    var lines = wrapLabel(text, maxChars);
    lines.forEach(function (ln, k) {
      var t = svgEl('text', {
        class: cls, x: cx,
        y: yBottom - (lines.length - 1 - k) * step,
        'text-anchor': 'middle'
      });
      applyTextPx(t, fontPx);
      t.textContent = ln;
      g.appendChild(t);
    });
    return lines.length;
  }

  /* ---- A01: عقد مقياس bars/line ----
     حالة المقياس تُحسم مرة واحدة من data-max + القيم القابلة للرسم
     (v >= 0؛ السالب غير مرسوم أصلًا فلا يدخل احتواء المقياس):
       auto    : بلا data-max — مقياس تلقائي يستوعب القيم (أرضية 1)
       ok      : معلن صالح ويحتوي أكبر قيمة مرسومة
       invalid : معلن موجود لكنه غير رقمي أو 0 أو سالب — غير قابل للاستخدام
       over    : معلن صالح لكنه أصغر من أكبر قيمة مرسومة — تجاوز صريح */
  function scaleStateOf(chart, items) {
    var raw = chart.getAttribute('data-max');
    var hasDeclared = raw !== null && String(raw).trim() !== '';
    var declared = hasDeclared ? parseNum(raw) : null;
    var largest = 0;
    items.forEach(function (it) {
      if (it.value !== null && it.value >= 0 && it.value > largest) largest = it.value;
    });
    if (!hasDeclared) return { kind: 'auto', max: Math.max(largest, 1), declared: null, largest: largest };
    if (declared === null || declared <= 0) {
      return { kind: 'invalid', max: 0, declaredRaw: raw, largest: largest };
    }
    if (largest > declared) {
      return { kind: 'over', max: declared, declared: declared, largest: largest };
    }
    return { kind: 'ok', max: declared, declared: declared, largest: largest };
  }

  /* A01: حالة رفض الرسم النسبي (مقياس غير صالح أو متجاوز) —
     القراءات محفوظة كاملة (القيم والتسميات لا تتغير) بلا رسم مشوه.
     R8-07: رسالة المستخدم موجزة مفهومة بلا أسماء سمات أو تعليمات؛
     تشخيص المطور/العقد يوضع في data-scale-state و data-scale-detail
     على جذر الرسم (موثقة في specification.md) لا في واجهة المكوّن */
  function renderScaleRefusal(chart, items, plot, state, userLabel, devDetail) {
    var err = document.createElement('p');
    err.className = 'm-chart__error';
    err.textContent = userLabel;
    plot.appendChild(err);
    chart.setAttribute('data-scale-state', state.kind);
    chart.setAttribute('data-scale-detail', devDetail);
    var list = document.createElement('ul');
    list.className = 'm-legend';
    items.forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'm-legend__item';
      var sw = document.createElement('span');
      sw.className = 'm-legend__swatch m-cat--' + it.series;
      li.appendChild(sw);
      li.appendChild(document.createTextNode(it.label + ' '));
      var val = document.createElement('span');
      val.className = 'm-legend__value';
      val.textContent = it.value === null ? '— غير متاح' : fmt(it.value);
      li.appendChild(val);
      list.appendChild(li);
    });
    plot.appendChild(list);
  }

  /* قيمة سالبة في رسم لا يدعم السالب: عرض صادق — شرطة + نص القيمة والسبب
     R2-UI02: fontPx يعوّض حجم النص عند تقلص الرسم تحت عرض التصميم */
  function invalidMarker(svg, g, cx, base, value, why, fontPx) {
    var r = svgEl('rect', {
      class: 'm-chart__bar-unknown', x: cx - 14, y: base - 10, width: 28, height: 10, rx: 4,
      stroke: 'var(--micro-warning)'
    });
    g.appendChild(r);
    var t = svgEl('text', {
      class: 'm-chart__bar-value', x: cx, y: base - 16, 'text-anchor': 'middle',
      fill: 'var(--micro-warning)'
    });
    applyTextPx(t, fontPx);
    t.textContent = fmt(value) + ' — ' + why;
    g.appendChild(t);
  }

  /* ---- الأعمدة ---- */
  function renderBars(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    /* A01: عقد المقياس الصريح — لا clamp صامت ولا مساواة بصرية بين قيم مختلفة */
    var scale = scaleStateOf(chart, items);
    if (scale.kind === 'invalid') {
      plot.innerHTML = '';
      renderScaleRefusal(chart, items, plot, scale,
        'تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه.',
        'bars: data-max="' + scale.declaredRaw + '" غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض الرسم النسبي والقيم معروضة كاملة.');
      return;
    }
    if (scale.kind === 'over' && (chart.getAttribute('data-overscale') || 'refuse') !== 'rescale') {
      plot.innerHTML = '';
      renderScaleRefusal(chart, items, plot, scale,
        'تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه.',
        'bars: أكبر قيمة (' + fmt(scale.largest) + ') تتجاوز data-max="' + fmt(scale.declared) + '" — الرسم النسبي كان سيخفي الفرق بين القيم؛ صحّح data-max أو استخدم data-overscale="rescale" لتوسيع المقياس بشكل معلن.');
      return;
    }
    /* A01: المقياس الفعلي للرسم — المعلن في ok، والتلقائي/الموسّع في auto/over-rescale */
    var max = (scale.kind === 'over') ? scale.largest : scale.max;
    var ts = textScaleOf(plot); /* R2-UI02: قياس العرض الفعلي عند كل render */
    var fontPx = ts.k > 1 ? BAR_TEXT_PX * ts.k : null;
    /* R2-UI02: ميزانية الالتفاف تخطّط لبيئة خط مضاعفة (محاكاة 200%
       المعلنة في المشروع): الحد/2 لكل سطر — النص الملفوف لا يصطدم بجاره
       ولا يخرج عن عموده عند مضاعفة حجم الخط، والشرطات تقسم التواريخ.
       الأرضية 6 كما في R1. */
    var labelChars = Math.max(6, Math.floor((ts.refW / Math.max(items.length, 1)) * 0.9 / (6.8 * 2)));
    var maxLines = Math.max.apply(null, items.map(function (i) {
      return wrapLabel(i.label, labelChars).length;
    }).concat([1]));
    var BAR_LABEL_STEP = 40 * ts.k; /* R2-UI02: ~2.85× للخط 13px — صندوق السطر المضاعف (≈1.42em بارتفاع الخط العربي الكامل) لا يتصادم عموديًا عند 200%؛ R1-UI09 كان 1.5× غير كافٍ للمضاعفة الكاملة */
    var extra = (maxLines - 1) * BAR_LABEL_STEP;
    /* R2-UI02: المسافة بين المحور وأسطر التسمية 50−12=38 وحدة تصميم —
       صندوق أعلى سطر مضاعف (≈35 وحدة) لا يخترق منطقة قيم الأعمدة
       عند 200% (كانت 22 غير كافية). */
    var W = 320, H = 180 + extra, base = H - 50 - extra, top = 26;
    var colW = W / Math.max(items.length, 1);
    var ariaLabel = chart.getAttribute('data-title') || 'رسم أعمدة';
    if (scale.kind === 'over') {
      ariaLabel += ' — مقياس موسّع إلى ' + fmt(max) + ' بدل المعلن ' + fmt(scale.declared);
    }
    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': ariaLabel });
    svg.appendChild(svgEl('line', { class: 'm-chart__baseline', x1: 0, y1: base, x2: W, y2: base }));
    items.forEach(function (it, i) {
      var cx = colW * i + colW / 2;
      var g = svgEl('g', { class: 'm-cat--' + it.series });
      if (it.value === null) {
        /* ناقص/مجهول: مستطيل شرطة قصير فوق الأساس + تسمية «—» */
        g.appendChild(svgEl('rect', { class: 'm-chart__bar-unknown', x: cx - 14, y: base - 10, width: 28, height: 10, rx: 4 }));
        var u = svgEl('text', { class: 'm-chart__bar-value', x: cx, y: base - 16, 'text-anchor': 'middle' });
        applyTextPx(u, fontPx);
        u.textContent = '—'; g.appendChild(u);
      } else if (it.value < 0) {
        /* E06: سالب في الأعمدة — رفض بوضوح، لا رسم كموجب */
        invalidMarker(svg, g, cx, base, it.value, 'سالب غير مرسوم', fontPx);
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
        applyTextPx(val, fontPx);
        val.textContent = fmt(it.value); g.appendChild(val);
        if (it.outlier) {
          var o = svgEl('text', { x: cx, y: base - h - 20, 'text-anchor': 'middle', class: 'm-chart__bar-value', fill: 'var(--micro-warning)' });
          applyTextPx(o, fontPx);
          o.textContent = 'قيمة شاذة'; g.appendChild(o);
        }
      }
      appendWrappedLabel(svg, g, it.label, cx, H - 12, labelChars, 'm-chart__bar-label', BAR_LABEL_STEP, fontPx);
      svg.appendChild(g);
    });
    plot.innerHTML = '';
    plot.appendChild(svg);
    if (scale.kind === 'over') {
      /* A01: خيار rescale الصريح — التوسيع معلن ظاهرًا لا خفيًا.
         R8-07: ملاحظة موجزة بلا أسماء سمات؛ تفاصيل العقد في data-scale-* */
      var note = document.createElement('p');
      note.className = 'm-chart__scale-note';
      note.textContent = 'نطاق العرض: ' + fmt(max) + ' بدل ' + fmt(scale.declared) + ' — القيم الأصلية دون تغيير.';
      plot.appendChild(note);
      chart.setAttribute('data-scale-state', 'over-rescaled');
      chart.setAttribute('data-scale-detail', 'bars: data-overscale="rescale" — رسم بمقياس موسّع من ' + fmt(scale.declared) + ' إلى ' + fmt(max) + '؛ القيم الأصلية دون تغيير.');
    }
  }

  /* ---- الخط ---- */
  function renderLine(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var rtl = (chart.getAttribute('data-axis-dir') || 'rtl') !== 'ltr';
    /* A01: عقد المقياس الصريح نفسه المطبق على الأعمدة — لا نقطة خارج SVG */
    var scale = scaleStateOf(chart, items);
    if (scale.kind === 'invalid') {
      plot.innerHTML = '';
      renderScaleRefusal(chart, items, plot, scale,
        'تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه.',
        'line: data-max="' + scale.declaredRaw + '" غير رقمي/غير موجب — مقياس غير قابل للاستخدام؛ رُفض الرسم النسبي والقيم معروضة كاملة.');
      return;
    }
    if (scale.kind === 'over' && (chart.getAttribute('data-overscale') || 'refuse') !== 'rescale') {
      plot.innerHTML = '';
      renderScaleRefusal(chart, items, plot, scale,
        'تعذر عرض الرسم بهذا النطاق. القيم متاحة أدناه.',
        'line: أكبر قيمة (' + fmt(scale.largest) + ') تتجاوز data-max="' + fmt(scale.declared) + '" — الرسم كان سيخرج نقطة خارج مجال الرسم؛ صحّح data-max أو استخدم data-overscale="rescale" لتوسيع المقياس بشكل معلن.');
      return;
    }
    /* A01: المقياس الفعلي للرسم — المعلن في ok، والتلقائي/الموسّع في auto/over-rescale */
    var max = (scale.kind === 'over') ? scale.largest : scale.max;
    var ts = textScaleOf(plot); /* R2-UI02: قياس العرض الفعلي عند كل render */
    var fontPx = ts.k > 1 ? LINE_TEXT_PX * ts.k : null;
    var n = Math.max(items.length, 2);
    /* R2-UI02: ميزانية الالتفاف تخطّط لبيئة خط مضاعفة (200%) كما في
       الأعمدة — الحد/2 لكل سطر؛ الأرضية 5 كما في R1. */
    var labelChars = Math.max(5, Math.floor(((ts.refW - 48) / n) / (6.8 * 2)));
    var maxLines = Math.max.apply(null, items.map(function (i) {
      return wrapLabel(i.label, labelChars).length;
    }).concat([1]));
    var X_LABEL_STEP = 37 * ts.k; /* R2-UI02: ~2.85× للخط 12px — صندوق السطر المضاعف لا يتصادم عموديًا عند 200%؛ R1-UI09 كان 1.5× (18) غير كافٍ */
    var extra = (maxLines - 1) * X_LABEL_STEP;
    /* R2-UI02: المسافة بين المحور وأسطر تسميات المحور 48−8=40 وحدة تصميم —
       صندوق أعلى سطر مضاعف لا يخترق منطقة قيم النقاط عند 200% (كانت 22). */
    var W = 320, H = 170 + extra, base = H - 48 - extra, top = 24;
    function xAt(i) { var t = i / (n - 1); return rtl ? W - 24 - t * (W - 48) : 24 + t * (W - 48); }
    function yAt(v) { return v === null ? null : base - (v / max) * (base - top); }
    var ariaLabel = chart.getAttribute('data-title') || 'رسم خط';
    if (scale.kind === 'over') {
      ariaLabel += ' — مقياس موسّع إلى ' + fmt(max) + ' بدل المعلن ' + fmt(scale.declared);
    }
    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': ariaLabel });
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
        applyTextPx(u, fontPx);
        u.textContent = '—'; g.appendChild(u);
      } else if (it.value < 0) {
        invalidMarker(svg, g, x, base, it.value, 'سالب غير مرسوم', fontPx);
      } else {
        g.appendChild(svgEl('circle', { class: 'm-chart__dot', cx: x, cy: y, r: 4.5 }));
        var val = svgEl('text', { class: 'm-chart__point-value', x: x, y: y - 10, 'text-anchor': 'middle' });
        applyTextPx(val, fontPx);
        val.textContent = fmt(it.value); g.appendChild(val);
      }
      appendWrappedLabel(svg, g, it.label, x, H - 8, labelChars, 'm-chart__x-label', X_LABEL_STEP, fontPx);
      svg.appendChild(g);
    });
    plot.innerHTML = '';
    plot.appendChild(svg);
    if (scale.kind === 'over') {
      var note = document.createElement('p');
      note.className = 'm-chart__scale-note';
      note.textContent = 'نطاق العرض: ' + fmt(max) + ' بدل ' + fmt(scale.declared) + ' — القيم الأصلية دون تغيير.';
      plot.appendChild(note);
      chart.setAttribute('data-scale-state', 'over-rescaled');
      chart.setAttribute('data-scale-detail', 'line: data-overscale="rescale" — رسم بمقياس موسّع من ' + fmt(scale.declared) + ' إلى ' + fmt(max) + '؛ القيم الأصلية دون تغيير.');
    }
  }

  /* ---- التوزيع الدائري (نسب بمقام معلن) ----
     R2-05: فارق صريح بين «لا قيمة صالحة» و«قيم معلومة كلها صفر»،
     وبين مقام غائب (بديل موثق) ومقام موجود غير صالح (خطأ معلن).
     C2: المقام المعلن صفرًا أو سالبًا لا يُتجاهل — كان `declared > 0`
     وحده يُعتبر مقامًا صالحًا فيسقط الصفر والسالب صامتًا إلى مجموع
     الفئات (بديل الغائب) ويظهر توزيع طبيعي بلا خطأ.
     R8-07a: نفس فصل نص المستخدم عن تشخيص المطور المطبق على bars/line —
     رسالة موحدة موجزة بلا أسماء سمات أو تعليمات، والسبب/القيم في
     data-scale-state/data-scale-detail على جذر الرسم (عقد موثق في
     specification.md؛ حالات donut: invalid/over/conflict). */

  /* R8-07a: رسالة رفض donut — نص مستخدم موجز موحد + تشخيص تقني كامل
     على الجذر (يُقرأ من الكود/السجلات لا من الواجهة). لا HTML ولا
     نظام رسائل جديد. */
  function donutRefusal(chart, plot, stateKind, devDetail) {
    var err = document.createElement('p');
    err.className = 'm-chart__error';
    err.textContent = 'تعذر رسم التوزيع كنسب. القيم معروضة في المفتاح دون نسب.';
    plot.appendChild(err);
    chart.setAttribute('data-scale-state', stateKind);
    chart.setAttribute('data-scale-detail', devDetail);
  }

  function renderDonut(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var declaredRaw = chart.getAttribute('data-total');
    var hasDeclaredAttr = declaredRaw !== null && String(declaredRaw).trim() !== '';
    var declared = hasDeclaredAttr ? parseNum(declaredRaw) : null; /* كامل لا بادئة */
    var declaredInvalid = hasDeclaredAttr && declared === null; /* موجود غير رقمي/غير محدود */
    var declaredNegative = hasDeclaredAttr && declared !== null && declared < 0; /* C2: سالب معلن */
    var declaredZero = hasDeclaredAttr && declared === 0; /* C2: صفر معلن */
    var hasDeclared = declared !== null && declared > 0; /* مقام صالح قابل للاستخدام فقط */
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
    /* C2: الحالة الصفرية الموثقة — كل المعلوم صفر (بلا أي قيمة موجبة)،
       مع مقام معلن صفر يبقى بلا قسمة أيضًا (المركز يعرض المقام المعلن 0
       والمجهول يبقى «—» في المفتاح — لا دمج الصفر بالمجهول)، وبدونه
       كما في R2-05. مع فئات مجهولة وبلا مقام معلن: الإجمالي غير معلوم. */
    var zeroCase = known.length > 0 && sum === 0 && (missing.length === 0 || declaredZero);
    var unknownTotal = known.length > 0 && sum === 0 && missing.length > 0 && !declaredZero; /* صفر مع مجهول بلا مقام: الإجمالي غير معلوم (R2-05) */

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
      /* R2-05: مقام موجود غير صالح — خطأ معلن لا سقوط صامت إلى مجموع الفئات.
         R8-07a: رسالة المستخدم موحدة موجزة والتشخيص يحمل السبب والقيمة الخام */
      donutRefusal(chart, plot, 'invalid',
        'donut: data-total="' + declaredRaw + '" غير رقمي/غير محدود — مقام غير قابل للاستخدام؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.');
    } else if (hasInvalid || sumExceeds) {
      /* نفس أسبقية الحالات السابقة: قيم سالبة تأخذ الأولوية عند اجتماع الاثنين */
      donutRefusal(chart, plot, hasInvalid ? 'invalid' : 'over',
        hasInvalid
          ? 'donut: قيم سالبة — التوزيع نسب من قيم غير سالبة فقط؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.'
          : 'donut: مجموع الفئات (' + fmt(sum) + ') يتجاوز المقام المعلن data-total="' + fmt(total) + '" — النسب كانت ستتجاوز المقام؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.');
    } else if (declaredNegative) {
      /* C2: مقام سالب معلن — حالة غير صالحة صريحة، دون نسب
         (كان يسقط صامتًا إلى مجموع الفئات ويرسم توزيعًا طبيعيًا) */
      donutRefusal(chart, plot, 'invalid',
        'donut: data-total="' + declaredRaw + '" سالب — المقام السالب غير صالح للنسب (C2)؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.');
    } else if (declaredZero && sum > 0) {
      /* C2: مقام صفر مع قيم موجبة — تعارض صريح: لا استبدال المقام
         بالمجموع (ذلك بديل المقام الغائب فقط) ولا قسمة على صفر */
      donutRefusal(chart, plot, 'conflict',
        'donut: data-total="0" بينما مجموع الفئات ' + fmt(sum) + ' — تعارض بيانات: لا نسب من مقام صفر ولا استبدال تلقائي للمقام (C2)؛ رُفضت النسب والقيم معروضة في المفتاح دون نسب.');
    } else if (noData) {
      /* R2-05: عدم توفر البيانات ليس صفرًا — «— / لا توجد بيانات» */
      emptyRing('—', 'لا توجد بيانات');
    } else if (unknownTotal) {
      /* R2-05: خلط مجهول/صفر والمجموع صفر بلا مقام معلن — لا دعوى بإجمالي صفر */
      emptyRing('—', 'الإجمالي غير معلوم');
    } else if (zeroCase) {
      /* كل القيم المعلومة صفرية بلا قيمة موجبة — الصفر هنا صادق؛
         مع مقام معلن صالح يظهر هو نفسه (شرائح كلها صفرية)، ومع مقام
         معلن صفر (C2) يظهر المقام المعلن 0 — الحالة الصفرية الموثقة
         دون قسمة، والمجهول إن وُجد يبقى «—» في المفتاح لا صفرًا */
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
    var noPercent = declaredInvalid || declaredNegative || (declaredZero && sum > 0)
      || sumExceeds || hasInvalid || noData || unknownTotal || zeroCase;
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
    /* R8-07b: كل دورة render تبدأ بلا تشخيص قديم — السمتان تصفان
       الدورة الحالية وحدها؛ الحالة السليمة (auto/ok/توزيع صالح) تبقيهما
       غائبتين بعقد المواصفة، والحالات غير السليمة تكتبهما من جديد. */
    chart.removeAttribute('data-scale-state');
    chart.removeAttribute('data-scale-detail');
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
