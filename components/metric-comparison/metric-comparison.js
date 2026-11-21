/* Numeric comparison primitives. The consumer owns meaning, units and formatting. */

import { getLabel, registerLabels, setLabels as setFamilyLabels } from '../../shared/labels.js';
import { globalApi } from '../../shared/integrations.js';
import { instanceRegistry } from '../../shared/lifecycle.js';
import { defaults as familyDefaults } from './labels.js';

registerLabels('metric-comparison', familyDefaults);
  /* ---- المرحلة 7 / الجولة الثانية R2 — النصوص الافتراضية: تُقرأ من سجل
     النصوص المشترك (shared/labels.js) وقت الاستخدام (لا عند التحميل)
     كي يعمل setLabels؛ العائلة تسجّل نصوصها الافتراضية عند الاستيراد. ---- */
  var MICRO_LABELS_FAMILY = 'metric-comparison';
  function L(key) {
    return getLabel(MICRO_LABELS_FAMILY, key);
  }

  var NUMBER_RE = /^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

  var SERIES = { a: true, b: true, c: true, d: true, e: true };

  function readNumber(raw) {
    if (raw === null || raw === undefined || String(raw).trim() === '') return { state: 'missing', value: null };
    var text = String(raw).trim().replace(/^\u2212/, '-');
    if (!NUMBER_RE.test(text)) return { state: 'invalid', value: null };
    var value = Number(text.replace(/,/g, ''));
    if (!isFinite(value)) return { state: 'invalid', value: null };
    return { state: value < 0 ? 'negative' : value === 0 ? 'zero' : 'positive', value: value };
  }

  function seriesOf(node) {
    var key = node.getAttribute('data-series') || 'a';
    return SERIES[key] ? key : 'a';
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* R2-UI03: عقد تشخيص الجذر — نفس نمط B05 (R8-07/07a/07b): رسالة
     المستخدم في عنصر الملاحظة موجزة بلا أسماء سمات ولا تعليمات للمبرمج،
     والسبب التقني الكامل في data-scale-state/data-scale-detail على
     جذر المكوّن. تُمسح السمتان في أول كل render — دون شرط وجود عنصر
     ملاحظة — ثم تُكتب حالة الدورة الحالية وحدها، فلا يبقى تشخيص دورة
     سابقة بعد invalid→valid على العقدة نفسها. */
  function clearDiagnostics(chart) {
    chart.removeAttribute('data-scale-state');
    chart.removeAttribute('data-scale-detail');
  }

  function writeDiagnostics(chart, state, detail) {
    chart.setAttribute('data-scale-state', state);
    chart.setAttribute('data-scale-detail', detail);
  }

  function circleItems(chart) {
    clearDiagnostics(chart); /* R2-UI03: كل دورة تبدأ نظيفة حتى دون عنصر ملاحظة */
    var source = chart.querySelector('[data-metric-source]');
    var target = chart.querySelector('[data-metric-items]');
    var fallbackTarget = chart.querySelector('[data-metric-fallback]');
    var empty = chart.querySelector('[data-metric-empty]');
    if (!source || !target) return;
    if (!fallbackTarget) {
      fallbackTarget = make('ul', 'm-metric-circles__fallback');
      fallbackTarget.setAttribute('data-metric-fallback', '');
      fallbackTarget.setAttribute('aria-label', L('k1'));
      target.insertAdjacentElement('afterend', fallbackTarget);
    }
    var items = Array.prototype.slice.call(source.querySelectorAll('[data-label]')).map(function (node) {
      return {
        label: node.getAttribute('data-label') || '',
        raw: node.getAttribute('data-value'),
        display: node.getAttribute('data-display-value'),
        unit: node.getAttribute('data-unit') || chart.getAttribute('data-unit') || '',
        period: node.getAttribute('data-period') || chart.getAttribute('data-period') || '',
        state: node.getAttribute('data-state'),
        series: seriesOf(node)
      };
    });
    target.textContent = '';
    /* Circle area is the only information encoded in the drawing. Keep the
       complete, exact label/value key as one stable external reading surface. */
    target.setAttribute('aria-hidden', 'true');
    if (fallbackTarget) fallbackTarget.textContent = '';
    var known = items.map(function (item) {
      return item.state === 'invalid' || item.state === 'unavailable'
        ? null : readNumber(item.raw);
    }).filter(function (item) { return item && item.value !== null; });
    var magnitudes = known.filter(function (item) { return item.value !== 0; });
    var declaredRaw = chart.getAttribute('data-max');
    var declared = declaredRaw === null ? null : readNumber(declaredRaw);
    var measuredMax = magnitudes.reduce(function (largest, item) {
      return Math.max(largest, Math.abs(item.value));
    }, 0);
    var max = declaredRaw === null ? measuredMax : declared && declared.state === 'positive' ? declared.value : 0;
    var radiusRaw = chart.getAttribute('data-radius');
    var radiusValue = radiusRaw === null ? { state: 'positive', value: 72 } : readNumber(radiusRaw);
    var layout = chart.getAttribute('data-layout') || 'separated';
    var width = target.getBoundingClientRect().width;
    var validLayout = layout === 'separated' || layout === 'overlap';
    var validMax = declaredRaw === null || (declared && declared.state === 'positive' && declared.value >= measuredMax);
    var validRadius = radiusRaw === null || (radiusValue.state === 'positive' && radiusValue.value > 0);
    var zeroCount = known.length - magnitudes.length;
    var itemCount = known.length;
    var gap = parseFloat(window.getComputedStyle(target).columnGap) || 16;
    gap = Math.min(gap, width / Math.max(2, itemCount * 2));
    var zeroDiameter = Math.min(20, width / Math.max(2, itemCount * 2));
    var weights = magnitudes.reduce(function (sum, value) {
      return sum + Math.sqrt(Math.abs(value.value) / max);
    }, 0);
    var availableDiameter = layout === 'overlap'
      ? width * 0.57
      : weights > 0 ? Math.max(0, width - gap * Math.max(0, itemCount - 1)
        - zeroCount * zeroDiameter) / weights : width;
    var maxRadius = Math.min(radiusValue.value, Math.max(0, availableDiameter / 2));
    var geometryAllowed = validLayout && validMax && validRadius && width > 0 && measuredMax > 0;
    var positions = [
      [0.38, 0.36], [0.62, 0.36], [0.50, 0.66], [0.38, 0.66], [0.62, 0.66]
    ];
    var overlapHeight = geometryAllowed ? maxRadius * 2 * 1.55 : 0;
    target.setAttribute('data-layout', measuredMax > 0 ? layout : 'separated');
    target.style.setProperty('--m-circle-overlap-height', overlapHeight + 'px');
    target.style.columnGap = gap + 'px';
    chart.__microMetricWidth = width;
    var scaleNote = chart.querySelector('[data-metric-scale]');
    if (scaleNote) {
      scaleNote.setAttribute('data-valid', String(validLayout && validMax && validRadius && width > 0));
    }
    /* R2-UI03: تعليمات المبرمج (data-layout/data-max/data-radius) خارج نص
       المستخدم — رسالة موجزة والقراءات في القائمة البديلة دائمًا، والسبب
       التقني الكامل على الجذر عبر writeDiagnostics. الشروحات الدلالية
       للصفر/النطاق/التداخل محفوظة كما هي في الحالة السليمة. */
    if (!validLayout) {
      if (scaleNote) scaleNote.textContent = L('k2');
      writeDiagnostics(chart, 'invalid-layout',
        "metric-circles: data-layout='" + layout + L('k3'));
    } else if (!validMax) {
      if (scaleNote) scaleNote.textContent = L('k4');
      writeDiagnostics(chart, 'invalid-scale',
        "metric-circles: data-max='" + declaredRaw + L('k5') + measuredMax + L('k6'));
    } else if (!validRadius) {
      if (scaleNote) scaleNote.textContent = L('k2');
      writeDiagnostics(chart, 'invalid-radius',
        "metric-circles: data-radius='" + radiusRaw + L('k7'));
    } else if (!width) {
      if (scaleNote) scaleNote.textContent = L('k8');
      writeDiagnostics(chart, 'pending-width',
        L('k9'));
    } else if (!measuredMax) {
      if (scaleNote) scaleNote.textContent = known.length
        ? L('k10')
        : L('k11');
      writeDiagnostics(chart, known.length ? 'zero' : 'empty',
        known.length
          ? L('k12')
          : L('k13'));
    } else {
      if (scaleNote) {
        var scaledMessage = L('k14');
        if (zeroCount) scaledMessage += L('k15');
        if (declaredRaw !== null) scaledMessage += L('k16') + (chart.getAttribute('data-max-label') || declaredRaw) + '.';
        if (layout === 'overlap') scaledMessage += L('k17');
        scaleNote.textContent = scaledMessage;
      }
      /* R1-UI10: تشخيص المقياس التقني عقد للمطورين على الجذر (نفس نمط
         data-scale-detail في B05) — مصدر نصف القطر (auto أي 72 الافتراضي)
         وتكيف الحجم مع عرض البطاقة ضمنه، ومصدر المقياس (أكبر مقدار معروف
         أو المعلن) — لا يظهر في نص الواجهة.
         R2-UI03: يكتب مع حالة ok للدورة الحالية بعد المسح في أول
         circleItems — لا يبقى تشخيص دورة سابقة. */
      writeDiagnostics(chart, 'ok',
        'metric-circles: radius=' + (radiusRaw === null ? 'auto' : radiusRaw)
        + L('k18')
        + (declaredRaw === null ? 'auto-largest-known' : 'declared'));
    }

    var itemGeometry = items.map(function (item, index) {
      var value = item.state === 'invalid' || item.state === 'unavailable' ? null : readNumber(item.raw);
      var magnitude = value && value.value !== null ? Math.abs(value.value) : null;
      var position = positions[index] || [0.50, 0.50];
      if (index >= positions.length) {
        var angle = (index - positions.length) * Math.PI * 2 / Math.max(1, items.length - positions.length);
        position = [0.50 + Math.cos(angle) * 0.16, 0.50 + Math.sin(angle) * 0.15];
      }
      return {
        value: magnitude,
        diameter: geometryAllowed && magnitude !== null ? 2 * maxRadius * Math.sqrt(magnitude / max) : 0,
        x: position[0],
        y: position[1]
      };
    });
    items.forEach(function (item, index) {
      var state = item.state === 'unavailable' ? 'missing'
        : item.state === 'invalid' ? 'invalid' : readNumber(item.raw).state;
      var display = state === 'missing'
        ? '—' + (item.unit ? ' ' + item.unit : '')
        : state === 'invalid'
          ? (item.display || (item.raw || L('k19')) + (item.unit ? ' ' + item.unit : ''))
          : (item.display || item.raw) + (item.unit && !item.display ? ' ' + item.unit : '');
      var stateText = state === 'missing' ? L('k20')
        : state === 'invalid' ? L('k21') : '';
      var zeroMarker = state === 'zero' && validLayout && validMax && validRadius && width > 0;
      var canRender = zeroMarker || (geometryAllowed && (state === 'positive' || state === 'negative'));
      if (canRender) {
        var li = make('li', 'm-metric-circles__item');
        var geometry = itemGeometry[index];
        var diameter = zeroMarker ? zeroDiameter : geometry.diameter;
        li.setAttribute('data-series', item.series);
        li.setAttribute('data-state', state);
        li.style.setProperty('--m-circle-diameter', diameter + 'px');
        li.style.setProperty('--m-circle-x', geometry.x * 100 + '%');
        li.style.setProperty('--m-circle-y', geometry.y * 100 + '%');
        li.style.setProperty('--m-circle-layer', String(Math.round(diameter)));
        var visual = make('span', 'm-metric-circles__visual');
        visual.setAttribute('aria-hidden', 'true');
        var bubble = make('span', 'm-metric-circles__bubble');
        bubble.setAttribute('aria-hidden', 'true');
        visual.appendChild(bubble);
        li.appendChild(visual);
        target.appendChild(li);
        li.setAttribute('data-inside', 'false');
      }
      if (fallbackTarget) {
        fallbackTarget.appendChild(fallbackItem(item, display, stateText));
      }
    });
    if (empty) {
      empty.hidden = items.length > 0;
      if (!items.length) empty.textContent = chart.getAttribute('data-empty-message') || L('k22');
    }
    syncCirclesTable(chart, items);
  }

  function fallbackItem(item, display, stateText) {
    var row = make('li', 'm-metric-circles__fallback-item');
    row.setAttribute('data-series', item.series);
    row.appendChild(make('span', 'm-metric-circles__fallback-label', item.label));
    var reading = make('span', 'm-metric-circles__fallback-reading', display);
    reading.setAttribute('dir', 'ltr');
    row.appendChild(reading);
    if (stateText) row.appendChild(make('span', 'm-metric-circles__fallback-state', stateText));
    return row;
  }

  /* 2026-10-25 (عقد المالك — D-UI-04 لكل رسم كمّي): إفصاح جدول كامل
     للعائلة نفسها بأصنافها الذاتية (m-main-metric__dataset*) — لا
     اعتماد على data.css؛ نفس سلوك زر data.js (aria-expanded +
     aria-controls + hidden) والجدول يعاد بناؤه كل دورة من المصدر.
     الجدول يشمل كل فئة وقيمة ووحدة وفترة وحالة (صفر/مفقود/غير صالح)
     — العرض البديل الكامل، لا مفتاح مختصر. */
  var metricTableUid = 0;

  function ensureDatasetWrap(chart) {
    var wrap = chart.querySelector('.m-main-metric__dataset-wrap');
    var btn, table;
    if (!wrap) {
      wrap = make('div', 'm-main-metric__dataset-wrap');
      btn = make('button', 'm-btn m-btn--secondary m-main-metric__disclose', L('k23'));
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      table = make('table', 'm-main-metric__dataset');
      table.hidden = true;
      wrap.appendChild(btn);
      wrap.appendChild(table);
      chart.appendChild(wrap);
    } else {
      btn = wrap.querySelector('.m-main-metric__disclose');
      table = wrap.querySelector('.m-main-metric__dataset');
    }
    // A copied disclosure has DOM state but no listener or unique owned ID.
    if (btn) btn.classList.add('m-btn', 'm-btn--secondary');
    var binding = btn && btn.__microDatasetDisclosure;
    if (btn && table && (!binding || binding.table !== table)) {
      if (binding) btn.removeEventListener('click', binding.handler);
      do { table.id = 'micro-metric-dataset-' + (++metricTableUid); }
      while (document.getElementById(table.id) && document.getElementById(table.id) !== table);
      btn.setAttribute('aria-controls', table.id);
      var handler = function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        table.hidden = open;
        btn.textContent = open ? L('k23') : L('k24');
      };
      btn.__microDatasetDisclosure = { table: table, handler: handler };
      btn.addEventListener('click', handler);
    }
    return { wrap: wrap, btn: btn, table: table };
  }

  function buildTableHead(table, headers) {
    var thead = make('thead');
    var headRow = make('tr');
    headers.forEach(function (h) {
      var th = make('th', null, h);
      th.setAttribute('scope', 'col');
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);
  }

  function appendRow(tbody, cells) {
    var tr = make('tr');
    var th = make('th', null, cells[0]);
    th.setAttribute('scope', 'row');
    tr.appendChild(th);
    for (var i = 1; i < cells.length; i++) {
      var td = make('td');
      if (cells[i] && cells[i].nodeType) td.appendChild(cells[i]);
      else td.textContent = cells[i];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  // Keep signs with the reading; Arabic state text keeps its own direction.
  function datasetReading(value, suffix, numeric) {
    var fragment = document.createDocumentFragment();
    var reading = make('bdi', null, value);
    reading.dir = numeric === false ? 'auto' : 'ltr';
    fragment.appendChild(reading);
    if (suffix) fragment.appendChild(document.createTextNode(' ' + suffix));
    return fragment;
  }

  function tableCaptionBase(chart) {
    var title = chart.querySelector('.m-main-metric__title, .m-metric-circles__title');
    var parts = [String((title && title.textContent) || chart.getAttribute('data-title') || chart.getAttribute('aria-label') || '').trim()];
    var unit = chart.getAttribute('data-common-unit') || chart.getAttribute('data-unit');
    var period = chart.getAttribute('data-common-period') || chart.getAttribute('data-period');
    if (unit) parts.push(L('k25') + unit);
    if (period) parts.push(L('k26') + period);
    return parts.filter(Boolean).join(L('k27'));
  }

  /* جدول المقارنة الشريطية: فئة/قيمة/وحدة/فترة + الحالة داخل خلية
     القيمة نصًا صريحًا (صفر/غير متاح/غير صالح) */
  function syncBarsTable(chart, entries, parsed) {
    var parts = ensureDatasetWrap(chart);
    if (!parts.btn || !parts.table) return;
    var table = parts.table;
    table.textContent = '';
    var caption = make('caption', null, tableCaptionBase(chart));
    table.appendChild(caption);
    buildTableHead(table, [L('k28'), L('k29'), L('k30'), L('k31')]);
    var tbody = make('tbody');
    var hero = chart.querySelector('.m-main-metric__hero');
    var mainNumber = hero && hero.querySelector('.m-main-metric__number');
    if (mainNumber) {
      var mainLabel = hero.querySelector('.m-main-metric__label');
      var mainUnit = hero.querySelector('.m-main-metric__unit');
      appendRow(tbody, [(mainLabel && mainLabel.textContent) || L('k32'),
        datasetReading(mainNumber.textContent), (mainUnit && mainUnit.textContent) || chart.getAttribute('data-common-unit') || '—',
        chart.getAttribute('data-common-period') || chart.getAttribute('data-period') || '—']);
    }
    entries.forEach(function (entry, index) {
      var value = parsed[index];
      var valueText;
      if (value.state === 'missing') valueText = L('k33');
      else if (value.state === 'invalid') valueText = datasetReading(entry.raw, L('k34'), false);
      else if (value.state === 'zero') valueText = datasetReading(entry.display || entry.raw || '0', L('k35'));
      else valueText = datasetReading(entry.display || entry.raw, value.state === 'negative' ? L('k36') : '');
      appendRow(tbody, [entry.label, valueText, entry.unit || '—', entry.period || '—']);
    });
    table.appendChild(tbody);
  }

  /* جدول دوائر المقارنة: فئة/قيمة/حالة — الوحدة داخل القيمة كما في
     القائمة البديلة المرئية */
  function syncCirclesTable(chart, items) {
    var parts = ensureDatasetWrap(chart);
    if (!parts.btn || !parts.table) return;
    var table = parts.table;
    table.textContent = '';
    var caption = make('caption', null, tableCaptionBase(chart));
    table.appendChild(caption);
    buildTableHead(table, [L('k28'), L('k29'), L('k37'), L('k30'), L('k31')]);
    var tbody = make('tbody');
    items.forEach(function (item) {
      var state = item.state === 'unavailable' ? 'missing'
        : item.state === 'invalid' ? 'invalid' : readNumber(item.raw).state;
      var valueText, stateText;
      if (state === 'missing') { valueText = '—'; stateText = L('k20'); }
      else if (state === 'invalid') { valueText = item.raw || L('k19'); stateText = L('k19'); }
      else {
        valueText = item.display || item.raw;
        stateText = state === 'zero' ? L('k38')
          : state === 'negative' ? L('k39')
          : '';
      }
      appendRow(tbody, [item.label,
        state === 'missing' ? valueText : datasetReading(valueText, '', state !== 'invalid'),
        stateText, item.unit || '—', item.period || '—']);
    });
    table.appendChild(tbody);
  }

  function fitHero(chart) {
    var hero = chart.querySelector('.m-main-metric__hero');
    if (!hero) return;
    chart.removeAttribute('data-hero-reading');
    if (chart.classList.contains('m-main-metric--flat')) return;
    var bounds = hero.getBoundingClientRect();
    var number = hero.querySelector('.m-main-metric__number');
    var lineHeight = number ? parseFloat(window.getComputedStyle(number).lineHeight) : 0;
    var wrapsNumber = number && lineHeight && number.getBoundingClientRect().height > lineHeight + 1;
    if (bounds.width && (bounds.height > bounds.width + 1 || wrapsNumber)) {
      chart.setAttribute('data-hero-reading', '');
    }
  }

  function barItems(chart) {
    clearDiagnostics(chart); /* R2-UI03: كل دورة تبدأ نظيفة حتى دون عنصر حالة */
    var source = chart.querySelector('[data-bar-source]');
    var target = chart.querySelector('[data-bar-items]');
    var status = chart.querySelector('[data-bar-status]');
    if (!source || !target) return;
    var entries = Array.prototype.slice.call(source.querySelectorAll('[data-label]')).map(function (node) {
      return {
        label: node.getAttribute('data-label') || '',
        raw: node.getAttribute('data-value'),
        display: node.getAttribute('data-display-value'),
        unit: node.getAttribute('data-unit') || '',
        period: node.getAttribute('data-period') || '',
        series: seriesOf(node)
      };
    });
    var parsed = entries.map(function (entry) { return readNumber(entry.raw); });
    var commonUnit = chart.getAttribute('data-common-unit') || '';
    var commonPeriod = chart.getAttribute('data-common-period') || '';
    var consistent = !!commonUnit && !!commonPeriod && entries.every(function (entry) {
      return entry.unit === commonUnit && entry.period === commonPeriod;
    });
    var magnitudeMax = parsed.reduce(function (max, item) {
      return item.value !== null ? Math.max(max, Math.abs(item.value)) : max;
    }, 0);
    var hasKnown = parsed.some(function (item) { return item.value !== null; });
    var signed = parsed.some(function (item) { return item.state === 'negative'; });
    var declaredRaw = chart.getAttribute('data-max');
    var declared = declaredRaw === null ? null : readNumber(declaredRaw);
    var max = null;
    var userText = '';

    /* R2-UI03: نفس فصل تعليمات المبرمج عن نص المستخدم المطبق في الدوائر —
       رسالة موجزة بلا أسماء سمات (data-unit/data-period/data-max) ولا
       أوامر إصلاح للمطور («أزل الحد أو حدّد قيمة موجبة»)، والقراءات معروضة
       كاملة في الصفوف دائمًا، والسبب التقني في data-scale-state/detail.
       الشروحات الدلالية للوحدة والفترة والصفر والإشارة محفوظة. */
    if (!entries.length) {
      userText = L('k22');
      writeDiagnostics(chart, 'empty', L('k40'));
    } else if (!consistent) {
      userText = L('k41');
      writeDiagnostics(chart, 'inconsistent',
        L('k42'));
    } else if (declaredRaw !== null && (!declared || declared.state !== 'positive')) {
      userText = L('k43');
      writeDiagnostics(chart, 'invalid-scale',
        "metric-bars: data-max='" + declaredRaw + L('k44'));
    } else if (declared && declared.value < magnitudeMax) {
      userText = L('k45');
      writeDiagnostics(chart, 'scale-below-known',
        'metric-bars: data-max=' + declared.value + L('k46') + magnitudeMax + L('k47'));
    } else if (declared) {
      max = declared.value;
      userText = L('k48') + (chart.getAttribute('data-max-label') || declaredRaw) + ' ' + commonUnit + ' · ' + commonPeriod + '.';
      writeDiagnostics(chart, 'ok',
        'metric-bars: scale=declared data-max=' + declared.value + L('k49') + commonUnit + L('k50') + commonPeriod + '.');
    } else if (magnitudeMax > 0) {
      max = magnitudeMax;
      userText = L('k48') + magnitudeMax + ' ' + commonUnit + ' · ' + commonPeriod + '.';
      writeDiagnostics(chart, 'ok',
        'metric-bars: scale=auto-largest-known=' + magnitudeMax + L('k49') + commonUnit + L('k50') + commonPeriod + '.');
    } else if (hasKnown) {
      max = 0;
      userText = L('k51');
      writeDiagnostics(chart, 'zero', L('k52'));
    } else {
      userText = L('k53');
      writeDiagnostics(chart, 'empty', L('k54'));
    }
    if (signed && max !== null) userText += L('k55');

    target.textContent = '';
    entries.forEach(function (entry, index) {
      var value = parsed[index];
      var li = make('li', 'm-main-metric__row');
      li.setAttribute('data-series', entry.series);
      var head = make('div', 'm-main-metric__row-head');
      head.appendChild(make('span', 'm-main-metric__row-label', entry.label));
      var display = value.state === 'missing' ? '—'
        : value.state === 'invalid' ? L('k19')
          : (entry.display || entry.raw) + (entry.unit && !entry.display ? ' ' + entry.unit : '');
      var val = make('span', 'm-main-metric__row-value');
      if (chart.classList.contains('m-main-metric--readable')) {
        var number = make('bdi', '', value.state === 'missing' ? L('k56')
          : value.state === 'invalid' ? entry.raw : (entry.display || entry.raw));
        number.dir = value.value === null ? 'auto' : 'ltr';
        val.appendChild(number);
        if (value.state === 'invalid') val.appendChild(make('span', 'm-main-metric__reading-state', L('k57')));
        if (entry.unit) {
          val.appendChild(document.createTextNode(' '));
          var unit = make('span', 'm-main-metric__reading-unit', entry.unit);
          unit.setAttribute('data-reading-unit', entry.unit); val.appendChild(unit);
        }
      } else { val.textContent = display; val.setAttribute('dir', 'ltr'); }
      head.appendChild(val);
      li.appendChild(head);
      var track = make('span', 'm-main-metric__track');
      track.setAttribute('aria-hidden', 'true');
      if (signed) track.setAttribute('data-signed', 'true');
      var canDraw = max !== null && max > 0 && (value.state === 'positive' || value.state === 'negative');
      if (canDraw) {
        var bar = make('span', 'm-main-metric__bar');
        bar.style.setProperty('--m-bar-width', (Math.abs(value.value) / max * (signed ? 50 : 100)) + '%');
        bar.setAttribute('data-direction', value.state);
        track.appendChild(bar);
      } else if (max !== null && value.state === 'zero') {
        track.setAttribute('data-zero', 'true');
      } else {
        track.hidden = true;
        if (value.state === 'missing') {
          li.appendChild(make('span', 'm-main-metric__state', L('k20')));
        } else if (value.state === 'invalid') {
          li.appendChild(make('span', 'm-main-metric__state', L('k21')));
        }
      }
      li.appendChild(track);
      target.appendChild(li);
    });
    if (status) {
      status.textContent = userText;
      status.setAttribute('data-valid', String(max !== null));
    }
    syncBarsTable(chart, entries, parsed);
    if (globalApi('Readings')) globalApi('Readings').sync(chart);
  }

  function initOne(root) {
    disconnected.delete(root);
    if (root.hasAttribute('data-metric-circles') && !(root.__microMetricResizeObserver || root.__microMetricResizeListener)) {
      root.setAttribute('data-metric-ready', '');
      circleItems(root);
      observeResponsive(root);
    }
    if (root.hasAttribute('data-main-comparison') && !(root.__microMetricResizeObserver || root.__microMetricResizeListener)) {
      root.setAttribute('data-bars-ready', '');
      barItems(root);
      fitHero(root);
      observeResponsive(root);
    }
  }

  var disconnected = new WeakSet();

  function observeResponsive(root) {
    disconnected.delete(root);
    var target = root.querySelector('[data-metric-items]')
      || (root.hasAttribute('data-main-comparison') ? root : null);
    if (!target || root.__microMetricResizeObserver || root.__microMetricResizeListener) return;
    root.__microMetricWidth = target.getBoundingClientRect().width;
    if (window.ResizeObserver) {
      var observer = new ResizeObserver(function (entries) {
        if (disconnected.has(root) || root.__microMetricResizeObserver !== observer) return;
        var nextWidth = entries[0] && entries[0].contentRect.width;
        if (typeof nextWidth === 'number' && Math.abs(nextWidth - root.__microMetricWidth) > 1) {
          if (root.__microMetricResizeFrame) return;
          root.__microMetricResizeFrame = window.requestAnimationFrame(function () {
            delete root.__microMetricResizeFrame;
            if (!root.isConnected || disconnected.has(root) || root.__microMetricResizeObserver !== observer) return;
            var width = target.getBoundingClientRect().width;
            if (width <= 1 || Math.abs(width - root.__microMetricWidth) <= 1) return;
            root.__microMetricWidth = width;
            if (root.hasAttribute('data-metric-circles')) circleItems(root);
            else fitHero(root);
          });
        }
      });
      root.__microMetricResizeObserver = observer;
      observer.observe(target);
    } else {
      root.__microMetricResizeListener = function () {
        if (disconnected.has(root)) return;
        var nextWidth = target.getBoundingClientRect().width;
        if (Math.abs(nextWidth - root.__microMetricWidth) > 1) {
          root.__microMetricWidth = nextWidth;
          if (root.hasAttribute('data-metric-circles')) circleItems(root);
          else fitHero(root);
        }
      };
      window.addEventListener('resize', root.__microMetricResizeListener);
    }
  }

  /* @deprecated منذ 0.2.0 (R-D10): الاسم القديم لإعادة التصيير — يبقى في
     نسخة IIFE فقط حتى 1.0؛ استخدم instance.update() (مصدر البيانات DOM). */
  export function render(root) {
    installFontsHook();
    var scope = root || document;
    if (scope.matches) disconnected.delete(scope);
    if (scope.matches && scope.matches('[data-metric-circles]')) {
      circleItems(scope);
      observeResponsive(scope);
    }
    if (scope.matches && scope.matches('[data-main-comparison]')) {
      barItems(scope);
      fitHero(scope);
      observeResponsive(scope);
    }
    scope.querySelectorAll('[data-metric-circles]').forEach(function (chart) {
      circleItems(chart);
      observeResponsive(chart);
    });
    scope.querySelectorAll('[data-main-comparison]').forEach(function (chart) {
      barItems(chart);
      fitHero(chart);
      observeResponsive(chart);
    });
  }

  /* العقد الموحد (الجولة الثانية R4): init(root, options?) يعيد instance
     له update/destroy. instance.update() = render (إعادة التصيير من DOM
     المصدر لكل المقارنات تحت الجذر)؛ destroy يفك مستمعات كشف الجداول
     ومراقبات الرصد ومؤقتات rAF. */
  var instances = instanceRegistry();

  export function init(root, options) {
    var scope = root || document;
    void options; /* metric-comparison: لا خيارات حاليًا — options.labels في R5 */
    var existing = instances.get(scope);
        /* R4 (عقد SPA): المثيل الحي يُعاد كما هو، مع فحص الجذر وربط أي
       عنصر جديد غير مربوط تحته — init متكرر آمن كما في v0.1.0. */
    if (existing) { installFontsHook(); if (scope.matches && (scope.matches('[data-metric-circles]') || scope.matches('[data-main-comparison]'))) initOne(scope); scope.querySelectorAll('[data-metric-circles], [data-main-comparison]').forEach(initOne); return existing; }
    installFontsHook();
    var destroyed = false;
    var instance = {
      root: scope,
      /** = render: إعادة التصيير من DOM المصدر تحت الجذر. */
      update: function () { render(scope); },
      /** يفك مستمعات الكشف والرصد — لا يمس قيم المصدر. */
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        teardown(scope);
        instances.remove(scope);
      },
    };
    if (scope.matches && (scope.matches('[data-metric-circles]') || scope.matches('[data-main-comparison]'))) initOne(scope);
    scope.querySelectorAll('[data-metric-circles], [data-main-comparison]').forEach(initOne);
    instances.set(scope, instance);
    return instance;
  }

  export function getInstance(root) {
    return instances.get(root);
  }

  export function destroy(root) {
    var instance = instances.get(root);
    if (instance) instance.destroy();
    else teardown(root || document);
  }

  /* @deprecated منذ 0.2.0 (R-D10): اسم مهمل يبقى في نسخة IIFE فقط حتى
     1.0 — استخدم destroy(root) أو instance.destroy(). */
  export function disconnect(root) {
    destroy(root);
  }

  function teardown(root) {
    var scope = root || document;
    var selector = '[data-metric-circles], [data-main-comparison]';
    var items = [].slice.call(scope.querySelectorAll(selector));
    if (scope.matches && scope.matches(selector)) items.unshift(scope);
    /* R4.4: مستمعات كشف جداول البيانات كانت تُزال عند إعادة الربط فقط —
       تُزال الآن مع التنظيف (صفر مستمعات بعد destroy). */
    [].slice.call(scope.querySelectorAll('.m-main-metric__disclose')).forEach(function (btn) {
      var binding = btn.__microDatasetDisclosure;
      if (binding) {
        btn.removeEventListener('click', binding.handler);
        delete btn.__microDatasetDisclosure;
      }
    });
    if (scope.matches && scope.matches('.m-main-metric__disclose') && scope.__microDatasetDisclosure) {
      scope.removeEventListener('click', scope.__microDatasetDisclosure.handler);
      delete scope.__microDatasetDisclosure;
    }
    items.forEach(function (chart) {
      disconnected.add(chart);
      if (chart.__microMetricResizeObserver) chart.__microMetricResizeObserver.disconnect();
      if (chart.__microMetricResizeFrame) window.cancelAnimationFrame(chart.__microMetricResizeFrame);
      delete chart.__microMetricResizeFrame;
      if (chart.__microMetricResizeListener) window.removeEventListener('resize', chart.__microMetricResizeListener);
      delete chart.__microMetricResizeObserver;
      delete chart.__microMetricResizeListener;
      delete chart.__microMetricWidth;
      chart.removeAttribute('data-metric-ready');
      chart.removeAttribute('data-bars-ready');
    });
  }

  /* @deprecated منذ 0.2.0 (R-D10): update(root) الاسم القديم لrender —
     يبقى في نسخة IIFE فقط حتى 1.0؛ استخدم instance.update() (المصدر DOM). */
  export { render as update };

  /* المرحلة 7 — تخصيص نصوص العائلة: دمج جزئي فوق الافتراضي في سجل
     MicroLabels؛ يسري على التصييرات اللاحقة (النص الثابت في DOM يتحدث
     عند أول render/update بعد التغيير). */
  export function setLabels(partial) {
  setFamilyLabels('metric-comparison', partial);
}

  /* R2 (الجولة الثانية): التركيب كسول — لا وصول إلى document في المستوى
     الأعلى للوحدة؛ يُركَّب عند أول init/render (نفس نمط data.js). */
  var fontsHookInstalled = false;
  function installFontsHook() {
    if (fontsHookInstalled) return;
    fontsHookInstalled = true;
    if (document.fonts) document.fonts.ready.then(function () {
      document.querySelectorAll('[data-metric-circles], [data-main-comparison]').forEach(function (chart) {
        if (!disconnected.has(chart)) render(chart);
      });
    });
  }
