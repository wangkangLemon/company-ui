<style lang="scss">
    #learning-maps-task-container {
        .el-tabs__content {
            position: relative;
            .dialog-select-item {
                h5 {
                    line-height: 40px;
                    font-size: 14px;
                    padding-left: 20px;
                    background: #fbfdff;
                    border: 1px solid #d1dbe5;
                    border-bottom: none;
                }
                position: absolute;
                top: 85px;
                right: 55px;
                height: 500px;
                width: 42%;
                display: inline-block;
                vertical-align: top;
            }
        }
        .row-class {
            border: 1px solid #d1dbe5;
        }
    }
</style>

<template>
    <main id="learning-maps-task-container">
        <el-dialog 
            :title="title" 
            :visible.sync="showDialog"
            @close="close"
            width="90%">
            <el-tabs type="border-card" @tab-click="handleTabClick" v-model="tabs">
                <el-tab-pane 
                    v-for="tab in tabList"
                    :key="tab.value"
                    :label="tab.label"
                    :name="tab.type">
                    <component
                        ref="transfers"
                        :is="tab.component"
                        :type="tab.type"
                        :taskType="taskType"
                        :childType="tab.childType"
                        :coursetask="coursetask"
                        v-model="tab.selected"
                        @medicineTaken="getMedicine"
                        @curRow="getCurRow">
                    </component>
                </el-tab-pane>
                <div class="dialog-select-item" :style="customStyle">
                    <h5>已选择</h5>
                    <el-table class="row-class" :show-header="false" :data="selected" :height="440" :row-key="selected.object_id" v-if="showDialog">
                        <el-table-column
                            prop="name" 
                            label="课程名">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.type | taskType('tag')">
                                    {{scope.row.type | taskType('label')}}
                                </el-tag>
                                <el-tooltip 
                                    v-if="(scope.row.type === 'medicine_task' || scope.row.type ==='practical_operation') && scope.row.po_course_name"
                                    class="item" 
                                    effect="dark" 
                                    :content="scope.row.po_course_name" 
                                    placement="top-start">
                                    <span>{{scope.row.name}}</span>
                                </el-tooltip>
                                <span v-else>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="50"
                            label="">
                            <template slot-scope="scope">
                                <el-button 
                                    type="text" 
                                    @click="deleteRow(scope.$index, scope.row)" 
                                    icon="el-icon-delete"
                                    size="small">
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="footer"><el-button type="text" @click="deleteAll">全部删除</el-button></div>
                </div>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">插入</el-button>
            </span>
        </el-dialog>    
    </main>
</template>

<script>
    import Transfer from 'components/dialog/Transfer2.vue'
    import CourseTransfer from 'components/transfer/CourseTransfer.vue'
    import SpeakingTransfer from 'components/transfer/SpeakingTransfer.vue'
    import ExamTransfer from 'components/transfer/ExamTransfer.vue'
    import MedicineTaken from 'components/form/MedicineTaken.vue'
    import PracticalOperation from 'components/form/PracticalOperation.vue'
    import Task from './model'

    export default {
        components: {
            Transfer,
            CourseTransfer,
            SpeakingTransfer,
            ExamTransfer,
            MedicineTaken,
            PracticalOperation
        },
        props: {
            customStyle: Object,
            initTabs: Array,
            selected: Array,
            visible: Boolean,
            title: {
                type: String,
                default: '选取学习内容'
            },
            coursetask: {
                type: Boolean,
                default: false, // 是否来自课程任务 -> 任务管理
            },
            taskType: Number,
            keys: {
                type: Array,
                required: false
            },
            defaultTabs: {
                type: String,
                default: 'course'
            }
        },
        activated () {},
        created () {
        },
        mounted () {},
        computed: {},
        watch: {
            visible (val) {
                this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            },
            initTabs (val) {
                this.tabList = (this.initTabs && this.initTabs.length && this.initTabs) || new Task().initTabs(this.keys)
            }
        },
        data () {
            return {
                showDialog: this.visible,
                tabList: (this.initTabs && this.initTabs.length && this.initTabs) || new Task().initTabs(this.keys),
                tabKeys: this.keys || Task.keys,
                tabs: this.defaultTabs,
            }
        },
        methods: {
            deleteRow (index, row) {
                let ref = this.getRefsByType(this.$refs.transfers, row)
                if (!(row.type === 'medicine_task' || row.type === 'practical_operation')) {
                    ref.$refs.transfer.toggleRowSelectionById(row)
                    ref.$refs.transfer.selectData.forEach((item, index, array) => {
                        (row.id + row.type) === (item.id + item.type) && array.splice(index, 1)
                    })
                } 
                this.selected.splice(index, 1)
            },
            deleteAll () {
                for (let ref of Object.values(this.$refs.transfers)) {
                    let transfer = ref.$refs.transfer || {}
                    if (transfer.toggleRowSelection) {
                        transfer.deleteAll()
                        transfer.selectData = []
                    }
                }
                while (this.selected.length > 0) {
                    this.selected.splice(0, 1)
                }
            },
            getCurRow (row, all) {
                this.formatRow(row)
                if (all) {
                    if (!this.selected.some(item => item.id + item.type === row.id + row.type)) {
                        this.selected.push(row)
                    }
                } else {
                    if (this.selected.some(item => item.id + item.type === row.id + row.type)) {
                        for (let i = 0; i < this.selected.length; i++) {
                            if (this.selected[i].id + this.selected[i].type === row.id + row.type) {
                                this.selected.splice(i, 1)
                                return
                            }
                        }
                    } else {
                        this.selected.push(row)
                    }
                }
            },
            getMedicine (row) {
                this.selected.push(row)
                // if (isAdd) {
                // } else {
                //     for (let i = 0; i < this.selected.length; i++) {
                //         if (this.selected[i].type === row.type && this.selected[i].name === row.name) {
                //             this.selected.splice(i, 1)
                //             return
                //         }
                //     }
                // }
            },
            formatRow (row) {
                if (row.type === 'speaking') row.name = row.title
            },
            submit () {
                this.$emit('submit', this.selected)
                this.showDialog = false
            },
            close () {
                this.$emit('close')
            },
            handleTabClick () {},
            getRefsByType (refs, row) {
                return refs.filter(ref => {
                    return (ref.childType && ref.childType.includes(row.type)) || row.type === ref.type
                })[0]
            }
        },
        filters: {},
        directives: {},
    }
</script>
