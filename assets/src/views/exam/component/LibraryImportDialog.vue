<style lang='scss' rel='stylesheet/scss'>
    #dialog-library-import {
        .el-table {
            .no-padding {
                .cell {
                    padding: 0
                }
            }
            .cell {
                padding: 0 10px;
            }
        }
    }
</style>

<template>
    <el-dialog append-to-body id="dialog-library-import" title="试题导入" :visible.sync="isOpen" @click.native.stop>
        <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item label="题库名称">
                <SelectScroll :requestCb="fetchLibrary" v-model="search.subject_group_id" :changeCb="changeLibrary"></SelectScroll>
            </el-form-item>
            <el-form-item label="题库类型">
                <el-select v-model.number="search.type" placeholder="题库类型" :clearable="true" @change="fetchQuestion">
                    <el-option label="判断题" :value="0"></el-option>
                    <el-option label="单选题" :value="1"></el-option>
                    <el-option label="多选题" :value="2"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-row :gutter="10">
            <el-col :span="10">
                <el-table
                    ref="questionTable"
                    :data="questionList.data"
                    :show-header="false"
                    height="400"
                    @select="choiceQuestion">
                    <el-table-column
                        width="40"
                        type="selection">
                    </el-table-column>
                    <el-table-column
                        width="55"
                        className="no-padding">
                        <template slot-scope="scope">
                            <el-tag type="primary" v-if="scope.row.type == 0">判断题</el-tag>
                            <el-tag type="danger" v-if="scope.row.type == 1">单选题</el-tag>
                            <el-tag type="warning" v-if="scope.row.type == 2">多选题</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <p>{{ scope.row.description }}</p>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        style="text-align: right"
                        @size-change="onSizeChange"
                        @current-change="onPageChange"
                        layout="prev, pager, next"
                        :current-page="search.page"
                        :page-size="search.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        :total="questionList.total">
                </el-pagination>
            </el-col>
            <el-col :span="14">
                <el-table
                        :data="choiceList"
                        :show-header="false"
                        height="400">
                    <el-table-column
                            width="70">
                        <template slot-scope="scope">
                            <el-tag type="primary" v-if="scope.row.type == 0">判断题</el-tag>
                            <el-tag type="danger" v-if="scope.row.type == 1">单选题</el-tag>
                            <el-tag type="warning" v-if="scope.row.type == 2">多选题</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <p>{{ scope.row.description }}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-button type="primary" @click="importQuestion">插入</el-button>
    </el-dialog>
</template>
<script>
    import testLibraryService from 'services/exam/testLibraryService'
    import testQuestionService from 'services/exam/testQuestionService'
    import SelectScroll from 'components/form/SelectScroll.vue'
    import Question from 'models/quesion'
    // import NestedDialog from 'components/dialog/NestedDialog.vue'

    export default {
        props: {
            confirmFn: Function
        },
        data () {
            return {
                isOpen: false,
                questionList: {
                    data: [],
                    total: 0,
                },
                choiceList: [],
                search: {
                    type: '',
                    subject_group_id: '',
                    status: 0,
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            open () {
                this.choiceList = []
                this.search.type = ''
                this.search.subject_group_id = ''
                this.fetchQuestion()
                this.isOpen = true
            },
            close () {
                this.isOpen = false
            },
            importQuestion () {
                this.close()
                this.confirmFn(this.choiceList)
            },
            fetchLibrary (keyword, length) {
                let page = parseInt(length / 10) + 1
                return testLibraryService.search({keyword, page}).then((ret) => {
                    let result = {
                        data: [],
                        total: ret.total
                    }
                    if (ret.list == null) {
                        ret.list = []
                    }
                    ret.list.forEach((value) => {
                        result.data.push({
                            id: value.id,
                            name: value.name,
                        })
                    })
                    return result
                })
            },
            fetchQuestion () {
                if (this.$refs['questionTable']) {
                    this.$refs['questionTable'].clearSelection()
                }
                return testQuestionService.search(this.search).then((ret) => {
                    this.questionList.total = ret.total
                    this.questionList.data = ret.data
                    this.$nextTick(() => {
                        this.questionList.data.forEach(row => {
                            this.choiceList.forEach(choice => {
                                if (row.id === choice.id) {
                                    this.$refs['questionTable'].toggleRowSelection(row, true)
                                }
                            })
                        })
                    })
                })
            },
            changeLibrary (id) {
                this.search.subject_group_id = id
                this.fetchQuestion()
            },
            choiceQuestion (selection, row) {
                let question = new Question()
                question.findById(row.id)
                let has = false
                let offset = 0

                for (let i = 0; i < this.choiceList.length; i++) {
                    let question = this.choiceList[i]
                    if (row.id === question.id) {
                        has = true
                        offset = i
                        break
                    }
                }

                if (has) {
                    this.choiceList.splice(offset, 1)
                } else {
                    this.choiceList.push(question)
                }
            },
            onPageChange (val) {
                this.search.page = val
                this.fetchQuestion()
            },
            onSizeChange (val) {
                this.search.page_size = val
                this.fetchQuestion()
            }
        },
        components: {SelectScroll}
    }
</script>
