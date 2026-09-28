/* =========================================================
   Micro UI — منتقي كيان قابل للبحث (جزء من B03)
   الملف: components/selection/picker.js
   عقد عام واحد (E04 — مستخرج من اللوحة إلى المصدر):
   التهيئة: MicroPicker.init(root) — أو تلقائيًا عند التحميل.
   الترميز:
   <div class="m-picker" data-micro-picker>
     <div class="m-picker__head">
       <span class="m-picker__title" id="…">اختيار المورد</span>
       <button … data-picker-close>إغلاق</button>
     </div>
     <input class="m-picker__input" type="search" data-picker-search aria-label="بحث">
     <div class="m-picker__list" role="listbox" aria-label="النتائج" data-picker-list>
       <button type="button" class="m-picker__option" role="option"
               aria-selected="false" data-value="a">تسمية</button> …
     </div>
     <p class="m-picker__foot" data-picker-summary>المحدد: لا شيء</p>
   </div>

   العقد:
   - البحث: input[data-picker-search] يصفّي الخيارات بالسمة hidden
     (CSS يغلبها على display:flex) — مسح الاستعلام يعيد كل الخيارات
     فورًا، وعدم وجود نتائج يظهر صف حالة صريحًا ولا يترك نتائج عالقة.
   - الحالات: MicroPicker.setStatus(picker, 'ready'|'loading'|'error'|'empty', msg)
     — ready يعيد عرض الخيارات؛ error يعرض رسالة + زر إعادة محاولة
     يطلق حدث micro-picker:retry؛ البيانات والشبكة من المستهلك.
   - البيانات: MicroPicker.setOptions(picker, [{value,label}]) —
     بناء بعُقد DOM وtextContent (التسميات نص حرفي).
   - الاختيار والمسح: نقر أو Enter/Space على خيار → aria-selected
     وحده + حدث micro-picker:change {value,label} + تحديث
     [data-picker-summary] إن وجد. MicroPicker.clearSelection(picker)
     ومسح الاختيار من زر المستهلك. الأسهم (RTL) وHome/End بين
     الخيارات الظاهرة.
   - الإغلاق: [data-picker-close] يطلق micro-picker:close — وإذا كان
     المنتقي داخل .m-layer أُغلق عبر MicroNavigation (طبقة B07
     المصححة) بلا مسارين.
   لا شبكة ولا بيانات داخل المكوّن — اللوحة/المستهلك يزوّد الحالة.
   ========================================================= */

(function () {
  'use strict';

  function pickerOf(el) { return el.closest('[data-micro-picker]'); }

  function optionsOf(picker) {
    return [].slice.call(picker.querySelectorAll('[data-picker-list] .m-picker__option'));
  }

  function listEl(picker) { return picker.querySelector('[data-picker-list]'); }

  function setSummary(picker) {
    var foot = picker.querySelector('[data-picker-summary]');
    if (!foot) return;
    var sel = optionsOf(picker).filter(function (o) { return o.getAttribute('aria-selected') === 'true'; })[0];
    foot.textContent = sel ? 'المحدد: ' + sel.textContent.trim() : 'المحدد: لا شيء';
  }

  function syncTabindex(picker) {
    var opts = optionsOf(picker).filter(function (o) { return !o.hidden; });
    opts.forEach(function (o, i) { o.tabIndex = i === 0 ? 0 : -1; });
  }

  function select(picker, opt) {
    optionsOf(picker).forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
    opt.setAttribute('aria-selected', 'true');
    setSummary(picker);
    picker.dispatchEvent(new CustomEvent('micro-picker:change', {
      bubbles: true, detail: { value: opt.getAttribute('data-value'), label: opt.textContent.trim() }
    }));
  }

  /* صف حالة القراءة داخل القائمة — عنصر واحد يضاف/يحذف (لا innerHTML) */
  function stateRow(picker, kind, message) {
    var list = listEl(picker);
    var row = list.querySelector('.m-picker__state');
    if (kind === 'ready') { if (row) row.remove(); return; }
    if (!row) {
      row = document.createElement('div');
      row.className = 'm-picker__state';
      list.insertBefore(row, list.firstChild);
    }
    row.className = 'm-picker__state' + (kind === 'error' ? ' m-picker__state--error' : '');
    row.textContent = '';
    row.appendChild(document.createTextNode(message));
    if (kind === 'error') {
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'm-btn m-btn--secondary';
      retry.setAttribute('data-picker-retry', '');
      retry.textContent = 'إعادة المحاولة';
      retry.addEventListener('click', function () {
        picker.dispatchEvent(new CustomEvent('micro-picker:retry', { bubbles: true }));
      });
      row.appendChild(retry);
    }
  }

  function bindPicker(picker) {
    if (picker.dataset.microPickerBound) return;
    picker.dataset.microPickerBound = '1';

    var search = picker.querySelector('[data-picker-search]');
    if (search) {
      search.addEventListener('input', function () {
        var q = search.value.trim();
        var opts = optionsOf(picker);
        opts.forEach(function (o) { o.hidden = q !== '' && o.textContent.indexOf(q) === -1; });
        var visible = opts.filter(function (o) { return !o.hidden; });
        /* لا نتائج من البحث: صف حالة صريح — ومسح الاستعلام يعيد كل شيء */
        if (q !== '' && !visible.length && opts.length) {
          stateRow(picker, 'empty', 'لا نتائج مطابقة — جرّب اسمًا آخر');
        } else {
          stateRow(picker, 'ready');
        }
        syncTabindex(picker);
      });
    }

    var list = listEl(picker);
    if (list) {
      list.addEventListener('click', function (e) {
        var opt = e.target.closest('.m-picker__option');
        if (opt && picker.contains(opt)) select(picker, opt);
      });
      /* تنقل أسهم RTL بين الخيارات الظاهرة + Home/End */
      list.addEventListener('keydown', function (e) {
        var opts = optionsOf(picker).filter(function (o) { return !o.hidden; });
        if (!opts.length) return;
        var i = opts.indexOf(document.activeElement);
        var next = null;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = opts[(i + 1 + opts.length) % opts.length];       /* RTL: يسار = التالي */
        else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = opts[(i - 1 + opts.length) % opts.length];
        else if (e.key === 'Home') next = opts[0];
        else if (e.key === 'End') next = opts[opts.length - 1];
        if (next) { e.preventDefault(); next.focus(); }
      });
    }

    /* الإغلاق: حدث واحد — وإن كان داخل طبقة B07 أُغلق عبر عقد الطبقة */
    var closeBtn = picker.querySelector('[data-picker-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        var layer = picker.closest('.m-layer');
        if (layer && window.MicroNavigation && window.MicroNavigation.closeLayer) {
          window.MicroNavigation.closeLayer(layer);
        }
        picker.dispatchEvent(new CustomEvent('micro-picker:close', { bubbles: true }));
      });
    }
    syncTabindex(picker);
  }

  window.MicroPicker = {
    init: function (root) {
      (root || document).querySelectorAll('[data-micro-picker]').forEach(bindPicker);
    },
    /* بيانات المستهلك — بناء بعُقد DOM (التسمية نص حرفي دائمًا) */
    setOptions: function (picker, items) {
      var list = listEl(picker);
      if (!list) return;
      stateRow(picker, 'ready');
      optionsOf(picker).forEach(function (o) { o.remove(); });
      (items || []).forEach(function (it) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'm-picker__option';
        b.setAttribute('role', 'option');
        b.setAttribute('aria-selected', 'false');
        b.setAttribute('data-value', it.value);
        b.textContent = it.label; /* نص حرفي — لا HTML */
        list.appendChild(b);
      });
      syncTabindex(picker);
    },
    setStatus: function (picker, kind, message) {
      var msgs = {
        loading: message || 'جارٍ القراءة…',
        error: message || 'تعذر القراءة',
        empty: message || 'لا نتائج'
      };
      if (kind === 'ready') { stateRow(picker, 'ready'); return; }
      stateRow(picker, kind, msgs[kind] || message || '');
    },
    clearSelection: function (picker) {
      optionsOf(picker).forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
      setSummary(picker);
      picker.dispatchEvent(new CustomEvent('micro-picker:change', {
        bubbles: true, detail: { value: null, label: null }
      }));
    },
    getSelected: function (picker) {
      var sel = optionsOf(picker).filter(function (o) { return o.getAttribute('aria-selected') === 'true'; })[0];
      return sel ? { value: sel.getAttribute('data-value'), label: sel.textContent.trim() } : null;
    }
  };

  document.addEventListener('DOMContentLoaded', function () { window.MicroPicker.init(); });
  if (document.readyState !== 'loading') window.MicroPicker.init();
})();
