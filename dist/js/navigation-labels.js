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
    window.MicroLabels["navigation"] = {
      "k1": "[micro-navigation] طبقة مفتوحة بلا اسم متاح (عقد D-UI-02): أضف aria-label أو aria-labelledby أو عنصر .m-layer__title — الطبقة modal بلا اسم غير صالحة.",
      "k2": '[micro-navigation] دور غير معتاد للطبقة "',
      "k3": '" — عقد الطبقات: dialog/alertdialog (D-UI-02).',
      "k4": "فلتر واحد",
      "k5": "فلتران",
      "k6": " فلاتر",
      "k7": " فلترًا",
      "k8": " فلتر",
      "k9": " فلتر واحد",
      "k10": " فلتران",
      "k11": ": لا فلاتر",
      "k12": "، ",
      "k13": "الجاري",
      "k14": "المطبّق"
    };
  })();
})();
