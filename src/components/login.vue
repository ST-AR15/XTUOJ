<template>
    <!-- <transition name="fade"> -->
        <!-- TODO 后续加上合适的动画 -->
        <div class="login" id="login" v-show="visible">
            <div class="login-inner">
                <h2 style="text-align: center">登录</h2>
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
                    <a-form-model-item :wrapper-col="{ span: 14, offset: 9 }">
                        <a-space>
                            <a-button type="primary" @click="login">登录</a-button>
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
            }
            
        }
    },
    methods: {
        login() {
            let that = this;
            const url = "/api/users/login";
            let info = {
                StudentID: that.loginForm.account,
                password: that.loginForm.password,
            };
            console.log(info);
            that.$axios.post(url,info).then(rep => {
                console.log(rep);
                sessionStorage.token = rep.token;
                that.$message.success('登录成功');
            })
        },
        cancel() {
            // this.visible = false;
            this.$emit('close');
        },
        success() {
            this.$emit('ok');
        }
    }
}
</script>

<style>
.login {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1999;
    background-color: rgba(77, 77, 77, .7);
}
.login-inner {
    width: 500px;
    height: 300px;
    padding-top: 40px;
    position: relative;
    top: 240px;
    z-index: 2000;
    margin: 0 auto;
    border: 1px solid rgb(64,169,255);
    border-radius: 12px;
    backdrop-filter: blur(3px);
}
</style>