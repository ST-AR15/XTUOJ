import axios from 'axios'
// import Vue from 'vue'
import store from '@/store'
import { notification } from 'ant-design-vue'
axios.defaults.timeout = 10000;
axios.defaults.baseURL = "http://47.106.68.121:8887"
axios.defaults.headers.common['Authorization'] = "Bearer" + store.state.token;


// 请求拦截器，请求发生前发生的事
axios.interceptors.request.use((req) => {
    req.headers["Authorization"] = "Bearer" + store.state.token; 
    return req;
},error => {
    notification.open({
        message: error.message,
        description: '出现请求错误，请检查自己的网络连接或联系管理员。\r\n' + 'url: ' + error.config.url,
        duration: 0,
    });
    return Promise.reject(error);
})
// 响应拦截器，拦截获得的响应
axios.interceptors.response.use((res) => {
    
    return res;
},error => {
    notification.open({
        message: error.message,
        description: `响应错误，请检查自己的网络连接或联系管理员。url:${ error.config.url }；\r\nres:${ error.response.data.data }`,
        duration: 0,
    });
    // console.log(error);
    console.log(error.response);
    // console.log(error.config);
    // console.log(error.data);
    // console.log(Promise.reject(error));
    return Promise.reject(error)
})