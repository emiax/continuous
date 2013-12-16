define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var BinaryOperator = require('./binaryOperator');

    return exports.Power = q.createClass(BinaryOperator, {
        /**
         * Constructor.
         */
        constructor: function (left, right) {
            left = exports.Number.boxNumber(left);
            right = exports.Number.boxNumber(right);
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
                return new exports.Number(Math.pow(left.value(),  right.value()));
            } else {
                return this.clone();
            }
        },


        /**
         * Return this as a Matrix with only scalar operators.
         */
        expanded: function() {
            // TODO
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
