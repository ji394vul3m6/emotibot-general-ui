<template>
  <div>
    <text-button main disabled v-if="state === 'loading'">
      <slot name="loading"></slot>
    </text-button>
    <text-button v-else-if="state === 'init' " main :disabled="disabled" @click="click">
      <slot name="init"></slot>
    </text-button>
    <text-button v-else main :disabled="disabled" @click="click">
      <slot name="finish"></slot>
    </text-button>
  </div>
</template>

<script>
export default {
  name: 'loading-button',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      state: 'init',
    };
  },
  methods: {
    click(e) {
      this.state = 'loading';
      this.$emit('click', this, e);
    },
  },
  mounted() {
    const that = this;
    that.$on('loading', () => {
      this.state = 'loading';
    });
    that.$on('finish', () => {
      this.state = 'finish';
    });
    that.$on('reset', () => {
      this.state = 'init';
    });
  },
};
</script>

