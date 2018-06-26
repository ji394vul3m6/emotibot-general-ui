<template>
  <div class="form">
    <div class="row">
      <div class="row-title">{{ $t('management.robot_name') }}</div>
      <input class="row-input" v-model="name"
        :placeholder="$t('management.input_placeholder')"
        v-tooltip="nameTooltip"
        ref="name">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.description') }}</div>
      <input class="row-input" v-model="description" maxlength=45
        :placeholder="$t('management.length_45_placeholder')">
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
      existedRobots: [],
      nameTooltip: {
        msg: '',
        eventOnly: true,
        animateShow: true,
      },
    };
  },
  methods: {
    validate() {
      const that = this;

      if (that.name === '') {
        that.nameTooltip.msg = that.$t('management.err_robot_name_empty');
        that.$refs.name.dispatchEvent(new Event('tooltip-reload'));
        that.$refs.name.dispatchEvent(new Event('tooltip-show'));
        that.$refs.name.focus();
        return;
      } else if (that.name !== that.extData.name && that.existedRobots.indexOf(that.name) >= 0) {
        that.nameTooltip.msg = that.$t('management.err_robot_duplicate');
        that.$refs.name.dispatchEvent(new Event('tooltip-reload'));
        that.$refs.name.dispatchEvent(new Event('tooltip-show'));
        that.$refs.name.focus();
        return;
      }
      that.$emit('validateSuccess', {
        name: that.name,
        description: that.description,
      });
    },
  },
  mounted() {
    const that = this;

    that.name = that.extData.name || '';
    that.description = that.extData.description || '';
    that.existedRobots = that.extData.existedRobots || [];
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
