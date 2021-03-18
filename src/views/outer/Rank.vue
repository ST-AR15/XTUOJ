<template>
    <div class="rank" id="rank">
        <h1 v-text="title"></h1>
        <div class="time">
            <div class="time-bar">
                <div class="time-bg"></div>
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
        <div class="filter">
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
        </div>
        <div class="list" v-bind:style="{ '--i': list.score.length + list.star.length + 1 }">
            <!-- 表头 -->
            <div class="list-header">
                <div style="width: 100%">Place</div>
                <div style="width: 400%">School</div>
                <div style="width: 600%">Team</div>
                <div style="width: 100%">Solved</div>
                <div style="width: 200%">Time</div>
                <div style="width: 100%" v-for="i in list.question" :key="(i + 9).toString(36)" v-bind:style="{ 'backgroundColor': `rgb(${i*10},${255 - i*10},${i*10})` }">
                    {{ (i + 9).toString(36) }}
                </div>
                <div style="width: 100%">Dirt</div>
            </div>
            <!-- 关注 -->
            <div class="list-inner star" v-for="(data, i) in list.star" :key="'star' + i" :style="{ 'transform': `translateY(${i*38}px)` }">
                <div style="width: 100%">*</div>
                <div style="width: 400%">{{ data.school }}</div>
                <div style="width: 600%">{{ data.team }}</div>
                <div style="width: 100%">{{ data.solved }}</div>
                <div style="width: 200%">{{ data.time }}</div>
                <div style="width: 100%" v-for="(detail, j) in data.question" :key="j">
                    <div v-bind:class="detail.statu" v-bind:style="{ 'lineHeight': `${detail.statu == 'none'? '38px': '19px'}` }">
                        <span v-if="detail.statu == 'none'">·</span>
                        <span v-else>
                            +
                            <br />
                            {{ detail.times }}/{{ detail.time }}
                        </span>
                    </div>
                </div>
                <div style="width: 100%">{{ data.dirt }}</div>
            </div>
            <!-- 全部 -->
            <div class="list-inner" v-for="(data, i) in list.score" :key="i" v-bind:class="data.level" :style="{ 'transform': `translateY(${(data.place-1+list.star.length)*38}px)` }">
                <div style="width: 100%">{{ data.rank }}</div>
                <div style="width: 400%">{{ data.school }}</div>
                <div style="width: 600%">{{ data.team }}</div>
                <div style="width: 100%">{{ data.solved }}</div>
                <div style="width: 200%">{{ data.time }}</div>
                <div style="width: 100%" v-for="(detail, j) in data.question" :key="j">
                    <div v-bind:class="detail.statu" v-bind:style="{ 'lineHeight': `${detail.statu == 'none'? '38px': '19px'}` }">
                        <span v-if="detail.statu == 'none'">·</span>
                        <span v-else>
                            +
                            <br />
                            {{ detail.times }}/{{ detail.time }}
                        </span>
                    </div>
                </div>
                <div style="width: 100%">{{ data.dirt }}</div>
            </div>
            <!-- 统计 -->
            <!-- <div class="list-footer" v-for="(data, key, i) in list.questionInfo" :key="key" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + i) * 38 }px)`}">
                <div style="width: 100%" class="blank"></div>
                <div style="width: 400%" class="blank"></div>
                <div style="width: 600%" class="blank"></div>
                <div style="width: 100%" class="blank"></div>
                <div style="width: 200%">{{ key }}</div>
                <div style="width: 100%" v-for="i in 13" :key="(i + 9).toString(36)">
                    {{ (i + 9).toString(36) }}
                </div>
                <div style="width: 100%" class="blank"></div>
            </div> -->
            <!-- attempted -->
            <div class="list-footer" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length) * 38 }px)`}">
                <div style="width: 100%" class="blank"></div>
                <div style="width: 400%" class="blank"></div>
                <div style="width: 600%" class="blank"></div>
                <div style="width: 100%" class="blank"></div>
                <div style="width: 200%">Attempted</div>
                <div style="width: 100%" v-for="(data, i) in list.questionInfo.attempted" :key="i">
                    {{ data }}
                </div>
                <div style="width: 100%" class="blank"></div>
            </div>
            <!-- accepted -->
            <div class="list-footer" odd :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 1) * 38 }px)`}">
                <div style="width: 100%" class="blank"></div>
                <div style="width: 400%" class="blank"></div>
                <div style="width: 600%" class="blank"></div>
                <div style="width: 100%" class="blank"></div>
                <div style="width: 200%">Accepted</div>
                <div style="width: 100%; line-height: 19px" v-for="(data, i) in list.question" :key="i">
                    {{ data }}
                    <br />
                    {{ `(${((data/list.questionInfo.attempted[i])*100).toFixed(0)}%)` }}
                </div>
                <div style="width: 100%" class="blank"></div>
            </div>
            <!-- dirt -->
            <div class="list-footer" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 2) * 38 }px)`}">
                <div style="width: 100%" class="blank"></div>
                <div style="width: 400%" class="blank"></div>
                <div style="width: 600%" class="blank"></div>
                <div style="width: 100%" class="blank"></div>
                <div style="width: 200%">Dirt</div>
                <div style="width: 100%; line-height: 19px" v-for="i in list.question" :key="(i + 9).toString(36)">
                    ?
                    <br />
                    (?%)
                </div>
                <div style="width: 100%" class="blank"></div>
            </div>
            <!-- fb -->
            <div class="list-footer" odd :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 3) * 38 }px)`}">
                <div style="width: 100%" class="blank"></div>
                <div style="width: 400%" class="blank"></div>
                <div style="width: 600%" class="blank"></div>
                <div style="width: 100%" class="blank"></div>
                <div style="width: 200%">First Solved</div>
                <div style="width: 100%" v-for="(data, i) in list.questionInfo.fb" :key="i">
                    {{ data }}
                </div>
                <div style="width: 100%" class="blank"></div>
            </div>
            <!-- lb -->
            <div class="list-footer" :style="{ 'transform':  `translateY(${ (list.star.length + list.score.length + 4) * 38 }px)`}">
                <div style="width: 100%" class="blank"></div>
                <div style="width: 400%" class="blank"></div>
                <div style="width: 600%" class="blank"></div>
                <div style="width: 100%" class="blank"></div>
                <div style="width: 200%">Last Solved</div>
                <div style="width: 100%" v-for="(data, i) in list.questionInfo.lb" :key="i">
                    {{ data }}
                </div>
                <div style="width: 100%" class="blank"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { filterEmptyValue, timeFormatter, msToTime } from "@/utils/AR15.js";
export default {
    data() {
        return {
            title: "第1届湘潭大学程序设计竞赛正式赛",  // 比赛名字
            time: {},  // 时间刻度
            stamp: {   // 比赛开始和比赛结束的时间
                start: 1615953600000,
                end: 1615975200000,
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
                        rank: 1,
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
                        rank: 1,
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
                        rank: 1,
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
                        rank: 1,
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
                        rank: 1,
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
                        t: 1615953600000,
                        change: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
                    },
                    {
                        t: 1615962600000,
                        change: [2,4,6,8,10,12,14,1,3,5,7,9,11,13,15,16],
                    },
                    {
                        t: 1615964400000,
                        change: [1,3,5,7,9,11,13,15,2,4,6,8,10,12,14,16],
                    },
                    {
                        t: 1615968000000,
                        change: [2,4,6,8,10,12,14,1,3,5,7,9,11,13,15,16],
                    },
                    {
                        t: 1615969800000,
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
            for(let i = 0,j = 0; i<this.list.score.length; i++) {
                if(value.find(o => o == this.list.score[i].schoolID)) {
                    this.list.star[j] = this.list.score[i];
                    j++;
                }
            }
            // 根据新star的rank排序
            for(let i = this.list.star.length - 1; i >= 0; i--) {
                for(let j = 0; j < i; j++) {
                    if(this.list.star[j].rank > this.list.star[j+1].rank) {
                        [this.list.star[j], this.list.star[j+1]] = [this.list.star[j+1], this.list.star[j]];
                    }
                }
            }
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
                this.$router.push({ query: filterEmptyValue(query) });
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

<style scoped>
    .rank {
        min-width: 1400px;
        max-width: 95%;
        margin: 0 auto;
    }
    h1 {
        text-align: center;
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
    .time-bg {
        position: absolute;
        /* 为了配合滑动条设置的css */
        width: calc(100% - 8px);
        height: 4px;
        background-color: #EEEEEE;
        margin: 4px 4px;
        box-sizing: border-box;
        border-radius: 2px;
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
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 15px;
    }
    .list {
        width: 100%;
        position: relative;
        height: calc(38px * var(--i));
    }
    .list > div {
        width: 100%;
        height: 38px;
    }
    .list-header {
        display: flex;
        justify-content: space-between;
        text-transform: capitalize;
        line-height: 38px;
        text-align: center;
    }
    .list-header > div {
        background-color: #F5F5D5;
        border: 1px solid #FFFFFF;
        box-sizing: border-box;
    }
    .list-inner {
        position: absolute;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        transition: all .4s;
        overflow: hidden;
    }
    .list-inner > div {
        border: 1px solid #FFFFFF;
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
        display: flex;
        justify-content: space-between;
        transition: all .4s;
        overflow: hidden;
        text-align: center;
        text-transform: capitalize;
        line-height: 38px;
    }
    .list-footer > div {
        border: 1px solid #FFFFFF;
        background-color: rgb(149,222,100);
    }
    .list-footer[odd] > div {
        background-color: rgb(183,235,143);
    }
    .list-footer > .blank {
        background-color: #FFFFFF !important;
    }
</style>