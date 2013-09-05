define(['quack', 'mathgl/exports.js'], function(q, MathGL) {

    var nextId = 1;
    
    return MathGL.AppearanceNode = q.createAbstractClass({
        /**
         * Constructor.
         */
        constructor: function () {
            this._id = nextId++;
            this._inputs = {};
            this._outputs = {};
            this._entities = {};
        },

        
        /**
         * Get id
         */
        id: function () {
            return this._id;
        },
        
        
        /**
         * Return a set of the symbols that need defined expressions
         * in order to render this apperance node.
         */
        symbols: new q.AbstractMethod(),


        /**
         * Get/set input with the specified name.
         */
        input: function (name, input) {
            if (input !== undefined) {
                oldInput = this._inputs[name];
                if (oldInput) {
                    oldInput.unregisterOutput(this, name);
                }
                this._inputs[name] = input;
                if (input !== null) {
                    input.registerOutput(this, name);
                }
                this.notifyObservers();
            }
            return this._inputs[name];
        },


        /**
         * Return map from name to input nodes.
         */
        inputs: function () {
            return this._inputs;
        },

        
        /**
         * Invoke f(node) for this and all nodes in the chain that is input to this.
         */
        traverse: function (f) {
            console.log(this.id());
            f(this);
            this.forEachInput(function (n) {
                if (n) n.traverse(f);
            });
        },

        
        /**
         * Return array of outputs.
         */
        outputs: function() {
            var outputs = [];
            var slots = this._outputs;
            Object.keys(slots).forEach(function (id) {
                var slot = slots[id];
                var references = Object.keys(slot);
                if (references[0]) {
                    outputs.push(slot[references[0]]);
                } else {
                    console.warn("Output slot is empty.");
                }
            });
            return outputs;
        },


        /**
         * Return array of entities.
         */
        entities: function() {
            var entities = [];
            var scope = this;
            Object.keys(this._entities).forEach(function (id) {
                entities.push(scope._entities[id]);
            });
            return entities;
        },


        /**
         * Execute a function(input) for each input.
         */
        forEachInput: function (f) {
            var scope = this;
            Object.keys(this.inputs()).forEach(function (name) {
                var input = scope.input(name);
                f(input, name);
            });
        },
        

        /**
         * Execute a funciton(entity) for each entity.
         */
        forEachOutput: function (f) {
            this.outputs().forEach(f);
        },


        /**
         * Execute a funciton(entity) for each entity.
         */
        forEachEntity: function (f) {
            this.entities().forEach(f);
        },
        
        
        /**
         * Register output.
         * Output must be another ApperanceNode.
         * An output must be associated with the input name.
         */
        registerOutput: function (output, inputName) {
            var id = output.id() + "";
            if (!this._outputs[id]) {
                this._outputs[id] = {};
            }
            this._outputs[id][inputName] = output
        },

        
        /**
         * Unregister output.
         */
        unregisterOutput: function (output, inputName) {
            var id = output.id();
            if (!this._outputs[id]) {
                console.error('Trying to remove output from note that has no registered outputs');
                return;
            }
            var slot = this._outputs[id];

            if (slot[inputName]) {
                delete slot[inputName];
                if (Object.keys(slot).length === 0) {
                    delete this._outputs[id];
                }
            } else {
                console.warn("Trying to remove output that is not registered");
            }
        },
        

        /**
         * Register entity.
         */
        registerEntity: function (entity) {
            var id = entity.id();
            if (this._entities[id]) {
                console.error("Entity is already registered");
            } else {
                this._entities[id] = entity;
            } 
        },
        

        /**
         * Register entity.
         */
        unregisterEntity: function (entity) {
            var id = entity.id();
            if (this._entities[id]) {
                delete this._entities[id];
            } else {
                console.warn("Trying to remove entity that is not registered");
            }
        },


        /**
         * Notify observers.
         */
        notifyObservers: function () {
            this.forEachOutput(function (output) {
                output.notifyObservers();
            });
            this.forEachEntity(function (entity) {
                entity.notifyObservers('appearance');
            });
        }
        
    });

});


