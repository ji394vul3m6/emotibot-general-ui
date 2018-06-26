<template lang="html">
<div id="prompt-editor-pop">
  <h1>{{$t("task_engine_v3.prompt_editor_pop.title")}}</h1>
  <div>
    <input type="checkbox" v-model="promptObj.must_retry">
    {{$t("task_engine_v3.prompt_editor_pop.set_retry_num")}}：
    <input type="number" v-model="promptObj.retry_num">
  </div>
  <div>
    <input type="checkbox" v-model="promptObj.required">
    {{$t("task_engine_v3.prompt_editor_pop.set_as_required")}}
  </div>
</div>
</template>

<script>
export default {
  name: 'prompt-editor-pop',
  components: {
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      promptObj: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    validateDate() {
      this.$emit('validateSuccess', JSON.parse(JSON.stringify(this.promptObj)));
    },
  },
  beforeMount() {},
  mounted() {
    this.promptObj = JSON.parse(JSON.stringify(this.value));
    this.$on('validate', this.validateDate);
  },
};
</script>
