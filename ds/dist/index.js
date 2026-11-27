import { jsx as n, jsxs as u, Fragment as F } from "react/jsx-runtime";
import { useMemo as X, useContext as K, createContext as le, useState as V, useRef as H, useCallback as C, useEffect as T, useReducer as ke, useId as U, useLayoutEffect as ve, Children as we } from "react";
const O = {
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
    "scroll-end-padding": 16,
    "photo-columns": 3,
    "timeline-hours": 48
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
function Ae(e) {
  let t = O;
  for (const a of e.split("."))
    t = t[a];
  return t;
}
const v = {
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
  "title.checkbox": { kind: "title", text: "مربع الاختيار" }
  // ---------------------------------------------------------------------------
};
function y(e, t) {
  let a = v[e].text;
  if (t)
    for (const [i, s] of Object.entries(t))
      a = a.replaceAll(`{${i}}`, String(s));
  return a;
}
const ye = {
  movements: { zero: "لا حركات", one: "حركة واحدة", two: "حركتين", few: "حركات", many: "حركة" },
  orders: { zero: "لا طلبات", one: "طلب واحد", two: "طلتان", few: "طلبات", many: "طلب" },
  quotes: { zero: "لا عروض", one: "عرض واحد", two: "عرضان", few: "عروض", many: "عرض" },
  results: { zero: "لا نتائج", one: "نتيجة واحدة", two: "نتيجتان", few: "نتائج", many: "نتيجة" },
  unread: { zero: "لا شيء غير مقروء", one: "غير مقروء واحد", two: "غير مقروءان", few: "غير مقروءة", many: "غير مقروءة" }
}, B = {
  unit: v["money.unit"].text,
  minus: v["money.ariaMinus"].text,
  dinar: v["money.ariaDinar"].text,
  fils: v["money.ariaFils"].text,
  and: v["money.ariaAnd"].text,
  forYou: v["money.forYou"].text,
  againstYou: v["money.againstYou"].text,
  hidden: v["money.ariaHidden"].text,
  missing: v["money.ariaMissing"].text,
  hiddenGlyph: v["money.hiddenGlyph"].text,
  missingGlyph: v["money.missing"].text
}, Ne = new Intl.PluralRules("ar");
function He(e, t) {
  switch (Ne.select(e)) {
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
const Be = "ص", Ze = "م";
function re(e) {
  return `${e < 10 ? "0" : ""}${e}`;
}
function Se(e) {
  return e instanceof Date ? { h: e.getHours(), m: e.getMinutes() } : e;
}
function Yn(e) {
  const { h: t, m: a } = Se(e), i = t < 12 ? Be : Ze, s = t % 12 === 0 ? 12 : t % 12;
  return `${re(s)}:${re(a)} ${i}`;
}
const G = "−", Me = "+", E = 3;
function Ce(e) {
  const t = String(e).trim(), a = t.startsWith("-"), i = a ? t.slice(1) : t, [s = "0", r = ""] = i.split("."), o = s.replace(/[^0-9]/g, "") || "0", d = (r + "000").slice(0, E), l = BigInt(o) * 10n ** BigInt(E) + BigInt(d || "0");
  return { negative: a, fils: l };
}
function Pe(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function Ve(e) {
  const t = 10n ** BigInt(E), a = e / t, i = e % t;
  return {
    int: Pe(a.toString()),
    frac: i === 0n ? "" : `.${i.toString().padStart(E, "0")}`
  };
}
function q(e, t) {
  const a = 10n ** BigInt(E), i = e / a, s = e % a;
  let r = `${i.toString()} ${t.dinar}`;
  return s !== 0n && (r += ` ${t.and}${s.toString()} ${t.fils}`), r;
}
function Q(e, t) {
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
    const g = t.debt === "forYou" ? a.forYou : t.debt === "againstYou" ? a.againstYou : "", f = g ? `${g} ${a.hiddenGlyph} ${a.unit}` : `${a.hiddenGlyph} ${a.unit}`;
    return {
      missing: !1,
      hidden: !0,
      debt: t.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: a.unit,
      debtWord: g,
      display: f,
      aria: a.hidden
    };
  }
  const { negative: s, fils: r } = Ce(e), o = Ve(r), d = t.debt === "forYou" ? a.forYou : t.debt === "againstYou" ? a.againstYou : "", l = d ? "" : t.flow === "in" ? Me : t.flow === "out" ? G : t.flow === "transfer" ? "" : s ? G : "", c = `${l}${o.int}${o.frac}`, h = d ? `${d} ${c} ${a.unit}` : `${c} ${a.unit}`;
  let m;
  return d ? m = `${d} ${q(r, a)}` : l === G ? m = `${a.minus} ${q(r, a)}` : m = q(r, a), {
    missing: !1,
    hidden: !1,
    debt: t.debt ?? null,
    sign: l,
    int: o.int,
    frac: o.frac,
    unit: a.unit,
    debtWord: d,
    display: h,
    aria: m
  };
}
const de = le({ hidden: !1 });
function On({ children: e, hidden: t = !1 }) {
  const a = X(() => ({ hidden: t }), [t]);
  return /* @__PURE__ */ n(de.Provider, { value: a, children: e });
}
function j() {
  const { hidden: e } = K(de);
  return { hidden: e, visible: !e };
}
const je = 500, Te = Ae("motion.press-cancel-px");
function N(e = {}) {
  const { onPress: t, onLongPress: a, disabled: i } = e, [s, r] = V(!1), o = H(null), d = H(null), l = H(!1), c = C(() => {
    d.current !== null && (clearTimeout(d.current), d.current = null);
  }, []), h = C(() => {
    c(), o.current = null, l.current = !1, r(!1);
  }, [c]), m = C(
    (p) => {
      if (!i && !(p.pointerType === "mouse" && p.button !== 0)) {
        if (typeof p.currentTarget.setPointerCapture == "function")
          try {
            p.currentTarget.setPointerCapture(p.pointerId);
          } catch {
          }
        o.current = { x: p.clientX, y: p.clientY }, l.current = !1, r(!0), a && (d.current = setTimeout(() => {
          l.current = !0, a();
        }, je));
      }
    },
    [i, a]
  ), g = C(
    (p) => {
      if (!s || o.current === null) return;
      const b = p.clientX - o.current.x, x = p.clientY - o.current.y;
      Math.hypot(b, x) > Te && h();
    },
    [s, h]
  ), f = C(
    (p) => {
      if (!s) return;
      const b = l.current;
      h(), !b && !i && t?.();
    },
    [s, i, t, h]
  );
  return {
    isPressed: s,
    pressProps: {
      onPointerDown: m,
      onPointerMove: g,
      onPointerUp: f,
      onPointerCancel: h
    }
  };
}
const Ie = () => typeof window > "u" || !window.visualViewport ? {
  height: typeof window > "u" ? 0 : window.innerHeight,
  offsetTop: 0,
  scale: 1,
  keyboardHeight: 0
} : ce(window.visualViewport);
function ce(e) {
  const t = e.height, a = e.offsetTop, i = Math.max(0, window.innerHeight - t - a);
  return { height: t, offsetTop: a, scale: e.scale, keyboardHeight: i };
}
function $e() {
  const [e, t] = V(Ie);
  return T(() => {
    const a = window.visualViewport;
    if (!a) return;
    const i = () => t(ce(a));
    return i(), a.addEventListener("resize", i), a.addEventListener("scroll", i), window.addEventListener("resize", i), window.addEventListener("orientationchange", i), () => {
      a.removeEventListener("resize", i), a.removeEventListener("scroll", i), window.removeEventListener("resize", i), window.removeEventListener("orientationchange", i);
    };
  }, []), e;
}
const J = le({
  sheetIds: [],
  registerSheet: () => {
  },
  unregisterSheet: () => {
  }
});
function Le(e, t) {
  switch (t.type) {
    case "register":
      return e.includes(t.id) ? e : [...e, t.id];
    case "unregister":
      return e.includes(t.id) ? e.filter((a) => a !== t.id) : e;
    default:
      return e;
  }
}
function _n({ children: e }) {
  const [t, a] = ke(Le, []), i = C((o) => a({ type: "register", id: o }), []), s = C((o) => a({ type: "unregister", id: o }), []), r = X(
    () => ({ sheetIds: t, registerSheet: i, unregisterSheet: s }),
    [t, i, s]
  );
  return /* @__PURE__ */ n(J.Provider, { value: r, children: e });
}
function Gn() {
  const { sheetIds: e, registerSheet: t, unregisterSheet: a } = K(J), i = U();
  ve(() => (t(i), () => a(i)), [i, t, a]);
  const s = e.indexOf(i) + 1 || e.length + 1, r = Math.min(s, 2), o = s === e.length;
  return {
    level: r,
    overLimit: s > 2,
    sheetZ: r === 1 ? "var(--mds-layer-sheet)" : "var(--mds-layer-sheet-2)",
    scrimZ: r === 1 ? "var(--mds-layer-scrim)" : "var(--mds-layer-scrim-2)",
    isTop: o
  };
}
function qn() {
  const { sheetIds: e } = K(J);
  return e.length;
}
const Fe = /* @__PURE__ */ u("g", { transform: "translate(16 16)", id: "micro-symbol-master-2", children: [
  /* @__PURE__ */ n("g", { id: "module-top", transform: "rotate(0 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-top", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ n("g", { id: "module-right", transform: "rotate(90 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-right", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-signal)" }) }),
  /* @__PURE__ */ n("g", { id: "module-bottom", transform: "rotate(180 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-bottom", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ n("g", { id: "module-left", transform: "rotate(270 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-left", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-data)" }) })
] });
function Ee({ size: e = 28, className: t, ...a }) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 224 224",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", t].filter(Boolean).join(" "),
      ...a,
      children: Fe
    }
  );
}
const De = {
  regular: /* @__PURE__ */ n("path", { d: "M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z" })
};
function Wn({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: De[t]
    }
  );
}
const Re = {
  regular: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z" })
};
function Qn({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Re[t]
    }
  );
}
const Ye = {
  regular: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z" })
};
function Xn({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Ye[t]
    }
  );
}
const Oe = {
  regular: /* @__PURE__ */ n("path", { d: "M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A8.13,8.13,0,0,0,255.43,117ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208ZM32,136V72H176v64Zm160,72a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm0-96V88h34.58l9.6,24Z" })
};
function Kn({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Oe[t]
    }
  );
}
const _e = {
  regular: /* @__PURE__ */ n("path", { d: "M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z" })
};
function Un({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: _e[t]
    }
  );
}
const Ge = {
  regular: /* @__PURE__ */ n("path", { d: "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" })
};
function qe({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Ge[t]
    }
  );
}
const We = {
  regular: /* @__PURE__ */ n("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" })
};
function Qe({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: We[t]
    }
  );
}
const Xe = {
  regular: /* @__PURE__ */ n("path", { d: "M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" })
};
function Ke({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Xe[t]
    }
  );
}
const Ue = {
  regular: /* @__PURE__ */ n("path", { d: "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" })
};
function Jn({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Ue[t]
    }
  );
}
const Je = {
  bold: /* @__PURE__ */ n("path", { d: "M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" })
};
function ze({
  size: e = 16,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: Je[t]
    }
  );
}
const et = {
  bold: /* @__PURE__ */ n("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" })
};
function tt({
  size: e = 16,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: et[t]
    }
  );
}
const nt = {
  regular: /* @__PURE__ */ n("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function at({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: nt[t]
    }
  );
}
const it = {
  bold: /* @__PURE__ */ n("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function z({
  size: e = 16,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: it[t]
    }
  );
}
const st = {
  regular: /* @__PURE__ */ n("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" })
};
function rt({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: st[t]
    }
  );
}
const ot = {
  fill: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function lt({
  size: e = 20,
  weight: t = "fill",
  className: a,
  ...i
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
      ...i,
      children: ot[t]
    }
  );
}
const dt = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function ct({
  size: e = 16,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: dt[t]
    }
  );
}
const mt = {
  bold: /* @__PURE__ */ n("path", { d: "M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" })
};
function zn({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: mt[t]
    }
  );
}
const ut = {
  bold: /* @__PURE__ */ n("path", { d: "M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" })
};
function ea({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: ut[t]
    }
  );
}
const ht = {
  bold: /* @__PURE__ */ n("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function me({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: ht[t]
    }
  );
}
const ft = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z" })
};
function gt({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: ft[t]
    }
  );
}
const pt = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function ee({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: pt[t]
    }
  );
}
const bt = {
  bold: /* @__PURE__ */ n("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" })
};
function xt({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: bt[t]
    }
  );
}
const kt = {
  bold: /* @__PURE__ */ n("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" })
};
function vt({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: kt[t]
    }
  );
}
const wt = {
  regular: /* @__PURE__ */ n("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" })
};
function ta({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: wt[t]
    }
  );
}
const At = {
  regular: /* @__PURE__ */ n("path", { d: "M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z" })
};
function yt({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: At[t]
    }
  );
}
const Nt = {
  regular: /* @__PURE__ */ n("path", { d: "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z" })
};
function Ht({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Nt[t]
    }
  );
}
const Bt = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" })
};
function Zt({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Bt[t]
    }
  );
}
const St = {
  regular: /* @__PURE__ */ n("path", { d: "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z" })
};
function na({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: St[t]
    }
  );
}
const Mt = {
  fill: /* @__PURE__ */ n("path", { d: "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" })
};
function Ct({
  size: e = 14,
  weight: t = "fill",
  className: a,
  ...i
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
      ...i,
      children: Mt[t]
    }
  );
}
const Pt = {
  fill: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" })
};
function Vt({
  size: e = 14,
  weight: t = "fill",
  className: a,
  ...i
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
      ...i,
      children: Pt[t]
    }
  );
}
const jt = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function Tt({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: jt[t]
    }
  );
}
const It = {
  regular: /* @__PURE__ */ n("path", { d: "M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM80,40h40V56H80ZM54.25,72h147.5l20,80H34.25ZM32,192V168H224v24ZM64,96a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,96ZM64,128a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,128Z" })
};
function aa({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: It[t]
    }
  );
}
const $t = {
  regular: /* @__PURE__ */ n("path", { d: "M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z" })
};
function ia({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: $t[t]
    }
  );
}
const Lt = {
  regular: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" })
};
function sa({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Lt[t]
    }
  );
}
const Ft = {
  regular: /* @__PURE__ */ n("path", { d: "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z" })
};
function ra({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Ft[t]
    }
  );
}
const Et = {
  regular: /* @__PURE__ */ n("path", { d: "M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9ZM164,96a36,36,0,0,0,5.9-.48,36,36,0,1,0,28.22-47A36,36,0,1,0,164,96Zm60-12a20,20,0,1,1-20-20A20,20,0,0,1,224,84ZM164,40a20,20,0,0,1,19.25,14.61,36,36,0,0,0-15,24.93A20.42,20.42,0,0,1,164,80a20,20,0,0,1,0-40Z" })
};
function oa({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Et[t]
    }
  );
}
const Dt = {
  regular: /* @__PURE__ */ n("path", { d: "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" })
};
function la({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Dt[t]
    }
  );
}
const Rt = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function da({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Rt[t]
    }
  );
}
const Yt = {
  regular: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" })
};
function ca({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Yt[t]
    }
  );
}
const Ot = {
  regular: /* @__PURE__ */ n("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function ma({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Ot[t]
    }
  );
}
const _t = {
  regular: /* @__PURE__ */ n("path", { d: "M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z" })
};
function ua({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: _t[t]
    }
  );
}
const Gt = {
  regular: /* @__PURE__ */ n("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" })
};
function ha({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Gt[t]
    }
  );
}
const qt = {
  regular: /* @__PURE__ */ n("path", { d: "M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z" })
};
function fa({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: qt[t]
    }
  );
}
const Wt = {
  regular: /* @__PURE__ */ n("path", { d: "M216,40H68.53a16.08,16.08,0,0,0-13.72,7.77L9.14,123.88a8,8,0,0,0,0,8.24l45.67,76.11A16.08,16.08,0,0,0,68.53,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM61.67,204.12,68.53,200h0ZM216,200H68.53l-43.2-72,43.2-72H216ZM106.34,146.34,124.69,128l-18.35-18.34a8,8,0,0,1,11.32-11.32L136,116.69l18.34-18.35a8,8,0,0,1,11.32,11.32L147.31,128l18.35,18.34a8,8,0,0,1-11.32,11.32L136,139.31l-18.34,18.35a8,8,0,0,1-11.32-11.32Z" })
};
function ga({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Wt[t]
    }
  );
}
const Qt = {
  regular: /* @__PURE__ */ n("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" })
};
function pa({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Qt[t]
    }
  );
}
const Xt = {
  regular: /* @__PURE__ */ n("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" })
};
function ba({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Xt[t]
    }
  );
}
const Kt = {
  regular: /* @__PURE__ */ n("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function xa({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Kt[t]
    }
  );
}
const Ut = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" })
};
function ka({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Ut[t]
    }
  );
}
const Jt = {
  regular: /* @__PURE__ */ n("path", { d: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z" })
};
function va({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: Jt[t]
    }
  );
}
const zt = {
  regular: /* @__PURE__ */ n("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" })
};
function wa({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: zt[t]
    }
  );
}
const en = {
  regular: /* @__PURE__ */ n("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" })
};
function Aa({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: en[t]
    }
  );
}
const tn = {
  regular: /* @__PURE__ */ n("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" })
};
function ya({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: tn[t]
    }
  );
}
const nn = {
  regular: /* @__PURE__ */ n("path", { d: "M197.66,69.66,83.31,184H168a8,8,0,0,1,0,16H64a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v84.69L186.34,58.34a8,8,0,0,1,11.32,11.32Z" })
};
function Na({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: nn[t]
    }
  );
}
const an = {
  regular: /* @__PURE__ */ n("path", { d: "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" })
};
function Ha({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: an[t]
    }
  );
}
const sn = {
  regular: /* @__PURE__ */ n("path", { d: "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" })
};
function Ba({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: sn[t]
    }
  );
}
const rn = {
  regular: /* @__PURE__ */ n("path", { d: "M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" })
};
function Za({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: rn[t]
    }
  );
}
const on = {
  regular: /* @__PURE__ */ n("path", { d: "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" })
};
function Sa({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: on[t]
    }
  );
}
const ln = {
  regular: /* @__PURE__ */ n("path", { d: "M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z" })
};
function Ma({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: ln[t]
    }
  );
}
const dn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z" })
};
function Ca({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: dn[t]
    }
  );
}
const cn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" })
};
function Pa({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: cn[t]
    }
  );
}
const mn = {
  regular: /* @__PURE__ */ n("path", { d: "M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function Va({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: mn[t]
    }
  );
}
const un = {
  regular: /* @__PURE__ */ n("path", { d: "M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function ja({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: un[t]
    }
  );
}
const hn = {
  regular: /* @__PURE__ */ n("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" })
};
function Ta({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: hn[t]
    }
  );
}
const fn = {
  regular: /* @__PURE__ */ n("path", { d: "M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" })
};
function Ia({
  size: e = 20,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: fn[t]
    }
  );
}
const gn = {
  regular: /* @__PURE__ */ n("path", { d: "M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z" })
};
function $a({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: gn[t]
    }
  );
}
const pn = {
  regular: /* @__PURE__ */ n("path", { d: "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z" })
};
function La({
  size: e = 24,
  weight: t = "regular",
  className: a,
  ...i
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
      ...i,
      children: pn[t]
    }
  );
}
const bn = {
  bold: /* @__PURE__ */ n("path", { d: "M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z" })
};
function Fa({
  size: e = 14,
  weight: t = "bold",
  className: a,
  ...i
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
      ...i,
      children: bn[t]
    }
  );
}
const Ea = ["nav-delivery", "back", "forward", "transfer", "movement-in", "movement-out", "send"];
function Da({
  value: e,
  flow: t,
  debt: a,
  size: i = "md",
  state: s = "idle",
  disabled: r = !1,
  className: o,
  id: d,
  style: l,
  ref: c,
  ...h
}) {
  const { hidden: m } = j(), g = m && e !== null && e !== void 0, f = Q(e, { flow: t, debt: a, hidden: g, texts: B }), p = ["mds-money", `mds-money--${i}`, i === "lg" ? "mds-number-lg" : "", r ? "mds-money--disabled" : "", o].filter(Boolean).join(" ");
  return s === "loading" ? /* @__PURE__ */ n("span", { ref: c, id: d, style: l, className: p, "aria-busy": "true", ...h, children: /* @__PURE__ */ n("span", { className: "mds-money-skeleton", "aria-hidden": "true" }) }) : /* @__PURE__ */ u("span", { ref: c, id: d, style: l, className: p, ...h, children: [
    /* @__PURE__ */ u("span", { className: "mds-money-visual", "aria-hidden": "true", children: [
      f.debtWord ? /* @__PURE__ */ n("span", { className: "mds-money-debt", children: f.debtWord }) : null,
      f.missing ? /* @__PURE__ */ n("span", { className: "mds-money-missing", children: B.missingGlyph }) : /* @__PURE__ */ u(F, { children: [
        /* @__PURE__ */ n("bdi", { className: "mds-money-value", dir: "ltr", children: f.hidden ? B.hiddenGlyph : /* @__PURE__ */ u(F, { children: [
          /* @__PURE__ */ u("span", { className: "mds-money-integer", children: [
            f.sign,
            f.int
          ] }),
          f.frac ? /* @__PURE__ */ n("span", { className: "mds-money-fraction", children: f.frac }) : null
        ] }) }),
        /* @__PURE__ */ n("span", { className: "mds-money-unit", children: f.unit })
      ] })
    ] }, g ? "hidden" : "shown"),
    /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: f.aria })
  ] });
}
const Ra = [
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
function xn({
  onChange: e,
  disabled: t = !1,
  density: a = "regular",
  className: i,
  id: s,
  style: r,
  ref: o,
  ...d
}) {
  const { hidden: l, visible: c } = j(), h = l ? Ke : Qe, m = y(l ? "button.showAmounts" : "button.hideAmounts"), g = [
    "mds-amount-visibility-toggle",
    a === "large" ? "mds-amount-visibility-toggle--large" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      ref: o,
      id: s,
      style: r,
      ...d,
      type: "button",
      className: g,
      "aria-label": m,
      disabled: t,
      onClick: () => e?.(!c),
      children: /* @__PURE__ */ n(h, { size: 24 })
    }
  );
}
const Ya = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "amountsShown",
  "amountsHidden"
];
function Oa({
  label: e,
  caption: t,
  selected: a = !1,
  onChange: i,
  disabled: s = !1,
  state: r = "idle",
  className: o,
  id: d,
  style: l,
  ref: c,
  "aria-label": h,
  ...m
}) {
  const g = [
    // .mds-control-row (base.css): the shared row-plain anatomy; the box
    // aligns to the FIRST text line, so the alignment overrides to start.
    "mds-control-row",
    "mds-checkbox",
    a ? "mds-checkbox--selected" : "",
    s ? "mds-checkbox--disabled" : "",
    r === "error" ? "mds-checkbox--error" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("label", { ref: c, id: d, style: l, className: g, ...m, children: [
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        className: "mds-checkbox-input mds-sr-input",
        checked: a,
        disabled: s,
        onChange: (f) => i?.(f.target.checked),
        "aria-label": h,
        "aria-invalid": r === "error" || void 0
      }
    ),
    /* @__PURE__ */ n("span", { className: "mds-checkbox-box", "aria-hidden": "true", children: /* @__PURE__ */ n(z, { size: 14 }) }),
    /* @__PURE__ */ u("span", { className: "mds-checkbox-text mds-control-text", children: [
      /* @__PURE__ */ n("span", { className: "mds-checkbox-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ n("span", { className: "mds-checkbox-caption mds-type-caption", children: t }) : null
    ] }),
    r === "error" ? /* @__PURE__ */ n("span", { className: "mds-checkbox-error mds-type-caption", children: y("checkbox.tickThis") }) : null
  ] });
}
const _a = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function Ga({
  label: e,
  items: t,
  value: a,
  onChange: i,
  disabled: s = !1,
  state: r = "idle",
  className: o,
  id: d,
  style: l,
  ref: c,
  ...h
}) {
  const m = U(), g = [
    "mds-radio",
    s ? "mds-radio--disabled" : "",
    r === "error" ? "mds-radio--error" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("div", { ref: c, id: d, style: l, className: g, ...h, children: [
    /* @__PURE__ */ n("span", { className: "mds-radio-label mds-type-label", children: e }),
    /* @__PURE__ */ n("div", { className: "mds-radio-surface", role: "radiogroup", "aria-label": e, children: t.map((f) => {
      const p = f.value === a;
      return /* @__PURE__ */ u("label", { className: "mds-control-row mds-radio-row", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "radio",
            className: "mds-radio-input mds-sr-input",
            name: m,
            checked: p,
            disabled: s || f.disabled,
            onChange: () => i?.(f.value)
          }
        ),
        /* @__PURE__ */ n("span", { className: "mds-radio-circle", "aria-hidden": "true", children: /* @__PURE__ */ n("span", { className: "mds-radio-dot" }) }),
        /* @__PURE__ */ u("span", { className: "mds-radio-text mds-control-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-radio-row-label mds-type-body", children: f.label }),
          f.caption ? /* @__PURE__ */ n("span", { className: "mds-radio-caption mds-type-caption", children: f.caption }) : null
        ] })
      ] }, f.value);
    }) }),
    r === "error" ? /* @__PURE__ */ n("span", { className: "mds-radio-error mds-type-caption", children: y("radio.choose").replace("{label}", e) }) : null
  ] });
}
const qa = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function Wa({
  label: e,
  caption: t,
  selected: a = !1,
  onChange: i,
  disabled: s = !1,
  className: r,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const h = [
    // .mds-control-row (base.css): the whole row is the switch's press zone.
    "mds-control-row",
    "mds-toggle",
    a ? "mds-toggle--selected" : "",
    s ? "mds-toggle--disabled" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("label", { ref: l, id: o, style: d, className: h, ...c, children: [
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        className: "mds-toggle-input mds-sr-input",
        role: "switch",
        checked: a,
        disabled: s,
        onChange: (m) => i?.(m.target.checked),
        "aria-checked": a
      }
    ),
    /* @__PURE__ */ u("span", { className: "mds-toggle-text mds-control-text", children: [
      /* @__PURE__ */ n("span", { className: "mds-toggle-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ n("span", { className: "mds-toggle-caption mds-type-caption", children: t }) : null
    ] }),
    /* @__PURE__ */ n("span", { className: "mds-toggle-switch", "aria-hidden": "true", children: /* @__PURE__ */ n("span", { className: "mds-toggle-track", children: /* @__PURE__ */ n("span", { className: "mds-toggle-thumb", children: /* @__PURE__ */ n(z, { size: 14 }) }) }) })
  ] });
}
const Qa = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled"
];
function Xa({
  label: e,
  placeholder: t,
  value: a = "",
  onChange: i,
  disabled: s = !1,
  className: r,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const h = a.length > 0, m = [
    "mds-search-field",
    s ? "mds-search-field--disabled" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("div", { ref: l, id: o, style: d, className: m, ...c, children: [
    /* @__PURE__ */ n(rt, { size: 20 }),
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
        onChange: (g) => i?.(g.target.value)
      }
    ),
    h ? /* @__PURE__ */ n(
      kn,
      {
        onClear: () => {
          i?.("");
        }
      }
    ) : null
  ] });
}
function kn({ onClear: e }) {
  const { isPressed: t, pressProps: a } = N({ onPress: e });
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: ["mds-search-field-clear", t ? "mds-search-field-clear--pressed" : ""].filter(Boolean).join(" "),
      "data-ds-exempt": "",
      "aria-label": y("sr.clearSearch"),
      ...a,
      children: /* @__PURE__ */ n(lt, { size: 20 })
    }
  );
}
const Ka = [
  "default",
  "focused",
  "disabled",
  "withText"
];
function Ua({
  label: e,
  caption: t,
  value: a = "",
  onChange: i,
  placeholder: s,
  state: r = "idle",
  disabled: o = !1,
  optional: d = !1,
  className: l,
  id: c,
  style: h,
  ref: m,
  ...g
}) {
  const f = U(), p = X(() => `${f}-error`, [f]), b = [
    "mds-text-area",
    r === "error" ? "mds-text-area--error" : "",
    o ? "mds-text-area--disabled mds-field--disabled" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("div", { id: c, style: h, className: b, ...g, children: [
    /* @__PURE__ */ u("label", { className: "mds-text-area-label mds-type-label", htmlFor: c ?? f, children: [
      e,
      d ? /* @__PURE__ */ n("span", { className: "mds-text-area-optional mds-type-caption", children: y("field.optional") }) : null
    ] }),
    /* @__PURE__ */ n(
      "textarea",
      {
        ref: m,
        id: c ?? f,
        className: "mds-text-area-input mds-field-input",
        rows: 1,
        value: a,
        disabled: o,
        placeholder: s,
        "aria-multiline": "true",
        "aria-invalid": r === "error" || void 0,
        "aria-describedby": r === "error" ? p : void 0,
        enterKeyHint: "enter",
        onChange: (x) => i?.(x.target.value),
        onInput: (x) => {
          const w = x.currentTarget;
          w.style.height = "auto", w.style.height = `${w.scrollHeight}px`;
        }
      }
    ),
    r === "error" ? /* @__PURE__ */ u("span", { id: p, className: "mds-text-area-help mds-type-caption", children: [
      /* @__PURE__ */ n(ct, { size: 16 }),
      /* @__PURE__ */ n("span", { children: t })
    ] }) : t ? /* @__PURE__ */ n("span", { className: "mds-text-area-help mds-type-caption", children: /* @__PURE__ */ n("span", { children: t }) }) : null
  ] });
}
const Ja = [
  "default",
  "focused",
  "error",
  "disabled",
  "grown"
], oe = 1632, vn = 1641, wn = 1643;
function An(e) {
  let t = "", a = !1;
  for (const s of e) {
    const r = s.codePointAt(0);
    if (r >= oe && r <= vn) {
      const o = String(r - oe);
      t = i(t, o);
      continue;
    }
    if (s >= "0" && s <= "9") {
      t = i(t, s);
      continue;
    }
    if ((r === wn || s === "." || s === ",") && !a) {
      t === "" && (t = "0"), t += ".", a = !0;
      continue;
    }
  }
  return t;
  function i(s, r) {
    return s.includes(".") && s.length - s.indexOf(".") - 1 >= 3 || s === "0" && r === "0" ? s : s === "0" ? r : s + r;
  }
}
function za({
  label: e,
  caption: t,
  value: a = "",
  onChange: i,
  disabled: s = !1,
  state: r = "idle",
  draft: o = !1,
  className: d,
  id: l,
  style: c,
  ref: h,
  ...m
}) {
  const [g, f] = V(!1), p = [
    "mds-amount-field",
    s ? "mds-amount-field--disabled" : "",
    r === "error" ? "mds-amount-field--error" : "",
    o ? "mds-amount-field--draft" : "",
    d
  ].filter(Boolean).join(" "), b = g || a === "" ? a : Q(a, { texts: B }).int + (a.includes(".") ? Q(a, { texts: B }).frac : "");
  return /* @__PURE__ */ u("div", { id: l, style: c, className: p, ...m, children: [
    /* @__PURE__ */ n("span", { className: "mds-amount-field-label mds-type-label", children: e }),
    /* @__PURE__ */ u("div", { className: "mds-amount-field-box", children: [
      /* @__PURE__ */ n(
        "input",
        {
          ref: h,
          className: [
            "mds-amount-field-input",
            // ADDENDUM 2.1: past 13 characters the type drops in ONE step to
            // number-lg — the shared .mds-number-lg class (base.css), exactly
            // the Money/HeroSurface drop (23.20).
            b.length > 13 ? "mds-number-lg" : ""
          ].filter(Boolean).join(" "),
          inputMode: "decimal",
          enterKeyHint: "next",
          value: b,
          disabled: s,
          "aria-label": e,
          "aria-invalid": r === "error" || void 0,
          onFocus: () => f(!0),
          onBlur: () => f(!1),
          "data-long": b.length > 13 ? "true" : void 0,
          onChange: (x) => i?.(An(x.target.value))
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-amount-field-unit", children: B.unit })
    ] }),
    r === "error" && t ? /* @__PURE__ */ n("span", { className: "mds-amount-field-help", children: t }) : t ? /* @__PURE__ */ n("span", { className: "mds-amount-field-help", children: t }) : null
  ] });
}
const ei = [
  "default",
  "focused",
  "error",
  "disabled",
  "long"
], yn = {
  done: me,
  waiting: gt,
  problem: ee,
  info: xt
}, Nn = {
  done: v["badge.done"].text,
  waiting: v["badge.waiting"].text,
  problem: v["badge.problem"].text,
  info: v["badge.info"].text,
  neutral: v["badge.neutral"].text
};
function ti({
  tone: e,
  label: t,
  className: a,
  id: i,
  style: s,
  ref: r,
  ...o
}) {
  const d = e === "neutral" ? null : yn[e], l = ["mds-status-badge", `mds-status-badge--${e}`, a].filter(Boolean).join(" ");
  return /* @__PURE__ */ n("span", { ref: r, id: i, style: s, className: l, ...o, children: /* @__PURE__ */ u("span", { className: "mds-status-badge-content", children: [
    d ? /* @__PURE__ */ n(d, { size: 14 }) : null,
    /* @__PURE__ */ n("span", { className: "mds-status-badge-label", children: t ?? Nn[e] })
  ] }, e) });
}
const ni = [
  "neutral",
  "info",
  "done",
  "waiting",
  "problem",
  "longLabel"
], Hn = {
  done: Ct,
  waiting: Vt
};
function Bn(e) {
  const t = e.trim().split(/\s+/)[0];
  return t ? Array.from(t)[0] : void 0;
}
function te({
  size: e = "md",
  value: t,
  tone: a,
  children: i,
  className: s,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const c = a === "done" || a === "waiting" ? Hn[a] : null, h = i ? void 0 : t ? Bn(t) : void 0, m = ["mds-entity-mark", `mds-entity-mark--${e}`, s].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("span", { ref: d, id: r, style: o, className: m, "aria-hidden": "true", ...l, children: [
    i ?? (h ? /* @__PURE__ */ n("span", { className: "mds-entity-mark-initial", children: h }) : null),
    c ? /* @__PURE__ */ n("span", { className: "mds-entity-mark-badge", children: /* @__PURE__ */ n(c, { size: 14 }) }) : null
  ] });
}
const ai = [
  "initial",
  "sizes",
  "fundTypes",
  "approved",
  "pending",
  "withImageRule"
];
function D({
  variant: e = "primary",
  size: t = "md",
  loading: a = !1,
  leading: i,
  trailing: s,
  onPress: r,
  onLongPress: o,
  disabled: d = !1,
  className: l,
  id: c,
  style: h,
  ref: m,
  children: g,
  ...f
}) {
  const { isPressed: p, pressProps: b } = N({
    onPress: r,
    onLongPress: o,
    disabled: d || a
  }), x = [
    "mds-button",
    `mds-button--${e}`,
    `mds-button--${t}`,
    p ? "mds-button--pressed" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "button",
    {
      ref: m,
      id: c,
      style: h,
      ...f,
      ...b,
      type: "button",
      className: x,
      disabled: d,
      "aria-busy": a || void 0,
      children: [
        a ? /* @__PURE__ */ n("span", { className: "mds-button-spinner", "aria-hidden": "true" }) : i ? /* @__PURE__ */ n("span", { className: "mds-button-icon", children: i }) : null,
        /* @__PURE__ */ n("span", { className: "mds-button-label", children: g }),
        s ? /* @__PURE__ */ n("span", { className: "mds-button-icon", children: s }) : null
      ]
    }
  );
}
const ii = [
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
function Zn({
  label: e,
  onPress: t,
  onLongPress: a,
  disabled: i = !1,
  density: s = "regular",
  className: r,
  id: o,
  style: d,
  ref: l,
  children: c,
  ...h
}) {
  const { isPressed: m, pressProps: g } = N({ onPress: t, onLongPress: a, disabled: i }), f = [
    "mds-icon-button",
    s === "large" ? "mds-icon-button--large" : "",
    m ? "mds-icon-button--pressed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      ref: l,
      id: o,
      style: d,
      ...h,
      ...g,
      type: "button",
      className: f,
      "aria-label": e,
      disabled: i,
      children: c
    }
  );
}
const si = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "large"
];
function ri({
  label: e,
  caption: t,
  value: a,
  onChange: i,
  placeholder: s,
  state: r = "idle",
  disabled: o = !1,
  optional: d = !1,
  className: l,
  id: c,
  style: h,
  ref: m,
  ...g
}) {
  const f = [
    "mds-text-field",
    r === "error" ? "mds-text-field--error" : "",
    o ? "mds-text-field--disabled mds-field--disabled" : "",
    l
  ].filter(Boolean).join(" "), p = c ? `${c}-input` : void 0;
  return /* @__PURE__ */ u("span", { ref: m, id: c, style: h, className: f, ...g, children: [
    /* @__PURE__ */ u("label", { className: "mds-text-field-label mds-type-label", htmlFor: p, children: [
      e,
      d ? /* @__PURE__ */ n("span", { className: "mds-text-field-optional mds-type-caption", children: y("field.optional") }) : null
    ] }),
    /* @__PURE__ */ n(
      "input",
      {
        id: p,
        className: "mds-text-field-input mds-field-input",
        type: "text",
        value: a,
        disabled: o,
        placeholder: s,
        "aria-label": c ? void 0 : e,
        "aria-invalid": r === "error" || void 0,
        onChange: (b) => i?.(b.target.value)
      }
    ),
    t ? /* @__PURE__ */ u("span", { className: r === "error" ? "mds-text-field-caption mds-text-field-caption--error" : "mds-text-field-caption", children: [
      r === "error" ? /* @__PURE__ */ n(ee, { size: 14 }) : null,
      t
    ] }) : null
  ] });
}
const oi = [
  "default",
  "focused",
  "disabled",
  "error",
  "withCaption",
  "withPlaceholder"
];
function li({
  leading: e,
  value: t,
  onChange: a,
  disabled: i = !1,
  label: s,
  className: r,
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
      className: ["mds-segmented", r].filter(Boolean).join(" "),
      role: "group",
      "aria-label": s,
      ...c,
      children: e.map((h) => /* @__PURE__ */ n(
        Sn,
        {
          segment: h,
          selected: h.value === t,
          disabled: i || h.disabled === !0,
          onChange: a
        },
        h.value
      ))
    }
  );
}
function Sn({
  segment: e,
  selected: t,
  disabled: a,
  onChange: i
}) {
  const { isPressed: s, pressProps: r } = N({ onPress: () => i(e.value), disabled: a }), o = [
    "mds-segmented-segment",
    t ? "mds-segmented-segment--selected" : "",
    s ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: o,
      "aria-pressed": t === !0,
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...r,
      children: [
        e.leading ? /* @__PURE__ */ n("span", { className: "mds-segmented-segment-icon", "aria-hidden": "true", children: e.leading }) : null,
        /* @__PURE__ */ n("span", { className: "mds-segmented-segment-label", children: e.label })
      ]
    }
  );
}
const di = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "threeSegments",
  "fourSegments",
  "withIcon"
];
function ci({
  leading: e,
  value: t,
  onChange: a,
  disabled: i = !1,
  label: s,
  className: r,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const h = (m) => {
    const g = t.includes(m) ? t.filter((f) => f !== m) : [...t, m];
    a(g);
  };
  return /* @__PURE__ */ n(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-filter-chips", r].filter(Boolean).join(" "),
      role: "group",
      "aria-label": s,
      ...c,
      children: e.map((m) => /* @__PURE__ */ n(
        Mn,
        {
          chip: m,
          selected: t.includes(m.value),
          disabled: i || m.disabled === !0,
          onToggle: h
        },
        m.value
      ))
    }
  );
}
function Mn({
  chip: e,
  selected: t,
  disabled: a,
  onToggle: i
}) {
  const { isPressed: s, pressProps: r } = N({ onPress: () => i(e.value), disabled: a }), o = [
    "mds-filter-chip",
    t ? "mds-filter-chip--selected" : "",
    s ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: o,
      "aria-pressed": t === !0,
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...r,
      children: [
        t ? /* @__PURE__ */ n(z, { size: 16, className: "mds-filter-chip-check" }) : null,
        /* @__PURE__ */ n("span", { className: "mds-filter-chip-label", children: e.label })
      ]
    }
  );
}
const mi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "manyChips"
];
function ui({
  children: e,
  label: t,
  trailing: a,
  density: i = "regular",
  className: s,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const c = [
    "mds-surface",
    i === "list" ? "mds-surface--list" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("div", { ref: d, id: r, style: o, className: c, ...l, children: [
    t || a ? /* @__PURE__ */ u("div", { className: "mds-surface-header", children: [
      t ? /* @__PURE__ */ n("h3", { className: "mds-surface-title", children: t }) : null,
      a ? /* @__PURE__ */ n("div", { className: "mds-surface-action", children: a }) : null
    ] }) : null,
    e
  ] });
}
const hi = [
  "default",
  "withHeader",
  "withAction",
  "pressed",
  "list"
];
function fi({ children: e, className: t, id: a, style: i, ref: s, ...r }) {
  return /* @__PURE__ */ n(
    "div",
    {
      ref: s,
      id: a,
      style: i,
      className: ["mds-well", t].filter(Boolean).join(" "),
      ...r,
      children: e
    }
  );
}
const gi = [
  "default",
  "inSurface"
];
function pi({
  label: e,
  caption: t,
  onPress: a,
  children: i,
  className: s,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const c = i == null, { isPressed: h, pressProps: m } = N({ onPress: () => a?.(), disabled: c }), g = !c && a !== void 0, f = ["mds-section", s].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("section", { ref: d, id: r, style: o, className: f, ...l, children: [
    /* @__PURE__ */ u("header", { className: "mds-section-header", children: [
      /* @__PURE__ */ n("h2", { className: "mds-section-title mds-type-title-section", children: e }),
      t !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-section-count", children: t }) : null,
      g ? /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: ["mds-section-see-all", h ? "mds-section-see-all--pressed" : ""].filter(Boolean).join(" "),
          "data-ds-exempt": "",
          ...m,
          children: [
            /* @__PURE__ */ n("span", { className: "mds-section-see-all-label", children: y("button.all") }),
            /* @__PURE__ */ n(ze, { size: 16, className: "mds-section-see-all-icon" })
          ]
        }
      ) : null
    ] }),
    i
  ] });
}
const bi = [
  "default",
  "withCount",
  "withSeeAll",
  "empty"
], R = 80, Y = O.size["sparkline-height"], ue = O.size["dot-signal"] / 2, Cn = O.border["signal-line"], L = ue + Cn / 2;
function Pn(e) {
  const t = e.length, a = Math.min(...e), s = Math.max(...e) - a, r = (l) => t === 1 ? R - L : L + l / (t - 1) * (R - 2 * L), o = (l) => s === 0 ? Y / 2 : L + (1 - (l - a) / s) * (Y - 2 * L);
  return { points: e.map((l, c) => `${r(c).toFixed(2)},${o(l).toFixed(2)}`).join(" "), endX: r(t - 1), endY: o(e[t - 1]) };
}
function he({ values: e, lineClassName: t, dotClassName: a, hidden: i = !1 }) {
  const s = !i && e.length >= 1 ? Pn(e) : null;
  return /* @__PURE__ */ u("svg", { viewBox: `0 0 ${R} ${Y}`, width: R, height: Y, focusable: "false", children: [
    s && e.length >= 2 ? /* @__PURE__ */ n("polyline", { className: t, points: s.points }) : null,
    s ? /* @__PURE__ */ n("circle", { className: a, cx: s.endX, cy: s.endY, r: ue }) : null
  ] });
}
function xi({
  leading: e,
  label: t,
  state: a = !1,
  caption: i,
  value: s,
  trailing: r,
  draft: o,
  tone: d = "start",
  onPress: l,
  disabled: c = !1,
  className: h,
  id: m,
  style: g,
  ref: f,
  ...p
}) {
  const { isPressed: b, pressProps: x } = N({ onPress: () => l?.(), disabled: c }), { hidden: w } = j(), Z = s === void 0 ? B.missingGlyph : w && o !== void 0 ? B.hiddenGlyph : s, P = [
    "mds-tile",
    `mds-tile--${d}`,
    b ? "mds-tile--pressed" : "",
    c ? "mds-tile--disabled" : "",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "button",
    {
      ref: f,
      id: m,
      style: g,
      type: "button",
      className: P,
      disabled: c,
      "data-ds-exempt": c ? void 0 : "",
      ...x,
      ...p,
      children: [
        /* @__PURE__ */ u("span", { className: "mds-tile-header", children: [
          e ? /* @__PURE__ */ n("span", { className: "mds-tile-header-icon", "aria-hidden": "true", children: e }) : null,
          /* @__PURE__ */ n("span", { className: "mds-tile-header-label mds-type-label", children: t }),
          a ? /* @__PURE__ */ n("span", { className: "mds-tile-dot", role: "img", "aria-label": i ?? "" }) : null
        ] }),
        /* @__PURE__ */ u("span", { className: "mds-tile-content", children: [
          o ? /* @__PURE__ */ n("span", { className: "mds-tile-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ n(
            he,
            {
              values: o,
              hidden: w,
              lineClassName: "mds-tile-sparkline-line",
              dotClassName: "mds-tile-sparkline-dot"
            }
          ) }) : null,
          /* @__PURE__ */ n("span", { className: "mds-tile-value", children: /* @__PURE__ */ n("bdi", { dir: "ltr", children: Z }) }),
          r ? /* @__PURE__ */ n("span", { className: "mds-tile-line mds-type-caption", children: r }) : null
        ] })
      ]
    }
  );
}
const ki = [
  "default",
  "withDot",
  "withSparkline",
  "pressed",
  "focused",
  "disabled"
];
function Vn(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function jn({ value: e }) {
  const { hidden: t } = j(), i = e === void 0 ? B.missingGlyph : t ? B.hiddenGlyph : null, { whole: s, cents: r } = Vn(e ?? B.missingGlyph), d = (e ?? "").length > 9 ? "mds-hero-value--lg mds-number-lg" : "mds-hero-value--hero mds-type-display-hero";
  return /* @__PURE__ */ n("span", { className: `mds-hero-value ${d}`, children: /* @__PURE__ */ n("bdi", { dir: "ltr", children: i !== null ? /* @__PURE__ */ n("span", { className: "mds-hero-value-glyph", children: i }) : /* @__PURE__ */ u(F, { children: [
    /* @__PURE__ */ n("span", { className: "mds-hero-value-whole", children: s }),
    r ? /* @__PURE__ */ n("span", { className: "mds-hero-value-cents", children: r }) : null
  ] }) }) });
}
function Tn({ values: e }) {
  const { hidden: t } = j();
  return /* @__PURE__ */ n("span", { className: "mds-hero-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ n(
    he,
    {
      values: e,
      hidden: t,
      lineClassName: "mds-hero-sparkline-line",
      dotClassName: "mds-hero-sparkline-dot"
    }
  ) });
}
function vi({
  label: e,
  value: t,
  trailing: a,
  direction: i,
  debt: s,
  draft: r,
  onDismiss: o,
  onChange: d,
  className: l,
  id: c,
  style: h,
  ref: m,
  ...g
}) {
  const { isPressed: f, pressProps: p } = N({ onPress: () => o?.() }), { hidden: b } = j(), x = b && t !== void 0, w = ["mds-hero-surface", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("section", { ref: m, id: c, style: h, className: w, ...g, children: [
    /* @__PURE__ */ u("header", { className: "mds-hero-header", children: [
      /* @__PURE__ */ n("span", { className: "mds-hero-label", children: e }),
      /* @__PURE__ */ n(xn, { className: "mds-hero-toggle", onChange: d })
    ] }),
    /* @__PURE__ */ u("p", { className: "mds-hero-amount", children: [
      /* @__PURE__ */ u("span", { className: "mds-hero-visual", "aria-hidden": x || void 0, children: [
        /* @__PURE__ */ n(jn, { value: t }),
        a && t !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-hero-unit", children: a }) : null
      ] }, x ? "hidden" : "shown"),
      x ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: B.hidden }) : null
    ] }),
    i ? /* @__PURE__ */ n("p", { className: "mds-hero-diff", children: i }) : null,
    r ? /* @__PURE__ */ n(Tn, { values: r }) : null,
    s ? /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: ["mds-hero-source", f ? "mds-hero-source--pressed" : ""].filter(Boolean).join(" "),
        "data-ds-exempt": "",
        ...p,
        children: s
      }
    ) : null
  ] });
}
const wi = [
  "default",
  "withCents",
  "missing",
  "longNumber",
  "noDiff",
  "withSparkline"
];
function Ai({
  leading: e,
  tone: t,
  label: a,
  caption: i,
  value: s,
  trailing: r,
  onPress: o,
  disabled: d = !1,
  className: l,
  id: c,
  style: h,
  ref: m,
  ...g
}) {
  const { isPressed: f, pressProps: p } = N({ onPress: () => o?.(), disabled: d }), b = o !== void 0, x = [
    "mds-object-row",
    f ? "mds-object-row--pressed" : "",
    d ? "mds-object-row--disabled" : "",
    b ? "" : "mds-object-row--passive",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    b ? "button" : "div",
    {
      ref: m,
      id: c,
      style: h,
      type: b ? "button" : void 0,
      className: x,
      disabled: b ? d : void 0,
      ...b ? p : {},
      ...g,
      children: [
        /* @__PURE__ */ n(te, { size: "md", tone: t, value: typeof e == "string" ? e : a, children: typeof e == "string" ? void 0 : e }),
        /* @__PURE__ */ u("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-object-row-title mds-type-body-strong", children: a }),
          i ? /* @__PURE__ */ n("span", { className: "mds-object-row-caption mds-type-caption", children: i }) : null
        ] }),
        s !== void 0 || r ? /* @__PURE__ */ u("span", { className: "mds-object-row-end", children: [
          /* @__PURE__ */ n("span", { className: "mds-object-row-value mds-type-amount-row", children: s === void 0 ? /* @__PURE__ */ n("bdi", { dir: "ltr", children: "—" }) : typeof s == "string" ? /* @__PURE__ */ n("bdi", { dir: "ltr", children: s }) : (
            /* A Money node renders itself (its own LTR isolation, sign,
               unit and hidden-amounts behaviour) — never re-wrapped. */
            s
          ) }),
          r ? /* @__PURE__ */ n("span", { className: "mds-object-row-time mds-type-caption", children: r }) : null
        ] }) : null
      ]
    }
  );
}
const yi = [
  "default",
  "oneLine",
  "withBadge",
  "pressed",
  "focused",
  "disabled"
];
function Ni({
  leading: e,
  tone: t,
  label: a,
  caption: i,
  value: s,
  state: r,
  href: o,
  children: d,
  onPress: l,
  disabled: c = !1,
  className: h,
  id: m,
  style: g,
  ref: f,
  ...p
}) {
  const { isPressed: b, pressProps: x } = N({ onPress: () => l?.(), disabled: c }), w = l !== void 0 || o !== void 0, M = d != null, Z = o ? "a" : w ? "button" : "div", P = [
    "mds-object-card",
    b ? "mds-object-card--pressed" : "",
    c ? "mds-object-card--disabled" : "",
    M ? "mds-object-card--with-action" : "",
    w ? "" : "mds-object-card--passive",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("div", { ref: f, id: m, style: g, className: ["mds-object-card-wrap", c ? "mds-object-card-wrap--disabled" : "", h].filter(Boolean).join(" "), ...p, children: [
    /* @__PURE__ */ u(
      Z,
      {
        className: P,
        href: o,
        type: Z === "button" ? "button" : void 0,
        disabled: Z === "button" ? c : void 0,
        ...w ? x : {},
        children: [
          /* @__PURE__ */ u("span", { className: "mds-object-card-mark", children: [
            /* @__PURE__ */ n(te, { size: "lg", tone: t, value: typeof e == "string" ? e : a, children: typeof e == "string" ? void 0 : e }),
            r ? /* @__PURE__ */ n("span", { className: "mds-object-card-state", children: r }) : null
          ] }),
          /* @__PURE__ */ u("span", { className: "mds-object-card-body", children: [
            /* @__PURE__ */ n("span", { className: "mds-object-card-title", children: a }),
            i ? /* @__PURE__ */ n("span", { className: "mds-object-card-caption mds-type-caption", children: i }) : null,
            s !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-object-card-value mds-type-amount-row", children: typeof s == "string" ? /* @__PURE__ */ n("bdi", { dir: "ltr", children: s }) : (
              /* A Money node renders itself (its own isolation, sign,
                 unit and hidden-amounts behaviour) — never re-wrapped. */
              s
            ) }) : null
          ] })
        ]
      }
    ),
    M ? /* @__PURE__ */ n("span", { className: "mds-object-card-action", children: d }) : null
  ] });
}
const Hi = [
  "default",
  "withBadge",
  "withButton",
  "pressed",
  "focused",
  "disabled"
];
function In(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function $n({
  label: e,
  size: t = "lg",
  value: a,
  trailing: i,
  direction: s,
  debt: r,
  onDismiss: o,
  loading: d = !1,
  className: l,
  id: c,
  style: h,
  ref: m,
  ...g
}) {
  const { isPressed: f, pressProps: p } = N({ onPress: () => o?.() }), { hidden: b } = j(), x = b && a !== void 0 && a !== null && !d, { whole: w, cents: M } = In(x ? "—" : a ?? "—"), Z = ["mds-metric", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("div", { ref: m, id: c, style: h, className: Z, ...g, children: [
    /* @__PURE__ */ n("span", { className: "mds-metric-label mds-type-label", children: e }),
    /* @__PURE__ */ n("p", { className: "mds-metric-amount", children: d ? /* @__PURE__ */ n("span", { className: "mds-metric-skeleton", "aria-busy": "true" }) : x ? /* @__PURE__ */ u(F, { children: [
      /* @__PURE__ */ u(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero mds-metric-value--hidden",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          "data-ds-check": "amount-hidden",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ n("bdi", { dir: "ltr", children: /* @__PURE__ */ n("span", { className: "mds-metric-value-whole", children: B.hiddenGlyph }) }),
            i ? /* @__PURE__ */ n("span", { className: "mds-metric-unit", children: i }) : null
          ]
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: B.hidden })
    ] }) : /* @__PURE__ */ u(F, { children: [
      /* @__PURE__ */ n(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          children: /* @__PURE__ */ u("bdi", { dir: "ltr", children: [
            /* @__PURE__ */ n("span", { className: "mds-metric-value-whole", children: w }),
            M ? /* @__PURE__ */ n("span", { className: "mds-metric-value-cents", children: M }) : null
          ] })
        }
      ),
      i ? /* @__PURE__ */ n("span", { className: "mds-metric-unit", children: i }) : null
    ] }) }),
    s && !d ? /* @__PURE__ */ n("p", { className: "mds-metric-diff", children: s }) : null,
    r && !d ? /* @__PURE__ */ n(
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
const Bi = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function Zi({ size: e, ...t }) {
  return /* @__PURE__ */ n($n, { ...t, size: "sm", className: ["mds-metric-small", t.className].filter(Boolean).join(" ") });
}
const Si = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
], W = /* @__PURE__ */ new Set();
function Ln({
  label: e,
  children: t,
  onDismiss: a,
  className: i,
  id: s,
  style: r,
  ref: o,
  ...d
}) {
  const l = H(null), [c, h] = V(0), [m, g] = V(!1), [f, p] = V(!1), b = H(0), x = H(0), w = H(0), M = H(null), Z = H(a);
  T(() => {
    Z.current = a;
  }, [a]);
  const P = C(() => {
    M.current?.focus?.(), Z.current();
  }, []), [_] = V(() => /* @__PURE__ */ Symbol("sheet")), [ne] = V(() => (W.add(_), W.size >= 2 ? 2 : 1));
  T(
    () => () => {
      W.delete(_);
    },
    [_]
  );
  const fe = () => {
    const k = l.current?.querySelector(".mds-sheet-panel");
    return k ? k.getBoundingClientRect().height * 0.3 : 0;
  }, I = C(() => {
    if (f) return;
    M.current = document.activeElement ?? null, p(!0), (typeof requestAnimationFrame == "function" ? requestAnimationFrame : (A) => setTimeout(() => A(performance.now()), 0))(() => {
      const A = l.current?.querySelector(".mds-sheet-panel");
      if (!A) {
        P();
        return;
      }
      const S = getComputedStyle(A).transitionDuration, se = S && S !== "0s" && S !== "";
      if (A.style.transform = "translateY(100%)", !se) {
        P();
        return;
      }
      const $ = (xe) => {
        xe.propertyName === "transform" && (A.removeEventListener("transitionend", $), P());
      };
      A.addEventListener("transitionend", $);
    });
  }, [f, P]), ge = (k) => {
    if (!m) return;
    const A = performance.now(), S = A - w.current;
    S > 0 && (b.current = (k.clientY - x.current) / S), x.current = k.clientY, w.current = A, h(Math.max(0, k.clientY - ae.current));
  }, ae = H(0), pe = (k) => {
    const A = k.target, S = l.current?.querySelector(".mds-sheet-body");
    if (!(S?.contains(A) && S && S.scrollTop > 0)) {
      if (f) {
        const $ = l.current?.querySelector(".mds-sheet-panel");
        $ && ($.style.transform = c ? `translateY(${c}px)` : ""), p(!1);
      }
      b.current = 0, x.current = k.clientY, w.current = performance.now(), g(!0), k.currentTarget.setPointerCapture?.(k.pointerId);
    }
  }, ie = () => {
    if (!m) return;
    g(!1);
    const k = c > fe(), A = b.current > 0.6;
    k || A ? I() : h(0);
  };
  T(() => {
    const k = (A) => {
      A.key === "Escape" && I();
    };
    return window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k);
  }, [I]);
  const be = [
    "mds-sheet",
    ne === 2 ? "mds-sheet--stacked" : "",
    m ? "mds-sheet--dragging" : "",
    f ? "mds-sheet--closing" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "div",
    {
      ref: (k) => {
        l.current = k, typeof o == "function" ? o(k) : o && (o.current = k);
      },
      id: s,
      style: r,
      className: be,
      "data-ds-sheet-level": String(ne),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": e,
      ...d,
      children: [
        /* @__PURE__ */ n(
          "div",
          {
            className: "mds-sheet-scrim",
            onClick: () => I(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ u(
          "div",
          {
            className: "mds-sheet-panel",
            style: c ? { transform: `translateY(${c}px)` } : void 0,
            children: [
              /* @__PURE__ */ u(
                "div",
                {
                  className: "mds-sheet-grab",
                  onPointerDown: (k) => {
                    ae.current = k.clientY - c, pe(k);
                  },
                  onPointerMove: ge,
                  onPointerUp: ie,
                  onPointerCancel: ie,
                  children: [
                    /* @__PURE__ */ n("span", { className: "mds-sheet-handle", "aria-hidden": "true" }),
                    /* @__PURE__ */ n("header", { className: "mds-sheet-header", children: /* @__PURE__ */ n("h2", { className: "mds-sheet-title mds-type-title-section", children: e }) })
                  ]
                }
              ),
              /* @__PURE__ */ n("div", { className: "mds-sheet-close", children: /* @__PURE__ */ n(Zn, { label: e, onPress: I, children: /* @__PURE__ */ n(at, {}) }) }),
              /* @__PURE__ */ n("div", { className: "mds-sheet-body", children: t })
            ]
          }
        )
      ]
    }
  );
}
const Mi = [
  "default",
  "open",
  "dragging",
  "pastThreshold",
  "stacked"
];
function Ci({
  label: e,
  caption: t,
  value: a,
  onPress: i,
  onDismiss: s,
  className: r,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const h = H(null);
  return T(() => {
    h.current?.focus();
  }, []), /* @__PURE__ */ n(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-confirm-sheet", r].filter(Boolean).join(" "),
      ...c,
      children: /* @__PURE__ */ u(
        Ln,
        {
          label: e,
          onDismiss: s,
          className: "mds-confirm-sheet__sheet",
          role: "alertdialog",
          "data-ds-check": "confirm-sheet",
          children: [
            /* @__PURE__ */ u("div", { className: "mds-confirm-sheet-head", children: [
              /* @__PURE__ */ n("span", { className: "mds-confirm-sheet-icon", children: /* @__PURE__ */ n(Tt, {}) }),
              /* @__PURE__ */ n("h2", { className: "mds-confirm-sheet-title mds-type-title-section", children: e }),
              /* @__PURE__ */ n("p", { className: "mds-confirm-sheet-sentence", children: t })
            ] }),
            /* @__PURE__ */ u("div", { className: "mds-confirm-sheet-actions", children: [
              /* @__PURE__ */ n(
                D,
                {
                  ref: h,
                  variant: "secondary",
                  className: "mds-confirm-sheet-back",
                  onPress: s,
                  children: v["button.back"].text
                }
              ),
              /* @__PURE__ */ n(D, { variant: "danger", className: "mds-confirm-sheet-confirm", onPress: i, children: a })
            ] })
          ]
        }
      )
    }
  );
}
const Pi = [
  "default",
  "focused",
  "pressed"
];
function Vi({
  label: e,
  onPress: t,
  loading: a = !1,
  disabled: i = !1,
  caption: s,
  onRetry: r,
  leading: o = !0,
  trailing: d,
  className: l,
  id: c,
  style: h,
  ref: m,
  ...g
}) {
  const f = $e(), p = f.keyboardHeight > 0 ? {
    bottom: `calc(${f.keyboardHeight}px + env(safe-area-inset-bottom))`
  } : void 0, b = ["mds-action-bar", o ? "mds-action-bar--more" : "", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "div",
    {
      ref: m,
      id: c,
      style: { ...p, ...h },
      className: b,
      role: "group",
      "aria-label": e,
      ...g,
      children: [
        s ? /* @__PURE__ */ n(D, { variant: "text", onPress: r, className: "mds-action-bar-secondary", children: s }) : null,
        /* @__PURE__ */ n(
          D,
          {
            variant: "primary",
            onPress: t,
            loading: a,
            disabled: i,
            leading: d,
            className: "mds-action-bar-primary",
            children: e
          }
        )
      ]
    }
  );
}
const ji = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "loading",
  "contentMore",
  "scrolledToEnd",
  "keyboardOpen"
];
function Ti({
  selected: e = !1,
  onPress: t,
  onLongPress: a,
  className: i,
  id: s,
  style: r,
  ref: o,
  ...d
}) {
  const { isPressed: l, pressProps: c } = N({ onPress: t, onLongPress: a }), h = e ? v["sr.askUnread"].text : v["sr.ask"].text, m = ["mds-ask-button", l ? "mds-ask-button--pressed" : "", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "button",
    {
      ref: o,
      id: s,
      style: r,
      type: "button",
      className: m,
      "aria-label": h,
      ...d,
      ...c,
      children: [
        /* @__PURE__ */ n(Ee, { size: 28 }),
        e ? /* @__PURE__ */ n("span", { className: "mds-ask-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const Ii = [
  "default",
  "pressed",
  "focused",
  "unreadDot",
  "longPressRecording"
];
function $i({
  value: e = 0,
  label: t,
  onPress: a,
  className: i,
  id: s,
  style: r,
  ref: o,
  ...d
}) {
  const { isPressed: l, pressProps: c } = N({ onPress: a }), h = He(e, ye.unread), m = t ?? (e > 0 ? y("sr.notificationsCount", { counted: h }) : y("sr.notifications")), g = [
    "mds-notifications-button",
    l ? "mds-notifications-button--pressed" : "",
    e > 0 ? "mds-notifications-button--unread" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "button",
    {
      ref: o,
      id: s,
      style: r,
      type: "button",
      className: g,
      "aria-label": m,
      ...d,
      ...c,
      children: [
        /* @__PURE__ */ n(qe, {}),
        e > 0 ? /* @__PURE__ */ n("span", { className: "mds-notifications-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const Li = [
  "default",
  "pressed",
  "focused",
  "unreadDot"
];
function Fi({
  label: e,
  caption: t,
  locked: a = !1,
  onPress: i,
  className: s,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const { isPressed: c, pressProps: h } = N({ onPress: i }), m = [
    "mds-project-switcher",
    c ? "mds-project-switcher--pressed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "button",
    {
      ref: d,
      id: r,
      style: o,
      type: "button",
      className: m,
      ...l,
      ...h,
      children: [
        /* @__PURE__ */ n(te, { size: "sm", value: e }),
        /* @__PURE__ */ u("span", { className: "mds-project-switcher-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-project-switcher-name mds-type-body-strong", children: e }),
          t ? /* @__PURE__ */ n("span", { className: "mds-project-switcher-role", children: t }) : null
        ] }),
        a ? null : /* @__PURE__ */ n(tt, { className: "mds-project-switcher-caret" })
      ]
    }
  );
}
const Ei = [
  "default",
  "pressed",
  "focused",
  "withCaret",
  "singleRoleNoCaret"
];
function Di({
  leading: e,
  trailing: t,
  caption: a = !1,
  label: i,
  className: s,
  id: r,
  style: o,
  ref: d,
  children: l,
  ...c
}) {
  const h = [
    "mds-context-bar",
    a ? "mds-context-bar--scrolled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "div",
    {
      ref: d,
      id: r,
      style: o,
      className: h,
      role: "banner",
      "aria-label": i,
      ...c,
      children: [
        /* @__PURE__ */ n("div", { className: "mds-context-bar-start", children: e ?? l }),
        /* @__PURE__ */ n("div", { className: "mds-context-bar-end", children: t })
      ]
    }
  );
}
const Ri = [
  "default",
  "mainScreenSwitcher",
  "subScreenBack",
  "scrolledHairline",
  "notScrolled"
];
function Yi({
  label: e,
  selected: t = !1,
  leading: a,
  onPress: i,
  className: s,
  ref: r,
  ...o
}) {
  const { isPressed: d, pressProps: l } = N({ onPress: i }), c = [
    "mds-tab",
    t ? "mds-tab--active" : "",
    d ? "mds-tab--pressed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
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
        a ? /* @__PURE__ */ n("span", { className: "mds-tab-icon", "aria-hidden": "true", children: a }) : null,
        /* @__PURE__ */ n("span", { className: "mds-tab-label", children: e })
      ]
    }
  );
}
function Oi({
  children: e,
  value: t,
  onChange: a,
  className: i,
  id: s,
  style: r,
  ref: o,
  ...d
}) {
  const l = we.toArray(e), c = l.some(
    (m) => m && typeof m == "object" && "props" in m && m.props.selected !== void 0
  ), h = t ?? 0;
  return /* @__PURE__ */ n(
    "div",
    {
      ref: o,
      id: s,
      style: r,
      className: ["mds-tab-bar", i].filter(Boolean).join(" "),
      role: "tablist",
      ...d,
      children: l.map((m, g) => {
        if (m && typeof m == "object" && "props" in m) {
          const f = m.props, p = c ? f.selected === !0 : g === h;
          return {
            ...m,
            props: { ...f, selected: p, onPress: () => {
              f.onPress?.(), a?.(g);
            } }
          };
        }
        return m;
      })
    }
  );
}
const _i = [
  "default",
  "activeFill",
  "pressed",
  "focused",
  "fiveTabs",
  "twoTabs"
];
function Gi({
  label: e,
  leading: t,
  caption: a = !1,
  trailing: i,
  className: s,
  id: r,
  style: o,
  ref: d,
  ...l
}) {
  const c = [
    "mds-page-header",
    a && t ? "mds-page-header--collapsed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("header", { ref: d, id: r, style: o, className: c, ...l, children: [
    t,
    /* @__PURE__ */ n("h1", { className: "mds-page-header-title", children: e }),
    i ? /* @__PURE__ */ n("div", { className: "mds-page-header-end", children: i }) : null
  ] });
}
const qi = [
  "default",
  "mainScreen",
  "subScreenBack",
  "collapsedOnScroll",
  "withTrailing"
], Fn = {
  draft: y("saveState.draft"),
  sending: y("saveState.sending"),
  saved: y("saveState.saved"),
  failed: y("saveState.failed")
};
function Wi({
  saveState: e,
  className: t,
  id: a,
  style: i,
  ref: s,
  ...r
}) {
  const o = [
    "mds-save-state",
    `mds-save-state--${e}`,
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u(
    "span",
    {
      ref: s,
      id: a,
      style: i,
      className: o,
      role: e === "failed" ? "alert" : void 0,
      "aria-busy": e === "sending" || void 0,
      ...r,
      children: [
        e === "draft" ? /* @__PURE__ */ n(vt, { size: 14 }) : e === "saved" ? /* @__PURE__ */ n("span", { className: "mds-save-state-icon", children: /* @__PURE__ */ n(me, { size: 14 }) }) : e === "failed" ? /* @__PURE__ */ n(ee, { size: 14 }) : null,
        /* @__PURE__ */ n("span", { className: "mds-save-state-text", children: Fn[e] }),
        e === "saved" ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: y("sr.saveSaved") }) : null,
        e === "failed" ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: y("sr.saveFailed") }) : null
      ]
    }
  );
}
const Qi = [
  "draft",
  "sending",
  "saved",
  "failed"
];
function Xi({
  label: e,
  trailing: t,
  onDismiss: a,
  className: i,
  id: s,
  style: r,
  ref: o,
  ...d
}) {
  const l = H(null), c = H(0), h = H(0), m = t ? 5e3 : 3e3;
  T(() => (c.current = m, h.current = Date.now(), l.current = window.setTimeout(() => a?.(), m), () => {
    l.current && window.clearTimeout(l.current), l.current = null;
  }), [e, m]);
  const g = () => {
    l.current && (window.clearTimeout(l.current), l.current = null, c.current -= Date.now() - h.current);
  }, f = () => {
    l.current || (h.current = Date.now(), l.current = window.setTimeout(() => a?.(), Math.max(0, c.current)));
  };
  return /* @__PURE__ */ u(
    "div",
    {
      ref: o,
      id: s,
      style: r,
      className: ["mds-toast", i].filter(Boolean).join(" "),
      role: "status",
      onFocus: g,
      onBlur: f,
      ...d,
      children: [
        /* @__PURE__ */ n("span", { className: "mds-toast-text", children: e }),
        t ? /* @__PURE__ */ n("span", { className: "mds-toast-action", children: t }) : null
      ]
    }
  );
}
const Ki = ["default", "withAction", "focusedPaused"], En = {
  offline: yt,
  locked: Ht,
  info: Zt
};
function Ui({
  tone: e,
  label: t,
  trailing: a,
  className: i,
  id: s,
  style: r,
  ref: o,
  ...d
}) {
  const l = En[e];
  return /* @__PURE__ */ u(
    "div",
    {
      ref: o,
      id: s,
      style: r,
      className: ["mds-inline-banner", `mds-inline-banner--${e}`, i].filter(Boolean).join(" "),
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
const Ji = ["offline", "locked", "info", "withAction"];
function zi({
  label: e,
  trailing: t,
  className: a,
  id: i,
  style: s,
  ref: r,
  ...o
}) {
  return /* @__PURE__ */ u(
    "div",
    {
      ref: r,
      id: i,
      style: s,
      className: ["mds-empty-state", a].filter(Boolean).join(" "),
      ...o,
      children: [
        /* @__PURE__ */ u("div", { className: "mds-empty-state-ghosts", "aria-hidden": "true", children: [
          /* @__PURE__ */ u("div", { className: "mds-empty-state-ghost", children: [
            /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-mark" }),
            /* @__PURE__ */ u("span", { className: "mds-empty-state-ghost-lines", children: [
              /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--body" }),
              /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--caption" })
            ] })
          ] }),
          /* @__PURE__ */ u("div", { className: "mds-empty-state-ghost", children: [
            /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-mark" }),
            /* @__PURE__ */ u("span", { className: "mds-empty-state-ghost-lines", children: [
              /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--body" }),
              /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--caption" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n("p", { className: "mds-empty-state-sentence", children: e }),
        t ? /* @__PURE__ */ n("div", { className: "mds-empty-state-action", children: t }) : null
      ]
    }
  );
}
const es = ["default", "withAction"];
function ts({
  variant: e,
  className: t,
  id: a,
  style: i,
  ref: s,
  ...r
}) {
  return /* @__PURE__ */ n(
    "span",
    {
      ref: s,
      id: a,
      style: i,
      "aria-hidden": "true",
      className: ["mds-skeleton", `mds-skeleton--${e}`, t].filter(Boolean).join(" "),
      ...r
    }
  );
}
const ns = ["body", "caption", "hero", "mark"];
export {
  Vi as ActionBar,
  ji as ActionBarStates,
  za as AmountField,
  ei as AmountFieldStates,
  On as AmountVisibilityProvider,
  xn as AmountVisibilityToggle,
  Ya as AmountVisibilityToggleStates,
  Ke as AmountsHiddenIcon,
  Qe as AmountsShownIcon,
  ma as AppointmentIcon,
  Ti as AskButton,
  Ii as AskButtonStates,
  Ee as AskSymbolIcon,
  Jn as BackIcon,
  ga as BackspaceIcon,
  D as Button,
  ii as ButtonStates,
  xa as CalendarIcon,
  va as CameraIcon,
  Pa as ChartIcon,
  Oa as Checkbox,
  _a as CheckboxStates,
  lt as ClearIcon,
  ka as ClockIcon,
  at as CloseIcon,
  Ci as ConfirmSheet,
  Pi as ConfirmSheetStates,
  Di as ContextBar,
  Ri as ContextBarStates,
  Tt as DangerIcon,
  oa as DebtIcon,
  ea as DeltaDownIcon,
  zn as DeltaUpIcon,
  vt as DraftIcon,
  zi as EmptyState,
  es as EmptyStateStates,
  Ct as EntityApprovedIcon,
  te as EntityMark,
  ai as EntityMarkStates,
  Vt as EntityPendingIcon,
  tt as ExpandIcon,
  ct as FieldErrorIcon,
  Ta as FileIcon,
  ci as FilterChips,
  mi as FilterChipsStates,
  ze as ForwardIcon,
  ia as FundBankIcon,
  aa as FundCashIcon,
  sa as FundWalletIcon,
  vi as HeroSurface,
  wi as HeroSurfaceStates,
  Zn as IconButton,
  si as IconButtonStates,
  Zt as InfoIcon,
  Ui as InlineBanner,
  Ji as InlineBannerStates,
  da as JobFailedIcon,
  je as LONG_PRESS_MS,
  _n as LayersProvider,
  Ia as LinkIcon,
  Ht as LockedIcon,
  Sa as MapPinIcon,
  $n as Metric,
  Zi as MetricSmall,
  Si as MetricSmallStates,
  Bi as MetricStates,
  wa as MicIcon,
  ba as MinusIcon,
  Da as Money,
  Ra as MoneyStates,
  na as MoreIcon,
  Na as MovementInIcon,
  Ha as MovementOutIcon,
  Kn as NavDeliveryIcon,
  Qn as NavFinanceIcon,
  Un as NavMarketIcon,
  Xn as NavOrdersIcon,
  Wn as NavTodayIcon,
  $a as NoteIcon,
  $i as NotificationsButton,
  Li as NotificationsButtonStates,
  qe as NotificationsIcon,
  Ni as ObjectCard,
  Hi as ObjectCardStates,
  Ai as ObjectRow,
  yi as ObjectRowStates,
  yt as OfflineIcon,
  ca as OrderIcon,
  Gi as PageHeader,
  qi as PageHeaderStates,
  Fa as PauseIcon,
  Ba as PhoneIcon,
  pa as PlusIcon,
  ua as PriceTierIcon,
  Fi as ProjectSwitcher,
  Ei as ProjectSwitcherStates,
  la as QuoteIcon,
  Ea as RTL_FLIP_ICONS,
  Ga as Radio,
  qa as RadioStates,
  fa as ReportIcon,
  ta as RetryIcon,
  ha as ReviewIcon,
  Wi as SaveState,
  Qi as SaveStateStates,
  Xa as SearchField,
  Ka as SearchFieldStates,
  rt as SearchIcon,
  pi as Section,
  bi as SectionStates,
  li as SegmentedControl,
  di as SegmentedControlStates,
  z as SelectedIcon,
  Ma as SendIcon,
  Ln as Sheet,
  Mi as SheetStates,
  ts as Skeleton,
  ns as SkeletonStates,
  La as SlidersIcon,
  ti as StatusBadge,
  ni as StatusBadgeStates,
  Aa as StopIcon,
  ui as Surface,
  hi as SurfaceStates,
  Oi as TabBar,
  _i as TabBarStates,
  Yi as TabBarTab,
  Ca as TableIcon,
  Ua as TextArea,
  Ja as TextAreaStates,
  ri as TextField,
  oi as TextFieldStates,
  xi as Tile,
  ki as TileStates,
  Xi as Toast,
  Ki as ToastStates,
  Wa as Toggle,
  Qa as ToggleStates,
  me as ToneDoneIcon,
  xt as ToneInfoIcon,
  ee as ToneProblemIcon,
  gt as ToneWaitingIcon,
  ra as TransferIcon,
  ya as TrashIcon,
  fi as Well,
  gi as WellStates,
  Za as WhatsappIcon,
  Va as ZoomInIcon,
  ja as ZoomOutIcon,
  v as ar,
  Q as formatMoney,
  Yn as formatTime12,
  Ae as getToken,
  B as moneyTexts,
  An as normalizeAmount,
  He as pluralAr,
  ye as pluralNouns,
  y as t,
  O as tokens,
  j as useAmountVisibility,
  qn as useOpenSheetCount,
  N as usePress,
  Gn as useSheetLayer,
  $e as useVisualViewport
};
