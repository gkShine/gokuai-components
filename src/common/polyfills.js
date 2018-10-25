if ("document" in window.self) {

  (function (view) {

    "use strict";

    if (!('Element' in view)) return;

    var div = document.createElement('div'),
      style = div.style,
      animationNames = ['animation', 'WebkitAnimation', 'OAnimation', 'msAnimation', 'MozAnimation'],
      animationName = (function () {
        var i = 0,
          len = animationNames.length,
          name,
          u;
        for (; i < len; i++) {
          name = animationNames[i];
          if (style[name] !== u) return name;
        }
        return false;
      })();

    HTMLElement.prototype.addEvent = function(type, fn, capture) {
      var el = this;
      if (type === 'transitionend' && animationName === false) {
        fn.call(el);
      } else if (window.addEventListener) {
        el.addEventListener(type, function(e) {
          fn.call(el, e);
        }, capture);
      } else if (window.attachEvent) {
        el.attachEvent("on" + type, function(e) {
          fn.call(el, e);
        });
      }
    };

    if (!("requestAnimationFrame" in window)) {
      window.requestAnimationFrame = function (fn) {
        return setTimeout(fn, 1000 / 60)
      }
    }

  }(window.self));

}
