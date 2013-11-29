define(['angular', 'services'], function (angular) {
	'use strict';define

	return angular.module('continuous.controllers', ['continuous.services'])
        
        .controller('IndexCtrl', ['$scope', '$injector', function($scope, $injector) {
            require(['controllers/index-ctrl'], function(indexCtrl) {
                $injector.invoke(indexCtrl, this, {'$scope': $scope});
            });
        }])

		.controller('VisualizationCtrl', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/visualization-ctrl'], function(visualizationCtrl) {
				$injector.invoke(visualizationCtrl, this, {'$scope': $scope});
			});
		}]);
});