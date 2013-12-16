define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var TrigonometricFunction = require('./trigonometricFunction');

    return exports.Sin = q.createClass(TrigonometricFunction, {
        /**
         * Return JavaScript function to use for evaluation
         */
        javaScriptFunction: function() {
            return Math.sin;
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitSin(this);
        },
    });
});
