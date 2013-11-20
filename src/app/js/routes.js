define(['angular', 'app'], function(angular, app) {
	'use strict';
	return app.config(['$routeProvider', function($routeProvider) {

		$routeProvider.when('/visualization/:visualizationId', {
			templateUrl: 'src/app/partials/visualization.html',
			controller: 'VisualizationCtrl'
		});

		$routeProvider.otherwise({redirectTo: '/visualization'});
	}]);

});