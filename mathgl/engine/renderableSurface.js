define(['quack', 'gl-matrix', 'kalkyl', 'mathgl', 'mathgl/engine/exports.js', 'mathgl/engine/renderable.js'], function(q, gm, Kalkyl, MathGL, Engine, Renderable) {
    return Engine.RenderableSurface = q.createClass(Renderable, {
        /**
         * Initialize.
         */
        initialize: function () {
            console.log("Initializing " + this.entity().id());
            this.initializeParameterBuffer();

            this._shaderProgram = this.generateShaderProgram();
            this._shaderProgram.link();

            var cat = this.symbolCategorization();
            var dict = new Engine.ShaderSymbolDictionary();

            var attributes = cat.attributes();

            var scope = this;

            var s, ref;
            if (attributes.length === 2) {
                s = attributes[0];
                ref = dict.attributeName(s);
                scope._uLocation = scope._shaderProgram.attributeLocation(ref);

                s = attributes[1];
                ref = dict.attributeName(s);
                scope._vLocation = scope._shaderProgram.attributeLocation(ref);
            } else {
                console.log("should have excactly 2 attribs, got " + attributes.length);
            }

            var uniforms = cat.uniforms();
            this._uniformLocations = {};
            uniforms.forEach(function (s) {
                ref = dict.uniformName(s);
                scope._uniformLocations[s] = scope._shaderProgram.uniformLocation(ref);
            });

            ref = dict.mvpMatrixName();
            this._mvpMatrixLocation = scope._shaderProgram.uniformLocation(ref)

        },

        /**
         * Return the set of symbols required by the vertex shader.
         */
        vertexShaderSinks: function () {
            return {
                x: true,
                y: true,
                z: true
            }
        },




        entityShaderStrategy: function () {
            if (this._entitiyShaderStrategy === undefined) {
                this._entityShaderStrategy = new Engine.SurfaceShaderStrategy();
            }
            return this._entityShaderStrategy;
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



        initializeParameterBuffer: function () {
            var gl = this.gl();

            var surface = this.entity();

            var parameters = surface.parameters();
            var domain = surface.domain();
            var u = parameters[0], v = parameters[1];
            var uDomain = domain[u];
            var vDomain = domain[v];

            var tessellation = new Engine.PlaneTessellation(uDomain, vDomain, 0.1);
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

//            var triangleU = tessellation.triangleU();
//            var triangleV = tessellation.triangleV();
            
//            var expressions = this.surface().getAll();
            
 //           console.log(triangleData);
            
 //           var start = new Date();
            //triangleSorter.sortTriangles(direction, expressions, parameters, triangleData);
 //           var end = new Date();

  //          console.log("Sorting triangles took " + (end-start) + "ms");


            this.updateTriangleBuffer(triangleData)

            this._triangleCount = triangleData.length;
        },


        updateTriangleBuffer: function (triangleData) {
            var start = new Date();
            var gl = this.gl();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._triangleBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleData, gl.STATIC_DRAW);
            var end = new Date();
            
            console.log("Updating buffer");
            console.log(end - start);
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

            Object.keys(this._uniformLocations).forEach(function (s) {
                var location = scope._uniformLocations[s];
//                var evaluated = entity.value(s);//flat(s).evaluated();
/*                if (!evaluated.value) {
                    console.log('could not evaluate ' + s);
                    console.log('expr gave ' + entity.get(s).simpleFormat());
                    console.log('flattened gave ' + entity.flat(s).simpleFormat());
                }*/
                var value = entity.value(s);
                gl.uniform1f(location, value);
            });

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
