define(['quack', './exports.js', './binaryOperator.js'], function(q, KL, BinaryOperator) {
    return KL.Power = q.createClass(BinaryOperator, {
        /**
         * Constructor.
         */
        constructor: function (left, right) {
            left = KL.Constant.boxConstant(left);
            right = KL.Constant.boxConstant(right);
            this._dim = left.dim();
            
            if (left.isScalar() && right.isScalar()) {
                this.left(left);
                this.right(right);
            } else {
                console.error("Power only supprts scalars");
                // Todo: extend to support square matrices?
            }
        },
       
        
        /**
         * Evaluated.
         */
        evaluated: function(map) {
            var dim = this.dim();

            var left = this.left().evaluated(map);
            var right = this.right().evaluated(map);
            
            if (left.isScalar() && right.isScalar() && left.isEvaluated() && right.isEvaluated()) {
                return new KL.Constant(Math.power(left.value(),  right.value()));
            } else {
                return this.clone();
            }
        },


        /**
         * Return this as a KL.Matrix with only scalar operators.
         */
        expanded: function() {

        },


        dim: function() {
            return this._dim;
        },


        /**
         * Accept expression visitor.
         */
        accept: function (visitor) {
            return visitor.visitPower(this);
        },
    });
});
