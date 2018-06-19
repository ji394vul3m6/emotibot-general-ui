<template>
  <div id="moveto-container">
    <category-tree v-for="(child, idx) in wordbank.children" 
      v-if="child.visible && child.name !== $t('wordbank.all')"
      :treeItem="child"
      :ref="`${child.cid}-${child.name}`"
      :key="`${child.name}-${idx}`">
    </category-tree>
  </div>  
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import CategoryTree from './CategoryTree';

export default {
  components: {
    CategoryTree,
  },
  computed: {
    ...mapGetters([
      'wordbank',
      'isActiveId',
    ]),
  },
  methods: {
    ...mapMutations([
      'toggleMoveToMode',
      'storeLastCategoryStatus',
      'closeAllChild',
      'resetActiveCategory',
      'recoverLastActiveCategory',
      'resetActiveId',
    ]),
    validate() {
      if (this.isActiveId === undefined) {
        // should show error message somewhere
        return;
      }
      this.$emit('validateSuccess', this.isActiveId);
    },
  },
  mounted() {
    this.toggleMoveToMode();
    this.closeAllChild();
    this.resetActiveCategory();
    this.storeLastCategoryStatus();
    this.resetActiveId();

    this.$on('validate', this.validate);
  },
  beforeDestroy() {
    this.toggleMoveToMode();
    this.resetActiveCategory();
    this.recoverLastActiveCategory();
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable';
#moveto-container {
  height: 300px;
  width: 700px;
  margin: 0 30px;
  border: 1px solid $color-borderline;
  overflow: scroll;
}
</style>
