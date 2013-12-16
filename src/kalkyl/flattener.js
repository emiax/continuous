define(function (require) {
    var q = require('quack');
    var Expression = require('./expression');
    var exports = require('./exports');

    exports.Flattener = q.createClass({

        constructor: function (map) {
            var scope = this;
            this._substitutor = new exports.Substitutor(map);
            this._graph = new exports.DependencyGraph(map);
            this._lister = new exports.VariableLister();
            this._map = map || {};
        },

        
        /**
         * Flatten expression. Example:
         * map = {
         *    x: 3
         *    y: x + 4;
         * }
         * expr = x + y
         * 
         * flatten(expr)
         *  => 3 + 3 + 4
         */
        flatten: function (expression) {
            if (!(expression instanceof Expression)) {
                console.error("cannot flatten expression, which is " + expression);
                return;
            }
            
            var current = expression;
            var order = this.graph().order();
            var substitutor = this.substitutor(this._map);
            var lister = this.lister();
            var scope = this;
            
            if (order) {
                // flattening is only possible if the dependency graph is a DAG,
                // It is a DAG if it is possible to sort it topologically.
                var done = false;
                while (!done) {
                    current = substitutor.substitute(current);
                    
                    // continue as long as there are variables left in the expression that can be substituted.
                    var variablesLeft = lister.listVariables(current);
                    var done = true;
                    variablesLeft.forEach(function (v) {
                        if (scope._map[v]) {
                            done = false;
                        }
                    });
                }
                return current;
            }
            return null;
        },


        lister: function () {
            return this._lister;
        },
        
        
        graph: function () {
            return this._graph;
        },



        substitutor: function () {
            return this._substitutor;
        },


        map: function (map) {
            if (map !== undefined) {
                this._map = map;
                this.substitutor().map(map);
                this.graph().expressions(map);
            }
            return this._map;
        }
    });

    q.patch(Expression, {

        flattened: function (map) {

            var flattener = new exports.Flattener(map);
            return flattener.flatten(this);
        }

    });

    return exports.Flattener;
});
