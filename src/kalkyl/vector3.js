define(function (require) {
    var exports = require('./exports');
    var q = require('quack');
    var Vector = require('./vector');

    return exports.Vector3 = q.createClass(Vector, {
        /**
         * Constructor.
         */
        constructor: function(x, y, z) {
            this.x(exports.Number.boxNumber(x));
            this.y(exports.Number.boxNumber(y));
            this.z(exports.Number.boxNumber(z));
        },


        /**
         * Get or set x
         */
        x: function (value) {
            if (value !== undefined) this._x = value;
            return this._x;
        },


        /**
         * Get or set y.
         */
        y: function (value) {
            if (value !== undefined) this._y = value;
            return this._y;
        },


        /**
         * Get or set z.
         */
        z: function (value) {
            if (value !== undefined) this._z = value;
            return this._z;
        },

        
        /*
         * Get or set number. Index is a number.
         */
        argument: function(index, value) {
            switch (index) {
            case 0:
                return this.x(value);
            case 1:
                return this.y(value);
            case 2:
                return this.z(value);
            default:
                console.error("accessing outside bounds");
            }
        },


        /**
         * Get dimension of vector.
         */
        dim: function () {
            return new exports.Vector2(3, 1);
        },


        /**
         * Evaluated.
         */
        evaluated: function(map) {
            return new exports.Vector3(
                this.x().evaluated(map),
                this.y().evaluated(map),
                this.z().evaluated(map)
            );
        },

        /**
         * For each argument.
         */
        forEachArgument: function (f) {
            f(this.x(), 0);
            f(this.y(), 1);
            f(this.z(), 2);
        },



        /**
         * For each element.
         */
        forEachElement: function (f) {
            f(this.x(), new exports.Vector2(0, 0));
            f(this.y(), new exports.Vector2(1, 0));
            f(this.z(), new exports.Vector2(2, 0));
        },



        /**
         * To vector with general length.
         */
        toVectorN: function() {
            return new exports.VectorN([this.x(), this.y(), this.z()]);
        },


        /**
         * Transposed.
         */
        transposed: function() {
            var m = exports.Matrix.createZeroMatrix(new exports.Vector2(1, 3));
            m.element(new exports.Vector2(0, 0), this.x());
            m.element(new exports.Vector2(0, 1), this.y());
            m.element(new exports.Vector2(0, 2), this.y());
            return m;
        },


        /**
         * Reversed.
         */
        reversed: function() {
            var v = this.clone();
            var t = v.x();
            v.x(v.z());
            v.z(t);
            return v;
        },



        /**
         * To specific dimension type.
         */
        toSpecificDim: function() {
            return this.clone();
        },


        /**
         * Clone.
         */
        clone: function() {
            return new exports.Vector3(this.x().clone(), this.y().clone(), this.z().clone());
        }

    });
});
