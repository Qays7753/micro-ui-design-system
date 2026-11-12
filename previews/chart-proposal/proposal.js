/* Disposable review model, not a MicroData API or reusable implementation.
   Explicit synthetic daily records; no random series or product calls. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const baseline = [580,720,640,810,690,560,820];
  const names = ['الجمعة','السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
  const colors = ['--micro-data-a','--micro-data-b','--micro-data-d','--micro-data-e'];
  const distribution = [{label:'مواد',value:600},{label:'توصيل',value:360},{label:'تشغيل',value:180},{label:'أخرى',value:120}];
  const state = { values: baseline.slice(), mode:'bars', point:6, goal:1800, received:1260, selectedShare:0, readingsOpen:false };
  const fmt = n => n === null ? 'غير متاح' : (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US',{maximumFractionDigits:3});
  function rows(selector, data, unit, signed=false) {
    const max = Math.max(1,...data.filter(d=>d.value!==null).map(d=>Math.abs(d.value)));
    $(selector).innerHTML = data.map(d=>{
      const width=d.value===null?0:Math.abs(d.value)/max*(signed?50:100);
      const left=signed?(d.value<0?50-width:50):0;
      return `<li><div class="proposal-row-head"><span>${d.label}</span><strong><bdi dir="ltr">${fmt(d.value)}</bdi><span class="proposal-unit">${d.value===null?'':unit}</span></strong></div>${d.value===null?'':`<div class="proposal-bar${signed?' is-signed':''}" aria-hidden="true"><span style="left:${left}%;width:${width}%;${d.value===0?'border-inline-start:2px solid var(--micro-data-a)':''}"></span></div>`}</li>`;
    }).join('');
  }
  function setReading(selector,text) {
    const chunks=text.split(','),nodes=[];
    chunks.forEach((chunk,i)=>{nodes.push(document.createTextNode(chunk+(i<chunks.length-1?',':'')));if(i<chunks.length-1)nodes.push(document.createElement('wbr'));});
    $(selector).replaceChildren(...nodes);
  }
  function renderTrend() {
    const a=state.values, known=a.filter(x=>x!==null), sum=known.reduce((x,y)=>x+y,0);
    setReading('#week-total',known.length===a.length?fmt(sum):'غير متاح');
    const delta=sum-4180;
    $('#week-difference').textContent=known.length===a.length?(delta>0?'+':'')+fmt(delta):'غير متاح';
    const lo=Math.min(0,...known),hi=Math.max(0,...known),range=hi-lo||1;
    const y=v=>100-(v-lo)/range*72;
    const x=i=>20+i*256/6;
    const zero=y(0);
    let svg=`<line class="proposal-grid-line" x1="8" y1="28" x2="288" y2="28"/><line class="proposal-grid-line" x1="8" y1="64" x2="288" y2="64"/><line class="proposal-zero-line" x1="8" y1="${zero}" x2="288" y2="${zero}"/>`;
    if(state.mode==='line') {
      let path='',active=false;
      a.forEach((v,i)=>{if(v===null){active=false;return;}path+=(active?'L':'M')+x(i)+','+y(v)+' ';active=true;});
      svg+=`<path class="proposal-line" d="${path}"/>`;
    }
    a.forEach((v,i)=>{
      if(v===null){svg+=`<text x="${x(i)}" y="${zero-6}" text-anchor="middle" fill="var(--micro-text-secondary)" font-size="14">—</text>`;return;}
      const selected=i===state.point;
      if(state.mode==='bars')svg+=`<rect class="proposal-mark" x="${x(i)-11}" y="${Math.min(y(v),zero)}" width="22" height="${Math.max(2,Math.abs(y(v)-zero))}" rx="5" ${selected?'stroke="var(--micro-text-primary)" stroke-width="2"':''}/>`;
      else svg+=`<circle cx="${x(i)}" cy="${y(v)}" r="${selected?5:3}" fill="var(--micro-surface-base)" stroke="var(--micro-data-a)" stroke-width="2"/>`;
      if(state.mode==='bars'&&fmt(v).length<=6)svg+=`<text class="proposal-bar-label" direction="ltr" unicode-bidi="isolate" x="${x(i)}" y="${Math.min(y(v),zero)-6}" text-anchor="middle">${fmt(v)}</text>`;
    });
    a.forEach((_,i)=>{svg+=`<text class="proposal-date-label" direction="ltr" unicode-bidi="isolate" x="${x(i)}" y="122" text-anchor="middle" font-weight="${i===state.point?600:400}">${String(i+6).padStart(2,'0')}/11</text>`;});
    $('#trend-svg').innerHTML=svg;
    const fallback=state.mode==='bars'&&known.some(v=>fmt(v).length>6);
    $('#trend-plot').hidden=fallback;
    $('#trend-plot').dataset.readingLayout=fallback?'readings':'chart';
    $('#trend-data').hidden=!(fallback||state.readingsOpen);
    $('#data-toggle').setAttribute('aria-expanded',String(fallback||state.readingsOpen));
    $('#data-toggle').disabled=fallback;
    $('#data-toggle').setAttribute('aria-label',fallback?'القراءات الكاملة معروضة':'عرض القراءات الكاملة');
    const i=state.point, reading=`${names[i]} ${i+6} نوفمبر · ${fmt(a[i])}${a[i]===null?'':' د.أ'}`;
    $('#point-reading').innerHTML=`${names[i]} ${i+6} نوفمبر<br><strong><bdi dir="ltr">${fmt(a[i]).replaceAll(',',',<wbr>')}</bdi>${a[i]===null?'':' د.أ'}</strong>`;
    $('#point-picker').value=i;$('#point-picker').setAttribute('aria-valuetext',reading);
    $('#point-prev').disabled=i===0;$('#point-next').disabled=i===6;
    $('#trend-table').innerHTML=a.map((v,j)=>`<tr><th scope="row">${names[j]} ${j+6} نوفمبر</th><td><bdi dir="ltr">${fmt(v)}</bdi></td></tr>`).join('');
  }
  function renderShare() {
    const total=distribution.reduce((s,d)=>s+d.value,0),circ=2*Math.PI*42;
    let offset=0;
    $('#share-ring').innerHTML=distribution.map((d,i)=>{
      const part=d.value/total*circ;
      const result=`<circle cx="56" cy="56" r="42" style="stroke:var(${colors[i]});stroke-dasharray:${Math.max(0,part-3)} ${circ};stroke-dashoffset:${-offset};${i===state.selectedShare?'stroke-width:13px;':''}"/>`;
      offset+=part;return result;
    }).join('');
    const selected=distribution[state.selectedShare];
    $('#share-selected').textContent=selected.label+'، '+fmt(selected.value)+' د.أ، '+Math.round(selected.value/total*100)+'% من إجمالي المصروفات';
    $('#share-list').innerHTML=distribution.map((d,i)=>`<button type="button" class="proposal-share-item" data-share="${i}" aria-pressed="${i===state.selectedShare}"><span class="proposal-dot" style="background:var(${colors[i]})" aria-hidden="true"></span><span data-category>${d.label}</span><span data-amount><bdi dir="ltr">${fmt(d.value)}</bdi> <span class="proposal-unit">د.أ</span>${i===state.selectedShare?`<span class="proposal-share-percent" data-share-percent dir="ltr" aria-label="${Math.round(d.value/total*100)}% من إجمالي المصروفات">${Math.round(d.value/total*100)}%</span>`:''}</span></button>`).join('');
  }
  function renderGoal() {
    const valid=Number.isFinite(state.goal)&&state.goal>0;
    $('#goal-value').textContent=fmt(state.received);
    $('#goal-context').textContent=valid?'من أصل '+fmt(state.goal)+' د.أ':state.goal===0?'إجمالي الفواتير: صفر':'إجمالي الفواتير غير متاح';
    $('#goal-track').hidden=!valid;
    if(valid){const ratio=state.received/state.goal;$('#goal-fill').style.width=Math.min(100,ratio*100)+'%';$('#goal-percent').textContent=Math.round(ratio*100)+'%';$('#goal-remainder').textContent=(ratio>1?'زيادة على القيمة المعلنة: ':'المتبقي: ')+fmt(Math.abs(state.goal-state.received))+' د.أ';$('#goal-track').setAttribute('aria-valuemin','0');$('#goal-track').setAttribute('aria-valuemax',state.goal);$('#goal-track').setAttribute('aria-valuenow',Math.min(state.received,state.goal));$('#goal-track').setAttribute('aria-valuetext',fmt(state.received)+' من '+fmt(state.goal)+' د.أ، '+Math.round(ratio*100)+'%');}
    else {$('#goal-percent').textContent='';$('#goal-remainder').textContent=state.goal===0?'لا نسبة تحصيل لقيمة صفرية.':'المتبقي غير متاح';['aria-valuemin','aria-valuemax','aria-valuenow','aria-valuetext'].forEach(a=>$('#goal-track').removeAttribute(a));}
  }
  function setView(id) { $$('.proposal-view').forEach(x=>x.hidden=x.id!==id);$$('[data-view]').forEach(x=>{const selected=x.dataset.view===id;x.setAttribute('aria-pressed',String(selected));x.classList.toggle('m-btn--primary',selected);x.classList.toggle('m-btn--secondary',!selected);}); }
  document.addEventListener('click',e=>{
    const view=e.target.closest('[data-view]');if(view)setView(view.dataset.view);
    const mode=e.target.closest('[data-mode]');if(mode){state.mode=mode.dataset.mode;$$('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===mode)));renderTrend();}
    const share=e.target.closest('[data-share]');if(share){state.selectedShare=Number(share.dataset.share);renderShare();$('#share-list [data-share="'+state.selectedShare+'"]').focus({preventScroll:true});}
    const goal=e.target.closest('[data-goal]');if(goal){const key=goal.dataset.goal;state.goal=key==='unknown'?null:key==='zero'?0:1800;state.received=key==='over'?2340:1260;renderGoal();}
    const sample=e.target.closest('[data-state]');if(sample){state.values=baseline.slice();const key=sample.dataset.state;if(key==='zero')state.values=state.values.map(()=>0);if(key==='missing')state.values[3]=null;if(key==='negative')state.values[3]=-160;if(key==='long')state.values[6]=123456789.125;state.point=key==='missing'||key==='negative'?3:6;renderTrend();setView('activity');}
  });
  $('#data-toggle').addEventListener('click',()=>{state.readingsOpen=!state.readingsOpen;renderTrend();});
  $('#comparison-toggle').addEventListener('click',()=>{const open=$('#comparison-toggle').getAttribute('aria-expanded')!=='true';$('#comparison-toggle').setAttribute('aria-expanded',String(open));$('#trend-comparison').hidden=!open;});
  $('#point-picker').addEventListener('input',e=>{state.point=Number(e.target.value);renderTrend();});
  $('#point-prev').addEventListener('click',()=>{state.point=Math.max(0,state.point-1);renderTrend();});
  $('#point-next').addEventListener('click',()=>{state.point=Math.min(6,state.point+1);renderTrend();});
  rows('#ranking-list',[{label:'قهوة عربية',value:36},{label:'كيك تمر',value:24},{label:'بسكويت',value:18}],'قطعة');
  rows('#cash-list',[{label:'مقبوض',value:3120},{label:'مدفوع',value:2480}],'د.أ');
  rows('#clients-list',[{label:'متجر الندى',value:820},{label:'مقهى الحي',value:460},{label:'مخبز السنابل',value:280}],'د.أ');
  rows('#signed-list',[{label:'الصنف الأول',value:32},{label:'الصنف الثاني',value:-9},{label:'الصنف الثالث',value:0}],'قطعة',true);
  renderTrend();renderShare();renderGoal();
})();
