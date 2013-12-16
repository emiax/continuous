var requirejs = require('requirejs');

requirejs.config({
    baseUrl: './',
    paths: {
        // List of all Continuous packages
        'quack':                 './lib/quack',
        'jquery':                './lib/jquery-2.0.3.min',
        'kalkyl':                './kalkyl/package',
        'kalkyl/format':         './kalkyl/format/package',
        'kalkyl/format/simple':  './kalkyl/format/simple/package',
        'kalkyl/format/sage':    './kalkyl/format/sage/package',
        'communication':         './communication/package',
        'communication/server':  './communication/server/package',
        'server':                './server/package',
        'errors':                './errors/package',
    },
    nodeRequire: require
});


requirejs(['kalkyl', 'communication/server', 'server'], function(Kalkyl, ServerCommunication, Server) {
 
    /**
     * HTTP Server
     */
    
    var express = require('express');
    var expressServer = express();
    
    expressServer.configure('development', function() {
        expressServer.use(express.static(__dirname));
        expressServer.use(express.errorHandler({dumpExceptions: true, showStack: true}));
    });

    expressServer.listen(80);
 
    setTimeout(function () {
    /**
     * WebSocket Server
     */
        
        var sage = new Server.SageWrapper();
        var router = new Server.Router(sage);
        var socketServer = new ServerCommunication.SocketServer(443, router);

    }, 10000);
        
   
});
