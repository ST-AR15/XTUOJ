<template>
    <div class="app" id="app">
        <a-config-provider :locale="zh_CN">
            <router-view/>
        </a-config-provider>
    </div>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
    data() {
        return {
            zh_CN,
        }
    },
    mounted() {
        // 获取language值
        const url = '/api/config';
        this.$axios.get(url).then(rep => {
            const data = rep.data.data;
            for(let i in data) {
                this.$language.name[i] = data[i].name;
                this.$language.num[i] = data[i].LanguageNum;
            }
            console.log(this.$language);
        })
        try {
            // 移除加载器
            document.body.removeChild(document.getElementById('app-loader'));
        } catch(e) {
            return e;
        }
    }
}
</script>

<style>
</style>