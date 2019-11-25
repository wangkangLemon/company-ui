<!-- 设置学员/教员 加减组件 -->
<style lang="scss">
    #teaching-assignmember-container {
        .inner {
            width: 50%;
            vertical-align: top;
            margin-bottom: 5px;
            span {
                line-height: 40px;
            }
        }
        .inner__disabled {
            cursor: not-allowed;
            pointer-events: none;
            // cursor: default;
            opacity: 0.6;
        }
        .operation {
            display: inline-block;
            vertical-align: top;
            .append {
                padding: 12px;
            }
        }
    }

</style>

<template>
    <main id="teaching-assignmember-container">
        <section class="" v-for="(user,index) in publish_users" :key="index">
            <div :class="['inner', 'el-input__inner', { 'inner__disabled': disabled }]" @click="addUser(index, 'user')">
                <span v-if="user.user_name && user.coacher_name">{{user.user_name}}-{{user.coacher_name}}</span>
                <span v-else>选择人员</span>
            </div>
            <div class="operation" v-if="!isEdit">
                <el-button type="warning" class="append" @click="plus">+</el-button>
                <el-button type="danger" class="append" v-if="index !== 0" @click="del(index)">-</el-button>
            </div>
        </section>
        <User 
            v-if="userModel.showDialog"
            :visible.sync="userModel.showDialog"
            title="选择人员"
            :selected="userModel.selectObj"
            @pick="getUser">
        </User>
    </main>
</template>

<script>
    import User from './User.vue'

    export default {
        components: {
            User
        },
        props: {
            disabled: Boolean,
            select: Array,
            isEdit: Boolean,
        },
        activated () {},
        created () {

        },
        mounted () {},
        computed: {},
        watch: {
            select (val) {
                this.publish_users = initPusher(val)
            }
        },
        data () {
            return {
                userModel: {
                    showDialog: false,
                    index: '',
                    selectObj: {}
                },
                num: 1,
                publish_users: initPusher(this.select)
            }
        },
        methods: {
            addUser (index, type) {
                this.userModel.selectObj = this.publish_users[index]
                this.userModel.showDialog = true
                this.userModel.index = index
            },
            getUser (val) {
                this.$set(this.publish_users, this.userModel.index, val)
                console.log(this.select)
            },
            del (index) {
                this.publish_users.splice(index, 1)
            },
            plus () {
                this.publish_users.push(initUser())
            },
        },
        filters: {},
        directives: {},
    }
    function initPusher (select) {
        let res = select || []
        !res.length && res.push(initUser())
        return res
    }
    function initUser () {
        return {
            user_id: '',
            user_name: '',
            coacher_id: '',
            coacher_name: '',
            // user_department: '',
            // coacher_department: '',
        }
    }
</script>
