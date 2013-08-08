define(['quack', 'kalkyl', 'mathgl', 'mathgl/engine/exports.js'], function(q, Kalkyl, MathGL, Engine) {


    return Engine.VertexShaderGenerator = q.createClass({
        /**
         * Constructor
         */
        constructor: function (expressions, parameters) {
            this._expressions = expressions;
            this._parameters = parameters;

//            this._
        },


        expressions: function() {
            return this._expressions;
        },

        
        parameters: function () {
            return this._parameters;
        },
                
        
        /**
         * Require expression with the specified symbol.
         */
        require: function (symbol) {
            
        },
        
        
        
        /**
         * Generate vertex shader
         */
        generate: function (gl) {
            
        }
        
        


    });

});
