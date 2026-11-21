#!/usr/bin/env python3
"""Export from the ONE canonical editable SVG. No font, tracing or raster reference required.
Install: python -m pip install cairosvg
Run: python tools/export_brand.py
"""
from pathlib import Path
import copy,json,hashlib
import xml.etree.ElementTree as ET
import cairosvg
ROOT=Path(__file__).resolve().parents[1]
S='http://www.w3.org/2000/svg'; I='http://www.inkscape.org/namespaces/inkscape'
ET.register_namespace('',S);ET.register_namespace('inkscape',I)
source=ROOT/'source/micro-brand-master.svg'
master=ET.parse(source).getroot()
index={e.get('id'):e for e in master.iter() if e.get('id')}
mark=index['micro-symbol']
OUT=ROOT/'exports'
for sub in ['svg','png','pdf']:(OUT/sub).mkdir(parents=True,exist_ok=True)
def node(tag,a={}):return ET.Element('{'+S+'}'+tag,{k:str(v) for k,v in a.items()})
def document(w,h,title):
 r=node('svg',{'version':'1.1','width':w,'height':h,'viewBox':f'0 0 {w} {h}','role':'img','aria-labelledby':'title'});t=node('title',{'id':'title'});t.text=title;r.append(t);return r
def move(child,x,y,scale=1):
 g=node('g',{'transform':f'translate({x} {y}) scale({scale})'});g.append(copy.deepcopy(child));return g
ms=float(master.get('data-symbol-size','256'));gap=float(master.get('data-symbol-word-gap','80'));pad=float(master.get('data-export-padding','40'))
for name in ['symbol','arabic','english']:
 if name=='symbol':
  out=document(224,224,'Micro symbol');out.append(move(mark,16,16))
 else:
  lang='ar' if name=='arabic' else 'en';word=index['wordmark-'+lang];w=float(word.get('data-native-width'));h=float(word.get('data-native-height'));ch=max(h,ms)
  out=document(w+gap+ms+2*pad,ch+2*pad,'مايكرو' if lang=='ar' else 'Micro')
  out.append(move(word,pad if lang=='ar' else pad+ms+gap,pad+(ch-h)/2))
  out.append(move(mark,pad+w+gap if lang=='ar' else pad,pad+(ch-ms)/2,ms/192))
 for variant,color in [('color',None),('mono-petrol','#164D59'),('white','#FFFFFF')]:
  tree=copy.deepcopy(out)
  if color:
   for p in tree.iter('{'+S+'}path'):p.set('fill',color)
  ET.indent(tree,space='  ');data=ET.tostring(tree,encoding='utf-8',xml_declaration=True)
  (OUT/'svg'/f'micro-{name}-{variant}.svg').write_bytes(data)
  cairosvg.svg2png(bytestring=data,write_to=str(OUT/'png'/f'micro-{name}-{variant}.png'),output_width=1024 if name=='symbol' else 2400)
  if variant=='color':cairosvg.svg2pdf(bytestring=data,write_to=str(OUT/'pdf'/f'micro-{name}-color-rgb.pdf'))
cairosvg.svg2png(url=str(source),write_to=str(ROOT/'micro-brand-preview.png'),output_width=2160,background_color='#FAF9F5')
manifest={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(ROOT.rglob('*')) if p.is_file() and p.name!='SHA256.json' and '__pycache__' not in str(p)}
(ROOT/'SHA256.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(f'Exported from one source: 9 SVGs, 9 transparent PNGs and 3 vector RGB PDFs. {len(manifest)} hashes.')
