import Home from './pages/Home.vue'
import Tag from './pages/Tag.vue'
import Finder from './pages/Finder.vue'
import Upload from './pages/Upload.vue'
import Fileicon from './pages/Fileicon.vue'
import Icon from './pages/Icon.vue'
import Button from './pages/Button.vue'
import Table from './pages/Table.vue'
import Menu from './pages/Menu.vue'
import Thumbnail from './pages/Thumbnail.vue'
import Dropdown from './pages/Dropdown.vue'
import Slide from './pages/Slide.vue'
import Input from './pages/Input.vue'
import Avatar from './pages/Avatar.vue'
import Contacts from './pages/Contacts.vue'

let routes = [
  {
    path: '/',
    component: Home,
    name: '介绍'
  },
  {
    path: '/avatar',
    component: Avatar,
    name: '头像'
  },
  {
    path: '/icon',
    component: Icon,
    name: '图标'
  },
  {
    path: '/button',
    component: Button,
    name: '按钮'
  },
  {
    path: '/input',
    component: Input,
    name: '文本框'
  },
  {
    path: '/tag',
    component: Tag,
    name: '标签'
  },
  {
    path: '/menu',
    component: Menu,
    name: '菜单'
  },
  {
    path: '/table',
    component: Table,
    name: '表格'
  },
  {
    path: '/slide',
    component: Slide,
    name: '幻灯片'
  },
  {
    path: '/dropdown',
    component: Dropdown,
    name: '下拉框'
  },
  {
    path: '/fileicon',
    component: Fileicon,
    name: '文件图标'
  },
  {
    path: '/upload',
    component: Upload,
    name: '文件上传'
  },
  {
    path: '/thumbnail',
    component: Thumbnail,
    name: '缩略图列表'
  },
  {
    path: '/finder',
    component: Finder,
    name: '文件管理器'
  },
  {
    path: '/contacts',
    component: Contacts,
    name: '通讯录'
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/' }
  }
];

export default routes;