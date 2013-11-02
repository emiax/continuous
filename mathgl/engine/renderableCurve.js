define(['quack', 'gl-matrix', 'kalkyl', 'mathgl', 'mathgl/engine/exports.js', 'mathgl/engine/renderable.js'], function(q, gm, Kalkyl, MathGL, Engine, Renderable) {
    return Engine.RenderableCurve = q.createClass(Renderable, {
        /**
         * Initialize.
         */
        initialize: function () {
//            console.log("Initializing " + this.scope().id());
            this.initializeParameterBuffer();

            this._shaderProgram = this.generateShaderProgram();
            this._shaderProgram.link();

            var cat = this.symbolCategorization();
            var dict = new Engine.ShaderSymbolDictionary();

            var attributes = cat.attributes();

            var scope = this;

            var s, ref;
            if (attributes.length === 1) {
                s = attributes[0];
                ref = dict.attributeName(s);
                scope._uLocation = scope._shaderProgram.attributeLocation(ref);
            } else {
                console.log("should have excactly 1 attrib, got " + attributes.length);
            }

            var uniforms = cat.uniforms();
            this._uniformLocations = {};
            uniforms.forEach(function (s) {
                ref = dict.uniformName(s);
                scope._uniformLocations[s] = scope._shaderProgram.uniformLocation(ref);
            });

            ref = 'theta';
            scope._vLocation = scope._shaderProgram.attributeLocation(ref);

            ref = 'thickness';
            scope._thicknessLocation = scope._shaderProgram.uniformLocation(ref);
            

            ref = dict.mvpMatrixName();
            this._mvpMatrixLocation = scope._shaderProgram.uniformLocation(ref)

        },


        /**
         * Destroy.
         */
        destroy: function () {
            // TODO: deallocating
        },


        /**
         * Refresh.
         */
        refresh: function (spec) {
            /*            var refreshUniforms = {};
                          var refreshAttributes = {};
                          var refreshVertexShader = false;
                          var refreshFragmentShader = false;

                          console.log(spec);
                          spec = spec || {};
                          var expressions = spec.expressions || {};


                          if (spec.appearance) {

                          }*/
        },


        /**
         * Return the set of symbols required by the vertex shader.
         * Make sure that derivative (tangent) expressions get evaluated in the shader.
         */
        vertexShaderSinks: function () {
            var sinks = {
                x: true,
                y: true,
                z: true
            };
            
            var scope = this;
            var tangentExpressions = this.tangentExpressions();
            Object.keys(tangentExpressions).forEach(function (s) {
                if (!scope.expressions[s]) {
                    sinks[s] = true;
                }
            });

            return sinks;
        },


        /**
         * TangentExpressions. 
         */
        tangentExpressions: function () {
            if (this._tangentExpressions === undefined) {
                this._tangentExpressions = this.entity().tangentExpressions();
          //      return this.entity().tangentExpressions();
            }
            return this._tangentExpressions;
        },



        /**
         * Entity Shader Strategy
         */
        entityShaderStrategy: function () {
            if (this._entitiyShaderStrategy === undefined) {
                var parameters = this.entity().parameters();
                var parameter = parameters[0];
                if (parameter) {
                    this._entityShaderStrategy = new Engine.CurveShaderStrategy(parameter);
                } else {
                    console.error("missing parameter");
                }
            }
            return this._entityShaderStrategy;
        },

        
        /**
         * Symbol categorization.
         */
        symbolCategorization: function () {
            if (this._symbolCategorization == undefined) {
                this._symbolCategorization = new Engine.SymbolCategorization(this.vertexShaderSinks(),            
                                                                         this.fragmentShaderSinks(),
                                                                         this.parameterSymbols(),
                                                                         this.primitiveSymbols(),
                                                                         this.expressions());
            } 
            return this._symbolCategorization;
        },


        /**
         * Overrides expressions is base class.
         * Also incldues tangent expressions.
         */
        expressions: function () {
            var curve = this.entity();
            var expressions = curve.allExpressions();
            var tangentExpressions = this.tangentExpressions();
            
            Object.keys(tangentExpressions).forEach(function (s) {
                if (!expressions[s]) {
                    expressions[s] = tangentExpressions[s];
                }
            });
            
            return expressions;
        },

        /**
         * Initialize Parameter buffer
         */
        initializeParameterBuffer: function () {
            var gl = this.gl();

            var curve = this.entity();

            var parameters = curve.parameters();
            var domain = curve.domain();
            var u = parameters[0];
            var uDomain = domain[u];
            var stepSize = curve.stepSize()[u];
            
            console.log("stepSize:" + stepSize);
            

            var tessellation = new Engine.TubeTessellation(uDomain, stepSize);
            var uData = tessellation.uArray();
            var vData = tessellation.vArray();

            // var vertexData = tessellation.vertexArray();

            var uBuffer = this._uBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, uData, gl.STATIC_DRAW);

            var vBuffer = this._vBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vData, gl.STATIC_DRAW);

            var triangleBuffer = this._triangleBuffer = gl.createBuffer();

            
            var vec3 = gm.vec3;
            var direction = vec3.create();
            var triangleData = tessellation.triangleArray();
            

            var triangleSorter = new Engine.TriangleSorter(uData, vData);

            this.updateTriangleBuffer(triangleData)

            this._triangleCount = triangleData.length;
        },


        /**
         * Render.
         */
        render: function (camera) {

            var gl = this.gl();
            this.useProgram();

            /*
              Object.keys(this._parameterLocations).forEach(function (s) {
              gl.bindBuffer(gl.ARRAY_BUFFER, this._attributeBuffer[s]);
              gl.enableVertexAttribArray(this._parameterLocations[s]);
              gl.vertexAttribPointer(this._parameterLocations[s], 1, gl.FLOAT, false, 0, 0);
              });
            */
            gl.bindBuffer(gl.ARRAY_BUFFER, this._uBuffer);
            gl.enableVertexAttribArray(this._uLocation);
            gl.vertexAttribPointer(this._uLocation, 1, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this._vBuffer);
            gl.enableVertexAttribArray(this._vLocation);
            gl.vertexAttribPointer(this._vLocation, 1, gl.FLOAT, false, 0, 0);


            var scope = this;
            var entity = this.entity();

            var te = this.tangentExpressions();
//            console.log(te.dydd);
            Object.keys(this._uniformLocations).forEach(function (s) {
                var location = scope._uniformLocations[s];
                
                if (te[s]) {
                    value = te[s].value();
                } else {
                    value = entity.value(s);
                }

                gl.uniform1f(location, value);
            });

            var thicknessLocation = this._thicknessLocation;
            gl.uniform1f(thicknessLocation, this.entity().thickness());

            var location = this._mvpMatrixLocation;

            var e = new Float32Array(16);

            e = camera.matrix();
            gl.uniformMatrix4fv(location, false, e);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._triangleBuffer);

                gl.drawElements(gl.TRIANGLES, this._triangleCount, gl.UNSIGNED_SHORT, 0);
            
            //todo!

        }

      
    });
});
