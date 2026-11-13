/* Explicit fixture consumer only. No transport, AI, persistence or real grants. */
(function(){'use strict';
  var type=new URL(location.href).searchParams.get('component')||'context';
  if(['context','state','market','delivery','assistant','review'].indexOf(type)<0)type='context';
  var owner={contextId:'owner-a',workspaceId:'workshop-a',roleId:'owner',kind:'business',label:'ورشة الشروق · صاحب مشروع'};
  var supplier={contextId:'supplier-b',workspaceId:'supply-b',roleId:'supplier',kind:'business',label:'منشأة التوريد · مورد'};
  var driver={contextId:'driver',workspaceId:null,roleId:'driver',kind:'driver',label:'السياق الشخصي · سائق'};
  var reviewer={contextId:'review',workspaceId:'review-desk',roleId:'reviewer',kind:'review',label:'سياق مراجعة مصرح به'};
  var contexts=[{scope:owner,label:owner.label,destinations:['manage','market','delivery','ask']},{scope:supplier,label:supplier.label,destinations:['market','delivery','ask']},{scope:driver,label:driver.label,destinations:['manage','market','delivery','ask']},{scope:reviewer,label:reviewer.label,destinations:['market','delivery','ask']}];
  var cases={context:[['business','صاحب مشروع / Workspace'],['supplier','مورد بحساب Micro نفسه'],['driver','سياق السائق'],['reviewer','سياق مراجعة بلا Manage']],state:[['remote','عملية تحتاج اتصالًا'],['local','Manage محلي على الجهاز']],market:[['card','بطاقة إعلان وصور'],['editor','نشر وتعديل'],['search','بحث وفلاتر'],['rejected','سبب رفض من المصدر'],['no-media','إعلان بلا صورة']],delivery:[['offer','عرض سعر وقبوله'],['request','طلب توصيل'],['tracking','متابعة وغياب الرد'],['change','تعديل ينتظر موافقات'],['proof','إثبات تسليم'],['return','إثبات إرجاع'],['driver','عرض في سياق السائق']],assistant:[['chat','محادثة ضمن Workspace'],['driver','Ask Micro في سياق السائق'],['proposal','إجراء يحتاج صلاحية وتأكيد'],['retry','فشل رسالة وإعادة المحاولة']],review:[['listing','مراجعة إعلان'],['report','إرسال بلاغ'],['flag','مراجعة بلاغ'],['driver-application','مراجعة طلب سائق']]};
  var names={context:'الحساب والسياق والتنقل',state:'الاتصال ونتيجة العملية',market:'Market · مكونات السوق',delivery:'Delivery · مكونات التوصيل',assistant:'Ask Micro · المحادثة',review:'الإدارة والمراجعة'};
  var selector=document.querySelector('#scenario'),phase=document.querySelector('#phase'),connection=document.querySelector('#connection'),root=document.querySelector('#product-root'),result=document.querySelector('#lab-result'),current,instance,lastIntent=null,events=[];
  document.querySelector('#lab-title').textContent=names[type];
  cases[type].forEach(function(x){var o=document.createElement('option');o.value=x[0];o.textContent=x[1];selector.appendChild(o);});
  [['ready','عادي'],['empty','فارغ'],['loading','تحميل'],['success','نجاح مؤكد من المصدر'],['error','خطأ'],['rejected','مرفوض'],['disabled','معطل'],['pending','انتظار'],['uncertain','حفظ / نتيجة غير مؤكدة'],['denied','لا صلاحية'],['expired','جلسة منتهية'],['signed-out','بحاجة إلى الدخول'],['conflict','تعارض نسخة'],['local-saved','محفوظ محليًا لا متزامن']].forEach(function(x){var o=document.createElement('option');o.value=x[0];o.textContent=x[1];phase.appendChild(o);});
  function fixture(name){
    var s=(name==='driver'?driver:type==='review'?reviewer:type==='context'&&name==='supplier'?supplier:type==='context'&&name==='reviewer'?reviewer:owner);
    var m={scope:structuredClone(s),dataContext:structuredClone(s),phase:'ready',connection:'online',destination:type==='market'?'market':type==='delivery'?'delivery':type==='assistant'?'ask':'manage',permissions:['view','compose','reauth','recheck'],revision:'sample-r1'};
    if(type==='context'){m.accountLabel='Micro · حساب تجريبي واحد';m.contexts=contexts;m.permissions.push('navigate','switch-context');if(s.kind==='driver')m.destination='delivery';if(s.kind==='review')m.destination='market';}
    if(type==='state'){m.title='نتيجة عملية من المستهلك';m.reference='sample-request-1';m.detail='لا تعتمد الواجهة الحفظ قبل إقرار المصدر.';m.permissions.push('recheck','retry');if(name==='local'){m.connection='local';m.phase='local-saved';m.permissions.push('save-local');}else m.destination='delivery';}
    if(type==='market'){
      Object.assign(m,{mode:name==='editor'?'editor':name==='search'?'search':'card',id:'listing-1',title:'طقم صابون مصنوع يدويًا',description:'وصف عينة محلي يقدمه المستهلك.',price:'150',unit:'د.أ',sellerLabel:'اسم منشأة معلن للعامة',statusLabel:name==='rejected'?'مرفوض حسب قرار المصدر':'قيد المراجعة',images:name==='no-media'?[]:[{src:'sample-one.svg',alt:'صورة توضيحية للمنتج 1'},{src:'sample-two.svg',alt:'صورة توضيحية للمنتج 2'}],requiredFields:['title','price']});
      if(name==='rejected')m.reason='سبب توضيحي قدمه مستهلك العينة؛ ليس سياسة نشر مفترضة.';
      m.permissions.push('edit','report','save-draft','publish','search','create');m.filters=[{id:'status',label:'حالة العرض',value:'all',options:[{id:'all',label:'كل الحالات المسموح بها'},{id:'pending',label:'بانتظار المراجعة'}]}];
    }
    if(type==='delivery'){
      Object.assign(m,{mode:name==='driver'?'offer':name==='return'?'proof':name,id:'delivery-1',title:'طلب توصيل توضيحي',statusLabel:'الحالة كما قدمها المصدر',pickup:'نقطة استلام مسموحة',dropoff:'نقطة تسليم مسموحة',visibility:{addresses:name!=='driver',contact:false},contact:'PRIVATE-CONTACT-NOT-FOR-DRIVER',amount:'12',unit:'د.أ',offerId:'offer-1',validityLabel:'لم يقدم المصدر مهلة لهذا المثال',requiredFields:name==='request'?['pickup','dropoff']:[],proofKind:name==='return'?'return':'delivery',attachmentRequired:false});
      m.permissions.push('request-delivery','accept','decline','assign','request-change','submit-proof','recheck');
      m.steps=[{label:'طلب جديد',time:'09:00',detail:'حدث يقدمه المصدر'},{label:'بانتظار رد',current:true,detail:'لا نفترض انتهاء مهلة أو قبولًا تلقائيًا'},{label:'خطوة لاحقة',detail:'ترتيب توضيحي، لا قاعدة انتقال'}];m.currentText='التفاصيل الحالية من المصدر';m.proposedText='تعديل مقترح لم يعتمد بعد';m.parties=[{label:'صاحب الطلب',statusLabel:'بانتظار الموافقة'},{label:'الطرف الآخر حسب المنتج',statusLabel:'لم يقدم المصدر قرارًا'}];
    }
    if(type==='assistant'){
      m.destination='ask';m.permissions.push('send','retry');m.messages=[{id:'message-1',speaker:'user',text:'ما المعلومة المتاحة في هذا السياق؟'},{id:'message-2',speaker:'assistant',text:'هذه رسالة توضيحية ثابتة من مستهلك المختبر، وليست استجابة AI.'}];
      if(name==='proposal'){m.proposal={id:'proposal-1',revision:'proposal-r1',summary:'طلب تعديل توضيحي في السياق الحالي؛ راجع التفاصيل قبل التأكيد.',label:'مراجعة وتأكيد الطلب'};m.permissions.push('execute');}
      if(name==='retry')m.messages=[{id:'failed-message',speaker:'user',text:'رسالة لم يؤكد المصدر إرسالها',stateLabel:'تعذّر الإرسال',retryable:true}];
    }
    if(type==='review'){
      m.destination=name==='driver-application'?'delivery':'market';Object.assign(m,{mode:name==='report'?'report':'queue',id:'review-1',title:'عنصر للمراجعة',subjectLabel:name==='driver-application'?'طلب سائق':name==='flag'?'بلاغ يحتاج مراجعة':'إعلان معروض للمراجعة',summary:'حقول مراجعة مصرح بها فقط؛ لا بيانات Manage المالية.',statusLabel:'بانتظار قرار المصدر',reasonRequired:true,requiredFields:['reason'],visibility:{evidence:true},images:[{src:'sample-one.svg',alt:'مرفق توضيحي للمراجعة'}]});m.permissions.push('approve','reject','request-info','view-evidence','submit-report');
    }
    return m;
  }
  function load(){if(instance)instance.destroy();current=fixture(selector.value);phase.value=current.phase;connection.value=current.connection;lastIntent=null;instance=MicroProduct.mount(root,type,current);window.lab.instance=instance;result.textContent='لم تصدر نية إجراء.';}
  window.lab={type:type,fixture:fixture,events:events,get model(){return structuredClone(current);},get lastIntent(){return lastIntent;},replace:function(m){current=structuredClone(m);instance.replace(current);},resolve:function(token,m){var ok=instance.resolve(token,m);if(ok)current=structuredClone(m);return ok;}};
  root.addEventListener('micro-product:intent',function(e){lastIntent=e.detail;events.push(e.detail);result.textContent='استلم المستهلك نية '+e.detail.action+'؛ لا خدمة أو تغيير مالي تلقائي.';});
  selector.addEventListener('change',load);phase.addEventListener('change',function(){current.phase=phase.value;instance.replace(current);});connection.addEventListener('change',function(){current.connection=connection.value;instance.replace(current);});
  function acknowledge(state){if(!lastIntent){result.textContent='لا طلب معلق لإقراره.';return;}var next=structuredClone(current);next.phase=state;
    if(lastIntent.action==='switch-context'&&state==='success'){next.scope=lastIntent.payload.targetScope;next.dataContext=next.scope;next.destination=next.scope.kind==='driver'?'delivery':next.scope.kind==='review'?'market':'manage';}
    if(lastIntent.action==='send'&&state==='success'){next.messages=(next.messages||[]).concat([{id:'ack-user-message',speaker:'user',text:lastIntent.payload.message,stateLabel:'أكد المستهلك استلامها'}]);next.clearDraft=true;}
    var ok=instance.resolve(lastIntent.request,next);if(ok){current=next;phase.value=state;}result.textContent=ok?'أقر مستهلك المعاينة النتيجة صراحة؛ لا اتصال بخدمة.':'تجاهل التركيب نتيجة قديمة أو غير مطابقة للسياق.';
  }
  document.querySelector('#ack-success').addEventListener('click',function(){acknowledge('success');});document.querySelector('#ack-error').addEventListener('click',function(){acknowledge('error');});document.querySelector('#ack-uncertain').addEventListener('click',function(){acknowledge('uncertain');});
  document.querySelector('#switch-workspace').addEventListener('click',function(){var old=current.scope.workspaceId;current.scope={contextId:'new-context',workspaceId:'other-workspace',roleId:'owner',kind:'business',label:'Workspace آخر'};current.dataContext=current.scope;current.messages=[];current.title='بيانات سياق جديد';instance.replace(current);result.textContent='بدّل المستهلك السياق؛ لا تستخدم نتيجة '+old+' القديمة.';});
  document.querySelector('#drop-permissions').addEventListener('click',function(){current.permissions=['reauth'];instance.replace(current);});document.querySelector('#destroy').addEventListener('click',function(){instance.destroy();result.textContent='نُظف التركيب؛ أعد اختيار المثال للتهيئة.';});load();
}());
