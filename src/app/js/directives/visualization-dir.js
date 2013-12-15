angular.module('continuousApp').compileProvider.directive(
    'visualization', ['$compile', '$http', '$templateCache', 
    function($compile, $http, $templateCache) {

        var getTemplate = function (id, gui) {
            var templateLoader,
            templateUrl,
            baseUrl = 'user_content/';

            // baseUrl = 'src/app/partials/visualization_templates/',
            // templateMap = {
            //     card_layout:'card_layout.html',
            //     gallery_layout: 'gallery_layout.html',
            //     no_layout: 'no_layout.html'
            // };

            if(gui.template) {
                templateUrl =   baseUrl +
                                id + "/" +
                                gui.template;
            } else {
                templateUrl = 'src/app/partials/visualization_templates/no_layout.html';
            }
            
            // var templateUrl = baseUrl + templateMap[layout];
            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            return templateLoader;
        };

        var linker = function (scope, element, attrs) {
            if(scope.gui.layout === undefined) {
                console.log("Layout :: No layout specified, fetching canvas only");
                var loader = getTemplate("no_layout");
            } else {
                console.log("Layout :: " + scope.gui.layout);
                var loader = getTemplate(scope.id, scope.gui);
            }

            var promise = loader.success(function(html) {
                element.html(html);
            }).then(function (response) {
                element.replaceWith($compile(element.html())(scope));
            });

            /**
             * This function updates the state from an angular scope
             * with the visualization directive
             * @param  {String} key   State key to update
             * @param  {Any}    value New value to assign
             */
            scope.updateState = function (key, value) {
                this.state.set(key, value);
            };
        };

        return {
            restrict: 'E',
            scope: {
                state: '=',
                gui: '=',
                id: '='
            },
            link: linker
        };
    }]
);