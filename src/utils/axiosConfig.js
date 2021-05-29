import axios from 'axios'
// import Vue from 'vue'
import { message } from 'ant-design-vue'
axios.defaults.timeout = 10000;
axios.defaults.baseURL = "http://172.22.114.116:8887"
axios.defaults.headers.common['Authorization'] = "Bearer" + sessionStorage.getItem('token');


// 请求拦截器，请求发生前发生的事
axios.interceptors.request.use((req) => {
    req.headers["Authorization"] = "Bearer" + sessionStorage.getItem('token');
    return req;
},error => {
    if(error.response) {
        message.error('请求错误，' + (error.response.data.data || error.response.data.message || error.response.statusText));
    } else if(error) {
        message.error(error.message);
    } else {
        message.error('error');
    }
    return Promise.reject(error);
})
// 响应拦截器，拦截获得的响应
axios.interceptors.response.use((res) => {
    
    return res;
},error => {
    if(error.response) {
        message.error('响应错误，' + (error.response.data.data || error.response.data.message || error.response.statusText));
    } else if(error) {
        message.error(error.message);
    } else {
        message.error('error');
    }
    if(error.response.status == 401) {
        console.log('response', error.response);
        console.log('config', error.response.config);
        message.error(error.response.config.headers.Authorization);
    }
    return Promise.reject(error)
})