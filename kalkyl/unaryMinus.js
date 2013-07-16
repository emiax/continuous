KL.UnaryMinus = QUACK.createClass(KL.UnaryOperator, {
    /**
     * Constructor.
     */
    constructor: function (arg) {
        arg = KL.boxConstant(arg);
        this.arg(arg);
    },
    


    /**
     * Evaluated.
     */
    evaluated: function(map) {
        var dim = this.dim();

        var arg = this.arg().evaluated(map);

        if (arg.isEvaluated()) {
            if (arg instanceof KL.Matrix) {
                var m = arg.toMatrixNM();
                m.forEachArgument(function (v, k) {
                    -m.element(k).value());
                });
                return m.toSpecificDim();
            } else {
                return new KL.Constant(-arg.value());
            }
        } else {
            console.error("kalkyl internal error");
        }
    },


    /**
     * Return this as a KL.Matrix with only scalar operators.
     */
    expanded: function() {
        
    },


    dim: function() {
        return this.arg().dim();
    }, 


    /**
     * Accept expression visitor.
     */
    accept: function (visitor) {
        return visitor.visitUnaryMinus(this);
    },
});


QUACK.patch(KL.Expression, {

    negated: function() {
        return new KL.UnaryMinus(this.clone());b
    }

});
