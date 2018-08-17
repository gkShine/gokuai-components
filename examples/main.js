// import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
import 'gokuai-components/lib/default-theme/index.css';
import GkComponent from 'gokuai-components/lib';

Vue.use(GkComponent);
Vue.use(VueRouter);

import Mock from './mock'
Mock.bootstrap();

const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');