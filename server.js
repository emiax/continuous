var requirejs = require('requirejs');

requirejs.config({
    baseUrl: './', 
    paths: {
        quack: './lib/quack'
    },
    nodeRequire: require
});



requirejs(['kalkyl/package', 'sage/package', 'communication/server/package'], function(KL, SAGE, S) {
    
    var constant = new KL.Constant(10);
    var x = new KL.Variable('x');
    var y = new KL.Variable('y');
    var minus = new KL.Minus(constant, x);      
    var vector = new KL.Vector3(minus, x, y);
    
    var sage = new SAGE.Wrapper();
    var ssw = new S.SocketServerWrapper(8080);


    
    
});






/*



*/
