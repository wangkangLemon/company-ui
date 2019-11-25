<style lang='scss' rel='stylesheet/scss'>
@import "~utils/mixins/mixins";
.left-menu-container {
  .menu-icon {
    width: 15px;
    height: 15px;
    position: relative;
    top: 2px;
    margin-right: 2px;
  }
}
</style>

<template>
  <el-menu-item
    :index="data.item.menu_url"
    v-if="data && data.children == null"
    @click="menuItemClick"
  >
    <i class="fa" :class="data.item.menu_icon" v-if="data.item.menu_icon"></i>
    <i class="fa fa-circle-o" v-else-if="data.item.parent_id"></i>
    <i class="fa fa-th-large" v-else></i>
    {{data.item.menu_name}}
  </el-menu-item>
  <el-submenu :index="data.item.menu_url" v-else-if="data && data.children != null">
    <template slot="title">
      <i class="fa" :class="data.item.menu_icon" v-if="data.item.menu_icon"></i>
      <i class="fa fa-th-large" v-else></i>
      {{data.item.menu_name}}
    </template>
    <MenuTree v-for="item in data.children" :key="item.item.id" :data="item"></MenuTree>
  </el-submenu>
</template>

<script>
import MenuTree from "./MenuTree.vue";
export default {
  name: "MenuTree",
  data() {
    return {};
  },
  props: ["data"],
  created() {
    
  },
  methods: {
    menuItemClick(menuItem) {
      if (this.$store.state.sidebar.isActive) {
        menuItem.index = this.$store.state.index.navMenueActive;
        menuItem.rootMenu.activeIndex = menuItem.index;
      }
    }
  },
  components: { MenuTree }
};
</script>
