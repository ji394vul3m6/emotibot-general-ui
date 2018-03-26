<template>
<div id="page-menu">
  <div class="category" v-for="directory in menuPages" :key="directory.name">
    <div class="category-name row">
      <icon :icon-type="directory.icon"/>
      <div class="name">{{$t(directory.display)}}</div>
    </div>
    <div class="page row" v-for="page in directory.pages" :key="page.name" @click="toPage(page)">
      <!-- <icon :icon-type="page.icon"/> -->
      <div class="name" :class="{active: page.path === currentRoute}">{{$t(page.display)}}</div>
    </div>
  </div>
</div>  
</template>

<script>
import { mapGetters } from 'vuex';
import Icon from '@/components/basic/Icon';

export default {
  computed: {
    ...mapGetters([
      'menuPages',
    ]),
    currentRoute() {
      return this.$route.path.split('/')[1];
    },
  },
  components: {
    icon: Icon,
  },
  methods: {
    toPage(page) {
      this.$router.push({ path: page.path });
    },
  },
  mounted() {
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
  height: calc(100vh - #{$page-header-height});
  background: $page-menu-color;
  color: white;
  @include auto-overflow();

  .category {
    box-sizing: border-box;
    width: 100%;
    padding: 0 10%;
    line-height: $page-menu-item-height;
    padding-top: $page-menu-category-padding;
    .name {
      text-align: center;
      margin-left: 5px;
      &.active {
        color: $active-color;
        font-weight: bold;
      }
    }
    .page {
      padding-left: 20px;
      cursor: pointer;
    }
    .row {
      display: flex;
      align-items: center;
      user-select: none;
    }
  }
}
</style>
