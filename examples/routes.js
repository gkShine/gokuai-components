import Finder from './pages/Finder.vue'

let routes = [
  {
    path: '/finder',
    component: Finder,
    name: ''
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/finder' }
  }
];

export default routes;