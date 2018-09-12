import Home from './pages/Home.vue'
import Finder from './pages/Finder.vue'
import Upload from './pages/Upload.vue'
import Fileicon from './pages/Fileicon.vue'
import Button from './pages/Button.vue'
import Table from './pages/Table.vue'
import Menu from './pages/Menu.vue'
import Thumbnail from './pages/Thumbnail.vue'
import Dropdown from './pages/Dropdown.vue'
import Slide from './pages/Slide.vue'

let routes = [
  {
    path: '/',
    component: Home,
    name: '介绍'
  },
  {
    path: '/button',
    component: Button,
    name: '按钮'
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
    name: '预览'
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
    path: '*',
    hidden: true,
    redirect: { path: '/' }
  }
];

export default routes;