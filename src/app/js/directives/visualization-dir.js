angular.module('continuousApp').compileProvider.directive(
'visualization',

['$compile', '$http', '$templateCache', 
function($compile, $http, $templateCache) {

    var linker = function (scope, element, attrs) {

        scope.ready = function () {

            var templateLoader,
                templateUrl,
                baseUrl = 'user_content/';

            templateUrl =   baseUrl +
                            scope.visualizationId + "/" +
                            "index.html";
            
            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            var promise = templateLoader.success(function(html) {
                element.html(html);
            }).then(function (response) {
                element.replaceWith($compile(element.html())(scope));
            });
        };
    };

    return {
        restrict: 'E',
        link: linker
    };

}]);