import Hammer from "hammerjs";
import {device} from 'device.js';

export default {
  name: 'gk-touch',

  enable: (device.mobile || device.tablet) && !device.windows,

  device: device,

  bind(el, binding) {
    if (!binding.def.enable) {
      return false;
    }

    let hammer = new Hammer(el, {
      enable: binding.def.enable
    });

    hammer.on(binding.arg, (e) => {
      binding.value(e);

      if (binding.modifiers.prevent) {
        e.preventDefault();
      }
    });
  },

  bindEl(el, event, callback) {
    if (!this.enable) {
      return false;
    }
    let hammer = new Hammer(el, {
      enable: this.enable
    });
    if (event.indexOf('pinch') > -1) {
      hammer.get('pinch').set({enable: true});
    } else if (event.indexOf('rotate') > -1) {
      hammer.get('rotate').set({enable: true});
    }
    hammer.on(event, callback);
  }
};