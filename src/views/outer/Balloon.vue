<template>
    <div class="balloon" id="balloon">
        <a-spin :spinning="loading">
            <h1 v-text="title + ' - 气球管理'"></h1>
            <div class="ballon-table">
                <a-table
                    :data-source="ballon"
                    :columns="columns"
                    :pagination="pagination"
                    rowKey="Jid"
                >
                    <span slot="color" slot-scope="text, record">
                        <span v-if="record.isFB">FB气球  </span>
                        <svg :style="{ 'height': '1em', 'vertical-align': '-0.225em', 'color': text}" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"><path fill="currentColor" d="M96 416h224c0 17.7-14.3 32-32 32h-16c-17.7 0-32 14.3-32 32v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-20c0-17.7-14.3-32-32-32h-16c-17.7 0-32-14.3-32-32zm320-208c0 74.2-39 139.2-97.5 176h-221C39 347.2 0 282.2 0 208 0 93.1 93.1 0 208 0s208 93.1 208 208zm-180.1 43.9c18.3 0 33.1-14.8 33.1-33.1 0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1zm49.1 46.9c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1zm64-64c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1z"></path></svg>
                    </span>
                    <span slot="button" slot-scope="text, record">
                        <a-space>
                            <a-button type="primary" @click="querySend(record)" :disabled="record.isSend == 1">前往发放</a-button>
                            <a-button type="primary">打印</a-button>
                        </a-space>
                        
                    </span>
                </a-table>
            </div>
            <a-modal
                :visible = "modal.visible"
                :title = "modal.title"
                @cancel = "modal.visible = false"
                @ok = "modal.visible = false"
            >
                <p>在把气球
                    <svg :style="{ 'height': '1em', 'color': modal.color}" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"><path fill="currentColor" d="M96 416h224c0 17.7-14.3 32-32 32h-16c-17.7 0-32 14.3-32 32v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-20c0-17.7-14.3-32-32-32h-16c-17.7 0-32-14.3-32-32zm320-208c0 74.2-39 139.2-97.5 176h-221C39 347.2 0 282.2 0 208 0 93.1 93.1 0 208 0s208 93.1 208 208zm-180.1 43.9c18.3 0 33.1-14.8 33.1-33.1 0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1zm49.1 46.9c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1zm64-64c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1z"></path></svg>
                    发放到{{ '   ' + modal.seat + '   ' }}号座位</p>
            </a-modal>
        </a-spin>
    </div>
</template>

<script>
import { insertArray } from "@/utils/tools.js"
export default {
    data() {
        return {
            title: "第1届湘潭大学程序设计竞赛正式赛",
            loading: false,
            ballon: [],
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
                pageSize:15,     // 每页题目数量
                showQuickJumper: true,  // 快速跳转
            },
            modal: {
                visible: false,
                title: "发放气球",
                seat: 40,
                color: 'rgb(0, 255, 0)',
                isFB: false,
            },
            fbCheck: [],
            timer: "",
        }
    },
    methods: {
        querySend(info) {
            const url = `/api/contest/${ this.$route.params.CID }/balloon`;
            const params = {
                Jid: info.Jid,
                IsSend: info.isSend,
            }
            this.$axios.put(url, params).then(rep => {
                if(rep.data.status == true) {
                    this.modal.visible = true;
                    this.modal.seat = info.seat;
                    this.modal.color = info.color;
                } else {
                    this.$message.info(rep.data.data);
                }
            })

        }
    },
    mounted: function() {
        let that = this;
        that.loading = true;
        that.ballon = [];
        that.fbCheck = [];
        const url = `/api/contest/${ that.$route.params.CID }/balloon`;
        that.$axios.get(url).then(rep => {
            const data = rep.data.data;
            let balloonNeed = [];
            let balloonSend = [];
            for(let i in data) {
                let fb;
                if(!that.fbCheck.find(o => o == data[i].c_pid)) {
                    // 没找到说明是一血
                    fb = true;
                    that.fbCheck.push(data[i].c_pid);
                } else {
                    fb = false;
                }
                const item = {
                    color: data[i].Color,
                    school: data[i].ClassNum,
                    team: data[i].Name,
                    seat: data[i].SeatNum,
                    Jid: data[i].Jid,
                    isSend: data[i].IsSend,
                    isFB: fb,
                }
                if(data[i].IsSend == 1) {
                    balloonSend.push(item);
                } else {
                    balloonNeed.push(item);
                }
            }
            that.ballon = balloonNeed.concat(balloonSend);
            that.loading = false;
        })
        this.timer = setInterval(function() {
            const url = `/api/contest/${ that.$route.params.CID }/balloon`;
            that.$axios.get(url).then(rep => {
                const data = rep.data.data;
                for(let i in data) {
                    let newArr = [];
                    if(i < that.ballon.length) {
                        // 如果是原有的，就只看有没有发
                        that.ballon[that.ballon.findIndex(o => o.Jid == data[i].Jid)].isSend == data[i].IsSend;
                    } else {
                        // 如果是后面的，就push进去
                        let fb;
                        if(!that.fbCheck.find(o => o == data[i].c_pid)) {
                            // 没找到说明是一血
                            fb = true;
                            that.fbCheck.push(data[i].c_pid);
                        } else {
                            fb = false;
                        }
                        const item = {
                            color: data[i].Color,
                            school: data[i].ClassNum,
                            team: data[i].Name,
                            seat: data[i].SeatNum,
                            Jid: data[i].Jid,
                            isSend: data[i].IsSend,
                            isFB: fb,
                        }
                        newArr.push(item);
                        // 把newArr插入到原数组0开头的地方
                        let index = that.ballon.findIndex(o => o.isSend == 1);
                        // 如果没有一个为1，就是插在最后
                        if(index < 0) {
                            index = that.ballon.length;
                        }
                        that.ballon = insertArray(that.ballon, newArr, index);
                    }
                }
            })
        }, 10000);
        
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
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