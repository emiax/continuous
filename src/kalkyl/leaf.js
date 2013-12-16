define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var Expression = require('./expression');

    return q.createAbstractClass(Expression, {
        /**
         * Dimension
         */
        dim: function () {
            return new exports.Vector2(1, 1);
        }
    });
});
