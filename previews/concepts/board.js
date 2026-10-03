/* Preview-only sample data controls. Component library remains data-driven. */
(function () {
  'use strict';

  var states = {
    standard: { circles: ['64', '25', '9'], bars: ['32', '9', '2'], units: ['عملية', 'عملية', 'عملية'], max: '40' },
    small: { circles: ['0.16', '0.04', '0.01'], bars: ['0.20', '0.05', '0.01'], units: ['عملية', 'عملية', 'عملية'], max: '1' },
    negative: { circles: ['64', '-9', '0'], bars: ['32', '-9', '0'], units: ['عملية', 'عملية', 'عملية'], max: '40' },
    missing: { circles: ['64', '25', null], bars: ['32', '9', null], units: ['عملية', 'عملية', 'عملية'], max: '40' },
    invalid: { circles: ['64', '25', 'غير-رقمي'], bars: ['32', '9', 'غير-رقمي'], units: ['عملية', 'عملية', 'عملية'], max: '40' },
    zero: { circles: ['0', '0', '0'], bars: ['0', '0', '0'], units: ['عملية', 'عملية', 'عملية'], max: '40' },
    mixed: { circles: ['64', '25', '9'], bars: ['32', '9', '2'], units: ['عملية', 'د.أ', 'عملية'], max: '40' }
  };

  function setSample(mode) {
    var data = states[mode] || states.standard;
    var circleChart = document.querySelector('[data-metric-circles]');
    var circleInputs = circleChart ? circleChart.querySelectorAll('[data-metric-source] [data-label]') : [];
    Array.prototype.forEach.call(circleInputs, function (item, index) {
      if (data.circles[index] === null) item.removeAttribute('data-value');
      else item.setAttribute('data-value', data.circles[index]);
    });

    var barChart = document.querySelector('[data-main-comparison]');
    if (barChart) {
      barChart.setAttribute('data-max', data.max);
      Array.prototype.forEach.call(barChart.querySelectorAll('[data-bar-source] [data-label]'), function (item, index) {
        if (data.bars[index] === null) item.removeAttribute('data-value');
        else item.setAttribute('data-value', data.bars[index]);
        item.setAttribute('data-unit', data.units[index] === 'عملية'
          ? barChart.getAttribute('data-common-unit') : data.units[index]);
      });
      if (window.MicroMetricComparison) window.MicroMetricComparison.render(barChart);
    }
    if (circleChart && window.MicroMetricComparison) window.MicroMetricComparison.render(circleChart);
  }

  var selector = document.getElementById('comparison-mode');
  var layoutSelector = document.getElementById('circle-layout');
  var reset = document.querySelector('[data-comparison-reset]');
  if (selector) selector.addEventListener('change', function () { setSample(selector.value); });
  if (layoutSelector) layoutSelector.addEventListener('change', function () {
    var chart = document.querySelector('[data-metric-circles]');
    if (!chart) return;
    chart.setAttribute('data-layout', layoutSelector.value);
    if (window.MicroMetricComparison) window.MicroMetricComparison.render(chart);
  });
  if (reset && selector) reset.addEventListener('click', function () {
    selector.value = 'standard';
    if (layoutSelector) {
      layoutSelector.value = 'separated';
      var chart = document.querySelector('[data-metric-circles]');
      if (chart) chart.setAttribute('data-layout', 'separated');
    }
    setSample('standard');
    selector.focus();
  });

  setSample('standard');
})();