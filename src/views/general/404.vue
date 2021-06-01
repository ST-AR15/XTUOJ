<template>
    <div class="not-found" id="not-found">
        <p>404 NOT FOUND</p>
        <a-button type="primary" @click="back()">返回首页</a-button>
    </div>
</template>

<script>
export default {
    methods: {
        back() {
            this.$router.push({ name: 'home' });
        }
    }
}
</script>

<style>
.not-found {
    height: 40vh;
    margin-top: 30vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.not-found p {
    font-size: 2.8rem;
}
</style>