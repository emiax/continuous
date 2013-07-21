define(['quack', 'kalkyl/format', 'kalkyl/format/simple/exports.js'], function(q, Format, Simple) {
    return Simple.Lexer = q.createClass({
        
        constructor: function (str) {
            this._tokenBuffer = [];
            this._lastToken = null;
            var lexer = this._lexer = new Format.Lexer(str);
            
            lexer.addPunctuator('(', 'leftParen');
            lexer.addPunctuator(')', 'rightParen');
            lexer.addPunctuator('[', 'leftBracket');
            lexer.addPunctuator(']', 'rightBracket');
            lexer.addPunctuator('{', 'leftCurly');
            lexer.addPunctuator('}', 'rightCurly');
            
            lexer.addPunctuator(',', 'comma');
            
            lexer.addPunctuator('+', 'plus');
            lexer.addPunctuator('-', 'minus');
            lexer.addPunctuator('*', 'asterisk');
            lexer.addPunctuator('/', 'slash');
            lexer.addPunctuator('^', 'caret');
            
            lexer.addReservedWord(['sin', 'SIN'], 'sin');
            lexer.addReservedWord(['cos', 'COS'], 'cos');
            lexer.addReservedWord(['tan', 'TAN'], 'tan');


            lexer.addReservedWord(['dot', 'DOT'], 'dot');
            lexer.addReservedWord(['cross', 'CROSS'], 'cross');
            lexer.addReservedWord(['arcsin', 'asin', 'ARCSIN', 'ASIN'], 'arcsin');
            lexer.addReservedWord(['arccos', 'acos', 'ARCCOS', 'ACOS'], 'arccos');
            lexer.addReservedWord(['arctan', 'atan', 'ARCTAN', 'ATAN'], 'arctan');
            lexer.addReservedWord(['sqrt', "SQRT"], 'sqrt');
            lexer.addReservedWord(['ln', "LN"], 'ln');
            lexer.addReservedWord(['lg', "LG"], 'lg');
        },
        

        /**
         * Get next token (to be called from parser)
         */
        next: function () {
            if (this._tokenBuffer.length === 0) {
                this.addToBuffer(this._lexer.next());
            }
            var token = this.nextFromBuffer();
            return token;
        },
        

        /**
         * Set or get source
         */
        source: function(str) {
            return this._lexer.source(str);
        },



        /**
         * Get errors of lexer
         */
        errors: function() {
            return this._lexer.errors();
        },


        /**
         * Set or get source
         */
        reset: function(str) {
            return this._lexer.reset();
        },


        /**
         * Add token to buffer and split names longer than one character
         */
        addToBuffer: function (token) {
            var scope = this;
            if (token.type() === 'name') {
                var strings = token.string().split("");
                var pos = token.position();
                strings.forEach(function (s) {
                    scope._tokenBuffer.push(new Format.Token('name', s, pos));
                    pos++;
                });
            } else {
                this._tokenBuffer.push(token);
            }
        }, 

        
        /**
         * Add implicit mutliplication to the first position in the buffer if neccessary.
         */
        implicitMultiplication: function() {
            var token = this._tokenBuffer[0];
            if (token) {
                switch (this._lastToken && this._lastToken.type()) {
                case 'rightParen':
                case 'rightBracket':
                case 'number':  
                case 'name':               
                    switch (token.type()) {
                    case 'leftParen':
                    case 'leftBracket':
                    case 'leftCurly':
                    case 'number':                        
                    case 'name':
                        this._tokenBuffer.unshift(new Format.Token('implicitMultiplication', '', this._lastToken.position()));
                        
                    }
                }
            }
        },


        /**
         * Replace whitespace token with implicit comma or remove whitespace, depending on input
         */
        implicitComma: function() {
            var token = this._tokenBuffer[0];
            if (token) {
                if (token.type() === 'whitespace') {
                    this._tokenBuffer.shift();

                    this.addToBuffer(this._lexer.next());
                    var next = this._tokenBuffer[0];
                    
                    switch (this._lastToken && this._lastToken.type()) {
                    case 'rightParen':
                    case 'rightBracket':
                    case 'rightCurly':
                    case 'name':
                    case 'number':
                        switch (next && next.type()) {
                        case 'leftParen':
                        case 'leftBracket':
                        case 'leftCurly':
                        case 'name':
                        case 'number': 
                        case 'cos': case 'sin': case 'tan':
                        case 'arccos': case 'arcsin': case 'arctan':
                        case 'ln': case 'lg': case 'sqrt':
                            this._tokenBuffer.unshift(
                                new Format.Token("implicitComma", token.string(), token.position())
                            );
                        }
                    }
                } else if (this._lastToken && this._lastToken.type() === 'rightBracket') {
                    if (token.type() === "leftBracket") {
                            this._tokenBuffer.unshift(
                                new Format.Token("implicitComma", token.string(), token.position())
                            );
                    }
                }
            }
        },

        

        /**
         * Get last token from buffer
         */
        nextFromBuffer: function () {
            this.implicitComma();
            this.implicitMultiplication();
            
            var token = this._lastToken = this._tokenBuffer.shift();
            return token;
        }
    });
});
