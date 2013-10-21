define(['quack', 'kalkyl', 'mathgl', 'kalkyl/format/javascript', 'mathgl/engine/exports.js', 'mathgl/engine/renderable.js'], function(q, Kalkyl, MathGL, JavascriptFormat, Engine, Renderable) {
    return Engine.TriangleSorter = q.createClass({
        /**
         * Constructor
         * uValues: a Float32Array containing u values of centroids
         * vValues: a Float32Array containing v values of centroids
         */
        constructor: function (uValues, vValues) {
            var length = uValues.length;

            this._xValues = new Float32Array(length);
            this._yValues = new Float32Array(length);
            this._zValues = new Float32Array(length);

            this._uValues = uValues;
            this._vValues = vValues;
        },

        
        /**
         * Set internal arrays holding coordinates 
         * of the centroids of triangles. (this._xValues, this._yValues, this._zValues)
         * expressions: map from symbols (strings) to values (primitives)
         * parameters: an array with two symbol names (strings, u and v parameter)
         */
        updateCoordinates: function (parameters, expressions) {
            var uSymbol = parameters[0];
            var vSymbol = parameters[1];
            
            var uValues = this._uValues;
            var vValues = this._vValues;

            var xValues = this._xValues;
            var yValues = this._yValues;
            var zValues = this._zValues;
            
            
            var flattener = new Kalkyl.Flattener(expressions);
            var xExpr = flattener.flatten(expressions.x);
            var yExpr = flattener.flatten(expressions.y);
            var zExpr = flattener.flatten(expressions.z);
            
            var jsFormatter = new JavascriptFormat.Formatter();
            var xFn = new Function(jsFormatter.format(xExpr));
            var yFn = new Function(jsFormatter.format(yExpr));
            var zFn = new Function(jsFormatter.format(zExpr));
            
            var nTriangles = uValues.length;
            for (var i = 0; i < nTriangles; i++) {
                var u = uValues[i];
                var v = vValues[i];

                var uvMap = {};
                uvMap[uSymbol] = u;
                uvMap[vSymbol] = v;
                
                xValues[i] = xFn(uvMap);
                yValues[i] = yFn(uvMap);
                zValues[i] = zFn(uvMap);
            }

            this._xValues = xValues;
            this._yValues = yValues;
            this._zValues = zValues;
        },

        
        
        /**
         * Get order of triangles.
         *
         * direction: a gl-matrix vector
         * uValues: a Float32Array
         * vValues: a Float32Array
         * expressions: map from symbols to kalkyl expressions (primitives)
         * order: vector of ordered coordinates. By reference.
         */
        sortTriangles: function (direction, expressions, parameters, order) {
            this.updateCoordinates(parameters, expressions);

            var xValues = this._xValues;
            var yValues = this._yValues;
            var zValues = this._zValues;

            console.log(order.length);
            var touches = 0;

            console.log(order);
            
            var n = order.length;
   
            var a = new Array(n);

            for (var i = 0; i < n; i++) {
                a[i] = order[i];
            }

//            console.log(a);
            
            a.sort(function (a, b) {
                touches++;
                var ax = xValues[a];
                var ay = yValues[a];
                var az = zValues[a];
                
                var bx = xValues[b];
                var by = yValues[b];
                var bz = zValues[b];

                var xDiff = bx - ax;
                var yDiff = by - ay;
                var zDiff = bz - az;

                return xDiff > 0 ? 1 : (xDiff < 0 ? -1 : 0);
            });

            for (var i = 0; i < n; i++) {
                order[i] = a[i];
            }
            
            console.log(order);
            
            console.log(touches);
            
        }
        
    });

});
