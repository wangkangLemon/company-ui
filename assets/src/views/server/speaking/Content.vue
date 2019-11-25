<!--内容管理-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
     @import "../../../utils/mixins/common";
    .speaking-content-container {
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
    }
</style>
<template>
    <article class="speaking-content-container">
        <section class="add">
            <el-button type="primary" icon="el-icon-plus" @click="addSpeaking">添加</el-button>
        </section>
        <section class="search">
            <section>
                <i>标题</i>
                <el-input @keyup.enter.native="fetchData" v-model="fetchParam.keyword" auto-complete="off"></el-input>
            </section>
            <section>
                <i>状态</i>
                <el-select clearable v-model="fetchParam.publish_status" @change="fetchData">
                    <el-option label="已发布" value="0"></el-option>
                    <el-option label="草稿" value="1"></el-option>
                    <el-option label="已撤回" value="2"></el-option>
                </el-select>
            </section>
              <section>
                <i>发布对象</i>
                <el-select clearable v-model="fetchParam.send_range" @change="fetchData">
                    <el-option label="全体员工" value="company"></el-option>
                    <el-option label="指定部门" value="organization"></el-option>
                    <el-option label="指定门店" value="department"></el-option>
                    <el-option label="指定用户组" value="user_group"></el-option>
                    <el-option label="指定员工" value="user"></el-option>
                </el-select>
            </section>
        </section>
        <el-table
            v-loading="loading"
            border
            :data="dataList"
            stripe>
            <el-table-column
                    prop="title"
                    min-width="100"
                    label="标题">
            </el-table-column>
            <el-table-column
                    prop="content"
                    min-width='200'
                    label="内容">
            </el-table-column>
             <el-table-column
                    prop="send_range"
                    width="110"
                    label="发布对象">
                <template slot-scope="scope">
                    <el-tag type="primary" v-if="scope.row.send_range == 'company'">全体员工</el-tag>
                    <el-tag type="primary" v-if="scope.row.send_range == 'department'">指定门店</el-tag>
                    <el-tag type="primary" v-if="scope.row.send_range == 'user'">指定员工</el-tag>
                    <el-tag type="primary" v-if="scope.row.send_range == 'organization'">指定部门</el-tag>
                    <el-tag type="primary" v-if="scope.row.send_range == 'user_group'">指定用户组</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="study_score"
                    width="100"
                    label="奖励学分">
            </el-table-column>
            <el-table-column
                    prop="score_pass"
                    width="100"
                    label="过关分数">
            </el-table-column>
            <el-table-column
                    prop="create_time"
                    width="120"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    prop="publish_status"
                    width="80"
                    label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.publish_status == 0" type="success">{{statusArr[scope.row.publish_status]}}</el-tag>
                    <el-tag v-else-if="scope.row.publish_status === 1" type="warning">{{statusArr[scope.row.publish_status]}}</el-tag>
                    <el-tag v-else type="info">{{statusArr[scope.row.publish_status]}}</el-tag>
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
                        @click="editSpeaking(scope.row)" 
                        :disabled="scope.row.publish_status === 0 || creatorDisabled(scope.row.creator_id)">
                        修改
                    </el-button>
                     <el-button 
                        type="text" 
                        size="small"
                        @click="disabledSpeaking(scope.row)"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        {{scope.row.publish_status == 0 ? '撤回' : '发布'}}
                    </el-button>
                    <el-button 
                        type="text" 
                        size="small" 
                        @click="delSpeaking(scope.$index, scope.row)"
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
                :current-page="fetchParam.page"
                :page-sizes="[15, 30, 60, 100]"
                :page-size="fetchParam.page_size"
                layout="total, sizes, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
        <ErrorDialog :error="error"></ErrorDialog>
    </article>
</template>
<script>
    import speakingService from 'services/server/speakingService'
    import ErrorDialog from 'components/dialog/ErrorDialog.vue'

    export default {
        components: {
            ErrorDialog
        },
        data () {
            return {
                dataList: [],
                statusArr: ['已发布', '草稿', '已撤回'],
                showDetail: false,
                loading: false,
                total: 0,
                fetchParam: clearSearch(),
                error: {
                    showDialog: false,
                    message: '',
                    data: []
                }
            }
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam () {
                this.fetchParam = clearSearch()
            },
            fetchData () {
                this.loading = true
                let fetchParam = this.fetchParam
                return speakingService.getSpeakingList({
                    keyword: fetchParam.keyword,
                    send_range: fetchParam.send_range,
                    publish_status: fetchParam.publish_status === '' ? -1 : fetchParam.publish_status,
                    page: fetchParam.page,
                    page_size: fetchParam.page_size
                }).then((ret) => {
                    this.dataList = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            addSpeaking () {
                this.$router.push({name: 'speaking-content-add'})
            },
            delSpeaking (index, row) {
                xmview.showDialog(`你将要删除【<i style="color:red">${row.title || ''}</i>】确认吗？`, () => {
                    speakingService.delSpeaking(row.id).then(() => {
                        this.fetchData()
                        xmview.showTip('success', '操作成功')
                    }).catch(ret => {
                        this.error.message = ret.data.message
                        this.error.data = ret.data.list
                        this.error.showDialog = true
                    })
                })
            },
            disabledSpeaking (row) {
                xmview.showDialog(`你将要${row.publish_status === 2 ? '发布' : '撤回'}【<i style="color:red">${row.title || ''}</i>】操作吗？`, () => {
                    let publish_status = row.publish_status === 2 ? 0 : 2
                    speakingService.disableSpeaking(row.id, publish_status).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                    })
                })
            },
            editSpeaking (row) {
                this.$router.push({name: 'speaking-content-add', query: {id: row.id}})
            }
        }
    }
    function clearSearch () {
        return {
            keyword: '',
            send_range: '',
            publish_status: '',
            page: 1,
            page_size: 15
        }
    }
</script>
