<style lang='scss' rel="stylesheet/scss">
@import "../../utils/mixins/common";
#Message-container {
    @extend %content-container;
 ul{
    height: 300px;
    overflow: hidden;
    >li {
        width: 100%;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
        list-style: none;
        cursor: pointer;
        p:first-child {
             display: inline-block;
        }
        p:nth-child(2) {
            float: right;
        }
        
    }
  }
}

</style>

<template>
<article id="Message-container">
<ul>
    <li v-for="item in data" :key="item.id">
        <span href="javascript:void 0" @click="showArticle(item.title, item.id)">
            <p style="color: #6d6d6d">{{item.title}}</p>
            <p>{{item.create_time_name | timeUtlis}}</p>
        </span>
    </li>
</ul>
<!-- 通知资讯 -->
<el-dialog :title="dialogTitle" :visible.sync="showDialog">
    <div class="dialogContent" v-html="dialogContent"></div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showDialog = false">确 定</el-button>
        </div>
</el-dialog>
</article>
</template>

<script>

import ArticleService from 'services/server/articleService'

export default {
    data () {
        return {
            data: [],
            showDialog: false,
            dialogTitle: '',
            dialogContent: ''
        }
    },
    filters: {
        timeUtlis (value) {
            return value.slice(0, 10)
        }
    },
    methods: {
        showArticle (title, id) {
            this.dialogTitle = title
            ArticleService.getEditDetail(id).then((ret) => {
                this.dialogContent = ret.data.content
            })
            this.showDialog = true
        },
    },
    created () {
        xmview.setContentLoading(false)
        this.data = this.$route.query
    }
}
</script>
