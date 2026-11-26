# CHANGELOG — @micro/ds

## 0.1.0 — 2026-11-26 (دفعة الدفعة الأولى، القسم 2 من الموجز)

أول إصدار لنظام التصميم المصغّر (`@micro/ds`): 22 مكوّنًا + الأيقونات الدلالية + القاموس العربي + الرموز، مرفوعة وحدةً وحدة مع بواباتها وبوابة check-all الكاملة 51/51 على Chromium وWebKit.

- **الأساس:** الرموز (docs/design-system/tokens.json → tokens.css)، الاتجاه RTL، القاموس (t/ar)، الأيقونات 20/24 بالمعادن الدلالية.
- **المكوّنات:** Button · IconButton · Money · StatusBadge · EntityMark · ContextBar (+ProjectSwitcher/NotificationsButton/AskButton) · PageHeader · TabBar · Surface · Section · Well · Metric · MetricSmall · ObjectRow · ObjectCard · Tile · HeroSurface · TextField · SegmentedControl · FilterChips · Sheet · ConfirmSheet · ActionBar · SaveState · Toast · InlineBanner · EmptyState · Skeleton · FundIcons.
- **المختبر:** previews/ds-lab/standalone.html — الكتالوج بفهرس ثابت + صفحة «تركيب تجريبي» هي العرض الافتراضي (زرّا فتح/عودة)، ملف واحد يعمل من file://.
- **التجربة:** ds/consumer-test بالإعدادات المثبتة (D12) يعرض كل المكوّنات من حزمة pnpm pack، وفحوص K13/K14/K15 آلية.
- **البوابات:** 51 بوابة في check-all، منها بوابات المتصفح على العرضين (G2) وفحص الضغط المستثنى بقيمة view-toggle فقط (G1).
