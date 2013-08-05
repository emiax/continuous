var requirejs = require('requirejs');

requirejs.config({
    baseUrl: './',
    paths: {
        // List of all Continuous packages
        'quack':                 './lib/quack',
        'jquery':                './lib/jquery-2.0.3.min',
        'kalkyl':                './kalkyl/package',
        'kalkyl/format':         './kalkyl/format/package',
        'kalkyl/format/simple':  './kalkyl/format/simple/package',
        'kalkyl/format/sage':    './kalkyl/format/sage/package',
        'communication':         './communication/package',
        'communication/server':  './communication/server/package',
        'server':                './server/package',
        'errors':                './errors/package',
        'mathgl':                './mathgl/package',
    },
    nodeRequire: require
});


var Kalkyl, MathGL, parser, parse;


requirejs(['kalkyl', 'kalkyl/format', 'kalkyl/format/simple', 'mathgl'], function (kalkyl, format, simple, mathgl) {
    Kalkyl = kalkyl;
    Kalkyl.Format = format;
    Kalkyl.Format.Simple = simple;
    MathGL = mathgl;
    Parser = simple.Parser;
    var parser = new Parser();
    parse = parser.parse.bind(parser);
        

    console.log("Feel free to go nuts!");
});

