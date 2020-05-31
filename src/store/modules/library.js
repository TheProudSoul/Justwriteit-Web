import http from '@/api'

const state = {
    selectItem: [],
    currentLibrary: { id: 1, name: 'default' },
    currentFile: null,
    fileList: [],
    content: '',
    isChange: false,
    saveFileEvent: false
}

const getters = {
    currentFileTitle: state => (state.currentFile ? state.currentFile.title : 'untitled'),
    contentCount: state => state.content.length
}

const mutations = {
    setSelectItem(state, selectItem) {
        state.selectItem = selectItem
        state.currentFile = selectItem[0]
    },
    publishSaveFileEvent(state) {
        state.saveFileEvent = true
    },
    commitCurrentLibrary(state, currentLibrary) {
        state.currentLibrary = currentLibrary
    },
    commitContent(state, content) {
        state.content = content
    },
    commitFileList(state, fileList) {
        state.fileList = fileList
    },
    setInitial(state, initial) {
        state.initial = initial;
    },
    setChange(state, isChange) {
        state.isChange = isChange
    }
}

const actions = {
    finished_initialiaze({ commit }, initial) {
        commit('setInitial', initial)
    },
    save({ state }, ) {
        if (state.currentFile == null) {

        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
