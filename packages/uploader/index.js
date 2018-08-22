import Uploader from './src/uploader';

Uploader.install = function(Vue) {
  Vue.component(Uploader.name, Uploader);
};

export default Uploader;
