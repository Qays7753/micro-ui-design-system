/* Numeric comparison primitives. The consumer owns meaning, units and formatting. */
(function () {
  'use strict';

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

  function circleItems(chart) {
    var source = chart.querySelector('[data-metric-source]');
    var target = chart.querySelector('[data-metric-items]');
    var fallbackTarget = chart.querySelector('[data-metric-fallback]');
    var empty = chart.querySelector('[data-metric-empty]');
    if (!source || !target) return;
    if (!fallbackTarget) {
      fallbackTarget = make('ul', 'm-metric-circles__fallback');
      fallbackTarget.setAttribute('data-metric-fallback', '');
      fallbackTarget.setAttribute('aria-label', 'قراءات القيم التي لا تتسع داخل الدوائر');
      target.insertAdjacentElement('afterend', fallbackTarget);
    }
    var items = Array.prototype.slice.call(source.querySelectorAll('[data-label]')).map(function (node) {
      return {
        label: node.getAttribute('data-label') || '',
        raw: node.getAttribute('data-value'),
        display: node.getAttribute('data-display-value'),
        unit: node.getAttribute('data-unit') || '',
        state: node.getAttribute('data-state'),
        series: seriesOf(node)
      };
    });
    target.textContent = '';
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
      if (!validLayout) scaleNote.textContent = 'تعذّر رسم الدوائر: اختر تخطيطًا معروفًا.';
      else if (!validMax) scaleNote.textContent = 'تعذّر رسم الدوائر: مقياس القيم غير صالح أو أصغر من قيمة معلومة.';
      else if (!validRadius) scaleNote.textContent = 'تعذّر رسم الدوائر: الحد الأقصى لحجم الدائرة غير صالح.';
      else if (!width) scaleNote.textContent = 'لا تتوفر مساحة عرض بعد؛ ستظهر الدوائر عند إتاحة البطاقة.';
      else if (!measuredMax) scaleNote.textContent = known.length
        ? 'القيم المعروفة صفرية؛ العلامة المجوفة تعني صفرًا، وليست مساحة عددية.'
        : 'لا توجد قراءات متاحة للمقارنة بعد.';
      else {
        var scaledMessage = 'المساحة تقارن مقدار القيمة؛ الإشارة مكتوبة في القراءة.';
        if (zeroCount) scaledMessage += ' العلامة المجوفة تعني صفرًا، وليست مساحة عددية.';
        if (declaredRaw === null) scaledMessage += ' يحدّ المقياس أكبر مقدار معروف.';
        else scaledMessage += ' النطاق يصل إلى ' + (chart.getAttribute('data-max-label') || declaredRaw) + '.';
        if (radiusRaw !== null) scaledMessage += ' الحجم متكيف مع عرض البطاقة ضمن الحد الذي حدده المستهلك.';
        if (layout === 'overlap') scaledMessage += ' التداخل بصري فقط ولا يدل على تقاطع أو علاقة بين القيم.';
        scaleNote.textContent = scaledMessage;
      }
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
          ? (item.display || (item.raw || 'قيمة غير صالحة') + (item.unit ? ' ' + item.unit : ''))
          : (item.display || item.raw) + (item.unit && !item.display ? ' ' + item.unit : '');
      var stateText = state === 'missing' ? 'غير متاح'
        : state === 'invalid' ? 'تعذّر قراءة القيمة' : '';
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
        var inside = make('span', 'm-metric-circles__bubble-content');
        inside.hidden = true;
        inside.appendChild(make('span', 'm-metric-circles__inside-label', item.label));
        var insideValue = make('span', 'm-metric-circles__inside-reading', display);
        insideValue.setAttribute('dir', 'ltr');
        inside.appendChild(insideValue);
        visual.appendChild(inside);
        li.appendChild(visual);
        target.appendChild(li);

        inside.hidden = false;
        inside.style.visibility = 'hidden';
        var fits = !zeroMarker && diameter >= 72
          && inside.scrollHeight <= inside.clientHeight + 1
          && inside.scrollWidth <= inside.clientWidth + 1;
        if (fits && layout === 'overlap') {
          var centerX = geometry.x * width;
          var centerY = geometry.y * overlapHeight;
          for (var otherIndex = 0; otherIndex < itemGeometry.length; otherIndex++) {
            if (otherIndex === index || itemGeometry[otherIndex].diameter <= 0) continue;
            var other = itemGeometry[otherIndex];
            var drawnAbove = other.diameter > geometry.diameter
              || (other.diameter === geometry.diameter && otherIndex > index);
            if (!drawnAbove) continue;
            var dx = Math.max(0, Math.abs(centerX - other.x * width) - inside.clientWidth / 2);
            var dy = Math.max(0, Math.abs(centerY - other.y * overlapHeight) - inside.clientHeight / 2);
            if (dx * dx + dy * dy < Math.pow(other.diameter / 2, 2)) {
              fits = false;
              break;
            }
          }
        }
        inside.style.visibility = '';
        inside.hidden = !fits;
        li.setAttribute('data-inside', fits ? 'true' : 'false');
        if (fits) {
          visual.removeAttribute('aria-hidden');
        } else if (fallbackTarget) {
          fallbackTarget.appendChild(fallbackItem(item, display, stateText));
        }
      } else if (fallbackTarget) {
        fallbackTarget.appendChild(fallbackItem(item, display, stateText));
      }
    });
    if (empty) {
      empty.hidden = items.length > 0;
      if (!items.length) empty.textContent = chart.getAttribute('data-empty-message') || 'لا توجد بيانات للمقارنة.';
    }
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

  function fitHero(chart) {
    var hero = chart.querySelector('.m-main-metric__hero');
    if (!hero) return;
    chart.removeAttribute('data-hero-reading');
    var bounds = hero.getBoundingClientRect();
    var number = hero.querySelector('.m-main-metric__number');
    var lineHeight = number ? parseFloat(window.getComputedStyle(number).lineHeight) : 0;
    var wrapsNumber = number && lineHeight && number.getBoundingClientRect().height > lineHeight + 1;
    if (bounds.width && (bounds.height > bounds.width + 1 || wrapsNumber)) {
      chart.setAttribute('data-hero-reading', '');
    }
  }

  function barItems(chart) {
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
    var reason = '';

    if (!entries.length) {
      reason = 'لا توجد بيانات للمقارنة.';
    } else if (!consistent) {
      reason = 'الأشرطة غير معروضة: يجب أن تتوافق الوحدة والفترة في جميع القيم.';
    } else if (declaredRaw !== null && (!declared || declared.state !== 'positive')) {
      reason = 'مقياس المقارنة غير صالح؛ أزل الحد أو حدّد قيمة موجبة.';
    } else if (declared && declared.value < magnitudeMax) {
      reason = 'حد المقياس أصغر من مقدار معلوم؛ لم تُعرض الأشرطة.';
    } else if (declared) {
      max = declared.value;
      reason = 'مقياس مشترك: حتى ' + (chart.getAttribute('data-max-label') || declaredRaw) + ' ' + commonUnit + ' · ' + commonPeriod + '.';
    } else if (magnitudeMax > 0) {
      max = magnitudeMax;
      reason = 'مقياس مشترك تلقائي: حتى ' + magnitudeMax + ' ' + commonUnit + ' · ' + commonPeriod + ' (أكبر مقدار معلوم).';
    } else if (hasKnown) {
      max = 0;
      reason = 'القيم المعروفة صفرية؛ علامة الصفر ظاهرة دون طول مصطنع.';
    } else {
      reason = 'لا توجد قراءات متاحة لبناء مقياس بعد.';
    }
    if (signed && max !== null) reason += ' خط الوسط صفر؛ الموجب يمينه والسالب يساره.';

    target.textContent = '';
    entries.forEach(function (entry, index) {
      var value = parsed[index];
      var li = make('li', 'm-main-metric__row');
      li.setAttribute('data-series', entry.series);
      var head = make('div', 'm-main-metric__row-head');
      head.appendChild(make('span', 'm-main-metric__row-label', entry.label));
      var display = value.state === 'missing' ? '—'
        : value.state === 'invalid' ? 'قيمة غير صالحة'
          : (entry.display || entry.raw) + (entry.unit && !entry.display ? ' ' + entry.unit : '');
      var val = make('span', 'm-main-metric__row-value', display);
      val.setAttribute('dir', 'ltr');
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
          li.appendChild(make('span', 'm-main-metric__state', 'غير متاح'));
        } else if (value.state === 'invalid') {
          li.appendChild(make('span', 'm-main-metric__state', 'تعذّر قراءة القيمة'));
        }
      }
      li.appendChild(track);
      target.appendChild(li);
    });
    if (status) {
      status.textContent = reason;
      status.setAttribute('data-valid', String(max !== null));
    }
  }

  function initOne(root) {
    if (root.hasAttribute('data-metric-circles') && !root.hasAttribute('data-metric-ready')) {
      root.setAttribute('data-metric-ready', '');
      circleItems(root);
      observeResponsive(root);
    }
    if (root.hasAttribute('data-main-comparison') && !root.hasAttribute('data-bars-ready')) {
      root.setAttribute('data-bars-ready', '');
      barItems(root);
      fitHero(root);
      observeResponsive(root);
    }
  }

  function observeResponsive(root) {
    var target = root.querySelector('[data-metric-items]')
      || (root.hasAttribute('data-main-comparison') ? root : null);
    if (!target || root.__microMetricResizeObserver || root.__microMetricResizeListener) return;
    root.__microMetricWidth = target.getBoundingClientRect().width;
    if (window.ResizeObserver) {
      root.__microMetricResizeObserver = new ResizeObserver(function (entries) {
        var nextWidth = entries[0] && entries[0].contentRect.width;
        if (typeof nextWidth === 'number' && Math.abs(nextWidth - root.__microMetricWidth) > 1) {
          root.__microMetricWidth = nextWidth;
          if (root.hasAttribute('data-metric-circles')) circleItems(root);
          else fitHero(root);
        }
      });
      root.__microMetricResizeObserver.observe(target);
    } else {
      root.__microMetricResizeListener = function () {
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

  function render(root) {
    var scope = root || document;
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

  function init(root) {
    var scope = root || document;
    if (scope.matches && (scope.matches('[data-metric-circles]') || scope.matches('[data-main-comparison]'))) initOne(scope);
    scope.querySelectorAll('[data-metric-circles], [data-main-comparison]').forEach(initOne);
  }

  window.MicroMetricComparison = { init: init, render: render };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
  if (document.fonts) document.fonts.ready.then(function () { render(); });
})();