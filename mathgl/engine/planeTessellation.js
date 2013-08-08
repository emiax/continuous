define(['quack', 'mathgl/engine/exports.js'], function(q, Engine) {
    return Engine.PlaneTessellation = q.createClass({
        /**
         * Constructor.
         *
         * uDomain = [min, max]
         * vDomain = [min, max]
         * res = [uRes, vRes] or only one number to be used as both uRes and vRes. Res is the number of vertices per length unit.
         */
        constructor: function (uDomain, vDomain, res) {
            if (typeof res === 'number') {
                this._uRes = res;
                this._vRes = res;
            } else {
                this._uRes = res[0];
                this._vRes = res[0];
            }
            var uMin = this._uMin = uDomain[0];
            var uMax = this._uMax = uDomain[1];
            var vMin = this._vMin = vDomain[0];
            var vMax = this._vMax = vDomain[1];
            
            var uDist = uMax - uMin;
            var vDist = vMax - vMin;
            

            var n = this._n = Math.ceil(uDist * this._uRes) + 1;
            var m = this._m = Math.ceil(vDist * this._vRes) + 1;

            this._tessellated = false;
            
        },


        /**
         * Tessellate.
         */
        tessellate: function () {
            var n = this._n;
            var m = this._m;
            var vertices = this._vertices = new Float32Array(2*n*m);
            var triangles = this._triangles = new Uint16Array(6*(n - 1)*(m - 1));

            var uMin = this._uMin;
            var uMax = this._uMax;
            var vMin = this._vMin;
            var vMax = this._vMax;
            var uStep = 1/this._uRes;
            var vStep = 1/this._vRes;
            
            // Create vertices in four steps like this.
            // aaab
            // aaab
            // cccd
            
            var i, j, a = n - 1, b = m - 1, k = 0;
            for (i = 0; i < a; i++) {
                // a-type vertices
                for (j = 0; j < b; j++) {
                    vertices[k++] = uMin + uStep*i;
                    vertices[k++] = vMin + vStep*j;
                }
                // b-type vertices
                vertices[k++] = uMin + uStep*i;
                vertices[k++] = vMax;
            }
            // c-type vertices
            for (j = 0; j < b; j++) {
                vertices[k++] = uMax;
                vertices[k++] = vMin + vStep*j;
            }
            // d vertex
            vertices[k++] = uMax;
            vertices[k++] = vMax;
            
            k = 0;
            for (i = 0; i < a; i++) {
                for (j = 0; j < b; j++) {
                    
                    triangles[k++] = i*m + j;
                    triangles[k++] = i*m + j + 1;
                    triangles[k++] = (i + 1)*m + j;
                  
                    triangles[k++] = (i + 1)*m + j;
                    triangles[k++] = i*m + j + 1;
                    triangles[k++] = (i + 1)*m + j + 1;
                }
            }
            this._tessellated = true;
        },

        
        /**
         * Get vertex array. Tessellate if not done yet.
         */
        vertexArray: function () {
            if (!this._tessellated) {
                this.tessellate();
            }
            return this._vertices;
        },


        /**
         * Get triangle array. Tessellate if not done yet.
         */
        triangleArray: function () {
            if (!this._tessellated) {
                this.tessellate();
            }
            return this._triangles;
        }
    });
    
});

