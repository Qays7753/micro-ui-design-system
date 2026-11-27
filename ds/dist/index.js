import { jsx as e, jsxs as o, Fragment as P } from "react/jsx-runtime";
import { useMemo as ae, useContext as ie, createContext as ve, useState as E, useRef as Z, useCallback as D, useEffect as q, useReducer as Te, useId as re, useLayoutEffect as Ve, Children as $e } from "react";
const O = {
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
function Ie(t) {
  let n = O;
  for (const a of t.split("."))
    n = n[a];
  return n;
}
const Le = {
  // ---------------------------------------------------------------- B1 finance
  "fund.lastMovement": { kind: "badge", text: "آخر حركة:" },
  "fund.cashDrawer": { kind: "badge", text: "درج الكاش" },
  "fund.bankAccount": { kind: "badge", text: "الحساب البنكي" },
  "fund.walletName": { kind: "badge", text: "المحفظة" },
  "fund.balanceWord": { kind: "screen-reader", text: "الرصيد" },
  "fund.negativeBalance": { kind: "badge", text: "رصيد سالب" },
  "debt.forYou": { kind: "badge", text: "لك" },
  "debt.againstYou": { kind: "badge", text: "عليك" },
  "debt.dueOn": { kind: "help", text: "يستحق {date}" },
  "debt.overdue": { kind: "badge", text: "متأخر" },
  "debt.settled": { kind: "badge", text: "سُدّد" },
  "metric.weekIn": { kind: "title", text: "الداخل هذا الأسبوع" },
  "payment.paid": { kind: "badge", text: "دُفع" },
  "payment.remaining": { kind: "badge", text: "بقي" },
  "sr.listSeparator": { kind: "screen-reader", text: "، " },
  "sr.movementRowOut": { kind: "screen-reader", text: "خارج" },
  "sr.movementRowIn": { kind: "screen-reader", text: "داخل" },
  "transfer.arrow": { kind: "badge", text: "←" },
  "sr.transferFrom": { kind: "screen-reader", text: "تحويل من {from} إلى {to}" },
  "sr.fundHasDraft": { kind: "screen-reader", text: "فيه مسودة" },
  "sr.debtProgress": { kind: "screen-reader", text: "دُفع {paid} من {total}" },
  "title.funds": { kind: "title", text: "الصناديق" },
  "title.debts": { kind: "title", text: "الديون" },
  "state.negativeBalance": { kind: "badge", text: "رصيد سالب" },
  "state.opened": { kind: "badge", text: "فُتح:" },
  "state.pressed": { kind: "badge", text: "مرات الضغط:" },
  "lab.h.movementRow": { kind: "title", text: "صف حركة مالية" },
  "lab.h.transferRow": { kind: "title", text: "صف تحويل صندوقين" },
  "lab.h.fundCard": { kind: "title", text: "بطاقة صندوق ورصيده" },
  "lab.h.debtCard": { kind: "title", text: "بطاقة دين ودفعاته" },
  "lab.h.debtSummary": { kind: "title", text: "ملخص الديون" },
  "lab.h.paymentProgress": { kind: "title", text: "شريط تقدم السداد" },
  "lab.h.financeCompose": { kind: "title", text: "تركيب شاشة المالية" },
  // -------------------------------------------------- B2 orders & appointments
  "order.delivery": { kind: "badge", text: "التسليم" },
  "order.deliver": { kind: "button", text: "سلّم الطلب" },
  "order.duration": { kind: "badge", text: "موعد بمدة" },
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
  "sr.statusTrackStages": { kind: "screen-reader", text: "المراحل" },
  "sr.statusTrackStep": { kind: "screen-reader", text: "المرحلة {n} من {m}" },
  "sr.statusTrackOf": { kind: "screen-reader", text: "من {m}" },
  "sr.timelineItems": { kind: "screen-reader", text: "عناصر اليوم بالترتيب" },
  "sr.timelineNow": { kind: "screen-reader", text: "الآن" },
  "orders.listView": { kind: "badge", text: "القائمة" },
  "orders.calendarView": { kind: "badge", text: "التقويم" },
  "orders.all": { kind: "badge", text: "الكل" },
  "orders.active": { kind: "badge", text: "الجارية" },
  "orders.log": { kind: "badge", text: "السجل" },
  "state.selected": { kind: "badge", text: "المحدد:" },
  "lab.h.orderCard": { kind: "title", text: "بطاقة طلب" },
  "lab.h.weekStrip": { kind: "title", text: "شريط أيام الأسبوع" },
  "lab.h.dayTimeline": { kind: "title", text: "جدول اليوم بالساعات" },
  "lab.h.agendaList": { kind: "title", text: "قائمة عناصر بالأيام" },
  "lab.h.slotPicker": { kind: "title", text: "أوقات متاحة للاختيار" },
  "lab.h.ordersCompose": { kind: "title", text: "تركيب شاشة الطلبات" },
  // ---------------------------------------------------------------- B3 delivery
  "delivery.to": { kind: "badge", text: "إلى" },
  "delivery.fromWord": { kind: "badge", text: "من" },
  "delivery.from": { kind: "help", text: "من {area} · {desc}" },
  "delivery.reviewQuotes": { kind: "button", text: "راجع العروض" },
  "quote.offerFrom": { kind: "screen-reader", text: "عرض من {label}" },
  "quote.approved": { kind: "screen-reader", text: "معتمد" },
  "quote.resultSentence": { kind: "help", text: "بالقبول يبدأ السائق المهمة." },
  "quote.accept": { kind: "button", text: "اقبل العرض" },
  "quote.reject": { kind: "button", text: "ارفض" },
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
  "evidence.retake": { kind: "help", text: "أعد الالتقاط" },
  "evidence.photoMissing": { kind: "help", text: "لم تُلتقط بعد" },
  "evidence.photoTaken": { kind: "help", text: "صورة مُلتقطة" },
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
  "state.assigned": { kind: "badge", text: "سائق معيّن" },
  "state.driver": { kind: "badge", text: "السائق" },
  "state.stage": { kind: "badge", text: "المرحلة" },
  "visitor.locked": { kind: "badge", text: "زائر" },
  "delivery.requests": { kind: "badge", text: "الطلبات" },
  "delivery.driverView": { kind: "badge", text: "وضع السائق" },
  "lab.h.deliveryRequestCard": { kind: "title", text: "بطاقة طلب توصيل" },
  "lab.h.quoteCard": { kind: "title", text: "بطاقة عرض سعر" },
  "lab.h.statusTrack": { kind: "title", text: "مسار الحالة" },
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
}, Fe = {
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
}, b = { ...Fe, ...Le };
function j(t, n) {
  let a = b[t].text;
  if (n)
    for (const [i, r] of Object.entries(n))
      a = a.replaceAll(`{${i}}`, String(r));
  return a;
}
const Ee = {
  movements: { zero: "لا حركات", one: "حركة واحدة", two: "حركتين", few: "حركات", many: "حركة" },
  orders: { zero: "لا طلبات", one: "طلب واحد", two: "طلتان", few: "طلبات", many: "طلب" },
  quotes: { zero: "لا عروض", one: "عرض واحد", two: "عرضان", few: "عروض", many: "عرض" },
  results: { zero: "لا نتائج", one: "نتيجة واحدة", two: "نتيجتان", few: "نتائج", many: "نتيجة" },
  unread: { zero: "لا شيء غير مقروء", one: "غير مقروء واحد", two: "غير مقروءان", few: "غير مقروءة", many: "غير مقروءة" }
}, S = {
  unit: b["money.unit"].text,
  minus: b["money.ariaMinus"].text,
  dinar: b["money.ariaDinar"].text,
  fils: b["money.ariaFils"].text,
  and: b["money.ariaAnd"].text,
  forYou: b["money.forYou"].text,
  againstYou: b["money.againstYou"].text,
  hidden: b["money.ariaHidden"].text,
  missing: b["money.ariaMissing"].text,
  hiddenGlyph: b["money.hiddenGlyph"].text,
  missingGlyph: b["money.missing"].text
}, De = new Intl.PluralRules("ar");
function Re(t, n) {
  switch (De.select(t)) {
    case "zero":
      return n.zero;
    case "one":
      return n.one;
    case "two":
      return n.two;
    case "few":
      return `${t} ${n.few}`;
    case "many":
      return `${t} ${n.many}`;
    default:
      return `${t} ${n.many}`;
  }
}
const qe = "ص", Oe = "م";
function pe(t) {
  return `${t < 10 ? "0" : ""}${t}`;
}
function Ye(t) {
  return t instanceof Date ? { h: t.getHours(), m: t.getMinutes() } : t;
}
function _e(t) {
  const { h: n, m: a } = Ye(t), i = n < 12 ? qe : Oe, r = n % 12 === 0 ? 12 : n % 12;
  return `${pe(r)}:${pe(a)} ${i}`;
}
const X = "−", We = "+", G = 3;
function ze(t) {
  const n = String(t).trim(), a = n.startsWith("-"), i = a ? n.slice(1) : n, [r = "0", s = ""] = i.split("."), d = r.replace(/[^0-9]/g, "") || "0", l = (s + "000").slice(0, G), m = BigInt(d) * 10n ** BigInt(G) + BigInt(l || "0");
  return { negative: a, fils: m };
}
function Ge(t) {
  return t.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function Qe(t) {
  const n = 10n ** BigInt(G), a = t / n, i = t % n;
  return {
    int: Ge(a.toString()),
    frac: i === 0n ? "" : `.${i.toString().padStart(G, "0")}`
  };
}
function K(t, n) {
  const a = 10n ** BigInt(G), i = t / a, r = t % a;
  let s = `${i.toString()} ${n.dinar}`;
  return r !== 0n && (s += ` ${n.and}${r.toString()} ${n.fils}`), s;
}
function T(t, n) {
  const a = n.texts;
  if (t == null)
    return {
      missing: !0,
      hidden: !1,
      debt: n.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: "",
      debtWord: n.debt === "forYou" ? a.forYou : n.debt === "againstYou" ? a.againstYou : "",
      display: a.missingGlyph,
      aria: a.missing
    };
  if (n.hidden) {
    const g = n.debt === "forYou" ? a.forYou : n.debt === "againstYou" ? a.againstYou : "", h = g ? `${g} ${a.hiddenGlyph} ${a.unit}` : `${a.hiddenGlyph} ${a.unit}`;
    return {
      missing: !1,
      hidden: !0,
      debt: n.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: a.unit,
      debtWord: g,
      display: h,
      aria: a.hidden
    };
  }
  const { negative: r, fils: s } = ze(t), d = Qe(s), l = n.debt === "forYou" ? a.forYou : n.debt === "againstYou" ? a.againstYou : "", m = l ? "" : n.flow === "in" ? We : n.flow === "out" ? X : n.flow === "transfer" ? "" : r ? X : "", c = `${m}${d.int}${d.frac}`, u = l ? `${l} ${c} ${a.unit}` : `${c} ${a.unit}`;
  let p;
  return l ? p = `${l} ${K(s, a)}` : m === X ? p = `${a.minus} ${K(s, a)}` : p = K(s, a), {
    missing: !1,
    hidden: !1,
    debt: n.debt ?? null,
    sign: m,
    int: d.int,
    frac: d.frac,
    unit: a.unit,
    debtWord: l,
    display: u,
    aria: p
  };
}
const we = ve({ hidden: !1 });
function Za({ children: t, hidden: n = !1 }) {
  const a = ae(() => ({ hidden: n }), [n]);
  return /* @__PURE__ */ e(we.Provider, { value: a, children: t });
}
function L() {
  const { hidden: t } = ie(we);
  return { hidden: t, visible: !t };
}
const Ue = 500, Xe = Ie("motion.press-cancel-px");
function B(t = {}) {
  const { onPress: n, onLongPress: a, disabled: i } = t, [r, s] = E(!1), d = Z(null), l = Z(null), m = Z(!1), c = D(() => {
    l.current !== null && (clearTimeout(l.current), l.current = null);
  }, []), u = D(() => {
    c(), d.current = null, m.current = !1, s(!1);
  }, [c]), p = D(
    (f) => {
      if (!i && !(f.pointerType === "mouse" && f.button !== 0)) {
        if (typeof f.currentTarget.setPointerCapture == "function")
          try {
            f.currentTarget.setPointerCapture(f.pointerId);
          } catch {
          }
        d.current = { x: f.clientX, y: f.clientY }, m.current = !1, s(!0), a && (l.current = setTimeout(() => {
          m.current = !0, a();
        }, Ue));
      }
    },
    [i, a]
  ), g = D(
    (f) => {
      if (!r || d.current === null) return;
      const x = f.clientX - d.current.x, k = f.clientY - d.current.y;
      Math.hypot(x, k) > Xe && u();
    },
    [r, u]
  ), h = D(
    (f) => {
      if (!r) return;
      const x = m.current;
      u(), !x && !i && n?.();
    },
    [r, i, n, u]
  );
  return {
    isPressed: r,
    pressProps: {
      onPointerDown: p,
      onPointerMove: g,
      onPointerUp: h,
      onPointerCancel: u
    }
  };
}
const Ke = () => typeof window > "u" || !window.visualViewport ? {
  height: typeof window > "u" ? 0 : window.innerHeight,
  offsetTop: 0,
  scale: 1,
  keyboardHeight: 0
} : ye(window.visualViewport);
function ye(t) {
  const n = t.height, a = t.offsetTop, i = Math.max(0, window.innerHeight - n - a);
  return { height: n, offsetTop: a, scale: t.scale, keyboardHeight: i };
}
function Je() {
  const [t, n] = E(Ke);
  return q(() => {
    const a = window.visualViewport;
    if (!a) return;
    const i = () => n(ye(a));
    return i(), a.addEventListener("resize", i), a.addEventListener("scroll", i), window.addEventListener("resize", i), window.addEventListener("orientationchange", i), () => {
      a.removeEventListener("resize", i), a.removeEventListener("scroll", i), window.removeEventListener("resize", i), window.removeEventListener("orientationchange", i);
    };
  }, []), t;
}
function et(t) {
  const n = Z(0), a = Z(!1);
  t !== a.current && (a.current = t, t && (n.current += 1));
  const i = n.current, [r, s] = E(-1);
  return q(() => {
    if (!t) return;
    const d = i, l = window.setTimeout(() => s(d), O.motion["pending-delay"]);
    return () => window.clearTimeout(l);
  }, [t, i]), t && r === i;
}
const se = ve({
  sheetIds: [],
  registerSheet: () => {
  },
  unregisterSheet: () => {
  }
});
function tt(t, n) {
  switch (n.type) {
    case "register":
      return t.includes(n.id) ? t : [...t, n.id];
    case "unregister":
      return t.includes(n.id) ? t.filter((a) => a !== n.id) : t;
    default:
      return t;
  }
}
function Ca({ children: t }) {
  const [n, a] = Te(tt, []), i = D((d) => a({ type: "register", id: d }), []), r = D((d) => a({ type: "unregister", id: d }), []), s = ae(
    () => ({ sheetIds: n, registerSheet: i, unregisterSheet: r }),
    [n, i, r]
  );
  return /* @__PURE__ */ e(se.Provider, { value: s, children: t });
}
function Pa() {
  const { sheetIds: t, registerSheet: n, unregisterSheet: a } = ie(se), i = re();
  Ve(() => (n(i), () => a(i)), [i, n, a]);
  const r = t.indexOf(i) + 1 || t.length + 1, s = Math.min(r, 2), d = r === t.length;
  return {
    level: s,
    overLimit: r > 2,
    sheetZ: s === 1 ? "var(--mds-layer-sheet)" : "var(--mds-layer-sheet-2)",
    scrimZ: s === 1 ? "var(--mds-layer-scrim)" : "var(--mds-layer-scrim-2)",
    isTop: d
  };
}
function Ta() {
  const { sheetIds: t } = ie(se);
  return t.length;
}
const nt = /* @__PURE__ */ o("g", { transform: "translate(16 16)", id: "micro-symbol-master-2", children: [
  /* @__PURE__ */ e("g", { id: "module-top", transform: "rotate(0 96 96)", children: /* @__PURE__ */ e("path", { id: "shape-top", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ e("g", { id: "module-right", transform: "rotate(90 96 96)", children: /* @__PURE__ */ e("path", { id: "shape-right", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-signal)" }) }),
  /* @__PURE__ */ e("g", { id: "module-bottom", transform: "rotate(180 96 96)", children: /* @__PURE__ */ e("path", { id: "shape-bottom", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ e("g", { id: "module-left", transform: "rotate(270 96 96)", children: /* @__PURE__ */ e("path", { id: "shape-left", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-data)" }) })
] });
function at({ size: t = 28, className: n, ...a }) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 224 224",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...a,
      children: nt
    }
  );
}
const it = {
  regular: /* @__PURE__ */ e("path", { d: "M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z" })
};
function Va({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: it[n]
    }
  );
}
const rt = {
  regular: /* @__PURE__ */ e("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z" })
};
function $a({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: rt[n]
    }
  );
}
const st = {
  regular: /* @__PURE__ */ e("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z" })
};
function Ia({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: st[n]
    }
  );
}
const dt = {
  regular: /* @__PURE__ */ e("path", { d: "M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A8.13,8.13,0,0,0,255.43,117ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208ZM32,136V72H176v64Zm160,72a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm0-96V88h34.58l9.6,24Z" })
};
function lt({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: dt[n]
    }
  );
}
const ot = {
  regular: /* @__PURE__ */ e("path", { d: "M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z" })
};
function La({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: ot[n]
    }
  );
}
const ct = {
  regular: /* @__PURE__ */ e("path", { d: "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" })
};
function mt({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: ct[n]
    }
  );
}
const ut = {
  regular: /* @__PURE__ */ e("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" })
};
function ht({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: ut[n]
    }
  );
}
const pt = {
  regular: /* @__PURE__ */ e("path", { d: "M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" })
};
function gt({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: pt[n]
    }
  );
}
const bt = {
  regular: /* @__PURE__ */ e("path", { d: "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" })
};
function Fa({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: bt[n]
    }
  );
}
const ft = {
  bold: /* @__PURE__ */ e("path", { d: "M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" })
};
function Ne({
  size: t = 16,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: ft[n]
    }
  );
}
const xt = {
  bold: /* @__PURE__ */ e("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" })
};
function kt({
  size: t = 16,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: xt[n]
    }
  );
}
const vt = {
  regular: /* @__PURE__ */ e("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function wt({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: vt[n]
    }
  );
}
const yt = {
  bold: /* @__PURE__ */ e("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function de({
  size: t = 16,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: yt[n]
    }
  );
}
const Nt = {
  regular: /* @__PURE__ */ e("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" })
};
function At({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Nt[n]
    }
  );
}
const St = {
  fill: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function Bt({
  size: t = 20,
  weight: n = "fill",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: St[n]
    }
  );
}
const Ht = {
  bold: /* @__PURE__ */ e("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function jt({
  size: t = 16,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Ht[n]
    }
  );
}
const Mt = {
  bold: /* @__PURE__ */ e("path", { d: "M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" })
};
function Ea({
  size: t = 14,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Mt[n]
    }
  );
}
const Zt = {
  bold: /* @__PURE__ */ e("path", { d: "M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" })
};
function Da({
  size: t = 14,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Zt[n]
    }
  );
}
const Ct = {
  bold: /* @__PURE__ */ e("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function Ae({
  size: t = 14,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Ct[n]
    }
  );
}
const Pt = {
  bold: /* @__PURE__ */ e("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z" })
};
function Tt({
  size: t = 14,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Pt[n]
    }
  );
}
const Vt = {
  bold: /* @__PURE__ */ e("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function le({
  size: t = 14,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Vt[n]
    }
  );
}
const $t = {
  bold: /* @__PURE__ */ e("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" })
};
function It({
  size: t = 14,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: $t[n]
    }
  );
}
const Lt = {
  bold: /* @__PURE__ */ e("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" })
};
function Ft({
  size: t = 14,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Lt[n]
    }
  );
}
const Et = {
  regular: /* @__PURE__ */ e("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" })
};
function Ra({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Et[n]
    }
  );
}
const Dt = {
  regular: /* @__PURE__ */ e("path", { d: "M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z" })
};
function Rt({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Dt[n]
    }
  );
}
const qt = {
  regular: /* @__PURE__ */ e("path", { d: "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z" })
};
function Ot({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: qt[n]
    }
  );
}
const Yt = {
  regular: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" })
};
function _t({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Yt[n]
    }
  );
}
const Wt = {
  regular: /* @__PURE__ */ e("path", { d: "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z" })
};
function zt({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Wt[n]
    }
  );
}
const Gt = {
  fill: /* @__PURE__ */ e("path", { d: "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" })
};
function Qt({
  size: t = 14,
  weight: n = "fill",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Gt[n]
    }
  );
}
const Ut = {
  fill: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" })
};
function Xt({
  size: t = 14,
  weight: n = "fill",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Ut[n]
    }
  );
}
const Kt = {
  regular: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function Jt({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Kt[n]
    }
  );
}
const en = {
  regular: /* @__PURE__ */ e("path", { d: "M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM80,40h40V56H80ZM54.25,72h147.5l20,80H34.25ZM32,192V168H224v24ZM64,96a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,96ZM64,128a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,128Z" })
};
function tn({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: en[n]
    }
  );
}
const nn = {
  regular: /* @__PURE__ */ e("path", { d: "M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z" })
};
function an({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: nn[n]
    }
  );
}
const rn = {
  regular: /* @__PURE__ */ e("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" })
};
function sn({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: rn[n]
    }
  );
}
const dn = {
  regular: /* @__PURE__ */ e("path", { d: "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z" })
};
function ln({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: dn[n]
    }
  );
}
const on = {
  regular: /* @__PURE__ */ e("path", { d: "M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9ZM164,96a36,36,0,0,0,5.9-.48,36,36,0,1,0,28.22-47A36,36,0,1,0,164,96Zm60-12a20,20,0,1,1-20-20A20,20,0,0,1,224,84ZM164,40a20,20,0,0,1,19.25,14.61,36,36,0,0,0-15,24.93A20.42,20.42,0,0,1,164,80a20,20,0,0,1,0-40Z" })
};
function qa({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: on[n]
    }
  );
}
const cn = {
  regular: /* @__PURE__ */ e("path", { d: "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" })
};
function Oa({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: cn[n]
    }
  );
}
const mn = {
  regular: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function un({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: mn[n]
    }
  );
}
const hn = {
  regular: /* @__PURE__ */ e("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" })
};
function Ya({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: hn[n]
    }
  );
}
const pn = {
  regular: /* @__PURE__ */ e("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function _a({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: pn[n]
    }
  );
}
const gn = {
  regular: /* @__PURE__ */ e("path", { d: "M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z" })
};
function Wa({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: gn[n]
    }
  );
}
const bn = {
  regular: /* @__PURE__ */ e("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" })
};
function za({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: bn[n]
    }
  );
}
const fn = {
  regular: /* @__PURE__ */ e("path", { d: "M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z" })
};
function Ga({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: fn[n]
    }
  );
}
const xn = {
  regular: /* @__PURE__ */ e("path", { d: "M216,40H68.53a16.08,16.08,0,0,0-13.72,7.77L9.14,123.88a8,8,0,0,0,0,8.24l45.67,76.11A16.08,16.08,0,0,0,68.53,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM61.67,204.12,68.53,200h0ZM216,200H68.53l-43.2-72,43.2-72H216ZM106.34,146.34,124.69,128l-18.35-18.34a8,8,0,0,1,11.32-11.32L136,116.69l18.34-18.35a8,8,0,0,1,11.32,11.32L147.31,128l18.35,18.34a8,8,0,0,1-11.32,11.32L136,139.31l-18.34,18.35a8,8,0,0,1-11.32-11.32Z" })
};
function Qa({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: xn[n]
    }
  );
}
const kn = {
  regular: /* @__PURE__ */ e("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" })
};
function Ua({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: kn[n]
    }
  );
}
const vn = {
  regular: /* @__PURE__ */ e("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" })
};
function Xa({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: vn[n]
    }
  );
}
const wn = {
  regular: /* @__PURE__ */ e("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function Ka({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: wn[n]
    }
  );
}
const yn = {
  regular: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" })
};
function Se({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: yn[n]
    }
  );
}
const Nn = {
  regular: /* @__PURE__ */ e("path", { d: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z" })
};
function An({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Nn[n]
    }
  );
}
const Sn = {
  regular: /* @__PURE__ */ e("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" })
};
function Ja({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Sn[n]
    }
  );
}
const Bn = {
  regular: /* @__PURE__ */ e("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" })
};
function ei({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Bn[n]
    }
  );
}
const Hn = {
  regular: /* @__PURE__ */ e("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" })
};
function ti({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Hn[n]
    }
  );
}
const jn = {
  regular: /* @__PURE__ */ e("path", { d: "M197.66,69.66,83.31,184H168a8,8,0,0,1,0,16H64a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v84.69L186.34,58.34a8,8,0,0,1,11.32,11.32Z" })
};
function Mn({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: jn[n]
    }
  );
}
const Zn = {
  regular: /* @__PURE__ */ e("path", { d: "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" })
};
function Cn({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: Zn[n]
    }
  );
}
const Pn = {
  regular: /* @__PURE__ */ e("path", { d: "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" })
};
function Tn({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Pn[n]
    }
  );
}
const Vn = {
  regular: /* @__PURE__ */ e("path", { d: "M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" })
};
function $n({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Vn[n]
    }
  );
}
const In = {
  regular: /* @__PURE__ */ e("path", { d: "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" })
};
function Ln({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: In[n]
    }
  );
}
const Fn = {
  regular: /* @__PURE__ */ e("path", { d: "M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z" })
};
function ni({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: Fn[n]
    }
  );
}
const En = {
  regular: /* @__PURE__ */ e("path", { d: "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z" })
};
function ai({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: En[n]
    }
  );
}
const Dn = {
  regular: /* @__PURE__ */ e("path", { d: "M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" })
};
function ii({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Dn[n]
    }
  );
}
const Rn = {
  regular: /* @__PURE__ */ e("path", { d: "M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function ri({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Rn[n]
    }
  );
}
const qn = {
  regular: /* @__PURE__ */ e("path", { d: "M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function si({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: qn[n]
    }
  );
}
const On = {
  regular: /* @__PURE__ */ e("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" })
};
function di({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: On[n]
    }
  );
}
const Yn = {
  regular: /* @__PURE__ */ e("path", { d: "M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" })
};
function li({
  size: t = 20,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Yn[n]
    }
  );
}
const _n = {
  regular: /* @__PURE__ */ e("path", { d: "M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z" })
};
function oi({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: _n[n]
    }
  );
}
const Wn = {
  regular: /* @__PURE__ */ e("path", { d: "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z" })
};
function ci({
  size: t = 24,
  weight: n = "regular",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: Wn[n]
    }
  );
}
const zn = {
  bold: /* @__PURE__ */ e("path", { d: "M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z" })
};
function mi({
  size: t = 14,
  weight: n = "bold",
  className: a,
  ...i
}) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 256 256",
      fill: "currentColor",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: zn[n]
    }
  );
}
const ui = ["nav-delivery", "back", "forward", "transfer", "movement-in", "movement-out", "send"];
function I({
  value: t,
  flow: n,
  debt: a,
  size: i = "md",
  state: r = "idle",
  disabled: s = !1,
  className: d,
  id: l,
  style: m,
  ref: c,
  ...u
}) {
  const { hidden: p } = L(), g = p && t !== null && t !== void 0, h = T(t, { flow: n, debt: a, hidden: g, texts: S }), f = ["mds-money", `mds-money--${i}`, i === "lg" ? "mds-number-lg" : "", s ? "mds-money--disabled" : "", d].filter(Boolean).join(" ");
  return r === "loading" ? /* @__PURE__ */ e("span", { ref: c, id: l, style: m, className: f, "aria-busy": "true", ...u, children: /* @__PURE__ */ e("span", { className: "mds-money-skeleton", "aria-hidden": "true" }) }) : /* @__PURE__ */ o("span", { ref: c, id: l, style: m, className: f, ...u, children: [
    /* @__PURE__ */ o("span", { className: "mds-money-visual", "aria-hidden": "true", children: [
      h.debtWord ? /* @__PURE__ */ e("span", { className: "mds-money-debt", children: h.debtWord }) : null,
      h.missing ? /* @__PURE__ */ e("span", { className: "mds-money-missing", children: S.missingGlyph }) : /* @__PURE__ */ o(P, { children: [
        /* @__PURE__ */ e("bdi", { className: "mds-money-value", dir: "ltr", children: h.hidden ? S.hiddenGlyph : /* @__PURE__ */ o(P, { children: [
          /* @__PURE__ */ o("span", { className: "mds-money-integer", children: [
            h.sign,
            h.int
          ] }),
          h.frac ? /* @__PURE__ */ e("span", { className: "mds-money-fraction", children: h.frac }) : null
        ] }) }),
        /* @__PURE__ */ e("span", { className: "mds-money-unit", children: h.unit })
      ] })
    ] }, g ? "hidden" : "shown"),
    /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: h.aria })
  ] });
}
const hi = [
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
function Gn({
  onChange: t,
  disabled: n = !1,
  density: a = "regular",
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const { hidden: m, visible: c } = L(), u = m ? gt : ht, p = j(m ? "button.showAmounts" : "button.hideAmounts"), g = [
    "mds-amount-visibility-toggle",
    a === "large" ? "mds-amount-visibility-toggle--large" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e(
    "button",
    {
      ref: d,
      id: r,
      style: s,
      ...l,
      type: "button",
      className: g,
      "aria-label": p,
      disabled: n,
      onClick: () => t?.(!c),
      children: /* @__PURE__ */ e(u, { size: 24 })
    }
  );
}
const pi = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "amountsShown",
  "amountsHidden"
];
function gi({
  label: t,
  caption: n,
  selected: a = !1,
  onChange: i,
  disabled: r = !1,
  state: s = "idle",
  className: d,
  id: l,
  style: m,
  ref: c,
  "aria-label": u,
  ...p
}) {
  const g = [
    // .mds-control-row (base.css): the shared row-plain anatomy; the box
    // aligns to the FIRST text line, so the alignment overrides to start.
    "mds-control-row",
    "mds-checkbox",
    a ? "mds-checkbox--selected" : "",
    r ? "mds-checkbox--disabled" : "",
    s === "error" ? "mds-checkbox--error" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("label", { ref: c, id: l, style: m, className: g, ...p, children: [
    /* @__PURE__ */ e(
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
    /* @__PURE__ */ e("span", { className: "mds-checkbox-box", "aria-hidden": "true", children: /* @__PURE__ */ e(de, { size: 14 }) }),
    /* @__PURE__ */ o("span", { className: "mds-checkbox-text mds-control-text", children: [
      /* @__PURE__ */ e("span", { className: "mds-checkbox-label mds-type-body", children: t }),
      n ? /* @__PURE__ */ e("span", { className: "mds-checkbox-caption mds-type-caption", children: n }) : null
    ] }),
    s === "error" ? /* @__PURE__ */ e("span", { className: "mds-checkbox-error mds-type-caption", children: j("checkbox.tickThis") }) : null
  ] });
}
const bi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function fi({
  label: t,
  items: n,
  value: a,
  onChange: i,
  disabled: r = !1,
  state: s = "idle",
  className: d,
  id: l,
  style: m,
  ref: c,
  ...u
}) {
  const p = re(), g = [
    "mds-radio",
    r ? "mds-radio--disabled" : "",
    s === "error" ? "mds-radio--error" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: c, id: l, style: m, className: g, ...u, children: [
    /* @__PURE__ */ e("span", { className: "mds-radio-label mds-type-label", children: t }),
    /* @__PURE__ */ e("div", { className: "mds-radio-surface", role: "radiogroup", "aria-label": t, children: n.map((h) => {
      const f = h.value === a;
      return /* @__PURE__ */ o("label", { className: "mds-control-row mds-radio-row", children: [
        /* @__PURE__ */ e(
          "input",
          {
            type: "radio",
            className: "mds-radio-input mds-sr-input",
            name: p,
            checked: f,
            disabled: r || h.disabled,
            onChange: () => i?.(h.value)
          }
        ),
        /* @__PURE__ */ e("span", { className: "mds-radio-circle", "aria-hidden": "true", children: /* @__PURE__ */ e("span", { className: "mds-radio-dot" }) }),
        /* @__PURE__ */ o("span", { className: "mds-radio-text mds-control-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-radio-row-label mds-type-body", children: h.label }),
          h.caption ? /* @__PURE__ */ e("span", { className: "mds-radio-caption mds-type-caption", children: h.caption }) : null
        ] })
      ] }, h.value);
    }) }),
    s === "error" ? /* @__PURE__ */ e("span", { className: "mds-radio-error mds-type-caption", children: j("radio.choose").replace("{label}", t) }) : null
  ] });
}
const xi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function ki({
  label: t,
  caption: n,
  selected: a = !1,
  onChange: i,
  disabled: r = !1,
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  const u = [
    // .mds-control-row (base.css): the whole row is the switch's press zone.
    "mds-control-row",
    "mds-toggle",
    a ? "mds-toggle--selected" : "",
    r ? "mds-toggle--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("label", { ref: m, id: d, style: l, className: u, ...c, children: [
    /* @__PURE__ */ e(
      "input",
      {
        type: "checkbox",
        className: "mds-toggle-input mds-sr-input",
        role: "switch",
        checked: a,
        disabled: r,
        onChange: (p) => i?.(p.target.checked),
        "aria-checked": a
      }
    ),
    /* @__PURE__ */ o("span", { className: "mds-toggle-text mds-control-text", children: [
      /* @__PURE__ */ e("span", { className: "mds-toggle-label mds-type-body", children: t }),
      n ? /* @__PURE__ */ e("span", { className: "mds-toggle-caption mds-type-caption", children: n }) : null
    ] }),
    /* @__PURE__ */ e("span", { className: "mds-toggle-switch", "aria-hidden": "true", children: /* @__PURE__ */ e("span", { className: "mds-toggle-track", children: /* @__PURE__ */ e("span", { className: "mds-toggle-thumb", children: /* @__PURE__ */ e(de, { size: 14 }) }) }) })
  ] });
}
const vi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled"
];
function wi({
  label: t,
  placeholder: n,
  value: a = "",
  onChange: i,
  disabled: r = !1,
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  const u = a.length > 0, p = [
    "mds-search-field",
    r ? "mds-search-field--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: m, id: d, style: l, className: p, ...c, children: [
    /* @__PURE__ */ e(At, { size: 20 }),
    /* @__PURE__ */ e(
      "input",
      {
        type: "search",
        className: "mds-search-field-input",
        role: "searchbox",
        "aria-label": t,
        placeholder: n,
        value: a,
        disabled: r,
        enterKeyHint: "search",
        onChange: (g) => i?.(g.target.value)
      }
    ),
    u ? /* @__PURE__ */ e(
      Qn,
      {
        onClear: () => {
          i?.("");
        }
      }
    ) : null
  ] });
}
function Qn({ onClear: t }) {
  const { isPressed: n, pressProps: a } = B({ onPress: t });
  return /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: ["mds-search-field-clear", n ? "mds-search-field-clear--pressed" : ""].filter(Boolean).join(" "),
      "data-ds-exempt": "",
      "aria-label": j("sr.clearSearch"),
      ...a,
      children: /* @__PURE__ */ e(Bt, { size: 20 })
    }
  );
}
const yi = [
  "default",
  "focused",
  "disabled",
  "withText"
];
function Ni({
  label: t,
  caption: n,
  value: a = "",
  onChange: i,
  placeholder: r,
  state: s = "idle",
  disabled: d = !1,
  optional: l = !1,
  className: m,
  id: c,
  style: u,
  ref: p,
  ...g
}) {
  const h = re(), f = ae(() => `${h}-error`, [h]), x = [
    "mds-field",
    "mds-text-area",
    s === "error" ? "mds-text-area--error" : "",
    d ? "mds-text-area--disabled mds-field--disabled" : "",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { id: c, style: u, className: x, ...g, children: [
    /* @__PURE__ */ o("label", { className: "mds-text-area-label mds-type-label", htmlFor: c ?? h, children: [
      t,
      l ? /* @__PURE__ */ e("span", { className: "mds-text-area-optional mds-type-caption", children: j("field.optional") }) : null
    ] }),
    /* @__PURE__ */ e(
      "textarea",
      {
        ref: p,
        id: c ?? h,
        className: "mds-text-area-input mds-field-input",
        rows: 1,
        value: a,
        disabled: d,
        placeholder: r,
        "aria-multiline": "true",
        "aria-invalid": s === "error" || void 0,
        "aria-describedby": s === "error" ? f : void 0,
        enterKeyHint: "enter",
        onChange: (k) => i?.(k.target.value),
        onInput: (k) => {
          const v = k.currentTarget;
          v.style.height = "auto", v.style.height = `${v.scrollHeight}px`;
        }
      }
    ),
    s === "error" ? /* @__PURE__ */ o("span", { id: f, className: "mds-text-area-help mds-type-caption", children: [
      /* @__PURE__ */ e(jt, { size: 16 }),
      /* @__PURE__ */ e("span", { children: n })
    ] }) : n ? /* @__PURE__ */ e("span", { className: "mds-text-area-help mds-type-caption", children: /* @__PURE__ */ e("span", { children: n }) }) : null
  ] });
}
const Ai = [
  "default",
  "focused",
  "error",
  "disabled",
  "grown"
], ge = 1632, Un = 1641, Xn = 1643;
function Kn(t) {
  let n = "", a = !1;
  for (const r of t) {
    const s = r.codePointAt(0);
    if (s >= ge && s <= Un) {
      const d = String(s - ge);
      n = i(n, d);
      continue;
    }
    if (r >= "0" && r <= "9") {
      n = i(n, r);
      continue;
    }
    if ((s === Xn || r === "." || r === ",") && !a) {
      n === "" && (n = "0"), n += ".", a = !0;
      continue;
    }
  }
  return n;
  function i(r, s) {
    return r.includes(".") && r.length - r.indexOf(".") - 1 >= 3 || r === "0" && s === "0" ? r : r === "0" ? s : r + s;
  }
}
function Si({
  label: t,
  caption: n,
  value: a = "",
  onChange: i,
  disabled: r = !1,
  state: s = "idle",
  draft: d = !1,
  className: l,
  id: m,
  style: c,
  ref: u,
  ...p
}) {
  const [g, h] = E(!1), f = [
    "mds-amount-field",
    r ? "mds-amount-field--disabled" : "",
    s === "error" ? "mds-amount-field--error" : "",
    d ? "mds-amount-field--draft" : "",
    l
  ].filter(Boolean).join(" "), x = g || a === "" ? a : T(a, { texts: S }).int + (a.includes(".") ? T(a, { texts: S }).frac : "");
  return /* @__PURE__ */ o("div", { id: m, style: c, className: f, ...p, children: [
    /* @__PURE__ */ e("span", { className: "mds-amount-field-label mds-type-label", children: t }),
    /* @__PURE__ */ o("div", { className: "mds-amount-field-box", children: [
      /* @__PURE__ */ e(
        "input",
        {
          ref: u,
          className: [
            "mds-amount-field-input",
            // ADDENDUM 2.1: past 13 characters the type drops in ONE step to
            // number-lg — the shared .mds-number-lg class (base.css), exactly
            // the Money/HeroSurface drop (23.20).
            x.length > 13 ? "mds-number-lg" : ""
          ].filter(Boolean).join(" "),
          inputMode: "decimal",
          enterKeyHint: "next",
          value: x,
          disabled: r,
          "aria-label": t,
          "aria-invalid": s === "error" || void 0,
          onFocus: () => h(!0),
          onBlur: () => h(!1),
          "data-long": x.length > 13 ? "true" : void 0,
          onChange: (k) => i?.(Kn(k.target.value))
        }
      ),
      /* @__PURE__ */ e("span", { className: "mds-amount-field-unit", children: S.unit })
    ] }),
    s === "error" && n ? /* @__PURE__ */ e("span", { className: "mds-amount-field-help", children: n }) : n ? /* @__PURE__ */ e("span", { className: "mds-amount-field-help", children: n }) : null
  ] });
}
const Bi = [
  "default",
  "focused",
  "error",
  "disabled",
  "long"
], Jn = {
  done: Ae,
  waiting: Tt,
  problem: le,
  info: It
}, ea = {
  done: b["badge.done"].text,
  waiting: b["badge.waiting"].text,
  problem: b["badge.problem"].text,
  info: b["badge.info"].text,
  neutral: b["badge.neutral"].text
};
function R({
  tone: t,
  label: n,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  const l = t === "neutral" ? null : Jn[t], m = ["mds-status-badge", `mds-status-badge--${t}`, a].filter(Boolean).join(" ");
  return /* @__PURE__ */ e("span", { ref: s, id: i, style: r, className: m, ...d, children: /* @__PURE__ */ o("span", { className: "mds-status-badge-content", children: [
    l ? /* @__PURE__ */ e(l, { size: 14 }) : null,
    /* @__PURE__ */ e("span", { className: "mds-status-badge-label", children: n ?? ea[t] })
  ] }, t) });
}
const Hi = [
  "neutral",
  "info",
  "done",
  "waiting",
  "problem",
  "longLabel"
], ta = {
  done: Qt,
  waiting: Xt
};
function na(t) {
  let n = t.trim().split(/\s+/)[0];
  const a = String.fromCodePoint(1575, 1604);
  return n.length > a.length && n.startsWith(a) && (n = n.slice(a.length)), n ? Array.from(n)[0] : void 0;
}
function C({
  size: t = "md",
  variant: n = "surface",
  value: a,
  tone: i,
  children: r,
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  const u = i === "done" || i === "waiting" ? ta[i] : null, p = r ? void 0 : a ? na(a) : void 0, g = [
    "mds-entity-mark",
    `mds-entity-mark--${t}`,
    n === "canvas" ? "mds-entity-mark--canvas" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("span", { ref: m, id: d, style: l, className: g, "aria-hidden": "true", ...c, children: [
    r ?? (p ? /* @__PURE__ */ e("span", { className: "mds-entity-mark-initial", children: p }) : null),
    u ? /* @__PURE__ */ e("span", { className: "mds-entity-mark-badge", children: /* @__PURE__ */ e(u, { size: 14 }) }) : null
  ] });
}
const ji = [
  "initial",
  "sizes",
  "fundTypes",
  "approved",
  "pending",
  "withImageRule"
];
function Q({
  variant: t = "primary",
  mode: n = "surface",
  size: a = "md",
  loading: i = !1,
  leading: r,
  trailing: s,
  onPress: d,
  onLongPress: l,
  disabled: m = !1,
  className: c,
  id: u,
  style: p,
  ref: g,
  children: h,
  ...f
}) {
  const { isPressed: x, pressProps: k } = B({
    onPress: d,
    onLongPress: l,
    disabled: m || i
  }), v = et(i), N = [
    "mds-button",
    `mds-button--${t}`,
    `mds-button--${a}`,
    n === "canvas" ? "mds-button--on-canvas" : "",
    x ? "mds-button--pressed" : "",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: g,
      id: u,
      style: p,
      ...f,
      ...k,
      type: "button",
      className: N,
      disabled: m,
      "aria-busy": i || void 0,
      children: [
        v ? /* @__PURE__ */ e("span", { className: "mds-button-spinner", "aria-hidden": "true" }) : r ? /* @__PURE__ */ e("span", { className: "mds-button-icon", children: r }) : null,
        /* @__PURE__ */ e("span", { className: "mds-button-label", children: h }),
        s ? /* @__PURE__ */ e("span", { className: "mds-button-icon", children: s }) : null
      ]
    }
  );
}
const Mi = [
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
function aa({
  label: t,
  onPress: n,
  onLongPress: a,
  disabled: i = !1,
  density: r = "regular",
  className: s,
  id: d,
  style: l,
  ref: m,
  children: c,
  ...u
}) {
  const { isPressed: p, pressProps: g } = B({ onPress: n, onLongPress: a, disabled: i }), h = [
    "mds-icon-button",
    r === "large" ? "mds-icon-button--large" : "",
    p ? "mds-icon-button--pressed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e(
    "button",
    {
      ref: m,
      id: d,
      style: l,
      ...u,
      ...g,
      type: "button",
      className: h,
      "aria-label": t,
      disabled: i,
      children: c
    }
  );
}
const Zi = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "large"
];
function ia({
  label: t,
  caption: n,
  value: a,
  onChange: i,
  placeholder: r,
  state: s = "idle",
  disabled: d = !1,
  optional: l = !1,
  className: m,
  id: c,
  style: u,
  ref: p,
  ...g
}) {
  const h = [
    "mds-field",
    "mds-text-field",
    s === "error" ? "mds-text-field--error" : "",
    d ? "mds-text-field--disabled mds-field--disabled" : "",
    m
  ].filter(Boolean).join(" "), f = c ? `${c}-input` : void 0;
  return /* @__PURE__ */ o("span", { ref: p, id: c, style: u, className: h, ...g, children: [
    /* @__PURE__ */ o("label", { className: "mds-text-field-label mds-type-label", htmlFor: f, children: [
      t,
      l ? /* @__PURE__ */ e("span", { className: "mds-text-field-optional mds-type-caption", children: j("field.optional") }) : null
    ] }),
    /* @__PURE__ */ e(
      "input",
      {
        id: f,
        className: "mds-text-field-input mds-field-input",
        type: "text",
        value: a,
        disabled: d,
        placeholder: r,
        "aria-label": c ? void 0 : t,
        "aria-invalid": s === "error" || void 0,
        onChange: (x) => i?.(x.target.value)
      }
    ),
    n ? /* @__PURE__ */ o("span", { className: s === "error" ? "mds-text-field-caption mds-text-field-caption--error" : "mds-text-field-caption", children: [
      s === "error" ? /* @__PURE__ */ e(le, { size: 14 }) : null,
      n
    ] }) : null
  ] });
}
const Ci = [
  "default",
  "focused",
  "disabled",
  "error",
  "withCaption",
  "withPlaceholder"
];
function Pi({
  leading: t,
  value: n,
  onChange: a,
  disabled: i = !1,
  label: r,
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  return /* @__PURE__ */ e(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-segmented", s].filter(Boolean).join(" "),
      role: "group",
      "aria-label": r,
      ...c,
      children: t.map((u) => /* @__PURE__ */ e(
        ra,
        {
          segment: u,
          selected: u.value === n,
          disabled: i || u.disabled === !0,
          onChange: a
        },
        u.value
      ))
    }
  );
}
function ra({
  segment: t,
  selected: n,
  disabled: a,
  onChange: i
}) {
  const { isPressed: r, pressProps: s } = B({ onPress: () => i(t.value), disabled: a }), d = [
    "mds-segmented-segment",
    n ? "mds-segmented-segment--selected" : "",
    r ? "mds-segmented-segment--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: d,
      "aria-pressed": n === !0,
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...s,
      children: [
        t.leading ? /* @__PURE__ */ e("span", { className: "mds-segmented-segment-icon", "aria-hidden": "true", children: t.leading }) : null,
        /* @__PURE__ */ e("span", { className: "mds-segmented-segment-label", children: t.label })
      ]
    }
  );
}
const Ti = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "threeSegments",
  "fourSegments",
  "withIcon"
];
function Vi({
  leading: t,
  value: n,
  onChange: a,
  disabled: i = !1,
  label: r,
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  const u = (p) => {
    const g = n.includes(p) ? n.filter((h) => h !== p) : [...n, p];
    a(g);
  };
  return /* @__PURE__ */ e(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-filter-chips", s].filter(Boolean).join(" "),
      role: "group",
      "aria-label": r,
      ...c,
      children: t.map((p) => /* @__PURE__ */ e(
        sa,
        {
          chip: p,
          selected: n.includes(p.value),
          disabled: i || p.disabled === !0,
          onToggle: u
        },
        p.value
      ))
    }
  );
}
function sa({
  chip: t,
  selected: n,
  disabled: a,
  onToggle: i
}) {
  const { isPressed: r, pressProps: s } = B({ onPress: () => i(t.value), disabled: a }), d = [
    "mds-filter-chip",
    n ? "mds-filter-chip--selected" : "",
    r ? "mds-filter-chip--pressed" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: d,
      "aria-pressed": n === !0,
      disabled: a,
      "data-ds-exempt": a ? void 0 : "",
      ...s,
      children: [
        n ? /* @__PURE__ */ e(de, { size: 16, className: "mds-filter-chip-check" }) : null,
        /* @__PURE__ */ e("span", { className: "mds-filter-chip-label", children: t.label })
      ]
    }
  );
}
const $i = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "manyChips"
];
function te({
  children: t,
  label: n,
  trailing: a,
  density: i = "regular",
  className: r,
  id: s,
  style: d,
  ref: l,
  ...m
}) {
  const c = [
    "mds-surface",
    i === "list" ? "mds-surface--list" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: l, id: s, style: d, className: c, ...m, children: [
    n || a ? /* @__PURE__ */ o("div", { className: "mds-surface-header", children: [
      n ? /* @__PURE__ */ e("h3", { className: "mds-surface-title", children: n }) : null,
      a ? /* @__PURE__ */ e("div", { className: "mds-surface-action", children: a }) : null
    ] }) : null,
    t
  ] });
}
const Ii = [
  "default",
  "withHeader",
  "withAction",
  "pressed",
  "list"
];
function ne({ children: t, className: n, id: a, style: i, ref: r, ...s }) {
  return /* @__PURE__ */ e(
    "div",
    {
      ref: r,
      id: a,
      style: i,
      className: ["mds-well", n].filter(Boolean).join(" "),
      ...s,
      children: t
    }
  );
}
const Li = [
  "default",
  "inSurface"
];
function Fi({
  label: t,
  caption: n,
  onPress: a,
  children: i,
  className: r,
  id: s,
  style: d,
  ref: l,
  ...m
}) {
  const c = i == null, { isPressed: u, pressProps: p } = B({ onPress: () => a?.(), disabled: c }), g = !c && a !== void 0, h = ["mds-section", r].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("section", { ref: l, id: s, style: d, className: h, ...m, children: [
    /* @__PURE__ */ o("header", { className: "mds-section-header", children: [
      /* @__PURE__ */ e("h2", { className: "mds-section-title mds-type-title-section", children: t }),
      n !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-section-count", children: n }) : null,
      g ? /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: ["mds-section-see-all", u ? "mds-section-see-all--pressed" : ""].filter(Boolean).join(" "),
          "data-ds-exempt": "",
          ...p,
          children: [
            /* @__PURE__ */ e("span", { className: "mds-section-see-all-label", children: j("button.all") }),
            /* @__PURE__ */ e(Ne, { size: 16, className: "mds-section-see-all-icon" })
          ]
        }
      ) : null
    ] }),
    i
  ] });
}
const Ei = [
  "default",
  "withCount",
  "withSeeAll",
  "empty"
], U = 80, Be = O.size["dot-signal"] / 2, da = O.border["signal-line"], z = Be + da / 2;
function la(t, n) {
  const a = t.length, i = Math.min(...t), s = Math.max(...t) - i, d = (c) => a === 1 ? U - z : z + c / (a - 1) * (U - 2 * z), l = (c) => s === 0 ? n / 2 : z + (1 - (c - i) / s) * (n - 2 * z);
  return { points: t.map((c, u) => `${d(u).toFixed(2)},${l(c).toFixed(2)}`).join(" "), endX: d(a - 1), endY: l(t[a - 1]) };
}
function He({
  values: t,
  lineClassName: n,
  dotClassName: a,
  hidden: i = !1,
  height: r,
  fullWidth: s = !1
}) {
  const d = r ?? O.size["sparkline-height"], l = !i && t.length >= 1 ? la(t, d) : null;
  return /* @__PURE__ */ o(
    "svg",
    {
      viewBox: `0 0 ${U} ${d}`,
      width: s ? "100%" : U,
      height: d,
      preserveAspectRatio: s ? "none" : void 0,
      focusable: "false",
      children: [
        l && t.length >= 2 ? /* @__PURE__ */ e(
          "polyline",
          {
            className: n,
            points: l.points,
            vectorEffect: s ? "non-scaling-stroke" : void 0
          }
        ) : null,
        l ? s ? (
          /* The stretched dot: a zero-length path with a round cap and a
             non-scaling stroke keeps its token diameter and its circle shape
             under any preserveAspectRatio="none" stretch. */
          /* @__PURE__ */ e(
            "path",
            {
              className: a,
              d: `M ${l.endX.toFixed(2)} ${l.endY.toFixed(2)} L ${l.endX.toFixed(2)} ${l.endY.toFixed(2)}`,
              strokeWidth: O.size["dot-signal"],
              strokeLinecap: "round",
              vectorEffect: "non-scaling-stroke",
              fill: "none"
            }
          )
        ) : /* @__PURE__ */ e("circle", { className: a, cx: l.endX, cy: l.endY, r: Be }) : null
      ]
    }
  );
}
function Di({
  leading: t,
  label: n,
  state: a = !1,
  caption: i,
  value: r,
  trailing: s,
  draft: d,
  tone: l = "start",
  onPress: m,
  disabled: c = !1,
  className: u,
  id: p,
  style: g,
  ref: h,
  ...f
}) {
  const { isPressed: x, pressProps: k } = B({ onPress: () => m?.(), disabled: c }), { hidden: v } = L(), w = r === void 0 ? S.missingGlyph : v && d !== void 0 ? S.hiddenGlyph : r, H = [
    "mds-tile",
    `mds-tile--${l}`,
    x ? "mds-tile--pressed" : "",
    c ? "mds-tile--disabled" : "",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: h,
      id: p,
      style: g,
      type: "button",
      className: H,
      disabled: c,
      "data-ds-exempt": c ? void 0 : "",
      ...k,
      ...f,
      children: [
        /* @__PURE__ */ o("span", { className: "mds-tile-header", children: [
          t ? /* @__PURE__ */ e("span", { className: "mds-tile-header-icon", "aria-hidden": "true", children: t }) : null,
          /* @__PURE__ */ e("span", { className: "mds-tile-header-label mds-type-label", children: n }),
          a ? /* @__PURE__ */ e("span", { className: "mds-tile-dot", role: "img", "aria-label": i ?? "" }) : null
        ] }),
        /* @__PURE__ */ o("span", { className: "mds-tile-content", children: [
          d ? /* @__PURE__ */ e("span", { className: "mds-tile-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ e(
            He,
            {
              values: d,
              hidden: v,
              lineClassName: "mds-tile-sparkline-line",
              dotClassName: "mds-tile-sparkline-dot"
            }
          ) }) : null,
          /* @__PURE__ */ e("span", { className: "mds-tile-value", children: /* @__PURE__ */ e("bdi", { dir: "ltr", children: w }) }),
          s ? /* @__PURE__ */ e("span", { className: "mds-tile-line mds-type-caption", children: s }) : null
        ] })
      ]
    }
  );
}
const Ri = [
  "default",
  "withDot",
  "withSparkline",
  "pressed",
  "focused",
  "disabled"
];
function oa(t) {
  const n = t.indexOf(".");
  return n === -1 ? { whole: t, cents: "" } : { whole: t.slice(0, n), cents: t.slice(n) };
}
function ca({ value: t }) {
  const { hidden: n } = L(), i = t === void 0 ? S.missingGlyph : n ? S.hiddenGlyph : null, { whole: r, cents: s } = oa(t ?? S.missingGlyph), l = (t ?? "").length > 9 ? "mds-hero-value--lg mds-number-lg" : "mds-hero-value--hero mds-type-display-hero";
  return /* @__PURE__ */ e("span", { className: `mds-hero-value ${l}`, children: /* @__PURE__ */ e("bdi", { dir: "ltr", children: i !== null ? /* @__PURE__ */ e("span", { className: "mds-hero-value-glyph", children: i }) : /* @__PURE__ */ o(P, { children: [
    /* @__PURE__ */ e("span", { className: "mds-hero-value-whole", children: r }),
    s ? /* @__PURE__ */ e("span", { className: "mds-hero-value-cents", children: s }) : null
  ] }) }) });
}
function ma({ values: t }) {
  const { hidden: n } = L();
  return /* @__PURE__ */ e("span", { className: "mds-hero-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ e(
    He,
    {
      values: t,
      hidden: n,
      height: O.size["hero-sparkline-height"],
      fullWidth: !0,
      lineClassName: "mds-hero-sparkline-line",
      dotClassName: "mds-hero-sparkline-dot"
    }
  ) });
}
function qi({
  label: t,
  value: n,
  trailing: a,
  direction: i,
  debt: r,
  draft: s,
  onDismiss: d,
  onChange: l,
  className: m,
  id: c,
  style: u,
  ref: p,
  ...g
}) {
  const { isPressed: h, pressProps: f } = B({ onPress: () => d?.() }), { hidden: x } = L(), k = x && n !== void 0, v = ["mds-hero-surface", m].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("section", { ref: p, id: c, style: u, className: v, ...g, children: [
    /* @__PURE__ */ o("header", { className: "mds-hero-header", children: [
      /* @__PURE__ */ e("span", { className: "mds-hero-label", children: t }),
      /* @__PURE__ */ e(Gn, { className: "mds-hero-toggle", onChange: l })
    ] }),
    /* @__PURE__ */ o("p", { className: "mds-hero-amount", children: [
      /* @__PURE__ */ o("span", { className: "mds-hero-visual", "aria-hidden": k || void 0, children: [
        /* @__PURE__ */ e(ca, { value: n }),
        a && n !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-hero-unit", children: a }) : null
      ] }, k ? "hidden" : "shown"),
      k ? /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: S.hidden }) : null
    ] }),
    i || r ? (
      /* 1.7 ت2.3: ONE line — the diff, then « · », then the source link
          at the line's end (they used to be two stacked lines with the
          source under the sparkline). */
      /* @__PURE__ */ o("p", { className: "mds-hero-line", children: [
        i ? /* @__PURE__ */ e("span", { className: "mds-hero-diff", children: i }) : null,
        i && r ? /* @__PURE__ */ e("span", { className: "mds-hero-line-sep", "aria-hidden": "true", children: "·" }) : null,
        r ? /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: ["mds-hero-source", h ? "mds-hero-source--pressed" : ""].filter(Boolean).join(" "),
            "data-ds-exempt": "",
            ...f,
            children: r
          }
        ) : null
      ] })
    ) : null,
    s ? /* @__PURE__ */ e(ma, { values: s }) : null
  ] });
}
const Oi = [
  "default",
  "withCents",
  "missing",
  "longNumber",
  "noDiff",
  "withSparkline"
];
function be(t) {
  return t != null && typeof t != "string";
}
function J({
  leading: t,
  tone: n,
  label: a,
  caption: i,
  value: r,
  trailing: s,
  onPress: d,
  disabled: l = !1,
  className: m,
  id: c,
  style: u,
  ref: p,
  ...g
}) {
  const { isPressed: h, pressProps: f } = B({ onPress: () => d?.(), disabled: l }), x = d !== void 0, k = [
    "mds-object-row",
    be(t) ? "mds-object-row--icon" : "",
    h ? "mds-object-row--pressed" : "",
    l ? "mds-object-row--disabled" : "",
    x ? "" : "mds-object-row--passive",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    x ? "button" : "div",
    {
      ref: p,
      id: c,
      style: u,
      type: x ? "button" : void 0,
      className: k,
      disabled: x ? l : void 0,
      ...x ? f : {},
      ...g,
      children: [
        be(t) ? (
          /* ت4 (1.7): a NON-entity row (an action, a setting) starts with its
             icon 20 in text-secondary — no 44 mark box, a row-plain height. */
          /* @__PURE__ */ e("span", { className: "mds-object-row-icon", "aria-hidden": "true", children: t })
        ) : /* @__PURE__ */ e(C, { size: "md", tone: n, value: typeof t == "string" ? t : a }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-object-row-title mds-type-body-strong", children: a }),
          i ? /* @__PURE__ */ e("span", { className: "mds-object-row-caption mds-type-caption", children: i }) : null
        ] }),
        r !== void 0 || s ? /* @__PURE__ */ o("span", { className: "mds-object-row-end", children: [
          r !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-object-row-value mds-type-amount-row", children: typeof r == "string" ? /* @__PURE__ */ e("bdi", { dir: "ltr", children: r }) : (
            /* A Money node renders itself (its own LTR isolation, sign,
               unit and hidden-amounts behaviour) — never re-wrapped. */
            r
          ) }) : null,
          s ? /* @__PURE__ */ e("span", { className: "mds-object-row-time mds-type-caption", children: s }) : null
        ] }) : null
      ]
    }
  );
}
const Yi = [
  "default",
  "oneLine",
  "withBadge",
  "pressed",
  "focused",
  "disabled"
];
function _i({
  leading: t,
  tone: n,
  label: a,
  caption: i,
  value: r,
  state: s,
  href: d,
  children: l,
  onPress: m,
  disabled: c = !1,
  className: u,
  id: p,
  style: g,
  ref: h,
  ...f
}) {
  const { isPressed: x, pressProps: k } = B({ onPress: () => m?.(), disabled: c }), v = m !== void 0 || d !== void 0, N = l != null, w = d ? "a" : v ? "button" : "div", H = [
    "mds-object-card",
    x ? "mds-object-card--pressed" : "",
    c ? "mds-object-card--disabled" : "",
    N ? "mds-object-card--with-action" : "",
    v ? "" : "mds-object-card--passive",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: h, id: p, style: g, className: ["mds-object-card-wrap", c ? "mds-object-card-wrap--disabled" : "", u].filter(Boolean).join(" "), ...f, children: [
    /* @__PURE__ */ o(
      w,
      {
        className: H,
        href: d,
        type: w === "button" ? "button" : void 0,
        disabled: w === "button" ? c : void 0,
        ...v ? k : {},
        children: [
          /* @__PURE__ */ o("span", { className: "mds-object-card-mark", children: [
            /* @__PURE__ */ e(C, { size: "lg", tone: n, value: typeof t == "string" ? t : a, children: typeof t == "string" ? void 0 : t }),
            s ? /* @__PURE__ */ e("span", { className: "mds-object-card-state", children: s }) : null
          ] }),
          /* @__PURE__ */ o("span", { className: "mds-object-card-body", children: [
            /* @__PURE__ */ e("span", { className: "mds-object-card-title", children: a }),
            i ? /* @__PURE__ */ e("span", { className: "mds-object-card-caption mds-type-caption", children: i }) : null,
            r !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-object-card-value mds-type-amount-row", children: typeof r == "string" ? /* @__PURE__ */ e("bdi", { dir: "ltr", children: r }) : (
              /* A Money node renders itself (its own isolation, sign,
                 unit and hidden-amounts behaviour) — never re-wrapped. */
              r
            ) }) : null
          ] })
        ]
      }
    ),
    N ? /* @__PURE__ */ e("span", { className: "mds-object-card-action", children: l }) : null
  ] });
}
const Wi = [
  "default",
  "withBadge",
  "withButton",
  "pressed",
  "focused",
  "disabled"
];
function ua(t) {
  const n = t.indexOf(".");
  return n === -1 ? { whole: t, cents: "" } : { whole: t.slice(0, n), cents: t.slice(n) };
}
function ha({
  label: t,
  size: n = "lg",
  value: a,
  trailing: i,
  direction: r,
  debt: s,
  onDismiss: d,
  loading: l = !1,
  className: m,
  id: c,
  style: u,
  ref: p,
  ...g
}) {
  const { isPressed: h, pressProps: f } = B({ onPress: () => d?.() }), { hidden: x } = L(), k = x && a !== void 0 && a !== null && !l, { whole: v, cents: N } = ua(k ? "—" : a ?? "—"), w = ["mds-metric", m].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: p, id: c, style: u, className: w, ...g, children: [
    /* @__PURE__ */ e("span", { className: "mds-metric-label mds-type-label", children: t }),
    /* @__PURE__ */ e("p", { className: "mds-metric-amount", children: l ? /* @__PURE__ */ e("span", { className: "mds-metric-skeleton", "aria-busy": "true" }) : k ? /* @__PURE__ */ o(P, { children: [
      /* @__PURE__ */ o(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero mds-metric-value--hidden",
            n === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          "data-ds-check": "amount-hidden",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ e("bdi", { dir: "ltr", children: /* @__PURE__ */ e("span", { className: "mds-metric-value-whole", children: S.hiddenGlyph }) }),
            i ? /* @__PURE__ */ e("span", { className: "mds-metric-unit", children: i }) : null
          ]
        }
      ),
      /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: S.hidden })
    ] }) : /* @__PURE__ */ o(P, { children: [
      /* @__PURE__ */ e(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero",
            n === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          children: /* @__PURE__ */ o("bdi", { dir: "ltr", children: [
            /* @__PURE__ */ e("span", { className: "mds-metric-value-whole", children: v }),
            N ? /* @__PURE__ */ e("span", { className: "mds-metric-value-cents", children: N }) : null
          ] })
        }
      ),
      i ? /* @__PURE__ */ e("span", { className: "mds-metric-unit", children: i }) : null
    ] }) }),
    r && !l ? /* @__PURE__ */ e("p", { className: "mds-metric-diff", children: r }) : null,
    s && !l ? /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        className: ["mds-metric-source", h ? "mds-metric-source--pressed" : ""].filter(Boolean).join(" "),
        "data-ds-exempt": "",
        ...f,
        children: s
      }
    ) : null
  ] });
}
const zi = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function Gi({ size: t, ...n }) {
  return /* @__PURE__ */ e(ha, { ...n, size: "sm", className: ["mds-metric-small", n.className].filter(Boolean).join(" ") });
}
const Qi = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
], ee = /* @__PURE__ */ new Set();
function pa({
  label: t,
  variant: n = "detail",
  children: a,
  onDismiss: i,
  className: r,
  id: s,
  style: d,
  ref: l,
  ...m
}) {
  const c = Z(null), [u, p] = E(0), [g, h] = E(!1), [f, x] = E(!1), k = Z(0), v = Z(0), N = Z(0), w = Z(null), H = Z(i);
  q(() => {
    H.current = i;
  }, [i]);
  const F = D(() => {
    w.current?.focus?.(), H.current();
  }, []), [V] = E(() => /* @__PURE__ */ Symbol("sheet")), [ce] = E(() => (ee.add(V), ee.size >= 2 ? 2 : 1));
  q(
    () => () => {
      ee.delete(V);
    },
    [V]
  );
  const je = () => {
    const A = c.current?.querySelector(".mds-sheet-panel");
    return A ? A.getBoundingClientRect().height * 0.3 : 0;
  }, _ = D(() => {
    if (f) return;
    w.current = document.activeElement ?? null, x(!0), (typeof requestAnimationFrame == "function" ? requestAnimationFrame : (M) => setTimeout(() => M(performance.now()), 0))(() => {
      const M = c.current?.querySelector(".mds-sheet-panel");
      if (!M) {
        F();
        return;
      }
      const $ = getComputedStyle(M).transitionDuration, he = $ && $ !== "0s" && $ !== "";
      if (M.style.transform = "translateY(100%)", !he) {
        F();
        return;
      }
      const W = (Pe) => {
        Pe.propertyName === "transform" && (M.removeEventListener("transitionend", W), F());
      };
      M.addEventListener("transitionend", W);
    });
  }, [f, F]), Me = (A) => {
    if (!g) return;
    const M = performance.now(), $ = M - N.current;
    $ > 0 && (k.current = (A.clientY - v.current) / $), v.current = A.clientY, N.current = M, p(Math.max(0, A.clientY - me.current));
  }, me = Z(0), Ze = (A) => {
    const M = A.target, $ = c.current?.querySelector(".mds-sheet-body");
    if (!($?.contains(M) && $ && $.scrollTop > 0)) {
      if (f) {
        const W = c.current?.querySelector(".mds-sheet-panel");
        W && (W.style.transform = u ? `translateY(${u}px)` : ""), x(!1);
      }
      k.current = 0, v.current = A.clientY, N.current = performance.now(), h(!0), A.currentTarget.setPointerCapture?.(A.pointerId);
    }
  }, ue = () => {
    if (!g) return;
    h(!1);
    const A = u > je(), M = k.current > 0.6;
    A || M ? _() : p(0);
  };
  q(() => {
    const A = (M) => {
      M.key === "Escape" && _();
    };
    return window.addEventListener("keydown", A), () => window.removeEventListener("keydown", A);
  }, [_]);
  const Ce = [
    "mds-sheet",
    n === "form" ? "mds-sheet--form" : "",
    ce === 2 ? "mds-sheet--stacked" : "",
    g ? "mds-sheet--dragging" : "",
    f ? "mds-sheet--closing" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "div",
    {
      ref: (A) => {
        c.current = A, typeof l == "function" ? l(A) : l && (l.current = A);
      },
      id: s,
      style: d,
      className: Ce,
      "data-ds-sheet-level": String(ce),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": t,
      ...m,
      children: [
        /* @__PURE__ */ e(
          "div",
          {
            className: "mds-sheet-scrim",
            onClick: () => _(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ o(
          "div",
          {
            className: "mds-sheet-panel",
            style: u ? { transform: `translateY(${u}px)` } : void 0,
            children: [
              /* @__PURE__ */ o(
                "div",
                {
                  className: "mds-sheet-grab",
                  onPointerDown: (A) => {
                    me.current = A.clientY - u, Ze(A);
                  },
                  onPointerMove: Me,
                  onPointerUp: ue,
                  onPointerCancel: ue,
                  children: [
                    /* @__PURE__ */ e("span", { className: "mds-sheet-handle", "aria-hidden": "true" }),
                    /* @__PURE__ */ e("header", { className: "mds-sheet-header", children: /* @__PURE__ */ e("h2", { className: "mds-sheet-title mds-type-title-section", children: t }) })
                  ]
                }
              ),
              /* @__PURE__ */ e("div", { className: "mds-sheet-close", children: /* @__PURE__ */ e(aa, { label: t, onPress: _, children: /* @__PURE__ */ e(wt, {}) }) }),
              /* @__PURE__ */ e("div", { className: "mds-sheet-body", children: a })
            ]
          }
        )
      ]
    }
  );
}
const Ui = [
  "default",
  "open",
  "dragging",
  "pastThreshold",
  "stacked"
];
function Xi({
  label: t,
  caption: n,
  value: a,
  onPress: i,
  onDismiss: r,
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  const u = Z(null);
  return q(() => {
    u.current?.focus();
  }, []), /* @__PURE__ */ e(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-confirm-sheet", s].filter(Boolean).join(" "),
      ...c,
      children: /* @__PURE__ */ o(
        pa,
        {
          label: t,
          onDismiss: r,
          className: "mds-confirm-sheet__sheet",
          role: "alertdialog",
          "data-ds-check": "confirm-sheet",
          children: [
            /* @__PURE__ */ o("div", { className: "mds-confirm-sheet-head", children: [
              /* @__PURE__ */ e("span", { className: "mds-confirm-sheet-icon", children: /* @__PURE__ */ e(Jt, {}) }),
              /* @__PURE__ */ e("h2", { className: "mds-confirm-sheet-title mds-type-title-section", children: t }),
              /* @__PURE__ */ e("p", { className: "mds-confirm-sheet-sentence", children: n })
            ] }),
            /* @__PURE__ */ o("div", { className: "mds-confirm-sheet-actions", children: [
              /* @__PURE__ */ e(
                Q,
                {
                  ref: u,
                  variant: "secondary",
                  className: "mds-confirm-sheet-back",
                  onPress: r,
                  children: b["button.back"].text
                }
              ),
              /* @__PURE__ */ e(Q, { variant: "danger", className: "mds-confirm-sheet-confirm", onPress: i, children: a })
            ] })
          ]
        }
      )
    }
  );
}
const Ki = [
  "default",
  "focused",
  "pressed"
];
function Ji({
  label: t,
  onPress: n,
  loading: a = !1,
  disabled: i = !1,
  caption: r,
  onRetry: s,
  leading: d = !0,
  trailing: l,
  className: m,
  id: c,
  style: u,
  ref: p,
  ...g
}) {
  const h = Je(), f = h.keyboardHeight > 0 ? {
    bottom: `calc(${h.keyboardHeight}px + env(safe-area-inset-bottom))`
  } : void 0, x = ["mds-action-bar", d ? "mds-action-bar--more" : "", m].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "div",
    {
      ref: p,
      id: c,
      style: { ...f, ...u },
      className: x,
      role: "group",
      "aria-label": t,
      ...g,
      children: [
        r ? /* @__PURE__ */ e(Q, { variant: "text", onPress: s, className: "mds-action-bar-secondary", children: r }) : null,
        /* @__PURE__ */ e(
          Q,
          {
            variant: "primary",
            onPress: n,
            loading: a,
            disabled: i,
            leading: l,
            className: "mds-action-bar-primary",
            children: t
          }
        )
      ]
    }
  );
}
const er = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "loading",
  "contentMore",
  "scrolledToEnd",
  "keyboardOpen"
];
function tr({
  selected: t = !1,
  onPress: n,
  onLongPress: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const { isPressed: m, pressProps: c } = B({ onPress: n, onLongPress: a }), u = t ? b["sr.askUnread"].text : b["sr.ask"].text, p = ["mds-ask-button", m ? "mds-ask-button--pressed" : "", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: d,
      id: r,
      style: s,
      type: "button",
      className: p,
      "aria-label": u,
      ...l,
      ...c,
      children: [
        /* @__PURE__ */ e(at, { size: 28 }),
        t ? /* @__PURE__ */ e("span", { className: "mds-ask-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const nr = [
  "default",
  "pressed",
  "focused",
  "unreadDot",
  "longPressRecording"
];
function ar({
  value: t = 0,
  label: n,
  onPress: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const { isPressed: m, pressProps: c } = B({ onPress: a }), u = Re(t, Ee.unread), p = n ?? (t > 0 ? j("sr.notificationsCount", { counted: u }) : j("sr.notifications")), g = [
    "mds-notifications-button",
    m ? "mds-notifications-button--pressed" : "",
    t > 0 ? "mds-notifications-button--unread" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: d,
      id: r,
      style: s,
      type: "button",
      className: g,
      "aria-label": p,
      ...l,
      ...c,
      children: [
        /* @__PURE__ */ e(mt, {}),
        t > 0 ? /* @__PURE__ */ e("span", { className: "mds-notifications-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const ir = [
  "default",
  "pressed",
  "focused",
  "unreadDot"
];
function rr({
  label: t,
  caption: n,
  locked: a = !1,
  onPress: i,
  className: r,
  id: s,
  style: d,
  ref: l,
  ...m
}) {
  const { isPressed: c, pressProps: u } = B({ onPress: i }), p = [
    "mds-project-switcher",
    c ? "mds-project-switcher--pressed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: l,
      id: s,
      style: d,
      type: "button",
      className: p,
      ...m,
      ...u,
      children: [
        /* @__PURE__ */ e(C, { size: "sm", variant: "canvas", value: t }),
        /* @__PURE__ */ o("span", { className: "mds-project-switcher-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-project-switcher-name mds-type-body-strong", children: t }),
          n ? /* @__PURE__ */ e("span", { className: "mds-project-switcher-role", children: n }) : null
        ] }),
        a ? null : /* @__PURE__ */ e(kt, { className: "mds-project-switcher-caret" })
      ]
    }
  );
}
const sr = [
  "default",
  "pressed",
  "focused",
  "withCaret",
  "singleRoleNoCaret"
];
function dr({
  leading: t,
  trailing: n,
  caption: a = !1,
  label: i,
  className: r,
  id: s,
  style: d,
  ref: l,
  children: m,
  ...c
}) {
  const u = [
    "mds-context-bar",
    a ? "mds-context-bar--scrolled" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "div",
    {
      ref: l,
      id: s,
      style: d,
      className: u,
      role: "banner",
      "aria-label": i,
      ...c,
      children: [
        /* @__PURE__ */ e("div", { className: "mds-context-bar-start", children: t ?? m }),
        /* @__PURE__ */ e("div", { className: "mds-context-bar-end", children: n })
      ]
    }
  );
}
const lr = [
  "default",
  "mainScreenSwitcher",
  "subScreenBack",
  "scrolledHairline",
  "notScrolled"
];
function or({
  label: t,
  selected: n = !1,
  leading: a,
  onPress: i,
  className: r,
  ref: s,
  ...d
}) {
  const { isPressed: l, pressProps: m } = B({ onPress: i }), c = [
    "mds-tab",
    n ? "mds-tab--active" : "",
    l ? "mds-tab--pressed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: s,
      type: "button",
      role: "tab",
      className: c,
      "aria-selected": n,
      "aria-current": n ? "page" : void 0,
      tabIndex: n ? 0 : -1,
      ...d,
      ...m,
      children: [
        a ? /* @__PURE__ */ e("span", { className: "mds-tab-icon", "aria-hidden": "true", children: a }) : null,
        /* @__PURE__ */ e("span", { className: "mds-tab-label", children: t })
      ]
    }
  );
}
function cr({
  children: t,
  value: n,
  onChange: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = $e.toArray(t), c = m.some(
    (p) => p && typeof p == "object" && "props" in p && p.props.selected !== void 0
  ), u = n ?? 0;
  return /* @__PURE__ */ e(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: ["mds-tab-bar", i].filter(Boolean).join(" "),
      role: "tablist",
      ...l,
      children: m.map((p, g) => {
        if (p && typeof p == "object" && "props" in p) {
          const h = p.props, f = c ? h.selected === !0 : g === u;
          return {
            ...p,
            props: { ...h, selected: f, onPress: () => {
              h.onPress?.(), a?.(g);
            } }
          };
        }
        return p;
      })
    }
  );
}
const mr = [
  "default",
  "activeFill",
  "pressed",
  "focused",
  "fiveTabs",
  "twoTabs"
];
function ur({
  label: t,
  leading: n,
  caption: a = !1,
  trailing: i,
  className: r,
  id: s,
  style: d,
  ref: l,
  ...m
}) {
  const c = [
    "mds-page-header",
    a && n ? "mds-page-header--collapsed" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("header", { ref: l, id: s, style: d, className: c, ...m, children: [
    n,
    /* @__PURE__ */ e("h1", { className: "mds-page-header-title", children: t }),
    i ? /* @__PURE__ */ e("div", { className: "mds-page-header-end", children: i }) : null
  ] });
}
const hr = [
  "default",
  "mainScreen",
  "subScreenBack",
  "collapsedOnScroll",
  "withTrailing"
], ga = {
  draft: j("saveState.draft"),
  sending: j("saveState.sending"),
  saved: j("saveState.saved"),
  failed: j("saveState.failed")
};
function pr({
  saveState: t,
  className: n,
  id: a,
  style: i,
  ref: r,
  ...s
}) {
  const d = [
    "mds-save-state",
    `mds-save-state--${t}`,
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "span",
    {
      ref: r,
      id: a,
      style: i,
      className: d,
      role: t === "failed" ? "alert" : void 0,
      "aria-busy": t === "sending" || void 0,
      ...s,
      children: [
        t === "draft" ? /* @__PURE__ */ e(Ft, { size: 14 }) : t === "saved" ? /* @__PURE__ */ e("span", { className: "mds-save-state-icon", children: /* @__PURE__ */ e(Ae, { size: 14 }) }) : t === "failed" ? /* @__PURE__ */ e(le, { size: 14 }) : null,
        /* @__PURE__ */ e("span", { className: "mds-save-state-text", children: ga[t] }),
        t === "saved" ? /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: j("sr.saveSaved") }) : null,
        t === "failed" ? /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: j("sr.saveFailed") }) : null
      ]
    }
  );
}
const gr = [
  "draft",
  "sending",
  "saved",
  "failed"
];
function br({
  label: t,
  trailing: n,
  onDismiss: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = Z(null), c = Z(0), u = Z(0), p = n ? 5e3 : 3e3;
  q(() => (c.current = p, u.current = Date.now(), m.current = window.setTimeout(() => a?.(), p), () => {
    m.current && window.clearTimeout(m.current), m.current = null;
  }), [t, p]);
  const g = () => {
    m.current && (window.clearTimeout(m.current), m.current = null, c.current -= Date.now() - u.current);
  }, h = () => {
    m.current || (u.current = Date.now(), m.current = window.setTimeout(() => a?.(), Math.max(0, c.current)));
  };
  return /* @__PURE__ */ o(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: ["mds-toast", i].filter(Boolean).join(" "),
      role: "status",
      onFocus: g,
      onBlur: h,
      ...l,
      children: [
        /* @__PURE__ */ e("span", { className: "mds-toast-text", children: t }),
        n ? /* @__PURE__ */ e("span", { className: "mds-toast-action", children: n }) : null
      ]
    }
  );
}
const fr = ["default", "withAction", "focusedPaused"], ba = {
  offline: Rt,
  locked: Ot,
  info: _t
};
function xr({
  tone: t,
  label: n,
  trailing: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = ba[t];
  return /* @__PURE__ */ o(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: ["mds-inline-banner", `mds-inline-banner--${t}`, i].filter(Boolean).join(" "),
      role: "status",
      ...l,
      children: [
        /* @__PURE__ */ e(m, {}),
        /* @__PURE__ */ e("span", { className: "mds-inline-banner-text", children: n }),
        a ? /* @__PURE__ */ e("span", { className: "mds-inline-banner-action", children: a }) : null
      ]
    }
  );
}
const kr = ["offline", "locked", "info", "withAction"];
function oe({
  label: t,
  trailing: n,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  return /* @__PURE__ */ o(
    "div",
    {
      ref: s,
      id: i,
      style: r,
      className: ["mds-empty-state", a].filter(Boolean).join(" "),
      ...d,
      children: [
        /* @__PURE__ */ e("p", { className: "mds-empty-state-sentence", children: t }),
        n ? /* @__PURE__ */ e("div", { className: "mds-empty-state-action", children: n }) : null
      ]
    }
  );
}
const vr = ["default", "withAction"];
function y({
  variant: t,
  className: n,
  id: a,
  style: i,
  ref: r,
  ...s
}) {
  return /* @__PURE__ */ e(
    "span",
    {
      ref: r,
      id: a,
      style: i,
      "aria-hidden": "true",
      className: ["mds-skeleton", `mds-skeleton--${t}`, n].filter(Boolean).join(" "),
      ...s
    }
  );
}
const wr = ["body", "caption", "hero", "mark"];
function yr({
  label: t,
  caption: n,
  value: a,
  direction: i,
  draft: r = !1,
  time: s,
  onPress: d,
  onLongPress: l,
  state: m = "idle",
  disabled: c = !1,
  trailing: u,
  className: p,
  id: g,
  style: h,
  ref: f,
  ...x
}) {
  const { isPressed: k, pressProps: v } = B({ onPress: d, onLongPress: l, disabled: c });
  if (m === "loading")
    return /* @__PURE__ */ o("div", { className: "mds-movement-row mds-movement-row--loading mds-object-row", "aria-busy": "true", id: g, style: h, ref: f, children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(y, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-movement-row-text", children: [
        /* @__PURE__ */ e(y, { variant: "body" }),
        /* @__PURE__ */ e(y, { variant: "caption" })
      ] }),
      /* @__PURE__ */ e("span", { className: "mds-movement-row-end", children: /* @__PURE__ */ e(y, { variant: "caption" }) })
    ] });
  const N = [
    "mds-movement-row",
    "mds-object-row",
    k ? "mds-object-row--pressed" : "",
    c ? "mds-object-row--disabled" : "",
    "mds-movement-row--" + i,
    p
  ].filter(Boolean).join(" "), w = [
    i === "out" ? b["sr.movementRowOut"].text : b["sr.movementRowIn"].text,
    t,
    n,
    a == null ? b["money.ariaMissing"].text : "",
    r ? b["state.draft"].text : s ?? ""
  ].filter(Boolean).join(b["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "button",
    {
      ref: f,
      id: g,
      style: h,
      type: "button",
      className: N,
      disabled: c,
      "aria-label": w,
      "data-ds-check": "movement-row",
      ...v,
      ...x,
      children: [
        /* @__PURE__ */ e(C, { children: i === "in" ? /* @__PURE__ */ e(Mn, { size: 24 }) : /* @__PURE__ */ e(Cn, { size: 24 }) }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-object-row-title mds-type-body-strong", children: t }),
          n ? /* @__PURE__ */ e("span", { className: "mds-object-row-caption mds-type-caption", children: n }) : null
        ] }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-end", children: [
          /* @__PURE__ */ e("span", { className: "mds-object-row-value mds-type-amount-row", children: /* @__PURE__ */ e(I, { value: a, flow: i }) }),
          /* @__PURE__ */ e("span", { className: "mds-object-row-time mds-type-caption", children: r ? /* @__PURE__ */ e(R, { tone: "waiting", label: b["state.draft"].text }) : u ?? s })
        ] })
      ]
    }
  );
}
const Nr = [
  "in",
  "out",
  "draft",
  "hidden",
  "loading"
];
function Ar({
  from: t,
  to: n,
  caption: a,
  value: i,
  time: r,
  onPress: s,
  onLongPress: d,
  state: l = "idle",
  disabled: m = !1,
  className: c,
  id: u,
  style: p,
  ref: g,
  ...h
}) {
  const { isPressed: f, pressProps: x } = B({ onPress: s, onLongPress: d, disabled: m });
  if (l === "loading")
    return /* @__PURE__ */ o("div", { className: "mds-transfer-row mds-transfer-row--loading mds-object-row", "aria-busy": "true", id: u, style: p, ref: g, children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(y, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-transfer-row-text", children: [
        /* @__PURE__ */ e(y, { variant: "body" }),
        /* @__PURE__ */ e(y, { variant: "caption" })
      ] }),
      /* @__PURE__ */ e("span", { className: "mds-transfer-row-end", children: /* @__PURE__ */ e(y, { variant: "caption" }) })
    ] });
  const k = [
    "mds-transfer-row",
    "mds-object-row",
    f ? "mds-object-row--pressed" : "",
    m ? "mds-object-row--disabled" : "",
    c
  ].filter(Boolean).join(" "), v = [
    j("sr.transferFrom", { from: t, to: n }),
    a,
    i == null ? b["money.ariaMissing"].text : "",
    r ?? ""
  ].filter(Boolean).join(b["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "button",
    {
      ref: g,
      type: "button",
      id: u,
      style: p,
      className: k,
      disabled: m,
      "aria-label": v,
      "data-ds-check": "transfer-row",
      ...x,
      ...h,
      children: [
        /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(ln, { size: 24 }) }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-object-row-title mds-type-body-strong", children: /* @__PURE__ */ o("span", { className: "mds-transfer-row-route", children: [
            t,
            /* @__PURE__ */ e("span", { className: "mds-transfer-row-arrow", "aria-hidden": "true", children: b["transfer.arrow"].text }),
            n
          ] }) }),
          a ? /* @__PURE__ */ e("span", { className: "mds-object-row-caption mds-type-caption", children: a }) : null
        ] }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-end", children: [
          /* @__PURE__ */ e("span", { className: "mds-object-row-value mds-type-amount-row", children: /* @__PURE__ */ e(I, { value: i, flow: "transfer" }) }),
          r ? /* @__PURE__ */ e("span", { className: "mds-object-row-time mds-type-caption", children: r }) : null
        ] })
      ]
    }
  );
}
const Sr = [
  "default",
  "noCaption",
  "hidden",
  "loading"
], fa = {
  cash: tn,
  bank: an,
  wallet: sn
};
function Br({
  label: t,
  variant: n = "cash",
  value: a,
  caption: i,
  draft: r = !1,
  onPress: s,
  state: d = "idle",
  className: l,
  id: m,
  style: c,
  ref: u,
  ...p
}) {
  const { hidden: g } = L(), h = d === "loading", f = fa[n], { isPressed: x, pressProps: k } = B({ onPress: s, disabled: h }), v = [
    t,
    b["fund.balanceWord"].text,
    r ? b["sr.fundHasDraft"].text : ""
  ].filter(Boolean).join(b["sr.listSeparator"].text), N = [
    "mds-card-shell",
    "mds-fund-card",
    x ? "mds-card-shell--pressed" : "",
    h ? "mds-fund-card--loading" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: u,
      type: "button",
      id: m,
      style: c,
      className: N,
      "aria-label": v,
      disabled: h,
      "data-ds-check": "fund-card",
      ...k,
      ...p,
      children: [
        /* @__PURE__ */ o("span", { className: "mds-fund-card-header", children: [
          /* @__PURE__ */ e(C, { size: "sm", children: /* @__PURE__ */ e(f, { size: 16 }) }),
          /* @__PURE__ */ e("span", { className: "mds-fund-card-name mds-type-body-strong", children: t }),
          r ? /* @__PURE__ */ e("span", { className: "mds-fund-card-dot", "aria-hidden": "true" }) : null
        ] }),
        /* @__PURE__ */ e("span", { className: "mds-fund-card-balance", children: h ? /* @__PURE__ */ o(P, { children: [
          /* @__PURE__ */ e(y, { variant: "hero" }),
          /* @__PURE__ */ e(y, { variant: "caption" })
        ] }) : g ? /* @__PURE__ */ e(I, { value: a, size: "lg" }) : /* @__PURE__ */ o(P, { children: [
          /* @__PURE__ */ e(I, { value: a, size: "lg" }),
          i ? /* @__PURE__ */ e("span", { className: "mds-fund-card-last mds-type-caption", children: i }) : null
        ] }) })
      ]
    }
  );
}
const Hr = [
  "cash",
  "bank",
  "wallet",
  "negative",
  "draft",
  "loading"
];
function fe(t) {
  if (t == null) return null;
  const n = String(t).replace(/[^0-9.]/g, "");
  if (!n || n === ".") return null;
  const a = Number(n);
  return Number.isFinite(a) ? Math.round(a * 1e3) : null;
}
function xa({
  value: t,
  total: n,
  state: a = "idle",
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const { hidden: m } = L(), c = m && a !== "loading", u = a === "loading", p = fe(t), g = fe(n), h = g !== null && g > 0 && p !== null && p >= 0, f = h ? Math.min(p, g) : 0, x = h ? g : 1, k = Math.round(f / x * 1e3) / 10, v = Math.max(x - f, 0), N = [
    "mds-payment-progress",
    c ? "mds-payment-progress--hidden" : "",
    u ? "mds-payment-progress--loading" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: N,
      role: c || u ? void 0 : "progressbar",
      "aria-label": j("sr.debtProgress", {
        paid: T(t, { texts: S }).aria,
        total: T(n, { texts: S }).aria
      }),
      "aria-valuenow": c || u ? void 0 : k,
      "aria-valuemin": c || u ? void 0 : 0,
      "aria-valuemax": c || u ? void 0 : 100,
      "aria-busy": u || void 0,
      ...l,
      children: c ? /* @__PURE__ */ e("span", { className: "mds-payment-progress-hidden mds-type-caption", children: S.hidden }) : /* @__PURE__ */ o(P, { children: [
        /* @__PURE__ */ e("span", { className: "mds-payment-progress-track", children: /* @__PURE__ */ e(
          "span",
          {
            className: "mds-payment-progress-fill",
            style: { "--mds-payment-progress-share": `${k}%` }
          }
        ) }),
        /* @__PURE__ */ o("span", { className: "mds-payment-progress-line", children: [
          j("payment.paid"),
          " ",
          /* @__PURE__ */ e("span", { className: "mds-payment-progress-amount", children: /* @__PURE__ */ e(I, { value: f / 1e3 }) }),
          " · ",
          j("payment.remaining"),
          " ",
          /* @__PURE__ */ e("span", { className: "mds-payment-progress-amount", children: /* @__PURE__ */ e(I, { value: v / 1e3 }) })
        ] })
      ] })
    }
  );
}
const jr = [
  "partial",
  "zero",
  "complete",
  "hidden"
];
function Mr({
  label: t,
  value: n,
  debt: a,
  caption: i,
  paid: r,
  total: s,
  tone: d,
  markTone: l,
  action: m,
  onPress: c,
  state: u = "idle",
  className: p,
  id: g,
  style: h,
  ref: f,
  ...x
}) {
  const { hidden: k } = L(), v = u === "loading", { isPressed: N, pressProps: w } = B({ onPress: c, disabled: v }), H = a === "owed-to-you" ? "forYou" : "againstYou";
  if (v)
    return /* @__PURE__ */ e("div", { className: "mds-debt-card mds-debt-card--loading", "aria-busy": "true", id: g, style: h, ref: f, children: /* @__PURE__ */ o("span", { className: "mds-debt-card-head", children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(y, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-debt-card-id", children: [
        /* @__PURE__ */ e(y, { variant: "body" }),
        /* @__PURE__ */ e(y, { variant: "caption" })
      ] }),
      /* @__PURE__ */ e("span", { className: "mds-debt-card-end", children: /* @__PURE__ */ e(y, { variant: "caption" }) })
    ] }) });
  const F = [
    t,
    T(n, { debt: H, texts: S }).aria,
    i,
    r !== void 0 && s !== void 0 ? b["sr.debtProgress"].text.replace("{paid}", T(r, { texts: S }).aria).replace("{total}", T(s, { texts: S }).aria) : "",
    d === "overdue" ? b["debt.overdue"].text : "",
    d === "done" ? b["debt.settled"].text : ""
  ].filter(Boolean).join(b["sr.listSeparator"].text), V = [
    "mds-card-shell",
    "mds-debt-card",
    N ? "mds-card-shell--pressed" : "",
    p
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: f,
      type: "button",
      id: g,
      style: h,
      className: V,
      "aria-label": F,
      "data-ds-check": "debt-card",
      ...w,
      ...x,
      children: [
        /* @__PURE__ */ o("span", { className: "mds-debt-card-head", children: [
          /* @__PURE__ */ e(C, { tone: l, value: t }),
          /* @__PURE__ */ o("span", { className: "mds-debt-card-id", children: [
            /* @__PURE__ */ e("span", { className: "mds-type-body-strong", children: t }),
            i ? /* @__PURE__ */ e("span", { className: "mds-type-caption", children: i }) : null
          ] }),
          /* @__PURE__ */ o("span", { className: "mds-debt-card-end", children: [
            /* @__PURE__ */ e("span", { className: "mds-type-amount-row", children: /* @__PURE__ */ e(I, { value: n, debt: H }) }),
            d === "overdue" ? /* @__PURE__ */ e(R, { tone: "waiting", label: b["debt.overdue"].text }) : null,
            d === "done" ? /* @__PURE__ */ e(R, { tone: "done", label: b["debt.settled"].text }) : null
          ] })
        ] }),
        !k && r !== void 0 && s !== void 0 && d !== "done" ? /* @__PURE__ */ e("span", { className: "mds-debt-card-progress", children: /* @__PURE__ */ e(xa, { value: r, total: s }) }) : null,
        d !== "done" && m ? /* @__PURE__ */ e("span", { className: "mds-debt-card-action", children: m }) : null
      ]
    }
  );
}
const Zr = [
  "forYou",
  "againstYou",
  "overdue",
  "settled",
  "hidden",
  "loading"
];
function xe({
  label: t,
  counted: n,
  value: a,
  loading: i
}) {
  return /* @__PURE__ */ o("span", { className: "mds-debt-summary-col", children: [
    /* @__PURE__ */ e("span", { className: "mds-debt-summary-label mds-type-label", children: t }),
    i ? /* @__PURE__ */ e(y, { variant: "hero" }) : /* @__PURE__ */ e(I, { value: a, size: "lg" }),
    i ? /* @__PURE__ */ e(y, { variant: "caption" }) : /* @__PURE__ */ e("span", { className: "mds-debt-summary-count mds-type-caption", children: n })
  ] });
}
function Cr({
  forYou: t,
  againstYou: n,
  state: a = "idle",
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = a === "loading", c = [
    b["debt.forYou"].text,
    T(t.value, { texts: S }).aria,
    t.counted
  ].join(" "), u = [
    b["debt.againstYou"].text,
    T(n.value, { texts: S }).aria,
    n.counted
  ].join(" ");
  return /* @__PURE__ */ o(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: ["mds-debt-summary", m ? "mds-debt-summary--loading" : "", i].filter(Boolean).join(" "),
      role: "group",
      "aria-label": `${c}. ${u}.`,
      "data-ds-check": "debt-summary",
      ...l,
      children: [
        /* @__PURE__ */ e(xe, { label: b["debt.forYou"].text, counted: t.counted, value: t.value, loading: m }),
        /* @__PURE__ */ e(xe, { label: b["debt.againstYou"].text, counted: n.counted, value: n.value, loading: m })
      ]
    }
  );
}
const Pr = [
  "columns",
  "zero",
  "wrapped",
  "hidden",
  "loading"
];
function Tr({
  label: t,
  caption: n,
  value: a,
  time: i,
  tone: r,
  badge: s,
  cancelled: d = !1,
  action: l,
  onPress: m,
  state: c = "idle",
  className: u,
  id: p,
  style: g,
  ref: h,
  ...f
}) {
  const x = c === "loading", { isPressed: k, pressProps: v } = B({ onPress: m, disabled: x });
  if (x)
    return /* @__PURE__ */ e("div", { className: "mds-order-card mds-order-card--loading", "aria-busy": "true", id: p, style: g, ref: h, children: /* @__PURE__ */ o("span", { className: "mds-order-card-head", children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(y, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-order-card-id", children: [
        /* @__PURE__ */ e(y, { variant: "body" }),
        /* @__PURE__ */ e(y, { variant: "caption" })
      ] }),
      /* @__PURE__ */ e("span", { className: "mds-order-card-head", children: /* @__PURE__ */ e(y, { variant: "caption" }) })
    ] }) });
  const N = [
    t,
    n,
    a != null ? T(a, { texts: S }).aria : "",
    i,
    s ? s.props.label ?? "" : r && b[`badge.${r}`] instanceof Object ? b[`badge.${r}`].text : "",
    d ? b["badge.cancelled"].text : ""
  ].filter(Boolean).join(b["sr.listSeparator"].text), w = [
    "mds-card-shell",
    "mds-order-card",
    k ? "mds-card-shell--pressed" : "",
    d ? "mds-order-card--cancelled" : "",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: h,
      type: "button",
      id: p,
      style: g,
      className: w,
      "aria-label": N,
      "data-ds-check": "order-card",
      ...v,
      ...f,
      children: [
        /* @__PURE__ */ o("span", { className: "mds-order-card-head", children: [
          /* @__PURE__ */ e(C, { value: t }),
          /* @__PURE__ */ o("span", { className: "mds-order-card-id", children: [
            /* @__PURE__ */ e("span", { className: "mds-order-card-title mds-type-body-strong", children: t }),
            n ? /* @__PURE__ */ e("span", { className: "mds-object-row-caption mds-type-caption", children: n }) : null
          ] }),
          a !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-type-amount-row", children: /* @__PURE__ */ e(I, { value: a }) }) : null
        ] }),
        i || r || s ? /* @__PURE__ */ o("span", { className: "mds-order-card-time", children: [
          /* @__PURE__ */ e("span", { className: "mds-order-card-time-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(Se, { size: 16 }) }),
          /* @__PURE__ */ e("span", { children: i }),
          s ? /* @__PURE__ */ e("span", { className: "mds-order-card-time-badge", children: s }) : r ? /* @__PURE__ */ e("span", { className: "mds-order-card-time-badge", children: /* @__PURE__ */ e(R, { tone: r }) }) : null
        ] }) : null,
        !d && l ? /* @__PURE__ */ e("span", { className: "mds-order-card-action", children: l }) : null
      ]
    }
  );
}
const Vr = [
  "moment",
  "duration",
  "cancelled",
  "hidden",
  "loading"
];
function ka(t) {
  const n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  return n ? { y: +n[1], m: +n[2], d: +n[3] } : null;
}
function va(t, n, a) {
  const i = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4], r = n < 3 ? t - 1 : t;
  return (r + Math.floor(r / 4) - Math.floor(r / 100) + Math.floor(r / 400) + i[n - 1] + a) % 7;
}
function $r({
  items: t,
  value: n,
  today: a,
  weekStart: i = 0,
  onChange: r,
  state: s = "idle",
  className: d,
  id: l,
  style: m,
  ref: c,
  ...u
}) {
  const p = s === "loading";
  return /* @__PURE__ */ e(
    "div",
    {
      ref: c,
      id: l,
      style: m,
      role: "radiogroup",
      className: ["mds-week-strip", d].filter(Boolean).join(" "),
      "data-ds-check": "week-strip",
      ...u,
      children: t.map((g) => {
        const h = ka(g.date);
        if (!h) return null;
        const f = va(h.y, h.m, h.d), x = n === g.date, k = a === g.date, v = g.items ?? 0, N = b[`day.${f}`] instanceof Object ? b[`day.${f}`].text : String(f), w = b[`month.${h.m}`] instanceof Object ? b[`month.${h.m}`].text : String(h.m), H = [
          `${N} ${h.d} ${w}`,
          k ? b["sr.weekStripToday"].text : "",
          v > 0 ? b["sr.weekStripItems"].text.replace("{counted}", String(v)) : ""
        ].filter(Boolean).join(b["sr.listSeparator"].text);
        return /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": x,
            "aria-label": H,
            className: [
              "mds-week-strip-day",
              x ? "mds-week-strip-day--selected" : "",
              k ? "mds-week-strip-day--today" : ""
            ].filter(Boolean).join(" "),
            onClick: () => r?.(g.date),
            children: [
              /* @__PURE__ */ e("span", { className: "mds-week-strip-name mds-type-micro", children: N }),
              /* @__PURE__ */ e("span", { className: "mds-week-strip-mark", children: h.d }),
              !p && v > 0 ? /* @__PURE__ */ e("span", { className: "mds-week-strip-dots", "aria-hidden": "true", children: v <= 3 ? Array.from({ length: v }, (F, V) => /* @__PURE__ */ e("span", { className: "mds-week-strip-dot" }, V)) : /* @__PURE__ */ e("span", { className: "mds-week-strip-count mds-type-micro", children: v }) }) : /* @__PURE__ */ e("span", { className: "mds-week-strip-dots", "aria-hidden": "true" })
            ]
          },
          g.date
        );
      })
    }
  );
}
const Ir = [
  "plain",
  "todaySelected",
  "dots",
  "loading"
], Y = 64;
function wa(t) {
  return _e({ h: t, m: 0 });
}
function Lr({
  items: t,
  min: n = 8,
  max: a = 20,
  now: i,
  state: r = "idle",
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  const u = r === "loading", p = Array.from({ length: Math.max(0, a - n) }, (x, k) => n + k), g = (x) => (x / 60 - n) * Y;
  if (!u && t.length === 0)
    return /* @__PURE__ */ e(oe, { label: b["agenda.emptyDay"].text });
  const h = [...t].sort((x, k) => x.hour * 60 + (x.startMinutes ?? 0) - (k.hour * 60 + (k.startMinutes ?? 0))), f = [];
  return h.forEach((x, k) => {
    const v = x.hour * 60 + (x.startMinutes ?? 0), N = x.minutes ? v + x.minutes : v, w = f.find((H) => v < H.end && N > H.start);
    w ? (w.items.push(k), w.end = Math.max(w.end, N)) : f.push({ start: v, end: N, items: [k] });
  }), /* @__PURE__ */ o(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-day-timeline", u ? "mds-day-timeline--loading" : "", s].filter(Boolean).join(" "),
      "data-ds-check": "day-timeline",
      ...c,
      children: [
        /* @__PURE__ */ e("div", { className: "mds-day-timeline-hours", "aria-hidden": "true", children: p.map((x) => /* @__PURE__ */ e("div", { className: "mds-day-timeline-hour", children: wa(x) }, x)) }),
        /* @__PURE__ */ e(
          "div",
          {
            className: "mds-day-timeline-area",
            role: "list",
            "aria-label": b["sr.timelineItems"].text,
            style: { height: p.length * Y },
            children: u ? /* @__PURE__ */ e("span", { className: "mds-day-timeline-block mds-day-timeline-block--neutral", style: { insetBlockStart: Y, insetInline: 0, height: Y * 1.5 }, children: /* @__PURE__ */ e(y, { variant: "body" }) }) : /* @__PURE__ */ o(P, { children: [
              f.map((x) => {
                const k = 100 / x.items.length;
                return /* @__PURE__ */ e(
                  "div",
                  {
                    className: "mds-day-timeline-lane",
                    style: {
                      insetInlineStart: 0,
                      width: "100%",
                      top: g(x.start),
                      height: Math.max(x.end - x.start, 0) * (Y / 60)
                    },
                    children: x.items.map((v, N) => {
                      const w = h[v], H = w.hour * 60 + (w.startMinutes ?? 0), F = w.minutes ? H + w.minutes : H, V = [
                        w.time,
                        w.label,
                        w.tone && w.tone !== "neutral" ? b[`badge.${w.tone}`]?.text ?? "" : ""
                      ].filter(Boolean).join(b["sr.listSeparator"].text);
                      return w.minutes ? /* @__PURE__ */ o(
                        "button",
                        {
                          type: "button",
                          role: "listitem",
                          "aria-label": V,
                          className: [
                            "mds-day-timeline-block",
                            `mds-day-timeline-block--${w.tone ?? "neutral"}`
                          ].join(" "),
                          style: {
                            /* Inside the lane each block takes its horizontal
                               share and sits at ITS start (lane-relative top);
                               m24 passes because siblings in one horizontal
                               band are same-duration only when the app says so
                               — mixed heights here are the data, not the row. */
                            top: g(H) - g(x.start),
                            insetInlineStart: `${N * k}%`,
                            width: `calc(${k}% - ${N === 0 ? 0 : 4}px)`,
                            height: Math.max((F - H) * (Y / 60), 32)
                          },
                          onClick: () => w.onPress?.(),
                          children: [
                            /* @__PURE__ */ e("span", { className: "mds-day-timeline-block-title", children: w.label }),
                            /* @__PURE__ */ e("span", { className: "mds-day-timeline-block-time", children: w.time })
                          ]
                        },
                        v
                      ) : /* @__PURE__ */ o(
                        "button",
                        {
                          type: "button",
                          role: "listitem",
                          "aria-label": V,
                          className: "mds-day-timeline-moment",
                          style: {
                            top: g(H) - g(x.start),
                            insetInlineStart: `${N * k}%`,
                            maxWidth: `${k}%`
                          },
                          onClick: () => w.onPress?.(),
                          children: [
                            /* @__PURE__ */ e("span", { className: "mds-day-timeline-moment-dot", "aria-hidden": "true" }),
                            /* @__PURE__ */ o("span", { className: "mds-day-timeline-moment-chip", children: [
                              w.time ? `${w.time} · ` : "",
                              w.label
                            ] })
                          ]
                        },
                        v
                      );
                    })
                  },
                  x.start
                );
              }),
              i !== void 0 && i >= n * 60 && i <= a * 60 ? /* @__PURE__ */ e("div", { className: "mds-day-timeline-now", style: { top: g(i) }, "aria-hidden": "true", children: /* @__PURE__ */ e("span", { className: "mds-day-timeline-now-dot" }) }) : null
            ] })
          }
        )
      ]
    }
  );
}
const Fr = [
  "duration",
  "moment",
  "overlap",
  "nowLine",
  "empty",
  "loading"
];
function Er({
  items: t,
  state: n = "idle",
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  const l = n === "loading", m = t.filter((c) => c.rows.length > 0);
  return l ? /* @__PURE__ */ e("div", { className: "mds-agenda-list mds-agenda-list--loading", "aria-busy": "true", id: i, style: r, ref: s, ...d, children: [0, 1].map((c) => /* @__PURE__ */ o("div", { className: "mds-agenda-list-group", children: [
    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(y, { variant: "caption" }) }),
    /* @__PURE__ */ o(te, { children: [
      /* @__PURE__ */ e(J, { label: "…", leading: /* @__PURE__ */ e(y, { variant: "mark" }), value: /* @__PURE__ */ e(y, { variant: "caption" }) }),
      /* @__PURE__ */ e(J, { label: "…", leading: /* @__PURE__ */ e(y, { variant: "mark" }), value: /* @__PURE__ */ e(y, { variant: "caption" }) })
    ] })
  ] }, c)) }) : m.length === 0 ? /* @__PURE__ */ e(oe, { label: b["agenda.emptyAll"].text }) : /* @__PURE__ */ e(
    "div",
    {
      ref: s,
      id: i,
      style: r,
      className: ["mds-agenda-list", a].filter(Boolean).join(" "),
      "data-ds-check": "agenda-list",
      ...d,
      children: m.map((c) => /* @__PURE__ */ o("div", { className: "mds-agenda-list-group", children: [
        /* @__PURE__ */ o("h4", { className: "mds-agenda-list-heading", children: [
          /* @__PURE__ */ e("span", { children: c.label }),
          /* @__PURE__ */ o("span", { className: "mds-agenda-list-count", children: [
            b["sr.listSeparator"].text,
            c.rows.length
          ] })
        ] }),
        /* @__PURE__ */ e(te, { children: c.rows.map((u) => /* @__PURE__ */ e(
          J,
          {
            label: u.label,
            caption: u.caption,
            value: /* @__PURE__ */ e("bdi", { dir: "ltr", children: u.time }),
            trailing: u.badge ?? (u.tone ? /* @__PURE__ */ e(R, { tone: u.tone }) : void 0),
            onPress: u.onPress
          },
          `${u.label}-${u.time}`
        )) })
      ] }, c.label))
    }
  );
}
const Dr = [
  "multiDay",
  "singleDay",
  "empty",
  "loading"
];
function Rr({
  items: t,
  value: n,
  step: a,
  onChange: i,
  state: r = "idle",
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  const u = r === "loading", p = t.some((g) => g.slots.length > 0);
  return !u && !p ? /* @__PURE__ */ e(oe, { label: b["slot.empty"].text }) : /* @__PURE__ */ e(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-slot-picker", s].filter(Boolean).join(" "),
      "data-ds-check": "slot-picker",
      ...c,
      children: t.map((g) => /* @__PURE__ */ o("div", { className: "mds-slot-picker-group", children: [
        /* @__PURE__ */ e("p", { className: "mds-slot-picker-group-label", children: g.label }),
        u ? /* @__PURE__ */ e("div", { className: "mds-slot-picker-grid", "aria-hidden": "true", children: Array.from({ length: 3 }, (h, f) => /* @__PURE__ */ e(y, { variant: "caption" }, f)) }) : /* @__PURE__ */ e("div", { className: "mds-slot-picker-grid", role: "radiogroup", "aria-label": g.label, children: g.slots.map((h) => {
          const f = g.disabled?.includes(h) ?? !1, x = n === h;
          return /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": x,
              "aria-label": f ? `${h} ${b["sr.slotUnavailable"].text}` : h,
              disabled: f,
              className: ["mds-slot-picker-slot", x ? "mds-slot-picker-slot--selected" : ""].filter(Boolean).join(" "),
              onClick: () => i(h),
              children: /* @__PURE__ */ e("bdi", { dir: "ltr", children: h })
            },
            h
          );
        }) })
      ] }, g.label))
    }
  );
}
const qr = [
  "groups",
  "selected",
  "unavailable",
  "empty",
  "loading"
];
function ya({
  items: t,
  value: n,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  const l = Math.max(0, Math.min(n, t.length - 1)), m = t[l]?.label ?? "", c = [
    b["sr.statusTrackStages"].text,
    b["sr.statusTrackStep"].text.replace("{n}", String(l + 1)).replace("{m}", String(t.length)),
    m
  ].join(b["sr.listSeparator"].text);
  return /* @__PURE__ */ e(
    "div",
    {
      ref: s,
      id: i,
      style: r,
      role: "group",
      "aria-label": c,
      className: ["mds-status-track", a].filter(Boolean).join(" "),
      "data-ds-check": "status-track",
      ...d,
      children: /* @__PURE__ */ e("div", { className: "mds-status-track-row", "aria-hidden": "true", children: t.map((u, p) => {
        const g = p === l ? "current" : p < l ? "done" : "", h = p === l && u.tone === "problem";
        return /* @__PURE__ */ o(
          "div",
          {
            className: [
              "mds-status-track-step",
              g ? `mds-status-track-step--${g}` : "",
              h ? "mds-status-track-step--problem" : ""
            ].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ e("span", { className: "mds-status-track-dot" }),
              /* @__PURE__ */ e("span", { className: "mds-status-track-label mds-type-micro", children: u.label })
            ]
          },
          `${u.label}-${p}`
        );
      }) })
    }
  );
}
const Or = ["early", "mid", "last", "problem"];
function Yr({
  label: t,
  caption: n,
  time: a,
  tone: i,
  badge: r,
  driver: s,
  action: d,
  onPress: l,
  state: m = "idle",
  className: c,
  id: u,
  style: p,
  ref: g,
  ...h
}) {
  const f = m === "loading", { isPressed: x, pressProps: k } = B({ onPress: l, disabled: f });
  if (f)
    return /* @__PURE__ */ e("div", { className: "mds-card-shell mds-delivery-request-card mds-delivery-request-card--loading", "aria-busy": "true", id: u, style: p, ref: g, children: /* @__PURE__ */ o("span", { className: "mds-delivery-request-card-head", children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(y, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
        /* @__PURE__ */ e(y, { variant: "body" }),
        /* @__PURE__ */ e(y, { variant: "caption" })
      ] })
    ] }) });
  const v = [
    `${b["delivery.to"].text} ${t}`,
    n,
    a,
    r ? r.props.label ?? "" : "",
    !r && i && i !== "neutral" ? b[`badge.${i}`]?.text ?? "" : ""
  ].filter(Boolean).join(b["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "button",
    {
      ref: g,
      type: "button",
      id: u,
      style: p,
      className: [
        "mds-card-shell",
        "mds-delivery-request-card",
        x ? "mds-card-shell--pressed" : "",
        c
      ].filter(Boolean).join(" "),
      "aria-label": v,
      "data-ds-check": "delivery-request-card",
      ...k,
      ...h,
      children: [
        /* @__PURE__ */ o("span", { className: "mds-delivery-request-card-head", children: [
          s ? /* @__PURE__ */ e(C, { value: s }) : /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e("span", { className: "mds-delivery-request-card-nav", "aria-hidden": "true", children: /* @__PURE__ */ e(lt, { size: 24 }) }) }),
          /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
            /* @__PURE__ */ e("span", { className: "mds-type-body-strong", children: `${b["delivery.to"].text} ${t}` }),
            n ? /* @__PURE__ */ e("span", { className: "mds-type-caption", children: n }) : null
          ] }),
          r || (i ? /* @__PURE__ */ e(R, { tone: i }) : null)
        ] }),
        a ? /* @__PURE__ */ o("span", { className: "mds-delivery-request-card-time", children: [
          /* @__PURE__ */ e("span", { className: "mds-delivery-request-card-time-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(Se, { size: 16 }) }),
          /* @__PURE__ */ e("span", { children: a })
        ] }) : null,
        d ? /* @__PURE__ */ e("span", { className: "mds-delivery-request-card-action", children: d }) : null
      ]
    }
  );
}
const _r = [
  "needsDecision",
  "assigned",
  "plain",
  "loading"
];
function Wr({
  label: t,
  caption: n,
  value: a,
  inList: i = !0,
  result: r,
  accept: s,
  reject: d,
  state: l = "idle",
  className: m,
  id: c,
  style: u,
  ref: p,
  ...g
}) {
  const h = l === "rejected", f = l === "accepting", x = l === "loading", k = [
    b["quote.offerFrom"].text.replace("{label}", t),
    b["quote.approved"].text,
    T(a, { texts: S }).aria,
    b["quote.resultSentence"].text,
    h ? b["quote.rejected"].text : ""
  ].filter(Boolean).join(b["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "div",
    {
      ref: p,
      id: c,
      style: u,
      role: "group",
      "aria-label": k,
      className: [
        "mds-card-shell",
        "mds-quote-card",
        h ? "mds-quote-card--rejected" : "",
        x ? "mds-quote-card--loading" : "",
        m
      ].filter(Boolean).join(" "),
      "data-ds-check": "quote-card",
      ...g,
      children: [
        /* @__PURE__ */ o("span", { className: "mds-quote-card-head", children: [
          /* @__PURE__ */ e(C, { tone: "done", value: t }),
          /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
            /* @__PURE__ */ e("span", { className: "mds-quote-card-title mds-type-body-strong", children: t }),
            n ? /* @__PURE__ */ e("span", { className: "mds-quote-card-caption mds-type-caption", children: n }) : null,
            h ? /* @__PURE__ */ e(R, { tone: "neutral", label: b["quote.rejected"].text }) : null
          ] })
        ] }),
        /* @__PURE__ */ o("span", { className: "mds-quote-card-price", children: [
          /* @__PURE__ */ e(I, { value: a, size: "lg" }),
          /* @__PURE__ */ e("span", { className: "mds-quote-card-result mds-type-caption", children: r ?? b["quote.resultSentence"].text })
        ] }),
        i && !h ? /* @__PURE__ */ o("span", { className: "mds-quote-card-actions", children: [
          /* @__PURE__ */ e("span", { "aria-hidden": f || void 0, className: f ? "mds-quote-card--await" : "", children: s }),
          d
        ] }) : null
      ]
    }
  );
}
const zr = ["inList", "inSheet", "accepting", "rejected"];
function Na({ className: t, ...n }) {
  return /* @__PURE__ */ e(
    ya,
    {
      className: ["mds-job-track", t].filter(Boolean).join(" "),
      "data-ds-check": "job-track",
      ...n
    }
  );
}
const Gr = ["running", "problem"];
function Qr({
  label: t,
  items: n,
  audience: a = "owner",
  accept: i,
  reject: r,
  result: s,
  decided: d,
  state: l = "idle",
  className: m,
  id: c,
  style: u,
  ref: p,
  ...g
}) {
  const h = l === "loading", f = t ?? b["issue.title"].text, x = [
    f,
    ...n.map((k) => `${k.key}: ${k.value}`),
    a === "driver" ? b["issue.awaitingOwner"].text : ""
  ].join(b["sr.listSeparator"].text + " ");
  return /* @__PURE__ */ e(
    te,
    {
      ref: p,
      id: c,
      style: u,
      role: "group",
      "aria-label": x,
      className: ["mds-issue-proposal-card", h ? "mds-issue-proposal-card--loading" : "", m].filter(Boolean).join(" "),
      "data-ds-check": "issue-proposal-card",
      ...g,
      children: h ? /* @__PURE__ */ o(P, { children: [
        /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(y, { variant: "body" }) }),
        /* @__PURE__ */ o(ne, { children: [
          /* @__PURE__ */ e(y, { variant: "body" }),
          /* @__PURE__ */ e(y, { variant: "caption" })
        ] })
      ] }) : /* @__PURE__ */ o(P, { children: [
        /* @__PURE__ */ o("span", { className: "mds-issue-proposal-card-header", children: [
          /* @__PURE__ */ e("span", { className: "mds-issue-proposal-card-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(un, { size: 20 }) }),
          /* @__PURE__ */ e("span", { children: f })
        ] }),
        /* @__PURE__ */ e(ne, { children: /* @__PURE__ */ e("dl", { className: "mds-issue-proposal-card-list", children: n.map((k) => /* @__PURE__ */ o("div", { className: "mds-issue-proposal-card-row", children: [
          /* @__PURE__ */ e("dt", { className: "mds-type-caption", children: k.key }),
          /* @__PURE__ */ e("dd", { className: "mds-type-body", children: k.value })
        ] }, k.key)) }) }),
        a === "owner" ? d !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-issue-proposal-card-decided mds-type-label-strong", children: d }) : /* @__PURE__ */ o(P, { children: [
          /* @__PURE__ */ o("span", { className: "mds-issue-proposal-card-actions", children: [
            i,
            r
          ] }),
          s ? /* @__PURE__ */ e("span", { className: "mds-issue-proposal-card-result mds-type-caption", children: s }) : null
        ] }) : /* @__PURE__ */ e(R, { tone: "waiting", label: b["issue.awaitingOwner"].text })
      ] })
    }
  );
}
const Ur = ["owner", "driver", "decided", "loading"];
function Aa(t) {
  return `+962${t.replace(/[^\d]/g, "").replace(/^0/, "")}`;
}
function Sa({
  value: t,
  label: n,
  density: a = "regular",
  market: i = !1,
  locked: r = !1,
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  const u = Aa(t);
  return r ? /* @__PURE__ */ o(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-contact-bar", "mds-contact-bar--locked", s].filter(Boolean).join(" "),
      "data-ds-check": "contact-bar",
      "aria-label": b["contact.marketNote"].text,
      ...c,
      children: [
        /* @__PURE__ */ o("div", { className: "mds-contact-bar-row", children: [
          /* @__PURE__ */ e("span", { className: "mds-contact-bar-locked", "aria-hidden": "true", children: "•••••" }),
          /* @__PURE__ */ e("span", { className: "mds-contact-bar-locked", "aria-hidden": "true", children: "•••••" })
        ] }),
        i ? /* @__PURE__ */ e("span", { className: "mds-contact-bar-note mds-type-caption", children: b["contact.marketNote"].text }) : null
      ]
    }
  ) : /* @__PURE__ */ o(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: [
        "mds-contact-bar",
        a === "large" ? "mds-contact-bar--large" : "",
        s
      ].filter(Boolean).join(" "),
      "data-ds-check": "contact-bar",
      ...c,
      children: [
        /* @__PURE__ */ o("div", { className: "mds-contact-bar-row", children: [
          /* @__PURE__ */ o(
            "a",
            {
              className: "mds-button mds-button--secondary mds-button--sm mds-contact-bar-link",
              href: `tel:${u}`,
              "aria-label": b["sr.contactCall"].text.replace("{name}", n),
              children: [
                /* @__PURE__ */ e("span", { className: "mds-contact-bar-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(Tn, { size: 20 }) }),
                b["contact.call"].text
              ]
            }
          ),
          /* @__PURE__ */ o(
            "a",
            {
              className: "mds-button mds-button--secondary mds-button--sm mds-contact-bar-link",
              href: `https://wa.me/${u.replace("+", "")}`,
              target: "_blank",
              rel: "noreferrer",
              "aria-label": b["sr.contactWhatsapp"].text.replace("{name}", n),
              children: [
                /* @__PURE__ */ e("span", { className: "mds-contact-bar-icon", "aria-hidden": "true", children: /* @__PURE__ */ e($n, { size: 20 }) }),
                b["contact.whatsapp"].text
              ]
            }
          )
        ] }),
        i ? /* @__PURE__ */ e("span", { className: "mds-contact-bar-note mds-type-caption", children: b["contact.marketNote"].text }) : null
      ]
    }
  );
}
const Xr = ["plain", "market", "driver", "locked"];
function Kr({
  variant: t,
  value: n,
  onChange: a,
  error: i,
  readOnly: r = !1,
  density: s = "regular",
  action: d,
  state: l = "idle",
  className: m,
  id: c,
  style: u,
  ref: p,
  ...g
}) {
  const h = l === "loading", f = !!n, x = [
    b["evidence.title"].text,
    t === "photo" ? f ? b["evidence.photoTaken"].text : b["evidence.photoMissing"].text : "",
    t === "code" ? n ? b["evidence.entered"].text : b["evidence.codeLabel"].text : "",
    t === "owner" ? b["evidence.ownerSentence"].text : ""
  ].filter(Boolean).join(b["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "div",
    {
      ref: p,
      id: c,
      style: u,
      role: "group",
      "aria-label": x,
      className: [
        "mds-evidence-slot",
        s === "large" ? "mds-evidence-slot--large" : "",
        h ? "mds-evidence-slot--loading" : "",
        m
      ].filter(Boolean).join(" "),
      "data-ds-check": "evidence-slot",
      ...g,
      children: [
        /* @__PURE__ */ e("span", { className: "mds-evidence-slot-title", children: b["evidence.title"].text }),
        h ? /* @__PURE__ */ e("span", { className: "mds-evidence-slot-tile", "aria-hidden": "true", children: /* @__PURE__ */ e(y, { variant: "body" }) }) : t === "photo" ? f ? /* @__PURE__ */ o("span", { className: "mds-evidence-slot-tile", style: { cursor: "default" }, children: [
          /* @__PURE__ */ e("img", { className: "mds-evidence-slot-photo", src: n, alt: b["evidence.photoTaken"].text }),
          r ? null : /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "mds-evidence-slot-redo",
              "aria-label": b["evidence.retake"].text,
              onClick: () => a?.(""),
              children: /* @__PURE__ */ e(zt, { size: 20 })
            }
          )
        ] }) : r ? /* @__PURE__ */ e("span", { className: "mds-evidence-slot-tile", style: { cursor: "default" }, children: /* @__PURE__ */ e("span", { className: "mds-evidence-slot-done mds-type-label-strong", children: b["evidence.photoMissing"].text }) }) : /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: "mds-evidence-slot-tile",
            "aria-label": b["evidence.takePhoto"].text,
            onClick: () => a?.("pending"),
            children: [
              /* @__PURE__ */ e("span", { "aria-hidden": "true", children: /* @__PURE__ */ e(An, { size: 24 }) }),
              /* @__PURE__ */ e("span", { children: b["evidence.takePhoto"].text })
            ]
          }
        ) : t === "code" ? r ? /* @__PURE__ */ e("span", { className: "mds-evidence-slot-done mds-type-label-strong", children: n ? b["evidence.entered"].text : "—" }) : /* @__PURE__ */ e(
          ia,
          {
            label: b["evidence.codeLabel"].text,
            value: n ?? "",
            inputMode: "numeric",
            state: i ? "error" : "idle",
            caption: i,
            onChange: (k) => a?.(k)
          }
        ) : /* @__PURE__ */ o(P, { children: [
          /* @__PURE__ */ e("span", { className: "mds-evidence-slot-owner mds-type-body", children: b["evidence.ownerSentence"].text }),
          !r && d ? /* @__PURE__ */ e("span", { className: "mds-evidence-slot-action", children: d }) : null
        ] })
      ]
    }
  );
}
const Jr = [
  "photoEmpty",
  "photoTaken",
  "code",
  "codeError",
  "owner",
  "readOnly",
  "loading"
];
function ke({
  label: t,
  value: n,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  const l = !!(n && n.trim()), m = l ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.trim())}` : null;
  return /* @__PURE__ */ o(
    "div",
    {
      ref: s,
      id: i,
      style: r,
      className: ["mds-location-slot", a].filter(Boolean).join(" "),
      "data-ds-check": "location-slot",
      ...d,
      children: [
        /* @__PURE__ */ e("span", { className: "mds-location-slot-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(Ln, { size: 20 }) }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-location-slot-key mds-type-label", children: t }),
          /* @__PURE__ */ e("span", { className: "mds-location-slot-address", children: l ? n : "—" })
        ] }),
        m ? /* @__PURE__ */ o(
          "a",
          {
            className: "mds-location-slot-link",
            href: m,
            target: "_blank",
            rel: "noreferrer",
            "aria-label": b["sr.openMaps"].text,
            children: [
              b["location.openMaps"].text,
              /* @__PURE__ */ e("span", { "aria-hidden": "true", children: /* @__PURE__ */ e(Ne, { size: 16 }) })
            ]
          }
        ) : null
      ]
    }
  );
}
const es = ["origin", "destination", "empty"];
function ts({
  label: t,
  origin: n,
  destination: a,
  owner: i,
  phone: r,
  items: s,
  value: d,
  stage: l = "active",
  evidence: m = !1,
  action: c,
  quote: u,
  proposal: p,
  state: g = "idle",
  className: h,
  id: f,
  style: x,
  ref: k,
  ...v
}) {
  return g === "loading" ? /* @__PURE__ */ o("div", { className: "mds-driver-job mds-driver-job--loading", "aria-busy": "true", id: f, style: x, ref: k, ...v, children: [
    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(y, { variant: "body" }) }),
    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(y, { variant: "caption" }) }),
    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(y, { variant: "body" }) })
  ] }) : /* @__PURE__ */ o(
    "div",
    {
      ref: k,
      id: f,
      style: x,
      className: ["mds-driver-job", h].filter(Boolean).join(" "),
      "data-ds-check": "driver-job-card",
      ...v,
      children: [
        /* @__PURE__ */ e("h3", { className: "mds-driver-job-title", children: `${b["delivery.to"].text} ${t}` }),
        /* @__PURE__ */ e(ke, { label: b["delivery.fromWord"].text, value: n }),
        /* @__PURE__ */ e(ke, { label: b["delivery.to"].text, value: a }),
        /* @__PURE__ */ e(Sa, { value: r, label: i, density: "large" }),
        /* @__PURE__ */ e(Na, { items: s, value: d }),
        l === "awaiting-owner" && p ? /* @__PURE__ */ e("div", { className: "mds-driver-job-action", children: p }) : /* @__PURE__ */ o("div", { className: "mds-driver-job-action", children: [
          l === "quoting" ? u : null,
          c
        ] })
      ]
    }
  );
}
const ns = [
  "quoting",
  "active",
  "blocked",
  "awaitingOwner",
  "loading"
], Ba = {
  waiting: "driver.pending",
  approved: "driver.approved",
  rejected: "driver.rejected"
}, Ha = {
  waiting: "waiting",
  approved: "done",
  rejected: "problem"
};
function as({
  tone: t,
  caption: n,
  children: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = b[Ba[t]], c = a ?? (t === "waiting" ? b["driver.pendingSentence"].text : null);
  return /* @__PURE__ */ o(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      role: "group",
      "aria-label": [m.text, c ?? "", t === "rejected" ? n ?? "" : ""].filter(Boolean).join(b["sr.listSeparator"].text),
      className: ["mds-driver-approval", i].filter(Boolean).join(" "),
      "data-ds-check": "driver-approval-status",
      ...l,
      children: [
        /* @__PURE__ */ e(R, { tone: Ha[t], label: m.text }),
        c ? /* @__PURE__ */ e("p", { className: "mds-driver-approval-sentence mds-type-body", children: c }) : null,
        t === "rejected" ? /* @__PURE__ */ e(ne, { children: /* @__PURE__ */ e("span", { className: "mds-type-body", children: n }) }) : null
      ]
    }
  );
}
const is = ["waiting", "approved", "rejected"];
export {
  Ji as ActionBar,
  er as ActionBarStates,
  Er as AgendaList,
  Dr as AgendaListStates,
  Si as AmountField,
  Bi as AmountFieldStates,
  Za as AmountVisibilityProvider,
  Gn as AmountVisibilityToggle,
  pi as AmountVisibilityToggleStates,
  gt as AmountsHiddenIcon,
  ht as AmountsShownIcon,
  _a as AppointmentIcon,
  tr as AskButton,
  nr as AskButtonStates,
  at as AskSymbolIcon,
  Fa as BackIcon,
  Qa as BackspaceIcon,
  Q as Button,
  Mi as ButtonStates,
  Ka as CalendarIcon,
  An as CameraIcon,
  ii as ChartIcon,
  gi as Checkbox,
  bi as CheckboxStates,
  Bt as ClearIcon,
  Se as ClockIcon,
  wt as CloseIcon,
  Xi as ConfirmSheet,
  Ki as ConfirmSheetStates,
  Sa as ContactBar,
  Xr as ContactBarStates,
  dr as ContextBar,
  lr as ContextBarStates,
  Jt as DangerIcon,
  Lr as DayTimeline,
  Fr as DayTimelineStates,
  Mr as DebtCard,
  Zr as DebtCardStates,
  qa as DebtIcon,
  Cr as DebtSummary,
  Pr as DebtSummaryStates,
  Yr as DeliveryRequestCard,
  _r as DeliveryRequestCardStates,
  Da as DeltaDownIcon,
  Ea as DeltaUpIcon,
  Ft as DraftIcon,
  as as DriverApprovalStatus,
  is as DriverApprovalStatusStates,
  ts as DriverJobCard,
  ns as DriverJobCardStates,
  oe as EmptyState,
  vr as EmptyStateStates,
  Qt as EntityApprovedIcon,
  C as EntityMark,
  ji as EntityMarkStates,
  Xt as EntityPendingIcon,
  Kr as EvidenceSlot,
  Jr as EvidenceSlotStates,
  kt as ExpandIcon,
  jt as FieldErrorIcon,
  di as FileIcon,
  Vi as FilterChips,
  $i as FilterChipsStates,
  Ne as ForwardIcon,
  an as FundBankIcon,
  Br as FundCard,
  Hr as FundCardStates,
  tn as FundCashIcon,
  sn as FundWalletIcon,
  qi as HeroSurface,
  Oi as HeroSurfaceStates,
  aa as IconButton,
  Zi as IconButtonStates,
  _t as InfoIcon,
  xr as InlineBanner,
  kr as InlineBannerStates,
  Qr as IssueProposalCard,
  Ur as IssueProposalCardStates,
  un as JobFailedIcon,
  Na as JobTrack,
  Gr as JobTrackStates,
  Ue as LONG_PRESS_MS,
  Ca as LayersProvider,
  li as LinkIcon,
  ke as LocationSlot,
  es as LocationSlotStates,
  Ot as LockedIcon,
  Ln as MapPinIcon,
  ha as Metric,
  Gi as MetricSmall,
  Qi as MetricSmallStates,
  zi as MetricStates,
  Ja as MicIcon,
  Xa as MinusIcon,
  I as Money,
  hi as MoneyStates,
  zt as MoreIcon,
  Mn as MovementInIcon,
  Cn as MovementOutIcon,
  yr as MovementRow,
  Nr as MovementRowStates,
  lt as NavDeliveryIcon,
  $a as NavFinanceIcon,
  La as NavMarketIcon,
  Ia as NavOrdersIcon,
  Va as NavTodayIcon,
  oi as NoteIcon,
  ar as NotificationsButton,
  ir as NotificationsButtonStates,
  mt as NotificationsIcon,
  _i as ObjectCard,
  Wi as ObjectCardStates,
  J as ObjectRow,
  Yi as ObjectRowStates,
  Rt as OfflineIcon,
  Tr as OrderCard,
  Vr as OrderCardStates,
  Ya as OrderIcon,
  ur as PageHeader,
  hr as PageHeaderStates,
  mi as PauseIcon,
  xa as PaymentProgress,
  jr as PaymentProgressStates,
  Tn as PhoneIcon,
  Ua as PlusIcon,
  Wa as PriceTierIcon,
  rr as ProjectSwitcher,
  sr as ProjectSwitcherStates,
  Wr as QuoteCard,
  zr as QuoteCardStates,
  Oa as QuoteIcon,
  ui as RTL_FLIP_ICONS,
  fi as Radio,
  xi as RadioStates,
  Ga as ReportIcon,
  Ra as RetryIcon,
  za as ReviewIcon,
  pr as SaveState,
  gr as SaveStateStates,
  wi as SearchField,
  yi as SearchFieldStates,
  At as SearchIcon,
  Fi as Section,
  Ei as SectionStates,
  Pi as SegmentedControl,
  Ti as SegmentedControlStates,
  de as SelectedIcon,
  ni as SendIcon,
  pa as Sheet,
  Ui as SheetStates,
  y as Skeleton,
  wr as SkeletonStates,
  ci as SlidersIcon,
  Rr as SlotPicker,
  qr as SlotPickerStates,
  R as StatusBadge,
  Hi as StatusBadgeStates,
  ya as StatusTrack,
  Or as StatusTrackStates,
  ei as StopIcon,
  te as Surface,
  Ii as SurfaceStates,
  cr as TabBar,
  mr as TabBarStates,
  or as TabBarTab,
  ai as TableIcon,
  Ni as TextArea,
  Ai as TextAreaStates,
  ia as TextField,
  Ci as TextFieldStates,
  Di as Tile,
  Ri as TileStates,
  br as Toast,
  fr as ToastStates,
  ki as Toggle,
  vi as ToggleStates,
  Ae as ToneDoneIcon,
  It as ToneInfoIcon,
  le as ToneProblemIcon,
  Tt as ToneWaitingIcon,
  ln as TransferIcon,
  Ar as TransferRow,
  Sr as TransferRowStates,
  ti as TrashIcon,
  $r as WeekStrip,
  Ir as WeekStripStates,
  ne as Well,
  Li as WellStates,
  $n as WhatsappIcon,
  ri as ZoomInIcon,
  si as ZoomOutIcon,
  b as ar,
  Fe as arBase,
  T as formatMoney,
  _e as formatTime12,
  Ie as getToken,
  S as moneyTexts,
  Kn as normalizeAmount,
  Re as pluralAr,
  Ee as pluralNouns,
  j as t,
  Aa as toInternational,
  O as tokens,
  L as useAmountVisibility,
  Ta as useOpenSheetCount,
  et as usePendingDelay,
  B as usePress,
  Pa as useSheetLayer,
  Je as useVisualViewport
};
