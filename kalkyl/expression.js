'use strict';


/************************************************************
 * Expression
 ************************************************************/

define(['../lib/quack.js', './exports.js'], function(q, KL) { 
    
    return KL.Expression = q.createAbstractClass({

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
        return this.dim().identicalTo(new KL.Vector2(1, 1));
    }

    
})});
