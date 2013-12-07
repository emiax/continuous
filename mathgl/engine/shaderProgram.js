define(function (require) {

    var q = require('quack');
    var exports = require('./exports');

    return exports.ShaderProgram = q.createClass({
        /**
         * Constructor.
         */
        constructor: function(vertexShader, fragmentShader) {
            if (!(vertexShader instanceof exports.VertexShader)) {
                console.warn("vertexShader has incorrect type");
            }

            if (!(fragmentShader instanceof exports.FragmentShader)) {
                console.warn("fragmentShader has incorrect type");
            }

            var vGL = vertexShader.gl();
            var fGL = fragmentShader.gl();
            if (!vGL || vGL !== fGL) {
                console.error("shaders do not belong to same gl context");
            }

            this._handle = null;
            this._vertexShader = vertexShader;
            this._fragmentShader = fragmentShader;
            this._gl = vertexShader.gl();
        },


        /**
         * Return true if program is linked.
         */ 
        isLinked: function () {
            var handle = this.handle();
            return (handle && !!this.gl().getProgramParameter(this.handle(), this.gl().LINK_STATUS));
        },

        
        /**
         * Link shader program.
         */
        link: function () {
            var gl = this.gl();
            var handle = this._handle = gl.createProgram();
            
            var vs = this.vertexShader();
            var fs = this.fragmentShader();

            if (!vs.isCompiled()) {
                vs.compile();
                if (!vs.isCompiled()) {
                    console.log("Compile error, vertex shader");
                }
            }
            if (!fs.isCompiled()) {
                fs.compile();
                if (!fs.isCompiled()) {
                    console.log("Compile error, fragment shader");
                }
            }
            
            gl.attachShader(handle, vs.handle());
            gl.attachShader(handle, fs.handle());
            gl.linkProgram(handle);

            if (!this.isLinked()) {
                console.error("Linker error.");
            } else {
                console.log("Successfully linked shaderProgram");
            }
        },


        /**
         * Get attribute location.
         */        
        attributeLocation: function(name) {
            return this.gl().getAttribLocation(this.handle(), name);
        },


        /**
         * Get uniform location.
         */
        uniformLocation: function(name) {
            return this.gl().getUniformLocation(this.handle(), name);
        },


        /**
         * Return GL object.
         */
        gl: function () {
            return this._gl;
        }, 


        /**
         * Return handle.
         */
        handle: function () {
            return this._handle;
        }, 

        
        /**
         * Return vertex shader.
         */
        vertexShader: function () {
            return this._vertexShader;
        }, 


        /**
         * Return fragment shader.
         */
        fragmentShader: function () {
            return this._fragmentShader;
        }

    });
});
