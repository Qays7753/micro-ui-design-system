# استهلاك التراكيب المشتركة — C01/C02/C03

ثلاث وصفات **HTML/CSS منفذة بحالة Draft للمراجعة**، فوق العائلات الحالية. الكتالوج يدرجها في compositions؛ لا تزيد عدد العائلات14 أو المتغيرات6، ولا تضيف Micro* API أو framework. [المعاينات](../previews/compositions/index.html) ليست شاشات منتج. [العقود](COMPOSITION-CONTRACTS.md) و[SOP](COMPONENT-CONSUMPTION.md) مكملان لهذا الدليل.

CSS وبنية DOM الدلالية جزء من المكوّن. صفحات المعاينة ومتحكمها لا تنتقل إلى المنتج. عند اختيار إطار المضيف لاحقًا يُعرّف markup مرة في غلاف مشترك ثم تمرر الصفحات البيانات والأفعال؛ لا نسخ CSS لكل شاشة أو نقل controller الأمثلة.

## مصدر واحد والتحميل

حمّل الخطوط وtokens مرة، وCSS العائلة قبل امتداد التركيب. الأصول وJavaScript للأجزاء المستخدمة فعلًا فقط. لا يلزم CSS أو JS من previews، ولا ملف row-composition.css القديم.

| العقد | مصدر التركيب | أساس CSS | اعتماد اختياري |
|---|---|---|---|
| C01 | [value-context.css](../components/info-strip/value-context.css) | info-strip.css | organization للشارة، buttons للإجراء، messages إن استعملت رسالة. |
| C02 | [operational-row.css](../components/organization/operational-row.css) | organization.css | buttons للأفعال، messages للفراغ/الفشل. |
| C03 | [form-surface.css](../components/compositions/form-surface.css) | fields.css وbuttons.css عند استخدام عناصرهما | messages للحالة، selection للاختيار، Navigation فقط إذا اختير مالك طبقة مستقل. carrier الحوار الأصلي لا يحتاج Navigation. |

لا JavaScript خاص بالتراكيب الثلاثة. النصوص والحالات والبيانات للمستهلك. init/sync/disconnect للأبناء عبر [واجهاتهم الحالية](COMPONENT-API-CONTRACTS.md)؛ لا توفر الوصفة تنظيفًا شاملًا تلقائيًا.

## C01 — قراءة قيمة بسياق

الجذر Info Card نفسها: `.m-info-card.m-info-card--context`، مع compact أو featured عند وجود سبب. لا بطاقة رقم موازية أو محلل مال.

```html
<article class="m-info-card m-info-card--compact m-info-card--context">
  <div class="m-info-card__heading">
    <span class="m-info-card__label">قراءة يقدمها المستهلك</span>
    <span class="m-badge m-badge--info">حالة معلنة</span>
  </div>
  <p class="m-info-card__context">الفترة أو المصدر</p>
  <span class="m-info-card__reading">
    <bdi class="m-info-card__number" dir="ltr">−1,250.750</bdi>
    <span class="m-info-card__unit">د.أ</span>
  </span>
  <div class="m-info-card__meta">
    <span class="m-info-card__qualifier">قراءة أولية</span>
  </div>
  <div class="m-info-card__footer">
    <p class="m-info-card__note">توضيح المصدر</p>
    <a class="m-btn m-btn--secondary" href="#source">مصدر القراءة</a>
  </div>
</article>
```

التسمية والقراءة أساس، وcontext لازم إذا لم تُفهم القراءة بدونه. الشارة والمؤهل والملاحظة والإجراء اختيارية؛ احذف الخانات غير المستخدمة أو أخفها بـhidden دون بديل وهمي. القيمة المفقودة ليست0؛ المصدر يضع وصفًا صريحًا مع reading--unavailable. الرقم معزول داخل bdi، والوحدة العربية خارجه. لا parse أو تقريب أو تحويل إشارة/عملة أو حساب نسبة.

التحديث في source DOM الذي يملكه المستهلك؛ لا init أو event للبطاقة الساكنة. انتظار التحديث عبر aria-busy مع عبارة صريحة إذا بقيت قراءة سابقة. الفشل لا يعيد القيمة إلى0 ولا يختلق نجاحًا. featured يستعمل التوكنز القائمة؛ الإجراء secondary ذو أرضية أنسب إن أُضيف على السطح البارز.

[المثال](../previews/compositions/summary-example.html): سياق عدد طلبات وسياق مبلغ نصي بدقة وإشارة، مع0/مفقود/موقع/طويل/انتظار/فشل. الأرقام كما في مصدر العينة؛ لا استنتاج لرصيد/ربح، والنسب عند معنى يحتاجها فقط.

## C02 — صف وقائمة تشغيلية

الجذر `.m-row.m-row--operational`. القراءة تأخذ سطرها قبل الحالة والأفعال. `.m-operational-list` على ul/ol بعناصر li حقيقية، أو list/listitem دلالية؛ فواصل هادئة دون بطاقة وظل لكل صف.

```html
<ul class="m-operational-list" role="list" aria-label="عناصر المصدر">
  <li class="m-row m-row--operational">
    <div class="m-row__text">
      <a class="m-row__primary" href="#record">
        <span class="m-row__text">
          <span class="m-row__title">اسم العنصر</span>
          <span class="m-row__subtitle">سياق اختياري</span>
        </span>
      </a>
      <span class="m-row__reading">
        <bdi class="m-row__value" dir="ltr">0</bdi><span>وحدة</span>
      </span>
    </div>
    <span class="m-badge">حالة المصدر</span>
    <span class="m-row__action">
      <button class="m-btn m-btn--secondary" type="button">إجراء مستقل</button>
    </span>
  </li>
</ul>
```

- الصف الساكن لا يتظاهر بزر. الوجهة الواحدة يمكن أن تكون a.m-row؛ الأفعال المتعددة روابط وأزرار أشقاء دون هدف متداخل أو مستمع يعيد تمرير كل نقرة للصف.
- reading للقيمة والوحدة، وmeta لتاريخ أو سياق اختياري من المصدر. لا توليد تاريخ/حالة أو record store أو sorting أو pagination.
- details.m-row__details وsummary.m-row__primary يعطيان إفصاحًا أصليًا. الجسم m-row__disclosure خارج summary؛ أفعاله لا تطوي التفاصيل. المتصفح يملك expanded ودورة المفاتيح دون JS أو aria-expanded يدوي ينافسه. IDs وaria-controls، عند استعمالهما، فريدة عند المستهلك.
- empty حالة Messages/نص خارج القائمة، لا صف برقم0. الانتظار والفشل قد يبقيان الصفوف السابقة مع وصف واضح. hidden محترم. لا تعطيل شامل للأفعال دون سبب مصدر.
- الالتفاف يحفظ القراءة وأهداف48px دون ارتفاع ثابت أو قص رقم أو تصغير خط. CSS الوصفة القديمة في previews أصبح مدخلًا يستورد المصدر فقط، وتستهلك الأمثلة المصدر مباشرة.

[المثال](../previews/compositions/row-example.html): قائمة استلام وقائمة مواد، صف ساكن ورابط وجهة واحدة وأفعال أشقاء وإفصاح،0 وقيمة طويلة وفراغ/انتظار/فشل؛ لا مسارات Micro.

## C03 — سطح نموذج قابل للتحكم

`.m-form-surface` على form ثم head/title/description/body/feedback/actions. labels وhint/error فريدة ومربوطة، ونوع button صريح. الأطفال من Fields/Buttons/Messages، دون Access Gateway مستنسخة أو form engine جديد.

```html
<form class="m-form-surface" aria-labelledby="form-title" novalidate>
  <header class="m-form-surface__head">
    <h2 class="m-form-surface__title" id="form-title">عنوان المستهلك</h2>
    <p class="m-form-surface__description">سياق النموذج</p>
  </header>
  <div class="m-form-surface__body">
    <!-- حقول ورسائل العائلات بعقودها، دون CSS خاص بكل شاشة -->
  </div>
  <footer class="m-form-surface__actions">
    <button class="m-btn m-btn--primary" type="submit">إجراء المستهلك</button>
    <button class="m-btn m-btn--secondary" type="button">إغلاق</button>
  </footer>
</form>
```

novalidate في هذا المثال يعني أن المستهلك يقدم واجهة التحقق ورسائلها؛ ليس إذنًا بإرسال مدخل غير صالح. اختيار تحقق المتصفح بديل يحدده المضيف صراحة. لا parser مال أو validation عام مفروض.

| المسؤولية | المالك |
|---|---|
| raw/committed/validity/dirty والنتيجة والحفظ والأخطاء | المستهلك؛ لا توجد هذه الحالة في CSS المصدر. |
| clear/step/count/sync وتحميل Button | العائلة نفسها؛ prefill يتبعه sync الصامت. quantity يحتفظ بتطبيعه المقصود. |
| aria-busy ومنع الإرسال المكرر ورد نتيجة قديمة | المستهلك؛ undefined/false أو اكتمال callback ليست نجاحًا. |
| التركيز وmodal inert/scroll والإغلاق | مالك طبقة واحد، أو المتصفح مع مستهلك native dialog في المثال. |
| تنظيف مستمعي المستهلك وإيقاف UI المتأخر وإلغاء الشبكة | المستهلك، مع تنظيف أطفال العائلات التي هيأها؛ الوصفة لا تلغي خدمة. |

### carrier حوار HTML الأصلي

`.m-form-dialog` على dialog يوفّر قياسًا وسطحًا بالتوكنز وغشاء Petrol40% مماثلًا لغشاء Navigation القائم. showModal/close/cancel واجهات **المتصفح**، لا Micro* API جديدة. لا تربط MicroNavigation إلى العنصر نفسه. Native dialog يملك التركيز وinert، ومستهلك المثال يملك قفل التمرير وإعادته. إذا اختيرت طبقة Navigation لاحقًا، توضع form-surface داخلها دون carrier native؛ حراسة إغلاقها تحتاج عقد المالك الموافق عليه.

المثال يستعمل native cancel وباب الإغلاق والخلفية لسياسة dirty/pending محلية. dirty يحسب raw حتى إن كان غير صالح. التنظيف إجباري أثناء pending، ولا تكتب Promise قديمة في UI بعده. لا History أو URL أو storage. **لم يُنفذ D01 أو يُغير closeLayer**؛ مصدر Navigation وواجهاته بلا تغيير.

[المثال](../previews/compositions/form-example.html): نموذج inline وآخر داخل dialog بقواعد تحقق مختلفة معلنة. Promise محلية تُحل/تُرفض من أدوات صريحة، ومنها أدوات داخل الحوار لتبقى قابلة للاستعمال أثناء modality. لا timer نجاح أو خدمة. `CompositionPreview` في previews أدوات مستهلك/اختبار فقط، ليست حزمة منتج. يغطي prefill الصامت، callbacks دون مضاعفة، invalid raw، الرفض/الحياد، الرد المتأخر والإغلاق.

## حدود النضج والتحقق

التراكيب Draft ولا تغير نضج العائلات أو المتغيرات القائمة. الأساس360×780 RTL Light، و320 لأفعال الصف الطويل فقط، وLTR حيث يؤثر الاتجاه. `tools/composition-recipes-check.py` يختبر المصدر دون CSS المعاينة أيضًا؛ إثبات استقلال محدود، وليس حاضنات المضيف الأوسع للمرحلة5. لا Dark أو zoom أو ادعاء اختبار جهاز/قارئ شاشة حقيقي.
