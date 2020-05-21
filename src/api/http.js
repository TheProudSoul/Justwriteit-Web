import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import router from '../router'

// create an axios instance
const service = axios.create({
    // baseURL: 'http://47.115.40.131:9999', // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout

  })
  
service.defaults.headers.common['Content-Type']='application/json;charset=UTF-8'

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.data = JSON.stringify(config.data);
    if(config.headers['Content-Type'])
    config.headers = {
        'Content-Type': 'application/json;charset=UTF-8'
    }
    return config;
}, function (error) {
    // Do something with request error
    console.log(error)
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    console.log(response)
    // Do something with response data
    const res = response.data
    // if(res.status!=1){
    //     Message:({
    //         message:res.errorMessage||'Error',
    //         type:'error',
    //         duration:5*1000
    // })
    // }
    if (res.status == 401) {
        router.push({
            path: "/login",
            querry: {
                redirect: router.currentRoute.fullPath
            } //从哪个页面跳转
        })
    }
    return res;
}, function (error) {
    // Do something with response error
    console.log('err' + error) // for debug
    // Message({
    //     message: error.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    return Promise.reject(error);
});

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
// export function fetch(url, params = {}) {
//     return new Promise((resolve, reject) => {
//         axios.get(url, {
//                 params: params
//             })
//             .then(response => {
//                 resolve(response.data);
//             })
//             .catch(err => {
//                 reject(err)
//             })
//     })
// }


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
// export function post(url, data = {}) {
//     return new Promise((resolve, reject) => {
//         axios.post(url, data)
//             .then(response => {
//                 resolve(response.data);
//             }, err => {
//                 reject(err)
//             })
//     })
// }

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
// export function patch(url, data = {}) {
//     return new Promise((resolve, reject) => {
//         axios.patch(url, data)
//             .then(response => {
//                 resolve(response.data);
//             }, err => {
//                 reject(err)
//             })
//     })
// }

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
// export function put(url, data = {}) {
//     return new Promise((resolve, reject) => {
//         axios.put(url, data)
//             .then(response => {
//                 resolve(response.data);
//             }, err => {
//                 reject(err)
//             })
//     })
// }
export default service