<template>
<div id="page-menu">
  <div class="category" v-for="directory in menuPages" :key="directory.name">
    <div class="category-name row" @click="toPage(directory)"
      :class="{clickable: directory.path, active: directory.path === currentRoute}">
      <div class="space"></div>
      <icon class="page-icon" :icon-type="directory.icon" :size=15 />
      <div class="name">{{$t(directory.display)}}</div>
      <icon class="expand-icon" icon-type="white_expand" :size=12 />
    </div>
    <template v-if="directory.pages && directory.pages.length > 0">
      <div class="page row clickable"
        v-for="page in directory.pages"
        :key="page.name"
        :class="{active: page.path === currentRoute}"
        @click="toPage(page)">
        <div class="space"></div>
        <div class="name">
          <span>{{$t(page.display)}}</span>
        </div>
      </div>
    </template>
  </div>
</div>  
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
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
    ...mapMutations([
      'setCurrentPage',
    ]),
    toPage(page) {
      this.setCurrentPage(page);
      this.$router.push({ path: page.path });
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

$menu-line-height: 40px;
$menu-category-background: #444444;
$menu-background: $page-menu-color;
$menu-width: $page-menu-width;
$menu-font-size: 12px;
$menu-active-color: #3D80FF;

#page-menu {
  position: absolute;
  left: 0;
  top: $page-header-height;
  width: $menu-width;
  height: calc(100vh - #{$page-header-height});
  background: $menu-background;
  color: white;
  font-size: $menu-font-size;
  @include auto-overflow();

  .category {
    .row {
      display: flex;
      align-items: center;
      user-select: none;
      height: $menu-line-height;

      .space {
        flex: 0 0 40px;
      }
      .page-icon {
        flex: 0 0 15px;
        margin-left: 15px;
      }
      .name {
        flex: auto;
        margin-left: 10px;
      }
      .expand-icon {
        flex: 0 0 12px;
        margin-right: 9px;
      }

      &.active {
        background: $menu-active-color;
      }

      &.clickable {
        @include click-button();
      }

      &:not(.category-name):not(.active):hover {
        background: $menu-category-background;
      }

      &.category-name {
        background: $menu-category-background;
        justify-content: flex-end;
        .space {
          flex: 0 0 0px;
        }
      }
    }
  }
}
</style>
