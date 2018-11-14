import Touch from './src/touch';

Touch.install = function(Vue) {
  Vue.directive(Touch.name, Touch);
};

export default Touch;