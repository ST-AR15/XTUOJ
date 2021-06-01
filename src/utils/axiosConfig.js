import axios from 'axios'
// import Vue from 'vue'
import { message } from 'ant-design-vue'
import store from '.././store'
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
    console.log(error);
    if(error.response) {
        if(error.response.status == 401) {
            if(localStorage.getItem('account') && localStorage.getItem('password')) {
                message.info('未登录或登录超时，正在自动重新登录');
                const url = "/api/users/login";
                let info = {
                    StudentID: localStorage.getItem('account'),
                    password: localStorage.getItem('password'),
                };
                axios.post(url, info).then(rep => {
                    const data = rep.data.data;
                    if(!data.token) {
                        this.$message.error(data);
                    } else {
                        store.commit('setUid', data.Uid);
                        store.commit('setToken', data.token);
                        sessionStorage.setItem('uid', data.Uid);
                        sessionStorage.setItem('token', data.token);
                        message.success(`自动登录成功!欢迎您,${ sessionStorage.getItem('uid') }`);
                    }
                }).catch(e => {
                    message.info('自动登录失败');
                    return e;
                })
            } else {
                message.info('请登录！');
            }
            console.log('response', error.response);
        } else {
            message.error('响应错误，' + (error.response.data.data || error.response.data.message || error.response.statusText));
        }
    } else if(error) {
        message.error(error.message);
    } else {
        message.error('error');
    }
    return Promise.reject(error)
})