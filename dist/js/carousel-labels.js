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
    window.MicroLabels["carousel"] = {
      "k1": "لا توجد بطاقات.",
      "k2": "بطاقة",
      "k3": "بطاقة ",
      "k4": "، البطاقة ",
      "k5": " من ",
      "k6": "البطاقة ",
      "k7": "الانتقال إلى البطاقة ",
      "k8": "عارض بطاقات"
    };
  })();
})();
