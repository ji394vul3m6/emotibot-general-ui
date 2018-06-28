<template>
  <div class="user-edit-form">
    <div class="row">
      <div class="row-title">
        {{ $t('management.user_display_name') }}：
      </div>
      <div class="row-input">
        <input ref="name" v-tooltip="nameTooltip" v-model="name">
      </div>
    </div>
    <div class="row">
      <div class="row-title">
        {{ $t('management.phone') }}：
      </div>
      <div class="row-input">
        <input ref="phone" v-model="phone">
      </div>
    </div>
    <div class="row">
      <div class="row-title">
        {{ $t('management.email') }}：
      </div>
      <div class="row-input">
        <input ref="email" v-tooltip="emailTooltip" v-model="email">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    extData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      nameTooltip: {
        msg: this.$t('management.err_empty_display_name'),
        eventOnly: true,
        animateShow: true,
      },
      emailTooltip: {
        msg: this.$t('management.err_empty_email'),
        eventOnly: true,
        animateShow: true,
      },
      name: '',
      phone: '',
      email: '',
    };
  },
  methods: {
    validate() {
      const that = this;
      if (that.name.trim() === '') {
        that.$refs.name.dispatchEvent(new Event('tooltip-show'));
      } else if (that.email.trim() === '') {
        that.$refs.email.dispatchEvent(new Event('tooltip-show'));
      } else {
        that.$emit('validateSuccess', {
          name: that.name,
          email: that.email,
          phone: that.phone,
        });
      }
    },
  },
  mounted() {
    this.name = this.extData.display_name || '';
    this.phone = this.extData.phone || '';
    this.email = this.extData.email || '';
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
.user-edit-form {
  width: 465px;
  padding: 0 30px;

  display: flex;
  flex-direction: column;

  .row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .row-title {
      flex: 0 0 80px;
      overflow: hidden;
    }
    .row-input {
      flex: 1;
      input {
        display: block;
        width: 100%;
      }
    }
  }
}
</style>
