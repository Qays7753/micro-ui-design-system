/* Settings-layer composition over the existing MicroNavigation layer contract. */
(function () {
  'use strict';

  function initPanel(panel) {
    if (panel.hasAttribute('data-account-settings-ready')) return;
    var layerId = panel.getAttribute('data-account-layer-id');
    var layer = layerId ? document.getElementById(layerId) : panel.closest('.m-layer');
    if (!layer) return;
    panel.setAttribute('data-account-settings-ready', '');
    var backdropId = layer.getAttribute('data-backdrop-id');
    var backdrop = backdropId ? document.getElementById(backdropId)
      : document.querySelector('.m-layer-backdrop[data-for="' + layer.id + '"]');
    var accountView = panel.querySelector('[data-account-view="account"]');
    var appView = panel.querySelector('[data-account-view="application"]');
    var accountTitle = panel.querySelector('[data-account-title="account"]');
    var appTitle = panel.querySelector('[data-account-title="application"]');
    var back = panel.querySelector('[data-account-back]');
    var appEntry = panel.querySelector('[data-account-to-application]');

    function showView(view, shouldFocus) {
      var isApp = view === 'application';
      if (accountView) accountView.hidden = isApp;
      if (appView) appView.hidden = !isApp;
      if (accountTitle) accountTitle.hidden = isApp;
      if (appTitle) appTitle.hidden = !isApp;
      if (back) back.hidden = !isApp;
      layer.setAttribute('aria-labelledby', isApp && appTitle ? appTitle.id : accountTitle.id);
      if (shouldFocus) {
        var heading = isApp ? appTitle : accountTitle;
        if (heading) heading.focus();
      }
    }

    panel.querySelectorAll('[data-account-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        if (!window.MicroNavigation) return;
        showView('account', false);
        window.MicroNavigation.openLayer(layer, { trigger: trigger, backdropEl: backdrop });
      });
    });
    if (appEntry) appEntry.addEventListener('click', function () { showView('application', true); });
    if (back) back.addEventListener('click', function () { showView('account', true); });
    panel.querySelectorAll('[data-account-close]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (window.MicroNavigation) window.MicroNavigation.closeLayer(layer);
      });
    });

    panel.addEventListener('change', function (event) {
      var input = event.target;
      if (!input.matches || !input.matches('[data-account-setting]')) return;
      var name = input.getAttribute('data-account-setting') || '';
      panel.dispatchEvent(new CustomEvent('micro-account-settings:change', {
        bubbles: true,
        detail: { setting: name, checked: input.checked }
      }));
      var status = panel.querySelector('[data-account-demo-status]');
      if (status) status.textContent = input.getAttribute('data-demo-only') !== null
        ? 'تغيّر هذا المثال داخل الصفحة فقط؛ لم يُحفظ الإعداد.'
        : '';
    });

    showView('account', false);
  }

  function init(root) {
    var scope = root || document;
    if (scope.matches && scope.matches('[data-account-settings]')) initPanel(scope);
    scope.querySelectorAll('[data-account-settings]').forEach(initPanel);
  }

  window.MicroAccountSettings = { init: init };
  document.addEventListener('DOMContentLoaded', function () { init(); });
  if (document.readyState !== 'loading') init();
})();