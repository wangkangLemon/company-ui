<style lang="scss">
    #side-pannel-container {
        position: absolute;
        overflow-y: scroll;
        overflow-x: hidden;
        top: 56px;
        bottom: 0;
        border-left: 1px solid #d1dbe5;
        transition: all 250ms ease-in-out;
        background: #ffffff;
        z-index: 1000;
        .close-btn {
            position: absolute;
            left: 0;
            font-size: 20px;
            margin-bottom: 20px;
        }
    }
    @media only screen and (max-width: 680px) {
        #side-pannel-container {
            width: 90%;
            width: calc(100% - 50px);
        }
    }
    @media only screen and (max-width: 480px) {
        #container-main {
            width: 100%;
        }
    }
</style>

<template>
    <aside id="side-pannel-container" @click.stop :style="[{width: width + 'px', right: -width + 'px'}, isActive ? {transform: 'translate3d(-'+ width +'px,0,0)'} : {}]">
        <!-- <i class="el- icon-close close-btn" @click="close()"></i> -->
        <slot></slot>
    </aside>
</template>

<script>
    export default {
        props: {
            appendToBody: {
                type: Boolean,
                default: true
            },
            width: {
                type: Number,
                default: 700
            }
        },
        data () {
            document.addEventListener('click', () => {
                if (this.isActive) {
                    this.$confirm('是否取消编辑？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                this.$message({
                                    type: 'success',
                                    message: '您已撤销编辑'
                                })
                                this.$emit('close')
                                this.close()
                            }
                            done()
                        }
                    })
                }
            }, false)
            return {
                isActive: false,
            }
        },
        destroyed () {
            this.$nextTick(() => {
                this.destroyElement()
            })
        },
        deactivated () {
            this.$nextTick(() => {
                this.destroyElement()
            })
        },
        methods: {
            open () {
                this.isActive = true
                this.$store.dispatch('setSidebarActive', this.isActive)
            },
            close () {
                if (this.isActive) {
                    this.isActive = false
                    this.$store.dispatch('setSidebarActive', this.isActive)
                }
            },
            destroyElement () {
                if (this.appendToBody) {
                    document.body.removeChild(this.$el)
                }
            }
        },
        mounted () {
            if (this.appendToBody) {
                document.body.appendChild(this.$el)
            }
        },
    }
</script>
