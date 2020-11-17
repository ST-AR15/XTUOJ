<template>
    <div class="read" id="read">
        
        <a-pagination
            show-quick-jumper
            v-model="current"
            :total="total"
            :pageSize="pageSize"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            total: 500,    //总题目数量
            pageSize:10,   //每页题目数量
            current:1,     //当前页码

        }
    }
}
</script>

<style>

</style>