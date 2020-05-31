import http from './http'
import store from '@/store'

const url = "api"

export function fetchContent(path) {
    return http({
        url: `${url}/file-system/${store.state.account.userId}/file`,
        method: 'get',
        params: { path: path }
    })
}

export function retrieve(path) {
    return `${require('@/config.json').server}/file/${store.state.account.userId}/retrieve?path=${path}`
}

export function listFileSystem() {
    return http({
        url: `${url}/file-system/${store.state.account.userId}`,
        method: 'get'
    })
}