<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-template-container {
        @extend %content-container;
        .custom-form {
            max-width: 60%
        }
        .custom-input {
            max-width: 400px;
        }
        .custom-img {
            width: 50%;
            margin-top: 10px;
        }
        .el-collapse {
            div.phaes-task.el-collapse-item {
                margin-bottom: 5px;
            }
            .el-collapse-item__header {
                padding-left: 10px;
                background: aliceblue;
            }
        }
        .phase-operation {
            cursor: pointer;
            position: fixed;
            top: 260px;
            right: 26%;
            i {
                color: orange;
                font-size: 70px;
            }
        }
    }
</style>

<template>
    <main id="learning-map-template-container">
        <div class="phase-operation">
            <i 
                class="el-icon-circle-plus"
                @click="addPhase"
                title="添加阶段">
            </i>
            <p>总阶段数:{{ ruleForm.phase_list && ruleForm.phase_list.length}}</p>
        </div>
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="custom-form">
<!--             <el-form-item label="创建方式">
                <el-radio-group v-model="createMethod" @change="chooseTemplate">
                    <el-radio-button label="自定义"></el-radio-button>
                    <el-radio-button label="模版"></el-radio-button>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="模板名称" prop="title">
                <el-input
                    class="custom-input"
                    v-model="ruleForm.title">
                </el-input>
            </el-form-item>
            <el-form-item label="封面" prop="image">
                <ImagEcropperInput :isRound="false" :confirmFn="cropperFn"></ImagEcropperInput>
                <img class="custom-img" v-if="ruleForm.image" :src="ruleForm.image | fillImgPath"  alt="封面图">
            </el-form-item>
            <el-form-item label="阶段任务" prop="phase_list">
                <el-collapse v-model="activeNames" @change="collapseChange">
                    <el-collapse-item 
                        class="phase-task"
                        v-for="(phase, index) in ruleForm.phase_list"
                        :key="phase.phase_id"
                        :name="phase.phase">
                        <template slot="title">
                            <span class="phase-sort">第{{phase.phase}}阶段</span>
                            <el-button 
                                v-if="index!==0"
                                type='text' 
                                @click.stop="deletePhase(phase, index)">
                                删除阶段
                            </el-button>
                            <!-- <input type="hidden" :value="phase.data.id"> -->
                       </template>
                        <Phase
                            ref="phase"
                            :phase="phase">
                        </Phase>
                    </el-collapse-item>
                </el-collapse>
            </el-form-item>
            <!-- 发布对象 -->
            <Pusher
                ref="pusher"
                :ruleForm="ruleForm"
                v-model="ruleForm.push_type_list">
            </Pusher>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" v-loading="submitLoading">{{ruleForm.data ? '更新' : '发布'}}</el-button>
            </el-form-item>
        </el-form>
    </main>
</template>

<script>
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import Phase from '../component/Phase.vue'
    import Pusher from 'components/select/pusher/Main.vue'
    import learningService from 'services/learning'
    import Maps from 'models/learningMaps'

    export default {
        components: {
            ImagEcropperInput,
            Phase,
            Pusher
        },
        name: 'learning-maps-create',
        props: {},
        activated () {
        },
        created () {
            this.initMapsData(this.$route.query.id)
                .then(() => xmview.setContentLoading(false))
                .catch(err => console.log(err))
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                createMethod: '自定义',
                template: {
                    showDialog: false,
                    
                },
                submitLoading: false,
                activeNames: [1],
                ruleForm: {},
                rules: {
                    title: {required: true, message: '请输入模版名称', trigger: 'blur'},
                    type: { required: true, message: '请选择发布对象' },
                }
            }
        },
        methods: {
            initMapsData (id) {
                if (id) {
                    xmview.setContentTitle('编辑模版')
                    return learningService.getStudyMap(id).then(ret => {
                        // 后端将发布对象列表没有和data一起返回
                        this.ruleForm = new Maps({
                            data: ret.data,
                            push_type_list: ret.push_type_list
                        })
                        this.ruleForm.learning_maps_id = this.$route.query.id
                    })
                } else {
                    return Promise.resolve(this.ruleForm = new Maps())
                }
            },
            cropperFn (data, ext) {
                learningService.uploadCover({
                    image: data,
                    alias: `${Date.now()}.${ext}`
                }).then((ret) => {
                    this.ruleForm.image = ret.url
                })
            },
            chooseTemplate (e) {
                if (e === '模版') {

                }
            },
            addPhase () {
                this.ruleForm.insert()
            },
            deletePhase (phase, index) {
                this.$confirm('确定要删除该阶段吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (phase.data) {
                        learningService.deletePhase({
                            learning_maps_id: this.$route.query.id,
                            phase_id: phase.id
                        })
                    }
                    this.ruleForm.deletePhase(index)
                })
            },
            submitForm (formName) {
                if (this.validateAllForm(formName)) {
                    this.submitLoading = true
                    let service = this.ruleForm.data ? learningService.updateStudyMap : learningService.createStudyMap
                    service(this.ruleForm.save('id')).then(() => {
                        this.submitLoading = false
                        this.$router.replace({name: 'learning-maps-info'})
                    }).catch(() => {
                        this.submitLoading = false
                    })
                }
            },
            validateAllForm (formName) {
                return ![...this.$refs.phase.map(item => item), this, this.$refs.pusher]
                        .some((item, index) => !item.validate(formName, index + 1))
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) pass = false
                })
                return pass
            },
            collapseChange (e) {
                if (e.length > 0) return
            }
        },
        filters: {},
        directives: {},
    }
</script>
