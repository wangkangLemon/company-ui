<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/common";

    #test-content-container {
        @extend %content-container;
        border: none;
        .manage-container {
            @extend %right-top-btnContainer;
            > * {
                color: #fff;
                border-radius: 5px;
            }

            // 添加课程
            .add {
                background: rgb(0, 204, 255);
            }

            // 管理栏目
            .catmange {
                background: rgb(153, 102, 204);
            }
        }
    }
</style>
<template>
    <section id="test-content-container">
        <keep-alive exclude="exam-paper-edit,exam-paper-add,exam-practice-create">
            <router-view></router-view>
        </keep-alive>
    </section>
</template>

<script>
    export default {}
</script>
