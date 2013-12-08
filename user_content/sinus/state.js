define(function(require) {

    var pubFactory = require('../publisher_factory');

    var state = {
        t: 0,
        canvasDim: {
            w: 700,
            h: 700
        },
        expression: 'z = sin(x)'
    };

    pubFactory.makePublisher(state);

    return state;
});