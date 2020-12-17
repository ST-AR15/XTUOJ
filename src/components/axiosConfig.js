import axios from 'axios'
import { notification } from 'ant-design-vue'
// 请求拦截器，请求发生前发生的事
// todo 两个拦截器的icon都不对
axios.interceptors.request.use((req) => {
    
    return req;
},error => {
    notification.open({
        message: error.message,
        description: '出现请求错误，请检查自己的网络连接或联系管理员。' + 'url: ' + error.config.url,
        duration: 0,
        icon: '×',
    });
    return Promise.reject(error);
})
// 响应拦截器，拦截获得的响应
axios.interceptors.response.use((res) => {
    
    return res;
},error => {
    notification.open({
        message: error.message,
        description: '出现网络错误，请检查自己的网络连接或联系管理员。' + 'url: ' + error.config.url,
        duration: 0,
        icon: '×',
    });
    console.log(error);
    return Promise.reject(error)
})