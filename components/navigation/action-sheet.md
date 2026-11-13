# C05 — قائمة إجراءات للهاتف

تركيب Draft فوق Navigation وB01، دون عائلة إضافية أو محرك طبقات آخر. لا قائمة سطح مكتب أو hover أو ARIA menu. المكوّن modal `dialog` بأزرار HTML عادية؛ يدعم Tab وEnter/Space وإغلاق Escape لمستخدمي لوحة مفاتيح الهاتف/الإتاحة.

## المصدر والتحميل

الخطوط وtokens وmotion، ثم buttons.css وnavigation.css وaction-sheet.css؛ navigation.js قبل action-sheet.js. لا حاجة إلى buttons.js للأوامر العادية. [مثالا الصف والبطاقة](../../previews/mobile-capabilities/actions.html) يستخدمان القائمة نفسها بسياقين. لا تُنقل actions.js الخاصة بالمعاينة إلى التطبيق.

```html
<div class="m-layer-backdrop" id="actions-backdrop" data-for="actions" hidden></div>
<div class="m-layer m-action-sheet" id="actions" data-backdrop-id="actions-backdrop"
     role="dialog" aria-modal="true" aria-labelledby="actions-heading" hidden>
  <header class="m-layer__head">
    <h2 class="m-layer__title" id="actions-heading">الإجراءات</h2>
    <button type="button" class="m-btn m-btn--secondary" data-layer-close>إلغاء</button>
  </header>
  <div class="m-layer__body">
    <ul class="m-action-sheet__list">
      <li><button type="button" class="m-btn m-btn--secondary m-action-sheet__item"
                  data-action-id="inspect">عرض التفاصيل</button></li>
    </ul>
  </div>
</div>
```

المستهلك يكتب الأوامر وتسمياتها ومعرّفاتها وحالاتها. `disabled` أو `aria-disabled="true"` يمنعان تنفيذ الأمر. المعرّف نص غير فارغ؛ استخدم معرّفًا ثابتًا فريدًا لكل أمر في القائمة. الحالة الفارغة نص واضح من المستهلك مع إلغاء ظاهر؛ لا أمر وهمي. التسميات تلتف، ولا تُقص لتصغير أهداف48. يستعمل الحذف `m-btn--destructive-soft` الموجود، دون لوحة ألوان جديدة. الروابط الملاحية، إن أضيفت خارج أوامر buttons، تبقى HTML ومسؤولية تنسيق انتقالها عند المستهلك؛ لا routing داخل المكوّن.

## API والملكية

- `MicroActionSheet.init(root?)`: الجذر المطابق وأبناؤه، آمن عند التكرار والنسخ بعد تحديث IDs/ARIA/backdrop. auto-init عند تحميل الصفحة.
- `open(sheet,{trigger?,contextKey?})`: true عند قبول عنصر DIV متصل بالمستند وبنية m-layer/m-action-sheet، false للعنصر غير الصالح. `contextKey` نص اختياري معتم من المستهلك أو null؛ لا كائن بيانات أو افتراض لمعرف طلب. الفتح يعيد تعيين الطلب المعلق والسياق.
- `close(sheet)`: أمر إغلاق صريح عبر Navigation، لا طلب dismissal ولا تنفيذ أمر.
- `disconnect(root?)`: يوقف المستمعات والطلب المعلق وينظف Navigation للطبقة وغشائها المخصص. يُستدعى قبل الإزالة. إعادة init تنشئ lifetime جديدًا؛ لا تعتمد سمات ready المنسوخة دليلًا على الربط.
- `micro-actions:request`: حدث bubbles غير قابل للإلغاء، detail نسخة `{id,contextKey}`. يصدر **مرة بعد اكتمال closed واستعادة التركيز**؛ المكتبة لا تنفذ الأمر أصلًا. يستقبل المستهلك النية ويقرر الصلاحيات والتأكيد والخدمة.

الضغط على أمر يطلب الإغلاق عبر `requestClose` بسبب programmatic-request. إذا رُفض الطلب لا يغلق ولا يرسل أمرًا؛ المحاولة التالية يمكن قبولها. لا Promise داخل dispatch. إعادة الفتح أو disconnect أثناء الخفوت يلغي الطلب القديم. Escape والخلفية وإلغاء لا ترسل أمرًا. تعمد الإغلاق البرمجي لا ينشئ نية إجراء جديدة.

لكل قائمة غشاء مخصص. **MicroActionSheet يملك lifetime هذا التركيب، وNavigation يملك حالة الطبقة**؛ استعمل disconnect الخاص بالتركيب، ولا تفصل Navigation وحده ثم تفترض بقاء التركيب مهيأ. لا تربط HTML dialog أو محرك آخر بالجذر نفسه. إذا أردت فتح نموذج/تأكيد عند الأمر، افعل ذلك من micro-actions:request بعد الإغلاق، دون تكديس مالكين للتركيز.

البيانات/الصلاحيات/الحفظ والحذف عند المستهلك. لا UA/URL/History أو شبكة أو سحب أو نسخة ديسكتوب. [بوابة الهاتف](../../tools/mobile-capabilities-check.py) تغطي الحركة العادية والمخففة، التركيز، التكرار، الرفض، النسخ والتنظيف.

إشعار micro-actions:request يُجدول في microtask بعد انتهاء مستمعات closed، في الحركتين العادية والمخففة. يُفحص lifetime والسياق المعلق مجددًا قبل إرساله. أبقِ تركيب القائمة حيًا حتى تستقبل النية؛ تنظيفه أو إعادة فتحه في closed يلغيها عمدًا. لا تنظفه في closed ثم تنتظر منه حدث الإجراء لاحقًا.
