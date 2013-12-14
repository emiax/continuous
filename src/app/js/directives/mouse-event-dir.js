/**
 * This custom mouse event directive assumes a state in the parent's scope.
 * The state is then augmented when the user fires mouse events.
 */
angular.module('continuousApp').compileProvider.directive(
  'mouseEvent', function() {

    /**
     * Custom event for mouseclick + mousemove
     */
    var mousedrag = function (scope, element) {

      if(!scope.hasOwnProperty('state')){
        throw ': Directive could not find a state in this scope';
      }

      var mouseState = scope.state.mouseState;

      if(mouseState === undefined) {
        throw 'There is no "mouseState" defined in this scope\'s state: ';
      }

      mouseState.mouseDown = false;
      mouseState.mousePos = { x: 0, y: 0 };
      mouseState.mouseDiff = { x: 0, y: 0 };

      element.on("mousedown", function (e) {
        e = e.originalEvent;
        e.preventDefault();
        mouseState.mousePos.x = e.x;
        mouseState.mousePos.y = e.y;
        mouseState.mouseDown = true;
      });

      //mouseup needs to be bound to the entire document
      var doc = angular.element(document);
      doc.on("mouseup", function (e) {
        e = e.originalEvent;
        mouseState.mouseDown = false;
      });

      element.on("mousemove", function (e) {
        e = e.originalEvent;
        e.preventDefault();
        if(mouseState.mouseDown) {
                   
          mouseState.mouseDiff = { 
            x: e.x - mouseState.mousePos.x,
            y: e.y - mouseState.mousePos.y,
          };

          mouseState.mousePos.x = e.x;
          mouseState.mousePos.y = e.y;

          scope.state.set('mouseState', mouseState);
        }
      });
    }

    var mouseclick = function (scope, element) {
      // TODO: implement maybe
    }

    var linker = function (scope, element, attrs) {
      switch (attrs.mouseEvent) {
        case 'mousedrag':
          mousedrag(scope, element);
          break;
        case 'mouseclick':
          break;
      }
    };

    return {
      restrict: 'A',
      link: linker
    };

  });