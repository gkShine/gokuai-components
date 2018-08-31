import Permissions from './src/permissions';

Permissions.install = function(Vue) {
  Vue.property[Permissions.name] = Permissions;
};

export default Permissions;
