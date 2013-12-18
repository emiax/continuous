angular.module('continuousApp').controllerProvider.register(

'VisualizationCtrl',

//DI + constructor
['$scope', '$http', '$routeParams',
function ($scope, $http, $routeParams) {
    console.log("VisualizationCtrl loaded");
    $scope.id = $routeParams.visualizationId;

    require(['user_content/' + $routeParams.visualizationId + '/bootstrapper.js'], 
        function(bootstrap){
            $scope.trigger = bootstrap($scope);
            $scope.ready();
    });
}]);