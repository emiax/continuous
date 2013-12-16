define(['quack', 'server/exports.js'], function (q, Server) {

    var spawn = require('child_process').spawn;
    var fs = require('fs');

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

    return Server.SageWrapper = q.createClass({
        /**
         * Constructor
         */
        constructor: function () {
            this._ready = false;
            this._head = new QueueItem('dummy node');
            this._tail = this._head;
            this._sage = this.spawn();
            this.onOutput = this.defaultOnOutput;
        },


        /**
         * Spawn process
         */
        spawn: function () {
            this._ready = false;

            var scope = this;
            var sage = spawn('/Applications/sage/sage', []);

            sage.stdout.on('data', function (data) {
                scope.onOutput(data);
            })

            sage.stderr.on('data', function (data) {
                scope.onError(data);
            })

            sage.on('close', function (code) {
                console.error("Sage closed! Respawning process!");
                scope._sage = scope.spawn();
            });

            return sage;
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

                    this.saveCode(item.code, function() {
                        // load code from saved file.
                        scope.write('%runfile "' + scope.fileName()  + '"');
                        // invoke funciton WITHOUT SEMICOLON which will result in printing the return value
                        scope.write(scope.functionName() + '()');
                        
//                        scope.write('1 + 1');

                        scope.onOutput = function(output) {

                            if (item.callback) {
                                console.log("SAGE SAYS: " + output.toString().substring(12));
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
                    })
                }
            }
        },


        fileName: function() {
            return 'continuous_command.sage';
        },
        
        
        functionName: function() {
            return 'continuous_command';
        },


        /**
         * Write code to file
         */
        saveCode: function (code, callback) {
            callback = callback || function() {};
            var lines = code.split('\n');
            var functionDefinition = "def " + this.functionName() + "():\n";
            lines.forEach(function (line) {
                functionDefinition += "\t" + line + "\n";
            });
            fs.writeFile(this.fileName(), functionDefinition, function(err) {
                if (err) {
                    console.log("SageWrapper could not write to file");
                } else {
                    callback();
                }
            });
        },


        /**
         * Default on output.
         */
        defaultOnOutput: function(output) {
            console.log("unhandled sage output:");
            console.log("----------------------");
            console.log(output.toString());
            console.log("----------------------");
            this._ready = true;
        },


        /**
         * Default on error.
         */
        defaultOnError: function(output) {
            console.log("unhandled sage ERROR:");
            console.log("----------------------");
            console.log(output.toString());
            console.log("----------------------");
            this._ready = true;
        },



        /**
         * Private. Write to sage.
         */
        write: function(data) {
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
            console.log("---end sage commandd queue---");
        }
    });
});
