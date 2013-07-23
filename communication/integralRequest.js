define(['quack', 'kalkyl', 'communication/exports.js', 'communication/request.js'], function (q, KL, CS, Request) {

    return CS.IntegralRequest = q.createClass(Request, {
        /**
         * Constructor.
         */
        constructor: function (expr, symbol) {
            this._expr = expr;
            this._symbol = symbol;
        },
        
        
        /**
         * Serialize this request
         */
        jsonEncode: function () {
            return JSON.stringify({
                expr: this._expr.simpleFormat(),
                symbol: this._symbol
            });
        },


        /**
         * Unserialize the request, STATIC METHOD that returns a Request instance.
         */
        jsonDecode: function (str) {
            var obj = JSON.parse(str);
            var expr, symbol;
            if (obj) {
                if (obj.expr) {
                    expr = KL.parse(obj.expr);
                } else {
                    return null;
                }
                if (obj.symbol) {
                    symbol = obj.symbol;
                } else {
                    return null;
                }
            }
            return new CS.IntegralRequest(expr, symbol);
        },
        

        /** 
         * Return the string associated with the request class/type. e.g. "integral"
         */
        requestType: function () {
            return "integral";
        }
            
    });    
});
