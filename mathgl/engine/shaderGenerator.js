define(['quack', 'kalkyl', 'mathgl', 'mathgl/engine/exports.js'], function(q, Kalkyl, MathGL, Engine) {

    /**
     * Attributes are composed from:
     *   Parameters.
     * Uniforms are composedf from: 
     *   CPU-evaluated 'uniform expressions'.
     * Local variables are composed from:
     *   GLSL-formatted 'attribute expressions'
     */
     
    return Engine.ShaderGenerator = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (gl, entity) {
            this._gl = gl;
            this._entity = entity;
            this._uniformExpressions = {};
            this._attributeExpressions = {};
        },
        
        
        /**
         * Return gl machine.
         */
        gl: function () {
            return this._gl;
        },


        /**
         * 
         */
        generate: function () {
            this.categorizeExpressions();
            return new Engine.ShaderProgram(this.vertexShader(), this.fragmentShader());
        },


        /**
         * Update _attributeExpressions and _uniformExpressions maps (symbol -> expression)
         */
        categorizeExpressions: function () {
            var scope = this;
            var expressions = this.expressions();
            var attributes = this._attributeExpressions = {};
            var uniforms = this._uniformExpresisons = {};
            
            Object.keys(expressions).forEach(function (symbol) {
                console.log(expressions);
                var expression = expressions[symbol].flattened(expressions);
                if (scope.expressionContainsParameter(expression)) {
                    attributes[symbol] = expression;
                } else {
                    uniforms[symbol] = expression;
                }
            });
        },
        
        
        /**
         * Return true if expression contains a parameter
         */
        expressionContainsParameter: function(expression) {
            var parameters = this.parameters();
            var variables = expression.listVariables();
            var found = false;
            variables.forEach(function (variable) {
                parameters.forEach(function (parameter) {
                    if (variable === parameter) {
                        found = true;
                    }
                });
            });
            return found;
        },

        /**
         * Generate vertex shader
         */
        vertexShader: function () {
            
            var glsl = [
                'attribute vec2 aParameters;',
                'varying vec2 vParameters;', 

                'void main() {',
                '   float u = aParameters.x;',
                '   float v = aParameters.y;',
                '   vParameters = aParameters;', 
                '   gl_Position = vec4(u, v, 0, 1.0);',
                '}'].join('\n');
            
            return new Engine.VertexShader(this.gl(), glsl);
        },
        
        /**
         * Generate fragment shader.
         */
        fragmentShader: function () {

            var glsl = [
                'precision mediump float;',
                'varying vec2 vParameters;', 
                'void main() {',
                '   gl_FragColor = vec4(vParameters.x, vParameters.y, 0.0, 1.0);',
                '}'].join('\n');

            return new Engine.FragmentShader(this.gl(), glsl);
        },
        


        /**
         * Get Entity
         */
        entity: function () {
            return this._entity;
        },
        
        
        /**
         * Get appearance
         */
        appearance: function () {
            return this.entity().appearance();
        },


        expressions: function () {
            return this.entity().getAll();
        },

        
        parameters: function () {
            return this.entity().parameters();
        },


        /**
         * Return an array of the symbols whose expressions are inside the shader as code, 
         * If any of these expressions changes, the shader will need to be recompiled.
         */
        expressionsInShader: function () {
            
        }

        

    });
});
