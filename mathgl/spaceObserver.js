define(['quack', 'mathgl/exports.js'], function (q, MathGL) {
    return MathGL.SpaceObserver = q.createInterface(
        /**
         * Method to be invoked when the space is changed.
         * First parameter is a reference to the actual node.
         * Second parameter (type) may be 'add', 'remove', 'expression' or 'appearance'
         * If second parameter is 'expression', then third parameter is the symbol name
         */
        'update'
    );
});
