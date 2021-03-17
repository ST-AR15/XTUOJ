import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        uid: null,
        token: null,
    },
    mutations: {
        // 设置UID
        setUid (state, uid) {
            state.uid = uid;
        },
        // 设置token
        setToken(state, token) {
            state.token = token;
        }
    }
})

export default store;