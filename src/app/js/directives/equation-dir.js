angular.module('continuousApp').compileProvider.directive(
  'equation', function() {
    return {
      restrict: "E",
      controller: ["$scope", "$element", "$attrs",
      function($scope, $element, $attrs) {
        // static expressions
        var expr = $attrs.expr == undefined ? "" : $attrs.expr;
        $element.text("`" + expr + "`");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
        
        // real time updating expressions
        if($attrs.watch != undefined) {
          $scope.$watch($attrs.watch, function(value) {
            //console.error("VALUE!!!!" + value);
            var pre = $attrs.pre == undefined ? "" : $attrs.pre;
            var post = $attrs.post == undefined ? "" : $attrs.post;
            $element.text(
              value == undefined ?
                "":
                "`" + pre + value + post + "`"
            );
            // console.log($element);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
          });
        }
      }]
    };
});