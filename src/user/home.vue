<template>
    <div class="home" id="home">
        <questionlist />
    </div>
</template>

<script>
import questionlist from '../components/questionlist.vue'
export default {
  components: { questionlist },
    data() {
        return {
            
        }
    },
    methods: {
        
    }
}
</script>

<style>
    .home * {
        font-size: 15px;
        letter-spacing: 1px;
    }
    .home .ant-table-title {
        padding: 10px 20px;
    }
    .highlight {
        background-color: rgb(255, 192, 105);
        padding: 0px;
    }
</style>