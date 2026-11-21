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
    window.MicroLabels["info-strip"] = {
      "k1": "اختيار البطاقة",
      "k2": "البطاقة ",
      "k3": " من ",
      "k4": "عرض البطاقة ",
      "k5": "البطاقة 1 من ",
      "k6": "لا توجد بطاقات.",
      "k7": "البطاقة ",
      "k8": " من ",
      "k9": "لا توجد بطاقات.",
      "k10": "اختيار البطاقة",
      "k11": "عرض البطاقة "
    };
  })();
})();
