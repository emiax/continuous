define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var Expression = require('./expression');
    var InnerNode = require('./innerNode');

    return exports.Matrix = q.createAbstractClass(Expression, [InnerNode], {

        evaluated: new q.AbstractMethod(),

        element: new q.AbstractMethod(),

        toMatrixNM: new q.AbstractMethod(),

        toSpecificDim: new q.AbstractMethod(),

        forEachElement: new q.AbstractMethod(),

        access: new q.AbstractMethod(),
        
        /**
         * Return transposed matrix.
         */
        transposed: function () {
            var m = exports.Matrix.createZeroMatrix(this.dim().reversed());
            this.forEachElement(function (v, k) {
                m.element(k.reversed(), v);
            });
            return m.toSpecificDim();
        },

        
        /**
         * To primitive.
         */
        toPrimitive: function () { 
            if (!this.isEvaluated()) {
                console.error("kalkyl internal error");
            }
            
            var primitive = [];
            this.forEachElement(function (v, k) {
                var r = k.x().value(), c = k.y().value();
                if (primitive[c] === undefined) {
                    primitive[c] = [];
                }
                primitive[c][r] = v.toPrimitive();
            });

            return primitive;
        },


        /**
         * Return true if evaluated
         */
        isEvaluated: function () {
            return this.allElementsInstanceOf(exports.Number);
        },


        /**
         * Return true if all elements is instance of c
         */
        allElementsInstanceOf: function(c) {
            this.forEachElement(function (v) {
                if (!(v instanceof c)) {
                    return false;
                }
            });
            return true;
        },


        /**
         * Return true if this is identical to matrix
         */
        identicalTo: function (matrix) {
            if (matrix.getClass() !== this.getClass()) return false;

            var dim = this.dim();
            var otherDim = matrix.dim();

            if (!dim.x().identicalTo(otherDim.x()) || !dim.y().identicalTo(otherDim.y())) {
                return false;
            }

            var identical = true;
            this.forEachElement(function (v, k) {
                if (!v.identicalTo(matrix.element(k))) {
                    identical = false;
                }
            });

            return identical;
        },


        /**
         * Accept visitor.
         */
        accept: function (visitor) {
            return visitor.visitMatrix(this);
        },


        /**
         * Meant for static use. Create identity matrix.
         */
        createIdentityMatrix: function(dim) {
            var r, c;
            if (dim instanceof exports.Vector2) {
                r = dim.x();
                c = dim.y();
            } else if (typeof dim === 'number') {
                r = c = dim;
            }

            var m = new Array(r);
            for (var i = 0; i < r; i++) {
                m[i] = new Array(c);
                for (var j = 0; j < c; j++) {
                    m[i][j] = i === j ? new exports.Number(1) : new exports.Number(0);
                }
            }
            return new exports.MatrixNM(m);
        },


        /**
         * Meant for static use. Create zero matrix.
         */
        createZeroMatrix: function(dim) {
            var r, c;
            if (dim instanceof exports.Vector2) {
                r = dim.x().value();
                c = dim.y().value();
            } else if (typeof dim === 'number') {
                r = c = dim;
            }

            var m = new Array(r);
            for (var i = 0; i < r; i++) {
                m[i] = new Array(c);
                for (var j = 0; j < c; j++) {
                    m[i][j] = new exports.Number(0);
                }
            }
            return new exports.MatrixNM(m);
        }
    });
});
