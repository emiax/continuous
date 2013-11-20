define([], function() {
    return ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

        require.undef('scene');
        require.undef('gui');
        require.undef('state');

        // because this has happened asynchroneusly we've missed
        // Angular's initial call to $apply after the controller has been loaded
        // hence we need to explicityly call it at the end of our Controller constructor
        require(['user_content/' + $routeParams.visualizationId + '/bootstrapper.js'], function(bootstrapper){
            console.log("Made visualization request");
            $scope.state = bootstrapper.state;
            $scope.guis = [bootstrapper.gui]; //is this an angular bug?

            $scope.$apply();

            require(['user_content/' + $routeParams.visualizationId +'/scene.js'], function(trigger) {
                // trigger();
                $scope.$apply();
            });
        });
    }];
});