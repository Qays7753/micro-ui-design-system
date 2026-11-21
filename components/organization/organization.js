/* =========================================================
   Micro UI — سلوك مكوّن التنظيم والمعلومات (B04)
   الملف: components/organization/organization.js
   عقد عام فقط:
   1) القسم القابل للطي: مفتاح aria-expanded + hidden للجسم —
      بلا حركة layout (لا قفز). التسمية الموسعة/المضمومة نص المستهلك.
   2) فشل صورة الهوية: <img data-avatar-fallback> عند الخطأ يستبدل
      بأحرف أولى من الاسم (بديل ظاهر لا مربع مكسور).
   ========================================================= */

import { getLabel, registerLabels, setLabels as setFamilyLabels } from '../../shared/labels.js';
import { defaults as familyDefaults } from './labels.js';

registerLabels('organization', familyDefaults);
  /* ---- المرحلة 7 / الجولة الثانية R2 — النصوص الافتراضية: تُقرأ من سجل
     النصوص المشترك (shared/labels.js) وقت الاستخدام (لا عند التحميل)
     كي يعمل setLabels؛ العائلة تسجّل نصوصها الافتراضية عند الاستيراد. ---- */
  var MICRO_LABELS_FAMILY = 'organization';
  function L(key) {
    return getLabel(MICRO_LABELS_FAMILY, key);
  }

  var liveBindings = new WeakMap();

  function claimBinding(element, key) {
    var keys = liveBindings.get(element);
    if (!keys) { keys = new Set(); liveBindings.set(element, keys); }
    if (keys.has(key)) return false;
    keys.add(key);
    element.dataset[key] = '1';
    return true;
  }

  function nodes(root, selector) {
    var scope = root || document;
    var found = [].slice.call(scope.querySelectorAll(selector));
    if (scope.matches && scope.matches(selector)) found.unshift(scope);
    return found;
  }
  function on(element, type, handler) {
    if (!element.__microOrganizationLifetime) element.__microOrganizationLifetime = new AbortController();
    element.addEventListener(type, handler, { signal: element.__microOrganizationLifetime.signal });
  }

  function initSections(root) {
    nodes(root, '.m-section__head').forEach(function (head) {
      if (!claimBinding(head, 'microSectionBound')) return;
      on(head, 'click', function () {
        var section = head.closest('.m-section');
        var body = section ? section.querySelector('.m-section__body') : null;
        if (!body) return;
        var open = head.getAttribute('aria-expanded') === 'true';
        head.setAttribute('aria-expanded', open ? 'false' : 'true');
        body.hidden = open; /* طي/فتح فوري — لا حركة تغيّر التخطيط */
        section.dispatchEvent(new CustomEvent('micro-organization:toggle', {
          bubbles: true, detail: { open: !open }
        }));
      });
    });
  }

  function initAvatars(root) {
    nodes(root, 'img[data-avatar-fallback]').forEach(function (img) {
      if (!claimBinding(img, 'microAvatarBound')) return;
      function fallback() {
        var wrap = img.closest('.m-identity');
        if (!wrap) return;
        var name = (wrap.querySelector('.m-identity__name') || {}).textContent || '';
        var initials = name.trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('');
        var span = document.createElement('span');
        span.className = 'm-identity__initials';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = initials || L('k1');
        img.replaceWith(span);
      }
      on(img, 'error', fallback);
      /* صورة فشلت قبل ربط المستمع (تحميل سريع): نفحص الحالة الحالية */
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }

export function init(root) { initSections(root); initAvatars(root); }
  export function disconnect(root) {
      nodes(root, '.m-section__head, img[data-avatar-fallback]').forEach(function (element) {
        liveBindings.delete(element);
        if (element.__microOrganizationLifetime) element.__microOrganizationLifetime.abort();
        delete element.__microOrganizationLifetime;
        delete element.dataset.microSectionBound;
        delete element.dataset.microAvatarBound;
      });
    }

  /* المرحلة 7 — تخصيص نصوص العائلة: دمج جزئي فوق الافتراضي في سجل
     MicroLabels؛ يسري على التصييرات اللاحقة (النص الثابت في DOM يتحدث
     عند أول render/update بعد التغيير). */
  export function setLabels(partial) {
  setFamilyLabels('organization', partial);
}
