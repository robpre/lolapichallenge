var angular = require('angular');

console.log('loaded!');

// deps
angular.module('Urf')
.directives('example', require('./directives/example.js'));

