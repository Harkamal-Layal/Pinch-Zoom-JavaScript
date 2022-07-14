/* PINCH ZOOM */
var PinchZoom = function(elem) {
  /* INITIALISING VARIABLES */
  var elemWidth = elem.clientWidth;
  var elemInitialWidth = elem.clientWidth;
  var newWidth = 0;
  var leftFingerInitialPoints = { x: 0, y: 0 };
  var rightFingerInitialPoints = { x: 0, y: 0 };
  var leftFingerFinalPoints = { x: 0, y: 0 };
  var rightFingerFinalPoints = { x: 0, y: 0 };
  var leftIndex = 0;
  var rightIndex = 0;
  var lastXTransform = 0;
  var lastYTransform = 0;
  var elemState = 2;
  var zoomingSentivity = 2;
  var transformSenstivity = 1.3;

  /* Functions */
  function x(evt) {
    if (!evt) return;
    return evt.clientX;
  }

  function y(evt) {
    if (!evt) return;
    return evt.clientY;
  }

  this.handleTouchStart = (evt) => {
    if (evt.targetTouches.length < 2) {
      return;
    }
    if (evt.targetTouches[0].clientX < evt.targetTouches[1].clientX) {
      leftIndex = 0;
      rightIndex = 1;
    }
    else {
      rightIndex = 0;
      leftIndex = 1;
    }
    leftFingerInitialPoints.x = x(evt.targetTouches[leftIndex]);
    rightFingerInitialPoints.x = x(evt.targetTouches[rightIndex]);
    leftFingerInitialPoints.y = y(evt.targetTouches[leftIndex]);
    rightFingerInitialPoints.y = y(evt.targetTouches[rightIndex]);
    elemWidth = elem.clientWidth;
    elem.addEventListener("touchmove", this.handleTouchMove);
    elem.addEventListener("touchend", this.handleTouchEnd);
    elem.addEventListener("touchcancel", this.handleTouchEnd);
    elem.style.transition = "initial";
  };

  this.handleTouchMove = (evt) => {
    if (evt.targetTouches.length < 2) {
      return;
    }
    if (evt.targetTouches[0].clientX < evt.targetTouches[1].clientX) {
      leftIndex = 0;
      rightIndex = 1;
    }
    else {
      rightIndex = 0;
      leftIndex = 1;
    }
    if (newWidth < elemInitialWidth * 1.25) elemState = 1;
    if (newWidth == elemInitialWidth * 1.25) elemState = 2;
    if (newWidth > elemInitialWidth * 1.25) elemState = 3;
    leftFingerFinalPoints.x = x(evt.targetTouches[leftIndex]);
    rightFingerFinalPoints.x = x(evt.targetTouches[rightIndex]);
    leftFingerFinalPoints.y = y(evt.targetTouches[leftIndex]);
    rightFingerFinalPoints.y = y(evt.targetTouches[rightIndex]);
    newWidth = elemWidth + (-(leftFingerFinalPoints.x - leftFingerInitialPoints.x) + (rightFingerFinalPoints.x - rightFingerInitialPoints.x) + (leftFingerFinalPoints.y - leftFingerInitialPoints.y) + (rightFingerFinalPoints.y - rightFingerInitialPoints.y) * zoomingSentivity);
    elem.style.width = newWidth + "px";
    elem.style.transform = `translate(${lastXTransform + ((leftFingerFinalPoints.x-leftFingerInitialPoints.x) + (rightFingerFinalPoints.x - rightFingerInitialPoints.x)) * transformSenstivity}px,${lastYTransform + ((leftFingerFinalPoints.y-leftFingerInitialPoints.y) + (rightFingerFinalPoints.y - rightFingerInitialPoints.y)) * transformSenstivity}px)`
  };

  this.handleTouchEnd = (evt) => {
    if (elemState == 1 || elemState == 2) {
      if (evt.targetTouches[0]) return;
      lastYTransform = 0;
      lastXTransform = 0;
      elem.style.transition = "150ms width ease-out,150ms transform ease-in";
      elem.style.transform = "initial";
      elem.style.width = "100vw";
      elem.removeEventListener("touchmove", this.handleTouchMove);
      elem.removeEventListener("touchend", this.handleTouchEnd);
      elem.removeEventListener("touchcancel", this.handleTouchEnd);
    }
    if (elemState == 3) {
      lastXTransform = (lastXTransform + (leftFingerFinalPoints.x - leftFingerInitialPoints.x) + (rightFingerFinalPoints.x - rightFingerInitialPoints.x));
      lastYTransform = (lastYTransform + (leftFingerFinalPoints.y - leftFingerInitialPoints.y) + (rightFingerFinalPoints.y - rightFingerInitialPoints.y));
      elem.removeEventListener("touchmove", this.handleTouchMove);
      elem.removeEventListener("touchend", this.handleTouchEnd);
      elem.removeEventListener("touchcancel", this.handleTouchEnd);
    }
  };

  /* Adding Event Listeners */
  elem.addEventListener("touchstart", this.handleTouchStart);
};

window.onload = () => {
  const image = document.querySelector(".pinch-zoom");
  const imageBox = document.querySelector(".image-box");
  new PinchZoom(image);

  imageBox.style.height = image.clientHeight + "px";
}