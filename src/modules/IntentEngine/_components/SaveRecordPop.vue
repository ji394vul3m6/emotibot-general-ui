<template>
<div id="block">
  <div class="input-row">
    <div class="input-label">
      {{ $t('general.name')}}
    </div>
    <input classtype="text" v-model="recordName"
      :placeholder="$t('intent_engine.test_records.save_record_pop.enter_record_name')"/>
  </div>
</div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      recordName: '',
    };
  },
  watch: {
    recordName() {
      if (this.recordName !== '') {
        this.$emit('enableOK');
      } else {
        this.$emit('disableOK');
      }
    },
  },
  methods: {
    validate() {
      if (this.recordName) {
        this.$emit('validateSuccess', this.recordName);
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
  padding: 10px 20px 105px 20px;
  .input-row{
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    @include font-14px-line-height-28px();
    input{
      width: 400px;
      margin-left: 10px;
    }
  }
 
}
</style>