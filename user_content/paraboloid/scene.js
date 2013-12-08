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
                x: 1,
                y: 0,
                z: 4
            },
            expressions: {
                position: '[x, y, z]',
                subject: '[0, 0, 1]',
                up: '[0, 0, 1]'
            }
        });

        scope.add(camera);

        var t;
        function update() {
            t = State.t;
            camera.primitive('x', 4*Math.cos(2*Math.PI * t / 1000) + 0.01);
            camera.primitive('y', 4*Math.sin(2*Math.PI * t / 1000) + 0.01);
            surfaceScope.primitive('b', Math.sin(t/100)*0.8 + 1);
            ++State.t;
        }


        // surface appearance.
        var red = new MathGL.Color(0xffff0000);
        var green = new MathGL.Color(0xff00cc00);
        var blue = new MathGL.Color(0xff222299);
        var cyan = new MathGL.Color(0xff007bbb);
        var white = new MathGL.Color(0xffffffff);

        var gradient = new MathGL.Gradient({
            parameter: 'z',
            blendMode: 'normal', 
            stops: {
                '0.8': cyan,
                '0': blue
            }
        });

        var darkOverlay = new MathGL.Color({
            color: 0x22000000,
            background: gradient
        });

        var checker = new MathGL.CheckerPattern({
            parameters: {
                x: 0.1,
                y: 0.1
            },
            inputA: gradient,
            inputB: darkOverlay
        });

        var threshold = new MathGL.Threshold({
            parameter: 'z',
            value: 'b',
            below: checker,
            above: null
        });

        var diffuse = new MathGL.Diffuse({
            background: threshold
        });

        var surfaceScope = new MathGL.Scope({
            primitives: {
                b: 1
            },
            expressions: {
                X: 'r*cos(T)',
                Y: 'r*sin(T)',
                Z: 'x^2 + y^2',
            },
        });

        var wireSurface = new MathGL.Surface({
            domain: {
                r: [0, 1.4],
                T: [0, 2*Math.PI]
            },
            expressions: {
                x: 'X',
                y: 'Y',
                z: 'Z - 0.01',
            },
            style: 'wireframe',
            appearance: white
        });


        var solidSurface = new MathGL.Surface({
            domain: {
                r: [0, 1.3],
                T: [0, 2*Math.PI]
            },           
            expressions: {
                x: 'X',
                y: 'Y',
                z: 'Z',
            },
            appearance: diffuse
        });





        surfaceScope.add(solidSurface);
        surfaceScope.add(wireSurface);
        scope.add(surfaceScope);

        space.add(scope);    

        view.space(space);
        view.camera(camera);

        var updateDimensions = function (key) {
            if(key == 'canvasDim') {
                var newDims = State.canvasDim;
                view.dimensions(newDims.w, newDims.h);
            }
        }

        State.subscribe(updateDimensions);

        view.startRendering(update, stats);

        var endTime = new Date();
    };

    return scene;
});
