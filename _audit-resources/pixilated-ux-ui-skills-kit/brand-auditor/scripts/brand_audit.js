/* Brand Auditor rendered checks. Injected by brand_audit.py with window.__BRAND = brand.json.
   Writes JSON into <script id="__brand" type="application/json">. */
(function () {
  const B = window.__BRAND || {};
  const cs = el => getComputedStyle(el);
  const px = v => parseFloat(v) || 0;
  const vis = el => { const r = el.getBoundingClientRect(); const s = cs(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity !== 0; };
  const rgb = c => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: a[0], g: a[1], b: a[2], a: a.length > 3 ? a[3] : 1 }; };
  const hex2 = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }; };
  const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const oklab = c => { const r = lin(c.r), g = lin(c.g), b = lin(c.b);
    const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
    return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s]; };
  const dE = (a, b) => { const x = oklab(a), y = oklab(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  const lum = c => .2126 * lin(c.r) + .7152 * lin(c.g) + .0722 * lin(c.b);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const path = el => { const p = []; while (el && el.nodeType === 1 && p.length < 4) { let s = el.tagName.toLowerCase(); if (el.id) { p.unshift(s + '#' + el.id); break; } if (el.classList && el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.'); p.unshift(s); el = el.parentElement; } return p.join(' > '); };
  const F = []; const seen = new Set();
  const add = (pillar, sev, el, msg) => { const k = pillar + path(el) + msg; if (seen.has(k)) return; seen.add(k); F.push({ pillar, sev, where: path(el), msg }); };

  // palette
  const C = B.colors || {};
  const pal = [];
  ['primary', 'secondary', 'tertiary'].forEach(k => C[k] && pal.push({ name: C[k].name || k, role: k, c: hex2(C[k].hex) }));
  (C.extended || []).forEach(x => pal.push({ name: x.name, role: 'extended', c: hex2(x.hex) }));
  (C.neutrals || []).forEach(x => pal.push({ name: x.hex, role: 'neutral', c: hex2(x.hex) }));
  const sem = Object.entries(C.semantic || {}).map(([k, v]) => ({ name: k, role: 'semantic', c: hex2(v) }));
  const near = (c, list, t) => { let best = null, d = 9; for (const p of list) { const x = dE(c, p.c); if (x < d) { d = x; best = p; } } return d <= t ? { ...best, d } : null; };
  const all = [...document.body.querySelectorAll('*')].filter(el => !['SCRIPT', 'STYLE'].includes(el.tagName) && vis(el));

  // off-palette colours (text, backgrounds, borders); semantic allowed
  const off = {};
  const tol = .06;
  for (const el of all) {
    const s = cs(el);
    const checks = [['color', s.color], ['background', s.backgroundColor], ['border', px(s.borderTopWidth) > 0 ? s.borderTopColor : null]];
    for (const [k, v] of checks) {
      const c = rgb(v); if (!c || c.a < .5) continue;
      if (k === 'color' && !el.childNodes.length) continue;
      if (near(c, pal, tol) || near(c, sem, tol)) continue;
      // allow tints/shades of palette colours (same hue family) as derived ramp steps
      const key = `${c.r},${c.g},${c.b}`;
      (off[key] = off[key] || { c, n: 0, el, k }).n++;
    }
  }
  const offList = Object.values(off).sort((a, b) => b.n - a.n);
  offList.slice(0, 12).forEach(o => add('colour', o.n > 4 ? 'P1' : 'P2', o.el, `off-palette ${o.k} rgb(${o.c.r},${o.c.g},${o.c.b}) used ${o.n}×; map it to a token`));

  // semantic integrity
  const semRe = /(error|fail|declin|invalid|overdue|danger|warning|success|paid|expired)/i;
  for (const el of all) {
    const t = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').trim();
    const flagged = el.matches('[role=alert],[aria-invalid=true],.error,.is-error,.danger,.warning,.success') || (t && semRe.test(t) && t.length < 60);
    if (!flagged) continue;
    const c = rgb(cs(el).color); if (!c) continue;
    const want = /(error|fail|declin|invalid|overdue|danger|expired)/i.test(t + el.className) ? 'error' : /warning/i.test(t + el.className) ? 'warning' : /(success|paid)/i.test(t + el.className) ? 'success' : null;
    if (!want || !C.semantic || !C.semantic[want]) continue;
    const nb = near(c, pal, .05);
    const box = el.closest('li,tr,[role=alert],.alert,[class*=alert],[class*=toast]') || el.parentElement && el.parentElement.parentElement || el.parentElement;
    const carried = box && [...box.querySelectorAll('svg,span,b,i,div')].some(k => { const kc = rgb(cs(k).color); return kc && dE(kc, hex2(C.semantic[want])) <= .08; });
    if (nb && nb.role !== 'neutral' && !carried && dE(c, hex2(C.semantic[want])) > .08) add('colour', 'P0', el, `"${t.slice(0, 40)}" is a ${want} message drawn in brand ${nb.name}; semantic colour must win`);
  }
  // brand colours that look semantic used decoratively
  for (const p of pal.filter(p => p.role !== 'neutral')) for (const s of sem) if (dE(p.c, s.c) < .12) add('colour', 'P1', document.body, `brand ${p.name} is close to semantic ${s.name} (ΔE ${dE(p.c, s.c).toFixed(2)}); keep it off status-like UI`);

  // fonts
  const T = B.type || {};
  const fams = [...new Set([T.display, T.body, T.mono, T.arabic].filter(x => x && x.family).map(x => x.family.toLowerCase()))];
  const used = {};
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && !n.parentElement.closest('script,style') && n.textContent.trim() ? 1 : 2 });
  let n; const sizes = {}; const offFont = {};
  while ((n = tw.nextNode())) {
    const el = n.parentElement; if (!vis(el)) continue;
    const s = cs(el); const first = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    used[first] = (used[first] || 0) + 1; sizes[Math.round(px(s.fontSize))] = 1;
    if (fams.length && !fams.includes(first.toLowerCase()) && !/^(system-ui|-apple-system|ui-monospace|monospace|sans-serif|serif)$/i.test(first)) (offFont[first] = offFont[first] || []).push(el);
  }
  for (const f in offFont) add('type', 'P1', offFont[f][0], `${offFont[f].length} text nodes in "${f}", not a brand face (${[...new Set(fams)].join(', ')})`);
  const loaded = {};
  const faces = [...document.fonts];
  for (const f of fams) { const fs = faces.filter(x => x.family.replace(/["']/g, '').toLowerCase() === f); loaded[f] = fs.some(x => x.status === 'loaded') ? true : (fs.length ? 'declared, not used' : false); if (loaded[f] === false) add('type', 'P0', document.body, `brand font "${f}" is not loaded on this page: text falls back`); }
  if (T.scale && T.scale.length) { const off = Object.keys(sizes).map(Number).filter(x => !T.scale.includes(x)); if (off.length) add('type', 'P2', document.body, `font sizes off the brand scale: ${off.join(', ')}`); }

  // icons
  const I = B.icons || {};
  const icons = [...document.querySelectorAll('svg')].filter(s => vis(s) && !s.closest('[data-brand-mark],[data-brand-chart],.logo,.brand,.mark') && s.getBoundingClientRect().width <= 40 && s.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse').length <= 12);
  const stats = { widths: {}, caps: {}, joins: {}, filled: 0, outline: 0, hard: 0, sizes: {} };
  for (const s of icons) {
    const shapes = [...s.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse')];
    const sc = shapes.map(e => cs(e));
    const w = sc.map(x => px(x.strokeWidth)).filter(Boolean); w.forEach(x => stats.widths[x] = (stats.widths[x] || 0) + 1);
    sc.forEach(x => { if (x.stroke !== 'none') { stats.caps[x.strokeLinecap] = (stats.caps[x.strokeLinecap] || 0) + 1; stats.joins[x.strokeLinejoin] = (stats.joins[x.strokeLinejoin] || 0) + 1; } });
    const filled = sc.some((x, i) => x.fill !== 'none' && rgb(x.fill) && !(shapes[i].tagName === 'circle' && px(shapes[i].getAttribute('r')) <= 2));
    filled ? stats.filled++ : stats.outline++;
    const hard = [s, ...shapes].some(e => { const st = e.getAttribute('stroke'), fl = e.getAttribute('fill'); return (st && /^#|rgb/.test(st)) || (fl && /^#|rgb/.test(fl)); });
    if (hard) { stats.hard++; add('icons', 'P2', s, 'icon colour hard-coded (use currentColor)'); }
    const sz = Math.round(s.getBoundingClientRect().width); stats.sizes[sz] = (stats.sizes[sz] || 0) + 1;
    if (I.stroke && w.length && w.some(x => Math.abs(x - I.stroke) > .26)) add('icons', 'P1', s, `stroke ${[...new Set(w)].join('/')} px, brand spec ${I.stroke}`);
  }
  if (Object.keys(stats.widths).length > 1) add('icons', 'P1', document.body, `mixed icon stroke widths: ${Object.keys(stats.widths).join(', ')}`);
  if (Object.keys(stats.caps).length > 1) add('icons', 'P1', document.body, `mixed icon linecaps: ${Object.keys(stats.caps).join(', ')}`);
  if (stats.filled && stats.outline && I.style === 'outline') add('icons', 'P1', document.body, `${stats.filled} filled icons in an outline set`);
  if (I.sizes) { const offs = Object.keys(stats.sizes).map(Number).filter(x => !I.sizes.includes(x)); if (offs.length) add('icons', 'P2', document.body, `icon sizes off the spec: ${offs.join(', ')}`); }
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{2712}\u{2718}-\u{27BF}]/u.test(document.body.innerText)) add('icons', 'P0', document.body, 'emoji used as icons');

  // contrast of brand-coloured text
  for (const el of all) {
    if (![...el.childNodes].some(x => x.nodeType === 3 && x.textContent.trim())) continue;
    const c = rgb(cs(el).color); if (!c) continue; const nb = near(c, pal, .05); if (!nb || nb.role === 'neutral') continue;
    let p = el, bg = null; while (p) { const b = rgb(cs(p).backgroundColor); if (b && b.a > .5) { bg = b; break; } p = p.parentElement; } bg = bg || { r: 255, g: 255, b: 255 };
    const cr = ratio(c, bg); const large = px(cs(el).fontSize) >= 24 || (px(cs(el).fontSize) >= 18.7 && +cs(el).fontWeight >= 700);
    if (cr < (large ? 3 : 4.5)) add('colour', 'P0', el, `${nb.name} text at ${cr.toFixed(2)}:1 (needs ${large ? 3 : 4.5}); use a text-safe step`);
  }

  // regions to exclude from proportion maths
  const excl = [...document.querySelectorAll('img,video,canvas,[data-brand-chart],svg[role=img]')].filter(vis).map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.left + scrollX), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)]; });
  const res = { url: location.href, viewport: [innerWidth, innerHeight], fontsUsed: used, fontsLoaded: loaded, icons: { count: icons.length, ...stats }, exclude: excl, findings: F,
    offPalette: offList.slice(0, 20).map(o => ({ rgb: [o.c.r, o.c.g, o.c.b], n: o.n, prop: o.k })) };
  const t = document.createElement('script'); t.type = 'application/json'; t.id = '__brand'; t.textContent = JSON.stringify(res); document.body.appendChild(t);
  if (parent !== window) parent.postMessage({ brand: t.textContent }, '*');
})();
