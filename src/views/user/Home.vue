<template>
    <div class="home user-container" id="home">
        <div class="home-header">
            <h2 style="font-size: 22px">欢迎使用湘潭大学OJ系统！</h2>
        </div>
        <div class="home-container">
            <div class="home-left">
                <a-timeline>
                    <a-timeline-item v-for="(item, i) in timer" :key="i" :color="item.color">
                        <p style="margin: 0">{{ item.time }}</p>
                        <p style="margin: 0">{{ item.content }}</p>
                    </a-timeline-item>
                </a-timeline>
            </div>
            <div class="home-right">
                <a-list item-layout="horizontal" :data-source="announcements">
                    <a-list-item slot="renderItem" slot-scope="item">
                        <a-list-item-meta>
                            <span slot="title">{{ item.title }}</span>
                            <span slot="description" v-html="item.description"></span>
                        </a-list-item-meta>
                        <span style="margin-left: 30px">{{ item.time }}</span>
                    </a-list-item>
                </a-list>
            </div>
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
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
                {
                    time: "2021-03-14",
                    title: '测试专用题目1013',
                    description: "直接跳转到<a href='/#/problems/1013'>1013题</a>!",
                },
            ],
        }
    },
}
</script>

<style>
    .home {
        padding: 10px 0;
    }
    .home-header {
        background-color: #FFFFFF;
        height: 48px;
        line-height: 48px;
        padding-left: 32px;
    }
    .home-container {
        height: calc(100% - 48px);
        display: flex;
        position: relative;
        justify-content: space-between;
        padding: 10px 0;
    }
    .home-left {
        width: 200px;
        min-width: 200px;
        background-color: #FFFFFF;
        padding: 20px;
        overflow: auto;
    }
    .home-right {
        width: calc(100% - 220px);
        background-color: #FFFFFF;
        padding: 0 20px 20px 20px;
        overflow: auto;
    }
</style>