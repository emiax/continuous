define(['quack', 'communication/server/exports.js', 'communication'], function (q, S, CS) {
    
    return S.RequestParser = q.createClass({
        /**
         * Constructor.
         */
        constructor: function () {},


        /**
         * Parse request json.
         */
        parse: function (requestJson) {
            var jsonObject = JSON.parse(requestJson);
            if (this.validateJsonObject(jsonObject)) {
                var RequestClass = this.getRequestClass(jsonObject.type);
                if (RequestClass) {
                    var request = RequestClass.jsonDecode(jsonObject.payload);
                    this._parsedId = jsonObject.id;
                    return request;
                } else {
                    console.error("'" + jsonObject.type + "' is not a known RequestClass type.");
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
         * Return request class.
         */
        getRequestClass: function(type) {
            switch (type) {
            case 'integral':
                return CS.IntegralRequest;
            case 'evaluate':
                return CS.EvaluateRequest;
            case 'solve' :
                return CS.SolveRequest;
            default: return null;
            }
        },
       

        /**
         * Return the id of the latest parsed request.
         */
        parsedId: function () {
            return this._parsedId;
        }
    });


});
