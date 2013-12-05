angular.module('continuousApp').compileProvider.directive(
    'subscribe', function($window) {

        var linker = function (scope) {

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