"use strict";var _regenerator = require("babel-runtime/regenerator");var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}require('babel-polyfill');
var Nick = require("../../lib/Nick");
var Promise = require("bluebird");

var nick = new Nick();

var tab1Promise = nick.newTab().then(function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(tab) {var title;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
						console.log('TAB 1: Opening Google');_context.next = 3;return (
							tab.open('google.com'));case 3:

						console.log('TAB 1: Waiting for the form');_context.next = 6;return (
							tab.waitUntilVisible(['input[name="q"]', 'form[name="f"]']));case 6:

						console.log('TAB 1: Filling the form');_context.next = 9;return (
							tab.fill('form[name="f"]', { q: 'this is just a test' }, { submit: true }));case 9:

						console.log('TAB 1: Waiting for the results');_context.next = 12;return (
							tab.waitUntilVisible('div#navcnt'));case 12:

						console.log('TAB 1: Getting the title');_context.prev = 13;_context.next = 16;return (

							tab.inject('https://code.jquery.com/jquery-3.1.1.slim.min.js'));case 16:_context.next = 21;break;case 18:_context.prev = 18;_context.t0 = _context["catch"](13);

						console.log('TAB 1 inject exception: ' + _context.t0);case 21:_context.next = 23;return (

							tab.evaluate(function (arg, done) {
								done(null, jQuery('title').text());
							}));case 23:title = _context.sent;
						console.log('TAB 1: The title is: ' + title);

						console.log('TAB 1: Closing');_context.next = 28;return (
							tab.close());case 28:case "end":return _context.stop();}}}, _callee, this, [[13, 18]]);}));return function (_x) {return _ref.apply(this, arguments);};}()).

catch(function (err) {
	console.log('An error occurred in TAB 1: ' + err);
});

var tab2Promise = nick.newTab().then(function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(tab) {var title;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
						console.log('TAB 2: Opening Google');_context2.next = 3;return (
							tab.open('google.fr'));case 3:

						console.log('TAB 2: Waiting for the form');_context2.next = 6;return (
							tab.waitUntilVisible(['input[name="q"]', 'form[name="f"]']));case 6:

						console.log('TAB 2: Filling the form');_context2.next = 9;return (
							tab.fill('form[name="f"]', { q: 'phantombuster' }, { submit: true }));case 9:

						console.log('TAB 2: Waiting for the results');_context2.next = 12;return (
							tab.waitUntilVisible('div#navcnt'));case 12:

						console.log('TAB 2: Waiting 5s');_context2.next = 15;return (
							Promise.delay(5000));case 15:
						console.log('TAB 2: Getting the title');_context2.prev = 16;_context2.next = 19;return (

							tab.inject('https://code.jquery.com/jquery-3.1.1.min.js'));case 19:_context2.next = 24;break;case 21:_context2.prev = 21;_context2.t0 = _context2["catch"](16);

						console.log('TAB 2 inject exception: ' + _context2.t0);case 24:_context2.next = 26;return (

							tab.evaluate(function (arg, done) {
								done(null, jQuery('title').text());
							}));case 26:title = _context2.sent;
						console.log('TAB 2: The title is: ' + title);

						console.log('TAB 2: Closing');_context2.next = 31;return (
							tab.close());case 31:case "end":return _context2.stop();}}}, _callee2, this, [[16, 21]]);}));return function (_x2) {return _ref2.apply(this, arguments);};}()).

catch(function (err) {
	console.log('An error occurred in TAB 2: ' + err);
});

Promise.all([tab1Promise, tab2Promise]).then(function () {
	console.log('All tabs have finished');
	nick.exit();
});