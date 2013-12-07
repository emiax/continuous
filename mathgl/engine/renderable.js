define(function (require) {

    var q = require('quack');
    var Kalkyl = require('kalkyl');
    var exports = require('./exports');

    return exports.Renderable = q.createAbstractClass({
        /**
          * Constructor.
          */
        constructor: function (gl, entity) {
            this._entity = entity;
            this._gl = gl;
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
            return this._entity;
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
         * Render if entity is visible.
         */
        renderIfVisible: function (renderer) {
            if (this.entity().chainVisible()) {
                this.render(renderer);
            }
        },

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
         * PrimitiveSymbols. (set of symbols)
         */
        primitiveSymbols: function () {
            var set = {};
            Object.keys(this.entity().allPrimitives()).forEach(function (s) {
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
                this._symbolCategorization = new exports.SymbolCategorization(this.vertexShaderSinks(),            
                                                                         this.fragmentShaderSinks(),
                                                                         this.parameterSymbols(),
                                                                         this.primitiveSymbols(),
                                                                         this.expressions());
            } 
            return this._symbolCategorization;
        },


        /**
         * Return all expressions available in the entity.
         */
        expressions: function () {
            return this.entity().allExpressions();
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
            
            var vertexShaderFormatter = new exports.VertexShaderFormatter(this.expressions(),
                                                                      this.symbolCategorization());

            console.log(exports);

            var fragmentShaderFormatter = new exports.FragmentShaderFormatter(this.expressions(),
                                                                             this.symbolCategorization(),
                                                                             this.appearance());

            var ess = this.entityShaderStrategy();
            vertexShaderFormatter.entityStrategy(ess);
            fragmentShaderFormatter.entityStrategy(ess);


            var vertexShaderGLSL = vertexShaderFormatter.format();
            console.log(vertexShaderGLSL);
            var fragmentShaderGLSL = fragmentShaderFormatter.format()
            console.log(fragmentShaderGLSL);

            var vs = new exports.VertexShader(gl, vertexShaderGLSL);
            var fs = new exports.FragmentShader(gl, fragmentShaderGLSL);

            return new exports.ShaderProgram(vs, fs);
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
