define(function (require) {

    var q = require('quack');
    var Scope = require('./scope');
    var exports = require('./exports');
    
    return exports.Space = q.createClass(Scope, {
        /**
         * Constructor
         */
        constructor: function (spec) {
            Scope.constructor.apply(this, spec);
            this._space = this;
            this._observers = [];
        },

        
        /**
         * Add observer o
         */
        addObserver: function (o) {
            this._observers.push(o);
        },


        /**
         * Remove observer o
         */
        removeObserver: function (o) {
            var index = this._observers.indexOf(o);
            if (index !== -1) {
                this._observers.splice(index, 1);
            }
        },


        /**
         * Add child node to space
         */
        add: function (child) {
            if (child instanceof Scope) {
                child._space = this;
                Scope.add.call(this, child);
            }
        },

                
        /**
         * Remove child node from space
         */
        remove: function (child) {
            child._space = null;
            Scope.remove.apply(this, child);
        },

        
        /**
         * Notify observers.
         */
        notifyObservers: function (node, type, symbol) {
	    this._observers.forEach(function (o) {
                console.log("obs");
                o.update(node, type, symbol);
            });
        }

    });
});
