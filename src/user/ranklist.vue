<template>
    <div class="ranklist" id="ranklist">
        <h1>排行榜</h1>
        <div class="list" v-bind:style="{
            height: list.length*42 + 'px'
        }">
            <template v-for="(item,i) in list">
                <div class="listItem" v-bind:key="i" v-bind:style="{
                    transform: 'translateY(' + (item.rank-1)*42 + 'px)'
                }">
                    <div class="name" v-text="item.name"></div>
                    <div class="rank" v-text="item.rank"></div>
                </div>
            </template>
        </div>
        <a-button @click="test">测试</a-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [
                {
                    name: "李昶浩",
                    rank: 1,
                },
                {
                    name: "昶浩",
                    rank: 2,
                },
                {
                    name: "浩",
                    rank: 3,
                },
                {
                    name: "李昶",
                    rank: 4,
                },
                {
                    name: "李浩",
                    rank: 5,
                }
            ]
        }
    },
    methods: {
        test() {
            for(let i=0; i<this.list.length; i++) {
                if(this.list[i].rank == this.list.length) {
                    this.list[i].rank = 1;
                } else {
                    this.list[i].rank++;
                }
            }
        }
    }
}
</script>

<style>
    .ranklist {
        width: 75vw;
        position: relative;
        margin: 0 auto;
        background-color: #FCFDFE;
    }
    .list {
        width: 100%;
        position: relative;
    }
    .listItem {
        position: absolute;
        width: 100%;
        height: 42px;
        line-height: 42px;
        display: flex;
        justify-content: space-around;
        transition: all .6s;
    }
    .listItem:hover {
        background-color: aqua;
    }
</style>