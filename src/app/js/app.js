var continuousApp = angular.module(
    'continuousApp',
    [
        'ngRoute'
    ]
);

continuousApp.config(function(
    $routeProvider,
    $controllerProvider,
    $compileProvider){

    continuousApp.controllerProvider = $controllerProvider;
    continuousApp.compileProvider    = $compileProvider;
    continuousApp.routeProvider      = $routeProvider;
    // continuousApp.filterProvider     = $filterProvider;
    // continuousApp.provide            = $provide;

});
