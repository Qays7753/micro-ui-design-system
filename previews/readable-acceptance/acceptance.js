/* Review consumer only: selects a fixture, delegates rendering to the source. */
(function () {
  'use strict';
  function init() {
    var picker = document.getElementById('acceptance-case');
    function show() {
      document.querySelectorAll('[data-case]').forEach(function (fixture) {
        fixture.hidden = fixture.getAttribute('data-case') !== picker.value;
        if (fixture.hidden) return;
        if (fixture.hasAttribute('data-chart')) window.MicroData.init(fixture);
        window.MicroReadings.sync(fixture);
        var table = fixture.querySelector('.m-chart__disclose');
        if (picker.value === 'periods' && table && table.getAttribute('aria-expanded') === 'false') table.click();
      });
    }
    picker.addEventListener('change', show);
    show();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
