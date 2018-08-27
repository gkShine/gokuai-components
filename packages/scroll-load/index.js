import ScrollLoad from './src/scroll-load';

ScrollLoad.install = function(Vue) {
  Vue.directive(ScrollLoad.name, ScrollLoad);
};

export default ScrollLoad;
