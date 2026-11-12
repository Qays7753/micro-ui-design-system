# C03 — سطح نموذج عام

وصفة تركيب مشتركة، وليست عائلة خامسة عشرة. المصدر form-surface.css، والتحميل والعقد والأمثلة في [دليل التراكيب](../../docs/COMPOSITIONS.md). الحالة Draft للمراجعة؛ لا JavaScript API أو محرك نموذج أو طبقة جديد.

الجذر form.m-form-surface، والخانات head/title/description/body/feedback/actions. أطفال Fields/Buttons/Messages بعقودهم. البيانات وصحة المدخل وdirty والانتظار والنتيجة للمستهلك. hidden يزيل العنصر من التخطيط، والأفعال تلتف دون تقليص أهداف48px. الخطأ الطويل يبقى داخل السطح دون تغيير النص أو أحجام الخطوط أو التوكنز.

carrier dialog.m-form-dialog اختياري لواجهة HTML الأصلية بمالك واحد للتركيز وinert. CSS لا يستدعي showModal/close، ولا يدير History أو يحفظ مسودة أو يقرر الإغلاق. native cancel في المثال يملكه مستهلكه المحلي؛ D01 الخاص بـNavigation يبقى غير منفذ.

الاختبار: `python3 tools/composition-recipes-check.py --out OUT`. سياقان،360×780 RTL، خطأ/انتظار/إرسال مكرر/نتيجة حيادية أو مرفوضة/تنظيف، ومصدر دون CSS المعاينة. لا هوية بديلة أو Dark أو خدمة خلفية أو مضيف Micro.
