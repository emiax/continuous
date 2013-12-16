define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var TrigonometricFunction = require('./trigonometricFunction');

    return exports.Cos = q.createClass(TrigonometricFunction, {
        /**
         * Return JavaScript function to use for evaluation
         */
        javaScriptFunction: function() {
            return Math.cos;
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitCos(this);
        },
    });
});
