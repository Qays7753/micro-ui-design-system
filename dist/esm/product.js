import {
  scriptBase
} from "./chunk-SSQCCXXI.js";
import {
  globalApi
} from "./chunk-N2NZHAOZ.js";
import {
  pulse
} from "./chunk-QHEJXXN5.js";
import {
  currentInstanceLabels,
  getLabel,
  instanceLabelFor,
  registerLabels,
  setInstanceLabels,
  setLabels,
  withLabels
} from "./chunk-S44UNZ6A.js";

// components/product-context/labels.js
var defaults = {
  "phase.loading": "جارٍ التحميل…",
  "phase.empty": "لا توجد بيانات بعد",
  "phase.success": "تمت العملية",
  "phase.error": "تعذّر إكمال الطلب",
  "phase.rejected": "لم يُقبل الطلب",
  "phase.disabled": "الإجراء غير متاح حاليًا",
  "phase.pending": "بانتظار نتيجة مؤكدة",
  "phase.uncertain": "النتيجة غير مؤكدة؛ تحقق قبل إعادة الإرسال",
  "phase.denied": "لا تتوفر صلاحية لهذا السياق",
  "phase.expired": "انتهت الجلسة",
  "phase.signedOut": "يلزم تسجيل الدخول",
  "phase.conflict": "تغيّرت البيانات؛ راجع النسخة الأحدث",
  "confirm.missingComponent": "يلزم تحميل مكوّن التأكيد",
  "confirm.title": "تأكيد الإجراء",
  "confirm.cancel": "تراجع",
  "confirm.ok": "تأكيد",
  "form.requiredFields": "أكمل الحقول المطلوبة",
  "form.missingFieldPrefix": "أدخل ",
  "form.missingFieldFallback": "القيمة المطلوبة",
  "media.unavailable": "لا توجد صورة متاحة",
  "media.carouselLabel": "صور المرفقات",
  "media.cardLabelPrefix": "صورة ",
  "media.imageAltFallback": "صورة المرفق",
  "media.imageError": "تعذّر عرض الصورة",
  "media.linkUnavailable": "رابط الصورة غير متاح",
  "media.prev": "السابق",
  "media.next": "التالي",
  "attachments.label": "الصور",
  "attachments.addMore": "إضافة صور",
  "attachments.replaceSelection": "استبدال الاختيار",
  "attachments.choose": "اختيار الصور",
  "attachments.fileError": "تعذّر استخدام الملف",
  "attachments.fileErrorDetail": "نوع الصورة أو حجمها لا يطابق القيد المقدم.",
  "attachments.remove": "إزالة",
  "attachments.removeAriaPrefix": "إزالة ",
  "attachments.removeAll": "إزالة المرفقات",
  "attachments.requiredNotice": "أرفق صورة للمتابعة.",
  "shell.previousContextHidden": "بيانات السياق السابق غير معروضة.",
  "shell.reauth": "متابعة الدخول",
  "shell.chooseContext": "اختيار سياق آخر",
  "shell.noScopeTitle": "اختر سياقًا معتمدًا",
  "shell.noScopeDetail": "لا تُعرض بيانات خاصة قبل تحديد السياق.",
  "shell.driverScopeTitle": "هذه الوجهة غير متاحة في سياق السائق",
  "shell.driverScopeDetail": "المتاح للسائق Delivery وAsk Micro فقط.",
  "shell.noPermission": "لا يمكنك عرض هذه البيانات في السياق الحالي",
  "connection.offline": "الاتصال منقطع",
  "connection.local": "وضع محلي",
  "connection.weak": "الاتصال ضعيف",
  "connection.manageNotice": "الكتابة متاحة أثناء الاتصال فقط؛ لا طابور مزامنة (المرحلة 8 — توافق Online-only).",
  "connection.genericNotice": "العمليات التي تحتاج الاتصال غير متاحة الآن.",
  "stateCard.recheck": "إعادة التحقق",
  "context.accountFallback": "حساب Micro",
  "context.unavailableTitle": "السياق غير متاح",
  "context.unavailableDetail": "لا يمكن اختيار سياق الآن.",
  "context.invalidListTitle": "قائمة السياقات غير صالحة",
  "context.selectLabel": "الدور والمنشأة",
  "context.destination.manage": "Manage · الإدارة",
  "context.destination.market": "Market · السوق",
  "context.destination.delivery": "Delivery · التوصيل",
  "context.navLabel": "وجهات Micro المصرح بها",
  "context.noDestinationsTitle": "لا وجهات متاحة",
  "context.noDestinationsDetail": "اختر سياقًا آخر للمتابعة.",
  "delivery.title": "طلب توصيل",
  "delivery.pickup": "الاستلام",
  "delivery.dropoff": "التسليم",
  "common.unavailable": "(غير متاح)",
  "delivery.addressesUnavailable": "تفاصيل المواقع غير متاحة لهذا السياق",
  "delivery.pickupField": "موقع الاستلام",
  "delivery.dropoffField": "موقع التسليم",
  "delivery.noteField": "تفاصيل الطلب",
  "delivery.requestAction": "إرسال طلب توصيل",
  "delivery.requestConfirm": "سيُرسل طلب التوصيل بالبيانات المدخلة.",
  "common.unitFallback": "(الوحدة غير محددة)",
  "delivery.validityFallback": "مهلة العرض غير متاحة",
  "delivery.quote.accept": "قبول العرض",
  "delivery.quote.decline": "رفض العرض",
  "delivery.quote.assign": "طلب إسناد للسائق",
  "delivery.quote.confirmPrefix": "تأكيد العرض كما ورد: ",
  "common.unavailablePlain": "غير متاح",
  "delivery.change.current": "البيانات الحالية",
  "delivery.change.proposed": "التعديل المقترح",
  "delivery.partyStatusFallback": "القرار غير متاح",
  "delivery.change.requestAction": "طلب موافقة على التعديل",
  "delivery.change.confirm": "هذا طلب موافقة؛ لا يعتمد التعديل أو يغيّر الطلب من جهة واحدة.",
  "delivery.proof.noteField": "ملاحظة الإثبات",
  "delivery.proof.returnAction": "إرسال إثبات إرجاع",
  "delivery.proof.deliveryAction": "إرسال إثبات تسليم",
  "delivery.proof.attachmentRequired": "أرفق الإثبات المطلوب",
  "delivery.proof.confirm": "سيُرسل الإثبات للمراجعة؛ لا يعني ذلك اكتمال التسليم أو الإرجاع.",
  "delivery.updateStatusAction": "تحديث الحالة",
  "market.editorTitle": "بيانات الإعلان",
  "market.searchTitle": "بحث السوق",
  "market.listingTitle": "إعلان",
  "market.searchField": "البحث",
  "market.searchAction": "عرض النتائج",
  "market.titleField": "عنوان الإعلان",
  "market.descriptionField": "الوصف",
  "market.priceField": "السعر",
  "market.priceUnitFallback": "الوحدة غير محددة",
  "market.publishAction": "إرسال للنشر",
  "market.saveDraftAction": "حفظ المسودة",
  "market.publishConfirmPrefix": "إرسال ",
  "market.publishConfirmPrice": " بسعر ",
  "common.unitFallback": "(الوحدة غير محددة)",
  "market.reviewNoteTitle": "ملاحظة المراجعة",
  "market.editAction": "تعديل",
  "market.reportAction": "الإبلاغ عن الإعلان",
  "market.reportConfirm": "إرسال طلب بلاغ؛ التصنيف والمراجعة وفق قواعد المنتج المعتمدة.",
  "operation.title": "حالة العملية",
  "operation.referencePrefix": "مرجع الطلب: ",
  "operation.actions.recheck": "إعادة التحقق",
  "operation.actions.retry": "إعادة المحاولة",
  "assistant.logLabel": "رسائل المحادثة",
  "assistant.userSpeaker": "أنت",
  "assistant.noteSpeaker": "ملاحظة",
  "assistant.retryAction": "إعادة المحاولة",
  "assistant.proposalExpired": "انتهت صلاحية الاقتراح",
  "assistant.proposalCompleted": "تم تنفيذ الإجراء",
  "assistant.proposalUnavailable": "الإجراء غير متاح",
  "assistant.emptyLog": "ابدأ محادثة في السياق الحالي",
  "assistant.searchingStatus": "جارٍ البحث…",
  "assistant.preparingStatus": "جارٍ إعداد الرد…",
  "assistant.newMessagesAction": "رسائل جديدة",
  "assistant.proposalTitle": "إجراء مقترح",
  "assistant.proposalActionFallback": "مراجعة وتأكيد الإجراء",
  "assistant.messageField": "رسالتك",
  "assistant.sendAction": "إرسال",
  "review.reportTitle": "إرسال بلاغ",
  "review.itemTitle": "عنصر للمراجعة",
  "review.reasonField": "سبب البلاغ",
  "review.categoryField": "التصنيف",
  "review.submitAction": "إرسال البلاغ",
  "review.submitConfirm": "سيُرسل البلاغ للمراجعة.",
  "review.reasonTitle": "سبب أو ملاحظة",
  "review.attachmentsRestricted": "المرفقات مقيدة حسب الصلاحية",
  "review.decisionNoteField": "ملاحظة القرار",
  "review.approveAction": "قبول",
  "review.rejectAction": "رفض",
  "review.requestInfoAction": "طلب معلومات",
  "review.decisionConfirmPrefix": "مراجعة قرار ",
  "review.decisionConfirmOn": " على ",
  "review.subjectFallback": "هذا العنصر",
  "manage.title": "سجل العمليات",
  "manage.summaryTitle": "ملخص الفترة",
  "manage.listTitle": "العمليات",
  "manage.formTitle": "عملية جديدة",
  "manage.amountField": "المبلغ",
  "manage.typeField": "النوع",
  "manage.type.sale": "مبيعات",
  "manage.type.expense": "مصاريف",
  "manage.dateField": "التاريخ",
  "manage.noteField": "الملاحظة",
  "manage.submitAction": "إضافة العملية",
  "manage.clearAction": "تفريغ الحقول",
  "manage.emptyList": "لا عمليات في هذه الفترة",
  "manage.submitConfirm": "سيُرسل إدخال العملية كما هو؛ لا يُسجَّل مبلغ قبل تأكيد الخادم.",
  "market.resultsTitle": "النتائج",
  "market.noAdsTitle": "لا توجد إعلانات",
  "market.noAdsDetail": "المصدر لا يضم إعلانات معروضة حاليًا.",
  "market.noResultsTitle": "لا نتائج لهذا البحث",
  "market.noResultsDetail": "عدّل كلمات البحث أو الفلاتر ثم أعد المحاولة.",
  "review.queueTitle": "قائمة المراجعة",
  "review.kind.listing": "إعلان",
  "review.kind.flag": "بلاغ",
  "review.kind.driverApplication": "طلب سائق",
  "review.emptyQueue": "لا عناصر في القائمة"
};

// components/product-context/product-core.js
registerLabels("product-context", defaults);
var MICRO_LABELS_FAMILY = "product-context";
function L(key2, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY) || currentInstanceLabels(MICRO_LABELS_FAMILY);
  if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
  return getLabel(MICRO_LABELS_FAMILY, key2);
}
function withLabels2(scope, fn) {
  return withLabels(scope, MICRO_LABELS_FAMILY, fn);
}
function applyInstanceLabels(scope, options) {
  if (options && options.labels && typeof options.labels === "object") {
    setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
  }
}
var renderers = /* @__PURE__ */ new Map();
var instances = /* @__PURE__ */ new WeakMap();
var sequence = 0;
var phases = {
  ready: "",
  loading: L("phase.loading"),
  empty: L("phase.empty"),
  success: L("phase.success"),
  error: L("phase.error"),
  rejected: L("phase.rejected"),
  disabled: L("phase.disabled"),
  pending: L("phase.pending"),
  uncertain: L("phase.uncertain"),
  denied: L("phase.denied"),
  expired: L("phase.expired"),
  "signed-out": L("phase.signedOut"),
  conflict: L("phase.conflict")
};
function key(scope) {
  return scope && typeof scope.contextId === "string" && scope.contextId && typeof scope.roleId === "string" && scope.roleId && (scope.workspaceId == null || typeof scope.workspaceId === "string" && scope.workspaceId) ? JSON.stringify([scope.contextId, scope.workspaceId || null, scope.roleId, scope.kind || "business"]) : null;
}
function copy(value) {
  return structuredClone(value);
}
function draftOwner(value) {
  return value ? JSON.stringify([value.mode || null, value.id == null ? null : value.id, value.draftKey || null]) : null;
}
function visibilityRevoked(before, after) {
  return !!before && ["addresses", "contact", "evidence"].some(function(name) {
    return before.visibility && before.visibility[name] === true && !(after.visibility && after.visibility[name] === true);
  });
}
function node(tag, cls, text2) {
  var el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text2 !== void 0 && text2 !== null) el.textContent = String(text2);
  return el;
}
function note(parent, title, body, tone) {
  var el = node("section", "m-note m-note--" + (tone || "info"));
  el.setAttribute("role", tone === "error" ? "alert" : "status");
  var text2 = node("div", "m-note__text");
  text2.appendChild(node("strong", "m-note__title", title));
  if (body) text2.appendChild(node("p", "m-note__body", body));
  el.appendChild(text2);
  parent.appendChild(el);
  return el;
}
function safeImage(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    var url = new URL(String(value), document.baseURI);
    return ["http:", "https:", "blob:"].indexOf(url.protocol) >= 0 || /^data:image\/(png|jpeg|webp|gif);/i.test(url.href) ? url.href : null;
  } catch (_) {
    return null;
  }
}
function register(type8, renderer) {
  if (renderers.has(type8)) throw new Error("Duplicate composition");
  renderers.set(type8, renderer);
}
function contextKey(scope) {
  return key(scope);
}
function mount(root, type8, value) {
  if (!root || root.nodeType !== 1 || !renderers.has(type8)) throw new TypeError("Unknown product composition or invalid root");
  if (instances.has(root)) {
    var old = instances.get(root);
    if (old.type !== type8) throw new TypeError("One DOM owner per root");
    return old.api;
  }
  var model, epoch = 0, requestNumber = 0, pending = null, destroyed = false;
  var rendererLife, cleanups = [], confirmation = null, suppressFocus = false;
  var ui = { draft: /* @__PURE__ */ Object.create(null), files: [], urls: [], presentation: /* @__PURE__ */ Object.create(null), presentationGeneration: 0 };
  var instanceId = "micro-product-" + ++sequence;
  var forbidden = ["denied", "expired", "signed-out"];
  function disposeConfirmation() {
    if (!confirmation) return;
    var current = confirmation;
    confirmation = null;
    current.life.abort();
    globalApi("ActionSheet").disconnect(current.sheet);
    current.sheet.remove();
    current.backdrop.remove();
  }
  function releaseFiles() {
    ui.urls.forEach(function(url) {
      URL.revokeObjectURL(url);
    });
    ui.urls = [];
    ui.files = [];
  }
  function stopRender() {
    if (rendererLife) rendererLife.abort();
    cleanups.splice(0).forEach(function(fn) {
      fn();
    });
  }
  function permission(id) {
    return Array.isArray(model.permissions) && model.permissions.indexOf(id) >= 0;
  }
  function allowed(id, local) {
    if (destroyed || pending || !permission(id)) return false;
    if (forbidden.indexOf(model.phase) >= 0) {
      return model.connection === "online" && (id === "reauth" || model.phase === "denied" && id === "choose-context");
    }
    if (!key(model.scope)) return false;
    if (model.scope.kind === "driver" && (type8 === "market" || type8 === "manage" || type8 === "review" && model.mode !== "report" || type8 !== "context" && ["manage", "market"].indexOf(model.destination) >= 0)) return false;
    if (["loading", "pending", "disabled"].indexOf(model.phase) >= 0) return false;
    if (["uncertain", "conflict"].indexOf(model.phase) >= 0 && ["recheck", "reauth"].indexOf(id) < 0) return false;
    if (["offline", "weak", "local"].indexOf(model.connection) >= 0) {
      return !!local && model.destination === "manage" && model.scope.kind !== "driver";
    }
    return true;
  }
  function dispatch(id, payload, local) {
    if (!allowed(id, local)) return false;
    var token = { instanceId, generation: epoch, requestId: instanceId + "-" + ++requestNumber, contextKey: key(model.scope) };
    pending = { token, action: id, payload: copy(payload || {}) };
    var detail = { type: type8, action: id, scope: copy(model.scope || null), request: copy(token), payload: copy(payload || {}) };
    render8();
    root.dispatchEvent(new CustomEvent("micro-product:intent", { bubbles: true, detail }));
    return true;
  }
  function confirm(id, payload, label, description, local, danger) {
    if (!allowed(id, local) || confirmation) return;
    if (!globalApi("ActionSheet")) {
      note(root, L("confirm.missingComponent", root), "", "error");
      return;
    }
    var generation = epoch, context = key(model.scope), trigger = document.activeElement;
    var sheet = node("div", "m-layer m-action-sheet"), backdrop = node("div", "m-layer-backdrop"), life = new AbortController();
    sheet.id = instanceId + "-confirmation";
    backdrop.id = sheet.id + "-backdrop";
    backdrop.dataset.for = sheet.id;
    sheet.dataset.backdropId = backdrop.id;
    sheet.dataset.backdrop = "keep";
    sheet.hidden = backdrop.hidden = true;
    sheet.setAttribute("role", "alertdialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-labelledby", sheet.id + "-title");
    sheet.setAttribute("aria-describedby", sheet.id + "-description");
    var head = node("header", "m-layer__head"), title = node("h2", "m-layer__title", L("confirm.title", head));
    title.id = sheet.id + "-title";
    head.appendChild(title);
    var cancel = node("button", "m-btn m-btn--secondary", L("confirm.cancel"));
    cancel.type = "button";
    cancel.dataset.layerClose = "";
    head.appendChild(cancel);
    sheet.appendChild(head);
    var body = node("div", "m-layer__body"), desc = node("p", "", description || label);
    desc.id = sheet.id + "-description";
    body.appendChild(desc);
    body.appendChild(node("p", "m-product__secondary", model.scope.label || model.scope.contextId));
    var list = node("ul", "m-action-sheet__list"), item = node("li");
    var button = node("button", "m-btn " + (danger ? "m-btn--destructive-soft" : "m-btn--primary") + " m-action-sheet__item", label || L("confirm.ok", label));
    button.type = "button";
    button.dataset.actionId = "confirm";
    item.appendChild(button);
    list.appendChild(item);
    body.appendChild(list);
    sheet.appendChild(body);
    document.body.append(backdrop, sheet);
    confirmation = { sheet, backdrop, life };
    globalApi("ActionSheet").init(sheet);
    sheet.addEventListener("micro-actions:request", function() {
      if (destroyed || generation !== epoch || context !== key(model.scope)) return;
      disposeConfirmation();
      pulse("confirm");
      dispatch(id, payload, local);
    }, { signal: life.signal });
    sheet.addEventListener("micro-navigation:closed", function(event) {
      if (event.target === sheet) setTimeout(function() {
        if (confirmation && confirmation.sheet === sheet) disposeConfirmation();
      }, 0);
    }, { signal: life.signal });
    globalApi("ActionSheet").open(sheet, { trigger, contextKey: context });
  }
  function render8() {
    var active = root.contains(document.activeElement) ? document.activeElement : null;
    var focusKey = !suppressFocus && active && active.getAttribute("data-focus-key");
    var selection = active && typeof active.selectionStart === "number" ? [active.selectionStart, active.selectionEnd] : null;
    stopRender();
    rendererLife = new AbortController();
    root.replaceChildren();
    root.classList.add("m-product");
    root.setAttribute("data-product-type", type8);
    if (type8 === "assistant") root.dataset.conversationLayout = model.conversationLayout === "fill" ? "fill" : "embedded";
    root.setAttribute("aria-busy", String(!!pending || ["loading", "pending"].indexOf(model.phase) >= 0));
    if (!root.hasAttribute("tabindex")) root.tabIndex = -1;
    var scopeKey = key(model.scope);
    var ctx = {
      root,
      model,
      ui,
      node,
      note,
      key,
      uid: instanceId,
      /* المرحلة 8 — معلومات عرض إضافية للتراكيب الجديدة: رابط صورة
         مفحوص (نفس قاعدة media) وفعل الطلب المعلق إن وُجد (لعرض حالة
         تحميل على زره)؛ إضافات فقط لا تغير سلوك أي renderer قائم. */
      safeImage,
      pending: pending ? pending.action : null,
      on: function(el, event, fn) {
        el.addEventListener(event, fn, { signal: rendererLife.signal });
      },
      cleanup: function(fn) {
        cleanups.push(fn);
      },
      can: allowed,
      editable: function() {
        return !pending && permission("compose") && forbidden.indexOf(model.phase) < 0 && ["disabled", "loading", "pending"].indexOf(model.phase) < 0;
      },
      request: dispatch,
      button: function(parent, id, label, payload, options) {
        options = options || {};
        var b = node("button", "m-btn " + (options.danger ? "m-btn--destructive-soft" : options.primary ? "m-btn--primary" : "m-btn--secondary"), label);
        b.type = "button";
        b.dataset.productAction = id;
        b.dataset.focusKey = options.focusKey || "action-" + id;
        b.disabled = !!options.disabled || !allowed(id, options.local);
        parent.appendChild(b);
        ctx.on(b, "click", function() {
          if (!root.contains(b) || b.disabled || !allowed(id, options.local)) return;
          var data = typeof payload === "function" ? payload() : payload;
          if (data === false) return;
          if (options.confirm || options.danger) {
            confirm(id, data, label, typeof options.description === "function" ? options.description(data) : options.description, options.local, options.danger);
          } else {
            dispatch(id, data, options.local);
          }
        });
        return b;
      },
      field: function(parent, name, label, options) {
        options = options || {};
        var box = node("div", "m-field"), lab = node("label", "m-field__label", label), wrap = node("div", "m-field__control");
        box.dataset.microField = "";
        var input = node(options.multiline ? "textarea" : options.options ? "select" : "input", options.multiline ? "m-field__area" : "m-field__input");
        input.id = instanceId + "-" + name;
        input.dataset.focusKey = "field-" + name;
        lab.htmlFor = input.id;
        if (options.options) {
          options.options.forEach(function(x) {
            var opt = node("option", "", x.label);
            opt.value = x.id;
            input.appendChild(opt);
          });
        } else if (options.multiline) {
          input.rows = options.rows || 3;
        } else {
          input.type = options.type || "text";
          if (options.inputmode) {
            input.inputMode = options.inputmode;
            if (["decimal", "numeric"].indexOf(options.inputmode) >= 0) {
              input.classList.add("m-field__input--num");
              input.dir = "ltr";
            }
          }
        }
        if (ui.draft[name] === void 0) ui.draft[name] = options.value == null ? "" : String(options.value);
        input.value = ui.draft[name];
        input.disabled = !ctx.editable();
        if (options.maxLength) input.maxLength = options.maxLength;
        if (options.enterKeyHint) input.setAttribute("enterkeyhint", options.enterKeyHint);
        ctx.on(input, options.options ? "change" : "input", function() {
          ui.draft[name] = input.value;
          box.querySelectorAll("[data-product-field-error]").forEach(function(e) {
            e.remove();
          });
          input.removeAttribute("aria-invalid");
          input.removeAttribute("aria-describedby");
          box.classList.remove("has-error");
          if (!root.querySelector('[aria-invalid="true"]')) root.querySelectorAll("[data-product-validation]").forEach(function(e) {
            e.remove();
          });
        });
        wrap.appendChild(input);
        if (options.unit) wrap.appendChild(node("span", "m-field__unit", options.unit));
        box.append(lab, wrap);
        parent.appendChild(box);
        return input;
      },
      fieldsPayload: function(required) {
        var data = copy(ui.draft), missing = (required || []).filter(function(name) {
          return !String(data[name] || "").trim();
        });
        root.querySelectorAll("[data-product-validation],[data-product-field-error]").forEach(function(e) {
          e.remove();
        });
        root.querySelectorAll('[data-focus-key^="field-"][aria-invalid="true"]').forEach(function(el) {
          el.removeAttribute("aria-invalid");
          el.removeAttribute("aria-describedby");
          el.closest(".m-field").classList.remove("has-error");
        });
        if (missing.length) {
          var error = note(root, L("form.requiredFields", root), "", "error");
          error.dataset.productValidation = "";
          error.id = instanceId + "-validation";
          var heading = root.querySelector(":scope > header,:scope > h2");
          if (heading) heading.after(error);
          else root.prepend(error);
          var first = null;
          root.querySelectorAll('[data-focus-key^="field-"]').forEach(function(el) {
            if (missing.indexOf(el.dataset.focusKey.slice(6)) < 0) return;
            var box = el.closest(".m-field"), label = box.querySelector("label");
            var message = node("p", "m-field__msg is-visible", L("form.missingFieldPrefix", label) + (label ? label.textContent : L("form.missingFieldFallback", label)));
            message.id = el.id + "-required";
            message.dataset.productFieldError = "";
            box.appendChild(message);
            el.setAttribute("aria-invalid", "true");
            el.setAttribute("aria-describedby", message.id);
            box.classList.add("has-error");
            if (!first) first = el;
          });
          if (first) first.focus();
          return false;
        }
        data.files = ui.files.slice();
        return data;
      },
      media: function(parent, images, fit, preview) {
        if (!images || !images.length) {
          parent.appendChild(node("div", "m-product__media-empty", L("media.unavailable", parent)));
          return;
        }
        var carousel = node("div", "m-carousel m-product__gallery");
        carousel.classList.toggle("m-product__gallery--preview", !!preview);
        carousel.dataset.carousel = "";
        carousel.dataset.carouselLabel = L("media.carouselLabel", carousel);
        carousel.setAttribute("role", "group");
        carousel.setAttribute("aria-label", L("media.carouselLabel", carousel));
        var viewport = node("div", "m-carousel__viewport");
        viewport.dataset.viewport = "";
        var track = node("ul", "m-carousel__track");
        track.dataset.track = "";
        images.forEach(function(image, index) {
          var li = node("li", "m-carousel__slide"), card = node("div", "m-carousel__card"), src = safeImage(image.src);
          li.dataset.carouselSlide = "";
          li.dataset.cardLabel = image.alt || L("media.cardLabelPrefix", li) + (index + 1);
          if (src) {
            var img = node("img", "m-product__media");
            img.src = src;
            img.alt = image.alt || L("media.imageAltFallback", img);
            img.loading = "lazy";
            img.decoding = "async";
            img.style.objectFit = fit === "contain" ? "contain" : "cover";
            ctx.on(img, "error", function() {
              img.replaceWith(node("div", "m-product__media-empty", L("media.imageError", img)));
            });
            card.appendChild(img);
          } else {
            card.appendChild(node("div", "m-product__media-empty", L("media.linkUnavailable", card)));
          }
          li.appendChild(card);
          track.appendChild(li);
        });
        viewport.appendChild(track);
        carousel.appendChild(viewport);
        if (images.length > 1) {
          var controls = node("div", "m-product__actions");
          ["prev", "next"].forEach(function(dir) {
            var b = node("button", "m-btn m-btn--secondary", dir === "prev" ? L("media.prev") : L("media.next"));
            b.type = "button";
            b.dataset[dir] = "";
            controls.appendChild(b);
          });
          var count = node("span", "m-product__secondary");
          count.dataset.status = "";
          controls.appendChild(count);
          carousel.appendChild(controls);
        }
        parent.appendChild(carousel);
        if (globalApi("Carousel")) {
          globalApi("Carousel").init(carousel);
          ctx.cleanup(function() {
            globalApi("Carousel").destroy(carousel);
          });
        }
      },
      attachments: function(parent, required) {
        var field = node("div", "m-field"), lab = node("span", "m-field__label", L("attachments.label", field));
        var input = node("input", "m-product__file");
        var choose = node("button", "m-btn m-btn--secondary", model.attachmentSelection === "append" ? L("attachments.addMore") : ui.files.length ? L("attachments.replaceSelection") : L("attachments.choose"));
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.id = instanceId + "-files";
        input.hidden = true;
        input.tabIndex = -1;
        input.disabled = !ctx.editable();
        choose.type = "button";
        choose.disabled = !ctx.editable();
        choose.dataset.focusKey = "choose-files";
        ctx.on(choose, "click", function() {
          if (ctx.editable()) input.click();
        });
        field.append(lab, input, choose);
        parent.appendChild(field);
        ctx.on(input, "change", function() {
          var files = Array.from(input.files || []);
          if (files.some(function(f) {
            return !f.type.startsWith("image/") || model.maxImageBytes && f.size > model.maxImageBytes;
          })) {
            note(parent, L("attachments.fileError", parent), L("attachments.fileErrorDetail", parent), "error");
            return;
          }
          var selection2 = model.attachmentSelection === "append" ? ui.files.concat(files) : files;
          releaseFiles();
          ui.files = selection2;
          ui.urls = selection2.map(function(f) {
            return URL.createObjectURL(f);
          });
          render8();
        });
        if (ui.files.length) {
          var names = node("ul", "m-product__filenames");
          ui.files.forEach(function(f, index) {
            var item = node("li");
            item.appendChild(node("bdi", "", f.name));
            if (ui.files.length > 1) {
              var remove = node("button", "m-btn m-btn--light", L("attachments.remove", remove));
              remove.type = "button";
              remove.disabled = !ctx.editable();
              remove.setAttribute("aria-label", L("attachments.removeAriaPrefix", remove) + f.name);
              remove.dataset.focusKey = "remove-file-" + index;
              ctx.on(remove, "click", function() {
                if (!ctx.editable()) return;
                URL.revokeObjectURL(ui.urls[index]);
                ui.urls.splice(index, 1);
                ui.files.splice(index, 1);
                remove.dataset.focusKey = "choose-files";
                render8();
              });
              item.appendChild(remove);
            }
            names.appendChild(item);
          });
          field.appendChild(names);
          ctx.media(parent, ui.files.map(function(f, i) {
            return { src: ui.urls[i], alt: f.name };
          }), "contain", true);
          var clear = node("button", "m-btn m-btn--light", L("attachments.removeAll"));
          clear.type = "button";
          clear.disabled = !ctx.editable();
          ctx.on(clear, "click", function() {
            releaseFiles();
            render8();
          });
          parent.appendChild(clear);
        }
        if (required) parent.appendChild(node("p", "m-product__secondary", L("attachments.requiredNotice", parent)));
      },
      timeline: function(parent, items) {
        var list = node("ol", "m-product__timeline");
        (items || []).forEach(function(item) {
          var row = node("li");
          if (item.current) row.setAttribute("aria-current", "step");
          row.appendChild(node("strong", "", item.label));
          if (item.time) row.appendChild(node("bdi", "m-product__secondary", item.time));
          if (item.detail) row.appendChild(node("p", "m-product__secondary", item.detail));
          list.appendChild(row);
        });
        parent.appendChild(list);
      }
    };
    var phase = Object.prototype.hasOwnProperty.call(phases, model.phase) ? model.phase : "uncertain";
    if (forbidden.indexOf(phase) >= 0) {
      note(root, phases[phase], L("shell.previousContextHidden", root), "warning");
      if (permission("reauth")) ctx.button(root, "reauth", L("shell.reauth", root), {});
      if (phase === "denied" && permission("choose-context")) ctx.button(root, "choose-context", L("shell.chooseContext", root), {});
    } else if (!scopeKey) {
      note(root, L("shell.noScopeTitle", root), L("shell.noScopeDetail", root), "warning");
    } else if (model.scope.kind === "driver" && (type8 === "market" || type8 === "manage" || type8 === "review" && model.mode !== "report" || type8 !== "context" && ["manage", "market"].indexOf(model.destination) >= 0)) {
      note(root, L("shell.driverScopeTitle", root), L("shell.driverScopeDetail", root), "warning");
    } else if (!permission("view") || type8 !== "context" && type8 !== "state" && key(model.dataContext) !== scopeKey) {
      note(root, L("shell.noPermission", root), "", "warning");
    } else {
      if (["offline", "weak", "local"].indexOf(model.connection) >= 0) {
        note(root, model.connection === "offline" ? L("connection.offline", root) : model.connection === "local" ? L("connection.local", root) : L("connection.weak", root), model.destination === "manage" ? L("connection.manageNotice", root) : L("connection.genericNotice", root), "warning");
      }
      if (pending) {
        note(root, phases.pending, "", "info");
      } else if (phase !== "ready") {
        note(root, phases[phase], model.phaseDetail || "", phase === "error" ? "error" : phase === "success" ? "success" : "info");
      }
      if (phase !== "loading" && (phase !== "empty" || type8 === "assistant" || type8 === "manage")) renderers.get(type8)(ctx);
      else if (phase === "empty" && model.emptyActionLabel) ctx.button(root, "create", model.emptyActionLabel, {});
      if (["uncertain", "conflict"].indexOf(phase) >= 0 && permission("recheck") && !root.querySelector('[data-product-action="recheck"]')) ctx.button(root, "recheck", L("stateCard.recheck", root), {});
    }
    if (globalApi("Fields")) {
      globalApi("Fields").init(root);
      cleanups.push(function() {
        globalApi("Fields").disconnect(root);
      });
    }
    if (suppressFocus && active) {
      root.focus({ preventScroll: true });
    } else if (focusKey) {
      var found = Array.from(root.querySelectorAll("[data-focus-key]")).find(function(el) {
        return el.dataset.focusKey === focusKey && !el.disabled;
      });
      if (found) {
        found.focus({ preventScroll: true });
        if (selection && found.setSelectionRange) try {
          found.setSelectionRange(selection[0], selection[1]);
        } catch (_) {
        }
      } else root.focus({ preventScroll: true });
    }
    suppressFocus = false;
  }
  function replace(next) {
    if (destroyed) return false;
    var previous = model && key(model.scope);
    var nextModel = copy(next || {});
    nextModel.phase = nextModel.phase || "ready";
    if (!Object.prototype.hasOwnProperty.call(phases, nextModel.phase)) nextModel.phase = "uncertain";
    nextModel.connection = nextModel.connection || "online";
    if (["online", "offline", "weak", "local"].indexOf(nextModel.connection) < 0) nextModel.connection = "offline";
    var purge = previous !== key(nextModel.scope) || draftOwner(model) !== draftOwner(nextModel) || visibilityRevoked(model, nextModel) || forbidden.indexOf(nextModel.phase) >= 0 || nextModel.clearDraft === true || !Array.isArray(nextModel.permissions) || nextModel.permissions.indexOf("view") < 0;
    disposeConfirmation();
    epoch++;
    pending = null;
    if (purge) {
      ui.presentation = /* @__PURE__ */ Object.create(null);
      ui.presentationGeneration++;
      releaseFiles();
      ui.draft = /* @__PURE__ */ Object.create(null);
      suppressFocus = true;
    }
    model = nextModel;
    render8();
    return true;
  }
  var api = {
    root,
    replace,
    /* العقد الموحد (الجولة الثانية R4): update(model) = replace نفسها —
       استبدال النموذج وإعادة التصيير بلا إعادة تركيب. */
    update: replace,
    resolve: function(token, next) {
      if (destroyed || !pending || !token || ["instanceId", "generation", "requestId", "contextKey"].some(function(k) {
        return pending.token[k] !== token[k];
      })) return false;
      var nextKey = key(next && next.scope);
      if (nextKey !== key(model.scope) && !(pending.action === "switch-context" && nextKey && nextKey === key(pending.payload.targetScope))) return false;
      return replace(next);
    },
    getState: function() {
      return destroyed ? null : { scope: copy(model.scope || null), phase: model.phase, pending: pending ? copy(pending.token) : null };
    },
    destroy: function() {
      if (destroyed) return;
      destroyed = true;
      epoch++;
      pending = null;
      ui.presentation = /* @__PURE__ */ Object.create(null);
      ui.presentationGeneration++;
      disposeConfirmation();
      stopRender();
      releaseFiles();
      ui.draft = /* @__PURE__ */ Object.create(null);
      root.replaceChildren();
      root.removeAttribute("aria-busy");
      root.removeAttribute("data-product-type");
      root.removeAttribute("data-conversation-layout");
      instances.delete(root);
    }
  };
  instances.set(root, { type: type8, api });
  replace(value);
  return api;
}
function init(root, model) {
  var type8 = model && model.type;
  applyInstanceLabels(root, model);
  return withLabels2(root, function() {
    return mount(root, type8, model);
  });
}
function getInstance(root) {
  var entry = root && instances.get(root);
  return entry ? entry.api : null;
}
function destroy(root) {
  var entry = root && instances.get(root);
  if (entry) entry.api.destroy();
}
function setLabels2(partial) {
  setLabels("product-context", partial);
}

// components/product-context/context.js
var MICRO_LABELS_FAMILY2 = "product-context";
function L2(key2, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY2) || currentInstanceLabels(MICRO_LABELS_FAMILY2);
  if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
  return getLabel(MICRO_LABELS_FAMILY2, key2);
}
var type = "context";
function render(ctx) {
  var model = ctx.model, node2 = ctx.node, root = ctx.root;
  var contexts = model.contexts || [];
  var keys = contexts.map(function(item) {
    return ctx.key(item.scope);
  });
  var current = contexts.find(function(item) {
    return item.scope && ctx.key(item.scope) === ctx.key(model.scope);
  });
  root.appendChild(node2("h2", "m-product__title", model.accountLabel || L2("context.accountFallback", root)));
  if (!current) {
    ctx.note(root, L2("context.unavailableTitle", root), L2("context.unavailableDetail", root), "warning");
    return;
  }
  if (keys.some(function(k, i) {
    return !k || keys.indexOf(k) !== i;
  })) {
    ctx.note(root, L2("context.invalidListTitle", root), L2("context.unavailableDetail", root), "warning");
    return;
  }
  var label = node2("label", "m-field__label", L2("context.selectLabel", select)), select = node2("select", "m-field__input");
  select.id = ctx.uid + "-context";
  select.dataset.focusKey = "context-select";
  label.htmlFor = select.id;
  contexts.forEach(function(item) {
    var option = node2("option", "", item.label);
    option.value = ctx.key(item.scope);
    select.appendChild(option);
  });
  select.value = ctx.key(model.scope);
  select.disabled = !ctx.can("switch-context");
  var field = node2("div", "m-field"), control = node2("div", "m-field__control");
  field.dataset.microField = "";
  control.appendChild(select);
  field.append(label, control);
  root.appendChild(field);
  ctx.on(select, "change", function() {
    var chosen = select.value;
    select.value = ctx.key(model.scope);
    var item = contexts.find(function(x) {
      return ctx.key(x.scope) === chosen;
    });
    if (item) ctx.request("switch-context", { contextId: item.scope.contextId, targetScope: structuredClone(item.scope) });
  });
  var names = { manage: L2("context.destination.manage"), market: L2("context.destination.market"), delivery: L2("context.destination.delivery"), ask: "Ask Micro" };
  var nav = node2("nav", "m-product__destinations");
  nav.setAttribute("aria-label", L2("context.navLabel", nav));
  ["manage", "market", "delivery", "ask"].filter(function(id) {
    return (current.destinations || []).indexOf(id) >= 0 && (model.scope.kind !== "driver" || id === "delivery" || id === "ask");
  }).forEach(function(id) {
    var button = ctx.button(nav, "navigate", names[id], { destination: id });
    button.dataset.destination = id;
    button.dataset.focusKey = "destination-" + id;
    if (model.destination === id) button.setAttribute("aria-current", "page");
  });
  root.appendChild(nav);
  if (!nav.children.length) ctx.note(root, L2("context.noDestinationsTitle", nav), L2("context.noDestinationsDetail", nav), "warning");
}
register(type, render);

// components/product-context/operation.js
var MICRO_LABELS_FAMILY3 = "product-context";
function L3(key2, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY3) || currentInstanceLabels(MICRO_LABELS_FAMILY3);
  if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
  return getLabel(MICRO_LABELS_FAMILY3, key2);
}
var type2 = "state";
function render2(ctx) {
  var model = ctx.model, node2 = ctx.node, root = ctx.root;
  root.appendChild(node2("h2", "m-product__title", model.title || L3("operation.title", root)));
  if (model.reference) {
    var reference = node2("p", "m-product__secondary", L3("operation.referencePrefix", reference));
    reference.appendChild(node2("bdi", "", model.reference));
    root.appendChild(reference);
  }
  if (model.detail) root.appendChild(node2("p", "", model.detail));
  var actions = node2("div", "m-product__actions");
  [
    { id: "recheck", label: L3("operation.actions.recheck") },
    { id: "retry", label: L3("operation.actions.retry") }
  ].forEach(function(action) {
    if ((model.permissions || []).indexOf(action.id) >= 0) {
      ctx.button(actions, action.id, action.label, { reference: model.reference || null }, { local: action.local });
    }
  });
  root.appendChild(actions);
  if (model.steps) ctx.timeline(root, model.steps);
}
register(type2, render2);

// components/product-context/market.js
var MICRO_LABELS_FAMILY4 = "product-context";
function L4(key2, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY4) || currentInstanceLabels(MICRO_LABELS_FAMILY4);
  if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
  return getLabel(MICRO_LABELS_FAMILY4, key2);
}
var type3 = "market";
function render3(ctx) {
  var model = ctx.model, node2 = ctx.node, root = ctx.root;
  var head = node2("header", "m-product__header");
  root.appendChild(head);
  head.appendChild(node2("h2", "m-product__title", model.mode === "editor" ? L4("market.editorTitle", head) : model.mode === "search" || model.mode === "results" ? L4("market.searchTitle", head) : model.title || L4("market.listingTitle", head)));
  function searchHeader() {
    ctx.field(root, "query", L4("market.searchField", root), { value: model.query, type: "search" });
    (model.filters || []).forEach(function(filter) {
      ctx.field(root, filter.id, filter.label, { options: filter.options, value: filter.value });
    });
    ctx.button(root, "search", L4("market.searchAction", root), function() {
      return ctx.fieldsPayload([]);
    });
    if (model.resultLabel) root.appendChild(node2("p", "m-product__secondary", model.resultLabel));
  }
  function thumbEmpty(label) {
    var el = node2("div", "m-product__thumb m-product__thumb--empty");
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", label);
    return el;
  }
  if (model.mode === "search") {
    searchHeader();
    return;
  }
  if (model.mode === "results") {
    searchHeader();
    if (model.phase === "error") {
      if ((model.permissions || []).indexOf("retry") >= 0) ctx.button(root, "retry", L4("operation.actions.retry", root), {});
      return;
    }
    if (model.resultsState === "no-ads") ctx.note(root, L4("market.noAdsTitle", root), L4("market.noAdsDetail", root), "info");
    else if (model.resultsState === "no-results") ctx.note(root, L4("market.noResultsTitle", root), L4("market.noResultsDetail", root), "info");
    else {
      var results = Array.isArray(model.results) ? model.results : [];
      if (results.length) {
        var section = node2("section", "m-product__section");
        section.appendChild(node2("h3", "m-product__title", L4("market.resultsTitle", section)));
        var list = node2("ul", "m-operational-list");
        results.forEach(function(item) {
          if (!item) return;
          var row = node2("li", "m-row m-row--operational");
          if (item.image) {
            var src = ctx.safeImage(item.image.src);
            if (src) {
              var img = node2("img", "m-product__thumb");
              img.src = src;
              img.alt = item.image.alt || L4("media.unavailable", img);
              img.loading = "lazy";
              img.decoding = "async";
              ctx.on(img, "error", function() {
                img.replaceWith(thumbEmpty(L4("media.imageError", img)));
              });
              row.appendChild(img);
            } else {
              row.appendChild(thumbEmpty(L4("media.unavailable", row)));
            }
          }
          var text2 = node2("span", "m-row__text");
          text2.appendChild(node2("strong", "m-row__title", item.title || L4("common.unavailable", text2)));
          if (item.sellerLabel) text2.appendChild(node2("span", "m-row__subtitle", item.sellerLabel));
          row.appendChild(text2);
          if (item.statusLabel) {
            var meta = node2("div", "m-row__meta");
            meta.appendChild(node2("span", "m-badge m-badge--info", item.statusLabel));
            row.appendChild(meta);
          }
          var reading = node2("span", "m-row__reading");
          var price2 = node2("bdi", "", item.price == null || String(item.price).trim() === "" ? L4("common.unavailable") : item.price);
          price2.dir = "ltr";
          reading.append(price2, document.createTextNode(" " + (item.unit || model.unit || L4("common.unitFallback"))));
          row.appendChild(reading);
          list.appendChild(row);
        });
        if (list.children.length) {
          section.appendChild(list);
          root.appendChild(section);
        }
      }
    }
    return;
  }
  if (model.mode === "editor") {
    ctx.field(root, "title", L4("market.titleField", root), { value: model.title, maxLength: model.titleMaxLength });
    ctx.field(root, "description", L4("market.descriptionField", root), { value: model.description, multiline: true });
    ctx.field(root, "price", L4("market.priceField", root), { value: model.price, inputmode: "decimal", unit: model.unit || L4("market.priceUnitFallback", root) });
    if (model.images && model.images.length) ctx.media(root, model.images, "contain", true);
    ctx.attachments(root, false);
    var actions = node2("div", "m-product__actions m-btn-group m-btn-group--pair");
    root.appendChild(actions);
    ["publish", "save-draft"].forEach(function(id) {
      if ((model.permissions || []).indexOf(id) >= 0) {
        ctx.button(
          actions,
          id,
          id === "publish" ? L4("market.publishAction", actions) : L4("market.saveDraftAction", actions),
          function() {
            return ctx.fieldsPayload(id === "publish" ? model.requiredFields || [] : []);
          },
          {
            confirm: id === "publish",
            primary: id === "publish",
            description: function(data) {
              return L4("market.publishConfirmPrefix") + data.title + L4("market.publishConfirmPrice") + data.price + " " + (model.unit || L4("common.unitFallback")) + ".";
            }
          }
        );
      }
    });
    if (actions.children.length < 2) actions.classList.remove("m-btn-group--pair");
    return;
  }
  if (model.price !== null && model.price !== void 0) {
    var price = node2("p", "m-product__value");
    var number = node2("bdi", "", model.price);
    number.dir = "ltr";
    price.append(number, document.createTextNode(" " + (model.unit || L4("common.unitFallback"))));
    head.appendChild(price);
  }
  if (model.sellerLabel) head.appendChild(node2("p", "m-product__secondary", model.sellerLabel));
  if (model.statusLabel) head.appendChild(node2("span", "m-badge m-badge--info", model.statusLabel));
  ctx.media(root, model.images, model.fit);
  if (model.reason) ctx.note(root, L4("market.reviewNoteTitle", root), model.reason, "warning");
  var cardActions = node2("div", "m-product__actions");
  root.appendChild(cardActions);
  [{ id: "edit", label: L4("market.editAction") }, { id: "report", label: L4("market.reportAction") }].forEach(function(action) {
    if ((model.permissions || []).indexOf(action.id) >= 0) {
      ctx.button(cardActions, action.id, action.label, { listingId: model.id, revision: model.revision }, { confirm: action.confirm, description: L4("market.reportConfirm") });
    }
  });
}
register(type3, render3);

// components/product-context/delivery.js
var MICRO_LABELS_FAMILY5 = "product-context";
function L5(key2, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY5) || currentInstanceLabels(MICRO_LABELS_FAMILY5);
  if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
  return getLabel(MICRO_LABELS_FAMILY5, key2);
}
var type4 = "delivery";
function render4(ctx) {
  var model = ctx.model, node2 = ctx.node, root = ctx.root;
  var head = node2("header", "m-product__header");
  root.appendChild(head);
  head.appendChild(node2("h2", "m-product__title", model.title || L5("delivery.title", head)));
  if (model.statusLabel) head.appendChild(node2("span", "m-badge m-badge--info", model.statusLabel));
  if (model.mode !== "request" && model.visibility && model.visibility.addresses) {
    var addresses = node2("dl", "m-product__comparison");
    [[L5("delivery.pickup"), model.pickup], [L5("delivery.dropoff"), model.dropoff]].forEach(function(pair) {
      addresses.append(node2("dt", "", pair[0]), node2("dd", "", pair[1] || L5("common.unavailable")));
    });
    root.appendChild(addresses);
  } else if (!(model.visibility && model.visibility.addresses)) {
    root.appendChild(node2("p", "m-product__secondary", L5("delivery.addressesUnavailable", root)));
  }
  if (model.visibility && model.visibility.contact && model.contact) root.appendChild(node2("bdi", "", model.contact));
  if (model.mode === "request") {
    ctx.field(root, "pickup", L5("delivery.pickupField", root), { value: model.visibility && model.visibility.addresses ? model.pickup : "" });
    ctx.field(root, "dropoff", L5("delivery.dropoffField", root), { value: model.visibility && model.visibility.addresses ? model.dropoff : "" });
    ctx.field(root, "note", L5("delivery.noteField", root), { multiline: true, value: model.note });
    ctx.button(root, "request-delivery", L5("delivery.requestAction", root), function() {
      return ctx.fieldsPayload(model.requiredFields || []);
    }, { confirm: true, description: L5("delivery.requestConfirm", root) });
  } else if (model.mode === "offer") {
    var quote = node2("section", "m-product__section m-product__quote");
    root.appendChild(quote);
    var price = node2("p", "m-product__value");
    var number = node2("bdi", "", model.amount == null ? L5("common.unavailable") : model.amount);
    number.dir = "ltr";
    price.append(number, document.createTextNode(" " + (model.unit || L5("common.unitFallback"))));
    quote.appendChild(price);
    quote.appendChild(node2("p", "m-product__secondary", model.validityLabel || L5("delivery.validityFallback", quote)));
    var actions = node2("div", "m-product__actions m-btn-group m-btn-group--pair"), more = node2("div", "m-btn-group__more");
    root.appendChild(actions);
    ["accept", "decline", "assign"].forEach(function(id) {
      if ((model.permissions || []).indexOf(id) >= 0) {
        ctx.button(
          id === "assign" ? more : actions,
          id,
          { accept: L5("delivery.quote.accept", actions), decline: L5("delivery.quote.decline", actions), assign: L5("delivery.quote.assign", actions) }[id],
          { requestId: model.id, offerId: model.offerId, revision: model.revision },
          { confirm: true, primary: id === "accept", description: L5("delivery.quote.confirmPrefix") + String(model.amount == null ? L5("common.unavailablePlain") : model.amount) + " " + (model.unit || "") + "." }
        );
      }
    });
    if (more.children.length) actions.appendChild(more);
    if (actions.querySelectorAll(":scope > .m-btn").length < 2) actions.classList.remove("m-btn-group--pair");
  } else if (model.mode === "change") {
    var diff = node2("dl", "m-product__comparison");
    diff.append(node2("dt", "", L5("delivery.change.current")), node2("dd", "", model.currentText || L5("common.unavailable")), node2("dt", "", L5("delivery.change.proposed")), node2("dd", "", model.proposedText || L5("common.unavailable")));
    root.appendChild(diff);
    ctx.timeline(root, (model.parties || []).map(function(party) {
      return { label: party.label, detail: party.statusLabel || L5("delivery.partyStatusFallback") };
    }));
    ctx.button(root, "request-change", L5("delivery.change.requestAction", root), { requestId: model.id, revision: model.revision }, { confirm: true, description: L5("delivery.change.confirm", root) });
  } else if (model.mode === "proof") {
    if (model.requirementsLabel) root.appendChild(node2("p", "", model.requirementsLabel));
    ctx.field(root, "note", L5("delivery.proof.noteField", root), { multiline: true });
    ctx.attachments(root, model.attachmentRequired);
    ctx.button(root, "submit-proof", model.proofKind === "return" ? L5("delivery.proof.returnAction", root) : L5("delivery.proof.deliveryAction", root), function() {
      if (model.attachmentRequired && !ctx.ui.files.length) {
        ctx.note(root, L5("delivery.proof.attachmentRequired", root), "", "error");
        return false;
      }
      var payload = ctx.fieldsPayload(model.requiredFields || []);
      if (payload) {
        payload.requestId = model.id;
        payload.proofKind = model.proofKind || "delivery";
        payload.revision = model.revision;
      }
      return payload;
    }, { confirm: true, description: L5("delivery.proof.confirm") });
  } else {
    ctx.timeline(root, model.steps);
    if ((model.permissions || []).indexOf("recheck") >= 0) ctx.button(root, "recheck", L5("delivery.updateStatusAction", root), { requestId: model.id });
  }
}
register(type4, render4);

// components/product-context/assistant.js
var MICRO_LABELS_FAMILY6 = "product-context";
function L6(key2, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY6) || currentInstanceLabels(MICRO_LABELS_FAMILY6);
  if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
  return getLabel(MICRO_LABELS_FAMILY6, key2);
}
var askSymbolUrl = null;
function askSymbol() {
  if (!askSymbolUrl) {
    askSymbolUrl = new URL("../assets/brand/micro-logo/v2/variants/full-color/micro-symbol.svg", scriptBase()).href;
  }
  return askSymbolUrl;
}
var kinds = { "follow-up": "follow-up", open: "open-resource", execute: "execute" };
function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}
var type5 = "assistant";
function render5(ctx) {
  var model = ctx.model, node2 = ctx.node, root = ctx.root;
  var actionStatus = 0;
  var header = node2("header", "m-product__section m-assistant__header");
  var identity = node2("div", "m-assistant__identity");
  var logo = node2("img", "m-assistant__symbol");
  logo.src = askSymbol();
  logo.alt = "";
  logo.width = 24;
  logo.height = 24;
  identity.append(logo, node2("h2", "m-product__title", "Ask Micro"));
  header.append(identity, node2("p", "m-product__secondary", model.scope.label || model.scope.contextId));
  root.appendChild(header);
  var generation = ctx.ui.presentationGeneration, saved = ctx.ui.presentation.ask || null;
  var messages = model.phase === "empty" ? [] : model.messages || [];
  var log = node2("div", "m-product__log");
  log.id = ctx.uid + "-log";
  log.dataset.focusKey = "assistant-log";
  log.setAttribute("role", "log");
  log.setAttribute("aria-label", L6("assistant.logLabel", log));
  log.setAttribute("aria-relevant", "additions text");
  log.setAttribute("aria-busy", String(!!model.replyPending));
  messages.forEach(function(message) {
    var bubble = node2("article", "m-product__message");
    var speaker = ["user", "assistant"].indexOf(message.speaker) >= 0 ? message.speaker : "system";
    bubble.dataset.speaker = speaker;
    if (text(message.id) && messages.filter(function(x) {
      return x.id === message.id;
    }).length === 1) bubble.dataset.messageId = message.id;
    bubble.append(
      node2("strong", "m-product__secondary", speaker === "user" ? L6("assistant.userSpeaker") : speaker === "assistant" ? "Ask Micro" : L6("assistant.noteSpeaker")),
      node2("p", "", message.text)
    );
    if (message.stateLabel) bubble.appendChild(node2("p", "m-product__secondary", message.stateLabel));
    if (message.id && (model.permissions || []).indexOf("retry") >= 0 && message.retryable) {
      ctx.button(bubble, "retry", L6("assistant.retryAction", bubble), { messageId: message.id }, { focusKey: "retry-" + message.id });
    }
    if (speaker === "assistant" && text(message.id) && messages.filter(function(x) {
      return x.id === message.id;
    }).length === 1) {
      var actions = Array.isArray(message.actions) ? message.actions : [];
      var row = node2("div", "m-product__actions m-assistant__actions");
      var reasons = /* @__PURE__ */ Object.create(null), reasonNodes = [];
      actions.forEach(function(action) {
        if (!action || !Object.prototype.hasOwnProperty.call(kinds, action.kind) || !text(action.id) || !text(action.label) || !text(action.revision) || actions.filter(function(x) {
          return x && x.id === action.id;
        }).length !== 1) return;
        if (action.kind === "execute" && !text(action.summary)) return;
        var state = action.state === void 0 ? "ready" : action.state;
        var disabled = state !== "ready" || !!model.replyPending;
        var id = kinds[action.kind];
        var button = ctx.button(
          row,
          id,
          action.label,
          { messageId: message.id, actionId: action.id, revision: action.revision },
          {
            confirm: action.kind === "execute",
            description: action.summary,
            focusKey: "message-action-" + message.id + "-" + action.id,
            disabled,
            primary: action.emphasis === "primary" && actions.filter(function(x) {
              return x && x.emphasis === "primary";
            }).length === 1
          }
        );
        if (state !== "ready") {
          var reason = { expired: L6("assistant.proposalExpired"), completed: L6("assistant.proposalCompleted"), unavailable: L6("assistant.proposalUnavailable") }[state] || L6("assistant.proposalUnavailable");
          var status = reasons[reason];
          if (!status) {
            status = node2("span", "m-product__secondary", reason);
            status.id = ctx.uid + "-action-status-" + ++actionStatus;
            reasons[reason] = status;
            reasonNodes.push(status);
          }
          button.setAttribute("aria-describedby", status.id);
        }
      });
      reasonNodes.forEach(function(item) {
        row.appendChild(item);
      });
      if (row.children.length) bubble.appendChild(row);
    }
    log.appendChild(bubble);
  });
  if (!log.children.length) log.appendChild(node2("p", "m-product__secondary", L6("assistant.emptyLog", log)));
  root.appendChild(log);
  if (model.replyPending) {
    var activity = node2("div", "m-assistant__activity");
    activity.setAttribute("role", "status");
    var dot = node2("span", "m-assistant__activity-dot");
    dot.setAttribute("aria-hidden", "true");
    activity.append(dot, node2("span", "", model.activity === "searching" ? L6("assistant.searchingStatus", activity) : L6("assistant.preparingStatus", activity)));
    root.appendChild(activity);
  }
  var last = messages[messages.length - 1];
  var lastKey = last ? String(last.id || "") + "\n" + String(last.text || "") : "";
  var unread = !!(messages.length && saved && !saved.atEnd && (saved.unread || messages.length > saved.count || messages.length === saved.count && saved.lastKey !== lastKey));
  var newer = node2("button", "m-btn m-btn--light m-assistant__new", L6("assistant.newMessagesAction", newer));
  newer.type = "button";
  newer.hidden = !unread;
  newer.setAttribute("aria-controls", log.id);
  root.appendChild(newer);
  function atEnd() {
    return log.scrollHeight - log.clientHeight - log.scrollTop < 24;
  }
  ctx.on(newer, "click", function() {
    log.scrollTop = log.scrollHeight;
    unread = false;
    newer.hidden = true;
    log.focus({ preventScroll: true });
  });
  log.tabIndex = 0;
  ctx.on(log, "scroll", function() {
    if (atEnd()) {
      unread = false;
      newer.hidden = true;
    }
  });
  if (model.proposal) {
    var box = node2("section", "m-product__surface");
    box.append(node2("h3", "m-product__title", L6("assistant.proposalTitle")), node2("p", "", model.proposal.summary));
    ctx.button(box, "execute", model.proposal.label || L6("assistant.proposalActionFallback"), { proposalId: model.proposal.id, revision: model.proposal.revision }, { confirm: true, description: model.proposal.summary });
    root.appendChild(box);
  }
  var composer = node2("div", "m-product__section m-assistant__composer");
  var input = ctx.field(composer, "message", L6("assistant.messageField"), { multiline: true, rows: 1, enterKeyHint: "send" });
  ctx.button(composer, "send", L6("assistant.sendAction"), function() {
    return ctx.fieldsPayload(["message"]);
  }, { primary: true, disabled: !!model.replyPending });
  root.appendChild(composer);
  function grow() {
    var follow = atEnd();
    input.style.blockSize = "auto";
    input.style.blockSize = input.scrollHeight + "px";
    if (follow) log.scrollTop = log.scrollHeight;
  }
  ctx.on(input, "input", grow);
  grow();
  if (!saved || saved.atEnd) log.scrollTop = log.scrollHeight;
  else {
    log.scrollTop = saved.top;
    var anchor = Array.from(log.querySelectorAll("[data-message-id]")).find(function(el) {
      return el.dataset.messageId === saved.anchor;
    });
    if (anchor) log.scrollTop += anchor.getBoundingClientRect().top - log.getBoundingClientRect().top - saved.offset;
  }
  if (atEnd()) {
    unread = false;
    newer.hidden = true;
  }
  ctx.cleanup(function() {
    if (generation !== ctx.ui.presentationGeneration) return;
    var top = log.getBoundingClientRect().top;
    var anchor2 = Array.from(log.querySelectorAll("[data-message-id]")).find(function(el) {
      return el.getBoundingClientRect().bottom > top;
    });
    ctx.ui.presentation.ask = {
      top: log.scrollTop,
      atEnd: atEnd(),
      anchor: anchor2 ? anchor2.dataset.messageId : null,
      offset: anchor2 ? anchor2.getBoundingClientRect().top - top : 0,
      count: messages.length,
      lastKey,
      unread
    };
  });
}
register(type5, render5);

// components/product-context/review.js
var MICRO_LABELS_FAMILY7 = "product-context";
function L7(key2, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY7) || currentInstanceLabels(MICRO_LABELS_FAMILY7);
  if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
  return getLabel(MICRO_LABELS_FAMILY7, key2);
}
var type6 = "review";
function render6(ctx) {
  var model = ctx.model, node2 = ctx.node, root = ctx.root;
  root.appendChild(node2("h2", "m-product__title", model.mode === "report" ? L7("review.reportTitle", root) : model.mode === "queue" ? model.title || L7("review.queueTitle", root) : model.title || L7("review.itemTitle", root)));
  if (model.mode === "report") {
    if (model.subjectLabel) root.appendChild(node2("p", "", model.subjectLabel));
    if (model.statusLabel) root.appendChild(node2("span", "m-badge m-badge--info", model.statusLabel));
    ctx.field(root, "reason", L7("review.reasonField", root), { multiline: true });
    if (model.reasonOptions) ctx.field(root, "category", L7("review.categoryField", root), { options: model.reasonOptions });
    ctx.button(root, "submit-report", L7("review.submitAction", root), function() {
      var payload = ctx.fieldsPayload(model.requiredFields || []);
      if (payload) payload.subjectId = model.id;
      return payload;
    }, { confirm: true, description: L7("review.submitConfirm") });
    return;
  }
  if (model.mode === "queue") {
    if (model.subjectLabel) root.appendChild(node2("p", "", model.subjectLabel));
    if (model.phase === "error") {
      if ((model.permissions || []).indexOf("retry") >= 0) ctx.button(root, "retry", L7("operation.actions.retry", root), {});
      return;
    }
    var items = Array.isArray(model.items) ? model.items : [];
    if (!items.length) {
      root.appendChild(node2("p", "m-product__secondary", L7("review.emptyQueue", root)));
      return;
    }
    var list = node2("ul", "m-operational-list");
    items.forEach(function(item) {
      if (!item || item.id == null) return;
      var kindText = item.kind === "listing" ? L7("review.kind.listing") : item.kind === "flag" ? L7("review.kind.flag") : item.kind === "driver-application" ? L7("review.kind.driverApplication") : null;
      var li = node2("li"), row = node2("button", "m-row m-row--operational m-product__queue-item");
      row.type = "button";
      row.dataset.focusKey = "queue-item-" + item.id;
      row.disabled = !ctx.can("open-review");
      var text2 = node2("span", "m-row__text");
      text2.appendChild(node2("strong", "m-row__title", item.title || L7("common.unavailable", text2)));
      var sub = [];
      if (kindText) sub.push(kindText);
      if (item.date) sub.push(item.date);
      if (sub.length) text2.appendChild(node2("span", "m-row__subtitle", sub.join(" · ")));
      row.appendChild(text2);
      if (item.statusLabel) {
        var meta = node2("div", "m-row__meta");
        meta.appendChild(node2("span", "m-badge m-badge--info", item.statusLabel));
        row.appendChild(meta);
      }
      ctx.on(row, "click", function() {
        if (!root.contains(row) || row.disabled) return;
        ctx.request("open-review", { itemId: item.id, revision: item.revision == null ? null : item.revision });
      });
      li.appendChild(row);
      list.appendChild(li);
    });
    if (list.children.length) root.appendChild(list);
    else root.appendChild(node2("p", "m-product__secondary", L7("review.emptyQueue", root)));
    return;
  }
  if (model.subjectLabel) root.appendChild(node2("p", "", model.subjectLabel));
  if (model.statusLabel) root.appendChild(node2("span", "m-badge m-badge--info", model.statusLabel));
  if (model.summary) root.appendChild(node2("p", "", model.summary));
  if (model.reason) ctx.note(root, L7("review.reasonTitle", root), model.reason, "info");
  if ((model.permissions || []).indexOf("view-evidence") >= 0 && model.visibility && model.visibility.evidence) {
    ctx.media(root, model.images, "contain");
  } else if (model.images && model.images.length) {
    root.appendChild(node2("p", "m-product__secondary", L7("review.attachmentsRestricted", root)));
  }
  ctx.field(root, "reason", L7("review.decisionNoteField", root), { multiline: true });
  var actions = node2("div", "m-product__actions");
  root.appendChild(actions);
  [{ id: "approve", label: L7("review.approveAction") }, { id: "reject", label: L7("review.rejectAction") }, { id: "request-info", label: L7("review.requestInfoAction") }].forEach(function(action) {
    if ((model.permissions || []).indexOf(action.id) >= 0) {
      ctx.button(actions, action.id, action.label, function() {
        var payload = ctx.fieldsPayload(model.reasonRequired && action.id === "reject" ? ["reason"] : []);
        if (payload) {
          payload.subjectId = model.id;
          payload.revision = model.revision;
        }
        return payload;
      }, { confirm: true, primary: action.id === "approve", danger: action.id === "reject", description: L7("review.decisionConfirmPrefix") + action.label + L7("review.decisionConfirmOn") + (model.subjectLabel || L7("review.subjectFallback")) + "." });
    }
  });
  if (model.history) ctx.timeline(root, model.history);
}
register(type6, render6);

// components/product-context/manage.js
var MICRO_LABELS_FAMILY8 = "product-context";
function L8(key2, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY8) || currentInstanceLabels(MICRO_LABELS_FAMILY8);
  if (own && Object.prototype.hasOwnProperty.call(own, key2)) return own[key2];
  return getLabel(MICRO_LABELS_FAMILY8, key2);
}
var type7 = "manage";
function render7(ctx) {
  var model = ctx.model, node2 = ctx.node, root = ctx.root;
  var head = node2("header", "m-product__header");
  root.appendChild(head);
  head.appendChild(node2("h2", "m-product__title", model.title || L8("manage.title", head)));
  var operations = Array.isArray(model.operations) ? model.operations : [];
  function unitOf(item) {
    return item && item.unit ? item.unit : model.unit || L8("common.unitFallback");
  }
  if (Array.isArray(model.summary) && model.summary.length) {
    var summarySection = node2("section", "m-product__section");
    summarySection.appendChild(node2("h3", "m-product__title", L8("manage.summaryTitle", summarySection)));
    var dl = node2("dl", "m-product__comparison");
    model.summary.forEach(function(item) {
      if (!item || item.label == null || String(item.label).trim() === "") return;
      dl.appendChild(node2("dt", "", item.label));
      var dd = node2("dd");
      if (item.value == null || String(item.value).trim() === "") {
        dd.appendChild(node2("span", "m-product__secondary", L8("common.unavailable", dd)));
      } else {
        var number = node2("bdi", "", item.value);
        number.dir = "ltr";
        dd.append(number, document.createTextNode(" " + unitOf(item)));
      }
      dl.appendChild(dd);
    });
    if (dl.children.length) {
      summarySection.appendChild(dl);
      root.appendChild(summarySection);
    }
  }
  if (operations.length) {
    var listSection = node2("section", "m-product__section");
    listSection.appendChild(node2("h3", "m-product__title", L8("manage.listTitle", listSection)));
    var list = node2("ul", "m-operational-list");
    operations.forEach(function(operation) {
      if (!operation) return;
      var typeText = operation.type === "sale" ? L8("manage.type.sale") : operation.type === "expense" ? L8("manage.type.expense") : null;
      var row = node2("li", "m-row m-row--operational"), text2 = node2("span", "m-row__text");
      text2.appendChild(node2("strong", "m-row__title", operation.description || typeText || L8("common.unavailable", text2)));
      var sub = [];
      if (typeText && operation.description) sub.push(typeText);
      if (operation.date) sub.push(operation.date);
      if (sub.length) text2.appendChild(node2("span", "m-row__subtitle", sub.join(" · ")));
      row.appendChild(text2);
      var reading = node2("span", "m-row__reading");
      var amount = node2("bdi", "", operation.amount == null || String(operation.amount).trim() === "" ? L8("common.unavailable") : operation.amount);
      amount.dir = "ltr";
      reading.append(amount, document.createTextNode(" " + unitOf(operation)));
      row.appendChild(reading);
      list.appendChild(row);
    });
    if (list.children.length) {
      listSection.appendChild(list);
      root.appendChild(listSection);
    }
  } else if (model.phase === "ready") {
    root.appendChild(node2("p", "m-product__secondary", L8("manage.emptyList", root)));
  }
  var form = node2("section", "m-product__section");
  form.appendChild(node2("h3", "m-product__title", L8("manage.formTitle", form)));
  ctx.field(form, "amount", L8("manage.amountField", form), { inputmode: "decimal", unit: model.unit || L8("common.unitFallback", form) });
  ctx.field(form, "type", L8("manage.typeField", form), { options: [{ id: "sale", label: L8("manage.type.sale", form) }, { id: "expense", label: L8("manage.type.expense", form) }] });
  ctx.field(form, "date", L8("manage.dateField", form), { type: "date" });
  ctx.field(form, "note", L8("manage.noteField", form), { multiline: true });
  var actions = node2("div", "m-product__actions m-btn-group m-btn-group--pair");
  var submit = ctx.button(actions, "add-operation", L8("manage.submitAction", submit), function() {
    return ctx.fieldsPayload(model.requiredFields || []);
  }, { primary: true, confirm: true, description: L8("manage.submitConfirm", submit) });
  if (ctx.pending === "add-operation") {
    submit.setAttribute("aria-busy", "true");
    submit.classList.add("is-loading");
    submit.insertBefore(node2("span", "m-btn__spinner"), submit.firstChild);
  }
  var cancel = node2("button", "m-btn m-btn--secondary", L8("manage.clearAction"));
  cancel.type = "button";
  cancel.dataset.focusKey = "clear-operation-form";
  cancel.disabled = !ctx.editable();
  ctx.on(cancel, "click", function() {
    if (!ctx.editable()) return;
    Array.prototype.forEach.call(form.querySelectorAll('[data-focus-key^="field-"]'), function(input) {
      input.value = "";
      input.dispatchEvent(new Event(input.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
    });
  });
  actions.appendChild(cancel);
  form.appendChild(actions);
  root.appendChild(form);
  if (model.phase === "error" && (model.permissions || []).indexOf("retry") >= 0) {
    ctx.button(root, "retry", L8("operation.actions.retry", root), function() {
      return ctx.fieldsPayload(model.requiredFields || []);
    });
  }
}
register(type7, render7);
export {
  contextKey,
  destroy,
  getInstance,
  init,
  mount,
  register,
  setLabels2 as setLabels
};
