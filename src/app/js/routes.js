define(['angular', 'app'], function(angular, app) {
	'use strict';
	return app.config(['$routeProvider', function($routeProvider) {

		$routeProvider
        
        .when('/', {
            templateUrl: 'src/app/partials/index-view.html',
            controller: 'IndexCtrl'
        })

        .when('/visualization/:visualizationId', {
			templateUrl: 'src/app/partials/visualization-view.html',
			controller: 'VisualizationCtrl'
		})
        
        .otherwise({
            redirectTo: '/'
        });

	}]);

});