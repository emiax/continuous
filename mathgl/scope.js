define(function (require) {
    
    var q = require('quack');
    var Kalkyl = require('kalkyl');
    var SimpleFormat = require('kalkyl/format/simple');
    var exports = require('./exports');

    var nextId = 1;

    return exports.Scope = q.createClass({
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
             *   1) Scope where expression was defined (Some other Scope)
             *   2) A Kalkyl Expression
             */
            this._expressions = {};

            /**
             * Map from symbol to either of the following
             *   1) Scope where the primitive was defined
             *   2) A number
             */
            this._primitives = {};

            this._id = nextId++;
            this._parent = null;
            this._space = null;

            this._flats = null;

            var visible = spec.visible;
            this.visible(visible !== undefined ? visible : true);

            /**
             * Map from scope id to child.
             */
            this._children = {};

            this.defineExpressions(spec.expressions || {});
            this.definePrimitives(spec.primitives || {});

            //this.defineMultiple(spec.expressions || {});
            var scope = this;
        },


        /**
         * Id is public readable.
         */
        id: function() {
            return this._id;
        },

        /*****************************************************
         * Public 'scene graph' methods
         *****************************************************/

        /**
         * Get/Set visibility
         */
        visible: function (visibility) {
            if (visibility !== undefined) {
                this._visible = visibility;
            }
            return this._visible;
        },


        /**
         * All parents visible
         */
        chainVisible: function () {
            var parent = this.parent();
            if (!this.visible()) {
                return false;
            }
            if (parent) {
                return this.parent().chainVisible();
            }
            return true;
        },


        /**
         * Return parent scope
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


        traverse: function (f) {
            f(this);
            this.forEachChild(function (c) {
                c.traverse(f);
            });
        },


        /**
         * Space
         */
        space: function () {
            return this._space;
        },


        /**
         * Notify Observers
         */
        notifyObservers: function (type, symbol) {
            var space = this.space();
            if (space) {
                space.notifyObservers(this, type, symbol);
                this.forEachChild(function (child) {
                    space.notifyObservers(child, type, symbol);
                });
            }
        },


        /**
         * Add child.
         */
        add: function (child) {
            if (child instanceof exports.Scope) {
                this._children[child._id] = child;
                child._parent = this;
                child.updateScope();
                console.log("adding !");
                console.log(child.id());
                child.notifyObservers('add');
            } else {
                throw "Type error. Child is not a scope";
            }
            return this;
        },


        /**
         * Remove child.
         */
        remove: function (child) {
            var child = this._children[child._id];
            if (child) {
                child.parent = null;
                child.updateScope();
                child.notifyObservers('remove');
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
            return this;
        },





        /*****************************************************
         * Public methods for handling expressions
         *****************************************************/

        definePrimitives: function (map) {
            if (!map || typeof map !== 'object') {
                console.error("invalid input");
                return;
            }
            var scope = this;
            Object.keys(map).forEach(function (key) {
                var expr = map[key];
                scope.definePrimitive(key, expr, false);
            });
            this.updateScope();
        },


        definePrimitive: function (symbol, value, updateScope) {
            if (!symbol || value === undefined) {
                console.error("definition requires symbol and value");
                return;
            }
            if (this.defines(symbol)) {
                console.error("symbol " + symbol + "already defined");
            }
            this._primitives[symbol] = null;

            if (updateScope !== false) {
                this.updateScope();
            }

            return this.primitive(symbol, value);
            // todo: notify observers
        },

        /**
         * Get/set primitive
         */
        primitive: function (symbol, value) {
            if (!symbol) {
                console.error("get/set primitive requires symbol");
                return;
            }
            if (value !== undefined) {
                if (!this.definesPrimitive(symbol)) {
                    console.error("primitive " + symbol + " is not defined by this scope");
                    return;
                }
                if (typeof value !== 'number') {
                    console.error("could not set primitive to " + value);
                    return;

                }
                this._primitives[symbol] = value;
            }

            if (this._primitives[symbol] instanceof exports.Scope) {
                return this._primitives[symbol]._primitives[symbol];
            } else {
                return this._primitives[symbol];
            }
        },


        /**
         * Set primitives
         */
        primitives: function (map) {
            if (!map || typeof map !== 'object') {
                console.error("invalid input");
                return;
            }
            var scope = this;
            Object.keys(map).forEach(function (key) {
                var expr = map[key];
                scope.primitive(key, expr);
            });
        },


        defineExpression: function (symbol, value, updateScope) {
            if (!symbol || value === undefined) {
                console.error("definition requires symbol and value");
                return;
            }
            if (this.defines(symbol)) {
                console.error("symbol " + symbol + "already defined");
            }
            this._expressions[symbol] = null;

            if (updateScope !== false) {
                this.updateScope();
            }

            return this.expression(symbol, value);
            // todo: notify observers
        },


        /**
         * Get / set expression. (Requires that the expression is already defined by this scope.)
         * value may be a Kalkyl.Expression, or a string (that will be parsed into a Kalkyl.Expression)
         */
        expression: function (symbol, value) {
            if (!symbol) {
                console.error("get/set expression requires symbol");
                return;
            }
            if (value !== undefined) {
                var expression;

                if (!this.definesExpression(symbol)) {
                    console.error("expression " + symbol + " is not defined by this scope");
                }

                if (typeof value === 'string' || typeof value === 'number') {
                    var sp = this.simpleParser();
                    expression = sp.parse(value);
                    if (!expression) {
                        console.error("could not parse expression");
                        return;
                    }
                } else if (value instanceof Kalkyl.Expression) {
                    expression = value;
                } else {
                    console.error("could not set expression to " + value);
                    console.log(value);
                    return;
                }

                var scope = this;
                var oldExpr = scope._expressions[symbol];
                if (!oldExpr || !expression.identicalTo(oldExpr)) {
                    scope._expressions[symbol] = expression;
                    //                this.notifyObservers('expression', symbol);
                    // todo: notify observers.
                }
            }

            if (this._expressions[symbol] instanceof exports.Scope) {
                return this._expressions[symbol]._expressions[symbol];
            } else {
                return this._expressions[symbol];
            }
        },


        /**
         * Set mutliple expressions.
         */
        expressions: function (map) {
            if (!map || typeof map !== 'object') {
                console.error("invalid input. map is " + map);
                return;
            }
            var scope = this;
            Object.keys(map).forEach(function (key) {
                var expr = map[key];
                scope.expression(key, expr);
            });
        },


        /**
         * Define expressions.
         */
        defineExpressions: function (map) {
            if (!map || typeof map !== 'object') {
                console.error("invalid input");
                return;
            }
            var scope = this;
            Object.keys(map).forEach(function (key) {
                var expr = map[key];
                scope.defineExpression(key, expr, false);
            });
            this.updateScope();
            // todo: notify observers.
        },


        /**
         * Undefine an expression or primitive.
         */
        undefine: function (symbol) {
            if (symbol) {
                if (this.defines(symbol)) {
                    delete this._expressions[symbol];
                    delete this._primitives[symbol];
                    this.updateScope();
                }
            }
            //  this.notifyObservers('expression', symbol);
            // todo: notify observers
            return this;
        },


        /**
         * get all expressions defined in this scope, and in outer scopes.
         * Returns a map from symbol to expression.
         */
        /*        getAll: function() {
                  var expressions = {};
                  var scope = this;
                  Object.keys(this._expressions).forEach(function (symbol) {
                  var expr = scope._expressions[symbol];
                  if (expr instanceof exports.Scope) {
                  expressions[symbol] = expr._expressions[symbol];
                  } else {
                  expressions[symbol] = expr;
                  }
                  });
                  return expressions;
                  },*/


        /**
         * Get expression and substitute symbols with definitions in parent scopes
         */
        flatExpression: function (symbol) {
            var expr = this._flats[symbol];
            if (expr) {
                return expr;
            } else {
                console.error("symbol " + symbol + " is not an expression at this " + symbol + "" );
            }
        },
        

        /**
         * Get a flat expression with all primitives substituted by instances of Kalkyl.Number.
         */
        flat: function (symbol) {
            var expr = this._flats[symbol];
            if (expr) {
                return this.substitutor().substitute(expr);
            } else {
                console.error(symbol + " is not defined");
                return null;
            }
        },
        
        
        /**
         * Get the value of any expression or primitive defined on this node or on a parent scope
         */
        value: function (symbol) {
            if (this._expressions[symbol]) {
                var evaluated = this.flat(symbol).evaluated(); 
                if (evaluated.isEvaluated()) {
                    return evaluated.toPrimitive();
                }
            } else if (this._primitives[symbol]) {
                return this.primitive(symbol);
            } else {
                console.error("symbol "  + symbol + " is not defined in scope.");
            }
        },


        /**
         * Get expression and substitute symbols with definitions in outer scopes
         */
        /*        flatExpression: function (symbol) {
                  var expr = this.get(symbol);
                  var expressions = this.getAll();
                  Object.keys(expressions).forEach(function (s) {
                  if (expressions[s] instanceof Kalkyl.Number) {
                  delete expressions[s];
                  }
                  });
                  if (expr) {
                  if (flat = expr.flattened(expressions)) {
                  return flat;
                  }
                  }
                  return null;
                  },*/


        /**
         * Return true if this scope defines a expression with symbol as key.
         */
        definesExpression: function (symbol) {
            return this.expressionScope(symbol) === this;
        },


        /**
         * Return true if this scope defines a primitive with symbol as key.
         */
        definesPrimitive: function (symbol) {
            return this.primitiveScope(symbol) === this;
        },


        /**
         * Return true if this scope defines a primitive or expression with symbol as key.
         */
        defines: function (symbol) {
            return this.definesExpression(symbol) || this.definesPrimitive(symbol);
        },


        /**
         * Return the scope where the expression with symbol as key was defined.
         * Return null if expression is undefined.
         */
        expressionScope: function (symbol) {
            var expressionOrScope = this._expressions[symbol];
            if (expressionOrScope instanceof exports.Scope) {
                return expressionOrScope;
            } else if (expressionOrScope !== undefined) {
                return this;
            }
            return null;
        },


        /**
         * Return the scope where the expression with symbol as key was defined.
         * Return null if expression is undefined.
         */
        primitiveScope: function (symbol) {
            var primitiveOrScope = this._primitives[symbol];
            if (primitiveOrScope instanceof exports.Scope) {
                return primitiveOrScope;
            } else if (primitiveOrScope !== undefined) {
                return this;
            }
            return null;
        },


        /**
         * Update flats.
         */
        updateFlats: function () {
            var expressions = this.allExpressions();
            var flattener = new Kalkyl.Flattener(expressions);
            
            this._flats = {};
            var scope = this;
            
            Object.keys(expressions).forEach(function (symbol) {
                var expression = expressions[symbol];
                var flattened = flattener.flatten(expression);
                scope._flats[symbol] = flattened;
            });
        },


        /**
         * Update Primitives.
         */
        updatePrimitives: function () {
            var parent = this.parent();
            var parentPrimitives = parent._primitives;
            var myPrimitives = this._primitives;

            // Reinherit old primitive references from parent.
            // Remove primitive references that are undefined in parent scope.
            Object.keys(myPrimitives).forEach(function (symbol) {
                if (myPrimitives[symbol] instanceof exports.Scope) {
                    if (parentPrimitives[symbol] instanceof exports.Scope) {
                        myPrimitives[symbol] = parentPrimitives[symbol];
                    } else if (typeof parentPrimitives[symbol] === 'number') {
                        myPrimitives[symbol] = parent;
                    } else {
                        delete myPrimitives[symbol];
                    }
                }
            });

            // Inherit new primitive references from parent
            Object.keys(parentPrimitives).forEach(function (symbol) {
                if (myPrimitives[symbol] === undefined) {
                    if (parentPrimitives[symbol] instanceof exports.Scope) {
                        myPrimitives[symbol] = parentPrimitives[symbol];
                    } else {
                        myPrimitives[symbol] = parent;
                    }
                }
            });
        },


        /**
         * Update Expressions.
         */

        updateExpressions: function () {
            var parent = this.parent();
            var parentExpressions = parent._expressions;
            var myExpressions = this._expressions;

            // Reinherit old expression references from parent.
            // Remove expression references that are undefined in parent scope.
            Object.keys(myExpressions).forEach(function (symbol) {
                if (myExpressions[symbol] instanceof exports.Scope) {
                    if (parentExpressions[symbol] instanceof exports.Scope) {
                        myExpressions[symbol] = parentExpressions[symbol];
                    } else if (parentExpressions[symbol] instanceof Kalkyl.Expression) {
                        myExpressions[symbol] = parent;
                    } else {
                        delete myExpressions[symbol];
                    }
                }
            });


            // Ineherit new expression references from parent
            Object.keys(parentExpressions).forEach(function (symbol) {
                if (myExpressions[symbol] === undefined) {
                    if (parentExpressions[symbol] instanceof exports.Scope) {
                        myExpressions[symbol] = parentExpressions[symbol];
                    } else {
                        myExpressions[symbol] = parent;
                    }
                }
            });
        },



        /**
         * Update scope, using parent as reference.
         */
        updateScope: function () {
            var parent = this.parent();
            if (!parent) {
                return;
            }

            this._space = parent.space();

            this.updatePrimitives();
            this.updateExpressions();
            this.updateFlats();

            this.forEachChild(function(c) {
                c.updateScope();
            });
        },


        /**
         * All Expressions
         */
        allExpressions: function () {
            var expressions = {};
            var scope = this;
            Object.keys(this._expressions).forEach(function (symbol) {
                var expr = scope._expressions[symbol];
                if (expr instanceof exports.Scope) {
                    expressions[symbol] = expr._expressions[symbol];
                } else {
                    expressions[symbol] = expr;
                }
            });

            return expressions;
        },


        /**
         * All Primitives
         */
        allPrimitives: function () {
            var primitives = {};
            var scope = this;
            Object.keys(this._primitives).forEach(function (symbol) {
                var prim = scope._primitives[symbol];
                if (prim instanceof exports.Scope) {
                    primitives[symbol] = prim._primitives[symbol];
                } else {
                    primitives[symbol] = prim;
                }
            });
            return primitives;
        },


        /**
         * Get my substitutor
         */
        substitutor: function () {
            if (!this._substitutor) {
                this._substitutor = new Kalkyl.Substitutor();
            }
            this._substitutor.map(this.allPrimitives());
            return this._substitutor;
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
