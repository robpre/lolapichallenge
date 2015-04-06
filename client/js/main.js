var angular = require('angular');

angular.module('ModuleName')
	.directive('thing', require('./directives/example.js'))

	

console.log('loaded!');