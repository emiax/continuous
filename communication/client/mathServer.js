define(['quack', './exports.js', '../package.js'], function (q, C, CS) {

    return C.MathServer = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (url) {
            this._url = url;
        },
        
        
        connect: function (callback) {
            var sw = this._socketWrapper = new C.SocketWrapper(this._url);
            sw.connect(callback);
            this._nextRequestId = 0;
        },

        
        sendRequest: function (request) {
            request.send(this._socketWrapper, this.newRequestId());
        },

        
        newRequestId: function () {
            return this._nextRequestId++;
        },
        

        integrate: function (expr, symbol, callback) {            
            var request = new CS.IntegralRequest(expr, symbol);
            this.sendRequest(request);
        }

        
        /*solve: function (equations, symbols, callback) {
          var request = new CS.SolveRequest(expr, symbol);
          this.sendRequest(request);
        },*/
                
        
    });    
});
