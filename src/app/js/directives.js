define(['angular', 'services'], function(angular, services) {
	'use strict';

	angular.module('continuous.directives', ['continuous.services'])
        .directive('resize', function($window) {
            return function (scope, element) {
                var w = angular.element($window);
                scope.getWindowDimensions = function () {
                    return { 'h': w[0].innerHeight, 'w': w[0].innerWidth };
                };
                scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                    scope.windowHeight = newValue.h;
                    scope.windowWidth = newValue.w;

                    scope.style = function () {
                        return {
                            'height': (newValue.h) + 'px',
                            'width': (newValue.w) + 'px'
                        };
                    };

                }, true);

                w.bind('resize', function () {
                    scope.$apply();
                });
            }
        })
        .directive('visualization', ['$compile', '$http', '$templateCache', 
            function($compile, $http, $templateCache) {

                var getTemplate = function(layout) {
                    var templateLoader,
                    baseUrl = 'src/app/partials/visualization_templates/',
                    templateMap = {
                        card_layout:'card_layout.html',
                        kartotek_layout: 'showroom_layout.html',
                        no_layout: 'no_layout.html'
                    };

                    var templateUrl = baseUrl + templateMap[layout];
                    templateLoader = $http.get(templateUrl, {cache: $templateCache});

                    return templateLoader;
                }

                var linker = function(scope, element, attrs) {
                    if(scope.gui.layout === undefined) {
                        console.log("Layout :: No layout specified, fetching canvas only");
                        var loader = getTemplate("no_layout");
                    } else {
                        console.log("Layout :: " + scope.gui.layout);
                        var loader = getTemplate(scope.gui.layout);
                    }

                    var promise = loader.success(function(html) {
                        element.html(html);
                    }).then(function (response) {
                        element.replaceWith($compile(element.html())(scope));
                    });
                }

                return {
                    restrict: 'E',
                    scope: {
                        state: '=',
                        gui: '='
                    },
                    link: linker
                };
            }]);
});