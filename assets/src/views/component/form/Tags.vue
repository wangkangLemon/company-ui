<!--标签集合-->
<style lang='scss' rel='stylesheet/scss'>
    #component-form-tags {
        display: inline-block;

        .el-tag {
            margin-right: 5px;
        }

        .input-new-tag {
            display: inline-block;
            width: 80px !important;
        }
    }
</style>

<template>
    <article id="component-form-tags">
        <el-tag
                :key="tag"
                v-for="tag in currVal"
                :closable="closable"
                :close-transition="false"
                @close="handleClose(tag)">
            <i>{{tag}}</i>
        </el-tag>
        <el-input
                placeholder="输入标签"
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
        </el-input>
        <el-button v-else size="small" @click="showInput">添加标签</el-button>
    </article>
</template>

<script>
    export default{
        props: {
            value: Array,
            closable: {type: Boolean, default: true}
        },
        data () {
            return {
                currVal: this.value || [],
                inputVisible: false,
                inputValue: void 0,
            }
        },
        created () {
        },
        activated () {
        },
        watch: {
            'value' (val) {
                if (val != this.currVal || (val && val.length != this.currVal.length)) {
                    this.currVal = val
                }
            },
            'currVal' (val) {
                if (val.length != this.currVal || val != this.currVal) {
                    this.$emit('input', val)
                }
            }
        },
        methods: {
            handleClose (tag) {
                this.currVal.splice(this.currVal.indexOf(tag), 1)
            },

            showInput () {
                this.inputVisible = true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },

            handleInputConfirm () {
                let inputValue = this.inputValue
                if (inputValue) {
                    this.currVal.push(inputValue)
                }
                this.inputVisible = false
                this.inputValue = ''
            }
        },
        components: {}
    }
</script>
