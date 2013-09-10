define(['quack', 'kalkyl', 'kalkyl/format', 'kalkyl/format/sage/exports.js'], function(q, Kalkyl, Format, Sage) {
    return Sage.Parser = q.createClass({
        
        constructor: function () {
            this._parser = null;
        },
        

        /**
         * Parse str to an Kalkyl expression.
         */
        parse: function (str) {
            // initialize the parser lazily!
            var parser = this.parser();
            var expression = null;
            parser.source(str);
            if (str) {
                expression = parser.expression();
            } else {
                parser.generateError("nothing to parse");
            }
            if (parser.next().type() === 'end') {
                return expression;
            } else {
                parser.generateError("parser is done but data remains");
                return expression; // return parsed expression anyway.
            }
        },


        errors: function () {
            if (this._parser) {
                return this._parser.errors();
            }
        },


        /****************************************
         * Helper methods
         ***************************************/

        /**
         * Return ParseRule for tokenType.
         * Create a rule for tokenType if there is no rule.
         */
        rule: function(tokenType) {
            var parser = this.parser();
            if (!(rule = parser.rule(tokenType))) {
                rule = parser.rule(tokenType, new Format.ParseRule({
                    nud: function (parser, token) {
                        parser.generateError("unexpected token", token);                        
                    }, 
                    led: function (parser, token) {
                        parser.generateError("unexpected token", token);
                    },
                    lbp: 0
                }));
            }
            return rule;
        },


        /**
         * Add prefix operator to grammar
         */
        prefix: function (tokenType, UnaryOperator) {
            var rule = this.rule(tokenType);
            rule.nud(function (parser, token) {
                if (parser.errors()) {
                    return null;
                }
                var arg = parser.expression(100);
                if (arg) {
                    return new UnaryOperator(arg);
                } else {
                    parser.generateError("unexpected token");
                }
            });
        },


        /**
         * Add prefix operator to grammar
         */
        infix: function (tokenType, bp, BinaryOperator) {
            var rule = this.rule(tokenType);
            rule.led(function (parser, token, left) {
                var right = parser.expression(bp);
                if (parser.errors()) {
                    return null;
                } else if (!right) {
                    parser.generateError("unexpected token");
                } else {
                    return new BinaryOperator(left, right);
                }
            });
            rule.lbp(bp);
        },


        /****************************************
         * Get parser
         ***************************************/
        
        /**
         * Get parser
         */
        parser: function () {
            if (!this._parser) {
                var parser = this._parser = new Format.Parser();
                parser.lexer(new Sage.Lexer());

                parser.rule('leftParen', new Format.ParseRule({
                    nud: function (parser, token) {
                        var expr = parser.expression();
                        if (!parser.advance('rightParen')) {
                            parser.generateError("unexpected token");
                        }
                        return expr;
                    },
                    led: function (parser, token, left) {
                        // function call. not in simple language?
                        parser.generateError("unexpected token", token);
                    },
                    lbp: 150
                }));


                parser.rule('leftBracket', new Format.ParseRule({
                    nud: function (parser, token) {
                        var expressions = [];
                        var dim = null;
                        var separator = null;
                        
                        do {
                            var expression = parser.expression();
                            if (!expression) {
                                parser.generateError("expected vector content");
                                return null;
                            }

                            if (!dim) {
                                dim = expression.dim();
                            }

                            if (expression.dim().identicalTo(dim)) {
                                expressions.push(expression);
                            } else {
                                parser.generateError("matrix dimensions. " +
                                                     dim.simpleFormat() + " vs " +
                                                     expression.dim().simpleFormat(), token);
                                return null;
                            }
                            
                            var newSeparator = parser.current().type();
                            if (separator && newSeparator != 'rightBracket' && separator !== newSeparator) {
                                parser.generateError('expected ' + separator);
                            }
                            separator = newSeparator === 'comma' ? 'comma' : 'implicitComma';

                        } while (parser.advance(separator));
                        
                        if (!parser.advance('rightBracket')) {
                            parser.generateError("expected rightBracket or comma");
                        }

                        if (dim.identicalTo(new Kalkyl.Vector2(1, 1))) {
                            var matrix = new Kalkyl.MatrixNM([expressions]);
                            return matrix.transposed().toSpecificDim();
                        } else {
                            console.log(dim);
                            // expresisons are now row vectors
                            var elements = [];
                            expressions.forEach(function(r) {
                                var row = [];
                                r.forEachElement(function (e) {
                                    row.push(e);
                                });
                                elements.push(row);
                            });

                            console.log(elements);
                            var matrix = new Kalkyl.MatrixNM(elements);
                            return matrix.toSpecificDim();
                        }
                    },
                    led: function (parser, token, left) {
                        parser.generateError("unexpected token", token);
                        // [ in left context does not mean anything
                    },
                    lbp: 150
                }));


                this.rule('rightParen');
                this.rule('rightBracket');
                this.rule('comma');
                this.rule('implicitComma');

                this.infix('plus', 10, Kalkyl.Plus);
                this.infix('minus', 10, Kalkyl.Minus);
                this.infix('asterisk', 20, Kalkyl.Multiplication);
                this.infix('implicitMultiplication', 20, Kalkyl.Multiplication);
                this.infix('slash', 20, Kalkyl.Division);

                this.infix('cross', 20, Kalkyl.Cross);
                this.infix('dot', 20, Kalkyl.Dot);

                this.infix('caret', 30, Kalkyl.Power);

                this.prefix('plus', Kalkyl.UnaryPlus);
                this.prefix('minus', Kalkyl.UnaryMinus);
                this.prefix('sqrt', Kalkyl.Sqrt);

                this.prefix('sin', Kalkyl.Sin);
                this.prefix('cos', Kalkyl.Cos);
                this.prefix('tan', Kalkyl.Tan);

                this.prefix('arccos', Kalkyl.Arccos);
                this.prefix('arcsin', Kalkyl.Arcsin);
                this.prefix('arctan', Kalkyl.Arctan);

                this.prefix('ln', Kalkyl.Ln);
                this.prefix('lg', Kalkyl.Lg);


                parser.rule('number', new Format.ParseRule({
                    nud: function (parser, token) {
                        return new Kalkyl.Number(token.string());
                    },
                    led: function (parser, token, left) {
                        parser.generateError("unexpected token", token);
                    },
                    lb: 0
                }));

                parser.rule('name', new Format.ParseRule({
                    nud: function (parser, token) {
                        return new Kalkyl.Variable(token.string());
                    },
                    led: function (parser, token, left) {
                        parser.generateError("unexpected token", token);
                    },
                    lbp: 0
                }));
            }
            return this._parser;
        }
    });

});
