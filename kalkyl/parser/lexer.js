define(['quack', './exports.js'], function(q, SP) {
    return SP.Lexer = q.createClass({
        /**
         * Constructor. Create a lexer that is set up to tokenize str.
         */
        constructor: function (str) {
            this._punctuators = {};
            this._reservedWords = {};
            this.source(str || "");
        },


        /**
         * Add punctuator
         */
        addPunctuator: function (string, typeName) {
            this._punctuators[string] = typeName;
        },


        /**
         * Add reserved word
         */
        addReservedWord: function (string, typeName) {
            var scope = this;
            if (string.forEach) {
                string.forEach(function (s) {
                    scope._reservedWords[s] = typeName;
                });
            } else {
                this._reservedWords[string] = typeName;
            }
        },


        /**
         * Return next token. to be called from parser.
         */
        next: function () {
            if (!this.done()) {
                var token;
                if (token = this.extractToken()) {
                    return token;
                } else {
                    // report character that caused error.
                    this.generateError("unexpected character");
                    this.get(); // ignore character.
                }
            } else {
                return new SP.Token('end', '', this.cursor());
            }
        },


        /**
         * Get lexer errors.
         */
        errors: function () {
            if (this._errors.length) {
                return this._errors;
            }
            return false;
        },

        
        /**
         * Generate lexer error. (meant for private use) 
         */
        generateError: function (type) {
            this._errors.push(new SP.ParseError(type, this.cursor(), null));
        },

            
        reset: function () {
            this._errors = [];
        },
            
        
        /**
         * Return punctuators
         */
        punctuators: function () {
            return this._punctuators;
        },

        
        /**
         * Return reserved words
         */
        reservedWords: function () {
            return this._reservedWords;
        },


        
        /****************************************
         * Set / get state
         ***************************************/

        /**
         * Set source
         */
        source: function (str) {
            if (str !== undefined) {
                this._source = str;
                this._cursor = 0;
                this._errors = [];
            }
            return this._source;
        },


        /**
         * Get or set cursor position
         */
        cursor: function (pos) {
            if (pos !== undefined) {
                this._cursor = pos;
            }
            return this._cursor;
        },


        /****************************************
         * Read from source
         ***************************************/


        /**
         * Read length letters from source without moving cursor
         */
        peek: function (length) {
            length = length || 1;
            if (this.source().length >= this.cursor() + length) {
                var a = this.source().substr(this.cursor(), length);
                return a;
            }
            return false;
        },



        /**
         * Read length letters from source and move cursor forward
         */
        get: function (length) {
            length = length || 1;
            if (this.source().length >= this.cursor() + length) {
                var prevPosition = this.cursor();
                this.cursor(prevPosition + length);
                return (this.source().substr(prevPosition, length));
            }
            return false;
        },



        /**
         * Match an exact string at cursor. Do not move cursor.
         */
        match: function (str, ignoreCase) {
            if (ignoreCase) {
                var peek = this.peek(str.length);
                return (peek && peek.toLowerCase() === str.toLowerCase());
            } else {
                return this.peek(str.length) === str;
            }

        },


        /**
         * Extract string from source at cursor if exact match.
         * Cursor is moved in case of success.
         */
        extract: function(str, ignoreCase) {
            if (this.match(str, ignoreCase)) {
                return this.get(str.length);
            }
            return false;
        },


        /**
         * Return true if done
         */
        done: function () {
            return this.cursor() === this._source.length;
        },

        /****************************************
         * Extract stuff
         ***************************************/


        /**
         * Extract next token from source
         */
        extractToken: function () {
            var token;

            if (token = this.extractPunctuator()) {
                return token;
            } else if (token = this.extractReservedWord()) {
                return token;
            } else if (token = this.extractName()) {
                return token;
            } else if (token = this.extractNumber()) {
                return token;
            } else if (token = this.extractWhitespace()) {
                return token;
            } else {
                return null;
            }
        },


        /**
         * Try to extract punctuator
         */
        extractPunctuator: function () {
            var scope = this;
            var punctuators = this.punctuators();
            var strings = Object.keys(punctuators);
            var position = scope.cursor();

            // For greedy behaviour, try to extract the longest strings first
            strings.sort(function(a, b) {
                return b.length - a.length;
            });

            var token = null;
            strings.forEach(function (s) {
                if (!token) {
                    var type = punctuators[s];
                    var extracted = scope.extract(s);
                    if (extracted) {
                        token = new SP.Token(type, extracted, position);
                    }
                }
            });
            return token;
        },


        /**
         * Try to extract reserved word.
         */
        extractReservedWord: function () {
            var scope = this;
            var reservedWords = this.reservedWords();
            var strings = Object.keys(reservedWords);
            var position = scope.cursor();

            var token = null;
            strings.forEach(function (s) {
                if (!token) {
                    var type = reservedWords[s];
                    var match = scope.match(s);
                    if (!match) return;
                    var after = scope._source.charAt(scope.cursor() + s.length);
                    if (match && !scope.isLetter(after)) {
                        token = new SP.Token(type, scope.get(s.length), position);
                    }
                }
            });
            return token;

        },


        /**
         * Try to extract name
         */
        extractName: function () {
            var str = "";
            var position = this.cursor();
            while (this.isLetter(this.peek())) {
                str += this.get();
            }
            if (str === "") {
                return null;
            } else {
                return new SP.Token('name', str, position);
            }
        },


        /**
         * Try to extract number
         */
        extractNumber: function () {
            var current;
            var str = "";
            var decimalState = false;
            var position = this.cursor();

            while (true) {
                current = this.peek();
                if (!current) {
                    break;
                }
                if (this.isDecimalPoint(current)) {
                    if (decimalState) return null;
                    decimalState = true;
                    str += this.get();
                } else if (this.isDigit(current)) {
                    str += this.get();
                } else {
                    break;
                }
            }
            if (str === "") {
                return null;
            } else {
                return new SP.Token('number', str, position);
            }
        },


        /**
         * Ignore whitespaces
         */
        extractWhitespace: function () {
            var str = "";
            var position = this.cursor();
            while (this.isWhitespace(this.peek())) {
                str += this.get();
            }
            if (str === "") {
                return null;
            } else {
                return new SP.Token('whitespace', str, position);
            }
        },


        /************************************************
         * Character categorization
         ************************************************/

        /**
         * Is letter?
         */
        isLetter: function (character) {
            if (!character) { return false; }
            character = character.toLowerCase();
            return (character >= 'a' && character <= 'z');
        },


        /**
         * Is digit?
         */
        isDigit: function (character) {
            return (character && character >= '0' && character <= '9');
        },


        /**
         * Is decimal point
         */
        isDecimalPoint: function (character) {
            return character === '.';
        },


        /**
         * Is whitespace?
         */
        isWhitespace: function (character) {
            return character === ' ' || character === '\n' || character === '\t';
        }


    });
});
