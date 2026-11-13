(function(){'use strict';
  var symbol=new URL('../../assets/brand/micro-logo/v2/variants/full-color/micro-symbol.svg',document.currentScript.src).href;
  var kinds={'follow-up':'follow-up',open:'open-resource',execute:'execute'};
  function text(value){return typeof value==='string'&&value.trim().length>0;}
  MicroProduct.register('assistant',function(c){
    var m=c.model,n=c.node,r=c.root,actionStatus=0,header=n('header','m-product__section m-assistant__header'),identity=n('div','m-assistant__identity'),logo=n('img','m-assistant__symbol');
    logo.src=symbol;logo.alt='';logo.width=24;logo.height=24;identity.append(logo,n('h2','m-product__title','Ask Micro'));header.append(identity,n('p','m-product__secondary',m.scope.label||m.scope.contextId));r.appendChild(header);
    var messages=m.phase==='empty'?[]:m.messages||[],log=n('div','m-product__log');log.setAttribute('role','log');log.setAttribute('aria-label','رسائل المحادثة');log.setAttribute('aria-relevant','additions text');log.setAttribute('aria-busy',String(!!m.replyPending));
    messages.forEach(function(message){
      var bubble=n('article','m-product__message'),speaker=['user','assistant'].indexOf(message.speaker)>=0?message.speaker:'system';bubble.dataset.speaker=speaker;
      bubble.append(n('strong','m-product__secondary',speaker==='user'?'أنت':speaker==='assistant'?'Ask Micro':'ملاحظة'),n('p','',message.text));
      if(message.stateLabel)bubble.appendChild(n('p','m-product__secondary',message.stateLabel));
      if(message.id&&(m.permissions||[]).indexOf('retry')>=0&&message.retryable)c.button(bubble,'retry','إعادة المحاولة',{messageId:message.id},{focusKey:'retry-'+message.id});
      // IDs address a host-defined action. Text never becomes code, URL or a grant.
      if(speaker==='assistant'&&text(message.id)&&messages.filter(function(x){return x.id===message.id;}).length===1){
        var actions=Array.isArray(message.actions)?message.actions:[],row=n('div','m-product__actions m-assistant__actions');
        actions.forEach(function(action){
          if(!action||!Object.prototype.hasOwnProperty.call(kinds,action.kind)||!text(action.id)||!text(action.label)||!text(action.revision)||actions.filter(function(x){return x&&x.id===action.id;}).length!==1)return;
          if(action.kind==='execute'&&!text(action.summary))return;
          var state=action.state===undefined?'ready':action.state,disabled=state!=='ready'||!!m.replyPending,id=kinds[action.kind];
          var button=c.button(row,id,action.label,{messageId:message.id,actionId:action.id,revision:action.revision},{confirm:action.kind==='execute',description:action.summary,focusKey:'message-action-'+message.id+'-'+action.id,disabled:disabled});
          if(state!=='ready'){var reason={expired:'انتهت صلاحية الاقتراح',completed:'تم تنفيذ الإجراء',unavailable:'الإجراء غير متاح'}[state]||'الإجراء غير متاح';var status=n('span','m-product__secondary',reason);status.id=c.uid+'-action-status-'+(++actionStatus);row.appendChild(status);button.setAttribute('aria-describedby',status.id);}
        });
        if(row.children.length)bubble.appendChild(row);
      }
      log.appendChild(bubble);
    });
    if(!log.children.length)log.appendChild(n('p','m-product__secondary','ابدأ محادثة في السياق الحالي'));r.appendChild(log);
    if(m.replyPending){var activity=n('div','m-assistant__activity');activity.setAttribute('role','status');var dot=n('span','m-assistant__activity-dot');dot.setAttribute('aria-hidden','true');activity.append(dot,n('span','',m.activity==='searching'?'جارٍ البحث…':'جارٍ إعداد الرد…'));r.appendChild(activity);}
    // Backwards compatible proposal; keep it adjacent to replies, before writing.
    if(m.proposal){var box=n('section','m-product__surface');box.append(n('h3','m-product__title','إجراء مقترح'),n('p','',m.proposal.summary));c.button(box,'execute',m.proposal.label||'مراجعة وتأكيد الإجراء',{proposalId:m.proposal.id,revision:m.proposal.revision},{confirm:true,description:m.proposal.summary});r.appendChild(box);}
    var composer=n('div','m-product__section m-assistant__composer'),input=c.field(composer,'message','رسالتك',{multiline:true,rows:1});c.button(composer,'send','إرسال',function(){return c.fieldsPayload(['message']);},{primary:true,disabled:!!m.replyPending});r.appendChild(composer);function grow(){input.style.blockSize='auto';input.style.blockSize=input.scrollHeight+'px';}c.on(input,'input',grow);grow();
  });
})();
