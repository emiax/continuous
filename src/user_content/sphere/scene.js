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
                z: 1
            },
            expressions: {
                position: '[x, y, z]',
                subject: '[0, 0, 0]',
                up: '[0, 0, 1]'
            }
        });

        scope.add(camera);

        var t = 0
        var a, aString;
        function update() {

            a = Math.abs(Math.sin(t/200));
            aString = Math.round( a * 10 ) / 10;

            State.set( 'theta', '{0, ' + (aString).toFixed(1) + 'pi }' );
            State.set( 'phi', '{0, ' + (aString*2).toFixed(1) + 'pi }');

            surface.primitive( 'a', a );

            ++t;
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
                b: Math.PI / 2,
                c: Math.PI / 2
            },
            inputA: gradient,
            inputB: darkOverlay
        });


        var surface = new MathGL.Surface({
            domain: {
                T: [0, Math.PI],
                P: [0, 2*Math.PI]
            },
            primitives: {
                r: 0.5,
                a: 1
            },
            expressions: {
                b: 'T*a',
                c: 'P*a',
                x: 'r*sin(b)*cos(c)',
                y: 'r*sin(b)*sin(c)',
                z: 'r*cos(b)',
            },
            appearance: checker
        });

        State.set('r', surface.primitive('r'));

        scope.add(surface);
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
            }
        }
        State.subscribe(updateCamera);

        view.startRendering(update, stats);

        var endTime = new Date();
    };

    return scene;
});
