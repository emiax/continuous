define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var TrigonometricFunction = require('./trigonometricFunction');

    return exports.Tan = q.createClass(TrigonometricFunction, {
        /**
         * Return JavaScript function to use for evaluation
         */
        javaScriptFunction: function() {
            return Math.tan;
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitTan(this);
        },
    });
});
