define(function(require) {

    var pubFactory = require('../publisher_factory');

    var state = {
        canvasDim: {},
        mouseState: {},
        activeStep: 0,
        elementPos: 0
    };

    pubFactory.makePublisher(state);

    return state;
});