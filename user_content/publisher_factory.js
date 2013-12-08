define([], function () {
    
    pubFactory = {

        publisher: {
            subscribers: [],
            subscribe: function (fn) {
                this.subscribers.push(fn);
            },
            unsubscribe: function (fn) {
                var i = this.subscribers.indexOf(fn);
                this.subscribers.splice(i, 1);
            },
            set: function (key, val) {
                if(!this.hasOwnProperty(key)) {
                    throw 'publisher has no property "' + key + '"';
                }

                this[key] = val;
                this.publish(key);
            },
            publish: function (key) {
                for (var i = 0; i < this.subscribers.length; ++i) {
                    this.subscribers[i](key);
                }
            }
        },

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