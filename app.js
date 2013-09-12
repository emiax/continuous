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
              
    $('#input').change(function () {
        parse($(this).val());
    });
    
    $('#input').keyup(function () {
        parse($(this).val());
    });


    var port = 8080;
    var connection = new Client.Connection('ws://localhost:' + port);
    var parser = new SimpleFormat.Parser();

    var space = new MathGL.Space();
    
    // BEGIN DEFINING SPACE.
    
    var scope = new MathGL.Scope({
        expressions: {
//            a: 2,
            b: 'a + a',
            t: '0.001',
            s: '2',
            c: '0',
            r: "(x^2 + y^2)",
            d: "r*(cos(t*10)+1.5)*2"
        }
    });

   


    var camera = new MathGL.Camera({
        expressions: {
            x: 'sin(s)*cos(t)',
            y: 'cos(s)*sin(t)',
            z: 0.4, 
            a: 0.0,
            b: 0.0,
            c: 0.0,
            u: 0
        }
    });

    scope.add(camera);
    

    var t = 0;
    function increment() {
        scope.set('t', t);
        scope.set('s', scope.get('s').value() + 0.01);
//        camera.set('x', 0.5*Math.cos(t));
//        camera.set('y', 0.5*Math.sin(t));
        t+=0.001;
    }
    
    
    setInterval(function() {
          increment();
    }, 10);
    

    
    // surface appearance.

    var red = new MathGL.Color(0xffff0000);
    var green = new MathGL.Color(0xff00ff00);
    var blue = new MathGL.Color(0xff0000ff);

    var overlay = new MathGL.Color({
        background: green,
        color: 0x55000000
    });
    var gradient = new MathGL.Gradient({
        parameter: 'x',
        blendMode: 'normal', // default
        // these will have to be numbers (NOT EXPRESSIONS)
        stops: {
            '-1': red,
//            0: blue,
            1: green
        }
    });
    var radialGradient = new MathGL.Gradient({
        parameter: 'r',
        background: gradient, // default
        blendMode: 'normal', // default
        // these will have to be numbers (NOT EXPRESSIONS)
        stops: {
            4: new MathGL.Color(0x00000000),
            0: new MathGL.Color(0x88111111)
        }
    });

    var checker = new MathGL.CheckerPattern({
        parameters: {
            d: 0.4
        },
        inputB: radialGradient,
        inputA: gradient
    });
    
    // surface.
    var surface = new MathGL.Surface({
        domain: {
            u: [0, 2*Math.PI],
            v: [0, 0.6]
        },
        expressions: {
            x: '2cos(u)*v + sin(5t)*0.3sin(8u)',
            y: '2sin(u)*v + cos(8t)*0.3sin(6u)',
            z: '2v',
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


/*
    var colorGradientTinted = new MathGL.Color({
        blendMode: 'normal',
        color: 0x44000000,
        input: colorGradient
    });

    var checker = new MathGL.CheckerPattern({
        intervals: {
            x: 1,
            y; 1
        },
        offsets: {
            x: 0, 
            y: 0
        },
        inputA: colorGradient,
        inputB: colorGradientTinted
    });
    
    var mask = new MathGL.Mask({
        input: checker,
        parameter: 'x',
        constraint: '<'
        value: 4,
        feather: 2
    });
*/

/*    var surface2 = new MathGL.Surface({
        domain: {
            u: [0, 10],
            v: [0, 10]
        },
        appearance: color
    });

*/

    

/*    console.log(color);

    color.color(0x44113322);
    console.log("bg = null");
    overlay.background(null);
//    gradient.background();
    
    console.log(color.outputs());
    color.color(0x49113322);
    console.log('did set color');
    overlay.background(color);
    console.log('did set background');
    console.log(gradient.inputs());

    console.log(surface);

*/




//    var bridge = new MathGL.RenderBridge(space, renderer)

//    var bridge = new MathGL.ThreeJSBridge(space, renderer)

    

});
