(function(){'use strict';MicroProduct.register('state',function(c){
  var m=c.model,n=c.node,r=c.root;r.appendChild(n('h2','m-product__title',m.title||'حالة العملية'));
  if(m.reference){var p=n('p','m-product__secondary','مرجع الطلب: ');p.appendChild(n('bdi','',m.reference));r.appendChild(p);}
  if(m.detail)r.appendChild(n('p','',m.detail));
  var actions=n('div','m-product__actions');
  [{id:'recheck',label:'إعادة التحقق'},{id:'retry',label:'إعادة المحاولة'},{id:'save-local',label:'حفظ محلي',local:true}].forEach(function(a){if((m.permissions||[]).indexOf(a.id)>=0)c.button(actions,a.id,a.label,{reference:m.reference||null},{local:a.local});});r.appendChild(actions);
  if(m.steps)c.timeline(r,m.steps);
});}());
