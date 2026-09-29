/* =========================================================
   Micro UI — سلوك لوحة معاينة الحقول (B02) — محاكاة العرض فقط
   كل ما هنا عرض تجريبي خارج المكوّن: سياسة التحقق الفعلية
   (متى يظهر الخطأ والنجاح) وقراءة البحث من الشبكة قرار المستهلك.
   سلوك المكوّن نفسه في components/fields/fields.js.
   ========================================================= */

(function () {
  'use strict';

  /* ---- محاكاة قراءة البحث: نتائج / لا نتائج / فشل (بلا شبكة) ----
     انتظار قصير لعرض حالة الانتظار ثم نتيجة موسومة تجريبية. */
  var searchInput = document.getElementById('live-search');
  var searchMsg = document.querySelector('#live [data-field-msg]');
  var searchStatus = document.querySelector('[data-search-status]');

  function setSearchMsg(text, tone) {
    if (!searchMsg) return;
    if (!text) {
      searchMsg.hidden = true;
      searchMsg.textContent = '';
      searchMsg.classList.remove('is-visible');
      return;
    }
    searchMsg.hidden = false;
    searchMsg.textContent = text;
    searchMsg.classList.add('is-visible');
    /* الرسالة رسالة حالة قراءة لا خطأ إدخال — تلوينها موسوم تجريبي */
    searchMsg.style.color = tone === 'error' ? 'var(--micro-danger)' : 'var(--micro-text-secondary)';
  }

  document.querySelectorAll('[data-search-demo]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!searchInput || !searchStatus) return;
      var mode = btn.getAttribute('data-search-demo');
      var value = searchInput.value.trim();
      setSearchMsg('جارٍ البحث…');
      if (searchStatus) {
        searchStatus.hidden = true;
        searchStatus.setAttribute('data-tone', 'info');
        searchStatus.textContent = 'جارٍ البحث… (محاكاة)';
      }
      window.setTimeout(function () {
        if (mode === 'results') {
          setSearchMsg('عرض نتائج تجريبية — العرض الفعلي مسؤولية المستهلك');
          if (searchStatus) { searchStatus.setAttribute('data-tone', 'success'); searchStatus.textContent = 'نتائج (محاكاة)'; }
        } else if (mode === 'empty') {
          setSearchMsg('لا نتائج مطابقة — جرّب اسمًا آخر');
          if (searchStatus) { searchStatus.setAttribute('data-tone', 'info'); searchStatus.textContent = 'لا نتائج (محاكاة)'; }
        } else {
          setSearchMsg('تعذر قراءة النتائج — أعد المحاولة');
          if (searchStatus) { searchStatus.setAttribute('data-tone', 'error'); searchStatus.textContent = 'فشل قراءة (محاكاة)'; }
        }
        if (searchStatus) searchStatus.hidden = false;
      }, 900);
      if (!value) setSearchMsg('اكتب اسمًا للبحث أولًا');
    });
  });

  /* ---- خطأ عند الخروج (مثال سياسة مستهلك موسومة) ----
     القيمة لا تُمحى أبدًا؛ والكتابة تعفي الخطأ. */
  var amountField = document.getElementById('live-amount-field');
  var amountInput = document.getElementById('live-amount');
  if (amountField && amountInput) {
    var amountMsg = amountField.querySelector('[data-field-msg]');
    amountInput.addEventListener('blur', function () {
      var v = amountInput.value.trim();
      if (v === '') return; /* لا خطأ بمجرد فتح حقل فارغ */
      var numeric = v.replace(/,/g, '');
      if (isNaN(Number(numeric))) {
        amountField.classList.add('has-error');
        amountMsg.hidden = false;
        amountMsg.textContent = 'قيمة غير رقمية — صحّح المبلغ (القيمة كما كتبتها باقية)';
        amountMsg.classList.add('is-visible');
      }
    });
    amountInput.addEventListener('input', function () {
      if (amountField.classList.contains('has-error')) {
        amountField.classList.remove('has-error');
        amountMsg.hidden = true;
        amountMsg.classList.remove('is-visible');
      }
    });
  }
})();
