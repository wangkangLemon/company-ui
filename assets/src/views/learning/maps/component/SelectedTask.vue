<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-maps-selectedtask-container {
        .task-item {
            width: 80%;
            margin: 10px 0;
            border: 1px dashed #dadada;
            padding: 0 10px;
        }
        ul {
            .delete {
                cursor: pointer;
                line-height: 40px;
                float: right;
                // margin-left: 100px;
            }
        }
    }
</style>

<template>
    <main id="learning-maps-selectedtask-container">
        <draggable v-if="draggable" :list="phase_object_list" @end="onEnd">
            <div 
                class="task-item" 
                v-for="task in phase_object_list" 
                :key="task.object_id + task.object_name"  
                v-if="task.type === taskType"
                title="可拖动">
                <i class="el-icon-sort"></i>
                <el-tag :type="task.object_type | taskType('tag')">{{task.object_type | taskType('label')}}</el-tag>
                <el-tooltip 
                    v-if="(task.object_type === 'medicine_task' || task.object_type ==='practical_operation') && task.data.po_course_name"
                    class="item" 
                    effect="dark" 
                    :content="task.data.po_course_name" 
                    placement="top-start">
                    <span>{{task.object_name}}</span>
                </el-tooltip>
                <span v-else>{{task.object_name}}</span>
            </div>
        </draggable>
        <ul v-else>
            <li 
                class="task-item" 
                v-for="(task, index) in phase_object_list"
                v-if="task.type === taskType" 
                :key="task.object_id + task.object_name">
                <el-tag :type="task.object_type | taskType('tag')">{{task.object_type | taskType('label')}}</el-tag>
                <el-tooltip 
                    v-if="(task.object_type === 'medicine_task' || task.object_type ==='practical_operation') && task.data.po_course_name"
                    class="item" 
                    effect="dark" 
                    :content="task.data.po_course_name" 
                    placement="top-start">
                    <span>{{task.object_name}}</span>
                </el-tooltip>
                <span v-else>{{task.object_name}}</span>
                <i 
                    v-if="taskType === 3 && !disabled" 
                    class="el-icon-delete delete" 
                    title="删除任务" 
                    @click="deleteTask(task, index)">
                </i>
            </li>
        </ul>
    </main>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable
        },
        props: {
            disabled: Boolean,
            selected: Array,
            taskType: Number,
            delete: Function,
            draggable: {
                type: Boolean,
                default: false,
            }
        },
        activated () {},
        created () {},
        mounted () {},
        computed: {},
        watch: {
            selected (val) {
                this.phase_object_list = val
            }
        },
        data () {
            return {
                phase_object_list: this.selected,
            }
        },
        methods: {
            deleteTask (task, index) {
                this.phase_object_list.splice(index, 1)
                this.delete && this.delete(task, index)
            },
            onEnd () {
                this.$emit('end')
            }
        },
        filters: {},
        directives: {},
    }
</script>
