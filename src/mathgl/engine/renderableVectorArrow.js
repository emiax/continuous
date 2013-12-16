define(function (require) {

    var q = require('quack');
    var gm = require('gl-matrix');
    var Kalkyl = require('kalkyl');
    var MathGL = require('mathgl');
    var Renderable = require('./renderable');
    var exports = require('./exports');

    return exports.RenderableVectorArrow = q.createClass(Renderable, {
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

            var uniforms = cat.uniforms();
            this._uniformLocations = {};
            uniforms.forEach(function (s) {
                ref = dict.uniformName(s);
                scope._uniformLocations[s] = scope._shaderProgram.uniformLocation(ref);
            });

            this._thicknessLocation = this._shaderProgram.uniformLocation("thickness");
            this._positionLocation = this._shaderProgram.uniformLocation("position");
            this._valueLocation = this._shaderProgram.uniformLocation("value");

            this._vertexDataLocation = this._shaderProgram.attributeLocation("vertexData");

            var uniforms = cat.uniforms();
            this._uniformLocations = {};
            var scope = this;
            uniforms.forEach(function (s) {
                ref = dict.uniformName(s);
                scope._uniformLocations[s] = scope._shaderProgram.uniformLocation(ref);
            });

            ref = dict.mvMatrixName();
            this._mvMatrixLocation = this._shaderProgram.uniformLocation(ref);
            ref = dict.pMatrixName();
            this._pMatrixLocation = this._shaderProgram.uniformLocation(ref);
            
            var scope = this;
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
            // todo: remove?
        },


        /**
         * Initialize Parameter buffer
         */
        initializeParameterBuffer: function () {
            var gl = this.gl();

            var curve = this.entity();

            var parameters = curve.parameters();

            var tessellation = new exports.ArrowTessellation();
            var vertexData = tessellation.vertexArray();

            // var vertexData = tessellation.vertexArray();

            var vertexBuffer = this._vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

            var triangleBuffer = this._triangleBuffer = gl.createBuffer();

            
            var vec3 = gm.vec3;
            var direction = vec3.create();
            var triangleData = tessellation.triangleArray();
            
//            var triangleSorter = new exports.TriangleSorter(uData, vData);

            this.updateTriangleBuffer(triangleData)

            this._triangleCount = triangleData.length;
        },


        /**
         * Render.
         */
        render: function (renderer) {

            var gl = this.gl();
            this.useProgram();

            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
            gl.enableVertexAttribArray(this._vertexDataLocation);
            gl.vertexAttribPointer(this._vertexDataLocation, 3, gl.FLOAT, false, 0, 0);

            var thicknessLocation = this._thicknessLocation;
            var positionLocation = this._positionLocation;
            var valueLocation = this._valueLocation;


            var position = this.entity().positionExpr(); 

            if (!position.isEvaluated()) {
                console.error('position could not be evaluated.');
                position.dump();
            }


            var value = this.entity().valueExpr();

            if (!value.isEvaluated()) {
                console.error('value could not be evaluated.');
                value.dump();
            }


            gl.uniform1f(thicknessLocation, this.entity().thickness());
            gl.uniform3f(positionLocation, position.x().value(), position.y().value(), position.z().value());
            gl.uniform3f(valueLocation, value.x().value(), value.y().value(), value.z().value());
            
            var entity = this.entity();
            var scope = this;
            Object.keys(this._uniformLocations).forEach(function (s) {
                var location = scope._uniformLocations[s];
                var value = entity.value(s);
                gl.uniform1f(location, value);
            });


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
            
            gl.disableVertexAttribArray(this._vertexDataLocation);

        },

        vertexShaderSinks: function () {
            return {};
        }, 


        entityShaderStrategy: function () {
            if (this._entityShaderStrategy === undefined) {
                this._entityShaderStrategy = new exports.VectorArrowShaderStrategy();
            }
            return this._entityShaderStrategy;
        }

      
    });
});
