# jQuery Cubelet

## A widget for prototyping CSS rotations

jQuery Cubelet (or just Cubelet) is a jQuery plugin that provides a graphical widget for defining the three axes of rotation for an element.  This is useful for prototyping how an element might look with the CSS `transform` properties `rotateX`, `rotateY`, and `rotateZ` applied.

This widget puts a 3D cube on a webpage which can be rotated with the mouse.  Clicking and dragging the cube will modify the X and Y axes, and dragging the "rotation arm" that extends from the center of the cube will modify the Z axis.

This widget was created specifically for use in [Stylie](http://jeremyckahn.github.io/stylie/), but may have uses elsewhere.  Admittedly it is not terribly flexible in its current state, as I didn't really know what other use cases it might have.  If there are changes you need to make Cubelet more compatible with your project, please [make a feature request](https://github.com/jeremyckahn/cubelet/issues) or submit a Pull Request.

## Compatibility

Cubelet is tested on the following browsers:

  * Chrome 29
  * Firefox 22
  * Safari 6 (works but has some clipping issues with overlayed elements)

Cubelet is jQuery plugin was developed with jQuery 2.0.2.  Newer versions of jQuery should work just fine, but older versions have not been tested.

## Usage

To use Cubelet:

````html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Not necessary, but keeps the widget inside the viewport */
    .test-cubelet {
      margin: 300px auto 0;
    }
  </style>
</head>
<body>
  <!-- Container element for the Cubelet -->
  <div class="test-cubelet"></div>
  <!-- Load jQuery and the plugin -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
  <script src="./dist/jquery.cubelet.min.js"></script>
  <script>
    // Initialize the widget
    var $cubelet = $('.test-cubelet');
    $cubelet.cubeletInit();
  </script>
</body>
</html>
````
