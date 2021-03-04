<template>
    <div class="not-found" id="not-found">
        <a-result status="404" title="404" sub-title="page not found">
            <template #extra>
                <a-button type="primary" @click="back">
                    回到首页
                </a-button>
            </template>
        </a-result>
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

</style>