<template>
  <div class="user-edit-form">
    <div class="row">
      <div class="row-title">
        {{ $t('management.user_display_name') }}
      </div>
      <div class="row-input">
        <input ref="name" v-tooltip="nameTooltip" v-model="name">
      </div>
    </div>
    <div class="row">
      <div class="row-title">
        {{ $t('management.phone') }}
      </div>
      <div class="row-input">
        <input ref="phone" v-model="phone">
      </div>
    </div>
    <div class="row">
      <div class="row-title">
        {{ $t('management.email') }}
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
        errorType: true,
        alignLeft: true,
      },
      emailTooltip: {
        msg: this.$t('management.err_empty_email'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      name: '',
      phone: '',
      email: '',
    };
  },
  watch: {
    name() {
      if (this.name.trim() !== '') {
        this.$refs.name.dispatchEvent(new Event('tooltip-hide'));
      }
    },
    email() {
      if (this.email.trim() !== '') {
        this.$refs.email.dispatchEvent(new Event('tooltip-hide'));
      }
    },
  },
  methods: {
    validate() {
      const that = this;
      let isValid = true;
      if (that.name.trim() === '') {
        that.$refs.name.dispatchEvent(new Event('tooltip-show'));
        isValid = false;
      }
      if (that.email.trim() === '') {
        that.$refs.email.dispatchEvent(new Event('tooltip-show'));
        isValid = false;
      }
      if (!isValid) {
        return;
      }

      that.$emit('validateSuccess', {
        name: that.name,
        email: that.email,
        phone: that.phone,
      });
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
@import 'styles/variable.scss';
.user-edit-form {
  width: 465px;
  padding: 0 30px;
  @include font-14px();
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
