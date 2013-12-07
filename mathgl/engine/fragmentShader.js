define(function (require) {

    var q = require('quack');
    var Shader = require('./shader');
    var exports = require('./exports');

    return exports.FragmentShader = q.createClass(Shader, {
        type: function () {
            return this.gl().FRAGMENT_SHADER;
        }
    });
});
