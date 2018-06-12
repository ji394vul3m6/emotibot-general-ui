<template>
  <ul>
    <li>
      <div class="tree-item" ref="treeItem"
        :style="{height: curLayer <= 1 ? '36px' : '30px'}"
        :class="{'active-item': treeItem.isActive}"
        @click="setActiveItem">
        <span class="indentation" 
          :style="{ width: curLayer <= 1 ? '0' : `${15*(curLayer-1)}px`}">
        </span>
        <span class="triangle"
          :class="{'triangle-down': !treeItem.showChild,
            'triangle-up': treeItem.showChild,
            'invisible': !hasChildren,
            'active': treeItem.isActive}">
        </span>
        <div class="item-name">
          <input v-if="isNameEditing" type="text" ref="itemName" 
            v-model="itemName"
            :placeholder="$t('wordbank.placeholder_category_name')"
            @compositionstart="setCompositionState(true)"
            @compositionend="setCompositionState(false)"
            @blur="confirmEditItemName"
            @keydown.enter="detectCompositionState"
            @keyup.enter="confirmEditItemName"/>
          <span v-else class="tree-item-name">{{ treeItem.name }}</span>
        </div>
        <icon class="item-icon" icon-type="edit" :size=12 
          v-if="treeItem.editable"
          ref="editBtn"
          :class="{'invisible': !editMode}"
          @click="editItemName"/>
       </div>
      <category-tree-item 
        v-if="hasChildren && treeItem.showChild"
        v-for="(child, idx) in treeItem.children"
        :ref="`${child.cid}-${child.name}`"
        :key="`${idx}-${child.name}`"
        :treeItem="child"
        :editMode="editMode"
        :curLayer="curLayer + 1"
        @activeItemChange="handleActiveItemChange"
        @itemNameChange="handleItemNameChange"
        @confirmAddSubCategory="addSubCategory"
        @cancelAddSubCategory="cancelSubCategory"
        @setActiveToAll="handleSetActiveToAll">
      </category-tree-item>
    </li>
  </ul>
</template>
<script>
// import { mapGetters, mapMutations } from 'vuex';
// import api from '../_api/wordbank';

export default {
  name: 'category-tree-item',
  props: {
    treeItem: {
      type: Object,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    curLayer: {
      type: Number,
      default: 0,
    },
  },
  // api,
  data() {
    return {
      itemName: '',
      isNameEditing: false,
      wasCompositioning: false,
      compositionState: false,
      isNewCategory: false,
    };
  },
  computed: {
    // ...mapGetters([
    //   'wordbank',
    //   'currentCategory',
    // ]),
    hasChildren() {
      return this.treeItem.children.length > 0;
    },
  },
  methods: {
    setActiveItem() { // v
      const route = [this.treeItem.cid];
      this.$emit('activeItemChange', this.treeItem, this.curLayer, route);
      this.toggleShowChild();
    },
    handleActiveItemChange(activeItem, layer, route) {  // v
      console.log('route:', route);
      route.splice(0, 0, this.treeItem.cid);
      this.$emit('activeItemChange', activeItem, layer, route);
    },
    toggleShowChild() { // v
      this.treeItem.showChild = !this.treeItem.showChild;
    },

    // Handle Inputing
    setCompositionState(bool) { // v
      this.compositionState = bool;
    },
    detectCompositionState() {  // v
      this.wasCompositioning = this.compositionState;
    },
    editNewItemName() { // This is called by Category Card Component, don't delete it.
      this.isNewCategory = true;
      this.editItemName();
    },
    editItemName() {  // v
      this.isNameEditing = true;
      this.$nextTick(() => {
        this.$refs.itemName.focus();
      });
    },
    confirmEditItemName() { // v
      if (this.wasCompositioning) {
        return;
      }
      this.itemName = this.itemName.trim();
      if (this.isNewCategory) {
        this.confirmAddSubCategory();
        return;
      }
      // cancel edit
      if (this.itemName === '') {
        this.itemName = this.treeItem.name;
      }
      if (this.itemName === this.treeItem.name) {
        this.isNameEditing = false;
        return;
      }
      this.$emit('itemNameChange', this.treeItem, this.itemName);
    },
    editItemNameSuccess(success) { // method call by parent to inform item name change state
      if (success) {
        this.treeItem.name = this.itemName;
      } else {
        this.itemName = this.treeItem.name;
      }
      this.isNameEditing = false;
    },
    handleItemNameChange(item, itemName) {
      const isChild = this.treeItem.children.findIndex(child => child.cid === item.cid) !== -1;
      if (isChild) {
        if (this.isItemNameDuplicate(itemName)) {
          const refName = `${item.cid}-${item.name}`;
          const childRef = this.$refs[refName][0];
          childRef.cancelDuplicateNameEdit();
          return;
        }
        this.$emit('itemNameChange', item, itemName);
      } else {
        this.$emit('itemNameChange', item, itemName);
      }
    },
    isItemNameDuplicate(itemName) {
      return this.treeItem.children.findIndex(child => child.name === itemName) !== -1;
    },
    cancelDuplicateNameEdit() { // method call by parent
      // TODO: show Tooptip to warn duplicate
      const itemNameElem = this.$refs.itemName;
      this.itemName = '';
      itemNameElem.focus();
    },
    confirmAddSubCategory() {
      if (this.itemName === '') {
        this.$emit('cancelAddSubCategory');
        this.isNameEditing = false;
        return;
      }
      if (this.itemName === this.treeItem.name) return;  // avoid trigger by both enter and focus;

      if (this.isItemNameDuplicate()) {
        const itemNameElem = this.$refs.itemName;
        this.itemName = '';
        itemNameElem.focus();
        return;
      }
      this.$emit('confirmAddSubCategory', this.itemName);
      this.treeItem.name = this.itemName;
      this.isNameEditing = false;
    },
    addSubCategory(name) {
      this.$api.addCategory(this.currentCategory.cid, name, this.currentCategory.layer + 1)
      .then((category) => {
        this.resetActiveCategory();
        this.addToCurrentCategory(category);
      });
    },
    cancelSubCategory() {
      this.resetActiveCategory();
      this.cancelAddFromCurrentCategory();
    },
    deleteCategorySuccess(success, idToDel) {  // method call by parent
      if (success) {
        const idxToDel = this.treeItem.children.findIndex(child => child.id === idToDel);
        this.treeItem.children.splice(idxToDel);
        // back to all
        this.$emit('setActiveToAll');
      }
    },
    handleSetActiveToAll() {
      this.$emit('setActiveToAll');
    },
  },
  mounted() {
    this.itemName = this.treeItem.name;
  },
};
</script>
<style lang="scss" scoped>
  @import './styles/variable';
  $color-category:  #6b9de3;
  ul {
    padding: 0px;
  }
  li {
    @include font-12px();
    list-style: none;
    text-decoration: none;
    display: flex;
    flex-direction: column;

    .tree-item {
      box-sizing: border-box;
      flex: 0 0 auto;
      padding: 10px 8px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid $color-borderline;
      cursor: pointer;

      &.active-item {
        background: $color-category;
        color: $color-white;
      }

      .indentation {
        flex: 0 0 auto;
      }
      .triangle {
        flex: 0 0 auto;
      }
      .item-name {
        flex: 1 1 auto;
        padding: 0 5px;
        position: relative;
        display:flex;
        align-items: center;

        .tree-item-name {
          display: inline-block;
          position: absolute;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .item-icon {
        flex: 0 0 12px;
      }
    }
  }

  .triangle-up {
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid $color-icon;
    &.active {
      border-bottom: 5px solid $color-white;
    }
  }
  .triangle-down {
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid $color-icon;
    &.active {
      border-top: 5px solid $color-white;
    }
  }
  .invisible {
    visibility: hidden;
  }

  input[type=text] {
    background: $color-category;
    border: 0px;
    color: $color-white;
    padding: 0px;
    width: calc(100% - 10px);
    &:focus {
      outline: none;
      border: 0px;
      box-shadow: 0 0 0 $color-white;
    }
  }
</style>
