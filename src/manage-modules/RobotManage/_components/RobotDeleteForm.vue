<template>
  <div class="form">
    <div class="row">
      <div class="row-title">{{ $t('management.input_personal_pass') }}</div>
      <input class="row-input" v-model="name"
        :placeholder="$t('management.input_placeholder')">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.reason_description') }}</div>
      <input class="row-input" v-model="description"
        :placeholder="$t('management.length_50_placeholder')">
    </div>
  </div>  
</template>

<script>
export default {
  name: 'robot-add-form',
  props: {
    extData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      name: '',
      description: '',
    };
  },
  methods: {
    validate() {
      const that = this;

      if (that.name === '') {
        console.log('err');
      } else {
        that.$emit('validateSuccess', {
          name: that.name,
          description: that.description,
        });
      }
    },
  },
  mounted() {
    const that = this;

    that.name = that.extData.name || '';
    that.description = that.extData.description || '';
    that.$on('validate', that.validate);
  },
};
</script>

<style lang="scss" scoped>
.form {
  width: 400px;
  padding: 0 30px;

  display: flex;
  flex-direction: column;
  .row {
    margin-bottom: 10px;

    display: flex;
    align-items: center;
    .row-title {
      flex: 0 0 80px;
      &:after {
        content: '：'
      }
    }
    .row-input {
      flex: 1;
      display: flex;
      padding: 5px 8px;
    }
  }
}
</style>
