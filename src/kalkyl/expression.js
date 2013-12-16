'use strict';


/************************************************************
 * Expression
 ************************************************************/

define(function (require) {
    var q = require('quack');
    var exports = require('./exports');
    return exports.Expression = q.createAbstractClass({

        /**
         * Dimension of vector.
         */
        dim: new q.AbstractMethod(),


        /**
         * Evaluated.
         */
        evaluated: new q.AbstractMethod(),


        /**
         * toPrimitive
         */
        toPrimitive: new q.AbstractMethod(),


        /**
         * Is Evaluated.
         */
        isEvaluated: new q.AbstractMethod(),


        /**
         * Is Evaluated.
         */
        identicalTo: new q.AbstractMethod(),


        /**
         * Accept visitor.
         */
        accept: new q.AbstractMethod(),


        /**
         * Clone.
         */
        clone: new q.AbstractMethod(),


        /**
         * Return true if vector's dimension is d.
         */
        hasDim: function (d) {
            return (this.dim().identicalTo(d));
        },


        isScalar: function () {
            return this.dim().identicalTo(new exports.Vector2(1, 1));
        }
    })

});
