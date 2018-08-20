import scrollLoad from './src/scroll-load';

export default {
  install(Vue) {
    Vue.directive('gscroll-load', scrollLoad);
  }
};
