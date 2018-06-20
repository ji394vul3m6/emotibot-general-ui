<template>
  <div id="robot-command">
    <category-card ref="categoryCard" id="card-category" class="card h-fill"
      :maxLayer="4"
      :categoryTree="categoryTree"
      :activeItemId="activeItemId"
      :allowSubCategory="false"
      :canEdit="canEdit"
      :canDelete="canDelete"
      :canCreate="canCreate"
      @editModeChange="handleEditModeChange"
      @activeItemChange="handleActiveItemChange"
      @itemNameChange="handleItemNameChange"
      @deleteCategory="handleDeleteCategory"
      @addCategory="handleAddCategory">
    </category-card>
    <robot-command-content 
      id="card-content" class="card h-fill"
      :isEditMode="isEditMode"
      :value="currentCategory.cmds"
      :currentCategoryId="currentCategory.cid"
      :canEdit="canEdit"
      :canDelete="canDelete"
      :canCreate="canCreate">
    </robot-command-content>
  </div>
</template>

<script>
import CategoryCard from '@/components/CategoryCard';
import api from './_api/command';
import RobotCommandContent from './_components/RobotCommandContent';

export default {
  path: 'robot-command',
  privCode: 'robot_command',
  displayNameKey: 'robot_command',
  icon: 'white_chat',
  name: 'robot-command',
  api,
  components: {
    CategoryCard,
    RobotCommandContent,
  },
  data() {
    return {
      categoryTree: {},
      currentCategory: {},
      isEditMode: false,
      activeItemId: 1,
    };
  },
  computed: {
    canEdit() {
      return this.$hasRight('edit');
    },
    canDelete() {
      return this.$hasRight('delete');
    },
    canCreate() {
      return this.$hasRight('create');
    },
  },
  methods: {
    handleEditModeChange(editMode) {
      console.log('editMode:', editMode);
      this.isEditMode = editMode;
      // block some actions outside
    },
    handleActiveItemChange(activeItem) {
      console.log('activeItem', activeItem);
      // change other display
    },
    handleItemNameChange(item, itemName) {
      console.log('item name change:', item.cid, itemName);
      // call come api then
      // this.$api.updateCategory(item.cid, itemName)
      // .then(() => {
      //   this.$refs.categoryCard.editItemNameSuccess(true);
      // })
      // .catch(() => {
      //   this.$notifyFail(this.$t('wordbank.error.edit_category_name_fail'));
      //   this.$refs.categoryCard.editItemNameSuccess(false);
      // })
      this.$refs.categoryCard.editItemNameSuccess(true);
    },
    handleDeleteCategory(category) {
      const cid = category.cid;
      console.log('delete:', cid);
      // this.$api.deleteWordbankCategory(cid)
      // .then(() => {
      //   this.$refs.categoryCard.deleteCategorySuccess(true);
      // })
      // .catch(() => {
      //   this.$notifyFail(this.$t('delete_category_fail'));
      //   this.$refs.categoryCard.deleteCategorySuccess(false);
      // });
      this.$refs.categoryCard.deleteCategorySuccess(true);
    },
    handleAddCategory(pid, newName, layer) {
      // this.$api.addCategory(pid, newName, layer)
      // .then((category) => {
      //   this.$refs.categoryCard.addCategorySuccess(true, category);
      //   this.$nextTick(() => {
      //     const categoryContentBlock = this.$refs.cardCategoryContent;
      //     categoryContentBlock.scrollTop = categoryContentBlock.scrollHeight;
      //   });
      // })
      // .catch(() => {
      //   this.$notifyFail(this.$t('wordbank.error.add_category_fail'));
      //   this.$refs.categoryCard.addCategorySuccess(false);
      // });
      console.log(pid, newName, layer);
      const fakeCategory = {
        children: [],
        deletable: true,
        layer,
        showChild: false,
        isActive: true,
        name: newName,
        id: Math.floor(Math.random() * Math.floor(1000)),
      };
      if (layer === 1) {
        fakeCategory.visible = true;
      }
      this.$refs.categoryCard.addCategorySuccess(true, fakeCategory);
    },
    setCategoryTree(tree) {
      this.categoryTree = tree;
    },
    setCurrentCategory(category) {
      this.currentCategory = category;
      this.currentCategory.isActive = true;
    },
    loadCommands() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getRobotCommands()
        .then((data) => {
          console.log(data);
          that.setCategoryTree(data);
          that.setCurrentCategory(data.children[0]);
          data.children[0].isActive = true;
        })
        .catch((err) => {
          console.log(err);
          that.$notifyFail(this.$t('robot_command.error.load_commands_fail'));
        })
        .finally(() => {
          that.$emit('endLoading');
        });
    },
  },
  mounted() {
    this.loadCommands();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable';
#robot-command {
  display: flex;
  #card-category {
    flex: 0 0 200px;
  }
  #card-content {
    flex: 1;
    margin-left: 20px;
  }
}
</style>
