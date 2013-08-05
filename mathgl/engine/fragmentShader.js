define(['quack', 'mathgl/engine/exports.js', 'mathgl/engine/shader.js'], function(q, Engine, Shader) {
    return Engine.FragmentShader = q.createClass(Shader, {
        type: function () {
            return this.gl().FRAGMENT_SHADER;
        }
    });
});
