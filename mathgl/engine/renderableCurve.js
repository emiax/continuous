define(function (require) {

    var q = require('quack');
    var gm = require('gl-matrix');
    var Kalkyl = require('kalkyl');
    var MathGL = require('mathgl');
    var Renderable = require('./renderable');
    var exports = require('./exports');

    return exports.RenderableCurve = q.createClass(Renderable, {
        /**
         * Initialize.
         */
        initialize: function () {
            this.initializeParameterBuffer();

            this._shaderProgram = this.generateShaderProgram();
            this._shaderProgram.link();

            var cat = this.symbolCategorization();
            var dict = new exports.ShaderSymbolDictionary();

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
            

            ref = dict.mvMatrixName();
            this._mvMatrixLocation = this._shaderProgram.uniformLocation(ref);
            ref = dict.pMatrixName();
            this._pMatrixLocation = this._shaderProgram.uniformLocation(ref);

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
            // todo: remove? Create new renderable when expression is added/removed/changed?
        },


        /**
         * Return the set of symbols required by the vertex shader.
         */
        vertexShaderSinks: function () {
            return {
                x: true,
                y: true,
                z: true
            };
        },


        /**
         * TangentExpressions. 
         */
        tangentExpressions: function () {
            if (this._tangentExpressions === undefined) {
               this._tangentExpressions = this.entity().tangentExpressions();
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
                    var derivativeExpressions = this.tangentExpressions();
                    this._entityShaderStrategy = new exports.CurveShaderStrategy(derivativeExpressions);
                } else {
                    console.error("missing parameter");
                }
            }
            return this._entityShaderStrategy;
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
            
            var tessellation = new exports.TubeTessellation(uDomain, stepSize);
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
            

            var triangleSorter = new exports.TriangleSorter(uData, vData);

            this.updateTriangleBuffer(triangleData)

            this._triangleCount = triangleData.length;
        },


        /**
         * Render.
         */
        render: function (renderer) {
            var gl = this.gl();
            this.useProgram();

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
                value = entity.value(s);
                gl.uniform1f(location, value);
            });

            var thicknessLocation = this._thicknessLocation;
            gl.uniform1f(thicknessLocation, this.entity().thickness());

            var location = this._mvMatrixLocation;
            var e = new Float32Array(16);
            e = renderer.mvMatrix();
            gl.uniformMatrix4fv(location, false, e);
            
            var location = this._pMatrixLocation;
            e = new Float32Array(16);
            e = renderer.pMatrix();
            gl.uniformMatrix4fv(location, false, e);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._triangleBuffer);
            gl.drawElements(gl.TRIANGLES, this._triangleCount, gl.UNSIGNED_SHORT, 0);
        }

      
    });
});
