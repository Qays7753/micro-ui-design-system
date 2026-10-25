#!/usr/bin/env python3
"""Focused Chromium regression for measured Micro line-label repair.

The browser fixture is generated in memory. Reports and screenshots, when
requested, are written outside the source tree.
"""
import argparse
import datetime as dt
import http.server
import json
import tempfile
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options


ROOT = Path(__file__).resolve().parent.parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path == "/chart-repair-fixture.html":
            html = """<!doctype html><html lang="ar" dir="rtl"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="data:,">
<link rel="stylesheet" href="/assets/fonts/fonts.css">
<link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/shared/motion.css">
<link rel="stylesheet" href="/components/data/data.css">
<link rel="stylesheet" href="/components/data/packed-circle.css">
<style>html,body{margin:0;width:100%;min-width:0}#host{width:100%;min-width:0}
.m-chart{width:100%;min-width:0}.m-chart__plot{width:100%;min-width:0}</style></head>
<body><div id="host"></div>
<script src="/components/data/data.js"></script>
<script src="/components/data/packed-circle.js"></script>
<script>
window.makeLine = function(config) {
  var host = document.getElementById('host');
  host.textContent = '';
  var chart = document.createElement('section');
  chart.id = 'fixture-chart';
  chart.className = 'm-chart m-chart--line';
  chart.setAttribute('data-chart', 'line');
  chart.setAttribute('data-max', '100');
  chart.setAttribute('data-axis-dir', config.dir || 'rtl');
  if (config.axisType) chart.setAttribute('data-axis-type', config.axisType);
  chart.innerHTML = '<h2 class="m-chart__title">قراءات الاختبار</h2><ul class="m-chart__data" hidden></ul><div class="m-chart__plot" data-plot></div><p data-summary></p>';
  config.items.forEach(function(item, i) {
    var li = document.createElement('li');
    li.setAttribute('data-series', 'a');
    li.setAttribute('data-label', item.label);
    if (item.full) li.setAttribute('data-label-full', item.full);
    if (item.value !== undefined) li.setAttribute('data-value', String(item.value));
    if (item.x !== undefined) li.setAttribute('data-x', String(item.x));
    if (item.boundary) li.setAttribute('data-axis-boundary', '');
    if (item.display) li.setAttribute('data-display', item.display);
    chart.querySelector('.m-chart__data').appendChild(li);
  });
  host.appendChild(chart);
  window.MicroData.render(chart);
  return chart.id;
};
window.makePacked = function() {
  var host = document.getElementById('host');
  host.textContent = '';
  var chart = document.createElement('section');
  chart.id = 'fixture-chart';
  chart.className = 'm-chart m-chart--bubbles m-chart--packed';
  chart.setAttribute('data-chart-packed', '');
  chart.setAttribute('data-max', '100');
  chart.innerHTML = '<ul class="m-chart__data" hidden></ul><div data-plot></div>';
  for (var i = 0; i < 6; i++) {
    var li = document.createElement('li');
    li.setAttribute('data-series', 'abcde'[i % 5]);
    li.setAttribute('data-label', 'فئة ' + (i + 1));
    li.setAttribute('data-value', String(20 + i));
    chart.querySelector('.m-chart__data').appendChild(li);
  }
  host.appendChild(chart);
  window.MicroPacked.render(chart);
  return chart.id;
};
window.makePackedStates = function() {
  var host = document.getElementById('host');
  host.textContent = '';
  var chart = document.createElement('section');
  chart.id = 'fixture-chart';
  chart.className = 'm-chart m-chart--bubbles m-chart--packed';
  chart.setAttribute('data-chart-packed', '');
  chart.setAttribute('data-max', '100');
  chart.innerHTML = '<ul class="m-chart__data" hidden></ul><div data-plot></div>';
  for (var i = 0; i < 5; i++) {
    var positive = document.createElement('li');
    positive.setAttribute('data-series', 'abcde'[i]);
    positive.setAttribute('data-label', 'موجب ' + (i + 1));
    positive.setAttribute('data-value', String(20 + i));
    chart.querySelector('.m-chart__data').appendChild(positive);
  }
  [
    {label:'صفر', value:'0'}, {label:'سالب', value:'-3'},
    {label:'مجهول'}, {label:'غير متاح', value:'bad'}
  ].forEach(function(item, i) {
    var li = document.createElement('li');
    li.setAttribute('data-series', 'abcde'[i]);
    li.setAttribute('data-label', item.label);
    if (item.value !== undefined) li.setAttribute('data-value', item.value);
    chart.querySelector('.m-chart__data').appendChild(li);
  });
  host.appendChild(chart);
  window.MicroPacked.render(chart);
  return chart.id;
};
</script></body></html>"""
            body = html.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()


def fixture_items(count, kind):
    rows = []
    elapsed = 0
    for i in range(count):
        if kind == "time":
            elapsed += [1, 2, 6, 1, 13, 4, 22][i % 7]
            x = (dt.datetime(2024, 1, 1, tzinfo=dt.timezone.utc)
                 + dt.timedelta(days=elapsed)).isoformat().replace("+00:00", "Z")
            label = (dt.datetime.fromisoformat(x.replace("Z", "+00:00"))
                     .strftime("%d/%m"))
        else:
            x = None
            label = f"ن{i + 1}"
        if kind == "long" and i % 3 == 1:
            label = f"فترة التحصيل المالي الممتدة {i + 1}"
        row = {"label": label, "full": f"{label} — الاسم الكامل {i + 1}"}
        if x is not None:
            row["x"] = x
        if i == 0:
            row["value"] = "0"
        elif i == 1:
            row["value"] = "-3"
        elif i == 2:
            pass  # absent data-value: unknown/unavailable
        elif i == 3:
            row["value"] = "غير رقمي"
        else:
            row["value"] = str(i * 3)
        if i == count // 2 and count > 2:
            row["boundary"] = True
        if i == 4:
            row["display"] = "١٢"
        rows.append(row)
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, help="temporary report directory")
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-complete-chart-repair-"))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    results = []

    def check(name, passed, detail=None):
        results.append({"name": name, "passed": bool(passed), "detail": detail})
        print(("PASS " if passed else "FAIL ") + name)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            page = browser.new_page(viewport={"width": 320, "height": 1000})
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(f"http://127.0.0.1:{server.server_port}/chart-repair-fixture.html",
                      wait_until="load")
            page.evaluate("document.fonts.ready")
            font_ready = page.evaluate("""async () => {
              const arabic=await document.fonts.load('13px "IBM Plex Sans Arabic"', 'تسميات عربية');
              const latin=await document.fonts.load('13px "IBM Plex Sans"', '2025-01-31');
              await document.fonts.ready;
              return {status:document.fonts.status,arabic:arabic.length>0,latin:latin.length>0,
                faces:[...document.fonts].map(face=>({family:face.family,status:face.status}))};
            }""")
            check("local IBM Plex fonts ready", font_ready["status"] == "loaded"
                  and font_ready["arabic"] and font_ready["latin"], font_ready)

            for width in (320, 390):
                page.set_viewport_size({"width": width, "height": 1200})
                for count in (3, 7, 14, 30):
                    for kind in ("short", "long", "time"):
                        items = fixture_items(count, kind)
                        config = {"items": items, "axisType": "time" if kind == "time" else "category"}
                        chart = page.evaluate("(cfg) => window.makeLine(cfg)", config)
                        page.evaluate("document.fonts.ready")
                        page.evaluate("(id) => window.MicroData.render(document.getElementById(id))", chart)
                        page.wait_for_timeout(20)
                        prefix = f"{width}px/{count}/{kind}"
                        geometry = page.evaluate("""id => {
                          const chart=document.getElementById(id);
                          const svg = chart.querySelector('[data-plot] svg');
                          const labels = [...svg.querySelectorAll('.m-chart__x-label')]
                            .filter(node => getComputedStyle(node).display !== 'none');
                          const rects = labels.map(node => {
                            const r = node.getBoundingClientRect();
                            return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,
                              text:node.textContent,index:Number(node.parentElement.getAttribute('data-point-index'))};
                          });
                          const circles = [...svg.querySelectorAll('g[data-point-index] circle')]
                            .map(node => ({index:Number(node.parentElement.getAttribute('data-point-index')),
                                           x:Number(node.getAttribute('cx'))}));
                          const pointXs = [...svg.querySelectorAll('g[data-point-index]')].map(group => {
                            // Endpoint category text may move inward to fit.
                            // Measure the data point, not its presentation label.
                            const point=group.querySelector('circle');
                            const marker=group.querySelector('rect.m-chart__bar-unknown');
                            const value=group.querySelector('.m-chart__point-value');
                            if (!point && !marker && !value) throw new Error('Missing point coordinate');
                            return {index:Number(group.getAttribute('data-point-index')),
                                    x:point ? Number(point.getAttribute('cx'))
                                      : marker ? Number(marker.getAttribute('x')) + Number(marker.getAttribute('width')) / 2
                                      : Number(value.getAttribute('x'))};
                          });
                          const plotBox=svg.getBoundingClientRect();
                          const labelsBounded=rects.every(r => r.left >= plotBox.left + 7.5
                            && r.right <= plotBox.right - 7.5);
                          const rows = [...chart.querySelectorAll('.m-chart__readings dt')]
                            .map(node => node.textContent);
                          const source = [...chart.querySelectorAll('.m-chart__data [data-series]')]
                            .map(node => ({label:node.getAttribute('data-label'),
                              full:node.getAttribute('data-label-full') || node.getAttribute('data-label'),
                              value:node.hasAttribute('data-value') ? node.getAttribute('data-value') : null}));
                          return {viewBoxWidth:Number(svg.viewBox.baseVal.width),rects,circles,pointXs,labelsBounded,rows,source,
                            groups:svg.querySelectorAll('g[data-point-index]').length,
                            readings:chart.querySelectorAll('.m-chart__readings dt').length};
                        }""", chart)
                        check(prefix + " all source points and values unchanged",
                              geometry["groups"] == count and len(geometry["source"]) == count
                              and [entry["value"] for entry in geometry["source"]]
                              == [entry.get("value") for entry in items],
                              {"groups": geometry["groups"], "source": geometry["source"]})
                        check(prefix + " whole visible labels remain inside the plot",
                              geometry["labelsBounded"], geometry["rects"])
                        overlaps = []
                        for i, a in enumerate(geometry["rects"]):
                            for b in geometry["rects"][i + 1:]:
                                if (a["left"] < b["right"] and a["right"] > b["left"]
                                        and a["top"] < b["bottom"] and a["bottom"] > b["top"]):
                                    overlaps.append([a["index"], b["index"]])
                        check(prefix + " no visible label collisions", not overlaps, overlaps)
                        fragments = [
                            label for label in geometry["rects"]
                            if len(label["text"].strip()) == 1
                            and len(items[label["index"]]["label"].strip()) > 1
                        ]
                        check(prefix + " no one-character label fragments", not fragments, fragments)
                        for endpoint in [0, count - 1]:
                            visible = any(label["index"] == endpoint for label in geometry["rects"])
                            in_rows = any(items[endpoint]["full"] in row for row in geometry["rows"])
                            check(prefix + f" endpoint {endpoint} stays visible or in full visible rows",
                                  visible or in_rows, {"visible": visible, "rows": in_rows})
                        if count >= 14 and kind != "short":
                            check(prefix + " dense labels are sampled without losing full reading path",
                                  len(geometry["rects"]) < count
                                  and (len(geometry["rects"]) > 0 or geometry["readings"] == count),
                                  {"visibleLabels": len(geometry["rects"]),
                                   "visibleReadingRows": geometry["readings"]})
                        expected_runs = []
                        run = []
                        for i, item in enumerate(items):
                            try:
                                valid = item.get("value") is not None and float(item["value"]) >= 0
                            except (ValueError, TypeError):
                                valid = False
                            if valid:
                                run.append(i)
                            else:
                                if len(run) > 1:
                                    expected_runs.append(run)
                                run = []
                        if len(run) > 1:
                            expected_runs.append(run)
                        actual_runs = page.evaluate("""id => {
                          const svg=document.getElementById(id).querySelector('[data-plot] svg');
                          return [...svg.querySelectorAll('.m-chart__line')].map(line =>
                            line.getAttribute('points').trim().split(/\\s+/).length);
                        }""", chart)
                        check(prefix + " line segments retain source gaps and continuity",
                              [len(run) for run in expected_runs] == actual_runs,
                              {"expected": [len(run) for run in expected_runs], "actual": actual_runs})
                        expected_readings = [item["full"] for item in items]
                        if expected_readings:
                            # Dense mandatory labels may move to full visible rows; the disclosure is always complete.
                            page.locator("#host .m-chart__disclose").click()
                            table = page.locator("#host .m-chart__dataset tbody tr")
                            table_rows = table.all()
                            table_labels = [row.locator("th").inner_text() for row in table_rows]
                            table_values = [row.locator("td").last.inner_text() for row in table_rows]
                            table_times = ([row.locator("td").nth(0).inner_text() for row in table_rows]
                                           if kind == "time" else [])
                            expected_values = [
                                ("قيمة غير صالحة" if item.get("value") == "غير رقمي" else "(غير متاح)")
                                if item.get("value") is None or item.get("value") == "غير رقمي"
                                else ("-3 (سالب غير مرسوم)" if item.get("value") == "-3"
                                      else item.get("value", "— غير متاح"))
                                for item in items
                            ]
                            check(prefix + " full labels and exact values in table",
                                  table_labels == [
                                      expected + (("، " + item["x"])
                                                  if kind == "time" and item["x"] not in expected else "")
                                      for expected, item in zip(expected_readings, items)
                                  ] and table_values == expected_values
                                  and (kind != "time" or table_times == [item["x"] for item in items]),
                                  {"labels": table_labels, "times": table_times, "values": table_values})
                            page.evaluate("(id) => window.MicroData.render(document.getElementById(id))", chart)
                        if kind == "time":
                            positions = {entry["index"]: entry["x"] for entry in geometry["pointXs"]}
                            actual = page.evaluate("""id => {
                              const chart=document.getElementById(id);
                              const rows=[...chart.querySelectorAll('.m-chart__data [data-series]')];
                              return rows.map((row,i)=>({i,x:row.getAttribute('data-x')}));
                            }""", chart)
                            timed = [(entry["i"], dt.datetime.fromisoformat(entry["x"].replace("Z", "+00:00")).timestamp() * 1000)
                                     for entry in actual if entry["i"] in positions]
                            if timed:
                                lo = min(value for _, value in timed)
                                hi = max(value for _, value in timed)
                                expected = {
                                    index: geometry["viewBoxWidth"] - 24
                                    - ((value - lo) / (hi - lo) if hi != lo else 0.5)
                                    * (geometry["viewBoxWidth"] - 48)
                                    for index, value in timed
                                }
                                time_error = max(abs(positions[index] - x) for index, x in expected.items())
                            else:
                                time_error = 0
                            check(prefix + " irregular time spacing follows explicit timestamps",
                                  bool(timed) and time_error < 0.1, time_error)
                        elif count > 1:
                            # Category geometry remains evenly spaced, unlike explicit time geometry.
                            x_positions = [entry["x"] for entry in geometry["pointXs"]]
                            expected = [geometry["viewBoxWidth"] - 24
                                        - i / (count - 1) * (geometry["viewBoxWidth"] - 48)
                                        for i in range(count)]
                            error = max(abs(a - b) for a, b in zip(x_positions, expected))
                            check(prefix + " category positions remain source-index based",
                                  len(x_positions) == count and geometry["viewBoxWidth"] == width
                                  and error < 0.1, {"positions": x_positions, "maxError": error})
                        boundary_index = count // 2
                        if count > 2:
                            boundary_label = items[boundary_index]["label"]
                            boundary_visible = any(label["index"] == boundary_index
                                                   for label in geometry["rects"])
                            boundary_in_rows = any(items[boundary_index]["full"] in row
                                                   for row in geometry["rows"])
                            check(prefix + " semantic boundary remains readable",
                                  boundary_visible or boundary_in_rows,
                                  {"visible": boundary_visible, "rows": geometry["rows"]})

                        if width == 320 and kind == "short" and count == 7:
                            page.set_viewport_size({"width": 390, "height": 1200})
                            page.wait_for_timeout(100)
                            resized = page.evaluate("""id => {
                              const chart=document.getElementById(id);
                              return {
                              width:Number(chart.querySelector('[data-plot] svg').viewBox.baseVal.width),
                              points:chart.querySelectorAll('g[data-point-index]').length
                              };
                            }""", chart)
                            check("ResizeObserver remeasures and preserves all seven points",
                                  resized["width"] == 390 and resized["points"] == 7, resized)
                            page.set_viewport_size({"width": 320, "height": 1200})

            missing_time = [{"label": "يناير", "full": "يناير 2025", "value": "5"},
                            {"label": "مارس", "full": "مارس 2025", "value": "7"}]
            invalid_axis = page.evaluate("(items) => window.makeLine({items,axisType:'time'})", missing_time)
            invalid_result = page.evaluate("""id => {
              const chart=document.getElementById(id);
              return {
              state:chart.getAttribute('data-axis-state'),
              svg:!!chart.querySelector('[data-plot] svg'),
              rows:[...chart.querySelectorAll('.m-chart__readings dt')].map(n=>n.textContent),
              table:chart.querySelectorAll('.m-chart__dataset tbody tr').length
              };
            }""", invalid_axis)
            check("explicit time axis refuses missing coordinates with full readings",
                  invalid_result["state"] == "invalid-time" and not invalid_result["svg"]
                  and invalid_result["rows"] == ["يناير 2025", "مارس 2025"]
                  and invalid_result["table"] == 2, invalid_result)

            for invalid in ["2024-02-31", "2023-02-29", "2024-13-01", "2024-01-00",
                            "2024-01-01T24:00:00Z", "2024-01-01T12:61:00Z",
                            "2024-01-01T12:00:00+25:00", "2024-01-01T12:00:00",
                            "-1e308", "1e308", "8640000000000001"]:
                items = [{"label": "بداية", "full": "بداية", "value": "5", "x": invalid},
                         {"label": "نهاية", "full": "نهاية", "value": "7", "x": "2024-03-02"}]
                chart_id = page.evaluate("(items)=>window.makeLine({items,axisType:'time'})", items)
                check(f"invalid/overflow time refused without data loss: {invalid}",
                      page.evaluate("""id=>{
                        const c=document.getElementById(id);
                        return c.dataset.axisState==='invalid-time'&&!c.querySelector('[data-plot] svg')
                          &&c.querySelectorAll('.m-chart__readings dt').length===2
                          &&c.querySelectorAll('.m-chart__dataset tbody tr').length===2;
                      }""", chart_id))
            for valid in ["2024-02-29", "2024-02-29T12:00:00Z",
                          "2024-02-29T12:00:00+03:00", "-8640000000000000", "8640000000000000"]:
                items = [{"label": "بداية", "full": "بداية", "value": "5", "x": valid},
                         {"label": "نهاية", "full": "نهاية", "value": "7", "x": "2024-03-02"}]
                chart_id = page.evaluate("(items)=>window.makeLine({items,axisType:'time'})", items)
                check(f"valid leap day/offset/bounded epoch produces finite points: {valid}",
                      page.evaluate("""id=>{
                        const c=document.getElementById(id),dots=[...c.querySelectorAll('.m-chart__dot')];
                        return !c.hasAttribute('data-axis-state') && !!c.querySelector('[data-plot] svg')
                          && dots.every(d=>Number.isFinite(Number(d.getAttribute('cx'))));
                      }""", chart_id))

            packed = page.evaluate("() => window.makePacked()")
            packed_result = page.evaluate("""id => {
              const chart=document.getElementById(id);
              return {
              state:chart.getAttribute('data-packed-state'),
              circles:chart.querySelectorAll('.m-bubble__circle').length,
              values:chart.querySelectorAll('.m-legend__item').length,
              message:chart.querySelector('[data-plot] .m-chart__scale-error')?.textContent
              };
            }""", packed)
            check("packed circles reject six positive categories with full text key",
                  packed_result["state"] == "too-many-positive-categories"
                  and packed_result["circles"] == 0 and packed_result["values"] == 6
                  and bool(packed_result["message"]), packed_result)
            packed_states = page.evaluate("() => window.makePackedStates()")
            states_result = page.evaluate("""id => {
              const chart=document.getElementById(id);
              return {circles:chart.querySelectorAll('.m-bubble__circle').length,
                stateText:[...chart.querySelectorAll('.m-packed__states .m-legend__value')]
                  .map(node=>node.textContent)};
            }""", packed_states)
            check("packed values and zero/negative/unknown/unavailable states remain exact",
                  states_result["circles"] == 5
                  and states_result["stateText"] == ["0 (صفر)", "-3 (سالب غير صالح للمساحة)",
                                                      "(غير معروف)", "(غير متاح)"],
                  states_result)
            check("no browser JavaScript errors", not errors, errors)
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    report = {"passed": sum(1 for row in results if row["passed"]),
              "failed": sum(1 for row in results if not row["passed"]),
              "results": results}
    (out / "complete-repair-chart-check.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"RESULT {report['passed']} passed, {report['failed']} failed; report: {out}")
    return 1 if report["failed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
