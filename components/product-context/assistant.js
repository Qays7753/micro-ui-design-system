(function(){'use strict';MicroProduct.register('assistant',function(c){
  var m=c.model,n=c.node,r=c.root;r.appendChild(n('h2','m-product__title','Ask Micro'));r.appendChild(n('p','m-product__secondary',m.scope.label||m.scope.contextId));
  var log=n('div','m-product__log');log.setAttribute('role','log');log.setAttribute('aria-label','رسائل المحادثة');log.setAttribute('aria-relevant','additions text');
  (m.phase==='empty'?[]:m.messages||[]).forEach(function(message){var bubble=n('article','m-product__message');bubble.dataset.speaker=['user','assistant'].indexOf(message.speaker)>=0?message.speaker:'system';bubble.append(n('strong','m-product__secondary',message.speaker==='user'?'أنت':message.speaker==='assistant'?'Ask Micro':'ملاحظة'),n('p','',message.text));if(message.stateLabel)bubble.appendChild(n('p','m-product__secondary',message.stateLabel));if(message.id&&(m.permissions||[]).indexOf('retry')>=0&&message.retryable)c.button(bubble,'retry','إعادة المحاولة',{messageId:message.id},{focusKey:'retry-'+message.id});log.appendChild(bubble);});
  if(!log.children.length)log.appendChild(n('p','m-product__secondary','ابدأ محادثة في السياق الحالي'));r.appendChild(log);
  if(m.replyPending)c.note(r,'جارٍ إعداد الرد…','','info');
  c.field(r,'message','رسالتك',{multiline:true});c.button(r,'send','إرسال',function(){return c.fieldsPayload(['message']);},{primary:true});
  if(m.proposal){var box=n('section','m-product__surface');box.append(n('h3','m-product__title','إجراء مقترح'),n('p','',m.proposal.summary));c.button(box,'execute',m.proposal.label||'مراجعة وتأكيد الإجراء',{proposalId:m.proposal.id,revision:m.proposal.revision},{confirm:true,description:m.proposal.summary});r.appendChild(box);}
});}());
