define(['quack', 'server/exports.js'], function (q, Server) {
    var QueueItem = q.createClass({
        /**
         * Constructor
         */
        constructor: function (code, callback) {
            this.code = code;
            this.callback = callback;
            this.next = null;
        }
    });

    var spawn = require('child_process').spawn;

    return Server.SageWrapper = q.createClass({
        /**
         * Constructor
         */
        constructor: function () {
            this._ready = false;

            this._head = new QueueItem('dummy node');
            this._tail = this._head;

            var scope = this;
            var sage = spawn('/Applications/sage/sage', []);

            sage.stdout.on('data', function (data) {
                scope.onOutput(data);
            })

            sage.stderr.on('data', function (data) {
                scope.onError(data);
            })

            sage.on('close', function (code) {
                console.error("Sage closed!");
            });

            this._sage = sage;
            this.onOutput = this.defaultOnOutput;
        },
        
        
        /**
         * Run piece of code in sage, and invoke callback with output when done
         */
        run: function (code, callback) {
            var item = new QueueItem(code, callback);
            this.enqueue(item);
            this.runNext();
        },


        /**
         * Private. Run next command if ready
         */
        runNext: function () {
            var scope = this;
            if (this._ready) {
                var item = this.dequeue();
                if (item) {
                    this._ready = false;
                    this.write(item.code);
                    this.write('output'); //ask sage for output variable
                    scope.onOutput = function(output) {
                        console.log("Sage said: " + output);
                        if (item.callback) {
                            item.callback(false, output.toString().substring(12));
                        }
                        scope._ready = true;
                        scope.onOutput = scope.defaultOnOutput;
                        scope.onError = scope.defaultOnError;
                        scope.runNext();
                    }
                    
                    scope.onError = function(output) {
                        console.log("SAGE ERROR");
                        if (item.callback) {
                            item.callback(output.toString(), "");
                        }
                        scope._ready = true;
                        scope.onOutput = scope.defaultOnOutput;
                        scope.onError = scope.defaultOnError;
                        scope.runNext();

                    }
                }
            }
        },


        /**
         * Default on output.
         */
        defaultOnOutput: function(output) {
            console.log("unhandled sage output:");
            console.log(output.toString());
            this._ready = true;
        },


        /**
         * Default on error.
         */
        defaultOnError: function(output) {
            console.log("unhandled sage error:");
            console.log(output.toString());
            this._ready = true;
        },



        /**
         * Private. Write to sage.
         */
        write: function(data) {
            console.log("Writing to sage: " + data);
            this._sage.stdin.write(data + '\n');
        },


        /**
         * Enqueue an item
         */
        enqueue: function (item) {
            this._tail.next = item;
            this._tail = item;
        },

        
        /**
         * Dequeue an item
         */
        dequeue: function() {
            if (this._head.next) {
                var item = this._head.next;
                this._head.next = this._head.next.next;
                if (!this._head.next) {
                    this._tail = this._head;
                }
                return item;
            } else {
                return null;
            }
        },

        
        printQueue: function () {
            var current = this._head;
            console.log("---sage commandd queue---");
            while (current.next) {
                current = current.next;
                console.log(current.code);
            }
            console.log("--- end sage commandd queue---");
        }


        
    });
});
