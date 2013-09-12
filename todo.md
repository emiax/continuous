Continuous Todo
===============

Quack
-----
implementsInterface does not yet work in all cases. FIX THIS!


Server side
-----------
Handling sockets, forwarding requests to sage


Kalkyl + Backend
----------------
    
    implement arcsin, arccos, arctan
    implement ln, log, sqrt    
    impleement accessor for vectors and matrices (.x, .y, .z) or [0][1] and so on
    Introduce a new format. Simple format should still break ab into a*b, but the new format needs multichar variable names


Sage formatter
     
Simple formatter
     remove unnessecary parentheses.
 

Sage parser
Simple parser

    Parser bugs
           "sin ab" should probably mean sin(ab), not sin sin(a)*b
           
    ability to parse function calls?
    handle semantic errors. (include "creator" in expression constructors, to through errors to?) (try catch?) (i dunno?)

    constants
        pi  
        e
        and so on???
     

3D Engine
---------
    Allow for both primitives and Kalkyl trees as variables in MathGL.Scopes.
    Find out when shaders need recompilation
    Remove stuff and Reset stuff.
    
    Camera



Blog posts
==========





Derivatives in kalkyl expression trees?

b = 2a
c = db/da.

c = d(2a) / d(a) // should be no problem.

---------

a = 2b;

chain rule problems?
f(g(x))


f(g) = 2g^2
g(x) = 2x^2

a = dfdx ?


a = d(2g^2)/dx
a = d(2*(2x^2)^2)/dx // no problems

b = dfdg ?

b = d(2g^2)/dg => apply rule => 4g => 4*2*x // no problems?


// THEN WHY NOT?


f(u, v) = u^2
g(u) = 2u

// still just differentiation with respect to one variable, but the variable is a function that does not live in the same branch.
// this is not possible because g is not defined in the branch. SHOULD BE ALLRIGHT??

dfdg = d(u^2)/d(2u) //now we need some clever variababitaa








Crashes to fix
==============
received message (socket wrapper): 
	{"id":185,"type":"evaluate","payload":{"expr":"(\n[1, 0;\n 0, 1]\n) * ([2, 3]')"}}
7 29
27 29

/Users/Emil/Documents/Webb/continuous/server/evaluator.js:27
            var variableSymbols = expr.listVariables();