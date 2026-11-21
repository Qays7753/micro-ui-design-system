(function(){'use strict';MicroProduct.register('review',function(c){

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
  r.appendChild(n('h2','m-product__title',m.mode==='report'?L('k130'):m.title||L('k131')));
  if(m.subjectLabel)r.appendChild(n('p','',m.subjectLabel));if(m.statusLabel)r.appendChild(n('span','m-badge m-badge--info',m.statusLabel));
  if(m.mode==='report'){
    c.field(r,'reason',L('k132'),{multiline:true});if(m.reasonOptions)c.field(r,'category',L('k133'),{options:m.reasonOptions});
    c.button(r,'submit-report',L('k134'),function(){var p=c.fieldsPayload(m.requiredFields||[]);if(p)p.subjectId=m.id;return p;},{confirm:true,description:L('k135')});return;
  }
  if(m.summary)r.appendChild(n('p','',m.summary));if(m.reason)c.note(r,L('k136'),m.reason,'info');
  if((m.permissions||[]).indexOf('view-evidence')>=0&&m.visibility&&m.visibility.evidence)c.media(r,m.images,'contain');else if(m.images&&m.images.length)r.appendChild(n('p','m-product__secondary',L('k137')));
  c.field(r,'reason',L('k138'),{multiline:true});
  var actions=n('div','m-product__actions');r.appendChild(actions);[{id:'approve',label:L('k139')},{id:'reject',label:L('k140')},{id:'request-info',label:L('k141')}].forEach(function(a){if((m.permissions||[]).indexOf(a.id)>=0)c.button(actions,a.id,a.label,function(){var p=c.fieldsPayload(m.reasonRequired&&a.id==='reject'?['reason']:[]);if(p){p.subjectId=m.id;p.revision=m.revision;}return p;},{confirm:true,primary:a.id==='approve',danger:a.id==='reject',description:L('k142')+a.label+L('k143')+(m.subjectLabel||L('k144'))+'.'});});
  if(m.history)c.timeline(r,m.history);
});}());
