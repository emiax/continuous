In progress, autumn 2013
==========================

This document is a collection of things that may or may not be important to the progress of Continuous during autumn 2013. 

This is also an exercise to see if Jonas Zeitler has understood anything of Continuous.

Math.GL engine development
--------------------------

Math.GL is the core graphics engine producing the visualizations in Continuous. There are two, possibly three, major parts to develop.

### Scene graph module
This part of the engine is responsible for building a tree structure from mathematical expressions.
The scene graph consists of:

* A root node - represents the *Scope*, this carries a mathematical expression (eg. *f = 3sin(5x)cos(x)*) to be rendered.
* Surface nodes - surface definitions, such as boundaries.
* Constraint nodes - variable relations, eg. *change of basis*. These are used to jack in functions to augment child nodes.
* (more?)

![scene graph tree][1]

*Scene graph tree example*

**TODO:** ?

### Appearance module
Appearance nodes are used to specify the style of a visualization. This is the part of Math.gl that specifies how shaders should be compiled.

**TODO:** Architecture of the appearance module.

### Visualization module
Once structures for surface(s) and appearance are built, this module will determine the behaviour in a visualization.

This module could be useful when building an interactive visualization editor. Implementation should be carried out with decoupling in mind.

**TODO:** Architecture of the visualization module.

Building the GUI
--------------------------

**TODO:**

* Research client frameworks. Or just select one (pref. angular?) and roll with it.
* Research use cases.
* Produce GUI mockups
	- Have a mockup night at Salongerna!
* Produce a style guide for Continuous.

Pedagogic content
--------------------------
This is one of the selling points (perhaps the main?) of Continuous. There needs to be out of the box visualizations using the application's frameworks. These visualizations should be thought through to really show of functionality in addition to actually being useful for students.

**TODO:**

* Research multivariable calculus.
* Interview students taking the course at LiU (exam is ~ october 20th).
* Implement existing visualizations for the new version of Continuous.

Documentation
--------------------------
There is next to no documentation of Continuous. Some documentation could be valuable to the project. Examples below.

**TODO:**

* Technical design document - a document describing modules and architecture of Continuous.
* System overview - a collection of images describing the application.
* Use case flow chats

Olof & George
--------------------------
Olof Svensson and George Baravdish have, sice project start, had the role of "clients". That has become somewhat awkward now that Continuous is aiming to be a stand-alone, full featured application. The suggestion is that they remain in the project, but as product owners, helping the team to develop a realistic, commercial product.

**TODO:** Find a way to bring this issue up in a nice manner.

Marketing
--------------------------

**TODO:**

* Discuss more ways of marketing Continuous.
* Discuss Continuous' business model. How will Continuous work finantially once released?

Server
--------------------------
Continuous could benefit from being deployed somewhere to test live performance and stability.

**TODO:**

* Setup integration environment. Emil has a Raspberry pi, Jonas (soon) has a Zotac barebone.
* Setup deploy scripts for the integration server to fetch commited code, test and deploy.
* Add support for versioned releases.
* Setup a load balancer to route between Sage instances.

Version- and Project Control
--------------------------
It is suggested to move back into a closed repository at GitHub. GitHub has useful features for documentation as well as for issues. We might not use all of them, but it could certainly help to have version- and project control on one platform.

[1]: http://emilaxelsson.se/images/mathgl-api1.png
