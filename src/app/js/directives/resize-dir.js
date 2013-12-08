angular.module('continuousApp').compileProvider.directive(
    'resize', function($window) {
    return function (scope, element) {
        
        var w = angular.element($window);
        
        scope.getWindowDimensions = function () {
            return { 'h': w[0].innerHeight-51, 'w': w[0].innerWidth };
        };

        scope.publishDimensions = function (fn) {
            if( scope.state.hasOwnProperty("canvasDim") ) {
                var dims = {
                    w: element.prop('offsetWidth'),
                    h: element.prop('offsetHeight')
                }
                scope.state.set('canvasDim', dims);
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