/* C04: explicit, fail-safe unit context. No data parsing or business state. */
(function () {
  'use strict';
  var CLASS = 'm-reading-unit--contextual';
  function within(root) {
    var out = [].slice.call(root.querySelectorAll('[data-reading-unit]'));
    if (root.matches && root.matches('[data-reading-unit]')) out.unshift(root);
    return out;
  }
  function visible(el) {
    if (!el || !el.isConnected || el.closest('[hidden], [inert]')) return false;
    var style = getComputedStyle(el), rect = el.getBoundingClientRect();
    return el.getClientRects().length > 0 && rect.width > 1 && rect.height > 1
      && style.visibility !== 'hidden' && style.visibility !== 'collapse' && style.display !== 'none' && Number(style.opacity) !== 0
      && style.clipPath === 'none' && style.textOverflow !== 'ellipsis'
      && !(style.overflowX === 'hidden' && el.scrollWidth > el.clientWidth)
      && !(style.overflowY === 'hidden' && el.scrollHeight > el.clientHeight) && (!el.checkVisibility || el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }));
  }
  function contextFor(el) {
    var group = el.closest('[data-reading-context]');
    if (!group) return null;
    var unit = el.getAttribute('data-reading-unit');
    var common = group.getAttribute('data-unit') || group.getAttribute('data-common-unit') || '';
    var label = group.ownerDocument.getElementById(group.getAttribute('data-reading-context'));
    if (!unit || unit !== common || label === el || (label && el.contains(label)) || !visible(label) || label.textContent.indexOf(unit) < 0) return null;
    /* A mixed group never hides units, even if its heading mentions money. */
    if (within(group).some(function (node) {
      return node.closest('[data-reading-context]') === group && node.getAttribute('data-reading-unit') !== common;
    })) return null;
    return label;
  }
  function sync(root) {
    within(root || document).forEach(function (el) {
      el.classList.toggle(CLASS, !!contextFor(el));
    });
  }
  window.MicroReadings = {
    init: sync,
    sync: sync,
    disconnect: function (root) { within(root || document).forEach(function (el) { el.classList.remove(CLASS); }); }
  };
  document.addEventListener('DOMContentLoaded', function () { sync(document); });
  if (document.readyState !== 'loading') sync(document);
})();
