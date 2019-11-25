<!-- 
    <pusher 
     v-model="pushType"
     :selected="pushSelected">
    </pusher>
    使用时，只需要传入一个list，用户交互完之后就会得到对应的list，这是该组件做的事情
    而外部组件还需要做两件事：
        1. 适配器value(v-model)
        2. 校验组件
 -->

<style lang="scss">
#publisher-select-container {
    .collection {
        align-items: center;
        min-height: 36px;
        border-radius: 4px;
        padding: 3px 10px;
        border: 1px solid #bfcbd9;
    }
    .collection2 {
        @extend .collection;
        min-width: 200px;
        // overflow: scroll;
    }
    .u-course-tag {
        margin-right: 10px;
        &:last-child {
            margin-right: 0;
        }
    }
}

.publisher-dialog {
    .el-dialog__body {
        padding: 10px 20px;
        .tree{
            height: 380px !important;
        }
    }
}
</style>

<template>
    <main id="publisher-select-container">
        <el-form :model="ruleForm" :label-width="labelWidth" :rules="rules" :ref="parentRef" v-show="!disabled">
            <el-form-item label="发布对象" :prop="type" v-if="!searchForm">
                <el-select 
                    v-model="ruleForm[type]" 
                    filterable
                    :disabled="disabled"
                    clearable 
                    placeholder="请选择"  
                    @change="choosePushType">
                    <el-option 
                        v-for="item in pusherList" 
                        :key="item.value"
                        :label="item.label" 
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <template v-if="searchForm">
                <div class="el-input__inner collection2" @click="openPushTypeDialog">
                    <template v-if="selected.length > 3">
  <!--                       <el-tag 
                            class="u-course-tag"
                            v-for="item in selected.slice(0,3)"
                            :key="item.id">
                            {{item.name}}
                        </el-tag> -->
                        <el-tag
                            class="u-course-tag"
                            :key="tag.id"
                            v-for="(tag, index) in selected.slice(0,3)"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(index, tag.id)">
                            {{tag.name}}
                        </el-tag>
                        <el-tag>...</el-tag>
                    </template>
                    <template v-else>
<!--                         <el-tag 
                            class="u-course-tag"
                            v-for="item in selected"
                            :key="item.id">
                            {{item.name}}
                        </el-tag> -->
                        <el-tag
                            class="u-course-tag"
                            :key="tag.id"
                            v-for="(tag, index) in selected"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(index, tag.id)">
                            {{tag.name}}
                        </el-tag>
                    </template>
                </div>
            </template>
            <template v-else>
                <el-form-item 
                    :label="pusher.label"
                    prop="push_type_list"
                    v-if="ruleForm[type] && ruleForm[type]===pusher.type">
                    <div class="collection" @click="openPushTypeDialog">
                        <el-tag 
                            class="u-course-tag"
                            v-for="item in selected"
                            :key="item.id">
                            {{item.name}}
                        </el-tag>
                    </div>
                </el-form-item>
            </template>
        </el-form>

        <el-dialog class="publisher-dialog"
            append-to-body
            :title="pusher.type !== 'organization' ? pusher.label : (searchForm ? pusher.label2 : pusher.label)" 
            :visible.sync="pusher.showDialog">
            <template v-if="pusher.type !== 'organization'">
                <component 
                    v-if="pusher.showDialog"
                    v-model="pusher.selected"
                    :is="pusher.component"
                    :isSearch="pusher.isSearch">
                </component>
            </template>
            <template v-else>
                <CompanyTreeTransfer
                    ref="companyTree"
                    :isSearch="true"
                    :isOrg="searchForm ? 0 : 1"
                    :expandOnClickNode="true"
                    :placeholder="searchForm ? pusher.label2 : pusher.label"
                    :defaultChecks="ruleForm.departments"
                    :defaultExpandedKeys="ruleForm.parent_departments">
                </CompanyTreeTransfer>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="insert">{{ confirmText }}</el-button>
            </span>
        </el-dialog>
    </main>
</template>

<script>
    import DepartmentTranfer from 'components/transfer/DepartmentTransfer.vue'
    import CompanyTreeTransfer from 'components/transfer/CompanyTreeTransfer.vue'
    import UserTransfer from 'components/transfer/UserTransfer.vue'
    import UserGroupTransfer from 'components/transfer/UserGroupTransfer.vue'
    import { UnionSet } from 'utils/common'
    import treeUtils from 'utils/treeUtils'
    import Pusher from './model'
    export default {
        components: {
            CompanyTreeTransfer,
            DepartmentTranfer,
            UserTransfer,
            UserGroupTransfer,
        },
        props: {
            // 如果搜索框形式则不需要展示发布对象下拉框
            searchForm: {
                type: Boolean,
                defalut: false,
            },
            disabled:{
                type:Boolean
            },
            labelWidth: {
                default: '140px',
            },
            ruleForm: Object,
            parentRef: {
                type: String,
                default: 'ruleForm'
            },
            value: {
                type: Array,
                default: () => {return []}
            },      // 选中的数据
            type: {
                type: String,
                default: 'type'
            },     // 发布对象类型
            confirmText: {
                type: String,
                default: '插 入',
            },
            keys: {
                type: Array,
                required: false
            },
            pusherDropdownRequired: {
                type: Boolean,
                default: true
            },
            pusherTransferRequired: {
                type: Boolean,
                default: true
            },
            teaching:{
                type:Boolean
            }
        },
        activated () {},
        created () {
            if(this.teaching){
                this.ruleForm[this.type]='company'
            }
            if (this.searchForm) {
                this.choosePushType()
            }
        },
        mounted () {
        },
        computed: {},
        watch: {
            value (val) {
                this.selected = val
                if (this.init) {
                    if (val && val.length > 0) {
                        let model = new Pusher()
                        model.initSelected(this.ruleForm[this.type], val)
                        this.pusherTransfer = model.getList(this.keys).pusherTransfer
                        this.choosePushType()
                        this.init = false
                    }
                }
            },
            selected (val) {
                this.$emit('input', val)
            },
        },
        data () {
            // 写入data方法中保证每次都初始化新的Pusher
            let model = new Pusher()
            return {
                selected: this.value,
                pusher: {
                    showDialog: false,
                    fetchParam: {
                        keyword: '',
                        department_id: '',
                        page: 1,
                        page_size: 15,
                    },
                    data: [],
                    total: 0,
                },
                // selectedAll: [],
                pusherList: model.getList(this.keys).pusherList,
                pusherTransfer: model.getList(this.keys).pusherTransfer,
                rules: {
                    [this.type]: { required: this.pusherDropdownRequired, message: '请选择发布对象', trigger: 'change' },
                },
                init: true,
            }
        },
        methods: {
            choosePushType (type) {
                let pushType = this.ruleForm[this.type]
                if (pushType === 'company') return
                let pusher = this.pusherTransfer[pushType] || {}
                for (let [item, value] of Object.entries(pusher)) {
                    this.$set(this.pusher, item, value)
                }
                if (type) {
                    this.selected.length = 0
                    this.$refs.companyTree && this.$refs.companyTree.clear([])
                    this.ruleForm.departments = []
                    this.ruleForm.parent_departments = []
                }
            },
            openPushTypeDialog () {
                this.pusher.showDialog = true
            },
            insert () {
                if (this.pusher.type === 'organization') {
                    this.$refs.companyTree.getCheckedNodes().then(selected => {
                        let ans = treeUtils.restoreTree(selected)
                        // let ans = selected
                        this.selected = ans
                        console.log('selected', ans)
                        this.$refs.companyTree.filterText = ''
                        this.$refs.companyTree.selected = ans // 展示所有选中的项目
                    })
                } else {
                    this.selected = this.pusher.selected
                }
                // this.selectedAll[this.pusher.type] = this.pusher.selected
                this.pusher.showDialog = false
                this.searchForm && this.$emit('change')
            },
            validate (ruleForm) {
                let pass = true
                this.$refs[ruleForm].validate(valid => {
                    if (!valid) pass = false
                })
                if (this.ruleForm[this.type] !== 'company' && this.selected.length === 0) {
                    xmview.showTip('warning', '请选择发布对象对应的类目')
                    pass = false
                }
                return pass
            },
            handleClose (index, id) {
                this.selected.splice(index, 1)
                this.$refs.companyTree.clear(this.selected.filter(item => item.id !== id).map(item => item.id))
            }
        },
        filters: {},
        directives: {},
    }
</script>
