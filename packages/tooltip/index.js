import tooltip from './src/tooltip';

export default {
  install(Vue) {
    Vue.directive('gtooltip', tooltip);
  }
};
