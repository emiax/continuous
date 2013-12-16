define(['quack', 'kalkyl/format/simple', 'communication/exports.js', 'communication/response.js'], function (q, SimpleFormat, Communication, Response) {

    return Communication.ExpressionResponse = q.createClass(Response, {
        /**
         * Constructor.
         */
        constructor: function (expr) {
            this._expr = expr;
        },
        

        /**
         * Return expression.
         */        
        expression: function () {
            return this._expr;
        },
        

        /**
         * json encode this response.
         */
        jsonEncode: function () {
            return {
                expr: this._expr.simpleFormat()
            }
        },


        /**
         * Decode a response, STATIC METHOD that returns a Repsonse instance.
         */
        jsonDecode: function (obj) {
            var expr, symbol;
            var simpleParser = new SimpleFormat.Parser();
            if (obj) {
                if (obj.expr) {
                    console.log(obj.expr);
                    expr = simpleParser.parse(obj.expr);
                    console.log(expr);
                } else {
                    return null;
                }
            }
            return new Communication.ExpressionResponse(expr);
        },
        

        /** 
         * Return the string associated with the request class/type.
         */
        responseType: function () {
            return "expression";
        }
            
    });    
});
