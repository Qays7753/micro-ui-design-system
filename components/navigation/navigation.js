/* =========================================================
   Micro UI — سلوك مكوّن التنقّل والطبقات (B07)
   الملف: components/navigation/navigation.js
   عقد عام فقط:
   MicroNavigation.openLayer(layerEl, {trigger, backdropEl})
   MicroNavigation.closeLayer(layerEl)
   - تركيز يُدار: التقاط المشغّل قبل نقل التركيز داخل الطبقة،
     أول عنصر تفاعلي عند الفتح، واستعادته عند الإغلاق إلى هدف
     صالح داخل المستند (وليس إلى ابن مخفي).
   - R2-02: طبقة بلا أي عنصر تفاعلي تستقبل التركيز بنفسها
     (tabindex="-1" تُضاف تلقائيًا) — «بلا استثناء» ليس كافيًا؛
     التركيز داخل الطبقة شرط معلن ومفحوص.
   - عزل خلفية فعلي (inert) بأشقّاء مناسبين (R2-02): إن كانت
     الطبقة داخل غلاف (مثل main) لا يُعزَّل الغلاف كله — يُعزَّل
     كل ابن خارج سلسلة أسلاف الطبقة في كل مستوى، فتبقى الطبقة
     نفسها وغشاؤها متاحين وسائر الصفحة معزولة.
   - حصر Tab/Shift+Tab داخل الطبقة + قفل تمرير الصفحة بعدّاد
     (R2-02: طبقات متتالية أثناء الخفوت لا تفسد قيمة overflow
     السابقة ولا تترك body مقفولًا) مع حفظ القيمة واسترجاعها.
   - R2-02: دورة حياة واحدة آمنة — إعادة فتح أثناء الخفوت تلغي
     دورة الإغلاق القديمة (توليد لكل إغلاق) فلا يخفي مؤقت قديم
     طبقة مفتوحة جديدة، والإغلاق النهائي يسترجع overflow والتركيز.
   - Escape: مستمع واحد على document (مهما تكرر init) يغلق أعلى
     طبقة مرة واحدة؛ الفتح المتكرر لنفس الطبقة آمن (لا تكرار في
     المكدس) والتهيئة المتكررة آمنة.
   - اسم الخيار المعلن = المنفَّذ: backdropEl (مع دعم السمة
     data-backdrop-id على الطبقة، والغشاء data-for="id").
   - سياسة الضغط بالخلفية من سمة data-backdrop على الطبقة
     ("close" الافتراضي للغير المتلف، "keep" للحوار المتلف).
   - إغلاق ظاهر دائمًا (زر) — السحب ليس وسيلة الإغلاق الوحيدة.
   - حركة فتح/إغلاق موصولة بـ shared/motion.css (MOT-01):
     الإغلاق عبر data-closing والفتح عبر data-opening (R2-02:
     طور بداية فعلي يثبت انتقال فتح 240ms لا ظهورًا مباشرًا)،
     مع احترام prefers-reduced-motion فعليًا، ولا يبقى عنصر
     مخفي قابلًا للتركيز أثناء الخفوت.
   - تبويبات: [data-tabs] بأسهم وتبديل لوحات مرتبطة aria-controls.
   - لوحة الفلاتر: [data-filter-panel] بعقد تطبيق/مسح/إلغاء يفرّق
     الجاري عن المطبّق. كل input ذو data-filter-key (checkbox أو
     نص/بحث أو select) جزء من العقد نفسه: الجاري يتبع التغيير
     فعليًا (حدث change)، والتطبيق يجمع القيم غير الفارغة، والمسح
     يفرّغ الجميع، والإلغاء يرمي الجاري. تفاصيل initFilterPanel.
   لا هندسة تنقل جديدة ولا شاشات فعلية.
   ========================================================= */

(function () {
  'use strict';

  var openLayers = [];
  var lockCount = 0;         /* R2-02: عدّاد قفل التمرير — لا تلف قيمة overflow السابقة */
  var prevOverflow = null;   /* قيمة overflow السابقة على body */
  var inertRestore = [];     /* [{el, inert}] — استرجاع دقيق */
  var closeState = new WeakMap(); /* R2-02: layer → {gen, timer, onEnd} — إلغاء إغلاق قديم */
  var escapeBound = false;
  var doc = document;
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function inDocument(el) {
    return !!(el && el.nodeType === 1 && doc.contains(el));
  }

  function isDisabled(el) {
    return el.disabled || el.getAttribute('aria-disabled') === 'true';
  }

  function focusables(layer) {
    return [].slice.call(layer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]'
    )).filter(function (el) {
      /* A02: العناصر في ترتيب Tab فعليًا فقط — استبعاد أي tabindex سالب
         على أي عنصر (كان الاستبعاد في فرع [tabindex] وحده فيمرّ أزرار
         roving tabindex=-1 كنهاية للتسلسل فيقفز Tab خارج الطبقة)،
         مع المعطل/المخفي/الخاضع لسلف inert. عقد roving نفسه محفوظ:
         لا تحويل خيارات المنتقي إلى tabindex=0. */
      if (isDisabled(el)) return false;
      var ti = el.getAttribute('tabindex');
      if (ti !== null && parseInt(ti, 10) < 0) return false;
      if (el.closest('[inert]')) return false;
      if (typeof el.checkVisibility === 'function') {
        return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      }
      return el.offsetParent !== null || el.getClientRects().length > 0;
    });
  }

  /* ---- R2-02: دورة إغلاق قابلة للإلغاء ----
     لكل طبقة توليد يتزايد عند كل فتح/إغلاق جديد؛ المؤقت و
     transitionend القديمان يفحصان التوليد فيصيران لا عمليّين
     إذا فُتحت الطبقة مجددًا قبل انتهاء خفوتها. */
  function genOf(layer) {
    var s = closeState.get(layer);
    if (!s) { s = { gen: 0, timer: null, onEnd: null, closing: false }; closeState.set(layer, s); }
    return s;
  }

  function cancelScheduledClose(layer) {
    var s = closeState.get(layer);
    if (!s) return;
    s.gen++; /* يُبطل أي onEnd معلّق */
    if (s.closing) {
      /* R2-02: إغلاق مُعلّق أُلغي بإعادة فتح — يُفرج عن قفله فورًا كي
         لا يبقى body مقفولًا بقفل يتيم، والفتح الجديد يقفل من جديد
         فيتوزن العدّاد. */
      s.closing = false;
      unlockScroll();
    }
    if (s.timer) { window.clearTimeout(s.timer); s.timer = null; }
    if (s.onEnd) layer.removeEventListener('transitionend', s.onEnd);
    s.onEnd = null;
    layer.removeAttribute('data-closing');
    layer.removeAttribute('data-opening');
    layer.inert = false;
  }

  function transitionInstant(layer) {
    if (reduceQuery && reduceQuery.matches) return true;
    var d = getComputedStyle(layer).transitionDuration;
    return d === '0s' || d === '';
  }

  /* ---- عزل الخلفية: inert على أبناء خارج سلسلة أسلاف الطبقة (R2-02) ----
     إن كانت الطبقة داخل غلاف (main مثلًا) لا يُعزَّل الغلاف كله —
     ننزل داخله ونعزل أشقّاءها المناسبين في كل مستوى، فتبقى الطبقة
     وغشاؤها متاحين. منطقة الإعلان الحية والرسائل العابرة متاحة دائمًا. */
  function allowedOutside(el) {
    return el.classList.contains('m-live-region') || el.classList.contains('m-toast');
  }

  function isolateSiblings(container, layer, backdrop) {
    [].slice.call(container.children).forEach(function (el) {
      if (el === layer || el === backdrop) return;
      if (allowedOutside(el)) return;
      if (el.contains(layer)) { isolateSiblings(el, layer, backdrop); return; } /* سلف الطبقة: أعزل أشقاءه فقط */
      inertRestore.push({ el: el, inert: el.inert });
      el.inert = true;
    });
  }

  function applyBackgroundInert() {
    releaseBackgroundInert();
    if (!openLayers.length) return;
    var top = openLayers[openLayers.length - 1];
    isolateSiblings(doc.body, top.layer, top.backdrop);
  }

  function releaseBackgroundInert() {
    inertRestore.forEach(function (r) { r.el.inert = r.inert; });
    inertRestore = [];
  }

  /* ---- قفل التمرير بعدّاد (R2-02): فتح/إغلاق متقاطع لا يفسد القيمة السابقة ---- */
  function lockScroll() {
    if (lockCount === 0) {
      prevOverflow = doc.body.style.overflow;
      doc.body.style.overflow = 'hidden';
    }
    lockCount++;
  }

  function unlockScroll() {
    if (lockCount > 0) lockCount--;
    if (lockCount === 0 && prevOverflow !== null) {
      doc.body.style.overflow = prevOverflow === '' ? '' : prevOverflow;
      prevOverflow = null;
    }
  }

  /* ---- حصر التركيز داخل الطبقة العليا ---- */
  function bindTrap(layer) {
    if (layer.dataset.microTrapBound) return;
    layer.dataset.microTrapBound = '1';
    layer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !openLayers.length) return;
      if (openLayers[openLayers.length - 1].layer !== layer) return;
      var f = focusables(layer);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      var active = doc.activeElement;
      if (!layer.contains(active)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- R2-02: انتقال فتح فعلي (MOT-01) ----
     الحالة البادئة data-opening (شفاف + إزاحة) تُعرض إطارًا فعليًا
     (إطاران للأمان) ثم تُنزع فيبدأ الانتقال إلى الظهور الكامل 240ms —
     النزع في المهمة نفسها لا يبدأ انتقالًا لأن الظهور الأول لم يتم بعد.
     مع reduced-motion أو زمن 0s: ظهور فوري بلا طور بداية. */
  function playOpenTransition(layer) {
    if (transitionInstant(layer)) return;
    layer.setAttribute('data-opening', 'true');
    var s = genOf(layer);
    var myGen = s.gen;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (s.gen === myGen) layer.removeAttribute('data-opening');
      });
    });
  }

  function openLayer(layer, options) {
    options = options || {};
    if (!layer || layer.tagName !== 'DIV') return;
    /* R2-02: إلغاء أي دورة إغلاق قديمة أولًا — إعادة الفتح أثناء الخفوت آمنة */
    cancelScheduledClose(layer);
    /* فتح متكرر لنفس الطبقة: آمن — إعادة تركيز دون تكرار في المكدس */
    if (openLayers.some(function (o) { return o.layer === layer; })) {
      var cur = focusables(layer)[0];
      if (cur) cur.focus(); else layer.focus();
      return;
    }
    /* اسم موحد معلن = منفَّذ: options.backdropEl */
    var backdrop = options.backdropEl
      || (layer.getAttribute('data-backdrop-id') ? doc.getElementById(layer.getAttribute('data-backdrop-id')) : null)
      || doc.querySelector('.m-layer-backdrop[data-for="' + layer.id + '"]');
    /* التقاط المشغّل قبل نقل التركيز — وإلا يكون الالتقاط ابنًا داخل الطبقة.
       R2-02: عند إعادة الفتح والتركيز داخل الطبقة أصلاً (حالة الإغلاق/الفتح
       المتقاطع)، يُستعمل مشغّل الدورة السابقة المحفوظ كي لا يضيع الاسترجاع. */
    var st = closeState.get(layer);
    var trigger = options.trigger || doc.activeElement;
    if (!inDocument(trigger) || layer.contains(trigger)) {
      trigger = (st && st.lastTrigger && inDocument(st.lastTrigger)) ? st.lastTrigger : null;
    }
    if (trigger && isDisabled(trigger)) trigger = null;

    layer.hidden = false;
    layer.inert = false;
    if (backdrop) backdrop.hidden = false;
    lockScroll();
    bindTrap(layer);
    /* R2-02: هدف تركيز دائم داخل الطبقة — الطبقة الخالية من عناصر
       تفاعلية تستقبل التركيز بنفسها بدل بقاء المشغّل خارجها */
    if (!layer.hasAttribute('tabindex')) layer.setAttribute('tabindex', '-1');
    openLayers.push({ layer: layer, backdrop: backdrop, trigger: trigger });
    applyBackgroundInert(); /* حرر أسلاف العليا قبل محاولة focus */
    var f = focusables(layer);
    var first = layer.querySelector('[data-autofocus]');
    if (!(first && !isDisabled(first) && f.indexOf(first) >= 0)) first = f[0];
    if (first) first.focus(); else layer.focus();
    playOpenTransition(layer);
    layer.dispatchEvent(new CustomEvent('micro-navigation:opened', { bubbles: true }));
  }

  function closeLayer(layer) {
    if (!layer) return;
    /* إغلاق سلف لا يترك طبقة ابنة مفتوحة داخل hidden. أغلق الأبناء
       أولًا؛ تبقى قفلة التمرير لكل طبقة محفوظة حتى اكتمال انتقالها. */
    openLayers.slice().reverse().forEach(function (o) {
      if (o.layer !== layer && layer.contains(o.layer)) closeLayer(o.layer);
    });
    var idx = -1;
    for (var i = 0; i < openLayers.length; i++) {
      if (openLayers[i].layer === layer) { idx = i; break; }
    }
    if (idx < 0) return;
    var entry = openLayers.splice(idx, 1)[0];
    cancelScheduledClose(layer);

    function finish() {
      layer.hidden = true;
      layer.removeAttribute('data-closing');
      layer.inert = false;
      if (entry.backdrop) entry.backdrop.hidden = true;
      unlockScroll(); /* R2-02: كل طبقة تفرج عن قفلها الذي أخذته عند فتحها —
                         الطبقات المتراكبة لا تسرّب قفلًا واحدًا */
      if (openLayers.length) applyBackgroundInert(); /* بقاء عزل لبقية المكدس */
      else releaseBackgroundInert();
      /* استعادة التركيز إلى مشغّل صالح داخل المستند فقط */
      var t = entry.trigger;
      var top = openLayers.length ? openLayers[openLayers.length - 1].layer : null;
      var usable = t && inDocument(t) && !isDisabled(t)
        && !t.closest('[inert], [hidden]') && (!top || top.contains(t));
      if (usable && typeof t.focus === 'function') t.focus();
      else if (top) {
        var target = focusables(top)[0] || top;
        target.focus();
      }
      layer.dispatchEvent(new CustomEvent('micro-navigation:closed', { bubbles: true }));
    }

    if (layer.hidden) { finish(); return; }
    /* الخفوت: الطبقة غير قابلة للتركيز فورًا (لا عنصر مخفي قابل للتركيز) */
    if (transitionInstant(layer)) { finish(); return; }
    layer.inert = true;
    layer.setAttribute('data-closing', 'true');
    var s = genOf(layer);
    var myGen = s.gen;
    s.closing = true; /* قفل معلّق حتى يكتمل onEnd أو يُلغى */
    if (entry.trigger) s.lastTrigger = entry.trigger; /* R2-02: لإعادة الفتح أثناء الخفوت */
    var done = false;
    function onEnd() {
      if (done || s.gen !== myGen) return; /* R2-02: فتح جديد ألغى هذا الإغلاق */
      done = true;
      s.closing = false;
      layer.removeEventListener('transitionend', onEnd);
      if (s.timer) { window.clearTimeout(s.timer); s.timer = null; }
      finish();
    }
    s.onEnd = onEnd;
    layer.addEventListener('transitionend', onEnd);
    s.timer = window.setTimeout(onEnd, 320); /* احتياط لو لم يُطلق transitionend */
  }

  /* فلاتر: عقد الجاري/المطبّق — كل input ذو data-filter-key جزء من العقد */
  function draftInputs(panel) {
    return [].slice.call(panel.querySelectorAll('[data-filter-key]'));
  }

  function inputActive(input) {
    if (input.type === 'checkbox' || input.type === 'radio') return input.checked;
    return String(input.value == null ? '' : input.value).trim() !== '';
  }

  /* F02-P03: تسمية بشرية لكل فلتر — data-filter-label أولًا، ثم التسمية
     المرتبطة فعليًا (label[for] أو label حاوية)، وإلا نص فارغ يعطي ملخص
     عدد محايدًا بلا اسم المفتاح الداخلي. قيمة البحث الخام لا تظهر في
     الملخص إطلاقًا، ولا توجد عبارة «العدّاد يخفي 0». */
  function filterLabel(input) {
    var attr = input.getAttribute('data-filter-label');
    if (attr && attr.trim()) return attr.trim();
    var lab = null;
    var id = input.id;
    if (id) {
      try { lab = doc.querySelector('label[for="' + String(id).replace(/"/g, '') + '"]'); } catch (err) { lab = null; }
    }
    if (!lab && input.closest) lab = input.closest('label');
    if (lab) {
      var t = String(lab.textContent || '').replace(/\s+/g, ' ').trim();
      if (t) return t;
    }
    return '';
  }

  function updateSummary(panel, phase) {
    var summary = panel.querySelector('[data-filter-summary]');
    if (!summary) return;
    var actives = draftInputs(panel).filter(function (input) {
      var key = input.getAttribute('data-filter-key');
      return !!key && key !== 'none' && inputActive(input);
    });
    if (!actives.length) { summary.textContent = phase + ': لا فلاتر'; return; }
    var labels = [];
    actives.forEach(function (input) {
      var l = filterLabel(input);
      if (l && labels.indexOf(l) < 0) labels.push(l);
    });
    /* كل الشرطات لها تسمية بشرية → ملخص بالتسميات؛ وإلا ملخص عدد
       محايد بلا أسماء مفاتيح. event.detail.count/applied وdraft/applied
       سليمة كما هي — هذا النص عرض فقط. */
    summary.textContent = labels.length === actives.length
      ? phase + ': ' + labels.join('، ')
      : phase + ': ' + (actives.length === 1 ? 'فلتر واحد' : actives.length + ' فلاتر');
  }

  function initFilterPanel(panel) {
    if (panel.dataset.microFilterBound) return;
    panel.dataset.microFilterBound = '1';
    var applied = {}; /* المطبّق: آخر قيم أُقرّت — checkbox: true/false، نص: string */
    panel.addEventListener('micro-navigation:opened', function () {
      /* الجاري يبدأ نسخة من المطبّق عند كل فتح — لكل الأنواع */
      draftInputs(panel).forEach(function (input) {
        var key = input.getAttribute('data-filter-key');
        if (Object.prototype.hasOwnProperty.call(applied, key)) {
          if (input.type === 'checkbox') input.checked = applied[key] === true;
          else input.value = typeof applied[key] === 'string' ? applied[key] : '';
        } else if (input.type === 'checkbox') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
      updateSummary(panel, 'الجاري');
    });
    /* الملخص يتبع الجاري فعليًا عند أي تغيير (وليس عند الفتح/التطبيق فقط) */
    panel.addEventListener('change', function (e) {
      if (e.target.closest && e.target.closest('[data-filter-key]')) updateSummary(panel, 'الجاري');
    });
    panel.addEventListener('input', function (e) {
      if (e.target.closest && e.target.closest('[data-filter-key][type="search"], [data-filter-key][type="text"]')) {
        updateSummary(panel, 'الجاري');
      }
    });
    var apply = panel.querySelector('[data-filter-apply]');
    if (apply) apply.addEventListener('click', function () {
      applied = {};
      draftInputs(panel).forEach(function (input) {
        var key = input.getAttribute('data-filter-key');
        if (!key || key === 'none') return;
        if (input.type === 'checkbox') applied[key] = input.checked;
        else applied[key] = String(input.value == null ? '' : input.value).trim();
      });
      updateSummary(panel, 'المطبّق');
      panel.__microApplied = Object.assign({}, applied); /* قراءة لاحقة للفحص/المستهلك */
      var count = Object.keys(applied).filter(function (k) {
        return applied[k] === true || (typeof applied[k] === 'string' && applied[k] !== '');
      }).length;
      panel.dispatchEvent(new CustomEvent('micro-navigation:filters-applied', {
        bubbles: true, detail: { applied: Object.assign({}, applied), count: count }
      }));
      closeLayer(panel);
    });
    var clear = panel.querySelector('[data-filter-clear]');
    if (clear) clear.addEventListener('click', function () {
      draftInputs(panel).forEach(function (input) {
        if (input.disabled || input.readOnly) return;
        if (input.type === 'checkbox') input.checked = false;
        else input.value = '';
      });
      updateSummary(panel, 'الجاري');
    });
    var cancel = panel.querySelector('[data-filter-cancel]');
    if (cancel) cancel.addEventListener('click', function () { closeLayer(panel); }); /* يرمي الجاري */
    /* (F03-R2-03) مزامنة المطبّق من الخارج بعقد موثق: يحدّث المتغير الداخلي
       `applied` نفسه (لا نسخة عرض) ومسودة الفتح التالي والملخص و
       __microApplied معًا — بقية العقد (مسح/إلغاء داخل اللوحة ترمي الجاري
       وحده) كما هي. القيم {key: true|false|نص}؛ مفتاح بلا input في اللوحة
       يُهمل، ومدخل بلا قيمة في values يُصفَّر (false/نص فارغ). التغيير
       موثق في مواصفة navigation مع رجعية F02. */
    panel.__microSetApplied = function (values) {
      applied = {};
      var src = values && typeof values === 'object' ? values : {};
      draftInputs(panel).forEach(function (input) {
        var key = input.getAttribute('data-filter-key');
        if (!key || key === 'none') return;
        var has = Object.prototype.hasOwnProperty.call(src, key);
        if (input.type === 'checkbox') {
          applied[key] = has ? src[key] === true : false;
          input.checked = applied[key] === true;
        } else {
          applied[key] = has && typeof src[key] === 'string' ? String(src[key]).trim() : '';
          input.value = applied[key];
        }
      });
      updateSummary(panel, 'المطبّق');
      panel.__microApplied = Object.assign({}, applied);
    };
  }

  /* تبويبات المحتوى — W1.1/W1.2 (2026-10 إصلاح جذري):
     - D-UI-01 (قرار مالك): سياسة الصف الواحد — `.m-tabs` يمرر أفقيًا
       (overflow-x:auto في CSS)؛ عند الاختيار يُمرَّر التبويب المحدد
       إلى الحيز المرئي (scrollIntoView بـinline:'nearest' وblock:'nearest'
       كي لا يقفز التمرير الرأسي للصفحة)، وHome/End ينقلان إلى طرفي
       القائمة وفق WAI-ARIA APG. لا قص ولا تصغير ولا التفاف لصفوف.
     - A3-F01 (W1.2): اللوحة النشطة الخالية من أهداف تركيز داخلية تدخل
       ترتيب Tab بـtabindex=0 وفق APG (النمط: tab نشط → Tab → اللوحة)؛
       نتعقب ملكيتنا للسمة عبر data-micro-tabs-panel حتى لا نلمس tabindex
       وضعه المستهلك؛ اللوحة ذات الأهداف الداخلية تُعاد لوضعها الطبيعي
       (إزالة tabindex الذي أضفناه فقط)، واللوحات غير النشطة مخفية
       (hidden) فتخرج من الترتيب تلقائيًا. */
  function initTabs(tabs) {
    if (tabs.dataset.microTabsBound) return;
    tabs.dataset.microTabsBound = '1';
    var items = [].slice.call(tabs.querySelectorAll('[role="tab"]'));
    var FOCUSABLE_IN = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    function panelOf(t) {
      var id = t.getAttribute('aria-controls');
      return id ? document.getElementById(id) : null;
    }
    function syncPanelTabindex(activeTab) {
      items.forEach(function (t) {
        var panel = panelOf(t);
        if (!panel) return;
        var ours = panel.getAttribute('data-micro-tabs-panel') === '1';
        var focusableInside = panel.querySelector(FOCUSABLE_IN);
        if (t === activeTab && !focusableInside) {
          if (!panel.hasAttribute('tabindex')) {
            panel.setAttribute('tabindex', '0');
            panel.setAttribute('data-micro-tabs-panel', '1');
          }
        } else if (ours) {
          panel.removeAttribute('tabindex');
          panel.removeAttribute('data-micro-tabs-panel');
        }
      });
    }
    function keepVisible(tab) {
      if (tab && typeof tab.scrollIntoView === 'function') {
        try { tab.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* بيئة بلا خيارات: السلوك الافتراضي */ }
      }
    }
    function select(tab) {
      items.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = panelOf(t);
        if (panel) panel.hidden = !on;
      });
      syncPanelTabindex(tab);
      keepVisible(tab); /* D-UI-01: التبويب المحدد يبقى مرئيًا */
    }
    items.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowLeft') next = items[(i + 1) % items.length];      /* RTL: يسار = التالي */
        else if (e.key === 'ArrowRight') next = items[(i - 1 + items.length) % items.length];
        else if (e.key === 'Home') next = items[0];                           /* W1.1: APG — أول تبويب */
        else if (e.key === 'End') next = items[items.length - 1];             /* W1.1: APG — آخر تبويب */
        if (next) {
          e.preventDefault();
          next.focus();
          keepVisible(next);
          select(next);
        }
      });
    });
    /* الحالة الابتدائية: اللوحة الظاهرة (التبويب المحدد في الترميز) تدخل
       ترتيب Tab إن كانت بلا أهداف داخلية — قبل أي تفاعل */
    var initial = items.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || items[0];
    if (initial) syncPanelTabindex(initial);
  }

  function bindDocumentOnce() {
    /* Escape: مستمع واحد مهما تكرر init — يغلق أعلى طبقة مرة واحدة */
    if (escapeBound) return;
    escapeBound = true;
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openLayers.length) {
        closeLayer(openLayers[openLayers.length - 1].layer);
      }
    });
  }

  function init(root) {
    var scope = root || document;
    bindDocumentOnce();
    scope.querySelectorAll('[data-layer-open]').forEach(function (btn) {
      if (btn.dataset.microLayerOpenBound) return;
      btn.dataset.microLayerOpenBound = '1';
      btn.addEventListener('click', function () {
        var layer = document.getElementById(btn.getAttribute('data-layer-open'));
        if (layer) openLayer(layer, { trigger: btn });
      });
    });
    scope.querySelectorAll('[data-layer-close]').forEach(function (btn) {
      if (btn.dataset.microLayerCloseBound) return;
      btn.dataset.microLayerCloseBound = '1';
      btn.addEventListener('click', function () {
        closeLayer(btn.closest('.m-layer'));
      });
    });
    scope.querySelectorAll('.m-layer-backdrop[data-for]').forEach(function (bd) {
      if (bd.dataset.microBackdropBound) return;
      bd.dataset.microBackdropBound = '1';
      bd.addEventListener('click', function () {
        var layer = document.getElementById(bd.getAttribute('data-for'));
        if (!layer) return;
        /* سياسة الضغط بالخلفية من السمة: close (افتراضي) أو keep للمتلف */
        if ((layer.getAttribute('data-backdrop') || 'close') === 'close') closeLayer(layer);
      });
    });
    scope.querySelectorAll('[data-tabs]').forEach(initTabs);
    scope.querySelectorAll('[data-filter-panel]').forEach(initFilterPanel);
  }

  window.MicroNavigation = {
    init: init,
    openLayer: openLayer,
    closeLayer: closeLayer,
    /* قراءة المطبّق الحالي — للفحص والمستهلك */
    appliedFilters: function (panel) {
      return panel && panel.__microApplied ? Object.assign({}, panel.__microApplied) : {};
    },
    /* (F03-R2-03) مزامنة المطبّق من الخارج بعقد موثق — انظر initFilterPanel.
       تغيير محدود موثق في مواصفة navigation مع رجعية F02. */
    setAppliedFilters: function (panel, values) {
      if (panel && typeof panel.__microSetApplied === 'function') panel.__microSetApplied(values);
    }
  };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();
