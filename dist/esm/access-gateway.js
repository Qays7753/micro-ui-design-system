import {
  globalApi
} from "./chunk-N2NZHAOZ.js";
import {
  currentInstanceLabels,
  getLabel,
  instanceLabelFor,
  registerLabels,
  setInstanceLabels,
  setLabels,
  withLabels
} from "./chunk-S44UNZ6A.js";
import {
  instanceRegistry
} from "./chunk-FKZJV23C.js";

// components/access-gateway/labels.js
var defaults = {
  "passwordReveal.label": "إظهار كلمة المرور",
  "recovery.uncertain": "انتهى طلب المساعدة دون تأكيد إرساله.",
  "recovery.error": "تعذّر إرسال طلب المساعدة. أعد المحاولة.",
  "provider.connectingLabel": "جارٍ الاتصال",
  "provider.connectingMessage": "جارٍ الاتصال بمزود الدخول…",
  "provider.success": "تم الدخول بنجاح.",
  "provider.failure": "لم يتم الدخول.",
  "provider.uncertain": "انتهى الطلب دون نتيجة مؤكدة من التطبيق.",
  "provider.error": "تعذّر تنفيذ الدخول. أعد المحاولة.",
  "form.incomplete": "نموذج الدخول غير مكتمل. تواصل مع المسؤول إن تكرر ذلك.",
  "validation.email": "أدخل بريدًا إلكترونيًا صالحًا.",
  "validation.password": "أدخل كلمة المرور.",
  "validation.passwordMinLengthPrefix": "أدخل كلمة مرور لا تقل عن ",
  "validation.passwordMinLengthSuffix": " أحرف.",
  "validation.passwordRequired": "تحقق من كلمة المرور المطلوبة.",
  "validation.emailAndPasswordRequired": "تحقق من البريد الإلكتروني وكلمة المرور المطلوبة.",
  "demo.notice": "هذه نسخة عرض تجريبية: لن تُرسل بياناتك إلى أي خدمة.",
  "submit.loadingLabel": "جارٍ تسجيل الدخول",
  "submit.pendingMessage": "جارٍ التحقق من بيانات الدخول…",
  "submit.error": "تعذّر تسجيل الدخول. تحقق من بياناتك ثم أعد المحاولة."
};

// components/access-gateway/access-gateway.js
registerLabels("access-gateway", defaults);
var MICRO_LABELS_FAMILY = "access-gateway";
function L(key, el) {
  var own = el && instanceLabelFor(el, MICRO_LABELS_FAMILY) || currentInstanceLabels(MICRO_LABELS_FAMILY);
  if (own && Object.prototype.hasOwnProperty.call(own, key)) return own[key];
  return getLabel(MICRO_LABELS_FAMILY, key);
}
function withLabels2(scope, fn) {
  return withLabels(scope, MICRO_LABELS_FAMILY, fn);
}
function applyInstanceLabels(scope, options) {
  if (options && options.labels && typeof options.labels === "object") {
    setInstanceLabels(scope, MICRO_LABELS_FAMILY, options.labels);
  }
}
function userError(error, fallback) {
  return error && typeof error.userMessage === "string" && error.userMessage.trim() ? error.userMessage : fallback;
}
function setMessage(form, message, tone) {
  var status = form.querySelector("[data-access-status]");
  if (!status) return;
  status.textContent = message || "";
  if (tone) status.setAttribute("data-tone", tone);
  else status.removeAttribute("data-tone");
}
function setFieldError(input, message) {
  var field = input.closest("[data-micro-field]");
  if (!field) return;
  var note = field.querySelector("[data-field-msg]");
  field.classList.toggle("has-error", !!message);
  if (note) {
    note.textContent = message || "";
    note.classList.toggle("is-visible", !!message);
  }
  if (message) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}
function credential(form, role) {
  return form.querySelector('[data-access-credential="' + role + '"]') || form.querySelector('input[name="' + role + '"]');
}
function resultOutcome(result, confirmedText, deniedText, neutralText) {
  var hasMessage = !!(result && typeof result.message === "string" && result.message.trim() !== "");
  var tone = "info";
  if (result && (result.tone === "info" || result.tone === "error")) tone = result.tone;
  else if (result && result.authenticated === false) tone = "error";
  if (hasMessage) return { text: result.message, tone };
  if (result && result.authenticated === true && confirmedText) return { text: confirmedText, tone };
  if (result && result.authenticated === false && deniedText) return { text: deniedText, tone };
  return { text: neutralText, tone: "info" };
}
function initGateway(gateway, callbacks) {
  if (gateway.hasAttribute("data-access-ready") && gateway.__microAccessLifetime && !gateway.__microAccessLifetime.controller.signal.aborted) {
    gateway.__microAccessCallbacks = callbacks || gateway.__microAccessCallbacks || {};
    return;
  }
  var form = gateway.querySelector("form[data-access-form]");
  if (!form) return;
  gateway.setAttribute("data-access-ready", "");
  gateway.__microAccessCallbacks = callbacks || {};
  var lifetime = { controller: new AbortController(), observer: null };
  gateway.__microAccessLifetime = lifetime;
  function alive() {
    return gateway.isConnected && gateway.__microAccessLifetime === lifetime && !lifetime.controller.signal.aborted;
  }
  function on(element, type, handler) {
    element.addEventListener(type, handler, { signal: lifetime.controller.signal });
  }
  var reveal = gateway.querySelector("[data-access-reveal]");
  if (reveal) {
    var targetId = reveal.getAttribute("aria-controls");
    var password = targetId ? document.getElementById(targetId) : credential(form, "password");
    if (password) {
      let syncRevealDisabled = function() {
        reveal.disabled = consumerDisabled || password.disabled;
        if (password.disabled && password.type !== "password") {
          password.type = "password";
          reveal.setAttribute("aria-pressed", "false");
        }
      };
      var consumerDisabled = reveal.disabled;
      lifetime.restoreReveal = function() {
        reveal.disabled = consumerDisabled;
      };
      var pointerSelection = null;
      on(reveal, "pointerdown", function() {
        try {
          pointerSelection = {
            start: password.selectionStart,
            end: password.selectionEnd,
            direction: password.selectionDirection
          };
        } catch (error) {
          pointerSelection = null;
        }
      });
      on(reveal, "click", function(event) {
        if (reveal.disabled || password.disabled || reveal.getAttribute("aria-disabled") === "true") return;
        var selection = event.detail > 0 ? pointerSelection : null;
        pointerSelection = null;
        if (!selection) {
          try {
            selection = {
              start: password.selectionStart,
              end: password.selectionEnd,
              direction: password.selectionDirection
            };
          } catch (error) {
            selection = null;
          }
        }
        var showing = password.type === "password";
        password.type = showing ? "text" : "password";
        reveal.setAttribute("aria-pressed", showing ? "true" : "false");
        reveal.setAttribute("aria-label", L("passwordReveal.label", reveal));
        if (selection && typeof password.setSelectionRange === "function") {
          var start = Math.min(selection.start, password.value.length);
          var end = Math.min(selection.end, password.value.length);
          password.setSelectionRange(start, end, selection.direction || "none");
        }
        if (event.detail > 0) {
          password.focus({ preventScroll: true });
          if (selection && typeof password.setSelectionRange === "function") {
            password.setSelectionRange(
              Math.min(selection.start, password.value.length),
              Math.min(selection.end, password.value.length),
              selection.direction || "none"
            );
          }
        }
      });
      syncRevealDisabled();
      lifetime.observer = new MutationObserver(syncRevealDisabled);
      lifetime.observer.observe(password, {
        attributes: true,
        attributeFilter: ["disabled"]
      });
    }
  }
  var recovery = gateway.querySelector("[data-access-recovery]");
  var providers = Array.prototype.slice.call(gateway.querySelectorAll("[data-access-provider]"));
  syncOptional(gateway);
  if (recovery) on(recovery, "click", function() {
    var current = gateway.__microAccessCallbacks || {};
    if (typeof current.onRecovery !== "function") return;
    Promise.resolve().then(function() {
      if (alive()) return current.onRecovery();
    }).then(function(result) {
      if (!alive()) return;
      var hasMessage = !!(result && typeof result.message === "string" && result.message.trim() !== "");
      var tone = "info";
      if (result && (result.tone === "info" || result.tone === "error")) tone = result.tone;
      else if (hasMessage && result && result.authenticated === false) tone = "error";
      setMessage(form, hasMessage ? result.message : L("recovery.uncertain", form), tone);
    }).catch(function(error) {
      if (alive()) setMessage(form, userError(error, L("recovery.error", form)), "error");
    });
  });
  providers.forEach(function(button) {
    on(button, "click", function() {
      var key = button.getAttribute("data-access-provider");
      var current = gateway.__microAccessCallbacks || {};
      var handler = current.providers && current.providers[key];
      if (typeof handler !== "function" || form.dataset.microAccessBusy === "true" || button.disabled || button.getAttribute("aria-disabled") === "true") return;
      form.dataset.microAccessBusy = "true";
      form.setAttribute("aria-busy", "true");
      if (globalApi("Buttons")) globalApi("Buttons").setLoading(button, true, { loadingLabel: L("provider.connectingLabel", button) });
      setMessage(form, L("provider.connectingMessage", form), "info");
      Promise.resolve().then(function() {
        if (alive()) return handler();
      }).then(function(result) {
        if (!alive()) return;
        var outcome = resultOutcome(result, L("provider.success"), L("provider.failure"), L("provider.uncertain"));
        setMessage(form, outcome.text, outcome.tone);
      }).catch(function(error) {
        if (alive()) setMessage(form, userError(error, L("provider.error", form)), "error");
      }).then(function() {
        if (!alive()) return;
        form.dataset.microAccessBusy = "false";
        form.removeAttribute("aria-busy");
        if (globalApi("Buttons")) globalApi("Buttons").setLoading(button, false);
      });
    });
  });
  on(form, "input", function() {
    var controls = Array.prototype.slice.call(form.querySelectorAll("input[required]"));
    controls.forEach(function(input) {
      if (input.validity.valid) {
        setFieldError(input, "");
      }
    });
    setMessage(form, "");
  });
  on(form, "submit", function(event) {
    event.preventDefault();
    if (form.dataset.microAccessBusy === "true") return;
    var email = credential(form, "email");
    var passwordInput = credential(form, "password");
    if (!email || !passwordInput) {
      setMessage(form, L("form.incomplete", form), "error");
      return;
    }
    var controls = [email, passwordInput].filter(Boolean);
    var invalid = controls.filter(function(input) {
      return !input.checkValidity();
    });
    if (invalid.length) {
      invalid.forEach(function(input) {
        var isEmail = input.getAttribute("data-access-credential") === "email" || input.name === "email" || input.type === "email";
        setFieldError(input, isEmail ? L("validation.email", input) : input.validity.valueMissing ? L("validation.password", input) : input.validity.tooShort && input.minLength > 0 ? L("validation.passwordMinLengthPrefix", input) + input.minLength + L("validation.passwordMinLengthSuffix", input) : L("validation.passwordRequired", input));
      });
      setMessage(form, L("validation.emailAndPasswordRequired", form), "error");
      invalid[0].focus();
      return;
    }
    var current = gateway.__microAccessCallbacks || {};
    if (typeof current.onSubmit !== "function") {
      setMessage(form, L("demo.notice", form), "info");
      return;
    }
    form.dataset.microAccessBusy = "true";
    form.setAttribute("aria-busy", "true");
    var submit = form.querySelector('[type="submit"]');
    if (submit && globalApi("Buttons")) globalApi("Buttons").setLoading(submit, true, { loadingLabel: L("submit.loadingLabel") });
    setMessage(form, L("submit.pendingMessage", form), "info");
    Promise.resolve().then(function() {
      if (!alive()) return;
      return current.onSubmit({
        email: email ? email.value : "",
        password: passwordInput ? passwordInput.value : ""
      });
    }).then(function(result) {
      if (!alive()) return;
      var outcome = resultOutcome(result, L("provider.success"), L("provider.failure"), L("provider.uncertain"));
      setMessage(form, outcome.text, outcome.tone);
      form.dispatchEvent(new CustomEvent("micro-access:submitted", { bubbles: true, detail: { result } }));
    }).catch(function(error) {
      if (alive()) setMessage(form, userError(error, L("submit.error", form)), "error");
    }).then(function() {
      if (!alive()) return;
      form.dataset.microAccessBusy = "false";
      form.removeAttribute("aria-busy");
      if (submit && globalApi("Buttons")) globalApi("Buttons").setLoading(submit, false);
    });
  });
}
function syncOptional(gateway) {
  var callbacks = gateway.__microAccessCallbacks || {};
  var recovery = gateway.querySelector("[data-access-recovery]");
  if (recovery) recovery.hidden = typeof callbacks.onRecovery !== "function";
  gateway.querySelectorAll("[data-access-provider]").forEach(function(button) {
    var key = button.getAttribute("data-access-provider");
    button.hidden = !(callbacks.providers && typeof callbacks.providers[key] === "function");
  });
  var providerGroup = gateway.querySelector("[data-access-providers]");
  if (providerGroup) {
    providerGroup.hidden = !Array.prototype.some.call(
      gateway.querySelectorAll("[data-access-provider]"),
      function(button) {
        return !button.hidden;
      }
    );
  }
}
function applyHandlers(scope, handlers) {
  applyInstanceLabels(scope, handlers);
  var gateways = [];
  if (scope.matches && scope.matches("[data-access-gateway]")) gateways.push(scope);
  gateways = gateways.concat(Array.prototype.slice.call(scope.querySelectorAll("[data-access-gateway]")));
  gateways.forEach(function(gateway) {
    initGateway(gateway, handlers || gateway.__microAccessCallbacks || {});
    syncOptional(gateway);
  });
}
var registry = instanceRegistry();
function init(root, handlers) {
  var scope = root || document;
  applyInstanceLabels(scope, handlers);
  applyInstanceLabels(scope, handlers);
  applyInstanceLabels(scope, handlers);
  applyInstanceLabels(scope, handlers);
  var existing = registry.get(scope);
  if (existing) {
    existing.update(handlers);
    return existing;
  }
  var destroyed = false;
  var instance = {
    root: scope,
    /** تحديث callbacks وتوافر الإجراءات دون ربط مضاعف. */
    update: function(nextHandlers) {
      withLabels2(scope, function() {
        applyHandlers(scope, nextHandlers);
      });
    },
    /** يفك المستمعات والمراقبة ويرجع الحالة الظاهرة — لا يمس قيم المستخدم. */
    destroy: function() {
      if (destroyed) return;
      destroyed = true;
      teardown(scope);
      registry.remove(scope);
    }
  };
  applyHandlers(scope, handlers);
  registry.set(scope, instance);
  return instance;
}
function getInstance(root) {
  return registry.get(root);
}
function destroy(root) {
  var instance = registry.get(root);
  if (instance) instance.destroy();
  else teardown(root || document);
}
function teardown(root) {
  var scope = root || document;
  var gateways = [].slice.call(scope.querySelectorAll("[data-access-gateway]"));
  if (scope.matches && scope.matches("[data-access-gateway]")) gateways.unshift(scope);
  gateways.forEach(function(gateway) {
    var lifetime = gateway.__microAccessLifetime;
    if (lifetime) {
      lifetime.controller.abort();
      if (lifetime.observer) lifetime.observer.disconnect();
      if (lifetime.restoreReveal) lifetime.restoreReveal();
    }
    delete gateway.__microAccessLifetime;
    gateway.removeAttribute("data-access-ready");
    var form = gateway.querySelector("[data-access-form]");
    if (form) {
      form.dataset.microAccessBusy = "false";
      form.removeAttribute("aria-busy");
      var submit = form.querySelector('[type="submit"]');
      if (submit && globalApi("Buttons")) globalApi("Buttons").setLoading(submit, false);
      gateway.querySelectorAll("[data-access-provider]").forEach(function(button) {
        if (globalApi("Buttons")) globalApi("Buttons").setLoading(button, false);
      });
      var password = credential(form, "password");
      if (password) password.type = "password";
    }
    var reveal = gateway.querySelector("[data-access-reveal]");
    if (reveal) reveal.setAttribute("aria-pressed", "false");
  });
}
function setLabels2(partial) {
  setLabels("access-gateway", partial);
}
export {
  destroy,
  getInstance,
  init,
  setLabels2 as setLabels
};
