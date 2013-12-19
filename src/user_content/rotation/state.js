define(function(require) {

    var pubFactory = require('../publisher_factory');

    var state = {
        t: 0,
        mouseState: {},
        canvasDim: {}
    };

    pubFactory.makePublisher(state);

    return state;
});
