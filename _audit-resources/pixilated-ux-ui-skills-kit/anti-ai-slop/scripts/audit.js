/* Anti-AI-Slop rendered audit. Injected into a copy of the page by slop_render.py.
   Writes JSON into <script id="__slop" type="application/json"> and, with ?__slop_annotate,
   draws numbered outlines over every finding. IDs match references/catalogue.md. */
(function () {
  const ANN = /__slop_annotate/.test(location.search) || window.__SLOP_ANNOTATE;
  const F = [];
  const seen = new Set();
  const cs = el => getComputedStyle(el);
  const px = v => parseFloat(v) || 0;
  const visible = el => { const r = el.getBoundingClientRect(); const s = cs(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity !== 0; };
  const path = el => { const p = []; while (el && el.nodeType === 1 && p.length < 4) { let s = el.tagName.toLowerCase(); if (el.id) { s += '#' + el.id; p.unshift(s); break; } if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.'); p.unshift(s); el = el.parentElement; } return p.join(' > '); };
  const add = (id, sev, el, msg) => { const k = id + '|' + path(el) + '|' + msg; if (seen.has(k)) return; seen.add(k); const r = el.getBoundingClientRect(); F.push({ id, sev, where: path(el), msg, box: [Math.round(r.left + scrollX), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)], el }); };
  const rgb = c => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: a[0], g: a[1], b: a[2], a: a.length > 3 ? a[3] : 1 }; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const bgOf = el => { while (el) { const c = rgb(cs(el).backgroundColor); if (c && c.a > .5) return c; el = el.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const INTERACTIVE = 'a[href],button,input,select,textarea,summary,label,[role=button],[role=tab],[role=checkbox],[role=radio],[role=option],[tabindex]:not([tabindex="-1"]),[onclick]';
  const isInteractive = el => el.matches(INTERACTIVE) || cs(el).cursor === 'pointer';
  const all = [...document.body.querySelectorAll('*')].filter(el => !el.closest('#__slop_overlay') && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE');
  const ringRe = /(^|,)\s*(rgba?\([^)]*\)|#[0-9a-f]+)?\s*0px 0px 0px [0-9.]+px/i;
  const hasStroke = s => ['Top', 'Right', 'Bottom', 'Left'].every(k => px(s['border' + k + 'Width']) >= 1 && s['border' + k + 'Style'] !== 'none') || ringRe.test(s.boxShadow);

  // ---------- per element ----------
  for (const el of all) {
    if (!visible(el)) continue;
    const s = cs(el), r = el.getBoundingClientRect();
    const rad = px(s.borderTopLeftRadius) + px(s.borderBottomLeftRadius) + px(s.borderTopRightRadius);
    // O1 stripe via borders
    const bw = { t: px(s.borderTopWidth), r: px(s.borderRightWidth), b: px(s.borderBottomWidth), l: px(s.borderLeftWidth) };
    for (const side of ['l', 't']) {
      const others = Object.entries(bw).filter(([k]) => k !== side).map(([, v]) => v);
      const c = rgb(side === 'l' ? s.borderLeftColor : s.borderTopColor);
      const sat = c ? Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) : 0;
      if (bw[side] >= 2 && bw[side] > Math.max(...others) && r.height > 30 && r.width > 80 && sat > 40) add('O1', 'P0', el, 'accent stripe border on the ' + (side === 'l' ? 'left' : 'top') + ' edge');
    }
    // O1 stripe via pseudo
    for (const pe of ['::before', '::after']) {
      const p = getComputedStyle(el, pe);
      if (p.content === 'none' || p.position !== 'absolute') continue;
      const w = px(p.width), h = px(p.height), c = rgb(p.backgroundColor);
      const sat = c ? Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) : 0;
      if (c && c.a > .3 && sat > 40 && ((w >= 2 && w <= 6 && h > r.height * .45 && r.height > 30) || (h >= 2 && h <= 6 && w > r.width * .6 && r.width > 80))) add('O1', 'P0', el, 'accent stripe drawn with ' + pe);
    }
    // O2 stroke on a non-interactive block
    const isBlock = r.width >= 120 && r.height >= 48 && (px(s.paddingTop) + px(s.paddingLeft) >= 16 || el.children.length >= 2);
    if (isBlock && hasStroke(s) && !isInteractive(el) && !el.matches('input,textarea,select,table,thead,tbody,tr,td,th,fieldset,dialog,[role=dialog],aside[aria-label],nav')) {
      add('O2', 'P0', el, 'stroke on a non-interactive block (stroke = state): use a fill step or space');
    }
    // O5 icon tile
    const icon = el.querySelector(':scope > svg, :scope > img, :scope > i, :scope > span > svg');
    const brand = /logo|brand|mark|avatar|av\b|app-icon/i.test((el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) + ' ' + (el.parentElement ? el.parentElement.className : ''));
    if (icon && !brand && el.children.length <= 2 && !el.textContent.trim() && r.width <= 72 && r.height <= 72 && Math.abs(r.width - r.height) <= 8 && r.width >= 20) {
      const ir = icon.getBoundingClientRect(); const bg = rgb(s.backgroundColor); const pbg = bgOf(el.parentElement);
      if (bg && bg.a > .2 && ir.width <= 32 && ir.width < r.width - 6 && Math.abs(lum(bg) - lum(pbg)) > .005 && !isInteractive(el)) add('O5', 'P0', el, 'icon sitting in a tinted background tile');
    }
    // O6 dot inside a chip / status label
    const isChipLike = r.height <= 36 && r.height >= 14 && r.width <= 260 && el.textContent.trim().length > 1 && el.textContent.trim().length < 40 && !el.closest('[class*=legend],[data-brand-chart],svg');
    if (isChipLike) {
      const dotPe = ['::before', '::after'].some(pe => { const p = getComputedStyle(el, pe); if (p.content === 'none') return false; const w = px(p.width), h = px(p.height); const c = rgb(p.backgroundColor); const rr = px(p.borderTopLeftRadius); const ring = /inset/.test(p.boxShadow); return w >= 3 && w <= 12 && Math.abs(w - h) <= 1 && rr >= w / 2 - .5 && ((c && c.a > .3) || ring || px(p.borderTopWidth) > 0); });
      const dotKid = [...el.children].some(k => { const kr = k.getBoundingClientRect(); const ks = cs(k); return kr.width >= 3 && kr.width <= 12 && Math.abs(kr.width - kr.height) <= 1 && px(ks.borderTopLeftRadius) >= kr.width / 2 - .5 && !k.querySelector('svg') && k.tagName !== 'svg' && (rgb(ks.backgroundColor) || {}).a > .3; });
      const dotChar = /^\s*[\u25cf\u2022\u26ab\u26aa\u25cb]\s*\S/.test(el.textContent);
      if (dotPe || dotKid || dotChar) add('O6', 'P0', el, 'dot inside a chip/status label');
    }
    // V5 gradient text
    if ((s.backgroundClip === 'text' || s.webkitBackgroundClip === 'text') && /gradient/.test(s.backgroundImage)) add('V5', 'P0', el, 'gradient text');
    // K1 purple gradient
    if (/gradient/.test(s.backgroundImage)) {
      const cols = [...s.backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map(m => m[1].split(/[ ,/]+/).map(Number));
      const purple = cols.some(([R, G, B]) => B > 150 && R > 80 && G < R && G < 140 && B > G + 60);
      if (purple && r.width > 100) add('K1', 'P0', el, 'purple/indigo gradient');
    }
    // V4 glass on static element
    if (/blur/.test(s.backdropFilter || s.webkitBackdropFilter || '') && !['fixed', 'sticky'].includes(s.position) && !el.matches('[role=dialog],[role=menu],dialog')) add('V4', 'P1', el, 'glass blur on a static element (keep it for overlays)');
    // T3 uppercase tracked label
    if (s.textTransform === 'uppercase' && px(s.letterSpacing) / px(s.fontSize) >= .04 && px(s.fontSize) <= 15 && el.textContent.trim().length > 2 && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) add('T3', 'P1', el, 'uppercase letter-spaced label');
    // V1 nested cards
    const card = e => { const t = cs(e); return (hasStroke(t) || /\d+px \d+px [1-9]/.test(t.boxShadow)) && px(t.borderTopLeftRadius) >= 8 && e.getBoundingClientRect().width > 120; };
    if (card(el) && !isInteractive(el) && el.parentElement) { let p = el.parentElement; let d = 0; while (p && d < 4) { if (card(p)) { add('V1', 'P1', el, 'card nested inside a card'); break; } p = p.parentElement; d++; } }
  }

  // ---------- O4 buttons ----------
  const btns = [...document.querySelectorAll('button, a[class*=btn], a[class*=button], [role=button], input[type=submit], input[type=button]')].filter(visible).filter(b => !b.closest('#__slop_overlay'));
  const heights = {};
  for (const b of btns) {
    const s = cs(b), r = b.getBoundingClientRect();
    const visW = (() => { let w = 0; const tw = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { if (!n.textContent.trim()) continue; const pr = n.parentElement.getBoundingClientRect(); const ps = cs(n.parentElement); if (pr.width <= 2 || pr.height <= 2 || ps.clip !== 'auto' && ps.position === 'absolute' || +ps.opacity === 0) continue; const rg = document.createRange(); rg.selectNodeContents(n); w += rg.getBoundingClientRect().width; } return w; })();
    const txt = visW >= 4 ? b.textContent.trim() : '';
    const iconOnly = !txt && b.querySelector('svg,img,i');
    if (iconOnly) { if (Math.abs(r.width - r.height) > 4 && r.width < 64) add('O4', 'P0', b, `icon-only button not square (${Math.round(r.width)}×${Math.round(r.height)})`); if (!b.getAttribute('aria-label') && !b.getAttribute('title')) add('B3', 'P1', b, 'icon-only button without a name'); continue; }
    if (!txt || r.height < 16 || r.width < 24) continue;
    const pr = b.parentElement ? b.parentElement.getBoundingClientRect() : r;
    const rowLike = r.width >= pr.width * .9 && r.width > 220 && s.justifyContent !== 'center' && s.textAlign !== 'center';
    if (rowLike) continue; // full-width list rows are not buttons in the padding sense
    if (s.backgroundColor === 'rgba(0, 0, 0, 0)' && !hasStroke(s) && px(s.paddingLeft) < 4) continue; // text link styled as button-less
    const range = document.createRange(); range.selectNodeContents(b); const tr = range.getBoundingClientRect();
    const sideL = tr.left - r.left, sideR = r.right - tr.right, sideT = tr.top - r.top, sideB = r.bottom - tr.bottom;
    const padX = Math.min(sideL, sideR), padY = Math.min(sideT, sideB);
    const rt = padY > 0 ? padX / padY : 99;
    const bits = [];
    if (padX < 10) bits.push(`label only ${Math.round(padX)}px from the edge`);
    if (padY > 0 && (rt < 1.3 || rt > 4.5) && r.width < 400) bits.push(`padding ratio ${rt.toFixed(1)} (x ${Math.round(padX)} / y ${Math.round(padY)})`);
    if (Math.abs(sideL - sideR) > 6 && !b.querySelector('svg')) bits.push('label off-centre');
    if (bits.length) add('O4', 'P0', b, 'button padding: ' + bits.join(', '));
    const key = Math.round(px(s.fontSize)) + '|' + (s.backgroundColor !== 'rgba(0, 0, 0, 0)' ? 'filled' : 'plain');
    (heights[key] = heights[key] || []).push([Math.round(r.height), b]);
    if (innerWidth <= 480 && r.height < 44 && r.width < 44 * 3) add('O4', 'P0', b, `touch target ${Math.round(r.height)}px tall (< 44px on mobile)`);
  }
  for (const k in heights) { const hs = [...new Set(heights[k].map(x => x[0]))]; if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 4) add('O4', 'P0', heights[k][0][1], `mixed heights for one button size: ${hs.join(' / ')}px`); }
  // B1 filled primaries per section
  for (const sec of document.querySelectorAll('section, header, form, aside, [class*=card], [class*=panel]')) {
    const filled = [...sec.querySelectorAll('button, a[class*=btn]')].filter(visible).filter(b => { const c = rgb(cs(b).backgroundColor); return c && c.a > .8 && (Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) > 40 || lum(c) < .05); });
    if (filled.length > 1 && !sec.querySelector('section')) add('B1', 'P1', sec, `${filled.length} filled primary buttons in one section`);
  }

  // ---------- text ----------
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && !n.parentElement.closest('script,style,svg,code,pre,#__slop_overlay') && n.textContent.trim() ? 1 : 2 });
  const sizes = new Set(), weights = new Set();
  let n; const lowc = [];
  while ((n = walker.nextNode())) {
    const el = n.parentElement; if (!visible(el)) continue;
    const t = n.textContent; const s = cs(el);
    sizes.add(Math.round(px(s.fontSize))); weights.add(s.fontWeight);
    if (/[—–]|\s-\s/.test(t)) add('O3', 'P0', el, `dash in visible text: "${t.trim().slice(0, 60)}"`);
    if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{2712}\u{2718}-\u{27BF}]/u.test(t)) add('I1', 'P0', el, 'emoji in UI text');
    if (/!(\s|$)/.test(t) && t.trim().length > 3) add('C6', 'P2', el, 'exclamation mark');
    if (/→\s*$/.test(t) && el.closest('a,button')) add('C7', 'P2', el, 'arrow appended to a link/button');
    if ((t.match(/·/g) || []).length >= 3) add('C8', 'P2', el, '3+ middle dots in one string');
    if (/welcome back/i.test(t)) add('D5', 'P1', el, '"Welcome back" greeting');
    const fg = rgb(s.color); if (fg) { const bg = bgOf(el); const cr = ratio(fg, bg); const large = px(s.fontSize) >= 24 || (px(s.fontSize) >= 18.66 && +s.fontWeight >= 700); if (cr < (large ? 3 : 4.5) && fg.a > .5) lowc.push([el, cr]); }
  }
  for (const [el, cr] of lowc.slice(0, 12)) add('K4', 'P0', el, `text contrast ${cr.toFixed(2)}:1`);
  if (sizes.size > 7) add('T5', 'P2', document.body, `${sizes.size} font sizes (${[...sizes].sort((a, b) => a - b).join(', ')})`);
  if (weights.size > 3) add('T5', 'P2', document.body, `${weights.size} font weights (${[...weights].join(', ')})`);
  const fam = cs(document.body).fontFamily.split(',')[0].replace(/["']/g, '').trim();
  if (/^(Inter|Geist|Space Grotesk|Instrument Serif|Fraunces|DM Sans|Poppins|Plus Jakarta Sans)$/i.test(fam)) add('T1', 'P2', document.body, `body font ${fam} (fine if it is the brand font)`);
  // V2 repeated shadows
  const sh = {}; for (const el of all) { const b = cs(el).boxShadow; if (b && b !== 'none' && visible(el)) (sh[b] = sh[b] || []).push(el); }
  for (const b in sh) if (sh[b].length >= 8) add('V2', 'P2', sh[b][0], `${sh[b].length} elements share one box-shadow`);
  // D3 all statuses coloured / L4 identical KPI cards
  const groups = {}; for (const el of all) { if (!visible(el) || el.children.length < 2) continue; const r = el.getBoundingClientRect(); if (r.width < 140 || r.height < 70) continue; const s = cs(el); if (!(hasStroke(s) || /\d+px \d+px [1-9]/.test(s.boxShadow))) continue; const k = el.parentElement ? path(el.parentElement) : ''; (groups[k] = groups[k] || []).push(el); }
  for (const k in groups) { const g = groups[k]; if (g.length >= 3) { const w = g.map(e => Math.round(e.getBoundingClientRect().width)); const h = g.map(e => Math.round(e.getBoundingClientRect().height)); if (Math.max(...w) - Math.min(...w) < 6 && Math.max(...h) - Math.min(...h) < 6 && g.every(e => e.querySelector('svg,img'))) add('L2', 'P1', g[0].parentElement, `${g.length} identical icon cards in a row (KPI/feature-card pattern)`); } }

  const out = F.map(({ el, ...x }) => x);
  const counts = { P0: 0, P1: 0, P2: 0 }; out.forEach(f => counts[f.sev]++);
  const res = { url: location.href, viewport: [innerWidth, innerHeight], docHeight: Math.ceil(document.documentElement.scrollHeight), counts, findings: out };
  const tag = document.createElement('script'); tag.type = 'application/json'; tag.id = '__slop'; tag.textContent = JSON.stringify(res); document.body.appendChild(tag);

  if (ANN) {
    const ov = document.createElement('div'); ov.id = '__slop_overlay';
    ov.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;z-index:2147483647';
    const col = { P0: '#e5484d', P1: '#f59e0b', P2: '#3b82f6' };
    F.forEach((f, i) => {
      if (f.el === document.body) return;
      const [x, y, w, h] = f.box; const d = document.createElement('div');
      d.style.cssText = `position:absolute;left:${x - 2}px;top:${y - 2}px;width:${w + 4}px;height:${h + 4}px;outline:2px solid ${col[f.sev]};border-radius:4px;background:${col[f.sev]}10`;
      const b = document.createElement('span'); b.textContent = (i + 1) + ' ' + f.id;
      b.style.cssText = `position:absolute;left:-2px;top:-20px;font:700 11px/16px system-ui;color:#fff;background:${col[f.sev]};padding:1px 5px;border-radius:4px;white-space:nowrap`;
      d.appendChild(b); ov.appendChild(d);
    });
    document.body.appendChild(ov);
  }
})();
