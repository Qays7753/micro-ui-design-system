/* =========================================================
   Micro UI — نصوص العائلة الافتراضية (access-gateway) — المرحلة 7 / الجولة الثانية R2.
   الملف: components/access-gateway/labels.js

   وحدة بيانات نصوص العائلة (الجولة الثانية R5): المفاتيح دلالية بموضعها، والقيم حرفية كما كانت (R-D15) —
   بدون تخصيص تبقى المخرجات متطابقة بايت-ببايت (D12). يسجلها ملف سلوك
   العائلة في سجل النصوص المشترك (shared/labels.js) عند الاستيراد، فلا
   يُحمَّل هذا الملف منفصلًا في الصفحات بعد الآن.

   التخصيص: <FamilyApi>.setLabels(partial) يدمج جزئيًا فوق هذه القيم،
   وsetLocale(locale) من مدخل labels يغيّر تنسيق الأرقام (الافتراضي
   'ar-u-nu-latn' — أرقام لاتينية بلا فواصل كما هو اليوم).
   ========================================================= */
export const defaults = {
  'passwordReveal.label': "إظهار كلمة المرور",
  'recovery.uncertain': "انتهى طلب المساعدة دون تأكيد إرساله.",
  'recovery.error': "تعذّر إرسال طلب المساعدة. أعد المحاولة.",
  'provider.connectingLabel': "جارٍ الاتصال",
  'provider.connectingMessage': "جارٍ الاتصال بمزود الدخول…",
  'provider.success': "تم الدخول بنجاح.",
  'provider.failure': "لم يتم الدخول.",
  'provider.uncertain': "انتهى الطلب دون نتيجة مؤكدة من التطبيق.",
  'provider.error': "تعذّر تنفيذ الدخول. أعد المحاولة.",
  'form.incomplete': "نموذج الدخول غير مكتمل. تواصل مع المسؤول إن تكرر ذلك.",
  'validation.email': "أدخل بريدًا إلكترونيًا صالحًا.",
  'validation.password': "أدخل كلمة المرور.",
  'validation.passwordMinLengthPrefix': "أدخل كلمة مرور لا تقل عن ",
  'validation.passwordMinLengthSuffix': " أحرف.",
  'validation.passwordRequired': "تحقق من كلمة المرور المطلوبة.",
  'validation.emailAndPasswordRequired': "تحقق من البريد الإلكتروني وكلمة المرور المطلوبة.",
  'demo.notice': "هذه نسخة عرض تجريبية: لن تُرسل بياناتك إلى أي خدمة.",
  'submit.loadingLabel': "جارٍ تسجيل الدخول",
  'submit.pendingMessage': "جارٍ التحقق من بيانات الدخول…",
  'submit.error': "تعذّر تسجيل الدخول. تحقق من بياناتك ثم أعد المحاولة.",
};
