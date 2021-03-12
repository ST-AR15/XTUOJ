<template>
    <!-- <transition name="fade"> -->
        <!-- TODO 后续加上合适的动画 -->
        <div class="login" id="login" v-show="visible">
            <div class="login-inner">
                <h2 style="text-align: center" v-text="!isRegister? '登录':'注册'"></h2>
                <a-form-model
                    ref="login"
                    :model="loginForm"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-model-item label="帐号">
                        <a-input 
                            v-model="loginForm.account"
                            placeholder="请输入账号"   
                        ></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="密码">
                        <a-input-password 
                            v-model="loginForm.password"
                            placeholder="请输入密码"   
                            autocomplete
                        ></a-input-password>
                    </a-form-model-item>
                    <transition name="height">
                        <a-form-model-item label="姓名" v-show="isRegister">
                            <a-input 
                                v-model="loginForm.name"
                                placeholder="请输入姓名"   
                            ></a-input>
                        </a-form-model-item>
                    </transition>
                    <transition name="height">
                        <a-form-model-item label="专业" v-show="isRegister">
                            <a-input 
                                v-model="loginForm.profession"
                                placeholder="请输入专业"   
                            ></a-input>
                        </a-form-model-item>
                    </transition>
                    <transition name="height">
                        <a-form-model-item label="年龄" v-show="isRegister">
                            <a-input-number
                                v-model="loginForm.age"
                                placeholder="请输入年龄"   
                            ></a-input-number>
                        </a-form-model-item>
                    </transition>
                    <a-form-model-item :wrapper-col="{ span: 14, offset: 7 }">
                        <a-space>
                            <a-button type="primary" @click="confirm" v-text="isRegister? '确认': '登录'"></a-button>
                            <a-button type="primary" @click="register" v-text="isRegister? '直接登录': '前往注册'"></a-button>
                            <a-button type="danger" @click="cancel">取消</a-button>
                        </a-space>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </div>
    <!-- </transition> -->
</template>

<script>
export default {
    props: {
        visible: Boolean,
    },
    data() {
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            loginForm: {
                account: "",
                password: "",
                name: "",
                profession: "",
                Age: "",
            },
            isRegister: false,
            
        }
    },
    methods: {
        confirm() {
            let that = this;
            // 分登录和注册
            if(!that.isRegister) {  // 登录
                const url = "/api/users/login";
                let info = {
                    StudentID: that.loginForm.account,
                    password: that.loginForm.password,
                };
                console.log(info);
                that.$axios.post(url,info).then(rep => {
                    console.log(rep);
                    this.$store.commit('setUid', rep.data.data.Uid);
                    this.$store.commit('setToken', rep.data.data.token);
                    that.$message.success('登录成功');
                    this.$emit('close');
                    this.$emit('ok');
                })
            } else {  // 注册
                const url = "/api/users/register";
                let info = {
                    StudentID: that.loginForm.account,
                    password: that.loginForm.password,
                    Name: that.loginForm.name,
                    Profession: that.loginForm.profession,
                    Age: that.loginForm.age,
                };
                that.$axios.post(url, info).then(rep => {
                    if(Math.floor(rep.status / 100) == 2) { // 2开头表示成功
                        // 成功则登录
                        that.isRegister = false;
                        that.confirm();
                    }else {
                        // 否则提示 ..好像不是2开头都不会到这来，会被拦截
                        that.$message.error(rep.data.data);
                    }
                })
            }
            
        },
        cancel() {
            // this.visible = false;
            this.$emit('close');
        },
        register() {
            this.isRegister = !this.isRegister;
        },
    },
}
</script>

<style>
.login {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1499;
    background-color: rgba(77, 77, 77, .7);
}
.login-inner {
    padding-top: 15px;
    width: 500px;
    z-index: 2000;
    margin: 0 auto;
    border: 1px solid rgb(64,169,255);
    border-radius: 12px;
    backdrop-filter: blur(3px);
}
</style>