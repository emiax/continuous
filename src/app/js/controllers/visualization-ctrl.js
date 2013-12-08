angular.module('continuousApp').controllerProvider.register(

'VisualizationCtrl',

//DI + constructor
['$scope', '$http', '$routeParams',
function ($scope, $http, $routeParams) {
    console.log("VisualizationCtrl loaded");

    require.undef('scene');
    require.undef('gui');
    require.undef('state');
    
    require(['user_content/' + $routeParams.visualizationId + '/bootstrapper.js'], function(bootstrapper){
        
        console.log("Made visualization request");
        
        $scope.state = bootstrapper.state;
        $scope.guis = [bootstrapper.gui]; //is this an angular bug?

        // render layout template
        $scope.$digest();

        require(['user_content/' + $routeParams.visualizationId +'/scene.js'], function(trigger) {
            
            trigger();

            // update canvas dimensions
            $scope.$digest();
        });
    });
}]);