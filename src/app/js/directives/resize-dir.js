angular.module('continuousApp').compileProvider.directive(
    'resize', function($window) {
    return function (scope, element) {
        
        var w = angular.element($window);
        
        scope.getWindowDimensions = function () {
            return {
                'h': w[0].innerHeight-51,
                'w': w[0].innerWidth
            };
        };

        scope.getElementDimensions = function () {
            return {
                w: element.prop('offsetWidth'),
                h: element.prop('offsetHeight')
            };
        };

        scope.publishCanvasDimensions = function () {
            if( scope.state.hasOwnProperty("canvasDim") ) {
                scope.state.set(
                    'canvasDim',
                    scope.getElementDimensions()
                );
            }
        }

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
});