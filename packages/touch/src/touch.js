import Hammer from "hammerjs";
import {device} from 'device.js';

export default {
  name: 'gk-touch',

  enable: device.mobile || device.tablet,

  bind(el, binding) {
    let hammer = new Hammer(el, {
      enable: binding.def.enable
    });

    hammer.on(binding.arg, (e) => {
      binding.value(e);

      if (binding.modifiers.stop) {
        e.srcEvent.stopPropagation();
      }

      if (binding.modifiers.prevent) {
        e.preventDefault();
        e.srcEvent.preventDefault();
      }
    });
  }
};