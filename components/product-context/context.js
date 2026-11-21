(function(){'use strict';MicroProduct.register('context',function(c){

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
  var m=c.model,n=c.node,r=c.root,contexts=m.contexts||[],keys=contexts.map(function(x){return c.key(x.scope);}),current=contexts.find(function(x){return x.scope&&c.key(x.scope)===c.key(m.scope);});

  r.appendChild(n('h2','m-product__title',m.accountLabel||L('k53')));
  if(!current){c.note(r,L('k54'),L('k55'),'warning');return;}
  if(keys.some(function(k,i){return !k||keys.indexOf(k)!==i;})){c.note(r,L('k56'),L('k55'),'warning');return;}
  var label=n('label','m-field__label',L('k57')),select=n('select','m-field__input');select.id=c.uid+'-context';select.dataset.focusKey='context-select';label.htmlFor=select.id;
  contexts.forEach(function(x){var option=n('option','',x.label);option.value=c.key(x.scope);select.appendChild(option);});select.value=c.key(m.scope);select.disabled=!c.can('switch-context');var field=n('div','m-field'),control=n('div','m-field__control');field.dataset.microField='';control.appendChild(select);field.append(label,control);r.appendChild(field);
  c.on(select,'change',function(){var chosen=select.value;select.value=c.key(m.scope);var item=contexts.find(function(x){return c.key(x.scope)===chosen;});if(item)c.request('switch-context',{contextId:item.scope.contextId,targetScope:structuredClone(item.scope)});});
  var names={manage:L('k58'),market:L('k59'),delivery:L('k60'),ask:'Ask Micro'},nav=n('nav','m-product__destinations');nav.setAttribute('aria-label',L('k61'));
  ['manage','market','delivery','ask'].filter(function(id){return (current.destinations||[]).indexOf(id)>=0&&(m.scope.kind!=='driver'||id==='delivery'||id==='ask');}).forEach(function(id){var b=c.button(nav,'navigate',names[id],{destination:id});b.dataset.destination=id;b.dataset.focusKey='destination-'+id;if(m.destination===id)b.setAttribute('aria-current','page');});
  r.appendChild(nav);if(!nav.children.length)c.note(r,L('k62'),L('k63'),'warning');
});}());
