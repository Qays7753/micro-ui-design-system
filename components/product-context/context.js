(function(){'use strict';MicroProduct.register('context',function(c){
  var m=c.model,n=c.node,r=c.root,contexts=m.contexts||[],keys=contexts.map(function(x){return c.key(x.scope);}),current=contexts.find(function(x){return x.scope&&c.key(x.scope)===c.key(m.scope);});
  r.appendChild(n('h2','m-product__title',m.accountLabel||'حساب Micro'));
  r.appendChild(n('p','m-product__secondary','حساب واحد · السياق الحالي يحدد البيانات والصلاحيات'));
  if(!current){c.note(r,'السياق غير متاح','اطلب قائمة السياقات المصرح بها.','warning');return;}
  if(keys.some(function(k,i){return !k||keys.indexOf(k)!==i;})){c.note(r,'قائمة السياقات غير صالحة','يلزم نطاق فريد لكل سياق معتمد.','warning');return;}
  var label=n('label','m-field__label','الدور والمنشأة / Workspace'),select=n('select','m-field__input');select.id=c.uid+'-context';select.dataset.focusKey='context-select';label.htmlFor=select.id;
  contexts.forEach(function(x){var option=n('option','',x.label);option.value=c.key(x.scope);select.appendChild(option);});select.value=c.key(m.scope);select.disabled=!c.can('switch-context');var field=n('div','m-field'),control=n('div','m-field__control');field.dataset.microField='';control.appendChild(select);field.append(label,control);r.appendChild(field);
  c.on(select,'change',function(){var chosen=select.value;select.value=c.key(m.scope);var item=contexts.find(function(x){return c.key(x.scope)===chosen;});if(item)c.request('switch-context',{contextId:item.scope.contextId,targetScope:structuredClone(item.scope)});});
  var names={manage:'Manage · الإدارة',market:'Market · السوق',delivery:'Delivery · التوصيل',ask:'Ask Micro'},nav=n('nav','m-product__destinations');nav.setAttribute('aria-label','وجهات Micro المصرح بها');
  ['manage','market','delivery','ask'].filter(function(id){return (current.destinations||[]).indexOf(id)>=0&&(m.scope.kind!=='driver'||id==='delivery'||id==='ask');}).forEach(function(id){var b=c.button(nav,'navigate',names[id],{destination:id});b.dataset.destination=id;b.dataset.focusKey='destination-'+id;if(m.destination===id)b.setAttribute('aria-current','page');});
  r.appendChild(nav);if(!nav.children.length)c.note(r,'لا وجهات متاحة','لا يمنح اسم الدور صلاحيات تلقائية.','warning');
});}());
