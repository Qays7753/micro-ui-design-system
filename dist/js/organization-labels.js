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
    window.MicroLabels["organization"] = {
      "k1": "؟"
    };
  })();
})();
