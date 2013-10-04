requirejs.config({
    baseUrl: './',
    paths: {
        // List of all Continuous packages
        'quack':                 './lib/quack',
        'jquery':                './lib/jquery-2.0.3.min',
        'gl-matrix':             './lib/gl-matrix-min',
        
        'kalkyl':                './kalkyl/package',
        'kalkyl/format':         './kalkyl/format/package',
        'kalkyl/format/simple':  './kalkyl/format/simple/package',
        'kalkyl/format/sage':    './kalkyl/format/sage/package',
        'kalkyl/format/glsl':    './kalkyl/format/glsl/package',
        
        'communication':         './communication/package',
        'communication/client':  './communication/client/package',
        
        'mathgl':                './mathgl/package',
        'mathgl/engine':         './mathgl/engine/package',
        'errors':                './errors/package'
    }
});


requirejs(['jquery', 'kalkyl', 'kalkyl/format/simple', 'kalkyl/format/sage', 'communication', 'communication/client', 'mathgl', 'mathgl/engine'], function($, Kalkyl, SimpleFormat, SageFormat, Communication, Client, MathGL, Engine) {
              
    var port = 8080;
    var connection = new Client.Connection('ws://localhost:' + port);
    var parser = new SimpleFormat.Parser();

    var space = new MathGL.Space();
    
    // BEGIN DEFINING SPACE.
    
    var scope = new MathGL.Scope({
        expressions: {
            r: "(u^2 + v^2)",
            j: 0
        }
    });

   
    var camera = new MathGL.Camera({
        expressions: {
            x: 1,
            y: 1,
            z: 2,
            a: 0,
            b: 0,
            c: 0,
            d: 0, 
            e: 0,
            f: 1
        }
    });

    scope.add(camera);

    var t = 0;
    function update() {
        setTimeout(function () {
            camera.set('x', Math.cos(t));
            camera.set('y', Math.sin(t));
            camera.set('j', 2*Math.sin(t));
            camera.set('z', Math.sin(0.2*t));
            update();
        }, 10);
        t += 0.01;
    }

    update();
      
    
    // surface appearance.

    var red = new MathGL.Color(0xffff0000);
    var green = new MathGL.Color(0xff00ff00);
    var blue = new MathGL.Color(0xff0000ff);

    var gradient = new MathGL.Gradient({
        parameter: 'z',
        blendMode: 'normal', 
        stops: {
            '-1': blue,
            0: green,
            1: red
        }
    });

    var darkOverlay = new MathGL.Color({
        color: 0x55000000,
        background: gradient
    });

    var checker = new MathGL.CheckerPattern({
        parameters: {
            u: 0.2,
            v: 0.2
        },
        inputA: gradient,
        inputB: darkOverlay
    });

    // surface.
    var surface = new MathGL.Surface({
        domain: {
            u: [-0.8, 0.8],
            v: [-0.8, 0.8]
        },
        expressions: {
            x: 'u*2',
            y: 'v*2',
            z: 'r^2*j',
        },
        appearance: checker
    });

    space.add(scope);
    scope.add(surface);

    // END DEFINING SPACE.

    console.log("INIT SPACE DONE");


//    view.setCamera(...);
    var view = new Engine.View(document.getElementById('canvas'));
    view.space(space);
    view.camera(camera);
    view.startRendering();    

});
