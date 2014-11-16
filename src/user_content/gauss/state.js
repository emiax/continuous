define(function(require) {
  var pubFactory = require('../publisher_factory');

  var state = {
    canvasDim: {},
    mouseState: {},
    activeStep: 0,

    showVectorField: true,
    showFluxContour: false,
    showFluxColors: false,
    showFluxNormals: false,
    showDivergenceZone: false,
    showContourVectorField: false
  };

  pubFactory.makePublisher(state);

  return state;
});