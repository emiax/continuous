define(function (require) {
    // Basic lex/parse functionality.
    // For parsing specific languages, refer to kalkyl.format.simple, kalkyl.format.sage etc.
    require('kalkyl');

    require('./lexer');
    require('./token');
    require('./parseRule');
    require('./parseError');
    require('./parser');

    console.log("loaded kalkyl.format");

    return require('./exports');
});
