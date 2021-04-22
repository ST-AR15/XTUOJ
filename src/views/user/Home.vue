<template>
    <div class="home" id="home">
        <div class="container">
            <a-layout-header style="background-color: #FFFFFF;margin: 0 10px">
                <h2 style="font-size: 22px">通知</h2>
            </a-layout-header>
            <a-layout style="height: calc(100vh - 200px)">
                <a-layout-sider style="padding: 20px;margin: 10px; background-color: #FFFFFF;min-height: calc(100vh - 220px);height: calc(100vh - 220px); overflow-y: scroll">
                    <a-timeline>
                        <a-timeline-item v-for="(item, i) in timer" :key="i" :color="item.color">
                            <p style="margin: 0">{{ item.time }}</p>
                            <p style="margin: 0">{{ item.content }}</p>
                        </a-timeline-item>
                    </a-timeline>
                </a-layout-sider>
                <a-layout-content style="padding: 0 20px; background-color: #FFFFFF; margin: 10px">
                    <a-list item-layout="horizontal" :data-source="announcements">
                        <a-list-item slot="renderItem" slot-scope="item">
                            <a-list-item-meta>
                                <span slot="description" v-html="item.description"></span>
                                <span slot="title">{{ item.title }}</span>
                            </a-list-item-meta>
                            <span>{{ item.time }}</span>
                        </a-list-item>
                    </a-list>
                </a-layout-content>
            </a-layout>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            timer: [
                {
                    color: 'green',
                    time: "2020-11-13",
                    content: "项目创建",
                },
                {
                    color: 'red',
                    time: "2021-01-01",
                    content: "项目遇到了挫折，进行调整"
                },
                {
                    color: 'blue',
                    time: "2021-03-31",
                    content: "项目中期检查",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "答辩",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "好长好长好长好长好长好长好长好长好长的文本",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "更多的文本",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "更多的文本",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "更多的文本",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "更多的文本",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "更多的文本",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "更多的文本",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "更多的文本",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "更多的文本",
                },
                {
                    color: 'red',
                    time: "2021-05-25",
                    content: "更多的文本",
                },
                
                
            ],
            announcements: [
                {
                    time: "2021-03-14",
                    title: '最新添加题目1007！',
                    description: "试着做一做<a href='/#/problems/1007'>1007题</a>吧~",
                },
                {
                    time: "2021-03-14",
                    title: '湘大OJ正式开放！',
                    description: "湘大自主研发的OJ已经开放了，大家愉快地使用吧~",
                },
                {
                    time: "2021-03-14",
                    title: "联系我们",
                    description: "湘大新OJ前端制作者<a href='tel:13975703258'>电话号码13975703258</a>，<a href='mailto:slighttt@qq.com'>邮箱slighttt@qq.com</a>，欢迎联系~",
                },
                {
                    time: "2021-03-14",
                    title: "意见与建议",
                    description: "请联系上面的电话和邮箱~",
                },
                {
                    time: "2021-03-14",
                    title: "开源",
                    description: "本前端项目开源于<a target='_blank' href='http://www.github.com/ST-AR15/XTUOJ'>github</a>",
                },
                {
                    time: "2021-03-14",
                    title: "很长的文本",
                    description: "好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊好长啊",
                },
                {
                    time: "2021-03-14",
                    title: "很多的文本",
                    description: "好多啊好多",
                },
                {
                    time: "2021-03-14",
                    title: "很多的文本",
                    description: "好多啊好多",
                },
                {
                    time: "2021-03-14",
                    title: "很多的文本",
                    description: "好多啊好多",
                },
                {
                    time: "2021-03-14",
                    title: "很多的文本",
                    description: "好多啊好多",
                },
                {
                    time: "2021-03-14",
                    title: "很多的文本",
                    description: "好多啊好多",
                },
                {
                    time: "2021-03-14",
                    title: "很多的文本",
                    description: "好多啊好多",
                },
                {
                    time: "2021-03-14",
                    title: "很多的文本",
                    description: "好多啊好多",
                },
                {
                    time: "2021-03-14",
                    title: "很多的文本",
                    description: "好多啊好多",
                },
                
            ],
        }
    },
}
</script>

<style scoped>
    .home {
        margin-top: 10px;
    }
    .ant-table-title {
        padding: 10px 20px;
    }
</style>