import request from './http'

export function listFileSystem(user) {
    return request({
        url: `/api/file-system/${user}`,
        method: 'get'
    })
}

export function readFile(user, pathName) {
    return request({
        url: `/api/file-system/${user}/file`,
        method: 'get',
        params: {
            path: pathName
        }
    })
}

export function commitDelete(userId, pathName, isDir) {
    return request({
        url: `/commit-delete`,
        method: 'post',
        data: {
            userId: userId,
            path: pathName,
            dir: isDir
        }
    })
}

export function commitEdit(userId, pathName, data) {
    return request({
        url: `/commit-edit`,
        method: 'post',
        data: {
            userId: userId,
            path: pathName,
            data: data
        }
    })
}

export function commitAdd(userId, pathName, isDir) {
    return request({
        url: `/commit-add`,
        method: 'post',
        data: {
            userId: userId,
            path: pathName,
            dir: isDir
        }
    })
}

export function retrieve(user, pathName) {
    return `http://47.115.40.131:9995/file/${user}/retrieve?path=${pathName}`
    // return request({
    //     url: `/file/${user}/retrieve`,
    //     method: 'get',
    //     params: {
    //         path: pathName
    //     }
    // })
}