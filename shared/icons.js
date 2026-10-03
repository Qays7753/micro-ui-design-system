/* Optional plain-script SVG hydration from Micro's one local HugeIcons source.
   <svg aria-hidden="true" data-micro-icon="chevron-right.svg"></svg>
   No gallery dependency, global sprite, product logic, or duplicated icon paths. */
(function () {
  'use strict';
  var base = new URL('../assets/icons/', document.currentScript.src);
  async function hydrate(svg) {
    var file = svg.getAttribute('data-micro-icon');
    if (!/^[a-z0-9-]+\.svg$/.test(file)) throw new Error('Invalid Micro icon filename');
    var response = await fetch(new URL(file, base));
    if (!response.ok) throw new Error('Micro icon failed to load: ' + file);
    var doc = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
    var source = doc.documentElement;
    if (source.localName !== 'svg' || doc.querySelector('parsererror')) {
      throw new Error('Invalid Micro SVG: ' + file);
    }
    ['viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'].forEach(function (name) {
      if (source.hasAttribute(name)) svg.setAttribute(name, source.getAttribute(name));
    });
    svg.replaceChildren.apply(svg, Array.from(source.childNodes).map(function (node) {
      return document.importNode(node, true);
    }));
  }
  window.MicroIcons = {
    hydrate: function (root) {
      return Promise.all(Array.from((root || document).querySelectorAll('[data-micro-icon]')).map(hydrate));
    }
  };
  window.MicroIcons.ready = window.MicroIcons.hydrate();
})();