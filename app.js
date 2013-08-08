requirejs.config({
    baseUrl: '/continuous/',
    paths: {
        // List of all Continuous packages
        'quack':                 './lib/quack',
        'jquery':                './lib/jquery-2.0.3.min',
        
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
//    var renderer = new MathGL.Renderer(document.getElementById('canvas'));
 //   renderer.setSpace(space);
    
//    view.setCamera(...);
    var view = new Engine.View(document.getElementById('canvas'));
    view.space(space);
    view.startRendering();


    // BEGIN DEFINING SPACE.
    
    var scope = new MathGL.Scope({
        expressions: {
            a: 2,
            b: 'a + a',
            t: 'u + v + a',
            c: 'u*t'
        }
    });

    
    // surface appearance.

    var color = new MathGL.Color(0xffffffff);
    var overlay = new MathGL.Color({
        background: color,
        color: 0x44000000
    });
    var gradient = new MathGL.Gradient({
        parameter: 'c',
        background: color, // default
        blendMode: 'normal', // default
        // these will have to be numbers (NOT EXPRESSIONS)
        stops: {
            0: overlay,
            0.5: new MathGL.Color(0xbbbbbb),
            1: new MathGL.Color(0xffffff),
        }
    });
    
    // surface.
    var surface = new MathGL.Surface({
        domain: {
            u: [0, 0.8],
            v: [0, 0.8]
        },
        expressions: {
            x: 'u',
            y: 'v', 
            z: 'sin(u*v*t)',
        },
        appearance: gradient
    });

    space.add(scope);
    scope.add(surface);

    // END DEFINING SPACE.

    console.log("INIT SPACE DONE");



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
