import Tooltip from './src/tooltip';

Tooltip.install = function(Vue) {
  Vue.directive(Tooltip.name, Tooltip);
};

export default Tooltip;