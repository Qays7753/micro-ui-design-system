(function(){'use strict';MicroProduct.register('delivery',function(c){
  var m=c.model,n=c.node,r=c.root;r.appendChild(n('h2','m-product__title',m.title||'طلب توصيل'));
  if(m.statusLabel)r.appendChild(n('span','m-badge m-badge--info',m.statusLabel));
  if(m.visibility&&m.visibility.addresses){var dl=n('dl','m-product__comparison');[['الاستلام',m.pickup],['التسليم',m.dropoff]].forEach(function(x){dl.append(n('dt','',x[0]),n('dd','',x[1]||'(غير متاح)'));});r.appendChild(dl);}else r.appendChild(n('p','m-product__secondary','تفاصيل المواقع غير متاحة لهذا السياق'));
  if(m.visibility&&m.visibility.contact&&m.contact)r.appendChild(n('bdi','',m.contact));
  if(m.mode==='request'){
    c.field(r,'pickup','موقع الاستلام',{value:m.visibility&&m.visibility.addresses?m.pickup:''});c.field(r,'dropoff','موقع التسليم',{value:m.visibility&&m.visibility.addresses?m.dropoff:''});c.field(r,'note','تفاصيل الطلب',{multiline:true,value:m.note});
    c.button(r,'request-delivery','إرسال طلب توصيل',function(){return c.fieldsPayload(m.requiredFields||[]);},{confirm:true,description:'إرسال طلب توصيل فقط؛ لا قيد مالي تلقائي في Manage.'});
  }else if(m.mode==='offer'){
    var price=n('p','m-product__value');var number=n('bdi','',m.amount==null?'(غير متاح)':m.amount);number.dir='ltr';price.append(number,document.createTextNode(' '+(m.unit||'(الوحدة غير محددة)')));r.appendChild(price);r.appendChild(n('p','m-product__secondary',m.validityLabel||'صلاحية العرض غير محددة في البيانات'));
    var actions=n('div','m-product__actions');r.appendChild(actions);['accept','decline','assign'].forEach(function(id){if((m.permissions||[]).indexOf(id)>=0)c.button(actions,id,{accept:'قبول العرض',decline:'رفض العرض',assign:'طلب إسناد للسائق'}[id],{requestId:m.id,offerId:m.offerId,revision:m.revision},{confirm:true,primary:id==='accept',description:'تأكيد العرض كما ورد: '+String(m.amount==null?'غير متاح':m.amount)+' '+(m.unit||'')+'. لا تغيير مالي تلقائي.'});});
  }else if(m.mode==='change'){
    var diff=n('dl','m-product__comparison');diff.append(n('dt','','البيانات الحالية'),n('dd','',m.currentText||'(غير متاح)'),n('dt','','التعديل المقترح'),n('dd','',m.proposedText||'(غير متاح)'));r.appendChild(diff);
    c.timeline(r,(m.parties||[]).map(function(p){return {label:p.label,detail:p.statusLabel||'بانتظار قرار المصدر'};}));
    c.button(r,'request-change','طلب موافقة على التعديل',{requestId:m.id,revision:m.revision},{confirm:true,description:'هذا طلب موافقة؛ لا يعتمد التعديل أو يغيّر الطلب من جهة واحدة.'});
  }else if(m.mode==='proof'){
    r.appendChild(n('p','',m.requirementsLabel||'متطلبات الإثبات يحددها المنتج؛ لا نفترض توقيعًا أو رمزًا أو موقعًا.'));c.field(r,'note','ملاحظة الإثبات',{multiline:true});c.attachments(r,m.attachmentRequired);
    c.button(r,'submit-proof',m.proofKind==='return'?'إرسال إثبات إرجاع':'إرسال إثبات تسليم',function(){if(m.attachmentRequired&&!c.ui.files.length){c.note(r,'أرفق الإثبات المطلوب','','error');return false;}var p=c.fieldsPayload(m.requiredFields||[]);if(p){p.requestId=m.id;p.proofKind=m.proofKind||'delivery';p.revision=m.revision;}return p;},{confirm:true,description:'تأكيد إرسال الإثبات للمراجعة؛ لا تعلن المكتبة اكتمال التسليم أو الإرجاع.'});
  }else{
    c.timeline(r,m.steps);if((m.permissions||[]).indexOf('recheck')>=0)c.button(r,'recheck','تحديث الحالة',{requestId:m.id});
  }
});}());
