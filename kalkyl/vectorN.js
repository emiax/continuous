define(['../lib/quack.js', './exports.js', './vector.js'], function(q, KL, Vector) {
    return KL.VectorN = q.createClass(Vector, {

        /**
         * Constructor.
         */
        constructor: function(elements) {
            this._elements = elements;
        },


        /**
         * Get or set argument. Index is a number.
         */
        argument: function(index, value) {
            if (index < this.length() && index >= 0) {
                if (value !== undefined) this._elements[index] = value;
                return this._elements[index];
            } else {
                consbole.error("accesing outside bounds");
            }
        },


        reversed: function() {
            var v = this.clone();
            var length = this.length();
            this.forEachArgument(function (v, k) {
                v.element(length - k, v);
            });
            return v;
        },

        /**
         * Get dimension of vector.
         */
        dim: function () {
            return new KL.Vector2(this._elements.length, 1);
        },


        /**
         * Get length, number of elements.
         */
        length: function () {
            return this.dim().x().value();
        },


        /**
         * Evaluated.
         */
        evaluated: function(values) {
            var evaluatedElements = [];
            this.forEachArgument(function (v) {
                evaluatedElements.push(v.evaluated());
            })
            return new KL.VectorN(evaluatedElements);
        },


        /**
         * For each argument.
         */
        forEachArgument: function (f) {
            this._elements.forEach(function (v, k) {
                f(v, k);
            });
        },


        /**
         * For each argument.
         */
        forEachElement: function (f) {
            this._elements.forEach(function (v, k) {
                f(v, new KL.Vector2(k, 0));
            });
        },


        /**
         * To specific dimension type
         */
        toSpecificDim: function () {
            if (this.hasDim(new KL.Vector2(2, 1))) {
                return new KL.Vector2(this.argument(0), this.argument(1));
            }
            if (this.hasDim(new KL.Vector2(3, 1))) {
                return new KL.Vector3(this.argument(0), this.argument(1), this.argument(2));
            }
            return this;
        },


        toVectorN: function() {
            return this.clone();
        },


        /**
         * Clone.
         */
        clone: function() {
            var m = new Array(this.length());
            this.forEachArgument(function (v, k) {
                m[k] = v.clone();
            });
            return new KL.VectorN(m);
        }

    });
});
