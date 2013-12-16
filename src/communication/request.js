define(['quack', 'communication/exports.js'], function (q, CS) {

    return CS.Request = q.createAbstractClass({
        /**
         * Constructor.
         */
        constructor: new q.AbstractMethod(),
        
        
        /**
         * Serialize this request
         */
        jsonEncode: new q.AbstractMethod(),


        /**
         * Decode the request json object, STATIC METHOD that returns a Request instance.
         * Input is object, not string!
         */
        jsonDecode: new q.AbstractMethod(),
        

        /** 
         * Return the string associated with the request class/type. e.g. "integral"
         */
        requestType: new q.AbstractMethod()
                            
    });    
});
