(function(){'use strict';MicroProduct.register('manage',function(c){

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
  /* C14 — Manage (D15/D16): قراءة وإدخال فقط. قاعدة صارمة: المكتبة لا
     تحسب أي مجاميع مالية — كل قيم ملخص الفترة يمررها المضيف حرفيًا،
     والوحدة تأتي من النموذج دائمًا ولا تفترضها المكتبة. Online-only:
     لا save-local ولا طابور ولا «تم الحفظ» قبل resolve من المضيف. */
  var m=c.model,n=c.node,r=c.root,head=n('header','m-product__header');
  r.appendChild(head);head.appendChild(n('h2','m-product__title',m.title||L('k145')));
  var operations=Array.isArray(m.operations)?m.operations:[];
  function unitOf(item){return item&&item.unit?item.unit:(m.unit||L('k105'));}
  /* ملخص الفترة — قيم المضيف فقط؛ المفقود ليس صفرًا. */
  if(Array.isArray(m.summary)&&m.summary.length){
    var summarySection=n('section','m-product__section');
    summarySection.appendChild(n('h3','m-product__title',L('k146')));
    var dl=n('dl','m-product__comparison');
    m.summary.forEach(function(item){
      if(!item||item.label==null||String(item.label).trim()==='')return;
      dl.appendChild(n('dt','',item.label));
      var dd=n('dd');
      if(item.value==null||String(item.value).trim()==='')dd.appendChild(n('span','m-product__secondary',L('k67')));
      else{var number=n('bdi','',item.value);number.dir='ltr';dd.append(number,document.createTextNode(' '+unitOf(item)));}
      dl.appendChild(dd);
    });
    if(dl.children.length){summarySection.appendChild(dl);r.appendChild(summarySection);}
  }
  /* صفوف العمليات على مبنى C02/Organization — النوع نص ظاهر لا لون فقط. */
  if(operations.length){
    var listSection=n('section','m-product__section');
    listSection.appendChild(n('h3','m-product__title',L('k147')));
    var list=n('ul','m-operational-list');
    operations.forEach(function(op){
      if(!op)return;
      var typeText=op.type==='sale'?L('k151'):op.type==='expense'?L('k152'):null;
      var row=n('li','m-row m-row--operational'),text=n('span','m-row__text');
      text.appendChild(n('strong','m-row__title',op.description||typeText||L('k67')));
      var sub=[];
      if(typeText&&op.description)sub.push(typeText);
      if(op.date)sub.push(op.date);
      if(sub.length)text.appendChild(n('span','m-row__subtitle',sub.join(' · ')));
      row.appendChild(text);
      var reading=n('span','m-row__reading');
      var amount=n('bdi','',op.amount==null||String(op.amount).trim()===''?L('k67'):op.amount);amount.dir='ltr';
      reading.append(amount,document.createTextNode(' '+unitOf(op)));row.appendChild(reading);
      list.appendChild(row);
    });
    if(list.children.length){listSection.appendChild(list);r.appendChild(listSection);}
  } else if(m.phase==='ready')r.appendChild(n('p','m-product__secondary',L('k157')));
  /* نموذج إدخال عملية: Fields للمدخلات وB01 للأفعال. الإرسال نية تنتظر
     تأكيد الخادم؛ «تفريغ الحقول» فعل عرضي محلي لا يطلق نية. */
  var form=n('section','m-product__section');
  form.appendChild(n('h3','m-product__title',L('k148')));
  c.field(form,'amount',L('k149'),{inputmode:'decimal',unit:m.unit||L('k105')});
  c.field(form,'type',L('k150'),{options:[{id:'sale',label:L('k151')},{id:'expense',label:L('k152')}]});
  c.field(form,'date',L('k153'),{type:'date'});
  c.field(form,'note',L('k154'),{multiline:true});
  var actions=n('div','m-product__actions m-btn-group m-btn-group--pair');
  var submit=c.button(actions,'add-operation',L('k155'),function(){return c.fieldsPayload(m.requiredFields||[]);},{primary:true,confirm:true,description:L('k158')});
  /* انتظار تأكيد الخادم: زر الإرسال يظهر حالة تحميل ويعطل — لا نجاح قبل resolve. */
  if(c.pending==='add-operation'){submit.setAttribute('aria-busy','true');submit.classList.add('is-loading');submit.insertBefore(n('span','m-btn__spinner'),submit.firstChild);}
  var cancel=n('button','m-btn m-btn--secondary',L('k156'));cancel.type='button';cancel.dataset.focusKey='clear-operation-form';cancel.disabled=!c.editable();
  c.on(cancel,'click',function(){
    if(!c.editable())return;
    Array.prototype.forEach.call(form.querySelectorAll('[data-focus-key^="field-"]'),function(input){
      input.value='';input.dispatchEvent(new Event(input.tagName==='SELECT'?'change':'input',{bubbles:true}));
    });
  });
  actions.appendChild(cancel);form.appendChild(actions);r.appendChild(form);
  /* فشل مؤكد من المضيف مع grant retry: إعادة إرسال صريحة للقيم نفسها، لا نجاح مفترض. */
  if(m.phase==='error'&&(m.permissions||[]).indexOf('retry')>=0)c.button(r,'retry',L('k113'),function(){return c.fieldsPayload(m.requiredFields||[]);});
});}());
