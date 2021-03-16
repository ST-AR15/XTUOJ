<template>
    <div class="home" id="home">
        <a-layout-header style="background-color: #FFFFFF;">
            <h2 style="font-size: 22px">通知</h2>
        </a-layout-header>
        <a-layout>
            <a-layout-sider style="padding: 20px;margin: 10px; border-right: 1px solid #888888">
                <a-timeline>
                    <a-timeline-item v-for="(item, i) in timer" :key="i" :color="item.color">
                        <p style="margin: 0">{{ item.time }}</p>
                        <p style="margin: 0">{{ item.content }}</p>
                    </a-timeline-item>
                </a-timeline>
            </a-layout-sider>
            <a-layout-content style="padding: 0 10px">
                <a-list item-layout="horizontal" :data-source="announcements">
                    <a-list-item slot="renderItem" slot-scope="item">
                        <a-list-item-meta :description="item.description">
                            <span slot="title">{{ item.title }}</span>
                        </a-list-item-meta>
                        <span>{{ item.time }}</span>
                    </a-list-item>
                </a-list>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
export default {
    data() {
        return {
            timer: [
                {
                    color: 'green',
                    time: "2021-03-04",
                    content: "考试",
                },
                {
                    color: 'red',
                    time: "2021-03-05",
                    content: "考试"
                },
                {
                    color: 'blue',
                    time: "2021-03-06",
                    content: "考试",
                },
                {
                    color: 'green',
                    time: "2021-03-07",
                    content: "考试",
                },
                {
                    color: 'green',
                    time: "2021-03-08",
                    content: "考试",
                },
            ],
            announcements: [
                {
                    time: "2021-03-14",
                    title: '考试',
                    description: "2021届网络工程期末考试",
                },
                {
                    time: "2021-03-14",
                    title: "考试",
                    description: "2021届网络工程期末考试",
                },
                {
                    time: "2021-03-14",
                    title: "考试",
                    description: "2021届网络工程期末考试",
                },
                {
                    time: "2021-03-14",
                    title: "考试",
                    description: "2021届网络工程期末考试",
                },
                {
                    time: "2021-03-14",
                    title: "考试",
                    description: "2021届网络工程期末考试",
                },
                {
                    time: "2021-03-14",
                    title: "考试",
                    description: "2021届网络工程期末考试",
                },
            ],
        }
    },
}
</script>

<style>
.home {
    max-width: 98%;
    margin: 10px auto;
    position: relative !important;
}
</style>