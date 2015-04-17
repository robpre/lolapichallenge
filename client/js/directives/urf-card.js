var _ = require('lodash');
var humanize = require('humanize-string');
/*
 * This is really horrible and can be resolved with a proper use of $compile ($interpolate wont work with ng-repeat)
 * I am really sorry for this (lee) sin
 */
var ttS = '<div class="card-tooltip"><div class="tooltip-image" style="background-image:url(http://ddragon.leagueoflegends.com/cdn/img/champion/loading/';
var ttM = ')"></div><div class="tooltip-stats"><table><tbody>';
var ttC = '</tbody></table>';
var tooltipStats = function(stats) {
	var result = '';
	_.each(stats, function(value, key) {
		if(value === -1) {
			value = '<span style="color:rgb(202, 54, 54);">LOST<span>';
		}
		result = result + '<tr><td>' + humanize(key) + '</td><td>' + value + '</td></tr>';
	});
	return result;
};
module.exports = function() {
	return {
		templateUrl: 'templates/directives/urf-card.html',
		restrict: 'E',
		scope: {
			card: '=',
			tile: '@',
			size: '@',
			tip: '@'
		},
		controller: ['$scope', '$interpolate', function($scope, $interpolate) {
			var setupTooltip = function() {
				if($scope.card) {	
					$scope.tooltipHtml = ttS + $scope.card.championImage.image.full.replace(/\.png$/, '_0.jpg') + ttM + tooltipStats($scope.card.stats) + ttC;
				} else {
					$scope.tooltipHtml = '';
				}
			};
			$scope.$watch('card', setupTooltip);
		}],
		link: function(scope, element, attrs) {
			if(!scope.size) {
				scope.size = 'regular';
			} 
			if(!scope.tip) {
				scope.tip = 'left';
			}
		}
	};
};
