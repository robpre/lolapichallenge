var angular = require('angular');
var io = require('./socket.js');

console.log('loaded!');

// deps
angular.module('Urf')
.directives('example', require('./directives/example.js'));

