define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var BinaryOperator = require('./binaryOperator');

    return exports.Accessor = q.createClass(BinaryOperator, {
        
        /**
         * Constructor
         */
        constructor: function (matrix, index) {
            index = Kalkyl.Number.boxNumber(index);
            this.left(matrix);
            this.right(index);
        },


        /**
         * Evaluated
         */
        evaluated: function () {
            var matrix = this.left();
            var index = this.right().value();
            if (matrix instanceof Kalkyl.Matrix) {
                if (index === Math.round(index)) {
                    return matrix.access(index);
                }
                console.error("cannot access value at pos " + index);
            }
            console.error("left operand is not a matrix");
        },
        
        
        /**
         * Expanded.
         */
        expanded: function () {
            //todo
        }, 


        dim: function () {
            var matDim = this.left().dim();
            if (matDim.x() > 1) {
                return new Kalkyl.Vector2(matDim.y(), 1);
            } else {
                return new Kalkyl.Vector2(1, 1);
            }
        }
        
    });
});
