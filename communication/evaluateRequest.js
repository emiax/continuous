define(['quack', 'kalkyl/format/simple', 'communication/exports.js', 'communication/request.js'], function (q, SimpleFormat, Communication, Request) {

    return Communication.EvaluateRequest = q.createClass(Request, {
        /**
         * Constructor.
         */
        constructor: function (expr) {
            this._expr = expr;
        },
        
        
        expression: function () {
            return this._expr;
        },


        /**
         * Serialize this request
         */
        jsonEncode: function () {
            return {
                expr: this._expr.simpleFormat()
            }
        },


        /**
         * Decode a request, STATIC METHOD that returns a Request instance.
         */
        jsonDecode: function (obj) {
            var expr, symbol;
            var simpleParser = new SimpleFormat.Parser();
            if (obj) {
                if (obj.expr) {
                    console.log(obj.expr);
                    expr = simpleParser.parse(obj.expr); 
                } else {
                    return null;
                }
            }
            return new Communication.EvaluateRequest(expr);
        },
        

        /** 
         * Return the string associated with the request class/type.
         */
        requestType: function () {
            return "evaluate";
        }
            
    });    
});
