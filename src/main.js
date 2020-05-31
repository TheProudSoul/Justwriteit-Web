import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import api from './api'
Vue.prototype.$http = api;
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  vuetify,

  // 储存登录状态
  created() {}
}).$mount('#app')
