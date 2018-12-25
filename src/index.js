/* Automatically generated by './build/bin/build-entry.js' */
import AdvancedPermissions from '../packages/advanced-permissions/index.js';
import Avatar from '../packages/avatar/index.js';
import Breadcrumb from '../packages/breadcrumb/index.js';
import Button from '../packages/button/index.js';
import ButtonGroup from '../packages/button-group/index.js';
import Checkbox from '../packages/checkbox/index.js';
import Dropdown from '../packages/dropdown/index.js';
import DropdownItem from '../packages/dropdown-item/index.js';
import DropdownMenu from '../packages/dropdown-menu/index.js';
import Fileicon from '../packages/fileicon/index.js';
import Finder from '../packages/finder/index.js';
import Icon from '../packages/icon/index.js';
import Input from '../packages/input/index.js';
import Loading from '../packages/loading/index.js';
import Menu from '../packages/menu/index.js';
import MenuItem from '../packages/menu-item/index.js';
import Permissions from '../packages/permissions/index.js';
import ScrollLoad from '../packages/scroll-load/index.js';
import Slide from '../packages/slide/index.js';
import Submenu from '../packages/submenu/index.js';
import Table from '../packages/table/index.js';
import TableColumn from '../packages/table-column/index.js';
import Thumbnail from '../packages/thumbnail/index.js';
import ThumbnailItem from '../packages/thumbnail-item/index.js';
import Tooltip from '../packages/tooltip/index.js';
import Touch from '../packages/touch/index.js';
import Uploader from '../packages/uploader/index.js';
import UploaderButtons from '../packages/uploader-buttons/index.js';
const components = [
  Avatar,
  Breadcrumb,
  Button,
  ButtonGroup,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Fileicon,
  Finder,
  Icon,
  Input,
  Menu,
  MenuItem,
  Slide,
  Submenu,
  Table,
  TableColumn,
  Thumbnail,
  ThumbnailItem,
  Uploader,
  UploaderButtons
];
const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  Vue.directive(Tooltip.name, Tooltip);
  Vue.directive(Loading.name, Loading);
  Vue.directive(Touch.name, Touch);
  Vue.directive(ScrollLoad.name, ScrollLoad);
  Vue.prototype[Permissions.name] = Permissions;
  Vue.prototype[AdvancedPermissions.name] = AdvancedPermissions;
};
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
module.exports = {
  version: '1.0.0',
  install,
  Avatar,
  Breadcrumb,
  Button,
  ButtonGroup,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Fileicon,
  Finder,
  Icon,
  Input,
  Menu,
  MenuItem,
  Slide,
  Submenu,
  Table,
  TableColumn,
  Thumbnail,
  ThumbnailItem,
  Uploader,
  UploaderButtons
};
module.exports.default = module.exports;
