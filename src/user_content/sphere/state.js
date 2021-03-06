define(function(require) {

    var pubFactory = require('../publisher_factory');

    var state = {
        r: '',
        theta: '',
        phi: '',
        canvasDim: {},
        mouseState: {},
        expression: 'r = 1, x = r*sin(theta)cos(phi), ...'
    };

    pubFactory.makePublisher(state);

    return state;
});