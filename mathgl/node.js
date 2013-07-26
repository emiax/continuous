define(['quack', 'kalkyl', 'kalkyl/format/simple', 'mathgl/exports.js'], function(q, Kalkyl, SimpleFormat, MathGL) {

    var nextId = 1;

    return MathGL.Node = q.createClass({
        /**
         * Constructor.
         *
         * spec {
         *   expressions: map from symbols to number, string or kalkyl expression.
         * }
         */
        constructor: function (spec) {
            spec = spec || {};

            /**
             * Map from symbol to either of the following
             *   1) Scope where expression was defined (Some other MathGL.Node)
             *   2) Kalkyl Expression
             */
            this._expressions = {};

            this._id = nextId++;
            
            this._parent = null;

            /**
             * Map from node id to child.
             */
            this._children = {};
            
            this.defineMultiple(spec.expressions || {});
            var scope = this;
        },


        
        /*****************************************************
         * Public 'scene graph' methods
         *****************************************************/
        
        /**
         * Return parent node
         */
        parent: function () {
            return this._parent;
        },


        /**
         * Return array of children
         */        
        children: function () {
            var children = [];
            var scope = this;
            Object.keys(this._children).forEach(function (k) {
                children.push(scope._children[k]);
            });
            return children;
        },

        
        /**
         * Add child.
         */
        add: function (child) {
            if (child instanceof MathGL.Node) {
                this._children[child._id] = child;
                child._parent = this;
                child.updateScope();
            } else {
                throw "Type error. Child is not a node";
            }
        },


        /**
         * Remove child.
         */
        remove: function (child) {
            var child = this._children[child._id];
            if (child) {
                child.parent = null;
                child.updateScope();
                delete this.children[child._id];
                return true;
            }
            return false;
        },


        /**
         * Invoke function f for every child.
         */
        forEachChild: function (f) {
            var scope = this;
            Object.keys(this._children).forEach(function (k) {
                f(scope._children[k], k);
            });
        },

        
        
        /*****************************************************
         * Public methods for handling expressions
         *****************************************************/

        /**
         * Define a expression in the scope of this node
         * Redefinition is possible, but use set(symbol, value) to show your intention!
         */
        define: function (symbol, value) {
            if (value === undefined) {
                value = null;
            }
            this._expressions[symbol] = null;
            this.setOne(symbol, value);
            this.forEachChild(function(c) {
                c.updateScope();
            });
        },

        
        /**
         * Undefine the expression! 
         */
        undefine: function (symbol) {
            if (symbol) {
                if (this.defines(symbol)) {
                    delete this._expressions[symbol];
                    this.updateScope();
                    return true;
                }
            }
            return false;
        },

        
        /**
         * get all expressions defined in this scope, and in outer scopes.
         * Returns a map from symbol to expression.
         */
        getAll: function() {
            var expressions = {};
            var scope = this;
            Object.keys(this._expressions).forEach(function (symbol) {
                var expr = scope._expressions[symbol];
                if (expr instanceof MathGL.Node) {
                    expressions[symbol] = expr._expressions[symbol];
                } else {
                    expressions[symbol] = expr;
                }
            });
            return expressions;
        },

        /**
         * Get exppression
         */
        get: function (symbol) {
            var scope = this.expressionScope(symbol);
            if (scope) {
                return scope._expressions[symbol];
            }
        },


        /**
         * Get expression and substitute symbols with definitions in outer scopes
         */
        /**
        flat: function (symbol) {
            var expr = this.get(symbol);
            var expressions = this.getAll();
            var flat;
            if (expr) {
                if (flat = expr.flattened(expressions)) {
                    return flat;
                }
            }
        },
        

        */
        /**
         * Set one expression or multiple expressions.
         * Input can be two arguments (symbol, value) or a map from symbols to values.
         */ 
        set: function () {
            if (arguments.length === 2 && typeof arguments[0] === 'string') {
                return this.setOne(arguments[0], arguments[1]);
            } else if (arguments.length === 1) {
                return this.setMultiple(arguments[0]);
            } else {                
                console.error("Invalid input");
            }
        },

        
        /**
         * Return true if this node defines a expression with symbol as key.
         */
        defines: function (symbol) {
            return this.expressionScope(symbol) === this;
        },

        
        /**
         * Return the node where the expression with symbol as key was defined.
         * Return null if expression is undefined.
         */
        expressionScope: function (symbol) {
            var expression = this._expressions[symbol];
            if (expression instanceof MathGL.Node) {
                return expression;
            } else if (expression !== undefined) {
                return this;
            }
            return null;
        },


        /*****************************************************
         * Private methods that handle expressions
         *****************************************************/    

        
        /**
         * Set multiple expressions (private)
         */
        setMultiple: function (map) {
            var scope = this;
            Object.keys(map).forEach(function (symbol) {
                var value = map[symbol];
                scope.setOne(symbol, value);
            });
        },


        /**
         * Define multiple expressions (private)
         */
        defineMultiple: function (map) {
            var scope = this;
            Object.keys(map).forEach(function (symbol) {
                var value = map[symbol];
                scope.define(symbol, value);
            });
        },

        
        /**
         * Set one expression. (private)
         */
        setOne: function (symbol, value) {
            var scope = this.expressionScope(symbol);
            if (!scope) {
                throw(symbol + " is not defined on this.");
                return null;
            }

            var expr = null;
            if (typeof value === 'string' || typeof value === 'number') {
                var sp = this.simpleParser();
                expr = sp.parse(value);
            } else if (value instanceof Kalkyl.Expression) {
                expr = value;
            } else {
                console.error("could not set expression to " + value);
                return;
            }

            return scope._expressions[symbol] = expr;
        },

        
        /**
         * Update scope, using parent as reference.
         */
        updateScope: function () {
            var parent = this.parent();

            if (!parent) {
                return;
            }

            var parentExpressions = this.parent()._expressions;
            var childExpressions = this._expressions;
            
            // Reinherit old references from parent.
            // Remove references that are undefined in parent scope.
            Object.keys(childExpressions).forEach(function (symbol) {
                if (childExpressions[symbol] instanceof MathGL.Node) {
                    if (parentExpressions[symbol] instanceof MathGL.Node) {
                        childExpressions[symbol] = parentExpressions[symbol];
                    } else {
                        childExpressions[symbol] = parent;
                    }
                }
            });

            // Inherit new references from parent
            Object.keys(parentExpressions).forEach(function (symbol) {
                if (childExpressions[symbol] === undefined) {
                    if (parentExpressions[symbol] instanceof MathGL.Node) {
                        childExpressions[symbol] = parentExpressions[symbol];
                    } else {
                        childExpressions[symbol] = parent;
                    }
                }
            });

            this.forEachChild(function(c) {
                c.updateScope();
            });
        },

        
        /**
         * Get my simple parser!
         */
        simpleParser: function () {
            if (!this._simpleParser) {
                this._simpleParser = new SimpleFormat.Parser();
            }
            return this._simpleParser;
        }

        
    });
});
