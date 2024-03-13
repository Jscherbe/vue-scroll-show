import { computed as re, openBlock as Y, createElementBlock as J, normalizeClass as se, createElementVNode as ne, normalizeStyle as te, renderSlot as ge, createTextVNode as he, toDisplayString as pe, Fragment as ve, renderList as me } from "vue";
var Ee = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ye = { exports: {} };
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
(function(E, R) {
  (function(c, F) {
    E.exports = F();
  })(Ee, function() {
    var c = function() {
      n.log(2, "(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use 'new ScrollMagic.Controller()' to create a new controller instance. Use 'new ScrollMagic.Scene()' to instance a scene.");
    };
    c.version = "2.0.8", typeof window < "u" && window.addEventListener("mousewheel", void 0);
    var F = "data-scrollmagic-pin-spacer";
    c.Controller = function(o) {
      var d = "ScrollMagic.Controller", y = "FORWARD", T = "REVERSE", M = "PAUSED", V = N.defaults, r = this, s = n.extend({}, V, o), g = [], S = !1, O = 0, D = M, I = !0, k = 0, u = !0, $, t, a = function() {
        for (var i in s)
          V.hasOwnProperty(i) || (f(2, 'WARNING: Unknown option "' + i + '"'), delete s[i]);
        if (s.container = n.get.elements(s.container)[0], !s.container)
          throw f(1, "ERROR creating object " + d + ": No valid scroll container supplied"), d + " init failed.";
        I = s.container === window || s.container === document.body || !document.body.contains(s.container), I && (s.container = window), k = P(), s.container.addEventListener("resize", q), s.container.addEventListener("scroll", q);
        var m = parseInt(s.refreshInterval, 10);
        s.refreshInterval = n.type.Number(m) ? m : V.refreshInterval, _(), f(3, "added new " + d + " controller (v" + c.version + ")");
      }, _ = function() {
        s.refreshInterval > 0 && (t = window.setTimeout(ie, s.refreshInterval));
      }, z = function() {
        return s.vertical ? n.get.scrollTop(s.container) : n.get.scrollLeft(s.container);
      }, P = function() {
        return s.vertical ? n.get.height(s.container) : n.get.width(s.container);
      }, L = this._setScrollPos = function(i) {
        s.vertical ? I ? window.scrollTo(n.get.scrollLeft(), i) : s.container.scrollTop = i : I ? window.scrollTo(i, n.get.scrollTop()) : s.container.scrollLeft = i;
      }, W = function() {
        if (u && S) {
          var i = n.type.Array(S) ? S : g.slice(0);
          S = !1;
          var m = O;
          O = r.scrollPos();
          var x = O - m;
          x !== 0 && (D = x > 0 ? y : T), D === T && i.reverse(), i.forEach(function(H, G) {
            f(3, "updating Scene " + (G + 1) + "/" + i.length + " (" + g.length + " total)"), H.update(!0);
          }), i.length === 0 && s.loglevel >= 3 && f(3, "updating 0 Scenes (nothing added to controller)");
        }
      }, X = function() {
        $ = n.rAF(W);
      }, q = function(i) {
        f(3, "event fired causing an update:", i.type), i.type == "resize" && (k = P(), D = M), S !== !0 && (S = !0, X());
      }, ie = function() {
        if (!I && k != P()) {
          var i;
          try {
            i = new Event("resize", {
              bubbles: !1,
              cancelable: !1
            });
          } catch {
            i = document.createEvent("Event"), i.initEvent("resize", !1, !1);
          }
          s.container.dispatchEvent(i);
        }
        g.forEach(function(m, x) {
          m.refresh();
        }), _();
      }, f = this._log = function(i, m) {
        s.loglevel >= i && (Array.prototype.splice.call(arguments, 1, 0, "(" + d + ") ->"), n.log.apply(window, arguments));
      };
      this._options = s;
      var v = function(i) {
        if (i.length <= 1)
          return i;
        var m = i.slice(0);
        return m.sort(function(x, H) {
          return x.scrollOffset() > H.scrollOffset() ? 1 : -1;
        }), m;
      };
      return this.addScene = function(i) {
        if (n.type.Array(i))
          i.forEach(function(x, H) {
            r.addScene(x);
          });
        else if (i instanceof c.Scene) {
          if (i.controller() !== r)
            i.addTo(r);
          else if (g.indexOf(i) < 0) {
            g.push(i), g = v(g), i.on("shift.controller_sort", function() {
              g = v(g);
            });
            for (var m in s.globalSceneOptions)
              i[m] && i[m].call(i, s.globalSceneOptions[m]);
            f(3, "adding Scene (now " + g.length + " total)");
          }
        } else
          f(1, "ERROR: invalid argument supplied for '.addScene()'");
        return r;
      }, this.removeScene = function(i) {
        if (n.type.Array(i))
          i.forEach(function(x, H) {
            r.removeScene(x);
          });
        else {
          var m = g.indexOf(i);
          m > -1 && (i.off("shift.controller_sort"), g.splice(m, 1), f(3, "removing Scene (now " + g.length + " left)"), i.remove());
        }
        return r;
      }, this.updateScene = function(i, m) {
        return n.type.Array(i) ? i.forEach(function(x, H) {
          r.updateScene(x, m);
        }) : m ? i.update(!0) : S !== !0 && i instanceof c.Scene && (S = S || [], S.indexOf(i) == -1 && S.push(i), S = v(S), X()), r;
      }, this.update = function(i) {
        return q({
          type: "resize"
        }), i && W(), r;
      }, this.scrollTo = function(i, m) {
        if (n.type.Number(i))
          L.call(s.container, i, m);
        else if (i instanceof c.Scene)
          i.controller() === r ? r.scrollTo(i.scrollOffset(), m) : f(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", i);
        else if (n.type.Function(i))
          L = i;
        else {
          var x = n.get.elements(i)[0];
          if (x) {
            for (; x.parentNode.hasAttribute(F); )
              x = x.parentNode;
            var H = s.vertical ? "top" : "left", G = n.get.offset(s.container), K = n.get.offset(x);
            I || (G[H] -= r.scrollPos()), r.scrollTo(K[H] - G[H], m);
          } else
            f(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", i);
        }
        return r;
      }, this.scrollPos = function(i) {
        if (arguments.length)
          n.type.Function(i) ? z = i : f(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'.");
        else
          return z.call(r);
        return r;
      }, this.info = function(i) {
        var m = {
          size: k,
          // contains height or width (in regard to orientation);
          vertical: s.vertical,
          scrollPos: O,
          scrollDirection: D,
          container: s.container,
          isDocument: I
        };
        if (arguments.length) {
          if (m[i] !== void 0)
            return m[i];
          f(1, 'ERROR: option "' + i + '" is not available');
          return;
        } else
          return m;
      }, this.loglevel = function(i) {
        if (arguments.length)
          s.loglevel != i && (s.loglevel = i);
        else
          return s.loglevel;
        return r;
      }, this.enabled = function(i) {
        if (arguments.length)
          u != i && (u = !!i, r.updateScene(g, !0));
        else
          return u;
        return r;
      }, this.destroy = function(i) {
        window.clearTimeout(t);
        for (var m = g.length; m--; )
          g[m].destroy(i);
        return s.container.removeEventListener("resize", q), s.container.removeEventListener("scroll", q), n.cAF($), f(3, "destroyed " + d + " (reset: " + (i ? "true" : "false") + ")"), null;
      }, a(), r;
    };
    var N = {
      defaults: {
        container: window,
        vertical: !0,
        globalSceneOptions: {},
        loglevel: 2,
        refreshInterval: 100
      }
    };
    c.Controller.addOption = function(o, d) {
      N.defaults[o] = d;
    }, c.Controller.extend = function(o) {
      var d = this;
      c.Controller = function() {
        return d.apply(this, arguments), this.$super = n.extend({}, this), o.apply(this, arguments) || this;
      }, n.extend(c.Controller, d), c.Controller.prototype = d.prototype, c.Controller.prototype.constructor = c.Controller;
    }, c.Scene = function(o) {
      var d = "ScrollMagic.Scene", y = "BEFORE", T = "DURING", M = "AFTER", V = A.defaults, r = this, s = n.extend({}, V, o), g = y, S = 0, O = {
        start: 0,
        end: 0
      }, D = 0, I = !0, k, u, $ = function() {
        for (var e in s)
          V.hasOwnProperty(e) || (a(2, 'WARNING: Unknown option "' + e + '"'), delete s[e]);
        for (var l in V)
          ie(l);
        X();
      }, t = {};
      this.on = function(e, l) {
        return n.type.Function(l) ? (e = e.trim().split(" "), e.forEach(function(h) {
          var w = h.split("."), p = w[0], b = w[1];
          p != "*" && (t[p] || (t[p] = []), t[p].push({
            namespace: b || "",
            callback: l
          }));
        })) : a(1, "ERROR when calling '.on()': Supplied callback for '" + e + "' is not a valid function!"), r;
      }, this.off = function(e, l) {
        return e ? (e = e.trim().split(" "), e.forEach(function(h, w) {
          var p = h.split("."), b = p[0], C = p[1] || "", B = b === "*" ? Object.keys(t) : [b];
          B.forEach(function(U) {
            for (var j = t[U] || [], Q = j.length; Q--; ) {
              var ee = j[Q];
              ee && (C === ee.namespace || C === "*") && (!l || l == ee.callback) && j.splice(Q, 1);
            }
            j.length || delete t[U];
          });
        }), r) : (a(1, "ERROR: Invalid event name supplied."), r);
      }, this.trigger = function(e, l) {
        if (e) {
          var h = e.trim().split("."), w = h[0], p = h[1], b = t[w];
          a(3, "event fired:", w, l ? "->" : "", l || ""), b && b.forEach(function(C, B) {
            (!p || p === C.namespace) && C.callback.call(r, new c.Event(w, C.namespace, r, l));
          });
        } else
          a(1, "ERROR: Invalid event name supplied.");
        return r;
      }, r.on("change.internal", function(e) {
        e.what !== "loglevel" && e.what !== "tweenChanges" && (e.what === "triggerElement" ? P() : e.what === "reverse" && r.update());
      }).on("shift.internal", function(e) {
        _(), r.update();
      });
      var a = this._log = function(e, l) {
        s.loglevel >= e && (Array.prototype.splice.call(arguments, 1, 0, "(" + d + ") ->"), n.log.apply(window, arguments));
      };
      this.addTo = function(e) {
        return e instanceof c.Controller ? u != e && (u && u.removeScene(r), u = e, X(), z(!0), P(!0), _(), u.info("container").addEventListener("resize", L), e.addScene(r), r.trigger("add", {
          controller: u
        }), a(3, "added " + d + " to controller"), r.update()) : a(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller"), r;
      }, this.enabled = function(e) {
        if (arguments.length)
          I != e && (I = !!e, r.update(!0));
        else
          return I;
        return r;
      }, this.remove = function() {
        if (u) {
          u.info("container").removeEventListener("resize", L);
          var e = u;
          u = void 0, e.removeScene(r), r.trigger("remove"), a(3, "removed " + d + " from controller");
        }
        return r;
      }, this.destroy = function(e) {
        return r.trigger("destroy", {
          reset: e
        }), r.remove(), r.off("*.*"), a(3, "destroyed " + d + " (reset: " + (e ? "true" : "false") + ")"), null;
      }, this.update = function(e) {
        if (u)
          if (e)
            if (u.enabled() && I) {
              var l = u.info("scrollPos"), h;
              s.duration > 0 ? h = (l - O.start) / (O.end - O.start) : h = l >= O.start ? 1 : 0, r.trigger("update", {
                startPos: O.start,
                endPos: O.end,
                scrollPos: l
              }), r.progress(h);
            } else
              f && g === T && i(!0);
          else
            u.updateScene(r, !1);
        return r;
      }, this.refresh = function() {
        return z(), P(), r;
      }, this.progress = function(e) {
        if (arguments.length) {
          var l = !1, h = g, w = u ? u.info("scrollDirection") : "PAUSED", p = s.reverse || e >= S;
          if (s.duration === 0 ? (l = S != e, S = e < 1 && p ? 0 : 1, g = S === 0 ? y : T) : e < 0 && g !== y && p ? (S = 0, g = y, l = !0) : e >= 0 && e < 1 && p ? (S = e, g = T, l = !0) : e >= 1 && g !== M ? (S = 1, g = M, l = !0) : g === T && !p && i(), l) {
            var b = {
              progress: S,
              state: g,
              scrollDirection: w
            }, C = g != h, B = function(U) {
              r.trigger(U, b);
            };
            C && h !== T && (B("enter"), B(h === y ? "start" : "end")), B("progress"), C && g !== T && (B(g === y ? "start" : "end"), B("leave"));
          }
          return r;
        } else
          return S;
      };
      var _ = function() {
        O = {
          start: D + s.offset
        }, u && s.triggerElement && (O.start -= u.info("size") * s.triggerHook), O.end = O.start + s.duration;
      }, z = function(e) {
        if (k) {
          var l = "duration";
          q(l, k.call(r)) && !e && (r.trigger("change", {
            what: l,
            newval: s[l]
          }), r.trigger("shift", {
            reason: l
          }));
        }
      }, P = function(e) {
        var l = 0, h = s.triggerElement;
        if (u && (h || D > 0)) {
          if (h)
            if (h.parentNode) {
              for (var w = u.info(), p = n.get.offset(w.container), b = w.vertical ? "top" : "left"; h.parentNode.hasAttribute(F); )
                h = h.parentNode;
              var C = n.get.offset(h);
              w.isDocument || (p[b] -= u.scrollPos()), l = C[b] - p[b];
            } else
              a(2, "WARNING: triggerElement was removed from DOM and will be reset to", void 0), r.triggerElement(void 0);
          var B = l != D;
          D = l, B && !e && r.trigger("shift", {
            reason: "triggerElementPosition"
          });
        }
      }, L = function(e) {
        s.triggerHook > 0 && r.trigger("shift", {
          reason: "containerResize"
        });
      }, W = n.extend(A.validate, {
        // validation for duration handled internally for reference to private var _durationMethod
        duration: function(e) {
          if (n.type.String(e) && e.match(/^(\.|\d)*\d+%$/)) {
            var l = parseFloat(e) / 100;
            e = function() {
              return u ? u.info("size") * l : 0;
            };
          }
          if (n.type.Function(e)) {
            k = e;
            try {
              e = parseFloat(k.call(r));
            } catch {
              e = -1;
            }
          }
          if (e = parseFloat(e), !n.type.Number(e) || e < 0)
            throw k ? (k = void 0, ['Invalid return value of supplied function for option "duration":', e]) : ['Invalid value for option "duration":', e];
          return e;
        }
      }), X = function(e) {
        e = arguments.length ? [e] : Object.keys(W), e.forEach(function(l, h) {
          var w;
          if (W[l])
            try {
              w = W[l](s[l]);
            } catch (b) {
              w = V[l];
              var p = n.type.String(b) ? [b] : b;
              n.type.Array(p) ? (p[0] = "ERROR: " + p[0], p.unshift(1), a.apply(this, p)) : a(1, "ERROR: Problem executing validation callback for option '" + l + "':", b.message);
            } finally {
              s[l] = w;
            }
        });
      }, q = function(e, l) {
        var h = !1, w = s[e];
        return s[e] != l && (s[e] = l, X(e), h = w != s[e]), h;
      }, ie = function(e) {
        r[e] || (r[e] = function(l) {
          if (arguments.length)
            e === "duration" && (k = void 0), q(e, l) && (r.trigger("change", {
              what: e,
              newval: s[e]
            }), A.shifts.indexOf(e) > -1 && r.trigger("shift", {
              reason: e
            }));
          else
            return s[e];
          return r;
        });
      };
      this.controller = function() {
        return u;
      }, this.state = function() {
        return g;
      }, this.scrollOffset = function() {
        return O.start;
      }, this.triggerPosition = function() {
        var e = s.offset;
        return u && (s.triggerElement ? e += D : e += u.info("size") * r.triggerHook()), e;
      };
      var f, v;
      r.on("shift.internal", function(e) {
        var l = e.reason === "duration";
        (g === M && l || g === T && s.duration === 0) && i(), l && m();
      }).on("progress.internal", function(e) {
        i();
      }).on("add.internal", function(e) {
        m();
      }).on("destroy.internal", function(e) {
        r.removePin(e.reset);
      });
      var i = function(e) {
        if (f && u) {
          var l = u.info(), h = v.spacer.firstChild;
          if (!e && g === T) {
            n.css(h, "position") != "fixed" && (n.css(h, {
              position: "fixed"
            }), m());
            var w = n.get.offset(v.spacer, !0), p = s.reverse || s.duration === 0 ? l.scrollPos - O.start : Math.round(S * s.duration * 10) / 10;
            w[l.vertical ? "top" : "left"] += p, n.css(v.spacer.firstChild, {
              top: w.top,
              left: w.left
            });
          } else {
            var b = {
              position: v.inFlow ? "relative" : "absolute",
              top: 0,
              left: 0
            }, C = n.css(h, "position") != b.position;
            v.pushFollowers ? s.duration > 0 && (g === M && parseFloat(n.css(v.spacer, "padding-top")) === 0 || g === y && parseFloat(n.css(v.spacer, "padding-bottom")) === 0) && (C = !0) : b[l.vertical ? "top" : "left"] = s.duration * S, n.css(h, b), C && m();
          }
        }
      }, m = function() {
        if (f && u && v.inFlow) {
          var e = g === T, l = u.info("vertical"), h = v.spacer.firstChild, w = n.isMarginCollapseType(n.css(v.spacer, "display")), p = {};
          v.relSize.width || v.relSize.autoFullWidth ? e ? n.css(f, {
            width: n.get.width(v.spacer)
          }) : n.css(f, {
            width: "100%"
          }) : (p["min-width"] = n.get.width(l ? f : h, !0, !0), p.width = e ? p["min-width"] : "auto"), v.relSize.height ? e ? n.css(f, {
            height: n.get.height(v.spacer) - (v.pushFollowers ? s.duration : 0)
          }) : n.css(f, {
            height: "100%"
          }) : (p["min-height"] = n.get.height(l ? h : f, !0, !w), p.height = e ? p["min-height"] : "auto"), v.pushFollowers && (p["padding" + (l ? "Top" : "Left")] = s.duration * S, p["padding" + (l ? "Bottom" : "Right")] = s.duration * (1 - S)), n.css(v.spacer, p);
        }
      }, x = function() {
        u && f && g === T && !u.info("isDocument") && i();
      }, H = function() {
        u && f && // well, duh
        g === T && // element in pinned state?
        // is width or height relatively sized, but not in relation to body? then we need to recalc.
        ((v.relSize.width || v.relSize.autoFullWidth) && n.get.width(window) != n.get.width(v.spacer.parentNode) || v.relSize.height && n.get.height(window) != n.get.height(v.spacer.parentNode)) && m();
      }, G = function(e) {
        u && f && g === T && !u.info("isDocument") && (e.preventDefault(), u._setScrollPos(u.info("scrollPos") - ((e.wheelDelta || e[u.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || -e.detail * 30)));
      };
      this.setPin = function(e, l) {
        var h = {
          pushFollowers: !0,
          spacerClass: "scrollmagic-pin-spacer"
        }, w = l && l.hasOwnProperty("pushFollowers");
        if (l = n.extend({}, h, l), e = n.get.elements(e)[0], e) {
          if (n.css(e, "position") === "fixed")
            return a(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'."), r;
        } else
          return a(1, "ERROR calling method 'setPin()': Invalid pin element supplied."), r;
        if (f) {
          if (f === e)
            return r;
          r.removePin();
        }
        f = e;
        var p = f.parentNode.style.display, b = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
        f.parentNode.style.display = "none";
        var C = n.css(f, "position") != "absolute", B = n.css(f, b.concat(["display"])), U = n.css(f, ["width", "height"]);
        f.parentNode.style.display = p, !C && l.pushFollowers && (a(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled."), l.pushFollowers = !1), window.setTimeout(function() {
          f && s.duration === 0 && w && l.pushFollowers && a(2, "WARNING: pushFollowers =", !0, "has no effect, when scene duration is 0.");
        }, 0);
        var j = f.parentNode.insertBefore(document.createElement("div"), f), Q = n.extend(B, {
          position: C ? "relative" : "absolute",
          boxSizing: "content-box",
          mozBoxSizing: "content-box",
          webkitBoxSizing: "content-box"
        });
        if (C || n.extend(Q, n.css(f, ["width", "height"])), n.css(j, Q), j.setAttribute(F, ""), n.addClass(j, l.spacerClass), v = {
          spacer: j,
          relSize: {
            // save if size is defined using % values. if so, handle spacer resize differently...
            width: U.width.slice(-1) === "%",
            height: U.height.slice(-1) === "%",
            autoFullWidth: U.width === "auto" && C && n.isMarginCollapseType(B.display)
          },
          pushFollowers: l.pushFollowers,
          inFlow: C
          // stores if the element takes up space in the document flow
        }, !f.___origStyle) {
          f.___origStyle = {};
          var ee = f.style, Se = b.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
          Se.forEach(function(de) {
            f.___origStyle[de] = ee[de] || "";
          });
        }
        return v.relSize.width && n.css(j, {
          width: U.width
        }), v.relSize.height && n.css(j, {
          height: U.height
        }), j.appendChild(f), n.css(f, {
          position: C ? "relative" : "absolute",
          margin: "auto",
          top: "auto",
          left: "auto",
          bottom: "auto",
          right: "auto"
        }), (v.relSize.width || v.relSize.autoFullWidth) && n.css(f, {
          boxSizing: "border-box",
          mozBoxSizing: "border-box",
          webkitBoxSizing: "border-box"
        }), window.addEventListener("scroll", x), window.addEventListener("resize", x), window.addEventListener("resize", H), f.addEventListener("mousewheel", G), f.addEventListener("DOMMouseScroll", G), a(3, "added pin"), i(), r;
      }, this.removePin = function(e) {
        if (f) {
          if (g === T && i(!0), e || !u) {
            var l = v.spacer.firstChild;
            if (l.hasAttribute(F)) {
              var h = v.spacer.style, w = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"], p = {};
              w.forEach(function(b) {
                p[b] = h[b] || "";
              }), n.css(l, p);
            }
            v.spacer.parentNode.insertBefore(l, v.spacer), v.spacer.parentNode.removeChild(v.spacer), f.parentNode.hasAttribute(F) || (n.css(f, f.___origStyle), delete f.___origStyle);
          }
          window.removeEventListener("scroll", x), window.removeEventListener("resize", x), window.removeEventListener("resize", H), f.removeEventListener("mousewheel", G), f.removeEventListener("DOMMouseScroll", G), f = void 0, a(3, "removed pin (reset: " + (e ? "true" : "false") + ")");
        }
        return r;
      };
      var K, Z = [];
      return r.on("destroy.internal", function(e) {
        r.removeClassToggle(e.reset);
      }), this.setClassToggle = function(e, l) {
        var h = n.get.elements(e);
        return h.length === 0 || !n.type.String(l) ? (a(1, "ERROR calling method 'setClassToggle()': Invalid " + (h.length === 0 ? "element" : "classes") + " supplied."), r) : (Z.length > 0 && r.removeClassToggle(), K = l, Z = h, r.on("enter.internal_class leave.internal_class", function(w) {
          var p = w.type === "enter" ? n.addClass : n.removeClass;
          Z.forEach(function(b, C) {
            p(b, K);
          });
        }), r);
      }, this.removeClassToggle = function(e) {
        return e && Z.forEach(function(l, h) {
          n.removeClass(l, K);
        }), r.off("start.internal_class end.internal_class"), K = void 0, Z = [], r;
      }, $(), r;
    };
    var A = {
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
          if (o = parseFloat(o), !n.type.Number(o))
            throw ['Invalid value for option "offset":', o];
          return o;
        },
        triggerElement: function(o) {
          if (o = o || void 0, o) {
            var d = n.get.elements(o)[0];
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
          if (n.type.Number(o))
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
          if (o = parseInt(o), !n.type.Number(o) || o < 0 || o > 3)
            throw ['Invalid value for option "loglevel":', o];
          return o;
        }
      },
      // holder for  validation methods. duration validation is handled in 'getters-setters.js'
      shifts: ["duration", "offset", "triggerHook"]
      // list of options that trigger a `shift` event
    };
    c.Scene.addOption = function(o, d, y, T) {
      o in A.defaults ? c._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + o + "', because it already exists.") : (A.defaults[o] = d, A.validate[o] = y, T && A.shifts.push(o));
    }, c.Scene.extend = function(o) {
      var d = this;
      c.Scene = function() {
        return d.apply(this, arguments), this.$super = n.extend({}, this), o.apply(this, arguments) || this;
      }, n.extend(c.Scene, d), c.Scene.prototype = d.prototype, c.Scene.prototype.constructor = c.Scene;
    }, c.Event = function(o, d, y, T) {
      T = T || {};
      for (var M in T)
        this[M] = T[M];
      return this.type = o, this.target = this.currentTarget = y, this.namespace = d || "", this.timeStamp = this.timestamp = Date.now(), this;
    };
    var n = c._util = function(o) {
      var d = {}, y, T = function(t) {
        return parseFloat(t) || 0;
      }, M = function(t) {
        return t.currentStyle ? t.currentStyle : o.getComputedStyle(t);
      }, V = function(t, a, _, z) {
        if (a = a === document ? o : a, a === o)
          z = !1;
        else if (!u.DomElement(a))
          return 0;
        t = t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
        var P = (_ ? a["offset" + t] || a["outer" + t] : a["client" + t] || a["inner" + t]) || 0;
        if (_ && z) {
          var L = M(a);
          P += t === "Height" ? T(L.marginTop) + T(L.marginBottom) : T(L.marginLeft) + T(L.marginRight);
        }
        return P;
      }, r = function(t) {
        return t.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function(a) {
          return a[1].toUpperCase();
        });
      };
      d.extend = function(t) {
        for (t = t || {}, y = 1; y < arguments.length; y++)
          if (arguments[y])
            for (var a in arguments[y])
              arguments[y].hasOwnProperty(a) && (t[a] = arguments[y][a]);
        return t;
      }, d.isMarginCollapseType = function(t) {
        return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(t) > -1;
      };
      var s = 0, g = ["ms", "moz", "webkit", "o"], S = o.requestAnimationFrame, O = o.cancelAnimationFrame;
      for (y = 0; !S && y < g.length; ++y)
        S = o[g[y] + "RequestAnimationFrame"], O = o[g[y] + "CancelAnimationFrame"] || o[g[y] + "CancelRequestAnimationFrame"];
      S || (S = function(t) {
        var a = (/* @__PURE__ */ new Date()).getTime(), _ = Math.max(0, 16 - (a - s)), z = o.setTimeout(function() {
          t(a + _);
        }, _);
        return s = a + _, z;
      }), O || (O = function(t) {
        o.clearTimeout(t);
      }), d.rAF = S.bind(o), d.cAF = O.bind(o);
      var D = ["error", "warn", "log"], I = o.console || {};
      for (I.log = I.log || function() {
      }, y = 0; y < D.length; y++) {
        var k = D[y];
        I[k] || (I[k] = I.log);
      }
      d.log = function(t) {
        (t > D.length || t <= 0) && (t = D.length);
        var a = /* @__PURE__ */ new Date(), _ = ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2) + ":" + ("0" + a.getSeconds()).slice(-2) + ":" + ("00" + a.getMilliseconds()).slice(-3), z = D[t - 1], P = Array.prototype.splice.call(arguments, 1), L = Function.prototype.bind.call(I[z], I);
        P.unshift(_), L.apply(I, P);
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
      var $ = d.get = {};
      return $.elements = function(t) {
        var a = [];
        if (u.String(t))
          try {
            t = document.querySelectorAll(t);
          } catch {
            return a;
          }
        if (u(t) === "nodelist" || u.Array(t) || t instanceof NodeList)
          for (var _ = 0, z = a.length = t.length; _ < z; _++) {
            var P = t[_];
            a[_] = u.DomElement(P) ? P : $.elements(P);
          }
        else
          (u.DomElement(t) || t === document || t === o) && (a = [t]);
        return a;
      }, $.scrollTop = function(t) {
        return t && typeof t.scrollTop == "number" ? t.scrollTop : o.pageYOffset || 0;
      }, $.scrollLeft = function(t) {
        return t && typeof t.scrollLeft == "number" ? t.scrollLeft : o.pageXOffset || 0;
      }, $.width = function(t, a, _) {
        return V("width", t, a, _);
      }, $.height = function(t, a, _) {
        return V("height", t, a, _);
      }, $.offset = function(t, a) {
        var _ = {
          top: 0,
          left: 0
        };
        if (t && t.getBoundingClientRect) {
          var z = t.getBoundingClientRect();
          _.top = z.top, _.left = z.left, a || (_.top += $.scrollTop(), _.left += $.scrollLeft());
        }
        return _;
      }, d.addClass = function(t, a) {
        a && (t.classList ? t.classList.add(a) : t.className += " " + a);
      }, d.removeClass = function(t, a) {
        a && (t.classList ? t.classList.remove(a) : t.className = t.className.replace(new RegExp("(^|\\b)" + a.split(" ").join("|") + "(\\b|$)", "gi"), " "));
      }, d.css = function(t, a) {
        if (u.String(a))
          return M(t)[r(a)];
        if (u.Array(a)) {
          var _ = {}, z = M(t);
          return a.forEach(function(W, X) {
            _[W] = z[r(W)];
          }), _;
        } else
          for (var P in a) {
            var L = a[P];
            L == parseFloat(L) && (L += "px"), t.style[r(P)] = L;
          }
      }, d;
    }(window || {});
    return c.Scene.prototype.addIndicators = function() {
      return c._util.log(1, "(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"), this;
    }, c.Scene.prototype.removeIndicators = function() {
      return c._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"), this;
    }, c.Scene.prototype.setTween = function() {
      return c._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"), this;
    }, c.Scene.prototype.removeTween = function() {
      return c._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"), this;
    }, c.Scene.prototype.setVelocity = function() {
      return c._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"), this;
    }, c.Scene.prototype.removeVelocity = function() {
      return c._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"), this;
    }, c;
  });
})(ye);
var oe = ye.exports;
function _e(E, R, c, F) {
  var N;
  return function() {
    var n = F || this, o = arguments, d = function() {
      N = null, c || E.apply(n, o);
    }, y = c && !N;
    clearTimeout(N), N = setTimeout(d, R), y && E.apply(n, o);
  };
}
const le = Symbol(), ae = Symbol(), ce = Symbol(), ue = Symbol(), Le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ACTIVE_INDEX: le,
  PROGRESS: ce,
  SCROLLTO: ue,
  TRIGGERS: ae
}, Symbol.toStringTag, { value: "Module" })), fe = (E, R) => {
  const c = E.__vccOpts || E;
  for (const [F, N] of R)
    c[F] = N;
  return c;
};
let we = 0;
const Re = {
  name: "ScrollShow",
  props: {
    /**
     * The amount of scenes to create (since they are simulated)
     * - Future could support array (other prop different heights?)
     */
    scenes: {
      type: [Number, Array],
      required: !0
    },
    /**
     * How long (in css units) a scene should be
     * - Optionally pass a function (given scene index)
     */
    sceneHeight: {
      type: [Function, String],
      default: "100dvh"
    },
    /**
     * Accepts the same options as sceneHeight but for setting 
     * the height of the presentation
     */
    height: {
      type: [Function, String],
      default: "200dvh"
    }
  },
  data() {
    return {
      progress: 0,
      progressTicking: !1,
      activeIndex: 0,
      active: !1,
      // Else it is after
      scrollDirection: null
    };
  },
  provide() {
    return {
      [le]: re(() => this.activeIndex),
      [ce]: re(() => this.progress),
      [ae]: re(() => this.triggers),
      [ue]: (E) => this.scrollTo(E)
    };
  },
  computed: {
    triggers() {
      const { scenes: E } = this, R = typeof E == "number" ? { length: E } : E;
      return Array.from(R, (c, F) => ({
        height: this.resolveHeight(c ?? this.sceneHeight, F),
        scene: null,
        id: this.getId("t")
      }));
    }
  },
  methods: {
    getId(E) {
      return `ulu-vss-${E}-${++we}`;
    },
    resolveHeight(E, ...R) {
      const c = typeof E;
      if (c === "function")
        return E(...R);
      if (c === "string")
        return E;
      throw Error("Unable to resolve height, expected string or function:", E);
    },
    /**
     * Height of whole scene minus the presentation (so it completes by the time it unsticks)
     */
    getMainDuration() {
      const { triggers: E, presentation: R } = this.$refs;
      return E.clientHeight - R.clientHeight;
    },
    destroy() {
      this.controller.destroy(!0);
    },
    // Navigated to another scene programmatically (dots use this)
    scrollTo(E) {
      const R = this.triggers[E];
      R && (this.controller.scrollTo(document.getElementById(R.id)), this.$emit("scrollTo", { index: E }));
    },
    resize() {
      this.mainScene.duration(this.getMainDuration()), this.$emit("afterResize");
    },
    initialize() {
      const { container: E } = this.$refs;
      this.controller = new oe.Controller(), this.triggerScenes = this.triggers.map((R, c) => {
        const F = document.getElementById(R.id);
        return new oe.Scene({
          triggerElement: F,
          triggerHook: 0.5,
          duration: "100%"
        }).on("enter", () => {
          this.activeIndex = c, this.$emit("sceneChange", { index: c });
        }).addTo(this.controller);
      }), this.mainScene = new oe.Scene({
        triggerElement: E,
        triggerHook: 0,
        duration: this.getMainDuration()
      }).on("enter", ({ scrollDirection: R }) => {
        this.active = !0, this.scrollDirection = R, this.$emit("enter", { scrollDirection: R });
      }).on("start", ({ scrollDirection: R }) => {
        R === "REVERSE" && (this.active = !1, this.scrollDirection = R, this.$emit("exit", { scrollDirection: R }));
      }).on("end", ({ state: R, scrollDirection: c }) => {
        R === "AFTER" && (this.active = !1, this.$emit("exit", { scrollDirection: c }));
      }).on("progress", (R) => {
        this.$emit("progress", R), this.progressTicking || (window.requestAnimationFrame(() => {
          this.progress = R.progress, this.progressTicking = !1;
        }), this.progressTicking = !0);
      }).addTo(this.controller), this.$emit("initialized");
    },
    update() {
      this.destroy(), this.$nextTick(() => {
        this.initialize();
      });
    }
  },
  watch: {
    scenes() {
      this.update();
    },
    sceneHeight() {
      this.update();
    },
    height() {
      this.update();
    }
  },
  mounted() {
    this.$nextTick(() => this.initialize()), this.reziseHandler = _e(this.resize, 500, !1, this), window.addEventListener("resize", this.reziseHandler);
  },
  beforeUnmount() {
    this.destroy(), window.removeEventListener("resize", this.reziseHandler);
  }
}, be = ["id"];
function Te(E, R, c, F, N, A) {
  return Y(), J("div", {
    class: se(["scroll-show", { "scroll-show--active": N.active }]),
    ref: "container"
  }, [
    ne("div", {
      class: "scroll-show__presentation",
      ref: "presentation",
      style: te({ height: c.height })
    }, [
      ge(E.$slots, "default", {
        activeIndex: N.activeIndex,
        progress: N.progress,
        scrollTo: A.scrollTo,
        triggers: A.triggers,
        active: N.active,
        scrollDirection: N.scrollDirection
      })
    ], 4),
    ne("div", {
      class: "scroll-show__triggers",
      ref: "triggers",
      style: te({
        marginTop: `-${c.height}`
      })
    }, [
      he(pe(console.log(`-${c.height}`)) + " ", 1),
      (Y(!0), J(ve, null, me(A.triggers, (n) => (Y(), J("div", {
        class: "scroll-show__trigger",
        key: n.id,
        style: te({ height: n.height }),
        id: n.id
      }, null, 12, be))), 128))
    ], 4)
  ], 2);
}
const Ne = /* @__PURE__ */ fe(Re, [["render", Te]]), Ce = {
  name: "ScrollShowNav",
  inject: {
    activeIndex: { from: le },
    triggers: { from: ae },
    scrollTo: { from: ue }
  }
}, Oe = { class: "scroll-show__nav" }, xe = ["onClick", "aria-label"];
function Ie(E, R, c, F, N, A) {
  return Y(), J("ul", Oe, [
    (Y(!0), J(ve, null, me(A.triggers, (n, o) => (Y(), J("li", {
      class: se(["scroll-show__nav-item", { "is-active": o === A.activeIndex }]),
      key: o
    }, [
      ne("button", {
        onClick: (d) => A.scrollTo(o),
        class: se(["scroll-show__nav-button", { "is-active": o === A.activeIndex }]),
        "aria-label": `goto part ${o}`
      }, [
        ge(E.$slots, "nav", {
          index: o,
          active: o === A.activeIndex
        }, () => [
          he(pe(o + 1), 1)
        ])
      ], 10, xe)
    ], 2))), 128))
  ]);
}
const De = /* @__PURE__ */ fe(Ce, [["render", Ie]]), Ae = {
  name: "ScrollShowProgress",
  inject: {
    progress: { from: ce }
  }
}, Pe = { class: "scroll-show__progress" };
function ze(E, R, c, F, N, A) {
  return Y(), J("div", Pe, [
    ne("div", {
      class: "scroll-show__progress-bar",
      style: te({ transform: `scaleX(${A.progress})` })
    }, null, 4)
  ]);
}
const ke = /* @__PURE__ */ fe(Ae, [["render", ze]]);
export {
  Ne as ScrollShow,
  De as ScrollShowNav,
  ke as ScrollShowProgress,
  Le as symbols
};
