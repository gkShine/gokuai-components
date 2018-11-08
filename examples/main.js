import '@babel/polyfill'
import 'classlist-polyfill'
import 'raf/polyfill'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
// import 'gokuai-components/lib/default-theme/index.css';
// import GkComponent from 'gokuai-components/lib';
import 'gokuai-components/packages/default-theme/src/index.scss';
import 'font-awesome/scss/font-awesome.scss';
import GkComponent from 'gokuai-components/src/index-es6';
import { device } from 'device.js';

device.addClasses(document.documentElement);

Vue.use(GkComponent);
Vue.use(VueRouter);
Vue.prototype.$device = device;

import Mock from './mock'
Mock.bootstrap();

const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');