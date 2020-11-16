<template>
    <div class="index" id="index">
        <h1>湘大OJ - 测试版</h1>
        <router-link to="/admin">管理员端</router-link> |
        <router-link to="/user">用户端</router-link>
        <router-view/>
    </div>
</template>

<script>
export default {

}
</script>

<style>
    #index {
        text-align: center;
        font-size: 22px;
    }
</style>