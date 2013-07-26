define(['quack', 'communication', 'communication/client/exports.js'], function (q, Communication, Client) {
    return Client.ResponseParser = q.createClass({
        /**
         * Constructor.
         */
        constructor: function () {
            this._parsedId = -1;
        },

        
        /**
         * Parse response.
         */
        parse: function (responseJson) {
            var jsonObject = JSON.parse(responseJson);
            if (this.validateJsonObject(jsonObject)) {
                var ResponseClass = this.getResponseClass(jsonObject.type); 
                if (ResponseClass) {
                    var response = ResponseClass.jsonDecode(jsonObject.payload);
                    this._parsedId = jsonObject.id;
                    return response;
                } else {
                    console.error("'" + jsonObject.type + "' is not a known ResponseClass type.");
                }
            }
            return null;
        },


        /**
         * Validate json object.
         */
        validateJsonObject: function(jsonObject) {
            return (typeof jsonObject === 'object' &&
                    typeof jsonObject.type === 'string' &&
                    typeof jsonObject.payload === 'object' &&
                    typeof jsonObject.id === 'number');
        },


        /**
         * Return the id of the latest parsed response.
         */
        parsedId: function () {
            return this._parsedId;
        },


        getResponseClass: function (responseType) {
            switch (responseType) {
            case 'expression' :
                return Communication.ExpressionResponse;
            case 'error' :
                return Communication.ErrorResponse;
            default: return null;
            }
        }
        
    });
});
