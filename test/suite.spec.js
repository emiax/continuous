var requirejs = require('requirejs');


requirejs.config({
    baseUrl: "/Users/Emil/Documents/Webb/continuous/",
    paths: {
        // List of all Continuous packages
        'quack':                 './lib/quack',
        'jquery':                './lib/jquery-2.0.3.min',
        'kalkyl':                './kalkyl/package',
        'kalkyl/format':         './kalkyl/format/package',
        'kalkyl/format/simple':  './kalkyl/format/simple/package',
        'kalkyl/format/sage':    './kalkyl/format/sage/package',
        'communication':         './communication/package',
        'communication/client':  './communication/client/package',
        'mathgl':                './mathgl/package'
    }
});


requirejs.config({
    nodeRequire: require
});


var modules = [
    './test/kalkyl/basic.spec.js',
    './test/mathgl/node.spec.js'

];



requirejs(modules, function () {

    for (var i = 0, n = arguments.length; i < n; i++) {
        (arguments[i])();
    }
        
});
