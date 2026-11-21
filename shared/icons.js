/* Optional plain-script SVG hydration from Micro's one local HugeIcons source.
   <svg aria-hidden="true" data-micro-icon="chevron-right.svg"></svg>
   No gallery dependency, global sprite, product logic, or duplicated icon paths.
   الجولة الثانية R2: وحدة ES — لا window في المستوى الأعلى؛ قاعدة
   الأصول كسولة عبر shared/script-base.js (نسبة إلى موضع الحزمة
   dist/esm|dist/iife حيث ../assets/icons/)، وready() دالة كسولة في ESM
   (نسخة IIFE تولّد الخاصية المتعجلة MicroIcons.ready كما في 0.1.0). */
import { scriptBase } from './script-base.js';

var iconsBase = null;

function base() {
  if (!iconsBase) iconsBase = new URL('../assets/icons/', scriptBase());
  return iconsBase;
}

async function hydrateOne(svg) {
  var file = svg.getAttribute('data-micro-icon');
  if (!/^[a-z0-9-]+\.svg$/.test(file)) throw new Error('Invalid Micro icon filename');
  var response = await fetch(new URL(file, base()));
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

export function hydrate(root) {
  return Promise.all(Array.from((root || document).querySelectorAll('[data-micro-icon]')).map(hydrateOne));
}

var readyPromise = null;

/** ESM: كسولة — تبدأ الترطيب عند أول نداء (لا أثر جانبي عند الاستيراد).
    نسخة IIFE تولّد الخاصية المتعجلة MicroIcons.ready كما في 0.1.0. */
export function ready() {
  if (!readyPromise) readyPromise = hydrate();
  return readyPromise;
}
