<template>
<div id="block">
  <div class="model-select-row">
    <div class="select-label">
      {{ $t('intent_engine.side_panel.do_intent_test.select_label')}}
    </div>
    <dropdown-select
      class="model-select"
      :value="undefined"
      @input="onModelSelect()"
      :options="[]"
      :showCheckedIcon="true"
      width="260px"
      :inputBarStyle="optionSelectStyle"
    />
  </div>
  <div class="hint">
    {{ $t('intent_engine.side_panel.do_intent_test.hint')}}
  </div>
</div>
</template>
<script>
export default {
  props: {
    extData: {
      type: Object,
      required: true,
    },
  },
  data() {
    let model;
    if (this.extData.models.length > 0) {
      model = this.extData.models[0];
    }
    return {
      model,
      optionSelectStyle: {
        height: '28px',
        'border-radius': '2px',
      },
    };
  },
  watch: {
  },
  methods: {
    validate() {
      console.log(this.model);
      if (this.model) {
        this.$emit('validateSuccess', this.model);
      }
    },
  },
  mounted() {
    this.$on('validate', this.validate);
  },
};
</script>
<style lang="scss" scoped>

#block {
  display: flex;
  flex-direction: column;
  padding: 10px 20px 55px 20px;
  @include font-14px-line-height-28px();
  .model-select-row{
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    .select-label{
      flex: 0 0 auto;
      margin-right: 13px;
    }
    .model-select{
      flex: 0 0 auto;
    }
  }
  .hint{
    margin-top: 22px;
    flex: 0 0 auto;
    color: $color-font-mark;
  }
}
</style>