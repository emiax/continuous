define(['../lib/quack.js'], function (q) {
    return q.createInterface(
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


