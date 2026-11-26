import {
  defaults
} from "./chunk-RLPGAT2D.js";
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

// components/selection/picker.js
registerLabels("selection", defaults);
var MICRO_LABELS_FAMILY = "selection";
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
var states = /* @__PURE__ */ new WeakMap();
function stateOf(picker) {
  var state = states.get(picker);
  if (!state) {
    state = { status: "ready", query: "", message: "", listeners: [], bound: false };
    states.set(picker, state);
  }
  return state;
}
function listOf(picker) {
  return picker.querySelector("[data-picker-list]");
}
function optionsOf(picker) {
  var list = listOf(picker);
  return list ? [].slice.call(list.querySelectorAll(".m-picker__option")) : [];
}
function searchOf(picker) {
  return picker.querySelector("[data-picker-search]");
}
function locked(picker) {
  return picker.getAttribute("aria-disabled") === "true" || stateOf(picker).status === "disabled";
}
function available(picker) {
  return optionsOf(picker).filter(function(option) {
    return !option.hidden && !option.disabled && option.getAttribute("aria-disabled") !== "true";
  });
}
function listen(picker, element, type, handler) {
  if (!element) return;
  element.addEventListener(type, handler);
  stateOf(picker).listeners.push(function() {
    element.removeEventListener(type, handler);
  });
}
function safeFocus(picker) {
  var target = searchOf(picker);
  if (!target || target.disabled || target.hidden) {
    target = picker;
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
  }
  target.focus({ preventScroll: true });
}
function roving(picker, active) {
  var visible = available(picker);
  var chosen = visible.indexOf(active) >= 0 ? active : visible.filter(function(option) {
    return option.getAttribute("aria-selected") === "true";
  })[0] || visible[0];
  optionsOf(picker).forEach(function(option) {
    option.tabIndex = !locked(picker) && option === chosen ? 0 : -1;
  });
}
function summary(picker) {
  var foot = picker.querySelector("[data-picker-summary]");
  var selected = getSelected(picker);
  if (foot) foot.textContent = selected ? L("picker.selectedPrefix", foot) + selected.label : L("picker.selectedNone", foot);
}
function getSelected(picker) {
  var option = optionsOf(picker).filter(function(item) {
    return item.getAttribute("aria-selected") === "true";
  })[0];
  return option ? { value: option.getAttribute("data-value"), label: option.textContent.trim() } : null;
}
function changed(picker, value) {
  picker.dispatchEvent(new CustomEvent("micro-picker:change", {
    bubbles: true,
    detail: value || { value: null, label: null }
  }));
}
function statusNodes(picker) {
  var list = listOf(picker);
  if (!list) return null;
  [].slice.call(list.querySelectorAll(".m-picker__state")).forEach(function(node) {
    node.remove();
  });
  var status = picker.querySelector("[data-picker-status]");
  if (!status) {
    status = document.createElement("div");
    status.className = "m-picker__state";
    status.setAttribute("data-picker-status", "");
    list.parentNode.insertBefore(status, list);
  } else if (list.contains(status)) list.parentNode.insertBefore(status, list);
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  var retry = picker.querySelector("[data-picker-retry]");
  if (!retry) {
    retry = document.createElement("button");
    retry.type = "button";
    retry.className = "m-btn m-btn--secondary";
    retry.setAttribute("data-picker-retry", "");
    retry.textContent = L("picker.retry", retry);
    list.parentNode.insertBefore(retry, list.nextSibling);
  } else if (list.contains(retry) || status.contains(retry)) {
    list.parentNode.insertBefore(retry, list.nextSibling);
  }
  return { status, retry };
}
function normalizeMatch(text) {
  var s = String(text).toLowerCase();
  if (!s.normalize) return s;
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function apply(picker) {
  var state = stateOf(picker);
  var list = listOf(picker);
  var nodes = statusNodes(picker);
  if (!list || !nodes) return;
  var active = document.activeElement;
  var ownedOption = optionsOf(picker).indexOf(active) >= 0;
  var ready = state.status === "ready";
  var queryNorm = state.query !== "" ? normalizeMatch(state.query) : "";
  optionsOf(picker).forEach(function(option) {
    var hide = !ready || queryNorm !== "" && normalizeMatch(option.textContent).indexOf(queryNorm) === -1;
    if (hide && option === active) safeFocus(picker);
    option.hidden = hide;
  });
  var defaults2 = {
    initial: L("picker.status.initial"),
    loading: L("picker.status.loading"),
    empty: L("picker.status.empty"),
    error: L("picker.status.error"),
    disabled: L("picker.status.disabled")
  };
  var noResult = ready && state.query !== "" && !available(picker).length;
  var noData = ready && !optionsOf(picker).length;
  var message = ready ? noResult ? L("picker.noResults") : noData ? defaults2.empty : "" : state.message || defaults2[state.status] || "";
  var retryVisible = state.status === "error" && !locked(picker);
  if (active === nodes.retry && !retryVisible) safeFocus(picker);
  if (nodes.status.textContent !== message) nodes.status.textContent = message;
  nodes.status.hidden = !message;
  nodes.status.classList.toggle("m-picker__state--error", state.status === "error");
  nodes.retry.hidden = !retryVisible;
  list.setAttribute("aria-busy", state.status === "loading" ? "true" : "false");
  list.setAttribute("aria-disabled", locked(picker) ? "true" : "false");
  roving(picker, ownedOption && !active.hidden ? active : null);
}
function bind(picker) {
  if (stateOf(picker).bound || !listOf(picker)) return;
  stateOf(picker).bound = true;
  picker.setAttribute("data-micro-picker-bound", "1");
  var nodes = statusNodes(picker);
  listen(picker, searchOf(picker), "input", function() {
    stateOf(picker).query = searchOf(picker).value.trim();
    apply(picker);
  });
  listen(picker, nodes.retry, "click", function() {
    if (stateOf(picker).status !== "error" || locked(picker)) return;
    picker.dispatchEvent(new CustomEvent("micro-picker:retry", { bubbles: true }));
  });
  listen(picker, listOf(picker), "click", function(event) {
    var option = event.target.closest(".m-picker__option");
    if (!option || available(picker).indexOf(option) < 0 || locked(picker)) return;
    optionsOf(picker).forEach(function(item) {
      item.setAttribute("aria-selected", String(item === option));
    });
    summary(picker);
    roving(picker, option);
    changed(picker, getSelected(picker));
  });
  listen(picker, listOf(picker), "keydown", function(event) {
    var options = available(picker);
    if (!options.length || locked(picker)) return;
    var index = options.indexOf(document.activeElement), next = null;
    var rtl = getComputedStyle(picker).direction === "rtl";
    if (event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight")) next = options[(index + 1 + options.length) % options.length];
    else if (event.key === "ArrowUp" || event.key === (rtl ? "ArrowRight" : "ArrowLeft")) next = options[(index - 1 + options.length) % options.length];
    else if (event.key === "Home") next = options[0];
    else if (event.key === "End") next = options[options.length - 1];
    if (next) {
      event.preventDefault();
      next.focus();
      roving(picker, next);
    }
  });
  listen(picker, picker.querySelector("[data-picker-close]"), "click", function() {
    var layer = picker.closest(".m-layer");
    if (layer && globalApi("Navigation")) globalApi("Navigation").closeLayer(layer);
    picker.dispatchEvent(new CustomEvent("micro-picker:close", { bubbles: true }));
  });
  apply(picker);
  summary(picker);
}
function each(root, fn) {
  var scope = root || document;
  if (scope.matches && scope.matches("[data-micro-picker]")) fn(scope);
  [].slice.call(scope.querySelectorAll("[data-micro-picker]")).forEach(fn);
}
function disconnect(picker) {
  stateOf(picker).listeners.splice(0).forEach(function(remove) {
    remove();
  });
  stateOf(picker).bound = false;
  picker.removeAttribute("data-micro-picker-bound");
}
var registry = instanceRegistry();
function teardown(scope) {
  each(scope, function(pickerEl) {
    disconnect(pickerEl);
    states.delete(pickerEl);
  });
}
function init(root, options) {
  var scope = root || document;
  applyInstanceLabels(scope, options);
  var existing = registry.get(scope);
  if (existing) {
    withLabels2(scope, function() {
      each(scope, bind);
    });
    return existing;
  }
  var destroyed = false;
  var instance = {
    root: scope,
    /** = setOptions لكل picker تحت الجذر. */
    update: function(items) {
      if (!Array.isArray(items)) return;
      withLabels2(scope, function() {
        each(scope, function(pickerEl) {
          setOptions(pickerEl, items);
        });
      });
    },
    /** يفك مستمعات كل picker ويمحو حالته — بيانات المضيف لا تُمس. */
    destroy: function() {
      if (destroyed) return;
      destroyed = true;
      teardown(scope);
      registry.remove(scope);
    }
  };
  withLabels2(scope, function() {
    each(scope, bind);
  });
  registry.set(scope, instance);
  return instance;
}
function getInstance(root) {
  return registry.get(root);
}
function destroy(root) {
  var instance = registry.get(root);
  if (instance) instance.destroy();
  else teardown(root);
}
function update(root, items) {
  if (!Array.isArray(items)) return;
  each(root, function(picker) {
    setOptions(picker, items);
  });
}
function setStatus(picker, kind, message) {
  if (["ready", "loading", "empty", "error", "initial", "disabled"].indexOf(kind) < 0) return;
  var state = stateOf(picker);
  state.status = kind;
  state.message = typeof message === "string" ? message : "";
  apply(picker);
}
function setOptions(picker, items) {
  var list = listOf(picker);
  if (!list) return;
  var selected = getSelected(picker), active = document.activeElement;
  var hadFocus = optionsOf(picker).indexOf(active) >= 0;
  var focusedKey = hadFocus ? active.getAttribute("data-value") : null;
  if (hadFocus) safeFocus(picker);
  optionsOf(picker).forEach(function(option) {
    option.remove();
  });
  (items || []).forEach(function(item) {
    var option = document.createElement("button");
    option.type = "button";
    option.className = "m-picker__option";
    option.setAttribute("role", "option");
    option.setAttribute("data-value", String(item.value));
    option.setAttribute("aria-selected", String(!!selected && selected.value === String(item.value)));
    option.textContent = item.label;
    list.appendChild(option);
  });
  var state = stateOf(picker);
  state.status = "ready";
  state.message = "";
  apply(picker);
  summary(picker);
  var replacement = available(picker).filter(function(option) {
    return option.getAttribute("data-value") === focusedKey;
  })[0];
  if (hadFocus && replacement && !locked(picker)) {
    replacement.focus();
    roving(picker, replacement);
  }
  if (selected && !getSelected(picker)) changed(picker, null);
}
function clearSelection(picker) {
  optionsOf(picker).forEach(function(option) {
    option.setAttribute("aria-selected", "false");
  });
  summary(picker);
  roving(picker, document.activeElement);
  changed(picker, null);
}
function setLabels2(partial) {
  setLabels("selection", partial);
}
export {
  clearSelection,
  destroy,
  getInstance,
  getSelected,
  init,
  setLabels2 as setLabels,
  setOptions,
  setStatus,
  update
};
