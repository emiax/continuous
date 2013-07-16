define(['../lib/quack.js', './exports.js', './expression.js'], function (q, KL, Expression) {
    return KL.Leaf = q.createAbstractClass(Expression, {
        /**
         * Dimension
         */
        dim: function () {
            return new KL.Vector2(1, 1);
        }
    });
});
