define(['quack', 'kalkyl', 'mathgl/spaceObserver.js', 'mathgl', 'mathgl/engine/exports.js'], function(q, Kalkyl, SpaceObserver, MathGL, Engine) {

    return Engine.Renderer = q.createClass([SpaceObserver], {
        /**
         * Constructor
         */
        constructor: function (gl) {
            this._gl = gl;
            this._renderables = {};
            this._updates = {};
            this._space = null;
            this._camera = null;
            
            gl.enable(gl.DEPTH_TEST);

        },

        
        /**
         * Return the GL machine.
         */
        gl: function () {
            return this._gl;
        },

        
        /**
         * Get/set dimensions of rendering context.
         */
        dimensions: function () {
            // TODO
        },


        /**
         * Clear frame.
         */
        clearFrame: function() {
            var gl = this.gl();
            var c = 0x00;
            gl.clearColor(c, c, c, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        },


        camera: function (camera) {
            if (camera !== undefined) {
                this._camera = camera;
            }
            return this._camera;
        },
        
        /**
         * Prepare and render all renderables.
         */
        render: function () {
            var camera = this.camera();
            if (!camera) {
                console.error("Trying to render without camera!");
                return;
            }
            this.prepareRenderables();
            this.clearFrame();
            this.forEachRenderable(function (r) {
                r.render(camera);
            });
        },

        
        /**
         * Execute f(renderable, scopeId) for all renderables
         */
        forEachRenderable: function (f) {
            var scope = this;
            Object.keys(this._renderables).forEach(function (id) {
                f(scope._renderables[id], id);
            });
        },

        
        /**
         * Prepare renderables. Makes calls to 'attach', 'detach' and 'refresh'
         */
        prepareRenderables: function () {
            var scope = this;
            this.forEachUpdate(function (slot, id) {
                if (slot.existence) {
                    scope.attach(slot.existence);
                    return;
                } else if (slot.existance === false) {
                    scope.detach(id);
                    return;
                }
                scope.refresh(id, {
                    appearance: !!slot.appearance,
                    expressions: slot.expressions || {}
                });
            });
            this.clearUpdates();
        },
        

        /**
         * Refresh a renderable
         */
        refresh: function (id, spec) {
//            console.log("refreshing " + id);
            this._renderables[id].refresh(spec);
        },

        
        /**
         * Attach a renderable
         */
        attach: function (scope) {
            var id = scope.id();
            if (scope instanceof MathGL.Surface) {
                this._renderables[id] = new Engine.RenderableSurface(this.gl(), scope);
                this._renderables[id].initialize();
            }
            // ADD MORE ENTITY TYPES HERE.
        }, 
        
        /**
         * Detach a renderable
         */
        detach: function (id) {
            var renderable = this.renderable[id];
            if (renderable) {
                renderable.destroy();
                delete this.renderables[id];
            }
        },

        /**
         * Detach all renderables
         */
        detachAll: function () {
            var scope = this;
            Object.keys(this._renderables).forEach(function (id) {
                scope.detach(id);
            });
        },
        
        
        /**
         * Attach all objects in the current space to this renderer.
         */
        attachAll: function () {
            var that = this;
            space = this._space;
            space.traverse(function (graphScope) {
                if (graphScope instanceof MathGL.Entity) {
                    that.attach(graphScope);
                }
            });
        },


        /**
         * Get/set space to render.
         */
        space: function (space) {
            if (space !== undefined && space != this._space) {
                // get rid of old space
                if (this._space) {
                    space.removeObserver(this);
                }
                this.detachAll();

                // get started with new space
                space.addObserver(this);
                this._space = space;                
                this.attachAll();
            }
            return this._space;
        },

        
        /**
         * From SpaceObserver interface.
         * This method is invoked from space when a scope is updated.
         */
        update: function (scope, type, symbol) {
            if (!(scope instanceof MathGL.Entity)) {
                // ignore scopes that are not entities.
                return;
            }
            var id = scope.id();
//            console.log(id + " sent update '" + type + "'");
            var slot = this._updates[id];
            if (!slot) {
                slot = this._updates[id] = {};
            }
            switch (type) {
            case 'appearance':
                slot.appearance = true;
                break;
            case 'expression':
                if (!slot.expressions) slot.expressions = {};
                slot.expressions[symbol] = true;
                break;
            case 'add': 
                slot.existence = scope;
                break;
            case 'remove':
                slot.existence = false;
                break;
            }
        },

        
        /**
         * Clear updates. Called in the end of every frame.
         */
        clearUpdates: function () {
            var scope = this;
            Object.keys(scope._updates).forEach(function(id) {
                delete scope._updates[id];
            });
        },

        
        /**
         * Invoke funciton f(update, id) for every update.
         */
        forEachUpdate: function (f) {
            var scope = this;
            Object.keys(scope._updates).forEach(function (id) {
                f(scope._updates[id], id);
            });
        },


        
    });
});

