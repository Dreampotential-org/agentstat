/*
 Twitter Bootstrap Toogle Buttons 0.0.3
 Available under the MIT license.
 See https://github.com/prokki/twbs-toggle-buttons for more information.
*/
var $jscomp = $jscomp || {}; $jscomp.scope = {}; $jscomp.findInternal = function (a, b, c) { a instanceof String && (a = String(a)); for (var d = a.length, e = 0; e < d; e++) { var f = a[e]; if (b.call(c, f, e, a)) return { i: e, v: f } } return { i: -1, v: void 0 } }; $jscomp.ASSUME_ES5 = !1; $jscomp.ASSUME_NO_NATIVE_MAP = !1; $jscomp.ASSUME_NO_NATIVE_SET = !1; $jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) { a != Array.prototype && a != Object.prototype && (a[b] = c.value) }; $jscomp.getGlobal = function (a) { return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a }; $jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (a, b, c, d) { if (b) { c = $jscomp.global; a = a.split("."); for (d = 0; d < a.length - 1; d++) { var e = a[d]; e in c || (c[e] = {}); c = c[e] } a = a[a.length - 1]; d = c[a]; b = b(d); b != d && null != b && $jscomp.defineProperty(c, a, { configurable: !0, writable: !0, value: b }) } }; $jscomp.polyfill("Array.prototype.find", function (a) { return a ? a : function (a, c) { return $jscomp.findInternal(this, a, c).v } }, "es6", "es3");
var TwbsToggleButtons = function (a, b) { this.$_element = a; this._initializeOptions(b); this._initializeDOM(); this.$_element.find(this._options.twbsBtnSelector).on("click", this._eventClick.bind(this)); this.$_element.data("twbsToggleButtons", this) }; TwbsToggleButtons.TYPE_RADIO = function () { return 1 }; TwbsToggleButtons.TYPE_CHECKBOX = function () { return 2 }; TwbsToggleButtons.DEFAULTS = function () { return { twbsBtnSelector: "[role='button']", classActive: "btn-success", classInactive: "btn-secondary" } };
TwbsToggleButtons.ACTIVE_CLASS = function () { return "active" };
TwbsToggleButtons.prototype._getInputType = function () { var a = 0, b = 0; this.$_element.find(":input").each(function () { if ("radio" === this.getAttribute("type")) a++; else if ("checkbox" === this.getAttribute("type")) b++; else throw "All input fields must be either of type 'radio' or of type 'checkbox, found '" + this.getAttribute("type") + "'"; }); if (0 !== a && 0 !== b) throw "All input fields must be either of type 'radio' or of type 'checkbox, found both."; return 0 < b ? TwbsToggleButtons.TYPE_CHECKBOX() : TwbsToggleButtons.TYPE_RADIO() };
TwbsToggleButtons.prototype._initializeOptions = function (a) { this._options = $.extend({}, TwbsToggleButtons.DEFAULTS(), a || {}); "string" === typeof this._options.classActive && (this._options.classActive = [this._options.classActive]); "string" === typeof this._options.classInactive && (this._options.classInactive = [this._options.classInactive]) }; TwbsToggleButtons.prototype._resetDOM = function (a) { this.$_element.find(this._options.twbsBtnSelector).each(function (b, c) { -1 !== a.indexOf(c) ? this._activateButton(c) : this._deactivateButton(c) }.bind(this)) };
TwbsToggleButtons.prototype._initializeDOM = function () {
    var a = this.$_element.find(this._options.twbsBtnSelector), b = a.filter("." + TwbsToggleButtons.ACTIVE_CLASS()).toArray(); 1 < b.length && this._getInputType() === TwbsToggleButtons.TYPE_RADIO() && (b = [b.pop()]); a.each(function (a, d) { -1 !== b.indexOf(d) ? d.setAttribute("aria-pressed", "true") : d.setAttribute("aria-pressed", "false") }.bind(this)); this._resetDOM(b)
};
TwbsToggleButtons.prototype._eventClick = function (a) {
    var b = this.$_element.find(this._options.twbsBtnSelector).filter(function () { return "true" === this.getAttribute("aria-pressed") }).toArray(), c = a.currentTarget; this._getInputType() === TwbsToggleButtons.TYPE_RADIO() ? (b = [c], "true" === c.getAttribute("aria-pressed") && (0 === this.$_element.find(this._options.twbsBtnSelector).find(":input[required]").length ? b = [] : a.stopPropagation())) : "true" === c.getAttribute("aria-pressed") && -1 !== b.indexOf(c) ? b.splice(b.indexOf(c),
        1) : b.push(c); this._resetDOM(b); window.setTimeout(function () { a.target.dispatchEvent(new Event("twbsToggleButtons:activate")) }, 0); return !0
};
TwbsToggleButtons.prototype._activateButton = function (a) {
    void 0 !== a.dataset.twbsToggleButtonsClassActive && 0 < a.dataset.twbsToggleButtonsClassActive.length ? a.classList.add(a.dataset.twbsToggleButtonsClassActive) : this._options.classActive.forEach(function (b) { a.classList.add(b) }); this._options.classInactive.forEach(function (b) { a.classList.remove(b) }); $(a).find(":input").prop("checked", !0); $(a).find(":input").attr("checked", "checked"); this._getInputType() !== TwbsToggleButtons.TYPE_RADIO() && this._getInputType() !==
        TwbsToggleButtons.TYPE_CHECKBOX() || "false" !== a.getAttribute("aria-pressed") || window.setTimeout(function () { a.classList.remove(TwbsToggleButtons.ACTIVE_CLASS()); a.setAttribute("aria-pressed", "true") }, 0)
};
TwbsToggleButtons.prototype._deactivateButton = function (a) {
    void 0 !== a.dataset.twbsToggleButtonsClassActive && 0 < a.dataset.twbsToggleButtonsClassActive.length && a.classList.remove(a.dataset.twbsToggleButtonsClassActive); this._options.classActive.forEach(function (b) { a.classList.remove(b) }); this._options.classInactive.forEach(function (b) { a.classList.add(b) }); $(a).find(":input").prop("checked", !1); $(a).find(":input").attr("checked", null); this._getInputType() !== TwbsToggleButtons.TYPE_RADIO() && this._getInputType() !==
        TwbsToggleButtons.TYPE_CHECKBOX() || "true" !== a.getAttribute("aria-pressed") || window.setTimeout(function () { a.classList.remove(TwbsToggleButtons.ACTIVE_CLASS()); a.setAttribute("aria-pressed", "false") }, 0)
}; (function (a) {
    null == a.fn.twbsToggleButtons && (a.fn.twbsToggleButtons = function (b) {
        var c = ["clear", "destroy"]; b = b || {}; if ("object" === typeof b) return this.each(function () { var c = a.extend(!0, {}, b); void 0 === a(this).data("twbsToggleButtons") ? new TwbsToggleButtons(a(this), c) : (c = a(this).data("twbsToggleButtons"), null === c && window.console && console.error && console.warn("Error on Initialization as TwbsToggleButtons: " + this)) }), this; if ("string" === typeof b) {
            var d, e = Array.prototype.slice.call(arguments, 1); this.each(function () {
                var c =
                    a(this).data("twbsToggleButtons"); null == c && window.console && console.error ? console.error("The twbsToggleButtons('" + b + "') method was called on an element that is not using TwbsToggleButtons.") : "function" !== typeof c[b] && console.error("Method '" + b + "' is not implemented in TwbsToggleButtons."); d = c[b].apply(c, e)
            }); return -1 < a.inArray(b, c) ? this : d
        } throw Error("Invalid arguments for TwbsToggleButtons: " + b);
    })
})(jQuery);
