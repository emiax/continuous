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
                z: 5
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
            // camera.primitive('x', 6*Math.cos(2*Math.PI * t / 1000) + 0.01);
            // camera.primitive('y', 4*Math.sin(2*Math.PI * t / 5000) + 0.01);
            surface2.primitive('a', 7*Math.sin(t/500));
            ++State.t;
        }


        // surface appearance.
        var red = new MathGL.Color(0xffff0000);
        var green = new MathGL.Color(0xff00cc00);
        var blue = new MathGL.Color(0xff222299);
        var cyan = new MathGL.Color(0xff007bbb);
        var white = new MathGL.Color(0xffcccccc);

        var gradient = new MathGL.Gradient({
            parameter: 'x',
            blendMode: 'normal', 
            stops: {
                '8': red,
                '-8': blue
            }
        });

        var darkOverlay = new MathGL.Color({
            color: 0x22000000,
            background: gradient
        });

        var checker = new MathGL.CheckerPattern({
            parameters: {
                x: 1,
                y: 1
            },
            inputA: gradient,
            inputB: darkOverlay
        });

        var threshold = new MathGL.Threshold({
            parameter: 'r',
            value: 20.0,
            below: checker,
            above: white
        });

        var diffuse = new MathGL.Diffuse({
            background: threshold
        });

        var surface = new MathGL.Surface({
            domain: {
                x: [-20, 10],
                y: [-20, 10]
            },           
            expressions: {
                z: '-10',
            },
            appearance: white,
            style: 'wireframe'
        });

        var surface2 = new MathGL.Surface({
            primitives: {
                a: 5
            },
            domain: {
                x: [-10, 10],
                y: [-10, 10]
            },           
            expressions: {
                z: 'cos(ax)*sin((1-a)y) + x^2/15 + y^2/15',
                r: '(x^2 + y^2)^(1/2)'
            },
            appearance: diffuse,
        });



//        scope.add(surface);
        scope.add(surface2);

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

        var updateCamera = function (update) {
            if(update == 'mouseState') {
                
                var x = State.mouseState.mouseDiff.x;
                var y = State.mouseState.mouseDiff.y;

                var camX = camera.primitive('x');
                var camY = camera.primitive('y');
                var camZ = camera.primitive('z');

                // cartesian => spherical
                var r = Math.sqrt(camX*camX + camY*camY + camZ*camZ);
                var phi = Math.atan2(camY, camX);
                var theta = Math.acos(camZ / r);

                phi -= x/100;

                theta -= y/100;
                theta = theta > Math.PI ? Math.PI : theta;
                theta = theta < 0.001 ? 0.001 : theta;

                // spherical => cartesian
                camera.primitive('x', r*Math.sin(theta)*Math.cos(phi));
                camera.primitive('y', r*Math.sin(theta)*Math.sin(phi));
                camera.primitive('z', r*Math.cos(theta));

                console.log(phi);
            }
        }
        State.subscribe(updateCamera);

        view.startRendering(update, stats);

        var endTime = new Date();
    };

    return scene;
});
