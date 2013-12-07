define(function (require) {

    var q = require('quack');
    var Shader = require('./shader');
    var exports = require('./exports');

    return exports.VertexShader = q.createClass(Shader, {
        type: function () {
            return this.gl().VERTEX_SHADER;
        }
    });
});
