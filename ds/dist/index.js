import { jsx as n, jsxs as p, Fragment as Y } from "react/jsx-runtime";
import { useMemo as se, useContext as oe, createContext as Ne, useState as M, useRef as S, useCallback as V, useEffect as I, useReducer as $e, useId as de, useLayoutEffect as Fe, Children as Le } from "react";
const D = {
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
function He(e) {
  let t = D;
  for (const a of e.split("."))
    t = t[a];
  return t;
}
const Ee = {
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
let U = {};
function Sa(e) {
  U = { ...e };
}
function Pa() {
  U = {};
}
function Ma(e) {
  return U[e];
}
function g(e, t) {
  let a = U[e] ?? Ee[e].text;
  if (t)
    for (const [i, r] of Object.entries(t))
      a = a.replaceAll(`{${i}}`, String(r));
  return a;
}
const De = {
  movements: { zero: "لا حركات", one: "حركة واحدة", two: "حركتين", few: "حركات", many: "حركة" },
  orders: { zero: "لا طلبات", one: "طلب واحد", two: "طلتان", few: "طلبات", many: "طلب" },
  quotes: { zero: "لا عروض", one: "عرض واحد", two: "عرضان", few: "عروض", many: "عرض" },
  results: { zero: "لا نتائج", one: "نتيجة واحدة", two: "نتيجتان", few: "نتائج", many: "نتيجة" },
  unread: { zero: "لا شيء غير مقروء", one: "غير مقروء واحد", two: "غير مقروءان", few: "غير مقروءة", many: "غير مقروءة" }
};
function C() {
  return {
    unit: g("money.unit"),
    minus: g("money.ariaMinus"),
    dinar: g("money.ariaDinar"),
    fils: g("money.ariaFils"),
    and: g("money.ariaAnd"),
    forYou: g("money.forYou"),
    againstYou: g("money.againstYou"),
    hidden: g("money.ariaHidden"),
    missing: g("money.ariaMissing"),
    hiddenGlyph: g("money.hiddenGlyph"),
    missingGlyph: g("money.missing")
  };
}
const Re = new Intl.PluralRules("ar");
function Oe(e, t) {
  switch (Re.select(e)) {
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
const Ye = "ص", qe = "م";
function xe(e) {
  return `${e < 10 ? "0" : ""}${e}`;
}
function _e(e) {
  return e instanceof Date ? { h: e.getHours(), m: e.getMinutes() } : e;
}
function Za(e) {
  const { h: t, m: a } = _e(e), i = t < 12 ? Ye : qe, r = t % 12 === 0 ? 12 : t % 12;
  return `${xe(r)}:${xe(a)} ${i}`;
}
const J = "−", Ge = "+", Q = 3;
function Qe(e) {
  const t = String(e).trim(), a = t.startsWith("-"), i = a ? t.slice(1) : t, [r = "0", s = ""] = i.split("."), d = r.replace(/[^0-9]/g, "") || "0", o = (s + "000").slice(0, Q), c = BigInt(d) * 10n ** BigInt(Q) + BigInt(o || "0");
  return { negative: a, fils: c };
}
function Ke(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function We(e) {
  const t = 10n ** BigInt(Q), a = e / t, i = e % t;
  return {
    int: Ke(a.toString()),
    frac: i === 0n ? "" : `.${i.toString().padStart(Q, "0")}`
  };
}
function ee(e, t) {
  const a = 10n ** BigInt(Q), i = e / a, r = e % a;
  let s = `${i.toString()} ${t.dinar}`;
  return r !== 0n && (s += ` ${t.and}${r.toString()} ${t.fils}`), s;
}
function ie(e, t) {
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
    const f = t.debt === "forYou" ? a.forYou : t.debt === "againstYou" ? a.againstYou : "", h = f ? `${f} ${a.hiddenGlyph} ${a.unit}` : `${a.hiddenGlyph} ${a.unit}`;
    return {
      missing: !1,
      hidden: !0,
      debt: t.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: a.unit,
      debtWord: f,
      display: h,
      aria: a.hidden
    };
  }
  const { negative: r, fils: s } = Qe(e), d = We(s), o = t.debt === "forYou" ? a.forYou : t.debt === "againstYou" ? a.againstYou : "", c = o ? "" : t.flow === "in" ? Ge : t.flow === "out" ? J : t.flow === "transfer" ? "" : r ? J : "", l = `${c}${d.int}${d.frac}`, u = o ? `${o} ${l} ${a.unit}` : `${l} ${a.unit}`;
  let m;
  return o ? m = `${o} ${ee(s, a)}` : c === J ? m = `${a.minus} ${ee(s, a)}` : m = ee(s, a), {
    missing: !1,
    hidden: !1,
    debt: t.debt ?? null,
    sign: c,
    int: d.int,
    frac: d.frac,
    unit: a.unit,
    debtWord: o,
    display: u,
    aria: m
  };
}
const Be = Ne({ hidden: !1 });
function Ca({ children: e, hidden: t = !1 }) {
  const a = se(() => ({ hidden: t }), [t]);
  return /* @__PURE__ */ n(Be.Provider, { value: a, children: e });
}
function O() {
  const { hidden: e } = oe(Be);
  return { hidden: e, visible: !e };
}
const Xe = 500, Ue = He("motion.press-cancel-px");
function A(e = {}) {
  const { onPress: t, onLongPress: a, disabled: i } = e, [r, s] = M(!1), d = S(null), o = S(null), c = S(!1), l = V(() => {
    o.current !== null && (clearTimeout(o.current), o.current = null);
  }, []), u = V(() => {
    l(), d.current = null, c.current = !1, s(!1);
  }, [l]), m = V(
    (b) => {
      if (!i && !(b.pointerType === "mouse" && b.button !== 0)) {
        if (typeof b.currentTarget.setPointerCapture == "function")
          try {
            b.currentTarget.setPointerCapture(b.pointerId);
          } catch {
          }
        d.current = { x: b.clientX, y: b.clientY }, c.current = !1, s(!0), a && (o.current = setTimeout(() => {
          c.current = !0, a();
        }, Xe));
      }
    },
    [i, a]
  ), f = V(
    (b) => {
      if (!r || d.current === null) return;
      const v = b.clientX - d.current.x, k = b.clientY - d.current.y;
      Math.hypot(v, k) > Ue && u();
    },
    [r, u]
  ), h = V(
    (b) => {
      if (!r) return;
      const v = c.current;
      u(), !v && !i && t?.();
    },
    [r, i, t, u]
  );
  return {
    isPressed: r,
    pressProps: {
      onPointerDown: m,
      onPointerMove: f,
      onPointerUp: h,
      onPointerCancel: u
    }
  };
}
const ze = () => typeof window > "u" || !window.visualViewport ? {
  height: typeof window > "u" ? 0 : window.innerHeight,
  offsetTop: 0,
  scale: 1,
  keyboardHeight: 0
} : Se(window.visualViewport);
function Se(e) {
  const t = e.height, a = e.offsetTop, i = Math.max(0, window.innerHeight - t - a);
  return { height: t, offsetTop: a, scale: e.scale, keyboardHeight: i };
}
function Je() {
  const [e, t] = M(ze);
  return I(() => {
    const a = window.visualViewport;
    if (!a) return;
    const i = () => t(Se(a));
    return i(), a.addEventListener("resize", i), a.addEventListener("scroll", i), window.addEventListener("resize", i), window.addEventListener("orientationchange", i), () => {
      a.removeEventListener("resize", i), a.removeEventListener("scroll", i), window.removeEventListener("resize", i), window.removeEventListener("orientationchange", i);
    };
  }, []), e;
}
function Pe(e) {
  const [t, a] = M(!1);
  return I(() => {
    if (!e) return;
    const i = window.setTimeout(() => a(!0), D.motion["pending-delay"]);
    return () => {
      window.clearTimeout(i), a(!1);
    };
  }, [e]), e && t;
}
function et(e) {
  return 1 - Math.pow(1 - e, 3);
}
function tt() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Ta(e, t, a) {
  const [i, r] = M(() => a ? e : t), s = S(0), d = tt();
  return I(() => {
    if (d || !a || e === t) {
      const m = requestAnimationFrame(() => r(t));
      return () => cancelAnimationFrame(m);
    }
    const c = performance.now(), l = D.motion.count.ms, u = (m) => {
      const f = Math.min(1, (m - c) / l);
      r(e + (t - e) * et(f)), f < 1 && (s.current = requestAnimationFrame(u));
    };
    return s.current = requestAnimationFrame(u), () => cancelAnimationFrame(s.current);
  }, [a, e, t, d]), I(() => () => cancelAnimationFrame(s.current), []), a && !d && e !== t && i !== t ? i : t;
}
const le = Ne({
  sheetIds: [],
  registerSheet: () => {
  },
  unregisterSheet: () => {
  }
});
function nt(e, t) {
  switch (t.type) {
    case "register":
      return e.includes(t.id) ? e : [...e, t.id];
    case "unregister":
      return e.includes(t.id) ? e.filter((a) => a !== t.id) : e;
    default:
      return e;
  }
}
function ja({ children: e }) {
  const [t, a] = $e(nt, []), i = V((d) => a({ type: "register", id: d }), []), r = V((d) => a({ type: "unregister", id: d }), []), s = se(
    () => ({ sheetIds: t, registerSheet: i, unregisterSheet: r }),
    [t, i, r]
  );
  return /* @__PURE__ */ n(le.Provider, { value: s, children: e });
}
function Va() {
  const { sheetIds: e, registerSheet: t, unregisterSheet: a } = oe(le), i = de();
  Fe(() => (t(i), () => a(i)), [i, t, a]);
  const r = e.indexOf(i) + 1 || e.length + 1, s = Math.min(r, 2), d = r === e.length;
  return {
    level: s,
    overLimit: r > 2,
    sheetZ: s === 1 ? "var(--mds-layer-sheet)" : "var(--mds-layer-sheet-2)",
    scrimZ: s === 1 ? "var(--mds-layer-scrim)" : "var(--mds-layer-scrim-2)",
    isTop: d
  };
}
function Ia() {
  const { sheetIds: e } = oe(le);
  return e.length;
}
const at = /* @__PURE__ */ p("g", { transform: "translate(16 16)", id: "micro-symbol-master-2", children: [
  /* @__PURE__ */ n("g", { id: "module-top", transform: "rotate(0 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-top", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ n("g", { id: "module-right", transform: "rotate(90 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-right", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-signal)" }) }),
  /* @__PURE__ */ n("g", { id: "module-bottom", transform: "rotate(180 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-bottom", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ n("g", { id: "module-left", transform: "rotate(270 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-left", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-data)" }) })
] });
function it({ size: e = 28, className: t, ...a }) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 224 224",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", t].filter(Boolean).join(" "),
      ...a,
      children: at
    }
  );
}
const rt = {
  regular: /* @__PURE__ */ n("path", { d: "M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z" })
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
      children: rt[t]
    }
  );
}
const st = {
  regular: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z" })
};
function Fa({
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
      children: st[t]
    }
  );
}
const ot = {
  regular: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z" })
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
      children: ot[t]
    }
  );
}
const dt = {
  regular: /* @__PURE__ */ n("path", { d: "M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A8.13,8.13,0,0,0,255.43,117ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208ZM32,136V72H176v64Zm160,72a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm0-96V88h34.58l9.6,24Z" })
};
function Ea({
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
      children: dt[t]
    }
  );
}
const lt = {
  regular: /* @__PURE__ */ n("path", { d: "M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z" })
};
function Da({
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
      children: lt[t]
    }
  );
}
const ct = {
  regular: /* @__PURE__ */ n("path", { d: "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" })
};
function ut({
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
      children: ct[t]
    }
  );
}
const mt = {
  regular: /* @__PURE__ */ n("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" })
};
function ht({
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
      children: mt[t]
    }
  );
}
const pt = {
  regular: /* @__PURE__ */ n("path", { d: "M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" })
};
function ft({
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
      children: pt[t]
    }
  );
}
const gt = {
  regular: /* @__PURE__ */ n("path", { d: "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" })
};
function Ra({
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
      children: gt[t]
    }
  );
}
const bt = {
  bold: /* @__PURE__ */ n("path", { d: "M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" })
};
function xt({
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
      children: bt[t]
    }
  );
}
const kt = {
  bold: /* @__PURE__ */ n("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" })
};
function vt({
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
      children: kt[t]
    }
  );
}
const yt = {
  regular: /* @__PURE__ */ n("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function wt({
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
      children: yt[t]
    }
  );
}
const At = {
  bold: /* @__PURE__ */ n("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function ce({
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
      children: At[t]
    }
  );
}
const Nt = {
  regular: /* @__PURE__ */ n("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" })
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
  fill: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function ue({
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
      children: Bt[t]
    }
  );
}
const St = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function Pt({
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
      children: St[t]
    }
  );
}
const Mt = {
  bold: /* @__PURE__ */ n("path", { d: "M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" })
};
function Oa({
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
      children: Mt[t]
    }
  );
}
const Zt = {
  bold: /* @__PURE__ */ n("path", { d: "M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" })
};
function Ya({
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
      children: Zt[t]
    }
  );
}
const Ct = {
  bold: /* @__PURE__ */ n("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function Me({
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
      children: Ct[t]
    }
  );
}
const Tt = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z" })
};
function jt({
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
      children: Tt[t]
    }
  );
}
const Vt = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
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
      children: Vt[t]
    }
  );
}
const It = {
  bold: /* @__PURE__ */ n("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" })
};
function $t({
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
      children: It[t]
    }
  );
}
const Ft = {
  bold: /* @__PURE__ */ n("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" })
};
function Lt({
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
      children: Ft[t]
    }
  );
}
const Et = {
  regular: /* @__PURE__ */ n("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" })
};
function qa({
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
      children: Et[t]
    }
  );
}
const Dt = {
  regular: /* @__PURE__ */ n("path", { d: "M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z" })
};
function Rt({
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
      children: Dt[t]
    }
  );
}
const Ot = {
  regular: /* @__PURE__ */ n("path", { d: "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z" })
};
function Yt({
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
      children: Ot[t]
    }
  );
}
const qt = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" })
};
function _t({
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
      children: qt[t]
    }
  );
}
const Gt = {
  regular: /* @__PURE__ */ n("path", { d: "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z" })
};
function _a({
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
const Qt = {
  fill: /* @__PURE__ */ n("path", { d: "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" })
};
function Kt({
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
      children: Qt[t]
    }
  );
}
const Wt = {
  fill: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" })
};
function Xt({
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
      children: Wt[t]
    }
  );
}
const Ut = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function zt({
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
      children: Ut[t]
    }
  );
}
const Jt = {
  regular: /* @__PURE__ */ n("path", { d: "M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM80,40h40V56H80ZM54.25,72h147.5l20,80H34.25ZM32,192V168H224v24ZM64,96a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,96ZM64,128a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,128Z" })
};
function Ga({
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
const en = {
  regular: /* @__PURE__ */ n("path", { d: "M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z" })
};
function Qa({
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
  regular: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" })
};
function Ka({
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
  regular: /* @__PURE__ */ n("path", { d: "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z" })
};
function Wa({
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
  regular: /* @__PURE__ */ n("path", { d: "M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9ZM164,96a36,36,0,0,0,5.9-.48,36,36,0,1,0,28.22-47A36,36,0,1,0,164,96Zm60-12a20,20,0,1,1-20-20A20,20,0,0,1,224,84ZM164,40a20,20,0,0,1,19.25,14.61,36,36,0,0,0-15,24.93A20.42,20.42,0,0,1,164,80a20,20,0,0,1,0-40Z" })
};
function Xa({
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
      children: an[t]
    }
  );
}
const rn = {
  regular: /* @__PURE__ */ n("path", { d: "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" })
};
function Ua({
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
      children: rn[t]
    }
  );
}
const sn = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function za({
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
      children: sn[t]
    }
  );
}
const on = {
  regular: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" })
};
function Ja({
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
      children: on[t]
    }
  );
}
const dn = {
  regular: /* @__PURE__ */ n("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function ei({
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
const ln = {
  regular: /* @__PURE__ */ n("path", { d: "M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z" })
};
function ti({
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
      children: ln[t]
    }
  );
}
const cn = {
  regular: /* @__PURE__ */ n("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" })
};
function ni({
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
const un = {
  regular: /* @__PURE__ */ n("path", { d: "M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z" })
};
function ai({
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
const mn = {
  regular: /* @__PURE__ */ n("path", { d: "M216,40H68.53a16.08,16.08,0,0,0-13.72,7.77L9.14,123.88a8,8,0,0,0,0,8.24l45.67,76.11A16.08,16.08,0,0,0,68.53,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM61.67,204.12,68.53,200h0ZM216,200H68.53l-43.2-72,43.2-72H216ZM106.34,146.34,124.69,128l-18.35-18.34a8,8,0,0,1,11.32-11.32L136,116.69l18.34-18.35a8,8,0,0,1,11.32,11.32L147.31,128l18.35,18.34a8,8,0,0,1-11.32,11.32L136,139.31l-18.34,18.35a8,8,0,0,1-11.32-11.32Z" })
};
function hn({
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
const pn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" })
};
function fn({
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
      children: pn[t]
    }
  );
}
const gn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" })
};
function bn({
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
      children: gn[t]
    }
  );
}
const xn = {
  regular: /* @__PURE__ */ n("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function kn({
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
      children: xn[t]
    }
  );
}
const vn = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" })
};
function yn({
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
      children: vn[t]
    }
  );
}
const wn = {
  regular: /* @__PURE__ */ n("path", { d: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z" })
};
function ii({
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
      children: wn[t]
    }
  );
}
const An = {
  regular: /* @__PURE__ */ n("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" })
};
function ri({
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
      children: An[t]
    }
  );
}
const Nn = {
  regular: /* @__PURE__ */ n("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" })
};
function si({
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
      children: Nn[t]
    }
  );
}
const Hn = {
  regular: /* @__PURE__ */ n("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" })
};
function oi({
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
      children: Hn[t]
    }
  );
}
const Bn = {
  regular: /* @__PURE__ */ n("path", { d: "M197.66,69.66,83.31,184H168a8,8,0,0,1,0,16H64a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v84.69L186.34,58.34a8,8,0,0,1,11.32,11.32Z" })
};
function di({
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
      children: Bn[t]
    }
  );
}
const Sn = {
  regular: /* @__PURE__ */ n("path", { d: "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" })
};
function li({
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
      children: Sn[t]
    }
  );
}
const Pn = {
  regular: /* @__PURE__ */ n("path", { d: "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" })
};
function ci({
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
      children: Pn[t]
    }
  );
}
const Mn = {
  regular: /* @__PURE__ */ n("path", { d: "M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" })
};
function ui({
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
      children: Mn[t]
    }
  );
}
const Zn = {
  regular: /* @__PURE__ */ n("path", { d: "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" })
};
function mi({
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
      children: Zn[t]
    }
  );
}
const Cn = {
  regular: /* @__PURE__ */ n("path", { d: "M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z" })
};
function hi({
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
      children: Cn[t]
    }
  );
}
const Tn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z" })
};
function pi({
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
      children: Tn[t]
    }
  );
}
const jn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" })
};
function fi({
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
      children: jn[t]
    }
  );
}
const Vn = {
  regular: /* @__PURE__ */ n("path", { d: "M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function gi({
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
      children: Vn[t]
    }
  );
}
const In = {
  regular: /* @__PURE__ */ n("path", { d: "M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function bi({
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
      children: In[t]
    }
  );
}
const $n = {
  regular: /* @__PURE__ */ n("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" })
};
function xi({
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
      children: $n[t]
    }
  );
}
const Fn = {
  regular: /* @__PURE__ */ n("path", { d: "M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" })
};
function ki({
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
      children: Fn[t]
    }
  );
}
const Ln = {
  regular: /* @__PURE__ */ n("path", { d: "M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z" })
};
function vi({
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
      children: Ln[t]
    }
  );
}
const En = {
  regular: /* @__PURE__ */ n("path", { d: "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z" })
};
function yi({
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
      children: En[t]
    }
  );
}
const Dn = {
  bold: /* @__PURE__ */ n("path", { d: "M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z" })
};
function wi({
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
      children: Dn[t]
    }
  );
}
const Ai = ["nav-delivery", "back", "forward", "transfer", "movement-in", "movement-out", "send"];
function Ni({
  value: e,
  flow: t,
  debt: a,
  size: i = "md",
  state: r = "idle",
  disabled: s = !1,
  className: d,
  id: o,
  style: c,
  ref: l,
  ...u
}) {
  const { hidden: m } = O(), f = m && e !== null && e !== void 0, h = ie(e, { flow: t, debt: a, hidden: f, texts: C() }), b = ["mds-money", `mds-money--${i}`, i === "lg" ? "mds-number-lg" : "", s ? "mds-money--disabled" : "", d].filter(Boolean).join(" ");
  return r === "loading" ? /* @__PURE__ */ n("span", { ref: l, id: o, style: c, className: b, "aria-busy": "true", ...u, children: /* @__PURE__ */ n("span", { className: "mds-money-skeleton", "aria-hidden": "true" }) }) : /* @__PURE__ */ p("span", { ref: l, id: o, style: c, className: b, ...u, children: [
    /* @__PURE__ */ p("span", { className: "mds-money-visual", "aria-hidden": "true", children: [
      h.debtWord ? /* @__PURE__ */ n("span", { className: "mds-money-debt", children: h.debtWord }) : null,
      h.missing ? /* @__PURE__ */ n("span", { className: "mds-money-missing", children: C().missingGlyph }) : /* @__PURE__ */ p(Y, { children: [
        /* @__PURE__ */ n("bdi", { className: "mds-money-value", dir: "ltr", children: h.hidden ? C().hiddenGlyph : /* @__PURE__ */ p(Y, { children: [
          /* @__PURE__ */ p("span", { className: "mds-money-integer", children: [
            h.sign,
            h.int
          ] }),
          h.frac ? /* @__PURE__ */ n("span", { className: "mds-money-fraction", children: h.frac }) : null
        ] }) }),
        /* @__PURE__ */ n("span", { className: "mds-money-unit", children: h.unit })
      ] })
    ] }, f ? "hidden" : "shown"),
    /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: h.aria })
  ] });
}
const Hi = [
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
function Rn({
  onChange: e,
  disabled: t = !1,
  density: a = "regular",
  className: i,
  id: r,
  style: s,
  ref: d,
  ...o
}) {
  const { hidden: c, visible: l } = O(), u = c ? ft : ht, m = g(c ? "button.showAmounts" : "button.hideAmounts"), f = [
    "mds-amount-visibility-toggle",
    a === "large" ? "mds-amount-visibility-toggle--large" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      ref: d,
      id: r,
      style: s,
      ...o,
      type: "button",
      className: f,
      "aria-label": m,
      disabled: t,
      onClick: () => e?.(!l),
      children: /* @__PURE__ */ n(u, { size: 24 })
    }
  );
}
const Bi = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "amountsShown",
  "amountsHidden"
];
function Si({
  label: e,
  caption: t,
  selected: a = !1,
  onChange: i,
  disabled: r = !1,
  state: s = "idle",
  className: d,
  id: o,
  style: c,
  ref: l,
  "aria-label": u,
  ...m
}) {
  const f = [
    // .mds-control-row (base.css): the shared row-plain anatomy; the box
    // aligns to the FIRST text line, so the alignment overrides to start.
    "mds-control-row",
    "mds-checkbox",
    a ? "mds-checkbox--selected" : "",
    r ? "mds-checkbox--disabled" : "",
    s === "error" ? "mds-checkbox--error" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("label", { ref: l, id: o, style: c, className: f, ...m, children: [
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        className: "mds-checkbox-input mds-sr-input",
        checked: a,
        disabled: r,
        onChange: (h) => i?.(h.target.checked),
        "aria-label": u,
        "aria-invalid": s === "error" || void 0
      }
    ),
    /* @__PURE__ */ n("span", { className: "mds-checkbox-box", "aria-hidden": "true", children: /* @__PURE__ */ n(ce, { size: 14 }) }),
    /* @__PURE__ */ p("span", { className: "mds-checkbox-text mds-control-text", children: [
      /* @__PURE__ */ n("span", { className: "mds-checkbox-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ n("span", { className: "mds-checkbox-caption mds-type-caption", children: t }) : null
    ] }),
    s === "error" ? /* @__PURE__ */ n("span", { className: "mds-checkbox-error mds-type-caption", children: g("checkbox.tickThis") }) : null
  ] });
}
const Pi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function Mi({
  label: e,
  items: t,
  value: a,
  onChange: i,
  disabled: r = !1,
  state: s = "idle",
  className: d,
  id: o,
  style: c,
  ref: l,
  ...u
}) {
  const m = de(), f = [
    "mds-radio",
    r ? "mds-radio--disabled" : "",
    s === "error" ? "mds-radio--error" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("div", { ref: l, id: o, style: c, className: f, ...u, children: [
    /* @__PURE__ */ n("span", { className: "mds-radio-label mds-type-label", children: e }),
    /* @__PURE__ */ n("div", { className: "mds-radio-surface", role: "radiogroup", "aria-label": e, children: t.map((h) => {
      const b = h.value === a;
      return /* @__PURE__ */ p("label", { className: "mds-control-row mds-radio-row", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "radio",
            className: "mds-radio-input mds-sr-input",
            name: m,
            checked: b,
            disabled: r || h.disabled,
            onChange: () => i?.(h.value)
          }
        ),
        /* @__PURE__ */ n("span", { className: "mds-radio-circle", "aria-hidden": "true", children: /* @__PURE__ */ n("span", { className: "mds-radio-dot" }) }),
        /* @__PURE__ */ p("span", { className: "mds-radio-text mds-control-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-radio-row-label mds-type-body", children: h.label }),
          h.caption ? /* @__PURE__ */ n("span", { className: "mds-radio-caption mds-type-caption", children: h.caption }) : null
        ] })
      ] }, h.value);
    }) }),
    s === "error" ? /* @__PURE__ */ n("span", { className: "mds-radio-error mds-type-caption", children: g("radio.choose").replace("{label}", e) }) : null
  ] });
}
const Zi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function Ci({
  label: e,
  caption: t,
  selected: a = !1,
  onChange: i,
  disabled: r = !1,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const u = [
    // .mds-control-row (base.css): the whole row is the switch's press zone.
    "mds-control-row",
    "mds-toggle",
    a ? "mds-toggle--selected" : "",
    r ? "mds-toggle--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("label", { ref: c, id: d, style: o, className: u, ...l, children: [
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        className: "mds-toggle-input mds-sr-input",
        role: "switch",
        checked: a,
        disabled: r,
        onChange: (m) => i?.(m.target.checked),
        "aria-checked": a
      }
    ),
    /* @__PURE__ */ p("span", { className: "mds-toggle-text mds-control-text", children: [
      /* @__PURE__ */ n("span", { className: "mds-toggle-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ n("span", { className: "mds-toggle-caption mds-type-caption", children: t }) : null
    ] }),
    /* @__PURE__ */ n("span", { className: "mds-toggle-switch", "aria-hidden": "true", children: /* @__PURE__ */ n("span", { className: "mds-toggle-track", children: /* @__PURE__ */ n("span", { className: "mds-toggle-thumb", children: /* @__PURE__ */ n(ce, { size: 14 }) }) }) })
  ] });
}
const Ti = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled"
];
function ji({
  label: e,
  placeholder: t,
  value: a = "",
  onChange: i,
  disabled: r = !1,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const u = a.length > 0, m = [
    "mds-search-field",
    r ? "mds-search-field--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("div", { ref: c, id: d, style: o, className: m, ...l, children: [
    /* @__PURE__ */ n(Ht, { size: 20 }),
    /* @__PURE__ */ n(
      "input",
      {
        type: "search",
        className: "mds-search-field-input",
        role: "searchbox",
        "aria-label": e,
        placeholder: t,
        value: a,
        disabled: r,
        enterKeyHint: "search",
        onChange: (f) => i?.(f.target.value)
      }
    ),
    u ? /* @__PURE__ */ n(
      On,
      {
        onClear: () => {
          i?.("");
        }
      }
    ) : null
  ] });
}
function On({ onClear: e }) {
  const { isPressed: t, pressProps: a } = A({ onPress: e });
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: ["mds-search-field-clear", t ? "mds-search-field-clear--pressed" : ""].filter(Boolean).join(" "),
      "data-ds-exempt": "",
      "aria-label": g("sr.clearSearch"),
      ...a,
      children: /* @__PURE__ */ n(ue, { size: 20 })
    }
  );
}
const Vi = [
  "default",
  "focused",
  "disabled",
  "withText"
];
function Ii({
  label: e,
  caption: t,
  value: a = "",
  onChange: i,
  placeholder: r,
  state: s = "idle",
  disabled: d = !1,
  optional: o = !1,
  className: c,
  id: l,
  style: u,
  ref: m,
  ...f
}) {
  const h = de(), b = se(() => `${h}-error`, [h]), v = [
    "mds-field",
    "mds-text-area",
    s === "error" ? "mds-text-area--error" : "",
    d ? "mds-text-area--disabled mds-field--disabled" : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("div", { id: l, style: u, className: v, ...f, children: [
    /* @__PURE__ */ p("label", { className: "mds-text-area-label mds-type-label", htmlFor: l ?? h, children: [
      e,
      o ? /* @__PURE__ */ n("span", { className: "mds-text-area-optional mds-type-caption", children: g("field.optional") }) : null
    ] }),
    /* @__PURE__ */ n(
      "textarea",
      {
        ref: m,
        id: l ?? h,
        className: "mds-text-area-input mds-field-input",
        rows: 1,
        value: a,
        disabled: d,
        placeholder: r,
        "aria-multiline": "true",
        "aria-invalid": s === "error" || void 0,
        "aria-describedby": s === "error" ? b : void 0,
        enterKeyHint: "enter",
        onChange: (k) => i?.(k.target.value),
        onInput: (k) => {
          const y = k.currentTarget;
          y.style.height = "auto", y.style.height = `${y.scrollHeight}px`;
        }
      }
    ),
    s === "error" ? /* @__PURE__ */ p("span", { id: b, className: "mds-text-area-help mds-type-caption", children: [
      /* @__PURE__ */ n(Pt, { size: 16 }),
      /* @__PURE__ */ n("span", { children: t })
    ] }) : t ? /* @__PURE__ */ n("span", { className: "mds-text-area-help mds-type-caption", children: /* @__PURE__ */ n("span", { children: t }) }) : null
  ] });
}
const $i = [
  "default",
  "focused",
  "error",
  "disabled",
  "grown"
], ke = 1632, Yn = 1641, qn = 1643;
function _n(e) {
  let t = "", a = !1;
  for (const r of e) {
    const s = r.codePointAt(0);
    if (s >= ke && s <= Yn) {
      const d = String(s - ke);
      t = i(t, d);
      continue;
    }
    if (r >= "0" && r <= "9") {
      t = i(t, r);
      continue;
    }
    if ((s === qn || r === "." || r === ",") && !a) {
      t === "" && (t = "0"), t += ".", a = !0;
      continue;
    }
  }
  return t;
  function i(r, s) {
    return r.includes(".") && r.length - r.indexOf(".") - 1 >= 3 || r === "0" && s === "0" ? r : r === "0" ? s : r + s;
  }
}
function Fi({
  label: e,
  caption: t,
  value: a = "",
  onChange: i,
  disabled: r = !1,
  state: s = "idle",
  draft: d = !1,
  className: o,
  id: c,
  style: l,
  ref: u,
  useSystemKeyboard: m = !0,
  ...f
}) {
  const [h, b] = M(!1), v = [
    "mds-amount-field",
    r ? "mds-amount-field--disabled" : "",
    s === "error" ? "mds-amount-field--error" : "",
    d ? "mds-amount-field--draft" : "",
    o
  ].filter(Boolean).join(" "), k = h || a === "" ? a : ie(a, { texts: C() }).int + (a.includes(".") ? ie(a, { texts: C() }).frac : "");
  return /* @__PURE__ */ p("div", { id: c, style: l, className: v, ...f, children: [
    /* @__PURE__ */ n("span", { className: "mds-amount-field-label mds-type-label", children: e }),
    /* @__PURE__ */ p("div", { className: "mds-amount-field-box", children: [
      /* @__PURE__ */ n(
        "input",
        {
          ref: u,
          className: [
            "mds-amount-field-input",
            // ADDENDUM 2.1: past 13 characters the type drops in ONE step to
            // number-lg — the shared .mds-number-lg class (base.css), exactly
            // the Money/HeroSurface drop (23.20).
            k.length > 13 ? "mds-number-lg" : ""
          ].filter(Boolean).join(" "),
          inputMode: m ? "decimal" : "none",
          enterKeyHint: "next",
          value: k,
          disabled: r,
          "aria-label": e,
          "aria-invalid": s === "error" || void 0,
          onFocus: () => b(!0),
          onBlur: () => b(!1),
          "data-long": k.length > 13 ? "true" : void 0,
          onChange: (y) => i?.(_n(y.target.value))
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-amount-field-unit", children: C().unit })
    ] }),
    s === "error" && t ? /* @__PURE__ */ n("span", { className: "mds-amount-field-help", children: t }) : t ? /* @__PURE__ */ n("span", { className: "mds-amount-field-help", children: t }) : null
  ] });
}
const Li = [
  "default",
  "focused",
  "error",
  "disabled",
  "long"
], T = {
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
function j({ value: e, label: t, style: a, disabled: i, onPress: r }) {
  const { isPressed: s, pressProps: d } = A({ onPress: r, disabled: i }), o = [
    "mds-keypad-key",
    "mds-keypad-key--glyph",
    s ? "mds-keypad-key--pressed" : "",
    i ? "mds-keypad-key--disabled" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: o,
      style: a,
      "aria-label": g(t),
      "aria-disabled": i || void 0,
      disabled: i,
      ...d,
      children: /* @__PURE__ */ n("span", { className: "mds-keypad-key-label mds-number-lg", children: e })
    }
  );
}
function Gn({ style: e, disabled: t, onPress: a, onLongPress: i }) {
  const { isPressed: r, pressProps: s } = A({ onPress: a, onLongPress: i, disabled: t }), d = [
    "mds-keypad-key",
    "mds-keypad-key--backspace",
    r ? "mds-keypad-key--pressed" : "",
    t ? "mds-keypad-key--disabled" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: d,
      style: e,
      "aria-label": g("keypad.srBackspace"),
      "aria-disabled": t || void 0,
      disabled: t,
      ...s,
      children: /* @__PURE__ */ n(hn, { size: 24 })
    }
  );
}
function Ei({
  value: e = "",
  onChange: t,
  onLongPress: a,
  disabled: i = !1,
  className: r,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = e.includes("."), u = l ? (e.split(".")[1] ?? "").length : 0, m = l && u >= 3, f = ["mds-keypad", i ? "mds-keypad--disabled" : "", r].filter(Boolean).join(" "), h = (b) => i || b === "." && l || b !== "." && m;
  return /* @__PURE__ */ p(
    "div",
    {
      ref: o,
      id: s,
      style: d,
      className: f,
      dir: "ltr",
      role: "group",
      "aria-label": g("keypad.srGroup"),
      "data-value": e,
      ...c,
      children: [
        /* @__PURE__ */ n(j, { value: "1", label: T[1], style: { gridArea: "1 / 1 / 2 / 2" }, disabled: h("1"), onPress: () => t?.("1") }),
        /* @__PURE__ */ n(j, { value: "2", label: T[2], style: { gridArea: "1 / 2 / 2 / 3" }, disabled: h("2"), onPress: () => t?.("2") }),
        /* @__PURE__ */ n(j, { value: "3", label: T[3], style: { gridArea: "1 / 3 / 2 / 4" }, disabled: h("3"), onPress: () => t?.("3") }),
        /* @__PURE__ */ n(
          Gn,
          {
            style: { gridArea: "1 / 4 / 3 / 5" },
            disabled: i,
            onPress: () => t?.("backspace"),
            onLongPress: () => a?.()
          }
        ),
        /* @__PURE__ */ n(j, { value: "4", label: T[4], style: { gridArea: "2 / 1 / 3 / 2" }, disabled: h("4"), onPress: () => t?.("4") }),
        /* @__PURE__ */ n(j, { value: "5", label: T[5], style: { gridArea: "2 / 2 / 3 / 3" }, disabled: h("5"), onPress: () => t?.("5") }),
        /* @__PURE__ */ n(j, { value: "6", label: T[6], style: { gridArea: "2 / 3 / 3 / 4" }, disabled: h("6"), onPress: () => t?.("6") }),
        /* @__PURE__ */ n(j, { value: "7", label: T[7], style: { gridArea: "3 / 1 / 4 / 2" }, disabled: h("7"), onPress: () => t?.("7") }),
        /* @__PURE__ */ n(j, { value: "8", label: T[8], style: { gridArea: "3 / 2 / 4 / 3" }, disabled: h("8"), onPress: () => t?.("8") }),
        /* @__PURE__ */ n(j, { value: "9", label: T[9], style: { gridArea: "3 / 3 / 4 / 4" }, disabled: h("9"), onPress: () => t?.("9") }),
        /* @__PURE__ */ n(j, { value: ".", label: T["."], style: { gridArea: "3 / 4 / 4 / 5" }, disabled: h("."), onPress: () => t?.(".") }),
        /* @__PURE__ */ n(j, { value: "0", label: T[0], style: { gridArea: "4 / 1 / 5 / 3" }, disabled: h("0"), onPress: () => t?.("0") }),
        /* @__PURE__ */ n(j, { value: "000", label: T["000"], style: { gridArea: "4 / 3 / 5 / 5" }, disabled: h("000"), onPress: () => t?.("000") })
      ]
    }
  );
}
const Di = [
  "default",
  "pressed",
  "disabled",
  "decimal-disabled",
  "fraction-full"
], R = [
  { value: "in", word: "movement.in" },
  { value: "out", word: "movement.out" },
  { value: "transfer", word: "movement.transfer" }
];
function Ri({
  value: e,
  onChange: t,
  disabled: a = !1,
  state: i = "idle",
  className: r,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = [
    "mds-movement-type",
    i === "error" ? "mds-movement-type--error" : "",
    r
  ].filter(Boolean).join(" "), u = (m, f) => {
    const h = m === void 0 ? -1 : R.findIndex((b) => b.value === m);
    return R[(h + f + R.length) % R.length] ?? R[0];
  };
  return /* @__PURE__ */ p(
    "div",
    {
      ref: o,
      id: s,
      style: d,
      className: l,
      role: "radiogroup",
      "aria-label": g("movementType.srGroup"),
      "data-value": e ?? "",
      ...c,
      children: [
        /* @__PURE__ */ n("div", { className: "mds-segmented", children: R.map((m) => /* @__PURE__ */ n(
          Qn,
          {
            segment: m,
            selected: m.value === e,
            disabled: a,
            onChange: t,
            walk: u
          },
          m.value
        )) }),
        i === "error" ? /* @__PURE__ */ n("span", { className: "mds-movement-type-error mds-type-caption", children: g("movementType.choose") }) : null
      ]
    }
  );
}
function Qn({
  segment: e,
  selected: t,
  disabled: a,
  onChange: i,
  walk: r
}) {
  const { isPressed: s, pressProps: d } = A({ onPress: () => i?.(e.value), disabled: a }), o = [
    "mds-segmented-segment",
    t ? "mds-segmented-segment--selected" : "",
    s ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: o,
      "aria-checked": t,
      "aria-label": g(e.word),
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      onKeyDown: (c) => {
        const l = c.key === "ArrowLeft" || c.key === "ArrowDown" ? 1 : c.key === "ArrowRight" || c.key === "ArrowUp" ? -1 : 0;
        if (l === 0) return;
        c.preventDefault();
        const u = r(e.value, l);
        i?.(u.value);
        const m = c.currentTarget.parentElement;
        (m ? Array.from(m.querySelectorAll('[role="radio"]')) : [])[R.findIndex((h) => h.value === u.value)]?.focus();
      },
      ...d,
      children: /* @__PURE__ */ n("span", { className: "mds-segmented-segment-label", children: g(e.word) })
    }
  );
}
const Oi = [
  "default",
  "selected",
  "pressed",
  "disabled",
  "error"
], Kn = He("motion.response-max-ms");
function Wn({
  label: e,
  value: t,
  onChange: a,
  min: i = 0,
  max: r,
  step: s = 1,
  disabled: d = !1,
  className: o,
  id: c,
  style: l,
  ref: u,
  ...m
}) {
  const f = t ?? i, h = d || f <= i, b = d || r !== void 0 && f >= r, [v, k] = M(null), y = v ?? String(f), x = S(null), w = S(() => {
  }), H = S(t), B = V(() => {
    x.current !== null && (clearInterval(x.current), x.current = null);
  }, []), L = V(
    (Z) => {
      k(null);
      const $ = (H.current ?? i) + Z * s;
      $ < i || r !== void 0 && $ > r || a?.($);
    },
    [i, r, s, a]
  );
  I(() => {
    w.current = L, H.current = t;
  });
  const q = V((Z) => {
    B(), w.current(Z), x.current = setInterval(() => w.current(Z), Kn);
  }, [B]);
  I(() => B, [B]);
  const z = ["mds-quantity-stepper", d ? "mds-quantity-stepper--disabled" : "", o].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "div",
    {
      ref: u,
      id: c,
      style: l,
      className: z,
      dir: "ltr",
      role: "group",
      "aria-label": e,
      "data-value": f,
      ...m,
      children: [
        /* @__PURE__ */ n(
          ve,
          {
            icon: /* @__PURE__ */ n(bn, { size: 20 }),
            name: g("quantity.decrease"),
            disabled: h,
            step: () => L(-1),
            startRepeat: () => q(-1),
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
            value: y,
            disabled: d,
            onFocus: () => k(String(f)),
            onChange: (Z) => {
              const $ = Z.currentTarget.value;
              k($);
              const E = Number.parseInt($, 10);
              Number.isFinite(E) && E >= i && (r === void 0 || E <= r) && a?.(E);
            },
            onBlur: () => {
              const Z = Number.parseInt(v ?? "", 10), $ = Number.isFinite(Z) ? Math.min(Math.max(Z, i), r ?? Number.MAX_SAFE_INTEGER) : f, E = Math.round($ / s) * s, K = Math.min(Math.max(E, i), r ?? Number.MAX_SAFE_INTEGER);
              K !== f && a?.(K), k(null);
            }
          }
        ),
        /* @__PURE__ */ n(
          ve,
          {
            icon: /* @__PURE__ */ n(fn, { size: 20 }),
            name: g("quantity.increase"),
            disabled: b,
            step: () => L(1),
            startRepeat: () => q(1),
            stopRepeat: B
          }
        )
      ]
    }
  );
}
function ve({
  icon: e,
  name: t,
  disabled: a,
  step: i,
  startRepeat: r,
  stopRepeat: s
}) {
  const { isPressed: d, pressProps: o } = A({
    onPress: i,
    onLongPress: r,
    disabled: a
  }), c = [
    "mds-quantity-stepper-button",
    d ? "mds-quantity-stepper-button--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: c,
      "aria-label": t,
      "aria-disabled": a || void 0,
      disabled: a,
      onKeyDown: (l) => {
        (l.key === " " || l.key === "Enter") && !l.repeat && (l.preventDefault(), r());
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
const Yi = [
  "default",
  "pressed",
  "at-min",
  "at-max",
  "typing",
  "disabled"
];
function te(e) {
  if (!e) return Number.NaN;
  const t = e.split("/");
  if (t.length !== 3) return Number.NaN;
  const a = Number.parseInt(t[0], 10), i = Number.parseInt(t[1], 10), r = Number.parseInt(t[2], 10);
  return !Number.isFinite(a) || !Number.isFinite(i) || !Number.isFinite(r) ? Number.NaN : r * 1e4 + i * 100 + a;
}
function qi({
  label: e,
  value: t,
  items: a,
  min: i,
  max: r,
  onChange: s,
  disabled: d = !1,
  state: o = "idle",
  onPress: c,
  className: l,
  id: u,
  style: m,
  ref: f,
  ...h
}) {
  const b = a.some((x) => x.value === t), v = t !== void 0 && !b ? t : void 0, k = (x) => {
    const w = te(x), H = te(i), B = te(r);
    return !!(Number.isFinite(w) && Number.isFinite(H) && w < H || Number.isFinite(w) && Number.isFinite(B) && w > B);
  }, y = [
    "mds-date-quick",
    o === "error" ? "mds-date-quick--error" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "div",
    {
      ref: f,
      id: u,
      style: m,
      className: y,
      role: "radiogroup",
      "aria-label": e,
      "data-value": t ?? "",
      ...h,
      children: [
        /* @__PURE__ */ p("div", { className: "mds-date-quick-row", children: [
          a.map((x) => /* @__PURE__ */ n(
            Xn,
            {
              item: x,
              selected: x.value === t,
              disabled: d || k(x.value),
              onChange: s
            },
            x.value
          )),
          /* @__PURE__ */ n(
            Un,
            {
              customDate: v,
              disabled: d,
              onChange: s,
              onPress: c
            }
          )
        ] }),
        o === "error" ? /* @__PURE__ */ n("span", { className: "mds-date-quick-error mds-type-caption", children: g("dateQuick.choose") }) : null
      ]
    }
  );
}
function Xn({
  item: e,
  selected: t,
  disabled: a,
  onChange: i
}) {
  const { isPressed: r, pressProps: s } = A({ onPress: () => i?.(e.value), disabled: a }), d = [
    "mds-filter-chip",
    "mds-date-quick-chip",
    t ? "mds-filter-chip--selected" : "",
    r ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: d,
      "aria-checked": t,
      "aria-label": g("dateQuick.chipName", { label: e.label, value: e.value }),
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...s,
      children: /* @__PURE__ */ n("span", { className: "mds-filter-chip-label", children: e.label })
    }
  );
}
function Un({
  customDate: e,
  disabled: t,
  onChange: a,
  onPress: i
}) {
  const r = e !== void 0, { isPressed: s, pressProps: d } = A({
    onPress: () => r ? a?.(e) : i?.(),
    disabled: t
  }), o = [
    "mds-filter-chip",
    "mds-date-quick-chip",
    "mds-date-quick-chip--other",
    r ? "mds-filter-chip--selected" : "",
    s ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: o,
      "aria-checked": r,
      "aria-label": r ? e : g("dateQuick.other"),
      disabled: t,
      "data-ds-exempt": t ? void 0 : "",
      ...d,
      children: r ? /* @__PURE__ */ n("span", { className: "mds-filter-chip-label mds-date-quick-chip-date", children: e }) : /* @__PURE__ */ p(Y, { children: [
        /* @__PURE__ */ n(kn, { size: 16, className: "mds-date-quick-chip-icon" }),
        /* @__PURE__ */ n("span", { className: "mds-filter-chip-label", children: g("dateQuick.other") })
      ] })
    }
  );
}
const _i = [
  "default",
  "selected",
  "custom-date",
  "pressed",
  "disabled",
  "error"
];
function zn(e) {
  return e < 10 ? `0${e}` : String(e);
}
function Ze(e) {
  const t = Math.max(0, Math.min(1439, Math.round(e))), a = Math.floor(t / 60), i = t % 60, r = a < 12, d = `${a % 12 === 0 ? 12 : a % 12}:${zn(i)}`;
  return {
    text: `${d} ${g(r ? "time.am" : "time.pm")}`,
    spoken: `${d} ${g(r ? "time.amSpoken" : "time.pmSpoken")}`
  };
}
function W({
  variant: e = "primary",
  mode: t = "surface",
  size: a = "md",
  loading: i = !1,
  leading: r,
  trailing: s,
  onPress: d,
  onLongPress: o,
  disabled: c = !1,
  className: l,
  id: u,
  style: m,
  ref: f,
  children: h,
  ...b
}) {
  const { isPressed: v, pressProps: k } = A({
    onPress: d,
    onLongPress: o,
    disabled: c || i
  }), y = Pe(i), x = [
    "mds-button",
    `mds-button--${e}`,
    `mds-button--${a}`,
    t === "canvas" ? "mds-button--on-canvas" : "",
    v ? "mds-button--pressed" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "button",
    {
      ref: f,
      id: u,
      style: m,
      ...b,
      ...k,
      type: "button",
      className: x,
      disabled: c,
      "aria-busy": i || void 0,
      children: [
        y ? /* @__PURE__ */ n("span", { className: "mds-button-spinner", "aria-hidden": "true" }) : r ? /* @__PURE__ */ n("span", { className: "mds-button-icon", children: r }) : null,
        /* @__PURE__ */ n("span", { className: "mds-button-label", children: h }),
        s ? /* @__PURE__ */ n("span", { className: "mds-button-icon", children: s }) : null
      ]
    }
  );
}
const Gi = [
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
  disabled: i = !1,
  caption: r,
  onRetry: s,
  leading: d = !0,
  trailing: o,
  className: c,
  id: l,
  style: u,
  ref: m,
  ...f
}) {
  const h = Je(), b = h.keyboardHeight > 0 ? {
    bottom: `calc(${h.keyboardHeight}px + env(safe-area-inset-bottom))`
  } : void 0, v = ["mds-action-bar", d ? "mds-action-bar--more" : "", c].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "div",
    {
      ref: m,
      id: l,
      style: { ...b, ...u },
      className: v,
      role: "group",
      "aria-label": e,
      ...f,
      children: [
        r ? /* @__PURE__ */ n(W, { variant: "text", onPress: s, className: "mds-action-bar-secondary", children: r }) : null,
        /* @__PURE__ */ n(
          W,
          {
            variant: "primary",
            onPress: t,
            loading: a,
            disabled: i,
            leading: o,
            className: "mds-action-bar-primary",
            children: e
          }
        )
      ]
    }
  );
}
const Qi = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "loading",
  "contentMore",
  "scrolledToEnd",
  "keyboardOpen"
];
function he({
  label: e,
  onPress: t,
  onLongPress: a,
  disabled: i = !1,
  density: r = "regular",
  className: s,
  id: d,
  style: o,
  ref: c,
  children: l,
  ...u
}) {
  const { isPressed: m, pressProps: f } = A({ onPress: t, onLongPress: a, disabled: i }), h = [
    "mds-icon-button",
    r === "large" ? "mds-icon-button--large" : "",
    m ? "mds-icon-button--pressed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      ref: c,
      id: d,
      style: o,
      ...u,
      ...f,
      type: "button",
      className: h,
      "aria-label": e,
      disabled: i,
      children: l
    }
  );
}
const Ki = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "large"
];
function Jn({
  leading: e,
  value: t,
  onChange: a,
  disabled: i = !1,
  label: r,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      ref: c,
      id: d,
      style: o,
      className: ["mds-segmented", s].filter(Boolean).join(" "),
      role: "group",
      "aria-label": r,
      ...l,
      children: e.map((u) => /* @__PURE__ */ n(
        ea,
        {
          segment: u,
          selected: u.value === t,
          disabled: i || u.disabled === !0,
          onChange: a
        },
        u.value
      ))
    }
  );
}
function ea({
  segment: e,
  selected: t,
  disabled: a,
  onChange: i
}) {
  const { isPressed: r, pressProps: s } = A({ onPress: () => i(e.value), disabled: a }), d = [
    "mds-segmented-segment",
    t ? "mds-segmented-segment--selected" : "",
    r ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "button",
    {
      type: "button",
      className: d,
      "aria-pressed": t === !0,
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...s,
      children: [
        e.leading ? /* @__PURE__ */ n("span", { className: "mds-segmented-segment-icon", "aria-hidden": "true", children: e.leading }) : null,
        /* @__PURE__ */ n("span", { className: "mds-segmented-segment-label", children: e.label })
      ]
    }
  );
}
const Wi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "threeSegments",
  "fourSegments",
  "withIcon"
], ne = /* @__PURE__ */ new Set();
function pe({
  label: e,
  variant: t = "detail",
  children: a,
  onDismiss: i,
  className: r,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = S(null), [u, m] = M(0), [f, h] = M(!1), [b, v] = M(!1), k = S(0), y = S(0), x = S(0), w = S(null), H = S(i);
  I(() => {
    H.current = i;
  }, [i]);
  const B = V(() => {
    w.current?.focus?.(), H.current();
  }, []), [L] = M(() => /* @__PURE__ */ Symbol("sheet")), [q] = M(() => (ne.add(L), ne.size >= 2 ? 2 : 1));
  I(
    () => () => {
      ne.delete(L);
    },
    [L]
  );
  const z = () => {
    const N = l.current?.querySelector(".mds-sheet-panel");
    return N ? N.getBoundingClientRect().height * 0.3 : 0;
  }, Z = V(() => {
    if (b) return;
    w.current = document.activeElement ?? null, v(!0), (typeof requestAnimationFrame == "function" ? requestAnimationFrame : (P) => setTimeout(() => P(performance.now()), 0))(() => {
      const P = l.current?.querySelector(".mds-sheet-panel");
      if (!P) {
        B();
        return;
      }
      const F = getComputedStyle(P).transitionDuration, be = F && F !== "0s" && F !== "";
      if (P.style.transform = "translateY(100%)", !be) {
        B();
        return;
      }
      const _ = (Ie) => {
        Ie.propertyName === "transform" && (P.removeEventListener("transitionend", _), B());
      };
      P.addEventListener("transitionend", _);
    });
  }, [b, B]), $ = (N) => {
    if (!f) return;
    const P = performance.now(), F = P - x.current;
    F > 0 && (k.current = (N.clientY - y.current) / F), y.current = N.clientY, x.current = P, m(Math.max(0, N.clientY - E.current));
  }, E = S(0), K = (N) => {
    const P = N.target, F = l.current?.querySelector(".mds-sheet-body");
    if (!(F?.contains(P) && F && F.scrollTop > 0)) {
      if (b) {
        const _ = l.current?.querySelector(".mds-sheet-panel");
        _ && (_.style.transform = u ? `translateY(${u}px)` : ""), v(!1);
      }
      k.current = 0, y.current = N.clientY, x.current = performance.now(), h(!0), N.currentTarget.setPointerCapture?.(N.pointerId);
    }
  }, ge = () => {
    if (!f) return;
    h(!1);
    const N = u > z(), P = k.current > 0.6;
    N || P ? Z() : m(0);
  };
  I(() => {
    const N = (P) => {
      P.key === "Escape" && Z();
    };
    return window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N);
  }, [Z]);
  const Ve = [
    "mds-sheet",
    t === "form" ? "mds-sheet--form" : "",
    q === 2 ? "mds-sheet--stacked" : "",
    f ? "mds-sheet--dragging" : "",
    b ? "mds-sheet--closing" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "div",
    {
      ref: (N) => {
        l.current = N, typeof o == "function" ? o(N) : o && (o.current = N);
      },
      id: s,
      style: d,
      className: Ve,
      "data-ds-sheet-level": String(q),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": e,
      ...c,
      children: [
        /* @__PURE__ */ n(
          "div",
          {
            className: "mds-sheet-scrim",
            onClick: () => Z(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ p(
          "div",
          {
            className: "mds-sheet-panel",
            style: u ? { transform: `translateY(${u}px)` } : void 0,
            children: [
              /* @__PURE__ */ p(
                "div",
                {
                  className: "mds-sheet-grab",
                  onPointerDown: (N) => {
                    E.current = N.clientY - u, K(N);
                  },
                  onPointerMove: $,
                  onPointerUp: ge,
                  onPointerCancel: ge,
                  children: [
                    /* @__PURE__ */ n("span", { className: "mds-sheet-handle", "aria-hidden": "true" }),
                    /* @__PURE__ */ n("header", { className: "mds-sheet-header", children: /* @__PURE__ */ n("h2", { className: "mds-sheet-title mds-type-title-section", children: e }) })
                  ]
                }
              ),
              /* @__PURE__ */ n("div", { className: "mds-sheet-close", children: /* @__PURE__ */ n(he, { label: e, onPress: Z, children: /* @__PURE__ */ n(wt, {}) }) }),
              /* @__PURE__ */ n("div", { className: "mds-sheet-body", children: a })
            ]
          }
        )
      ]
    }
  );
}
const Xi = [
  "default",
  "open",
  "dragging",
  "pastThreshold",
  "stacked"
], ye = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
function Ui({
  label: e,
  value: t,
  step: a = 15,
  min: i,
  max: r,
  onChange: s,
  disabled: d = !1,
  state: o = "idle",
  className: c,
  id: l,
  style: u,
  ref: m,
  ...f
}) {
  const [h, b] = M(!1), v = t !== void 0 ? Ze(t) : void 0, k = [
    "mds-time-field",
    o === "error" ? "mds-time-field--error" : "",
    d ? "mds-time-field--disabled" : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("span", { ref: m, id: l, style: u, className: k, ...f, children: [
    /* @__PURE__ */ n("span", { className: "mds-time-field-label mds-type-label", children: e }),
    /* @__PURE__ */ n(
      ta,
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
    o === "error" ? /* @__PURE__ */ n("span", { className: "mds-time-field-error mds-type-caption", children: g("timePicker.choose") }) : null,
    h ? /* @__PURE__ */ n(
      na,
      {
        label: e,
        value: t,
        step: a,
        min: i,
        max: r,
        onApply: (y) => {
          s?.(y), b(!1);
        },
        onDismiss: () => b(!1)
      }
    ) : null
  ] });
}
function ta({
  label: e,
  formatted: t,
  disabled: a,
  error: i,
  onOpen: r,
  hasValue: s,
  onClearValue: d
}) {
  const { isPressed: o, pressProps: c } = A({ onPress: r, disabled: a }), l = t ? g("timePicker.srName", { label: e, time: t.spoken }) : e, u = [
    "mds-text-field-input",
    "mds-time-field-box",
    o ? "mds-time-field-box--pressed" : "",
    i ? "mds-time-field-box--error" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("span", { className: "mds-time-field-row", children: [
    /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: u,
        "aria-label": l,
        disabled: a,
        "data-ds-exempt": "",
        ...c,
        children: [
          t ? /* @__PURE__ */ n("span", { className: "mds-time-field-text", children: t.text }) : /* @__PURE__ */ n("span", { className: "mds-time-field-text mds-time-field-text--empty" }),
          /* @__PURE__ */ n(yn, { size: 20, className: "mds-time-field-icon" })
        ]
      }
    ),
    s ? /* @__PURE__ */ n(he, { label: g("sr.clear"), disabled: a, onPress: d, children: /* @__PURE__ */ n(ue, { size: 20 }) }) : null
  ] });
}
function na({
  label: e,
  value: t,
  step: a,
  min: i,
  max: r,
  onApply: s,
  onDismiss: d
}) {
  const [o, c] = M(t), [l, u] = M(t !== void 0 && t >= 720 ? "pm" : "am"), m = o !== void 0 ? Ze(o) : void 0, f = l === "am", h = aa(a), b = (x) => (i === void 0 || x >= i) && (r === void 0 || x <= r), v = (x) => h.some((w) => b(ae(x, w, f))), k = (x) => ye.some((w) => b(ae(w, x, f))), y = () => {
    o !== void 0 && s(o);
  };
  return /* @__PURE__ */ p(pe, { variant: "form", label: e, onDismiss: d, children: [
    /* @__PURE__ */ n("div", { className: "mds-time-sheet-head", children: /* @__PURE__ */ n("span", { className: "mds-time-sheet-value mds-type-number-lg", children: m ? m.text : g("money.missing") }) }),
    /* @__PURE__ */ n(
      Jn,
      {
        label: g("time.periodGroup"),
        leading: [
          { value: "am", label: g("time.am") },
          { value: "pm", label: g("time.pm") }
        ],
        value: l,
        onChange: (x) => {
          if (u(x === "pm" ? "pm" : "am"), o === void 0) return;
          const w = Math.floor(o / 60), H = w % 12 === 0 ? 12 : w % 12, B = x === "pm" ? 12 : 0, L = H % 12 + B;
          c(L * 60 + o % 60);
        }
      }
    ),
    /* @__PURE__ */ n(
      we,
      {
        title: g("time.hour"),
        options: ye.map((x) => ({
          value: String(x),
          label: String(x),
          disabled: !v(x)
        })),
        selected: o === void 0 ? void 0 : String(Math.floor(o / 60) % 12 === 0 ? 12 : Math.floor(o / 60) % 12),
        onChange: (x) => {
          const w = Number.parseInt(x, 10), H = o === void 0 ? 0 : o % 60;
          c(ae(w, H, f));
        }
      }
    ),
    /* @__PURE__ */ n(
      we,
      {
        title: g("time.minutes"),
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
    /* @__PURE__ */ n(Ce, { label: g("timePicker.apply"), onPress: y, disabled: o === void 0, leading: !0 })
  ] });
}
function ae(e, t, a) {
  return (e % 12 + (a ? 0 : 12)) * 60 + t;
}
function aa(e) {
  const t = e > 0 && 60 % e === 0 ? e : 15;
  return Array.from({ length: 60 / t }, (a, i) => i * t);
}
function we({
  title: e,
  options: t,
  selected: a,
  onChange: i
}) {
  return /* @__PURE__ */ p("div", { className: "mds-time-slot", children: [
    /* @__PURE__ */ n("span", { className: "mds-time-slot-title mds-type-label-strong", children: e }),
    /* @__PURE__ */ n("div", { className: "mds-time-slot-grid", role: "radiogroup", "aria-label": e, children: t.map((r) => /* @__PURE__ */ n(
      ia,
      {
        option: r,
        selected: r.value === a,
        onChange: i
      },
      r.value
    )) })
  ] });
}
function ia({
  option: e,
  selected: t,
  onChange: a
}) {
  const { isPressed: i, pressProps: r } = A({ onPress: () => a(e.value), disabled: e.disabled }), s = [
    "mds-filter-chip",
    "mds-time-slot-chip",
    t ? "mds-filter-chip--selected" : "",
    i ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: s,
      "aria-checked": t,
      "aria-label": e.label,
      disabled: e.disabled,
      "data-ds-exempt": e.disabled ? void 0 : "",
      ...r,
      children: /* @__PURE__ */ n("span", { className: "mds-filter-chip-label mds-time-slot-chip-label", children: e.label })
    }
  );
}
const zi = [
  "default",
  "empty",
  "chosen",
  "pressed",
  "sheet-open",
  "disabled",
  "error"
];
function ra(e) {
  return e === 1 ? g("duration.hourOne") : e === 2 ? g("duration.hourTwo") : `${e} ${e >= 3 && e <= 10 ? g("duration.hourFew") : g("duration.hourMany")}`;
}
function sa(e) {
  return e === 1 ? g("duration.minuteOne") : e === 2 ? g("duration.minuteTwo") : `${e} ${e >= 3 && e <= 10 ? g("duration.minuteFew") : g("duration.minuteMany")}`;
}
function re(e) {
  const t = Math.max(0, Math.min(1440, Math.round(e))), a = Math.floor(t / 60), i = t % 60, r = [];
  return a > 0 && r.push(ra(a)), i === 30 && a > 0 ? r.push(g("duration.half")) : i > 0 && r.push(`${a > 0 ? g("duration.and") : ""}${sa(i)}`), r.join(" ");
}
const oa = [15, 30, 45, 60, 90, 120, 180, 240];
function Ji({
  label: e,
  value: t,
  min: a = 15,
  max: i = 720,
  step: r = 15,
  onChange: s,
  disabled: d = !1,
  className: o,
  id: c,
  style: l,
  ref: u,
  ...m
}) {
  const [f, h] = M(!1), b = [
    "mds-duration-field",
    d ? "mds-duration-field--disabled" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("span", { ref: u, id: c, style: l, className: b, ...m, children: [
    /* @__PURE__ */ n("span", { className: "mds-duration-field-label mds-type-label", children: e }),
    /* @__PURE__ */ n(
      da,
      {
        label: e,
        text: t !== void 0 ? re(t) : void 0,
        disabled: d,
        onOpen: () => h(!0),
        hasValue: t !== void 0,
        onClearValue: () => s?.(void 0)
      }
    ),
    f ? /* @__PURE__ */ n(
      la,
      {
        label: e,
        value: t,
        min: a,
        max: i,
        step: r,
        onApply: (v) => {
          s?.(v), h(!1);
        },
        onDismiss: () => h(!1)
      }
    ) : null
  ] });
}
function da({
  label: e,
  text: t,
  disabled: a,
  onOpen: i,
  hasValue: r,
  onClearValue: s
}) {
  const { isPressed: d, pressProps: o } = A({ onPress: i, disabled: a }), c = t ? g("durationPicker.srName", { label: e, duration: t }) : e, l = [
    "mds-text-field-input",
    "mds-duration-field-box",
    d ? "mds-duration-field-box--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("span", { className: "mds-duration-field-row", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: l,
        "aria-label": c,
        disabled: a,
        "data-ds-exempt": "",
        ...o,
        children: /* @__PURE__ */ n("span", { className: "mds-duration-field-text", children: t ?? "" })
      }
    ),
    r ? /* @__PURE__ */ n(he, { label: g("sr.clear"), disabled: a, onPress: s, children: /* @__PURE__ */ n(ue, { size: 20 }) }) : null
  ] });
}
function la({
  label: e,
  value: t,
  min: a,
  max: i,
  step: r,
  onApply: s,
  onDismiss: d
}) {
  const [o, c] = M(t), l = o !== void 0 ? re(o) : void 0;
  return /* @__PURE__ */ p(pe, { label: e, onDismiss: d, children: [
    /* @__PURE__ */ n("div", { className: "mds-duration-sheet-head", children: /* @__PURE__ */ n("span", { className: "mds-duration-sheet-value mds-type-number-lg", children: l ?? g("money.missing") }) }),
    /* @__PURE__ */ n("div", { className: "mds-duration-common", role: "radiogroup", "aria-label": g("duration.common"), children: oa.map((u) => /* @__PURE__ */ n(
      ca,
      {
        label: re(u),
        selected: o === u,
        onChange: () => c(u)
      },
      u
    )) }),
    /* @__PURE__ */ p("div", { className: "mds-duration-other", children: [
      /* @__PURE__ */ n(
        Wn,
        {
          label: g("duration.other"),
          value: o,
          min: a,
          max: i,
          step: r,
          onChange: (u) => c(Math.min(Math.max(u, a), i))
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-visually-hidden", "aria-live": "polite", children: l ?? "" }),
      /* @__PURE__ */ n("span", { className: "mds-duration-other-text mds-type-body", children: l ?? "" })
    ] }),
    /* @__PURE__ */ n(
      Ce,
      {
        label: g("durationPicker.apply"),
        onPress: () => o !== void 0 && s(o),
        disabled: o === void 0,
        leading: !0
      }
    )
  ] });
}
function ca({
  label: e,
  selected: t,
  onChange: a
}) {
  const { isPressed: i, pressProps: r } = A({ onPress: a }), s = [
    "mds-filter-chip",
    "mds-duration-common-chip",
    t ? "mds-filter-chip--selected" : "",
    i ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      role: "radio",
      className: s,
      "aria-checked": t,
      "aria-label": e,
      "data-ds-exempt": "",
      ...r,
      children: /* @__PURE__ */ n("span", { className: "mds-filter-chip-label mds-duration-common-chip-label", children: e })
    }
  );
}
const er = [
  "default",
  "empty",
  "chosen",
  "pressed",
  "sheet-open",
  "stepper-typing",
  "disabled"
], ua = {
  done: Me,
  waiting: jt,
  problem: me,
  info: $t
}, ma = {
  done: "badge.done",
  waiting: "badge.waiting",
  problem: "badge.problem",
  info: "badge.info",
  neutral: "badge.neutral"
};
function tr({
  tone: e,
  label: t,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  const o = e === "neutral" ? null : ua[e], c = ["mds-status-badge", `mds-status-badge--${e}`, a].filter(Boolean).join(" ");
  return /* @__PURE__ */ n("span", { ref: s, id: i, style: r, className: c, ...d, children: /* @__PURE__ */ p("span", { className: "mds-status-badge-content", children: [
    o ? /* @__PURE__ */ n(o, { size: 14 }) : null,
    /* @__PURE__ */ n("span", { className: "mds-status-badge-label", children: t ?? g(ma[e]) })
  ] }, e) });
}
const nr = [
  "neutral",
  "info",
  "done",
  "waiting",
  "problem",
  "longLabel"
], ha = {
  done: Kt,
  waiting: Xt
};
function pa(e) {
  let t = e.trim().split(/\s+/)[0];
  const a = String.fromCodePoint(1575, 1604);
  return t.length > a.length && t.startsWith(a) && (t = t.slice(a.length)), t ? Array.from(t)[0] : void 0;
}
function fe({
  size: e = "md",
  variant: t = "surface",
  value: a,
  tone: i,
  children: r,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const u = i === "done" || i === "waiting" ? ha[i] : null, m = r ? void 0 : a ? pa(a) : void 0, f = [
    "mds-entity-mark",
    `mds-entity-mark--${e}`,
    t === "canvas" ? "mds-entity-mark--canvas" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("span", { ref: c, id: d, style: o, className: f, "aria-hidden": "true", ...l, children: [
    r ?? (m ? /* @__PURE__ */ n("span", { className: "mds-entity-mark-initial", children: m }) : null),
    u ? /* @__PURE__ */ n("span", { className: "mds-entity-mark-badge", children: /* @__PURE__ */ n(u, { size: 14 }) }) : null
  ] });
}
const ar = [
  "initial",
  "sizes",
  "fundTypes",
  "approved",
  "pending",
  "withImageRule"
];
function ir({
  label: e,
  caption: t,
  value: a,
  onChange: i,
  placeholder: r,
  state: s = "idle",
  disabled: d = !1,
  optional: o = !1,
  className: c,
  id: l,
  style: u,
  ref: m,
  ...f
}) {
  const h = [
    "mds-field",
    "mds-text-field",
    s === "error" ? "mds-text-field--error" : "",
    d ? "mds-text-field--disabled mds-field--disabled" : "",
    c
  ].filter(Boolean).join(" "), b = l ? `${l}-input` : void 0;
  return /* @__PURE__ */ p("span", { ref: m, id: l, style: u, className: h, ...f, children: [
    /* @__PURE__ */ p("label", { className: "mds-text-field-label mds-type-label", htmlFor: b, children: [
      e,
      o ? /* @__PURE__ */ n("span", { className: "mds-text-field-optional mds-type-caption", children: g("field.optional") }) : null
    ] }),
    /* @__PURE__ */ n(
      "input",
      {
        id: b,
        className: "mds-text-field-input mds-field-input",
        type: "text",
        value: a,
        disabled: d,
        placeholder: r,
        "aria-label": l ? void 0 : e,
        "aria-invalid": s === "error" || void 0,
        onChange: (v) => i?.(v.target.value)
      }
    ),
    t ? /* @__PURE__ */ p("span", { className: s === "error" ? "mds-text-field-caption mds-text-field-caption--error" : "mds-text-field-caption", children: [
      s === "error" ? /* @__PURE__ */ n(me, { size: 14 }) : null,
      t
    ] }) : null
  ] });
}
const rr = [
  "default",
  "focused",
  "disabled",
  "error",
  "withCaption",
  "withPlaceholder"
];
function sr({
  leading: e,
  value: t,
  onChange: a,
  disabled: i = !1,
  label: r,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const u = (m) => {
    const f = t.includes(m) ? t.filter((h) => h !== m) : [...t, m];
    a(f);
  };
  return /* @__PURE__ */ n(
    "div",
    {
      ref: c,
      id: d,
      style: o,
      className: ["mds-filter-chips", s].filter(Boolean).join(" "),
      role: "group",
      "aria-label": r,
      ...l,
      children: e.map((m) => /* @__PURE__ */ n(
        fa,
        {
          chip: m,
          selected: t.includes(m.value),
          disabled: i || m.disabled === !0,
          onToggle: u
        },
        m.value
      ))
    }
  );
}
function fa({
  chip: e,
  selected: t,
  disabled: a,
  onToggle: i
}) {
  const { isPressed: r, pressProps: s } = A({ onPress: () => i(e.value), disabled: a }), d = [
    "mds-filter-chip",
    t ? "mds-filter-chip--selected" : "",
    r ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "button",
    {
      type: "button",
      className: d,
      "aria-pressed": t === !0,
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...s,
      children: [
        t ? /* @__PURE__ */ n(ce, { size: 16, className: "mds-filter-chip-check" }) : null,
        /* @__PURE__ */ n("span", { className: "mds-filter-chip-label", children: e.label })
      ]
    }
  );
}
const or = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "manyChips"
];
function dr({
  children: e,
  label: t,
  trailing: a,
  density: i = "regular",
  className: r,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = [
    "mds-surface",
    i === "list" ? "mds-surface--list" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("div", { ref: o, id: s, style: d, className: l, ...c, children: [
    t || a ? /* @__PURE__ */ p("div", { className: "mds-surface-header", children: [
      t ? /* @__PURE__ */ n("h3", { className: "mds-surface-title", children: t }) : null,
      a ? /* @__PURE__ */ n("div", { className: "mds-surface-action", children: a }) : null
    ] }) : null,
    e
  ] });
}
const lr = [
  "default",
  "withHeader",
  "withAction",
  "pressed",
  "list"
];
function cr({ children: e, className: t, id: a, style: i, ref: r, ...s }) {
  return /* @__PURE__ */ n(
    "div",
    {
      ref: r,
      id: a,
      style: i,
      className: ["mds-well", t].filter(Boolean).join(" "),
      ...s,
      children: e
    }
  );
}
const ur = [
  "default",
  "inSurface"
];
function mr({
  label: e,
  caption: t,
  onPress: a,
  children: i,
  className: r,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = i == null, { isPressed: u, pressProps: m } = A({ onPress: () => a?.(), disabled: l }), f = !l && a !== void 0, h = ["mds-section", r].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("section", { ref: o, id: s, style: d, className: h, ...c, children: [
    /* @__PURE__ */ p("header", { className: "mds-section-header", children: [
      /* @__PURE__ */ n("h2", { className: "mds-section-title mds-type-title-section", children: e }),
      t !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-section-count", children: t }) : null,
      f ? /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: ["mds-section-see-all", u ? "mds-section-see-all--pressed" : ""].filter(Boolean).join(" "),
          "data-ds-exempt": "",
          ...m,
          children: [
            /* @__PURE__ */ n("span", { className: "mds-section-see-all-label", children: g("button.all") }),
            /* @__PURE__ */ n(xt, { size: 16, className: "mds-section-see-all-icon" })
          ]
        }
      ) : null
    ] }),
    i
  ] });
}
const hr = [
  "default",
  "withCount",
  "withSeeAll",
  "empty"
], X = 80, Te = D.size["dot-signal"] / 2, ga = D.border["signal-line"], G = Te + ga / 2;
function ba(e, t) {
  const a = e.length, i = Math.min(...e), s = Math.max(...e) - i, d = (l) => a === 1 ? X - G : G + l / (a - 1) * (X - 2 * G), o = (l) => s === 0 ? t / 2 : G + (1 - (l - i) / s) * (t - 2 * G);
  return { points: e.map((l, u) => `${d(u).toFixed(2)},${o(l).toFixed(2)}`).join(" "), endX: d(a - 1), endY: o(e[a - 1]) };
}
function je({
  values: e,
  lineClassName: t,
  dotClassName: a,
  hidden: i = !1,
  height: r,
  fullWidth: s = !1
}) {
  const d = r ?? D.size["sparkline-height"], o = !i && e.length >= 1 ? ba(e, d) : null;
  return /* @__PURE__ */ p(
    "svg",
    {
      viewBox: `0 0 ${X} ${d}`,
      width: s ? "100%" : X,
      height: d,
      preserveAspectRatio: s ? "none" : void 0,
      focusable: "false",
      children: [
        o && e.length >= 2 ? /* @__PURE__ */ n(
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
          /* @__PURE__ */ n(
            "path",
            {
              className: a,
              d: `M ${o.endX.toFixed(2)} ${o.endY.toFixed(2)} L ${o.endX.toFixed(2)} ${o.endY.toFixed(2)}`,
              strokeWidth: D.size["dot-signal"],
              strokeLinecap: "round",
              vectorEffect: "non-scaling-stroke",
              fill: "none"
            }
          )
        ) : /* @__PURE__ */ n("circle", { className: a, cx: o.endX, cy: o.endY, r: Te }) : null
      ]
    }
  );
}
function pr({
  leading: e,
  label: t,
  state: a = !1,
  caption: i,
  value: r,
  trailing: s,
  draft: d,
  tone: o = "start",
  onPress: c,
  disabled: l = !1,
  className: u,
  id: m,
  style: f,
  ref: h,
  ...b
}) {
  const { isPressed: v, pressProps: k } = A({ onPress: () => c?.(), disabled: l }), { hidden: y } = O(), x = d !== void 0, w = r != null && typeof r != "string", H = r === void 0 ? C().missingGlyph : w ? r : y && x ? C().hiddenGlyph : r, B = [
    "mds-tile",
    `mds-tile--${o}`,
    v ? "mds-tile--pressed" : "",
    l ? "mds-tile--disabled" : "",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "button",
    {
      ref: h,
      id: m,
      style: f,
      type: "button",
      className: B,
      disabled: l,
      "data-ds-exempt": l ? void 0 : "",
      ...k,
      ...b,
      children: [
        /* @__PURE__ */ p("span", { className: "mds-tile-header", children: [
          e ? /* @__PURE__ */ n("span", { className: "mds-tile-header-icon", "aria-hidden": "true", children: e }) : null,
          /* @__PURE__ */ n("span", { className: "mds-tile-header-label mds-type-label", children: t }),
          a ? /* @__PURE__ */ n("span", { className: "mds-tile-dot", role: "img", "aria-label": i ?? "" }) : null
        ] }),
        /* @__PURE__ */ p("span", { className: "mds-tile-content", children: [
          d ? /* @__PURE__ */ n("span", { className: "mds-tile-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ n(
            je,
            {
              values: d,
              hidden: y,
              lineClassName: "mds-tile-sparkline-line",
              dotClassName: "mds-tile-sparkline-dot"
            }
          ) }) : null,
          /* @__PURE__ */ n("span", { className: "mds-tile-value", children: w ? H : /* @__PURE__ */ n("bdi", { dir: "ltr", children: H }) }),
          s ? /* @__PURE__ */ n("span", { className: "mds-tile-line mds-type-caption", children: s }) : null
        ] })
      ]
    }
  );
}
const fr = [
  "default",
  "withDot",
  "withSparkline",
  "pressed",
  "focused",
  "disabled"
];
function xa(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function ka({ value: e }) {
  const { hidden: t } = O(), i = e === void 0 ? C().missingGlyph : t ? C().hiddenGlyph : null, { whole: r, cents: s } = xa(e ?? C().missingGlyph), o = (e ?? "").length > 9 ? "mds-hero-value--lg mds-number-lg" : "mds-hero-value--hero mds-type-display-hero";
  return /* @__PURE__ */ n("span", { className: `mds-hero-value ${o}`, children: /* @__PURE__ */ n("bdi", { dir: "ltr", children: i !== null ? /* @__PURE__ */ n("span", { className: "mds-hero-value-glyph", children: i }) : /* @__PURE__ */ p(Y, { children: [
    /* @__PURE__ */ n("span", { className: "mds-hero-value-whole", children: r }),
    s ? /* @__PURE__ */ n("span", { className: "mds-hero-value-cents", children: s }) : null
  ] }) }) });
}
function va({ values: e }) {
  const { hidden: t } = O();
  return /* @__PURE__ */ n("span", { className: "mds-hero-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ n(
    je,
    {
      values: e,
      hidden: t,
      height: D.size["hero-sparkline-height"],
      fullWidth: !0,
      lineClassName: "mds-hero-sparkline-line",
      dotClassName: "mds-hero-sparkline-dot"
    }
  ) });
}
function gr({
  label: e,
  value: t,
  trailing: a,
  direction: i,
  debt: r,
  draft: s,
  onDismiss: d,
  onChange: o,
  className: c,
  id: l,
  style: u,
  ref: m,
  ...f
}) {
  const { isPressed: h, pressProps: b } = A({ onPress: () => d?.() }), { hidden: v } = O(), k = v && t !== void 0, y = ["mds-hero-surface", c].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("section", { ref: m, id: l, style: u, className: y, ...f, children: [
    /* @__PURE__ */ p("header", { className: "mds-hero-header", children: [
      /* @__PURE__ */ n("span", { className: "mds-hero-label", children: e }),
      /* @__PURE__ */ n(Rn, { className: "mds-hero-toggle", onChange: o })
    ] }),
    /* @__PURE__ */ p("p", { className: "mds-hero-amount", children: [
      /* @__PURE__ */ p("span", { className: "mds-hero-visual", "aria-hidden": k || void 0, children: [
        /* @__PURE__ */ n(ka, { value: t }),
        a && t !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-hero-unit", children: a }) : null
      ] }, k ? "hidden" : "shown"),
      k ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: C().hidden }) : null
    ] }),
    i || r ? (
      /* 1.7 ت2.3: ONE line — the diff, then « · », then the source link
          at the line's end (they used to be two stacked lines with the
          source under the sparkline). */
      /* @__PURE__ */ p("p", { className: "mds-hero-line", children: [
        i ? /* @__PURE__ */ n("span", { className: "mds-hero-diff", children: i }) : null,
        i && r ? /* @__PURE__ */ n("span", { className: "mds-hero-line-sep", "aria-hidden": "true", children: "·" }) : null,
        r ? /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: ["mds-hero-source", h ? "mds-hero-source--pressed" : ""].filter(Boolean).join(" "),
            "data-ds-exempt": "",
            ...b,
            children: r
          }
        ) : null
      ] })
    ) : null,
    s ? /* @__PURE__ */ n(va, { values: s }) : null
  ] });
}
const br = [
  "default",
  "withCents",
  "missing",
  "longNumber",
  "noDiff",
  "withSparkline"
];
function Ae(e) {
  return e != null && typeof e != "string";
}
function xr({
  leading: e,
  tone: t,
  label: a,
  caption: i,
  value: r,
  trailing: s,
  onPress: d,
  landed: o = !1,
  disabled: c = !1,
  className: l,
  id: u,
  style: m,
  ref: f,
  ...h
}) {
  const { isPressed: b, pressProps: v } = A({ onPress: () => d?.(), disabled: c }), k = d !== void 0, y = [
    "mds-object-row",
    Ae(e) ? "mds-object-row--icon" : "",
    b ? "mds-object-row--pressed" : "",
    o ? "mds-object-row--landed" : "",
    c ? "mds-object-row--disabled" : "",
    k ? "" : "mds-object-row--passive",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    k ? "button" : "div",
    {
      ref: f,
      id: u,
      style: m,
      type: k ? "button" : void 0,
      className: y,
      disabled: k ? c : void 0,
      ...k ? v : {},
      ...h,
      children: [
        Ae(e) ? (
          /* ت4 (1.7): a NON-entity row (an action, a setting) starts with its
             icon 20 in text-secondary — no 44 mark box, a row-plain height. */
          /* @__PURE__ */ n("span", { className: "mds-object-row-icon", "aria-hidden": "true", children: e })
        ) : /* @__PURE__ */ n(fe, { size: "md", tone: t, value: typeof e == "string" ? e : a }),
        /* @__PURE__ */ p("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-object-row-title mds-type-body-strong", children: a }),
          i ? /* @__PURE__ */ n("span", { className: "mds-object-row-caption mds-type-caption", children: i }) : null
        ] }),
        r !== void 0 || s ? /* @__PURE__ */ p("span", { className: "mds-object-row-end", children: [
          r !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-object-row-value mds-type-amount-row", children: typeof r == "string" ? /* @__PURE__ */ n("bdi", { dir: "ltr", children: r }) : (
            /* A Money node renders itself (its own LTR isolation, sign,
               unit and hidden-amounts behaviour) — never re-wrapped. */
            r
          ) }) : null,
          s ? /* @__PURE__ */ n("span", { className: "mds-object-row-time mds-type-caption", children: s }) : null
        ] }) : null
      ]
    }
  );
}
const kr = [
  "default",
  "oneLine",
  "withBadge",
  "pressed",
  "landed",
  "focused",
  "disabled"
];
function vr({
  leading: e,
  tone: t,
  label: a,
  caption: i,
  value: r,
  state: s,
  href: d,
  children: o,
  onPress: c,
  disabled: l = !1,
  className: u,
  id: m,
  style: f,
  ref: h,
  ...b
}) {
  const { isPressed: v, pressProps: k } = A({ onPress: () => c?.(), disabled: l }), y = c !== void 0 || d !== void 0, x = o != null, w = d ? "a" : y ? "button" : "div", H = [
    "mds-object-card",
    v ? "mds-object-card--pressed" : "",
    l ? "mds-object-card--disabled" : "",
    x ? "mds-object-card--with-action" : "",
    y ? "" : "mds-object-card--passive",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("div", { ref: h, id: m, style: f, className: ["mds-object-card-wrap", l ? "mds-object-card-wrap--disabled" : "", u].filter(Boolean).join(" "), ...b, children: [
    /* @__PURE__ */ p(
      w,
      {
        className: H,
        href: d,
        type: w === "button" ? "button" : void 0,
        disabled: w === "button" ? l : void 0,
        ...y ? k : {},
        children: [
          /* @__PURE__ */ p("span", { className: "mds-object-card-mark", children: [
            /* @__PURE__ */ n(fe, { size: "lg", tone: t, value: typeof e == "string" ? e : a, children: typeof e == "string" ? void 0 : e }),
            s ? /* @__PURE__ */ n("span", { className: "mds-object-card-state", children: s }) : null
          ] }),
          /* @__PURE__ */ p("span", { className: "mds-object-card-body", children: [
            /* @__PURE__ */ n("span", { className: "mds-object-card-title", children: a }),
            i ? /* @__PURE__ */ n("span", { className: "mds-object-card-caption mds-type-caption", children: i }) : null,
            r !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-object-card-value mds-type-amount-row", children: typeof r == "string" ? /* @__PURE__ */ n("bdi", { dir: "ltr", children: r }) : (
              /* A Money node renders itself (its own isolation, sign,
                 unit and hidden-amounts behaviour) — never re-wrapped. */
              r
            ) }) : null
          ] })
        ]
      }
    ),
    x ? /* @__PURE__ */ n("span", { className: "mds-object-card-action", children: o }) : null
  ] });
}
const yr = [
  "default",
  "withBadge",
  "withButton",
  "pressed",
  "focused",
  "disabled"
];
function ya(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function wa({
  label: e,
  size: t = "lg",
  value: a,
  trailing: i,
  direction: r,
  debt: s,
  onDismiss: d,
  loading: o = !1,
  className: c,
  id: l,
  style: u,
  ref: m,
  ...f
}) {
  const { isPressed: h, pressProps: b } = A({ onPress: () => d?.() }), { hidden: v } = O(), k = v && a !== void 0 && a !== null && !o, { whole: y, cents: x } = ya(k ? "—" : a ?? "—"), w = ["mds-metric", c].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("div", { ref: m, id: l, style: u, className: w, ...f, children: [
    /* @__PURE__ */ n("span", { className: "mds-metric-label mds-type-label", children: e }),
    /* @__PURE__ */ n("p", { className: "mds-metric-amount", children: o ? /* @__PURE__ */ n("span", { className: "mds-metric-skeleton", "aria-busy": "true" }) : k ? /* @__PURE__ */ p(Y, { children: [
      /* @__PURE__ */ p(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero mds-metric-value--hidden",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          "data-ds-check": "amount-hidden",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ n("bdi", { dir: "ltr", children: /* @__PURE__ */ n("span", { className: "mds-metric-value-whole", children: C().hiddenGlyph }) }),
            i ? /* @__PURE__ */ n("span", { className: "mds-metric-unit", children: i }) : null
          ]
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: C().hidden })
    ] }) : /* @__PURE__ */ p(Y, { children: [
      /* @__PURE__ */ n(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          children: /* @__PURE__ */ p("bdi", { dir: "ltr", children: [
            /* @__PURE__ */ n("span", { className: "mds-metric-value-whole", children: y }),
            x ? /* @__PURE__ */ n("span", { className: "mds-metric-value-cents", children: x }) : null
          ] })
        }
      ),
      i ? /* @__PURE__ */ n("span", { className: "mds-metric-unit", children: i }) : null
    ] }) }),
    r && !o ? /* @__PURE__ */ n("p", { className: "mds-metric-diff", children: r }) : null,
    s && !o ? /* @__PURE__ */ n(
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
const wr = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function Ar({ size: e, ...t }) {
  return /* @__PURE__ */ n(wa, { ...t, size: "sm", className: ["mds-metric-small", t.className].filter(Boolean).join(" ") });
}
const Nr = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function Hr({
  label: e,
  caption: t,
  value: a,
  onPress: i,
  onDismiss: r,
  className: s,
  id: d,
  style: o,
  ref: c,
  ...l
}) {
  const u = S(null);
  return I(() => {
    u.current?.focus();
  }, []), /* @__PURE__ */ n(
    "div",
    {
      ref: c,
      id: d,
      style: o,
      className: ["mds-confirm-sheet", s].filter(Boolean).join(" "),
      ...l,
      children: /* @__PURE__ */ p(
        pe,
        {
          label: e,
          onDismiss: r,
          className: "mds-confirm-sheet__sheet",
          role: "alertdialog",
          "data-ds-check": "confirm-sheet",
          children: [
            /* @__PURE__ */ p("div", { className: "mds-confirm-sheet-head", children: [
              /* @__PURE__ */ n("span", { className: "mds-confirm-sheet-icon", children: /* @__PURE__ */ n(zt, {}) }),
              /* @__PURE__ */ n("h2", { className: "mds-confirm-sheet-title mds-type-title-section", children: e }),
              /* @__PURE__ */ n("p", { className: "mds-confirm-sheet-sentence", children: t })
            ] }),
            /* @__PURE__ */ p("div", { className: "mds-confirm-sheet-actions", children: [
              /* @__PURE__ */ n(
                W,
                {
                  ref: u,
                  variant: "secondary",
                  className: "mds-confirm-sheet-back",
                  onPress: r,
                  children: g("button.back")
                }
              ),
              /* @__PURE__ */ n(W, { variant: "danger", className: "mds-confirm-sheet-confirm", onPress: i, children: a })
            ] })
          ]
        }
      )
    }
  );
}
const Br = [
  "default",
  "focused",
  "pressed"
];
function Sr({
  selected: e = !1,
  onPress: t,
  onLongPress: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...o
}) {
  const { isPressed: c, pressProps: l } = A({ onPress: t, onLongPress: a }), u = g(e ? "sr.askUnread" : "sr.ask"), m = ["mds-ask-button", c ? "mds-ask-button--pressed" : "", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "button",
    {
      ref: d,
      id: r,
      style: s,
      type: "button",
      className: m,
      "aria-label": u,
      ...o,
      ...l,
      children: [
        /* @__PURE__ */ n(it, { size: 28 }),
        e ? /* @__PURE__ */ n("span", { className: "mds-ask-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const Pr = [
  "default",
  "pressed",
  "focused",
  "unreadDot",
  "longPressRecording"
];
function Mr({
  value: e = 0,
  label: t,
  onPress: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...o
}) {
  const { isPressed: c, pressProps: l } = A({ onPress: a }), u = Oe(e, De.unread), m = t ?? (e > 0 ? g("sr.notificationsCount", { counted: u }) : g("sr.notifications")), f = [
    "mds-notifications-button",
    c ? "mds-notifications-button--pressed" : "",
    e > 0 ? "mds-notifications-button--unread" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "button",
    {
      ref: d,
      id: r,
      style: s,
      type: "button",
      className: f,
      "aria-label": m,
      ...o,
      ...l,
      children: [
        /* @__PURE__ */ n(ut, {}),
        e > 0 ? /* @__PURE__ */ n("span", { className: "mds-notifications-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const Zr = [
  "default",
  "pressed",
  "focused",
  "unreadDot"
];
function Cr({
  label: e,
  caption: t,
  locked: a = !1,
  onPress: i,
  className: r,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const { isPressed: l, pressProps: u } = A({ onPress: i }), m = [
    "mds-project-switcher",
    l ? "mds-project-switcher--pressed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "button",
    {
      ref: o,
      id: s,
      style: d,
      type: "button",
      className: m,
      ...c,
      ...u,
      children: [
        /* @__PURE__ */ n(fe, { size: "sm", variant: "canvas", value: e }),
        /* @__PURE__ */ p("span", { className: "mds-project-switcher-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-project-switcher-name mds-type-body-strong", children: e }),
          t ? /* @__PURE__ */ n("span", { className: "mds-project-switcher-role", children: t }) : null
        ] }),
        a ? null : /* @__PURE__ */ n(vt, { className: "mds-project-switcher-caret" })
      ]
    }
  );
}
const Tr = [
  "default",
  "pressed",
  "focused",
  "withCaret",
  "singleRoleNoCaret"
];
function jr({
  leading: e,
  trailing: t,
  caption: a = !1,
  label: i,
  className: r,
  id: s,
  style: d,
  ref: o,
  children: c,
  ...l
}) {
  const u = [
    "mds-context-bar",
    a ? "mds-context-bar--scrolled" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "div",
    {
      ref: o,
      id: s,
      style: d,
      className: u,
      role: "banner",
      "aria-label": i,
      ...l,
      children: [
        /* @__PURE__ */ n("div", { className: "mds-context-bar-start", children: e ?? c }),
        /* @__PURE__ */ n("div", { className: "mds-context-bar-end", children: t })
      ]
    }
  );
}
const Vr = [
  "default",
  "mainScreenSwitcher",
  "subScreenBack",
  "scrolledHairline",
  "notScrolled"
];
function Ir({
  label: e,
  selected: t = !1,
  leading: a,
  onPress: i,
  className: r,
  ref: s,
  ...d
}) {
  const { isPressed: o, pressProps: c } = A({ onPress: i }), l = [
    "mds-tab",
    t ? "mds-tab--active" : "",
    o ? "mds-tab--pressed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
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
        a ? /* @__PURE__ */ n("span", { className: "mds-tab-icon", "aria-hidden": "true", children: a }) : null,
        /* @__PURE__ */ n("span", { className: "mds-tab-label", children: e })
      ]
    }
  );
}
function $r({
  children: e,
  value: t,
  onChange: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...o
}) {
  const c = Le.toArray(e), l = c.some(
    (m) => m && typeof m == "object" && "props" in m && m.props.selected !== void 0
  ), u = t ?? 0;
  return /* @__PURE__ */ n(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: ["mds-tab-bar", i].filter(Boolean).join(" "),
      role: "tablist",
      ...o,
      children: c.map((m, f) => {
        if (m && typeof m == "object" && "props" in m) {
          const h = m.props, b = l ? h.selected === !0 : f === u;
          return {
            ...m,
            props: { ...h, selected: b, onPress: () => {
              h.onPress?.(), a?.(f);
            } }
          };
        }
        return m;
      })
    }
  );
}
const Fr = [
  "default",
  "activeFill",
  "pressed",
  "focused",
  "fiveTabs",
  "twoTabs"
];
function Lr({
  label: e,
  leading: t,
  caption: a = !1,
  trailing: i,
  className: r,
  id: s,
  style: d,
  ref: o,
  ...c
}) {
  const l = [
    "mds-page-header",
    a && t ? "mds-page-header--collapsed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p("header", { ref: o, id: s, style: d, className: l, ...c, children: [
    t,
    /* @__PURE__ */ n("h1", { className: "mds-page-header-title", children: e }),
    i ? /* @__PURE__ */ n("div", { className: "mds-page-header-end", children: i }) : null
  ] });
}
const Er = [
  "default",
  "mainScreen",
  "subScreenBack",
  "collapsedOnScroll",
  "withTrailing"
], Aa = {
  draft: g("saveState.draft"),
  sending: g("saveState.sending"),
  saved: g("saveState.saved"),
  failed: g("saveState.failed")
};
function Dr({
  saveState: e,
  className: t,
  id: a,
  style: i,
  ref: r,
  ...s
}) {
  const d = Pe(e === "sending"), o = [
    "mds-save-state",
    `mds-save-state--${e}`,
    e === "sending" && !d ? "mds-save-state--pending-delay" : "",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ p(
    "span",
    {
      ref: r,
      id: a,
      style: i,
      className: o,
      role: e === "failed" ? "alert" : void 0,
      "aria-busy": e === "sending" || void 0,
      ...s,
      children: [
        e === "draft" ? /* @__PURE__ */ n(Lt, { size: 14 }) : e === "saved" ? /* @__PURE__ */ n("span", { className: "mds-save-state-icon", children: /* @__PURE__ */ n(Me, { size: 14 }) }) : e === "failed" ? /* @__PURE__ */ n(me, { size: 14 }) : null,
        /* @__PURE__ */ n("span", { className: "mds-save-state-text", children: Aa[e] }),
        e === "saved" ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: g("sr.saveSaved") }) : null,
        e === "failed" ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: g("sr.saveFailed") }) : null
      ]
    }
  );
}
const Rr = [
  "draft",
  "sending",
  "saved",
  "failed"
];
function Or({
  label: e,
  trailing: t,
  onDismiss: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...o
}) {
  const c = S(null), l = S(0), u = S(0), m = t ? 5e3 : 3e3;
  I(() => (l.current = m, u.current = Date.now(), c.current = window.setTimeout(() => a?.(), m), () => {
    c.current && window.clearTimeout(c.current), c.current = null;
  }), [e, m]);
  const f = () => {
    c.current && (window.clearTimeout(c.current), c.current = null, l.current -= Date.now() - u.current);
  }, h = () => {
    c.current || (u.current = Date.now(), c.current = window.setTimeout(() => a?.(), Math.max(0, l.current)));
  };
  return /* @__PURE__ */ p(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: ["mds-toast", i].filter(Boolean).join(" "),
      role: "status",
      onFocus: f,
      onBlur: h,
      ...o,
      children: [
        /* @__PURE__ */ n("span", { className: "mds-toast-text", children: e }),
        t ? /* @__PURE__ */ n("span", { className: "mds-toast-action", children: t }) : null
      ]
    }
  );
}
const Yr = ["default", "withAction", "focusedPaused"], Na = {
  offline: Rt,
  locked: Yt,
  info: _t
};
function qr({
  tone: e,
  label: t,
  trailing: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...o
}) {
  const c = Na[e];
  return /* @__PURE__ */ p(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: ["mds-inline-banner", `mds-inline-banner--${e}`, i].filter(Boolean).join(" "),
      role: "status",
      ...o,
      children: [
        /* @__PURE__ */ n(c, {}),
        /* @__PURE__ */ n("span", { className: "mds-inline-banner-text", children: t }),
        a ? /* @__PURE__ */ n("span", { className: "mds-inline-banner-action", children: a }) : null
      ]
    }
  );
}
const _r = ["offline", "locked", "info", "withAction"];
function Gr({
  label: e,
  trailing: t,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  return /* @__PURE__ */ p(
    "div",
    {
      ref: s,
      id: i,
      style: r,
      className: ["mds-empty-state", a].filter(Boolean).join(" "),
      ...d,
      children: [
        /* @__PURE__ */ n("p", { className: "mds-empty-state-sentence", children: e }),
        t ? /* @__PURE__ */ n("div", { className: "mds-empty-state-action", children: t }) : null
      ]
    }
  );
}
const Qr = ["default", "withAction"];
function Kr({
  variant: e,
  className: t,
  id: a,
  style: i,
  ref: r,
  ...s
}) {
  return /* @__PURE__ */ n(
    "span",
    {
      ref: r,
      id: a,
      style: i,
      "aria-hidden": "true",
      className: ["mds-skeleton", `mds-skeleton--${e}`, t].filter(Boolean).join(" "),
      ...s
    }
  );
}
const Wr = ["body", "caption", "hero", "mark"];
export {
  Ce as ActionBar,
  Qi as ActionBarStates,
  Fi as AmountField,
  Li as AmountFieldStates,
  Ei as AmountKeypad,
  Di as AmountKeypadStates,
  Ca as AmountVisibilityProvider,
  Rn as AmountVisibilityToggle,
  Bi as AmountVisibilityToggleStates,
  ft as AmountsHiddenIcon,
  ht as AmountsShownIcon,
  ei as AppointmentIcon,
  Sr as AskButton,
  Pr as AskButtonStates,
  it as AskSymbolIcon,
  Ra as BackIcon,
  hn as BackspaceIcon,
  W as Button,
  Gi as ButtonStates,
  kn as CalendarIcon,
  ii as CameraIcon,
  fi as ChartIcon,
  Si as Checkbox,
  Pi as CheckboxStates,
  ue as ClearIcon,
  yn as ClockIcon,
  wt as CloseIcon,
  Hr as ConfirmSheet,
  Br as ConfirmSheetStates,
  jr as ContextBar,
  Vr as ContextBarStates,
  zt as DangerIcon,
  qi as DateQuickChips,
  _i as DateQuickChipsStates,
  Xa as DebtIcon,
  Ya as DeltaDownIcon,
  Oa as DeltaUpIcon,
  Lt as DraftIcon,
  Ji as DurationPicker,
  er as DurationPickerStates,
  Gr as EmptyState,
  Qr as EmptyStateStates,
  Kt as EntityApprovedIcon,
  fe as EntityMark,
  ar as EntityMarkStates,
  Xt as EntityPendingIcon,
  vt as ExpandIcon,
  Pt as FieldErrorIcon,
  xi as FileIcon,
  sr as FilterChips,
  or as FilterChipsStates,
  xt as ForwardIcon,
  Qa as FundBankIcon,
  Ga as FundCashIcon,
  Ka as FundWalletIcon,
  gr as HeroSurface,
  br as HeroSurfaceStates,
  he as IconButton,
  Ki as IconButtonStates,
  _t as InfoIcon,
  qr as InlineBanner,
  _r as InlineBannerStates,
  za as JobFailedIcon,
  Xe as LONG_PRESS_MS,
  ja as LayersProvider,
  ki as LinkIcon,
  Yt as LockedIcon,
  mi as MapPinIcon,
  wa as Metric,
  Ar as MetricSmall,
  Nr as MetricSmallStates,
  wr as MetricStates,
  ri as MicIcon,
  bn as MinusIcon,
  Ni as Money,
  Hi as MoneyStates,
  _a as MoreIcon,
  di as MovementInIcon,
  li as MovementOutIcon,
  Ri as MovementTypeControl,
  Oi as MovementTypeControlStates,
  Ea as NavDeliveryIcon,
  Fa as NavFinanceIcon,
  Da as NavMarketIcon,
  La as NavOrdersIcon,
  $a as NavTodayIcon,
  vi as NoteIcon,
  Mr as NotificationsButton,
  Zr as NotificationsButtonStates,
  ut as NotificationsIcon,
  vr as ObjectCard,
  yr as ObjectCardStates,
  xr as ObjectRow,
  kr as ObjectRowStates,
  Rt as OfflineIcon,
  Ja as OrderIcon,
  Lr as PageHeader,
  Er as PageHeaderStates,
  wi as PauseIcon,
  ci as PhoneIcon,
  fn as PlusIcon,
  ti as PriceTierIcon,
  Cr as ProjectSwitcher,
  Tr as ProjectSwitcherStates,
  Wn as QuantityStepper,
  Yi as QuantityStepperStates,
  Ua as QuoteIcon,
  Ai as RTL_FLIP_ICONS,
  Mi as Radio,
  Zi as RadioStates,
  ai as ReportIcon,
  qa as RetryIcon,
  ni as ReviewIcon,
  Dr as SaveState,
  Rr as SaveStateStates,
  ji as SearchField,
  Vi as SearchFieldStates,
  Ht as SearchIcon,
  mr as Section,
  hr as SectionStates,
  Jn as SegmentedControl,
  Wi as SegmentedControlStates,
  ce as SelectedIcon,
  hi as SendIcon,
  pe as Sheet,
  Xi as SheetStates,
  Kr as Skeleton,
  Wr as SkeletonStates,
  yi as SlidersIcon,
  tr as StatusBadge,
  nr as StatusBadgeStates,
  si as StopIcon,
  dr as Surface,
  lr as SurfaceStates,
  $r as TabBar,
  Fr as TabBarStates,
  Ir as TabBarTab,
  pi as TableIcon,
  Ii as TextArea,
  $i as TextAreaStates,
  ir as TextField,
  rr as TextFieldStates,
  pr as Tile,
  fr as TileStates,
  Ui as TimePicker,
  zi as TimePickerStates,
  Or as Toast,
  Yr as ToastStates,
  Ci as Toggle,
  Ti as ToggleStates,
  Me as ToneDoneIcon,
  $t as ToneInfoIcon,
  me as ToneProblemIcon,
  jt as ToneWaitingIcon,
  Wa as TransferIcon,
  oi as TrashIcon,
  cr as Well,
  ur as WellStates,
  ui as WhatsappIcon,
  gi as ZoomInIcon,
  bi as ZoomOutIcon,
  Ee as ar,
  re as formatDuration,
  ie as formatMoney,
  Za as formatTime12,
  Ze as formatTimeValue,
  C as getMoneyTexts,
  He as getToken,
  _n as normalizeAmount,
  Ma as overriddenText,
  Sa as overrideTexts,
  Oe as pluralAr,
  De as pluralNouns,
  Pa as resetTextOverrides,
  g as t,
  D as tokens,
  O as useAmountVisibility,
  Ta as useCountUp,
  Ia as useOpenSheetCount,
  Pe as usePendingDelay,
  A as usePress,
  Va as useSheetLayer,
  Je as useVisualViewport
};
