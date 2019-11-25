<!--文档管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";

    #course-manage-doc-container {
        .pagin {
            margin-top: 15px;
            text-align: right;
        }
    }
</style>

<template>
    <el-tabs type="border-card"  v-model="activeName">
        <el-tab-pane
            v-for="item in tableList"
            :key="item.label"
            :label="item.label"
            :name="item.label">
            <component v-if="activeName===item.label" :is="item.component"></component>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import DenyCourse from './component/DenyCourse.vue'
    import DenyStore from './component/DenyStore.vue'
    import TakeCourse from './component/TakeCourse.vue'
    import authUtils from '../../../utils/authUtils'

    export default{
        data () {
            const tableList = [
                {
                    label: '可参与的课程',
                    component: TakeCourse
                }
            ]

            if (authUtils.isPermission('com_course_deny_course_search')) {
                tableList.push({
                    label: '已屏蔽的课程',
                    component: DenyCourse
                })
            }

            if (authUtils.isPermission('com_course_deny_industry_search')) {
                tableList.push({
                    label: '已屏蔽的工业',
                    component: DenyStore
                })
            }

            return {
                tableList: tableList,
                activeName: '可参与的课程'
            }
        },
        created () {

        },
        methods: {
        },
        components: {
            DenyCourse,
            DenyStore,
            TakeCourse
        }

    }
</script>
