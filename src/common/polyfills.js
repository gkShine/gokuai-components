if ("document" in window.self) {

  (function (view) {

    "use strict";

    if (!('Element' in view)) return;

    if (!("requestAnimationFrame" in window)) {
      window.requestAnimationFrame = function (fn) {
        return setTimeout(fn, 1000 / 60)
      }
    }

  }(window.self));

}
