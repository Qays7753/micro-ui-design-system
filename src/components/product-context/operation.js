(function(){'use strict';MicroProduct.register('state',function(c){

  /* ---- المرحلة 7 — النصوص الافتراضية: تُقرأ من سجل window.MicroLabels
     وقت الاستخدام (لا عند التحميل) كي يعمل setLabels؛ لذا يجب تحميل
     labels.js الخاص بالعائلة قبل هذا الملف في كل صفحة. ---- */
  var MICRO_LABELS_FAMILY = 'product-context';
  function L(key) {
    var family = window.MicroLabels && window.MicroLabels[MICRO_LABELS_FAMILY];
    return family ? family[key] : undefined;
  }
  /* إيقاف التهيئة التلقائية مركزيًا: window.MicroConfig = { autoInit: false }
     قبل تحميل الملف يمنع الربط التلقائي عند DOMContentLoaded (المرحلة 6
     المتبقية) مع بقاء كائن الواجهة العام مصدرًا. */
  function microAutoInit() {
    return !(window.MicroConfig && window.MicroConfig.autoInit === false);
  }
  var m=c.model,n=c.node,r=c.root;
  r.appendChild(n('h2','m-product__title',m.title||L('k110')));
  if(m.reference){var p=n('p','m-product__secondary',L('k111'));p.appendChild(n('bdi','',m.reference));r.appendChild(p);}
  if(m.detail)r.appendChild(n('p','',m.detail));
  var actions=n('div','m-product__actions');
  [{id:'recheck',label:L('k112')},{id:'retry',label:L('k113')},{id:'save-local',label:L('k114'),local:true}].forEach(function(a){if((m.permissions||[]).indexOf(a.id)>=0)c.button(actions,a.id,a.label,{reference:m.reference||null},{local:a.local});});r.appendChild(actions);
  if(m.steps)c.timeline(r,m.steps);
});}());
