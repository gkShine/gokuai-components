import Slide from './src/slide';

Slide.install = function(Vue) {
  Vue.component(Slide.name, Slide);
};

export default Slide;
