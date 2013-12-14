define(function(require) {

    var pubFactory = require('../publisher_factory');

    var state = {
        r: '',
        theta: '',
        phi: '',
        canvasDim: {},
        mouseState: {},
        activeStep: 0
    };

    pubFactory.makePublisher(state);

    return state;
});