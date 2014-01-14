define([], function () {
    
    pubFactory = {

        publisher: {
            subscribers: [],

            /**
             * Allows callbacks to subscribe to this publisher
             * @param  {Function} fn [function to notify]
             */
            subscribe: function (fn) {
                this.subscribers.push(fn);
            },

            /**
             * Allows a function to unregister callback upon publish 
             * @param  {Function} fn [function to remove]
             */
            unsubscribe: function (fn) {
                var i = this.subscribers.indexOf(fn);
                this.subscribers.splice(i, 1);
            },

            /**
             * Use this set function to trigger a publish
             * @param {string} key [attribute to augment]
             * @param {Any} val [new value to assign to attribute]
             */
            set: function (key, val) {
                if(!this.hasOwnProperty(key)) {
                    throw 'publisher has no property "' + key + '"';
                    console.log(key + ": " + val);
                }

                this[key] = val;
                this.publish(key);
            },

            /**
             * Invokes subscribed functions upon state change 
             * @param  {string} key [augmented attribute]
             */
            publish: function (key) {
                for (var i = 0; i < this.subscribers.length; ++i) {
                    this.subscribers[i](key);
                }
            }
        },

        /**
         * Educates an object in the art of publishing
         * @param  {Object} o [object to make publisher]
         */
        makePublisher: function (o) {
            
            var publisher = this.publisher;
            keys = Object.keys(publisher);
            keys.forEach (function (key) {
                if(typeof publisher[key] === 'function') {
                    o[key] = publisher[key];
                }
            });

            o.subscribers = [];
            o.isObservable = true;
        }
    };

    return pubFactory;
});