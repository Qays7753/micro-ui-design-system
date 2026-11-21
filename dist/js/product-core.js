(() => {
  (function() {
    "use strict";
    var MICRO_LABELS_FAMILY = "product-context";
    function L(key2) {
      var family = window.MicroLabels && window.MicroLabels[MICRO_LABELS_FAMILY];
      return family ? family[key2] : void 0;
    }
    function microAutoInit() {
      return !(window.MicroConfig && window.MicroConfig.autoInit === false);
    }
    var renderers = /* @__PURE__ */ new Map(), instances = /* @__PURE__ */ new WeakMap(), sequence = 0;
    var phases = {
      ready: "",
      loading: L("k1"),
      empty: L("k2"),
      success: L("k3"),
      error: L("k4"),
      rejected: L("k5"),
      disabled: L("k6"),
      pending: L("k7"),
      uncertain: L("k8"),
      denied: L("k9"),
      expired: L("k10"),
      "signed-out": L("k11"),
      conflict: L("k12"),
      "local-saved": L("k13")
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
    function node(tag, cls, text) {
      var el = document.createElement(tag);
      if (cls) el.className = cls;
      if (text !== void 0 && text !== null) el.textContent = String(text);
      return el;
    }
    function note(parent, title, body, tone) {
      var el = node("section", "m-note m-note--" + (tone || "info"));
      el.setAttribute("role", tone === "error" ? "alert" : "status");
      var text = node("div", "m-note__text");
      text.appendChild(node("strong", "m-note__title", title));
      if (body) text.appendChild(node("p", "m-note__body", body));
      el.appendChild(text);
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
    function mount(root, type, value) {
      if (!root || root.nodeType !== 1 || !renderers.has(type)) throw new TypeError("Unknown product composition or invalid root");
      if (instances.has(root)) {
        var old = instances.get(root);
        if (old.type !== type) throw new TypeError("One DOM owner per root");
        return old.api;
      }
      var model, epoch = 0, requestNumber = 0, pending = null, destroyed = false, rendererLife, cleanups = [], confirmation = null, suppressFocus = false;
      var ui = { draft: /* @__PURE__ */ Object.create(null), files: [], urls: [], presentation: /* @__PURE__ */ Object.create(null), presentationGeneration: 0 }, instanceId = "micro-product-" + ++sequence;
      var forbidden = ["denied", "expired", "signed-out"];
      function disposeConfirmation() {
        if (!confirmation) return;
        var current = confirmation;
        confirmation = null;
        current.life.abort();
        window.MicroActionSheet.disconnect(current.sheet);
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
        if (forbidden.indexOf(model.phase) >= 0) return model.connection === "online" && (id === "reauth" || model.phase === "denied" && id === "choose-context");
        if (!key(model.scope)) return false;
        if (model.scope.kind === "driver" && (type === "market" || type === "review" && model.mode !== "report" || type !== "context" && ["manage", "market"].indexOf(model.destination) >= 0)) return false;
        if (["loading", "pending", "disabled"].indexOf(model.phase) >= 0) return false;
        if (["uncertain", "conflict"].indexOf(model.phase) >= 0 && ["recheck", "reauth"].indexOf(id) < 0) return false;
        if (["offline", "weak", "local"].indexOf(model.connection) >= 0) return !!local && model.destination === "manage" && model.scope.kind !== "driver";
        return true;
      }
      function dispatch(id, payload, local) {
        if (!allowed(id, local)) return false;
        var token = { instanceId, generation: epoch, requestId: instanceId + "-" + ++requestNumber, contextKey: key(model.scope) };
        pending = { token, action: id, payload: copy(payload || {}) };
        var detail = { type, action: id, scope: copy(model.scope || null), request: copy(token), payload: copy(payload || {}) };
        render();
        root.dispatchEvent(new CustomEvent("micro-product:intent", { bubbles: true, detail }));
        return true;
      }
      function confirm(id, payload, label, description, local, danger) {
        if (!allowed(id, local) || confirmation) return;
        if (!window.MicroActionSheet) {
          note(root, L("k14"), "", "error");
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
        var head = node("header", "m-layer__head"), title = node("h2", "m-layer__title", L("k15"));
        title.id = sheet.id + "-title";
        head.appendChild(title);
        var cancel = node("button", "m-btn m-btn--secondary", L("k16"));
        cancel.type = "button";
        cancel.dataset.layerClose = "";
        head.appendChild(cancel);
        sheet.appendChild(head);
        var body = node("div", "m-layer__body"), desc = node("p", "", description || label);
        desc.id = sheet.id + "-description";
        body.appendChild(desc);
        body.appendChild(node("p", "m-product__secondary", model.scope.label || model.scope.contextId));
        var list = node("ul", "m-action-sheet__list"), item = node("li"), button = node("button", "m-btn " + (danger ? "m-btn--destructive-soft" : "m-btn--primary") + " m-action-sheet__item", label || L("k17"));
        button.type = "button";
        button.dataset.actionId = "confirm";
        item.appendChild(button);
        list.appendChild(item);
        body.appendChild(list);
        sheet.appendChild(body);
        document.body.append(backdrop, sheet);
        confirmation = { sheet, backdrop, life };
        window.MicroActionSheet.init(sheet);
        sheet.addEventListener("micro-actions:request", function() {
          if (destroyed || generation !== epoch || context !== key(model.scope)) return;
          disposeConfirmation();
          dispatch(id, payload, local);
        }, { signal: life.signal });
        sheet.addEventListener("micro-navigation:closed", function(event) {
          if (event.target === sheet) setTimeout(function() {
            if (confirmation && confirmation.sheet === sheet) disposeConfirmation();
          }, 0);
        }, { signal: life.signal });
        window.MicroActionSheet.open(sheet, { trigger, contextKey: context });
      }
      function render() {
        var active = root.contains(document.activeElement) ? document.activeElement : null;
        var focusKey = !suppressFocus && active && active.getAttribute("data-focus-key");
        var selection = active && typeof active.selectionStart === "number" ? [active.selectionStart, active.selectionEnd] : null;
        stopRender();
        rendererLife = new AbortController();
        root.replaceChildren();
        root.classList.add("m-product");
        root.setAttribute("data-product-type", type);
        if (type === "assistant") root.dataset.conversationLayout = model.conversationLayout === "fill" ? "fill" : "embedded";
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
              if (options.confirm || options.danger) confirm(id, data, label, typeof options.description === "function" ? options.description(data) : options.description, options.local, options.danger);
              else dispatch(id, data, options.local);
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
            if (options.options) options.options.forEach(function(x) {
              var opt = node("option", "", x.label);
              opt.value = x.id;
              input.appendChild(opt);
            });
            else if (options.multiline) input.rows = options.rows || 3;
            else {
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
              var error = note(root, L("k18"), "", "error");
              error.dataset.productValidation = "";
              error.id = instanceId + "-validation";
              var heading = root.querySelector(":scope > header,:scope > h2");
              if (heading) heading.after(error);
              else root.prepend(error);
              var first = null;
              root.querySelectorAll('[data-focus-key^="field-"]').forEach(function(el) {
                if (missing.indexOf(el.dataset.focusKey.slice(6)) < 0) return;
                var box = el.closest(".m-field"), label = box.querySelector("label"), message = node("p", "m-field__msg is-visible", L("k19") + (label ? label.textContent : L("k20")));
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
              parent.appendChild(node("div", "m-product__media-empty", L("k21")));
              return;
            }
            var carousel = node("div", "m-carousel m-product__gallery");
            carousel.classList.toggle("m-product__gallery--preview", !!preview);
            carousel.dataset.carousel = "";
            carousel.dataset.carouselLabel = L("k22");
            carousel.setAttribute("role", "group");
            carousel.setAttribute("aria-label", L("k22"));
            var viewport = node("div", "m-carousel__viewport");
            viewport.dataset.viewport = "";
            var track = node("ul", "m-carousel__track");
            track.dataset.track = "";
            images.forEach(function(image, index) {
              var li = node("li", "m-carousel__slide"), card = node("div", "m-carousel__card"), src = safeImage(image.src);
              li.dataset.carouselSlide = "";
              li.dataset.cardLabel = image.alt || L("k23") + (index + 1);
              if (src) {
                var img = node("img", "m-product__media");
                img.src = src;
                img.alt = image.alt || L("k24");
                img.loading = "lazy";
                img.decoding = "async";
                img.style.objectFit = fit === "contain" ? "contain" : "cover";
                ctx.on(img, "error", function() {
                  img.replaceWith(node("div", "m-product__media-empty", L("k25")));
                });
                card.appendChild(img);
              } else card.appendChild(node("div", "m-product__media-empty", L("k26")));
              li.appendChild(card);
              track.appendChild(li);
            });
            viewport.appendChild(track);
            carousel.appendChild(viewport);
            if (images.length > 1) {
              var controls = node("div", "m-product__actions");
              ["prev", "next"].forEach(function(dir) {
                var b = node("button", "m-btn m-btn--secondary", dir === "prev" ? L("k27") : L("k28"));
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
            if (window.MicroCarousel) {
              window.MicroCarousel.init(carousel);
              ctx.cleanup(function() {
                window.MicroCarousel.destroy(carousel);
              });
            }
          },
          attachments: function(parent, required) {
            var field = node("div", "m-field"), lab = node("span", "m-field__label", L("k29")), input = node("input", "m-product__file"), choose = node("button", "m-btn m-btn--secondary", model.attachmentSelection === "append" ? L("k30") : ui.files.length ? L("k31") : L("k32"));
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
                note(parent, L("k33"), L("k34"), "error");
                return;
              }
              var selection2 = model.attachmentSelection === "append" ? ui.files.concat(files) : files;
              releaseFiles();
              ui.files = selection2;
              ui.urls = selection2.map(function(f) {
                return URL.createObjectURL(f);
              });
              render();
            });
            if (ui.files.length) {
              var names = node("ul", "m-product__filenames");
              ui.files.forEach(function(f, index) {
                var item = node("li");
                item.appendChild(node("bdi", "", f.name));
                if (ui.files.length > 1) {
                  var remove = node("button", "m-btn m-btn--light", L("k35"));
                  remove.type = "button";
                  remove.disabled = !ctx.editable();
                  remove.setAttribute("aria-label", L("k36") + f.name);
                  remove.dataset.focusKey = "remove-file-" + index;
                  ctx.on(remove, "click", function() {
                    if (!ctx.editable()) return;
                    URL.revokeObjectURL(ui.urls[index]);
                    ui.urls.splice(index, 1);
                    ui.files.splice(index, 1);
                    remove.dataset.focusKey = "choose-files";
                    render();
                  });
                  item.appendChild(remove);
                }
                names.appendChild(item);
              });
              field.appendChild(names);
              ctx.media(parent, ui.files.map(function(f, i) {
                return { src: ui.urls[i], alt: f.name };
              }), "contain", true);
              var clear = node("button", "m-btn m-btn--light", L("k37"));
              clear.type = "button";
              clear.disabled = !ctx.editable();
              ctx.on(clear, "click", function() {
                releaseFiles();
                render();
              });
              parent.appendChild(clear);
            }
            if (required) parent.appendChild(node("p", "m-product__secondary", L("k38")));
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
          note(root, phases[phase], L("k39"), "warning");
          if (permission("reauth")) ctx.button(root, "reauth", L("k40"), {});
          if (phase === "denied" && permission("choose-context")) ctx.button(root, "choose-context", L("k41"), {});
        } else if (!scopeKey) {
          note(root, L("k42"), L("k43"), "warning");
        } else if (model.scope.kind === "driver" && (type === "market" || type === "review" && model.mode !== "report" || type !== "context" && ["manage", "market"].indexOf(model.destination) >= 0)) {
          note(root, L("k44"), L("k45"), "warning");
        } else if (!permission("view") || type !== "context" && type !== "state" && key(model.dataContext) !== scopeKey) {
          note(root, L("k46"), "", "warning");
        } else {
          if (["offline", "weak", "local"].indexOf(model.connection) >= 0) note(root, model.connection === "offline" ? L("k47") : model.connection === "local" ? L("k48") : L("k49"), model.destination === "manage" ? L("k50") : L("k51"), "warning");
          if (pending) note(root, phases.pending, "", "info");
          else if (phase !== "ready") note(root, phase === "local-saved" && model.destination !== "manage" ? phases.uncertain : phases[phase], model.phaseDetail || "", phase === "error" ? "error" : phase === "success" ? "success" : "info");
          if (phase !== "loading" && (phase !== "empty" || type === "assistant")) renderers.get(type)(ctx);
          else if (phase === "empty" && model.emptyActionLabel) ctx.button(root, "create", model.emptyActionLabel, {});
          if (["uncertain", "conflict"].indexOf(phase) >= 0 && permission("recheck") && !root.querySelector('[data-product-action="recheck"]')) ctx.button(root, "recheck", L("k52"), {});
        }
        if (window.MicroFields) {
          window.MicroFields.init(root);
          cleanups.push(function() {
            window.MicroFields.disconnect(root);
          });
        }
        if (suppressFocus && active) root.focus({ preventScroll: true });
        else if (focusKey) {
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
        if (nextModel.phase === "local-saved" && nextModel.destination !== "manage") nextModel.phase = "uncertain";
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
        render();
        return true;
      }
      var api = {
        replace,
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
      instances.set(root, { type, api });
      replace(value);
      return api;
    }
    window.MicroProduct = { register: function(type, renderer) {
      if (renderers.has(type)) throw new Error("Duplicate composition");
      renderers.set(type, renderer);
    }, mount, contextKey: key };
    window.MicroProduct.setLabels = function(partial) {
      var registry = window.MicroLabels = window.MicroLabels || {};
      var current = registry["product-context"] = registry["product-context"] || {};
      var key2;
      for (key2 in partial) {
        if (partial[key2] && Object.prototype.toString.call(partial[key2]) === "[object Object]") {
          current[key2] = current[key2] || {};
          var sub;
          for (sub in partial[key2]) current[key2][sub] = partial[key2][sub];
        } else {
          current[key2] = partial[key2];
        }
      }
    };
  })();
})();
