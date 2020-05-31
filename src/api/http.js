import axios from 'axios'

// create an axios instance
const http = axios.create({
    baseURL: require('@/config.json').server, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 10000, // request timeout
    headers: {
        // 'Content-Type': 'application/json;charset=UTF-8',
        // 'Authorization': `Super Knowledge ${localStorage.getItem('Authorization')}`
    }
})

// http.defaults.headers.common['Authorization'] = `Super Knowledge ${localStorage.getItem('Authorization')}`

http.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers['Authorization'] = `Super Knowledge ${localStorage.getItem('Authorization')}`
    if (!config.url.includes('image') && config.method == 'post') {
        config.headers['Content-Type'] = 'application/json'
        config.data = JSON.stringify(config.data);
    } else {
        config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config;
}, function (error) {
    // Do something with request error
    console.log(error)
    return Promise.reject(error);
});

http.interceptors.response.use(function (res) {
    // console.log(res.data)
    // Do something with response data
    // const res = response.data
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
            query: {
                redirect: router.currentRoute.fullPath
            } //从哪个页面跳转
        })
    }
    return res.data;
}, function (error) {

    return Promise.reject(error)
})

export default http