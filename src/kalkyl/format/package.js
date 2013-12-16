define(['kalkyl/format/exports.js',
        // Basic lex/parse functionality.
        // For parsing specific languages, refer to kalkyl.format.simple, kalkyl.format.sage etc.
        'kalkyl/format/lexer.js',
        'kalkyl/format/token.js',
        'kalkyl/format/parseRule.js',
        'kalkyl/format/parseError.js',
        'kalkyl/format/parser.js'],
       function(exports) {
           console.log("loaded kalkyl.format");
           return exports;
       });
