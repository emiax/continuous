define(['quack', 'mathgl/engine/exports.js'], function(q, Engine) {
    return Engine.View = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (canvas) {
            this._canvas = canvas;
            this._space = null;
            this._renderer = null;
            this._active = false;
            this._requestAnimationFrame = null;
        },


        /**
         * Request animation frame.
         */
        requestAnimationFrameFn: function () {
            var raf = this._requestAnimationFrame;
            if (!raf) {
                raf = window.requestAnimationFrame   ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame    ||
                    function( callback ) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            }
            return raf;
        },

        
        /**
         * Start rendering.
         */
        startRendering: function () {
            var scope = this;
            console.log("render!");

            var renderer = this.renderer();
            if (renderer) {
                this.active(true);
                this.render();
            }
        },

        
        /**
         * Pause rendering.
         */
        pauseRendering: function () {
            this.active(false);
        }, 


        /**
         * Render, until active flag is offx.
         */
        render: function () {
            var scope = this;
            var raf = this.requestAnimationFrameFn();
            (function render () {
                if (scope.active()) {
                    scope.renderer().render();
                    raf(render);
                }
            })();
        },
        
        
        /**
         * Get/Set active
         */
        active: function (active) {
            if (active !== undefined) {
                this._active = active;
            }
            return this._active;
        },


        /**
         * Get/set space
         */
        space: function (space) {
            var renderer = this.renderer();
            return renderer.space(space);
        },


        /**
         * Get/set camera
         */
        camera: function (camera) {
            return this.renderer().camera(camera);
        },
        


        /** 
         * Update dimensions.
         */
        updateDimensions: function () {
            var renderer = this.renderer();
            if (renderer) {
                renderer.dimensions(canvas.width, canvas.height);
            }
        },
        
        
        /**
         * Get renderer
         */
        renderer: function () {
            if (!this._renderer) {
                var canvas = this._canvas;
                var gl = canvas.getContext("experimental-webgl");
                if (gl) {
                    var renderer = this._renderer = new Engine.Renderer(gl);
                    this.updateDimensions();
                } else {
                    throw "WebGL not available."
                }
            }
            return this._renderer;
        }
    });
});
