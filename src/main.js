// 声明通过npm安装的组件等
import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from '@/router'
import axios from 'axios'
import VueCodeMirror from 'vue-codemirror'
import store from './store'
import 'codemirror/lib/codemirror.css'


Vue.use(Antd, VueCodeMirror)
Vue.prototype.$axios = axios
// 允许使用的编译器
Vue.prototype.$language = {
    name: [],
    num: [],
};
Vue.prototype.$judge = ["AcmMode", "OiMode", "HalfOiMode"];
// result数字的含义,负数用了下划线
Vue.prototype.$resultText = {
    "-2": "Judging",
    "-1": "ACCEPT",
    0: "WAITING",
    1: "WRONG_ANSWER",
    2: "TIME_LIMIT_EXCEEDED",
    3: "MEMORY_LIMIT_EXCEEDED",
    4: "RUNTIME_ERROR",
    5: "SYSTEM_ERROR",
    6: "COMPILE_ERROR",
    7: "RUNNED",
    8: "OUTPUT_LIMIT_EXCEEDED",
    9: "PRESENTATION_ERROR",
    10:"Test_ERROR",
};

// 声明自己写的文件
// 样式
import '@/styles/antd.css'
import '@/styles/tips.css'
import '@/styles/animation.css'
import '@/styles/mavonEditor.css'
import '@/styles/globle.css'
// js
import '@/utils/axiosConfig'


Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
