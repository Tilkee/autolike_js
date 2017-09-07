"use strict";var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _ = require("lodash");
var TabDriver = require("./TabDriver");var

BrowserDriver = function () {

	function BrowserDriver(nick) {(0, _classCallCheck3.default)(this, BrowserDriver);
		this._nick = nick;
		this._options = nick.options;
	}(0, _createClass3.default)(BrowserDriver, [{ key: "exit", value: function exit(

		code) {
			phantom.exit(code);
		} }, { key: "_initialize", value: function _initialize(

		callback) {



			callback(null);
		} }, { key: "_newTabDriver", value: function _newTabDriver(

		uniqueTabId, callback) {
			callback(null, new TabDriver(uniqueTabId, this._options));
		} }, { key: "_getAllCookies", value: function _getAllCookies(

		callback) {
			callback(null, phantom.cookies);
		} }, { key: "_deleteAllCookies", value: function _deleteAllCookies(

		callback) {
			try {

				phantom.clearCookies();
			} catch (e) {
				callback("deleteAllCookies: failed to delete all cookies: " + e.toString());
				return;
			}
			callback(null);
		} }, { key: "_deleteCookie", value: function _deleteCookie(

		name, domain, callback) {


			try {

				var ret = phantom.deleteCookie(name);
			} catch (e) {
				callback("deleteCookie: failed to delete cookie \"" + cookie.name + "\": " + e.toString());
				return;
			}
			if (ret) {
				callback(null);
			} else {
				callback("deleteCookie: failed to delete cookie \"" + cookie.name + "\"");
			}
		} }, { key: "_setCookie", value: function _setCookie(

		cookie, callback) {

			var domain = cookie.domain;
			if (domain.trim().toLowerCase().indexOf("http://") === 0 || domain.trim().toLowerCase().indexOf("https://") === 0) {
				callback("setCookie: cannot set cookie \"" + cookie.name + "\": specify a domain instead of an URL (" + domain + ")");
				return;
			}
			if (domain[0] !== ".") {
				domain = "." + domain;
			}
			var c = {
				name: cookie.name,
				value: cookie.value,
				domain: domain,
				path: "/",
				expires: Date.now() + 365 * 24 * 60 * 60 * 1000 };

			if (_.has(cookie, "secure")) {
				c.secure = cookie.secure;
			}
			if (_.has(cookie, "httpOnly")) {
				c.httponly = cookie.httpOnly;
			}
			try {

				var ret = phantom.addCookie(c);
			} catch (e) {
				callback("setCookie: failed to add cookie \"" + cookie.name + "\": " + e.toString());
				return;
			}
			if (ret) {
				callback(null);
			} else {
				callback("setCookie: failed to add cookie \"" + cookie.name + "\"");
			}
		} }]);return BrowserDriver;}();




module.exports = BrowserDriver;