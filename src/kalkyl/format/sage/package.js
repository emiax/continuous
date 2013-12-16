define(['kalkyl/format/sage/exports.js',
        // Require kalkyl.format
        'kalkyl/format',
        
        // Formatter, Lexer and parser.
        'kalkyl/format/sage/formatter.js',
        'kalkyl/format/sage/lexer.js',
        'kalkyl/format/sage/parser.js'],
       function(exports) {
           console.log("loaded kalkyl.format.sage");
           return exports;
       });
