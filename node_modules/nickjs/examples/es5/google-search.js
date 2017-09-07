'use strict';var Nick = require("../../lib/Nick");

var nick = new Nick();


nick.newTab().then(function (tab) {
	return tab.open('google.com').
	then(function () {return tab.waitUntilVisible(['input[name="q"]', 'form[name="f"]']);}).
	then(function () {return tab.fill('form[name="f"]', { q: 'this is just a test' }, { submit: true });}).
	then(function () {return tab.waitUntilVisible('div#navcnt');}).
	then(function () {
		console.log('Saving screenshot as google.png...');
		return tab.screenshot('google.png');
	});
}).
then(function () {return nick.exit();}).
catch(function (err) {
	console.log('Oops, an error occurred: ' + err);
	nick.exit(1);
});