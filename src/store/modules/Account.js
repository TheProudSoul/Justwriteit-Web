const state = {
  username: '',
  userId: 0,
  isLogin: false,
  email: '',
  Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
}

const mutations = {
  COMMIT_USERNAME(state, username) {
    state.username = username
  },
  COMMIT_USERID(state, userId) {
    state.userId = userId
    localStorage.setItem('userId', userId)
  },
  COMMIT_EMAIL(state, email) {
    state.email = email
  },
  COMMIT_LOGIN(state) {
    state.isLogin = true
  },
  COMMIT_AUTHORIZATION(state, Authorization) {
    state.Authorization = Authorization
    localStorage.setItem('Authorization', Authorization)
  },
  COMMIT_LOGOUT(state) {
    state.isLogin = false
    state.email = ''
    state.userId = 0
    localStorage.setItem('userId', '')
    state.username = ''
    state.Authorization = ''
    localStorage.setItem('Authorization','')
  }
}

const actions = {
  login({ commit, state }, payload) {
    console.log(payload)
    commit('COMMIT_USERID', payload.id)
    commit('COMMIT_AUTHORIZATION', payload.token)
    commit('COMMIT_LOGIN')
  },
  logout({ commit }) {
    commit('COMMIT_LOGOUT')
  },
  SET_USER_INFO({commit}, payload){
    console.log(payload)
    commit('COMMIT_USERNAME', payload.username)
    commit('COMMIT_EMAIL', payload.email)
  }
}

export default {
  state,
  mutations,
  actions
}
