requirejs.config({
    baseUrl: './',
    paths: {
        // List of all Continuous packages
        'quack':                 './lib/quack',
        'jquery':                './lib/jquery-2.0.3.min',
        'stats':                 './lib/stats.min',
        'gl-matrix':             './lib/gl-matrix-min',
        
        'kalkyl':                './kalkyl/package',
        'kalkyl/format':         './kalkyl/format/package',
        'kalkyl/format/simple':  './kalkyl/format/simple/package',
        'kalkyl/format/javascript':  './kalkyl/format/javascript/package',
        'kalkyl/format/sage':    './kalkyl/format/sage/package',
        'kalkyl/format/glsl':    './kalkyl/format/glsl/package',
        'kalkyl/glmatrix':       './kalkyl/glmatrix/package',
        
        'communication':         './communication/package',
        'communication/client':  './communication/client/package',
        
        'mathgl':                './mathgl/package',
        'mathgl/engine':         './mathgl/engine/package',
        'errors':                './errors/package'
    }
});

define([
    'require',
    'kalkyl',
    'kalkyl/format/simple',
    'mathgl',
    'mathgl/engine',
    'jquery'], 

    function(
        require,
        Kalkyl, SimpleFormat, MathGL, Engine, $) {

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
                z: 1
            },
            expressions: {
                position: '[x, y, z]',
                subject: '[0, 0, 0]',
                up: '[0, 0, 1]'
            }
        });

        scope.add(camera);

        var t;
        function update() {
            t = State.t;
            camera.primitive('x', Math.cos(2*Math.PI * t / 1000) + 0.01);
            camera.primitive('y', Math.sin(2*Math.PI * t / 1000) + 0.01);
            ++State.t;
        }

        // surface appearance.
        var red = new MathGL.Color(0xffff0000);
        var green = new MathGL.Color(0xff00cc00);
        var blue = new MathGL.Color(0xff0000ff);

        var gradient = new MathGL.Gradient({
            parameter: 's',
            blendMode: 'normal', 
            stops: {
                '0.5': red,
                '0': blue
            }
        });

        // var darkOverlay = new MathGL.Color({
        //     color: 0x55000000,
        //     background: gradient
        // });

        // var checker = new MathGL.CheckerPattern({
        //     parameters: {
        //         t: 0.25
        //     },
        //     inputA: gradient,
        //     inputB: darkOverlay
        // });


        var curve = new MathGL.Curve({
            domain: {
                s: [0, 0.1]
            },
            expressions: {
                x: 's',
                y: 's',
                z: 'sin(x)',
            },
            thickness: 0.2,
            stepSize: 0.5,
            appearance: gradient
        });

        scope.add(curve);
        space.add(scope);    

        view.space(space);
        view.camera(camera);

        view.startRendering(update, stats);

        var endTime = new Date();
    };

    return scene;
});