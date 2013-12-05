continuousApp.config(function($routeProvider){

    $routeProvider
    
    .when('/', {
        templateUrl: 'src/app/partials/index-view.html',
        controller: 'IndexCtrl',
        resolve: { deps:function ($q, $rootScope) {
            var deferred = $q.defer();
            var dependencies = [
                'src/app/js/controllers/index-ctrl.js'
            ];
 
            require(dependencies, function () {
                $rootScope.$apply(function () {
                    deferred.resolve();
                });
            });

            return deferred.promise;
        }}
    })

    .when('/visualization/:visualizationId', {
        templateUrl: 'src/app/partials/visualization-view.html',
        controller: 'VisualizationCtrl',
        resolve: { deps:function ($q, $rootScope) {
            var deferred = $q.defer();
            var dependencies = [
                'src/app/js/controllers/visualization-ctrl.js',
                'src/app/js/directives/visualization-dir.js',
                'src/app/js/directives/resize-dir.js',
                'src/app/js/directives/subscribe-dir.js'
            ];
 
            require(dependencies, function () {
                $rootScope.$apply(function () {
                    deferred.resolve();
                });
            });
            
            return deferred.promise;
        }}
    })
    
    .otherwise({
        redirectTo: '/'
    });

});