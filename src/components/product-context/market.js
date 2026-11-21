(function(){'use strict';MicroProduct.register('market',function(c){
  var m=c.model,n=c.node,r=c.root,head=n('header','m-product__header');r.appendChild(head);head.appendChild(n('h2','m-product__title',m.mode==='editor'?'بيانات الإعلان':m.mode==='search'?'بحث السوق':m.title||'إعلان'));
  if(m.mode==='search'){
    c.field(r,'query','البحث',{value:m.query,type:'search'});(m.filters||[]).forEach(function(f){c.field(r,f.id,f.label,{options:f.options,value:f.value});});
    c.button(r,'search','عرض النتائج',function(){return c.fieldsPayload([]);});if(m.resultLabel)r.appendChild(n('p','m-product__secondary',m.resultLabel));return;
  }
  if(m.mode==='editor'){
    c.field(r,'title','عنوان الإعلان',{value:m.title,maxLength:m.titleMaxLength});c.field(r,'description','الوصف',{value:m.description,multiline:true});c.field(r,'price','السعر',{value:m.price,inputmode:'decimal',unit:m.unit||'الوحدة غير محددة'});if(m.images&&m.images.length)c.media(r,m.images,'contain',true);c.attachments(r,false);
    var row=n('div','m-product__actions m-btn-group m-btn-group--pair');r.appendChild(row);['publish','save-draft'].forEach(function(id){if((m.permissions||[]).indexOf(id)>=0)c.button(row,id,id==='publish'?'إرسال للنشر':'حفظ المسودة',function(){return c.fieldsPayload(id==='publish'?(m.requiredFields||[]):[]);},{confirm:id==='publish',primary:id==='publish',description:function(data){return 'إرسال '+data.title+' بسعر '+data.price+' '+(m.unit||'(الوحدة غير محددة)')+'.';}});});if(row.children.length<2)row.classList.remove('m-btn-group--pair');return;
  }
  if(m.price!==null&&m.price!==undefined){var price=n('p','m-product__value');var number=n('bdi','',m.price);number.dir='ltr';price.append(number,document.createTextNode(' '+(m.unit||'(الوحدة غير محددة)')));head.appendChild(price);}
  if(m.sellerLabel)head.appendChild(n('p','m-product__secondary',m.sellerLabel));if(m.statusLabel)head.appendChild(n('span','m-badge m-badge--info',m.statusLabel));c.media(r,m.images,m.fit);if(m.reason)c.note(r,'ملاحظة المراجعة',m.reason,'warning');
  var actions=n('div','m-product__actions');r.appendChild(actions);[{id:'edit',label:'تعديل'},{id:'report',label:'الإبلاغ عن الإعلان'}].forEach(function(a){if((m.permissions||[]).indexOf(a.id)>=0)c.button(actions,a.id,a.label,{listingId:m.id,revision:m.revision},{confirm:a.confirm,description:'إرسال طلب بلاغ؛ التصنيف والمراجعة وفق قواعد المنتج المعتمدة.'});});
});}());
