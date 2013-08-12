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
  var newZRotation = $el.cubeletGetCoords().z + totalDelta;
  $el.cubeletSetCoords({ z: newZRotation });
  $el.css(
      'transform', 'translate(-50%, -50%) rotate(' + newZRotation + 'deg)');
}


/*!
 * @param {jQuery} $el The Cubelet element
 * @param {HTMLElement} dragTarget The element being dragged
 * @param {jQuery.Event} evt
 */
function onWindowMousemove ($el, dragTarget, evt) {
  var clientX = evt.clientX;
  var clientY = evt.clientY;
  var deltaX = evt.clientX - $el._lastClientX;
  var deltaY = evt.clientY - $el._lastClientY;
  $el._lastClientX = clientX;
  $el._lastClientY = clientY;

  if ($.contains($el._$cubeletCube[0], dragTarget)) {
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

  var proxiedOnWindowMousemove =
      $.proxy(onWindowMousemove, $win, $el, evt.target);
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

  this._$cubeletContainer = this.find('.cubelet-container');
  this._$cubeletCube = this.find('.cubelet-cube');
  this._$cubeletZRotationArm = this.find('.cubelet-rotation-arm');
  this._$cubeletZRotationHandle = this.find('.cubelet-rotation-handle');

  // TODO: Make this value configurable.
  this.cubeletSetSize(100);
  this.cubeletSetCoords(this._cubeletCoordinates);
  this.css('perspective', PERSPECTIVE_PX);
  // Center the element
  this.css('transform', 'translate(-50%, -50%)');
  this.addClass('cubelet');

  this._$cubeletContainer.on(
      'mousedown', $.proxy(onCubeletMousedown, this, this));

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
    + 'deg)';
  this._$cubeletCube.css('transform', transformString);

  return this;
};


/**
 * Show the Cubelet control.
 * @return {jQuery}
 */
$.fn.cubeletShow = function () {
  this._$cubeletContainer.show();
  return this;
};


/**
 * Hide the Cubelet control.
 * @return {jQuery}
 */
$.fn.cubeletHide = function () {
  this._$cubeletContainer.hide();
  return this;
};


/**
 * Whether the Cubelet is showing or not.
 * @return {boolean}
 */
$.fn.cubeletIsShown = function () {
  return this._$cubeletContainer.is(':visible');
};
