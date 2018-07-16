<template>
  <div class="form">
    <div class="row">
      <div class="row-title">{{ $t('management.enterprise_name') }}</div>
      <input class="row-input" v-model="name"
        :placeholder="$t('management.input_placeholder')"
        v-tooltip="nameTooltip"
        maxlength=50
        ref="name">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.enterprise_description') }}</div>
      <input class="row-input long" v-model="description" maxlength=45
        :placeholder="$t('management.length_45_placeholder')">
    </div>
    <div class="row">
      <div class="row-title part">{{ $t('management.module_list') }}</div>
    </div>
    <div class="row multi-line">
      <div v-for="(mod, idx) in modules" :key="idx" class="module">
        <input type="checkbox" v-model="mod.checked">
        <div class="module-name">{{ $t(`privileges.modules.${mod.code}`) }}</div>
        <icon icon-type="help" :size=15 v-if="mod.description && mod.description !== ''"
         v-tooltip="{msg: mod.description}" />
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'enterprise-edit-form',
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
      existedEnterprises: [],
      modules: [],

      nameTooltip: this.genErrTooltip(),
    };
  },
  watch: {
    name() {
      if (this.name.trim() !== '') {
        this.$refs.name.dispatchEvent(new Event('tooltip-hide'));
      }
    },
  },
  methods: {
    genErrTooltip() {
      return {
        msg: '',
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        animateShow: true,
      };
    },
    showUpdatedTooltip(context, tooltip, msg) {
      tooltip.msg = msg;
      const triggerObj = context.$el ? context.$el : context;

      triggerObj.focus();
      this.$nextTick(() => {
        triggerObj.dispatchEvent(new Event('tooltip-reload'));
        triggerObj.dispatchEvent(new Event('tooltip-show'));
      });
    },
    validate() {
      const that = this;
      that.name = that.name.trim();
      if (that.name === '') {
        that.showUpdatedTooltip(that.$refs.name, that.nameTooltip, that.$t('management.err_enterprise_name_empty'));
        return;
      } else if (that.name !== that.extData.name &&
        that.existedEnterprises.indexOf(that.name) >= 0) {
        that.showUpdatedTooltip(that.$refs.name, that.nameTooltip, that.$t('management.err_enterprise_duplicate'));
        return;
      }

      that.$emit('validateSuccess', {
        name: that.name,
        description: that.description,
        modules: that.modules.filter(mod => mod.checked).map(mod => mod.code),
      });
    },
  },
  mounted() {
    const that = this;

    that.name = that.extData.name || '';
    that.description = that.extData.description || '';
    that.modules = that.extData.modules || [];
    that.existedEnterprises = that.extData.existedEnterprises || [];
    that.$on('validate', that.validate);

    const modMap = {};
    that.modules.forEach((mod) => {
      modMap[mod.code] = mod;
    });
    if (that.extData.checkedModules.length >= 0) {
      that.extData.checkedModules.forEach((mod) => {
        if (modMap[mod.code]) {
          modMap[mod.code].checked = true;
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
@mixin module() {
  .module {
    flex: 0 0 140px;

    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .module-name {
      margin-left: 5px;
      margin-right: 7px;
    }
  }
}

.form {
  width: 700px;
  padding: 0 30px;
  color: #666666;
  @include font-14px();

  display: flex;
  flex-direction: column;
  .row {
    margin-bottom: 10px;

    display: flex;
    align-items: center;
    &.multi-line {
      flex-wrap: wrap;
      align-content: flex-start;

      @include module();
    }
    &.splitter {
      flex: 0 0 1px;
      box-shadow: inset 0 1px 0 0 #e9e9e9;
    }
    .row-title {
      flex: 0 0 100px;
      &:not(.part):after {
        content: '：'
      }
      .required {
        display: inline-block;
        width: 14px;
        color: $color-primary;
      }
    }
    .row-input {
      flex: 0 0 240px;
      display: flex;
      &.long {
        flex: 0 0 540px;
      }
    }
  }
}
</style>
