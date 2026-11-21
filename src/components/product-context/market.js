(function(){'use strict';MicroProduct.register('market',function(c){

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
  r.appendChild(head);head.appendChild(n('h2','m-product__title',m.mode==='editor'?L('k92'):(m.mode==='search'||m.mode==='results')?L('k93'):m.title||L('k94')));
  /* رأس البحث مشترك بين وضعي search وresults (المرحلة 8): الاستعلام
     والفلاتر وزر البحث وملخص النتائج — كلها من المستهلك. */
  function searchHeader(){
    c.field(r,'query',L('k95'),{value:m.query,type:'search'});(m.filters||[]).forEach(function(f){c.field(r,f.id,f.label,{options:f.options,value:f.value});});
    c.button(r,'search',L('k96'),function(){return c.fieldsPayload([]);});if(m.resultLabel)r.appendChild(n('p','m-product__secondary',m.resultLabel));
  }
  function thumbEmpty(label){var el=n('div','m-product__thumb m-product__thumb--empty');el.setAttribute('role','img');el.setAttribute('aria-label',label);return el;}
  if(m.mode==='search'){searchHeader();return;}
  /* C09/results (D17): مصفوفة نتائج من المضيف تُرسم صفوفًا على مبنى
     C02/Organization. حالات منفصلة: لا إعلانات أصلًا (resultsState)،
     لا نتائج لهذا البحث، فشل القراءة (phase=error مع retry إن وفّره
     المضيف)، والتحميل عبر phase=loading. صورة مفقودة لا تكسر التخطيط. */
  if(m.mode==='results'){
    searchHeader();
    if(m.phase==='error'){
      if((m.permissions||[]).indexOf('retry')>=0)c.button(r,'retry',L('k113'),{});
      return;
    }
    if(m.resultsState==='no-ads')c.note(r,L('k160'),L('k161'),'info');
    else if(m.resultsState==='no-results')c.note(r,L('k162'),L('k163'),'info');
    else{
      var results=Array.isArray(m.results)?m.results:[];
      if(results.length){
        var section=n('section','m-product__section');
        section.appendChild(n('h3','m-product__title',L('k159')));
        var list=n('ul','m-operational-list');
        results.forEach(function(item){
          if(!item)return;
          var row=n('li','m-row m-row--operational');
          if(item.image){
            var src=c.safeImage(item.image.src);
            if(src){var img=n('img','m-product__thumb');img.src=src;img.alt=item.image.alt||L('k21');img.loading='lazy';img.decoding='async';c.on(img,'error',function(){img.replaceWith(thumbEmpty(L('k25')));});row.appendChild(img);}
            else row.appendChild(thumbEmpty(L('k21')));
          }
          var text=n('span','m-row__text');
          text.appendChild(n('strong','m-row__title',item.title||L('k67')));
          if(item.sellerLabel)text.appendChild(n('span','m-row__subtitle',item.sellerLabel));
          row.appendChild(text);
          if(item.statusLabel){var meta=n('div','m-row__meta');meta.appendChild(n('span','m-badge m-badge--info',item.statusLabel));row.appendChild(meta);}
          var reading=n('span','m-row__reading');
          var price=n('bdi','',item.price==null||String(item.price).trim()===''?L('k67'):item.price);price.dir='ltr';
          reading.append(price,document.createTextNode(' '+(item.unit||m.unit||L('k105'))));row.appendChild(reading);
          list.appendChild(row);
        });
        if(list.children.length){section.appendChild(list);r.appendChild(section);}
      }
    }
    return;
  }
  if(m.mode==='editor'){
    c.field(r,'title',L('k97'),{value:m.title,maxLength:m.titleMaxLength});c.field(r,'description',L('k98'),{value:m.description,multiline:true});c.field(r,'price',L('k99'),{value:m.price,inputmode:'decimal',unit:m.unit||L('k100')});if(m.images&&m.images.length)c.media(r,m.images,'contain',true);c.attachments(r,false);
    var row=n('div','m-product__actions m-btn-group m-btn-group--pair');r.appendChild(row);['publish','save-draft'].forEach(function(id){if((m.permissions||[]).indexOf(id)>=0)c.button(row,id,id==='publish'?L('k101'):L('k102'),function(){return c.fieldsPayload(id==='publish'?(m.requiredFields||[]):[]);},{confirm:id==='publish',primary:id==='publish',description:function(data){return L('k103')+data.title+L('k104')+data.price+' '+(m.unit||L('k105'))+'.';}});});if(row.children.length<2)row.classList.remove('m-btn-group--pair');return;
  }
  if(m.price!==null&&m.price!==undefined){var price=n('p','m-product__value');var number=n('bdi','',m.price);number.dir='ltr';price.append(number,document.createTextNode(' '+(m.unit||L('k105'))));head.appendChild(price);}
  if(m.sellerLabel)head.appendChild(n('p','m-product__secondary',m.sellerLabel));if(m.statusLabel)head.appendChild(n('span','m-badge m-badge--info',m.statusLabel));c.media(r,m.images,m.fit);if(m.reason)c.note(r,L('k106'),m.reason,'warning');
  var actions=n('div','m-product__actions');r.appendChild(actions);[{id:'edit',label:L('k107')},{id:'report',label:L('k108')}].forEach(function(a){if((m.permissions||[]).indexOf(a.id)>=0)c.button(actions,a.id,a.label,{listingId:m.id,revision:m.revision},{confirm:a.confirm,description:L('k109')});});
});}());
