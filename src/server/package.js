define(['server/exports.js',
        'server/router.js',
        'server/sageWrapper.js',

        // real performers
        'server/evaluator.js'],
       function(exports) {
           console.log("loaded server");
           return exports;
       });
