define(['quack', 'kalkyl', 'mathgl', 'mathgl/engine/exports.js'], function(q, Kalkyl, MathGL, Engine) {

    /**
     * Attributes are composed from:
     *   Parameters.
     * Uniforms are composed from:
     *   CPU-evaluated 'uniform expressions'.
     * Varyings are composed from:
     *   GLSL-formatted 'varying expressions' that are evaluated on the GPU.
     */

    return Engine.ShaderProgramGenerator = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (gl, entity) {
            this._gl = gl;
            this._entity = entity;

            this._attributes = null;
            this._uniforms = null;
            this._vertexShaderDefinitions = null;
            this._fragmentShaderDefinitions = null;

            this._dependencyGraph = null;
        },


        /**
         * Return gl machine.
         */
        gl: function () {
            return this._gl;
        },


        /**
         * Dependency graph containing expressions defined on entity.
         * Parameters are NOT defined in the graph, but may be referred to.
         * This means that graph MAY HAVE undefined expressions.
         */
        dependencyGraph: function () {
            if (this._dependencyGraph === null) {
                this._dependencyGraph = new Kalkyl.DependencyGraph(this.expressions());
            }
            return this._dependencyGraph;
        },


        /**
         * Return the set of symbols required by the vertex shader. Shallow.
         */
        vertexShaderSinks: function () {
            return {
                x: true,
                y: true,
                z: true
            };
        },


        /**
         * Return the set of symbols required by the fragment shader. Shallow.
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
         * Find out where to define all the variables required by the vertex and fragment shader.
         */
        shaderDefinitions: function () {
            var graph = this.dependencyGraph();

            var vertexSinks = Object.keys(this.vertexShaderSinks());
            var fragmentSinks = Object.keys(this.fragmentShaderSinks());

            var parameters = this.parameterSymbols();
            var independents = this.independentSymbols();

            var vertexSymbols = graph.orderedSubset(vertexSinks);
            var fragmentSymbols = graph.orderedSubset(fragmentSinks);

            var vertexShaderDefinitions = [];
            var fragmentShaderDefinitions = [];

            var uniforms = {};            
            var attributes = [];
            var varyings = [];

            vertexSymbols.forEach(function (s) {
                if (parameters[s]) {
                    attributes.push(s);
                } else if (independents[s]) {
                    uniforms[s] = true;
                } else {
                    vertexShaderDefinitions.push(s);
                }
            });

            fragmentSymbols.forEach(function (s) {
                if (parameters[s]) {
                    varyings.push(s);
                } else if (independents[s]) {
                    uniforms[s] = true;
                } else {
                    fragmentShaderDefinitions.push(s);
                }
            });

            this._uniforms = Object.keys(uniforms);
            this._attributes = attributes;
            this._varyings = varyings;
            this._vertexShaderDefinitions = vertexShaderDefinitions;
            this._fragmentShaderDefinitions = fragmentShaderDefinitions;
        },


        /**
         * Return all the expressions defined for the entity.
         */
        expressions: function () {
            return this.entity().getAll();
        },

        /**
         * Return all expressions needed to render the entity. (map symbol->expression)
         */
        /*
          expressions: function () {
          var verteShaderSymbols = this.vertexShaderSymbols();
          var fragmentShaderSymbols = this.fragmentShaderSymbols();

          var symbols = {};
          Object.keys(vertexShaderSymbols).forEach(function(s) {
          symbols[s] = true;
          });
          Object.keys(fragmentShaderSymbols).forEach(function(s) {
          symbols[s] = true;
          });

          var expressions = {};
          var entity = this.entity();
          Object.keys(symbols).forEach(function (s) {
          var expr = entity.get(s);
          if (expr) {
          expressions[s] = expr;
          } else {
          console.error(s + " is required to render entity " + entity.id());
          }
          });
          console.log(expressions);
          return expressions;
          },*/


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
         * Return a set of all parameter independent symbols available in scope.
         */
        independentSymbols: function () {
            var graph = this.dependencyGraph();
            var expressions = this.expressions();
            var parameters = Object.keys(this.parameterSymbols());

            var independentSymbols = {};
            Object.keys(expressions).forEach(function (symbol) {
                if (!graph.dependsOnAny(symbol, parameters)) {
                    independentSymbols[symbol] = true;
                }
            });
            return independentSymbols;
        },


        /**
         * Generate shader program.
         */
        generate: function () {
            //            console.log(this.parameterDependentSymbols());
            this.shaderDefinitions();

            console.log('uniforms');
            console.log(this._uniforms);
            console.log('attributes');
            console.log(this._attributes);
            console.log('varyings');
            console.log(this._varyings);
            console.log('vertexShaderDefinitions');
            console.log(this._vertexShaderDefinitions);
            console.log('fragmentShaderDefinitions');
            console.log(this._fragmentShaderDefinitions);

            console.log(this.reference('t', 'vertex'));

            var vsGenerator = new Engine.VertexShaderGenerator();
            var fsGenerator = new Engine.FragmentShaderGenerator();

            var gl = this.gl();
            var entity = this.entity();

            /* var vs = vsGenerator.generate(gl, entity);
               var fs = fsGenerator.generate(gl, entity);

               return new Engine.ShaderProgram(vs, fs);*/
        },

        
        /**
         * Return true if symbol is defined as a uniform.
         */
        uniform: function (symbol) {
            return this._uniforms.indexOf(symbol) !== -1;
        },


        /**
         * Return true if symbol is defined as a attribute.
          */
        attribute: function (symbol) {
            return this._attributes.indexOf(symbol) !== -1;
        },


        /**
         * Return true if symbol is defined as a varying.
         */
        varying: function (symbol) {
            return this._varyings.indexOf(symbol) !== -1;
        },


        /**
         * Return true if symbol is defined as a vertex shader definition.
         */
        vertexShaderDefinition: function (symbol) {
            return this._vertexShaderDefinitions.indexOf(symbol) !== -1;
        },


        /**
         * Return true if symbol is defined as a fragment shader definition.
         */
        fragmentShaderDefinition: function (symbol) {
            return this._fragmentShaderDefinitions.indexOf(symbol) !== -1;
        },


        /**
         * Get the shader variable name of a symbol. context may be 'vertex' or 'fragment'
         */
        reference: function (symbol, context) {
            if (this.uniform(symbol))
                return 'u_' + symbol;
            if (context === 'vertex') {
                if (this.attribute(symbol)) {
                    return 'a_' + symbol;
                } else if (this.vertexShaderDefinition(symbol)) {
                    return 'vs_' + symbol;
                }
                console.error("Symbol is not defined.");
            } else if (context === 'fragment') {
                if (this.varying(symbol))
                    return 'v_' + symbol;
                if (this.fragmentShaderDefinition(symbol))
                    return 'fs_' + symbol;
                console.error("Symbol is not defined.");
            }
            console.error("Invalid context.");
            return '0';
        },


        /**
         * Return a set of all the parameter dependent symbols.
         */
        /*        parameterDependentSymbols: function () {
                  if (this._parameterDependentSymbols === null) {
                  var scope = this;

                  var parameters = this.parameterSymbols();
                  var expressions = this.expressions();

                  var uniformSymbols = this._uniformSymbols = {};
                  var parameterDependentSymbols = this._parameterDependentSymbols = {};

                  var graph = new Kalkyl.DependencyGraph(expressions);

                  Object.keys(expressions).forEach(function (symbol) {
                  if (graph.dependsOnAny(symbol, parameters)) {
                  parameterDependentSymbols[symbol] = true;
                  }
                  });
                  }
                  return this._parameterDependentSymbols;
                  },
        */

        /**
         * Generate vertex shader
         */
        vertexShader: function () {

            var glsl = "";
            this.attributes().forEach(function (s) {
                glsl += 'attribute float attribute_' + s + ";\n";
            });

            // All attributes need to be interpolated to be referred from fragment shader.
            this.attributes().forEach(function (s) {
                glsl += 'varying float varying_' + s + ";\n";
            });

            this.varyingExpressions.forEach(function (pair) {
                glsl += 'varying float varying_' + pair.symbol + ';\n';
            });


            glsl += "void main() {\n";

            var glslFormatter = null;
            this.varyingExpressions.forEach(function (pair) {
                var glslFormattedExpr = glslFormatter.format(pair.expression);
                glsl += 'varying_' + pair.symbol + ' = ' + glslFormattedExpr + ';\n';
            });

            glsl += "void main() {\n";


            /*
              var glsl = [

              'attribute float attribute_u;',
              'attribute float attribute_v;',
              'varying float varying_u;',
              'varying float varying_v;',

              'void main() {'].merge(

              ).merge(['   float vec3 position = vec3(varying_x, varying_y, varying_z);
              '   gl_Position = vec4(u - 0.8*cos(v*4.0), v, u, 1.0);',
              '}'].join('\n');*/

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


        /**
         * Return an array of the symbols whose expressions are inside the shader as code,
         * If any of these expressions changes, the shader will need to be recompiled.
         */
        expressionsInProgram: function () {

        }



    });
});
