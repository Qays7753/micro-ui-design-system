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
    var rect = el.getBoundingClientRect();
    if (!el.getClientRects().length || rect.width <= 1 || rect.height <= 1) return false;
    for (var node = el; node; node = node.parentElement) {
      var style = getComputedStyle(node);
      if (style.visibility === 'hidden' || style.visibility === 'collapse' || style.display === 'none' || Number(style.opacity) === 0
        || style.clipPath !== 'none' || style.clip !== 'auto' || style.textOverflow === 'ellipsis') return false;
      var clipsX = /^(hidden|clip|auto|scroll)$/.test(style.overflowX);
      var clipsY = /^(hidden|clip|auto|scroll)$/.test(style.overflowY);
      var bounds = node.getBoundingClientRect();
      if ((clipsX && (rect.left < bounds.left - 1 || rect.right > bounds.right + 1))
        || (clipsY && (rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1))) return false;
      if (node === el && ((clipsX && el.scrollWidth > el.clientWidth) || (clipsY && el.scrollHeight > el.clientHeight))) return false;
    }
    return !el.checkVisibility || el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  }
  function visibleText(el) {
    var walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var text = '', node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim() && visible(node.parentElement)) text += node.nodeValue;
      else if (!node.nodeValue.trim()) text += node.nodeValue;
    }
    return text;
  }
  function mentionsUnit(text, unit) {
    // A unit inside another word/unit is not an explicit shared context.
    var word = /[\p{L}\p{M}\p{N}_]/u;
    var chars = Array.from(unit), startWord = word.test(chars[0]), endWord = word.test(chars[chars.length - 1]);
    var offset = text.indexOf(unit);
    while (offset >= 0) {
      var before = Array.from(text.slice(0, offset)).pop() || '';
      var after = Array.from(text.slice(offset + unit.length))[0] || '';
      if ((!startWord || !word.test(before)) && (!endWord || !word.test(after))) return true;
      offset = text.indexOf(unit, offset + unit.length);
    }
    return false;
  }
  function contextFor(el) {
    var group = el.closest('[data-reading-context]');
    if (!group) return null;
    var unit = el.getAttribute('data-reading-unit');
    var common = group.getAttribute('data-unit') || group.getAttribute('data-common-unit') || '';
    var label = group.ownerDocument.getElementById(group.getAttribute('data-reading-context'));
    if (!unit || unit !== common || label === el || (label && el.contains(label)) || !visible(label) || !mentionsUnit(visibleText(label), unit)) return null;
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
