define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var UnaryOperator = require('./unaryOperator');

    return exports.Ln = q.createClass(UnaryOperator, {
        /**
         * Return JavaScript function to use for evaluation
         */
        javaScriptFunction: function() {
            return Math.log;
        },


        /**
         * Evaluated.
         */
        evaluated: function(map) {
            var dim = this.dim();

            var arg = this.arg().evaluated(map);

            if (arg.isEvaluated()) {
                if (arg instanceof exports.Matrix) {
                    var m = arg.toMatrixNM();
                    m.forEachArgument(function (v, k) {
                            m.element(k, Math.cos(v));
                    });
                    return m.toSpecificDim();
                } else {
                    var f = this.javaScriptFunction();
                    return new exports.Number(f(arg.value()));
                }
            } else {
                return this.clone();
            }
        },



        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitLn(this);
        },


        expanded: function () {
        },

        dim: function() {
            return this.arg().dim();
        }


    });
});
