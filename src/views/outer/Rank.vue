<template>
    <div class="rank" id="rank">
        <h1 v-text="title"></h1>
        <div class="time">
            <div class="time-bar">
                <div class="time-end" v-text="Date.now()<stamp.end? timeFormatter(stamp.end, true): '已结束'"></div>
                <a-slider @change="handleTime()" :marks="time" :min="stamp.start" :max="stamp.end" v-model="progress" :step="timeStep" :tip-formatter="formatter"></a-slider>
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
        <div class="filter" :style="{'width': (list.question + 14) * 55 + 'px'}">
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
        <table class="list" v-show="page == 'ranklist'" :style="{ 'height': (list.score.length + list.star.length + 1 + 5 + 1) * 38 + 'px' ,'width': (list.question + 14) * 55 + 'px'}">
            <!-- 表头 -->
            <tr class="list-header">
                <th>Place</th>
                <th style="--i: 4">School</th>
                <th style="--i: 6">Team</th>
                <th>Solved</th>
                <th>Time</th>
                <th v-for="i in list.question" :key="(i + 9).toString(36)" :style="{ 'backgroundColor': `rgb(${i*10},${255 - i*10},${i*10})` }">
                    {{ (i + 9).toString(36) }}
                </th>
                <th>Dirt</th>
            </tr>
            <!-- 关注 -->
            <tr class="list-inner star" v-for="(data, i) in list.star" :key="'star' + i" :style="{ 'transform': `translateY(${(i+1)*38}px)` }">
                <td>*</td>
                <td style="--i: 4">{{ data.school }}</td>
                <td style="--i: 6">{{ data.team }}</td>
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
                <td style="--i: 4">{{ data.school }}</td>
                <td style="--i: 6">{{ data.team }}</td>
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
            <!-- attempted -->
            <tr class="list-footer" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 1) * 38 }px)`}">
                <td style="--i: 10" class="blank"></td>
                <td style="--i: 3">Attempted</td>
                <td v-for="(data, i) in list.questionInfo.attempted" :key="i">
                    {{ data }}
                </td>
                <td class="blank"></td>
            </tr>
            <!-- accepted -->
            <tr class="list-footer" odd :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 2) * 38 }px)`}">
                <td style="--i: 10" class="blank"></td>
                <td style="--i: 3">Accepted</td>
                <td style="line-height: 19px" v-for="(data, i) in list.question" :key="i">
                    {{ data }}
                    <br />
                    {{ `(${((data/list.questionInfo.attempted[i])*100).toFixed(0)}%)` }}
                </td>
                <td class="blank"></td>
            </tr>
            <!-- dirt -->
            <tr class="list-footer" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 3) * 38 }px)`}">
                <td style="--i: 10" class="blank"></td>
                <td style="--i: 3">Dirt</td>
                <td style="line-height: 19px" v-for="i in list.question" :key="(i + 9).toString(36)">
                    ?
                    <br />
                    (?%)
                </td>
                <td class="blank"></td>
            </tr>
            <!-- fb -->
            <tr class="list-footer" odd :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 4) * 38 }px)`}">
                <td style="--i: 10" class="blank"></td>
                <td style="--i: 3">First Solved</td>
                <td v-for="(data, i) in list.questionInfo.fb" :key="i">
                    {{ data }}
                </td>
                <td class="blank"></td>
            </tr>
            <!-- lb -->
            <tr class="list-footer" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 5) * 38 }px)`}">
                <td style="--i: 10" class="blank"></td>
                <td style="--i: 3">Last Solved</td>
                <td v-for="(data, i) in list.questionInfo.lb" :key="i">
                    {{ data }}
                </td>
                <td class="blank"></td>
            </tr>
        </table>
        <div class="balloon" :style="{ 'width': (list.question + 14) * 55 + 'px' }" v-show="page == 'balloon'">
            <a-table
                :data-source="balloon"
                :columns="columns"
                :pagination="pagination"
            >
                <!-- solved -->
                <span slot="solved" slot-scope="text">
                    <svg :style="{ 'height': '1em', 'vertical-align': '-0.225em', 'color': 'rgb(255,00,00)'}" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"><path fill="currentColor" d="M96 416h224c0 17.7-14.3 32-32 32h-16c-17.7 0-32 14.3-32 32v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-20c0-17.7-14.3-32-32-32h-16c-17.7 0-32-14.3-32-32zm320-208c0 74.2-39 139.2-97.5 176h-221C39 347.2 0 282.2 0 208 0 93.1 93.1 0 208 0s208 93.1 208 208zm-180.1 43.9c18.3 0 33.1-14.8 33.1-33.1 0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1zm49.1 46.9c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1zm64-64c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1z"></path></svg>
                    &nbsp;
                    <span v-text="text"></span>
                </span>
                <!-- total -->
                <span slot="total" slot-scope="text">
                    <svg v-for="i in text" :key="i" :style="{ 'height': '1em', 'vertical-align': '-0.225em', 'color': 'rgb(255,00,00)'}" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"><path fill="currentColor" d="M96 416h224c0 17.7-14.3 32-32 32h-16c-17.7 0-32 14.3-32 32v20c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-20c0-17.7-14.3-32-32-32h-16c-17.7 0-32-14.3-32-32zm320-208c0 74.2-39 139.2-97.5 176h-221C39 347.2 0 282.2 0 208 0 93.1 93.1 0 208 0s208 93.1 208 208zm-180.1 43.9c18.3 0 33.1-14.8 33.1-33.1 0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1zm49.1 46.9c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1zm64-64c0-14.4-9.3-26.3-22.1-30.9 9.6 26.8-15.6 51.3-41.9 41.9 4.6 12.8 16.5 22.1 30.9 22.1 18.3 0 33.1-14.9 33.1-33.1z"></path></svg>
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
            time: {},  // 时间刻度
            stamp: {   // 比赛开始和比赛结束的时间
                start: 1619136000000,
                end: 1619143200000,
            },
            timeStep: 1000, // 进度条的最低刻度,为1秒
            progress: 1614067200000, // 进度条(当前时间)
            list: {
                question: 13,   // 题目数量
                score: [
                    {
                        place: 1,
                        rank: 1,
                        school: "湘潭大学",  // 学校名
                        schoolID: 1,
                        team: "七海千秋",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'honorable',    // 等级
                        question: [
                            {
                                statu: "first-blood",
                                times: 1,
                                time: 17,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 8,
                        rank: 6,
                        school: "湘潭大学",  // 学校名
                        schoolID: 1,
                        team: "日向创",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'gold',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "first-blood",
                                times: 1,
                                time: 15,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 3,
                        rank: 4,
                        school: "湘潭大学",  // 学校名
                        schoolID: 1,
                        team: "狛枝凪斗",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'sliver',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "first-blood", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 4,
                        rank: 8,
                        school: "湘潭大学",  // 学校名
                        schoolID: 1,
                        team: "十神白夜",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "first-blood", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 7,
                        rank: 12,
                        school: "湘潭大学",  // 学校名
                        schoolID: 1,
                        team: "小泉真昼",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "first-blood", // 解题状态
                                times: 1,        // 提交次数
                                time: 27,        // 解出来的分钟数
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 6,
                        rank: 4,
                        school: "湘潭大学",  // 学校名
                        schoolID: 1,
                        team: "西园寺日寄子",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "first-blood", // 解题状态
                                times: 1,        // 提交次数
                                time: 12,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 5,
                        rank: 1,
                        school: "湘潭大学",  // 学校名
                        schoolID: 1,
                        team: "二大猫丸",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "first-blood",
                                times: 1,
                                time: 2,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 2,
                        rank: 1,
                        school: "湘潭大学",  // 学校名
                        schoolID: 1,
                        team: "终里赤音",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "first-blood", // 解题状态
                                times: 1,        // 提交次数
                                time: 1,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 27,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 9,
                        rank: 1,
                        school: "湘潭大学",  // 学校名
                        schoolID: 1,
                        team: "九头龙冬彦",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "first-blood", // 解题状态
                                times: 1,        // 提交次数
                                time: 12,        // 解出来的分钟数
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 10,
                        rank: 1,
                        school: "湘潭大学兴湘学院",
                        schoolID: 2,
                        team: "边谷山佩子",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "first-blood",
                                times: 1,
                                time: 6,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 14,
                        rank: 1,
                        school: "湘潭大学兴湘学院",
                        schoolID: 2,
                        team: "田中眼蛇梦",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "first-blood",
                                times: 2,
                                time: 11,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 12,
                        rank: 1,
                        school: "湘潭大学兴湘学院",
                        schoolID: 2,
                        team: "索尼娅内瓦曼",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "first-blood",
                                times: 1,
                                time: 11,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 13,
                        rank: 1,
                        school: "湘潭大学兴湘学院",
                        schoolID: 2,
                        team: "左右田和一",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 11,
                        rank: 2,
                        school: "湘潭大学兴湘学院",
                        schoolID: 2,
                        team: "澪田唯吹",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 15,
                        rank: 3,
                        school: "湘潭大学兴湘学院",
                        schoolID: 2,
                        team: "罪木蜜柑",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                    {
                        place: 16,
                        rank: 3,
                        school: "湘潭大学兴湘学院",
                        schoolID: 2,
                        team: "黑白美",    // 队伍名
                        solved: 6,          // 解决题目数量
                        time:500,           // 罚时
                        level: 'bronze',    // 等级
                        question: [
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved", // 解题状态
                                times: 1,        // 提交次数
                                time: 87,        // 解出来的分钟数
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 62,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 155,
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "none"
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 14,
                            },
                            {
                                statu: "solved",
                                times: 2,
                                time: 39,
                            },
                            {
                                statu: "solved",
                                times: 1,
                                time: 127,
                            }
                        ],
                        dirt: "14%",
                    },
                ],
                star: [], // 关注的队伍
                questionInfo: {
                    attempted: [12,23,34,45,56,12,23,34,45,56,111,222,333],
                    accepted: [1,2,3,4,5,6,7,8,9,10,11,12,13],
                    dirt: [],
                    fb: [12,23,34,45,56,12,23,34,45,56,111,222,333],
                    lb: [12,23,34,45,526,12,23,34,45,56,111,222,333],
                },
                placeChange: [
                    {
                        t: 1619136000000,
                        change: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
                    },
                    {
                        t: 1619136600000,
                        change: [2,4,6,8,10,12,14,1,3,5,7,9,11,13,15,16],
                    },
                    {
                        t: 1619137200000,
                        change: [1,3,5,7,9,11,13,15,2,4,6,8,10,12,14,16],
                    },
                    {
                        t: 1619137800000,
                        change: [2,4,6,8,10,12,14,1,3,5,7,9,11,13,15,16],
                    },
                    {
                        t: 1619138400000,
                        change: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
                    },
                ],
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
        // test() {
        //     for(let i in this.list.score) {
        //         if(this.list.score[i].place == this.list.score.length) {
        //             this.list.score[i].place = 1;
        //         } else {
        //             this.list.score[i].place++;
        //         }
        //     }
        //     // 按rank排序
        // },
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
        handleTime() {
            const change = this.list.placeChange;
            // 动态修改排名
            for(let i in change) {
                if(change[i].t > this.progress) {
                    // 如果检测到比它大，就用前一个
                    for(let j in this.list.score) {
                        this.list.score[j].place = change[i-1].change[j];
                    }
                    break ;
                }
                if(i == change.length-1) {
                    // 最后一个
                    for(let j in this.list.score) {
                        this.list.score[j].place = change[i].change[j];
                    }
                    break ;
                }
            }
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
                    // console.log(i);
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
        }
    },
    mounted() {
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
        transform: translate(55%, -20px);
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
        width: calc(var(--i) * 55px);
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