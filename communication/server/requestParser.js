define(['quack', './exports.js', '../package.js'], function (q, S, CS) {
    
    return S.RequestParser = q.createClass({
        
        constructor: function () {
            
        },

        parse: function (requestJson) {
            var jsonObject = JSON.parse(requestJson);
            console.log(jsonObject);
            if (this.validateJsonObject(jsonObject)) {
                var RequestClass = this.getRequestClass(jsonObject.type);
                if (RequestClass) {
                    console.log(RequestClass.__proto__);
                    var payload = RequestClass.unserialize(jsonObject.payload);
                    var id = jsonObject.id;
                    var request = new RequestClass(payload);
                    return request;
                } else {
                    console.error("'" + jsonObject.type + "' is not a known RequestClass type.");
                }
            }
            return null;
        },

        validateJsonObject: function(jsonObject) {
            return (typeof jsonObject === 'object' &&
                    typeof jsonObject.type === 'string' &&
                    typeof jsonObject.payload === 'string' &&
                    typeof jsonObject.id === 'number');
        },
        
        getRequestClass: function(type) {
            switch (type) {
            case 'integral':
                return CS.IntegralRequest;
            case 'solve' :
                return CS.SolveRequest;
            default: return null;
            }
        }
       



    });


});
