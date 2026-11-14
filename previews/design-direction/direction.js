/* Local specimen state only; not a filtering or persistence API for a host. */
(function () {
  'use strict';
  var toggle=document.getElementById('filter-toggle'),panel=document.getElementById('filters'),count=document.getElementById('filter-count');
  function setOpen(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));}
  toggle.addEventListener('click',function(){setOpen(panel.hidden);});
  document.getElementById('apply-filters').addEventListener('click',function(){
    var active=panel.querySelectorAll('input:checked').length;count.textContent=String(active);count.hidden=active===0;
    document.getElementById('filter-status').textContent=active===2?'فلتران مفعّلان':active===1?'فلتر واحد مفعّل':'دون تصفية';
    toggle.setAttribute('aria-label',active?'تصفية، '+active+' فلاتر مفعّلة':'تصفية، دون فلاتر مفعّلة');setOpen(false);toggle.focus();
  });
  document.getElementById('preview-save').addEventListener('click',function(){document.getElementById('preview-status').textContent='تمت تجربة الزر؛ لم تُحفظ بيانات.';});
})();
