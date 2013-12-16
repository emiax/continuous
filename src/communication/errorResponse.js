define(['quack', 'kalkyl/format/simple', 'communication/exports.js', 'communication/response.js', 'errors'], function (q, SimpleFormat, Communication, Response, Errors) {

    return Communication.ErrorResponse = q.createClass(Response, {
        /**
         * Constructor.
         */
        constructor: function (error, errorDescription) {
            if (error instanceof Errors.Error) {
                this._errorCode = error.code();
                this._errorDescription = error.description();
            } else {
                this._errorCode = error;
                this._errorDescription = errorDescription;
            }
        },
        

        /**
         * json encode this response.
         */
        jsonEncode: function () {
            return {
                code: this._errorCode,
                description: this._errorDescription
            }
        },


        /**
         * Decode a response, STATIC METHOD that returns a Repsonse instance.
         */
        jsonDecode: function (obj) {
            var code;
            var description;
            if (obj) {
                if (obj.code) {
                    code = obj.code;
                    description = obj.description;
                    return new Communication.ErrorResponse(code, description);
                } else {
                    return new Communication.ErrorResponse(
                        new Errors.CommunicationError("Malformed server response")
                    );
                }
            }
        },
        

        /** 
         * Return the string associated with the request class/type.
         */
        responseType: function () {
            return "error";
        }
            
    });    
});
