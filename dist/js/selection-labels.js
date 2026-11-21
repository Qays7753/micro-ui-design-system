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
    window.MicroLabels["selection"] = {
      "k1": "المحدد: ",
      "k2": "المحدد: لا شيء",
      "k3": "إعادة المحاولة",
      "k4": "لم تُحمّل الخيارات بعد.",
      "k5": "جارٍ تحميل الخيارات…",
      "k6": "لا خيارات متاحة.",
      "k7": "تعذّر تحميل الخيارات. أعد المحاولة.",
      "k8": "الاختيار غير متاح حاليًا.",
      "k9": "لا نتائج مطابقة. عدّل كلمة البحث."
    };
  })();
})();
