define(['quack', './exports.js', './visitor.js', './expression.js'], function(q, Kalkyl, Expression) {

    /**
     * Functionallity to create a DAG representing
     * the dependencies of a set of Kalkyl expressions.
     * A source is an expression with no dependencies.
     * A sink is an expression that no other expression depends on.
     */

    Kalkyl.DependencyGraph = q.createClass({
        /**
         * Constructor.
         */
        constructor: function(expressions) {
            this._graph = null;
            this._marks = {};
            this._order = [];
            this._circular = null;
            this._undefinedExpressions = null;
            this.expressions(expressions);
        },


        /**
         * Get/Set the expression map (symbol -> expression) to work with
         * This clears the whole graph.
         */
        expressions: function (expressions) {
            if (expressions !== undefined) {
                this._expressions = expressions;
                this._undefinedExpressions = null;
                this._graph = null;
                this._marks = {};
                this._order = [];
            }
            return this._expressions;
        },

        
        /**
         * Return an array of the symbols that do not have any dependencies.
         */
        sources: function () {
            var graph = this.graph();
            var sources = [];
            Object.keys(graph).forEach(function (from) {
                if (Object.keys(graph[from]).length === 0) {
                    sources.push(from);
                }
            });
            return sources;
        },


        /**
         * Topological sort algorithm using depth-first search
         * http://en.wikipedia.org/wiki/Topological_sorting#Algorithms
         *
         * Return an ordered array of symbols, where every symbol
         * only depends on the previous ones or undefined ones.
         *
         * Return null if circular. Set circular flag.
         */
        order: function() {
            this._order = [];
            this._undefinedExpressions = {};
            var node;
            while (node = this.findUnmarkedNode()) {
                if (!this.visit(node)) {
                    this._circular = true;
                    return null;
                }
            }
            var order = this._order;
            this.resetState();
            this._circular = false;

            return order;
        },


        /**
         * Return an ordered array of symbols, where every symbol
         * only depends on the previous ones or undefined ones. 
         * 
         * Only include the symbols in the 'sinks' array and their dependencies.
         * Assume that symbols defined in the 'sources' array are already defined.
         */
        orderedSubset: function (sinks, sources) {
            if (this.isCircular()) {
                return null;
            }

            // support one sink or an array of sinks.
            if (typeof sinks === 'string') {
                sinks = [sinks];
            }

            sources = sources || [];
            // support one source or an array of sources.
            if (typeof sources === 'string') {
                sources = [sources];
            }
            
            // Block sources. Tell the algorithm that they already have been visited.
            var scope = this;
            sources.forEach(function(s) {
                scope.markPermanently(s);
            });

            // Go through the sinks and add dependencies to a sorted list.
            var node;
            while (node = this.findUnmarkedNode(sinks)) {
                this.visit(node);
            }

            var order = this._order;
            this.resetState();
            
            return order;
        },
        


        /**
         * Return true if the dependency graph is circular.
         */
        isCircular: function() {
            if (this._circular === null) {
                this.order();
            }
            return this._circular;
        },


        /**
         * Return a set of undefined expressions
         */
        undefinedExpressions: function () {
            if (this._undefinedExpressions === null) {
                this.order();
            }
            return this._undefinedExpressions;
        },


        /**
         * Return true if the dependency graoh is complete, meaning that there are no undefined expressions.
         */
        isComplete: function() {
            return Object.keys(this.undefinedExpressions()).length === 0;
        },


        /**
         * Return an ordered list of all the symbol dependencies for the expression with the specified symbol
         * 'Given' is an optional array of symbols (or one symbol) specifying dependencies
         *  that already are resolved - an array of symbols to 'block' in the search (implemented through markPermanently)
         */
/**        dependencies: function (symbol, given) {
            var scope = this;
            var dependencies = [];
            if (this.isCircular()) {
                return null;
            }
            var graph = this.graph();
            var node = graph[symbol];

            if (typeof given === 'object') {
                given.forEach(function (s) {
                    scope.markPermanently(s);
                });
            } else if (typeof given === 'string') {
                scope.markPermanently(given);
            }

            if (node) {
                this.outgoingArray(symbol).forEach(function (n) {
                    scope.visit(n);
                });
                var order = this._order;
                this._order = [];
                this._marks = {};
                return order;
            } else {
                return [];
            }
        },*/

        
        /**
         * Return true if symbols/symbol depends on any of the symbols in the 'dependencies' array.
         */
        dependsOnAny: function (symbols, dependencies) {
            var dep = this.orderedSubset(symbols);
            if (!dep) {
                console.error("Circular dependency!");
            }
            var map = {};
            dep.forEach(function (d) {
                map[d] = true;
            });
            
            var found = false;
            dependencies.forEach(function (d) {
                if (map[d]) found = true;
            });
            return found;
        },

        /**************************************************
         * Private methods
         **************************************************/



        /**
         * Return graph
         */
        graph: function() {
            if (!this._graph) {
                this.createGraph();
            }
            return this._graph;
        },



        /**
         * Reset state.
         */ 
        resetState: function () {
            this._order = [];
            this._marks = {};
        },
        


        /**
         * Create the graph.
         */
        createGraph: function() {
            var expressions = this.expressions();
            var graph = this._graph = {};
                        
            var lister = this.lister();
            Object.keys(expressions).forEach(function(from) {
                var e = expressions[from];
                var variables = lister.listVariables(e);
                if (graph[from] === undefined) {
                    graph[from] = {};
                }
                variables.forEach(function (to) {
                    graph[from][to] = true;
                });
            });
            return graph;
        },


        /**
         * Get my variable lister.
         */
        lister: function () {
            if (!this._lister) {
                this._lister = new Kalkyl.VariableLister();
            }
            return this._lister;
        },



        /**************************************************
         * Utilities for topological sort
         **************************************************/


        /**
         * Visit a node
         */
        visit: function(node) {
            var scope = this;
            if (this.markedTemprorarily(node)) {
                return false; // not a DAG. Topological sort is impossible.
            }
            if (!this.marked(node)) {
                this.markTemporarily(node);
                var circular = false;
                var nodes = this.outgoingArray(node);
                if (nodes) {
                    nodes.forEach(function (n) {
                        if (!scope._graph[n]) {
                            scope._undefinedExpressions[n] = true;
                        }
                        if (!scope.visit(n)) {
                            circular = true;
                        }
                    });
                    if (circular) {
                        return false;
                    }
                    this.markPermanently(node);
                    this.addToSorted(node);
                }
            }
            return true;
        },


        /**
         * Find an unmarked node. 'nodes' is an optional array to be used as filter.
         */
        findUnmarkedNode: function(nodes) {
            var graph = this.graph();
            
            nodes = nodes || Object.keys(graph);
            var nNodes = nodes.length;

            for (var i = 0; i < nNodes; i++) {
                if (!this.marked(nodes[i])) {
                    return nodes[i];
                }
            }
            return null;
        },


        /**
         * Add node to list of sorted nodes
         */
        addToSorted: function(node) {
            this._order.push(node);
        },

        /**
         * Get array of nodes that can be visited from node
         */
        outgoingArray: function (node) {
            return Object.keys(this.outgoingSet(node));
        },

        
        outgoingSet: function (node) {
            return this._graph[node] || {};
        },


        /**
         * Return true if node is marked.
         */
        marked: function (node) {
            return !!this._marks[node];
        },


        /**
         * Return true if node is marked temporarily.
         */
        markedTemprorarily: function (node) {
            return this._marks[node] === 'temporary'
        },


        /**
         * Return true if node is marked permanently.
         */
        markedPermanently: function (node) {
            return this._marks[node] === 'permanent'
        },


        /**
         * Mark node temporarily.
         */
        markTemporarily: function(node) {
            this._marks[node] = 'temporary'
        },


        /**
         * Mark node permanently.
         */
        markPermanently: function (node) {
            this._marks[node] = 'permanent'
        }
    });
});
