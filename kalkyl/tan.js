define(['quack', './exports.js', './trigonometricFunction.js'], function(q, KL, TrigonometricFunction) {
    return KL.Tan = q.createClass(KL.TrigonometricFunction, {
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
