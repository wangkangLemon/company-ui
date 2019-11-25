<style lang="scss">
    @import "~utils/mixins/common";
    .selectedtask-container {
        .task-item {
            width: 80%;
            margin: 10px 0;
            // border: 1px dashed #dadada;
            padding: 0 10px;
        }
    }
</style>

<template>
    <div class="selectedtask-container">
        <ul>
            <li 
                class="task-item" 
                v-for="(task, index) in phase_object_list"
                v-if="task.type === taskType" 
                :key="task.object_id + task.object_name">
                <el-tag :type="task.object_type | taskType('tag')">{{task.object_type | taskType('label')}}</el-tag>
                <span>{{task.object_name}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        components: {
        },
        props: {
            selected: Array,
            taskType: Number,
        },
        activated () {},
        created () {},
        mounted () {},
        computed: {},
        watch: {
        },
        data () {
            return {
                phase_object_list: this.selected,
            }
        },
        methods: {
        },
        filters: {},
        directives: {},
    }
</script>
