<style lang="scss">
    #show-step {
        border-top: 1px solid #d7d7d7;
        padding: 20px;
        .con {
            display:flex;
            margin-top:-4px;
            .left-canva {
                flex: 0 0 25px;
                display: flex;
                flex-direction: column;
                .line {
                    border-left: 1px solid #d7d7d7;
                    flex: 1;
                    color: #fff;
                    line-height: 15px;
                    margin-left: 6px;
                }
                .circle {
                    width: 13px;
                    height: 12px;
                    background: #20a0ff;
                    border-radius: 50%;
                    border: 1px solid #1d90e6;
                }
            }
            .center-text {
                flex: 1;
            }
            .right-time {
                flex: 0 0 150px;
            }
        }
    }
</style>

<template>
    <main id="show-step" v-if="list.length">
        <div class="con" v-for="item in list">
            <div class="left-canva">
                <div class="line">|</div>
                <div class="circle"></div>
                <div class="line">|</div>
            </div>
            <p class="center-text">
                {{item.user_name}} 
                <el-tag :type="item.status | stepType('tag')">
                    {{item.status | stepType('label')}}
                </el-tag>
            </p>
            <p class="right-time">{{item.time}}</p>
        </div>
    </main>
</template>

<script>
    import Step from './model'

    export default {
        components: {
        },
        props: {
            stepList: {
                type: Array || null
            }
        },
        activated () {},
        created () {},
        mounted () {},
        computed: {},
        watch: {
            stepList(val) {
                this.list = val
            }
        },
        data () {
            return {
                // list: new Step().getList(),
                list: this.stepList || []
            }
        },
        methods: {
            
        },
        filters: {},
        directives: {},
    }
</script>
