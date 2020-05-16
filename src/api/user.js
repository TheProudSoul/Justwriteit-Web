import request from './http'

export function login(data) {
    return request({
        url: '/account/login',
        method: 'post',
        data
    })
}

export function registration(data) {
    return request({
        url: '/account/registration',
        method: 'post',
        data
    })
}

export function sendResetLink(email) {
    return request({
        url: '/account/resendRegistrationToken',
        method: 'get',
        params: email
    })
}