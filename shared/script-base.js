/* =========================================================
   Micro UI — قاعدة مسار السكربت للأصول النسبية (الجولة الثانية R2).
   الملف: shared/script-base.js

   وحدات المكتبة تحتاج أحيانًا حل مسار أصل نسبيًا (أيقونات icons.js
   وشعار assistant.js). القاعدة:
   - في حزم ESM (dist/esm/*.js): import.meta.url — جزء من مواصفة الوحدات
     (يتطلب هدف بناء es2020؛ كل بيئة تشغّل ES modules تدعمه).
   - في ملفات IIFE المولدة (dist/iife/*.js): يضخ البناء banner يحسب
     document.currentScript.src ويخزنه في globalThis.__microIifeBaseUrl
     قبل تشغيل الحزمة، فتقرؤه هذه الدالة بدل import.meta (esbuild يفرغه
     في صيغة iife).
   المسارات في المصدر نسبية إلى موضع الحزمة النهائي (dist/esm|dist/iife،
   وكلاهما بالعمق نفسه حيث ../assets موجود) — لا أحد يستهلك ملفات
   المصدر مباشرة بعد الجولة الثانية (المستهلكون على dist/).
   الاستخدام كسول داخل الدوال: لا وصول DOM في المستوى الأعلى (R-D2).
   ========================================================= */

var cached = null;

export function scriptBase() {
  if (cached) return cached;
  if (typeof globalThis !== 'undefined' && globalThis.__microIifeBaseUrl) {
    cached = globalThis.__microIifeBaseUrl;
  } else {
    cached = import.meta.url;
  }
  return cached;
}
