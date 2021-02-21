<template>
    <div class="rank" id="rank">
        <h1 v-text="title"></h1>
        <div class="time">
            <a-slider :marks="time" v-model="progress" :step="timeStep" :tip-formatter="formatter"></a-slider>
            <div class="time-detail">
                <span>总时长：4:00:00</span>
                <span>剩余时长：4:00:00</span>
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
            <div class="list-inner star" v-for="(data, i) in list.star" :key="'star' + i" v-bind:style="{ 'transform': `translateY(${i*38}px)` }">
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
            <div class="list-inner" v-for="(data, i) in list.score" :key="i" v-bind:class="data.level" v-bind:style="{ 'transform': `translateY(${(data.place-1+list.star.length)*38}px)` }">
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
        </div>
        <a-button type="primary" @click="test">测试</a-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: "第1届湘潭大学程序设计竞赛正式赛",  // 比赛名字
            time: {
                0: {
                    label: "2021-02-20 20:00:00",
                },
                100: {
                    style: {
                        whiteSpace: 'nowrap'
                    },
                    label: "2021-02-20 24:00:00",
                },
            },
            stamp: {
                start: 1613822400000,
                end: 1613836800000,
            },
            timeStep: 0.01, // 进度条的最低刻度
            progress: 25, // 进度条（百分比）
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
                                statu: "none"
                            },
                            {
                                statu: "first-blood",
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
                                statu: "first-blood",
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
                                statu: "first-blood",
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
                                statu: "first-blood",
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
                                statu: "first-blood",
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
                                statu: "first-blood",
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
                                statu: "first-blood",
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
                        place: 14,
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
                                statu: "first-blood",
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
                star: [],
                placeChange: [
                    {
                        t: 1613826000000,
                        change: [3,1,2,4,5,6,7,8,9,10,11,12,13,14,15],
                    },
                    {
                        t: 1613829600000,
                        change: [3,1,2,5,8,6,7,8,9,10,11,12,13,14,15],
                    },
                    {
                        t: 1613833200000,
                        change: [3,1,2,5,8,6,7,8,9,10,11,12,13,14,15],
                    },
                    {
                        t: 1613836800000,
                        change: [3,1,2,4,5,6,7,8,9,10,11,12,13,14,15],
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
            }
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
            // TODO 时间
            // // 确认时间进度
            // let time = new Date();
            // if(time.getTime() < this.stamp.end) {  // 如果当前时间比结束时间早，就调整进度条
            //     this.progress = ((time.getTime() - this.stamp.start) / (this.stamp.end - this.stamp.start)) * 100;
            // } else {   // 否则直接给100
            //     this.progress = 100;
            // }
            // star
            let star = [];
            for(let i in this.query.organization) {
                star.push(this.school.find(o => o.name == this.query.organization[i]).id);
            }
            this.starSchool = star;
            this.handleStar(star);
        },
        formatter() {
            let stamp = ((this.stamp.end - this.stamp.start) * this.progress / 100) + this.stamp.start;  // 时间戳
            let time = new Date();
            time.setTime(stamp);
            return `${time.getHours()}:${time.getMinutes()<10? '0'+time.getMinutes():time.getMinutes()}:${time.getSeconds()<10? '0'+time.getSeconds():time.getSeconds()}`
        },
        test() {
            for(let i in this.list.score) {
                if(this.list.score[i].place == this.list.score.length) {
                    this.list.score[i].place = 1;
                } else {
                    this.list.score[i].place++;
                }
            }
            // 按rank排序
        },
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
            // TODO 把信息push到route里
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
    }
    .time-detail {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
    }
    .list-inner > div {
        border: 1px solid #FFFFFF;
        box-sizing: border-box;
        text-align: center;
        line-height: 38px;
    }
    .list-inner:hover {
        background-color: #e6f7ff;
        color: #999999;
    }
    .list-inner:hover .none,.list-inner:hover .first-blood,.list-inner:hover .solved,.list-inner:hover .attempted,.list-inner:hover .pending {
        background-color: #e6f7ff;
    }
</style>