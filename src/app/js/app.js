var continuousApp = angular.module(
    'continuousApp',
    [
        'ngRoute'
    ]
);

console.log("continiousApp running");

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
