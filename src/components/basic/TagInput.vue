<template>
  <div class="tags-wrapper">
    <div class="tooltip-container" v-if="showTooltip">
      <div class="tooltip"> {{ errorWording }} </div>
    </div>
    <div class="tags-container" @click="$refs.taginput.focus()">
      <span class="tags" v-for="(tag, idx) in selectedTags" :key="tag" :data-index="idx">
        <span>{{ tag }}</span><span class="tag-remove-btn" @click="removeTag(idx)">x</span>
      </span>
      <input ref="taginput" class="tags-input" type="text" :maxlength="maxlength" :size="inputSize"
        v-model="inputTag"
        @keydown="handleKeyDown()"
        @keyup.space="addTagByInput(inputTag)"
        @keydown.delete="deleteTag($event)"
        @keydown.left="toPrevTag()"
        @keydown.right="toNextTag()"
        @keydown.up="toPrevSelect()"
        @keydown.down="toNextSelect()"
        @keydown.enter="addTagBySelector(curSelectItemIdx)"
        @compositionstart="isInputing=true"
        @compositionend="isInputing=false">
    </div>
    <div class="tags-selector" v-if="showSelector">
      <div class="tags-selector-items" v-for="(item, idx) in selectItems"
        :key="item" 
        :class="{'tags-selector-items-focus': isSelectItemFocus(idx)}"
        @click="addTagBySelector(idx)"
        @mousemove="changeSelectItemFocus(idx)">
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    origTags: {
      type: Array,
      default: () => [],
    },
    tagsList: {
      type: Array,
      default: () => [],
    },
    maxtag: {
      type: Number,
      default: Infinity,
    },
    maxlength: {
      type: Number,
      default: Infinity,
    },
    tagValidation: {
      type: Function,
      default: null,
    },
    allowTypeahead: {
      type: Boolean,
      default: false,
    },
    allowNewTag: {
      type: Boolean,
      default: true,
    },
    allowTagErrorTooltip: {
      type: Boolean,
      default: true,
    },
    tagErrorWording: {
      type: Object,
      default() {
        return {
          ExceedMaxTagWording: '已达标签个数上限',
          DuplicateTagWording: '已存在重复标签',
          InvalidTagWording: '标签格式不符',
        };
      },
    },
  },
  data() {
    return {
      inputTag: '',
      isInputing: false,
      selectedTags: [],
      errorWording: '',
      curSelectItemIdx: 0,
      showTooltip: false,
    };
  },
  computed: {
    inputSize() {
      return this.inputTag.length + 4;
    },
    showSelector() {
      return this.allowTypeahead && (this.selectItems.length > 0) && (!this.isExceedMax());
    },
    selectItems() {
      if (this.inputTag.length !== 0 && this.tagsList.length !== 0 && (!this.isExceedMax())) {
        const pattern = `.*${this.escapeRegExp(this.inputTag)}.*`;
        const tagRegex = new RegExp(pattern);
        const items = this.tagsList.filter(item =>
          item.match(tagRegex) && !this.isDuplicate(item));
        return (items !== null) ? items : [];
      }
      return [];
    },
  },
  watch: {
    selectedTags() {
      this.$emit('selectedTagsChanged', this.selectedTags);
    },
    inputTag() {
      if (this.inputTag.length > 0) {
        this.removeAllTagFocus();
      }
    },
  },
  methods: {
    handleKeyDown() {
      this.closeErrorTooltip();
    },
    clickOutside(e) {
      if (this.$el && !this.$el.contains(e.target)) {
        this.addTagByClickOutside();
      }
      return false;
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    },
    /**
     * Handle Add Tag
     * */
    addTagByInput(tag) {
      const splitTag = tag.split(/ +/);
      let tagToAdd = tag;
      let tagRemain = '';
      if (splitTag.length > 1) {
        tagToAdd = splitTag[0];
        tagRemain = splitTag[1];
      }
      const idx = this.getIdxToInsertTag();
      if (this.allowNewTag && !this.isInputing && tagToAdd !== '') {
        const errmsg = this.checkTagError(tagToAdd);
        if (errmsg === '') {
          this.closeErrorTooltip();
          this.addSelectedTag(idx, tagToAdd);
          this.addNewTag(tagToAdd);
          this.$nextTick(() => {
            this.inputTag = tagRemain;
          });
        } else {
          this.showErrorTooltip(errmsg);
          this.inputTag = tag.replace(/ /g, '');
          this.$emit('tagError', errmsg);
        }
      } else {
        this.inputTag = tag.replace(/ /g, '');
      }
    },
    addTagBySelector(selectedIdx) {
      if (this.selectItems.length !== 0) {
        const tag = this.selectItems[selectedIdx];
        const idx = this.getIdxToInsertTag();
        const errmsg = this.checkTagError(tag);
        if (errmsg === '') {
          this.closeErrorTooltip();
          this.addSelectedTag(idx, tag);
          this.addNewTag(tag);
        } else {
          this.showErrorTooltip(errmsg);
          this.$emit('tagError', errmsg);
        }
      }
    },
    addTagByClickOutside() {
      const tag = this.inputTag;
      const idx = this.getIdxToInsertTag();
      if (tag !== '' && this.allowNewTag) {
        const errmsg = this.checkTagError(tag);
        if (errmsg === '') {
          this.addSelectedTag(idx, tag);
          this.addNewTag(tag);
          this.$nextTick(() => {
            this.$refs.taginput.blur();
          });
        }
      }
      this.closeErrorTooltip();
      this.inputTag = '';
    },
    getIdxToInsertTag() {
      let nextTag;
      if (this.$refs.tagInput) {
        nextTag = this.$refs.taginput.nextElementSibling;
      }
      return nextTag ? nextTag.getAttribute('data-index') : this.selectedTags.length;
    },
    addSelectedTag(idx, tag) {
      this.selectedTags.splice(idx, 0, tag);
      this.inputTag = '';
      this.removeAllTagFocus();
      this.curSelectItemIdx = 0;
      this.$nextTick(() => {
        this.toNextTag();
      });
    },
    addNewTag(tag) {
      if (this.allowNewTag && this.tagsList.indexOf(tag) === -1) {
        this.tagsList.push(tag);
      }
    },
    /**
     * Tag Validity Checking
     * */
    checkTagError(tag) {
      let errmsg = '';
      if (this.isExceedMax()) {
        errmsg = 'ExceedMaxTag';
      } else if (!this.isValidTag(tag)) {
        errmsg = 'InvalidTag';
      } else if (this.isDuplicate(tag)) {
        errmsg = 'DuplicateTag';
      }
      return errmsg;
    },
    isDuplicate(tag) {
      return (this.selectedTags.indexOf(tag) !== -1);
    },
    isExceedMax() {
      return (this.selectedTags.length >= this.maxtag);
    },
    isValidTag(tag) {
      return (this.tagValidation) ? this.tagValidation(tag) : true;
    },
    showErrorTooltip(errmsg) {
      if (this.allowTagErrorTooltip) {
        this.showTooltip = true;
        switch (errmsg) {
          case 'ExceedMaxTag':
            this.errorWording = this.tagErrorWording.ExceedMaxTagWording;
            break;
          case 'DuplicateTag':
            this.errorWording = this.tagErrorWording.DuplicateTagWording;
            break;
          case 'InvalidTag':
            this.errorWording = this.tagErrorWording.InvalidTagWording;
            break;
          default:
            this.errorWording = '';
        }
      }
    },
    closeErrorTooltip() {
      this.showTooltip = false;
      this.errorWording = '';
    },
    /**
     * Handle Delete Tag
     * */
    removeTag(idx) {
      this.selectedTags.splice(idx, 1);
    },
    deleteTag(e) {
      if (this.inputTag.length === 0) {
        const prevTag = e.target.previousElementSibling;
        if (prevTag) {
          if (!prevTag.classList.contains('tag-focus')) {
            prevTag.classList.add('tag-focus');
          } else {
            const idx = prevTag.getAttribute('data-index');
            this.selectedTags.splice(idx, 1);
          }
        }
      }
    },
    /**
     * Handle Input Tag Behavior
     * */
    toPrevTag() {
      if (this.inputTag.length === 0 && this.selectedTags.length !== 0) {
        const inputBox = this.$refs.taginput;
        const container = inputBox.parentElement;
        const curPrevTag = inputBox.previousElementSibling;
        if (curPrevTag) {
          if (!curPrevTag.classList.contains('tag-focus')) {
            curPrevTag.classList.add('tag-focus');
          } else {
            const newPrevTag = curPrevTag.previousElementSibling;
            this.removeAllTagFocus();
            container.insertBefore(inputBox, curPrevTag);
            if (newPrevTag) {
              newPrevTag.classList.add('tag-focus');
            }
          }
        }
        inputBox.focus();
      }
    },
    toNextTag() {
      if (this.inputTag.length === 0 && this.selectedTags.length !== 0) {
        const inputBox = this.$refs.taginput;
        const container = inputBox.parentElement;
        const curNextTag = inputBox.nextElementSibling;
        this.removeAllTagFocus();
        if (curNextTag) {
          const newNextTag = curNextTag.nextElementSibling;
          curNextTag.classList.add('tag-focus');
          container.insertBefore(inputBox, newNextTag);
        }
        inputBox.focus();
      }
    },
    removeAllTagFocus() {
      const spanTags = document.querySelectorAll('.tags');
      spanTags.forEach((tag) => {
        tag.classList.remove('tag-focus');
      });
    },
    /**
     * Handle Tag Selector Behavior
     * */
    toPrevSelect() {
      if (this.curSelectItemIdx > 0) {
        this.curSelectItemIdx -= 1;
      }
    },
    toNextSelect() {
      if (this.curSelectItemIdx < this.selectItems.length - 1) {
        this.curSelectItemIdx += 1;
      }
    },
    isSelectItemFocus(idx) {
      return this.curSelectItemIdx === idx;
    },
    changeSelectItemFocus(idx) {
      this.curSelectItemIdx = idx;
    },
  },
  mounted() {
    const that = this;
    document.addEventListener('click', this.clickOutside, false);
    if (that.origTags.length > 0) {
      that.origTags.forEach((tag) => {
        that.selectedTags.push(tag);
      });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "styles/variable";
$row-height: 40px;
.tags-wrapper {
  width: 600px;
  display: inline-block;

  .tags-container {
    border: solid 1px $tag-background-color;
    background-color: #ffffff;
    height: $row-height;
    width: 100%;
    overflow: scroll;
    white-space: nowrap;

    .tags-input {
      display: inline-block;
      border: 0;
      height: $row-height;
      line-height: $row-height;
      padding: 0 5px;

      &:focus{
        outline: none;
      }
    }

    .tags {
      color: $tag-font-color;
      background-color: $tag-background-color;
      margin: 0px 3px;
      padding: 2px 5px;
      border-radius: 5px;

      &.tag-focus {
        background-color: darken($tag-background-color, 15%);
      }

      .tag-remove-btn {
        font-weight: bold;
        margin-left: 3px;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .tags-selector {
    background-color: #ffffff;
    position: absolute;
    width: inherit;
    z-index: 1;
    .tags-selector-items {
      padding: 5px 10px;
      &.tags-selector-items-focus {
        background-color: $tag-background-color;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.tooltip-container {
  position: relative;
  .tooltip {
    $tool-tip-color: #ffc0cb;
    line-height: 1em;
    background-color: $tool-tip-color; 
    color: #2c3e50;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    min-width: 50%;
    display: inline-block;
    bottom: calc(100% + 5px);

    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 15%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: $tool-tip-color transparent transparent transparent;
    }
  }
}
</style>
