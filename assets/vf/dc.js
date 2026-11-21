/* VFINAL runtime: mounts a Claude Design board (the approved source, unchanged) as a production page.
   The canvas engine (support.js) is not exportable, so this file supplies the small contract the boards use:
   - DCLogic: a component base with state / setState / renderVals, componentDidMount / componentWillUnmount;
   - {{name}} bindings in attributes and text nodes, re-applied after every setState;
   - on<Event>="{{fn}}" attributes become event listeners (native events; the boards read key, target,
     currentTarget, pointer coordinates and call preventDefault, which native events provide).
   One board per page load: a theme or range change reloads the page, so no board is ever mounted twice. */
(function () {
  'use strict';
  var BOOL = { disabled: 1, hidden: 1, checked: 1, selected: 1, inert: 1, open: 1, readonly: 1, required: 1 };
  var RX = /\{\{\s*([\w$]+)\s*\}\}/g;

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (p, cb) {
    if (typeof p === 'function') p = p(this.state, this.props);
    if (p) for (var k in p) this.state[k] = p[k];
    if (this.__dc) this.__dc.render();
    if (cb) cb();
  };
  DCLogic.prototype.renderVals = function () { return {}; };
  window.DCLogic = DCLogic;

  function bind(root) {
    var out = [], walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType === 1 && /^(SCRIPT|STYLE|TEXTAREA)$/.test(n.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      if (n.nodeType === 3) {
        if (n.nodeValue.indexOf('{{') >= 0) out.push({ t: 'x', n: n, s: n.nodeValue });
        continue;
      }
      var at = [].slice.call(n.attributes);
      for (var i = 0; i < at.length; i++) {
        var a = at[i], v = a.value;
        if (v.indexOf('{{') < 0) continue;
        if (/^on/i.test(a.name)) {
          var m = /^\{\{\s*([\w$]+)\s*\}\}$/.exec(v);
          n.removeAttribute(a.name);
          if (m) out.push({ t: 'e', n: n, ev: a.name.slice(2).toLowerCase(), k: m[1] });
          continue;
        }
        out.push({ t: 'a', n: n, a: a.name, s: v, b: !!BOOL[a.name.toLowerCase()] });
      }
    }
    return out;
  }

  function fill(s, v) { return s.replace(RX, function (_, k) { var x = v[k]; return x == null ? '' : String(x); }); }

  function apply(bs, v) {
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i];
      if (b.t === 'x') { var t = fill(b.s, v); if (b.n.nodeValue !== t) b.n.nodeValue = t; }
      else if (b.t === 'a') {
        var val = fill(b.s, v);
        if (b.b && (val === 'false' || val === '')) { if (b.n.hasAttribute(b.a)) b.n.removeAttribute(b.a); }
        else if (b.n.getAttribute(b.a) !== val) b.n.setAttribute(b.a, val);
      } else {
        if (!b.n.__dch) b.n.__dch = {};
        if (!(b.ev in b.n.__dch)) {
          (function (el, ev) { el.addEventListener(ev, function (e) { var f = el.__dch[ev]; if (typeof f === 'function') return f(e); }); })(b.n, b.ev);
        }
        b.n.__dch[b.ev] = v[b.k];
      }
    }
  }

  /* mount(doc): doc is the parsed board (DOMParser). Moves its <x-dc> into the page, runs the component, then the
     board's trailing plain scripts in order. */
  function mount(doc, host) {
    var xdc = doc.querySelector('x-dc');
    var src = doc.querySelector('script[type="text/x-dc"]');
    var after = [].filter.call(doc.querySelectorAll('body > script'), function (s) { return s !== src && !s.src; });
    var el = document.importNode(xdc, true);
    (host || document.body).appendChild(el);
    var props = {};
    try { props = JSON.parse(src.getAttribute('data-props') || '{}'); } catch (e) {}
    var bs = bind(el), comp = null;
    try {
      var C = new Function('DCLogic', src.textContent + '\n;return typeof Component !== "undefined" ? Component : null;')(DCLogic);
      if (C) comp = new C(props);
    } catch (e) { setTimeout(function () { throw e; }); }
    if (comp) {
      var queued = false;
      comp.__dc = { render: function () { apply(bs, comp.renderVals()); } };
      comp.__dc.render();
      if (comp.componentDidMount) comp.componentDidMount();
    } else apply(bs, {});
    [].forEach.call(el.querySelectorAll('script'), function (s) {
      if (s.type && !/javascript|module/.test(s.type)) return;
      var r = document.createElement('script'); r.textContent = s.textContent; s.parentNode.replaceChild(r, s);
    });
    after.forEach(function (s) { var r = document.createElement('script'); if (s.id) r.id = s.id; r.textContent = s.textContent; document.body.appendChild(r); });
    return { el: el, comp: comp, unmount: function () { if (comp && comp.componentWillUnmount) try { comp.componentWillUnmount(); } catch (e) {} if (el.parentNode) el.parentNode.removeChild(el); } };
  }

  window.VFDC = { mount: mount };
})();
