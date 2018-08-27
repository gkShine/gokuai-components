import Loading from './src/loading';

Loading.install = function(Vue) {
  Vue.directive(Loading.name, Loading);
};

export default Loading;