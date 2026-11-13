/* Preview-only controls. Consumer data and chart options are not product policy. */
(function () {
  'use strict';
  var toggle = document.getElementById('preview-sales-selection');
  var chart = document.getElementById('sales-bars');
  toggle.addEventListener('click', function () {
    var enabled = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(enabled));
    if (enabled) {
      chart.setAttribute('data-selection', 'single');
      chart.setAttribute('data-selected-key', 'wed');
    } else {
      chart.removeAttribute('data-selection');
      chart.removeAttribute('data-selected-key');
    }
    window.MicroData.render(chart);
  });
  var distribution = document.getElementById('distribution-example');
  distribution.addEventListener('toggle', function () {
    if (distribution.open) window.MicroData.render(document.getElementById('expenses-group'));
  });
}());
