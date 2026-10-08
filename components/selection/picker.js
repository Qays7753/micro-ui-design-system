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
   - R2-03 حالة قراءة موحدة متخزنة لكل منتقي:
     ready | loading | error | empty (MicroPicker.setStatus).
     غير ready: الخيارات القديمة مخفية وغير قابلة للاختيار، والبحث
     لا يزيلها ولا يلغي الحالة (صف الحالة ثابت حتى نهاية الاستعلام)،
     وready يعيد عرضها وفق الاستعلام الحالي. صف «لا نتائج مطابقة»
     نتيجة تصفية بحث فقط ولا يغيّر حالة القراءة المتخزنة.
   - R2-03 setOptions: استبدال البيانات يحافظ على اختيار صالح
     (بنفس data-value) أو يمسحه — والملخص والقيمة يتحدّثان معًا،
     ويُطلق micro-picker:change بقيمة null إذا سقط الاختيار السابق؛
     فلا يبقى «المحدد: X» بينما getSelected() يرجع null.
   - R2-03 تنقل بtabIndex متنقل: نقطة التبويب تتبع العنصر الحالي
     (بعد الأسهم) أو المحدد — لا أول خيار دائمًا.
   - الحالات: MicroPicker.setStatus(picker, 'ready'|'loading'|'error'|'empty', msg)
     — error يعرض رسالة + زر إعادة محاولة يطلق حدث micro-picker:retry؛
     البيانات والشبكة من المستهلك.
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

  /* R2-03: حالة القراءة المتخزنة لكل منتقي (WeakMap لا سمات على DOM) */
  var pickerState = new WeakMap();

  function stateOf(picker) {
    var s = pickerState.get(picker);
    if (!s) { s = { status: 'ready', query: '' }; pickerState.set(picker, s); }
    return s;
  }

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

  /* R2-03: tabIndex متنقل — نقطة التبويب تتبع العنصر الحالي أو المحدد */
  function setRoving(picker, active) {
    var opts = optionsOf(picker).filter(function (o) { return !o.hidden; });
    if (!opts.length) return;
    var chosen = (active && opts.indexOf(active) >= 0) ? active
      : opts.filter(function (o) { return o.getAttribute('aria-selected') === 'true'; })[0]
      || opts[0];
    opts.forEach(function (o) { o.tabIndex = (o === chosen) ? 0 : -1; });
  }

  /* R2-03: تطبيق الحالة المتخزنة + الاستعلام الحالي على الخيارات */
  function applyState(picker) {
    var s = stateOf(picker);
    var opts = optionsOf(picker);
    if (s.status !== 'ready') {
      /* حالة قراءة غير جاهزة: لا بيانات قديمة ظاهرة أو قابلة للاختيار —
         والبحث لا يلغي الحالة ولا يزيل صفها */
      opts.forEach(function (o) { o.hidden = true; });
      setRoving(picker, null);
      return;
    }
    opts.forEach(function (o) { o.hidden = s.query !== '' && o.textContent.indexOf(s.query) === -1; });
    var visible = opts.filter(function (o) { return !o.hidden; });
    /* لا نتائج من البحث: صف حالة صريح — ومسح الاستعلام يعيد كل شيء.
       هذا صف تصفية فقط: الحالة المتخزنة تبقى ready. */
    if (s.query !== '' && !visible.length && opts.length) {
      stateRow(picker, 'empty', 'لا نتائج مطابقة — جرّب اسمًا آخر');
    } else {
      stateRow(picker, 'ready');
    }
    setRoving(picker, null);
  }

  function select(picker, opt) {
    optionsOf(picker).forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
    opt.setAttribute('aria-selected', 'true');
    setSummary(picker);
    setRoving(picker, opt);
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
        var s = stateOf(picker);
        s.query = search.value.trim();
        applyState(picker); /* R2-03: البحث لا يلغي حالة القراءة المتخزنة */
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
        if (next) { e.preventDefault(); next.focus(); setRoving(picker, next); } /* R2-03: نقطة التبويب تتبع الحالي */
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
    syncRovingInit(picker);
  }

  function syncRovingInit(picker) { setRoving(picker, null); }

  window.MicroPicker = {
    /* W2.5 (A2-F08): init(root) يعالج الجذر نفسه إن طابق [data-micro-picker]
       ثم الأبناء — عقد init الموحد للعائلات. */
    init: function (root) {
      var scope = root || document;
      var pickers = [].slice.call(scope.querySelectorAll('[data-micro-picker]'));
      if (scope.nodeType === 1 && scope.matches('[data-micro-picker]')) pickers.unshift(scope);
      pickers.forEach(bindPicker);
    },
    /* بيانات المستهلك — بناء بعُقد DOM (التسمية نص حرفي دائمًا).
       R2-03: استبدال البيانات يحافظ على اختيار صالح أو يمسحه،
       والملخص والقيمة يتحدثان معًا، وإسقاط الاختيار يعلن نفسه. */
    setOptions: function (picker, items) {
      var list = listEl(picker);
      if (!list) return;
      var prev = window.MicroPicker.getSelected(picker); /* {value,label} أو null */
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
      var s = stateOf(picker);
      s.status = 'ready'; /* بيانات جديدة = قراءة جديدة سليمة */
      var kept = null;
      if (prev) {
        kept = optionsOf(picker).filter(function (o) { return o.getAttribute('data-value') === prev.value; })[0] || null;
      }
      if (kept) kept.setAttribute('aria-selected', 'true');
      setSummary(picker); /* الملخص يطابق getSelected دائمًا */
      applyState(picker);
      if (prev && !kept) {
        picker.dispatchEvent(new CustomEvent('micro-picker:change', {
          bubbles: true, detail: { value: null, label: null }
        }));
      }
    },
    /* R2-03: حالة قراءة موحدة متخزنة — غير ready تخفي الخيارات القديمة
       وتمنع اختيارها، والبحث لا يلغيها، وready يعيدها وفق الاستعلام. */
    setStatus: function (picker, kind, message) {
      var s = stateOf(picker);
      if (['ready', 'loading', 'error', 'empty'].indexOf(kind) < 0) return;
      s.status = kind;
      if (kind === 'ready') {
        stateRow(picker, 'ready');
        applyState(picker);
        return;
      }
      applyState(picker); /* يخفي الخيارات ويثبت نقطة تبويب آمنة */
      var msgs = {
        loading: message || 'جارٍ القراءة…',
        error: message || 'تعذر القراءة',
        empty: message || 'لا نتائج'
      };
      stateRow(picker, kind, msgs[kind] || message || '');
    },
    clearSelection: function (picker) {
      optionsOf(picker).forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
      setSummary(picker);
      setRoving(picker, null);
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
