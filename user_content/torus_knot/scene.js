requirejs.config({
    baseUrl: 'http://localhost/continuous/',

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
    'state',
    'kalkyl',
    'kalkyl/format/simple',
    'mathgl',
    'mathgl/engine',
    'angular',
    'jquery'], 

    function(State, Kalkyl, SimpleFormat, MathGL, Engine, Angular, $) {
    
    var scene = function() {

        var view = new Engine.View(document.getElementById('canvas'));

        //bläääsch
        var angularScope = Angular.element($('#canvas')).scope();

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
            expressions: {
                x: 1,
                y: 0,
                z: 1,
                position: '[x, y, z]',
                subject: '[0, 0, 0]',
                up: '[0, 0, 1]'
            }
        });

        scope.add(camera);

        var t;
        function update() {
            t = State.t;
            camera.set('x', Math.cos(2*Math.PI * t / 1000) + 0.01);
            camera.set('y', Math.sin(2*Math.PI * t / 1000) + 0.01);
            ++State.t;
            angularScope.$apply();
        }


        // surface appearance.
        var red = new MathGL.Color(0xffff0000);
        var green = new MathGL.Color(0xff00cc00);
        var blue = new MathGL.Color(0xff0000ff);

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
                v: 0.25,
                u: 0.25
            },
            inputA: gradient,
            inputB: darkOverlay
        });


        var surface = new MathGL.Surface({
            domain: {
                u: [-0.5, 0.5],
                v: [-0.5, 0.5]
            },
            expressions: {
                x: 'u*2',
                y: 'v*2',
                z: 'cos(j * x)sin(j * y)',
            },
            appearance: checker
        });

        var curveGradient = new MathGL.Gradient({
            stops: {
                0: red,
                6: blue
            },
            parameter: 's'
        });

            var curve = new MathGL.Curve({
                domain: {
                    s: [-0, 2 * Math.PI],
                },
                expressions: {
                    r: '0.2*(cos(qs) + 2)',
                    x: 'r*cos(ps)',
                    y: 'r*sin(ps)',
                    z: '0.2*-sin(qs)'
                },
                appearance: curveGradient
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
