import { jsx as a, jsxs as g, Fragment as U } from "react/jsx-runtime";
import { useMemo as ee, useContext as we, createContext as Oe, useState as M, useRef as Z, useCallback as R, useEffect as O, useReducer as mt, useId as Ne, useLayoutEffect as ut, Children as ht } from "react";
const G = {
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
function ze(e) {
  let t = G;
  for (const n of e.split("."))
    t = t[n];
  return t;
}
const pt = {
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
let me = {};
function kr(e) {
  me = { ...e };
}
function xr() {
  me = {};
}
function yr(e) {
  return me[e];
}
function f(e, t) {
  let n = me[e] ?? pt[e].text;
  if (t)
    for (const [r, i] of Object.entries(t))
      n = n.replaceAll(`{${r}}`, String(i));
  return n;
}
const Ye = {
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
    unit: f("money.unit"),
    minus: f("money.ariaMinus"),
    dinar: f("money.ariaDinar"),
    fils: f("money.ariaFils"),
    and: f("money.ariaAnd"),
    forYou: f("money.forYou"),
    againstYou: f("money.againstYou"),
    hidden: f("money.ariaHidden"),
    missing: f("money.ariaMissing"),
    hiddenGlyph: f("money.hiddenGlyph"),
    missingGlyph: f("money.missing")
  };
}
const ft = new Intl.PluralRules("ar");
function qe(e, t) {
  switch (ft.select(e)) {
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
const gt = "ص", bt = "م";
function Te(e) {
  return `${e < 10 ? "0" : ""}${e}`;
}
function kt(e) {
  return e instanceof Date ? { h: e.getHours(), m: e.getMinutes() } : e;
}
function vr(e) {
  const { h: t, m: n } = kt(e), r = t < 12 ? gt : bt, i = t % 12 === 0 ? 12 : t % 12;
  return `${Te(i)}:${Te(n)} ${r}`;
}
const pe = "−", xt = "+", te = 3;
function yt(e) {
  const t = String(e).trim(), n = t.startsWith("-"), r = n ? t.slice(1) : t, [i = "0", s = ""] = r.split("."), d = i.replace(/[^0-9]/g, "") || "0", o = (s + "000").slice(0, te), c = BigInt(d) * 10n ** BigInt(te) + BigInt(o || "0");
  return { negative: n, fils: c };
}
function vt(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function wt(e) {
  const t = 10n ** BigInt(te), n = e / t, r = e % t;
  return {
    int: vt(n.toString()),
    frac: r === 0n ? "" : `.${r.toString().padStart(te, "0")}`
  };
}
function fe(e, t) {
  const n = 10n ** BigInt(te), r = e / n, i = e % n;
  let s = `${r.toString()} ${t.dinar}`;
  return i !== 0n && (s += ` ${t.and}${i.toString()} ${t.fils}`), s;
}
function xe(e, t) {
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
    const p = t.debt === "forYou" ? n.forYou : t.debt === "againstYou" ? n.againstYou : "", h = p ? `${p} ${n.hiddenGlyph} ${n.unit}` : `${n.hiddenGlyph} ${n.unit}`;
    return {
      missing: !1,
      hidden: !0,
      debt: t.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: n.unit,
      debtWord: p,
      display: h,
      aria: n.hidden
    };
  }
  const { negative: i, fils: s } = yt(e), d = wt(s), o = t.debt === "forYou" ? n.forYou : t.debt === "againstYou" ? n.againstYou : "", c = o ? "" : t.flow === "in" ? xt : t.flow === "out" ? pe : t.flow === "transfer" ? "" : i ? pe : "", l = `${c}${d.int}${d.frac}`, m = o ? `${o} ${l} ${n.unit}` : `${l} ${n.unit}`;
  let u;
  return o ? u = `${o} ${fe(s, n)}` : c === pe ? u = `${n.minus} ${fe(s, n)}` : u = fe(s, n), {
    missing: !1,
    hidden: !1,
    debt: t.debt ?? null,
    sign: c,
    int: d.int,
    frac: d.frac,
    unit: n.unit,
    debtWord: o,
    display: m,
    aria: u
  };
}
const Ge = Oe({ hidden: !1 });
function wr({ children: e, hidden: t = !1 }) {
  const n = ee(() => ({ hidden: t }), [t]);
  return /* @__PURE__ */ a(Ge.Provider, { value: n, children: e });
}
function W() {
  const { hidden: e } = we(Ge);
  return { hidden: e, visible: !e };
}
const Nt = 500, At = ze("motion.press-cancel-px");
function A(e = {}) {
  const { onPress: t, onLongPress: n, disabled: r } = e, [i, s] = M(!1), d = Z(null), o = Z(null), c = Z(!1), l = R(() => {
    o.current !== null && (clearTimeout(o.current), o.current = null);
  }, []), m = R(() => {
    l(), d.current = null, c.current = !1, s(!1);
  }, [l]), u = R(
    (b) => {
      if (!r && !(b.pointerType === "mouse" && b.button !== 0)) {
        if (typeof b.currentTarget.setPointerCapture == "function")
          try {
            b.currentTarget.setPointerCapture(b.pointerId);
          } catch {
          }
        d.current = { x: b.clientX, y: b.clientY }, c.current = !1, s(!0), n && (o.current = setTimeout(() => {
          c.current = !0, n();
        }, Nt));
      }
    },
    [r, n]
  ), p = R(
    (b) => {
      if (!i || d.current === null) return;
      const v = b.clientX - d.current.x, k = b.clientY - d.current.y;
      Math.hypot(v, k) > At && m();
    },
    [i, m]
  ), h = R(
    (b) => {
      if (!i) return;
      const v = c.current;
      m(), !v && !r && t?.();
    },
    [i, r, t, m]
  );
  return {
    isPressed: i,
    pressProps: {
      onPointerDown: u,
      onPointerMove: p,
      onPointerUp: h,
      onPointerCancel: m
    }
  };
}
const Ht = () => typeof window > "u" || !window.visualViewport ? {
  height: typeof window > "u" ? 0 : window.innerHeight,
  offsetTop: 0,
  scale: 1,
  keyboardHeight: 0
} : _e(window.visualViewport);
function _e(e) {
  const t = e.height, n = e.offsetTop, r = Math.max(0, window.innerHeight - t - n);
  return { height: t, offsetTop: n, scale: e.scale, keyboardHeight: r };
}
function St() {
  const [e, t] = M(Ht);
  return O(() => {
    const n = window.visualViewport;
    if (!n) return;
    const r = () => t(_e(n));
    return r(), n.addEventListener("resize", r), n.addEventListener("scroll", r), window.addEventListener("resize", r), window.addEventListener("orientationchange", r), () => {
      n.removeEventListener("resize", r), n.removeEventListener("scroll", r), window.removeEventListener("resize", r), window.removeEventListener("orientationchange", r);
    };
  }, []), e;
}
function Qe(e) {
  const [t, n] = M(!1);
  return O(() => {
    if (!e) return;
    const r = window.setTimeout(() => n(!0), G.motion["pending-delay"]);
    return () => {
      window.clearTimeout(r), n(!1);
    };
  }, [e]), e && t;
}
function Pt(e) {
  return 1 - Math.pow(1 - e, 3);
}
function Bt() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Nr(e, t, n) {
  const [r, i] = M(() => n ? e : t), s = Z(0), d = Bt();
  return O(() => {
    if (d || !n || e === t) {
      const u = requestAnimationFrame(() => i(t));
      return () => cancelAnimationFrame(u);
    }
    const c = performance.now(), l = G.motion.count.ms, m = (u) => {
      const p = Math.min(1, (u - c) / l);
      i(e + (t - e) * Pt(p)), p < 1 && (s.current = requestAnimationFrame(m));
    };
    return s.current = requestAnimationFrame(m), () => cancelAnimationFrame(s.current);
  }, [n, e, t, d]), O(() => () => cancelAnimationFrame(s.current), []), n && !d && e !== t && r !== t ? r : t;
}
const Ae = Oe({
  sheetIds: [],
  registerSheet: () => {
  },
  unregisterSheet: () => {
  }
});
function Mt(e, t) {
  switch (t.type) {
    case "register":
      return e.includes(t.id) ? e : [...e, t.id];
    case "unregister":
      return e.includes(t.id) ? e.filter((n) => n !== t.id) : e;
    default:
      return e;
  }
}
function Ar({ children: e }) {
  const [t, n] = mt(Mt, []), r = R((d) => n({ type: "register", id: d }), []), i = R((d) => n({ type: "unregister", id: d }), []), s = ee(
    () => ({ sheetIds: t, registerSheet: r, unregisterSheet: i }),
    [t, r, i]
  );
  return /* @__PURE__ */ a(Ae.Provider, { value: s, children: e });
}
function Hr() {
  const { sheetIds: e, registerSheet: t, unregisterSheet: n } = we(Ae), r = Ne();
  ut(() => (t(r), () => n(r)), [r, t, n]);
  const i = e.indexOf(r) + 1 || e.length + 1, s = Math.min(i, 2), d = i === e.length;
  return {
    level: s,
    overLimit: i > 2,
    sheetZ: s === 1 ? "var(--mds-layer-sheet)" : "var(--mds-layer-sheet-2)",
    scrimZ: s === 1 ? "var(--mds-layer-scrim)" : "var(--mds-layer-scrim-2)",
    isTop: d
  };
}
function Sr() {
  const { sheetIds: e } = we(Ae);
  return e.length;
}
const Zt = /* @__PURE__ */ g("g", { transform: "translate(16 16)", id: "micro-symbol-master-2", children: [
  /* @__PURE__ */ a("g", { id: "module-top", transform: "rotate(0 96 96)", children: /* @__PURE__ */ a("path", { id: "shape-top", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ a("g", { id: "module-right", transform: "rotate(90 96 96)", children: /* @__PURE__ */ a("path", { id: "shape-right", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-signal)" }) }),
  /* @__PURE__ */ a("g", { id: "module-bottom", transform: "rotate(180 96 96)", children: /* @__PURE__ */ a("path", { id: "shape-bottom", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ a("g", { id: "module-left", transform: "rotate(270 96 96)", children: /* @__PURE__ */ a("path", { id: "shape-left", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-data)" }) })
] });
function Ct({ size: e = 28, className: t, ...n }) {
  return /* @__PURE__ */ a(
    "svg",
    {
      viewBox: "0 0 224 224",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", t].filter(Boolean).join(" "),
      ...n,
      children: Zt
    }
  );
}
const Tt = {
  regular: /* @__PURE__ */ a("path", { d: "M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z" })
};
function Pr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Tt[t]
    }
  );
}
const jt = {
  regular: /* @__PURE__ */ a("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z" })
};
function Br({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: jt[t]
    }
  );
}
const $t = {
  regular: /* @__PURE__ */ a("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z" })
};
function Mr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: $t[t]
    }
  );
}
const Vt = {
  regular: /* @__PURE__ */ a("path", { d: "M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A8.13,8.13,0,0,0,255.43,117ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208ZM32,136V72H176v64Zm160,72a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm0-96V88h34.58l9.6,24Z" })
};
function Zr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Vt[t]
    }
  );
}
const It = {
  regular: /* @__PURE__ */ a("path", { d: "M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z" }),
  fill: /* @__PURE__ */ a("path", { d: "M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z" })
};
function Cr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: It[t]
    }
  );
}
const Ft = {
  regular: /* @__PURE__ */ a("path", { d: "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" })
};
function Dt({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Ft[t]
    }
  );
}
const Lt = {
  regular: /* @__PURE__ */ a("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" })
};
function Et({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Lt[t]
    }
  );
}
const Rt = {
  regular: /* @__PURE__ */ a("path", { d: "M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" })
};
function Ot({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Rt[t]
    }
  );
}
const zt = {
  regular: /* @__PURE__ */ a("path", { d: "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" })
};
function Yt({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: zt[t]
    }
  );
}
const qt = {
  bold: /* @__PURE__ */ a("path", { d: "M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" })
};
function We({
  size: e = 16,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: qt[t]
    }
  );
}
const Gt = {
  bold: /* @__PURE__ */ a("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" })
};
function Ue({
  size: e = 16,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: Gt[t]
    }
  );
}
const _t = {
  regular: /* @__PURE__ */ a("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function Qt({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: _t[t]
    }
  );
}
const Wt = {
  bold: /* @__PURE__ */ a("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function He({
  size: e = 16,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: Wt[t]
    }
  );
}
const Ut = {
  regular: /* @__PURE__ */ a("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" })
};
function Kt({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Ut[t]
    }
  );
}
const Xt = {
  fill: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function ue({
  size: e = 20,
  weight: t = "fill",
  className: n,
  ...r
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
      ...r,
      children: Xt[t]
    }
  );
}
const Jt = {
  bold: /* @__PURE__ */ a("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function en({
  size: e = 16,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: Jt[t]
    }
  );
}
const tn = {
  bold: /* @__PURE__ */ a("path", { d: "M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" })
};
function Tr({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: tn[t]
    }
  );
}
const nn = {
  bold: /* @__PURE__ */ a("path", { d: "M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" })
};
function jr({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: nn[t]
    }
  );
}
const an = {
  bold: /* @__PURE__ */ a("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function Ke({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: an[t]
    }
  );
}
const rn = {
  bold: /* @__PURE__ */ a("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z" })
};
function sn({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: rn[t]
    }
  );
}
const on = {
  bold: /* @__PURE__ */ a("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function Se({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: on[t]
    }
  );
}
const dn = {
  bold: /* @__PURE__ */ a("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" })
};
function ln({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: dn[t]
    }
  );
}
const cn = {
  bold: /* @__PURE__ */ a("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" })
};
function mn({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: cn[t]
    }
  );
}
const un = {
  regular: /* @__PURE__ */ a("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" })
};
function $r({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: un[t]
    }
  );
}
const hn = {
  regular: /* @__PURE__ */ a("path", { d: "M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z" })
};
function pn({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: hn[t]
    }
  );
}
const fn = {
  regular: /* @__PURE__ */ a("path", { d: "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z" })
};
function gn({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: fn[t]
    }
  );
}
const bn = {
  regular: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" })
};
function kn({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: bn[t]
    }
  );
}
const xn = {
  regular: /* @__PURE__ */ a("path", { d: "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z" })
};
function Vr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: xn[t]
    }
  );
}
const yn = {
  fill: /* @__PURE__ */ a("path", { d: "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" })
};
function vn({
  size: e = 14,
  weight: t = "fill",
  className: n,
  ...r
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
      ...r,
      children: yn[t]
    }
  );
}
const wn = {
  fill: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" })
};
function Nn({
  size: e = 14,
  weight: t = "fill",
  className: n,
  ...r
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
      ...r,
      children: wn[t]
    }
  );
}
const An = {
  regular: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function Hn({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: An[t]
    }
  );
}
const Sn = {
  regular: /* @__PURE__ */ a("path", { d: "M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM80,40h40V56H80ZM54.25,72h147.5l20,80H34.25ZM32,192V168H224v24ZM64,96a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,96ZM64,128a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,128Z" })
};
function Ir({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Sn[t]
    }
  );
}
const Pn = {
  regular: /* @__PURE__ */ a("path", { d: "M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z" })
};
function Fr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Pn[t]
    }
  );
}
const Bn = {
  regular: /* @__PURE__ */ a("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" })
};
function Dr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Bn[t]
    }
  );
}
const Mn = {
  regular: /* @__PURE__ */ a("path", { d: "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z" })
};
function Lr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Mn[t]
    }
  );
}
const Zn = {
  regular: /* @__PURE__ */ a("path", { d: "M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9ZM164,96a36,36,0,0,0,5.9-.48,36,36,0,1,0,28.22-47A36,36,0,1,0,164,96Zm60-12a20,20,0,1,1-20-20A20,20,0,0,1,224,84ZM164,40a20,20,0,0,1,19.25,14.61,36,36,0,0,0-15,24.93A20.42,20.42,0,0,1,164,80a20,20,0,0,1,0-40Z" })
};
function Er({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Zn[t]
    }
  );
}
const Cn = {
  regular: /* @__PURE__ */ a("path", { d: "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" })
};
function Rr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Cn[t]
    }
  );
}
const Tn = {
  regular: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function Or({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Tn[t]
    }
  );
}
const jn = {
  regular: /* @__PURE__ */ a("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" })
};
function zr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: jn[t]
    }
  );
}
const $n = {
  regular: /* @__PURE__ */ a("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function Yr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: $n[t]
    }
  );
}
const Vn = {
  regular: /* @__PURE__ */ a("path", { d: "M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z" })
};
function qr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Vn[t]
    }
  );
}
const In = {
  regular: /* @__PURE__ */ a("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" })
};
function Gr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: In[t]
    }
  );
}
const Fn = {
  regular: /* @__PURE__ */ a("path", { d: "M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z" })
};
function _r({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Fn[t]
    }
  );
}
const Dn = {
  regular: /* @__PURE__ */ a("path", { d: "M216,40H68.53a16.08,16.08,0,0,0-13.72,7.77L9.14,123.88a8,8,0,0,0,0,8.24l45.67,76.11A16.08,16.08,0,0,0,68.53,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM61.67,204.12,68.53,200h0ZM216,200H68.53l-43.2-72,43.2-72H216ZM106.34,146.34,124.69,128l-18.35-18.34a8,8,0,0,1,11.32-11.32L136,116.69l18.34-18.35a8,8,0,0,1,11.32,11.32L147.31,128l18.35,18.34a8,8,0,0,1-11.32,11.32L136,139.31l-18.34,18.35a8,8,0,0,1-11.32-11.32Z" })
};
function Ln({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Dn[t]
    }
  );
}
const En = {
  regular: /* @__PURE__ */ a("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" })
};
function Rn({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: En[t]
    }
  );
}
const On = {
  regular: /* @__PURE__ */ a("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" })
};
function zn({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: On[t]
    }
  );
}
const Yn = {
  regular: /* @__PURE__ */ a("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function Xe({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Yn[t]
    }
  );
}
const qn = {
  regular: /* @__PURE__ */ a("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" })
};
function Gn({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: qn[t]
    }
  );
}
const _n = {
  regular: /* @__PURE__ */ a("path", { d: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z" })
};
function Qr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: _n[t]
    }
  );
}
const Qn = {
  regular: /* @__PURE__ */ a("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" })
};
function Wr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Qn[t]
    }
  );
}
const Wn = {
  regular: /* @__PURE__ */ a("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" })
};
function Ur({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Wn[t]
    }
  );
}
const Un = {
  regular: /* @__PURE__ */ a("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" })
};
function Kr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Un[t]
    }
  );
}
const Kn = {
  regular: /* @__PURE__ */ a("path", { d: "M197.66,69.66,83.31,184H168a8,8,0,0,1,0,16H64a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v84.69L186.34,58.34a8,8,0,0,1,11.32,11.32Z" })
};
function Xr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Kn[t]
    }
  );
}
const Xn = {
  regular: /* @__PURE__ */ a("path", { d: "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" })
};
function Jr({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Xn[t]
    }
  );
}
const Jn = {
  regular: /* @__PURE__ */ a("path", { d: "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" })
};
function ei({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: Jn[t]
    }
  );
}
const ea = {
  regular: /* @__PURE__ */ a("path", { d: "M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" })
};
function ti({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: ea[t]
    }
  );
}
const ta = {
  regular: /* @__PURE__ */ a("path", { d: "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" })
};
function ni({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: ta[t]
    }
  );
}
const na = {
  regular: /* @__PURE__ */ a("path", { d: "M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z" })
};
function ai({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: na[t]
    }
  );
}
const aa = {
  regular: /* @__PURE__ */ a("path", { d: "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z" })
};
function ri({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: aa[t]
    }
  );
}
const ra = {
  regular: /* @__PURE__ */ a("path", { d: "M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" })
};
function ii({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: ra[t]
    }
  );
}
const ia = {
  regular: /* @__PURE__ */ a("path", { d: "M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function si({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: ia[t]
    }
  );
}
const sa = {
  regular: /* @__PURE__ */ a("path", { d: "M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function oi({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: sa[t]
    }
  );
}
const oa = {
  regular: /* @__PURE__ */ a("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" })
};
function di({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: oa[t]
    }
  );
}
const da = {
  regular: /* @__PURE__ */ a("path", { d: "M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" })
};
function li({
  size: e = 20,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: da[t]
    }
  );
}
const la = {
  regular: /* @__PURE__ */ a("path", { d: "M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z" })
};
function ci({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: la[t]
    }
  );
}
const ca = {
  regular: /* @__PURE__ */ a("path", { d: "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z" })
};
function mi({
  size: e = 24,
  weight: t = "regular",
  className: n,
  ...r
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
      ...r,
      children: ca[t]
    }
  );
}
const ma = {
  bold: /* @__PURE__ */ a("path", { d: "M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z" })
};
function ui({
  size: e = 14,
  weight: t = "bold",
  className: n,
  ...r
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
      ...r,
      children: ma[t]
    }
  );
}
const hi = ["nav-delivery", "back", "forward", "transfer", "movement-in", "movement-out", "send"];
function pi({
  value: e,
  flow: t,
  debt: n,
  size: r = "md",
  state: i = "idle",
  disabled: s = !1,
  className: d,
  id: o,
  style: c,
  ref: l,
  ...m
}) {
  const { hidden: u } = W(), p = u && e !== null && e !== void 0, h = xe(e, { flow: t, debt: n, hidden: p, texts: V() }), b = ["mds-money", `mds-money--${r}`, r === "lg" ? "mds-number-lg" : "", s ? "mds-money--disabled" : "", d].filter(Boolean).join(" ");
  return i === "loading" ? /* @__PURE__ */ a("span", { ref: l, id: o, style: c, className: b, "aria-busy": "true", ...m, children: /* @__PURE__ */ a("span", { className: "mds-money-skeleton", "aria-hidden": "true" }) }) : /* @__PURE__ */ g("span", { ref: l, id: o, style: c, className: b, ...m, children: [
    /* @__PURE__ */ g("span", { className: "mds-money-visual", "aria-hidden": "true", children: [
      h.debtWord ? /* @__PURE__ */ a("span", { className: "mds-money-debt", children: h.debtWord }) : null,
      h.missing ? /* @__PURE__ */ a("span", { className: "mds-money-missing", children: V().missingGlyph }) : /* @__PURE__ */ g(U, { children: [
        /* @__PURE__ */ a("bdi", { className: "mds-money-value", dir: "ltr", children: h.hidden ? V().hiddenGlyph : /* @__PURE__ */ g(U, { children: [
          /* @__PURE__ */ g("span", { className: "mds-money-integer", children: [
            h.sign,
            h.int
          ] }),
          h.frac ? /* @__PURE__ */ a("span", { className: "mds-money-fraction", children: h.frac }) : null
        ] }) }),
        /* @__PURE__ */ a("span", { className: "mds-money-unit", children: h.unit })
      ] })
    ] }, p ? "hidden" : "shown"),
    /* @__PURE__ */ a("span", { className: "mds-visually-hidden", children: h.aria })
  ] });
}
const fi = [
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
function ua({
  onChange: e,
  disabled: t = !1,
  density: n = "regular",
  className: r,
  id: i,
  style: s,
  ref: d,
  ...o
}) {
  const { hidden: c, visible: l } = W(), m = c ? Ot : Et, u = f(c ? "button.showAmounts" : "button.hideAmounts"), p = [
    "mds-amount-visibility-toggle",
    n === "large" ? "mds-amount-visibility-toggle--large" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      ref: d,
      id: i,
      style: s,
      ...o,
      type: "button",
      className: p,
      "aria-label": u,
      disabled: t,
      onClick: () => e?.(!l),
      children: /* @__PURE__ */ a(m, { size: 24 })
    }
  );
}
const gi = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "amountsShown",
  "amountsHidden"
];
function bi({
  label: e,
  caption: t,
  selected: n = !1,
  onChange: r,
  disabled: i = !1,
  state: s = "idle",
  className: d,
  id: o,
  style: c,
  ref: l,
  "aria-label": m,
  ...u
}) {
  const p = [
    // .mds-control-row (base.css): the shared row-plain anatomy; the box
    // aligns to the FIRST text line, so the alignment overrides to start.
    "mds-control-row",
    "mds-checkbox",
    n ? "mds-checkbox--selected" : "",
    i ? "mds-checkbox--disabled" : "",
    s === "error" ? "mds-checkbox--error" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("label", { ref: l, id: o, style: c, className: p, ...u, children: [
    /* @__PURE__ */ a(
      "input",
      {
        type: "checkbox",
        className: "mds-checkbox-input mds-sr-input",
        checked: n,
        disabled: i,
        onChange: (h) => r?.(h.target.checked),
        "aria-label": m,
        "aria-invalid": s === "error" || void 0
      }
    ),
    /* @__PURE__ */ a("span", { className: "mds-checkbox-box", "aria-hidden": "true", children: /* @__PURE__ */ a(He, { size: 14 }) }),
    /* @__PURE__ */ g("span", { className: "mds-checkbox-text mds-control-text", children: [
      /* @__PURE__ */ a("span", { className: "mds-checkbox-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ a("span", { className: "mds-checkbox-caption mds-type-caption", children: t }) : null
    ] }),
    s === "error" ? /* @__PURE__ */ a("span", { className: "mds-checkbox-error mds-type-caption", children: f("checkbox.tickThis") }) : null
  ] });
}
const ki = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function xi({
  label: e,
  items: t,
  value: n,
  onChange: r,
  disabled: i = !1,
  state: s = "idle",
  className: d,
  id: o,
  style: c,
  ref: l,
  ...m
}) {
  const u = Ne(), p = [
    "mds-radio",
    i ? "mds-radio--disabled" : "",
    s === "error" ? "mds-radio--error" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("div", { ref: l, id: o, style: c, className: p, ...m, children: [
    /* @__PURE__ */ a("span", { className: "mds-radio-label mds-type-label", children: e }),
    /* @__PURE__ */ a("div", { className: "mds-radio-surface", role: "radiogroup", "aria-label": e, children: t.map((h) => {
      const b = h.value === n;
      return /* @__PURE__ */ g("label", { className: "mds-control-row mds-radio-row", children: [
        /* @__PURE__ */ a(
          "input",
          {
            type: "radio",
            className: "mds-radio-input mds-sr-input",
            name: u,
            checked: b,
            disabled: i || h.disabled,
            onChange: () => r?.(h.value)
          }
        ),
        /* @__PURE__ */ a("span", { className: "mds-radio-circle", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "mds-radio-dot" }) }),
        /* @__PURE__ */ g("span", { className: "mds-radio-text mds-control-text", children: [
          /* @__PURE__ */ a("span", { className: "mds-radio-row-label mds-type-body", children: h.label }),
          h.caption ? /* @__PURE__ */ a("span", { className: "mds-radio-caption mds-type-caption", children: h.caption }) : null
        ] })
      ] }, h.value);
    }) }),
    s === "error" ? /* @__PURE__ */ a("span", { className: "mds-radio-error mds-type-caption", children: f("radio.choose").replace("{label}", e) }) : null
  ] });
}
const yi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function vi({
  label: e,
  caption: t,
  selected: n = !1,
  onChange: r,
  disabled: i = !1,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const m = [
    // .mds-control-row (base.css): the whole row is the switch's press zone.
    "mds-control-row",
    "mds-toggle",
    n ? "mds-toggle--selected" : "",
    i ? "mds-toggle--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("label", { ref: c, id: d, style: o, className: m, ...l, children: [
    /* @__PURE__ */ a(
      "input",
      {
        type: "checkbox",
        className: "mds-toggle-input mds-sr-input",
        role: "switch",
        checked: n,
        disabled: i,
        onChange: (u) => r?.(u.target.checked),
        "aria-checked": n
      }
    ),
    /* @__PURE__ */ g("span", { className: "mds-toggle-text mds-control-text", children: [
      /* @__PURE__ */ a("span", { className: "mds-toggle-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ a("span", { className: "mds-toggle-caption mds-type-caption", children: t }) : null
    ] }),
    /* @__PURE__ */ a("span", { className: "mds-toggle-switch", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "mds-toggle-track", children: /* @__PURE__ */ a("span", { className: "mds-toggle-thumb", children: /* @__PURE__ */ a(He, { size: 14 }) }) }) })
  ] });
}
const wi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled"
];
function Ni({
  label: e,
  placeholder: t,
  value: n = "",
  onChange: r,
  disabled: i = !1,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const m = n.length > 0, u = [
    "mds-search-field",
    i ? "mds-search-field--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("div", { ref: c, id: d, style: o, className: u, ...l, children: [
    /* @__PURE__ */ a(Kt, { size: 20 }),
    /* @__PURE__ */ a(
      "input",
      {
        type: "search",
        className: "mds-search-field-input",
        role: "searchbox",
        "aria-label": e,
        placeholder: t,
        value: n,
        disabled: i,
        enterKeyHint: "search",
        onChange: (p) => r?.(p.target.value)
      }
    ),
    m ? /* @__PURE__ */ a(
      ha,
      {
        onClear: () => {
          r?.("");
        }
      }
    ) : null
  ] });
}
function ha({ onClear: e }) {
  const { isPressed: t, pressProps: n } = A({ onPress: e });
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: ["mds-search-field-clear", t ? "mds-search-field-clear--pressed" : ""].filter(Boolean).join(" "),
      "data-ds-exempt": "",
      "aria-label": f("sr.clearSearch"),
      ...n,
      children: /* @__PURE__ */ a(ue, { size: 20 })
    }
  );
}
const Ai = [
  "default",
  "focused",
  "disabled",
  "withText"
];
function Hi({
  label: e,
  caption: t,
  value: n = "",
  onChange: r,
  placeholder: i,
  state: s = "idle",
  disabled: d = !1,
  optional: o = !1,
  className: c,
  id: l,
  style: m,
  ref: u,
  ...p
}) {
  const h = Ne(), b = ee(() => `${h}-error`, [h]), v = [
    "mds-field",
    "mds-text-area",
    s === "error" ? "mds-text-area--error" : "",
    d ? "mds-text-area--disabled mds-field--disabled" : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("div", { id: l, style: m, className: v, ...p, children: [
    /* @__PURE__ */ g("label", { className: "mds-text-area-label mds-type-label", htmlFor: l ?? h, children: [
      e,
      o ? /* @__PURE__ */ a("span", { className: "mds-text-area-optional mds-type-caption", children: f("field.optional") }) : null
    ] }),
    /* @__PURE__ */ a(
      "textarea",
      {
        ref: u,
        id: l ?? h,
        className: "mds-text-area-input mds-field-input",
        rows: 1,
        value: n,
        disabled: d,
        placeholder: i,
        "aria-multiline": "true",
        "aria-invalid": s === "error" || void 0,
        "aria-describedby": s === "error" ? b : void 0,
        enterKeyHint: "enter",
        onChange: (k) => r?.(k.target.value),
        onInput: (k) => {
          const y = k.currentTarget;
          y.style.height = "auto", y.style.height = `${y.scrollHeight}px`;
        }
      }
    ),
    s === "error" ? /* @__PURE__ */ g("span", { id: b, className: "mds-text-area-help mds-type-caption", children: [
      /* @__PURE__ */ a(en, { size: 16 }),
      /* @__PURE__ */ a("span", { children: t })
    ] }) : t ? /* @__PURE__ */ a("span", { className: "mds-text-area-help mds-type-caption", children: /* @__PURE__ */ a("span", { children: t }) }) : null
  ] });
}
const Si = [
  "default",
  "focused",
  "error",
  "disabled",
  "grown"
], je = 1632, pa = 1641, fa = 1643;
function ga(e) {
  let t = "", n = !1;
  for (const i of e) {
    const s = i.codePointAt(0);
    if (s >= je && s <= pa) {
      const d = String(s - je);
      t = r(t, d);
      continue;
    }
    if (i >= "0" && i <= "9") {
      t = r(t, i);
      continue;
    }
    if ((s === fa || i === "." || i === ",") && !n) {
      t === "" && (t = "0"), t += ".", n = !0;
      continue;
    }
  }
  return t;
  function r(i, s) {
    return i.includes(".") && i.length - i.indexOf(".") - 1 >= 3 || i === "0" && s === "0" ? i : i === "0" ? s : i + s;
  }
}
function Pi({
  label: e,
  caption: t,
  value: n = "",
  onChange: r,
  disabled: i = !1,
  state: s = "idle",
  draft: d = !1,
  className: o,
  id: c,
  style: l,
  ref: m,
  useSystemKeyboard: u = !0,
  ...p
}) {
  const [h, b] = M(!1), v = [
    "mds-amount-field",
    i ? "mds-amount-field--disabled" : "",
    s === "error" ? "mds-amount-field--error" : "",
    d ? "mds-amount-field--draft" : "",
    o
  ].filter(Boolean).join(" "), k = h || n === "" ? n : xe(n, { texts: V() }).int + (n.includes(".") ? xe(n, { texts: V() }).frac : "");
  return /* @__PURE__ */ g("div", { id: c, style: l, className: v, ...p, children: [
    /* @__PURE__ */ a("span", { className: "mds-amount-field-label mds-type-label", children: e }),
    /* @__PURE__ */ g("div", { className: "mds-amount-field-box", children: [
      /* @__PURE__ */ a(
        "input",
        {
          ref: m,
          className: [
            "mds-amount-field-input",
            // ADDENDUM 2.1: past 13 characters the type drops in ONE step to
            // number-lg — the shared .mds-number-lg class (base.css), exactly
            // the Money/HeroSurface drop (23.20).
            k.length > 13 ? "mds-number-lg" : ""
          ].filter(Boolean).join(" "),
          inputMode: u ? "decimal" : "none",
          enterKeyHint: "next",
          value: k,
          disabled: i,
          "aria-label": e,
          "aria-invalid": s === "error" || void 0,
          onFocus: () => b(!0),
          onBlur: () => b(!1),
          "data-long": k.length > 13 ? "true" : void 0,
          onChange: (y) => r?.(ga(y.target.value))
        }
      ),
      /* @__PURE__ */ a("span", { className: "mds-amount-field-unit", children: V().unit })
    ] }),
    s === "error" && t ? /* @__PURE__ */ a("span", { className: "mds-amount-field-help", children: t }) : t ? /* @__PURE__ */ a("span", { className: "mds-amount-field-help", children: t }) : null
  ] });
}
const Bi = [
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
function L({ value: e, label: t, style: n, disabled: r, onPress: i }) {
  const { isPressed: s, pressProps: d } = A({ onPress: i, disabled: r }), o = [
    "mds-keypad-key",
    "mds-keypad-key--glyph",
    s ? "mds-keypad-key--pressed" : "",
    r ? "mds-keypad-key--disabled" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: o,
      style: n,
      "aria-label": f(t),
      "aria-disabled": r || void 0,
      disabled: r,
      ...d,
      children: /* @__PURE__ */ a("span", { className: "mds-keypad-key-label mds-number-lg", children: e })
    }
  );
}
function ba({ style: e, disabled: t, onPress: n, onLongPress: r }) {
  const { isPressed: i, pressProps: s } = A({ onPress: n, onLongPress: r, disabled: t }), d = [
    "mds-keypad-key",
    "mds-keypad-key--backspace",
    i ? "mds-keypad-key--pressed" : "",
    t ? "mds-keypad-key--disabled" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: d,
      style: e,
      "aria-label": f("keypad.srBackspace"),
      "aria-disabled": t || void 0,
      disabled: t,
      ...s,
      children: /* @__PURE__ */ a(Ln, { size: 24 })
    }
  );
}
function Mi({
  value: e = "",
  onChange: t,
  onLongPress: n,
  disabled: r = !1,
  className: i,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = e.includes("."), m = l ? (e.split(".")[1] ?? "").length : 0, u = l && m >= 3, p = ["mds-keypad", r ? "mds-keypad--disabled" : "", i].filter(Boolean).join(" "), h = (b) => r || b === "." && l || b !== "." && u;
  return /* @__PURE__ */ g(
    "div",
    {
      ref: o,
      id: s,
      style: d,
      className: p,
      dir: "ltr",
      role: "group",
      "aria-label": f("keypad.srGroup"),
      "data-value": e,
      ...c,
      children: [
        /* @__PURE__ */ a(L, { value: "1", label: D[1], style: { gridArea: "1 / 1 / 2 / 2" }, disabled: h("1"), onPress: () => t?.("1") }),
        /* @__PURE__ */ a(L, { value: "2", label: D[2], style: { gridArea: "1 / 2 / 2 / 3" }, disabled: h("2"), onPress: () => t?.("2") }),
        /* @__PURE__ */ a(L, { value: "3", label: D[3], style: { gridArea: "1 / 3 / 2 / 4" }, disabled: h("3"), onPress: () => t?.("3") }),
        /* @__PURE__ */ a(
          ba,
          {
            style: { gridArea: "1 / 4 / 3 / 5" },
            disabled: r,
            onPress: () => t?.("backspace"),
            onLongPress: () => n?.()
          }
        ),
        /* @__PURE__ */ a(L, { value: "4", label: D[4], style: { gridArea: "2 / 1 / 3 / 2" }, disabled: h("4"), onPress: () => t?.("4") }),
        /* @__PURE__ */ a(L, { value: "5", label: D[5], style: { gridArea: "2 / 2 / 3 / 3" }, disabled: h("5"), onPress: () => t?.("5") }),
        /* @__PURE__ */ a(L, { value: "6", label: D[6], style: { gridArea: "2 / 3 / 3 / 4" }, disabled: h("6"), onPress: () => t?.("6") }),
        /* @__PURE__ */ a(L, { value: "7", label: D[7], style: { gridArea: "3 / 1 / 4 / 2" }, disabled: h("7"), onPress: () => t?.("7") }),
        /* @__PURE__ */ a(L, { value: "8", label: D[8], style: { gridArea: "3 / 2 / 4 / 3" }, disabled: h("8"), onPress: () => t?.("8") }),
        /* @__PURE__ */ a(L, { value: "9", label: D[9], style: { gridArea: "3 / 3 / 4 / 4" }, disabled: h("9"), onPress: () => t?.("9") }),
        /* @__PURE__ */ a(L, { value: ".", label: D["."], style: { gridArea: "3 / 4 / 4 / 5" }, disabled: h("."), onPress: () => t?.(".") }),
        /* @__PURE__ */ a(L, { value: "0", label: D[0], style: { gridArea: "4 / 1 / 5 / 3" }, disabled: h("0"), onPress: () => t?.("0") }),
        /* @__PURE__ */ a(L, { value: "000", label: D["000"], style: { gridArea: "4 / 3 / 5 / 5" }, disabled: h("000"), onPress: () => t?.("000") })
      ]
    }
  );
}
const Zi = [
  "default",
  "pressed",
  "disabled",
  "decimal-disabled",
  "fraction-full"
], _ = [
  { value: "in", word: "movement.in" },
  { value: "out", word: "movement.out" },
  { value: "transfer", word: "movement.transfer" }
];
function Ci({
  value: e,
  onChange: t,
  disabled: n = !1,
  state: r = "idle",
  className: i,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = [
    "mds-movement-type",
    r === "error" ? "mds-movement-type--error" : "",
    i
  ].filter(Boolean).join(" "), m = (u, p) => {
    const h = u === void 0 ? -1 : _.findIndex((b) => b.value === u);
    return _[(h + p + _.length) % _.length] ?? _[0];
  };
  return /* @__PURE__ */ g(
    "div",
    {
      ref: o,
      id: s,
      style: d,
      className: l,
      role: "radiogroup",
      "aria-label": f("movementType.srGroup"),
      "data-value": e ?? "",
      ...c,
      children: [
        /* @__PURE__ */ a("div", { className: "mds-segmented", children: _.map((u) => /* @__PURE__ */ a(
          ka,
          {
            segment: u,
            selected: u.value === e,
            disabled: n,
            onChange: t,
            walk: m
          },
          u.value
        )) }),
        r === "error" ? /* @__PURE__ */ a("span", { className: "mds-movement-type-error mds-type-caption", children: f("movementType.choose") }) : null
      ]
    }
  );
}
function ka({
  segment: e,
  selected: t,
  disabled: n,
  onChange: r,
  walk: i
}) {
  const { isPressed: s, pressProps: d } = A({ onPress: () => r?.(e.value), disabled: n }), o = [
    "mds-segmented-segment",
    t ? "mds-segmented-segment--selected" : "",
    s ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      role: "radio",
      className: o,
      "aria-checked": t,
      "aria-label": f(e.word),
      disabled: n,
      "data-ds-exempt": n ? void 0 : "",
      onKeyDown: (c) => {
        const l = c.key === "ArrowLeft" || c.key === "ArrowDown" ? 1 : c.key === "ArrowRight" || c.key === "ArrowUp" ? -1 : 0;
        if (l === 0) return;
        c.preventDefault();
        const m = i(e.value, l);
        r?.(m.value);
        const u = c.currentTarget.parentElement;
        (u ? Array.from(u.querySelectorAll('[role="radio"]')) : [])[_.findIndex((h) => h.value === m.value)]?.focus();
      },
      ...d,
      children: /* @__PURE__ */ a("span", { className: "mds-segmented-segment-label", children: f(e.word) })
    }
  );
}
const Ti = [
  "default",
  "selected",
  "pressed",
  "disabled",
  "error"
], xa = ze("motion.response-max-ms");
function ya({
  label: e,
  value: t,
  onChange: n,
  min: r = 0,
  max: i,
  step: s = 1,
  disabled: d = !1,
  className: o,
  id: c,
  style: l,
  ref: m,
  ...u
}) {
  const p = t ?? r, h = d || p <= r, b = d || i !== void 0 && p >= i, [v, k] = M(null), y = v ?? String(p), x = Z(null), w = Z(() => {
  }), H = Z(t), P = R(() => {
    x.current !== null && (clearInterval(x.current), x.current = null);
  }, []), N = R(
    (T) => {
      k(null);
      const F = (H.current ?? r) + T * s;
      F < r || i !== void 0 && F > i || n?.(F);
    },
    [r, i, s, n]
  );
  O(() => {
    w.current = N, H.current = t;
  });
  const I = R((T) => {
    P(), w.current(T), x.current = setInterval(() => w.current(T), xa);
  }, [P]);
  O(() => P, [P]);
  const B = ["mds-quantity-stepper", d ? "mds-quantity-stepper--disabled" : "", o].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "div",
    {
      ref: m,
      id: c,
      style: l,
      className: B,
      dir: "ltr",
      role: "group",
      "aria-label": e,
      "data-value": p,
      ...u,
      children: [
        /* @__PURE__ */ a(
          $e,
          {
            icon: /* @__PURE__ */ a(zn, { size: 20 }),
            name: f("quantity.decrease"),
            disabled: h,
            step: () => N(-1),
            startRepeat: () => I(-1),
            stopRepeat: P
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            type: "text",
            className: "mds-quantity-stepper-input mds-type-amount-row",
            inputMode: "numeric",
            "aria-label": e,
            value: y,
            disabled: d,
            onFocus: () => k(String(p)),
            onChange: (T) => {
              const F = T.currentTarget.value;
              k(F);
              const q = Number.parseInt(F, 10);
              Number.isFinite(q) && q >= r && (i === void 0 || q <= i) && n?.(q);
            },
            onBlur: () => {
              const T = Number.parseInt(v ?? "", 10), F = Number.isFinite(T) ? Math.min(Math.max(T, r), i ?? Number.MAX_SAFE_INTEGER) : p, q = Math.round(F / s) * s, se = Math.min(Math.max(q, r), i ?? Number.MAX_SAFE_INTEGER);
              se !== p && n?.(se), k(null);
            }
          }
        ),
        /* @__PURE__ */ a(
          $e,
          {
            icon: /* @__PURE__ */ a(Rn, { size: 20 }),
            name: f("quantity.increase"),
            disabled: b,
            step: () => N(1),
            startRepeat: () => I(1),
            stopRepeat: P
          }
        )
      ]
    }
  );
}
function $e({
  icon: e,
  name: t,
  disabled: n,
  step: r,
  startRepeat: i,
  stopRepeat: s
}) {
  const { isPressed: d, pressProps: o } = A({
    onPress: r,
    onLongPress: i,
    disabled: n
  }), c = [
    "mds-quantity-stepper-button",
    d ? "mds-quantity-stepper-button--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: c,
      "aria-label": t,
      "aria-disabled": n || void 0,
      disabled: n,
      onKeyDown: (l) => {
        (l.key === " " || l.key === "Enter") && !l.repeat && (l.preventDefault(), i());
      },
      onKeyUp: (l) => {
        (l.key === " " || l.key === "Enter") && s();
      },
      ...o,
      onPointerUp: (l) => {
        s(), o.onPointerUp(l);
      },
      onPointerCancel: (l) => {
        s(), o.onPointerCancel(l);
      },
      children: e
    }
  );
}
const ji = [
  "default",
  "pressed",
  "at-min",
  "at-max",
  "typing",
  "disabled"
], va = {
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
  const n = Number.parseInt(t[0], 10), r = Number.parseInt(t[1], 10), i = Number.parseInt(t[2], 10);
  if (!(!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(i)) && !(r < 1 || r > 12 || n < 1 || n > Pe(i, r)))
    return { year: i, month: r, day: n };
}
function Pe(e, t) {
  return new Date(Date.UTC(e, t, 0)).getUTCDate();
}
function C(e) {
  return `${ne(e.day)}/${ne(e.month)}/${e.year}`;
}
function j(e) {
  return Math.floor(Date.UTC(e.year, e.month - 1, e.day) / 864e5);
}
function Q(e) {
  const t = new Date(e * 864e5);
  return { year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() };
}
function E(e) {
  const t = Y(e);
  return t ? t.year * 1e4 + t.month * 100 + t.day : Number.NaN;
}
function ne(e) {
  return e < 10 ? `0${e}` : String(e);
}
function wa(e) {
  return new Date(Date.UTC(e.year, e.month - 1, e.day)).getUTCDay();
}
function Je(e, t) {
  const n = (wa(e) - t + 7) % 7;
  return Q(j(e) - n);
}
function et(e) {
  return { year: e.year, month: e.month, day: 1 };
}
function Na(e) {
  return { year: e.year, month: e.month, day: Pe(e.year, e.month) };
}
function he(e, t) {
  const n = Y(e.start);
  if (!n) return e;
  if (e.size === "week")
    return { ...e, start: C(Je(n, t)) };
  if (e.size === "month")
    return { ...e, start: C(et(n)) };
  if (e.size === "custom") {
    const r = Y(e.end ?? e.start) ?? n, [i, s] = j(n) <= j(r) ? [n, r] : [r, n];
    return { size: "custom", start: C(i), end: C(s) };
  }
  return { ...e, start: C(n) };
}
function oe(e) {
  const t = Y(e.start);
  return t ? e.size === "day" ? t : e.size === "week" ? Q(j(t) + 6) : e.size === "month" ? Na(t) : Y(e.end ?? e.start) ?? t : re();
}
function Ve(e, t, n) {
  const r = he(e, t), i = Y(r.start);
  if (!i) return r;
  if (r.size === "month") {
    const s = i.month + n, d = s < 1 ? { year: i.year - 1, month: 12, day: 1 } : s > 12 ? { year: i.year + 1, month: 1, day: 1 } : { year: i.year, month: s, day: 1 };
    return { size: "month", start: C(d) };
  }
  if (r.size === "week")
    return { size: "week", start: C(Q(j(i) + n * 7)) };
  if (r.size === "custom") {
    const s = j(oe(r)) - j(i) + 1, d = n * s;
    return {
      size: "custom",
      start: C(Q(j(i) + d)),
      end: C(Q(j(oe(r)) + d))
    };
  }
  return { size: "day", start: C(Q(j(i) + n)) };
}
function Aa(e, t, n) {
  return e === "month" ? { size: "month", start: C(et(n)) } : e === "week" ? { size: "week", start: C(Je(n, t)) } : { size: "day", start: C(n) };
}
function Ha(e, t) {
  return E(e.start) === E(t.start) && e.size === t.size;
}
function re() {
  const e = /* @__PURE__ */ new Date();
  return { year: e.getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
}
function de(e) {
  return f(va[e]);
}
function le(e) {
  return `${e.day} ${de(e.month)}`;
}
function tt(e, t, n = re()) {
  const r = he(e, t), i = Y(r.start);
  if (!i) return { text: "", spoken: "" };
  const s = oe(r);
  return r.size === "month" ? {
    text: `${ne(i.month)}/${i.year}`,
    spoken: `${de(i.month)} ${i.year}`
  } : r.size === "week" ? {
    text: `${Ie(i)} – ${Ie(s)}`,
    spoken: `${le(i)} ${f("period.spokenTo")} ${Fe(s, i)}`
  } : r.size === "custom" ? {
    text: `${C(i)} – ${C(s)}`,
    spoken: `${le(i)} ${f("period.spokenTo")} ${Fe(s, i)}`
  } : {
    text: j(i) === j(n) ? f("dateWord.today") : C(i),
    spoken: `${i.day} ${de(i.month)} ${i.year}`
  };
}
function Ie(e) {
  return `${ne(e.day)}/${ne(e.month)}`;
}
function Fe(e, t) {
  return e.year !== t.year ? `${le(e)} ${e.year} ${t.year}` : e.month !== t.month ? `${le(e)} ${e.year}` : `${e.day} ${de(e.month)} ${e.year}`;
}
function K({
  label: e,
  onPress: t,
  onLongPress: n,
  disabled: r = !1,
  density: i = "regular",
  className: s,
  id: d,
  style: o,
  ref: c,
  children: l,
  ...m
}) {
  const { isPressed: u, pressProps: p } = A({ onPress: t, onLongPress: n, disabled: r }), h = [
    "mds-icon-button",
    i === "large" ? "mds-icon-button--large" : "",
    u ? "mds-icon-button--pressed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      ref: c,
      id: d,
      style: o,
      ...m,
      ...p,
      type: "button",
      className: h,
      "aria-label": e,
      disabled: r,
      children: l
    }
  );
}
const $i = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "large"
], ye = [
  "day.0",
  "day.1",
  "day.2",
  "day.3",
  "day.4",
  "day.5",
  "day.6"
], nt = {
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
function Sa({
  month: e,
  value: t,
  items: n,
  min: r,
  max: i,
  weekStart: s = 0,
  mode: d = "single",
  onChange: o,
  className: c,
  id: l,
  style: m,
  ref: u,
  ...p
}) {
  const h = re(), b = ee(() => {
    const N = e.split("/");
    if (N.length === 2) {
      const I = Number.parseInt(N[1], 10), B = Number.parseInt(N[0], 10);
      if (Number.isFinite(I) && Number.isFinite(B) && B >= 1 && B <= 12)
        return { year: I, month: B };
    }
    return { year: h.year, month: h.month };
  }, [e, h.year, h.month]), v = ee(
    () => Ba(b.year, b.month, s),
    [b.year, b.month, s]
  ), k = d === "single" && typeof t == "string" ? t : void 0, y = d === "range" && t !== void 0 && typeof t != "string" ? t : void 0, x = v.flat().find((N) => N !== null)?.date, w = ["mds-month-grid", `mds-month-grid--${d}`, c].filter(Boolean).join(" "), H = f("month.srGrid", { month: f(nt[b.month]), year: b.year }), P = (N) => {
    if (d === "single") {
      o?.(N.date);
      return;
    }
    if (d === "range") {
      if (y === void 0 || y.start === void 0 || y.end !== void 0) {
        o?.({ start: N.date });
        return;
      }
      if (E(N.date) <= E(y.start)) {
        o?.({ start: N.date });
        return;
      }
      o?.({ start: y.start, end: N.date });
    }
  };
  return /* @__PURE__ */ g(
    "div",
    {
      ref: u,
      id: l,
      style: m,
      className: w,
      role: "grid",
      "aria-label": H,
      "data-month": `${String(b.month).padStart(2, "0")}/${b.year}`,
      onKeyDown: d === "view" ? void 0 : (N) => Ca(N),
      ...p,
      children: [
        /* @__PURE__ */ a("div", { className: "mds-month-days", role: "row", children: ye.map((N, I) => /* @__PURE__ */ a("span", { className: "mds-month-day-name mds-type-micro", role: "columnheader", children: f(ye[(I + s) % 7]) }, I)) }),
        v.map((N, I) => /* @__PURE__ */ a("div", { className: "mds-month-week", role: "row", children: N.map((B, T) => {
          if (!B)
            return /* @__PURE__ */ a("span", { className: "mds-month-cell mds-month-cell--empty", role: "gridcell" }, T);
          const F = B.date === x;
          return /* @__PURE__ */ a(
            Pa,
            {
              day: B,
              selected: k === B.date,
              rangeStart: y?.start === B.date,
              rangeEnd: y?.end === B.date,
              inRange: y?.start !== void 0 && y?.end !== void 0 && E(y.start) <= E(B.date) && E(B.date) <= E(y.end),
              count: n?.[B.date] ?? 0,
              disabled: r !== void 0 && E(B.date) < E(r) || i !== void 0 && E(B.date) > E(i),
              focusable: F,
              mode: d,
              isToday: j(B) === j(h),
              onPick: P
            },
            B.date
          );
        }) }, I))
      ]
    }
  );
}
function Pa({
  day: e,
  selected: t,
  rangeStart: n,
  rangeEnd: r,
  inRange: i,
  count: s,
  disabled: d,
  focusable: o,
  mode: c,
  isToday: l,
  onPick: m
}) {
  const u = c !== "view" && !d, { isPressed: p, pressProps: h } = A({
    onPress: () => m(e),
    disabled: !u
  }), b = Ma(e, l, s), v = [
    "mds-month-cell-button",
    t || n || r ? "mds-month-cell-button--selected" : "",
    i ? "mds-month-cell-button--in-range" : "",
    n ? "mds-month-cell-button--range-start" : "",
    r ? "mds-month-cell-button--range-end" : "",
    l ? "mds-month-cell-button--today" : "",
    p ? "mds-month-cell-button--pressed" : ""
  ].filter(Boolean).join(" "), k = /* @__PURE__ */ g("span", { className: s >= 1 ? "mds-month-dots" : "mds-month-dots mds-month-dots--empty", "aria-hidden": "true", children: [
    s >= 1 ? /* @__PURE__ */ a("span", { className: "mds-month-dot" }) : null,
    s >= 2 ? /* @__PURE__ */ a("span", { className: "mds-month-dot" }) : null,
    s >= 3 ? /* @__PURE__ */ a("span", { className: "mds-month-dot" }) : null
  ] }), y = /* @__PURE__ */ a("span", { className: "mds-month-mark", children: /* @__PURE__ */ a("span", { className: "mds-month-mark-number mds-type-body", children: e.day }) });
  return /* @__PURE__ */ a("span", { className: "mds-month-cell", role: "gridcell", "aria-selected": t || n || r || i ? !0 : void 0, children: c === "view" ? /* @__PURE__ */ g("span", { className: "mds-month-cell-static", "data-day": e.date, children: [
    y,
    k
  ] }) : /* @__PURE__ */ g(
    "button",
    {
      type: "button",
      className: v,
      "aria-label": b,
      disabled: d,
      tabIndex: o ? 0 : -1,
      "data-day": e.date,
      ...u ? h : {},
      children: [
        y,
        k
      ]
    }
  ) });
}
function Ba(e, t, n) {
  const r = Pe(e, t), i = (new Date(Date.UTC(e, t - 1, 1)).getUTCDay() - n + 7) % 7, s = [];
  for (let o = 0; o < i; o += 1) s.push(null);
  for (let o = 1; o <= r; o += 1)
    s.push({ year: e, month: t, day: o, date: C({ year: e, month: t, day: o }) });
  for (; s.length % 7 !== 0; ) s.push(null);
  const d = [];
  for (let o = 0; o < s.length; o += 7) d.push(s.slice(o, o + 7));
  return d;
}
function Ma(e, t, n) {
  let r = f("month.srCell", {
    day: e.day,
    month: f(nt[e.month]),
    weekday: f(ye[Za(e)])
  });
  return t && (r = f("month.srCellToday", { name: r, today: f("dateWord.today") })), n > 0 && (r = f("month.srCellCount", { name: r, counted: qe(n, Ye.dayItems) })), r;
}
function Za(e) {
  return new Date(Date.UTC(e.year, e.month - 1, e.day)).getUTCDay();
}
function Ca(e) {
  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) return;
  const t = document.activeElement;
  if (!t || !t.dataset.day) return;
  const n = Ta(t.dataset.day);
  if (!n) return;
  e.preventDefault();
  const r = e.key === "ArrowRight" ? -1 : e.key === "ArrowLeft" ? 1 : e.key === "ArrowUp" ? -7 : 7, i = C(Q(j(n) + r)), s = e.currentTarget.querySelector(`button[data-day="${i}"]`);
  s && !s.disabled && s.focus();
}
function Ta(e) {
  const t = e.split("/");
  if (t.length !== 3) return;
  const n = Number.parseInt(t[0], 10), r = Number.parseInt(t[1], 10), i = Number.parseInt(t[2], 10);
  if (!(!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(i)))
    return { year: i, month: r, day: n };
}
const Vi = [
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
function ae({
  variant: e = "primary",
  mode: t = "surface",
  size: n = "md",
  loading: r = !1,
  leading: i,
  trailing: s,
  onPress: d,
  onLongPress: o,
  disabled: c = !1,
  className: l,
  id: m,
  style: u,
  ref: p,
  children: h,
  ...b
}) {
  const { isPressed: v, pressProps: k } = A({
    onPress: d,
    onLongPress: o,
    disabled: c || r
  }), y = Qe(r), x = [
    "mds-button",
    `mds-button--${e}`,
    `mds-button--${n}`,
    t === "canvas" ? "mds-button--on-canvas" : "",
    v ? "mds-button--pressed" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "button",
    {
      ref: p,
      id: m,
      style: u,
      ...b,
      ...k,
      type: "button",
      className: x,
      disabled: c,
      "aria-busy": r || void 0,
      children: [
        y ? /* @__PURE__ */ a("span", { className: "mds-button-spinner", "aria-hidden": "true" }) : i ? /* @__PURE__ */ a("span", { className: "mds-button-icon", children: i }) : null,
        /* @__PURE__ */ a("span", { className: "mds-button-label", children: h }),
        s ? /* @__PURE__ */ a("span", { className: "mds-button-icon", children: s }) : null
      ]
    }
  );
}
const Ii = [
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
function Be({
  label: e,
  onPress: t,
  loading: n = !1,
  disabled: r = !1,
  caption: i,
  onRetry: s,
  leading: d = !0,
  trailing: o,
  className: c,
  id: l,
  style: m,
  ref: u,
  ...p
}) {
  const h = St(), b = h.keyboardHeight > 0 ? {
    bottom: `calc(${h.keyboardHeight}px + env(safe-area-inset-bottom))`
  } : void 0, v = ["mds-action-bar", d ? "mds-action-bar--more" : "", c].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "div",
    {
      ref: u,
      id: l,
      style: { ...b, ...m },
      className: v,
      role: "group",
      "aria-label": e,
      ...p,
      children: [
        i ? /* @__PURE__ */ a(ae, { variant: "text", onPress: s, className: "mds-action-bar-secondary", children: i }) : null,
        /* @__PURE__ */ a(
          ae,
          {
            variant: "primary",
            onPress: t,
            loading: n,
            disabled: r,
            leading: o,
            className: "mds-action-bar-primary",
            children: e
          }
        )
      ]
    }
  );
}
const Fi = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "loading",
  "contentMore",
  "scrolledToEnd",
  "keyboardOpen"
];
function at({
  leading: e,
  value: t,
  onChange: n,
  disabled: r = !1,
  label: i,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  return /* @__PURE__ */ a(
    "div",
    {
      ref: c,
      id: d,
      style: o,
      className: ["mds-segmented", s].filter(Boolean).join(" "),
      role: "group",
      "aria-label": i,
      ...l,
      children: e.map((m) => /* @__PURE__ */ a(
        ja,
        {
          segment: m,
          selected: m.value === t,
          disabled: r || m.disabled === !0,
          onChange: n
        },
        m.value
      ))
    }
  );
}
function ja({
  segment: e,
  selected: t,
  disabled: n,
  onChange: r
}) {
  const { isPressed: i, pressProps: s } = A({ onPress: () => r(e.value), disabled: n }), d = [
    "mds-segmented-segment",
    t ? "mds-segmented-segment--selected" : "",
    i ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "button",
    {
      type: "button",
      className: d,
      "aria-pressed": t === !0,
      disabled: n,
      "data-ds-exempt": n ? void 0 : "",
      ...s,
      children: [
        e.leading ? /* @__PURE__ */ a("span", { className: "mds-segmented-segment-icon", "aria-hidden": "true", children: e.leading }) : null,
        /* @__PURE__ */ a("span", { className: "mds-segmented-segment-label", children: e.label })
      ]
    }
  );
}
const Di = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "threeSegments",
  "fourSegments",
  "withIcon"
], ge = /* @__PURE__ */ new Set();
function ie({
  label: e,
  variant: t = "detail",
  children: n,
  onDismiss: r,
  className: i,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = Z(null), [m, u] = M(0), [p, h] = M(!1), [b, v] = M(!1), k = Z(0), y = Z(0), x = Z(0), w = Z(null), H = Z(r);
  O(() => {
    H.current = r;
  }, [r]);
  const P = R(() => {
    w.current?.focus?.(), H.current();
  }, []), [N] = M(() => /* @__PURE__ */ Symbol("sheet")), [I] = M(() => (ge.add(N), ge.size >= 2 ? 2 : 1));
  O(
    () => () => {
      ge.delete(N);
    },
    [N]
  );
  const B = () => {
    const S = l.current?.querySelector(".mds-sheet-panel");
    return S ? S.getBoundingClientRect().height * 0.3 : 0;
  }, T = R(() => {
    if (b) return;
    w.current = document.activeElement ?? null, v(!0), (typeof requestAnimationFrame == "function" ? requestAnimationFrame : ($) => setTimeout(() => $(performance.now()), 0))(() => {
      const $ = l.current?.querySelector(".mds-sheet-panel");
      if (!$) {
        P();
        return;
      }
      const z = getComputedStyle($).transitionDuration, Ce = z && z !== "0s" && z !== "";
      if ($.style.transform = "translateY(100%)", !Ce) {
        P();
        return;
      }
      const X = (ct) => {
        ct.propertyName === "transform" && ($.removeEventListener("transitionend", X), P());
      };
      $.addEventListener("transitionend", X);
    });
  }, [b, P]), F = (S) => {
    if (!p) return;
    const $ = performance.now(), z = $ - x.current;
    z > 0 && (k.current = (S.clientY - y.current) / z), y.current = S.clientY, x.current = $, u(Math.max(0, S.clientY - q.current));
  }, q = Z(0), se = (S) => {
    const $ = S.target, z = l.current?.querySelector(".mds-sheet-body");
    if (!(z?.contains($) && z && z.scrollTop > 0)) {
      if (b) {
        const X = l.current?.querySelector(".mds-sheet-panel");
        X && (X.style.transform = m ? `translateY(${m}px)` : ""), v(!1);
      }
      k.current = 0, y.current = S.clientY, x.current = performance.now(), h(!0), S.currentTarget.setPointerCapture?.(S.pointerId);
    }
  }, Ze = () => {
    if (!p) return;
    h(!1);
    const S = m > B(), $ = k.current > 0.6;
    S || $ ? T() : u(0);
  };
  O(() => {
    const S = ($) => {
      $.key === "Escape" && T();
    };
    return window.addEventListener("keydown", S), () => window.removeEventListener("keydown", S);
  }, [T]);
  const lt = [
    "mds-sheet",
    t === "form" ? "mds-sheet--form" : "",
    I === 2 ? "mds-sheet--stacked" : "",
    p ? "mds-sheet--dragging" : "",
    b ? "mds-sheet--closing" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "div",
    {
      ref: (S) => {
        l.current = S, typeof o == "function" ? o(S) : o && (o.current = S);
      },
      id: s,
      style: d,
      className: lt,
      "data-ds-sheet-level": String(I),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": e,
      ...c,
      children: [
        /* @__PURE__ */ a(
          "div",
          {
            className: "mds-sheet-scrim",
            onClick: () => T(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ g(
          "div",
          {
            className: "mds-sheet-panel",
            style: m ? { transform: `translateY(${m}px)` } : void 0,
            children: [
              /* @__PURE__ */ g(
                "div",
                {
                  className: "mds-sheet-grab",
                  onPointerDown: (S) => {
                    q.current = S.clientY - m, se(S);
                  },
                  onPointerMove: F,
                  onPointerUp: Ze,
                  onPointerCancel: Ze,
                  children: [
                    /* @__PURE__ */ a("span", { className: "mds-sheet-handle", "aria-hidden": "true" }),
                    /* @__PURE__ */ a("header", { className: "mds-sheet-header", children: /* @__PURE__ */ a("h2", { className: "mds-sheet-title mds-type-title-section", children: e }) })
                  ]
                }
              ),
              /* @__PURE__ */ a("div", { className: "mds-sheet-close", children: /* @__PURE__ */ a(K, { label: e, onPress: T, children: /* @__PURE__ */ a(Qt, {}) }) }),
              /* @__PURE__ */ a("div", { className: "mds-sheet-body", children: n })
            ]
          }
        )
      ]
    }
  );
}
const Li = [
  "default",
  "open",
  "dragging",
  "pastThreshold",
  "stacked"
], rt = ["day", "week", "month"];
function $a({
  value: e,
  items: t = rt,
  max: n,
  weekStart: r = 0,
  onChange: i,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const [m, u] = M(!1), p = he(e, r), h = re(), b = tt(p, r, h), v = Ve(p, r, 1), k = Y(n), y = k !== void 0 && j(oe(v)) > j(k), x = p.size === "day" || p.size === "week" || p.size === "month" ? Aa(p.size, r, h) : void 0, w = x !== void 0 && !Ha(p, x), H = ["mds-period-switcher", s].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("div", { ref: c, id: d, style: o, className: H, "data-size": p.size, ...l, children: [
    /* @__PURE__ */ a(
      K,
      {
        label: f(De(p.size, -1)),
        onPress: () => i?.(Ve(p, r, -1)),
        children: /* @__PURE__ */ a(Yt, {})
      }
    ),
    t.length === 1 ? /* @__PURE__ */ a(Ia, { text: b.text }) : /* @__PURE__ */ a(
      Va,
      {
        name: f("period.srName", { spoken: b.spoken }),
        text: b.text,
        onOpen: () => u(!0)
      }
    ),
    /* @__PURE__ */ a(
      K,
      {
        label: f(De(p.size, 1)),
        onPress: () => i?.(v),
        disabled: y,
        children: /* @__PURE__ */ a(We, { size: 24 })
      }
    ),
    w && x ? /* @__PURE__ */ a(
      ae,
      {
        variant: "secondary",
        mode: "canvas",
        size: "sm",
        className: "mds-period-jump",
        onPress: () => i?.(x),
        children: f(Ea(p.size))
      }
    ) : null,
    /* @__PURE__ */ a("span", { className: "mds-visually-hidden", "aria-live": "polite", children: b.spoken }),
    m && t.length > 1 ? /* @__PURE__ */ a(
      Fa,
      {
        value: p,
        items: t,
        weekStart: r,
        onResize: (P) => {
          i?.(P), u(!1);
        },
        onDismiss: () => u(!1)
      }
    ) : null
  ] });
}
function Va({
  name: e,
  text: t,
  onOpen: n
}) {
  const { isPressed: r, pressProps: i } = A({ onPress: n }), s = [
    "mds-period-label",
    "mds-period-label--button",
    r ? "mds-period-label--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("button", { type: "button", className: s, "aria-label": e, ...i, children: [
    /* @__PURE__ */ a("span", { className: "mds-period-label-text mds-type-label-strong", children: t }, t),
    /* @__PURE__ */ a(Ue, { size: 16, className: "mds-period-label-icon" })
  ] });
}
function Ia({ text: e }) {
  return /* @__PURE__ */ a("span", { className: "mds-period-label", children: /* @__PURE__ */ a("span", { className: "mds-period-label-text mds-type-label-strong", children: e }, e) });
}
function Fa({
  value: e,
  items: t,
  weekStart: n,
  onResize: r,
  onDismiss: i
}) {
  const [s, d] = M(!1), o = rt.filter((c) => t.includes(c)).map((c) => ({
    value: c,
    label: f(La(c))
  }));
  return /* @__PURE__ */ g(ie, { label: f("period.sheetTitle"), onDismiss: i, children: [
    o.length > 1 ? /* @__PURE__ */ a(
      at,
      {
        label: f("period.sizeGroup"),
        leading: o,
        value: e.size === "custom" ? "" : e.size,
        onChange: (c) => {
          r(he({ size: c, start: e.start }, n));
        }
      }
    ) : null,
    t.includes("custom") ? /* @__PURE__ */ a(Da, { armed: s, onArm: () => d(!0) }) : null,
    s ? /* @__PURE__ */ a(Be, { label: f("period.apply"), disabled: !0, onPress: () => {
    }, leading: !0 }) : null
  ] });
}
function Da({ armed: e, onArm: t }) {
  const { isPressed: n, pressProps: r } = A({ onPress: t }), i = [
    "mds-period-custom",
    e ? "mds-period-custom--armed" : "",
    n ? "mds-period-custom--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a("button", { type: "button", className: i, "aria-pressed": e, ...r, children: /* @__PURE__ */ a("span", { className: "mds-period-custom-text mds-type-body-strong", children: f("period.custom") }) });
}
function La(e) {
  return e === "day" ? "period.day" : e === "week" ? "period.week" : e === "month" ? "period.month" : "period.custom";
}
function De(e, t) {
  return e === "day" ? t === -1 ? "period.srDayPrev" : "period.srDayNext" : e === "week" ? t === -1 ? "period.srWeekPrev" : "period.srWeekNext" : e === "month" ? t === -1 ? "period.srMonthPrev" : "period.srMonthNext" : t === -1 ? "period.srCustomPrev" : "period.srCustomNext";
}
function Ea(e) {
  return e === "week" ? "period.thisWeek" : e === "month" ? "period.thisMonth" : "period.today";
}
const Ei = [
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
function it({ label: e, value: t, min: n, max: r, onChange: i, onDismiss: s }) {
  const [d, o] = M(() => {
    const l = Y(t) ?? re();
    return { size: "month", start: `01/${String(l.month).padStart(2, "0")}/${l.year}` };
  }), c = d.start.slice(3);
  return /* @__PURE__ */ g(ie, { label: e, onDismiss: s, children: [
    /* @__PURE__ */ a($a, { items: ["month"], value: d, onChange: o }),
    /* @__PURE__ */ a(
      Sa,
      {
        className: "mds-date-sheet-grid",
        month: c,
        mode: "single",
        weekStart: 0,
        value: Ra(t, c) ? t : void 0,
        min: n,
        max: r,
        onChange: (l) => typeof l == "string" && i?.(l)
      },
      c
    )
  ] });
}
function Ra(e, t) {
  const n = Y(e);
  return n ? `${String(n.month).padStart(2, "0")}/${n.year}` === t : !1;
}
function Ri({
  label: e,
  value: t,
  min: n,
  max: r,
  onChange: i,
  optional: s = !1,
  disabled: d = !1,
  state: o = "idle",
  className: c,
  id: l,
  style: m,
  ref: u,
  ...p
}) {
  const [h, b] = M(!1), v = [
    "mds-date-field",
    o === "error" ? "mds-date-field--error" : "",
    d ? "mds-date-field--disabled" : "",
    c
  ].filter(Boolean).join(" "), k = t !== void 0 ? tt({ size: "day", start: t }, 0).spoken : void 0, y = k !== void 0 ? f("datePicker.srName", { label: e, date: k }) : e;
  return /* @__PURE__ */ g("span", { ref: u, id: l, style: m, className: v, ...p, children: [
    /* @__PURE__ */ a("span", { className: "mds-date-field-label mds-type-label", children: e }),
    /* @__PURE__ */ a(
      Oa,
      {
        name: y,
        text: t,
        disabled: d,
        error: o === "error",
        onOpen: () => b(!0),
        hasValue: t !== void 0,
        optional: s,
        onClearValue: () => i?.(void 0)
      }
    ),
    o === "error" ? /* @__PURE__ */ a("span", { className: "mds-date-field-error mds-type-caption", children: f("dateQuick.choose") }) : null,
    h ? /* @__PURE__ */ a(
      it,
      {
        label: e,
        value: t,
        min: n,
        max: r,
        onChange: (x) => {
          i?.(x), b(!1);
        },
        onDismiss: () => b(!1)
      }
    ) : null
  ] });
}
function Oa({
  name: e,
  text: t,
  disabled: n,
  error: r,
  onOpen: i,
  hasValue: s,
  optional: d,
  onClearValue: o
}) {
  const { isPressed: c, pressProps: l } = A({ onPress: i, disabled: n }), m = [
    "mds-text-field-input",
    "mds-picker-field-box",
    c ? "mds-picker-field-box--pressed" : "",
    r ? "mds-date-field-box--error" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("span", { className: "mds-picker-field-row", children: [
    /* @__PURE__ */ g(
      "button",
      {
        type: "button",
        className: m,
        "aria-label": e,
        disabled: n,
        ...l,
        children: [
          t ? /* @__PURE__ */ a("span", { className: "mds-date-field-text", children: t }) : /* @__PURE__ */ a("span", { className: "mds-date-field-text mds-date-field-text--empty" }),
          /* @__PURE__ */ a(Xe, { size: 20, className: "mds-date-field-icon" })
        ]
      }
    ),
    d && s ? /* @__PURE__ */ a(K, { label: f("sr.clear"), disabled: n, onPress: o, children: /* @__PURE__ */ a(ue, { size: 20 }) }) : null
  ] });
}
const Oi = [
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
function be(e) {
  if (!e) return Number.NaN;
  const t = e.split("/");
  if (t.length !== 3) return Number.NaN;
  const n = Number.parseInt(t[0], 10), r = Number.parseInt(t[1], 10), i = Number.parseInt(t[2], 10);
  return !Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(i) ? Number.NaN : i * 1e4 + r * 100 + n;
}
function zi({
  label: e,
  value: t,
  items: n,
  min: r,
  max: i,
  onChange: s,
  disabled: d = !1,
  state: o = "idle",
  className: c,
  id: l,
  style: m,
  ref: u,
  ...p
}) {
  const [h, b] = M(!1), v = n.some((w) => w.value === t), k = t !== void 0 && !v ? t : void 0, y = (w) => {
    const H = be(w), P = be(r), N = be(i);
    return !!(Number.isFinite(H) && Number.isFinite(P) && H < P || Number.isFinite(H) && Number.isFinite(N) && H > N);
  }, x = [
    "mds-date-quick",
    o === "error" ? "mds-date-quick--error" : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "div",
    {
      ref: u,
      id: l,
      style: m,
      className: x,
      role: "radiogroup",
      "aria-label": e,
      "data-value": t ?? "",
      ...p,
      children: [
        /* @__PURE__ */ g("div", { className: "mds-date-quick-row", children: [
          n.map((w) => /* @__PURE__ */ a(
            za,
            {
              item: w,
              selected: w.value === t,
              disabled: d || y(w.value),
              onChange: s
            },
            w.value
          )),
          /* @__PURE__ */ a(
            Ya,
            {
              customDate: k,
              disabled: d,
              onChange: s,
              onOpenSheet: () => b(!0)
            }
          )
        ] }),
        o === "error" ? /* @__PURE__ */ a("span", { className: "mds-date-quick-error mds-type-caption", children: f("dateQuick.choose") }) : null,
        h ? /* @__PURE__ */ a(
          it,
          {
            label: f("dateQuick.other"),
            value: k,
            min: r,
            max: i,
            onChange: (w) => {
              s?.(w), b(!1);
            },
            onDismiss: () => b(!1)
          }
        ) : null
      ]
    }
  );
}
function za({
  item: e,
  selected: t,
  disabled: n,
  onChange: r
}) {
  const { isPressed: i, pressProps: s } = A({ onPress: () => r?.(e.value), disabled: n }), d = [
    "mds-filter-chip",
    "mds-date-quick-chip",
    t ? "mds-filter-chip--selected" : "",
    i ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      role: "radio",
      className: d,
      "aria-checked": t,
      "aria-label": f("dateQuick.chipName", { label: e.label, value: e.value }),
      disabled: n,
      "data-ds-exempt": n ? void 0 : "",
      ...s,
      children: /* @__PURE__ */ a("span", { className: "mds-filter-chip-label", children: e.label })
    }
  );
}
function Ya({
  customDate: e,
  disabled: t,
  onChange: n,
  onOpenSheet: r
}) {
  const i = e !== void 0, { isPressed: s, pressProps: d } = A({
    onPress: () => i ? n?.(e) : r(),
    disabled: t
  }), o = [
    "mds-filter-chip",
    "mds-date-quick-chip",
    "mds-date-quick-chip--other",
    i ? "mds-filter-chip--selected" : "",
    s ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      role: "radio",
      className: o,
      "aria-checked": i,
      "aria-label": i ? e : f("dateQuick.other"),
      disabled: t,
      "data-ds-exempt": t ? void 0 : "",
      ...d,
      children: i ? /* @__PURE__ */ a("span", { className: "mds-filter-chip-label mds-date-quick-chip-date", children: e }) : /* @__PURE__ */ g(U, { children: [
        /* @__PURE__ */ a(Xe, { size: 16, className: "mds-date-quick-chip-icon" }),
        /* @__PURE__ */ a("span", { className: "mds-filter-chip-label", children: f("dateQuick.other") })
      ] })
    }
  );
}
const Yi = [
  "default",
  "selected",
  "custom-date",
  "pressed",
  "disabled",
  "error"
];
function qa(e) {
  return e < 10 ? `0${e}` : String(e);
}
function st(e) {
  const t = Math.max(0, Math.min(1439, Math.round(e))), n = Math.floor(t / 60), r = t % 60, i = n < 12, d = `${n % 12 === 0 ? 12 : n % 12}:${qa(r)}`;
  return {
    text: `${d} ${f(i ? "time.am" : "time.pm")}`,
    spoken: `${d} ${f(i ? "time.amSpoken" : "time.pmSpoken")}`
  };
}
const Le = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
function qi({
  label: e,
  value: t,
  step: n = 15,
  min: r,
  max: i,
  onChange: s,
  disabled: d = !1,
  state: o = "idle",
  className: c,
  id: l,
  style: m,
  ref: u,
  ...p
}) {
  const [h, b] = M(!1), v = t !== void 0 ? st(t) : void 0, k = [
    "mds-time-field",
    o === "error" ? "mds-time-field--error" : "",
    d ? "mds-time-field--disabled" : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("span", { ref: u, id: l, style: m, className: k, ...p, children: [
    /* @__PURE__ */ a("span", { className: "mds-time-field-label mds-type-label", children: e }),
    /* @__PURE__ */ a(
      Ga,
      {
        label: e,
        formatted: v,
        disabled: d,
        error: o === "error",
        onOpen: () => b(!0),
        hasValue: t !== void 0,
        onClearValue: () => s?.(void 0)
      }
    ),
    o === "error" ? /* @__PURE__ */ a("span", { className: "mds-time-field-error mds-type-caption", children: f("timePicker.choose") }) : null,
    h ? /* @__PURE__ */ a(
      _a,
      {
        label: e,
        value: t,
        step: n,
        min: r,
        max: i,
        onApply: (y) => {
          s?.(y), b(!1);
        },
        onDismiss: () => b(!1)
      }
    ) : null
  ] });
}
function Ga({
  label: e,
  formatted: t,
  disabled: n,
  error: r,
  onOpen: i,
  hasValue: s,
  onClearValue: d
}) {
  const { isPressed: o, pressProps: c } = A({ onPress: i, disabled: n }), l = t ? f("timePicker.srName", { label: e, time: t.spoken }) : e, m = [
    "mds-text-field-input",
    "mds-picker-field-box",
    o ? "mds-picker-field-box--pressed" : "",
    r ? "mds-time-field-box--error" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("span", { className: "mds-picker-field-row", children: [
    /* @__PURE__ */ g(
      "button",
      {
        type: "button",
        className: m,
        "aria-label": l,
        disabled: n,
        "data-ds-exempt": "",
        ...c,
        children: [
          t ? /* @__PURE__ */ a("span", { className: "mds-time-field-text", children: t.text }) : /* @__PURE__ */ a("span", { className: "mds-time-field-text mds-time-field-text--empty" }),
          /* @__PURE__ */ a(Gn, { size: 20, className: "mds-time-field-icon" })
        ]
      }
    ),
    s ? /* @__PURE__ */ a(K, { label: f("sr.clear"), disabled: n, onPress: d, children: /* @__PURE__ */ a(ue, { size: 20 }) }) : null
  ] });
}
function _a({
  label: e,
  value: t,
  step: n,
  min: r,
  max: i,
  onApply: s,
  onDismiss: d
}) {
  const [o, c] = M(t), [l, m] = M(t !== void 0 && t >= 720 ? "pm" : "am"), u = o !== void 0 ? st(o) : void 0, p = l === "am", h = Qa(n), b = (x) => (r === void 0 || x >= r) && (i === void 0 || x <= i), v = (x) => h.some((w) => b(ke(x, w, p))), k = (x) => Le.some((w) => b(ke(w, x, p))), y = () => {
    o !== void 0 && s(o);
  };
  return /* @__PURE__ */ g(ie, { variant: "form", label: e, onDismiss: d, children: [
    /* @__PURE__ */ a("div", { className: "mds-picker-sheet-head", children: /* @__PURE__ */ a("span", { className: "mds-time-sheet-value mds-type-number-lg", children: u ? u.text : f("money.missing") }) }),
    /* @__PURE__ */ a(
      at,
      {
        label: f("time.periodGroup"),
        leading: [
          { value: "am", label: f("time.am") },
          { value: "pm", label: f("time.pm") }
        ],
        value: l,
        onChange: (x) => {
          if (m(x === "pm" ? "pm" : "am"), o === void 0) return;
          const w = Math.floor(o / 60), H = w % 12 === 0 ? 12 : w % 12, P = x === "pm" ? 12 : 0, N = H % 12 + P;
          c(N * 60 + o % 60);
        }
      }
    ),
    /* @__PURE__ */ a(
      Ee,
      {
        title: f("time.hour"),
        options: Le.map((x) => ({
          value: String(x),
          label: String(x),
          disabled: !v(x)
        })),
        selected: o === void 0 ? void 0 : String(Math.floor(o / 60) % 12 === 0 ? 12 : Math.floor(o / 60) % 12),
        onChange: (x) => {
          const w = Number.parseInt(x, 10), H = o === void 0 ? 0 : o % 60;
          c(ke(w, H, p));
        }
      }
    ),
    /* @__PURE__ */ a(
      Ee,
      {
        title: f("time.minutes"),
        options: h.map((x) => ({
          value: String(x),
          label: x < 10 ? `0${x}` : String(x),
          disabled: !k(x)
        })),
        selected: o === void 0 ? void 0 : String(o % 60),
        onChange: (x) => {
          const w = Number.parseInt(x, 10), H = o === void 0 ? 12 : Math.floor(o / 60);
          c(H * 60 + w);
        }
      }
    ),
    /* @__PURE__ */ a(Be, { label: f("timePicker.apply"), onPress: y, disabled: o === void 0, leading: !0 })
  ] });
}
function ke(e, t, n) {
  return (e % 12 + (n ? 0 : 12)) * 60 + t;
}
function Qa(e) {
  const t = e > 0 && 60 % e === 0 ? e : 15;
  return Array.from({ length: 60 / t }, (n, r) => r * t);
}
function Ee({
  title: e,
  options: t,
  selected: n,
  onChange: r
}) {
  return /* @__PURE__ */ g("div", { className: "mds-time-slot", children: [
    /* @__PURE__ */ a("span", { className: "mds-time-slot-title mds-type-label-strong", children: e }),
    /* @__PURE__ */ a("div", { className: "mds-time-slot-grid", role: "radiogroup", "aria-label": e, children: t.map((i) => /* @__PURE__ */ a(
      Wa,
      {
        option: i,
        selected: i.value === n,
        onChange: r
      },
      i.value
    )) })
  ] });
}
function Wa({
  option: e,
  selected: t,
  onChange: n
}) {
  const { isPressed: r, pressProps: i } = A({ onPress: () => n(e.value), disabled: e.disabled }), s = [
    "mds-filter-chip",
    "mds-time-slot-chip",
    t ? "mds-filter-chip--selected" : "",
    r ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      role: "radio",
      className: s,
      "aria-checked": t,
      "aria-label": e.label,
      disabled: e.disabled,
      "data-ds-exempt": e.disabled ? void 0 : "",
      ...i,
      children: /* @__PURE__ */ a("span", { className: "mds-filter-chip-label mds-time-slot-chip-label", children: e.label })
    }
  );
}
const Gi = [
  "default",
  "empty",
  "chosen",
  "pressed",
  "sheet-open",
  "disabled",
  "error"
];
function Ua(e) {
  return e === 1 ? f("duration.hourOne") : e === 2 ? f("duration.hourTwo") : `${e} ${e >= 3 && e <= 10 ? f("duration.hourFew") : f("duration.hourMany")}`;
}
function Ka(e) {
  return e === 1 ? f("duration.minuteOne") : e === 2 ? f("duration.minuteTwo") : `${e} ${e >= 3 && e <= 10 ? f("duration.minuteFew") : f("duration.minuteMany")}`;
}
function ve(e) {
  const t = Math.max(0, Math.min(1440, Math.round(e))), n = Math.floor(t / 60), r = t % 60, i = [];
  return n > 0 && i.push(Ua(n)), r === 30 && n > 0 ? i.push(f("duration.half")) : r > 0 && i.push(`${n > 0 ? f("duration.and") : ""}${Ka(r)}`), i.join(" ");
}
const Xa = [15, 30, 45, 60, 90, 120, 180, 240];
function _i({
  label: e,
  value: t,
  min: n = 15,
  max: r = 720,
  step: i = 15,
  onChange: s,
  disabled: d = !1,
  className: o,
  id: c,
  style: l,
  ref: m,
  ...u
}) {
  const [p, h] = M(!1), b = [
    "mds-duration-field",
    d ? "mds-duration-field--disabled" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("span", { ref: m, id: c, style: l, className: b, ...u, children: [
    /* @__PURE__ */ a("span", { className: "mds-duration-field-label mds-type-label", children: e }),
    /* @__PURE__ */ a(
      Ja,
      {
        label: e,
        text: t !== void 0 ? ve(t) : void 0,
        disabled: d,
        onOpen: () => h(!0),
        hasValue: t !== void 0,
        onClearValue: () => s?.(void 0)
      }
    ),
    p ? /* @__PURE__ */ a(
      er,
      {
        label: e,
        value: t,
        min: n,
        max: r,
        step: i,
        onApply: (v) => {
          s?.(v), h(!1);
        },
        onDismiss: () => h(!1)
      }
    ) : null
  ] });
}
function Ja({
  label: e,
  text: t,
  disabled: n,
  onOpen: r,
  hasValue: i,
  onClearValue: s
}) {
  const { isPressed: d, pressProps: o } = A({ onPress: r, disabled: n }), c = t ? f("durationPicker.srName", { label: e, duration: t }) : e, l = [
    "mds-text-field-input",
    "mds-picker-field-box",
    d ? "mds-picker-field-box--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("span", { className: "mds-picker-field-row", children: [
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: l,
        "aria-label": c,
        disabled: n,
        "data-ds-exempt": "",
        ...o,
        children: /* @__PURE__ */ a("span", { className: "mds-duration-field-text", children: t ?? "" })
      }
    ),
    i ? /* @__PURE__ */ a(K, { label: f("sr.clear"), disabled: n, onPress: s, children: /* @__PURE__ */ a(ue, { size: 20 }) }) : null
  ] });
}
function er({
  label: e,
  value: t,
  min: n,
  max: r,
  step: i,
  onApply: s,
  onDismiss: d
}) {
  const [o, c] = M(t), l = o !== void 0 ? ve(o) : void 0;
  return /* @__PURE__ */ g(ie, { label: e, onDismiss: d, children: [
    /* @__PURE__ */ a("div", { className: "mds-picker-sheet-head", children: /* @__PURE__ */ a("span", { className: "mds-duration-sheet-value mds-type-number-lg", children: l ?? f("money.missing") }) }),
    /* @__PURE__ */ a("div", { className: "mds-duration-common", role: "radiogroup", "aria-label": f("duration.common"), children: Xa.map((m) => /* @__PURE__ */ a(
      tr,
      {
        label: ve(m),
        selected: o === m,
        onChange: () => c(m)
      },
      m
    )) }),
    /* @__PURE__ */ g("div", { className: "mds-duration-other", children: [
      /* @__PURE__ */ a("span", { className: "mds-duration-other-title mds-type-label-strong", children: f("duration.other") }),
      /* @__PURE__ */ a(
        ya,
        {
          label: f("duration.other"),
          value: o,
          min: n,
          max: r,
          step: i,
          onChange: (m) => c(Math.min(Math.max(m, n), r))
        }
      ),
      /* @__PURE__ */ a("span", { className: "mds-visually-hidden", "aria-live": "polite", children: l ?? "" }),
      /* @__PURE__ */ a("span", { className: "mds-duration-other-text mds-type-body", children: l ?? "" })
    ] }),
    /* @__PURE__ */ a(
      Be,
      {
        label: f("durationPicker.apply"),
        onPress: () => o !== void 0 && s(o),
        disabled: o === void 0,
        leading: !0
      }
    )
  ] });
}
function tr({
  label: e,
  selected: t,
  onChange: n
}) {
  const { isPressed: r, pressProps: i } = A({ onPress: n }), s = [
    "mds-filter-chip",
    "mds-duration-common-chip",
    t ? "mds-filter-chip--selected" : "",
    r ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      role: "radio",
      className: s,
      "aria-checked": t,
      "aria-label": e,
      "data-ds-exempt": "",
      ...i,
      children: /* @__PURE__ */ a("span", { className: "mds-filter-chip-label mds-duration-common-chip-label", children: e })
    }
  );
}
const Qi = [
  "default",
  "empty",
  "chosen",
  "pressed",
  "sheet-open",
  "stepper-typing",
  "disabled"
], nr = {
  done: Ke,
  waiting: sn,
  problem: Se,
  info: ln
}, ar = {
  done: "badge.done",
  waiting: "badge.waiting",
  problem: "badge.problem",
  info: "badge.info",
  neutral: "badge.neutral"
};
function Wi({
  tone: e,
  label: t,
  className: n,
  id: r,
  style: i,
  ref: s,
  ...d
}) {
  const o = e === "neutral" ? null : nr[e], c = ["mds-status-badge", `mds-status-badge--${e}`, n].filter(Boolean).join(" ");
  return /* @__PURE__ */ a("span", { ref: s, id: r, style: i, className: c, ...d, children: /* @__PURE__ */ g("span", { className: "mds-status-badge-content", children: [
    o ? /* @__PURE__ */ a(o, { size: 14 }) : null,
    /* @__PURE__ */ a("span", { className: "mds-status-badge-label", children: t ?? f(ar[e]) })
  ] }, e) });
}
const Ui = [
  "neutral",
  "info",
  "done",
  "waiting",
  "problem",
  "longLabel"
], rr = {
  done: vn,
  waiting: Nn
};
function ir(e) {
  let t = e.trim().split(/\s+/)[0];
  const n = String.fromCodePoint(1575, 1604);
  return t.length > n.length && t.startsWith(n) && (t = t.slice(n.length)), t ? Array.from(t)[0] : void 0;
}
function Me({
  size: e = "md",
  variant: t = "surface",
  value: n,
  tone: r,
  children: i,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const m = r === "done" || r === "waiting" ? rr[r] : null, u = i ? void 0 : n ? ir(n) : void 0, p = [
    "mds-entity-mark",
    `mds-entity-mark--${e}`,
    t === "canvas" ? "mds-entity-mark--canvas" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("span", { ref: c, id: d, style: o, className: p, "aria-hidden": "true", ...l, children: [
    i ?? (u ? /* @__PURE__ */ a("span", { className: "mds-entity-mark-initial", children: u }) : null),
    m ? /* @__PURE__ */ a("span", { className: "mds-entity-mark-badge", children: /* @__PURE__ */ a(m, { size: 14 }) }) : null
  ] });
}
const Ki = [
  "initial",
  "sizes",
  "fundTypes",
  "approved",
  "pending",
  "withImageRule"
];
function Xi({
  label: e,
  caption: t,
  value: n,
  onChange: r,
  placeholder: i,
  state: s = "idle",
  disabled: d = !1,
  optional: o = !1,
  className: c,
  id: l,
  style: m,
  ref: u,
  ...p
}) {
  const h = [
    "mds-field",
    "mds-text-field",
    s === "error" ? "mds-text-field--error" : "",
    d ? "mds-text-field--disabled mds-field--disabled" : "",
    c
  ].filter(Boolean).join(" "), b = l ? `${l}-input` : void 0;
  return /* @__PURE__ */ g("span", { ref: u, id: l, style: m, className: h, ...p, children: [
    /* @__PURE__ */ g("label", { className: "mds-text-field-label mds-type-label", htmlFor: b, children: [
      e,
      o ? /* @__PURE__ */ a("span", { className: "mds-text-field-optional mds-type-caption", children: f("field.optional") }) : null
    ] }),
    /* @__PURE__ */ a(
      "input",
      {
        id: b,
        className: "mds-text-field-input mds-field-input",
        type: "text",
        value: n,
        disabled: d,
        placeholder: i,
        "aria-label": l ? void 0 : e,
        "aria-invalid": s === "error" || void 0,
        onChange: (v) => r?.(v.target.value)
      }
    ),
    t ? /* @__PURE__ */ g("span", { className: s === "error" ? "mds-text-field-caption mds-text-field-caption--error" : "mds-text-field-caption", children: [
      s === "error" ? /* @__PURE__ */ a(Se, { size: 14 }) : null,
      t
    ] }) : null
  ] });
}
const Ji = [
  "default",
  "focused",
  "disabled",
  "error",
  "withCaption",
  "withPlaceholder"
];
function es({
  leading: e,
  value: t,
  onChange: n,
  disabled: r = !1,
  label: i,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const m = (u) => {
    const p = t.includes(u) ? t.filter((h) => h !== u) : [...t, u];
    n(p);
  };
  return /* @__PURE__ */ a(
    "div",
    {
      ref: c,
      id: d,
      style: o,
      className: ["mds-filter-chips", s].filter(Boolean).join(" "),
      role: "group",
      "aria-label": i,
      ...l,
      children: e.map((u) => /* @__PURE__ */ a(
        sr,
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
function sr({
  chip: e,
  selected: t,
  disabled: n,
  onToggle: r
}) {
  const { isPressed: i, pressProps: s } = A({ onPress: () => r(e.value), disabled: n }), d = [
    "mds-filter-chip",
    t ? "mds-filter-chip--selected" : "",
    i ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "button",
    {
      type: "button",
      className: d,
      "aria-pressed": t === !0,
      disabled: n,
      "data-ds-exempt": n ? void 0 : "",
      ...s,
      children: [
        t ? /* @__PURE__ */ a(He, { size: 16, className: "mds-filter-chip-check" }) : null,
        /* @__PURE__ */ a("span", { className: "mds-filter-chip-label", children: e.label })
      ]
    }
  );
}
const ts = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "manyChips"
];
function ns({
  children: e,
  label: t,
  trailing: n,
  density: r = "regular",
  className: i,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = [
    "mds-surface",
    r === "list" ? "mds-surface--list" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("div", { ref: o, id: s, style: d, className: l, ...c, children: [
    t || n ? /* @__PURE__ */ g("div", { className: "mds-surface-header", children: [
      t ? /* @__PURE__ */ a("h3", { className: "mds-surface-title", children: t }) : null,
      n ? /* @__PURE__ */ a("div", { className: "mds-surface-action", children: n }) : null
    ] }) : null,
    e
  ] });
}
const as = [
  "default",
  "withHeader",
  "withAction",
  "pressed",
  "list"
];
function rs({ children: e, className: t, id: n, style: r, ref: i, ...s }) {
  return /* @__PURE__ */ a(
    "div",
    {
      ref: i,
      id: n,
      style: r,
      className: ["mds-well", t].filter(Boolean).join(" "),
      ...s,
      children: e
    }
  );
}
const is = [
  "default",
  "inSurface"
];
function ss({
  label: e,
  caption: t,
  onPress: n,
  children: r,
  className: i,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = r == null, { isPressed: m, pressProps: u } = A({ onPress: () => n?.(), disabled: l }), p = !l && n !== void 0, h = ["mds-section", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("section", { ref: o, id: s, style: d, className: h, ...c, children: [
    /* @__PURE__ */ g("header", { className: "mds-section-header", children: [
      /* @__PURE__ */ a("h2", { className: "mds-section-title mds-type-title-section", children: e }),
      t !== void 0 ? /* @__PURE__ */ a("span", { className: "mds-section-count", children: t }) : null,
      p ? /* @__PURE__ */ g(
        "button",
        {
          type: "button",
          className: ["mds-section-see-all", m ? "mds-section-see-all--pressed" : ""].filter(Boolean).join(" "),
          "data-ds-exempt": "",
          ...u,
          children: [
            /* @__PURE__ */ a("span", { className: "mds-section-see-all-label", children: f("button.all") }),
            /* @__PURE__ */ a(We, { size: 16, className: "mds-section-see-all-icon" })
          ]
        }
      ) : null
    ] }),
    r
  ] });
}
const os = [
  "default",
  "withCount",
  "withSeeAll",
  "empty"
], ce = 80, ot = G.size["dot-signal"] / 2, or = G.border["signal-line"], J = ot + or / 2;
function dr(e, t) {
  const n = e.length, r = Math.min(...e), s = Math.max(...e) - r, d = (l) => n === 1 ? ce - J : J + l / (n - 1) * (ce - 2 * J), o = (l) => s === 0 ? t / 2 : J + (1 - (l - r) / s) * (t - 2 * J);
  return { points: e.map((l, m) => `${d(m).toFixed(2)},${o(l).toFixed(2)}`).join(" "), endX: d(n - 1), endY: o(e[n - 1]) };
}
function dt({
  values: e,
  lineClassName: t,
  dotClassName: n,
  hidden: r = !1,
  height: i,
  fullWidth: s = !1
}) {
  const d = i ?? G.size["sparkline-height"], o = !r && e.length >= 1 ? dr(e, d) : null;
  return /* @__PURE__ */ g(
    "svg",
    {
      viewBox: `0 0 ${ce} ${d}`,
      width: s ? "100%" : ce,
      height: d,
      preserveAspectRatio: s ? "none" : void 0,
      focusable: "false",
      children: [
        o && e.length >= 2 ? /* @__PURE__ */ a(
          "polyline",
          {
            className: t,
            points: o.points,
            vectorEffect: s ? "non-scaling-stroke" : void 0
          }
        ) : null,
        o ? s ? (
          /* The stretched dot: a zero-length path with a round cap and a
             non-scaling stroke keeps its token diameter and its circle shape
             under any preserveAspectRatio="none" stretch. */
          /* @__PURE__ */ a(
            "path",
            {
              className: n,
              d: `M ${o.endX.toFixed(2)} ${o.endY.toFixed(2)} L ${o.endX.toFixed(2)} ${o.endY.toFixed(2)}`,
              strokeWidth: G.size["dot-signal"],
              strokeLinecap: "round",
              vectorEffect: "non-scaling-stroke",
              fill: "none"
            }
          )
        ) : /* @__PURE__ */ a("circle", { className: n, cx: o.endX, cy: o.endY, r: ot }) : null
      ]
    }
  );
}
function ds({
  leading: e,
  label: t,
  state: n = !1,
  caption: r,
  value: i,
  trailing: s,
  draft: d,
  tone: o = "start",
  onPress: c,
  disabled: l = !1,
  className: m,
  id: u,
  style: p,
  ref: h,
  ...b
}) {
  const { isPressed: v, pressProps: k } = A({ onPress: () => c?.(), disabled: l }), { hidden: y } = W(), x = d !== void 0, w = i != null && typeof i != "string", H = i === void 0 ? V().missingGlyph : w ? i : y && x ? V().hiddenGlyph : i, P = [
    "mds-tile",
    `mds-tile--${o}`,
    v ? "mds-tile--pressed" : "",
    l ? "mds-tile--disabled" : "",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "button",
    {
      ref: h,
      id: u,
      style: p,
      type: "button",
      className: P,
      disabled: l,
      "data-ds-exempt": l ? void 0 : "",
      ...k,
      ...b,
      children: [
        /* @__PURE__ */ g("span", { className: "mds-tile-header", children: [
          e ? /* @__PURE__ */ a("span", { className: "mds-tile-header-icon", "aria-hidden": "true", children: e }) : null,
          /* @__PURE__ */ a("span", { className: "mds-tile-header-label mds-type-label", children: t }),
          n ? /* @__PURE__ */ a("span", { className: "mds-tile-dot", role: "img", "aria-label": r ?? "" }) : null
        ] }),
        /* @__PURE__ */ g("span", { className: "mds-tile-content", children: [
          d ? /* @__PURE__ */ a("span", { className: "mds-tile-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ a(
            dt,
            {
              values: d,
              hidden: y,
              lineClassName: "mds-tile-sparkline-line",
              dotClassName: "mds-tile-sparkline-dot"
            }
          ) }) : null,
          /* @__PURE__ */ a("span", { className: "mds-tile-value", children: w ? H : /* @__PURE__ */ a("bdi", { dir: "ltr", children: H }) }),
          s ? /* @__PURE__ */ a("span", { className: "mds-tile-line mds-type-caption", children: s }) : null
        ] })
      ]
    }
  );
}
const ls = [
  "default",
  "withDot",
  "withSparkline",
  "pressed",
  "focused",
  "disabled"
];
function lr(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function cr({ value: e }) {
  const { hidden: t } = W(), r = e === void 0 ? V().missingGlyph : t ? V().hiddenGlyph : null, { whole: i, cents: s } = lr(e ?? V().missingGlyph), o = (e ?? "").length > 9 ? "mds-hero-value--lg mds-number-lg" : "mds-hero-value--hero mds-type-display-hero";
  return /* @__PURE__ */ a("span", { className: `mds-hero-value ${o}`, children: /* @__PURE__ */ a("bdi", { dir: "ltr", children: r !== null ? /* @__PURE__ */ a("span", { className: "mds-hero-value-glyph", children: r }) : /* @__PURE__ */ g(U, { children: [
    /* @__PURE__ */ a("span", { className: "mds-hero-value-whole", children: i }),
    s ? /* @__PURE__ */ a("span", { className: "mds-hero-value-cents", children: s }) : null
  ] }) }) });
}
function mr({ values: e }) {
  const { hidden: t } = W();
  return /* @__PURE__ */ a("span", { className: "mds-hero-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ a(
    dt,
    {
      values: e,
      hidden: t,
      height: G.size["hero-sparkline-height"],
      fullWidth: !0,
      lineClassName: "mds-hero-sparkline-line",
      dotClassName: "mds-hero-sparkline-dot"
    }
  ) });
}
function cs({
  label: e,
  value: t,
  trailing: n,
  direction: r,
  debt: i,
  draft: s,
  onDismiss: d,
  onChange: o,
  className: c,
  id: l,
  style: m,
  ref: u,
  ...p
}) {
  const { isPressed: h, pressProps: b } = A({ onPress: () => d?.() }), { hidden: v } = W(), k = v && t !== void 0, y = ["mds-hero-surface", c].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("section", { ref: u, id: l, style: m, className: y, ...p, children: [
    /* @__PURE__ */ g("header", { className: "mds-hero-header", children: [
      /* @__PURE__ */ a("span", { className: "mds-hero-label", children: e }),
      /* @__PURE__ */ a(ua, { className: "mds-hero-toggle", onChange: o })
    ] }),
    /* @__PURE__ */ g("p", { className: "mds-hero-amount", children: [
      /* @__PURE__ */ g("span", { className: "mds-hero-visual", "aria-hidden": k || void 0, children: [
        /* @__PURE__ */ a(cr, { value: t }),
        n && t !== void 0 ? /* @__PURE__ */ a("span", { className: "mds-hero-unit", children: n }) : null
      ] }, k ? "hidden" : "shown"),
      k ? /* @__PURE__ */ a("span", { className: "mds-visually-hidden", children: V().hidden }) : null
    ] }),
    r || i ? (
      /* 1.7 ت2.3: ONE line — the diff, then « · », then the source link
          at the line's end (they used to be two stacked lines with the
          source under the sparkline). */
      /* @__PURE__ */ g("p", { className: "mds-hero-line", children: [
        r ? /* @__PURE__ */ a("span", { className: "mds-hero-diff", children: r }) : null,
        r && i ? /* @__PURE__ */ a("span", { className: "mds-hero-line-sep", "aria-hidden": "true", children: "·" }) : null,
        i ? /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: ["mds-hero-source", h ? "mds-hero-source--pressed" : ""].filter(Boolean).join(" "),
            "data-ds-exempt": "",
            ...b,
            children: i
          }
        ) : null
      ] })
    ) : null,
    s ? /* @__PURE__ */ a(mr, { values: s }) : null
  ] });
}
const ms = [
  "default",
  "withCents",
  "missing",
  "longNumber",
  "noDiff",
  "withSparkline"
];
function Re(e) {
  return e != null && typeof e != "string";
}
function us({
  leading: e,
  tone: t,
  label: n,
  caption: r,
  value: i,
  trailing: s,
  onPress: d,
  landed: o = !1,
  disabled: c = !1,
  className: l,
  id: m,
  style: u,
  ref: p,
  ...h
}) {
  const { isPressed: b, pressProps: v } = A({ onPress: () => d?.(), disabled: c }), k = d !== void 0, y = [
    "mds-object-row",
    Re(e) ? "mds-object-row--icon" : "",
    b ? "mds-object-row--pressed" : "",
    o ? "mds-object-row--landed" : "",
    c ? "mds-object-row--disabled" : "",
    k ? "" : "mds-object-row--passive",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    k ? "button" : "div",
    {
      ref: p,
      id: m,
      style: u,
      type: k ? "button" : void 0,
      className: y,
      disabled: k ? c : void 0,
      ...k ? v : {},
      ...h,
      children: [
        Re(e) ? (
          /* ت4 (1.7): a NON-entity row (an action, a setting) starts with its
             icon 20 in text-secondary — no 44 mark box, a row-plain height. */
          /* @__PURE__ */ a("span", { className: "mds-object-row-icon", "aria-hidden": "true", children: e })
        ) : /* @__PURE__ */ a(Me, { size: "md", tone: t, value: typeof e == "string" ? e : n }),
        /* @__PURE__ */ g("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ a("span", { className: "mds-object-row-title mds-type-body-strong", children: n }),
          r ? /* @__PURE__ */ a("span", { className: "mds-object-row-caption mds-type-caption", children: r }) : null
        ] }),
        i !== void 0 || s ? /* @__PURE__ */ g("span", { className: "mds-object-row-end", children: [
          i !== void 0 ? /* @__PURE__ */ a("span", { className: "mds-object-row-value mds-type-amount-row", children: typeof i == "string" ? /* @__PURE__ */ a("bdi", { dir: "ltr", children: i }) : (
            /* A Money node renders itself (its own LTR isolation, sign,
               unit and hidden-amounts behaviour) — never re-wrapped. */
            i
          ) }) : null,
          s ? /* @__PURE__ */ a("span", { className: "mds-object-row-time mds-type-caption", children: s }) : null
        ] }) : null
      ]
    }
  );
}
const hs = [
  "default",
  "oneLine",
  "withBadge",
  "pressed",
  "landed",
  "focused",
  "disabled"
];
function ps({
  leading: e,
  tone: t,
  label: n,
  caption: r,
  value: i,
  state: s,
  href: d,
  children: o,
  onPress: c,
  disabled: l = !1,
  className: m,
  id: u,
  style: p,
  ref: h,
  ...b
}) {
  const { isPressed: v, pressProps: k } = A({ onPress: () => c?.(), disabled: l }), y = c !== void 0 || d !== void 0, x = o != null, w = d ? "a" : y ? "button" : "div", H = [
    "mds-object-card",
    v ? "mds-object-card--pressed" : "",
    l ? "mds-object-card--disabled" : "",
    x ? "mds-object-card--with-action" : "",
    y ? "" : "mds-object-card--passive",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("div", { ref: h, id: u, style: p, className: ["mds-object-card-wrap", l ? "mds-object-card-wrap--disabled" : "", m].filter(Boolean).join(" "), ...b, children: [
    /* @__PURE__ */ g(
      w,
      {
        className: H,
        href: d,
        type: w === "button" ? "button" : void 0,
        disabled: w === "button" ? l : void 0,
        ...y ? k : {},
        children: [
          /* @__PURE__ */ g("span", { className: "mds-object-card-mark", children: [
            /* @__PURE__ */ a(Me, { size: "lg", tone: t, value: typeof e == "string" ? e : n, children: typeof e == "string" ? void 0 : e }),
            s ? /* @__PURE__ */ a("span", { className: "mds-object-card-state", children: s }) : null
          ] }),
          /* @__PURE__ */ g("span", { className: "mds-object-card-body", children: [
            /* @__PURE__ */ a("span", { className: "mds-object-card-title", children: n }),
            r ? /* @__PURE__ */ a("span", { className: "mds-object-card-caption mds-type-caption", children: r }) : null,
            i !== void 0 ? /* @__PURE__ */ a("span", { className: "mds-object-card-value mds-type-amount-row", children: typeof i == "string" ? /* @__PURE__ */ a("bdi", { dir: "ltr", children: i }) : (
              /* A Money node renders itself (its own isolation, sign,
                 unit and hidden-amounts behaviour) — never re-wrapped. */
              i
            ) }) : null
          ] })
        ]
      }
    ),
    x ? /* @__PURE__ */ a("span", { className: "mds-object-card-action", children: o }) : null
  ] });
}
const fs = [
  "default",
  "withBadge",
  "withButton",
  "pressed",
  "focused",
  "disabled"
];
function ur(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function hr({
  label: e,
  size: t = "lg",
  value: n,
  trailing: r,
  direction: i,
  debt: s,
  onDismiss: d,
  loading: o = !1,
  className: c,
  id: l,
  style: m,
  ref: u,
  ...p
}) {
  const { isPressed: h, pressProps: b } = A({ onPress: () => d?.() }), { hidden: v } = W(), k = v && n !== void 0 && n !== null && !o, { whole: y, cents: x } = ur(k ? "—" : n ?? "—"), w = ["mds-metric", c].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("div", { ref: u, id: l, style: m, className: w, ...p, children: [
    /* @__PURE__ */ a("span", { className: "mds-metric-label mds-type-label", children: e }),
    /* @__PURE__ */ a("p", { className: "mds-metric-amount", children: o ? /* @__PURE__ */ a("span", { className: "mds-metric-skeleton", "aria-busy": "true" }) : k ? /* @__PURE__ */ g(U, { children: [
      /* @__PURE__ */ g(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero mds-metric-value--hidden",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          "data-ds-check": "amount-hidden",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ a("bdi", { dir: "ltr", children: /* @__PURE__ */ a("span", { className: "mds-metric-value-whole", children: V().hiddenGlyph }) }),
            r ? /* @__PURE__ */ a("span", { className: "mds-metric-unit", children: r }) : null
          ]
        }
      ),
      /* @__PURE__ */ a("span", { className: "mds-visually-hidden", children: V().hidden })
    ] }) : /* @__PURE__ */ g(U, { children: [
      /* @__PURE__ */ a(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          children: /* @__PURE__ */ g("bdi", { dir: "ltr", children: [
            /* @__PURE__ */ a("span", { className: "mds-metric-value-whole", children: y }),
            x ? /* @__PURE__ */ a("span", { className: "mds-metric-value-cents", children: x }) : null
          ] })
        }
      ),
      r ? /* @__PURE__ */ a("span", { className: "mds-metric-unit", children: r }) : null
    ] }) }),
    i && !o ? /* @__PURE__ */ a("p", { className: "mds-metric-diff", children: i }) : null,
    s && !o ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: ["mds-metric-source", h ? "mds-metric-source--pressed" : ""].filter(Boolean).join(" "),
        "data-ds-exempt": "",
        ...b,
        children: s
      }
    ) : null
  ] });
}
const gs = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function bs({ size: e, ...t }) {
  return /* @__PURE__ */ a(hr, { ...t, size: "sm", className: ["mds-metric-small", t.className].filter(Boolean).join(" ") });
}
const ks = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function xs({
  label: e,
  caption: t,
  value: n,
  onPress: r,
  onDismiss: i,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const m = Z(null);
  return O(() => {
    m.current?.focus();
  }, []), /* @__PURE__ */ a(
    "div",
    {
      ref: c,
      id: d,
      style: o,
      className: ["mds-confirm-sheet", s].filter(Boolean).join(" "),
      ...l,
      children: /* @__PURE__ */ g(
        ie,
        {
          label: e,
          onDismiss: i,
          className: "mds-confirm-sheet__sheet",
          role: "alertdialog",
          "data-ds-check": "confirm-sheet",
          children: [
            /* @__PURE__ */ g("div", { className: "mds-confirm-sheet-head", children: [
              /* @__PURE__ */ a("span", { className: "mds-confirm-sheet-icon", children: /* @__PURE__ */ a(Hn, {}) }),
              /* @__PURE__ */ a("h2", { className: "mds-confirm-sheet-title mds-type-title-section", children: e }),
              /* @__PURE__ */ a("p", { className: "mds-confirm-sheet-sentence", children: t })
            ] }),
            /* @__PURE__ */ g("div", { className: "mds-confirm-sheet-actions", children: [
              /* @__PURE__ */ a(
                ae,
                {
                  ref: m,
                  variant: "secondary",
                  className: "mds-confirm-sheet-back",
                  onPress: i,
                  children: f("button.back")
                }
              ),
              /* @__PURE__ */ a(ae, { variant: "danger", className: "mds-confirm-sheet-confirm", onPress: r, children: n })
            ] })
          ]
        }
      )
    }
  );
}
const ys = [
  "default",
  "focused",
  "pressed"
];
function vs({
  selected: e = !1,
  onPress: t,
  onLongPress: n,
  className: r,
  id: i,
  style: s,
  ref: d,
  ...o
}) {
  const { isPressed: c, pressProps: l } = A({ onPress: t, onLongPress: n }), m = f(e ? "sr.askUnread" : "sr.ask"), u = ["mds-ask-button", c ? "mds-ask-button--pressed" : "", r].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "button",
    {
      ref: d,
      id: i,
      style: s,
      type: "button",
      className: u,
      "aria-label": m,
      ...o,
      ...l,
      children: [
        /* @__PURE__ */ a(Ct, { size: 28 }),
        e ? /* @__PURE__ */ a("span", { className: "mds-ask-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const ws = [
  "default",
  "pressed",
  "focused",
  "unreadDot",
  "longPressRecording"
];
function Ns({
  value: e = 0,
  label: t,
  onPress: n,
  className: r,
  id: i,
  style: s,
  ref: d,
  ...o
}) {
  const { isPressed: c, pressProps: l } = A({ onPress: n }), m = qe(e, Ye.unread), u = t ?? (e > 0 ? f("sr.notificationsCount", { counted: m }) : f("sr.notifications")), p = [
    "mds-notifications-button",
    c ? "mds-notifications-button--pressed" : "",
    e > 0 ? "mds-notifications-button--unread" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "button",
    {
      ref: d,
      id: i,
      style: s,
      type: "button",
      className: p,
      "aria-label": u,
      ...o,
      ...l,
      children: [
        /* @__PURE__ */ a(Dt, {}),
        e > 0 ? /* @__PURE__ */ a("span", { className: "mds-notifications-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const As = [
  "default",
  "pressed",
  "focused",
  "unreadDot"
];
function Hs({
  label: e,
  caption: t,
  locked: n = !1,
  onPress: r,
  className: i,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const { isPressed: l, pressProps: m } = A({ onPress: r }), u = [
    "mds-project-switcher",
    l ? "mds-project-switcher--pressed" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "button",
    {
      ref: o,
      id: s,
      style: d,
      type: "button",
      className: u,
      ...c,
      ...m,
      children: [
        /* @__PURE__ */ a(Me, { size: "sm", variant: "canvas", value: e }),
        /* @__PURE__ */ g("span", { className: "mds-project-switcher-text", children: [
          /* @__PURE__ */ a("span", { className: "mds-project-switcher-name mds-type-body-strong", children: e }),
          t ? /* @__PURE__ */ a("span", { className: "mds-project-switcher-role", children: t }) : null
        ] }),
        n ? null : /* @__PURE__ */ a(Ue, { className: "mds-project-switcher-caret" })
      ]
    }
  );
}
const Ss = [
  "default",
  "pressed",
  "focused",
  "withCaret",
  "singleRoleNoCaret"
];
function Ps({
  leading: e,
  trailing: t,
  caption: n = !1,
  label: r,
  className: i,
  id: s,
  style: d,
  ref: o,
  children: c,
  ...l
}) {
  const m = [
    "mds-context-bar",
    n ? "mds-context-bar--scrolled" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "div",
    {
      ref: o,
      id: s,
      style: d,
      className: m,
      role: "banner",
      "aria-label": r,
      ...l,
      children: [
        /* @__PURE__ */ a("div", { className: "mds-context-bar-start", children: e ?? c }),
        /* @__PURE__ */ a("div", { className: "mds-context-bar-end", children: t })
      ]
    }
  );
}
const Bs = [
  "default",
  "mainScreenSwitcher",
  "subScreenBack",
  "scrolledHairline",
  "notScrolled"
];
function Ms({
  label: e,
  selected: t = !1,
  leading: n,
  onPress: r,
  className: i,
  ref: s,
  ...d
}) {
  const { isPressed: o, pressProps: c } = A({ onPress: r }), l = [
    "mds-tab",
    t ? "mds-tab--active" : "",
    o ? "mds-tab--pressed" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "button",
    {
      ref: s,
      type: "button",
      role: "tab",
      className: l,
      "aria-selected": t,
      "aria-current": t ? "page" : void 0,
      tabIndex: t ? 0 : -1,
      ...d,
      ...c,
      children: [
        n ? /* @__PURE__ */ a("span", { className: "mds-tab-icon", "aria-hidden": "true", children: n }) : null,
        /* @__PURE__ */ a("span", { className: "mds-tab-label", children: e })
      ]
    }
  );
}
function Zs({
  children: e,
  value: t,
  onChange: n,
  className: r,
  id: i,
  style: s,
  ref: d,
  ...o
}) {
  const c = ht.toArray(e), l = c.some(
    (u) => u && typeof u == "object" && "props" in u && u.props.selected !== void 0
  ), m = t ?? 0;
  return /* @__PURE__ */ a(
    "div",
    {
      ref: d,
      id: i,
      style: s,
      className: ["mds-tab-bar", r].filter(Boolean).join(" "),
      role: "tablist",
      ...o,
      children: c.map((u, p) => {
        if (u && typeof u == "object" && "props" in u) {
          const h = u.props, b = l ? h.selected === !0 : p === m;
          return {
            ...u,
            props: { ...h, selected: b, onPress: () => {
              h.onPress?.(), n?.(p);
            } }
          };
        }
        return u;
      })
    }
  );
}
const Cs = [
  "default",
  "activeFill",
  "pressed",
  "focused",
  "fiveTabs",
  "twoTabs"
];
function Ts({
  label: e,
  leading: t,
  caption: n = !1,
  trailing: r,
  className: i,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = [
    "mds-page-header",
    n && t ? "mds-page-header--collapsed" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g("header", { ref: o, id: s, style: d, className: l, ...c, children: [
    t,
    /* @__PURE__ */ a("h1", { className: "mds-page-header-title", children: e }),
    r ? /* @__PURE__ */ a("div", { className: "mds-page-header-end", children: r }) : null
  ] });
}
const js = [
  "default",
  "mainScreen",
  "subScreenBack",
  "collapsedOnScroll",
  "withTrailing"
], pr = {
  draft: f("saveState.draft"),
  sending: f("saveState.sending"),
  saved: f("saveState.saved"),
  failed: f("saveState.failed")
};
function $s({
  saveState: e,
  className: t,
  id: n,
  style: r,
  ref: i,
  ...s
}) {
  const d = Qe(e === "sending"), o = [
    "mds-save-state",
    `mds-save-state--${e}`,
    e === "sending" && !d ? "mds-save-state--pending-delay" : "",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(
    "span",
    {
      ref: i,
      id: n,
      style: r,
      className: o,
      role: e === "failed" ? "alert" : void 0,
      "aria-busy": e === "sending" || void 0,
      ...s,
      children: [
        e === "draft" ? /* @__PURE__ */ a(mn, { size: 14 }) : e === "saved" ? /* @__PURE__ */ a("span", { className: "mds-save-state-icon", children: /* @__PURE__ */ a(Ke, { size: 14 }) }) : e === "failed" ? /* @__PURE__ */ a(Se, { size: 14 }) : null,
        /* @__PURE__ */ a("span", { className: "mds-save-state-text", children: pr[e] }),
        e === "saved" ? /* @__PURE__ */ a("span", { className: "mds-visually-hidden", children: f("sr.saveSaved") }) : null,
        e === "failed" ? /* @__PURE__ */ a("span", { className: "mds-visually-hidden", children: f("sr.saveFailed") }) : null
      ]
    }
  );
}
const Vs = [
  "draft",
  "sending",
  "saved",
  "failed"
];
function Is({
  label: e,
  trailing: t,
  onDismiss: n,
  className: r,
  id: i,
  style: s,
  ref: d,
  ...o
}) {
  const c = Z(null), l = Z(0), m = Z(0), u = t ? 5e3 : 3e3;
  O(() => (l.current = u, m.current = Date.now(), c.current = window.setTimeout(() => n?.(), u), () => {
    c.current && window.clearTimeout(c.current), c.current = null;
  }), [e, u]);
  const p = () => {
    c.current && (window.clearTimeout(c.current), c.current = null, l.current -= Date.now() - m.current);
  }, h = () => {
    c.current || (m.current = Date.now(), c.current = window.setTimeout(() => n?.(), Math.max(0, l.current)));
  };
  return /* @__PURE__ */ g(
    "div",
    {
      ref: d,
      id: i,
      style: s,
      className: ["mds-toast", r].filter(Boolean).join(" "),
      role: "status",
      onFocus: p,
      onBlur: h,
      ...o,
      children: [
        /* @__PURE__ */ a("span", { className: "mds-toast-text", children: e }),
        t ? /* @__PURE__ */ a("span", { className: "mds-toast-action", children: t }) : null
      ]
    }
  );
}
const Fs = ["default", "withAction", "focusedPaused"], fr = {
  offline: pn,
  locked: gn,
  info: kn
};
function Ds({
  tone: e,
  label: t,
  trailing: n,
  className: r,
  id: i,
  style: s,
  ref: d,
  ...o
}) {
  const c = fr[e];
  return /* @__PURE__ */ g(
    "div",
    {
      ref: d,
      id: i,
      style: s,
      className: ["mds-inline-banner", `mds-inline-banner--${e}`, r].filter(Boolean).join(" "),
      role: "status",
      ...o,
      children: [
        /* @__PURE__ */ a(c, {}),
        /* @__PURE__ */ a("span", { className: "mds-inline-banner-text", children: t }),
        n ? /* @__PURE__ */ a("span", { className: "mds-inline-banner-action", children: n }) : null
      ]
    }
  );
}
const Ls = ["offline", "locked", "info", "withAction"];
function Es({
  label: e,
  trailing: t,
  className: n,
  id: r,
  style: i,
  ref: s,
  ...d
}) {
  return /* @__PURE__ */ g(
    "div",
    {
      ref: s,
      id: r,
      style: i,
      className: ["mds-empty-state", n].filter(Boolean).join(" "),
      ...d,
      children: [
        /* @__PURE__ */ a("p", { className: "mds-empty-state-sentence", children: e }),
        t ? /* @__PURE__ */ a("div", { className: "mds-empty-state-action", children: t }) : null
      ]
    }
  );
}
const Rs = ["default", "withAction"];
function Os({
  variant: e,
  className: t,
  id: n,
  style: r,
  ref: i,
  ...s
}) {
  return /* @__PURE__ */ a(
    "span",
    {
      ref: i,
      id: n,
      style: r,
      "aria-hidden": "true",
      className: ["mds-skeleton", `mds-skeleton--${e}`, t].filter(Boolean).join(" "),
      ...s
    }
  );
}
const zs = ["body", "caption", "hero", "mark"];
export {
  Be as ActionBar,
  Fi as ActionBarStates,
  Pi as AmountField,
  Bi as AmountFieldStates,
  Mi as AmountKeypad,
  Zi as AmountKeypadStates,
  wr as AmountVisibilityProvider,
  ua as AmountVisibilityToggle,
  gi as AmountVisibilityToggleStates,
  Ot as AmountsHiddenIcon,
  Et as AmountsShownIcon,
  Yr as AppointmentIcon,
  vs as AskButton,
  ws as AskButtonStates,
  Ct as AskSymbolIcon,
  Yt as BackIcon,
  Ln as BackspaceIcon,
  ae as Button,
  Ii as ButtonStates,
  Xe as CalendarIcon,
  Qr as CameraIcon,
  ii as ChartIcon,
  bi as Checkbox,
  ki as CheckboxStates,
  ue as ClearIcon,
  Gn as ClockIcon,
  Qt as CloseIcon,
  xs as ConfirmSheet,
  ys as ConfirmSheetStates,
  Ps as ContextBar,
  Bs as ContextBarStates,
  Hn as DangerIcon,
  Ri as DatePicker,
  Oi as DatePickerStates,
  zi as DateQuickChips,
  Yi as DateQuickChipsStates,
  Er as DebtIcon,
  jr as DeltaDownIcon,
  Tr as DeltaUpIcon,
  mn as DraftIcon,
  _i as DurationPicker,
  Qi as DurationPickerStates,
  Es as EmptyState,
  Rs as EmptyStateStates,
  vn as EntityApprovedIcon,
  Me as EntityMark,
  Ki as EntityMarkStates,
  Nn as EntityPendingIcon,
  Ue as ExpandIcon,
  en as FieldErrorIcon,
  di as FileIcon,
  es as FilterChips,
  ts as FilterChipsStates,
  We as ForwardIcon,
  Fr as FundBankIcon,
  Ir as FundCashIcon,
  Dr as FundWalletIcon,
  cs as HeroSurface,
  ms as HeroSurfaceStates,
  K as IconButton,
  $i as IconButtonStates,
  kn as InfoIcon,
  Ds as InlineBanner,
  Ls as InlineBannerStates,
  Or as JobFailedIcon,
  Nt as LONG_PRESS_MS,
  Ar as LayersProvider,
  li as LinkIcon,
  gn as LockedIcon,
  ni as MapPinIcon,
  hr as Metric,
  bs as MetricSmall,
  ks as MetricSmallStates,
  gs as MetricStates,
  Wr as MicIcon,
  zn as MinusIcon,
  pi as Money,
  fi as MoneyStates,
  Sa as MonthGrid,
  Vi as MonthGridStates,
  it as MonthSheet,
  Vr as MoreIcon,
  Xr as MovementInIcon,
  Jr as MovementOutIcon,
  Ci as MovementTypeControl,
  Ti as MovementTypeControlStates,
  Zr as NavDeliveryIcon,
  Br as NavFinanceIcon,
  Cr as NavMarketIcon,
  Mr as NavOrdersIcon,
  Pr as NavTodayIcon,
  ci as NoteIcon,
  Ns as NotificationsButton,
  As as NotificationsButtonStates,
  Dt as NotificationsIcon,
  ps as ObjectCard,
  fs as ObjectCardStates,
  us as ObjectRow,
  hs as ObjectRowStates,
  pn as OfflineIcon,
  zr as OrderIcon,
  Ts as PageHeader,
  js as PageHeaderStates,
  ui as PauseIcon,
  $a as PeriodSwitcher,
  Ei as PeriodSwitcherStates,
  ei as PhoneIcon,
  Rn as PlusIcon,
  qr as PriceTierIcon,
  Hs as ProjectSwitcher,
  Ss as ProjectSwitcherStates,
  ya as QuantityStepper,
  ji as QuantityStepperStates,
  Rr as QuoteIcon,
  hi as RTL_FLIP_ICONS,
  xi as Radio,
  yi as RadioStates,
  _r as ReportIcon,
  $r as RetryIcon,
  Gr as ReviewIcon,
  $s as SaveState,
  Vs as SaveStateStates,
  Ni as SearchField,
  Ai as SearchFieldStates,
  Kt as SearchIcon,
  ss as Section,
  os as SectionStates,
  at as SegmentedControl,
  Di as SegmentedControlStates,
  He as SelectedIcon,
  ai as SendIcon,
  ie as Sheet,
  Li as SheetStates,
  Os as Skeleton,
  zs as SkeletonStates,
  mi as SlidersIcon,
  Wi as StatusBadge,
  Ui as StatusBadgeStates,
  Ur as StopIcon,
  ns as Surface,
  as as SurfaceStates,
  Zs as TabBar,
  Cs as TabBarStates,
  Ms as TabBarTab,
  ri as TableIcon,
  Hi as TextArea,
  Si as TextAreaStates,
  Xi as TextField,
  Ji as TextFieldStates,
  ds as Tile,
  ls as TileStates,
  qi as TimePicker,
  Gi as TimePickerStates,
  Is as Toast,
  Fs as ToastStates,
  vi as Toggle,
  wi as ToggleStates,
  Ke as ToneDoneIcon,
  ln as ToneInfoIcon,
  Se as ToneProblemIcon,
  sn as ToneWaitingIcon,
  Lr as TransferIcon,
  Kr as TrashIcon,
  rs as Well,
  is as WellStates,
  ti as WhatsappIcon,
  si as ZoomInIcon,
  oi as ZoomOutIcon,
  pt as ar,
  Aa as currentPeriod,
  E as dateKey,
  Pe as daysInMonth,
  j as epochDays,
  C as formatDateParts,
  ve as formatDuration,
  xe as formatMoney,
  tt as formatPeriod,
  vr as formatTime12,
  st as formatTimeValue,
  Q as fromEpochDays,
  V as getMoneyTexts,
  ze as getToken,
  Ha as isSamePeriod,
  Na as monthEndOf,
  et as monthStartOf,
  ga as normalizeAmount,
  he as normalizePeriod,
  yr as overriddenText,
  kr as overrideTexts,
  Y as parseDateParts,
  oe as periodEnd,
  qe as pluralAr,
  Ye as pluralNouns,
  xr as resetTextOverrides,
  re as startOfToday,
  Ve as stepPeriod,
  f as t,
  G as tokens,
  W as useAmountVisibility,
  Nr as useCountUp,
  Sr as useOpenSheetCount,
  Qe as usePendingDelay,
  A as usePress,
  Hr as useSheetLayer,
  St as useVisualViewport,
  Je as weekStartOf
};
