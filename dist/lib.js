import { computed as ie, openBlock as Y, createElementBlock as J, normalizeClass as le, createElementVNode as re, normalizeStyle as te, renderSlot as he, Fragment as pe, renderList as ve, createTextVNode as Se, toDisplayString as Ee } from "vue";
var _e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, me = { exports: {} };
/*!
 * ScrollMagic v2.0.8 (2020-08-14)
 * The javascript library for magical scroll interactions.
 * (c) 2020 Jan Paepke (@janpaepke)
 * Project Website: http://scrollmagic.io
 * 
 * @version 2.0.8
 * @license Dual licensed under MIT license and GPL.
 * @author Jan Paepke - e-mail@janpaepke.de
 *
 * @file ScrollMagic main library.
 */
(function(p, x) {
  (function(l, P) {
    p.exports = P();
  })(_e, function() {
    var l = function() {
      r.log(2, "(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use 'new ScrollMagic.Controller()' to create a new controller instance. Use 'new ScrollMagic.Scene()' to instance a scene.");
    };
    l.version = "2.0.8", typeof window < "u" && window.addEventListener("mousewheel", void 0);
    var P = "data-scrollmagic-pin-spacer";
    l.Controller = function(o) {
      var d = "ScrollMagic.Controller", S = "FORWARD", R = "REVERSE", k = "PAUSED", U = T.defaults, i = this, s = r.extend({}, U, o), g = [], E = !1, A = 0, D = k, F = !0, H = 0, u = !0, M, t, c = function() {
        for (var n in s)
          U.hasOwnProperty(n) || (f(2, 'WARNING: Unknown option "' + n + '"'), delete s[n]);
        if (s.container = r.get.elements(s.container)[0], !s.container)
          throw f(1, "ERROR creating object " + d + ": No valid scroll container supplied"), d + " init failed.";
        F = s.container === window || s.container === document.body || !document.body.contains(s.container), F && (s.container = window), H = I(), s.container.addEventListener("resize", q), s.container.addEventListener("scroll", q);
        var y = parseInt(s.refreshInterval, 10);
        s.refreshInterval = r.type.Number(y) ? y : U.refreshInterval, _(), f(3, "added new " + d + " controller (v" + l.version + ")");
      }, _ = function() {
        s.refreshInterval > 0 && (t = window.setTimeout(ne, s.refreshInterval));
      }, L = function() {
        return s.vertical ? r.get.scrollTop(s.container) : r.get.scrollLeft(s.container);
      }, I = function() {
        return s.vertical ? r.get.height(s.container) : r.get.width(s.container);
      }, N = this._setScrollPos = function(n) {
        s.vertical ? F ? window.scrollTo(r.get.scrollLeft(), n) : s.container.scrollTop = n : F ? window.scrollTo(n, r.get.scrollTop()) : s.container.scrollLeft = n;
      }, W = function() {
        if (u && E) {
          var n = r.type.Array(E) ? E : g.slice(0);
          E = !1;
          var y = A;
          A = i.scrollPos();
          var z = A - y;
          z !== 0 && (D = z > 0 ? S : R), D === R && n.reverse(), n.forEach(function($, G) {
            f(3, "updating Scene " + (G + 1) + "/" + n.length + " (" + g.length + " total)"), $.update(!0);
          }), n.length === 0 && s.loglevel >= 3 && f(3, "updating 0 Scenes (nothing added to controller)");
        }
      }, X = function() {
        M = r.rAF(W);
      }, q = function(n) {
        f(3, "event fired causing an update:", n.type), n.type == "resize" && (H = I(), D = k), E !== !0 && (E = !0, X());
      }, ne = function() {
        if (!F && H != I()) {
          var n;
          try {
            n = new Event("resize", {
              bubbles: !1,
              cancelable: !1
            });
          } catch {
            n = document.createEvent("Event"), n.initEvent("resize", !1, !1);
          }
          s.container.dispatchEvent(n);
        }
        g.forEach(function(y, z) {
          y.refresh();
        }), _();
      }, f = this._log = function(n, y) {
        s.loglevel >= n && (Array.prototype.splice.call(arguments, 1, 0, "(" + d + ") ->"), r.log.apply(window, arguments));
      };
      this._options = s;
      var m = function(n) {
        if (n.length <= 1)
          return n;
        var y = n.slice(0);
        return y.sort(function(z, $) {
          return z.scrollOffset() > $.scrollOffset() ? 1 : -1;
        }), y;
      };
      return this.addScene = function(n) {
        if (r.type.Array(n))
          n.forEach(function(z, $) {
            i.addScene(z);
          });
        else if (n instanceof l.Scene) {
          if (n.controller() !== i)
            n.addTo(i);
          else if (g.indexOf(n) < 0) {
            g.push(n), g = m(g), n.on("shift.controller_sort", function() {
              g = m(g);
            });
            for (var y in s.globalSceneOptions)
              n[y] && n[y].call(n, s.globalSceneOptions[y]);
            f(3, "adding Scene (now " + g.length + " total)");
          }
        } else
          f(1, "ERROR: invalid argument supplied for '.addScene()'");
        return i;
      }, this.removeScene = function(n) {
        if (r.type.Array(n))
          n.forEach(function(z, $) {
            i.removeScene(z);
          });
        else {
          var y = g.indexOf(n);
          y > -1 && (n.off("shift.controller_sort"), g.splice(y, 1), f(3, "removing Scene (now " + g.length + " left)"), n.remove());
        }
        return i;
      }, this.updateScene = function(n, y) {
        return r.type.Array(n) ? n.forEach(function(z, $) {
          i.updateScene(z, y);
        }) : y ? n.update(!0) : E !== !0 && n instanceof l.Scene && (E = E || [], E.indexOf(n) == -1 && E.push(n), E = m(E), X()), i;
      }, this.update = function(n) {
        return q({
          type: "resize"
        }), n && W(), i;
      }, this.scrollTo = function(n, y) {
        if (r.type.Number(n))
          N.call(s.container, n, y);
        else if (n instanceof l.Scene)
          n.controller() === i ? i.scrollTo(n.scrollOffset(), y) : f(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", n);
        else if (r.type.Function(n))
          N = n;
        else {
          var z = r.get.elements(n)[0];
          if (z) {
            for (; z.parentNode.hasAttribute(P); )
              z = z.parentNode;
            var $ = s.vertical ? "top" : "left", G = r.get.offset(s.container), K = r.get.offset(z);
            F || (G[$] -= i.scrollPos()), i.scrollTo(K[$] - G[$], y);
          } else
            f(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", n);
        }
        return i;
      }, this.scrollPos = function(n) {
        if (arguments.length)
          r.type.Function(n) ? L = n : f(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'.");
        else
          return L.call(i);
        return i;
      }, this.info = function(n) {
        var y = {
          size: H,
          // contains height or width (in regard to orientation);
          vertical: s.vertical,
          scrollPos: A,
          scrollDirection: D,
          container: s.container,
          isDocument: F
        };
        if (arguments.length) {
          if (y[n] !== void 0)
            return y[n];
          f(1, 'ERROR: option "' + n + '" is not available');
          return;
        } else
          return y;
      }, this.loglevel = function(n) {
        if (arguments.length)
          s.loglevel != n && (s.loglevel = n);
        else
          return s.loglevel;
        return i;
      }, this.enabled = function(n) {
        if (arguments.length)
          u != n && (u = !!n, i.updateScene(g, !0));
        else
          return u;
        return i;
      }, this.destroy = function(n) {
        window.clearTimeout(t);
        for (var y = g.length; y--; )
          g[y].destroy(n);
        return s.container.removeEventListener("resize", q), s.container.removeEventListener("scroll", q), r.cAF(M), f(3, "destroyed " + d + " (reset: " + (n ? "true" : "false") + ")"), null;
      }, c(), i;
    };
    var T = {
      defaults: {
        container: window,
        vertical: !0,
        globalSceneOptions: {},
        loglevel: 2,
        refreshInterval: 100
      }
    };
    l.Controller.addOption = function(o, d) {
      T.defaults[o] = d;
    }, l.Controller.extend = function(o) {
      var d = this;
      l.Controller = function() {
        return d.apply(this, arguments), this.$super = r.extend({}, this), o.apply(this, arguments) || this;
      }, r.extend(l.Controller, d), l.Controller.prototype = d.prototype, l.Controller.prototype.constructor = l.Controller;
    }, l.Scene = function(o) {
      var d = "ScrollMagic.Scene", S = "BEFORE", R = "DURING", k = "AFTER", U = C.defaults, i = this, s = r.extend({}, U, o), g = S, E = 0, A = {
        start: 0,
        end: 0
      }, D = 0, F = !0, H, u, M = function() {
        for (var e in s)
          U.hasOwnProperty(e) || (c(2, 'WARNING: Unknown option "' + e + '"'), delete s[e]);
        for (var a in U)
          ne(a);
        X();
      }, t = {};
      this.on = function(e, a) {
        return r.type.Function(a) ? (e = e.trim().split(" "), e.forEach(function(h) {
          var w = h.split("."), v = w[0], b = w[1];
          v != "*" && (t[v] || (t[v] = []), t[v].push({
            namespace: b || "",
            callback: a
          }));
        })) : c(1, "ERROR when calling '.on()': Supplied callback for '" + e + "' is not a valid function!"), i;
      }, this.off = function(e, a) {
        return e ? (e = e.trim().split(" "), e.forEach(function(h, w) {
          var v = h.split("."), b = v[0], O = v[1] || "", B = b === "*" ? Object.keys(t) : [b];
          B.forEach(function(V) {
            for (var j = t[V] || [], Q = j.length; Q--; ) {
              var ee = j[Q];
              ee && (O === ee.namespace || O === "*") && (!a || a == ee.callback) && j.splice(Q, 1);
            }
            j.length || delete t[V];
          });
        }), i) : (c(1, "ERROR: Invalid event name supplied."), i);
      }, this.trigger = function(e, a) {
        if (e) {
          var h = e.trim().split("."), w = h[0], v = h[1], b = t[w];
          c(3, "event fired:", w, a ? "->" : "", a || ""), b && b.forEach(function(O, B) {
            (!v || v === O.namespace) && O.callback.call(i, new l.Event(w, O.namespace, i, a));
          });
        } else
          c(1, "ERROR: Invalid event name supplied.");
        return i;
      }, i.on("change.internal", function(e) {
        e.what !== "loglevel" && e.what !== "tweenChanges" && (e.what === "triggerElement" ? I() : e.what === "reverse" && i.update());
      }).on("shift.internal", function(e) {
        _(), i.update();
      });
      var c = this._log = function(e, a) {
        s.loglevel >= e && (Array.prototype.splice.call(arguments, 1, 0, "(" + d + ") ->"), r.log.apply(window, arguments));
      };
      this.addTo = function(e) {
        return e instanceof l.Controller ? u != e && (u && u.removeScene(i), u = e, X(), L(!0), I(!0), _(), u.info("container").addEventListener("resize", N), e.addScene(i), i.trigger("add", {
          controller: u
        }), c(3, "added " + d + " to controller"), i.update()) : c(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller"), i;
      }, this.enabled = function(e) {
        if (arguments.length)
          F != e && (F = !!e, i.update(!0));
        else
          return F;
        return i;
      }, this.remove = function() {
        if (u) {
          u.info("container").removeEventListener("resize", N);
          var e = u;
          u = void 0, e.removeScene(i), i.trigger("remove"), c(3, "removed " + d + " from controller");
        }
        return i;
      }, this.destroy = function(e) {
        return i.trigger("destroy", {
          reset: e
        }), i.remove(), i.off("*.*"), c(3, "destroyed " + d + " (reset: " + (e ? "true" : "false") + ")"), null;
      }, this.update = function(e) {
        if (u)
          if (e)
            if (u.enabled() && F) {
              var a = u.info("scrollPos"), h;
              s.duration > 0 ? h = (a - A.start) / (A.end - A.start) : h = a >= A.start ? 1 : 0, i.trigger("update", {
                startPos: A.start,
                endPos: A.end,
                scrollPos: a
              }), i.progress(h);
            } else
              f && g === R && n(!0);
          else
            u.updateScene(i, !1);
        return i;
      }, this.refresh = function() {
        return L(), I(), i;
      }, this.progress = function(e) {
        if (arguments.length) {
          var a = !1, h = g, w = u ? u.info("scrollDirection") : "PAUSED", v = s.reverse || e >= E;
          if (s.duration === 0 ? (a = E != e, E = e < 1 && v ? 0 : 1, g = E === 0 ? S : R) : e < 0 && g !== S && v ? (E = 0, g = S, a = !0) : e >= 0 && e < 1 && v ? (E = e, g = R, a = !0) : e >= 1 && g !== k ? (E = 1, g = k, a = !0) : g === R && !v && n(), a) {
            var b = {
              progress: E,
              state: g,
              scrollDirection: w
            }, O = g != h, B = function(V) {
              i.trigger(V, b);
            };
            O && h !== R && (B("enter"), B(h === S ? "start" : "end")), B("progress"), O && g !== R && (B(g === S ? "start" : "end"), B("leave"));
          }
          return i;
        } else
          return E;
      };
      var _ = function() {
        A = {
          start: D + s.offset
        }, u && s.triggerElement && (A.start -= u.info("size") * s.triggerHook), A.end = A.start + s.duration;
      }, L = function(e) {
        if (H) {
          var a = "duration";
          q(a, H.call(i)) && !e && (i.trigger("change", {
            what: a,
            newval: s[a]
          }), i.trigger("shift", {
            reason: a
          }));
        }
      }, I = function(e) {
        var a = 0, h = s.triggerElement;
        if (u && (h || D > 0)) {
          if (h)
            if (h.parentNode) {
              for (var w = u.info(), v = r.get.offset(w.container), b = w.vertical ? "top" : "left"; h.parentNode.hasAttribute(P); )
                h = h.parentNode;
              var O = r.get.offset(h);
              w.isDocument || (v[b] -= u.scrollPos()), a = O[b] - v[b];
            } else
              c(2, "WARNING: triggerElement was removed from DOM and will be reset to", void 0), i.triggerElement(void 0);
          var B = a != D;
          D = a, B && !e && i.trigger("shift", {
            reason: "triggerElementPosition"
          });
        }
      }, N = function(e) {
        s.triggerHook > 0 && i.trigger("shift", {
          reason: "containerResize"
        });
      }, W = r.extend(C.validate, {
        // validation for duration handled internally for reference to private var _durationMethod
        duration: function(e) {
          if (r.type.String(e) && e.match(/^(\.|\d)*\d+%$/)) {
            var a = parseFloat(e) / 100;
            e = function() {
              return u ? u.info("size") * a : 0;
            };
          }
          if (r.type.Function(e)) {
            H = e;
            try {
              e = parseFloat(H.call(i));
            } catch {
              e = -1;
            }
          }
          if (e = parseFloat(e), !r.type.Number(e) || e < 0)
            throw H ? (H = void 0, ['Invalid return value of supplied function for option "duration":', e]) : ['Invalid value for option "duration":', e];
          return e;
        }
      }), X = function(e) {
        e = arguments.length ? [e] : Object.keys(W), e.forEach(function(a, h) {
          var w;
          if (W[a])
            try {
              w = W[a](s[a]);
            } catch (b) {
              w = U[a];
              var v = r.type.String(b) ? [b] : b;
              r.type.Array(v) ? (v[0] = "ERROR: " + v[0], v.unshift(1), c.apply(this, v)) : c(1, "ERROR: Problem executing validation callback for option '" + a + "':", b.message);
            } finally {
              s[a] = w;
            }
        });
      }, q = function(e, a) {
        var h = !1, w = s[e];
        return s[e] != a && (s[e] = a, X(e), h = w != s[e]), h;
      }, ne = function(e) {
        i[e] || (i[e] = function(a) {
          if (arguments.length)
            e === "duration" && (H = void 0), q(e, a) && (i.trigger("change", {
              what: e,
              newval: s[e]
            }), C.shifts.indexOf(e) > -1 && i.trigger("shift", {
              reason: e
            }));
          else
            return s[e];
          return i;
        });
      };
      this.controller = function() {
        return u;
      }, this.state = function() {
        return g;
      }, this.scrollOffset = function() {
        return A.start;
      }, this.triggerPosition = function() {
        var e = s.offset;
        return u && (s.triggerElement ? e += D : e += u.info("size") * i.triggerHook()), e;
      };
      var f, m;
      i.on("shift.internal", function(e) {
        var a = e.reason === "duration";
        (g === k && a || g === R && s.duration === 0) && n(), a && y();
      }).on("progress.internal", function(e) {
        n();
      }).on("add.internal", function(e) {
        y();
      }).on("destroy.internal", function(e) {
        i.removePin(e.reset);
      });
      var n = function(e) {
        if (f && u) {
          var a = u.info(), h = m.spacer.firstChild;
          if (!e && g === R) {
            r.css(h, "position") != "fixed" && (r.css(h, {
              position: "fixed"
            }), y());
            var w = r.get.offset(m.spacer, !0), v = s.reverse || s.duration === 0 ? a.scrollPos - A.start : Math.round(E * s.duration * 10) / 10;
            w[a.vertical ? "top" : "left"] += v, r.css(m.spacer.firstChild, {
              top: w.top,
              left: w.left
            });
          } else {
            var b = {
              position: m.inFlow ? "relative" : "absolute",
              top: 0,
              left: 0
            }, O = r.css(h, "position") != b.position;
            m.pushFollowers ? s.duration > 0 && (g === k && parseFloat(r.css(m.spacer, "padding-top")) === 0 || g === S && parseFloat(r.css(m.spacer, "padding-bottom")) === 0) && (O = !0) : b[a.vertical ? "top" : "left"] = s.duration * E, r.css(h, b), O && y();
          }
        }
      }, y = function() {
        if (f && u && m.inFlow) {
          var e = g === R, a = u.info("vertical"), h = m.spacer.firstChild, w = r.isMarginCollapseType(r.css(m.spacer, "display")), v = {};
          m.relSize.width || m.relSize.autoFullWidth ? e ? r.css(f, {
            width: r.get.width(m.spacer)
          }) : r.css(f, {
            width: "100%"
          }) : (v["min-width"] = r.get.width(a ? f : h, !0, !0), v.width = e ? v["min-width"] : "auto"), m.relSize.height ? e ? r.css(f, {
            height: r.get.height(m.spacer) - (m.pushFollowers ? s.duration : 0)
          }) : r.css(f, {
            height: "100%"
          }) : (v["min-height"] = r.get.height(a ? h : f, !0, !w), v.height = e ? v["min-height"] : "auto"), m.pushFollowers && (v["padding" + (a ? "Top" : "Left")] = s.duration * E, v["padding" + (a ? "Bottom" : "Right")] = s.duration * (1 - E)), r.css(m.spacer, v);
        }
      }, z = function() {
        u && f && g === R && !u.info("isDocument") && n();
      }, $ = function() {
        u && f && // well, duh
        g === R && // element in pinned state?
        // is width or height relatively sized, but not in relation to body? then we need to recalc.
        ((m.relSize.width || m.relSize.autoFullWidth) && r.get.width(window) != r.get.width(m.spacer.parentNode) || m.relSize.height && r.get.height(window) != r.get.height(m.spacer.parentNode)) && y();
      }, G = function(e) {
        u && f && g === R && !u.info("isDocument") && (e.preventDefault(), u._setScrollPos(u.info("scrollPos") - ((e.wheelDelta || e[u.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || -e.detail * 30)));
      };
      this.setPin = function(e, a) {
        var h = {
          pushFollowers: !0,
          spacerClass: "scrollmagic-pin-spacer"
        }, w = a && a.hasOwnProperty("pushFollowers");
        if (a = r.extend({}, h, a), e = r.get.elements(e)[0], e) {
          if (r.css(e, "position") === "fixed")
            return c(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'."), i;
        } else
          return c(1, "ERROR calling method 'setPin()': Invalid pin element supplied."), i;
        if (f) {
          if (f === e)
            return i;
          i.removePin();
        }
        f = e;
        var v = f.parentNode.style.display, b = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
        f.parentNode.style.display = "none";
        var O = r.css(f, "position") != "absolute", B = r.css(f, b.concat(["display"])), V = r.css(f, ["width", "height"]);
        f.parentNode.style.display = v, !O && a.pushFollowers && (c(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled."), a.pushFollowers = !1), window.setTimeout(function() {
          f && s.duration === 0 && w && a.pushFollowers && c(2, "WARNING: pushFollowers =", !0, "has no effect, when scene duration is 0.");
        }, 0);
        var j = f.parentNode.insertBefore(document.createElement("div"), f), Q = r.extend(B, {
          position: O ? "relative" : "absolute",
          boxSizing: "content-box",
          mozBoxSizing: "content-box",
          webkitBoxSizing: "content-box"
        });
        if (O || r.extend(Q, r.css(f, ["width", "height"])), r.css(j, Q), j.setAttribute(P, ""), r.addClass(j, a.spacerClass), m = {
          spacer: j,
          relSize: {
            // save if size is defined using % values. if so, handle spacer resize differently...
            width: V.width.slice(-1) === "%",
            height: V.height.slice(-1) === "%",
            autoFullWidth: V.width === "auto" && O && r.isMarginCollapseType(B.display)
          },
          pushFollowers: a.pushFollowers,
          inFlow: O
          // stores if the element takes up space in the document flow
        }, !f.___origStyle) {
          f.___origStyle = {};
          var ee = f.style, ye = b.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
          ye.forEach(function(ge) {
            f.___origStyle[ge] = ee[ge] || "";
          });
        }
        return m.relSize.width && r.css(j, {
          width: V.width
        }), m.relSize.height && r.css(j, {
          height: V.height
        }), j.appendChild(f), r.css(f, {
          position: O ? "relative" : "absolute",
          margin: "auto",
          top: "auto",
          left: "auto",
          bottom: "auto",
          right: "auto"
        }), (m.relSize.width || m.relSize.autoFullWidth) && r.css(f, {
          boxSizing: "border-box",
          mozBoxSizing: "border-box",
          webkitBoxSizing: "border-box"
        }), window.addEventListener("scroll", z), window.addEventListener("resize", z), window.addEventListener("resize", $), f.addEventListener("mousewheel", G), f.addEventListener("DOMMouseScroll", G), c(3, "added pin"), n(), i;
      }, this.removePin = function(e) {
        if (f) {
          if (g === R && n(!0), e || !u) {
            var a = m.spacer.firstChild;
            if (a.hasAttribute(P)) {
              var h = m.spacer.style, w = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"], v = {};
              w.forEach(function(b) {
                v[b] = h[b] || "";
              }), r.css(a, v);
            }
            m.spacer.parentNode.insertBefore(a, m.spacer), m.spacer.parentNode.removeChild(m.spacer), f.parentNode.hasAttribute(P) || (r.css(f, f.___origStyle), delete f.___origStyle);
          }
          window.removeEventListener("scroll", z), window.removeEventListener("resize", z), window.removeEventListener("resize", $), f.removeEventListener("mousewheel", G), f.removeEventListener("DOMMouseScroll", G), f = void 0, c(3, "removed pin (reset: " + (e ? "true" : "false") + ")");
        }
        return i;
      };
      var K, Z = [];
      return i.on("destroy.internal", function(e) {
        i.removeClassToggle(e.reset);
      }), this.setClassToggle = function(e, a) {
        var h = r.get.elements(e);
        return h.length === 0 || !r.type.String(a) ? (c(1, "ERROR calling method 'setClassToggle()': Invalid " + (h.length === 0 ? "element" : "classes") + " supplied."), i) : (Z.length > 0 && i.removeClassToggle(), K = a, Z = h, i.on("enter.internal_class leave.internal_class", function(w) {
          var v = w.type === "enter" ? r.addClass : r.removeClass;
          Z.forEach(function(b, O) {
            v(b, K);
          });
        }), i);
      }, this.removeClassToggle = function(e) {
        return e && Z.forEach(function(a, h) {
          r.removeClass(a, K);
        }), i.off("start.internal_class end.internal_class"), K = void 0, Z = [], i;
      }, M(), i;
    };
    var C = {
      defaults: {
        duration: 0,
        offset: 0,
        triggerElement: void 0,
        triggerHook: 0.5,
        reverse: !0,
        loglevel: 2
      },
      validate: {
        offset: function(o) {
          if (o = parseFloat(o), !r.type.Number(o))
            throw ['Invalid value for option "offset":', o];
          return o;
        },
        triggerElement: function(o) {
          if (o = o || void 0, o) {
            var d = r.get.elements(o)[0];
            if (d && d.parentNode)
              o = d;
            else
              throw ['Element defined in option "triggerElement" was not found:', o];
          }
          return o;
        },
        triggerHook: function(o) {
          var d = {
            onCenter: 0.5,
            onEnter: 1,
            onLeave: 0
          };
          if (r.type.Number(o))
            o = Math.max(0, Math.min(parseFloat(o), 1));
          else if (o in d)
            o = d[o];
          else
            throw ['Invalid value for option "triggerHook": ', o];
          return o;
        },
        reverse: function(o) {
          return !!o;
        },
        loglevel: function(o) {
          if (o = parseInt(o), !r.type.Number(o) || o < 0 || o > 3)
            throw ['Invalid value for option "loglevel":', o];
          return o;
        }
      },
      // holder for  validation methods. duration validation is handled in 'getters-setters.js'
      shifts: ["duration", "offset", "triggerHook"]
      // list of options that trigger a `shift` event
    };
    l.Scene.addOption = function(o, d, S, R) {
      o in C.defaults ? l._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + o + "', because it already exists.") : (C.defaults[o] = d, C.validate[o] = S, R && C.shifts.push(o));
    }, l.Scene.extend = function(o) {
      var d = this;
      l.Scene = function() {
        return d.apply(this, arguments), this.$super = r.extend({}, this), o.apply(this, arguments) || this;
      }, r.extend(l.Scene, d), l.Scene.prototype = d.prototype, l.Scene.prototype.constructor = l.Scene;
    }, l.Event = function(o, d, S, R) {
      R = R || {};
      for (var k in R)
        this[k] = R[k];
      return this.type = o, this.target = this.currentTarget = S, this.namespace = d || "", this.timeStamp = this.timestamp = Date.now(), this;
    };
    var r = l._util = function(o) {
      var d = {}, S, R = function(t) {
        return parseFloat(t) || 0;
      }, k = function(t) {
        return t.currentStyle ? t.currentStyle : o.getComputedStyle(t);
      }, U = function(t, c, _, L) {
        if (c = c === document ? o : c, c === o)
          L = !1;
        else if (!u.DomElement(c))
          return 0;
        t = t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
        var I = (_ ? c["offset" + t] || c["outer" + t] : c["client" + t] || c["inner" + t]) || 0;
        if (_ && L) {
          var N = k(c);
          I += t === "Height" ? R(N.marginTop) + R(N.marginBottom) : R(N.marginLeft) + R(N.marginRight);
        }
        return I;
      }, i = function(t) {
        return t.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function(c) {
          return c[1].toUpperCase();
        });
      };
      d.extend = function(t) {
        for (t = t || {}, S = 1; S < arguments.length; S++)
          if (arguments[S])
            for (var c in arguments[S])
              arguments[S].hasOwnProperty(c) && (t[c] = arguments[S][c]);
        return t;
      }, d.isMarginCollapseType = function(t) {
        return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(t) > -1;
      };
      var s = 0, g = ["ms", "moz", "webkit", "o"], E = o.requestAnimationFrame, A = o.cancelAnimationFrame;
      for (S = 0; !E && S < g.length; ++S)
        E = o[g[S] + "RequestAnimationFrame"], A = o[g[S] + "CancelAnimationFrame"] || o[g[S] + "CancelRequestAnimationFrame"];
      E || (E = function(t) {
        var c = (/* @__PURE__ */ new Date()).getTime(), _ = Math.max(0, 16 - (c - s)), L = o.setTimeout(function() {
          t(c + _);
        }, _);
        return s = c + _, L;
      }), A || (A = function(t) {
        o.clearTimeout(t);
      }), d.rAF = E.bind(o), d.cAF = A.bind(o);
      var D = ["error", "warn", "log"], F = o.console || {};
      for (F.log = F.log || function() {
      }, S = 0; S < D.length; S++) {
        var H = D[S];
        F[H] || (F[H] = F.log);
      }
      d.log = function(t) {
        (t > D.length || t <= 0) && (t = D.length);
        var c = /* @__PURE__ */ new Date(), _ = ("0" + c.getHours()).slice(-2) + ":" + ("0" + c.getMinutes()).slice(-2) + ":" + ("0" + c.getSeconds()).slice(-2) + ":" + ("00" + c.getMilliseconds()).slice(-3), L = D[t - 1], I = Array.prototype.splice.call(arguments, 1), N = Function.prototype.bind.call(F[L], F);
        I.unshift(_), N.apply(F, I);
      };
      var u = d.type = function(t) {
        return Object.prototype.toString.call(t).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
      };
      u.String = function(t) {
        return u(t) === "string";
      }, u.Function = function(t) {
        return u(t) === "function";
      }, u.Array = function(t) {
        return Array.isArray(t);
      }, u.Number = function(t) {
        return !u.Array(t) && t - parseFloat(t) + 1 >= 0;
      }, u.DomElement = function(t) {
        return typeof HTMLElement == "object" || typeof HTMLElement == "function" ? t instanceof HTMLElement || t instanceof SVGElement : (
          //DOM2
          t && typeof t == "object" && t !== null && t.nodeType === 1 && typeof t.nodeName == "string"
        );
      };
      var M = d.get = {};
      return M.elements = function(t) {
        var c = [];
        if (u.String(t))
          try {
            t = document.querySelectorAll(t);
          } catch {
            return c;
          }
        if (u(t) === "nodelist" || u.Array(t) || t instanceof NodeList)
          for (var _ = 0, L = c.length = t.length; _ < L; _++) {
            var I = t[_];
            c[_] = u.DomElement(I) ? I : M.elements(I);
          }
        else
          (u.DomElement(t) || t === document || t === o) && (c = [t]);
        return c;
      }, M.scrollTop = function(t) {
        return t && typeof t.scrollTop == "number" ? t.scrollTop : o.pageYOffset || 0;
      }, M.scrollLeft = function(t) {
        return t && typeof t.scrollLeft == "number" ? t.scrollLeft : o.pageXOffset || 0;
      }, M.width = function(t, c, _) {
        return U("width", t, c, _);
      }, M.height = function(t, c, _) {
        return U("height", t, c, _);
      }, M.offset = function(t, c) {
        var _ = {
          top: 0,
          left: 0
        };
        if (t && t.getBoundingClientRect) {
          var L = t.getBoundingClientRect();
          _.top = L.top, _.left = L.left, c || (_.top += M.scrollTop(), _.left += M.scrollLeft());
        }
        return _;
      }, d.addClass = function(t, c) {
        c && (t.classList ? t.classList.add(c) : t.className += " " + c);
      }, d.removeClass = function(t, c) {
        c && (t.classList ? t.classList.remove(c) : t.className = t.className.replace(new RegExp("(^|\\b)" + c.split(" ").join("|") + "(\\b|$)", "gi"), " "));
      }, d.css = function(t, c) {
        if (u.String(c))
          return k(t)[i(c)];
        if (u.Array(c)) {
          var _ = {}, L = k(t);
          return c.forEach(function(W, X) {
            _[W] = L[i(W)];
          }), _;
        } else
          for (var I in c) {
            var N = c[I];
            N == parseFloat(N) && (N += "px"), t.style[i(I)] = N;
          }
      }, d;
    }(window || {});
    return l.Scene.prototype.addIndicators = function() {
      return l._util.log(1, "(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"), this;
    }, l.Scene.prototype.removeIndicators = function() {
      return l._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"), this;
    }, l.Scene.prototype.setTween = function() {
      return l._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"), this;
    }, l.Scene.prototype.removeTween = function() {
      return l._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"), this;
    }, l.Scene.prototype.setVelocity = function() {
      return l._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"), this;
    }, l.Scene.prototype.removeVelocity = function() {
      return l._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"), this;
    }, l;
  });
})(me);
var oe = me.exports;
function we(p, x, l, P) {
  var T;
  return function() {
    var r = P || this, o = arguments, d = function() {
      T = null, l || p.apply(r, o);
    }, S = l && !T;
    clearTimeout(T), T = setTimeout(d, x), S && p.apply(r, o);
  };
}
function se() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}
function be(p) {
  const x = /(px|vw|vh|%|em|rem)/i;
  return {
    original: p,
    value: parseFloat(p.replace(x, "")),
    unit: p.match(x)[0]
  };
}
const ae = Symbol(), ce = Symbol(), ue = Symbol(), fe = Symbol(), Le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ACTIVE_INDEX: ae,
  PROGRESS: ue,
  SCROLLTO: fe,
  TRIGGERS: ce
}, Symbol.toStringTag, { value: "Module" })), de = (p, x) => {
  const l = p.__vccOpts || p;
  for (const [P, T] of x)
    l[P] = T;
  return l;
}, Re = {
  name: "ScrollShow",
  props: {
    /**
     * The amount of slide to create (since they are simulated)
     * - Future could support array (other prop different heights?)
     */
    scenes: {
      type: [Number, Array],
      required: !0
    },
    /**
     * How long (in unitless pixels) a scene should be
     * - Optionally pass a function (given scene index)
     * - Or pass a string that uses [px, %, vh] 
     *   (with percentages being based on windowHeight)
     */
    sceneHeight: {
      type: [Function, String, Number],
      default: () => se()
    },
    /**
     * Accepts the same options as sceneHeight but for setting 
     * the height of the presentation
     */
    height: {
      type: [Function, String, Number],
      default: () => se()
    }
  },
  data() {
    return {
      progress: 0,
      progressTicking: !1,
      activeIndex: 0,
      triggers: this.createTriggers(),
      active: !1,
      // Else it is after
      scrollDirection: null,
      resolvedHeight: this.resolveHeight(this.height)
    };
  },
  provide() {
    return {
      [ae]: ie(() => this.activeIndex),
      [ue]: ie(() => this.progress),
      [ce]: ie(() => this.triggers),
      [fe]: (p) => this.scrollTo(p)
    };
  },
  computed: {
    totalHeight() {
      const { triggers: p } = this;
      return p.reduce((x, l) => x + l.height, 0);
    },
    duration() {
      const { totalHeight: p, resolvedHeight: x } = this;
      return p - x;
    }
  },
  methods: {
    resolveHeight(p, ...x) {
      const l = typeof p;
      if (l === "function")
        return p(...x);
      if (l === "number")
        return p;
      if (l === "string")
        return this.resolveCssUnit(p);
      throw Error("Unable to resolve height, expected string, number or function:", p);
    },
    resolveCssUnit(p) {
      const { unit: x, value: l } = be(p);
      return ["vh", "%"].includes(x) ? se() * (l / 100) : l;
    },
    toPx(p) {
      return p + "px";
    },
    createTriggers() {
      const { scenes: p, resolveHeight: x, sceneHeight: l } = this, P = typeof p == "number" ? { length: p } : p;
      return Array.from(P, (T, C) => {
        const r = {
          height: 0,
          scene: null,
          element: null
        }, o = () => {
          r.height = x(T ?? l, C);
        };
        return r.updateHeight = o, r.updateHeight(), r;
      });
    },
    destroy() {
      this.controller.destroy(!0);
    },
    update() {
      this.destroy(), this.triggers = this.createTriggers(), this.resolvedHeight = this.resolveHeight(this.height), this.$nextTick(() => {
        this.initialize();
      });
    },
    // Navigated to another scene programmatically (dots use this)
    scrollTo(p) {
      this.controller.scrollTo(this.triggers[p].scene), this.$emit("scrollTo", p);
    },
    resize() {
      this.triggers.forEach((p) => p.updateHeight()), this.mainScene.duration(this.duration), this.$emit("afterResize");
    },
    initialize() {
      const { duration: p } = this, { container: x } = this.$refs;
      this.controller = new oe.Controller(), this.triggers.forEach((l, P) => {
        const { element: T } = l;
        l.scene = new oe.Scene({
          triggerElement: T,
          triggerHook: 0.5,
          duration: l.height
        }).on("enter", () => {
          this.activeIndex = P, this.$emit("sceneChange", P);
        }).addTo(this.controller);
      }), this.mainScene = new oe.Scene({
        triggerElement: x,
        triggerHook: 0,
        duration: p
      }).on("enter", ({ scrollDirection: l }) => {
        this.active = !0, this.scrollDirection = l, this.$emit("enter", { scrollDirection: l });
      }).on("start", ({ scrollDirection: l }) => {
        l === "REVERSE" && (this.active = !1, this.scrollDirection = l, this.$emit("exit", { scrollDirection: l }));
      }).on("end", ({ state: l, scrollDirection: P }) => {
        l === "AFTER" && (this.active = !1, this.$emit("exit", { scrollDirection: P }));
      }).on("progress", (l) => {
        this.$emit("progress", l), this.progressTicking || (window.requestAnimationFrame(() => {
          this.progress = l.progress, this.progressTicking = !1;
        }), this.progressTicking = !0);
      }).addTo(this.controller), this.$emit("initialized");
    }
  },
  mounted() {
    this.$nextTick(() => this.initialize()), this.reziseHandler = we(this.resize, 500, !1, this), window.addEventListener("resize", this.reziseHandler);
  },
  beforeUnmount() {
    this.destroy(), window.removeEventListener("resize", this.reziseHandler);
  }
};
function Te(p, x, l, P, T, C) {
  return Y(), J("div", {
    class: le(["scroll-show", { "scroll-show--active": T.active }]),
    ref: "container"
  }, [
    re("div", {
      class: "scroll-show__presentation",
      ref: "presentation",
      style: te({ height: C.toPx(T.resolvedHeight) })
    }, [
      he(p.$slots, "default", {
        activeIndex: T.activeIndex,
        progress: T.progress,
        scrollTo: C.scrollTo,
        triggers: T.triggers,
        active: T.active,
        scrollDirection: T.scrollDirection,
        resolvedHeight: T.resolvedHeight
      })
    ], 4),
    re("div", {
      class: "scroll-show__triggers",
      ref: "triggers",
      style: te({
        marginTop: `-${C.toPx(T.resolvedHeight)}`
      })
    }, [
      (Y(!0), J(pe, null, ve(T.triggers, (r, o) => (Y(), J("div", {
        class: "scroll-show__trigger",
        key: o,
        style: te({ height: C.toPx(r.height) }),
        ref_for: !0,
        ref: (d) => {
          r.element = d;
        }
      }, null, 4))), 128))
    ], 4)
  ], 2);
}
const Ne = /* @__PURE__ */ de(Re, [["render", Te]]), Ce = {
  name: "ScrollShowNav",
  inject: {
    activeIndex: { from: ae },
    triggers: { from: ce },
    scrollTo: { from: fe }
  }
}, Oe = { class: "scroll-show__nav" }, xe = ["onClick", "aria-label"];
function Pe(p, x, l, P, T, C) {
  return Y(), J("ul", Oe, [
    (Y(!0), J(pe, null, ve(C.triggers, (r, o) => (Y(), J("li", {
      class: le(["scroll-show__nav-item", { "is-active": o === C.activeIndex }]),
      key: o
    }, [
      re("button", {
        onClick: (d) => C.scrollTo(o),
        class: le(["scroll-show__nav-button", { "is-active": o === C.activeIndex }]),
        "aria-label": `goto part ${o}`
      }, [
        he(p.$slots, "nav", {
          index: o,
          active: o === C.activeIndex
        }, () => [
          Se(Ee(o + 1), 1)
        ])
      ], 10, xe)
    ], 2))), 128))
  ]);
}
const De = /* @__PURE__ */ de(Ce, [["render", Pe]]), Ae = {
  name: "ScrollShowProgress",
  inject: {
    progress: { from: ue }
  }
}, ze = { class: "scroll-show__progress" };
function Fe(p, x, l, P, T, C) {
  return Y(), J("div", ze, [
    re("div", {
      class: "scroll-show__progress-bar",
      style: te({ transform: `scaleX(${C.progress})` })
    }, null, 4)
  ]);
}
const He = /* @__PURE__ */ de(Ae, [["render", Fe]]);
export {
  Ne as ScrollShow,
  De as ScrollShowNav,
  He as ScrollShowProgress,
  Le as symbols
};
