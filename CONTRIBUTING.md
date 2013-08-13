# Contributing to jQuery Cubelet

## Getting started

To get started with hacking on Cubelet, you'll need to get all of the
dependencies with [Bower](http://bower.io/) and [npm](https://npmjs.org/) (and,
by extension, [Node](http://nodejs.org/)):

````
$: bower install; npm install
````

## Versioning

Cubelet uses [SemVer](http://semver.org/) for versioning.  If you modify the
source code, please adhere to this convention (in all likelihood you will only
need to modify the rightmost digit by one).  To change the version, you'll need
to update the version in two places: `bower.json` (version 1.0 or later) and
`package.json` (look for the lines that say `version`).  The version numbers in
these two files must be kept in sync.

## Building

Cubelet uses [Grunt](http://gruntjs.com/) (version 0.4.1 or later, globally
installed) to generate the distributable binaries.  If you make any changes to
the source code, please rebuild the binaries with:

````
$: grunt build
````

## Style

Cubelet does not have a style guide, but please try to keep consistent with the
established patterns and conventions.
