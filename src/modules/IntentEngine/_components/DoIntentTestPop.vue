<template>
<div id="block">
  <div class="model-select-row">
    <div class="select-label">
      {{ $t('intent_engine.side_panel.do_intent_test.select_label')}}
    </div>
    <dropdown-select
      class="model-select"
      v-model="model"
      :options="modelOptions"
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
    const modelOptions = this.extData.models.map(model => ({
      text: model.trainDatetimeStr,
      value: model.id,
    }));
    let model;
    if (this.extData.models.length > 0) {
      model = [this.extData.models[0].id];
    }
    return {
      model,
      modelOptions,
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
      console.log(this.model[0]);
      if (this.model) {
        this.$emit('validateSuccess', this.model[0]);
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