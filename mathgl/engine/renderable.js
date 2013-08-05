define(['quack', 'kalkyl', 'mathgl/exports.js'], function(q, Kalkyl, MathGL) {
    return MathGL.Renderable = q.createAbstractClass({
        /**
          * Constructor.
          */
        constructor: function (gl, scope) {
            this._scope = scope;
            this._gl = gl;
        },

        
        gl: function () {
            return this._gl;
        },


        scope: function () {
            return this._scope;
        },


        /**
         * Initialize.
         */
        initialize: new q.AbstractMethod(),

        
        /**
         * Destroy.
         */
        destroy: new q.AbstractMethod(),


        /**
         * Refresh.
         */
        refresh: new q.AbstractMethod(),
        

        /**
         * Render.
         */
        render: new q.AbstractMethod(),

        
        /**
         * Use this renderable's shader program.
         */
        useProgram: function() {
            var program = this.shaderProgram();
            if (!program.isLinked()) {
                console.error("Shader program is not linked.");
            }
            this.gl().useProgram(program.handle());
        },

        
        /**
         * Get/Set shader program.
         */
        shaderProgram: function(sp) {
            if (sp !== undefined) {
                this._shaderProgram = sp;
            }
            return this._shaderProgram;
        }
        
    });
});
