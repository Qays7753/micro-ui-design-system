#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — فحص قبول UX-F01 (مسارات F01-01..F01-20). من جذر المستودع:
  python3 tools/ux-f01-check.py
النتائج: reviews/UX-F01/verification.json + verification.txt + screenshots/
فشل أي assertion أو تعذر تشغيل البيئة → رمز خروج غير صفري (لا PASS صامت).

بيئة الفحص: متصفح headless فعلي (Playwright + Chromium) — فحوص DOM ولوحة
مفاتيح محاكاة ومقاسات ومحاكاة تكبير النص 200% بالآلية المعلنة (مضاعفة
أحجام الخط المحسوبة) وreduced-motion بالتفضيل الحقيقي عبر Playwright.
لا تثبت: TalkBack/VoiceOver أو أجهزة حقيقية أو native zoom أو WebKit —
هذه NOT RUN ما لم تُنفذ فعليًا وتسجل في verification.json ضمن not_run.
"""
import http.server
import json
import subprocess
import sys
import threading
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "reviews" / "UX-F01"
PAGE_PATH = "previews/ux-patterns/form-lifecycle/index.html"

results, log_lines, rows, js_errors = [], [], [], []


def log(m):
    print(m)
    log_lines.append(m)


def row(rid, path, expected):
    r = {"id": rid, "path": path, "expected": expected, "measured": {}, "failed": []}
    rows.append(r)
    log(f"## {rid} — {path}")
    return r


def A(r, name, ok, detail=None):
    ok = bool(ok)
    r["measured"][name] = detail if detail is not None else ok
    if not ok:
        r["failed"].append(name + ((" — " + str(detail)) if detail is not None else ""))
        log(f"   FAIL {name} — {detail}")
    else:
        log(f"   ok   {name}" + (f" ({detail})" if detail is not None else ""))
    return ok


# ---------- مساعدات المشغل ----------

def insp(page):
    return page.evaluate("() => window.F01Example.inspect()")


def fresh(page):
    page.reload(wait_until="load")
    page.wait_for_load_state("networkidle")
    page.evaluate("() => document.fonts.ready")
    page.wait_for_function(
        "() => window.F01Example && window.F01Example.inspect().op === 'idle'"
        " && window.F01Example.inspect().views.read === true")
    enter_edit(page)


def enter_edit(page):
    page.click("#f01-edit-btn")
    page.wait_for_function("() => window.F01Example.inspect().views.edit === true")
    page.wait_for_function("() => window.F01Example.inspect().focusId === 'f01-name'")


def wait_op(page, op):
    page.wait_for_function(f"() => window.F01Example.inspect().op === '{op}'")


def wait_dialog(page, opened):
    page.wait_for_function(
        f"() => window.F01Example.inspect().dialogOpen === {str(opened).lower()}")


def arm(page, kind, outcome):
    # تعيين السيناريو دون تحريك التركيز (نقر/اختيار برمجي محايد للتركيز)
    page.evaluate(
        "([sel, val]) => { const s = document.getElementById(sel); s.value = val;"
        " s.dispatchEvent(new Event('change', { bubbles: true })); }",
        [f"f01-sim-{kind}-outcome", outcome])


def settle(page, kind):
    page.evaluate("(id) => document.getElementById(id).click()", f"f01-sim-settle-{kind}")


def stale_response(page, kind):
    page.evaluate("(id) => document.getElementById(id).click()", f"f01-sim-stale-{kind}")


def save_click(page):
    page.click("#f01-save")


def settle_wait(page, kind, op):
    settle(page, kind)
    wait_op(page, op)


# ---------- المسارات ----------

def run_f01_01(page):
    """فتح ثم محاولة حفظ clean: لا خطأ؛ القيم الأصلية؛ saveCalls=0؛ لا نجاح جديد."""
    r = row("F01-01", "فتح ثم محاولة حفظ clean",
            "لا خطأ؛ القيم الأصلية {name:'عينة',note:''}؛ saveCalls=0؛ لا نجاح جديد")
    fresh(page)
    s = insp(page)
    A(r, "لا خطأ مبكر عند الفتح", not s["nameError"] and s["op"] == "idle", s["op"])
    A(r, "القيم الأصلية", s["current"] == {"name": "عينة", "note": ""}, s["current"])
    A(r, "dirty=false عند الفتح", s["dirty"] is False)
    A(r, "saveCalls=0 قبل المحاولة", s["saveCalls"] == 0)
    save_click(page)
    s = insp(page)
    A(r, "saveCalls=0 بعد محاولة clean", s["saveCalls"] == 0, s["saveCalls"])
    A(r, "لا عملية جديدة", s["op"] == "idle", s["op"])
    A(r, "رسالة لا تغييرات للحفظ", s["message"] and "لا تغييرات للحفظ" in s["message"]["text"], s["message"])
    A(r, "لا نجاح", s["message"]["variant"] != "success", s["message"]["variant"])
    A(r, "القيم لم تُمس", s["current"] == {"name": "عينة", "note": ""}, s["current"])
    page.screenshot(path=str(OUT / "screenshots" / "f01-01-clean-save.png"))


def run_f01_02(page):
    """تعديل ثم إرجاع القيم إلى الأصل: dirty true ثم false؛ لا calls ولا إعلان حفظ."""
    r = row("F01-02", "تعديل ثم إرجاع القيم إلى الأصل",
            "dirty true ثم false دون حفظ؛ لا calls ولا إعلان نجاح")
    fresh(page)
    page.fill("#f01-name", "عينة معدلة")
    s = insp(page)
    A(r, "dirty=true بعد التعديل", s["dirty"] is True)
    A(r, "مؤشر التعديل ظاهر", s["dirtyHintVisible"] is True)
    page.fill("#f01-note", "ملاحظة مؤقتة")
    page.fill("#f01-note", "")
    page.fill("#f01-name", "عينة")
    s = insp(page)
    A(r, "dirty=false بعد العودة للقيم الأصلية", s["dirty"] is False)
    A(r, "مؤشر التعديل اختفى", s["dirtyHintVisible"] is False)
    A(r, "saveCalls=0", s["saveCalls"] == 0, s["saveCalls"])
    A(r, "لا رسالة نجاح", s["message"] is None, s["message"])
    A(r, "العملية idle", s["op"] == "idle", s["op"])


def run_f01_03(page):
    """اسم فارغ/مسافات مع ملاحظة: خطأ مرتبط؛ الاسم هو التركيز؛ الملاحظة باقية؛ saveCalls=0."""
    r = row("F01-03", "اسم فارغ/مسافات مع ملاحظة",
            "خطأ مرتبط بالحقل؛ التركيز الاسم؛ الملاحظة باقية؛ saveCalls=0")
    fresh(page)
    page.fill("#f01-note", "ملاحظة تركيبية تبقى")
    page.fill("#f01-name", "   ")
    save_click(page)
    s = insp(page)
    A(r, "خطأ الاسم معروض", s["nameError"] is True)
    A(r, "aria-invalid=true", s["nameAriaInvalid"] is True)
    A(r, "الرسالة مرتبطة aria-describedby", "f01-name-msg" in s["nameDescribedBy"], s["nameDescribedBy"])
    A(r, "نص الخطأ يسمي السبب والعلاج", "الاسم مطلوب" in s["nameMsgText"], s["nameMsgText"])
    A(r, "التركيز على الاسم", s["focusId"] == "f01-name", s["focusId"])
    A(r, "الملاحظة باقية", s["current"]["note"] == "ملاحظة تركيبية تبقى", s["current"]["note"])
    A(r, "saveCalls=0", s["saveCalls"] == 0, s["saveCalls"])
    A(r, "لا عملية جديدة", s["op"] == "idle", s["op"])
    page.screenshot(path=str(OUT / "screenshots" / "f01-03-name-error.png"))


def run_f01_04(page):
    """تصحيح الخطأ ثم حفظ صالح: الخطأ يزول؛ نسخة الإرسال تطابق الخام دون trim؛ saveCalls=1."""
    r = row("F01-04", "تصحيح الخطأ ثم حفظ صالح (تكملة F01-03)",
            "الخطأ يزول عند التصحيح؛ الإرسال خام بلا trim؛ saveCalls=1؛ النجاح يحدث المؤكد وclean")
    fresh(page)
    page.fill("#f01-note", "ملاحظة تركيبية تبقى")
    page.fill("#f01-name", "   ")
    save_click(page)
    s = insp(page)
    A(r, "تمهيد: خطأ الاسم معروض من محاولة سابقة", s["nameError"] is True)
    RAW_NAME = "  سجل مع مسافات  "
    page.fill("#f01-name", RAW_NAME)
    s = insp(page)
    A(r, "الخطأ يزول عند التصحيح (UX-09)", s["nameError"] is False and s["nameAriaInvalid"] is False)
    save_click(page)
    wait_op(page, "saving")
    s = insp(page)
    A(r, "saveCalls=1", s["saveCalls"] == 1, s["saveCalls"])
    A(r, "نسخة الإرسال خام بلا trim", s["sending"] == {"name": RAW_NAME, "note": "ملاحظة تركيبية تبقى"}, s["sending"])
    A(r, "الحقول readonly أثناء saving", s["readonly"] is True and s["disabled"] is False)
    A(r, "زر الحفظ busy (تحميل B)", s["saveBusy"] is True)
    settle(page, "save")
    wait_op(page, "saved")
    s = insp(page)
    A(r, "النتيجة saved", s["op"] == "saved")
    A(r, "المؤكد = نسخة الإرسال", s["confirmed"] == s["sending"], s["confirmed"])
    A(r, "clean بعد النجاح", s["dirty"] is False)
    A(r, "رسالة نجاح باقية واحدة", s["message"] and s["message"]["variant"] == "success", s["message"])
    A(r, "readonly زال", s["readonly"] is False)
    A(r, "busy زال", s["saveBusy"] is False)
    page.screenshot(path=str(OUT / "screenshots" / "f01-04-saved.png"))

def run_f01_05(page):
    """تكرار pointer/Enter/Space/submit أثناء saving: دعوة واحدة؛ الحقول readonly؛ لا فقد تركيز."""
    r = row("F01-05", "تكرار pointer/Enter/Space/submit أثناء saving",
            "دعوة واحدة؛ pending لا يغير العرض؛ الحقول readonly؛ التركيز لا يفقد")
    fresh(page)
    page.fill("#f01-name", "تكرار أثناء الانتظار")
    save_click(page)
    wait_op(page, "saving")
    s0 = insp(page)
    A(r, "saving وبدأت دعوة واحدة", s0["op"] == "saving" and s0["saveCalls"] == 1)
    A(r, "التركيز على زر الحفظ", s0["focusId"] == "f01-save", s0["focusId"])
    # تكرار تفعيل من كل الطرق: click برمجي (حراسة الالتقاط في B01)، Enter، Space، requestSubmit
    page.evaluate("() => document.getElementById('f01-save').click()")
    page.focus("#f01-save")
    page.keyboard.press("Enter")
    page.keyboard.press(" ")
    page.evaluate("() => document.getElementById('f01-form').requestSubmit()")
    s = insp(page)
    A(r, "دعوة واحدة رغم تكرار التفعيل", s["saveCalls"] == 1, s["saveCalls"])
    A(r, "لا عملية ثانية", s["op"] == "saving", s["op"])
    A(r, "العرض لم يتغير (رسالة الانتظار نفسها)",
      s["message"] and s["message"]["title"] == "جارٍ الحفظ", s["message"])
    A(r, "الحقول بقيت readonly", s["readonly"] is True)
    A(r, "لا فقد للتركيز", s["focusId"] == "f01-save", s["focusId"])
    A(r, "نسخة الإرسال ثابتة", s["sending"]["name"] == "تكرار أثناء الانتظار", s["sending"])
    settle(page, "save")
    wait_op(page, "saved")
    s = insp(page)
    A(r, "النتيجة تصل بعد الانتظار", s["op"] == "saved" and s["saveCalls"] == 1)
    page.screenshot(path=str(OUT / "screenshots" / "f01-05-saving.png"))


def run_f01_06(page):
    """saving→not-saved→تصحيح→saved: المؤكد لم يتغير عند الرفض؛ حفظ ثانٍ بالقيم الجديدة."""
    r = row("F01-06", "saving→not-saved→تصحيح→saved",
            "المؤكد لم يتغير عند الرفض؛ القيم باقية؛ حفظ ثانٍ يحدث المؤكد وclean")
    fresh(page)
    page.fill("#f01-name", "قيمة جديدة")
    arm(page, "save", "not-saved")
    save_click(page)
    settle_wait(page, "save", "failed")
    s = insp(page)
    A(r, "failed بعد الرفض", s["op"] == "failed")
    A(r, "المؤكد لم يتغير", s["confirmed"] == {"name": "عينة", "note": ""}, s["confirmed"])
    A(r, "القيم الحالية باقية", s["current"]["name"] == "قيمة جديدة", s["current"]["name"])
    A(r, "رسالة رفض باقية ومسار عمل", s["message"] and s["message"]["variant"] == "error"
      and "المحاولة" in s["message"]["text"] or (s["message"] and "التصحيح" in s["message"]["text"]), s["message"])
    A(r, "التحرير متاح بعد الرفض", s["readonly"] is False)
    page.fill("#f01-name", "قيمة مصححة")
    save_click(page)
    wait_op(page, "saving")
    s = insp(page)
    A(r, "حفظ ثانٍ بالقيم الجديدة", s["saveCalls"] == 2 and s["sending"]["name"] == "قيمة مصححة",
      (s["saveCalls"], s["sending"]))
    settle(page, "save")
    wait_op(page, "saved")
    s = insp(page)
    A(r, "النجاح يحدث المؤكد", s["confirmed"] == {"name": "قيمة مصححة", "note": ""}, s["confirmed"])
    A(r, "clean بعد النجاح", s["dirty"] is False)
    A(r, "رسالة نجاح", s["message"]["variant"] == "success")
    page.screenshot(path=str(OUT / "screenshots" / "f01-06-failed-retry.png"))


def run_f01_07(page):
    """saved ثم تعديل جديد: dirty true؛ رسالة النجاح القديمة لا تدعي حفظ التعديل الجديد."""
    r = row("F01-07", "saved ثم تعديل جديد (تكملة F01-06)",
            "dirty=true؛ رسالة النجاح القديمة تزال؛ العملية idle؛ لا ادعاء حفظ جديد")
    fresh(page)
    page.fill("#f01-name", "قيمة سابقة")
    save_click(page)
    settle_wait(page, "save", "saved")
    s = insp(page)
    A(r, "تمهيد: حالة saved برسالة نجاح", s["op"] == "saved" and s["message"]["variant"] == "success")
    page.fill("#f01-note", "تعديل بعد النجاح")
    s = insp(page)
    A(r, "dirty=true بعد التعديل", s["dirty"] is True)
    A(r, "رسالة النجاح القديمة تزالت", s["message"] is None, s["message"])
    A(r, "العملية idle", s["op"] == "idle", s["op"])
    A(r, "لا حفظ جديد تلقائي", s["saveCalls"] == 1, s["saveCalls"])


def run_f01_08(page):
    """saving→unknown ومحاولة حفظ/مغادرة: لا call جديد ولا فقد ولا ادعاء رفض؛ السبب ظاهر."""
    r = row("F01-08", "saving→unknown ومحاولة حفظ/مغادرة",
            "لا دعوة جديدة؛ لا فقد؛ لا ادعاء رفض مؤكد؛ القيم مقروءة وسبب الحجب ظاهر")
    fresh(page)
    page.fill("#f01-name", "غير محسومة")
    arm(page, "save", "unknown")
    save_click(page)
    settle_wait(page, "save", "unknown")
    s = insp(page)
    A(r, "unknown بعد نتيجة مجهولة", s["op"] == "unknown")
    A(r, "لا ادعاء رفض أو نجاح", s["message"] and s["message"]["variant"] == "warning", s["message"])
    A(r, "الحقول readonly وليست معطلة", s["readonly"] is True and s["disabled"] is False)
    A(r, "زر التحقق متاح", s["checkVisible"] is True)
    # محاولة حفظ في unknown: ممنوعة سلوكيًا بلا دعوة جديدة
    page.evaluate("() => document.getElementById('f01-form').requestSubmit()")
    save_click(page)
    s = insp(page)
    A(r, "لا call جديد عند محاولة الحفظ", s["saveCalls"] == 1, s["saveCalls"])
    A(r, "unknown باقية", s["op"] == "unknown")
    A(r, "شرح السبب باقٍ ظاهرًا", s["message"] and "غير مؤكدة" in s["message"]["text"], s["message"])
    # محاولة مغادرة: محجوبة برسالة محلية موجزة
    page.click("#f01-back")
    s = insp(page)
    A(r, "لا حوار تخلي", s["dialogOpen"] is False)
    A(r, "لم يغادر منظر التحرير", s["views"]["edit"] is True)
    A(r, "رسالة حجب المغادرة ظاهرة", s["message"] and "غير متاحة" in s["message"]["title"], s["message"])
    A(r, "القيم مقروءة (readOnly)", s["current"]["name"] == "غير محسومة" and s["readonly"] is True)
    page.screenshot(path=str(OUT / "screenshots" / "f01-08-unknown.png"))


def run_f01_09(page):
    """unknown→checking مع تفعيل متكرر→saved: checkCalls=1؛ saveCalls ثابت؛ snapshot من المحاولة نفسها."""
    r = row("F01-09", "unknown→checking مع تفعيل متكرر→saved (تكملة F01-08)",
            "checkCalls=1؛ saveCalls ثابت؛ النجاح يطبق نسخة إرسال المحاولة نفسها")
    fresh(page)
    page.fill("#f01-name", "غير محسومة")
    arm(page, "save", "unknown")
    save_click(page)
    settle_wait(page, "save", "unknown")
    save_calls_before = insp(page)["saveCalls"]
    page.click("#f01-check")
    wait_op(page, "checking")
    # تفعيل متكرر أثناء checking
    page.evaluate("() => document.getElementById('f01-check').click()")
    page.evaluate("() => document.getElementById('f01-check').click()")
    s = insp(page)
    A(r, "checkCalls=1 رغم التكرار", s["checkCalls"] == 1, s["checkCalls"])
    A(r, "saveCalls ثابت", s["saveCalls"] == save_calls_before, (s["saveCalls"], save_calls_before))
    A(r, "زر التحقق busy فقط", s["checkBusy"] is True and s["saveBusy"] is False)
    settle(page, "check")
    wait_op(page, "saved")
    s = insp(page)
    A(r, "saved بعد التحقق", s["op"] == "saved")
    A(r, "المؤكد من نسخة إرسال المحاولة نفسها",
      s["confirmed"] == {"name": "غير محسومة", "note": ""}, s["confirmed"])
    A(r, "clean بعد التحقق", s["dirty"] is False)
    A(r, "زر التحقق اختفى بعد الحسم", s["checkVisible"] is False)


def run_f01_10(page):
    """unknown→checking→not-saved: القيم الجارية باقية؛ التحرير/الحفظ ممكنان؛ لا نجاح."""
    r = row("F01-10", "unknown→checking→not-saved",
            "القيم الجارية باقية؛ التحرير والحفظ ممكنان؛ لا رسالة نجاح")
    fresh(page)
    page.fill("#f01-name", "نتيجة لاحقة")
    arm(page, "save", "unknown")
    save_click(page)
    settle_wait(page, "save", "unknown")
    arm(page, "check", "not-saved")
    page.click("#f01-check")
    settle_wait(page, "check", "failed")
    s = insp(page)
    A(r, "failed بعد not-saved من التحقق", s["op"] == "failed")
    A(r, "القيم الجارية باقية", s["current"]["name"] == "نتيجة لاحقة", s["current"]["name"])
    A(r, "لا نجاح", s["message"]["variant"] == "error", s["message"])
    A(r, "التحرير متاح", s["readonly"] is False)
    page.fill("#f01-note", "حفظ بعد الحسم")
    save_click(page)
    wait_op(page, "saving")
    s = insp(page)
    A(r, "الحفظ ممكن (محاولة جديدة)", s["saveCalls"] == 2 and s["attemptId"] == 2,
      (s["saveCalls"], s["attemptId"]))
    settle(page, "save")
    wait_op(page, "saved")


def run_f01_11(page):
    """check unknown ورفض Promise للتحقق: unknown باقية وإعادة تحقق ممكنة؛ لا إعادة save."""
    r = row("F01-11", "check unknown ورفض Promise للتحقق",
            "unknown باقية بعد نتيجة مجهولة ورفض التحقق؛ إعادة تحقق ممكنة؛ لا إعادة save")
    fresh(page)
    page.fill("#f01-name", "تحقق مجهول")
    arm(page, "save", "unknown")
    save_click(page)
    settle_wait(page, "save", "unknown")
    arm(page, "check", "unknown")
    page.click("#f01-check")
    settle_wait(page, "check", "unknown")
    s = insp(page)
    A(r, "unknown بعد نتيجة تحقق مجهولة", s["op"] == "unknown")
    A(r, "نص تعذر التأكيد", s["message"] and "تعذر تأكيد النتيجة" in s["message"]["text"], s["message"])
    A(r, "إعادة التحقق متاحة", s["checkVisible"] is True)
    A(r, "الحقول بقيت readonly", s["readonly"] is True)
    arm(page, "check", "reject")
    page.click("#f01-check")
    settle_wait(page, "check", "unknown")
    s = insp(page)
    A(r, "unknown بعد رفض Promise للتحقق", s["op"] == "unknown")
    A(r, "إعادة تحقق ممكنة بعد الرفض", s["checkVisible"] is True)
    A(r, "لا إعادة save (دعوة واحدة)", s["saveCalls"] == 1, s["saveCalls"])
    A(r, "محاولتا تحقق", s["checkCalls"] == 2, s["checkCalls"])


def run_f01_12(page):
    """Promise save مرفوض بلا نتيجة عدم حفظ مثبتة: unknown، لا failed مؤكد أو retry-save تلقائي."""
    r = row("F01-12", "Promise save مرفوض بلا نتيجة عدم حفظ مثبتة",
            "unknown لا failed؛ لا إعادة حفظ تلقائية؛ الشرح باقٍ والتحقق متاح")
    fresh(page)
    page.fill("#f01-name", "رفض بلا نتيجة")
    arm(page, "save", "reject")
    save_click(page)
    settle_wait(page, "save", "unknown")
    s = insp(page)
    A(r, "unknown بعد رفض Promise", s["op"] == "unknown", s["op"])
    A(r, "لا failed مؤكد", s["message"]["variant"] == "warning", s["message"])
    A(r, "لا إعادة حفظ تلقائية", s["saveCalls"] == 1, s["saveCalls"])
    page.evaluate("() => document.getElementById('f01-form').requestSubmit()")
    s = insp(page)
    A(r, "محاولة submit لا تعيد الحفظ", s["saveCalls"] == 1 and s["op"] == "unknown")
    A(r, "زر التحقق متاح", s["checkVisible"] is True)
    page.screenshot(path=str(OUT / "screenshots" / "f01-sim-panel.png"), full_page=True)


def run_f01_13(page):
    """رد قديم من موصل اختبار: حالة وقيم ورسالة المحاولة الحالية لا تتغير."""
    r = row("F01-13", "رد قديم من موصل اختبار (حفظ ثم تحقق)",
            "الرد بمعرف قديم يُتجاهل: الحالة والقيم والرسالة والتركيز لا تتغير")
    fresh(page)
    page.fill("#f01-name", "رد قديم")
    save_click(page)
    wait_op(page, "saving")
    s0 = insp(page)
    A(r, "saving مع دعوة واحدة", s0["op"] == "saving" and s0["saveCalls"] == 1)
    stale_response(page, "save")
    s = insp(page)
    A(r, "الحالة لم تتغير (saving)", s["op"] == "saving" and s["op"] == s0["op"])
    A(r, "القيم لم تتغير", s["current"] == s0["current"], s["current"])
    A(r, "رسالة الانتظار لم تتغير", s["message"] == s0["message"], s["message"])
    A(r, "التركيز لم يتغير", s["focusId"] == s0["focusId"], s["focusId"])
    A(r, "المؤكد لم يتغير", s["confirmed"] == s0["confirmed"])
    A(r, "تجاهل مسجل للفحص", s["staleIgnored"] == 1, s["staleIgnored"])
    # الوعد الواحد استُهلك بالرد القديم (عقد الموصل) — نسخة نظيفة لفرع التحقق
    fresh(page)
    page.fill("#f01-name", "رد قديم في التحقق")
    arm(page, "save", "unknown")
    save_click(page)
    settle_wait(page, "save", "unknown")
    page.click("#f01-check")
    wait_op(page, "checking")
    s0 = insp(page)
    stale_response(page, "check")
    s = insp(page)
    A(r, "checking لم يتغير بالرد القديم", s["op"] == "checking" and s["checkCalls"] == 1,
      (s["op"], s["checkCalls"]))
    A(r, "الرسالة لم تتغير في فرع التحقق", s["message"] == s0["message"])
    A(r, "التركيز لم يتغير في فرع التحقق", s["focusId"] == s0["focusId"], s["focusId"])
    A(r, "تجاهل فرع التحقق مسجل (صفحة نظيفة)", s["staleIgnored"] == 1, s["staleIgnored"])

def run_f01_14(page):
    """رجوع clean ثم إعادة تعديل: لا حوار؛ قراءة المؤكد؛ عنوان القراءة ثم الاسم أهداف التركيز."""
    r = row("F01-14", "رجوع clean ثم إعادة تعديل",
            "لا حوار؛ منظر القراءة يعرض المؤكد؛ التركيز عنوان القراءة ثم الاسم")
    fresh(page)
    page.click("#f01-back")
    page.wait_for_function("() => window.F01Example.inspect().views.read === true")
    s = insp(page)
    A(r, "لا حوار في clean", s["dialogOpen"] is False)
    A(r, "منظر القراءة ظاهر", s["views"]["read"] is True and s["views"]["edit"] is False)
    A(r, "القراءة تعرض النسخة المؤكدة", s["confirmed"] == {"name": "عينة", "note": ""}, s["confirmed"])
    A(r, "التركيز على عنوان القراءة", s["focusId"] == "f01-read-title", s["focusId"])
    page.screenshot(path=str(OUT / "screenshots" / "f01-14-read-view.png"))
    page.click("#f01-edit-btn")
    page.wait_for_function("() => window.F01Example.inspect().views.edit === true")
    s = insp(page)
    A(r, "إعادة تعديل بلا حوار", s["dialogOpen"] is False)
    A(r, "التركيز على الاسم", s["focusId"] == "f01-name", s["focusId"])


def run_f01_15(page):
    """dirty→حوار ثم بقاء/Escape/close/backdrop: كل طريقة تحفظ المدخلات وdirty وتركيز صالح."""
    r = row("F01-15", "dirty→حوار ثم بقاء/Escape/الإغلاق/الخلفية",
            "كل طريق إغلاق = بقاء: المدخلات وdirty محفوظان وتركيز صالح بعد الحدث")
    fresh(page)
    NOTE_TEXT = "تعديل للحوار"
    page.fill("#f01-note", NOTE_TEXT)
    page.click("#f01-back")
    wait_dialog(page, True)
    s = insp(page)
    A(r, "الحوار فُتح dirty", s["dialogOpen"] is True)
    A(r, "التركيز داخل الحوار (data-autofocus)", s["focusId"] == "f01-stay", s["focusId"])
    page.screenshot(path=str(OUT / "screenshots" / "f01-15-leave-dialog.png"))
    # 1) Escape
    page.keyboard.press("Escape")
    wait_dialog(page, False)
    s = insp(page)
    A(r, "Escape: بقاء في التحرير", s["views"]["edit"] is True)
    A(r, "Escape: المدخلات محفوظة", s["current"]["note"] == NOTE_TEXT, s["current"]["note"])
    A(r, "Escape: dirty باقية", s["dirty"] is True)
    A(r, "Escape: تركيز المشغّل رجع", s["focusId"] == "f01-back", s["focusId"])
    A(r, "Escape: بلا دعوة حفظ", s["saveCalls"] == 0)
    # 2) الإغلاق الظاهر
    page.click("#f01-back")
    wait_dialog(page, True)
    page.click("#f01-dialog-close")
    wait_dialog(page, False)
    s = insp(page)
    A(r, "الإغلاق الظاهر: بقاء ومدخلات محفوظة", s["views"]["edit"] is True
      and s["current"]["note"] == NOTE_TEXT and s["focusId"] == "f01-back")
    # 3) الخلفية
    page.click("#f01-back")
    wait_dialog(page, True)
    page.evaluate(
        "() => document.querySelector('.m-layer-backdrop[data-for=\"f01-leave-dialog\"]').click()")
    wait_dialog(page, False)
    s = insp(page)
    A(r, "الخلفية: بقاء ومدخلات محفوظة", s["views"]["edit"] is True
      and s["current"]["note"] == NOTE_TEXT and s["dirty"] is True and s["focusId"] == "f01-back")
    # 4) زر البقاء
    page.click("#f01-back")
    wait_dialog(page, True)
    page.click("#f01-stay")
    wait_dialog(page, False)
    s = insp(page)
    A(r, "زر البقاء: بقاء ومدخلات محفوظة", s["views"]["edit"] is True
      and s["current"]["note"] == NOTE_TEXT and s["dirty"] is True and s["focusId"] == "f01-back")


def run_f01_16(page):
    """dirty→حوار→تخلي: يعود snapshot وclean؛ يغادر بعد الإغلاق؛ عنوان القراءة مركّز؛ لا save."""
    r = row("F01-16", "dirty→حوار→التخلي عن التعديل",
            "استعادة المؤكد وclean؛ المغادرة بعد الإغلاق؛ عنوان القراءة مركّز؛ لا save")
    fresh(page)
    page.fill("#f01-name", "سيُتخلى عنه")
    page.fill("#f01-note", "ستُتخلى أيضًا")
    page.click("#f01-back")
    wait_dialog(page, True)
    page.click("#f01-abandon")
    page.wait_for_function(
        "() => window.F01Example.inspect().views.read === true"
        " && window.F01Example.inspect().focusId === 'f01-read-title'")
    s = insp(page)
    A(r, "استعادة snapshot", s["current"] == {"name": "عينة", "note": ""}, s["current"])
    A(r, "clean بعد التخلي", s["dirty"] is False)
    A(r, "لا save عند التخلي", s["saveCalls"] == 0, s["saveCalls"])
    A(r, "غادر بعد الإغلاق (قراءة ظاهرة وتحرير مخفي)", s["views"]["read"] is True and s["views"]["edit"] is False)
    A(r, "عنوان القراءة مركّز", s["focusId"] == "f01-read-title", s["focusId"])
    A(r, "الحوار مغلق", s["dialogOpen"] is False)


def run_f01_17(page):
    """رجوع أثناء saving/checking: لا مغادرة أو تخلٍ؛ الطلب الواحد يستمر بنتيجته."""
    r = row("F01-17", "رجوع أثناء saving/checking",
            "لا مغادرة أو تخلي أثناء الانتظار؛ الطلب الواحد يكمل بنتيجته")
    fresh(page)
    page.fill("#f01-name", "أثناء الانتظار")
    save_click(page)
    wait_op(page, "saving")
    page.click("#f01-back")
    s = insp(page)
    A(r, "لا مغادرة أثناء saving", s["views"]["edit"] is True and s["dialogOpen"] is False)
    A(r, "رسالة حجب موجزة", s["message"] and "غير متاحة" in s["message"]["title"], s["message"])
    settle(page, "save")
    wait_op(page, "saved")
    s = insp(page)
    A(r, "الطلب الواحد أكمل بنتيجته (saved)", s["op"] == "saved" and s["saveCalls"] == 1)
    # فرع checking
    page.fill("#f01-name", "أثناء التحقق")
    arm(page, "save", "unknown")
    save_click(page)
    settle_wait(page, "save", "unknown")
    page.click("#f01-check")
    wait_op(page, "checking")
    page.click("#f01-back")
    s = insp(page)
    A(r, "لا مغادرة أثناء checking", s["views"]["edit"] is True and s["dialogOpen"] is False)
    A(r, "checkCalls=1 ولم يُقاطع", s["checkCalls"] == 1)
    settle(page, "check")
    wait_op(page, "saved")
    s = insp(page)
    A(r, "نتيجة التحقق طبقت بعد الحجب", s["op"] == "saved")


def run_f01_18(page):
    """Tab/Shift+Tab داخل الحوار + نتيجة برسالة: لا تركيز خارج modal؛ إعلان واحد."""
    r = row("F01-18", "Tab/Shift+Tab داخل الحوار مع رسالة نتيجة باقية",
            "لا تركيز خارج modal؛ القناة الإعلانية واحدة؛ الإعلان لا ينقل التركيز")
    fresh(page)
    # نتيجة باقية (رسالة رفض) ثم حوار
    page.fill("#f01-name", "رسالة باقية")
    arm(page, "save", "not-saved")
    save_click(page)
    settle_wait(page, "save", "failed")
    s = insp(page)
    A(r, "رسالة رفض باقية قبل الحوار", s["message"] and s["message"]["variant"] == "error")
    page.fill("#f01-note", "حوار فوق رسالة")
    page.click("#f01-back")
    wait_dialog(page, True)
    seq = []
    for _ in range(4):
        page.keyboard.press("Tab")
        seq.append(insp(page)["focusId"])
    for _ in range(4):
        page.keyboard.press("Shift+Tab")
        seq.append(insp(page)["focusId"])
    A(r, "Tab×4 وShift+Tab×4 داخل الحوار",
      all(f in ("f01-stay", "f01-abandon", "f01-dialog-close") for f in seq), seq)
    s = insp(page)
    A(r, "رسالة النتيجة لا تسرق التركيز", s["focusId"] in ("f01-stay", "f01-abandon", "f01-dialog-close"), s["focusId"])
    A(r, "الرسالة الباقية ما زالت معروضة", s["message"] is not None)
    one_channel = page.evaluate(
        "() => ({live: document.querySelectorAll('#f01-edit [role=status], #f01-edit [aria-live]').length,"
        " region: document.querySelectorAll('.m-live-region').length,"
        " note: document.querySelectorAll('#f01-op-note[role=status]').length})")
    A(r, "قناة إعلان واحدة (نقطة role=status واحدة بلا منطقة ثانية)",
      one_channel["live"] == 1 and one_channel["region"] == 0 and one_channel["note"] == 1, one_channel)
    page.keyboard.press("Escape")
    wait_dialog(page, False)
    A(r, "الخروج من الحوار بقاء", insp(page)["views"]["edit"] is True)


def run_f01_19(page):
    """320/360/390/430 وتكبير نص 200%: لا قص أو تداخل/هدف محجوب؛ الآلية والقيم موثقة."""
    r = row("F01-19", "المقاسات 320/360/390/430 + تكبير النص 200%",
            "لا خروج أفقي أو قص أو تداخل؛ آلية التكبير والقيم قبل/بعد موثقة")
    widths = [320, 360, 390, 430]
    for w in widths:
        page.set_viewport_size({"width": w, "height": 844})
        fresh(page)
        no_h = page.evaluate(
            "() => document.documentElement.scrollWidth <= window.innerWidth + 1")
        A(r, f"لا خروج أفقي عند {w}", no_h)
        geo = page.evaluate("""() => {
          const sec = document.getElementById('f01-edit');
          const R = sec.getBoundingClientRect();
          function inside(sel) {
            const el = document.querySelector(sel);
            if (!el) return null;
            const range = document.createRange();
            range.selectNodeContents(el);
            const rects = [...range.getClientRects()].filter(x => x.width > 0 && x.height > 0);
            return rects.every(x => x.left >= R.left - 1 && x.right <= R.right + 1);
          }
          const acts = [...document.querySelectorAll('#f01-edit .f01-actions .m-btn')]
            .map(b => b.getBoundingClientRect());
          const overlap = acts.some((a, i) => acts.some((b, j) => j > i
            && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom));
          return { label: inside('#f01-name-field .m-field__label'),
                   hint: inside('#f01-edit .f01-view__hint'),
                   btnsOverlap: overlap,
                   btnH: document.getElementById('f01-save').getBoundingClientRect().height };
        }""")
        A(r, f"حدود حروف التسمية داخل الحاوية عند {w}", geo["label"] is True)
        A(r, f"حدود حروف التلميح داخل الحاوية عند {w}", geo["hint"] is True)
        A(r, f"لا تداخل أهداف الأزرار عند {w}", geo["btnsOverlap"] is False)
        A(r, f"هدف الزر ≥ الحد الأدنى عند {w}", geo["btnH"] >= 44, geo["btnH"])
    # تكبير النص 200% — الآلية المعلنة بالمكتبة (ui-release-check): مضاعفة
    # أحجام الخط المحسوبة للعناصر الفعلية. ليست اختبار native zoom/جهاز.
    page.set_viewport_size({"width": 390, "height": 844})
    fresh(page)
    before = page.evaluate("""() => ({
      body: getComputedStyle(document.body).fontSize,
      save: getComputedStyle(document.getElementById('f01-save')).fontSize,
      saveH: document.getElementById('f01-save').getBoundingClientRect().height,
      fieldH: document.getElementById('f01-name').closest('.m-field__control').getBoundingClientRect().height
    })""")
    page.evaluate("""() => {
      const sizes = [...document.querySelectorAll('body, body *')]
        .map(e => [e, parseFloat(getComputedStyle(e).fontSize)]);
      sizes.forEach(([e, s]) => e.style.fontSize = s * 2 + 'px');
    }""")
    after = page.evaluate("""() => ({
      body: getComputedStyle(document.body).fontSize,
      save: getComputedStyle(document.getElementById('f01-save')).fontSize,
      saveH: document.getElementById('f01-save').getBoundingClientRect().height,
      fieldH: document.getElementById('f01-name').closest('.m-field__control').getBoundingClientRect().height,
      overflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
      label: (() => {
        const R = document.getElementById('f01-edit').getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('#f01-name-field .m-field__label'));
        return [...range.getClientRects()].filter(x => x.width > 0)
          .every(x => x.left >= R.left - 1 && x.right <= R.right + 1);
      })()
    })""")
    A(r, "آلية 200%: مضاعفة محسوبة (16→32px)", before["body"] == "16px" and after["body"] == "32px",
      (before["body"], after["body"]))
    A(r, "زر الحفظ يتمدد عند 200%", after["saveH"] > before["saveH"], (before["saveH"], after["saveH"]))
    A(r, "حقل الاسم يتمدد عند 200%", after["fieldH"] > before["fieldH"], (before["fieldH"], after["fieldH"]))
    A(r, "لا خروج أفقي عند 200%", after["overflow"] is True)
    A(r, "حدود حروف التسمية داخل الحاوية عند 200%", after["label"] is True)
    save_click(page)
    s = insp(page)
    A(r, "الوظيفة محفوظة عند 200% (رسالة clean)", s["message"] and "لا تغييرات للحفظ" in s["message"]["text"])
    page.screenshot(path=str(OUT / "screenshots" / "f01-19-zoom200-390.png"))
    page.set_viewport_size({"width": 320, "height": 844})
    fresh(page)
    page.screenshot(path=str(OUT / "screenshots" / "f01-19-320.png"))
    page.set_viewport_size({"width": 430, "height": 844})
    fresh(page)
    page.screenshot(path=str(OUT / "screenshots" / "f01-19-430.png"))
    page.set_viewport_size({"width": 390, "height": 844})


def run_f01_20(page, browser):
    """reduced-motion ونص طويل عربي مختلط: الوظيفة محفوظة؛ النص والأرقام والاتجاه مقروءة."""
    r = row("F01-20", "reduced-motion + نص طويل عربي مختلط",
            "الوظيفة محفوظة بالحركة المخففة؛ النص المختلط والأرقام 0–9 مقروءة؛ لا قيم بصرية جديدة")
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    p = ctx.new_page()
    p.on("pageerror", lambda e: js_errors.append("reduced: " + str(e)))
    p.goto(f"{BASE}/{PAGE_PATH}")
    p.wait_for_load_state("networkidle")
    p.evaluate("() => document.fonts.ready")
    p.wait_for_function("() => window.F01Example && window.F01Example.inspect().op === 'idle'")
    p.click("#f01-edit-btn")
    p.wait_for_function("() => window.F01Example.inspect().views.edit === true")
    # حوار بالحركة المخففة: يفتح ويغلق فورًا وبلا فقد وظيفة
    p.fill("#f01-note", "حوار بالحركة المخففة")
    p.click("#f01-back")
    p.wait_for_function("() => window.F01Example.inspect().dialogOpen === true")
    s = insp(p)
    A(r, "الحوار يفتح بالحركة المخففة", s["dialogOpen"] is True)
    p.keyboard.press("Escape")
    p.wait_for_function("() => window.F01Example.inspect().dialogOpen === false")
    A(r, "Escape بقاء بالحركة المخففة", insp(p)["views"]["edit"] is True)
    # نص طويل مختلط بأرقام 0–9
    MIXED = "سجل تجريبي 2026 — Alpha Beta 123 تقرير الموردين والعمليات Gamma 456"
    p.fill("#f01-name", MIXED)
    no_h = p.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth + 1")
    A(r, "لا خروج أفقي مع النص المختلط", no_h)
    s = insp(p)
    A(r, "القيمة مقروءة كما كتبت", s["current"]["name"] == MIXED)
    A(r, "dirty مع النص المختلط", s["dirty"] is True)
    direction = p.evaluate("() => getComputedStyle(document.getElementById('f01-name')).direction")
    A(r, "اتجاه الحقل RTL", direction == "rtl", direction)
    save_click(p)
    wait_op(p, "saving")
    settle(p, "save")
    wait_op(p, "saved")
    s = insp(p)
    A(r, "دورة حفظ كاملة بالحركة المخففة", s["op"] == "saved")
    A(r, "المؤكد حدث بالنص المختلط", s["confirmed"]["name"] == MIXED)
    no_inline = p.evaluate("""() => {
      const roots = [document.getElementById('f01-edit'), document.getElementById('f01-read')];
      return roots.every(root => [...root.querySelectorAll('[style]')].every(el => {
        const st = el.getAttribute('style') || '';
        return !/color|background/i.test(st);
      }));
    }""")
    A(r, "لا قيم بصرية جديدة (لا ألوان inline)", no_inline is True)
    p.screenshot(path=str(OUT / "screenshots" / "f01-20-reduced-motion.png"))
    ctx.close()

def main():
    global BASE
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "screenshots").mkdir(exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    BASE = f"http://127.0.0.1:{server.server_address[1]}"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    log("# فحص قبول UX-F01 (F01-01..F01-20) — " + datetime.now().isoformat(timespec="seconds"))
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree}")
    log(f"# الصفحة: {BASE}/{PAGE_PATH}")
    log("")

    zoom_note = ("مضاعفة أحجام الخط المحسوبة لعناصر body وفروعها (آلية ui-release-check المعلنة) "
                 "— ليست native zoom جهاز/متصفح")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("pageerror", lambda e: js_errors.append(str(e)))
        page.goto(f"{BASE}/{PAGE_PATH}")
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        enter_edit(page)

        run_f01_01(page)
        run_f01_02(page)
        run_f01_03(page)
        run_f01_04(page)
        run_f01_05(page)
        run_f01_06(page)
        run_f01_07(page)
        run_f01_08(page)
        run_f01_09(page)
        run_f01_10(page)
        run_f01_11(page)
        run_f01_12(page)
        run_f01_13(page)
        run_f01_14(page)
        run_f01_15(page)
        run_f01_16(page)
        run_f01_17(page)
        run_f01_18(page)
        run_f01_19(page)
        run_f01_20(page, browser)

        browser.close()

    for r in rows:
        r["status"] = "PASS" if not r["failed"] else "FAIL"

    engine = {
        "browser": "Chromium (headless)",
        "driver": "Playwright (Python sync API)",
        "base_url": BASE,
        "page": PAGE_PATH,
        "viewport_default": "390x844",
    }
    try:
        from playwright._repo_version import version as pw_version
        engine["playwright_version"] = pw_version
    except Exception:
        engine["playwright_version"] = "runtime"

    verification = {
        "meta": {
            "title": "UX-F01 — مصفوفة قبول دورة النموذج (تحرير سجل تجريبي)",
            "status": "DRAFT FOR REVIEW",
            "date": datetime.now().isoformat(timespec="seconds"),
            "source_commit": commit,
            "source_tree": tree,
            "engine": engine,
            "command": "python3 tools/ux-f01-check.py",
            "zoom_mechanism": zoom_note,
            "reduced_motion_mechanism": "Playwright reduced_motion='reduce' (تفضيل حقيقي مُحاكى على مستوى السياق)",
            "announce_channel_decision": "رسالة B06 ثابتة واحدة role=status (#f01-op-note) بلا MicroMessages.announce لنصها ولا منطقة حية ثانية",
            "js_errors": js_errors,
        },
        "rows": [{k: r[k] for k in ("id", "path", "expected", "measured", "status")} for r in rows],
        "not_run": [
            {"item": "WebKit (browser engine آخر)", "reason": "غير منفذ في بيئة التنفيذ — لم يُنفذ فعليًا"},
            {"item": "أجهزة Android/iPhone حقيقية + TalkBack/VoiceOver", "reason": "لا جهاز أو أداة قارئ شاشة في البيئة — لم تُنفذ"},
            {"item": "native zoom للنظام/المتصفح", "reason": "الفحص المنفذ محاكاة CSS 200% معلنة الآلية فقط"},
            {"item": "لمس حقيقي ولوحة مفاتيح نظام وsafe areas فعلية", "reason": "بيئة headless — لم تُنفذ"},
        ],
        "limits": [
            "فحوص DOM ولوحة مفاتيح محاكاة لا تثبت سلوك قارئ شاشة فعلي",
            "الصور أدلة شكل فقط — العدادات والقيم والتركيز هي أدلة السلوك",
            "نتائج فحص عائلات UI القديمة لا تُنقل إلى F01",
        ],
    }
    (OUT / "verification.json").write_text(
        json.dumps(verification, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    passed = sum(1 for r in rows if r["status"] == "PASS")
    log("")
    log(f"# النتيجة: {passed}/{len(rows)} مسارًا PASS")
    for r in rows:
        log(f"  {r['status']:4} {r['id']}")
    if js_errors:
        log("# أخطاء JavaScript: " + "; ".join(js_errors[:5]))
    log(f"# التقرير المفصل: {OUT / 'verification.json'}")
    (OUT / "verification.txt").write_text("\n".join(log_lines) + "\n", encoding="utf-8")

    if passed != len(rows) or js_errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
