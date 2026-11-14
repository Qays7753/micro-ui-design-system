# C07–C12 — تراكيب سياق Micro للهاتف

ستة تراكيب Draft فوق العائلات الحالية، لا تطبيقات جديدة ولا backend. [جرد التغطية](../../docs/product-context/COVERAGE.md) و[المختبر](../../previews/product-context/index.html).

| العقد | type | الدلالة والمدخلات |
|---|---|---|
| C07 | context | هوية واحدة، contexts من المستهلك، scope حالي وdestinations مصرح بها؛ طلب switch-context ينتظر إقرارًا. |
| C08 | state | حالة عملية واتصال ومرجع، recheck/retry، وحفظ محلي صريح لـManage دون ادعاء مزامنة. |
| C09 | market | modes card/editor/search؛ عنوان/سعر/وحدة/صور/حالة/سبب، draft وحقول وفلاتر من المستهلك. |
| C10 | delivery | modes request/offer/tracking/change/proof؛ سعر/وحدة/نسخة/خط أحداث/موافقات وإثبات يحددها المستهلك. |
| C11 | assistant | messages نصية، draft، انتظار/retry، وproposal بمعرف ونسخة وتأكيد إلزامي. لا AI أو تفسير أمر من النص. |
| C12 | review | modes queue/report؛ عنصر/سبب/مرفقات مصرح بها/قرارات وقائمة تصنيف من المستهلك. لا صلاحية مالية افتراضية. |

## التحميل والاستعمال

fonts.css ثم tokens.css وmotion.css، ثم buttons/fields/messages/organization/navigation/action-sheet/carousel CSS المستخدمة، وproduct-context.css. حمّل fields.js ثم navigation.js ثم action-sheet.js وcarousel.js ثم product-core.js ثم ملف renderer المستخدم: context.js أوoperation.js أوmarket.js أوdelivery.js أوassistant.js أوreview.js. حملها مرة واحدة، وليس لكل صف.

```js
const scope = {contextId:'approved-context',workspaceId:'workspace',roleId:'role',kind:'business'};
const view = MicroProduct.mount(root, 'market', {
  scope, dataContext:scope, permissions:['view'], phase:'ready', connection:'online',
  destination:'market', mode:'card', id:'public-listing', title:'عنوان من المصدر',
  price:'150', unit:'د.أ', images:[]
});
root.addEventListener('micro-product:intent', event => {
  // المستهلك يتحقق خادميًا وينفذ، ثم يمرر النموذج المؤكد مع رمز الطلب نفسه.
  // view.resolve(event.detail.request, nextAuthorizedModel);
});
// view.replace(newAuthorizedModel);   // نموذج كامل، لا دمج صلاحيات من سياق سابق
// view.destroy();                    // قبل إزالة DOM
```

`mount(root,type,model)` يقبل جذر Element وrenderer محمّلًا. تكراره على النوع نفسه يرجع instance نفسها دون listeners إضافية؛ تغيير النوع يتطلب destroy. `replace` يزيد generation ويبطل كل طلب/تأكيد معلق. `resolve(token,nextModel)` يقبل الطلب المعلق نفسه فقط، ويرفض بعد destroy أو replace أو من instance/scope آخر. تغيير scope عبر resolve مسموح فقط لطلب switch-context وللنطاق المستهدف كاملًا؛ بقية تغييرات السياق أو الجلسة تأتي من replace موثوق. `getState` نسخة scope/phase/token، وليس مخزن بيانات حساب.

## السياق والصلاحيات والبيانات

- scope مفتاح contextId + workspaceId اختياري + roleId + kind، وليس اسم العرض. اختلاف الدور داخل Workspace نفسه سياق مختلف. `MicroProduct.contextKey(scope)` يوفر المفتاح المقارن؛ لا تعيد بناءه يدويًا.
- contextId/roleId نصوص غير فارغة، workspaceId نص غير فارغ أوnull؛ kind المصرح للسائق هوdriver. بقية الأدوار labels من المستهلك ولا تمنح صلاحيات تلقائية. لكل option نطاق فريد؛ لا اتحاد grants لمجرد أن الشخص مورد ومالك أيضًا.
- `permissions` قائمة أوامر صريحة لكل instance؛ غياب view يمنع عرض بياناتها. C09–C12 تتطلب أيضًا dataContext مطابقًا لنطاق طلب العرض الحالي. هذا ختم **سياق الاستجابة**، وليس ادعاء أن كل منتج عام مملوك للـWorkspace الحالي.
- في driver لا يعرض C07 Manage/Market حتى لو مررهما المستهلك، ولا تُعرض C09 أو queue مراجعة. report فرعي داخلDelivery ممكن فقط بgrant صريح. القائمة لا تمنح الوصول؛ التطبيق والخادم يملكان التفويض الحقيقي وفلترة البيانات قبل إرسالها للعميل.
- `micro-product:intent` يحمل `{type,action,scope,request,payload}`. لا شبكة أو storage أو قيد مالي أو grant أو تنفيذ AI. الـrequest نسخ instanceId/generation/requestId/contextKey؛ payload يتضمن القيم الخام وFile عند اختيار مرفقات.
- لا تفسّر إخفاء الواجهة كحماية backend. يجب أن يتحقق الخادم من scope والصلاحية ونسخة السجل وكل إجراء، ولا يرسل بيانات غير مسموحة أصلًا.

## حالات العملية والاتصال

phase: ready/loading/empty/success/error/rejected/disabled/pending/uncertain/denied/expired/signed-out/conflict/local-saved. الحالة غير المعروفة uncertain، وlocal-saved خارجManage تعامل uncertain، لا نجاح مفترض. connection: online/offline/weak/local؛ غير المعروفة منقطعة. source لا يكتشف الشبكة بنفسه.

الإجراء ينتقل إلى pending UI محليًا ويمنع التكرار، لكنه لا يعلن النجاح. success/local-saved يأتيان من نموذج يقدمه المستهلك صراحة. offline/weak/local تمنع طلبات الاتصال؛ save-local متاح فقط مع grant صريح وdestination=manage وسياق غير driver، ولا ينفذ تخزينًا. uncertain/conflict لا يسمحان إعادة mutation؛ recheck/reauth فقط حتى يقرر المصدر النتيجة. retry الصريح يحتاج idempotency وقرار إعادة التنفيذ عند المستهلك، ولا يُنفذ تلقائيًا.

عند scope جديد أو سجل id مختلف أو mode مختلف أو draftKey جديد أو سحب visibility كانت ممنوحة أو انتهاء/رفض جلسة أو سحب view تُمسح drafts وFile URLs، وتُلغى التأكيدات والطلبات القديمة. لا تنتقل الرسائل أو مسودة أو focus لحقل من سياق سابق. التحديث في السياق نفسه يحفظ النص وتركيزه؛ تحديث prefill لا يستبدل مسودة محررة تلقائيًا. clearDraft=true من المستهلك يمسحه بعد إقرار مناسب، ويمرر false أو يحذفه في النموذج التالي لأنه علم لذلك التحديث. أخطاء الحقول لا تمسح القيم.

## إجراءات حساسة ونسخ متغيرة

النشر/إرسال البلاغ النهائي/قبول أو رفض عرض/الإسناد/التعديل/الإثبات/قرارات المراجعة وexecute للمساعد تحتاج تأكيدًا عبر C05/Navigation الموجودين. لا مالك modal جديد. التأكيد يراجع label والسياق والبيانات الموصوفة، ثم يرسل النية بعد closed. replace أو تغيير السعر/النسخة أثناء التأكيد يبطله؛ لا ضغطة قديمة تعمل على عرض جديد. لا يُفسر كلام Ask كإجراء؛ execute يمرر proposalId/revision للاقتراح القديم، أو messageId/actionId/revision لإجراء داخل رسالة، مع grant وتأكيد.

المواقع والتواصل في Delivery مقيدة بvisibility.addresses/contact؛ الافتراضي مخفي. لا نفترض وقت كشفها. تفاصيل المقارنة الحرة يجب أن تكون منقحة قبل تمريرها. مرفقات المراجعة تتطلب view-evidence وvisibility.evidence. لا انتقال حالة توصيل أو أثر مالي في Manage عند قبول عرض أو إعلان.

## الأبعاد والحركة والوسائط

النص16/26، الثانوي13/20، العنوان18 وفق توكناته، القراءة22، الأزرار/اللمس48، الحقول52، أساس التباعد4 ثم8/12/16/24، السطحradius16 والتحكم12 من المصدر. لا توكن أو palette أو خط جديد. الصور4:3 بعرض الحاوية؛ card يمكنcover، والإثبات/review تحتوي الصورة كاملةcontain. سجل المحادثة بحد ارتفاع360px وتمرير داخلي، وفقاعات حتى88% من العرض. لا تصغير للنص لإخفاء الازدحام.

الحركة الحالية في B01/C05/Carousel تتبع motion وتقليل الحركة، ولا autoplay أو مؤثر كتابة AI مزيف أو 3D. سحب الصور من Carousel فقط مع أزرار السابق/التالي. لا swipe حساس. لا تغيير في الثيم Light-only.

الرفع هنا اختيار صور محلية ومعاينة فقط. `maxImageBytes` قيد اختياري يقدمه المستهلك، لا سياسة منتج جديدة؛ لا حد عدد مفترض أو ضغط/رفع أو إثبات هوية ملف خادمي. type/size/الصلاحية تُفحص مجددًا في backend. File URLs تُلغى عند الإزالة/تبديل السياق/destroy. الصور تحمل lazy/async؛ لا حقن HTML أو markdown أو scripts من رسالة/عنوان أو مستند.

## نماذج المجالات ونواياها

كل نموذج كامل يحوي scope وpermissions وphase/connection وdestination، وdataContext للبيانات C09–C12. الأسماء الآتية UI transport-neutral وليست schema خادم أو قرار صلاحيات. النصوص والأرقام format-ready من المستهلك؛ لا جمع أو تحويل عملة.

| type/mode | حقول الدلالة | الأوامر التي تتطلب grant بنفس الاسم |
|---|---|---|
| context | accountLabel، contexts[{scope,label,destinations}]، destination الحالية | switch-context{contextId,targetScope}؛ navigate{destination} |
| state | title/reference/detail/steps | recheck/retry/save-local{reference} |
| market/card | id/revision/title/price/unit/images[{src,alt}]/sellerLabel/statusLabel/reason | edit/report{listingId,revision} |
| market/editor | title/description/price/unit، requiredFields اختيارية، titleMaxLength اختياري، images القائمة | save-draft/publish{title,description,price,files} |
| market/search | query، filters[{id,label,options:[{id,label}],value}]، resultLabel | search{query,…filterValues,files:[]}؛ معرّفات الحقول فريدة ولا تتصادم مع query/files |
| delivery/request | pickup/dropoff/note، requiredFields، visibility.addresses/contact | request-delivery{pickup,dropoff,note,files:[]} |
| delivery/offer | id/offerId/revision/amount/unit/validityLabel | accept/decline/assign{requestId,offerId,revision} |
| delivery/tracking | steps[{label,time,detail,current}]، statusLabel | recheck{requestId}؛ لا انتقال تلقائي |
| delivery/change | id/revision/currentText/proposedText، parties[{label,statusLabel}] | request-change{requestId,revision}؛ لا تطبيق للتعديل |
| delivery/proof | id/revision/proofKind=delivery أوreturn، requirementsLabel/attachmentRequired/requiredFields | submit-proof{note,files,requestId,proofKind,revision} |
| assistant | messages[{id,speaker:user/assistant/system,text,stateLabel,retryable,actions}]، replyPending، activity، proposal{id,revision,summary,label} | send{message,files:[]}؛ retry{messageId}؛ execute{proposalId,revision} أو {messageId,actionId,revision}؛ follow-up/open-resource{messageId,actionId,revision} |
| review/queue | id/revision/title/subjectLabel/summary/statusLabel/reason/history/images، visibility.evidence، reasonRequired | approve/reject/request-info{reason,files:[],subjectId,revision}؛ view-evidence لعرض الصور فقط |
| review/report | id/subjectLabel/requiredFields/reasonOptions[{id,label}] | submit-report{reason,category عند وجوده,files:[],subjectId} |

compose إذن تحرير حقول النموذج وليس إذن إرسال. view إذن عرض؛ إعادة الدخول reauth واختيار سياق آخر choose-context grants منفصلة. loading/pending/disabled تعطل الإدخال والإجراءات، أما error/rejected فيحفظان النص للتصحيح. إعادة المحاولة لا تستنتج نجاحًا أو تزيل خطأ الخدمة. reasonRequired يفرض سبب الرفض فقط؛ requirements التجارية الأخرى يقررها المضيف.

Market report يطلب فتح محرر بلاغ C12 عند المستهلك دون تأكيد زائد لمجرد فتح النموذج، ولا يرسل بلاغًا خادميًا بذاته. التأكيد عند submit-report النهائي. بيانات صور قائمة editor تبقى من المصدر؛ ملفات الاختيار الجديدة لا تعني حذف القديمة. استبدال/حذف الصور وترتيبها خادميًا يحتاج عقد منتج لاحقًا. الخادم يطابق كل id/revision مع صلاحية السجل؛ لا يقبل payload كدليل تفويض.

## هوية المسودة عند إعادة استخدام الجذر

المسودة تتبع scope ثم tuple من mode وid وdraftKey، ولا تتبع Workspace وحده. تغيير السجل أو نوع النموذج يمسح حقول السجل السابق وملفاته وروابطه؛ تحديث revision للسجل والنوع والمفتاح نفسهم يحفظ التحرير المقصود. ليست هذه cache متعددة السجلات، ولا حفظًا تلقائيًا.

`draftKey` نص اختياري ثابت يمرره المستهلك لهوية محادثة أو نموذج جديد بلا id؛ مثل conversation-id أو مفتاح مسودة إنشاء. غيّره عند بدء محادثة أو نموذج مستقل في الجذر نفسه. إذا لم يُمرر، تبقى المسودة الافتراضية الوحيدة للسجل والنوع الحاليين. تأكيد الحفظ أو إعادة تعبئة مقصودة يستخدم clearDraft كما سبق. لا تستخدم revision كمفتاح مسودة لأن تحديث السجل العادي لا ينبغي أن يمحو تحرير المستخدم.

سحب visibility.addresses/contact/evidence التي كانت true يمسح البيانات المحلية المشتقة السابقة قبل إعادة العرض. لا تعيد حقول العنوان إظهار prefill مخفي بسبب مسودة قديمة. هذا لا يحذف نموذج بيانات المضيف؛ عليه إزالة البيانات غير المسموحة من مخزنه واستجاباته أيضًا.

## محتوى واجهة المستخدم — مرحلة التنقيح 1

- النص الافتراضي يصف النتيجة أو الخطوة التالية، ولا يشرح المكتبة أو المصدر أو عقود الصلاحية للمستخدم. تبقى تفاصيل التنفيذ في هذه المواصفة.
- success لا يأتي إلا من نموذج مؤكد من المستهلك؛ النص العام «تمت العملية» لا يعني حفظًا أو تسليمًا محددًا. يمرر المستهلك phaseDetail عند حاجة المستخدم لتفصيل النتيجة.
- pending لا يعلن النجاح. uncertain وconflict والتحذير من عدم المزامنة يظلون واضحين؛ لا نختصر على حساب صدق النتيجة.
- requirementsLabel اختياري: يظهر عند تمريره فقط. غيابه لا ينشئ توقيعًا أو رمزًا أو موقعًا ولا يلغي attachmentRequired أو requiredFields.
- تأكيد الإثبات يوضح أن الإرسال للمراجعة لا يعني اكتمال التسليم/الإرجاع. تأكيد العرض يحتفظ بالسعر والوحدة، والنشر يحتفظ بعنوان الإعلان والسعر.
- عدم الأثر المالي التلقائي في Manage يبقى عقدًا وظيفيًا؛ لا يُكرر كشرح معماري داخل التأكيدات الافتراضية.
- نصوص عينات المختبر التشخيصية ليست نصوص منتج معتمدة؛ تُراجع في المرحلة2 مع التكوين البصري. لا أزرار رسائل Ask جديدة في هذه المرحلة.

## التكوين ورفع الصور — مرحلة2

العنوان والحالة في header واحد؛ معلومات التسعير الثانوية مجمّعة مع القيمة. dl تعرض label/value في عمودين مرنين1:2 دون قص؛ نموذج الطلب يعرض حقول العناوين فقط بدل تكرار نسخة للقراءة. مصدر CSS هو product-context.css ولا تتغير التوكنز أو أحجام اللمس. لا تُنشأ بطاقة لكل صف.

بطاقة الاستعراض تبقي صورتها4:3؛ معاينة التحرير/الملفات المختارة تحتفظ بالصورة كاملةcontain بارتفاع أقصى144px (ثلاث وحدات لمس)، دون رفع أو ضغط أو تعديل الملف. غياب الصورة حالة مختصرة بحد لمس48 بدل حجز120. اختيار الصور زر B01 ثانوي48 يفتح input الأصلي المخفي؛ أسماء الملفات ظاهرة ويمكن إزالة الاختيار. حدود النظام ونوافذ اختيار الملفات ليست قابلة لتوحيد اللغة من المكتبة.

## Ask: أزرار الرسائل والنشاط — مرحلة4

`actions` مصفوفة داخل رسالة assistant فقط ذات id فريد في النموذج. كل إجراء `{id,kind,label,revision,state?,summary?}`. kind: follow-up يطلب متابعة، open يطلب عرض مورد، execute يطلب تغييرًا بعد تأكيد. grants منفصلة follow-up وopen-resource وexecute؛ كل intent يحمل messageId/actionId/revision فقط، بجانب scope/request العامين. يطابق المستهلك هذه المعرفات مع إجراءات يعرفها ويتحقق من الصلاحية والنسخة؛ المكتبة لا تفتح URL ولا تنفذ prompt أو كودًا مولّدًا.

id وlabel وrevision نصوص غير فارغة، وsummary مطلوبة لإجراء execute لشرح العاقبة في التأكيد. أنواع غير معروفة أو ids مكررة في الرسالة أو رسالةid مكررة لا تنشئ أزرارًا. نصوص labels/summary تعرض كنص آمن. لا يوجد زعم حماية للخادم من هذه الواجهة.

state اختياري وافتراضيه ready؛ expired/completed/unavailable تعرض زرًا معطلًا وسببًا واضحًا. القيمة الأخرى معطلة. صدق completed مسؤولية النموذج المؤكد. replace يبطل التأكيد والطلب القديم كما في العقد العام؛ تغيّرscope يمسح المسودة. replyPending يعطل إرسالًا جديدًا وأزرار الاقتراحات، مع إبقاء الكتابة متاحة، وسجل الرسائل aria-busy.

activity=searching مع replyPending يعرض «جارٍ البحث» فقط؛ أي قيمة أخرى تعرض «جارٍ إعداد الرد». لا مراحل أو تقدم وهمي. الشعار v2 ثابت24 مع مساحة8 حوله، والحركة لمؤشر منفصل فقط؛ reduced motion يوقفها. اللون والخط والهوية الموجودة فقط، بلا شخصية كرتونية أو3D. هذا اتجاه معاينة Draft وليس اعتماد هوية جديدًا.

حقل الرسالة يبدأ بصف واحد بحد52، وينمو حتى156px ثم يمرر المحتوى؛ زر إرسال بجواره بحجم التحكم الحالي. الاقتراح القديم m.proposal باقٍ للتوافق ويظهر بجوار الردود قبل الكاتب.

## تغذية راجعة وترتيب الأفعال — مرحلة ملكية التصميم2

Market/editor يظهر publish ثم save-draft بترتيب DOM نفسه في زوج متساوٍ عند توفرهما. Delivery/offer يعرض accept/decline زوجًا، وassign في صف إضافي. إذا لم توجد إلا صلاحية فعل واحد في الصف الأساسي يستعمل العرض الكامل. لا تغيير grants أو التأكيد أوpayload أو ترتيب سياسة منتج. الوصفة من buttons.css وتتبناها التراكيب صراحة؛ صفوف Carousel/Ask لا تتغير ضمن هذه المرحلة.

عند fieldsPayload لحقول ناقصة: ملخص خطأ واحد بعد العنوان، ورسالة `.m-field__msg.is-visible` قرب كل حقل، مرتبطة عبر aria-describedby. رسالة كل حقل نص توضيحي بلا role alert إضافي. التركيز لأول ناقص، والتصحيح يزيل خطأ الحقل نفسه، ويبقي خطأ الآخر. لا مسح للقيم؛0 النصية قيمة صالحة. تسمية الدور والمنشأة مختصرة؛ قواعد تفرد نطاق السياق تبقى كما هي وإن اختصر عرض خطئها للمستخدم.

## اختيار الصور — ملكية التصميم5

attachmentSelection اختياري: append يضيف الملفات الجديدة للاختيار المحلي؛ الغياب/القيمة الأخرى يستبقي replace القديم. الزر يوضح «إضافة صور» أو «اختيار الصور» ثم «استبدال الاختيار». صور النموذج المحفوظة منفصلة عن ملفات المسودة؛ هذا لا يحذف صورًا خادمية. يسمح اختيار الملف نفسه مجددًا؛ لا افتراض تطابق محتوى من الاسم.

عند تعدد الملفات تظهر إزالة فردية باسم الملف؛ تحررURL الخاص به فقط وتعيد التركيز للاختيار. إزالة المجموعة باقية. شروط النوع/maxImageBytes تُطبّق على الإضافة الجديدة، والخطأ يبقي السابق. payload.files يحوي الباقي فقط. تغييرالسياق/السجل/المسودة أو سحبview/visibility/destroy ينظف الملفات وفق العقد القائم. لا رفع أو ضغط أو سياسة عدد أو حذف خادمي جديد.
