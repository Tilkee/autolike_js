"use strict";var _stringify = require("babel-runtime/core-js/json/stringify");var _stringify2 = _interopRequireDefault(_stringify);var _Nick = require("../Nick");var _Nick2 = _interopRequireDefault(_Nick);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var nick = new _Nick2.default();

nick.initialize().then(function () {
	nick.newTab().then(function (tab) {
		tab.open("phantombuster.fr", function (err, res) {
			console.log("open err: " + err);
			console.log("open res: " + res);
			tab.exit();
		});
	}).catch(function (err) {
		console.log("catch: " + (0, _stringify2.default)(err, undefined, 2));
		console.log("catch: " + err);
	});
});

//async function test() {
//	tab = await nick.newTab()
//}
//
//test()