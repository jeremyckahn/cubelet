// CONSTANTS
//
var PERSPECTIVE_PX = 1000;


// PRIVATE STATIC VARIABLES
//
var hasPerformedFirstTimeInit = false;
var $win = $(window);

/** @type {HTMLElement} */
var cubeletInjectedStyle;

/** @type {HTMLElement} */
var $cubeletBaseHtmlFragment;


// PRIVATE STATIC FUNCTIONS
//
/*!
 * @return {string}
 */
var getVendorPrefix = function () {
  var style = document.body.style;
  var prefix;

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
 * @param {jQuery} $el The Cubelet element.
 * @param {jQuery.Event} evt
 */
function onWindowMousemove ($el, evt) {
  var clientX = evt.clientX;
  var clientY = evt.clientY;
  var deltaX = evt.clientX - $el._lastClientX;
  var deltaY = evt.clientY - $el._lastClientY;
  $el._lastClientX = clientX;
  $el._lastClientY = clientY;

  var coords = $el._cubeletCoordinates;
  // It seems wrong to subtract deltas from the opposite axis, but it actually
  // makes for a much more intuitive interaction.  This is intentional.
  $el.cubeletSetCoords({
    x: coords.x - deltaY
    ,y: coords.y + deltaX
  });
}


/*!
 * @param {jQuery} $el
 * @param {jQuery.Event} evt
 */
function onCubeletMousedown ($el, evt) {
  $el._lastClientX = evt.clientX;
  $el._lastClientY = evt.clientY;

  var proxiedOnWindowMousemove = $.proxy(onWindowMousemove, $win, $el);
  $win.on('mousemove', proxiedOnWindowMousemove);
  $win.on('mouseup', function () {
    $win.off('mousemove', proxiedOnWindowMousemove);
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
 * @return {jQuery}
 */
$.fn.cubeletInit = function () {
  if (!hasPerformedFirstTimeInit) {
    firstTimeInit();
    hasPerformedFirstTimeInit = true;
  }

  this._cubeletCoordinates = { x: 0, y:0, z:0 };
  this._lastOffsetX = null;
  this._lastOffsetY = null;

  this._$cubeletHtmlFragment = $cubeletBaseHtmlFragment.clone();
  this.append(this._$cubeletHtmlFragment);
  this._$cubeletCube = this.find('.cubelet-cube');

  // TODO: Make this value configurable.
  this.cubeletSetSize(200);
  this.cubeletSetCoords(this._cubeletCoordinates);
  this.css(getVendorPrefix() + 'perspective', PERSPECTIVE_PX);

  this._$cubeletCube.on('mousedown', $.proxy(onCubeletMousedown, this, this));

  return this;
};


/**
 * @param {number} pixelSize The height and width in pixels that the cube should have.
 * @return {jQuery}
 */
$.fn.cubeletSetSize = function (pixelSize) {
  return this.css({
    'height': pixelSize + 'px'
    ,'width': pixelSize + 'px'
  });
};


/**
 * Get the current rotation coordinates of the cube.
 * @return {{x: number, y: number, z: number}}
 */
$.fn.cubeletGetCoords = function () {
  return $.extend({}, this._cubeletCoordinates);
};


/**
 * Set the rotation coordinates of the cube.
 * @param {{x: number=, y: number=, z: number=}} The coordinates to set on the cube.  You can supply all coordinates or only the ones you want to modify.
 * @return {jQuery}
 */
$.fn.cubeletSetCoords = function (coordinates) {
  var cubeletCoordinates = this._cubeletCoordinates;
  $.extend(cubeletCoordinates, coordinates);

  var transformString =
    'rotateX(' + cubeletCoordinates.x
    + 'deg) rotateY(' + cubeletCoordinates.y
    + 'deg) rotateZ(' + cubeletCoordinates.z
    + 'deg)';
  this._$cubeletCube.css(getVendorPrefix() + 'transform', transformString);

  return this;
};


$.fn.cubeletEnableEdit = function () {};


$.fn.cubeletDisableEdit = function () {};
