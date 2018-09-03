import Finder from './pages/Finder.vue'
import Upload from './pages/Upload.vue'
import Button from './pages/Button.vue'

let routes = [
  {
    path: '/',
    component: Finder,
    name: '介绍'
  },
  {
    path: '/button',
    component: Button,
    name: '按钮'
  },
  {
    path: '/menu',
    component: Finder,
    name: '菜单'
  },
  {
    path: '/table',
    component: Finder,
    name: '表格'
  },
  {
    path: '/slide',
    component: Finder,
    name: '预览'
  },
  {
    path: '/dropdown',
    component: Finder,
    name: '下拉框'
  },
  {
    path: '/upload',
    component: Upload,
    name: '文件上传'
  },
  {
    path: '/thumbnail',
    component: Finder,
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