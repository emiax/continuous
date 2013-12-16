define(['quack', './exports.js', './visitor.js', './expression.js'], function(q, Kalkyl, Expression) {

    Kalkyl.TopologicalSorter = q.createClass({
        /**
         * Constructor.
         */
        constructor: function() {
            this._graph = null;
            this._marks = null;
            this._order = [];
        },

        
        /**
         * Topological sort algorithm using depth-first search 
         * http://en.wikipedia.org/wiki/Topological_sorting#Algorithms
         */
        order: function(expressions) {
            if (expressions) {
                this.createGraph(expressions);
            }
            
            var node;
            while (node = this.findUnmarkedNode()) {
                if (!this.visit(node)) {
                    return null;
                }
            }
            return this._order;
        },


        /**************************************************
         * Private methods
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
                var nodes = this.outgoing(node);
                if (nodes) {
                    nodes.forEach(function (n) {
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
         * Return graph
         */
        graph: function() {
            return this._graph;
        },
        

        /**
         * Find an unmarked node
         */
        findUnmarkedNode: function() {
            var unmarkedNode = null;

            var nodes = Object.keys(this.graph());
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
        outgoing: function (node) {
            return this._graph[node];
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
        },


        /**
         * Create a graph.
         */
        createGraph: function(expressions) {
            var graph = this._graph = {};
            this._marks = {};
            this._order = [];
            var lister = this.lister();
            Object.keys(expressions).forEach(function(from) {
                var e = expressions[from];
                var variables = lister.listVariables(e);
                if (graph[from] === undefined) {
                    graph[from] = [];
                }
                variables.forEach(function (to) {
                    graph[from].push(to);
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
        }


    });
});
