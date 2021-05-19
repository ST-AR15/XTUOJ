<template>
    <div class="rank" id="rank">
        <h1 v-text="title"></h1>
        <div class="time">
            <div class="time-bar">
                <div class="time-end" v-text="Date.now()<stamp.end? timeFormatter(stamp.end, true): '已结束'"></div>
                <a-slider @change="handleRecord()" :marks="time" :min="stamp.start" :max="stamp.end" v-model="progress" :step="timeStep" :tip-formatter="formatter"></a-slider>
            </div>
            <div class="time-detail">
                <span v-text="'总时长：' + msToTime(stamp.end-stamp.start)"></span>
                <span v-text="'剩余时长：' + msToTime(Math.max(0, Math.min((stamp.end-stamp.start),(stamp.end-Date.now()))))"></span>
            </div>
        </div>
        <div class="tip">
            <a-space>
                <span class="gold">Gold</span>
                <span class="sliver">Sliver</span>
                <span class="bronze">Bronze</span>
                <span class="honorable">Honorable</span>
                <span class="first-blood">First to solve problem</span>
                <span class="solved">Solved problem</span>
                <span class="attempted">Attempted Problem</span>
                <span class="pending">Pending judgement</span>
            </a-space>
        </div>
        <!-- 单人比赛不需要这个 -->
        <div class="filter" v-if="contestant != 0" :style="{'width': contestant == 0? (list.question.length + 10) * 65 + 'px': (list.question.length + 14) * 65 + 'px'}">
            <a-select
                mode="multiple"
                placeholder="选择关注队伍"
                style="width: 400px"
                v-model="starSchool"
                @change="handleStar"
            >
                <a-select-option v-for="data in school" :key="data.id">
                    {{ data.name }}
                </a-select-option>
            </a-select>
            <a-radio-group v-model="page" button-style="solid">
                <a-radio-button value="balloon">
                    发气球
                </a-radio-button>
                <a-radio-button value="ranklist">
                    排行榜
                </a-radio-button>
            </a-radio-group>
        </div>
        <a-divider />
        <table class="list" v-show="page == 'ranklist'" :style="{ 'height': (list.score.length + list.star.length + 1 + 5 + 1) * 38 + 'px' ,'width': contestant == 0? (list.question.length + 10) * 65 + 'px': (list.question.length + 14) * 65 + 'px'}">
            <!-- 表头 -->
            <tr class="list-header">
                <th>Place</th>
                <th style="--i: 4" v-if="contestant==1">School</th>
                <th style="--i: 6" v-text="contestant==0? 'Name': 'Team'"></th>
                <th>Solved</th>
                <th>Time</th>
                <th v-for="i in list.question" :key="i.pid" :style="{ backgroundColor: i.color }">
                    {{ i.pid }}
                </th>
                <th>Dirt</th>
            </tr>
            <!-- 关注 -->
            <tr class="list-inner star" v-for="(data, i) in list.star" :key="'star' + i" :style="{ 'transform': `translateY(${(i+1)*38}px)` }">
                <td>*</td>
                <td style="--i: 4" v-if="contestant==1">{{ data.school }}</td>
                <td style="--i: 6">{{ data.name }}</td>
                <td>{{ data.solved }}</td>
                <td>{{ data.time }}</td>
                <td v-for="(detail, j) in data.question" :key="j">
                    <div :class="detail.statu" :style="{ 'lineHeight': `${detail.statu == 'none'? '38px': '19px'}` }">
                        <span v-if="detail.statu == 'none'">·</span>
                        <span v-else>
                            +
                            <br />
                            {{ detail.times }}/{{ detail.time }}
                        </span>
                    </div>
                </td>
                <td>{{ data.dirt }}</td>
            </tr>
            <!-- 全部 -->
            <tr class="list-inner" v-for="(data, i) in list.score" :key="i" :class="data.level" :style="{ 'transform': `translateY(${(data.place+list.star.length)*38}px)` }">
                <td>{{ data.rank }}</td>
                <td style="--i: 4" v-if="contestant==1">{{ data.school }}</td>
                <td style="--i: 6">{{ data.name }}</td>
                <td>{{ data.solved }}</td>
                <td>{{ (data.time/60).toFixed(0) }}</td>
                <td v-for="(detail, j) in data.question" :key="j">
                    <div :class="detail.statu" :style="{ 'lineHeight': `${detail.statu == 'none'? '38px': '19px'}`, 'transition': 'background-color .4s' }">
                        <span v-if="detail.statu == 'none'">·</span>
                        <span v-else>
                            +
                            <br />
                            {{ detail.times }}/{{ (detail.time/60).toFixed(0) }}
                        </span>
                    </div>
                </td>
                <td>{{ data.dirt }}</td>
            </tr>
            <!-- attempted -->
            <tr class="list-footer" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 1) * 38 }px)`}">
                <td :style="{'--i': contestant==0? 6:10 }" class="blank"></td>
                <td style="--i: 3">Attempted</td>
                <td v-for="data in list.question" :key="data.pid">
                    {{ data.attempted }}
                </td>
                <td class="blank"></td>
            </tr>
            <!-- accepted -->
            <tr class="list-footer" odd :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 2) * 38 }px)`}">
                <td :style="{'--i': contestant==0? 6:10 }" class="blank"></td>
                <td style="--i: 3">Accepted</td>
                <td style="line-height: 19px" v-for="data in list.question" :key="data.pid">
                    {{ data.accepted }}
                    <br />
                    <!-- 防止除以0时出现NaN -->
                    {{ `(${ data.accepted == 0? 0: ((data.accepted/data.attempted)*100).toFixed(0) }%)` }}
                </td>
                <td class="blank"></td>
            </tr>
            <!-- dirt -->
            <tr class="list-footer" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 3) * 38 }px)`}">
                <td :style="{'--i': contestant==0? 6:10 }" class="blank"></td>
                <td style="--i: 3">Dirt</td>
                <td style="line-height: 19px" v-for="i in list.question.length" :key="(i + 9).toString(36)">
                    ?
                    <br />
                    (?%)
                </td>
                <td class="blank"></td>
            </tr>
            <!-- fb -->
            <tr class="list-footer" odd :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 4) * 38 }px)`}">
                <td :style="{'--i': contestant==0? 6:10 }" class="blank"></td>
                <td style="--i: 3">First Solved</td>
                <td v-for="data in list.question" :key="data.pid">
                    {{ data.fb? data.fb: '-' }}
                </td>
                <td class="blank"></td>
            </tr>
            <!-- lb -->
            <tr class="list-footer" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 5) * 38 }px)`}">
                <td :style="{'--i': contestant==0? 6:10 }" class="blank"></td>
                <td style="--i: 3">Last Solved</td>
                <td v-for="data in list.question" :key="data.pid">
                    {{ data.lb? data.lb: '-' }}
                </td>
                <td class="blank"></td>
            </tr>
        </table>
        <div class="balloon" :style="{ 'width': contestant == 0? (list.question.length + 10) * 65 + 'px': (list.question.length + 14) * 65 + 'px' }" v-show="page == 'balloon'">
            <a-table
                :data-source="balloon"
                :columns="columns"
                :pagination="pagination"
            >
                <!-- solved -->
                <span slot="solved" slot-scope="text">
                    <svg :style="{ 'height': '1em', 'vertical-align': '-0.225em', 'color': 'rgb(265,00,00)'}" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"><path fill="currentColor" d="M96 416h224c0 17.7-14.3 32-32 32h-16c-17.7 0-32 14.3-32 32v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-20c0-17.7-14.3-32-32-32h-16c-17.7 0-32-14.3-32-32zm320-208c0 74.2-39 139.2-97.5 176h-221C39 347.2 0 282.2 0 208 0 93.1 93.1 0 208 0s208 93.1 208 208zm-180.1 43.9c18.3 0 33.1-14.8 33.1-33.1 0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1zm49.1 46.9c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1zm64-64c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1z"></path></svg>
                    &nbsp;
                    <span v-text="text"></span>
                </span>
                <!-- total -->
                <span slot="total" slot-scope="text">
                    <svg v-for="i in text" :key="i" :style="{ 'height': '1em', 'vertical-align': '-0.225em', 'color': 'rgb(265,00,00)'}" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"><path fill="currentColor" d="M96 416h224c0 17.7-14.3 32-32 32h-16c-17.7 0-32 14.3-32 32v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-20c0-17.7-14.3-32-32-32h-16c-17.7 0-32-14.3-32-32zm320-208c0 74.2-39 139.2-97.5 176h-221C39 347.2 0 282.2 0 208 0 93.1 93.1 0 208 0s208 93.1 208 208zm-180.1 43.9c18.3 0 33.1-14.8 33.1-33.1 0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1zm49.1 46.9c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1zm64-64c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1z"></path></svg>
                </span>
            </a-table>
        </div>
    </div>
</template>

<script>
import { filterEmptyValue, timeFormatter, msToTime } from "@/utils/tools.js";
export default {
    data() {
        return {
            page: 'ranklist',    // 当前页面
            title: "第1届湘潭大学程序设计竞赛正式赛",  // 比赛名字
            contestant: 0,  // 0是个人赛,1是团队赛
            time: {},  // 时间刻度
            stamp: {   // 比赛开始和比赛结束的时间
                start: 1619136000000,
                end: 1619143200000,
            },
            timeStep: 1000, // 进度条的最低刻度,为1秒
            progress: 1614067200000, // 进度条(当前时间)
            list: {
                question: [
                    {
                        pid: 1,
                        color: 'rgb(122,233,34)',
                        attempted: 0,
                        accepted: 0,
                        fb: null,
                        lb: null,
                    },
                    {
                        pid: 2,
                        color: 'rgb(122,233,34)',
                        attempted: 0,
                        accepted: 0,
                        fb: null,
                        lb: null,
                    },
                    {
                        pid: 3,
                        color: 'rgb(122,233,34)',
                        attempted: 0,
                        accepted: 0,
                        fb: null,
                        lb: null,
                    },
                    {
                        pid: 4,
                        color: 'rgb(122,233,34)',
                        attempted: 0,
                        accepted: 0,
                        fb: null,
                        lb: null,
                    },
                ],
                questionDefalut: [],
                score: [],
                scoreDefault: [],
                star: [], // 关注的队伍
                record: [], // 提交记录
            },
            school: [
                {
                    id: 1,
                    name: "湘潭大学",
                },
                {
                    id: 2,
                    name: "湘潭大学兴湘学院",
                },
            ],
            starSchool: [],
            query: {
                organization: [],  // 星标队伍
                t: "",             // 时间进度
            },
            balloon: [
                {
                    status: "未发放",
                    time: "01:44:01",
                    solved: "B",
                    school: "湘潭大学",
                    team: "狛枝凪斗",
                    total: ["C","B"],
                    awards: "First to solved problem B",
                    key: 6,
                },
                {
                    status: "未发放",
                    time: "01:39:01",
                    solved: "C",
                    school: "湘潭大学",
                    team: "狛枝凪斗",
                    total: ["C"],
                    awards: "",
                    key: 5,
                },
                {
                    status: "未发放",
                    time: "01:35:01",
                    solved: "C",
                    school: "湘潭大学",
                    team: "七海千秋",
                    total: ["C","B","A","D"],
                    awards: "First to solved problem D",
                    key: 4,
                },
                {
                    status: "已发放",
                    time: "01:22:01",
                    solved: "C",
                    school: "湘潭大学",
                    team: "七海千秋",
                    total: ["C","B","A"],
                    awards: "First to solved problem A",
                    key: 3,
                },
                {
                    status: "未发放",
                    time: "01:05:01",
                    solved: "B",
                    school: "湘潭大学",
                    team: "七海千秋",
                    total: ["C","B"],
                    awards: "First to solved problem B",
                    key: 2,
                },
                {
                    status: "未发放",
                    time: "01:00:01",
                    solved: "C",
                    school: "湘潭大学",
                    team: "七海千秋",
                    total: ["C"],
                    awards: "First to solved problem C",
                    key: 1,
                },
            ],
            columns: [
                {
                    title: "status",
                    dataIndex: "status",
                },
                {
                    title: "time",
                    dataIndex: "time"
                },
                {
                    title: "solved",
                    dataIndex: "solved",
                    scopedSlots: { customRender: 'solved' },
                },
                {
                    title: "school",
                    dataIndex: "school",
                },
                {
                    title: "team",
                    dataIndex: "team",
                },
                {
                    title: "total",
                    dataIndex: "total",
                    scopedSlots: { customRender: 'total' },
                },
                {
                    title: "awards",
                    dataIndex: "awards",
                },
            ],
            pagination: {       // 页面设置
                pageSize:5,     // 每页题目数量
                showQuickJumper: true,  // 快速跳转
            },
            timer: "",  // 计时器
        }
    },
    methods: {
        init() {
            // 初始化
            // 获取query
            let query = this.$route.query;
            this.query.organization = eval(query.organization) || '';
            this.query.t = query.t || '';
            // 把query赋值给里面的信息
            // time
            // let date = new Date();
            if(!query.t) {
                // 如果没有传入时间，就用现在的时间和结束时间里面小的那个
                this.progress = this.msFormatter(Math.min(this.stamp.end, Date.now()));
            } else {
                // 如果传入了时间，就用它传的时间
                if(query.t > Math.min(this.stamp.end, Date.now())) {
                    // 如果传入的时间超过了结束时间或当前时间
                    this.progress = this.msFormatter(Math.min(this.stamp.end, Date.now()));
                } else if(query.t < this.stamp.start) {
                    // 如果传入的时间小于开始时间
                    this.progress = this.msFormatter(Math.min(this.stamp.end, Date.now()));
                } else {
                    this.progress = this.msFormatter(query.t);
                }
            }
            // 如果这个时间小于开始时间，那就把progress变成开始时间
            if(this.progress < this.stamp.start) {
                this.progress = this.stamp.start;
            }
            // 进度过了10%就显示右边的
            if(Date.now() - this.stamp.start < 0 || ((Date.now() - this.stamp.start)/(this.stamp.end - this.stamp.start)) < 0.1 ) {
                this.time = {
                    [this.stamp.start]: {
                        label: timeFormatter(this.stamp.start, true),
                    },
                }
            } else {
                this.time = {
                    [this.stamp.start]: {
                        label: timeFormatter(this.stamp.start, true),
                    },
                    [Math.min(Date.now(), this.stamp.end)]: {
                        style: {
                            whiteSpace: 'nowrap'
                        },
                        label: timeFormatter(Math.min(Date.now(), this.stamp.end), true),
                    },
                }
            }
            // 开一个计时器，保证时间每秒动一次
            if(!this.timer) {
                // 同时移动进度条
                this.timer = setInterval(() => {
                    // 时间
                    if(Date.now() - this.stamp.start < 0 || ((Date.now() - this.stamp.start)/(this.stamp.end - this.stamp.start)) < 0.1 ) {
                        this.time = {
                            [this.stamp.start]: {
                                label: timeFormatter(this.stamp.start, true),
                            },
                        }
                    } else {
                        this.time = {
                            [this.stamp.start]: {
                                label: timeFormatter(this.stamp.start, true),
                            },
                            [Math.min(Date.now(), this.stamp.end)]: {
                                style: {
                                    whiteSpace: 'nowrap'
                                },
                                label: timeFormatter(Math.min(Date.now(), this.stamp.end), true),
                            },
                        }
                    }
                    // 进度
                    if((Math.min(this.stamp.end, Date.now()) - this.progress) <= 10000) { // 如果在右边，就一直跟着走,判断方法是小于10秒的差距
                        this.progress = this.msFormatter(Math.max(this.stamp.start,(Math.min(this.stamp.end, Date.now()))));
                    }
                    // 如果到了时间，移除计时器
                    if(Date.now() > this.stamp.end) {
                        clearInterval(this.timer);
                    }
                }, 1000);
            }
            // star
            let star = [];
            for(let i in this.query.organization) {
                // 判断url里的学校是否存在
                let school = this.school.find(o => o.name == this.query.organization[i]);
                if(school) {
                    star.push(school.id);
                }
                // else {
                //     this.$message.info(`已删除organization中多余的参数${this.query.organization[i]}`);
                // }
            }
            this.starSchool = star;
            this.handleStar(star);
            // 计算成绩
            this.handleRecord();
        },
        formatter() {
            return timeFormatter(this.progress);
        },
        msToTime(ms) {
            return msToTime(ms);
        },
        timeFormatter(a, b) {
            return timeFormatter(a, b);
        },
        msFormatter(ms) {   // 为了保证progress能成为1000的倍数
            return Math.floor(ms/1000)*1000;
        },
        handleStar(value) {
            this.list.star = [];  // 先清空原来的star
            // 获取新的star
            // 两种：array.indexOf和array.find，两种效果接近
            for(let i = 0,j = 0; i<this.list.score.length; i++) {
                if(value.indexOf(this.list.score[i].schoolID) != -1) {
                    this.list.star[j] = this.list.score[i];
                    j++;
                }
                // if(value.find(o => o == this.list.score[i].schoolID)) {
                //     this.list.star[j] = this.list.score[i];
                //     j++;
                // }
            }
            // 根据新star的rank排序
            // 使用冒泡排序、快速排序和sort，最终选用sort
            // 冒泡排序
            // for(let i = this.list.star.length - 1; i >= 0; i--) {
            //     for(let j = 0; j < i; j++) {
            //         if(this.list.star[j].rank > this.list.star[j+1].rank) {
            //             [this.list.star[j], this.list.star[j+1]] = [this.list.star[j+1], this.list.star[j]];
            //         }
            //     }
            // }
            // 快速排序
            // function jsQuickSort(array) {
            //     if (array.length <= 1) {
            //         return array;
            //     }
            //     const pivotIndex = Math.floor(array.length / 2);
            //     const pivot = array.splice(pivotIndex, 1)[0];  //从数组中取出"基准"元素
            //     const left = [], right = [];
            //     array.forEach(item => {
            //         if (item.rank < pivot.rank) {  //left 存放比 pivot 小的元素
            //             left.push(item); 
            //         } else {  //right 存放大于或等于 pivot 的元素
            //             right.push(item);
            //         }
            //     });
            //     return jsQuickSort(left).concat(pivot, jsQuickSort(right));  //分治
            // }
            // this.list.star = jsQuickSort(this.list.star);
            // sort排序
            let compare = function (obj1, obj2) {
                let val1 = obj1.rank;
                let val2 = obj2.rank;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }            
            }
            this.list.star = this.list.star.sort(compare);
            this.handleQuery();
        },
        handleQuery() {
            // push query
            let query = {};
            // organization
            if(this.starSchool) { // 如果有星标学校
                let organization = [];
                for(let i in this.starSchool) {
                    organization.push('"' + this.school.find(o => o.id == this.starSchool[i]).name + '"');
                }
                // 只有有内容才会被加入字符串
                if(organization.toString()) {
                    query["organization"] = '[' + organization.toString() + ']';
                }
            }
            // time
            // 如果t是结束的t、进度的t或者还没开始，就不传
            if(this.progress != this.msFormatter(Math.min(this.stamp.end, Date.now()))) {
                if(Date.now() >= this.stamp.start) {
                    query.t = this.progress + "";
                }
            }
            // 通过筛选推送到query
            // 避免冗余定向
            if(JSON.stringify(this.$route.query) !== JSON.stringify(filterEmptyValue(query))) {
                this.$router.replace({ query: filterEmptyValue(query) });
            }
        },
        // 根据list.record计算list.placeChange和list.score
        handleRecord() {
            // 清空原成绩
            this.list.score = JSON.parse(JSON.stringify(this.list.scoreDefault));
            // 清空question
            this.list.question = JSON.parse(JSON.stringify(this.list.questionDefalut));
            // 根据时间获取现在需要截取的时间
            let record = [];
            for(let i in this.list.record) {
                // 只要现在时间前面的那一段
                if(this.list.record[i].time.getTime() > this.progress) {
                    break;
                } else {
                    record.push(this.list.record[i]);
                }
            }
            for(let i in record) {
                // 获取是第几题
                const _n = this.list.question.findIndex(o => o.pid == record[i].pid);
                // 获取是第几个人
                const _m = this.list.score.findIndex(o => o.nameID == record[i].uid);
                // 判定中
                if(this.$resultText[record[i].result] == "Judging") {
                    // 状态变成判定
                    this.list.score[_m].question[_n].statu = "pending";
                } else if(this.$resultText[record[i].result] != "ACCEPT") {
                    // 除了判定中和通过的其他任何情况
                    // 状态变成错误，times++，不是编译错误则罚时+1200
                    this.list.score[_m].question[_n].statu = "attempted";
                    this.list.score[_m].question[_n].times++;
                    if(this.$resultText[this.list.result] != "COMPILE_ERROR") {
                        this.list.score[_m].question[_n].time += 1200;
                    }
                    // 提交次数增加一次
                    this.list.question[_n].attempted++;
                } else {
                    // 这就是正确提交的可能性了
                    // 首先看是不是一血
                    if(!this.list.question[_n].fb) {
                        // 如果没有一血信息，这次提交就被视为一血
                        // 先在question里记录fb信息
                        this.list.question[_n].fb = record[i].uid;
                        // 然后给这个人fb标志
                        this.list.score[_m].question[_n].statu = "first-blood";
                    } else {
                        // 不是一血就是解决
                        this.list.score[_m].question[_n].statu = "solved";
                    }
                    // 记录后续使用的原数据
                    const _place = this.list.score[_m].place;
                    const _point = this.list.score[_m].point;
                    // 不管是不是一血，解决了就是Accepted和Attempte都+1，而且是lb
                    this.list.question[_n].attempted++;
                    this.list.question[_n].accepted++;
                    this.list.question[_n].lb =  record[i].uid;
                    // 然后只要是解决了，times++
                    this.list.score[_m].question[_n].times++;
                    // 计算罚时并计入总罚时
                    this.list.score[_m].question[_n].time += ((record[i].time.getTime() - this.stamp.start)/1000);
                    this.list.score[_m].time += this.list.score[_m].question[_n].time;
                    // 解出题目
                    this.list.score[_m].solved += 1;
                    // 计算积分
                    this.list.score[_m].point = this.list.score[_m].point + 100000 - this.list.score[_m].time;
                    // 和所有人比积分
                    // 原来比他高现在比他低的都下降rank和place，他加
                    // 原来和他一样的，都下降rank，如果之前在前面就下降place
                    for(let j in this.list.score) {
                        if(j == _m) {
                            // 如果这个人是自己就跳过
                            continue ;
                        } else {
                            if(this.list.score[j].point > _point && this.list.score[j].point < this.list.score[_m].point) {
                                // 比原来高比现在低
                                this.list.score[j].rank++;
                                this.list.score[j].place++;
                                this.list.score[_m].rank--;
                                this.list.score[_m].place--;
                            } else if(this.list.score[j].point == _point) {
                                this.list.score[j].rank++;
                                if(this.list.score[j].place < _place) {
                                    this.list.score[j].place++;
                                }
                            }
                        }
                    }
                    // for(let j = this.list.score[_m].place; ;j-- ) {
                    //     // 如果已经是第一名，就直接跳出
                    //     if(j == 1) {
                    //         break ;
                    //     }
                    //     // 否则就开始比较
                    //     const _index = this.list.score.findIndex(o => o.place == j-1);
                    //     if(this.list.score[_m].point == this.list.score[_index].point) {
                    //         // 如果两人现在积分一样，那就把自己的排名变成对方的可以停下来了
                    //         this.list.score[_m].rank = this.list.score[_index].rank;
                    //         break ;
                    //     } else if(this.list.score[_m].point > this.list.score[_index].point) {
                    //         // 如果比前一个人分高，则自身名次和位置都增加，对面名次和位置都降低
                    //         this.list.score[_m].place--;
                    //         this.list.score[_m].rank--;
                    //         this.list.score[_index].place++;
                    //         this.list.score[_index].rank++;
                    //     } else {
                    //         // 如果比对方低，也是直接跳出
                    //         break ;
                    //     }
                    // }
                }
            }
        }
    },
    mounted() {
        // 先获取赛事的有关信息
        // const contestUrl = `/api/match/${ this.$route.params.CID }/info`;
        // this.$axios.get(contestUrl).then(rep => {
        //     const data = rep.data.data[0];
        //     // 获取比赛的标题/开始时间/结束时间
        //     this.title = data.Tittle;
        //     this.stamp.start = new Date(data.StartTime).getTime();
        //     this.stamp.end = new Date(data.StartTime).getTime();
        //     // 个人赛或团队赛
        //     this.contestant = data.Contestant;  // 0为个人,1为团队
        // })
        this.title = "测试标题";
        this.stamp.start = 1621317600000;
        this.stamp.end = 1621328400000;
        this.contestant = 0;  // 0为个人,1为团队
        // 获取这次比赛有哪些题目
        // const pidUrl = `/api/contest/${ this.$route.params.CID }/problem`;
        // this.$axios.get(pidUrl).then(rep => {
        //     const data = rep.data.data;
        //     for(let i in data) {
        //         this.$set(this.list.question, i, data[i].c_pid);
        //     }
        // })
        this.list.question = [
                    {
                        pid: 1,
                        color: 'rgb(122,233,34)',
                        attempted: 0,
                        accepted: 0,
                        fb: null,
                        lb: null,
                    },
                    {
                        pid: 2,
                        color: 'rgb(122,233,34)',
                        attempted: 0,
                        accepted: 0,
                        fb: null,
                        lb: null,
                    },
                    {
                        pid: 3,
                        color: 'rgb(122,233,34)',
                        attempted: 0,
                        accepted: 0,
                        fb: null,
                        lb: null,
                    },
                    {
                        pid: 4,
                        color: 'rgb(122,233,34)',
                        attempted: 0,
                        accepted: 0,
                        fb: null,
                        lb: null,
                    },];
                    // 初始化question
                    this.list.questionDefalut = this.list.question;
        // 获取比赛的参赛选手,初始化score
        // const namelistUrl = `/api/match/${ this.$route.params.CID }/user`;
        // this.$axios.get(namelistUrl).then(rep => {
        //     console.log(rep);
        //     const data = rep.data.data;
            const data = [
                {
                    "ContestUid": 1,
                    "Cid": 1,
                    "Uid": 20171,
                    "Name": "李昶浩",
                    "StudentID": 20171,
                    "email": null
                },
                {
                    "ContestUid": 2,
                    "Cid": 1,
                    "Uid": 20172,
                    "Name": "鹿乃",
                    "StudentID": 20172,
                    "email": null
                },
                {
                    "ContestUid": 3,
                    "Cid": 1,
                    "Uid": 20173,
                    "Name": "花谱",
                    "StudentID": 20173,
                    "email": null
                },
                {
                    "ContestUid": 4,
                    "Cid": 1,
                    "Uid": 20174,
                    "Name": "肖晨南",
                    "StudentID": 20174,
                    "email": null
                },
                {
                    "ContestUid": 5,
                    "Cid": 1,
                    "Uid": 20175,
                    "Name": "黄浩泉",
                    "StudentID": 20175,
                    "email": null
                },
            ];
            // 每个人的问题
            let question = [];
            let i = this.list.question.length
            while(i--) {
                question.push({
                    statu: "none",
                    times: 0,
                    time: 0,
                })
            }
            if(this.contestant == 0) {
                // 如果是个人赛
                for(let i in data) {
                    const item = {
                        place: parseInt(i) + 1,
                        rank: 1,
                        // school
                        // schoolID
                        name: data[i].Name,
                        nameID: data[i].ContestUid,
                        solved: 0,
                        time: 0,
                        level: 'bronze',
                        point: 0,
                        question: JSON.parse(JSON.stringify(question)),
                    }
                    this.$set(this.list.score, i, item);
                }
            } else {
                // 团队赛多个school和schoolID
                 const item = {
                    place: parseInt(i) + 1,
                    rank: 1,
                    school: data.school,
                    schoolID: data.schoolID, // TODO school和schoolID都是没测试的数据
                    name: data[i].Name,
                    nameID: data[i].ContestUid,
                    solved: 0,
                    time: 0,
                    level: 'bronze',
                    point: 0,
                    question: question
                }
                this.$set(this.list.score, i, item);
            }
            // 设置默认值
            this.list.scoreDefault = JSON.parse(JSON.stringify(this.list.score));
            
        // })
        // 然后获取这次比赛的所有提交记录
        // const recordUrl = `/api/match/${ this.$route.params.CID }`;
        // this.$axios.get(recordUrl).then(rep => {
        //     const data = rep.data.data;
        //     this.list.record = data;
            const submitData =  [
                {
                    "Cid": 1,
                    "c_pid": 1,
                    "Uid": 1,
                    "result": 6,
                    "Language": "G++",
                    "updated_at": "2021-05-18 14:02:40"
                },
                {
                    "Cid": 1,
                    "c_pid": 1,
                    "Uid": 1,
                    "result": 8,
                    "Language": "G++",
                    "updated_at": "2021-05-18 14:12:40"
                },
                {
                    "Cid": 1,
                    "c_pid": 1,
                    "Uid": 1,
                    "result": 8,
                    "Language": "G++",
                    "updated_at": "2021-05-18 14:22:40"
                },
                {
                    "Cid": 1,
                    "c_pid": 1,
                    "Uid": 1,
                    "result": -1,
                    "Language": "G++",
                    "updated_at": "2021-05-18 14:32:40"
                },
                {
                    "Cid": 1,
                    "c_pid": 2,
                    "Uid": 1,
                    "result": 1,
                    "Language": "G++",
                    "updated_at": "2021-05-18 14:42:40"
                },
                {
                    "Cid": 1,
                    "c_pid": 2,
                    "Uid": 1,
                    "result": -1,
                    "Language": "G++",
                    "updated_at": "2021-05-18 15:10:40"
                },
                {
                    "Cid": 1,
                    "c_pid": 2,
                    "Uid": 2,
                    "result": -1,
                    "Language": "G++",
                    "updated_at": "2021-05-18 15:10:40"
                },
                {
                    "Cid": 1,
                    "c_pid": 3,
                    "Uid": 2,
                    "result": -1,
                    "Language": "G++",
                    "updated_at": "2021-05-18 15:10:40"
                },
                {
                    "Cid": 1,
                    "c_pid": 4,
                    "Uid": 2,
                    "result": -1,
                    "Language": "G++",
                    "updated_at": "2021-05-18 15:10:40"
                },
            ];
            for(let i in submitData) {
                this.list.record.push({
                    pid: submitData[i].c_pid,
                    uid: submitData[i].Uid,
                    result: submitData[i].result,
                    time: new Date(submitData[i].updated_at),
                })
            }
        // })
        this.init();
    },
    watch: {
        $route(newVal, oldVal) {
            if(newVal !== oldVal) {
                this.init();
            }
        }
    }
}
</script>

<style>
    .rank {
        min-width: 1400px;
        max-width: 95%;
        margin: 0 auto;
    }
    .time {
        width: 800px;
        margin: 0 auto;
        position: relative;
    }
    .time-detail {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .time-end {
        position: absolute;
        right: 0;
        transform: translate(65%, -20px);
    }
    .tip {
        height: 24px;
        line-height: 24px;
        text-align: center;
    }
    .tip span {
        padding: 4px;
    }
    .gold {
        background-color: yellow;
    }
    .sliver {
        background-color: #ffadd2;
    }
    .bronze {
        background-color: #f0c0a0;
    }
    .star {
        background-color: #FFFFCC;
    }
    .honorable {
        background-color: #e6f7ff;
    }
    .first-blood {
        background-color: #3db03d;
    }
    .solved {
        background-color: #e1ffb5;
    }
    .attempted {
        background-color: #ffd0d0;
    }
    .pending {
        background-color: #c8d6fa;
    }
    .none {
        background-color: #FFFFFF;
    }
    .filter {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin: 12px auto;
    }
    .list {
        position: relative;
        margin: 0 auto;
    }
    .list > tr {
        height: 38px;
        position: absolute;
        flex-shrink: 0;
    }
    .list td,.list th {
        --i: 1;
        width: calc(var(--i) * 65px);
        height: 100%;
        border: 1px solid #FFFFFF;
        position: relative;
    }
    .list-header {
        text-transform: capitalize;
        line-height: 38px;
        text-align: center;
    }
    .list-header > th {
        background-color: #F5F5D5;
        box-sizing: border-box;
        letter-spacing: 0;
    }
    .list-inner {
        position: absolute;
        cursor: pointer;
        transition: all .4s;
        overflow: hidden;
    }
    .list-inner > td {
        box-sizing: border-box;
        text-align: center;
        line-height: 38px;
    }
    .list-inner:hover {
        background-color: #e6f7ff;
        /* color: #999999; */
        opacity: .4;
    }
    .list-footer {
        position: absolute;
        transition: all .4s;
        overflow: hidden;
        text-align: center;
        text-transform: capitalize;
        line-height: 38px;
    }
    .list-footer > td {
        background-color: rgb(149,222,100);
    }
    .list-footer[odd] > td {
        background-color: rgb(183,235,143);
    }
    .list-footer > .blank {
        background-color: #FFFFFF !important;
    }
    .balloon {
        margin: 0 auto;
    }
</style>