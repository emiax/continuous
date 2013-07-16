define(['../lib/quack.js', './exports.js'], function (q, CS) {

    return CS.Request = q.createAbstractClass({
        /**
         * Constructor.
         */
        constructor: new q.AbstractMethod(),
        
        
        /**
         * Serialize this request
         */
        serialize: new q.AbstractMethod(),


        /**
         * Unserialize the request, STATIC METHOD that returns a Request instance.
         */
        unserialize: new q.AbstractMethod(),
        

        /** 
         * Return the string associated with the request class/type. e.g. "integral"
         */
        requestType: new q.AbstractMethod(),
            

        /**
         * Send request via socketWrapper using requestId
         */
        send: function(socketWrapper, id) {
            socketWrapper.write(JSON.stringify({
                id: id,
                type: this.requestType(),
                payload: this.serialize()
            }));
        },
        

        
    });    
});
