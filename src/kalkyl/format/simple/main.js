define(function (require) {
    require('kalkyl/format');
    require('./lexer');
    require('./parser');
    console.log('loaded kalkyl.format.simple');
    return require('./exports');
});
