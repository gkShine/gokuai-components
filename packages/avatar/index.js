import Avatar from './src/avatar';

Avatar.install = function(Vue) {
  Vue.component(Avatar.name, Avatar);
};

export default Avatar;
