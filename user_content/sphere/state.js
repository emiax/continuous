define(function(require) {

    var pubFactory = require('../publisher_factory');

    var state = {
        theta: '',
        phi: '',
        canvasDim: {
            w: 0,
            h: 0
        },
        expression: 'r = 1, x = r*sin(theta)cos(phi), ...'
    };

    pubFactory.makePublisher(state);

    return state;
});