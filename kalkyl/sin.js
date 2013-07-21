define(['quack', './exports.js', './trigonometricFunction.js'], function(q, KL, TrigonometricFunction) {
    return KL.Sin = q.createClass(KL.TrigonometricFunction, {
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
