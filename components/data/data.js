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

   R3-UI01: رسوم bars/line تراقب عرض حاويتها (ResizeObserver واحد لكل
            رسم، العرض فقط) فتعيد القياس والرسم تلقائيًا عند تغيّر ≥0.5px
            أو عند الإظهار — دون نقرة من المستخدم؛ الدونات (148 الثابت)
            والفقاعات (تدفق DOM) خارج الرصد، وغياب ResizeObserver في بيئة
            قديمة يُبقي عقد R2: المستهلك يعيد الرسم عند الفتح.
   F-01 (2026-10-10، تكليف معرض النظام): تسميات bars/line تُقاس فعليًا
            بعد إلحاق الرسم (getComputedTextLength بوحدات viewBox)
            والميزانية الكاملة عند 1×: القص بمقطع «…» لا يقع إلا لسطر
            أعرض من ميزانية عموده/تباعد نقطته كاملة (كلمة مفردة طويلة)،
            مع قراءة كاملة (aria-label + <title> + data-label-full
            الاختيارية) وحدود طرفين بالمدى الفعلي [x−len/2, x+len/2]
            داخل [8, W−8]، وتحقق زوجي بالمدى الفعلي داخل كل صف.
            جاهزية الخط: بعد fonts.ready تُعاد رسوم bars/line مرة واحدة
            فأول تصيير مستقر = كل إعادة تصيير لاحقة (مرصود سابقًا:
            اختلاف القياس بمقاييس الخط البديل قبل التحميل).
            حل محل تخطيط «ميزانية 200%» (R2-UI02/R3-UI02) الذي كان
            يقصّ التسميات عند نصف الميزانية عند الحجم الطبيعي — اتجاه
            المنتج الحالي لا هدف تكبير فيه (تكليف 2026-10-09).
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
        /* R3-UI02: قراءة كاملة اختيارية يمررها المستهلك — إن غابت فهي
           data-label نفسه؛ يستخدمها القصّ في aria-label/<title>.
           المكوّن العام لا يفترض أن كل label تاريخ — يعرض ما مرره
           المستهلك، والقراءة الكاملة سمة اختيارية (عقد specification.md) */
        labelFull: li.getAttribute('data-label-full') || li.getAttribute('data-label') || '',
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
     (عرض 0) يصيّر بمعامل 1 (سلوك عرض التصميم) ثم يعيد رصد R3-UI01
     القياس تلقائيًا عند إظهار الحاوية؛ وفي بيئة بلا ResizeObserver
     يعود عقد R2: المستهلك يعيد رسمه عند الإظهار. */
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
     تبقى كاملة (ودخلت عقد القياس الفعلي F-01 أدناه: إن تجاوزت ميزانيتها
     الكاملة عند 1× قُصّت بمقطع «…» مع قراءة كاملة).
     R3-UI02a: «/» فاصل تقسيم مثله مثل الشرطة — تسمية يوم/شهر قصيرة مثل
     10/09 تُقسّم إلى «10/» + «09» (سطران كاملان) بدل قصّها بمقطع؛
     لا يفترض المكوّن نوع التاريخ — تقسيم نصي عام لأي رمز معلن. */
  function splitWord(w, maxChars) {
    var parts = w.split(/([-/])/); /* يبقي الفواصل عناصر مستقلة */
    var segs = [];
    for (var i = 0; i < parts.length; i += 2) {
      var seg = parts[i];
      if (parts[i + 1]) seg += parts[i + 1];
      if (seg) segs.push(seg);
    }
    var merged = [];
    segs.forEach(function (s) {
      var last = merged[merged.length - 1];
      if (last !== undefined && (last + s).length <= maxChars) merged[merged.length - 1] = last + s;
      else merged.push(s);
    });
    return merged;
  }
  function wrapLabel(text, maxChars) {
    text = String(text || '');
    if (text.length <= maxChars) return [text];
    var tokens = [];
    text.split(' ').forEach(function (w) {
      if (w.length > maxChars && /[-/]/.test(w)) {
        /* قسّم عند الشرطات/الشرائط ثم ادمج المقاطع المجاورة ما دامت ضمن
           السقف: 2026-09-10 بسقف 5 → «2026-» + «09-10»، و10/09 بسقف 3 →
           «10/» + «09» (سطران كاملان معقولان) لا 3 أسطر ولا بتر */
        tokens = tokens.concat(splitWord(w, maxChars));
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

  /* ---- F-01 (2026-10-10، تكليف معرض النظام): موائمة التسميات عند المقياس الفعلي 1× ----
     العقد القديم (R2-UI02/R3-UI02) خطّط لبيئة خط مضاعفة (محاكاة 200%
     محسوبة) فقصّ كل تسمية عند نصف ميزانية العمود/النقطة — النتيجة
     المرصودة في المعرض: تسميات مقروءة جزئيًا عند الحجم الطبيعي
     (مبيعات ← مبيع…، مشتريات ← مش…). اتجاه المنتج الحالي (تكليف
     2026-10-09) لا هدف تكبير فيه — المقياس ثابت. العقد الجديد:
       1) كل سطر تسمية يأخذ ميزانية العمود/تباعد النقاط الكاملة (×0.92)
          عند 1×؛ القص بمقطع «…» لا يقع إلا لسطر أعرض من ميزانيته
          كاملة (كلمة عربية مفردة طويلة مثلًا)، ولا يُصغّر خط أبدًا.
       2) منع التصادم والحدود الطرفية تعمل بالمدى الفعلي المقيس
          (نص مُوسّط: [x−len/2, x+len/2]) داخل [8, W−8] — لا مدى
          مضاعفًا تخطيطيًا. تحقق زوجي داخل كل صف تسميات بفجوة ≥1 وحدة.
       3) القراءة الكاملة لا تضيع عند القص: aria-label + عنصر <title>
          ابن بالنص الكامل (data-label-full إن مرره المستهلك وإلا
          data-label)؛ <li data-label> المصدر يبقى كاملاً في DOM،
          وإفصاح بيانات الرسم (جدول) متاح دائمًا (D-UI-04).
       4) جاهزية الخط: الرسم الأول قد يحدث قبل تحميل الخط العربي
          (مقاييس خط بديل أضيق/أعرض) فيختلف أول تصيير عن إعادة
          التصيير — مرصود فعليًا: «مش…» قبل الجاهزية و«مشتر…» بعدها.
          بعد document.fonts.ready يُعاد رسم كل رسم مُهيّأ مرة واحدة
          (نفس نمط packed-circle الموثق) فتستقر الحالة على قياسات
          الخط الفعلي، وكل إعادة تصيير لاحقة مطابقة لها.
     الرسم المخفي (عرض 0 — لا يمكن القياس) تتخطى المواءمة وتبقى خطة
     الأحرف الحالية: المستهلك يعيد الرسم عند الإظهار، ورصد R3-UI01
     يضمنه تلقائيًا حيثما وُجد ResizeObserver. */
  var FIT_MAX_ROUNDS = 24; /* سقف محاولات القص التدريجي/الحلقة الزوجية */

  function measuredLenOf(t) {
    try { return t.getComputedTextLength(); }
    catch (e) { return 0; } /* بيئة بلا قياس هندسي: اعتبره 0 (لا قص) */
  }

  /* قص تدريجي بمقطع «…» حتى طول ≤ limit — لا مساس بحجم الخط.
     F-01: limit الآن الميزانية الكاملة عند 1× (لا نصفها). */
  function truncateToBudget(t, limit) {
    var s = String(t.textContent || '');
    var guard = 0;
    while (measuredLenOf(t) > limit && s.length > 1 && guard < FIT_MAX_ROUNDS) {
      guard += 1;
      var cut = s.length - guard;
      if (cut < 1) cut = 1;
      t.textContent = s.slice(0, cut) + '…';
    }
    return guard > 0; /* هل حدث قص فعلي */
  }

  function fitMeasuredLabels(chart, svg, items, labelCls, budget) {
    var plot = chart.querySelector('[data-plot]');
    if (!plot || plot.getBoundingClientRect().width <= 1) return; /* مخفي */
    var W = 320;
    var entries = [];
    /* مجموعات الرسم بترتيب العناصر نفسه — التسمية تعرف نصها الكامل */
    [].slice.call(svg.querySelectorAll('g')).forEach(function (g, i) {
      var full = items[i] ? (items[i].labelFull || items[i].label || '') : '';
      [].slice.call(g.querySelectorAll('.' + labelCls)).forEach(function (t) {
        entries.push({
          t: t, full: full, cut: false,
          cx0: parseFloat(t.getAttribute('x')) || 0, /* مركز العمود/النقطة قبل التثبيت */
          y: t.getAttribute('y') /* مفتاح الصف — الصفوف تتقاسم قيم y */
        });
      });
    });
    if (!entries.length) return;
    /* F-01: القص الفردي عند تجاوز الميزانية الكاملة (1×) فقط */
    entries.forEach(function (e) {
      if (measuredLenOf(e.t) > budget) e.cut = truncateToBudget(e.t, budget);
    });
    /* حدود الطرفين بالمدى الفعلي المقيس: [x−len/2, x+len/2] داخل [8, W−8] */
    function clampOf(e) {
      var half = measuredLenOf(e.t) / 2;
      var x = e.cx0;
      if (x - half < 8) x = 8 + half;
      if (x + half > W - 8) x = W - 8 - half;
      if (x - half < 8) x = 8 + half; /* نص أعرض من المجال: ثبّت الحد الأدنى */
      e.t.setAttribute('x', x);
    }
    entries.forEach(clampOf);
    /* تحقق زوجي داخل كل صف بالمدى الفعلي: لو بقي تداخل مجاور قُصّ الأعرض حتى الفصل */
    var rows = {};
    entries.forEach(function (e) { (rows[e.y] = rows[e.y] || []).push(e); });
    Object.keys(rows).forEach(function (yk) {
      var row = rows[yk];
      row.sort(function (a, b) { return a.cx0 - b.cx0; });
      var guard = 0, changed = true;
      while (changed && guard < FIT_MAX_ROUNDS) {
        guard += 1;
        changed = false;
        for (var i = 0; i < row.length - 1; i++) {
          var a = row[i], b = row[i + 1];
          var ax = parseFloat(a.t.getAttribute('x')) || 0;
          var bx = parseFloat(b.t.getAttribute('x')) || 0;
          var aHalf = measuredLenOf(a.t) / 2, bHalf = measuredLenOf(b.t) / 2;
          if (ax + aHalf >= bx - bHalf - 1) { /* تداخل فعلي (فجوة ≥1 وحدة) */
            var wide;
            if (bHalf > aHalf) wide = b;
            else if (aHalf > bHalf) wide = a;
            else { /* التعادل: الأقرب إلى طرف الرسم (قصّه أرخص — التثبيت يبعده عن جاره) */
              wide = (Math.min(a.cx0, W - a.cx0) <= Math.min(b.cx0, W - b.cx0)) ? a : b;
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
    /* القراءة الكاملة لكل نص مقتطع: aria-label + <title> ابن */
    entries.forEach(function (e) {
      if (!e.cut || !e.full) return;
      e.t.setAttribute('aria-label', e.full);
      var ti = svgEl('title', {});
      ti.textContent = e.full;
      e.t.appendChild(ti);
    });
    /* F-01 (2026-10-10): حدود الطرفين بالمدى الفعلي المقيس (1×) تسري على
       كل نصوص الرسم لا التسميات وحدها: القيم (فوق العمود/النقطة) قد
       تتجاوز حدود الطرف أيضًا — القيم لا تُقصّ أبدًا (عقد القيم كاملة)
       بل يثبّت موضعها x فقط بحيث يبقى مداها الفعلي [x−len/2, x+len/2]
       داخل [8, W−8]؛ التسميات مرّت بالتثبيت أعلاه وهذا المرور لا
       يغيّرها (تثبيت متماثل). */
    [].slice.call(svg.querySelectorAll('text')).forEach(function (t) {
      var len = measuredLenOf(t);
      if (!(len > 0)) return;
      var half = len / 2;
      var x = parseFloat(t.getAttribute('x')) || 0;
      if (x - half < 8 || x + half > W - 8) {
        if (x - half < 8) x = 8 + half;
        if (x + half > W - 8) x = W - 8 - half;
        if (x - half < 8) x = 8 + half; /* نص أعرض من المجال: الحد الأدنى */
        t.setAttribute('x', x);
      }
    });
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
    /* F-01 (2026-10-10): تقدير الالتفاف عند 1× — الحد الكامل لكل سطر
       (لا تخطيط مضاعف): السطر الملفوف يقارب ميزانية العمود، والأسطر
       الأعرض من الميزانية يعالجها قياس المواءمة الفعلي بعد الإلحاق.
       الأرضية 6 كما في R1. */
    var labelChars = Math.max(6, Math.floor((ts.refW / Math.max(items.length, 1)) * 0.9 / 6.8));
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
    /* R3-UI02: قياس وموائمة بعد الإلحاق (الرسم مرئي) — ميزانية العمود ×0.92 */
    fitMeasuredLabels(chart, svg, items, 'm-chart__bar-label', colW * 0.92);
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
    /* F-01 (2026-10-10): تقدير الالتفاف عند 1× كما في الأعمدة — الحد
       الكامل لكل سطر؛ الأرضية 5 كما في R1. */
    var labelChars = Math.max(5, Math.floor(((ts.refW - 48) / n) / 6.8));
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
    /* R3-UI02: قياس وموائمة بعد الإلحاق — ميزانية تباعد النقاط ×0.92 */
    fitMeasuredLabels(chart, svg, items, 'm-chart__x-label', ((W - 48) / (n - 1)) * 0.92);
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

  /* ---- W3.1 (A4-D01/A4-R02 — D-UI-04): اسم ووصف الرسم مربوطان برمجيًا ----
     العنوان المرئي (.m-chart__title) هو مصدر الاسم عندما يوجد (id مولد
     إن لزم + aria-labelledby) — مصدر واحد بدل تكرار aria-label من
     data-title بجانب عنوان مرئي مختلف؛ والملخص (p[data-summary]) يرتبط
     بالرسم عبر aria-describedby فيقرأه قارئ الشاشة وصفًا للرسم لا نصًا
     حائرًا بجواره. غياب العنوان المرئي يُبقي aria-label من data-title
     كما كان. */
  var chartUid = 0;

  function ensureId(el, prefix) {
    if (!el.id) el.id = prefix + '-' + (++chartUid);
    return el.id;
  }

  function linkChartName(chart) {
    var svg = chart.querySelector('[data-plot] > svg[role="img"]');
    if (!svg) return;
    var titleEl = chart.querySelector('.m-chart__title');
    if (titleEl && String(titleEl.textContent || '').trim()) {
      svg.setAttribute('aria-labelledby', ensureId(titleEl, 'micro-chart-title'));
      svg.removeAttribute('aria-label'); /* المصدر واحد: العنوان المرئي */
    }
    var summary = chart.querySelector('[data-summary]');
    if (summary) svg.setAttribute('aria-describedby', ensureId(summary, 'micro-chart-summary'));
  }

  /* ---- W3.1 (D-UI-04 — قرار مالك): إفصاح بيانات داخل الرسم ----
     زر disclosure + جدول دلالي (caption/thead/tbody/scope) داخل .m-chart
     نفسه — لا صفحة منتج ولا عائلة مكونات جديدة. الجدول يُعاد بناؤه في
     كل دورة تصيير من مصدر البيانات نفسه فيبقى متزامنًا مع dataset الحالي
     بنيويًا (لا انحراف ممكن)، ويُفتح بالمفتاح المجهز (aria-expanded +
     aria-controls) — مسار الوصول الكامل للقراءات مستقلًا عن الرسم. */
  function valueStateText(it) {
    if (it.value === null) return '— غير متاح';
    if (it.value < 0) return fmt(it.value) + ' (سالب غير مرسوم)';
    var base = fmt(it.value);
    return it.outlier ? base + ' (قيمة شاذة)' : base;
  }

  function syncDatasetTable(chart, items) {
    var wrap = chart.querySelector('.m-chart__dataset-wrap');
    var btn, table;
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'm-chart__dataset-wrap';
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'm-chart__disclose';
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'عرض البيانات كجدول';
      table = document.createElement('table');
      table.className = 'm-chart__dataset';
      table.id = 'micro-chart-dataset-' + (++chartUid);
      btn.setAttribute('aria-controls', table.id);
      table.hidden = true;
      wrap.appendChild(btn);
      wrap.appendChild(table);
      /* الإدراج بعد الملخص (آخر عنصر في بنية .m-chart) — ترتيب قراءة:
         العنوان، الرسم، الملخص، ثم الإفصاح */
      chart.appendChild(wrap);
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        table.hidden = open;
        btn.textContent = open ? 'عرض البيانات كجدول' : 'إخفاء جدول البيانات';
      });
    } else {
      btn = wrap.querySelector('.m-chart__disclose');
      table = wrap.querySelector('.m-chart__dataset');
    }
    if (!btn || !table) return;
    /* إعادة البناء كل دورة — التزامن مضمون بنيويًا */
    table.textContent = '';
    var caption = document.createElement('caption');
    var titleEl = chart.querySelector('.m-chart__title');
    caption.textContent = String((titleEl && titleEl.textContent) || chart.getAttribute('data-title') || '').trim();
    table.appendChild(caption);
    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    ['الفئة', 'القيمة'].forEach(function (h) {
      var th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.textContent = h;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    items.forEach(function (it) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.setAttribute('scope', 'row');
      th.textContent = it.label;
      tr.appendChild(th);
      var td = document.createElement('td');
      td.textContent = valueStateText(it);
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }

  /* ---- دوائر المساحة: المساحة ∝ القيمة (نصف القطر √) ---- */
  function renderBubbles(chart, items) {
    var plot = chart.querySelector('[data-plot]');
    var rmaxAttr = parseNum(chart.getAttribute('data-rmax')); /* R2-05: كامل لا بادئة */
    var Rmax = (rmaxAttr !== null && rmaxAttr > 0) ? rmaxAttr : 52;
    var positive = items.filter(function (i) { return i.value !== null && i.value > 0; });
    /* W3.2 (A4-D03): عقد مقياس A01 نفسه المطبق على bars/line — لا
       استبدال صامت لـdata-max غير الصالح ولا دائرة تتجاوز rmax:
       - غائب → مقياس تلقائي موثق يستوعب أكبر قيمة موجبة (أرضية 1).
       - معلن غير صالح (غير رقمي/0/سالب) → رفض صريح: رسالة سبب +
         القراءات كاملة في قائمة بلا رسم نسبي (نفس renderScaleRefusal).
       - معلن أصغر من أكبر قيمة → تجاوز: الافتراضي «رفض»؛ خيار صريح
         data-overscale="rescale" يرسم بمقياس موسّع يستوعب القيم مع
         ملاحظة ظاهرة — وفي كل الأحوال r = Rmax×√(value/vmax) ≤ Rmax
         لأن vmax ≥ أكبر قيمة مرسومة (لا تجاوز صامت للحد المعلن). */
    var rawMax = chart.getAttribute('data-max');
    var hasDeclared = rawMax !== null && String(rawMax).trim() !== '';
    var declared = hasDeclared ? parseNum(rawMax) : null;
    var largest = positive.length
      ? Math.max.apply(null, positive.map(function (i) { return i.value; }))
      : 0;
    var scaleKind = 'auto';
    if (hasDeclared) {
      if (declared === null || declared <= 0) scaleKind = 'invalid';
      else if (largest > declared) scaleKind = 'over';
      else scaleKind = 'ok';
    }
    if (scaleKind === 'invalid') {
      plot.innerHTML = '';
      renderScaleRefusal(chart, items, plot, { kind: 'invalid' },
        'تعذر عرض الدوائر بهذا النطاق. القيم متاحة أدناه.',
        'bubbles: data-max="' + rawMax + '" غير رقمي/غير موجب — مقياس غير قابل للاستخدام (عقد A01 نفسه bars/line)؛ رُفض الرسم النسبي والقيم معروضة كاملة.');
      return;
    }
    if (scaleKind === 'over' && (chart.getAttribute('data-overscale') || 'refuse') !== 'rescale') {
      plot.innerHTML = '';
      renderScaleRefusal(chart, items, plot, { kind: 'over' },
        'تعذر عرض الدوائر بهذا النطاق. القيم متاحة أدناه.',
        'bubbles: أكبر قيمة (' + fmt(largest) + ') تتجاوز data-max="' + fmt(declared) + '" — كان نصف القطر سيتجاوز rmax المعلن بصمت (r = Rmax×√(v/vmax) > Rmax)؛ صحّح data-max أو استخدم data-overscale="rescale" لتوسيع المقياس بشكل معلن.');
      return;
    }
    var vmax = (scaleKind === 'ok') ? declared : Math.max(largest, 1);
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
    if (scaleKind === 'over') {
      /* W3.2: خيار rescale الصريح — التوسيع معلن ظاهرًا لا خفي */
      var note = document.createElement('p');
      note.className = 'm-chart__scale-note';
      note.textContent = 'نطاق الدوائر: ' + fmt(vmax) + ' بدل ' + fmt(declared) + ' — القيم الأصلية دون تغيير.';
      plot.appendChild(note);
      chart.setAttribute('data-scale-state', 'over-rescaled');
      chart.setAttribute('data-scale-detail', 'bubbles: data-overscale="rescale" — رسم بمقياس موسّع من ' + fmt(declared) + ' إلى ' + fmt(vmax) + '؛ القيم الأصلية دون تغيير، ولا نصف قطر يتجاوز rmax.');
    }
  }

  /* ---- R3-UI01: رصد عرض الحاوية — إعادة قياس ورسم تلقائية (bars/line) ----
     عقد R2-UI02 يقيس العرض عند الـrender فقط؛ تغيير عرض الحاوية بعد
     الرسم بلا نقرة إضافية كان يُبقي مقاييس النص القديمة (430→320 دون
     إعادة فتح: 11.7/10.8px بدل 13/12 المعلنة). الحل هنا: مراقب
     ResizeObserver واحد لكل رسم (WeakMap — التهيئة المزدوجة لـ init()
     لا تنشئ مراقبًا ثانيًا ولا تضاعف الأحداث)، يراقب العرض فقط
     (contentRect.width) لا الارتفاع — الرسم لا يغيّر عرض حاويته فلا
     حلقة رصد — ويعيد الرسم عند تغيّر ≥0.5px عن آخر عرض رُسم عنه
     (يخزّنه render نفسه في renderWidths). الاختفاء (عرض 0) لا يعيد
     الرسم: الإظهار يطلق الرصد بنفسه فيعيد القياس. الدونات (148 الثابت)
     والفقاعات (تدفق DOM) خارج الرصد عقدًا. بيئة بلا ResizeObserver
     تبقي سلوك R2: المستهلك يعيد الرسم عند الفتح (عقد specification.md).
     كل إعادة رسم تطلق micro-data:rendered كما هي (لا تضاعف اصطناعيًا)،
     وdisconnect(root) يفصل المراقبين تحت جذر لدورة التنظيف — معالج
     DOMContentLoaded يسجّل مرة واحدة عند تحميل الوحدة ولا يتكرر. */
  var renderWidths = new WeakMap(); /* chart → آخر عرض رُسم عنده (px) */
  var plotObservers = new WeakMap(); /* chart → ResizeObserver وحيد */
  var RESIZE_EPS = 0.5;

  function observePlot(chart) {
    if (typeof ResizeObserver !== 'function') return; /* R3-UI01: بيئة قديمة — عقد الرسم عند الفتح يبقى */
    if (plotObservers.has(chart)) return; /* مراقب واحد لكل رسم — علامة الوجود */
    var plot = chart.querySelector('[data-plot]');
    if (!plot) return;
    var ro = new ResizeObserver(function (entries) {
      var w = entries.length ? entries[0].contentRect.width : 0; /* العرض فقط */
      if (w <= 1) return; /* مخفي: احتفظ بآخر رسم — الإظهار يطلق الرصد */
      var last = renderWidths.get(chart);
      if (last !== undefined && Math.abs(w - last) < RESIZE_EPS) return;
      render(chart); /* إعادة قياس ورسم كاملة — حدث rendered كما هو */
    });
    ro.observe(plot);
    plotObservers.set(chart, ro);
  }

  /* R3-UI01: render نفسه يخزّن آخر عرض رُسم عنه ويلحق المراقب (مرة واحدة) */
  function rememberRenderWidth(chart) {
    var plot = chart.querySelector('[data-plot]');
    if (!plot) return;
    renderWidths.set(chart, plot.getBoundingClientRect().width);
    observePlot(chart);
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
    /* W3.1: اسم ووصف الرسم مربوطان برمجيًا بعد التصيير (العنوان المرئي
       مصدر الاسم، والملخص وصف مرتبط) — انظر linkChartName */
    linkChartName(chart);
    /* W3.1 (D-UI-04): إفصاح بيانات داخل الرسم — الجدول يعاد بناؤه من
       dataset الحالي في كل دورة فلا انحراف بنيوي ممكن */
    syncDatasetTable(chart, items);
    /* R3-UI01: خزّن عرض الرسم الحالي وألحق المراقب — bars/line فقط */
    if (kind === 'bars' || kind === 'line') rememberRenderWidth(chart);
    /* W3.3 (A4-D04): الملخص يتبع المصدر في كل دورة تصيير — data-summary-text
       هو مصدر نص الملخص ويُزامن دائمًا عند وجوده (كان يكتب مرة واحدة عند
       الفراغ فقط فيبقى وصف قديم مرتبطًا برسم جديد بعد تغيير البيانات).
       غياب السمة يترك نص المستهلك كما هو — الملكية موثقة: من يغيّر
       البيانات يحدّث data-summary-text، والمكوّن يضمن المزامنة. */
    if (summary && chart.getAttribute('data-summary-text') !== null) {
      summary.textContent = chart.getAttribute('data-summary-text');
    }
    chart.dispatchEvent(new CustomEvent('micro-data:rendered', { bubbles: true, detail: { kind: kind } }));
  }

  window.MicroData = {
    /* W2.5 (A2-F08): init(root) يعالج الجذر نفسه إن طابق [data-chart] ثم
       الأبناء — نفس عقد init الموحد للعائلات؛ إعادة init آمنة (render
       idempotent والمراقب واحد لكل رسم عبر WeakMap). */
    init: function (root) {
      var scope = root || document;
      var charts = [].slice.call(scope.querySelectorAll('[data-chart]'));
      if (scope.nodeType === 1 && scope.matches('[data-chart]')) charts.unshift(scope);
      charts.forEach(function (c) {
        render(c);
      });
    },
    /* إعادة تصيير رسم واحد بعد تعديل بيانات المصدر (يستخدمه الفحص) */
    render: render,
    /* R3-UI01: فصل مراقبي الرصد تحت جذر لدورة التنظيف؛ init/render
       يظلان متاحين ويعيدان الإلحاق عند الحاجة، ومعالج DOMContentLoaded
       المسجل مرة واحدة عند تحميل الوحدة لا يتكرر */
    disconnect: function (root) {
      (root || document).querySelectorAll('[data-chart]').forEach(function (c) {
        var ro = plotObservers.get(c);
        if (ro) { ro.disconnect(); plotObservers.delete(c); }
        renderWidths.delete(c);
      });
    }
  };
  document.addEventListener('DOMContentLoaded', function () { window.MicroData.init(); });
  if (document.readyState !== 'loading') window.MicroData.init();

  /* F-01 (2026-10-10): جاهزية الخط — الرسم الأول قد يقيس بمقاييس خط
     بديل قبل تحميل IBM Plex العربي فيختلف أول تصيير عن إعادة التصيير
     (مرصود فعليًا: «مش…» قبل الجاهزية مقابل «مشتر…» بعدها في نفس
     البيانات). بعد document.fonts.ready تُعاد رسوم bars/line المُهيّأة
     مرة واحدة (نفس نمط packed-circle الموثق) فتستقر المواءمة على
     قياسات الخط الفعلي، وكل إعادة تصيير لاحقة مطابقة لها (render
     idempotent والمراقب واحد لكل رسم — لا أثر جانبي). */
  function refitChartsOnFontsReady() {
    if (!document.fonts || !document.fonts.ready) return;
    document.fonts.ready.then(function () {
      [].slice.call(document.querySelectorAll('[data-chart]')).forEach(function (c) {
        var kind = c.getAttribute('data-chart');
        if (kind === 'bars' || kind === 'line') render(c);
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refitChartsOnFontsReady, { once: true });
  } else {
    refitChartsOnFontsReady();
  }
})();
