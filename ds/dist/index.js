import { jsx as e, jsxs as o, Fragment as T } from "react/jsx-runtime";
import { useMemo as ce, useContext as me, createContext as Be, useState as j, useRef as Z, useCallback as O, useEffect as R, useReducer as Re, useId as ue, useLayoutEffect as Ee, Children as De } from "react";
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
function qe(t) {
  let n = _;
  for (const a of t.split("."))
    n = n[a];
  return n;
}
const Oe = {
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
  "issue.awaitingOwner": { kind: "help", text: "بانتظار موافقة المالك" },
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
  "state.decided": { kind: "badge", text: "بعد القرار" },
  "state.awaitingOwner": { kind: "badge", text: "بانتظار المالك" },
  "state.driverBlocked": { kind: "badge", text: "تعذّر" },
  "state.driverActive": { kind: "badge", text: "قيد التنفيذ" },
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
  "listing.unavailable": { kind: "badge", text: "غير متوفر" },
  "listing.byRequest": { kind: "badge", text: "بالطلب" },
  "tier.from": { kind: "badge", text: "من" },
  "tier.to": { kind: "badge", text: "إلى" },
  "tier.pricePerUnit": { kind: "badge", text: "السعر للعبوة" },
  "tier.andAbove": { kind: "badge", text: "فما فوق" },
  "tier.tableName": { kind: "title", text: "شرائح السعر" },
  "supplier.oneOffer": { kind: "badge", text: "عرض واحد" },
  "supplier.twoOffers": { kind: "badge", text: "عرضان" },
  "supplier.offers": { kind: "badge", text: "{n} عروض" },
  "supplier.offersMany": { kind: "badge", text: "{n} عرضاً" },
  "gallery.imageOf": { kind: "screen-reader", text: "صورة {current} من {total}" },
  "gallery.prev": { kind: "screen-reader", text: "السابق" },
  "gallery.next": { kind: "screen-reader", text: "التالي" },
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
  "editor.editTitle": { kind: "title", text: "عدّل العرض" },
  "editor.newTitle": { kind: "title", text: "عرض جديد" },
  "editor.unitHint": { kind: "placeholder", text: "كرتونة 12 قطعة" },
  "editor.priceMode": { kind: "badge", text: "السعر" },
  "editor.available": { kind: "badge", text: "متوفر" },
  "editor.description": { kind: "badge", text: "الوصف" },
  "editor.nameRequired": { kind: "error", text: "اكتب اسم العرض." },
  "editor.unitRequired": { kind: "error", text: "اكتب العبوة." },
  "editor.priceRequired": { kind: "error", text: "اكتب السعر." },
  "editor.photoRequired": { kind: "error", text: "أضف صورة واحدة على الأقل." },
  "listing.reviewPending": { kind: "badge", text: "قيد المراجعة" },
  "listing.approved": { kind: "badge", text: "معتمد" },
  "listing.rejected": { kind: "badge", text: "مرفوض" },
  "listing.editPending": { kind: "help", text: "تعديل قيد المراجعة" },
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
  "ask.contextPrefix": { kind: "help", text: "تسأل عن: {context}" },
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
}, Ye = {
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
  "title.checkbox": { kind: "title", text: "مربع الاختيار" }
  // --- Domains (plan B, stage 5): ar-domains.ts, one linking line (PLAN-B) ---
  // ---------------------------------------------------------------------------
}, u = { ...Ye, ...Oe };
function M(t, n) {
  let a = u[t].text;
  if (n)
    for (const [i, r] of Object.entries(n))
      a = a.replaceAll(`{${i}}`, String(r));
  return a;
}
const _e = {
  movements: { zero: "لا حركات", one: "حركة واحدة", two: "حركتين", few: "حركات", many: "حركة" },
  orders: { zero: "لا طلبات", one: "طلب واحد", two: "طلتان", few: "طلبات", many: "طلب" },
  quotes: { zero: "لا عروض", one: "عرض واحد", two: "عرضان", few: "عروض", many: "عرض" },
  results: { zero: "لا نتائج", one: "نتيجة واحدة", two: "نتيجتان", few: "نتائج", many: "نتيجة" },
  unread: { zero: "لا شيء غير مقروء", one: "غير مقروء واحد", two: "غير مقروءان", few: "غير مقروءة", many: "غير مقروءة" }
}, A = {
  unit: u["money.unit"].text,
  minus: u["money.ariaMinus"].text,
  dinar: u["money.ariaDinar"].text,
  fils: u["money.ariaFils"].text,
  and: u["money.ariaAnd"].text,
  forYou: u["money.forYou"].text,
  againstYou: u["money.againstYou"].text,
  hidden: u["money.ariaHidden"].text,
  missing: u["money.ariaMissing"].text,
  hiddenGlyph: u["money.hiddenGlyph"].text,
  missingGlyph: u["money.missing"].text
}, We = new Intl.PluralRules("ar");
function ze(t, n) {
  switch (We.select(t)) {
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
const Ue = "ص", Ge = "م";
function ke(t) {
  return `${t < 10 ? "0" : ""}${t}`;
}
function Qe(t) {
  return t instanceof Date ? { h: t.getHours(), m: t.getMinutes() } : t;
}
function Xe(t) {
  const { h: n, m: a } = Qe(t), i = n < 12 ? Ue : Ge, r = n % 12 === 0 ? 12 : n % 12;
  return `${ke(r)}:${ke(a)} ${i}`;
}
const ae = "−", Ke = "+", Q = 3;
function Je(t) {
  const n = String(t).trim(), a = n.startsWith("-"), i = a ? n.slice(1) : n, [r = "0", s = ""] = i.split("."), d = r.replace(/[^0-9]/g, "") || "0", l = (s + "000").slice(0, Q), m = BigInt(d) * 10n ** BigInt(Q) + BigInt(l || "0");
  return { negative: a, fils: m };
}
function et(t) {
  return t.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function tt(t) {
  const n = 10n ** BigInt(Q), a = t / n, i = t % n;
  return {
    int: et(a.toString()),
    frac: i === 0n ? "" : `.${i.toString().padStart(Q, "0")}`
  };
}
function ie(t, n) {
  const a = 10n ** BigInt(Q), i = t / a, r = t % a;
  let s = `${i.toString()} ${n.dinar}`;
  return r !== 0n && (s += ` ${n.and}${r.toString()} ${n.fils}`), s;
}
function V(t, n) {
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
    const b = n.debt === "forYou" ? a.forYou : n.debt === "againstYou" ? a.againstYou : "", p = b ? `${b} ${a.hiddenGlyph} ${a.unit}` : `${a.hiddenGlyph} ${a.unit}`;
    return {
      missing: !1,
      hidden: !0,
      debt: n.debt ?? null,
      sign: "",
      int: "",
      frac: "",
      unit: a.unit,
      debtWord: b,
      display: p,
      aria: a.hidden
    };
  }
  const { negative: r, fils: s } = Je(t), d = tt(s), l = n.debt === "forYou" ? a.forYou : n.debt === "againstYou" ? a.againstYou : "", m = l ? "" : n.flow === "in" ? Ke : n.flow === "out" ? ae : n.flow === "transfer" ? "" : r ? ae : "", c = `${m}${d.int}${d.frac}`, h = l ? `${l} ${c} ${a.unit}` : `${c} ${a.unit}`;
  let g;
  return l ? g = `${l} ${ie(s, a)}` : m === ae ? g = `${a.minus} ${ie(s, a)}` : g = ie(s, a), {
    missing: !1,
    hidden: !1,
    debt: n.debt ?? null,
    sign: m,
    int: d.int,
    frac: d.frac,
    unit: a.unit,
    debtWord: l,
    display: h,
    aria: g
  };
}
const He = Be({ hidden: !1 });
function Ea({ children: t, hidden: n = !1 }) {
  const a = ce(() => ({ hidden: n }), [n]);
  return /* @__PURE__ */ e(He.Provider, { value: a, children: t });
}
function D() {
  const { hidden: t } = me(He);
  return { hidden: t, visible: !t };
}
const nt = 500, at = qe("motion.press-cancel-px");
function H(t = {}) {
  const { onPress: n, onLongPress: a, disabled: i } = t, [r, s] = j(!1), d = Z(null), l = Z(null), m = Z(!1), c = O(() => {
    l.current !== null && (clearTimeout(l.current), l.current = null);
  }, []), h = O(() => {
    c(), d.current = null, m.current = !1, s(!1);
  }, [c]), g = O(
    (f) => {
      if (!i && !(f.pointerType === "mouse" && f.button !== 0)) {
        if (typeof f.currentTarget.setPointerCapture == "function")
          try {
            f.currentTarget.setPointerCapture(f.pointerId);
          } catch {
          }
        d.current = { x: f.clientX, y: f.clientY }, m.current = !1, s(!0), a && (l.current = setTimeout(() => {
          m.current = !0, a();
        }, nt));
      }
    },
    [i, a]
  ), b = O(
    (f) => {
      if (!r || d.current === null) return;
      const x = f.clientX - d.current.x, k = f.clientY - d.current.y;
      Math.hypot(x, k) > at && h();
    },
    [r, h]
  ), p = O(
    (f) => {
      if (!r) return;
      const x = m.current;
      h(), !x && !i && n?.();
    },
    [r, i, n, h]
  );
  return {
    isPressed: r,
    pressProps: {
      onPointerDown: g,
      onPointerMove: b,
      onPointerUp: p,
      onPointerCancel: h
    }
  };
}
const it = () => typeof window > "u" || !window.visualViewport ? {
  height: typeof window > "u" ? 0 : window.innerHeight,
  offsetTop: 0,
  scale: 1,
  keyboardHeight: 0
} : je(window.visualViewport);
function je(t) {
  const n = t.height, a = t.offsetTop, i = Math.max(0, window.innerHeight - n - a);
  return { height: n, offsetTop: a, scale: t.scale, keyboardHeight: i };
}
function rt() {
  const [t, n] = j(it);
  return R(() => {
    const a = window.visualViewport;
    if (!a) return;
    const i = () => n(je(a));
    return i(), a.addEventListener("resize", i), a.addEventListener("scroll", i), window.addEventListener("resize", i), window.addEventListener("orientationchange", i), () => {
      a.removeEventListener("resize", i), a.removeEventListener("scroll", i), window.removeEventListener("resize", i), window.removeEventListener("orientationchange", i);
    };
  }, []), t;
}
function Me(t) {
  const n = Z(0), a = Z(!1);
  t !== a.current && (a.current = t, t && (n.current += 1));
  const i = n.current, [r, s] = j(-1);
  return R(() => {
    if (!t) return;
    const d = i, l = window.setTimeout(() => s(d), _.motion["pending-delay"]);
    return () => window.clearTimeout(l);
  }, [t, i]), t && r === i;
}
function st(t) {
  return 1 - Math.pow(1 - t, 3);
}
function dt() {
  return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Da(t, n, a) {
  const [i, r] = j(() => a ? t : n), s = Z(0), d = dt();
  return R(() => {
    if (d || !a || t === n) {
      const g = requestAnimationFrame(() => r(n));
      return () => cancelAnimationFrame(g);
    }
    const m = performance.now(), c = _.motion.count.ms, h = (g) => {
      const b = Math.min(1, (g - m) / c);
      r(t + (n - t) * st(b)), b < 1 && (s.current = requestAnimationFrame(h));
    };
    return s.current = requestAnimationFrame(h), () => cancelAnimationFrame(s.current);
  }, [a, t, n, d]), R(() => () => cancelAnimationFrame(s.current), []), a && !d && t !== n && i !== n ? i : n;
}
const he = Be({
  sheetIds: [],
  registerSheet: () => {
  },
  unregisterSheet: () => {
  }
});
function lt(t, n) {
  switch (n.type) {
    case "register":
      return t.includes(n.id) ? t : [...t, n.id];
    case "unregister":
      return t.includes(n.id) ? t.filter((a) => a !== n.id) : t;
    default:
      return t;
  }
}
function qa({ children: t }) {
  const [n, a] = Re(lt, []), i = O((d) => a({ type: "register", id: d }), []), r = O((d) => a({ type: "unregister", id: d }), []), s = ce(
    () => ({ sheetIds: n, registerSheet: i, unregisterSheet: r }),
    [n, i, r]
  );
  return /* @__PURE__ */ e(he.Provider, { value: s, children: t });
}
function Oa() {
  const { sheetIds: t, registerSheet: n, unregisterSheet: a } = me(he), i = ue();
  Ee(() => (n(i), () => a(i)), [i, n, a]);
  const r = t.indexOf(i) + 1 || t.length + 1, s = Math.min(r, 2), d = r === t.length;
  return {
    level: s,
    overLimit: r > 2,
    sheetZ: s === 1 ? "var(--mds-layer-sheet)" : "var(--mds-layer-sheet-2)",
    scrimZ: s === 1 ? "var(--mds-layer-scrim)" : "var(--mds-layer-scrim-2)",
    isTop: d
  };
}
function Ya() {
  const { sheetIds: t } = me(he);
  return t.length;
}
const ot = /* @__PURE__ */ o("g", { transform: "translate(16 16)", id: "micro-symbol-master-2", children: [
  /* @__PURE__ */ e("g", { id: "module-top", transform: "rotate(0 96 96)", children: /* @__PURE__ */ e("path", { id: "shape-top", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ e("g", { id: "module-right", transform: "rotate(90 96 96)", children: /* @__PURE__ */ e("path", { id: "shape-right", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-signal)" }) }),
  /* @__PURE__ */ e("g", { id: "module-bottom", transform: "rotate(180 96 96)", children: /* @__PURE__ */ e("path", { id: "shape-bottom", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-logo)" }) }),
  /* @__PURE__ */ e("g", { id: "module-left", transform: "rotate(270 96 96)", children: /* @__PURE__ */ e("path", { id: "shape-left", d: "M36 0 H108 Q116 0 116 8 V56 Q116 64 108 64 H12 Q0 64 0 52 V36 C0 16.1 16.1 0 36 0 Z", fill: "var(--mds-color-brand-data)" }) })
] });
function ct({ size: t = 28, className: n, ...a }) {
  return /* @__PURE__ */ e(
    "svg",
    {
      viewBox: "0 0 224 224",
      width: t,
      height: t,
      "aria-hidden": "true",
      className: ["mds-icon", n].filter(Boolean).join(" "),
      ...a,
      children: ot
    }
  );
}
const mt = {
  regular: /* @__PURE__ */ e("path", { d: "M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M120,56v48a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40h48A16,16,0,0,1,120,56Zm80-16H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm-96,96H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm96,0H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Z" })
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
      children: mt[n]
    }
  );
}
const ut = {
  regular: /* @__PURE__ */ e("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm-36,80a12,12,0,1,1,12-12A12,12,0,0,1,180,144Z" })
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
      children: ut[n]
    }
  );
}
const ht = {
  regular: /* @__PURE__ */ e("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.35,44L178.57,92.29l-80.35-44Zm0,88L47.65,76,81.56,57.43l80.35,44Zm88,55.85h0l-80,43.79V133.83l32-17.51V152a8,8,0,0,0,16,0V107.56l32-17.51v85.76Z" })
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
      children: ht[n]
    }
  );
}
const pt = {
  regular: /* @__PURE__ */ e("path", { d: "M255.42,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,255.42,117ZM192,88h34.58l9.6,24H192ZM32,72H176v64H32ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208Zm81-24H111a32,32,0,0,0-62,0H32V152H176v12.31A32.11,32.11,0,0,0,161,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm48-24H223a32.06,32.06,0,0,0-31-24V128h48Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M255.43,117l-14-35A15.93,15.93,0,0,0,226.58,72H192V64a8,8,0,0,0-8-8H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H49a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A8.13,8.13,0,0,0,255.43,117ZM80,208a16,16,0,1,1,16-16A16,16,0,0,1,80,208ZM32,136V72H176v64Zm160,72a16,16,0,1,1,16-16A16,16,0,0,1,192,208Zm0-96V88h34.58l9.6,24Z" })
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
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: pt[n]
    }
  );
}
const bt = {
  regular: /* @__PURE__ */ e("path", { d: "M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z" }),
  fill: /* @__PURE__ */ e("path", { d: "M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z" })
};
function Ua({
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
      children: bt[n]
    }
  );
}
const ft = {
  regular: /* @__PURE__ */ e("path", { d: "M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" })
};
function xt({
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
      children: ft[n]
    }
  );
}
const kt = {
  regular: /* @__PURE__ */ e("path", { d: "M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" })
};
function vt({
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
      children: kt[n]
    }
  );
}
const wt = {
  regular: /* @__PURE__ */ e("path", { d: "M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" })
};
function yt({
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
      children: wt[n]
    }
  );
}
const Nt = {
  regular: /* @__PURE__ */ e("path", { d: "M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" })
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
      className: ["mds-icon", "mds-icon-flip", a].filter(Boolean).join(" "),
      ...i,
      children: Nt[n]
    }
  );
}
const At = {
  bold: /* @__PURE__ */ e("path", { d: "M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" })
};
function Ce({
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
      children: At[n]
    }
  );
}
const St = {
  bold: /* @__PURE__ */ e("path", { d: "M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" })
};
function Bt({
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
      children: St[n]
    }
  );
}
const Ht = {
  regular: /* @__PURE__ */ e("path", { d: "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function jt({
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
      children: Ht[n]
    }
  );
}
const Mt = {
  bold: /* @__PURE__ */ e("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function te({
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
      children: Mt[n]
    }
  );
}
const Ct = {
  regular: /* @__PURE__ */ e("path", { d: "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" })
};
function Zt({
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
      children: Ct[n]
    }
  );
}
const Pt = {
  fill: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" })
};
function Tt({
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
      children: Pt[n]
    }
  );
}
const Vt = {
  bold: /* @__PURE__ */ e("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function $t({
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
      children: Vt[n]
    }
  );
}
const It = {
  bold: /* @__PURE__ */ e("path", { d: "M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" })
};
function Qa({
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
      children: It[n]
    }
  );
}
const Lt = {
  bold: /* @__PURE__ */ e("path", { d: "M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" })
};
function Xa({
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
const Ft = {
  bold: /* @__PURE__ */ e("path", { d: "M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" })
};
function Ze({
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
      children: Ft[n]
    }
  );
}
const Rt = {
  bold: /* @__PURE__ */ e("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z" })
};
function Et({
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
      children: Rt[n]
    }
  );
}
const Dt = {
  bold: /* @__PURE__ */ e("path", { d: "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z" })
};
function pe({
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
      children: Dt[n]
    }
  );
}
const qt = {
  bold: /* @__PURE__ */ e("path", { d: "M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z" })
};
function Ot({
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
      children: qt[n]
    }
  );
}
const Yt = {
  bold: /* @__PURE__ */ e("path", { d: "M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z" })
};
function _t({
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
      children: Yt[n]
    }
  );
}
const Wt = {
  regular: /* @__PURE__ */ e("path", { d: "M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z" })
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
      children: Wt[n]
    }
  );
}
const zt = {
  regular: /* @__PURE__ */ e("path", { d: "M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z" })
};
function Ut({
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
      children: zt[n]
    }
  );
}
const Gt = {
  regular: /* @__PURE__ */ e("path", { d: "M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z" })
};
function Qt({
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
      children: Gt[n]
    }
  );
}
const Xt = {
  regular: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" })
};
function Kt({
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
      children: Xt[n]
    }
  );
}
const Jt = {
  regular: /* @__PURE__ */ e("path", { d: "M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z" })
};
function en({
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
      children: Jt[n]
    }
  );
}
const tn = {
  fill: /* @__PURE__ */ e("path", { d: "M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" })
};
function nn({
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
      children: tn[n]
    }
  );
}
const an = {
  fill: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" })
};
function rn({
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
      children: an[n]
    }
  );
}
const sn = {
  regular: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function dn({
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
      children: sn[n]
    }
  );
}
const ln = {
  regular: /* @__PURE__ */ e("path", { d: "M239.76,158.06,217.28,68.12A16,16,0,0,0,201.75,56H136V40a16,16,0,0,0-16-16H80A16,16,0,0,0,64,40V56H54.25A16,16,0,0,0,38.72,68.12L16.24,158.06A7.93,7.93,0,0,0,16,160v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160A7.93,7.93,0,0,0,239.76,158.06ZM80,40h40V56H80ZM54.25,72h147.5l20,80H34.25ZM32,192V168H224v24ZM64,96a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,96Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,96ZM64,128a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H120A8,8,0,0,1,112,128Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H168A8,8,0,0,1,160,128Z" })
};
function on({
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
      children: ln[n]
    }
  );
}
const cn = {
  regular: /* @__PURE__ */ e("path", { d: "M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z" })
};
function mn({
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
const un = {
  regular: /* @__PURE__ */ e("path", { d: "M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z" })
};
function hn({
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
      children: un[n]
    }
  );
}
const pn = {
  regular: /* @__PURE__ */ e("path", { d: "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z" })
};
function gn({
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
      children: pn[n]
    }
  );
}
const bn = {
  regular: /* @__PURE__ */ e("path", { d: "M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9ZM164,96a36,36,0,0,0,5.9-.48,36,36,0,1,0,28.22-47A36,36,0,1,0,164,96Zm60-12a20,20,0,1,1-20-20A20,20,0,0,1,224,84ZM164,40a20,20,0,0,1,19.25,14.61,36,36,0,0,0-15,24.93A20.42,20.42,0,0,1,164,80a20,20,0,0,1,0-40Z" })
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
      children: bn[n]
    }
  );
}
const fn = {
  regular: /* @__PURE__ */ e("path", { d: "M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" })
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
      children: fn[n]
    }
  );
}
const xn = {
  regular: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" })
};
function kn({
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
const vn = {
  regular: /* @__PURE__ */ e("path", { d: "M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" })
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
      children: vn[n]
    }
  );
}
const wn = {
  regular: /* @__PURE__ */ e("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
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
      className: ["mds-icon", a].filter(Boolean).join(" "),
      ...i,
      children: wn[n]
    }
  );
}
const yn = {
  regular: /* @__PURE__ */ e("path", { d: "M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z" })
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
      children: yn[n]
    }
  );
}
const Nn = {
  regular: /* @__PURE__ */ e("path", { d: "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z" })
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
      children: Nn[n]
    }
  );
}
const An = {
  regular: /* @__PURE__ */ e("path", { d: "M42.76,50A8,8,0,0,0,40,56V224a8,8,0,0,0,16,0V179.77c26.79-21.16,49.87-9.75,76.45,3.41,16.4,8.11,34.06,16.85,53,16.85,13.93,0,28.54-4.75,43.82-18a8,8,0,0,0,2.76-6V56A8,8,0,0,0,218.76,50c-28,24.23-51.72,12.49-79.21-1.12C111.07,34.76,78.78,18.79,42.76,50ZM216,172.25c-26.79,21.16-49.87,9.74-76.45-3.41-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16,49.87-9.75,76.45,3.4,25,12.35,52.82,26.13,83.55,8.4Z" })
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
      children: An[n]
    }
  );
}
const Sn = {
  regular: /* @__PURE__ */ e("path", { d: "M216,40H68.53a16.08,16.08,0,0,0-13.72,7.77L9.14,123.88a8,8,0,0,0,0,8.24l45.67,76.11A16.08,16.08,0,0,0,68.53,216H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM61.67,204.12,68.53,200h0ZM216,200H68.53l-43.2-72,43.2-72H216ZM106.34,146.34,124.69,128l-18.35-18.34a8,8,0,0,1,11.32-11.32L136,116.69l18.34-18.35a8,8,0,0,1,11.32,11.32L147.31,128l18.35,18.34a8,8,0,0,1-11.32,11.32L136,139.31l-18.34,18.35a8,8,0,0,1-11.32-11.32Z" })
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
      children: Sn[n]
    }
  );
}
const Bn = {
  regular: /* @__PURE__ */ e("path", { d: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" })
};
function di({
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
      children: Bn[n]
    }
  );
}
const Hn = {
  regular: /* @__PURE__ */ e("path", { d: "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z" })
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
      children: Hn[n]
    }
  );
}
const jn = {
  regular: /* @__PURE__ */ e("path", { d: "M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" })
};
function oi({
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
      children: jn[n]
    }
  );
}
const Mn = {
  regular: /* @__PURE__ */ e("path", { d: "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" })
};
function Pe({
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
      children: Mn[n]
    }
  );
}
const Cn = {
  regular: /* @__PURE__ */ e("path", { d: "M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z" })
};
function Zn({
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
      children: Cn[n]
    }
  );
}
const Pn = {
  regular: /* @__PURE__ */ e("path", { d: "M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" })
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
      children: Pn[n]
    }
  );
}
const Tn = {
  regular: /* @__PURE__ */ e("path", { d: "M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,160H56V56H200V200Z" })
};
function mi({
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
      children: Tn[n]
    }
  );
}
const Vn = {
  regular: /* @__PURE__ */ e("path", { d: "M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" })
};
function ui({
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
      children: Vn[n]
    }
  );
}
const $n = {
  regular: /* @__PURE__ */ e("path", { d: "M197.66,69.66,83.31,184H168a8,8,0,0,1,0,16H64a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v84.69L186.34,58.34a8,8,0,0,1,11.32,11.32Z" })
};
function In({
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
      children: $n[n]
    }
  );
}
const Ln = {
  regular: /* @__PURE__ */ e("path", { d: "M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" })
};
function Fn({
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
      children: Ln[n]
    }
  );
}
const Rn = {
  regular: /* @__PURE__ */ e("path", { d: "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" })
};
function En({
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
      children: Rn[n]
    }
  );
}
const Dn = {
  regular: /* @__PURE__ */ e("path", { d: "M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" })
};
function qn({
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
      children: Dn[n]
    }
  );
}
const On = {
  regular: /* @__PURE__ */ e("path", { d: "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" })
};
function Yn({
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
      children: On[n]
    }
  );
}
const _n = {
  regular: /* @__PURE__ */ e("path", { d: "M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z" })
};
function hi({
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
      children: _n[n]
    }
  );
}
const Wn = {
  regular: /* @__PURE__ */ e("path", { d: "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z" })
};
function pi({
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
  regular: /* @__PURE__ */ e("path", { d: "M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" })
};
function gi({
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
      children: zn[n]
    }
  );
}
const Un = {
  regular: /* @__PURE__ */ e("path", { d: "M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function bi({
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
      children: Un[n]
    }
  );
}
const Gn = {
  regular: /* @__PURE__ */ e("path", { d: "M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" })
};
function fi({
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
      children: Gn[n]
    }
  );
}
const Qn = {
  regular: /* @__PURE__ */ e("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" })
};
function xi({
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
      children: Qn[n]
    }
  );
}
const Xn = {
  regular: /* @__PURE__ */ e("path", { d: "M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z" })
};
function ki({
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
      children: Xn[n]
    }
  );
}
const Kn = {
  regular: /* @__PURE__ */ e("path", { d: "M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z" })
};
function vi({
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
      children: Kn[n]
    }
  );
}
const Jn = {
  regular: /* @__PURE__ */ e("path", { d: "M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z" })
};
function wi({
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
      children: Jn[n]
    }
  );
}
const ea = {
  bold: /* @__PURE__ */ e("path", { d: "M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z" })
};
function yi({
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
      children: ea[n]
    }
  );
}
const Ni = ["nav-delivery", "back", "forward", "transfer", "movement-in", "movement-out", "send"];
function E({
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
  ...h
}) {
  const { hidden: g } = D(), b = g && t !== null && t !== void 0, p = V(t, { flow: n, debt: a, hidden: b, texts: A }), f = ["mds-money", `mds-money--${i}`, i === "lg" ? "mds-number-lg" : "", s ? "mds-money--disabled" : "", d].filter(Boolean).join(" ");
  return r === "loading" ? /* @__PURE__ */ e("span", { ref: c, id: l, style: m, className: f, "aria-busy": "true", ...h, children: /* @__PURE__ */ e("span", { className: "mds-money-skeleton", "aria-hidden": "true" }) }) : /* @__PURE__ */ o("span", { ref: c, id: l, style: m, className: f, ...h, children: [
    /* @__PURE__ */ o("span", { className: "mds-money-visual", "aria-hidden": "true", children: [
      p.debtWord ? /* @__PURE__ */ e("span", { className: "mds-money-debt", children: p.debtWord }) : null,
      p.missing ? /* @__PURE__ */ e("span", { className: "mds-money-missing", children: A.missingGlyph }) : /* @__PURE__ */ o(T, { children: [
        /* @__PURE__ */ e("bdi", { className: "mds-money-value", dir: "ltr", children: p.hidden ? A.hiddenGlyph : /* @__PURE__ */ o(T, { children: [
          /* @__PURE__ */ o("span", { className: "mds-money-integer", children: [
            p.sign,
            p.int
          ] }),
          p.frac ? /* @__PURE__ */ e("span", { className: "mds-money-fraction", children: p.frac }) : null
        ] }) }),
        /* @__PURE__ */ e("span", { className: "mds-money-unit", children: p.unit })
      ] })
    ] }, b ? "hidden" : "shown"),
    /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: p.aria })
  ] });
}
const Ai = [
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
function ta({
  onChange: t,
  disabled: n = !1,
  density: a = "regular",
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const { hidden: m, visible: c } = D(), h = m ? yt : vt, g = M(m ? "button.showAmounts" : "button.hideAmounts"), b = [
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
      className: b,
      "aria-label": g,
      disabled: n,
      onClick: () => t?.(!c),
      children: /* @__PURE__ */ e(h, { size: 24 })
    }
  );
}
const Si = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "amountsShown",
  "amountsHidden"
];
function Bi({
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
  "aria-label": h,
  ...g
}) {
  const b = [
    // .mds-control-row (base.css): the shared row-plain anatomy; the box
    // aligns to the FIRST text line, so the alignment overrides to start.
    "mds-control-row",
    "mds-checkbox",
    a ? "mds-checkbox--selected" : "",
    r ? "mds-checkbox--disabled" : "",
    s === "error" ? "mds-checkbox--error" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("label", { ref: c, id: l, style: m, className: b, ...g, children: [
    /* @__PURE__ */ e(
      "input",
      {
        type: "checkbox",
        className: "mds-checkbox-input mds-sr-input",
        checked: a,
        disabled: r,
        onChange: (p) => i?.(p.target.checked),
        "aria-label": h,
        "aria-invalid": s === "error" || void 0
      }
    ),
    /* @__PURE__ */ e("span", { className: "mds-checkbox-box", "aria-hidden": "true", children: /* @__PURE__ */ e(te, { size: 14 }) }),
    /* @__PURE__ */ o("span", { className: "mds-checkbox-text mds-control-text", children: [
      /* @__PURE__ */ e("span", { className: "mds-checkbox-label mds-type-body", children: t }),
      n ? /* @__PURE__ */ e("span", { className: "mds-checkbox-caption mds-type-caption", children: n }) : null
    ] }),
    s === "error" ? /* @__PURE__ */ e("span", { className: "mds-checkbox-error mds-type-caption", children: M("checkbox.tickThis") }) : null
  ] });
}
const Hi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function ji({
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
  ...h
}) {
  const g = ue(), b = [
    "mds-radio",
    r ? "mds-radio--disabled" : "",
    s === "error" ? "mds-radio--error" : "",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: c, id: l, style: m, className: b, ...h, children: [
    /* @__PURE__ */ e("span", { className: "mds-radio-label mds-type-label", children: t }),
    /* @__PURE__ */ e("div", { className: "mds-radio-surface", role: "radiogroup", "aria-label": t, children: n.map((p) => {
      const f = p.value === a;
      return /* @__PURE__ */ o("label", { className: "mds-control-row mds-radio-row", children: [
        /* @__PURE__ */ e(
          "input",
          {
            type: "radio",
            className: "mds-radio-input mds-sr-input",
            name: g,
            checked: f,
            disabled: r || p.disabled,
            onChange: () => i?.(p.value)
          }
        ),
        /* @__PURE__ */ e("span", { className: "mds-radio-circle", "aria-hidden": "true", children: /* @__PURE__ */ e("span", { className: "mds-radio-dot" }) }),
        /* @__PURE__ */ o("span", { className: "mds-radio-text mds-control-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-radio-row-label mds-type-body", children: p.label }),
          p.caption ? /* @__PURE__ */ e("span", { className: "mds-radio-caption mds-type-caption", children: p.caption }) : null
        ] })
      ] }, p.value);
    }) }),
    s === "error" ? /* @__PURE__ */ e("span", { className: "mds-radio-error mds-type-caption", children: M("radio.choose").replace("{label}", t) }) : null
  ] });
}
const Mi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "error"
];
function na({
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
  const h = [
    // .mds-control-row (base.css): the whole row is the switch's press zone.
    "mds-control-row",
    "mds-toggle",
    a ? "mds-toggle--selected" : "",
    r ? "mds-toggle--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("label", { ref: m, id: d, style: l, className: h, ...c, children: [
    /* @__PURE__ */ e(
      "input",
      {
        type: "checkbox",
        className: "mds-toggle-input mds-sr-input",
        role: "switch",
        checked: a,
        disabled: r,
        onChange: (g) => i?.(g.target.checked),
        "aria-checked": a
      }
    ),
    /* @__PURE__ */ o("span", { className: "mds-toggle-text mds-control-text", children: [
      /* @__PURE__ */ e("span", { className: "mds-toggle-label mds-type-body", children: t }),
      n ? /* @__PURE__ */ e("span", { className: "mds-toggle-caption mds-type-caption", children: n }) : null
    ] }),
    /* @__PURE__ */ e("span", { className: "mds-toggle-switch", "aria-hidden": "true", children: /* @__PURE__ */ e("span", { className: "mds-toggle-track", children: /* @__PURE__ */ e("span", { className: "mds-toggle-thumb", children: /* @__PURE__ */ e(te, { size: 14 }) }) }) })
  ] });
}
const Ci = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled"
];
function Zi({
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
  const h = a.length > 0, g = [
    "mds-search-field",
    r ? "mds-search-field--disabled" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: m, id: d, style: l, className: g, ...c, children: [
    /* @__PURE__ */ e(Zt, { size: 20 }),
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
        onChange: (b) => i?.(b.target.value)
      }
    ),
    h ? /* @__PURE__ */ e(
      aa,
      {
        onClear: () => {
          i?.("");
        }
      }
    ) : null
  ] });
}
function aa({ onClear: t }) {
  const { isPressed: n, pressProps: a } = H({ onPress: t });
  return /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: ["mds-search-field-clear", n ? "mds-search-field-clear--pressed" : ""].filter(Boolean).join(" "),
      "data-ds-exempt": "",
      "aria-label": M("sr.clearSearch"),
      ...a,
      children: /* @__PURE__ */ e(Tt, { size: 20 })
    }
  );
}
const Pi = [
  "default",
  "focused",
  "disabled",
  "withText"
];
function Te({
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
  style: h,
  ref: g,
  ...b
}) {
  const p = ue(), f = ce(() => `${p}-error`, [p]), x = [
    "mds-field",
    "mds-text-area",
    s === "error" ? "mds-text-area--error" : "",
    d ? "mds-text-area--disabled mds-field--disabled" : "",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { id: c, style: h, className: x, ...b, children: [
    /* @__PURE__ */ o("label", { className: "mds-text-area-label mds-type-label", htmlFor: c ?? p, children: [
      t,
      l ? /* @__PURE__ */ e("span", { className: "mds-text-area-optional mds-type-caption", children: M("field.optional") }) : null
    ] }),
    /* @__PURE__ */ e(
      "textarea",
      {
        ref: g,
        id: c ?? p,
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
      /* @__PURE__ */ e($t, { size: 16 }),
      /* @__PURE__ */ e("span", { children: n })
    ] }) : n ? /* @__PURE__ */ e("span", { className: "mds-text-area-help mds-type-caption", children: /* @__PURE__ */ e("span", { children: n }) }) : null
  ] });
}
const Ti = [
  "default",
  "focused",
  "error",
  "disabled",
  "grown"
], ve = 1632, ia = 1641, ra = 1643;
function sa(t) {
  let n = "", a = !1;
  for (const r of t) {
    const s = r.codePointAt(0);
    if (s >= ve && s <= ia) {
      const d = String(s - ve);
      n = i(n, d);
      continue;
    }
    if (r >= "0" && r <= "9") {
      n = i(n, r);
      continue;
    }
    if ((s === ra || r === "." || r === ",") && !a) {
      n === "" && (n = "0"), n += ".", a = !0;
      continue;
    }
  }
  return n;
  function i(r, s) {
    return r.includes(".") && r.length - r.indexOf(".") - 1 >= 3 || r === "0" && s === "0" ? r : r === "0" ? s : r + s;
  }
}
function da({
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
  ref: h,
  ...g
}) {
  const [b, p] = j(!1), f = [
    "mds-amount-field",
    r ? "mds-amount-field--disabled" : "",
    s === "error" ? "mds-amount-field--error" : "",
    d ? "mds-amount-field--draft" : "",
    l
  ].filter(Boolean).join(" "), x = b || a === "" ? a : V(a, { texts: A }).int + (a.includes(".") ? V(a, { texts: A }).frac : "");
  return /* @__PURE__ */ o("div", { id: m, style: c, className: f, ...g, children: [
    /* @__PURE__ */ e("span", { className: "mds-amount-field-label mds-type-label", children: t }),
    /* @__PURE__ */ o("div", { className: "mds-amount-field-box", children: [
      /* @__PURE__ */ e(
        "input",
        {
          ref: h,
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
          onFocus: () => p(!0),
          onBlur: () => p(!1),
          "data-long": x.length > 13 ? "true" : void 0,
          onChange: (k) => i?.(sa(k.target.value))
        }
      ),
      /* @__PURE__ */ e("span", { className: "mds-amount-field-unit", children: A.unit })
    ] }),
    s === "error" && n ? /* @__PURE__ */ e("span", { className: "mds-amount-field-help", children: n }) : n ? /* @__PURE__ */ e("span", { className: "mds-amount-field-help", children: n }) : null
  ] });
}
const Vi = [
  "default",
  "focused",
  "error",
  "disabled",
  "long"
], la = {
  done: Ze,
  waiting: Et,
  problem: pe,
  info: Ot
}, oa = {
  done: u["badge.done"].text,
  waiting: u["badge.waiting"].text,
  problem: u["badge.problem"].text,
  info: u["badge.info"].text,
  neutral: u["badge.neutral"].text
};
function L({
  tone: t,
  label: n,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  const l = t === "neutral" ? null : la[t], m = ["mds-status-badge", `mds-status-badge--${t}`, a].filter(Boolean).join(" ");
  return /* @__PURE__ */ e("span", { ref: s, id: i, style: r, className: m, ...d, children: /* @__PURE__ */ o("span", { className: "mds-status-badge-content", children: [
    l ? /* @__PURE__ */ e(l, { size: 14 }) : null,
    /* @__PURE__ */ e("span", { className: "mds-status-badge-label", children: n ?? oa[t] })
  ] }, t) });
}
const $i = [
  "neutral",
  "info",
  "done",
  "waiting",
  "problem",
  "longLabel"
], ca = {
  done: nn,
  waiting: rn
};
function ma(t) {
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
  const h = i === "done" || i === "waiting" ? ca[i] : null, g = r ? void 0 : a ? ma(a) : void 0, b = [
    "mds-entity-mark",
    `mds-entity-mark--${t}`,
    n === "canvas" ? "mds-entity-mark--canvas" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("span", { ref: m, id: d, style: l, className: b, "aria-hidden": "true", ...c, children: [
    r ?? (g ? /* @__PURE__ */ e("span", { className: "mds-entity-mark-initial", children: g }) : null),
    h ? /* @__PURE__ */ e("span", { className: "mds-entity-mark-badge", children: /* @__PURE__ */ e(h, { size: 14 }) }) : null
  ] });
}
const Ii = [
  "initial",
  "sizes",
  "fundTypes",
  "approved",
  "pending",
  "withImageRule"
];
function J({
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
  id: h,
  style: g,
  ref: b,
  children: p,
  ...f
}) {
  const { isPressed: x, pressProps: k } = H({
    onPress: d,
    onLongPress: l,
    disabled: m || i
  }), v = Me(i), y = [
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
      ref: b,
      id: h,
      style: g,
      ...f,
      ...k,
      type: "button",
      className: y,
      disabled: m,
      "aria-busy": i || void 0,
      children: [
        v ? /* @__PURE__ */ e("span", { className: "mds-button-spinner", "aria-hidden": "true" }) : r ? /* @__PURE__ */ e("span", { className: "mds-button-icon", children: r }) : null,
        /* @__PURE__ */ e("span", { className: "mds-button-label", children: p }),
        s ? /* @__PURE__ */ e("span", { className: "mds-button-icon", children: s }) : null
      ]
    }
  );
}
const Li = [
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
function ua({
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
  ...h
}) {
  const { isPressed: g, pressProps: b } = H({ onPress: n, onLongPress: a, disabled: i }), p = [
    "mds-icon-button",
    r === "large" ? "mds-icon-button--large" : "",
    g ? "mds-icon-button--pressed" : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e(
    "button",
    {
      ref: m,
      id: d,
      style: l,
      ...h,
      ...b,
      type: "button",
      className: p,
      "aria-label": t,
      disabled: i,
      children: c
    }
  );
}
const Fi = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "large"
];
function de({
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
  style: h,
  ref: g,
  ...b
}) {
  const p = [
    "mds-field",
    "mds-text-field",
    s === "error" ? "mds-text-field--error" : "",
    d ? "mds-text-field--disabled mds-field--disabled" : "",
    m
  ].filter(Boolean).join(" "), f = c ? `${c}-input` : void 0;
  return /* @__PURE__ */ o("span", { ref: g, id: c, style: h, className: p, ...b, children: [
    /* @__PURE__ */ o("label", { className: "mds-text-field-label mds-type-label", htmlFor: f, children: [
      t,
      l ? /* @__PURE__ */ e("span", { className: "mds-text-field-optional mds-type-caption", children: M("field.optional") }) : null
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
      s === "error" ? /* @__PURE__ */ e(pe, { size: 14 }) : null,
      n
    ] }) : null
  ] });
}
const Ri = [
  "default",
  "focused",
  "disabled",
  "error",
  "withCaption",
  "withPlaceholder"
];
function ha({
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
      children: t.map((h) => /* @__PURE__ */ e(
        pa,
        {
          segment: h,
          selected: h.value === n,
          disabled: i || h.disabled === !0,
          onChange: a
        },
        h.value
      ))
    }
  );
}
function pa({
  segment: t,
  selected: n,
  disabled: a,
  onChange: i
}) {
  const { isPressed: r, pressProps: s } = H({ onPress: () => i(t.value), disabled: a }), d = [
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
const Ei = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "threeSegments",
  "fourSegments",
  "withIcon"
];
function Di({
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
  const h = (g) => {
    const b = n.includes(g) ? n.filter((p) => p !== g) : [...n, g];
    a(b);
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
      children: t.map((g) => /* @__PURE__ */ e(
        ga,
        {
          chip: g,
          selected: n.includes(g.value),
          disabled: i || g.disabled === !0,
          onToggle: h
        },
        g.value
      ))
    }
  );
}
function ga({
  chip: t,
  selected: n,
  disabled: a,
  onToggle: i
}) {
  const { isPressed: r, pressProps: s } = H({ onPress: () => i(t.value), disabled: a }), d = [
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
        n ? /* @__PURE__ */ e(te, { size: 16, className: "mds-filter-chip-check" }) : null,
        /* @__PURE__ */ e("span", { className: "mds-filter-chip-label", children: t.label })
      ]
    }
  );
}
const qi = [
  "default",
  "selected",
  "pressed",
  "focused",
  "disabled",
  "manyChips"
];
function le({
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
const Oi = [
  "default",
  "withHeader",
  "withAction",
  "pressed",
  "list"
];
function oe({ children: t, className: n, id: a, style: i, ref: r, ...s }) {
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
const Yi = [
  "default",
  "inSurface"
];
function _i({
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
  const c = i == null, { isPressed: h, pressProps: g } = H({ onPress: () => a?.(), disabled: c }), b = !c && a !== void 0, p = ["mds-section", r].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("section", { ref: l, id: s, style: d, className: p, ...m, children: [
    /* @__PURE__ */ o("header", { className: "mds-section-header", children: [
      /* @__PURE__ */ e("h2", { className: "mds-section-title mds-type-title-section", children: t }),
      n !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-section-count", children: n }) : null,
      b ? /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: ["mds-section-see-all", h ? "mds-section-see-all--pressed" : ""].filter(Boolean).join(" "),
          "data-ds-exempt": "",
          ...g,
          children: [
            /* @__PURE__ */ e("span", { className: "mds-section-see-all-label", children: M("button.all") }),
            /* @__PURE__ */ e(Ce, { size: 16, className: "mds-section-see-all-icon" })
          ]
        }
      ) : null
    ] }),
    i
  ] });
}
const Wi = [
  "default",
  "withCount",
  "withSeeAll",
  "empty"
], ee = 80, Ve = _.size["dot-signal"] / 2, ba = _.border["signal-line"], G = Ve + ba / 2;
function fa(t, n) {
  const a = t.length, i = Math.min(...t), s = Math.max(...t) - i, d = (c) => a === 1 ? ee - G : G + c / (a - 1) * (ee - 2 * G), l = (c) => s === 0 ? n / 2 : G + (1 - (c - i) / s) * (n - 2 * G);
  return { points: t.map((c, h) => `${d(h).toFixed(2)},${l(c).toFixed(2)}`).join(" "), endX: d(a - 1), endY: l(t[a - 1]) };
}
function $e({
  values: t,
  lineClassName: n,
  dotClassName: a,
  hidden: i = !1,
  height: r,
  fullWidth: s = !1
}) {
  const d = r ?? _.size["sparkline-height"], l = !i && t.length >= 1 ? fa(t, d) : null;
  return /* @__PURE__ */ o(
    "svg",
    {
      viewBox: `0 0 ${ee} ${d}`,
      width: s ? "100%" : ee,
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
              strokeWidth: _.size["dot-signal"],
              strokeLinecap: "round",
              vectorEffect: "non-scaling-stroke",
              fill: "none"
            }
          )
        ) : /* @__PURE__ */ e("circle", { className: a, cx: l.endX, cy: l.endY, r: Ve }) : null
      ]
    }
  );
}
function zi({
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
  className: h,
  id: g,
  style: b,
  ref: p,
  ...f
}) {
  const { isPressed: x, pressProps: k } = H({ onPress: () => m?.(), disabled: c }), { hidden: v } = D(), y = d !== void 0, w = r != null && typeof r != "string", S = r === void 0 ? A.missingGlyph : w ? r : v && y ? A.hiddenGlyph : r, $ = [
    "mds-tile",
    `mds-tile--${l}`,
    x ? "mds-tile--pressed" : "",
    c ? "mds-tile--disabled" : "",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: p,
      id: g,
      style: b,
      type: "button",
      className: $,
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
            $e,
            {
              values: d,
              hidden: v,
              lineClassName: "mds-tile-sparkline-line",
              dotClassName: "mds-tile-sparkline-dot"
            }
          ) }) : null,
          /* @__PURE__ */ e("span", { className: "mds-tile-value", children: w ? S : /* @__PURE__ */ e("bdi", { dir: "ltr", children: S }) }),
          s ? /* @__PURE__ */ e("span", { className: "mds-tile-line mds-type-caption", children: s }) : null
        ] })
      ]
    }
  );
}
const Ui = [
  "default",
  "withDot",
  "withSparkline",
  "pressed",
  "focused",
  "disabled"
];
function xa(t) {
  const n = t.indexOf(".");
  return n === -1 ? { whole: t, cents: "" } : { whole: t.slice(0, n), cents: t.slice(n) };
}
function ka({ value: t }) {
  const { hidden: n } = D(), i = t === void 0 ? A.missingGlyph : n ? A.hiddenGlyph : null, { whole: r, cents: s } = xa(t ?? A.missingGlyph), l = (t ?? "").length > 9 ? "mds-hero-value--lg mds-number-lg" : "mds-hero-value--hero mds-type-display-hero";
  return /* @__PURE__ */ e("span", { className: `mds-hero-value ${l}`, children: /* @__PURE__ */ e("bdi", { dir: "ltr", children: i !== null ? /* @__PURE__ */ e("span", { className: "mds-hero-value-glyph", children: i }) : /* @__PURE__ */ o(T, { children: [
    /* @__PURE__ */ e("span", { className: "mds-hero-value-whole", children: r }),
    s ? /* @__PURE__ */ e("span", { className: "mds-hero-value-cents", children: s }) : null
  ] }) }) });
}
function va({ values: t }) {
  const { hidden: n } = D();
  return /* @__PURE__ */ e("span", { className: "mds-hero-sparkline", "aria-hidden": "true", children: /* @__PURE__ */ e(
    $e,
    {
      values: t,
      hidden: n,
      height: _.size["hero-sparkline-height"],
      fullWidth: !0,
      lineClassName: "mds-hero-sparkline-line",
      dotClassName: "mds-hero-sparkline-dot"
    }
  ) });
}
function Gi({
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
  style: h,
  ref: g,
  ...b
}) {
  const { isPressed: p, pressProps: f } = H({ onPress: () => d?.() }), { hidden: x } = D(), k = x && n !== void 0, v = ["mds-hero-surface", m].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("section", { ref: g, id: c, style: h, className: v, ...b, children: [
    /* @__PURE__ */ o("header", { className: "mds-hero-header", children: [
      /* @__PURE__ */ e("span", { className: "mds-hero-label", children: t }),
      /* @__PURE__ */ e(ta, { className: "mds-hero-toggle", onChange: l })
    ] }),
    /* @__PURE__ */ o("p", { className: "mds-hero-amount", children: [
      /* @__PURE__ */ o("span", { className: "mds-hero-visual", "aria-hidden": k || void 0, children: [
        /* @__PURE__ */ e(ka, { value: n }),
        a && n !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-hero-unit", children: a }) : null
      ] }, k ? "hidden" : "shown"),
      k ? /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: A.hidden }) : null
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
            className: ["mds-hero-source", p ? "mds-hero-source--pressed" : ""].filter(Boolean).join(" "),
            "data-ds-exempt": "",
            ...f,
            children: r
          }
        ) : null
      ] })
    ) : null,
    s ? /* @__PURE__ */ e(va, { values: s }) : null
  ] });
}
const Qi = [
  "default",
  "withCents",
  "missing",
  "longNumber",
  "noDiff",
  "withSparkline"
];
function we(t) {
  return t != null && typeof t != "string";
}
function re({
  leading: t,
  tone: n,
  label: a,
  caption: i,
  value: r,
  trailing: s,
  onPress: d,
  landed: l = !1,
  disabled: m = !1,
  className: c,
  id: h,
  style: g,
  ref: b,
  ...p
}) {
  const { isPressed: f, pressProps: x } = H({ onPress: () => d?.(), disabled: m }), k = d !== void 0, v = [
    "mds-object-row",
    we(t) ? "mds-object-row--icon" : "",
    f ? "mds-object-row--pressed" : "",
    l ? "mds-object-row--landed" : "",
    m ? "mds-object-row--disabled" : "",
    k ? "" : "mds-object-row--passive",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    k ? "button" : "div",
    {
      ref: b,
      id: h,
      style: g,
      type: k ? "button" : void 0,
      className: v,
      disabled: k ? m : void 0,
      ...k ? x : {},
      ...p,
      children: [
        we(t) ? (
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
const Xi = [
  "default",
  "oneLine",
  "withBadge",
  "pressed",
  "landed",
  "focused",
  "disabled"
];
function Ki({
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
  className: h,
  id: g,
  style: b,
  ref: p,
  ...f
}) {
  const { isPressed: x, pressProps: k } = H({ onPress: () => m?.(), disabled: c }), v = m !== void 0 || d !== void 0, y = l != null, w = d ? "a" : v ? "button" : "div", S = [
    "mds-object-card",
    x ? "mds-object-card--pressed" : "",
    c ? "mds-object-card--disabled" : "",
    y ? "mds-object-card--with-action" : "",
    v ? "" : "mds-object-card--passive",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: p, id: g, style: b, className: ["mds-object-card-wrap", c ? "mds-object-card-wrap--disabled" : "", h].filter(Boolean).join(" "), ...f, children: [
    /* @__PURE__ */ o(
      w,
      {
        className: S,
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
    y ? /* @__PURE__ */ e("span", { className: "mds-object-card-action", children: l }) : null
  ] });
}
const Ji = [
  "default",
  "withBadge",
  "withButton",
  "pressed",
  "focused",
  "disabled"
];
function wa(t) {
  const n = t.indexOf(".");
  return n === -1 ? { whole: t, cents: "" } : { whole: t.slice(0, n), cents: t.slice(n) };
}
function ya({
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
  style: h,
  ref: g,
  ...b
}) {
  const { isPressed: p, pressProps: f } = H({ onPress: () => d?.() }), { hidden: x } = D(), k = x && a !== void 0 && a !== null && !l, { whole: v, cents: y } = wa(k ? "—" : a ?? "—"), w = ["mds-metric", m].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("div", { ref: g, id: c, style: h, className: w, ...b, children: [
    /* @__PURE__ */ e("span", { className: "mds-metric-label mds-type-label", children: t }),
    /* @__PURE__ */ e("p", { className: "mds-metric-amount", children: l ? /* @__PURE__ */ e("span", { className: "mds-metric-skeleton", "aria-busy": "true" }) : k ? /* @__PURE__ */ o(T, { children: [
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
            /* @__PURE__ */ e("bdi", { dir: "ltr", children: /* @__PURE__ */ e("span", { className: "mds-metric-value-whole", children: A.hiddenGlyph }) }),
            i ? /* @__PURE__ */ e("span", { className: "mds-metric-unit", children: i }) : null
          ]
        }
      ),
      /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: A.hidden })
    ] }) : /* @__PURE__ */ o(T, { children: [
      /* @__PURE__ */ e(
        "span",
        {
          className: [
            "mds-metric-value mds-metric-value--hero",
            n === "sm" ? "mds-number-lg" : "mds-type-display-hero"
          ].join(" "),
          children: /* @__PURE__ */ o("bdi", { dir: "ltr", children: [
            /* @__PURE__ */ e("span", { className: "mds-metric-value-whole", children: v }),
            y ? /* @__PURE__ */ e("span", { className: "mds-metric-value-cents", children: y }) : null
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
        className: ["mds-metric-source", p ? "mds-metric-source--pressed" : ""].filter(Boolean).join(" "),
        "data-ds-exempt": "",
        ...f,
        children: s
      }
    ) : null
  ] });
}
const er = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
];
function tr({ size: t, ...n }) {
  return /* @__PURE__ */ e(ya, { ...n, size: "sm", className: ["mds-metric-small", n.className].filter(Boolean).join(" ") });
}
const nr = [
  "default",
  "withCents",
  "missing",
  "loading",
  "noDiff"
], se = /* @__PURE__ */ new Set();
function ge({
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
  const c = Z(null), [h, g] = j(0), [b, p] = j(!1), [f, x] = j(!1), k = Z(0), v = Z(0), y = Z(0), w = Z(null), S = Z(i);
  R(() => {
    S.current = i;
  }, [i]);
  const $ = O(() => {
    w.current?.focus?.(), S.current();
  }, []), [I] = j(() => /* @__PURE__ */ Symbol("sheet")), [X] = j(() => (se.add(I), se.size >= 2 ? 2 : 1));
  R(
    () => () => {
      se.delete(I);
    },
    [I]
  );
  const Y = () => {
    const B = c.current?.querySelector(".mds-sheet-panel");
    return B ? B.getBoundingClientRect().height * 0.3 : 0;
  }, W = O(() => {
    if (f) return;
    w.current = document.activeElement ?? null, x(!0), (typeof requestAnimationFrame == "function" ? requestAnimationFrame : (P) => setTimeout(() => P(performance.now()), 0))(() => {
      const P = c.current?.querySelector(".mds-sheet-panel");
      if (!P) {
        $();
        return;
      }
      const F = getComputedStyle(P).transitionDuration, xe = F && F !== "0s" && F !== "";
      if (P.style.transform = "translateY(100%)", !xe) {
        $();
        return;
      }
      const U = (Fe) => {
        Fe.propertyName === "transform" && (P.removeEventListener("transitionend", U), $());
      };
      P.addEventListener("transitionend", U);
    });
  }, [f, $]), ne = (B) => {
    if (!b) return;
    const P = performance.now(), F = P - y.current;
    F > 0 && (k.current = (B.clientY - v.current) / F), v.current = B.clientY, y.current = P, g(Math.max(0, B.clientY - K.current));
  }, K = Z(0), q = (B) => {
    const P = B.target, F = c.current?.querySelector(".mds-sheet-body");
    if (!(F?.contains(P) && F && F.scrollTop > 0)) {
      if (f) {
        const U = c.current?.querySelector(".mds-sheet-panel");
        U && (U.style.transform = h ? `translateY(${h}px)` : ""), x(!1);
      }
      k.current = 0, v.current = B.clientY, y.current = performance.now(), p(!0), B.currentTarget.setPointerCapture?.(B.pointerId);
    }
  }, fe = () => {
    if (!b) return;
    p(!1);
    const B = h > Y(), P = k.current > 0.6;
    B || P ? W() : g(0);
  };
  R(() => {
    const B = (P) => {
      P.key === "Escape" && W();
    };
    return window.addEventListener("keydown", B), () => window.removeEventListener("keydown", B);
  }, [W]);
  const Le = [
    "mds-sheet",
    n === "form" ? "mds-sheet--form" : "",
    X === 2 ? "mds-sheet--stacked" : "",
    b ? "mds-sheet--dragging" : "",
    f ? "mds-sheet--closing" : "",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "div",
    {
      ref: (B) => {
        c.current = B, typeof l == "function" ? l(B) : l && (l.current = B);
      },
      id: s,
      style: d,
      className: Le,
      "data-ds-sheet-level": String(X),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": t,
      ...m,
      children: [
        /* @__PURE__ */ e(
          "div",
          {
            className: "mds-sheet-scrim",
            onClick: () => W(),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ o(
          "div",
          {
            className: "mds-sheet-panel",
            style: h ? { transform: `translateY(${h}px)` } : void 0,
            children: [
              /* @__PURE__ */ o(
                "div",
                {
                  className: "mds-sheet-grab",
                  onPointerDown: (B) => {
                    K.current = B.clientY - h, q(B);
                  },
                  onPointerMove: ne,
                  onPointerUp: fe,
                  onPointerCancel: fe,
                  children: [
                    /* @__PURE__ */ e("span", { className: "mds-sheet-handle", "aria-hidden": "true" }),
                    /* @__PURE__ */ e("header", { className: "mds-sheet-header", children: /* @__PURE__ */ e("h2", { className: "mds-sheet-title mds-type-title-section", children: t }) })
                  ]
                }
              ),
              /* @__PURE__ */ e("div", { className: "mds-sheet-close", children: /* @__PURE__ */ e(ua, { label: t, onPress: W, children: /* @__PURE__ */ e(jt, {}) }) }),
              /* @__PURE__ */ e("div", { className: "mds-sheet-body", children: a })
            ]
          }
        )
      ]
    }
  );
}
const ar = [
  "default",
  "open",
  "dragging",
  "pastThreshold",
  "stacked"
];
function ir({
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
  const h = Z(null);
  return R(() => {
    h.current?.focus();
  }, []), /* @__PURE__ */ e(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-confirm-sheet", s].filter(Boolean).join(" "),
      ...c,
      children: /* @__PURE__ */ o(
        ge,
        {
          label: t,
          onDismiss: r,
          className: "mds-confirm-sheet__sheet",
          role: "alertdialog",
          "data-ds-check": "confirm-sheet",
          children: [
            /* @__PURE__ */ o("div", { className: "mds-confirm-sheet-head", children: [
              /* @__PURE__ */ e("span", { className: "mds-confirm-sheet-icon", children: /* @__PURE__ */ e(dn, {}) }),
              /* @__PURE__ */ e("h2", { className: "mds-confirm-sheet-title mds-type-title-section", children: t }),
              /* @__PURE__ */ e("p", { className: "mds-confirm-sheet-sentence", children: n })
            ] }),
            /* @__PURE__ */ o("div", { className: "mds-confirm-sheet-actions", children: [
              /* @__PURE__ */ e(
                J,
                {
                  ref: h,
                  variant: "secondary",
                  className: "mds-confirm-sheet-back",
                  onPress: r,
                  children: u["button.back"].text
                }
              ),
              /* @__PURE__ */ e(J, { variant: "danger", className: "mds-confirm-sheet-confirm", onPress: i, children: a })
            ] })
          ]
        }
      )
    }
  );
}
const rr = [
  "default",
  "focused",
  "pressed"
];
function Ie({
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
  style: h,
  ref: g,
  ...b
}) {
  const p = rt(), f = p.keyboardHeight > 0 ? {
    bottom: `calc(${p.keyboardHeight}px + env(safe-area-inset-bottom))`
  } : void 0, x = ["mds-action-bar", d ? "mds-action-bar--more" : "", m].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "div",
    {
      ref: g,
      id: c,
      style: { ...f, ...h },
      className: x,
      role: "group",
      "aria-label": t,
      ...b,
      children: [
        r ? /* @__PURE__ */ e(J, { variant: "text", onPress: s, className: "mds-action-bar-secondary", children: r }) : null,
        /* @__PURE__ */ e(
          J,
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
const sr = [
  "default",
  "pressed",
  "focused",
  "disabled",
  "loading",
  "contentMore",
  "scrolledToEnd",
  "keyboardOpen"
];
function dr({
  selected: t = !1,
  onPress: n,
  onLongPress: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const { isPressed: m, pressProps: c } = H({ onPress: n, onLongPress: a }), h = t ? u["sr.askUnread"].text : u["sr.ask"].text, g = ["mds-ask-button", m ? "mds-ask-button--pressed" : "", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: d,
      id: r,
      style: s,
      type: "button",
      className: g,
      "aria-label": h,
      ...l,
      ...c,
      children: [
        /* @__PURE__ */ e(ct, { size: 28 }),
        t ? /* @__PURE__ */ e("span", { className: "mds-ask-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const lr = [
  "default",
  "pressed",
  "focused",
  "unreadDot",
  "longPressRecording"
];
function or({
  value: t = 0,
  label: n,
  onPress: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const { isPressed: m, pressProps: c } = H({ onPress: a }), h = ze(t, _e.unread), g = n ?? (t > 0 ? M("sr.notificationsCount", { counted: h }) : M("sr.notifications")), b = [
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
      className: b,
      "aria-label": g,
      ...l,
      ...c,
      children: [
        /* @__PURE__ */ e(xt, {}),
        t > 0 ? /* @__PURE__ */ e("span", { className: "mds-notifications-dot", "aria-hidden": "true" }) : null
      ]
    }
  );
}
const cr = [
  "default",
  "pressed",
  "focused",
  "unreadDot"
];
function mr({
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
  const { isPressed: c, pressProps: h } = H({ onPress: i }), g = [
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
      className: g,
      ...m,
      ...h,
      children: [
        /* @__PURE__ */ e(C, { size: "sm", variant: "canvas", value: t }),
        /* @__PURE__ */ o("span", { className: "mds-project-switcher-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-project-switcher-name mds-type-body-strong", children: t }),
          n ? /* @__PURE__ */ e("span", { className: "mds-project-switcher-role", children: n }) : null
        ] }),
        a ? null : /* @__PURE__ */ e(Bt, { className: "mds-project-switcher-caret" })
      ]
    }
  );
}
const ur = [
  "default",
  "pressed",
  "focused",
  "withCaret",
  "singleRoleNoCaret"
];
function hr({
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
  const h = [
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
      className: h,
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
const pr = [
  "default",
  "mainScreenSwitcher",
  "subScreenBack",
  "scrolledHairline",
  "notScrolled"
];
function gr({
  label: t,
  selected: n = !1,
  leading: a,
  onPress: i,
  className: r,
  ref: s,
  ...d
}) {
  const { isPressed: l, pressProps: m } = H({ onPress: i }), c = [
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
function br({
  children: t,
  value: n,
  onChange: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = De.toArray(t), c = m.some(
    (g) => g && typeof g == "object" && "props" in g && g.props.selected !== void 0
  ), h = n ?? 0;
  return /* @__PURE__ */ e(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: ["mds-tab-bar", i].filter(Boolean).join(" "),
      role: "tablist",
      ...l,
      children: m.map((g, b) => {
        if (g && typeof g == "object" && "props" in g) {
          const p = g.props, f = c ? p.selected === !0 : b === h;
          return {
            ...g,
            props: { ...p, selected: f, onPress: () => {
              p.onPress?.(), a?.(b);
            } }
          };
        }
        return g;
      })
    }
  );
}
const fr = [
  "default",
  "activeFill",
  "pressed",
  "focused",
  "fiveTabs",
  "twoTabs"
];
function xr({
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
const kr = [
  "default",
  "mainScreen",
  "subScreenBack",
  "collapsedOnScroll",
  "withTrailing"
], Na = {
  draft: M("saveState.draft"),
  sending: M("saveState.sending"),
  saved: M("saveState.saved"),
  failed: M("saveState.failed")
};
function vr({
  saveState: t,
  className: n,
  id: a,
  style: i,
  ref: r,
  ...s
}) {
  const d = Me(t === "sending"), l = [
    "mds-save-state",
    `mds-save-state--${t}`,
    t === "sending" && !d ? "mds-save-state--pending-delay" : "",
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "span",
    {
      ref: r,
      id: a,
      style: i,
      className: l,
      role: t === "failed" ? "alert" : void 0,
      "aria-busy": t === "sending" || void 0,
      ...s,
      children: [
        t === "draft" ? /* @__PURE__ */ e(_t, { size: 14 }) : t === "saved" ? /* @__PURE__ */ e("span", { className: "mds-save-state-icon", children: /* @__PURE__ */ e(Ze, { size: 14 }) }) : t === "failed" ? /* @__PURE__ */ e(pe, { size: 14 }) : null,
        /* @__PURE__ */ e("span", { className: "mds-save-state-text", children: Na[t] }),
        t === "saved" ? /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: M("sr.saveSaved") }) : null,
        t === "failed" ? /* @__PURE__ */ e("span", { className: "mds-visually-hidden", children: M("sr.saveFailed") }) : null
      ]
    }
  );
}
const wr = [
  "draft",
  "sending",
  "saved",
  "failed"
];
function yr({
  label: t,
  trailing: n,
  onDismiss: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = Z(null), c = Z(0), h = Z(0), g = n ? 5e3 : 3e3;
  R(() => (c.current = g, h.current = Date.now(), m.current = window.setTimeout(() => a?.(), g), () => {
    m.current && window.clearTimeout(m.current), m.current = null;
  }), [t, g]);
  const b = () => {
    m.current && (window.clearTimeout(m.current), m.current = null, c.current -= Date.now() - h.current);
  }, p = () => {
    m.current || (h.current = Date.now(), m.current = window.setTimeout(() => a?.(), Math.max(0, c.current)));
  };
  return /* @__PURE__ */ o(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: ["mds-toast", i].filter(Boolean).join(" "),
      role: "status",
      onFocus: b,
      onBlur: p,
      ...l,
      children: [
        /* @__PURE__ */ e("span", { className: "mds-toast-text", children: t }),
        n ? /* @__PURE__ */ e("span", { className: "mds-toast-action", children: n }) : null
      ]
    }
  );
}
const Nr = ["default", "withAction", "focusedPaused"], Aa = {
  offline: Ut,
  locked: Qt,
  info: Kt
};
function Ar({
  tone: t,
  label: n,
  trailing: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = Aa[t];
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
const Sr = ["offline", "locked", "info", "withAction"];
function be({
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
const Br = ["default", "withAction"];
function N({
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
const Hr = ["body", "caption", "hero", "mark"];
function jr({
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
  trailing: h,
  className: g,
  id: b,
  style: p,
  ref: f,
  ...x
}) {
  const { isPressed: k, pressProps: v } = H({ onPress: d, onLongPress: l, disabled: c });
  if (m === "loading")
    return /* @__PURE__ */ o("div", { className: "mds-movement-row mds-movement-row--loading mds-object-row", "aria-busy": "true", id: b, style: p, ref: f, children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(N, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-movement-row-text", children: [
        /* @__PURE__ */ e(N, { variant: "body" }),
        /* @__PURE__ */ e(N, { variant: "caption" })
      ] }),
      /* @__PURE__ */ e("span", { className: "mds-movement-row-end", children: /* @__PURE__ */ e(N, { variant: "caption" }) })
    ] });
  const y = [
    "mds-movement-row",
    "mds-object-row",
    k ? "mds-object-row--pressed" : "",
    c ? "mds-object-row--disabled" : "",
    "mds-movement-row--" + i,
    g
  ].filter(Boolean).join(" "), w = [
    i === "out" ? u["sr.movementRowOut"].text : u["sr.movementRowIn"].text,
    t,
    n,
    a == null ? u["money.ariaMissing"].text : "",
    r ? u["state.draft"].text : s ?? ""
  ].filter(Boolean).join(u["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "button",
    {
      ref: f,
      id: b,
      style: p,
      type: "button",
      className: y,
      disabled: c,
      "aria-label": w,
      "data-ds-check": "movement-row",
      ...v,
      ...x,
      children: [
        /* @__PURE__ */ e(C, { children: i === "in" ? /* @__PURE__ */ e(In, { size: 24 }) : /* @__PURE__ */ e(Fn, { size: 24 }) }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-object-row-title mds-type-body-strong", children: t }),
          n ? /* @__PURE__ */ e("span", { className: "mds-object-row-caption mds-type-caption", children: n }) : null
        ] }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-end", children: [
          /* @__PURE__ */ e("span", { className: "mds-object-row-value mds-type-amount-row", children: /* @__PURE__ */ e(E, { value: a, flow: i }) }),
          /* @__PURE__ */ e("span", { className: "mds-object-row-time mds-type-caption", children: r ? /* @__PURE__ */ e(L, { tone: "waiting", label: u["state.draft"].text }) : h ?? s })
        ] })
      ]
    }
  );
}
const Mr = [
  "in",
  "out",
  "draft",
  "hidden",
  "loading"
];
function Cr({
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
  id: h,
  style: g,
  ref: b,
  ...p
}) {
  const { isPressed: f, pressProps: x } = H({ onPress: s, onLongPress: d, disabled: m });
  if (l === "loading")
    return /* @__PURE__ */ o("div", { className: "mds-transfer-row mds-transfer-row--loading mds-object-row", "aria-busy": "true", id: h, style: g, ref: b, children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(N, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-transfer-row-text", children: [
        /* @__PURE__ */ e(N, { variant: "body" }),
        /* @__PURE__ */ e(N, { variant: "caption" })
      ] }),
      /* @__PURE__ */ e("span", { className: "mds-transfer-row-end", children: /* @__PURE__ */ e(N, { variant: "caption" }) })
    ] });
  const k = [
    "mds-transfer-row",
    "mds-object-row",
    f ? "mds-object-row--pressed" : "",
    m ? "mds-object-row--disabled" : "",
    c
  ].filter(Boolean).join(" "), v = [
    M("sr.transferFrom", { from: t, to: n }),
    a,
    i == null ? u["money.ariaMissing"].text : "",
    r ?? ""
  ].filter(Boolean).join(u["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "button",
    {
      ref: b,
      type: "button",
      id: h,
      style: g,
      className: k,
      disabled: m,
      "aria-label": v,
      "data-ds-check": "transfer-row",
      ...x,
      ...p,
      children: [
        /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(gn, { size: 24 }) }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
          /* @__PURE__ */ e("span", { className: "mds-object-row-title mds-type-body-strong", children: /* @__PURE__ */ o("span", { className: "mds-transfer-row-route", children: [
            t,
            /* @__PURE__ */ e("span", { className: "mds-transfer-row-arrow", "aria-hidden": "true", children: u["transfer.arrow"].text }),
            n
          ] }) }),
          a ? /* @__PURE__ */ e("span", { className: "mds-object-row-caption mds-type-caption", children: a }) : null
        ] }),
        /* @__PURE__ */ o("span", { className: "mds-object-row-end", children: [
          /* @__PURE__ */ e("span", { className: "mds-object-row-value mds-type-amount-row", children: /* @__PURE__ */ e(E, { value: i, flow: "transfer" }) }),
          r ? /* @__PURE__ */ e("span", { className: "mds-object-row-time mds-type-caption", children: r }) : null
        ] })
      ]
    }
  );
}
const Zr = [
  "default",
  "noCaption",
  "hidden",
  "loading"
], Sa = {
  cash: on,
  bank: mn,
  wallet: hn
};
function Pr({
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
  ref: h,
  ...g
}) {
  const { hidden: b } = D(), p = d === "loading", f = Sa[n], { isPressed: x, pressProps: k } = H({ onPress: s, disabled: p }), v = [
    t,
    u["fund.balanceWord"].text,
    r ? u["sr.fundHasDraft"].text : ""
  ].filter(Boolean).join(u["sr.listSeparator"].text), y = [
    "mds-card-shell",
    "mds-fund-card",
    x ? "mds-card-shell--pressed" : "",
    p ? "mds-fund-card--loading" : "",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: h,
      type: "button",
      id: m,
      style: c,
      className: y,
      "aria-label": v,
      disabled: p,
      "data-ds-check": "fund-card",
      ...k,
      ...g,
      children: [
        /* @__PURE__ */ o("span", { className: "mds-fund-card-header", children: [
          /* @__PURE__ */ e(C, { size: "sm", children: /* @__PURE__ */ e(f, { size: 16 }) }),
          /* @__PURE__ */ e("span", { className: "mds-fund-card-name mds-type-body-strong", children: t }),
          r ? /* @__PURE__ */ e("span", { className: "mds-fund-card-dot", "aria-hidden": "true" }) : null
        ] }),
        /* @__PURE__ */ e("span", { className: "mds-fund-card-balance", children: p ? /* @__PURE__ */ o(T, { children: [
          /* @__PURE__ */ e(N, { variant: "hero" }),
          /* @__PURE__ */ e(N, { variant: "caption" })
        ] }) : b ? /* @__PURE__ */ e(E, { value: a, size: "lg" }) : /* @__PURE__ */ o(T, { children: [
          /* @__PURE__ */ e(E, { value: a, size: "lg" }),
          i ? /* @__PURE__ */ e("span", { className: "mds-fund-card-last mds-type-caption", children: i }) : null
        ] }) })
      ]
    }
  );
}
const Tr = [
  "cash",
  "bank",
  "wallet",
  "negative",
  "draft",
  "loading"
];
function ye(t) {
  if (t == null) return null;
  const n = String(t).replace(/[^0-9.]/g, "");
  if (!n || n === ".") return null;
  const a = Number(n);
  return Number.isFinite(a) ? Math.round(a * 1e3) : null;
}
function Ba({
  value: t,
  total: n,
  state: a = "idle",
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const { hidden: m } = D(), c = m && a !== "loading", h = a === "loading", g = ye(t), b = ye(n), p = b !== null && b > 0 && g !== null && g >= 0, f = p ? Math.min(g, b) : 0, x = p ? b : 1, k = Math.round(f / x * 1e3) / 10, v = Math.max(x - f, 0), y = [
    "mds-payment-progress",
    c ? "mds-payment-progress--hidden" : "",
    h ? "mds-payment-progress--loading" : "",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      className: y,
      role: c || h ? void 0 : "progressbar",
      "aria-label": M("sr.debtProgress", {
        paid: V(t, { texts: A }).aria,
        total: V(n, { texts: A }).aria
      }),
      "aria-valuenow": c || h ? void 0 : k,
      "aria-valuemin": c || h ? void 0 : 0,
      "aria-valuemax": c || h ? void 0 : 100,
      "aria-busy": h || void 0,
      ...l,
      children: c ? /* @__PURE__ */ e("span", { className: "mds-payment-progress-hidden mds-type-caption", children: A.hidden }) : /* @__PURE__ */ o(T, { children: [
        /* @__PURE__ */ e("span", { className: "mds-payment-progress-track", children: /* @__PURE__ */ e(
          "span",
          {
            className: "mds-payment-progress-fill",
            style: { "--mds-payment-progress-share": `${k}%` }
          }
        ) }),
        /* @__PURE__ */ o("span", { className: "mds-payment-progress-line", children: [
          M("payment.paid"),
          " ",
          /* @__PURE__ */ e("span", { className: "mds-payment-progress-amount", children: /* @__PURE__ */ e(E, { value: f / 1e3 }) }),
          " · ",
          M("payment.remaining"),
          " ",
          /* @__PURE__ */ e("span", { className: "mds-payment-progress-amount", children: /* @__PURE__ */ e(E, { value: v / 1e3 }) })
        ] })
      ] })
    }
  );
}
const Vr = [
  "partial",
  "zero",
  "complete",
  "hidden"
];
function $r({
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
  state: h = "idle",
  className: g,
  id: b,
  style: p,
  ref: f,
  ...x
}) {
  const { hidden: k } = D(), v = h === "loading", { isPressed: y, pressProps: w } = H({ onPress: c, disabled: v }), S = a === "owed-to-you" ? "forYou" : "againstYou";
  if (v)
    return /* @__PURE__ */ e("div", { className: "mds-debt-card mds-debt-card--loading", "aria-busy": "true", id: b, style: p, ref: f, children: /* @__PURE__ */ o("span", { className: "mds-debt-card-head", children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(N, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-debt-card-id", children: [
        /* @__PURE__ */ e(N, { variant: "body" }),
        /* @__PURE__ */ e(N, { variant: "caption" })
      ] }),
      /* @__PURE__ */ e("span", { className: "mds-debt-card-end", children: /* @__PURE__ */ e(N, { variant: "caption" }) })
    ] }) });
  const $ = [
    t,
    V(n, { debt: S, texts: A }).aria,
    i,
    r !== void 0 && s !== void 0 ? u["sr.debtProgress"].text.replace("{paid}", V(r, { texts: A }).aria).replace("{total}", V(s, { texts: A }).aria) : "",
    d === "overdue" ? u["debt.overdue"].text : "",
    d === "done" ? u["debt.settled"].text : ""
  ].filter(Boolean).join(u["sr.listSeparator"].text), I = [
    "mds-card-shell",
    "mds-debt-card",
    y ? "mds-card-shell--pressed" : "",
    g
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: f,
      type: "button",
      id: b,
      style: p,
      className: I,
      "aria-label": $,
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
            /* @__PURE__ */ e("span", { className: "mds-type-amount-row", children: /* @__PURE__ */ e(E, { value: n, debt: S }) }),
            d === "overdue" ? /* @__PURE__ */ e(L, { tone: "waiting", label: u["debt.overdue"].text }) : null,
            d === "done" ? /* @__PURE__ */ e(L, { tone: "done", label: u["debt.settled"].text }) : null
          ] })
        ] }),
        !k && r !== void 0 && s !== void 0 && d !== "done" ? /* @__PURE__ */ e("span", { className: "mds-debt-card-progress", children: /* @__PURE__ */ e(Ba, { value: r, total: s }) }) : null,
        d !== "done" && m ? /* @__PURE__ */ e("span", { className: "mds-debt-card-action", children: m }) : null
      ]
    }
  );
}
const Ir = [
  "forYou",
  "againstYou",
  "overdue",
  "settled",
  "hidden",
  "loading"
];
function Ne({
  label: t,
  counted: n,
  value: a,
  loading: i
}) {
  return /* @__PURE__ */ o("span", { className: "mds-debt-summary-col", children: [
    /* @__PURE__ */ e("span", { className: "mds-debt-summary-label mds-type-label", children: t }),
    i ? /* @__PURE__ */ e(N, { variant: "hero" }) : /* @__PURE__ */ e(E, { value: a, size: "lg" }),
    i ? /* @__PURE__ */ e(N, { variant: "caption" }) : /* @__PURE__ */ e("span", { className: "mds-debt-summary-count mds-type-caption", children: n })
  ] });
}
function Lr({
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
    u["debt.forYou"].text,
    V(t.value, { texts: A }).aria,
    t.counted
  ].join(" "), h = [
    u["debt.againstYou"].text,
    V(n.value, { texts: A }).aria,
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
      "aria-label": `${c}. ${h}.`,
      "data-ds-check": "debt-summary",
      ...l,
      children: [
        /* @__PURE__ */ e(Ne, { label: u["debt.forYou"].text, counted: t.counted, value: t.value, loading: m }),
        /* @__PURE__ */ e(Ne, { label: u["debt.againstYou"].text, counted: n.counted, value: n.value, loading: m })
      ]
    }
  );
}
const Fr = [
  "columns",
  "zero",
  "wrapped",
  "hidden",
  "loading"
];
function Rr({
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
  className: h,
  id: g,
  style: b,
  ref: p,
  ...f
}) {
  const x = c === "loading", { isPressed: k, pressProps: v } = H({ onPress: m, disabled: x });
  if (x)
    return /* @__PURE__ */ e("div", { className: "mds-order-card mds-order-card--loading", "aria-busy": "true", id: g, style: b, ref: p, children: /* @__PURE__ */ o("span", { className: "mds-order-card-head", children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(N, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-order-card-id", children: [
        /* @__PURE__ */ e(N, { variant: "body" }),
        /* @__PURE__ */ e(N, { variant: "caption" })
      ] }),
      /* @__PURE__ */ e("span", { className: "mds-order-card-head", children: /* @__PURE__ */ e(N, { variant: "caption" }) })
    ] }) });
  const y = [
    t,
    n,
    a != null ? V(a, { texts: A }).aria : "",
    i,
    s ? s.props.label ?? "" : r && u[`badge.${r}`] instanceof Object ? u[`badge.${r}`].text : "",
    d ? u["badge.cancelled"].text : ""
  ].filter(Boolean).join(u["sr.listSeparator"].text), w = [
    "mds-card-shell",
    "mds-order-card",
    k ? "mds-card-shell--pressed" : "",
    d ? "mds-order-card--cancelled" : "",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(
    "button",
    {
      ref: p,
      type: "button",
      id: g,
      style: b,
      className: w,
      "aria-label": y,
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
          a !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-type-amount-row", children: /* @__PURE__ */ e(E, { value: a }) }) : null
        ] }),
        i || r || s ? /* @__PURE__ */ o("span", { className: "mds-order-card-time", children: [
          /* @__PURE__ */ e("span", { className: "mds-order-card-time-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(Pe, { size: 16 }) }),
          /* @__PURE__ */ e("span", { children: i }),
          s ? /* @__PURE__ */ e("span", { className: "mds-order-card-time-badge", children: s }) : r ? /* @__PURE__ */ e("span", { className: "mds-order-card-time-badge", children: /* @__PURE__ */ e(L, { tone: r }) }) : null
        ] }) : null,
        !d && l ? /* @__PURE__ */ e("span", { className: "mds-order-card-action", children: l }) : null
      ]
    }
  );
}
const Er = [
  "moment",
  "duration",
  "cancelled",
  "hidden",
  "loading"
];
function Ha(t) {
  const n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  return n ? { y: +n[1], m: +n[2], d: +n[3] } : null;
}
function ja(t, n, a) {
  const i = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4], r = n < 3 ? t - 1 : t;
  return (r + Math.floor(r / 4) - Math.floor(r / 100) + Math.floor(r / 400) + i[n - 1] + a) % 7;
}
function Dr({
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
  ...h
}) {
  const g = s === "loading";
  return /* @__PURE__ */ e(
    "div",
    {
      ref: c,
      id: l,
      style: m,
      role: "radiogroup",
      className: ["mds-week-strip", d].filter(Boolean).join(" "),
      "data-ds-check": "week-strip",
      ...h,
      children: t.map((b) => {
        const p = Ha(b.date);
        if (!p) return null;
        const f = ja(p.y, p.m, p.d), x = n === b.date, k = a === b.date, v = b.items ?? 0, y = u[`day.${f}`] instanceof Object ? u[`day.${f}`].text : String(f), w = u[`month.${p.m}`] instanceof Object ? u[`month.${p.m}`].text : String(p.m), S = [
          `${y} ${p.d} ${w}`,
          k ? u["sr.weekStripToday"].text : "",
          v > 0 ? u["sr.weekStripItems"].text.replace("{counted}", String(v)) : ""
        ].filter(Boolean).join(u["sr.listSeparator"].text);
        return /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": x,
            "aria-label": S,
            className: [
              "mds-week-strip-day",
              x ? "mds-week-strip-day--selected" : "",
              k ? "mds-week-strip-day--today" : ""
            ].filter(Boolean).join(" "),
            onClick: () => r?.(b.date),
            children: [
              /* @__PURE__ */ e("span", { className: "mds-week-strip-name mds-type-micro", children: y }),
              /* @__PURE__ */ e("span", { className: "mds-week-strip-mark", children: p.d }),
              !g && v > 0 ? /* @__PURE__ */ e("span", { className: "mds-week-strip-dots", "aria-hidden": "true", children: v <= 3 ? Array.from({ length: v }, ($, I) => /* @__PURE__ */ e("span", { className: "mds-week-strip-dot" }, I)) : /* @__PURE__ */ e("span", { className: "mds-week-strip-count mds-type-micro", children: v }) }) : /* @__PURE__ */ e("span", { className: "mds-week-strip-dots", "aria-hidden": "true" })
            ]
          },
          b.date
        );
      })
    }
  );
}
const qr = [
  "plain",
  "todaySelected",
  "dots",
  "loading"
], z = 64;
function Ma(t) {
  return Xe({ h: t, m: 0 });
}
function Or({
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
  const h = r === "loading", g = Array.from({ length: Math.max(0, a - n) }, (x, k) => n + k), b = (x) => (x / 60 - n) * z;
  if (!h && t.length === 0)
    return /* @__PURE__ */ e(be, { label: u["agenda.emptyDay"].text });
  const p = [...t].sort((x, k) => x.hour * 60 + (x.startMinutes ?? 0) - (k.hour * 60 + (k.startMinutes ?? 0))), f = [];
  return p.forEach((x, k) => {
    const v = x.hour * 60 + (x.startMinutes ?? 0), y = x.minutes ? v + x.minutes : v, w = f.find((S) => v < S.end && y > S.start);
    w ? (w.items.push(k), w.end = Math.max(w.end, y)) : f.push({ start: v, end: y, items: [k] });
  }), /* @__PURE__ */ o(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-day-timeline", h ? "mds-day-timeline--loading" : "", s].filter(Boolean).join(" "),
      "data-ds-check": "day-timeline",
      ...c,
      children: [
        /* @__PURE__ */ e("div", { className: "mds-day-timeline-hours", "aria-hidden": "true", children: g.map((x) => /* @__PURE__ */ e("div", { className: "mds-day-timeline-hour", children: Ma(x) }, x)) }),
        /* @__PURE__ */ e(
          "div",
          {
            className: "mds-day-timeline-area",
            role: "list",
            "aria-label": u["sr.timelineItems"].text,
            style: { height: g.length * z },
            children: h ? /* @__PURE__ */ e("span", { className: "mds-day-timeline-block mds-day-timeline-block--neutral", style: { insetBlockStart: z, insetInline: 0, height: z * 1.5 }, children: /* @__PURE__ */ e(N, { variant: "body" }) }) : /* @__PURE__ */ o(T, { children: [
              f.map((x) => {
                const k = 100 / x.items.length;
                return /* @__PURE__ */ e(
                  "div",
                  {
                    className: "mds-day-timeline-lane",
                    style: {
                      insetInlineStart: 0,
                      width: "100%",
                      top: b(x.start),
                      height: Math.max(x.end - x.start, 0) * (z / 60)
                    },
                    children: x.items.map((v, y) => {
                      const w = p[v], S = w.hour * 60 + (w.startMinutes ?? 0), $ = w.minutes ? S + w.minutes : S, I = [
                        w.time,
                        w.label,
                        w.tone && w.tone !== "neutral" ? u[`badge.${w.tone}`]?.text ?? "" : ""
                      ].filter(Boolean).join(u["sr.listSeparator"].text);
                      return w.minutes ? /* @__PURE__ */ o(
                        "button",
                        {
                          type: "button",
                          role: "listitem",
                          "aria-label": I,
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
                            top: b(S) - b(x.start),
                            insetInlineStart: `${y * k}%`,
                            width: `calc(${k}% - ${y === 0 ? 0 : 4}px)`,
                            height: Math.max(($ - S) * (z / 60), 32)
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
                          "aria-label": I,
                          className: "mds-day-timeline-moment",
                          style: {
                            top: b(S) - b(x.start),
                            insetInlineStart: `${y * k}%`,
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
              i !== void 0 && i >= n * 60 && i <= a * 60 ? /* @__PURE__ */ e("div", { className: "mds-day-timeline-now", style: { top: b(i) }, "aria-hidden": "true", children: /* @__PURE__ */ e("span", { className: "mds-day-timeline-now-dot" }) }) : null
            ] })
          }
        )
      ]
    }
  );
}
const Yr = [
  "duration",
  "moment",
  "overlap",
  "nowLine",
  "empty",
  "loading"
];
function _r({
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
    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(N, { variant: "caption" }) }),
    /* @__PURE__ */ o(le, { children: [
      /* @__PURE__ */ e(re, { label: "…", leading: /* @__PURE__ */ e(N, { variant: "mark" }), value: /* @__PURE__ */ e(N, { variant: "caption" }) }),
      /* @__PURE__ */ e(re, { label: "…", leading: /* @__PURE__ */ e(N, { variant: "mark" }), value: /* @__PURE__ */ e(N, { variant: "caption" }) })
    ] })
  ] }, c)) }) : m.length === 0 ? /* @__PURE__ */ e(be, { label: u["agenda.emptyAll"].text }) : /* @__PURE__ */ e(
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
            u["sr.listSeparator"].text,
            c.rows.length
          ] })
        ] }),
        /* @__PURE__ */ e(le, { children: c.rows.map((h) => /* @__PURE__ */ e(
          re,
          {
            label: h.label,
            caption: h.caption,
            value: /* @__PURE__ */ e("bdi", { dir: "ltr", children: h.time }),
            trailing: h.badge ?? (h.tone ? /* @__PURE__ */ e(L, { tone: h.tone }) : void 0),
            onPress: h.onPress
          },
          `${h.label}-${h.time}`
        )) })
      ] }, c.label))
    }
  );
}
const Wr = [
  "multiDay",
  "singleDay",
  "empty",
  "loading"
];
function zr({
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
  const h = r === "loading", g = t.some((b) => b.slots.length > 0);
  return !h && !g ? /* @__PURE__ */ e(be, { label: u["slot.empty"].text }) : /* @__PURE__ */ e(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-slot-picker", s].filter(Boolean).join(" "),
      "data-ds-check": "slot-picker",
      ...c,
      children: t.map((b) => /* @__PURE__ */ o("div", { className: "mds-slot-picker-group", children: [
        /* @__PURE__ */ e("p", { className: "mds-slot-picker-group-label", children: b.label }),
        h ? /* @__PURE__ */ e("div", { className: "mds-slot-picker-grid", "aria-hidden": "true", children: Array.from({ length: 3 }, (p, f) => /* @__PURE__ */ e(N, { variant: "caption" }, f)) }) : /* @__PURE__ */ e("div", { className: "mds-slot-picker-grid", role: "radiogroup", "aria-label": b.label, children: b.slots.map((p) => {
          const f = b.disabled?.includes(p) ?? !1, x = n === p;
          return /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": x,
              "aria-label": f ? `${p} ${u["sr.slotUnavailable"].text}` : p,
              disabled: f,
              className: ["mds-slot-picker-slot", x ? "mds-slot-picker-slot--selected" : ""].filter(Boolean).join(" "),
              onClick: () => i(p),
              children: /* @__PURE__ */ e("bdi", { dir: "ltr", children: p })
            },
            p
          );
        }) })
      ] }, b.label))
    }
  );
}
const Ur = [
  "groups",
  "selected",
  "unavailable",
  "empty",
  "loading"
];
function Ca({
  items: t,
  value: n,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  const l = Math.max(0, Math.min(n, t.length - 1)), m = t[l]?.label ?? "", c = [
    u["sr.statusTrackStages"].text,
    u["sr.statusTrackStep"].text.replace("{n}", String(l + 1)).replace("{m}", String(t.length)),
    m
  ].join(u["sr.listSeparator"].text);
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
      children: /* @__PURE__ */ e("div", { className: "mds-status-track-row", "aria-hidden": "true", children: t.map((h, g) => {
        const b = g === l ? "current" : g < l ? "done" : "", p = g === l && h.tone === "problem";
        return /* @__PURE__ */ o(
          "div",
          {
            className: [
              "mds-status-track-step",
              b ? `mds-status-track-step--${b}` : "",
              p ? "mds-status-track-step--problem" : ""
            ].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ e("span", { className: "mds-status-track-dot-row", children: /* @__PURE__ */ e("span", { className: "mds-status-track-dot" }) }),
              /* @__PURE__ */ e("span", { className: "mds-status-track-label mds-type-micro", children: h.label })
            ]
          },
          `${h.label}-${g}`
        );
      }) })
    }
  );
}
const Gr = ["early", "mid", "last", "problem"];
function Qr({
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
  id: h,
  style: g,
  ref: b,
  ...p
}) {
  const f = m === "loading", { isPressed: x, pressProps: k } = H({ onPress: l, disabled: f });
  if (f)
    return /* @__PURE__ */ e("div", { className: "mds-card-shell mds-delivery-request-card mds-delivery-request-card--loading", "aria-busy": "true", id: h, style: g, ref: b, children: /* @__PURE__ */ o("span", { className: "mds-delivery-request-card-head", children: [
      /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(N, { variant: "mark" }) }),
      /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
        /* @__PURE__ */ e(N, { variant: "body" }),
        /* @__PURE__ */ e(N, { variant: "caption" })
      ] })
    ] }) });
  const v = [
    `${u["delivery.to"].text} ${t}`,
    n,
    a,
    r ? r.props.label ?? "" : "",
    !r && i && i !== "neutral" ? u[`badge.${i}`]?.text ?? "" : ""
  ].filter(Boolean).join(u["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "button",
    {
      ref: b,
      type: "button",
      id: h,
      style: g,
      className: [
        "mds-card-shell",
        "mds-delivery-request-card",
        x ? "mds-card-shell--pressed" : "",
        c
      ].filter(Boolean).join(" "),
      "aria-label": v,
      "data-ds-check": "delivery-request-card",
      ...k,
      ...p,
      children: [
        /* @__PURE__ */ o("span", { className: "mds-delivery-request-card-head", children: [
          s ? /* @__PURE__ */ e(C, { value: s }) : /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e("span", { className: "mds-delivery-request-card-nav", "aria-hidden": "true", children: /* @__PURE__ */ e(gt, { size: 24 }) }) }),
          /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
            /* @__PURE__ */ e("span", { className: "mds-type-body-strong", children: `${u["delivery.to"].text} ${t}` }),
            n ? /* @__PURE__ */ e("span", { className: "mds-type-caption", children: n }) : null
          ] }),
          r || (i ? /* @__PURE__ */ e(L, { tone: i }) : null)
        ] }),
        a ? /* @__PURE__ */ o("span", { className: "mds-delivery-request-card-time", children: [
          /* @__PURE__ */ e("span", { className: "mds-delivery-request-card-time-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(Pe, { size: 16 }) }),
          /* @__PURE__ */ e("span", { children: a })
        ] }) : null,
        d ? /* @__PURE__ */ e("span", { className: "mds-delivery-request-card-action", children: d }) : null
      ]
    }
  );
}
const Xr = [
  "needsDecision",
  "assigned",
  "plain",
  "loading"
];
function Kr({
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
  style: h,
  ref: g,
  ...b
}) {
  const p = l === "rejected", f = l === "accepting", x = l === "loading", k = [
    u["quote.offerFrom"].text.replace("{label}", t),
    u["quote.approved"].text,
    V(a, { texts: A }).aria,
    u["quote.resultSentence"].text,
    p ? u["quote.rejected"].text : ""
  ].filter(Boolean).join(u["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "div",
    {
      ref: g,
      id: c,
      style: h,
      role: "group",
      "aria-label": k,
      className: [
        "mds-card-shell",
        "mds-quote-card",
        p ? "mds-quote-card--rejected" : "",
        x ? "mds-quote-card--loading" : "",
        m
      ].filter(Boolean).join(" "),
      "data-ds-check": "quote-card",
      ...b,
      children: [
        /* @__PURE__ */ o("span", { className: "mds-quote-card-head", children: [
          /* @__PURE__ */ e(C, { tone: "done", value: t }),
          /* @__PURE__ */ o("span", { className: "mds-object-row-text", children: [
            /* @__PURE__ */ e("span", { className: "mds-quote-card-title mds-type-body-strong", children: t }),
            n ? /* @__PURE__ */ e("span", { className: "mds-quote-card-caption mds-type-caption", children: n }) : null,
            p ? /* @__PURE__ */ e(L, { tone: "neutral", label: u["quote.rejected"].text }) : null
          ] })
        ] }),
        /* @__PURE__ */ o("span", { className: "mds-quote-card-price", children: [
          /* @__PURE__ */ e(E, { value: a, size: "lg" }),
          /* @__PURE__ */ e("span", { className: "mds-quote-card-result mds-type-caption", children: r ?? u["quote.resultSentence"].text })
        ] }),
        i && !p ? /* @__PURE__ */ o("span", { className: "mds-quote-card-actions", children: [
          /* @__PURE__ */ e("span", { "aria-hidden": f || void 0, className: f ? "mds-quote-card--await" : "", children: s }),
          d
        ] }) : null
      ]
    }
  );
}
const Jr = ["inList", "inSheet", "accepting", "rejected"];
function Za({ className: t, ...n }) {
  return /* @__PURE__ */ e(
    Ca,
    {
      className: ["mds-job-track", t].filter(Boolean).join(" "),
      "data-ds-check": "job-track",
      ...n
    }
  );
}
const es = ["running", "problem"];
function ts({
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
  style: h,
  ref: g,
  ...b
}) {
  const p = l === "loading", f = t ?? u["issue.title"].text, x = [
    f,
    ...n.map((k) => `${k.key}: ${k.value}`),
    a === "driver" ? u["issue.awaitingOwner"].text : ""
  ].join(u["sr.listSeparator"].text + " ");
  return /* @__PURE__ */ e(
    le,
    {
      ref: g,
      id: c,
      style: h,
      role: "group",
      "aria-label": x,
      className: ["mds-issue-proposal-card", p ? "mds-issue-proposal-card--loading" : "", m].filter(Boolean).join(" "),
      "data-ds-check": "issue-proposal-card",
      ...b,
      children: p ? /* @__PURE__ */ o(T, { children: [
        /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(N, { variant: "body" }) }),
        /* @__PURE__ */ o(oe, { children: [
          /* @__PURE__ */ e(N, { variant: "body" }),
          /* @__PURE__ */ e(N, { variant: "caption" })
        ] })
      ] }) : /* @__PURE__ */ o(T, { children: [
        /* @__PURE__ */ o("span", { className: "mds-issue-proposal-card-header", children: [
          /* @__PURE__ */ e("span", { className: "mds-issue-proposal-card-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(kn, { size: 20 }) }),
          /* @__PURE__ */ e("span", { children: f })
        ] }),
        /* @__PURE__ */ e(oe, { children: /* @__PURE__ */ e("dl", { className: "mds-issue-proposal-card-list", children: n.map((k) => /* @__PURE__ */ o("div", { className: "mds-issue-proposal-card-row", children: [
          /* @__PURE__ */ e("dt", { className: "mds-type-caption", children: k.key }),
          /* @__PURE__ */ e("dd", { className: "mds-type-body", children: k.value })
        ] }, k.key)) }) }),
        a === "owner" ? d !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-issue-proposal-card-decided mds-type-label-strong", children: d }) : /* @__PURE__ */ o(T, { children: [
          /* @__PURE__ */ o("span", { className: "mds-issue-proposal-card-actions", children: [
            i,
            r
          ] }),
          s ? /* @__PURE__ */ e("span", { className: "mds-issue-proposal-card-result mds-type-caption", children: s }) : null
        ] }) : /* @__PURE__ */ e(L, { tone: "waiting", label: u["issue.awaitingOwner"].text })
      ] })
    }
  );
}
const ns = ["owner", "driver", "decided", "loading"];
function Pa(t) {
  return `+962${t.replace(/[^\d]/g, "").replace(/^0/, "")}`;
}
function Ta({
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
  const h = Pa(t);
  return r ? /* @__PURE__ */ o(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      className: ["mds-contact-bar", "mds-contact-bar--locked", s].filter(Boolean).join(" "),
      "data-ds-check": "contact-bar",
      "aria-label": u["contact.marketNote"].text,
      ...c,
      children: [
        /* @__PURE__ */ o("div", { className: "mds-contact-bar-row", children: [
          /* @__PURE__ */ e("span", { className: "mds-contact-bar-locked", "aria-hidden": "true", children: "•••••" }),
          /* @__PURE__ */ e("span", { className: "mds-contact-bar-locked", "aria-hidden": "true", children: "•••••" })
        ] }),
        i ? /* @__PURE__ */ e("span", { className: "mds-contact-bar-note mds-type-caption", children: u["contact.marketNote"].text }) : null
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
              href: `tel:${h}`,
              "aria-label": u["sr.contactCall"].text.replace("{name}", n),
              children: [
                /* @__PURE__ */ e("span", { className: "mds-contact-bar-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(En, { size: 20 }) }),
                u["contact.call"].text
              ]
            }
          ),
          /* @__PURE__ */ o(
            "a",
            {
              className: "mds-button mds-button--secondary mds-button--sm mds-contact-bar-link",
              href: `https://wa.me/${h.replace("+", "")}`,
              target: "_blank",
              rel: "noreferrer",
              "aria-label": u["sr.contactWhatsapp"].text.replace("{name}", n),
              children: [
                /* @__PURE__ */ e("span", { className: "mds-contact-bar-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(qn, { size: 20 }) }),
                u["contact.whatsapp"].text
              ]
            }
          )
        ] }),
        i ? /* @__PURE__ */ e("span", { className: "mds-contact-bar-note mds-type-caption", children: u["contact.marketNote"].text }) : null
      ]
    }
  );
}
const as = ["plain", "market", "driver", "locked"];
function is({
  mode: t,
  value: n,
  onChange: a,
  error: i,
  readOnly: r = !1,
  density: s = "regular",
  action: d,
  state: l = "idle",
  className: m,
  id: c,
  style: h,
  ref: g,
  ...b
}) {
  const p = l === "loading", f = !!n, x = [
    u["evidence.title"].text,
    t === "photo" ? f ? u["evidence.photoTaken"].text : u["evidence.photoMissing"].text : "",
    t === "code" ? n ? u["evidence.entered"].text : u["evidence.codeLabel"].text : "",
    t === "owner" ? u["evidence.ownerSentence"].text : ""
  ].filter(Boolean).join(u["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "div",
    {
      ref: g,
      id: c,
      style: h,
      role: "group",
      "aria-label": x,
      className: [
        "mds-evidence-slot",
        s === "large" ? "mds-evidence-slot--large" : "",
        p ? "mds-evidence-slot--loading" : "",
        m
      ].filter(Boolean).join(" "),
      "data-ds-check": "evidence-slot",
      ...b,
      children: [
        /* @__PURE__ */ e("span", { className: "mds-evidence-slot-title", children: u["evidence.title"].text }),
        p ? /* @__PURE__ */ e("span", { className: "mds-evidence-slot-tile", "aria-hidden": "true", children: /* @__PURE__ */ e(N, { variant: "body" }) }) : t === "photo" ? f ? /* @__PURE__ */ o("span", { className: "mds-evidence-slot-tile", style: { cursor: "default" }, children: [
          /* @__PURE__ */ e("img", { className: "mds-evidence-slot-photo", src: n, alt: u["evidence.photoTaken"].text }),
          r ? null : /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "mds-evidence-slot-redo",
              "aria-label": u["evidence.retake"].text,
              onClick: () => a?.(""),
              children: /* @__PURE__ */ e(en, { size: 20 })
            }
          )
        ] }) : r ? /* @__PURE__ */ e("span", { className: "mds-evidence-slot-tile", style: { cursor: "default" }, children: /* @__PURE__ */ e("span", { className: "mds-evidence-slot-done mds-type-label-strong", children: u["evidence.photoMissing"].text }) }) : /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            className: "mds-evidence-slot-tile",
            "aria-label": u["evidence.takePhoto"].text,
            onClick: () => a?.("pending"),
            children: [
              /* @__PURE__ */ e("span", { "aria-hidden": "true", children: /* @__PURE__ */ e(Zn, { size: 24 }) }),
              /* @__PURE__ */ e("span", { children: u["evidence.takePhoto"].text })
            ]
          }
        ) : t === "code" ? r ? /* @__PURE__ */ e("span", { className: "mds-evidence-slot-done mds-type-label-strong", children: n ? u["evidence.entered"].text : "—" }) : /* @__PURE__ */ e(
          de,
          {
            label: u["evidence.codeLabel"].text,
            value: n ?? "",
            inputMode: "numeric",
            state: i ? "error" : "idle",
            caption: i,
            onChange: (k) => a?.(k)
          }
        ) : /* @__PURE__ */ o(T, { children: [
          /* @__PURE__ */ e("span", { className: "mds-evidence-slot-owner mds-type-body", children: u["evidence.ownerSentence"].text }),
          !r && d ? /* @__PURE__ */ e("span", { className: "mds-evidence-slot-action", children: d }) : null
        ] })
      ]
    }
  );
}
const rs = [
  "photoEmpty",
  "photoTaken",
  "code",
  "codeError",
  "owner",
  "readOnly",
  "loading"
];
function Ae({
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
        /* @__PURE__ */ e("span", { className: "mds-location-slot-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(Yn, { size: 20 }) }),
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
            "aria-label": u["sr.openMaps"].text,
            children: [
              u["location.openMaps"].text,
              /* @__PURE__ */ e("span", { "aria-hidden": "true", children: /* @__PURE__ */ e(Ce, { size: 16 }) })
            ]
          }
        ) : null
      ]
    }
  );
}
const ss = ["origin", "destination", "empty"];
function ds({
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
  quote: h,
  proposal: g,
  state: b = "idle",
  className: p,
  id: f,
  style: x,
  ref: k,
  ...v
}) {
  return b === "loading" ? /* @__PURE__ */ o("div", { className: "mds-driver-job mds-driver-job--loading", "aria-busy": "true", id: f, style: x, ref: k, ...v, children: [
    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(N, { variant: "body" }) }),
    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(N, { variant: "caption" }) }),
    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e(N, { variant: "body" }) })
  ] }) : /* @__PURE__ */ o(
    "div",
    {
      ref: k,
      id: f,
      style: x,
      className: ["mds-driver-job", p].filter(Boolean).join(" "),
      "data-ds-check": "driver-job-card",
      ...v,
      children: [
        /* @__PURE__ */ e("h3", { className: "mds-driver-job-title", children: `${u["delivery.to"].text} ${t}` }),
        /* @__PURE__ */ e(Ae, { label: u["delivery.fromWord"].text, value: n }),
        /* @__PURE__ */ e(Ae, { label: u["delivery.to"].text, value: a }),
        /* @__PURE__ */ e(Ta, { value: r, label: i, density: "large" }),
        /* @__PURE__ */ e(Za, { items: s, value: d }),
        l === "awaiting-owner" && g ? /* @__PURE__ */ e("div", { className: "mds-driver-job-action", children: g }) : /* @__PURE__ */ o("div", { className: "mds-driver-job-action", children: [
          l === "quoting" ? h : null,
          l === "active" && m ? m : null,
          c
        ] })
      ]
    }
  );
}
const ls = [
  "quoting",
  "active",
  "blocked",
  "awaitingOwner",
  "loading"
], Va = {
  waiting: "driver.pending",
  approved: "driver.approved",
  rejected: "driver.rejected"
}, $a = {
  waiting: "waiting",
  approved: "done",
  rejected: "problem"
};
function os({
  tone: t,
  caption: n,
  children: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = u[Va[t]], c = a ?? (t === "waiting" ? u["driver.pendingSentence"].text : null);
  return /* @__PURE__ */ o(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      role: "group",
      "aria-label": [m.text, c ?? "", t === "rejected" ? n ?? "" : ""].filter(Boolean).join(u["sr.listSeparator"].text),
      className: ["mds-driver-approval", i].filter(Boolean).join(" "),
      "data-ds-check": "driver-approval-status",
      ...l,
      children: [
        /* @__PURE__ */ e(L, { tone: $a[t], label: m.text }),
        c ? /* @__PURE__ */ e("p", { className: "mds-driver-approval-sentence mds-type-body", children: c }) : null,
        t === "rejected" ? /* @__PURE__ */ e(oe, { children: /* @__PURE__ */ e("span", { className: "mds-type-body", children: n }) }) : null
      ]
    }
  );
}
const cs = ["waiting", "approved", "rejected"];
function ms({
  label: t,
  value: n,
  caption: a,
  tone: i = "flat",
  supplier: r,
  image: s,
  unavailable: d = !1,
  locked: l = !1,
  onPress: m,
  state: c = "idle",
  className: h,
  id: g,
  style: b,
  ref: p,
  ...f
}) {
  const x = c === "loading", { isPressed: k, pressProps: v } = H({ onPress: m, disabled: x });
  if (x)
    return /* @__PURE__ */ o("div", { className: "mds-listing-card mds-listing-card--loading", "aria-busy": "true", id: g, style: b, children: [
      /* @__PURE__ */ e("span", { className: "mds-listing-card-figure", children: /* @__PURE__ */ e(N, { variant: "body" }) }),
      /* @__PURE__ */ o("span", { className: "mds-listing-card-body", children: [
        /* @__PURE__ */ e(N, { variant: "body" }),
        /* @__PURE__ */ e(N, { variant: "caption" })
      ] })
    ] });
  const y = [
    t,
    d ? u["listing.unavailable"].text : l ? "" : n !== void 0 ? V(n, { texts: A }).aria : "",
    d || l || n !== void 0 ? `${a ?? ""}` : "",
    r ?? ""
  ].filter(Boolean).join(u["sr.listSeparator"].text);
  return /* @__PURE__ */ o(
    "button",
    {
      ref: p,
      type: "button",
      id: g,
      style: b,
      className: [
        "mds-listing-card",
        k ? "mds-listing-card--pressed" : "",
        h
      ].filter(Boolean).join(" "),
      "aria-label": y,
      "data-ds-check": "listing-card",
      ...v,
      ...f,
      children: [
        /* @__PURE__ */ e("span", { className: "mds-listing-card-figure", children: s ? /* @__PURE__ */ e(
          "img",
          {
            className: [
              "mds-listing-card-photo",
              /* small-image heuristic is the app's */
              ""
            ].filter(Boolean).join(" "),
            src: s,
            alt: "",
            "aria-hidden": "true",
            loading: "lazy"
          }
        ) : /* @__PURE__ */ e(C, { value: r }) }),
        /* @__PURE__ */ o("span", { className: "mds-listing-card-body", children: [
          /* @__PURE__ */ e("span", { className: "mds-listing-card-title", children: t }),
          d ? /* @__PURE__ */ e(L, { tone: "neutral", label: u["listing.unavailable"].text }) : l ? (
            /* ق3: the visitor sees NO number — the locked block carries no
               digits; its aria says the price is hidden. */
            /* @__PURE__ */ e("span", { className: "mds-listing-card-unit", "aria-hidden": "true", children: "••••" })
          ) : n !== void 0 ? /* @__PURE__ */ o("span", { className: "mds-listing-card-price", children: [
            i === "tiers" ? /* @__PURE__ */ e("span", { className: "mds-listing-card-unit", children: u["listing.from"].text }) : null,
            /* @__PURE__ */ e("span", { className: "mds-number-lg", children: V(n, { texts: A }).display }),
            a ? /* @__PURE__ */ e("span", { className: "mds-listing-card-unit", children: u["listing.perUnit"].text.replace("{unit}", a) }) : null
          ] }) : null,
          r ? /* @__PURE__ */ o("span", { className: "mds-listing-card-supplier", children: [
            /* @__PURE__ */ e(C, { value: r, size: "sm" }),
            /* @__PURE__ */ e("span", { className: "mds-listing-card-supplier-name mds-type-caption", children: r })
          ] }) : null
        ] })
      ]
    }
  );
}
const us = [
  "photo",
  "smallPhoto",
  "noPhoto",
  "tiers",
  "unavailable",
  "locked",
  "loading"
];
function hs({
  items: t,
  value: n,
  onChange: a,
  className: i,
  id: r,
  style: s,
  ref: d,
  ...l
}) {
  const m = Z(null), c = Math.max(0, Math.min(n ?? 0, t.length - 1)), h = t.length <= 1;
  R(() => {
    const p = m.current;
    if (!p) return;
    const f = p.children[c];
    f && typeof p.scrollTo == "function" && p.scrollTo({ left: f.offsetLeft, behavior: "smooth" });
  }, [c]);
  const g = () => {
    const p = m.current;
    if (!p || !a) return;
    const f = Math.round(p.scrollLeft / Math.max(p.clientWidth, 1));
    f !== c && f >= 0 && f < t.length && a(f);
  }, b = (p) => {
    const f = c + p;
    f >= 0 && f < t.length && a?.(f);
  };
  return /* @__PURE__ */ o(
    "div",
    {
      ref: d,
      id: r,
      style: s,
      role: "region",
      "aria-roledescription": u["sr.galleryRegion"].text,
      className: ["mds-gallery", h ? "mds-gallery--single" : "", i].filter(Boolean).join(" "),
      "data-ds-check": "gallery",
      ...l,
      children: [
        /* @__PURE__ */ e("div", { className: "mds-gallery-strip", ref: m, onScroll: h ? void 0 : g, children: t.map((p, f) => /* @__PURE__ */ e(
          "div",
          {
            className: "mds-gallery-item",
            role: "img",
            "aria-label": u["gallery.imageOf"].text.replace("{current}", String(f + 1)).replace("{total}", String(t.length)) + (p.alt ? `${u["sr.listSeparator"].text}${p.alt}` : ""),
            children: /* @__PURE__ */ e("img", { className: "mds-gallery-photo", src: p.src, alt: "", "aria-hidden": "true", loading: "lazy" })
          },
          `${p.src}-${f}`
        )) }),
        h ? null : /* @__PURE__ */ o(T, { children: [
          /* @__PURE__ */ e("div", { className: "mds-gallery-dots", "aria-hidden": "true", children: t.map((p, f) => /* @__PURE__ */ e(
            "span",
            {
              className: ["mds-gallery-dot", f === c ? "mds-gallery-dot--active" : ""].filter(Boolean).join(" ")
            },
            `${p.src}-dot-${f}`
          )) }),
          /* @__PURE__ */ e("button", { type: "button", className: "mds-gallery-nav", onClick: () => b(-1), children: u["gallery.prev"].text }),
          /* @__PURE__ */ e("button", { type: "button", className: "mds-gallery-nav", onClick: () => b(1), children: u["gallery.next"].text })
        ] })
      ]
    }
  );
}
const ps = ["four", "two", "single", "loading"];
function gs({
  items: t,
  locked: n = !1,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  return n ? /* @__PURE__ */ o(
    "div",
    {
      ref: s,
      id: i,
      style: r,
      "aria-label": u["tier.tableName"].text,
      className: ["mds-price-tier-table-locked", a].filter(Boolean).join(" "),
      "data-ds-check": "price-tier-table",
      ...d,
      children: [
        /* @__PURE__ */ e("span", { className: "mds-price-tier-table-locked-row", "aria-hidden": "true" }),
        /* @__PURE__ */ e("span", { className: "mds-price-tier-table-locked-row", "aria-hidden": "true" }),
        /* @__PURE__ */ e("span", { className: "mds-price-tier-table-locked-row", "aria-hidden": "true" })
      ]
    }
  ) : /* @__PURE__ */ o(
    "table",
    {
      ref: s,
      id: i,
      style: r,
      className: ["mds-price-tier-table", a].filter(Boolean).join(" "),
      "data-ds-check": "price-tier-table",
      ...d,
      children: [
        /* @__PURE__ */ e("caption", { children: u["tier.tableName"].text }),
        /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ o("tr", { children: [
          /* @__PURE__ */ e("th", { scope: "col", children: u["tier.from"].text }),
          /* @__PURE__ */ e("th", { scope: "col", children: u["tier.to"].text }),
          /* @__PURE__ */ e("th", { scope: "col", children: u["tier.pricePerUnit"].text })
        ] }) }),
        /* @__PURE__ */ e("tbody", { children: t.map((l, m) => {
          const c = m === t.length - 1;
          return /* @__PURE__ */ o("tr", { children: [
            /* @__PURE__ */ e("td", { children: l.from }),
            /* @__PURE__ */ e("td", { children: c || l.to === void 0 ? u["tier.andAbove"].text : l.to }),
            /* @__PURE__ */ e("td", { children: V(l.price, { texts: A }).display })
          ] }, `${l.from}-${m}`);
        }) })
      ]
    }
  );
}
const bs = ["plain", "locked"];
function Se(t) {
  return t === 1 ? u["supplier.oneOffer"].text : t === 2 ? u["supplier.twoOffers"].text : t >= 3 && t <= 10 ? u["supplier.offers"].text.replace("{n}", String(t)) : u["supplier.offersMany"].text.replace("{n}", String(t));
}
function fs({
  label: t,
  caption: n,
  items: a,
  approved: i = !1,
  state: r = "idle",
  className: s,
  id: d,
  style: l,
  ref: m,
  ...c
}) {
  const h = r === "loading", g = [
    t,
    i ? u["quote.approved"].text : "",
    n ?? "",
    a !== void 0 ? Se(a) : ""
  ].filter(Boolean).join(u["sr.listSeparator"].text);
  return /* @__PURE__ */ e(
    "div",
    {
      ref: m,
      id: d,
      style: l,
      "aria-label": g,
      className: ["mds-supplier-header", h ? "mds-supplier-header--loading" : "", s].filter(Boolean).join(" "),
      "data-ds-check": "supplier-header",
      ...c,
      children: h ? /* @__PURE__ */ o(T, { children: [
        /* @__PURE__ */ e(C, { children: /* @__PURE__ */ e(N, { variant: "mark" }) }),
        /* @__PURE__ */ o("span", { className: "mds-supplier-header-id", children: [
          /* @__PURE__ */ e(N, { variant: "body" }),
          /* @__PURE__ */ e(N, { variant: "caption" })
        ] })
      ] }) : /* @__PURE__ */ o(T, { children: [
        /* @__PURE__ */ e(C, { value: t, size: "lg", tone: i ? "done" : void 0 }),
        /* @__PURE__ */ o("span", { className: "mds-supplier-header-id", children: [
          /* @__PURE__ */ e("h1", { className: "mds-supplier-header-name", children: t }),
          n || a !== void 0 ? /* @__PURE__ */ e("span", { className: "mds-supplier-header-caption mds-type-caption", children: [n, a !== void 0 ? Se(a) : ""].filter(Boolean).join(` ${u["sr.listSeparator"].text} `) }) : null
        ] })
      ] })
    }
  );
}
const xs = ["plain", "approved", "loading"];
function ks({
  items: t,
  value: n,
  caption: a,
  onDismiss: i,
  onChange: r,
  save: s,
  className: d,
  id: l,
  style: m,
  ref: c,
  ...h
}) {
  const [g, b] = j(n ?? -1), [p, f] = j(a ?? ""), [x, k] = j(!1), v = () => {
    if (g < 0) {
      k(!0);
      return;
    }
    r?.(g, p);
  };
  return /* @__PURE__ */ e(
    ge,
    {
      label: u["report.title"].text,
      onDismiss: i,
      className: d,
      id: l,
      style: m,
      ref: c,
      "data-ds-check": "report-sheet",
      ...h,
      children: /* @__PURE__ */ o("div", { className: "mds-report-sheet-body", children: [
        /* @__PURE__ */ e(
          "div",
          {
            className: "mds-report-sheet-reasons",
            role: "radiogroup",
            "aria-label": u["report.title"].text,
            children: t.map((y, w) => /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                role: "radio",
                "aria-checked": g === w,
                className: "mds-report-sheet-reason",
                onClick: () => {
                  b(w), k(!1);
                },
                children: [
                  /* @__PURE__ */ e("span", { className: "mds-report-sheet-reason-label mds-type-body", children: y }),
                  g === w ? /* @__PURE__ */ e("span", { className: "mds-report-sheet-reason-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(te, { size: 20 }) }) : null
                ]
              },
              y
            ))
          }
        ),
        x ? /* @__PURE__ */ e("span", { className: "mds-report-sheet-error mds-type-caption", role: "alert", children: u["report.chooseReason"].text }) : null,
        /* @__PURE__ */ e(
          Te,
          {
            label: u["report.details"].text,
            caption: u["report.detailsOptional"].text,
            value: p,
            onChange: f
          }
        ),
        s,
        /* @__PURE__ */ e(
          Ie,
          {
            label: u["report.send"].text,
            onPress: v
          }
        )
      ] })
    }
  );
}
const vs = ["idle", "chosen", "error"];
function ws({
  editing: t = !1,
  draft: n,
  onDismiss: a,
  onChange: i,
  photos: r,
  tiers: s,
  save: d,
  className: l,
  id: m,
  style: c,
  ref: h,
  ...g
}) {
  const [b, p] = j(n?.label ?? ""), [f, x] = j(n?.unit ?? ""), [k, v] = j(String(n?.price ?? "")), [y, w] = j(n?.mode ?? "single"), [S, $] = j(n?.available ?? !0), [I, X] = j(n?.caption ?? ""), [Y, W] = j({}), ne = Z(null), K = () => {
    const q = {};
    if (b.trim() || (q.name = u["editor.nameRequired"].text), f.trim() || (q.unit = u["editor.unitRequired"].text), y === "single" && !k.trim() && (q.price = u["editor.priceRequired"].text), W(q), Object.keys(q).length > 0) {
      ne.current?.focus();
      return;
    }
    i?.({
      label: b.trim(),
      unit: f.trim(),
      mode: y,
      price: y === "single" ? Number(k) : void 0,
      items: n?.items,
      available: S,
      caption: I
    });
  };
  return /* @__PURE__ */ e(
    ge,
    {
      label: t ? u["editor.editTitle"].text : u["editor.newTitle"].text,
      onDismiss: a,
      className: l,
      id: m,
      style: c,
      ref: h,
      "data-ds-check": "listing-editor",
      ...g,
      children: /* @__PURE__ */ o("div", { className: "mds-listing-editor-body", children: [
        r,
        /* @__PURE__ */ e(
          de,
          {
            label: u["editor.listingName"].text,
            value: b,
            state: Y.name ? "error" : "idle",
            caption: Y.name,
            onChange: p
          }
        ),
        /* @__PURE__ */ e(
          de,
          {
            label: u["editor.unit"].text,
            value: f,
            placeholder: u["editor.unitHint"].text,
            state: Y.unit ? "error" : "idle",
            caption: Y.unit,
            onChange: x
          }
        ),
        /* @__PURE__ */ e(
          ha,
          {
            label: u["editor.priceMode"].text,
            leading: [
              { value: "single", label: u["editor.singlePrice"].text },
              { value: "tiers", label: u["editor.tiers"].text }
            ],
            value: y,
            onChange: (q) => w(q)
          }
        ),
        y === "single" ? /* @__PURE__ */ e(
          da,
          {
            label: u["editor.pricePerUnit"].text,
            value: k,
            state: Y.price ? "error" : "idle",
            caption: Y.price,
            onChange: v
          }
        ) : s,
        /* @__PURE__ */ e(na, { label: u["editor.available"].text, selected: S, onChange: $ }),
        /* @__PURE__ */ e(
          Te,
          {
            label: u["editor.description"].text,
            caption: u["report.detailsOptional"].text,
            value: I,
            onChange: X
          }
        ),
        d,
        /* @__PURE__ */ e(
          Ie,
          {
            label: t ? u["editor.sendEdit"].text : u["editor.sendReview"].text,
            onPress: K
          }
        )
      ] })
    }
  );
}
const ys = ["new", "editing", "tiers", "errors"], Ia = {
  waiting: "listing.reviewPending",
  done: "listing.approved",
  rejected: "listing.rejected"
}, La = {
  waiting: "waiting",
  done: "done",
  rejected: "problem"
};
function Ns({
  tone: t,
  caption: n,
  className: a,
  id: i,
  style: r,
  ref: s,
  ...d
}) {
  if (t === "rejected" && !n && process.env.NODE_ENV !== "production")
    throw new Error("ListingStatusBadge: rejected requires its reason caption (ق1)");
  const l = u[Ia[t]].text;
  return /* @__PURE__ */ o(
    "div",
    {
      ref: s,
      id: i,
      style: r,
      role: "status",
      "aria-label": [l, t === "rejected" ? n ?? "" : ""].filter(Boolean).join(u["sr.listSeparator"].text),
      className: ["mds-listing-status", a].filter(Boolean).join(" "),
      "data-ds-check": "listing-status-badge",
      ...d,
      children: [
        /* @__PURE__ */ e(L, { tone: La[t], label: l }),
        t === "rejected" && n ? /* @__PURE__ */ e("span", { className: "mds-listing-status-reason mds-type-caption", children: n }) : null
      ]
    }
  );
}
const As = ["waiting", "done", "rejected"];
export {
  Ie as ActionBar,
  sr as ActionBarStates,
  _r as AgendaList,
  Wr as AgendaListStates,
  da as AmountField,
  Vi as AmountFieldStates,
  Ea as AmountVisibilityProvider,
  ta as AmountVisibilityToggle,
  Si as AmountVisibilityToggleStates,
  yt as AmountsHiddenIcon,
  vt as AmountsShownIcon,
  ni as AppointmentIcon,
  dr as AskButton,
  lr as AskButtonStates,
  ct as AskSymbolIcon,
  Ga as BackIcon,
  si as BackspaceIcon,
  J as Button,
  Li as ButtonStates,
  oi as CalendarIcon,
  Zn as CameraIcon,
  gi as ChartIcon,
  Bi as Checkbox,
  Hi as CheckboxStates,
  Tt as ClearIcon,
  Pe as ClockIcon,
  jt as CloseIcon,
  ir as ConfirmSheet,
  rr as ConfirmSheetStates,
  Ta as ContactBar,
  as as ContactBarStates,
  hr as ContextBar,
  pr as ContextBarStates,
  dn as DangerIcon,
  Or as DayTimeline,
  Yr as DayTimelineStates,
  $r as DebtCard,
  Ir as DebtCardStates,
  Ja as DebtIcon,
  Lr as DebtSummary,
  Fr as DebtSummaryStates,
  Qr as DeliveryRequestCard,
  Xr as DeliveryRequestCardStates,
  Xa as DeltaDownIcon,
  Qa as DeltaUpIcon,
  _t as DraftIcon,
  os as DriverApprovalStatus,
  cs as DriverApprovalStatusStates,
  ds as DriverJobCard,
  ls as DriverJobCardStates,
  be as EmptyState,
  Br as EmptyStateStates,
  nn as EntityApprovedIcon,
  C as EntityMark,
  Ii as EntityMarkStates,
  rn as EntityPendingIcon,
  is as EvidenceSlot,
  rs as EvidenceSlotStates,
  Bt as ExpandIcon,
  $t as FieldErrorIcon,
  xi as FileIcon,
  Di as FilterChips,
  qi as FilterChipsStates,
  Ce as ForwardIcon,
  mn as FundBankIcon,
  Pr as FundCard,
  Tr as FundCardStates,
  on as FundCashIcon,
  hn as FundWalletIcon,
  hs as Gallery,
  ps as GalleryStates,
  Gi as HeroSurface,
  Qi as HeroSurfaceStates,
  ua as IconButton,
  Fi as IconButtonStates,
  Kt as InfoIcon,
  Ar as InlineBanner,
  Sr as InlineBannerStates,
  ts as IssueProposalCard,
  ns as IssueProposalCardStates,
  kn as JobFailedIcon,
  Za as JobTrack,
  es as JobTrackStates,
  nt as LONG_PRESS_MS,
  qa as LayersProvider,
  ki as LinkIcon,
  ms as ListingCard,
  us as ListingCardStates,
  ws as ListingEditor,
  ys as ListingEditorStates,
  Ns as ListingStatusBadge,
  As as ListingStatusBadgeStates,
  Ae as LocationSlot,
  ss as LocationSlotStates,
  Qt as LockedIcon,
  Yn as MapPinIcon,
  ya as Metric,
  tr as MetricSmall,
  nr as MetricSmallStates,
  er as MetricStates,
  ci as MicIcon,
  li as MinusIcon,
  E as Money,
  Ai as MoneyStates,
  en as MoreIcon,
  In as MovementInIcon,
  Fn as MovementOutIcon,
  jr as MovementRow,
  Mr as MovementRowStates,
  gt as NavDeliveryIcon,
  Wa as NavFinanceIcon,
  Ua as NavMarketIcon,
  za as NavOrdersIcon,
  _a as NavTodayIcon,
  vi as NoteIcon,
  or as NotificationsButton,
  cr as NotificationsButtonStates,
  xt as NotificationsIcon,
  Ki as ObjectCard,
  Ji as ObjectCardStates,
  re as ObjectRow,
  Xi as ObjectRowStates,
  Ut as OfflineIcon,
  Rr as OrderCard,
  Er as OrderCardStates,
  ti as OrderIcon,
  xr as PageHeader,
  kr as PageHeaderStates,
  yi as PauseIcon,
  Ba as PaymentProgress,
  Vr as PaymentProgressStates,
  En as PhoneIcon,
  di as PlusIcon,
  ai as PriceTierIcon,
  gs as PriceTierTable,
  bs as PriceTierTableStates,
  mr as ProjectSwitcher,
  ur as ProjectSwitcherStates,
  Kr as QuoteCard,
  Jr as QuoteCardStates,
  ei as QuoteIcon,
  Ni as RTL_FLIP_ICONS,
  ji as Radio,
  Mi as RadioStates,
  ri as ReportIcon,
  ks as ReportSheet,
  vs as ReportSheetStates,
  Ka as RetryIcon,
  ii as ReviewIcon,
  vr as SaveState,
  wr as SaveStateStates,
  Zi as SearchField,
  Pi as SearchFieldStates,
  Zt as SearchIcon,
  _i as Section,
  Wi as SectionStates,
  ha as SegmentedControl,
  Ei as SegmentedControlStates,
  te as SelectedIcon,
  hi as SendIcon,
  ge as Sheet,
  ar as SheetStates,
  N as Skeleton,
  Hr as SkeletonStates,
  wi as SlidersIcon,
  zr as SlotPicker,
  Ur as SlotPickerStates,
  L as StatusBadge,
  $i as StatusBadgeStates,
  Ca as StatusTrack,
  Gr as StatusTrackStates,
  mi as StopIcon,
  fs as SupplierHeader,
  xs as SupplierHeaderStates,
  le as Surface,
  Oi as SurfaceStates,
  br as TabBar,
  fr as TabBarStates,
  gr as TabBarTab,
  pi as TableIcon,
  Te as TextArea,
  Ti as TextAreaStates,
  de as TextField,
  Ri as TextFieldStates,
  zi as Tile,
  Ui as TileStates,
  yr as Toast,
  Nr as ToastStates,
  na as Toggle,
  Ci as ToggleStates,
  Ze as ToneDoneIcon,
  Ot as ToneInfoIcon,
  pe as ToneProblemIcon,
  Et as ToneWaitingIcon,
  gn as TransferIcon,
  Cr as TransferRow,
  Zr as TransferRowStates,
  ui as TrashIcon,
  Dr as WeekStrip,
  qr as WeekStripStates,
  oe as Well,
  Yi as WellStates,
  qn as WhatsappIcon,
  bi as ZoomInIcon,
  fi as ZoomOutIcon,
  u as ar,
  Ye as arBase,
  V as formatMoney,
  Xe as formatTime12,
  qe as getToken,
  A as moneyTexts,
  sa as normalizeAmount,
  Se as offersCountWord,
  ze as pluralAr,
  _e as pluralNouns,
  M as t,
  Pa as toInternational,
  _ as tokens,
  D as useAmountVisibility,
  Da as useCountUp,
  Ya as useOpenSheetCount,
  Me as usePendingDelay,
  H as usePress,
  Oa as useSheetLayer,
  rt as useVisualViewport
};
