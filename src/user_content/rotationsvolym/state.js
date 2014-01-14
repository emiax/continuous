define(function(require) {

    var pubFactory = require('../publisher_factory');

    var state = {
        canvasDim: {},
        mouseState: {},
        xCoefficient: 1.0,
        activeStep: 0,
        elementPos: 0,
        integrationUpperBound: 0
    };

    pubFactory.makePublisher(state);

    return state;
});