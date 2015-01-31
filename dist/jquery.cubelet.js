/*! jquery-cubelet - v0.3.0 - 2015-01-30 - https://github.com/jeremyckahn/cubelet */
define(['jquery'], function ($) {

var htmlTemplate = [
    '<div class="cubelet-container">'
      ,'<div class="cubelet-cube">'
        ,'<figure class="cubelet-front"></figure>'
        ,'<figure class="cubelet-back"></figure>'
        ,'<figure class="cubelet-right"></figure>'
        ,'<figure class="cubelet-left"></figure>'
        ,'<figure class="cubelet-top"></figure>'
        ,'<figure class="cubelet-bottom"></figure>'
      ,'</div>'
      ,'<div class="cubelet-rotation-arm">'
        ,'<div class="cubelet-rotation-handle"></div>'
      ,'</div>'
    ,'</div>'
  ].join('');


var cssTemplate = [
    '.cubelet-container,'
    ,'.cubelet-cube {'
      ,'height: 100%;'
      ,'width: 100%; }'
    ,'.cubelet-cube {'
      ,'__VENDOR__transform: translateZ(-100px) rotateY(0deg) rotateX(0deg); '
      ,'__VENDOR__transform-style: preserve-3d; }'
    ,'.cubelet-cube figure {'
      ,'margin: 0;'
      ,'position: absolute;'
      ,'height: 100%;'
      ,'width: 100%; }'
    ,'.cubelet-front {'
      ,'__VENDOR__transform: rotateY(0deg) translateZ(50px); }'
    ,'.cubelet-back {'
      ,'__VENDOR__transform: rotateX(180deg) translateZ(50px);'
      ,'background: #fb0; }'
    ,'.cubelet-right {'
      ,'__VENDOR__transform: rotateY(90deg) translateZ(50px);'
      ,'background: #00cc4e; }'
    ,'.cubelet-left {'
      ,'__VENDOR__transform: rotateY(-90deg) translateZ(50px);'
      ,'background: #06f; }'
    ,'.cubelet-top {'
      ,'__VENDOR__transform: rotateX(90deg) translateZ(50px);'
      ,'background: #f77; }'
    ,'.cubelet-bottom {'
      ,'__VENDOR__transform: rotateX(-90deg) translateZ(50px);'
      ,'background: #b00; }'
    ,'.cubelet-rotation-arm {'
      ,'cursor: ew-resize;'
      ,'bottom: 50%;'
      ,'background: #fff;'
      ,'border-left: dotted #000 2px;'
      ,'left: 50%;'
      ,'position: absolute;'
      ,'height: 125px;'
      ,'width: 0; }'
    ,'.cubelet-rotation-handle {'
      ,'background: #444;'
      ,'border: solid #000 2px;'
      ,'border-radius: 50%;'
      ,'height: 10px;'
      ,'left: -8px;'
      ,'position: absolute;'
      ,'right: 8%;'
      ,'width: 10px; }'
].join('\n');

// CONSTANTS
//
var CUBELET_SIZE = 100;
var SCALE_DIVISOR = 30;

// PRIVATE STATIC VARIABLES
//
var hasPerformedFirstTimeInit = false;
var $win = $(window);

// @type {HTMLElement}
var cubeletInjectedStyle;

// @type {HTMLElement}
var $cubeletBaseHtmlFragment;

var trackedMouseCoords = { x: 0, y: 0 };

$win.on('mousemove', function (evt) {
  trackedMouseCoords.x = evt.pageX;
  trackedMouseCoords.y = evt.pageY;
});


// PRIVATE STATIC FUNCTIONS
//
/*!
 * @return {string}
 */
var getVendorPrefix = function () {
  var style = document.body.style;
  var prefix = '';

  if ('-webkit-transform' in style) {
    prefix = '-webkit-';
  } else if ('-moz-transform' in style) {
    prefix = '-moz-';
  } else if ('-ms-transform' in style) {
    prefix = '-ms-';
  } else if ('-o-transform' in style) {
    prefix = '-o-';
  }

  // MEMOIZATION!
  getVendorPrefix = function () {
    return prefix;
  };

  return prefix;
};


/*!
 * @param {jQuery} $el The Cubelet element
 * @param {number} deltaX How much the mouse moved aling the X axis
 * @param {number} deltaY How much the mouse moved aling the Y axis
 */
function onDragCube ($el, deltaX, deltaY) {
  var coords = $el._cubeletCoordinates;
  // It seems wrong to subtract deltas from the opposite axis, but it actually
  // makes for a much more intuitive interaction.  This is intentional.
  $el.cubeletSetCoords({
    x: coords.x - deltaY
    ,y: coords.y + deltaX
  });
}


/*!
 * @param {jQuery} $el The Cubelet element
 * @param {number} deltaX How much the mouse moved aling the X axis
 * @param {number} deltaY How much the mouse moved aling the Y axis
 */
function onDragRotationArm ($el, deltaX, deltaY) {
  var totalDelta = deltaX + deltaY;
  var multiplier = $el._cubeletCoordinates.scale > 0 ? 1 : -1;
  var newZRotation = $el.cubeletGetCoords().z + (multiplier * totalDelta);
  $el.cubeletSetCoords({ z: newZRotation });
}


/*!
 * @param {jQuery} $el The Cubelet element
 * @param {HTMLElement} dragTarget The element being dragged
 * @param {jQuery.Event} evt
 */
function onWindowMousemove ($el, dragTarget, evt) {
  var clientX = evt.clientX;
  var clientY = evt.clientY;
  var deltaX = evt.clientX - $el._lastClientX || 0;
  var deltaY = evt.clientY - $el._lastClientY || 0;
  $el._lastClientX = clientX;
  $el._lastClientY = clientY;

  if ($.contains($el._$cubeletCube[0], dragTarget)
      || $el._$cubeletContainer[0] === dragTarget) {
    onDragCube($el, deltaX, deltaY);
  } else if ($.contains($el._$cubeletZRotationArm[0], dragTarget)) {
    onDragRotationArm($el, deltaX, deltaY);
  }

  $el.trigger('change');
}


/*!
 * @param {jQuery} $el
 * @param {jQuery.Event} evt
 */
function onCubeletMousedown ($el, evt) {
  $el._lastClientX = evt.clientX;
  $el._lastClientY = evt.clientY;
  $el._isDragging = true;

  var proxiedOnWindowMousemove =
      $.proxy(onWindowMousemove, $win, $el, evt.target);
  $win.on('mousemove', proxiedOnWindowMousemove);
  $win.on('mouseup', function () {
    $el._isDragging = false;
    $win.off('mousemove', proxiedOnWindowMousemove);
  });
}


/*!
 * @param {jQuery} $el The Cubelet, not the window.
 * @param {jQuery.Event} evt
 * @param {number} delta
 * @param {number} deltaX
 * @param {number} deltaY
 */
function onWindowMousewheel ($el, evt, delta, deltaX, deltaY) {
  evt.preventDefault();
  var currentScale = $el._cubeletCoordinates.scale;
  var adjustedDelta = deltaY / SCALE_DIVISOR;
  var newScale = +(currentScale + adjustedDelta).toFixed(4);
  $el._cubeletCoordinates.scale = newScale;
  $el._$cubeletContainer.css('transform', 'scale(' + newScale + ')');
  $el.trigger('change');
}


/*!
 * @param {jQuery} $el The Cubelet.
 * @param {jQuery.Event} evt
 */
function onCubeletMousemove ($el, evt) {
  // Don't block $win's mousemove handler unless the user is focused on the
  // Cubelet
  if ($el._isDragging) {
    return;
  } else {
    evt.stopPropagation();
  }

  var oldProxiedOnWindowMousewheel = $el._proxiedOnWindowMousewheel;

  if (oldProxiedOnWindowMousewheel) {
    $win.off('mousewheel', oldProxiedOnWindowMousewheel);
  }

  var proxiedOnWindowMousewheel = $.proxy(onWindowMousewheel, $el, $el);
  $el._proxiedOnWindowMousewheel = proxiedOnWindowMousewheel;

  $win.on('mousewheel', proxiedOnWindowMousewheel);
  $win.one('mousemove', function () {
    $win.off('mousewheel', proxiedOnWindowMousewheel);
  });
}


function firstTimeInit () {
  cubeletInjectedStyle = document.createElement('style');
  cubeletInjectedStyle.innerHTML =
      cssTemplate.replace(/__VENDOR__/g, getVendorPrefix());
  document.head.appendChild(cubeletInjectedStyle);
  $cubeletBaseHtmlFragment = $(htmlTemplate);
}


// JQUERY METHODS
//
/**
 * Creates a Cubelet widget.  The elements that this method is called upon are treated as containers — it is recommended that these containers are empty when this method is called.
 *
 * @return {jQuery}
 */
$.fn.cubeletInit = function () {
  if (!hasPerformedFirstTimeInit) {
    firstTimeInit();
    hasPerformedFirstTimeInit = true;
  }

  this._cubeletCoordinates = { x: 0, y: 0, z: 0, scale: 1 };
  this._lastOffsetX = null;
  this._lastOffsetY = null;

  this._$cubeletHtmlFragment = $cubeletBaseHtmlFragment.clone();
  this.append(this._$cubeletHtmlFragment);

  this._$cubeletContainer = this.find('.cubelet-container');
  this._$cubeletCube = this.find('.cubelet-cube');
  this._$cubeletZRotationArm = this.find('.cubelet-rotation-arm');
  this._$cubeletZRotationHandle = this.find('.cubelet-rotation-handle');

  this.css({
    height: CUBELET_SIZE + 'px'
    ,width: CUBELET_SIZE + 'px'
  });

  this.addClass('cubelet');
  this.cubeletSetCoords(this._cubeletCoordinates);
  this._$cubeletContainer.on(
      'mousedown', $.proxy(onCubeletMousedown, this, this));
  this._$cubeletContainer.on(
      'mousemove', $.proxy(onCubeletMousemove, this, this));

  return this;
};


/**
 * Get the current rotation coordinates of the cube.  The returned object has the format:
 *
 * ```
 * { x: number, y: number, z: number, scale: number }
 * ```
 *
 * @return {Object}
 */
$.fn.cubeletGetCoords = function () {
  return $.extend({}, this._cubeletCoordinates);
};


/**
 * Set the rotation coordinates of the Cubelet.  Sets the internal state of the widget as well as the inline CSS `rotate` styles.
 *
 * The `coordinates` parameter accepts any object with the following format:
 *
 * ```
 * { x: number=, y: number=, z: number=, scale: number=}
 * ```
 *
 * You can omit any parameters you don't want to set — those properties will be unchanged by this method.
 *
 * @param {Object} coordinates The coordinates to set on the cube.
 * @return {jQuery}
 */
$.fn.cubeletSetCoords = function (coordinates) {
  var cubeletCoordinates = this._cubeletCoordinates;
  $.extend(cubeletCoordinates, coordinates);

  var transformString =
           'rotateX(' + cubeletCoordinates.x
    + 'deg) rotateY(' + cubeletCoordinates.y
    + 'deg)';
  this.css('transform',
      'translate(-50%, -50%) rotate(' + cubeletCoordinates.z + 'deg)');
  this._$cubeletCube.css('transform', transformString);
  this._$cubeletContainer.css(
      'transform', 'scale(' + cubeletCoordinates.scale + ')');

  return this;
};


/**
 * Show the Cubelet widget.
 *
 * @return {jQuery}
 */
$.fn.cubeletShow = function () {
  this._$cubeletContainer.show();

  // If the mouse is already over the Cubelet when it is shown, start listening
  // for mousewheel interactions (which is achieved by triggering the mousemove
  // event.)
  var hoveredEl = document.elementFromPoint(
      trackedMouseCoords.x, trackedMouseCoords.y);

  if ($.contains(this._$cubeletContainer[0], hoveredEl) ||
      this._$cubeletContainer[0] === hoveredEl) {
    this._$cubeletContainer.trigger('mousemove');
  }

  return this;
};


/**
 * Hide the Cubelet widget.
 *
 * @return {jQuery}
 */
$.fn.cubeletHide = function () {
  this._$cubeletContainer.hide();
  return this;
};


/**
 * Whether the Cubelet is showing or not.
 *
 * @return {boolean}
 */
$.fn.cubeletIsShown = function () {
  return this._$cubeletContainer.is(':visible');
};


/**
 * Takes the Cubelet's current rotation coordinates and apply them to another jQuery collection.  Note that this will overwrite any inline `transform` styles currently set on these elements.
 *
 * @param {jQuery} $el The elements to apply the Cubelet's current rotation to.
 */
$.fn.cubeletApplyRotationToElement = function ($el) {
  var coords = this.cubeletGetCoords();
  $el.css('transform',
               'rotateX(' + coords.x
        + 'deg) rotateY(' + coords.y
        + 'deg) rotateZ(' + coords.z
        + 'deg) scale(' + coords.scale + ')');
};

});
