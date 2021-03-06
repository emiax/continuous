define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var Matrix = require('./matrix');

    return exports.MatrixNM = q.createClass(Matrix, {
        /**
         * Constructor.
         */
        constructor: function(rows) {
            var scope = this;
            this._rows = rows;
            this.forEachElement(function (v, k) {
                scope.element(k, exports.Number.boxNumber(v));
            });
        },


        /*
         * Get or set element. Index is a Vector2
         */
        element: function(index, value) {
            var row = index.x().value();
            var column = index.y().value();
            value = exports.Number.boxNumber(value);

            var dim = this.dim();
            if (row < dim.x().value() && row >= 0 && column < dim.y().value() && column >= 0) {
                if (value !== undefined) {
                    this._rows[row][column] = value;
                }
                return this._rows[row][column];
            } else {
                console.error("accessing [" + row + ", " + column + "] which is outside " +
                              this.dim().simpleFormat());
            }
        },

        
        /**
         * Return row i
         */
        access: function (i) {
            var nRows = this.dim().x().value();
            var rows = this._rows;
            if (nRows === 1) {
                var row = rows[0];
                if (i >= 0 && i < row.length) {
                    return row[i];
                }
            } else if (i >= 0 && i < nRows) {
                var vector = new exports.VectorN(rows[i]);
                if (vector.isScalar()) {
                    return vector.element(0);
                } else {
                    return vector.toSpecificDim();
                }
            }
            console.error("accessing outside bounds.");
        },


        /*
         * Get or set argument. Index is a number
         */
        argument: function(index, value) {
            var nColumns = this.dim().y();

            var row = Math.floor(index / nColumns);
            var column = index % nColumns;
            return this.element(new exports.Vector2(row, column), value);
        },


        /**
         * Dim.
         */
        dim: function () {
            return new exports.Vector2(
                this._rows.length,
                this._rows[0].length);
        },


        /**
         * Evaluated.
         */
        evaluated: function (map) {
            var evaluated = Matrix.createZeroMatrix(this.dim());
            this.forEachElement(function (v, k) {
                evaluated.element(k, v.evaluated(map));
            });

            if (evaluated.isScalar()) {
                return evaluated.element(new exports.Vector2(0, 0));
            } else {
                return evaluated;
            }
        },


        /**
         * To specific dimension.
         */
        toSpecificDim: function (clone) {
            if (clone === undefined) clone = true;

            var dim = this.dim();
            if (dim.y().value() === 1) {
                var column = [];
                this._rows.forEach(function (v) {
                    column.push(v[0]);
                });
                var vector = new exports.VectorN(column);
                return vector.toSpecificDim();
            }
            if (clone) {
                return this.clone();
            } else {
                return this;
            }
        },



        /**
         * To matrixNM.
         */

        toMatrixNM: function () {
            return this.clone();
        },


        /**
         * For each argument.
         */
        forEachArgument: function (f) {
            var nColumns = this.dim().y();
            this._rows.forEach(function (row, r) {
                row.forEach(function (v, c) {
                    f(v, r*nColumns + c);
                });
            });
        },


        /**
         * For each element.
         */
        forEachElement: function (f) {
            this._rows.forEach(function (row, r) {
                row.forEach(function (v, c) {
                    f(v, new exports.Vector2(r, c));
                });
            });
        },

        
        /**
         * Clone.
         */
        clone: function() {
            var m = Matrix.createZeroMatrix(this.dim());
            this.forEachElement(function (v, k) {
                m.element(k, v.clone());
            });
            return m;
        }

    });
})
