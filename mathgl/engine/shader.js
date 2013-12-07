define(function (require) {

    var q = require('quack');
    var exports = require('./exports');

    return exports.Shader = q.createAbstractClass({
        /**
         * Constructor.
         */
        constructor: function(gl, glsl) {
            this._gl = gl;
            this._handle = null;
            this._source = glsl;
        },


        /**
         * Shader type (should return gl.FRAGMENT_SHADER or gl.VERTEX_SHADER).
         */
        type: new q.AbstractMethod(),

        
        /**
         * Return GL object.x
         */
        gl: function () {
            return this._gl;
        },

        
        /**
         * Return shader handle.
         */
        handle: function () {
            return this._handle;
        },


        /**
         * Return source glsl.
         */
        source: function () {
            return this._source;
        },


        /**
         * Return true if shader is compiled.
         */
        isCompiled: function() {
            var handle = this.handle();
            return !!handle && this.gl().getShaderParameter(handle, this.gl().COMPILE_STATUS);
        },

        
        /**
         * Compile shader.
         */
        compile: function () {
            var gl = this.gl();
            var handle = this._handle = gl.createShader(this.type());
            gl.shaderSource(handle, this.source());
            gl.compileShader(handle);
            
            var errors = this.compilerErrors();
            if (errors !== false) {
                console.error("Compiler errors: " + errors);
            }
            return this;
        }, 

        
        /**
          * Return array of compiler errors, or false if no errors
          */
        compilerErrors: function() {
            var handle = this.handle();
            if (!handle) {
                return "shaderHandle is null";
            } else if (!this.isCompiled()) {
                return this.gl().getShaderInfoLog(handle);
            } else {
                return false;
            }
        }
    });
});
