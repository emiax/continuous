define(['kalkyl/format/simple/exports.js',
        // Require kalkyl.format
        'kalkyl/format',
        // Lexer and parser. Formatter is included in kalkyl root.
        'kalkyl/format/simple/lexer.js',
        'kalkyl/format/simple/parser.js'],
       function(exports) {
           console.log("loaded kalkyl.format.simple");
           return exports;
       });


define(function (require) {
    require('kalkyl/format');
    require('./lexer');
    require('./parser');
    console.log('loaded kalkyl.format.simple');
    return require('./exports');
});
