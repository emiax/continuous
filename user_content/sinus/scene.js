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
        var t;
        function update() {
            t = State.t;
            scope.primitive('t', t % 20*Math.PI);
            State.t += 0.01;
        }

        // surface appearance.
        var red = new MathGL.Color(0xffff0000);
        var green = new MathGL.Color(0xff00cc00);
        var blue = new MathGL.Color(0xff0000ff);

        var gradient = new MathGL.Gradient({
            parameter: 's',
            blendMode: 'normal', 
            stops: {
                '0': blue,
                '1': red
            }
        });

        var darkOverlay = new MathGL.Color({
            background: gradient,
            color: 0x44000000
        });
        
        var stripes = new MathGL.CheckerPattern({
            parameters: {
                T: 1
            },
            inputA: gradient,
            inputB: darkOverlay
        });

        var diffuse = new MathGL.Diffuse({
            background: stripes
        });

        var parser = new SimpleFormat.Parser();
        

        
        
        var r = parser.parse('cos(q*T) + 2');
        var x = parser.parse('5cos(T/10) + r*cos(p*T)').substituted({r: r});
        var y = parser.parse('5sin(T/10) + r*sin(p*T)').substituted({r: r});
        var z = parser.parse('-sin(q*T)').substituted({r: r});


        // main scope

        var scope = new MathGL.Scope({
            primitives: {
                t: 0
            },
            expressions: {
                p: '3',
                q: '7',
                a: 't',
                T: 'a*s',
                x: x,
                y: y,
                z: z,
                X: x.differentiated('T'),
                Y: y.differentiated('T'),
                Z: z.substituted({'x': x, 'y': y}).differentiated('T'),
            }
        });


        // entities
        
        var curve = new MathGL.Curve({
            domain: {
                s: [0, 1]
            },
            thickness: 0.1,
            stepSize: 0.001,
            appearance: diffuse
        });
        
        var arrow = new MathGL.VectorArrow({
            primitives: {
                s: 1
            },
            expressions: {
                position: '[x, y, z]',
                value: '[X/10, Y/10, Z/10]',
            },
            appearance: diffuse
        });

        // camera
       
        var camera = new MathGL.Camera({
            expressions: {
                s: 1,
                position: '15*[cos(t/10), sin(t/10), sin(t/10)]',
                subject: '[0, 0, 0]',
                up: '[0, 0, 1]'
            }
        });

        scope.add(camera);

        // Add erverything to the scene graph.

        scope.add(arrow);
        scope.add(curve);
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
