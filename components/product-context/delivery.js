(function(){'use strict';MicroProduct.register('delivery',function(c){

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
  var m=c.model,n=c.node,r=c.root,head=n('header','m-product__header');
  r.appendChild(head);head.appendChild(n('h2','m-product__title',m.title||L('k64')));
  if(m.statusLabel)head.appendChild(n('span','m-badge m-badge--info',m.statusLabel));
  if(m.mode!=='request'&&m.visibility&&m.visibility.addresses){var dl=n('dl','m-product__comparison');[[L('k65'),m.pickup],[L('k66'),m.dropoff]].forEach(function(x){dl.append(n('dt','',x[0]),n('dd','',x[1]||L('k67')));});r.appendChild(dl);}else if(!(m.visibility&&m.visibility.addresses))r.appendChild(n('p','m-product__secondary',L('k68')));
  if(m.visibility&&m.visibility.contact&&m.contact)r.appendChild(n('bdi','',m.contact));
  if(m.mode==='request'){
    c.field(r,'pickup',L('k69'),{value:m.visibility&&m.visibility.addresses?m.pickup:''});c.field(r,'dropoff',L('k70'),{value:m.visibility&&m.visibility.addresses?m.dropoff:''});c.field(r,'note',L('k71'),{multiline:true,value:m.note});
    c.button(r,'request-delivery',L('k72'),function(){return c.fieldsPayload(m.requiredFields||[]);},{confirm:true,description:L('k73')});
  }else if(m.mode==='offer'){
    var quote=n('section','m-product__section m-product__quote');r.appendChild(quote);var price=n('p','m-product__value');var number=n('bdi','',m.amount==null?L('k67'):m.amount);number.dir='ltr';price.append(number,document.createTextNode(' '+(m.unit||L('k74'))));quote.appendChild(price);quote.appendChild(n('p','m-product__secondary',m.validityLabel||L('k75')));
    var actions=n('div','m-product__actions m-btn-group m-btn-group--pair'),more=n('div','m-btn-group__more');r.appendChild(actions);['accept','decline','assign'].forEach(function(id){if((m.permissions||[]).indexOf(id)>=0)c.button(id==='assign'?more:actions,id,{accept:L('k76'),decline:L('k77'),assign:L('k78')}[id],{requestId:m.id,offerId:m.offerId,revision:m.revision},{confirm:true,primary:id==='accept',description:L('k79')+String(m.amount==null?L('k80'):m.amount)+' '+(m.unit||'')+'.'});});if(more.children.length)actions.appendChild(more);if(actions.querySelectorAll(':scope > .m-btn').length<2)actions.classList.remove('m-btn-group--pair');
  }else if(m.mode==='change'){
    var diff=n('dl','m-product__comparison');diff.append(n('dt','',L('k81')),n('dd','',m.currentText||L('k67')),n('dt','',L('k82')),n('dd','',m.proposedText||L('k67')));r.appendChild(diff);
    c.timeline(r,(m.parties||[]).map(function(p){return {label:p.label,detail:p.statusLabel||L('k83')};}));
    c.button(r,'request-change',L('k84'),{requestId:m.id,revision:m.revision},{confirm:true,description:L('k85')});
  }else if(m.mode==='proof'){
    if(m.requirementsLabel)r.appendChild(n('p','',m.requirementsLabel));c.field(r,'note',L('k86'),{multiline:true});c.attachments(r,m.attachmentRequired);
    c.button(r,'submit-proof',m.proofKind==='return'?L('k87'):L('k88'),function(){if(m.attachmentRequired&&!c.ui.files.length){c.note(r,L('k89'),'','error');return false;}var p=c.fieldsPayload(m.requiredFields||[]);if(p){p.requestId=m.id;p.proofKind=m.proofKind||'delivery';p.revision=m.revision;}return p;},{confirm:true,description:L('k90')});
  }else{
    c.timeline(r,m.steps);if((m.permissions||[]).indexOf('recheck')>=0)c.button(r,'recheck',L('k91'),{requestId:m.id});
  }
});}());
