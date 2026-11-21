(() => {
  (function() {
    "use strict";
    var MICRO_LABELS_FAMILY = "product-context";
    function L(key) {
      var family = window.MicroLabels && window.MicroLabels[MICRO_LABELS_FAMILY];
      return family ? family[key] : void 0;
    }
    function microAutoInit() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false);
    }
    var symbol = new URL("../../assets/brand/micro-logo/v2/variants/full-color/micro-symbol.svg", document.currentScript.src).href;
    var kinds = { "follow-up": "follow-up", open: "open-resource", execute: "execute" };
    function text(value) {
      return typeof value === "string" && value.trim().length > 0;
    }
    MicroProduct.register("assistant", function(c) {
      var m = c.model, n = c.node, r = c.root, actionStatus = 0, header = n("header", "m-product__section m-assistant__header"), identity = n("div", "m-assistant__identity"), logo = n("img", "m-assistant__symbol");
      logo.src = symbol;
      logo.alt = "";
      logo.width = 24;
      logo.height = 24;
      identity.append(logo, n("h2", "m-product__title", "Ask Micro"));
      header.append(identity, n("p", "m-product__secondary", m.scope.label || m.scope.contextId));
      r.appendChild(header);
      var generation = c.ui.presentationGeneration, saved = c.ui.presentation.ask || null;
      var messages = m.phase === "empty" ? [] : m.messages || [], log = n("div", "m-product__log");
      log.id = c.uid + "-log";
      log.dataset.focusKey = "assistant-log";
      log.setAttribute("role", "log");
      log.setAttribute("aria-label", L("k115"));
      log.setAttribute("aria-relevant", "additions text");
      log.setAttribute("aria-busy", String(!!m.replyPending));
      messages.forEach(function(message) {
        var bubble = n("article", "m-product__message"), speaker = ["user", "assistant"].indexOf(message.speaker) >= 0 ? message.speaker : "system";
        bubble.dataset.speaker = speaker;
        if (text(message.id) && messages.filter(function(x) {
          return x.id === message.id;
        }).length === 1) bubble.dataset.messageId = message.id;
        bubble.append(n("strong", "m-product__secondary", speaker === "user" ? L("k116") : speaker === "assistant" ? "Ask Micro" : L("k117")), n("p", "", message.text));
        if (message.stateLabel) bubble.appendChild(n("p", "m-product__secondary", message.stateLabel));
        if (message.id && (m.permissions || []).indexOf("retry") >= 0 && message.retryable) c.button(bubble, "retry", L("k118"), { messageId: message.id }, { focusKey: "retry-" + message.id });
        if (speaker === "assistant" && text(message.id) && messages.filter(function(x) {
          return x.id === message.id;
        }).length === 1) {
          var actions = Array.isArray(message.actions) ? message.actions : [], row = n("div", "m-product__actions m-assistant__actions"), reasons = /* @__PURE__ */ Object.create(null), reasonNodes = [];
          actions.forEach(function(action) {
            if (!action || !Object.prototype.hasOwnProperty.call(kinds, action.kind) || !text(action.id) || !text(action.label) || !text(action.revision) || actions.filter(function(x) {
              return x && x.id === action.id;
            }).length !== 1) return;
            if (action.kind === "execute" && !text(action.summary)) return;
            var state = action.state === void 0 ? "ready" : action.state, disabled = state !== "ready" || !!m.replyPending, id = kinds[action.kind];
            var button = c.button(row, id, action.label, { messageId: message.id, actionId: action.id, revision: action.revision }, { confirm: action.kind === "execute", description: action.summary, focusKey: "message-action-" + message.id + "-" + action.id, disabled, primary: action.emphasis === "primary" && actions.filter(function(x) {
              return x && x.emphasis === "primary";
            }).length === 1 });
            if (state !== "ready") {
              var reason = { expired: L("k119"), completed: L("k120"), unavailable: L("k121") }[state] || L("k121");
              var status = reasons[reason];
              if (!status) {
                status = n("span", "m-product__secondary", reason);
                status.id = c.uid + "-action-status-" + ++actionStatus;
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
      if (!log.children.length) log.appendChild(n("p", "m-product__secondary", L("k122")));
      r.appendChild(log);
      if (m.replyPending) {
        var activity = n("div", "m-assistant__activity");
        activity.setAttribute("role", "status");
        var dot = n("span", "m-assistant__activity-dot");
        dot.setAttribute("aria-hidden", "true");
        activity.append(dot, n("span", "", m.activity === "searching" ? L("k123") : L("k124")));
        r.appendChild(activity);
      }
      var last = messages[messages.length - 1], lastKey = last ? String(last.id || "") + "\n" + String(last.text || "") : "";
      var unread = !!(messages.length && saved && !saved.atEnd && (saved.unread || messages.length > saved.count || messages.length === saved.count && saved.lastKey !== lastKey));
      var newer = n("button", "m-btn m-btn--light m-assistant__new", L("k125"));
      newer.type = "button";
      newer.hidden = !unread;
      newer.setAttribute("aria-controls", log.id);
      r.appendChild(newer);
      function atEnd() {
        return log.scrollHeight - log.clientHeight - log.scrollTop < 24;
      }
      c.on(newer, "click", function() {
        log.scrollTop = log.scrollHeight;
        unread = false;
        newer.hidden = true;
        log.focus({ preventScroll: true });
      });
      log.tabIndex = 0;
      c.on(log, "scroll", function() {
        if (atEnd()) {
          unread = false;
          newer.hidden = true;
        }
      });
      if (m.proposal) {
        var box = n("section", "m-product__surface");
        box.append(n("h3", "m-product__title", L("k126")), n("p", "", m.proposal.summary));
        c.button(box, "execute", m.proposal.label || L("k127"), { proposalId: m.proposal.id, revision: m.proposal.revision }, { confirm: true, description: m.proposal.summary });
        r.appendChild(box);
      }
      var composer = n("div", "m-product__section m-assistant__composer"), input = c.field(composer, "message", L("k128"), { multiline: true, rows: 1 });
      c.button(composer, "send", L("k129"), function() {
        return c.fieldsPayload(["message"]);
      }, { primary: true, disabled: !!m.replyPending });
      r.appendChild(composer);
      function grow() {
        var follow = atEnd();
        input.style.blockSize = "auto";
        input.style.blockSize = input.scrollHeight + "px";
        if (follow) log.scrollTop = log.scrollHeight;
      }
      c.on(input, "input", grow);
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
      c.cleanup(function() {
        if (generation !== c.ui.presentationGeneration) return;
        var top = log.getBoundingClientRect().top, anchor2 = Array.from(log.querySelectorAll("[data-message-id]")).find(function(el) {
          return el.getBoundingClientRect().bottom > top;
        });
        c.ui.presentation.ask = { top: log.scrollTop, atEnd: atEnd(), anchor: anchor2 ? anchor2.dataset.messageId : null, offset: anchor2 ? anchor2.getBoundingClientRect().top - top : 0, count: messages.length, lastKey, unread };
      });
    });
  })();
})();
