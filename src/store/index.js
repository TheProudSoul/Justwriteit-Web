import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
// export default new Vuex.Store({
//   state: {
//     username:'',
//     userId:0,
//     email:''
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })
