<template lang="html">
<div id="create-skill-pop">
  <div class="create-skill-title">
    <div>{{$t('task_engine_v3.create_skill_pop.label_create_new_skill')}}</div>
  </div>
  <div class="create-skill-box">
    <div class="skill-name-container">
      <div class="input-label">{{$t("task_engine_v3.create_skill_pop.label_name_the_skill")}}</div>
      <input v-model="skillName" :placeholder="$t('task_engine_v3.create_skill_pop.placeholder_enter_skill_name')"></input>
    </div>
  </div>
</div>
</template>

<script>
import i18nUtils from '../utils/i18nUtil';
import general from '../utils/general';

export default {
  name: 'create-skill-pop',
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
      i18n: {},
      skillName: this.value.skillName,
    };
  },
  computed: {},
  watch: {},
  methods: {
    validate() {
      if (this.skillName == '') {
        general.popErrorWindow(this,
          this.i18n.task_engine_v3.error_msg.please_enter_the_skill_name,
          '',
          '30%',
          '10%',
        );
      } else {
        this.$emit('validateSuccess', this.skillName);
      }
    },
  },
  beforeMount() {},
  mounted() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    this.$on('validate', this.validate);
  },
};
</script>
