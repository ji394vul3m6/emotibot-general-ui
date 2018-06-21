<template>
  <div id="moveto-container" ref="moveToContainer" v-tooltip="warnTooltip">
    <category-card ref="categoryCard" id="card-category"
      :maxLayer="1"
      :categoryTree="categoryTree"
      :activeItemId="activeItemId"
      :allowSubCategory="false"
      :canEdit="false"
      :canDelete="false"
      :canCreate="false"
      :selectOnly="true"
      @activeItemChange="handleActiveItemChange"
      >
    </category-card>
  </div>
</template>
<script>

import CategoryCard from '@/components/CategoryCard';

export default {
  components: {
    CategoryCard,
  },
  props: {
    value: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      categoryTree: {},
      activeItemId: undefined,
      warnTooltip: {
        msg: this.$t('robot_command.movetopop.tooltip'),
        eventOnly: true,
      },
    };
  },
  methods: {
    handleActiveItemChange(activeItem) {
      this.activeItemId = activeItem.cid;
      const event = new Event('tooltip-hide');
      this.$refs.moveToContainer.dispatchEvent(event);
    },
    validate() {
      if (this.activeItemId !== undefined) {
        this.$emit('validateSuccess', this.activeItemId);
      } else {
        const event = new Event('tooltip-show');
        this.$refs.moveToContainer.dispatchEvent(event);
      }
    },
  },
  mounted() {
    this.categoryTree = {
      children: [],
      cid: -1,
      name: '',
    };
    // copy the category tree by for each cause there's only one layer
    this.value.categoryTree.children.forEach((child) => {
      this.categoryTree.children.push({
        isActive: false,
        name: child.name,
        cid: child.cid,
        children: [],
        deletable: child.deletable,
        editable: child.editable,
        layer: child.layer,
        showChild: child.showChild,
        visible: true,
      });
    });
    this.$on('validate', this.validate);
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

