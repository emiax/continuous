// requirejs.config({
//     baseUrl: './user_content/paraboloid/'
// });
define(function(require) {
    var state = require('./state');
    var gui = require('./gui');
    return { state: state, gui: gui };
});
