// Diagnostic execution of repository source in a small simulated DOM.
// Not browser, rendering, accessibility-tree, or screen-reader tests.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(process.argv[2]||process.cwd());
function env(){
 const jobs=[];
 class El {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.nodeType=1;this.attrs={};this.dataset={};this.style={};this.children=[];this.listeners={};this.hidden=false;this.disabled=false;this.inert=false;this.value='';this.className='';this.id='';this._text='';this.classList={contains:c=>this.className.split(' ').includes(c),toggle(){}};}
  get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}set textContent(t){this._text=String(t);this.children=[];}
  set innerHTML(v){this.children=[];this._text=v;}
  get firstChild(){return this.children[0]||null;}
  getAttribute(k){return this.attrs[k]??null;} setAttribute(k,v){this.attrs[k]=String(v);}removeAttribute(k){delete this.attrs[k];}hasAttribute(k){return Object.hasOwn(this.attrs,k);}
  addEventListener(k,f){(this.listeners[k]||=[]).push(f);}removeEventListener(k,f){this.listeners[k]=(this.listeners[k]||[]).filter(x=>x!==f);}dispatchEvent(){}
  appendChild(n){this.children.push(n);n.parentElement=this;return n;}insertBefore(n,b){let i=this.children.indexOf(b);if(i<0)i=this.children.length;this.children.splice(i,0,n);n.parentElement=this;}
  remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(n=>n!==this);}
  contains(n){return n===this||this.children.some(c=>c.contains(n));}
  closest(s){if(s==='.m-picker__option'&&this.className==='m-picker__option')return this;return this.parentElement?.closest(s)||null;}
  querySelector(s){return this.querySelectorAll(s)[0]||null;}
  querySelectorAll(s){if(s.includes('button, [href]'))return this._f||[];return this.children.flatMap(c=>[c,...c.querySelectorAll('*')]).filter(c=>s==='*'||(s==='.m-picker__state'&&c.className.includes('m-picker__state'))||(s.includes('.m-picker__option')&&c.className==='m-picker__option'));}
  checkVisibility(){return !this.hidden;}focus(){let p=this;while(p){if(p.inert||p.hidden)return;p=p.parentElement;}doc.activeElement=this;}
 }
 const doc={readyState:'loading',body:new El('body'),addEventListener(){},querySelector(){return null;},getElementById(){return null;},querySelectorAll(){return[];},createElement:t=>new El(t),createElementNS:(_,t)=>new El(t),createTextNode:t=>{let n=new El('text');n.textContent=t;return n;},contains(n){return this.body.contains(n);}};
 const win={setTimeout:f=>{jobs.push(f);return jobs.length;},clearTimeout(){},matchMedia:()=>({matches:false})};
 const ctx={window:win,document:doc,Event:class{},CustomEvent:class{},getComputedStyle:()=>({transitionDuration:'0.24s',getPropertyValue:()=>''})};
 function load(f){vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);return win;}
 return {El,doc,win,jobs,load};
}
function out(n,v){console.log(n,JSON.stringify(v));}
{
 const e=env(),{El,doc}=e;let trigger=doc.body.appendChild(new El('button')),layer=doc.body.appendChild(new El()),child=layer.appendChild(new El('button'));layer._f=[child];trigger.focus();let api=e.load('components/navigation/navigation.js').MicroNavigation;
 api.openLayer(layer);api.closeLayer(layer);api.openLayer(layer);e.jobs.forEach(f=>f());out('MODAL_REOPEN_DURING_CLOSE',{hiddenAfterReopen:layer.hidden,bodyOverflow:doc.body.style.overflow});
}
{
 const e=env(),{El,doc}=e;let main=doc.body.appendChild(new El('main')),trigger=main.appendChild(new El('button')),layer=main.appendChild(new El()),child=layer.appendChild(new El('button'));layer._f=[child];trigger.focus();e.load('components/navigation/navigation.js').MicroNavigation.openLayer(layer);out('MODAL_NESTED',{ancestorInert:main.inert});
}
{
 const e=env(),{El,doc}=e;let trigger=doc.body.appendChild(new El('button')),layer=doc.body.appendChild(new El());trigger.focus();e.load('components/navigation/navigation.js').MicroNavigation.openLayer(layer);out('MODAL_EMPTY',{focusMovedInside:layer.contains(doc.activeElement),oldTriggerInert:trigger.inert});
}
{
 const e=env(),sw=new e.El(),input=new e.El('input');input.disabled=true;sw.querySelector=()=>input;e.load('components/selection/selection.js').MicroSelection.setSwitchPending(sw,false);out('SWITCH_END_WITHOUT_START',{disabled:input.disabled});
}
{
 const e=env();function fld(id){let f=new e.El(),input=new e.El('input'),msg=new e.El();msg.id=id;f.querySelector=s=>s==='[data-field-msg]'?msg:s.includes('m-field__input')?input:null;return{f,input,msg};}
 let a=fld('m-field-msg-1'),b=fld('');e.load('components/fields/fields.js').MicroFields.init({querySelectorAll:()=>[a.f,b.f]});out('FIELD_PREEXISTING_ID',{first:a.msg.id,second:b.msg.id,duplicate:a.msg.id===b.msg.id});
}
{
 const e=env(),p=new e.El(),list=p.appendChild(new e.El()),foot=p.appendChild(new e.El());p.querySelector=s=>s==='[data-picker-list]'?list:s==='[data-picker-summary]'?foot:null;p.querySelectorAll=s=>list.querySelectorAll(s);let api=e.load('components/selection/picker.js').MicroPicker;api.setOptions(p,[{value:'a',label:'Alpha'}]);api.init({querySelectorAll:()=>[p]});let opt=list.querySelector('.m-picker__option');list.listeners.click[0]({target:opt});api.setStatus(p,'loading');out('PICKER_LOADING',{optionHidden:opt.hidden,optionDisabled:opt.disabled,optionCount:list.querySelectorAll('.m-picker__option').length});api.setOptions(p,[{value:'b',label:'Beta'}]);out('PICKER_REPLACE',{selected:api.getSelected(p),summary:foot.textContent});
}
{
 const e=env(),api=e.load('components/data/data.js').MicroData;
 function chart(values,attrs={}){let c=new e.El(),plot=new e.El();c.setAttribute('data-chart','donut');for(let k in attrs)c.setAttribute(k,attrs[k]);let items=values.map((v,i)=>{let n=new e.El();n.setAttribute('data-value',v??'');n.setAttribute('data-label','item'+i);n.setAttribute('data-series','a');return n;});c.querySelector=s=>s==='[data-plot]'?plot:null;c.querySelectorAll=()=>items;api.render(c);return plot.textContent;}
 out('DONUT_ALL_MISSING',chart([null,null]));out('DONUT_INVALID_NUMBER',chart(['12oops',3]));out('DONUT_INVALID_TOTAL',chart([4,6],{'data-total':'bad'}));
}
