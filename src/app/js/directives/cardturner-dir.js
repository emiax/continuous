angular.module('continuousApp').compileProvider.directive(
  'cardturner', function() {

    var btnNext, activeStep;

    var addClickListener = function (scope, element) {
      activeStep = scope.state.activeStep;
      btnNext = element.find('#btn-next');
      btnNext.attr('unselectable', 'on')
             .css('user-select', 'none')
             .on('selectstart', false);

      btnNext.bind("click", function (e) {
        e.preventDefault();
        scope.state.set('activeStep', ++activeStep);
      });
    }

    var linker = function (scope, element) {

      // sanity checks
      if(!scope.hasOwnProperty('state')){
        throw ': Directive could not find a state in this scope';
      }
      if(scope.state.activeStep == undefined) {
        throw ': There is no "activeStep" defined in this scope\'s state';
      }

      addClickListener(scope, element);

      var children = element.children();
      var showNextCard = function (updated) {
        if(updated === 'activeStep') {
          var waitForStep;
          
          for(var index = 0; index < children.length; ++index) {
            child = $(children[index]);
            waitForStep = child.attr('waitForStep');
            
            if(waitForStep != undefined) {
              if(waitForStep <= activeStep) {
                child.removeClass('hidden');
                child.removeAttr('waitForStep');
                return;
              } else {
                return;
              }
            } else if (index <= activeStep) {
              child.removeClass('hidden');
            }
          }
        }
      }
      scope.state.subscribe(showNextCard);

    };

    return {
      restrict: 'A',
      link: linker
    }
});