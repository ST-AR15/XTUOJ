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
    console.log(error.response);
    message.error('请求错误，' + (error.response.data.data || error.response.data.message || error.response.statusText));
    return Promise.reject(error);
})
// 响应拦截器，拦截获得的响应
axios.interceptors.response.use((res) => {
    
    return res;
},error => {
    console.log(error.response);
    message.error('响应错误，' + (error.response.data.data || error.response.data.message || error.response.statusText));
    return Promise.reject(error)
})