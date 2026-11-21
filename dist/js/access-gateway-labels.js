(() => {
  (function() {
    "use strict";
    window.MicroLabels = window.MicroLabels || {};
    if (!window.MicroLabels.locale) window.MicroLabels.locale = "ar-u-nu-latn";
    if (!window.MicroLabels.setLocale) {
      window.MicroLabels.setLocale = function(locale) {
        window.MicroLabels.locale = locale;
      };
    }
    if (!window.MicroLabels.formatNumber) {
      window.MicroLabels.formatNumber = function(value) {
        var locale = window.MicroLabels.locale || "ar-u-nu-latn";
        if (locale === "ar-u-nu-latn") return String(value);
        try {
          return new Intl.NumberFormat(locale).format(value);
        } catch (err) {
          return String(value);
        }
      };
    }
    window.MicroLabels["access-gateway"] = {
      "k1": "إظهار كلمة المرور",
      "k2": "انتهى طلب المساعدة دون تأكيد إرساله.",
      "k3": "تعذّر إرسال طلب المساعدة. أعد المحاولة.",
      "k4": "جارٍ الاتصال",
      "k5": "جارٍ الاتصال بمزود الدخول…",
      "k6": "تم الدخول بنجاح.",
      "k7": "لم يتم الدخول.",
      "k8": "انتهى الطلب دون نتيجة مؤكدة من التطبيق.",
      "k9": "تعذّر تنفيذ الدخول. أعد المحاولة.",
      "k10": "نموذج الدخول غير مكتمل. تواصل مع المسؤول إن تكرر ذلك.",
      "k11": "أدخل بريدًا إلكترونيًا صالحًا.",
      "k12": "أدخل كلمة المرور.",
      "k13": "أدخل كلمة مرور لا تقل عن ",
      "k14": " أحرف.",
      "k15": "تحقق من كلمة المرور المطلوبة.",
      "k16": "تحقق من البريد الإلكتروني وكلمة المرور المطلوبة.",
      "k17": "هذه نسخة عرض تجريبية: لن تُرسل بياناتك إلى أي خدمة.",
      "k18": "جارٍ تسجيل الدخول",
      "k19": "جارٍ التحقق من بيانات الدخول…",
      "k20": "تعذّر تسجيل الدخول. تحقق من بياناتك ثم أعد المحاولة."
    };
  })();
})();
