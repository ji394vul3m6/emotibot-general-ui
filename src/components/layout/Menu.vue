<template>
<div id="page-menu">
  <div class="category" v-for="directory in menuPages" :key="directory.name">
    <div class="category-name row" @click="toPage(directory)"
      :class="{clicable: directory.path, active: directory.path === currentRoute}">
      <icon :icon-type="directory.icon"/>
      <div class="name">{{$t(directory.display)}}</div>
    </div>
    <template v-if="directory.pages && directory.pages.length > 0">
      <div class="page row clicable"
        v-for="page in directory.pages"
        :key="page.name"
        :class="{active: page.path === currentRoute}"
        @click="toPage(page)">
        <!-- <icon :icon-type="page.icon"/> -->
        <div class="name">{{$t(page.display)}}</div>
      </div>
    </template>
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

    .category-name {
      &.active {
        color: $active-color;
        font-weight: bold;
      }
    }
    .name {
      text-align: center;
      margin-left: 5px; 
    }
    .page {
      margin-left: 20px;
      cursor: pointer;
      &.active {
        color: $active-color;
        font-weight: bold;
      }

      &:not(:last-child) {
        border-left: 1px solid white;
        & > div::before {
          left: -6px;
        }
      }
      & > div::before {
        content: '';
        display: inline-block;
        position: relative;
        border-left: 1px solid white;
        border-bottom: 1px solid white;
        top: -8px;
        left: -5px;
        height: 12px;
        width: 12px;
      }
    }
    .row {
      display: flex;
      align-items: center;
      user-select: none;

      &.clicable {
        @include click-button();
      }
    }
  }
}
</style>
