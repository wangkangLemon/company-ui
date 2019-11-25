<!--企业资讯-->
<style lang='scss' rel="stylesheet/scss">
@import "../../utils/mixins/showDetail";
@import "../../utils/mixins/topSearch";
@import "../../utils/mixins/common";
#article-content-container {
    @extend %content-container;
    .add {
        @extend %right-top-btnContainer;
    }
    .search {
        @extend %top-search-container;
    }
    .block {
        text-align: right;
        margin-top: 10px;
    }
    a {
        color: #20a0ff;
        font-size: 12px;
        margin-right: 10px;
        text-decoration: none;
    }
    .dialogContent {
        // height: 500px;
        border-top: 1px solid #ccc;
        overflow-y:scroll;

    }
}
</style>

<template>
    <main id="article-content-container">
        <section class="add">
            <el-button type="primary" icon="el-icon-plus" @click="addArticle" v-operation="auth.com_article_create">添加</el-button>
        </section>
        <section class="search">
            <section>
                <i>标题</i>
                <el-input @keyup.enter.native="fetchData" class="name" v-model="fetchParam.title"/>
            </section>
            <section>
                <i>状态</i>
                    <el-select clearable v-model="fetchParam.status" @change="fetchData">
                    <el-option label="已发送" value="0"></el-option>
                    <el-option label="草稿" value="1"></el-option>
                </el-select>
            </section>
            <DateRange 
                title="创建时间" 
                :start="fetchParam.start_time" 
                :end="fetchParam.end_time"
                v-on:changeStart="val=> {fetchParam.start_time=val}"
                v-on:changeEnd="val=> {fetchParam.end_time=val}"
                :change="fetchData">
            </DateRange>
        </section>
    
        <el-table border :data="articleData" v-loading="loading">
            <el-table-column
                    prop ='title'
                    label="标题"
                    min-width="300">
            <template slot-scope="scope">
                    <el-button type="text"  @click="showArticle(scope.row)">
                        {{scope.row.title}}
                </el-button>
            </template>
            </el-table-column>

            <el-table-column
                    prop="status_name"
                    label="状态"
                    width="200">
                <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.status">{{scope.row.status_name}}</el-tag>
                    <el-tag type="success" v-if="!scope.row.status">{{scope.row.status_name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="创建时间"
                    width="200">
            </el-table-column>
            <!-- <el-table-column
                    prop="hits"
                    label="阅读量"
                    width="200">
            </el-table-column> -->
            <el-table-column prop="operate" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editArticle(scope.row)">
                        修改
                    </el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    
        <section class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="sizes, total, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </section>

        <el-dialog :title="dialogTitle" :visible.sync="showDialog">
            <div class="dialogContent" v-html="dialogContent">
            </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="showDialog = false">确 定</el-button>
            </div>
        </el-dialog>
    </main>
</template>

<script>
    import DateRange from 'components/form/DateRangePicker.vue'
    import ArticleService from 'services/server/articleService'
    export default {
        components: {
            DateRange
        },
        data () {
            return {
                loading: false,
                showDialog: false,
                dialogTitle: '',
                dialogContent: '',
                fetchParam: {
                    title: '',
                    status: '',
                    start_time: '',
                    end_time: '',
                },
                name: '', // 搜索的姓名
                articleData: [],
                total: 0,
                currentPage: 1, // 分页当前显示的页数
                pageSize: 15
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
            },
            showArticle (row) {
                this.dialogTitle = row.title
                ArticleService.getEditDetail(row.id).then((ret) => {
                    this.dialogContent = ret.data.content
                })
                this.showDialog = true
            },
            addArticle () {
                this.$router.push({name: 'server-article-add'})
            },
            editArticle (row) {
                this.$router.push({name: 'server-article-add', query: {id: row.id}})
            },
            handleDelete (index, row) {
                xmview.showDialog(`你将要删除文章【<i style="color:red">${row.title || ''}</i>】操作不可恢复确认吗？`, this.deleteItem(row.id))
            },
            deleteItem (id) {
                // 以下执行接口删除动作
                return () => {
                    ArticleService.deleteArticle(id).then((ret) => {
                        xmview.showTip('success', '删除成功')
                        this.fetchData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                }
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.fetchData()
            },
            fetchData () {
                this.loading = true
                return ArticleService.getArticleList({
                    category_id: this.fetchParam.category_id,
                    title: this.fetchParam.title,
                    start_time: this.fetchParam.start_time,
                    end_time: this.fetchParam.end_time,
                    page: this.currentPage,
                    page_size: this.pageSize,
                    status: !this.fetchParam.status && this.fetchParam.status !== 0 ? -1 : this.fetchParam.status
                }).then((ret) => {
                    this.articleData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
