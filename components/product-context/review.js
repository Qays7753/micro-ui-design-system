(function(){'use strict';MicroProduct.register('review',function(c){
  var m=c.model,n=c.node,r=c.root;r.appendChild(n('h2','m-product__title',m.mode==='report'?'إرسال بلاغ':m.title||'عنصر للمراجعة'));
  if(m.subjectLabel)r.appendChild(n('p','',m.subjectLabel));if(m.statusLabel)r.appendChild(n('span','m-badge m-badge--info',m.statusLabel));
  if(m.mode==='report'){
    c.field(r,'reason','سبب البلاغ',{multiline:true});if(m.reasonOptions)c.field(r,'category','التصنيف',{options:m.reasonOptions});
    c.button(r,'submit-report','إرسال البلاغ',function(){var p=c.fieldsPayload(m.requiredFields||[]);if(p)p.subjectId=m.id;return p;},{confirm:true,description:'تأكيد إرسال البلاغ؛ لا إخفاء أو رفض تلقائي للعنصر.'});return;
  }
  if(m.summary)r.appendChild(n('p','',m.summary));if(m.reason)c.note(r,'سبب أو ملاحظة',m.reason,'info');
  if((m.permissions||[]).indexOf('view-evidence')>=0&&m.visibility&&m.visibility.evidence)c.media(r,m.images,'contain');else if(m.images&&m.images.length)r.appendChild(n('p','m-product__secondary','المرفقات مقيدة حسب الصلاحية'));
  c.field(r,'reason','ملاحظة القرار',{multiline:true});
  var actions=n('div','m-product__actions');r.appendChild(actions);[{id:'approve',label:'قبول'},{id:'reject',label:'رفض'},{id:'request-info',label:'طلب معلومات'}].forEach(function(a){if((m.permissions||[]).indexOf(a.id)>=0)c.button(actions,a.id,a.label,function(){var p=c.fieldsPayload(m.reasonRequired&&a.id==='reject'?['reason']:[]);if(p){p.subjectId=m.id;p.revision=m.revision;}return p;},{confirm:true,primary:a.id==='approve',danger:a.id==='reject',description:'مراجعة قرار '+a.label+' على '+(m.subjectLabel||'هذا العنصر')+'. الصلاحية والتنفيذ عند المصدر.'});});
  if(m.history)c.timeline(r,m.history);
});}());
