continuousApp.config(function($routeProvider){

    $routeProvider
    
    .when('/', {
        templateUrl: 'app/partials/index-view.html',
        controller: 'IndexCtrl',
        resolve: { deps:function ($q, $rootScope) {
            var deferred = $q.defer();
            var dependencies = [
                'app/js/controllers/index-ctrl.js'
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
        templateUrl: 'app/partials/visualization-view.html',
        controller: 'VisualizationCtrl',
        resolve: { deps:function ($q, $rootScope) {
            var deferred = $q.defer();
            var dependencies = [
                'app/js/controllers/visualization-ctrl.js',
                'app/js/directives/visualization-dir.js',
                'app/js/directives/resize-dir.js',
                'app/js/directives/subscribe-dir.js',
                'app/js/directives/equation-dir.js',
                'app/js/directives/mouse-event-dir.js',
                'app/js/directives/cardturner-dir.js'
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
