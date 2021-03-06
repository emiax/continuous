define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var Matrix = require('./matrix');

    return exports.Vector = q.createAbstractClass(Matrix, {

        toVectorN: new q.AbstractMethod(),

        reversed: new q.AbstractMethod(),

        toMatrixNM: function() {
            var column = this.toVectorN();
            var rows = [];
            column.forEachArgument(function (v) {
                rows.push([v]);
            });
            return new exports.MatrixNM(rows);
        },


        /*
         * Get or set element. Index is a Vector2
         */
        element: function(index, value) {
            if (index.y().value() !== 0) {
                console.error("Vector has only one column");
            }
            return this.argument(index.x().value(), value);
        },


        /**
         * Access.
         */
        access: function (index) {
            return this.argument(index);
        },
        

        /**
         * Accept.
         */
        accept: function (visitor) {
            return visitor.visitVector(this);
        }

    });

});
