const fs=require('fs'),vm=require('vm');
// Diagnostic probes in a minimal simulated DOM, NOT browser or accessibility tests.
// Run: node /path/to/source-probes.cjs /path/to/checked-out-review-head
// Printed values describe behavior; exit 0 is NOT an approval/pass indicator.
const root=require('path').resolve(process.argv[2] || process.cwd());
function load(file,doc){const ctx={window:{},document:doc,Event:class{constructor(type){this.type=type}},CustomEvent:class{constructor(type,opts){this.type=type;Object.assign(this,opts)}},getComputedStyle:()=>({getPropertyValue:()=>''})};vm.runInNewContext(fs.readFileSync(root+'/'+file,'utf8'),ctx);return ctx.window;}
function el(attrs={}){return {attrs:{...attrs},dataset:{},style:{},listeners:{},children:[],className:'',id:'',value:'',classList:{toggle(){}},getAttribute(k){return this.attrs[k]??null},hasAttribute(k){return Object.hasOwn(this.attrs,k)},setAttribute(k,v){this.attrs[k]=String(v)},addEventListener(k,fn){this.listeners[k]=fn},dispatchEvent(){},appendChild(x){this.children.push(x)},querySelector(){return null},querySelectorAll(){return []}}}
const doc={readyState:'loading',addEventListener(){},createElement:()=>el(),createElementNS:()=>el(),body:el()};
const fields=load('components/fields/fields.js',doc).MicroFields;
function field(existing){let f=el(),input=el(existing?{'aria-describedby':existing}:{}),msg=el(); f.className='m-field';f.querySelector=s=>s==='[data-field-msg]'?msg:s.includes('m-field__input')?input:null;return {f,input,msg}}
const a=field('help-existing'),b=field();fields.init({querySelectorAll:()=>[a.f,b.f]});
console.log('FIELD_ID_COLLISION',JSON.stringify({id1:a.msg.id,id2:b.msg.id,duplicate:a.msg.id===b.msg.id,existingDescriptionReplaced:a.input.attrs['aria-describedby']}));
let f=field(),clear=el();f.input.value='kept';f.input.readOnly=true;f.input.focus=()=>{};const orig=f.f.querySelector;f.f.querySelector=s=>s==='.m-field__clear'?clear:orig(s);fields.init({querySelectorAll:()=>[f.f]});clear.listeners.click();console.log('READONLY_CLEAR',JSON.stringify({value:f.input.value}));
let outside=el(),inside=el();doc.activeElement=outside;inside.offsetParent={};inside.focus=()=>doc.activeElement=inside;outside.focus=()=>doc.activeElement=outside;doc.querySelector=()=>null;let layer=el();layer.tagName='DIV';layer.querySelectorAll=()=>[inside];const nav=load('components/navigation/navigation.js',doc).MicroNavigation;nav.openLayer(layer);nav.closeLayer(layer);console.log('MODAL_DEFAULT_RETURN',JSON.stringify({restoredOutside:doc.activeElement===outside,focusedHiddenChild:doc.activeElement===inside}));
let sw=el(),input=el();input.disabled=false;sw.querySelector=()=>input;load('components/selection/selection.js',doc).MicroSelection.setSwitchPending(sw,true);console.log('SWITCH_PENDING',JSON.stringify({disabled:input.disabled,ariaBusy:input.attrs['aria-busy']}));
const data=load('components/data/data.js',doc).MicroData;
function chart(kind,values,attrs={}){let chart=el({'data-chart':kind,...attrs}),plot=el(),items=values.map((v,i)=>el({'data-value':v===null?'':String(v),'data-series':['a','b','c'][i%3],'data-label':'label'+i}));chart.querySelectorAll=()=>items;chart.querySelector=s=>s==='[data-plot]'?plot:null;data.init({querySelectorAll:()=>[chart]});return plot;}
let out=chart('bubbles',[100,0.01]);console.log('BUBBLE_SMALL',JSON.stringify({expectedPx:1.04,actualPx:out.children[0].children[1].children[1].style.width}));
out=chart('line',[4,null,8]);console.log('LINE_MISSING',JSON.stringify(out.children[0].children.filter(e=>e.attrs.points).map(e=>e.attrs.points)));
out=chart('donut',[0,0]);console.log('DONUT_ZERO',JSON.stringify(out.children[0].children.filter(e=>e.attrs['stroke-dasharray']).map(e=>e.attrs['stroke-dasharray'])));
out=chart('donut',[60,50],{'data-total':'100'});console.log('DONUT_OVER_TOTAL',JSON.stringify({segments:out.children[0].children.filter(e=>e.attrs['stroke-dasharray']).map(e=>e.attrs['stroke-dasharray']),sum:110,total:100}));
out=chart('bars',[-5,10]);console.log('BAR_NEGATIVE',JSON.stringify(out.children[0].children.filter(e=>e.children.length).map(g=>g.children.filter(e=>e.attrs.height).map(e=>({height:e.attrs.height,y:e.attrs.y})))));
