import Finder from './src/finder';

Finder.install = function(Vue) {
  Vue.component(Finder.name, Finder);
};

export default Finder;
