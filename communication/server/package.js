define(['communication/server/exports.js',
        'communication/server/requestParser.js',
        'communication/server/socketWrapper.js',
        'communication/server/responseFormatter.js',
        'communication/server/socketServer.js'],
       function(exports) {
           console.log("loaded communication.server");
           return exports;
       });
