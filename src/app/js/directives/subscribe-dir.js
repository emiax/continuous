angular.module('continuousApp').compileProvider.directive(
    'subscribe', function($rootScope, $compile) {

        var linker = function (scope, element) {

            var update = function (key) {
                var phase = scope.$root.$$phase;
                if(phase == '$apply' || phase == '$digest') return;
                scope.$digest();
            };

            if(scope.publisher.isObservable) {
                scope.publisher.subscribe(update);
            }
        }

        return {
            restrict: 'A',
            scope: {
                publisher: '=subscribe'
            },
            link: linker
        };
    });