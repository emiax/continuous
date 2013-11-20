define(['quack', 'kalkyl', 'mathgl/engine/exports.js'], function(q, Kalkyl, Engine) {
    return Engine.Renderable = q.createAbstractClass({
        /**
          * Constructor.
          */
        constructor: function (gl, scope) {
            this._scope = scope;
            this._gl = gl;
            this._tBuffer = null;
            this._angleBuffer = null;
            this._uLocation = null;
            this._uniformLocations = null;
        },


        /**
         * Return the gl machine.
         */
        gl: function () {
            return this._gl;
        },


        /**
         * Return my entity in the scene.
         */
        entity: function () {
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
         * Entity shader strategy. (returns instance of EntityShaderStrategy)
         */
        entityShaderStrategy: new q.AbstractMethod(),


        /**
         * ParameterSymbols. (set of symbols)
         */
        parameterSymbols: function () {
            var set = {};
            this.entity().parameters().forEach(function (s) {
                set[s] = true;
            });
            return set;
        },


        /**
         * Vertex shader sinks
         */
        vertexShaderSinks: new q.AbstractMethod(),


        /**
         * Return the set of symbols required by the fragment shader.
         */
        fragmentShaderSinks: function () {
            var a = this.appearance();
            var symbols = {};
            if (a) {
                a.traverse(function (node) {
                    var newSymbols = node.symbols();
                    Object.keys(newSymbols).forEach(function (k) {
                        symbols[k] = true;
                    });
                });
            }
            return symbols;
        },


        /**
         * Return my symbol categorization.
         */
        symbolCategorization: function () {
            if (this._symbolCategorization == undefined) {
                this._symbolCategorization = new Engine.SymbolCategorization(this.vertexShaderSinks(),            
                                                                         this.fragmentShaderSinks(),
                                                                         this.parameterSymbols(),
                                                                         this.expressions());
            } 
            return this._symbolCategorization;
        },


        /**
         * Return all expressions available in the entity.
         */
        expressions: function () {
            return this.entity().getAll();
        },
        

        
        /**
         * Return appearance of the entity.
         */
        appearance: function () {
            return this.entity().appearance();
        },
        

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
         * Generate shader program.
         */
        generateShaderProgram: function () {
            var gl = this.gl();

          
            var vertexShaderFormatter = new Engine.VertexShaderFormatter(this.expressions(),
                                                                      this.symbolCategorization());

            var fragmentShaderFormatter = new Engine.FragmentShaderFormatter(this.expressions(),
                                                                             this.symbolCategorization(),
                                                                             this.appearance());

            var ess = this.entityShaderStrategy();
            vertexShaderFormatter.entityStrategy(ess);
            fragmentShaderFormatter.entityStrategy(ess);


            var vertexShaderGLSL = vertexShaderFormatter.format();
            console.log(vertexShaderGLSL);
            var fragmentShaderGLSL = fragmentShaderFormatter.format()
            console.log(fragmentShaderGLSL);

            var vs = new Engine.VertexShader(gl, vertexShaderGLSL);
            var fs = new Engine.FragmentShader(gl, fragmentShaderGLSL);

            return new Engine.ShaderProgram(vs, fs);
        },

        
        /**
         * Update triangle buffer.
         */
        updateTriangleBuffer: function (triangleData) {
            var gl = this.gl();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._triangleBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleData, gl.STATIC_DRAW);
        },

        
        /**
         * Get/Set shader program.
         */
        shaderProgram: function(sp) {
            if (sp !== undefined) {
                this._shaderProgram = sp;
            }
            return this._shaderProgram;
        },

        render: new q.AbstractMethod()

        
    });
});
