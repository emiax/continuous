define(['../lib/quack.js', './exports.js', './unaryOperator.js'], function(q, KL, UnaryOperator) {
    
    return KL.Integral = q.createClass(UnaryOperator, {
        
        /**
         * Constructor.
         */
        constructor: function (arg, symbol) {
            this.arg(arg);
            this.variable(symbol);
        }
        
        /**
         * Get or set variable.
         */
        symbol: function (variable) {
            if (variable !== undefined) this._variable = variable;
            return this._variable;
        }
        
       
        /**
         * Clone.
         */
        clone: function() {
            return new (this.getClass())(this.arg().clone(), this.variable().clone());
        },
        
        
        /**
         * Identical to expr
         */
        identicalTo: function(expr) {
            return (expr.getClass() === this.getClass()
                    && expr.arg().identicalTo(this.arg())
                    && expr.variable().identicalTo(this.variable()));
        }

    });
    

}
