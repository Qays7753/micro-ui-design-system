import { jsx as n, jsxs as f, Fragment as G } from "react/jsx-runtime";
import { useMemo as te, useContext as Pe, createContext as Ye, useState as H, useRef as Z, useCallback as O, useEffect as R, useReducer as ft, useId as Se, useLayoutEffect as bt, Children as gt } from "react";
const _ = {
  color: {
    canvas: "#E8ECEF",
    surface: "#FFFFFF",
    "surface-edge": "#D5DCE0",
    "surface-well": "#E8ECEF",
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
    "entity-bg": "#EAEEF1",
    "entity-bg-canvas": "#FFFFFF",
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
    "action-bar-padding-inline": 16,
    "action-bar-padding-block": 12,
    "action-bar-gap": 8,
    "segmented-padding": 4,
    "empty-state-gap": 16,
    "empty-state-content-max": 280,
    "pressed-row-inset": 8,
    "scroll-peek-min": 24,
    "scroll-end-padding": 16,
    "photo-columns": 3,
    "timeline-hours": 48
  },
  radius: {
    "2xs": 4,
    xs: 6,
    sm: 8,
    inset: 12,
    md: 12,
    lg: 16,
    "signature-outer": 28,
    xl: 24,
    full: 9999,
    "entity-32": 8,
    "entity-44": 10,
    "entity-64": 14,
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
    "signal-line": 2,
    "track-line": 2
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
    "hero-sparkline-height": 32,
    "chart-area-opacity": 0.08,
    "keypad-key": [
      64,
      56
    ],
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
    "max-wells-per-surface": 2,
    "toggle-track": [
      52,
      32
    ],
    "toggle-thumb": 24,
    "voice-bar": {
      width: 4,
      min: 8,
      max: 24
    },
    "track-dot": 12,
    "logo-lockup": 28,
    "google-button": 40,
    progress: 8,
    "timeline-block-min": 32,
    "day-mark": 36,
    "dot-event": 6,
    "textarea-max-lines": 6,
    "ask-input-max-lines": 4,
    checkbox: 20
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
    "response-max-ms": 100,
    "pending-delay": 300,
    landed: {
      ms: 1200,
      ease: "ease-out",
      from: "brand-selected-bg",
      to: "transparent",
      once: !0
    },
    "drag-lift": {
      scale: 1.04,
      elevation: "float"
    },
    "hold-confirm": {
      ms: 600
    }
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
    "max-text-lines": 2,
    "max-inline-table-rows": 5,
    "slide-confirm-ratio": 0.8,
    "viewer-zoom-min": 1,
    "viewer-zoom-max": 4,
    "viewer-zoom-step": 1.5,
    "timeline-default-range": [
      8,
      20
    ],
    "voice-max-seconds": 60,
    "voice-warning-seconds": 50
  }
};
function qe(e) {
  let t = _;
  for (const a of e.split("."))
    t = t[a];
  return t;
}
const kt = {
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
  // Lab demo sheets (2.1): every pressable opens its real sample sheet
  "sheet.projectTitle": { kind: "title", text: "تبديل المشروع" },
  "sheet.notificationsTitle": { kind: "title", text: "الإشعارات" },
  "sheet.askTitle": { kind: "title", text: "Ask Micro" },
  "sheet.sourceTitle": { kind: "title", text: "مصدر الرقم" },
  "sheet.allTitle": { kind: "title", text: "كل ما يحتاجك" },
  "sheet.objectTitle": { kind: "title", text: "طلب 1175" },
  "notif.quoteArrived": { kind: "help", text: "وصل عرض سعر من عمر الزعبي" },
  "notif.orderToday": { kind: "help", text: "طلب 1203 موعده اليوم 4:00 م" },
  "notif.paymentIn": { kind: "help", text: "دفعة 30 د من رنا العبادي" },
  "notif.timeAgo": { kind: "help", text: "قبل 5 دقائق" },
  "notif.timeToday": { kind: "badge", text: "9:15 ص" },
  "notif.timeYesterday": { kind: "help", text: "أمس 5:10 م" },
  "ask.placeholder": { kind: "placeholder", text: "اسأل Micro" },
  "ask.amountLabel": { kind: "badge", text: "السؤال" },
  "button.askSend": { kind: "button", text: "أرسل" },
  "kv.orderTitle": { kind: "badge", text: "الطلب" },
  "kv.customer": { kind: "badge", text: "العميل" },
  "kv.delivery": { kind: "badge", text: "التسليم" },
  "kv.phone": { kind: "badge", text: "الهاتف" },
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
  "toast.questionSent": { kind: "success", text: "أُرسل السؤال" },
  // Lab-only press responses for samples whose real destination is a full
  // screen the lab page cannot host (tiles → domain tabs, back → previous
  // screen): the Toast IS the documented press response (23.12).
  "toast.opens": { kind: "help", text: "تفتح {area}" },
  // --- InlineBanner / ErrorState (BRIEF 9.5, 11.3, 24.5) ---
  "banner.offline": { kind: "error", text: "الاتصال انقطع" },
  "banner.backOnline": { kind: "help", text: "عاد الاتصال، لديك مسودة" },
  "banner.permission": { kind: "help", text: "هذا خارج صلاحياتك في هذا المشروع" },
  "errorState.loadFailed": { kind: "error", text: "تعذّر تحميل البيانات. أعد المحاولة." },
  "errorState.updatedAt": { kind: "help", text: "آخر تحديث {time}" },
  // --- EmptyState (BRIEF 23.7, 24.6; و-1 item 14: one button max, and
  // none when the header carries the creation button) ---
  "empty.movements": { kind: "empty", text: "حركات اليوم تظهر هنا." },
  "empty.oneButtonMax": { kind: "help", text: "زر واحد كحد أقصى، حين يغيب زر الإنشاء" },
  // --- ConfirmSheet result sentence (BRIEF 24.3) ---
  "confirm.deleteResult": { kind: "help", text: "لن تظهر في رصيد {fund}." },
  // --- Metric delta lines (BRIEF 23.8 + 23.22 hidden form) ---
  "metric.deltaHigher": { kind: "help", text: "{percent} أعلى من أمس" },
  "metric.deltaLower": { kind: "help", text: "{percent} أقل من أمس" },
  "metric.deltaHigherHidden": { kind: "help", text: "أعلى من أمس" },
  "metric.deltaLowerHidden": { kind: "help", text: "أقل من أمس" },
  // --- Money fragments (BRIEF 8; display fragments -> badge) ---
  "money.unit": { kind: "badge", text: "د" },
  "money.forYou": { kind: "badge", text: "لك" },
  "money.againstYou": { kind: "badge", text: "عليك" },
  "money.missing": { kind: "badge", text: "—" },
  "money.hiddenGlyph": { kind: "badge", text: "••••" },
  // --- Lab chrome and state names (plan K27/K32: the lab shows component and
  //     state names only; every word lives here, not in lab source) ---
  "lab.stamp": { kind: "title", text: "مختبر الدفعة الأولى" },
  // 2.2 (owner note §3): section headings in the product owner's language —
  // what it is and when it is used, two or three words; the technical name
  // renders small beside it (lab-title's .lab-tech).
  "lab.h.amountToggle": { kind: "title", text: "زر إخفاء الأرقام" },
  // 3ج.1 — the live override demo (the plan's own example: «سجّل حركة»).
  "title.textOverride": { kind: "title", text: "تجاوز النصوص" },
  "lab.h.textOverride": { kind: "title", text: "نصوص من التطبيق" },
  "lab.overrideHint": { kind: "help", text: "اضغط ليستبدل نص الزر، واضغط ثانية ليعود." },
  "lab.overrideOn": { kind: "button", text: "فعّل التجاوز" },
  "lab.overrideOff": { kind: "button", text: "أعد نص المكتبة" },
  "lab.overrideTarget": { kind: "help", text: "الهدف الحي" },
  "lab.overrideReplacement": { kind: "button", text: "دبّر الحركة" },
  // AmountKeypad (§1.4-7): the SPOKEN names — the visible glyph stays a digit.
  "keypad.srGroup": { kind: "screen-reader", text: "لوحة المبالغ" },
  "keypad.sr0": { kind: "screen-reader", text: "صفر" },
  "keypad.sr1": { kind: "screen-reader", text: "واحد" },
  "keypad.sr2": { kind: "screen-reader", text: "اثنان" },
  "keypad.sr3": { kind: "screen-reader", text: "ثلاثة" },
  "keypad.sr4": { kind: "screen-reader", text: "أربعة" },
  "keypad.sr5": { kind: "screen-reader", text: "خمسة" },
  "keypad.sr6": { kind: "screen-reader", text: "ستة" },
  "keypad.sr7": { kind: "screen-reader", text: "سبعة" },
  "keypad.sr8": { kind: "screen-reader", text: "ثمانية" },
  "keypad.sr9": { kind: "screen-reader", text: "تسعة" },
  "keypad.sr000": { kind: "screen-reader", text: "ثلاثة أصفار" },
  "keypad.srDecimal": { kind: "screen-reader", text: "فاصلة" },
  "keypad.srBackspace": { kind: "screen-reader", text: "احذف" },
  // the keypad lab page (§1.4-10: typing 145.750 through the keys).
  "title.keypad": { kind: "title", text: "لوحة المبالغ" },
  "lab.h.keypad": { kind: "title", text: "لوحة أرقام المبالغ" },
  "lab.keypadHint": { kind: "help", text: "اضغط المفاتيح يدخل المبلغ في الحقل أعلاه." },
  // MovementTypeControl (§1.5): the in/out/transfer switch of the movement
  // form. The group's name is a screen-reader word; the save-time error
  // under the control is a help sentence.
  "movementType.srGroup": { kind: "screen-reader", text: "نوع الحركة" },
  "movementType.choose": { kind: "help", text: "اختر نوع الحركة" },
  "title.movementTypeControl": { kind: "title", text: "نوع الحركة" },
  "lab.h.movementTypeControl": { kind: "title", text: "مبدّل نوع الحركة" },
  "lab.movementTypeHint": { kind: "help", text: "حاول الحفظ بلا اختيار يظهر خطأ الصياغة تحته." },
  // QuantityStepper (§1.6): the stepper's screen-reader words (its only
  // own texts — everything else is the app's label).
  "quantity.increase": { kind: "screen-reader", text: "زيادة" },
  "quantity.decrease": { kind: "screen-reader", text: "إنقاص" },
  "field.quantity": { kind: "badge", text: "الكمية" },
  "title.quantityStepper": { kind: "title", text: "عداد الكمية" },
  "lab.h.quantityStepper": { kind: "title", text: "عداد كمية صحيحة" },
  "lab.quantityHint": { kind: "help", text: "اضغط مطولًا يتسارع العد، واكتب ما تشاء." },
  // DateQuickChips (§1.8): the trailing chip's fixed word and the
  // save-time error line. The quick words (اليوم/أمس/غداً) are the app's
  // item labels; the date format is the component's own contract.
  "dateQuick.other": { kind: "button", text: "تاريخ آخر" },
  "dateQuick.choose": { kind: "help", text: "اختر التاريخ" },
  "dateQuick.chipName": { kind: "screen-reader", text: "{label}، {value}" },
  "field.saleDate": { kind: "badge", text: "تاريخ البيع" },
  "field.dueDate": { kind: "badge", text: "تاريخ الاستحقاق" },
  "field.party": { kind: "badge", text: "اختر العميل" },
  "field.supplierParty": { kind: "badge", text: "المورد" },
  "title.dateQuickChips": { kind: "title", text: "التواريخ السريعة" },
  "lab.h.dateQuickChips": { kind: "title", text: "رقائق تاريخ سريعة" },
  "lab.dateQuickHint": { kind: "help", text: "«تاريخ آخر» يفتح منتقي التطبيق حتى ورقة الشهر." },
  "dateWord.today": { kind: "badge", text: "اليوم" },
  "dateWord.yesterday": { kind: "badge", text: "أمس" },
  "dateWord.tomorrow": { kind: "badge", text: "غداً" },
  "state.customRow": { kind: "badge", text: "تاريخ مخصص" },
  // TimePicker (§1.9 + addendum §2.4): the period words (chip + spoken),
  // the grid titles, the apply action, the save-time error, and the field's
  // spoken name pattern.
  "time.am": { kind: "badge", text: "ص" },
  "time.pm": { kind: "badge", text: "م" },
  "time.amSpoken": { kind: "screen-reader", text: "صباحاً" },
  "time.pmSpoken": { kind: "screen-reader", text: "مساءً" },
  "time.periodGroup": { kind: "screen-reader", text: "الفترة" },
  "time.hour": { kind: "title", text: "الساعة" },
  "time.minutes": { kind: "title", text: "الدقائق" },
  "timePicker.apply": { kind: "button", text: "اعتمد الوقت" },
  "timePicker.choose": { kind: "help", text: "اختر الوقت" },
  "timePicker.srName": { kind: "screen-reader", text: "{label}، {time}" },
  "field.deliveryTime": { kind: "badge", text: "وقت التسليم" },
  "title.timePicker": { kind: "title", text: "منتقي الوقت" },
  "lab.h.timePicker": { kind: "title", text: "حقل موعد بلحظة" },
  "lab.timePickerHint": { kind: "help", text: "اضغط الحقل تفتح الورقة، واعتمد منها." },
  // DurationPicker (addendum §3.3): the duration words per the plural rules
  // of 24.1(8) — one/two bare, 3-10 counted plural, 11+ counted singular,
  // and «ونصف» for the half hour after an hour.
  "duration.hourOne": { kind: "badge", text: "ساعة" },
  "duration.hourTwo": { kind: "badge", text: "ساعتان" },
  "duration.hourFew": { kind: "badge", text: "ساعات" },
  "duration.hourMany": { kind: "badge", text: "ساعة" },
  "duration.minuteOne": { kind: "badge", text: "دقيقة" },
  "duration.minuteTwo": { kind: "badge", text: "دقيقتان" },
  "duration.minuteFew": { kind: "badge", text: "دقائق" },
  "duration.minuteMany": { kind: "badge", text: "دقيقة" },
  "duration.half": { kind: "badge", text: "ونصف" },
  "duration.and": { kind: "badge", text: "و" },
  "duration.common": { kind: "title", text: "مدد شائعة" },
  "duration.other": { kind: "badge", text: "مدة أخرى" },
  "durationPicker.apply": { kind: "button", text: "اعتمد المدة" },
  "durationPicker.srName": { kind: "screen-reader", text: "{label}، {duration}" },
  "field.duration": { kind: "badge", text: "المدة" },
  "title.durationPicker": { kind: "title", text: "منتقي المدة" },
  "lab.h.durationPicker": { kind: "title", text: "حقل مدة الموعد" },
  "lab.durationPickerHint": { kind: "help", text: "المدة تظهر بعد اختيار الوقت، وتُعتمد من الورقة." },
  // PeriodSwitcher (§1.27): the period sizes, the jump words, the size
  // sheet, and the screen-reader names. The spoken forms name the months
  // Levantine through month.1..12 (§0.2-6); the visible month stays
  // MM/YYYY with Western tabular digits.
  "period.day": { kind: "badge", text: "يوم" },
  "period.week": { kind: "badge", text: "أسبوع" },
  "period.month": { kind: "badge", text: "شهر" },
  "period.custom": { kind: "button", text: "فترة مخصصة" },
  "period.apply": { kind: "button", text: "اعرض الفترة" },
  "period.today": { kind: "button", text: "اليوم" },
  "period.thisWeek": { kind: "button", text: "هذا الأسبوع" },
  "period.thisMonth": { kind: "button", text: "هذا الشهر" },
  "period.sheetTitle": { kind: "title", text: "حجم الفترة" },
  "period.sizeGroup": { kind: "screen-reader", text: "حجم الفترة" },
  "period.srName": { kind: "screen-reader", text: "الفترة: {spoken}، غيّر الفترة" },
  "period.spokenTo": { kind: "screen-reader", text: "إلى" },
  "period.srDayPrev": { kind: "screen-reader", text: "اليوم السابق" },
  "period.srDayNext": { kind: "screen-reader", text: "اليوم التالي" },
  "period.srWeekPrev": { kind: "screen-reader", text: "الأسبوع السابق" },
  "period.srWeekNext": { kind: "screen-reader", text: "الأسبوع التالي" },
  "period.srMonthPrev": { kind: "screen-reader", text: "الشهر السابق" },
  "period.srMonthNext": { kind: "screen-reader", text: "الشهر التالي" },
  "period.srCustomPrev": { kind: "screen-reader", text: "الفترة السابقة" },
  "period.srCustomNext": { kind: "screen-reader", text: "الفترة التالية" },
  "title.periodSwitcher": { kind: "title", text: "مبدّل الفترة" },
  "lab.h.periodSwitcher": { kind: "title", text: "تنقّل الفترات" },
  "lab.periodSwitcherHint": { kind: "help", text: "السابق والتالي يتنقّلان، والتسمية تفتح ورقة الحجم." },
  // MonthGrid (§3.5): the grid's spoken month, the cell names, the lab.
  "month.srGrid": { kind: "screen-reader", text: "{month} {year}" },
  "month.srCell": { kind: "screen-reader", text: "{day} {month}، {weekday}" },
  "month.srCellToday": { kind: "screen-reader", text: "{name}، {today}" },
  "month.srCellCount": { kind: "screen-reader", text: "{name}، {counted}" },
  "datePicker.srName": { kind: "screen-reader", text: "{label}، {date}" },
  // PartyPicker (§1.10): the role words, the add row, the empty line.
  "party.roleClient": { kind: "badge", text: "عميلاً" },
  "party.roleSupplier": { kind: "badge", text: "مورداً" },
  "party.roleParty": { kind: "badge", text: "طرفاً" },
  "party.add": { kind: "badge", text: "أضف «{name}» {role} جديداً" },
  "party.srAdd": { kind: "screen-reader", text: "أضف {name} {role} جديداً" },
  "party.srName": { kind: "screen-reader", text: "{label}، {name}" },
  "party.srNone": { kind: "screen-reader", text: "{label}، لم يُختر" },
  "party.empty": { kind: "empty", text: "العملاء يظهرون هنا. اكتب اسماً لإضافته." },
  "party.choose": { kind: "help", text: "اختر الطرف." },
  // FundPicker (addendum §3.5): the words of the forms.
  "fund.from": { kind: "badge", text: "من:" },
  "fund.to": { kind: "badge", text: "إلى:" },
  "fund.srChip": { kind: "screen-reader", text: "{name}، الرصيد {balance}" },
  "fund.srChipDisabled": { kind: "screen-reader", text: "{name}، هذا صندوق المصدر" },
  "fund.choose": { kind: "help", text: "اختر الصندوق." },
  "title.fundPicker": { kind: "title", text: "منتقي الصندوق" },
  "lab.h.fundPicker": { kind: "title", text: "اختيار الصندوق في الحركة" },
  "lab.fundPickerHint": { kind: "help", text: "الشكل يتبع عدد الصناديق: صف، أو رقائق، أو حقل." },
  "title.partyPicker": { kind: "title", text: "منتقي الطرف" },
  "lab.h.partyPicker": { kind: "title", text: "حقل اختيار الطرف" },
  "lab.partyPickerHint": { kind: "help", text: "الحقل يفتح ورقة البحث، والاختيار يغلقها." },
  "title.datePicker": { kind: "title", text: "منتقي التاريخ" },
  "lab.h.datePicker": { kind: "title", text: "حقل تاريخ النموذج" },
  "lab.datePickerHint": { kind: "help", text: "التسمية تفتح ورقة الشهر، واختيار اليوم يغلقها." },
  "title.monthGrid": { kind: "title", text: "شبكة الشهر" },
  "lab.h.monthGrid": { kind: "title", text: "تقويم الشهر" },
  "lab.monthGridHint": { kind: "help", text: "اختر يومًا، أو مدى في وضع المدى." },
  "monthGrid.modeSingle": { kind: "badge", text: "اختيار يوم" },
  "monthGrid.modeRange": { kind: "badge", text: "اختيار مدى" },
  "monthGrid.modeView": { kind: "badge", text: "عرض فقط" },
  "lab.periodDayRow": { kind: "badge", text: "تنقّل يومي" },
  "lab.periodMonthOnlyRow": { kind: "badge", text: "شهر فقط" },
  "lab.h.money": { kind: "title", text: "شكل المبلغ ووحدته" },
  "lab.h.statusBadge": { kind: "title", text: "شارة الحالة" },
  "lab.h.entityMark": { kind: "title", text: "حرف الطرف" },
  "lab.h.button": { kind: "title", text: "الأزرار" },
  "lab.h.iconButton": { kind: "title", text: "زر أيقونة دائري" },
  "lab.h.textField": { kind: "title", text: "حقل سطر واحد" },
  "lab.h.segmentedControl": { kind: "title", text: "مبدّل خيارات قليلة" },
  "lab.h.filterChips": { kind: "title", text: "رقائق تصفية القائمة" },
  "lab.h.surface": { kind: "title", text: "بطاقة محتوى بيضاء" },
  "lab.h.well": { kind: "title", text: "معلومات داخل بطاقة" },
  "lab.h.section": { kind: "title", text: "عنوان قسم وقائمته" },
  "lab.h.hero": { kind: "title", text: "البطاقة الرئيسية" },
  "lab.h.sheet": { kind: "title", text: "الورقة المنبثقة" },
  "lab.h.actionBar": { kind: "title", text: "شريط الحفظ السفلي" },
  "lab.h.skeleton": { kind: "title", text: "هيكل التحميل" },
  "lab.h.emptyState": { kind: "title", text: "شكل القائمة الفارغة" },
  "lab.h.inlineBanner": { kind: "title", text: "شريط معلومة علوي" },
  "lab.h.toast": { kind: "title", text: "رسالة نجاح سريعة" },
  "lab.h.saveState": { kind: "title", text: "حالة الحفظ" },
  "lab.h.pageHeader": { kind: "title", text: "العنوان وزر الإنشاء" },
  "lab.h.tabBar": { kind: "title", text: "تبويبات أسفل الشاشة" },
  "lab.h.contextBar": { kind: "title", text: "الشريط العلوي الثابت" },
  "lab.h.projectSwitcher": { kind: "title", text: "مبدّل المشروع والدور" },
  "lab.h.notificationsButton": { kind: "title", text: "جرس الإشعارات" },
  "lab.h.askButton": { kind: "title", text: "زر المساعد Micro" },
  "lab.h.confirmSheet": { kind: "title", text: "ورقة تأكيد الحذف" },
  "lab.h.objectRow": { kind: "title", text: "صف في قائمة" },
  "lab.h.objectCard": { kind: "title", text: "بطاقة كائن موسّعة" },
  "lab.h.metric": { kind: "title", text: "الرقم البطل" },
  "lab.h.metricSmall": { kind: "title", text: "رقم مصغّر بعنوانه" },
  "lab.h.tile": { kind: "title", text: "بلاطات اليوم الأربع" },
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
  "field.optional": { kind: "badge", text: "اختياري" },
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
  "state.withSparkline": { kind: "badge", text: "بخط صغير" },
  "state.longNumber": { kind: "badge", text: "رقم طويل" },
  "state.multiSelect": { kind: "badge", text: "تحديد متعدد" },
  "state.scrollRow": { kind: "badge", text: "قابل للتمرير" },
  "state.driver": { kind: "badge", text: "وضع السائق" },
  "state.default": { kind: "badge", text: "افتراضي" },
  "state.landed": { kind: "badge", text: "وصل محفوظ" },
  "state.todayProject": { kind: "badge", text: "مشروع اليوم" },
  "today.date": { kind: "badge", text: "الجمعة 27/11/2026" },
  "section.now": { kind: "title", text: "الآن" },
  "now.in40": { kind: "help", text: "بعد 40 دقيقة" },
  "tile.fundsNow": { kind: "help", text: "في الصناديق الآن" },
  "tile.todayNext": { kind: "help", text: "اليوم · التالي 4:00 م" },
  "tile.running": { kind: "badge", text: "جارية" },
  "tile.offers": { kind: "badge", text: "عروض" },
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
  "placeholder.phone": { kind: "placeholder", text: "07X XXX XXXX" },
  // --- BATCH2 3.4: calendar, order states and marketplace vocabularies ---
  // Days WITHOUT «ال» (owner decision د5/1.1), in weekStart=0 order.
  "day.0": { kind: "badge", text: "أحد" },
  "day.1": { kind: "badge", text: "اثنين" },
  "day.2": { kind: "badge", text: "ثلاثاء" },
  "day.3": { kind: "badge", text: "أربعاء" },
  "day.4": { kind: "badge", text: "خميس" },
  "day.5": { kind: "badge", text: "جمعة" },
  "day.6": { kind: "badge", text: "سبت" },
  // The Levantine month names for the SCREEN-READER only (و-1: the screen
  // shows «07/2026»; the reader says «تموز 2026»).
  "month.1": { kind: "screen-reader", text: "كانون الثاني" },
  "month.2": { kind: "screen-reader", text: "شباط" },
  "month.3": { kind: "screen-reader", text: "آذار" },
  "month.4": { kind: "screen-reader", text: "نيسان" },
  "month.5": { kind: "screen-reader", text: "أيار" },
  "month.6": { kind: "screen-reader", text: "حزيران" },
  "month.7": { kind: "screen-reader", text: "تموز" },
  "month.8": { kind: "screen-reader", text: "آب" },
  "month.9": { kind: "screen-reader", text: "أيلول" },
  "month.10": { kind: "screen-reader", text: "تشرين الأول" },
  "month.11": { kind: "screen-reader", text: "تشرين الثاني" },
  "month.12": { kind: "screen-reader", text: "كانون الأول" },
  // The TEN order states + their «next step» texts (ADDENDUM 2.2.1 — the
  // badge text and the next-step label ride the SAME table).
  "order.draft": { kind: "badge", text: "مسودة" },
  "order.tentative": { kind: "badge", text: "اتفاق مبدئي" },
  "order.confirmed": { kind: "badge", text: "مؤكد" },
  "order.inProgress": { kind: "badge", text: "قيد التنفيذ" },
  "order.ready": { kind: "badge", text: "جاهز" },
  "order.delivered": { kind: "badge", text: "تم التسليم" },
  "order.settled": { kind: "badge", text: "تمت التسوية" },
  "order.deferred": { kind: "badge", text: "مؤجل" },
  "order.cancelled": { kind: "badge", text: "ملغى" },
  "order.needsReview": { kind: "badge", text: "يحتاج مراجعة" },
  "next.draft": { kind: "button", text: "أضف السعر والموعد" },
  "next.tentative": { kind: "button", text: "ابدأ التنفيذ" },
  "next.confirmed": { kind: "button", text: "ابدأ التنفيذ" },
  "next.inProgress": { kind: "button", text: "أكمل التنفيذ" },
  "next.ready": { kind: "button", text: "سجّل التسليم" },
  "next.delivered": { kind: "button", text: "راجع التحصيل والنتيجة" },
  "next.settled": { kind: "button", text: "راجع نتيجة الطلب" },
  "next.deferred": { kind: "button", text: "راجع سبب التأجيل" },
  "next.cancelled": { kind: "button", text: "راجع تسوية الطلب" },
  "next.needsReview": { kind: "button", text: "راجع الطلب" },
  // Availability (ADDENDUM 2.5) and report reasons (ADDENDUM 2.8).
  "avail.available": { kind: "badge", text: "متوفر" },
  "avail.onRequest": { kind: "badge", text: "بالطلب" },
  "avail.unavailable": { kind: "badge", text: "غير متوفر مؤقتاً" },
  "report.misleading": { kind: "badge", text: "معلومات مضللة" },
  "report.offTopic": { kind: "badge", text: "خارج النطاق المسموح" },
  "report.spam": { kind: "badge", text: "إعلان مزعج" },
  "report.contact": { kind: "badge", text: "مشكلة في التواصل" },
  "report.other": { kind: "badge", text: "سبب آخر" },
  "report.writeReason": { kind: "badge", text: "اكتب السبب" },
  "checkbox.tickThis": { kind: "help", text: "أشّر على هذا البند." },
  "radio.choose": { kind: "help", text: "اختر {label}." },
  "lab.h.radio": { kind: "title", text: "اختيار من قائمة" },
  "lab.tools": { kind: "screen-reader", text: "أدوات المختبر" },
  "lab.toolsTitle": { kind: "title", text: "أدوات المختبر" },
  "lab.h.toggle": { kind: "title", text: "إعداد يعمل فوراً" },
  "title.toggle": { kind: "title", text: "المفتاح" },
  "title.radio": { kind: "title", text: "مجموعة الراديو" },
  "sr.clearSearch": { kind: "screen-reader", text: "امسح البحث" },
  "search.in": { kind: "placeholder", text: "ابحث في {area}" },
  "lab.h.searchField": { kind: "title", text: "بحث داخل قسم" },
  "lab.h.textArea": { kind: "title", text: "نص متعدد الأسطر" },
  "lab.h.amountField": { kind: "title", text: "حقل المبالغ" },
  "title.amountField": { kind: "title", text: "حقل المبلغ" },
  "title.textArea": { kind: "title", text: "حقل الملاحظة" },
  "title.searchField": { kind: "title", text: "حقل البحث" },
  "lab.h.checkbox": { kind: "title", text: "بنود تُشَرّ مستقلة" },
  "state.errorRow": { kind: "badge", text: "حالة الخطأ" },
  "state.fractionFull": { kind: "badge", text: "خانات كاملة" },
  "title.checkbox": { kind: "title", text: "مربع الاختيار" }
  // ---------------------------------------------------------------------------
};
let pe = {};
function jr(e) {
  pe = { ...e };
}
function $r() {
  pe = {};
}
function Vr(e) {
  return pe[e];
}
function p(e, t) {
  let a = pe[e] ?? kt[e].text;
  if (t)
    for (const [r, s] of Object.entries(t))
      a = a.replaceAll(`{${r}}`, String(s));
  return a;
}
const Ge = {
  movements: { zero: "لا حركات", one: "حركة واحدة", two: "حركتين", few: "حركات", many: "حركة" },
  orders: { zero: "لا طلبات", one: "طلب واحد", two: "طلتان", few: "طلبات", many: "طلب" },
  quotes: { zero: "لا عروض", one: "عرض واحد", two: "عرضان", few: "عروض", many: "عرض" },
  results: { zero: "لا نتائج", one: "نتيجة واحدة", two: "نتيجتان", few: "نتائج", many: "نتيجة" },
  unread: { zero: "لا شيء غير مقروء", one: "غير مقروء واحد", two: "غير مقروءان", few: "غير مقروءة", many: "غير مقروءة" },
  // MonthGrid (§3.5-7): the counted items of a day in a cell's name.
  dayItems: { zero: "لا عناصر", one: "عنصر واحد", two: "عنصران", few: "عناصر", many: "عنصر" }
};
function V() {
  return {
    unit: p("money.unit"),
    minus: p("money.ariaMinus"),
    dinar: p("money.ariaDinar"),
    fils: p("money.ariaFils"),
    and: p("money.ariaAnd"),
    forYou: p("money.forYou"),
    againstYou: p("money.againstYou"),
    hidden: p("money.ariaHidden"),
    missing: p("money.ariaMissing"),
    hiddenGlyph: p("money.hiddenGlyph"),
    missingGlyph: p("money.missing")
  };
}
const xt = new Intl.PluralRules("ar");
function _e(e, t) {
  switch (xt.select(e)) {
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
const yt = "ص", vt = "م";
function $e(e) {
  return `${e < 10 ? "0" : ""}${e}`;
}
function wt(e) {
  return e instanceof Date ? { h: e.getHours(), m: e.getMinutes() } : e;
}
function Ir(e) {
  const { h: t, m: a } = wt(e), r = t < 12 ? yt : vt, s = t % 12 === 0 ? 12 : t % 12;
  return `${$e(s)}:${$e(a)} ${r}`;
}
const ge = "−", Nt = "+", ne = 3;
function At(e) {
  const t = String(e).trim(), a = t.startsWith("-"), r = a ? t.slice(1) : t, [s = "0", i = ""] = r.split("."), o = s.replace(/[^0-9]/g, "") || "0", d = (i + "000").slice(0, ne), l = BigInt(o) * 10n ** BigInt(ne) + BigInt(d || "0");
  return { negative: a, fils: l };
}
function Pt(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function St(e) {
  const t = 10n ** BigInt(ne), a = e / t, r = e % t;
  return {
    int: Pt(a.toString()),
    frac: r === 0n ? "" : `.${r.toString().padStart(ne, "0")}`
  };
}
function ke(e, t) {
  const a = 10n ** BigInt(ne), r = e / a, s = e % a;
  let i = `${r.toString()} ${t.dinar}`;
  return s !== 0n && (i += ` ${t.and}${s.toString()} ${t.fils}`), i;
}
function le(e, t) {
  const a = t.texts;
  if (e == null)
    return {
      missing: !0,
      hidden: !1,
      debt: t.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: "",
      debtWord: t.debt === "forYou" ? a.forYou : t.debt === "againstYou" ? a.againstYou : "",
      display: a.missingGlyph,
      aria: a.missing
    };
  if (t.hidden) {
    const b = t.debt === "forYou" ? a.forYou : t.debt === "againstYou" ? a.againstYou : "", h = b ? `${b} ${a.hiddenGlyph} ${a.unit}` : `${a.hiddenGlyph} ${a.unit}`;
    return {
      missing: !1,
      hidden: !0,
      debt: t.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: a.unit,
      debtWord: b,
      display: h,
      aria: a.hidden
    };
  }
  const { negative: s, fils: i } = At(e), o = St(i), d = t.debt === "forYou" ? a.forYou : t.debt === "againstYou" ? a.againstYou : "", l = d ? "" : t.flow === "in" ? Nt : t.flow === "out" ? ge : t.flow === "transfer" ? "" : s ? ge : "", c = `${l}${o.int}${o.frac}`, m = d ? `${d} ${c} ${a.unit}` : `${c} ${a.unit}`;
  let u;
  return d ? u = `${d} ${ke(i, a)}` : l === ge ? u = `${a.minus} ${ke(i, a)}` : u = ke(i, a), {
    missing: !1,
    hidden: !1,
    debt: t.debt ?? null,
    sign: l,
    int: o.int,
    frac: o.frac,
    unit: a.unit,
    debtWord: d,
    display: m,
    aria: u
  };
}
const Qe = Ye({ hidden: !1 });
function Fr({ children: e, hidden: t = !1 }) {
  const a = te(() => ({ hidden: t }), [t]);
  return /* @__PURE__ */ n(Qe.Provider, { value: a, children: e });
}
function Q() {
  const { hidden: e } = Pe(Qe);
  return { hidden: e, visible: !e };
}
const Ht = 500, Bt = qe("motion.press-cancel-px");
function N(e = {}) {
  const { onPress: t, onLongPress: a, disabled: r } = e, [s, i] = H(!1), o = Z(null), d = Z(null), l = Z(!1), c = O(() => {
    d.current !== null && (clearTimeout(d.current), d.current = null);
  }, []), m = O(() => {
    c(), o.current = null, l.current = !1, i(!1);
  }, [c]), u = O(
    (g) => {
      if (!r && !(g.pointerType === "mouse" && g.button !== 0)) {
        if (typeof g.currentTarget.setPointerCapture == "function")
          try {
            g.currentTarget.setPointerCapture(g.pointerId);
          } catch {
          }
        o.current = { x: g.clientX, y: g.clientY }, l.current = !1, i(!0), a && (d.current = setTimeout(() => {
          l.current = !0, a();
        }, Ht));
      }
    },
    [r, a]
  ), b = O(
    (g) => {
      if (!s || o.current === null) return;
      const k = g.clientX - o.current.x, x = g.clientY - o.current.y;
      Math.hypot(k, x) > Bt && m();
    },
    [s, m]
  ), h = O(
    (g) => {
      if (!s) return;
      const k = l.current;
      m(), !k && !r && t?.();
    },
    [s, r, t, m]
  );
  return {
    isPressed: s,
    pressProps: {
      onPointerDown: u,
      onPointerMove: b,
      onPointerUp: h,
      onPointerCancel: m
    }
  };
}
const Mt = () => typeof window > "u" || !window.visualViewport ? {
  height: typeof window > "u" ? 0 : window.innerHeight,
  offsetTop: 0,
  scale: 1,
  keyboardHeight: 0
} : We(window.visualViewport);
function We(e) {
  const t = e.height, a = e.offsetTop, r = Math.max(0, window.innerHeight - t - a);
  return { height: t, offsetTop: a, scale: e.scale, keyboardHeight: r };
}
function Zt() {
  const [e, t] = H(Mt);
  return R(() => {
    const a = window.visualViewport;
    if (!a) return;
    const r = () => t(We(a));
    return r(), a.addEventListener("resize", r), a.addEventListener("scroll", r), window.addEventListener("resize", r), window.addEventListener("orientationchange", r), () => {
      a.removeEventListener("resize", r), a.removeEventListener("scroll", r), window.removeEventListener("resize", r), window.removeEventListener("orientationchange", r);
    };
  }, []), e;
}
function Ue(e) {
  const [t, a] = H(!1);
  return R(() => {
    if (!e) return;
    const r = window.setTimeout(() => a(!0), _.motion["pending-delay"]);
    return () => {
      window.clearTimeout(r), a(!1);
    };
  }, [e]), e && t;
}
function Ct(e) {
  return 1 - Math.pow(1 - e, 3);
}
function Tt() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Dr(e, t, a) {
  const [r, s] = H(() => a ? e : t), i = Z(0), o = Tt();
  return R(() => {
    if (o || !a || e === t) {
      const u = requestAnimationFrame(() => s(t));
      return () => cancelAnimationFrame(u);
    }
    const l = performance.now(), c = _.motion.count.ms, m = (u) => {
      const b = Math.min(1, (u - l) / c);
      s(e + (t - e) * Ct(b)), b < 1 && (i.current = requestAnimationFrame(m));
    };
    return i.current = requestAnimationFrame(m), () => cancelAnimationFrame(i.current);
  }, [a, e, t, o]), R(() => () => cancelAnimationFrame(i.current), []), a && !o && e !== t && r !== t ? r : t;
}
const He = Ye({
  sheetIds: [],
  registerSheet: () => {
  },
  unregisterSheet: () => {
  }
});
function jt(e, t) {
  switch (t.type) {
    case "register":
      return e.includes(t.id) ? e : [...e, t.id];
    case "unregister":
      return e.includes(t.id) ? e.filter((a) => a !== t.id) : e;
    default:
      return e;
  }
}
function Lr({ children: e }) {
  const [t, a] = ft(jt, []), r = O((o) => a({ type: "register", id: o }), []), s = O((o) => a({ type: "unregister", id: o }), []), i = te(
    () => ({ sheetIds: t, registerSheet: r, unregisterSheet: s }),
    [t, r, s]
  );
  return /* @__PURE__ */ n(He.Provider, { value: i, children: e });
}
function Er() {
  const { sheetIds: e, registerSheet: t, unregisterSheet: a } = Pe(He), r = Se();
  bt(() => (t(r), () => a(r)), [r, t, a]);
  const s = e.indexOf(r) + 1 || e.length + 1, i = Math.min(s, 2), o = s === e.length;
  return {
    level: i,
    overLimit: s > 2,
    sheetZ: i === 1 ? "var(--mds-layer-sheet)" : "var(--mds-layer-sheet-2)",
    scrimZ: i === 1 ? "var(--mds-layer-scrim)" : "var(--mds-layer-scrim-2)",
    isTop: o
  };
}
function Or() {
  const { sheetIds: e } = Pe(He);
  return e.length;
}
const $t = /* @__PURE__ */ f("g", { transform: "translate(16 16)", id: "micro-symbol-master-2", children: [
  /* @__PURE__ */ n("g", { id: "module-top", transform: "rotate(0 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-top", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ n("g", { id: "module-right", transform: "rotate(90 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-right", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-signal)" }) }),
  /* @__PURE__ */ n("g", { id: "module-bottom", transform: "rotate(180 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-bottom", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ n("g", { id: "module-left", transform: "rotate(270 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-left", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-data)" }) })
] });
function Vt({ size: e = 28, className: t, ...a }) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 224 224",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", t].filter(Boolean).join(" "),
      ...a,
      children: $t
    }
  );
}
const It = {
  regular: /* @__PURE__ */ n("path", { d: "M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z" })
};
function Rr({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: It[t]
    }
  );
}
const Ft = {
  regular: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z" })
};
function zr({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Ft[t]
    }
  );
}
const Dt = {
  regular: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z" })
};
function Yr({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Dt[t]
    }
  );
}
const Lt = {
  regular: /* @__PURE__ */ n("path", { d: "M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A8.13,8.13,0,0,0,255.43,117ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208ZM32,136V72H176v64Zm160,72a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm0-96V88h34.58l9.6,24Z" })
};
function qr({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...r,
      children: Lt[t]
    }
  );
}
const Et = {
  regular: /* @__PURE__ */ n("path", { d: "M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z" })
};
function Gr({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Et[t]
    }
  );
}
const Ot = {
  regular: /* @__PURE__ */ n("path", { d: "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" })
};
function Rt({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Ot[t]
    }
  );
}
const zt = {
  regular: /* @__PURE__ */ n("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" })
};
function Yt({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: zt[t]
    }
  );
}
const qt = {
  regular: /* @__PURE__ */ n("path", { d: "M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" })
};
function Gt({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: qt[t]
    }
  );
}
const _t = {
  regular: /* @__PURE__ */ n("path", { d: "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" })
};
function Qt({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...r,
      children: _t[t]
    }
  );
}
const Wt = {
  bold: /* @__PURE__ */ n("path", { d: "M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" })
};
function Ke({
  size: e = 16,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...r,
      children: Wt[t]
    }
  );
}
const Ut = {
  bold: /* @__PURE__ */ n("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" })
};
function Xe({
  size: e = 16,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Ut[t]
    }
  );
}
const Kt = {
  regular: /* @__PURE__ */ n("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function Xt({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Kt[t]
    }
  );
}
const Jt = {
  bold: /* @__PURE__ */ n("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function se({
  size: e = 16,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Jt[t]
    }
  );
}
const en = {
  regular: /* @__PURE__ */ n("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" })
};
function tn({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: en[t]
    }
  );
}
const nn = {
  fill: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function ie({
  size: e = 20,
  weight: t = "fill",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: nn[t]
    }
  );
}
const an = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function rn({
  size: e = 16,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: an[t]
    }
  );
}
const sn = {
  bold: /* @__PURE__ */ n("path", { d: "M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" })
};
function _r({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: sn[t]
    }
  );
}
const on = {
  bold: /* @__PURE__ */ n("path", { d: "M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" })
};
function Qr({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: on[t]
    }
  );
}
const dn = {
  bold: /* @__PURE__ */ n("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function Je({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: dn[t]
    }
  );
}
const ln = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z" })
};
function cn({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: ln[t]
    }
  );
}
const mn = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function Be({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: mn[t]
    }
  );
}
const un = {
  bold: /* @__PURE__ */ n("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" })
};
function hn({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: un[t]
    }
  );
}
const pn = {
  bold: /* @__PURE__ */ n("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" })
};
function fn({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: pn[t]
    }
  );
}
const bn = {
  regular: /* @__PURE__ */ n("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" })
};
function Wr({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: bn[t]
    }
  );
}
const gn = {
  regular: /* @__PURE__ */ n("path", { d: "M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z" })
};
function kn({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: gn[t]
    }
  );
}
const xn = {
  regular: /* @__PURE__ */ n("path", { d: "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z" })
};
function yn({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: xn[t]
    }
  );
}
const vn = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" })
};
function wn({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: vn[t]
    }
  );
}
const Nn = {
  regular: /* @__PURE__ */ n("path", { d: "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z" })
};
function Ur({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Nn[t]
    }
  );
}
const An = {
  fill: /* @__PURE__ */ n("path", { d: "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" })
};
function Pn({
  size: e = 14,
  weight: t = "fill",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: An[t]
    }
  );
}
const Sn = {
  fill: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" })
};
function Hn({
  size: e = 14,
  weight: t = "fill",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Sn[t]
    }
  );
}
const Bn = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function Mn({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Bn[t]
    }
  );
}
const Zn = {
  regular: /* @__PURE__ */ n("path", { d: "M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM80,40h40V56H80ZM54.25,72h147.5l20,80H34.25ZM32,192V168H224v24ZM64,96a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,96ZM64,128a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,128Z" })
};
function Kr({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Zn[t]
    }
  );
}
const Cn = {
  regular: /* @__PURE__ */ n("path", { d: "M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z" })
};
function Xr({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Cn[t]
    }
  );
}
const Tn = {
  regular: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" })
};
function Jr({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Tn[t]
    }
  );
}
const jn = {
  regular: /* @__PURE__ */ n("path", { d: "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z" })
};
function es({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...r,
      children: jn[t]
    }
  );
}
const $n = {
  regular: /* @__PURE__ */ n("path", { d: "M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9ZM164,96a36,36,0,0,0,5.9-.48,36,36,0,1,0,28.22-47A36,36,0,1,0,164,96Zm60-12a20,20,0,1,1-20-20A20,20,0,0,1,224,84ZM164,40a20,20,0,0,1,19.25,14.61,36,36,0,0,0-15,24.93A20.42,20.42,0,0,1,164,80a20,20,0,0,1,0-40Z" })
};
function ts({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: $n[t]
    }
  );
}
const Vn = {
  regular: /* @__PURE__ */ n("path", { d: "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" })
};
function ns({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Vn[t]
    }
  );
}
const In = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function as({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: In[t]
    }
  );
}
const Fn = {
  regular: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" })
};
function rs({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Fn[t]
    }
  );
}
const Dn = {
  regular: /* @__PURE__ */ n("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function ss({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Dn[t]
    }
  );
}
const Ln = {
  regular: /* @__PURE__ */ n("path", { d: "M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z" })
};
function is({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Ln[t]
    }
  );
}
const En = {
  regular: /* @__PURE__ */ n("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" })
};
function os({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: En[t]
    }
  );
}
const On = {
  regular: /* @__PURE__ */ n("path", { d: "M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z" })
};
function ds({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: On[t]
    }
  );
}
const Rn = {
  regular: /* @__PURE__ */ n("path", { d: "M216,40H68.53a16.08,16.08,0,0,0-13.72,7.77L9.14,123.88a8,8,0,0,0,0,8.24l45.67,76.11A16.08,16.08,0,0,0,68.53,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM61.67,204.12,68.53,200h0ZM216,200H68.53l-43.2-72,43.2-72H216ZM106.34,146.34,124.69,128l-18.35-18.34a8,8,0,0,1,11.32-11.32L136,116.69l18.34-18.35a8,8,0,0,1,11.32,11.32L147.31,128l18.35,18.34a8,8,0,0,1-11.32,11.32L136,139.31l-18.34,18.35a8,8,0,0,1-11.32-11.32Z" })
};
function zn({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Rn[t]
    }
  );
}
const Yn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" })
};
function et({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Yn[t]
    }
  );
}
const qn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" })
};
function Gn({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: qn[t]
    }
  );
}
const _n = {
  regular: /* @__PURE__ */ n("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function tt({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: _n[t]
    }
  );
}
const Qn = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" })
};
function Wn({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Qn[t]
    }
  );
}
const Un = {
  regular: /* @__PURE__ */ n("path", { d: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z" })
};
function ls({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Un[t]
    }
  );
}
const Kn = {
  regular: /* @__PURE__ */ n("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" })
};
function cs({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Kn[t]
    }
  );
}
const Xn = {
  regular: /* @__PURE__ */ n("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" })
};
function ms({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Xn[t]
    }
  );
}
const Jn = {
  regular: /* @__PURE__ */ n("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" })
};
function us({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: Jn[t]
    }
  );
}
const ea = {
  regular: /* @__PURE__ */ n("path", { d: "M197.66,69.66,83.31,184H168a8,8,0,0,1,0,16H64a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v84.69L186.34,58.34a8,8,0,0,1,11.32,11.32Z" })
};
function hs({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...r,
      children: ea[t]
    }
  );
}
const ta = {
  regular: /* @__PURE__ */ n("path", { d: "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" })
};
function ps({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...r,
      children: ta[t]
    }
  );
}
const na = {
  regular: /* @__PURE__ */ n("path", { d: "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" })
};
function fs({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: na[t]
    }
  );
}
const aa = {
  regular: /* @__PURE__ */ n("path", { d: "M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" })
};
function bs({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: aa[t]
    }
  );
}
const ra = {
  regular: /* @__PURE__ */ n("path", { d: "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" })
};
function gs({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: ra[t]
    }
  );
}
const sa = {
  regular: /* @__PURE__ */ n("path", { d: "M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z" })
};
function ks({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...r,
      children: sa[t]
    }
  );
}
const ia = {
  regular: /* @__PURE__ */ n("path", { d: "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z" })
};
function xs({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: ia[t]
    }
  );
}
const oa = {
  regular: /* @__PURE__ */ n("path", { d: "M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" })
};
function ys({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: oa[t]
    }
  );
}
const da = {
  regular: /* @__PURE__ */ n("path", { d: "M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function vs({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: da[t]
    }
  );
}
const la = {
  regular: /* @__PURE__ */ n("path", { d: "M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function ws({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: la[t]
    }
  );
}
const ca = {
  regular: /* @__PURE__ */ n("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" })
};
function Ns({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: ca[t]
    }
  );
}
const ma = {
  regular: /* @__PURE__ */ n("path", { d: "M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" })
};
function As({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: ma[t]
    }
  );
}
const ua = {
  regular: /* @__PURE__ */ n("path", { d: "M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z" })
};
function Ps({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: ua[t]
    }
  );
}
const ha = {
  regular: /* @__PURE__ */ n("path", { d: "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z" })
};
function Ss({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: ha[t]
    }
  );
}
const pa = {
  bold: /* @__PURE__ */ n("path", { d: "M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z" })
};
function Hs({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...r
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...r,
      children: pa[t]
    }
  );
}
const Bs = ["nav-delivery", "back", "forward", "transfer", "movement-in", "movement-out", "send"];
function Me({
  value: e,
  flow: t,
  debt: a,
  size: r = "md",
  state: s = "idle",
  disabled: i = !1,
  className: o,
  id: d,
  style: l,
  ref: c,
  ...m
}) {
  const { hidden: u } = Q(), b = u && e !== null && e !== void 0, h = le(e, { flow: t, debt: a, hidden: b, texts: V() }), g = ["mds-money", `mds-money--${r}`, r === "lg" ? "mds-number-lg" : "", i ? "mds-money--disabled" : "", o].filter(Boolean).join(" ");
  return s === "loading" ? /* @__PURE__ */ n("span", { ref: c, id: d, style: l, className: g, "aria-busy": "true", ...m, children: /* @__PURE__ */ n("span", { className: "mds-money-skeleton", "aria-hidden": "true" }) }) : /* @__PURE__ */ f("span", { ref: c, id: d, style: l, className: g, ...m, children: [
    /* @__PURE__ */ f("span", { className: "mds-money-visual", "aria-hidden": "true", children: [
      h.debtWord ? /* @__PURE__ */ n("span", { className: "mds-money-debt", children: h.debtWord }) : null,
      h.missing ? /* @__PURE__ */ n("span", { className: "mds-money-missing", children: V().missingGlyph }) : /* @__PURE__ */ f(G, { children: [
        /* @__PURE__ */ n("bdi", { className: "mds-money-value", dir: "ltr", children: h.hidden ? V().hiddenGlyph : /* @__PURE__ */ f(G, { children: [
          /* @__PURE__ */ f("span", { className: "mds-money-integer", children: [
            h.sign,
            h.int
          ] }),
          h.frac ? /* @__PURE__ */ n("span", { className: "mds-money-fraction", children: h.frac }) : null
        ] }) }),
        /* @__PURE__ */ n("span", { className: "mds-money-unit", children: h.unit })
      ] })
    ] }, b ? "hidden" : "shown"),
    /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: h.aria })
  ] });
}
const Ms = [
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
function fa({
  onChange: e,
  disabled: t = !1,
  density: a = "regular",
  className: r,
  id: s,
  style: i,
  ref: o,
  ...d
}) {
  const { hidden: l, visible: c } = Q(), m = l ? Gt : Yt, u = p(l ? "button.showAmounts" : "button.hideAmounts"), b = [
    "mds-amount-visibility-toggle",
    a === "large" ? "mds-amount-visibility-toggle--large" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      ref: o,
      id: s,
      style: i,
      ...d,
      type: "button",
      className: b,
      "aria-label": u,
      disabled: t,
      onClick: () => e?.(!c),
      children: /* @__PURE__ */ n(m, { size: 24 })
    }
  );
}
const Zs = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "amountsShown",
  "amountsHidden"
];
function Cs({
  label: e,
  caption: t,
  selected: a = !1,
  onChange: r,
  disabled: s = !1,
  state: i = "idle",
  className: o,
  id: d,
  style: l,
  ref: c,
  "aria-label": m,
  ...u
}) {
  const b = [
    // .mds-control-row (base.css): the shared row-plain anatomy; the box
    // aligns to the FIRST text line, so the alignment overrides to start.
    "mds-control-row",
    "mds-checkbox",
    a ? "mds-checkbox--selected" : "",
    s ? "mds-checkbox--disabled" : "",
    i === "error" ? "mds-checkbox--error" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("label", { ref: c, id: d, style: l, className: b, ...u, children: [
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        className: "mds-checkbox-input mds-sr-input",
        checked: a,
        disabled: s,
        onChange: (h) => r?.(h.target.checked),
        "aria-label": m,
        "aria-invalid": i === "error" || void 0
      }
    ),
    /* @__PURE__ */ n("span", { className: "mds-checkbox-box", "aria-hidden": "true", children: /* @__PURE__ */ n(se, { size: 14 }) }),
    /* @__PURE__ */ f("span", { className: "mds-checkbox-text mds-control-text", children: [
      /* @__PURE__ */ n("span", { className: "mds-checkbox-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ n("span", { className: "mds-checkbox-caption mds-type-caption", children: t }) : null
    ] }),
    i === "error" ? /* @__PURE__ */ n("span", { className: "mds-checkbox-error mds-type-caption", children: p("checkbox.tickThis") }) : null
  ] });
}
const Ts = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function js({
  label: e,
  items: t,
  value: a,
  onChange: r,
  disabled: s = !1,
  state: i = "idle",
  className: o,
  id: d,
  style: l,
  ref: c,
  ...m
}) {
  const u = Se(), b = [
    "mds-radio",
    s ? "mds-radio--disabled" : "",
    i === "error" ? "mds-radio--error" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("div", { ref: c, id: d, style: l, className: b, ...m, children: [
    /* @__PURE__ */ n("span", { className: "mds-radio-label mds-type-label", children: e }),
    /* @__PURE__ */ n("div", { className: "mds-radio-surface", role: "radiogroup", "aria-label": e, children: t.map((h) => {
      const g = h.value === a;
      return /* @__PURE__ */ f("label", { className: "mds-control-row mds-radio-row", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "radio",
            className: "mds-radio-input mds-sr-input",
            name: u,
            checked: g,
            disabled: s || h.disabled,
            onChange: () => r?.(h.value)
          }
        ),
        /* @__PURE__ */ n("span", { className: "mds-radio-circle", "aria-hidden": "true", children: /* @__PURE__ */ n("span", { className: "mds-radio-dot" }) }),
        /* @__PURE__ */ f("span", { className: "mds-radio-text mds-control-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-radio-row-label mds-type-body", children: h.label }),
          h.caption ? /* @__PURE__ */ n("span", { className: "mds-radio-caption mds-type-caption", children: h.caption }) : null
        ] })
      ] }, h.value);
    }) }),
    i === "error" ? /* @__PURE__ */ n("span", { className: "mds-radio-error mds-type-caption", children: p("radio.choose").replace("{label}", e) }) : null
  ] });
}
const $s = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function Vs({
  label: e,
  caption: t,
  selected: a = !1,
  onChange: r,
  disabled: s = !1,
  className: i,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = [
    // .mds-control-row (base.css): the whole row is the switch's press zone.
    "mds-control-row",
    "mds-toggle",
    a ? "mds-toggle--selected" : "",
    s ? "mds-toggle--disabled" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("label", { ref: l, id: o, style: d, className: m, ...c, children: [
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        className: "mds-toggle-input mds-sr-input",
        role: "switch",
        checked: a,
        disabled: s,
        onChange: (u) => r?.(u.target.checked),
        "aria-checked": a
      }
    ),
    /* @__PURE__ */ f("span", { className: "mds-toggle-text mds-control-text", children: [
      /* @__PURE__ */ n("span", { className: "mds-toggle-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ n("span", { className: "mds-toggle-caption mds-type-caption", children: t }) : null
    ] }),
    /* @__PURE__ */ n("span", { className: "mds-toggle-switch", "aria-hidden": "true", children: /* @__PURE__ */ n("span", { className: "mds-toggle-track", children: /* @__PURE__ */ n("span", { className: "mds-toggle-thumb", children: /* @__PURE__ */ n(se, { size: 14 }) }) }) })
  ] });
}
const Is = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled"
];
function ba({
  label: e,
  placeholder: t,
  value: a = "",
  onChange: r,
  disabled: s = !1,
  className: i,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = a.length > 0, u = [
    "mds-search-field",
    s ? "mds-search-field--disabled" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("div", { ref: l, id: o, style: d, className: u, ...c, children: [
    /* @__PURE__ */ n(tn, { size: 20 }),
    /* @__PURE__ */ n(
      "input",
      {
        type: "search",
        className: "mds-search-field-input",
        role: "searchbox",
        "aria-label": e,
        placeholder: t,
        value: a,
        disabled: s,
        enterKeyHint: "search",
        onChange: (b) => r?.(b.target.value)
      }
    ),
    m ? /* @__PURE__ */ n(
      ga,
      {
        onClear: () => {
          r?.("");
        }
      }
    ) : null
  ] });
}
function ga({ onClear: e }) {
  const { isPressed: t, pressProps: a } = N({ onPress: e });
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: ["mds-search-field-clear", t ? "mds-search-field-clear--pressed" : ""].filter(Boolean).join(" "),
      "data-ds-exempt": "",
      "aria-label": p("sr.clearSearch"),
      ...a,
      children: /* @__PURE__ */ n(ie, { size: 20 })
    }
  );
}
const Fs = [
  "default",
  "focused",
  "disabled",
  "withText"
];
function Ds({
  label: e,
  caption: t,
  value: a = "",
  onChange: r,
  placeholder: s,
  state: i = "idle",
  disabled: o = !1,
  optional: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const h = Se(), g = te(() => `${h}-error`, [h]), k = [
    "mds-field",
    "mds-text-area",
    i === "error" ? "mds-text-area--error" : "",
    o ? "mds-text-area--disabled mds-field--disabled" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("div", { id: c, style: m, className: k, ...b, children: [
    /* @__PURE__ */ f("label", { className: "mds-text-area-label mds-type-label", htmlFor: c ?? h, children: [
      e,
      d ? /* @__PURE__ */ n("span", { className: "mds-text-area-optional mds-type-caption", children: p("field.optional") }) : null
    ] }),
    /* @__PURE__ */ n(
      "textarea",
      {
        ref: u,
        id: c ?? h,
        className: "mds-text-area-input mds-field-input",
        rows: 1,
        value: a,
        disabled: o,
        placeholder: s,
        "aria-multiline": "true",
        "aria-invalid": i === "error" || void 0,
        "aria-describedby": i === "error" ? g : void 0,
        enterKeyHint: "enter",
        onChange: (x) => r?.(x.target.value),
        onInput: (x) => {
          const v = x.currentTarget;
          v.style.height = "auto", v.style.height = `${v.scrollHeight}px`;
        }
      }
    ),
    i === "error" ? /* @__PURE__ */ f("span", { id: g, className: "mds-text-area-help mds-type-caption", children: [
      /* @__PURE__ */ n(rn, { size: 16 }),
      /* @__PURE__ */ n("span", { children: t })
    ] }) : t ? /* @__PURE__ */ n("span", { className: "mds-text-area-help mds-type-caption", children: /* @__PURE__ */ n("span", { children: t }) }) : null
  ] });
}
const Ls = [
  "default",
  "focused",
  "error",
  "disabled",
  "grown"
], Ve = 1632, ka = 1641, xa = 1643;
function ya(e) {
  let t = "", a = !1;
  for (const s of e) {
    const i = s.codePointAt(0);
    if (i >= Ve && i <= ka) {
      const o = String(i - Ve);
      t = r(t, o);
      continue;
    }
    if (s >= "0" && s <= "9") {
      t = r(t, s);
      continue;
    }
    if ((i === xa || s === "." || s === ",") && !a) {
      t === "" && (t = "0"), t += ".", a = !0;
      continue;
    }
  }
  return t;
  function r(s, i) {
    return s.includes(".") && s.length - s.indexOf(".") - 1 >= 3 || s === "0" && i === "0" ? s : s === "0" ? i : s + i;
  }
}
function Es({
  label: e,
  caption: t,
  value: a = "",
  onChange: r,
  disabled: s = !1,
  state: i = "idle",
  draft: o = !1,
  className: d,
  id: l,
  style: c,
  ref: m,
  useSystemKeyboard: u = !0,
  ...b
}) {
  const [h, g] = H(!1), k = [
    "mds-amount-field",
    s ? "mds-amount-field--disabled" : "",
    i === "error" ? "mds-amount-field--error" : "",
    o ? "mds-amount-field--draft" : "",
    d
  ].filter(Boolean).join(" "), x = h || a === "" ? a : le(a, { texts: V() }).int + (a.includes(".") ? le(a, { texts: V() }).frac : "");
  return /* @__PURE__ */ f("div", { id: l, style: c, className: k, ...b, children: [
    /* @__PURE__ */ n("span", { className: "mds-amount-field-label mds-type-label", children: e }),
    /* @__PURE__ */ f("div", { className: "mds-amount-field-box", children: [
      /* @__PURE__ */ n(
        "input",
        {
          ref: m,
          className: [
            "mds-amount-field-input",
            // ADDENDUM 2.1: past 13 characters the type drops in ONE step to
            // number-lg — the shared .mds-number-lg class (base.css), exactly
            // the Money/HeroSurface drop (23.20).
            x.length > 13 ? "mds-number-lg" : ""
          ].filter(Boolean).join(" "),
          inputMode: u ? "decimal" : "none",
          enterKeyHint: "next",
          value: x,
          disabled: s,
          "aria-label": e,
          "aria-invalid": i === "error" || void 0,
          onFocus: () => g(!0),
          onBlur: () => g(!1),
          "data-long": x.length > 13 ? "true" : void 0,
          onChange: (v) => r?.(ya(v.target.value))
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-amount-field-unit", children: V().unit })
    ] }),
    i === "error" && t ? /* @__PURE__ */ n("span", { className: "mds-amount-field-help", children: t }) : t ? /* @__PURE__ */ n("span", { className: "mds-amount-field-help", children: t }) : null
  ] });
}
const Os = [
  "default",
  "focused",
  "error",
  "disabled",
  "long"
], D = {
  0: "keypad.sr0",
  1: "keypad.sr1",
  2: "keypad.sr2",
  3: "keypad.sr3",
  4: "keypad.sr4",
  5: "keypad.sr5",
  6: "keypad.sr6",
  7: "keypad.sr7",
  8: "keypad.sr8",
  9: "keypad.sr9",
  "000": "keypad.sr000",
  ".": "keypad.srDecimal"
};
function L({ value: e, label: t, style: a, disabled: r, onPress: s }) {
  const { isPressed: i, pressProps: o } = N({ onPress: s, disabled: r }), d = [
    "mds-keypad-key",
    "mds-keypad-key--glyph",
    i ? "mds-keypad-key--pressed" : "",
    r ? "mds-keypad-key--disabled" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: d,
      style: a,
      "aria-label": p(t),
      "aria-disabled": r || void 0,
      disabled: r,
      ...o,
      children: /* @__PURE__ */ n("span", { className: "mds-keypad-key-label mds-number-lg", children: e })
    }
  );
}
function va({ style: e, disabled: t, onPress: a, onLongPress: r }) {
  const { isPressed: s, pressProps: i } = N({ onPress: a, onLongPress: r, disabled: t }), o = [
    "mds-keypad-key",
    "mds-keypad-key--backspace",
    s ? "mds-keypad-key--pressed" : "",
    t ? "mds-keypad-key--disabled" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: o,
      style: e,
      "aria-label": p("keypad.srBackspace"),
      "aria-disabled": t || void 0,
      disabled: t,
      ...i,
      children: /* @__PURE__ */ n(zn, { size: 24 })
    }
  );
}
function Rs({
  value: e = "",
  onChange: t,
  onLongPress: a,
  disabled: r = !1,
  className: s,
  id: i,
  style: o,
  ref: d,
  ...l
}) {
  const c = e.includes("."), m = c ? (e.split(".")[1] ?? "").length : 0, u = c && m >= 3, b = ["mds-keypad", r ? "mds-keypad--disabled" : "", s].filter(Boolean).join(" "), h = (g) => r || g === "." && c || g !== "." && u;
  return /* @__PURE__ */ f(
    "div",
    {
      ref: d,
      id: i,
      style: o,
      className: b,
      dir: "ltr",
      role: "group",
      "aria-label": p("keypad.srGroup"),
      "data-value": e,
      ...l,
      children: [
        /* @__PURE__ */ n(L, { value: "1", label: D[1], style: { gridArea: "1 / 1 / 2 / 2" }, disabled: h("1"), onPress: () => t?.("1") }),
        /* @__PURE__ */ n(L, { value: "2", label: D[2], style: { gridArea: "1 / 2 / 2 / 3" }, disabled: h("2"), onPress: () => t?.("2") }),
        /* @__PURE__ */ n(L, { value: "3", label: D[3], style: { gridArea: "1 / 3 / 2 / 4" }, disabled: h("3"), onPress: () => t?.("3") }),
        /* @__PURE__ */ n(
          va,
          {
            style: { gridArea: "1 / 4 / 3 / 5" },
            disabled: r,
            onPress: () => t?.("backspace"),
            onLongPress: () => a?.()
          }
        ),
        /* @__PURE__ */ n(L, { value: "4", label: D[4], style: { gridArea: "2 / 1 / 3 / 2" }, disabled: h("4"), onPress: () => t?.("4") }),
        /* @__PURE__ */ n(L, { value: "5", label: D[5], style: { gridArea: "2 / 2 / 3 / 3" }, disabled: h("5"), onPress: () => t?.("5") }),
        /* @__PURE__ */ n(L, { value: "6", label: D[6], style: { gridArea: "2 / 3 / 3 / 4" }, disabled: h("6"), onPress: () => t?.("6") }),
        /* @__PURE__ */ n(L, { value: "7", label: D[7], style: { gridArea: "3 / 1 / 4 / 2" }, disabled: h("7"), onPress: () => t?.("7") }),
        /* @__PURE__ */ n(L, { value: "8", label: D[8], style: { gridArea: "3 / 2 / 4 / 3" }, disabled: h("8"), onPress: () => t?.("8") }),
        /* @__PURE__ */ n(L, { value: "9", label: D[9], style: { gridArea: "3 / 3 / 4 / 4" }, disabled: h("9"), onPress: () => t?.("9") }),
        /* @__PURE__ */ n(L, { value: ".", label: D["."], style: { gridArea: "3 / 4 / 4 / 5" }, disabled: h("."), onPress: () => t?.(".") }),
        /* @__PURE__ */ n(L, { value: "0", label: D[0], style: { gridArea: "4 / 1 / 5 / 3" }, disabled: h("0"), onPress: () => t?.("0") }),
        /* @__PURE__ */ n(L, { value: "000", label: D["000"], style: { gridArea: "4 / 3 / 5 / 5" }, disabled: h("000"), onPress: () => t?.("000") })
      ]
    }
  );
}
const zs = [
  "default",
  "pressed",
  "disabled",
  "decimal-disabled",
  "fraction-full"
], W = [
  { value: "in", word: "movement.in" },
  { value: "out", word: "movement.out" },
  { value: "transfer", word: "movement.transfer" }
];
function Ys({
  value: e,
  onChange: t,
  disabled: a = !1,
  state: r = "idle",
  className: s,
  id: i,
  style: o,
  ref: d,
  ...l
}) {
  const c = [
    "mds-movement-type",
    r === "error" ? "mds-movement-type--error" : "",
    s
  ].filter(Boolean).join(" "), m = (u, b) => {
    const h = u === void 0 ? -1 : W.findIndex((g) => g.value === u);
    return W[(h + b + W.length) % W.length] ?? W[0];
  };
  return /* @__PURE__ */ f(
    "div",
    {
      ref: d,
      id: i,
      style: o,
      className: c,
      role: "radiogroup",
      "aria-label": p("movementType.srGroup"),
      "data-value": e ?? "",
      ...l,
      children: [
        /* @__PURE__ */ n("div", { className: "mds-segmented", children: W.map((u) => /* @__PURE__ */ n(
          wa,
          {
            segment: u,
            selected: u.value === e,
            disabled: a,
            onChange: t,
            walk: m
          },
          u.value
        )) }),
        r === "error" ? /* @__PURE__ */ n("span", { className: "mds-movement-type-error mds-type-caption", children: p("movementType.choose") }) : null
      ]
    }
  );
}
function wa({
  segment: e,
  selected: t,
  disabled: a,
  onChange: r,
  walk: s
}) {
  const { isPressed: i, pressProps: o } = N({ onPress: () => r?.(e.value), disabled: a }), d = [
    "mds-segmented-segment",
    t ? "mds-segmented-segment--selected" : "",
    i ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: d,
      "aria-checked": t,
      "aria-label": p(e.word),
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      onKeyDown: (l) => {
        const c = l.key === "ArrowLeft" || l.key === "ArrowDown" ? 1 : l.key === "ArrowRight" || l.key === "ArrowUp" ? -1 : 0;
        if (c === 0) return;
        l.preventDefault();
        const m = s(e.value, c);
        r?.(m.value);
        const u = l.currentTarget.parentElement;
        (u ? Array.from(u.querySelectorAll('[role="radio"]')) : [])[W.findIndex((h) => h.value === m.value)]?.focus();
      },
      ...o,
      children: /* @__PURE__ */ n("span", { className: "mds-segmented-segment-label", children: p(e.word) })
    }
  );
}
const qs = [
  "default",
  "selected",
  "pressed",
  "disabled",
  "error"
], Na = qe("motion.response-max-ms");
function Aa({
  label: e,
  value: t,
  onChange: a,
  min: r = 0,
  max: s,
  step: i = 1,
  disabled: o = !1,
  className: d,
  id: l,
  style: c,
  ref: m,
  ...u
}) {
  const b = t ?? r, h = o || b <= r, g = o || s !== void 0 && b >= s, [k, x] = H(null), v = k ?? String(b), y = Z(null), w = Z(() => {
  }), P = Z(t), B = O(() => {
    y.current !== null && (clearInterval(y.current), y.current = null);
  }, []), A = O(
    (T) => {
      x(null);
      const F = (P.current ?? r) + T * i;
      F < r || s !== void 0 && F > s || a?.(F);
    },
    [r, s, i, a]
  );
  R(() => {
    w.current = A, P.current = t;
  });
  const I = O((T) => {
    B(), w.current(T), y.current = setInterval(() => w.current(T), Na);
  }, [B]);
  R(() => B, [B]);
  const M = ["mds-quantity-stepper", o ? "mds-quantity-stepper--disabled" : "", d].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "div",
    {
      ref: m,
      id: l,
      style: c,
      className: M,
      dir: "ltr",
      role: "group",
      "aria-label": e,
      "data-value": b,
      ...u,
      children: [
        /* @__PURE__ */ n(
          Ie,
          {
            icon: /* @__PURE__ */ n(Gn, { size: 20 }),
            name: p("quantity.decrease"),
            disabled: h,
            step: () => A(-1),
            startRepeat: () => I(-1),
            stopRepeat: B
          }
        ),
        /* @__PURE__ */ n(
          "input",
          {
            type: "text",
            className: "mds-quantity-stepper-input mds-type-amount-row",
            inputMode: "numeric",
            "aria-label": e,
            value: v,
            disabled: o,
            onFocus: () => x(String(b)),
            onChange: (T) => {
              const F = T.currentTarget.value;
              x(F);
              const q = Number.parseInt(F, 10);
              Number.isFinite(q) && q >= r && (s === void 0 || q <= s) && a?.(q);
            },
            onBlur: () => {
              const T = Number.parseInt(k ?? "", 10), F = Number.isFinite(T) ? Math.min(Math.max(T, r), s ?? Number.MAX_SAFE_INTEGER) : b, q = Math.round(F / i) * i, de = Math.min(Math.max(q, r), s ?? Number.MAX_SAFE_INTEGER);
              de !== b && a?.(de), x(null);
            }
          }
        ),
        /* @__PURE__ */ n(
          Ie,
          {
            icon: /* @__PURE__ */ n(et, { size: 20 }),
            name: p("quantity.increase"),
            disabled: g,
            step: () => A(1),
            startRepeat: () => I(1),
            stopRepeat: B
          }
        )
      ]
    }
  );
}
function Ie({
  icon: e,
  name: t,
  disabled: a,
  step: r,
  startRepeat: s,
  stopRepeat: i
}) {
  const { isPressed: o, pressProps: d } = N({
    onPress: r,
    onLongPress: s,
    disabled: a
  }), l = [
    "mds-quantity-stepper-button",
    o ? "mds-quantity-stepper-button--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: l,
      "aria-label": t,
      "aria-disabled": a || void 0,
      disabled: a,
      onKeyDown: (c) => {
        (c.key === " " || c.key === "Enter") && !c.repeat && (c.preventDefault(), s());
      },
      onKeyUp: (c) => {
        (c.key === " " || c.key === "Enter") && i();
      },
      ...d,
      onPointerUp: (c) => {
        i(), d.onPointerUp(c);
      },
      onPointerCancel: (c) => {
        i(), d.onPointerCancel(c);
      },
      children: e
    }
  );
}
const Gs = [
  "default",
  "pressed",
  "at-min",
  "at-max",
  "typing",
  "disabled"
], Pa = {
  1: "month.1",
  2: "month.2",
  3: "month.3",
  4: "month.4",
  5: "month.5",
  6: "month.6",
  7: "month.7",
  8: "month.8",
  9: "month.9",
  10: "month.10",
  11: "month.11",
  12: "month.12"
};
function Y(e) {
  if (!e) return;
  const t = e.split("/");
  if (t.length !== 3) return;
  const a = Number.parseInt(t[0], 10), r = Number.parseInt(t[1], 10), s = Number.parseInt(t[2], 10);
  if (!(!Number.isFinite(a) || !Number.isFinite(r) || !Number.isFinite(s)) && !(r < 1 || r > 12 || a < 1 || a > Ze(s, r)))
    return { year: s, month: r, day: a };
}
function Ze(e, t) {
  return new Date(Date.UTC(e, t, 0)).getUTCDate();
}
function C(e) {
  return `${ae(e.day)}/${ae(e.month)}/${e.year}`;
}
function j(e) {
  return Math.floor(Date.UTC(e.year, e.month - 1, e.day) / 864e5);
}
function U(e) {
  const t = new Date(e * 864e5);
  return { year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() };
}
function E(e) {
  const t = Y(e);
  return t ? t.year * 1e4 + t.month * 100 + t.day : Number.NaN;
}
function ae(e) {
  return e < 10 ? `0${e}` : String(e);
}
function Sa(e) {
  return new Date(Date.UTC(e.year, e.month - 1, e.day)).getUTCDay();
}
function nt(e, t) {
  const a = (Sa(e) - t + 7) % 7;
  return U(j(e) - a);
}
function at(e) {
  return { year: e.year, month: e.month, day: 1 };
}
function Ha(e) {
  return { year: e.year, month: e.month, day: Ze(e.year, e.month) };
}
function fe(e, t) {
  const a = Y(e.start);
  if (!a) return e;
  if (e.size === "week")
    return { ...e, start: C(nt(a, t)) };
  if (e.size === "month")
    return { ...e, start: C(at(a)) };
  if (e.size === "custom") {
    const r = Y(e.end ?? e.start) ?? a, [s, i] = j(a) <= j(r) ? [a, r] : [r, a];
    return { size: "custom", start: C(s), end: C(i) };
  }
  return { ...e, start: C(a) };
}
function ce(e) {
  const t = Y(e.start);
  return t ? e.size === "day" ? t : e.size === "week" ? U(j(t) + 6) : e.size === "month" ? Ha(t) : Y(e.end ?? e.start) ?? t : oe();
}
function Fe(e, t, a) {
  const r = fe(e, t), s = Y(r.start);
  if (!s) return r;
  if (r.size === "month") {
    const i = s.month + a, o = i < 1 ? { year: s.year - 1, month: 12, day: 1 } : i > 12 ? { year: s.year + 1, month: 1, day: 1 } : { year: s.year, month: i, day: 1 };
    return { size: "month", start: C(o) };
  }
  if (r.size === "week")
    return { size: "week", start: C(U(j(s) + a * 7)) };
  if (r.size === "custom") {
    const i = j(ce(r)) - j(s) + 1, o = a * i;
    return {
      size: "custom",
      start: C(U(j(s) + o)),
      end: C(U(j(ce(r)) + o))
    };
  }
  return { size: "day", start: C(U(j(s) + a)) };
}
function Ba(e, t, a) {
  return e === "month" ? { size: "month", start: C(at(a)) } : e === "week" ? { size: "week", start: C(nt(a, t)) } : { size: "day", start: C(a) };
}
function Ma(e, t) {
  return E(e.start) === E(t.start) && e.size === t.size;
}
function oe() {
  const e = /* @__PURE__ */ new Date();
  return { year: e.getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
}
function me(e) {
  return p(Pa[e]);
}
function ue(e) {
  return `${e.day} ${me(e.month)}`;
}
function rt(e, t, a = oe()) {
  const r = fe(e, t), s = Y(r.start);
  if (!s) return { text: "", spoken: "" };
  const i = ce(r);
  return r.size === "month" ? {
    text: `${ae(s.month)}/${s.year}`,
    spoken: `${me(s.month)} ${s.year}`
  } : r.size === "week" ? {
    text: `${De(s)} – ${De(i)}`,
    spoken: `${ue(s)} ${p("period.spokenTo")} ${Le(i, s)}`
  } : r.size === "custom" ? {
    text: `${C(s)} – ${C(i)}`,
    spoken: `${ue(s)} ${p("period.spokenTo")} ${Le(i, s)}`
  } : {
    text: j(s) === j(a) ? p("dateWord.today") : C(s),
    spoken: `${s.day} ${me(s.month)} ${s.year}`
  };
}
function De(e) {
  return `${ae(e.day)}/${ae(e.month)}`;
}
function Le(e, t) {
  return e.year !== t.year ? `${ue(e)} ${e.year} ${t.year}` : e.month !== t.month ? `${ue(e)} ${e.year}` : `${e.day} ${me(e.month)} ${e.year}`;
}
function K({
  label: e,
  onPress: t,
  onLongPress: a,
  disabled: r = !1,
  density: s = "regular",
  className: i,
  id: o,
  style: d,
  ref: l,
  children: c,
  ...m
}) {
  const { isPressed: u, pressProps: b } = N({ onPress: t, onLongPress: a, disabled: r }), h = [
    "mds-icon-button",
    s === "large" ? "mds-icon-button--large" : "",
    u ? "mds-icon-button--pressed" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      ref: l,
      id: o,
      style: d,
      ...m,
      ...b,
      type: "button",
      className: h,
      "aria-label": e,
      disabled: r,
      children: c
    }
  );
}
const _s = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "large"
], Ne = [
  "day.0",
  "day.1",
  "day.2",
  "day.3",
  "day.4",
  "day.5",
  "day.6"
], st = {
  1: "month.1",
  2: "month.2",
  3: "month.3",
  4: "month.4",
  5: "month.5",
  6: "month.6",
  7: "month.7",
  8: "month.8",
  9: "month.9",
  10: "month.10",
  11: "month.11",
  12: "month.12"
};
function Za({
  month: e,
  value: t,
  items: a,
  min: r,
  max: s,
  weekStart: i = 0,
  mode: o = "single",
  onChange: d,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const h = oe(), g = te(() => {
    const A = e.split("/");
    if (A.length === 2) {
      const I = Number.parseInt(A[1], 10), M = Number.parseInt(A[0], 10);
      if (Number.isFinite(I) && Number.isFinite(M) && M >= 1 && M <= 12)
        return { year: I, month: M };
    }
    return { year: h.year, month: h.month };
  }, [e, h.year, h.month]), k = te(
    () => Ta(g.year, g.month, i),
    [g.year, g.month, i]
  ), x = o === "single" && typeof t == "string" ? t : void 0, v = o === "range" && t !== void 0 && typeof t != "string" ? t : void 0, y = k.flat().find((A) => A !== null)?.date, w = ["mds-month-grid", `mds-month-grid--${o}`, l].filter(Boolean).join(" "), P = p("month.srGrid", { month: p(st[g.month]), year: g.year }), B = (A) => {
    if (o === "single") {
      d?.(A.date);
      return;
    }
    if (o === "range") {
      if (v === void 0 || v.start === void 0 || v.end !== void 0) {
        d?.({ start: A.date });
        return;
      }
      if (E(A.date) <= E(v.start)) {
        d?.({ start: A.date });
        return;
      }
      d?.({ start: v.start, end: A.date });
    }
  };
  return /* @__PURE__ */ f(
    "div",
    {
      ref: u,
      id: c,
      style: m,
      className: w,
      role: "grid",
      "aria-label": P,
      "data-month": `${String(g.month).padStart(2, "0")}/${g.year}`,
      onKeyDown: o === "view" ? void 0 : (A) => Va(A),
      ...b,
      children: [
        /* @__PURE__ */ n("div", { className: "mds-month-days", role: "row", children: Ne.map((A, I) => /* @__PURE__ */ n("span", { className: "mds-month-day-name mds-type-micro", role: "columnheader", children: p(Ne[(I + i) % 7]) }, I)) }),
        k.map((A, I) => /* @__PURE__ */ n("div", { className: "mds-month-week", role: "row", children: A.map((M, T) => {
          if (!M)
            return /* @__PURE__ */ n("span", { className: "mds-month-cell mds-month-cell--empty", role: "gridcell" }, T);
          const F = M.date === y;
          return /* @__PURE__ */ n(
            Ca,
            {
              day: M,
              selected: x === M.date,
              rangeStart: v?.start === M.date,
              rangeEnd: v?.end === M.date,
              inRange: v?.start !== void 0 && v?.end !== void 0 && E(v.start) <= E(M.date) && E(M.date) <= E(v.end),
              count: a?.[M.date] ?? 0,
              disabled: r !== void 0 && E(M.date) < E(r) || s !== void 0 && E(M.date) > E(s),
              focusable: F,
              mode: o,
              isToday: j(M) === j(h),
              onPick: B
            },
            M.date
          );
        }) }, I))
      ]
    }
  );
}
function Ca({
  day: e,
  selected: t,
  rangeStart: a,
  rangeEnd: r,
  inRange: s,
  count: i,
  disabled: o,
  focusable: d,
  mode: l,
  isToday: c,
  onPick: m
}) {
  const u = l !== "view" && !o, { isPressed: b, pressProps: h } = N({
    onPress: () => m(e),
    disabled: !u
  }), g = ja(e, c, i), k = [
    "mds-month-cell-button",
    t || a || r ? "mds-month-cell-button--selected" : "",
    s ? "mds-month-cell-button--in-range" : "",
    a ? "mds-month-cell-button--range-start" : "",
    r ? "mds-month-cell-button--range-end" : "",
    c ? "mds-month-cell-button--today" : "",
    b ? "mds-month-cell-button--pressed" : ""
  ].filter(Boolean).join(" "), x = /* @__PURE__ */ f("span", { className: i >= 1 ? "mds-month-dots" : "mds-month-dots mds-month-dots--empty", "aria-hidden": "true", children: [
    i >= 1 ? /* @__PURE__ */ n("span", { className: "mds-month-dot" }) : null,
    i >= 2 ? /* @__PURE__ */ n("span", { className: "mds-month-dot" }) : null,
    i >= 3 ? /* @__PURE__ */ n("span", { className: "mds-month-dot" }) : null
  ] }), v = /* @__PURE__ */ n("span", { className: "mds-month-mark", children: /* @__PURE__ */ n("span", { className: "mds-month-mark-number mds-type-body", children: e.day }) });
  return /* @__PURE__ */ n("span", { className: "mds-month-cell", role: "gridcell", "aria-selected": t || a || r || s ? !0 : void 0, children: l === "view" ? /* @__PURE__ */ f("span", { className: "mds-month-cell-static", "data-day": e.date, children: [
    v,
    x
  ] }) : /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: k,
      "aria-label": g,
      disabled: o,
      tabIndex: d ? 0 : -1,
      "data-day": e.date,
      ...u ? h : {},
      children: [
        v,
        x
      ]
    }
  ) });
}
function Ta(e, t, a) {
  const r = Ze(e, t), s = (new Date(Date.UTC(e, t - 1, 1)).getUTCDay() - a + 7) % 7, i = [];
  for (let d = 0; d < s; d += 1) i.push(null);
  for (let d = 1; d <= r; d += 1)
    i.push({ year: e, month: t, day: d, date: C({ year: e, month: t, day: d }) });
  for (; i.length % 7 !== 0; ) i.push(null);
  const o = [];
  for (let d = 0; d < i.length; d += 7) o.push(i.slice(d, d + 7));
  return o;
}
function ja(e, t, a) {
  let r = p("month.srCell", {
    day: e.day,
    month: p(st[e.month]),
    weekday: p(Ne[$a(e)])
  });
  return t && (r = p("month.srCellToday", { name: r, today: p("dateWord.today") })), a > 0 && (r = p("month.srCellCount", { name: r, counted: _e(a, Ge.dayItems) })), r;
}
function $a(e) {
  return new Date(Date.UTC(e.year, e.month - 1, e.day)).getUTCDay();
}
function Va(e) {
  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) return;
  const t = document.activeElement;
  if (!t || !t.dataset.day) return;
  const a = Ia(t.dataset.day);
  if (!a) return;
  e.preventDefault();
  const r = e.key === "ArrowRight" ? -1 : e.key === "ArrowLeft" ? 1 : e.key === "ArrowUp" ? -7 : 7, s = C(U(j(a) + r)), i = e.currentTarget.querySelector(`button[data-day="${s}"]`);
  i && !i.disabled && i.focus();
}
function Ia(e) {
  const t = e.split("/");
  if (t.length !== 3) return;
  const a = Number.parseInt(t[0], 10), r = Number.parseInt(t[1], 10), s = Number.parseInt(t[2], 10);
  if (!(!Number.isFinite(a) || !Number.isFinite(r) || !Number.isFinite(s)))
    return { year: s, month: r, day: a };
}
const Qs = [
  "default",
  "month-data",
  "today-ring",
  "items-dots",
  "day-disabled",
  "range-start",
  "range-growing",
  "range-complete",
  "view-mode",
  "month-swap"
];
function re({
  variant: e = "primary",
  mode: t = "surface",
  size: a = "md",
  loading: r = !1,
  leading: s,
  trailing: i,
  onPress: o,
  onLongPress: d,
  disabled: l = !1,
  className: c,
  id: m,
  style: u,
  ref: b,
  children: h,
  ...g
}) {
  const { isPressed: k, pressProps: x } = N({
    onPress: o,
    onLongPress: d,
    disabled: l || r
  }), v = Ue(r), y = [
    "mds-button",
    `mds-button--${e}`,
    `mds-button--${a}`,
    t === "canvas" ? "mds-button--on-canvas" : "",
    k ? "mds-button--pressed" : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "button",
    {
      ref: b,
      id: m,
      style: u,
      ...g,
      ...x,
      type: "button",
      className: y,
      disabled: l,
      "aria-busy": r || void 0,
      children: [
        v ? /* @__PURE__ */ n("span", { className: "mds-button-spinner", "aria-hidden": "true" }) : s ? /* @__PURE__ */ n("span", { className: "mds-button-icon", children: s }) : null,
        /* @__PURE__ */ n("span", { className: "mds-button-label", children: h }),
        i ? /* @__PURE__ */ n("span", { className: "mds-button-icon", children: i }) : null
      ]
    }
  );
}
const Ws = [
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
function Ce({
  label: e,
  onPress: t,
  loading: a = !1,
  disabled: r = !1,
  caption: s,
  onRetry: i,
  leading: o = !0,
  trailing: d,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const h = Zt(), g = h.keyboardHeight > 0 ? {
    bottom: `calc(${h.keyboardHeight}px + env(safe-area-inset-bottom))`
  } : void 0, k = ["mds-action-bar", o ? "mds-action-bar--more" : "", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "div",
    {
      ref: u,
      id: c,
      style: { ...g, ...m },
      className: k,
      role: "group",
      "aria-label": e,
      ...b,
      children: [
        s ? /* @__PURE__ */ n(re, { variant: "text", onPress: i, className: "mds-action-bar-secondary", children: s }) : null,
        /* @__PURE__ */ n(
          re,
          {
            variant: "primary",
            onPress: t,
            loading: a,
            disabled: r,
            leading: d,
            className: "mds-action-bar-primary",
            children: e
          }
        )
      ]
    }
  );
}
const Us = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "loading",
  "contentMore",
  "scrolledToEnd",
  "keyboardOpen"
];
function it({
  leading: e,
  value: t,
  onChange: a,
  disabled: r = !1,
  label: s,
  className: i,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-segmented", i].filter(Boolean).join(" "),
      role: "group",
      "aria-label": s,
      ...c,
      children: e.map((m) => /* @__PURE__ */ n(
        Fa,
        {
          segment: m,
          selected: m.value === t,
          disabled: r || m.disabled === !0,
          onChange: a
        },
        m.value
      ))
    }
  );
}
function Fa({
  segment: e,
  selected: t,
  disabled: a,
  onChange: r
}) {
  const { isPressed: s, pressProps: i } = N({ onPress: () => r(e.value), disabled: a }), o = [
    "mds-segmented-segment",
    t ? "mds-segmented-segment--selected" : "",
    s ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: o,
      "aria-pressed": t === !0,
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...i,
      children: [
        e.leading ? /* @__PURE__ */ n("span", { className: "mds-segmented-segment-icon", "aria-hidden": "true", children: e.leading }) : null,
        /* @__PURE__ */ n("span", { className: "mds-segmented-segment-label", children: e.label })
      ]
    }
  );
}
const Ks = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "threeSegments",
  "fourSegments",
  "withIcon"
], xe = /* @__PURE__ */ new Set();
function X({
  label: e,
  variant: t = "detail",
  children: a,
  onDismiss: r,
  className: s,
  id: i,
  style: o,
  ref: d,
  ...l
}) {
  const c = Z(null), [m, u] = H(0), [b, h] = H(!1), [g, k] = H(!1), x = Z(0), v = Z(0), y = Z(0), w = Z(null), P = Z(r);
  R(() => {
    P.current = r;
  }, [r]);
  const B = O(() => {
    w.current?.focus?.(), P.current();
  }, []), [A] = H(() => /* @__PURE__ */ Symbol("sheet")), [I] = H(() => (xe.add(A), xe.size >= 2 ? 2 : 1));
  R(
    () => () => {
      xe.delete(A);
    },
    [A]
  );
  const M = () => {
    const S = c.current?.querySelector(".mds-sheet-panel");
    return S ? S.getBoundingClientRect().height * 0.3 : 0;
  }, T = O(() => {
    if (g) return;
    w.current = document.activeElement ?? null, k(!0), (typeof requestAnimationFrame == "function" ? requestAnimationFrame : ($) => setTimeout(() => $(performance.now()), 0))(() => {
      const $ = c.current?.querySelector(".mds-sheet-panel");
      if (!$) {
        B();
        return;
      }
      const z = getComputedStyle($).transitionDuration, je = z && z !== "0s" && z !== "";
      if ($.style.transform = "translateY(100%)", !je) {
        B();
        return;
      }
      const J = (pt) => {
        pt.propertyName === "transform" && ($.removeEventListener("transitionend", J), B());
      };
      $.addEventListener("transitionend", J);
    });
  }, [g, B]), F = (S) => {
    if (!b) return;
    const $ = performance.now(), z = $ - y.current;
    z > 0 && (x.current = (S.clientY - v.current) / z), v.current = S.clientY, y.current = $, u(Math.max(0, S.clientY - q.current));
  }, q = Z(0), de = (S) => {
    const $ = S.target, z = c.current?.querySelector(".mds-sheet-body");
    if (!(z?.contains($) && z && z.scrollTop > 0)) {
      if (g) {
        const J = c.current?.querySelector(".mds-sheet-panel");
        J && (J.style.transform = m ? `translateY(${m}px)` : ""), k(!1);
      }
      x.current = 0, v.current = S.clientY, y.current = performance.now(), h(!0), S.currentTarget.setPointerCapture?.(S.pointerId);
    }
  }, Te = () => {
    if (!b) return;
    h(!1);
    const S = m > M(), $ = x.current > 0.6;
    S || $ ? T() : u(0);
  };
  R(() => {
    const S = ($) => {
      $.key === "Escape" && T();
    };
    return window.addEventListener("keydown", S), () => window.removeEventListener("keydown", S);
  }, [T]);
  const ht = [
    "mds-sheet",
    t === "form" ? "mds-sheet--form" : "",
    I === 2 ? "mds-sheet--stacked" : "",
    b ? "mds-sheet--dragging" : "",
    g ? "mds-sheet--closing" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "div",
    {
      ref: (S) => {
        c.current = S, typeof d == "function" ? d(S) : d && (d.current = S);
      },
      id: i,
      style: o,
      className: ht,
      "data-ds-sheet-level": String(I),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": e,
      ...l,
      children: [
        /* @__PURE__ */ n(
          "div",
          {
            className: "mds-sheet-scrim",
            onClick: () => T(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ f(
          "div",
          {
            className: "mds-sheet-panel",
            style: m ? { transform: `translateY(${m}px)` } : void 0,
            children: [
              /* @__PURE__ */ f(
                "div",
                {
                  className: "mds-sheet-grab",
                  onPointerDown: (S) => {
                    q.current = S.clientY - m, de(S);
                  },
                  onPointerMove: F,
                  onPointerUp: Te,
                  onPointerCancel: Te,
                  children: [
                    /* @__PURE__ */ n("span", { className: "mds-sheet-handle", "aria-hidden": "true" }),
                    /* @__PURE__ */ n("header", { className: "mds-sheet-header", children: /* @__PURE__ */ n("h2", { className: "mds-sheet-title mds-type-title-section", children: e }) })
                  ]
                }
              ),
              /* @__PURE__ */ n("div", { className: "mds-sheet-close", children: /* @__PURE__ */ n(K, { label: e, onPress: T, children: /* @__PURE__ */ n(Xt, {}) }) }),
              /* @__PURE__ */ n("div", { className: "mds-sheet-body", children: a })
            ]
          }
        )
      ]
    }
  );
}
const Xs = [
  "default",
  "open",
  "dragging",
  "pastThreshold",
  "stacked"
], ot = ["day", "week", "month"];
function Da({
  value: e,
  items: t = ot,
  max: a,
  weekStart: r = 0,
  onChange: s,
  className: i,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const [m, u] = H(!1), b = fe(e, r), h = oe(), g = rt(b, r, h), k = Fe(b, r, 1), x = Y(a), v = x !== void 0 && j(ce(k)) > j(x), y = b.size === "day" || b.size === "week" || b.size === "month" ? Ba(b.size, r, h) : void 0, w = y !== void 0 && !Ma(b, y), P = ["mds-period-switcher", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("div", { ref: l, id: o, style: d, className: P, "data-size": b.size, ...c, children: [
    /* @__PURE__ */ n(
      K,
      {
        label: p(Ee(b.size, -1)),
        onPress: () => s?.(Fe(b, r, -1)),
        children: /* @__PURE__ */ n(Qt, {})
      }
    ),
    t.length === 1 ? /* @__PURE__ */ n(Ea, { text: g.text }) : /* @__PURE__ */ n(
      La,
      {
        name: p("period.srName", { spoken: g.spoken }),
        text: g.text,
        onOpen: () => u(!0)
      }
    ),
    /* @__PURE__ */ n(
      K,
      {
        label: p(Ee(b.size, 1)),
        onPress: () => s?.(k),
        disabled: v,
        children: /* @__PURE__ */ n(Ke, { size: 24 })
      }
    ),
    w && y ? /* @__PURE__ */ n(
      re,
      {
        variant: "secondary",
        mode: "canvas",
        size: "sm",
        className: "mds-period-jump",
        onPress: () => s?.(y),
        children: p(Ya(b.size))
      }
    ) : null,
    /* @__PURE__ */ n("span", { className: "mds-visually-hidden", "aria-live": "polite", children: g.spoken }),
    m && t.length > 1 ? /* @__PURE__ */ n(
      Oa,
      {
        value: b,
        items: t,
        weekStart: r,
        onResize: (B) => {
          s?.(B), u(!1);
        },
        onDismiss: () => u(!1)
      }
    ) : null
  ] });
}
function La({
  name: e,
  text: t,
  onOpen: a
}) {
  const { isPressed: r, pressProps: s } = N({ onPress: a }), i = [
    "mds-period-label",
    "mds-period-label--button",
    r ? "mds-period-label--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("button", { type: "button", className: i, "aria-label": e, ...s, children: [
    /* @__PURE__ */ n("span", { className: "mds-period-label-text mds-type-label-strong", children: t }, t),
    /* @__PURE__ */ n(Xe, { size: 16, className: "mds-period-label-icon" })
  ] });
}
function Ea({ text: e }) {
  return /* @__PURE__ */ n("span", { className: "mds-period-label", children: /* @__PURE__ */ n("span", { className: "mds-period-label-text mds-type-label-strong", children: e }, e) });
}
function Oa({
  value: e,
  items: t,
  weekStart: a,
  onResize: r,
  onDismiss: s
}) {
  const [i, o] = H(!1), d = ot.filter((l) => t.includes(l)).map((l) => ({
    value: l,
    label: p(za(l))
  }));
  return /* @__PURE__ */ f(X, { label: p("period.sheetTitle"), onDismiss: s, children: [
    d.length > 1 ? /* @__PURE__ */ n(
      it,
      {
        label: p("period.sizeGroup"),
        leading: d,
        value: e.size === "custom" ? "" : e.size,
        onChange: (l) => {
          r(fe({ size: l, start: e.start }, a));
        }
      }
    ) : null,
    t.includes("custom") ? /* @__PURE__ */ n(Ra, { armed: i, onArm: () => o(!0) }) : null,
    i ? /* @__PURE__ */ n(Ce, { label: p("period.apply"), disabled: !0, onPress: () => {
    }, leading: !0 }) : null
  ] });
}
function Ra({ armed: e, onArm: t }) {
  const { isPressed: a, pressProps: r } = N({ onPress: t }), s = [
    "mds-period-custom",
    e ? "mds-period-custom--armed" : "",
    a ? "mds-period-custom--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n("button", { type: "button", className: s, "aria-pressed": e, ...r, children: /* @__PURE__ */ n("span", { className: "mds-period-custom-text mds-type-body-strong", children: p("period.custom") }) });
}
function za(e) {
  return e === "day" ? "period.day" : e === "week" ? "period.week" : e === "month" ? "period.month" : "period.custom";
}
function Ee(e, t) {
  return e === "day" ? t === -1 ? "period.srDayPrev" : "period.srDayNext" : e === "week" ? t === -1 ? "period.srWeekPrev" : "period.srWeekNext" : e === "month" ? t === -1 ? "period.srMonthPrev" : "period.srMonthNext" : t === -1 ? "period.srCustomPrev" : "period.srCustomNext";
}
function Ya(e) {
  return e === "week" ? "period.thisWeek" : e === "month" ? "period.thisMonth" : "period.today";
}
const Js = [
  "default",
  "month-current",
  "stepped-back",
  "week-past",
  "day-today",
  "sheet-open",
  "custom-armed",
  "next-disabled",
  "month-only"
];
function dt({ label: e, value: t, min: a, max: r, onChange: s, onDismiss: i }) {
  const [o, d] = H(() => {
    const c = Y(t) ?? oe();
    return { size: "month", start: `01/${String(c.month).padStart(2, "0")}/${c.year}` };
  }), l = o.start.slice(3);
  return /* @__PURE__ */ f(X, { label: e, onDismiss: i, children: [
    /* @__PURE__ */ n(Da, { items: ["month"], value: o, onChange: d }),
    /* @__PURE__ */ n(
      Za,
      {
        className: "mds-date-sheet-grid",
        month: l,
        mode: "single",
        weekStart: 0,
        value: qa(t, l) ? t : void 0,
        min: a,
        max: r,
        onChange: (c) => typeof c == "string" && s?.(c)
      },
      l
    )
  ] });
}
function qa(e, t) {
  const a = Y(e);
  return a ? `${String(a.month).padStart(2, "0")}/${a.year}` === t : !1;
}
function ei({
  label: e,
  value: t,
  min: a,
  max: r,
  onChange: s,
  optional: i = !1,
  disabled: o = !1,
  state: d = "idle",
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const [h, g] = H(!1), k = [
    "mds-date-field",
    d === "error" ? "mds-date-field--error" : "",
    o ? "mds-date-field--disabled" : "",
    l
  ].filter(Boolean).join(" "), x = t !== void 0 ? rt({ size: "day", start: t }, 0).spoken : void 0, v = x !== void 0 ? p("datePicker.srName", { label: e, date: x }) : e;
  return /* @__PURE__ */ f("span", { ref: u, id: c, style: m, className: k, ...b, children: [
    /* @__PURE__ */ n("span", { className: "mds-date-field-label mds-type-label", children: e }),
    /* @__PURE__ */ n(
      Ga,
      {
        name: v,
        text: t,
        disabled: o,
        error: d === "error",
        onOpen: () => g(!0),
        hasValue: t !== void 0,
        optional: i,
        onClearValue: () => s?.(void 0)
      }
    ),
    d === "error" ? /* @__PURE__ */ n("span", { className: "mds-date-field-error mds-type-caption", children: p("dateQuick.choose") }) : null,
    h ? /* @__PURE__ */ n(
      dt,
      {
        label: e,
        value: t,
        min: a,
        max: r,
        onChange: (y) => {
          s?.(y), g(!1);
        },
        onDismiss: () => g(!1)
      }
    ) : null
  ] });
}
function Ga({
  name: e,
  text: t,
  disabled: a,
  error: r,
  onOpen: s,
  hasValue: i,
  optional: o,
  onClearValue: d
}) {
  const { isPressed: l, pressProps: c } = N({ onPress: s, disabled: a }), m = [
    "mds-text-field-input",
    "mds-picker-field-box",
    l ? "mds-picker-field-box--pressed" : "",
    r ? "mds-date-field-box--error" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("span", { className: "mds-picker-field-row", children: [
    /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: m,
        "aria-label": e,
        disabled: a,
        ...c,
        children: [
          t ? /* @__PURE__ */ n("span", { className: "mds-date-field-text", children: t }) : /* @__PURE__ */ n("span", { className: "mds-date-field-text mds-date-field-text--empty" }),
          /* @__PURE__ */ n(tt, { size: 20, className: "mds-date-field-icon" })
        ]
      }
    ),
    o && i ? /* @__PURE__ */ n(K, { label: p("sr.clear"), disabled: a, onPress: d, children: /* @__PURE__ */ n(ie, { size: 20 }) }) : null
  ] });
}
const ti = [
  "default",
  "empty",
  "chosen",
  "optional-clear",
  "sheet-open",
  "month-stepped",
  "day-disabled",
  "error",
  "disabled"
];
function ye(e) {
  if (!e) return Number.NaN;
  const t = e.split("/");
  if (t.length !== 3) return Number.NaN;
  const a = Number.parseInt(t[0], 10), r = Number.parseInt(t[1], 10), s = Number.parseInt(t[2], 10);
  return !Number.isFinite(a) || !Number.isFinite(r) || !Number.isFinite(s) ? Number.NaN : s * 1e4 + r * 100 + a;
}
function ni({
  label: e,
  value: t,
  items: a,
  min: r,
  max: s,
  onChange: i,
  disabled: o = !1,
  state: d = "idle",
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const [h, g] = H(!1), k = a.some((w) => w.value === t), x = t !== void 0 && !k ? t : void 0, v = (w) => {
    const P = ye(w), B = ye(r), A = ye(s);
    return !!(Number.isFinite(P) && Number.isFinite(B) && P < B || Number.isFinite(P) && Number.isFinite(A) && P > A);
  }, y = [
    "mds-date-quick",
    d === "error" ? "mds-date-quick--error" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "div",
    {
      ref: u,
      id: c,
      style: m,
      className: y,
      role: "radiogroup",
      "aria-label": e,
      "data-value": t ?? "",
      ...b,
      children: [
        /* @__PURE__ */ f("div", { className: "mds-date-quick-row", children: [
          a.map((w) => /* @__PURE__ */ n(
            _a,
            {
              item: w,
              selected: w.value === t,
              disabled: o || v(w.value),
              onChange: i
            },
            w.value
          )),
          /* @__PURE__ */ n(
            Qa,
            {
              customDate: x,
              disabled: o,
              onChange: i,
              onOpenSheet: () => g(!0)
            }
          )
        ] }),
        d === "error" ? /* @__PURE__ */ n("span", { className: "mds-date-quick-error mds-type-caption", children: p("dateQuick.choose") }) : null,
        h ? /* @__PURE__ */ n(
          dt,
          {
            label: p("dateQuick.other"),
            value: x,
            min: r,
            max: s,
            onChange: (w) => {
              i?.(w), g(!1);
            },
            onDismiss: () => g(!1)
          }
        ) : null
      ]
    }
  );
}
function _a({
  item: e,
  selected: t,
  disabled: a,
  onChange: r
}) {
  const { isPressed: s, pressProps: i } = N({ onPress: () => r?.(e.value), disabled: a }), o = [
    "mds-filter-chip",
    "mds-date-quick-chip",
    t ? "mds-filter-chip--selected" : "",
    s ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: o,
      "aria-checked": t,
      "aria-label": p("dateQuick.chipName", { label: e.label, value: e.value }),
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...i,
      children: /* @__PURE__ */ n("span", { className: "mds-filter-chip-label", children: e.label })
    }
  );
}
function Qa({
  customDate: e,
  disabled: t,
  onChange: a,
  onOpenSheet: r
}) {
  const s = e !== void 0, { isPressed: i, pressProps: o } = N({
    onPress: () => s ? a?.(e) : r(),
    disabled: t
  }), d = [
    "mds-filter-chip",
    "mds-date-quick-chip",
    "mds-date-quick-chip--other",
    s ? "mds-filter-chip--selected" : "",
    i ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: d,
      "aria-checked": s,
      "aria-label": s ? e : p("dateQuick.other"),
      disabled: t,
      "data-ds-exempt": t ? void 0 : "",
      ...o,
      children: s ? /* @__PURE__ */ n("span", { className: "mds-filter-chip-label mds-date-quick-chip-date", children: e }) : /* @__PURE__ */ f(G, { children: [
        /* @__PURE__ */ n(tt, { size: 16, className: "mds-date-quick-chip-icon" }),
        /* @__PURE__ */ n("span", { className: "mds-filter-chip-label", children: p("dateQuick.other") })
      ] })
    }
  );
}
const ai = [
  "default",
  "selected",
  "custom-date",
  "pressed",
  "disabled",
  "error"
];
function Wa(e) {
  return e < 10 ? `0${e}` : String(e);
}
function lt(e) {
  const t = Math.max(0, Math.min(1439, Math.round(e))), a = Math.floor(t / 60), r = t % 60, s = a < 12, o = `${a % 12 === 0 ? 12 : a % 12}:${Wa(r)}`;
  return {
    text: `${o} ${p(s ? "time.am" : "time.pm")}`,
    spoken: `${o} ${p(s ? "time.amSpoken" : "time.pmSpoken")}`
  };
}
const Oe = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
function ri({
  label: e,
  value: t,
  step: a = 15,
  min: r,
  max: s,
  onChange: i,
  disabled: o = !1,
  state: d = "idle",
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const [h, g] = H(!1), k = t !== void 0 ? lt(t) : void 0, x = [
    "mds-time-field",
    d === "error" ? "mds-time-field--error" : "",
    o ? "mds-time-field--disabled" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("span", { ref: u, id: c, style: m, className: x, ...b, children: [
    /* @__PURE__ */ n("span", { className: "mds-time-field-label mds-type-label", children: e }),
    /* @__PURE__ */ n(
      Ua,
      {
        label: e,
        formatted: k,
        disabled: o,
        error: d === "error",
        onOpen: () => g(!0),
        hasValue: t !== void 0,
        onClearValue: () => i?.(void 0)
      }
    ),
    d === "error" ? /* @__PURE__ */ n("span", { className: "mds-time-field-error mds-type-caption", children: p("timePicker.choose") }) : null,
    h ? /* @__PURE__ */ n(
      Ka,
      {
        label: e,
        value: t,
        step: a,
        min: r,
        max: s,
        onApply: (v) => {
          i?.(v), g(!1);
        },
        onDismiss: () => g(!1)
      }
    ) : null
  ] });
}
function Ua({
  label: e,
  formatted: t,
  disabled: a,
  error: r,
  onOpen: s,
  hasValue: i,
  onClearValue: o
}) {
  const { isPressed: d, pressProps: l } = N({ onPress: s, disabled: a }), c = t ? p("timePicker.srName", { label: e, time: t.spoken }) : e, m = [
    "mds-text-field-input",
    "mds-picker-field-box",
    d ? "mds-picker-field-box--pressed" : "",
    r ? "mds-time-field-box--error" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("span", { className: "mds-picker-field-row", children: [
    /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: m,
        "aria-label": c,
        disabled: a,
        "data-ds-exempt": "",
        ...l,
        children: [
          t ? /* @__PURE__ */ n("span", { className: "mds-time-field-text", children: t.text }) : /* @__PURE__ */ n("span", { className: "mds-time-field-text mds-time-field-text--empty" }),
          /* @__PURE__ */ n(Wn, { size: 20, className: "mds-time-field-icon" })
        ]
      }
    ),
    i ? /* @__PURE__ */ n(K, { label: p("sr.clear"), disabled: a, onPress: o, children: /* @__PURE__ */ n(ie, { size: 20 }) }) : null
  ] });
}
function Ka({
  label: e,
  value: t,
  step: a,
  min: r,
  max: s,
  onApply: i,
  onDismiss: o
}) {
  const [d, l] = H(t), [c, m] = H(t !== void 0 && t >= 720 ? "pm" : "am"), u = d !== void 0 ? lt(d) : void 0, b = c === "am", h = Xa(a), g = (y) => (r === void 0 || y >= r) && (s === void 0 || y <= s), k = (y) => h.some((w) => g(ve(y, w, b))), x = (y) => Oe.some((w) => g(ve(w, y, b))), v = () => {
    d !== void 0 && i(d);
  };
  return /* @__PURE__ */ f(X, { variant: "form", label: e, onDismiss: o, children: [
    /* @__PURE__ */ n("div", { className: "mds-picker-sheet-head", children: /* @__PURE__ */ n("span", { className: "mds-time-sheet-value mds-type-number-lg", children: u ? u.text : p("money.missing") }) }),
    /* @__PURE__ */ n(
      it,
      {
        label: p("time.periodGroup"),
        leading: [
          { value: "am", label: p("time.am") },
          { value: "pm", label: p("time.pm") }
        ],
        value: c,
        onChange: (y) => {
          if (m(y === "pm" ? "pm" : "am"), d === void 0) return;
          const w = Math.floor(d / 60), P = w % 12 === 0 ? 12 : w % 12, B = y === "pm" ? 12 : 0, A = P % 12 + B;
          l(A * 60 + d % 60);
        }
      }
    ),
    /* @__PURE__ */ n(
      Re,
      {
        title: p("time.hour"),
        options: Oe.map((y) => ({
          value: String(y),
          label: String(y),
          disabled: !k(y)
        })),
        selected: d === void 0 ? void 0 : String(Math.floor(d / 60) % 12 === 0 ? 12 : Math.floor(d / 60) % 12),
        onChange: (y) => {
          const w = Number.parseInt(y, 10), P = d === void 0 ? 0 : d % 60;
          l(ve(w, P, b));
        }
      }
    ),
    /* @__PURE__ */ n(
      Re,
      {
        title: p("time.minutes"),
        options: h.map((y) => ({
          value: String(y),
          label: y < 10 ? `0${y}` : String(y),
          disabled: !x(y)
        })),
        selected: d === void 0 ? void 0 : String(d % 60),
        onChange: (y) => {
          const w = Number.parseInt(y, 10), P = d === void 0 ? 12 : Math.floor(d / 60);
          l(P * 60 + w);
        }
      }
    ),
    /* @__PURE__ */ n(Ce, { label: p("timePicker.apply"), onPress: v, disabled: d === void 0, leading: !0 })
  ] });
}
function ve(e, t, a) {
  return (e % 12 + (a ? 0 : 12)) * 60 + t;
}
function Xa(e) {
  const t = e > 0 && 60 % e === 0 ? e : 15;
  return Array.from({ length: 60 / t }, (a, r) => r * t);
}
function Re({
  title: e,
  options: t,
  selected: a,
  onChange: r
}) {
  return /* @__PURE__ */ f("div", { className: "mds-time-slot", children: [
    /* @__PURE__ */ n("span", { className: "mds-time-slot-title mds-type-label-strong", children: e }),
    /* @__PURE__ */ n("div", { className: "mds-time-slot-grid", role: "radiogroup", "aria-label": e, children: t.map((s) => /* @__PURE__ */ n(
      Ja,
      {
        option: s,
        selected: s.value === a,
        onChange: r
      },
      s.value
    )) })
  ] });
}
function Ja({
  option: e,
  selected: t,
  onChange: a
}) {
  const { isPressed: r, pressProps: s } = N({ onPress: () => a(e.value), disabled: e.disabled }), i = [
    "mds-filter-chip",
    "mds-time-slot-chip",
    t ? "mds-filter-chip--selected" : "",
    r ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: i,
      "aria-checked": t,
      "aria-label": e.label,
      disabled: e.disabled,
      "data-ds-exempt": e.disabled ? void 0 : "",
      ...s,
      children: /* @__PURE__ */ n("span", { className: "mds-filter-chip-label mds-time-slot-chip-label", children: e.label })
    }
  );
}
const si = [
  "default",
  "empty",
  "chosen",
  "pressed",
  "sheet-open",
  "disabled",
  "error"
];
function er(e) {
  return e === 1 ? p("duration.hourOne") : e === 2 ? p("duration.hourTwo") : `${e} ${e >= 3 && e <= 10 ? p("duration.hourFew") : p("duration.hourMany")}`;
}
function tr(e) {
  return e === 1 ? p("duration.minuteOne") : e === 2 ? p("duration.minuteTwo") : `${e} ${e >= 3 && e <= 10 ? p("duration.minuteFew") : p("duration.minuteMany")}`;
}
function Ae(e) {
  const t = Math.max(0, Math.min(1440, Math.round(e))), a = Math.floor(t / 60), r = t % 60, s = [];
  return a > 0 && s.push(er(a)), r === 30 && a > 0 ? s.push(p("duration.half")) : r > 0 && s.push(`${a > 0 ? p("duration.and") : ""}${tr(r)}`), s.join(" ");
}
const nr = [15, 30, 45, 60, 90, 120, 180, 240];
function ii({
  label: e,
  value: t,
  min: a = 15,
  max: r = 720,
  step: s = 15,
  onChange: i,
  disabled: o = !1,
  className: d,
  id: l,
  style: c,
  ref: m,
  ...u
}) {
  const [b, h] = H(!1), g = [
    "mds-duration-field",
    o ? "mds-duration-field--disabled" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("span", { ref: m, id: l, style: c, className: g, ...u, children: [
    /* @__PURE__ */ n("span", { className: "mds-duration-field-label mds-type-label", children: e }),
    /* @__PURE__ */ n(
      ar,
      {
        label: e,
        text: t !== void 0 ? Ae(t) : void 0,
        disabled: o,
        onOpen: () => h(!0),
        hasValue: t !== void 0,
        onClearValue: () => i?.(void 0)
      }
    ),
    b ? /* @__PURE__ */ n(
      rr,
      {
        label: e,
        value: t,
        min: a,
        max: r,
        step: s,
        onApply: (k) => {
          i?.(k), h(!1);
        },
        onDismiss: () => h(!1)
      }
    ) : null
  ] });
}
function ar({
  label: e,
  text: t,
  disabled: a,
  onOpen: r,
  hasValue: s,
  onClearValue: i
}) {
  const { isPressed: o, pressProps: d } = N({ onPress: r, disabled: a }), l = t ? p("durationPicker.srName", { label: e, duration: t }) : e, c = [
    "mds-text-field-input",
    "mds-picker-field-box",
    o ? "mds-picker-field-box--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("span", { className: "mds-picker-field-row", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: c,
        "aria-label": l,
        disabled: a,
        "data-ds-exempt": "",
        ...d,
        children: /* @__PURE__ */ n("span", { className: "mds-duration-field-text", children: t ?? "" })
      }
    ),
    s ? /* @__PURE__ */ n(K, { label: p("sr.clear"), disabled: a, onPress: i, children: /* @__PURE__ */ n(ie, { size: 20 }) }) : null
  ] });
}
function rr({
  label: e,
  value: t,
  min: a,
  max: r,
  step: s,
  onApply: i,
  onDismiss: o
}) {
  const [d, l] = H(t), c = d !== void 0 ? Ae(d) : void 0;
  return /* @__PURE__ */ f(X, { label: e, onDismiss: o, children: [
    /* @__PURE__ */ n("div", { className: "mds-picker-sheet-head", children: /* @__PURE__ */ n("span", { className: "mds-duration-sheet-value mds-type-number-lg", children: c ?? p("money.missing") }) }),
    /* @__PURE__ */ n("div", { className: "mds-duration-common", role: "radiogroup", "aria-label": p("duration.common"), children: nr.map((m) => /* @__PURE__ */ n(
      sr,
      {
        label: Ae(m),
        selected: d === m,
        onChange: () => l(m)
      },
      m
    )) }),
    /* @__PURE__ */ f("div", { className: "mds-duration-other", children: [
      /* @__PURE__ */ n("span", { className: "mds-duration-other-title mds-type-label-strong", children: p("duration.other") }),
      /* @__PURE__ */ n(
        Aa,
        {
          label: p("duration.other"),
          value: d,
          min: a,
          max: r,
          step: s,
          onChange: (m) => l(Math.min(Math.max(m, a), r))
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-visually-hidden", "aria-live": "polite", children: c ?? "" }),
      /* @__PURE__ */ n("span", { className: "mds-duration-other-text mds-type-body", children: c ?? "" })
    ] }),
    /* @__PURE__ */ n(
      Ce,
      {
        label: p("durationPicker.apply"),
        onPress: () => d !== void 0 && i(d),
        disabled: d === void 0,
        leading: !0
      }
    )
  ] });
}
function sr({
  label: e,
  selected: t,
  onChange: a
}) {
  const { isPressed: r, pressProps: s } = N({ onPress: a }), i = [
    "mds-filter-chip",
    "mds-duration-common-chip",
    t ? "mds-filter-chip--selected" : "",
    r ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: i,
      "aria-checked": t,
      "aria-label": e,
      "data-ds-exempt": "",
      ...s,
      children: /* @__PURE__ */ n("span", { className: "mds-filter-chip-label mds-duration-common-chip-label", children: e })
    }
  );
}
const oi = [
  "default",
  "empty",
  "chosen",
  "pressed",
  "sheet-open",
  "stepper-typing",
  "disabled"
];
function ir({
  label: e,
  trailing: t,
  className: a,
  id: r,
  style: s,
  ref: i,
  ...o
}) {
  return /* @__PURE__ */ f(
    "div",
    {
      ref: i,
      id: r,
      style: s,
      className: ["mds-empty-state", a].filter(Boolean).join(" "),
      ...o,
      children: [
        /* @__PURE__ */ n("p", { className: "mds-empty-state-sentence", children: e }),
        t ? /* @__PURE__ */ n("div", { className: "mds-empty-state-action", children: t }) : null
      ]
    }
  );
}
const di = ["default", "withAction"], or = {
  done: Pn,
  waiting: Hn
};
function dr(e) {
  let t = e.trim().split(/\s+/)[0];
  const a = String.fromCodePoint(1575, 1604);
  return t.length > a.length && t.startsWith(a) && (t = t.slice(a.length)), t ? Array.from(t)[0] : void 0;
}
function be({
  size: e = "md",
  variant: t = "surface",
  value: a,
  tone: r,
  children: s,
  className: i,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = r === "done" || r === "waiting" ? or[r] : null, u = s ? void 0 : a ? dr(a) : void 0, b = [
    "mds-entity-mark",
    `mds-entity-mark--${e}`,
    t === "canvas" ? "mds-entity-mark--canvas" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("span", { ref: l, id: o, style: d, className: b, "aria-hidden": "true", ...c, children: [
    s ?? (u ? /* @__PURE__ */ n("span", { className: "mds-entity-mark-initial", children: u }) : null),
    m ? /* @__PURE__ */ n("span", { className: "mds-entity-mark-badge", children: /* @__PURE__ */ n(m, { size: 14 }) }) : null
  ] });
}
const li = [
  "initial",
  "sizes",
  "fundTypes",
  "approved",
  "pending",
  "withImageRule"
];
function ze(e) {
  return e != null && typeof e != "string";
}
function ct({
  leading: e,
  tone: t,
  label: a,
  caption: r,
  value: s,
  trailing: i,
  onPress: o,
  landed: d = !1,
  disabled: l = !1,
  className: c,
  id: m,
  style: u,
  ref: b,
  ...h
}) {
  const { isPressed: g, pressProps: k } = N({ onPress: () => o?.(), disabled: l }), x = o !== void 0, v = [
    "mds-object-row",
    ze(e) ? "mds-object-row--icon" : "",
    g ? "mds-object-row--pressed" : "",
    d ? "mds-object-row--landed" : "",
    l ? "mds-object-row--disabled" : "",
    x ? "" : "mds-object-row--passive",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    x ? "button" : "div",
    {
      ref: b,
      id: m,
      style: u,
      type: x ? "button" : void 0,
      className: v,
      disabled: x ? l : void 0,
      ...x ? k : {},
      ...h,
      children: [
        ze(e) ? (
          /* ت4 (1.7): a NON-entity row (an action, a setting) starts with its
             icon 20 in text-secondary — no 44 mark box, a row-plain height. */
          /* @__PURE__ */ n("span", { className: "mds-object-row-icon", "aria-hidden": "true", children: e })
        ) : /* @__PURE__ */ n(be, { size: "md", tone: t, value: typeof e == "string" ? e : a }),
        /* @__PURE__ */ f("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-object-row-title mds-type-body-strong", children: a }),
          r ? /* @__PURE__ */ n("span", { className: "mds-object-row-caption mds-type-caption", children: r }) : null
        ] }),
        s !== void 0 || i ? /* @__PURE__ */ f("span", { className: "mds-object-row-end", children: [
          s !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-object-row-value mds-type-amount-row", children: typeof s == "string" ? /* @__PURE__ */ n("bdi", { dir: "ltr", children: s }) : (
            /* A Money node renders itself (its own LTR isolation, sign,
               unit and hidden-amounts behaviour) — never re-wrapped. */
            s
          ) }) : null,
          i ? /* @__PURE__ */ n("span", { className: "mds-object-row-time mds-type-caption", children: i }) : null
        ] }) : null
      ]
    }
  );
}
const ci = [
  "default",
  "oneLine",
  "withBadge",
  "pressed",
  "landed",
  "focused",
  "disabled"
];
function we({
  variant: e,
  className: t,
  id: a,
  style: r,
  ref: s,
  ...i
}) {
  return /* @__PURE__ */ n(
    "span",
    {
      ref: s,
      id: a,
      style: r,
      "aria-hidden": "true",
      className: ["mds-skeleton", `mds-skeleton--${e}`, t].filter(Boolean).join(" "),
      ...i
    }
  );
}
const mi = ["body", "caption", "hero", "mark"], lr = [0, 1, 2];
function ui({
  label: e,
  value: t,
  items: a = [],
  mode: r = "client",
  loading: s = !1,
  onChange: i,
  disabled: o = !1,
  state: d = "idle",
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const [h, g] = H(!1), k = [
    "mds-party-field",
    d === "error" ? "mds-party-field--error" : "",
    o ? "mds-party-field--disabled" : "",
    l
  ].filter(Boolean).join(" "), x = t !== void 0 ? p("party.srName", { label: e, name: t.label }) : p("party.srNone", { label: e });
  return /* @__PURE__ */ f("span", { ref: u, id: c, style: m, className: k, ...b, children: [
    /* @__PURE__ */ n("span", { className: "mds-party-field-label mds-type-label", children: e }),
    /* @__PURE__ */ n(
      cr,
      {
        name: x,
        party: t,
        disabled: o,
        error: d === "error",
        onOpen: () => g(!0),
        hasValue: t !== void 0,
        onClearValue: () => i?.(void 0)
      }
    ),
    d === "error" ? /* @__PURE__ */ n("span", { className: "mds-party-field-error mds-type-caption", children: p("party.choose") }) : null,
    h ? /* @__PURE__ */ n(
      mr,
      {
        label: e,
        value: t,
        items: a,
        mode: r,
        loading: s,
        onPick: (v) => {
          i?.(v), g(!1);
        },
        onDismiss: () => g(!1)
      }
    ) : null
  ] });
}
function cr({
  name: e,
  party: t,
  disabled: a,
  error: r,
  onOpen: s,
  hasValue: i,
  onClearValue: o
}) {
  const { isPressed: d, pressProps: l } = N({ onPress: s, disabled: a }), c = [
    "mds-text-field-input",
    "mds-picker-field-box",
    "mds-party-field-box",
    d ? "mds-picker-field-box--pressed" : "",
    r ? "mds-party-field-box--error" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("span", { className: "mds-picker-field-row", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: c,
        "aria-label": e,
        disabled: a,
        ...l,
        children: t ? /* @__PURE__ */ f(G, { children: [
          /* @__PURE__ */ n(be, { size: "sm", value: t.label }),
          /* @__PURE__ */ n("span", { className: "mds-party-field-name mds-type-body", children: t.label })
        ] }) : /* @__PURE__ */ n("span", { className: "mds-party-field-name mds-party-field-name--empty" })
      }
    ),
    i ? /* @__PURE__ */ n(K, { label: p("sr.clear"), disabled: a, onPress: o, children: /* @__PURE__ */ n(ie, { size: 20 }) }) : null
  ] });
}
function mr({
  label: e,
  value: t,
  items: a,
  mode: r,
  loading: s,
  onPick: i,
  onDismiss: o
}) {
  const [d, l] = H(""), c = Z(null);
  R(() => {
    c.current?.querySelector("input")?.focus();
  }, []);
  const m = d.trim().toLowerCase(), u = m ? a.filter((k) => k.label.toLowerCase().includes(m)) : a, b = m && a.some((k) => k.label.trim().toLowerCase() === m), h = d.trim(), g = h !== "" && !b;
  return /* @__PURE__ */ n(X, { label: e, onDismiss: o, children: /* @__PURE__ */ f("div", { ref: c, className: "mds-party-sheet", children: [
    /* @__PURE__ */ n(
      ba,
      {
        label: e,
        placeholder: p("search.in", { area: e }),
        value: d,
        onChange: l
      }
    ),
    s ? /* @__PURE__ */ n("div", { className: "mds-party-skeletons", "aria-hidden": "true", children: lr.map((k) => /* @__PURE__ */ f("div", { className: "mds-party-skeleton-row", children: [
      /* @__PURE__ */ n(we, { variant: "mark" }),
      /* @__PURE__ */ f("div", { className: "mds-party-skeleton-lines", children: [
        /* @__PURE__ */ n(we, { variant: "body" }),
        /* @__PURE__ */ n(we, { variant: "caption" })
      ] })
    ] }, k)) }) : u.length === 0 && !g ? a.length === 0 ? /* @__PURE__ */ n(ir, { label: p("party.empty") }) : null : /* @__PURE__ */ f("div", { className: "mds-party-rows", role: "listbox", "aria-label": e, children: [
      g ? /* @__PURE__ */ n(
        hr,
        {
          name: h,
          role: r,
          onPick: () => i({ value: h, label: h })
        }
      ) : null,
      u.map((k) => /* @__PURE__ */ n(
        ur,
        {
          party: k,
          selected: t?.value === k.value,
          onPick: () => i(k)
        },
        k.value
      ))
    ] })
  ] }) });
}
function ur({
  party: e,
  selected: t,
  onPick: a
}) {
  const { isPressed: r, pressProps: s } = N({ onPress: a }), i = [
    "mds-party-row",
    r ? "mds-party-row--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n("div", { className: i, role: "option", "aria-selected": t, children: /* @__PURE__ */ n(
    ct,
    {
      label: e.label,
      caption: e.caption,
      leading: e.label,
      value: e.debt !== void 0 ? /* @__PURE__ */ n(Me, { value: e.debt, debt: "forYou" }) : void 0,
      trailing: t ? /* @__PURE__ */ n(se, { size: 20, className: "mds-party-row-selected" }) : void 0,
      onPress: a,
      ...s
    }
  ) });
}
function hr({
  name: e,
  role: t,
  onPick: a
}) {
  const { isPressed: r, pressProps: s } = N({ onPress: a }), i = [
    "mds-party-add",
    r ? "mds-party-add--pressed" : ""
  ].filter(Boolean).join(" "), o = t === "supplier" ? "party.roleSupplier" : t === "party" ? "party.roleParty" : "party.roleClient", d = p("party.add", { name: e, role: p(o) }), l = p("party.srAdd", { name: e, role: p(o) });
  return /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: i,
      "aria-label": l,
      ...s,
      children: [
        /* @__PURE__ */ n("span", { className: "mds-party-add-mark", "aria-hidden": "true", children: /* @__PURE__ */ n(et, { size: 20 }) }),
        /* @__PURE__ */ n("span", { className: "mds-party-add-text mds-type-body-strong", children: d })
      ]
    }
  );
}
const hi = [
  "default",
  "empty",
  "chosen",
  "sheet-open",
  "search-filtering",
  "add-row",
  "row-selected",
  "list-empty",
  "loading",
  "error",
  "disabled"
];
function pi({
  label: e,
  items: t,
  value: a,
  direction: r = "out",
  onChange: s,
  disabled: i = !1,
  state: o = "idle",
  className: d,
  id: l,
  style: c,
  ref: m,
  ...u
}) {
  const [b, h] = H(!1), g = [
    "mds-fund-picker",
    o === "error" ? "mds-fund-picker--error" : "",
    i ? "mds-fund-picker--disabled" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("div", { ref: m, id: l, style: c, className: g, "data-count": t.length, ...u, children: [
    t.length === 1 ? /* @__PURE__ */ n(pr, { fund: t[0], direction: r, disabled: i, onOpen: () => h(!0) }) : t.length <= 4 ? /* @__PURE__ */ n(
      fr,
      {
        label: e,
        items: t,
        value: a,
        disabled: i,
        onChange: s
      }
    ) : /* @__PURE__ */ n(G, { children: /* @__PURE__ */ n(
      gr,
      {
        label: e,
        fund: t.find((k) => k.value === a),
        disabled: i,
        onOpen: () => h(!0)
      }
    ) }),
    o === "error" && t.length > 1 && a === void 0 ? /* @__PURE__ */ n("span", { className: "mds-fund-picker-error mds-type-caption", children: p("fund.choose") }) : null,
    b ? /* @__PURE__ */ n(
      kr,
      {
        label: e,
        items: t,
        value: a,
        onPick: (k) => {
          s?.(k), h(!1);
        },
        onDismiss: () => h(!1)
      }
    ) : null
  ] });
}
function pr({
  fund: e,
  direction: t,
  disabled: a,
  onOpen: r
}) {
  const { isPressed: s, pressProps: i } = N({ onPress: r, disabled: a }), o = [
    "mds-fund-single",
    s ? "mds-fund-single--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("button", { type: "button", className: o, disabled: a, ...i, children: [
    /* @__PURE__ */ n("span", { className: "mds-fund-single-icon", "aria-hidden": "true", children: e.leading }),
    /* @__PURE__ */ n("span", { className: "mds-fund-single-prefix mds-type-label", children: p(t === "in" ? "fund.to" : "fund.from") }),
    /* @__PURE__ */ n("span", { className: "mds-fund-single-name mds-type-body-strong", children: e.label })
  ] });
}
function fr({
  label: e,
  items: t,
  value: a,
  disabled: r,
  onChange: s
}) {
  const { hidden: i } = Q();
  return /* @__PURE__ */ f("div", { className: "mds-fund-chips-form", children: [
    /* @__PURE__ */ n("span", { className: "mds-fund-chips-label mds-type-label", children: e }),
    /* @__PURE__ */ n("div", { className: "mds-fund-chips", role: "radiogroup", "aria-label": e, children: t.map((o) => /* @__PURE__ */ n(
      br,
      {
        fund: o,
        selected: o.value === a,
        hidden: i,
        disabled: r,
        onChange: () => s?.(o.value)
      },
      o.value
    )) })
  ] });
}
function br({
  fund: e,
  selected: t,
  hidden: a,
  disabled: r,
  onChange: s
}) {
  const { isPressed: i, pressProps: o } = N({ onPress: s, disabled: r || e.disabled }), d = [
    "mds-filter-chip",
    "mds-fund-chip",
    t ? "mds-filter-chip--selected" : "",
    i ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  let l = e.label;
  if (e.balance !== void 0) {
    const c = le(e.balance, { hidden: a, texts: V() });
    l = p("fund.srChip", { name: l, balance: c.aria });
  }
  return e.disabled && (l = p("fund.srChipDisabled", { name: l })), /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      role: "radio",
      className: d,
      "aria-checked": t,
      "aria-label": l,
      disabled: r || e.disabled,
      ...o,
      children: [
        /* @__PURE__ */ n("span", { className: "mds-fund-chip-icon", "aria-hidden": "true", children: e.leading }),
        /* @__PURE__ */ n("span", { className: "mds-filter-chip-label mds-fund-chip-name", children: e.label }),
        e.balance !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-fund-chip-balance", children: /* @__PURE__ */ n(Me, { value: e.balance }) }) : null
      ]
    }
  );
}
function gr({
  label: e,
  fund: t,
  disabled: a,
  onOpen: r
}) {
  const { isPressed: s, pressProps: i } = N({ onPress: r, disabled: a }), o = [
    "mds-text-field-input",
    "mds-picker-field-box",
    s ? "mds-picker-field-box--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("span", { className: "mds-fund-field", children: [
    /* @__PURE__ */ n("span", { className: "mds-fund-field-label mds-type-label", children: e }),
    /* @__PURE__ */ n("span", { className: "mds-picker-field-row", children: /* @__PURE__ */ n("button", { type: "button", className: o, "aria-label": e, disabled: a, ...i, children: t ? /* @__PURE__ */ f(G, { children: [
      /* @__PURE__ */ n("span", { className: "mds-fund-field-icon", "aria-hidden": "true", children: t.leading }),
      /* @__PURE__ */ n("span", { className: "mds-fund-field-name mds-type-body", children: t.label })
    ] }) : /* @__PURE__ */ n("span", { className: "mds-fund-field-name mds-fund-field-name--empty" }) }) })
  ] });
}
function kr({
  label: e,
  items: t,
  value: a,
  onPick: r,
  onDismiss: s
}) {
  return /* @__PURE__ */ n(X, { label: e, onDismiss: s, children: /* @__PURE__ */ n("div", { className: "mds-fund-sheet-rows", role: "listbox", "aria-label": e, children: t.map((i) => {
    const o = i.disabled;
    return /* @__PURE__ */ n(
      ct,
      {
        label: i.label,
        leading: i.leading,
        value: i.balance !== void 0 ? /* @__PURE__ */ n(Me, { value: i.balance }) : void 0,
        trailing: i.value === a ? /* @__PURE__ */ n(se, { size: 20, className: "mds-fund-row-selected" }) : void 0,
        disabled: o,
        onPress: o ? void 0 : () => r(i.value)
      },
      i.value
    );
  }) }) });
}
const fi = [
  "default",
  "single-fund",
  "chips-selected",
  "chips-disabled-transfer",
  "field-open-sheet",
  "negative-balance",
  "no-choice-error",
  "disabled"
], xr = {
  done: Je,
  waiting: cn,
  problem: Be,
  info: hn
}, yr = {
  done: "badge.done",
  waiting: "badge.waiting",
  problem: "badge.problem",
  info: "badge.info",
  neutral: "badge.neutral"
};
function bi({
  tone: e,
  label: t,
  className: a,
  id: r,
  style: s,
  ref: i,
  ...o
}) {
  const d = e === "neutral" ? null : xr[e], l = ["mds-status-badge", `mds-status-badge--${e}`, a].filter(Boolean).join(" ");
  return /* @__PURE__ */ n("span", { ref: i, id: r, style: s, className: l, ...o, children: /* @__PURE__ */ f("span", { className: "mds-status-badge-content", children: [
    d ? /* @__PURE__ */ n(d, { size: 14 }) : null,
    /* @__PURE__ */ n("span", { className: "mds-status-badge-label", children: t ?? p(yr[e]) })
  ] }, e) });
}
const gi = [
  "neutral",
  "info",
  "done",
  "waiting",
  "problem",
  "longLabel"
];
function ki({
  label: e,
  caption: t,
  value: a,
  onChange: r,
  placeholder: s,
  state: i = "idle",
  disabled: o = !1,
  optional: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const h = [
    "mds-field",
    "mds-text-field",
    i === "error" ? "mds-text-field--error" : "",
    o ? "mds-text-field--disabled mds-field--disabled" : "",
    l
  ].filter(Boolean).join(" "), g = c ? `${c}-input` : void 0;
  return /* @__PURE__ */ f("span", { ref: u, id: c, style: m, className: h, ...b, children: [
    /* @__PURE__ */ f("label", { className: "mds-text-field-label mds-type-label", htmlFor: g, children: [
      e,
      d ? /* @__PURE__ */ n("span", { className: "mds-text-field-optional mds-type-caption", children: p("field.optional") }) : null
    ] }),
    /* @__PURE__ */ n(
      "input",
      {
        id: g,
        className: "mds-text-field-input mds-field-input",
        type: "text",
        value: a,
        disabled: o,
        placeholder: s,
        "aria-label": c ? void 0 : e,
        "aria-invalid": i === "error" || void 0,
        onChange: (k) => r?.(k.target.value)
      }
    ),
    t ? /* @__PURE__ */ f("span", { className: i === "error" ? "mds-text-field-caption mds-text-field-caption--error" : "mds-text-field-caption", children: [
      i === "error" ? /* @__PURE__ */ n(Be, { size: 14 }) : null,
      t
    ] }) : null
  ] });
}
const xi = [
  "default",
  "focused",
  "disabled",
  "error",
  "withCaption",
  "withPlaceholder"
];
function yi({
  leading: e,
  value: t,
  onChange: a,
  disabled: r = !1,
  label: s,
  className: i,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = (u) => {
    const b = t.includes(u) ? t.filter((h) => h !== u) : [...t, u];
    a(b);
  };
  return /* @__PURE__ */ n(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-filter-chips", i].filter(Boolean).join(" "),
      role: "group",
      "aria-label": s,
      ...c,
      children: e.map((u) => /* @__PURE__ */ n(
        vr,
        {
          chip: u,
          selected: t.includes(u.value),
          disabled: r || u.disabled === !0,
          onToggle: m
        },
        u.value
      ))
    }
  );
}
function vr({
  chip: e,
  selected: t,
  disabled: a,
  onToggle: r
}) {
  const { isPressed: s, pressProps: i } = N({ onPress: () => r(e.value), disabled: a }), o = [
    "mds-filter-chip",
    t ? "mds-filter-chip--selected" : "",
    s ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: o,
      "aria-pressed": t === !0,
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...i,
      children: [
        t ? /* @__PURE__ */ n(se, { size: 16, className: "mds-filter-chip-check" }) : null,
        /* @__PURE__ */ n("span", { className: "mds-filter-chip-label", children: e.label })
      ]
    }
  );
}
const vi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "manyChips"
];
function wi({
  children: e,
  label: t,
  trailing: a,
  density: r = "regular",
  className: s,
  id: i,
  style: o,
  ref: d,
  ...l
}) {
  const c = [
    "mds-surface",
    r === "list" ? "mds-surface--list" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("div", { ref: d, id: i, style: o, className: c, ...l, children: [
    t || a ? /* @__PURE__ */ f("div", { className: "mds-surface-header", children: [
      t ? /* @__PURE__ */ n("h3", { className: "mds-surface-title", children: t }) : null,
      a ? /* @__PURE__ */ n("div", { className: "mds-surface-action", children: a }) : null
    ] }) : null,
    e
  ] });
}
const Ni = [
  "default",
  "withHeader",
  "withAction",
  "pressed",
  "list"
];
function Ai({ children: e, className: t, id: a, style: r, ref: s, ...i }) {
  return /* @__PURE__ */ n(
    "div",
    {
      ref: s,
      id: a,
      style: r,
      className: ["mds-well", t].filter(Boolean).join(" "),
      ...i,
      children: e
    }
  );
}
const Pi = [
  "default",
  "inSurface"
];
function Si({
  label: e,
  caption: t,
  onPress: a,
  children: r,
  className: s,
  id: i,
  style: o,
  ref: d,
  ...l
}) {
  const c = r == null, { isPressed: m, pressProps: u } = N({ onPress: () => a?.(), disabled: c }), b = !c && a !== void 0, h = ["mds-section", s].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("section", { ref: d, id: i, style: o, className: h, ...l, children: [
    /* @__PURE__ */ f("header", { className: "mds-section-header", children: [
      /* @__PURE__ */ n("h2", { className: "mds-section-title mds-type-title-section", children: e }),
      t !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-section-count", children: t }) : null,
      b ? /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: ["mds-section-see-all", m ? "mds-section-see-all--pressed" : ""].filter(Boolean).join(" "),
          "data-ds-exempt": "",
          ...u,
          children: [
            /* @__PURE__ */ n("span", { className: "mds-section-see-all-label", children: p("button.all") }),
            /* @__PURE__ */ n(Ke, { size: 16, className: "mds-section-see-all-icon" })
          ]
        }
      ) : null
    ] }),
    r
  ] });
}
const Hi = [
  "default",
  "withCount",
  "withSeeAll",
  "empty"
], he = 80, mt = _.size["dot-signal"] / 2, wr = _.border["signal-line"], ee = mt + wr / 2;
function Nr(e, t) {
  const a = e.length, r = Math.min(...e), i = Math.max(...e) - r, o = (c) => a === 1 ? he - ee : ee + c / (a - 1) * (he - 2 * ee), d = (c) => i === 0 ? t / 2 : ee + (1 - (c - r) / i) * (t - 2 * ee);
  return { points: e.map((c, m) => `${o(m).toFixed(2)},${d(c).toFixed(2)}`).join(" "), endX: o(a - 1), endY: d(e[a - 1]) };
}
function ut({
  values: e,
  lineClassName: t,
  dotClassName: a,
  hidden: r = !1,
  height: s,
  fullWidth: i = !1
}) {
  const o = s ?? _.size["sparkline-height"], d = !r && e.length >= 1 ? Nr(e, o) : null;
  return /* @__PURE__ */ f(
    "svg",
    {
      viewBox: `0 0 ${he} ${o}`,
      width: i ? "100%" : he,
      height: o,
      preserveAspectRatio: i ? "none" : void 0,
      focusable: "false",
      children: [
        d && e.length >= 2 ? /* @__PURE__ */ n(
          "polyline",
          {
            className: t,
            points: d.points,
            vectorEffect: i ? "non-scaling-stroke" : void 0
          }
        ) : null,
        d ? i ? (
          /* The stretched dot: a zero-length path with a round cap and a
             non-scaling stroke keeps its token diameter and its circle shape
             under any preserveAspectRatio="none" stretch. */
          /* @__PURE__ */ n(
            "path",
            {
              className: a,
              d: `M ${d.endX.toFixed(2)} ${d.endY.toFixed(2)} L ${d.endX.toFixed(2)} ${d.endY.toFixed(2)}`,
              strokeWidth: _.size["dot-signal"],
              strokeLinecap: "round",
              vectorEffect: "non-scaling-stroke",
              fill: "none"
            }
          )
        ) : /* @__PURE__ */ n("circle", { className: a, cx: d.endX, cy: d.endY, r: mt }) : null
      ]
    }
  );
}
function Bi({
  leading: e,
  label: t,
  state: a = !1,
  caption: r,
  value: s,
  trailing: i,
  draft: o,
  tone: d = "start",
  onPress: l,
  disabled: c = !1,
  className: m,
  id: u,
  style: b,
  ref: h,
  ...g
}) {
  const { isPressed: k, pressProps: x } = N({ onPress: () => l?.(), disabled: c }), { hidden: v } = Q(), y = o !== void 0, w = s != null && typeof s != "string", P = s === void 0 ? V().missingGlyph : w ? s : v && y ? V().hiddenGlyph : s, B = [
    "mds-tile",
    `mds-tile--${d}`,
    k ? "mds-tile--pressed" : "",
    c ? "mds-tile--disabled" : "",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "button",
    {
      ref: h,
      id: u,
      style: b,
      type: "button",
      className: B,
      disabled: c,
      "data-ds-exempt": c ? void 0 : "",
      ...x,
      ...g,
      children: [
        /* @__PURE__ */ f("span", { className: "mds-tile-header", children: [
          e ? /* @__PURE__ */ n("span", { className: "mds-tile-header-icon", "aria-hidden": "true", children: e }) : null,
          /* @__PURE__ */ n("span", { className: "mds-tile-header-label mds-type-label", children: t }),
          a ? /* @__PURE__ */ n("span", { className: "mds-tile-dot", role: "img", "aria-label": r ?? "" }) : null
        ] }),
        /* @__PURE__ */ f("span", { className: "mds-tile-content", children: [
          o ? /* @__PURE__ */ n("span", { className: "mds-tile-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ n(
            ut,
            {
              values: o,
              hidden: v,
              lineClassName: "mds-tile-sparkline-line",
              dotClassName: "mds-tile-sparkline-dot"
            }
          ) }) : null,
          /* @__PURE__ */ n("span", { className: "mds-tile-value", children: w ? P : /* @__PURE__ */ n("bdi", { dir: "ltr", children: P }) }),
          i ? /* @__PURE__ */ n("span", { className: "mds-tile-line mds-type-caption", children: i }) : null
        ] })
      ]
    }
  );
}
const Mi = [
  "default",
  "withDot",
  "withSparkline",
  "pressed",
  "focused",
  "disabled"
];
function Ar(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function Pr({ value: e }) {
  const { hidden: t } = Q(), r = e === void 0 ? V().missingGlyph : t ? V().hiddenGlyph : null, { whole: s, cents: i } = Ar(e ?? V().missingGlyph), d = (e ?? "").length > 9 ? "mds-hero-value--lg mds-number-lg" : "mds-hero-value--hero mds-type-display-hero";
  return /* @__PURE__ */ n("span", { className: `mds-hero-value ${d}`, children: /* @__PURE__ */ n("bdi", { dir: "ltr", children: r !== null ? /* @__PURE__ */ n("span", { className: "mds-hero-value-glyph", children: r }) : /* @__PURE__ */ f(G, { children: [
    /* @__PURE__ */ n("span", { className: "mds-hero-value-whole", children: s }),
    i ? /* @__PURE__ */ n("span", { className: "mds-hero-value-cents", children: i }) : null
  ] }) }) });
}
function Sr({ values: e }) {
  const { hidden: t } = Q();
  return /* @__PURE__ */ n("span", { className: "mds-hero-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ n(
    ut,
    {
      values: e,
      hidden: t,
      height: _.size["hero-sparkline-height"],
      fullWidth: !0,
      lineClassName: "mds-hero-sparkline-line",
      dotClassName: "mds-hero-sparkline-dot"
    }
  ) });
}
function Zi({
  label: e,
  value: t,
  trailing: a,
  direction: r,
  debt: s,
  draft: i,
  onDismiss: o,
  onChange: d,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const { isPressed: h, pressProps: g } = N({ onPress: () => o?.() }), { hidden: k } = Q(), x = k && t !== void 0, v = ["mds-hero-surface", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("section", { ref: u, id: c, style: m, className: v, ...b, children: [
    /* @__PURE__ */ f("header", { className: "mds-hero-header", children: [
      /* @__PURE__ */ n("span", { className: "mds-hero-label", children: e }),
      /* @__PURE__ */ n(fa, { className: "mds-hero-toggle", onChange: d })
    ] }),
    /* @__PURE__ */ f("p", { className: "mds-hero-amount", children: [
      /* @__PURE__ */ f("span", { className: "mds-hero-visual", "aria-hidden": x || void 0, children: [
        /* @__PURE__ */ n(Pr, { value: t }),
        a && t !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-hero-unit", children: a }) : null
      ] }, x ? "hidden" : "shown"),
      x ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: V().hidden }) : null
    ] }),
    r || s ? (
      /* 1.7 ت2.3: ONE line — the diff, then « · », then the source link
          at the line's end (they used to be two stacked lines with the
          source under the sparkline). */
      /* @__PURE__ */ f("p", { className: "mds-hero-line", children: [
        r ? /* @__PURE__ */ n("span", { className: "mds-hero-diff", children: r }) : null,
        r && s ? /* @__PURE__ */ n("span", { className: "mds-hero-line-sep", "aria-hidden": "true", children: "·" }) : null,
        s ? /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: ["mds-hero-source", h ? "mds-hero-source--pressed" : ""].filter(Boolean).join(" "),
            "data-ds-exempt": "",
            ...g,
            children: s
          }
        ) : null
      ] })
    ) : null,
    i ? /* @__PURE__ */ n(Sr, { values: i }) : null
  ] });
}
const Ci = [
  "default",
  "withCents",
  "missing",
  "longNumber",
  "noDiff",
  "withSparkline"
];
function Ti({
  leading: e,
  tone: t,
  label: a,
  caption: r,
  value: s,
  state: i,
  href: o,
  children: d,
  onPress: l,
  disabled: c = !1,
  className: m,
  id: u,
  style: b,
  ref: h,
  ...g
}) {
  const { isPressed: k, pressProps: x } = N({ onPress: () => l?.(), disabled: c }), v = l !== void 0 || o !== void 0, y = d != null, w = o ? "a" : v ? "button" : "div", P = [
    "mds-object-card",
    k ? "mds-object-card--pressed" : "",
    c ? "mds-object-card--disabled" : "",
    y ? "mds-object-card--with-action" : "",
    v ? "" : "mds-object-card--passive",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("div", { ref: h, id: u, style: b, className: ["mds-object-card-wrap", c ? "mds-object-card-wrap--disabled" : "", m].filter(Boolean).join(" "), ...g, children: [
    /* @__PURE__ */ f(
      w,
      {
        className: P,
        href: o,
        type: w === "button" ? "button" : void 0,
        disabled: w === "button" ? c : void 0,
        ...v ? x : {},
        children: [
          /* @__PURE__ */ f("span", { className: "mds-object-card-mark", children: [
            /* @__PURE__ */ n(be, { size: "lg", tone: t, value: typeof e == "string" ? e : a, children: typeof e == "string" ? void 0 : e }),
            i ? /* @__PURE__ */ n("span", { className: "mds-object-card-state", children: i }) : null
          ] }),
          /* @__PURE__ */ f("span", { className: "mds-object-card-body", children: [
            /* @__PURE__ */ n("span", { className: "mds-object-card-title", children: a }),
            r ? /* @__PURE__ */ n("span", { className: "mds-object-card-caption mds-type-caption", children: r }) : null,
            s !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-object-card-value mds-type-amount-row", children: typeof s == "string" ? /* @__PURE__ */ n("bdi", { dir: "ltr", children: s }) : (
              /* A Money node renders itself (its own isolation, sign,
                 unit and hidden-amounts behaviour) — never re-wrapped. */
              s
            ) }) : null
          ] })
        ]
      }
    ),
    y ? /* @__PURE__ */ n("span", { className: "mds-object-card-action", children: d }) : null
  ] });
}
const ji = [
  "default",
  "withBadge",
  "withButton",
  "pressed",
  "focused",
  "disabled"
];
function Hr(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function Br({
  label: e,
  size: t = "lg",
  value: a,
  trailing: r,
  direction: s,
  debt: i,
  onDismiss: o,
  loading: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...b
}) {
  const { isPressed: h, pressProps: g } = N({ onPress: () => o?.() }), { hidden: k } = Q(), x = k && a !== void 0 && a !== null && !d, { whole: v, cents: y } = Hr(x ? "—" : a ?? "—"), w = ["mds-metric", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("div", { ref: u, id: c, style: m, className: w, ...b, children: [
    /* @__PURE__ */ n("span", { className: "mds-metric-label mds-type-label", children: e }),
    /* @__PURE__ */ n("p", { className: "mds-metric-amount", children: d ? /* @__PURE__ */ n("span", { className: "mds-metric-skeleton", "aria-busy": "true" }) : x ? /* @__PURE__ */ f(G, { children: [
      /* @__PURE__ */ f(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero mds-metric-value--hidden",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          "data-ds-check": "amount-hidden",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ n("bdi", { dir: "ltr", children: /* @__PURE__ */ n("span", { className: "mds-metric-value-whole", children: V().hiddenGlyph }) }),
            r ? /* @__PURE__ */ n("span", { className: "mds-metric-unit", children: r }) : null
          ]
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: V().hidden })
    ] }) : /* @__PURE__ */ f(G, { children: [
      /* @__PURE__ */ n(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          children: /* @__PURE__ */ f("bdi", { dir: "ltr", children: [
            /* @__PURE__ */ n("span", { className: "mds-metric-value-whole", children: v }),
            y ? /* @__PURE__ */ n("span", { className: "mds-metric-value-cents", children: y }) : null
          ] })
        }
      ),
      r ? /* @__PURE__ */ n("span", { className: "mds-metric-unit", children: r }) : null
    ] }) }),
    s && !d ? /* @__PURE__ */ n("p", { className: "mds-metric-diff", children: s }) : null,
    i && !d ? /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: ["mds-metric-source", h ? "mds-metric-source--pressed" : ""].filter(Boolean).join(" "),
        "data-ds-exempt": "",
        ...g,
        children: i
      }
    ) : null
  ] });
}
const $i = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function Vi({ size: e, ...t }) {
  return /* @__PURE__ */ n(Br, { ...t, size: "sm", className: ["mds-metric-small", t.className].filter(Boolean).join(" ") });
}
const Ii = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function Fi({
  label: e,
  caption: t,
  value: a,
  onPress: r,
  onDismiss: s,
  className: i,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = Z(null);
  return R(() => {
    m.current?.focus();
  }, []), /* @__PURE__ */ n(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-confirm-sheet", i].filter(Boolean).join(" "),
      ...c,
      children: /* @__PURE__ */ f(
        X,
        {
          label: e,
          onDismiss: s,
          className: "mds-confirm-sheet__sheet",
          role: "alertdialog",
          "data-ds-check": "confirm-sheet",
          children: [
            /* @__PURE__ */ f("div", { className: "mds-confirm-sheet-head", children: [
              /* @__PURE__ */ n("span", { className: "mds-confirm-sheet-icon", children: /* @__PURE__ */ n(Mn, {}) }),
              /* @__PURE__ */ n("h2", { className: "mds-confirm-sheet-title mds-type-title-section", children: e }),
              /* @__PURE__ */ n("p", { className: "mds-confirm-sheet-sentence", children: t })
            ] }),
            /* @__PURE__ */ f("div", { className: "mds-confirm-sheet-actions", children: [
              /* @__PURE__ */ n(
                re,
                {
                  ref: m,
                  variant: "secondary",
                  className: "mds-confirm-sheet-back",
                  onPress: s,
                  children: p("button.back")
                }
              ),
              /* @__PURE__ */ n(re, { variant: "danger", className: "mds-confirm-sheet-confirm", onPress: r, children: a })
            ] })
          ]
        }
      )
    }
  );
}
const Di = [
  "default",
  "focused",
  "pressed"
];
function Li({
  selected: e = !1,
  onPress: t,
  onLongPress: a,
  className: r,
  id: s,
  style: i,
  ref: o,
  ...d
}) {
  const { isPressed: l, pressProps: c } = N({ onPress: t, onLongPress: a }), m = p(e ? "sr.askUnread" : "sr.ask"), u = ["mds-ask-button", l ? "mds-ask-button--pressed" : "", r].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "button",
    {
      ref: o,
      id: s,
      style: i,
      type: "button",
      className: u,
      "aria-label": m,
      ...d,
      ...c,
      children: [
        /* @__PURE__ */ n(Vt, { size: 28 }),
        e ? /* @__PURE__ */ n("span", { className: "mds-ask-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const Ei = [
  "default",
  "pressed",
  "focused",
  "unreadDot",
  "longPressRecording"
];
function Oi({
  value: e = 0,
  label: t,
  onPress: a,
  className: r,
  id: s,
  style: i,
  ref: o,
  ...d
}) {
  const { isPressed: l, pressProps: c } = N({ onPress: a }), m = _e(e, Ge.unread), u = t ?? (e > 0 ? p("sr.notificationsCount", { counted: m }) : p("sr.notifications")), b = [
    "mds-notifications-button",
    l ? "mds-notifications-button--pressed" : "",
    e > 0 ? "mds-notifications-button--unread" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "button",
    {
      ref: o,
      id: s,
      style: i,
      type: "button",
      className: b,
      "aria-label": u,
      ...d,
      ...c,
      children: [
        /* @__PURE__ */ n(Rt, {}),
        e > 0 ? /* @__PURE__ */ n("span", { className: "mds-notifications-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const Ri = [
  "default",
  "pressed",
  "focused",
  "unreadDot"
];
function zi({
  label: e,
  caption: t,
  locked: a = !1,
  onPress: r,
  className: s,
  id: i,
  style: o,
  ref: d,
  ...l
}) {
  const { isPressed: c, pressProps: m } = N({ onPress: r }), u = [
    "mds-project-switcher",
    c ? "mds-project-switcher--pressed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "button",
    {
      ref: d,
      id: i,
      style: o,
      type: "button",
      className: u,
      ...l,
      ...m,
      children: [
        /* @__PURE__ */ n(be, { size: "sm", variant: "canvas", value: e }),
        /* @__PURE__ */ f("span", { className: "mds-project-switcher-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-project-switcher-name mds-type-body-strong", children: e }),
          t ? /* @__PURE__ */ n("span", { className: "mds-project-switcher-role", children: t }) : null
        ] }),
        a ? null : /* @__PURE__ */ n(Xe, { className: "mds-project-switcher-caret" })
      ]
    }
  );
}
const Yi = [
  "default",
  "pressed",
  "focused",
  "withCaret",
  "singleRoleNoCaret"
];
function qi({
  leading: e,
  trailing: t,
  caption: a = !1,
  label: r,
  className: s,
  id: i,
  style: o,
  ref: d,
  children: l,
  ...c
}) {
  const m = [
    "mds-context-bar",
    a ? "mds-context-bar--scrolled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "div",
    {
      ref: d,
      id: i,
      style: o,
      className: m,
      role: "banner",
      "aria-label": r,
      ...c,
      children: [
        /* @__PURE__ */ n("div", { className: "mds-context-bar-start", children: e ?? l }),
        /* @__PURE__ */ n("div", { className: "mds-context-bar-end", children: t })
      ]
    }
  );
}
const Gi = [
  "default",
  "mainScreenSwitcher",
  "subScreenBack",
  "scrolledHairline",
  "notScrolled"
];
function _i({
  label: e,
  selected: t = !1,
  leading: a,
  onPress: r,
  className: s,
  ref: i,
  ...o
}) {
  const { isPressed: d, pressProps: l } = N({ onPress: r }), c = [
    "mds-tab",
    t ? "mds-tab--active" : "",
    d ? "mds-tab--pressed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "button",
    {
      ref: i,
      type: "button",
      role: "tab",
      className: c,
      "aria-selected": t,
      "aria-current": t ? "page" : void 0,
      tabIndex: t ? 0 : -1,
      ...o,
      ...l,
      children: [
        a ? /* @__PURE__ */ n("span", { className: "mds-tab-icon", "aria-hidden": "true", children: a }) : null,
        /* @__PURE__ */ n("span", { className: "mds-tab-label", children: e })
      ]
    }
  );
}
function Qi({
  children: e,
  value: t,
  onChange: a,
  className: r,
  id: s,
  style: i,
  ref: o,
  ...d
}) {
  const l = gt.toArray(e), c = l.some(
    (u) => u && typeof u == "object" && "props" in u && u.props.selected !== void 0
  ), m = t ?? 0;
  return /* @__PURE__ */ n(
    "div",
    {
      ref: o,
      id: s,
      style: i,
      className: ["mds-tab-bar", r].filter(Boolean).join(" "),
      role: "tablist",
      ...d,
      children: l.map((u, b) => {
        if (u && typeof u == "object" && "props" in u) {
          const h = u.props, g = c ? h.selected === !0 : b === m;
          return {
            ...u,
            props: { ...h, selected: g, onPress: () => {
              h.onPress?.(), a?.(b);
            } }
          };
        }
        return u;
      })
    }
  );
}
const Wi = [
  "default",
  "activeFill",
  "pressed",
  "focused",
  "fiveTabs",
  "twoTabs"
];
function Ui({
  label: e,
  leading: t,
  caption: a = !1,
  trailing: r,
  className: s,
  id: i,
  style: o,
  ref: d,
  ...l
}) {
  const c = [
    "mds-page-header",
    a && t ? "mds-page-header--collapsed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f("header", { ref: d, id: i, style: o, className: c, ...l, children: [
    t,
    /* @__PURE__ */ n("h1", { className: "mds-page-header-title", children: e }),
    r ? /* @__PURE__ */ n("div", { className: "mds-page-header-end", children: r }) : null
  ] });
}
const Ki = [
  "default",
  "mainScreen",
  "subScreenBack",
  "collapsedOnScroll",
  "withTrailing"
], Mr = {
  draft: p("saveState.draft"),
  sending: p("saveState.sending"),
  saved: p("saveState.saved"),
  failed: p("saveState.failed")
};
function Xi({
  saveState: e,
  className: t,
  id: a,
  style: r,
  ref: s,
  ...i
}) {
  const o = Ue(e === "sending"), d = [
    "mds-save-state",
    `mds-save-state--${e}`,
    e === "sending" && !o ? "mds-save-state--pending-delay" : "",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ f(
    "span",
    {
      ref: s,
      id: a,
      style: r,
      className: d,
      role: e === "failed" ? "alert" : void 0,
      "aria-busy": e === "sending" || void 0,
      ...i,
      children: [
        e === "draft" ? /* @__PURE__ */ n(fn, { size: 14 }) : e === "saved" ? /* @__PURE__ */ n("span", { className: "mds-save-state-icon", children: /* @__PURE__ */ n(Je, { size: 14 }) }) : e === "failed" ? /* @__PURE__ */ n(Be, { size: 14 }) : null,
        /* @__PURE__ */ n("span", { className: "mds-save-state-text", children: Mr[e] }),
        e === "saved" ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: p("sr.saveSaved") }) : null,
        e === "failed" ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: p("sr.saveFailed") }) : null
      ]
    }
  );
}
const Ji = [
  "draft",
  "sending",
  "saved",
  "failed"
];
function eo({
  label: e,
  trailing: t,
  onDismiss: a,
  className: r,
  id: s,
  style: i,
  ref: o,
  ...d
}) {
  const l = Z(null), c = Z(0), m = Z(0), u = t ? 5e3 : 3e3;
  R(() => (c.current = u, m.current = Date.now(), l.current = window.setTimeout(() => a?.(), u), () => {
    l.current && window.clearTimeout(l.current), l.current = null;
  }), [e, u]);
  const b = () => {
    l.current && (window.clearTimeout(l.current), l.current = null, c.current -= Date.now() - m.current);
  }, h = () => {
    l.current || (m.current = Date.now(), l.current = window.setTimeout(() => a?.(), Math.max(0, c.current)));
  };
  return /* @__PURE__ */ f(
    "div",
    {
      ref: o,
      id: s,
      style: i,
      className: ["mds-toast", r].filter(Boolean).join(" "),
      role: "status",
      onFocus: b,
      onBlur: h,
      ...d,
      children: [
        /* @__PURE__ */ n("span", { className: "mds-toast-text", children: e }),
        t ? /* @__PURE__ */ n("span", { className: "mds-toast-action", children: t }) : null
      ]
    }
  );
}
const to = ["default", "withAction", "focusedPaused"], Zr = {
  offline: kn,
  locked: yn,
  info: wn
};
function no({
  tone: e,
  label: t,
  trailing: a,
  className: r,
  id: s,
  style: i,
  ref: o,
  ...d
}) {
  const l = Zr[e];
  return /* @__PURE__ */ f(
    "div",
    {
      ref: o,
      id: s,
      style: i,
      className: ["mds-inline-banner", `mds-inline-banner--${e}`, r].filter(Boolean).join(" "),
      role: "status",
      ...d,
      children: [
        /* @__PURE__ */ n(l, {}),
        /* @__PURE__ */ n("span", { className: "mds-inline-banner-text", children: t }),
        a ? /* @__PURE__ */ n("span", { className: "mds-inline-banner-action", children: a }) : null
      ]
    }
  );
}
const ao = ["offline", "locked", "info", "withAction"];
export {
  Ce as ActionBar,
  Us as ActionBarStates,
  Es as AmountField,
  Os as AmountFieldStates,
  Rs as AmountKeypad,
  zs as AmountKeypadStates,
  Fr as AmountVisibilityProvider,
  fa as AmountVisibilityToggle,
  Zs as AmountVisibilityToggleStates,
  Gt as AmountsHiddenIcon,
  Yt as AmountsShownIcon,
  ss as AppointmentIcon,
  Li as AskButton,
  Ei as AskButtonStates,
  Vt as AskSymbolIcon,
  Qt as BackIcon,
  zn as BackspaceIcon,
  re as Button,
  Ws as ButtonStates,
  tt as CalendarIcon,
  ls as CameraIcon,
  ys as ChartIcon,
  Cs as Checkbox,
  Ts as CheckboxStates,
  ie as ClearIcon,
  Wn as ClockIcon,
  Xt as CloseIcon,
  Fi as ConfirmSheet,
  Di as ConfirmSheetStates,
  qi as ContextBar,
  Gi as ContextBarStates,
  Mn as DangerIcon,
  ei as DatePicker,
  ti as DatePickerStates,
  ni as DateQuickChips,
  ai as DateQuickChipsStates,
  ts as DebtIcon,
  Qr as DeltaDownIcon,
  _r as DeltaUpIcon,
  fn as DraftIcon,
  ii as DurationPicker,
  oi as DurationPickerStates,
  ir as EmptyState,
  di as EmptyStateStates,
  Pn as EntityApprovedIcon,
  be as EntityMark,
  li as EntityMarkStates,
  Hn as EntityPendingIcon,
  Xe as ExpandIcon,
  rn as FieldErrorIcon,
  Ns as FileIcon,
  yi as FilterChips,
  vi as FilterChipsStates,
  Ke as ForwardIcon,
  Xr as FundBankIcon,
  Kr as FundCashIcon,
  pi as FundPicker,
  fi as FundPickerStates,
  Jr as FundWalletIcon,
  Zi as HeroSurface,
  Ci as HeroSurfaceStates,
  K as IconButton,
  _s as IconButtonStates,
  wn as InfoIcon,
  no as InlineBanner,
  ao as InlineBannerStates,
  as as JobFailedIcon,
  Ht as LONG_PRESS_MS,
  Lr as LayersProvider,
  As as LinkIcon,
  yn as LockedIcon,
  gs as MapPinIcon,
  Br as Metric,
  Vi as MetricSmall,
  Ii as MetricSmallStates,
  $i as MetricStates,
  cs as MicIcon,
  Gn as MinusIcon,
  Me as Money,
  Ms as MoneyStates,
  Za as MonthGrid,
  Qs as MonthGridStates,
  dt as MonthSheet,
  Ur as MoreIcon,
  hs as MovementInIcon,
  ps as MovementOutIcon,
  Ys as MovementTypeControl,
  qs as MovementTypeControlStates,
  qr as NavDeliveryIcon,
  zr as NavFinanceIcon,
  Gr as NavMarketIcon,
  Yr as NavOrdersIcon,
  Rr as NavTodayIcon,
  Ps as NoteIcon,
  Oi as NotificationsButton,
  Ri as NotificationsButtonStates,
  Rt as NotificationsIcon,
  Ti as ObjectCard,
  ji as ObjectCardStates,
  ct as ObjectRow,
  ci as ObjectRowStates,
  kn as OfflineIcon,
  rs as OrderIcon,
  Ui as PageHeader,
  Ki as PageHeaderStates,
  ui as PartyPicker,
  hi as PartyPickerStates,
  Hs as PauseIcon,
  Da as PeriodSwitcher,
  Js as PeriodSwitcherStates,
  fs as PhoneIcon,
  et as PlusIcon,
  is as PriceTierIcon,
  zi as ProjectSwitcher,
  Yi as ProjectSwitcherStates,
  Aa as QuantityStepper,
  Gs as QuantityStepperStates,
  ns as QuoteIcon,
  Bs as RTL_FLIP_ICONS,
  js as Radio,
  $s as RadioStates,
  ds as ReportIcon,
  Wr as RetryIcon,
  os as ReviewIcon,
  Xi as SaveState,
  Ji as SaveStateStates,
  ba as SearchField,
  Fs as SearchFieldStates,
  tn as SearchIcon,
  Si as Section,
  Hi as SectionStates,
  it as SegmentedControl,
  Ks as SegmentedControlStates,
  se as SelectedIcon,
  ks as SendIcon,
  X as Sheet,
  Xs as SheetStates,
  we as Skeleton,
  mi as SkeletonStates,
  Ss as SlidersIcon,
  bi as StatusBadge,
  gi as StatusBadgeStates,
  ms as StopIcon,
  wi as Surface,
  Ni as SurfaceStates,
  Qi as TabBar,
  Wi as TabBarStates,
  _i as TabBarTab,
  xs as TableIcon,
  Ds as TextArea,
  Ls as TextAreaStates,
  ki as TextField,
  xi as TextFieldStates,
  Bi as Tile,
  Mi as TileStates,
  ri as TimePicker,
  si as TimePickerStates,
  eo as Toast,
  to as ToastStates,
  Vs as Toggle,
  Is as ToggleStates,
  Je as ToneDoneIcon,
  hn as ToneInfoIcon,
  Be as ToneProblemIcon,
  cn as ToneWaitingIcon,
  es as TransferIcon,
  us as TrashIcon,
  Ai as Well,
  Pi as WellStates,
  bs as WhatsappIcon,
  vs as ZoomInIcon,
  ws as ZoomOutIcon,
  kt as ar,
  Ba as currentPeriod,
  E as dateKey,
  Ze as daysInMonth,
  j as epochDays,
  C as formatDateParts,
  Ae as formatDuration,
  le as formatMoney,
  rt as formatPeriod,
  Ir as formatTime12,
  lt as formatTimeValue,
  U as fromEpochDays,
  V as getMoneyTexts,
  qe as getToken,
  Ma as isSamePeriod,
  Ha as monthEndOf,
  at as monthStartOf,
  ya as normalizeAmount,
  fe as normalizePeriod,
  Vr as overriddenText,
  jr as overrideTexts,
  Y as parseDateParts,
  ce as periodEnd,
  _e as pluralAr,
  Ge as pluralNouns,
  $r as resetTextOverrides,
  oe as startOfToday,
  Fe as stepPeriod,
  p as t,
  _ as tokens,
  Q as useAmountVisibility,
  Dr as useCountUp,
  Or as useOpenSheetCount,
  Ue as usePendingDelay,
  N as usePress,
  Er as useSheetLayer,
  Zt as useVisualViewport,
  nt as weekStartOf
};
