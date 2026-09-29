# مصادر الأصول وتراخيصها — assets/

كل أصل في هذا المجلد محلي وقابل للتعديل، ولا يعتمد على روابط جلسة مؤقتة أو أصول مدفوعة.

## الخطوط — `fonts/`

| العنصر | التفصيل |
|---|---|
| العائلات | IBM Plex Sans Arabic (العربية) · IBM Plex Sans (الأرقام 0–9 واللاتيني) — الأسس المعتمدة |
| الأوزان | 400 / 500 / 600 فقط (لا خطوط رفيعة أساسية) |
| الصيغة | woff2 — مقسّمة subsets: `arabic` للعربية و`latin` للأرقام/اللاتيني، مع تعريف unicode-range في `fonts.css` |
| المصدر | fontsource (نسخ رسمية من خطوط IBM Plex) عبر jsdelivr: `@fontsource/ibm-plex-sans-arabic@5.3.0` و`@fontsource/ibm-plex-sans@5.3.0` |
| المرجع الأصلي للعائلة | https://github.com/IBM/plex |
| الترخيص | SIL Open Font License 1.1 — النص الكامل: `fonts/LICENSE-IBM-Plex-OFL.txt` |
| ملفات التنزيل | `IBMPlexSansArabic-Arabic-{400,500,600}.woff2` · `IBMPlexSans-Latin-{400,500,600}.woff2` · `fonts.css` |

تعديل الخط: استبدل ملفات woff2 بالمثل أو عدّل `fonts.css`؛ الاسم المعتمد في `shared/tokens.css` عبر `--micro-font-family`.

## الأيقونات — `icons/`

| العنصر | التفصيل |
|---|---|
| العائلة | HugeIcons — Stroke Rounded (المعتمدة في الأسس، وتحل محل اقتراح Lucide السابق) |
| الأصول | ملفات SVG مستقلة قابلة للتعديل، viewBox 24، سماكة 1.5، أطراف مستديرة — بنفس مسارات الحزمة دون تعديل |
| المصدر | حزمة `@hugeicons/core-free-icons@4.3.5` من npm (ملفات `dist/esm/*.js` حُوّلت إلى SVG) |
| التحويل | سكربت خارج المستودع (regex على مسارات الحزمة) — لم يُغيَّر أي مسار أو سمة تصميم |
| الترخيص | MIT — النص الكامل: `icons/LICENSE-hugeicons.txt` |
| الرموز المستخدمة في B01 | `search-01.svg` · `filter-horizontal.svg` · `add-01.svg` · `checkmark-circle-02.svg` · `delete-02.svg` · `check.svg` |
| الرموز المضافة لفرع التوسعة (B02+) | `cancel01` · `chevron-down` · `chevron-left` · `chevron-right` · `arrow-up02` · `arrow-down02` · `plus-sign` · `minus-sign` · `image01` · `home01` · `home02` · `menu01` · `clock01` · `calendar03` · `alert01` · `alert-circle` · `information-circle` · `user-circle` · `package01` · `truck` · `inbox` · `wallet01` · `more-vertical` · `grid` · `refresh` · `eye` — نفس الحزمة والإصدار وبنفس طريقة التحويل دون تعديل مسارات |

الرموز المستقبلية تُضاف بنفس الطريقة (اسم ملف kebab-case + سطر في هذا الجدول). لا تُستخدم رموز Emoji أو رسوم بديلة منسوبة للعائلة.

## ما لم يُستخدم عمدًا

- ألوان البيانات (`references/micro-data-colors-v1.html`) ليست أصولًا هنا — خارج نطاق B01.
- لا توجد خطوط مرفوعة من Google Fonts مباشرة ولا روابط CDN داخل صفحات المكوّن — كل الاستدعاءات محلية.
