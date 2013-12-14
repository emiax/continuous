requirejs.config({
    baseUrl: './',

    packages: [
    "quack",
    "kalkyl",
    "kalkyl/format",
    "kalkyl/format/simple",
    "kalkyl/format/glsl",
    "kalkyl/glmatrix",

    "gl-matrix",
    "mathgl",
    "mathgl/engine"
    ],

    paths: {
        // List of all Continuous packages
        'jquery':                './lib/jquery-2.0.3.min',
        'stats':                './lib/stats.min',
        'gl-matrix':             './lib/gl-matrix-min'
    }
});

define([
    'require',
    'kalkyl',
    'kalkyl/format/simple',
    'mathgl',
    'mathgl/engine'], 

    function(
        require,
        Kalkyl, SimpleFormat, MathGL, Engine) {

        var scene = function() {
            var State = require('./state');

            var view = new Engine.View(document.getElementById('canvas'));

            var space = new MathGL.Space();

        // BEGIN DEFINING SPACE.
        var scope = new MathGL.Scope({
            expressions: {
                t: 0,
                j: 0,
                p: 3,
                q: -7
            }
        });

        var camera = new MathGL.Camera({
            primitives: {
                x: 0,
                y: 0,
                z: 3
            },
            expressions: {
                position: '[x, y, z]',
                subject: '[0, 0, 0]',
                up: '[0, 1, 0]'
            }
        });

        scope.add(camera);

        var t = 0
        function update() {
            ++t;
        }


        // appearance.
        var red = new MathGL.Color(0xffff0000);
        var green = new MathGL.Color(0xff00cc00);
        var blue = new MathGL.Color(0xff0000ff);
        var white = new MathGL.Color(0xffffffff);
        var diffuseWhite = new MathGL.Diffuse({
           background: white
        });
        var diffuseGreen = new MathGL.Diffuse({
           background: green
        });

        var gradient = new MathGL.Gradient({
            parameter: 'z',
            blendMode: 'normal', 
            stops: {
                '0.8': red,
                '0': blue,
                '-0.8': green
            }
        });

        var darkOverlay = new MathGL.Color({
            color: 0x55000000,
            background: gradient
        });

        var checker = new MathGL.CheckerPattern({
            parameters: {
                b: Math.PI / 2,
                c: Math.PI / 2
            },
            inputA: gradient,
            inputB: darkOverlay
        });

        /**
         * Entities
         */
        
        // Axes
        var xAxis = new MathGL.VectorArrow({
            expressions: {
                position: '[-1.5, 0, 0]',
                value: '[3.0, 0, 0]'
            },
            appearance: diffuseWhite,
            thickness: 0.01
        });
        space.add(xAxis);

        var yAxis = new MathGL.VectorArrow({
            expressions: {
                position: '[0, -1.5, 0]',
                value: '[0, 3.0, 0]'
            },
            appearance: diffuseWhite,
            thickness: 0.01
        });
        space.add(yAxis);

        var delimitingFunction = new MathGL.Curve({
            domain: {
                s: [0, 1]
            },
            expressions: {
                x: 's',
                y: 'x^2',
                z: 0
            },
            thickness: 0.01,
            stepSize: 0.001,
            appearance: green
        });
        space.add(delimitingFunction);

        // var containedSurface = new MathGL.Surface({
        //     domain: {
        //         u: [0, 1],
        //         v: [0, 'u^2']
        //     },
        //     expressions: {
        //         x: 'u',
        //         y: 'v',
        //         z: 0
        //     },
        //     appearance: diffuseGreen
        // });

        space.add(scope);
        view.space(space);
        view.camera(camera);

        var updateDimensions = function (update) {
            if(update == 'canvasDim') {
                var newDims = State.canvasDim;
                view.dimensions(newDims.w, newDims.h);
            }
        }
        State.subscribe(updateDimensions);

        var updateCamera = function (update) {
            if(update == 'mouseState') {
                
                var x = State.mouseState.mouseDiff.x;
                var y = State.mouseState.mouseDiff.y;

                var camX = camera.primitive('x');
                var camY = camera.primitive('z');
                var camZ = camera.primitive('y');

                // cartesian => spherical
                var r = Math.sqrt(camX*camX + camY*camY + camZ*camZ);
                var phi = Math.atan2(camY, camX);
                var theta = Math.acos(camZ / r);

                phi += x/100;

                theta -= y/100;
                theta = theta > Math.PI ? Math.PI : theta;
                theta = theta < 0.001 ? 0.001 : theta;

                // spherical => cartesian
                camera.primitive('x', r*Math.sin(theta)*Math.cos(phi));
                camera.primitive('z', r*Math.sin(theta)*Math.sin(phi));
                camera.primitive('y', r*Math.cos(theta));
            }
        }
        State.subscribe(updateCamera);

        view.startRendering(update, stats);

        var endTime = new Date();
    };

    return scene;
});
