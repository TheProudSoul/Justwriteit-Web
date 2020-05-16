const state = {
  username: '',
  userId: 0,
  isLogin: false,
  email: ''
}

const mutations = {
  COMMIT_USERNAME(state, username) {
    state.username = username
    localStorage.setItem('username', username)

  },
  COMMIT_USERID(state, userId) {
    state.userId = userId
    localStorage.setItem('userId', userId)
  },
  COMMIT_EMAIL(state, email) {
    state.email = email
    localStorage.setItem('email', email)
  },
  COMMIT_LOGIN(state) {
    state.isLogin = true
  },
  COMMIT_LOGOUT(state) {
    state.isLogin = false
    state.email = ''
    localStorage.setItem('email', '')
    state.userId = 0
    localStorage.setItem('userId', '')
    state.username = ''
    localStorage.setItem('username', '')


  }
}

const actions = {
  login({ commit, state }, payload) {
    console.log(payload)
    // do something async
    commit('COMMIT_USERNAME', payload.username)
    commit('COMMIT_USERID', payload.id)
    commit('COMMIT_EMAIL', payload.email)
    commit('COMMIT_LOGIN')
  },
  logout({ commit }) {
    commit('COMMIT_LOGOUT')
  }
}

export default {
  state,
  mutations,
  actions
}
