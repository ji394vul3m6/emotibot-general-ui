<template>
  <div class="dynamic-list-input">
    <div class="dynamic-input" v-for="(val, idx) in value.contents" :key="val">
      <span class="dynamic-title">{{title}}</span>
      <input maxlength="200" :data-idx="idx" v-on:change="setVal" :value="val" :disabled="readOnly">
      <div class="dynamic-button icon" v-on:click="addVal()" v-if="value.contents.length < value.contentMaxNum && idx === value.contents.length - 1">
        <div class="row"></div>
        <div class="vertical"></div>
      </div>
      <div class="dynamic-button icon" v-on:click="removeVal(idx)" v-if="value.contents.length > 0">
        <div class="row"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: {},
    },
    title: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    addVal() {
      this.value.contents.push('');
    },
    removeVal(idx) {
      if (this.value.contents.length === 1) {
        this.value.contents[0] = '';
        this.$forceUpdate();
      } else {
        this.value.contents.splice(idx, 1);
      }
    },
    setVal(event) {
      const e = event || window.event;
      const idx = e.currentTarget.dataset.idx;
      if (e && e.currentTarget) {
        this.value.contents[idx] = e.currentTarget.value;
      }
    },
    showAdd(idx) {
      return this.value.contents.length - 1 === idx;
    },
  },
  beforeUpdate() {
    if (this.value.contents && this.value.contents.length === 0) {
      this.value.contents.push('');
    }
  },
  beforeMount() {
    if (this.value.contents && this.value.contents.length === 0) {
      this.value.contents.push('');
    }
  },
};
</script>