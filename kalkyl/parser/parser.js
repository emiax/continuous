/*
 * lbp: left binding power
 * rbp: right binding power
 * led: left denotation
 *   (funciton that returns expression if token is part of a construct (e.g. binary operator))
 * nud: null denotation
 *   (function that returns if token appears in the beginning of a construct (e.g. unary operator))
 */


define(['quack', './exports.js'], function(q, SP) {
    return SP.Parser = q.createClass({
        /**
         * Constructor.
         */
        constructor: function (lexer) {
            this._rules = {};
            this.reset();
            this.lexer(lexer);
            this.rule('end', new SP.ParseRule());
        },
        
        
        /**
         * Set source string.
         */
        source: function (str) {
            this.lexer().source(str);
            this.reset();
        },


        /**
         * Assign a ParseRule to a tokenType (string).
         */
        rule: function (tokenType, rule) {
            if (rule instanceof SP.ParseRule) {
                this._rules[tokenType] = rule;
            }
            return this._rules[tokenType];
        },


        /**
         * Parse data from lexer.
         */
        expression: function (rbp) {
            rbp = rbp || 0;
            
            var t = this.current();
            this.next();

            var left = (this.nud(t))(this, t);

            while (rbp < this.lbp(this.current())) {
                t = this.current();
                this.next();
                left = (this.led(t))(this, t, left);
                //console.log(left.simpleFormat());
            }

            return left;
        },


        /**
         * Return array of errors if any. Otherwise return false.
         */
        errors: function () {
            var lexerErrors = this.lexer().errors();
            var errors = [];
            if (lexerErrors) {
                errors = errors.concat(lexerErrors);
            }
            errors = errors.concat(this._errors);
            if (errors.length) {
                return errors;
            } else {
                return false;
            }
        },

        
        /**
         * Return null denotaiton function of token.
         */
        nud: function (token) {
            var rule;
            if (rule = this.rule(token.type())) {
                return rule.nud();
            }
            console.error("no rule for token '" + token.type() +  "' not specified");
            return null;
        },


        /**
         * Return left denotaiton function of token.
         */
        led: function (token) {
            var rule;
            if (rule = this.rule(token.type())) {
                return rule.led();
            }
            console.error("no rule for token '" + token.type() +  "' not specified");
            return null;
        },


        /**
         * Return left binding power of token.
         */        
        lbp: function (token) {
            var rule;
            if (!token) {
                console.error("lbp without token");
            }
            if (rule = this._rules[token.type()]) {
                return rule.lbp();
            }
            console.error("no rule for token '" + token.type() +  "' not specified");
            return null;
        },


        /**
         * Return current token.
         */
        current: function () {
            if (!this._current) {
                this.next();
            }
            return this._current;
        },


        /**
         * Return next token, move cursor.
         */
        next: function () {
            var lexer = this.lexer();
            if (lexer) {
                return this._current = lexer.next();
            } else {
                console.error("Parser has no lexer assigned");
            }
        },

        
        /**
         * Return the next token, only if current token has a specific type.
         */
        advance: function (type) {
            if (this.current().type() === type) {
                return this.next();
            } 
            return null;
        },

       
        /**
         * Reset.
         */
        reset: function () {
            var lexer;
            this._current = null;
            this._errors = [];
            if (lexer = this.lexer()) {
                lexer.reset();
            }
        },


        /**
         * Get or Set source lexer.
         */
        lexer: function (lexer) {
            if (lexer !== undefined) {
                this._lexer = lexer;
                this.reset();
            }
            return this._lexer;
        },


        /**
         * Generate parse error. (meant for private use)
         */
        generateError: function (type, token) {
            if (!token) {
                token = this.current();
            }
            this._errors.push(new SP.ParseError(type, token.position(), token));
        }

        
    });
});
