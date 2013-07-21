define(['quack', './exports.js', './trigonometricFunction.js'], function(q, KL, TrigonometricFunction) {
    return KL.Cos = q.createClass(KL.TrigonometricFunction, {
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
