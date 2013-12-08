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
            ++State.t;
        }


        // surface appearance.
        var red = new MathGL.Color(0xffff0000);
        var green = new MathGL.Color(0xff00cc00);
        var blue = new MathGL.Color(0xff222299);
        var cyan = new MathGL.Color(0xff007bbb);

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
                v: 0.1,
                u: 0.1
            },
            inputA: gradient,
            inputB: darkOverlay
        });


        var surface = new MathGL.Surface({
            domain: {
                u: [-1, 1],
                v: [-1, 1]
            },
            expressions: {
                x: 'u',
                y: 'v',
                z: 'x^2 + y^2',
            },
            appearance: checker
        });

        scope.add(surface);
        space.add(scope);    

        view.space(space);
        view.camera(camera);

        view.startRendering(update, stats);

        var endTime = new Date();
    };

    return scene;
});
