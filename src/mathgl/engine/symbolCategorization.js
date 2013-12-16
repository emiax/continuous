define(function (require) {

    var q = require('quack');
    var Kalkyl = require('kalkyl');
    var exports = require('./exports');
    
    /**
     * Symbol Categorization.
     * Kalkyl symbols need to be passed to shaders (or calculated in shaders) in different ways, namely:
     *
     * uniform (if independent from parameters)
     * attribute (if used in vertex shader and is a parameter)
     * varying (if used in fragment shader and is a parameter)
     * vertexDefinition (if used in vertex shader and dependent on symbols categorized as attributes)
     * fragmentDefinition (if used in fragment shader and dependent on symbols categorized as varyings)
     *
     * A symbol categorization should be considered immutable.
     */
    return exports.SymbolCategorization = q.createClass({
        /**
         * Constructor.
         * vertexSinks: set of symbols required by the vertex shader to displace points.
         * fragmentSinks: set of symbols required be the fragment shader.
         * parameterSources: set of symbols that are parameters
         * expression map: a map from symbol name to Kalkyl expression
         *
         * 
         */
        constructor: function (vertexSinks, fragmentSinks, parameterSources, primitiveSources, expressionMap) {
            var dependencyGraph = new Kalkyl.DependencyGraph(expressionMap);

            

            var symbols = {};
            Object.keys(expressionMap).forEach(function (s) {
                symbols[s] = true;
            });
            

            var independents = this.independents(dependencyGraph, symbols, Object.keys(parameterSources));

            var vertexSymbols = dependencyGraph.orderedSubset(Object.keys(vertexSinks));
            var fragmentSymbols = dependencyGraph.orderedSubset(Object.keys(fragmentSinks));
            
            var uniforms = {};
            var attributes = this._attributes = [];
            var varyings = this._varyings = [];
            var vertexDefinitions = this._vertexDefinitions = [];
            var fragmentDefintions = this._fragmentDefinitions = [];
            
            // All symbols required to determine the values of the vertex sinks.
            vertexSymbols.forEach(function (s) {
                if (parameterSources[s]) {
                    attributes.push(s); // Parameters are sent in as attributes
                } else if (independents[s] || primitiveSources[s]) {
                    uniforms[s] = true; // Expressions that are not dependent on the parameters are sent in as uniforms
                } else {
                    vertexDefinitions.push(s); // Expressions that depdend on attributes are calculated on the vertex shader
                }
            });

            // All symbols required to determine the values of the fragment sinks.
            fragmentSymbols.forEach(function (s) {
                if (parameterSources[s]) {
                    varyings.push(s); // Parameters are sent in as attributes
                } else if (independents[s] || primitiveSources[s]) {
                    uniforms[s] = true; // Expressions that are not dependent on the parameters are sent in as uniforms
                } else {
                    fragmentDefintions.push(s); // Expressions that depend on varyings are calculated on the fragment shader
               }
            });

            this._uniforms = Object.keys(uniforms);
        },


        /**
         * Return my Kalkyl dependency graph
         */
        dependencyGraph: function() {
            return this._dependencyGraph;
        },

        
        /**
         * Return an array of symbols.
         */
        symbols: function () {
            return this._symbols;
        },


        /**
         * Return the subset of all symbols in expressionMap that are independent from parameters
         */
        independents: function (graph, symbols, parameters) {
            //console.log(graph);
            //console.log(symbols);
            //console.log(parameters);

            var independents = {};
            Object.keys(symbols).forEach(function (symbol) {
                if (!graph.dependsOnAny(symbol, parameters)) {
                    independents[symbol] = true;
                }
            });
            return independents;
        }, 


        /***********************************************
         * Return arrays of symbol kinds
         ***********************************************
        
        /**
         * Return an array of uniforms
         */
        uniforms: function () {
            return this._uniforms;
        },


        /**
         * Return an array of attributes
         */
        attributes: function () {
            return this._attributes;
        },


        /**
         * Return an array of varyings
         */
        varyings: function () {
            return this._varyings;
        },

        /**
         * Return an array of vertex definitions
         */
        vertexDefinitions: function () {
            return this._vertexDefinitions;
        },


        /**
         * Return an array of vertex definitions
         */
        fragmentDefinitions: function () {
            return this._fragmentDefinitions;
        },
        

        /***********************************************
         * Check if symbols are defined as various kinds
         ***********************************************

        /**
         * Return true if symbol is defined as a uniform.
         */
        uniform: function (symbol) {
            return this._uniforms.indexOf(symbol) !== -1;
        },


        /**
         * Return true if symbol is defined as an attribute.
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
         * Return true if symbol is defined in vertex shader.
         */
        vertexDefinition: function (symbol) {
            return this._vertexDefinitions.indexOf(symbol) !== -1;
        },


        /**
         * Return true if symbol is defined in fragment shader.
         */
        fragmentDefinition: function (symbol) {
            return this._fragmentDefinitions.indexOf(symbol) !== -1;
        },


        dump: function () {
            console.trace();
            console.log("uniforms");
            console.log(this.uniforms());

            console.log("attributes");
            console.log(this.attributes());

            console.log("varyings");
            console.log(this.varyings());

            console.log("vertex definitions");
            console.log(this.vertexDefinitions());

            console.log("fragment definitions");
            console.log(this.fragmentDefinitions());
        }
    });
});
