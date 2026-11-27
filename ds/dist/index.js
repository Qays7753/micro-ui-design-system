import { jsx as n, jsxs as h, Fragment as $ } from "react/jsx-runtime";
import { useMemo as z, useContext as J, createContext as ue, useState as j, useRef as S, useCallback as C, useEffect as I, useReducer as Ae, useId as ee, useLayoutEffect as Ne, Children as He } from "react";
const W = {
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
function Be(e) {
  let t = W;
  for (const a of e.split("."))
    t = t[a];
  return t;
}
const Se = {
  // ---------------------------------------------------------------- B1 finance
  "fund.lastMovement": { kind: "badge", text: "آخر حركة:" },
  "fund.cashDrawer": { kind: "badge", text: "درج الكاش" },
  "fund.negativeBalance": { kind: "badge", text: "رصيد سالب" },
  "debt.forYou": { kind: "badge", text: "لك" },
  "debt.againstYou": { kind: "badge", text: "عليك" },
  "debt.dueOn": { kind: "help", text: "يستحق {date}" },
  "debt.overdue": { kind: "badge", text: "متأخر" },
  "debt.settled": { kind: "badge", text: "سُدّد" },
  "payment.paid": { kind: "badge", text: "دُفع" },
  "payment.remaining": { kind: "badge", text: "بقي" },
  "sr.listSeparator": { kind: "screen-reader", text: "، " },
  "sr.movementRowOut": { kind: "screen-reader", text: "خارج" },
  "sr.movementRowIn": { kind: "screen-reader", text: "داخل" },
  "sr.transferFrom": { kind: "screen-reader", text: "تحويل من {from} إلى {to}" },
  "sr.fundHasDraft": { kind: "screen-reader", text: "فيه مسودة" },
  "sr.debtProgress": { kind: "screen-reader", text: "دُفع {paid} من {total} دينار" },
  "lab.h.movementRow": { kind: "title", text: "صف حركة مالية" },
  "lab.h.transferRow": { kind: "title", text: "صف تحويل صندوقين" },
  "lab.h.fundCard": { kind: "title", text: "بطاقة صندوق ورصيده" },
  "lab.h.debtCard": { kind: "title", text: "بطاقة دين ودفعاته" },
  "lab.h.debtSummary": { kind: "title", text: "ملخص الديون" },
  "lab.h.paymentProgress": { kind: "title", text: "شريط تقدم السداد" },
  "lab.h.financeCompose": { kind: "title", text: "تركيب شاشة المالية" },
  // -------------------------------------------------- B2 orders & appointments
  "order.delivery": { kind: "badge", text: "التسليم" },
  "order.today": { kind: "badge", text: "اليوم" },
  "order.tomorrow": { kind: "badge", text: "غداً" },
  "order.yesterday": { kind: "badge", text: "أمس" },
  "agenda.noTime": { kind: "title", text: "بلا وقت" },
  "agenda.emptyDay": { kind: "empty", text: "مواعيد هذا اليوم تظهر هنا." },
  "agenda.emptyAll": { kind: "empty", text: "لا عناصر في هذه الفترة." },
  "slot.morning": { kind: "title", text: "صباحاً" },
  "slot.evening": { kind: "title", text: "مساءً" },
  "slot.empty": { kind: "empty", text: "لا أوقات متاحة في هذا اليوم." },
  "minute.one": { kind: "badge", text: "دقيقة" },
  "minute.few": { kind: "badge", text: "دقائق" },
  "hour.one": { kind: "badge", text: "ساعة" },
  "hour.two": { kind: "badge", text: "ساعتان" },
  "hour.few": { kind: "badge", text: "ساعات" },
  "sr.weekStripToday": { kind: "screen-reader", text: "اليوم" },
  "sr.weekStripItems": { kind: "screen-reader", text: "{counted}" },
  "sr.slotUnavailable": { kind: "screen-reader", text: "غير متاح" },
  "sr.timelineNow": { kind: "screen-reader", text: "الآن" },
  "lab.h.orderCard": { kind: "title", text: "بطاقة طلب" },
  "lab.h.weekStrip": { kind: "title", text: "شريط أيام الأسبوع" },
  "lab.h.dayTimeline": { kind: "title", text: "جدول اليوم بالساعات" },
  "lab.h.agendaList": { kind: "title", text: "قائمة عناصر بالأيام" },
  "lab.h.slotPicker": { kind: "title", text: "أوقات متاحة للاختيار" },
  "lab.h.ordersCompose": { kind: "title", text: "تركيب شاشة الطلبات" },
  // ---------------------------------------------------------------- B3 delivery
  "delivery.to": { kind: "badge", text: "إلى {area}" },
  "delivery.from": { kind: "help", text: "من {area} · {desc}" },
  "delivery.reviewQuotes": { kind: "button", text: "راجع العروض" },
  "quote.expiry": { kind: "help", text: "ينتهي {time}" },
  "quote.expiringSoon": { kind: "badge", text: "ينتهي قريباً" },
  "quote.acceptOutcome": { kind: "help", text: "بالقبول يبدأ السائق المهمة." },
  "quote.rejected": { kind: "badge", text: "مرفوض" },
  "quote.superseded": { kind: "badge", text: "مستبدل" },
  "quote.expired": { kind: "badge", text: "انتهى" },
  "issue.title": { kind: "title", text: "تعذّر التسليم" },
  "issue.reason": { kind: "badge", text: "السبب" },
  "issue.proposed": { kind: "badge", text: "الإجراء المقترح" },
  "issue.awaitingOwner": { kind: "badge", text: "بانتظار موافقة المالك" },
  "issue.agreedAt": { kind: "help", text: "وافقت · {time}" },
  "issue.rejectedAt": { kind: "help", text: "رفضت · {time}" },
  "contact.call": { kind: "button", text: "اتصل" },
  "contact.whatsapp": { kind: "button", text: "واتساب" },
  "contact.marketNote": { kind: "help", text: "الشراء والتواصل خارج Micro." },
  "evidence.title": { kind: "title", text: "إثبات التسليم" },
  "evidence.takePhoto": { kind: "button", text: "التقط صورة" },
  "evidence.codeLabel": { kind: "help", text: "الرمز من المستلم" },
  "evidence.ownerSentence": { kind: "help", text: "المالك يؤكد التسليم." },
  "evidence.confirm": { kind: "button", text: "أكّد التسليم" },
  "evidence.codeError": { kind: "error", text: "الرمز غير صحيح. اسأل المستلم مرة أخرى." },
  "evidence.entered": { kind: "help", text: "أُدخل الرمز ✓" },
  "location.openMaps": { kind: "button", text: "افتح في الخرائط" },
  "job.priceLabel": { kind: "badge", text: "سعرك" },
  "job.sendQuote": { kind: "button", text: "أرسل العرض" },
  "job.cannotDeliver": { kind: "button", text: "لم أستطع التسليم" },
  "job.sendToOwner": { kind: "button", text: "أرسل للمالك" },
  "job.slideDelivered": { kind: "button", text: "اسحب: تمّ التسليم" },
  "driver.pending": { kind: "badge", text: "بانتظار الاعتماد" },
  "driver.approved": { kind: "badge", text: "معتمد" },
  "driver.rejected": { kind: "badge", text: "مرفوض" },
  "driver.pendingSentence": { kind: "help", text: "طلبك قيد المراجعة. ستصلك الطلبات بعد الاعتماد." },
  "sr.contactCall": { kind: "screen-reader", text: "اتصل بـ{name}" },
  "sr.contactWhatsapp": { kind: "screen-reader", text: "واتساب {name}، يفتح تطبيقاً آخر" },
  "sr.openMaps": { kind: "screen-reader", text: "افتح العنوان في الخرائط، يفتح تطبيقاً آخر" },
  "sr.jobTrack": { kind: "screen-reader", text: "مراحل التوصيل: المرحلة {current} من {total}" },
  "sr.evidenceNotTaken": { kind: "screen-reader", text: "لم تُلتقط بعد" },
  "sr.evidencePhoto": { kind: "screen-reader", text: "صورة" },
  "lab.h.deliveryRequestCard": { kind: "title", text: "بطاقة طلب توصيل" },
  "lab.h.quoteCard": { kind: "title", text: "بطاقة عرض سعر" },
  "lab.h.jobTrack": { kind: "title", text: "مسار مراحل التوصيل" },
  "lab.h.issueProposalCard": { kind: "title", text: "مقترح تعذّر التسليم" },
  "lab.h.contactBar": { kind: "title", text: "اتصال وواتساب" },
  "lab.h.evidenceSlot": { kind: "title", text: "إثبات التسليم" },
  "lab.h.locationSlot": { kind: "title", text: "عنوانا من وإلى" },
  "lab.h.driverJobCard": { kind: "title", text: "مهمة السائق الحالية" },
  "lab.h.driverApprovalStatus": { kind: "title", text: "حالة اعتماد السائق" },
  "lab.h.deliveryCompose": { kind: "title", text: "تركيب شاشة التوصيل" },
  // ------------------------------------------------------------------ B4 market
  "listing.perUnit": { kind: "badge", text: "/ {unit}" },
  "listing.from": { kind: "badge", text: "من" },
  "listing.unavailable": { kind: "badge", text: "غير متوفر مؤقتاً" },
  "listing.byRequest": { kind: "badge", text: "بالطلب" },
  "tier.from": { kind: "badge", text: "من" },
  "tier.to": { kind: "badge", text: "إلى" },
  "tier.pricePerUnit": { kind: "badge", text: "السعر للعبوة" },
  "tier.andAbove": { kind: "badge", text: "فما فوق" },
  "gallery.imageOf": { kind: "screen-reader", text: "صورة {current} من {total}" },
  "gallery.close": { kind: "screen-reader", text: "أغلق الصور" },
  "gallery.zoomIn": { kind: "screen-reader", text: "كبّر" },
  "gallery.zoomOut": { kind: "screen-reader", text: "صغّر" },
  "gallery.loadFailed": { kind: "error", text: "لم تُحمَّل الصورة." },
  "report.title": { kind: "title", text: "أبلغ عن العرض" },
  "report.details": { kind: "badge", text: "تفاصيل" },
  "report.detailsOptional": { kind: "help", text: "اختياري" },
  "report.send": { kind: "button", text: "أرسل البلاغ" },
  "report.chooseReason": { kind: "error", text: "اختر سبب البلاغ" },
  "report.sent": { kind: "success", text: "أُرسل البلاغ" },
  "editor.photos": { kind: "badge", text: "الصور" },
  "editor.listingName": { kind: "badge", text: "اسم العرض" },
  "editor.unit": { kind: "badge", text: "العبوة" },
  "editor.singlePrice": { kind: "badge", text: "سعر واحد" },
  "editor.tiers": { kind: "badge", text: "شرائح" },
  "editor.pricePerUnit": { kind: "badge", text: "السعر للعبوة" },
  "editor.sendReview": { kind: "button", text: "أرسل للمراجعة" },
  "editor.sendEdit": { kind: "button", text: "أرسل التعديل" },
  "listing.reviewPending": { kind: "badge", text: "قيد المراجعة" },
  "listing.approved": { kind: "badge", text: "معتمد" },
  "listing.rejected": { kind: "badge", text: "مرفوض" },
  "listing.editPending": { kind: "badge", text: "تعديل قيد المراجعة" },
  "listing.editRejected": { kind: "badge", text: "رُفض التعديل" },
  "sr.galleryRegion": { kind: "screen-reader", text: "معرض" },
  "sr.tierTable": { kind: "screen-reader", text: "شرائح السعر" },
  "lab.h.listingCard": { kind: "title", text: "بطاقة عرض" },
  "lab.h.gallery": { kind: "title", text: "صور العرض والعارض" },
  "lab.h.priceTierTable": { kind: "title", text: "جدول شرائح السعر" },
  "lab.h.supplierHeader": { kind: "title", text: "رأس صفحة المورد" },
  "lab.h.reportSheet": { kind: "title", text: "ورقة الإبلاغ" },
  "lab.h.listingEditor": { kind: "title", text: "نموذج إنشاء عرض" },
  "lab.h.listingStatusBadge": { kind: "title", text: "شارة حالة العرض" },
  "lab.h.marketCompose": { kind: "title", text: "تركيب شاشة السوق" },
  // -------------------------------------------------------- B5 review & admin
  "review.newListing": { kind: "badge", text: "عرض جديد" },
  "review.editListing": { kind: "badge", text: "تعديل عرض" },
  "review.newDriver": { kind: "badge", text: "سائق جديد" },
  "review.report": { kind: "badge", text: "بلاغ" },
  "review.sinceAgo": { kind: "help", text: "منذ {duration}" },
  "review.emptyQueue": { kind: "empty", text: "لا شيء ينتظر المراجعة." },
  "review.emptyReports": { kind: "empty", text: "لا بلاغات." },
  "review.beforeApprove": { kind: "title", text: "بنود التحقق" },
  "review.firstListing": { kind: "badge", text: "أول عرض" },
  "review.verificationCall": { kind: "help", text: "أجريت اتصال التحقق مع المورد" },
  "review.tickAllFirst": { kind: "help", text: "أشّر على كل البنود أولاً." },
  "review.decisionReason": { kind: "badge", text: "سبب القرار" },
  "review.approve": { kind: "button", text: "اعتمد العرض" },
  "review.reject": { kind: "button", text: "ارفض العرض" },
  "review.sendRejection": { kind: "button", text: "أرسل الرفض" },
  "review.approvedToast": { kind: "success", text: "اعتُمد العرض" },
  "review.rejectedToast": { kind: "success", text: "رُفض العرض" },
  "review.writeReason": { kind: "error", text: "اكتب سبب القرار." },
  "reportItem.one": { kind: "badge", text: "بلاغ" },
  "reportItem.two": { kind: "badge", text: "بلاغان" },
  "reportItem.few": { kind: "badge", text: "{count} بلاغات" },
  "driverReview.approve": { kind: "button", text: "اعتمد السائق" },
  "driverReview.reject": { kind: "button", text: "ارفض" },
  "driverReview.approvedToast": { kind: "success", text: "اعتُمد السائق" },
  "driverReview.attachments": { kind: "title", text: "المرفقات" },
  "sr.unread": { kind: "screen-reader", text: "غير مقروء" },
  "sr.reviewItems": { kind: "screen-reader", text: "{count} بنود، أُشّر على {ticked}" },
  "lab.h.reviewQueueItem": { kind: "title", text: "صف طابور المراجعة" },
  "lab.h.decisionCard": { kind: "title", text: "ورقة قرار الاعتماد" },
  "lab.h.driverApprovalCard": { kind: "title", text: "ورقة اعتماد سائق" },
  "lab.h.reportItem": { kind: "title", text: "صف عرض مبلَّغاً" },
  "lab.h.reviewCompose": { kind: "title", text: "تركيب شاشة المراجعة" },
  // ------------------------------------------------------------------ B6 Ask
  "ask.title": { kind: "title", text: "Ask Micro" },
  "ask.askMicro": { kind: "badge", text: "اسأل Micro" },
  "ask.contextPrefix": { kind: "badge", text: "تسأل عن: {context}" },
  "ask.you": { kind: "screen-reader", text: "أنت:" },
  "ask.notSent": { kind: "error", text: "لم يُرسل" },
  "ask.resend": { kind: "button", text: "أعد الإرسال" },
  "ask.microPrefix": { kind: "screen-reader", text: "Micro:" },
  "ask.incomplete": { kind: "error", text: "لم يكتمل الجواب." },
  "ask.retry": { kind: "button", text: "أعد المحاولة" },
  "ask.howCalculated": { kind: "button", text: "كيف حُسبت؟" },
  "ask.numberSource": { kind: "title", text: "مصدر الرقم" },
  "ask.fullTable": { kind: "button", text: "الجدول كاملاً" },
  "ask.gone": { kind: "help", text: "لم يعد موجوداً" },
  "ask.limitPermission": { kind: "help", text: "هذا خارج صلاحياتك في هذا المشروع." },
  "ask.limitData": { kind: "help", text: "لا أملك بيانات كافية لهذا السؤال." },
  "ask.recordVoice": { kind: "screen-reader", text: "سجّل صوتاً" },
  "ask.send": { kind: "screen-reader", text: "أرسل" },
  "sr.howCalculated": { kind: "screen-reader", text: "كيف حُسبت {label}" },
  "sr.askAbout": { kind: "screen-reader", text: "اسأل Micro عن {label}" },
  "lab.h.askPanel": { kind: "title", text: "لوحة المساعد Ask" },
  "lab.h.askContextChip": { kind: "title", text: "رقاقة سياق السؤال" },
  "lab.h.askUserMessage": { kind: "title", text: "رسالة المستخدم" },
  "lab.h.askAnswer": { kind: "title", text: "جواب Micro النصي" },
  "lab.h.askComputedResult": { kind: "title", text: "رقم محسوب ومصدره" },
  "lab.h.askInlineTable": { kind: "title", text: "جدول داخل الجواب" },
  "lab.h.askNavResult": { kind: "title", text: "كائن من الجواب" },
  "lab.h.askDraftCard": { kind: "title", text: "مسودة من الجواب" },
  "lab.h.askLimit": { kind: "title", text: "جواب خارج الصلاحيات" },
  "lab.h.askThinking": { kind: "title", text: "انتظار الجواب" },
  "lab.h.askAboutThis": { kind: "title", text: "زر اسأل عنه" },
  "lab.h.askCompose": { kind: "title", text: "تركيب محادثة Ask" },
  // ----------------------------------------------------------------- B7 charts
  "chart.table": { kind: "screen-reader", text: "جدول" },
  "chart.chart": { kind: "screen-reader", text: "رسم" },
  "chart.empty": { kind: "empty", text: "لا بيانات لهذه الفترة." },
  "chart.thisWeek": { kind: "badge", text: "هذا الأسبوع" },
  "chart.lastWeek": { kind: "badge", text: "الأسبوع الماضي" },
  "chart.other": { kind: "badge", text: "غير ذلك" },
  "lab.h.chartBars": { kind: "title", text: "أعمدة مبيعات الأيام" },
  "lab.h.chartNegative": { kind: "title", text: "أعمدة فيها خسارة" },
  "lab.h.chartRanked": { kind: "title", text: "أعلى العملاء بالقيمة" },
  "lab.h.chartLine": { kind: "title", text: "خط تغير سنة" },
  "lab.h.chartStacked": { kind: "title", text: "توزيع الخارج بالنسب" },
  "lab.h.chartCompare": { kind: "title", text: "مقارنة أسبوعين" },
  "lab.h.chartsCompose": { kind: "title", text: "تركيب الرسوم" }
}, Ze = {
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
  "title.checkbox": { kind: "title", text: "مربع الاختيار" }
  // --- Domains (plan B, stage 5): ar-domains.ts, one linking line (PLAN-B) ---
  // ---------------------------------------------------------------------------
}, k = { ...Ze, ...Se };
function A(e, t) {
  let a = k[e].text;
  if (t)
    for (const [i, r] of Object.entries(t))
      a = a.replaceAll(`{${i}}`, String(r));
  return a;
}
const Me = {
  movements: { zero: "لا حركات", one: "حركة واحدة", two: "حركتين", few: "حركات", many: "حركة" },
  orders: { zero: "لا طلبات", one: "طلب واحد", two: "طلتان", few: "طلبات", many: "طلب" },
  quotes: { zero: "لا عروض", one: "عرض واحد", two: "عرضان", few: "عروض", many: "عرض" },
  results: { zero: "لا نتائج", one: "نتيجة واحدة", two: "نتيجتان", few: "نتائج", many: "نتيجة" },
  unread: { zero: "لا شيء غير مقروء", one: "غير مقروء واحد", two: "غير مقروءان", few: "غير مقروءة", many: "غير مقروءة" }
}, y = {
  unit: k["money.unit"].text,
  minus: k["money.ariaMinus"].text,
  dinar: k["money.ariaDinar"].text,
  fils: k["money.ariaFils"].text,
  and: k["money.ariaAnd"].text,
  forYou: k["money.forYou"].text,
  againstYou: k["money.againstYou"].text,
  hidden: k["money.ariaHidden"].text,
  missing: k["money.ariaMissing"].text,
  hiddenGlyph: k["money.hiddenGlyph"].text,
  missingGlyph: k["money.missing"].text
}, Ce = new Intl.PluralRules("ar");
function je(e, t) {
  switch (Ce.select(e)) {
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
const Pe = "ص", Te = "م";
function de(e) {
  return `${e < 10 ? "0" : ""}${e}`;
}
function Ve(e) {
  return e instanceof Date ? { h: e.getHours(), m: e.getMinutes() } : e;
}
function zn(e) {
  const { h: t, m: a } = Ve(e), i = t < 12 ? Pe : Te, r = t % 12 === 0 ? 12 : t % 12;
  return `${de(r)}:${de(a)} ${i}`;
}
const U = "−", Ie = "+", R = 3;
function $e(e) {
  const t = String(e).trim(), a = t.startsWith("-"), i = a ? t.slice(1) : t, [r = "0", s = ""] = i.split("."), o = r.replace(/[^0-9]/g, "") || "0", d = (s + "000").slice(0, R), l = BigInt(o) * 10n ** BigInt(R) + BigInt(d || "0");
  return { negative: a, fils: l };
}
function Le(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function Fe(e) {
  const t = 10n ** BigInt(R), a = e / t, i = e % t;
  return {
    int: Le(a.toString()),
    frac: i === 0n ? "" : `.${i.toString().padStart(R, "0")}`
  };
}
function X(e, t) {
  const a = 10n ** BigInt(R), i = e / a, r = e % a;
  let s = `${i.toString()} ${t.dinar}`;
  return r !== 0n && (s += ` ${t.and}${r.toString()} ${t.fils}`), s;
}
function T(e, t) {
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
    const p = t.debt === "forYou" ? a.forYou : t.debt === "againstYou" ? a.againstYou : "", g = p ? `${p} ${a.hiddenGlyph} ${a.unit}` : `${a.hiddenGlyph} ${a.unit}`;
    return {
      missing: !1,
      hidden: !0,
      debt: t.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: a.unit,
      debtWord: p,
      display: g,
      aria: a.hidden
    };
  }
  const { negative: r, fils: s } = $e(e), o = Fe(s), d = t.debt === "forYou" ? a.forYou : t.debt === "againstYou" ? a.againstYou : "", l = d ? "" : t.flow === "in" ? Ie : t.flow === "out" ? U : t.flow === "transfer" ? "" : r ? U : "", c = `${l}${o.int}${o.frac}`, m = d ? `${d} ${c} ${a.unit}` : `${c} ${a.unit}`;
  let u;
  return d ? u = `${d} ${X(s, a)}` : l === U ? u = `${a.minus} ${X(s, a)}` : u = X(s, a), {
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
const he = ue({ hidden: !1 });
function Jn({ children: e, hidden: t = !1 }) {
  const a = z(() => ({ hidden: t }), [t]);
  return /* @__PURE__ */ n(he.Provider, { value: a, children: e });
}
function P() {
  const { hidden: e } = J(he);
  return { hidden: e, visible: !e };
}
const Ee = 500, Re = Be("motion.press-cancel-px");
function H(e = {}) {
  const { onPress: t, onLongPress: a, disabled: i } = e, [r, s] = j(!1), o = S(null), d = S(null), l = S(!1), c = C(() => {
    d.current !== null && (clearTimeout(d.current), d.current = null);
  }, []), m = C(() => {
    c(), o.current = null, l.current = !1, s(!1);
  }, [c]), u = C(
    (f) => {
      if (!i && !(f.pointerType === "mouse" && f.button !== 0)) {
        if (typeof f.currentTarget.setPointerCapture == "function")
          try {
            f.currentTarget.setPointerCapture(f.pointerId);
          } catch {
          }
        o.current = { x: f.clientX, y: f.clientY }, l.current = !1, s(!0), a && (d.current = setTimeout(() => {
          l.current = !0, a();
        }, Ee));
      }
    },
    [i, a]
  ), p = C(
    (f) => {
      if (!r || o.current === null) return;
      const b = f.clientX - o.current.x, x = f.clientY - o.current.y;
      Math.hypot(b, x) > Re && m();
    },
    [r, m]
  ), g = C(
    (f) => {
      if (!r) return;
      const b = l.current;
      m(), !b && !i && t?.();
    },
    [r, i, t, m]
  );
  return {
    isPressed: r,
    pressProps: {
      onPointerDown: u,
      onPointerMove: p,
      onPointerUp: g,
      onPointerCancel: m
    }
  };
}
const De = () => typeof window > "u" || !window.visualViewport ? {
  height: typeof window > "u" ? 0 : window.innerHeight,
  offsetTop: 0,
  scale: 1,
  keyboardHeight: 0
} : ge(window.visualViewport);
function ge(e) {
  const t = e.height, a = e.offsetTop, i = Math.max(0, window.innerHeight - t - a);
  return { height: t, offsetTop: a, scale: e.scale, keyboardHeight: i };
}
function Oe() {
  const [e, t] = j(De);
  return I(() => {
    const a = window.visualViewport;
    if (!a) return;
    const i = () => t(ge(a));
    return i(), a.addEventListener("resize", i), a.addEventListener("scroll", i), window.addEventListener("resize", i), window.addEventListener("orientationchange", i), () => {
      a.removeEventListener("resize", i), a.removeEventListener("scroll", i), window.removeEventListener("resize", i), window.removeEventListener("orientationchange", i);
    };
  }, []), e;
}
const te = ue({
  sheetIds: [],
  registerSheet: () => {
  },
  unregisterSheet: () => {
  }
});
function Ye(e, t) {
  switch (t.type) {
    case "register":
      return e.includes(t.id) ? e : [...e, t.id];
    case "unregister":
      return e.includes(t.id) ? e.filter((a) => a !== t.id) : e;
    default:
      return e;
  }
}
function ea({ children: e }) {
  const [t, a] = Ae(Ye, []), i = C((o) => a({ type: "register", id: o }), []), r = C((o) => a({ type: "unregister", id: o }), []), s = z(
    () => ({ sheetIds: t, registerSheet: i, unregisterSheet: r }),
    [t, i, r]
  );
  return /* @__PURE__ */ n(te.Provider, { value: s, children: e });
}
function ta() {
  const { sheetIds: e, registerSheet: t, unregisterSheet: a } = J(te), i = ee();
  Ne(() => (t(i), () => a(i)), [i, t, a]);
  const r = e.indexOf(i) + 1 || e.length + 1, s = Math.min(r, 2), o = r === e.length;
  return {
    level: s,
    overLimit: r > 2,
    sheetZ: s === 1 ? "var(--mds-layer-sheet)" : "var(--mds-layer-sheet-2)",
    scrimZ: s === 1 ? "var(--mds-layer-scrim)" : "var(--mds-layer-scrim-2)",
    isTop: o
  };
}
function na() {
  const { sheetIds: e } = J(te);
  return e.length;
}
const _e = /* @__PURE__ */ h("g", { transform: "translate(16 16)", id: "micro-symbol-master-2", children: [
  /* @__PURE__ */ n("g", { id: "module-top", transform: "rotate(0 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-top", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ n("g", { id: "module-right", transform: "rotate(90 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-right", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-signal)" }) }),
  /* @__PURE__ */ n("g", { id: "module-bottom", transform: "rotate(180 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-bottom", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ n("g", { id: "module-left", transform: "rotate(270 96 96)", children: /* @__PURE__ */ n("path", { id: "shape-left", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-data)" }) })
] });
function qe({ size: e = 28, className: t, ...a }) {
  return /* @__PURE__ */ n(
    "svg",
    {
      viewBox: "0 0 224 224",
      width: e,
      height: e,
      "aria-hidden": "true",
      className: ["mds-icon", t].filter(Boolean).join(" "),
      ...a,
      children: _e
    }
  );
}
const Ge = {
  regular: /* @__PURE__ */ n("path", { d: "M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z" })
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
      children: Ge[t]
    }
  );
}
const We = {
  regular: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z" })
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
      children: We[t]
    }
  );
}
const Qe = {
  regular: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z" })
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
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Qe[t]
    }
  );
}
const Ue = {
  regular: /* @__PURE__ */ n("path", { d: "M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A8.13,8.13,0,0,0,255.43,117ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208ZM32,136V72H176v64Zm160,72a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm0-96V88h34.58l9.6,24Z" })
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
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: Ue[t]
    }
  );
}
const Xe = {
  regular: /* @__PURE__ */ n("path", { d: "M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z" }),
  fill: /* @__PURE__ */ n("path", { d: "M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z" })
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
      children: Xe[t]
    }
  );
}
const Ke = {
  regular: /* @__PURE__ */ n("path", { d: "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" })
};
function ze({
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
      children: Ke[t]
    }
  );
}
const Je = {
  regular: /* @__PURE__ */ n("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" })
};
function et({
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
      children: Je[t]
    }
  );
}
const tt = {
  regular: /* @__PURE__ */ n("path", { d: "M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" })
};
function nt({
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
      children: tt[t]
    }
  );
}
const at = {
  regular: /* @__PURE__ */ n("path", { d: "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" })
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
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: at[t]
    }
  );
}
const it = {
  bold: /* @__PURE__ */ n("path", { d: "M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" })
};
function rt({
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
      children: it[t]
    }
  );
}
const st = {
  bold: /* @__PURE__ */ n("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" })
};
function ot({
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
      children: st[t]
    }
  );
}
const dt = {
  regular: /* @__PURE__ */ n("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function lt({
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
      children: dt[t]
    }
  );
}
const ct = {
  bold: /* @__PURE__ */ n("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function ne({
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
      children: ct[t]
    }
  );
}
const mt = {
  regular: /* @__PURE__ */ n("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" })
};
function ut({
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
      children: mt[t]
    }
  );
}
const ht = {
  fill: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function gt({
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
      children: ht[t]
    }
  );
}
const pt = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function ft({
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
      children: pt[t]
    }
  );
}
const bt = {
  bold: /* @__PURE__ */ n("path", { d: "M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" })
};
function la({
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
const xt = {
  bold: /* @__PURE__ */ n("path", { d: "M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" })
};
function ca({
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
      children: xt[t]
    }
  );
}
const kt = {
  bold: /* @__PURE__ */ n("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function pe({
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
const vt = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z" })
};
function wt({
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
      children: vt[t]
    }
  );
}
const yt = {
  bold: /* @__PURE__ */ n("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function ae({
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
      children: yt[t]
    }
  );
}
const At = {
  bold: /* @__PURE__ */ n("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" })
};
function Nt({
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
      children: At[t]
    }
  );
}
const Ht = {
  bold: /* @__PURE__ */ n("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" })
};
function Bt({
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
      children: Ht[t]
    }
  );
}
const St = {
  regular: /* @__PURE__ */ n("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" })
};
function ma({
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
      children: St[t]
    }
  );
}
const Zt = {
  regular: /* @__PURE__ */ n("path", { d: "M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z" })
};
function Mt({
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
      children: Zt[t]
    }
  );
}
const Ct = {
  regular: /* @__PURE__ */ n("path", { d: "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z" })
};
function jt({
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
      children: Ct[t]
    }
  );
}
const Pt = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" })
};
function Tt({
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
      children: Pt[t]
    }
  );
}
const Vt = {
  regular: /* @__PURE__ */ n("path", { d: "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z" })
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
      children: Vt[t]
    }
  );
}
const It = {
  fill: /* @__PURE__ */ n("path", { d: "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" })
};
function $t({
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
      children: It[t]
    }
  );
}
const Lt = {
  fill: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" })
};
function Ft({
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
      children: Lt[t]
    }
  );
}
const Et = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function Rt({
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
  regular: /* @__PURE__ */ n("path", { d: "M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM80,40h40V56H80ZM54.25,72h147.5l20,80H34.25ZM32,192V168H224v24ZM64,96a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,96ZM64,128a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,128Z" })
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
      children: Dt[t]
    }
  );
}
const Ot = {
  regular: /* @__PURE__ */ n("path", { d: "M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z" })
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
      children: Ot[t]
    }
  );
}
const Yt = {
  regular: /* @__PURE__ */ n("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" })
};
function pa({
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
const _t = {
  regular: /* @__PURE__ */ n("path", { d: "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z" })
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
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: _t[t]
    }
  );
}
const qt = {
  regular: /* @__PURE__ */ n("path", { d: "M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9ZM164,96a36,36,0,0,0,5.9-.48,36,36,0,1,0,28.22-47A36,36,0,1,0,164,96Zm60-12a20,20,0,1,1-20-20A20,20,0,0,1,224,84ZM164,40a20,20,0,0,1,19.25,14.61,36,36,0,0,0-15,24.93A20.42,20.42,0,0,1,164,80a20,20,0,0,1,0-40Z" })
};
function ba({
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
const Gt = {
  regular: /* @__PURE__ */ n("path", { d: "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" })
};
function xa({
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
const Wt = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function ka({
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
  regular: /* @__PURE__ */ n("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" })
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
      children: Qt[t]
    }
  );
}
const Ut = {
  regular: /* @__PURE__ */ n("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
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
      children: Ut[t]
    }
  );
}
const Xt = {
  regular: /* @__PURE__ */ n("path", { d: "M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z" })
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
      children: Xt[t]
    }
  );
}
const Kt = {
  regular: /* @__PURE__ */ n("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" })
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
      children: Kt[t]
    }
  );
}
const zt = {
  regular: /* @__PURE__ */ n("path", { d: "M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z" })
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
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: zt[t]
    }
  );
}
const Jt = {
  regular: /* @__PURE__ */ n("path", { d: "M216,40H68.53a16.08,16.08,0,0,0-13.72,7.77L9.14,123.88a8,8,0,0,0,0,8.24l45.67,76.11A16.08,16.08,0,0,0,68.53,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM61.67,204.12,68.53,200h0ZM216,200H68.53l-43.2-72,43.2-72H216ZM106.34,146.34,124.69,128l-18.35-18.34a8,8,0,0,1,11.32-11.32L136,116.69l18.34-18.35a8,8,0,0,1,11.32,11.32L147.31,128l18.35,18.34a8,8,0,0,1-11.32,11.32L136,139.31l-18.34,18.35a8,8,0,0,1-11.32-11.32Z" })
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
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Jt[t]
    }
  );
}
const en = {
  regular: /* @__PURE__ */ n("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" })
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
      children: en[t]
    }
  );
}
const tn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" })
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
      children: tn[t]
    }
  );
}
const nn = {
  regular: /* @__PURE__ */ n("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
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
      children: nn[t]
    }
  );
}
const an = {
  regular: /* @__PURE__ */ n("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" })
};
function Ma({
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
      children: an[t]
    }
  );
}
const rn = {
  regular: /* @__PURE__ */ n("path", { d: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z" })
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
      children: rn[t]
    }
  );
}
const sn = {
  regular: /* @__PURE__ */ n("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" })
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
      children: sn[t]
    }
  );
}
const on = {
  regular: /* @__PURE__ */ n("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" })
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
      children: on[t]
    }
  );
}
const dn = {
  regular: /* @__PURE__ */ n("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" })
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
      children: dn[t]
    }
  );
}
const ln = {
  regular: /* @__PURE__ */ n("path", { d: "M197.66,69.66,83.31,184H168a8,8,0,0,1,0,16H64a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v84.69L186.34,58.34a8,8,0,0,1,11.32,11.32Z" })
};
function cn({
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
const mn = {
  regular: /* @__PURE__ */ n("path", { d: "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" })
};
function un({
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
      children: mn[t]
    }
  );
}
const hn = {
  regular: /* @__PURE__ */ n("path", { d: "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" })
};
function Va({
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
      children: hn[t]
    }
  );
}
const gn = {
  regular: /* @__PURE__ */ n("path", { d: "M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" })
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
      children: gn[t]
    }
  );
}
const pn = {
  regular: /* @__PURE__ */ n("path", { d: "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" })
};
function $a({
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
const fn = {
  regular: /* @__PURE__ */ n("path", { d: "M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z" })
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
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: fn[t]
    }
  );
}
const bn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z" })
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
      children: bn[t]
    }
  );
}
const xn = {
  regular: /* @__PURE__ */ n("path", { d: "M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" })
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
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: xn[t]
    }
  );
}
const kn = {
  regular: /* @__PURE__ */ n("path", { d: "M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
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
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: kn[t]
    }
  );
}
const vn = {
  regular: /* @__PURE__ */ n("path", { d: "M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
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
      children: vn[t]
    }
  );
}
const wn = {
  regular: /* @__PURE__ */ n("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" })
};
function Oa({
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
const yn = {
  regular: /* @__PURE__ */ n("path", { d: "M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" })
};
function Ya({
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
      children: yn[t]
    }
  );
}
const An = {
  regular: /* @__PURE__ */ n("path", { d: "M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z" })
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
      children: An[t]
    }
  );
}
const Nn = {
  regular: /* @__PURE__ */ n("path", { d: "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z" })
};
function qa({
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
  bold: /* @__PURE__ */ n("path", { d: "M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z" })
};
function Ga({
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
      children: Hn[t]
    }
  );
}
const Wa = ["nav-delivery", "back", "forward", "transfer", "movement-in", "movement-out", "send"];
function Bn({
  value: e,
  flow: t,
  debt: a,
  size: i = "md",
  state: r = "idle",
  disabled: s = !1,
  className: o,
  id: d,
  style: l,
  ref: c,
  ...m
}) {
  const { hidden: u } = P(), p = u && e !== null && e !== void 0, g = T(e, { flow: t, debt: a, hidden: p, texts: y }), f = ["mds-money", `mds-money--${i}`, i === "lg" ? "mds-number-lg" : "", s ? "mds-money--disabled" : "", o].filter(Boolean).join(" ");
  return r === "loading" ? /* @__PURE__ */ n("span", { ref: c, id: d, style: l, className: f, "aria-busy": "true", ...m, children: /* @__PURE__ */ n("span", { className: "mds-money-skeleton", "aria-hidden": "true" }) }) : /* @__PURE__ */ h("span", { ref: c, id: d, style: l, className: f, ...m, children: [
    /* @__PURE__ */ h("span", { className: "mds-money-visual", "aria-hidden": "true", children: [
      g.debtWord ? /* @__PURE__ */ n("span", { className: "mds-money-debt", children: g.debtWord }) : null,
      g.missing ? /* @__PURE__ */ n("span", { className: "mds-money-missing", children: y.missingGlyph }) : /* @__PURE__ */ h($, { children: [
        /* @__PURE__ */ n("bdi", { className: "mds-money-value", dir: "ltr", children: g.hidden ? y.hiddenGlyph : /* @__PURE__ */ h($, { children: [
          /* @__PURE__ */ h("span", { className: "mds-money-integer", children: [
            g.sign,
            g.int
          ] }),
          g.frac ? /* @__PURE__ */ n("span", { className: "mds-money-fraction", children: g.frac }) : null
        ] }) }),
        /* @__PURE__ */ n("span", { className: "mds-money-unit", children: g.unit })
      ] })
    ] }, p ? "hidden" : "shown"),
    /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: g.aria })
  ] });
}
const Qa = [
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
function Sn({
  onChange: e,
  disabled: t = !1,
  density: a = "regular",
  className: i,
  id: r,
  style: s,
  ref: o,
  ...d
}) {
  const { hidden: l, visible: c } = P(), m = l ? nt : et, u = A(l ? "button.showAmounts" : "button.hideAmounts"), p = [
    "mds-amount-visibility-toggle",
    a === "large" ? "mds-amount-visibility-toggle--large" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      ref: o,
      id: r,
      style: s,
      ...d,
      type: "button",
      className: p,
      "aria-label": u,
      disabled: t,
      onClick: () => e?.(!c),
      children: /* @__PURE__ */ n(m, { size: 24 })
    }
  );
}
const Ua = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "amountsShown",
  "amountsHidden"
];
function Xa({
  label: e,
  caption: t,
  selected: a = !1,
  onChange: i,
  disabled: r = !1,
  state: s = "idle",
  className: o,
  id: d,
  style: l,
  ref: c,
  "aria-label": m,
  ...u
}) {
  const p = [
    // .mds-control-row (base.css): the shared row-plain anatomy; the box
    // aligns to the FIRST text line, so the alignment overrides to start.
    "mds-control-row",
    "mds-checkbox",
    a ? "mds-checkbox--selected" : "",
    r ? "mds-checkbox--disabled" : "",
    s === "error" ? "mds-checkbox--error" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("label", { ref: c, id: d, style: l, className: p, ...u, children: [
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        className: "mds-checkbox-input mds-sr-input",
        checked: a,
        disabled: r,
        onChange: (g) => i?.(g.target.checked),
        "aria-label": m,
        "aria-invalid": s === "error" || void 0
      }
    ),
    /* @__PURE__ */ n("span", { className: "mds-checkbox-box", "aria-hidden": "true", children: /* @__PURE__ */ n(ne, { size: 14 }) }),
    /* @__PURE__ */ h("span", { className: "mds-checkbox-text mds-control-text", children: [
      /* @__PURE__ */ n("span", { className: "mds-checkbox-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ n("span", { className: "mds-checkbox-caption mds-type-caption", children: t }) : null
    ] }),
    s === "error" ? /* @__PURE__ */ n("span", { className: "mds-checkbox-error mds-type-caption", children: A("checkbox.tickThis") }) : null
  ] });
}
const Ka = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function za({
  label: e,
  items: t,
  value: a,
  onChange: i,
  disabled: r = !1,
  state: s = "idle",
  className: o,
  id: d,
  style: l,
  ref: c,
  ...m
}) {
  const u = ee(), p = [
    "mds-radio",
    r ? "mds-radio--disabled" : "",
    s === "error" ? "mds-radio--error" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("div", { ref: c, id: d, style: l, className: p, ...m, children: [
    /* @__PURE__ */ n("span", { className: "mds-radio-label mds-type-label", children: e }),
    /* @__PURE__ */ n("div", { className: "mds-radio-surface", role: "radiogroup", "aria-label": e, children: t.map((g) => {
      const f = g.value === a;
      return /* @__PURE__ */ h("label", { className: "mds-control-row mds-radio-row", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "radio",
            className: "mds-radio-input mds-sr-input",
            name: u,
            checked: f,
            disabled: r || g.disabled,
            onChange: () => i?.(g.value)
          }
        ),
        /* @__PURE__ */ n("span", { className: "mds-radio-circle", "aria-hidden": "true", children: /* @__PURE__ */ n("span", { className: "mds-radio-dot" }) }),
        /* @__PURE__ */ h("span", { className: "mds-radio-text mds-control-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-radio-row-label mds-type-body", children: g.label }),
          g.caption ? /* @__PURE__ */ n("span", { className: "mds-radio-caption mds-type-caption", children: g.caption }) : null
        ] })
      ] }, g.value);
    }) }),
    s === "error" ? /* @__PURE__ */ n("span", { className: "mds-radio-error mds-type-caption", children: A("radio.choose").replace("{label}", e) }) : null
  ] });
}
const Ja = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function ei({
  label: e,
  caption: t,
  selected: a = !1,
  onChange: i,
  disabled: r = !1,
  className: s,
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
    r ? "mds-toggle--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("label", { ref: l, id: o, style: d, className: m, ...c, children: [
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        className: "mds-toggle-input mds-sr-input",
        role: "switch",
        checked: a,
        disabled: r,
        onChange: (u) => i?.(u.target.checked),
        "aria-checked": a
      }
    ),
    /* @__PURE__ */ h("span", { className: "mds-toggle-text mds-control-text", children: [
      /* @__PURE__ */ n("span", { className: "mds-toggle-label mds-type-body", children: e }),
      t ? /* @__PURE__ */ n("span", { className: "mds-toggle-caption mds-type-caption", children: t }) : null
    ] }),
    /* @__PURE__ */ n("span", { className: "mds-toggle-switch", "aria-hidden": "true", children: /* @__PURE__ */ n("span", { className: "mds-toggle-track", children: /* @__PURE__ */ n("span", { className: "mds-toggle-thumb", children: /* @__PURE__ */ n(ne, { size: 14 }) }) }) })
  ] });
}
const ti = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled"
];
function ni({
  label: e,
  placeholder: t,
  value: a = "",
  onChange: i,
  disabled: r = !1,
  className: s,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = a.length > 0, u = [
    "mds-search-field",
    r ? "mds-search-field--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("div", { ref: l, id: o, style: d, className: u, ...c, children: [
    /* @__PURE__ */ n(ut, { size: 20 }),
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
        onChange: (p) => i?.(p.target.value)
      }
    ),
    m ? /* @__PURE__ */ n(
      Zn,
      {
        onClear: () => {
          i?.("");
        }
      }
    ) : null
  ] });
}
function Zn({ onClear: e }) {
  const { isPressed: t, pressProps: a } = H({ onPress: e });
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: ["mds-search-field-clear", t ? "mds-search-field-clear--pressed" : ""].filter(Boolean).join(" "),
      "data-ds-exempt": "",
      "aria-label": A("sr.clearSearch"),
      ...a,
      children: /* @__PURE__ */ n(gt, { size: 20 })
    }
  );
}
const ai = [
  "default",
  "focused",
  "disabled",
  "withText"
];
function ii({
  label: e,
  caption: t,
  value: a = "",
  onChange: i,
  placeholder: r,
  state: s = "idle",
  disabled: o = !1,
  optional: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...p
}) {
  const g = ee(), f = z(() => `${g}-error`, [g]), b = [
    "mds-field",
    "mds-text-area",
    s === "error" ? "mds-text-area--error" : "",
    o ? "mds-text-area--disabled mds-field--disabled" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("div", { id: c, style: m, className: b, ...p, children: [
    /* @__PURE__ */ h("label", { className: "mds-text-area-label mds-type-label", htmlFor: c ?? g, children: [
      e,
      d ? /* @__PURE__ */ n("span", { className: "mds-text-area-optional mds-type-caption", children: A("field.optional") }) : null
    ] }),
    /* @__PURE__ */ n(
      "textarea",
      {
        ref: u,
        id: c ?? g,
        className: "mds-text-area-input mds-field-input",
        rows: 1,
        value: a,
        disabled: o,
        placeholder: r,
        "aria-multiline": "true",
        "aria-invalid": s === "error" || void 0,
        "aria-describedby": s === "error" ? f : void 0,
        enterKeyHint: "enter",
        onChange: (x) => i?.(x.target.value),
        onInput: (x) => {
          const v = x.currentTarget;
          v.style.height = "auto", v.style.height = `${v.scrollHeight}px`;
        }
      }
    ),
    s === "error" ? /* @__PURE__ */ h("span", { id: f, className: "mds-text-area-help mds-type-caption", children: [
      /* @__PURE__ */ n(ft, { size: 16 }),
      /* @__PURE__ */ n("span", { children: t })
    ] }) : t ? /* @__PURE__ */ n("span", { className: "mds-text-area-help mds-type-caption", children: /* @__PURE__ */ n("span", { children: t }) }) : null
  ] });
}
const ri = [
  "default",
  "focused",
  "error",
  "disabled",
  "grown"
], le = 1632, Mn = 1641, Cn = 1643;
function jn(e) {
  let t = "", a = !1;
  for (const r of e) {
    const s = r.codePointAt(0);
    if (s >= le && s <= Mn) {
      const o = String(s - le);
      t = i(t, o);
      continue;
    }
    if (r >= "0" && r <= "9") {
      t = i(t, r);
      continue;
    }
    if ((s === Cn || r === "." || r === ",") && !a) {
      t === "" && (t = "0"), t += ".", a = !0;
      continue;
    }
  }
  return t;
  function i(r, s) {
    return r.includes(".") && r.length - r.indexOf(".") - 1 >= 3 || r === "0" && s === "0" ? r : r === "0" ? s : r + s;
  }
}
function si({
  label: e,
  caption: t,
  value: a = "",
  onChange: i,
  disabled: r = !1,
  state: s = "idle",
  draft: o = !1,
  className: d,
  id: l,
  style: c,
  ref: m,
  ...u
}) {
  const [p, g] = j(!1), f = [
    "mds-amount-field",
    r ? "mds-amount-field--disabled" : "",
    s === "error" ? "mds-amount-field--error" : "",
    o ? "mds-amount-field--draft" : "",
    d
  ].filter(Boolean).join(" "), b = p || a === "" ? a : T(a, { texts: y }).int + (a.includes(".") ? T(a, { texts: y }).frac : "");
  return /* @__PURE__ */ h("div", { id: l, style: c, className: f, ...u, children: [
    /* @__PURE__ */ n("span", { className: "mds-amount-field-label mds-type-label", children: e }),
    /* @__PURE__ */ h("div", { className: "mds-amount-field-box", children: [
      /* @__PURE__ */ n(
        "input",
        {
          ref: m,
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
          disabled: r,
          "aria-label": e,
          "aria-invalid": s === "error" || void 0,
          onFocus: () => g(!0),
          onBlur: () => g(!1),
          "data-long": b.length > 13 ? "true" : void 0,
          onChange: (x) => i?.(jn(x.target.value))
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-amount-field-unit", children: y.unit })
    ] }),
    s === "error" && t ? /* @__PURE__ */ n("span", { className: "mds-amount-field-help", children: t }) : t ? /* @__PURE__ */ n("span", { className: "mds-amount-field-help", children: t }) : null
  ] });
}
const oi = [
  "default",
  "focused",
  "error",
  "disabled",
  "long"
], Pn = {
  done: pe,
  waiting: wt,
  problem: ae,
  info: Nt
}, Tn = {
  done: k["badge.done"].text,
  waiting: k["badge.waiting"].text,
  problem: k["badge.problem"].text,
  info: k["badge.info"].text,
  neutral: k["badge.neutral"].text
};
function Vn({
  tone: e,
  label: t,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...o
}) {
  const d = e === "neutral" ? null : Pn[e], l = ["mds-status-badge", `mds-status-badge--${e}`, a].filter(Boolean).join(" ");
  return /* @__PURE__ */ n("span", { ref: s, id: i, style: r, className: l, ...o, children: /* @__PURE__ */ h("span", { className: "mds-status-badge-content", children: [
    d ? /* @__PURE__ */ n(d, { size: 14 }) : null,
    /* @__PURE__ */ n("span", { className: "mds-status-badge-label", children: t ?? Tn[e] })
  ] }, e) });
}
const di = [
  "neutral",
  "info",
  "done",
  "waiting",
  "problem",
  "longLabel"
], In = {
  done: $t,
  waiting: Ft
};
function $n(e) {
  let t = e.trim().split(/\s+/)[0];
  const a = String.fromCodePoint(1575, 1604);
  return t.length > a.length && t.startsWith(a) && (t = t.slice(a.length)), t ? Array.from(t)[0] : void 0;
}
function D({
  size: e = "md",
  variant: t = "surface",
  value: a,
  tone: i,
  children: r,
  className: s,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = i === "done" || i === "waiting" ? In[i] : null, u = r ? void 0 : a ? $n(a) : void 0, p = [
    "mds-entity-mark",
    `mds-entity-mark--${e}`,
    t === "canvas" ? "mds-entity-mark--canvas" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("span", { ref: l, id: o, style: d, className: p, "aria-hidden": "true", ...c, children: [
    r ?? (u ? /* @__PURE__ */ n("span", { className: "mds-entity-mark-initial", children: u }) : null),
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
function _({
  variant: e = "primary",
  mode: t = "surface",
  size: a = "md",
  loading: i = !1,
  leading: r,
  trailing: s,
  onPress: o,
  onLongPress: d,
  disabled: l = !1,
  className: c,
  id: m,
  style: u,
  ref: p,
  children: g,
  ...f
}) {
  const { isPressed: b, pressProps: x } = H({
    onPress: o,
    onLongPress: d,
    disabled: l || i
  }), v = [
    "mds-button",
    `mds-button--${e}`,
    `mds-button--${a}`,
    t === "canvas" ? "mds-button--on-canvas" : "",
    b ? "mds-button--pressed" : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: p,
      id: m,
      style: u,
      ...f,
      ...x,
      type: "button",
      className: v,
      disabled: l,
      "aria-busy": i || void 0,
      children: [
        i ? /* @__PURE__ */ n("span", { className: "mds-button-spinner", "aria-hidden": "true" }) : r ? /* @__PURE__ */ n("span", { className: "mds-button-icon", children: r }) : null,
        /* @__PURE__ */ n("span", { className: "mds-button-label", children: g }),
        s ? /* @__PURE__ */ n("span", { className: "mds-button-icon", children: s }) : null
      ]
    }
  );
}
const ci = [
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
function Ln({
  label: e,
  onPress: t,
  onLongPress: a,
  disabled: i = !1,
  density: r = "regular",
  className: s,
  id: o,
  style: d,
  ref: l,
  children: c,
  ...m
}) {
  const { isPressed: u, pressProps: p } = H({ onPress: t, onLongPress: a, disabled: i }), g = [
    "mds-icon-button",
    r === "large" ? "mds-icon-button--large" : "",
    u ? "mds-icon-button--pressed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "button",
    {
      ref: l,
      id: o,
      style: d,
      ...m,
      ...p,
      type: "button",
      className: g,
      "aria-label": e,
      disabled: i,
      children: c
    }
  );
}
const mi = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "large"
];
function ui({
  label: e,
  caption: t,
  value: a,
  onChange: i,
  placeholder: r,
  state: s = "idle",
  disabled: o = !1,
  optional: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...p
}) {
  const g = [
    "mds-field",
    "mds-text-field",
    s === "error" ? "mds-text-field--error" : "",
    o ? "mds-text-field--disabled mds-field--disabled" : "",
    l
  ].filter(Boolean).join(" "), f = c ? `${c}-input` : void 0;
  return /* @__PURE__ */ h("span", { ref: u, id: c, style: m, className: g, ...p, children: [
    /* @__PURE__ */ h("label", { className: "mds-text-field-label mds-type-label", htmlFor: f, children: [
      e,
      d ? /* @__PURE__ */ n("span", { className: "mds-text-field-optional mds-type-caption", children: A("field.optional") }) : null
    ] }),
    /* @__PURE__ */ n(
      "input",
      {
        id: f,
        className: "mds-text-field-input mds-field-input",
        type: "text",
        value: a,
        disabled: o,
        placeholder: r,
        "aria-label": c ? void 0 : e,
        "aria-invalid": s === "error" || void 0,
        onChange: (b) => i?.(b.target.value)
      }
    ),
    t ? /* @__PURE__ */ h("span", { className: s === "error" ? "mds-text-field-caption mds-text-field-caption--error" : "mds-text-field-caption", children: [
      s === "error" ? /* @__PURE__ */ n(ae, { size: 14 }) : null,
      t
    ] }) : null
  ] });
}
const hi = [
  "default",
  "focused",
  "disabled",
  "error",
  "withCaption",
  "withPlaceholder"
];
function gi({
  leading: e,
  value: t,
  onChange: a,
  disabled: i = !1,
  label: r,
  className: s,
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
      className: ["mds-segmented", s].filter(Boolean).join(" "),
      role: "group",
      "aria-label": r,
      ...c,
      children: e.map((m) => /* @__PURE__ */ n(
        Fn,
        {
          segment: m,
          selected: m.value === t,
          disabled: i || m.disabled === !0,
          onChange: a
        },
        m.value
      ))
    }
  );
}
function Fn({
  segment: e,
  selected: t,
  disabled: a,
  onChange: i
}) {
  const { isPressed: r, pressProps: s } = H({ onPress: () => i(e.value), disabled: a }), o = [
    "mds-segmented-segment",
    t ? "mds-segmented-segment--selected" : "",
    r ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      type: "button",
      className: o,
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
const pi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "threeSegments",
  "fourSegments",
  "withIcon"
];
function fi({
  leading: e,
  value: t,
  onChange: a,
  disabled: i = !1,
  label: r,
  className: s,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = (u) => {
    const p = t.includes(u) ? t.filter((g) => g !== u) : [...t, u];
    a(p);
  };
  return /* @__PURE__ */ n(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-filter-chips", s].filter(Boolean).join(" "),
      role: "group",
      "aria-label": r,
      ...c,
      children: e.map((u) => /* @__PURE__ */ n(
        En,
        {
          chip: u,
          selected: t.includes(u.value),
          disabled: i || u.disabled === !0,
          onToggle: m
        },
        u.value
      ))
    }
  );
}
function En({
  chip: e,
  selected: t,
  disabled: a,
  onToggle: i
}) {
  const { isPressed: r, pressProps: s } = H({ onPress: () => i(e.value), disabled: a }), o = [
    "mds-filter-chip",
    t ? "mds-filter-chip--selected" : "",
    r ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      type: "button",
      className: o,
      "aria-pressed": t === !0,
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...s,
      children: [
        t ? /* @__PURE__ */ n(ne, { size: 16, className: "mds-filter-chip-check" }) : null,
        /* @__PURE__ */ n("span", { className: "mds-filter-chip-label", children: e.label })
      ]
    }
  );
}
const bi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "manyChips"
];
function xi({
  children: e,
  label: t,
  trailing: a,
  density: i = "regular",
  className: r,
  id: s,
  style: o,
  ref: d,
  ...l
}) {
  const c = [
    "mds-surface",
    i === "list" ? "mds-surface--list" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("div", { ref: d, id: s, style: o, className: c, ...l, children: [
    t || a ? /* @__PURE__ */ h("div", { className: "mds-surface-header", children: [
      t ? /* @__PURE__ */ n("h3", { className: "mds-surface-title", children: t }) : null,
      a ? /* @__PURE__ */ n("div", { className: "mds-surface-action", children: a }) : null
    ] }) : null,
    e
  ] });
}
const ki = [
  "default",
  "withHeader",
  "withAction",
  "pressed",
  "list"
];
function vi({ children: e, className: t, id: a, style: i, ref: r, ...s }) {
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
const wi = [
  "default",
  "inSurface"
];
function yi({
  label: e,
  caption: t,
  onPress: a,
  children: i,
  className: r,
  id: s,
  style: o,
  ref: d,
  ...l
}) {
  const c = i == null, { isPressed: m, pressProps: u } = H({ onPress: () => a?.(), disabled: c }), p = !c && a !== void 0, g = ["mds-section", r].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("section", { ref: d, id: s, style: o, className: g, ...l, children: [
    /* @__PURE__ */ h("header", { className: "mds-section-header", children: [
      /* @__PURE__ */ n("h2", { className: "mds-section-title mds-type-title-section", children: e }),
      t !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-section-count", children: t }) : null,
      p ? /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: ["mds-section-see-all", m ? "mds-section-see-all--pressed" : ""].filter(Boolean).join(" "),
          "data-ds-exempt": "",
          ...u,
          children: [
            /* @__PURE__ */ n("span", { className: "mds-section-see-all-label", children: A("button.all") }),
            /* @__PURE__ */ n(rt, { size: 16, className: "mds-section-see-all-icon" })
          ]
        }
      ) : null
    ] }),
    i
  ] });
}
const Ai = [
  "default",
  "withCount",
  "withSeeAll",
  "empty"
], q = 80, G = W.size["sparkline-height"], fe = W.size["dot-signal"] / 2, Rn = W.border["signal-line"], E = fe + Rn / 2;
function Dn(e) {
  const t = e.length, a = Math.min(...e), r = Math.max(...e) - a, s = (l) => t === 1 ? q - E : E + l / (t - 1) * (q - 2 * E), o = (l) => r === 0 ? G / 2 : E + (1 - (l - a) / r) * (G - 2 * E);
  return { points: e.map((l, c) => `${s(c).toFixed(2)},${o(l).toFixed(2)}`).join(" "), endX: s(t - 1), endY: o(e[t - 1]) };
}
function be({ values: e, lineClassName: t, dotClassName: a, hidden: i = !1 }) {
  const r = !i && e.length >= 1 ? Dn(e) : null;
  return /* @__PURE__ */ h("svg", { viewBox: `0 0 ${q} ${G}`, width: q, height: G, focusable: "false", children: [
    r && e.length >= 2 ? /* @__PURE__ */ n("polyline", { className: t, points: r.points }) : null,
    r ? /* @__PURE__ */ n("circle", { className: a, cx: r.endX, cy: r.endY, r: fe }) : null
  ] });
}
function Ni({
  leading: e,
  label: t,
  state: a = !1,
  caption: i,
  value: r,
  trailing: s,
  draft: o,
  tone: d = "start",
  onPress: l,
  disabled: c = !1,
  className: m,
  id: u,
  style: p,
  ref: g,
  ...f
}) {
  const { isPressed: b, pressProps: x } = H({ onPress: () => l?.(), disabled: c }), { hidden: v } = P(), Z = r === void 0 ? y.missingGlyph : v && o !== void 0 ? y.hiddenGlyph : r, V = [
    "mds-tile",
    `mds-tile--${d}`,
    b ? "mds-tile--pressed" : "",
    c ? "mds-tile--disabled" : "",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: g,
      id: u,
      style: p,
      type: "button",
      className: V,
      disabled: c,
      "data-ds-exempt": c ? void 0 : "",
      ...x,
      ...f,
      children: [
        /* @__PURE__ */ h("span", { className: "mds-tile-header", children: [
          e ? /* @__PURE__ */ n("span", { className: "mds-tile-header-icon", "aria-hidden": "true", children: e }) : null,
          /* @__PURE__ */ n("span", { className: "mds-tile-header-label mds-type-label", children: t }),
          a ? /* @__PURE__ */ n("span", { className: "mds-tile-dot", role: "img", "aria-label": i ?? "" }) : null
        ] }),
        /* @__PURE__ */ h("span", { className: "mds-tile-content", children: [
          o ? /* @__PURE__ */ n("span", { className: "mds-tile-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ n(
            be,
            {
              values: o,
              hidden: v,
              lineClassName: "mds-tile-sparkline-line",
              dotClassName: "mds-tile-sparkline-dot"
            }
          ) }) : null,
          /* @__PURE__ */ n("span", { className: "mds-tile-value", children: /* @__PURE__ */ n("bdi", { dir: "ltr", children: Z }) }),
          s ? /* @__PURE__ */ n("span", { className: "mds-tile-line mds-type-caption", children: s }) : null
        ] })
      ]
    }
  );
}
const Hi = [
  "default",
  "withDot",
  "withSparkline",
  "pressed",
  "focused",
  "disabled"
];
function On(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function Yn({ value: e }) {
  const { hidden: t } = P(), i = e === void 0 ? y.missingGlyph : t ? y.hiddenGlyph : null, { whole: r, cents: s } = On(e ?? y.missingGlyph), d = (e ?? "").length > 9 ? "mds-hero-value--lg mds-number-lg" : "mds-hero-value--hero mds-type-display-hero";
  return /* @__PURE__ */ n("span", { className: `mds-hero-value ${d}`, children: /* @__PURE__ */ n("bdi", { dir: "ltr", children: i !== null ? /* @__PURE__ */ n("span", { className: "mds-hero-value-glyph", children: i }) : /* @__PURE__ */ h($, { children: [
    /* @__PURE__ */ n("span", { className: "mds-hero-value-whole", children: r }),
    s ? /* @__PURE__ */ n("span", { className: "mds-hero-value-cents", children: s }) : null
  ] }) }) });
}
function _n({ values: e }) {
  const { hidden: t } = P();
  return /* @__PURE__ */ n("span", { className: "mds-hero-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ n(
    be,
    {
      values: e,
      hidden: t,
      lineClassName: "mds-hero-sparkline-line",
      dotClassName: "mds-hero-sparkline-dot"
    }
  ) });
}
function Bi({
  label: e,
  value: t,
  trailing: a,
  direction: i,
  debt: r,
  draft: s,
  onDismiss: o,
  onChange: d,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...p
}) {
  const { isPressed: g, pressProps: f } = H({ onPress: () => o?.() }), { hidden: b } = P(), x = b && t !== void 0, v = ["mds-hero-surface", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("section", { ref: u, id: c, style: m, className: v, ...p, children: [
    /* @__PURE__ */ h("header", { className: "mds-hero-header", children: [
      /* @__PURE__ */ n("span", { className: "mds-hero-label", children: e }),
      /* @__PURE__ */ n(Sn, { className: "mds-hero-toggle", onChange: d })
    ] }),
    /* @__PURE__ */ h("p", { className: "mds-hero-amount", children: [
      /* @__PURE__ */ h("span", { className: "mds-hero-visual", "aria-hidden": x || void 0, children: [
        /* @__PURE__ */ n(Yn, { value: t }),
        a && t !== void 0 ? /* @__PURE__ */ n("span", { className: "mds-hero-unit", children: a }) : null
      ] }, x ? "hidden" : "shown"),
      x ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: y.hidden }) : null
    ] }),
    i ? /* @__PURE__ */ n("p", { className: "mds-hero-diff", children: i }) : null,
    s ? /* @__PURE__ */ n(_n, { values: s }) : null,
    r ? /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: ["mds-hero-source", g ? "mds-hero-source--pressed" : ""].filter(Boolean).join(" "),
        "data-ds-exempt": "",
        ...f,
        children: r
      }
    ) : null
  ] });
}
const Si = [
  "default",
  "withCents",
  "missing",
  "longNumber",
  "noDiff",
  "withSparkline"
];
function ce(e) {
  return e != null && typeof e != "string";
}
function Zi({
  leading: e,
  tone: t,
  label: a,
  caption: i,
  value: r,
  trailing: s,
  onPress: o,
  disabled: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...p
}) {
  const { isPressed: g, pressProps: f } = H({ onPress: () => o?.(), disabled: d }), b = o !== void 0, x = [
    "mds-object-row",
    ce(e) ? "mds-object-row--icon" : "",
    g ? "mds-object-row--pressed" : "",
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
      className: x,
      disabled: b ? d : void 0,
      ...b ? f : {},
      ...p,
      children: [
        ce(e) ? (
          /* ت4 (1.7): a NON-entity row (an action, a setting) starts with its
             icon 20 in text-secondary — no 44 mark box, a row-plain height. */
          /* @__PURE__ */ n("span", { className: "mds-object-row-icon", "aria-hidden": "true", children: e })
        ) : /* @__PURE__ */ n(D, { size: "md", tone: t, value: typeof e == "string" ? e : a }),
        /* @__PURE__ */ h("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-object-row-title mds-type-body-strong", children: a }),
          i ? /* @__PURE__ */ n("span", { className: "mds-object-row-caption mds-type-caption", children: i }) : null
        ] }),
        r !== void 0 || s ? /* @__PURE__ */ h("span", { className: "mds-object-row-end", children: [
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
const Mi = [
  "default",
  "oneLine",
  "withBadge",
  "pressed",
  "focused",
  "disabled"
];
function Ci({
  leading: e,
  tone: t,
  label: a,
  caption: i,
  value: r,
  state: s,
  href: o,
  children: d,
  onPress: l,
  disabled: c = !1,
  className: m,
  id: u,
  style: p,
  ref: g,
  ...f
}) {
  const { isPressed: b, pressProps: x } = H({ onPress: () => l?.(), disabled: c }), v = l !== void 0 || o !== void 0, B = d != null, Z = o ? "a" : v ? "button" : "div", V = [
    "mds-object-card",
    b ? "mds-object-card--pressed" : "",
    c ? "mds-object-card--disabled" : "",
    B ? "mds-object-card--with-action" : "",
    v ? "" : "mds-object-card--passive",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("div", { ref: g, id: u, style: p, className: ["mds-object-card-wrap", c ? "mds-object-card-wrap--disabled" : "", m].filter(Boolean).join(" "), ...f, children: [
    /* @__PURE__ */ h(
      Z,
      {
        className: V,
        href: o,
        type: Z === "button" ? "button" : void 0,
        disabled: Z === "button" ? c : void 0,
        ...v ? x : {},
        children: [
          /* @__PURE__ */ h("span", { className: "mds-object-card-mark", children: [
            /* @__PURE__ */ n(D, { size: "lg", tone: t, value: typeof e == "string" ? e : a, children: typeof e == "string" ? void 0 : e }),
            s ? /* @__PURE__ */ n("span", { className: "mds-object-card-state", children: s }) : null
          ] }),
          /* @__PURE__ */ h("span", { className: "mds-object-card-body", children: [
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
    B ? /* @__PURE__ */ n("span", { className: "mds-object-card-action", children: d }) : null
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
function qn(e) {
  const t = e.indexOf(".");
  return t === -1 ? { whole: e, cents: "" } : { whole: e.slice(0, t), cents: e.slice(t) };
}
function Gn({
  label: e,
  size: t = "lg",
  value: a,
  trailing: i,
  direction: r,
  debt: s,
  onDismiss: o,
  loading: d = !1,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...p
}) {
  const { isPressed: g, pressProps: f } = H({ onPress: () => o?.() }), { hidden: b } = P(), x = b && a !== void 0 && a !== null && !d, { whole: v, cents: B } = qn(x ? "—" : a ?? "—"), Z = ["mds-metric", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("div", { ref: u, id: c, style: m, className: Z, ...p, children: [
    /* @__PURE__ */ n("span", { className: "mds-metric-label mds-type-label", children: e }),
    /* @__PURE__ */ n("p", { className: "mds-metric-amount", children: d ? /* @__PURE__ */ n("span", { className: "mds-metric-skeleton", "aria-busy": "true" }) : x ? /* @__PURE__ */ h($, { children: [
      /* @__PURE__ */ h(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero mds-metric-value--hidden",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          "data-ds-check": "amount-hidden",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ n("bdi", { dir: "ltr", children: /* @__PURE__ */ n("span", { className: "mds-metric-value-whole", children: y.hiddenGlyph }) }),
            i ? /* @__PURE__ */ n("span", { className: "mds-metric-unit", children: i }) : null
          ]
        }
      ),
      /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: y.hidden })
    ] }) : /* @__PURE__ */ h($, { children: [
      /* @__PURE__ */ n(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero",
            t === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          children: /* @__PURE__ */ h("bdi", { dir: "ltr", children: [
            /* @__PURE__ */ n("span", { className: "mds-metric-value-whole", children: v }),
            B ? /* @__PURE__ */ n("span", { className: "mds-metric-value-cents", children: B }) : null
          ] })
        }
      ),
      i ? /* @__PURE__ */ n("span", { className: "mds-metric-unit", children: i }) : null
    ] }) }),
    r && !d ? /* @__PURE__ */ n("p", { className: "mds-metric-diff", children: r }) : null,
    s && !d ? /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: ["mds-metric-source", g ? "mds-metric-source--pressed" : ""].filter(Boolean).join(" "),
        "data-ds-exempt": "",
        ...f,
        children: s
      }
    ) : null
  ] });
}
const Pi = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function Ti({ size: e, ...t }) {
  return /* @__PURE__ */ n(Gn, { ...t, size: "sm", className: ["mds-metric-small", t.className].filter(Boolean).join(" ") });
}
const Vi = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
], K = /* @__PURE__ */ new Set();
function Wn({
  label: e,
  variant: t = "detail",
  children: a,
  onDismiss: i,
  className: r,
  id: s,
  style: o,
  ref: d,
  ...l
}) {
  const c = S(null), [m, u] = j(0), [p, g] = j(!1), [f, b] = j(!1), x = S(0), v = S(0), B = S(0), Z = S(null), V = S(i);
  I(() => {
    V.current = i;
  }, [i]);
  const O = C(() => {
    Z.current?.focus?.(), V.current();
  }, []), [Q] = j(() => /* @__PURE__ */ Symbol("sheet")), [ie] = j(() => (K.add(Q), K.size >= 2 ? 2 : 1));
  I(
    () => () => {
      K.delete(Q);
    },
    [Q]
  );
  const xe = () => {
    const w = c.current?.querySelector(".mds-sheet-panel");
    return w ? w.getBoundingClientRect().height * 0.3 : 0;
  }, L = C(() => {
    if (f) return;
    Z.current = document.activeElement ?? null, b(!0), (typeof requestAnimationFrame == "function" ? requestAnimationFrame : (N) => setTimeout(() => N(performance.now()), 0))(() => {
      const N = c.current?.querySelector(".mds-sheet-panel");
      if (!N) {
        O();
        return;
      }
      const M = getComputedStyle(N).transitionDuration, oe = M && M !== "0s" && M !== "";
      if (N.style.transform = "translateY(100%)", !oe) {
        O();
        return;
      }
      const F = (ye) => {
        ye.propertyName === "transform" && (N.removeEventListener("transitionend", F), O());
      };
      N.addEventListener("transitionend", F);
    });
  }, [f, O]), ke = (w) => {
    if (!p) return;
    const N = performance.now(), M = N - B.current;
    M > 0 && (x.current = (w.clientY - v.current) / M), v.current = w.clientY, B.current = N, u(Math.max(0, w.clientY - re.current));
  }, re = S(0), ve = (w) => {
    const N = w.target, M = c.current?.querySelector(".mds-sheet-body");
    if (!(M?.contains(N) && M && M.scrollTop > 0)) {
      if (f) {
        const F = c.current?.querySelector(".mds-sheet-panel");
        F && (F.style.transform = m ? `translateY(${m}px)` : ""), b(!1);
      }
      x.current = 0, v.current = w.clientY, B.current = performance.now(), g(!0), w.currentTarget.setPointerCapture?.(w.pointerId);
    }
  }, se = () => {
    if (!p) return;
    g(!1);
    const w = m > xe(), N = x.current > 0.6;
    w || N ? L() : u(0);
  };
  I(() => {
    const w = (N) => {
      N.key === "Escape" && L();
    };
    return window.addEventListener("keydown", w), () => window.removeEventListener("keydown", w);
  }, [L]);
  const we = [
    "mds-sheet",
    t === "form" ? "mds-sheet--form" : "",
    ie === 2 ? "mds-sheet--stacked" : "",
    p ? "mds-sheet--dragging" : "",
    f ? "mds-sheet--closing" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "div",
    {
      ref: (w) => {
        c.current = w, typeof d == "function" ? d(w) : d && (d.current = w);
      },
      id: s,
      style: o,
      className: we,
      "data-ds-sheet-level": String(ie),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": e,
      ...l,
      children: [
        /* @__PURE__ */ n(
          "div",
          {
            className: "mds-sheet-scrim",
            onClick: () => L(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ h(
          "div",
          {
            className: "mds-sheet-panel",
            style: m ? { transform: `translateY(${m}px)` } : void 0,
            children: [
              /* @__PURE__ */ h(
                "div",
                {
                  className: "mds-sheet-grab",
                  onPointerDown: (w) => {
                    re.current = w.clientY - m, ve(w);
                  },
                  onPointerMove: ke,
                  onPointerUp: se,
                  onPointerCancel: se,
                  children: [
                    /* @__PURE__ */ n("span", { className: "mds-sheet-handle", "aria-hidden": "true" }),
                    /* @__PURE__ */ n("header", { className: "mds-sheet-header", children: /* @__PURE__ */ n("h2", { className: "mds-sheet-title mds-type-title-section", children: e }) })
                  ]
                }
              ),
              /* @__PURE__ */ n("div", { className: "mds-sheet-close", children: /* @__PURE__ */ n(Ln, { label: e, onPress: L, children: /* @__PURE__ */ n(lt, {}) }) }),
              /* @__PURE__ */ n("div", { className: "mds-sheet-body", children: a })
            ]
          }
        )
      ]
    }
  );
}
const Ii = [
  "default",
  "open",
  "dragging",
  "pastThreshold",
  "stacked"
];
function $i({
  label: e,
  caption: t,
  value: a,
  onPress: i,
  onDismiss: r,
  className: s,
  id: o,
  style: d,
  ref: l,
  ...c
}) {
  const m = S(null);
  return I(() => {
    m.current?.focus();
  }, []), /* @__PURE__ */ n(
    "div",
    {
      ref: l,
      id: o,
      style: d,
      className: ["mds-confirm-sheet", s].filter(Boolean).join(" "),
      ...c,
      children: /* @__PURE__ */ h(
        Wn,
        {
          label: e,
          onDismiss: r,
          className: "mds-confirm-sheet__sheet",
          role: "alertdialog",
          "data-ds-check": "confirm-sheet",
          children: [
            /* @__PURE__ */ h("div", { className: "mds-confirm-sheet-head", children: [
              /* @__PURE__ */ n("span", { className: "mds-confirm-sheet-icon", children: /* @__PURE__ */ n(Rt, {}) }),
              /* @__PURE__ */ n("h2", { className: "mds-confirm-sheet-title mds-type-title-section", children: e }),
              /* @__PURE__ */ n("p", { className: "mds-confirm-sheet-sentence", children: t })
            ] }),
            /* @__PURE__ */ h("div", { className: "mds-confirm-sheet-actions", children: [
              /* @__PURE__ */ n(
                _,
                {
                  ref: m,
                  variant: "secondary",
                  className: "mds-confirm-sheet-back",
                  onPress: r,
                  children: k["button.back"].text
                }
              ),
              /* @__PURE__ */ n(_, { variant: "danger", className: "mds-confirm-sheet-confirm", onPress: i, children: a })
            ] })
          ]
        }
      )
    }
  );
}
const Li = [
  "default",
  "focused",
  "pressed"
];
function Fi({
  label: e,
  onPress: t,
  loading: a = !1,
  disabled: i = !1,
  caption: r,
  onRetry: s,
  leading: o = !0,
  trailing: d,
  className: l,
  id: c,
  style: m,
  ref: u,
  ...p
}) {
  const g = Oe(), f = g.keyboardHeight > 0 ? {
    bottom: `calc(${g.keyboardHeight}px + env(safe-area-inset-bottom))`
  } : void 0, b = ["mds-action-bar", o ? "mds-action-bar--more" : "", l].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "div",
    {
      ref: u,
      id: c,
      style: { ...f, ...m },
      className: b,
      role: "group",
      "aria-label": e,
      ...p,
      children: [
        r ? /* @__PURE__ */ n(_, { variant: "text", onPress: s, className: "mds-action-bar-secondary", children: r }) : null,
        /* @__PURE__ */ n(
          _,
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
const Ei = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "loading",
  "contentMore",
  "scrolledToEnd",
  "keyboardOpen"
];
function Ri({
  selected: e = !1,
  onPress: t,
  onLongPress: a,
  className: i,
  id: r,
  style: s,
  ref: o,
  ...d
}) {
  const { isPressed: l, pressProps: c } = H({ onPress: t, onLongPress: a }), m = e ? k["sr.askUnread"].text : k["sr.ask"].text, u = ["mds-ask-button", l ? "mds-ask-button--pressed" : "", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: o,
      id: r,
      style: s,
      type: "button",
      className: u,
      "aria-label": m,
      ...d,
      ...c,
      children: [
        /* @__PURE__ */ n(qe, { size: 28 }),
        e ? /* @__PURE__ */ n("span", { className: "mds-ask-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const Di = [
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
  className: i,
  id: r,
  style: s,
  ref: o,
  ...d
}) {
  const { isPressed: l, pressProps: c } = H({ onPress: a }), m = je(e, Me.unread), u = t ?? (e > 0 ? A("sr.notificationsCount", { counted: m }) : A("sr.notifications")), p = [
    "mds-notifications-button",
    l ? "mds-notifications-button--pressed" : "",
    e > 0 ? "mds-notifications-button--unread" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: o,
      id: r,
      style: s,
      type: "button",
      className: p,
      "aria-label": u,
      ...d,
      ...c,
      children: [
        /* @__PURE__ */ n(ze, {}),
        e > 0 ? /* @__PURE__ */ n("span", { className: "mds-notifications-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const Yi = [
  "default",
  "pressed",
  "focused",
  "unreadDot"
];
function _i({
  label: e,
  caption: t,
  locked: a = !1,
  onPress: i,
  className: r,
  id: s,
  style: o,
  ref: d,
  ...l
}) {
  const { isPressed: c, pressProps: m } = H({ onPress: i }), u = [
    "mds-project-switcher",
    c ? "mds-project-switcher--pressed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: d,
      id: s,
      style: o,
      type: "button",
      className: u,
      ...l,
      ...m,
      children: [
        /* @__PURE__ */ n(D, { size: "sm", variant: "canvas", value: e }),
        /* @__PURE__ */ h("span", { className: "mds-project-switcher-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-project-switcher-name mds-type-body-strong", children: e }),
          t ? /* @__PURE__ */ n("span", { className: "mds-project-switcher-role", children: t }) : null
        ] }),
        a ? null : /* @__PURE__ */ n(ot, { className: "mds-project-switcher-caret" })
      ]
    }
  );
}
const qi = [
  "default",
  "pressed",
  "focused",
  "withCaret",
  "singleRoleNoCaret"
];
function Gi({
  leading: e,
  trailing: t,
  caption: a = !1,
  label: i,
  className: r,
  id: s,
  style: o,
  ref: d,
  children: l,
  ...c
}) {
  const m = [
    "mds-context-bar",
    a ? "mds-context-bar--scrolled" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "div",
    {
      ref: d,
      id: s,
      style: o,
      className: m,
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
const Wi = [
  "default",
  "mainScreenSwitcher",
  "subScreenBack",
  "scrolledHairline",
  "notScrolled"
];
function Qi({
  label: e,
  selected: t = !1,
  leading: a,
  onPress: i,
  className: r,
  ref: s,
  ...o
}) {
  const { isPressed: d, pressProps: l } = H({ onPress: i }), c = [
    "mds-tab",
    t ? "mds-tab--active" : "",
    d ? "mds-tab--pressed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
    "button",
    {
      ref: s,
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
function Ui({
  children: e,
  value: t,
  onChange: a,
  className: i,
  id: r,
  style: s,
  ref: o,
  ...d
}) {
  const l = He.toArray(e), c = l.some(
    (u) => u && typeof u == "object" && "props" in u && u.props.selected !== void 0
  ), m = t ?? 0;
  return /* @__PURE__ */ n(
    "div",
    {
      ref: o,
      id: r,
      style: s,
      className: ["mds-tab-bar", i].filter(Boolean).join(" "),
      role: "tablist",
      ...d,
      children: l.map((u, p) => {
        if (u && typeof u == "object" && "props" in u) {
          const g = u.props, f = c ? g.selected === !0 : p === m;
          return {
            ...u,
            props: { ...g, selected: f, onPress: () => {
              g.onPress?.(), a?.(p);
            } }
          };
        }
        return u;
      })
    }
  );
}
const Xi = [
  "default",
  "activeFill",
  "pressed",
  "focused",
  "fiveTabs",
  "twoTabs"
];
function Ki({
  label: e,
  leading: t,
  caption: a = !1,
  trailing: i,
  className: r,
  id: s,
  style: o,
  ref: d,
  ...l
}) {
  const c = [
    "mds-page-header",
    a && t ? "mds-page-header--collapsed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h("header", { ref: d, id: s, style: o, className: c, ...l, children: [
    t,
    /* @__PURE__ */ n("h1", { className: "mds-page-header-title", children: e }),
    i ? /* @__PURE__ */ n("div", { className: "mds-page-header-end", children: i }) : null
  ] });
}
const zi = [
  "default",
  "mainScreen",
  "subScreenBack",
  "collapsedOnScroll",
  "withTrailing"
], Qn = {
  draft: A("saveState.draft"),
  sending: A("saveState.sending"),
  saved: A("saveState.saved"),
  failed: A("saveState.failed")
};
function Ji({
  saveState: e,
  className: t,
  id: a,
  style: i,
  ref: r,
  ...s
}) {
  const o = [
    "mds-save-state",
    `mds-save-state--${e}`,
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(
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
        e === "draft" ? /* @__PURE__ */ n(Bt, { size: 14 }) : e === "saved" ? /* @__PURE__ */ n("span", { className: "mds-save-state-icon", children: /* @__PURE__ */ n(pe, { size: 14 }) }) : e === "failed" ? /* @__PURE__ */ n(ae, { size: 14 }) : null,
        /* @__PURE__ */ n("span", { className: "mds-save-state-text", children: Qn[e] }),
        e === "saved" ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: A("sr.saveSaved") }) : null,
        e === "failed" ? /* @__PURE__ */ n("span", { className: "mds-visually-hidden", children: A("sr.saveFailed") }) : null
      ]
    }
  );
}
const er = [
  "draft",
  "sending",
  "saved",
  "failed"
];
function tr({
  label: e,
  trailing: t,
  onDismiss: a,
  className: i,
  id: r,
  style: s,
  ref: o,
  ...d
}) {
  const l = S(null), c = S(0), m = S(0), u = t ? 5e3 : 3e3;
  I(() => (c.current = u, m.current = Date.now(), l.current = window.setTimeout(() => a?.(), u), () => {
    l.current && window.clearTimeout(l.current), l.current = null;
  }), [e, u]);
  const p = () => {
    l.current && (window.clearTimeout(l.current), l.current = null, c.current -= Date.now() - m.current);
  }, g = () => {
    l.current || (m.current = Date.now(), l.current = window.setTimeout(() => a?.(), Math.max(0, c.current)));
  };
  return /* @__PURE__ */ h(
    "div",
    {
      ref: o,
      id: r,
      style: s,
      className: ["mds-toast", i].filter(Boolean).join(" "),
      role: "status",
      onFocus: p,
      onBlur: g,
      ...d,
      children: [
        /* @__PURE__ */ n("span", { className: "mds-toast-text", children: e }),
        t ? /* @__PURE__ */ n("span", { className: "mds-toast-action", children: t }) : null
      ]
    }
  );
}
const nr = ["default", "withAction", "focusedPaused"], Un = {
  offline: Mt,
  locked: jt,
  info: Tt
};
function ar({
  tone: e,
  label: t,
  trailing: a,
  className: i,
  id: r,
  style: s,
  ref: o,
  ...d
}) {
  const l = Un[e];
  return /* @__PURE__ */ h(
    "div",
    {
      ref: o,
      id: r,
      style: s,
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
const ir = ["offline", "locked", "info", "withAction"];
function rr({
  label: e,
  trailing: t,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...o
}) {
  return /* @__PURE__ */ h(
    "div",
    {
      ref: s,
      id: i,
      style: r,
      className: ["mds-empty-state", a].filter(Boolean).join(" "),
      ...o,
      children: [
        /* @__PURE__ */ h("div", { className: "mds-empty-state-ghosts", "aria-hidden": "true", children: [
          /* @__PURE__ */ h("div", { className: "mds-empty-state-ghost", children: [
            /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-mark" }),
            /* @__PURE__ */ h("span", { className: "mds-empty-state-ghost-lines", children: [
              /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--body" }),
              /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-line mds-empty-state-ghost-line--caption" })
            ] })
          ] }),
          /* @__PURE__ */ h("div", { className: "mds-empty-state-ghost", children: [
            /* @__PURE__ */ n("span", { className: "mds-empty-state-ghost-mark" }),
            /* @__PURE__ */ h("span", { className: "mds-empty-state-ghost-lines", children: [
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
const sr = ["default", "withAction"];
function Y({
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
const or = ["body", "caption", "hero", "mark"];
function dr({
  label: e,
  caption: t,
  value: a,
  direction: i,
  draft: r = !1,
  time: s,
  onPress: o,
  onLongPress: d,
  state: l = "idle",
  disabled: c = !1,
  trailing: m,
  className: u,
  id: p,
  style: g,
  ref: f,
  ...b
}) {
  const { isPressed: x, pressProps: v } = H({ onPress: o, onLongPress: d, disabled: c });
  if (l === "loading")
    return /* @__PURE__ */ h("div", { className: "mds-movement-row mds-movement-row--loading", "aria-busy": "true", id: p, style: g, ref: f, children: [
      /* @__PURE__ */ n(D, { children: /* @__PURE__ */ n(Y, { variant: "mark" }) }),
      /* @__PURE__ */ h("span", { className: "mds-movement-row-text", children: [
        /* @__PURE__ */ n(Y, { variant: "body" }),
        /* @__PURE__ */ n(Y, { variant: "caption" })
      ] }),
      /* @__PURE__ */ n("span", { className: "mds-movement-row-end", children: /* @__PURE__ */ n(Y, { variant: "caption" }) })
    ] });
  const B = [
    "mds-movement-row",
    "mds-object-row",
    x ? "mds-object-row--pressed" : "",
    c ? "mds-object-row--disabled" : "",
    "mds-movement-row--" + i,
    u
  ].filter(Boolean).join(" "), Z = [
    i === "out" ? k["sr.movementRowOut"].text : k["sr.movementRowIn"].text,
    e,
    t,
    a == null ? "" : k["money.ariaMissing"].text,
    r ? k["state.draft"].text : s ?? ""
  ].filter(Boolean).join(k["sr.listSeparator"].text);
  return /* @__PURE__ */ h(
    "button",
    {
      ref: f,
      id: p,
      style: g,
      type: "button",
      className: B,
      disabled: c,
      "aria-label": Z,
      "data-ds-check": "movement-row",
      ...v,
      ...b,
      children: [
        /* @__PURE__ */ n(D, { children: i === "in" ? /* @__PURE__ */ n(cn, { size: 24 }) : /* @__PURE__ */ n(un, { size: 24 }) }),
        /* @__PURE__ */ h("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ n("span", { className: "mds-object-row-title mds-type-body-strong", children: e }),
          t ? /* @__PURE__ */ n("span", { className: "mds-object-row-caption mds-type-caption", children: t }) : null
        ] }),
        /* @__PURE__ */ h("span", { className: "mds-object-row-end", children: [
          /* @__PURE__ */ n("span", { className: "mds-object-row-value mds-type-amount-row", children: /* @__PURE__ */ n(Bn, { value: a, flow: i }) }),
          /* @__PURE__ */ n("span", { className: "mds-object-row-time mds-type-caption", children: r ? /* @__PURE__ */ n(Vn, { tone: "waiting", label: k["state.draft"].text }) : m ?? s })
        ] })
      ]
    }
  );
}
const lr = [
  "in",
  "out",
  "draft",
  "hidden",
  "loading"
];
function me(e) {
  if (e == null) return null;
  const t = String(e).replace(/[^0-9.]/g, "");
  if (!t || t === ".") return null;
  const a = Number(t);
  return Number.isFinite(a) ? Math.round(a * 1e3) : null;
}
function cr({
  value: e,
  total: t,
  state: a = "idle",
  className: i,
  id: r,
  style: s,
  ref: o,
  ...d
}) {
  const { hidden: l } = P(), c = l && a !== "loading", m = a === "loading", u = me(e), p = me(t), g = p !== null && p > 0 && u !== null && u >= 0, f = g ? Math.min(u, p) : 0, b = g ? p : 1, x = Math.round(f / b * 1e3) / 10, v = Math.max(b - f, 0), B = [
    "mds-payment-progress",
    c ? "mds-payment-progress--hidden" : "",
    m ? "mds-payment-progress--loading" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ n(
    "div",
    {
      ref: o,
      id: r,
      style: s,
      className: B,
      role: c || m ? void 0 : "progressbar",
      "aria-label": A("sr.debtProgress", {
        paid: T(e, { texts: y }).aria,
        total: T(t, { texts: y }).aria
      }),
      "aria-valuenow": c || m ? void 0 : x,
      "aria-valuemin": c || m ? void 0 : 0,
      "aria-valuemax": c || m ? void 0 : 100,
      "aria-busy": m || void 0,
      ...d,
      children: c ? /* @__PURE__ */ n("span", { className: "mds-payment-progress-hidden mds-type-caption", children: y.hidden }) : /* @__PURE__ */ h($, { children: [
        /* @__PURE__ */ n("span", { className: "mds-payment-progress-track", children: /* @__PURE__ */ n(
          "span",
          {
            className: "mds-payment-progress-fill",
            style: { "--mds-payment-progress-share": `${x}%` }
          }
        ) }),
        /* @__PURE__ */ h("span", { className: "mds-payment-progress-line", children: [
          A("payment.paid"),
          " ",
          /* @__PURE__ */ n("bdi", { dir: "ltr", children: T(f / 1e3, { texts: y }).display }),
          " · ",
          A("payment.remaining"),
          " ",
          /* @__PURE__ */ n("bdi", { dir: "ltr", children: T(v / 1e3, { texts: y }).display })
        ] })
      ] })
    }
  );
}
const mr = [
  "partial",
  "zero",
  "complete",
  "hidden"
];
export {
  Fi as ActionBar,
  Ei as ActionBarStates,
  si as AmountField,
  oi as AmountFieldStates,
  Jn as AmountVisibilityProvider,
  Sn as AmountVisibilityToggle,
  Ua as AmountVisibilityToggleStates,
  nt as AmountsHiddenIcon,
  et as AmountsShownIcon,
  wa as AppointmentIcon,
  Ri as AskButton,
  Di as AskButtonStates,
  qe as AskSymbolIcon,
  da as BackIcon,
  Ha as BackspaceIcon,
  _ as Button,
  ci as ButtonStates,
  Za as CalendarIcon,
  Ca as CameraIcon,
  Ea as ChartIcon,
  Xa as Checkbox,
  Ka as CheckboxStates,
  gt as ClearIcon,
  Ma as ClockIcon,
  lt as CloseIcon,
  $i as ConfirmSheet,
  Li as ConfirmSheetStates,
  Gi as ContextBar,
  Wi as ContextBarStates,
  Rt as DangerIcon,
  ba as DebtIcon,
  ca as DeltaDownIcon,
  la as DeltaUpIcon,
  Bt as DraftIcon,
  rr as EmptyState,
  sr as EmptyStateStates,
  $t as EntityApprovedIcon,
  D as EntityMark,
  li as EntityMarkStates,
  Ft as EntityPendingIcon,
  ot as ExpandIcon,
  ft as FieldErrorIcon,
  Oa as FileIcon,
  fi as FilterChips,
  bi as FilterChipsStates,
  rt as ForwardIcon,
  ga as FundBankIcon,
  ha as FundCashIcon,
  pa as FundWalletIcon,
  Bi as HeroSurface,
  Si as HeroSurfaceStates,
  Ln as IconButton,
  mi as IconButtonStates,
  Tt as InfoIcon,
  ar as InlineBanner,
  ir as InlineBannerStates,
  ka as JobFailedIcon,
  Ee as LONG_PRESS_MS,
  ea as LayersProvider,
  Ya as LinkIcon,
  jt as LockedIcon,
  $a as MapPinIcon,
  Gn as Metric,
  Ti as MetricSmall,
  Vi as MetricSmallStates,
  Pi as MetricStates,
  ja as MicIcon,
  Sa as MinusIcon,
  Bn as Money,
  Qa as MoneyStates,
  ua as MoreIcon,
  cn as MovementInIcon,
  un as MovementOutIcon,
  dr as MovementRow,
  lr as MovementRowStates,
  sa as NavDeliveryIcon,
  ia as NavFinanceIcon,
  oa as NavMarketIcon,
  ra as NavOrdersIcon,
  aa as NavTodayIcon,
  _a as NoteIcon,
  Oi as NotificationsButton,
  Yi as NotificationsButtonStates,
  ze as NotificationsIcon,
  Ci as ObjectCard,
  ji as ObjectCardStates,
  Zi as ObjectRow,
  Mi as ObjectRowStates,
  Mt as OfflineIcon,
  va as OrderIcon,
  Ki as PageHeader,
  zi as PageHeaderStates,
  Ga as PauseIcon,
  cr as PaymentProgress,
  mr as PaymentProgressStates,
  Va as PhoneIcon,
  Ba as PlusIcon,
  ya as PriceTierIcon,
  _i as ProjectSwitcher,
  qi as ProjectSwitcherStates,
  xa as QuoteIcon,
  Wa as RTL_FLIP_ICONS,
  za as Radio,
  Ja as RadioStates,
  Na as ReportIcon,
  ma as RetryIcon,
  Aa as ReviewIcon,
  Ji as SaveState,
  er as SaveStateStates,
  ni as SearchField,
  ai as SearchFieldStates,
  ut as SearchIcon,
  yi as Section,
  Ai as SectionStates,
  gi as SegmentedControl,
  pi as SegmentedControlStates,
  ne as SelectedIcon,
  La as SendIcon,
  Wn as Sheet,
  Ii as SheetStates,
  Y as Skeleton,
  or as SkeletonStates,
  qa as SlidersIcon,
  Vn as StatusBadge,
  di as StatusBadgeStates,
  Pa as StopIcon,
  xi as Surface,
  ki as SurfaceStates,
  Ui as TabBar,
  Xi as TabBarStates,
  Qi as TabBarTab,
  Fa as TableIcon,
  ii as TextArea,
  ri as TextAreaStates,
  ui as TextField,
  hi as TextFieldStates,
  Ni as Tile,
  Hi as TileStates,
  tr as Toast,
  nr as ToastStates,
  ei as Toggle,
  ti as ToggleStates,
  pe as ToneDoneIcon,
  Nt as ToneInfoIcon,
  ae as ToneProblemIcon,
  wt as ToneWaitingIcon,
  fa as TransferIcon,
  Ta as TrashIcon,
  vi as Well,
  wi as WellStates,
  Ia as WhatsappIcon,
  Ra as ZoomInIcon,
  Da as ZoomOutIcon,
  k as ar,
  Ze as arBase,
  T as formatMoney,
  zn as formatTime12,
  Be as getToken,
  y as moneyTexts,
  jn as normalizeAmount,
  je as pluralAr,
  Me as pluralNouns,
  A as t,
  W as tokens,
  P as useAmountVisibility,
  na as useOpenSheetCount,
  H as usePress,
  ta as useSheetLayer,
  Oe as useVisualViewport
};
