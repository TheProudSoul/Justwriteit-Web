const state = {
    doc:''
  }
  
  const mutations = {
    COMMIT_DOC(state, doc) {
      state.doc = doc  
    },
  }
  
  const actions = {
    storeFileInfo({ commit }, doc) {
      commit('COMMIT_DOC',doc)
    }
  }
  
  export default {
    state,
    mutations,
    actions
  }
  