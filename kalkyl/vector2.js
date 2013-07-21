define(['quack', './exports.js', './vector.js'], function(q, KL, Vector) {
    return KL.Vector2 = q.createClass(Vector, {
        /**
         * Constructor.
         */
        constructor: function(x, y) {
            this.x(KL.Constant.boxConstant(x));
            this.y(KL.Constant.boxConstant(y));
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


        /*
         * Get or set number. Index is a number.
         */
        argument: function(index, value) {
            switch (index) {
            case 0:
                return this.x(value);
            case 1:
                return this.y(value);
            default:
                console.error("accessing outside bounds. Index was " + index);
            }
        },


        /**
         * Get dimension of vector.
         */
        dim: function () {
            return new KL.Vector2(2, 1);
        },


        /**
         * Evaluated.
         */
        evaluated: function(map) {
            return new KL.Vector2(
                this.x().evaluated(map),
                this.y().evaluated(map)
            );
        },

        /**
         * For each argument.
         */
        forEachArgument: function (f) {
            f(this.x(), 0);
            f(this.y(), 1);
        },


        forEachElement: function(f) {
            f(this.x(), new KL.Vector2(0, 0));
            f(this.y(), new KL.Vector2(1, 0));
        },


        /**
         * To vector with general length
         */
        toVectorN: function() {
            return new KL.VectorN([this.x(), this.y()]);
        },


        /**
         * Transposed.
         */
        transposed: function() {
            var m = KL.Matrix.createZeroMatrix(new KL.Vector2(1, 2));
            m.element([0, 0], this.x());
            m.element([0, 1], this.y());
            return m;
        },


        /**
         * Reversed.
         */
        reversed: function() {
            var v = this.clone();
            var t = v.x();
            v.x(v.y());
            v.y(t);
            return v;
        },


        /**
         * To specific dimension type
         */
        toSpecificDim: function () {
            return this.clone();
        },


        /**
         * Clone.
         */
        clone: function() {
            return new KL.Vector2(this.x().clone(), this.y().clone());
        }


    });

});
