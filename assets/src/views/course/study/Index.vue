<!-- 成绩 -->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    #course-study-container {
        position: relative;
        .export {
            position: absolute;
            top: -50px;
            right: 0;
            z-index: 10;
            i {
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
</style>
<template>
    <article id="course-study-container">
        <el-button icon="el-icon-document" type="warning" class="export" @click="exportData" :loading="loading">导出Excel</el-button>
        <el-tabs v-model="tabName" type="border-card" >
            <el-tab-pane label="成绩汇总" name="highest">
                <Highest v-if="tabName=='highest'" ref="highest"></Highest>
            </el-tab-pane>
            <el-tab-pane label="考试记录" name="history">
                <History v-if="tabName=='history'" ref="history"></History>
            </el-tab-pane>
        </el-tabs>
    </article>
</template>

<script>
import Highest from './Highest'  // 成绩汇总
import History from './History'  // 成绩记录
export default {
    components: {
        History,
        Highest
    },
    data () {
        return {
            loading: false,
            tabName: 'highest'
        }
    },
    created () {
        if (this.$route.meta.tab) {
            this.tabName = 'history'
        }
    },
    activated () {
        xmview.setContentLoading(false)
    },
    methods: {
        exportData () {
            this.loading = true
            this.$refs[this.tabName].exportData().then(() => {
                this.loading = false
            })
        }
    }
}
</script>
