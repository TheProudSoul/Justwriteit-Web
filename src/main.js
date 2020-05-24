import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import api from './api'
import './plugins/element.js'
Vue.prototype.$api = api;

import { library } from '@fortawesome/fontawesome-svg-core'
import { faFile, faFolder, faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFile, faFolder, faCaretRight, faCaretDown)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App),
  // 储存登录状态
  created() {
    
    if (localStorage.getItem('userId') === null) {
      localStorage.setItem('userId', '')
    }
    this.$store.commit('COMMIT_USERID', localStorage.getItem('userId'))
  }
}).$mount('#app')
