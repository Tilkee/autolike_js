"use strict";var _regenerator = require("babel-runtime/regenerator");var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _stringify = require("babel-runtime/core-js/json/stringify");var _stringify2 = _interopRequireDefault(_stringify);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}require('babel-polyfill');
var Nick = require("../../lib/Nick");
var Promise = require("bluebird");

var nick = new Nick();

console.log((0, _stringify2.default)(nick.options, undefined, 2));

nick.newTab().then(function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(tab) {var openRet, test, content, url, title;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
							tab.open('google.com'));case 2:openRet = _context.sent;
						console.log((0, _stringify2.default)(openRet, undefined, 2));_context.next = 6;return (

							tab.evaluate(function (arg, done) {
								//__utils__.echo(arg)
								done(null, [1, 2, 3]);
							}));case 6:test = _context.sent;
						console.log('eval result: ' + (0, _stringify2.default)(test, undefined, 2));_context.next = 10;return (

							tab.waitUntilVisible(['input[name="q"]', 'form[name="f"]']));case 10:_context.next = 12;return (
							tab.fill('form[name="f"]', { q: 'this is just a test' }, { submit: true }));case 12:_context.next = 14;return (
							tab.waitUntilVisible('div#navcnt'));case 14:


						console.log('Saving screenshot as google.png...');_context.next = 17;return (
							tab.screenshot('google.png'));case 17:_context.next = 19;return (

							tab.getContent());case 19:content = _context.sent;
						console.log('The content has ' + content.toString().length + ' bytes');_context.next = 23;return (

							tab.getUrl());case 23:url = _context.sent;
						console.log('The URL is ' + url);

						console.log('Injecting jQuery...');_context.next = 28;return (
							tab.inject('https://code.jquery.com/jquery-3.1.1.slim.min.js'));case 28:
						//const test = await tab.inject('http://bit.ly/2pem27p')
						//console.log(JSON.stringify(test, undefined, 2))
						//await tab.inject('toto')
						//await Promise.delay(5000)

						console.log('Getting the title...');_context.next = 31;return (
							tab.evaluate(function (arg, done) {
								done(null, jQuery('title').text());
							}));case 31:title = _context.sent;
						console.log('The title is: ' + title);case 33:case "end":return _context.stop();}}}, _callee, this);}));return function (_x) {return _ref.apply(this, arguments);};}()).

then(function () {return nick.exit();}).
catch(function (err) {
	console.log('Oops, an error occurred: ' + err);
	nick.exit(1);
});