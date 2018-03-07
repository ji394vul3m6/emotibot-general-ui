<template>
<div id="page-menu">
  <div class="category" v-for="directory in menuPages" :key="directory.name">
    <div class="category-name row">
      <div class="icon">
        <div :class="directory.icon"></div>
      </div>
      <div class="name">{{$t(directory.display)}}</div>
    </div>
    <div class="page row" v-for="page in directory.pages" :key="page.name" @click="toPage(page)">
      <div class="icon">
        <div :class="page.icon"></div>
      </div>
      <div class="name">{{$t(page.display)}}</div>
    </div>
  </div>
</div>  
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'menuPages',
    ]),
  },
  methods: {
    toPage(page) {
      this.$router.push({ path: page.path });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

#page-menu {
  position: absolute;
  left: 0;
  top: $page-header-height;
  width: $page-menu-width;
  height: 100vh;
  background: $page-menu-color;
  color: white;

  .category {
    box-sizing: border-box;
    width: 100%;
    padding: 0 5px;
    line-height: $page-menu-item-height;
    padding-top: $page-menu-category-padding;
    .name {
      text-align: center;
      margin-left: 5px;
    }

    .category-name {
      height: $page-menu-category-height;
      line-height: $page-menu-category-height;
    }
    .page {
      padding-left: 20px;
    }
    .row {
      display: flex;
      align-items: center;

      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
