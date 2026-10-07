# أدلة الوكيل 1 (SUI-A1) — الأساس البصري

**البيانات الوصفية لكل الأدلة:**
- المصدر المقاس: `micro-ui-design-system` عند commit `a5500c9` (tree `05f344b05ef12284abfc31ad9a1c8633dcd6a058`)، شجرة نظيفة عدا مجلد reviews (غير مثبت بعد).
- التشغيل: `python3 tools/preview-server.py` من جذر المستودع (منفذ 5000، بلا تعديل) ثم Playwright (sync) مع `executable_path=/home/z/my-project/evidence/bin/chromium` = Chrome for Testing **143.0.7499.4**، headless، `device_scale_factor=1`.
- آلية تكبير النص 200%: «مروران معلنان» — قراءة `getComputedStyle().fontSize` لكل عنصر ثم مضاعفتها inline (نمط ui-release-check للمكتبة). **محاكاة نص فقط** — ليست native zoom ولا zoom نظام.
- صفر `pageerror` في كل الجلسات الموثقة هنا.

## الملفات

| الملف | ما هو |
|---|---|
| `contrast-tokens.py` / `contrast-tokens.json` | حساب WCAG relative-luminance لـ 24 زوج توكنات (رياضي بلا متصفح) — كل الأزواج النصية PASS (أدنى 4.68:1) |
| `f03-probe.py` / `f03-probe.json` | F03 (الدخول عبر زر الدخول التجريبي): الرئيسية عند 320/360/390/430 (هوامش/تراتب أحجام/صف/navbar/CTA/سطح البطل) + تصغير 430→320 بلا إعادة فتح + 2x مروران عند 320 + reduced-motion فعلي (تقرير انتقالات الصف/الطبقة/الشيفرون) |
| `f03-probe2.py` / `f03-probe2.json` | وجهات بنقر navbar حقيقي: التقارير عند 320 (عنوان رسم 16px، m-seg) و2x بلا فيض؛ الحساب عند 430 (صفوف 72/73px)؛ تذييل مقابل navbar عند 1x/2x؛ شريط التحديد عند 1x/2x |
| `f03-selectbar-mid.json` (سكربت داخل سجل الأوامر المرفق في التقرير §V1) | التراكب المثبت لـ V1: عند 2x نص ووضع تحديد — `overlap=17.98px` عبر scrollY 300/600/900/1200 |
| `f03-probe3.py` / `f03-probe3.json` | تفاصيل F03 (readlist dt=14/dd=16، رأس قابل للطي 16/600، فحص قاعدة `m-section__title` = غير موجودة) + قياس عمق طبقة التصفية (غشاء rgba(23,45,50,.4)، ظل overlay، بلا backdrop-filter) |
| `components-probe.py` / `components-probe.json` | لوحة B04: زرا 40px (V4)، صف 72px، بلاط 48px، رأس 48px، عدّاد 20px، شارة؛ كيبورد Enter/Space على القسم القابل للطي (V8/K8)؛ الفحص الذاتي للمثال المستقل S01 (10/10 PASS)؛ معرض index: قياس letter-spacing عربي (V8: فرق 0.00px في Chromium) |
| لقطات PNG | `f03-home-320.png`، `f03-home-430.png`، `f03-home-320-text200.png`، `f03-list-selectmode-320-text200.png` (حالة V1)، `f03-reports-430.png`، `f03-account-430.png`، `f03-filter-layer-390.png`، `org-board-phone-390.png` (حالة V4)، `gallery-head-1440.png` (حالة V8) — بحالة/مقاس في الاسم كما يقتضي البروتوكول |

## حدود صريحة

- لا قياس على WebKit/Safari ولا هاتف فعلي ولا native zoom ولا TalkBack ولا لمس — موثق NOT RUN في التقرير.
- القياس من DOM/CSS المحسوب (`getComputedStyle` / `getBoundingClientRect` / Range rects) — لا حكم بصري من الصور.
