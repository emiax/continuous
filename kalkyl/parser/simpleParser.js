define(['quack', './exports.js' , 'kalkyl/package'], function(q, SP, KL) {
    return SP.SimpleParser = q.createClass({
        
        constructor: function () {
            this._parser = null;
        },
        

        /**
         * Parse str to an Kalkyl expression.
         */
        parse: function (str) {
            // initialize the parser lazily!
            var parser = this.parser();

            parser.source(str);
            var expression = parser.expression();
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
                rule = parser.rule(tokenType, new SP.ParseRule({
                    nud: function (parser, token) {
                        console.log("df");
                        parser.generateError("unexpected token", token);                        
                    }, 
                    led: function (parser, token) {
                        console.log("dfsdf");
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
                    return null;
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
                if (parser.errors() || !right) {
                    return null;
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
                var parser = this._parser = new SP.Parser();

                parser.lexer(new SP.SimpleLexer());

                parser.rule('leftParen', new SP.ParseRule({
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


                parser.rule('leftBracket', new SP.ParseRule({
                    nud: function (parser, token) {
                        var expressions = [];
                        var dim = null;
                        var separator = null;
                        
                        do {
                            var expression = parser.expression();
                            if (!expression) {
                                return;
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

                        if (dim.identicalTo(new KL.Vector2(1, 1))) {
                            var matrix = new KL.MatrixNM([expressions]);
                            return matrix.transposed().toSpecificDim();
                        } else {
                            // expresisons are now row vectors
                            var elements = [];
                            expressions.forEach(function(r) {
                                var row = [];
                                r.forEachElement(function (e) {
                                    row.push(e);
                                });
                                elements.push(row);
                            });
                            var matrix = new KL.MatrixNM(elements);
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

                this.infix('plus', 10, KL.Plus);
                this.infix('minus', 10, KL.Minus);
                this.infix('asterisk', 20, KL.Multiplication);
                this.infix('implicitMultiplication', 20, KL.Multiplication);
                this.infix('slash', 20, KL.Division);

                this.infix('cross', 20, KL.Cross);
                this.infix('dot', 20, KL.Dot);

                this.infix('caret', 30, KL.Power);

                this.prefix('plus', KL.UnaryPlus);
                this.prefix('minus', KL.UnaryMinus);
                this.prefix('sqrt', KL.Sqrt);

                this.prefix('sin', KL.Sin);
                this.prefix('cos', KL.Cos);
                this.prefix('tan', KL.Tan);

                this.prefix('arccos', KL.Arccos);
                this.prefix('arcsin', KL.Arcsin);
                this.prefix('arctan', KL.Arctan);

                this.prefix('ln', KL.Ln);
                this.prefix('lg', KL.Lg);


                parser.rule('number', new SP.ParseRule({
                    nud: function (parser, token) {
                        return new KL.Constant(token.string());
                    },
                    led: function (parser, token, left) {
                        parser.generateError("unexpected token", token);
                    },
                    lb: 0
                }));

                parser.rule('name', new SP.ParseRule({
                    nud: function (parser, token) {
                        return new KL.Variable(token.string());
                    },
                    led: function (parser, token, left) {
                        parser.generateError("unexpected token", token);
                    },
                    lbp: 0
                }));


                /**
                parser.rule('plus', new SP.ParseRule({
                    nud: function (parser, token) {
                        return parser.expression(100);
                    },
                    led: function (parser, token, left) {
                        return new KL.Plus(left, parser.expression(10));
                    },
                    lbp: 10
                }));

                parser.rule('minus', new SP.ParseRule({
                    nud: function (parser, token) {
                        return new KL.UnaryMinus(parser.expression(100));
                    },
                    led: function (parser, token, left) {
                        return new KL.Minus(left, parser.expression(10));
                    },
                    lbp: 10
                }));*/
/*
                parser.rule('asterisk', new SP.ParseRule({
                    nud: function (parser, token) {},
                    led: function (parser, token, left) {
                        console.log(left);
                        var right = parser.expression(20);
                        console.log(right);
                        return new KL.Multiplication(left, right);
                    },
                    lbp: 20
                }));

                parser.rule('slash', new SP.ParseRule({
                    nud: function (parser, token) {},
                    led: function (parser, token, left) {
                        return new KL.Division(left, parser.expression(20));
                    },
                    lbp: 20
                }));
*/


            }
            return this._parser;
        }
    });

});
