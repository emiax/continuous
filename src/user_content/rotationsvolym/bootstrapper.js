define(function(require) {

    var sceneTrigger = require('./scene');
    var state = require('./state');

    return function (scope) {
        scope.state = state;
        return sceneTrigger;
    };
});
