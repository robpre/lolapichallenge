var lux = require('../../lux.json');

module.exports = ['$scope', function($scope) {
	$scope.card = lux;
	console.log(JSON.stringify($scope.card));
}];
