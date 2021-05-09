<template>
    <div class="admin-user-me" id="admin-user-me">
        <a-button type="danger" @click="logout">退出登录</a-button>
    </div>
</template>

<script>
export default {
    methods: {
        logout() {
            let that = this;
            let url = "/api/users/logout";
            that.$axios.get(url).then(rep => {
                that.$message.success(rep.data.data);
                // 登出成功，去掉token和uid，然后返回主页面
                sessionStorage.removeItem('uid');
                sessionStorage.removeItem('token');
                // sessionStorage.uid = undefined;
                // sessionStorage.token = undefined;
                that.$router.replace("/#");
            })
        }
    }
}
</script>

<style>
</style>