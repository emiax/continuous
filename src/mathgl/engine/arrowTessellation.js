define(function (require) {

    var q = require('quack');
    var exports = require('./exports');

    return exports.ArrowTessellation = q.createClass({
        /**
         * Constructor
         */
        constructor: function () {
            var thetaMin = this._thetaMin = 0;
            var thetaMax = this._thetaMax = 2*Math.PI;
            var thetaStep = this._thetaStep = 2*Math.PI / 4;

            this._tessellated = false;
        },

        /**
         * Return vertex array. Tessellate if not done yet.
         */
        vertexArray: function () {
            if (!this._tessellated) {
                this.tessellate();
            }
            return this._vertexData;
        }, 


        /**
         * Return triangle array. Tessellate if not done yet.
         */
        triangleArray: function () {
            if (!this._tessellated) {
                this.tessellate();
            }
            return this._triangleData;
        }, 


        /**
         * Prepare an array of vec3's:
         * x) Theta
         * y) Radius
         * z) Displacement -- |  >
         *                 0, 1, 2
         */
        tessellate: function () {
            var thetaMin = this._thetaMin;
            var thetaMax = this._thetaMax;
            var thetaStep = this._thetaStep;

            var verticesPerRing = Math.ceil((thetaMax - thetaMin) / thetaStep);
            var nBottomTriangles = verticesPerRing - 2;
            var nCylinderTriangles = verticesPerRing * 2;
            var nTriangles = 2*nBottomTriangles + nCylinderTriangles + verticesPerRing; // 2 bottoms, 1 cylinder, 1 cone.

            var n = verticesPerRing * 3 + 1; // three rings plus one point.
            var vertexData = this._vertexData = new Float32Array(n*3);
            var triangleData = this._triangleData = new Uint16Array(3*nTriangles);
            var cylinderRadius = 1;
            var coneRadius = 2;

            var bottomDisplacement = 0;
            var coneBottomDisplacement = 1;
            var coneTopDisplacement = 2;

            var theta = 0;
            var i = 0; // vertex index
            var j = 0; // triangleData index
            for (theta = thetaMin; theta < thetaMax; theta += thetaStep) {

                // vertices for cylinder's bottom
                vertexData[i*3] = theta;
                vertexData[i*3 + 1] = cylinderRadius;
                vertexData[i*3 + 2] = bottomDisplacement;
                
                if (i >= 2) {
                    // triangles for cylinder's bottom
                    triangleData[j++] = 0;
                    triangleData[j++] = i - 1;
                    triangleData[j++] = i;

                    // triangles for cone's bottom
                    triangleData[j++] = verticesPerRing*2;
                    triangleData[j++] = verticesPerRing*2 + i - 1;
                    triangleData[j++] = verticesPerRing*2 + i;
                }
                
                // vertex indices on cylinder
                var i0 = i % verticesPerRing;
                var i1 = (i + 1) % verticesPerRing;
                var i2 = i % verticesPerRing + verticesPerRing;
                var i3 = (i + 1) % verticesPerRing + verticesPerRing;

                // triangles on cylinder
                triangleData[j++] = i0;
                triangleData[j++] = i1;
                triangleData[j++] = i2;

                triangleData[j++] = i1;
                triangleData[j++] = i3;
                triangleData[j++] = i2;

//                j += 6;
                // cylinder's top
                vertexData[3*(verticesPerRing + i)] = theta;
                vertexData[3*(verticesPerRing + i) + 1] = cylinderRadius;
                vertexData[3*(verticesPerRing + i) + 2] = coneBottomDisplacement;
                
                // triangles on cone
                triangleData[j++] = 2*verticesPerRing + i % verticesPerRing;
                triangleData[j++] = 2*verticesPerRing + (i+1) % verticesPerRing;
                triangleData[j++] = 3*verticesPerRing;

                // cone's bottom
                vertexData[3*(verticesPerRing*2 + i)] = theta;
                vertexData[3*(verticesPerRing*2 + i) + 1] = coneRadius;
                vertexData[3*(verticesPerRing*2 + i) + 2] = coneBottomDisplacement;
                
                // Advance one vertex 
                i++;
            }
            
            // cone's top
            vertexData[3*verticesPerRing*3] = 0;
            vertexData[3*verticesPerRing*3 + 1] = 0;
            vertexData[3*verticesPerRing*3 + 2] = coneTopDisplacement;
        }

        
    });
    
});
