import { jsx as a, jsxs as h, Fragment as L } from "react/jsx-runtime";
import { useMemo as _, useContext as F, createContext as G, useState as Z, useRef as y, useCallback as H, useEffect as M, useReducer as ee, useId as te, useLayoutEffect as ne, Children as ae } from "react";
const se = {
  color: {
    canvas: "#E8ECEF",
    surface: "#FFFFFF",
    "surface-edge": "#D5DCE0",
    "surface-well": "#F6F8F9",
    "surface-pressed": "#EEF1F3",
    track: "#DDE2E6",
    "text-primary": "#101719",
    "text-secondary": "#5B666C",
    "border-field": "#8A959B",
    "line-table": "#E3E7EA",
    scrim: "rgb(16 23 25 / 40%)",
    "brand-anchor": "#0E3E46",
    "brand-anchor-pressed": "#0A2F35",
    "brand-logo": "#164D59",
    "brand-text": "#0B6A75",
    "brand-data": "#507F8B",
    "brand-selected-bg": "#E6EFF1",
    "brand-selected-pressed": "#D5E4E7",
    "brand-signal": "#D97757",
    "on-anchor": "#FFFFFF",
    "on-anchor-secondary": "#A8C4C9",
    "status-done-fg": "#166B3A",
    "status-done-bg": "#E7F4EA",
    "status-waiting-fg": "#8A5200",
    "status-waiting-bg": "#FFF3D6",
    "status-problem-fg": "#B3261E",
    "status-problem-bg": "#FDECEA",
    "status-info-fg": "#0B6A75",
    "status-info-bg": "#ECFBFB",
    "status-neutral-fg": "#5B666C",
    "status-neutral-bg": "#EEF1F3",
    "disabled-bg": "#DDE2E6",
    "disabled-fg": "#8A959B",
    skeleton: "#E9EDEF",
    "entity-bg": "#DDE2E6",
    "entity-fg": "#3A464C",
    "entity-image-edge": "rgb(16 23 25 / 6%)",
    handle: "#C9D0D4",
    "toast-bg": "#101719",
    "on-dark": "#FFFFFF",
    "on-dark-action": "#8CCFD6"
  },
  role: {
    "focus-ring": "brand-text",
    caret: "brand-text",
    "selection-bg": "brand-selected-bg",
    "field-focus-halo": "brand-selected-bg",
    "dot-unread": "brand-anchor",
    "dot-attention": "status-waiting-fg",
    "chart-zero-line": "border-field",
    "chart-series": "brand-data",
    "chart-highlight": "brand-signal",
    "chart-highlight-negative": "brand-anchor",
    "chart-scrub": "brand-anchor",
    "draft-edge": "brand-signal",
    "today-ring": "brand-signal",
    "now-line": "brand-signal",
    "sparkline-endpoint": "brand-signal",
    "hero-sparkline": "brand-signal",
    "voice-wave": "brand-signal",
    placeholder: "text-secondary",
    "theme-color": "canvas"
  },
  font: {
    display: "'Rubik', 'IBM Plex Sans Arabic', sans-serif",
    text: "'IBM Plex Sans Arabic', sans-serif",
    "display-file": "Rubik[wght].ttf",
    "display-axis": [
      300,
      900
    ],
    "display-weights": [
      500,
      600
    ],
    "display-banned-from-weight": 700,
    "text-weights": [
      400,
      500,
      600
    ],
    "display-min-size": 20,
    numeric: "tabular-nums",
    "digit-tracking": "-0.01em",
    "digit-tracking-min-size": 28,
    "arabic-title-min-line-ratio": 1.25,
    "welcome-title-max-ratio-to-wordmark": 0.6
  },
  type: {
    "display-hero": {
      font: "display",
      size: 40,
      line: 48,
      weight: 500
    },
    "amount-input": {
      font: "display",
      size: 32,
      line: 40,
      weight: 500
    },
    "number-lg": {
      font: "display",
      size: 28,
      line: 36,
      weight: 500
    },
    "title-screen": {
      font: "display",
      size: 28,
      line: 36,
      weight: 600
    },
    "title-section": {
      font: "display",
      size: 22,
      line: 30,
      weight: 600
    },
    "title-card": {
      font: "text",
      size: 18,
      line: 26,
      weight: 600
    },
    body: {
      font: "text",
      size: 16,
      line: 26,
      weight: 400
    },
    "body-strong": {
      font: "text",
      size: 16,
      line: 24,
      weight: 500
    },
    "amount-row": {
      font: "text",
      size: 16,
      line: 24,
      weight: 600
    },
    button: {
      font: "text",
      size: 16,
      line: 24,
      weight: 600
    },
    label: {
      font: "text",
      size: 14,
      line: 20,
      weight: 500
    },
    "label-strong": {
      font: "text",
      size: 14,
      line: 20,
      weight: 600
    },
    caption: {
      font: "text",
      size: 13,
      line: 20,
      weight: 400
    },
    "caption-strong": {
      font: "text",
      size: 13,
      line: 20,
      weight: 600
    },
    micro: {
      font: "text",
      size: 12,
      line: 16,
      weight: 600
    },
    "entity-initial": {
      font: "text",
      weight: 600,
      "size-by-mark": {
        32: 14,
        44: 18,
        64: 26
      }
    }
  },
  space: [
    4,
    8,
    12,
    16,
    20,
    24,
    32,
    40,
    56
  ],
  layout: {
    "screen-margin-phone": 16,
    "screen-margin-tablet": 24,
    "surface-padding-phone": 16,
    "surface-padding-tablet": 20,
    "list-surface-padding-block": 8,
    "row-padding-inline": 16,
    "row-padding-block": 12,
    "row-gap": 12,
    "row-line-gap": 4,
    "hero-padding-phone": 20,
    "hero-padding-tablet": 24,
    "well-padding": 12,
    "tile-padding": 16,
    "sheet-padding": 20,
    "section-title-to-surface": 12,
    "surface-to-surface": 12,
    "section-to-section": 32,
    "label-to-field": 8,
    "field-to-help": 4,
    "field-to-field": 20,
    "group-to-group": 32,
    "tile-gap": 12,
    "toast-offset": 12,
    "toast-padding-block": 12,
    "toast-padding-inline": 16,
    "button-padding": 20,
    "button-compact-padding": 16,
    "button-icon-gap": 8,
    "badge-padding": 8,
    "badge-icon-gap": 4,
    "amount-unit-gap": 4,
    "chip-padding": 16,
    "chip-gap": 8,
    "touch-gap-min": 8,
    "month-grid-margin": 0,
    "action-bar-padding-block": 12,
    "action-bar-gap": 8,
    "segmented-padding": 4,
    "empty-state-gap": 16,
    "empty-state-content-max": 280,
    "pressed-row-inset": 8,
    "scroll-peek-min": 24,
    "scroll-end-padding": 16
  },
  radius: {
    "2xs": 4,
    xs: 6,
    sm: 8,
    inset: 12,
    md: 16,
    lg: 24,
    "signature-outer": 28,
    xl: 32,
    full: 9999,
    "entity-32": 10,
    "entity-44": 14,
    "entity-64": 20,
    "nested-min": 4
  },
  border: {
    hairline: 1,
    field: 1,
    "field-focus": 2,
    draft: 2,
    "focus-ring-width": 2,
    "focus-ring-offset": 2,
    "field-focus-halo": 4,
    underline: 1,
    "underline-offset": 3,
    "signal-line": 2
  },
  elevation: {
    surface: "none",
    float: "0 12px 32px rgb(16 23 25 / 12%)"
  },
  layer: {
    content: 0,
    sticky: 10,
    bars: 20,
    scrim: 30,
    sheet: 40,
    "scrim-2": 50,
    "sheet-2": 60,
    toast: 70,
    "max-stacked-sheets": 2
  },
  size: {
    "touch-min": 48,
    "touch-driver": 56,
    button: 52,
    "button-compact": 44,
    "button-min-width": 96,
    "icon-button": 48,
    field: 56,
    "amount-field": 72,
    search: 52,
    chip: 40,
    "chip-max-width": 200,
    segmented: 48,
    "segment-min-width": 72,
    "context-bar": 56,
    "tab-bar": 64,
    "row-with-mark": 72,
    "row-plain": 56,
    "dot-signal": 6,
    "row-text-min-width": 96,
    badge: 24,
    "badge-max-width": 160,
    icon: [
      14,
      16,
      20,
      24
    ],
    entity: [
      32,
      44,
      64
    ],
    "ask-symbol": 28,
    "ask-symbol-inline": 16,
    "dot-ask": 6,
    "dot-unread": 8,
    "dot-unread-ring": 2,
    "dot-attention": 8,
    "dot-gallery": 6,
    "tile-height": 152,
    "hero-min-height": 152,
    "horizontal-card-width": 280,
    "handle-width": 36,
    "handle-height": 5,
    "handle-offset": 8,
    "sheet-height": [
      "50%",
      "92%"
    ],
    "sheet-tablet-width": 560,
    "toast-tablet-max-width": 480,
    "chart-height": 160,
    "chart-label-height": 20,
    "bar-max-width": 24,
    "bar-width-ratio": 0.6,
    "sparkline-height": 24,
    "chart-area-opacity": 0.08,
    "keypad-key": [
      64,
      56
    ],
    "photo-tile": 96,
    "weekstrip-cell": [
      44,
      56
    ],
    "timeline-hour": 64,
    spinner: 20,
    "spinner-stroke": 2,
    "spinner-arc": 0.75,
    "skeleton-line-body": 12,
    "skeleton-line-caption": 10,
    "skeleton-widths": [
      "72%",
      "48%"
    ],
    "skeleton-hero": [
      160,
      32
    ],
    "amount-hidden-glyphs": 4,
    "min-content-width-phone": 328,
    "content-width-phone": [
      328,
      398
    ],
    "lab-viewport": [
      360,
      780
    ],
    "surface-min-width": 320,
    "row-min-width": 288,
    "row-trailing-max-ratio": 0.5,
    "tile-min-width": 158,
    "tile-max-width": 354,
    "textfield-min-width": 160,
    "switcher-min-width": 120,
    "tab-item-max-width": 120,
    "entity-badge": 18,
    "entity-badge-overlap": 4,
    "title-max-lines": 2,
    "toast-max-lines": 2,
    "max-segments": 4,
    "max-wells-per-surface": 2
  },
  motion: {
    "press-in": {
      ms: 80,
      ease: "ease-out",
      "scale-surface": 0.98,
      "scale-button": 0.96
    },
    "press-out": {
      ms: 160,
      ease: "cubic-bezier(.2,0,0,1)"
    },
    quick: {
      ms: 160,
      ease: "cubic-bezier(.2,0,0,1)"
    },
    standard: {
      ms: 240,
      ease: "cubic-bezier(.2,0,0,1)"
    },
    emphasized: {
      ms: 360,
      ease: "cubic-bezier(.32,.72,0,1)"
    },
    exit: {
      ms: 200,
      ease: "cubic-bezier(.4,0,1,1)"
    },
    fade: {
      ms: 150,
      "tab-shift": 8
    },
    count: {
      ms: 400,
      ease: "ease-out",
      "on-first-load": !1
    },
    "check-draw": {
      ms: 300,
      ease: "ease-out"
    },
    growth: {
      ms: 400,
      ease: "ease-out",
      once: !0
    },
    stagger: {
      ms: 20,
      "max-items": 6,
      "only-first-entry": !0
    },
    "ask-think-step": {
      ms: 240,
      pause: 120
    },
    splash: {
      ms: 600
    },
    spinner: {
      ms: 800,
      ease: "linear"
    },
    "skeleton-pulse": {
      ms: 1400,
      ease: "ease-in-out",
      from: 1,
      to: 0.55,
      "show-after": 300,
      "min-visible": 500
    },
    toast: {
      ms: 3e3,
      "with-action-ms": 5e3,
      "enter-shift": 16
    },
    "sheet-dismiss": {
      "drag-ratio": 0.3,
      "velocity-px-per-ms": 0.6
    },
    "press-cancel-px": 8,
    "response-max-ms": 100
  },
  breakpoint: {
    "phone-min": 360,
    "phone-max": 430,
    "tablet-min": 744,
    "content-max": 720
  },
  quality: {
    "font-layout-shift-max-px": 2,
    "fps-min": 60,
    "text-scale-max": 2,
    "max-badges-per-screen": 6,
    "max-overview-items": 5,
    "max-tile-facts": 2,
    "max-signal-per-screen": 3,
    "max-signal-per-component": 1,
    "max-hub-sections": 6,
    "max-text-lines": 2
  }
};
function ie(e) {
  let t = se;
  for (const n of e.split("."))
    t = t[n];
  return t;
}
const w = {
  // --- Buttons and links (BRIEF 24.1: verb + object, ≤ 3 words) ---
  "button.saveMovement": { kind: "button", text: "احفظ الحركة" },
  "button.acceptQuote": { kind: "button", text: "اقبل العرض" },
  "button.recordPayment": { kind: "button", text: "سجّل دفعة" },
  "button.deleteMovement": { kind: "button", text: "احذف الحركة" },
  "button.back": { kind: "button", text: "رجوع" },
  "button.retry": { kind: "button", text: "أعد المحاولة" },
  "button.recordMovement": { kind: "button", text: "سجّل حركة" },
  "button.reviewAndSave": { kind: "button", text: "راجع واحفظ" },
  "button.all": { kind: "button", text: "الكل" },
  "button.undo": { kind: "button", text: "تراجع" },
  "button.howCalculated": { kind: "button", text: "كيف حُسبت؟" },
  "button.hideAmounts": { kind: "button", text: "إخفاء المبالغ" },
  "button.showAmounts": { kind: "button", text: "إظهار المبالغ" },
  "metric.sourceFrom": { kind: "button", text: "من {counted}" },
  // --- Titles (BRIEF 24: ≤ 3 words) ---
  "title.today": { kind: "title", text: "اليوم" },
  "title.needsYou": { kind: "title", text: "يحتاجك" },
  "title.now": { kind: "title", text: "الآن" },
  "confirm.deleteTitle": { kind: "title", text: "تحذف حركة {amount}؟" },
  // --- Badges: status words, nav labels, roles, movement types (≤ 2 words) ---
  "badge.done": { kind: "badge", text: "تمّ" },
  "badge.waiting": { kind: "badge", text: "ينتظر" },
  "badge.problem": { kind: "badge", text: "مشكلة" },
  "badge.info": { kind: "badge", text: "معلومة" },
  "badge.neutral": { kind: "badge", text: "محايد" },
  "badge.cancelled": { kind: "badge", text: "ملغى" },
  "nav.today": { kind: "badge", text: "اليوم" },
  "nav.todayLong": { kind: "badge", text: "مشروع اليوم" },
  "nav.agenda": { kind: "badge", text: "الأجندة" },
  "nav.finance": { kind: "badge", text: "المالية" },
  "nav.orders": { kind: "badge", text: "الطلبات" },
  "nav.delivery": { kind: "badge", text: "التوصيل" },
  "nav.market": { kind: "badge", text: "السوق" },
  "role.owner": { kind: "badge", text: "مالك" },
  "role.supplier": { kind: "badge", text: "مورد" },
  "role.driver": { kind: "badge", text: "سائق" },
  "role.reviewer": { kind: "badge", text: "مراجع" },
  "role.admin": { kind: "badge", text: "مسؤول" },
  "movement.in": { kind: "badge", text: "داخل" },
  "movement.counted": { kind: "badge", text: "32 حركة" },
  "row.sampleTitle": { kind: "title", text: "سلمى الحوراني" },
  "sheet.sampleTitle": { kind: "title", text: "تفاصيل الحركة" },
  "title.sheet": { kind: "title", text: "الورقة" },
  "confirm.sampleTitle": { kind: "title", text: "حذف الحركة؟" },
  "confirm.sampleSentence": { kind: "help", text: "ستُحذف الحركة نهائياً ولا يمكن التراجع عنها." },
  "title.confirmSheet": { kind: "title", text: "ورقة التأكيد" },
  "row.sampleCaption": { kind: "help", text: "فستان سهرة · درج الكاش" },
  "row.sampleTime": { kind: "help", text: "10:24 ص" },
  "title.objectRow": { kind: "title", text: "الصف" },
  "state.oneLine": { kind: "badge", text: "سطر واحد" },
  "state.withBadge": { kind: "badge", text: "مع شارة" },
  "title.objectCard": { kind: "title", text: "بطاقة الكائن" },
  "state.withButton": { kind: "badge", text: "مع زر" },
  "title.metric": { kind: "title", text: "المقياس" },
  "title.metricSmall": { kind: "title", text: "المقياس الصغير" },
  "movement.out": { kind: "badge", text: "خارج" },
  "movement.transfer": { kind: "badge", text: "تحويل" },
  // --- SaveState (BRIEF 9.5, 11.1 — the four states, verbatim) ---
  "saveState.draft": { kind: "badge", text: "مسودة · لم تُحفظ" },
  "saveState.sending": { kind: "badge", text: "يُرسل…" },
  "saveState.saved": { kind: "badge", text: "حُفظ" },
  "saveState.failed": { kind: "error", text: "لم يُحفظ — أعد المحاولة" },
  // --- Success toasts (BRIEF 24.4: passive past + object, ≤ 5 words) ---
  "toast.movementSaved": { kind: "success", text: "حُفظت الحركة" },
  "toast.movementDeleted": { kind: "success", text: "حُذفت الحركة" },
  "toast.quoteAccepted": { kind: "success", text: "قُبل العرض" },
  // --- InlineBanner / ErrorState (BRIEF 9.5, 11.3, 24.5) ---
  "banner.offline": { kind: "error", text: "الاتصال انقطع" },
  "banner.backOnline": { kind: "help", text: "عاد الاتصال، لديك مسودة" },
  "banner.permission": { kind: "help", text: "هذا خارج صلاحياتك في هذا المشروع" },
  "errorState.loadFailed": { kind: "error", text: "تعذّر تحميل البيانات. أعد المحاولة." },
  "errorState.updatedAt": { kind: "help", text: "آخر تحديث {time}" },
  // --- EmptyState (BRIEF 23.7, 24.6) ---
  "empty.movements": { kind: "empty", text: "حركات اليوم تظهر هنا." },
  // --- ConfirmSheet result sentence (BRIEF 24.3) ---
  "confirm.deleteResult": { kind: "help", text: "لن تظهر في رصيد {fund}." },
  // --- Metric delta lines (BRIEF 23.8 + 23.22 hidden form) ---
  "metric.deltaHigher": { kind: "help", text: "{percent} أعلى من أمس" },
  "metric.deltaLower": { kind: "help", text: "{percent} أقل من أمس" },
  "metric.deltaHigherHidden": { kind: "help", text: "أعلى من أمس" },
  "metric.deltaLowerHidden": { kind: "help", text: "أقل من أمس" },
  // --- Money fragments (BRIEF 8; display fragments -> badge) ---
  "money.unit": { kind: "badge", text: "د.أ" },
  "money.forYou": { kind: "badge", text: "لك" },
  "money.againstYou": { kind: "badge", text: "عليك" },
  "money.missing": { kind: "badge", text: "—" },
  "money.hiddenGlyph": { kind: "badge", text: "••••" },
  // --- Lab chrome and state names (plan K27/K32: the lab shows component and
  //     state names only; every word lives here, not in lab source) ---
  "lab.stamp": { kind: "title", text: "مختبر الدفعة الأولى" },
  "lab.fontScale": { kind: "badge", text: "حجم الخط" },
  "lab.scale100": { kind: "button", text: "100%" },
  "lab.scale200": { kind: "button", text: "200%" },
  "title.money": { kind: "title", text: "المبلغ" },
  "title.amountToggle": { kind: "title", text: "إخفاء المبالغ وإظهارها" },
  "title.statusBadge": { kind: "title", text: "شارة الحالة" },
  "state.tones": { kind: "badge", text: "النغمات" },
  "title.entityMark": { kind: "title", text: "علامة الكيان" },
  "title.iconButton": { kind: "title", text: "زر الأيقونة" },
  "title.textField": { kind: "title", text: "حقل النص" },
  "field.supplier": { kind: "badge", text: "اسم المورد" },
  "field.amount": { kind: "badge", text: "المبلغ" },
  "placeholder.amount": { kind: "placeholder", text: "0.000" },
  "help.supplierName": { kind: "help", text: "اكتب الاسم كما في السجل الرسمي" },
  "error.phoneFormat": { kind: "error", text: "اكتب الرقم كاملاً بالأرقام الغربية" },
  "state.initial": { kind: "badge", text: "الحرف الأول" },
  "state.fundTypes": { kind: "badge", text: "أنواع الصناديق" },
  "state.badged": { kind: "badge", text: "بشارة تحقق" },
  "title.button": { kind: "title", text: "الزر" },
  "variant.primary": { kind: "badge", text: "أساسي" },
  "variant.secondary": { kind: "badge", text: "ثانوي" },
  "variant.text": { kind: "badge", text: "نصي" },
  "variant.danger": { kind: "badge", text: "خطر" },
  "state.withIcon": { kind: "badge", text: "بأيقونة" },
  "title.segmentedControl": { kind: "title", text: "المبدّل المقسّم" },
  "state.twoSegments": { kind: "badge", text: "جزآن" },
  "state.threeSegments": { kind: "badge", text: "ثلاثة أجزاء" },
  "state.fourSegments": { kind: "badge", text: "أربعة أجزاء" },
  "title.filterChips": { kind: "title", text: "رقائق التصفية" },
  "title.surface": { kind: "title", text: "السطح" },
  "state.withHeader": { kind: "badge", text: "برأس" },
  "state.list": { kind: "badge", text: "قائمة" },
  "title.well": { kind: "title", text: "الحاوي الغائر" },
  "title.section": { kind: "title", text: "القسم" },
  "state.withCount": { kind: "badge", text: "مع عدد" },
  "state.emptySection": { kind: "badge", text: "فارغ" },
  "title.tile": { kind: "title", text: "البلاطات" },
  "state.grid4": { kind: "badge", text: "شبكة 2×2" },
  "title.hero": { kind: "title", text: "السطح البطل" },
  "title.actionBar": { kind: "title", text: "شريط الإجراءات" },
  "state.withSecondary": { kind: "badge", text: "مع ثانوي" },
  "state.primaryOnly": { kind: "badge", text: "أساسي وحده" },
  "state.contentMore": { kind: "badge", text: "بقي محتوى" },
  "state.scrolledToEnd": { kind: "badge", text: "انتهى التمرير" },
  "title.askButton": { kind: "title", text: "زر Ask" },
  "state.unread": { kind: "badge", text: "غير مقروء" },
  "title.notificationsButton": { kind: "title", text: "زر الإشعارات" },
  "state.noUnread": { kind: "badge", text: "بلا نقطة" },
  "title.projectSwitcher": { kind: "title", text: "مبدّل المشروع" },
  "state.singleRole": { kind: "badge", text: "دور واحد" },
  "title.contextBar": { kind: "title", text: "شريط السياق" },
  "state.mainScreens": { kind: "badge", text: "الشاشات الرئيسية" },
  "state.subScreens": { kind: "badge", text: "الشاشات الفرعية" },
  "sr.switchProject": { kind: "screen-reader", text: "تبديل المشروع" },
  "title.tabBar": { kind: "title", text: "شريط التبويبات" },
  "title.pageHeader": { kind: "title", text: "رأس الصفحة" },
  "title.movements": { kind: "title", text: "الحركات" },
  "button.new": { kind: "button", text: "جديد" },
  "state.scrolled": { kind: "badge", text: "عند التمرير" },
  "title.saveState": { kind: "title", text: "حالة الحفظ" },
  "title.toast": { kind: "title", text: "الإشعار العابر" },
  "title.inlineBanner": { kind: "title", text: "الشريط المثبت" },
  "title.emptyState": { kind: "title", text: "حالة الفراغ" },
  "title.skeleton": { kind: "title", text: "هيكل التحميل" },
  "lab.index": { kind: "help", text: "فهرس المكوّنات" },
  "state.defaultToast": { kind: "badge", text: "ثلاث ثوانٍ" },
  "state.draft": { kind: "badge", text: "مسودة" },
  "state.sending": { kind: "badge", text: "يُرسل" },
  "state.fiveTabs": { kind: "badge", text: "خمسة تبويبات" },
  "state.withCents": { kind: "badge", text: "مع فلوس" },
  "state.longNumber": { kind: "badge", text: "رقم طويل" },
  "state.multiSelect": { kind: "badge", text: "تحديد متعدد" },
  "state.scrollRow": { kind: "badge", text: "قابل للتمرير" },
  "state.driver": { kind: "badge", text: "وضع السائق" },
  "state.default": { kind: "badge", text: "افتراضي" },
  "state.debt": { kind: "badge", text: "دين" },
  "state.hidden": { kind: "badge", text: "مخفي" },
  "state.missing": { kind: "badge", text: "مفقود" },
  "state.loading": { kind: "badge", text: "تحميل" },
  "state.empty": { kind: "badge", text: "فراغ" },
  "state.normal": { kind: "badge", text: "عادي" },
  "state.disabled": { kind: "badge", text: "معطّل" },
  "state.longest": { kind: "badge", text: "أطول قيمة" },
  "state.sizes": { kind: "badge", text: "المقاسات" },
  "state.tabular": { kind: "badge", text: "أرقام جدولية" },
  // --- Money aria words (BRIEF 23.17; assembled in lib/format-money.ts) ---
  "money.ariaMinus": { kind: "screen-reader", text: "سالب" },
  "money.ariaDinar": { kind: "screen-reader", text: "دينار" },
  "money.ariaFils": { kind: "screen-reader", text: "فلس" },
  "money.ariaAnd": { kind: "screen-reader", text: "و" },
  "money.ariaHidden": { kind: "screen-reader", text: "المبلغ مخفي" },
  "money.ariaMissing": { kind: "screen-reader", text: "القيمة غير متوفرة" },
  // --- Screen-reader announcements (BRIEF 23.17, verbatim where quoted) ---
  "sr.notifications": { kind: "screen-reader", text: "الإشعارات" },
  "sr.notificationsCount": { kind: "screen-reader", text: "الإشعارات، {counted}" },
  "sr.askUnread": { kind: "screen-reader", text: "Ask Micro، جواب غير مقروء" },
  "sr.financeNeedsYou": { kind: "screen-reader", text: "المالية، يحتاجك" },
  "sr.askThinking": { kind: "screen-reader", text: "يعمل Micro على الجواب" },
  "sr.askAnswered": { kind: "screen-reader", text: "وصل الجواب" },
  "sr.quoteArrived": { kind: "screen-reader", text: "وصل عرض سعر من {name}" },
  "sr.searchResults": { kind: "screen-reader", text: "{counted}" },
  "sr.ask": { kind: "screen-reader", text: "Ask Micro" },
  "sr.close": { kind: "screen-reader", text: "إغلاق" },
  "sr.back": { kind: "screen-reader", text: "رجوع" },
  "sr.more": { kind: "screen-reader", text: "المزيد" },
  "sr.search": { kind: "screen-reader", text: "بحث" },
  "sr.clear": { kind: "screen-reader", text: "مسح" },
  "sr.saveSaved": { kind: "screen-reader", text: "حُفظت الحركة" },
  "sr.saveFailed": { kind: "error", text: "لم تُحفظ الحركة. الاتصال انقطع." },
  // --- Field placeholder, format only (BRIEF 23.24(10)) ---
  "placeholder.phone": { kind: "placeholder", text: "07X XXX XXXX" }
};
function A(e, t) {
  let n = w[e].text;
  if (t)
    for (const [s, i] of Object.entries(t))
      n = n.replaceAll(`{${s}}`, String(i));
  return n;
}
const re = {
  movements: { zero: "لا حركات", one: "حركة واحدة", two: "حركتين", few: "حركات", many: "حركة" },
  orders: { zero: "لا طلبات", one: "طلب واحد", two: "طلتان", few: "طلبات", many: "طلب" },
  quotes: { zero: "لا عروض", one: "عرض واحد", two: "عرضان", few: "عروض", many: "عرض" },
  results: { zero: "لا نتائج", one: "نتيجة واحدة", two: "نتيجتان", few: "نتائج", many: "نتيجة" },
  unread: { zero: "لا شيء غير مقروء", one: "غير مقروء واحد", two: "غير مقروءان", few: "غير مقروءة", many: "غير مقروءة" }
}, V = {
  unit: w["money.unit"].text,
  minus: w["money.ariaMinus"].text,
  dinar: w["money.ariaDinar"].text,
  fils: w["money.ariaFils"].text,
  and: w["money.ariaAnd"].text,
  forYou: w["money.forYou"].text,
  againstYou: w["money.againstYou"].text,
  hidden: w["money.ariaHidden"].text,
  missing: w["money.ariaMissing"].text,
  hiddenGlyph: w["money.hiddenGlyph"].text,
  missingGlyph: w["money.missing"].text
}, oe = new Intl.PluralRules("ar");
function le(e, t) {
  switch (oe.select(e)) {
    case "zero":
      return t.zero;
    case "one":
      return t.one;
    case "two":
      return t.two;
    case "few":
      return `${e} ${t.few}`;
    case "many":
      return `${e} ${t.many}`;
    default:
      return `${e} ${t.many}`;
  }
}
const de = "ص", ce = "م";
function Q(e) {
  return `${e < 10 ? "0" : ""}${e}`;
}
function ue(e) {
  return e instanceof Date ? { h: e.getHours(), m: e.getMinutes() } : e;
}
function Wt(e) {
  const { h: t, m: n } = ue(e), s = t < 12 ? de : ce, i = t % 12 === 0 ? 12 : t % 12;
  return `${Q(i)}:${Q(n)} ${s}`;
}
const T = "−", me = "+", P = 3;
function he(e) {
  const t = String(e).trim(), n = t.startsWith("-"), s = n ? t.slice(1) : t, [i = "0", r = ""] = s.split("."), o = i.replace(/[^0-9]/g, "") || "0", d = (r + "000").slice(0, P), l = BigInt(o) * 10n ** BigInt(P) + BigInt(d || "0");
  return { negative: n, fils: l };
}
function fe(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function ge(e) {
  const t = 10n ** BigInt(P), n = e / t, s = e % t;
  return {
    int: fe(n.toString()),
    frac: s === 0n ? "" : `.${s.toString().padStart(P, "0")}`
  };
}
function $(e, t) {
  const n = 10n ** BigInt(P), s = e / n, i = e % n;
  let r = `${s.toString()} ${t.dinar}`;
  return i !== 0n && (r += ` ${t.and}${i.toString()} ${t.fils}`), r;
}
function pe(e, t) {
  const n = t.texts;
  if (e == null)
    return {
      missing: !0,
      hidden: !1,
      debt: t.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: "",
      debtWord: t.debt === "forYou" ? n.forYou : t.debt === "againstYou" ? n.againstYou : "",
      display: n.missingGlyph,
      aria: n.missing
    };
  if (t.hidden) {
    const g = t.debt === "forYou" ? n.forYou : t.debt === "againstYou" ? n.againstYou : "", f = g ? `${g} ${n.hiddenGlyph} ${n.unit}` : `${n.hiddenGlyph} ${n.unit}`;
    return {
      missing: !1,
      hidden: !0,
      debt: t.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: n.unit,
      debtWord: g,
      display: f,
      aria: n.hidden
    };
  }
  const { negative: i, fils: r } = he(e), o = ge(r), d = t.debt === "forYou" ? n.forYou : t.debt === "againstYou" ? n.againstYou : "", l = d ? "" : t.direction === "in" ? me : t.direction === "out" ? T : t.direction === "transfer" ? "" : i ? T : "", c = `${l}${o.int}${o.frac}`, m = d ? `${d} ${c} ${n.unit}` : `${c} ${n.unit}`;
  let u;
  return d ? u = `${d} ${$(r, n)}` : l === T ? u = `${n.minus} ${$(r, n)}` : u = $(r, n), {
    missing: !1,
    hidden: !1,
    debt: t.debt ?? null,
    sign: l,
    int: o.int,
    frac: o.frac,
    unit: n.unit,
    debtWord: d,
    display: m,
    aria: u
  };
}
const W = G({ hidden: !1 });
function be({ children: e, hidden: t = !1 }) {
  const n = _(() => ({ hidden: t }), [t]);
  return /* @__PURE__ */ a(W.Provider, { value: n, children: e });
}
function j() {
  const { hidden: e } = F(W);
  return { hidden: e, visible: !e };
}
const xe = 500, ve = ie("motion.press-cancel-px");
function k(e = {}) {
  const { onPress: t, onLongPress: n, disabled: s } = e, [i, r] = Z(!1), o = y(null), d = y(null), l = y(!1), c = H(() => {
    d.current !== null && (clearTimeout(d.current), d.current = null);
  }, []), m = H(() => {
    c(), o.current = null, l.current = !1, r(!1);
  }, [c]), u = H(
    (p) => {
      if (!s && !(p.pointerType === "mouse" && p.button !== 0)) {
        if (typeof p.currentTarget.setPointerCapture == "function")
          try {
            p.currentTarget.setPointerCapture(p.pointerId);
          } catch {
          }
        o.current = { x: p.clientX, y: p.clientY }, l.current = !1, r(!0), n && (d.current = setTimeout(() => {
          l.current = !0, n();
        }, xe));
      }
    },
    [s, n]
  ), g = H(
    (p) => {
      if (!i || o.current === null) return;
      const b = p.clientX - o.current.x, v = p.clientY - o.current.y;
      Math.hypot(b, v) > ve && m();
    },
    [i, m]
  ), f = H(
    (p) => {
      if (!i) return;
      const b = l.current;
      m(), !b && !s && t?.();
    },
    [i, s, t, m]
  );
  return {
    isPressed: i,
    pressProps: {
      onPointerDown: u,
      onPointerMove: g,
      onPointerUp: f,
      onPointerCancel: m
    }
  };
}
const we = () => typeof window > "u" || !window.visualViewport ? {
  height: typeof window > "u" ? 0 : window.innerHeight,
  offsetTop: 0,
  scale: 1,
  keyboardHeight: 0
} : X(window.visualViewport);
function X(e) {
  const t = e.height, n = e.offsetTop, s = Math.max(0, window.innerHeight - t - n);
  return { height: t, offsetTop: n, scale: e.scale, keyboardHeight: s };
}
function ke() {
  const [e, t] = Z(we);
  return M(() => {
    const n = window.visualViewport;
    if (!n) return;
    const s = () => t(X(n));
    return s(), n.addEventListener("resize", s), n.addEventListener("scroll", s), window.addEventListener("resize", s), window.addEventListener("orientationchange", s), () => {
      n.removeEventListener("resize", s), n.removeEventListener("scroll", s), window.removeEventListener("resize", s), window.removeEventListener("orientationchange", s);
    };
  }, []), e;
}
const E = G({
  sheetIds: [],
  registerSheet: () => {
  },
  unregisterSheet: () => {
  }
});
function ye(e, t) {
  switch (t.type) {
    case "register":
      return e.includes(t.id) ? e : [...e, t.id];
    case "unregister":
      return e.includes(t.id) ? e.filter((n) => n !== t.id) : e;
    default:
      return e;
  }
}
function Xt({ children: e }) {
  const [t, n] = ee(ye, []), s = H((o) => n({ type: "register", id: o }), []), i = H((o) => n({ type: "unregister", id: o }), []), r = _(
    () => ({ sheetIds: t, registerSheet: s, unregisterSheet: i }),
    [t, s, i]
  );
  return /* @__PURE__ */ a(E.Provider, { value: r, children: e });
}
function Ut() {
  const { sheetIds: e, registerSheet: t, unregisterSheet: n } = F(E), s = te();
  ne(() => (t(s), () => n(s)), [s, t, n]);
  const i = e.indexOf(s) + 1 || e.length + 1, r = Math.min(i, 2), o = i === e.length;
  return {
    level: r,
    overLimit: i > 2,
    sheetZ: r === 1 ? "var(--mds-layer-sheet)" : "var(--mds-layer-sheet-2)",
    scrimZ: r === 1 ? "var(--mds-layer-scrim)" : "var(--mds-layer-scrim-2)",
    isTop: o
  };
}
function qt() {
  const { sheetIds: e } = F(E);
  return e.length;
}
const Ae = /* @__PURE__ */ h("g", { transform: "translate(16 16)", id: "micro-symbol-master-2", children: [
  /* @__PURE__ */ a("g", { id: "module-top", transform: "rotate(0 96 96)", children: /* @__PURE__ */ a("path", { id: "shape-top", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ a("g", { id: "module-right", transform: "rotate(90 96 96)", children: /* @__PURE__ */ a("path", { id: "shape-right", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-signal)" }) }),
  /* @__PURE__ */ a("g", { id: "module-bottom", transform: "rotate(180 96 96)", children: /* @__PURE__ */ a("path", { id: "shape-bottom", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ a("g", { id: "module-left", transform: "rotate(270 96 96)", children: /* @__PURE__ */ a("path", { id: "shape-left", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-data)" }) })
] });
function Ne({ size: e = 28, className: t, ...n }) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 224 224",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", t].filter(Boolean).join(" "),
      ...n,
      children: Ae
    }
  );
}
const Be = {
  regular: /* @__PURE__ */ a("path", { d: "M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z" })
};
function Jt({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Be[t]
    }
  );
}
const He = {
  regular: /* @__PURE__ */ a("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z" })
};
function Kt({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: He[t]
    }
  );
}
const Se = {
  regular: /* @__PURE__ */ a("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z" })
};
function en({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Se[t]
    }
  );
}
const Ze = {
  regular: /* @__PURE__ */ a("path", { d: "M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A8.13,8.13,0,0,0,255.43,117ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208ZM32,136V72H176v64Zm160,72a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm0-96V88h34.58l9.6,24Z" })
};
function tn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", n].filter(Boolean).join(" "),
      ...s,
      children: Ze[t]
    }
  );
}
const Me = {
  regular: /* @__PURE__ */ a("path", { d: "M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z" })
};
function nn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Me[t]
    }
  );
}
const Pe = {
  regular: /* @__PURE__ */ a("path", { d: "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" })
};
function Ce({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Pe[t]
    }
  );
}
const je = {
  regular: /* @__PURE__ */ a("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" })
};
function Ve({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: je[t]
    }
  );
}
const Te = {
  regular: /* @__PURE__ */ a("path", { d: "M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" })
};
function $e({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Te[t]
    }
  );
}
const Ie = {
  regular: /* @__PURE__ */ a("path", { d: "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" })
};
function an({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", n].filter(Boolean).join(" "),
      ...s,
      children: Ie[t]
    }
  );
}
const Le = {
  bold: /* @__PURE__ */ a("path", { d: "M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" })
};
function Fe({
  size: e = 16,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", n].filter(Boolean).join(" "),
      ...s,
      children: Le[t]
    }
  );
}
const Ee = {
  bold: /* @__PURE__ */ a("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" })
};
function De({
  size: e = 16,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Ee[t]
    }
  );
}
const Ye = {
  regular: /* @__PURE__ */ a("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function Re({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Ye[t]
    }
  );
}
const Oe = {
  bold: /* @__PURE__ */ a("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function ze({
  size: e = 16,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Oe[t]
    }
  );
}
const Qe = {
  regular: /* @__PURE__ */ a("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" })
};
function sn({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Qe[t]
    }
  );
}
const _e = {
  fill: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function rn({
  size: e = 20,
  weight: t = "fill",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: _e[t]
    }
  );
}
const Ge = {
  bold: /* @__PURE__ */ a("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function on({
  size: e = 16,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Ge[t]
    }
  );
}
const We = {
  bold: /* @__PURE__ */ a("path", { d: "M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" })
};
function ln({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: We[t]
    }
  );
}
const Xe = {
  bold: /* @__PURE__ */ a("path", { d: "M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" })
};
function dn({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Xe[t]
    }
  );
}
const Ue = {
  bold: /* @__PURE__ */ a("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function U({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Ue[t]
    }
  );
}
const qe = {
  bold: /* @__PURE__ */ a("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z" })
};
function Je({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: qe[t]
    }
  );
}
const Ke = {
  bold: /* @__PURE__ */ a("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function D({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Ke[t]
    }
  );
}
const et = {
  bold: /* @__PURE__ */ a("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" })
};
function tt({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: et[t]
    }
  );
}
const nt = {
  bold: /* @__PURE__ */ a("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" })
};
function at({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: nt[t]
    }
  );
}
const st = {
  regular: /* @__PURE__ */ a("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" })
};
function cn({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: st[t]
    }
  );
}
const it = {
  regular: /* @__PURE__ */ a("path", { d: "M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z" })
};
function rt({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: it[t]
    }
  );
}
const ot = {
  regular: /* @__PURE__ */ a("path", { d: "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z" })
};
function lt({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: ot[t]
    }
  );
}
const dt = {
  regular: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" })
};
function ct({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: dt[t]
    }
  );
}
const ut = {
  regular: /* @__PURE__ */ a("path", { d: "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z" })
};
function un({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: ut[t]
    }
  );
}
const mt = {
  fill: /* @__PURE__ */ a("path", { d: "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" })
};
function ht({
  size: e = 14,
  weight: t = "fill",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: mt[t]
    }
  );
}
const ft = {
  fill: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" })
};
function gt({
  size: e = 14,
  weight: t = "fill",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: ft[t]
    }
  );
}
const pt = {
  regular: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function bt({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: pt[t]
    }
  );
}
const xt = {
  regular: /* @__PURE__ */ a("path", { d: "M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM80,40h40V56H80ZM54.25,72h147.5l20,80H34.25ZM32,192V168H224v24ZM64,96a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,96ZM64,128a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,128Z" })
};
function mn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: xt[t]
    }
  );
}
const vt = {
  regular: /* @__PURE__ */ a("path", { d: "M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z" })
};
function hn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: vt[t]
    }
  );
}
const wt = {
  regular: /* @__PURE__ */ a("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" })
};
function fn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: wt[t]
    }
  );
}
const kt = {
  regular: /* @__PURE__ */ a("path", { d: "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z" })
};
function gn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", n].filter(Boolean).join(" "),
      ...s,
      children: kt[t]
    }
  );
}
const yt = {
  regular: /* @__PURE__ */ a("path", { d: "M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9ZM164,96a36,36,0,0,0,5.9-.48,36,36,0,1,0,28.22-47A36,36,0,1,0,164,96Zm60-12a20,20,0,1,1-20-20A20,20,0,0,1,224,84ZM164,40a20,20,0,0,1,19.25,14.61,36,36,0,0,0-15,24.93A20.42,20.42,0,0,1,164,80a20,20,0,0,1,0-40Z" })
};
function pn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: yt[t]
    }
  );
}
const At = {
  regular: /* @__PURE__ */ a("path", { d: "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" })
};
function bn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: At[t]
    }
  );
}
const Nt = {
  regular: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function xn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Nt[t]
    }
  );
}
const Bt = {
  regular: /* @__PURE__ */ a("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" })
};
function vn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Bt[t]
    }
  );
}
const Ht = {
  regular: /* @__PURE__ */ a("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function wn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Ht[t]
    }
  );
}
const St = {
  regular: /* @__PURE__ */ a("path", { d: "M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z" })
};
function kn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: St[t]
    }
  );
}
const Zt = {
  regular: /* @__PURE__ */ a("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" })
};
function yn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Zt[t]
    }
  );
}
const Mt = {
  regular: /* @__PURE__ */ a("path", { d: "M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z" })
};
function An({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...s
}) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...s,
      children: Mt[t]
    }
  );
}
const Nn = ["nav-delivery", "back", "forward", "transfer"];
function Bn({
  value: e,
  direction: t,
  debt: n,
  size: s = "md",
  state: i = "idle",
  disabled: r = !1,
  className: o,
  id: d,
  style: l,
  ref: c,
  ...m
}) {
  const { hidden: u } = j(), g = u && e !== null && e !== void 0, f = pe(e, { direction: t, debt: n, hidden: g, texts: V }), p = ["mds-money", `mds-money--${s}`, s === "lg" ? "mds-number-lg" : "", r ? "mds-money--disabled" : "", o].filter(Boolean).join(" ");
  return i === "loading" ? /* @__PURE__ */ a("span", { ref: c, id: d, style: l, className: p, "aria-busy": "true", ...m, children: /* @__PURE__ */ a("span", { className: "mds-money-skeleton", "aria-hidden": "true" }) }) : /* @__PURE__ */ h("span", { ref: c, id: d, style: l, className: p, ...m, children: [
    /* @__PURE__ */ h("span", { className: "mds-money-visual", "aria-hidden": "true", children: [
      f.debtWord ? /* @__PURE__ */ a("span", { className: "mds-money-debt", children: f.debtWord }) : null,
      f.missing ? /* @__PURE__ */ a("span", { className: "mds-money-missing", children: V.missingGlyph }) : /* @__PURE__ */ h(L, { children: [
        /* @__PURE__ */ a("bdi", { className: "mds-money-value", dir: "ltr", children: f.hidden ? V.hiddenGlyph : /* @__PURE__ */ h(L, { children: [
          /* @__PURE__ */ h("span", { className: "mds-money-integer", children: [
            f.sign,
            f.int
          ] }),
          f.frac ? /* @__PURE__ */ a("span", { className: "mds-money-fraction", children: f.frac }) : null
        ] }) }),
        /* @__PURE__ */ a("span", { className: "mds-money-unit", children: f.unit })
      ] })
    ] }, g ? "hidden" : "shown"),
    /* @__PURE__ */ a("span", { className: "mds-visually-hidden", children: f.aria })
  ] });
}
const Hn = [
  "default",
  "signedIn",
  "signedOut",
  "transfer",
  "debtForYou",
  "debtAgainstYou",
  "hidden",
  "missing",
  "loading",
  "disabled",
  "longest",
  "sizes"
];
function Pt({
  onChange: e,
  disabled: t = !1,
  density: n = "regular",
  className: s,
  id: i,
  style: r,
  ref: o,
  ...d
}) {
  const { hidden: l, visible: c } = j(), m = l ? $e : Ve, u = A(l ? "button.showAmounts" : "button.hideAmounts"), g = [
    "mds-amount-visibility-toggle",
    n === "large" ? "mds-amount-visibility-toggle--large" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      ref: o,
      id: i,
      style: r,
      ...d,
      type: "button",
      className: g,
      "aria-label": u,
      disabled: t,
      onClick: () => e?.(!c),
      children: /* @__PURE__ */ a(m, { size: 24 })
    }
  );
}
const Sn = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "amountsShown",
  "amountsHidden"
], Ct = {
  done: U,
  waiting: Je,
  problem: D,
  info: tt
}, jt = {
  done: w["badge.done"].text,
  waiting: w["badge.waiting"].text,
  problem: w["badge.problem"].text,
  info: w["badge.info"].text,
  neutral: w["badge.neutral"].text
};
function Zn({
  tone: e,
  label: t,
  className: n,
  id: s,
  style: i,
  ref: r,
  ...o
}) {
  const d = e === "neutral" ? null : Ct[e], l = ["mds-status-badge", `mds-status-badge--${e}`, n].filter(Boolean).join(" ");
  return /* @__PURE__ */ a("span", { ref: r, id: s, style: i, className: l, ...o, children: /* @__PURE__ */ h("span", { className: "mds-status-badge-content", children: [
    d ? /* @__PURE__ */ a(d, { size: 14 }) : null,
    /* @__PURE__ */ a("span", { className: "mds-status-badge-label", children: t ?? jt[e] })
  ] }, e) });
}
const Mn = [
  "neutral",
  "info",
  "done",
  "waiting",
  "problem",
  "longLabel"
], Vt = {
  done: ht,
  waiting: gt
};
function Tt(e) {
  const t = e.trim().split(/\s+/)[0];
  return t ? Array.from(t)[0] : void 0;
}
function Y({
  size: e = "md",
  value: t,
  tone: n,
  children: s,
  className: i,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const c = n === "done" || n === "waiting" ? Vt[n] : null, m = s ? void 0 : t ? Tt(t) : void 0, u = ["mds-entity-mark", `mds-entity-mark--${e}`, i].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("span", { ref: d, id: r, style: o, className: u, "aria-hidden": "true", ...l, children: [
    s ?? (m ? /* @__PURE__ */ a("span", { className: "mds-entity-mark-initial", children: m }) : null),
    c ? /* @__PURE__ */ a("span", { className: "mds-entity-mark-badge", children: /* @__PURE__ */ a(c, { size: 14 }) }) : null
  ] });
}
const Pn = [
  "initial",
  "sizes",
  "fundTypes",
  "approved",
  "pending",
  "withImageRule"
];
function C({
  variant: e = "primary",
  size: t = "md",
  loading: n = !1,
  leading: s,
  trailing: i,
  onPress: r,
  onLongPress: o,
  disabled: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  children: g,
  ...f
}) {
  const { isPressed: p, pressProps: b } = k({
    onPress: r,
    onLongPress: o,
    disabled: d || n
  }), v = [
    "mds-button",
    `mds-button--${e}`,
    `mds-button--${t}`,
    p ? "mds-button--pressed" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: u,
      id: c,
      style: m,
      ...f,
      ...b,
      type: "button",
      className: v,
      disabled: d,
      "aria-busy": n || void 0,
      children: [
        n ? /* @__PURE__ */ a("span", { className: "mds-button-spinner", "aria-hidden": "true" }) : s ? /* @__PURE__ */ a("span", { className: "mds-button-icon", children: s }) : null,
        /* @__PURE__ */ a("span", { className: "mds-button-label", children: g }),
        i ? /* @__PURE__ */ a("span", { className: "mds-button-icon", children: i }) : null
      ]
    }
  );
}
const Cn = [
  "default",
  "primary",
  "secondary",
  "text",
  "danger",
  "pressed",
  "focused",
  "disabled",
  "loading",
  "sm",
  "withIcon"
];
function $t({
  label: e,
  onPress: t,
  onLongPress: n,
  disabled: s = !1,
  density: i = "regular",
  className: r,
  id: o,
  style: d,
  ref: l,
  children: c,
  ...m
}) {
  const { isPressed: u, pressProps: g } = k({ onPress: t, onLongPress: n, disabled: s }), f = [
    "mds-icon-button",
    i === "large" ? "mds-icon-button--large" : "",
    u ? "mds-icon-button--pressed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      ref: l,
      id: o,
      style: d,
      ...m,
      ...g,
      type: "button",
      className: f,
      "aria-label": e,
      disabled: s,
      children: c
    }
  );
}
const jn = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "large"
];
function Vn({
  label: e,
  caption: t,
  value: n,
  onChange: s,
  placeholder: i,
  state: r = "idle",
  disabled: o = !1,
  className: d,
  id: l,
  style: c,
  ref: m,
  ...u
}) {
  const g = [
    "mds-text-field",
    r === "error" ? "mds-text-field--error" : "",
    o ? "mds-text-field--disabled" : "",
    d
  ].filter(Boolean).join(" "), f = l ? `${l}-input` : void 0;
  return /* @__PURE__ */ h("span", { ref: m, id: l, style: c, className: g, ...u, children: [
    /* @__PURE__ */ a("label", { className: "mds-text-field-label", htmlFor: f, children: e }),
    /* @__PURE__ */ a(
      "input",
      {
        id: f,
        className: "mds-text-field-input",
        type: "text",
        value: n,
        disabled: o,
        placeholder: i,
        "aria-label": l ? void 0 : e,
        "aria-invalid": r === "error" || void 0,
        onChange: (p) => s?.(p.target.value)
      }
    ),
    t ? /* @__PURE__ */ h("span", { className: r === "error" ? "mds-text-field-caption mds-text-field-caption--error" : "mds-text-field-caption", children: [
      r === "error" ? /* @__PURE__ */ a(D, { size: 14 }) : null,
      t
    ] }) : null
  ] });
}
const Tn = [
  "default",
  "focused",
  "disabled",
  "error",
  "withCaption",
  "withPlaceholder"
];
function $n({
  leading: e,
  value: t,
  onChange: n,
  disabled: s = !1,
  label: i,
  className: r,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  return /* @__PURE__ */ a(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-segmented", r].filter(Boolean).join(" "),
      role: "group",
      "aria-label": i,
      ...c,
      children: e.map((m) => /* @__PURE__ */ a(
        It,
        {
          segment: m,
          selected: m.value === t,
          disabled: s || m.disabled === !0,
          onChange: n
        },
        m.value
      ))
    }
  );
}
function It({
  segment: e,
  selected: t,
  disabled: n,
  onChange: s
}) {
  const { isPressed: i, pressProps: r } = k({ onPress: () => s(e.value), disabled: n }), o = [
    "mds-segmented-segment",
    t ? "mds-segmented-segment--selected" : "",
    i ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      type: "button",
      className: o,
      "aria-pressed": t === !0,
      disabled: n,
      "data-ds-exempt": n ? void 0 : "",
      ...r,
      children: [
        e.leading ? /* @__PURE__ */ a("span", { className: "mds-segmented-segment-icon", "aria-hidden": "true", children: e.leading }) : null,
        /* @__PURE__ */ a("span", { className: "mds-segmented-segment-label", children: e.label })
      ]
    }
  );
}
const In = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "threeSegments",
  "fourSegments",
  "withIcon"
];
function Ln({
  leading: e,
  value: t,
  onChange: n,
  disabled: s = !1,
  label: i,
  className: r,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = (u) => {
    const g = t.includes(u) ? t.filter((f) => f !== u) : [...t, u];
    n(g);
  };
  return /* @__PURE__ */ a(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-filter-chips", r].filter(Boolean).join(" "),
      role: "group",
      "aria-label": i,
      ...c,
      children: e.map((u) => /* @__PURE__ */ a(
        Lt,
        {
          chip: u,
          selected: t.includes(u.value),
          disabled: s || u.disabled === !0,
          onToggle: m
        },
        u.value
      ))
    }
  );
}
function Lt({
  chip: e,
  selected: t,
  disabled: n,
  onToggle: s
}) {
  const { isPressed: i, pressProps: r } = k({ onPress: () => s(e.value), disabled: n }), o = [
    "mds-filter-chip",
    t ? "mds-filter-chip--selected" : "",
    i ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      type: "button",
      className: o,
      "aria-pressed": t === !0,
      disabled: n,
      "data-ds-exempt": n ? void 0 : "",
      ...r,
      children: [
        t ? /* @__PURE__ */ a(ze, { size: 16, className: "mds-filter-chip-check" }) : null,
        /* @__PURE__ */ a("span", { className: "mds-filter-chip-label", children: e.label })
      ]
    }
  );
}
const Fn = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "manyChips"
];
function En({
  children: e,
  label: t,
  trailing: n,
  density: s = "regular",
  className: i,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const c = [
    "mds-surface",
    s === "list" ? "mds-surface--list" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("div", { ref: d, id: r, style: o, className: c, ...l, children: [
    t || n ? /* @__PURE__ */ h("div", { className: "mds-surface-header", children: [
      t ? /* @__PURE__ */ a("h3", { className: "mds-surface-title", children: t }) : null,
      n ? /* @__PURE__ */ a("div", { className: "mds-surface-action", children: n }) : null
    ] }) : null,
    e
  ] });
}
const Dn = [
  "default",
  "withHeader",
  "withAction",
  "pressed",
  "list"
];
function Yn({ children: e, className: t, id: n, style: s, ref: i, ...r }) {
  return /* @__PURE__ */ a(
    "div",
    {
      ref: i,
      id: n,
      style: s,
      className: ["mds-well", t].filter(Boolean).join(" "),
      ...r,
      children: e
    }
  );
}
const Rn = [
  "default",
  "inSurface"
];
function On({
  label: e,
  caption: t,
  onPress: n,
  children: s,
  className: i,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const c = s == null, { isPressed: m, pressProps: u } = k({ onPress: () => n?.(), disabled: c }), g = !c && n !== void 0, f = ["mds-section", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("section", { ref: d, id: r, style: o, className: f, ...l, children: [
    /* @__PURE__ */ h("header", { className: "mds-section-header", children: [
      /* @__PURE__ */ a("h2", { className: "mds-section-title mds-type-title-section", children: e }),
      t !== void 0 ? /* @__PURE__ */ a("span", { className: "mds-section-count", children: t }) : null,
      g ? /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: ["mds-section-see-all", m ? "mds-section-see-all--pressed" : ""].filter(Boolean).join(" "),
          "data-ds-exempt": "",
          ...u,
          children: [
            /* @__PURE__ */ a("span", { className: "mds-section-see-all-label", children: A("button.all") }),
            /* @__PURE__ */ a(Fe, { size: 16, className: "mds-section-see-all-icon" })
          ]
        }
      ) : null
    ] }),
    s
  ] });
}
const zn = [
  "default",
  "withCount",
  "withSeeAll",
  "empty"
];
function Qn({
  leading: e,
  label: t,
  state: n = !1,
  caption: s,
  value: i,
  trailing: r,
  draft: o,
  tone: d = "start",
  onPress: l,
  disabled: c = !1,
  className: m,
  id: u,
  style: g,
  ref: f,
  ...p
}) {
  const { isPressed: b, pressProps: v } = k({ onPress: () => l?.(), disabled: c }), N = [
    "mds-tile",
    `mds-tile--${d}`,
    b ? "mds-tile--pressed" : "",
    c ? "mds-tile--disabled" : "",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: f,
      id: u,
      style: g,
      type: "button",
      className: N,
      disabled: c,
      "data-ds-exempt": c ? void 0 : "",
      ...v,
      ...p,
      children: [
        /* @__PURE__ */ h("span", { className: "mds-tile-header", children: [
          e ? /* @__PURE__ */ a("span", { className: "mds-tile-header-icon", "aria-hidden": "true", children: e }) : null,
          /* @__PURE__ */ a("span", { className: "mds-tile-header-label mds-type-label", children: t }),
          n ? /* @__PURE__ */ a("span", { className: "mds-tile-dot", role: "img", "aria-label": s ?? "" }) : null
        ] }),
        /* @__PURE__ */ h("span", { className: "mds-tile-content", children: [
          o ? /* @__PURE__ */ a("span", { className: "mds-tile-sparkline", "aria-hidden": "true", children: o }) : null,
          /* @__PURE__ */ a("span", { className: "mds-tile-value", children: /* @__PURE__ */ a("bdi", { dir: "ltr", children: i ?? "—" }) }),
          r ? /* @__PURE__ */ a("span", { className: "mds-tile-line mds-type-caption", children: r }) : null
        ] })
      ]
    }
  );
}
const _n = [
  "default",
  "withDot",
  "withSparkline",
  "pressed",
  "focused",
  "disabled"
];
function Ft(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function Et({ value: e }) {
  const { hidden: t } = j(), { whole: n, cents: s } = Ft(t ? "—" : e), r = e.length > 9 ? "mds-hero-value--lg mds-number-lg" : "mds-hero-value--hero mds-type-display-hero";
  return /* @__PURE__ */ a("span", { className: `mds-hero-value ${r}`, children: /* @__PURE__ */ h("bdi", { dir: "ltr", children: [
    /* @__PURE__ */ a("span", { className: "mds-hero-value-whole", children: n }),
    s ? /* @__PURE__ */ a("span", { className: "mds-hero-value-cents", children: s }) : null
  ] }) });
}
function Gn({
  label: e,
  value: t,
  trailing: n,
  direction: s,
  debt: i,
  onDismiss: r,
  className: o,
  id: d,
  style: l,
  ref: c,
  ...m
}) {
  const { isPressed: u, pressProps: g } = k({ onPress: () => r?.() }), { hidden: f } = j(), p = ["mds-hero-surface", o].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(be, { children: /* @__PURE__ */ h("section", { ref: c, id: d, style: l, className: p, ...m, children: [
    /* @__PURE__ */ h("header", { className: "mds-hero-header", children: [
      /* @__PURE__ */ a("span", { className: "mds-hero-label", children: e }),
      /* @__PURE__ */ a(Pt, { className: "mds-hero-toggle" })
    ] }),
    /* @__PURE__ */ h("p", { className: "mds-hero-amount", children: [
      /* @__PURE__ */ a(Et, { value: t ?? "—" }),
      n && !f ? /* @__PURE__ */ a("span", { className: "mds-hero-unit", children: n }) : null
    ] }),
    s ? /* @__PURE__ */ a("p", { className: "mds-hero-diff", children: s }) : null,
    i ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: ["mds-hero-source", u ? "mds-hero-source--pressed" : ""].filter(Boolean).join(" "),
        "data-ds-exempt": "",
        ...g,
        children: i
      }
    ) : null
  ] }) });
}
const Wn = [
  "default",
  "withCents",
  "missing",
  "longNumber",
  "noDiff"
];
function Xn({
  leading: e,
  tone: t,
  label: n,
  caption: s,
  value: i,
  trailing: r,
  onPress: o,
  disabled: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...g
}) {
  const { isPressed: f, pressProps: p } = k({ onPress: () => o?.(), disabled: d }), b = o !== void 0, v = [
    "mds-object-row",
    s || r ? "" : "mds-object-row--one-line",
    f ? "mds-object-row--pressed" : "",
    d ? "mds-object-row--disabled" : "",
    b ? "" : "mds-object-row--passive",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    b ? "button" : "div",
    {
      ref: u,
      id: c,
      style: m,
      type: b ? "button" : void 0,
      className: v,
      disabled: b ? d : void 0,
      ...b ? p : {},
      ...g,
      children: [
        /* @__PURE__ */ a(Y, { size: "md", tone: t, value: typeof e == "string" ? e : n, children: typeof e == "string" ? void 0 : e }),
        /* @__PURE__ */ h("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ a("span", { className: "mds-object-row-title mds-type-body-strong", children: n }),
          s ? /* @__PURE__ */ a("span", { className: "mds-object-row-caption mds-type-caption", children: s }) : null
        ] }),
        i !== void 0 || r ? /* @__PURE__ */ h("span", { className: "mds-object-row-end", children: [
          /* @__PURE__ */ a("span", { className: "mds-object-row-value mds-type-amount-row", children: /* @__PURE__ */ a("bdi", { dir: "ltr", children: i ?? "—" }) }),
          r ? /* @__PURE__ */ a("span", { className: "mds-object-row-time mds-type-caption", children: r }) : null
        ] }) : null
      ]
    }
  );
}
const Un = [
  "default",
  "oneLine",
  "withBadge",
  "pressed",
  "focused",
  "disabled"
];
function qn({
  leading: e,
  tone: t,
  label: n,
  caption: s,
  value: i,
  state: r,
  children: o,
  onPress: d,
  disabled: l = !1,
  className: c,
  id: m,
  style: u,
  ref: g,
  ...f
}) {
  const { isPressed: p, pressProps: b } = k({ onPress: () => d?.(), disabled: l }), v = d !== void 0, N = [
    "mds-object-card",
    p ? "mds-object-card--pressed" : "",
    l ? "mds-object-card--disabled" : "",
    v ? "" : "mds-object-card--passive",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    v ? "button" : "div",
    {
      ref: g,
      id: m,
      style: u,
      type: v ? "button" : void 0,
      className: N,
      disabled: v ? l : void 0,
      ...v ? b : {},
      ...f,
      children: [
        /* @__PURE__ */ h("span", { className: "mds-object-card-mark", children: [
          /* @__PURE__ */ a(Y, { size: "lg", tone: t, value: typeof e == "string" ? e : n, children: typeof e == "string" ? void 0 : e }),
          r ? /* @__PURE__ */ a("span", { className: "mds-object-card-state", children: r }) : null
        ] }),
        /* @__PURE__ */ h("span", { className: "mds-object-card-body", children: [
          /* @__PURE__ */ a("span", { className: "mds-object-card-title", children: n }),
          s ? /* @__PURE__ */ a("span", { className: "mds-object-card-caption mds-type-caption", children: s }) : null,
          i !== void 0 ? /* @__PURE__ */ a("span", { className: "mds-object-card-value mds-type-amount-row", children: /* @__PURE__ */ a("bdi", { dir: "ltr", children: i }) }) : null,
          o ? /* @__PURE__ */ a("span", { className: "mds-object-card-action", children: o }) : null
        ] })
      ]
    }
  );
}
const Jn = [
  "default",
  "withBadge",
  "withButton",
  "pressed",
  "focused",
  "disabled"
];
function Dt(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function Yt({
  label: e,
  size: t = "lg",
  value: n,
  trailing: s,
  direction: i,
  debt: r,
  onDismiss: o,
  loading: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...g
}) {
  const { isPressed: f, pressProps: p } = k({ onPress: () => o?.() }), { whole: b, cents: v } = Dt(n ?? "—"), N = ["mds-metric", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("div", { ref: u, id: c, style: m, className: N, ...g, children: [
    /* @__PURE__ */ a("span", { className: "mds-metric-label mds-type-label", children: e }),
    /* @__PURE__ */ a("p", { className: "mds-metric-amount", children: d ? /* @__PURE__ */ a("span", { className: "mds-metric-skeleton", "aria-busy": "true" }) : /* @__PURE__ */ h(L, { children: [
      /* @__PURE__ */ a(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          children: /* @__PURE__ */ h("bdi", { dir: "ltr", children: [
            /* @__PURE__ */ a("span", { className: "mds-metric-value-whole", children: b }),
            v ? /* @__PURE__ */ a("span", { className: "mds-metric-value-cents", children: v }) : null
          ] })
        }
      ),
      s ? /* @__PURE__ */ a("span", { className: "mds-metric-unit", children: s }) : null
    ] }) }),
    i && !d ? /* @__PURE__ */ a("p", { className: "mds-metric-diff", children: i }) : null,
    r && !d ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: ["mds-metric-source", f ? "mds-metric-source--pressed" : ""].filter(Boolean).join(" "),
        "data-ds-exempt": "",
        ...p,
        children: r
      }
    ) : null
  ] });
}
const Kn = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function ea({ size: e, ...t }) {
  return /* @__PURE__ */ a(Yt, { ...t, size: "sm", className: ["mds-metric-small", t.className].filter(Boolean).join(" ") });
}
const ta = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
], I = /* @__PURE__ */ new Set();
function Rt({
  label: e,
  children: t,
  onDismiss: n,
  className: s,
  id: i,
  style: r,
  ref: o,
  ...d
}) {
  const l = y(null), [c, m] = Z(0), [u, g] = Z(!1), f = y(0), p = y(0), b = y(0), [v] = Z(() => /* @__PURE__ */ Symbol("sheet")), [N] = Z(() => (I.add(v), I.size >= 2 ? 2 : 1));
  M(
    () => () => {
      I.delete(v);
    },
    [v]
  );
  const R = () => {
    const x = l.current?.querySelector(".mds-sheet-panel");
    return x ? x.getBoundingClientRect().height * 0.3 : 0;
  }, q = (x) => {
    const B = x.target, S = l.current?.querySelector(".mds-sheet-body");
    S?.contains(B) && S && S.scrollTop > 0 || (f.current = 0, p.current = x.clientY, b.current = performance.now(), g(!0), x.currentTarget.setPointerCapture?.(x.pointerId));
  }, J = (x) => {
    if (!u) return;
    const B = performance.now(), S = B - b.current;
    S > 0 && (f.current = (x.clientY - p.current) / S), p.current = x.clientY, b.current = B, m(Math.max(0, x.clientY - O.current));
  }, O = y(0), z = () => {
    if (!u) return;
    g(!1);
    const x = c > R(), B = f.current > 0.6;
    m(0), (x || B) && n();
  };
  M(() => {
    const x = (B) => {
      B.key === "Escape" && n();
    };
    return window.addEventListener("keydown", x), () => window.removeEventListener("keydown", x);
  }, [n]);
  const K = [
    "mds-sheet",
    N === 2 ? "mds-sheet--stacked" : "",
    u ? "mds-sheet--dragging" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "div",
    {
      ref: (x) => {
        l.current = x, typeof o == "function" ? o(x) : o && (o.current = x);
      },
      id: i,
      style: r,
      className: K,
      "data-ds-sheet-level": String(N),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": e,
      ...d,
      children: [
        /* @__PURE__ */ a(
          "div",
          {
            className: "mds-sheet-scrim",
            onClick: () => n(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ h(
          "div",
          {
            className: "mds-sheet-panel",
            style: c ? { transform: `translateY(${c}px)` } : void 0,
            children: [
              /* @__PURE__ */ h(
                "div",
                {
                  className: "mds-sheet-grab",
                  onPointerDown: (x) => {
                    O.current = x.clientY - c, q(x);
                  },
                  onPointerMove: J,
                  onPointerUp: z,
                  onPointerCancel: z,
                  children: [
                    /* @__PURE__ */ a("span", { className: "mds-sheet-handle", "aria-hidden": "true" }),
                    /* @__PURE__ */ a("header", { className: "mds-sheet-header", children: /* @__PURE__ */ a("h2", { className: "mds-sheet-title mds-type-title-section", children: e }) })
                  ]
                }
              ),
              /* @__PURE__ */ a("div", { className: "mds-sheet-close", children: /* @__PURE__ */ a($t, { label: e, onPress: n, children: /* @__PURE__ */ a(Re, {}) }) }),
              /* @__PURE__ */ a("div", { className: "mds-sheet-body", children: t })
            ]
          }
        )
      ]
    }
  );
}
const na = [
  "default",
  "open",
  "dragging",
  "pastThreshold",
  "stacked"
];
function aa({
  label: e,
  caption: t,
  value: n,
  onPress: s,
  onDismiss: i,
  className: r,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = y(null);
  return M(() => {
    m.current?.focus();
  }, []), /* @__PURE__ */ a(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-confirm-sheet", r].filter(Boolean).join(" "),
      ...c,
      children: /* @__PURE__ */ h(
        Rt,
        {
          label: e,
          onDismiss: i,
          className: "mds-confirm-sheet__sheet",
          role: "alertdialog",
          "data-ds-check": "confirm-sheet",
          children: [
            /* @__PURE__ */ h("div", { className: "mds-confirm-sheet-head", children: [
              /* @__PURE__ */ a("span", { className: "mds-confirm-sheet-icon", children: /* @__PURE__ */ a(bt, {}) }),
              /* @__PURE__ */ a("h2", { className: "mds-confirm-sheet-title mds-type-title-section", children: e }),
              /* @__PURE__ */ a("p", { className: "mds-confirm-sheet-sentence", children: t })
            ] }),
            /* @__PURE__ */ h("div", { className: "mds-confirm-sheet-actions", children: [
              /* @__PURE__ */ a(
                C,
                {
                  ref: m,
                  variant: "secondary",
                  className: "mds-confirm-sheet-back",
                  onPress: i,
                  children: w["button.back"].text
                }
              ),
              /* @__PURE__ */ a(C, { variant: "danger", className: "mds-confirm-sheet-confirm", onPress: s, children: n })
            ] })
          ]
        }
      )
    }
  );
}
const sa = [
  "default",
  "focused",
  "pressed"
];
function ia({
  label: e,
  onPress: t,
  loading: n = !1,
  disabled: s = !1,
  caption: i,
  onRetry: r,
  leading: o = !0,
  trailing: d,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...g
}) {
  const f = ke(), p = f.keyboardHeight > 0 ? {
    bottom: `calc(${f.keyboardHeight}px + env(safe-area-inset-bottom))`
  } : void 0, b = ["mds-action-bar", o ? "mds-action-bar--more" : "", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "div",
    {
      ref: u,
      id: c,
      style: { ...p, ...m },
      className: b,
      role: "group",
      "aria-label": e,
      ...g,
      children: [
        i ? /* @__PURE__ */ a(C, { variant: "text", onPress: r, className: "mds-action-bar-secondary", children: i }) : null,
        /* @__PURE__ */ a(
          C,
          {
            variant: "primary",
            onPress: t,
            loading: n,
            disabled: s,
            leading: d,
            className: "mds-action-bar-primary",
            children: e
          }
        )
      ]
    }
  );
}
const ra = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "loading",
  "contentMore",
  "scrolledToEnd",
  "keyboardOpen"
];
function oa({
  selected: e = !1,
  onPress: t,
  onLongPress: n,
  className: s,
  id: i,
  style: r,
  ref: o,
  ...d
}) {
  const { isPressed: l, pressProps: c } = k({ onPress: t, onLongPress: n }), m = e ? w["sr.askUnread"].text : w["sr.ask"].text, u = ["mds-ask-button", l ? "mds-ask-button--pressed" : "", s].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: o,
      id: i,
      style: r,
      type: "button",
      className: u,
      "aria-label": m,
      ...d,
      ...c,
      children: [
        /* @__PURE__ */ a(Ne, { size: 28 }),
        e ? /* @__PURE__ */ a("span", { className: "mds-ask-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const la = [
  "default",
  "pressed",
  "focused",
  "unreadDot",
  "longPressRecording"
];
function da({
  value: e = 0,
  label: t,
  onPress: n,
  className: s,
  id: i,
  style: r,
  ref: o,
  ...d
}) {
  const { isPressed: l, pressProps: c } = k({ onPress: n }), m = le(e, re.unread), u = t ?? (e > 0 ? A("sr.notificationsCount", { counted: m }) : A("sr.notifications")), g = [
    "mds-notifications-button",
    l ? "mds-notifications-button--pressed" : "",
    e > 0 ? "mds-notifications-button--unread" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: o,
      id: i,
      style: r,
      type: "button",
      className: g,
      "aria-label": u,
      ...d,
      ...c,
      children: [
        /* @__PURE__ */ a(Ce, {}),
        e > 0 ? /* @__PURE__ */ a("span", { className: "mds-notifications-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const ca = [
  "default",
  "pressed",
  "focused",
  "unreadDot"
];
function ua({
  label: e,
  caption: t,
  locked: n = !1,
  onPress: s,
  className: i,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const { isPressed: c, pressProps: m } = k({ onPress: s }), u = [
    "mds-project-switcher",
    c ? "mds-project-switcher--pressed" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: d,
      id: r,
      style: o,
      type: "button",
      className: u,
      ...l,
      ...m,
      children: [
        /* @__PURE__ */ a(Y, { size: "sm", value: e }),
        /* @__PURE__ */ h("span", { className: "mds-project-switcher-text", children: [
          /* @__PURE__ */ a("span", { className: "mds-project-switcher-name mds-type-body-strong", children: e }),
          t ? /* @__PURE__ */ a("span", { className: "mds-project-switcher-role", children: t }) : null
        ] }),
        n ? null : /* @__PURE__ */ a(De, { className: "mds-project-switcher-caret" })
      ]
    }
  );
}
const ma = [
  "default",
  "pressed",
  "focused",
  "withCaret",
  "singleRoleNoCaret"
];
function ha({
  leading: e,
  trailing: t,
  caption: n = !1,
  label: s,
  className: i,
  id: r,
  style: o,
  ref: d,
  children: l,
  ...c
}) {
  const m = [
    "mds-context-bar",
    n ? "mds-context-bar--scrolled" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "div",
    {
      ref: d,
      id: r,
      style: o,
      className: m,
      role: "banner",
      "aria-label": s,
      ...c,
      children: [
        /* @__PURE__ */ a("div", { className: "mds-context-bar-start", children: e ?? l }),
        /* @__PURE__ */ a("div", { className: "mds-context-bar-end", children: t })
      ]
    }
  );
}
const fa = [
  "default",
  "mainScreenSwitcher",
  "subScreenBack",
  "scrolledHairline",
  "notScrolled"
];
function ga({
  label: e,
  selected: t = !1,
  leading: n,
  onPress: s,
  className: i,
  ref: r,
  ...o
}) {
  const { isPressed: d, pressProps: l } = k({ onPress: s }), c = [
    "mds-tab",
    t ? "mds-tab--active" : "",
    d ? "mds-tab--pressed" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: r,
      type: "button",
      role: "tab",
      className: c,
      "aria-selected": t,
      "aria-current": t ? "page" : void 0,
      tabIndex: t ? 0 : -1,
      ...o,
      ...l,
      children: [
        n ? /* @__PURE__ */ a("span", { className: "mds-tab-icon", "aria-hidden": "true", children: n }) : null,
        /* @__PURE__ */ a("span", { className: "mds-tab-label", children: e })
      ]
    }
  );
}
function pa({
  children: e,
  value: t,
  onChange: n,
  className: s,
  id: i,
  style: r,
  ref: o,
  ...d
}) {
  const l = ae.toArray(e), c = l.some(
    (u) => u && typeof u == "object" && "props" in u && u.props.selected !== void 0
  ), m = t ?? 0;
  return /* @__PURE__ */ a(
    "div",
    {
      ref: o,
      id: i,
      style: r,
      className: ["mds-tab-bar", s].filter(Boolean).join(" "),
      role: "tablist",
      ...d,
      children: l.map((u, g) => {
        if (u && typeof u == "object" && "props" in u) {
          const f = u.props, p = c ? f.selected === !0 : g === m;
          return {
            ...u,
            props: { ...f, selected: p, onPress: () => {
              f.onPress?.(), n?.(g);
            } }
          };
        }
        return u;
      })
    }
  );
}
const ba = [
  "default",
  "activeFill",
  "pressed",
  "focused",
  "fiveTabs",
  "twoTabs"
];
function xa({
  label: e,
  leading: t,
  caption: n = !1,
  trailing: s,
  className: i,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const c = [
    "mds-page-header",
    n && t ? "mds-page-header--collapsed" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("header", { ref: d, id: r, style: o, className: c, ...l, children: [
    t,
    /* @__PURE__ */ a("h1", { className: "mds-page-header-title", children: e }),
    s ? /* @__PURE__ */ a("div", { className: "mds-page-header-end", children: s }) : null
  ] });
}
const va = [
  "default",
  "mainScreen",
  "subScreenBack",
  "collapsedOnScroll",
  "withTrailing"
], Ot = {
  draft: A("saveState.draft"),
  sending: A("saveState.sending"),
  saved: A("saveState.saved"),
  failed: A("saveState.failed")
};
function wa({
  saveState: e,
  className: t,
  id: n,
  style: s,
  ref: i,
  ...r
}) {
  const o = [
    "mds-save-state",
    `mds-save-state--${e}`,
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "span",
    {
      ref: i,
      id: n,
      style: s,
      className: o,
      role: e === "failed" ? "alert" : void 0,
      "aria-busy": e === "sending" || void 0,
      ...r,
      children: [
        e === "draft" ? /* @__PURE__ */ a(at, { size: 14 }) : e === "saved" ? /* @__PURE__ */ a("span", { className: "mds-save-state-icon", children: /* @__PURE__ */ a(U, { size: 14 }) }) : e === "failed" ? /* @__PURE__ */ a(D, { size: 14 }) : null,
        /* @__PURE__ */ a("span", { className: "mds-save-state-text", children: Ot[e] }),
        e === "saved" ? /* @__PURE__ */ a("span", { className: "mds-visually-hidden", children: A("sr.saveSaved") }) : null,
        e === "failed" ? /* @__PURE__ */ a("span", { className: "mds-visually-hidden", children: A("sr.saveFailed") }) : null
      ]
    }
  );
}
const ka = [
  "draft",
  "sending",
  "saved",
  "failed"
];
function ya({
  label: e,
  trailing: t,
  onDismiss: n,
  className: s,
  id: i,
  style: r,
  ref: o,
  ...d
}) {
  const l = y(null), c = y(0), m = y(0), u = t ? 5e3 : 3e3;
  M(() => (c.current = u, m.current = Date.now(), l.current = window.setTimeout(() => n?.(), u), () => {
    l.current && window.clearTimeout(l.current), l.current = null;
  }), [e, u]);
  const g = () => {
    l.current && (window.clearTimeout(l.current), l.current = null, c.current -= Date.now() - m.current);
  }, f = () => {
    l.current || (m.current = Date.now(), l.current = window.setTimeout(() => n?.(), Math.max(0, c.current)));
  };
  return /* @__PURE__ */ h(
    "div",
    {
      ref: o,
      id: i,
      style: r,
      className: ["mds-toast", s].filter(Boolean).join(" "),
      role: "status",
      onFocus: g,
      onBlur: f,
      ...d,
      children: [
        /* @__PURE__ */ a("span", { className: "mds-toast-text", children: e }),
        t ? /* @__PURE__ */ a("span", { className: "mds-toast-action", children: t }) : null
      ]
    }
  );
}
const Aa = ["default", "withAction", "focusedPaused"], zt = {
  offline: rt,
  locked: lt,
  info: ct
};
function Na({
  tone: e,
  label: t,
  trailing: n,
  className: s,
  id: i,
  style: r,
  ref: o,
  ...d
}) {
  const l = zt[e];
  return /* @__PURE__ */ h(
    "div",
    {
      ref: o,
      id: i,
      style: r,
      className: ["mds-inline-banner", `mds-inline-banner--${e}`, s].filter(Boolean).join(" "),
      role: "status",
      ...d,
      children: [
        /* @__PURE__ */ a(l, {}),
        /* @__PURE__ */ a("span", { className: "mds-inline-banner-text", children: t }),
        n ? /* @__PURE__ */ a("span", { className: "mds-inline-banner-action", children: n }) : null
      ]
    }
  );
}
const Ba = ["offline", "locked", "info", "withAction"];
function Ha({
  label: e,
  trailing: t,
  className: n,
  id: s,
  style: i,
  ref: r,
  ...o
}) {
  return /* @__PURE__ */ h(
    "div",
    {
      ref: r,
      id: s,
      style: i,
      className: ["mds-empty-state", n].filter(Boolean).join(" "),
      ...o,
      children: [
        /* @__PURE__ */ h("div", { className: "mds-empty-state-ghosts", "aria-hidden": "true", children: [
          /* @__PURE__ */ h("div", { className: "mds-empty-state-ghost", children: [
            /* @__PURE__ */ a("span", { className: "mds-empty-state-ghost-mark" }),
            /* @__PURE__ */ h("span", { className: "mds-empty-state-ghost-lines", children: [
              /* @__PURE__ */ a("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--body" }),
              /* @__PURE__ */ a("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--caption" })
            ] })
          ] }),
          /* @__PURE__ */ h("div", { className: "mds-empty-state-ghost", children: [
            /* @__PURE__ */ a("span", { className: "mds-empty-state-ghost-mark" }),
            /* @__PURE__ */ h("span", { className: "mds-empty-state-ghost-lines", children: [
              /* @__PURE__ */ a("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--body" }),
              /* @__PURE__ */ a("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--caption" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "mds-empty-state-sentence", children: e }),
        t ? /* @__PURE__ */ a("div", { className: "mds-empty-state-action", children: t }) : null
      ]
    }
  );
}
const Sa = ["default", "withAction"];
function Za({
  variant: e,
  className: t,
  id: n,
  style: s,
  ref: i,
  ...r
}) {
  return /* @__PURE__ */ a(
    "span",
    {
      ref: i,
      id: n,
      style: s,
      "aria-hidden": "true",
      className: ["mds-skeleton", `mds-skeleton--${e}`, t].filter(Boolean).join(" "),
      ...r
    }
  );
}
const Ma = ["body", "caption", "hero", "mark"];
export {
  ia as ActionBar,
  ra as ActionBarStates,
  be as AmountVisibilityProvider,
  Pt as AmountVisibilityToggle,
  Sn as AmountVisibilityToggleStates,
  $e as AmountsHiddenIcon,
  Ve as AmountsShownIcon,
  wn as AppointmentIcon,
  oa as AskButton,
  la as AskButtonStates,
  Ne as AskSymbolIcon,
  an as BackIcon,
  C as Button,
  Cn as ButtonStates,
  rn as ClearIcon,
  Re as CloseIcon,
  aa as ConfirmSheet,
  sa as ConfirmSheetStates,
  ha as ContextBar,
  fa as ContextBarStates,
  bt as DangerIcon,
  pn as DebtIcon,
  dn as DeltaDownIcon,
  ln as DeltaUpIcon,
  at as DraftIcon,
  Ha as EmptyState,
  Sa as EmptyStateStates,
  ht as EntityApprovedIcon,
  Y as EntityMark,
  Pn as EntityMarkStates,
  gt as EntityPendingIcon,
  De as ExpandIcon,
  on as FieldErrorIcon,
  Ln as FilterChips,
  Fn as FilterChipsStates,
  Fe as ForwardIcon,
  hn as FundBankIcon,
  mn as FundCashIcon,
  fn as FundWalletIcon,
  Gn as HeroSurface,
  Wn as HeroSurfaceStates,
  $t as IconButton,
  jn as IconButtonStates,
  ct as InfoIcon,
  Na as InlineBanner,
  Ba as InlineBannerStates,
  xn as JobFailedIcon,
  xe as LONG_PRESS_MS,
  Xt as LayersProvider,
  lt as LockedIcon,
  Yt as Metric,
  ea as MetricSmall,
  ta as MetricSmallStates,
  Kn as MetricStates,
  Bn as Money,
  Hn as MoneyStates,
  un as MoreIcon,
  tn as NavDeliveryIcon,
  Kt as NavFinanceIcon,
  nn as NavMarketIcon,
  en as NavOrdersIcon,
  Jt as NavTodayIcon,
  da as NotificationsButton,
  ca as NotificationsButtonStates,
  Ce as NotificationsIcon,
  qn as ObjectCard,
  Jn as ObjectCardStates,
  Xn as ObjectRow,
  Un as ObjectRowStates,
  rt as OfflineIcon,
  vn as OrderIcon,
  xa as PageHeader,
  va as PageHeaderStates,
  kn as PriceTierIcon,
  ua as ProjectSwitcher,
  ma as ProjectSwitcherStates,
  bn as QuoteIcon,
  Nn as RTL_FLIP_ICONS,
  An as ReportIcon,
  cn as RetryIcon,
  yn as ReviewIcon,
  wa as SaveState,
  ka as SaveStateStates,
  sn as SearchIcon,
  On as Section,
  zn as SectionStates,
  $n as SegmentedControl,
  In as SegmentedControlStates,
  ze as SelectedIcon,
  Rt as Sheet,
  na as SheetStates,
  Za as Skeleton,
  Ma as SkeletonStates,
  Zn as StatusBadge,
  Mn as StatusBadgeStates,
  En as Surface,
  Dn as SurfaceStates,
  pa as TabBar,
  ba as TabBarStates,
  ga as TabBarTab,
  Vn as TextField,
  Tn as TextFieldStates,
  Qn as Tile,
  _n as TileStates,
  ya as Toast,
  Aa as ToastStates,
  U as ToneDoneIcon,
  tt as ToneInfoIcon,
  D as ToneProblemIcon,
  Je as ToneWaitingIcon,
  gn as TransferIcon,
  Yn as Well,
  Rn as WellStates,
  w as ar,
  pe as formatMoney,
  Wt as formatTime12,
  ie as getToken,
  V as moneyTexts,
  le as pluralAr,
  re as pluralNouns,
  A as t,
  se as tokens,
  j as useAmountVisibility,
  qt as useOpenSheetCount,
  k as usePress,
  Ut as useSheetLayer,
  ke as useVisualViewport
};
