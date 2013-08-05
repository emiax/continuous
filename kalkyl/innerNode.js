define(['quack', 'kalkyl/exports.js'], function (q, Kalkyl) {
    return Kalkyl.InnerNode = q.createInterface(
        /**
         * For each argument. Apply a function on all children
         */
        'forEachArgument',
        
        
        /**
         * Get or set argument at index i.
         */
        'argument'
    );
});


