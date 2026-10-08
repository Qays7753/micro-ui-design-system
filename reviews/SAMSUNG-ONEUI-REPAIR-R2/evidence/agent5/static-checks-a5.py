#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A5 المستقل — الفحوص القرائية (SUI-R1-05 c/d وSUI-R1-06 c/d).

تسجيل مقيس بالقراءة المباشرة للمصادر والتوثائق في الشجرة المثبتة 3a6adf0:
  05c) components/fields/specification.md يحمل عقد قراءة المبلغ الصادق.
  05d) ملاحظات «تصحيح R2 (2026-10-08)» في R1 REPORT/MATRIX موجودة والنص
       الأصلي غير محذوف.
  06c) فحص البوابة الجديد في concepts-check.py معنوي (لا حرفي) + فحوصا
       صدق callback موجودان بأسمائهما.
  06d) أوامر سلسلة F02 في تقرير الوكيل 4 تشير لوسائط أدوات حقيقية
       (b03 --out، b07 بلا وسيط إخراج، f01 --round، f02 --root/--round)
       وF02-32 يقرأ أسماء الملفات نفسها الموثقة.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]

results = []
ok_all = True


def check(cid, label, ok, detail=None):
    global ok_all
    results.append({"id": cid, "label": label, "pass": bool(ok), "detail": detail})
    if not ok:
        ok_all = False


# ---------- 05c: المواصفة ----------
spec = (ROOT / "components/fields/specification.md").read_text(encoding="utf-8")
check("05c-spec-single-line", "تصريح أحادية السطر: المدخل لا يلف أرقامًا",
      "أحادي السطر" in spec and "لا يلف أرقامًا" in spec)
check("05c-spec-fits", "ما يسع كاملًا موثق: 11 رقمًا/14 محرفًا وclient=252=scroll=252",
      "11 رقمًا" in spec and "14 محرفًا" in spec and "client=252 = scroll=252" in spec)
check("05c-spec-overflow", "ما يتجاوز موثق بصدق: 15 رقمًا client=252/scroll=288 يحتاج تمرير تحرير",
      "123456789012345" in spec and "client=252 وscroll=288" in spec)
check("05c-spec-caret", "القراءة بالمؤشر (End/Home، التمرير يتبع المؤشر) موثقة",
      "`End`" in spec and "`Home`" in spec and "التمرير يتبع المؤشر" in spec)
check("05c-spec-no-shrink", "لا تصغير خط ولا حد أعمال مخترع، والأرضية 11ch باقية",
      "محظور" in spec and "لا حد أعمال مخترع" in spec.replace("**", "") and "11ch" in spec)

# ---------- 05d: ملاحظات التصحيح المؤرخة ----------
report = (ROOT / "reviews/SAMSUNG-ONEUI-REPAIR-R1/REPORT.md").read_text(encoding="utf-8")
matrix = (ROOT / "reviews/SAMSUNG-ONEUI-REPAIR-R1/MATRIX.md").read_text(encoding="utf-8")
n_report_notes = report.count("تصحيح R2 (2026-10-08)")
n_matrix_notes = matrix.count("تصحيح R2 (2026-10-08)")
check("05d-notes-present", "ملاحظات مؤرخة في REPORT (2) وMATRIX (2)",
      n_report_notes == 2 and n_matrix_notes == 2,
      {"report": n_report_notes, "matrix": n_matrix_notes})
check("05d-original-kept-report", "النص الأصلي «مبلغ 15 خانة...252/252» و«لا يمس أي ملف غُيّر» باقيان في REPORT",
      "مبلغ 15 خانة عند 320+200%: 252/252" in report and "لا يمس أي ملف غُيّر في الجولة" in report)
check("05d-original-kept-matrix", "النص الأصلي «252/252 و15 خانة تلف بلا قص» و«لا يمس أي ملف غُيّر هنا» باقيان في MATRIX",
      "252/252 و15 خانة تلف بلا قص" in matrix and "لا يمس أي ملف غُيّر هنا" in matrix)

# ---------- 06c: فحص البوابة في concepts-check ----------
cc = (ROOT / "tools/concepts-check.py").read_text(encoding="utf-8")
# التحقق الدقيق: التوقع الحرفي القديم غير مستخدم كشرط، والفحص المعنوي موجود
old_literal_used = re.search(r"check\([^)]*لا توجد خدمة مصادقة", cc) is not None
check("06c-meaningful", "الفحص المعنوي موجود (claims_login/honest_demo) ولا توقع حرفي متبقٍ داخل check()",
      "claims_login" in cc and "honest_demo" in cc and not old_literal_used,
      {"literalUsedInCheck": old_literal_used})
check("06c-verbatim-check", "فحص صدق: نتيجة الرفض برسالة المستهلك حرفيًا بنبرة error",
      "Consumer-denied result message shows verbatim with error tone" in cc)
check("06c-neutral-check", "فحص صدق: اكتمال بلا نتيجة مؤكدة يبقى محايدًا بلا ادعاء",
      "Handler completion without confirmed result stays neutral" in cc)

# ---------- 06d: أوامر سلسلة F02 ----------
b03 = (ROOT / "tools/b03-screenshots.py").read_text(encoding="utf-8")
b07 = (ROOT / "tools/b07-screenshots.py").read_text(encoding="utf-8")
f01 = (ROOT / "tools/ux-f01-check.py").read_text(encoding="utf-8")
f02 = (ROOT / "tools/ux-f02-check.py").read_text(encoding="utf-8")
check("06d-b03-out", "b03-screenshots.py يملك --out فعليًا ويكتب verification.txt + screenshots/",
      'add_argument("--out"' in b03 and "verification.txt" in b03 and "screenshots" in b03)
check("06d-b07-noout", "b07-screenshots.py بلا وسيط إخراج (يكتب reviews/B07/verification.txt ثابتة)",
      "argparse" not in b07 and "sys.argv" not in b07 and 'LOGFILE = ROOT / "reviews" / "B07" / "verification.txt"' in b07)
check("06d-f01-round", "ux-f01-check.py وسيطه --round ويكتب round-<name>/",
      '--round r2' in f01 and 'OUT = OUT / f"round-{ROUND}"' in f01)
check("06d-f02-args", "ux-f02-check.py وسائط --root/--round وF02-32 يقرأ b03/b07-verification.txt وf01-regression",
      'parser.add_argument("--round"' in f02 and "b03-verification.txt" in f02 and "b07-verification.txt" in f02 and "f01-regression" in f02)

out = {"tool": "agent5 static reading checks (SUI-R1-05 c/d, SUI-R1-06 c/d)", "checks": results,
       "summary": {"pass": sum(1 for r in results if r["pass"]), "total": len(results)}}
here = Path(__file__).resolve().parent
(here / "static-checks-a5.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"static: {out['summary']['pass']}/{out['summary']['total']}")
for r in results:
    print(f"  [{'PASS' if r['pass'] else 'FAIL'}] {r['id']}: {r['label']}")
raise SystemExit(0 if ok_all else 1)
