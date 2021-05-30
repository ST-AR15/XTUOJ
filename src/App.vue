<template>
    <div class="app" id="app">
        <a-config-provider :locale="zh_CN">
            <transition name="cross">
                <router-view />
            </transition>
        </a-config-provider>
    </div>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
    data() {
        return {
            zh_CN,
        }
    },
    mounted() {
        // 获取language值
        const url = '/api/config';
        this.$axios.get(url).then(rep => {
            const data = rep.data.data;
            for(let i in data) {
                this.$language.name[i] = data[i].name;
                this.$language.num[i] = data[i].LanguageNum;
            }
        })
        // 如果没有登录，自动登录
        // 情况1:session没有,那就是初次加载页面
        if(!sessionStorage.getItem('uid') && localStorage.getItem('account') && localStorage.getItem('password')) {
            const url = "/api/users/login";
            let info = {
                StudentID: localStorage.getItem('account'),
                password: localStorage.getItem('password'),
            };
            this.$axios.post(url, info).then(rep => {
                const data = rep.data.data;
                if(!data.token) {
                    this.$message.error(data);
                } else {
                    this.$store.commit('setUid', data.Uid);
                    this.$store.commit('setToken', data.token);
                    sessionStorage.setItem('uid', data.uid);
                    sessionStorage.setItem('token', data.token);
                    this.$message.success(`登录成功!欢迎您,${ data.Uid }`);
                }
            }).catch(e => {
                this.$message.info('自动登录失败');
                return e;
            })    
        }else if(sessionStorage.getItem('uid') && !this.$store.state.uid) {
            // 另一种情况:session有但是$store没有,说明是刷新
            this.$store.commit('setUid', sessionStorage.getItem('uid'));
            this.$store.commit('setToken', sessionStorage.getItem('token'));
        }
        // 移除加载器
        try {
            document.body.removeChild(document.getElementById('app-loader'));
        } catch(e) {
            return e;
        }
    }
}
</script>

<style>
</style>