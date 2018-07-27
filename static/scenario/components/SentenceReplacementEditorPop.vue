<template lang="html">
<div id="sentence-replacement-editor-pop" class="sentence-replacement-editor-pop">
  <h1 class="header-title">{{$t("sentence-replacement-editor-pop.title")}}</h1>
  <div class="pattern-text-container">
    <div class="pattern_column">{{$t("sentence-replacement-editor-pop.pattern")}}</div>
    <div class="text_column">{{$t("sentence-replacement-editor-pop.text")}}</div>
  </div>
  <div v-for="(re_parser, index) in re_parsers" :key="index">
    <div class="pattern-text-container">
      <div class="pattern_column">
        <input type="text" class="no_border full_width"
          :placeholder="$t('sentence-replacement-editor-pop.pattern_placeholder')"
          v-model="re_parser.pattern"
        >
      </div>
      <div class="text_column">
        <input type="text" class="no_border full_width"
          :placeholder="$t('sentence-replacement-editor-pop.text_placeholder')"
          v-model="re_parser.text"
        >
      </div>
      <div class="delete-button" @click="deleteREParser(index)">X</div>
    </div>
  </div>
  <button class="btn-basic"
    @click="addREParser"
  >{{$t("sentence-replacement-editor-pop.add_replacement_rule")}}</button>
</div>
</template>

<script>
export default {
  name: 'sentence-replacement-editor-pop',
  components: {
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      re_parsers: [],
    }
  },
  computed: {},
  watch: {},
  methods: {
    addREParser(){
      this.re_parsers.push({"pattern":"","text":""});
    },
    deleteREParser(index){
      this.re_parsers.splice(index, 1);
    },
    validateDate(){
      this.$emit('validateSuccess', JSON.parse(JSON.stringify(this.re_parsers)));
    },
  },
  beforeMount() {},
  mounted() {
    const obj = JSON.parse(JSON.stringify(this.value));
    this.re_parsers = obj.re_parsers;
    this.$on('validate', this.validateDate);
  },
}
</script>

<style lang="scss">
.sentence-replacement-editor-pop{
  .pattern-text-container{
    border: 1px solid #e4eaec;
    width: 100%;
    display:flex;
    flex-direction: row;
    .pattern_column{
      flex:1;
      display:flex;
      flex-direction: row;
    }
    .text_column{
      flex:1;
      display:flex;
      flex-direction: row;
    }
    .delete-button{
      flex:0.2;
    }
  }
  .full_width{
    width:100%;
  }
  .no_border{
    border:none;
  }
}
</style>