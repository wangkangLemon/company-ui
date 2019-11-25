<!-- 审核 -->
<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/common";
    #server-approval-container {
        position: relative;
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }
</style>
<template>
    <article id="server-approval-container">
        <el-tabs v-model="tabName" type="border-card">
            <el-tab-pane label="请假" name="leave">
                <Leave v-if="tabName=='leave'" ref="leave"></Leave>
            </el-tab-pane>
            <el-tab-pane label="加班" name="overtime">
                <OverTime v-if="tabName=='overtime'" ref="overtime"></OverTime>
            </el-tab-pane>
            <el-tab-pane label="外出" name="outwork">
                <OutWork v-if="tabName=='outwork'" ref="outwork"></OutWork>
            </el-tab-pane>
            <el-tab-pane label="通用审批" name="approval">
                <Common v-if="tabName=='approval'" ref="approval"></Common>
            </el-tab-pane>
        </el-tabs>
        <el-button class="top-btn" icon="el-icon-document" type='warning' @click="fileExport">导出Excel</el-button>
    </article>
</template>

<script>
    import OverTime from './Overtime'
    import Leave from './Leave'
    import OutWork from './Outwork'
    import Common from './Common'

    export default {
        components: {
            OverTime,  // 加班
            Leave,   // 请假
            OutWork, // 外出
            Common //   通用

        },
        data () {
            return {
                tabName: 'leave',
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            fileExport () {
                this.$refs[this.tabName].fileExport()
            }
        },
    }
</script>
