<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
     #speaking-content-add {
        @extend %content-container;
    .form {
        width: 50%;
        .btn {
            float: right;
        }
        .img {
            display: block;
            width: 250px;
            height: 160px;
        }
        .collection {
            align-items: center;
            min-height: 36px;
            border-radius: 4px;
            padding: 3px 10px;
            border: 1px solid #bfcbd9;
            .tag {
               margin-right: 10px;
            }
        }
    }
    .dialog {
            section {
                margin-bottom: 10px;
                i {
                    margin-right: 10px;
                }
            }
        }
     }
</style>
<template>
    <article id="speaking-content-add">
        <el-form :model="form" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="标题" prop="title">
                <el-input placeholder="请输入内容" v-model="form.title">
                </el-input>
            </el-form-item>
            <el-form-item label="练习内容" prop="content">
                <el-input :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" type="textarea" v-model="form.content">
                </el-input>
            </el-form-item>
            <el-form-item label="客户端展示图">
                <img :src="form.image | fillImgPath" alt="" class="img" v-if="form.image" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false">
                </ImagEcropperInput>
            </el-form-item>
            <el-form-item label="练习次数">
                <el-input-number placeholder="只有当店员练习满分次数满足后，才可完成任务。" v-model="form.limit" :min="1">
                </el-input-number>
            </el-form-item>
            <el-form-item label="企业学分">
                <el-input-number placeholder="完成练习后获得相应企业学分奖励。" v-model="form.study_score" :min="0">
                </el-input-number>
            </el-form-item>
            <el-form-item label="过关分数(1~100)">
                <el-input-number placeholder="设置过关分数 1~100" v-model="form.score_pass" :min="1" :max="100">
                </el-input-number>
            </el-form-item>
            <el-form-item label="练习截止时间">
                <el-date-picker 
                    placeholder="请选择时间" 
                    type="datetime" 
                    v-model="form.end_time"
                    :picker-options="pickerOptions0">
                </el-date-picker>
            </el-form-item>
            <Pusher 
                ref="pusher"
                :ruleForm="form" 
                labelWidth="180px"
                v-model="push_type_list">
            </Pusher>
            <el-form-item>
                <el-button @click="submit('ruleForm')" type="primary">保存</el-button>
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import speakingService from 'services/server/speakingService'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import Pusher from 'components/select/pusher/Main.vue'
    import {time2String} from '../../../utils/timeUtils'
    function clearFn () {
        return {
            id: '',
            title: '',
            content: '',
            image: '',
            limit: 1,        // 练习次数
            study_score: 0,  // 学分设置
            end_time: '',   // 截止时间
            type: '',  // send_range company为企业，department为门店，user为店员
            push_type_id: '',    // 发布对象id
            score_pass: 1,
        }
    }
    export default {
        name: 'speaking-content-add',
        data () {
            return {
                pickerOptions0: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                usersTotal: 10,
                departments: [],
                push_type_list: [],
                depkeyword: '', // 企业搜索
                keyword: '', // 员工搜索
                form: clearFn(),
                rules: {
                    title: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    limit: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                },
            }
        },
        created () {
            let id = this.$route.query.id
            xmview.setContentLoading(false)
            if (isNaN(id)) {
                this.form = clearFn()
                return
            }
            speakingService.getSpeaking(id).then((ret) => {
                this.form = ret.data
                this.push_type_list = ret.push_type_list || []
            })
        },
        methods: {
            cropperFn (data, ext) {
                speakingService.uploadImg({
                    image: data,
                    alias: `${Date.now()}${ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.form.image = ret.url
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            submit (formName, type) {
                if (this.validateAllForm(formName)) {
                    if (this.form.type !== 'company') {
                        this.form.push_type_id = this.push_type_list.map(item => item['id']).join(',')
                    }
                    if (this.form.end_time) {
                        this.form.end_time = time2String(new Date(this.form.end_time), false, false)
                    }
                    let reqFn
                    this.form.id ? reqFn = speakingService.updateSpeaking
                    : reqFn = speakingService.addSpeaking
                    reqFn(this.form).then((ret) => {
                        xmview.showTip('success', '保存成功')
                        this.selectUser = [] // 清空
                        this.selectDep = []
                        this.$router.go(-1)
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                }
            },
            validateAllForm (formName) {
                return ![this, this.$refs.pusher]
                        .some((item) => !item.validate(formName))
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) pass = false
                })
                return pass
            },
        },
        components: {
            ImagEcropperInput,
            Pusher
        }
    }
</script>
