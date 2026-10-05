#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — بينات جولة R3 لعيوب مراجعة UX-F02 R2 (F02-R2-01..03).
مطابقة لبنود المراجعة وبينات المراجع (independent/r2/targeted-probes.py):
  F02_REVIEW_ROOT=<جذر شجرة الفحص> F02_REVIEW_OUTPUT=<مجلد المخرجات> \
    python3 reviews/UX-F02/round-r3/probes.py
- failure=true في JSON يعني العيب موجود (أداة قياس عيب، لا أداة قبول).
- على المصدر المعيب (a377a2a): 3/3 عيوب. على المصدر المصلح: 0/3.
- المتصفح اختياري عبر F02_REVIEW_BROWSER (مسار Chromium)؛ وإلا Chromium
  المثبت لدى Playwright.
ليست أدلة قبول UI: قارئ شاشة فعلي/WebKit/أجهزة NOT RUN.
"""
import functools, http.server, threading, json, os, subprocess, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(os.environ['F02_REVIEW_ROOT']).resolve()
OUT = Path(os.environ['F02_REVIEW_OUTPUT']).resolve()
OUT.mkdir(parents=True, exist_ok=True)

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(
    http.server.SimpleHTTPRequestHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'

res = {'source_commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
       'probes': [], 'errors': []}

with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox', '--disable-dev-shm-usage']}
    if os.environ.get('F02_REVIEW_BROWSER'):
        launch['executable_path'] = os.environ['F02_REVIEW_BROWSER']
    b = pw.chromium.launch(**launch)
    res['browser'] = b.version
    p = b.new_page(viewport={'width': 390, 'height': 844})
    p.on('pageerror', lambda e: res['errors'].append(str(e)))

    def load():
        p.goto(base + '/previews/ux-patterns/choice-lifecycle/', wait_until='networkidle')
        p.evaluate('() => document.fonts.ready')

    def op():
        p.click('#f02c-open-picker'); p.wait_for_timeout(300)

    def settle():
        p.evaluate('() => document.getElementById("f02c-sim-settle-latest").click()'); p.wait_for_timeout(100)

    # ---------- probe 1: snapshot-item-mutation (F02-R2-03) ----------
    # تعديل label وvalue لكائنات المصدر بعد بدء الطلبات (مصدر الإنشاء
    # ومصدر setSource) — لا استبدال مصفوفة فقط.
    load()
    snap = p.evaluate('''async () => {
      const src=[{value:'old',label:'قبل القراءة'}];
      const c=F02ChoiceSim.createConnector({items:src});
      const first=c.read({readId:1});
      src[0].label='تعديل بعد بدء الطلب';
      src[0].value='معدل';
      const src2=[{value:'new',label:'المصدر الجديد'}];
      c.setSource(src2);
      const second=c.read({readId:2});
      src2[0].label='تعديل المصدر بعد بدء الطلب';
      src2[0].value='معدل-جديد';
      c.settleLatest(); const r2=await second;
      c.settle(1); const r1=await first;
      return {first:r1,second:r2};
    }''')
    expect_first = {'readId': 1, 'outcome': 'ready', 'items': [{'value': 'old', 'label': 'قبل القراءة'}]}
    expect_second = {'readId': 2, 'outcome': 'ready', 'items': [{'value': 'new', 'label': 'المصدر الجديد'}]}
    res['probes'].append({'id': 'snapshot-item-mutation',
                          'failure': snap['first'] != expect_first or snap['second'] != expect_second,
                          'measured': snap})

    # ---------- probe 2: drop-message-not-visible (F02-R2-01) ----------
    # اختر beta ثم اجعل المصدر alpha فقط؛ افتح وسوّ ready — يجب أن يكون
    # سبب الزوال ظاهرًا للمستخدم داخل الطبقة، لا في قناة مقصوصة 1×1 فقط.
    load(); op(); settle()
    p.click('.m-picker__option[data-value="beta"]'); p.wait_for_timeout(350)
    p.evaluate('() => F02Choice.setSource([{value:"alpha",label:"عينة أ"}])')
    op(); settle()
    drop = p.evaluate('''() => {
      const l=document.getElementById('f02c-picker-layer');
      const live=document.getElementById('f02c-picker-live');
      const note=document.getElementById('f02c-drop-note');
      const noteText=document.getElementById('f02c-drop-note-text');
      const cs=note?getComputedStyle(note):null;
      const r=note?note.getBoundingClientRect():{width:0,height:0};
      const walkers=document.createTreeWalker(l,NodeFilter.SHOW_TEXT);
      const visible=[];
      while(walkers.nextNode()){
        const n=walkers.currentNode,e=n.parentElement;
        if(!n.textContent.trim()||e.closest('[hidden],svg,script,style'))continue;
        let clipped=false,cur=e;
        while(cur&&l.contains(cur)){
          const s=getComputedStyle(cur),rect=cur.getBoundingClientRect();
          if(s.display==='none'||s.visibility==='hidden'||(s.clipPath!=='none'&&rect.width<=1&&rect.height<=1)){clipped=true;break;}
          cur=cur.parentElement;
        }
        if(!clipped)visible.push(n.textContent.trim());
      }
      return {selected:F02Choice.inspect().selected,
              liveText:live.textContent,
              note:{exists:!!note,text:noteText?noteText.textContent:'',
                    hiddenAttr:note?note.hidden:null,display:cs?cs.display:null,
                    w:Math.round(r.width),h:Math.round(r.height),
                    inLayer:note?l.contains(note):false},
              externalNote:document.getElementById('f02c-selection-note').textContent,
              visibleTexts:visible};
    }''')
    # العيب: سبب الزوال غير ظاهر — النص موجود في مصدر مخفي (القناة الحية
    # المقصوصة) لكن بلا عرض فعلي داخل الطبقة.
    note_visible = (drop['note']['exists'] and not drop['note']['hiddenAttr']
                    and drop['note']['display'] != 'none' and drop['note']['w'] > 1
                    and drop['note']['h'] > 1 and drop['note']['inLayer']
                    and 'لم يعد متاح' in drop['note']['text'])
    in_visible_texts = any('لم يعد متاح' in t for t in drop['visibleTexts'])
    dropfail = not (note_visible or in_visible_texts)
    res['probes'].append({'id': 'drop-message-not-visible', 'failure': dropfail, 'measured': drop})
    p.screenshot(path=str(OUT / 'drop-message-not-visible.png'))

    # ---------- probe 3: no-results-after-read (F02-R2-02) ----------
    # بحث مكتوب أثناء القراءة ثم ready: الإعلان يجب أن يصف الظاهر
    # (لا نتائج) لا عدد المصدر («تمت القراءة: 3»).
    load(); op()
    p.fill('#f02c-picker-search', 'zzz'); p.wait_for_timeout(50)
    before = p.evaluate('() => ({live:document.getElementById("f02c-picker-live").textContent,'
                        'row:document.querySelector(".m-picker__state")?.textContent})')
    settle()
    after = p.evaluate('() => ({query:document.getElementById("f02c-picker-search").value,'
                       'live:document.getElementById("f02c-picker-live").textContent,'
                       'row:document.querySelector(".m-picker__state")?.textContent,'
                       'visibleOptions:[...document.querySelectorAll(".m-picker__option")].filter(o=>!o.hidden).length})')
    res['probes'].append({'id': 'no-results-after-read',
                          'failure': 'لا نتائج' in after['row'] and 'لا نتائج' not in after['live'],
                          'measured': {'before': before, 'after': after}})
    p.screenshot(path=str(OUT / 'no-results-after-read.png'))
    b.close()

(OUT / 'probes.json').write_text(json.dumps(res, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(res, ensure_ascii=False, indent=2))
server.shutdown()
sys.exit(0)
