<template>
    <div>
        <el-button type='primary' @click="openImportDialog()">关联题库</el-button>
        <section v-if="!paper.subject_groups.length"></section>
        <section v-else v-for="(subject, index) in paper.subject_groups" class="library" :key="subject.id">
            <div class="library-operation">
                <span>题库名称：{{subject.name}}({{subject.subject_total}})</span>
                <i class="el-icon-delete library-icon" @click="deleteSubject(index)"></i>
            </div>
            <div class="library-info">
                <el-row type="flex" justify="space-between">
                    <el-col :span="6">
                        <div class="library-subject1 library-subject">
                            <p class="library-type">单选题</p>
                            <p>{{subject.single_total}}题</p>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="library-subject2 library-subject">
                            <p class="library-type">多选题</p>
                            <p>{{subject.multi_total}}题</p>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="library-subject3 library-subject">
                            <p class="library-type">判断题</p>
                            <p>{{subject.judge_total}}题</p>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </section>
        <el-dialog
                append-to-body
                id="dialog-subject-group"
                v-if="subjectDialog.showDialog"
                title="关联题库"
                :visible.sync="subjectDialog.showDialog"
                @click.native.stop>

            <el-form :inline="true" :model="subjectDialog.fetchParam" class="search" @submit.native.prevent>
                <el-form-item label="题库名称">
                    <el-input v-model="subjectDialog.fetchParam.keyword" placeholder="题库名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchSubjectGroup">查询</el-button>
                </el-form-item>
            </el-form>
            <Transfer
                    :data="subjectDialog.data"
                    v-model="paper.subject_groups"
                    @current-change="val => {subjectDialog.fetchParam.page = val; fetchSubjectGroup()}"
                    @size-change="val => {subjectDialog.fetchParam.page_size = val; fetchSubjectGroup()}"
                    :current-page="subjectDialog.fetchParam.page"
                    :page-size="subjectDialog.fetchParam.page_size"
                    :total="subjectDialog.total">
                <template slot="source-column" slot-scope="scope">
                    <el-tag type="info" style="float: right">{{scope.row.subject_total}}道题</el-tag>
                </template>
                <template slot="target-column" slot-scope="scope">
                    <el-tag type="info" style="float: right">{{scope.row.subject_total}}道题</el-tag>
                </template>
            </Transfer>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmSubjectGroup">确定</el-button>
                <el-button @click="subjectDialog.showDialog= false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import testLibraryService from 'services/exam/testLibraryService'
    import Transfer from 'components/dialog/Transfer2.vue'
    import Library from '@/models/library'
    // import NestedDialog from '@/views/component/dialog/NestedDialog'

    export default {
        name: 'subject-group',
        components: {
            Transfer},
        props: {
            paper: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                subjectDialog: {
                    showDialog: false,
                    fetchParam: initSubjectFetchParam(),
                    data: [],
                    total: 0,
                },
            }
        },
        methods: {
            openImportDialog () {
                this.subjectDialog.fetchParam = initSubjectFetchParam()
                this.fetchSubjectGroup()
                this.subjectDialog.showDialog = true
            },
            fetchSubjectGroup () {
                testLibraryService.search(this.subjectDialog.fetchParam).then(ret => {
                    let data = []
                    ret.list.forEach(item => {
                        let library = new Library()
                        library.setModel(item)
                        data.push(library)
                    })
                    this.subjectDialog.data = data
                    this.subjectDialog.total = ret.total
                })
            },
            confirmSubjectGroup () {
                this.subjectDialog.showDialog = false
            },
            deleteSubject (index) {
                this.paper.subject_groups.splice(index, 1)
                this.subjectDialog.subject_group.splice(index, 1)
            }
        }
    }

    function initSubjectFetchParam () {
        return {
            keyword: '',
            page: 1,
            page_size: 15
        }
    }
</script>

<style lang='scss' rel='stylesheet/scss'>
    .library {
        margin-top: 22px;
        margin-bottom: 10px;
        min-width: 500px;
        border: 2px dashed #E6EAEE;
        // box-sizing: border-box;
        .library-operation {
            padding: 0 4%;
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #E6EAEE;
            background-color: #EFF1F6;
            .library-icon {
                float: right;
                cursor: pointer;
                line-height: 50px;
            }
        }
        .library-info {
            padding: 0 4%;
            .library-subject {
                .library-type {
                    color: #7F8FA4;
                }
            }
            .library-subject2 {
                text-align: center;
            }
            .library-subject3 {
                text-align: right;
            }
        }
    }
    #dialog-subject-group {
        .search {
            margin: 0 0 20px 27px;
        }
    }
</style>