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
        var red = new MathGL.Color(0xffcc0000);
        var green = new MathGL.Color(0xff00cc00);
        var darkBlue = new MathGL.Color(0x880000cc);
        var blue = new MathGL.Color(0xff0000ff);
        var white = new MathGL.Color(0xffffffff);
        var diffuseWhite = new MathGL.Diffuse({
           background: white
        });
        var diffuseGreen = new MathGL.Diffuse({
           background: green
        });
        var diffuseRed = new MathGL.Diffuse({
            background: red
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
            appearance: diffuseGreen
        });
        space.add(delimitingFunction);


        var containedSurfaceClip = new MathGL.Threshold({
            parameter: 'y',
            value: 'a',
            above: null,
            below: darkBlue
        });
        var containedSurface = new MathGL.Surface({
            domain: {
                u: [0, 1],
                v: [0, 1]
            },
            primitives: {
                c: 1
            },
            expressions: {
                a: 'x^2',
                x: 'u',
                y: 'v+c',
                z: 0
            },
            appearance: containedSurfaceClip
        });
        space.add(containedSurface);

        var volumeElementClip = new MathGL.Threshold({
            parameter: 'r',
            value: 'c',
            above: null,
            below: diffuseRed
        });
        var volumeElement = new MathGL.Surface({
            domain: {
                u: [-1, 1],
                v: [-1, 1]
            },
            primitives: {
                p: 0
            },
            expressions: {
                c: 'x^2',
                r: '(y^2 + z^2)^(1/2)',

                x: 'p',
                y: 'u',
                z: 'v'
            },
            appearance: volumeElementClip
        });
        space.add(volumeElement);

        var integratedVolume = new MathGL.Surface({
            domain: {
                u: [0, 1],
                T: [0, 2*Math.PI]
            },
            primitives: {
                p: 0
            },
            expressions: {
                r: 'x^2',
                x: 'u*p',
                y: 'r*sin(T)',
                z: 'r*cos(T)'
            },
            appearance: diffuseRed
        });
        space.add(integratedVolume);

        space.add(scope);
        view.space(space);
        view.camera(camera);

        /**
         * Subscribers
         */
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

        var showEntities = function (update) {
            if(update == 'activeStep') {
                switch(State.activeStep) {
                case 1:
                    containedSurface.primitive('c', 0);
                    break;
                case 2:
                    containedSurface.primitive('c', 1);
                    volumeElement.primitive('p', 0.7);
                    camera.primitive('z', 3*Math.sin(Math.PI/4));
                    camera.primitive('x', 3*Math.sin(Math.PI/4));
                    break;
                }
            }
        }
        State.subscribe(showEntities);

        var updateVolumeElementPos = function (update) {
            if(update == 'elementPos') {
                volumeElement.primitive('p', State.elementPos);
            }
        }
        State.subscribe(updateVolumeElementPos);

        var updateIntegratedVolume = function (update) {
            if(update == 'integrationUpperBound') {
                integratedVolume.primitive('p', State.integrationUpperBound);
                volumeElement.primitive('p', State.integrationUpperBound);
            }
        }
        State.subscribe(updateIntegratedVolume);

        view.startRendering(update, stats);

        var endTime = new Date();
    };

    return scene;
});
