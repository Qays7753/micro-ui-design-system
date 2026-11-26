import {
  globalApi
} from "./chunk-N2NZHAOZ.js";

// shared/back.js
function bindBackToLayers(options) {
  var bound = false;
  var stack = [];
  var pending = 0;
  var consuming = false;
  var silent = 0;
  var counter = 0;
  function onOpen(event) {
    var detail = event.detail || {};
    var layer = detail.layer || (event.target && event.target.nodeType === 1 ? event.target : null);
    if (!layer || stack.some(function(s) {
      return s.layer === layer;
    })) return;
    stack.push({ layer, close: detail.close || null });
    pending += 1;
    counter += 1;
    history.pushState({ __microBack: counter, microLayer: true }, "");
  }
  function closeTop() {
    var top = stack[stack.length - 1];
    if (!top) return;
    var nav = globalApi("Navigation");
    if (typeof top.close === "function") top.close();
    else if (nav) nav.closeLayer(top.layer);
  }
  function onPopState() {
    if (silent > 0) {
      silent -= 1;
      return;
    }
    if (pending > 0) pending -= 1;
    if (!stack.length) return;
    consuming = true;
    try {
      closeTop();
    } finally {
      consuming = false;
    }
  }
  function onClose(event) {
    var detail = event.detail || {};
    var layer = detail.layer || (event.target && event.target.nodeType === 1 ? event.target : null);
    var idx = -1;
    for (var i = 0; i < stack.length; i++) {
      if (stack[i].layer === layer) {
        idx = i;
        break;
      }
    }
    if (idx < 0) return;
    stack.splice(idx, 1);
    if (consuming) return;
    if (pending > 0) pending -= 1;
    if (history.state && history.state.__microBack) {
      var active = document.activeElement;
      var restore = function() {
        window.removeEventListener("popstate", restore);
        if (active && active.nodeType === 1 && active.isConnected && document.activeElement !== active && !active.closest("[inert], [hidden]") && typeof active.focus === "function") {
          active.focus();
        }
      };
      window.addEventListener("popstate", restore);
      silent += 1;
      history.back();
    }
  }
  function bind() {
    if (bound) return;
    bound = true;
    document.addEventListener("micro-layer:open", onOpen);
    document.addEventListener("micro-layer:close", onClose);
    window.addEventListener("popstate", onPopState);
  }
  bind();
  return {
    /** عدد الطبقات المسجلة المفتوحة (تشخيص/فحص). */
    openCount: function() {
      return stack.length;
    },
    /** فك الربط الكامل — لا يمس السجل ولا الطبقات المفتوحة. */
    destroy: function() {
      if (!bound) return;
      bound = false;
      document.removeEventListener("micro-layer:open", onOpen);
      document.removeEventListener("micro-layer:close", onClose);
      window.removeEventListener("popstate", onPopState);
      stack = [];
      pending = 0;
      silent = 0;
    }
  };
}
export {
  bindBackToLayers
};
