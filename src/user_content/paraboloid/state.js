define(function(require) {

    var pubFactory = require('../publisher_factory');

    var state = {
        t: 0,
        canvasDim: {},
        mouseState: {},
        expression: 'z = x^2 + y^2'
    };

    pubFactory.makePublisher(state);

    return state;
});