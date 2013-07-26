requirejs.config({
    baseUrl: '/continuous/',
    paths: {
        // List of all Continuous packages
        'quack':                 './lib/quack',
        'jquery':                './lib/jquery-2.0.3.min',
        'kalkyl':                './kalkyl/package',
        'kalkyl/format':         './kalkyl/format/package',
        'kalkyl/format/simple':  './kalkyl/format/simple/package',
        'kalkyl/format/sage':    './kalkyl/format/sage/package',
        'communication':         './communication/package',
        'communication/client':  './communication/client/package',
        'mathgl':                './mathgl/package',
        'errors':                './errors/package'
    }
});


requirejs(['jquery', 'kalkyl', 'kalkyl/format/simple', 'kalkyl/format/sage', 'communication', 'communication/client'], function($, Kalkyl, SimpleFormat, SageFormat, Communication, Client) {
              
    $('#input').change(function () {
        parse($(this).val());
    });
    
    $('#input').keyup(function () {
        parse($(this).val());
    });

    var port = 8080;


    var connection = new Client.Connection('ws://localhost:' + port);
    var parser = new SimpleFormat.Parser();
/*    var expr = parser.parse('x + x');
    connection.request(new Communication.EvaluateRequest(expr), function (response) {
        console.log(response.expression());
    });*/

    





    function escape(input) {
        return $('<div/>').text(input).html();
    }

    function parse(input) {
        var expr = parser.parse(input);
        var errors;
        if (errors = parser.errors()) {
            var feedback = "";
            var positions = [];

            errors.sort(function(a, b) {
                return a.position() - b.position();
            });

            var lastPosition = 0;
            
            console.log(errors);
            errors.forEach(function (e) {
                var position = e.position()
                if (position < lastPosition) {
                    return; //continue
                }

                feedback += escape(input.substring(lastPosition, position));
                lastPosition = position;
                var str;
                
                if (str = e.token() && e.token().string()) {
                    if (str.length) {
                        console.log(str.length);
                        feedback += '<span class="error">' + input.substr(position, str.length).replace(/ /gi, '_') + '</span>';
                        lastPosition += str.length;
                    } else {
                        feedback += '<span class="error">_</span>';
                    }
                } else {
                    if (position < input.length) {
                        var character = input.substr(position, 1);
                        lastPosition++;
                        feedback += '<span class="error">' + character + '</span>';
                    } else {
                        feedback += '<span class="error">_</span>';
                    }
                }
            });
            feedback += escape(input.substr(lastPosition));
            $('#console').html(feedback)
        } else {
            if (expr) {
                var sf = escape(expr.simpleFormat());
                var ev = escape(expr.evaluated().simplified().simpleFormat());
//                console.log(SageFormat);

  
                // THIS IS HOW WE LIKE IT. CLEAN AND SIMPLE.              
                var req = new Communication.EvaluateRequest(expr);
                connection.request(req, function(response) {
                    
                    var html = $('#console').html()
                    if (response instanceof Communication.ExpressionResponse) {
                        console.log(response.expression());
                        $('#console').html(html + response.expression().simpleFormat() + "<br/>");
                    } else if (response instanceof Communication.ErrorResponse) {
                        $('#console').html(html + "<br>Could not evaluate!");
                    } else {
                        console.log(response);
                    }
                });

/*                server.evaluate(expr, function({
                    console.log(err);
                    console.log(data);
                });
*/
                //var sageFormatter = new SageFormat.Formatter();
                //var sageReady = sageFormatter.format(expr.evaluated().simplified());





                $('#console').html("<p>" + sf + "</p><p>" + ev + "</p>");
            } else {
                $('#console').html("expression is " + expr + " but no no errors were generated.")                
            }
        }
    }

    var defaultString = 'sin(x) * cos(0)';

    $('#input').val(defaultString);
    parse(defaultString);
    $('#input').focus();


});
