define(['quack', 'kalkyl', 'mathgl/exports.js'], function(q, Kalkyl, MathGL) {
    return MathGL.Renderable = q.createAbstractClass({
        /**
          * Constructor.
          */
        constructor: function (gl) {
            this._buffer = null;
            this._gl = gl;
        },

        
        gl: function () {
            return this._gl;
        },


        buffer: function() {
            if (!this._buffer) {
                this._buffer = this.gl().createBuffer();
            }
            return this._buffer;
        },


        bindBuffer: function () {
            var gl = this.gl();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer());
        },

        /**
         * Refresh.
         */
        refresh: new q.AbstractMethod(),
        

        /**
         * Render.
         */
        render: new q.AbstractMethod(),


        useProgram: function() {
            var program = this.shaderProgram();
            this.gl().useProgram(program.handle());
        },

  
        vertexShader: function(vs) {
            if (vs !== undefined) {
                this._vertexShader = vs;
            }
            return this._vertexShader;
        },


        fragmentShader: function(fs) {
            if (fs !== undefined) {
                this._fragmentShader = fs;
            }
            return this._fragmentShader;
        },


        shaderProgram: function(program) {
            if (program !== undefined) {
                this._shaderProgram = program;
            }
            return this._shaderProgram;
        },


        refreshProgram: function () {
            var vs, fs, program;
            if (this.needsNewVertexShader()) {
                vs = this.createVertexShader();
            }
            if (this.needsNewFragmentShader()) {
                fs = this.createFragmentShader();
            }
            if (vs || fs) {
                if (vs) {
                    this.vertexShader(vs);
                }
                if (fs) {
                    this.fragmentShader(fs);
                }
                var program = new MathGL.ShaderProgram(vs, fs);
                program.link();
                this.shaderProgram(program);
            }
        },
        

        needsNewVertexShader: new q.AbstractMethod(),

        needsNewFragmentShader: new q.AbstractMethod(),
        
        createVertexShader: new q.AbstractMethod(),

        createFragmentShader: new q.AbstractMethod()

        
    });
});
