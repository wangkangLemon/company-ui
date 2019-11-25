<!-- 图片预览 -->
<!-- 使用姿势 -->
<!-- <ImagePreview v-model="isShow" :url="imgage"></ImagePreview> -->
<template>
    <el-dialog append-to-body :title="title" :visible.sync="isShow" width="40%">
        <img width="100%" :src="imgURL" alt="">
    </el-dialog>
</template>

<script>
import { fillImgPath } from 'utils/filterUtils'
export default {
    props: {
        value: Boolean,
        url: String,
        needFillPath: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        value (val) {
            this.isShow = val
        },
        isShow (val) {
            this.$emit('input', val)
        },
        url (val) {
            this.imgURL = this.needFillPath ? fillImgPath(val) : val
        }
    },
    data () {
        return {
            title: '图片预览',
            isShow: this.value || false,
            imgURL: fillImgPath(this.url),
        }
    },
}
</script>
