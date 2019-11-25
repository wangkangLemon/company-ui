<!--公告-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/topSearch";
     @import "../../utils/mixins/common";
    .announce-content-container {
       @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .show-detail {
            .info {
                h2 {
                    text-align: center;
                    margin-bottom: 10px;
                }
                > div {
                    text-indent: 2em;
                    line-height: 28px;
                }
            }
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
        .dialogContent {
            height: 500px;
            border-top: 1px solid #ccc;
            overflow-y:scroll;

        }
    }
</style>
<template>
    <article class="announce-content-container">
        <!--详情-->
        <el-dialog title="查看公告" class="show-detail" :visible.sync="showDetail">
            <div class="info">
                <h2>{{currentItem.title}}</h2>
                <div>
                    {{currentItem.content}}
                </div>
            </div>
        </el-dialog>
      <section class="add">
            <el-button type="primary" icon="el-icon-plus" @click="addAnnounce">添加</el-button>
      </section>
            <section class="search">
                <section>
                    <i>标题</i>
                    <el-input @keyup.enter.native="fetchData" v-model="fetchParam.title" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>状态</i>
                    <el-select clearable v-model="fetchParam.status" @change="fetchData">
                        <el-option label="正常" value="0"></el-option>
                        <el-option label="草稿" value="1"></el-option>
                        <el-option label="撤销" value="2"></el-option>
                    </el-select>
                </section>
                  <section>
                    <i>发布对象</i>
                    <el-select clearable v-model="fetchParam.type" @change="fetchData">
                        <el-option label="全体员工" value="company"></el-option>
                        <el-option label="指定部门" value="organization"></el-option>
                        <el-option label="指定门店" value="department"></el-option>
                        <el-option label="指定员工" value="user"></el-option>
                        <el-option label="指定用户组" value="user_group"></el-option>
                    </el-select>
                </section>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="announceData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="title"
                        label="标题">
                <template slot-scope="scope">
                    <el-button type="text"  @click="showArticle(scope.row)">
                         {{scope.row.title}}
                    </el-button>
                </template>
                </el-table-column>
                 <el-table-column
                        prop="type"
                        width="120"
                        label="发布对象">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.type == 'company'">全体员工</el-tag>
                        <el-tag type="primary" v-if="scope.row.type == 'department'">指定门店</el-tag>
                        <el-tag type="primary" v-if="scope.row.type == 'organization'">指定部门</el-tag>
                        <el-tag type="primary" v-if="scope.row.type == 'user'">指定员工</el-tag>
                        <el-tag type="primary" v-if="scope.row.type == 'user_group'">指定用户组</el-tag>

                    </template>
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        width="180"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop="status"
                        width="100"
                        label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 0" type="success">{{statusArr[scope.row.status]}}</el-tag>
                        <el-tag v-else-if="scope.row.status === 1" type="warning">{{statusArr[scope.row.status]}}</el-tag>
                        <el-tag v-else type="info">{{statusArr[scope.row.status]}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        width="150"
                        label="阅读情况">
                    <template slot-scope="scope">
                        <el-button type="text"  @click="showReadCount(scope.row)">
                             {{scope.row.read_count}}/{{scope.row.publish_count}}
                        </el-button>
                    </template>
                    </el-table-column>
                <el-table-column
                        prop="operate"
                        width="200"
                        label="操作">
                  <template slot-scope="scope">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="editAnnounce(scope.row)"
                            :disabled="creatorDisabled(scope.row.creator_id)">
                            修改
                        </el-button>
                         <el-button 
                            type="text" 
                            size="small" 
                            @click="disabledAnnounce(scope.row)"
                            :disabled="creatorDisabled(scope.row.creator_id)">
                            {{scope.row.status == 0 ? '撤销' : '发布'}}
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="deleteAnnounce(scope.$index, scope.row)"
                            :disabled="creatorDisabled(scope.row.creator_id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15, 30, 60, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
            <el-dialog :title="dialogTitle" :visible.sync="showDialog">
                <div class="dialogContent" v-html="dialogContent">
                </div>
                 <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="showDialog = false">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="showDialog2" :title="dialogTitle2">
                <section class="search">
                    <section>
                        <i>员工</i>
                        <el-input @keyup.enter.native="getReadData" v-model="readParams.user_name" auto-complete="off"></el-input>
                    </section>
                    <section>
                        <i>阅读情况</i>
                        <el-select clearable v-model="readParams.status" @change="getReadData">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="已读" value="1"></el-option>
                            <el-option label="未读" value="2"></el-option>
                        </el-select>
                    </section>
                </section>
                <el-table border :data="readInfo" v-loading="loading">
                   <el-table-column
                       label="门店"
                       prop="department_name"
                       min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop ='user_name'
                        label="员工"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                       label="阅读情况"
                       prop="status"
                       min-width="70">
                       <template slot-scope="scope">
                            <el-tag v-if="scope.row.status == 1" type="success">已读</el-tag>
                            <el-tag v-else type="info">未读</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop ='read_time'
                        label="阅读时间"
                        min-width="120">
                    </el-table-column>
                </el-table>
                <el-pagination class="block" style="margin: 10px 0;text-align: right;"
                    @size-change="val=> {readParams.page_size=val; getReadData()}"
                    @current-change="val=> {readParams.page=val; getReadData()}"
                    :current-page="readParams.page"
                    :page-size="readParams.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total2">
                </el-pagination> 
            </el-dialog>
    </article>
</template>
<script>
    import announceService from 'services/server/announceService'
    export default {
        data () {
            return {
                currentItem: {
                    title: '',
                    content: ''
                },
                showDialog: false,
                showDialog2: false,
                dialogTitle: '',
                dialogTitle2: '',
                dialogContent: '',
                readInfo: [],
                statusArr: ['正常', '草稿', '撤销'],
                showDetail: false,
                loading: false,
                currentPage: 1,
                pageSize: 15,
                announceData: [],
                total: 0,
                fetchParam: clearSearch(),
                readParams: clearReadInfo(),
                total2: 0,
            }
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam () {
                this.currentPage = 1
                this.fetchParam = clearSearch()
            },
            editAnnounce (row) {
                this.$router.push({name: 'server-announce-add', query: {id: row.id, status: row.status}})
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.fetchData()
            },
            addAnnounce () {
                this.$router.push({name: 'server-announce-add'})
            },
            deleteAnnounce (index, row) {
                xmview.showDialog(`你将要删除公告【<i style="color:red">${row.title || ''}</i>】操作不可恢复确认吗？`, () => {
                    announceService.deleteAnnounce(row.id).then(() => {
                        this.fetchData()
                        xmview.showTip('success', '操作成功')
                    })
                })
            },
            disabledAnnounce (row) {
                xmview.showDialog(`你将要公告${row.status !== 0 ? '发布' : '撤销'}【<i style="color:red">${row.title || ''}</i>】操作吗？`, () => {
                    let reqFn
                    if (row.status !== 0) {
                        reqFn = announceService.publishAnnounce
                    } else {
                        reqFn = announceService.revokeAnnounce
                    }
                    reqFn(row.id).then(() => {
                        this.fetchData()
                        xmview.showTip('success', '操作成功')
                    })
                })
            },
            showArticle (row) {
                this.dialogTitle = row.title
                announceService.getEditDetail(row.id).then((ret) => {
                    this.dialogContent = ret.data.content
                })
                this.showDialog = true
            },
            showReadCount (row) {
                this.readParams = clearReadInfo()
                this.readParams.announce_id = row.id
                this.dialogTitle2 = row.title
                this.showDialog2 = true
                this.getReadData()
            },
            getReadData() {
                announceService.getReadInfo(this.readParams).then((ret) => {
                    this.readInfo = ret.list
                    this.total2 = ret.total
                })
            },
            fetchData () {
                this.loading = true
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    company_id: this.fetchParam.companySelect,
                    keyword: this.fetchParam.title,
                    status: this.fetchParam.status,
                    type: this.fetchParam.type,
                    finished: this.fetchParam.finished
                }
                return announceService.getAnnounceList(params).then((ret) => {
                    this.announceData = ret.list
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
    function clearSearch () {
        return {
            companySelect: '',
            title: '',
            type: '',
            status: '',
            finished: ''
        }
    }
    function clearReadInfo () {
        return {
            page:1,
            page_size:15,
            user_name: '',
            status: void 0,
            announce_id: ''
        }
    }
</script>
