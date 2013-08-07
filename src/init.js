// PRIVATE STATIC VARIABLES
//
var hasPerformedFirstTimeInit = false;

/** @type {HTMLElement} */
var cubeletInjectedStyle;

/** @type {HTMLElement} */
var $cubeletBaseHtmlFragment;


// PRIVATE STATIC FUNCTIONS
//
/*!
 * @return {string}
 */
function getVendorPrefix () {
  var style = document.body.style;

  if ('-webkit-transform' in style) {
    return '-webkit-';
  } else if ('-moz-transform' in style) {
    return '-moz-';
  } else if ('-ms-transform' in style) {
    return '-ms-';
  } else if ('-o-transform' in style) {
    return '-o-';
  }

  return '';
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
$.fn.cubeletInit = function () {
  if (!hasPerformedFirstTimeInit) {
    firstTimeInit();
    hasPerformedFirstTimeInit = true;
  }

  this._$cubeletHtmlFragment = $cubeletBaseHtmlFragment.clone();
  this.append(this._$cubeletHtmlFragment);
};


$.fn.cubeletGetCoords = function () {};


$.fn.cubeletSetCoords = function () {};


$.fn.cubeletEnableEdit = function () {};


$.fn.cubeletDisableEdit = function () {};
