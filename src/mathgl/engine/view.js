define(function (require) {

    var q = require('quack');
    var exports = require('./exports');
//    var Stats = require('stats');


    
    return exports.View = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (canvas) {
            this._canvas = canvas;
            this._space = null;
            this._renderer = null;
            this._active = false;
            this._requestAnimationFrame = null;
            this._renderLoop = null;
            
            var stats = this._stats = new Stats();
            //this._stats.setMode(0);
            document.body.appendChild(stats.domElement);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            
//            this.updateDimensions();
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
        startRendering: function (renderLoop) {
            var scope = this;
//            console.log("render!");
            this._renderLoop = renderLoop;
            
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
         * Render, until active flag is off.
         */
        render: function () {
            var scope = this;
            var raf = this.requestAnimationFrameFn();
            (function render () {
                if (scope.active()) {
                    scope._stats.begin();
                    if (scope._renderLoop) {
                        scope._renderLoop();
                    }
                    scope.renderer().render();
                    raf(render);
                    scope._stats.end();
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
         * Get/set dimensions.
         */
        dimensions: function (width, height) {
            var renderer = this.renderer();
            if (renderer) {
                // return renderer.dimensions([this._canvas.width, this._canvas.height]);
               return renderer.dimensions([width, height]);
            }
            return renderer.dimensions();
        },
        
        
        /**
         * Get renderer
         */
        renderer: function () {
            if (!this._renderer) {
                var canvas = this._canvas;
                var gl = canvas.getContext("experimental-webgl");
                if (gl) {
                    var renderer = this._renderer = new exports.Renderer(gl);
                } else {
                    throw "WebGL not available."
                }
            }
            return this._renderer;
        }
    });
});
