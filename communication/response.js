define(['quack', 'communication/exports.js'], function (q, CS) {

    return CS.Response = q.createAbstractClass({
        /**
         * Constructor.
         */
        constructor: new q.AbstractMethod(),
        
        
        /**
         * Serialize this response
         */
        jsonEncode: new q.AbstractMethod(),


        /**
         * Decode the request json object, STATIC METHOD that returns a Response instance.
         * Input is object, not string!
         */
        jsonDecode: new q.AbstractMethod(),
        

        /** 
         * Return the string associated with the response class/type. e.g. "expression"
         */
        responseType: new q.AbstractMethod()
                            
    });    
});
