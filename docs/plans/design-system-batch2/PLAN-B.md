# الخطة ب — المجالات (الوكيل الثاني zai-2)

> **بقرار المالك 2026-11-27:** الوكيل الثاني يبني **المرحلة 5 من `PLAN.md` (المجالات السبعة)**، مستقلًا تمامًا عن الوكيل الأول. الوكيل الأول يبني المراحل 0 حتى 4 على `design-system`. **المحاكاة ليست في نطاق أي منهما الآن.**
> **الفرع:** `design-system-b` فقط، يُنشأ من `origin/design-system`. **لا رفع إلى `design-system` ولا إلى أي فرع آخر.**
> **التقرير:** `docs/plans/design-system-batch2/REPORT-B.md`، وفيه «نقطة الاستكمال» تُحدَّث مع كل push.
> **التوقف الوحيد:** بعد الوحدة B.end. **لا أسئلة ولا انتظار.**

## الاستقلال (أهم قاعدة)

- **لا تنتظر الوكيل الأول ولا تعتمد على عمل لم يُنجز بعد.** ابنِ مكوّنات المجالات نفسها كاملة (الملفات السبعة، وصفحتها في المختبر بكل حالاتها، والبوابات، والصور).
- **صفحة تركيب كل مجال** تُبنى من المكوّنات الموجودة فعلًا على فرعك فقط. أي جزء يحتاج مكوّنًا عامًا من المرحلة 4 غير موجود بعد (مثل `AmountKeypad`، و`MovementTypeControl`، و`FundPicker`، و`PartyPicker`، و`DatePicker`، و`MonthGrid`، و`TimePicker`، و`DurationPicker`، و`StatusTrack`، و`PhotoUploader`، و`PriceTierBuilder`، و`VoiceInput`، و`KeyValueList`، و`ObjectSheet`): **لا تبنِه أنت ولا تخترع بديلًا.** اترك مكانه، واكتبه في REPORT-B تحت «يُكمَّل بعد الدمج» بالمكوّن والموضع.
- **مزامنة الأساس:** قبل بداية كل مجال: `git fetch origin design-system` ثم `git merge origin/design-system` إلى فرعك، لتأخذ آخر الرموز والقواعد وآلية النصوص من الوكيل الأول. حل أي تعارض في الملفات المشتركة (القاموس، و`index.ts`، والمختبر، و`config.json`، و`measure-spec.json`، و`MANIFEST.json`) بإبقاء الإضافتين معًا. **إن ظهرت آلية تجاوز النصوص (المرحلة 3ج) على `design-system`، فاستعملها في كل مكوّن.**

## المراجع (بالأسبقية)
`AGENTS.md`، ثم `PLAN.md` (رأسه: قرارات المالك وقواعد الجولة، والمرحلة 5)، ثم `BRIEF-ADDENDUM-1.7.md`، ثم `batch2/BATCH2-SPECS-ADDENDUM.md`، ثم `batch2/BATCH2-SPECS.md` (اقرأ §0.2 أولًا)، ثم `BRIEF-ADDENDUM-1.6.md`، ثم `BRIEF.md`، و`owner-feedback/2026-11-27.md`.

## قواعد العمل
- كل قواعد الجولة في رأس `PLAN.md` سارية، بالدورة نفسها: ابنِ، ثم صفحته في المختبر وكل مثال يعمل، ثم typecheck وlint وtest وbuild وbuild:standalone، ثم البوابات على المحركين والعرضين، ثم **صوّر وانظر بعين مصمم**، ثم manifest، ثم commit، ثم push إلى `design-system-b`، ثم سطر «✓ <الوحدة> <sha> — نُظر: نعم».
- وحدة واحدة = مكوّن واحد = commit واحد = push واحد. ونهاية كل مجال: صفحة تركيبه، ثم مراجعة بصرية للمجال، ثم check-all.
- ما لا تحسمه المراجع: الأقرب لنصها، ويُسجّل تحت «يحتاج قرار المالك»، وتابع.

## الوحدات (بالترتيب)

| # | المجال | المكوّنات |
|---|---|---|
| B0 | البدء | استنساخ، وإنشاء `design-system-b` من `origin/design-system`، وتجهيز البيئة (المحركان وnode_modules)، وcheck-all خط أساس، وإنشاء REPORT-B |
| B1 | المالية | MovementRow، TransferRow، FundCard، DebtCard، DebtSummary، PaymentProgress، ثم صفحة تركيب المالية |
| B2 | الطلبات والمواعيد | OrderCard، WeekStrip، DayTimeline، AgendaList، SlotPicker، ثم صفحة التركيب |
| B3 | التوصيل | DeliveryRequestCard، QuoteCard، JobTrack، IssueProposalCard، ContactBar، EvidenceSlot، LocationSlot، DriverJobCard، DriverApprovalStatus، ثم صفحة التركيب |
| B4 | السوق | ListingCard، Gallery (مع عارض ملء الشاشة والتكبير)، PriceTierTable، SupplierHeader، ReportSheet، ListingEditor، ListingStatusBadge، ثم صفحة التركيب |
| B5 | المراجعة والإدارة | ReviewQueueItem، DecisionCard، DriverApprovalCard، ReportItem، ثم صفحة التركيب |
| B6 | Ask Micro | AskPanel، AskContextChip، AskUserMessage، AskAnswer، AskComputedResult، AskInlineTable، AskNavResult، AskDraftCard، AskLimit، AskThinking، AskAboutThis، ثم صفحة التركيب |
| B7 | الرسوم البيانية | الأنواع في المواصفات §8 بالترتيب، وحدة لكل نوع |
| B.end | الإغلاق | check-all كاملة، وREPORT-B (ما بُني، والفاشل أولًا، و«يُكمَّل بعد الدمج» كاملة، و«يحتاج قرار المالك»)، ثم push. **ثم توقف** واكتب سطرًا واحدًا: «انتهيت من المجالات، آخر commit <sha> على design-system-b». |
