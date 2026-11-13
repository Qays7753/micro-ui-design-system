# نقل C07–C12 لاحقًا — دون فتح تطبيق Micro

هذه قائمة استهلاك، لا خطة مبنية على stack التطبيق أو ادعاء فحصه. استخدم commit محددًا بعد مراجعة هذه الدفعة، ولا تعتمد latest متحركًا. مرجع handoff السابق يخص النسخة السابقة فقط.

1. انقل المصدر مرة واحدة إلى مكتبة مشتركة أو حزمة مناسبة للبنية التي ستُفحص بتفويض لاحقًا: assets/fonts والهوية، shared/tokens.css وmotion.css، ثم المكونات الأساسية المطلوبة. لا تنسخ lab.html أو lab.js أو بياناتها أو صورة حقيبة العينة إلى المنتج.
2. حمّل Buttons/Fields/Messages وCSS التراكيب. fields.js يملك تفاعل حواف الحقل؛ navigation.js ثم action-sheet.js يملكان التأكيد والتركيز والقفل؛ carousel.js/CSS لخيارات الصور. organization.css لشارات الحالة. حمّل product-core.js مرة ثم renderer المطلوب فقط. لا frameworks أو حزمة AI جديدة أو runtime خارجي.
3. أنشئ adapter واحدًا لكل مجال/بيئة framework، يملك mount/replace/resolve/destroy، لا نسخ مصدر لكل موضع. ابدأ C07/C08 مع خدمة الحساب والسياق الموثوقة، ثم Market أوDelivery حسب API المتاح، ثم المراجعة، وأخيرًا Ask وأدواته حسب صلاحياتها.
4. ينتج adapter نموذجًا كاملًا من استجابة مصرح بها؛ scope=contextId/workspaceId/roleId/kind. dataContext هو نطاق طلب العرض، لا مالك الإعلان العام. لا تعِد ختم بيانات قديمة بنطاق جديد، ولا تخلط grants الأدوار. مرر id السجل وmode الصحيحين، وdraftKey ثابتًا للمحادثة أو نموذج الإنشاء بلا id؛ غيّره عند بدء مسودة مستقلة. إقرار revision في السجل نفسه يحفظ التحرير، بينما تبديل هوية المسودة أو سحب visibility ينظف الحقول والملفات. purge بيانات الخدمة/ذاكرتها عند التبديل، فلا يكفي أن تنظف المكتبة مسودتها. view لا تعني صلاحية تنفيذ.
5. استمع intent مرة واحدة، تحقق في الخادم من المستخدم/Workspace/السجل/id/revision وgrant. اربط الرد بالرمز exact values عبر resolve؛ تجاهل القديم. إتمام الدخول أو التبديل الخارجي عبر replace موثوق. إخفاء زر أو حقل لا يؤمّن API أو بيانات وصلت أصلًا للعميل.
6. pending يمنع التكرار محليًا فقط؛ idempotency ومنع تكرار العمليات على الخادم والتحقق من نسخة السجل خارج المكتبة. عند انقطاع بعد إرسال لا تفترض فشلًا يسمح resend؛ uncertain ثم recheck. لا success قبل إقرار خدمة، ولا تحويل حفظ Manage المحلي إلى متزامن.
7. في router/unmount/session/workspace change أغلق/نظف المصدر حسب API قبل إزالة DOM. لا تمرر DOM هذه التراكيب إلى framework آخر لامتلاكه بالتزامن؛ portal التأكيد يتبع Navigation. استخدم مالك modal واحدًا، ولا تضف focus trap أو lock موازٍ.
8. افحص داخل التطبيق المصرح لاحقًا: CSS reset وbox-sizing، ترتيب التوكنز والخطوط، قواعد button/input/select العامة، RTL/Bidi للأرقام، منافسة modal/z-index/inert، دورة حياة router والـportals، scroll لوحة المفاتيح الآمنة وsafe areas. لا تستنتج وجود هذه التعارضات في Micro الآن.

## مصفوفة تحميل مختصرة

| الاستخدام | إضافي فوق tokens/fonts/motion وproduct core/CSS |
|---|---|
| سياق/حالة C07/C08 | B01 وB02 CSS/JS وMessages؛ Navigation/C05 عند تأكيد مستخدم من المضيف |
| Market C09 | B01/B02/Messages/Organization؛ Carousel للصور؛ Navigation/C05 للنشر/البلاغ |
| Delivery C10 | B01/B02/Messages/Organization؛ Navigation/C05؛ Carousel إذا عرضت صور إثبات |
| Ask C11 | B01/B02/Messages؛ Navigation/C05 عند proposal؛ لا SDK AI |
| Review C12 | B01/B02/Messages/Organization؛ Navigation/C05؛ Carousel لمرفقات مصرح بها |

## القبول عند النقل

افحص الغلاف الفعلي للهاتف360×780 RTL ثم عرض أضيق واحد عند حاجة مثبتة، واتجاه LTR إذا أثر على العنصر. تحقق النقر ولوحة المفاتيح والتأكيد والإلغاء، فروق هوية السائق، تعدد أدوار الشخص دون اتحاد صلاحيات، انتهاء الجلسة، الردود القديمة، انقطاع الشبكة بعد mutation، بقاء النص عند الخطأ وتنظيفه عند scope change، وعدم تسرب صور/ملفات. اختبر الخدمات فعليًا هناك؛ محاكاة المختبر هنا لا تثبت backend أو SSO أو Android/TalkBack.

لا تغيّر التوكنز لتجاوز CSS عام، ولا تنقل واجهة قديمة أو Showcase كمرجع للشكل. الاستثناء الخاص بالمضيف يعالج في adapter موثق إن لم يكن عيبًا عامًا في المكوّن. Market/Delivery لا يولّدان قيدًا في Manage تلقائيًا، وAsk لا يتجاوز الخادم أو ينفذ حساسًا دون تأكيد وصلاحية.
