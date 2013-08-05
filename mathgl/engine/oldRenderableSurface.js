define(['quack', 'kalkyl', 'mathgl', 'mathgl/engine/exports.js', 'mathgl/renderable.js'], function(q, Kalkyl, MathGL, Engine, Renderable) {
    return MathGL.RenderableSurface = q.createClass(Renderable, {
        /**
         * Constructor.
         */
        constructor: function (gl, node) {
            this._buffer = null;
            this._gl = gl;
            this._surface = node;
        },

        
        /**
         * Return surface.
         */
        surface: function() {
            return this._surface;
        },
        

        /**
         * Refresh.
         */
        refresh: function () {
            this.bindBuffer();
            this.refreshExpressions();
            this.refreshProgram();
            this.refreshAttributeValues();
        },


        refreshAttributeValues: function () {


        }
        
        
        /**
         * Return true if expression contains a parameter.
         * Useful to test if the expression is to be used as attribute instead of uniform.
         */
        expressionContainsParameter: function(expr) {
            var parameters = this.surface().parameters();
            if (parameters.length === 2) {
                var u = parameters[0];
                var v = parameters[1];
            } else {
                console.error("Surface has " + parameters.length +
                              " parameters. Should have 2.");
                return;
            }
            
            var found = false;
            var variables = expr.listVariables();
            variables.forEach(function (variable) {
                if (variable === u || variable === v) {
                    found = true;
                }
            });
            return found;
        },

        /**
         * Refresh expressions.
         */
        refreshExpressions: function () {
            var surface = this.surface();
            var expressions = surface.getAll();
            var scope = this;
            
            
            var attributeExpressions = {};
            var uniformExpressions = {};
            var flattener = new Kalkyl.Flattener(expressions);
            
            Object.keys(expressions).forEach(function (s) {
                var expr = expressions[s];
                if (scope.expressionContainsParameter(expr)) {
                    attributeExpressions[s] = expr;
                } else {
                    uniformExpressions[s] = flattener.flatten(expr).evaluated();
                }
            });
            
            flattener.map(uniformExpressions);
            this._attributeExpressions = {};

            Object.keys(attributeExpressions).forEach(function (s) {
                scope._attributeExpressions[s] = flattener.flatten(attributeExpressions[s]);
            });

            this._uniformsExpressions = uniformExpressions;
        },

        /**
         * Render.
         */
        render: function () {
            this.bindBuffer();
            this.useProgram();
            
            var uLoc = this.shaderProgram().attributeLocation('u');
            var vLoc = this.shaderProgram().attributeLocation('v');
            var wLoc = this.shaderProgram().attributeLocation('w');
            console.log(uLoc);
            console.log(vLoc);
            console.log(wLoc);
            //todo!
        },
        

        /**
         * Return true if vertex shader needs to be generated.
         */
        needsNewVertexShader: function () {
            return !this.vertexShader();
        },
        

        /**
         * Return true if fragment shader needs to be generated.
         */
        needsNewFragmentShader: function () {
            return !this.fragmentShader();
        },


        /**
         * Create vertex shader
         */
        createVertexShader: function () {
            var glsl = [
                'attribute float u;',
                'attribute float v;',
                'attribute float w;',
                'uniform mat4 uMVMatrix;',
                'uniform mat4 uPMatrix;',
                
                'void main() {',
                '   gl_Position = uPMatrix * uMVMatrix * vec4(u, v, w, 1.0);',
                '}'
            ].join('\n');
            
            return new MathGL.VertexShader(this.gl(), glsl);
        }, 


        /**
         * Create fragment shader
         */
        createFragmentShader: function () {
            var glsl = [
                'precision mediump float;',
                
                'void main() {',
                '   gl_FragColor = vec4(1.0, 0.4, 0.0, 1.0);',
                '}',
            ].join('\n');
            
            return new MathGL.FragmentShader(this.gl(), glsl);
        }

        
    });
});
