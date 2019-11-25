<style lang="scss">
@import "../../utils/mixins/common";
@import "../../utils/mixins/topSearch";
#client-mobile-container {
    @extend %content-container;

    .uploadimg {
                > div {
                    display: inline-block;
                }
                .img-desc {
                    margin-left: 20px;
                    a {
                        margin-right: 20px;
                    }


                 }

                .img-container {
                    width: 200px;
                    height: 264px;
                    border: solid 1px #ccd0d4;
                    background: #f8f8f8;
                    &:before {
                        content: "1280 x 1706";
                        font-size: 20px;
                        height: 264px;
                        line-height: 264px;
                        display: block;
                        text-align: center;
                        color: #666;
                    }
                    img {
                        height: 264px;
                        z-index: 19;
                        position: absolute;
                        width: 198px;
                        top: 0;
                        left: 1px;
                    }
                }
    }
    
    section {
        h2 {
            margin-bottom: 30px;
            width: 100%;
            height: 40px;
            line-height: 40px;
            background: #EEF1F6;
            text-indent: 20px;
            font-size: 16px;
            
        }
        color: #666;
        .imgwrap{
            >div{
                display: flex;
                margin-right: 20px;
                text-align: center;
            }
            .logo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            text-align: center;
            line-height: 100px;
            // border: 1px solid #ccc;
            font-size: 20px;
            margin-right: 20px;
            
        }
        }
       
        .el-input {
            width: 300px;
        }
        
    }
    .showTemplate {
       .content {
           display: flex;
          div {
              display: inline-block;
          }
       }

       img {
           display: block;
           height: 264px;
           width: 198px;
       }
    }
}
</style>
<template>
    <article id="client-mobile-container">
        <section>
             <h2>企业名称和企业LOGO设置</h2>
            <el-form :model="form"  ref="ruleForm" label-width="100px">
               
                <el-form-item label="企业名称">
                    <el-input v-model="form.name" placeholder='建议控制在4个字以内，不要超过5个'></el-input>
                    <span>设置后将替换掉手机客户端中的“企业”导航名称</span>
                </el-form-item>
                <el-form-item  label="企业LOGO" v-loading="uploadingImg" element-loading-text="图片上传中">
                    <section class="imgwrap">
                    <div>
                    <img :src="form.logo | fillImgPath" v-if="form.logo" class="logo">
                    <span v-else class="logo">100X100</span>
                    <div>
                         <span class="img-tip">
                        设置为客户端消息列表的“工作通知”头像以及联系人中的企业图标
                        </span>
                        <span>
                              <ImagEcropperInput :isRound="true" :aspectRatio="100/100" :confirmFn="logocropperFn" ></ImagEcropperInput>  
                        </span>
                    </div>
                    
                    </div>
                    </section>
                </el-form-item>
                <el-form-item>
              <el-button class="submit" type="primary" @click="submit(0)">保存</el-button>
                </el-form-item>
            </el-form>
        </section>
        <section>

        <h2>客户端开机启动图</h2>
        <el-form :model='loadingform'  ref="ruleForm" label-width="100px">
        <el-form-item label="图片">
            <section class="uploadimg">
                    <div class="img-container">
                        <img :src="loadingform.logo_app_boot | fillImgPath" v-show="loadingform.logo_app_boot">
                    </div>
                    <div class="img-desc">
                        <span>
                            建议上传图片尺寸为 1280x1706；<br>下次开启药视通手机客户端时，启动页就会显示该启动图
                        </span>
                        <div>
                            <a href="javascript:;" @click="isShowImgSample = true">查看示例</a>
                            <!-- <a href="javascript:;" @click="isShowTemplate = true">选择使用模版</a> -->
                        </div>
                        <ImagEcropperInput :aspectRatio="1280/1706" :confirmFn="cropperFn" ref="imgcropper"></ImagEcropperInput>
                    </div>
            </section>
        </el-form-item>
        <el-form-item>
              <el-button class="submit" type="primary" @click="submit('1')">保存</el-button>
        </el-form-item>
        </el-form>

        </section>

         <el-dialog title="查看示例" :visible.sync="isShowImgSample" top="15px" >
            <img src="./images/mobile-boot-sample.png" style="width: 100%">
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowImgSample = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择模版" :visible.sync="isShowTemplate"  class="showTemplate">
           <section class="content">
               <div>
                   <img src="./images/mobile-boot-sample.png" alt="">
                   <el-radio class="radio" v-model="radio" label="1">使用模版</el-radio>
               </div>
               <div>
                   <img src="./images/mobile-boot-sample.png" alt="">
                   <el-radio class="radio" v-model="radio" label="2">使用模版</el-radio>
               </div>
               <div>
                   <img src="./images/mobile-boot-sample.png" alt="">
                   <el-radio class="radio" v-model="radio" label="3">使用模版</el-radio>
               </div>
           </section>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowTemplate = false">取消</el-button>
                <el-button type="primary" @click="isShowTemplate = false">确 定</el-button>
            </span>
        </el-dialog>

    </article>
</template>

<script>
import ImagEcropperInput from '../component/upload/ImagEcropperInput.vue'
import mobileServive from 'services/client/mobileService'
export default {
    data () {
        return {
            data: [],
            form: {   // logo
                name: '',
                logo: ''
            },
            loadingform: {  // 启动图
                logo_app_boot: '',
            },
            imgData: '',
            loadingData: '',
            rules: [],
            radio: '',
            isShowImgSample: false,
            isShowTemplate: false,
            uploadingImg: false
        }
    },
    created () {
        this.fetchData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        fetchData () {
            return mobileServive.getAll().then((ret) => {
                this.form.name = ret.name
                this.form.logo = ret.logo
                this.loadingform.logo_app_boot = ret.boot
            })
        },
        submit (type) {
            if (type) {
                return mobileServive.upDateBoot(this.loadingform).then(() => {
                    xmview.showTip('success', '操作成功')
                })
            } else {
                return mobileServive.upDateLogo(this.form).then(() => {
                    xmview.showTip('success', '操作成功')
                })
            }
        },
        cropperFn (data, ext) {
            mobileServive.upLoadBoot({
                image: data,
                alias: Date.now() + ext
            }).then((ret) => {
                xmview.showTip('success', '提交成功')
                this.loadingform.logo_app_boot = ret.url
            })
        },
        logocropperFn (data, ext) {
            mobileServive.upLoadLogo({
                image: data,
                alias: Date.now() + ext
            }).then((ret) => {
                xmview.showTip('success', '提交成功')
                this.form.logo = ret.url
            })
        },
    },
    components: {
        ImagEcropperInput
    }
}
</script>
