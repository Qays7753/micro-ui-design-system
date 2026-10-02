/* Micro UI repair gates — real Chromium, no mocked DOM. No npm install required
   if Playwright is supplied with --playwright-module and --chromium-path.
   Run from repo root: node tools/repair-regression.cjs
   Evidence is generated only; source SHA/tree and dirty state are recorded.
   Text 200% is a computed-font doubling simulation, not native browser zoom.
   No real device, touch, screen reader, or non-Chromium claim. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const zlib = require('node:zlib');
const {execFileSync} = require('node:child_process');
const arg = key => {const i = process.argv.indexOf(key); return i < 0 ? undefined : process.argv[i+1];};
const {chromium} = require(arg('--playwright-module') || 'playwright');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'reviews/AFTER-DIRECTION/repair');
const shots = path.join(out, 'screenshots');
const results = [], errors = [];
const git = (...a) => execFileSync('git', a, {cwd:root, encoding:'utf8'}).trim();
const source = {sha:git('rev-parse','HEAD'), tree:git('rev-parse','HEAD^{tree}'),
  dirty:git('status','--porcelain'), node:process.version};
function check(id, pass, detail) {
  results.push({id, pass:!!pass, detail});
  console.log(`${pass?'PASS':'FAIL'} ${id}: ${JSON.stringify(detail)}`);
}
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript',
  '.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png'};
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.'+decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root+path.sep)) {res.writeHead(403); return res.end();}
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  if (!fs.existsSync(file)) {res.writeHead(404); return res.end();}
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

// Decode browser RGB/RGBA PNG backgrounds, including all PNG row filters.
function pixels(buffer) {
  let i=8, w, h, channels, chunks=[];
  while (i<buffer.length) {
    const len=buffer.readUInt32BE(i), type=buffer.toString('ascii',i+4,i+8);
    const data=buffer.subarray(i+8,i+8+len);
    if (type==='IHDR') {
      w=data.readUInt32BE(0); h=data.readUInt32BE(4);
      if (data[8]!==8 || ![2,6].includes(data[9]) || data[12]) throw Error('Unsupported PNG');
      channels=data[9]===6?4:3;
    }
    if (type==='IDAT') chunks.push(data);
    i+=len+12;
  }
  const raw=zlib.inflateSync(Buffer.concat(chunks)), stride=w*channels;
  const decoded=Buffer.alloc(stride*h);
  function paeth(a,b,c) {
    const p=a+b-c, da=Math.abs(p-a), db=Math.abs(p-b), dc=Math.abs(p-c);
    return da<=db && da<=dc?a:db<=dc?b:c;
  }
  for (let y=0;y<h;y++) {
    const filter=raw[y*(stride+1)];
    for (let x=0;x<stride;x++) {
      const a=x>=channels?decoded[y*stride+x-channels]:0;
      const b=y?decoded[(y-1)*stride+x]:0;
      const c=y && x>=channels?decoded[(y-1)*stride+x-channels]:0;
      const add=[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter];
      decoded[y*stride+x]=(raw[y*(stride+1)+x+1]+add)&255;
    }
  }
  return {w,h,at:(x,y)=>[...decoded.subarray((y*w+x)*channels,(y*w+x)*channels+3)]};
}
function luminance(rgb) {
  return rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4)
    .reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
}
const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/
  (Math.min(luminance(a),luminance(b))+.05);
async function localContrast(page, selector) {
  const button=page.locator(selector);
  await button.scrollIntoViewIfNeeded();
  const color=await button.evaluate(b=>getComputedStyle(b).color.match(/[\d.]+/g).map(Number));
  const saved=await button.getAttribute('style');
  await button.evaluate(b=>b.style.setProperty('color','transparent','important'));
  const image=pixels(await button.screenshot());
  await button.evaluate((b,s)=>s===null?b.removeAttribute('style'):b.setAttribute('style',s),saved);
  let min=Infinity;
  for (let y=Math.floor(image.h*.25);y<image.h*.75;y++)
    for(let x=Math.floor(image.w*.15);x<image.w*.85;x++)
      min=Math.min(min,contrast(color.slice(0,3),image.at(x,y)));
  return {min,foreground:color,backgroundSample:'actual rendered button, waves/gradient behind it retained'};
}
async function zoomText(page, scope) {
  await page.evaluate(selector=>{
    const nodes=[document.querySelector(selector),...document.querySelectorAll(selector+' *')];
    const sizes=nodes.map(e=>parseFloat(getComputedStyle(e).fontSize));
    nodes.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px');
  },scope);
  await page.waitForTimeout(150);
}
async function shot(page, selector, name) {
  await page.locator(selector).screenshot({path:path.join(shots,name+'.png')});
}
async function load(page, url) {
  await page.goto(url);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(180);
}

async function carouselChecks(page, base) {
  for (const width of [320,360,390,430]) for (const reduced of [false,true]) {
    await page.setViewportSize({width,height:844});
    await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
    await load(page,base+'/previews/after-direction/');
    const host=page.locator('[data-carousel]').first();
    const count=await host.locator('[data-carousel-slide]').count();
    for(let card=0;card<count;card++) {
      await host.evaluate((h,i)=>MicroCarousel.goTo(h,i,{animate:false}),card);
      const button=host.locator('[data-current="true"] [data-card-expand]');
      for (const open of [true,false,true,false,true,false]) {
        await button.click();
        const state=await button.evaluate(b=>{
          const s=b.closest('[data-carousel-slide]'), d=document.getElementById(b.getAttribute('aria-controls'));
          return {aria:b.getAttribute('aria-expanded'),expanded:s.getAttribute('data-expanded'),
            hidden:d.hidden,text:b.textContent.trim(),controls:!!d};
        });
        check(`M1 ${width} reduced=${reduced} card=${card} toggle=${results.length}`,state.controls &&
          state.aria===String(open) && state.expanded===String(open) && state.hidden===!open &&
          state.text.includes(open?'إخفاء':'عرض'),state);
      }
    }
    await host.evaluate(h=>MicroCarousel.goTo(h,0,{animate:false}));
    const inactive=await host.locator('[data-carousel-slide]').evaluateAll(slides=>
      slides.every(s=>s.inert===(s.getAttribute('data-current')!=='true')));
    check(`M2 ${width} reduced=${reduced} inert`,inactive,{inactive});
    for(const key of ['Tab','Shift+Tab']) {
      await host.focus();
      let violations=[];
      for(let i=0;i<42;i++) {
        await page.keyboard.press(key);
        const v=await page.evaluate(()=>{
          const a=document.activeElement, s=a.closest('[data-carousel-slide]');
          if(!s) return null;
          const v=s.closest('[data-carousel]').querySelector('.m-carousel__viewport').getBoundingClientRect();
          const r=a.getBoundingClientRect();
          return s.getAttribute('data-current')!=='true' || r.left<v.left-1 || r.right>v.right+1
            ? {id:a.id,text:a.textContent.trim(),left:r.left,right:r.right,viewport:[v.left,v.right]}:null;
        });
        if(v) violations.push(v);
      }
      check(`M2 ${width} reduced=${reduced} ${key}`,violations.length===0,violations);
    }
    const dots=host.locator('.m-carousel__dot');
    await dots.nth(1).click();
    check(`M2 ${width} dot`,await host.locator('[data-current="true"]').evaluate(s=>s===s.parentElement.children[1]),{});
    await host.focus();
    await page.keyboard.press('ArrowLeft'); // RTL next
    check(`M2 ${width} RTL arrow`,await host.locator('[data-current="true"]').evaluate(s=>s===s.parentElement.children[2]),{});
    if(!reduced) await shot(page,'[data-carousel]',`carousel-focus-${width}`);
  }
}

async function navigationChecks(page, base) {
  for(const nested of [false,true]) for(const reduced of [false,true]) {
    await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
    await load(page,base+'/previews/navigation/');
    await page.evaluate(n=>{
      const root=document.createElement('div'); root.id='repair-nav';
      root.innerHTML='<button id="repair-trigger" class="m-btn m-btn--secondary">فتح الأولى</button>'+
        '<div id="repair-a" class="m-layer m-layer--center" role="dialog" aria-label="الأولى" hidden>'+
        '<button id="repair-a-first" class="m-btn">الأولى</button><button id="repair-b-trigger" class="m-btn">فتح العليا</button></div>'+
        '<div id="repair-wrapper"><div id="repair-b" class="m-layer m-layer--center" role="dialog" aria-label="العليا" hidden>'+
        '<button id="repair-b-first" class="m-btn">العليا</button><button id="repair-b-last" class="m-btn">آخر العليا</button></div></div>';
      document.body.appendChild(root);
      if(n) document.getElementById('repair-a').appendChild(document.getElementById('repair-wrapper'));
      document.getElementById('repair-trigger').focus();
      MicroNavigation.openLayer(document.getElementById('repair-a'),{trigger:document.getElementById('repair-trigger')});
      document.getElementById('repair-b-trigger').focus();
      MicroNavigation.openLayer(document.getElementById('repair-b'),{trigger:document.getElementById('repair-b-trigger')});
    },nested);
    const prefix=`M3 nested=${nested} reduced=${reduced}`;
    check(prefix+' open top',await page.evaluate(()=>document.activeElement.id==='repair-b-first' &&
      !document.activeElement.closest('[inert]')),{});
    await page.locator('#repair-b-last').focus(); await page.keyboard.press('Tab');
    check(prefix+' trap',await page.evaluate(()=>document.activeElement.id==='repair-b-first'),{});
    if(!reduced) await shot(page,'#repair-b',`navigation-${nested?'nested':'separate'}`);
    await page.evaluate(()=>MicroNavigation.closeLayer(document.getElementById('repair-b')));
    await page.waitForTimeout(380);
    check(prefix+' restore first',await page.evaluate(()=>document.activeElement.id==='repair-b-trigger' &&
      !document.getElementById('repair-a').hidden && document.getElementById('repair-b').hidden),{});
    await page.evaluate(()=>MicroNavigation.closeLayer(document.getElementById('repair-a')));
    await page.waitForTimeout(380);
    check(prefix+' restore trigger/scroll',await page.evaluate(()=>document.activeElement.id==='repair-trigger' &&
      document.body.style.overflow!== 'hidden' && !document.getElementById('repair-trigger').closest('[inert]')),{});
  }
}

const fixtures = [
  {id:'medium',v:[7532,3566,3333]},
  {id:'large-small',v:[100000,6000,1200]},
  {id:'tiny',v:[1000000,1],off:true},
  {id:'close',v:[1000,999,998]},
  {id:'single-small',v:[1],max:1000000,off:true},
  {id:'positive-zero',v:[1200,0]},
  {id:'positive-unknown',v:[1200,undefined]},
  {id:'positive-unavailable',v:[1200,'invalid']},
  {id:'positive-negative',v:[1200,-2400]},
  {id:'mixed',v:[1200,0,undefined,'invalid',-2400]},
  {id:'zero-only',v:[0]},
  {id:'unknown-only',v:[undefined]},
  {id:'unavailable-only',v:['invalid']},
  {id:'negative-only',v:[-2400]},
  {id:'empty',v:[]}
];
async function packedChecks(page,base) {
  for(const width of [320,390,430]) for(const zoom of [false,true]) {
    await page.setViewportSize({width,height:844});
    await load(page,base+'/previews/after-direction/');
    await page.evaluate(list=>{
      const panel=document.createElement('section'); panel.className='panel'; panel.id='repair-fixtures';
      for(const f of list) {
        const box=document.createElement('div'); box.className='aft-panel'; box.id='fixture-'+f.id;
        const title=document.createElement('h3'); title.textContent=f.id+' — PROPOSED';
        box.appendChild(title);
        const chart=document.createElement('div');
        chart.className='m-chart m-chart--bubbles m-chart--packed';
        chart.setAttribute('data-chart-packed',''); chart.setAttribute('data-rmax','44');
        chart.style.setProperty('--packed-overlap','28px'); // intentionally unsafe requested cap
        if(f.off) chart.setAttribute('data-legend','off');
        if(f.max) chart.setAttribute('data-max',f.max);
        chart.innerHTML='<ul class="m-chart__data" hidden></ul><div class="m-chart__plot" data-plot></div>';
        f.v.forEach((v,i)=>{
          const li=document.createElement('li'); li.setAttribute('data-series','abcde'[i]);
          li.setAttribute('data-label',['الإيرادات','الربح','التكاليف','غير متاح','سالب'][i]);
          if(v!==undefined && v!==null) li.setAttribute('data-value',String(v));
          if(typeof v==='number') li.setAttribute('data-display',v.toLocaleString('en-US'));
          chart.querySelector('ul').appendChild(li);
        });
        box.appendChild(chart); panel.appendChild(box);
      }
      document.querySelector('main').appendChild(panel); MicroPacked.init(panel);
    },fixtures);
    if(zoom) await zoomText(page,'#repair-fixtures');
    await page.waitForTimeout(200);
    for(const f of fixtures) {
      const measure=await page.locator('#fixture-'+f.id).evaluate(box=>{
        const circles=[...box.querySelectorAll('.m-bubble__circle')], chart=box.querySelector('.m-chart');
        const data=[...chart.querySelectorAll('.m-chart__data li')];
        const values=data.filter(x=>Number(x.getAttribute('data-value'))>0).map(x=>Number(x.getAttribute('data-value'))).sort((a,b)=>b-a);
        const rects=circles.map(c=>c.getBoundingClientRect());
        const widths=circles.map(c=>parseFloat(c.style.width));
        const raw=[...box.querySelectorAll('.m-bubble__value, .m-packed__states .m-legend__value')].map(x=>x.textContent);
        const outside=box.querySelectorAll('[data-value-placement="outside"]').length;
        let covered=0, fit=true, overCap=false;
        circles.forEach((c,i)=>{
          const v=c.querySelector('.m-bubble__value'); if(!v) return;
          const r=v.getBoundingClientRect(), a=rects[i];
          fit=fit && Math.hypot(r.width,r.height)<=a.width+.1;
          rects.forEach((b,j)=>{
            if(j<=i) return;
            const x=Math.max(r.left,Math.min((b.left+b.right)/2,r.right));
            const y=Math.max(r.top,Math.min((b.top+b.bottom)/2,r.bottom));
            if(Math.hypot(x-(b.left+b.right)/2,y-(b.top+b.bottom)/2)<b.width/2-.1) covered++;
          });
        });
        rects.forEach((a,i)=>rects.slice(i+1).forEach(b=>{
          const overlap=(a.width+b.width)/2-Math.hypot((a.left+a.right-b.left-b.right)/2,(a.top+a.bottom-b.top-b.bottom)/2);
          if(overlap>Math.min(a.width,b.width)*.25+.5) overCap=true;
        }));
        const bounds=chart.getBoundingClientRect();
        const overflow=[...box.querySelectorAll('.m-bubble__value,.m-bubble__label,.m-packed__states li')].some(e=>{
          const r=e.getBoundingClientRect(); return r.left<bounds.left-1 || r.right>bounds.right+1;
        });
        const ratio=widths.every((w,i)=>!values.length || Math.abs(w/widths[0]-Math.sqrt(values[i]/values[0]))<.00001);
        return {values,widths,raw,outside,covered,fit,overCap,overflow,ratio,
          circles:circles.length,states:box.querySelectorAll('.m-packed__states li').length,
          rings:box.querySelectorAll('.m-bubble__circle--none').length,
          empty:!!box.querySelector('[data-empty]')};
      });
      const positive=f.v.filter(v=>typeof v==='number'&&v>0).length;
      const expected=f.v.map(v=>v===undefined?'— غير معروف':v==='invalid'?'— غير متاح':
        v===0?'0 — صفر':v<0?v.toLocaleString('en-US')+' — سالب غير صالح للمساحة':v.toLocaleString('en-US'));
      check(`M5/M6 ${f.id} ${width} zoom=${zoom}`,measure.circles===positive &&
        measure.states===f.v.length-positive && measure.empty===(positive===0) &&
        measure.rings===0 && measure.ratio && measure.fit && !measure.covered &&
        !measure.overCap && !measure.overflow && expected.every(v=>measure.raw.includes(v)) &&
        (!['tiny','single-small'].includes(f.id)||measure.outside>=1),measure);
      if(['medium','large-small','tiny','mixed','empty'].includes(f.id) && (!zoom||width===390))
        await shot(page,'#fixture-'+f.id,`packed-${f.id}-${width}${zoom?'-text200':''}`);
    }
  }
}

async function surfaceChecks(page,base) {
  for(const width of [320,390,430]) for(const zoom of [false,true]) {
    await page.setViewportSize({width,height:844});
    await load(page,base+'/previews/after-direction/');
    if(zoom) await zoomText(page,'#aft-comp');
    const light=await page.locator('#light-summary').evaluate(el=>{
      const css=getComputedStyle(el), r=el.getBoundingClientRect();
      const clipped=[...el.querySelectorAll('*')].some(n=>[...n.childNodes].some(t=>{
        if(t.nodeType!==3||!t.textContent.trim()) return false;
        const range=document.createRange(); range.selectNodeContents(t);
        return [...range.getClientRects()].some(b=>b.left<r.left+3||b.right>r.right-3);
      }));
      return {background:css.backgroundImage,color:css.color,clipped,
        animation:getComputedStyle(el.querySelector('svg')).animationName};
    });
    check(`M7 light ${width} zoom=${zoom}`,light.background.includes('184, 217, 220') &&
      light.background.includes('223, 238, 230') && light.background.includes('247, 248, 244') &&
      !light.clipped && light.animation==='none',light);
    await shot(page,'#light-summary',`light-summary-${width}${zoom?'-text200':''}`);
    const selector='#hero-surface .aft-hero__action';
    const button=page.locator(selector);
    for(const state of ['default','hover','focus','disabled']) {
      await button.evaluate(b=>{b.disabled=false;b.blur();}); await page.mouse.move(0,0);
      if(state==='hover') await button.hover();
      if(state==='focus') {await page.keyboard.press('Tab'); await button.focus();}
      if(state==='disabled') await button.evaluate(b=>b.disabled=true);
      await page.waitForTimeout(210);
      const info=await localContrast(page,selector);
      const target=await button.evaluate(b=>{const r=b.getBoundingClientRect();return {w:r.width,h:r.height,
        outline:getComputedStyle(b).outlineWidth};});
      check(`M4 ${state} ${width} zoom=${zoom}`,info.min>=4.5 && target.w>=48 && target.h>=48 &&
        (state!=='focus'||target.outline==='2px'),{...info,...target});
      if(width===390&&!zoom) await shot(page,'#hero-surface',`dark-summary-${state}-390`);
    }
  }
}

(async()=>{
  fs.mkdirSync(shots,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,executablePath:arg('--chromium-path')});
  try {
    source.chromium=browser.version();
    const page=await browser.newPage({viewport:{width:390,height:844}});
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('favicon')) errors.push(m.text());});
    const base='http://127.0.0.1:'+server.address().port;
    await carouselChecks(page,base);
    await navigationChecks(page,base);
    await packedChecks(page,base);
    await surfaceChecks(page,base);
    check('JavaScript/browser errors',errors.length===0,errors);
  } finally {
    await browser.close(); server.close();
    const passed=results.filter(r=>r.pass).length;
    const report={source,passed,total:results.length,results,errors,
      limits:['Chromium headless only','No real touch/device/screen reader',
        '200% is computed text-size simulation, not native zoom','Visual choices remain PROPOSED']};
    fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');
    fs.writeFileSync(path.join(out,'verification.txt'),JSON.stringify(source)+'\n'+
      results.map(r=>`${r.pass?'PASS':'FAIL'} ${r.id}: ${JSON.stringify(r.detail)}`).join('\n')+
      `\nTOTAL ${passed}/${results.length}\n`+report.limits.join('\n')+'\n');
    console.log(`TOTAL ${passed}/${results.length}`);
    if(passed!==results.length) process.exitCode=1;
  }
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});