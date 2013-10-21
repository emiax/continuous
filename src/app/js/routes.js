define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider.when('/visualization', {
			templateUrl: 'src/app/partials/visualization.html',
			controller: 'VisualizationCtrl'
		});

		$routeProvider.when('/view1', {
			templateUrl: 'app/partials/partial1.html',
			controller: 'MyCtrl1'
		});
		
		$routeProvider.otherwise({redirectTo: '/view1'});
	}]);

});