define(function (require) {

    var q = require('quack');
    var exports = require('./exports');

    return exports.PlaneTessellation = q.createClass({
        /**
         * Constructor.
         *
         * uDomain = [min, max]
         * vDomain = [min, max]
         * res = [uRes, vRes] or only one number to be used as both uRes and vRes. Res is the number of vertices per length unit.
         */
        constructor: function (uDomain, vDomain, stepSize) {
            if (typeof stepSize === 'number') {
                this._uStep = stepSize;
                this._vStep = stepSize;
            } else if (stepSize.length === 2) {
                this._uStep = stepSize[0];
                this._vStep = stepSize[1];
            } else {
                console.error("Invalid step size.");
            }

            var uMin = this._uMin = uDomain[0];
            var uMax = this._uMax = uDomain[1];
            var vMin = this._vMin = vDomain[0];
            var vMax = this._vMax = vDomain[1];
            
            var uDist = uMax - uMin;
            var vDist = vMax - vMin;
            
            
            var n = this._n = Math.ceil(uDist / this._uStep) + 1;
            var m = this._m = Math.ceil(vDist / this._vStep) + 1;

            this._tessellated = false;
            
        },


        /**
         * Tessellate.
         */
        tessellate: function () {
            var n = this._n;
            var m = this._m;
            
            var uData = this._uData = new Float32Array(n*m);
            var vData = this._vData = new Float32Array(n*m);

            // Two triangles form a quad. There are (n - 1)(m - 1) quads.
            var nTriangles = 2*(n - 1)*(m - 1);

            //Indices to uData, vData
            var triangleIndices = this._triangleIndices = new Uint16Array(nTriangles*3);

            // x, y, z of the centroids of the triangles.
            var triangleU = this._triangeleU = new Float32Array(nTriangles);
            var triangleV = this._triangeleV = new Float32Array(nTriangles);
            
            var uMin = this._uMin;
            var uMax = this._uMax;
            var vMin = this._vMin;
            var vMax = this._vMax;
            var uStep = this._uStep;
            var vStep = this._vStep;
            
            // Create vertices in four steps like this.
            // aaab
            // aaab
            // cccd
            
            var i, j, a = n - 1, b = m - 1, k = 0;
            for (i = 0; i < a; i++) {
                // a-type vertices
                for (j = 0; j < b; j++) {
                    uData[k] = uMin + uStep*i;
                    vData[k] = vMin + vStep*j;
                    k++;
                }
                // b-type vertices
                uData[k] = uMin + uStep*i;
                vData[k] = vMax;
                k++;
            }
            // c-type vertices
            for (j = 0; j < b; j++) {
                uData[k] = uMax;
                vData[k] = vMin + vStep*j;
                k++;
            }
            // d vertex
            uData[k] = uMax;
            vData[k] = vMax;
            
            t = 0;
            for (i = 0; i < a; i++) {
                for (j = 0; j < b; j++) {
                    var indexA = i*m + j;
                    var indexB = i*m + j + 1;
                    var indexC = (i + 1)*m + j;
                    var indexD = (i + 1)*m + j + 1;

                    triangleIndices[t*3] = indexA; //i*m + j;
                    triangleIndices[t*3 + 1] = indexB; //i*m + j + 1;
                    triangleIndices[t*3 + 2] = indexC; //(i + 1)*m + j;
                    triangleU[t] = (uData[indexA] + uData[indexB] + uData[indexC])/3;
                    triangleV[t] = (vData[indexA] + vData[indexB] + vData[indexC])/3;
                    t++;
                  
                    triangleIndices[t*3] = indexC; //(i + 1)*m + j;
                    triangleIndices[t*3 + 1] = indexB; //i*m + j + 1;
                    triangleIndices[t*3 + 2] = indexD; //(i + 1)*m + j + 1;
                    triangleU[t] = (uData[indexC] + uData[indexB] + uData[indexD])/3;
                    triangleV[t] = (vData[indexC] + vData[indexB] + vData[indexD])/3;
                    t++;
                }
            }
            this._tessellated = true;
        },

        
        /**
         * Get u array (first paramter). Tessellate if not done yet.
         */
        uArray: function () {
            if (!this._tessellated) {
                this.tessellate();
            }
            return this._uData;

        },


        /**
         * Get v array (second paramter). Tessellate if not done yet.
         */
        vArray: function () {
            if (!this._tessellated) {
                this.tessellate();
            }
            return this._vData;
        },


        /**
         * Get triangle array. Tessellate if not done yet.
         */
        triangleArray: function () {
            if (!this._tessellated) {
                this.tessellate();
            }
            return this._triangleIndices;
        },

        
        /**
         * Get u values for triangles
         */
        triangleUArray: function () {
            if (!this._tessellated) {
                this.tessellate();
            }
            return this._triangleU;
        },


        /**
         * Get v values for triangles
         */
        triangleVArray: function () {
            if (!this._tessellated) {
                this.tessellate();
            }
            return this._triangleV;
        }
    });
    
});

