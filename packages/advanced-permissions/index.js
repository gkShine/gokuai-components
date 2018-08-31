import AdvancedPermissions from '../permissions/src/advanced-permissions';

AdvancedPermissions.install = function (Vue) {
  Vue.property[AdvancedPermissions.name] = AdvancedPermissions;
};

export default AdvancedPermissions;