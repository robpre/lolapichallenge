var angular = require('angular');
var io = require('./socket.js');

console.log('loaded!');

var socket = io();

socket.on('logged in', function() {
	console.log('logged in!');
});
socket.on('logged out', function() {
	console.log('logged out!');
});

window.socket = socket;

