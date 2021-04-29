<template>
    <div class="balloon" id="balloon">
        <h1 v-text="title + ' - 气球管理'"></h1>
        <div class="ballon-table">
            <a-table
                :data-source="ballon"
                :columns="columns"
                :pagination="pagination"
            >
                <span slot="color" slot-scope="text">
                    <svg :style="{ 'height': '1em', 'vertical-align': '-0.225em', 'color': text}" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"><path fill="currentColor" d="M96 416h224c0 17.7-14.3 32-32 32h-16c-17.7 0-32 14.3-32 32v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-20c0-17.7-14.3-32-32-32h-16c-17.7 0-32-14.3-32-32zm320-208c0 74.2-39 139.2-97.5 176h-221C39 347.2 0 282.2 0 208 0 93.1 93.1 0 208 0s208 93.1 208 208zm-180.1 43.9c18.3 0 33.1-14.8 33.1-33.1 0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1zm49.1 46.9c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1zm64-64c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1z"></path></svg>
                </span>
                <span slot="button" slot-scope="text, record">
                    <a-button type="primary" @click="handleGrant(record)">前往发放</a-button>
                </span>
            </a-table>
        </div>
        <a-modal
            :visible = "modal.visible"
            :title = "modal.title"
            @cancel = "modal.visible = false"
        >
            <p>在把气球
                <svg :style="{ 'height': '1em', 'color': modal.color}" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"><path fill="currentColor" d="M96 416h224c0 17.7-14.3 32-32 32h-16c-17.7 0-32 14.3-32 32v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-20c0-17.7-14.3-32-32-32h-16c-17.7 0-32-14.3-32-32zm320-208c0 74.2-39 139.2-97.5 176h-221C39 347.2 0 282.2 0 208 0 93.1 93.1 0 208 0s208 93.1 208 208zm-180.1 43.9c18.3 0 33.1-14.8 33.1-33.1 0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1zm49.1 46.9c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1zm64-64c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1z"></path></svg>
                发放到{{ '   ' + modal.seat + '   ' }}号座位后，请在这里确定</p>
        </a-modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: "第1届湘潭大学程序设计竞赛正式赛",
            ballon: [
                {
                    color: "rgb(255, 0, 0)",
                    school: "湘潭大学",
                    team: "七海千秋1",
                    seat: 405,
                },
                {
                    color: "rgb(255, 0, 0)",
                    school: "湘潭大学",
                    team: "七海千秋2",
                    seat: 401,
                },
                {
                    color: "rgb(255, 0, 0)",
                    school: "湘潭大学",
                    team: "七海千秋3",
                    seat: 402,
                },
                {
                    color: "rgb(255, 0, 0)",
                    school: "湘潭大学",
                    team: "七海千秋4",
                    seat: 403,
                },
                {
                    color: "rgb(255, 0, 0)",
                    school: "湘潭大学",
                    team: "七海千秋5",
                    seat: 404,
                },
                {
                    color: "rgb(255, 0, 0)",
                    school: "湘潭大学",
                    team: "七海千秋6",
                    seat: 406,
                },
                {
                    color: "rgb(255, 0, 0)",
                    school: "湘潭大学",
                    team: "七海千秋7",
                    seat: 407,
                },
            ],
            columns: [
                {
                    title: "学校",
                    dataIndex: "school",
                },
                {
                    title: "队伍名",
                    dataIndex: "team",
                },
                {
                    title: "座位号",
                    dataIndex: "seat",
                },
                {
                    title: "气球",
                    dataIndex: "color",
                    scopedSlots: { customRender: 'color' },
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: 'button' },
                }
            ],
            pagination: {       // 页面设置
                pageSize:5,     // 每页题目数量
                showQuickJumper: true,  // 快速跳转
            },
            modal: {
                visible: false,
                title: "发放气球",
                seat: 40,
                color: 'rgb(0, 255, 0)'
            },
        }
    },
    methods: {
        handleGrant(info) {
            this.modal.visible = true;
            this.modal.seat = info.seat;
            this.modal.color = info.color;
        }
    }
}
</script>

<style>
.balloon {
    width: 95%;
    margin: 0 auto;
    min-width: 1400px;
}
</style>