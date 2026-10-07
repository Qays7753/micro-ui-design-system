#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""مشغّل أداة B01 المشتركة (tools/b01-screenshots.py) بلا أي تعديل عليها.

جولة SAMSUNG-ONEUI-REPAIR-R1 — الوكيل 1:
الأداة b01 مشتركة بصريًا (لا يجوز للوكيل تعديلها)، وهي تكتب افتراضيًا فوق
أدلة الجولات التاريخية (reviews/B01). هذا المشغّل يستورد الأداة من مصدرها
كما هي، ويوجه مخرجاتها (SHOTS/LOGFILE) إلى مجلد أدلة الوكيل 1، ويربط
خادمها المؤقت على منفذ من نطاق الوكيل 1 (4101) بدل المنفذ التلقائي.
تشغيل من جذر المستودع:
  python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent1/scripts/run-b01-redirected.py
"""
import http.server
import importlib.util
import sys
import threading
from pathlib import Path


def find_repo(start: Path) -> Path:
    for d in [start] + list(start.parents):
        if (d / "tools" / "b01-screenshots.py").exists():
            return d
    raise RuntimeError("لم يُعثر على جذر المستودع (tools/b01-screenshots.py)")


REPO = find_repo(Path(__file__).resolve())
OUT = REPO / "reviews" / "SAMSUNG-ONEUI-REPAIR-R1" / "evidence" / "agent1" / "b01"
PORT = 4101  # من نطاق الوكيل 1 (4100-4119)

spec = importlib.util.spec_from_file_location("b01_screenshots_shared", REPO / "tools" / "b01-screenshots.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)  # main() محمية بـ __main__ — لا تعمل عند الاستيراد

# توجيه المخرجات فقط (لا تعديل سلوك الفحص نفسه)
mod.SHOTS = OUT / "screenshots"
mod.LOGFILE = OUT / "r2-verification.txt"
mod.ROOT = REPO


def start_server_fixed_port():
    handler = http.server.SimpleHTTPRequestHandler
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    server.daemon_threads = True
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return server, server.server_address[1]


mod.start_server = start_server_fixed_port

if __name__ == "__main__":
    print(f"# مشغّل B01 المعاد التوجيه — الأداة من المصدر بلا تعديل: {REPO / 'tools' / 'b01-screenshots.py'}")
    print(f"# الإخراج: {OUT} — الخادم: 127.0.0.1:{PORT}")
    sys.exit(mod.main())
