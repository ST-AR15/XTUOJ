// 声明通过npm安装的组件等
import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from './router'
import reqwest from 'reqwest';
// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// import VueCodeMirror from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
// Vue.use(Antd,VueCodeMirror)
Vue.use(Antd)
Vue.prototype.$reqwest = reqwest

/**
 * reqwest使用：
 * this.$reqwest({
            url: 'http://172.22.114.116/api/showProblemDetails/1002',
            method: 'get',
            data: {},
            type: 'json'
        }).then(data => {
            console.log(data);
        })
 */

// 声明自己写的文件
import '@/components/antd.css'
import '@/components/tips.css'
import '@/components/animation.css'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
