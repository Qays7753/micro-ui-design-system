/* =========================================================
   Micro UI — ربط زر الرجوع بالطبقات المفتوحة (back) — الجولة
   الثالثة T4 (N-D8). الملف: shared/back.js

   العقد: المكتبة لا تكتب في سجل المتصفح تلقائيًا (عقد المضيف قائم).
   هذه وحدة اختيارية يستدعيها المضيف: bindBackToLayers() تجعل زر
   الرجوع (وإيماءة الرجوع) يغلق الطبقة العليا المفتوحة أولًا ويعيد
   التركيز لفاتحها (مسار الإغلاق نفسه في navigation)، ثم يخرج بسلوك
   المتصفح الطبيعي. تعمل مع كل عائلة تطلق micro-layer:open/close
   (تفاصيل {layer, opener, close}) — طبقات navigation (modal/لوحة
   تصفية)، action-sheet، وورقة منتقٍ داخل طبقة.

   قواعد السجل:
   - فتح طبقة يضيف حالة سجل واحدة لنا؛ إغلاقها بالطرق الأخرى
     (زر/Esc/سحب) يستهلك حالتها فورًا فلا تبقى حالات زائدة.
   - الرجوع مع طبقة مفتوحة يغلقها ويستهلك حالته — متوازن دائمًا.
   - حالات سجل المضيف لا تُمس أبدًا: إن كان المستخدم قد دفع حالة
     خاصة فوق حالتنا تُترك (أسلم سلوك — دفعة رجوع صامتة لاحقًا).
   - destroy() يفك الربط ويعيد كل شيء؛ لا يمس السجل.

   الواجهة: bindBackToLayers(options?) → { destroy() }
   ========================================================= */

import { globalApi } from './integrations.js';

export function bindBackToLayers(options) {
  var bound = false;
  var stack = [];      /* { layer, close } */
  var pending = 0;     /* حالات سجل دفعناها ولم تُستهلك بعد */
  var consuming = false; /* إغلاق جارٍ من popstate نفسه */
  var silent = 0;      /* popstate قادم من استهلاكنا الصامت لحالة يتيمة —
                          ليس ضغطة رجوع من المستخدم فلا يغلق شيئًا */
  var counter = 0;

  function onOpen(event) {
    var detail = event.detail || {};
    var layer = detail.layer || (event.target && event.target.nodeType === 1 ? event.target : null);
    if (!layer || stack.some(function (s) { return s.layer === layer; })) return;
    stack.push({ layer: layer, close: detail.close || null });
    pending += 1;
    counter += 1;
    history.pushState({ __microBack: counter, microLayer: true }, '');
  }

  function closeTop() {
    var top = stack[stack.length - 1];
    if (!top) return;
    var nav = globalApi('Navigation');
    if (typeof top.close === 'function') top.close();
    else if (nav) nav.closeLayer(top.layer);
    /* مسار الإغلاق يعيد التركيز لفاتح الطبقة بنفسه (عقد navigation) */
  }

  function onPopState() {
    if (silent > 0) { silent -= 1; return; }
    if (pending > 0) pending -= 1;
    if (!stack.length) return;
    consuming = true;
    try {
      closeTop();
    } finally {
      consuming = false;
    }
  }

  function onClose(event) {
    var detail = event.detail || {};
    var layer = detail.layer || (event.target && event.target.nodeType === 1 ? event.target : null);
    var idx = -1;
    for (var i = 0; i < stack.length; i++) {
      if (stack[i].layer === layer) { idx = i; break; }
    }
    if (idx < 0) return;
    stack.splice(idx, 1);
    if (consuming) return; /* popstate استهلك حالته بالفعل */
    /* إغلاق بأي طريق آخر: استهلك حالتنا الزائدة إن كنا لا نزال فيها.
       استهلاكها بhistory.back() قد يستعيد المتصفح تركيز عنصر لحظة
       pushState (داخل الطبقة المغلقة) فيضيع تركيز الفاتح الذي أعاده
       مسار الإغلاق — فنحفظه ونعيده بعد popstate مباشرة. */
    if (pending > 0) pending -= 1;
    if (history.state && history.state.__microBack) {
      var active = document.activeElement;
      var restore = function () {
        window.removeEventListener('popstate', restore);
        if (active && active.nodeType === 1 && active.isConnected
            && document.activeElement !== active
            && !active.closest('[inert], [hidden]')
            && typeof active.focus === 'function') {
          active.focus();
        }
      };
      window.addEventListener('popstate', restore);
      silent += 1;
      history.back();
    }
  }

  function bind() {
    if (bound) return;
    bound = true;
    document.addEventListener('micro-layer:open', onOpen);
    document.addEventListener('micro-layer:close', onClose);
    window.addEventListener('popstate', onPopState);
  }

  bind();

  return {
    /** عدد الطبقات المسجلة المفتوحة (تشخيص/فحص). */
    openCount: function () { return stack.length; },
    /** فك الربط الكامل — لا يمس السجل ولا الطبقات المفتوحة. */
    destroy: function () {
      if (!bound) return;
      bound = false;
      document.removeEventListener('micro-layer:open', onOpen);
      document.removeEventListener('micro-layer:close', onClose);
      window.removeEventListener('popstate', onPopState);
      stack = [];
      pending = 0;
      silent = 0;
    },
  };
}
