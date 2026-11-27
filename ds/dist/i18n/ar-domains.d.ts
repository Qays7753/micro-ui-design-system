/**
 * ar-domains.ts — the Arabic dictionary entries for the seven domain
 * components (plan B, stage 5; PLAN-B.md "your own files"). Every
 * user-visible string of the domain components lives here, in the same
 * `{ kind, text }` shape as ar.ts; ar.ts spreads `arDomains` inside its `ar`
 * object (one linking line) so the keys join `ArKey` and the batch-1 copy
 * override mechanism (3ج) keeps working over them.
 *
 * Domains: finance (B1), orders & appointments (B2), delivery (B3),
 * market (B4), review & admin (B5), Ask Micro (B6), charts (B7).
 * Kinds and word ceilings follow BRIEF 24 (see ar.ts header); the ds-copy
 * gate reads this file too (B0 gate extension).
 */
export declare const arDomains: {
    readonly 'fund.lastMovement': {
        readonly kind: "badge";
        readonly text: "آخر حركة:";
    };
    readonly 'fund.cashDrawer': {
        readonly kind: "badge";
        readonly text: "درج الكاش";
    };
    readonly 'fund.bankAccount': {
        readonly kind: "badge";
        readonly text: "الحساب البنكي";
    };
    readonly 'fund.walletName': {
        readonly kind: "badge";
        readonly text: "المحفظة";
    };
    readonly 'fund.balanceWord': {
        readonly kind: "screen-reader";
        readonly text: "الرصيد";
    };
    readonly 'fund.negativeBalance': {
        readonly kind: "badge";
        readonly text: "رصيد سالب";
    };
    readonly 'debt.forYou': {
        readonly kind: "badge";
        readonly text: "لك";
    };
    readonly 'debt.againstYou': {
        readonly kind: "badge";
        readonly text: "عليك";
    };
    readonly 'debt.dueOn': {
        readonly kind: "help";
        readonly text: "يستحق {date}";
    };
    readonly 'debt.overdue': {
        readonly kind: "badge";
        readonly text: "متأخر";
    };
    readonly 'debt.settled': {
        readonly kind: "badge";
        readonly text: "سُدّد";
    };
    readonly 'metric.weekIn': {
        readonly kind: "title";
        readonly text: "الداخل هذا الأسبوع";
    };
    readonly 'payment.paid': {
        readonly kind: "badge";
        readonly text: "دُفع";
    };
    readonly 'payment.remaining': {
        readonly kind: "badge";
        readonly text: "بقي";
    };
    readonly 'sr.listSeparator': {
        readonly kind: "screen-reader";
        readonly text: "، ";
    };
    readonly 'sr.movementRowOut': {
        readonly kind: "screen-reader";
        readonly text: "خارج";
    };
    readonly 'sr.movementRowIn': {
        readonly kind: "screen-reader";
        readonly text: "داخل";
    };
    readonly 'transfer.arrow': {
        readonly kind: "badge";
        readonly text: "←";
    };
    readonly 'sr.transferFrom': {
        readonly kind: "screen-reader";
        readonly text: "تحويل من {from} إلى {to}";
    };
    readonly 'sr.fundHasDraft': {
        readonly kind: "screen-reader";
        readonly text: "فيه مسودة";
    };
    readonly 'sr.debtProgress': {
        readonly kind: "screen-reader";
        readonly text: "دُفع {paid} من {total}";
    };
    readonly 'title.funds': {
        readonly kind: "title";
        readonly text: "الصناديق";
    };
    readonly 'title.debts': {
        readonly kind: "title";
        readonly text: "الديون";
    };
    readonly 'state.negativeBalance': {
        readonly kind: "badge";
        readonly text: "رصيد سالب";
    };
    readonly 'state.opened': {
        readonly kind: "badge";
        readonly text: "فُتح:";
    };
    readonly 'state.pressed': {
        readonly kind: "badge";
        readonly text: "مرات الضغط:";
    };
    readonly 'lab.h.movementRow': {
        readonly kind: "title";
        readonly text: "صف حركة مالية";
    };
    readonly 'lab.h.transferRow': {
        readonly kind: "title";
        readonly text: "صف تحويل صندوقين";
    };
    readonly 'lab.h.fundCard': {
        readonly kind: "title";
        readonly text: "بطاقة صندوق ورصيده";
    };
    readonly 'lab.h.debtCard': {
        readonly kind: "title";
        readonly text: "بطاقة دين ودفعاته";
    };
    readonly 'lab.h.debtSummary': {
        readonly kind: "title";
        readonly text: "ملخص الديون";
    };
    readonly 'lab.h.paymentProgress': {
        readonly kind: "title";
        readonly text: "شريط تقدم السداد";
    };
    readonly 'lab.h.financeCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة المالية";
    };
    readonly 'order.delivery': {
        readonly kind: "badge";
        readonly text: "التسليم";
    };
    readonly 'order.deliver': {
        readonly kind: "button";
        readonly text: "سلّم الطلب";
    };
    readonly 'order.duration': {
        readonly kind: "badge";
        readonly text: "موعد بمدة";
    };
    readonly 'order.today': {
        readonly kind: "badge";
        readonly text: "اليوم";
    };
    readonly 'order.tomorrow': {
        readonly kind: "badge";
        readonly text: "غداً";
    };
    readonly 'order.yesterday': {
        readonly kind: "badge";
        readonly text: "أمس";
    };
    readonly 'agenda.noTime': {
        readonly kind: "title";
        readonly text: "بلا وقت";
    };
    readonly 'agenda.emptyDay': {
        readonly kind: "empty";
        readonly text: "مواعيد هذا اليوم تظهر هنا.";
    };
    readonly 'agenda.emptyAll': {
        readonly kind: "empty";
        readonly text: "لا عناصر في هذه الفترة.";
    };
    readonly 'slot.morning': {
        readonly kind: "title";
        readonly text: "صباحاً";
    };
    readonly 'slot.evening': {
        readonly kind: "title";
        readonly text: "مساءً";
    };
    readonly 'slot.empty': {
        readonly kind: "empty";
        readonly text: "لا أوقات متاحة في هذا اليوم.";
    };
    readonly 'minute.one': {
        readonly kind: "badge";
        readonly text: "دقيقة";
    };
    readonly 'minute.few': {
        readonly kind: "badge";
        readonly text: "دقائق";
    };
    readonly 'hour.one': {
        readonly kind: "badge";
        readonly text: "ساعة";
    };
    readonly 'hour.two': {
        readonly kind: "badge";
        readonly text: "ساعتان";
    };
    readonly 'hour.few': {
        readonly kind: "badge";
        readonly text: "ساعات";
    };
    readonly 'sr.weekStripToday': {
        readonly kind: "screen-reader";
        readonly text: "اليوم";
    };
    readonly 'sr.weekStripItems': {
        readonly kind: "screen-reader";
        readonly text: "{counted}";
    };
    readonly 'sr.slotUnavailable': {
        readonly kind: "screen-reader";
        readonly text: "غير متاح";
    };
    readonly 'sr.timelineItems': {
        readonly kind: "screen-reader";
        readonly text: "عناصر اليوم بالترتيب";
    };
    readonly 'sr.timelineNow': {
        readonly kind: "screen-reader";
        readonly text: "الآن";
    };
    readonly 'orders.listView': {
        readonly kind: "badge";
        readonly text: "القائمة";
    };
    readonly 'orders.calendarView': {
        readonly kind: "badge";
        readonly text: "التقويم";
    };
    readonly 'orders.all': {
        readonly kind: "badge";
        readonly text: "الكل";
    };
    readonly 'orders.active': {
        readonly kind: "badge";
        readonly text: "الجارية";
    };
    readonly 'orders.log': {
        readonly kind: "badge";
        readonly text: "السجل";
    };
    readonly 'state.selected': {
        readonly kind: "badge";
        readonly text: "المحدد:";
    };
    readonly 'lab.h.orderCard': {
        readonly kind: "title";
        readonly text: "بطاقة طلب";
    };
    readonly 'lab.h.weekStrip': {
        readonly kind: "title";
        readonly text: "شريط أيام الأسبوع";
    };
    readonly 'lab.h.dayTimeline': {
        readonly kind: "title";
        readonly text: "جدول اليوم بالساعات";
    };
    readonly 'lab.h.agendaList': {
        readonly kind: "title";
        readonly text: "قائمة عناصر بالأيام";
    };
    readonly 'lab.h.slotPicker': {
        readonly kind: "title";
        readonly text: "أوقات متاحة للاختيار";
    };
    readonly 'lab.h.ordersCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة الطلبات";
    };
    readonly 'delivery.to': {
        readonly kind: "badge";
        readonly text: "إلى {area}";
    };
    readonly 'delivery.from': {
        readonly kind: "help";
        readonly text: "من {area} · {desc}";
    };
    readonly 'delivery.reviewQuotes': {
        readonly kind: "button";
        readonly text: "راجع العروض";
    };
    readonly 'quote.expiry': {
        readonly kind: "help";
        readonly text: "ينتهي {time}";
    };
    readonly 'quote.expiringSoon': {
        readonly kind: "badge";
        readonly text: "ينتهي قريباً";
    };
    readonly 'quote.acceptOutcome': {
        readonly kind: "help";
        readonly text: "بالقبول يبدأ السائق المهمة.";
    };
    readonly 'quote.rejected': {
        readonly kind: "badge";
        readonly text: "مرفوض";
    };
    readonly 'quote.superseded': {
        readonly kind: "badge";
        readonly text: "مستبدل";
    };
    readonly 'quote.expired': {
        readonly kind: "badge";
        readonly text: "انتهى";
    };
    readonly 'issue.title': {
        readonly kind: "title";
        readonly text: "تعذّر التسليم";
    };
    readonly 'issue.reason': {
        readonly kind: "badge";
        readonly text: "السبب";
    };
    readonly 'issue.proposed': {
        readonly kind: "badge";
        readonly text: "الإجراء المقترح";
    };
    readonly 'issue.awaitingOwner': {
        readonly kind: "badge";
        readonly text: "بانتظار موافقة المالك";
    };
    readonly 'issue.agreedAt': {
        readonly kind: "help";
        readonly text: "وافقت · {time}";
    };
    readonly 'issue.rejectedAt': {
        readonly kind: "help";
        readonly text: "رفضت · {time}";
    };
    readonly 'contact.call': {
        readonly kind: "button";
        readonly text: "اتصل";
    };
    readonly 'contact.whatsapp': {
        readonly kind: "button";
        readonly text: "واتساب";
    };
    readonly 'contact.marketNote': {
        readonly kind: "help";
        readonly text: "الشراء والتواصل خارج Micro.";
    };
    readonly 'evidence.title': {
        readonly kind: "title";
        readonly text: "إثبات التسليم";
    };
    readonly 'evidence.takePhoto': {
        readonly kind: "button";
        readonly text: "التقط صورة";
    };
    readonly 'evidence.codeLabel': {
        readonly kind: "help";
        readonly text: "الرمز من المستلم";
    };
    readonly 'evidence.ownerSentence': {
        readonly kind: "help";
        readonly text: "المالك يؤكد التسليم.";
    };
    readonly 'evidence.confirm': {
        readonly kind: "button";
        readonly text: "أكّد التسليم";
    };
    readonly 'evidence.codeError': {
        readonly kind: "error";
        readonly text: "الرمز غير صحيح. اسأل المستلم مرة أخرى.";
    };
    readonly 'evidence.entered': {
        readonly kind: "help";
        readonly text: "أُدخل الرمز ✓";
    };
    readonly 'location.openMaps': {
        readonly kind: "button";
        readonly text: "افتح في الخرائط";
    };
    readonly 'job.priceLabel': {
        readonly kind: "badge";
        readonly text: "سعرك";
    };
    readonly 'job.sendQuote': {
        readonly kind: "button";
        readonly text: "أرسل العرض";
    };
    readonly 'job.cannotDeliver': {
        readonly kind: "button";
        readonly text: "لم أستطع التسليم";
    };
    readonly 'job.sendToOwner': {
        readonly kind: "button";
        readonly text: "أرسل للمالك";
    };
    readonly 'job.slideDelivered': {
        readonly kind: "button";
        readonly text: "اسحب: تمّ التسليم";
    };
    readonly 'driver.pending': {
        readonly kind: "badge";
        readonly text: "بانتظار الاعتماد";
    };
    readonly 'driver.approved': {
        readonly kind: "badge";
        readonly text: "معتمد";
    };
    readonly 'driver.rejected': {
        readonly kind: "badge";
        readonly text: "مرفوض";
    };
    readonly 'driver.pendingSentence': {
        readonly kind: "help";
        readonly text: "طلبك قيد المراجعة. ستصلك الطلبات بعد الاعتماد.";
    };
    readonly 'sr.contactCall': {
        readonly kind: "screen-reader";
        readonly text: "اتصل بـ{name}";
    };
    readonly 'sr.contactWhatsapp': {
        readonly kind: "screen-reader";
        readonly text: "واتساب {name}، يفتح تطبيقاً آخر";
    };
    readonly 'sr.openMaps': {
        readonly kind: "screen-reader";
        readonly text: "افتح العنوان في الخرائط، يفتح تطبيقاً آخر";
    };
    readonly 'sr.jobTrack': {
        readonly kind: "screen-reader";
        readonly text: "مراحل التوصيل: المرحلة {current} من {total}";
    };
    readonly 'sr.evidenceNotTaken': {
        readonly kind: "screen-reader";
        readonly text: "لم تُلتقط بعد";
    };
    readonly 'sr.evidencePhoto': {
        readonly kind: "screen-reader";
        readonly text: "صورة";
    };
    readonly 'lab.h.deliveryRequestCard': {
        readonly kind: "title";
        readonly text: "بطاقة طلب توصيل";
    };
    readonly 'lab.h.quoteCard': {
        readonly kind: "title";
        readonly text: "بطاقة عرض سعر";
    };
    readonly 'lab.h.jobTrack': {
        readonly kind: "title";
        readonly text: "مسار مراحل التوصيل";
    };
    readonly 'lab.h.issueProposalCard': {
        readonly kind: "title";
        readonly text: "مقترح تعذّر التسليم";
    };
    readonly 'lab.h.contactBar': {
        readonly kind: "title";
        readonly text: "اتصال وواتساب";
    };
    readonly 'lab.h.evidenceSlot': {
        readonly kind: "title";
        readonly text: "إثبات التسليم";
    };
    readonly 'lab.h.locationSlot': {
        readonly kind: "title";
        readonly text: "عنوانا من وإلى";
    };
    readonly 'lab.h.driverJobCard': {
        readonly kind: "title";
        readonly text: "مهمة السائق الحالية";
    };
    readonly 'lab.h.driverApprovalStatus': {
        readonly kind: "title";
        readonly text: "حالة اعتماد السائق";
    };
    readonly 'lab.h.deliveryCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة التوصيل";
    };
    readonly 'listing.perUnit': {
        readonly kind: "badge";
        readonly text: "/ {unit}";
    };
    readonly 'listing.from': {
        readonly kind: "badge";
        readonly text: "من";
    };
    readonly 'listing.unavailable': {
        readonly kind: "badge";
        readonly text: "غير متوفر مؤقتاً";
    };
    readonly 'listing.byRequest': {
        readonly kind: "badge";
        readonly text: "بالطلب";
    };
    readonly 'tier.from': {
        readonly kind: "badge";
        readonly text: "من";
    };
    readonly 'tier.to': {
        readonly kind: "badge";
        readonly text: "إلى";
    };
    readonly 'tier.pricePerUnit': {
        readonly kind: "badge";
        readonly text: "السعر للعبوة";
    };
    readonly 'tier.andAbove': {
        readonly kind: "badge";
        readonly text: "فما فوق";
    };
    readonly 'gallery.imageOf': {
        readonly kind: "screen-reader";
        readonly text: "صورة {current} من {total}";
    };
    readonly 'gallery.close': {
        readonly kind: "screen-reader";
        readonly text: "أغلق الصور";
    };
    readonly 'gallery.zoomIn': {
        readonly kind: "screen-reader";
        readonly text: "كبّر";
    };
    readonly 'gallery.zoomOut': {
        readonly kind: "screen-reader";
        readonly text: "صغّر";
    };
    readonly 'gallery.loadFailed': {
        readonly kind: "error";
        readonly text: "لم تُحمَّل الصورة.";
    };
    readonly 'report.title': {
        readonly kind: "title";
        readonly text: "أبلغ عن العرض";
    };
    readonly 'report.details': {
        readonly kind: "badge";
        readonly text: "تفاصيل";
    };
    readonly 'report.detailsOptional': {
        readonly kind: "help";
        readonly text: "اختياري";
    };
    readonly 'report.send': {
        readonly kind: "button";
        readonly text: "أرسل البلاغ";
    };
    readonly 'report.chooseReason': {
        readonly kind: "error";
        readonly text: "اختر سبب البلاغ";
    };
    readonly 'report.sent': {
        readonly kind: "success";
        readonly text: "أُرسل البلاغ";
    };
    readonly 'editor.photos': {
        readonly kind: "badge";
        readonly text: "الصور";
    };
    readonly 'editor.listingName': {
        readonly kind: "badge";
        readonly text: "اسم العرض";
    };
    readonly 'editor.unit': {
        readonly kind: "badge";
        readonly text: "العبوة";
    };
    readonly 'editor.singlePrice': {
        readonly kind: "badge";
        readonly text: "سعر واحد";
    };
    readonly 'editor.tiers': {
        readonly kind: "badge";
        readonly text: "شرائح";
    };
    readonly 'editor.pricePerUnit': {
        readonly kind: "badge";
        readonly text: "السعر للعبوة";
    };
    readonly 'editor.sendReview': {
        readonly kind: "button";
        readonly text: "أرسل للمراجعة";
    };
    readonly 'editor.sendEdit': {
        readonly kind: "button";
        readonly text: "أرسل التعديل";
    };
    readonly 'listing.reviewPending': {
        readonly kind: "badge";
        readonly text: "قيد المراجعة";
    };
    readonly 'listing.approved': {
        readonly kind: "badge";
        readonly text: "معتمد";
    };
    readonly 'listing.rejected': {
        readonly kind: "badge";
        readonly text: "مرفوض";
    };
    readonly 'listing.editPending': {
        readonly kind: "badge";
        readonly text: "تعديل قيد المراجعة";
    };
    readonly 'listing.editRejected': {
        readonly kind: "badge";
        readonly text: "رُفض التعديل";
    };
    readonly 'sr.galleryRegion': {
        readonly kind: "screen-reader";
        readonly text: "معرض";
    };
    readonly 'sr.tierTable': {
        readonly kind: "screen-reader";
        readonly text: "شرائح السعر";
    };
    readonly 'lab.h.listingCard': {
        readonly kind: "title";
        readonly text: "بطاقة عرض";
    };
    readonly 'lab.h.gallery': {
        readonly kind: "title";
        readonly text: "صور العرض والعارض";
    };
    readonly 'lab.h.priceTierTable': {
        readonly kind: "title";
        readonly text: "جدول شرائح السعر";
    };
    readonly 'lab.h.supplierHeader': {
        readonly kind: "title";
        readonly text: "رأس صفحة المورد";
    };
    readonly 'lab.h.reportSheet': {
        readonly kind: "title";
        readonly text: "ورقة الإبلاغ";
    };
    readonly 'lab.h.listingEditor': {
        readonly kind: "title";
        readonly text: "نموذج إنشاء عرض";
    };
    readonly 'lab.h.listingStatusBadge': {
        readonly kind: "title";
        readonly text: "شارة حالة العرض";
    };
    readonly 'lab.h.marketCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة السوق";
    };
    readonly 'review.newListing': {
        readonly kind: "badge";
        readonly text: "عرض جديد";
    };
    readonly 'review.editListing': {
        readonly kind: "badge";
        readonly text: "تعديل عرض";
    };
    readonly 'review.newDriver': {
        readonly kind: "badge";
        readonly text: "سائق جديد";
    };
    readonly 'review.report': {
        readonly kind: "badge";
        readonly text: "بلاغ";
    };
    readonly 'review.sinceAgo': {
        readonly kind: "help";
        readonly text: "منذ {duration}";
    };
    readonly 'review.emptyQueue': {
        readonly kind: "empty";
        readonly text: "لا شيء ينتظر المراجعة.";
    };
    readonly 'review.emptyReports': {
        readonly kind: "empty";
        readonly text: "لا بلاغات.";
    };
    readonly 'review.beforeApprove': {
        readonly kind: "title";
        readonly text: "بنود التحقق";
    };
    readonly 'review.firstListing': {
        readonly kind: "badge";
        readonly text: "أول عرض";
    };
    readonly 'review.verificationCall': {
        readonly kind: "help";
        readonly text: "أجريت اتصال التحقق مع المورد";
    };
    readonly 'review.tickAllFirst': {
        readonly kind: "help";
        readonly text: "أشّر على كل البنود أولاً.";
    };
    readonly 'review.decisionReason': {
        readonly kind: "badge";
        readonly text: "سبب القرار";
    };
    readonly 'review.approve': {
        readonly kind: "button";
        readonly text: "اعتمد العرض";
    };
    readonly 'review.reject': {
        readonly kind: "button";
        readonly text: "ارفض العرض";
    };
    readonly 'review.sendRejection': {
        readonly kind: "button";
        readonly text: "أرسل الرفض";
    };
    readonly 'review.approvedToast': {
        readonly kind: "success";
        readonly text: "اعتُمد العرض";
    };
    readonly 'review.rejectedToast': {
        readonly kind: "success";
        readonly text: "رُفض العرض";
    };
    readonly 'review.writeReason': {
        readonly kind: "error";
        readonly text: "اكتب سبب القرار.";
    };
    readonly 'reportItem.one': {
        readonly kind: "badge";
        readonly text: "بلاغ";
    };
    readonly 'reportItem.two': {
        readonly kind: "badge";
        readonly text: "بلاغان";
    };
    readonly 'reportItem.few': {
        readonly kind: "badge";
        readonly text: "{count} بلاغات";
    };
    readonly 'driverReview.approve': {
        readonly kind: "button";
        readonly text: "اعتمد السائق";
    };
    readonly 'driverReview.reject': {
        readonly kind: "button";
        readonly text: "ارفض";
    };
    readonly 'driverReview.approvedToast': {
        readonly kind: "success";
        readonly text: "اعتُمد السائق";
    };
    readonly 'driverReview.attachments': {
        readonly kind: "title";
        readonly text: "المرفقات";
    };
    readonly 'sr.unread': {
        readonly kind: "screen-reader";
        readonly text: "غير مقروء";
    };
    readonly 'sr.reviewItems': {
        readonly kind: "screen-reader";
        readonly text: "{count} بنود، أُشّر على {ticked}";
    };
    readonly 'lab.h.reviewQueueItem': {
        readonly kind: "title";
        readonly text: "صف طابور المراجعة";
    };
    readonly 'lab.h.decisionCard': {
        readonly kind: "title";
        readonly text: "ورقة قرار الاعتماد";
    };
    readonly 'lab.h.driverApprovalCard': {
        readonly kind: "title";
        readonly text: "ورقة اعتماد سائق";
    };
    readonly 'lab.h.reportItem': {
        readonly kind: "title";
        readonly text: "صف عرض مبلَّغاً";
    };
    readonly 'lab.h.reviewCompose': {
        readonly kind: "title";
        readonly text: "تركيب شاشة المراجعة";
    };
    readonly 'ask.title': {
        readonly kind: "title";
        readonly text: "Ask Micro";
    };
    readonly 'ask.askMicro': {
        readonly kind: "badge";
        readonly text: "اسأل Micro";
    };
    readonly 'ask.contextPrefix': {
        readonly kind: "badge";
        readonly text: "تسأل عن: {context}";
    };
    readonly 'ask.you': {
        readonly kind: "screen-reader";
        readonly text: "أنت:";
    };
    readonly 'ask.notSent': {
        readonly kind: "error";
        readonly text: "لم يُرسل";
    };
    readonly 'ask.resend': {
        readonly kind: "button";
        readonly text: "أعد الإرسال";
    };
    readonly 'ask.microPrefix': {
        readonly kind: "screen-reader";
        readonly text: "Micro:";
    };
    readonly 'ask.incomplete': {
        readonly kind: "error";
        readonly text: "لم يكتمل الجواب.";
    };
    readonly 'ask.retry': {
        readonly kind: "button";
        readonly text: "أعد المحاولة";
    };
    readonly 'ask.howCalculated': {
        readonly kind: "button";
        readonly text: "كيف حُسبت؟";
    };
    readonly 'ask.numberSource': {
        readonly kind: "title";
        readonly text: "مصدر الرقم";
    };
    readonly 'ask.fullTable': {
        readonly kind: "button";
        readonly text: "الجدول كاملاً";
    };
    readonly 'ask.gone': {
        readonly kind: "help";
        readonly text: "لم يعد موجوداً";
    };
    readonly 'ask.limitPermission': {
        readonly kind: "help";
        readonly text: "هذا خارج صلاحياتك في هذا المشروع.";
    };
    readonly 'ask.limitData': {
        readonly kind: "help";
        readonly text: "لا أملك بيانات كافية لهذا السؤال.";
    };
    readonly 'ask.recordVoice': {
        readonly kind: "screen-reader";
        readonly text: "سجّل صوتاً";
    };
    readonly 'ask.send': {
        readonly kind: "screen-reader";
        readonly text: "أرسل";
    };
    readonly 'sr.howCalculated': {
        readonly kind: "screen-reader";
        readonly text: "كيف حُسبت {label}";
    };
    readonly 'sr.askAbout': {
        readonly kind: "screen-reader";
        readonly text: "اسأل Micro عن {label}";
    };
    readonly 'lab.h.askPanel': {
        readonly kind: "title";
        readonly text: "لوحة المساعد Ask";
    };
    readonly 'lab.h.askContextChip': {
        readonly kind: "title";
        readonly text: "رقاقة سياق السؤال";
    };
    readonly 'lab.h.askUserMessage': {
        readonly kind: "title";
        readonly text: "رسالة المستخدم";
    };
    readonly 'lab.h.askAnswer': {
        readonly kind: "title";
        readonly text: "جواب Micro النصي";
    };
    readonly 'lab.h.askComputedResult': {
        readonly kind: "title";
        readonly text: "رقم محسوب ومصدره";
    };
    readonly 'lab.h.askInlineTable': {
        readonly kind: "title";
        readonly text: "جدول داخل الجواب";
    };
    readonly 'lab.h.askNavResult': {
        readonly kind: "title";
        readonly text: "كائن من الجواب";
    };
    readonly 'lab.h.askDraftCard': {
        readonly kind: "title";
        readonly text: "مسودة من الجواب";
    };
    readonly 'lab.h.askLimit': {
        readonly kind: "title";
        readonly text: "جواب خارج الصلاحيات";
    };
    readonly 'lab.h.askThinking': {
        readonly kind: "title";
        readonly text: "انتظار الجواب";
    };
    readonly 'lab.h.askAboutThis': {
        readonly kind: "title";
        readonly text: "زر اسأل عنه";
    };
    readonly 'lab.h.askCompose': {
        readonly kind: "title";
        readonly text: "تركيب محادثة Ask";
    };
    readonly 'chart.table': {
        readonly kind: "screen-reader";
        readonly text: "جدول";
    };
    readonly 'chart.chart': {
        readonly kind: "screen-reader";
        readonly text: "رسم";
    };
    readonly 'chart.empty': {
        readonly kind: "empty";
        readonly text: "لا بيانات لهذه الفترة.";
    };
    readonly 'chart.thisWeek': {
        readonly kind: "badge";
        readonly text: "هذا الأسبوع";
    };
    readonly 'chart.lastWeek': {
        readonly kind: "badge";
        readonly text: "الأسبوع الماضي";
    };
    readonly 'chart.other': {
        readonly kind: "badge";
        readonly text: "غير ذلك";
    };
    readonly 'lab.h.chartBars': {
        readonly kind: "title";
        readonly text: "أعمدة مبيعات الأيام";
    };
    readonly 'lab.h.chartNegative': {
        readonly kind: "title";
        readonly text: "أعمدة فيها خسارة";
    };
    readonly 'lab.h.chartRanked': {
        readonly kind: "title";
        readonly text: "أعلى العملاء بالقيمة";
    };
    readonly 'lab.h.chartLine': {
        readonly kind: "title";
        readonly text: "خط تغير سنة";
    };
    readonly 'lab.h.chartStacked': {
        readonly kind: "title";
        readonly text: "توزيع الخارج بالنسب";
    };
    readonly 'lab.h.chartCompare': {
        readonly kind: "title";
        readonly text: "مقارنة أسبوعين";
    };
    readonly 'lab.h.chartsCompose': {
        readonly kind: "title";
        readonly text: "تركيب الرسوم";
    };
};
export type ArDomainsKey = keyof typeof arDomains;
