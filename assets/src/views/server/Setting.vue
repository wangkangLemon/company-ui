<!--企业应用设置-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/common";

    #server-setting {
        h2 {
            font-size: 16px;
            line-height: 30px;
            padding: 10px 15px;
            background: #f0f3f5;
            color: #707478;
            border-radius: 5px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 1px solid #e2e7eb;
        }
        #server-setting-container {
            @extend %content-container;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            h3 {
                font-size: 16px;
                color: #707478;
                margin-bottom: 10px;
            }
            .employee {
                min-width: 600px;
            }
            .app-container {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 20px;
                img {
                    display: inline-block;
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                }
                .app-item {
                    position: relative;
                    width: 90px;
                    height: 120px;
                    text-align: center;
                    margin: 10px 20px;
                    cursor: pointer;
                    &:hover .app-disable-bg {
                        display: block;
                    }
                    .three {
                        padding: 15px 0;
                    }
                    .stop {
                        line-height: 90px;
                    }
                    .app-disable-bg {
                        height: 90px;
                        width: 90px;
                        position: absolute;
                        background: #000;
                        opacity: 0.6;
                        border-radius: 50px;
                        display: none;
                        text-align: center;
                        color: #fff;
                        z-index: 100;

                        p {
                            color: #fff;
                            font-size: 16px;
                            height: 26px;
                            border-top: 1px solid #fff;
                        }
                        .item-editor {
                            border-top: none;
                        }
                    }
                }
            }
        }
        .dialog {
            p {
                color: #aaa;
            }
            .icon {
                .el-form-item__label {
                    margin-top: 40px;
                }
            }
            .image {
                position: relative;
                width: 100px;
                height: 100px;
                display: inline-block;
                vertical-align: middle;
                border: 1px solid #ccd0d4;
                border-radius: 50px;
                margin-left: 10px;
                overflow: hidden;

                img {
                    display: block;
                    max-width: 100%;
                }
                .actions {
                    display: block;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 35px;
                    line-height: 35px;
                    background: rgba(0, 0, 0, .3);
                    text-align: center;
                    transition: bottom .1s linear;
                    color: #fff;
                    cursor: pointer;
                }
            }
            .text {
                margin-left: 10px;
                display: inline-block;
                vertical-align: middle;
                color: #aaa;
            }
        }
        .m-custom-dialog-contact {
            width: 50%;
        }
    }
</style>

<template>
    <main id="server-setting">
        <h2>说明：鼠标悬停在图标上可对应用进行操作，药视通App企业模块中会展示保存结果</h2>
        <article id="server-setting-container">
            <h3>已启用应用</h3>
            <section class="app-container">
                <!--企业应用 -->
                <div class="app-item" v-for="item in enableList" :key="item.id">
                    <div class="app-disable-bg" :class="item.id != '16' ? 'three' : ''">
                        <p class="item-editor" @click="updateFn(item)">编辑</p>
                        <p @click="disableFn(item)">停用</p>
                        <p v-if="item.model ==='link'" @click="deleteFn(item)">删除</p>
                        <p v-if="item.id===16" @click="() => employeeDialog=true">权限管理</p>
                    </div>
                    <img :src="item.icon | fillImgPath" alt="">
                    <i>{{item.name}}</i>
                </div>

                <div class="app-item add-item" @click="createFn">
                    <img src="./images/add.png" alt="">
                </div>
            </section>

            <h3>已停用应用</h3>
            <section class="app-container">
                <div class="app-item" v-for="item in disableList" :key="item.id">
                    <div class="app-disable-bg stop" @click="enableFn(item)">
                        <p>启用</p>
                    </div>
                    <img :src="item.icon | fillImgPath" alt="">
                    <i>{{item.name}}</i>
                </div>
            </section>
        </article>

        <!--添加编辑-->
        <el-dialog title="应用设置" :visible.sync="showDialog" class="dialog">
            <el-form :model="form"  :rules="rules" label-width="80px" ref="form">
                <el-form-item label="应用图标" class="icon" prop="icon">
                    <div>
                        <div class="image image-input">
                            <img v-if="form.icon" :src="form.icon | fillImgPath" alt="">
                            <span class="actions"><a class="action-upload" @click="() => {$refs.imgupload.chooseImg()}">更换图标</a></span>
                        </div>
                        <span class="text"> 建议上传图片尺寸为 140*140 </span>
                    </div>
                </el-form-item>
                <el-form-item label="应用名称" prop="name">
                    <el-col :span="16">
                        <el-input v-model="form.name" placeholder=""></el-input>
                        <p>控制在4个字以内，展示效果最佳。</p>
                    </el-col>
                </el-form-item>
                <el-form-item label="应用链接" v-if="!form.issys" prop="path">
                    <el-col :span="16">
                        <el-input v-model="form.path" placeholder=""></el-input>
                        <p>添加手机版页面浏览效果最佳，请以http://或者https://开头。</p>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>

        <!--联系人权限-->
        <el-dialog title="企业联系人管理" :visible.sync="employeeDialog" custom-class="m-custom-dialog-contact">
            <el-form :model="employee">
                <el-form-item label="手机号可见范围:">
                    <el-select v-model="employee.aca_type" placeholder="全员可见">
                        <el-option label="全员可见" value="all"></el-option>
                        <el-option label="仅同店内员工可见" value="department"></el-option>
                        <el-option label="自定门店人员隐藏" value="hidden"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="employee.aca_type=='hidden'" label="选择分店">
                    <DepartmentTransfer :isdata="employeeDialog" v-model="selectDep"></DepartmentTransfer>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="employeeDialog = false">取 消</el-button>
                <el-button type="primary" @click="employeeSubmit('form')">确 定</el-button>
            </div>
        </el-dialog>

        <!--图片裁剪-->
        <ImagEcropperInput :isRound="true" :aspectRatio="144/144" :isShowBtn="false" ref="imgupload"
                           :confirmFn="appImgupLoadFn"></ImagEcropperInput>

    </main>
</template>

<script>
    import settingService from 'services/server/appsettingService'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import DepartmentTransfer from './component/DepartmentTransfer'
    import clone from 'clone'

    function clearFn () {
        return {
            id: '', // 应用id
            issys: 0, // 是否是系统应用
            icon: '', // 应用封图
            name: '', // 应用名称
            path: '' // 应用链接
        }
    }

    export default {
        data () {
            return {
                settingApp: false, // 是否是小应用
                showDialog: false,
                employeeDialog: false, // 联系人弹窗
                enableList: [], // 企业应用
                disableList: [], // 禁用
                selectDep: [],
                employee: {
                    id: 16,
                    aca_type: '',
                    department_id: ''
                },
                form: clearFn(),
                rules: {
                    icon: { required: true, message: '请上传图片' },
                    name: { required: true, message: '请输入应用名称', trigger: 'change' },
                    path: { required: true, message: '请输入应用链接', trigger: 'change' },
                }
            }
        },
        activated () {
            this.fetchData()
        },
        methods: {
            fetchData () {
                this.getHomeList().then(ret => {
                    this.enableList = ret.enabled
                    this.disableList = ret.disabled
                    this.employee = ret.employee
                }).then(() => {
                    xmview.setContentLoading(false)
                })
            },
            // 首页 列表
            getHomeList () {
                return settingService.getHomeList()
            },
            createFn () {
                this.form = clearFn()
                this.showDialog = true
            },
            updateFn (item) {
                this.form = clone(item)
                this.showDialog = true
            },
            deleteFn (item) {
                xmview.showDialog(`删除后将无法恢复，建议使用“停用”功能，方便再次启用，您确定要删除么 ?`, () => {
                    settingService.appDelete(item.id).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.fetchData()
                    })
                })
            },
            disableFn (item) {
                xmview.showDialog(`停用此应用后，App企业模块中将不再展示 <i style="color: red">${item.name}</i> 功能，是否确定停用 ?`, () => {
                    if (item.issys) {
                        item.disabled = 1
                        return this.sysAppUpdate(item)
                    }
                    settingService.appDisable(item.id).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                        this.showDialog = false
                    })
                })
            },
            enableFn (item) {
                xmview.showDialog(`你是否启用 <i style="color: red">${item.name}</i> 功能 ?`, () => {
                    if (item.issys) {
                        item.disabled = 0
                        return this.sysAppUpdate(item)
                    }
                    settingService.appEnable(item.id).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                        this.showDialog = false
                    })
                })
            },
            sysAppUpdate (item) {
                settingService.sysAppUpdate(item).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                    this.showDialog = false
                })
            },
            appImgupLoadFn (data, ext) {
                settingService.upLoadingImg({
                    image: data,
                    alias: Date.now() + ext
                }).then(ret => {
                    xmview.showTip('success', '上传成功')
                    this.form.icon = ret.data.url
                })
            },
            submit (form) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        if (this.form.issys) {
                            return this.sysAppUpdate(this.form)
                        }
                        let req
                        if (this.form.id) {
                            req = settingService.appUpdate
                        } else {
                            req = settingService.appCreate
                        }
                        req(this.form).then(() => {
                            xmview.showTip('success', '保存成功')
                            this.showDialog = false
                            this.fetchData()
                        })
                        .catch(ret => {
                            xmview.showTip('error', ret.message)
                        })
                    }    
                })
            },
            // 设置权限管理人
            employeeSubmit () {
                if (this.selectDep) {
                    let arr = []
                    this.selectDep.map(item => {
                        arr.push(item.id)
                    })
                    this.employee.department_id = arr.join()
                } else {
                    this.employee.department_id = this.selectDep
                }
                this.employee.id = 16
                settingService.sysAppSetAcaEmployee(this.employee).then(() => {
                    xmview.showTip('success', '保存成功')
                    this.employeeDialog = false
                })
            }
        },

        components: {
            ImagEcropperInput,
            DepartmentTransfer
        }
    }
</script>
