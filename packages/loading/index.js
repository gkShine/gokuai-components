import loading from './src/loading';

export default {
  install(Vue) {
    Vue.directive('gloading', loading);
  }
};
