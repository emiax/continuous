define(['quack', 'mathgl/engine/exports.js', 'mathgl/engine/shader.js'], function(q, Engine, Shader) {
    return Engine.VertexShader = q.createClass(Shader, {
        type: function () {
            return this.gl().VERTEX_SHADER;
        }
    });
});
